// native-fake.ts: run the web app in Playwright as if it were the Android app (from Signer).
//
// Capacitor talks to Android through a bridge that the Android app injects into the page
// (`window.androidBridge` and `window.Capacitor.nativePromise`). This file injects a fake
// bridge before the app loads, so:
//   - Capacitor.isNativePlatform() is true and getPlatform() is 'android',
//   - every plugin call (Filesystem, Share, App, SystemBars) is answered here and recorded,
//   - tests can fire Android events, such as the Back button.
// It tests the app's own Android logic. Real Android behaviour (share sheet, files, system
// bars) is checked on the phone with the Maestro flows (npm run test:android).
import type {Page} from '@playwright/test';

// biome-ignore lint/suspicious/noExplicitAny: plugin options are free-form
export type NativeCall = {plugin: string; method: string; options: any};

export type FakeAndroidOptions = {
    /** Make Filesystem.writeFile fail (for example storage full). */
    failWrite?: boolean;
    /** The user closes the share sheet without sharing. */
    cancelShare?: boolean;
    /**
     * Documents files left by an earlier install: on Android 11+ the app cannot see them
     * (stat fails) and cannot replace them (write fails). Paths like "Just QR/x.png".
     */
    foreignFiles?: string[];
    /** Android 10 and older: the user says no to storage access. */
    denyStorage?: boolean;
};

// Every native method the app calls, per plugin. A method missing here would make Capacitor
// throw "not implemented", which a test would show at once.
const METHODS: Record<string, string[]> = {
    App: ['addListener', 'removeListener', 'removeAllListeners', 'minimizeApp', 'exitApp', 'getLaunchUrl'],
    Filesystem: [
        'writeFile',
        'deleteFile',
        'getUri',
        'readFile',
        'stat',
        'mkdir',
        'checkPermissions',
        'requestPermissions',
        'addListener',
        'removeListener',
    ],
    Share: ['share', 'canShare'],
    SystemBars: ['setStyle', 'show', 'hide', 'setAnimation'],
};

export async function fakeAndroid(page: Page, options: FakeAndroidOptions = {}) {
    await page.addInitScript(
        ({methods, options}) => {
            const ROOTS: Record<string, string> = {
                DOCUMENTS: 'file:///storage/emulated/0/Documents/',
                CACHE: 'file:///data/user/0/org.openwaqf.justqr.dev/cache/',
            };
            // biome-ignore lint/suspicious/noExplicitAny: test helper
            const calls: any[] = [];
            // biome-ignore lint/suspicious/noExplicitAny: test helper
            const listeners: Record<string, Array<(data: any) => void>> = {};
            const files: Record<string, string> = {};
            let nextId = 1;

            // biome-ignore lint/suspicious/noExplicitAny: test helper
            const handle = async (plugin: string, method: string, o: any) => {
                switch (`${plugin}.${method}`) {
                    case 'Filesystem.writeFile': {
                        if (options.failWrite) throw new Error('No space left on device');
                        if ((options.foreignFiles || []).includes(o.path)) {
                            throw new Error(`${o.path}: open failed: EACCES (Permission denied)`);
                        }
                        const uri = (ROOTS[o.directory] ?? 'file:///') + o.path;
                        files[uri] = o.data;
                        return {uri};
                    }
                    case 'Filesystem.stat': {
                        const uri = (ROOTS[o.directory] ?? 'file:///') + o.path;
                        if (!(uri in files)) throw new Error('File does not exist');
                        return {type: 'file', size: files[uri].length, uri};
                    }
                    case 'Filesystem.requestPermissions':
                    case 'Filesystem.checkPermissions':
                        return {publicStorage: options.denyStorage ? 'denied' : 'granted'};
                    case 'Filesystem.getUri':
                        return {uri: (ROOTS[o.directory] ?? 'file:///') + o.path};
                    case 'Share.share':
                        if (options.cancelShare) throw new Error('Share canceled');
                        return {};
                    case 'Share.canShare':
                        return {value: true};
                    default:
                        return {};
                }
            };

            // biome-ignore lint/suspicious/noExplicitAny: injecting the fake bridge
            const w = window as any;
            w.androidBridge = {postMessage() {}};
            w.Capacitor = {
                PluginHeaders: Object.entries(methods).map(([name, ms]) => ({
                    name,
                    methods: (ms as string[]).map((m) => ({
                        name: m,
                        rtype: m === 'addListener' ? 'callback' : 'promise',
                    })),
                })),
                // biome-ignore lint/suspicious/noExplicitAny: plugin options are free-form
                nativePromise(plugin: string, method: string, o: any) {
                    calls.push({plugin, method, options: o});
                    return handle(plugin, method, o || {});
                },
                // biome-ignore lint/suspicious/noExplicitAny: plugin options are free-form
                nativeCallback(plugin: string, method: string, o: any, callback: (data: any) => void) {
                    calls.push({plugin, method, options: o});
                    const key = `${plugin}:${o?.eventName}`;
                    listeners[key] = [...(listeners[key] ?? []), callback];
                    return String(nextId++);
                },
            };
            w.__fakeAndroid = {
                calls,
                files,
                // biome-ignore lint/suspicious/noExplicitAny: event data is free-form
                fire(plugin: string, eventName: string, data: any) {
                    for (const cb of listeners[`${plugin}:${eventName}`] || []) cb(data);
                    return (listeners[`${plugin}:${eventName}`] || []).length;
                },
            };
        },
        {methods: METHODS, options},
    );
}

/** All native calls so far, optionally only one plugin's. */
export async function nativeCalls(page: Page, plugin?: string): Promise<NativeCall[]> {
    // biome-ignore lint/suspicious/noExplicitAny: reading the fake bridge
    const calls: NativeCall[] = await page.evaluate(() => (window as any).__fakeAndroid.calls);
    return plugin ? calls.filter((c) => c.plugin === plugin) : calls;
}

/** Files written through Filesystem: uri -> base64 data. */
export async function nativeFiles(page: Page): Promise<Record<string, string>> {
    // biome-ignore lint/suspicious/noExplicitAny: reading the fake bridge
    return page.evaluate(() => ({...(window as any).__fakeAndroid.files}));
}

/** Press the Android Back button. Returns how many listeners received it. */
export async function pressBack(page: Page): Promise<number> {
    // biome-ignore lint/suspicious/noExplicitAny: reading the fake bridge
    return page.evaluate(() => (window as any).__fakeAndroid.fire('App', 'backButton', {canGoBack: false}));
}
