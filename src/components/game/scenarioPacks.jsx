// Scenario Packs - Content expansion system

export const SCENARIO_PACKS = [
  {
    id: "warm101_v1",
    name: "Core Moments (Warm 101)",
    description: "The default parenting moments pack.",
    choicePack: "standard",
    recommendedAges: "0–18",
    priceUsd: 0,
    defaultOwned: true,
    defaultEnabled: true,
    alwaysOn: true
  },
  {
    id: "pack_screen_time_v1",
    name: "Screen Time & Boundaries Pack",
    description: "Screens, transitions, limits, and digital routines — without the guilt spiral.",
    choicePack: "screen_time",
    recommendedAges: "0–18",
    priceUsd: 0,
    defaultOwned: true,
    defaultEnabled: true,
    alwaysOn: true,
    hidden: true
  },
  {
    id: "pack_sibling_rivalry_v1",
    name: "Sibling Rivalry Pack",
    description: "Fairness, jealousy, conflict, and repair between siblings (and you).",
    choicePack: "siblings",
    recommendedAges: "0–18",
    priceUsd: 4.99,
    defaultOwned: false,
    defaultEnabled: false,
    hidden: true,
    systemBoundToExpansion: "siblingRivalry"
  },
  {
    id: "pack_school_confidence_v1",
    name: "School Confidence & Anxiety Pack",
    description: "Drop-off fears, performance worry, friendship pressure — and small wins.",
    choicePack: "school_anxiety",
    recommendedAges: "3–18",
    priceUsd: 5.99,
    defaultOwned: true,
    defaultEnabled: false,
    defaultYearlyCheckinsEnabled: false
  },
  {
    id: "pack_teen_autonomy_v1",
    name: "Teen Autonomy Pack",
    description: "Privacy, values, curfews, trust, accountability — growing independence safely.",
    choicePack: "teen_autonomy",
    recommendedAges: "11–18",
    priceUsd: 5.99,
    defaultOwned: true,
    defaultEnabled: false,
    defaultYearlyCheckinsEnabled: false
  },
  {
    id: "pack_coparenting_v1",
    name: "Treaties & Truces: Co-Parenting Pack",
    description: "Aligned rules, conflict, inconsistency, and repair—whether you’re parenting in one home, two homes, or one very chaotic group chat.",
    choicePack: "coparent",
    recommendedAges: "0–18",
    priceUsd: 5.99,
    defaultOwned: true,
    defaultEnabled: false,
    defaultYearlyCheckinsEnabled: false
  },
  {
    id: "pack_modern_parenting_v1",
    name: "Modern Parenting Pack (Devices, Social, AI)",
    description: "From baby monitors and sharenting to group chats and AI at school — plus free AI Storytime/Coaching (1× per year, no focus cost).",
    choicePack: "modern_parenting",
    recommendedAges: "0–18",
    priceUsd: 6.99,
    defaultOwned: true,
    defaultEnabled: false,
    defaultYearlyCheckinsEnabled: false
  }
];

export const PACK_BUNDLES = [
  {
    id: "bundle_essentials_v1",
    name: "Essentials Bundle",
    description: "The most common modern parenting challenges.",
    packIds: ["pack_school_confidence_v1"],
    priceUsd: 9.99
  },
  {
    id: "bundle_complete_v1",
    name: "Complete Bundle",
    description: "All optional packs.",
    packIds: [
      "pack_school_confidence_v1",
      "pack_teen_autonomy_v1",
      "pack_coparenting_v1",
      "pack_modern_parenting_v1"
    ],
    priceUsd: 17.99
  }
];

// Helper functions
export const getAllPackIds = () => SCENARIO_PACKS.map(p => p.id);

export const getOptionalPacks = () => SCENARIO_PACKS.filter(p => !p.alwaysOn);

export const getDefaultOwnedPackIds = () => SCENARIO_PACKS.filter(p => p.defaultOwned).map(p => p.id);

export const getDefaultEnabledPackIds = () => SCENARIO_PACKS.filter(p => p.defaultEnabled).map(p => p.id);

export const getPackById = (id) => SCENARIO_PACKS.find(p => p.id === id) || null;