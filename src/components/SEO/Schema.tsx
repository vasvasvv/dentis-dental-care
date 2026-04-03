import { Head } from "vite-react-ssg";
import { CLINIC_CONTACT, SITE_URL, type SeoLang } from "@/utils/seo";

type FaqItem = {
  question: string;
  answer: string;
};

type SchemaProps =
  | {
      type: "FAQPage";
      lang: SeoLang;
      data: {
        faqs: FaqItem[];
      };
    }
  | {
      type: "MedicalProcedure";
      lang: SeoLang;
      data: {
        name: string;
        description: string;
        url: string;
        bodyLocation?: string;
        howPerformed?: string;
        indication?: string;
        followup?: string;
      };
    }
  | {
      type: "Article";
      lang: SeoLang;
      data: {
        headline: string;
        description: string;
        url: string;
        image?: string;
        datePublished?: string;
        dateModified?: string;
        authorName?: string;
      };
    }
  | {
      type: "MedicalWebPage";
      lang: SeoLang;
      data: {
        name: string;
        description: string;
        url: string;
      };
    };

function createSchema(props: SchemaProps) {
  const inLanguage = props.lang === "uk" ? "uk-UA" : "en";

  switch (props.type) {
    case "FAQPage":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage,
        mainEntity: props.data.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      };
    case "MedicalProcedure":
      return {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        name: props.data.name,
        description: props.data.description,
        url: props.data.url,
        inLanguage,
        bodyLocation: props.data.bodyLocation,
        howPerformed: props.data.howPerformed,
        followup: props.data.followup,
        indication: props.data.indication,
        procedureType: "DentalProcedure",
        provider: {
          "@type": "Dentist",
          name: CLINIC_CONTACT.legalName,
          telephone: CLINIC_CONTACT.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: CLINIC_CONTACT.streetAddress,
            addressLocality: CLINIC_CONTACT.addressLocality,
            postalCode: CLINIC_CONTACT.postalCode,
            addressCountry: CLINIC_CONTACT.addressCountry,
          },
        },
      };
    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: props.data.headline,
        description: props.data.description,
        url: props.data.url,
        inLanguage,
        image: props.data.image ?? `${SITE_URL}/og-image.jpg`,
        datePublished: props.data.datePublished,
        dateModified: props.data.dateModified ?? props.data.datePublished,
        author: {
          "@type": "Person",
          name: props.data.authorName ?? "Dentis Team",
        },
        publisher: {
          "@type": "Dentist",
          name: CLINIC_CONTACT.legalName,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo-gold.webp`,
          },
        },
      };
    case "MedicalWebPage":
      return {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: props.data.name,
        description: props.data.description,
        url: props.data.url,
        inLanguage,
        about: {
          "@type": "Dentist",
          name: CLINIC_CONTACT.legalName,
          telephone: CLINIC_CONTACT.phone,
        },
      };
  }
}

export default function Schema(props: SchemaProps) {
  const schema = createSchema(props);

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}
