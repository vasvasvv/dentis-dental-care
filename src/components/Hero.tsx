import { Phone } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import { useEffect, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLang();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      video.playbackRate = 0.99;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/hero-poster.webp"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase mb-5 animate-fade-up font-sans font-normal text-gold">
            {t("hero.city")}
          </p>

          <h1 className="font-sans font-extralight text-secondary
                         text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                         leading-[1.05] tracking-[-0.01em]
                         mb-4 sm:mb-6 md:mb-8 drop-shadow-sm">
            {t("hero.h1")}
            <br />
            <em className="block not-italic
                           text-[0.68em] sm:text-[0.7em]
                           leading-[1.1]
                           tracking-[0.08em] sm:tracking-[0.1em]
                           text-gold mt-1 sm:mt-2 drop-shadow-sm">
              {t("hero.h1em")}
            </em>
          </h1>

          <p className="text-lg leading-relaxed max-w-lg mb-10 animate-fade-up delay-200 font-sans font-extralight text-secondary">
            {t("hero.desc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
            <a
              href="tel:+380504800825"
              className="flex items-center justify-center gap-3 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity duration-200"
            >
              <Phone size={18} />
              {t("hero.cta")}
            </a>
            <button
              onClick={() => handleScroll("#services")}
              className="flex items-center justify-center gap-2 border border-gold-light/80 text-gold-light hover:bg-gold hover:border-gold hover:text-secondary px-8 py-4 rounded-full font-body font-medium text-base transition-all duration-200"
            >
              {t("hero.services")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
