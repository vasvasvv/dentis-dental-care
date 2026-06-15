export type SeoLang = "uk" | "en";
export type LocalizedValue = {
  uk: string;
  en: string;
};

export const SITE_URL = "https://dentis.kr.ua";

export const CLINIC_CONTACT = {
  brandName: "Дентіс",
  legalName: "Стоматологія Дентіс",
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

const OG_PAGE_METADATA: Record<
  string,
  {
    title: LocalizedValue;
    description: LocalizedValue;
  }
> = {
  "/": {
    title: {
      uk: "Дентіс — преміальна стоматологія у Кропивницькому",
      en: "Dentis — Premium Dental Clinic in Kropyvnytskyi",
    },
    description: {
      uk: "Сучасне лікування карієсу, імплантація, протезування. Висок клас обслуговування, європейські матеріали, пожиттєва гарантія. Запишіться на консультацію безкоштовно.",
      en: "Modern cavity treatment, implants, prosthetics. European materials, lifetime warranty. Book free consultation now.",
    },
  },
  "/likuvannya-kariesu": {
    title: {
      uk: "Лікування карієсу в Кропивницькому — ціни на лікування зубів",
      en: "Cavity Treatment in Kropyvnytskyi | Dentis Clinic",
    },
    description: {
      uk: "Лікування карієсу в стоматології Dentis у Кропивницькому: сучасна діагностика, комфортна анестезія, фотополімерні реставрації та прозорий план вартості.",
      en: "Painless cavity treatment with world-class composite materials. Quality guarantee, friendly service.",
    },
  },
  "/implantaciya": {
    title: {
      uk: "Імплантація зубів Кропивницький: ціни, відгуки | Стоматологія Дентіс",
      en: "Dental Implants in Kropyvnytskyi — Dentis",
    },
    description: {
      uk: "Імплантація зубів у Кропивницькому в Dentis: консультація, цифрове планування, встановлення імплантів і протезування з локальними відгуками та орієнтиром ціни.",
      en: "World-class dental implants. Painless process. Free consultation available.",
    },
  },
  "/diagnostika-zubiv": {
    title: {
      uk: "Діагностика зубів у Кропивницькому — Дентіс",
      en: "Dental Diagnostics in Kropyvnytskyi — Dentis",
    },
    description: {
      uk: "Комп'ютерна діагностика зубів. Цифрові знімки високої якості. Точна діагностика карієсу, запалення, патологій.",
      en: "Computer dental diagnostics. high-quality digital imaging. Precise diagnosis of cavities and inflammation.",
    },
  },
  "/estetychna-stomatolohiya": {
    title: {
      uk: "Естетична стоматологія у Кропивницькому — Дентіс",
      en: "Cosmetic Dentistry in Kropyvnytskyi — Dentis",
    },
    description: {
      uk: "Дизайн посмішки, відбілювання зубів, виправлення прикусу. Виробляємо красиву та здорову посмішку за допомогою сучасних методів.",
      en: "Smile design, teeth whitening, bite correction. Creating beautiful and healthy smiles using modern techniques.",
    },
  },
  "/profesijne-ochischennya": {
    title: {
      uk: "Професійне очищення зубів у Кропивницькому — Дентіс",
      en: "Professional Teeth Cleaning in Kropyvnytskyi — Dentis",
    },
    description: {
      uk: "Гігієнічна чистка зубів ультразвуком. Видалення каменю та нальоту. Профілактика карієсу та захворювань ясен. Процедура займає 1 годину.",
      en: "Ultrasonic teeth cleaning. Removal of tartar and plaque. Prevention of cavities and gum disease. Procedure takes 1 hour.",
    },
  },
  "/protezuvannya": {
    title: {
      uk: "Протезування зубів у Кропивницькому: якісно та безболісно | Дентіс",
      en: "Dentures & Prosthetics in Kropyvnytskyi — Dentis",
    },
    description: {
      uk: "Коронки, мости, знімні протези та протезування на імплантах у Кропивницькому. Індивідуальний план, природний вигляд, комфорт і зрозумілі ціни.",
      en: "Crowns, bridges, complete dentures. Custom-made from premium materials. Natural appearance, durability, comfort.",
    },
  },
  "/orthodontics": {
    title: {
      uk: "Ортодонтія у Кропивницькому — брекети та вирівнювання прикусу | Дентіс",
      en: "Orthodontics in Kropyvnytskyi — Braces and Bite Correction | Dentis",
    },
    description: {
      uk: "Вирівнювання прикусу, брекети та ортодонтична консультація у стоматології Dentis у Кропивницькому. PLACEHOLDER: додати точні ціни й системи.",
      en: "Bite correction, braces and orthodontic consultation at Dentis in Kropyvnytskyi. PLACEHOLDER: add exact prices and systems.",
    },
  },
  "/child-dentistry": {
    title: {
      uk: "Дитяча стоматологія у Кропивницькому | Дентіс",
      en: "Children's Dentistry in Kropyvnytskyi | Dentis",
    },
    description: {
      uk: "Дитячий стоматолог у Кропивницькому: профілактика, лікування карієсу молочних зубів, адаптаційний прийом і комфортний підхід у Dentis.",
      en: "Pediatric dentistry in Kropyvnytskyi: prevention, baby tooth caries treatment, adaptation visit and gentle care at Dentis.",
    },
  },
  "/prices": {
    title: {
      uk: "Ціни на стоматологію у Кропивницькому | Прайс Дентіс",
      en: "Dental Prices in Kropyvnytskyi | Dentis Price List",
    },
    description: {
      uk: "Прайс стоматології Dentis у Кропивницькому. PLACEHOLDER: додати актуальні ціни на консультацію, лікування, імплантацію, протезування та гігієну.",
      en: "Dentis dental price list in Kropyvnytskyi. PLACEHOLDER: add current prices for consultation, treatment, implants, prosthetics and hygiene.",
    },
  },
  "/doctors": {
    title: {
      uk: "Лікарі стоматології Дентіс у Кропивницькому",
      en: "Dentis Doctors in Kropyvnytskyi",
    },
    description: {
      uk: "Профілі лікарів Dentis: досвід, сертифікати, напрямки роботи та відгуки пацієнтів. PLACEHOLDER: підтвердити дані перед публікацією.",
      en: "Dentis doctor profiles: experience, certificates, treatment areas and patient reviews. PLACEHOLDER: confirm details before publishing.",
    },
  },
  "/contacts": {
    title: {
      uk: "Контакти Дентіс — стоматологія у Кропивницькому",
      en: "Contact Dentis — Dental Clinic in Kropyvnytskyi",
    },
    description: {
      uk: "Адреса: вул. Героїв-рятувальників, 9, корп. 2, Кропивницький. Телефон: +38 050 480 0825. Режим роботи: пн-пт 9:00-20:00, сб 10:00-17:00",
      en: "Address: Heroiv-Ryatuvalnykiv St, 9, Building 2, Kropyvnytskyi. Phone: +38 050 480 0825. Hours: Mon-Fri 9:00-20:00, Sat 10:00-17:00",
    },
  },
  "/blog": {
    title: {
      uk: "Блог Дентіс — поради та новини стоматології",
      en: "Dentis Blog — Dental Tips and News",
    },
    description: {
      uk: "Читай корисні статті про здоров'я зубів, методи лікування, вибір матеріалів, догляд за зубами.",
      en: "Read useful articles about dental health, treatment methods, material selection, teeth care.",
    },
  },
};

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
  const neutralPath = stripLangFromPath(input.path);
  const ogMetadata = OG_PAGE_METADATA[neutralPath];
  const title = pickLocalizedValue(ogMetadata?.title ?? input.title, input.lang);
  const description = pickLocalizedValue(
    ogMetadata?.description ?? input.description,
    input.lang,
  );

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
    "/likuvannya-kariesu": "/og-images/likuvannya-kariesu.jpg",
    "/implantaciya": "/og-images/implantaciya.jpg",
    "/diagnostika-zubiv": "/og-images/diagnostika-zubiv.jpg",
    "/estetychna-stomatolohiya": "/og-images/estetychna-stomatologiya.jpg",
    "/profesijne-ochischennya": "/og-images/profesiyne-ochyschennya.jpg",
    "/protezuvannya": "/og-images/protezuvannya.jpg",
    "/orthodontics": "/og-image.jpg",
    "/child-dentistry": "/og-image.jpg",
    "/prices": "/og-image.jpg",
    "/doctors": "/og-image.jpg",
    "/blog": "/og-image-blog.jpg",
    "/contacts": "/og-image-contacts.jpg",
  };

  return toAbsoluteUrl(pageMap[neutralPath] ?? "/og-image.jpg");
}
