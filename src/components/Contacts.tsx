import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contacts() {
  return (
    <section id="contacts" className="py-24 bg-cream-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Контакти</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy gold-line-center">
            Зв'яжіться з нами
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-7">
            {[
              {
                icon: Phone,
                label: "Телефон для запису",
                value: "+38 050 480 0825",
                href: "tel:+380504800825",
                sub: "Дзвінки приймаємо щодня",
              },
              {
                icon: Mail,
                label: "Електронна пошта",
                value: "dentis.verhovsky@gmail.com",
                href: "mailto:dentis.verhovsky@gmail.com",
                sub: null,
              },
              {
                icon: MapPin,
                label: "Адреса клініки",
                value: "вул. Героїв-рятувальників, 9, корп. 2",
                href: "https://maps.google.com/?q=Кропивницький+вулиця+Героїв-рятувальників+9",
                sub: "Кропивницький, Україна, 25000",
              },
              {
                icon: Clock,
                label: "Графік роботи",
                value: "Пн–Пт: 9:00 – 19:00",
                href: null,
                sub: "Сб: 9:00 – 15:00",
              },
            ].map(({ icon: Icon, label, value, href, sub }) => (
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
                Записатися за дзвінком
              </a>
            </div>
          </div>

          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden border border-primary-foreground/10 shadow-lg h-80 lg:h-full min-h-72">
            <iframe
              title="Карта клініки Дентіс"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.656772483319!2d32.21787637667696!3d48.501473225757316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d043f27017c63f%3A0x154da7cabb6e9d5c!2z0JTQtdC90YLQuNGB!5e0!3m2!1suk!2sua!4v1760328933472!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "288px" }}
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
