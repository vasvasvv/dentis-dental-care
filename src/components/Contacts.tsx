import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { sendAppointmentRequest } from "@/lib/publicApi";

export default function Contacts() {
  const { t, lang } = useLang();
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formText = lang === "uk"
    ? {
        title: "Заявка на запис",
        description: "Залиште контакти, адміністратор передзвонить і погодить дату, час та лікаря.",
        name: "Ім'я та прізвище",
        phone: "Номер телефону",
        problem: "Проблема або що турбує",
        submit: "Записатися",
        sending: "Надсилаємо...",
        required: "Заповніть усі поля.",
        success: "Дякуємо, заявку надіслано. Адміністратор передзвонить вам.",
        error: "Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте.",
      }
    : {
        title: "Appointment request",
        description: "Leave your contacts and an administrator will call back to agree on the date, time and doctor.",
        name: "First and last name",
        phone: "Phone number",
        problem: "Problem or concern",
        submit: "Request appointment",
        sending: "Sending...",
        required: "Please fill in all fields.",
        success: "Thank you, your request has been sent. An administrator will call you back.",
        error: "Could not send the request. Please try again or call us.",
      };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!patientName.trim() || !phone.trim() || !problem.trim()) {
      setError(formText.required);
      return;
    }

    setSubmitting(true);
    try {
      await sendAppointmentRequest({
        patient_name: patientName.trim(),
        phone: phone.trim(),
        problem: problem.trim(),
      });
      setPatientName("");
      setPhone("");
      setProblem("");
      setSuccess(formText.success);
    } catch (err) {
      setError(err instanceof Error ? err.message : formText.error);
    } finally {
      setSubmitting(false);
    }
  };

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
      href: "https://maps.app.goo.gl/q3DVsPUwjhfwkRJW7",
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

          <form onSubmit={handleSubmit} className="rounded-lg border border-gold/25 bg-white p-6 shadow-card-custom">
            <h3 className="font-display text-2xl font-bold text-navy mb-2">{formText.title}</h3>
            <p className="font-body text-navy/70 text-sm mb-6">{formText.description}</p>

            <div className="space-y-4">
              <label className="block">
                <span className="font-body text-navy/90 text-xs tracking-wider uppercase mb-2 block">{formText.name}</span>
                <input
                  value={patientName}
                  onChange={(event) => setPatientName(event.target.value)}
                  autoComplete="name"
                  className="w-full h-12 rounded-lg border border-border bg-background px-4 font-body text-navy outline-none transition-colors focus:border-gold"
                  required
                />
              </label>

              <label className="block">
                <span className="font-body text-navy/90 text-xs tracking-wider uppercase mb-2 block">{formText.phone}</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full h-12 rounded-lg border border-border bg-background px-4 font-body text-navy outline-none transition-colors focus:border-gold"
                  required
                />
              </label>

              <label className="block">
                <span className="font-body text-navy/90 text-xs tracking-wider uppercase mb-2 block">{formText.problem}</span>
                <textarea
                  value={problem}
                  onChange={(event) => setProblem(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-navy outline-none transition-colors focus:border-gold"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-gold px-8 py-3.5 font-body font-semibold text-accent-foreground transition-all duration-200 hover:shadow-gold-custom disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send size={18} />
              {submitting ? formText.sending : formText.submit}
            </button>

            <div aria-live="polite" className="mt-4 min-h-5">
              {success && <p className="font-body text-sm font-semibold text-green-700">{success}</p>}
              {error && <p className="font-body text-sm font-semibold text-red-700">{error}</p>}
            </div>
          </form>
        </div>

        <div className="mt-12 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-card-custom h-80">
          <iframe
            title="Dentis on map"
            src="https://www.google.com/maps?q=48.5014697,32.2204513&hl=uk&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
