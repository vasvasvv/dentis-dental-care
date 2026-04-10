import { useState } from "react";
import type { FC } from "react";
import { ScanLine } from "lucide-react";
import FaqSchema from "@/components/SEO/FaqSchema";
import { useLang } from "@/contexts/LanguageContext";

interface FaqItem {
  icon: typeof ScanLine;
  questionKey: string;
  answerKey: string;
  question: string;
  answer: string;
}

// Статичні FAQ дані у двох мовах для гарантованої SSG генерації FAQPage schema
const FAQ_DATA: Record<string, FaqItem[]> = {
  uk: [
    {
      icon: ScanLine,
      questionKey: "faq.q1",
      answerKey: "faq.a1",
      question: "Скільки коштує лікування зубів у Dentis?",
      answer: "Вартість лікування залежить від складності випадку та обраного методу. Остаточну ціну лікар визначає після огляду.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q2",
      answerKey: "faq.a2",
      question: "Чи боляче лікувати зуби?",
      answer: "Сучасна анестезія робить процес лікування повністю безболісним. Ми використовуємо високоякісні препарати та новітні методи.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q3",
      answerKey: "faq.a3",
      question: "Як часто потрібно ходити до стоматолога?",
      answer: "Рекомендується відвідувати стоматолога один раз на 6 місяців для профілактичного огляду та професійної гігієни.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q4",
      answerKey: "faq.a4",
      question: "Скільки триває імплантація зуба?",
      answer: "Процес імплантації займає 3-6 місяців залежно від кількості та складності імплантів. Сам хірургічний етап — 30-60 хвилин.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q5",
      answerKey: "faq.a5",
      question: "Яку гарантію ви надаєте на імпланти?",
      answer: "Ми надаємо гарантію на імпланти від 5 років. Детальні умови гарантії можна уточнити під час консультації.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q6",
      answerKey: "faq.a6",
      question: "Чи можна установити протез при алергії на метал?",
      answer: "Так, ми використовуємо гіпоалергенні матеріали та безметалеві протези для пацієнтів з алергією.",
    },
  ],
  en: [
    {
      icon: ScanLine,
      questionKey: "faq.q1",
      answerKey: "faq.a1",
      question: "How much does dental treatment cost at Dentis?",
      answer: "The cost depends on the complexity of the case and the chosen method. The final price is determined by the doctor after examination.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q2",
      answerKey: "faq.a2",
      question: "Is dental treatment painful?",
      answer: "Modern anesthesia makes the treatment process completely painless. We use high-quality drugs and advanced methods.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q3",
      answerKey: "faq.a3",
      question: "How often should I visit the dentist?",
      answer: "It is recommended to visit a dentist once every 6 months for a preventive check-up and professional cleaning.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q4",
      answerKey: "faq.a4",
      question: "How long does tooth implantation take?",
      answer: "The implantation process takes 3-6 months depending on the number and complexity of implants. The surgical stage itself is 30-60 minutes.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q5",
      answerKey: "faq.a5",
      question: "What warranty do you provide for implants?",
      answer: "We provide a warranty on implants from 5 years. Detailed warranty conditions can be clarified during consultation.",
    },
    {
      icon: ScanLine,
      questionKey: "faq.q6",
      answerKey: "faq.a6",
      question: "Can a denture be installed if I'm allergic to metal?",
      answer: "Yes, we use hypoallergenic materials and metal-free dentures for patients with allergies.",
    },
  ],
};

const Faq: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { lang, t } = useLang();

  // Отримуємо FAQ дані для поточної мови
  const faqItems = FAQ_DATA[lang] || FAQ_DATA.uk;

  // Передаємо в schema реальні текстові значення для правильної FAQPage генерації
  const schemaFaqs = faqItems.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
      <FaqSchema id="homepage-faq" faqs={schemaFaqs} />

      <section className="faq max-w-[900px] mx-auto px-5 section-block">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-m tracking-[0.3em] uppercase font-medium mb-3">{t("faq.label")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">{t("faq.h2")}</h2>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-1 text-center gap-6">
          {faqItems.map((item, index) => (
            <details
              key={item.questionKey}
              className={`bg-card border border-border border-gold rounded-2xl p-1 shadow-gold-custom text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${openIndex === index ? "open" : ""}`}
              open={openIndex === index}
              onChange={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <summary className="bg-card flex items-center justify-between cursor-pointer py-5 text-lg text-center md:text-xl font-semibold text-[#2b6f73] hover:text-[#1e5559] transition-colors duration-300">
                <span className="w-12 h-12 rounded-xl bg-gold/20 group-hover:bg-gold/10 transition-colors inline-flex items-center justify-center shrink-0">
                  <item.icon className="text-gold hover:text-navy transition-colors" />
                </span>
                <span className="mx-4 flex-1">{item.question}</span>
                <span className="text-2xl text-center font-bold transition-transform duration-300 group-open:rotate-180">
                  <span className="w-12 h-12 rounded-xl bg-navy/20 group-hover:bg-navy/10 transition-colors inline-flex items-center justify-center shrink-0">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </span>
              </summary>
              <div className="pb-6 pt-3 text-center text-normal md:text-lg text-navy leading-relaxed">{item.answer}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
};

export default Faq;
