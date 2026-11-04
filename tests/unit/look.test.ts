import {describe, expect, it} from 'vitest';
import {DEFAULT_LOOK, effectiveEc, isDefaultLook, lookWarnings} from '../../src/lib/look';
import {LOGO_MAX, LOGO_WARN} from '../../src/lib/render';

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

describe('logo', () => {
    const logo = {href: 'data:image/png;base64,AA', ratio: 0.2};
    it('forces error correction H, and gives the choice back when removed', () => {
        expect(effectiveEc({...DEFAULT_LOOK, ec: 'L', logo})).toBe('H');
        expect(effectiveEc({...DEFAULT_LOOK, ec: 'L', logo: null})).toBe('L');
    });
    it('warns above the warning size only', () => {
        expect(lookWarnings({...DEFAULT_LOOK, logo: {...logo, ratio: LOGO_WARN}})).toEqual([]);
        expect(lookWarnings({...DEFAULT_LOOK, logo: {...logo, ratio: LOGO_MAX}})).toEqual(['logo-large']);
    });
    it('a logo is not the default look', () => {
        expect(isDefaultLook({...DEFAULT_LOOK, logo})).toBe(false);
    });
});
