import JsonLdScript from "@/components/SEO/JsonLdScript";

type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbSchemaProps = {
  id: string;
  items: BreadcrumbItem[];
};

export default function BreadcrumbSchema({ id, items }: BreadcrumbSchemaProps) {
  return (
    <JsonLdScript
      id={id}
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
