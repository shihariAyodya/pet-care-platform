import React, { useState } from "react";
import {
  X,
  UploadCloud,
  Link as LinkIcon,
  Loader2,
  PawPrint,
  Sparkles
} from "lucide-react";
import { createCommunityPost } from "../../services/communityService";

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated
}) {
  const defaultPet = currentUser?.myPets?.[0];
  const [petName, setPetName] = useState(defaultPet?.name || "Milo");
  const [breed, setBreed] = useState(defaultPet?.breed || "Golden Retriever");
  const [bio, setBio] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // 'file' | 'url'
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    setImageFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleRemovePhoto = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (uploadMode === "file" && !imageFile && !previewUrl) {
      setErrorMsg("Please select a photo of your pet to share!");
      return;
    }

    if (uploadMode === "url" && !imageUrl.trim()) {
      setErrorMsg("Please enter an image URL!");
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createCommunityPost({
        currentUser,
        petName,
        breed,
        bio,
        imageUrl: uploadMode === "url" ? imageUrl : "",
        imageFile: uploadMode === "file" ? imageFile : null
      });

      if (onPostCreated) {
        onPostCreated(created);
      }
      onClose();
    } catch (err) {
      console.error("Error creating post:", err);
      setErrorMsg(err.message || "Failed to share post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comm-modal-overlay" onClick={onClose}>
      <div
        className="comm-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="comm-modal-header">
          <div className="comm-modal-title">
            <PawPrint size={22} color="#1d4633" />
            <span>Share a Petzy Moment</span>
          </div>
          <button onClick={onClose} className="comm-modal-close">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="comm-modal-body">
            {errorMsg && (
              <div style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "0.88rem"
              }}>
                {errorMsg}
              </div>
            )}

            {/* Pet Details Row */}
            <div className="comm-form-row">
              <div className="comm-field-group">
                <label className="comm-field-label">Pet's Name</label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Milo, Luna"
                  required
                  className="comm-field-input"
                />
              </div>

              <div className="comm-field-group">
                <label className="comm-field-label">Breed / Species</label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  required
                  className="comm-field-input"
                />
              </div>
            </div>

            {/* Image Mode Switcher */}
            <div className="comm-field-group">
              <label className="comm-field-label">Pet Photo</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`comm-chip ${uploadMode === "file" ? "active" : ""}`}
                >
                  <UploadCloud size={16} /> Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`comm-chip ${uploadMode === "url" ? "active" : ""}`}
                >
                  <LinkIcon size={16} /> Photo Link / URL
                </button>
              </div>

              {/* Upload Drop Zone / Preview */}
              {previewUrl || (uploadMode === "url" && imageUrl.trim()) ? (
                <div className="comm-upload-preview-wrap">
                  <img
                    src={previewUrl || imageUrl}
                    alt="Preview"
                    className="comm-upload-preview"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="comm-preview-remove"
                    title="Remove Photo"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : uploadMode === "file" ? (
                <label className="comm-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                  <UploadCloud size={38} color="#2e7d32" style={{ margin: "0 auto 8px" }} />
                  <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "4px" }}>
                    Click or Drag to Upload Pet Photo
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--comm-text-muted)" }}>
                    Supports JPG, PNG, WEBP, GIF
                  </p>
                </label>
              ) : (
                <input
                  type="url"
                  placeholder="Paste direct image URL (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="comm-field-input"
                />
              )}
            </div>

            {/* Caption / Story */}
            <div className="comm-field-group">
              <label className="comm-field-label">What's on their mind? (Caption)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a funny moment, new trick, or cute story about your pet..."
                rows={3}
                className="comm-field-textarea"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="comm-modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="comm-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="comm-btn-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sharing...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Share Moment 🐾
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
