import { useLanguage } from "../context/LanguageContext";
import { lostFoundPets } from "../data/lostFoundPets";
import "../styles/FoundPets.css";
import { Link } from "react-router-dom";
import { Check, MapPin, Clock, ArrowRight } from "lucide-react";

function FoundPets() {
  const { t } = useLanguage();
  const foundPets = lostFoundPets.filter((pet) => pet.type === "Found");

  return (
    <div className="found-pets-page">
      <h2 className="page-title">{t("foundPets.title") || "Found Pets"}</h2>
      <p className="page-subtitle">
        {t("foundPets.subtitle") || "Pets that have been reported as found."}
      </p>
      <div className="found-pets-grid">
        {foundPets.map((pet) => (
          <div key={pet.id} className="found-pet-card">
            <div className="pet-img-wrap">
              {pet.img && <img src={pet.img} alt={pet.name} className="pet-img" />}
              <div className={`pet-badge ${pet.type.toLowerCase()}`}>
                <Check size={12} /> {pet.type.toUpperCase()}
              </div>
            </div>
            <div className="pet-info">
              <h4>{pet.name}</h4>
              <span className="pet-breed">{pet.breed}</span>
              <div className="pet-meta">
                <span className="pet-location">
                  <MapPin size={12} /> {pet.location}
                </span>
                <span className="pet-time">
                  <Clock size={12} /> {pet.time}
                </span>
              </div>
              <Link to={`/pet/${pet.id}`} className="pet-cta">
                {t("foundPets.viewDetails") || "View Details"} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
        {foundPets.length === 0 && (
          <p className="no-results">
            {t("foundPets.noResults") || "No found pets reported yet."}
          </p>
        )}
      </div>
    </div>
  );
}

export default FoundPets;
