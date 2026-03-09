import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, CheckCircle, Clock, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

const steps = [
  { num: "01", title: "Огляд", desc: "Стоматолог оцінює стан ясен та зубів, наявність каменю та нальоту." },
  { num: "02", title: "Ультразвукова чистка", desc: "Видалення зубного каменю за допомогою ультразвукового скейлера." },
  { num: "03", title: "Air Flow", desc: "Очищення нальоту між зубами та в ясеневих кишенях струменем повітря та порошку." },
  { num: "04", title: "Полірування", desc: "Полірування поверхонь зубів спеціальними пастами — зуби стають гладенькими." },
  { num: "05", title: "Фторування", desc: "Нанесення фторвмісного лаку для зміцнення емалі та захисту від карієсу." },
];

const benefits = [
  "Видалення зубного каменю та нальоту",
  "Профілактика карієсу та хвороб ясен",
  "Освіжає дихання",
  "Зуби стають на 1–2 тони світлішими",
  "Рекомендовано кожні 6 місяців",
  "Безболісно та комфортно",
];

export default function ProfessionalCleaning() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Професійна гігієна зубів — Дентіс Кропивницький</title>
        <meta name="description" content="Професійна чистка зубів у Кропивницькому: ультразвук, Air Flow, полірування, фторування. Акція — знижка 15% до 31 березня 2026." />
        <link rel="canonical" href="https://dentis.pp.ua/profesijne-ochischennya" />
        <meta property="og:title" content="Професійна гігієна зубів — Дентіс Кропивницький" />
        <meta property="og:description" content="Комплексне очищення зубів. Видалення каменю, Air Flow, полірування, фторування. Результат помітний відразу." />
        <meta property="og:url" content="https://dentis.pp.ua/profesijne-ochischennya" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://dentis.pp.ua/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-24 bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">Послуги</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-secondary leading-tight mb-6 max-w-2xl">
            Професійна гігієна зубів
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-10">
            Комплексне очищення, якого неможливо досягти вдома. Захист від карієсу та ясенних хвороб, свіже дихання та природне відбілювання.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+380504800825"
              className="flex items-center justify-center gap-3 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              Записатися на чистку
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

      {/* Stats */}
      <section className="py-14 bg-cream-dark border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {[
              { icon: Clock, value: "60–90 хв", label: "Тривалість процедури" },
              { icon: Star, value: "1–2 тони", label: "Освітлення зубів" },
              { icon: CheckCircle, value: "6 міс", label: "Рекомендована частота" },
              { icon: Phone, value: "100%", label: "Комфорт та безпека" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon size={24} className="text-gold mx-auto mb-3" />
                <div className="font-display text-2xl font-bold text-navy mb-1">{value}</div>
                <div className="font-body text-xs text-muted-foreground tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Протокол</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Етапи гігієни</h2>
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

            {/* Promo banner */}
      <section className="py-12 bg-gold/10 border-y border-gold/20">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-bold text-custom-dark mb-1">Акція: знижка 15% на гігієну</p>
            <p className="font-body text-muted-foreground text-sm">Діє до 31 березня 2026. Не пропустіть!</p>
          </div>
          <a
            href="tel:+380504800825"
            className="shrink-0 inline-flex items-center gap-2 gradient-gold text-accent-foreground px-7 py-3.5 rounded-full font-body font-semibold text-sm shadow-gold-custom hover:opacity-90 transition-opacity"
          >
            <Phone size={16} />
            Записатися зі знижкою
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Що ви отримуєте</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Who needs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold text-navy mb-8 gold-line-center">Кому особливо рекомендується</h2>
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              { title: "Курці", desc: "Нікотиновий наліт видаляється лише професійно." },
              { title: "Любителі кави", desc: "Темний наліт від кави та чаю не піддається щітці." },
              { title: "Носії брекетів", desc: "Очищення під дужками та замками — критично важливо." },
              { title: "Вагітні", desc: "Гормональні зміни підвищують ризик ясенних хвороб." },
              { title: "Перед протезуванням", desc: "Чисті зуби — запорука міцної фіксації коронки." },
              { title: "Всі раз на 6 місяців", desc: "Профілактика карієсу та ясенних захворювань." },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-5 shadow-card-custom text-left">
                <h3 className="font-display font-bold text-custom-dark text-base mb-2">{item.title}</h3>
                <p className="font-body text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-navy mb-4 gold-line-center">Подбайте про здоров'я ясен</h2>
          <p className="font-body text-custom-dark/60 mb-8 max-w-md mx-auto">
            Зателефонуйте та запишіться на зручний час. Процедура займає лише годину.
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
<section className="bg-primary">
      <Footer />
</section>
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