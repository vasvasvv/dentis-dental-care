import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { createPageSeo, type SeoLang } from "@/utils/seo";

type PageSeoProps = {
  lang: SeoLang;
  path: string;
  title: {
    uk: string;
    en: string;
  };
  description: {
    uk: string;
    en: string;
  };
  type?: "website" | "article";
  noindex?: boolean;
  ogImage?: string;
};

function upsertMeta(selector: string, attributeName: "name" | "property", attributeValue: string, content: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.head.querySelectorAll(selector).forEach((node) => node.remove());
  const meta = document.createElement("meta");
  meta.setAttribute(attributeName, attributeValue);
  meta.setAttribute("content", content);
  meta.setAttribute("data-seo-managed", "true");
  document.head.appendChild(meta);
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  if (typeof document === "undefined") {
    return;
  }

  document.head.querySelectorAll(selector).forEach((node) => node.remove());
  const link = document.createElement("link");

  Object.entries(attributes).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });

  link.setAttribute("data-seo-managed", "true");
  document.head.appendChild(link);
}

export default function PageSeo(props: PageSeoProps) {
  const seo = createPageSeo(props);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = seo.title;
    document.documentElement.lang = props.lang;

    upsertMeta('meta[name="description"][data-seo-managed="true"], meta[name="description"]:not([data-seo-managed])', "name", "description", seo.description);
    upsertMeta('meta[name="robots"][data-seo-managed="true"], meta[name="robots"]:not([data-seo-managed])', "name", "robots", props.noindex ? "noindex, follow" : "index, follow");
    upsertMeta('meta[property="og:title"][data-seo-managed="true"], meta[property="og:title"]:not([data-seo-managed])', "property", "og:title", seo.title);
    upsertMeta('meta[property="og:description"][data-seo-managed="true"], meta[property="og:description"]:not([data-seo-managed])', "property", "og:description", seo.description);
    upsertMeta('meta[property="og:url"][data-seo-managed="true"], meta[property="og:url"]:not([data-seo-managed])', "property", "og:url", seo.canonical);
    upsertMeta('meta[property="og:type"][data-seo-managed="true"], meta[property="og:type"]:not([data-seo-managed])', "property", "og:type", seo.ogType);
    upsertMeta('meta[property="og:locale"][data-seo-managed="true"], meta[property="og:locale"]:not([data-seo-managed])', "property", "og:locale", seo.locale);
    upsertMeta('meta[property="og:image"][data-seo-managed="true"], meta[property="og:image"]:not([data-seo-managed])', "property", "og:image", seo.image);
    upsertMeta('meta[property="og:image:width"][data-seo-managed="true"], meta[property="og:image:width"]:not([data-seo-managed])', "property", "og:image:width", "1200");
    upsertMeta('meta[property="og:image:height"][data-seo-managed="true"], meta[property="og:image:height"]:not([data-seo-managed])', "property", "og:image:height", "630");
    upsertMeta('meta[name="twitter:card"][data-seo-managed="true"], meta[name="twitter:card"]:not([data-seo-managed])', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"][data-seo-managed="true"], meta[name="twitter:title"]:not([data-seo-managed])', "name", "twitter:title", seo.title);
    upsertMeta('meta[name="twitter:description"][data-seo-managed="true"], meta[name="twitter:description"]:not([data-seo-managed])', "name", "twitter:description", seo.description);
    upsertMeta('meta[name="twitter:image"][data-seo-managed="true"], meta[name="twitter:image"]:not([data-seo-managed])', "name", "twitter:image", seo.image);

    upsertLink('link[rel="canonical"][data-seo-managed="true"], link[rel="canonical"]:not([data-seo-managed])', {
      rel: "canonical",
      href: seo.canonical,
    });

    document.head.querySelectorAll('link[rel="alternate"][hreflang][data-seo-managed="true"], link[rel="alternate"][hreflang]:not([data-seo-managed])').forEach((node) => node.remove());

    [
      { hrefLang: "uk", href: seo.alternates.uk },
      { hrefLang: "en", href: seo.alternates.en },
      { hrefLang: "x-default", href: seo.alternates.xDefault },
    ].forEach((alternate) => {
      upsertLink(`link[rel="alternate"][hreflang="${alternate.hrefLang}"]`, {
        rel: "alternate",
        hreflang: alternate.hrefLang,
        href: alternate.href,
      });
    });
  }, [props.lang, props.noindex, seo]);

  return (
    <Head>
      <html lang={props.lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={props.noindex ? "noindex, follow" : "index, follow"} />
      <link rel="canonical" href={seo.canonical} />
      <link rel="alternate" hrefLang="uk" href={seo.alternates.uk} />
      <link rel="alternate" hrefLang="en" href={seo.alternates.en} />
      <link rel="alternate" hrefLang="x-default" href={seo.alternates.xDefault} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:locale" content={seo.locale} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Head>
  );
}
