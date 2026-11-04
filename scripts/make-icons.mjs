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
await browser.close();
