#!/usr/bin/env node
/**
 * check-size.mjs: the app must stay small, so it opens at once on any phone.
 *
 *   npm run check-size      (after `npm run build`)
 *
 * Adds up the JavaScript and CSS in dist/ that the page loads (the service worker files are
 * counted apart: they are not on the startup path) and fails above the budget. The real
 * size is printed on every run, so growth is seen long before the budget is reached.
 * Raise the budget only on purpose, with the reason in the commit message.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';

const BUDGET_KB = 250;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
if (!fs.existsSync(DIST)) {
    console.error('✖ No dist/ folder. Run `npm run build` first.');
    process.exit(1);
}

const files = [];
const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.(js|css)$/.test(f)) files.push(p);
    }
};
walk(DIST);

const isWorker = (p) => /(^|\/)(sw|workbox-[\w-]+)\.js$/.test(path.relative(DIST, p));
const sum = (list, fn) => list.reduce((n, p) => n + fn(fs.readFileSync(p)), 0);
const kb = (bytes) => (bytes / 1024).toFixed(1);

const app = files.filter((p) => !isWorker(p));
const worker = files.filter(isWorker);
const raw = sum(app, (b) => b.length);
const gz = sum(app, (b) => gzipSync(b).length);
const sw = sum(worker, (b) => b.length);

const line = `app ${kb(raw)} KB (${kb(gz)} KB gzipped), service worker ${kb(sw)} KB. Budget ${BUDGET_KB} KB.`;
if (raw > BUDGET_KB * 1024) {
    console.error(`✖ Too big: ${line}`);
    for (const p of app.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)) {
        console.error(`   ${kb(fs.statSync(p).size).padStart(7)} KB  ${path.relative(ROOT, p)}`);
    }
    process.exit(1);
}
console.log(`✓ Size OK: ${line}`);
