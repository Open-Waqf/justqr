import {readCode} from './support/qr';
import {expect, openApp, type Page, test} from './support/test';

const preview = (page: Page) => page.getByTestId('preview-img');

test('opens on Link, empty, with no code until something is typed', async ({page}) => {
    await openApp(page);
    await expect(page.getByTestId('type-link')).toHaveAttribute('aria-checked', 'true');
    await expect(preview(page)).toHaveCount(0);
    await expect(page.getByTestId('preview')).toContainText('appears here');
});

test('the code appears while typing and holds exactly the link', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('open-waqf.org/menu?t=4');
    expect(await readCode(preview(page))).toBe('https://open-waqf.org/menu?t=4');
    await page.getByTestId('f-url').fill('');
    await expect(preview(page)).toHaveCount(0);
});

test('Wi-Fi with special characters is escaped', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-wifi').click();
    await page.getByTestId('f-ssid').fill('Café;5G');
    await page.getByTestId('f-password').fill('p:a,s"s\\');
    await page.getByTestId('f-hidden').check();
    expect(await readCode(preview(page))).toBe('WIFI:T:WPA;S:Café\\;5G;P:p\\:a\\,s\\"s\\\\;H:true;;');
    await page.getByTestId('f-security').selectOption('nopass');
    expect(await readCode(preview(page))).toBe('WIFI:T:nopass;S:Café\\;5G;H:true;;');
});

test('every type makes a code that reads back', async ({page}) => {
    await openApp(page);
    const cases: [string, Record<string, string>, string][] = [
        ['text', {'f-text': 'سلام 👋\nhello'}, 'سلام 👋\nhello'],
        [
            'contact',
            {'f-firstName': 'Ahmed', 'f-lastName': 'Benali', 'f-phone': '+33 6 12'},
            'BEGIN:VCARD\r\nVERSION:3.0\r\nN:Benali;Ahmed;;;\r\nFN:Ahmed Benali\r\nTEL;TYPE=CELL:+33612\r\nEND:VCARD',
        ],
        ['phone', {'f-number': '+33 1 23'}, 'tel:+33123'],
        ['sms', {'f-number': '0600', 'f-message': 'Table 4'}, 'SMSTO:0600:Table 4'],
        ['email', {'f-to': 'a@b.org', 'f-subject': 'Hi'}, 'mailto:a@b.org?subject=Hi'],
    ];
    for (const [type, fields, expected] of cases) {
        await page.getByTestId(`type-${type}`).click();
        for (const [id, value] of Object.entries(fields)) await page.getByTestId(id).fill(value);
        expect(await readCode(preview(page)), type).toBe(expected);
    }
});

test('switching type keeps what was typed in each type', async ({page}) => {
    await openApp(page);
    await page.getByTestId('f-url').fill('example.org');
    await page.getByTestId('type-text').click();
    await page.getByTestId('f-text').fill('note');
    await page.getByTestId('type-link').click();
    await expect(page.getByTestId('f-url')).toHaveValue('example.org');
    await expect(page.getByTestId('honest-line')).toContainText('link');
});

test('text too long for one code shows a clear message and no code', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-text').click();
    await page.getByTestId('f-text').fill('a'.repeat(2000));
    await expect(page.getByTestId('almost-full')).toBeVisible();
    await page.getByTestId('f-text').fill('a'.repeat(4000));
    await expect(page.getByTestId('too-long')).toBeVisible();
    await expect(preview(page)).toHaveCount(0);
});

test('arrow keys move between types', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-link').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('type-text')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('type-text')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('type-email')).toHaveAttribute('aria-checked', 'true');
});

test('Arabic: right to left, nothing cut off, links stay left to right @rtl', async ({page}) => {
    await openApp(page);
    for (const type of ['link', 'wifi', 'contact', 'email']) {
        await page.getByTestId(`type-${type}`).click();
        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${type}: page wider than the screen`).toBeLessThanOrEqual(0);
    }
    await page.getByTestId('type-link').click();
    await expect(page.getByTestId('f-url')).toHaveAttribute('dir', 'ltr');
});

test('Arabic text in a code reads back exactly @rtl', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-text').click();
    await page.getByTestId('f-text').fill('بسم الله الرحمن الرحيم');
    expect(await readCode(preview(page))).toBe('بسم الله الرحمن الرحيم');
});

test('Contact shows the common fields, the rest on request, and the code stays on screen', async ({page}) => {
    await openApp(page);
    await page.getByTestId('type-contact').click();
    await expect(page.getByTestId('f-org')).toHaveCount(0);
    await page.getByTestId('f-firstName').fill('Ahmed');
    // The top of the code is on screen without scrolling.
    const box = await page.getByTestId('preview').boundingBox();
    const height = page.viewportSize()!.height;
    expect(box!.y + box!.height / 3, 'code below the screen').toBeLessThan(height);
    await page.getByTestId('contact-more').click();
    await expect(page.getByTestId('f-org')).toBeFocused();
    await page.getByTestId('f-org').fill('Open Waqf');
    expect(await readCode(preview(page))).toContain('ORG:Open Waqf');
    // Coming back later, a filled field is never hidden.
    await page.getByTestId('type-link').click();
    await page.getByTestId('type-contact').click();
    await expect(page.getByTestId('f-org')).toHaveValue('Open Waqf');
});
