// native.ts: the Android app's own behaviour. On the web none of this runs.
//
// - Save writes into the phone's Documents/Just QR folder (no permission needed on Android 11+).
// - Share opens the Android share sheet with the PNG.
// - The Back button closes the open menu or screen, then leaves the app.
// - The system bar icons follow the app's theme, so they stay visible.
import {App} from '@capacitor/app';
import {Capacitor, SystemBars, SystemBarsStyle} from '@capacitor/core';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
import type {Theme} from '../lib/theme';

export const FOLDER = 'Just QR';

export const isNative = (): boolean => Capacitor.isNativePlatform();

async function base64(blob: Blob): Promise<string> {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000)
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(binary);
}

/** "code.png", 2 -> "code-2.png" */
export function numbered(name: string, n: number): string {
    if (n < 2) return name;
    const dot = name.lastIndexOf('.');
    return dot > 0 ? `${name.slice(0, dot)}-${n}${name.slice(dot)}` : `${name}-${n}`;
}

/**
 * Writes the file to Documents/Just QR/<name>, never over another file. Returns the path.
 * A file with the same name can exist (saved in the same second, or left by an earlier
 * install, which Android 11+ does not let the app replace: Signer lesson). Then the next
 * free name is used: code-2.png, code-3.png...
 */
export async function saveToDocuments(name: string, blob: Blob): Promise<string> {
    const data = await base64(blob);
    let lastError: unknown;
    for (let n = 1; n <= 20; n++) {
        const path = `${FOLDER}/${numbered(name, n)}`;
        const exists = await Filesystem.stat({path, directory: Directory.Documents}).then(
            () => true,
            () => false,
        );
        if (exists) continue;
        try {
            await Filesystem.writeFile({path, data, directory: Directory.Documents, recursive: true});
            return `Documents/${path}`;
        } catch (e) {
            // A file the app cannot see (earlier install) still blocks the name: try the next.
            lastError = e;
        }
    }
    throw lastError ?? new Error('No free file name');
}

/** Opens the share sheet with the file. Returns false when the user closed it without sharing. */
export async function shareFile(name: string, blob: Blob): Promise<boolean> {
    const {uri} = await Filesystem.writeFile({
        path: name,
        data: await base64(blob),
        directory: Directory.Cache,
    });
    try {
        await Share.share({files: [uri]});
        return true;
    } catch (e) {
        // The plugin rejects with "Share canceled" when the sheet is closed.
        if (/cancel/i.test(String((e as Error)?.message ?? e))) return false;
        throw e;
    }
}

/** System bar icons: dark on light themes, light on dark ones. "system" follows the phone. */
export function matchSystemBars(theme: Theme): void {
    if (!isNative()) return;
    const style =
        theme === 'light'
            ? SystemBarsStyle.Light
            : theme === 'system'
              ? SystemBarsStyle.Default
              : SystemBarsStyle.Dark;
    void SystemBars.setStyle({style}).catch(() => {});
}

/**
 * The Android Back button. `handled()` closes whatever is open (menu, History, Settings) and
 * returns true; when nothing was open the app goes to the background, like other apps.
 */
export function onBackButton(handled: () => boolean): void {
    if (!isNative()) return;
    void App.addListener('backButton', () => {
        if (!handled()) void App.minimizeApp();
    });
}
