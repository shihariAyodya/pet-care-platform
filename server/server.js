import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Attempt to load from server/.env as well as current working directory
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function getClient() {
  // Reload .env on demand so changes to server/.env take effect immediately
  dotenv.config({ path: path.join(__dirname, ".env"), override: true });
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: key
  });
}

const SYSTEM_PROMPT = `You are Petzy Doctor, a warm, caring, and knowledgeable AI veterinary doctor assistant for the Pet Care Platform.
Your mission is to help pet parents understand their pets' symptoms, nutrition, behavior, daily care, preventative wellness, and first-aid tips for dogs, cats, birds, and other companion animals.

Guidelines:
1. Speak in a friendly, encouraging, and empathetic tone like a trusted family veterinarian.
2. Structure your answers with clear formatting, bullet points, or short steps whenever giving advice or symptom analysis.
3. Always include a brief, caring disclaimer when discussing symptoms: remind owners that while you offer expert advice and triage tips, severe conditions or sudden changes (difficulty breathing, seizures, sudden collapse, extreme lethargy, toxin ingestion) require immediate in-person emergency vet care.
4. If asked about local vets, suggest they check the "Vet Directory" page on Pet Care Platform.
5. If greeted with "hello" or similar, warmly introduce yourself as Petzy Doctor and ask about their pet's name, age, and breed.`;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Petzy Doctor AI API is running! 🩺🐾",
    endpoint: "POST /chat"
  });
});

async function callFallbackAI(messages) {
  try {
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages,
        model: "openai",
        seed: Math.floor(Math.random() * 100000)
      })
    });
    if (!response.ok) throw new Error(`Fallback HTTP ${response.status}`);
    const text = await response.text();
    return text;
  } catch (err) {
    console.error("Fallback AI error:", err.message);
    return null;
  }
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const history = req.body.history || [];

    if (!userMessage && (!history || history.length === 0)) {
      return res.status(400).json({ reply: "Please provide a message for Petzy Doctor." });
    }

    // Build messages payload with conversation history if provided
    let messages = [{ role: "system", content: SYSTEM_PROMPT }];

    if (Array.isArray(history) && history.length > 0) {
      // Keep up to last 10 messages for context
      const recentHistory = history.slice(-10).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));
      messages = [...messages, ...recentHistory];
    }

    if (userMessage) {
      messages.push({ role: "user", content: userMessage });
    }

    const client = getClient();
    let reply = null;

    if (client) {
      try {
        const response = await client.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: messages
        });
        reply = response.choices?.[0]?.message?.content;
      } catch (groqError) {
        console.warn("Groq API error:", groqError?.message || groqError);
        // If Groq is blocked by Cloudflare (403 Access Denied) or network, switch to fallback AI engine
        reply = await callFallbackAI(messages);
      }
    } else {
      reply = await callFallbackAI(messages);
    }

    if (!reply) {
      reply = "Hello! I am Petzy Doctor 🩺🐾. How can I help with your pet's wellness or care today?";
    }

    res.json({ reply });
  } catch (error) {
    console.error("Petzy Doctor API General Error:", error?.message || error);
    res.json({
      reply: "Petzy Doctor is currently resting or taking a short break. For urgent pet emergencies, please contact your local vet clinic."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🐾 Petzy Doctor Server is running on http://localhost:${PORT}`);
});
