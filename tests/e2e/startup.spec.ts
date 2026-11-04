import {expect, openApp, test} from './support/test';

// Startup must never get slower. The time from navigation to the first drawn screen is
// printed on every run (compare it before and after a change that touches startup), and the
// test fails only above a generous limit: CI machines are noisy (Lens lesson).
const LIMIT_MS = 2000;

test('opens fast @desktop', async ({page}, info) => {
    await openApp(page);
    const ms = await page.evaluate(() => performance.getEntriesByName('jq-ready')[0]?.startTime ?? -1);
    console.log(`Startup: ${Math.round(ms)} ms to first screen (limit ${LIMIT_MS} ms)`);
    info.annotations.push({type: 'startup-ms', description: String(Math.round(ms))});
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThan(LIMIT_MS);
});
