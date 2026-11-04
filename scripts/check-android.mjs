#!/usr/bin/env node
/**
 * check-android.mjs: proves the Play Store build cannot track anyone.
 *
 *   npm run check:android          (after `npm run android:build`)
 *   node scripts/check-android.mjs path/to/app.apk
 *
 * Checks the release APK (unsigned is fine: the code is the same):
 *   1. permissions: none, except the one AndroidX adds for itself. In particular no INTERNET,
 *      so the app could not send anything even if a library tried.
 *   2. trackers: no analytics or crash-reporting library inside (scan from Lens).
 * GitHub runs it on every push (.github/workflows/ci.yml, job "android").
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {unzipSync} from 'fflate';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APK =
    process.argv[2] || path.join(ROOT, 'android/app/build/outputs/apk/release/app-release-unsigned.apk');
const APP_ID = 'org.openwaqf.justqr';
// AndroidX core adds this signature-level permission so the app's own broadcast receivers stay
// private. It gives no access to anything.
const ALLOWED = new Set([`${APP_ID}.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`]);

/** @type {[string, string[]][]} */
const TRACKERS = [
    ['Firebase Analytics', ['com/google/firebase/analytics']],
    ['Firebase Crashlytics', ['com/google/firebase/crashlytics']],
    ['Google Analytics', ['com/google/android/gms/analytics']],
    ['Sentry', ['io/sentry']],
    ['Amplitude', ['com/amplitude']],
    ['Mixpanel', ['com/mixpanel']],
    ['Segment', ['com/segment/analytics']],
    ['AppsFlyer', ['com/appsflyer']],
    ['Bugsnag', ['com/bugsnag']],
    ['Datadog', ['com/datadog']],
    ['PostHog', ['com/posthog']],
    ['Facebook SDK', ['com/facebook/appevents']],
];

if (!fs.existsSync(APK)) {
    console.error(`✖ No APK at ${path.relative(ROOT, APK)}. Run \`npm run android:build\` first.`);
    process.exit(1);
}

function aapt2() {
    const sdk =
        process.env.ANDROID_HOME ||
        process.env.ANDROID_SDK_ROOT ||
        path.join(process.env.HOME || '', 'Android/Sdk');
    const tools = path.join(sdk, 'build-tools');
    if (!fs.existsSync(tools)) return null;
    const versions = fs.readdirSync(tools).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    const bin = path.join(tools, versions.at(-1) ?? '', 'aapt2');
    return fs.existsSync(bin) ? bin : null;
}

const problems = [];

const tool = aapt2();
if (!tool) {
    problems.push('aapt2 not found (Android SDK build-tools). Set ANDROID_HOME.');
} else {
    const r = spawnSync(tool, ['dump', 'permissions', APK], {encoding: 'utf8'});
    if (r.status !== 0) problems.push(`aapt2 failed: ${r.stderr}`);
    const used = [...(r.stdout || '').matchAll(/uses-permission: name='([^']+)'/g)].map((m) => m[1]);
    for (const p of used)
        if (!ALLOWED.has(p)) problems.push(`permission ${p} (the store build must ask for none)`);
    const pkg = /^package: (\S+)/m.exec(r.stdout || '')?.[1];
    if (pkg !== APP_ID) problems.push(`package is ${pkg}, expected ${APP_ID} (is this the release build?)`);
}

const files = unzipSync(new Uint8Array(fs.readFileSync(APK)), {filter: (f) => f.name.endsWith('.dex')});
const dex = Object.values(files)
    .map((b) => Buffer.from(b).toString('latin1'))
    .join('\n');
for (const [name, needles] of TRACKERS) {
    if (needles.some((n) => dex.includes(n))) problems.push(`tracker inside: ${name}`);
}

if (problems.length) {
    console.error(`✖ ${path.relative(ROOT, APK)}:`);
    for (const p of problems) console.error(`   - ${p}`);
    process.exit(1);
}
console.log(
    `✓ ${path.basename(APK)}: no permissions (no INTERNET), no trackers in ${Object.keys(files).length} code file(s).`,
);
