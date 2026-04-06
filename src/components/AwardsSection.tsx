import award1 from "@/assets/award1.webp";
import award2 from "@/assets/award2.webp";
import award3 from "@/assets/award3.webp";
import { generateImageUrl } from "@/lib/imageOptimization";
import { useLang } from "@/contexts/LanguageContext";

const awardYears = ["2025", "2023", "2022"];
const awardImages = [award1, award3, award2];

export default function AwardsSection() {
  const { t } = useLang();

  return (
    <section id="awards" className="py-24">
      <div className="container mx-auto px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("awards.label")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">{t("awards.h2")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {awardYears.map((year, i) => (
              <div
                key={year}
                className="flex flex-col items-center bg-cream-dark rounded-2xl px-10 pt-8 pb-7 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-55 h-66 rounded-xl overflow-hidden mb-6 shadow">
                  <picture>
                    <source srcSet={generateImageUrl(awardImages[i], { width: 440, height: 520, quality: 80 })} type="image/webp" />
                    <img
                      src={generateImageUrl(awardImages[i], { width: 440, height: 520, quality: 82 })}
                      alt={`${t("awards.title")} Dentis ${year}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={440}
                      height={520}
                    />
                  </picture>
                </div>
                <span className="text-[18px] uppercase bg-gold/10 text-gold px-2.5 py-1 rounded-full">{year}</span>
                <h3 className="text-[18px] font-bolt text-center mb-1 leading-snug gold-line-center">{t("awards.title")}</h3>
                <p className="text-[14px] text-foreground text-center leading-relaxed">{t("awards.issuer")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
