import { Smile, Zap, Layers, Sparkles, HeartPulse, ScanLine } from "lucide-react";

const services = [
  {
    icon: Smile,
    title: "Терапевтична стоматологія",
    desc: "Лікування карієсу, пульпіту, відновлення зубів сучасними фотополімерними матеріалами.",
    tag: "Популярно",
  },
  {
    icon: Sparkles,
    title: "Естетична стоматологія",
    desc: "Відбілювання зубів, вініри, естетичні реставрації. Створення ідеальної посмішки.",
    tag: null,
  },
  {
    icon: Layers,
    title: "Ортопедична стоматологія",
    desc: "Коронки, мости, протезування на імплантах. Відновлення функції та естетики.",
    tag: null,
  },
  {
    icon: Zap,
    title: "Хірургічна стоматологія",
    desc: "Видалення зубів, імплантація, синус-ліфтинг. Робота з максимальним комфортом.",
    tag: null,
  },
  {
    icon: HeartPulse,
    title: "Професійне очищення",
    desc: "Професійна гігієна зубів спрямована на видалення зубного каменю, мʼякого та пігментованого нальоту.",
    tag: null,
  },
  {
    icon: ScanLine,
    title: "Діагностика та рентген",
    desc: "Цифрова рентгенографія, КЛКТ, фотопротокол. Точна діагностика за сучасними стандартами.",
    tag: null,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Послуги</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-3 gold-line-center">
            Повний спектр<br />стоматологічних послуг
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map(({ icon: Icon, title, desc, tag }) => (
            <div
              key={title}
              className="bg-card rounded-2xl p-7 border border-border shadow-card-custom hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
            >
              {tag && (
                <span className="absolute top-4 right-4 text-[10px] tracking-widest uppercase font-body font-semibold bg-gold/15 text-gold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-navy/5 group-hover:bg-gold/10 transition-colors flex items-center justify-center mb-5">
                <Icon size={22} className="text-custom-dark group-hover:text-gold transition-colors" />
              </div>

              <h3 className="font-display font-semibold text-custom-dark text-xl mb-3">{title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="tel:+380504800825"
            className="inline-flex items-center gap-2 border-2 border-secondary text-secondary hover:bg-navy hover:text-primary-foreground px-8 py-3.5 rounded-full font-body font-semibold text-sm transition-all duration-200"
          >
            Записатися на консультацію
          </a>
        </div>
      </div>
    </section>
  );
}
