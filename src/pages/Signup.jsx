import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  PawPrint,
  Heart
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    petParentOf: "Dog Parent",
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);
      await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        petParentOf: formData.petParentOf
      });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Top Header */}
      <header className="auth-header">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Pet Care Platform Logo" />
        </Link>
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </header>

      {/* Main Form Section */}
      <main className="auth-main">
        <div className="auth-card-container">
          <div className="auth-card">
            <span className="auth-badge">
              <Heart size={14} /> Join Petzy Community
            </span>
            <h1>Create your Account</h1>
            <p className="auth-subtitle">
              Join thousands of pet parents caring for dogs, cats, and rescue animals with love.
            </p>

            {error && (
              <div className="auth-alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon-left" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Emily Carter"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon-left" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="emily@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon-left" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="petParentOf">I am a pet parent of</label>
                <div className="input-with-icon">
                  <PawPrint size={18} className="input-icon-left" />
                  <select
                    id="petParentOf"
                    name="petParentOf"
                    value={formData.petParentOf}
                    onChange={handleChange}
                  >
                    <option value="Dog Parent">Dog Parent 🐶</option>
                    <option value="Cat Parent">Cat Parent 🐱</option>
                    <option value="Dog & Cat Parent">Dog & Cat Parent 🐾</option>
                    <option value="Bird Parent">Bird Parent 🦜</option>
                    <option value="Looking to Adopt">Looking to Adopt Soon ❤️</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon-left" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-password-btn"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon-left" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="auth-extra-row">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>I agree to Petzy Terms of Service & Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}{" "}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
