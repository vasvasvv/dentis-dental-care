import { useEffect, useRef } from "react";
import { CheckCircle, Clock, Phone, Star } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RelatedServices from "@/components/RelatedServices";
import PageSeo from "@/components/SEO/PageSeo";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { useLang } from "@/contexts/LanguageContext";
import heroVideo from "@/assets/hero-video.mp4";
import { trackServiceCtaClick, trackServiceView } from "@/lib/gtmTracking";
import { toAbsoluteUrl } from "@/utils/seo";

const steps = {
  uk: [
    { num: "01", title: "Огляд", desc: "Стоматолог оцінює стан ясен, наліт, зубний камінь та індивідуальні показання до процедури." },
    { num: "02", title: "Ультразвукова чистка", desc: "Знімаємо твердий зубний камінь з емалі та пришийкових ділянок." },
    { num: "03", title: "Air Flow", desc: "Прибираємо пігментований наліт і поліруємо важкодоступні зони дрібнодисперсним порошком." },
    { num: "04", title: "Полірування", desc: "Гладка поверхня зуба менше утримує наліт і довше зберігає відчуття чистоти." },
    { num: "05", title: "Рекомендації", desc: "Пояснюємо домашній догляд, інтервали повторної гігієни та профілактику карієсу." },
  ],
  en: [
    { num: "01", title: "Examination", desc: "The dentist evaluates gums, plaque, tartar and your individual indications for hygiene." },
    { num: "02", title: "Ultrasonic scaling", desc: "Hard tartar is removed from enamel and cervical areas." },
    { num: "03", title: "Air Flow", desc: "Pigmented plaque is removed and difficult areas are polished with fine powder." },
    { num: "04", title: "Polishing", desc: "A smooth tooth surface helps reduce plaque retention and keeps the clean feeling longer." },
    { num: "05", title: "Recommendations", desc: "You receive home-care advice, repeat hygiene timing and prevention guidance." },
  ],
};

const benefits = {
  uk: [
    "Видалення зубного каменю та м'якого нальоту",
    "Профілактика карієсу та захворювань ясен",
    "Свіжіше дихання та чистіша емаль",
    "Підготовка до лікування, відбілювання чи протезування",
    "Рекомендований інтервал повторення кожні 6 місяців",
    "Комфортна процедура з видимим результатом одразу",
  ],
  en: [
    "Removal of tartar and soft plaque",
    "Prevention of caries and gum disease",
    "Fresher breath and cleaner enamel",
    "Preparation for treatment, whitening or prosthetics",
    "Recommended repeat interval every 6 months",
    "A comfortable procedure with immediate visible results",
  ],
};

const targetGroups = {
  uk: [
    { title: "Курці", desc: "Нікотиновий наліт майже неможливо прибрати домашніми засобами." },
    { title: "Любителі кави та чаю", desc: "Пігментація від напоїв поступово накопичується навіть при хорошій гігієні." },
    { title: "Пацієнти з брекетами", desc: "Професійна чистка допомагає контролювати наліт у складних зонах навколо системи." },
    { title: "Перед відбілюванням", desc: "Чиста поверхня емалі потрібна для прогнозованого естетичного результату." },
    { title: "Перед протезуванням", desc: "Здорова та очищена ротова порожнина покращує старт ортопедичного лікування." },
    { title: "Усім раз на 6 місяців", desc: "Базова профілактика для підтримки здоров'я зубів та ясен." },
  ],
  en: [
    { title: "Smokers", desc: "Nicotine staining is difficult to remove with home care alone." },
    { title: "Coffee and tea drinkers", desc: "Beverage pigmentation accumulates gradually even with decent brushing habits." },
    { title: "Patients with braces", desc: "Professional hygiene helps control plaque in hard-to-clean areas around the appliance." },
    { title: "Before whitening", desc: "Clean enamel is essential for a predictable aesthetic result." },
    { title: "Before prosthetics", desc: "A clean and healthy oral environment improves the start of restorative treatment." },
    { title: "Everyone every 6 months", desc: "A basic prevention step for maintaining healthy teeth and gums." },
  ],
};

export default function ProfesijneOchischennya() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, localizePath } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
    video.playbackRate = 0.6;
  }, []);

  useEffect(() => {
    trackServiceView(lang === "uk" ? "Професійне чищення зубів" : "Professional teeth cleaning", "profesijne-ochischennya");
  }, [lang]);

  const description =
    lang === "uk"
      ? "Гігієнічна чистка зубів ультразвуком. Видалення каменю та нальоту. Профілактика карієсу та захворювань ясен. Процедура займає 1 годину."
      : "Ultrasonic teeth cleaning. Removal of tartar and plaque. Prevention of cavities and gum disease. Procedure takes 1 hour.";

  const pageSteps = steps[lang];
  const pageBenefits = benefits[lang];
  const pageTargetGroups = targetGroups[lang];
  const serviceName = lang === "uk" ? "Професійне чищення зубів" : "Professional teeth cleaning";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/profesijne-ochischennya"
        ogImage="/og-images/profesiyne-ochyschennya.jpg"
        title={{
          uk: "Професійне очищення зубів у Кропивницькому — Дентіс",
          en: "Professional Teeth Cleaning in Kropyvnytskyi — Dentis",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema
        id="profesijne-ochischennya-schema"
        name={serviceName}
        description={description}
        image={toAbsoluteUrl("/og-images/profesiyne-ochyschennya.jpg")}
      />

      <Header />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="fixed inset-0 -z-10">
          <video ref={videoRef} src={heroVideo} autoPlay muted loop playsInline preload="none" poster="/hero-poster.webp" className="h-full w-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-70" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Послуги" : "Services"}</p>
          <h1 className="mb-6 max-w-2xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Професійне чищення зубів" : "Professional teeth cleaning"}</h1>
          <p className="mb-10 max-w-xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+380504800825"
              onClick={() => trackServiceCtaClick(serviceName, "profesijne-ochischennya", "phone", "hero")}
              className="flex items-center justify-center gap-3 rounded-full gradient-gold px-8 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
            >
              <Phone size={18} />
              {lang === "uk" ? "Записатися на гігієну" : "Book hygiene visit"}
            </a>
            <a
              href={localizePath("/contacts")}
              onClick={() => trackServiceCtaClick(serviceName, "profesijne-ochischennya", "contacts", "hero")}
              className="flex items-center justify-center gap-2 rounded-full border border-gold/60 px-8 py-4 font-body text-base font-medium text-gold transition-all duration-200 hover:bg-gold/10"
            >
              {lang === "uk" ? "Контакти" : "Contacts"}
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-cream-dark py-14">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {[
              { icon: Clock, value: "60-90 хв", label: lang === "uk" ? "тривалість процедури" : "procedure duration" },
              { icon: Star, value: "1-2 тони", label: lang === "uk" ? "візуальне освітлення емалі" : "visual enamel brightening" },
              { icon: CheckCircle, value: "6 міс", label: lang === "uk" ? "рекомендований інтервал" : "recommended interval" },
              { icon: Phone, value: "100%", label: lang === "uk" ? "контроль комфорту" : "comfort control" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon size={24} className="mx-auto mb-3 text-gold" />
                <div className="mb-1 font-display text-2xl font-bold text-navy">{value}</div>
                <div className="font-body text-xs tracking-wide text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Протокол" : "Protocol"}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Етапи гігієни" : "Cleaning stages"}</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-6">
            {pageSteps.map((step) => (
              <div key={step.num} className="flex items-start gap-6 rounded-2xl border border-border bg-card p-6 shadow-card-custom">
                <span className="shrink-0 font-display text-4xl font-bold leading-none text-gold/30">{step.num}</span>
                <div>
                  <h3 className="mb-2 font-display text-lg font-bold text-custom-dark">{step.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold/10 py-12">
        <div className="container mx-auto flex max-w-3xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-1 font-display text-2xl font-bold text-custom-dark">{lang === "uk" ? "Регулярна гігієна знижує ризик складного лікування" : "Regular hygiene lowers the risk of complex treatment"}</p>
            <p className="font-body text-sm text-muted-foreground">
              {lang === "uk" ? "Профілактика працює краще й дешевше, ніж лікування наслідків нальоту та каменю." : "Prevention is simpler and more affordable than treating the consequences of plaque and tartar."}
            </p>
          </div>
          <a
            href="tel:+380504800825"
            onClick={() => trackServiceCtaClick(serviceName, "profesijne-ochischennya", "phone", "promo")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full gradient-gold px-7 py-3.5 font-body text-sm font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
          >
            <Phone size={16} />
            {lang === "uk" ? "Записатися" : "Book now"}
          </a>
        </div>
      </section>

      <section className="bg-cream-dark py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Що ви отримуєте" : "What you get"}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pageBenefits.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Кому особливо рекомендована процедура" : "Who benefits most from this procedure"}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageTargetGroups.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5 text-left shadow-card-custom">
                <h3 className="mb-2 font-display text-base font-bold text-custom-dark">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Подбайте про здоров'я ясен і емалі" : "Take care of your gums and enamel"}</h2>
          <p className="mx-auto mb-8 max-w-md font-body text-primary-custom-dark/60">
            {lang === "uk" ? "Запишіться на професійну гігієну в зручний час і отримайте базу для здорової усмішки." : "Book professional hygiene at a convenient time and build the foundation for a healthy smile."}
          </p>
          <a
            href="tel:+380504800825"
            onClick={() => trackServiceCtaClick(serviceName, "profesijne-ochischennya", "phone", "footer_cta")}
            className="inline-flex items-center gap-3 rounded-full gradient-gold px-10 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
          >
            <Phone size={18} />
            {lang === "uk" ? "Зателефонувати" : "Call now"}
          </a>
        </div>
      </section>

      <RelatedServices currentService="profesijne-ochischennya" />

      <Footer />

      <a
        href="tel:+380504800825"
        onClick={() => trackServiceCtaClick(serviceName, "profesijne-ochischennya", "phone", "mobile_fab")}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label={lang === "uk" ? "Зателефонувати" : "Call Dentis"}
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
