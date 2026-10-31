import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Stethoscope,
  Star,
  CheckCircle2,
  X,
  Send,
  Check,
  ShieldCheck,
  Navigation
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Vets.css";

const vetList = [
  {
    id: 1,
    name: "Dr. Nadeesha Perera",
    clinic: "PawCare Animal Clinic",
    specialty: "General & Surgery",
    location: "Nugegoda",
    phone: "011-234-5678",
    hours: "Mon–Sat, 8am–6pm",
    rating: 4.9,
    reviews: 84,
    emergency: true,
    address: "No. 45 High Level Road, Nugegoda",
    experience: "12+ Years",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Dr. Kasun Silva",
    clinic: "Colombo Pet Hospital",
    specialty: "Dermatology & Allergies",
    location: "Colombo",
    phone: "011-345-6789",
    hours: "Mon–Fri, 9am–5pm",
    rating: 4.8,
    reviews: 62,
    emergency: false,
    address: "12 Havelock Road, Colombo 05",
    experience: "8 Years",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Dr. Amaya Fernando",
    clinic: "Kandy Vet Care Centre",
    specialty: "General Practice & Vaccines",
    location: "Kandy",
    phone: "081-234-5678",
    hours: "Every day, 8am–8pm",
    rating: 5.0,
    reviews: 110,
    emergency: true,
    address: "88 Peradeniya Road, Kandy",
    experience: "15 Years",
    image: "https://images.unsplash.com/photo-1594824813580-07234914c679?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Dr. Ruwan Jayasuriya",
    clinic: "Galle Animal Hospital",
    specialty: "Surgery & Orthopedics",
    location: "Galle",
    phone: "091-234-5678",
    hours: "Mon–Sat, 9am–6pm",
    rating: 4.7,
    reviews: 49,
    emergency: false,
    address: "24 Matara Road, Galle",
    experience: "10 Years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Dr. Dilani Wickrama",
    clinic: "Maharagama Pet Clinic",
    specialty: "Vaccination & Dental Care",
    location: "Maharagama",
    phone: "011-456-7890",
    hours: "Mon–Sun, 8am–7pm",
    rating: 4.9,
    reviews: 95,
    emergency: true,
    address: "102 Old Road, Maharagama",
    experience: "9 Years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
  }
];

function Vets() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Booking Modal State
  const [bookingVet, setBookingVet] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    petName: "",
    petType: "Dog",
    ownerName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    preferredDate: "",
    preferredTime: "Morning (9am - 12pm)",
    reason: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(vetList.map((v) => v.location))];

  const filteredVets = useMemo(() => {
    return vetList.filter((vet) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        vet.name.toLowerCase().includes(search) ||
        vet.clinic.toLowerCase().includes(search) ||
        vet.specialty.toLowerCase().includes(search) ||
        vet.location.toLowerCase().includes(search);

      const matchesCity = cityFilter === "All" || vet.location === cityFilter;
      const matchesEmergency = !emergencyOnly || vet.emergency;

      return matchesSearch && matchesCity && matchesEmergency;
    });
  }, [searchTerm, cityFilter, emergencyOnly]);

  const handleOpenBooking = (vet) => {
    setBookingVet(vet);
    setBookingSuccess(false);
    setBookingForm({
      petName: currentUser?.myPets?.[0]?.name || "",
      petType: currentUser?.myPets?.[0]?.type || "Dog",
      ownerName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
      preferredDate: new Date().toISOString().split("T")[0],
      preferredTime: "Morning (9am - 12pm)",
      reason: "General Health Checkup & Vaccination"
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingVet(null);
      setBookingSuccess(false);
      showToast(`Appointment booked with ${bookingVet.name}! Confirmation SMS sent.`);
    }, 2400);
  };

  return (
    <div className="vets-page">
      {/* Toast */}
      {toastMessage && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#1d4633", color: "#ffffff", padding: "0.75rem 1.6rem", borderRadius: "999px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.92rem" }}>
          <Check size={18} color="#86efac" /> {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Site Logo" className="site-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/browse">{t("nav.adopt")}</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/lost-found">{t("nav.lostFound")}</Link>
          <Link to="/vets" style={{ color: "var(--green-dark)", fontWeight: "700" }}>{t("nav.vetDirectory")}</Link>
          <Link to="/smart-match">Smart Match</Link>
          {isAuthenticated ? (
            <Link to="/profile">👤 {currentUser?.fullName?.split(" ")[0] || "Profile"}</Link>
          ) : (
            <Link to="/login">{t("nav.login")}</Link>
          )}
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === "en" ? "සිං" : "EN"}
          </button>
        </div>
      </nav>

      <section className="vets-header">
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--green-light, #eaf4ee)", color: "var(--green-dark, #1d4633)", padding: "0.35rem 0.9rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.6rem" }}>
          <Stethoscope size={14} /> Certified Sri Lankan Veterinary Practitioners
        </div>
        <h2>{t("vets.title")}</h2>
        <p>{t("vets.subtitle")}</p>
      </section>

      {/* Meet Petzy Doctor AI Spotlight */}
      <section className="ai-doctor-spotlight-section">
        <div className="ai-doctor-card">
          <div className="ai-doctor-icon-wrap">
            <span className="ai-doctor-emoji">🩺🐾</span>
          </div>
          <div className="ai-doctor-content">
            <div className="ai-doctor-badge">NEW • 24/7 AI CONSULTATION</div>
            <h3>Need Quick Medical Advice? Meet Petzy Doctor</h3>
            <p>
              Ask questions about pet symptoms, first-aid, safe diets, or emergency triage in seconds.
            </p>
          </div>
          <button
            className="ai-doctor-chat-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("open-petzy-doctor"))}
          >
            Chat with Petzy Doctor ➔
          </button>
        </div>
      </section>

      {/* Interactive Search & Filter Controls */}
      <div style={{ maxWidth: "1100px", margin: "1.5rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ background: "#ffffff", padding: "1.2rem 1.6rem", borderRadius: "16px", border: "1px solid #ebe5da", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 3px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "240px", display: "flex", alignItems: "center" }}>
            <Search size={18} style={{ position: "absolute", left: "0.85rem", color: "#9ca3af" }} />
            <input
              type="text"
              className="search-input"
              placeholder={t("vets.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "0.65rem 0.8rem 0.65rem 2.5rem", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{ padding: "0.65rem 1rem", borderRadius: "10px", border: "1px solid #d1d5db", background: "#faf9f6", fontSize: "0.9rem", cursor: "pointer" }}
            >
              {cities.map((city) => (
                <option key={city} value={city}>{city === "All" ? "All Locations" : city}</option>
              ))}
            </select>

            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.88rem", fontWeight: 600, color: "#374151", cursor: "pointer", background: emergencyOnly ? "#fee2e2" : "#f3f4f6", padding: "0.6rem 0.9rem", borderRadius: "10px", border: emergencyOnly ? "1px solid #fecaca" : "1px solid transparent" }}>
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                style={{ accentColor: "#dc2626" }}
              />
              <span>🚨 24/7 Emergency Care</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Listing */}
      <section className="results" style={{ maxWidth: "1240px", margin: "1.5rem auto 4rem" }}>
        <p className="results-count" style={{ marginBottom: "1.5rem" }}>
          Found {filteredVets.length} registered clinics and specialists
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.6rem", textAlign: "left" }}>
          {filteredVets.map((vet) => (
            <div
              key={vet.id}
              style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #ebe5da", padding: "1.4rem", display: "flex", flexDirection: "column", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", transition: "all 0.2s" }}
            >
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <img
                  src={vet.image}
                  alt={vet.name}
                  style={{ width: "70px", height: "70px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <h3 style={{ fontSize: "1.15rem", color: "#1f2937", margin: 0 }}>{vet.name}</h3>
                  </div>
                  <div style={{ color: "#059669", fontWeight: "600", fontSize: "0.88rem", marginTop: "0.15rem" }}>
                    {vet.clinic}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", fontSize: "0.82rem", color: "#6b7280" }}>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>{vet.rating} ({vet.reviews})</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "#faf9f6", borderRadius: "10px", padding: "0.8rem 1rem", fontSize: "0.86rem", color: "#4b5563", display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.2rem", border: "1px solid #f1ece4" }}>
                <div><strong>Specialty:</strong> {vet.specialty}</div>
                <div><strong>Experience:</strong> {vet.experience}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={14} color="#6b7280" /> {vet.address}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={14} color="#6b7280" /> {vet.hours}
                </div>
                {vet.emergency && (
                  <span style={{ color: "#dc2626", fontWeight: "700", fontSize: "0.78rem" }}>
                    🚨 24/7 Emergency Care Available
                  </span>
                )}
              </div>

              <div style={{ marginTop: "auto", display: "flex", gap: "0.6rem" }}>
                <button
                  onClick={() => handleOpenBooking(vet)}
                  style={{ flex: 1, background: "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.65rem 0.8rem", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                >
                  <Calendar size={16} /> Book Visit
                </button>
                <a
                  href={`tel:${vet.phone}`}
                  style={{ background: "#f3f4f1", border: "1px solid #e5e7eb", color: "#1d4633", padding: "0.65rem 1rem", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  title="Call Clinic"
                >
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredVets.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#ffffff", borderRadius: "16px", marginTop: "1rem" }}>
            <p className="no-results">{t("vets.noResults")}</p>
            <button
              onClick={() => { setSearchTerm(""); setCityFilter("All"); setEmergencyOnly(false); }}
              style={{ background: "var(--green-dark, #1d4633)", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Appointment Booking Modal */}
      {bookingVet && (
        <div className="modal-overlay" onClick={() => setBookingVet(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px", display: "block" }}>
            <button className="modal-close-btn" onClick={() => setBookingVet(null)}>
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                <CheckCircle2 size={56} color="#16a34a" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ color: "#1d4633", marginBottom: "0.5rem" }}>
                  Appointment Request Confirmed!
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  We've reserved a consultation slot with <strong>{bookingVet.name}</strong> at <strong>{bookingVet.clinic}</strong>. You will receive an SMS reminder.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: "1px solid #eee8df" }}>
                  <img src={bookingVet.image} alt={bookingVet.name} style={{ width: "54px", height: "54px", borderRadius: "10px", objectFit: "cover" }} />
                  <div>
                    <h3 style={{ margin: 0, color: "#1d4633" }}>Schedule Visit with {bookingVet.name}</h3>
                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {bookingVet.clinic} • {bookingVet.location}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Pet's Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Milo"
                        value={bookingForm.petName}
                        onChange={(e) => setBookingForm({ ...bookingForm, petName: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Pet Type</label>
                      <select
                        value={bookingForm.petType}
                        onChange={(e) => setBookingForm({ ...bookingForm, petType: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Preferred Time Slot</label>
                      <select
                        value={bookingForm.preferredTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      >
                        <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                        <option value="Afternoon (1pm - 4pm)">Afternoon (1pm - 4pm)</option>
                        <option value="Evening (5pm - 7pm)">Evening (5pm - 7pm)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Parent / Owner Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.ownerName}
                        onChange={(e) => setBookingForm({ ...bookingForm, ownerName: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+94 77 123 4567"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Visit Reason or Symptoms</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Annual vaccination, limping, itchy ears..."
                      value={bookingForm.reason}
                      onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem", fontFamily: "inherit" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ background: "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.85rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "0.5rem" }}
                  >
                    <Calendar size={18} /> Confirm Appointment Booking
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Vets;
