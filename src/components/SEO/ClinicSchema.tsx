import JsonLdScript from "@/components/SEO/JsonLdScript";
import { CLINIC_CONTACT, SITE_URL } from "@/utils/seo";

const schema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC_CONTACT.brandName,
  description: "Стоматологія Dentis у Кропивницькому: лікування зубів, імплантація, протезування та професійна гігієна.",
  url: SITE_URL,
  telephone: CLINIC_CONTACT.phone,
  email: CLINIC_CONTACT.email,
  priceRange: "$$$",
  medicalSpecialty: ["Dentistry"],
  areaServed: CLINIC_CONTACT.addressLocality,
  sameAs: [],
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC_CONTACT.streetAddress,
    addressLocality: CLINIC_CONTACT.addressLocality,
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

export default function ClinicSchema() {
  return <JsonLdScript id="clinic-schema" data={schema} />;
}
