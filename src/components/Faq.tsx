
import { useState } from 'react';
import type { FC } from 'react';
import { Smile, Zap, Layers, Sparkles, HeartPulse, ScanLine } from "lucide-react";

const Faq: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq max-w-[900px] mx-auto px-5 py-20 md:py-24 lg:py-[80px]">
    <div className="text-center mb-14">
      <p className="text-gold font-body text-m tracking-[0.3em] uppercase font-medium mb-3">FAQ</p>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
        Поширені запитання
      </h2>
    </div>

      <div className="grid sm:grid-cols-1 lg:grid-cols-1 text-center gap-6">
        {faqItems.map((item, index) => (
          <details key={index} className={`bg-card border border-border border-gold rounded-2xl p-1 shadow-gold-custom text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${openIndex === index ? 'open' : ''}`} open={openIndex === index} onChange={() => setOpenIndex(openIndex === index ? null : index)}>
            <summary className="bg-card flex items-center justify-between cursor-pointer py-5 text-lg text-center md:text-xl font-semibold text-[#2b6f73] hover:text-[#1e5559] transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold/20 group-hover:bg-gold/10 
                              transition-colors flex items-center justify-center">
              {item.icon && <item.icon className="text-gold hover:text-navy transition-colors" />}
              </div>
              {item.question}
              <span className="ml-4 text-2xl text-center font-bold transition-transform duration-300 group-open:rotate-180">
                 <div className="w-12 h-12 rounded-xl bg-navy/20 group-hover:bg-navy/10 
                              transition-colors flex items-center justify-center">
                {openIndex === index ? '−' : '+' }
                </div>
              </span>
            </summary>
            <div className="pb-6 pt-3 text-center text-normal md:text-lg text-navy leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

const faqItems = [
  { icon: ScanLine,
    question: 'Скільки коштує лікування зубів у Dentis?',
    answer:
      'Вартість лікування залежить від складності випадку та обраного методу. Остаточну ціну лікар визначає після огляду.',
  },
  {
    icon: ScanLine,
    question: 'Чи боляче лікувати зуби?',
    answer:
      'У клініці Dentis застосовується сучасна анестезія, що робить лікування комфортним та безболісним.',
  },
  {
    icon: ScanLine,
    question: 'Як записатися на прийом у Dentis?',
    answer: 'Запис можливий телефоном або під час особистого візиту до клініки.',
  },
  {
    icon: ScanLine,
    question: 'Де знаходиться стоматологія Dentis?',
    answer:
      'Клініка Dentis знаходиться у місті Кропивницький. Контакти, адреса та графік роботи вказані у розділі контактів.',
  },
  {
    icon: ScanLine,
    question: 'Які методи лікування зубів доступні?',
    answer:
      'У Dentis доступні сучасні методи лікування: терапія карієсу, пломбування, професійна гігієна, імплантація та ортопедія.',
  },
  {
    icon: ScanLine,
    question: 'Чи є у клініці рентген та сучасне обладнання?',
    answer:
      'Так, Dentis оснащена сучасним цифровим рентгеном та іншим високотехнологічним обладнанням для точної діагностики та лікування.',
  },
];

export default Faq;