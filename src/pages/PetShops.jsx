import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Clock,
  MapPin,
  Store,
  Star,
  CheckCircle2,
  X,
  Check,
  Truck,
  ShoppingBag,
  Navigation,
  Sparkles
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/PetShops.css";

const shopList = [
  {
    id: 1,
    name: "Pet Paradise Colombo",
    owner: "Malith Fernando",
    location: "Colombo",
    address: "145 Duplication Road, Colombo 04",
    phone: "011-259-8812",
    hours: "Every day, 9am–9pm",
    rating: 4.8,
    reviews: 156,
    delivery: true,
    deliveryNote: "Free delivery over LKR 5,000 in Colombo",
    categories: ["Food", "Toys", "Accessories", "Pharmacy"],
    petTypes: ["Dog", "Cat", "Bird"],
    brands: ["Royal Canin", "Pedigree", "Whiskas", "Drools"]
  },
  {
    id: 2,
    name: "Aqua & Paws",
    owner: "Rashmi Liyanage",
    location: "Nugegoda",
    address: "78 High Level Road, Nugegoda",
    phone: "011-285-1047",
    hours: "Mon–Sat, 9am–8pm",
    rating: 4.7,
    reviews: 73,
    delivery: false,
    deliveryNote: "In-store pickup only",
    categories: ["Aquarium & Fish", "Food", "Accessories"],
    petTypes: ["Fish", "Dog", "Cat"],
    brands: ["Tetra", "Hikari", "SmartHeart"]
  },
  {
    id: 3,
    name: "Hill Country Pet Store",
    owner: "Asanka Herath",
    location: "Kandy",
    address: "22 Dalada Veediya, Kandy",
    phone: "081-220-3368",
    hours: "Every day, 8:30am–8pm",
    rating: 4.9,
    reviews: 58,
    delivery: true,
    deliveryNote: "Same-day delivery within Kandy city",
    categories: ["Food", "Toys", "Bird & Small Pets", "Grooming Supplies"],
    petTypes: ["Dog", "Cat", "Bird", "Rabbit"],
    brands: ["Pedigree", "Me-O", "Versele-Laga"]
  }
];

const getInitials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const today = () => new Date().toISOString().split("T")[0];

function PetShops() {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deliveryOnly, setDeliveryOnly] = useState(false);

  // Order Modal
  const [orderShop, setOrderShop] = useState(null);
  const [orderForm, setOrderForm] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const cities = ["All", ...new Set(shopList.map((s) => s.location))];
  const categories = ["All", ...new Set(shopList.flatMap((s) => s.categories))];

  const filteredShops = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return shopList.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search) ||
        s.location.toLowerCase().includes(search) ||
        s.categories.some((c) => c.toLowerCase().includes(search)) ||
        s.brands.some((b) => b.toLowerCase().includes(search));
      const matchesCity = cityFilter === "All" || s.location === cityFilter;
      const matchesCategory = categoryFilter === "All" || s.categories.includes(categoryFilter);
      const matchesDelivery = !deliveryOnly || s.delivery;
      return matchesSearch && matchesCity && matchesCategory && matchesDelivery;
    });
  }, [searchTerm, cityFilter, categoryFilter, deliveryOnly]);

  const resetFilters = () => {
    setSearchTerm("");
    setCityFilter("All");
    setCategoryFilter("All");
    setDeliveryOnly(false);
  };

  const handleOpenOrder = (shop) => {
    setOrderShop(shop);
    setOrderSuccess(false);
    setOrderForm({
      items: "",
      fulfilment: shop.delivery && deliveryOnly ? "Home Delivery" : "Store Pickup",
      date: today(),
      address: "",
      ownerName: currentUser?.fullName || "",
      phone: currentUser?.phone || ""
    });
  };

  const updateForm = (field, value) => setOrderForm((f) => ({ ...f, [field]: value }));

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      const name = orderShop.name;
      setOrderShop(null);
      setOrderSuccess(false);
      showToast(`Order sent to ${name}! They'll call to confirm.`);
    }, 2400);
  };

  const mapsLink = (shop) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address}`)}`;

  return (
    <div className="petshops-page">
      {/* Toast */}
      {toastMessage && (
        <div className="pshop-toast">
          <Check size={18} color="#86efac" /> {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <section className="pshop-header">
        <div className="pshop-header-pill">
          <Store size={14} /> Local Sri Lankan Pet Shops
        </div>
        <h2>Pet Shops Near You</h2>
        <p>Everything they need. Food, toys, accessories and pet pharmacy, from shops in your area.</p>
      </section>

      {/* Delivery Spotlight */}
      <section className="pshop-spotlight-section">
        <div className="pshop-spotlight-card">
          <div className="pshop-spotlight-icon">
            <Truck size={26} />
          </div>
          <div className="pshop-spotlight-content">
            <div className="pshop-spotlight-badge">
              <Sparkles size={11} /> DELIVERED TO YOUR DOOR
            </div>
            <h3>Running low on pet food? Get it delivered</h3>
            <p>Order from shops near you and have it dropped off the same day.</p>
          </div>
          <button
            className="pshop-spotlight-btn"
            onClick={() => setDeliveryOnly(true)}
          >
            Show Delivery Shops ➔
          </button>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="pshop-filters-wrap">
        <div className="pshop-filters">
          <div className="pshop-search">
            <Search size={18} className="pshop-search-icon" />
            <input
              type="text"
              placeholder="Search by shop, brand, category or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="pshop-filter-controls">
            <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
              {cities.map((city) => (
                <option key={city} value={city}>{city === "All" ? "All Locations" : city}</option>
              ))}
            </select>

            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>

            <label className={`pshop-toggle ${deliveryOnly ? "on" : ""}`}>
              <input
                type="checkbox"
                checked={deliveryOnly}
                onChange={(e) => setDeliveryOnly(e.target.checked)}
              />
              <span>🚚 Home Delivery</span>
            </label>
          </div>
        </div>
      </div>

      {/* Directory Listing */}
      <section className="pshop-results">
        <p className="pshop-results-count">
          Found {filteredShops.length} pet shops
        </p>

        <div className="pshop-grid">
          {filteredShops.map((s) => (
            <div key={s.id} className="pshop-card">
              <div className="pshop-card-top">
                <div className="pshop-avatar">{getInitials(s.name)}</div>
                <div>
                  <h3>{s.name}</h3>
                  <div className="pshop-owner">{s.location} • Owner: {s.owner}</div>
                  <div className="pshop-rating">
                    <div className="pshop-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <span>{s.rating} ({s.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="pshop-services">
                {s.categories.map((c) => (
                  <span key={c} className="pshop-service-tag">{c}</span>
                ))}
              </div>

              <div className="pshop-details">
                <div><strong>For:</strong> {s.petTypes.join(", ")}</div>
                <div><strong>Brands:</strong> {s.brands.join(", ")}</div>
                <div className="pshop-detail-row">
                  <MapPin size={14} color="#6b7280" /> {s.address}
                </div>
                <div className="pshop-detail-row">
                  <Clock size={14} color="#6b7280" /> {s.hours}
                </div>
                <span className={s.delivery ? "pshop-delivery-tag" : "pshop-pickup-tag"}>
                  {s.delivery ? "🚚 " : "🏪 "}{s.deliveryNote}
                </span>
              </div>

              <div className="pshop-actions">
                <button className="pshop-book-btn" onClick={() => handleOpenOrder(s)}>
                  <ShoppingBag size={16} /> Order Items
                </button>
                <a
                  href={mapsLink(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pshop-call-btn"
                  title="Get Directions"
                >
                  <Navigation size={16} />
                </a>
                <a href={`tel:${s.phone}`} className="pshop-call-btn" title="Call Shop">
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="pshop-empty">
            <p>No shops match your search. Try a different city or category.</p>
            <button onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </section>

      {/* Order Modal */}
      {orderShop && (
        <div className="pshop-modal-overlay" onClick={() => setOrderShop(null)}>
          <div className="pshop-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pshop-modal-close" onClick={() => setOrderShop(null)} aria-label="Close">
              <X size={18} />
            </button>

            {orderSuccess ? (
              <div className="pshop-success">
                <CheckCircle2 size={56} color="#16a34a" />
                <h3>Order Request Sent!</h3>
                <p>
                  <strong>{orderShop.name}</strong> has your list and will call you on{" "}
                  <strong>{orderForm.phone}</strong> to confirm prices and{" "}
                  {orderForm.fulfilment === "Home Delivery" ? "delivery" : "pickup"} on{" "}
                  <strong>{orderForm.date}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <div className="pshop-modal-head">
                  <div className="pshop-avatar small">{getInitials(orderShop.name)}</div>
                  <div>
                    <h3>Order from {orderShop.name}</h3>
                    <span>{orderShop.address}</span>
                  </div>
                </div>

                <form onSubmit={handleOrderSubmit} className="pshop-form">
                  <div>
                    <label>What do you need? *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder={"e.g.\nRoyal Canin Puppy 4kg x 1\nChew toy (medium) x 2"}
                      value={orderForm.items}
                      onChange={(e) => updateForm("items", e.target.value)}
                    />
                  </div>

                  <div className="pshop-form-row">
                    <div>
                      <label>Pickup or Delivery</label>
                      <select
                        value={orderForm.fulfilment}
                        onChange={(e) => updateForm("fulfilment", e.target.value)}
                        disabled={!orderShop.delivery}
                      >
                        <option value="Store Pickup">Store Pickup</option>
                        {orderShop.delivery && <option value="Home Delivery">Home Delivery</option>}
                      </select>
                    </div>
                    <div>
                      <label>{orderForm.fulfilment === "Home Delivery" ? "Delivery Date *" : "Pickup Date *"}</label>
                      <input
                        type="date"
                        required
                        min={today()}
                        value={orderForm.date}
                        onChange={(e) => updateForm("date", e.target.value)}
                      />
                    </div>
                  </div>

                  {orderForm.fulfilment === "Home Delivery" && (
                    <div>
                      <label>Delivery Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 12 Galle Road, Colombo 03"
                        value={orderForm.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="pshop-form-row">
                    <div>
                      <label>Your Name *</label>
                      <input
                        type="text"
                        required
                        value={orderForm.ownerName}
                        onChange={(e) => updateForm("ownerName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+94 77 123 4567"
                        value={orderForm.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pshop-price-note">
                    {orderShop.deliveryNote}. You pay at the shop or on delivery after the shop confirms your order.
                  </div>

                  <button type="submit" className="pshop-submit-btn">
                    <ShoppingBag size={18} /> Send Order Request
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

export default PetShops;