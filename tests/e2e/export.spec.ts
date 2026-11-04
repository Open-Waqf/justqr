import fs from 'node:fs';
import {decodePngFile} from '../support/decode';
import {readCode} from './support/qr';
import {expect, openApp, type Page, test} from './support/test';

const LINK = 'https://open-waqf.org/menu?t=4';

async function withCode(page: Page) {
    await openApp(page);
    await page.getByTestId('f-url').fill(LINK);
    await expect(page.getByTestId('preview-img')).toBeVisible();
}

test('Save, Share and More are off until there is a code', async ({page}) => {
    await openApp(page);
    await expect(page.getByTestId('btn-save')).toBeDisabled();
    await expect(page.getByTestId('btn-more')).toBeDisabled();
    await page.getByTestId('f-url').fill('a.org');
    await expect(page.getByTestId('btn-save')).toBeEnabled();
});

test('Save gives a PNG that both decoders read back', async ({page}) => {
    await withCode(page);
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('btn-save').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^just-qr-link-\d{4}-\d{2}-\d{2}-\d{6}\.png$/);
    const bytes = new Uint8Array(fs.readFileSync(await download.path()));
    expect(await decodePngFile(bytes)).toEqual({jsqr: LINK, zxing: LINK});
    await expect(page.getByTestId('toast')).toBeVisible();
});

test('Save as SVG gives an SVG that reads back', async ({page}) => {
    await withCode(page);
    await page.getByTestId('btn-more').click();
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('menu-svg').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^just-qr-link-.*\.svg$/);
    const svg = fs.readFileSync(await download.path(), 'utf8');
    expect(svg.startsWith('<?xml')).toBe(true);
    // Show the downloaded file in the page and read it like a camera would.
    await page.evaluate((text) => {
        const img = document.createElement('img');
        img.id = 'svg-check';
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
        document.body.append(img);
    }, svg);
    expect(await readCode(page.locator('#svg-check'))).toBe(LINK);
});

test('Copy puts the image on the clipboard', async ({page, context, browserName}) => {
    test.skip(browserName !== 'chromium');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await withCode(page);
    await page.getByTestId('btn-more').click();
    await page.getByTestId('menu-copy').click();
    // "Copied" means the image was copied; "Copied as text" would mean the fallback ran.
    await expect(page.getByTestId('toast')).toHaveText('Copied');
    const types = await page.evaluate(async () => (await navigator.clipboard.read()).flatMap((i) => i.types));
    expect(types).toContain('image/png');
});

test('Print shows only the code and opens the print dialog', async ({page}) => {
    await page.addInitScript(() => {
        (window as unknown as {printed: number}).printed = 0;
        window.print = () => {
            (window as unknown as {printed: number}).printed++;
        };
    });
    await withCode(page);
    await page.getByTestId('btn-more').click();
    await page.getByTestId('menu-print').click();
    await expect.poll(() => page.evaluate(() => (window as unknown as {printed: number}).printed)).toBe(1);
    await page.emulateMedia({media: 'print'});
    await expect(page.locator('#print-area img')).toBeVisible();
    await expect(page.locator('jq-app')).toBeHidden();
    expect(await readCode(page.locator('#print-area img'))).toBe(LINK);
});

test('Share sends a PNG to the phone share sheet @phone', async ({page}) => {
    await page.addInitScript(() => {
        const shared: {name: string; type: string}[] = [];
        (window as unknown as {shared: typeof shared}).shared = shared;
        navigator.canShare = () => true;
        navigator.share = async (data?: ShareData) => {
            for (const f of data?.files ?? []) shared.push({name: f.name, type: f.type});
        };
    });
    await withCode(page);
    await page.getByTestId('btn-share').click();
    await expect
        .poll(() => page.evaluate(() => (window as unknown as {shared: unknown[]}).shared), {timeout: 10_000})
        .toEqual([{name: expect.stringMatching(/^just-qr-link-.*\.png$/), type: 'image/png'}]);
});

test('no Share button where the browser cannot share files', async ({page}) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', {value: undefined});
    });
    await withCode(page);
    await expect(page.getByTestId('btn-share')).toHaveCount(0);
});

test('the menu closes with Escape and gives focus back', async ({page}) => {
    await withCode(page);
    await page.getByTestId('btn-more').click();
    await expect(page.getByTestId('menu')).toBeVisible();
    await expect(page.getByTestId('menu-svg')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('menu')).toHaveCount(0);
    await expect(page.getByTestId('btn-more')).toBeFocused();
});
