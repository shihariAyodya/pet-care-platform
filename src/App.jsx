import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Shop from "./pages/Shop";
import LostFound from "./pages/LostFound";
import Vets from "./pages/Vets";
import SmartMatch from "./pages/SmartMatch";
import FoundPets from "./pages/FoundPets";
import PetzyDoctorChat from "./components/PetzyDoctorChat";
import ReportFound from "./pages/ReportFound";
import ReportLost from "./pages/ReportLost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/vets" element={<Vets />} />
              <Route path="/smart-match" element={<SmartMatch />} />
              <Route path="/found-pets" element={<FoundPets />} />
              <Route path="/report-lost" element={<ReportLost />} />
              <Route path="/report-found" element={<ReportFound />} />
              
              {/* Auth and Profile routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <PetzyDoctorChat />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
