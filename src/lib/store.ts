// store.ts: the history of codes, kept on this device only (IndexedDB).
//
// Rules for stored data (they never change, whatever the app version):
// - Every write is one IndexedDB transaction, so an app killed halfway leaves either the old
//   record or the new one, never half of one.
// - Reading never throws because of one bad record. A record the app cannot understand is
//   skipped and left untouched in the database; only "Clear all" removes everything.
// - A newer app must keep reading records written by an older one. `schema` says which
//   shape a record has. Today there is one: 1.
import {type DBSchema, type IDBPDatabase, openDB} from 'idb';
import type {Look} from './look';
import {CODE_TYPES, type CodeType, type Fields, type FieldsByType} from './payload';
import type {Ec} from './qr';
import {LOGO_MAX, LOGO_MIN} from './render';

export const DB_NAME = 'justqr';
export const DB_VERSION = 1;
const STORE = 'codes';
/**
 * The draft lives in localStorage, not IndexedDB: its write is synchronous, so it survives
 * the page being left or the app being closed (an IndexedDB write started in `pagehide` was
 * lost on reload, seen in the tests). It is small: the form text and a logo of 256 px at most.
 */
const DRAFT_KEY = 'justqr.draft';

export interface SavedCode {
    id: string;
    schema: 1;
    /** Milliseconds since 1970, from Date.now(). */
    createdAt: number;
    updatedAt: number;
    type: CodeType;
    fields: Fields;
    look: Look;
    /** The text inside the code, so a record can be drawn without rebuilding it. */
    payload: string;
}

/** What the user is typing right now, so a killed app can bring it back. */
export interface Draft {
    schema: 1;
    savedAt: number;
    type: CodeType;
    /** The fields of every type, as typed (switching type keeps them). */
    fields: {[T in CodeType]: FieldsByType[T]};
    look: Look;
}

interface Schema extends DBSchema {
    codes: {
        key: string;
        value: SavedCode;
        indexes: {updatedAt: number};
    };
}

let db: Promise<IDBPDatabase<Schema>> | null = null;

/** Closes the database. The next call opens it again (used when a tab upgrades, and by tests). */
export async function closeStore(): Promise<void> {
    const open = db;
    db = null;
    if (open) (await open).close();
}

function open(): Promise<IDBPDatabase<Schema>> {
    db ??= openDB<Schema>(DB_NAME, DB_VERSION, {
        upgrade(d, oldVersion) {
            if (oldVersion < 1) {
                const codes = d.createObjectStore(STORE, {keyPath: 'id'});
                codes.createIndex('updatedAt', 'updatedAt');
            }
        },
        blocking() {
            // Another tab opened a newer version of the database: close so it can upgrade.
            void closeStore();
        },
    });
    return db;
}

const isHex = (s: unknown): s is string => typeof s === 'string' && /^#[0-9a-f]{6}$/i.test(s);
const EC = new Set<string>(['L', 'M', 'Q', 'H']);

const isType = (t: unknown): t is CodeType => typeof t === 'string' && CODE_TYPES.includes(t as CodeType);

/** A stored look, rebuilt field by field, or null when anything is off. */
export function parseLook(raw: unknown): Look | null {
    if (!raw || typeof raw !== 'object') return null;
    const look = raw as Record<string, unknown>;
    if (!isHex(look.fg) || !isHex(look.bg)) return null;
    if (typeof look.margin !== 'number' || typeof look.px !== 'number') return null;
    if (typeof look.ec !== 'string' || !EC.has(look.ec)) return null;
    let logo: Look['logo'] = null;
    if (look.logo != null) {
        const l = look.logo as Record<string, unknown>;
        if (typeof l.href !== 'string' || !l.href.startsWith('data:image/')) return null;
        if (typeof l.ratio !== 'number' || l.ratio < LOGO_MIN - 1e-9 || l.ratio > LOGO_MAX + 1e-9)
            return null;
        logo = {href: l.href, ratio: l.ratio};
    }
    return {fg: look.fg, bg: look.bg, margin: look.margin, px: look.px, ec: look.ec as Ec, logo};
}

/** The record if it is one this app understands, else null. Never throws. */
export function parseRecord(raw: unknown): SavedCode | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    if (r.schema !== 1) return null;
    if (typeof r.id !== 'string' || !r.id) return null;
    if (typeof r.createdAt !== 'number' || typeof r.updatedAt !== 'number') return null;
    if (!isType(r.type)) return null;
    if (!r.fields || typeof r.fields !== 'object') return null;
    if (typeof r.payload !== 'string' || !r.payload) return null;
    const look = parseLook(r.look);
    if (!look) return null;
    return {
        id: r.id,
        schema: 1,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        type: r.type,
        fields: r.fields as Fields,
        look,
        payload: r.payload,
    };
}

export function parseDraft(raw: unknown): Draft | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    if (r.schema !== 1 || typeof r.savedAt !== 'number' || !isType(r.type)) return null;
    const fields = r.fields as Record<string, unknown> | undefined;
    if (!fields || typeof fields !== 'object') return null;
    for (const type of CODE_TYPES) if (!fields[type] || typeof fields[type] !== 'object') return null;
    const look = parseLook(r.look);
    if (!look) return null;
    return {schema: 1, savedAt: r.savedAt, type: r.type, fields: fields as Draft['fields'], look};
}

/** There is one draft. Writing replaces it whole. Throws when storage is blocked or full. */
export function putDraft(draft: Draft): void {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

/** The draft, or null when there is none or it cannot be read. Never throws. */
export function getDraft(): Draft | null {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? parseDraft(JSON.parse(raw)) : null;
    } catch {
        return null;
    }
}

export function clearDraft(): void {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch {
        // Storage blocked: there was nothing to clear.
    }
}

/** Every readable record, newest first. Unreadable ones are counted, not shown. */
export async function listCodes(): Promise<{codes: SavedCode[]; unreadable: number}> {
    const d = await open();
    const all = await d.getAll(STORE);
    const codes: SavedCode[] = [];
    let unreadable = 0;
    for (const raw of all) {
        const code = parseRecord(raw);
        if (code) codes.push(code);
        else unreadable++;
    }
    codes.sort((a, b) => b.updatedAt - a.updatedAt);
    return {codes, unreadable};
}

export async function getCode(id: string): Promise<SavedCode | null> {
    const d = await open();
    return parseRecord(await d.get(STORE, id));
}

export function newId(): string {
    return crypto.randomUUID();
}

/** Writes the record (replacing one with the same id). One transaction. */
export async function putCode(code: SavedCode): Promise<void> {
    const d = await open();
    await d.put(STORE, code);
}

export async function deleteCode(id: string): Promise<void> {
    const d = await open();
    await d.delete(STORE, id);
}

/** Removes everything, readable or not. Only the user's "Clear all" calls this. */
export async function clearCodes(): Promise<void> {
    const d = await open();
    await d.clear(STORE);
}

/** Two saved codes are "the same" when the code drawn would be identical. */
export function sameCode(a: {payload: string; look: Look}, b: {payload: string; look: Look}): boolean {
    return (
        a.payload === b.payload &&
        a.look.fg.toLowerCase() === b.look.fg.toLowerCase() &&
        a.look.bg.toLowerCase() === b.look.bg.toLowerCase() &&
        a.look.margin === b.look.margin &&
        a.look.ec === b.look.ec &&
        a.look.px === b.look.px &&
        (a.look.logo?.href ?? null) === (b.look.logo?.href ?? null) &&
        (a.look.logo?.ratio ?? null) === (b.look.logo?.ratio ?? null)
    );
}

/**
 * Keeps a code the user just made: a new record, or a fresh `updatedAt` on the newest record
 * that would draw the same code (saving a PNG and then sharing it is one code, not two).
 * Returns the record kept.
 */
export async function rememberCode(input: {
    type: CodeType;
    fields: Fields;
    look: Look;
    payload: string;
}): Promise<SavedCode> {
    const now = Date.now();
    const {codes} = await listCodes();
    const same = codes.find((c) => sameCode(c, input));
    const code: SavedCode = same
        ? {...same, fields: input.fields, type: input.type, updatedAt: now}
        : {id: newId(), schema: 1, createdAt: now, updatedAt: now, ...input};
    await putCode(code);
    return code;
}

/** Asks the browser not to clean this data up when the disk is full. Best effort. */
export async function persist(): Promise<boolean> {
    try {
        return (await navigator.storage?.persist?.()) ?? false;
    } catch {
        return false;
    }
}
