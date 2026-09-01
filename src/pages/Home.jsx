import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Home.css";

const allPets = [
  { name: "Buddy", info: "Golden Retriever • 2 yrs" },
  { name: "Luna", info: "Domestic Cat • 1 yr" },
  { name: "Max", info: "Beagle • 3 yrs" },
  { name: "Milo", info: "Tabby Cat • 4 mo" },
  { name: "Bella", info: "Labrador • 1 yr" },
  { name: "Coco", info: "Poodle Mix • 5 yrs" },
];

function Home() {
  const { language, toggleLanguage, t } = useLanguage();
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allPets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => {
    setStartIndex((prev) => (prev - 1 + allPets.length) % allPets.length);
  };

  const goNext = () => {
    setStartIndex((prev) => (prev + 1) % allPets.length);
  };

  const visiblePets = [0, 1, 2].map(
    (offset) => allPets[(startIndex + offset) % allPets.length]
  );

  return (
    <div className="home">
      <nav className="navbar">
        <h1 className="logo">🐾 PetCare.lk</h1>
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

      <section className="hero">
        <h2>{t("home.heroTitle")}</h2>
        <p>{t("home.heroText")}</p>
        <Link to="/browse" className="cta-button">{t("home.browseBtn")}</Link>
      </section>

      <section className="featured">
        <h3>{t("home.featuredPets")}</h3>
        <div className="carousel-row">
          <button className="arrow-btn" onClick={goPrev} aria-label="Previous pets">
            <ChevronLeft size={22} />
          </button>

          <div className="pet-grid">
            {visiblePets.map((pet, index) => (
              <div className="pet-card" key={pet.name} style={{ animationDelay: `${index}s` }}>
                <div className="pet-image-placeholder" />
                <h4>{pet.name}</h4>
                <p>{pet.info}</p>
              </div>
            ))}
          </div>

          <button className="arrow-btn" onClick={goNext} aria-label="Next pets">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="quick-links">
        <Link to="/lost-found" className="quick-card">🔍 {t("home.lostFoundCard")}</Link>
        <Link to="/vets" className="quick-card">🩺 {t("home.vetCard")}</Link>
        <Link to="/articles" className="quick-card">📖 {t("home.articlesCard")}</Link>
      </section>
    </div>
  );
}

export default Home;