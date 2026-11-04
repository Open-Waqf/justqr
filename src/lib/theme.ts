// theme.ts: light, dark or OLED, or follow the phone. Kept on this device.
export type Theme = 'system' | 'light' | 'dark' | 'oled';
export const THEMES: readonly Theme[] = ['system', 'light', 'dark', 'oled'];
const STORAGE_KEY = 'justqr.theme';

export function parseTheme(value: string | null): Theme {
    return THEMES.includes(value as Theme) ? (value as Theme) : 'system';
}

export function savedTheme(): Theme {
    try {
        return parseTheme(localStorage.getItem(STORAGE_KEY));
    } catch {
        return 'system';
    }
}

/** Sets the theme on <html> (styles.css does the rest). "system" follows the phone. */
export function applyTheme(theme: Theme, save = false): void {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    if (save) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Not saved; it still applies until the app closes.
        }
    }
}
