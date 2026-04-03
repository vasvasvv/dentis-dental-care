import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SeoAccordionItem = {
  question: string;
  answer: string;
};

type SeoAccordionProps = {
  items: SeoAccordionItem[];
};

export default function SeoAccordion({ items }: SeoAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            key={item.question}
            className="rounded-2xl border border-border bg-card/90 px-6 py-5 shadow-card-custom"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-start justify-between gap-4 text-left"
              aria-expanded={isOpen}
            >
              <h3 className="font-display text-lg font-bold text-custom-dark">{item.question}</h3>
              <ChevronDown
                className={cn(
                  "mt-1 h-5 w-5 shrink-0 text-gold transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity,margin-top] duration-200",
                isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-3 grid-rows-[0.65fr] opacity-90",
              )}
            >
              <div className="overflow-hidden">
                <p className="font-body text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
