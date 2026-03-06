import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "@/pages/Index";
import Implantaciya from "@/pages/Implantaciya";
import Protezuvannya from "@/pages/Protezuvannya";
import LikuvannyaKariesu from "@/pages/LikuvannyaKariesu";
import ProfesijneOchischennya from "@/pages/ProfesijneOchischennya";
import EstetychnaStomatologiya from "@/pages/EstetychnaStomatologiya";
import DiagnostikaZubiv from "@/pages/DiagnostikaZubiv";
import Contacts from "@/pages/Contacts";

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