import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import LostFound from "./pages/LostFound";
import Vets from "./pages/Vets";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/vets" element={<Vets />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;