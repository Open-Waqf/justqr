// All texts of the app, in every language, in one file.
// scripts/check-i18n.mjs checks that every language has every text and every text is used.
// French, Spanish, Italian and Arabic were written with AI help: docs/TRANSLATIONS.md lists
// what still needs a native speaker's review.

export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'it';
export const LOCALES: readonly Locale[] = ['en', 'ar', 'fr', 'es', 'it'];
export const LOCALE_NAMES: Record<Locale, string> = {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    es: 'Español',
    it: 'Italiano',
};
const STORAGE_KEY = 'justqr.locale';

const EN_MESSAGES = {
    'make.honest': 'This code holds your link directly. It works forever, and nobody can track who scans it.',
} as const;

export type MessageKey = keyof typeof EN_MESSAGES;
type Messages = Record<MessageKey, string>;

const AR_MESSAGES: Messages = {
    'make.honest': 'هذا الرمز يحمل رابطك مباشرة. يعمل إلى الأبد، ولا يمكن لأحد تتبع من يمسحه.',
};

const FR_MESSAGES: Messages = {
    'make.honest':
        'Ce code contient votre lien directement. Il fonctionne pour toujours, et personne ne peut savoir qui le scanne.',
};

const ES_MESSAGES: Messages = {
    'make.honest':
        'Este código contiene tu enlace directamente. Funciona para siempre y nadie puede rastrear quién lo escanea.',
};

const IT_MESSAGES: Messages = {
    'make.honest':
        'Questo codice contiene direttamente il tuo link. Funziona per sempre e nessuno può sapere chi lo scansiona.',
};

const MESSAGES: Record<Locale, Messages> = {
    en: EN_MESSAGES,
    ar: AR_MESSAGES,
    fr: FR_MESSAGES,
    es: ES_MESSAGES,
    it: IT_MESSAGES,
};

let current: Locale = 'en';

/** The text for `key` in the current language, with {{name}} placeholders filled in. */
export function t(key: MessageKey, vars: Record<string, string | number> = {}): string {
    const text = MESSAGES[current][key] ?? EN_MESSAGES[key];
    return text.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? ''));
}

export const getLocale = (): Locale => current;
export const dirOf = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr');

/** First supported language from the saved choice, then the phone's languages, else English. */
export function pickLocale(saved: string | null, preferred: readonly string[]): Locale {
    const ok = (code: string) => LOCALES.find((l) => l === code.toLowerCase().split('-')[0]);
    if (saved && ok(saved)) return ok(saved)!;
    for (const code of preferred) {
        const found = ok(code);
        if (found) return found;
    }
    return 'en';
}

export function initialLocale(): Locale {
    let saved: string | null = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch {
        // Storage can be blocked; the phone's language is still used.
    }
    return pickLocale(saved, navigator.languages ?? [navigator.language]);
}

/** Switches the language, sets lang and dir on <html>, and tells the app to redraw. */
export function applyLocale(locale: Locale, save = false): void {
    current = locale;
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
    if (save) {
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch {
            // Not saved; the choice still applies until the app closes.
        }
    }
    window.dispatchEvent(new CustomEvent('jq-locale'));
}
