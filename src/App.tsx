import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Implantation from "@/pages/Implantation";
import Protezuvannya from "@/pages/Protezuvannya";
import LikuvannyaKariesu from "@/pages/LikuvannyaKariesu";
import ProfessionalCleaning from "@/pages/ProfessionalCleaning";
import Contacts from "@/pages/Contacts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/implantation" element={<Implantation />} />
        <Route path="/protezuvannya" element={<Protezuvannya />} />
        <Route path="/likuvannya-kariesu" element={<LikuvannyaKariesu />} />
        <Route path="/professional-cleaning" element={<ProfessionalCleaning />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </BrowserRouter>
  );
}