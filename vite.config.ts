import {readFileSync} from 'node:fs';
import {VitePWA} from 'vite-plugin-pwa';
import {defineConfig} from 'vitest/config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig({
    define: {__APP_VERSION__: JSON.stringify(pkg.version)},
    // Relative paths: the same build runs on the web and inside the Android app.
    base: './',
    build: {outDir: 'dist', sourcemap: false},
    // Only scan index.html for dependencies. Without this, a cold Vite cache also scans the
    // web copy that `cap sync` puts in android/ (Signer lesson).
    optimizeDeps: {entries: ['index.html']},
    plugins: [
        VitePWA({
            strategies: 'generateSW',
            // 'prompt': a new version waits until the user taps "Update", so nobody loses
            // what they are typing to a reload.
            registerType: 'prompt',
            filename: 'sw.js',
            // The manifest comes from here only (no public/manifest.json: in Lens two
            // sources overwrote each other).
            manifestFilename: 'manifest.webmanifest',
            manifest: {
                name: 'Just QR',
                short_name: 'Just QR',
                description: 'QR codes that never expire. No account, no ads, no tracking.',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: './',
                scope: './',
                icons: [
                    {src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png'},
                    {src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png'},
                    {
                        src: 'icons/icon-maskable-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
                navigateFallback: 'index.html',
            },
        }),
    ],
    test: {
        include: ['tests/unit/**/*.test.ts'],
        environment: 'node',
        coverage: {
            provider: 'v8',
            // The pure logic (encoders, escaping, contrast, rendering) must be fully tested.
            // The UI is covered by the browser tests instead.
            include: ['src/lib/**/*.ts'],
            exclude: ['src/lib/i18n.ts'],
            thresholds: {lines: 90, functions: 90, branches: 85, statements: 90},
            reporter: ['text-summary', 'html'],
        },
    },
});
