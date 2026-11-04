import {expect, openApp, test} from './support/test';

test('works with the network off after the first visit', async ({page, context}) => {
    await openApp(page);
    // Wait until the service worker has kept every file. The next load goes through it
    // (in 'prompt' mode it takes control on the next load, not on the first visit).
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByTestId('honest-line')).toBeVisible();
});
