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
      console.warn("Could not reach backend:", err);
      setServerError(true);

      // Helpful fallback message when local server isn't active
      const fallbackReply =
        `⚠️ **Petzy Doctor server is not reachable at http://localhost:3000**\n\n` +
        `To connect live to Groq AI:\n` +
        `1. Add your Groq API key in \`server/.env\` (or configure \`GROQ_API_KEY\`)\n` +
        `2. In your terminal, run: \`npm run server\`\n\n` +
        `*Quick Veterinary Note on your question:* Always watch your pet for red flags like breathing issues, continuous vomiting, or sudden weakness, and consult a registered vet clinic immediately for emergency care.`;

      const botMsg = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: fallbackReply,
        time: formatTime(),
        isWarning: true
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
