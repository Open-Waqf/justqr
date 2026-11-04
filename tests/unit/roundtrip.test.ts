// Every code type is encoded, drawn, then read back by two decoders that share no code with
// the encoder. The text must come back exactly.
import {describe, expect, it} from 'vitest';
import {buildPayload, type CodeType, emptyFields, type Fields} from '../../src/lib/payload';
import {byteLength, EC_LEVELS, type Ec, MAX_BYTES, makeMatrix} from '../../src/lib/qr';
import {type CodeStyle, DEFAULT_STYLE, toPixels} from '../../src/lib/render';
import {decodeBoth} from '../support/decode';

async function roundTrip(text: string, ec: Ec = 'M', style: CodeStyle = DEFAULT_STYLE, scale = 4) {
    const m = makeMatrix(text, ec);
    const got = await decodeBoth(toPixels(m, style, scale));
    expect(got.jsqr, 'jsQR').toBe(text);
    expect(got.zxing, 'ZXing').toBe(text);
}

const cases: [string, CodeType, Fields][] = [
    ['short link', 'link', {url: 'open-waqf.org'}],
    ['link with query and fragment', 'link', {url: 'https://example.org/menu?table=4&lang=ar#drinks'}],
    ['Arabic link', 'link', {url: 'https://ar.wikipedia.org/wiki/وقف'}],
    ['text with emoji and line breaks', 'text', {text: 'Bonjour 👋\nسلام عليكم\n🕌✨'}],
    ['special characters', 'text', {text: '<>&"\'\\%{}[]|^~`$#@!*()_+=;:,./?'}],
    [
        'Wi-Fi with every special character',
        'wifi',
        {ssid: 'Café "Al;Andalus", 5:G', password: 'p;a,s:s\\w"rd', security: 'WPA', hidden: false},
    ],
    ['hidden open Wi-Fi', 'wifi', {ssid: 'Guest', password: '', security: 'nopass', hidden: true}],
    [
        'contact',
        'contact',
        {
            ...emptyFields('contact'),
            firstName: 'أحمد',
            lastName: 'Benali, Jr',
            phone: '+33 6 12 34 56 78',
            email: 'ahmed@example.org',
            org: 'Open Waqf; Paris',
            url: 'open-waqf.org',
        },
    ],
    ['phone', 'phone', {number: '+33 1 23 45 67 89'}],
    ['SMS', 'sms', {number: '+33600000000', message: 'Table 4: ready ✅'}],
    ['email', 'email', {to: 'hello@open-waqf.org', subject: 'Salam & hello', body: 'Line 1\nسطر 2'}],
];

describe('every type decodes back exactly', () => {
    for (const [name, type, fields] of cases) {
        it(name, async () => {
            const text = buildPayload(type, fields as never);
            expect(text).not.toBe('');
            await roundTrip(text);
        });
    }
});

describe('every error correction level', () => {
    for (const ec of EC_LEVELS) {
        it(ec, async () => roundTrip('https://open-waqf.org/just-qr', ec));
    }
});

describe('near the capacity limit', () => {
    it('Latin text, error correction L, just under the limit', async () => {
        await roundTrip('a'.repeat(MAX_BYTES.L - 3), 'L', DEFAULT_STYLE, 3);
    });
    it('Arabic text, error correction M (2 bytes per letter)', async () => {
        const text = 'سلام'.repeat(Math.floor((MAX_BYTES.M - 10) / byteLength('سلام')));
        expect(byteLength(text)).toBeGreaterThan(MAX_BYTES.M - 20);
        await roundTrip(text, 'M', DEFAULT_STYLE, 3);
    });
    it('emoji text, error correction H (4 bytes each)', async () => {
        const text = '🕌'.repeat(Math.floor((MAX_BYTES.H - 4) / 4));
        await roundTrip(text, 'H', DEFAULT_STYLE, 3);
    });
});

describe('colours and margin', () => {
    it('dark green on cream decodes', async () => {
        await roundTrip('https://open-waqf.org', 'M', {fg: '#0b3d3a', bg: '#fff4d6', margin: 4});
    });
    it('a 2 module margin still decodes', async () => {
        await roundTrip('https://open-waqf.org', 'M', {...DEFAULT_STYLE, margin: 2});
    });
});
