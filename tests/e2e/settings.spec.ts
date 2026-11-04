import fs from 'node:fs';
import {expect, openApp, type Page, test} from './support/test';

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

async function openSettings(page: Page) {
    await openApp(page);
    await page.getByTestId('btn-settings').click();
    await expect(page.getByTestId('privacy')).toBeVisible();
}

test('Settings shows the privacy promise, the version and the licences', async ({page}) => {
    await openSettings(page);
    await expect(page.getByTestId('privacy')).toContainText('Nothing is collected');
    await expect(page.getByTestId('version')).toHaveText(`Version ${version}`);
    await expect(page.getByTestId('licences')).toContainText('qrcode: MIT');
    await expect(page.getByTestId('f-url')).toBeHidden();
    await page.getByTestId('btn-back').click();
    await expect(page.getByTestId('f-url')).toBeVisible();
});

test('changing the language applies at once and is kept', async ({page}) => {
    await openSettings(page);
    await page.getByTestId('language').selectOption('ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('privacy')).toContainText('لا يُجمع');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await page.getByTestId('language').selectOption('fr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByTestId('privacy')).toContainText('Rien n’est collecté');
});

test('the theme applies at once, is kept, and Phone follows the phone again', async ({page}) => {
    await openSettings(page);
    await page.getByTestId('theme-oled').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'oled');
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(0, 0, 0)');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'oled');
    await expect(page.getByTestId('theme-oled')).toHaveAttribute('aria-checked', 'true');
    await page.getByTestId('theme-system').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

test('the phone dark mode is followed when the theme is Phone', async ({page}) => {
    await page.emulateMedia({colorScheme: 'dark'});
    await openApp(page);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(21, 24, 28)');
});

test('the Back button of the browser leaves Settings', async ({page}) => {
    await openSettings(page);
    await expect(page).toHaveURL(/#settings$/);
    await page.goBack();
    await expect(page.getByTestId('f-url')).toBeVisible();
});

test('a new version shows a quiet Update banner; nothing reloads by itself', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('a.org');
    await page.evaluate(() => {
        (window as unknown as {applied: number}).applied = 0;
        window.dispatchEvent(
            new CustomEvent('jq-update-ready', {
                detail: {
                    apply: () => {
                        (window as unknown as {applied: number}).applied++;
                    },
                },
            }),
        );
    });
    await expect(page.getByTestId('update-ready')).toBeVisible();
    await expect(page.getByTestId('f-url')).toHaveValue('a.org');
    await page.getByTestId('update-apply').click();
    expect(await page.evaluate(() => (window as unknown as {applied: number}).applied)).toBe(1);
});

test('Settings in Arabic fits the screen @rtl', async ({page}) => {
    await openSettings(page);
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
});
