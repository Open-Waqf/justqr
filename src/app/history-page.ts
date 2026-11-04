import {css, html, nothing, type TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {getLocale, t} from '../lib/i18n';
import {labelFor} from '../lib/label';
import {effectiveEc} from '../lib/look';
import {makeMatrix} from '../lib/qr';
import {toSvg} from '../lib/render';
import {clearCodes, deleteCode, listCodes, putCode, type SavedCode} from '../lib/store';
import {formStyles, LocalizedElement, typeLabel} from './ui';

const UNDO_MS = 6000;

/** The codes made on this device. Sends `open-code` (detail: SavedCode) when one is tapped. */
@customElement('jq-history')
export class HistoryPage extends LocalizedElement {
    static styles = [
        formStyles,
        css`
            :host {
                display: block;
                position: relative;
                padding-bottom: 80px;
            }
            .item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 0;
                border-bottom: 1px solid var(--divider);
            }
            .open {
                flex: 1;
                min-width: 0;
                display: flex;
                align-items: center;
                gap: 12px;
                min-height: 64px;
                padding: 0;
                border: 0;
                background: none;
                color: var(--text);
                font: inherit;
                text-align: start;
                cursor: pointer;
                border-radius: 8px;
            }
            .thumb {
                width: 56px;
                height: 56px;
                flex: none;
                border-radius: 8px;
                border: 1px solid var(--divider);
                background: #ffffff;
                image-rendering: pixelated;
            }
            .text {
                min-width: 0;
            }
            .label {
                display: block;
                font-size: 15px;
                font-weight: 600;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .meta {
                display: block;
                font-size: 13px;
                color: var(--muted);
                margin-top: 2px;
            }
            .delete {
                width: 44px;
                height: 44px;
                flex: none;
                border: 0;
                border-radius: 22px;
                background: none;
                color: var(--muted);
                cursor: pointer;
                display: grid;
                place-items: center;
            }
            .delete svg {
                width: 22px;
                height: 22px;
                fill: none;
                stroke: currentColor;
                stroke-width: 1.8;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .empty {
                text-align: center;
                color: var(--muted);
                padding: 48px 20px;
                font-size: 15px;
                line-height: 1.5;
            }
            .foot {
                text-align: center;
                padding: 20px 0;
            }
            .link {
                min-height: 44px;
                padding: 0 12px;
                border: 0;
                background: none;
                color: var(--accent);
                font: inherit;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                border-radius: 8px;
            }
            .confirm {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
                justify-content: center;
                padding: 12px;
                border-radius: 10px;
                border: 1px solid var(--line);
            }
            .confirm .danger {
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 0;
                background: #b3261e;
                color: #ffffff;
                font: inherit;
                font-weight: 600;
                cursor: pointer;
            }
            .confirm .plain {
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 1px solid var(--line);
                background: var(--surface);
                color: var(--text);
                font: inherit;
                cursor: pointer;
            }
            .toast {
                position: fixed;
                left: 50%;
                bottom: calc(24px + env(safe-area-inset-bottom));
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0;
                padding: 8px 8px 8px 16px;
                border-radius: 999px;
                background: var(--text);
                color: var(--bg);
                font-size: 14px;
                white-space: nowrap;
            }
            .toast button {
                min-height: 36px;
                padding: 0 12px;
                border: 0;
                border-radius: 999px;
                background: var(--bg);
                color: var(--text);
                font: inherit;
                font-weight: 600;
                cursor: pointer;
            }
        `,
    ];

    @state() private codes: SavedCode[] = [];
    @state() private unreadable = 0;
    @state() private loaded = false;
    @state() private confirmClear = false;
    @state() private removed: SavedCode | null = null;
    private undoTimer = 0;

    connectedCallback(): void {
        super.connectedCallback();
        void this.refresh();
    }

    async refresh(): Promise<void> {
        const {codes, unreadable} = await listCodes();
        this.codes = codes;
        this.unreadable = unreadable;
        this.loaded = true;
    }

    private async removeCode(code: SavedCode) {
        await deleteCode(code.id);
        this.removed = code;
        clearTimeout(this.undoTimer);
        this.undoTimer = window.setTimeout(() => {
            this.removed = null;
        }, UNDO_MS);
        await this.refresh();
    }

    private async undo() {
        const code = this.removed;
        if (!code) return;
        clearTimeout(this.undoTimer);
        this.removed = null;
        await putCode(code);
        await this.refresh();
    }

    private async clearAll() {
        this.confirmClear = false;
        this.removed = null;
        await clearCodes();
        await this.refresh();
    }

    private thumb(code: SavedCode): string {
        try {
            const m = makeMatrix(code.payload, effectiveEc(code.look));
            const svg = toSvg(m, code.look, 112, code.look.logo ?? undefined);
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        } catch {
            return '';
        }
    }

    private when(ms: number): string {
        return new Intl.DateTimeFormat(getLocale(), {dateStyle: 'medium', timeStyle: 'short'}).format(ms);
    }

    private renderItem(code: SavedCode): TemplateResult {
        const label = labelFor(code.type, code.fields, code.payload);
        return html`<li class="item" data-testid="history-item">
            <button
                class="open"
                data-testid="history-open"
                @click=${() => this.dispatchEvent(new CustomEvent('open-code', {detail: code, bubbles: true, composed: true}))}
            >
                <img class="thumb" src=${this.thumb(code)} alt="" />
                <span class="text">
                    <span class="label" data-testid="history-label">${label}</span>
                    <span class="meta">${t(typeLabel(code.type))} · ${this.when(code.updatedAt)}</span>
                </span>
            </button>
            <button
                class="delete"
                data-testid="history-delete"
                aria-label=${`${t('history.delete')}: ${label}`}
                @click=${() => this.removeCode(code)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                </svg>
            </button>
        </li>`;
    }

    render() {
        if (!this.loaded) return nothing;
        return html`
            ${
                this.codes.length === 0
                    ? html`<p class="empty" data-testid="history-empty">${t('history.empty')}</p>`
                    : html`<ul style="list-style:none;margin:0;padding:0" data-testid="history-list">
                          ${this.codes.map((c) => this.renderItem(c))}
                      </ul>`
            }
            ${
                this.unreadable
                    ? html`<p class="help" data-testid="history-unreadable">
                          ${t('history.unreadable', {count: this.unreadable})}
                      </p>`
                    : nothing
            }
            ${
                this.codes.length || this.unreadable
                    ? html`<div class="foot">
                          ${
                              this.confirmClear
                                  ? html`<div class="confirm" role="group" aria-label=${t('history.clear')}>
                                        <span>${t('history.clear_confirm')}</span>
                                        <button class="danger" data-testid="history-clear-yes" @click=${this.clearAll}>
                                            ${t('history.clear_yes')}
                                        </button>
                                        <button
                                            class="plain"
                                            data-testid="history-clear-no"
                                            @click=${() => {
                                                this.confirmClear = false;
                                            }}
                                        >
                                            ${t('history.cancel')}
                                        </button>
                                    </div>`
                                  : html`<button
                                        class="link"
                                        data-testid="history-clear"
                                        @click=${() => {
                                            this.confirmClear = true;
                                        }}
                                    >
                                        ${t('history.clear')}
                                    </button>`
                          }
                      </div>`
                    : nothing
            }
            ${
                this.removed
                    ? html`<p class="toast" role="status" data-testid="history-undo-toast">
                          ${t('history.deleted')}
                          <button data-testid="history-undo" @click=${this.undo}>${t('history.undo')}</button>
                      </p>`
                    : nothing
            }
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-history': HistoryPage;
    }
}
