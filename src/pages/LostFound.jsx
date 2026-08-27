import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("Lost");

  const filteredReports = reports.filter((report) => report.type === activeTab);

  return (
    <div className="lostfound-page">
      <nav className="navbar">
        <Link to="/" className="logo">🐾 PetCare</Link>
        <div className="nav-links">
          <Link to="/browse">Adopt</Link>
          <Link to="/lost-found">Lost & Found</Link>
          <Link to="/vets">Vet Directory</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <section className="lostfound-header">
        <h2>Lost & Found Pets</h2>
        <p>Help reunite pets with their families</p>
      </section>

      <section className="tabs">
        <button
          className={activeTab === "Lost" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("Lost")}
        >
          Lost Pets
        </button>
        <button
          className={activeTab === "Found" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("Found")}
        >
          Found Pets
        </button>
      </section>

      <section className="results">
        <p className="results-count">{filteredReports.length} report(s)</p>

        <div className="results-grid">
          {filteredReports.map((report) => (
            <div className="report-card" key={report.id}>
              <div className="report-image-placeholder" />
              <span className={report.type === "Lost" ? "tag tag-lost" : "tag tag-found"}>
                {report.type}
              </span>
              <h4>{report.name}</h4>
              <p>{report.description}</p>
              <p className="location-tag">📍 {report.location}</p>
              <p className="date-tag">{report.date}</p>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <p className="no-results">No {activeTab.toLowerCase()} pet reports yet.</p>
        )}
      </section>
    </div>
  );
}

export default LostFound;