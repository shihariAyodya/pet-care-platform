import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [page, setPage] = useState(0); // 0 = first 3 pets, 1 = next 3 pets

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev === 0 ? 1 : 0));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goPrev = () => {
    setPage((prev) => (prev === 0 ? 1 : 0));
  };

  const goNext = () => {
    setPage((prev) => (prev === 0 ? 1 : 0));
  };

  const visiblePets = allPets.slice(page * 3, page * 3 + 3);

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">🐾 PetCare</h1>
        <div className="nav-links">
          <Link to="/browse">Adopt</Link>
          <Link to="/lost-found">Lost & Found</Link>
          <Link to="/vets">Vet Directory</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* Hero section */}
      <section className="hero">
        <h2>Find Your New Best Friend</h2>
        <p>Browse adoptable pets, connect with shelters, and give a pet a loving home.</p>
        <Link to="/browse" className="cta-button">Browse Pets</Link>
      </section>

      {/* Featured pets */}
      <section className="featured">
        <h3>Featured Pets</h3>
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

      {/* Quick links section */}
      <section className="quick-links">
        <Link to="/lost-found" className="quick-card">
          🔍 Lost & Found
        </Link>
        <Link to="/vets" className="quick-card">
          🩺 Find a Vet
        </Link>
        <Link to="/articles" className="quick-card">
          📖 Pet Care Tips
        </Link>
      </section>
    </div>
  );
}

export default Home;