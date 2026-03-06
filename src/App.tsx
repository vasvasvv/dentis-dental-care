import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "@/pages/Index";
import Implantation from "@/pages/Implantation";
import Protezuvannya from "@/pages/Protezuvannya";
import LikuvannyaKariesu from "@/pages/LikuvannyaKariesu";
import ProfessionalCleaning from "@/pages/ProfessionalCleaning";
import EstetychnaStomat from "@/pages/EstetychnaStomat";
import DiagnosticsPage from "@/pages/DiagnosticsPage";
import Contacts from "@/pages/Contacts";

export default function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/implantation" element={<Implantation />} />
        <Route path="/protezuvannya" element={<Protezuvannya />} />
        <Route path="/likuvannya-kariesu" element={<LikuvannyaKariesu />} />
        <Route path="/professional-cleaning" element={<ProfessionalCleaning />} />
        <Route path="/estetychna-stomatolohiya" element={<EstetychnaStomat />} />
        <Route path="/diagnostyka-renthen" element={<DiagnosticsPage />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </BrowserRouter>
    </HelmetProvider>
  );
}