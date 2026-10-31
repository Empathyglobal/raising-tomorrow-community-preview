// Quality of Life Configuration
// Tiers, Subscriptions, and QoL upgrades

// Focus bonus cap from QoL systems
export const QOL_FOCUS_BONUS_CAP = 4;

// Tier definitions
export const QOL_TIER_DEFS = {
  internet: {
    defaultId: 'basic',
    category: 'utilities',
    options: [
      { 
        id: 'basic', 
        label: 'Basic Internet', 
        emoji: '📶', 
        yearlyCostBase: 0, 
        focusMod: 0, 
        stressDrift: 0.00,
        note: 'Included in housing. Works… eventually.'
      },
      { 
        id: 'fast', 
        label: 'Fast Internet', 
        emoji: '⚡', 
        yearlyCostBase: 300, 
        focusMod: 1, 
        stressDrift: -0.05,
        note: 'Actual bandwidth. Fewer rage-resets.'
      },
      { 
        id: 'fiber', 
        label: 'Fiber Internet', 
        emoji: '🚀', 
        yearlyCostBase: 900, 
        focusMod: 1, 
        stressDrift: -0.10, 
        fameDeltaPerAge: 1,
        note: 'Instant everything. Minor local fame for being That House.'
      }
    ]
  },
  homeOffice: {
    defaultId: 'none',
    category: 'utilities',
    options: [
      { 
        id: 'none', 
        label: 'No Home Office', 
        emoji: '🪑', 
        yearlyCostBase: 0, 
        focusMod: 0, 
        stressDrift: 0.00,
        note: 'Kitchen table is fine. (It\'s not fine.)'
      },
      { 
        id: 'basic', 
        label: 'Basic Home Office', 
        emoji: '💻', 
        yearlyCostBase: 600, 
        focusMod: 1, 
        stressDrift: -0.05,
        note: 'A desk and a door. Productivity unlocked.'
      },
      { 
        id: 'pro', 
        label: 'Pro Home Office', 
        emoji: '🖥️', 
        yearlyCostBase: 1500, 
        focusMod: 2, 
        stressDrift: -0.10,
        note: 'Ergonomic everything. You work like a person with choices.'
      }
    ]
  },
  clothing: {
    defaultId: 'mall',
    category: 'personal',
    options: [
      {
        id: 'thrift',
        label: 'Thrift Store',
        emoji: '👕',
        yearlyCostBase: 180,
        focusMod: 0,
        stressDrift: 0.02,
        note: 'Treasure hunting. Sometimes you find gold. Sometimes you find… someone else\'s gym shorts.'
      },
      {
        id: 'surplus',
        label: 'Military Surplus',
        emoji: '🪖',
        yearlyCostBase: 200,
        focusMod: 0,
        stressDrift: 0.01,
        note: 'Functional. Durable. Aggressively tactical for grocery runs.'
      },
      {
        id: 'outlet',
        label: 'Outlet Mall',
        emoji: '🏬',
        yearlyCostBase: 350,
        focusMod: 0,
        stressDrift: 0.00,
        note: 'Last season\'s styles at almost-reasonable prices.'
      },
      {
        id: 'mall',
        label: 'Regular Mall',
        emoji: '🛍️',
        yearlyCostBase: 600,
        focusMod: 0,
        stressDrift: 0.00,
        note: 'Standard retail. You know exactly what you\'re getting.'
      },
      {
        id: 'online',
        label: 'Online Basics',
        emoji: '📦',
        yearlyCostBase: 450,
        focusMod: 0,
        stressDrift: -0.01,
        note: 'Free shipping. Predictable fits. Zero human interaction required.'
      },
      {
        id: 'topend',
        label: 'Top End',
        emoji: '💎',
        yearlyCostBase: 1400,
        focusMod: 0,
        stressDrift: -0.03,
        note: 'Tailored confidence. Expensive fabric. You walk into rooms like you own the building.'
      }
    ]
  }
};

// Helper: get tier option by ID with fallback
export function getTierOption(tierDef, id) {
  const option = tierDef.options.find(o => o.id === id);
  const defaultOption = tierDef.options.find(o => o.id === tierDef.defaultId);
  return option || defaultOption || tierDef.options[0];
}

// Subscription/Commitment definitions (consolidated)
export const QOL_SUBSCRIPTIONS = {
  afterSchoolCare: {
    id: 'afterSchoolCare',
    emoji: '🏫',
    label: 'After-School Care',
    cost: 3000,
    category: 'childcare',
    focusMod: 1,
    stressDrift: -0.35,
    childDeltas: { responsibility: 0.2, happiness: 0.1 },
    minChildAge: 5, // SCHOOL_START_AGE
    maxChildAge: 12,
    detail: 'Professional care until 6pm. Focus +1, Stress -0.35, child gains responsibility & happiness.'
  },
  cleaningHelp: {
    id: 'cleaningHelp',
    emoji: '🧹',
    label: 'Cleaning Service',
    cost: 2400,
    category: 'services',
    focusMod: 1,
    stressDrift: -0.30,
    childDeltas: { responsibility: 0.1 },
    detail: 'Bi-weekly cleaning. Focus +1, Stress -0.30. Your brain gets space back.'
  },
  mealKits: {
    id: 'mealKits',
    emoji: '🥗',
    label: 'Meal Kit Delivery',
    cost: 1800,
    category: 'food',
    focusMod: 1,
    stressDrift: -0.15,
    childDeltas: { health: 0.1, happiness: 0.1 },
    detail: 'Healthy ingredients delivered. Focus +1, Stress -0.15. Less planning, less shopping.'
  },
  nanny: {
    id: 'nanny',
    emoji: '🧑‍🍼',
    label: 'Nanny',
    cost: 6000,
    category: 'childcare',
    focusMod: 2,
    stressDrift: -0.60,
    childDeltas: { confidence: 0.2, responsibility: 0.1 },
    minChildAge: 0,
    maxChildAge: 4,
    detail: 'Full coverage help. Focus +2, Stress -0.60. Expensive, but your brain returns to your body.'
  },
  groceryDelivery: {
    id: 'groceryDelivery',
    emoji: '🛒',
    label: 'Grocery Delivery',
    cost: 800,
    category: 'food',
    focusMod: 1,
    stressDrift: -0.05,
    detail: 'Less time in aisles. Focus +1, Stress -0.05. More time not losing your mind.'
  },
  laundryService: {
    id: 'laundryService',
    emoji: '🧺',
    label: 'Laundry Service',
    cost: 900,
    category: 'services',
    focusMod: 1,
    stressDrift: -0.10,
    detail: 'Outsource the sock apocalypse. Focus +1, Stress -0.10.'
  },
  therapyMembership: {
    id: 'therapyMembership',
    emoji: '🛋️',
    label: 'Therapy Membership',
    cost: 1400,
    category: 'health',
    focusMod: 0,
    stressDrift: -0.45,
    loveDelta: 0.2,
    childDeltas: { empathy: 0.2 },
    detail: 'You get tools. You use them. Sometimes. Stress -0.45, Love +0.2/yr.'
  },
  gymMembership: {
    id: 'gymMembership',
    emoji: '🏋️',
    label: 'Gym Membership',
    cost: 600,
    category: 'health',
    focusMod: 0,
    stressDrift: -0.20,
    playerHealthDrift: 1.0,
    detail: 'Health goes up. Motivation goes… intermittently up. Health +1.0/yr, Stress -0.20.'
  },
  streamingBundle: {
    id: 'streamingBundle',
    emoji: '📺',
    label: 'Streaming Bundle',
    cost: 240,
    category: 'leisure',
    focusMod: 0,
    stressDrift: -0.10,
    childDeltas: { happiness: 0.1 },
    detail: 'Family movie night becomes a default setting. Stress -0.10, child happiness +0.1/yr.'
  },
  homeSecurity: {
    id: 'homeSecurity',
    emoji: '🔒',
    label: 'Home Security',
    cost: 500,
    category: 'housing',
    focusMod: 0,
    stressDrift: -0.15,
    detail: 'You sleep… slightly more like a person. Stress -0.15/yr.'
  },
  plasticFreeHome: {
    id: 'plasticFreeHome',
    emoji: '🌱',
    label: 'Plastic‑Free Home',
    cost: 350,
    category: 'home',
    focusMod: 0,
    stressDrift: -0.08,
    playerHealthDrift: 0.3,
    detail: 'Glass, bamboo, and a subtle superiority complex. Health +0.3/yr, Stress -0.08/yr.'
  },
  nonToxicKitchen: {
    id: 'nonToxicKitchen',
    emoji: '🍳',
    label: 'No‑Teflon / Non‑Toxic Kitchen',
    cost: 420,
    category: 'home',
    focusMod: 0,
    stressDrift: -0.05,
    playerHealthDrift: 0.4,
    detail: 'Cast iron, stainless steel, and zero forever chemicals. Health +0.4/yr, Stress -0.05/yr.'
  },
  waterFilter: {
    id: 'waterFilter',
    emoji: '💧',
    label: 'Whole‑Home Water Filter',
    cost: 300,
    category: 'home',
    focusMod: 0,
    stressDrift: -0.03,
    playerHealthDrift: 0.25,
    childDeltas: { health: 0.1 },
    detail: 'Clean water from every tap. Health +0.25/yr (you), +0.1/yr (child), Stress -0.03/yr.'
  },
  airPurifiers: {
    id: 'airPurifiers',
    emoji: '🌬️',
    label: 'HEPA Air Purifiers',
    cost: 280,
    category: 'home',
    focusMod: 0,
    stressDrift: -0.06,
    playerHealthDrift: 0.2,
    childDeltas: { health: 0.1 },
    detail: 'Filtered air, fewer allergens. Health +0.2/yr (you), +0.1/yr (child), Stress -0.06/yr.'
  },
  fragranceFree: {
    id: 'fragranceFree',
    emoji: '🧴',
    label: 'Fragrance‑Free Cleaning',
    cost: 220,
    category: 'home',
    focusMod: 0,
    stressDrift: -0.04,
    playerHealthDrift: 0.15,
    detail: 'No synthetic scents. No headaches. Health +0.15/yr, Stress -0.04/yr.'
  }
};

// Helper: check if subscription is valid for given age
export function isSubscriptionValidForAge(def, age, gameState) {
  if (!def) return false;
  const a = Number(age || 0);
  
  // Check min/max child age if specified
  if (typeof def.minChildAge === 'number' && a < def.minChildAge) return false;
  if (typeof def.maxChildAge === 'number' && a > def.maxChildAge) return false;
  
  return true;
}

// Get list of active valid subscriptions
export function getActiveSubscriptions(gameState, age) {
  const commitments = gameState?.commitments || {};
  const active = [];
  
  for (const [id, enabled] of Object.entries(commitments)) {
    if (!enabled) continue;
    const def = QOL_SUBSCRIPTIONS[id];
    if (!def) continue;
    if (!isSubscriptionValidForAge(def, age, gameState)) continue;
    active.push(def);
  }
  
  return active;
}

// Compute total QoL focus bonus (capped)
export function computeQoLFocusBonus(gameState, targetAge) {
  const age = Number(targetAge || gameState?.currentYear || 0);
  
  // Subscriptions
  const subscriptions = getActiveSubscriptions(gameState, age);
  const subsFocus = subscriptions.reduce((sum, def) => sum + (def.focusMod || 0), 0);
  
  // Tiers
  const qol = gameState?.qol || {};
  const internetTier = getTierOption(QOL_TIER_DEFS.internet, qol.internetTier || 'basic');
  const homeOfficeTier = getTierOption(QOL_TIER_DEFS.homeOffice, qol.homeOfficeTier || 'none');
  
  const tierFocus = (internetTier.focusMod || 0) + (homeOfficeTier.focusMod || 0);
  
  const total = subsFocus + tierFocus;
  return Math.max(-4, Math.min(QOL_FOCUS_BONUS_CAP, total));
}