import {expect, openApp, test} from './support/test';

test('opens straight on the app, with the honest line', async ({page}) => {
    await openApp(page);
    await expect(page.getByRole('heading', {name: 'Just QR'})).toBeVisible();
    await expect(page.getByTestId('honest-line')).toContainText('works forever');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

test('a phone in Arabic opens the app in Arabic, right to left @rtl-only', async ({page}) => {
    await openApp(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('honest-line')).toContainText('إلى الأبد');
});

test('a saved language wins over the phone language', async ({page}) => {
    await page.addInitScript(() => localStorage.setItem('justqr.locale', 'fr'));
    await openApp(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByTestId('honest-line')).toContainText('pour toujours');
});
