export const WEALTH_TIERS = [
  { id: 'broke',       label: 'Broke',       emoji: '🪙', min: 0,        max: 999 },
  { id: 'struggling',  label: 'Struggling',  emoji: '🧾', min: 1000,     max: 9999 },
  { id: 'stable',      label: 'Stable',      emoji: '💵', min: 10000,    max: 49999 },
  { id: 'comfortable', label: 'Comfortable', emoji: '🏡', min: 50000,    max: 199999 },
  { id: 'wealthy',     label: 'Wealthy',     emoji: '💎', min: 200000,   max: 999999 },
  { id: 'rich',        label: 'Rich',        emoji: '👑', min: 1000000,  max: 4999999 },
  { id: 'very_rich',   label: 'Very Rich',   emoji: '🏦', min: 5000000,  max: 20000000 }
];

export function getWealthTierForAmount(amount) {
  const val = Math.max(0, Number(amount) || 0);
  // Find matching tier
  const found = WEALTH_TIERS.find(t => val >= t.min && val <= t.max);
  // If above max, return top tier
  return found || WEALTH_TIERS[WEALTH_TIERS.length - 1];
}

// Deterministic-ish RNG similar to jobSystem
function hashStringToInt(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function makeRng(seed) {
  let state = Number.isFinite(seed) ? seed : hashStringToInt(seed);
  return function() {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePartnerWealth({ seed, age, estimatedIncome }) {
  const rng = makeRng(seed);
  
  const safeAge = Math.max(18, Math.min(99, Number(age) || 28));
  const income = Math.max(15000, Number(estimatedIncome) || 55000);

  // 1. Determine savings multiple based on age
  let minMult = 0.0, maxMult = 0.5;
  if (safeAge <= 25) { minMult = 0.0; maxMult = 0.8; }
  else if (safeAge <= 35) { minMult = 0.3; maxMult = 1.5; }
  else if (safeAge <= 45) { minMult = 0.8; maxMult = 2.8; }
  else if (safeAge <= 55) { minMult = 1.2; maxMult = 4.0; }
  else if (safeAge <= 65) { minMult = 1.5; maxMult = 5.0; }
  else { minMult = 1.0; maxMult = 4.0; } // 66+

  const mult = minMult + (rng() * (maxMult - minMult));
  let baseAmount = income * mult;

  // 2. Life event multipliers (rare windfalls)
  const eventRoll = rng();
  if (eventRoll < 0.005) { // 0.5% chance
    baseAmount *= 12; // Huge wealth
  } else if (eventRoll < 0.025) { // 2% chance (cumulative)
    baseAmount *= 6; // Big windfall
  } else if (eventRoll < 0.085) { // 6% chance (cumulative)
    baseAmount *= 2.5; // Inheritance/Business luck
  }

  // 3. Clamp
  let finalAmount = Math.max(0, Math.round(baseAmount));
  finalAmount = Math.min(finalAmount, 20000000); // Max 20M

  // 4. Convert to tier
  const tier = getWealthTierForAmount(finalAmount);

  return {
    amount: finalAmount,
    tierId: tier.id,
    label: tier.label,
    emoji: tier.emoji
  };
}

// Wealth vibe hints used in DatingProfileModal and elsewhere
const WEALTH_VIBE_LINES = {
  broke: [
    "Their wallet makes a sad little squeak when opened.",
    "They bring great vibes and… exactly $3.17 in coins.",
    "They treat 'savings' like it's a mythical creature.",
    "Their bank app opens with a warning label.",
    "They are rich in personality. Financially? A minimalist."
  ],
  struggling: [
    "They budget like a pro… because they have to.",
    "They can afford a treat. Just not two treats.",
    "Their financial plan is 'don’t look at the account balance.'",
    "They own a coupon folder and it’s low-key impressive.",
    "They say 'we’re fine' the way people say it in horror movies."
  ],
  stable: [
    "They pay their bills on time and sleep at night. Weird flex.",
    "They have a savings account. It’s not huge, but it exists.",
    "They can handle emergencies without instantly panicking.",
    "They own matching socks. Financial stability energy.",
    "They can say yes to brunch without doing math first."
  ],
  comfortable: [
    "They own furniture that wasn’t found on the sidewalk.",
    "They can impulse-buy guac. That’s power.",
    "They say ‘let’s take a weekend trip’ and actually mean it.",
    "Their place has candles that smell like ‘adult.’",
    "They have a ‘favorite’ credit card. That’s a vibe."
  ],
  wealthy: [
    "They talk about investments the way others talk about weather.",
    "Their dog probably has health insurance.",
    "They say ‘we should renovate’ like it’s a casual idea.",
    "They have 'a guy' for everything. Tires. Taxes. Vibes.",
    "They don’t check price tags. Price tags check them."
  ],
  rich: [
    "They say ‘private’ in front of nouns like it’s normal.",
    "Their hobby might be collecting other hobbies.",
    "They’ve never met a late fee personally.",
    "They could buy your childhood home and turn it into a coffee bar.",
    "They tip like they’re trying to heal the economy."
  ],
  very_rich: [
    "Their net worth has its own zip code energy.",
    "They say ‘my accountant’ like it’s a family member.",
    "They could accidentally buy a small island while sleepwalking.",
    "Their 'emergency fund' could fund your entire extended family.",
    "They don’t do retail therapy. They do retail ownership."
  ],
};

export function getWealthVibeHint(tierId) {
  const id = String(tierId || '').toLowerCase();
  const lines = WEALTH_VIBE_LINES[id] || [
    "Money vibes unclear. Could be rich… could be three raccoons in a trench coat."
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}