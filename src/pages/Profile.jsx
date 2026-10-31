import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  PawPrint, 
  Package, 
  LogOut, 
  Plus, 
  Check, 
  Calendar,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Auth.css";

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, updateProfile, addPet } = useAuth();
  const { toggleLanguage, language } = useLanguage();

  const [activeTab, setActiveTab] = useState("pets"); // 'pets' | 'orders' | 'settings'
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    petParentOf: currentUser?.petParentOf || "Dog Parent",
    avatar: currentUser?.avatar || ""
  });

  // New Pet Modal/Inline Form State
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    weight: "",
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
  });

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="auth-page">
        <header className="auth-header">
          <Link to="/" className="brand-logo">
            <img src="/store/logo.png" alt="Pet Care Platform Logo" />
          </Link>
        </header>
        <main className="auth-main">
          <div className="auth-card-container">
            <div className="auth-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐾</div>
              <h1>Login Required</h1>
              <p className="auth-subtitle">
                Please sign in to view your profile, manage your registered pets, and view orders.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                  Log In Now
                </Link>
                <Link to="/signup" className="profile-action-btn secondary" style={{ textDecoration: "none" }}>
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddPetSubmit = (e) => {
    e.preventDefault();
    if (!newPet.name.trim()) return;
    addPet(newPet);
    setNewPet({
      name: "",
      type: "Dog",
      breed: "",
      age: "",
      gender: "Male",
      weight: "",
      photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
    });
    setShowAddPet(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page">
      {/* Top Navbar */}
      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Pet Care Platform" className="site-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/browse">Adopt</Link>
          <Link to="/lost-found">Lost & Found</Link>
          <Link to="/vets">Vet Directory</Link>
          <Link to="/smart-match">Smart Match</Link>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === "en" ? "සිං" : "EN"}
          </button>
        </div>
      </nav>

      <div className="profile-container">
        {/* Cover & Profile Header Card */}
        <div className="profile-hero-card">
          <div className="profile-cover"></div>
          <div className="profile-hero-content">
            <div className="profile-avatar-row">
              <div className="profile-avatar-wrapper">
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={currentUser.fullName}
                  className="profile-avatar-img"
                />
              </div>
              <div className="profile-user-info">
                <span className="profile-role-badge">
                  <Sparkles size={13} /> {currentUser.petParentOf || "Pet Enthusiast"}
                </span>
                <h2>{currentUser.fullName}</h2>
                <div className="profile-meta-text">
                  <span><Mail size={14} /> {currentUser.email}</span>
                  {currentUser.phone && <span><Phone size={14} /> {currentUser.phone}</span>}
                  <span><MapPin size={14} /> {currentUser.address || "Sri Lanka"}</span>
                  <span><Calendar size={14} /> Member since {currentUser.joinedDate || "2026"}</span>
                </div>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button
                className={`profile-action-btn ${isEditing ? "primary" : "secondary"}`}
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!isEditing) setActiveTab("settings");
                }}
              >
                {isEditing ? "Editing Profile..." : "Edit Profile"}
              </button>
              <button className="profile-action-btn danger" onClick={handleLogout} title="Log out">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="profile-content-grid">
          {/* Sidebar Navigation */}
          <aside className="profile-nav-card">
            <div className="profile-nav-list">
              <button
                className={`profile-nav-tab ${activeTab === "pets" ? "active" : ""}`}
                onClick={() => setActiveTab("pets")}
              >
                <PawPrint size={18} /> My Pets ({currentUser.myPets?.length || 0})
              </button>
              <button
                className={`profile-nav-tab ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <Package size={18} /> Order History ({currentUser.orders?.length || 0})
              </button>
              <button
                className={`profile-nav-tab ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <User size={18} /> Account Settings
              </button>
              <button
                className="profile-nav-tab logout-tab"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="profile-panel-card">
            {savedSuccess && (
              <div className="save-success-toast">
                <Check size={16} /> Profile changes saved successfully!
              </div>
            )}

            {/* TAB 1: MY PETS */}
            {activeTab === "pets" && (
              <div>
                <div className="panel-header-row">
                  <div>
                    <h3>My Registered Pets</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Manage medical histories, microchip IDs, and feeding tips.
                    </p>
                  </div>
                  <button
                    className="profile-action-btn primary"
                    onClick={() => setShowAddPet(!showAddPet)}
                  >
                    <Plus size={16} /> {showAddPet ? "Close Form" : "Add New Pet"}
                  </button>
                </div>

                {showAddPet && (
                  <form onSubmit={handleAddPetSubmit} style={{ background: "#f8faf9", padding: "1.5rem", borderRadius: "14px", border: "1px dashed #2e7d32", marginBottom: "1.5rem" }}>
                    <h4 style={{ marginBottom: "1rem", color: "#1d4633" }}>Add a Pet to Your Family</h4>
                    <div className="profile-edit-grid">
                      <div className="form-group">
                        <label>Pet Name *</label>
                        <input
                          type="text"
                          required
                          value={newPet.name}
                          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                          placeholder="e.g. Bella"
                          style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Type</label>
                        <select
                          value={newPet.type}
                          onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                          style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc" }}
                        >
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                          <option value="Bird">Bird</option>
                          <option value="Rabbit">Rabbit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Breed</label>
                        <input
                          type="text"
                          value={newPet.breed}
                          onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                          placeholder="e.g. Golden Retriever"
                          style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Age</label>
                        <input
                          type="text"
                          value={newPet.age}
                          onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                          placeholder="e.g. 2 years"
                          style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Photo URL (Optional)</label>
                        <input
                          type="text"
                          value={newPet.photo}
                          onChange={(e) => setNewPet({ ...newPet, photo: e.target.value })}
                          style={{ padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                      </div>
                    </div>
                    <button type="submit" className="profile-action-btn primary" style={{ marginTop: "1rem" }}>
                      Save Pet
                    </button>
                  </form>
                )}

                <div className="pets-grid">
                  {currentUser.myPets && currentUser.myPets.map((pet) => (
                    <div key={pet.id} className="pet-profile-card">
                      <img
                        src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"}
                        alt={pet.name}
                        className="pet-card-image"
                      />
                      <div className="pet-card-body">
                        <div className="pet-card-header">
                          <h4>{pet.name}</h4>
                          <span className="pet-type-tag">{pet.type}</span>
                        </div>
                        <p className="pet-card-desc">{pet.breed || "Mixed Breed"}</p>
                        <div className="pet-card-stats">
                          <span>🎂 {pet.age || "Unknown"}</span>
                          <span>⚖️ {pet.weight || "10 kg"}</span>
                          <span>🐾 {pet.gender || "Friendly"}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="add-pet-card" onClick={() => setShowAddPet(true)}>
                    <div className="plus-circle">
                      <Plus size={24} />
                    </div>
                    <strong>Add another companion</strong>
                    <span style={{ fontSize: "0.82rem" }}>Vaccine logs, diet & checkup alerts</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === "orders" && (
              <div>
                <div className="panel-header-row">
                  <div>
                    <h3>Orders & Subscriptions</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Track current shipping status and reorder your pet's essentials.
                    </p>
                  </div>
                  <Link to="/browse" className="profile-action-btn secondary" style={{ textDecoration: "none" }}>
                    <ShoppingBag size={16} /> Explore Store
                  </Link>
                </div>

                <div className="orders-list">
                  {currentUser.orders && currentUser.orders.length > 0 ? (
                    currentUser.orders.map((order) => (
                      <div key={order.id} className="order-item-card">
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                            <strong>Order #{order.id}</strong>
                            <span className={`order-badge-pill ${order.status}`}>
                              {order.status}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.92rem", color: "#374151" }}>{order.item}</div>
                          <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "0.2rem" }}>
                            Date: {order.date}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: "700", color: "var(--green-dark)", fontSize: "1.05rem" }}>
                            {order.amount}
                          </div>
                          <button
                            onClick={() => alert(`Tracking info for ${order.id}: Dispatched via Petzy Priority Courier.`)}
                            style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline", marginTop: "0.3rem" }}
                          >
                            Track Package
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#6b7280" }}>
                      <Package size={40} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
                      <p>No orders yet! Check out our pet food and accessories.</p>
                      <Link to="/" className="profile-action-btn primary" style={{ marginTop: "1rem", textDecoration: "none" }}>
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: ACCOUNT SETTINGS */}
            {activeTab === "settings" && (
              <div>
                <div className="panel-header-row">
                  <div>
                    <h3>Account & Personal Info</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Update your contact details, shipping address, and pet preferences.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="profile-edit-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <div className="input-with-icon">
                        <User size={18} className="input-icon-left" />
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={18} className="input-icon-left" />
                        <input
                          type="email"
                          value={currentUser.email}
                          disabled
                          style={{ background: "#f3f4f6", cursor: "not-allowed" }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <div className="input-with-icon">
                        <Phone size={18} className="input-icon-left" />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Delivery Address</label>
                      <div className="input-with-icon">
                        <MapPin size={18} className="input-icon-left" />
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          placeholder="Street, City, Postal Code"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Pet Parent Identity</label>
                      <div className="input-with-icon">
                        <PawPrint size={18} className="input-icon-left" />
                        <select
                          value={profileForm.petParentOf}
                          onChange={(e) => setProfileForm({ ...profileForm, petParentOf: e.target.value })}
                        >
                          <option value="Dog Parent">Dog Parent 🐶</option>
                          <option value="Cat Parent">Cat Parent 🐱</option>
                          <option value="Dog & Cat Parent">Dog & Cat Parent 🐾</option>
                          <option value="Bird Parent">Bird Parent 🦜</option>
                          <option value="Pet Enthusiast">Pet Enthusiast 🌟</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Avatar Image URL</label>
                      <div className="input-with-icon">
                        <Sparkles size={18} className="input-icon-left" />
                        <input
                          type="text"
                          value={profileForm.avatar}
                          onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="save-profile-btn">
                    <Check size={18} /> Save Changes
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
