import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
  ShieldCheck,
  Sparkles,
  Navigation
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PetTransport.css";

const transportList = [
  {
    id: 1,
    name: "PetTaxi Colombo & Suburbs",
    driver: "Pradeep Wickramasinghe",
    location: "Colombo",
    address: "Coverage: Colombo, Dehiwala, Mount Lavinia, Battaramulla",
    phone: "077-555-1290",
    hours: "24/7 Emergency & Scheduled",
    rating: 4.9,
    reviews: 94,
    verified: true,
    acVehicle: true,
    priceFrom: 1500,
    vehicleType: "Air-Conditioned Pet Van & Cabs",
    services: ["Vet Visits", "Airport Transfers", "Relocation", "Inter-City Trips"],
    features: ["Crate / Carrier Provided", "Safety Harnesses", "Live GPS Sharing"]
  },
  {
    id: 2,
    name: "SafeRide Pet Ambulance & Transit",
    driver: "Kavinda Jayawardena",
    location: "Nugegoda",
    address: "Coverage: Nugegoda, Kottawa, Maharagama, Homagama",
    phone: "071-889-4422",
    hours: "24/7 Emergency Transport",
    rating: 5.0,
    reviews: 68,
    verified: true,
    acVehicle: true,
    priceFrom: 2000,
    vehicleType: "Emergency Pet Ambulance",
    services: ["Emergency Vet Transport", "Stretcher Service", "Oxygen Equipped"],
    features: ["Oxygen Onboard", "Trained Pet First-Aider", "Vet Pre-Alert"]
  },
  {
    id: 3,
    name: "Central Highlands Pet Movers",
    driver: "Nuwan Bandara",
    location: "Kandy",
    address: "Coverage: Kandy, Matale, Peradeniya & Island-Wide",
    phone: "081-445-6677",
    hours: "Mon–Sun, 6am–10pm",
    rating: 4.8,
    reviews: 47,
    verified: true,
    acVehicle: true,
    priceFrom: 2500,
    vehicleType: "Spacious SUV",
    services: ["Island-Wide Relocation", "Vet Appointments", "Boarding Pick & Drop"],
    features: ["Hydration Stops", "Sanitized Interior", "Large Dog Friendly"]
  },
  {
    id: 4,
    name: "Southern Coastal Pet Express",
    driver: "Suranga Silva",
    location: "Galle",
    address: "Coverage: Galle, Matara, Hikkaduwa, Bentota",
    phone: "091-778-3344",
    hours: "Every day, 7am–9pm",
    rating: 4.8,
    reviews: 35,
    verified: true,
    acVehicle: true,
    priceFrom: 1800,
    vehicleType: "AC Hatchback / Van",
    services: ["Local Rides", "Express to Colombo Vets", "Beach / Day-out Transit"],
    features: ["Water & Treats", "Seat Protection", "Calm Driving Guarantee"]
  }
];

const formatLKR = (n) => `LKR ${n.toLocaleString("en-LK")}`;

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function PetTransport() {
  const { language, toggleLanguage } = useLanguage();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  const [bookingRide, setBookingRide] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(transportList.map((t) => t.location))];

  const filteredTransports = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return transportList.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search) ||
        item.driver.toLowerCase().includes(search) ||
        item.address.toLowerCase().includes(search) ||
        item.services.some((srv) => srv.toLowerCase().includes(search));
      const matchCity = cityFilter === "All" || item.location === cityFilter;
      return matchSearch && matchCity;
    });
  }, [searchTerm, cityFilter]);

  const openBooking = (ride) => {
    setBookingRide(ride);
    setBookingSuccess(false);
    setBookingForm({
      petType: "Dog",
      service: ride.services[0] || "Vet Visits",
      pickupAddress: "",
      dropAddress: "",
      rideDate: "",
      rideTime: "Morning",
      ownerName: currentUser?.name || "",
      phone: currentUser?.phone || "",
      notes: ""
    });
  };

  const closeBooking = () => {
    setBookingRide(null);
    setBookingSuccess(false);
  };

  const updateForm = (field, val) => {
    setBookingForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    showToast(`Ride request sent to ${bookingRide.name}!`);
    setTimeout(() => {
      closeBooking();
    }, 2000);
  };

  return (
    <div className="transport-page">
      {/* Toast */}
      {toastMessage && <div className="transport-toast">{toastMessage}</div>}

      <Navbar />

      {/* Hero */}
      <section className="transport-hero">
        <div className="transport-hero-text">
          <span className="hero-pill"><Sparkles size={14} /> Safe Pet Journeys</span>
          <h1>Comfortable & Safe <span>Pet Transport</span></h1>
          <p>
            From scheduled vet checkups to island-wide relocations and emergency ambulance rides,
            trust caring drivers with pet-ready, sanitized vehicles.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="transport-search-section">
        <div className="transport-search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by driver, service, or coverage area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="transport-filter-row">
          <div className="filter-group">
            <label>Region / Hub</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Transport Directory Grid */}
      <section className="transport-list-section">
        <div className="section-header">
          <h2>Available Pet Transporters & Taxis ({filteredTransports.length})</h2>
          <p>Direct bookings with upfront rates</p>
        </div>

        {filteredTransports.length === 0 ? (
          <div className="transport-empty">
            <p>No pet transport services match your search.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCityFilter("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="transport-grid">
            {filteredTransports.map((ride) => (
              <div key={ride.id} className="transport-card">
                <div className="transport-card-header">
                  <div className="transport-avatar">
                    {getInitials(ride.driver)}
                  </div>
                  <div className="transport-title-box">
                    <div className="transport-name-row">
                      <h3>{ride.name}</h3>
                      {ride.verified && (
                        <span className="verified-badge" title="Verified Driver">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      )}
                    </div>
                    <span className="driver-person">Driver: {ride.driver} • {ride.vehicleType}</span>
                  </div>
                </div>

                <div className="transport-rating-row">
                  <div className="stars">
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <strong>{ride.rating.toFixed(1)}</strong>
                    <span className="reviews">({ride.reviews} reviews)</span>
                  </div>
                  <span className="price-tag">From <strong>{formatLKR(ride.priceFrom)}</strong></span>
                </div>

                <div className="transport-info-rows">
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{ride.address}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{ride.hours}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={16} />
                    <a href={`tel:${ride.phone}`}>{ride.phone}</a>
                  </div>
                </div>

                <div className="transport-tags">
                  {ride.services.map((srv) => (
                    <span key={srv} className="tag-service">{srv}</span>
                  ))}
                </div>

                <div className="transport-highlights">
                  {ride.features.map((f) => (
                    <span key={f} className="tag-feature">✓ {f}</span>
                  ))}
                </div>

                <div className="transport-card-actions">
                  <button className="book-btn" onClick={() => openBooking(ride)}>
                    <Calendar size={16} /> Book Ride
                  </button>
                  <a href={`tel:${ride.phone}`} className="call-btn" title="Call Driver">
                    <Phone size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingRide && (
        <div className="transport-modal-overlay" onClick={closeBooking}>
          <div className="transport-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeBooking}>
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="modal-success">
                <CheckCircle2 size={54} color="#10b981" />
                <h3>Ride Request Received!</h3>
                <p>
                  <strong>{bookingRide.name}</strong> will call you at{" "}
                  <strong>{bookingForm.phone}</strong> shortly to confirm pickup coordinates.
                </p>
              </div>
            ) : (
              <div>
                <h2>Book Pet Transport</h2>
                <p className="modal-subtitle">
                  with <strong>{bookingRide.name}</strong> ({rideDriver(bookingRide)})
                </p>

                <form onSubmit={handleBookingSubmit} className="transport-form">
                  <div className="form-row">
                    <div>
                      <label>Pet Type</label>
                      <select
                        value={bookingForm.petType}
                        onChange={(e) => updateForm("petType", e.target.value)}
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Other">Other Pet</option>
                      </select>
                    </div>
                    <div>
                      <label>Service Type</label>
                      <select
                        value={bookingForm.service}
                        onChange={(e) => updateForm("service", e.target.value)}
                      >
                        {bookingRide.services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label>Pickup Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15 Colombo Road, Nugegoda"
                      value={bookingForm.pickupAddress}
                      onChange={(e) => updateForm("pickupAddress", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Destination Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Happy Paws Vet Clinic, Colombo 05"
                      value={bookingForm.dropAddress}
                      onChange={(e) => updateForm("dropAddress", e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div>
                      <label>Pickup Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.rideDate}
                        onChange={(e) => updateForm("rideDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Preferred Time Slot</label>
                      <select
                        value={bookingForm.rideTime}
                        onChange={(e) => updateForm("rideTime", e.target.value)}
                      >
                        <option value="Morning (7am - 11am)">Morning (7am - 11am)</option>
                        <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                        <option value="Evening (5pm - 8pm)">Evening (5pm - 8pm)</option>
                        <option value="ASAP Emergency">ASAP Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label>Owner Name *</label>
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
                    <label>Notes / Crate Requirements</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need large crate provided, anxious pet, one person travelling with pet..."
                      value={bookingForm.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <div className="price-note">
                    Base Fare starts at <strong>{formatLKR(bookingRide.priceFrom)}</strong>. Final fare depends on travel distance.
                  </div>

                  <button type="submit" className="confirm-btn">
                    <Check size={18} /> Confirm Ride Request
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

const rideDriver = (ride) => ride?.driver || "Driver";

export default PetTransport;
