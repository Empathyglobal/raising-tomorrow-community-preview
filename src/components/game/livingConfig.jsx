// Cost of Living Configuration
// Food, Housing, and Commute options with recurring costs and effects

export const DEFAULT_LIVING_SETUP = { 
  housingId: 'apartment_basic', 
  commuteId: 'bus',
  foodStrategyId: 'standard'
};

// Helper: Auto-select living setup based on income tier (for onboarding)
export function autoSelectLivingSetup(gameState) {
  const tier = (gameState?.incomeTier || 'medium').toLowerCase();
  
  let housingId = 'apartment_basic';
  let commuteId = 'bus';
  let reason = 'Auto-selected from income tier';

  if (tier === 'low') {
    housingId = 'shared_room';
    commuteId = 'bus';
    reason = 'Auto-selected (Low Income)';
  } else if (tier === 'medium') {
    housingId = 'apartment_basic';
    commuteId = 'bus';
    reason = 'Auto-selected (Medium Income)';
  } else if (tier === 'high') {
    housingId = 'family_home_rent';
    commuteId = 'bus';
    reason = 'Auto-selected (High Income)';
  } else if (tier === 'wealthy' || tier === 'rich') {
    housingId = 'family_home_rent';
    commuteId = 'rideshare';
    reason = 'Auto-selected (Wealthy)';
  }

  return { housingId, commuteId, reason };
}

export const FOOD_STRATEGIES = [
  {
    id: 'standard',
    label: 'Standard Groceries',
    emoji: '🍽️',
    costMult: 1.00,
    focusMod: 0,
    stressDrift: 0.0,
    playerHealthDrift: 0.0,
    childDeltas: {},
    note: 'Baseline cost.'
  },
  {
    id: 'healthy_home_cooked',
    label: 'Healthy Home-Cooked',
    emoji: '🥗',
    costMult: 0.90,
    focusMod: -1,
    stressDrift: -0.05,
    playerHealthDrift: +0.6,
    childDeltas: { health: +0.2, discipline: +0.1 },
    note: 'Cheaper than eating out, but it takes time.'
  },
  {
    id: 'organic_premium',
    label: 'Organic / Premium Diet',
    emoji: '🥬',
    costMult: 1.35,
    focusMod: 0,
    stressDrift: -0.05,
    playerHealthDrift: +0.4,
    childDeltas: { health: +0.2, happiness: +0.1 },
    note: 'Higher cost, small health upside.'
  },
  {
    id: 'vegetarian',
    label: 'Vegetarian Diet',
    emoji: '🥕',
    costMult: 0.85,
    focusMod: 0,
    stressDrift: 0.0,
    playerHealthDrift: +0.2,
    childDeltas: { health: +0.1 },
    note: 'Often a bit cheaper, generally healthy.'
  },
  {
    id: 'carnivore',
    label: 'All-Carnivore Diet',
    emoji: '🥩',
    costMult: 1.15,
    focusMod: 0,
    stressDrift: 0.0,
    playerHealthDrift: -0.2,
    childDeltas: {},
    note: 'Higher cost. Mixed health impact.'
  },
  {
    id: 'ultra_processed',
    label: 'Ultra-Processed / Cheapest Convenience',
    emoji: '🍟',
    costMult: 0.65,
    focusMod: 0,
    stressDrift: -0.03,
    playerHealthDrift: -0.9,
    childDeltas: { health: -0.3, happiness: -0.1 },
    note: 'Low cost, low nutrition.'
  },
  {
    id: 'food_bank_regular',
    label: 'Food Banks + Pantry Staples',
    emoji: '🥫',
    costMult: 0.50,
    focusMod: -1,
    stressDrift: +0.15,
    playerHealthDrift: -0.2,
    childDeltas: { happiness: -0.1 },
    note: 'Saves money, costs time and paperwork energy.'
  },
  {
    id: 'food_bank_heavy',
    label: 'Mostly Food Banks (Tight Budget)',
    emoji: '🧺',
    costMult: 0.20,
    focusMod: -1,
    stressDrift: +0.35,
    playerHealthDrift: -0.5,
    childDeltas: { health: -0.2, happiness: -0.15, confidence: -0.1 },
    note: 'Big savings. Noticeable strain.'
  },
  {
    id: 'survival_mode_food',
    label: 'Survival Mode: Cheapest Possible + Food Banks',
    emoji: '🆘',
    costMult: 0.05,
    focusMod: -2,
    stressDrift: +0.70,
    playerHealthDrift: -1.2,
    childDeltas: { health: -0.5, happiness: -0.35, confidence: -0.2 },
    note: 'Near-zero food cost. High time + health tradeoff.'
  }
];

export function getFoodStrategyById(id) {
  return FOOD_STRATEGIES.find(f => f.id === id) || FOOD_STRATEGIES[0];
}

// Base food costs (before country scaling)
export const FOOD_COSTS_BASE = {
  adult: 750,
  child: 500,
  infantAddon: 250  // extra cost for kids age 0-2
};

// Housing options (4 choices)
// Reserved IDs for dynamic options
const RESERVED_HOUSING_IDS = new Set(['owned_home']);
const RESERVED_COMMUTE_IDS = new Set(['car', 'motorcycle', 'horse_mount', 'unicorn_mount', 'dragon_mount']);

export const HOUSING_OPTIONS = [
  {
    id: 'tent',
    label: 'Tent / Shelter',
    emoji: '⛺',
    yearlyCostBase: 250,
    focusMod: -1,
    stressDrift: 1.0,
    childDeltas: { health: -0.4, happiness: -0.3, confidence: -0.2 },
    note: 'Cheap, unstable, exhausting.'
  },
  {
    id: 'shared_room',
    label: 'Shared Room / Couch',
    emoji: '🛋️',
    yearlyCostBase: 1100,
    focusMod: 0,
    stressDrift: 0.4,
    childDeltas: { confidence: -0.1, happiness: -0.1 },
    note: 'Affordable, but privacy is… a concept.'
  },
  {
    id: 'apartment_basic',
    label: 'Small Apartment (Renting)',
    emoji: '🏠',
    yearlyCostBase: 2300,
    focusMod: 0,
    stressDrift: 0.0,
    childDeltas: { confidence: 0.1 },
    note: 'Stable enough to breathe.'
  },
  {
    id: 'family_home_rent',
    label: 'Family Home (Renting)',
    emoji: '🏡',
    yearlyCostBase: 3800,
    focusMod: 1,
    stressDrift: -0.3,
    childDeltas: { health: 0.2, confidence: 0.2, happiness: 0.1 },
    note: 'More space, calmer routines.'
  }
];

// Commute options (4 choices)
export const COMMUTE_OPTIONS = [
  {
    id: 'walk',
    label: 'Walk',
    emoji: '🚶',
    yearlyCostBase: 0,
    focusMod: -1,
    stressDrift: 0.2,
    playerHealthDrift: 0.8,
    childDeltas: { happiness: -0.1 },
    note: 'Free, but time-expensive.'
  },
  {
    id: 'bike',
    label: 'Bicycle',
    emoji: '🚴',
    yearlyCostBase: 80,
    focusMod: -1,
    stressDrift: 0.3,
    playerHealthDrift: 1.0,
    childDeltas: { happiness: -0.1 },
    note: 'Healthy, but tiring and weather-dependent.'
  },
  {
    id: 'bus',
    label: 'Bus / Transit',
    emoji: '🚌',
    yearlyCostBase: 250,
    focusMod: 0,
    stressDrift: 0.1,
    playerHealthDrift: 0.0,
    childDeltas: {},
    note: 'Reasonable cost, moderate stress.'
  },
  {
    id: 'rideshare',
    label: 'Rideshare / Taxi',
    emoji: '🚗',
    yearlyCostBase: 900,
    focusMod: 1,
    stressDrift: -0.2,
    playerHealthDrift: 0.0,
    childDeltas: { happiness: 0.1 },
    note: 'Convenient, but expensive.'
  }
];

// Helper functions
export function getHousingById(id) {
  return HOUSING_OPTIONS.find(h => h.id === id) || HOUSING_OPTIONS[2]; // Default: apartment_basic
}

export function getCommuteById(id) {
  return COMMUTE_OPTIONS.find(c => c.id === id) || COMMUTE_OPTIONS[2]; // Default: bus
}

export function mergeDeltas(a, b) {
  const result = { ...(a || {}) };
  Object.entries(b || {}).forEach(([k, v]) => {
    result[k] = (result[k] || 0) + v;
  });
  return result;
}

// Helper: Get owned home item
export function getOwnedHomeItem(gameState) {
  const items = gameState?.inventory?.items || [];
  return items.find(i => i.uniqueGroup === 'home') || null;
}

// Helper: Get primary residence property from Real Estate
export function getPrimaryResidenceProperty(gameState) {
  const realEstate = gameState?.realEstate;
  const primaryId = realEstate?.primaryResidencePropertyId;
  if (!primaryId) return null;
  
  const properties = Array.isArray(realEstate?.properties) ? realEstate.properties : [];
  return properties.find(p => p.id === primaryId) || null;
}

// Helper: Get owned car item
export function getOwnedCarItem(gameState) {
  const items = gameState?.inventory?.items || [];
  return items.find(i => i.uniqueGroup === 'car') || null;
}

// Helper: Get owned motorcycle item
export function getOwnedMotorcycleItem(gameState) {
  const items = gameState?.inventory?.items || [];
  return items.find(i => i.uniqueGroup === 'motorcycle') || null;
}

// Helper: Get owned RV item
export function getOwnedRvItem(gameState) {
  const items = gameState?.inventory?.items || [];
  return items.find(i => i.uniqueGroup === 'rv') || null;
}

// Helper: Check if player has a specific pet species alive
export function hasPetSpecies(gameState, speciesKey) {
  const pets = gameState?.pets || [];
  return pets.some(p => p.speciesKey === speciesKey && !p.isDeceased);
}

// Resolve housing with fallback for invalid/stale IDs
export function resolveHousingForState(gameState, housingId) {
  if (housingId === 'owned_rv') {
    const rv = getOwnedRvItem(gameState);
    if (!rv) {
      return getHousingById('apartment_basic');
    }

    const rvId = rv.id || rv.itemId || '';
    let yearlyCostBase = 1600;
    let focusMod = 0;
    let stressDrift = -0.15;
    let childDeltas = { confidence: 0.1, happiness: 0.1 };

    if (rvId === 'vehicle_camper_van') {
      yearlyCostBase = 1400;
      focusMod = 0;
      stressDrift = -0.05;
      childDeltas = { confidence: 0.1, happiness: 0.1, discipline: -0.1 };
    } else if (rvId === 'vehicle_rv') {
      yearlyCostBase = 1900;
      focusMod = 1;
      stressDrift = -0.25;
      childDeltas = { confidence: 0.2, happiness: 0.15 };
    } else if (rvId === 'vehicle_grand_rv') {
      yearlyCostBase = 2400;
      focusMod = 2;
      stressDrift = -0.35;
      childDeltas = { confidence: 0.2, happiness: 0.2, health: 0.1 };
    }

    return {
      id: 'owned_rv',
      label: `Live in ${rv.name || 'your RV'}`,
      emoji: rv.emoji || '🚐',
      yearlyCostBase,
      focusMod,
      stressDrift,
      childDeltas,
      note: 'Campground fees, parking, maintenance'
    };
  }
  
  if (housingId === 'owned_home') {
    // Check primary residence first (Real Estate system)
    const primaryProp = getPrimaryResidenceProperty(gameState);
    if (primaryProp) {
      const value = Number(primaryProp.currentValue ?? primaryProp.purchasePrice) || 0;
      const condition = Number(primaryProp.condition ?? 75);
      
      // Scale benefits by value and condition
      let focusMod = 0;
      let stressDrift = -0.2;
      let childDeltas = {};
      
      if (value >= 800000) {
        focusMod = 2;
        stressDrift = -0.5;
        childDeltas = { confidence: 0.15, happiness: 0.1 };
      } else if (value >= 400000) {
        focusMod = 1;
        stressDrift = -0.35;
        childDeltas = { confidence: 0.1 };
      } else if (value >= 200000) {
        focusMod = 1;
        stressDrift = -0.25;
        childDeltas = {};
      } else {
        focusMod = 0;
        stressDrift = -0.15;
        childDeltas = {};
      }
      
      // Condition penalty
      if (condition < 50) {
        stressDrift += 0.15;
      } else if (condition < 70) {
        stressDrift += 0.05;
      }
      
      return {
        id: 'owned_home',
        label: `Live in ${primaryProp.name || 'your property'}`,
        emoji: primaryProp.emoji || '🏠',
        yearlyCostBase: 0,
        focusMod,
        stressDrift,
        childDeltas,
        note: 'Expenses handled in Real Estate (tax, maintenance, mortgage)'
      };
    }
    
    // Fallback to inventory home
    const homeItem = getOwnedHomeItem(gameState);
    if (!homeItem) {
      // Fallback to apartment_basic if no owned home
      return getHousingById('apartment_basic');
    }
    
    // Compute owned home option based on home item ID
    const homeId = homeItem.id || homeItem.itemId || '';
    let yearlyCostBase = 1800;
    let focusMod = 1;
    let stressDrift = -0.3;
    
    if (homeId === 'home_starter') {
      yearlyCostBase = 1200;
      focusMod = 0;
      stressDrift = -0.2;
    } else if (homeId === 'home_family') {
      yearlyCostBase = 1800;
      focusMod = 1;
      stressDrift = -0.4;
    } else if (homeId === 'home_estate') {
      yearlyCostBase = 2600;
      focusMod = 2;
      stressDrift = -0.6;
    }
    
    return {
      id: 'owned_home',
      label: `Use Your Home (${homeItem.name || 'Property'})`,
      emoji: homeItem.emoji || '🏡',
      yearlyCostBase,
      focusMod,
      stressDrift,
      note: 'Tax, maintenance & repairs',
      childDeltas: {}
    };
  }
  
  // Regular rental housing
  return getHousingById(housingId);
}

// Resolve commute with fallback for invalid/stale IDs
export function resolveCommuteForState(gameState, commuteId) {
  // Pet mount commutes
  if (commuteId === 'horse_mount' && !hasPetSpecies(gameState, 'horse')) {
    return getCommuteById('bus');
  }
  if (commuteId === 'unicorn_mount' && !hasPetSpecies(gameState, 'unicorn')) {
    return getCommuteById('bus');
  }
  if (commuteId === 'dragon_mount' && !hasPetSpecies(gameState, 'dragon')) {
    return getCommuteById('bus');
  }
  
  // Vehicle commutes
  if (commuteId === 'car' && !getOwnedCarItem(gameState)) {
    return getCommuteById('bus');
  }
  if (commuteId === 'motorcycle' && !getOwnedMotorcycleItem(gameState)) {
    return getCommuteById('bus');
  }
  
  // Handle pet mounts
  if (commuteId === 'horse_mount') {
    return {
      id: 'horse_mount',
      label: 'Horse Mount',
      emoji: '🐴',
      yearlyCostBase: 0,
      focusMod: -1,
      stressDrift: 0.2,
      note: 'Majestic commute. Builds local fame.',
      fameDeltaPerAge: 1,
      childDeltas: {}
    };
  }
  if (commuteId === 'unicorn_mount') {
    return {
      id: 'unicorn_mount',
      label: 'Unicorn Mount',
      emoji: '🦄',
      yearlyCostBase: 0,
      focusMod: -1,
      stressDrift: 0.1,
      note: 'Magical commute. Major fame gains.',
      fameDeltaPerAge: 8,
      childDeltas: {}
    };
  }
  if (commuteId === 'dragon_mount') {
    return {
      id: 'dragon_mount',
      label: 'Dragon Mount',
      emoji: '🐉',
      yearlyCostBase: 0,
      focusMod: -1,
      stressDrift: 0.6,
      note: 'Epic commute. Legendary fame.',
      fameDeltaPerAge: 20,
      childDeltas: {}
    };
  }
  
  // Handle owned vehicles
  if (commuteId === 'car') {
    const carItem = getOwnedCarItem(gameState);
    
    return {
      id: 'car',
      label: `Use Your Car (${carItem?.name || 'Owned'})`,
      emoji: '🚗',
      // Vehicle upkeep is already charged via inventory passive costs.
      // Using an owned vehicle should REMOVE rental/ride-share costs, not double-charge.
      yearlyCostBase: 0,
      focusMod: 1,
      // Stress benefit is also handled by the vehicle's inventory passive (if any).
      stressDrift: 0,
      note: 'No rental cost. Upkeep handled in Item Upkeep.',
      fameDeltaPerAge: 0,
      childDeltas: {}
    };
  }
  
  if (commuteId === 'motorcycle') {
    const motoItem = getOwnedMotorcycleItem(gameState);
    return {
      id: 'motorcycle',
      label: `Motorcycle (${motoItem?.name || 'Owned'})`,
      emoji: '🏍️',
      // Vehicle upkeep is already charged via inventory passive costs.
      yearlyCostBase: 0,
      focusMod: 0,
      stressDrift: 0,
      note: 'No rental cost. Upkeep handled in Item Upkeep.',
      fameDeltaPerAge: 0,
      childDeltas: {}
    };
  }
  
  // Regular commute options
  return getCommuteById(commuteId);
}

// Build UI choice list for housing (includes owned home if applicable)
export function getHousingChoicesForUi(gameState) {
  const choices = [...HOUSING_OPTIONS];
  
  const primaryProp = getPrimaryResidenceProperty(gameState);
  const homeItem = getOwnedHomeItem(gameState);
  
  if (primaryProp || homeItem) {
    const ownedOption = resolveHousingForState(gameState, 'owned_home');
    choices.push(ownedOption);
  } else {
    // Check if player owns real estate properties but hasn't set primary
    const hasProperties = (gameState?.realEstate?.properties?.length || 0) > 0;
    
    // Always show the "Use your home" option in QoL UI (locked until player owns a home).
    choices.push({
      id: 'owned_home',
      label: 'Use Your Home',
      emoji: '🏡',
      yearlyCostBase: 0,
      focusMod: 0,
      stressDrift: 0,
      childDeltas: {},
      note: hasProperties ? 'Set a primary residence first.' : 'Buy a home in the Shop to unlock.',
      locked: true,
      lockedReason: hasProperties 
        ? 'Set a primary residence (Life → Shopping → Housing)' 
        : 'Requires an owned home (Shop → Gear)'
    });
  }

  const rvItem = getOwnedRvItem(gameState);
  if (rvItem) {
    const rvOption = resolveHousingForState(gameState, 'owned_rv');
    choices.push(rvOption);
  }
  
  return choices;
}

// Build UI choice list for commute (includes vehicles & mounts if applicable)
export function getCommuteChoicesForUi(gameState) {
  const choices = [...COMMUTE_OPTIONS];
  
  // Add owned car
  const carItem = getOwnedCarItem(gameState);
  if (carItem) {
    const carOption = resolveCommuteForState(gameState, 'car');
    choices.push(carOption);
  } else {
    // Always show the "Use your car" option in QoL UI (locked until player owns a car).
    choices.push({
      id: 'car',
      label: 'Use Your Car',
      emoji: '🚗',
      yearlyCostBase: 0,
      focusMod: 1,
      stressDrift: 0,
      fameDeltaPerAge: 0,
      childDeltas: {},
      note: 'Buy a car in the Shop to unlock.',
      locked: true,
      lockedReason: 'Requires an owned car (Shop → Vehicles)'
    });
  }
  
  // Add owned motorcycle
  const motoItem = getOwnedMotorcycleItem(gameState);
  if (motoItem) {
    const motoOption = resolveCommuteForState(gameState, 'motorcycle');
    choices.push(motoOption);
  }
  
  // Add pet mounts
  if (hasPetSpecies(gameState, 'horse')) {
    choices.push(resolveCommuteForState(gameState, 'horse_mount'));
  }
  if (hasPetSpecies(gameState, 'unicorn')) {
    choices.push(resolveCommuteForState(gameState, 'unicorn_mount'));
  }
  if (hasPetSpecies(gameState, 'dragon')) {
    choices.push(resolveCommuteForState(gameState, 'dragon_mount'));
  }
  
  return choices;
}