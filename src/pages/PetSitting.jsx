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
  Home as HomeIcon,
  Star,
  CheckCircle2,
  X,
  Check,
  ShieldCheck,
  Heart,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PetSitting.css";

const sitterList = [
  {
    id: 1,
    name: "Happy Paws Home Stay",
    sitter: "Dilani Jayasuriya",
    location: "Colombo",
    address: "42 Havelock Road, Colombo 05",
    phone: "011-250-9182",
    hours: "24/7 Availability",
    rating: 4.9,
    reviews: 86,
    verified: true,
    overnight: true,
    pricePerDay: 2500,
    petTypes: ["Dog", "Cat"],
    services: ["Day Sitting", "Overnight Boarding", "Dog Walking", "Medication Admin"],
    highlights: ["Fenced Garden", "Constant Updates", "AC Rooms"]
  },
  {
    id: 2,
    name: "Warm Whiskers Cat Care",
    sitter: "Nadeeka Fernando",
    location: "Nugegoda",
    address: "15 Chapel Road, Nugegoda",
    phone: "077-412-8830",
    hours: "Every day, 8am–8pm",
    rating: 5.0,
    reviews: 64,
    verified: true,
    overnight: false,
    pricePerDay: 1800,
    petTypes: ["Cat"],
    services: ["Home Visits", "Feeding & Litter", "Play Sessions", "Medication Admin"],
    highlights: ["Cat Specialist", "Daily Photo/Video Updates", "Quiet Environment"]
  },
  {
    id: 3,
    name: "Kandy Mountain Pet Haven",
    sitter: "Sanjaya Bandara",
    location: "Kandy",
    address: "78 Peradeniya Road, Kandy",
    phone: "081-220-4491",
    hours: "24/7 Availability",
    rating: 4.8,
    reviews: 52,
    verified: true,
    overnight: true,
    pricePerDay: 2200,
    petTypes: ["Dog", "Cat", "Rabbit"],
    services: ["Overnight Boarding", "Farm Stay & Play", "Grooming Add-on"],
    highlights: ["Spacious Outdoor Run", "Vet On Call", "Custom Diets"]
  },
  {
    id: 4,
    name: "Southern Paws Sitting",
    sitter: "Anura Mendis",
    location: "Galle",
    address: "22 Light House Street, Galle Fort",
    phone: "091-223-1184",
    hours: "Mon–Sun, 7am–9pm",
    rating: 4.7,
    reviews: 39,
    verified: true,
    overnight: true,
    pricePerDay: 2000,
    petTypes: ["Dog"],
    services: ["Day Sitting", "Beach Walks", "Overnight Care"],
    highlights: ["Beach Exercise", "Cage-Free", "Experienced with Seniors"]
  },
  {
    id: 5,
    name: "Pet Nanny Colombo",
    sitter: "Tharushi De Silva",
    location: "Maharagama",
    address: "88 Pamunuwa Road, Maharagama",
    phone: "011-289-5501",
    hours: "Every day, 7:30am–8:30pm",
    rating: 4.9,
    reviews: 73,
    verified: true,
    overnight: true,
    pricePerDay: 2400,
    petTypes: ["Dog", "Cat", "Rabbit"],
    services: ["Day Care", "Home Visits", "Puppy Care", "Overnight Boarding"],
    highlights: ["First Aid Certified", "CCTV Monitored", "Pickup & Drop Available"]
  }
];

const formatLKR = (n) => `LKR ${n.toLocaleString("en-LK")}`;

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function PetSitting() {
  const { language, toggleLanguage } = useLanguage();
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [petFilter, setPetFilter] = useState("All");
  const [overnightOnly, setOvernightOnly] = useState(false);

  const [bookingSitter, setBookingSitter] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(sitterList.map((s) => s.location))];
  const petTypes = ["All", "Dog", "Cat", "Rabbit"];

  const filteredSitters = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return sitterList.filter((sitter) => {
      const matchSearch =
        sitter.name.toLowerCase().includes(search) ||
        sitter.sitter.toLowerCase().includes(search) ||
        sitter.address.toLowerCase().includes(search) ||
        sitter.services.some((srv) => srv.toLowerCase().includes(search));
      const matchCity = cityFilter === "All" || sitter.location === cityFilter;
      const matchPet = petFilter === "All" || sitter.petTypes.includes(petFilter);
      const matchOvernight = !overnightOnly || sitter.overnight;
      return matchSearch && matchCity && matchPet && matchOvernight;
    });
  }, [searchTerm, cityFilter, petFilter, overnightOnly]);

  const openBooking = (sitter) => {
    setBookingSitter(sitter);
    setBookingSuccess(false);
    setBookingForm({
      petName: "",
      petType: sitter.petTypes[0] || "Dog",
      service: sitter.services[0] || "Day Sitting",
      startDate: "",
      endDate: "",
      ownerName: currentUser?.name || "",
      phone: currentUser?.phone || "",
      notes: ""
    });
  };

  const closeBooking = () => {
    setBookingSitter(null);
    setBookingSuccess(false);
  };

  const updateForm = (field, val) => {
    setBookingForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    showToast(`Request sent to ${bookingSitter.name}!`);
    setTimeout(() => {
      closeBooking();
    }, 2000);
  };

  return (
    <div className="sitting-page">
      {/* Toast */}
      {toastMessage && <div className="sitting-toast">{toastMessage}</div>}

      <Navbar />

      {/* Hero */}
      <section className="sitting-hero">
        <div className="sitting-hero-text">
          <span className="hero-pill"><Sparkles size={14} /> Caring Hands While You're Away</span>
          <h1>Loving, Verified <span>Pet Sitters</span> Near You</h1>
          <p>
            Whether you need day visits, regular dog walks, or overnight boarding, find loving and
            vetted pet sitters across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sitting-search-section">
        <div className="sitting-search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by sitter name, service, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="sitting-filter-row">
          <div className="filter-group">
            <label>City</label>
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Pet Type</label>
            <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)}>
              {petTypes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={overnightOnly}
              onChange={(e) => setOvernightOnly(e.target.checked)}
            />
            <span>Overnight Boarding Available</span>
          </label>
        </div>
      </section>

      {/* Sitter Directory Grid */}
      <section className="sitting-list-section">
        <div className="section-header">
          <h2>Available Sitters & Day Care ({filteredSitters.length})</h2>
          <p>Book directly or schedule a free meet-and-greet</p>
        </div>

        {filteredSitters.length === 0 ? (
          <div className="sitting-empty">
            <p>No pet sitters match your current search criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCityFilter("All");
                setPetFilter("All");
                setOvernightOnly(false);
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="sitting-grid">
            {filteredSitters.map((sitter) => (
              <div key={sitter.id} className="sitter-card">
                <div className="sitter-card-header">
                  <div className="sitter-avatar">
                    {getInitials(sitter.sitter)}
                  </div>
                  <div className="sitter-title-box">
                    <div className="sitter-name-row">
                      <h3>{sitter.name}</h3>
                      {sitter.verified && (
                        <span className="verified-badge" title="Verified Sitter">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      )}
                    </div>
                    <span className="sitter-person">Host: {sitter.sitter}</span>
                  </div>
                </div>

                <div className="sitter-rating-row">
                  <div className="stars">
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <strong>{sitter.rating.toFixed(1)}</strong>
                    <span className="reviews">({sitter.reviews} reviews)</span>
                  </div>
                  <span className="price-tag">From <strong>{formatLKR(sitter.pricePerDay)}</strong>/day</span>
                </div>

                <div className="sitter-info-rows">
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{sitter.address}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{sitter.hours}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={16} />
                    <a href={`tel:${sitter.phone}`}>{sitter.phone}</a>
                  </div>
                </div>

                <div className="sitter-tags">
                  {sitter.services.map((srv) => (
                    <span key={srv} className="tag-service">{srv}</span>
                  ))}
                </div>

                <div className="sitter-highlights">
                  {sitter.highlights.map((h) => (
                    <span key={h} className="tag-highlight">✓ {h}</span>
                  ))}
                </div>

                <div className="sitter-card-actions">
                  <button className="book-btn" onClick={() => openBooking(sitter)}>
                    <Calendar size={16} /> Book Sitting
                  </button>
                  <a href={`tel:${sitter.phone}`} className="call-btn" title="Call Host">
                    <Phone size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingSitter && (
        <div className="sitting-modal-overlay" onClick={closeBooking}>
          <div className="sitting-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeBooking}>
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="modal-success">
                <CheckCircle2 size={54} color="#10b981" />
                <h3>Booking Request Received!</h3>
                <p>
                  <strong>{bookingSitter.name}</strong> will contact you on{" "}
                  <strong>{bookingForm.phone}</strong> to confirm your dates.
                </p>
              </div>
            ) : (
              <div>
                <h2>Book Pet Sitting</h2>
                <p className="modal-subtitle">
                  with <strong>{bookingSitter.name}</strong> ({bookingSitter.sitter})
                </p>

                <form onSubmit={handleBookingSubmit} className="sitting-form">
                  <div className="form-row">
                    <div>
                      <label>Pet Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.petName}
                        onChange={(e) => updateForm("petName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Pet Type</label>
                      <select
                        value={bookingForm.petType}
                        onChange={(e) => updateForm("petType", e.target.value)}
                      >
                        {bookingSitter.petTypes.map((pt) => (
                          <option key={pt} value={pt}>{pt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label>Service *</label>
                      <select
                        value={bookingForm.service}
                        onChange={(e) => updateForm("service", e.target.value)}
                      >
                        {bookingSitter.services.map((srv) => (
                          <option key={srv} value={srv}>{srv}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Start Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.startDate}
                        onChange={(e) => updateForm("startDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div>
                      <label>End Date (Optional)</label>
                      <input
                        type="date"
                        value={bookingForm.endDate}
                        onChange={(e) => updateForm("endDate", e.target.value)}
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
                    <label>Owner Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.ownerName}
                      onChange={(e) => updateForm("ownerName", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Care Instructions / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Feeding schedule, medication times, favorite toys..."
                      value={bookingForm.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <div className="price-note">
                    Rate: <strong>{formatLKR(bookingSitter.pricePerDay)}/day</strong>. Sitter confirms final total based on duration.
                  </div>

                  <button type="submit" className="confirm-btn">
                    <Check size={18} /> Confirm Booking Request
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

export default PetSitting;
