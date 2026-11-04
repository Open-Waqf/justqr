// ui.ts: small pieces shared by the screens.
import {css, LitElement} from 'lit';

/** A Lit element that redraws when the language changes. */
export class LocalizedElement extends LitElement {
    private onLocale = () => this.requestUpdate();

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('jq-locale', this.onLocale);
    }

    disconnectedCallback(): void {
        window.removeEventListener('jq-locale', this.onLocale);
        super.disconnectedCallback();
    }
}

/**
 * Arrow keys in a radio group: +1 or -1, mirrored in right-to-left, 0 for other keys.
 * Calls preventDefault when it handles the key.
 */
export function radioStep(e: KeyboardEvent, host: Element): number {
    const rtl = getComputedStyle(host).direction === 'rtl';
    const step = {ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: 1, ArrowUp: -1}[e.key] ?? 0;
    if (step) e.preventDefault();
    return step;
}

export function nextOf<T>(list: readonly T[], current: T, step: number): T {
    return list[(list.indexOf(current) + step + list.length) % list.length];
}

/** Labels, fields, notices and focus rings, the same on every screen. */
export const formStyles = css`
    label {
        display: block;
        font-size: 13px;
        color: var(--muted);
        margin: 10px 0 4px;
    }
    input,
    select,
    textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: var(--bg);
        color: var(--text);
        font: inherit;
        font-size: 16px;
    }
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    summary:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
    .notice {
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        line-height: 1.4;
        margin: 8px 0;
        background: var(--warn-bg);
        color: var(--warn-text);
        border: 1px solid var(--warn-line);
    }
    .seg {
        display: flex;
        border: 1px solid var(--line);
        border-radius: 10px;
        overflow: hidden;
    }
    .seg button {
        flex: 1;
        min-height: 44px;
        border: 0;
        background: none;
        color: var(--text);
        font: inherit;
        font-size: 14px;
        cursor: pointer;
    }
    .seg button + button {
        border-inline-start: 1px solid var(--line);
    }
    .seg button[aria-checked='true'] {
        background: var(--accent);
        color: var(--on-accent);
        font-weight: 600;
    }
    .help {
        font-size: 13px;
        color: var(--muted);
        margin: 4px 0 0;
        line-height: 1.4;
    }
`;
