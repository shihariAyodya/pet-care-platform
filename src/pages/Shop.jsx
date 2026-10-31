import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Eye,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  X,
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { shopProducts, shopCategories, petTypeFilters } from "../data/products";
import CartDrawer from "../components/CartDrawer";
import "../styles/Shop.css";

export default function Shop() {
  const { toggleLanguage, language } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    totalCartCount,
    setIsCartOpen
  } = useCart();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPetType, setSelectedPetType] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleOpenQuickView = (prod, e) => {
    e?.stopPropagation();
    setQuickViewProduct(prod);
    setModalQty(1);
  };

  const handleModalAddToCart = () => {
    if (quickViewProduct) {
      addToCart(quickViewProduct, modalQty);
      setQuickViewProduct(null);
      showToast(`Added ${modalQty}x ${quickViewProduct.name} to cart!`);
    }
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return shopProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      const matchesPetType =
        selectedPetType === "all" || p.petType === selectedPetType;

      return matchesSearch && matchesCategory && matchesPetType;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.priceNum - b.priceNum;
      if (sortBy === "price-high") return b.priceNum - a.priceNum;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default featured
    });
  }, [searchQuery, selectedCategory, selectedPetType, sortBy]);

  return (
    <div className="shop-page">
      {/* Top Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Pet Care Platform" className="site-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/browse">Adopt</Link>
          <Link to="/shop" style={{ color: "var(--green-dark)", fontWeight: "700" }}>Shop</Link>
          <Link to="/lost-found">Lost & Found</Link>
          <Link to="/vets">Vet Directory</Link>
          <Link to="/smart-match">Smart Match</Link>
          {isAuthenticated ? (
            <Link to="/profile">👤 {currentUser?.fullName?.split(" ")[0] || "Profile"}</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === "en" ? "සිං" : "EN"}
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="shop-hero">
        <div className="shop-hero-inner">
          <div className="shop-hero-text">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.15)", padding: "0.3rem 0.8rem", borderRadius: "999px", fontSize: "0.85rem", marginBottom: "0.8rem" }}>
              <Sparkles size={14} color="#f4b41a" /> 100% Certified Healthy Pet Supplies
            </div>
            <h1>Petzy Market & Pet Supplies</h1>
            <p>
              Shop premium vet-approved foods, indestructible chew toys, orthopedic bedding,
              and grooming essentials with fast islandwide delivery.
            </p>
            <div className="shop-hero-badges">
              <span className="shop-hero-badge"><Truck size={14} /> Free Delivery &gt; LKR 5000</span>
              <span className="shop-hero-badge"><RotateCcw size={14} /> 30-Day Easy Returns</span>
              <span className="shop-hero-badge"><ShieldCheck size={14} /> 100% Non-Toxic & Safe</span>
            </div>
          </div>

          <div className="shop-hero-stat-card">
            <div className="shop-hero-stat-number">{shopProducts.length}+</div>
            <div className="shop-hero-stat-label">Handpicked Pet Products</div>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ marginTop: "1rem", background: "var(--accent-gold)", color: "#1f2937", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <ShoppingCart size={16} /> Open Cart ({totalCartCount})
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Controls & Listing */}
      <main className="shop-container">
        {/* Toast alert */}
        {toastMessage && (
          <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#1d4633", color: "#ffffff", padding: "0.8rem 1.6rem", borderRadius: "999px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.92rem" }}>
            <Check size={18} color="#86efac" /> {toastMessage}
          </div>
        )}

        {/* Filter Bar */}
        <div className="shop-controls-bar">
          <div className="shop-search-box">
            <Search size={18} className="shop-search-icon" />
            <input
              type="text"
              placeholder="Search products, brands, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="shop-search-clear" onClick={() => setSearchQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="shop-filter-actions">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shop-select-styled"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>

            <button
              className="shop-cart-launcher-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              <span className="cart-bubble-badge">{totalCartCount}</span>
            </button>
          </div>
        </div>

        {/* Categories Carousel Strip */}
        <div className="shop-categories-strip">
          {shopCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-filter-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Pet Type Chips */}
        <div className="shop-pet-types-row">
          <span className="shop-pet-types-label">Suitable For:</span>
          {petTypeFilters.map((pt) => (
            <button
              key={pt.id}
              className={`pet-type-chip ${selectedPetType === pt.id ? "active" : ""}`}
              onClick={() => setSelectedPetType(pt.id)}
            >
              {pt.label}
            </button>
          ))}
          {(selectedCategory !== "all" || selectedPetType !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedPetType("all");
                setSearchQuery("");
              }}
              style={{ background: "none", border: "none", color: "#dc2626", fontSize: "0.85rem", cursor: "pointer", marginLeft: "auto", textDecoration: "underline" }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <Search size={48} style={{ color: "#9ca3af", margin: "0 auto" }} />
            <h3>No products found</h3>
            <p>Try searching with another keyword or resetting your filters.</p>
          </div>
        ) : (
          <div className="interactive-products-grid">
            {filteredProducts.map((prod) => {
              const isWishlisted = wishlist.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="shop-product-card"
                  onClick={() => handleOpenQuickView(prod)}
                >
                  {prod.badge && (
                    <span className="product-badge-tag">{prod.badge}</span>
                  )}

                  <button
                    className={`wishlist-toggle-btn ${isWishlisted ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart size={18} fill={isWishlisted ? "#e11d48" : "none"} />
                  </button>

                  <div className="shop-card-media">
                    <img src={prod.img} alt={prod.name} />
                  </div>

                  <span className="shop-card-brand">{prod.brand}</span>
                  <h4 className="shop-card-title">{prod.name}</h4>

                  <div className="shop-card-rating">
                    <div className="shop-card-stars">
                      {[...Array(prod.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>({prod.reviews} reviews)</span>
                  </div>

                  <div className="shop-card-footer">
                    <div className="shop-card-pricing">
                      <span className="shop-current-price">{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="shop-original-price">{prod.originalPrice}</span>
                      )}
                    </div>

                    <button
                      className="shop-add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                        showToast(`Added ${prod.name} to cart!`);
                      }}
                      title="Add 1 to Cart"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setQuickViewProduct(null)}
            >
              <X size={18} />
            </button>

            <div className="quickview-img-box">
              <img src={quickViewProduct.img} alt={quickViewProduct.name} />
            </div>

            <div className="quickview-details">
              <span className="shop-card-brand">{quickViewProduct.brand}</span>
              <h2>{quickViewProduct.name}</h2>

              <div className="shop-card-rating">
                <div className="shop-card-stars">
                  {[...Array(quickViewProduct.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span>({quickViewProduct.reviews} customer reviews)</span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.8rem", margin: "0.8rem 0" }}>
                <span className="shop-current-price" style={{ fontSize: "1.6rem" }}>
                  {quickViewProduct.price}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="shop-original-price" style={{ fontSize: "1rem" }}>
                    {quickViewProduct.originalPrice}
                  </span>
                )}
              </div>

              <p className="quickview-desc">{quickViewProduct.description}</p>

              <div className="qty-counter-row">
                <label style={{ fontWeight: 600, fontSize: "0.95rem" }}>Quantity:</label>
                <div className="qty-stepper">
                  <button onClick={() => setModalQty((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span>{modalQty}</span>
                  <button onClick={() => setModalQty((q) => q + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                <button
                  onClick={handleModalAddToCart}
                  className="shop-add-cart-btn"
                  style={{ flex: 1, padding: "0.85rem", justifyContent: "center", fontSize: "1rem" }}
                >
                  <ShoppingCart size={18} /> Add to Cart ({(quickViewProduct.priceNum * modalQty).toLocaleString()} LKR)
                </button>
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`wishlist-toggle-btn ${wishlist.includes(quickViewProduct.id) ? "active" : ""}`}
                  style={{ position: "static", width: "48px", height: "48px" }}
                >
                  <Heart size={20} fill={wishlist.includes(quickViewProduct.id) ? "#e11d48" : "none"} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1.5rem", borderTop: "1px solid #f1ece4", paddingTop: "1rem", fontSize: "0.85rem", color: "#6b7280" }}>
                <div>✨ Free shipping on orders over LKR 5000</div>
                <div>🛡️ Guaranteed safe, non-toxic pet ingredients</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
