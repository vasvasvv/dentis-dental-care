import type { RouteRecord } from "vite-react-ssg";
import { HelmetProvider } from "react-helmet-async";
import { Outlet, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import RouteSeo from "@/components/SEO/RouteSeo";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import PWAInstallBanner from "./components/Pwainstallbanner";
import { PushBanner } from "./components/PushBanner";

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

function Layout() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <RouteSeo />
        <ScrollToTop />
        <Outlet />
        <AppBanners />
        <ScrollToTopButton />
      </LanguageProvider>
    </HelmetProvider>
  );
}

const publicRoutes = [
  {
    index: true,
    lazy: async () => {
      const { default: Component } = await import("./pages/Index");
      return { Component };
    },
  },
  {
    path: "implantaciya",
    lazy: async () => {
      const { default: Component } = await import("./pages/Implantaciya");
      return { Component };
    },
  },
  {
    path: "protezuvannya",
    lazy: async () => {
      const { default: Component } = await import("./pages/Protezuvannya");
      return { Component };
    },
  },
  {
    path: "likuvannya-kariesu",
    lazy: async () => {
      const { default: Component } = await import("./pages/LikuvannyaKariesu");
      return { Component };
    },
  },
  {
    path: "profesijne-ochischennya",
    lazy: async () => {
      const { default: Component } = await import("./pages/ProfesijneOchischennya");
      return { Component };
    },
  },
  {
    path: "estetychna-stomatolohiya",
    lazy: async () => {
      const { default: Component } = await import("./pages/EstetychnaStomatologiya");
      return { Component };
    },
  },
  {
    path: "diagnostika-zubiv",
    lazy: async () => {
      const { default: Component } = await import("./pages/DiagnostikaZubiv");
      return { Component };
    },
  },
  {
    path: "contacts",
    lazy: async () => {
      const { default: Component } = await import("./pages/Contacts");
      return { Component };
    },
  },
  {
    path: "blog",
    lazy: async () => {
      const { default: Component } = await import("./pages/Blog");
      return { Component };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const { default: Component } = await import("./pages/NotFound");
      return { Component };
    },
  },
] satisfies RouteRecord[];

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: publicRoutes,
  },
  {
    path: "/en",
    element: <Layout />,
    children: publicRoutes,
  },
  {
    path: "/d-panel",
    lazy: async () => {
      const { default: Component } = await import("./pages/Admin");
      return { Component };
    },
  },
];

export default routes;
