import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Check, MapPin, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { lostFoundPets } from "../data/lostFoundPets";
import "../styles/LostFound.css";

function LostFound() {
  const { language, toggleLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("Lost");

  const filteredReports = lostFoundPets.filter((pet) => pet.type === activeTab);

  return (
    <div className="lostfound-page">
      <nav className="navbar">
        <Link to="/" className="brand-logo">
          <img src="/store/logo.png" alt="Site Logo" className="site-logo" />
        </Link>
        <div className="nav-links">
          <Link to="/browse">{t("nav.adopt")}</Link>
          <Link to="/lost-found">{t("nav.lostFound")}</Link>
          <Link to="/vets">{t("nav.vetDirectory")}</Link>
          <Link to="/articles">{t("nav.articles")}</Link>
          <Link to="/login">{t("nav.login")}</Link>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === "en" ? "සිං" : "EN"}
          </button>
        </div>
      </nav>

      {/* Banner with the two report buttons */}
      <section className="lf-compact-banner">
        <div className="lf-compact-text">
          <h2>{t("lostFound.title")}</h2>
          <p>{t("lostFound.subtitle")}</p>
        </div>
        <div className="lf-compact-actions">
          <Link to="/report-lost" className="lf-btn lf-btn-lost">
            <AlertCircle size={18} /> I Lost My Pet
          </Link>
          <Link to="/report-found" className="lf-btn lf-btn-found">
            <Check size={18} /> I Found a Pet
          </Link>
        </div>
      </section>

      {/* Lost / Found tabs */}
      <section className="tabs">
        <button
          className={activeTab === "Lost" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("Lost")}
        >
          {t("lostFound.lostTab")}
        </button>
        <button
          className={activeTab === "Found" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("Found")}
        >
          {t("lostFound.foundTab")}
        </button>
      </section>

      {/* Results */}
      <section className="results">
        <p className="results-count">
          {filteredReports.length} {t("lostFound.reports")}
        </p>

        <div className="lf-recent-grid">
          {filteredReports.map((pet) => (
            <div className="lf-pet-card" key={pet.id}>
              <div className="lf-pet-img-wrap">
                {pet.img && (
                  <img src={pet.img} alt={pet.name} className="lf-pet-img" />
                )}
                <div className={`lf-pet-badge ${pet.type.toLowerCase()}`}>
                  {pet.type === "Lost" ? (
                    <AlertCircle size={12} />
                  ) : (
                    <Check size={12} />
                  )}
                  {pet.type.toUpperCase()}
                </div>
              </div>

              <div className="lf-pet-info">
                <div className="lf-pet-name-row">
                  <h4>{pet.name}</h4>
                  <span className="lf-pet-breed">{pet.breed}</span>
                </div>
                <div className="lf-pet-meta">
                  <span className="lf-pet-loc">
                    <MapPin size={12} /> {pet.location}
                  </span>
                  <span className="lf-pet-time">
                    <Clock size={12} /> {pet.time}
                  </span>
                </div>
                <Link to={`/pet/${pet.id}`} className="lf-pet-cta">
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <p className="no-results">{t("lostFound.noResults")}</p>
        )}
      </section>
    </div>
  );
}

export default LostFound;