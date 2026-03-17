import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@assets/logo-white.webp";
import logogold from "@assets/logo-gold.webp";

const navLinks = [
  { label: "Про нас", href: "#about", isHash: true },
  { label: "Послуги", href: "#services", isHash: true },
  { label: "Лікарі", href: "#doctors", isHash: true },
  { label: "Акції", href: "#news", isHash: true },
  { label: "Блог", href: "/blog", isHash: false },
  { label: "Контакти", href: "/contacts", isHash: false },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string, isHash: boolean) => {
    setMobileOpen(false);
    if (!isHash) {
      navigate(href);
      return;
    }
    // If not on homepage, navigate home then scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-navy shadow-nav opacity-95 py-3" : "bg-transparent opacity-95 py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="h-20 rounded-2xl shadow-2xl">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center leading-none"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Dentis Logo White"
                width={300}
                height={100}
                fetchPriority="high"
                className="h-20 w-auto block transition-opacity duration-300 ease-out group-hover:opacity-0"
              />
              <img
                src={logogold}
                alt="Dentis Logo Gold"
                width={300}
                height={100}
                loading="lazy"
                className="h-20 w-auto block absolute top-0 left-0 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100"
              />
            </div>
          </a>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href, link.isHash)}
              className="text-primary-foreground hover:text-gold text-2xl font-body font-sans-serif tracking-wide transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA phone */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+380504800825"
            className="flex items-center gap-2 gradient-gold hover:bg-gold-dark text-accent-foreground px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 shadow-gold-custom"
          >
            <Phone size={14} />
            <span>+38 050 480 0825</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy opacity-95 border-t border-navy-light/30 px-4 pt-4 pb-6 flex flex-col gap-4 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href, link.isHash)}
              className="text-primary-foreground/80 hover:text-gold text-lg text-base font-body font-medium text-left py-1 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:+380504800825"
            className="flex items-center gap-2 bg-gold text-accent-foreground px-4 py-2.5 rounded-full text-sm font-medium w-fit mt-2"
          >
            <Phone size={14} />
            <span>+38 050 480 0825</span>
          </a>
        </div>
      )}
    </header>
  );
}