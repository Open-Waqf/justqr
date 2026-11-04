// payload.ts: turns what the user typed into the text stored inside the QR code.
//
// Each type follows the format phone cameras understand:
//   link     the address itself (https:// added when the user typed only "example.com")
//   text     the text as typed
//   wifi     WIFI:T:WPA;S:name;P:password;H:true;;   (ZXing format, read by Android and iOS)
//   contact  vCard 3.0
//   phone    tel:+33123456789
//   sms      SMSTO:+33123456789:message
//   email    mailto:someone@example.org?subject=...&body=...
// An empty string means "nothing to put in a code yet" (a required field is empty).

export type CodeType = 'link' | 'text' | 'wifi' | 'contact' | 'phone' | 'sms' | 'email';
export const CODE_TYPES: readonly CodeType[] = ['link', 'text', 'wifi', 'contact', 'phone', 'sms', 'email'];

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface FieldsByType {
    link: {url: string};
    text: {text: string};
    wifi: {ssid: string; password: string; security: WifiSecurity; hidden: boolean};
    contact: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        org: string;
        title: string;
        url: string;
    };
    phone: {number: string};
    sms: {number: string; message: string};
    email: {to: string; subject: string; body: string};
}

export type Fields<T extends CodeType = CodeType> = FieldsByType[T];

export function emptyFields<T extends CodeType>(type: T): FieldsByType[T] {
    const all: FieldsByType = {
        link: {url: ''},
        text: {text: ''},
        wifi: {ssid: '', password: '', security: 'WPA', hidden: false},
        contact: {firstName: '', lastName: '', phone: '', email: '', org: '', title: '', url: ''},
        phone: {number: ''},
        sms: {number: '', message: ''},
        email: {to: '', subject: '', body: ''},
    };
    return all[type];
}

/** "example.com/menu" becomes "https://example.com/menu". Anything with a scheme stays as typed. */
export function normalizeUrl(value: string): string {
    const url = value.trim();
    if (!url) return '';
    // A web address without a scheme: "example.com", "menu.example.co.uk/4", "example.org:8080".
    // Checked first, because "example.org:8080" also looks like a scheme followed by ":".
    if (/^[^\s/:]+\.[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(url)) return `https://${url}`;
    return url;
}

/** Wi-Fi fields escape \ ; , : and " with a backslash. */
export function escapeWifi(value: string): string {
    return value.replace(/([\\;,:"])/g, '\\$1');
}

/** vCard text values escape \ , ; and turn line breaks into \n. */
export function escapeVcard(value: string): string {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/([,;])/g, '\\$1')
        .replace(/\r\n|\r|\n/g, '\\n');
}

/** Keeps what a phone dialer understands: digits, +, * and #. */
export function cleanPhone(value: string): string {
    return value.replace(/[^\d+*#]/g, '');
}

const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export function buildPayload<T extends CodeType>(type: T, fields: FieldsByType[T]): string {
    switch (type) {
        case 'link':
            return normalizeUrl((fields as Fields<'link'>).url);
        case 'text':
            return (fields as Fields<'text'>).text;
        case 'wifi':
            return wifi(fields as Fields<'wifi'>);
        case 'contact':
            return vcard(fields as Fields<'contact'>);
        case 'phone': {
            const number = cleanPhone((fields as Fields<'phone'>).number);
            return number ? `tel:${number}` : '';
        }
        case 'sms': {
            const f = fields as Fields<'sms'>;
            const number = cleanPhone(f.number);
            if (!number) return '';
            return f.message ? `SMSTO:${number}:${f.message}` : `SMSTO:${number}`;
        }
        case 'email':
            return mailto(fields as Fields<'email'>);
        default:
            return '';
    }
}

function wifi(f: Fields<'wifi'>): string {
    if (!f.ssid) return '';
    const parts = [`T:${f.security}`, `S:${escapeWifi(f.ssid)}`];
    if (f.security !== 'nopass' && f.password) parts.push(`P:${escapeWifi(f.password)}`);
    if (f.hidden) parts.push('H:true');
    return `WIFI:${parts.join(';')};;`;
}

function vcard(f: Fields<'contact'>): string {
    const first = oneLine(f.firstName);
    const last = oneLine(f.lastName);
    const org = oneLine(f.org);
    const fullName = [first, last].filter(Boolean).join(' ') || org;
    if (!fullName && !f.phone.trim() && !f.email.trim()) return '';
    const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${escapeVcard(last)};${escapeVcard(first)};;;`];
    lines.push(`FN:${escapeVcard(fullName)}`);
    if (org) lines.push(`ORG:${escapeVcard(org)}`);
    if (f.title.trim()) lines.push(`TITLE:${escapeVcard(oneLine(f.title))}`);
    const phone = cleanPhone(f.phone);
    if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
    if (f.email.trim()) lines.push(`EMAIL:${oneLine(f.email)}`);
    const url = normalizeUrl(oneLine(f.url));
    if (url) lines.push(`URL:${url}`);
    lines.push('END:VCARD');
    // vCard lines end with CR LF.
    return lines.join('\r\n');
}

function mailto(f: Fields<'email'>): string {
    const to = oneLine(f.to);
    if (!to) return '';
    const query = [
        f.subject ? `subject=${encodeURIComponent(f.subject)}` : '',
        f.body ? `body=${encodeURIComponent(f.body)}` : '',
    ].filter(Boolean);
    return `mailto:${to}${query.length ? `?${query.join('&')}` : ''}`;
}
