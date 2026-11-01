import { Link, NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <nav className="app-navbar">
      <Link to="/" className="brand-logo">
        <img src="/store/logo.png" alt="PetCare.lk Logo" className="site-logo" />
      </Link>

      <div className="nav-links">
        <NavLink to="/browse" className={({ isActive }) => (isActive ? "active" : "")}>
          Adopt
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
          Shop
        </NavLink>
        <NavLink to="/lost-found" className={({ isActive }) => (isActive ? "active" : "")}>
          Lost & Found
        </NavLink>
        <NavLink to="/vets" className={({ isActive }) => (isActive ? "active" : "")}>
          Vet Directory
        </NavLink>
        <NavLink to="/grooming" className={({ isActive }) => (isActive ? "active" : "")}>
          Grooming
        </NavLink>
        <NavLink to="/training" className={({ isActive }) => (isActive ? "active" : "")}>
          Training
        </NavLink>
        <NavLink to="/sitting" className={({ isActive }) => (isActive ? "active" : "")}>
          Pet Sitting
        </NavLink>
        <NavLink to="/transport" className={({ isActive }) => (isActive ? "active" : "")}>
          Transport
        </NavLink>
        <NavLink to="/shops" className={({ isActive }) => (isActive ? "active" : "")}>
          Pet Shops
        </NavLink>
        <NavLink to="/smart-match" className={({ isActive }) => (isActive ? "active" : "")}>
          Smart Match
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "user-link active" : "user-link")}
          >
            <User size={16} />
            <span>{currentUser?.fullName?.split(" ")[0] || "Profile"}</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
