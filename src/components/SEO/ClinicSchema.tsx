import JsonLdScript from "@/components/SEO/JsonLdScript";
import { useLang } from "@/contexts/LanguageContext";
import { CLINIC_CONTACT, SITE_URL } from "@/utils/seo";

export default function ClinicSchema() {
  const { lang } = useLang();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: lang === "uk" ? CLINIC_CONTACT.brandName : "Dentis",
    description: lang === "uk"
      ? "Стоматологія Дентіс у Кропивницькому: лікування зубів, імплантація, протезування та професійна гігієна."
      : "Dentis dental clinic in Kropyvnytskyi: dental treatment, implants, prosthetics, and professional hygiene.",
    url: SITE_URL,
    telephone: CLINIC_CONTACT.phone,
    email: CLINIC_CONTACT.email,
    priceRange: "$$$",
    medicalSpecialty: ["Dentistry"],
    areaServed: lang === "uk" ? CLINIC_CONTACT.addressLocality : "Kropyvnytskyi",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      streetAddress: lang === "uk" ? CLINIC_CONTACT.streetAddress : "9 Heroiv-riatuvalnykiv St., bldg. 2",
      addressLocality: lang === "uk" ? CLINIC_CONTACT.addressLocality : "Kropyvnytskyi",
      postalCode: CLINIC_CONTACT.postalCode,
      addressCountry: CLINIC_CONTACT.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC_CONTACT.latitude,
      longitude: CLINIC_CONTACT.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
  };

  return <JsonLdScript id="clinic-schema" data={schema} />;
}
