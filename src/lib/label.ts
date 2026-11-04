// label.ts: a short name for a saved code, from what the user typed.
import type {CodeType, Fields, FieldsByType} from './payload';

const MAX = 48;

const trim = (s: string) => {
    const one = s.replace(/\s+/g, ' ').trim();
    return one.length > MAX ? `${one.slice(0, MAX - 1)}…` : one;
};

/** "open-waqf.org/menu" for a link, the network name for Wi-Fi, the person for a contact... */
export function labelFor(type: CodeType, fields: Fields, payload: string): string {
    switch (type) {
        case 'link': {
            const url = (fields as FieldsByType['link']).url.trim();
            return trim(url.replace(/^https?:\/\//i, '').replace(/\/$/, '') || payload);
        }
        case 'text':
            return trim((fields as FieldsByType['text']).text);
        case 'wifi':
            return trim((fields as FieldsByType['wifi']).ssid);
        case 'contact': {
            const f = fields as FieldsByType['contact'];
            return trim([f.firstName, f.lastName].filter(Boolean).join(' ') || f.org || f.phone || f.email);
        }
        case 'phone':
            return trim((fields as FieldsByType['phone']).number);
        case 'sms':
            return trim((fields as FieldsByType['sms']).number);
        case 'email':
            return trim((fields as FieldsByType['email']).to);
        default:
            return trim(payload);
    }
}
