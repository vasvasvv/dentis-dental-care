import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Helmet>
        <title>Сторінку не знайдено — Дентіс</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-navy">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Сторінку не знайдено</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
