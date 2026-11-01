import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  MapPin,
  Calendar,
  Home as HomeIcon,
  Star,
  CheckCircle2,
  X,
  Check,
  Moon,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PetSitting.css";

const sitterList = [
  {
    id: 1,
    name: "Happy Tails Pet Care",
    sitter: "Sanduni Jayawardena",
    location: "Colombo",
    address: "Covers Colombo 03 – 08",
    phone: "077-458-1123",
    availability: "Every day, incl. holidays",
    rating: 4.9,
    reviews: 87,
    experience: "6 Years",
    verified: true,
    overnight: true,
    priceFrom: 2500,
    priceUnit: "visit",
    petTypes: ["Dog", "Cat"],
    services: ["Home Visits", "Overnight Stay", "Dog Walking", "Feeding & Meds"]
  },
  {
    id: 2,
    name: "Cosy Paws Day Care",
    sitter: "Tharindu Abeysekara",
    location: "Nugegoda",
    address: "33 Pagoda Road, Nugegoda",
    phone: "011-282-6604",
    availability: "Mon–Sat, 7am–7pm",
    rating: 4.8,
    reviews: 59,
    experience: "4 Years",
    verified: true,
    overnight: false,
    priceFrom: 3000,
    priceUnit: "day",
    petTypes: ["Dog"],
    services: ["Day Care", "Dog Walking", "Playtime & Socialising"]
  },
  {
    id: 3,
    name: "Kandy Home Pet Sitters",
    sitter: "Dilshan Rathnayake",
    location: "Kandy",
    address: "Covers Kandy, Peradeniya & Katugastota",
    phone: "081-224-7718",
    availability: "Every day, 6am–9pm",
    rating: 4.7,
    reviews: 38,
    experience: "5 Years",
    verified: false,
    overnight: true,
    priceFrom: 2000,
    priceUnit: "visit",
    petTypes: ["Dog", "Cat", "Bird", "Rabbit"],
    services: ["Home Visits", "Overnight Stay", "Boarding at Sitter's Home", "Feeding & Meds"]
  }
];

const formatLKR = (n) => `LKR ${n.toLocaleString("en-LK")}`;

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const today = () => new Date().toISOString().split("T")[0];

function PetSitting() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [petFilter, setPetFilter] = useState("All");
  const [overnightOnly, setOvernightOnly] = useState(false);

  // Booking Modal
  const [bookingSitter, setBookingSitter] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(sitterList.map((s) => s.location))];
  const petTypes = ["All", "Dog", "Cat", "Bird", "Rabbit"];

  const filteredSitters = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return sitterList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search) ||
        s.sitter.toLowerCase().includes(search) ||
        s.location.toLowerCase().includes(search) ||
        s.services.some((sv) => sv.toLowerCase().includes(search));
      const matchesCity = cityFilter === "All" || s.location === cityFilter;
      const matchesPet = petFilter === "All" || s.petTypes.includes(petFilter);
      const matchesOvernight = !overnightOnly || s.overnight;
      return matchesSearch && matchesCity && matchesPet && matchesOvernight;
    });
  }, [searchTerm, cityFilter, petFilter, overnightOnly]);

  const resetFilters = () => {
    setSearchTerm("");
    setCityFilter("All");
    setPetFilter("All");
    setOvernightOnly(false);
  };

  const handleOpenBooking = (sitter) => {
    setBookingSitter(sitter);
    setBookingSuccess(false);
    const firstPetType = currentUser?.myPets?.[0]?.type;
    setBookingForm({
      petName: currentUser?.myPets?.[0]?.name || "",
      petType: sitter.petTypes.includes(firstPetType) ? firstPetType : sitter.petTypes[0],
      service: overnightOnly && sitter.services.includes("Overnight Stay")
        ? "Overnight Stay"
        : sitter.services[0],
      petCount: "1",
      startDate: today(),
      endDate: today(),
      ownerName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
      notes: ""
    });
  };

  const updateForm = (field, value) =>
    setBookingForm((f) => {
      const next = { ...f, [field]: value };
      // keep end date on or after start date
      if (field === "startDate" && next.endDate < value) next.endDate = value;
      return next;
    });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      const name = bookingSitter.name;
      setBookingSitter(null);
      setBookingSuccess(false);
      showToast(`Pet sitting booked with ${name}! Confirmation SMS sent.`);
    }, 2400);
  };

  return (
    <div className="sitting-page">
      {/* Toast */}
      {toastMessage && (
        <div className="sit-toast">
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
          <Link to="/vets">{t("nav.vetDirectory")}</Link>
          <Link to="/grooming">Grooming</Link>
          <Link to="/training">Training</Link>
          <Link to="/sitting" className="active">Pet Sitting</Link>
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

      {/* Header */}
      <section className="sit-header">
        <div className="sit-header-pill">
          <HomeIcon size={14} /> Caring Sri Lankan Pet Sitters
        </div>
        <h2>Pet Sitting Near You</h2>
        <p>Care when you can't be there. Home visits, day care, walks and overnight stays.</p>
      </section>

      {/* Overnight Spotlight */}
      <section className="sit-spotlight-section">
        <div className="sit-spotlight-card">
          <div className="sit-spotlight-icon">
            <Moon size={26} />
          </div>
          <div className="sit-spotlight-content">
            <div className="sit-spotlight-badge">
              <Sparkles size={11} /> HOLIDAY READY
            </div>
            <h3>Going away? Book overnight care</h3>
            <p>A trusted sitter stays with your pet or takes them home, so they're never alone.</p>
          </div>
          <button
            className="sit-spotlight-btn"
            onClick={() => setOvernightOnly(true)}
          >
            Show Overnight Sitters ➔
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="sit-filters-wrap">
        <div className="sit-filters">
          <div className="sit-search">
            <Search size={18} className="sit-search-icon" />
            <input
              type="text"
              placeholder="Search by sitter, service or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sit-filter-controls">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((city) => (
                <option key={city} value={city}>{city === "All" ? "All Locations" : city}</option>
              ))}
            </select>

            <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)}>
              {petTypes.map((p) => (
                <option key={p} value={p}>{p === "All" ? "All Pets" : `${p}s`}</option>
              ))}
            </select>

            <label className={`sit-toggle ${overnightOnly ? "on" : ""}`}>
              <input
                type="checkbox"
                checked={overnightOnly}
                onChange={(e) => setOvernightOnly(e.target.checked)}
              />
              <span>🌙 Overnight Stays</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Listing */}
      <section className="sit-results">
        <p className="sit-results-count">
          Found {filteredSitters.length} pet sitters and day care services
        </p>

        <div className="sit-grid">
          {filteredSitters.map((s) => (
            <div key={s.id} className="sit-card">
              <div className="sit-card-top">
                <div className="sit-avatar">{getInitials(s.name)}</div>
                <div>
                  <h3>{s.name}</h3>
                  <div className="sit-sitter">by {s.sitter}</div>
                  <div className="sit-rating">
                    <div className="sit-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>{s.rating} ({s.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="sit-services">
                {s.services.map((sv) => (
                  <span key={sv} className="sit-service-tag">{sv}</span>
                ))}
              </div>

              <div className="sit-details">
                <div><strong>From:</strong> {formatLKR(s.priceFrom)} / {s.priceUnit}</div>
                <div><strong>Pets:</strong> {s.petTypes.join(", ")}</div>
                <div><strong>Experience:</strong> {s.experience}</div>
                <div className="sit-detail-row">
                  <MapPin size={14} color="#6b7280" /> {s.address}
                </div>
                <div className="sit-detail-row">
                  <Calendar size={14} color="#6b7280" /> {s.availability}
                </div>
                {s.verified && (
                  <span className="sit-verified-tag">
                    <ShieldCheck size={13} /> ID Verified Sitter
                  </span>
                )}
              </div>

              <div className="sit-actions">
                <button className="sit-book-btn" onClick={() => handleOpenBooking(s)}>
                  <Calendar size={16} /> Book Sitter
                </button>
                <a href={`tel:${s.phone}`} className="sit-call-btn" title="Call Sitter">
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredSitters.length === 0 && (
          <div className="sit-empty">
            <p>No sitters match your search. Try a different city or pet type.</p>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingSitter && (
        <div className="sit-modal-overlay" onClick={() => setBookingSitter(null)}>
          <div className="sit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sit-modal-close" onClick={() => setBookingSitter(null)} aria-label="Close">
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="sit-success">
                <CheckCircle2 size={56} color="#16a34a" />
                <h3>Pet Sitting Confirmed!</h3>
                <p>
                  <strong>{bookingSitter.sitter}</strong> will look after{" "}
                  <strong>{bookingForm.petName}</strong> ({bookingForm.service}) from{" "}
                  <strong>{bookingForm.startDate}</strong> to <strong>{bookingForm.endDate}</strong>.
                  You will receive an SMS reminder.
                </p>
              </div>
            ) : (
              <div>
                <div className="sit-modal-head">
                  <div className="sit-avatar small">{getInitials(bookingSitter.name)}</div>
                  <div>
                    <h3>Book {bookingSitter.name}</h3>
                    <span>{bookingSitter.sitter} • {bookingSitter.location}</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="sit-form">
                  <div className="sit-form-row">
                    <div>
                      <label>Pet's Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Luna"
                        value={bookingForm.petName}
                        onChange={(e) => updateForm("petName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Pet Type</label>
                      <select value={bookingForm.petType} onChange={(e) => updateForm("petType", e.target.value)}>
                        {bookingSitter.petTypes.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sit-form-row">
                    <div>
                      <label>Service *</label>
                      <select value={bookingForm.service} onChange={(e) => updateForm("service", e.target.value)}>
                        {bookingSitter.services.map((sv) => (
                          <option key={sv} value={sv}>{sv}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Number of Pets</label>
                      <select value={bookingForm.petCount} onChange={(e) => updateForm("petCount", e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4+">4+</option>
                      </select>
                    </div>
                  </div>

                  <div className="sit-form-row">
                    <div>
                      <label>Start Date *</label>
                      <input
                        type="date"
                        required
                        min={today()}
                        value={bookingForm.startDate}
                        onChange={(e) => updateForm("startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>End Date *</label>
                      <input
                        type="date"
                        required
                        min={bookingForm.startDate}
                        value={bookingForm.endDate}
                        onChange={(e) => updateForm("endDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="sit-form-row">
                    <div>
                      <label>Parent / Owner Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.ownerName}
                        onChange={(e) => updateForm("ownerName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+94 77 123 4567"
                        value={bookingForm.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label>Care Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Feeding times, medicines, walking routine, vet contact..."
                      value={bookingForm.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <div className="sit-price-note">
                    Starting from <strong>{formatLKR(bookingSitter.priceFrom)} / {bookingSitter.priceUnit}</strong>. The sitter will confirm the total after a quick meet-and-greet.
                  </div>

                  <button type="submit" className="sit-submit-btn">
                    <Calendar size={18} /> Confirm Sitter Booking
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

export default PetSitting;