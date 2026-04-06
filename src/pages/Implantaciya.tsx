import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RelatedServices from "@/components/RelatedServices";
import PageSeo from "@/components/SEO/PageSeo";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { Phone, CheckCircle, Clock, Shield, Star } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import { useEffect, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { trackServiceView } from "@/lib/gtmTracking";
import { toAbsoluteUrl } from "@/utils/seo";

const steps = [
  {
    num: "01",
    title: "Консультація та діагностика",
    desc: "Оцінка стану кістки, діагностика та планування імплантації з урахуванням вашої клінічної ситуації.",
  },
  {
    num: "02",
    title: "Підготовка",
    desc: "Санація порожнини рота, а за потреби нарощування кістки або синус-ліфтинг перед встановленням імпланта.",
  },
  {
    num: "03",
    title: "Встановлення імпланта",
    desc: "Хірургічний етап під місцевою анестезією. Зазвичай процедура триває близько 30-60 хвилин.",
  },
  {
    num: "04",
    title: "Остеоінтеграція",
    desc: "Імплант зростається з кісткою протягом 2-6 місяців, після чого можна переходити до ортопедичного етапу.",
  },
  {
    num: "05",
    title: "Коронка",
    desc: "Виготовлення та фіксація коронки для повного відновлення функції та естетики зуба.",
  },
];

const benefits = [
  "Імпланти від провідних світових виробників",
  "19+ років досвіду лікаря-імплантолога",
  "Гарантія на імплант та виконану роботу",
  "Сучасна цифрова діагностика",
  "Безболісна місцева анестезія",
  "Індивідуальний план лікування",
];

export default function Implantation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, localizePath } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      video.playbackRate = 0.6;
    }
  }, []);

  useEffect(() => {
    trackServiceView(lang === "uk" ? "Імплантація зубів" : "Dental implants", "implantaciya");
  }, [lang]);

  const description =
    lang === "uk"
      ? "Імплантація зубів у Кропивницькому в клініці Dentis: цифрова діагностика, сучасні імпланти та індивідуальний план відновлення посмішки."
      : "Dental implants in Kropyvnytskyi at Dentis with digital diagnostics, modern implant systems and a tailored restoration plan.";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/implantaciya"
        title={{
          uk: "Імплантація зубів у Кропивницькому | Ціни, відгуки — Dentis",
          en: "Dental implants in Kropyvnytskyi | Prices, reviews — Dentis",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema
        id="implantaciya-schema"
        name={lang === "uk" ? "Імплантація зубів" : "Dental implants"}
        description={description}
        image={toAbsoluteUrl("/og-image-implantaciya.jpg")}
      />

      <Header />

      <section className="relative pt-36 pb-24 overflow-hidden">
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
            Імплантація зубів
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-10">
            Повноцінне відновлення зуба, що виглядає та відчувається як природний. Імплантація є
            найнадійнішим довгостроковим способом замінити втрачений зуб і повернути комфорт під час
            жування та усмішки.
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
              href={localizePath("/contacts")}
              className="flex items-center justify-center gap-2 border border-gold/60 text-gold hover:bg-gold/10 px-8 py-4 rounded-full font-body font-medium text-base transition-all duration-200"
            >
              Контакти
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">Переваги</p>
              <h2 className="font-display text-4xl font-bold text-navy mb-8 gold-line">
                Чому обирають
                <br />
                імплантацію у нас?
              </h2>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 font-body text-foreground/80">
                    <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Star, label: "Приживлюваність", value: "98%" },
                { icon: Clock, label: "Термін служби", value: "25+ років" },
                { icon: Shield, label: "Гарантія", value: "5 років" },
                { icon: CheckCircle, label: "Проведених операцій", value: "500+" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-6 shadow-card-custom text-center">
                  <Icon size={24} className="text-gold mx-auto mb-3" />
                  <div className="font-display text-3xl font-bold text-navy mb-1">{value}</div>
                  <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Процес</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Етапи імплантації</h2>
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

      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-navy mb-4 gold-line-center">Готові відновити посмішку?</h2>
          <p className="font-body text-primary-text-custom-dark/60 mb-8 max-w-md mx-auto">
            Запишіться на консультацію та дізнайтеся, який план імплантації буде оптимальним саме для
            вашого випадку.
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

      <RelatedServices currentService="implantaciya" />

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
