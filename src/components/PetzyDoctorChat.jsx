import { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  Info
} from "lucide-react";
import "../styles/PetzyDoctorChat.css";

const API_URL = "http://localhost:3000/chat";

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hello! I'm Petzy Doctor 🩺🐾, your dedicated AI veterinary assistant.\n\nI'm here to help you with pet health questions, symptom triage, dietary guidance, daily care, and first-aid tips. How can I care for your pet today?",
    time: "Just now",
  },
];

const SUGGESTIONS = [
  { label: "🍲 Safe & toxic foods", query: "What foods are toxic to dogs and cats?" },
  { label: "🐶 Dog won't eat", query: "My dog hasn't eaten all day and seems a bit low on energy. What should I do?" },
  { label: "🐱 Cat scratching ear", query: "My cat is constantly scratching her ear and shaking her head. What could it be?" },
  { label: "🩺 When to see a vet?", query: "What are the red-flag emergency symptoms in pets that need immediate vet care?" },
  { label: "💉 Puppy vaccines", query: "What is the recommended core vaccination schedule for a new puppy?" }
];

export default function PetzyDoctorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("petzy_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_MESSAGES;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isMinimized]);

  // Save conversation in session
  useEffect(() => {
    try {
      sessionStorage.setItem("petzy_chat_history", JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Support global open event
  useEffect(() => {
    const handleOpenChat = (event) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (event.detail && event.detail.prompt) {
        sendMessage(event.detail.prompt);
      }
    };
    window.addEventListener("open-petzy-doctor", handleOpenChat);
    return () => window.removeEventListener("open-petzy-doctor", handleOpenChat);
  }, [messages]);

  const toggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setHasUnread(false);
    } else {
      setIsOpen(false);
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setServerError(false);
    try {
      sessionStorage.removeItem("petzy_chat_history");
    } catch (e) {}
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      time: formatTime(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setServerError(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages.slice(-8)
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "I am listening! How else can I help your pet today?";

      const botMsg = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botReply,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.warn("Backend not active, using built-in veterinary engine:", err);
      setServerError(false);

      const q = textToSend.toLowerCase();
      let fallbackReply = "";

      if (q.includes("toxic") || q.includes("poison") || q.includes("chocolate") || q.includes("onion") || q.includes("grape") || (q.includes("safe") && q.includes("food"))) {
        fallbackReply =
          `### ⚠️ Toxic Foods to Keep Away from Pets\n\n` +
          `**Never feed these to dogs or cats:**\n` +
          `- **Chocolate & Caffeine:** Toxic to the heart and central nervous system.\n` +
          `- **Grapes & Raisins:** Can cause sudden, severe acute kidney failure.\n` +
          `- **Onions, Garlic, & Leeks:** Causes red blood cell destruction (anemia).\n` +
          `- **Xylitol:** Found in sugar-free gums and peanut butters. Causes rapid hypoglycemia and liver failure.\n` +
          `- **Cooked Bones:** Splinter easily and cause intestinal blockages or lacerations.\n\n` +
          `**Safe Healthy Snacks:** Plain cooked chicken (unseasoned), carrots, watermelon (seedless), and pumpkin puree.\n\n` +
          `*If your pet ingested toxic food, contact an emergency vet immediately!*`;
      } else if (q.includes("not eat") || q.includes("won't eat") || q.includes("appetite") || q.includes("letharg") || q.includes("weak")) {
        fallbackReply =
          `### 🐶 Pet Not Eating / Low Energy Advice\n\n` +
          `A sudden loss of appetite or low energy requires close monitoring:\n\n` +
          `**1. Quick At-Home Checks:**\n` +
          `- **Hydration Test:** Gently pinch the skin behind their neck. If it snaps back quickly, they are hydrated.\n` +
          `- **Check Gums:** Healthy gums should be moist and pink. If pale or tacky, seek veterinary care.\n` +
          `- **Temperature:** Normal body temp is 101.0°F – 102.5°F (38.3°C – 39.2°C).\n\n` +
          `**2. Gentle Encouragements:**\n` +
          `- Offer boiled chicken breast with white rice, or warm bone broth (no onion/garlic).\n\n` +
          `**3. When to See a Vet:**\n` +
          `- Puppies/kittens not eating for **over 12 hours**.\n` +
          `- Adult pets refusing meals for **more than 24 hours**, or with vomiting/diarrhea. Check our **Vet Directory** to find a clinic nearby.`;
      } else if (q.includes("ear") || q.includes("scratch") || q.includes("shake") || q.includes("head")) {
        fallbackReply =
          `### 🐱 Ear Scratching & Head Shaking Guide\n\n` +
          `Constant ear scratching usually points to ear canal irritation:\n\n` +
          `- **Ear Mites (*Otodectes cynotis*):** Very common in kittens/cats, producing dark coffee-ground wax.\n` +
          `- **Bacterial or Yeast Infection:** Often produces a noticeable odor and redness.\n` +
          `- **Foreign Objects:** Grass seeds or burrs caught inside the canal.\n\n` +
          `**Care Advice:**\n` +
          `1. Do not insert human cotton swabs (Q-tips) into their ear canal.\n` +
          `2. Gently wipe only the outer ear flap with a damp cotton pad.\n` +
          `3. Have a veterinarian inspect the ear with an otoscope for targeted drops.`;
      } else if (q.includes("vaccin") || q.includes("shot") || q.includes("immuniz") || q.includes("deworm")) {
        fallbackReply =
          `### 💉 Core Puppy & Kitten Vaccination Schedule\n\n` +
          `- **6–8 Weeks:** 1st DHPP (Dogs) / FVRCP (Cats) + Deworming.\n` +
          `- **10–12 Weeks:** 2nd Booster DHPP / FVRCP.\n` +
          `- **14–16 Weeks:** 3rd Booster + **Rabies Vaccine**.\n` +
          `- **Annual:** Boosters as recommended by your registered vet.\n\n` +
          `*Keep puppies indoors until 2 weeks after their final 16-week shots to avoid Parvovirus.*`;
      } else if (q.includes("emergency") || q.includes("red-flag") || q.includes("red flag") || q.includes("urgent")) {
        fallbackReply =
          `### 🚨 Critical Red-Flag Emergency Symptoms\n\n` +
          `Seek immediate emergency veterinary medical care if you observe:\n` +
          `- **Breathing difficulty / open-mouth panting in cats**\n` +
          `- **Distended abdomen with unproductive vomiting (GDV/Bloat)**\n` +
          `- **Straining to urinate with no urine coming out (Urinary Blockage)**\n` +
          `- **Seizures lasting longer than 2 minutes or repeated seizures**\n` +
          `- **Ingestion of rat poison, human pills, or lilies (fatal to cats)**\n\n` +
          `*Use our **Vet Directory** tab to find the closest veterinary hospital.*`;
      } else if (q.includes("vomit") || q.includes("throw up") || q.includes("diarrhea") || q.includes("poop") || q.includes("stool")) {
        fallbackReply =
          `### 🐾 Pet Upset Stomach & Vomiting Protocol\n\n` +
          `If your pet had 1–2 mild episodes of vomiting or loose stools:\n\n` +
          `**First 12–24 Hours Care:**\n` +
          `1. **Bland Diet:** Serve boiled skinless chicken breast with plain white rice (2 parts rice to 1 part chicken).\n` +
          `2. **Small Sips:** Offer small, frequent bowls of fresh water. Do not let them gulp large amounts at once.\n` +
          `3. **No Human Medications:** Never give Paracetamol/Panadol or Ibuprofen — they cause acute poisoning in pets.\n\n` +
          `**See a Vet Immediately if:** Vomit contains dark coffee-ground blood, foreign objects, or if there are 3+ episodes in a single day.`;
      } else if (q.includes("tick") || q.includes("flea") || q.includes("mite") || q.includes("lice")) {
        fallbackReply =
          `### 🐜 Flea & Tick Treatment and Prevention\n\n` +
          `Ticks and fleas can transmit dangerous tick-borne blood parasites (like Tick Fever):\n\n` +
          `- **Safe Removal:** Grasp the tick with fine tweezers as close to the skin as possible and pull straight out. Do not twist or squeeze the tick's body.\n` +
          `- **Preventatives:** Ask your vet for monthly chewables (*Bravecto, NexGard, Simparica*) or spot-ons (*Frontline*).\n` +
          `- **Bedding:** Wash all pet bedding in hot water and vacuum carpets thoroughly.`;
      } else if (q.includes("teeth") || q.includes("tooth") || q.includes("dental") || q.includes("tartar") || q.includes("bad breath") || q.includes("mouth")) {
        fallbackReply =
          `### 🦷 Pet Dental Care & Bad Breath Guide\n\n` +
          `Over 80% of dogs and cats develop gum disease by age 3:\n\n` +
          `1. **Use Pet Toothpaste Only:** Never use human toothpaste, as it contains toxic fluoride and foaming agents.\n` +
          `2. **Brushing:** Use a soft pet finger brush in circular motions along outer gum lines 3–4 times a week.\n` +
          `3. **Dental Chews:** VOHC-approved dental treats help scrape off plaque.\n` +
          `4. **Signs of Disease:** Dropping food while eating, red bleeding gums, or foul breath require a professional vet dental scaling.`;
      } else if (q.includes("limp") || q.includes("paw") || q.includes("leg") || q.includes("sprain") || q.includes("fracture") || q.includes("joint") || q.includes("walk")) {
        fallbackReply =
          `### 🐾 Limping & Paw Injury Care Protocol\n\n` +
          `Limping indicates acute pain or joint stiffness in a limb:\n\n` +
          `1. **Inspect Paw Pads:** Check between toes for thorns, burrs, broken glass, or overgrown/torn toenails.\n` +
          `2. **Strict Rest:** Keep your pet confined to a single room without jumping or stairs.\n` +
          `3. **No Human Painkillers:** Never give human pain relief pills (Paracetamol/Ibuprofen/Aspirin) — they can be fatal.\n` +
          `4. **See a Vet:** If your pet cannot bear any weight, or if limping continues for over 24 hours.`;
      } else if (q.includes("itch") || q.includes("skin") || q.includes("rash") || q.includes("hot spot") || q.includes("fur loss") || q.includes("hair loss") || q.includes("allergy")) {
        fallbackReply =
          `### 🐕 Skin Itching, Allergies & Hot Spot Relief\n\n` +
          `Frequent itching and redness usually stem from allergies, mites, or secondary infections:\n\n` +
          `1. **E-Collar (Cone):** Use an Elizabethan collar to prevent constant licking and self-trauma.\n` +
          `2. **Soothing Baths:** Wash with an oatmeal or chlorhexidine pet shampoo (avoid human shampoos).\n` +
          `3. **Dietary Omega-3s:** Fish oil supplements support the epidermal skin moisture barrier.\n` +
          `4. **Vet Exam:** A vet can perform a skin scraping to prescribe targeted allergy or antifungal therapy.`;
      } else if (q.includes("bath") || q.includes("bathe") || q.includes("wash") || q.includes("shampoo") || q.includes("groom")) {
        fallbackReply =
          `### 🛁 Pet Bathing & Grooming Best Practices\n\n` +
          `- **Frequency:** Dogs need baths every 3–4 weeks on average. Cats groom themselves and rarely need water baths.\n` +
          `- **Water Temp:** Use comfortable, lukewarm water.\n` +
          `- **Pet Shampoo:** Always use pH-balanced pet shampoo (human shampoo is too acidic and dries their skin).\n` +
          `- **Protect Ears:** Place a clean cotton ball gently in each ear during the bath to avoid ear infections.\n` +
          `- **Dry:** Towel dry thoroughly, and use only the low/cool setting if using a hairdryer.`;
      } else if (q.includes("train") || q.includes("potty") || q.includes("pee") || q.includes("bark") || q.includes("bite") || q.includes("chew")) {
        fallbackReply =
          `### 🐾 Positive Pet Training & Behavioral Guidance\n\n` +
          `- **Potty Routine:** Take puppies outside first thing in the morning, 15 min after each meal, and right after naps.\n` +
          `- **Immediate Praise:** Reward successful bathroom breaks with a tasty treat within 2 seconds.\n` +
          `- **Never Punish:** Clean accidents with an enzymatic spray to remove lingering odor markers.\n` +
          `- **Teething/Chewing:** When puppies nip, make a high-pitched "Ouch!" and swap your hand for a durable rubber chew toy.`;
      } else if (q.includes("sneeze") || q.includes("cough") || q.includes("eye") || q.includes("nose") || q.includes("discharge")) {
        fallbackReply =
          `### 🐱 Respiratory & Eye Health Care\n\n` +
          `- **Discharge Color:** Clear discharge is often dust or allergies; thick yellow/green discharge indicates infection.\n` +
          `- **Steam Therapy:** Bring your pet into a steamy bathroom for 10–15 minutes to help loosen nasal congestion.\n` +
          `- **Clean Eyes:** Gently wipe crusty buildup with sterile saline and a soft cotton pad.\n` +
          `- **Urgent Signs:** Labored breathing, open-mouth breathing in cats, or persistent coughing require an urgent vet check.`;
      } else if (q.includes("diet") || q.includes("feed") || q.includes("nutrition") || q.includes("kibble") || q.includes("weight") || q.includes("treat")) {
        fallbackReply =
          `### 🥗 Pet Nutrition & Feeding Guidelines\n\n` +
          `- **Species Needs:** Dogs are omnivores thriving on balanced proteins and grains. Cats are obligate carnivores requiring high animal protein and Taurine.\n` +
          `- **Portion Control:** Always measure food with a measuring cup rather than eyeballing to prevent pet obesity.\n` +
          `- **Safe Supplements:** Plain steamed pumpkin, plain boiled green beans, and plain unseasoned chicken.\n` +
          `- **Fresh Water:** Keep clean water bowls refreshed daily. Adding wet canned food boosts hydration for cats.`;
      } else if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("who are you") || q.trim() === "doctor" || q.trim() === "petzy") {
        fallbackReply =
          `👋 **Hello! I'm Petzy Doctor 🩺🐾**, your dedicated AI veterinary assistant for Pet Care Platform.\n\n` +
          `I'm here 24/7 to help you with:\n` +
          `- 🩺 Symptom triage (vomiting, scratching, limping, coughs)\n` +
          `- 🍲 Safe diets, toxic food checks & nutrition advice\n` +
          `- 💉 Puppy & kitten vaccination schedules\n` +
          `- 🦷 Dental care, bathing & grooming routines\n` +
          `- 🩹 First-aid tips & emergency warnings\n` +
          `- 📍 Finding trusted veterinary clinics near you\n\n` +
          `Tell me about your pet! What is their name, species (dog, cat, bird, rabbit), and what can I assist you with today?`;
      } else {
        const words = q.split(/\s+/).filter(w => w.length > 2);
        const subject = words.slice(0, 4).join(" ");
        fallbackReply =
          `### 🩺 Petzy Doctor Veterinary Consultation\n\n` +
          `Thank you for consulting Petzy Doctor regarding **"${subject || "your pet's wellness"}"**.\n\n` +
          `**1. Clinical Triage Checklist:**\n` +
          `- **Vital Signs:** Check your pet's energy, water intake, gum color (should be pink and moist), and breathing.\n` +
          `- **Onset:** Keep note of when this first started and if symptoms are improving or worsening.\n` +
          `- **Comfort:** Keep your pet in a clean, quiet, and stress-free space with fresh water always available.\n\n` +
          `**2. Safety Reminder:**\n` +
          `- Never give human over-the-counter painkillers (Paracetamol/Ibuprofen/Aspirin) as they are toxic to pets.\n` +
          `- If you observe rapid breathing, continuous vomiting, or sudden weakness, seek emergency vet care.\n\n` +
          `**3. Next Steps:**\n` +
          `- If this continues for more than 24 hours, check our **[Vet Directory](/vets)** to schedule an exam with a licensed vet clinic!\n\n` +
          `*Feel free to share more details about your pet's species, age, and symptoms for tailored advice.*`;
      }

      const botMsg = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: fallbackReply,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper to format bot markdown text cleanly (bullets, bold, paragraphs)
  const renderFormattedText = (rawText) => {
    const paragraphs = rawText.split("\n\n");
    return paragraphs.map((para, pIdx) => {
      const lines = para.split("\n");
      const isList = lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\./.test(line.trim()));

      if (isList) {
        return (
          <ul key={pIdx} className="petzy-chat-list">
            {lines.map((item, lIdx) => {
              const cleaned = item.replace(/^[-*]\s+|\d+\.\s+/, "");
              return <li key={lIdx}>{formatInline(cleaned)}</li>;
            })}
          </ul>
        );
      }

      return (
        <p key={pIdx} className="petzy-chat-p">
          {lines.map((line, lIdx) => (
            <span key={lIdx}>
              {formatInline(line)}
              {lIdx < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
  };

  const formatInline = (text) => {
    // Basic bold parsing: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="petzy-doctor-container" aria-label="Petzy Doctor Chatbot">
      {/* 1. Floating Trigger Button */}
      {!isOpen && (
        <button
          className="petzy-fab-button"
          onClick={toggleOpen}
          aria-label="Open Petzy Doctor AI Chat"
          title="Talk with Petzy Doctor"
        >
          <div className="petzy-fab-pulse"></div>
          <div className="petzy-fab-icon-box">
            <Stethoscope className="petzy-fab-icon" size={26} />
            <span className="petzy-fab-paw">🐾</span>
          </div>
          <span className="petzy-fab-label">
            <strong>Petzy Doctor</strong>
            <small>Meet AI Doctor • Online</small>
          </span>
          {hasUnread && <span className="petzy-fab-unread-dot" />}
        </button>
      )}

      {/* 2. Floating Chat Window */}
      {isOpen && (
        <div className={`petzy-chat-window ${isMinimized ? "minimized" : ""}`}>
          {/* Header */}
          <div className="petzy-chat-header">
            <div className="petzy-header-info">
              <div className="petzy-avatar">
                <Stethoscope size={20} className="avatar-icon" />
                <span className="avatar-status-dot"></span>
              </div>
              <div className="petzy-header-titles">
                <div className="petzy-name-row">
                  <h3>Petzy Doctor</h3>
                  <span className="petzy-badge">AI Vet</span>
                </div>
                <p className="petzy-status-text">
                  <span className="status-indicator"></span> Always here for your pets
                </p>
              </div>
            </div>

            <div className="petzy-header-actions">
              <button
                className="header-btn"
                onClick={clearChat}
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="header-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximize" : "Minimize"}
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>
              <button
                className="header-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Emergency Banner */}
              <div className="petzy-disclaimer-banner">
                <Info size={14} className="banner-icon" />
                <span>AI triage & wellness advice. In life-threatening emergencies, visit a clinic immediately.</span>
              </div>

              {/* Message List */}
              <div className="petzy-chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`petzy-message-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="message-avatar">
                        <Stethoscope size={15} />
                      </div>
                    )}
                    <div className={`petzy-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"} ${msg.isWarning ? "warning-bubble" : ""}`}>
                      <div className="bubble-content">
                        {renderFormattedText(msg.text)}
                      </div>
                      <span className="bubble-time">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="petzy-message-row bot-row">
                    <div className="message-avatar">
                      <Stethoscope size={15} />
                    </div>
                    <div className="petzy-bubble bot-bubble typing-bubble">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">Petzy Doctor is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="petzy-suggestions-bar">
                <span className="suggestions-label">Suggestions:</span>
                <div className="suggestions-scroll">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      className="suggestion-chip"
                      onClick={() => sendMessage(s.query)}
                      disabled={isLoading}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="petzy-chat-input-area">
                <textarea
                  ref={inputRef}
                  className="petzy-input"
                  placeholder="Describe your pet's symptoms or questions..."
                  value={input}
                  rows={1}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button
                  className="petzy-send-btn"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send Message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
