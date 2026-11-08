import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  PawPrint,
  ArrowLeft,
  Sparkles,
  UserCheck,
  UserPlus,
  Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/community/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  fetchCommunityPosts,
  toggleBoopPost,
  deleteCommunityPost,
  isFollowingUser,
  toggleFollowUser
} from "../services/communityService";
import "../styles/Community.css";

export default function CommunityUserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(12);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const allPosts = await fetchCommunityPosts();
        
        // Find posts by this username
        const userPosts = allPosts.filter(
          (p) => (p.username || "").toLowerCase() === (username || "").toLowerCase()
        );
        setPosts(userPosts);

        if (userPosts.length > 0) {
          const first = userPosts[0];
          setProfileUser({
            id: first.userId,
            username: first.username,
            humanName: first.humanName,
            petName: first.petName,
            breed: first.breed,
            bio: first.bio,
            avatar: first.authorAvatar
          });
          if (currentUser?.id) {
            setIsFollowing(isFollowingUser(currentUser.id, first.userId));
          }
        } else if (currentUser && (username === "me" || username === currentUser.email?.split("@")[0])) {
          setProfileUser({
            id: currentUser.id,
            username: currentUser.email?.split("@")[0],
            humanName: currentUser.fullName,
            petName: currentUser.myPets?.[0]?.name || "Milo",
            breed: currentUser.myPets?.[0]?.breed || "Golden Retriever",
            bio: currentUser.petParentOf || "Loving Pet Parent",
            avatar: currentUser.avatar || currentUser.myPets?.[0]?.photo
          });
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username, currentUser]);

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/community/u/${username}` } } });
      return;
    }
    if (!profileUser?.id) return;
    const nowFollowing = toggleFollowUser(currentUser.id, profileUser.id);
    setIsFollowing(nowFollowing);
    setFollowersCount((prev) => (nowFollowing ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleBoop = async (postId) => {
    const res = await toggleBoopPost(postId, currentUser);
    if (res) {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, boopCount: res.newCount } : p
        )
      );
    }
    return res;
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this moment?")) return;
    try {
      await deleteCommunityPost(postId, currentUser?.id);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.message || "Failed to delete post.");
    }
  };

  const isOwnProfile =
    currentUser &&
    (profileUser?.id === currentUser.id ||
      username?.toLowerCase() === currentUser.email?.split("@")[0]?.toLowerCase());

  const totalBoops = posts.reduce((sum, p) => sum + (p.boopCount || 0), 0);

  return (
    <div className="community-page">
      <Navbar />

      <main style={{ maxWidth: "860px", margin: "24px auto", padding: "0 16px", minHeight: "70vh", width: "100%" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "var(--comm-green)",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "16px"
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto", color: "var(--comm-green)" }} />
          </div>
        ) : profileUser ? (
          <div>
            {/* Profile Header Card */}
            <div
              className="community-sidebar-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "32px 20px",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "50%",
                  padding: "4px",
                  background: "linear-gradient(135deg, var(--comm-green), var(--comm-gold))",
                  marginBottom: "14px"
                }}
              >
                <img
                  src={profileUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                  alt={profileUser.petName}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              </div>

              <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "4px" }}>
                {profileUser.petName} <Sparkles size={16} color="#f4b41a" />
              </h2>
              <div style={{ fontSize: "0.95rem", color: "var(--comm-green)", fontWeight: "600", marginBottom: "8px" }}>
                {profileUser.breed} • {profileUser.humanName}'s Pet
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--comm-text-muted)", maxWidth: "460px", marginBottom: "16px" }}>
                {profileUser.bio || "Proud member of the Petzy Family! 🐾"}
              </p>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                {isOwnProfile ? (
                  <Link to="/profile" className="comm-btn-primary">
                    Manage Pet Profile
                  </Link>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    className={`comm-btn-primary ${isFollowing ? "comm-btn-secondary" : ""}`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={18} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} /> Follow Pet
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "40px",
                  borderTop: "1px solid var(--comm-border)",
                  paddingTop: "16px",
                  width: "100%",
                  maxWidth: "500px"
                }}
              >
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>{posts.length}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--comm-text-muted)", textTransform: "uppercase" }}>
                    Moments
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>{followersCount}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--comm-text-muted)", textTransform: "uppercase" }}>
                    Followers
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>{totalBoops}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--comm-text-muted)", textTransform: "uppercase" }}>
                    Boops
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed for this User */}
            <div style={{ marginTop: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <PawPrint size={18} color="var(--comm-green)" />
                {profileUser.petName}'s Moments
              </h3>

              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onBoop={handleBoop}
                    onDelete={handleDeletePost}
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                    onRequireLogin={() => navigate("/login")}
                  />
                ))
              ) : (
                <div className="community-sidebar-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ color: "var(--comm-text-muted)" }}>No moments shared yet by this pet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="community-sidebar-card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <PawPrint size={40} color="#2e7d32" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Pet Not Found</h3>
            <p style={{ color: "var(--comm-text-muted)", marginBottom: "16px" }}>
              We couldn't find a pet profile matching @{username}.
            </p>
            <Link to="/community" className="comm-btn-primary">
              Browse Community Feed
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
