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

    const selector = `script[data-seo-jsonld="${id}"]`;
    document.querySelectorAll(selector).forEach((node) => node.remove());

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-jsonld", id);
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data, id]);

  return (
    <Head>
      <script type="application/ld+json" data-seo-jsonld={id}>
        {JSON.stringify(data)}
      </script>
    </Head>
  );
}
