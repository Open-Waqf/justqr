import {css, html, type TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {applyLocale, getLocale, LOCALE_NAMES, LOCALES, type Locale, type MessageKey, t} from '../lib/i18n';
import {applyTheme, savedTheme, THEMES, type Theme} from '../lib/theme';
import {matchSystemBars} from './native';
import {formStyles, LocalizedElement, nextOf, radioStep} from './ui';

const THEME_LABEL: Record<Theme, MessageKey> = {
    system: 'settings.theme_system',
    light: 'settings.theme_light',
    dark: 'settings.theme_dark',
    oled: 'settings.theme_oled',
};

/** Open-source parts inside the app, with their licences. */
const LIBRARIES: readonly [string, string][] = [
    ['Lit', 'BSD-3-Clause'],
    ['qrcode', 'MIT'],
    ['idb', 'ISC'],
    ['Workbox', 'MIT'],
];

@customElement('jq-settings')
export class SettingsPage extends LocalizedElement {
    static styles = [
        formStyles,
        css`
            :host {
                display: block;
                padding-bottom: 24px;
            }
            section {
                padding: 12px 0;
                border-bottom: 1px solid var(--divider);
            }
            h2 {
                font-size: 15px;
                font-weight: 600;
                margin: 4px 0 8px;
            }
            p {
                font-size: 15px;
                line-height: 1.5;
                margin: 6px 0;
            }
            .muted {
                color: var(--muted);
                font-size: 14px;
            }
            ul {
                margin: 6px 0;
                padding-inline-start: 20px;
                font-size: 14px;
                line-height: 1.7;
                color: var(--muted);
            }
            a {
                color: var(--accent);
            }
            .seg {
                flex-wrap: wrap;
            }
        `,
    ];

    @state() private theme: Theme = savedTheme();

    private setTheme(theme: Theme) {
        this.theme = theme;
        applyTheme(theme, true);
        matchSystemBars(theme);
    }

    private renderThemes(): TemplateResult {
        const onKey = (e: KeyboardEvent) => {
            const step = radioStep(e, this);
            if (!step) return;
            const next = nextOf(THEMES, this.theme, step);
            this.setTheme(next);
            this.updateComplete.then(() =>
                this.renderRoot.querySelector<HTMLElement>(`[data-testid="theme-${next}"]`)?.focus(),
            );
        };
        return html`<div class="seg" role="radiogroup" aria-labelledby="theme-label" @keydown=${onKey}>
            ${THEMES.map(
                (theme) =>
                    html`<button
                        role="radio"
                        data-testid=${`theme-${theme}`}
                        aria-checked=${theme === this.theme ? 'true' : 'false'}
                        tabindex=${theme === this.theme ? 0 : -1}
                        @click=${() => this.setTheme(theme)}
                    >
                        ${t(THEME_LABEL[theme])}
                    </button>`,
            )}
        </div>`;
    }

    render() {
        return html`
            <section>
                <label for="language">${t('settings.language')}</label>
                <select
                    id="language"
                    data-testid="language"
                    .value=${getLocale()}
                    @change=${(e: Event) => applyLocale((e.target as HTMLSelectElement).value as Locale, true)}
                >
                    ${LOCALES.map(
                        (l) =>
                            html`<option value=${l} lang=${l} ?selected=${l === getLocale()}>${LOCALE_NAMES[l]}</option>`,
                    )}
                </select>
                <label id="theme-label">${t('settings.theme')}</label>
                ${this.renderThemes()}
            </section>
            <section data-testid="privacy">
                <h2>${t('settings.privacy')}</h2>
                <p>${t('settings.privacy_text')}</p>
            </section>
            <section>
                <h2>${t('settings.about')}</h2>
                <p>${t('settings.about_text')}</p>
                <p class="muted" data-testid="version">${t('settings.version', {version: __APP_VERSION__})}</p>
                <p class="muted">
                    <a href="https://github.com/Open-Waqf/justqr" target="_blank" rel="noopener noreferrer"
                        >${t('settings.source')}</a
                    >
                </p>
            </section>
            <section>
                <h2>${t('settings.licences')}</h2>
                <p class="muted">${t('settings.licences_text')}</p>
                <ul data-testid="licences">
                    ${LIBRARIES.map(([name, licence]) => html`<li>${name}: ${licence}</li>`)}
                </ul>
            </section>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'jq-settings': SettingsPage;
    }
}
