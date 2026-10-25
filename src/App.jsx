import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import LostFound from "./pages/LostFound";
import Vets from "./pages/Vets";
import SmartMatch from "./pages/SmartMatch";
import FoundPets from "./pages/FoundPets";
import PetzyDoctorChat from "./components/PetzyDoctorChat";
import ReportFound from "./pages/ReportFound";
import ReportLost from "./pages/ReportLost";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/vets" element={<Vets />} />
          <Route path="/smart-match" element={<SmartMatch />} />
          <Route path="/found-pets" element={<FoundPets />} />
          <Route path="/report-lost" element={<ReportLost />} />
          <Route path="/report-found" element={<ReportFound />} />
        </Routes>
        <PetzyDoctorChat />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;