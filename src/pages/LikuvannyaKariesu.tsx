import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, CheckCircle, AlertCircle } from "lucide-react";

const stages = [
  {
    title: "Початковий карієс",
    desc: "Пляма на емалі без болю. Лікується без свердління — ремінералізацією або мінімальним препаруванням.",
    color: "text-green-500",
  },
  {
    title: "Поверхневий карієс",
    desc: "Ураження в межах емалі. Виникає чутливість. Лікується швидко та безболісно.",
    color: "text-yellow-500",
  },
  {
    title: "Середній карієс",
    desc: "Ураження сягає дентину. Біль при контакті з холодним/солодким. Потребує пломбування.",
    color: "text-orange-500",
  },
  {
    title: "Глибокий карієс",
    desc: "Глибоке ураження. Загроза пульпіту. Важлива своєчасна допомога для збереження зуба.",
    color: "text-red-500",
  },
];

const steps = [
  { num: "01", title: "Огляд та діагностика", desc: "Визначення стадії карієсу, рентген за потреби." },
  { num: "02", title: "Анестезія", desc: "Сучасна безболісна анестезія. Чекаємо повного знечулення." },
  { num: "03", title: "Видалення ураженої тканини", desc: "Прибираємо лише пошкоджений дентин, зберігаючи здорові тканини." },
  { num: "04", title: "Пломбування", desc: "Фотополімерна пломба підбирається під колір зуба та полімеризується лампою." },
  { num: "05", title: "Шліфування та полірування", desc: "Корекція прикусу, гладенька поверхня — пломба майже непомітна." },
];

export default function LikuvannyaKariesu() {
  return (
    <div className="min-h-screen bg-background">
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
            Лікування карієсу
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-10">
            Сучасне безболісне лікування карієсу будь-якої стадії. Зберігаємо максимум природних тканин зуба.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+380504800825"
              className="flex items-center justify-center gap-3 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              Записатися на прийом
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

      {/* Warning */}
      <section className="py-12 bg-gold/5 border-y border-gold/20">
        <div className="container mx-auto px-4 max-w-3xl flex gap-4 items-start">
          <AlertCircle size={22} className="text-gold shrink-0 mt-0.5" />
          <p className="font-body text-foreground/80 leading-relaxed">
            <strong className="text-custom-dark">Не відкладайте лікування!</strong> Карієс — прогресуюче захворювання. На початковій стадії лікування займає 20–30 хвилин і є майже безболісним. Запущений карієс може призвести до пульпіту, периодонтиту або втрати зуба.
          </p>
        </div>
      </section>

      {/* Stages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Стадії</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Стадії карієсу</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stages.map((s, i) => (
              <div key={s.title} className="bg-card border border-border rounded-2xl p-6 shadow-card-custom">
                <div className={`font-display text-5xl font-bold mb-3 ${s.color} opacity-30`}>{i + 1}</div>
                <h3 className="font-display font-bold text-custom-dark text-base mb-2">{s.title}</h3>
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

      {/* Materials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">Наші стандарти</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Безболісна анестезія сучасними препаратами",
              "Фотополімерні матеріали преміум-класу",
              "Підбір кольору пломби під тон зуба",
              "Кофердам для захисту зуба та ізоляції",
              "Мінімально інвазивний підхід",
              "Гарантія на пломбу",
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
      <section className="py-20 bg-navy text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-secondary mb-4">Зуб болить? Не зволікайте!</h2>
          <p className="font-body text-primary-foreground/60 mb-8 max-w-md mx-auto">
            Приймаємо пацієнтів у зручний час. Зателефонуйте та запишіться вже сьогодні.
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