import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Check,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Share2,
  Phone,
  Eye,
  CheckCircle2,
  X,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { lostFoundPets } from "../data/lostFoundPets";
import "../styles/LostFound.css";

function LostFound() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("Lost"); // 'Lost' | 'Found'
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");

  // Interactive details & sighting modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [sightingModalReport, setSightingModalReport] = useState(null);
  const [sightingForm, setSightingForm] = useState({
    location: "",
    dateTime: "",
    contact: "",
    notes: ""
  });
  const [sightingSubmitted, setSightingSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const locations = ["All", ...new Set(lostFoundPets.map((p) => p.location).filter(Boolean))];

  const filteredReports = useMemo(() => {
    return lostFoundPets.filter((pet) => {
      const matchesTab = pet.type === activeTab;
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.description && pet.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.location && pet.location.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLoc = locationFilter === "All" || pet.location === locationFilter;

      return matchesTab && matchesSearch && matchesLoc;
    });
  }, [activeTab, searchTerm, locationFilter]);

  const handleShare = (pet, e) => {
    e?.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${pet.type}: ${pet.name} (${pet.breed})`,
        text: `Please help! ${pet.type === "Lost" ? "Missing pet" : "Found animal"} in ${pet.location}: ${pet.description}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast("Link copied to clipboard! Share on WhatsApp / Socials.");
    }
  };

  const handleOpenSighting = (pet, e) => {
    e?.stopPropagation();
    setSelectedReport(null);
    setSightingModalReport(pet);
    setSightingSubmitted(false);
    setSightingForm({
      location: pet.location || "",
      dateTime: "Just now",
      contact: currentUser?.phone || currentUser?.email || "",
      notes: ""
    });
  };

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    setSightingSubmitted(true);
    setTimeout(() => {
      setSightingModalReport(null);
      setSightingSubmitted(false);
      showToast(`Thank you! Sighting reported for ${sightingModalReport.name}.`);
    }, 2400);
  };

  return (
    <div className="lostfound-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#1d4633", color: "#ffffff", padding: "0.75rem 1.6rem", borderRadius: "999px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.92rem" }}>
          <Check size={18} color="#86efac" /> {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Banner with the two report buttons */}
      <section className="lf-compact-banner">
        <div className="lf-compact-text">
          <h2>{t("lostFound.title")}</h2>
          <p>{t("lostFound.subtitle")}</p>
        </div>
        <div className="lf-compact-actions">
          <Link to="/report-lost" className="lf-btn lf-btn-lost">
            <AlertCircle size={18} /> I Lost My Pet
          </Link>
          <Link to="/report-found" className="lf-btn lf-btn-found">
            <Check size={18} /> I Found a Pet
          </Link>
        </div>
      </section>

      {/* Interactive Controls & Filters */}
      <div style={{ maxWidth: "1200px", margin: "1.5rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", background: "#ffffff", padding: "1rem 1.5rem", borderRadius: "14px", border: "1px solid #ebe5da", boxShadow: "0 3px 10px rgba(0,0,0,0.03)" }}>
          {/* Lost / Found toggle tabs */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setActiveTab("Lost")}
              style={{
                padding: "0.6rem 1.4rem",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: activeTab === "Lost" ? "#dc2626" : "#f3f4f6",
                color: activeTab === "Lost" ? "#ffffff" : "#4b5563",
                transition: "all 0.2s"
              }}
            >
              <AlertCircle size={16} /> {t("lostFound.lostTab")} ({lostFoundPets.filter(p => p.type === "Lost").length})
            </button>
            <button
              onClick={() => setActiveTab("Found")}
              style={{
                padding: "0.6rem 1.4rem",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: activeTab === "Found" ? "var(--green-dark, #1d4633)" : "#f3f4f6",
                color: activeTab === "Found" ? "#ffffff" : "#4b5563",
                transition: "all 0.2s"
              }}
            >
              <Check size={16} /> {t("lostFound.foundTab")} ({lostFoundPets.filter(p => p.type === "Found").length})
            </button>
          </div>

          {/* Search box & Location select */}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", flex: 1, justifyContent: "flex-end", minWidth: "280px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", flex: 1, minWidth: "180px", maxWidth: "340px" }}>
              <Search size={16} style={{ position: "absolute", left: "0.8rem", color: "#9ca3af" }} />
              <input
                type="text"
                placeholder="Search pet, collar, breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "0.55rem 0.8rem 0.55rem 2.3rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.9rem" }}
              />
            </div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ padding: "0.55rem 0.9rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#faf9f6", fontSize: "0.9rem", cursor: "pointer" }}
            >
              <option value="All">All Cities</option>
              {locations.filter(l => l !== "All").map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="results" style={{ maxWidth: "1240px", margin: "1rem auto 4rem" }}>
        <p className="results-count">
          Showing {filteredReports.length} {activeTab.toLowerCase()} pet report(s)
        </p>

        <div className="lf-recent-grid">
          {filteredReports.map((pet) => (
            <div
              className="lf-pet-card"
              key={pet.id}
              onClick={() => setSelectedReport(pet)}
              style={{ cursor: "pointer" }}
            >
              <div className="lf-pet-img-wrap">
                <img
                  src={pet.img || "/store/hero_dog.png"}
                  alt={pet.name}
                  className="lf-pet-img"
                  style={{ objectFit: "cover" }}
                />
                <div className={`lf-pet-badge ${pet.type.toLowerCase()}`}>
                  {pet.type === "Lost" ? (
                    <AlertCircle size={12} />
                  ) : (
                    <Check size={12} />
                  )}
                  {pet.type.toUpperCase()}
                </div>

                <button
                  onClick={(e) => handleShare(pet, e)}
                  title="Share alert"
                  style={{ position: "absolute", top: "0.6rem", right: "0.6rem", background: "rgba(255,255,255,0.9)", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#374151" }}
                >
                  <Share2 size={15} />
                </button>
              </div>

              <div className="lf-pet-info">
                <div className="lf-pet-name-row">
                  <h4>{pet.name}</h4>
                  <span className="lf-pet-breed">{pet.breed}</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "0.3rem 0 0.6rem", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {pet.description}
                </p>
                <div className="lf-pet-meta">
                  <span className="lf-pet-loc">
                    <MapPin size={12} /> {pet.location}
                  </span>
                  <span className="lf-pet-time">
                    <Clock size={12} /> {pet.time}
                  </span>
                </div>
                
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
                  <button
                    onClick={(e) => handleOpenSighting(pet, e)}
                    style={{ flex: 1, background: pet.type === "Lost" ? "#dc2626" : "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.5rem 0.7rem", borderRadius: "6px", fontWeight: "600", fontSize: "0.82rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
                  >
                    {pet.type === "Lost" ? "I Spotted Milo" : "Claim / Contact"}
                  </button>
                  <button
                    onClick={() => setSelectedReport(pet)}
                    style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#374151", padding: "0.5rem 0.7rem", borderRadius: "6px", fontWeight: "600", fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div style={{ background: "#ffffff", borderRadius: "14px", padding: "3rem 1rem", border: "1px solid #e5e7eb", marginTop: "1rem" }}>
            <p className="no-results">{t("lostFound.noResults")}</p>
            <button
              onClick={() => { setSearchTerm(""); setLocationFilter("All"); }}
              style={{ background: "var(--green-dark, #1d4633)", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Pet Incident Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
            <button className="modal-close-btn" onClick={() => setSelectedReport(null)}>
              <X size={18} />
            </button>

            <div className="quickview-img-box" style={{ minHeight: "240px" }}>
              <img
                src={selectedReport.img || "/store/hero_dog.png"}
                alt={selectedReport.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
              />
            </div>

            <div className="quickview-details">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.78rem", fontWeight: "700", background: selectedReport.type === "Lost" ? "#fee2e2" : "#dcfce7", color: selectedReport.type === "Lost" ? "#dc2626" : "#166534", marginBottom: "0.5rem" }}>
                {selectedReport.type === "Lost" ? <AlertCircle size={13} /> : <Check size={13} />}
                STATUS: {selectedReport.type.toUpperCase()} PET
              </div>

              <h2>{selectedReport.name}</h2>
              <div style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
                <span>📍 Last seen in {selectedReport.location}</span> • <span>🕒 {selectedReport.time}</span>
              </div>

              <div style={{ background: "#faf9f6", padding: "1rem", borderRadius: "10px", border: "1px solid #eee8df", fontSize: "0.92rem", lineHeight: "1.5", color: "#374151" }}>
                <strong>Description & Identifying Marks:</strong>
                <p style={{ marginTop: "0.3rem" }}>{selectedReport.description}</p>
                <div style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: "#6b7280" }}>
                  Breed: <strong>{selectedReport.breed}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
                <button
                  onClick={(e) => handleOpenSighting(selectedReport, e)}
                  style={{ flex: 1, background: selectedReport.type === "Lost" ? "#dc2626" : "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                >
                  <MapPin size={18} /> {selectedReport.type === "Lost" ? "Report Sighting Location" : "Claim My Pet"}
                </button>
                <button
                  onClick={(e) => handleShare(selectedReport, e)}
                  style={{ padding: "0.8rem 1rem", borderRadius: "10px", border: "1px solid #d1d5db", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "600" }}
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sighting Report Modal */}
      {sightingModalReport && (
        <div className="modal-overlay" onClick={() => setSightingModalReport(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", display: "block" }}>
            <button className="modal-close-btn" onClick={() => setSightingModalReport(null)}>
              <X size={18} />
            </button>

            {sightingSubmitted ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                <CheckCircle2 size={56} color="#16a34a" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ color: "#1d4633", marginBottom: "0.5rem" }}>Sighting Report Sent!</h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  The owner has been notified with your location notes. Thank you for helping reunite a pet!
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{ color: "#1d4633", marginBottom: "0.3rem" }}>
                  Report Sighting for {sightingModalReport.name}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
                  Please share where and when you spotted this pet to notify the search team.
                </p>

                <form onSubmit={handleSightingSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Exact Location / Landmark *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Near Royal Bakery, Peradeniya Road"
                      value={sightingForm.location}
                      onChange={(e) => setSightingForm({ ...sightingForm, location: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>When was the pet seen? *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Today around 10:30 AM"
                      value={sightingForm.dateTime}
                      onChange={(e) => setSightingForm({ ...sightingForm, dateTime: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Your Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={sightingForm.contact}
                      onChange={(e) => setSightingForm({ ...sightingForm, contact: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Pet Condition / Direction Heading</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Seemed frightened, running towards the park..."
                      value={sightingForm.notes}
                      onChange={(e) => setSightingForm({ ...sightingForm, notes: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem", fontFamily: "inherit" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ background: "#dc2626", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "0.5rem" }}
                  >
                    Submit Sighting Information
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    <Footer />
    </div>
  );
}

export default LostFound;
