// Intelligent client-side generator matching questionnaire answers when backend is unreachable or recovering
export function generateClientPetNames(preferences) {
  const {
    petType = "Dog",
    customPetType = "",
    color = "Not sure",
    personality = [],
    favoriteNames = "",
    excludeFavorites = false
  } = preferences || {};

  const species = (customPetType || petType || "Pet").trim();
  const lowerSpecies = species.toLowerCase();
  const isDog = lowerSpecies.includes("dog");
  const isCat = lowerSpecies.includes("cat");
  const isBird = lowerSpecies.includes("bird");

  const pool = [
    {
      name: isDog ? "Milo" : isCat ? "Luna" : isBird ? "Pip" : "Boba",
      meaning: "Beloved, peaceful, and joyful soul",
      origin: "Latin & Germanic",
      style: ["Cute and adorable", "Friendly"],
      reason: `Reflects the ${personality[0] || "loving"} and affectionate nature of your ${species}.`,
      pronunciation: isDog ? "MY-loh" : isCat ? "LOO-nuh" : "PIP"
    },
    {
      name: color.includes("White") ? "Snowy" : color.includes("Golden") ? "Sunny" : color.includes("Black") ? "Shadow" : "Jasper",
      meaning: color.includes("White") ? "Pure and bright winter snow" : color.includes("Golden") ? "Warm golden morning radiance" : "Precious sparkling gemstone",
      origin: "English & Persian",
      style: ["Nature-inspired", "Modern and trendy"],
      reason: `Perfect complement for your pet's ${color !== "Not sure" ? color.toLowerCase() : "unique"} look.`,
      pronunciation: color.includes("White") ? "SNOH-ee" : color.includes("Golden") ? "SUN-ee" : "JAS-per"
    },
    {
      name: "Zeus",
      meaning: "Radiant sky, courage, and strength",
      origin: "Greek or Roman mythology",
      style: ["Strong and powerful", "Mythological"],
      reason: `A dignified, confident moniker suited for a protective and noble ${species}.`,
      pronunciation: "ZOOS"
    },
    {
      name: "Willow",
      meaning: "Graceful, serene tree symbolizing flexibility",
      origin: "Old English",
      style: ["Nature-inspired", "Elegant and classy"],
      reason: "A calm, poetic melody that matches a gentle temperament.",
      pronunciation: "WIL-oh"
    },
    {
      name: "Mochi",
      meaning: "Sweet Japanese rice delight",
      origin: "Japanese",
      style: ["Cute and adorable", "Funny and creative"],
      reason: `Deliciously sweet and charming, perfect for a cozy, cuddly ${species}.`,
      pronunciation: "MOH-chee"
    },
    {
      name: "Koda",
      meaning: "Loyal companion and steadfast ally",
      origin: "Native American roots",
      style: ["Short and simple", "Traditional"],
      reason: "Short, upbeat, and symbolizes lifelong companionship.",
      pronunciation: "KOH-duh"
    },
    {
      name: "Nova",
      meaning: "A brilliant, captivating new star",
      origin: "Latin & Cosmos",
      style: ["Modern and trendy", "Mythological"],
      reason: `Ideal for an energetic ${species} whose personality lights up the room.`,
      pronunciation: "NOH-vuh"
    },
    {
      name: "Cleo",
      meaning: "Pride, grace, and regal spirit",
      origin: "Greek or Roman mythology",
      style: ["Elegant and classy", "Short and simple"],
      reason: `Regal, spirited, and fitting for an independent, smart ${species}.`,
      pronunciation: "KLEE-oh"
    },
    {
      name: "Peanut",
      meaning: "Endearing, small, and treasured",
      origin: "Modern",
      style: ["Cute and adorable", "Short and simple"],
      reason: "Playful and warm, an instant favorite for affectionate pets.",
      pronunciation: "PEE-nut"
    },
    {
      name: "Simba",
      meaning: "Brave guardian and king",
      origin: "Swahili",
      style: ["Strong and powerful", "Traditional"],
      reason: "Bold and courageous, celebrating vibrancy and warmth.",
      pronunciation: "SIM-bah"
    }
  ];

  const excluded = new Set(
    excludeFavorites && favoriteNames
      ? favoriteNames.split(/[,\\s]+/).map(n => n.trim().toLowerCase()).filter(Boolean)
      : []
  );

  return pool
    .filter(item => !excluded.has(item.name.toLowerCase()))
    .map((item, idx) => ({
      ...item,
      id: `name-client-${Date.now()}-${idx}`
    }));
}
