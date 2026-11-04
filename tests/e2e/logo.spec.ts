import fs from 'node:fs';
import {PNG} from 'pngjs';
import {decodePngFile} from '../support/decode';
import {readCode} from './support/qr';
import {expect, openApp, type Page, test} from './support/test';

const LINK = 'https://open-waqf.org/menu';

/** A solid dark picture, wider than tall: the hardest kind of logo for a scanner. */
function darkLogo(): Buffer {
    const png = new PNG({width: 300, height: 200});
    for (let i = 0; i < png.data.length; i += 4) png.data.set([26, 26, 40, 255], i);
    return PNG.sync.write(png);
}

async function addLogo(page: Page) {
    await openApp(page);
    await page.getByTestId('f-url').fill(LINK);
    await page.getByTestId('style-toggle').click();
    await page
        .getByTestId('logo-file')
        .setInputFiles({name: 'shop.png', mimeType: 'image/png', buffer: darkLogo()});
    await expect(page.getByTestId('logo-thumb')).toBeVisible();
}

async function savedPng(page: Page) {
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('btn-save').click(),
    ]);
    return new Uint8Array(fs.readFileSync(await download.path()));
}

test('a logo turns error correction to H, and removing it gives the choice back', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill(LINK);
    await page.getByTestId('style-toggle').click();
    await page.getByTestId('style-ec-L').click();
    await page
        .getByTestId('logo-file')
        .setInputFiles({name: 'shop.png', mimeType: 'image/png', buffer: darkLogo()});
    await expect(page.getByTestId('style-ec-H')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('style-ec-L')).toBeDisabled();
    await page.getByTestId('logo-remove').click();
    await expect(page.getByTestId('logo-thumb')).toHaveCount(0);
    await expect(page.getByTestId('style-ec-L')).toHaveAttribute('aria-checked', 'true');
});

test('codes with a logo decode at every allowed size, and only the big ones warn', async ({page}) => {
    await addLogo(page);
    const slider = page.getByTestId('logo-size');
    await expect(slider).toHaveAttribute('max', '0.3');
    for (const ratio of ['0.1', '0.15', '0.2', '0.25', '0.3']) {
        await slider.fill(ratio);
        expect(await readCode(page.getByTestId('preview-img')), `preview, logo ${ratio}`).toBe(LINK);
        expect(await decodePngFile(await savedPng(page)), `PNG, logo ${ratio}`).toEqual({
            jsqr: LINK,
            zxing: LINK,
        });
        await expect(page.getByTestId('warn-logo-large')).toHaveCount(Number(ratio) > 0.25 ? 1 : 0);
    }
});

test('the SVG carries the logo inside the file', async ({page}) => {
    await addLogo(page);
    await page.getByTestId('btn-more').click();
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('menu-svg').click(),
    ]);
    const svg = fs.readFileSync(await download.path(), 'utf8');
    expect(svg).toMatch(/<image href="data:image\/png;base64,/);
    await page.evaluate((text) => {
        const img = document.createElement('img');
        img.id = 'svg-check';
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
        document.body.append(img);
    }, svg);
    expect(await readCode(page.locator('#svg-check'))).toBe(LINK);
});

test('the logo is made small and stays on the device', async ({page}) => {
    await addLogo(page);
    const src = await page.getByTestId('logo-thumb').getAttribute('src');
    expect(src).toMatch(/^data:image\/png;base64,/);
    const png = PNG.sync.read(Buffer.from(src!.split(',')[1], 'base64'));
    expect(Math.max(png.width, png.height)).toBeLessThanOrEqual(256);
    // The network guard (support/test.ts) also fails this test if anything was sent.
});

test('a file that is not a picture shows a message and changes nothing', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill(LINK);
    await page.getByTestId('style-toggle').click();
    await page
        .getByTestId('logo-file')
        .setInputFiles({name: 'notes.png', mimeType: 'image/png', buffer: Buffer.from('not a picture')});
    await expect(page.getByTestId('toast')).toContainText('could not be opened');
    await expect(page.getByTestId('logo-thumb')).toHaveCount(0);
});
