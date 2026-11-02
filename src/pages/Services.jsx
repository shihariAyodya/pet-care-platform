import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Stethoscope,
  Scissors,
  GraduationCap,
  Home as HomeIcon,
  Car,
  Store,
  LayoutGrid
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Services.css";

// The 6 service categories. "count" matches how many providers each page lists.
const categories = [
  {
    key: "vets",
    title: "Veterinarians",
    tagline: "Keep your pet healthy.",
    description: "Check-ups, vaccinations, surgery and 24/7 emergency care.",
    path: "/vets",
    img: "/store/service_vet.png",
    Icon: Stethoscope,
    count: 5
  },
  {
    key: "grooming",
    title: "Grooming",
    tagline: "Look good. Feel good.",
    description: "Baths, haircuts, nail trims and mobile grooming at home.",
    path: "/grooming",
    img: "/store/service_grooming.png",
    Icon: Scissors,
    count: 5
  },
  {
    key: "training",
    title: "Training",
    tagline: "Better habits. Happier pets.",
    description: "Puppy basics, obedience, agility and behaviour correction.",
    path: "/training",
    img: "/store/service_training.png",
    Icon: GraduationCap,
    count: 3
  },
  {
    key: "sitting",
    title: "Pet Sitting",
    tagline: "Care when you can't be there.",
    description: "Home visits, day care, dog walking and overnight stays.",
    path: "/sitting",
    img: "/store/service_sitting.png",
    Icon: HomeIcon,
    count: 3
  },
  {
    key: "transport",
    title: "Pet Transport",
    tagline: "Safe journeys for pets.",
    description: "Vet rides, airport transfers, relocations and pet ambulances.",
    path: "/transport",
    img: "/store/service_transport.png",
    Icon: Car,
    count: 3
  },
  {
    key: "shops",
    title: "Pet Shops",
    tagline: "Everything they need.",
    description: "Food, toys, accessories and pet pharmacy, with delivery.",
    path: "/shops",
    img: "/store/service_shop.png",
    Icon: Store,
    count: 3
  }
];

// One top-rated provider from each page. Names match the data on those pages,
// so "View Profile" opens the page with that provider already searched.
const topProviders = [
  { name: "PawCare Animal Clinic", category: "Veterinarian", path: "/vets", city: "Nugegoda", rating: 4.9, reviews: 84, highlight: "24/7 Emergency" },
  { name: "Fluffy Styles Salon", category: "Grooming", path: "/grooming", city: "Colombo", rating: 4.9, reviews: 128, highlight: "From LKR 2,500" },
  { name: "Good Boy Academy", category: "Training", path: "/training", city: "Colombo", rating: 5.0, reviews: 102, highlight: "Certified Trainer" },
  { name: "Happy Tails Pet Care", category: "Pet Sitting", path: "/sitting", city: "Colombo", rating: 4.9, reviews: 87, highlight: "Overnight Stays" },
  { name: "PetRide Colombo", category: "Pet Transport", path: "/transport", city: "Colombo", rating: 4.9, reviews: 112, highlight: "AC Pet Van" },
  { name: "Pet Paradise Colombo", category: "Pet Shop", path: "/shops", city: "Colombo", rating: 4.8, reviews: 156, highlight: "Home Delivery" }
];

const profileLink = (p) => `${p.path}?q=${encodeURIComponent(p.name)}`;

function Services() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const search = searchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (c) =>
          !search ||
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search)
      ),
    [search]
  );

  const filteredProviders = useMemo(
    () =>
      topProviders.filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.city.toLowerCase().includes(search)
      ),
    [search]
  );

  const totalProviders = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="services-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Site Logo" className="site-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/browse">{t("nav.adopt")}</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/lost-found">{t("nav.lostFound")}</Link>
          <Link to="/services" className="active">Services</Link>
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
      <section className="svc-header">
        <div className="svc-header-pill">
          <LayoutGrid size={14} /> {totalProviders} trusted providers across Sri Lanka
        </div>
        <h2>All Pet Services</h2>
        <p>From everyday care to professional services, find trusted pet businesses near you.</p>

        <div className="svc-search">
          <Search size={18} className="svc-search-icon" />
          <input
            type="text"
            placeholder="Search services, businesses or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="svc-section">
        <h3 className="svc-section-title">Browse by Category</h3>

        <div className="svc-category-grid">
          {filteredCategories.map(({ key, title, tagline, description, path, img, Icon, count }) => (
            <Link key={key} to={path} className="svc-category-card">
              <div className="svc-category-img-wrap">
                <img src={img} alt={title} className="svc-category-img" />
                <div className="svc-category-icon"><Icon size={18} /></div>
              </div>
              <div className="svc-category-info">
                <div className="svc-category-top">
                  <h4>{title}</h4>
                  <span className="svc-count">{count} listed</span>
                </div>
                <p className="svc-tagline">{tagline}</p>
                <p className="svc-description">{description}</p>
                <span className="svc-cta">
                  Explore {title} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && filteredProviders.length === 0 && (
          <div className="svc-empty">
            <p>No services match "{searchTerm}".</p>
            <button onClick={() => setSearchTerm("")}>Clear Search</button>
          </div>
        )}
      </section>

      {/* Top Rated */}
      {filteredProviders.length > 0 && (
        <section className="svc-section">
          <h3 className="svc-section-title">Top Rated in Each Category</h3>

          <div className="svc-provider-grid">
            {filteredProviders.map((p) => (
              <div key={p.name} className="svc-provider-card">
                <div className="svc-provider-category">{p.category}</div>
                <h4>{p.name}</h4>
                <div className="svc-provider-meta">
                  <span className="svc-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {p.rating.toFixed(1)}
                    <span className="svc-reviews">({p.reviews})</span>
                  </span>
                  <span className="svc-dot">·</span>
                  <span className="svc-city"><MapPin size={13} /> {p.city}</span>
                </div>
                <span className="svc-highlight">{p.highlight}</span>
                <Link to={profileLink(p)} className="svc-profile-btn">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Services;