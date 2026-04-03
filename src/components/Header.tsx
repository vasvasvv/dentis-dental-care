import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, Menu, Phone, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@assets/logo-white.webp";
import logogold from "@assets/logo-gold.webp";
import { useLang } from "@/contexts/LanguageContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, localizePath, toggleLang, t } = useLang();
  const menuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!mobileOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [mobileOpen]);

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
      ref={menuRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy/95 backdrop-blur-lg shadow-nav" : "bg-navy/85"
      }`}
    >
      <div className="border-b border-primary-foreground/15">
        <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-2 text-xs text-primary-foreground sm:text-sm">
          <a href="tel:+380504800825" className="inline-flex items-center gap-2 transition-colors hover:text-gold">
            <Phone size={14} />
            +38 (050) 480 08 25
          </a>

          <a
            href="#contacts"
            onClick={(event) => {
              event.preventDefault();
              handleNav("#contacts", true);
            }}
            className="btn-primary px-4 py-2 text-sm"
          >
            <CalendarCheck2 size={14} /> {t("hero.cta")}
          </a>
        </div>
      </div>

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
          <img src={logo} alt="Dentis Logo White" className="block h-14 w-auto transition-opacity duration-300 group-hover:opacity-0" />
          <img src={logogold} alt="Dentis Logo Gold" className="absolute left-0 top-0 h-14 w-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

        <button
          type="button"
          className="p-2 text-primary-foreground md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-navy-light/30 bg-navy/95 px-4 pb-5 pt-3 md:hidden">
          <div className="mb-3">
            <button
              type="button"
              onClick={() => {
                toggleLang();
                setMobileOpen(false);
              }}
              className="rounded-full border border-primary-foreground/30 px-3 py-1.5 text-primary-foreground hover:text-gold"
            >
              <span className={lang === "uk" ? "text-gold" : "opacity-50"}>UA</span>
              <span className="mx-1 opacity-40">/</span>
              <span className={lang === "en" ? "text-gold" : "opacity-50"}>EN</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href, link.isHash)}
                className="py-1 text-left text-base text-primary-foreground/90 hover:text-gold"
              >
                {t(link.labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
