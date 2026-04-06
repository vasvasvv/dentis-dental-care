export type SeoLang = "uk" | "en";
export type LocalizedValue = {
  uk: string;
  en: string;
};

export const SITE_URL = "https://dentis.kr.ua";

export const CLINIC_CONTACT = {
  brandName: "Dentis",
  legalName: "Стоматологія Dentis",
  phone: "+380504800825",
  displayPhone: "+38 050 480 0825",
  email: "dentis.verhovsky@gmail.com",
  streetAddress: "вул. Героїв-рятувальників, 9, корп. 2",
  addressLocality: "Кропивницький",
  postalCode: "25000",
  addressCountry: "UA",
  latitude: 48.501504352785375,
  longitude: 32.220454197265816,
} as const;

type SeoInput = {
  lang: SeoLang;
  path: string;
  title: LocalizedValue;
  description: LocalizedValue;
  type?: "website" | "article";
  ogImage?: string;
};

export function normalizePath(path: string) {
  if (!path) return "/";

  let normalized = path.startsWith("/") ? path : `/${path}`;
  normalized = normalized.replace(/\/{2,}/g, "/");

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

export function stripLangFromPath(path: string) {
  const normalized = normalizePath(path);

  if (normalized === "/en") return "/";
  if (normalized.startsWith("/en/")) return normalized.slice(3) || "/";

  return normalized;
}

export function getLangFromPath(path: string): SeoLang {
  const normalized = normalizePath(path);
  return normalized === "/en" || normalized.startsWith("/en/") ? "en" : "uk";
}

export function localizePath(path: string, lang: SeoLang) {
  const neutralPath = stripLangFromPath(path);

  if (lang === "en") {
    return neutralPath === "/" ? "/en" : `/en${neutralPath}`;
  }

  return neutralPath;
}

export function toAbsoluteUrl(path: string) {
  const normalized = normalizePath(path);
  return normalized === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

export function buildCanonical(path: string, lang: SeoLang) {
  return toAbsoluteUrl(localizePath(path, lang));
}

export function buildAlternateLinks(path: string) {
  const neutralPath = stripLangFromPath(path);

  return {
    uk: toAbsoluteUrl(localizePath(neutralPath, "uk")),
    en: toAbsoluteUrl(localizePath(neutralPath, "en")),
    xDefault: `${SITE_URL}/`,
  };
}

export function pickLocalizedValue(value: LocalizedValue, lang: SeoLang) {
  return value[lang];
}

export function createPageSeo(input: SeoInput) {
  const canonical = buildCanonical(input.path, input.lang);
  const alternates = buildAlternateLinks(input.path);
  const title = pickLocalizedValue(input.title, input.lang);
  const description = pickLocalizedValue(input.description, input.lang);

  return {
    title,
    description,
    canonical,
    alternates,
    ogType: input.type ?? "website",
    locale: input.lang === "uk" ? "uk_UA" : "en_US",
    image: input.ogImage ?? getOgImageForPage(input.path),
  };
}

export function getOgImageForPage(path: string) {
  const neutralPath = stripLangFromPath(path);

  const pageMap: Record<string, string> = {
    "/": "/og-image.jpg",
    "/implantaciya": "/og-image-implantaciya.jpg",
    "/protezuvannya": "/og-image-protezuvannya.jpg",
    "/likuvannya-kariesu": "/og-image-likuvannya-kariesu.jpg",
    "/profesijne-ochischennya": "/og-image-profesijne-ochischennya.jpg",
    "/estetychna-stomatolohiya": "/og-image-estetychna-stomatolohiya.jpg",
    "/diagnostika-zubiv": "/og-image-diagnostika-zubiv.jpg",
    "/blog": "/og-image-blog.jpg",
    "/contacts": "/og-image-contacts.jpg",
  };

  return toAbsoluteUrl(pageMap[neutralPath] ?? "/og-image.jpg");
}
