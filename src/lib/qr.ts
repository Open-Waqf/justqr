// qr.ts: the QR code itself, as a grid of dark and light squares ("modules").
//
// The `qrcode` package (MIT) only does the encoding. Drawing is ours (render.ts), so the
// preview, PNG, SVG, print and history thumbnails all come from one tested path.
import QRCode from 'qrcode';

/** Error correction: how much of the code can be damaged or covered and still scan. */
export type Ec = 'L' | 'M' | 'Q' | 'H';
export const EC_LEVELS: readonly Ec[] = ['L', 'M', 'Q', 'H'];

/**
 * Most bytes the largest code (version 40) holds in byte mode, per error correction level.
 * Numbers and plain capitals fit more (the encoder picks the best mode), so this is a safe
 * lower bound used for the "almost full" hint. The real limit is the encoder's.
 */
export const MAX_BYTES: Record<Ec, number> = {L: 2953, M: 2331, Q: 1663, H: 1273};

export interface Matrix {
    /** Modules per side (21 for version 1, up to 177 for version 40). */
    size: number;
    version: number;
    /** size * size values, row by row: 1 dark, 0 light. */
    data: Uint8Array;
}

export class TooLongError extends Error {
    constructor() {
        super('Too much text for one QR code');
        this.name = 'TooLongError';
    }
}

export function byteLength(text: string): number {
    return new TextEncoder().encode(text).length;
}

export function makeMatrix(text: string, ec: Ec): Matrix {
    if (!text) throw new Error('Nothing to encode');
    let qr: ReturnType<typeof QRCode.create>;
    try {
        qr = QRCode.create(text, {errorCorrectionLevel: ec});
    } catch (e) {
        if (/too big|amount of data/i.test(String((e as Error)?.message))) throw new TooLongError();
        throw e;
    }
    const size = qr.modules.size;
    const data = new Uint8Array(size * size);
    for (let i = 0; i < data.length; i++) data[i] = qr.modules.data[i] ? 1 : 0;
    return {size, version: qr.version, data};
}

export const isDark = (m: Matrix, x: number, y: number): boolean => m.data[y * m.size + x] === 1;
