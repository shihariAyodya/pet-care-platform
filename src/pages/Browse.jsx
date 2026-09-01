import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Browse.css";

const allPets = [
  { name: "Buddy", breed: "Golden Retriever", age: "Adult", location: "Colombo" },
  { name: "Luna", breed: "Domestic Cat", age: "Young", location: "Kandy" },
  { name: "Max", breed: "Beagle", age: "Adult", location: "Galle" },
  { name: "Milo", breed: "Tabby Cat", age: "Baby", location: "Colombo" },
  { name: "Bella", breed: "Labrador", age: "Young", location: "Kandy" },
  { name: "Coco", breed: "Poodle Mix", age: "Senior", location: "Galle" },
  { name: "Rocky", breed: "German Shepherd", age: "Adult", location: "Colombo" },
  { name: "Daisy", breed: "Persian Cat", age: "Senior", location: "Kandy" },
];

function Browse() {
  const { language, toggleLanguage, t } = useLanguage();
  const [breedFilter, setBreedFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const breeds = ["All", ...new Set(allPets.map((pet) => pet.breed))];
  const ages = ["All", "Baby", "Young", "Adult", "Senior"];
  const locations = ["All", ...new Set(allPets.map((pet) => pet.location))];

  const filteredPets = allPets.filter((pet) => {
    const matchesBreed = breedFilter === "All" || pet.breed === breedFilter;
    const matchesAge = ageFilter === "All" || pet.age === ageFilter;
    const matchesLocation = locationFilter === "All" || pet.location === locationFilter;
    return matchesBreed && matchesAge && matchesLocation;
  });

  return (
    <div className="browse-page">
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

      <section className="browse-header">
        <h2>{t("browse.title")}</h2>
        <p>{t("browse.subtitle")}</p>
      </section>

      <section className="filters">
        <div className="filter-group">
          <label>{t("browse.breed")}</label>
          <select value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)}>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed === "All" ? t("browse.all") : breed}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>{t("browse.age")}</label>
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            {ages.map((age) => (
              <option key={age} value={age}>{age === "All" ? t("browse.all") : age}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>{t("browse.location")}</label>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            {locations.map((location) => (
              <option key={location} value={location}>{location === "All" ? t("browse.all") : location}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="results">
        <p className="results-count">{filteredPets.length} {t("browse.resultsFound")}</p>

        <div className="results-grid">
          {filteredPets.map((pet) => (
            <div className="pet-card" key={pet.name}>
              <div className="pet-image-placeholder" />
              <h4>{pet.name}</h4>
              <p>{pet.breed} • {pet.age}</p>
              <p className="location-tag">📍 {pet.location}</p>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <p className="no-results">{t("browse.noResults")}</p>
        )}
      </section>
    </div>
  );
}

export default Browse;