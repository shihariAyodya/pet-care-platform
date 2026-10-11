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

function generateVeterinaryAdvice(userText) {
  const query = (userText || "").toLowerCase();

  // Toxic food
  if (query.includes("toxic") || query.includes("poison") || query.includes("chocolate") || query.includes("onion") || query.includes("grape") || query.includes("safe") && query.includes("food")) {
    return `### ⚠️ Toxic Foods to Keep Away from Pets

**Never give these foods to dogs or cats:**
- **Chocolate & Caffeine:** Contains theobromine which causes cardiac and nervous system toxicity.
- **Grapes & Raisins:** Can trigger acute, irreversible kidney failure in dogs even in tiny amounts.
- **Onions, Garlic, Chives & Leeks:** Causes oxidative damage to red blood cells (hemolytic anemia).
- **Xylitol / Birch Bark Sweetener:** Found in sugar-free gums, peanut butters, and candies. Triggers fatal hypoglycemia and liver failure.
- **Macadamia Nuts:** Causes weakness, tremors, hypothermia, and vomiting.
- **Cooked Bones:** Splinter easily and cause intestinal perforation or severe blockages.
- **Alcohol & Raw Yeast Dough:** Produces toxic ethanol and dangerous stomach bloating.

**Safe, healthy snacks:**
- Plain cooked chicken (no bone, no onion/garlic seasoning)
- Carrots, seedless watermelon, pumpkin puree, and blueberries.

*If you suspect your pet ate any toxic food within the last 2 hours, contact an emergency vet immediately!*`;
  }

  // Not eating / Loss of appetite / Lethargy
  if (query.includes("not eat") || query.includes("won't eat") || query.includes("appetite") || query.includes("letharg") || query.includes("weak")) {
    return `### 🐶 Pet Not Eating / Low Energy Advice

A sudden loss of appetite (anorexia) or lethargy can have several causes:

**1. Immediate At-Home Checks:**
- **Check Hydration:** Gently pinch the skin behind their neck. If it snaps back immediately, they are hydrated. If it takes seconds to drop, they are dehydrated.
- **Check Gums:** Healthy gums should be moist and pink. Pale, tacky, or yellowish gums require an urgent vet check.
- **Fever Check:** Normal pet body temperature is 101.0°F – 102.5°F (38.3°C – 39.2°C).
- **Recent Diet Changes:** Sudden changes in kibble can cause mild stomach upset.

**2. Gentle Encouragements:**
- Offer warm, plain boiled chicken breast with white rice or plain bone broth (no onions or salt).
- Warm their food slightly in the microwave for 5 seconds to enhance aroma.

**3. When to See a Vet:**
- Puppies/kittens not eating for **over 12 hours**.
- Adult pets refusing food for **more than 24 hours**.
- Any accompanying vomiting, diarrhea, or collapse. Check our **Vet Directory** to find a nearby clinic.`;
  }

  // Ear scratching / Head shaking
  if (query.includes("ear") || query.includes("scratch") || query.includes("shake") || query.includes("head")) {
    return `### 🐱 Ear Scratching & Head Shaking Guide

Frequent ear scratching and head shaking usually indicate ear canal irritation. Common culprits include:

**Common Causes:**
- **Ear Mites (*Otodectes cynotis*):** Very common in kittens and cats. Often accompanied by black, coffee-ground-like discharge.
- **Yeast or Bacterial Infections:** Usually accompanied by a sweet or foul odor, redness, and brownish wax.
- **Foreign Body / Grass Seed:** Sudden, intense head shaking after walking outside.
- **Allergies:** Environmental or food allergies often manifest as itchy ears and inflamed paws.

**What You Should Do:**
1. **Do not use human cotton swabs (Q-tips)** inside the ear canal — you can rupture the delicate eardrum.
2. Avoid applying over-the-counter drops before a vet inspects the eardrum with an otoscope.
3. You can gently wipe the outer ear flap with a damp cotton pad.
4. Schedule a routine examination at your local vet clinic for proper microscopic ear cytology and medicated ear drops.`;
  }

  // Red flag emergency symptoms
  if (query.includes("emergency") || query.includes("red-flag") || query.includes("red flag") || query.includes("urgent") || query.includes("danger")) {
    return `### 🚨 Red-Flag Pet Emergency Symptoms

If you observe any of the following symptoms, **seek emergency veterinary medical care immediately**:

- **Breathing Difficulties:** Rapid open-mouth breathing in cats, loud wheezing, or pale/blue gums.
- **Unproductive Retching / Swollen Abdomen:** Classic sign of Gastric Dilatation-Volvulus (GDV/Bloat) in large dogs.
- **Inability to Urinate:** Straining with no urine produced, especially in male cats (urinary blockage — fatal within 24-48 hours).
- **Sudden Collapse or Seizures:** Repeated seizures lasting more than 2 minutes.
- **Severe Trauma or Hemorrhage:** Hit by a car, deep lacerations, or profuse bleeding.
- **Suspected Ingestion of Poisons:** Rat bait, antifreeze, human prescription medications, lilies (fatal to cats).
- **Extreme Pain:** Continuous crying, whining, guarding the abdomen, or inability to stand.

*Locate your nearest 24/7 animal clinic under the "Vet Directory" tab on our platform.*`;
  }

  // Puppy / Kitten Vaccines
  if (query.includes("vaccin") || query.includes("puppy") || query.includes("kitten") || query.includes("shot")) {
    return `### 💉 Recommended Core Puppy Vaccination Schedule

Vaccinations protect puppies from life-threatening viral infections:

- **6–8 Weeks Old:**
  - First DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza).
  - First deworming treatment.

- **10–12 Weeks Old:**
  - DHPP Booster #2.
  - Optional non-core: Leptospirosis, Bordetella (Kennel Cough).

- **14–16 Weeks Old:**
  - DHPP Booster #3.
  - **Rabies vaccine** (essential & legally required in most regions).

- **Annual Boosters:**
  - DHPP & Rabies booster at 1 year of age, then every 1 to 3 years.

*Important Safety Tip: Keep your puppy indoors and away from unvaccinated dogs until 2 weeks after their 16-week final booster shots!*`;
  }

  // Vomiting or Diarrhea
  if (query.includes("vomit") || query.includes("throw up") || query.includes("diarrhea") || query.includes("poop")) {
    return `### 🐾 Pet Upset Stomach & Vomiting Protocol

If your pet had 1–2 mild episodes of vomiting or loose stools:

**First 12–24 Hours Care:**
1. **Bland Diet:** Serve boiled skinless chicken breast with white rice (ratio: 1 part chicken to 2 parts rice).
2. **Hydration:** Provide small, frequent amounts of fresh water. Do not let them gulp huge bowls quickly.
3. **Rest:** Keep them indoors in a quiet, warm area.
4. **No human medications:** Never give human pain relievers (Paracetamol/Ibuprofen/Aspirin) — they are highly toxic to dogs and cats.

**See a Vet Immediately if:**
- Vomit contains blood, black coffee-ground residue, or foreign objects.
- More than 3 episodes in 12 hours.
- Severe weakness, fever, or refusal to drink water for over 24 hours.`;
  }

  // Ticks and Fleas
  if (query.includes("tick") || query.includes("flea") || query.includes("mite")) {
    return `### 🐜 Flea & Tick Treatment and Prevention

Ticks can transmit dangerous diseases like Tick Fever (Babesiosis) and Ehrlichiosis:

**How to Handle Ticks:**
1. **Safe Removal:** Use fine-tipped tweezers or a tick hook. Grasp the tick as close to the pet's skin surface as possible and pull straight upward with steady, even pressure. Do NOT squeeze or burn the tick.
2. **Preventatives:** Ask your vet about oral chewables (such as Bravecto, NexGard, or Simparica) or topical spot-on treatments (like Frontline).
3. **Home Hygiene:** Wash your pet's beddings in hot water and vacuum carpets regularly.`;
  }

  // Greetings & General Questions
  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("who are you")) {
    return `👋 **Hello! I'm Petzy Doctor 🩺🐾**, your dedicated AI veterinary assistant for Pet Care Platform.

I'm here 24/7 to help you with:
- 🩺 Symptom triage & health questions
- 🍲 Safe diets, toxic foods & nutrition
- 💉 Puppy & kitten vaccination guides
- 🩹 First-aid protocols & emergency warnings
- 📍 Finding trusted veterinary clinics near you

Tell me about your pet! What is their name, species (dog, cat, bird), and what can I assist you with today?`;
  }

  // Default veterinary consultation reply
  return `### 🩺 Petzy Doctor Veterinary Consultation

Thank you for reaching out about your pet's care! Here are some key points to consider:

1. **Observe Vital Signs:**
   - Watch for changes in appetite, water intake, breathing rate, and bathroom habits.
   - Look out for unusual lethargy, trembling, or hiding behavior.

2. **Home Care:**
   - Ensure a clean, comfortable, and stress-free resting environment.
   - Keep plenty of fresh, clean water readily accessible.
   - Avoid administering any human over-the-counter medicine without veterinary approval.

3. **When to Consult a Clinic:**
   - If symptoms persist for more than 24 hours or suddenly deteriorate, visit a registered veterinarian.
   - You can browse verified clinics in your area under our **Vet Directory** page!

*How else can I assist with your pet's health or wellness today?*`;
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
        // If Groq is blocked by Cloudflare (403 Access Denied) or network, switch to veterinary advice engine
        reply = generateVeterinaryAdvice(userMessage);
      }
    } else {
      reply = generateVeterinaryAdvice(userMessage);
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
