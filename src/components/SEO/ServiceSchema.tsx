import JsonLdScript from "@/components/SEO/JsonLdScript";
import { SITE_URL } from "@/utils/seo";

type ServiceSchemaProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: string;
  priceCurrency?: string;
};

export default function ServiceSchema({ id, name, description, image, price, priceCurrency = "UAH" }: ServiceSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name,
    description,
    image,
    url: SITE_URL,
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency,
            price,
          },
        }
      : {}),
    provider: {
      "@type": "Dentist",
      name: "Dentis",
      url: SITE_URL,
    },
  };

  return <JsonLdScript id={id} data={data} />;
}
