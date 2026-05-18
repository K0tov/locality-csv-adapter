// =====================================================================
// Locality CSV Adapter — pure client-side normalizer.
// Maps arbitrary translation sheets (Russian/Ukrainian/English headers,
// natural-language keys, transposed layouts, custom column orders)
// into the strict format expected by the Locality plugin:
//   key, ru, en, tr, kk, ar, ...
// =====================================================================

// ---------- Language alias dictionary ---------------------------------
// All keys are lowercase-trimmed.
const LANG_ALIASES = {
  // Russian
  ru: "ru", rus: "ru", russian: "ru", "русский": "ru", "руский": "ru",
  // Ukrainian (including country name aliases)
  uk: "uk", ukr: "uk", ukrainian: "uk", "украинский": "uk", "українська": "uk",
  ua: "uk", ukraine: "uk", "україна": "uk", "украина": "uk",
  // English
  en: "en", eng: "en", english: "en", "английский": "en", "англійська": "en",
  us: "en", uk_lang: "en",
  // Turkish
  tr: "tr", turkish: "tr", "турецкий": "tr", "турецька": "tr",
  // German
  de: "de", deu: "de", german: "de", "немецкий": "de", "німецька": "de",
  // French
  fr: "fr", french: "fr", "французский": "fr", "французька": "fr",
  // Italian
  it: "it", italian: "it", "итальянский": "it", "італійська": "it",
  // Portuguese / Brazilian
  pt: "pt", portuguese: "pt", "португальский": "pt", "португальська": "pt",
  br: "pt", "brazilian": "pt", "brazil": "pt", "бразилия": "pt", "бразильська": "pt",
  // Spanish / Argentina
  es: "es", spanish: "es", "испанский": "es", "іспанська": "es",
  ag: "es", argentine: "es", argentina: "es", "аргентинский": "es", "аргентинська": "es",
  // Polish
  pl: "pl", polish: "pl", polska: "pl", "польский": "pl", "польська": "pl",
  // Japanese
  ja: "ja", jp: "ja", japanese: "ja", "японский": "ja", "японська": "ja",
  // Korean
  ko: "ko", kr: "ko", korean: "ko", "корейский": "ko", "корейська": "ko",
  // Chinese
  zh: "zh", ch: "zh", chinese: "zh", "китайский": "zh", "китайська": "zh",
  // Thai
  th: "th", thai: "th", "тайский": "th", "тайська": "th",
  // Hindi
  hi: "hi", hindi: "hi", "хинди": "hi", "хінді": "hi",
  // Indonesian
  id: "id", indonesian: "id", indonesia: "id", "индонезийский": "id", "індонезійська": "id",
  // Malay
  ms: "ms", malay: "ms", "малайский": "ms", "малайська": "ms",
  // Vietnamese
  vi: "vi", vietnamese: "vi", "вьетнамский": "vi", "в'єтнамська": "vi", "вєтнамська": "vi",
  // Tagalog / Filipino
  tl: "tl", tagalog: "tl", filipino: "tl", "филиппинский": "tl", "тагальська": "tl",
  "филиппинский (тагальский)": "tl", "тагальский": "tl",
  // Bengali
  bn: "bn", bengali: "bn", bengal: "bn", bd: "bn",
  "бенгальский": "bn", "бенгальська": "bn", "бангладеш": "bn", "bangladesh": "bn",
  // Mongolian
  mn: "mn", mongolian: "mn", "монгольский": "mn", "монгольська": "mn",
  // Bulgarian
  bg: "bg", bulgarian: "bg", "болгарский": "bg", "болгарська": "bg",
  // Lithuanian
  lt: "lt", lithuanian: "lt", "литовский": "lt", "литовська": "lt",
  // Latvian
  lv: "lv", latvian: "lv", "латышский": "lv", "латиський": "lv", "латиська": "lv", "латвійська": "lv",
  // Estonian
  et: "et", estonian: "et", "эстонский": "et", "естонська": "et",
  // Romanian
  ro: "ro", romanian: "ro", "румынский": "ro", "румунська": "ro",
  // Czech
  cs: "cs", czech: "cs", "чешский": "cs", "чеська": "cs",
  // Slovak
  sk: "sk", slovak: "sk", "словацкий": "sk", "словацька": "sk",
  // Hungarian
  hu: "hu", hungarian: "hu", "венгерский": "hu", "угорська": "hu",
  // Swedish
  sv: "sv", swedish: "sv", "шведский": "sv", "шведська": "sv",
  // Norwegian
  no: "no", nb: "no", norwegian: "no", norway: "no", "норвежский": "no", "норвезька": "no",
  // Finnish
  fi: "fi", finnish: "fi", "финский": "fi", "фінська": "fi",
  // Greek
  el: "el", greek: "el", "греческий": "el", "грецька": "el",
  // Croatian
  hr: "hr", croatian: "hr", "хорватский": "hr", "хорватська": "hr",
  // Serbian
  sr: "sr", serbian: "sr", "сербский": "sr", "сербська": "sr",
  // Albanian
  sq: "sq", albanian: "sq", "албанский": "sq", "албанська": "sq",
  // Georgian
  ka: "ka", georgian: "ka", "грузинский": "ka", "грузинська": "ka",
  // Armenian
  hy: "hy", armenian: "hy", "армянский": "hy", "вірменська": "hy",
  // Azerbaijani
  az: "az", azerbaijani: "az", "азербайджанский": "az", "азербайджанська": "az",
  // Kazakh
  kk: "kk", kz: "kk", kazakh: "kk", "казахский": "kk", "казахська": "kk",
  // Kyrgyz
  ky: "ky", kg: "ky", kyrgyz: "ky", "кыргызский": "ky", "киргизский": "ky", "киргизька": "ky",
  // Uzbek
  uz: "uz", uzbek: "uz", "узбекский": "uz", "узбецька": "uz",
  // Tajik
  tg: "tg", tajik: "tg", "таджикский": "tg", "таджицька": "tg",
  // Turkmen
  tk: "tk", turkmen: "tk", "туркменский": "tk", "туркменська": "tk",
  // Arabic
  ar: "ar", arabic: "ar", "арабский": "ar", "арабська": "ar",
  // Persian / Farsi
  fa: "fa", farsi: "fa", persian: "fa", iran: "fa", ir: "fa",
  "персидский": "fa", "персидский (фарси)": "fa", "фарсі": "fa",
  "іран": "fa", "иран": "fa", "фарсі (іран.)": "fa",
  // Hebrew
  he: "he", hebrew: "he", "иврит": "he", "івріт": "he",
  // Urdu
  ur: "ur", urdu: "ur", "урду": "ur",
  // Pashto
  ps: "ps", pashto: "ps", "пушту": "ps",
  // Sindhi
  sd: "sd", sindhi: "sd", "сіндхі": "sd",
  // Kurdish
  ckb: "ckb", "kurdish (sorani)": "ckb", "курдский (сорани)": "ckb", "курдська (сорані)": "ckb",
  kmr: "kmr", "kurdish (kurmanji)": "kmr", "курдский (курманжи)": "kmr", "курдська (курманжі)": "kmr",
  // Zazaki
  zza: "zza", zazaki: "zza", "зазаки": "zza", "зазакі": "zza",
  // Burmese
  my: "my", burmese: "my", myanmar: "my", "бирманский": "my", "бірманська": "my",
  "бирманский (м'янма)": "my", "бірманська (м'янма)": "my",
  // Sinhala
  si: "si", sinhala: "si", sn: "si", "сингальский": "si", "сингальська": "si",
  // Tamil
  ta: "ta", tamil: "ta", "тамильский": "ta", "тамільська": "ta",
  // Khmer
  km: "km", khmer: "km", "кхмерский": "km", "кхмерська": "km",
  // Lao
  lo: "lo", laotian: "lo", lao: "lo", "лаосский": "lo", "лаоська": "lo",
  // Nepali
  ne: "ne", np: "ne", nepali: "ne", "непальский": "ne", "непальська": "ne",
  // Swahili
  sw: "sw", swa: "sw", swahili: "sw", kiswahili: "sw", "суахили": "sw", "суахілі": "sw",
  // Lingala
  ln: "ln", lingala: "ln", "лингала": "ln", "лінгала": "ln",
  // Amharic
  am: "am", amharic: "am", "амхарский": "am", "амхарська": "am",
  // Somali
  so: "so", somali: "so", "сомалийский": "so", "сомалійська": "so",
  // Irish (Gaelic) — Ірландія/Ireland у вашому XLSX
  ga: "ga", irish: "ga", ireland: "ga", ie: "ga",
  "ірландська": "ga", "ирландский": "ga", "ірландія": "ga", "ирландия": "ga",
  // Belarusian
  be: "be", belarusian: "be", "белорусский": "be", "білоруська": "be",
  // Slovenian
  sl: "sl", slovenian: "sl", "словенский": "sl", "словенська": "sl",
  // Macedonian
  mk: "mk", macedonian: "mk", "македонский": "mk", "македонська": "mk",
  // Bosnian
  bs: "bs", bosnian: "bs", "боснийский": "bs", "боснійська": "bs",
  // Dutch
  nl: "nl", dutch: "nl", "нидерландский": "nl", "голандський": "nl", "голандська": "nl", "нідерландська": "nl",
  // Catalan
  ca: "ca", catalan: "ca", "каталанский": "ca", "каталанська": "ca",
  // Slovenia/Slovakia spell variants
  // Common typos / 3-letter codes from US Open sheet
  swa: "sw", sn: "si", singal: "si", ka_lang: "ka",
};

// ---------- Key alias dictionary --------------------------------------
const KEY_ALIASES = {
  // Title
  title: "title", "название": "title", "заголовок": "title", "назва": "title", "headline": "title",
  // Subtitle
  subtitle: "subtitle", "подзаголовок": "subtitle", "subtitle ": "subtitle",
  "підзаголовок": "subtitle", "sub": "subtitle", "tagline": "subtitle",
  // CTA
  cta: "cta", "кнопка": "cta", "button": "cta", "call to action": "cta", "call-to-action": "cta",
  "call_to_action": "cta", "действие": "cta", "дія": "cta",
  // Bonus
  bonus: "bonus", "бонус": "bonus",
  // Period / Date
  period: "period", "дата": "period", "период": "period", "період": "period",
  "date": "period", "dates": "period", "term": "period",
  // Legal / disclaimer / terms
  legal: "legal", "дисклеймер": "legal", "disclaimer": "legal",
  terms: "terms", "условия": "terms", "умови": "terms",
  // Footer
  footer: "footer", "подвал": "footer", "низ": "footer",
  // Promo code
  promo: "promo", "промокод": "promo", "promo_code": "promo", "promocode": "promo",
};

const RESERVED = new Set(["key", "font_family"]);

// ---------- Helpers ---------------------------------------------------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Visual step indicator state. activeStep is 1, 2, or 3.
function setStep(activeStep) {
  document.querySelectorAll(".step").forEach((el) => {
    const num = parseInt(el.dataset.step, 10);
    el.classList.remove("is-active", "is-done");
    if (num < activeStep) el.classList.add("is-done");
    else if (num === activeStep) el.classList.add("is-active");
  });
}

function normalizeName(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    // Normalize various apostrophe-like glyphs to a single ASCII '
    // so "в'єтнамська" / "в'єтнамська" / "в`єтнамська" all match.
    .replace(/[ʼʹ‘’ʻ′´`]/g, "'")
    // Collapse whitespace (including non-breaking space) into single space
    .replace(/[\s ]+/g, " ");
}

// ISO 3166-1 alpha-2 country code lookup by name. Lowercase normalized.
const COUNTRY_CODES = {
  argentina: "AR", chile: "CL", peru: "PE", mexico: "MX", ecuador: "EC",
  bolivia: "BO", colombia: "CO", venezuela: "VE", uruguay: "UY", paraguay: "PY",
  brazil: "BR", "brasil": "BR", portugal: "PT", spain: "ES",
  france: "FR", germany: "DE", italy: "IT", poland: "PL", netherlands: "NL",
  ukraine: "UA", russia: "RU", belarus: "BY",
  turkey: "TR", azerbaijan: "AZ", "azerbaycan": "AZ",
  kazakhstan: "KZ", kyrgyzstan: "KG", uzbekistan: "UZ", tajikistan: "TJ",
  india: "IN", pakistan: "PK", bangladesh: "BD", "myanmar": "MM",
  thailand: "TH", vietnam: "VN", indonesia: "ID", malaysia: "MY",
  philippines: "PH", cambodia: "KH", laos: "LA",
  japan: "JP", korea: "KR", china: "CN", "taiwan": "TW", "hong kong": "HK",
  iran: "IR", iraq: "IQ", "saudi arabia": "SA", "uae": "AE", egypt: "EG",
  jordan: "JO", lebanon: "LB", syria: "SY", qatar: "QA", kuwait: "KW",
  bahrain: "BH", oman: "OM", yemen: "YE", morocco: "MA", tunisia: "TN",
  algeria: "DZ", libya: "LY", sudan: "SD",
  ethiopia: "ET", kenya: "KE", tanzania: "TZ", uganda: "UG", "south africa": "ZA",
  nigeria: "NG", ghana: "GH", senegal: "SN", "ivory coast": "CI", "côte d'ivoire": "CI",
  mali: "ML", "burkina faso": "BF", niger: "NE", togo: "TG", benin: "BJ",
  cameroon: "CM", "congo brazzaville": "CG", "congo kinshasa": "CD", drc: "CD",
  gabon: "GA", car: "CF", chad: "TD", "equatorial guinea": "GQ",
  madagascar: "MG", mauritius: "MU", "guinea bissau": "GW", guinea: "GN",
  somalia: "SO", "south sudan": "SS", eritrea: "ER", djibouti: "DJ",
  mozambique: "MZ", angola: "AO", zambia: "ZM", zimbabwe: "ZW", "namibia": "NA",
  uk: "GB", "great britain": "GB", britain: "GB", "united kingdom": "GB",
  usa: "US", "united states": "US", canada: "CA", australia: "AU",
  ireland: "IE", scotland: "GB", wales: "GB",
  greece: "GR", cyprus: "CY", malta: "MT",
  norway: "NO", sweden: "SE", denmark: "DK", finland: "FI", iceland: "IS",
  estonia: "EE", latvia: "LV", lithuania: "LT",
  czech: "CZ", "czech republic": "CZ", slovakia: "SK", hungary: "HU",
  romania: "RO", bulgaria: "BG", serbia: "RS", croatia: "HR",
  bosnia: "BA", slovenia: "SI", macedonia: "MK", albania: "AL", kosovo: "XK",
  georgia: "GE", armenia: "AM",
  mongolia: "MN", nepal: "NP", "sri lanka": "LK",
  gambia: "GM",
};

// Expand common language abbreviations to full names.
const LANG_NAME_EXPAND = {
  eng: "English",
  english: "English",
  russian: "Russian",
  rus: "Russian",
  ukrainian: "Ukrainian",
  ukr: "Ukrainian",
  spanish: "Spanish",
  esp: "Spanish",
  french: "French",
  fra: "French",
  fr: "French",
  german: "German",
  deu: "German",
  italian: "Italian",
  ita: "Italian",
  portuguese: "Portuguese",
  por: "Portuguese",
  polish: "Polish",
  pol: "Polish",
  japanese: "Japanese",
  jpn: "Japanese",
  korean: "Korean",
  kor: "Korean",
  chinese: "Chinese",
  zho: "Chinese",
  arabic: "Arabic",
  ara: "Arabic",
  farsi: "Farsi",
  persian: "Farsi",
  fas: "Farsi",
  urdu: "Urdu",
  urd: "Urdu",
  hebrew: "Hebrew",
  heb: "Hebrew",
  turkish: "Turkish",
  tur: "Turkish",
  azerbaijani: "Azerbaijani",
  azeri: "Azerbaijani",
  aze: "Azerbaijani",
  kazakh: "Kazakh",
  kaz: "Kazakh",
  kyrgyz: "Kyrgyz",
  kir: "Kyrgyz",
  uzbek: "Uzbek",
  uzb: "Uzbek",
  tajik: "Tajik",
  tgk: "Tajik",
  georgian: "Georgian",
  kat: "Georgian",
  armenian: "Armenian",
  hye: "Armenian",
  hindi: "Hindi",
  hin: "Hindi",
  bengali: "Bengali",
  bengal: "Bengali",
  ben: "Bengali",
  tamil: "Tamil",
  tam: "Tamil",
  sinhala: "Sinhala",
  sin: "Sinhala",
  thai: "Thai",
  tha: "Thai",
  vietnamese: "Vietnamese",
  vie: "Vietnamese",
  indonesian: "Indonesian",
  ind: "Indonesian",
  malay: "Malay",
  msa: "Malay",
  tagalog: "Tagalog",
  filipino: "Tagalog",
  tgl: "Tagalog",
  burmese: "Burmese",
  myanmar: "Burmese",
  mya: "Burmese",
  khmer: "Khmer",
  khm: "Khmer",
  lao: "Lao",
  laotian: "Lao",
  nepali: "Nepali",
  nep: "Nepali",
  mongolian: "Mongolian",
  mon: "Mongolian",
  swahili: "Swahili",
  swa: "Swahili",
  lingala: "Lingala",
  lin: "Lingala",
  amharic: "Amharic",
  amh: "Amharic",
  somali: "Somali",
  som: "Somali",
  albanian: "Albanian",
  alb: "Albanian",
  zazaki: "Zazaki",
  zza: "Zazaki",
  kurdish: "Kurdish",
  kurmanji: "Kurmanji",
  kmr: "Kurmanji",
  sorani: "Sorani",
  ckb: "Sorani",
  greek: "Greek",
  ell: "Greek",
  finnish: "Finnish",
  fin: "Finnish",
  swedish: "Swedish",
  swe: "Swedish",
  norwegian: "Norwegian",
  nor: "Norwegian",
  danish: "Danish",
  dan: "Danish",
  dutch: "Dutch",
  nld: "Dutch",
  romanian: "Romanian",
  ron: "Romanian",
  hungarian: "Hungarian",
  hun: "Hungarian",
  bulgarian: "Bulgarian",
  bul: "Bulgarian",
  croatian: "Croatian",
  hrv: "Croatian",
  serbian: "Serbian",
  srp: "Serbian",
  czech: "Czech",
  ces: "Czech",
  slovak: "Slovak",
  slk: "Slovak",
  slovenian: "Slovenian",
  slv: "Slovenian",
  latvian: "Latvian",
  lav: "Latvian",
  lithuanian: "Lithuanian",
  lit: "Lithuanian",
  estonian: "Estonian",
  est: "Estonian",
  macedonian: "Macedonian",
  mkd: "Macedonian",
  bosnian: "Bosnian",
  bos: "Bosnian",
  belarusian: "Belarusian",
  bel: "Belarusian",
  catalan: "Catalan",
  cat: "Catalan",
};

function expandLangName(name) {
  const n = String(name || "").trim().toLowerCase();
  if (LANG_NAME_EXPAND[n]) return LANG_NAME_EXPAND[n];
  // Fallback — just capitalize first letter
  return n.charAt(0).toUpperCase() + n.slice(1);
}

function suggestCountryCode(name) {
  const n = String(name || "").trim().toLowerCase();
  if (!n) return null;
  if (COUNTRY_CODES[n]) return COUNTRY_CODES[n];
  // First multi-word match for multi-word country names
  for (const country of Object.keys(COUNTRY_CODES)) {
    if (n === country || n.startsWith(country + " ")) return COUNTRY_CODES[country];
  }
  return null;
}

function suggestLangCode(headerCell) {
  const norm = normalizeName(headerCell);
  if (!norm) return null;
  if (LANG_ALIASES[norm]) return LANG_ALIASES[norm];

  // Pattern "Country (language)" or "Country (language) + Landing" —
  // produce a HUMAN-READABLE code: "Argentina_Spanish".
  // Strips "+ Landing" / "+ Lending" / "+ Lending" suffixes first.
  const stripped_suffix = norm
    .replace(/\s*\+\s*lan?d[ie]ng\s*$/i, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
  const parenMatch = stripped_suffix.match(/^([^(]+)\(([^)]+)\)/);
  if (parenMatch) {
    const countryName = parenMatch[1].trim();
    const langName = parenMatch[2].trim().split(/[\s,]/)[0];
    if (LANG_ALIASES[langName]) {
      // Multi-country prefixes ("Senegal, Togo, Niger, Mali") — take FIRST
      const firstCountry = countryName.split(/[,;/]/)[0].trim();
      // Convert to readable code:
      // - Each word in country gets capitalized: "ivory coast" → "Ivory_Coast"
      // - Language gets expanded from abbreviations: "eng" → "English"
      const countrySlug = firstCountry
        .replace(/[^\p{L}\s]/gu, "")
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("_");
      const langSlug = expandLangName(langName);
      return `${countrySlug}_${langSlug}`;
    }
  }

  // Fallback: just parentheses content as language
  const parenOnly = norm.match(/\(([^)]+)\)/);
  if (parenOnly) {
    const inside = parenOnly[1].trim().split(/[\s,]/)[0];
    if (LANG_ALIASES[inside]) return LANG_ALIASES[inside];
  }

  // strip "(...)" suffix and try
  const stripped = norm.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (LANG_ALIASES[stripped]) return LANG_ALIASES[stripped];

  // Strip " + Landing" / " + Lending" suffixes (common in casino sheets)
  const noSuffix = stripped.replace(/\s*\+\s*lan?d[ie]ng\s*$/i, "").trim();
  if (noSuffix !== stripped && LANG_ALIASES[noSuffix]) return LANG_ALIASES[noSuffix];

  // try first word
  const first = norm.split(/[\s/,]/)[0];
  if (LANG_ALIASES[first]) return LANG_ALIASES[first];

  // Variant patterns: "Match 1", "Variant 2", "V1", "Var 3" → slug.
  // Treat as a generic campaign variant — pass through with normalized code.
  const variantPattern = /^(match|variant|var|v|вариант|варіант|матч)\s*\.?\s*(\d+)$/i;
  const m = norm.match(variantPattern);
  if (m) {
    const prefix = m[1].toLowerCase();
    const num = m[2];
    // Map common variant prefixes to short slugs
    const prefixSlug =
      { match: "match", матч: "match", v: "v", var: "v", variant: "v", вариант: "v", варіант: "v" }[prefix] ||
      prefix;
    return `${prefixSlug}_${num}`;
  }

  return null;
}

// Determines if the parsed grid is transposed (languages in col 0,
// keys in row 0). Counts what fraction of first-column values look
// like languages and what fraction of first-row values look like keys.
// Returns true only if BOTH signals are strong and the orthogonal
// signals are weak.
// Cells matching banner dimensions ("120x240", "300x250", "320х100") are
// metadata noise that should not count toward key/lang detection ratios.
const NOISE_RE = /^[`]?\d+\s*[xх]\s*\d+/i;
function isNoiseCell(v) {
  return NOISE_RE.test(String(v || "").trim());
}

function isTransposed(rows) {
  if (!rows || rows.length < 2) return false;

  const firstCol = rows
    .slice(1)
    .map((r) => r[0])
    .filter((v) => v && !isNoiseCell(v));
  const firstRow = (rows[0] || [])
    .slice(1)
    .filter((v) => v && !isNoiseCell(v));

  if (firstCol.length < 2 || firstRow.length < 2) return false;

  const colAsLangHits = firstCol.filter((v) => suggestLangCode(v)).length;
  const colAsKeyHits = firstCol.filter(
    (v) => suggestKey(v) && KEY_ALIASES[normalizeName(v)]
  ).length;

  const rowAsLangHits = firstRow.filter((v) => suggestLangCode(v)).length;
  const rowAsKeyHits = firstRow.filter(
    (v) =>
      KEY_ALIASES[normalizeName(v)] ||
      /^step\s*\d+$/i.test(String(v).trim()) ||
      /slide/i.test(String(v).trim())
  ).length;

  const colLangRatio = colAsLangHits / firstCol.length;
  const colKeyRatio = colAsKeyHits / firstCol.length;
  const rowLangRatio = rowAsLangHits / firstRow.length;
  const rowKeyRatio = rowAsKeyHits / firstRow.length;

  // Transposed = first column is mostly languages AND first row is mostly keys
  return (
    colLangRatio >= 0.5 &&
    rowKeyRatio >= 0.5 &&
    colLangRatio > rowLangRatio &&
    rowKeyRatio > colKeyRatio
  );
}

// Returns true if column 0 contains only short codes (1-2 chars) across
// the data rows — typical for gender markers (Н/Ж, M/F) that don't
// belong in the translation matrix.
function maybeStripFirstColumn(rows) {
  if (!rows || rows.length < 3) return false;
  let shortCount = 0;
  let totalCount = 0;
  // Skip header row, look at data rows
  for (let i = 1; i < Math.min(rows.length, 30); i++) {
    const v = String(rows[i][0] || "").trim();
    if (!v) continue;
    totalCount++;
    if (v.length <= 2) shortCount++;
  }
  if (totalCount < 3) return false;
  return shortCount / totalCount >= 0.8;
}

function transposeRows(rows) {
  if (!rows || !rows.length) return rows;
  const maxCols = Math.max(...rows.map((r) => r.length));
  const out = [];
  for (let c = 0; c < maxCols; c++) {
    out.push(rows.map((r) => (r[c] == null ? "" : r[c])));
  }
  return out;
}

function suggestKey(cell) {
  const norm = normalizeName(cell);
  if (!norm) return null;
  if (KEY_ALIASES[norm]) return KEY_ALIASES[norm];

  // Numbered step patterns: "step 1", "step1", "крок 2", "шаг 3"
  const stepMatch = norm.match(/^(?:step|крок|шаг|stage)\s*\.?\s*(\d+)$/i);
  if (stepMatch) return `step_${stepMatch[1]}`;

  // Numbered slide patterns: "слайд 2", "slide 3", "1st slide", "2nd slide"
  const slideMatch = norm.match(/^(?:slide|слайд)\s*\.?\s*(\d+)$/i);
  if (slideMatch) return `slide_${slideMatch[1]}`;
  const ordinalSlide = norm.match(/^(\d+)(?:st|nd|rd|th)?\s+slide$/i);
  if (ordinalSlide) return `slide_${ordinalSlide[1]}`;

  // strip trailing/leading punctuation
  const cleaned = norm.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
  if (KEY_ALIASES[cleaned]) return KEY_ALIASES[cleaned];

  // last resort: latinize-friendly slug
  return cleaned.replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "") || null;
}

const RTL_LANGS = new Set(["ar", "fa", "ur", "ckb", "he", "yi", "ps", "sd"]);

// ---------- State -----------------------------------------------------

const state = {
  rawRows: [], // array of rows (arrays), as parsed
  headers: [], // first row
  langMap: [], // [{ original, code, skip }]
  keyMap: [], // [{ rowIndex, original, key, skip }]
  outputCsv: "",
};

// ---------- Help modal ------------------------------------------------

function openHelp() {
  $("#help-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeHelp() {
  $("#help-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

const helpBtn = document.getElementById("help-btn");
const helpClose = document.getElementById("help-close");
const helpModal = document.getElementById("help-modal");

if (helpBtn) helpBtn.addEventListener("click", openHelp);
if (helpClose) helpClose.addEventListener("click", closeHelp);
if (helpModal) {
  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) closeHelp();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && helpModal && !helpModal.classList.contains("hidden")) {
    closeHelp();
  }
});

// Modal tabs
document.querySelectorAll(".modal-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal-tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".mtab-content").forEach((c) => c.classList.add("hidden"));
    btn.classList.add("active");
    const target = document.getElementById("mtab-" + btn.dataset.mtab);
    if (target) target.classList.remove("hidden");
  });
});

// ---------- Tabs ------------------------------------------------------

$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".tab-content").forEach((c) => c.classList.add("hidden"));
    btn.classList.add("active");
    $("#tab-" + btn.dataset.tab).classList.remove("hidden");
  });
});

// ---------- File input ------------------------------------------------

$("#csv-file").addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0];
  $("#sheet-picker-row").classList.add("hidden");
  $("#sheet-picker").innerHTML = "";
  if (!f) return;
  const sizeKb = (f.size / 1024).toFixed(1);
  $("#file-info").textContent = `Вибрано: ${f.name} (${sizeKb} КБ)`;

  // Pre-scan xlsx for sheet picker
  const ext = (f.name.split(".").pop() || "").toLowerCase();
  if (["xlsx", "xls", "xlsm"].includes(ext) && window.XLSX) {
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      if (wb.SheetNames.length > 1) {
        // Multiple sheets — show picker, default to the largest
        let bestIdx = 0;
        let bestSize = 0;
        wb.SheetNames.forEach((name, i) => {
          const ws = wb.Sheets[name];
          const range = ws["!ref"]
            ? XLSX.utils.decode_range(ws["!ref"])
            : { e: { r: 0, c: 0 } };
          const size = (range.e.r + 1) * (range.e.c + 1);
          if (size > bestSize) {
            bestSize = size;
            bestIdx = i;
          }
        });
        const sel = $("#sheet-picker");
        sel.innerHTML = wb.SheetNames.map((name, i) => {
          const ws = wb.Sheets[name];
          const range = ws["!ref"]
            ? XLSX.utils.decode_range(ws["!ref"])
            : { e: { r: 0, c: 0 } };
          const rows = range.e.r + 1;
          const cols = range.e.c + 1;
          return `<option value="${i}"${i === bestIdx ? " selected" : ""}>${escapeHtml(name)} (${rows}×${cols})</option>`;
        }).join("");
        $("#sheet-picker-row").classList.remove("hidden");
      }
    } catch (err) {
      // ignore — full parse will happen on Розібрати
    }
  }
});

// ---------- Sample button --------------------------------------------

$("#sample-btn").addEventListener("click", () => {
  const sample = `Язык,Русский,Английский,Турецкий,Казахский,Арабский,Японский
Название ,Майская жара,May Heat,MAYIS SICAĞI,Мамыр ыстығы,حرارة مايو,メイヒート
Подзаголовок,Горячий май,Red-hot May,ATEŞLİ MAYIS,Ыстық мамыр,مايو الحار,激アツの5月
Кнопка,Играть,Play,OYNA,Ойна,العب,プレイ
Бонус,БОНУС,BONUS,BONUS,БОНУС,مكافأة,ボーナス
Период,Май 2026,May 2026,Mayıs 2026,Мамыр 2026,مايو 2026,2026年5月`;
  $("#csv-text").value = sample;
  $$(".tab").forEach((b) => b.classList.remove("active"));
  $$(".tab-content").forEach((c) => c.classList.add("hidden"));
  $('.tab[data-tab="paste"]').classList.add("active");
  $("#tab-paste").classList.remove("hidden");
});

// ---------- Universal input loaders ----------------------------------

// Returns 2D array of rows from any source.
async function loadInputAsRows() {
  const tab = $(".tab.active").dataset.tab;

  if (tab === "paste") {
    return parseCsvText($("#csv-text").value);
  }

  if (tab === "url") {
    const text = await fetchSheetUrl($("#sheet-url").value);
    return parseCsvText(text);
  }

  if (tab === "file") {
    const f = $("#csv-file").files[0];
    if (!f) throw new Error("Файл не вибрано");
    const ext = (f.name.split(".").pop() || "").toLowerCase();

    if (["csv", "tsv", "txt"].includes(ext)) {
      return parseCsvText(await f.text());
    }
    if (["xlsx", "xls", "xlsm"].includes(ext)) {
      return await parseXlsxFile(f);
    }
    if (ext === "docx") {
      return await parseDocxFile(f);
    }
    if (ext === "pdf") {
      return await parsePdfFile(f);
    }
    throw new Error(`Невідомий формат файлу: .${ext}`);
  }

  throw new Error("Не вибрано джерело");
}

function parseCsvText(text) {
  if (!text || !text.trim()) throw new Error("Дані порожні");
  // Detect tab vs comma — tab if first line has more tabs than commas
  const firstLine = text.split(/\r?\n/, 1)[0];
  const tabs = (firstLine.match(/\t/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const delim = tabs > commas ? "\t" : ",";

  const parsed = Papa.parse(text, { skipEmptyLines: true, delimiter: delim });
  if (parsed.errors && parsed.errors.length) {
    const e = parsed.errors[0];
    throw new Error(`Парс помилка: ${e.message} (рядок ${e.row})`);
  }
  return parsed.data;
}

async function fetchSheetUrl(url) {
  let trimmed = (url || "").trim();
  if (!trimmed) throw new Error("URL порожній");

  // Auto-convert /pubhtml URL (published HTML view) to /pub?output=csv
  if (/\/pubhtml/.test(trimmed) && !/output=csv/.test(trimmed)) {
    trimmed = trimmed.replace(/\/pubhtml(\?.*)?$/, (_, query) => {
      // preserve gid/single params from original query
      const params = new URLSearchParams(query ? query.substring(1) : "");
      params.set("output", "csv");
      return "/pub?" + params.toString();
    });
    $("#parse-info").textContent =
      "URL /pubhtml перетворено на CSV-експорт.";
  }

  // Auto-convert /edit URLs to /pub-style export. Note: for sheets that are
  // not published, this often still hits CORS — we surface a helpful error.
  if (/\/edit/.test(trimmed) && !/output=csv/.test(trimmed)) {
    const idMatch = trimmed.match(
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
    );
    const gidMatch = trimmed.match(/[#?&]gid=([0-9]+)/);
    if (idMatch) {
      const id = idMatch[1];
      const gid = gidMatch ? gidMatch[1] : "0";
      // Try /export endpoint first (works for shared-public sheets).
      trimmed = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
      $("#parse-info").textContent =
        "URL перетворено на CSV-експорт. Якщо запит впаде — публікуйте Sheet (File → Share → Publish to web → CSV).";
    }
  }

  const cacheBust =
    trimmed + (trimmed.includes("?") ? "&" : "?") + "t=" + Date.now();

  let res;
  try {
    res = await fetch(cacheBust, { redirect: "follow" });
  } catch (e) {
    throw new Error(
      "Не вдалося завантажити URL (можливо CORS — sheet треба опублікувати: File → Share → Publish to web → CSV)."
    );
  }
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        "Sheet приватний. Зробіть його доступним або опублікуйте через File → Share → Publish to web → CSV."
      );
    }
    throw new Error(`HTTP ${res.status} при завантаженні URL`);
  }
  return await res.text();
}

// ----- xlsx via SheetJS -----

async function parseXlsxFile(file) {
  if (!window.XLSX) throw new Error("Бібліотека XLSX не завантажена");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  if (!wb.SheetNames.length) throw new Error("XLSX без аркушів");

  // If user picked a sheet, use it; otherwise the largest one
  let sheetIdx = 0;
  const picker = $("#sheet-picker");
  if (picker && picker.value !== "" && !picker.parentElement.classList.contains("hidden")) {
    sheetIdx = parseInt(picker.value, 10) || 0;
  } else if (wb.SheetNames.length > 1) {
    let bestSize = 0;
    wb.SheetNames.forEach((name, i) => {
      const ws = wb.Sheets[name];
      const range = ws["!ref"]
        ? XLSX.utils.decode_range(ws["!ref"])
        : { e: { r: 0, c: 0 } };
      const size = (range.e.r + 1) * (range.e.c + 1);
      if (size > bestSize) {
        bestSize = size;
        sheetIdx = i;
      }
    });
  }

  const sheetName = wb.SheetNames[sheetIdx];
  const ws = wb.Sheets[sheetName];
  let rows = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
    blankrows: false,
  });
  if (!rows.length) throw new Error("Аркуш порожній");

  // Skip leading title-rows that have only 1 non-empty cell while data has many.
  // E.g. "Оновлені коди" alone in row 1, real headers in row 2.
  rows = stripLeadingTitleRows(rows);

  $("#parse-info").textContent = `XLSX: аркуш «${sheetName}», ${rows.length} рядків (з ${wb.SheetNames.length} аркушів у файлі)`;
  return rows.map((r) => r.map((c) => (c == null ? "" : String(c))));
}

function stripLeadingTitleRows(rows) {
  if (rows.length < 3) return rows;
  // Determine "typical" non-empty count from the bulk of the file
  const counts = rows
    .slice(0, Math.min(20, rows.length))
    .map((r) => r.filter((c) => String(c || "").trim()).length);
  const median = [...counts].sort((a, b) => a - b)[Math.floor(counts.length / 2)];

  // First, try to find a row in the top 10 that looks like a key-header row
  // (many cells map to KEY_ALIASES like title/subtitle/cta/step).
  // If found, drop everything above it.
  const scanLimit = Math.min(10, rows.length);
  let bestHeader = -1;
  let bestScore = 0;
  for (let i = 0; i < scanLimit; i++) {
    const cells = rows[i].slice(1).filter((c) => String(c || "").trim());
    if (cells.length < 2) continue;
    const keyHits = cells.filter(
      (v) => KEY_ALIASES[normalizeName(v)] || /^step\s*\d+$/i.test(String(v).trim())
    ).length;
    const ratio = keyHits / cells.length;
    if (ratio >= 0.5 && keyHits > bestScore) {
      bestScore = keyHits;
      bestHeader = i;
    }
  }
  if (bestHeader > 0) {
    return rows.slice(bestHeader);
  }

  // Fallback: drop leading rows with single non-empty cell
  let drop = 0;
  while (drop < rows.length - 2) {
    const nonEmpty = rows[drop].filter((c) => String(c || "").trim()).length;
    if (nonEmpty <= 1 && median >= 3) drop++;
    else break;
  }
  return drop > 0 ? rows.slice(drop) : rows;
}

// ----- docx via mammoth -----

async function parseDocxFile(file) {
  if (!window.mammoth) throw new Error("Бібліотека mammoth не завантажена");
  const buf = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer: buf });
  const div = document.createElement("div");
  div.innerHTML = result.value;
  const tables = div.querySelectorAll("table");
  if (!tables.length) {
    throw new Error("docx не містить таблиць — додайте таблицю з перекладами або експортуйте як xlsx");
  }
  // pick the largest table
  let bestTable = tables[0];
  let bestSize = 0;
  for (const t of tables) {
    const cells = t.querySelectorAll("td, th").length;
    if (cells > bestSize) {
      bestSize = cells;
      bestTable = t;
    }
  }
  const rows = Array.from(bestTable.rows).map((row) =>
    Array.from(row.cells).map((c) => c.textContent.trim())
  );
  if (!rows.length) throw new Error("Таблиця в docx порожня");
  $("#parse-info").textContent = `DOCX: знайдено ${tables.length} таблиць, обрано найбільшу (${rows.length} рядків)`;
  return rows;
}

// ----- pdf via pdf.js -----

async function parsePdfFile(file) {
  if (!window.pdfjsLib) throw new Error("Бібліотека pdf.js не завантажена");
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const allRows = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const tc = await page.getTextContent();
    const items = tc.items
      .filter((it) => it.str && it.str.trim())
      .map((it) => ({ x: it.transform[4], y: it.transform[5], text: it.str }));
    if (!items.length) continue;
    // Group by Y (rounded into bands of 4px)
    const bands = new Map();
    for (const it of items) {
      const y = Math.round(it.y / 4) * 4;
      if (!bands.has(y)) bands.set(y, []);
      bands.get(y).push(it);
    }
    const sortedY = [...bands.keys()].sort((a, b) => b - a); // top to bottom
    for (const y of sortedY) {
      const row = bands.get(y).sort((a, b) => a.x - b.x);
      // Merge adjacent items with small X gap → cells
      const cells = [];
      let cur = null;
      for (const it of row) {
        if (cur && it.x - (cur.x + cur.width) < 14) {
          cur.text += " " + it.text;
          cur.width = it.x + (it.text.length * 5) - cur.x;
        } else {
          if (cur) cells.push(cur.text.trim());
          cur = { x: it.x, width: it.text.length * 5, text: it.text };
        }
      }
      if (cur) cells.push(cur.text.trim());
      if (cells.length) allRows.push(cells);
    }
  }
  if (!allRows.length) throw new Error("PDF не містить тексту");
  $("#parse-info").textContent = `PDF: ${pdf.numPages} стор., вилучено ${allRows.length} рядків (точність розпізнавання таблиць у PDF обмежена)`;
  return allRows;
}

// ---------- Parse main button ----------------------------------------

$("#parse-btn").addEventListener("click", async () => {
  const errorEl = $("#parse-error");
  const infoEl = $("#parse-info");
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
  infoEl.textContent = "";

  $("#parse-btn").disabled = true;
  $("#parse-btn").textContent = "Розбираю...";

  try {
    const rows = await loadInputAsRows();
    if (!rows || rows.length < 2) {
      throw new Error("Потрібно щонайменше 2 рядки (заголовок + дані)");
    }
    // Drop fully-empty leading/trailing rows
    state.rawRows = rows.filter((r) =>
      r.some((c) => String(c || "").trim())
    );
    if (state.rawRows.length < 2) {
      throw new Error("Замало непорожніх рядків після очищення");
    }

    // Smart-strip metadata rows above the real key-header row.
    // E.g. row 1 = "appearance" hint, row 2 = actual keys (title/cta/step1...).
    const beforeStrip = state.rawRows.length;
    state.rawRows = stripLeadingTitleRows(state.rawRows);
    const droppedRows = beforeStrip - state.rawRows.length;

    // Smart-drop the first column if it contains only short codes (≤2 chars)
    // in all data rows — usually a gender/marker column not relevant to data.
    const droppedFirstCol = maybeStripFirstColumn(state.rawRows);
    if (droppedFirstCol) {
      state.rawRows = state.rawRows.map((r) => r.slice(1));
    }

    const notes = [];
    if (droppedRows > 0) notes.push(`${droppedRows} метаданих рядок(ів)`);
    if (droppedFirstCol) notes.push(`перший стовпчик-маркер (Н/Ж/...)`);
    if (notes.length > 0) {
      $("#parse-info").textContent = `ℹ Пропущено: ${notes.join(", ")}.`;
    }

    // Auto-detect transposed layout: if the FIRST COLUMN looks like
    // languages and the FIRST ROW (excl col 0) looks like KEYS,
    // the sheet is mirrored — flip it so the adapter sees the expected
    // shape (key in col 0, languages in row 0).
    const transposed = isTransposed(state.rawRows);
    if (transposed) {
      state.rawRows = transposeRows(state.rawRows);
      $("#parse-info").textContent =
        "🔄 Виявлено транспоновану структуру (мови зліва, ключі зверху) — автоматично виправлено.";
    }

    state.headers = state.rawRows[0];

    buildMapping();

    // Heuristic warning: if no key column auto-detected, tell user.
    const okKeys = state.keyMap.filter((m) => m.key && !m.skip).length;
    if (okKeys === 0 && state.keyMap.length > 0) {
      const sampleVal = String(state.keyMap[0].original || "(порожньо)").slice(0, 60);
      $("#parse-info").textContent =
        `⚠ Не знайдено колонку «key». У першій колонці шиту: «${sampleVal}». ` +
        `Додайте перший стовпчик зі значеннями title / subtitle / cta — або вручну впишіть ключі у таблиці нижче.`;
    }

    renderMapping();
    rebuildOutput();
    $("#mapping-card").classList.remove("hidden");
    $("#output-card").classList.remove("hidden");
    setStep(3);
    $("#mapping-card").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (e) {
    errorEl.textContent = e.message || String(e);
    errorEl.classList.remove("hidden");
  } finally {
    $("#parse-btn").disabled = false;
    $("#parse-btn").textContent = "Розібрати →";
  }
});

// ---------- Build mapping from parsed rows ---------------------------

function buildMapping() {
  // Language columns: skip column 0 (key column).
  // Auto-skip columns whose header is empty AND data column is empty across all rows
  // (those are leading/trailing padding columns).
  state.langMap = [];
  for (let i = 1; i < state.headers.length; i++) {
    const header = state.headers[i];
    const hasContent =
      String(header || "").trim() ||
      state.rawRows.some((row) => String(row[i] || "").trim());
    if (!hasContent) continue; // truly empty column — drop entirely
    const code = suggestLangCode(header);
    state.langMap.push({
      colIndex: i,
      original: header,
      code: code || "",
      skip: !code,
    });
  }

  // Key rows: rows 1..n
  state.keyMap = state.rawRows.slice(1).map((row, i) => {
    const original = row[0];
    const key = suggestKey(original);
    return {
      rowIndex: i + 1,
      original,
      key: key || "",
      skip: !key,
    };
  });
}

// ---------- Render mapping UI ----------------------------------------

function renderMapping() {
  const langTable = $("#lang-map");
  const keyTable = $("#key-map");

  const okLangs = state.langMap.filter((m) => m.code && !m.skip).length;
  const skipLangs = state.langMap.filter((m) => m.skip).length;
  const okKeys = state.keyMap.filter((m) => m.key && !m.skip).length;
  const skipKeys = state.keyMap.filter((m) => m.skip).length;

  $("#mapping-stats").innerHTML = `
    <span><strong>${okLangs}</strong> мов</span>
    <span><strong>${okKeys}</strong> ключів</span>
    ${skipLangs ? `<span><strong>${skipLangs}</strong> мов пропущено</span>` : ""}
    ${skipKeys ? `<span><strong>${skipKeys}</strong> ключів пропущено</span>` : ""}
  `;

  langTable.innerHTML = `
    <thead>
      <tr>
        <th>Оригінал</th>
        <th class="arrow">→</th>
        <th>ISO код</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${state.langMap
        .map((m, i) => {
          const status = m.skip
            ? '<span class="badge badge-skip">пропустити</span>'
            : m.code
              ? '<span class="badge badge-ok">ok</span>'
              : '<span class="badge badge-warn">не визначено</span>';
          const rtl = RTL_LANGS.has(m.code)
            ? '<span class="badge badge-rtl">RTL</span>'
            : "";
          return `
            <tr class="${m.skip ? "skipped" : ""}" data-i="${i}">
              <td class="original" title="${escapeAttr(m.original)}">${escapeHtml(m.original)}</td>
              <td class="arrow">→</td>
              <td><input type="text" class="lang-code" data-i="${i}" value="${escapeAttr(m.code)}" placeholder="напр. en"></td>
              <td>${status}${rtl}</td>
              <td><span class="skip-toggle" data-i="${i}">${m.skip ? "включити" : "пропустити"}</span></td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;

  keyTable.innerHTML = `
    <thead>
      <tr>
        <th>Оригінал (рядок)</th>
        <th class="arrow">→</th>
        <th>Ключ для PSD</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${state.keyMap
        .map((m, i) => {
          const status = m.skip
            ? '<span class="badge badge-skip">пропустити</span>'
            : m.key
              ? '<span class="badge badge-ok">ok</span>'
              : '<span class="badge badge-warn">не визначено</span>';
          return `
            <tr class="${m.skip ? "skipped" : ""}" data-i="${i}">
              <td class="original" title="${escapeAttr(m.original)}">${escapeHtml(m.original)}</td>
              <td class="arrow">→</td>
              <td><input type="text" class="key-name" data-i="${i}" value="${escapeAttr(m.key)}" placeholder="напр. title"></td>
              <td>${status}</td>
              <td><span class="skip-toggle key-skip-toggle" data-i="${i}">${m.skip ? "включити" : "пропустити"}</span></td>
            </tr>
          `;
        })
        .join("")}
    </tbody>
  `;

  // Wire up edits
  langTable.querySelectorAll(".lang-code").forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const i = parseInt(e.target.dataset.i, 10);
      state.langMap[i].code = e.target.value.trim().toLowerCase();
      state.langMap[i].skip = !state.langMap[i].code;
      rebuildOutput();
      updateStats();
    });
  });
  langTable.querySelectorAll(".skip-toggle").forEach((sp) => {
    sp.addEventListener("click", (e) => {
      const i = parseInt(e.target.dataset.i, 10);
      state.langMap[i].skip = !state.langMap[i].skip;
      renderMapping();
      rebuildOutput();
    });
  });

  keyTable.querySelectorAll(".key-name").forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const i = parseInt(e.target.dataset.i, 10);
      state.keyMap[i].key = e.target.value.trim();
      state.keyMap[i].skip = !state.keyMap[i].key;
      rebuildOutput();
      updateStats();
    });
  });
  keyTable.querySelectorAll(".key-skip-toggle").forEach((sp) => {
    sp.addEventListener("click", (e) => {
      const i = parseInt(e.target.dataset.i, 10);
      state.keyMap[i].skip = !state.keyMap[i].skip;
      renderMapping();
      rebuildOutput();
    });
  });
}

function updateStats() {
  const okLangs = state.langMap.filter((m) => m.code && !m.skip).length;
  const skipLangs = state.langMap.filter((m) => m.skip).length;
  const okKeys = state.keyMap.filter((m) => m.key && !m.skip).length;
  const skipKeys = state.keyMap.filter((m) => m.skip).length;
  $("#mapping-stats").innerHTML = `
    <span><strong>${okLangs}</strong> мов</span>
    <span><strong>${okKeys}</strong> ключів</span>
    ${skipLangs ? `<span><strong>${skipLangs}</strong> мов пропущено</span>` : ""}
    ${skipKeys ? `<span><strong>${skipKeys}</strong> ключів пропущено</span>` : ""}
  `;
}

// ---------- Rebuild output CSV ---------------------------------------

function rebuildOutput() {
  const activeLangs = state.langMap.filter((m) => m.code && !m.skip);
  const activeKeys = state.keyMap.filter((m) => m.key && !m.skip);

  const headerRow = ["key", ...activeLangs.map((m) => m.code)];
  const dataRows = activeKeys.map((km) => {
    const srcRow = state.rawRows[km.rowIndex] || [];
    return [km.key, ...activeLangs.map((lm) => (srcRow[lm.colIndex] || "").trim())];
  });

  const csv = Papa.unparse([headerRow, ...dataRows]);
  state.outputCsv = csv;

  $("#output-csv").textContent = csv;
  $("#output-meta").innerHTML = `
    <span><strong>${activeKeys.length}</strong> ключ(ів)</span>
    <span><strong>${activeLangs.length}</strong> мов(и)</span>
    <span><strong>${csv.length}</strong> байт</span>
  `;
}

// ---------- Download / copy ------------------------------------------

$("#download-btn").addEventListener("click", () => {
  const blob = new Blob(["﻿" + state.outputCsv], {
    type: "text/csv;charset=utf-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "locs.csv";
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#copy-btn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(state.outputCsv);
    const status = $("#copy-status");
    status.textContent = "✓ Скопійовано в буфер";
    setTimeout(() => (status.textContent = ""), 2000);
  } catch (e) {
    $("#copy-status").textContent = "Не вдалося скопіювати: " + (e.message || e);
  }
});

// ---------- Helpers ---------------------------------------------------

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
