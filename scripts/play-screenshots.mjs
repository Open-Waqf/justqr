#!/usr/bin/env node
/**
 * play-screenshots.mjs: the Google Play pictures, in every language, from the real app.
 *
 *   npm run build && npm run play:screenshots            -> ~/Downloads/qr-release/
 *   npm run play:screenshots -- /some/folder
 *
 * Writes, for each language (en, ar, fr, es, it):
 *   screenshots/<lang>-1-link.png ... <lang>-6-privacy.png   phone screenshots, 1080 x 2160
 *   feature-graphic-<lang>.png                                the store banner, 1024 x 500
 *
 * The screenshots are the production build (dist/) opened in Chromium at a phone size
 * (360 x 720 CSS pixels, drawn at 3x), with the examples filled in by this script. Nothing
 * is faked: what the picture shows is what the app does. Arabic is taken right to left.
 */
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(os.homedir(), 'Downloads/qr-release'));
const PORT = 5187;
const LANGS = ['en', 'ar', 'fr', 'es', 'it'];
const PHONE = {width: 360, height: 720, scale: 3}; // 1080 x 2160, the Play Store's favourite
const BANNER = {width: 1024, height: 500};

// What is typed in each picture. Real-looking, local to each language, and the same story
// everywhere: a small café called Noor.
const SAMPLES = {
    en: {
        link: 'noorcafe.example/menu',
        wifi: {ssid: 'Noor Cafe', password: 'mint-tea-2026'},
        contact: {first: 'Jane', last: 'Miller', phone: '+44 20 7946 0123', email: 'jane@noorcafe.example'},
        tagline: 'QR codes that never expire.',
        sub: 'Free. Offline. No account, no ads, no tracking.',
    },
    ar: {
        link: 'noorcafe.example/menu',
        wifi: {ssid: 'مقهى نور', password: 'شاي-نعناع-2026'},
        contact: {first: 'ليلى', last: 'حداد', phone: '+212 5 22 00 11 22', email: 'layla@noorcafe.example'},
        tagline: 'رموز QR لا تنتهي أبدًا.',
        sub: 'مجاني. بلا إنترنت. بلا حساب ولا إعلانات ولا تتبّع.',
    },
    fr: {
        link: 'noorcafe.example/menu',
        wifi: {ssid: 'Café Noor', password: 'the-menthe-2026'},
        contact: {
            first: 'Camille',
            last: 'Martin',
            phone: '+33 1 23 45 67 89',
            email: 'camille@noorcafe.example',
        },
        tagline: 'Des QR codes qui n’expirent jamais.',
        sub: 'Gratuit. Hors ligne. Sans compte, sans pub, sans pistage.',
    },
    es: {
        link: 'noorcafe.example/menu',
        wifi: {ssid: 'Café Noor', password: 'te-menta-2026'},
        contact: {first: 'Lucía', last: 'García', phone: '+34 912 34 56 78', email: 'lucia@noorcafe.example'},
        tagline: 'Códigos QR que nunca caducan.',
        sub: 'Gratis. Sin conexión. Sin cuenta, sin anuncios, sin rastreo.',
    },
    it: {
        link: 'noorcafe.example/menu',
        wifi: {ssid: 'Caffè Noor', password: 'te-menta-2026'},
        contact: {
            first: 'Giulia',
            last: 'Rossi',
            phone: '+39 06 1234 5678',
            email: 'giulia@noorcafe.example',
        },
        tagline: 'QR code che non scadono mai.',
        sub: 'Gratis. Offline. Senza account, pubblicità o tracciamento.',
    },
};

function fail(msg) {
    console.error(`\n✖ ${msg}`);
    process.exit(1);
}

/** The production build served by vite preview, like the tests. */
async function startServer() {
    if (!fs.existsSync(path.join(ROOT, 'dist/index.html'))) fail('No build. Run `npm run build` first.');
    const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
        cwd: ROOT,
        stdio: 'ignore',
    });
    const url = `http://localhost:${PORT}/`;
    for (let i = 0; i < 100; i++) {
        try {
            if ((await fetch(url)).ok) return {server, url};
        } catch {
            await new Promise((r) => setTimeout(r, 100));
        }
    }
    server.kill();
    fail(`vite preview did not start on port ${PORT}.`);
}

/** The logo in the middle of the styled code: a teal circle with a white N (for Noor). */
function logoPng() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="60" fill="#0b6e6a"/>
        <text x="64" y="86" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700"
            font-size="64" fill="#ffffff">N</text></svg>`;
    return {name: 'noor.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(svg)};
}

/** PNG width and height from the file header. */
function pngSize(file) {
    const b = fs.readFileSync(file);
    return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

async function openApp(browser, url, lang, theme = 'light') {
    const context = await browser.newContext({
        viewport: {width: PHONE.width, height: PHONE.height},
        deviceScaleFactor: PHONE.scale,
        isMobile: true,
        hasTouch: true,
        locale: lang,
        acceptDownloads: false,
    });
    await context.addInitScript(
        ({lang, theme}) => {
            localStorage.setItem('justqr.locale', lang);
            localStorage.setItem('justqr.theme', theme);
        },
        {lang, theme},
    );
    const page = await context.newPage();
    await page.goto(url);
    await page.getByTestId('app').waitFor();
    return page;
}

const field = (page, key) => page.getByTestId(`f-${key}`);

async function shot(page, lang, n, name) {
    const dir = path.join(OUT, 'screenshots');
    fs.mkdirSync(dir, {recursive: true});
    const file = path.join(dir, `${lang}-${n}-${name}.png`);
    // Fonts and the code image settle in a frame or two.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({path: file});
    const [w, h] = pngSize(file);
    const want = [PHONE.width * PHONE.scale, PHONE.height * PHONE.scale];
    if (w !== want[0] || h !== want[1]) fail(`${file} is ${w} x ${h}, Play wants ${want.join(' x ')}.`);
    return file;
}

async function screenshots(browser, url, lang) {
    const s = SAMPLES[lang];

    // 1. A link, with the live code and the honest line: the app's whole promise in one screen.
    let page = await openApp(browser, url, lang);
    await field(page, 'url').fill(s.link);
    await page.getByTestId('preview-img').waitFor();
    await field(page, 'url').blur();
    await shot(page, lang, 1, 'link');

    // 2. Wi-Fi, in the dark theme.
    await page.close();
    page = await openApp(browser, url, lang, 'dark');
    await page.getByTestId('type-wifi').click();
    await field(page, 'ssid').fill(s.wifi.ssid);
    await field(page, 'password').fill(s.wifi.password);
    await page.getByTestId('preview-img').waitFor();
    await page.getByTestId('f-password').blur();
    await shot(page, lang, 2, 'wifi');

    // 3. Style: own colours and a logo in the middle, with the panel open.
    await page.close();
    page = await openApp(browser, url, lang);
    await field(page, 'url').fill(s.link);
    await page.getByTestId('style-toggle').click();
    await page.getByTestId('style-fg').fill('#0b3d3a');
    await page.getByTestId('logo-file').setInputFiles(logoPng());
    await page.getByTestId('logo-thumb').waitFor();
    // The code, then the open panel with the colours and the logo, all on one screen.
    await page.getByTestId('preview').evaluate((el) => {
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 12);
    });
    await shot(page, lang, 3, 'style');

    // 4. A contact card.
    await page.close();
    page = await openApp(browser, url, lang);
    await page.getByTestId('type-contact').click();
    await field(page, 'firstName').fill(s.contact.first);
    await field(page, 'lastName').fill(s.contact.last);
    await field(page, 'phone').fill(s.contact.phone);
    await field(page, 'email').fill(s.contact.email);
    await page.getByTestId('preview-img').waitFor();
    await field(page, 'email').blur();
    await shot(page, lang, 4, 'contact');

    // 5. History: a few saved codes. Saving through the app, like a person would.
    await page.close();
    page = await openApp(browser, url, lang);
    const save = async () => {
        await page.getByTestId('preview-img').waitFor();
        await page.getByTestId('btn-save').click();
        await page.getByTestId('toast').waitFor();
        await page.getByTestId('toast').waitFor({state: 'hidden'});
    };
    await page.getByTestId('type-contact').click();
    await field(page, 'firstName').fill(s.contact.first);
    await field(page, 'lastName').fill(s.contact.last);
    await field(page, 'phone').fill(s.contact.phone);
    await save();
    await page.getByTestId('type-wifi').click();
    await field(page, 'ssid').fill(s.wifi.ssid);
    await field(page, 'password').fill(s.wifi.password);
    await save();
    await page.getByTestId('type-link').click();
    await field(page, 'url').fill(s.link);
    await save();
    await page.getByTestId('btn-history').click();
    await page.getByTestId('history-item').nth(2).waitFor();
    await shot(page, lang, 5, 'history');

    // 6. Settings: language, theme and the privacy promise.
    await page.getByTestId('btn-back').click();
    await page.getByTestId('btn-settings').click();
    await page.getByTestId('privacy').waitFor();
    await shot(page, lang, 6, 'privacy');
    await page.close();
}

/** The 1024 x 500 banner: icon, name and the one-line promise, on the app's teal. */
async function featureGraphic(browser, lang) {
    const s = SAMPLES[lang];
    const rtl = lang === 'ar';
    const icon = fs.readFileSync(path.join(ROOT, 'public/icons/icon.svg'), 'utf8');
    // The icon without its own rounded teal plate: the banner is the plate.
    const mark = icon.replace(/<rect[^>]*\/>/, '').replace(/<title>.*?<\/title>/, '');
    const html = `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
    <style>
        html, body { margin: 0; width: ${BANNER.width}px; height: ${BANNER.height}px; overflow: hidden; }
        body { background: #0b6e6a; color: #ffffff; font-family: system-ui, -apple-system, "Segoe UI", Roboto,
               "Noto Sans Arabic", sans-serif; display: flex; align-items: center; gap: 56px; padding: 0 88px;
               box-sizing: border-box; }
        .mark { width: 220px; height: 220px; flex: none; background: #ffffff; border-radius: 48px;
                display: grid; place-items: center; }
        .mark svg { width: 160px; height: 160px; }
        h1 { font-size: 92px; line-height: 1; margin: 0 0 18px; font-weight: 700; letter-spacing: -0.02em; }
        p { font-size: ${rtl ? 40 : 36}px; line-height: 1.3; margin: 0; }
        p + p { font-size: ${rtl ? 28 : 24}px; opacity: 0.85; margin-top: 10px; }
    </style></head><body>
        <div class="mark">${mark.replace('fill="#ffffff"', 'fill="#0b6e6a"')}</div>
        <div><h1>Just QR</h1><p>${s.tagline}</p><p>${s.sub}</p></div>
    </body></html>`;
    const page = await browser.newPage({viewport: BANNER, deviceScaleFactor: 1});
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(OUT, `feature-graphic-${lang}.png`);
    await page.screenshot({path: file});
    await page.close();
    const [w, h] = pngSize(file);
    if (w !== BANNER.width || h !== BANNER.height) fail(`${file} is ${w} x ${h}, Play wants 1024 x 500.`);
}

async function main() {
    process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE ??= 'ubuntu24.04-x64';
    fs.mkdirSync(OUT, {recursive: true});
    const {server, url} = await startServer();
    const browser = await chromium.launch();
    try {
        for (const lang of LANGS) {
            process.stdout.write(`▶ ${lang} `);
            await screenshots(browser, url, lang);
            await featureGraphic(browser, lang);
            console.log('✓');
        }
    } finally {
        await browser.close();
        server.kill();
    }
    console.log(
        `\n✓ ${LANGS.length * 6} screenshots (1080 x 2160) and ${LANGS.length} banners (1024 x 500) in ${OUT}`,
    );
}

main().catch((e) => fail(e?.stack || String(e)));
