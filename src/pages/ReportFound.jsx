import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ReportFound.css";
import { Check } from "lucide-react";

function ReportFound() {
  const [form, setForm] = useState({
    name: "",
    breed: "",
    location: "",
    description: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Found pet report submitted", form);
    alert("Thank you for reporting!");
  };

  return (
    <div className="report-found-page">
      <Link to="/">← Back to Home</Link>
      <h2 className="page-title">Report a Found Pet</h2>
      <p className="page-subtitle">Help reunite pets with their owners.</p>
      <form className="report-form" onSubmit={handleSubmit}>
        <label>
          Pet Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Breed
          <input type="text" name="breed" value={form.breed} onChange={handleChange} required />
        </label>
        <label>
          Found Location
          <input type="text" name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label className="photo-upload">
          Photo (optional)
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        </label>
        <button type="submit" className="submit-btn">
          <Check size={18} /> Submit
        </button>
      </form>
    </div>
  );
}

export default ReportFound;