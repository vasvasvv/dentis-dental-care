import { useEffect } from "react";
import { Head } from "vite-react-ssg";

type JsonLdScriptProps = {
  id: string;
  data: unknown;
};

export default function JsonLdScript({ id, data }: JsonLdScriptProps) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    // Видалити стару версію скрипту, якщо вона існує
    const selector = `script[data-seo-jsonld="${id}"]`;
    document.querySelectorAll(selector).forEach((node, index) => {
      // Залишити только перший (quello у Head з SSG), видалити дублікати
      if (index > 0) {
        node.remove();
      }
    });
  }, [id]);

  return (
    <Head>
      <script 
        type="application/ld+json" 
        data-seo-jsonld={id}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}
