import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Clock,
  MapPin,
  Calendar,
  Car,
  Star,
  CheckCircle2,
  X,
  Check,
  Siren,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PetTransport.css";

const transportList = [
  {
    id: 1,
    name: "PetRide Colombo",
    driver: "Nuwan Karunaratne",
    location: "Colombo",
    coverage: "Colombo & suburbs, airport transfers",
    phone: "077-901-3345",
    hours: "Every day, 6am–10pm",
    rating: 4.9,
    reviews: 112,
    vehicle: "AC Pet Van",
    emergency: false,
    baseFare: 1500,
    perKm: 120,
    petSizes: ["Small", "Medium", "Large"],
    trips: ["Vet Visits", "Airport Transfer", "Grooming Drop-off", "Home Relocation"],
    amenities: ["Air conditioned", "Crates provided", "Live GPS tracking"]
  },
  {
    id: 2,
    name: "Paws Ambulance 24/7",
    driver: "Kavinda Mendis",
    location: "Nugegoda",
    coverage: "Western Province, emergency runs anytime",
    phone: "070-224-8811",
    hours: "24 hours, 7 days",
    rating: 4.8,
    reviews: 64,
    vehicle: "Pet Ambulance",
    emergency: true,
    baseFare: 3000,
    perKm: 180,
    petSizes: ["Small", "Medium", "Large"],
    trips: ["Emergency Vet Run", "Vet Visits", "Post-surgery Pickup"],
    amenities: ["Stretcher & oxygen", "Trained pet first-aider", "Air conditioned"]
  },
  {
    id: 3,
    name: "Island Pet Movers",
    driver: "Chathura Weerasinghe",
    location: "Kandy",
    coverage: "Inter-city trips across Sri Lanka",
    phone: "081-223-5590",
    hours: "Mon–Sat, 7am–7pm",
    rating: 4.7,
    reviews: 41,
    vehicle: "Pet Taxi (Car)",
    emergency: false,
    baseFare: 1000,
    perKm: 95,
    petSizes: ["Small", "Medium"],
    trips: ["Inter-city Travel", "Vet Visits", "Boarding Drop-off"],
    amenities: ["Seat covers & harness", "Water & rest stops", "Owner can ride along"]
  }
];

const formatLKR = (n) => `LKR ${n.toLocaleString("en-LK")}`;

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const today = () => new Date().toISOString().split("T")[0];

function PetTransport() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [tripFilter, setTripFilter] = useState("All");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Booking Modal
  const [bookingService, setBookingService] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(transportList.map((s) => s.location))];
  const tripTypes = ["All", ...new Set(transportList.flatMap((s) => s.trips))];

  const filteredServices = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return transportList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search) ||
        s.driver.toLowerCase().includes(search) ||
        s.location.toLowerCase().includes(search) ||
        s.vehicle.toLowerCase().includes(search) ||
        s.trips.some((tr) => tr.toLowerCase().includes(search));
      const matchesCity = cityFilter === "All" || s.location === cityFilter;
      const matchesTrip = tripFilter === "All" || s.trips.includes(tripFilter);
      const matchesEmergency = !emergencyOnly || s.emergency;
      return matchesSearch && matchesCity && matchesTrip && matchesEmergency;
    });
  }, [searchTerm, cityFilter, tripFilter, emergencyOnly]);

  const resetFilters = () => {
    setSearchTerm("");
    setCityFilter("All");
    setTripFilter("All");
    setEmergencyOnly(false);
  };

  const handleOpenBooking = (service) => {
    setBookingService(service);
    setBookingSuccess(false);
    setBookingForm({
      petName: currentUser?.myPets?.[0]?.name || "",
      petType: currentUser?.myPets?.[0]?.type || "Dog",
      petSize: service.petSizes[0],
      tripType: tripFilter !== "All" && service.trips.includes(tripFilter)
        ? tripFilter
        : service.trips[0],
      pickup: "",
      dropoff: "",
      date: today(),
      time: "",
      returnTrip: false,
      ownerRiding: false,
      ownerName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
      notes: ""
    });
  };

  const updateForm = (field, value) => setBookingForm((f) => ({ ...f, [field]: value }));

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      const name = bookingService.name;
      setBookingService(null);
      setBookingSuccess(false);
      showToast(`Ride booked with ${name}! The driver will call to confirm.`);
    }, 2400);
  };

  return (
    <div className="transport-page">
      {/* Toast */}
      {toastMessage && (
        <div className="trans-toast">
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
          <Link to="/sitting">Pet Sitting</Link>
          <Link to="/transport" className="active">Transport</Link>
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
      <section className="trans-header">
        <div className="trans-header-pill">
          <Car size={14} /> Pet-Friendly Rides Across Sri Lanka
        </div>
        <h2>Pet Transport Near You</h2>
        <p>Safe journeys for pets. Vet visits, airport transfers, relocations and emergency runs.</p>
      </section>

      {/* Emergency Spotlight */}
      <section className="trans-spotlight-section">
        <div className="trans-spotlight-card">
          <div className="trans-spotlight-icon">
            <Siren size={26} />
          </div>
          <div className="trans-spotlight-content">
            <div className="trans-spotlight-badge">
              <Sparkles size={11} /> 24/7 PET AMBULANCE
            </div>
            <h3>Pet emergency? Get to the vet fast</h3>
            <p>Pet ambulances with first-aid trained staff, ready day and night.</p>
          </div>
          <button
            className="trans-spotlight-btn"
            onClick={() => setEmergencyOnly(true)}
          >
            Show Emergency Rides ➔
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="trans-filters-wrap">
        <div className="trans-filters">
          <div className="trans-search">
            <Search size={18} className="trans-search-icon" />
            <input
              type="text"
              placeholder="Search by service, vehicle, trip type or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="trans-filter-controls">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((city) => (
                <option key={city} value={city}>{city === "All" ? "All Locations" : city}</option>
              ))}
            </select>

            <select value={tripFilter} onChange={(e) => setTripFilter(e.target.value)}>
              {tripTypes.map((tr) => (
                <option key={tr} value={tr}>{tr === "All" ? "All Trip Types" : tr}</option>
              ))}
            </select>

            <label className={`trans-toggle ${emergencyOnly ? "on" : ""}`}>
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
              />
              <span>🚨 24/7 Emergency</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Listing */}
      <section className="trans-results">
        <p className="trans-results-count">
          Found {filteredServices.length} pet transport services
        </p>

        <div className="trans-grid">
          {filteredServices.map((s) => (
            <div key={s.id} className="trans-card">
              <div className="trans-card-top">
                <div className="trans-avatar">{getInitials(s.name)}</div>
                <div>
                  <h3>{s.name}</h3>
                  <div className="trans-driver">{s.vehicle} • {s.driver}</div>
                  <div className="trans-rating">
                    <div className="trans-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>{s.rating} ({s.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="trans-services">
                {s.trips.map((tr) => (
                  <span key={tr} className="trans-service-tag">{tr}</span>
                ))}
              </div>

              <div className="trans-details">
                <div>
                  <strong>Fare:</strong> {formatLKR(s.baseFare)} base + {formatLKR(s.perKm)} / km
                </div>
                <div><strong>Pet sizes:</strong> {s.petSizes.join(", ")}</div>
                <div><strong>Includes:</strong> {s.amenities.join(" • ")}</div>
                <div className="trans-detail-row">
                  <MapPin size={14} color="#6b7280" /> {s.coverage}
                </div>
                <div className="trans-detail-row">
                  <Clock size={14} color="#6b7280" /> {s.hours}
                </div>
                {s.emergency && (
                  <span className="trans-emergency-tag">🚨 24/7 Emergency Pet Ambulance</span>
                )}
              </div>

              <div className="trans-actions">
                <button className="trans-book-btn" onClick={() => handleOpenBooking(s)}>
                  <Calendar size={16} /> Book Ride
                </button>
                <a href={`tel:${s.phone}`} className="trans-call-btn" title="Call Driver">
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="trans-empty">
            <p>No transport services match your search. Try a different city or trip type.</p>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingService && (
        <div className="trans-modal-overlay" onClick={() => setBookingService(null)}>
          <div className="trans-modal" onClick={(e) => e.stopPropagation()}>
            <button className="trans-modal-close" onClick={() => setBookingService(null)} aria-label="Close">
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="trans-success">
                <CheckCircle2 size={56} color="#16a34a" />
                <h3>Pet Ride Confirmed!</h3>
                <p>
                  <strong>{bookingService.name}</strong> will pick up <strong>{bookingForm.petName}</strong> from{" "}
                  <strong>{bookingForm.pickup}</strong> on <strong>{bookingForm.date}</strong> at{" "}
                  <strong>{bookingForm.time}</strong>. The driver will call before arriving.
                </p>
              </div>
            ) : (
              <div>
                <div className="trans-modal-head">
                  <div className="trans-avatar small">{getInitials(bookingService.name)}</div>
                  <div>
                    <h3>Book a Ride with {bookingService.name}</h3>
                    <span>{bookingService.vehicle} • {bookingService.location}</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="trans-form">
                  <div className="trans-form-row">
                    <div>
                      <label>Pet's Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Max"
                        value={bookingForm.petName}
                        onChange={(e) => updateForm("petName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Pet Type</label>
                      <select value={bookingForm.petType} onChange={(e) => updateForm("petType", e.target.value)}>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="trans-form-row">
                    <div>
                      <label>Pet Size</label>
                      <select value={bookingForm.petSize} onChange={(e) => updateForm("petSize", e.target.value)}>
                        {bookingService.petSizes.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz} {sz === "Small" ? "(under 10kg)" : sz === "Medium" ? "(10–25kg)" : "(over 25kg)"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Trip Type *</label>
                      <select value={bookingForm.tripType} onChange={(e) => updateForm("tripType", e.target.value)}>
                        {bookingService.trips.map((tr) => (
                          <option key={tr} value={tr}>{tr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Pickup Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12 Galle Road, Colombo 03"
                      value={bookingForm.pickup}
                      onChange={(e) => updateForm("pickup", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Drop-off Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PawCare Animal Clinic, Nugegoda"
                      value={bookingForm.dropoff}
                      onChange={(e) => updateForm("dropoff", e.target.value)}
                    />
                  </div>

                  <div className="trans-form-row">
                    <div>
                      <label>Pickup Date *</label>
                      <input
                        type="date"
                        required
                        min={today()}
                        value={bookingForm.date}
                        onChange={(e) => updateForm("date", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Pickup Time *</label>
                      <input
                        type="time"
                        required
                        value={bookingForm.time}
                        onChange={(e) => updateForm("time", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="trans-checks">
                    <label className="trans-check">
                      <input
                        type="checkbox"
                        checked={bookingForm.returnTrip}
                        onChange={(e) => updateForm("returnTrip", e.target.checked)}
                      />
                      <span>I need a return trip</span>
                    </label>
                    <label className="trans-check">
                      <input
                        type="checkbox"
                        checked={bookingForm.ownerRiding}
                        onChange={(e) => updateForm("ownerRiding", e.target.checked)}
                      />
                      <span>I'll ride along with my pet</span>
                    </label>
                  </div>

                  <div className="trans-form-row">
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
                    <label>Notes for the Driver</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Gets car sick, needs a crate, injured back leg..."
                      value={bookingForm.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <div className="trans-price-note">
                    Fare is <strong>{formatLKR(bookingService.baseFare)}</strong> base +{" "}
                    <strong>{formatLKR(bookingService.perKm)} / km</strong>
                    {bookingForm.returnTrip && ", charged both ways for a return trip"}. The driver confirms the final fare by phone.
                  </div>

                  <button type="submit" className="trans-submit-btn">
                    <Calendar size={18} /> Confirm Ride Booking
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

export default PetTransport;