#!/usr/bin/env node
/**
 * make-icons.mjs: draws the PNG app icons from public/icons/icon.svg.
 *
 *   npm run icons
 *
 * Uses Playwright's Chromium (already installed for the tests), so no image package is
 * needed. Run it again after changing icon.svg, and commit the PNGs.
 * The maskable icon has extra space around it: Android crops it to a circle or a squircle.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public/icons');
const svg = fs.readFileSync(path.join(DIR, 'icon.svg'), 'utf8');
const data = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const icons = [
    {file: 'icon-192.png', size: 192, pad: 0, bg: 'transparent'},
    {file: 'icon-512.png', size: 512, pad: 0, bg: 'transparent'},
    {file: 'icon-maskable-512.png', size: 512, pad: 0.12, bg: '#0b6e6a'},
];

// Android adaptive icon sources for `npx @capacitor/assets generate --android` (in assets/):
// the white glyph alone (foreground, inside the middle 66% that every phone shows) and the
// teal background. The glyph is the icon without its own rounded square.
const glyph = svg
    .replace(/<rect width="48" height="48" rx="10" fill="#0b6e6a"\/>/, '')
    .replace('viewBox="0 0 48 48"', 'viewBox="-12 -12 72 72"');
const glyphData = `data:image/svg+xml;base64,${Buffer.from(glyph).toString('base64')}`;
const ASSETS = path.join(ROOT, 'assets');
fs.mkdirSync(ASSETS, {recursive: true});
const androidIcons = [
    {file: 'icon-foreground.png', img: glyphData, bg: 'transparent'},
    {file: 'icon-background.png', img: null, bg: '#0b6e6a'},
    {file: 'icon-only.png', img: glyphData, bg: '#0b6e6a'},
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const {file, size, pad, bg} of icons) {
    const inner = Math.round(size * (1 - 2 * pad));
    await page.setViewportSize({width: size, height: size});
    await page.setContent(
        `<body style="margin:0;background:${bg};display:grid;place-items:center;width:${size}px;height:${size}px">` +
            `<img src="${data}" width="${inner}" height="${inner}"></body>`,
    );
    await page.screenshot({path: path.join(DIR, file), omitBackground: bg === 'transparent'});
    console.log(`✓ ${file} (${size} px)`);
}
for (const {file, img, bg} of androidIcons) {
    await page.setViewportSize({width: 1024, height: 1024});
    await page.setContent(
        `<body style="margin:0;background:${bg};width:1024px;height:1024px">` +
            (img ? `<img src="${img}" width="1024" height="1024">` : '') +
            '</body>',
    );
    await page.screenshot({path: path.join(ASSETS, file), omitBackground: bg === 'transparent'});
    console.log(`✓ assets/${file} (1024 px)`);
}
await browser.close();
console.log('Android: run `npx @capacitor/assets generate --android` to make the app icons from assets/.');
