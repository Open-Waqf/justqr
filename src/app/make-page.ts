import {css, html, nothing, type TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {type MessageKey, t} from '../lib/i18n';
import {DEFAULT_LOOK, type Look, type LookWarning, lookWarnings} from '../lib/look';
import {buildPayload, CODE_TYPES, type CodeType, emptyFields, type FieldsByType} from '../lib/payload';
import {byteLength, MAX_BYTES, type Matrix, makeMatrix, TooLongError} from '../lib/qr';
import {toSvg} from '../lib/render';
import {canShareFiles, copy, type ExportCode, print, savePng, saveSvg, share} from './exporter';
import './style-panel';
import {formStyles, LocalizedElement, nextOf, radioStep} from './ui';

type AllFields = {[T in CodeType]: FieldsByType[T]};

// Written out in full so the translation check sees every key in use.
const TYPE_LABEL: Record<CodeType, MessageKey> = {
    link: 'make.type.link',
    text: 'make.type.text',
    wifi: 'make.type.wifi',
    contact: 'make.type.contact',
    phone: 'make.type.phone',
    sms: 'make.type.sms',
    email: 'make.type.email',
};
const HONEST: Record<CodeType, MessageKey> = {
    link: 'make.honest.link',
    text: 'make.honest.text',
    wifi: 'make.honest.wifi',
    contact: 'make.honest.contact',
    phone: 'make.honest.phone',
    sms: 'make.honest.sms',
    email: 'make.honest.email',
};

const WARNING: Record<LookWarning, MessageKey> = {
    'low-contrast': 'warn.low_contrast',
    inverted: 'warn.inverted',
    'no-margin': 'warn.no_margin',
};

/** Share of the capacity above which the "almost full" hint shows. */
const ALMOST_FULL = 0.8;

export type Preview =
    | {kind: 'empty'}
    | {kind: 'too-long'}
    | {kind: 'code'; svg: string; almostFull: boolean; payload: string; matrix: Matrix};

/** What the preview shows for a payload. Exported for the export and history features. */
export function preview(payload: string, look: Look): Preview {
    if (!payload) return {kind: 'empty'};
    try {
        const m = makeMatrix(payload, look.ec);
        return {
            kind: 'code',
            svg: toSvg(m, look, 512),
            almostFull: byteLength(payload) > MAX_BYTES[look.ec] * ALMOST_FULL,
            payload,
            matrix: m,
        };
    } catch (e) {
        if (e instanceof TooLongError) return {kind: 'too-long'};
        throw e;
    }
}

@customElement('jq-make')
export class MakePage extends LocalizedElement {
    static styles = [
        formStyles,
        css`
        :host {
            display: block;
            /* Room for the bottom bar. */
            padding-bottom: calc(96px + env(safe-area-inset-bottom));
        }
        .bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            max-width: 560px;
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            gap: 8px;
            padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
            background: var(--bg);
            border-top: 1px solid var(--divider);
        }
        .btn {
            flex: 1;
            min-height: 48px;
            border-radius: 12px;
            border: 1px solid var(--line);
            background: var(--surface);
            color: var(--text);
            font: inherit;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
        }
        .btn.primary {
            background: var(--accent);
            color: var(--on-accent);
            border-color: var(--accent);
        }
        .btn.more {
            flex: 0 0 56px;
        }
        .btn:disabled {
            opacity: 0.45;
            cursor: default;
        }
        .btn:focus-visible,
        .menu button:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        .btn svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .menu {
            position: absolute;
            bottom: calc(100% + 6px);
            inset-inline-end: 12px;
            min-width: 200px;
            padding: 6px;
            border-radius: 12px;
            border: 1px solid var(--divider);
            background: var(--bg);
            box-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
        }
        .menu button {
            display: block;
            width: 100%;
            min-height: 44px;
            padding: 0 12px;
            border: 0;
            border-radius: 8px;
            background: none;
            color: var(--text);
            font: inherit;
            font-size: 15px;
            text-align: start;
            cursor: pointer;
        }
        .menu button:hover {
            background: var(--surface);
        }
        .toast {
            position: absolute;
            bottom: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            margin: 0;
            padding: 8px 14px;
            border-radius: 999px;
            background: var(--text);
            color: var(--bg);
            font-size: 14px;
            white-space: nowrap;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 4px 0 8px;
        }
        .chip {
            font: inherit;
            font-size: 14px;
            min-height: 40px;
            padding: 8px 14px;
            border-radius: 999px;
            border: 1px solid transparent;
            background: var(--chip);
            color: var(--text);
            cursor: pointer;
        }
        .chip[aria-checked='true'] {
            background: var(--accent);
            color: var(--on-accent);
            font-weight: 600;
        }
        textarea {
            min-height: 96px;
            resize: vertical;
        }
        .row2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .check {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 12px;
            color: var(--text);
            font-size: 15px;
        }
        .check input {
            width: 22px;
            min-height: 22px;
            height: 22px;
            margin: 0;
            accent-color: var(--accent);
        }
        .preview {
            margin: 16px auto 8px;
            width: min(240px, 70vw);
            aspect-ratio: 1;
            border-radius: 12px;
            border: 1px solid var(--divider);
            /* The code draws its own background; this only shows behind the empty state. */
            background: #ffffff;
            display: grid;
            place-items: center;
            overflow: hidden;
        }
        .preview img {
            width: 100%;
            height: 100%;
            display: block;
            image-rendering: pixelated;
        }
        .preview .placeholder {
            padding: 20px;
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            color: #5b6470;
        }
        .honest {
            text-align: center;
            font-size: 14px;
            line-height: 1.45;
            color: var(--muted);
            margin: 8px 0 12px;
        }
    `,
    ];

    @state() private type: CodeType = 'link';
    @state() private fields: AllFields = Object.fromEntries(
        CODE_TYPES.map((k) => [k, emptyFields(k)]),
    ) as AllFields;
    @state() private look: Look = DEFAULT_LOOK;
    @state() private menuOpen = false;
    @state() private toast = '';
    private toastTimer = 0;
    private readonly canShare = canShareFiles();
    private onOutside = (e: Event) => {
        if (
            this.menuOpen &&
            !e.composedPath().includes(this.renderRoot.querySelector('.bar') as EventTarget)
        ) {
            this.menuOpen = false;
        }
    };

    connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('pointerdown', this.onOutside);
    }

    disconnectedCallback(): void {
        document.removeEventListener('pointerdown', this.onOutside);
        super.disconnectedCallback();
    }

    get payload(): string {
        return buildPayload(this.type, this.fields[this.type] as never);
    }

    private set<T extends CodeType>(type: T, key: keyof FieldsByType[T], value: unknown) {
        this.fields = {...this.fields, [type]: {...this.fields[type], [key]: value}};
    }

    private input<T extends CodeType>(
        type: T,
        key: keyof FieldsByType[T] & string,
        label: MessageKey,
        opts: {kind?: 'url' | 'email' | 'tel' | 'text'; ltr?: boolean; multiline?: boolean} = {},
    ): TemplateResult {
        const id = `f-${key}`;
        const value = String(this.fields[type][key] ?? '');
        const onInput = (e: Event) => this.set(type, key, (e.target as HTMLInputElement).value);
        const dir = opts.ltr ? 'ltr' : 'auto';
        return html`<label for=${id}>${t(label)}</label>
            ${
                opts.multiline
                    ? html`<textarea id=${id} data-testid=${id} dir=${dir} .value=${value} @input=${onInput}></textarea>`
                    : html`<input
                          id=${id}
                          data-testid=${id}
                          type=${opts.kind ?? 'text'}
                          dir=${dir}
                          autocomplete="off"
                          autocapitalize=${opts.ltr ? 'off' : 'sentences'}
                          spellcheck=${opts.ltr ? 'false' : 'true'}
                          .value=${value}
                          @input=${onInput}
                      />`
            }`;
    }

    private renderFields(): TemplateResult {
        switch (this.type) {
            case 'link':
                return this.input('link', 'url', 'field.url', {kind: 'url', ltr: true});
            case 'text':
                return this.input('text', 'text', 'field.text', {multiline: true});
            case 'wifi': {
                const f = this.fields.wifi;
                return html`${this.input('wifi', 'ssid', 'field.ssid')}
                    <div class="row2">
                        <div>${this.input('wifi', 'password', 'field.password', {ltr: true})}</div>
                        <div>
                            <label for="f-security">${t('field.security')}</label>
                            <select
                                id="f-security"
                                data-testid="f-security"
                                .value=${f.security}
                                @change=${(e: Event) => this.set('wifi', 'security', (e.target as HTMLSelectElement).value)}
                            >
                                <option value="WPA">${t('field.security_wpa')}</option>
                                <option value="WEP">${t('field.security_wep')}</option>
                                <option value="nopass">${t('field.security_none')}</option>
                            </select>
                        </div>
                    </div>
                    <label class="check"
                        ><input
                            type="checkbox"
                            data-testid="f-hidden"
                            .checked=${f.hidden}
                            @change=${(e: Event) => this.set('wifi', 'hidden', (e.target as HTMLInputElement).checked)}
                        />${t('field.hidden')}</label
                    >`;
            }
            case 'contact':
                return html`<div class="row2">
                        <div>${this.input('contact', 'firstName', 'field.first_name')}</div>
                        <div>${this.input('contact', 'lastName', 'field.last_name')}</div>
                    </div>
                    ${this.input('contact', 'phone', 'field.phone', {kind: 'tel', ltr: true})}
                    ${this.input('contact', 'email', 'field.email', {kind: 'email', ltr: true})}
                    ${this.input('contact', 'org', 'field.org')} ${this.input('contact', 'title', 'field.job_title')}
                    ${this.input('contact', 'url', 'field.website', {kind: 'url', ltr: true})}`;
            case 'phone':
                return this.input('phone', 'number', 'field.number', {kind: 'tel', ltr: true});
            case 'sms':
                return html`${this.input('sms', 'number', 'field.number', {kind: 'tel', ltr: true})}
                ${this.input('sms', 'message', 'field.message', {multiline: true})}`;
            case 'email':
                return html`${this.input('email', 'to', 'field.to', {kind: 'email', ltr: true})}
                ${this.input('email', 'subject', 'field.subject')}
                ${this.input('email', 'body', 'field.message', {multiline: true})}`;
        }
    }

    private onTypeKey(e: KeyboardEvent) {
        const step = radioStep(e, this);
        if (!step) return;
        const next = nextOf(CODE_TYPES, this.type, step);
        this.type = next;
        this.updateComplete.then(() =>
            this.renderRoot.querySelector<HTMLElement>(`[data-testid="type-${next}"]`)?.focus(),
        );
    }

    private exportCode(p: Preview): ExportCode | null {
        if (p.kind !== 'code') return null;
        return {matrix: p.matrix, style: this.look, type: this.type, payload: p.payload, px: this.look.px};
    }

    private say(key: MessageKey) {
        this.toast = t(key);
        clearTimeout(this.toastTimer);
        this.toastTimer = window.setTimeout(() => {
            this.toast = '';
        }, 2500);
    }

    private async run(action: () => Promise<MessageKey | null> | MessageKey | null) {
        this.menuOpen = false;
        try {
            const done = await action();
            if (done) this.say(done);
        } catch {
            this.say('toast.failed');
        }
    }

    private renderBar(code: ExportCode | null): TemplateResult {
        const off = !code;
        const item = (
            id: string,
            label: MessageKey,
            action: () => Promise<MessageKey | null> | MessageKey | null,
        ) =>
            html`<button role="menuitem" data-testid=${id} @click=${() => this.run(action)}>${t(label)}</button>`;
        return html`<div
            class="bar"
            @keydown=${(e: KeyboardEvent) => {
                if (e.key === 'Escape' && this.menuOpen) {
                    this.menuOpen = false;
                    this.renderRoot.querySelector<HTMLElement>('[data-testid="btn-more"]')?.focus();
                }
            }}
        >
            ${this.toast ? html`<p class="toast" role="status" data-testid="toast">${this.toast}</p>` : nothing}
            <button
                class="btn primary"
                data-testid="btn-save"
                ?disabled=${off}
                @click=${() =>
                    code &&
                    this.run(async () => {
                        await savePng(code);
                        return 'toast.saved' as const;
                    })}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M4 20h16" /></svg>
                ${t('action.save')}
            </button>
            ${
                this.canShare
                    ? html`<button
                          class="btn"
                          data-testid="btn-share"
                          ?disabled=${off}
                          @click=${() =>
                              code &&
                              this.run(async () => {
                                  await share(code);
                                  return null;
                              })}
                      >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="18" cy="5" r="3" />
                              <circle cx="6" cy="12" r="3" />
                              <circle cx="18" cy="19" r="3" />
                              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                          </svg>
                          ${t('action.share')}
                      </button>`
                    : nothing
            }
            <button
                class="btn more"
                data-testid="btn-more"
                aria-label=${t('action.more')}
                aria-haspopup="menu"
                aria-expanded=${this.menuOpen ? 'true' : 'false'}
                ?disabled=${off}
                @click=${() => {
                    this.menuOpen = !this.menuOpen;
                    if (this.menuOpen) {
                        this.updateComplete.then(() =>
                            this.renderRoot.querySelector<HTMLElement>('.menu button')?.focus(),
                        );
                    }
                }}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                </svg>
            </button>
            ${
                this.menuOpen && code
                    ? html`<div class="menu" role="menu" data-testid="menu">
                          ${item('menu-svg', 'action.save_svg', () => {
                              saveSvg(code);
                              return 'toast.saved' as const;
                          })}
                          ${item('menu-copy', 'action.copy', async () =>
                              (await copy(code)) === 'image'
                                  ? ('toast.copied' as const)
                                  : ('toast.copied_text' as const),
                          )}
                          ${item('menu-print', 'action.print', () => {
                              print(code);
                              return null;
                          })}
                      </div>`
                    : nothing
            }
        </div>`;
    }

    private renderPreview(p: Preview): TemplateResult {
        if (p.kind === 'code') {
            const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(p.svg)}`;
            return html`<img data-testid="preview-img" src=${src} alt=${t('make.preview_alt')} />`;
        }
        return html`<p class="placeholder">${t('make.empty')}</p>`;
    }

    render() {
        const p = preview(this.payload, this.look);
        const warnings = p.kind === 'code' ? lookWarnings(this.look) : [];
        return html`
            <div class="chips" role="radiogroup" aria-label=${t('make.types')} @keydown=${this.onTypeKey}>
                ${CODE_TYPES.map(
                    (type) =>
                        html`<button
                            class="chip"
                            role="radio"
                            data-testid=${`type-${type}`}
                            aria-checked=${type === this.type ? 'true' : 'false'}
                            tabindex=${type === this.type ? 0 : -1}
                            @click=${() => {
                                this.type = type;
                            }}
                        >
                            ${t(TYPE_LABEL[type])}
                        </button>`,
                )}
            </div>
            <div data-testid="fields">${this.renderFields()}</div>
            <div class="preview" data-testid="preview">${this.renderPreview(p)}</div>
            ${p.kind === 'too-long' ? html`<p class="notice" role="alert" data-testid="too-long">${t('make.too_long')}</p>` : nothing}
            ${
                p.kind === 'code' && p.almostFull
                    ? html`<p class="notice" data-testid="almost-full">${t('make.almost_full')}</p>`
                    : nothing
            }
            ${warnings.map((w) => html`<p class="notice" data-testid=${`warn-${w}`}>${t(WARNING[w])}</p>`)}
            <p class="honest" data-testid="honest-line">
                ${t(HONEST[this.type])} ${t('make.honest_end')}
            </p>
            <jq-style
                .look=${this.look}
                @look-change=${(e: CustomEvent<Look>) => {
                    this.look = e.detail;
                }}
            ></jq-style>
            ${this.renderBar(this.exportCode(p))}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-make': MakePage;
    }
}
