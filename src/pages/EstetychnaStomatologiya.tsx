import { useEffect, useRef } from "react";
import { CheckCircle, Phone, Sparkles, Star } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RelatedServices from "@/components/RelatedServices";
import PageSeo from "@/components/SEO/PageSeo";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { useLang } from "@/contexts/LanguageContext";
import heroVideo from "@/assets/hero-video.mp4";
import { trackServiceCtaClick, trackServiceView } from "@/lib/gtmTracking";
import { toAbsoluteUrl } from "@/utils/seo";

const services = {
  uk: [
    { title: "Відбілювання Zoom 4", desc: "Клінічне освітлення емалі під контролем лікаря з помітним результатом за одне відвідування.", tag: "Хіт" },
    { title: "Керамічні вініри", desc: "Тонкі накладки для корекції форми, кольору та пропорцій фронтальних зубів.", tag: "Преміум" },
    { title: "Композитні вініри", desc: "Швидка естетична корекція за один візит без складного ортопедичного етапу." },
    { title: "Художня реставрація", desc: "Відновлення сколів, тріщин та нерівностей із природною анатомією зуба." },
    { title: "Закриття діастеми", desc: "Корекція щілини між зубами без довгого ортодонтичного лікування в окремих клінічних випадках." },
    { title: "Smile design", desc: "Попереднє планування майбутньої усмішки з фокусом на гармонію форми та кольору.", tag: "Новинка" },
  ],
  en: [
    { title: "Zoom 4 whitening", desc: "In-clinic enamel whitening under dentist supervision with visible results in a single visit.", tag: "Top service" },
    { title: "Ceramic veneers", desc: "Thin restorations to improve the shape, colour and proportions of front teeth.", tag: "Premium" },
    { title: "Composite veneers", desc: "Fast aesthetic improvement in one visit without a complex prosthetic stage." },
    { title: "Artistic restorations", desc: "Repair of chips, cracks and shape imperfections with natural tooth anatomy." },
    { title: "Diastema closure", desc: "Correction of gaps between teeth without lengthy orthodontic treatment in selected cases." },
    { title: "Smile design", desc: "Preview-oriented planning of your future smile with focus on shape and colour harmony.", tag: "New" },
  ],
};

const steps = {
  uk: [
    { num: "01", title: "Консультація і фотоаналіз", desc: "Обговорюємо ваш запит, робимо фото та визначаємо сильні й слабкі сторони усмішки." },
    { num: "02", title: "Підбір форми й кольору", desc: "Погоджуємо відтінок, пропорції та очікуваний результат ще до початку роботи." },
    { num: "03", title: "Підготовка", desc: "Залежно від методу проводиться мінімальна підготовка зубів або пряма реставрація." },
    { num: "04", title: "Фіналізація", desc: "Фіксуємо реставрації, поліруємо поверхні та перевіряємо гармонію усмішки." },
  ],
  en: [
    { num: "01", title: "Consultation and photo analysis", desc: "We discuss your goals, take photos and assess the current aesthetics of the smile." },
    { num: "02", title: "Shape and shade selection", desc: "We align on colour, proportions and the expected outcome before treatment begins." },
    { num: "03", title: "Preparation", desc: "Depending on the method, teeth receive minimal preparation or direct restoration." },
    { num: "04", title: "Finalisation", desc: "The restorations are fixed, polished and checked for symmetry and harmony." },
  ],
};

const results = {
  uk: [
    { value: "6-10", label: "тонів освітлення при Zoom 4" },
    { value: "1", label: "візит для композитної корекції" },
    { value: "15+", label: "років служби якісної кераміки" },
    { value: "100%", label: "індивідуальний підбір кольору" },
  ],
  en: [
    { value: "6-10", label: "shades lighter with Zoom 4" },
    { value: "1", label: "visit for composite correction" },
    { value: "15+", label: "years of service for quality ceramics" },
    { value: "100%", label: "individual shade matching" },
  ],
};

const advantages = {
  uk: [
    "Делікатний підхід до природних тканин зуба",
    "Цифрове планування естетичного результату",
    "Робота з формою, кольором і пропорціями як єдиною системою",
    "Матеріали преміального рівня для реставрацій",
    "Точний підбір рішень під обличчя та прикус пацієнта",
    "Зрозумілий маршрут від консультації до фінального результату",
  ],
  en: [
    "Conservative approach to natural tooth tissues",
    "Digital planning of the aesthetic outcome",
    "Integrated work on shape, colour and proportions",
    "Premium-level restorative materials",
    "Solutions tailored to facial features and bite",
    "A clear path from consultation to final result",
  ],
};

export default function EstetychnaStomatologiya() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, localizePath } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
    video.playbackRate = 0.6;
  }, []);

  useEffect(() => {
    trackServiceView(lang === "uk" ? "Естетична стоматологія" : "Cosmetic dentistry", "estetychna-stomatolohiya");
  }, [lang]);

  const description =
    lang === "uk"
      ? "Дизайн посмішки, відбілювання зубів, виправлення прикусу. Виробляємо красиву та здорову посмішку за допомогою сучасних методів."
      : "Smile design, teeth whitening, bite correction. Creating beautiful and healthy smiles using modern techniques.";

  const pageServices = services[lang];
  const pageSteps = steps[lang];
  const pageResults = results[lang];
  const pageAdvantages = advantages[lang];
  const serviceName = lang === "uk" ? "Естетична стоматологія" : "Cosmetic dentistry";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/estetychna-stomatolohiya"
        ogImage="/og-images/estetychna-stomatologiya.jpg"
        title={{
          uk: "Естетична стоматологія у Кропивницькому — Дентіс",
          en: "Cosmetic Dentistry in Kropyvnytskyi — Dentis",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema
        id="estetychna-stomatolohiya-schema"
        name={serviceName}
        description={description}
        image={toAbsoluteUrl("/og-images/estetychna-stomatologiya.jpg")}
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
          <h1 className="mb-6 max-w-2xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Естетична стоматологія" : "Cosmetic dentistry"}</h1>
          <p className="mb-10 max-w-xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:+380504800825"
              onClick={() => trackServiceCtaClick(serviceName, "estetychna-stomatolohiya", "phone", "hero")}
              className="flex items-center justify-center gap-3 rounded-full gradient-gold px-8 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
            >
              <Phone size={18} />
              {lang === "uk" ? "Записатися на консультацію" : "Book consultation"}
            </a>
            <a
              href={localizePath("/contacts")}
              onClick={() => trackServiceCtaClick(serviceName, "estetychna-stomatolohiya", "contacts", "hero")}
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
            {pageResults.map(({ value, label }) => (
              <div key={label}>
                <Sparkles size={22} className="mx-auto mb-3 text-gold" />
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
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Що ми пропонуємо" : "What we offer"}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Естетичні процедури" : "Cosmetic procedures"}</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageServices.map((item) => (
              <div key={item.title} className="relative rounded-2xl border border-border bg-card p-7 shadow-card-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                {item.tag && <span className="absolute right-4 top-4 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-body font-semibold uppercase text-gold">{item.tag}</span>}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                  <Star size={18} className="text-gold" />
                </div>
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

      <section className="bg-background py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Хочете оновити усмішку?" : "Want to upgrade your smile?"}</h2>
          <p className="mx-auto mb-8 max-w-md font-body text-primary-custom-dark/60">
            {lang === "uk" ? "Запишіться на консультацію, щоб разом обрати найкращий естетичний сценарій для вашого випадку." : "Book a consultation and choose the right cosmetic treatment plan for your case."}
          </p>
          <a
            href="tel:+380504800825"
            onClick={() => trackServiceCtaClick(serviceName, "estetychna-stomatolohiya", "phone", "footer_cta")}
            className="inline-flex items-center gap-3 rounded-full gradient-gold px-10 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90"
          >
            <Phone size={18} />
            {lang === "uk" ? "Зателефонувати" : "Call now"}
          </a>
        </div>
      </section>

      <RelatedServices currentService="estetychna-stomatolohiya" />

      <Footer />

      <a
        href="tel:+380504800825"
        onClick={() => trackServiceCtaClick(serviceName, "estetychna-stomatolohiya", "phone", "mobile_fab")}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label={lang === "uk" ? "Зателефонувати" : "Call Dentis"}
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
