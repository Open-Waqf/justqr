import fs from 'node:fs';
import {PNG} from 'pngjs';
import {decodePngFile} from '../support/decode';
import {readCode} from './support/qr';
import {expect, openApp, type Page, test} from './support/test';

const LINK = 'https://open-waqf.org/menu';

async function openStyle(page: Page) {
    await openApp(page);
    await page.getByTestId('f-url').fill(LINK);
    await page.getByTestId('style-toggle').click();
}

async function savedPng(page: Page) {
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('btn-save').click(),
    ]);
    return new Uint8Array(fs.readFileSync(await download.path()));
}

test('Style is closed and says Default until something changes', async ({page}) => {
    await openApp(page);
    await expect(page.getByTestId('style-toggle')).toContainText('Default');
    await expect(page.getByTestId('style-fg')).toBeHidden();
    await page.getByTestId('style-toggle').click();
    await page.getByTestId('style-margin-2').click();
    await expect(page.getByTestId('style-toggle')).toContainText('Custom');
    await page.getByTestId('style-reset').click();
    await expect(page.getByTestId('style-toggle')).toContainText('Default');
    await expect(page.getByTestId('style-reset')).toHaveCount(0);
});

test('colours reach the preview and the saved PNG, which still decodes', async ({page}) => {
    await openStyle(page);
    await page.getByTestId('style-fg').fill('#0b3d3a');
    await page.getByTestId('style-bg').fill('#fff4d6');
    expect(await readCode(page.getByTestId('preview-img'))).toBe(LINK);
    const bytes = await savedPng(page);
    expect(await decodePngFile(bytes)).toEqual({jsqr: LINK, zxing: LINK});
    const png = PNG.sync.read(Buffer.from(bytes));
    expect([...png.data.subarray(0, 3)]).toEqual([0xff, 0xf4, 0xd6]); // corner = background
    await expect(page.locator('[data-testid^="warn-"]')).toHaveCount(0);
});

test('low contrast shows a warning, and so do inverted colours', async ({page}) => {
    await openStyle(page);
    await page.getByTestId('style-fg').fill('#bbbbbb');
    await expect(page.getByTestId('warn-low-contrast')).toBeVisible();
    await page.getByTestId('style-fg').fill('#ffffff');
    await page.getByTestId('style-bg').fill('#000000');
    await expect(page.getByTestId('warn-inverted')).toBeVisible();
    await expect(page.getByTestId('warn-low-contrast')).toHaveCount(0);
    await page.getByTestId('style-reset').click();
    await expect(page.locator('[data-testid^="warn-"]')).toHaveCount(0);
});

test('no margin shows a warning', async ({page}) => {
    await openStyle(page);
    await page.getByTestId('style-margin-0').click();
    await expect(page.getByTestId('warn-no-margin')).toBeVisible();
});

test('image size, error correction and margin all give a PNG that decodes', async ({page}) => {
    await openStyle(page);
    for (const [size, ec, margin, min] of [
        ['2048', 'H', '2', 2000],
        ['512', 'L', '4', 500],
    ] as const) {
        await page.getByTestId(`style-size-${size}`).click();
        await page.getByTestId(`style-ec-${ec}`).click();
        await page.getByTestId(`style-margin-${margin}`).click();
        const bytes = await savedPng(page);
        expect(PNG.sync.read(Buffer.from(bytes)).width).toBeGreaterThanOrEqual(min);
        expect(await decodePngFile(bytes), `${size} px, ${ec}, margin ${margin}`).toEqual({
            jsqr: LINK,
            zxing: LINK,
        });
    }
});

test('the SVG keeps the chosen colours', async ({page}) => {
    await openStyle(page);
    await page.getByTestId('style-fg').fill('#0b3d3a');
    await page.getByTestId('btn-more').click();
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('menu-svg').click(),
    ]);
    expect(fs.readFileSync(await download.path(), 'utf8')).toContain('fill="#0b3d3a"');
});

test('arrow keys move through a row of choices', async ({page}) => {
    await openStyle(page);
    await page.getByTestId('style-ec-M').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('style-ec-Q')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('style-ec-Q')).toBeFocused();
});

test('Style fits the screen in every language @rtl', async ({page}) => {
    await openStyle(page);
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
});

test('in Arabic, the left arrow moves forward @rtl-only', async ({page}) => {
    await openStyle(page);
    await page.getByTestId('style-ec-M').focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('style-ec-Q')).toHaveAttribute('aria-checked', 'true');
});
