import {describe, expect, it} from 'vitest';
import {type Matrix, makeMatrix} from '../../src/lib/qr';
import {
    DEFAULT_STYLE,
    LOGO_MAX,
    LOGO_MIN,
    LOGO_WARN,
    logoBox,
    logoRect,
    scaleFor,
    svgPath,
    toPixels,
    toSvg,
} from '../../src/lib/render';
import {decodeBoth, paint} from '../support/decode';

/** Reads our own SVG path back into a grid, to prove it draws exactly the matrix. */
function pathToGrid(d: string, size: number, margin: number): Uint8Array {
    const grid = new Uint8Array(size * size);
    for (const [, x, y, w] of d.matchAll(/M(\d+) (\d+)h(\d+)v1h-\d+z/g)) {
        for (let i = 0; i < Number(w); i++) grid[(Number(y) - margin) * size + Number(x) - margin + i] = 1;
    }
    return grid;
}

describe('SVG', () => {
    it('the path draws exactly the dark modules', () => {
        const m = makeMatrix('https://open-waqf.org/menu?table=4', 'Q');
        expect(pathToGrid(svgPath(m, 4), m.size, 4)).toEqual(m.data);
    });
    it('is a complete file with the chosen colours and size', () => {
        const m = makeMatrix('x', 'L');
        const svg = toSvg(m, {fg: '#112233', bg: '#fafafa', margin: 2}, 512);
        expect(svg).toMatch(
            /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 25 25" width="512" height="512"/,
        );
        expect(svg).toContain('fill="#112233"');
        expect(svg).toContain('fill="#fafafa"');
        expect(svg).not.toContain('<image');
        expect(svg.endsWith('</svg>')).toBe(true);
    });
    it('leaves the logo square empty and puts the image in it', () => {
        const m = makeMatrix('https://open-waqf.org', 'H');
        const svg = toSvg(m, DEFAULT_STYLE, 512, {href: 'data:image/png;base64,AA"<', ratio: 0.2});
        expect(svg).toContain('<image href="data:image/png;base64,AA&quot;&lt;"');
        const box = logoBox(m, 0.2);
        const grid = pathToGrid(svgPath(m, 4, box), m.size, 4);
        for (let y = box.y; y < box.y + box.size; y++) {
            for (let x = box.x; x < box.x + box.size; x++) expect(grid[y * m.size + x]).toBe(0);
        }
    });
});

describe('logo box', () => {
    const m = makeMatrix('https://open-waqf.org', 'H');
    it('is centred and whole modules', () => {
        for (const r of [0.1, 0.17, 0.2, 0.25, 0.3]) {
            const b = logoBox(m, r);
            expect(b.x * 2 + b.size).toBe(m.size);
            expect(Number.isInteger(b.size)).toBe(true);
        }
    });
    it('is kept between the limits', () => {
        expect(logoBox(m, 0.9).size).toBe(logoBox(m, LOGO_MAX).size);
        expect(logoBox(m, 0).size).toBe(logoBox(m, LOGO_MIN).size);
        expect(LOGO_WARN).toBeLessThan(LOGO_MAX);
    });
    it('the image area sits inside the cleared box', () => {
        const rect = logoRect(m, DEFAULT_STYLE, 8, 0.2);
        const box = logoBox(m, 0.2);
        expect(rect.x).toBeGreaterThan((box.x + 4) * 8);
        expect(rect.x + rect.size).toBeLessThan((box.x + box.size + 4) * 8);
    });
});

describe('pixels', () => {
    it('scale gives whole pixels per module, at least 1', () => {
        const m = makeMatrix('x', 'L'); // 21 + 8 = 29 modules
        expect(scaleFor(m, 4, 1024)).toBe(35);
        expect(scaleFor(m, 4, 10)).toBe(1);
        expect(toPixels(m, DEFAULT_STYLE, 3).width).toBe(87);
    });
});

// A logo drawn over the code: the worst case is a solid dark shape filling the whole box.
async function decodesWithLogo(m: Matrix, text: string, ratio: number) {
    const scale = 5;
    const p = toPixels(m, DEFAULT_STYLE, scale, ratio);
    const r = logoRect(m, DEFAULT_STYLE, scale, ratio);
    paint(p, r.x, r.y, r.size, [25, 25, 25]);
    const got = await decodeBoth(p);
    expect(got.jsqr, `jsQR, logo ${ratio}`).toBe(text);
    expect(got.zxing, `ZXing, logo ${ratio}`).toBe(text);
}

describe('codes with a logo decode at every allowed size (error correction H)', () => {
    const texts = {
        'short link': 'https://ex.org/a',
        'Wi-Fi': 'WIFI:T:WPA;S:Home Network 5G;P:correct horse battery staple;;',
        'long text': 'سلام '.repeat(60),
    };
    const sizes: number[] = [];
    for (let r = LOGO_MIN; r <= LOGO_MAX + 1e-9; r += 0.025) sizes.push(Math.round(r * 1000) / 1000);
    for (const [name, text] of Object.entries(texts)) {
        it(name, async () => {
            const m = makeMatrix(text, 'H');
            for (const r of sizes) await decodesWithLogo(m, text, r);
        });
    }
});
