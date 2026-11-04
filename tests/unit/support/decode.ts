// decode.ts: reads QR codes back with two decoders that share no code with the encoder:
// jsQR (Apache-2.0) and ZXing C++ compiled to WebAssembly (zxing-wasm, MIT).
// The WebAssembly file is read from node_modules, never downloaded.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import jsQR from 'jsqr';
import {prepareZXingModule, readBarcodes} from 'zxing-wasm/reader';
import type {Pixels} from '../../../src/lib/render';

const require = createRequire(import.meta.url);
const wasm = fs.readFileSync(require.resolve('zxing-wasm/reader/zxing_reader.wasm'));
prepareZXingModule({
    overrides: {wasmBinary: wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength)},
});

export function decodeJsqr(p: Pixels): string | null {
    return jsQR(p.data, p.width, p.height, {inversionAttempts: 'attemptBoth'})?.data ?? null;
}

export async function decodeZxing(p: Pixels): Promise<string | null> {
    const results = await readBarcodes(
        {data: p.data, width: p.width, height: p.height, colorSpace: 'srgb'} as ImageData,
        {formats: ['QRCode'], tryInvert: true},
    );
    return results.find((r) => r.isValid)?.text ?? null;
}

/** Both decoders' answers. */
export async function decodeBoth(p: Pixels): Promise<{jsqr: string | null; zxing: string | null}> {
    return {jsqr: decodeJsqr(p), zxing: await decodeZxing(p)};
}

/** Paints a solid square into the pixels (stands in for a logo drawn over the code). */
export function paint(p: Pixels, x: number, y: number, size: number, rgb: [number, number, number]) {
    for (let yy = y; yy < y + size; yy++) {
        for (let xx = x; xx < x + size; xx++) {
            const i = (yy * p.width + xx) * 4;
            p.data[i] = rgb[0];
            p.data[i + 1] = rgb[1];
            p.data[i + 2] = rgb[2];
        }
    }
}
