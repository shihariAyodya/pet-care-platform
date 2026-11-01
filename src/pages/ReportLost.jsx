import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/ReportLost.css";
import { Check } from "lucide-react";

function ReportLost() {
  const { t } = useLanguage();
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
    // Placeholder: In a real app, submit to backend
    console.log("Lost pet report submitted", form);
    alert(t("reportLost.successMessage") || "Report submitted!");
  };

  return (
    <div className="report-lost-page">
      <Navbar />
      <h2 className="page-title">{t("reportLost.title") || "Report a Lost Pet"}</h2>
      <p className="page-subtitle">{t("reportLost.subtitle") || "Help us find your missing companion."}</p>
      <form className="report-form" onSubmit={handleSubmit}>
        <label>
          {t("reportLost.petName") || "Pet Name"}
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          {t("reportLost.breed") || "Breed"}
          <input type="text" name="breed" value={form.breed} onChange={handleChange} required />
        </label>
        <label>
          {t("reportLost.location") || "Last Seen Location"}
          <input type="text" name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>
          {t("reportLost.description") || "Description"}
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label className="photo-upload">
          {t("reportLost.photo") || "Photo (optional)"}
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        </label>
        <button type="submit" className="submit-btn">
          <Check size={18} /> {t("reportLost.submit") || "Submit Report"}
        </button>
      </form>
    <Footer />
    </div>
  );
}

export default ReportLost;
