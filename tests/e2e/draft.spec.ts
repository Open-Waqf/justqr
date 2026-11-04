import {readCode} from './support/qr';
import {expect, openApp, test} from './support/test';

// Android closes apps in the background. What the user was typing comes back on the next start.

test('what was typed comes back after the app is closed and reopened', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-wifi').click();
    await page.getByTestId('f-ssid').fill('Home');
    await page.getByTestId('f-password').fill('p4ss');
    await page.getByTestId('style-toggle').click();
    await page.getByTestId('style-fg').fill('#0b3d3a');
    // Leaving the page writes the draft at once (pagehide), no need to wait.
    await page.reload();
    await expect(page.getByTestId('draft-restored')).toBeVisible();
    await expect(page.getByTestId('type-wifi')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('f-ssid')).toHaveValue('Home');
    await expect(page.getByTestId('f-password')).toHaveValue('p4ss');
    await expect(page.getByTestId('style-toggle')).toContainText('Custom');
    expect(await readCode(page.getByTestId('preview-img'))).toBe('WIFI:T:WPA;S:Home;P:p4ss;;');
});

test('the draft is also written a moment after typing, in case of a crash', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('open-waqf.org');
    await page.waitForTimeout(1200);
    // Read the storage directly, without leaving the page (a crash fires no unload events).
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('justqr.draft') ?? '{}'));
    expect(saved.fields?.link?.url).toBe('open-waqf.org');
});

test('Start fresh forgets the draft', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('open-waqf.org');
    await page.reload();
    await page.getByTestId('draft-fresh').click();
    await expect(page.getByTestId('draft-restored')).toHaveCount(0);
    await expect(page.getByTestId('f-url')).toHaveValue('');
    await page.reload();
    await expect(page.getByTestId('draft-restored')).toHaveCount(0);
    await expect(page.getByTestId('f-url')).toHaveValue('');
});

test('an empty form leaves no draft to restore', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-text').click();
    await page.reload();
    await expect(page.getByTestId('draft-restored')).toHaveCount(0);
});

test('opening a saved code replaces the draft notice', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('a.org');
    await Promise.all([page.waitForEvent('download'), page.getByTestId('btn-save').click()]);
    await page.getByTestId('f-url').fill('b.org');
    await page.reload();
    await expect(page.getByTestId('draft-restored')).toBeVisible();
    await page.getByTestId('btn-history').click();
    await page.getByTestId('history-open').click();
    await expect(page.getByTestId('draft-restored')).toHaveCount(0);
    await expect(page.getByTestId('f-url')).toHaveValue('a.org');
});

test('the restored notice reads right to left @rtl-only', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('a.org');
    await page.reload();
    await expect(page.getByTestId('draft-restored')).toContainText('توقفت');
});
