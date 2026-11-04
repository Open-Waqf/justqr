import {describe, expect, it} from 'vitest';
import {byteLength, isDark, MAX_BYTES, makeMatrix, TooLongError} from '../../src/lib/qr';

describe('makeMatrix', () => {
    it('version 1 is 21 modules wide, with a dark finder corner', () => {
        const m = makeMatrix('hi', 'L');
        expect(m.size).toBe(21);
        expect(m.version).toBe(1);
        expect(isDark(m, 0, 0)).toBe(true);
        expect(m.data.length).toBe(21 * 21);
    });
    it('grows with the text', () => {
        expect(makeMatrix('x'.repeat(500), 'M').size).toBeGreaterThan(makeMatrix('x', 'M').size);
    });
    it('throws TooLongError past the limit', () => {
        expect(() => makeMatrix('a'.repeat(MAX_BYTES.H + 1), 'H')).toThrow(TooLongError);
    });
    it('refuses empty text', () => {
        expect(() => makeMatrix('', 'M')).toThrow('Nothing to encode');
    });
    it('counts bytes, not letters', () => {
        expect(byteLength('abc')).toBe(3);
        expect(byteLength('سلام')).toBe(8);
        expect(byteLength('🕌')).toBe(4);
    });
});
