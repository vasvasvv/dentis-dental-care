import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={t("scrolltop.aria")}
      className={`fixed bottom-24 right-5 z-50 md:bottom-8 md:right-8 w-11 h-11 rounded-full gradient-gold text-accent-foreground flex items-center justify-center shadow-gold-custom transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
