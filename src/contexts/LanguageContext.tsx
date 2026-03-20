import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "uk" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const translations: Record<Lang, Record<string, string>> = {
  uk: {
    // Nav
    "nav.about": "Про нас",
    "nav.services": "Послуги",
    "nav.doctors": "Лікарі",
    "nav.news": "Акції",
    "nav.blog": "Блог",
    "nav.contacts": "Контакти",
    "nav.call": "+38 050 480 0825",

    // Hero
    "hero.city": "стоматологія у · м.Кропивницький",
    "hero.h1": "Посмішка, що",
    "hero.h1em": "надихає",
    "hero.desc": "Сучасна стоматологія з індивідуальним підходом до кожного пацієнта. Комфорт, безпека та бездоганний результат — наш стандарт.",
    "hero.cta": "Записатися на консультацію",
    "hero.services": "Наші послуги",

    // About
    "about.label": "Про нас",
    "about.h2a": "Довіра пацієнтів —",
    "about.h2b": "наша найвища нагорода",
    "about.p1": "Стоматологічна клініка «Дентіс» — це місце, де сучасна медицина поєднується з турботою та теплом. Ми надаємо стоматологічну допомогу найвищого рівня.",
    "about.p2": "Наша клініка оснащена передовим цифровим обладнанням. Ми постійно навчаємося та впроваджуємо найновіші методики лікування, щоб ви отримували найкращий результат.",
    "about.cta": "Зателефонувати",
    "about.v1title": "Висока якість",
    "about.v1desc": "Використовуємо лише сертифіковані матеріали та сучасне обладнання від провідних виробників.",
    "about.v2title": "Індивідуальний підхід",
    "about.v2desc": "Кожен пацієнт отримує персоналізований план лікування та увагу досвідченого фахівця.",
    "about.v3title": "Зручний час",
    "about.v3desc": "Прийом без черг у зручний для вас час. Цінуємо ваш час так само, як і своє.",
    "about.v4title": "Повна безпека",
    "about.v4desc": "Суворе дотримання санітарних норм, стерилізація інструментів та безпечна анестезія.",

    // Services
    "services.label": "Послуги",
    "services.h2a": "Повний спектр",
    "services.h2b": "стоматологічних послуг",
    "services.s1title": "Терапевтична стоматологія",
    "services.s1desc": "Лікування карієсу, пульпіту, відновлення зубів сучасними фотополімерними матеріалами.",
    "services.s1tag": "Популярно",
    "services.s2title": "Естетична стоматологія",
    "services.s2desc": "Відбілювання зубів, вініри, естетичні реставрації. Створення ідеальної посмішки.",
    "services.s3title": "Ортопедична стоматологія",
    "services.s3desc": "Коронки, мости, протезування на імплантах. Відновлення функції та естетики.",
    "services.s4title": "Хірургічна стоматологія",
    "services.s4desc": "Видалення зубів, імплантація, синус-ліфтинг. Робота з максимальним комфортом.",
    "services.s5title": "Професійне очищення",
    "services.s5desc": "Професійна гігієна зубів спрямована на видалення зубного каменю.",
    "services.s6title": "Діагностика та рентген",
    "services.s6desc": "Цифрова рентгенографія та професійна діагностика.",
    "services.more": "Детальніше",

    // Doctors
    "doctors.label": "Команда",
    "doctors.h2": "Наші лікарі",
    "doctors.desc": "Ваше здоров'я в руках досвідчених спеціалістів, які постійно вдосконалюють свою майстерність",
    "doctors.exp": "років досвіду",

    // Reviews
    "reviews.label": "Відгуки",
    "reviews.h2": "Що кажуть пацієнти",

    // FAQ
    "faq.label": "FAQ",
    "faq.h2": "Поширені запитання",
    "faq.q1": "Скільки коштує лікування зубів у Dentis?",
    "faq.a1": "Вартість лікування залежить від складності випадку та обраного методу. Остаточну ціну лікар визначає після огляду.",
    "faq.q2": "Чи боляче лікувати зуби?",
    "faq.a2": "У клініці Dentis застосовується сучасна анестезія, що робить лікування комфортним та безболісним.",
    "faq.q3": "Як записатися на прийом у Dentis?",
    "faq.a3": "Запис можливий телефоном або під час особистого візиту до клініки.",
    "faq.q4": "Де знаходиться стоматологія Dentis?",
    "faq.a4": "Клініка Dentis знаходиться у місті Кропивницький. Контакти, адреса та графік роботи вказані у розділі контактів.",
    "faq.q5": "Які методи лікування зубів доступні?",
    "faq.a5": "У Dentis доступні сучасні методи лікування: терапія карієсу, пломбування, професійна гігієна, імплантація та ортопедія.",
    "faq.q6": "Чи є у клініці рентген та сучасне обладнання?",
    "faq.a6": "Так, Dentis оснащена сучасним цифровим рентгеном та іншим високотехнологічним обладнанням для точної діагностики та лікування.",

    // Contacts (component)
    "contacts.label": "Контакти",
    "contacts.h2": "Зв'яжіться з нами",
    "contacts.phone.label": "Телефон для запису",
    "contacts.phone.sub": "Дзвінки приймаємо щодня",
    "contacts.email.label": "Електронна пошта",
    "contacts.addr.label": "Адреса клініки",
    "contacts.addr.value": "вул. Героїв-рятувальників, 9, корп. 2",
    "contacts.addr.sub": "Кропивницький, Україна, 25000",
    "contacts.hours.label": "Графік роботи",
    "contacts.hours.value": "Пн–Пт: 9:00 – 19:00",
    "contacts.hours.sub": "Сб: 9:00 – 15:00",
    "contacts.cta": "Записатися за дзвінком",

    // Awards
    "awards.label": "Визнання",
    "awards.h2": "Нагороди та сертифікати",
    "awards.title": "Найкраща стоматологічна клініка",
    "awards.issuer": "Народний бренд",

    // Footer
    "footer.tagline": "Стоматологічна клініка у Кропивницькому. Ваша посмішка — наша гордість.",
    "footer.nav": "Навігація",
    "footer.contacts": "Контакти",
    "footer.news": "Новини та акції",
    "footer.reviews": "Відгуки",
    "footer.rights": "Всі права захищені.",

    // News/Blog badges
    "news.label": "Новини та акції",
    "news.h2": "Актуально зараз",
    "news.hot": "Гаряча пропозиція",
    "news.readmore": "Читати далі",
    "news.collapse": "Згорнути",
    "news.allblog": "Усі новини та статті",

    // Blog page
    "blog.hero.label": "Блог та новини",
    "blog.hero.h1": "Корисно про зуби",
    "blog.hero.desc": "Статті, поради та акції від команди Дентіс",
    "blog.promos.h2": "Поточні акції",
    "blog.news.h2": "Останні новини",
    "blog.hygiene.h2": "Памʼятка з гігієни",
    "blog.hygiene.desc": "Прості звички, що захистять вашу посмішку",
    "blog.hygiene.download": "Завантажити PDF",
    "blog.no_news": "Скоро тут з'являться новини та статті від наших лікарів.",
    "blog.loading": "Завантаження…",

    // NotFound
    "notfound.h1": "404",
    "notfound.p": "Сторінку не знайдено",
    "notfound.back": "Повернутися на головну",

    // Scroll to top
    "scrolltop.aria": "Прокрутити вгору",
  },

  en: {
    // Nav
    "nav.about": "About",
    "nav.services": "Services",
    "nav.doctors": "Doctors",
    "nav.news": "Deals",
    "nav.blog": "Blog",
    "nav.contacts": "Contacts",
    "nav.call": "+38 050 480 0825",

    // Hero
    "hero.city": "dental clinic · Kropyvnytskyi",
    "hero.h1": "A smile that",
    "hero.h1em": "inspires",
    "hero.desc": "Modern dentistry with a personalised approach for every patient. Comfort, safety and flawless results — our standard.",
    "hero.cta": "Book a consultation",
    "hero.services": "Our services",

    // About
    "about.label": "About us",
    "about.h2a": "Patient trust —",
    "about.h2b": "our highest reward",
    "about.p1": "Dentis Dental Clinic is a place where modern medicine meets care and warmth. We deliver dental care of the highest standard.",
    "about.p2": "Our clinic is equipped with state-of-the-art digital technology. We continuously learn and implement the latest treatment methods so you get the best results.",
    "about.cta": "Call us",
    "about.v1title": "High quality",
    "about.v1desc": "We use only certified materials and modern equipment from leading manufacturers.",
    "about.v2title": "Personal approach",
    "about.v2desc": "Every patient receives a personalised treatment plan and the attention of an experienced specialist.",
    "about.v3title": "Convenient timing",
    "about.v3desc": "No waiting — appointments at a time that suits you. We value your time as much as our own.",
    "about.v4title": "Full safety",
    "about.v4desc": "Strict adherence to sanitary standards, instrument sterilisation and safe anaesthesia.",

    // Services
    "services.label": "Services",
    "services.h2a": "Full range",
    "services.h2b": "of dental services",
    "services.s1title": "Therapeutic dentistry",
    "services.s1desc": "Treatment of caries and pulpitis, tooth restoration with modern photopolymer materials.",
    "services.s1tag": "Popular",
    "services.s2title": "Aesthetic dentistry",
    "services.s2desc": "Teeth whitening, veneers and aesthetic restorations. Creating the perfect smile.",
    "services.s3title": "Prosthetic dentistry",
    "services.s3desc": "Crowns, bridges and implant-supported prosthetics. Restoring function and aesthetics.",
    "services.s4title": "Surgical dentistry",
    "services.s4desc": "Extractions, implantation and sinus lift. Maximum patient comfort at every step.",
    "services.s5title": "Professional cleaning",
    "services.s5desc": "Professional dental hygiene focused on tartar and plaque removal.",
    "services.s6title": "Diagnostics & X-ray",
    "services.s6desc": "Digital radiography and professional diagnostics.",
    "services.more": "Learn more",

    // Doctors
    "doctors.label": "Team",
    "doctors.h2": "Our doctors",
    "doctors.desc": "Your health is in the hands of experienced specialists who continuously perfect their skills",
    "doctors.exp": "years of experience",

    // Reviews
    "reviews.label": "Reviews",
    "reviews.h2": "What patients say",

    // FAQ
    "faq.label": "FAQ",
    "faq.h2": "Frequently asked questions",
    "faq.q1": "How much does dental treatment cost at Dentis?",
    "faq.a1": "The cost depends on the complexity of the case and the chosen method. The final price is determined by the doctor after examination.",
    "faq.q2": "Is dental treatment painful?",
    "faq.a2": "Dentis uses modern anaesthesia that makes treatment comfortable and pain-free.",
    "faq.q3": "How do I book an appointment at Dentis?",
    "faq.a3": "Bookings are available by phone or in person at the clinic.",
    "faq.q4": "Where is Dentis located?",
    "faq.a4": "The Dentis clinic is located in Kropyvnytskyi. Address, contacts and working hours are in the Contacts section.",
    "faq.q5": "What dental treatment methods are available?",
    "faq.a5": "Dentis offers modern treatments: caries therapy, fillings, professional hygiene, implantation and prosthetics.",
    "faq.q6": "Does the clinic have X-ray and modern equipment?",
    "faq.a6": "Yes, Dentis is equipped with modern digital X-ray and other high-tech equipment for accurate diagnostics and treatment.",

    // Contacts (component)
    "contacts.label": "Contacts",
    "contacts.h2": "Get in touch",
    "contacts.phone.label": "Booking phone",
    "contacts.phone.sub": "Calls accepted every day",
    "contacts.email.label": "Email address",
    "contacts.addr.label": "Clinic address",
    "contacts.addr.value": "9/2 Heroiv-Ryatuvalnykiv St.",
    "contacts.addr.sub": "Kropyvnytskyi, Ukraine, 25000",
    "contacts.hours.label": "Working hours",
    "contacts.hours.value": "Mon–Fri: 9:00 – 19:00",
    "contacts.hours.sub": "Sat: 9:00 – 15:00",
    "contacts.cta": "Book by phone",

    // Awards
    "awards.label": "Recognition",
    "awards.h2": "Awards & certificates",
    "awards.title": "Best dental clinic",
    "awards.issuer": "People's Brand",

    // Footer
    "footer.tagline": "Dental clinic in Kropyvnytskyi. Your smile — our pride.",
    "footer.nav": "Navigation",
    "footer.contacts": "Contacts",
    "footer.news": "News & deals",
    "footer.reviews": "Reviews",
    "footer.rights": "All rights reserved.",

    // News/Blog badges
    "news.label": "News & deals",
    "news.h2": "What's on now",
    "news.hot": "Hot offer",
    "news.readmore": "Read more",
    "news.collapse": "Collapse",
    "news.allblog": "All news & articles",

    // Blog page
    "blog.hero.label": "Blog & news",
    "blog.hero.h1": "Helpful dental tips",
    "blog.hero.desc": "Articles, tips and deals from the Dentis team",
    "blog.promos.h2": "Current deals",
    "blog.news.h2": "Latest news",
    "blog.hygiene.h2": "Hygiene guide",
    "blog.hygiene.desc": "Simple habits that will protect your smile",
    "blog.hygiene.download": "Download PDF",
    "blog.no_news": "News and articles from our doctors will appear here soon.",
    "blog.loading": "Loading…",

    // NotFound
    "notfound.h1": "404",
    "notfound.p": "Page not found",
    "notfound.back": "Return to home page",

    // Scroll to top
    "scrolltop.aria": "Scroll to top",
  },
};

// ─── PROVIDER ────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("dentis-lang");
    if (saved === "uk" || saved === "en") return saved;
    // browser language hint
    const browser = navigator.language.toLowerCase();
    return browser.startsWith("en") ? "en" : "uk";
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "uk" ? "en" : "uk";
      localStorage.setItem("dentis-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
