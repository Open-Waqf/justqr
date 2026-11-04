// test.ts: the `test` every browser test uses. Same as Playwright's, plus a network guard.
//
// Just QR promises that nobody can track anything. So every test, on every screen, fails if
// the page asks for anything other than the local test server (or data:/blob: URLs).
// Two signals, because the Content Security Policy (index.html) usually blocks an outside
// call before any request exists: real requests, and policy violations. Either one fails.
// (Taken from Lens.)
import AxeBuilder from '@axe-core/playwright';
import {test as base, expect, type Page} from '@playwright/test';

export type {Locator, Page} from '@playwright/test';
export {expect};

const LOCAL = new Set(['localhost', '127.0.0.1']);

export const test = base.extend<{networkGuard: undefined}>({
    networkGuard: [
        async ({page}, use) => {
            const outside: string[] = [];
            await page.exposeBinding('__jqReportCsp', (_source, uri: string) => {
                if (!/^(data|blob|inline|eval)/.test(uri)) outside.push(`blocked by CSP: ${uri}`);
            });
            await page.addInitScript(() => {
                document.addEventListener('securitypolicyviolation', (e) => {
                    (window as unknown as {__jqReportCsp?: (u: string) => void}).__jqReportCsp?.(
                        e.blockedURI || e.violatedDirective,
                    );
                });
            });
            page.on('request', (req) => {
                const url = req.url();
                if (/^(data|blob|about|chrome-extension):/.test(url)) return;
                let host = '';
                try {
                    host = new URL(url).hostname;
                } catch {
                    return;
                }
                if (!LOCAL.has(host)) outside.push(url);
            });
            await use(undefined);
            expect(outside, 'The app tried to reach the network (nothing may leave the device)').toEqual([]);
        },
        {auto: true},
    ],
});

/** Opens the app and waits until it has drawn its first screen. */
export async function openApp(page: Page, path = '/') {
    await page.goto(path);
    await expect(page.getByTestId('app')).toBeVisible();
}

/** Sets a theme the way the Settings screen will. */
export async function setTheme(page: Page, theme: 'light' | 'dark' | 'oled') {
    await page.evaluate((th) => document.documentElement.setAttribute('data-theme', th), theme);
}

/** Runs axe (WCAG 2.1 A and AA, contrast included) on what is on screen now. */
export async function expectAccessible(page: Page) {
    const result = await new AxeBuilder({page})
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
    const found = result.violations.map(
        (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`,
    );
    expect(found, 'Accessibility problems found by axe').toEqual([]);
}
