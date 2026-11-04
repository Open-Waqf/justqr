import {describe, expect, it} from 'vitest';
import {
    buildPayload,
    CODE_TYPES,
    cleanPhone,
    emptyFields,
    escapeVcard,
    escapeWifi,
    normalizeUrl,
} from '../../src/lib/payload';

describe('link', () => {
    it('keeps a full address as typed', () => {
        expect(normalizeUrl('https://open-waqf.org/a?b=1#c')).toBe('https://open-waqf.org/a?b=1#c');
        expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });
    it('adds https:// to a bare domain, with or without a path', () => {
        expect(normalizeUrl('example.com')).toBe('https://example.com');
        expect(normalizeUrl('  menu.example.co.uk/table/4 ')).toBe('https://menu.example.co.uk/table/4');
        expect(normalizeUrl('example.org:8080/x')).toBe('https://example.org:8080/x');
    });
    it('leaves other schemes and plain words alone', () => {
        expect(normalizeUrl('geo:48.85,2.35')).toBe('geo:48.85,2.35');
        expect(normalizeUrl('hello world')).toBe('hello world');
        expect(normalizeUrl('version 1.5')).toBe('version 1.5');
    });
    it('is empty when nothing was typed', () => {
        expect(buildPayload('link', {url: '   '})).toBe('');
    });
});

describe('wifi', () => {
    it('matches the ZXing example', () => {
        expect(
            buildPayload('wifi', {ssid: 'mynetwork', password: 'mypass', security: 'WPA', hidden: false}),
        ).toBe('WIFI:T:WPA;S:mynetwork;P:mypass;;');
    });
    it('escapes \\ ; , : and " in the name and the password', () => {
        expect(escapeWifi('a\\b;c,d:e"f')).toBe('a\\\\b\\;c\\,d\\:e\\"f');
        expect(
            buildPayload('wifi', {ssid: 'Café;5G', password: 'p:a,s"s\\', security: 'WPA', hidden: false}),
        ).toBe('WIFI:T:WPA;S:Café\\;5G;P:p\\:a\\,s\\"s\\\\;;');
    });
    it('marks a hidden network and leaves out the password of an open one', () => {
        expect(
            buildPayload('wifi', {ssid: 'Guest', password: 'ignored', security: 'nopass', hidden: true}),
        ).toBe('WIFI:T:nopass;S:Guest;H:true;;');
    });
    it('needs a network name', () => {
        expect(buildPayload('wifi', {ssid: '', password: 'x', security: 'WPA', hidden: false})).toBe('');
    });
});

describe('contact (vCard 3.0)', () => {
    const base = emptyFields('contact');
    it('writes a known good card with CR LF line ends', () => {
        const card = buildPayload('contact', {
            ...base,
            firstName: 'Ahmed',
            lastName: 'Benali',
            phone: '+33 6 12 34 56 78',
            email: 'ahmed@example.org',
            org: 'Open Waqf',
            title: 'Imam',
            url: 'open-waqf.org',
        });
        expect(card).toBe(
            [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'N:Benali;Ahmed;;;',
                'FN:Ahmed Benali',
                'ORG:Open Waqf',
                'TITLE:Imam',
                'TEL;TYPE=CELL:+33612345678',
                'EMAIL:ahmed@example.org',
                'URL:https://open-waqf.org',
                'END:VCARD',
            ].join('\r\n'),
        );
    });
    it('escapes commas, semicolons, backslashes and line breaks', () => {
        expect(escapeVcard('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
        const card = buildPayload('contact', {...base, firstName: 'Smith, Jr;', org: 'A\\B'});
        expect(card).toContain('N:;Smith\\, Jr\\;;;;');
        expect(card).toContain('FN:Smith\\, Jr\\;');
        expect(card).toContain('ORG:A\\\\B');
    });
    it('uses the organisation as the name when there is no person', () => {
        expect(buildPayload('contact', {...base, org: 'Al Andalus Restaurant'})).toContain(
            'FN:Al Andalus Restaurant',
        );
    });
    it('keeps Arabic names as they are', () => {
        expect(buildPayload('contact', {...base, firstName: 'أحمد', lastName: 'بن علي'})).toContain(
            'FN:أحمد بن علي',
        );
    });
    it('is empty when there is nothing to save', () => {
        expect(buildPayload('contact', base)).toBe('');
    });
});

describe('phone, SMS, email', () => {
    it('phone', () => {
        expect(cleanPhone(' +1 (555) 010-9999 ')).toBe('+15550109999');
        expect(buildPayload('phone', {number: '+33 1 23 45 67 89'})).toBe('tel:+33123456789');
        expect(buildPayload('phone', {number: 'abc'})).toBe('');
    });
    it('SMS', () => {
        expect(buildPayload('sms', {number: '+33 6 00', message: 'Table 4: ready'})).toBe(
            'SMSTO:+33600:Table 4: ready',
        );
        expect(buildPayload('sms', {number: '0600', message: ''})).toBe('SMSTO:0600');
        expect(buildPayload('sms', {number: '', message: 'hi'})).toBe('');
    });
    it('email', () => {
        expect(buildPayload('email', {to: 'a@b.org', subject: '', body: ''})).toBe('mailto:a@b.org');
        expect(buildPayload('email', {to: 'a@b.org', subject: 'Hello & bye', body: 'Line 1\nسلام'})).toBe(
            'mailto:a@b.org?subject=Hello%20%26%20bye&body=Line%201%0A%D8%B3%D9%84%D8%A7%D9%85',
        );
        expect(buildPayload('email', {to: ' ', subject: 'x', body: ''})).toBe('');
    });
    it('text is kept exactly, spaces and line breaks included', () => {
        expect(buildPayload('text', {text: '  two\nlines  '})).toBe('  two\nlines  ');
    });
});

describe('every type', () => {
    it('starts empty, so no code is shown before the user types', () => {
        for (const type of CODE_TYPES) expect(buildPayload(type, emptyFields(type))).toBe('');
    });
    it('an unknown type gives nothing', () => {
        expect(buildPayload('nope' as never, {} as never)).toBe('');
    });
});
