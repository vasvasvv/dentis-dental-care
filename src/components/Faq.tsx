import { useState } from "react";
import type { FC } from "react";
import { ScanLine } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const Faq: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLang();

  const faqItems = [
    { icon: ScanLine, questionKey: "faq.q1", answerKey: "faq.a1" },
    { icon: ScanLine, questionKey: "faq.q2", answerKey: "faq.a2" },
    { icon: ScanLine, questionKey: "faq.q3", answerKey: "faq.a3" },
    { icon: ScanLine, questionKey: "faq.q4", answerKey: "faq.a4" },
    { icon: ScanLine, questionKey: "faq.q5", answerKey: "faq.a5" },
    { icon: ScanLine, questionKey: "faq.q6", answerKey: "faq.a6" },
  ];

  return (
    <section className="faq max-w-[900px] mx-auto px-5 py-20 md:py-24 lg:py-[80px]">
      <div className="text-center mb-14">
        <p className="text-gold font-body text-m tracking-[0.3em] uppercase font-medium mb-3">
          {t("faq.label")}
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
          {t("faq.h2")}
        </h2>
      </div>

      <div className="grid sm:grid-cols-1 lg:grid-cols-1 text-center gap-6">
        {faqItems.map((item, index) => (
          <details
            key={index}
            className={`bg-card border border-border border-gold rounded-2xl p-1 shadow-gold-custom text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${openIndex === index ? "open" : ""}`}
            open={openIndex === index}
            onChange={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <summary className="bg-card flex items-center justify-between cursor-pointer py-5 text-lg text-center md:text-xl font-semibold text-[#2b6f73] hover:text-[#1e5559] transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold/20 group-hover:bg-gold/10 transition-colors flex items-center justify-center">
                {item.icon && <item.icon className="text-gold hover:text-navy transition-colors" />}
              </div>
              {t(item.questionKey)}
              <span className="ml-4 text-2xl text-center font-bold transition-transform duration-300 group-open:rotate-180">
                <div className="w-12 h-12 rounded-xl bg-navy/20 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                  {openIndex === index ? "−" : "+"}
                </div>
              </span>
            </summary>
            <div className="pb-6 pt-3 text-center text-normal md:text-lg text-navy leading-relaxed">
              {t(item.answerKey)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Faq;
