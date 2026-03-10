import { Phone, Mail, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@assets/Dentis_with_Text.webp";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

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
                width={400}
                height={140}
                loading="lazy"
                className="h-24 w-auto brightness-125 opacity-80 hover:opacity-100 transition-opacity duration-500"
              />
            </a>
            <p className="font-body text-primary-foreground/50 text-sm leading-relaxed">
              Стоматологічна клініка у Кропивницькому. Ваша посмішка — наша гордість.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-body text-primary-foreground/40 text-xs tracking-widest uppercase mb-4">Навігація</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "#about", label: "Про нас", isHash: true },
                { href: "#services", label: "Послуги", isHash: true },
                { href: "#doctors", label: "Лікарі", isHash: true },
                { href: "#news", label: "Новини та акції", isHash: true },
                { href: "#reviews", label: "Відгуки", isHash: true },
                { href: "/contacts", label: "Контакти", isHash: false },
              ].map(({ href, label, isHash }) => (
                <button
                  key={href}
                  onClick={() => handleNav(href, isHash)}
                  className="font-body text-primary-foreground/60 hover:text-gold text-sm text-left transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-primary-foreground/60 text-xs tracking-widest uppercase mb-4">Контакти</p>
            <div className="space-y-3">
              <a href="tel:+380504800825" className="flex items-center gap-2.5 text-primary-foreground/70 hover:text-gold transition-colors text-sm font-body">
                <Phone size={14} /> +38 050 480 0825
              </a>
              <a href="mailto:dentis.verhovsky@gmail.com" className="flex items-center gap-2.5 text-primary-foreground/70 hover:text-gold transition-colors text-sm font-body">
                <Mail size={14} /> dentis.verhovsky@gmail.com
              </a>
              <div className="flex items-start gap-2.5 text-primary-foreground/70 text-sm font-body">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>вул. Героїв-рятувальників, 9 к.2, Кропивницький</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/70 mt-10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-primary-foreground/60 text-xs">
            © {new Date().getFullYear()} Дентіс. Всі права захищені.
          </p>
          <p className="font-body text-primary-foreground/60 text-xs">
            Головний лікар: Верховський Олександр Олександрович
          </p>
        </div>
      </div>
    </footer>
  );
}
