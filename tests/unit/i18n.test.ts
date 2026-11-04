import {describe, expect, it} from 'vitest';
import {dirOf, pickLocale} from '../../src/lib/i18n';

describe('pickLocale', () => {
    it('uses the saved language first', () => {
        expect(pickLocale('ar', ['fr-FR'])).toBe('ar');
    });
    it('then the first supported phone language, region ignored', () => {
        expect(pickLocale(null, ['de-DE', 'es-MX', 'fr'])).toBe('es');
    });
    it('ignores a saved value it does not know', () => {
        expect(pickLocale('xx', ['it-IT'])).toBe('it');
    });
    it('falls back to English', () => {
        expect(pickLocale(null, ['de', 'ja'])).toBe('en');
    });
});

describe('dirOf', () => {
    it('is right to left for Arabic only', () => {
        expect(dirOf('ar')).toBe('rtl');
        expect(dirOf('fr')).toBe('ltr');
    });
});
