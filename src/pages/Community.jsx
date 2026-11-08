import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PawPrint,
  PlusCircle,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Heart,
  Bot,
  Compass,
  Store,
  ShieldAlert,
  Loader2,
  Users,
  Flame,
  ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/community/PostCard";
import CreatePostModal from "../components/community/CreatePostModal";
import CommunityErrorBoundary from "../components/community/ErrorBoundary";
import { useAuth } from "../context/AuthContext";
import {
  fetchCommunityPosts,
  toggleBoopPost,
  deleteCommunityPost,
  getNotifications,
  markNotificationsAsRead
} from "../services/communityService";
import "../styles/Community.css";

export default function Community() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  // Load posts and notifications
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchCommunityPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load community posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      const notifs = getNotifications(currentUser.id);
      setNotifications(Array.isArray(notifs) ? notifs : []);
    }
  }, [currentUser]);

  // Boop handler
  const handleBoop = async (postId) => {
    try {
      const result = await toggleBoopPost(postId, currentUser);
      if (result) {
        setPosts((prev) =>
          prev.map((p) =>
            p && p._id === postId ? { ...p, boopCount: result.newCount } : p
          )
        );
      }
      return result;
    } catch (err) {
      console.error("Error booping post:", err);
    }
  };

  // Delete post handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this moment?")) return;
    try {
      await deleteCommunityPost(postId, currentUser?.id);
      setPosts((prev) => prev.filter((p) => p && p._id !== postId));
    } catch (err) {
      alert(err.message || "Failed to delete post.");
    }
  };

  // Callback on newly created post
  const handlePostCreated = (newPost) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  // Require login trigger
  const handleRequireLogin = () => {
    navigate("/login", { state: { from: { pathname: "/community" } } });
  };

  // Toggle notifications drawer
  const handleToggleNotifs = () => {
    if (!showNotifs && currentUser?.id) {
      markNotificationsAsRead(currentUser.id);
      setNotifications((prev) =>
        prev.map((n) => (n ? { ...n, read: true } : n))
      );
    }
    setShowNotifs(!showNotifs);
  };

  // Filter posts with full crash safety
  const filteredPosts = (Array.isArray(posts) ? posts : []).filter((post) => {
    if (!post) return false;

    // Search query matching
    const q = searchQuery.toLowerCase().trim();
    const petNameStr = String(post.petName || "").toLowerCase();
    const breedStr = String(post.breed || "").toLowerCase();
    const humanNameStr = String(post.humanName || "").toLowerCase();
    const bioStr = String(post.bio || "").toLowerCase();

    const matchesSearch =
      !q ||
      petNameStr.includes(q) ||
      breedStr.includes(q) ||
      humanNameStr.includes(q) ||
      bioStr.includes(q);

    // Category matching
    let matchesCategory = true;
    if (activeCategory === "dogs") {
      matchesCategory =
        breedStr.includes("dog") ||
        breedStr.includes("retriever") ||
        breedStr.includes("bulldog") ||
        breedStr.includes("beagle") ||
        breedStr.includes("shepherd") ||
        breedStr.includes("poodle") ||
        petNameStr.includes("dog");
    } else if (activeCategory === "cats") {
      matchesCategory =
        breedStr.includes("cat") ||
        breedStr.includes("shorthair") ||
        breedStr.includes("persian") ||
        breedStr.includes("siamese") ||
        petNameStr.includes("cat");
    } else if (activeCategory === "my-posts") {
      matchesCategory = !!(currentUser && post.userId === currentUser.id);
    }

    return matchesSearch && matchesCategory;
  });

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => n && !n.read).length
    : 0;

  return (
    <div className={`community-page ${darkMode ? "community-dark" : ""}`}>
      {/* 1. Main Petzy Top Navbar */}
      <Navbar />

      <CommunityErrorBoundary>
        {/* 2. Petzy Community Subnav */}
        <nav className="community-subnav">
          <div className="community-subnav-inner">
            {/* Brand */}
            <Link to="/community" className="community-brand">
              <div className="community-brand-badge">
                <PawPrint size={22} />
              </div>
              <div>
                <div className="community-brand-title">
                  Petzy <span>Community</span>
                </div>
                <div className="community-brand-sub">Where Pets & Humans Connect</div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="community-search-box">
              <Search size={16} className="community-search-icon" />
              <input
                type="text"
                placeholder="Search pets, breeds, or pet parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="community-search-input"
              />
            </div>

            {/* Actions */}
            <div className="community-subnav-actions">
              {/* Dark / Light Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="comm-icon-btn"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun size={18} color="#facc15" /> : <Moon size={18} />}
              </button>

              {/* Notifications Bell */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleToggleNotifs}
                  className="comm-icon-btn"
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="comm-badge-dot" />}
                </button>

                {/* Dropdown */}
                {showNotifs && (
                  <div className="comm-notifs-dropdown">
                    <div className="comm-notifs-header">
                      <span>Notifications</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--comm-text-muted)" }}>
                        {notifications.length} updates
                      </span>
                    </div>
                    <div className="comm-notifs-list">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id || Math.random()}
                            className={`comm-notif-item ${n && !n.read ? "unread" : ""}`}
                          >
                            <PawPrint size={18} color="#2e7d32" />
                            <div>
                              <strong>{n.senderName || "A friend"}</strong> booped your pet{" "}
                              <strong>{n.petName || "buddy"}</strong>!
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "20px", textAlign: "center", color: "var(--comm-text-muted)", fontSize: "0.85rem" }}>
                          No notifications yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Share Post Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="comm-btn-primary"
                >
                  <PlusCircle size={18} />
                  <span>Share Moment</span>
                </button>
              ) : (
                <button
                  onClick={handleRequireLogin}
                  className="comm-btn-primary"
                >
                  <PlusCircle size={18} />
                  <span>Log In to Post</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* 3. Main 3-Column Container */}
        <div className="community-main-container">
          {/* Left Rail: Sidebar */}
          <aside className="community-left-rail">
            {/* User Profile Card */}
            {isAuthenticated ? (
              <div className="community-sidebar-card comm-user-card">
                <div className="comm-user-avatar-wrap">
                  <img
                    src={
                      currentUser?.myPets?.[0]?.photo ||
                      currentUser?.avatar ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={currentUser?.fullName || "User"}
                    className="comm-user-avatar"
                  />
                </div>
                <h3 className="comm-user-name">{currentUser?.fullName || "Petzy User"}</h3>
                <span className="comm-user-pet-tag">
                  🐾 {currentUser?.myPets?.[0]?.name || "Pet Parent"} ({currentUser?.myPets?.[0]?.breed || "Companion"})
                </span>

                <div className="comm-user-stats">
                  <div className="comm-stat-item">
                    <span className="comm-stat-num">
                      {posts.filter((p) => p && p.userId && currentUser && p.userId === currentUser.id).length}
                    </span>
                    <span className="comm-stat-lbl">Moments</span>
                  </div>
                  <div className="comm-stat-item">
                    <span className="comm-stat-num">
                      {currentUser?.myPets?.length || 1}
                    </span>
                    <span className="comm-stat-lbl">Pets</span>
                  </div>
                  <div className="comm-stat-item">
                    <span className="comm-stat-num">
                      {posts
                        .filter((p) => p && p.userId && currentUser && p.userId === currentUser.id)
                        .reduce((sum, p) => sum + (Number(p.boopCount) || 0), 0)}
                    </span>
                    <span className="comm-stat-lbl">Boops</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="community-sidebar-card">
                <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "8px" }}>
                  Welcome to Petzy!
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--comm-text-muted)", marginBottom: "16px" }}>
                  Connect with passionate pet parents across Sri Lanka.
                </p>
                <Link to="/login" className="comm-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Sign In to Petzy
                </Link>
              </div>
            )}

            {/* Quick Navigation Links */}
            <div className="community-sidebar-card">
              <ul className="comm-nav-list">
                <li className={`comm-nav-item ${activeCategory === "all" ? "active" : ""}`}>
                  <button onClick={() => setActiveCategory("all")}>
                    <Users size={18} />
                    <span>All Moments</span>
                  </button>
                </li>
                {isAuthenticated && (
                  <li className={`comm-nav-item ${activeCategory === "my-posts" ? "active" : ""}`}>
                    <button onClick={() => setActiveCategory("my-posts")}>
                      <PawPrint size={18} />
                      <span>My Posts</span>
                    </button>
                  </li>
                )}
                <li className="comm-nav-item">
                  <Link to="/browse">
                    <Compass size={18} />
                    <span>Adopt a Pet</span>
                  </Link>
                </li>
                <li className="comm-nav-item">
                  <Link to="/shop">
                    <Store size={18} />
                    <span>Petzy Store</span>
                  </Link>
                </li>
                <li className="comm-nav-item">
                  <Link to="/lost-found">
                    <ShieldAlert size={18} />
                    <span>Lost & Found</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Center Rail: Feed */}
          <main className="community-feed-column">
            {/* Guest Sign-in Banner (if not logged in) */}
            {!isAuthenticated && (
              <div className="comm-guest-banner">
                <div className="comm-guest-banner-text">
                  <h3>
                    <Sparkles size={18} /> Join Petzy Community
                  </h3>
                  <p>
                    Share your pet's cutest photos, connect with furry friends, and boop their noses!
                  </p>
                </div>
                <div className="comm-guest-banner-actions">
                  <Link to="/login" className="comm-btn-primary">
                    Log In
                  </Link>
                  <Link to="/signup" className="comm-btn-secondary">
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Teaser Box for Logged In User */}
            {isAuthenticated && (
              <div className="comm-create-teaser">
                <img
                  src={
                    currentUser?.avatar ||
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={currentUser?.fullName || "User"}
                  className="comm-teaser-avatar"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="comm-teaser-btn"
                >
                  What did {currentUser?.myPets?.[0]?.name || "your pet"} do today? Share a moment...
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="comm-teaser-upload-btn"
                  title="Upload Photo"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            )}

            {/* Category Filter Chips */}
            <div className="comm-filter-chips">
              <button
                onClick={() => setActiveCategory("all")}
                className={`comm-chip ${activeCategory === "all" ? "active" : ""}`}
              >
                🐾 All Pets
              </button>
              <button
                onClick={() => setActiveCategory("dogs")}
                className={`comm-chip ${activeCategory === "dogs" ? "active" : ""}`}
              >
                🐕 Dogs
              </button>
              <button
                onClick={() => setActiveCategory("cats")}
                className={`comm-chip ${activeCategory === "cats" ? "active" : ""}`}
              >
                🐈 Cats
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveCategory("my-posts")}
                  className={`comm-chip ${activeCategory === "my-posts" ? "active" : ""}`}
                >
                  ⭐ My Posts
                </button>
              )}
            </div>

            {/* Feed Content */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--comm-text-muted)" }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px", color: "var(--comm-green)" }} />
                <p>Fetching adorable moments...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onBoop={handleBoop}
                  onDelete={handleDeletePost}
                  currentUser={currentUser}
                  isAuthenticated={isAuthenticated}
                  onRequireLogin={handleRequireLogin}
                />
              ))
            ) : (
              <div className="community-sidebar-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                <PawPrint size={40} color="#2e7d32" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                <h3 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>No moments found</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--comm-text-muted)", marginBottom: "16px" }}>
                  {searchQuery
                    ? "Try searching for a different breed or pet name."
                    : "Be the first to share an adorable photo with the Petzy family!"}
                </p>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="comm-btn-primary"
                  >
                    <PlusCircle size={18} /> Share a Moment
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Right Rail: Widgets */}
          <aside className="community-right-rail">
            {/* Petzy AI Doctor Callout */}
            <div className="comm-doctor-banner">
              <h4>
                <Bot size={20} color="#facc15" /> Petzy Doctor AI
              </h4>
              <p>
                Have questions about your pet's diet, health, or sudden symptoms?
                Get instant veterinary advice 24/7.
              </p>
              <Link to="/services" className="comm-doctor-cta">
                Chat with Vet AI <ArrowRight size={14} />
              </Link>
            </div>

            {/* Trending Pets in Sri Lanka */}
            <div className="comm-widget-card">
              <div className="comm-widget-title">
                <Flame size={18} />
                <span>Trending Paws</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80"
                    alt="Milo"
                    style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700" }}>Milo</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--comm-text-muted)" }}>Golden Retriever • 38 Boops</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80"
                    alt="Luna"
                    style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700" }}>Luna</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--comm-text-muted)" }}>British Shorthair • 52 Boops</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80"
                    alt="Cooper"
                    style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700" }}>Cooper</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--comm-text-muted)" }}>French Bulldog • 29 Boops</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Pet Adoption Spotlight */}
            <div className="comm-widget-card">
              <div className="comm-widget-title">
                <Heart size={18} />
                <span>Looking for a Home</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--comm-text-muted)", marginBottom: "12px" }}>
                Give a rescue pet a second chance at happiness today.
              </p>
              <Link
                to="/browse"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "var(--comm-green)",
                  fontWeight: "700"
                }}
              >
                Browse Adoptable Pets <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>

        {/* 4. Create Post Modal */}
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
          onPostCreated={handlePostCreated}
        />
      </CommunityErrorBoundary>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
