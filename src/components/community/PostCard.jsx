import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PawPrint,
  MessageCircle,
  Share2,
  Trash2,
  Send,
  Sparkles,
  Check
} from "lucide-react";
import {
  hasUserBooped,
  fetchPostComments,
  addPostComment
} from "../../services/communityService";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80";
const DEFAULT_POST_IMG = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80";

export default function PostCard({
  post,
  onBoop,
  onDelete,
  currentUser,
  isAuthenticated,
  onRequireLogin
}) {
  if (!post) return null;

  const [isBooped, setIsBooped] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (post?._id) {
      setIsBooped(hasUserBooped(post._id));
    }
  }, [post?._id]);

  const handleBoopClick = async () => {
    if (!isAuthenticated) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    const result = await onBoop(post._id);
    if (result) {
      setIsBooped(result.isBooped);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await fetchPostComments(post._id);
        setComments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn("Could not load comments:", e);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const added = await addPostComment(post._id, currentUser, newComment.trim());
      if (added) {
        setComments((prev) => [...prev, added]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/community/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.petName || "Pet"} on Petzy Community`,
          text: post.bio || `Check out ${post.petName || "this pet"}'s cute photo on Petzy!`,
          url: postUrl
        });
      } catch {
        await navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOwner = !!(
    currentUser &&
    post &&
    post.userId &&
    (currentUser.id === post.userId || post.userId === "usr_demo")
  );

  // Safe Date Formatter
  const getTimeDisplay = (dateVal) => {
    if (!dateVal) return "Recently";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Recently";
    }
  };

  const timeDisplay = getTimeDisplay(post.createdAt);

  return (
    <article className="community-card">
      {/* 1. Card Header */}
      <div className="comm-card-header">
        <Link
          to={`/community/u/${post.username || "petzy_friend"}`}
          className="comm-author-group"
        >
          <img
            src={post.authorAvatar || DEFAULT_AVATAR}
            alt={post.petName || "Pet"}
            className="comm-author-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
          />
          <div className="comm-author-info">
            <span className="comm-pet-heading">
              {post.petName || "Pet"} <Sparkles size={14} color="#f4b41a" />
            </span>
            <span className="comm-author-sub">
              {post.breed || "Companion"} • {post.humanName || "Pet Parent"}'s Pet
            </span>
          </div>
        </Link>

        {isOwner && (
          <button
            onClick={() => onDelete(post._id)}
            className="comm-delete-btn"
            title="Delete this post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* 2. Media Image */}
      <div className="comm-card-media">
        <img
          src={post.imageUrl || DEFAULT_POST_IMG}
          alt={post.petName || "Pet"}
          className="comm-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_POST_IMG;
          }}
        />
      </div>

      {/* 3. Action Buttons & Boop Counter */}
      <div className="comm-card-actions">
        <div className="comm-actions-left">
          {/* Petzy Boop Button */}
          <button
            onClick={handleBoopClick}
            className={`comm-boop-btn ${isBooped ? "booped" : ""}`}
            title="Boop this pet!"
          >
            <PawPrint
              size={18}
              className={isBooped ? "comm-boop-paw-icon" : ""}
            />
            <span>{isBooped ? "Booped!" : "Boop"}</span>
          </button>

          {/* Comments Toggle */}
          <button
            onClick={handleToggleComments}
            className="comm-action-round"
            title="View comments"
          >
            <MessageCircle size={22} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="comm-action-round"
            title={copied ? "Link Copied!" : "Share Post"}
          >
            {copied ? <Check size={20} color="#2e7d32" /> : <Share2 size={20} />}
          </button>
        </div>

        {/* Counter */}
        <span className="comm-boop-count-badge">
          🐾 {Number(post.boopCount) || 0} {Number(post.boopCount) === 1 ? "Boop" : "Boops"}
        </span>
      </div>

      {/* 4. Post Bio / Caption */}
      <div className="comm-card-body">
        {post.bio && (
          <p className="comm-caption">
            <span className="comm-caption-pet">{post.petName || "Pet"}</span>
            {post.bio}
          </p>
        )}
        <span className="comm-timestamp">{timeDisplay}</span>
      </div>

      {/* 5. Comments Drawer / Accordion */}
      {showComments && (
        <div className="comm-comments-panel">
          {loadingComments ? (
            <div style={{ textAlign: "center", padding: "12px", color: "var(--comm-text-muted)" }}>
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            <div className="comm-comments-list">
              {comments.map((cm) => (
                <div key={cm.id || Math.random()} className="comm-comment-bubble">
                  <img
                    src={cm.authorAvatar || DEFAULT_AVATAR}
                    alt={cm.authorName || "User"}
                    className="comm-comment-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="comm-comment-content">
                    <div className="comm-comment-author">{cm.authorName || "Petzy Friend"}</div>
                    <div className="comm-comment-text">{cm.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--comm-text-muted)", fontStyle: "italic", marginBottom: "12px" }}>
              No comments yet. Say something friendly to {post.petName || "this pet"}!
            </p>
          )}

          {/* Add comment form */}
          <form onSubmit={handleSendComment} className="comm-add-comment-form">
            <input
              type="text"
              placeholder={
                isAuthenticated
                  ? `Comment as ${currentUser?.fullName || "Pet Parent"}...`
                  : "Log in to leave a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comm-comment-input"
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="comm-comment-send"
              title="Post comment"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
