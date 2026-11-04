import {readCode} from './support/qr';
import {expect, openApp, type Page, test} from './support/test';

const LINK = 'https://open-waqf.org/menu';
const items = (page: Page) => page.getByTestId('history-item');

/** Makes a link code and saves it, which puts it in the history. */
async function saveLink(page: Page, url = 'open-waqf.org/menu') {
    await page.getByTestId('f-url').fill(url);
    await Promise.all([page.waitForEvent('download'), page.getByTestId('btn-save').click()]);
    await expect(page.getByTestId('toast')).toBeVisible();
}

test('History starts empty and says the codes stay on this device', async ({page}) => {
    await openApp(page);
    await page.getByTestId('btn-history').click();
    await expect(page.getByTestId('history-empty')).toContainText('this device only');
    await expect(page.getByTestId('history-clear')).toHaveCount(0);
    // The Make screen is out of the way, bottom bar included.
    await expect(page.getByTestId('f-url')).toBeHidden();
    await expect(page.getByTestId('btn-save')).toBeHidden();
    await page.getByTestId('btn-back').click();
    await expect(page.getByTestId('f-url')).toBeVisible();
});

test('a saved code is in the history and survives a reload', async ({page}) => {
    await openApp(page);
    await saveLink(page);
    await page.reload();
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(1);
    await expect(page.getByTestId('history-label')).toHaveText('open-waqf.org/menu');
    await expect(page.locator('.meta, [data-testid="history-item"]').first()).toContainText('Link');
});

test('saving the same code twice keeps one entry; a change makes a new one', async ({page}) => {
    await openApp(page);
    await saveLink(page);
    await saveLink(page);
    await page.getByTestId('btn-more').click();
    await Promise.all([page.waitForEvent('download'), page.getByTestId('menu-svg').click()]);
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(1);
    await page.getByTestId('btn-back').click();
    await page.getByTestId('style-toggle').click();
    await page.getByTestId('style-fg').fill('#0b3d3a');
    await saveLink(page);
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(2);
});

test('opening a saved code brings back its text and style; editing saves a new one', async ({page}) => {
    await openApp(page);
    await page.getByTestId('style-toggle').click();
    await page.getByTestId('style-fg').fill('#0b3d3a');
    await saveLink(page);
    await page.reload();
    await page.getByTestId('btn-history').click();
    await page.getByTestId('history-open').click();
    await expect(page.getByTestId('f-url')).toHaveValue('open-waqf.org/menu');
    await expect(page.getByTestId('style-toggle')).toContainText('Custom');
    expect(await readCode(page.getByTestId('preview-img'))).toBe(LINK);
    await saveLink(page, 'open-waqf.org/menu/2');
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(2);
    await expect(page.getByTestId('history-label').first()).toHaveText('open-waqf.org/menu/2');
    await expect(page.getByTestId('history-label').nth(1)).toHaveText('open-waqf.org/menu');
});

test('delete one, with undo', async ({page}) => {
    await openApp(page);
    await saveLink(page, 'a.org');
    await saveLink(page, 'b.org');
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(2);
    await page.getByTestId('history-delete').first().click();
    await expect(items(page)).toHaveCount(1);
    await expect(page.getByTestId('history-label')).toHaveText('a.org');
    await page.getByTestId('history-undo').click();
    await expect(items(page)).toHaveCount(2);
    await expect(page.getByTestId('history-undo-toast')).toHaveCount(0);
});

test('a deleted code is gone after a reload', async ({page}) => {
    await openApp(page);
    await saveLink(page);
    await page.getByTestId('btn-history').click();
    await page.getByTestId('history-delete').click();
    await expect(page.getByTestId('history-undo-toast')).toBeVisible(); // the delete is done
    await page.reload(); // reopens on History: the address still says #history
    await expect(page.getByTestId('history-empty')).toBeVisible();
});

test('clear all asks first, then empties the history for good', async ({page}) => {
    await openApp(page);
    await saveLink(page, 'a.org');
    await saveLink(page, 'b.org');
    await page.getByTestId('btn-history').click();
    await page.getByTestId('history-clear').click();
    await page.getByTestId('history-clear-no').click();
    await expect(items(page)).toHaveCount(2);
    await page.getByTestId('history-clear').click();
    await page.getByTestId('history-clear-yes').click();
    await expect(page.getByTestId('history-empty')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('history-empty')).toBeVisible();
});

test('a share the user backs out of is not kept', async ({page}) => {
    await page.addInitScript(() => {
        navigator.canShare = () => true;
        navigator.share = async () => {
            throw new DOMException('closed', 'AbortError');
        };
    });
    await openApp(page);
    await page.getByTestId('f-url').fill('a.org');
    await page.getByTestId('btn-share').click();
    await page.getByTestId('btn-history').click();
    await expect(page.getByTestId('history-empty')).toBeVisible();
});

test('the browser Back button leaves History', async ({page}) => {
    await openApp(page);
    await page.getByTestId('btn-history').click();
    await expect(page).toHaveURL(/#history$/);
    await page.goBack();
    await expect(page.getByTestId('f-url')).toBeVisible();
    await expect(page.getByTestId('btn-history')).toBeVisible();
});

test('a saved code the app cannot read is left alone and counted', async ({page}) => {
    await openApp(page);
    await saveLink(page);
    // Something a newer version of the app might write.
    await page.evaluate(
        () =>
            new Promise<void>((done, fail) => {
                const req = indexedDB.open('justqr');
                req.onsuccess = () => {
                    const tx = req.result.transaction('codes', 'readwrite');
                    tx.objectStore('codes').put({id: 'future', schema: 2, shape: 'round'});
                    tx.oncomplete = () => {
                        req.result.close();
                        done();
                    };
                    tx.onerror = () => fail(tx.error);
                };
            }),
    );
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(1);
    await expect(page.getByTestId('history-unreadable')).toContainText('1 saved code');
    await page.getByTestId('history-delete').click();
    const left = await page.evaluate(
        () =>
            new Promise<number>((done) => {
                const req = indexedDB.open('justqr');
                req.onsuccess = () => {
                    const count = req.result.transaction('codes').objectStore('codes').count();
                    count.onsuccess = () => {
                        req.result.close();
                        done(count.result);
                    };
                };
            }),
    );
    expect(left, 'the unreadable record must still be there').toBe(1);
});

test('History in Arabic: right to left, nothing cut off, dates in Arabic @rtl-only', async ({page}) => {
    await openApp(page);
    await saveLink(page, 'open-waqf.org/قائمة-الطعام');
    await page.getByTestId('btn-history').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(items(page).first()).toContainText('رابط');
});

test('History shows a code saved just before it was opened', async ({page}) => {
    // A slow phone: making the PNG takes a moment, so History opens before the save is done.
    await page.addInitScript(() => {
        const toBlob = HTMLCanvasElement.prototype.toBlob;
        HTMLCanvasElement.prototype.toBlob = function (...args) {
            setTimeout(() => toBlob.apply(this, args), 600);
        };
    });
    await openApp(page);
    await page.getByTestId('f-url').fill('a.org');
    // Tap History at once, before the save has finished writing.
    await page.getByTestId('btn-save').click();
    await page.getByTestId('btn-history').click();
    await expect(items(page)).toHaveCount(1);
});
