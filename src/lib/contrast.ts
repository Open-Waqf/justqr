// contrast.ts: will these colours scan? WCAG contrast formula, no guessing.

export type Rgb = [number, number, number];

/** "#0b6e6a" or "#fff" to [11, 110, 106]. Anything else is black. */
export function parseHex(color: string): Rgb {
    let hex = color.trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(hex)) hex = [...hex].map((c) => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(hex)) return [0, 0, 0];
    return [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)) as Rgb;
}

/** Relative luminance, WCAG 2. */
export function luminance([r, g, b]: Rgb): number {
    const lin = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
    const la = luminance(parseHex(a));
    const lb = luminance(parseHex(b));
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Below this, warn that the code may not scan. */
export const MIN_CONTRAST = 4.5;

export type ColourWarning = 'low-contrast' | 'inverted';

/**
 * 'inverted' when the code is lighter than its background: many scanners only read dark
 * codes on light backgrounds. 'low-contrast' when the colours are too close.
 * A warning, never a block: the user decides.
 */
export function colourWarning(fg: string, bg: string): ColourWarning | null {
    if (contrastRatio(fg, bg) < MIN_CONTRAST) return 'low-contrast';
    if (luminance(parseHex(fg)) > luminance(parseHex(bg))) return 'inverted';
    return null;
}
