import {css, html, nothing} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {t} from '../lib/i18n';
import type {SavedCode} from '../lib/store';
import './history-page';
import './make-page';
import './settings-page';
import type {MakePage} from './make-page';
import {hiddenStyles, LocalizedElement} from './ui';

type Route = 'make' | 'history' | 'settings';

/** The hash is the route, so the phone's Back button works: "" is Make, "#history", "#settings". */
function routeFromHash(): Route {
    if (location.hash === '#history') return 'history';
    if (location.hash === '#settings') return 'settings';
    return 'make';
}

@customElement('jq-app')
export class AppRoot extends LocalizedElement {
    static styles = [
        hiddenStyles,
        css`
        :host {
            display: flex;
            flex-direction: column;
            min-height: 100%;
            max-width: 560px;
            margin: 0 auto;
        }
        header {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 8px 6px 16px;
        }
        header.sub {
            padding-inline-start: 4px;
        }
        h1 {
            flex: 1;
            font-size: 20px;
            font-weight: 650;
            margin: 0;
        }
        .icon {
            width: 44px;
            height: 44px;
            border: 0;
            border-radius: 22px;
            background: none;
            color: var(--text);
            display: grid;
            place-items: center;
            cursor: pointer;
        }
        .icon:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        .icon svg {
            width: 24px;
            height: 24px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.8;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        [dir='rtl'] .back svg {
            transform: scaleX(-1);
        }
        main {
            flex: 1;
            padding: 0 16px 16px;
        }
        .update {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 0 16px 8px;
            padding: 6px 6px 6px 12px;
            border-radius: 10px;
            background: var(--surface);
            font-size: 14px;
        }
        .update button {
            min-height: 36px;
            padding: 0 12px;
            border: 0;
            border-radius: 8px;
            background: var(--accent);
            color: var(--on-accent);
            font: inherit;
            font-weight: 600;
            cursor: pointer;
        }
    `,
    ];

    @state() private route: Route = routeFromHash();
    /** Set when a new version of the app is ready (service worker, web only). */
    @state() private applyUpdate: (() => void) | null = null;
    private onUpdate = (e: Event) => {
        this.applyUpdate = (e as CustomEvent<{apply: () => void}>).detail.apply;
    };
    @query('jq-make') private make!: MakePage;

    private onHash = () => {
        this.route = routeFromHash();
    };

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('hashchange', this.onHash);
        window.addEventListener('jq-update-ready', this.onUpdate);
    }

    disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.onHash);
        window.removeEventListener('jq-update-ready', this.onUpdate);
        super.disconnectedCallback();
    }

    firstUpdated(): void {
        // The startup test reads this mark (tests/e2e/startup.spec.ts).
        performance.mark('jq-ready');
    }

    private goBack() {
        // Back to Make. history.back() when the page was opened from Make, so the phone's
        // Back stays in step; a fresh "#history" load has nothing to go back to.
        if (history.length > 1 && history.state?.jq) history.back();
        else location.hash = '';
    }

    private open(route: 'history' | 'settings') {
        history.pushState({jq: route}, '', `#${route}`);
        this.onHash();
    }

    private openCode(e: CustomEvent<SavedCode>) {
        this.make.load(e.detail);
        this.goBack();
    }

    render() {
        const dir = document.documentElement.dir;
        const sub = this.route !== 'make';
        return html`
            <header class=${sub ? 'sub' : ''} dir=${dir}>
                ${
                    sub
                        ? html`<button class="icon back" data-testid="btn-back" aria-label=${t('nav.back')} @click=${this.goBack}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                              </button>
                              <h1>${this.route === 'history' ? t('history.title') : t('settings.title')}</h1>`
                        : html`<h1>Just QR</h1>
                              <button class="icon" data-testid="btn-history" aria-label=${t('history.title')} @click=${() => this.open('history')}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" />
                                  </svg>
                              </button>
                              <button class="icon" data-testid="btn-settings" aria-label=${t('settings.title')} @click=${() => this.open('settings')}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <circle cx="12" cy="12" r="3" />
                                      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                                  </svg>
                              </button>`
                }
            </header>
            ${
                this.applyUpdate
                    ? html`<p class="update" role="status" data-testid="update-ready">
                          <span>${t('update.ready')}</span>
                          <button data-testid="update-apply" @click=${() => this.applyUpdate?.()}>${t('update.apply')}</button>
                      </p>`
                    : nothing
            }
            <main data-testid="app">
                <jq-make ?hidden=${sub}></jq-make>
                ${this.route === 'history' ? html`<jq-history @open-code=${this.openCode}></jq-history>` : nothing}
                ${this.route === 'settings' ? html`<jq-settings></jq-settings>` : nothing}
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-app': AppRoot;
    }
}
