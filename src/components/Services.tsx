import { motion } from "framer-motion";
import { Smile, Zap, Layers, Sparkles, HeartPulse, ScanLine, Crown } from "lucide-react";
import { Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Services() {
  const navigate = useNavigate();
  const { t } = useLang();

  const services = [
    { icon: Smile, titleKey: "services.s1title", descKey: "services.s1desc", tagKey: "services.s1tag", link: "/likuvannya-kariesu", featured: false },
    { icon: Sparkles, titleKey: "services.s2title", descKey: "services.s2desc", tagKey: null, link: "/estetychna-stomatolohiya", featured: true },
    { icon: Layers, titleKey: "services.s3title", descKey: "services.s3desc", tagKey: null, link: "/protezuvannya", featured: false },
    { icon: Zap, titleKey: "services.s4title", descKey: "services.s4desc", tagKey: null, link: "/implantaciya", featured: false },
    { icon: HeartPulse, titleKey: "services.s5title", descKey: "services.s5desc", tagKey: null, link: "/profesijne-ochischennya", featured: false },
    { icon: ScanLine, titleKey: "services.s6title", descKey: "services.s6desc", tagKey: null, link: "/diagnostika-zubiv", featured: false },
  ];

  return (
    <section id="services" className="section-block bg-background">
      <div className="container mx-auto px-4">
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("services.label")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-3 gold-line-center">
            {t("services.h2a")}<br />{t("services.h2b")}
          </h2>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map(({ icon: Icon, titleKey, descKey, tagKey, link, featured }) => (
            <motion.div
              key={titleKey}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -6 }}
              onClick={() => navigate(link)}
              className={`rounded-2xl p-7 border shadow-card-custom transition-all duration-300 group relative overflow-hidden cursor-pointer ${
                featured
                  ? "bg-gradient-to-br from-navy to-navy-light text-primary-foreground border-gold/40 shadow-gold-custom"
                  : "bg-card border-border hover:shadow-xl"
              }`}
            >
              {featured && (
                <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold text-accent-foreground px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                  <Crown size={11} /> Featured
                </span>
              )}
              {tagKey && !featured && (
                <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold/15 text-gold px-2.5 py-1 rounded-full">{t(tagKey)}</span>
              )}
              <div className={`w-12 h-12 rounded-xl transition-colors flex items-center justify-center mb-5 ${featured ? "bg-primary-foreground/10" : "bg-navy/5 group-hover:bg-gold/10"}`}>
                <Icon size={22} className={`${featured ? "text-gold" : "text-custom-dark group-hover:text-gold"} transition-colors`} />
              </div>
              <h3 className="font-semibold text-xl mb-3">{t(titleKey)}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t(descKey)}</p>
              <span className="text-gold font-body text-sm font-semibold inline-block group-hover:translate-y-0.5 transition-transform">{t("services.more")} →</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
