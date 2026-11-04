import {css, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {t} from '../lib/i18n';

@customElement('jq-app')
export class AppRoot extends LitElement {
    static styles = css`
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
            padding: 12px 16px;
        }
        h1 {
            font-size: 20px;
            font-weight: 650;
            margin: 0;
        }
        main {
            flex: 1;
            padding: 0 16px 16px;
        }
        .honest {
            color: var(--muted);
            font-size: 14px;
            line-height: 1.45;
            text-align: center;
        }
    `;

    private onLocale = () => this.requestUpdate();

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('jq-locale', this.onLocale);
    }

    disconnectedCallback(): void {
        window.removeEventListener('jq-locale', this.onLocale);
        super.disconnectedCallback();
    }

    firstUpdated(): void {
        // The startup test reads this mark (tests/e2e/startup.spec.ts).
        performance.mark('jq-ready');
    }

    render() {
        return html`
            <header>
                <h1>Just QR</h1>
            </header>
            <main data-testid="app">
                <p class="honest" data-testid="honest-line">${t('make.honest')}</p>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-app': AppRoot;
    }
}
