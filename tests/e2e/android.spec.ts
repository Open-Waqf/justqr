// The Android app's own behaviour, with the fake bridge (support/native-fake.ts).
// Real Android (share sheet, files on the phone, system bars) is checked by the Maestro flows.
import {decodePngFile} from '../support/decode';
import {fakeAndroid, nativeCalls, nativeFiles, pressBack} from './support/native-fake';
import {expect, openApp, type Page, test} from './support/test';

const LINK = 'https://open-waqf.org/menu';

async function withCode(page: Page) {
    await openApp(page);
    await page.getByTestId('f-url').fill('open-waqf.org/menu');
    await expect(page.getByTestId('preview-img')).toBeVisible();
}

test('Save writes a PNG into Documents/Just QR, and it decodes', async ({page}) => {
    await fakeAndroid(page);
    await withCode(page);
    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('toast')).toHaveText('Saved in Documents/Just QR');
    const write = (await nativeCalls(page, 'Filesystem')).find((c) => c.method === 'writeFile')!;
    expect(write.options).toMatchObject({directory: 'DOCUMENTS', recursive: true});
    expect(write.options.path).toMatch(/^Just QR\/just-qr-link-\d{4}-\d{2}-\d{2}-\d{6}\.png$/);
    const png = Buffer.from(write.options.data, 'base64');
    expect(await decodePngFile(new Uint8Array(png))).toEqual({jsqr: LINK, zxing: LINK});
});

test('Save as SVG also goes to Documents/Just QR', async ({page}) => {
    await fakeAndroid(page);
    await withCode(page);
    await page.getByTestId('btn-more').click();
    await page.getByTestId('menu-svg').click();
    await expect(page.getByTestId('toast')).toHaveText('Saved in Documents/Just QR');
    const files = await nativeFiles(page);
    const svg = Object.entries(files).find(([uri]) => uri.endsWith('.svg'));
    expect(svg?.[0]).toMatch(/Documents\/Just QR\/just-qr-link-.*\.svg$/);
    expect(Buffer.from(svg![1], 'base64').toString()).toContain('<svg');
});

test('Share hands the PNG to the Android share sheet', async ({page}) => {
    await fakeAndroid(page);
    await withCode(page);
    await page.getByTestId('btn-share').click();
    await expect.poll(async () => (await nativeCalls(page, 'Share')).length, {timeout: 10_000}).toBe(1);
    const [shareCall] = await nativeCalls(page, 'Share');
    expect(shareCall.options.files).toEqual([expect.stringMatching(/\/cache\/just-qr-link-.*\.png$/)]);
    await page.getByTestId('btn-history').click();
    await expect(page.getByTestId('history-item')).toHaveCount(1);
});

test('closing the share sheet keeps nothing in the history', async ({page}) => {
    await fakeAndroid(page, {cancelShare: true});
    await withCode(page);
    await page.getByTestId('btn-share').click();
    await expect.poll(async () => (await nativeCalls(page, 'Share')).length, {timeout: 10_000}).toBe(1);
    await expect(page.getByTestId('toast')).toHaveCount(0);
    await page.getByTestId('btn-history').click();
    await expect(page.getByTestId('history-empty')).toBeVisible();
});

test('a full phone shows a clear failure', async ({page}) => {
    await fakeAndroid(page, {failWrite: true});
    await withCode(page);
    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('toast')).toContainText('did not work');
});

test('Android 10 and older: saying no to storage access explains what to do, and asks only once', async ({
    page,
}) => {
    await fakeAndroid(page, {denyStorage: true});
    await withCode(page);
    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('toast')).toContainText('allow storage access');
    const fs = await nativeCalls(page, 'Filesystem');
    expect(fs.map((c) => c.method)).toEqual(['requestPermissions']);
    await page.getByTestId('btn-history').click();
    await expect(page.getByTestId('history-empty')).toBeVisible();
});

test('Copy copies the text, and there is no Print in the app', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await fakeAndroid(page);
    await withCode(page);
    await page.getByTestId('btn-more').click();
    await expect(page.getByTestId('menu-print')).toHaveCount(0);
    await page.getByTestId('menu-copy').click();
    await expect(page.getByTestId('toast')).toHaveText('Copied as text');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(LINK);
});

test('Back closes the menu, then History, then sends the app to the background', async ({page}) => {
    await fakeAndroid(page);
    await withCode(page);
    await page.getByTestId('btn-more').click();
    await pressBack(page);
    await expect(page.getByTestId('menu')).toHaveCount(0);
    await page.getByTestId('btn-history').click();
    await pressBack(page);
    await expect(page.getByTestId('f-url')).toBeVisible();
    expect((await nativeCalls(page, 'App')).filter((c) => c.method === 'minimizeApp')).toHaveLength(0);
    await pressBack(page);
    await expect
        .poll(async () => (await nativeCalls(page, 'App')).filter((c) => c.method === 'minimizeApp').length)
        .toBe(1);
});

test('the system bar icons follow the theme', async ({page}) => {
    await fakeAndroid(page);
    await openApp(page);
    const styles = async () => (await nativeCalls(page, 'SystemBars')).map((c) => c.options.style);
    expect(await styles()).toEqual(['DEFAULT']);
    await page.getByTestId('btn-settings').click();
    await page.getByTestId('theme-oled').click();
    await page.getByTestId('theme-light').click();
    expect(await styles()).toEqual(['DEFAULT', 'DARK', 'LIGHT']);
});

test('the Android app does not register a service worker', async ({page}) => {
    await fakeAndroid(page);
    await openApp(page);
    await page.waitForTimeout(500);
    expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(
        0,
    );
});

test('nothing hides under the status bar or the navigation bar', async ({page}) => {
    await fakeAndroid(page);
    await withCode(page);
    // What Capacitor sets in the Android app (edge to edge): the heights of both bars.
    await page.evaluate(() => {
        document.documentElement.style.setProperty('--safe-area-inset-top', '48px');
        document.documentElement.style.setProperty('--safe-area-inset-bottom', '40px');
    });
    for (const id of ['btn-history', 'btn-settings']) {
        const box = await page.getByTestId(id).boundingBox();
        expect(box!.y, `${id} under the status bar`).toBeGreaterThanOrEqual(48);
    }
    const height = page.viewportSize()!.height;
    const save = await page.getByTestId('btn-save').boundingBox();
    expect(save!.y + save!.height, 'Save under the navigation bar').toBeLessThanOrEqual(height - 40);
});

test('saving twice in the same second never replaces the first file', async ({page}) => {
    await fakeAndroid(page);
    await withCode(page);
    await page.clock.install({time: new Date('2026-11-04T10:00:00')});
    await page.clock.pauseAt(new Date('2026-11-04T10:00:00'));
    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('toast')).toHaveText('Saved in Documents/Just QR');
    await page.getByTestId('btn-save').click();
    await expect
        .poll(async () => Object.keys(await nativeFiles(page)).map((u) => u.split('/').pop()))
        .toEqual(['just-qr-link-2026-11-04-100000.png', 'just-qr-link-2026-11-04-100000-2.png']);
});

test('a file left by an earlier install does not block saving', async ({page}) => {
    await fakeAndroid(page, {foreignFiles: ['Just QR/just-qr-link-2026-11-04-100000.png']});
    await withCode(page);
    await page.clock.install({time: new Date('2026-11-04T10:00:00')});
    await page.clock.pauseAt(new Date('2026-11-04T10:00:00'));
    await page.getByTestId('btn-save').click();
    await expect(page.getByTestId('toast')).toHaveText('Saved in Documents/Just QR');
    expect(Object.keys(await nativeFiles(page)).map((u) => u.split('/').pop())).toEqual([
        'just-qr-link-2026-11-04-100000-2.png',
    ]);
});
