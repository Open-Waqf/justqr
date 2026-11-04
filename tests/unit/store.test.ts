import 'fake-indexeddb/auto';
import {IDBFactory} from 'fake-indexeddb';
import {beforeEach, describe, expect, it} from 'vitest';
import {DEFAULT_LOOK} from '../../src/lib/look';
import {
    clearCodes,
    closeStore,
    DB_NAME,
    DB_VERSION,
    deleteCode,
    getCode,
    listCodes,
    parseRecord,
    putCode,
    rememberCode,
    type SavedCode,
    sameCode,
} from '../../src/lib/store';

const good: SavedCode = {
    id: 'a',
    schema: 1,
    createdAt: 1000,
    updatedAt: 1000,
    type: 'link',
    fields: {url: 'open-waqf.org'},
    look: DEFAULT_LOOK,
    payload: 'https://open-waqf.org',
};

/** Writes anything, bypassing the app, like an older or newer app version would. */
async function putRaw(value: unknown) {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    const db = await new Promise<IDBDatabase>((ok, fail) => {
        req.onupgradeneeded = () => req.result.createObjectStore('codes', {keyPath: 'id'});
        req.onsuccess = () => ok(req.result);
        req.onerror = () => fail(req.error);
    });
    const tx = db.transaction('codes', 'readwrite');
    tx.objectStore('codes').put(value);
    await new Promise((ok) => {
        tx.oncomplete = ok;
    });
    db.close();
}

beforeEach(async () => {
    // A fresh, empty database for every test. The store module reopens it lazily.
    await closeStore();
    (globalThis as {indexedDB: IDBFactory}).indexedDB = new IDBFactory();
});

describe('parseRecord', () => {
    it('accepts a good record and rebuilds it field by field', () => {
        expect(parseRecord(good)).toEqual(good);
        const withLogo = {
            ...good,
            look: {...DEFAULT_LOOK, logo: {href: 'data:image/png;base64,AA', ratio: 0.2}},
        };
        expect(parseRecord(withLogo)).toEqual(withLogo);
    });
    it('rejects what it cannot understand, without throwing', () => {
        expect(parseRecord(null)).toBeNull();
        expect(parseRecord('x')).toBeNull();
        expect(parseRecord({...good, schema: 2})).toBeNull();
        expect(parseRecord({...good, type: 'barcode'})).toBeNull();
        expect(parseRecord({...good, payload: ''})).toBeNull();
        expect(parseRecord({...good, look: {...DEFAULT_LOOK, fg: 'black'}})).toBeNull();
        expect(parseRecord({...good, look: {...DEFAULT_LOOK, ec: 'X'}})).toBeNull();
        expect(
            parseRecord({...good, look: {...DEFAULT_LOOK, logo: {href: 'http://x', ratio: 0.2}}}),
        ).toBeNull();
        expect(
            parseRecord({
                ...good,
                look: {...DEFAULT_LOOK, logo: {href: 'data:image/png;base64,AA', ratio: 0.9}},
            }),
        ).toBeNull();
    });
});

describe('store', () => {
    it('keeps, lists newest first, gets, deletes', async () => {
        await putCode(good);
        await putCode({...good, id: 'b', updatedAt: 2000, payload: 'tel:1'});
        const {codes, unreadable} = await listCodes();
        expect(codes.map((c) => c.id)).toEqual(['b', 'a']);
        expect(unreadable).toBe(0);
        expect(await getCode('a')).toEqual(good);
        await deleteCode('a');
        expect(await getCode('a')).toBeNull();
        expect((await listCodes()).codes.map((c) => c.id)).toEqual(['b']);
    });

    it('a record it cannot read is skipped, counted, and left in place', async () => {
        await putRaw({id: 'future', schema: 2, something: 'new'});
        await putCode(good);
        const {codes, unreadable} = await listCodes();
        expect(codes.map((c) => c.id)).toEqual(['a']);
        expect(unreadable).toBe(1);
        // Still there after a delete of another record.
        await deleteCode('a');
        expect((await listCodes()).unreadable).toBe(1);
    });

    it('clear all removes everything, readable or not', async () => {
        await putRaw({id: 'future', schema: 2});
        await putCode(good);
        await clearCodes();
        expect(await listCodes()).toEqual({codes: [], unreadable: 0});
    });

    it('remembering the same code twice keeps one record, with a newer time', async () => {
        const first = await rememberCode({
            type: 'link',
            fields: {url: 'a.org'},
            look: DEFAULT_LOOK,
            payload: 'https://a.org',
        });
        await new Promise((r) => setTimeout(r, 2));
        const second = await rememberCode({
            type: 'link',
            fields: {url: 'a.org'},
            look: DEFAULT_LOOK,
            payload: 'https://a.org',
        });
        expect(second.id).toBe(first.id);
        expect(second.createdAt).toBe(first.createdAt);
        expect(second.updatedAt).toBeGreaterThan(first.updatedAt);
        expect((await listCodes()).codes).toHaveLength(1);
    });

    it('a different look or text is a new record', async () => {
        const a = await rememberCode({
            type: 'link',
            fields: {url: 'a.org'},
            look: DEFAULT_LOOK,
            payload: 'https://a.org',
        });
        const b = await rememberCode({
            type: 'link',
            fields: {url: 'a.org'},
            look: {...DEFAULT_LOOK, fg: '#0b3d3a'},
            payload: 'https://a.org',
        });
        const c = await rememberCode({
            type: 'link',
            fields: {url: 'b.org'},
            look: DEFAULT_LOOK,
            payload: 'https://b.org',
        });
        expect(new Set([a.id, b.id, c.id]).size).toBe(3);
    });

    it('sameCode ignores colour case and compares logos by content', () => {
        const base = {payload: 'x', look: DEFAULT_LOOK};
        expect(sameCode(base, {payload: 'x', look: {...DEFAULT_LOOK, fg: '#000000'.toUpperCase()}})).toBe(
            true,
        );
        const logo = {href: 'data:image/png;base64,AA', ratio: 0.2};
        expect(
            sameCode(
                {payload: 'x', look: {...DEFAULT_LOOK, logo}},
                {payload: 'x', look: {...DEFAULT_LOOK, logo: {...logo}}},
            ),
        ).toBe(true);
        expect(
            sameCode(
                {payload: 'x', look: {...DEFAULT_LOOK, logo}},
                {payload: 'x', look: {...DEFAULT_LOOK, logo: {...logo, ratio: 0.3}}},
            ),
        ).toBe(false);
        expect(sameCode(base, {payload: 'x', look: {...DEFAULT_LOOK, logo}})).toBe(false);
    });
});
