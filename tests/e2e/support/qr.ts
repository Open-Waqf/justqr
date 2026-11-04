// qr.ts: reads the QR code the app shows, the way a phone would: from the pixels.
import type {Locator} from '@playwright/test';
import jsQR from 'jsqr';

/** Draws the image on a canvas inside the page and decodes the pixels with jsQR. */
export async function readCode(img: Locator, size = 400): Promise<string | null> {
    const base64 = await img.evaluate(async (el: HTMLImageElement, px: number) => {
        await el.decode();
        const canvas = document.createElement('canvas');
        canvas.width = px;
        canvas.height = px;
        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(el, 0, 0, px, px);
        // Raw RGBA bytes as base64: much faster to pass out of the page than a number array.
        const bytes = ctx.getImageData(0, 0, px, px).data;
        let binary = '';
        for (let i = 0; i < bytes.length; i += 0x8000) {
            binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        }
        return btoa(binary);
    }, size);
    const pixels = new Uint8ClampedArray(Buffer.from(base64, 'base64'));
    return jsQR(pixels, size, size)?.data ?? null;
}
