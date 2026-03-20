import { Phone, Mail, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@assets/logo-white.webp";
import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();

  const handleNav = (href: string, isHash: boolean) => {
    if (!isHash) {
      navigate(href);
      return;
    }
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

  const navItems = [
    { href: "#about", labelKey: "nav.about", isHash: true },
    { href: "#services", labelKey: "nav.services", isHash: true },
    { href: "#doctors", labelKey: "nav.doctors", isHash: true },
    { href: "#news", labelKey: "footer.news", isHash: true },
    { href: "#reviews", labelKey: "footer.reviews", isHash: true },
    { href: "/contacts", labelKey: "nav.contacts", isHash: false },
  ];

  return (
    <footer className="border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div>
            <a
              href="/"
              className="flex items-center leading-none"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src={logo}
                alt="Dentis Logo"
                width={300}
                height={100}
                loading="lazy"
                className="h-20 w-auto brightness-125 opacity-95 hover:opacity-100 transition-opacity duration-500"
              />
            </a>
            <p className="font-body text-primary-foreground/50 text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-body text-primary-foreground/40 text-xs tracking-widest uppercase mb-4">
              {t("footer.nav")}
            </p>
            <nav className="flex flex-col gap-2.5">
              {navItems.map(({ href, labelKey, isHash }) => (
                <button
                  key={href}
                  onClick={() => handleNav(href, isHash)}
                  className="font-body text-primary-foreground/60 hover:text-gold text-sm text-left transition-colors"
                >
                  {t(labelKey)}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-primary-foreground/60 text-xs tracking-widest uppercase mb-4">
              {t("footer.contacts")}
            </p>
            <div className="space-y-3">
              <a href="tel:+380504800825" className="flex items-center gap-2.5 text-primary-foreground/70 hover:text-gold transition-colors text-sm font-body">
                <Phone size={14} /> +38 050 480 0825
              </a>
              <a href="mailto:dentis.verhovsky@gmail.com" className="flex items-center gap-2.5 text-primary-foreground/70 hover:text-gold transition-colors text-sm font-body">
                <Mail size={14} /> dentis.verhovsky@gmail.com
              </a>
              <div className="flex items-start gap-2.5 text-primary-foreground/70 text-sm font-body">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{t("contacts.addr.value")}, {t("contacts.addr.sub")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/70 mt-10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-primary-foreground/60 text-xs">
            © {new Date().getFullYear()} Дентіс. {t("footer.rights")}
          </p>
          <p className="font-body text-primary-foreground/60 text-xs">
            Верховський Олександр Олександрович
          </p>
        </div>
      </div>
    </footer>
  );
}
