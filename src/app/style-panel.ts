import {css, html, nothing, type TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {type MessageKey, t} from '../lib/i18n';
import {DEFAULT_LOOK, isDefaultLook, type Look, MARGINS, SIZES} from '../lib/look';
import {EC_LEVELS} from '../lib/qr';
import {formStyles, LocalizedElement, nextOf, radioStep} from './ui';

/** The closed "Style" section under the code. Sends `look-change` with the new Look. */
@customElement('jq-style')
export class StylePanel extends LocalizedElement {
    static styles = [
        formStyles,
        css`
            :host {
                display: block;
                border-top: 1px solid var(--divider);
            }
            summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 48px;
                font-size: 15px;
                cursor: pointer;
                list-style: none;
            }
            summary::-webkit-details-marker {
                display: none;
            }
            summary .state {
                color: var(--muted);
                font-size: 14px;
            }
            summary .state::after {
                content: '▾';
                margin-inline-start: 8px;
            }
            details[open] summary .state::after {
                content: '▴';
            }
            .colours {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .colour {
                display: flex;
                align-items: center;
                gap: 10px;
                min-height: 44px;
                padding: 0 10px;
                border: 1px solid var(--line);
                border-radius: 10px;
            }
            .colour input {
                width: 32px;
                min-height: 32px;
                height: 32px;
                padding: 0;
                border: 1px solid var(--line);
                border-radius: 6px;
                cursor: pointer;
            }
            .colour span {
                font-size: 14px;
                font-family: ui-monospace, monospace;
                direction: ltr;
            }
            .reset {
                margin: 16px 0 8px;
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 1px solid var(--line);
                background: var(--surface);
                color: var(--text);
                font: inherit;
                cursor: pointer;
            }
        `,
    ];

    @property({attribute: false}) look: Look = DEFAULT_LOOK;

    private change(patch: Partial<Look>) {
        this.dispatchEvent(new CustomEvent<Look>('look-change', {detail: {...this.look, ...patch}}));
    }

    /** A row of choices that behaves like radio buttons (arrow keys included). */
    private segment<T extends string | number>(
        id: string,
        label: MessageKey,
        values: readonly T[],
        current: T,
        show: (v: T) => string,
        set: (v: T) => void,
    ): TemplateResult {
        const onKey = (e: KeyboardEvent) => {
            const step = radioStep(e, this);
            if (!step) return;
            const next = nextOf(values, current, step);
            set(next);
            this.updateComplete.then(() =>
                this.renderRoot.querySelector<HTMLElement>(`[data-testid="${id}-${next}"]`)?.focus(),
            );
        };
        return html`<label id=${`${id}-label`}>${t(label)}</label>
            <div class="seg" role="radiogroup" aria-labelledby=${`${id}-label`} @keydown=${onKey}>
                ${values.map(
                    (v) =>
                        html`<button
                            role="radio"
                            data-testid=${`${id}-${v}`}
                            aria-checked=${v === current ? 'true' : 'false'}
                            tabindex=${v === current ? 0 : -1}
                            @click=${() => set(v)}
                        >
                            ${show(v)}
                        </button>`,
                )}
            </div>`;
    }

    private colour(id: string, label: MessageKey, value: string, key: 'fg' | 'bg'): TemplateResult {
        return html`<div>
            <label for=${id}>${t(label)}</label>
            <div class="colour">
                <input
                    id=${id}
                    data-testid=${id}
                    type="color"
                    .value=${value}
                    @input=${(e: Event) => this.change({[key]: (e.target as HTMLInputElement).value})}
                />
                <span>${value.toUpperCase()}</span>
            </div>
        </div>`;
    }

    render() {
        const look = this.look;
        const plain = isDefaultLook(look);
        return html`<details data-testid="style">
            <summary data-testid="style-toggle">
                <span>${t('style.title')}</span>
                <span class="state">${plain ? t('style.default') : t('style.custom')}</span>
            </summary>
            <label>${t('style.colours')}</label>
            <div class="colours">
                ${this.colour('style-fg', 'style.fg', look.fg, 'fg')} ${this.colour('style-bg', 'style.bg', look.bg, 'bg')}
            </div>
            ${this.segment(
                'style-size',
                'style.size',
                SIZES,
                look.px,
                (v) => `${v} px`,
                (px) => this.change({px}),
            )}
            <p class="help">${t('style.size_help')}</p>
            ${this.segment(
                'style-ec',
                'style.ec',
                EC_LEVELS,
                look.ec,
                (v) => v,
                (ec) => this.change({ec}),
            )}
            <p class="help">${t('style.ec_help')}</p>
            ${this.segment(
                'style-margin',
                'style.margin',
                MARGINS,
                look.margin,
                (v) => String(v),
                (margin) => this.change({margin}),
            )}
            <p class="help">${t('style.margin_help')}</p>
            ${
                plain
                    ? nothing
                    : html`<button class="reset" data-testid="style-reset" @click=${() => this.change(DEFAULT_LOOK)}>
                          ${t('style.reset')}
                      </button>`
            }
        </details>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-style': StylePanel;
    }
}
