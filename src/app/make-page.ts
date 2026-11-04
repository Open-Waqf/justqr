import {css, html, LitElement, nothing, type TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {type MessageKey, t} from '../lib/i18n';
import {buildPayload, CODE_TYPES, type CodeType, emptyFields, type FieldsByType} from '../lib/payload';
import {byteLength, type Ec, MAX_BYTES, makeMatrix, TooLongError} from '../lib/qr';
import {DEFAULT_STYLE, toSvg} from '../lib/render';

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

/** Share of the capacity above which the "almost full" hint shows. */
const ALMOST_FULL = 0.8;

export type Preview =
    | {kind: 'empty'}
    | {kind: 'too-long'}
    | {kind: 'code'; svg: string; almostFull: boolean; payload: string};

/** What the preview shows for a payload. Exported for the export and history features. */
export function preview(payload: string, ec: Ec): Preview {
    if (!payload) return {kind: 'empty'};
    try {
        const m = makeMatrix(payload, ec);
        return {
            kind: 'code',
            svg: toSvg(m, DEFAULT_STYLE, 512),
            almostFull: byteLength(payload) > MAX_BYTES[ec] * ALMOST_FULL,
            payload,
        };
    } catch (e) {
        if (e instanceof TooLongError) return {kind: 'too-long'};
        throw e;
    }
}

@customElement('jq-make')
export class MakePage extends LitElement {
    static styles = css`
        :host {
            display: block;
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
        .chip:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
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
        .honest {
            text-align: center;
            font-size: 14px;
            line-height: 1.45;
            color: var(--muted);
            margin: 8px 0 12px;
        }
    `;

    @state() private type: CodeType = 'link';
    @state() private fields: AllFields = Object.fromEntries(
        CODE_TYPES.map((k) => [k, emptyFields(k)]),
    ) as AllFields;
    @state() private ec: Ec = 'M';

    private onLocale = () => this.requestUpdate();

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('jq-locale', this.onLocale);
    }

    disconnectedCallback(): void {
        window.removeEventListener('jq-locale', this.onLocale);
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
        // Arrow keys move between types, like any radio group (mirrored in right-to-left).
        const rtl = getComputedStyle(this).direction === 'rtl';
        const step = {ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: 1, ArrowUp: -1}[e.key];
        if (!step) return;
        e.preventDefault();
        const next =
            CODE_TYPES[(CODE_TYPES.indexOf(this.type) + step + CODE_TYPES.length) % CODE_TYPES.length];
        this.type = next;
        this.updateComplete.then(() =>
            this.renderRoot.querySelector<HTMLElement>(`[data-testid="type-${next}"]`)?.focus(),
        );
    }

    private renderPreview(p: Preview): TemplateResult {
        if (p.kind === 'code') {
            const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(p.svg)}`;
            return html`<img data-testid="preview-img" src=${src} alt=${t('make.preview_alt')} />`;
        }
        return html`<p class="placeholder">${t('make.empty')}</p>`;
    }

    render() {
        const p = preview(this.payload, this.ec);
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
            <p class="honest" data-testid="honest-line">
                ${t(HONEST[this.type])} ${t('make.honest_end')}
            </p>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-make': MakePage;
    }
}
