import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MapPin, 
  Check, 
  Search, 
  Sparkles, 
  X, 
  Calendar, 
  Activity, 
  Home as HomeIcon,
  ShieldCheck,
  Send,
  User,
  Filter,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Browse.css";

import { adoptablePets } from "../data/pets";

function Browse() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [breedFilter, setBreedFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Interactive States
  const [favoritePets, setFavoritePets] = useState([2, 5]); // IDs of favorited pets
  const [selectedPet, setSelectedPet] = useState(null); // Pet details modal
  const [adoptionApplicationPet, setAdoptionApplicationPet] = useState(null); // Application modal
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Application form data
  const [appForm, setAppForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    homeType: "House with Yard",
    experience: "Experienced pet owner",
    message: ""
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const toggleFavoritePet = (id, e) => {
    e?.stopPropagation();
    setFavoritePets((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((pId) => pId !== id) : [...prev, id];
      showToast(exists ? "Removed from saved favorites" : "Added to your adoption wishlist! 🐾");
      return next;
    });
  };

  const breeds = ["All", ...new Set(adoptablePets.map((pet) => pet.breed))];
  const locations = ["All", ...new Set(adoptablePets.map((pet) => pet.location))];

  const filteredPets = useMemo(() => {
    return adoptablePets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecies = speciesFilter === "All" || pet.species === speciesFilter;
      const matchesBreed = breedFilter === "All" || pet.breed === breedFilter;
      const matchesLocation = locationFilter === "All" || pet.location === locationFilter;
      const matchesStatus = statusFilter === "All" || pet.status === statusFilter;

      return matchesSearch && matchesSpecies && matchesBreed && matchesLocation && matchesStatus;
    });
  }, [searchTerm, speciesFilter, breedFilter, locationFilter, statusFilter]);

  const handleOpenAdoptModal = (pet, e) => {
    e?.stopPropagation();
    setSelectedPet(null);
    setAdoptionApplicationPet(pet);
    setApplicationSubmitted(false);
    setAppForm({
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      homeType: "House with Yard",
      experience: "Experienced pet owner",
      message: `I would love to give ${pet.name} a caring and loving forever home!`
    });
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setAdoptionApplicationPet(null);
      setApplicationSubmitted(false);
      showToast(`Adoption request sent for ${adoptionApplicationPet.name}! Shelter will contact you.`);
    }, 2400);
  };

  return (
    <div className="browse-page">
      {/* Toast */}
      {toastMessage && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#1d4633", color: "#ffffff", padding: "0.75rem 1.6rem", borderRadius: "999px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.92rem" }}>
          <Check size={18} color="#86efac" /> {toastMessage}
        </div>
      )}

      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Site Logo" className="site-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/browse" style={{ color: "var(--green-dark)", fontWeight: "700" }}>{t("nav.adopt")}</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/lost-found">{t("nav.lostFound")}</Link>
          <Link to="/vets">{t("nav.vetDirectory")}</Link>
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

      <section className="browse-header" style={{ padding: "2.5rem 2rem 1.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--green-light, #eaf4ee)", color: "var(--green-dark, #1d4633)", padding: "0.35rem 0.9rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.6rem" }}>
          <Sparkles size={14} /> Certified Rescue Shelters
        </div>
        <h2>{t("browse.title")}</h2>
        <p>{t("browse.subtitle")}</p>
      </section>

      {/* Interactive Species Filter Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", padding: "0 1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {[
          { id: "All", label: "All Animals", icon: "🐾" },
          { id: "Dog", label: "Dogs", icon: "🐶" },
          { id: "Cat", label: "Cats", icon: "🐱" },
          { id: "Bird", label: "Birds", icon: "🦜" },
          { id: "Rabbit", label: "Rabbits", icon: "🐰" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSpeciesFilter(tab.id)}
            style={{
              padding: "0.55rem 1.2rem",
              borderRadius: "999px",
              border: speciesFilter === tab.id ? "1.5px solid var(--green-dark, #1d4633)" : "1.5px solid #ded8cb",
              background: speciesFilter === tab.id ? "var(--green-dark, #1d4633)" : "#ffffff",
              color: speciesFilter === tab.id ? "#ffffff" : "#4a3626",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.9rem",
              transition: "all 0.2s"
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Secondary Filters */}
      <section className="filters" style={{ maxWidth: "1100px", margin: "0 auto", background: "#ffffff", borderRadius: "16px", padding: "1.2rem 1.8rem", border: "1px solid #e7e2d7", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
        <div className="filter-group" style={{ flex: 1, minWidth: "220px" }}>
          <label>Search by Name or Breed</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={16} style={{ position: "absolute", left: "0.8rem", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="e.g. Luna, Labrador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 0.8rem 0.6rem 2.4rem", borderRadius: "8px", border: "1px solid #e0d3bd", fontSize: "0.92rem" }}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>{t("browse.breed")}</label>
          <select value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)}>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed === "All" ? t("browse.all") : breed}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>{t("browse.location")}</label>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            {locations.map((location) => (
              <option key={location} value={location}>{location === "All" ? t("browse.all") : location}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="New">Newly Listed</option>
          </select>
        </div>
      </section>

      {/* Results Listing */}
      <section className="results" style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", padding: "0 0.5rem" }}>
          <p className="results-count" style={{ margin: 0, fontWeight: "600" }}>
            {filteredPets.length} {t("browse.resultsFound")}
          </p>
          <Link to="/smart-match" style={{ color: "var(--green-dark, #1d4633)", fontWeight: "600", fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <Sparkles size={16} /> Take Smart Match Quiz ➔
          </Link>
        </div>

        <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
          {filteredPets.map((pet) => {
            const isFav = favoritePets.includes(pet.id);
            return (
              <div
                className="pet-card"
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                style={{ width: "100%", position: "relative", cursor: "pointer", background: "#ffffff", border: "1px solid #ebe5da", borderRadius: "16px", padding: "1.2rem", transition: "all 0.25s" }}
              >
                {/* Status Tag */}
                <span style={{ position: "absolute", top: "1rem", left: "1rem", background: pet.status === "New" ? "#fef3c7" : "#dcfce7", color: pet.status === "New" ? "#92400e" : "#166534", fontSize: "0.75rem", fontWeight: "700", padding: "0.2rem 0.6rem", borderRadius: "6px", zIndex: 2 }}>
                  {pet.status || "Ready"}
                </span>

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => toggleFavoritePet(pet.id, e)}
                  style={{ position: "absolute", top: "1rem", right: "1rem", width: "34px", height: "34px", borderRadius: "50%", background: "#ffffff", border: "1px solid #eee8df", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, color: isFav ? "#e11d48" : "#9ca3af" }}
                  title="Save pet"
                >
                  <Heart size={16} fill={isFav ? "#e11d48" : "none"} />
                </button>

                <div className="pet-image-container" style={{ height: "180px", borderRadius: "12px", background: "#f5f4ef", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={pet.img} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.8rem", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "1.2rem", color: "#1f2937", margin: 0 }}>{pet.name}</h4>
                  {pet.match && (
                    <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: "700", background: "#ecfdf5", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                      {pet.match}% match
                    </span>
                  )}
                </div>

                <p style={{ color: "#4b5563", fontSize: "0.9rem", margin: "0.2rem 0" }}>
                  {pet.species} • {pet.breed}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#6b7280", margin: "0.5rem 0 1rem" }}>
                  <span>⏳ {pet.age}</span>
                  <span className="location-tag">📍 {pet.location}</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={(e) => handleOpenAdoptModal(pet, e)}
                    style={{ flex: 1, background: "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.6rem 0.8rem", borderRadius: "8px", fontWeight: "600", fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                  >
                    Adopt Me
                  </button>
                  <button
                    onClick={() => setSelectedPet(pet)}
                    style={{ background: "#f3f4f1", border: "1px solid #e5e7eb", color: "#374151", padding: "0.6rem 0.8rem", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPets.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", background: "#ffffff", borderRadius: "16px", marginTop: "1rem" }}>
            <p className="no-results">{t("browse.noResults")}</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSpeciesFilter("All");
                setBreedFilter("All");
                setLocationFilter("All");
                setStatusFilter("All");
              }}
              style={{ background: "var(--green-dark, #1d4633)", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Pet Quick Details Modal */}
      {selectedPet && (
        <div className="modal-overlay" onClick={() => setSelectedPet(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
            <button className="modal-close-btn" onClick={() => setSelectedPet(null)}>
              <X size={18} />
            </button>
            <div className="quickview-img-box" style={{ minHeight: "260px" }}>
              <img src={selectedPet.img} alt={selectedPet.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
            </div>
            <div className="quickview-details">
              <span style={{ color: "#059669", fontWeight: "700", fontSize: "0.85rem" }}>
                {selectedPet.species} • {selectedPet.status || "Ready for Home"}
              </span>
              <h2>{selectedPet.name}</h2>
              <p style={{ color: "#6b7280", margin: "0.4rem 0 1rem" }}>
                📍 Located at shelter in {selectedPet.location}, Sri Lanka
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", background: "#faf9f6", padding: "1rem", borderRadius: "12px", border: "1px solid #eee8df", fontSize: "0.88rem" }}>
                <div><strong>Breed:</strong> {selectedPet.breed}</div>
                <div><strong>Age:</strong> {selectedPet.age}</div>
                <div><strong>Ideal Home:</strong> {selectedPet.homeType || "House / Apartment"}</div>
                <div><strong>Good with Kids:</strong> {selectedPet.kids || "Yes"}</div>
                <div><strong>Daily Playtime:</strong> {selectedPet.time || "1-2 Hours"}</div>
                <div><strong>Energy Level:</strong> {selectedPet.activity || "Moderate"}</div>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
                <button
                  onClick={(e) => handleOpenAdoptModal(selectedPet, e)}
                  style={{ flex: 1, background: "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "10px", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                >
                  <Heart size={18} fill="#ffffff" /> Apply for Adoption
                </button>
                <button
                  onClick={(e) => toggleFavoritePet(selectedPet.id, e)}
                  className={`wishlist-toggle-btn ${favoritePets.includes(selectedPet.id) ? "active" : ""}`}
                  style={{ position: "static", width: "46px", height: "46px" }}
                >
                  <Heart size={18} fill={favoritePets.includes(selectedPet.id) ? "#e11d48" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adoption Application Form Modal */}
      {adoptionApplicationPet && (
        <div className="modal-overlay" onClick={() => setAdoptionApplicationPet(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px", display: "block" }}>
            <button className="modal-close-btn" onClick={() => setAdoptionApplicationPet(null)}>
              <X size={18} />
            </button>

            {applicationSubmitted ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                <CheckCircle2 size={56} color="#16a34a" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ color: "#1d4633", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  Application Submitted!
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  The caretaker for <strong>{adoptionApplicationPet.name}</strong> will review your application and contact you within 24-48 hours.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: "1px solid #eee8df" }}>
                  <img src={adoptionApplicationPet.img} alt={adoptionApplicationPet.name} style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <h3 style={{ margin: 0, color: "#1d4633" }}>Adopt {adoptionApplicationPet.name}</h3>
                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {adoptionApplicationPet.breed} • {adoptionApplicationPet.location}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmitApplication} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={appForm.fullName}
                      onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={appForm.email}
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={appForm.phone}
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Home Environment</label>
                    <select
                      value={appForm.homeType}
                      onChange={(e) => setAppForm({ ...appForm, homeType: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem" }}
                    >
                      <option value="House with Yard">House with Fenced Yard</option>
                      <option value="Apartment / Condo">Apartment / Condo</option>
                      <option value="Farm / Acreage">Farm / Rural Property</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Message to Shelter</label>
                    <textarea
                      rows={3}
                      value={appForm.message}
                      onChange={(e) => setAppForm({ ...appForm, message: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginTop: "0.25rem", fontFamily: "inherit" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ background: "var(--green-dark, #1d4633)", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginTop: "0.5rem" }}
                  >
                    <Send size={16} /> Submit Free Adoption Request
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

export default Browse;
