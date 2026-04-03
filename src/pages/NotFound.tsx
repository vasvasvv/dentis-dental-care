import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageSeo from "@/components/SEO/PageSeo";
import { useLang } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { lang, localizePath, t } = useLang();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <PageSeo
        lang={lang}
        path={location.pathname}
        noindex
        title={{
          uk: "Сторінку не знайдено | Дентіс",
          en: "Page not found | Dentis",
        }}
        description={{
          uk: "Запитану сторінку не знайдено. Поверніться на сайт стоматології Дентіс у Кропивницькому.",
          en: "The requested page was not found. Return to the Dentis dental clinic website in Kropyvnytskyi.",
        }}
      />

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-navy">{t("notfound.h1")}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t("notfound.p")}</p>
        <Link to={localizePath("/")} className="text-primary underline hover:text-primary/90">
          {t("notfound.back")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
