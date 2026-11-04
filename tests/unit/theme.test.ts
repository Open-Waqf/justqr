import {describe, expect, it} from 'vitest';
import {parseTheme} from '../../src/lib/theme';

describe('parseTheme', () => {
    it('keeps a known theme and falls back to following the phone', () => {
        expect(parseTheme('oled')).toBe('oled');
        expect(parseTheme('light')).toBe('light');
        expect(parseTheme(null)).toBe('system');
        expect(parseTheme('neon')).toBe('system');
    });
});
