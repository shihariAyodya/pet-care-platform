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
  Globe
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Home.css";

const categories = [
  { id: "cats", title: "Cats", archBg: "var(--arch-cats)", img: "/store/cat_cat.png" },
  { id: "dogs", title: "Dogs", archBg: "var(--arch-dogs)", img: "/store/dog_cat.png" },
  { id: "birds", title: "Birds", archBg: "var(--arch-birds)", img: "/store/bird_cat.png" },
  { id: "pets", title: "Small Pets", archBg: "var(--arch-pets)", img: "/store/rabbit_cat.png" }
];

const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    rating: 5,
    reviews: 128,
    price: "LKR 990.00",
    img: "/store/prod_food.png"
  },
  {
    id: 2,
    name: "Durable Dog Toy",
    rating: 5,
    reviews: 94,
    price: "LKR 1490.00",
    img: "/store/prod_toy.png"
  },
  {
    id: 3,
    name: "Comfort Pet Collar",
    rating: 5,
    reviews: 84,
    price: "LKR 250.00",
    img: "/store/prod_collar.png"
  },
  {
    id: 4,
    name: "Cozy Pet Bed",
    rating: 5,
    reviews: 72,
    price: "LKR 750.00",
    img: "/store/prod_bed.png"
  }
];

const customerFavorites = [
  { id: 1, name: "Happy Buddy", breed: "Golden Retriever", img: "/store/fav_buddy.png", bg: "#fce7d2" },
  { id: 2, name: "Milo", breed: "Shih Tzu", img: "/store/fav_shih_tzu.png", bg: "#fde2e4" },
  { id: 3, name: "Luna", breed: "British Shorthair", img: "/store/fav_luna.png", bg: "#e2ece9" },
  { id: 4, name: "Coco", breed: "Netherland Dwarf", img: "/store/fav_coco.png", bg: "#fee1e8" }
];

function Home() {
  const { language, toggleLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  return (
    <div className="pet-store-page">
      {/* 1. Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-item">
          <Truck size={16} /> Free Delivery on orders over $49
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
            <div className="action-item">
              <User size={20} />
              <span>Account</span>
            </div>
            <div className="action-item relative">
              <Heart size={20} />
              <span className="badge">2</span>
              <span>Wishlist</span>
            </div>
            <div className="action-item relative">
              <ShoppingCart size={20} />
              <span className="badge cart-badge">0</span>
              <span>Cart</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <Link to="/" className="nav-link active">Home</Link>
          <div className="nav-link dropdown">Shop <ChevronDown size={14} /></div>
          <div className="nav-link dropdown">Dogs <ChevronDown size={14} /></div>
          <div className="nav-link dropdown">Cats <ChevronDown size={14} /></div>
          <Link to="/vets" className="nav-link">Birds</Link>
          <Link to="/vets" className="nav-link">Small Pets</Link>
          <Link to="/articles" className="nav-link">Blog</Link>
          <Link to="/lost-found" className="nav-link">Contact Us</Link>
        </nav>
      </header>

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

          <Link to="/browse" className="shop-now-btn">
            SHOP NOW <ArrowRight size={18} />
          </Link>
        </div>


      </section>

      {/* 4. Shop by Category */}
      <section className="section-container">
        <div className="section-title">
          <span className="arrow-left">⇶</span>
          <h3>SHOP BY CATEGORY</h3>
          <span className="arrow-right">⇇</span>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="arch-background" style={{ backgroundColor: cat.archBg }}>
                <img src={cat.img} alt={cat.title} className="category-img" />
                <div className="paw-badge">🐾</div>
              </div>
              <h4>{cat.title}</h4>
              <Link to="/browse" className="explore-link">Explore Now ➔</Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Popular Products */}
      <section className="section-container">
        <div className="section-title">
          <span className="arrow-left">⇶</span>
          <h3>POPULAR PRODUCTS</h3>
          <span className="arrow-right">⇇</span>
        </div>

        <div className="products-grid">
          {products.map((prod) => (
            <div key={prod.id} className="product-card">
              <div className="product-img-box">
                <img src={prod.img} alt={prod.name} className="product-img" />
              </div>
              <h4 className="product-title">{prod.name}</h4>
              <div className="rating-row">
                <div className="stars">
                  {[...Array(prod.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span className="review-count">({prod.reviews})</span>
              </div>
              <div className="product-bottom">
                <span className="price">{prod.price}</span>
                <button className="add-cart-btn" aria-label="Add to cart">
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Favorites */}
      <section className="section-container">
        <div className="section-title">
          <span className="arrow-left">⇶</span>
          <h3>CUSTOMER FAVORITES</h3>
          <span className="arrow-right">⇇</span>
        </div>

        <div className="favorites-grid">
          {customerFavorites.map((pet) => (
            <div key={pet.id} className="favorite-card">
              <div className="fav-img-box" style={{ backgroundColor: pet.bg }}>
                <img src={pet.img} alt={pet.name} className="fav-img" />
              </div>
              <div className="fav-info">
                <h4>{pet.name}</h4>
                <p>{pet.breed}</p>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>
            </div>
          ))}
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
      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-col brand-col">
            <div className="brand-logo">
              <img src="/store/logo.png" alt="Site Logo" className="site-logo" />
            </div>
            <p className="footer-tagline">Everything your pet needs, all in one place.</p>
            <div className="social-icons">
              <span className="pay-badge">FB</span>
              <span className="pay-badge">IG</span>
              <span className="pay-badge">YT</span>
            </div>
          </div>

          <div className="footer-col">
            <h5>SHOP</h5>
            <ul>
              <li><Link to="/browse">All Products</Link></li>
              <li><Link to="/browse">Dogs</Link></li>
              <li><Link to="/browse">Cats</Link></li>
              <li><Link to="/browse">Birds</Link></li>
              <li><Link to="/browse">Small Pets</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>CUSTOMER SERVICE</h5>
            <ul>
              <li><Link to="#">My Account</Link></li>
              <li><Link to="#">Order Tracking</Link></li>
              <li><Link to="#">Returns & Refunds</Link></li>
              <li><Link to="#">Shipping Info</Link></li>
              <li><Link to="#">FAQs</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>INFORMATION</h5>
            <ul>
              <li><Link to="#">About Us</Link></li>
              <li><Link to="/articles">Blog</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms & Conditions</Link></li>
              <li><Link to="/lost-found">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col payments-col">
            <h5>WE ACCEPT</h5>
            <div className="payment-badges">
              <span className="pay-badge visa">VISA</span>
              <span className="pay-badge mc">MC</span>
              <span className="pay-badge amex">AMEX</span>
              <span className="pay-badge paypal">PayPal</span>
              <span className="pay-badge apple">ApplePay</span>
              <span className="pay-badge gpay">GPay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;