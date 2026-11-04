import os from 'node:os';
import {defineConfig, devices} from '@playwright/test';

// The browser tests always run against the production build (dist/) through `vite preview`.
// The app is small, so building first costs a few seconds, and this way the code tested is
// the code shipped, service worker included (Signer's release tested the dev server).
//
// Tests start their own fresh server on their own port, never one already running
// (Signer lesson: a server left running for hours served stale code).
const PORT = 5185;

// Chrome's own background traffic would trip the network guard (tests/e2e/support/test.ts).
const quietChrome = [
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-domain-reliability',
    '--disable-sync',
    '--metrics-recording-only',
];

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    // At most 4 browsers at once locally, fewer when memory is short (each needs about
    // 600 MB; with work services running, 4 browsers crashed with "Target crashed"). Two on CI.
    workers: process.env.CI ? 2 : Math.max(1, Math.min(4, Math.floor(os.freemem() / (600 * 1024 * 1024)))),
    // The HTML report is written but never opens by itself (it would block `npm run check`).
    reporter: [['list'], ['html', {open: 'never'}]],
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'on-first-retry',
        launchOptions: {args: quietChrome},
    },
    webServer: {
        command: `npx vite preview --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: false,
        timeout: 60 * 1000,
    },
    // Tags in test titles choose who runs what:
    //   phone     every test on a phone screen, except @desktop and @rtl-only
    //   phone-ar  the @rtl and @rtl-only tests, in Arabic (right-to-left)
    //   desktop   every test on a desktop screen, except @phone and @rtl-only
    // `npm run check` runs phone + phone-ar. GitHub runs all three.
    projects: [
        {name: 'phone', use: {...devices['Pixel 5'], locale: 'en-US'}, grepInvert: /@desktop|@rtl-only/},
        {name: 'phone-ar', use: {...devices['Pixel 5'], locale: 'ar'}, grep: /@rtl/},
        {
            name: 'desktop',
            use: {...devices['Desktop Chrome'], locale: 'en-US'},
            grepInvert: /@phone|@rtl-only/,
        },
    ],
});
