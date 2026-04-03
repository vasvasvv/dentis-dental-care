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
};

export default function PageSeo(props: PageSeoProps) {
  const seo = createPageSeo(props);

  return (
    <Head>
      <html lang={props.lang} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="robots" content={props.noindex ? "noindex, follow" : "index, follow"} />
      <link rel="canonical" href={seo.canonical} />
      <link rel="alternate" hrefLang="uk-UA" href={seo.alternates.uk} />
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
