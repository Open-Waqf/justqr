import {css, html, nothing, type TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {type MessageKey, t} from '../lib/i18n';
import {DEFAULT_LOOK, effectiveEc, isDefaultLook, type Look, MARGINS, SIZES} from '../lib/look';
import {EC_LEVELS} from '../lib/qr';
import {LOGO_DEFAULT, LOGO_MAX, LOGO_MIN} from '../lib/render';
import {LogoError, readLogo} from './logo-image';
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
            .action {
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 1px solid var(--line);
                background: var(--surface);
                color: var(--text);
                font: inherit;
                cursor: pointer;
            }
            .logo-row {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            }
            .logo-thumb {
                width: 44px;
                height: 44px;
                object-fit: contain;
                border-radius: 8px;
                border: 1px solid var(--divider);
                background: #ffffff;
            }
            input[type='range'] {
                padding: 0;
                min-height: 32px;
                border: 0;
                background: none;
                accent-color: var(--accent);
            }
            .seg button:disabled {
                cursor: default;
            }
            .seg button:disabled:not([aria-checked='true']) {
                color: var(--muted);
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
        disabled = false,
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
                            ?disabled=${disabled}
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

    private async pick(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;
        try {
            const href = await readLogo(file);
            this.change({logo: {href, ratio: this.look.logo?.ratio ?? LOGO_DEFAULT}});
        } catch (err) {
            if (!(err instanceof LogoError)) throw err;
            this.dispatchEvent(new CustomEvent('logo-error', {bubbles: true, composed: true}));
        }
    }

    private renderLogo(): TemplateResult {
        const logo = this.look.logo;
        const picker = html`<input
            id="logo-file"
            data-testid="logo-file"
            type="file"
            accept="image/*"
            hidden
            @change=${this.pick}
        />`;
        if (!logo) {
            return html`<label>${t('style.logo')}</label>${picker}
                <button
                    class="action"
                    data-testid="logo-add"
                    @click=${() => this.renderRoot.querySelector<HTMLInputElement>('#logo-file')?.click()}
                >
                    ${t('style.logo_add')}
                </button>
                <p class="help">${t('style.logo_help')}</p>`;
        }
        const pct = Math.round(logo.ratio * 100);
        return html`<label>${t('style.logo')}</label>${picker}
            <div class="logo-row">
                <img class="logo-thumb" data-testid="logo-thumb" src=${logo.href} alt="" />
                <button
                    class="action"
                    data-testid="logo-change"
                    @click=${() => this.renderRoot.querySelector<HTMLInputElement>('#logo-file')?.click()}
                >
                    ${t('style.logo_change')}
                </button>
                <button class="action" data-testid="logo-remove" @click=${() => this.change({logo: null})}>
                    ${t('style.logo_remove')}
                </button>
            </div>
            <label for="logo-size">${t('style.logo_size')}: ${pct}%</label>
            <input
                id="logo-size"
                data-testid="logo-size"
                type="range"
                min=${LOGO_MIN}
                max=${LOGO_MAX}
                step="0.025"
                .value=${String(logo.ratio)}
                aria-valuetext=${`${pct}%`}
                @input=${(e: Event) =>
                    this.change({logo: {...logo, ratio: Number((e.target as HTMLInputElement).value)}})}
            />`;
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
            ${this.renderLogo()}
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
                effectiveEc(look),
                (v) => v,
                (ec) => this.change({ec}),
                !!look.logo,
            )}
            <p class="help">${look.logo ? t('style.ec_logo') : t('style.ec_help')}</p>
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
