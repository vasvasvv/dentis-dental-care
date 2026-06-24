import { Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSeo from "@/components/SEO/PageSeo";
import FaqSchema from "@/components/SEO/FaqSchema";
import SeoAccordion from "@/components/SEO/SeoAccordion";
import JsonLdScript from "@/components/SEO/JsonLdScript";
import { useLang } from "@/contexts/LanguageContext";
import { buildCanonical } from "@/utils/seo";

const priceRows = {
  uk: [
    { service: "Консультація стоматолога", price: "За результатами огляду" },
    { service: "Лікування карієсу", price: "За результатами огляду" },
    { service: "Імплантація зубів", price: "За результатами огляду" },
    { service: "Протезування зубів", price: "За результатами огляду" },
    { service: "Професійна гігієна", price: "За результатами огляду" },
  ],
  en: [
    { service: "Dental consultation", price: "After examination" },
    { service: "Caries treatment", price: "After examination" },
    { service: "Dental implants", price: "After examination" },
    { service: "Dental prosthetics", price: "After examination" },
    { service: "Professional hygiene", price: "After examination" },
  ],
};

const faq = {
  uk: [
    { question: "Чому на сайті вказані placeholders?", answer: "Ціни потрібно уточнити у адміністратора клініки." },
    { question: "Від чого залежить вартість лікування зубів?", answer: "Вартість залежить від діагностики, складності випадку, матеріалів і обсягу роботи. Точний план лікар формує після огляду." },
    { question: "Чи можна отримати план лікування з цінами?", answer: "Так. Після консультації пацієнт отримує зрозумілий план лікування з етапами та орієнтиром вартості." },
  ],
  en: [
    { question: "Why does this page show placeholders?", answer: "Prices should be clarified with the clinic administrator." },
    { question: "What affects dental treatment cost?", answer: "Cost depends on diagnostics, case complexity, materials and scope. The dentist prepares an exact plan after examination." },
    { question: "Can I get a treatment plan with prices?", answer: "Yes. After consultation, the patient receives a clear treatment plan with stages and cost guidance." },
  ],
};

export default function Prices() {
  const { lang, localizePath } = useLang();
  const rows = priceRows[lang];
  const faqItems = faq[lang];
  const description =
    lang === "uk"
      ? "Прайс стоматології Dentis у Кропивницькому. Актуальні ціни на консультацію, лікування, імплантацію, протезування та гігієну."
      : "Dentis dental price list in Kropyvnytskyi. Current prices for consultation, treatment, implants, prosthetics and hygiene.";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/prices"
        title={{
          uk: "Ціни на стоматологію у Кропивницькому | Прайс Дентіс",
          en: "Dental Prices in Kropyvnytskyi | Dentis Price List",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <JsonLdScript
        id="prices-medical-webpage"
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: lang === "uk" ? "Ціни стоматології Dentis" : "Dentis dental prices",
          description,
          url: buildCanonical("/prices", lang),
        }}
      />
      <FaqSchema id="prices-faq" faqs={faqItems} />

      <Header />
      <section className="relative overflow-hidden bg-navy pb-24 pt-36">
        <div className="container relative z-10 mx-auto px-4">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Прайс" : "Price list"}</p>
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Ціни на стоматологію" : "Dental prices"}</h1>
          <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <a href={localizePath("/contacts")} className="btn-primary">
            <Phone size={18} />
            {lang === "uk" ? "Уточнити вартість" : "Ask about prices"}
          </a>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-custom">
            {rows.map((row) => (
              <div key={row.service} className="grid gap-2 border-b border-border px-6 py-5 last:border-b-0 sm:grid-cols-[1fr_auto]">
                <span className="font-display text-lg font-bold text-custom-dark">{row.service}</span>
                <span className="font-body text-sm text-muted-foreground">{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">SEO FAQ</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Питання про ціни" : "Price questions"}</h2>
          </div>
          <SeoAccordion items={faqItems} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
