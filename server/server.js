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
  if (query.includes("vaccin") || query.includes("shot") || query.includes("immuniz") || query.includes("deworm")) {
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
  if (query.includes("tick") || query.includes("flea") || query.includes("mite") || query.includes("lice")) {
    return `### 🐜 Flea & Tick Treatment and Prevention

Ticks and fleas can transmit dangerous conditions such as Tick Fever (*Babesiosis*, *Ehrlichiosis*) and Flea Allergy Dermatitis (FAD):

**How to Safely Handle & Remove Ticks:**
1. **Never Burn or Smother:** Do not use alcohol, petroleum jelly, or matches. This causes the tick to regurgitate pathogens directly into your pet's bloodstream.
2. **Proper Removal:** Use fine-tipped tweezers or a tick remover hook. Grasp the tick as close to the skin as possible and pull upward with steady, gentle force without twisting or squeezing the abdomen.
3. **Disinfect:** Clean the bite site with pet-safe antiseptic or diluted chlorhexidine.

**Prevention & Treatment:**
- **Veterinary Preventatives:** Ask your veterinarian for monthly chewables (*Bravecto, NexGard, Simparica*) or topical spot-on treatments (*Frontline, Revolution*).
- **Environmental Care:** Wash all bedding in hot water (above 60°C) and vacuum carpets and baseboards thoroughly to remove flea eggs and larvae.`;
  }

  // Dental & Teeth Care
  if (query.includes("teeth") || query.includes("tooth") || query.includes("dental") || query.includes("tartar") || query.includes("bad breath") || query.includes("mouth")) {
    return `### 🦷 Pet Dental Care & Bad Breath Guide

Periodontal disease affects over 80% of dogs and cats by age 3, and bacteria from infected gums can harm their kidneys and heart.

**How to Care for Your Pet's Teeth:**
1. **Use Pet Toothpaste Only:** Never use human toothpaste! Human toothpaste contains fluoride and foaming agents (or xylitol) that are toxic when swallowed.
2. **Brushing Routine:**
   - Start gradually by letting your pet lick meat-flavored pet toothpaste from your finger.
   - Use a soft-bristled pet toothbrush or finger brush in gentle circular motions on the outer tooth surfaces.
   - Aim for 3–4 times per week (daily is ideal).
3. **Dental Chews & Toys:** VOHC-approved (Veterinary Oral Health Council) dental treats and rubber toys help mechanically scrape off soft plaque.
4. **Warning Signs of Dental Disease:**
   - Extremely foul breath, red or bleeding gums, yellow/brown tartar crusts.
   - Dropping food while eating, pawing at the mouth, or chewing on only one side.
   - If present, schedule a professional ultrasonic dental scaling with your vet clinic.`;
  }

  // Limping / Paw / Injury / Arthritis
  if (query.includes("limp") || query.includes("paw") || query.includes("leg") || query.includes("sprain") || query.includes("fracture") || query.includes("arthritis") || query.includes("joint") || query.includes("walk")) {
    return `### 🐾 Limping & Paw Injury Care Protocol

Limping is a direct physical sign that your pet is experiencing pain or discomfort in a limb, joint, or paw pad.

**Step 1: Gentle At-Home Examination:**
- **Inspect the Paw Pads:** Look closely between the toes for foreign bodies (thorns, burrs, glass shards, ticks, or bee stings).
- **Check the Nails:** Look for torn, broken, or overgrown dewclaws that may have curled into the pad.
- **Check for Heat & Swelling:** Gently run your hand down the leg feeling for warmth, localized swelling, or joint tenderness.

**Step 2: Immediate First-Aid:**
- **Strict Rest:** Confine your pet to a single room. Prevent running, jumping on furniture, and stairs.
- **Cold Compress:** If you suspect a recent sprain (within 24 hours), apply a cold pack wrapped in a towel for 10 minutes.
- **CRITICAL WARNING:** NEVER give human painkillers like Paracetamol (Panadol/Tylenol), Ibuprofen (Advil), or Aspirin! Even a single pill can cause fatal liver failure in cats and severe gastric ulcers/kidney damage in dogs.

**Step 3: When to Visit the Vet:**
- Complete non-weight-bearing lameness (holding the leg up off the ground).
- Obvious limb deformity, severe swelling, or deep puncture wounds.
- Limping that persists for more than 24 hours. Your vet may take digital X-rays to check for ligament tears or fractures.`;
  }

  // Skin, Itching, Hotspots & Fur Loss
  if (query.includes("itch") || query.includes("skin") || query.includes("rash") || query.includes("hot spot") || query.includes("fur loss") || query.includes("hair loss") || query.includes("bald") || query.includes("scab") || query.includes("allergy") || query.includes("allergic")) {
    return `### 🐕 Skin Itching, Allergies & Hot Spot Relief

Excessive scratching, licking paws, and patchy fur loss are frequent issues in companion pets:

**Most Common Causes:**
- **Allergies:** Atopic dermatitis (environmental dust/pollen), food allergies (often beef or chicken proteins), or flea saliva allergy.
- **Fungal / Ringworm Infection:** Characterized by circular hair loss patches, dandruff, and brittle hair.
- **Bacterial Hot Spots:** Warm, moist, red, hairless lesions that appear rapidly from constant licking.
- **Mange (Demodex or Sarcoptes):** Intense itching, crusting around eyes, elbows, and ears.

**At-Home Relief & Management:**
1. **Prevent Self-Trauma:** Use an Elizabethan collar (cone/e-collar) to stop continuous licking and secondary bacterial infection.
2. **Cool Soothing Bath:** Bathe with a veterinary oatmeal or chlorhexidine-based shampoo. Avoid human scented shampoos.
3. **Omega-3 Fatty Acids:** Adding fish oil to their diet strengthens the epidermal skin barrier.
4. **Veterinary Diagnosis:** A veterinarian can perform a quick skin scraping or tape impression to prescribe targeted anti-itch medications (such as Apoquel or Cytopoint) or antifungals.`;
  }

  // Bathing & Grooming
  if (query.includes("bath") || query.includes("bathe") || query.includes("wash") || query.includes("shampoo") || query.includes("groom") || query.includes("brush")) {
    return `### 🛁 Pet Bathing & Grooming Best Practices

Keeping your pet clean without stripping their coat of essential natural protective oils:

**How Often to Bathe:**
- **Dogs:** Every 3 to 4 weeks on average, or when visibly dirty or smelly. Bathing too frequently can strip natural skin lipids and cause dryness and dandruff.
- **Cats:** Cats groom themselves thoroughly and rarely require full water baths unless they have sticky, oily fur or are hairless breeds (like Sphynx).

**Step-by-Step Bathing Guide:**
1. **Brush First:** Always brush out loose fur and tangles before getting the coat wet.
2. **Use Lukewarm Water:** Test the temperature on your wrist. Ensure it is gentle and comfortable.
3. **Pet-Specific Shampoo:** Pet skin has a neutral pH (around 7.0–7.5), while human skin is acidic (around 5.5). Human shampoo disrupts their skin microbiome.
4. **Protect Sensitive Areas:** Avoid getting water and soap directly inside their eyes and ears. Place a dry cotton ball gently in each ear during the bath to keep canals dry.
5. **Dry Thoroughly:** Towel dry carefully. If using a blow dryer, use only the **low/cool** heat setting.`;
  }

  // Puppy / Cat Training & Behavior
  if (query.includes("train") || query.includes("bark") || query.includes("potty") || query.includes("pee") || query.includes("housebreak") || query.includes("biting") || query.includes("bite") || query.includes("chew") || query.includes("scratching furniture")) {
    return `### 🐾 Pet Training & Behavioral Guidance

Positive reinforcement is scientifically proven to produce the fastest, longest-lasting behavioral results:

**Potty Training Tips (Puppies & Kittens):**
1. **Establish a Routine:** Take puppies outside first thing in the morning, 15 minutes after each meal, immediately after waking from naps, and before bedtime.
2. **Immediate Reward:** The instant they eliminate in the correct spot, enthusiastically praise them and offer a high-value treat within 2 seconds.
3. **Litter Box for Cats:** Keep 1 litter box per cat plus 1 extra. Clean daily and position in a quiet, low-traffic area.
4. **Never Punish Accidents:** Never rub their nose in waste or shout. Clean accidents immediately with an enzymatic cleaner to break down ammonia scent markers.

**Biting & Destructive Chewing:**
- Puppies explore with their mouths and teethe until 6 months.
- When they nip your hands, let out a sharp "Ouch!", stop play for 20 seconds, and immediately redirect their teeth onto a designated rubber chew toy.`;
  }

  // Sneezing / Coughing / Eye Discharge / Upper Respiratory
  if (query.includes("sneeze") || query.includes("cough") || query.includes("eye") || query.includes("nose") || query.includes("discharge") || query.includes("runny") || query.includes("congest")) {
    return `### 🐱 Sneezing, Coughing & Respiratory Health

Respiratory symptoms in pets can range from mild dust irritation to contagious viral infections (like Kennel Cough or Feline Herpesvirus):

**What to Check:**
- **Discharge Color:** Clear, watery discharge often indicates environmental allergies or mild dust irritation. Yellow or green thick mucus indicates active bacterial or viral infection.
- **Breathing Effort:** Watch their chest and belly while resting. Normal resting breathing rate is 15–30 breaths per minute. Open-mouth panting in cats is always abnormal and requires immediate attention.
- **Eyes:** Red conjunctiva, squinting, or crusty eyelids should be checked to rule out corneal ulcers.

**Supportive At-Home Care:**
1. **Steam Therapy:** Bring your pet into the bathroom while running a hot shower for 10–15 minutes. The warm humidity loosens nasal congestion.
2. **Clean Eyes & Nose:** Gently wipe crusty buildup with sterile saline solution and a soft gauze pad.
3. **Keep Warm & Rested:** Ensure a draft-free resting spot.
4. **Consult Your Vet:** If coughing sounds like a loud honking goose (Kennel Cough), or if accompanied by high fever or appetite loss.`;
  }

  // Safe / Healthy Diets, Nutrition & Feeding
  if (query.includes("diet") || query.includes("feed") || query.includes("nutrition") || query.includes("kibble") || query.includes("raw") || query.includes("overweight") || query.includes("weight") || query.includes("treat")) {
    return `### 🥗 Complete Pet Nutrition & Feeding Guidelines

Proper nutrition is the cornerstone of longevity, healthy organ function, and a shiny coat:

**Core Principles for Dogs vs. Cats:**
- **Dogs are Omnivores:** They thrive on balanced meals with high-quality animal proteins, wholesome grains (or healthy carbs like sweet potato), and dietary fibers.
- **Cats are Obligate Carnivores:** They strictly require high animal protein and essential amino acids like **Taurine** (found only in animal tissue). Cats must never be fed vegetarian diets.

**Feeding Tips & Portion Control:**
1. **Follow Life-Stage Formulas:** Puppies/kittens need calorie-dense growth formulas; adults need maintenance; pets over 7 years benefit from senior joint-support blends.
2. **Portion Measurement:** Always use an actual measuring cup or kitchen scale. Eyeballing kibble easily leads to pet obesity.
3. **Safe Add-Ins:** You can supplement meals with plain boiled pumpkin (supports digestion), plain cooked green beans, or steamed egg.
4. **Hydration:** Especially for cats prone to kidney issues, adding wet canned food helps maintain bladder hydration.`;
  }

  // Greetings & General Questions
  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("who are you") || query.trim() === "doctor" || query.trim() === "petzy") {
    return `👋 **Hello! I'm Petzy Doctor 🩺🐾**, your dedicated AI veterinary assistant for Pet Care Platform.

I'm here 24/7 to help you with:
- 🩺 Symptom triage (vomiting, scratching, limping, coughs)
- 🍲 Safe diets, toxic food checks & nutrition advice
- 💉 Puppy & kitten vaccination protocols
- 🦷 Dental care, bathing & grooming routines
- 🩹 First-aid tips & emergency warnings
- 📍 Finding trusted veterinary clinics near you

Tell me about your pet! What is their name, species (dog, cat, bird, rabbit), and what question can I answer for you today?`;
  }

  // Contextual Dynamic Advisor (Tailored response based on words detected)
  const words = query.split(/\s+/).filter(w => w.length > 2);
  const detectedSubject = words.slice(0, 4).join(" ");

  return `### 🩺 Petzy Doctor Veterinary Consultation

Thank you for consulting Petzy Doctor regarding **"${detectedSubject || "your pet's wellness"}"**. Here is my clinical advice for this situation:

**1. Primary Health & Symptom Checklist:**
- **Monitor Vital Signs:** Observe your pet's energy level, water intake, gum color (should be pink and moist), and breathing rate.
- **Track Any Changes:** Note down when this behavior or symptom first started and whether it is staying consistent or worsening.
- **Comfortable Environment:** Keep your pet in a warm, quiet, well-ventilated room with fresh water always available.

**2. Important Safety Measures:**
- Never give human over-the-counter pain relievers or fever reducers (such as Paracetamol/Panadol, Tylenol, or Ibuprofen), as these are toxic to pets.
- If you suspect any toxin exposure, sudden abdominal swelling, breathing distress, or intense pain, seek emergency care immediately.

**3. Next Recommended Steps:**
- For non-emergency symptoms lasting more than 24 hours, have your pet examined in person by a veterinarian.
- You can find verified clinics nearby anytime in our **[Vet Directory](/vets)**!

*Would you like more specific guidance? Feel free to tell me your pet's species, age, and any additional symptoms they are showing!*`;
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
