import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const Index = lazy(() => import("./pages/Index"));
const Implantaciya = lazy(() =>  import("./pages/Implantaciya"));
const Protezuvannya = lazy(() =>  import("./pages/Protezuvannya"));
const LikuvannyaKariesu = lazy(() =>  import("./pages/LikuvannyaKariesu"));
const ProfesijneOchischennya = lazy(() =>  import("./pages/ProfesijneOchischennya"));
const EstetychnaStomatologiya = lazy(() =>  import("./pages/EstetychnaStomatologiya"));
const DiagnostikaZubiv = lazy(() =>  import("./pages/DiagnostikaZubiv"));
const Contacts = lazy(() =>  import("./pages/Contacts"));

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/implantaciya" element={<Implantaciya />} />
        <Route path="/protezuvannya" element={<Protezuvannya />} />
        <Route path="/likuvannya-kariesu" element={<LikuvannyaKariesu />} />
        <Route path="/profesijne-ochischennya" element={<ProfesijneOchischennya />} />
        <Route path="/estetychna-stomatolohiya" element={<EstetychnaStomatologiya />} />
        <Route path="/diagnostika-zubiv" element={<DiagnostikaZubiv />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  );
}