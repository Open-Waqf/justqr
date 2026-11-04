import './app/app-root';
import {registerSW} from 'virtual:pwa-register';
import {applyLocale, initialLocale} from './lib/i18n';
import {applyTheme, savedTheme} from './lib/theme';

applyTheme(savedTheme());
applyLocale(initialLocale());

// Offline use on the web: the service worker keeps every file of the app. Inside the
// Android app the files are already on the phone, so it is not needed there.
const native = (window as {Capacitor?: {isNativePlatform?: () => boolean}}).Capacitor?.isNativePlatform?.();
if (!native && 'serviceWorker' in navigator) {
    const update = registerSW({
        immediate: true,
        onNeedRefresh() {
            // A new version is ready. The app shows a quiet "Update" banner; nothing reloads
            // by itself while someone is typing.
            window.dispatchEvent(new CustomEvent('jq-update-ready', {detail: {apply: () => update(true)}}));
        },
    });
}
