#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
/**
 * test-android.mjs: run the Maestro flows on your USB phone.
 *
 *   npm run test:android                 install the Just QR Dev build, then run all flows
 *   npm run test:android -- --no-install run the flows on the Just QR Dev already installed
 *   npm run test:android -- <flow.yaml>  run one flow instead of all
 *
 * The flows always target Just QR Dev (org.openwaqf.justqr.dev), never the Play Store
 * app, so your real history is never touched.
 * Keep the phone unlocked with the screen on while the flows run.
 */
import fs from 'node:fs';
import path from 'node:path';
import {androidEnv, ROOT, requireDevice} from './android-env.mjs';

const APP_ID = 'org.openwaqf.justqr.dev';
const args = process.argv.slice(2);
const noInstall = args.includes('--no-install');
const flow = args.find((a) => a.endsWith('.yaml')) || 'maestro/android/suite.yaml';
const env = androidEnv();

function findMaestro() {
    const which = spawnSync('which', ['maestro'], {encoding: 'utf8'});
    if (which.status === 0) return which.stdout.trim();
    const home = path.join(process.env.HOME || '', '.maestro/bin/maestro');
    return fs.existsSync(home) ? home : null;
}

const maestro = findMaestro();
if (!maestro) {
    console.error('✖ Maestro is not installed. It drives the app on your phone for these tests.');
    console.error('  Install it once (needs Java 17+, which you already have for Android):');
    console.error('    curl -Ls "https://get.maestro.mobile.dev" | bash');
    console.error('  Then open a new terminal and run `npm run test:android` again.');
    process.exit(1);
}
if (!fs.existsSync(path.join(ROOT, flow))) {
    console.error(`✖ Flow not found: ${flow}`);
    process.exit(1);
}
requireDevice(env);

if (!noInstall) {
    console.log('▶ Installing a fresh Just QR Dev build on the phone…');
    const r = spawnSync('node', ['scripts/run-android.mjs'], {stdio: 'inherit', cwd: ROOT, env});
    if (r.status !== 0) {
        console.error('\n✖ Could not install Just QR Dev (see above), so the flows were not run.');
        process.exit(1);
    }
}

// Saved codes in the phone's Documents/Just QR folder (read only: nothing on the phone is deleted).
function savedCodesOnPhone() {
    const r = spawnSync('adb', ['shell', 'ls', '"/sdcard/Documents/Just QR/"'], {encoding: 'utf8', env});
    return new Set((r.stdout || '').split(/\s+/).filter((f) => /^just-qr-.*\.png$/.test(f)));
}
const savesACode = /suite\.yaml$|01-make-and-save\.yaml$/.test(flow);
const before = savesACode ? savedCodesOnPhone() : new Set();
const startedAt = Date.now();

console.log(`▶ Running ${flow} on Just QR Dev (keep the phone unlocked)…`);
const r = spawnSync(maestro, ['test', '-e', `APP_ID=${APP_ID}`, flow], {stdio: 'inherit', cwd: ROOT, env});
if (r.status !== 0) {
    console.error(
        '\n✖ Some Maestro flows failed (see above). Screenshots of failures are in ~/.maestro/tests/.',
    );
    process.exit(1);
}
if (savesACode) {
    // A new file must have appeared in the folder during this run.
    const r = spawnSync(
        'adb',
        ['shell', 'stat', '-c', '%Y %n', '"/sdcard/Documents/Just QR/"just-qr-*.png'],
        {encoding: 'utf8', env},
    );
    const newest = Math.max(
        0,
        ...(r.stdout || '').split('\n').map((l) => Number(l.split(' ')[0]) * 1000 || 0),
    );
    if (newest < startedAt - 5000) {
        console.error(
            "\n✖ The flows passed, but no PNG was written to the phone's Documents/Just QR folder.",
        );
        process.exit(1);
    }
    const added = [...savedCodesOnPhone()].filter((f) => !before.has(f));
    console.log(
        `✓ Saved on the phone: Documents/Just QR/${added.length ? added.join(', ') : '(file of today, rewritten)'}`,
    );
}
console.log('\n✓ All Maestro flows passed on the phone.');
