import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Clock,
  MapPin,
  Calendar,
  Scissors,
  Star,
  CheckCircle2,
  X,
  Check,
  Truck,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Grooming.css";

const groomerList = [
  {
    id: 1,
    name: "Fluffy Styles Salon",
    groomer: "Ishara Gunawardena",
    location: "Colombo",
    address: "27 Dharmapala Mawatha, Colombo 07",
    phone: "011-267-4512",
    hours: "Mon–Sat, 9am–7pm",
    rating: 4.9,
    reviews: 128,
    mobile: false,
    priceFrom: 2500,
    petTypes: ["Dog", "Cat"],
    services: ["Full Groom", "Bath & Blow Dry", "Haircut & Styling", "Nail Trim", "Ear Cleaning"]
  },
  {
    id: 2,
    name: "PawSpa Mobile Grooming",
    groomer: "Chamath Rajapaksha",
    location: "Nugegoda",
    address: "Serves Nugegoda, Maharagama & Kottawa",
    phone: "077-845-2210",
    hours: "Every day, 8am–6pm",
    rating: 4.8,
    reviews: 76,
    mobile: true,
    priceFrom: 3500,
    petTypes: ["Dog", "Cat"],
    services: ["Full Groom", "Bath & Blow Dry", "Nail Trim", "De-shedding"]
  },
  {
    id: 3,
    name: "Kandy Pet Parlour",
    groomer: "Nethmi Bandara",
    location: "Kandy",
    address: "56 Katugastota Road, Kandy",
    phone: "081-223-9087",
    hours: "Tue–Sun, 9am–6pm",
    rating: 4.7,
    reviews: 54,
    mobile: false,
    priceFrom: 2000,
    petTypes: ["Dog", "Cat", "Rabbit"],
    services: ["Bath & Blow Dry", "Haircut & Styling", "Nail Trim", "Tick & Flea Treatment"]
  },
  {
    id: 4,
    name: "Coastal Paws Grooming",
    groomer: "Dinesh Wijesinghe",
    location: "Galle",
    address: "14 Wakwella Road, Galle",
    phone: "091-224-6631",
    hours: "Mon–Sat, 8:30am–5:30pm",
    rating: 4.8,
    reviews: 41,
    mobile: true,
    priceFrom: 2200,
    petTypes: ["Dog"],
    services: ["Full Groom", "Bath & Blow Dry", "Tick & Flea Treatment", "Nail Trim"]
  },
  {
    id: 5,
    name: "The Groom Room",
    groomer: "Sachini Herath",
    location: "Maharagama",
    address: "211 High Level Road, Maharagama",
    phone: "011-285-3349",
    hours: "Mon–Sun, 9am–8pm",
    rating: 5.0,
    reviews: 93,
    mobile: false,
    priceFrom: 3000,
    petTypes: ["Dog", "Cat"],
    services: ["Full Groom", "Haircut & Styling", "Teeth Brushing", "Ear Cleaning", "De-shedding"]
  }
];

const formatLKR = (n) => `LKR ${n.toLocaleString("en-LK")}`;

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Grooming() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [petFilter, setPetFilter] = useState("All");
  const [mobileOnly, setMobileOnly] = useState(false);

  // Booking Modal
  const [bookingGroomer, setBookingGroomer] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(groomerList.map((g) => g.location))];
  const petTypes = ["All", "Dog", "Cat", "Rabbit"];

  const filteredGroomers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return groomerList.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(search) ||
        g.groomer.toLowerCase().includes(search) ||
        g.location.toLowerCase().includes(search) ||
        g.services.some((s) => s.toLowerCase().includes(search));
      const matchesCity = cityFilter === "All" || g.location === cityFilter;
      const matchesPet = petFilter === "All" || g.petTypes.includes(petFilter);
      const matchesMobile = !mobileOnly || g.mobile;
      return matchesSearch && matchesCity && matchesPet && matchesMobile;
    });
  }, [searchTerm, cityFilter, petFilter, mobileOnly]);

  const resetFilters = () => {
    setSearchTerm("");
    setCityFilter("All");
    setPetFilter("All");
    setMobileOnly(false);
  };

  const handleOpenBooking = (groomer) => {
    setBookingGroomer(groomer);
    setBookingSuccess(false);
    const firstPetType = currentUser?.myPets?.[0]?.type;
    setBookingForm({
      petName: currentUser?.myPets?.[0]?.name || "",
      petType: groomer.petTypes.includes(firstPetType) ? firstPetType : groomer.petTypes[0],
      service: groomer.services[0],
      visitType: groomer.mobile ? "Home Visit" : "At Salon",
      ownerName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
      preferredDate: new Date().toISOString().split("T")[0],
      preferredTime: "Morning (9am - 12pm)",
      notes: ""
    });
  };

  const updateForm = (field, value) => setBookingForm((f) => ({ ...f, [field]: value }));

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      const name = bookingGroomer.name;
      setBookingGroomer(null);
      setBookingSuccess(false);
      showToast(`Grooming booked at ${name}! Confirmation SMS sent.`);
    }, 2400);
  };

  return (
    <div className="grooming-page">
      {/* Toast */}
      {toastMessage && (
        <div className="groom-toast">
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
          <Link to="/grooming" className="active">Grooming</Link>
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
      <section className="groom-header">
        <div className="groom-header-pill">
          <Scissors size={14} /> Trusted Sri Lankan Pet Groomers
        </div>
        <h2>Pet Grooming Near You</h2>
        <p>Baths, haircuts, nail trims and more, at the salon or at your doorstep.</p>
      </section>

      {/* Mobile Grooming Spotlight */}
      <section className="groom-spotlight-section">
        <div className="groom-spotlight-card">
          <div className="groom-spotlight-icon">
            <Truck size={26} />
          </div>
          <div className="groom-spotlight-content">
            <div className="groom-spotlight-badge">
              <Sparkles size={11} /> STRESS-FREE AT HOME
            </div>
            <h3>No time for the salon? Try mobile grooming</h3>
            <p>Groomers come to your home with everything they need. Perfect for anxious or senior pets.</p>
          </div>
          <button
            className="groom-spotlight-btn"
            onClick={() => setMobileOnly(true)}
          >
            Show Home Visits ➔
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="groom-filters-wrap">
        <div className="groom-filters">
          <div className="groom-search">
            <Search size={18} className="groom-search-icon" />
            <input
              type="text"
              placeholder="Search by salon, groomer, service or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="groom-filter-controls">
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

            <label className={`groom-toggle ${mobileOnly ? "on" : ""}`}>
              <input
                type="checkbox"
                checked={mobileOnly}
                onChange={(e) => setMobileOnly(e.target.checked)}
              />
              <span>🚐 Home Visits Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Listing */}
      <section className="groom-results">
        <p className="groom-results-count">
          Found {filteredGroomers.length} grooming salons and mobile groomers
        </p>

        <div className="groom-grid">
          {filteredGroomers.map((g) => (
            <div key={g.id} className="groom-card">
              <div className="groom-card-top">
                <div className="groom-avatar">{getInitials(g.name)}</div>
                <div>
                  <h3>{g.name}</h3>
                  <div className="groom-groomer">by {g.groomer}</div>
                  <div className="groom-rating">
                    <div className="groom-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>{g.rating} ({g.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="groom-services">
                {g.services.map((s) => (
                  <span key={s} className="groom-service-tag">{s}</span>
                ))}
              </div>

              <div className="groom-details">
                <div><strong>From:</strong> {formatLKR(g.priceFrom)}</div>
                <div><strong>Pets:</strong> {g.petTypes.join(", ")}</div>
                <div className="groom-detail-row">
                  <MapPin size={14} color="#6b7280" /> {g.address}
                </div>
                <div className="groom-detail-row">
                  <Clock size={14} color="#6b7280" /> {g.hours}
                </div>
                {g.mobile && (
                  <span className="groom-mobile-tag">🚐 Home Visits Available</span>
                )}
              </div>

              <div className="groom-actions">
                <button className="groom-book-btn" onClick={() => handleOpenBooking(g)}>
                  <Calendar size={16} /> Book Grooming
                </button>
                <a href={`tel:${g.phone}`} className="groom-call-btn" title="Call Salon">
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredGroomers.length === 0 && (
          <div className="groom-empty">
            <p>No groomers match your search. Try a different city or service.</p>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingGroomer && (
        <div className="groom-modal-overlay" onClick={() => setBookingGroomer(null)}>
          <div className="groom-modal" onClick={(e) => e.stopPropagation()}>
            <button className="groom-modal-close" onClick={() => setBookingGroomer(null)} aria-label="Close">
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="groom-success">
                <CheckCircle2 size={56} color="#16a34a" />
                <h3>Grooming Appointment Confirmed!</h3>
                <p>
                  We've reserved a <strong>{bookingForm.service}</strong> slot for{" "}
                  <strong>{bookingForm.petName}</strong> at <strong>{bookingGroomer.name}</strong>.
                  You will receive an SMS reminder.
                </p>
              </div>
            ) : (
              <div>
                <div className="groom-modal-head">
                  <div className="groom-avatar small">{getInitials(bookingGroomer.name)}</div>
                  <div>
                    <h3>Book Grooming at {bookingGroomer.name}</h3>
                    <span>{bookingGroomer.groomer} • {bookingGroomer.location}</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="groom-form">
                  <div className="groom-form-row">
                    <div>
                      <label>Pet's Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Milo"
                        value={bookingForm.petName}
                        onChange={(e) => updateForm("petName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Pet Type</label>
                      <select value={bookingForm.petType} onChange={(e) => updateForm("petType", e.target.value)}>
                        {bookingGroomer.petTypes.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="groom-form-row">
                    <div>
                      <label>Service *</label>
                      <select value={bookingForm.service} onChange={(e) => updateForm("service", e.target.value)}>
                        {bookingGroomer.services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Where?</label>
                      <select
                        value={bookingForm.visitType}
                        onChange={(e) => updateForm("visitType", e.target.value)}
                        disabled={!bookingGroomer.mobile}
                      >
                        <option value="At Salon">At Salon</option>
                        {bookingGroomer.mobile && <option value="Home Visit">Home Visit</option>}
                      </select>
                    </div>
                  </div>

                  <div className="groom-form-row">
                    <div>
                      <label>Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.preferredDate}
                        onChange={(e) => updateForm("preferredDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Preferred Time Slot</label>
                      <select value={bookingForm.preferredTime} onChange={(e) => updateForm("preferredTime", e.target.value)}>
                        <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                        <option value="Afternoon (1pm - 4pm)">Afternoon (1pm - 4pm)</option>
                        <option value="Evening (5pm - 7pm)">Evening (5pm - 7pm)</option>
                      </select>
                    </div>
                  </div>

                  <div className="groom-form-row">
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
                    <label>Notes for the Groomer</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Short summer cut, sensitive skin, nervous around dryers..."
                      value={bookingForm.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <div className="groom-price-note">
                    Starting from <strong>{formatLKR(bookingGroomer.priceFrom)}</strong>. Final price depends on your pet's size and coat.
                  </div>

                  <button type="submit" className="groom-submit-btn">
                    <Calendar size={18} /> Confirm Grooming Booking
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

export default Grooming;