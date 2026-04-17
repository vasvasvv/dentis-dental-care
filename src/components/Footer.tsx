import { Mail, MapPin, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@assets/logo-white.webp";
import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { localizePath, t } = useLang();
  const homePath = localizePath("/");

  const handleNav = (href: string, isHash: boolean) => {
    if (!isHash) {
      navigate(href);
      return;
    }

    if (location.pathname !== homePath) {
      navigate(homePath);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { href: "#about", labelKey: "nav.about", isHash: true },
    { href: "#services", labelKey: "nav.services", isHash: true },
    { href: "#doctors", labelKey: "nav.doctors", isHash: true },
    { href: "#news", labelKey: "footer.news", isHash: true },
    { href: "#reviews", labelKey: "footer.reviews", isHash: true },
    { href: localizePath("/contacts"), labelKey: "nav.contacts", isHash: false },
  ];

  return (
    <footer className="border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid items-start gap-10 md:grid-cols-3">
          <div>
            <a
              href={homePath}
              className="flex items-center leading-none"
              onClick={(event) => {
                event.preventDefault();
                navigate(homePath);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src={logo}
                alt="Дентіс Logo"
                width={300}
                height={100}
                loading="lazy"
                className="h-20 w-auto brightness-125 opacity-95 transition-opacity duration-500 hover:opacity-100"
              />
            </a>
            <p className="font-body text-sm leading-relaxed text-primary-foreground/50">{t("footer.tagline")}</p>
          </div>

          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-primary-foreground/40">{t("footer.nav")}</p>
            <nav className="flex flex-col gap-2.5">
              {navItems.map(({ href, labelKey, isHash }) => (
                <button
                  key={href}
                  onClick={() => handleNav(href, isHash)}
                  className="text-left font-body text-sm text-primary-foreground/60 transition-colors hover:text-gold"
                >
                  {t(labelKey)}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-widest text-primary-foreground/60">{t("footer.contacts")}</p>
            <div className="space-y-3">
              <a href="tel:+380504800825" className="flex items-center gap-2.5 font-body text-sm text-primary-foreground/70 transition-colors hover:text-gold">
                <Phone size={14} /> +38 050 480 0825
              </a>
              <a href="mailto:dentis.verhovsky@gmail.com" className="flex items-center gap-2.5 font-body text-sm text-primary-foreground/70 transition-colors hover:text-gold">
                <Mail size={14} /> dentis.verhovsky@gmail.com
              </a>
              <div className="flex items-start gap-2.5 font-body text-sm text-primary-foreground/70">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>
                  {t("contacts.addr.value")}, {t("contacts.addr.sub")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold/70 pt-7 md:flex-row">
          <p className="font-body text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Дентіс. {t("footer.rights")}
          </p>
          <p className="font-body text-xs text-primary-foreground/60">Верховський Олександр Олександрович</p>
        </div>
      </div>
    </footer>
  );
}
