import {describe, expect, it} from 'vitest';
import {colourWarning, contrastRatio, parseHex} from '../../src/lib/contrast';

describe('contrast', () => {
    it('parses short and long hex, anything else is black', () => {
        expect(parseHex('#fff')).toEqual([255, 255, 255]);
        expect(parseHex('0B6E6A')).toEqual([11, 110, 106]);
        expect(parseHex('red')).toEqual([0, 0, 0]);
    });
    it('matches the WCAG reference values', () => {
        expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
        expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
        // #767676 on white is the classic 4.54:1.
        expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
    });
    it('no warning for dark on light', () => {
        expect(colourWarning('#000000', '#ffffff')).toBeNull();
        expect(colourWarning('#0b3d3a', '#fff4d6')).toBeNull();
    });
    it('warns when the colours are too close', () => {
        expect(colourWarning('#999999', '#ffffff')).toBe('low-contrast');
        expect(colourWarning('#ffeb3b', '#ffffff')).toBe('low-contrast');
    });
    it('warns when the code is lighter than its background', () => {
        expect(colourWarning('#ffffff', '#000000')).toBe('inverted');
    });
});
