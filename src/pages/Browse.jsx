import { useState } from "react";
import { Link } from "react-router-dom";
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

const breeds = ["All", ...new Set(allPets.map((pet) => pet.breed))];
const ages = ["All", "Baby", "Young", "Adult", "Senior"];
const locations = ["All", ...new Set(allPets.map((pet) => pet.location))];

function Browse() {
  const [breedFilter, setBreedFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

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
          <Link to="/browse">Adopt</Link>
          <Link to="/lost-found">Lost & Found</Link>
          <Link to="/vets">Vet Directory</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <section className="browse-header">
        <h2>Find a Pet to Adopt</h2>
        <p>Use the filters below to narrow down your search</p>
      </section>

      <section className="filters">
        <div className="filter-group">
          <label>Breed</label>
          <select value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)}>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Age</label>
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            {ages.map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="results">
        <p className="results-count">{filteredPets.length} pet(s) found</p>

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
          <p className="no-results">No pets match these filters. Try adjusting your search.</p>
        )}
      </section>
    </div>
  );
}

export default Browse;