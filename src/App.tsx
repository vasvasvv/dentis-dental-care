import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const Index = lazy(() => import("./pages/Index"));
const Implantaciya = lazy(() => import("./pages/Implantaciya"));
const Protezuvannya = lazy(() => import("./pages/Protezuvannya"));
const LikuvannyaKariesu = lazy(() => import("./pages/LikuvannyaKariesu"));
const ProfesijneOchischennya = lazy(() => import("./pages/ProfesijneOchischennya"));
const EstetychnaStomatologiya = lazy(() => import("./pages/EstetychnaStomatologiya"));
const DiagnostikaZubiv = lazy(() => import("./pages/DiagnostikaZubiv"));
const Contacts = lazy(() => import("./pages/Contacts"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PWAInstallBanner = lazy(() => import("./components/Pwainstallbanner"));
const Blog = lazy(() => import("./pages/Blog"));
const Admin = lazy(() => import("./pages/Admin"));
import { PushBanner } from "./components/PushBanner";
import { useLocation } from "react-router-dom";

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

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <ScrollToTop />
          <Suspense fallback={<div>Завантаження</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/implantaciya" element={<Implantaciya />} />
              <Route path="/protezuvannya" element={<Protezuvannya />} />
              <Route path="/likuvannya-kariesu" element={<LikuvannyaKariesu />} />
              <Route path="/profesijne-ochischennya" element={<ProfesijneOchischennya />} />
              <Route path="/estetychna-stomatolohiya" element={<EstetychnaStomatologiya />} />
              <Route path="/diagnostika-zubiv" element={<DiagnostikaZubiv />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/d-panel" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <AppBanners />
          <ScrollToTopButton />
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
