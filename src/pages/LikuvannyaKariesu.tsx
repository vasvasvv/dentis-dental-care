import { useEffect, useMemo, useRef } from "react";
import { AlertCircle, CheckCircle, Phone } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageSeo from "@/components/SEO/PageSeo";
import Schema from "@/components/SEO/Schema";
import SeoAccordion from "@/components/SEO/SeoAccordion";
import { useLang } from "@/contexts/LanguageContext";
import heroVideo from "@/assets/hero-video.mp4";
import { buildCanonical } from "@/utils/seo";

const stages = {
  uk: [
    {
      title: "Початковий карієс",
      desc: "Біла або темна пляма на емалі без болю. На цьому етапі лікування карієсу у Кропивницькому займає мінімум часу.",
      color: "text-green-500",
    },
    {
      title: "Поверхневий карієс",
      desc: "Пошкодження емалі, чутливість до холодного та солодкого. Пломбування зуба відновлює форму і герметичність.",
      color: "text-yellow-500",
    },
    {
      title: "Середній карієс",
      desc: "Ураження переходить у дентин. Важливо вчасно видалити інфіковані тканини та встановити фотополімерну пломбу.",
      color: "text-orange-500",
    },
    {
      title: "Глибокий карієс",
      desc: "Інфекція підходить близько до нерва. Своєчасне лікування допомагає зберегти зуб і уникнути пульпіту.",
      color: "text-red-500",
    },
  ],
  en: [
    {
      title: "Early caries",
      desc: "A white or dark spot on the enamel without pain. At this stage, treatment is fast and minimally invasive.",
      color: "text-green-500",
    },
    {
      title: "Superficial caries",
      desc: "Enamel damage with sensitivity to cold or sweets. A filling restores shape and seal.",
      color: "text-yellow-500",
    },
    {
      title: "Medium caries",
      desc: "The lesion reaches dentin. Infected tissue removal and a photopolymer filling are usually required.",
      color: "text-orange-500",
    },
    {
      title: "Deep caries",
      desc: "The infection approaches the nerve. Timely care helps preserve the tooth and avoid pulpitis.",
      color: "text-red-500",
    },
  ],
};

const steps = {
  uk: [
    { num: "01", title: "Огляд та діагностика", desc: "Лікар оцінює глибину ураження, робить прицільний знімок за потреби та складає план лікування зуба." },
    { num: "02", title: "Анестезія", desc: "Сучасна анестезія робить лікування карієсу безболісним навіть при глибокому ураженні." },
    { num: "03", title: "Видалення уражених тканин", desc: "Каріозні тканини прибираються делікатно, щоб зберегти максимум здорової структури зуба." },
    { num: "04", title: "Пломбування", desc: "Фотополімерний матеріал підбирається під колір зуба та відновлює жувальну поверхню." },
    { num: "05", title: "Полірування", desc: "Фінальна обробка робить пломбу гладкою, зручною для прикусу і непомітною в усмішці." },
  ],
  en: [
    { num: "01", title: "Examination and diagnostics", desc: "The dentist assesses lesion depth, takes an X-ray if needed and prepares a treatment plan." },
    { num: "02", title: "Anaesthesia", desc: "Modern anaesthesia makes caries treatment comfortable even in deep cases." },
    { num: "03", title: "Removal of decayed tissue", desc: "Damaged tissue is removed carefully to preserve as much healthy tooth structure as possible." },
    { num: "04", title: "Filling", desc: "A photopolymer material is matched to the tooth shade and restores chewing function." },
    { num: "05", title: "Polishing", desc: "Final finishing makes the restoration smooth, functional and almost invisible." },
  ],
};

const faq = {
  uk: [
    {
      question: "Скільки коштує лікування карієсу у Кропивницькому?",
      answer: "Ціна лікування карієсу залежить від глибини ураження, необхідності знімка та обсягу реставрації. У Дентіс лікар називає точну вартість після огляду, щоб ви розуміли повний план без прихованих доплат.",
    },
    {
      question: "Чи боляче лікувати карієс?",
      answer: "Ні. Ми використовуємо сучасну місцеву анестезію, тому лікування карієсу, пломбування зубів і відновлення емалі проходять комфортно навіть у пацієнтів з чутливими зубами.",
    },
    {
      question: "Коли потрібно лікувати карієс терміново?",
      answer: "Якщо з’явився біль, реакція на холодне, темна порожнина або їжа застрягає між зубами, затягувати не варто. Раннє лікування карієсу у Кропивницькому обходиться простіше й дешевше, ніж лікування ускладнень.",
    },
  ],
  en: [
    {
      question: "How much does caries treatment cost in Kropyvnytskyi?",
      answer: "The cost depends on lesion depth, whether an X-ray is needed and the size of the restoration. Dentis provides the exact estimate after examination so the full treatment plan is clear upfront.",
    },
    {
      question: "Is caries treatment painful?",
      answer: "No. We use modern local anaesthesia, so treatment, fillings and enamel restoration remain comfortable even for sensitive patients.",
    },
    {
      question: "When should caries be treated urgently?",
      answer: "If you feel pain, sensitivity to cold, notice a dark cavity or food gets trapped between teeth, it is better not to delay. Early treatment is simpler and more affordable than treating complications.",
    },
  ],
};

const standards = {
  uk: [
    "Лікування карієсу під анестезією без болю та зайвого стресу",
    "Фотополімерні матеріали преміум-класу для довговічних пломб",
    "Підбір кольору реставрації під природний відтінок зуба",
    "Контроль прикусу, щоб пломба не заважала під час жування",
    "Рекомендації по домашньому догляду після лікування зуба",
    "Пояснення профілактики карієсу для дорослих і дітей",
  ],
  en: [
    "Comfortable caries treatment with effective anaesthesia",
    "Premium photopolymer materials for long-lasting fillings",
    "Shade matching for natural-looking restorations",
    "Bite control so the filling feels comfortable while chewing",
    "Clear home care instructions after treatment",
    "Practical prevention advice for adults and children",
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

  const stageItems = stages[lang];
  const stepItems = steps[lang];
  const faqItems = faq[lang];
  const standardItems = standards[lang];
  const title =
    lang === "uk"
      ? "Лікування карієсу у Кропивницькому | Ціни, пломбування — Дентіс"
      : "Caries treatment in Kropyvnytskyi | Fillings, prices — Dentis";
  const description =
    lang === "uk"
      ? "Лікування карієсу у Кропивницькому в стоматології Дентіс: безболісне пломбування зубів, фотополімерні матеріали та точна діагностика."
      : "Caries treatment in Kropyvnytskyi at Dentis: comfortable fillings, photopolymer restorations and precise diagnostics.";

  const procedureSchema = useMemo(
    () => ({
      name: lang === "uk" ? "Лікування карієсу" : "Caries treatment",
      description,
      url: buildCanonical("/likuvannya-kariesu", lang),
      bodyLocation: lang === "uk" ? "Зуби та ротова порожнина" : "Teeth and oral cavity",
      howPerformed:
        lang === "uk"
          ? "Огляд, анестезія, видалення каріозних тканин, пломбування фотополімером та полірування."
          : "Examination, anaesthesia, decay removal, photopolymer filling and polishing.",
      indication:
        lang === "uk"
          ? "Карієс, чутливість зубів, темні плями, руйнування емалі."
          : "Caries, tooth sensitivity, dark spots, enamel breakdown.",
      followup:
        lang === "uk"
          ? "Контроль гігієни, профілактичні огляди та професійна чистка кожні 6 місяців."
          : "Hygiene control, preventive visits and professional cleaning every 6 months.",
    }),
    [description, lang]
  );

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/likuvannya-kariesu"
        title={{
          uk: "Лікування карієсу у Кропивницькому | Ціни, пломбування — Дентіс",
          en: "Caries treatment in Kropyvnytskyi | Fillings, prices — Dentis",
        }}
        description={{
          uk: "Лікування карієсу у Кропивницькому в стоматології Дентіс: безболісне пломбування зубів, фотополімерні матеріали та точна діагностика.",
          en: "Caries treatment in Kropyvnytskyi at Dentis: comfortable fillings, photopolymer restorations and precise diagnostics.",
        }}
      />
      <Schema type="MedicalProcedure" lang={lang} data={procedureSchema} />
      <Schema type="FAQPage" lang={lang} data={{ faqs: faqItems }} />

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
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">
            {lang === "uk" ? "Послуги" : "Services"}
          </p>
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">
            {lang === "uk" ? "Лікування карієсу" : "Caries treatment"}
          </h1>
          <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="tel:+380504800825" className="flex items-center justify-center gap-3 rounded-full gradient-gold px-8 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90">
              <Phone size={18} />
              {lang === "uk" ? "Записатися на прийом" : "Book treatment"}
            </a>
            <a href={localizePath("/contacts")} className="flex items-center justify-center gap-2 rounded-full border border-gold/60 px-8 py-4 font-body text-base font-medium text-gold transition-all duration-200 hover:bg-gold/10">
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
                ? "Карієс прогресує непомітно, а раннє пломбування зуба займає менше часу, коштує дешевше та дозволяє уникнути ендодонтичного лікування."
                : "Caries often progresses silently. Early filling takes less time, costs less and helps avoid root canal treatment."}
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
            {stageItems.map((stage, index) => (
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
            {stepItems.map((step) => (
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
            {standardItems.map((item) => (
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
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">
              {lang === "uk" ? "Поширені питання про лікування карієсу" : "Common questions about caries treatment"}
            </h2>
          </div>
          <SeoAccordion items={faqItems} />
        </div>
      </section>

      <section className="bg-cream-dark py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 font-display text-4xl font-bold text-navy gold-line-center">
            {lang === "uk" ? "Болить зуб? Не зволікайте" : "Toothache? Do not wait"}
          </h2>
          <p className="mx-auto mb-8 max-w-md font-body text-primary-custom-dark/60">
            {lang === "uk"
              ? "Запишіться на консультацію у Дентіс, щоб вилікувати карієс до появи ускладнень та зберегти власний зуб."
              : "Book a consultation at Dentis to treat caries before complications appear and preserve your natural tooth."}
          </p>
          <a href="tel:+380504800825" className="inline-flex items-center gap-3 rounded-full gradient-gold px-10 py-4 font-body text-base font-semibold text-accent-foreground shadow-gold-custom transition-opacity hover:opacity-90">
            <Phone size={18} />
            {lang === "uk" ? "Зателефонувати" : "Call now"}
          </a>
        </div>
      </section>

      <Footer />

      <a
        href="tel:+380504800825"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label="Call Dentis"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
