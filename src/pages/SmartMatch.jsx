import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Home, Clock, Activity, Users, CheckCircle2, RotateCcw } from "lucide-react";
import { adoptablePets } from "../data/pets";
import "../styles/SmartMatch.css";

const questions = [
  {
    id: "homeType",
    title: "What type of home do you live in?",
    icon: Home,
    options: [
      { label: "Apartment", value: "Apartment" },
      { label: "House with Yard", value: "House" },
      { label: "Any", value: "Any" }
    ]
  },
  {
    id: "time",
    title: "How much time can you spend with the pet daily?",
    icon: Clock,
    options: [
      { label: "Less than 1 hour", value: "< 1 hour" },
      { label: "1-3 hours", value: "1-3 hours" },
      { label: "3+ hours", value: "3+ hours" }
    ]
  },
  {
    id: "activity",
    title: "What is your activity level?",
    icon: Activity,
    options: [
      { label: "Relaxed (Low)", value: "Low" },
      { label: "Moderate", value: "Moderate" },
      { label: "Very Active", value: "Active" }
    ]
  },
  {
    id: "kids",
    title: "Are there children in your family?",
    icon: Users,
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ]
  }
];

function SmartMatch() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [matches, setMatches] = useState(null);

  const handleOptionSelect = (value) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateMatches();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateMatches = () => {
    setIsCalculating(true);
    // Simulate API delay for dramatic effect
    setTimeout(() => {
      // Calculate match score
      const scoredPets = adoptablePets.map(pet => {
        let score = 0;
        let maxScore = 4;

        if (answers.homeType === "Any" || pet.homeType === "Any" || pet.homeType === answers.homeType) score++;
        if (pet.time === answers.time || (answers.time === "3+ hours" && pet.time === "1-3 hours")) score++;
        if (pet.activity === answers.activity || answers.activity === "Active") score++;
        if (answers.kids === "No" || pet.kids === "Yes") score++;

        return {
          ...pet,
          calculatedMatch: Math.round((score / maxScore) * 100)
        };
      });

      // Sort by score descending
      scoredPets.sort((a, b) => b.calculatedMatch - a.calculatedMatch);
      setMatches(scoredPets.slice(0, 3)); // Top 3 matches
      setIsCalculating(false);
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setMatches(null);
  };

  if (matches) {
    return (
      <div className="smart-match-page">
        <Navbar />

        <div className="results-container">
          <div className="results-header">
            <h2>We found your perfect matches! 🎉</h2>
            <p>Based on your lifestyle, these pets would love to go home with you.</p>
          </div>

          <div className="matches-grid">
            {matches.map((pet, index) => (
              <div className={`match-card ${index === 0 ? 'top-match' : ''}`} key={pet.id}>
                {index === 0 && <div className="top-match-badge">⭐ Best Match</div>}
                <div className="match-image-box">
                  <img src={pet.img} alt={pet.name} />
                  <div className="match-score-overlay">
                    <span className="score">{pet.calculatedMatch}%</span>
                    <span className="label">Match</span>
                  </div>
                </div>
                <div className="match-details">
                  <h3>{pet.name}</h3>
                  <p className="breed">{pet.breed} • {pet.age}</p>
                  
                  <ul className="match-reasons">
                    <li><CheckCircle2 size={14} color="#10b981"/> Great for your home type</li>
                    <li><CheckCircle2 size={14} color="#10b981"/> Fits your activity level</li>
                  </ul>

                  <button className="meet-btn">Meet {pet.name} <ArrowRight size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="action-row">
            <button className="retake-btn" onClick={resetQuiz}><RotateCcw size={16} /> Retake Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="smart-match-page calculating">
        <div className="loader-container">
          <div className="spinner"></div>
          <h2>Finding your perfect companion...</h2>
          <p>Analyzing your lifestyle preferences</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentStep];
  const Icon = currentQ.icon;

  return (
    <div className="smart-match-page">
      <Navbar />

      <div className="quiz-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentStep) / questions.length) * 100}%` }}></div>
        </div>
        <div className="step-indicator">Question {currentStep + 1} of {questions.length}</div>

        <div className="question-box">
          <div className="question-icon"><Icon size={32} /></div>
          <h2>{currentQ.title}</h2>

          <div className="options-grid">
            {currentQ.options.map(opt => (
              <button 
                key={opt.value} 
                className={`option-btn ${answers[currentQ.id] === opt.value ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-nav">
          <button className={`nav-btn back ${currentStep === 0 ? 'hidden' : ''}`} onClick={handleBack}>
            <ArrowLeft size={18} /> Back
          </button>
          
          <button 
            className="nav-btn next" 
            disabled={!answers[currentQ.id]} 
            onClick={handleNext}
          >
            {currentStep === questions.length - 1 ? 'See Matches' : 'Next'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    <Footer />
    </div>
  );
}

export default SmartMatch;
