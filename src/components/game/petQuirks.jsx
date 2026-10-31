// Pet Quirk Library - Minimum 30 quirks for variety
export const PET_QUIRKS = [
  "Judges you silently during phone calls",
  "Steals socks specifically — never other laundry",
  "Has one sworn enemy (a specific chair)",
  "Refuses to acknowledge their own name",
  "Acts dramatic for attention, then denies needing it",
  "Chooses one family member as 'favorite' daily (rotates)",
  "Believes walks are a hostage negotiation",
  "Treats the food bowl like a sacred ritual site",
  "Naps in the most inconvenient location, always",
  "Has a signature move for expressing disapproval",
  "Becomes feral at bath time, gracious afterward",
  "Acts like a tiny therapist during hard moments",
  "Protects one specific toy with terrifying loyalty",
  "Pretends not to care, then follows you everywhere",
  "Has an unexplained rivalry with the vacuum",
  "Celebrates your arrival like you've been gone for years (you went to the bathroom)",
  "Loves chaos, hates change",
  "Knows exactly when you're about to leave",
  "Performs elaborate pre-sleep rituals that must not be interrupted",
  "Chooses violence (playful) at 3am specifically",
  "Acts unimpressed by everything except one random object",
  "Demands attention, then immediately walks away",
  "Has strong opinions about weather",
  "Treats every visitor like a security threat",
  "Becomes weirdly still when you're stressed (then snuggles)",
  "Refuses to be photographed well (always looks haunted)",
  "Perfectly behaved for strangers, chaos incarnate at home",
  "Brings you 'gifts' (dirt, leaves, regret)",
  "Acts like sitting near you is a huge favor",
  "Makes one specific weird noise that becomes iconic",
  "Believes bedtime is a suggestion, not a rule",
  "Has a complex relationship with mirrors",
  "Pretends to be asleep during vet appointments (not subtle)",
  "Loves one person intensely, tolerates the rest",
  "Acts offended by vegetables",
  "Knows when you're sad before you do"
];

// Get random quirk (avoid duplicates if possible)
export function pickQuirk(usedQuirks = []) {
  let available = PET_QUIRKS.filter(q => !usedQuirks.includes(q));
  if (available.length === 0) available = PET_QUIRKS;
  return available[Math.floor(Math.random() * available.length)];
}

// Species data with realistic costs and lifespans
export const PET_SPECIES = {
  dog: {
    id: "dog",
    label: "Dog",
    emoji: "🐶",
    adoptionFee: 250,
    yearlyUpkeep: 1200,
    lifespanMin: 9,
    lifespanMax: 14
  },
  cat: {
    id: "cat",
    label: "Cat",
    emoji: "🐱",
    adoptionFee: 150,
    yearlyUpkeep: 900,
    lifespanMin: 12,
    lifespanMax: 18
  },
  rabbit: {
    id: "rabbit",
    label: "Rabbit",
    emoji: "🐰",
    adoptionFee: 120,
    yearlyUpkeep: 600,
    lifespanMin: 7,
    lifespanMax: 12
  },
  hamster: {
    id: "hamster",
    label: "Hamster",
    emoji: "🐹",
    adoptionFee: 40,
    yearlyUpkeep: 250,
    lifespanMin: 2,
    lifespanMax: 3
  },
  fish: {
    id: "fish",
    label: "Fish",
    emoji: "🐟",
    adoptionFee: 35,
    yearlyUpkeep: 300,
    lifespanMin: 2,
    lifespanMax: 6
  },
  turtle: {
    id: "turtle",
    label: "Turtle",
    emoji: "🐢",
    adoptionFee: 60,
    yearlyUpkeep: 400,
    lifespanMin: 15,
    lifespanMax: 30
  }
};

// Name suggestions by species
export const PET_NAME_SUGGESTIONS = {
  dog: ["Captain Fluff", "Biscuit", "Chaos", "Buddy", "Luna", "Zeus", "Pepper", "Scout"],
  cat: ["Noodle", "Mochi", "Shadow", "Princess", "Kevin", "Sir Whiskers", "Bean", "Ghost"],
  rabbit: ["Clover", "Thumper", "Marshmallow", "Carrot", "Hopper", "Cotton", "Nibbles"],
  hamster: ["Mr. Whiskers", "Peanut", "Cheeks", "Speedy", "Puff", "Tiny", "Nugget"],
  fish: ["Admiral Bubbles", "Flash", "Goldie", "Neptune", "Splash", "Finley", "Glimmer"],
  turtle: ["Shelly", "Tank", "Zen", "Turbo", "Sage", "Rocky", "Speedy"]
};