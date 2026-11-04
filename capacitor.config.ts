import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'org.openwaqf.justqr',
    appName: 'Just QR',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        // Shown instead of a blank screen when the phone's WebView is older than the app needs.
        errorPath: 'webview-too-old.html',
    },
    android: {
        // The built code needs Chrome 111 or newer (Vite's default target). Any phone from
        // Android 7 on gets a newer WebView through the Play Store.
        minWebViewVersion: 111,
    },
    plugins: {
        // The app sets the system bar icons to match its theme at runtime (src/app/native.ts).
        // Until then, follow the phone.
        SystemBars: {
            style: 'DEFAULT',
        },
    },
};

export default config;
