import { useEffect, useRef } from "react";
import { CheckCircle, Phone } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RelatedServices from "@/components/RelatedServices";
import PageSeo from "@/components/SEO/PageSeo";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { useLang } from "@/contexts/LanguageContext";
import heroVideo from "@/assets/hero-video.mp4";
import { trackServiceCtaClick, trackServiceView } from "@/lib/gtmTracking";
import { toAbsoluteUrl } from "@/utils/seo";

const types = {
  uk: [
    { title: "Металокерамічні коронки", desc: "Надійне рішення для відновлення жувальних зубів із хорошим балансом міцності, естетики та вартості.", tag: "Популярно" },
    { title: "Безметалева кераміка", desc: "Максимально природний вигляд для фронтальної групи зубів із точним відтінком та прозорістю.", tag: "Преміум" },
    { title: "Цирконієві коронки", desc: "Висока міцність, біосумісність і стабільна естетика для довготривалого відновлення.", tag: "Рекомендуємо" },
    { title: "Мостоподібні протези", desc: "Відновлення одного або кількох відсутніх зубів із фіксацією на сусідні опори або імпланти." },
    { title: "Знімні протези", desc: "Сучасні конструкції для часткової або повної адентії з комфортною адаптацією." },
    { title: "Протезування на імплантах", desc: "Стабільне функціональне рішення без перевантаження сусідніх зубів.", tag: "Оптимально" },
  ],
  en: [
    { title: "Metal-ceramic crowns", desc: "A dependable option for restoring chewing teeth with a strong balance of durability, aesthetics and cost.", tag: "Popular" },
    { title: "All-ceramic crowns", desc: "A natural-looking choice for front teeth with precise shade matching and translucency.", tag: "Premium" },
    { title: "Zirconia crowns", desc: "High strength, biocompatibility and stable aesthetics for long-term restoration.", tag: "Recommended" },
    { title: "Bridges", desc: "Restoration of one or several missing teeth supported by adjacent teeth or implants." },
    { title: "Removable dentures", desc: "Modern full or partial dentures designed for comfortable daily adaptation." },
    { title: "Implant-supported prosthetics", desc: "A stable functional solution that avoids overloading neighbouring teeth.", tag: "Optimal" },
  ],
};

const steps = {
  uk: [
    { num: "01", title: "Огляд і планування", desc: "Лікар оцінює стан зубів, прикус і підбирає оптимальний тип ортопедичної конструкції." },
    { num: "02", title: "Підготовка зубів", desc: "Проводиться препарування опорних зубів, зняття відбитків або цифрове сканування." },
    { num: "03", title: "Виготовлення", desc: "Технік створює конструкцію в лабораторії, а за потреби встановлюється тимчасова коронка." },
    { num: "04", title: "Фіксація", desc: "Після примірки та корекції протез фіксується, перевіряється комфорт і контакт у прикусі." },
  ],
  en: [
    { num: "01", title: "Assessment and planning", desc: "The dentist evaluates tooth condition, bite and chooses the appropriate prosthetic option." },
    { num: "02", title: "Tooth preparation", desc: "Supporting teeth are prepared and impressions or a digital scan are taken." },
    { num: "03", title: "Fabrication", desc: "The restoration is made in the lab, and a temporary crown can be placed if needed." },
    { num: "04", title: "Placement", desc: "After try-in and adjustments, the restoration is fixed and bite comfort is checked." },
  ],
};

const advantages = {
  uk: [
    "Матеріали від перевірених виробників",
    "Точний підбір кольору та форми під усмішку пацієнта",
    "Цифрове сканування замість дискомфортних відбитків у багатьох випадках",
    "Контроль прикусу та функціональності після фіксації",
    "Планування як для одиночних коронок, так і для повної реабілітації",
    "Зрозуміле пояснення варіантів до початку лікування",
  ],
  en: [
    "Materials from trusted manufacturers",
    "Precise shade and shape matching for each smile",
    "Digital scanning instead of uncomfortable impressions in many cases",
    "Bite and function control after placement",
    "Planning for both single crowns and full-mouth rehabilitation",
    "Clear explanation of options before treatment begins",
  ],
};

export default function Protezuvannya() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, localizePath } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
    video.playbackRate = 0.6;
  }, []);

  useEffect(() => {
    trackServiceView(lang === "uk" ? "Протезування зубів" : "Dental prosthetics", "protezuvannya");
  }, [lang]);

  const description =
    lang === "uk"
      ? "Протезування зубів у Кропивницькому в Dentis: коронки, мости, знімні та незнімні конструкції для відновлення функції й естетики."
      : "Dental prosthetics in Kropyvnytskyi at Dentis: crowns, bridges and removable or fixed restorations for function and aesthetics.";

  const pageTypes = types[lang];
  const pageSteps = steps[lang];
  const pageAdvantages = advantages[lang];
  const serviceName = lang === "uk" ? "Протезування зубів" : "Dental prosthetics";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/protezuvannya"
        title={{
          uk: "Протезування зубів у Кропивницькому | Коронки, мости — Dentis",
          en: "Dental prosthetics in Kropyvnytskyi | Crowns, bridges — Dentis",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema
        id="protezuvannya-schema"
        name={serviceName}
        description={description}
        image={toAbsoluteUrl("/og-image-protezuvannya.jpg")}
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
          <h1 className="mb-6 max-w-2xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Протезування зубів" : "Dental prosthetics"}</h1>
          <p className="mb-10 max-w-xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+380504800825"
              onClick={() => trackServiceCtaClick(serviceName, "protezuvannya", "phone", "hero")}
              className="flex items-center justify-center gap-3 rounded-full gradient-gold px-8 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
            >
              <Phone size={18} />
              {lang === "uk" ? "Записатися на консультацію" : "Book consultation"}
            </a>
            <a
              href={localizePath("/contacts")}
              onClick={() => trackServiceCtaClick(serviceName, "protezuvannya", "contacts", "hero")}
              className="flex items-center justify-center gap-2 rounded-full border border-gold/60 px-8 py-4 font-body text-base font-medium text-gold transition-all duration-200 hover:bg-gold/10"
            >
              {lang === "uk" ? "Контакти" : "Contacts"}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Варіанти" : "Options"}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Види протезування" : "Types of prosthetics"}</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageTypes.map((item) => (
              <div key={item.title} className="relative rounded-2xl border border-border bg-card p-7 shadow-card-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {item.tag && <span className="absolute right-4 top-4 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-body font-semibold uppercase text-gold">{item.tag}</span>}
                <h3 className="mb-3 pr-16 font-display text-lg font-bold text-custom-dark">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Процес" : "Process"}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Як проходить протезування" : "How prosthetics works"}</h2>
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
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Наші переваги" : "Why patients choose Dentis"}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pageAdvantages.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Потрібно відновити зуб або усмішку?" : "Need to restore a tooth or your smile?"}</h2>
          <p className="mx-auto mb-8 max-w-md font-body text-primary-custom-dark/60">
            {lang === "uk" ? "Запишіться на консультацію, щоб отримати зрозумілий план протезування з підбором оптимальної конструкції." : "Book a consultation to receive a clear prosthetic treatment plan tailored to your case."}
          </p>
          <a
            href="tel:+380504800825"
            onClick={() => trackServiceCtaClick(serviceName, "protezuvannya", "phone", "footer_cta")}
            className="inline-flex items-center gap-3 rounded-full gradient-gold px-10 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
          >
            <Phone size={18} />
            {lang === "uk" ? "Зателефонувати" : "Call now"}
          </a>
        </div>
      </section>

      <RelatedServices currentService="protezuvannya" />

      <Footer />

      <a
        href="tel:+380504800825"
        onClick={() => trackServiceCtaClick(serviceName, "protezuvannya", "phone", "mobile_fab")}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label={lang === "uk" ? "Зателефонувати" : "Call Dentis"}
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
