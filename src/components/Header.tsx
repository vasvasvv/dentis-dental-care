import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@assets/logo-white.webp";
import logogold from "@assets/logo-gold.webp";
import { useLang } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, localizePath, toggleLang, t } = useLang();
  const homePath = localizePath("/");

  const navLinks = [
    { labelKey: "nav.about", href: "#about", isHash: true },
    { labelKey: "nav.services", href: "#services", isHash: true },
    { labelKey: "nav.doctors", href: "#doctors", isHash: true },
    { labelKey: "nav.news", href: "#news", isHash: true },
    { labelKey: "nav.blog", href: localizePath("/blog"), isHash: false },
    { labelKey: "nav.contacts", href: localizePath("/contacts"), isHash: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string, isHash: boolean) => {
    setMobileOpen(false);

    if (!isHash) {
      navigate(href);
      return;
    }

    if (location.pathname !== homePath) {
      navigate(homePath);
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }

    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300  after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gold/70 after:to-transparent ${
        scrolled ? "bg-navy/70 backdrop-blur-xl shadow-nav" : "bg-navy/70 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a
          href={homePath}
          onClick={(event) => {
            event.preventDefault();
            navigate(homePath);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative"
        >
          <img src={logo} alt="Дентіс Logo White" className="block h-14 w-auto transition-opacity duration-300 group-hover:opacity-0" />
          <img src={logogold} alt="Дентіс Logo Gold" className="absolute left-0 top-0 h-14 w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href, link.isHash)}
              className="font-body text-base tracking-wide text-primary-foreground transition-colors duration-200 hover:text-gold"
            >
              {t(link.labelKey)}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={`Switch to ${lang === "uk" ? "English" : "Ukrainian"}`}
            className="rounded-full border border-primary-foreground/30 px-3 py-1.5 text-primary-foreground hover:text-gold"
          >
            <span className={lang === "uk" ? "text-gold" : "opacity-50"}>UA</span>
            <span className="mx-1 opacity-40">/</span>
            <span className={lang === "en" ? "text-gold" : "opacity-50"}>EN</span>
          </button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="rounded-full border border-primary-foreground/20 p-2 text-primary-foreground transition-colors hover:border-gold/60 hover:text-gold md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm border-l border-white/20 bg-navy/90 p-0 text-primary-foreground shadow-nav backdrop-blur-xl">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-full flex-col px-6 pb-8 pt-16">
              <button
                type="button"
                onClick={() => {
                  toggleLang();
                  setMobileOpen(false);
                }}
                className="mb-8 w-fit rounded-full border border-primary-foreground/25 px-3 py-1.5 text-primary-foreground transition-colors hover:border-gold/70 hover:text-gold"
              >
                <span className={lang === "uk" ? "text-gold" : "opacity-50"}>UA</span>
                <span className="mx-1 opacity-40">/</span>
                <span className={lang === "en" ? "text-gold" : "opacity-50"}>EN</span>
              </button>

              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href, link.isHash)}
                    className="animate-fade-up rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-base text-primary-foreground/90 backdrop-blur-md transition-all duration-200 hover:border-gold/50 hover:bg-white/15 hover:text-gold"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    {t(link.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
