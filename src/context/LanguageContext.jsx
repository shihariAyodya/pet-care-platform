import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    nav: {
      adopt: "Adopt",
      lostFound: "Lost & Found",
      vetDirectory: "Vet Directory",
      articles: "Articles",
      login: "Login",
    },
    home: {
      heroTitle: "Find Your New Best Friend",
      heroText: "Browse adoptable pets, connect with shelters, and give a pet a loving home.",
      browseBtn: "Browse Pets",
      featuredPets: "Featured Pets",
      lostFoundCard: "Lost & Found",
      vetCard: "Find a Vet",
      articlesCard: "Pet Care Tips",
    },
    browse: {
      title: "Find a Pet to Adopt",
      subtitle: "Use the filters below to narrow down your search",
      breed: "Breed",
      age: "Age",
      location: "Location",
      resultsFound: "pet(s) found",
      noResults: "No pets match these filters. Try adjusting your search.",
      all: "All",
    },
    lostFound: {
      title: "Lost & Found Pets",
      subtitle: "Help reunite pets with their families",
      lostTab: "Lost Pets",
      foundTab: "Found Pets",
      reports: "report(s)",
      noResults: "No pet reports yet.",
    },
    vets: {
      title: "Find a Vet",
      subtitle: "Search by name, clinic, or location",
      searchPlaceholder: "Search vets...",
      resultsFound: "vet(s) found",
      noResults: "No vets match your search.",
    },
  },
  si: {
    nav: {
      adopt: "සුරතල් සතෙකු \n හදාගන්න",
      lostFound: "නැති වූ සහ හමු වූ",
      vetDirectory: "වෙද මාර්ගෝපදේශය",
      articles: "ලිපි",
      login: "පිවිසෙන්න",
    },
    home: {
      heroTitle: "ඔබේ නව හොඳම මිතුරා සොයන්න",
      heroText: "දරුකමට ගත හැකි සුරතල් සතුන් බලන්න, රැකවරණ මධ්‍යස්ථාන සමඟ සම්බන්ධ වී, ආදරණීය නිවසක් ලබා දෙන්න.",
      browseBtn: "සුරතල් සතුන් බලන්න",
      featuredPets: "විශේෂිත සුරතල් සතුන්",
      lostFoundCard: "නැති වූ සහ හමු වූ",
      vetCard: "වෙදෙකු සොයන්න",
      articlesCard: "සුරතල් සත්ත්ව රැකවරණ උපදෙස්",
    },
    browse: {
      title: "දරුකමට ගැනීමට සුරතලෙකු සොයන්න",
      subtitle: "ඔබේ සෙවීම පටු කිරීමට පහත පෙරහන් භාවිතා කරන්න",
      breed: "ප්‍රභේදය",
      age: "වයස",
      location: "ස්ථානය",
      resultsFound: "සුරතලුන් හමු විය",
      noResults: "මෙම පෙරහන් වලට ගැලපෙන සුරතලුන් නැත. ඔබේ සෙවීම වෙනස් කර බලන්න.",
      all: "සියල්ල",
    },
    lostFound: {
      title: "නැති වූ සහ හමු වූ සුරතලුන්",
      subtitle: "සුරතලුන් ඔවුන්ගේ පවුල් සමඟ නැවත එකතු කිරීමට උදව් කරන්න",
      lostTab: "නැති වූ සුරතලුන්",
      foundTab: "හමු වූ සුරතලුන්",
      reports: "වාර්තා",
      noResults: "තවම සුරතල් වාර්තා නැත.",
    },
    vets: {
      title: "වෙදෙකු සොයන්න",
      subtitle: "නම, සායනය, හෝ ස්ථානය අනුව සොයන්න",
      searchPlaceholder: "වෙදවරුන් සොයන්න...",
      resultsFound: "වෙදවරුන් හමු විය",
      noResults: "ඔබේ සෙවීමට ගැලපෙන වෙදවරුන් නැත.",
    },
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "si" : "en"));
  };

  // t("home.heroTitle") walks through translations[language].home.heroTitle
  const t = (path) => {
    const keys = path.split(".");
    let value = translations[language];
    for (const key of keys) {
      value = value?.[key];
    }
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}