import { CheckCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSeo from "@/components/SEO/PageSeo";
import FaqSchema from "@/components/SEO/FaqSchema";
import SeoAccordion from "@/components/SEO/SeoAccordion";
import ServiceSchema from "@/components/SEO/ServiceSchema";
import { useLang } from "@/contexts/LanguageContext";
import { toAbsoluteUrl } from "@/utils/seo";

const faq = {
  uk: [
    { question: "Скільки коштують брекети у Кропивницькому?", answer: "PLACEHOLDER: додати актуальні ціни після затвердження прайсу. Остаточна вартість залежить від системи, складності прикусу та тривалості лікування." },
    { question: "Коли потрібна консультація ортодонта?", answer: "Якщо є скупченість зубів, проміжки, неправильний прикус або дискомфорт під час жування, варто пройти ортодонтичну діагностику в Кропивницькому." },
    { question: "Чи можна вирівняти прикус дорослим?", answer: "Так. Ортодонтичне лікування можливе у дорослому віці після діагностики стану зубів, ясен і кісткової тканини." },
  ],
  en: [
    { question: "How much do braces cost in Kropyvnytskyi?", answer: "PLACEHOLDER: add approved price list. Final cost depends on the system, bite complexity and treatment duration." },
    { question: "When should I see an orthodontist?", answer: "If teeth are crowded, spaced, bite feels uneven or chewing is uncomfortable, orthodontic diagnostics in Kropyvnytskyi can clarify the plan." },
    { question: "Can adults correct their bite?", answer: "Yes. Adult orthodontic treatment is possible after diagnostics of teeth, gums and bone condition." },
  ],
};

const benefits = {
  uk: [
    "PLACEHOLDER: перелік доступних брекет-систем",
    "Діагностика прикусу та план лікування",
    "Контроль гігієни під час ортодонтичного лікування",
    "Локальна консультація у стоматології на вул. Героїв-рятувальників",
  ],
  en: [
    "PLACEHOLDER: list of available braces systems",
    "Bite diagnostics and treatment plan",
    "Hygiene control during orthodontic treatment",
    "Local consultation at Heroiv-Ryatuvalnykiv Street",
  ],
};

export default function Orthodontics() {
  const { lang, localizePath } = useLang();
  const faqItems = faq[lang];
  const description =
    lang === "uk"
      ? "Ортодонтія у Кропивницькому: брекети, вирівнювання прикусу та консультація стоматолога-ортодонта у Dentis."
      : "Orthodontics in Kropyvnytskyi: braces, bite correction and orthodontic consultation at Dentis.";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/orthodontics"
        title={{
          uk: "Ортодонтія у Кропивницькому — брекети та вирівнювання прикусу | Дентіс",
          en: "Orthodontics in Kropyvnytskyi — Braces and Bite Correction | Dentis",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema id="orthodontics-schema" name={lang === "uk" ? "Ортодонтія" : "Orthodontics"} description={description} image={toAbsoluteUrl("/og-image.jpg")} />
      <FaqSchema id="orthodontics-faq" faqs={faqItems} />

      <Header />
      <section className="relative overflow-hidden bg-navy pb-24 pt-36">
        <div className="container relative z-10 mx-auto px-4">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Послуги" : "Services"}</p>
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Ортодонтія та брекети" : "Orthodontics and braces"}</h1>
          <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <a href={localizePath("/contacts")} className="btn-primary">
            <Phone size={18} />
            {lang === "uk" ? "Записатися на консультацію" : "Book consultation"}
          </a>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Що входить у напрям" : "What is included"}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits[lang].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">SEO FAQ</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Поширені питання про ортодонтію" : "Common orthodontic questions"}</h2>
          </div>
          <SeoAccordion items={faqItems} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
