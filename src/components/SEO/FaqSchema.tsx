import JsonLdScript from "@/components/SEO/JsonLdScript";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSchemaProps = {
  id: string;
  faqs: FaqItem[];
};

export default function FaqSchema({ id, faqs }: FaqSchemaProps) {
  return (
    <JsonLdScript
      id={id}
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}
