// All texts of the app, in every language, in one file.
// scripts/check-i18n.mjs checks that every language has every text and every text is used.
// French, Spanish, Italian and Arabic were written with AI help: docs/TRANSLATIONS.md lists
// what still needs a native speaker's review.

export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'it';
export const LOCALES: readonly Locale[] = ['en', 'ar', 'fr', 'es', 'it'];
export const LOCALE_NAMES: Record<Locale, string> = {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    es: 'Español',
    it: 'Italiano',
};
const STORAGE_KEY = 'justqr.locale';

const EN_MESSAGES = {
    'make.types': 'Type of code',
    'make.type.link': 'Link',
    'make.type.text': 'Text',
    'make.type.wifi': 'Wi-Fi',
    'make.type.contact': 'Contact',
    'make.type.phone': 'Phone',
    'make.type.sms': 'SMS',
    'make.type.email': 'Email',
    'field.url': 'Link',
    'field.text': 'Text',
    'field.ssid': 'Network name',
    'field.password': 'Password',
    'field.security': 'Security',
    'field.security_wpa': 'WPA/WPA2/WPA3',
    'field.security_wep': 'WEP (old)',
    'field.security_none': 'None (open network)',
    'field.hidden': 'Hidden network',
    'field.first_name': 'First name',
    'field.last_name': 'Last name',
    'field.phone': 'Phone',
    'field.email': 'Email',
    'field.org': 'Organisation',
    'field.job_title': 'Job title',
    'field.website': 'Website',
    'field.number': 'Phone number',
    'field.message': 'Message',
    'field.to': 'To',
    'field.subject': 'Subject',
    'make.empty': 'Your code appears here as you type.',
    'make.preview_alt': 'QR code',
    'make.too_long': 'Too long for one QR code. Make it shorter.',
    'make.almost_full': 'This code is almost full. Long codes are dense and harder to scan.',
    'make.honest.link': 'This code holds your link directly.',
    'make.honest.text': 'This code holds your text directly.',
    'make.honest.wifi': 'This code holds your Wi-Fi details directly.',
    'make.honest.contact': 'This code holds your contact card directly.',
    'make.honest.phone': 'This code holds your phone number directly.',
    'make.honest.sms': 'This code holds your message directly.',
    'make.honest.email': 'This code holds your email directly.',
    'make.honest_end': 'It works forever, and nobody can track who scans it.',
    'action.save': 'Save',
    'action.share': 'Share',
    'action.more': 'More options',
    'action.save_svg': 'Save as SVG',
    'action.copy': 'Copy',
    'action.print': 'Print',
    'toast.saved': 'Saved',
    'toast.copied': 'Copied',
    'toast.copied_text': 'Copied as text',
    'toast.failed': 'That did not work. Please try again.',
    'style.title': 'Style',
    'style.default': 'Default',
    'style.custom': 'Custom',
    'style.colours': 'Colours',
    'style.fg': 'Code',
    'style.bg': 'Background',
    'style.size': 'Image size',
    'style.size_help': 'The size of the saved image. The code itself is the same.',
    'style.ec': 'Error correction',
    'style.ec_help':
        'How much of the code can be dirty or covered and still scan: L 7%, M 15%, Q 25%, H 30%. Higher makes a denser code.',
    'style.margin': 'Margin',
    'style.margin_help': 'White space around the code, in squares. Scanners need it: 4 is the standard.',
    'style.reset': 'Back to default',
    'warn.low_contrast':
        'The colours are too close. Some phones may not scan this code. Use a darker code or a lighter background.',
    'warn.inverted':
        'The code is lighter than its background. Many phones only scan dark codes on a light background.',
    'warn.no_margin': 'No margin: leave white space around the code wherever you print it.',
} as const;

export type MessageKey = keyof typeof EN_MESSAGES;
type Messages = Record<MessageKey, string>;

const AR_MESSAGES: Messages = {
    'make.types': 'نوع الرمز',
    'make.type.link': 'رابط',
    'make.type.text': 'نص',
    'make.type.wifi': 'واي فاي',
    'make.type.contact': 'جهة اتصال',
    'make.type.phone': 'هاتف',
    'make.type.sms': 'رسالة',
    'make.type.email': 'بريد',
    'field.url': 'الرابط',
    'field.text': 'النص',
    'field.ssid': 'اسم الشبكة',
    'field.password': 'كلمة المرور',
    'field.security': 'الحماية',
    'field.security_wpa': 'WPA/WPA2/WPA3',
    'field.security_wep': 'WEP (قديم)',
    'field.security_none': 'بدون (شبكة مفتوحة)',
    'field.hidden': 'شبكة مخفية',
    'field.first_name': 'الاسم',
    'field.last_name': 'اسم العائلة',
    'field.phone': 'الهاتف',
    'field.email': 'البريد الإلكتروني',
    'field.org': 'المؤسسة',
    'field.job_title': 'المسمى الوظيفي',
    'field.website': 'الموقع',
    'field.number': 'رقم الهاتف',
    'field.message': 'الرسالة',
    'field.to': 'إلى',
    'field.subject': 'الموضوع',
    'make.empty': 'يظهر رمزك هنا أثناء الكتابة.',
    'make.preview_alt': 'رمز QR',
    'make.too_long': 'النص طويل جدًا على رمز QR واحد. اجعله أقصر.',
    'make.almost_full': 'هذا الرمز ممتلئ تقريبًا. الرموز الطويلة كثيفة ويصعب مسحها.',
    'make.honest.link': 'هذا الرمز يحمل رابطك مباشرة.',
    'make.honest.text': 'هذا الرمز يحمل نصك مباشرة.',
    'make.honest.wifi': 'هذا الرمز يحمل بيانات الواي فاي مباشرة.',
    'make.honest.contact': 'هذا الرمز يحمل بطاقة الاتصال مباشرة.',
    'make.honest.phone': 'هذا الرمز يحمل رقم هاتفك مباشرة.',
    'make.honest.sms': 'هذا الرمز يحمل رسالتك مباشرة.',
    'make.honest.email': 'هذا الرمز يحمل بريدك مباشرة.',
    'make.honest_end': 'يعمل إلى الأبد، ولا يمكن لأحد تتبع من يمسحه.',
    'action.save': 'حفظ',
    'action.share': 'مشاركة',
    'action.more': 'خيارات أخرى',
    'action.save_svg': 'حفظ بصيغة SVG',
    'action.copy': 'نسخ',
    'action.print': 'طباعة',
    'toast.saved': 'تم الحفظ',
    'toast.copied': 'تم النسخ',
    'toast.copied_text': 'تم النسخ كنص',
    'toast.failed': 'لم ينجح ذلك. حاول مرة أخرى.',
    'style.title': 'التنسيق',
    'style.default': 'افتراضي',
    'style.custom': 'مخصص',
    'style.colours': 'الألوان',
    'style.fg': 'الرمز',
    'style.bg': 'الخلفية',
    'style.size': 'حجم الصورة',
    'style.size_help': 'حجم الصورة المحفوظة. الرمز نفسه لا يتغير.',
    'style.ec': 'تصحيح الأخطاء',
    'style.ec_help':
        'كم يمكن أن يتسخ الرمز أو يُغطى ويبقى قابلًا للمسح: L ‏7%، M ‏15%، Q ‏25%، H ‏30%. القيمة الأعلى تجعل الرمز أكثف.',
    'style.margin': 'الهامش',
    'style.margin_help': 'مساحة بيضاء حول الرمز، بعدد المربعات. الماسحات تحتاجها: 4 هو المعيار.',
    'style.reset': 'العودة إلى الافتراضي',
    'warn.low_contrast':
        'اللونان متقاربان جدًا. قد لا تتمكن بعض الهواتف من مسح هذا الرمز. استخدم رمزًا أغمق أو خلفية أفتح.',
    'warn.inverted': 'الرمز أفتح من خلفيته. كثير من الهواتف لا تمسح إلا الرموز الداكنة على خلفية فاتحة.',
    'warn.no_margin': 'بلا هامش: اترك مساحة بيضاء حول الرمز أينما طبعته.',
};

const FR_MESSAGES: Messages = {
    'make.types': 'Type de code',
    'make.type.link': 'Lien',
    'make.type.text': 'Texte',
    'make.type.wifi': 'Wi-Fi',
    'make.type.contact': 'Contact',
    'make.type.phone': 'Téléphone',
    'make.type.sms': 'SMS',
    'make.type.email': 'E-mail',
    'field.url': 'Lien',
    'field.text': 'Texte',
    'field.ssid': 'Nom du réseau',
    'field.password': 'Mot de passe',
    'field.security': 'Sécurité',
    'field.security_wpa': 'WPA/WPA2/WPA3',
    'field.security_wep': 'WEP (ancien)',
    'field.security_none': 'Aucune (réseau ouvert)',
    'field.hidden': 'Réseau masqué',
    'field.first_name': 'Prénom',
    'field.last_name': 'Nom',
    'field.phone': 'Téléphone',
    'field.email': 'E-mail',
    'field.org': 'Organisation',
    'field.job_title': 'Fonction',
    'field.website': 'Site web',
    'field.number': 'Numéro de téléphone',
    'field.message': 'Message',
    'field.to': 'À',
    'field.subject': 'Objet',
    'make.empty': 'Votre code apparaît ici pendant que vous écrivez.',
    'make.preview_alt': 'Code QR',
    'make.too_long': 'Trop long pour un seul code QR. Raccourcissez-le.',
    'make.almost_full':
        'Ce code est presque plein. Les codes longs sont denses et plus difficiles à scanner.',
    'make.honest.link': 'Ce code contient votre lien directement.',
    'make.honest.text': 'Ce code contient votre texte directement.',
    'make.honest.wifi': 'Ce code contient vos informations Wi-Fi directement.',
    'make.honest.contact': 'Ce code contient votre fiche contact directement.',
    'make.honest.phone': 'Ce code contient votre numéro directement.',
    'make.honest.sms': 'Ce code contient votre message directement.',
    'make.honest.email': 'Ce code contient votre e-mail directement.',
    'make.honest_end': 'Il fonctionne pour toujours, et personne ne peut savoir qui le scanne.',
    'action.save': 'Enregistrer',
    'action.share': 'Partager',
    'action.more': 'Plus d’options',
    'action.save_svg': 'Enregistrer en SVG',
    'action.copy': 'Copier',
    'action.print': 'Imprimer',
    'toast.saved': 'Enregistré',
    'toast.copied': 'Copié',
    'toast.copied_text': 'Copié en texte',
    'toast.failed': 'Cela n’a pas marché. Réessayez.',
    'style.title': 'Style',
    'style.default': 'Par défaut',
    'style.custom': 'Personnalisé',
    'style.colours': 'Couleurs',
    'style.fg': 'Code',
    'style.bg': 'Fond',
    'style.size': 'Taille de l’image',
    'style.size_help': 'La taille de l’image enregistrée. Le code lui-même ne change pas.',
    'style.ec': 'Correction d’erreurs',
    'style.ec_help':
        'La part du code qui peut être salie ou cachée sans gêner le scan : L 7 %, M 15 %, Q 25 %, H 30 %. Plus c’est haut, plus le code est dense.',
    'style.margin': 'Marge',
    'style.margin_help':
        'L’espace blanc autour du code, en carrés. Les scanners en ont besoin : 4 est la norme.',
    'style.reset': 'Revenir au style par défaut',
    'warn.low_contrast':
        'Les couleurs sont trop proches. Certains téléphones risquent de ne pas scanner ce code. Prenez un code plus foncé ou un fond plus clair.',
    'warn.inverted':
        'Le code est plus clair que son fond. Beaucoup de téléphones ne scannent que des codes foncés sur fond clair.',
    'warn.no_margin': 'Pas de marge : laissez un espace blanc autour du code là où vous l’imprimez.',
};

const ES_MESSAGES: Messages = {
    'make.types': 'Tipo de código',
    'make.type.link': 'Enlace',
    'make.type.text': 'Texto',
    'make.type.wifi': 'Wi-Fi',
    'make.type.contact': 'Contacto',
    'make.type.phone': 'Teléfono',
    'make.type.sms': 'SMS',
    'make.type.email': 'Correo',
    'field.url': 'Enlace',
    'field.text': 'Texto',
    'field.ssid': 'Nombre de la red',
    'field.password': 'Contraseña',
    'field.security': 'Seguridad',
    'field.security_wpa': 'WPA/WPA2/WPA3',
    'field.security_wep': 'WEP (antiguo)',
    'field.security_none': 'Ninguna (red abierta)',
    'field.hidden': 'Red oculta',
    'field.first_name': 'Nombre',
    'field.last_name': 'Apellidos',
    'field.phone': 'Teléfono',
    'field.email': 'Correo',
    'field.org': 'Organización',
    'field.job_title': 'Cargo',
    'field.website': 'Sitio web',
    'field.number': 'Número de teléfono',
    'field.message': 'Mensaje',
    'field.to': 'Para',
    'field.subject': 'Asunto',
    'make.empty': 'Tu código aparece aquí mientras escribes.',
    'make.preview_alt': 'Código QR',
    'make.too_long': 'Demasiado largo para un solo código QR. Acórtalo.',
    'make.almost_full':
        'Este código está casi lleno. Los códigos largos son densos y más difíciles de escanear.',
    'make.honest.link': 'Este código contiene tu enlace directamente.',
    'make.honest.text': 'Este código contiene tu texto directamente.',
    'make.honest.wifi': 'Este código contiene los datos de tu Wi-Fi directamente.',
    'make.honest.contact': 'Este código contiene tu tarjeta de contacto directamente.',
    'make.honest.phone': 'Este código contiene tu número directamente.',
    'make.honest.sms': 'Este código contiene tu mensaje directamente.',
    'make.honest.email': 'Este código contiene tu correo directamente.',
    'make.honest_end': 'Funciona para siempre y nadie puede rastrear quién lo escanea.',
    'action.save': 'Guardar',
    'action.share': 'Compartir',
    'action.more': 'Más opciones',
    'action.save_svg': 'Guardar como SVG',
    'action.copy': 'Copiar',
    'action.print': 'Imprimir',
    'toast.saved': 'Guardado',
    'toast.copied': 'Copiado',
    'toast.copied_text': 'Copiado como texto',
    'toast.failed': 'No ha funcionado. Inténtalo de nuevo.',
    'style.title': 'Estilo',
    'style.default': 'Predeterminado',
    'style.custom': 'Personalizado',
    'style.colours': 'Colores',
    'style.fg': 'Código',
    'style.bg': 'Fondo',
    'style.size': 'Tamaño de la imagen',
    'style.size_help': 'El tamaño de la imagen guardada. El código en sí no cambia.',
    'style.ec': 'Corrección de errores',
    'style.ec_help':
        'Cuánto del código puede estar sucio o tapado y aún escanearse: L 7 %, M 15 %, Q 25 %, H 30 %. Cuanto más alto, más denso es el código.',
    'style.margin': 'Margen',
    'style.margin_help':
        'Espacio blanco alrededor del código, en cuadros. Los escáneres lo necesitan: 4 es el estándar.',
    'style.reset': 'Volver al predeterminado',
    'warn.low_contrast':
        'Los colores están demasiado cerca. Algunos teléfonos quizá no escaneen este código. Usa un código más oscuro o un fondo más claro.',
    'warn.inverted':
        'El código es más claro que su fondo. Muchos teléfonos solo escanean códigos oscuros sobre fondo claro.',
    'warn.no_margin': 'Sin margen: deja espacio blanco alrededor del código donde lo imprimas.',
};

const IT_MESSAGES: Messages = {
    'make.types': 'Tipo di codice',
    'make.type.link': 'Link',
    'make.type.text': 'Testo',
    'make.type.wifi': 'Wi-Fi',
    'make.type.contact': 'Contatto',
    'make.type.phone': 'Telefono',
    'make.type.sms': 'SMS',
    'make.type.email': 'Email',
    'field.url': 'Link',
    'field.text': 'Testo',
    'field.ssid': 'Nome della rete',
    'field.password': 'Password',
    'field.security': 'Sicurezza',
    'field.security_wpa': 'WPA/WPA2/WPA3',
    'field.security_wep': 'WEP (vecchio)',
    'field.security_none': 'Nessuna (rete aperta)',
    'field.hidden': 'Rete nascosta',
    'field.first_name': 'Nome',
    'field.last_name': 'Cognome',
    'field.phone': 'Telefono',
    'field.email': 'Email',
    'field.org': 'Organizzazione',
    'field.job_title': 'Ruolo',
    'field.website': 'Sito web',
    'field.number': 'Numero di telefono',
    'field.message': 'Messaggio',
    'field.to': 'A',
    'field.subject': 'Oggetto',
    'make.empty': 'Il tuo codice appare qui mentre scrivi.',
    'make.preview_alt': 'Codice QR',
    'make.too_long': 'Troppo lungo per un solo codice QR. Accorcialo.',
    'make.almost_full':
        'Questo codice è quasi pieno. I codici lunghi sono fitti e più difficili da scansionare.',
    'make.honest.link': 'Questo codice contiene direttamente il tuo link.',
    'make.honest.text': 'Questo codice contiene direttamente il tuo testo.',
    'make.honest.wifi': 'Questo codice contiene direttamente i dati del tuo Wi-Fi.',
    'make.honest.contact': 'Questo codice contiene direttamente il tuo biglietto da visita.',
    'make.honest.phone': 'Questo codice contiene direttamente il tuo numero.',
    'make.honest.sms': 'Questo codice contiene direttamente il tuo messaggio.',
    'make.honest.email': 'Questo codice contiene direttamente la tua email.',
    'make.honest_end': 'Funziona per sempre e nessuno può sapere chi lo scansiona.',
    'action.save': 'Salva',
    'action.share': 'Condividi',
    'action.more': 'Altre opzioni',
    'action.save_svg': 'Salva come SVG',
    'action.copy': 'Copia',
    'action.print': 'Stampa',
    'toast.saved': 'Salvato',
    'toast.copied': 'Copiato',
    'toast.copied_text': 'Copiato come testo',
    'toast.failed': 'Non ha funzionato. Riprova.',
    'style.title': 'Stile',
    'style.default': 'Predefinito',
    'style.custom': 'Personalizzato',
    'style.colours': 'Colori',
    'style.fg': 'Codice',
    'style.bg': 'Sfondo',
    'style.size': 'Dimensione dell’immagine',
    'style.size_help': 'La dimensione dell’immagine salvata. Il codice in sé non cambia.',
    'style.ec': 'Correzione degli errori',
    'style.ec_help':
        'Quanto del codice può essere sporco o coperto e funzionare ancora: L 7%, M 15%, Q 25%, H 30%. Più è alto, più il codice è fitto.',
    'style.margin': 'Margine',
    'style.margin_help':
        'Spazio bianco intorno al codice, in quadretti. Gli scanner ne hanno bisogno: 4 è lo standard.',
    'style.reset': 'Torna al predefinito',
    'warn.low_contrast':
        'I colori sono troppo vicini. Alcuni telefoni potrebbero non leggere questo codice. Usa un codice più scuro o uno sfondo più chiaro.',
    'warn.inverted':
        'Il codice è più chiaro del suo sfondo. Molti telefoni leggono solo codici scuri su sfondo chiaro.',
    'warn.no_margin': 'Nessun margine: lascia spazio bianco intorno al codice dove lo stampi.',
};

const MESSAGES: Record<Locale, Messages> = {
    en: EN_MESSAGES,
    ar: AR_MESSAGES,
    fr: FR_MESSAGES,
    es: ES_MESSAGES,
    it: IT_MESSAGES,
};

let current: Locale = 'en';

/** The text for `key` in the current language, with {{name}} placeholders filled in. */
export function t(key: MessageKey, vars: Record<string, string | number> = {}): string {
    const text = MESSAGES[current][key] ?? EN_MESSAGES[key];
    return text.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? ''));
}

export const getLocale = (): Locale => current;
export const dirOf = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr');

/** First supported language from the saved choice, then the phone's languages, else English. */
export function pickLocale(saved: string | null, preferred: readonly string[]): Locale {
    const ok = (code: string) => LOCALES.find((l) => l === code.toLowerCase().split('-')[0]);
    if (saved && ok(saved)) return ok(saved)!;
    for (const code of preferred) {
        const found = ok(code);
        if (found) return found;
    }
    return 'en';
}

export function initialLocale(): Locale {
    let saved: string | null = null;
    try {
        saved = localStorage.getItem(STORAGE_KEY);
    } catch {
        // Storage can be blocked; the phone's language is still used.
    }
    return pickLocale(saved, navigator.languages ?? [navigator.language]);
}

/** Switches the language, sets lang and dir on <html>, and tells the app to redraw. */
export function applyLocale(locale: Locale, save = false): void {
    current = locale;
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
    if (save) {
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch {
            // Not saved; the choice still applies until the app closes.
        }
    }
    window.dispatchEvent(new CustomEvent('jq-locale'));
}
