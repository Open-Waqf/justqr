// look.ts: everything the user can change about how a code looks, and the warnings.
import {type ColourWarning, colourWarning} from './contrast';
import type {Ec} from './qr';
import {type CodeStyle, DEFAULT_STYLE} from './render';

export interface Look extends CodeStyle {
    ec: Ec;
    /** Width of the saved image, in pixels. */
    px: number;
}

export const DEFAULT_LOOK: Look = {...DEFAULT_STYLE, ec: 'M', px: 1024};
export const SIZES: readonly number[] = [512, 1024, 2048];
/** Quiet zone choices, in modules. 4 is the standard; 0 is for layouts that add their own. */
export const MARGINS: readonly number[] = [0, 2, 4];

export type LookWarning = ColourWarning | 'no-margin';

/** Reasons the code may not scan. Warnings only: nothing is blocked. */
export function lookWarnings(look: Look): LookWarning[] {
    const out: LookWarning[] = [];
    const colour = colourWarning(look.fg, look.bg);
    if (colour) out.push(colour);
    if (look.margin === 0) out.push('no-margin');
    return out;
}

export function isDefaultLook(look: Look): boolean {
    return (
        look.fg.toLowerCase() === DEFAULT_LOOK.fg &&
        look.bg.toLowerCase() === DEFAULT_LOOK.bg &&
        look.margin === DEFAULT_LOOK.margin &&
        look.ec === DEFAULT_LOOK.ec &&
        look.px === DEFAULT_LOOK.px
    );
}
