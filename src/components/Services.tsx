import { motion } from "framer-motion";
import { Smile, Zap, Layers, Sparkles, HeartPulse, ScanLine } from "lucide-react";
import { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Smile,
    title: "Терапевтична стоматологія",
    desc: "Лікування карієсу, пульпіту, відновлення зубів сучасними фотополімерними матеріалами.",
    tag: "Популярно",
    link: "/likuvannya-kariesu",
  },
  {
    icon: Sparkles,
    title: "Естетична стоматологія",
    desc: "Відбілювання зубів, вініри, естетичні реставрації. Створення ідеальної посмішки.",
    link: null,
  },
  {
    icon: Layers,
    title: "Ортопедична стоматологія",
    desc: "Коронки, мости, протезування на імплантах. Відновлення функції та естетики.",
    link: "/protezuvannya",
  },
  {
    icon: Zap,
    title: "Хірургічна стоматологія",
    desc: "Видалення зубів, імплантація, синус-ліфтинг. Робота з максимальним комфортом.",
    link: "/implantation",
  },
  {
    icon: HeartPulse,
    title: "Професійне очищення",
    desc: "Професійна гігієна зубів спрямована на видалення зубного каменю.",
    link: "/professional-cleaning",
  },
  {
    icon: ScanLine,
    title: "Діагностика та рентген",
    desc: "Цифрова рентгенографія, КЛКТ, фотопротокол.",
    link: null,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Services() {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Послуги</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-3 gold-line-center">
            Повний спектр<br />стоматологічних послуг
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {services.map(({ icon: Icon, title, desc, tag, link }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              onClick={() => link && navigate(link)}
              className={`bg-card rounded-2xl p-7 border border-border shadow-card-custom
                         hover:shadow-xl hover:-translate-y-2 
                         transition-all duration-300 group relative overflow-hidden
                         ${link ? "cursor-pointer" : ""}`}
            >
              {tag && (
                <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              )}

              <div className="w-12 h-12 rounded-xl bg-navy/5 group-hover:bg-gold/10 transition-colors flex items-center justify-center mb-5">
                <Icon size={22} className="text-custom-dark group-hover:text-gold transition-colors" />
              </div>

              <h3 className="font-semibold text-xl mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{desc}</p>

              {link && (
                <span className="text-gold font-body text-sm font-semibold group-hover:underline">
                  Детальніше →
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="tel:+380504800825"
            className="mt-5 inline-flex items-center gap-2 gradient-gold text-accent-foreground px-5 py-2.5 rounded-full font-body font-semibold text-sm shadow-gold-custom hover:opacity-90 transition-opacity"
          >
            Записатися на консультацію
          </a>
        </motion.div>
      </div>
    </section>
  );
}