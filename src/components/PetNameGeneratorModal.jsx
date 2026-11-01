import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Heart,
  Copy,
  Check,
  Volume2,
  Sliders,
  Dog,
  Cat,
  Bird,
  Rabbit,
  HelpCircle,
  ShieldCheck,
  Info,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { generateClientPetNames } from "../data/petNamesFallback";
import "../styles/PetNameGeneratorModal.css";

const API_GENERATE_URL = "http://localhost:3000/api/pet-names/generate";

const PET_TYPES = [
  { id: "Dog", label: "Dog", icon: Dog },
  { id: "Cat", label: "Cat", icon: Cat },
  { id: "Bird", label: "Bird", icon: Bird },
  { id: "Rabbit", label: "Rabbit", icon: Rabbit },
  { id: "Hamster", label: "Hamster", emoji: "🐹" },
  { id: "Turtle", label: "Turtle", emoji: "🐢" },
  { id: "Fish", label: "Fish", emoji: "🐠" },
  { id: "Reptile", label: "Reptile", emoji: "🦎" },
  { id: "Other", label: "Other", emoji: "🐾" }
];

const GENDER_OPTIONS = [
  { id: "Male names", label: "Male names", desc: "Masculine & handsome" },
  { id: "Female names", label: "Female names", desc: "Feminine & lovely" },
  { id: "Gender-neutral names", label: "Gender-neutral names", desc: "Universal & versatile" },
  { id: "No preference", label: "No preference", desc: "Show all combinations" }
];

const COLOR_OPTIONS = [
  { id: "White", label: "White", colorCode: "#ffffff", border: "#cbd5e1" },
  { id: "Black", label: "Black", colorCode: "#1e293b" },
  { id: "Brown", label: "Brown", colorCode: "#854d0e" },
  { id: "Golden", label: "Golden", colorCode: "#eab308" },
  { id: "Gray", label: "Gray", colorCode: "#94a3b8" },
  { id: "Orange", label: "Orange / Ginger", colorCode: "#ea580c" },
  { id: "Mixed colors", label: "Mixed / Calico / Brindle", gradient: "linear-gradient(45deg, #1e293b, #d97706, #ffffff)" },
  { id: "Other", label: "Other color" },
  { id: "Not sure", label: "Not sure / Varies" }
];

const PERSONALITY_OPTIONS = [
  { id: "Playful", label: "Playful 🎾" },
  { id: "Calm", label: "Calm 🕊️" },
  { id: "Energetic", label: "Energetic ⚡" },
  { id: "Friendly", label: "Friendly 🥰" },
  { id: "Brave", label: "Brave 🦁" },
  { id: "Shy", label: "Shy 🙈" },
  { id: "Curious", label: "Curious 🧐" },
  { id: "Funny and mischievous", label: "Funny & Mischievous 🎭" },
  { id: "Smart", label: "Smart 🧠" },
  { id: "Affectionate", label: "Affectionate 💕" },
  { id: "Independent", label: "Independent 👑" },
  { id: "Protective", label: "Protective 🛡️" }
];

const STYLE_OPTIONS = [
  { id: "Cute and adorable", label: "Cute & Adorable" },
  { id: "Funny and creative", label: "Funny & Creative" },
  { id: "Unique and uncommon", label: "Unique & Uncommon" },
  { id: "Modern and trendy", label: "Modern & Trendy" },
  { id: "Elegant and classy", label: "Elegant & Classy" },
  { id: "Strong and powerful", label: "Strong & Powerful" },
  { id: "Traditional", label: "Traditional" },
  { id: "Nature-inspired", label: "Nature-Inspired" },
  { id: "Mythological", label: "Mythological" },
  { id: "Human-style names", label: "Human-Style Names" },
  { id: "Short and simple", label: "Short & Simple" }
];

const LANGUAGE_OPTIONS = [
  { id: "English", label: "English" },
  { id: "Sinhala", label: "Sinhala (සංස්කෘතික)" },
  { id: "Tamil", label: "Tamil (தமிழ்)" },
  { id: "Japanese", label: "Japanese (日本語)" },
  { id: "Korean", label: "Korean (한국어)" },
  { id: "Sanskrit", label: "Sanskrit (संस्कृत)" },
  { id: "Greek or Roman mythology", label: "Greek / Roman Mythology" },
  { id: "Other", label: "Other Language" },
  { id: "No preference", label: "No Preference" }
];

const MEANING_OPTIONS = [
  { id: "Love and friendship", label: "Love & Friendship ❤️" },
  { id: "Happiness and joy", label: "Happiness & Joy ☀️" },
  { id: "Strength and courage", label: "Strength & Courage 🛡️" },
  { id: "Peace and calmness", label: "Peace & Calmness 🌿" },
  { id: "Beauty and elegance", label: "Beauty & Elegance 💎" },
  { id: "Nature", label: "Nature & Flora 🍃" },
  { id: "Stars and the universe", label: "Stars & Cosmos ✨" },
  { id: "Good luck", label: "Good Luck & Fortune 🍀" },
  { id: "No specific meaning", label: "No Specific Meaning" }
];

const LENGTH_OPTIONS = ["Short", "Medium", "Long", "No preference"];

export default function PetNameGeneratorModal({ isOpen, onClose }) {
  // Navigation states: 'wizard' | 'summary' | 'results' | 'favorites'
  const [viewMode, setViewMode] = useState("wizard");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form Questionnaire State
  const [formData, setFormData] = useState({
    petType: "Dog",
    customPetType: "",
    gender: "No preference",
    color: "Not sure",
    specialFeatures: "",
    personality: [],
    styles: ["Cute and adorable"],
    language: "No preference",
    meanings: [],
    additionalNotes: "",
    nameLength: "No preference",
    favoriteNames: "",
    excludeFavorites: false
  });

  const [stepError, setStepError] = useState("");

  // Results & Favorites State
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [savedFavorites, setSavedFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("pet_name_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pet_name_favorites", JSON.stringify(savedFavorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [savedFavorites]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handlers for questionnaire
  const handlePetTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, petType: type }));
    setStepError("");
  };

  const togglePersonality = (item) => {
    setFormData((prev) => {
      const exists = prev.personality.includes(item);
      return {
        ...prev,
        personality: exists
          ? prev.personality.filter((i) => i !== item)
          : [...prev.personality, item]
      };
    });
  };

  const toggleStyle = (item) => {
    setFormData((prev) => {
      const exists = prev.styles.includes(item);
      return {
        ...prev,
        styles: exists
          ? prev.styles.filter((i) => i !== item)
          : [...prev.styles, item]
      };
    });
  };

  const toggleMeaning = (item) => {
    setFormData((prev) => {
      if (item === "No specific meaning") {
        return { ...prev, meanings: ["No specific meaning"] };
      }
      const cleaned = prev.meanings.filter((m) => m !== "No specific meaning");
      const exists = cleaned.includes(item);
      return {
        ...prev,
        meanings: exists ? cleaned.filter((i) => i !== item) : [...cleaned, item]
      };
    });
  };

  // Validation before proceeding
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.petType) {
        setStepError("Please select a pet type to continue.");
        return;
      }
      if (formData.petType === "Other" && !formData.customPetType.trim()) {
        setStepError("Please specify the animal type.");
        return;
      }
    }
    setStepError("");

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setViewMode("summary");
    }
  };

  const handlePrevStep = () => {
    setStepError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setFormData({
      petType: "Dog",
      customPetType: "",
      gender: "No preference",
      color: "Not sure",
      specialFeatures: "",
      personality: [],
      styles: ["Cute and adorable"],
      language: "No preference",
      meanings: [],
      additionalNotes: "",
      nameLength: "No preference",
      favoriteNames: "",
      excludeFavorites: false
    });
    setCurrentStep(1);
    setViewMode("wizard");
    setResults([]);
    setApiError(null);
  };

  // Call AI Backend
  const handleGenerateNames = async () => {
    setIsLoading(true);
    setApiError(null);
    setViewMode("results");

    try {
      const response = await fetch(API_GENERATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.names) && data.names.length > 0) {
        setResults(data.names);
      } else {
        throw new Error("Invalid response format received from AI.");
      }
    } catch (err) {
      console.warn("AI Generation Fetch Error, activating smart client generator:", err);
      // Fallback immediately to smart client generator matching user selections
      const fallbackResults = generateClientPetNames(formData);
      setResults(fallbackResults);
    } finally {
      setIsLoading(false);
    }
  };

  // Favorites toggle
  const toggleFavorite = (nameObj) => {
    const isFav = savedFavorites.some((f) => f.name.toLowerCase() === nameObj.name.toLowerCase());
    if (isFav) {
      setSavedFavorites(savedFavorites.filter((f) => f.name.toLowerCase() !== nameObj.name.toLowerCase()));
    } else {
      setSavedFavorites([...savedFavorites, { ...nameObj, savedAt: new Date().toISOString() }]);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dynamic appearance label depending on pet type
  const isBirdOrFishOrReptile =
    formData.petType === "Bird" ||
    formData.petType === "Fish" ||
    formData.petType === "Reptile" ||
    formData.petType === "Turtle";

  const appearanceFeaturePrompt = isBirdOrFishOrReptile
    ? "Any special physical features (feathers, shell, scale patterns)?"
    : "Any special physical features (fluffy fur, blue eyes, long ears, markings)?";

  return (
    <div className="pet-modal-overlay" role="dialog" aria-modal="true">
      <div className="pet-modal-container">
        {/* Top Header Bar */}
        <div className="pet-modal-header">
          <div className="modal-title-area">
            <div className="badge-sparkle">
              <Sparkles size={16} className="sparkle-gold" />
              <span>AI Powered</span>
            </div>
            <h2>AI Pet Name Generator</h2>
            <p className="modal-subtitle">
              Find the perfect name for your furry friend with a little help from AI.
            </p>
          </div>

          <div className="modal-header-actions">
            {savedFavorites.length > 0 && (
              <button
                className={`fav-count-pill ${viewMode === "favorites" ? "active" : ""}`}
                onClick={() => setViewMode(viewMode === "favorites" ? "results" : "favorites")}
                title="View Saved Favorites"
              >
                <Bookmark size={15} />
                <span>Favorites ({savedFavorites.length})</span>
              </button>
            )}
            <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body Based on View Mode */}
        <div className="pet-modal-content">
          {/* VIEW: WIZARD */}
          {viewMode === "wizard" && (
            <div className="wizard-step-wrapper">
              {/* Progress Indicator */}
              <div className="step-progress-wrapper">
                <div className="step-progress-info">
                  <span className="step-number-tag">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="step-name-preview">
                    {currentStep === 1 && "Pet Type"}
                    {currentStep === 2 && "Gender Preference"}
                    {currentStep === 3 && "Appearance & Look"}
                    {currentStep === 4 && "Personality Traits"}
                    {currentStep === 5 && "Naming Styles"}
                    {currentStep === 6 && "Language & Meaning"}
                    {currentStep === 7 && "Additional Preferences"}
                  </span>
                </div>
                <div className="step-progress-bar">
                  <div
                    className="step-progress-fill"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              {stepError && <div className="step-error-banner">{stepError}</div>}

              {/* STEP 1: PET TYPE */}
              {currentStep === 1 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">What type of pet are you naming?</h3>
                  <p className="step-desc">Select your pet type so our AI can generate suitable names.</p>

                  <div className="cards-grid">
                    {PET_TYPES.map((type) => {
                      const IconComp = type.icon;
                      const isSelected = formData.petType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          className={`selection-card ${isSelected ? "selected" : ""}`}
                          onClick={() => handlePetTypeSelect(type.id)}
                        >
                          <div className="card-icon-bubble">
                            {IconComp ? <IconComp size={24} /> : <span className="emoji-icon">{type.emoji}</span>}
                          </div>
                          <span className="card-label">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {formData.petType === "Other" && (
                    <div className="other-input-group animate-slide">
                      <label htmlFor="customPet">Specify animal type *</label>
                      <input
                        id="customPet"
                        type="text"
                        placeholder="e.g. Hedgehog, Guinea Pig, Ferret..."
                        value={formData.customPetType}
                        onChange={(e) =>
                          setFormData({ ...formData, customPetType: e.target.value })
                        }
                        className="custom-text-input"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: GENDER PREFERENCE */}
              {currentStep === 2 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">What kind of names would you prefer?</h3>
                  <p className="step-desc">Optional — You can select any vibe or keep it open.</p>

                  <div className="options-vertical-grid">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`option-row-card ${formData.gender === opt.id ? "selected" : ""}`}
                        onClick={() => setFormData({ ...formData, gender: opt.id })}
                      >
                        <div className="radio-circle">
                          {formData.gender === opt.id && <div className="radio-inner" />}
                        </div>
                        <div className="option-row-text">
                          <span className="option-title">{opt.label}</span>
                          <span className="option-desc">{opt.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: APPEARANCE */}
              {currentStep === 3 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">What does your pet look like?</h3>
                  <p className="step-desc">Color and distinctive traits inspire poetic names.</p>

                  <div className="colors-grid">
                    {COLOR_OPTIONS.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        className={`color-pill ${formData.color === col.id ? "selected" : ""}`}
                        onClick={() => setFormData({ ...formData, color: col.id })}
                      >
                        {col.colorCode && (
                          <span
                            className="color-dot"
                            style={{
                              backgroundColor: col.colorCode,
                              border: col.border ? `1px solid ${col.border}` : "1px solid rgba(0,0,0,0.1)"
                            }}
                          />
                        )}
                        {col.gradient && (
                          <span className="color-dot" style={{ background: col.gradient }} />
                        )}
                        <span>{col.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="form-group mt-6">
                    <label className="input-label">{appearanceFeaturePrompt}</label>
                    <input
                      type="text"
                      className="custom-text-input"
                      placeholder="e.g. Fluffy fur, blue eyes, tiny white socks, pointy ears..."
                      value={formData.specialFeatures}
                      onChange={(e) => setFormData({ ...formData, specialFeatures: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: PERSONALITY */}
              {currentStep === 4 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">How would you describe your pet's personality?</h3>
                  <p className="step-desc">Select all that apply. Multiple selections welcome!</p>

                  <div className="chips-cloud">
                    {PERSONALITY_OPTIONS.map((trait) => {
                      const isSelected = formData.personality.includes(trait.id);
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          className={`trait-chip ${isSelected ? "selected" : ""}`}
                          onClick={() => togglePersonality(trait.id)}
                        >
                          {trait.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: NAMING STYLE */}
              {currentStep === 5 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">What style of name do you like?</h3>
                  <p className="step-desc">Choose one or more styles that resonate with your taste.</p>

                  <div className="chips-cloud">
                    {STYLE_OPTIONS.map((style) => {
                      const isSelected = formData.styles.includes(style.id);
                      return (
                        <button
                          key={style.id}
                          type="button"
                          className={`trait-chip ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleStyle(style.id)}
                        >
                          {style.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: LANGUAGE & MEANING */}
              {currentStep === 6 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">Language & Desired Meaning</h3>
                  <p className="step-desc">
                    Would you like cultural inspiration or a specific feeling expressed?
                  </p>

                  <div className="form-section-block">
                    <label className="section-subheading">Cultural or Language Inspiration</label>
                    <div className="chips-cloud">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          className={`trait-chip ${formData.language === lang.id ? "selected" : ""}`}
                          onClick={() => setFormData({ ...formData, language: lang.id })}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-section-block mt-6">
                    <label className="section-subheading">What meaning would you like to express?</label>
                    <div className="chips-cloud">
                      {MEANING_OPTIONS.map((mean) => {
                        const isSelected = formData.meanings.includes(mean.id);
                        return (
                          <button
                            key={mean.id}
                            type="button"
                            className={`trait-chip ${isSelected ? "selected" : ""}`}
                            onClick={() => toggleMeaning(mean.id)}
                          >
                            {mean.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: ADDITIONAL PREFERENCES */}
              {currentStep === 7 && (
                <div className="step-content animate-fade">
                  <h3 className="step-title">Tell us anything else about your pet</h3>
                  <p className="step-desc">Fine-tune the name generator with your unique ideas.</p>

                  <div className="form-group">
                    <label className="input-label">Preferred Name Length</label>
                    <div className="segmented-control">
                      {LENGTH_OPTIONS.map((len) => (
                        <button
                          key={len}
                          type="button"
                          className={`segmented-btn ${formData.nameLength === len ? "active" : ""}`}
                          onClick={() => setFormData({ ...formData, nameLength: len })}
                        >
                          {len}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mt-4">
                    <label className="input-label">Existing favorite names or themes (optional)</label>
                    <input
                      type="text"
                      className="custom-text-input"
                      placeholder="e.g. Leo, Bella, Cookie, Greek gods, anime..."
                      value={formData.favoriteNames}
                      onChange={(e) => setFormData({ ...formData, favoriteNames: e.target.value })}
                    />
                    {formData.favoriteNames.trim() && (
                      <label className="checkbox-row mt-2">
                        <input
                          type="checkbox"
                          checked={formData.excludeFavorites}
                          onChange={(e) =>
                            setFormData({ ...formData, excludeFavorites: e.target.checked })
                          }
                        />
                        <span>Don't suggest names I've already entered</span>
                      </label>
                    )}
                  </div>

                  <div className="form-group mt-4">
                    <label className="input-label">Extra notes or custom wishes</label>
                    <textarea
                      rows={3}
                      className="custom-textarea"
                      placeholder="Example: My puppy is playful and has white fur. I want a cute, short name inspired by nature."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Wizard Navigation Buttons */}
              <div className="wizard-footer-actions">
                {currentStep > 1 ? (
                  <button type="button" className="wizard-back-btn" onClick={handlePrevStep}>
                    <ChevronLeft size={18} /> Back
                  </button>
                ) : (
                  <button type="button" className="wizard-reset-btn" onClick={handleRestart}>
                    <RotateCcw size={16} /> Reset
                  </button>
                )}

                <button type="button" className="wizard-primary-btn" onClick={handleNextStep}>
                  {currentStep === totalSteps ? "Review Preferences" : "Continue"}{" "}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* VIEW: SUMMARY BEFORE GENERATION */}
          {viewMode === "summary" && (
            <div className="summary-view animate-fade">
              <div className="summary-card">
                <h3>Ready to generate your pet's perfect names!</h3>
                <p className="summary-subtitle">Here is a quick overview of your chosen preferences:</p>

                <div className="summary-details-grid">
                  <div className="summary-item">
                    <span className="summary-label">Pet Type</span>
                    <span className="summary-val font-semibold">
                      {formData.petType === "Other" ? formData.customPetType || "Other" : formData.petType}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Gender Preference</span>
                    <span className="summary-val">{formData.gender}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Appearance & Color</span>
                    <span className="summary-val">
                      {formData.color} {formData.specialFeatures ? `(${formData.specialFeatures})` : ""}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Personality</span>
                    <span className="summary-val">
                      {formData.personality.length > 0 ? formData.personality.join(", ") : "Any"}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Styles</span>
                    <span className="summary-val">{formData.styles.join(", ") || "Any"}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Language / Culture</span>
                    <span className="summary-val">{formData.language}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Length</span>
                    <span className="summary-val">{formData.nameLength}</span>
                  </div>
                </div>

                <div className="summary-actions">
                  <button
                    type="button"
                    className="wizard-back-btn"
                    onClick={() => {
                      setCurrentStep(7);
                      setViewMode("wizard");
                    }}
                  >
                    <ChevronLeft size={18} /> Edit Answers
                  </button>
                  <button
                    type="button"
                    className="wizard-generate-btn"
                    onClick={handleGenerateNames}
                  >
                    <Sparkles size={18} className="pulse-sparkle" /> Generate My Pet Names
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: RESULTS */}
          {viewMode === "results" && (
            <div className="results-view animate-fade">
              {isLoading ? (
                <div className="ai-loading-container">
                  <div className="loading-spinner-ring"></div>
                  <div className="loading-sparkle-icon">
                    <Sparkles size={28} className="spin-slow" />
                  </div>
                  <h3>Finding special names for your best friend...</h3>
                  <p>Our AI is analyzing your preferences to create meaningful suggestions.</p>
                </div>
              ) : (
                <>
                  <div className="results-header-banner">
                    <div>
                      <h2>Meet Your Pet's Potential New Name!</h2>
                      <p>Here are 10 personalized names chosen just for your pet.</p>
                    </div>

                    <div className="results-quick-actions">
                      <button
                        className="btn-pill-action"
                        onClick={() => {
                          setCurrentStep(5); // jump to style
                          setViewMode("wizard");
                        }}
                      >
                        <Sliders size={15} /> Try Different Styles
                      </button>
                      <button className="btn-pill-action" onClick={handleGenerateNames}>
                        <Sparkles size={15} /> Generate More Names
                      </button>
                    </div>
                  </div>

                  {apiError && <div className="results-warning-note">{apiError}</div>}

                  <div className="name-cards-grid">
                    {results.map((item, idx) => {
                      const isFavorited = savedFavorites.some(
                        (f) => f.name.toLowerCase() === item.name.toLowerCase()
                      );
                      const isCopied = copiedId === (item.id || idx);

                      return (
                        <div key={item.id || idx} className="name-result-card">
                          <div className="name-card-top">
                            <div>
                              <h3 className="pet-result-name">{item.name}</h3>
                              {item.pronunciation && (
                                <span className="pronunciation-pill">
                                  <Volume2 size={12} /> {item.pronunciation}
                                </span>
                              )}
                            </div>

                            <div className="card-top-buttons">
                              <button
                                className={`icon-action-btn ${isCopied ? "copied" : ""}`}
                                onClick={() => copyToClipboard(item.name, item.id || idx)}
                                title="Copy name"
                              >
                                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                              <button
                                className={`icon-action-btn ${isFavorited ? "favorited" : ""}`}
                                onClick={() => toggleFavorite(item)}
                                title={isFavorited ? "Remove Favorite" : "Save Favorite"}
                              >
                                <Heart
                                  size={16}
                                  fill={isFavorited ? "#ef4444" : "none"}
                                  stroke={isFavorited ? "#ef4444" : "currentColor"}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="name-meta-section">
                            <p className="name-meaning">
                              <strong>Meaning:</strong> {item.meaning}
                            </p>
                            {item.origin && (
                              <p className="name-origin">
                                <strong>Origin:</strong> {item.origin}
                              </p>
                            )}
                          </div>

                          <p className="name-reason">{item.reason}</p>

                          <div className="style-badges-row">
                            {Array.isArray(item.style) &&
                              item.style.map((s, i) => (
                                <span key={i} className="style-badge">
                                  {s}
                                </span>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="results-bottom-controls">
                    <button className="wizard-back-btn" onClick={handleRestart}>
                      <RotateCcw size={16} /> Start Again
                    </button>
                    <button
                      className="wizard-back-btn"
                      onClick={() => {
                        setCurrentStep(1);
                        setViewMode("wizard");
                      }}
                    >
                      Edit My Answers
                    </button>
                    <button
                      className="wizard-primary-btn"
                      onClick={handleGenerateNames}
                    >
                      <Sparkles size={16} /> Generate More Names
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* VIEW: SAVED FAVORITES */}
          {viewMode === "favorites" && (
            <div className="favorites-view animate-fade">
              <div className="fav-view-header">
                <div>
                  <h3>Your Saved Favorite Names ({savedFavorites.length})</h3>
                  <p>All names you loved during your generator sessions.</p>
                </div>
                <button
                  className="wizard-back-btn"
                  onClick={() => setViewMode(results.length > 0 ? "results" : "wizard")}
                >
                  <ChevronLeft size={16} /> Back to Generator
                </button>
              </div>

              {savedFavorites.length === 0 ? (
                <div className="empty-favorites">
                  <Bookmark size={40} className="empty-fav-icon" />
                  <h4>No favorites saved yet</h4>
                  <p>Click the heart icon on any generated name card to save it here!</p>
                </div>
              ) : (
                <div className="name-cards-grid mt-4">
                  {savedFavorites.map((item, idx) => (
                    <div key={idx} className="name-result-card fav-card-highlight">
                      <div className="name-card-top">
                        <h3 className="pet-result-name">{item.name}</h3>
                        <div className="card-top-buttons">
                          <button
                            className="icon-action-btn"
                            onClick={() => copyToClipboard(item.name, idx)}
                            title="Copy name"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            className="icon-action-btn favorited"
                            onClick={() => toggleFavorite(item)}
                            title="Remove Favorite"
                          >
                            <Heart size={16} fill="#ef4444" stroke="#ef4444" />
                          </button>
                        </div>
                      </div>
                      <p className="name-meaning">
                        <strong>Meaning:</strong> {item.meaning}
                      </p>
                      <p className="name-reason">{item.reason}</p>
                      <div className="style-badges-row">
                        {Array.isArray(item.style) &&
                          item.style.map((s, i) => (
                            <span key={i} className="style-badge">
                              {s}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
