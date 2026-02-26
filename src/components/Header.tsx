import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";
import logo from "@assets/Dentis_with_Text.avif"

const navLinks = [
{ label: "Про нас", href: "#about" },
{ label: "Послуги", href: "#services" },
{ label: "Лікарі", href: "#doctors" },
{ label: "Акції", href: "#news" },
{ label: "Відгуки", href: "#reviews" },
{ label: "Контакти", href: "#contacts" }];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ?
      "bg-navy shadow-nav opacity-95 py-3" :
      "bg-transparent opacity-95 py-5"}`
      }>

      <div className="container mx-auto px-4 flex items-center justify-between">
        <a
          href="#"
          className="flex items-center leading-none"
          onClick={(e) => {e.preventDefault();window.scrollTo({ top: 0, behavior: "smooth" });}}>
          <img
            rel="preload"
            src={logo}
            alt="Dentis Logo"
            className="h-20 w-auto brightness-100 opacity-90 hover:opacity-100 transition-opacity duration-200"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) =>
          <button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className="text-primary-foreground hover:text-gold text-xl font-body font-sans-serif tracking-wide transition-colors duration-200">

              {link.label}
            </button>
          )}
        </nav>

        {/* CTA phone */}
        <a
          href="tel:+380504800825"
          className="hidden md:flex items-center gap-2 gradient-gold hover:bg-gold-dark text-accent-foreground px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 shadow-gold-custom">

          <Phone size={14} />
          <span>+38 050 480 0825</span>
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню">

          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen &&
      <div className="md:hidden bg-navy opacity-95 border-t border-navy-light/30 px-4 pt-4 pb-6 flex flex-col gap-4 animate-fade-in">
          {navLinks.map((link) =>
        <button
          key={link.href}
          onClick={() => handleNav(link.href)}
          className="text-primary-foreground/80 hover:text-gold text-lg text-base font-body font-medium text-left py-1 transition-colors">

              {link.label}
            </button>
        )}
          <a
          href="tel:+380504800825"
          className="flex items-center gap-2 bg-gold text-accent-foreground px-4 py-2.5 rounded-full text-sm font-medium w-fit mt-2">

            <Phone size={14} />
            <span>+38 050 480 0825</span>
          </a>
        </div>
      }
      
    </header>);

}