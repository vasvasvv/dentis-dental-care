import { useState, useEffect, useRef } from "react";
import { Phone, Menu, X, CalendarCheck2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@assets/logo-white.webp";
import logogold from "@assets/logo-gold.webp";
import { useLang } from "@/contexts/LanguageContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang, t } = useLang();
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { labelKey: "nav.about", href: "#about", isHash: true },
    { labelKey: "nav.services", href: "#services", isHash: true },
    { labelKey: "nav.doctors", href: "#doctors", isHash: true },
    { labelKey: "nav.news", href: "#news", isHash: true },
    { labelKey: "nav.blog", href: "/blog", isHash: false },
    { labelKey: "nav.contacts", href: "/contacts", isHash: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMobileOpen(false);
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
    if (!isHash) return navigate(href);
    if (location.pathname !== "/") {
      navigate("/");
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
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm text-primary-foreground">
          <a href="tel:+380504800825" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
            <Phone size={14} />
            +38 (050) 480 08 25
          </a>
          <a
            href="#contacts"
            onClick={(e) => {
              e.preventDefault();
              handleNav("#contacts", true);
            }}
            className="inline-flex items-center gap-2 gradient-gold text-accent-foreground px-3 py-1.5 rounded-full font-semibold"
          >
            <CalendarCheck2 size={14} /> {t("hero.cta")}
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group relative"
        >
          <img src={logo} alt="Dentis Logo White" className="h-14 w-auto block transition-opacity duration-300 group-hover:opacity-0" />
          <img src={logogold} alt="Dentis Logo Gold" className="h-14 w-auto absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href, link.isHash)}
              className="text-primary-foreground hover:text-gold text-base font-body tracking-wide transition-colors duration-200"
            >
              {t(link.labelKey)}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLang}
            aria-label={`Switch to ${lang === "uk" ? "English" : "Українська"}`}
            className="px-3 py-1.5 rounded-full border border-primary-foreground/30 text-primary-foreground hover:text-gold"
          >
            <span className={lang === "uk" ? "text-gold" : "opacity-50"}>UA</span>
            <span className="mx-1 opacity-40">/</span>
            <span className={lang === "en" ? "text-gold" : "opacity-50"}>EN</span>
          </button>
        </div>

        <button className="md:hidden text-primary-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Меню">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy/95 border-t border-navy-light/30 px-4 pt-3 pb-5 flex flex-col gap-3 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href, link.isHash)}
              className="text-primary-foreground/90 hover:text-gold text-base text-left py-1"
            >
              {t(link.labelKey)}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
