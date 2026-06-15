import JsonLdScript from "@/components/SEO/JsonLdScript";
import { SITE_URL } from "@/utils/seo";

type ArticleSchemaProps = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorUrl?: string;
  datePublished: string;
  dateModified?: string;
  image: string;
};

export default function ArticleSchema({ id, title, description, author, authorUrl, datePublished, dateModified, image }: ArticleSchemaProps) {
  return (
    <JsonLdScript
      id={id}
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image,
        author: {
          "@type": "Person",
          name: author,
          ...(authorUrl ? { url: authorUrl } : {}),
        },
        publisher: {
          "@type": "Dentist",
          name: "Dentis",
          url: SITE_URL,
        },
        datePublished,
        dateModified: dateModified ?? datePublished,
      }}
    />
  );
}
