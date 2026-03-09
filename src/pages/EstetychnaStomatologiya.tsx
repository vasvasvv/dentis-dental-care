import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, CheckCircle, Sparkles, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

const services = [
  {
    title: "Відбілювання Zoom 4",
    desc: "Клінічне відбілювання під LED-лампою. Зуби світлішають на 6–10 тонів за одну годину. Найефективніший спосіб освітлення емалі.",
    tag: "Хіт",
  },
  {
    title: "Керамічні вініри",
    desc: "Тонкі керамічні накладки на фронтальні зуби. Маскують сколи, щілини, нерівності, стійке знебарвлення. Результат — як у зірок.",
    tag: "Преміум",
  },
  {
    title: "Композитні вініри",
    desc: "Пряма реставрація фотополімером за одне відвідування. Доступна альтернатива керамічним вінірам без препарування.",
  },
  {
    title: "Художня реставрація",
    desc: "Відновлення сколотих, зруйнованих або деформованих зубів з точним підбором кольору та форми під ваш прикус.",
  },
  {
    title: "Відновлення діастеми",
    desc: "Закриття щілини між зубами за допомогою композиту або вінірів — без брекетів та хірургічного втручання.",
  },
  {
    title: "Дизайн посмішки",
    desc: "Цифровий smile design: планування форми, розміру та кольору зубів з попереднім візуальним результатом до початку лікування.",
    tag: "Новинка",
  },
];

const steps = [
  { num: "01", title: "Консультація та фото", desc: "Аналіз посмішки, обговорення очікувань, цифрове планування результату." },
  { num: "02", title: "Підбір кольору та форми", desc: "Вибір відтінку за шкалою Vita, визначення форми зубів під обличчя пацієнта." },
  { num: "03", title: "Підготовка", desc: "Мінімальне або нульове препарування залежно від методу. Тимчасові реставрації на час виготовлення." },
  { num: "04", title: "Фіксація", desc: "Примірка, корекція та постійна фіксація. Фінальне полірування та фотоконтроль результату." },
];

const results = [
  { value: "6–10", label: "тонів освітлення при Zoom 4" },
  { value: "1", label: "відвідування для композитних вінірів" },
  { value: "15+", label: "років служби кераміки" },
  { value: "100%", label: "індивідуальний підбір кольору" },
];

export default function EstetychnaStomat() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Естетична стоматологія — Дентіс Кропивницький</title>
        <meta name="description" content="Вініри, відбілювання Zoom 4, художня реставрація та дизайн посмішки у Кропивницькому. Створюємо ідеальну посмішку з індивідуальним підходом." />
        <link rel="canonical" href="https://dentis.pp.ua/estetychna-stomatolohiya" />
        <meta property="og:title" content="Естетична стоматологія — Дентіс Кропивницький" />
        <meta property="og:description" content="Вініри, відбілювання, художня реставрація. Ваша ідеальна посмішка — наша робота." />
        <meta property="og:url" content="https://dentis.pp.ua/estetychna-stomatolohiya" />
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
            Естетична<br />стоматологія
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-10">
            Перетворюємо посмішки. Вініри, відбілювання, художня реставрація — сучасні методи для бездоганного естетичного результату.
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

      {/* Stats */}
      <section className="py-14 bg-cream-dark border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {results.map(({ value, label }) => (
              <div key={label}>
                <Sparkles size={22} className="text-gold mx-auto mb-3" />
                <div className="font-display text-2xl font-bold text-navy mb-1">{value}</div>
                <div className="font-body text-xs text-muted-foreground tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Що ми пропонуємо</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Естетичні процедури</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-card border border-border rounded-2xl p-7 shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative"
              >
                {s.tag && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full font-body font-semibold">
                    {s.tag}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <Star size={18} className="text-gold" />
                </div>
                <h3 className="font-display font-bold text-custom-dark text-lg mb-3 pr-16">{s.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
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
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Як проходить лікування</h2>
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
              "Досвідчений фахівець з естетичної реставрації",
              "Цифровий дизайн посмішки перед лікуванням",
              "Матеріали провідних світових брендів",
              "Точний підбір кольору під натуральні зуби",
              "Мінімально інвазивний підхід",
              "Гарантія на всі естетичні роботи",
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
      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-navy mb-4 gold-line-center">Мрієте про ідеальну посмішку?</h2>
          <p className="font-body text-primary-custom-dark/60 mb-8 max-w-md mx-auto">
            Запишіться на консультацію — разом оберемо найкращий метод для вашого випадку.
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