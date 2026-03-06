import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, CheckCircle, ScanLine, Shield, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";

const methods = [
  {
    title: "Цифровий прицільний рентген",
    desc: "Комплексний огляд ротової порожнини, оцінка стану зубів, ясен та прикусу. Лікар визначає основні проблеми та складає попередній план лікування.",
    tag: "Базовий",
  },
  {
    title: "Первинна консультація стоматолога",
    desc: "Панорамний знімок всіх зубів, щелеп та суглобів. Незамінний для планування імплантації, ортодонтії та хірургії.",
  },
  {
    title: "Пародонтологічна діагностика",
    desc: "Оцінка стану ясен і тканин, що утримують зуб. Вимірювання пародонтальних кишень, перевірка кровоточивості та рухомості зубів.",    
},
  {
    title: "Діагностика карієсу",
    desc: "Оцінка взаємного положення зубів верхньої та нижньої щелепи. Виявлення порушень прикусу та рекомендації щодо ортодонтичного лікування.",
  },
  {
    title: "Діагностика прикусу",
    desc: "Клінічна фотографія до, під час та після лікування. Документація змін, планування естетичних робіт, контроль результату.",
  },
  {
    title: "Тест життєздатності зуба",
    desc: "Перевірка реакції зуба на холод або інші подразники для визначення стану пульпи. Допомагає встановити потребу в ендодонтичному лікуванні.",
  },
];

const steps = [
  { num: "01", title: "Скарги та огляд", desc: "Лікар збирає анамнез, оглядає порожнину рота, визначає необхідний вид діагностики." },
  { num: "02", title: "Знімок або сканування", desc: "Залежно від клінічного завдання — прицільний рентген. Займає 1–3 хвилини." },
  { num: "03", title: "Аналіз та опис", desc: "Лікар аналізує знімки, описує патології, формує план лікування." },
  { num: "04", title: "Пояснення пацієнту", desc: "Лікар пояснює, що виявлено, які є варіанти лікування та їх вартість." },
];

const advantages = [
  "Цифровий рентген — мінімальна доза опромінення",
  "Діагностика тріщин зуба",
  "Результати знімків одразу на екрані",
  "Знімки зберігаються в цифровому архіві",
  "Безпечно для вагітних (за направленням лікаря)",
  "Повна документація лікування",
];

export default function DiagnosticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Діагностика та рентген — Дентіс Кропивницький</title>
        <meta name="description" content="Цифровий рентген, панорамні знімки, КЛКТ (3D), внутрішньоротова камера та фотопротокол у Кропивницькому. Точна діагностика — основа якісного лікування." />
        <link rel="canonical" href="https://dentis.pp.ua/diagnostyka-renthen" />
        <meta property="og:title" content="Діагностика та рентген — Дентіс Кропивницький" />
        <meta property="og:description" content="Цифровий рентген, КЛКТ 3D, панорама. Точна діагностика — основа якісного лікування." />
        <meta property="og:url" content="https://dentis.pp.ua/diagnostyka-renthen" />
        <meta property="og:type" content="website" />
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
            Діагностика<br />та рентген
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-10">
            Точна діагностика — фундамент правильного лікування. Цифровий рентген, 3D-сканування та сучасні технології візуалізації для повної картини вашого здоров'я.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+380504800825"
              className="flex items-center justify-center gap-3 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              Записатися на діагностику
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

      {/* Key stats */}
      <section className="py-14 bg-cream-dark border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            {[
              { icon: Zap, value: "×10", label: "менше опромінення" },
              { icon: Shield, value: "100%", label: "цифровий архів знімків" },
              { icon: CheckCircle, value: "1–3 хв", label: "час сканування" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <Icon size={22} className="text-gold mx-auto mb-3" />
                <div className="font-display text-2xl font-bold text-navy mb-1">{value}</div>
                <div className="font-body text-xs text-muted-foreground tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Можливості</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Методи діагностики</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {methods.map((m) => (
              <div
                key={m.title}
                className="bg-card border border-border rounded-2xl p-7 shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative"
              >
                {m.tag && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full font-body font-semibold">
                    {m.tag}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <ScanLine size={18} className="text-gold" />
                </div>
                <h3 className="font-display font-bold text-custom-dark text-lg mb-3 pr-16">{m.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
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
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Як проходить діагностика</h2>
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

      {/* Advantages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Наші переваги</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {advantages.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-navy mb-4 gold-line-center">Не знаєте, з чого почати?</h2>
          <p className="font-body text-primary-custom-dark/60 mb-8 max-w-md mx-auto">
            Запишіться на первинну консультацію з діагностикою — лікар оцінить стан зубів та складе план лікування.
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