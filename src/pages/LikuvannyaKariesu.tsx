import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Phone } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RelatedServices from "@/components/RelatedServices";
import PageSeo from "@/components/SEO/PageSeo";
import FaqSchema from "@/components/SEO/FaqSchema";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import SeoAccordion from "@/components/SEO/SeoAccordion";
import { useLang } from "@/contexts/LanguageContext";
import heroVideo from "@/assets/hero-video.mp4";
import { trackServiceCtaClick, trackServiceView } from "@/lib/gtmTracking";
import { toAbsoluteUrl } from "@/utils/seo";

const stages = {
  uk: [
    { title: "Початковий карієс", desc: "Світла або темна пляма на емалі без вираженого болю. На цьому етапі лікування найменш травматичне.", color: "text-green-500" },
    { title: "Поверхневий карієс", desc: "Ураження обмежується емаллю, може з'являтися чутливість до солодкого чи холодного.", color: "text-yellow-500" },
    { title: "Середній карієс", desc: "Інфекція доходить до дентину, тому потрібне ретельне очищення та відновлення форми зуба.", color: "text-orange-500" },
    { title: "Глибокий карієс", desc: "Запалення підходить близько до нерва, і затримка може призвести до ендодонтичного лікування.", color: "text-red-500" },
  ],
  en: [
    { title: "Early caries", desc: "A light or dark spot on enamel without significant pain. Treatment is least invasive at this stage.", color: "text-green-500" },
    { title: "Superficial caries", desc: "The lesion is limited to enamel, but sensitivity to sweets or cold may appear.", color: "text-yellow-500" },
    { title: "Medium caries", desc: "The infection reaches dentin and requires careful cleaning with restoration of tooth shape.", color: "text-orange-500" },
    { title: "Deep caries", desc: "Inflammation approaches the nerve, and delay may lead to endodontic treatment.", color: "text-red-500" },
  ],
};

const steps = {
  uk: [
    { num: "01", title: "Огляд та діагностика", desc: "Лікар оцінює глибину ураження, за потреби робить прицільний знімок і складає план лікування." },
    { num: "02", title: "Анестезія", desc: "Сучасна місцева анестезія забезпечує комфорт навіть при глибокому карієсі." },
    { num: "03", title: "Очищення уражених тканин", desc: "Каріозні тканини видаляються делікатно, щоб максимально зберегти здорову структуру зуба." },
    { num: "04", title: "Пломбування", desc: "Фотополімерний матеріал підбирається під колір зуба та відновлює жувальну поверхню." },
    { num: "05", title: "Фінішна обробка", desc: "Полірування робить реставрацію гладкою, функціональною й непомітною в усмішці." },
  ],
  en: [
    { num: "01", title: "Examination and diagnostics", desc: "The dentist assesses lesion depth, takes an X-ray if needed and plans treatment." },
    { num: "02", title: "Anaesthesia", desc: "Modern local anaesthesia keeps treatment comfortable even in deeper cases." },
    { num: "03", title: "Decay removal", desc: "Infected tissues are removed carefully to preserve as much healthy structure as possible." },
    { num: "04", title: "Filling", desc: "A photopolymer restoration is matched to tooth shade and rebuilds chewing anatomy." },
    { num: "05", title: "Finishing", desc: "Polishing makes the restoration smooth, functional and almost invisible." },
  ],
};

const faq = {
  uk: [
    { question: "Скільки коштує лікування карієсу у Кропивницькому?", answer: "Вартість залежить від глибини ураження, потреби у знімку та обсягу реставрації. Точну ціну лікар називає після огляду, коли видно повний план лікування." },
    { question: "Чи боляче лікувати карієс?", answer: "Ні. У Dentis використовується сучасна місцева анестезія, тому лікування карієсу та пломбування проходять комфортно навіть при чутливих зубах." },
    { question: "Коли потрібно звертатися терміново?", answer: "Якщо з'явився біль, реакція на холодне, темна порожнина або між зубами постійно застрягає їжа, краще не затягувати. Раннє лікування простіше та дешевше, ніж лікування ускладнень." },
  ],
  en: [
    { question: "How much does caries treatment cost in Kropyvnytskyi?", answer: "The cost depends on lesion depth, whether an X-ray is needed and the size of the restoration. The dentist gives an exact estimate after examination." },
    { question: "Is caries treatment painful?", answer: "No. Dentis uses modern local anaesthesia, so treatment and fillings remain comfortable even for sensitive patients." },
    { question: "When should I come urgently?", answer: "If you have pain, sensitivity to cold, a dark cavity or food keeps getting trapped between teeth, it is better not to delay. Early treatment is simpler and more affordable." },
  ],
};

const standards = {
  uk: [
    "Комфортне лікування з ефективною анестезією",
    "Фотополімерні матеріали для довговічних пломб",
    "Підбір кольору реставрації під природний зуб",
    "Контроль прикусу після відновлення",
    "Рекомендації по домашньому догляду після прийому",
    "Практичні поради щодо профілактики карієсу",
  ],
  en: [
    "Comfortable treatment with effective anaesthesia",
    "Photopolymer materials for durable fillings",
    "Natural-looking shade matching",
    "Bite control after restoration",
    "Clear home-care advice after the visit",
    "Practical prevention guidance for future care",
  ],
};

export default function LikuvannyaKariesu() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, localizePath } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
    video.playbackRate = 0.6;
  }, []);

  useEffect(() => {
    trackServiceView(lang === "uk" ? "Лікування карієсу" : "Caries treatment", "likuvannya-kariesu");
  }, [lang]);

  const pageStages = stages[lang];
  const pageSteps = steps[lang];
  const faqItems = faq[lang];
  const pageStandards = standards[lang];
  const description =
    lang === "uk"
      ? "Сучасне лікування карієсу без болю. Композитні матеріали світового рівня. Гарантія якості, дружелюбний сервіс. Запишіться онлайн за 1 хвилину."
      : "Painless cavity treatment with world-class composite materials. Quality guarantee, friendly service. Book online in 1 minute.";
  const serviceName = lang === "uk" ? "Лікування карієсу" : "Caries treatment";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/likuvannya-kariesu"
        ogImage="/og-images/likuvannya-kariesu.jpg"
        title={{
          uk: "Лікування карієсу в Кропивницькому — Дентіс",
          en: "Cavity Treatment in Kropyvnytskyi | Dentis Clinic",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema id="likuvannya-kariesu-schema" name={serviceName} description={description} image={toAbsoluteUrl("/og-images/likuvannya-kariesu.jpg")} />
      <FaqSchema id="likuvannya-kariesu-faq" faqs={faqItems} />

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
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Лікування карієсу" : "Caries treatment"}</h1>
          <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+380504800825"
              onClick={() => trackServiceCtaClick(serviceName, "likuvannya-kariesu", "phone", "hero")}
              className="flex items-center justify-center gap-3 rounded-full gradient-gold px-8 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
            >
              <Phone size={18} />
              {lang === "uk" ? "Записатися на прийом" : "Book treatment"}
            </a>
            <a
              href={localizePath("/contacts")}
              onClick={() => trackServiceCtaClick(serviceName, "likuvannya-kariesu", "contacts", "hero")}
              className="flex items-center justify-center gap-2 rounded-full border border-gold/60 px-8 py-4 font-body text-base font-medium text-gold transition-all duration-200 hover:bg-gold/10"
            >
              {lang === "uk" ? "Контакти" : "Contacts"}
            </a>
          </div>
        </div>
      </section>

      <div className="bg-background">
        <section className="border-y border-gold/20 bg-gold/5 py-12">
          <div className="container mx-auto flex max-w-3xl items-start gap-4 px-4">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-gold" />
            <p className="font-body leading-relaxed text-foreground/80">
              <strong className="text-custom-dark">{lang === "uk" ? "Не відкладайте лікування зуба." : "Do not delay treatment."}</strong>{" "}
              {lang === "uk"
                ? "Раннє втручання допомагає зберегти більше здорових тканин зуба, зменшити вартість лікування та уникнути ускладнень."
                : "Early treatment preserves more healthy tooth structure, lowers treatment cost and helps avoid complications."}
            </p>
          </div>
        </section>
      </div>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Стадії" : "Stages"}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Стадії карієсу" : "Stages of caries"}</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageStages.map((stage, index) => (
              <div key={stage.title} className="rounded-2xl border border-border bg-card p-6 shadow-card-custom">
                <div className={`mb-3 font-display text-5xl font-bold opacity-30 ${stage.color}`}>{index + 1}</div>
                <h3 className="mb-2 font-display text-base font-bold text-custom-dark">{stage.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Процес" : "Process"}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Як проходить лікування" : "How treatment works"}</h2>
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

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Наші стандарти" : "Our standards"}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pageStandards.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">SEO FAQ</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Поширені питання про лікування карієсу" : "Common questions about caries treatment"}</h2>
          </div>
          <SeoAccordion items={faqItems} />
        </div>
      </section>

      <section className="bg-cream-dark py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Болить зуб? Не зволікайте" : "Toothache? Do not wait"}</h2>
          <p className="mx-auto mb-8 max-w-md font-body text-primary-custom-dark/60">
            {lang === "uk" ? "Запишіться на консультацію в Dentis, щоб вилікувати карієс до появи ускладнень і зберегти власний зуб." : "Book a consultation at Dentis to treat caries before complications appear and preserve your natural tooth."}
          </p>
          <a
            href="tel:+380504800825"
            onClick={() => trackServiceCtaClick(serviceName, "likuvannya-kariesu", "phone", "footer_cta")}
            className="inline-flex items-center gap-3 rounded-full gradient-gold px-10 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
          >
            <Phone size={18} />
            {lang === "uk" ? "Зателефонувати" : "Call now"}
          </a>
        </div>
      </section>

      <RelatedServices currentService="likuvannya-kariesu" />

      <Footer />

      <a
        href="tel:+380504800825"
        onClick={() => trackServiceCtaClick(serviceName, "likuvannya-kariesu", "phone", "mobile_fab")}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label={lang === "uk" ? "Зателефонувати" : "Call Dentis"}
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
