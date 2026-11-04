import {css, html, nothing, type TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {type MessageKey, t} from '../lib/i18n';
import {DEFAULT_LOOK, effectiveEc, type Look, type LookWarning, lookWarnings} from '../lib/look';
import {buildPayload, CODE_TYPES, type CodeType, emptyFields, type FieldsByType} from '../lib/payload';
import {byteLength, MAX_BYTES, type Matrix, makeMatrix, TooLongError} from '../lib/qr';
import {toSvg} from '../lib/render';
import {
    clearDraft,
    type Draft,
    getDraft,
    persist,
    putDraft,
    rememberCode,
    type SavedCode,
} from '../lib/store';
import {
    canPrint,
    canShareFiles,
    copy,
    type ExportCode,
    print,
    type Saved,
    savePng,
    saveSvg,
    share,
} from './exporter';
import './style-panel';
import {formStyles, LocalizedElement, nextOf, radioStep, typeLabel} from './ui';

type AllFields = {[T in CodeType]: FieldsByType[T]};

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
    'logo-large': 'warn.logo_large',
};

const savedMessage = (where: Saved): MessageKey =>
    where === 'android' ? 'toast.saved_android' : 'toast.saved';

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
        const ec = effectiveEc(look);
        const m = makeMatrix(payload, ec);
        return {
            kind: 'code',
            svg: toSvg(m, look, 512, look.logo ?? undefined),
            almostFull: byteLength(payload) > MAX_BYTES[ec] * ALMOST_FULL,
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
            padding-bottom: calc(96px + var(--inset-bottom));
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
            padding: 10px 12px calc(10px + var(--inset-bottom));
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
        .restored {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 4px 0 8px;
            padding: 6px 6px 6px 12px;
            border-radius: 10px;
            background: var(--surface);
            color: var(--muted);
            font-size: 14px;
        }
        .restored button {
            min-height: 36px;
            padding: 0 12px;
            border: 0;
            border-radius: 8px;
            background: var(--bg);
            color: var(--accent);
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
        }
        .more-fields {
            margin-top: 10px;
            min-height: 44px;
            padding: 0 4px;
            border: 0;
            background: none;
            color: var(--accent);
            font: inherit;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
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
    /** Contact shows its rarely used fields only on request, so the code stays on screen. */
    @state() private moreContact = false;
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

    /** Shows "Back where you left off" after a draft came back. */
    @state() private restored = false;
    private draftTimer = 0;
    private draftReady = false;
    // The phone may kill a background app any moment: write the draft at once when the app
    // goes to the background (visibilitychange) or the page is left (pagehide: reload, close).
    private onHidden = () => {
        if (document.visibilityState === 'hidden') this.saveDraft();
    };
    private onLeave = () => this.saveDraft();

    connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('pointerdown', this.onOutside);
        document.addEventListener('visibilitychange', this.onHidden);
        window.addEventListener('pagehide', this.onLeave);
        this.restoreDraft();
    }

    disconnectedCallback(): void {
        document.removeEventListener('pointerdown', this.onOutside);
        document.removeEventListener('visibilitychange', this.onHidden);
        window.removeEventListener('pagehide', this.onLeave);
        super.disconnectedCallback();
    }

    protected updated(changed: Map<PropertyKey, unknown>): void {
        // Anything the user typed or styled is written to the draft a moment later, so even a
        // crash loses almost nothing. Not before the saved draft was read back.
        if (this.draftReady && (changed.has('type') || changed.has('fields') || changed.has('look'))) {
            clearTimeout(this.draftTimer);
            this.draftTimer = window.setTimeout(() => this.saveDraft(), 800);
        }
    }

    private draft(): Draft {
        return {schema: 1, savedAt: Date.now(), type: this.type, fields: this.fields, look: this.look};
    }

    private saveDraft(): void {
        if (!this.draftReady) return;
        clearTimeout(this.draftTimer);
        try {
            putDraft(this.draft());
        } catch {
            // Storage blocked or full; typing still works.
        }
    }

    private restoreDraft(): void {
        const draft = getDraft();
        if (draft && buildPayload(draft.type, draft.fields[draft.type] as never)) {
            this.type = draft.type;
            this.fields = {...this.fields, ...draft.fields};
            this.look = draft.look;
            this.restored = true;
        }
        this.draftReady = true;
    }

    /** "Start fresh": forgets the draft and empties every field. */
    private startFresh(): void {
        this.restored = false;
        this.type = 'link';
        this.fields = Object.fromEntries(CODE_TYPES.map((k) => [k, emptyFields(k)])) as AllFields;
        this.look = DEFAULT_LOOK;
        this.moreContact = false;
        clearTimeout(this.draftTimer);
        clearDraft();
    }

    /** Closes the "more" menu if it is open (Android Back button). Returns true if it was. */
    closeMenu(): boolean {
        if (!this.menuOpen) return false;
        this.menuOpen = false;
        return true;
    }

    /** Shows a saved code again, ready to edit. Any change is saved as a new code. */
    load(code: SavedCode): void {
        this.restored = false;
        this.type = code.type;
        this.fields = {...this.fields, [code.type]: {...code.fields}};
        this.look = code.look;
        this.moreContact = false;
        this.menuOpen = false;
    }

    private persisted = false;

    /** Keeps the code on this device (history). Called after every save, share, copy or print. */
    private async remember(): Promise<void> {
        const payload = this.payload;
        if (!payload) return;
        await rememberCode({type: this.type, fields: this.fields[this.type], look: this.look, payload});
        // History may already be open (a quick tap after Save): tell it to read again.
        window.dispatchEvent(new CustomEvent('jq-history-changed'));
        if (!this.persisted) {
            this.persisted = true;
            void persist();
        }
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

    private renderMoreContact(): TemplateResult {
        const f = this.fields.contact;
        // Always open when one of them holds something, so nothing in the code is hidden.
        if (this.moreContact || f.org || f.title || f.url) {
            return html`${this.input('contact', 'org', 'field.org')} ${this.input('contact', 'title', 'field.job_title')}
            ${this.input('contact', 'url', 'field.website', {kind: 'url', ltr: true})}`;
        }
        return html`<button
            class="more-fields"
            data-testid="contact-more"
            @click=${() => {
                this.moreContact = true;
                this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('#f-org')?.focus());
            }}
        >
            ${t('field.more')}
        </button>`;
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
                    ${this.renderMoreContact()}`;
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
        const {look} = this;
        return {
            matrix: p.matrix,
            style: look,
            type: this.type,
            payload: p.payload,
            px: look.px,
            logo: look.logo,
        };
    }

    private say(key: MessageKey) {
        this.toast = t(key);
        clearTimeout(this.toastTimer);
        this.toastTimer = window.setTimeout(() => {
            this.toast = '';
        }, 2500);
    }

    /** Runs an export action; when it went through, the code goes into the history. */
    private async run(action: () => Promise<MessageKey | null | false> | MessageKey | null) {
        this.menuOpen = false;
        try {
            const done = await action();
            if (done === false) return; // the user backed out (closed the share sheet)
            await this.remember();
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
            html`<button role="menuitem" id=${id} data-testid=${id} @click=${() => this.run(action)}>${t(label)}</button>`;
        return html`<div
            class="bar"
            @keydown=${(e: KeyboardEvent) => {
                if (e.key === 'Escape' && this.menuOpen) {
                    this.menuOpen = false;
                    this.renderRoot.querySelector<HTMLElement>('#btn-more')?.focus();
                }
            }}
        >
            ${this.toast ? html`<p class="toast" role="status" id="toast" data-testid="toast">${this.toast}</p>` : nothing}
            <button
                class="btn primary"
                id="btn-save" data-testid="btn-save"
                ?disabled=${off}
                @click=${() => code && this.run(async () => savedMessage(await savePng(code)))}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M4 20h16" /></svg>
                ${t('action.save')}
            </button>
            ${
                this.canShare
                    ? html`<button
                          class="btn"
                          id="btn-share" data-testid="btn-share"
                          ?disabled=${off}
                          @click=${() => code && this.run(async () => ((await share(code)) ? null : false))}
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
                id="btn-more" data-testid="btn-more"
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
                          ${item('menu-svg', 'action.save_svg', async () => savedMessage(await saveSvg(code)))}
                          ${item('menu-copy', 'action.copy', async () =>
                              (await copy(code)) === 'image'
                                  ? ('toast.copied' as const)
                                  : ('toast.copied_text' as const),
                          )}
                          ${
                              canPrint()
                                  ? item('menu-print', 'action.print', () => {
                                        print(code);
                                        return null;
                                    })
                                  : nothing
                          }
                      </div>`
                    : nothing
            }
        </div>`;
    }

    private renderPreview(p: Preview): TemplateResult {
        if (p.kind === 'code') {
            const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(p.svg)}`;
            return html`<img id="preview-img" data-testid="preview-img" src=${src} alt=${t('make.preview_alt')} />`;
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
                            id=${`type-${type}`} data-testid=${`type-${type}`}
                            aria-checked=${type === this.type ? 'true' : 'false'}
                            tabindex=${type === this.type ? 0 : -1}
                            @click=${() => {
                                this.type = type;
                            }}
                        >
                            ${t(typeLabel(type))}
                        </button>`,
                )}
            </div>
            ${
                this.restored
                    ? html`<p class="restored" role="status" id="draft-restored" data-testid="draft-restored">
                          <span>${t('draft.restored')}</span>
                          <button id="draft-fresh" data-testid="draft-fresh" @click=${this.startFresh}>${t('draft.fresh')}</button>
                      </p>`
                    : nothing
            }
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
                @logo-error=${() => this.say('toast.logo_failed')}
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
