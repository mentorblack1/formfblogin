const translateText = async (text: string, targetLang: string = ''): Promise<string> => {
    try {
        const targetLangs = {
            JP:'ja',
            AE: 'ar',
    AT: 'de',
    BE: 'nl',
    BG: 'bg',
    BR: 'pt',
    CA: 'en',
    CY: 'el',
    CZ: 'cs',
    DE: 'de',
    DK: 'da',
    EE: 'et',
    EG: 'ar',
    ES: 'es',
    FI: 'fi',
    FR: 'fr',
    GB: 'en',
    GR: 'el',
    HR: 'hr',
    HU: 'hu',
    IE: 'ga',
    IN: 'hi',
    IT: 'it',
    LT: 'lt',
    LU: 'lb',
    LV: 'lv',
    MT: 'mt',
    MY: 'ms',
    NL: 'nl',
    NO: 'no',
    PL: 'pl',
    PT: 'pt',
    RO: 'ro',
    SE: 'sv',
    SI: 'sl',
    SK: 'sk',
    TH: 'th',
    TR: 'tr',
    TW: 'zh',
    US: 'en',
    VN: 'vi',
    JO: 'ar',
    LB: 'ar',
    QA: 'ar',
    IQ: 'ar',
    SA: 'ar',
    IL: 'iw',
    KR: 'ko'
        };
        if (!targetLangs[targetLang as keyof typeof targetLangs]) {
            return text;
        }
        const encodedText = encodeURIComponent(text);
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLangs[targetLang as keyof typeof targetLangs]}&dt=t&q=${encodedText}`;

        const response = await fetch(url);
        const data: unknown = await response.json();

        if (Array.isArray(data) && Array.isArray(data[0])) {
            const translatedParts = data[0] as Array<[string, string, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
            const translatedText = translatedParts.map((part) => part[0]).join('');
            return translatedText.trim();
        }
        console.clear();
        return text;
    } catch {
        console.clear();
        return text;
    }
};
export default translateText;
