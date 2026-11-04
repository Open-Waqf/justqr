import {css, html, nothing} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {t} from '../lib/i18n';
import type {SavedCode} from '../lib/store';
import './history-page';
import './make-page';
import type {MakePage} from './make-page';
import {hiddenStyles, LocalizedElement} from './ui';

type Route = 'make' | 'history';

/** The hash is the route, so the phone's Back button works: "" is Make, "#history" is History. */
function routeFromHash(): Route {
    return location.hash === '#history' ? 'history' : 'make';
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
    `,
    ];

    @state() private route: Route = routeFromHash();
    @query('jq-make') private make!: MakePage;

    private onHash = () => {
        this.route = routeFromHash();
    };

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('hashchange', this.onHash);
    }

    disconnectedCallback(): void {
        window.removeEventListener('hashchange', this.onHash);
        super.disconnectedCallback();
    }

    firstUpdated(): void {
        // The startup test reads this mark (tests/e2e/startup.spec.ts).
        performance.mark('jq-ready');
    }

    private goBack() {
        // Back to Make. history.back() when History was opened from Make, so the phone's
        // Back stays in step; a fresh "#history" load has nothing to go back to.
        if (history.length > 1 && history.state?.jq === 'history') history.back();
        else location.hash = '';
    }

    private openHistory() {
        history.pushState({jq: 'history'}, '', '#history');
        this.onHash();
    }

    private openCode(e: CustomEvent<SavedCode>) {
        this.make.load(e.detail);
        this.goBack();
    }

    render() {
        const dir = document.documentElement.dir;
        const onHistory = this.route === 'history';
        return html`
            <header class=${onHistory ? 'sub' : ''} dir=${dir}>
                ${
                    onHistory
                        ? html`<button class="icon back" data-testid="btn-back" aria-label=${t('nav.back')} @click=${this.goBack}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                              </button>
                              <h1>${t('history.title')}</h1>`
                        : html`<h1>Just QR</h1>
                              <button class="icon" data-testid="btn-history" aria-label=${t('history.title')} @click=${this.openHistory}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" />
                                  </svg>
                              </button>`
                }
            </header>
            <main data-testid="app">
                <jq-make ?hidden=${onHistory}></jq-make>
                ${onHistory ? html`<jq-history @open-code=${this.openCode}></jq-history>` : nothing}
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-app': AppRoot;
    }
}
