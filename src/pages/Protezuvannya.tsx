import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import heroVideo from "@/assets/hero-video.mp4";
import { useEffect, useRef } from "react";

const types = [
  {
    title: "Металокерамічні коронки",
    desc: "Надійні, доступні, з металевим каркасом та керамічним покриттям. Відмінне поєднання міцності та естетики.",
    tag: "Популярно",
  },
  {
    title: "Безметалова кераміка",
    desc: "Найприродніший вигляд. Ідеально підходить для фронтальних зубів. Повністю прозора та природна.",
    tag: "Преміум",
  },
  {
    title: "Цирконієві коронки",
    desc: "Максимальна міцність та естетика. Не окислюються, не викликають алергії, виглядають як рідні зуби.",
    tag: "Рекомендуємо",
  },
  {
    title: "Мостоподібні протези",
    desc: "Відновлення кількох відсутніх зубів поспіль. Спирається на сусідні зуби або імпланти.",
  },
  {
    title: "Знімні протези",
    desc: "Повне або часткове відновлення зубного ряду. Сучасні матеріали забезпечують комфорт та природний вигляд.",
  },
  {
    title: "Протезування на імплантах",
    desc: "Найстабільніше рішення — коронка або міст, що кріпиться до імплантів. Не потребує препарування сусідніх зубів.",
    tag: "Оптимально",
  },
];

const steps = [
  { num: "01", title: "Огляд і консультація", desc: "Оцінка стану зубів, вибір матеріалу та конструкції протеза." },
  { num: "02", title: "Підготовка зубів", desc: "Препарування опорних зубів, зняття відбитків або цифровий скан." },
  { num: "03", title: "Виготовлення", desc: "Тимчасова коронка на час виготовлення постійної в зуботехнічній лабораторії." },
  { num: "04", title: "Фіксація", desc: "Примірка, корекція за потреби та постійна цементація коронки." },
];

export default function Protezuvannya() {
        const videoRef = useRef<HTMLVideoElement>(null);
    
      useEffect(() => {
        const video = videoRef.current;
        if (video) {
          video.play().catch(() => {});
          video.playbackRate = 0.6;
        }
      }, []);
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Протезування зубів — Дентіс Кропивницький</title>
        <meta name="description" content="Протезування зубів у Кропивницькому: коронки, мости, знімні протези, протезування на імплантах. Цирконій, металокераміка, безметалова кераміка." />
        <link rel="canonical" href="https://dentis.pp.ua/protezuvannya" />
        <meta property="og:title" content="Протезування зубів — Дентіс Кропивницький" />
        <meta property="og:description" content="Відновлюємо функцію та красу зубів. Коронки, мости, знімні та незнімні протези від досвідчених фахівців." />
        <meta property="og:url" content="https://dentis.pp.ua/protezuvannya" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://dentis.pp.ua/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
                              {/* Фіксований фон з відео */}
      <div className="fixed inset-0 -z-10">
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/hero-poster.webp"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-70" />
      </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">Послуги</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-secondary leading-tight mb-6 max-w-2xl">
            Протезування зубів
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-10">
            Відновлюємо функцію та красу зубів за допомогою сучасних матеріалів та технологій. Від одиночних коронок до повного протезування.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+380504800825"
              className="flex items-center justify-center gap-3 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              Записатися на консультацію
            </a>
            <a
              href="/contacts"
              className="flex items-center justify-center gap-2 border border-gold/60 text-gold hover:bg-gold/10 px-8 py-4 rounded-full font-body font-medium text-base transition-all duration-200"
            >
              Контакти
            </a>
          </div>
        </div>
      </section>

      {/* Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Варіанти</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Види протезування</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {types.map((t) => (
              <div
                key={t.title}
                className="bg-card border border-border rounded-2xl p-7 shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative"
              >
                {t.tag && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full font-body font-semibold">
                    {t.tag}
                  </span>
                )}
                <h3 className="font-display font-bold text-custom-dark text-lg mb-3 pr-16">{t.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Процес</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Як проходить протезування</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-card border border-border rounded-2xl p-6 shadow-card-custom flex gap-6 items-start">
                <span className="font-display text-4xl font-bold text-gold/30 shrink-0 leading-none">{step.num}</span>
                <div>
                  <h3 className="font-display font-bold text-custom-dark text-lg mb-2">{step.title}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Наші переваги</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Матеріали від перевірених виробників",
              "Власна зуботехнічна мережа партнерів",
              "Цифровий скан — без неприємних відбитків",
              "Тимчасова коронка на весь час виготовлення",
              "Гарантія на коронку та роботу",
              "Безвідсоткова розстрочка",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream-dark text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-navy mb-4 gold-line-center">Відновіть посмішку сьогодні</h2>
          <p className="font-body text-primary-custom-dark/60 mb-8 max-w-md mx-auto">
            Безкоштовна консультація — оберіть найкращий варіант протезування разом з лікарем.
          </p>
          <a
            href="tel:+380504800825"
            className="inline-flex items-center gap-3 gradient-gold text-accent-foreground px-10 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity"
          >
            <Phone size={18} />
            Зателефонувати
          </a>
        </div>
      </section>


      <Footer />


      <a
        href="tel:+380504800825"
        className="fixed bottom-6 right-6 z-50 gradient-gold text-accent-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-gold-custom hover:scale-110 transition-transform duration-200 md:hidden"
        aria-label="Зателефонувати"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}