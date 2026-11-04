// render.ts: draws a Matrix. One path for everything the user sees or saves:
//   toSvg     the SVG file, and the on-screen preview
//   toPixels  the PNG file (put on a canvas, then the logo is drawn into logoBox)
// The tests decode both outputs with two independent decoders.
import {parseHex} from './contrast';
import {isDark, type Matrix} from './qr';

export interface CodeStyle {
    /** Code colour, "#rrggbb". */
    fg: string;
    /** Background colour, "#rrggbb". */
    bg: string;
    /** Quiet zone around the code, in modules. The standard asks for 4. */
    margin: number;
}

export const DEFAULT_STYLE: CodeStyle = {fg: '#000000', bg: '#ffffff', margin: 4};

/** Logo width as a share of the code width (margin not counted). */
export const LOGO_MIN = 0.1;
export const LOGO_MAX = 0.3;
/** Above this the app warns that some phones may not scan the code. */
export const LOGO_WARN = 0.25;
export const LOGO_DEFAULT = 0.2;

export interface Box {
    x: number;
    y: number;
    size: number;
}

/**
 * The square cleared for a logo, in modules, counted from the code's top left corner
 * (margin not included). Snapped to whole modules and centred.
 */
export function logoBox(m: Matrix, ratio: number): Box {
    const r = Math.min(Math.max(ratio, LOGO_MIN), LOGO_MAX);
    let size = Math.round(m.size * r);
    // Same parity as the code, so the box sits exactly in the middle.
    if ((m.size - size) % 2 !== 0) size += 1;
    const x = (m.size - size) / 2;
    return {x, y: x, size};
}

/** One SVG path for all dark modules, one rectangle per run of dark modules in a row. */
export function svgPath(m: Matrix, margin: number, skip?: Box): string {
    const inBox = (x: number, y: number) =>
        !!skip && x >= skip.x && x < skip.x + skip.size && y >= skip.y && y < skip.y + skip.size;
    let d = '';
    for (let y = 0; y < m.size; y++) {
        let x = 0;
        while (x < m.size) {
            if (!isDark(m, x, y) || inBox(x, y)) {
                x++;
                continue;
            }
            const start = x;
            while (x < m.size && isDark(m, x, y) && !inBox(x, y)) x++;
            d += `M${start + margin} ${y + margin}h${x - start}v1h${start - x}z`;
        }
    }
    return d;
}

export interface Logo {
    /** A data: URL of the image (it stays on the device). */
    href: string;
    ratio: number;
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** A complete SVG file. `px` sets width and height; the drawing scales without blur. */
export function toSvg(m: Matrix, style: CodeStyle, px: number, logo?: Logo): string {
    const total = m.size + 2 * style.margin;
    const box = logo ? logoBox(m, logo.ratio) : undefined;
    const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${px}" height="${px}" shape-rendering="crispEdges">`,
        `<rect width="${total}" height="${total}" fill="${style.bg}"/>`,
        `<path fill="${style.fg}" d="${svgPath(m, style.margin, box)}"/>`,
    ];
    if (logo && box) {
        const inset = 0.5;
        parts.push(
            `<image href="${escapeAttr(logo.href)}" x="${box.x + style.margin + inset}" y="${box.y + style.margin + inset}" ` +
                `width="${box.size - 2 * inset}" height="${box.size - 2 * inset}" preserveAspectRatio="xMidYMid meet"/>`,
        );
    }
    parts.push('</svg>');
    return parts.join('');
}

/** Whole pixels per module for a wanted image size, at least 1. */
export function scaleFor(m: Matrix, margin: number, px: number): number {
    return Math.max(1, Math.round(px / (m.size + 2 * margin)));
}

export interface Pixels {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}

/**
 * RGBA pixels of the code, `scale` pixels per module. The logo box (if any) is left in the
 * background colour; the caller draws the logo image into it (see logoRect).
 */
export function toPixels(m: Matrix, style: CodeStyle, scale: number, logoRatio?: number): Pixels {
    const total = m.size + 2 * style.margin;
    const width = total * scale;
    const data = new Uint8ClampedArray(width * width * 4);
    const [br, bgc, bb] = parseHex(style.bg);
    const [fr, fgc, fb] = parseHex(style.fg);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = br;
        data[i + 1] = bgc;
        data[i + 2] = bb;
        data[i + 3] = 255;
    }
    const box = logoRatio ? logoBox(m, logoRatio) : undefined;
    for (let y = 0; y < m.size; y++) {
        for (let x = 0; x < m.size; x++) {
            if (!isDark(m, x, y)) continue;
            if (box && x >= box.x && x < box.x + box.size && y >= box.y && y < box.y + box.size) continue;
            for (let dy = 0; dy < scale; dy++) {
                let i = (((y + style.margin) * scale + dy) * width + (x + style.margin) * scale) * 4;
                for (let dx = 0; dx < scale; dx++, i += 4) {
                    data[i] = fr;
                    data[i + 1] = fgc;
                    data[i + 2] = fb;
                }
            }
        }
    }
    return {data, width, height: width};
}

/** Where to draw the logo image on the PNG, in pixels (inside the cleared box). */
export function logoRect(m: Matrix, style: CodeStyle, scale: number, ratio: number): Box {
    const box = logoBox(m, ratio);
    const inset = Math.round(scale / 2);
    return {
        x: (box.x + style.margin) * scale + inset,
        y: (box.y + style.margin) * scale + inset,
        size: box.size * scale - 2 * inset,
    };
}
