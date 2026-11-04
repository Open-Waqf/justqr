import {expectAccessible, openApp, setTheme, test} from './support/test';

// axe on every screen, in every theme. Contrast is part of it (WCAG 2 AA: 4.5:1 for text).
for (const theme of ['light', 'dark', 'oled'] as const) {
    test(`no accessibility problems, ${theme} theme @rtl`, async ({page}) => {
        await openApp(page);
        await setTheme(page, theme);
        await expectAccessible(page);
        // With a code and the Wi-Fi form on screen too.
        await page.getByTestId('type-wifi').click();
        await page.getByTestId('f-ssid').fill('Home');
        await expectAccessible(page);
    });
}
