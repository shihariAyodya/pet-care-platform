import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Vets.css";

const vetList = [
  { id: 1, name: "Dr. Nadeesha Perera", clinic: "PawCare Animal Clinic", specialty: "General & Surgery", location: "Nugegoda", phone: "011-234-5678", hours: "Mon–Sat, 8am–6pm" },
  { id: 2, name: "Dr. Kasun Silva", clinic: "Colombo Pet Hospital", specialty: "Dermatology", location: "Colombo", phone: "011-345-6789", hours: "Mon–Fri, 9am–5pm" },
  { id: 3, name: "Dr. Amaya Fernando", clinic: "Kandy Vet Care", specialty: "General Practice", location: "Kandy", phone: "081-234-5678", hours: "Every day, 8am–8pm" },
  { id: 4, name: "Dr. Ruwan Jayasuriya", clinic: "Galle Animal Hospital", specialty: "Surgery & Orthopedics", location: "Galle", phone: "091-234-5678", hours: "Mon–Sat, 9am–6pm" },
  { id: 5, name: "Dr. Dilani Wickrama", clinic: "Maharagama Pet Clinic", specialty: "Vaccination & Wellness", location: "Maharagama", phone: "011-456-7890", hours: "Mon–Sun, 8am–7pm" },
];

function Vets() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVets = vetList.filter((vet) => {
    const search = searchTerm.toLowerCase();
    return (
      vet.name.toLowerCase().includes(search) ||
      vet.clinic.toLowerCase().includes(search) ||
      vet.location.toLowerCase().includes(search)
    );
  });

  return (
    <div className="vets-page">
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

      <section className="vets-header">
        <h2>Find a Vet</h2>
        <p>Search by name, clinic, or location</p>
      </section>

      <section className="search-bar-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search vets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <section className="results">
        <p className="results-count">{filteredVets.length} vet(s) found</p>

        <div className="vet-list">
          {filteredVets.map((vet) => (
            <div className="vet-card" key={vet.id}>
              <div className="vet-image-placeholder" />
              <div className="vet-info">
                <h4>{vet.name}</h4>
                <p className="clinic-name">{vet.clinic}</p>
                <p className="specialty-tag">{vet.specialty}</p>
                <p>📍 {vet.location}</p>
                <p>📞 {vet.phone}</p>
                <p className="hours-tag">🕒 {vet.hours}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredVets.length === 0 && (
          <p className="no-results">No vets match your search.</p>
        )}
      </section>
    </div>
  );
}

export default Vets;