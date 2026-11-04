// exporter.ts: turns the code on screen into files and hands them to the user.
//
// Web: download, Web Share (phones), clipboard, print.
// The Android app (Capacitor) gets its own share and save in a later step; the files made
// here (pngBlob, svgText) stay the same.
import type {CodeType} from '../lib/payload';
import type {Matrix} from '../lib/qr';
import {type CodeStyle, type Logo, logoRect, scaleFor, toPixels, toSvg} from '../lib/render';
import {logoImage} from './logo-image';

export interface ExportCode {
    matrix: Matrix;
    style: CodeStyle;
    type: CodeType;
    payload: string;
    /** Wanted image width in pixels. */
    px: number;
    logo: Logo | null;
}

/** "just-qr-wifi-2026-11-04" */
export function baseName(type: CodeType, date = new Date()): string {
    const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) =>
        String(n).padStart(2, '0'),
    );
    return `just-qr-${type}-${day.join('-')}`;
}

export function svgText(code: ExportCode): string {
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toSvg(code.matrix, code.style, code.px, code.logo ?? undefined)}\n`;
}

export async function pngBlob(code: ExportCode): Promise<Blob> {
    const scale = scaleFor(code.matrix, code.style.margin, code.px);
    const pixels = toPixels(code.matrix, code.style, scale, code.logo?.ratio);
    const canvas = document.createElement('canvas');
    canvas.width = pixels.width;
    canvas.height = pixels.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas');
    ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height), 0, 0);
    if (code.logo) {
        // The logo keeps its shape and fits inside the square cleared for it.
        const img = await logoImage(code.logo.href);
        const box = logoRect(code.matrix, code.style, scale, code.logo.ratio);
        const fit = Math.min(box.size / img.naturalWidth, box.size / img.naturalHeight);
        const w = img.naturalWidth * fit;
        const h = img.naturalHeight * fit;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, box.x + (box.size - w) / 2, box.y + (box.size - h) / 2, w, h);
    }
    return new Promise((done, fail) =>
        canvas.toBlob((blob) => (blob ? done(blob) : fail(new Error('PNG failed'))), 'image/png'),
    );
}

function download(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function savePng(code: ExportCode): Promise<void> {
    download(await pngBlob(code), `${baseName(code.type)}.png`);
}

export function saveSvg(code: ExportCode): void {
    download(new Blob([svgText(code)], {type: 'image/svg+xml'}), `${baseName(code.type)}.svg`);
}

/** True when this browser can share an image file (most phones; not most desktops). */
export function canShareFiles(): boolean {
    try {
        const probe = new File([new Uint8Array(1)], 'probe.png', {type: 'image/png'});
        return typeof navigator.share === 'function' && !!navigator.canShare?.({files: [probe]});
    } catch {
        return false;
    }
}

/** Opens the phone's share sheet with the PNG. Returns false if the user closed it. */
export async function share(code: ExportCode): Promise<boolean> {
    const file = new File([await pngBlob(code)], `${baseName(code.type)}.png`, {type: 'image/png'});
    try {
        await navigator.share({files: [file]});
        return true;
    } catch (e) {
        if ((e as Error)?.name === 'AbortError') return false;
        throw e;
    }
}

/** Copies the image. Where images cannot be copied, copies the text inside the code. */
export async function copy(code: ExportCode): Promise<'image' | 'text'> {
    try {
        if (typeof ClipboardItem === 'undefined') throw new Error('No ClipboardItem');
        await navigator.clipboard.write([new ClipboardItem({'image/png': pngBlob(code)})]);
        return 'image';
    } catch {
        await navigator.clipboard.writeText(code.payload);
        return 'text';
    }
}

/** Prints the code alone, centred, 8 cm wide (index.html styles #print-area). */
export function print(code: ExportCode): void {
    let area = document.getElementById('print-area');
    if (!area) {
        area = document.createElement('div');
        area.id = 'print-area';
        document.body.append(area);
    }
    const img = document.createElement('img');
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText(code))}`;
    img.alt = '';
    area.replaceChildren(img);
    img.decode().finally(() => window.print());
}
