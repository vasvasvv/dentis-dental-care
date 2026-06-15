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
    { question: "Коли вести дитину до стоматолога вперше?", answer: "Перший профілактичний візит бажано планувати після появи перших зубів або раніше, якщо є скарги. Це допомагає дитині звикнути до клініки без стресу." },
    { question: "Чи лікують молочні зуби?", answer: "Так. Молочні зуби важливі для прикусу, мовлення та здоров'я постійних зубів, тому карієс потрібно лікувати вчасно." },
    { question: "Скільки коштує дитяча стоматологія у Кропивницькому?", answer: "PLACEHOLDER: додати затверджений прайс. Вартість залежить від огляду, діагностики та обсягу лікування." },
  ],
  en: [
    { question: "When should a child first see a dentist?", answer: "The first preventive visit is best after the first teeth appear or earlier if there are concerns. It helps the child get used to the clinic calmly." },
    { question: "Do baby teeth need treatment?", answer: "Yes. Baby teeth affect bite, speech and permanent tooth health, so caries should be treated on time." },
    { question: "How much does children's dentistry cost in Kropyvnytskyi?", answer: "PLACEHOLDER: add approved price list. Cost depends on examination, diagnostics and treatment scope." },
  ],
};

const services = {
  uk: [
    "Адаптаційний прийом для дітей",
    "Профілактика карієсу молочних зубів",
    "Лікування карієсу у дітей",
    "PLACEHOLDER: додати перелік дитячих процедур",
  ],
  en: [
    "Adaptation visit for children",
    "Baby tooth caries prevention",
    "Children's caries treatment",
    "PLACEHOLDER: add pediatric treatment list",
  ],
};

export default function ChildDentistry() {
  const { lang, localizePath } = useLang();
  const faqItems = faq[lang];
  const description =
    lang === "uk"
      ? "Дитяча стоматологія у Кропивницькому: профілактика, лікування карієсу молочних зубів та комфортний адаптаційний прийом у Dentis."
      : "Children's dentistry in Kropyvnytskyi: prevention, baby tooth caries treatment and calm adaptation visits at Dentis.";

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/child-dentistry"
        title={{
          uk: "Дитяча стоматологія у Кропивницькому | Дентіс",
          en: "Children's Dentistry in Kropyvnytskyi | Dentis",
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <ServiceSchema id="child-dentistry-schema" name={lang === "uk" ? "Дитяча стоматологія" : "Children's dentistry"} description={description} image={toAbsoluteUrl("/og-image.jpg")} />
      <FaqSchema id="child-dentistry-faq" faqs={faqItems} />

      <Header />
      <section className="relative overflow-hidden bg-navy pb-24 pt-36">
        <div className="container relative z-10 mx-auto px-4">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Послуги" : "Services"}</p>
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Дитяча стоматологія" : "Children's dentistry"}</h1>
          <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">{description}</p>
          <a href={localizePath("/contacts")} className="btn-primary">
            <Phone size={18} />
            {lang === "uk" ? "Записати дитину" : "Book a child visit"}
          </a>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Дитячі послуги" : "Pediatric services"}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {services[lang].map((item) => (
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
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center">{lang === "uk" ? "Поширені питання про дитячу стоматологію" : "Common pediatric dentistry questions"}</h2>
          </div>
          <SeoAccordion items={faqItems} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
