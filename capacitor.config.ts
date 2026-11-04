import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'org.openwaqf.justqr',
    appName: 'Just QR',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
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
