import {describe, expect, it} from 'vitest';
import {labelFor} from '../../src/lib/label';
import {emptyFields} from '../../src/lib/payload';

describe('labelFor', () => {
    it('link: without the scheme or a trailing slash', () => {
        expect(labelFor('link', {url: 'https://open-waqf.org/menu/'}, 'https://open-waqf.org/menu/')).toBe(
            'open-waqf.org/menu',
        );
    });
    it('the main field of each type', () => {
        expect(labelFor('wifi', {...emptyFields('wifi'), ssid: 'Home'}, 'WIFI:...')).toBe('Home');
        expect(
            labelFor('contact', {...emptyFields('contact'), firstName: 'أحمد', lastName: 'بن علي'}, ''),
        ).toBe('أحمد بن علي');
        expect(labelFor('contact', {...emptyFields('contact'), org: 'Open Waqf'}, '')).toBe('Open Waqf');
        expect(labelFor('phone', {number: '+33 1'}, 'tel:+331')).toBe('+33 1');
        expect(labelFor('sms', {number: '0600', message: 'hi'}, '')).toBe('0600');
        expect(labelFor('email', {to: 'a@b.org', subject: '', body: ''}, '')).toBe('a@b.org');
    });
    it('text: one line, cut at 48 characters', () => {
        const long = 'word '.repeat(20);
        const label = labelFor('text', {text: `first\n\nline  ${long}`}, '');
        expect(label.startsWith('first line word')).toBe(true);
        expect(label.length).toBe(48);
        expect(label.endsWith('…')).toBe(true);
    });
});
