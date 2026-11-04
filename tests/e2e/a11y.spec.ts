import {expect, expectAccessible, openApp, setTheme, test} from './support/test';

// axe on every screen, in every theme. Contrast is part of it (WCAG 2 AA: 4.5:1 for text).
for (const theme of ['light', 'dark', 'oled'] as const) {
    test(`no accessibility problems, ${theme} theme @rtl`, async ({page}) => {
        await openApp(page);
        await setTheme(page, theme);
        await expectAccessible(page);
        // With the "back where you left off" notice.
        await page.getByTestId('f-url').fill('a.org');
        await page.reload();
        await setTheme(page, theme);
        await expect(page.getByTestId('draft-restored')).toBeVisible();
        await expectAccessible(page);
        // With a code and the Wi-Fi form on screen too.
        await page.getByTestId('type-wifi').click();
        await page.getByTestId('f-ssid').fill('Home');
        await expectAccessible(page);
        // With Style open and a warning showing.
        await page.getByTestId('style-toggle').click();
        await page.getByTestId('style-margin-0').click();
        await expectAccessible(page);
        // With a logo and its size slider.
        await page.getByTestId('logo-file').setInputFiles({
            name: 'logo.svg',
            mimeType: 'image/svg+xml',
            buffer: Buffer.from(
                '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>',
            ),
        });
        await expectAccessible(page);
        // And with the "more" menu open.
        await page.getByTestId('btn-more').click();
        await expectAccessible(page);
        // History, with one code, its delete button and the clear-all question.
        await page.keyboard.press('Escape');
        await Promise.all([page.waitForEvent('download'), page.getByTestId('btn-save').click()]);
        await page.getByTestId('btn-history').click();
        await page.getByTestId('history-clear').click();
        await expectAccessible(page);
        // Settings.
        await page.getByTestId('btn-back').click();
        await page.getByTestId('btn-settings').click();
        await expectAccessible(page);
    });
}
