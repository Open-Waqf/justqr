// look.ts: everything the user can change about how a code looks, and the warnings.
import {type ColourWarning, colourWarning} from './contrast';
import type {Ec} from './qr';
import {type CodeStyle, DEFAULT_STYLE, LOGO_WARN, type Logo} from './render';

export interface Look extends CodeStyle {
    /** The level the user chose. With a logo, H is used instead (see effectiveEc). */
    ec: Ec;
    /** Width of the saved image, in pixels. */
    px: number;
    /** A picture in the middle, or null. It stays on the device. */
    logo: Logo | null;
}

export const DEFAULT_LOOK: Look = {...DEFAULT_STYLE, ec: 'M', px: 1024, logo: null};
export const SIZES: readonly number[] = [512, 1024, 2048];
/** Quiet zone choices, in modules. 4 is the standard; 0 is for layouts that add their own. */
export const MARGINS: readonly number[] = [0, 2, 4];

/** A logo covers part of the code, so the strongest error correction is always used with one. */
export function effectiveEc(look: Look): Ec {
    return look.logo ? 'H' : look.ec;
}

export type LookWarning = ColourWarning | 'no-margin' | 'logo-large';

/** Reasons the code may not scan. Warnings only: nothing is blocked. */
export function lookWarnings(look: Look): LookWarning[] {
    const out: LookWarning[] = [];
    const colour = colourWarning(look.fg, look.bg);
    if (colour) out.push(colour);
    if (look.margin === 0) out.push('no-margin');
    if (look.logo && look.logo.ratio > LOGO_WARN + 1e-9) out.push('logo-large');
    return out;
}

export function isDefaultLook(look: Look): boolean {
    return (
        look.fg.toLowerCase() === DEFAULT_LOOK.fg &&
        look.bg.toLowerCase() === DEFAULT_LOOK.bg &&
        look.margin === DEFAULT_LOOK.margin &&
        look.ec === DEFAULT_LOOK.ec &&
        look.px === DEFAULT_LOOK.px &&
        !look.logo
    );
}
