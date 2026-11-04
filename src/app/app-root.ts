import {css, html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import './make-page';

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
    `;

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
                <jq-make></jq-make>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-app': AppRoot;
    }
}
