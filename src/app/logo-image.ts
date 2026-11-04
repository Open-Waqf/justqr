// logo-image.ts: turns the picture the user picked into a small PNG for the middle of the code.
//
// The picture is redrawn at most 256 px wide: this keeps saved SVG files and history small,
// and drops everything else in the file (camera details, location). It never leaves the device.
const MAX_SIDE = 256;

export class LogoError extends Error {}

export async function readLogo(file: Blob): Promise<string> {
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;
        try {
            await img.decode();
        } catch {
            throw new LogoError('Not an image');
        }
        const w = img.naturalWidth || MAX_SIDE;
        const h = img.naturalHeight || MAX_SIDE;
        const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(w * scale));
        canvas.height = Math.max(1, Math.round(h * scale));
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/png');
    } finally {
        URL.revokeObjectURL(url);
    }
}

/** Loads a logo data URL as an image, to draw it on the PNG. */
export async function logoImage(href: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = href;
    await img.decode();
    return img;
}
