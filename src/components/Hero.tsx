import { Phone } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import { useEffect, useRef } from "react";

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      video.playbackRate = 0.8;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Фіксований фон з відео */}
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

      {/* Контент, який буде прокручуватися */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-2xl">
          <p className="text-sm tracking-[0.3em] uppercase mb-5 animate-fade-up font-sans font-normal text-gold">
            стоматологія у · м.Кропивницький
          </p>

          <h1 className="text-5xl md:text-6xl leading-tight mb-6 animate-fade-up delay-100 font-sans font-extralight lg:text-6xl text-secondary">
            Посмішка, що
            <br />
            <em className="not-italic text-gold">надихає</em>
          </h1>

          <p className="text-lg leading-relaxed max-w-lg mb-10 animate-fade-up delay-200 font-sans font-extralight text-secondary">
            Сучасна стоматологія з індивідуальним підходом до кожного пацієнта.
            Комфорт, безпека та бездоганний результат — наш стандарт.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
            <a
              href="tel:+380504800825"
              className="flex items-center justify-center gap-3 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-body font-semibold text-base shadow-gold-custom hover:opacity-90 transition-opacity duration-200"
            >
              <Phone size={18} />
              Записатися на консультацію
            </a>
            <button
              onClick={() => handleScroll("#services")}
              className="flex items-center justify-center gap-2 border border-gold-light/80 text-gold-light hover:bg-gold hover:border-gold hover:text-secondary px-8 py-4 rounded-full font-body font-medium text-base transition-all duration-200"
            >
              Наші послуги
            </button>
          </div>

          <div className="flex gap-10 mt-14 animate-fade-up delay-400">
            {[
              { num: "15+", label: "Років досвіду" },
              { num: "1000+", label: "Пацієнтів" },
              { num: "98%", label: "Задоволені клієнти" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-gold">{stat.num}</div>
                <div className="font-body text-xs text-primary-foreground/60 tracking-wide mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Нижній градієнтний фейд (теж фіксований відносно секції, якщо потрібно) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}