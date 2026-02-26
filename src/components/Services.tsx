import { motion } from "framer-motion";
import { Smile, Zap, Layers, Sparkles, HeartPulse, ScanLine } from "lucide-react";
import { Variants } from "framer-motion";

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
  },
  {
    icon: Layers,
    title: "Ортопедична стоматологія",
    desc: "Коронки, мости, протезування на імплантах. Відновлення функції та естетики.",
  },
  {
    icon: Zap,
    title: "Хірургічна стоматологія",
    desc: "Видалення зубів, імплантація, синус-ліфтинг. Робота з максимальним комфортом.",
  },
  {
    icon: HeartPulse,
    title: "Професійне очищення",
    desc: "Професійна гігієна зубів спрямована на видалення зубного каменю.",
  },
  {
    icon: ScanLine,
    title: "Діагностика та рентген",
    desc: "Цифрова рентгенографія, КЛКТ, фотопротокол.",
  },
];

// Анімація контейнера (stagger)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};
// Анімація картки
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ← замість "easeOut"
    },
  },
};
export default function Services() {
  return (
    <section id="services" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Послуги</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-3 gold-line-center">
            Повний спектр<br />стоматологічних послуг
          </h2>
        </motion.div>

        {/* Картки */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {services.map(({ icon: Icon, title, desc, tag }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="bg-card rounded-2xl p-7 border border-border shadow-card-custom
                         hover:shadow-xl hover:-translate-y-2 
                         transition-all duration-300 group relative overflow-hidden"
            >
              {tag && (
                <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              )}

              <div className="w-12 h-12 rounded-xl bg-navy/5 group-hover:bg-gold/10 
                              transition-colors flex items-center justify-center mb-5">
                <Icon size={22} className="text-custom-dark group-hover:text-gold transition-colors" />
              </div>

              <h3 className="font-semibold text-xl mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Кнопка */}
        <motion.div
          variants={cardVariants}
          className="text-center mt-10"
        >
          <motion.a
            href="tel:+380504800825"
            className="inline-flex items-center gap-2 border-2 border-navy text-custom-dark hover:bg-navy hover:text-primary-foreground px-8 py-3.5 rounded-full font-body font-semibold text-sm transition-all duration-200"
          >
            Записатися на консультацію
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}