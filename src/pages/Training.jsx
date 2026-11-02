import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Phone,
  Clock,
  MapPin,
  Calendar,
  GraduationCap,
  Star,
  CheckCircle2,
  X,
  Check,
  Award,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Training.css";

const trainerList = [
  {
    id: 1,
    name: "Good Boy Academy",
    trainer: "Ravindu Perera",
    location: "Colombo",
    address: "18 Vihara Mawatha, Colombo 06",
    phone: "077-312-4598",
    hours: "Tue–Sun, 7am–6pm",
    rating: 5.0,
    reviews: 102,
    experience: "11 Years",
    certified: true,
    homeTraining: true,
    priceFrom: 3000,
    programs: ["Puppy Basics", "Obedience", "Leash Training", "Behaviour Correction"],
    sessionTypes: ["Private 1-on-1", "Group Class", "Home Visit"]
  },
  {
    id: 2,
    name: "Paws & Commands",
    trainer: "Hiruni Senanayake",
    location: "Nugegoda",
    address: "62 Stanley Thilakaratne Mawatha, Nugegoda",
    phone: "011-281-7764",
    hours: "Mon–Sat, 8am–5pm",
    rating: 4.8,
    reviews: 67,
    experience: "7 Years",
    certified: true,
    homeTraining: false,
    priceFrom: 2500,
    programs: ["Puppy Basics", "Obedience", "Socialisation"],
    sessionTypes: ["Private 1-on-1", "Group Class"]
  },
  {
    id: 3,
    name: "Hill Country K9 Training",
    trainer: "Lahiru Dissanayake",
    location: "Kandy",
    address: "40 Lady Gordon's Drive, Kandy",
    phone: "081-220-5413",
    hours: "Every day, 7am–5pm",
    rating: 4.9,
    reviews: 48,
    experience: "9 Years",
    certified: false,
    homeTraining: true,
    priceFrom: 2000,
    programs: ["Obedience", "Agility", "Behaviour Correction", "Leash Training"],
    sessionTypes: ["Private 1-on-1", "Home Visit"]
  }
];

const formatLKR = (n) => `LKR ${n.toLocaleString("en-LK")}`;

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Training() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filter
  const [searchParams] = useSearchParams();
const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [cityFilter, setCityFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [homeOnly, setHomeOnly] = useState(false);

  // Booking Modal
  const [bookingTrainer, setBookingTrainer] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(trainerList.map((tr) => tr.location))];
  const programs = ["All", ...new Set(trainerList.flatMap((tr) => tr.programs))];

  const filteredTrainers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return trainerList.filter((tr) => {
      const matchesSearch =
        tr.name.toLowerCase().includes(search) ||
        tr.trainer.toLowerCase().includes(search) ||
        tr.location.toLowerCase().includes(search) ||
        tr.programs.some((p) => p.toLowerCase().includes(search));
      const matchesCity = cityFilter === "All" || tr.location === cityFilter;
      const matchesProgram = programFilter === "All" || tr.programs.includes(programFilter);
      const matchesHome = !homeOnly || tr.homeTraining;
      return matchesSearch && matchesCity && matchesProgram && matchesHome;
    });
  }, [searchTerm, cityFilter, programFilter, homeOnly]);

  const resetFilters = () => {
    setSearchTerm("");
    setCityFilter("All");
    setProgramFilter("All");
    setHomeOnly(false);
  };

  const handleOpenBooking = (trainer) => {
    setBookingTrainer(trainer);
    setBookingSuccess(false);
    setBookingForm({
      petName: currentUser?.myPets?.[0]?.name || "",
      petAge: "",
      program: programFilter !== "All" && trainer.programs.includes(programFilter)
        ? programFilter
        : trainer.programs[0],
      sessionType: trainer.sessionTypes[0],
      ownerName: currentUser?.fullName || "",
      phone: currentUser?.phone || "",
      preferredDate: new Date().toISOString().split("T")[0],
      preferredTime: "Morning (7am - 10am)",
      notes: ""
    });
  };

  const updateForm = (field, value) => setBookingForm((f) => ({ ...f, [field]: value }));

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      const name = bookingTrainer.name;
      setBookingTrainer(null);
      setBookingSuccess(false);
      showToast(`Training session booked with ${name}! Confirmation SMS sent.`);
    }, 2400);
  };

  return (
    <div className="training-page">
      {/* Toast */}
      {toastMessage && (
        <div className="train-toast">
          <Check size={18} color="#86efac" /> {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <section className="train-header">
        <div className="train-header-pill">
          <GraduationCap size={14} /> Professional Sri Lankan Pet Trainers
        </div>
        <h2>Pet Training Near You</h2>
        <p>Better habits, happier pets. Find a trainer for puppies, obedience or behaviour issues.</p>
      </section>

      {/* Puppy Program Spotlight */}
      <section className="train-spotlight-section">
        <div className="train-spotlight-card">
          <div className="train-spotlight-icon">
            <span>🐶</span>
          </div>
          <div className="train-spotlight-content">
            <div className="train-spotlight-badge">
              <Sparkles size={11} /> START EARLY, TRAIN EASY
            </div>
            <h3>New puppy at home? Start with Puppy Basics</h3>
            <p>Sit, stay, toilet training and gentle socialisation in short, fun sessions.</p>
          </div>
          <button
            className="train-spotlight-btn"
            onClick={() => setProgramFilter("Puppy Basics")}
          >
            Find Puppy Classes ➔
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="train-filters-wrap">
        <div className="train-filters">
          <div className="train-search">
            <Search size={18} className="train-search-icon" />
            <input
              type="text"
              placeholder="Search by trainer, program or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="train-filter-controls">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((city) => (
                <option key={city} value={city}>{city === "All" ? "All Locations" : city}</option>
              ))}
            </select>

            <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
              {programs.map((p) => (
                <option key={p} value={p}>{p === "All" ? "All Programs" : p}</option>
              ))}
            </select>

            <label className={`train-toggle ${homeOnly ? "on" : ""}`}>
              <input
                type="checkbox"
                checked={homeOnly}
                onChange={(e) => setHomeOnly(e.target.checked)}
              />
              <span>🏠 Home Training</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Listing */}
      <section className="train-results">
        <p className="train-results-count">
          Found {filteredTrainers.length} pet trainers and academies
        </p>

        <div className="train-grid">
          {filteredTrainers.map((tr) => (
            <div key={tr.id} className="train-card">
              <div className="train-card-top">
                <div className="train-avatar">{getInitials(tr.name)}</div>
                <div>
                  <h3>{tr.name}</h3>
                  <div className="train-trainer">by {tr.trainer}</div>
                  <div className="train-rating">
                    <div className="train-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>{tr.rating} ({tr.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="train-programs">
                {tr.programs.map((p) => (
                  <span key={p} className="train-program-tag">{p}</span>
                ))}
              </div>

              <div className="train-details">
                <div><strong>From:</strong> {formatLKR(tr.priceFrom)} / session</div>
                <div><strong>Experience:</strong> {tr.experience}</div>
                <div><strong>Sessions:</strong> {tr.sessionTypes.join(", ")}</div>
                <div className="train-detail-row">
                  <MapPin size={14} color="#6b7280" /> {tr.address}
                </div>
                <div className="train-detail-row">
                  <Clock size={14} color="#6b7280" /> {tr.hours}
                </div>
                {tr.certified && (
                  <span className="train-cert-tag">
                    <Award size={13} /> Certified Trainer
                  </span>
                )}
              </div>

              <div className="train-actions">
                <button className="train-book-btn" onClick={() => handleOpenBooking(tr)}>
                  <Calendar size={16} /> Book Session
                </button>
                <a href={`tel:${tr.phone}`} className="train-call-btn" title="Call Trainer">
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredTrainers.length === 0 && (
          <div className="train-empty">
            <p>No trainers match your search. Try a different city or program.</p>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {bookingTrainer && (
        <div className="train-modal-overlay" onClick={() => setBookingTrainer(null)}>
          <div className="train-modal" onClick={(e) => e.stopPropagation()}>
            <button className="train-modal-close" onClick={() => setBookingTrainer(null)} aria-label="Close">
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="train-success">
                <CheckCircle2 size={56} color="#16a34a" />
                <h3>Training Session Confirmed!</h3>
                <p>
                  <strong>{bookingForm.petName}</strong> is booked for{" "}
                  <strong>{bookingForm.program}</strong> ({bookingForm.sessionType}) with{" "}
                  <strong>{bookingTrainer.name}</strong>. You will receive an SMS reminder.
                </p>
              </div>
            ) : (
              <div>
                <div className="train-modal-head">
                  <div className="train-avatar small">{getInitials(bookingTrainer.name)}</div>
                  <div>
                    <h3>Book Training with {bookingTrainer.name}</h3>
                    <span>{bookingTrainer.trainer} • {bookingTrainer.location}</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="train-form">
                  <div className="train-form-row">
                    <div>
                      <label>Pet's Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rocky"
                        value={bookingForm.petName}
                        onChange={(e) => updateForm("petName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Pet's Age</label>
                      <input
                        type="text"
                        placeholder="e.g. 4 months"
                        value={bookingForm.petAge}
                        onChange={(e) => updateForm("petAge", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="train-form-row">
                    <div>
                      <label>Program *</label>
                      <select value={bookingForm.program} onChange={(e) => updateForm("program", e.target.value)}>
                        {bookingTrainer.programs.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Session Type</label>
                      <select value={bookingForm.sessionType} onChange={(e) => updateForm("sessionType", e.target.value)}>
                        {bookingTrainer.sessionTypes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="train-form-row">
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
                        <option value="Morning (7am - 10am)">Morning (7am - 10am)</option>
                        <option value="Midday (10am - 1pm)">Midday (10am - 1pm)</option>
                        <option value="Evening (3pm - 6pm)">Evening (3pm - 6pm)</option>
                      </select>
                    </div>
                  </div>

                  <div className="train-form-row">
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
                    <label>Behaviour or Goals</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Pulls on the leash, barks at visitors, needs toilet training..."
                      value={bookingForm.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                    />
                  </div>

                  <div className="train-price-note">
                    Sessions start from <strong>{formatLKR(bookingTrainer.priceFrom)}</strong>. The trainer will confirm the plan after a short assessment.
                  </div>

                  <button type="submit" className="train-submit-btn">
                    <Calendar size={18} /> Confirm Training Booking
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

export default Training;