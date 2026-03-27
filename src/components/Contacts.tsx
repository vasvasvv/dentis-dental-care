import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function Contacts() {
  const { t } = useLang();

  const items = [
    {
      icon: Phone,
      label: t("contacts.phone.label"),
      value: "+38 050 480 0825",
      href: "tel:+380504800825",
      sub: t("contacts.phone.sub"),
    },
    {
      icon: Mail,
      label: t("contacts.email.label"),
      value: "dentis.verhovsky@gmail.com",
      href: "mailto:dentis.verhovsky@gmail.com",
      sub: null,
    },
    {
      icon: MapPin,
      label: t("contacts.addr.label"),
      value: t("contacts.addr.value"),
      href: "https://maps.google.com/?q=Кропивницький+вулиця+Героїв-рятувальників+9",
      sub: t("contacts.addr.sub"),
    },
    {
      icon: Clock,
      label: t("contacts.hours.label"),
      value: t("contacts.hours.value"),
      href: null,
      sub: t("contacts.hours.sub"),
    },
  ];

  return (
    <section id="contacts" className="section-block site-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">
            {t("contacts.label")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy gold-line-center">
            {t("contacts.h2")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          <div className="space-y-7">
            {items.map(({ icon: Icon, label, value, href, sub }) => (
              <div key={label} className="flex gap-4">
                <div className="w-11 h-11 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-navy-custom">
                  <Icon size={18} className="text-accent-foreground" />
                </div>
                <div>
                  <p className="font-body text-navy/90 text-xs tracking-wider uppercase mb-1">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="font-body font-semibold text-navy hover:text-gold transition-colors text-base"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-body font-semibold text-navy text-base">{value}</p>
                  )}
                  {sub && <p className="font-body text-navy/60 text-sm mt-0.5">{sub}</p>}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <a
                href="tel:+380504800825"
                className="inline-flex items-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-primary-foreground px-8 py-3.5 rounded-full font-body font-semibold text-sm transition-all duration-200"
              >
                <Phone size={18} />
                {t("contacts.cta")}
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-card-custom h-80 lg:h-full min-h-[320px]">
            <iframe
              title="Dentis on map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.123456789!2d32.261234!3d48.501234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDMwJzA0LjQiTiAzMsKwMTUnNDEuNCJF!5e0!3m2!1suk!2sua!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
