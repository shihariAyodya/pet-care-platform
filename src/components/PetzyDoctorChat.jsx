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
      } else if (q.includes("vaccin") || q.includes("puppy") || q.includes("kitten") || q.includes("shot")) {
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
      } else {
        fallbackReply =
          `### 🩺 Petzy Doctor Veterinary Advice\n\n` +
          `Here are recommended steps for your pet's wellness:\n\n` +
          `1. **Monitor Behavior:** Watch closely for any changes in appetite, water consumption, stool, or lethargy.\n` +
          `2. **Comfort & Rest:** Provide a quiet, warm, and clean space with fresh drinking water available at all times.\n` +
          `3. **Safety First:** Never administer human painkillers (Paracetamol/Ibuprofen), which are toxic to animals.\n` +
          `4. **Veterinary Check:** If symptoms persist beyond 24 hours, check our **Vet Directory** to consult a licensed veterinarian.\n\n` +
          `*Feel free to ask more specific questions about diets, symptoms, or emergency signs!*`;
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
