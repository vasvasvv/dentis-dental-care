import type { RouteRecord } from "vite-react-ssg";
import { Outlet, useLocation } from "react-router-dom";
import { LanguageProvider, useLang } from "@/contexts/LanguageContext";
import BreadcrumbSchema from "@/components/SEO/BreadcrumbSchema";
import ClinicSchema from "@/components/SEO/ClinicSchema";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import PWAInstallBanner from "./components/Pwainstallbanner";
import { PushBanner } from "./components/PushBanner";
import { buildCanonical, stripLangFromPath } from "@/utils/seo";

function AppBanners() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/d-panel");

  if (isAdmin) return null;

  return (
    <>
      <PWAInstallBanner />
      <PushBanner />
    </>
  );
}

function AppSchema() {
  const location = useLocation();
  const { lang } = useLang();
  const neutralPath = stripLangFromPath(location.pathname);

  const routeLabels: Record<string, { uk: string; en: string }> = {
    "/": { uk: "Головна", en: "Home" },
    "/implantaciya": { uk: "Імплантація зубів", en: "Dental implants" },
    "/protezuvannya": { uk: "Протезування зубів", en: "Dental prosthetics" },
    "/likuvannya-kariesu": { uk: "Лікування карієсу", en: "Caries treatment" },
    "/profesijne-ochischennya": { uk: "Професійне чищення зубів", en: "Professional teeth cleaning" },
    "/estetychna-stomatolohiya": { uk: "Естетична стоматологія", en: "Cosmetic dentistry" },
    "/diagnostika-zubiv": { uk: "Діагностика зубів", en: "Dental diagnostics" },
    "/contacts": { uk: "Контакти", en: "Contacts" },
    "/blog": { uk: "Блог", en: "Blog" },
  };

  const items =
    neutralPath === "/"
      ? [{ name: routeLabels["/"][lang], url: buildCanonical("/", lang) }]
      : [
          { name: routeLabels["/"][lang], url: buildCanonical("/", lang) },
          { name: routeLabels[neutralPath]?.[lang] ?? neutralPath, url: buildCanonical(neutralPath, lang) },
        ];

  return (
    <>
      <ClinicSchema />
      <BreadcrumbSchema id="app-breadcrumbs" items={items} />
    </>
  );
}

function Layout() {
  return (
    <LanguageProvider>
      <AppSchema />
      <ScrollToTop />
      <Outlet />
      <AppBanners />
      <ScrollToTopButton />
    </LanguageProvider>
  );
}

function createPublicRoutes(scope: string): RouteRecord[] {
  return [
    {
      id: `${scope}-home`,
      index: true,
      lazy: async () => {
        const { default: Component } = await import("./pages/Index");
        return { Component };
      },
    },
    {
      id: `${scope}-implantaciya`,
      path: "implantaciya",
      lazy: async () => {
        const { default: Component } = await import("./pages/Implantaciya");
        return { Component };
      },
    },
    {
      id: `${scope}-protezuvannya`,
      path: "protezuvannya",
      lazy: async () => {
        const { default: Component } = await import("./pages/Protezuvannya");
        return { Component };
      },
    },
    {
      id: `${scope}-likuvannya-kariesu`,
      path: "likuvannya-kariesu",
      lazy: async () => {
        const { default: Component } = await import("./pages/LikuvannyaKariesu");
        return { Component };
      },
    },
    {
      id: `${scope}-profesijne-ochischennya`,
      path: "profesijne-ochischennya",
      lazy: async () => {
        const { default: Component } = await import("./pages/ProfesijneOchischennya");
        return { Component };
      },
    },
    {
      id: `${scope}-estetychna-stomatolohiya`,
      path: "estetychna-stomatolohiya",
      lazy: async () => {
        const { default: Component } = await import("./pages/EstetychnaStomatologiya");
        return { Component };
      },
    },
    {
      id: `${scope}-diagnostika-zubiv`,
      path: "diagnostika-zubiv",
      lazy: async () => {
        const { default: Component } = await import("./pages/DiagnostikaZubiv");
        return { Component };
      },
    },
    {
      id: `${scope}-contacts`,
      path: "contacts",
      lazy: async () => {
        const { default: Component } = await import("./pages/Contacts");
        return { Component };
      },
    },
    {
      id: `${scope}-blog`,
      path: "blog",
      lazy: async () => {
        const { default: Component } = await import("./pages/Blog");
        return { Component };
      },
    },
    {
      id: `${scope}-not-found`,
      path: "*",
      lazy: async () => {
        const { default: Component } = await import("./pages/NotFound");
        return { Component };
      },
    },
  ];
}

export const routes: RouteRecord[] = [
  {
    id: "uk-layout",
    path: "/",
    element: <Layout />,
    children: createPublicRoutes("uk"),
  },
  {
    id: "en-layout",
    path: "/en",
    element: <Layout />,
    children: createPublicRoutes("en"),
  },
  {
    id: "admin",
    path: "/d-panel",
    lazy: async () => {
      const { default: Component } = await import("./pages/Admin");
      return { Component };
    },
  },
];

export default routes;
