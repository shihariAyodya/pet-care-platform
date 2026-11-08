import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, PawPrint } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostCard from "../components/community/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  fetchCommunityPosts,
  toggleBoopPost,
  deleteCommunityPost
} from "../services/communityService";
import "../styles/Community.css";

export default function CommunityPostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const allPosts = await fetchCommunityPosts();
        const found = allPosts.find((p) => p._id === postId || p.supabaseId?.toString() === postId);
        setPost(found || null);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postId]);

  const handleBoop = async (id) => {
    const res = await toggleBoopPost(id, currentUser);
    if (res && post) {
      setPost({ ...post, boopCount: res.newCount });
    }
    return res;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this moment?")) return;
    try {
      await deleteCommunityPost(id, currentUser?.id);
      navigate("/community");
    } catch (err) {
      alert(err.message || "Failed to delete post.");
    }
  };

  return (
    <div className="community-page">
      <Navbar />

      <main style={{ maxWidth: "680px", margin: "30px auto", padding: "0 16px", minHeight: "60vh", width: "100%" }}>
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
          <ArrowLeft size={18} /> Back to Community Feed
        </button>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto", color: "var(--comm-green)" }} />
          </div>
        ) : post ? (
          <PostCard
            post={post}
            onBoop={handleBoop}
            onDelete={handleDelete}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onRequireLogin={() => navigate("/login", { state: { from: { pathname: `/community/post/${postId}` } } })}
          />
        ) : (
          <div className="community-sidebar-card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <PawPrint size={40} color="#2e7d32" style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Moment Not Found</h3>
            <p style={{ color: "var(--comm-text-muted)", marginBottom: "16px" }}>
              This pet moment may have been deleted or the link is incorrect.
            </p>
            <Link to="/community" className="comm-btn-primary">
              Return to Feed
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
