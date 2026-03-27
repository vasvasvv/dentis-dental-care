import { Award, Users, Clock, Shield } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLang();

  const values = [
    { icon: Award, titleKey: "about.v1title", descKey: "about.v1desc" },
    { icon: Users, titleKey: "about.v2title", descKey: "about.v2desc" },
    { icon: Clock, titleKey: "about.v3title", descKey: "about.v3desc" },
    { icon: Shield, titleKey: "about.v4title", descKey: "about.v4desc" },
  ];

  return (
    <section id="about" className="section-block site-section">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">
              {t("about.label")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6 gold-line">
              {t("about.h2a")}<br />
              <em className="not-italic text-navy">{t("about.h2b")}</em>
            </h2>
            <p className="font-body text-navy leading-relaxed mb-5">
              {t("about.p1")}
            </p>
            <p className="font-body text-navy leading-relaxed mb-8">
              {t("about.p2")}
            </p>
            <a
              href="tel:+380504800825"
              className="inline-flex items-center gap-2 gradient-gold text-accent-foreground px-7 py-3.5 rounded-full font-body font-semibold text-sm shadow-gold-custom hover:opacity-90 transition-opacity"
            >
              {t("about.cta")}
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="bg-card border border-border rounded-xl p-6 shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display font-semibold text-custom-dark text-lg mb-2">{t(titleKey)}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
