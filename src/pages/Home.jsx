import Footer from "../components/Footer";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  Truck,
  RotateCcw,
  Award,
  ShieldCheck,
  Star,
  ArrowRight,
  Stethoscope,
  Tag,
  Globe,
  Flame,
  MapPin,
  Dog,
  Cat,
  PawPrint,
  Home as HomeIcon,
  Clock,
  Activity,
  Users,
  Check,
  Scissors,
  GraduationCap,
  Car,
  Store,
  Bird,
  Rabbit,
  AlertCircle,
  Bookmark,
  Filter,
  Sparkles,
  Wand2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import PetNameGeneratorModal from "../components/PetNameGeneratorModal";
import { adoptablePets } from "../data/pets";
import "../styles/Home.css";


function Home() {
  const { language, toggleLanguage } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const { totalCartCount, setIsCartOpen, wishlist } = useCart();
  const [selectedCategory] = useState("All Categories");
  const [adoptFilter, setAdoptFilter] = useState("Dog");
  const [isNameGenOpen, setIsNameGenOpen] = useState(false);

  return (
    <div className="pet-store-page">
      {/* 1. Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-item">
          <Truck size={16} /> Free Delivery on orders over LKR 5000.00
        </div>
        <div className="announcement-item">
          <RotateCcw size={16} /> 30-Day Easy Returns
        </div>
        <div className="announcement-item highlight">
          💚 We love pets, we care!
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="main-header">
        <div className="header-top">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <img src="/store/logo.png" alt="Site Logo" className="site-logo" />
          </Link>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for products..."
              className="search-input"
            />
            <div className="category-select">
              <span>{selectedCategory}</span>
              <ChevronDown size={14} />
            </div>
            <button className="search-btn" aria-label="Search">
              <Search size={18} />
            </button>
          </div>

          {/* User & Cart Actions */}
          <div className="header-actions">
            <button className="action-item" onClick={toggleLanguage} title="Switch Language">
              <Globe size={20} />
              <span>{language === "en" ? "EN" : "සිං"}</span>
            </button>
            <Link to={isAuthenticated ? "/profile" : "/login"} className="action-item" style={{ textDecoration: "none", color: "inherit" }}>
              <User size={20} />
              <span>{isAuthenticated ? (currentUser?.fullName?.split(" ")[0] || "Profile") : "Account"}</span>
            </Link>
            <Link to="/shop" className="action-item relative" style={{ textDecoration: "none", color: "inherit" }}>
              <Heart size={20} />
              <span className="badge">{wishlist.length}</span>
              <span>Wishlist</span>
            </Link>
            <div className="action-item relative" onClick={() => setIsCartOpen(true)} style={{ cursor: "pointer" }}>
              <ShoppingCart size={20} />
              <span className="badge cart-badge">{totalCartCount}</span>
              <span>Cart</span>
            </div>
          </div>
        </div>


      </header>
      <CartDrawer />

      {/* 3. Hero Section */}
      <section className="hero-banner">
        <div className="hero-left">
          <div className="hero-title-group">
            <span className="crown-doodle"></span>
            <h2>Treat Your Pet <br /><span className="highlight-text">like royalty!</span></h2>
          </div>
          <p className="hero-desc">
            Premium food, toys & accessories for happy and healthy pets.
          </p>

          <div className="hero-features">
            <div className="feature-pill">
              <Award size={16} className="feature-icon" />
              <span>Premium Quality Products</span>
            </div>
            <div className="feature-pill">
              <ShieldCheck size={16} className="feature-icon" />
              <span>Safe & Secure Shopping</span>
            </div>
            <div className="feature-pill">
              <Truck size={16} className="feature-icon" />
              <span>Fast & Free Delivery</span>
            </div>
          </div>

          <Link to="/shop" className="shop-now-btn">
            SHOP NOW <ArrowRight size={18} />
          </Link>
        </div>


      </section>

      {/* 3.5 Pets Looking for Love */}
      <section className="pets-adoption-section">
        <div className="adoption-header">
          <div className="adoption-header-left">
            <div className="adoption-title-row">
              <Flame size={20} className="flame-icon" />
              <h3>PETS LOOKING FOR LOVE</h3>
            </div>
            <h2>Meet your next best friend.</h2>
            <div className="adoption-filters">
              <button 
                className={`filter-pill ${adoptFilter === "Dog" ? "active" : ""}`}
                onClick={() => setAdoptFilter("Dog")}
              ><Dog size={14} /> Dogs</button>
              <button 
                className={`filter-pill ${adoptFilter === "Cat" ? "active" : ""}`}
                onClick={() => setAdoptFilter("Cat")}
              ><Cat size={14} /> Cats</button>
              <button 
                className={`filter-pill ${adoptFilter === "Other" ? "active" : ""}`}
                onClick={() => setAdoptFilter("Other")}
              ><PawPrint size={14} /> Others</button>
            </div>
          </div>
          <Link to="/browse" className="view-all-link">View All <ArrowRight size={16} /></Link>
        </div>

        <div className="adoption-grid">
          {adoptablePets.filter(pet => adoptFilter === "Other" ? (pet.species !== "Dog" && pet.species !== "Cat") : pet.species === adoptFilter).map((pet) => (
            <div key={pet.id} className="adopt-card">
              <div className="adopt-img-wrapper">
                <img
                  src={pet.img}
                  alt={pet.name}
                  className="adopt-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/store/fav_buddy.png";
                  }}
                />
                <button className="adopt-heart-btn" aria-label="Favorite">
                  <Heart size={12} />
                </button>
                <span className={`adopt-status ${pet.status.toLowerCase()}`}>{pet.status}</span>
              </div>
              <div className="adopt-info">
                <div className="adopt-name-row">
                  <h4>{pet.name}</h4>
                  {pet.species === "Dog" && <Dog size={16} className="species-icon" />}
                  {pet.species === "Cat" && <Cat size={16} className="species-icon" />}
                  {pet.species === "Bird" && <Bird size={16} className="species-icon" />}
                  {pet.species === "Rabbit" && <Rabbit size={16} className="species-icon" />}
                  {pet.species === "Other" && <PawPrint size={16} className="species-icon" />}
                </div>
                <p className="adopt-breed">{pet.breed} • {pet.age}</p>
                <p className="adopt-location"><MapPin size={14} /> {pet.location}</p>
                
                <div className="adopt-match">
                  <div className="match-text">💚 {pet.match}% Lifestyle Match</div>
                  <div className="match-bar-bg">
                    <div className="match-bar-fill" style={{ width: `${pet.match}%` }}></div>
                  </div>
                </div>
                
                <Link to="/browse" className="meet-btn" style={{ textDecoration: "none" }}>
                  Meet {pet.name} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.6 AI Pet Name Generator Banner Section */}
      <section className="name-generator-banner-section">
        <div className="name-gen-banner-container" onClick={() => setIsNameGenOpen(true)}>
          <div className="name-gen-left">
            <div className="name-gen-badge">
              <Sparkles size={16} className="sparkle-gold" />
              <span>New AI Feature</span>
            </div>
            <div className="name-gen-text">
              <h3 className="name-gen-title">AI Pet Name Generator</h3>
              <p className="name-gen-subtitle">
                Find the perfect name for your furry friend with a little help from AI.
              </p>
            </div>
          </div>

          <div className="name-gen-right">
            <button
              type="button"
              className="name-gen-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsNameGenOpen(true);
              }}
            >
              <Wand2 size={18} className="wand-icon" />
              <span>Find My Pet's Name</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 3.75 Smart Pet Match Section */}
      <section className="smart-match-section">
        <div className="smart-match-header">
          <h2>Your lifestyle. Their personality. <span className="highlight-text">Perfect match.</span></h2>
          <p>Answer a few simple questions and discover pets that fit your lifestyle.</p>
        </div>

        <div className="smart-match-container single">
          <div className="match-left-panel">
            <div className="panel-label">ABOUT YOUR LIFE</div>
            <div className="lifestyle-grid">
              <div className="lifestyle-item">
                <div className="icon-box"><HomeIcon size={20} /></div>
                <div className="lifestyle-info">
                  <span className="lifestyle-title">Home</span>
                  <span className="lifestyle-value">Apartment</span>
                </div>
              </div>
              <div className="lifestyle-item">
                <div className="icon-box"><Clock size={20} /></div>
                <div className="lifestyle-info">
                  <span className="lifestyle-title">Time</span>
                  <span className="lifestyle-value">3–4 hours/day</span>
                </div>
              </div>
              <div className="lifestyle-item">
                <div className="icon-box"><Activity size={20} /></div>
                <div className="lifestyle-info">
                  <span className="lifestyle-title">Activity</span>
                  <span className="lifestyle-value">Moderate</span>
                </div>
              </div>
              <div className="lifestyle-item">
                <div className="icon-box"><Users size={20} /></div>
                <div className="lifestyle-info">
                  <span className="lifestyle-title">Family</span>
                  <span className="lifestyle-value">No children</span>
                </div>
              </div>
            </div>
            <Link to="/smart-match" className="find-match-btn">
              Find My Match <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* NEW SERVICE DISCOVERY SECTION */}
      <section className="service-discovery-section">
        <div className="discovery-header">
          <h2>Everything Your Pet Needs</h2>
          <p>From everyday care to professional services, find trusted pet businesses near you.</p>
        </div>

        <div className="service-categories-grid">
          {/* 1. Veterinarians */}
          <Link to="/vets" className="service-card featured">
            <div className="service-img-wrapper">
              <img src="/store/service_vet.png" alt="Veterinarians" className="service-img" />
              <div className="service-icon-badge"><Stethoscope size={18} /></div>
            </div>
            <div className="service-info">
              <h3>Veterinarians</h3>
              <p>Keep your pet healthy.</p>
              <div className="service-cta">Find Vets <ArrowRight size={16} className="arrow" /></div>
            </div>
          </Link>

          {/* 2. Grooming */}
          <Link to="/grooming" className="service-card">
            <div className="service-img-wrapper">
              <img src="/store/service_grooming.png" alt="Grooming" className="service-img" />
              <div className="service-icon-badge"><Scissors size={18} /></div>
            </div>
            <div className="service-info">
              <h3>Grooming</h3>
              <p>Look good. Feel good.</p>
              <div className="service-cta">Find Groomers <ArrowRight size={16} className="arrow" /></div>
            </div>
          </Link>

          {/* 3. Training */}
          <Link to="/training" className="service-card">
            <div className="service-img-wrapper">
              <img src="/store/service_training.png" alt="Training" className="service-img" />
              <div className="service-icon-badge"><GraduationCap size={18} /></div>
            </div>
            <div className="service-info">
              <h3>Training</h3>
              <p>Better habits. Happier pets.</p>
              <div className="service-cta">Find Trainers <ArrowRight size={16} className="arrow" /></div>
            </div>
          </Link>

          {/* 4. Pet Sitting */}
          <Link to="/sitting" className="service-card">
            <div className="service-img-wrapper">
              <img src="/store/service_sitting.png" alt="Pet Sitting" className="service-img" />
              <div className="service-icon-badge"><HomeIcon size={18} /></div>
            </div>
            <div className="service-info">
              <h3>Pet Sitting</h3>
              <p>Care when you can't be there.</p>
              <div className="service-cta">Find Pet Sitters <ArrowRight size={16} className="arrow" /></div>
            </div>
          </Link>

          {/* 5. Pet Transport */}
          <Link to="/transport" className="service-card">
            <div className="service-img-wrapper">
              <img src="/store/service_transport.png" alt="Pet Transport" className="service-img" />
              <div className="service-icon-badge"><Car size={18} /></div>
            </div>
            <div className="service-info">
              <h3>Pet Transport</h3>
              <p>Safe journeys for pets.</p>
              <div className="service-cta">Find Transport <ArrowRight size={16} className="arrow" /></div>
            </div>
          </Link>

          {/* 6. Pet Shops */}
          <Link to="/shops" className="service-card">
            <div className="service-img-wrapper">
              <img src="/store/service_shop.png" alt="Pet Shops" className="service-img" />
              <div className="service-icon-badge"><Store size={18} /></div>
            </div>
            <div className="service-info">
              <h3>Pet Shops</h3>
              <p>Everything they need.</p>
              <div className="service-cta">Find Pet Shops <ArrowRight size={16} className="arrow" /></div>
            </div>
          </Link>
        </div>

        {/* Popular Services Sub-section */}
        <div className="popular-services-subsection">
          <div className="popular-services-header">
            <h3>Popular Pet Services Near You</h3>
            <div className="location-control">
              <MapPin size={16} /> <span>Services Near You</span>
            </div>
          </div>

          <div className="business-preview-grid">
            {/* Business 1 */}
            <div className="business-preview-card">
              <div className="business-header">
                <div className="business-title">Happy Paws Veterinary</div>
                <div className="business-category">Veterinarian</div>
              </div>
              <div className="business-meta">
                <span className="rating"><Star size={14} className="star-icon" fill="currentColor"/> 4.8</span>
                <span className="dot">·</span>
                <span className="distance">2.4 km</span>
                <span className="dot">·</span>
                <span className="status open">Open Now</span>
              </div>
              <button className="view-profile-btn">View Profile</button>
            </div>

            {/* Business 2 */}
            <div className="business-preview-card">
              <div className="business-header">
                <div className="business-title">Fluffy Styles Salon</div>
                <div className="business-category">Grooming</div>
              </div>
              <div className="business-meta">
                <span className="rating"><Star size={14} className="star-icon" fill="currentColor"/> 4.9</span>
                <span className="dot">·</span>
                <span className="distance">3.1 km</span>
                <span className="dot">·</span>
                <span className="status open">Open Now</span>
              </div>
              <button className="view-profile-btn">View Profile</button>
            </div>

            {/* Business 3 */}
            <div className="business-preview-card">
              <div className="business-header">
                <div className="business-title">Good Boy Academy</div>
                <div className="business-category">Training</div>
              </div>
              <div className="business-meta">
                <span className="rating"><Star size={14} className="star-icon" fill="currentColor"/> 5.0</span>
                <span className="dot">·</span>
                <span className="distance">5.5 km</span>
                <span className="dot">·</span>
                <span className="status closed">Closed</span>
              </div>
              <button className="view-profile-btn">View Profile</button>
            </div>
          </div>

          <div className="explore-all-action">
            <Link to="/services" className="explore-all-btn">
              Explore All Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* COMPACT LOST & FOUND SECTION */}
      <section className="lf-section-wrapper">
        <div className="lf-compact-banner">
          <div className="lf-compact-text">
            <h2>Lost & Found</h2>
            <p>Every missing pet has someone waiting for them.</p>
          </div>
          <div className="lf-compact-actions">
            <Link to="/report-lost" className="lf-btn lf-btn-lost">
              <AlertCircle size={18} /> I Lost My Pet
            </Link>
            <Link to="/report-found" className="lf-btn lf-btn-found">
              <Check size={18} /> I Found a Pet
            </Link>
          </div>
        </div>

        <div className="lf-recent-section">
          <div className="lf-recent-header">
            <h3>Recently Reported</h3>
            <p>Pets that need to be found</p>
          </div>
          
          <div className="lf-recent-grid">
            {/* Pet 1: Max */}
            <div className="lf-pet-card">
              <div className="lf-pet-img-wrap">
                <img src="/store/lf_pet_max.png" alt="Max" className="lf-pet-img" />
                <div className="lf-pet-badge lost"><AlertCircle size={12} /> LOST</div>
                <button className="lf-save-btn"><Bookmark size={16} /></button>
              </div>
              <div className="lf-pet-info">
                <div className="lf-pet-name-row">
                  <h4>Max</h4>
                  <span className="lf-pet-breed">Labrador</span>
                </div>
                <div className="lf-pet-meta">
                  <span className="lf-pet-loc"><MapPin size={12} /> Kegalle</span>
                  <span className="lf-pet-time"><Clock size={12} /> 2h ago</span>
                </div>
                <Link to="/pet/max" className="lf-pet-cta">View Details <ArrowRight size={14} /></Link>
              </div>
            </div>

            {/* Pet 2: Luna */}
            <div className="lf-pet-card">
              <div className="lf-pet-img-wrap">
                <img src="/store/lf_pet_luna.png" alt="Luna" className="lf-pet-img" />
                <div className="lf-pet-badge found"><Check size={12} /> FOUND</div>
                <button className="lf-save-btn"><Bookmark size={16} /></button>
              </div>
              <div className="lf-pet-info">
                <div className="lf-pet-name-row">
                  <h4>Luna</h4>
                  <span className="lf-pet-breed">Domestic Shorthair</span>
                </div>
                <div className="lf-pet-meta">
                  <span className="lf-pet-loc"><MapPin size={12} /> Colombo</span>
                  <span className="lf-pet-time"><Clock size={12} /> 5h ago</span>
                </div>
                <Link to="/pet/luna" className="lf-pet-cta">View Details <ArrowRight size={14} /></Link>
              </div>
            </div>

            {/* Pet 3: Rocky */}
            <div className="lf-pet-card">
              <div className="lf-pet-img-wrap">
                <img src="/store/lf_pet_rocky.png" alt="Rocky" className="lf-pet-img" />
                <div className="lf-pet-badge lost"><AlertCircle size={12} /> LOST</div>
                <button className="lf-save-btn"><Bookmark size={16} /></button>
              </div>
              <div className="lf-pet-info">
                <div className="lf-pet-name-row">
                  <h4>Rocky</h4>
                  <span className="lf-pet-breed">Mixed Breed</span>
                </div>
                <div className="lf-pet-meta">
                  <span className="lf-pet-loc"><MapPin size={12} /> Kandy</span>
                  <span className="lf-pet-time"><Clock size={12} /> 1d ago</span>
                </div>
                <Link to="/pet/rocky" className="lf-pet-cta">View Details <ArrowRight size={14} /></Link>
              </div>
            </div>

            {/* Pet 4: Milo */}
            <div className="lf-pet-card">
              <div className="lf-pet-img-wrap">
                <img src="/store/lf_pet_milo.png" alt="Milo" className="lf-pet-img" />
                <div className="lf-pet-badge found"><Check size={12} /> FOUND</div>
                <button className="lf-save-btn"><Bookmark size={16} /></button>
              </div>
              <div className="lf-pet-info">
                <div className="lf-pet-name-row">
                  <h4>Milo</h4>
                  <span className="lf-pet-breed">Persian</span>
                </div>
                <div className="lf-pet-meta">
                  <span className="lf-pet-loc"><MapPin size={12} /> Galle</span>
                  <span className="lf-pet-time"><Clock size={12} /> 2d ago</span>
                </div>
                <Link to="/pet/milo" className="lf-pet-cta">View Details <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lf-map-section">
          <div className="lf-map-header">
            <h3>Lost & Found Near You</h3>
            <div className="lf-map-controls">
              <button className="lf-filter-btn active">All</button>
              <button className="lf-filter-btn lost-filter"><AlertCircle size={14}/> Lost</button>
              <button className="lf-filter-btn found-filter"><Check size={14}/> Found</button>
              <button className="lf-filter-btn icon-only"><Filter size={16}/></button>
            </div>
          </div>
          
          <div className="lf-map-container">
            {/* Mock Map Background using CSS pattern and styling */}
            <div className="lf-mock-map">
              <div className="lf-map-marker lost" style={{ top: '30%', left: '40%' }}>
                <img src="/store/lf_pet_max.png" alt="Max" />
              </div>
              <div className="lf-map-marker found" style={{ top: '60%', left: '70%' }}>
                <img src="/store/lf_pet_luna.png" alt="Luna" />
              </div>
              <div className="lf-map-marker lost" style={{ top: '50%', left: '20%' }}>
                <img src="/store/lf_pet_rocky.png" alt="Rocky" />
              </div>
              <div className="lf-map-marker found" style={{ top: '20%', left: '80%' }}>
                <img src="/store/lf_pet_milo.png" alt="Milo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trust Banners */}
      <section className="trust-section">
        <div className="trust-cards-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <ShieldCheck size={28} color="var(--green-dark)" />
            </div>
            <div>
              <h4>100% Safe</h4>
              <p>Pet-friendly & toxin-free products</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Stethoscope size={28} color="var(--green-dark)" />
            </div>
            <div>
              <h4>Vet Approved</h4>
              <p>Trusted by professionals</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Tag size={28} color="var(--green-dark)" />
            </div>
            <div>
              <h4>Best Prices</h4>
              <p>Quality pets love, prices you trust</p>
            </div>
          </div>

          <div className="trust-image-card">
            <img src="/store/fav_buddy.png" alt="Happy pets" className="trust-pets-img" />
          </div>
        </div>
      </section>

      {/* 8. Newsletter Banner */}
      <section className="newsletter-banner">
        <div className="newsletter-left">
          <h3>Join our pet family!</h3>
          <p>Get exclusive deals, pet care tips & more.</p>
        </div>
        <div className="newsletter-right">
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
          />
          <button className="subscribe-btn">SUBSCRIBE</button>
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />
      {/* AI Pet Name Generator Modal */}
      <PetNameGeneratorModal
        isOpen={isNameGenOpen}
        onClose={() => setIsNameGenOpen(false)}
      />
    </div>
  );
}

export default Home;