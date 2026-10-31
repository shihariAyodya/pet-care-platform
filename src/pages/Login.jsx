import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  PawPrint,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Return to previous target or to /profile by default
  const from = location.state?.from?.pathname || "/profile";

  const handleFillDemo = () => {
    setEmail("demo@petzy.com");
    setPassword("demo123");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to log in.");
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
              <PawPrint size={14} /> Welcome Back
            </span>
            <h1>Log in to your account</h1>
            <p className="auth-subtitle">
              Manage your pet profiles, veterinary consultations, adoptions, and orders in one place.
            </p>

            {/* Quick Demo Credentials helper */}
            <div className="demo-credentials-banner">
              <Sparkles size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Need a quick demo?</strong>
                <div>Email: <code>demo@petzy.com</code> | Pass: <code>demo123</code></div>
                <button type="button" onClick={handleFillDemo} className="demo-fill-btn">
                  Auto-fill Demo Account
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon-left" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. emily@petparent.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon-left" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-extra-row">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link will be sent to your email!"); }} className="auth-forgot-link">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log In"} <ArrowRight size={18} />
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account yet?
              <Link to="/signup">Create an Account</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
