export const WISDOM_LENSES = [
  {
    id: "mindfulness",
    emoji: "🧘",
    name: "Mindfulness",
    short: "Notice → pause → respond",
    tiers: [
      { tier: 0, xp: 0,  label: "Curious Beginner", unlocks: [] },
      { tier: 1, xp: 3,  label: "Steady Attention", unlocks: ["pause_button", "stress_gate_soften_1"] },
      { tier: 2, xp: 7,  label: "Embodied Presence", unlocks: ["vipassana_action", "stress_gate_soften_2"] },
      { tier: 3, xp: 12, label: "Deep Practice", unlocks: ["pause_stronger"] }
    ]
  },
  {
    id: "impermanence",
    emoji: "🌊",
    name: "Impermanence",
    short: "This will pass",
    tiers: [
      { tier: 0, xp: 0,  label: "Noticing Change", unlocks: [] },
      { tier: 1, xp: 3,  label: "Letting Go", unlocks: ["scenario_reroll_1"] },
      { tier: 2, xp: 7,  label: "Flexible Mind", unlocks: ["scenario_reroll_2"] },
      { tier: 3, xp: 12, label: "Non-Clinging", unlocks: ["reroll_stronger", "small_stress_buffer"] }
    ]
  },
  {
    id: "compassion",
    emoji: "💛",
    name: "Compassion",
    short: "Warmth + repair",
    tiers: [
      { tier: 0, xp: 0,  label: "Good Intentions", unlocks: [] },
      { tier: 1, xp: 3,  label: "Kind Presence", unlocks: ["bonus_love_on_connect_1"] },
      { tier: 2, xp: 7,  label: "Repair Skills", unlocks: ["extra_scenario_choice_repair"] },
      { tier: 3, xp: 12, label: "Deep Compassion", unlocks: ["bonus_love_on_connect_2"] }
    ]
  }
];

export function getWisdomTier(lensId, xpMap = {}) {
  const lens = WISDOM_LENSES.find(l => l.id === lensId);
  if (!lens) return 0;
  const xp = xpMap[lensId] || 0;
  
  let currentTier = 0;
  for (const tierInfo of lens.tiers) {
    if (xp >= tierInfo.xp) {
      currentTier = tierInfo.tier;
    } else {
      break;
    }
  }
  return currentTier;
}

export function getTierInfo(lensId, xpMap = {}) {
  const lens = WISDOM_LENSES.find(l => l.id === lensId);
  if (!lens) return lens.tiers[0];
  const tier = getWisdomTier(lensId, xpMap);
  return lens.tiers.find(t => t.tier === tier) || lens.tiers[0];
}

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const normalize = (value, min, max) => (value - min) / (max - min);