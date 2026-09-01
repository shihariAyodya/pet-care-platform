import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/LostFound.css";

const reports = [
  { id: 1, type: "Lost", name: "Charlie", description: "Brown Labrador, wearing a red collar", location: "Nugegoda", date: "Aug 20, 2026" },
  { id: 2, type: "Found", name: "Unknown", description: "Small white cat, very friendly", location: "Maharagama", date: "Aug 22, 2026" },
  { id: 3, type: "Lost", name: "Simba", description: "Orange tabby cat, left ear notch", location: "Kottawa", date: "Aug 18, 2026" },
  { id: 4, type: "Found", name: "Unknown", description: "Grey and white puppy, no collar", location: "Colombo", date: "Aug 24, 2026" },
  { id: 5, type: "Lost", name: "Rusty", description: "German Shepherd mix, limps slightly", location: "Dehiwala", date: "Aug 25, 2026" },
  { id: 6, type: "Found", name: "Unknown", description: "Black cat with white paws", location: "Nugegoda", date: "Aug 21, 2026" },
];

function LostFound() {
  const { language, toggleLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("Lost");

  const filteredReports = reports.filter((report) => report.type === activeTab);

  return (
    <div className="lostfound-page">
      <nav className="navbar">
        <Link to="/" className="logo">🐾 PetCare.lk</Link>
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

      <section className="lostfound-header">
        <h2>{t("lostFound.title")}</h2>
        <p>{t("lostFound.subtitle")}</p>
      </section>

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

      <section className="results">
        <p className="results-count">{filteredReports.length} {t("lostFound.reports")}</p>

        <div className="results-grid">
          {filteredReports.map((report) => (
            <div className="report-card" key={report.id}>
              <div className="report-image-placeholder" />
              <span className={report.type === "Lost" ? "tag tag-lost" : "tag tag-found"}>
                {report.type === "Lost" ? t("lostFound.lostTab") : t("lostFound.foundTab")}
              </span>
              <h4>{report.name}</h4>
              <p>{report.description}</p>
              <p className="location-tag">📍 {report.location}</p>
              <p className="date-tag">{report.date}</p>
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