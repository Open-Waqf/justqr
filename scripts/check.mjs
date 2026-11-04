#!/usr/bin/env node
/**
 * check.mjs: everything to run before a commit, in one command.
 *
 *   npm run check
 *
 * Runs in order and stops at the first failure (fast checks first, so a typo fails in
 * seconds, not after the browser tests):
 *   1. lint and format   Biome (`npm run format` fixes most of it)
 *   2. typecheck         tsc, on the app, the tests and the scripts
 *   3. translations      scripts/check-i18n.mjs
 *   4. unit tests        Vitest, with the coverage threshold on src/lib
 *   5. build             the production build in dist/
 *   6. size              scripts/check-size.mjs
 *   7. browser tests     Playwright against that build, on a phone screen plus the Arabic
 *                        right-to-left set. Every test also fails if the app tries to reach
 *                        the network, and the accessibility tests run axe.
 *
 *   npm run check -- --desktop   also run every browser test on a desktop screen
 *                                (GitHub always does).
 */
import {spawnSync} from 'node:child_process';

const desktop = process.argv.includes('--desktop');
const projects = desktop ? [] : ['--project=phone', '--project=phone-ar'];
const env = {
    ...process.env,
    PLAYWRIGHT_HOST_PLATFORM_OVERRIDE: process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE || 'ubuntu24.04-x64',
};

const where = desktop ? 'phone, Arabic, desktop' : 'phone, Arabic';
const steps = [
    {
        name: 'Lint and format',
        cmd: 'npx',
        args: ['biome', 'ci', '.'],
        hint: 'Run `npm run format`, then fix what is left.',
    },
    {
        name: 'Typecheck',
        cmd: 'npx',
        args: ['tsc', '-p', 'tsconfig.json', '--noEmit'],
        hint: 'Fix the TypeScript errors above.',
    },
    {
        name: 'Translations',
        cmd: 'node',
        args: ['scripts/check-i18n.mjs'],
        hint: 'Fix src/lib/i18n.ts as listed above.',
    },
    {
        name: 'Unit tests',
        cmd: 'npx',
        args: ['vitest', 'run', '--coverage'],
        hint: 'See the failing tests or the coverage above.',
    },
    {
        name: 'Build',
        cmd: 'npx',
        args: ['vite', 'build', '--logLevel', 'warn'],
        hint: 'Fix the build errors above.',
    },
    {name: 'Size', cmd: 'node', args: ['scripts/check-size.mjs'], hint: 'See the biggest files above.'},
    {
        name: `Browser tests (${where})`,
        cmd: 'npx',
        args: ['playwright', 'test', ...projects],
        hint: 'See the failing tests above. `npx playwright show-report` opens the details.',
    },
];

const started = Date.now();
const times = [];
for (const [i, step] of steps.entries()) {
    console.log(`\n▶ ${i + 1}/${steps.length} ${step.name}…`);
    const t0 = Date.now();
    const r = spawnSync(step.cmd, step.args, {stdio: 'inherit', env});
    times.push(`${step.name} ${Math.round((Date.now() - t0) / 1000)} s`);
    if (r.status !== 0) {
        console.error(`\n✖ ${step.name} failed. ${step.hint}`);
        const skipped = steps.slice(i + 1).map((s) => s.name.toLowerCase());
        if (skipped.length) console.error(`  Not run yet: ${skipped.join(', ')}.`);
        console.error('  Fix it, then run `npm run check` again.');
        process.exit(1);
    }
}
console.log(
    `\n✓ All checks passed in ${Math.round((Date.now() - started) / 1000)} s (${times.join(', ')}). Safe to commit.`,
);
