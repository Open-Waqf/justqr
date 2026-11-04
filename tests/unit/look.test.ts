import {describe, expect, it} from 'vitest';
import {DEFAULT_LOOK, isDefaultLook, lookWarnings} from '../../src/lib/look';

describe('look', () => {
    it('the default look has no warning', () => {
        expect(lookWarnings(DEFAULT_LOOK)).toEqual([]);
        expect(isDefaultLook(DEFAULT_LOOK)).toBe(true);
    });
    it('warns for low contrast, inverted colours and no margin', () => {
        expect(lookWarnings({...DEFAULT_LOOK, fg: '#bbbbbb'})).toEqual(['low-contrast']);
        expect(lookWarnings({...DEFAULT_LOOK, fg: '#ffffff', bg: '#000000'})).toEqual(['inverted']);
        expect(lookWarnings({...DEFAULT_LOOK, margin: 0})).toEqual(['no-margin']);
    });
    it('any change is not the default, colour case ignored', () => {
        expect(isDefaultLook({...DEFAULT_LOOK, fg: '#000000'.toUpperCase()})).toBe(true);
        expect(isDefaultLook({...DEFAULT_LOOK, ec: 'H'})).toBe(false);
        expect(isDefaultLook({...DEFAULT_LOOK, px: 2048})).toBe(false);
        expect(isDefaultLook({...DEFAULT_LOOK, margin: 2})).toBe(false);
        expect(isDefaultLook({...DEFAULT_LOOK, bg: '#fafafa'})).toBe(false);
    });
});
