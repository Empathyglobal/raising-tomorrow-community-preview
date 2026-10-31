// Natural Disaster Pop-up System
//
// Design goals:
// - Rare in normal mode: ~1 every 15–20 years
// - More frequent in Chaos Mode:
//   L1: ~1 every 8 years
//   L2: ~1 every 5 years
//   L3: ~1 every 3 years
// - Always offers an obvious hands-on option that can benefit the child.
//
// This system intentionally prioritizes gameplay + parenting moments over
// strict geophysical realism.

import { getChaosLevelFromExpansions } from './chaosModeLevels';
import { COUNTRIES } from './countriesData';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

function getCountryName(iso3) {
  const code = String(iso3 || 'USA').toUpperCase();
  const c = (Array.isArray(COUNTRIES) ? COUNTRIES : []).find(x => x?.iso3 === code);
  return c?.name || code;
}

function hasChildInRun(state) {
  // Defensive: different parts of the app use different flags for child-free mode.
  return state?.hasChild !== false && state?.childless !== true;
}

function getAgeBand(age) {
  const a = toNum(age, 0);
  if (a <= 3) return 'tiny';
  if (a <= 6) return 'little';
  if (a <= 12) return 'kid';
  if (a <= 17) return 'teen';
  return 'adult';
}

function meanYearsForChaosLevel(level) {
  const l = Math.max(0, Math.min(3, Math.round(toNum(level, 0))));
  if (l === 1) return 8;
  if (l === 2) return 5;
  if (l === 3) return 3;
  // Normal mode (rare): ~1 every 15–20 years → mean 17.5
  return 17.5;
}

export function getNaturalDisasterAnnualChance(state) {
  const chaosLevel = getChaosLevelFromExpansions(state?.expansions || {});
  const mean = meanYearsForChaosLevel(chaosLevel);
  return 1 / Math.max(1, mean);
}

export function shouldRollNaturalDisaster(state) {
  const age = toNum(state?.currentYear, 0);
  // Avoid Year 0 for this system (keeps the opening clean)
  if (age < 1) return false;

  // Already processed this year?
  const lastProcessed = state?.naturalDisaster?.lastProcessedYear;
  if (lastProcessed === age) return false;

  // Still pending from earlier (shouldn't happen, but be safe)
  if (state?.naturalDisaster?.pending) return false;

  return true;
}

function computeWealthBaseline(state) {
  const cash = Math.max(0, toNum(state?.money, 0));
  const annualIncome = toNum(state?.playerCareer?.yearlyIncome, 0);

  const homeValue = (() => {
    const items = Array.isArray(state?.inventory?.items) ? state.inventory.items : [];
    const ownedHome = items.find(i => i?.uniqueGroup === 'home');
    return ownedHome ? toNum(ownedHome.cost, 0) : 0;
  })();

  // Minimum baseline so costs aren't tiny for low-cash runs.
  return Math.max(5000, cash, annualIncome, homeValue * 0.25);
}

function pickWeighted(rng, weightedItems) {
  const items = Array.isArray(weightedItems) ? weightedItems.filter(x => x && x.item && x.weight > 0) : [];
  if (!items.length) return null;

  const total = items.reduce((sum, x) => sum + x.weight, 0);
  const roll = (rng?.nextFloat ? rng.nextFloat() : Math.random()) * total;
  let acc = 0;
  for (const x of items) {
    acc += x.weight;
    if (roll < acc) return x.item;
  }
  return items[items.length - 1].item;
}

const COUNTRY_HAZARD_BONUS = {
  // Ring of Fire-ish
  IDN: { volcano: 2.4, earthquake: 2.2, tsunami: 2.0, flood: 1.4 },
  JPN: { earthquake: 2.6, tsunami: 2.0, hurricane: 1.4, flood: 1.2 },
  PHL: { hurricane: 2.2, flood: 1.8, tsunami: 1.3 },
  CHL: { earthquake: 2.2, tsunami: 1.6, landslide: 1.4 },
  PER: { earthquake: 1.8, landslide: 1.6, flood: 1.3 },
  NZL: { earthquake: 1.8, volcano: 1.5, storm: 1.2 },
  ISL: { volcano: 2.4, storm: 1.4 },

  // Cyclone/hurricane belts
  USA: { hurricane: 1.6, tornado: 1.8, wildfire: 1.4, blizzard: 1.3, heatwave: 1.4, flood: 1.3 },
  MEX: { hurricane: 1.6, flood: 1.4, earthquake: 1.2 },
  JAM: { hurricane: 2.0, flood: 1.5 },
  DOM: { hurricane: 2.0, flood: 1.5 },
  HTI: { hurricane: 1.9, flood: 1.7 },

  // Dry/hot + fire prone
  AUS: { wildfire: 2.2, drought: 2.0, heatwave: 1.8, flood: 1.2, hurricane: 1.2 },
  ZAF: { drought: 1.6, heatwave: 1.5, wildfire: 1.3 },
  BRA: { flood: 1.4, wildfire: 1.2, drought: 1.2 },

  // Mountains
  NPL: { landslide: 2.0, earthquake: 1.6, flood: 1.3 },
  IND: { flood: 1.5, heatwave: 1.4, landslide: 1.2 },
};

const SEVERITY = {
  moderate: { label: 'Severe', costMin: 0.05, costMax: 0.16, stressMin: 8, stressMax: 22, maxCost: 120000 },
  major: { label: 'Major', costMin: 0.12, costMax: 0.28, stressMin: 16, stressMax: 35, maxCost: 220000 },
  catastrophic: { label: 'Catastrophic', costMin: 0.22, costMax: 0.55, stressMin: 26, stressMax: 55, maxCost: 400000 },
};

function rollSeverity(rng, chaosLevel) {
  const r = (rng?.nextFloat ? rng.nextFloat() : Math.random());
  const l = Math.max(0, Math.min(3, Math.round(toNum(chaosLevel, 0))));

  // Higher chaos → higher odds of catastrophic outcomes.
  const table =
    l === 3 ? { moderate: 0.25, major: 0.50, catastrophic: 0.25 }
      : l === 2 ? { moderate: 0.35, major: 0.45, catastrophic: 0.20 }
      : l === 1 ? { moderate: 0.45, major: 0.40, catastrophic: 0.15 }
      : { moderate: 0.60, major: 0.30, catastrophic: 0.10 };

  if (r < table.catastrophic) return 'catastrophic';
  if (r < table.catastrophic + table.major) return 'major';
  return 'moderate';
}

function bandLine(lines, band, fallbackBand = 'kid') {
  if (!lines || typeof lines !== 'object') return '';
  return lines[band] || lines[fallbackBand] || '';
}

const DISASTER_DEFS = [
  {
    key: 'flood',
    emoji: '🌊',
    name: 'Flooding',
    weight: 1.25,
    costFactor: 1.05,
    stressFactor: 1.05,
    intro: {
      moderate: 'Relentless rain turns streets into rivers. Water starts creeping where it should not.',
      major: 'The flood warning escalates fast. You can hear water pounding at doors and drains.',
      catastrophic: 'A flash flood hits hard. The neighborhood is chaos—sirens, rushing water, and frantic planning.'
    },
    kidLine: {
      tiny: 'Your child cannot lift sandbags, but they can "help" by sticking labels on the emergency kit and learning what the warning sounds mean.',
      little: 'Your child helps fill sandbags, packs a small go-bag, and learns what "higher ground" really means.',
      kid: 'Your child helps stack sandbags, moves valuables upstairs, and practices the evacuation route like a drill.',
      teen: 'Your child takes charge of the checklist, helps protect the home, and keeps the household focused under pressure.',
      adult: 'Your grown child jumps in like a pro—logistics, supplies, calls to family. A real team effort.'
    },
    labels: {
      handsOn: {
        tiny: 'Build the "flood kit" together (simple tasks)',
        little: 'Stack sandbags together',
        kid: 'Sandbags + evacuation drill together',
        teen: 'Run the flood plan together (checklist + help)',
        adult: 'Coordinate the response as a family'
      },
      safety: 'Evacuate early (higher ground)',
      community: 'Help neighbors / share supplies',
      freeze: 'Downplay it and hope it passes'
    }
  },
  {
    key: 'wildfire',
    emoji: '🔥',
    name: 'Wildfire & Smoke',
    weight: 1.15,
    costFactor: 1.1,
    stressFactor: 1.1,
    intro: {
      moderate: 'Smoke rolls in. The sky looks wrong and the air tastes like a campfire that never ends.',
      major: 'A nearby wildfire grows. Evacuation alerts start buzzing and ash collects like gray snow.',
      catastrophic: 'A fast-moving wildfire forces urgent decisions. Roads clog. The air is hazardous. Go-time.'
    },
    kidLine: {
      tiny: 'Your child helps by picking a comfort toy for the go-bag and learning "inside air is safer" today.',
      little: 'Your child helps pack masks, water, and a go-bag—and learns that planning is a kind of courage.',
      kid: 'Your child helps clear yard debris, packs the go-bags, and learns how to check air-quality alerts.',
      teen: 'Your child helps make the home safer, packs documents, and keeps younger siblings calm.',
      adult: 'Your grown child helps coordinate evacuation, check on relatives, and handle logistics.'
    },
    labels: {
      handsOn: {
        tiny: 'Pack go-bags together (comfort + basics)',
        little: 'Make go-bags + practice the plan',
        kid: 'Clear yard + pack go-bags together',
        teen: 'Defend the home + evacuation plan',
        adult: 'Family logistics + check on relatives'
      },
      safety: 'Evacuate early',
      community: 'Volunteer / check on neighbors',
      freeze: 'Wait and see (risky)'
    }
  },
  {
    key: 'hurricane',
    emoji: '🌀',
    name: 'Hurricane / Typhoon',
    weight: 1.05,
    costFactor: 1.2,
    stressFactor: 1.15,
    intro: {
      moderate: 'Weather warnings intensify. Wind and rain start testing every weak point.',
      major: 'The storm strengthens. Supplies vanish from shelves and the forecast looks ugly.',
      catastrophic: 'The storm is a monster. Power outages, flooding, and dangerous winds are expected.'
    },
    kidLine: {
      tiny: 'Your child helps by choosing a flashlight buddy and learning where the "safe room" is.',
      little: 'Your child helps fill water containers and packs snacks, learning that calm planning beats panic.',
      kid: 'Your child helps board up, charge devices, and run a mini-drill for the "safe room."',
      teen: 'Your child helps secure the house, manage supplies, and keep everyone disciplined.',
      adult: 'Your grown child helps with boarding, planning, and coordinating family updates.'
    },
    labels: {
      handsOn: {
        tiny: 'Make a "storm kit" together',
        little: 'Prep supplies together (water + food)',
        kid: 'Board up + storm drill together',
        teen: 'Full storm-prep plan together',
        adult: 'Coordinate supplies and updates'
      },
      safety: 'Leave before it hits',
      community: 'Help others prep / share supplies',
      freeze: 'Ride it out without prepping'
    }
  },
  {
    key: 'earthquake',
    emoji: '🌍',
    name: 'Earthquake',
    weight: 1.0,
    costFactor: 1.05,
    stressFactor: 1.2,
    intro: {
      moderate: 'A strong quake hits. Things rattle, fall, and break—your body remembers the shaking long after it stops.',
      major: 'A major quake causes damage across town. Aftershocks keep everyone on edge.',
      catastrophic: 'A catastrophic quake devastates infrastructure. Safety checks, shortages, and uncertainty dominate the year.'
    },
    kidLine: {
      tiny: 'Your child learns the simplest rule: "Drop, cover, hold on." You practice it like a game.',
      little: 'Your child helps make an emergency corner with water, snacks, and a tiny first-aid kit.',
      kid: 'Your child helps secure shelves, identify safe spots, and run a quick drill.',
      teen: 'Your child helps with safety checks, family messaging, and rebuilding routines.',
      adult: 'Your grown child helps with repairs, logistics, and supporting family emotionally.'
    },
    labels: {
      handsOn: {
        tiny: 'Practice "drop, cover, hold on" together',
        little: 'Build an emergency corner together',
        kid: 'Secure shelves + run a drill together',
        teen: 'Family safety plan + repairs',
        adult: 'Support + rebuild as a family'
      },
      safety: 'Focus on safety checks + routines',
      community: 'Help at a relief center',
      freeze: 'Act like it is "no big deal"'
    }
  },
  {
    key: 'tornado',
    emoji: '🌪️',
    name: 'Tornado Outbreak',
    weight: 0.9,
    costFactor: 1.0,
    stressFactor: 1.25,
    intro: {
      moderate: 'Sirens sound. The sky turns the wrong color and the air gets unnervingly still.',
      major: 'Multiple tornado warnings hit this season. Disruptive, terrifying, and exhausting.',
      catastrophic: 'A violent tornado tears through nearby areas. Damage is severe and the recovery is long.'
    },
    kidLine: {
      tiny: 'Your child practices running to the safe spot with you—like a silly race with a serious purpose.',
      little: 'Your child helps pack a "safe room" bin and learns what the siren means.',
      kid: 'Your child helps build a checklist and knows exactly what to do when warnings hit.',
      teen: 'Your child helps keep the household calm and organized during repeated warnings.',
      adult: 'Your grown child helps coordinate safety plans and check on family.'
    },
    labels: {
      handsOn: {
        tiny: 'Practice the safe-spot "race" together',
        little: 'Pack the safe-room bin together',
        kid: 'Create a tornado checklist together',
        teen: 'Run the full tornado plan together',
        adult: 'Coordinate plans and family check-ins'
      },
      safety: 'Shelter early + stay alert',
      community: 'Help with cleanup / donations',
      freeze: 'Ignore warnings (bad idea)'
    }
  },
  {
    key: 'volcano',
    emoji: '🌋',
    name: 'Volcanic Eruption',
    weight: 0.75,
    costFactor: 1.3,
    stressFactor: 1.2,
    intro: {
      moderate: 'Ash falls lightly. The world looks muted, like someone turned down the saturation.',
      major: 'The eruption intensifies. Ashfall and closures disrupt daily life and breathing becomes a concern.',
      catastrophic: 'A major eruption forces evacuations and severe disruption. A year you will never forget.'
    },
    kidLine: {
      tiny: 'Your child helps by choosing a mask that fits and learning "we keep ash out of our lungs."',
      little: 'Your child helps pack masks, water, and a go-bag, learning that safety is a routine—not a panic.',
      kid: 'Your child learns about ash safety, packs supplies, and helps keep windows sealed.',
      teen: 'Your child helps plan evacuation options, supports younger kids, and stays focused.',
      adult: 'Your grown child handles logistics and keeps the family connected.'
    },
    labels: {
      handsOn: {
        tiny: 'Pack masks + comfort kit together',
        little: 'Go-bag + ash-safety routine together',
        kid: 'Seal windows + ash plan together',
        teen: 'Evac options + family plan together',
        adult: 'Family logistics + support network'
      },
      safety: 'Evacuate early',
      community: 'Help distribute masks / supplies',
      freeze: 'Pretend it is nothing'
    }
  },
  {
    key: 'tsunami',
    emoji: '🌊',
    name: 'Tsunami Warning',
    weight: 0.7,
    costFactor: 1.35,
    stressFactor: 1.25,
    intro: {
      moderate: 'A tsunami warning is issued. It might not come, but the uncertainty is part of the fear.',
      major: 'The warning escalates. Traffic, sirens, and urgency take over the day.',
      catastrophic: 'A tsunami strikes coastal areas. Evacuation and recovery reshape life for a long time.'
    },
    kidLine: {
      tiny: 'Your child learns the simplest rule: "When we hear the warning, we go up." You hold them tight and move.',
      little: 'Your child practices the route to higher ground and helps pack the go-bag.',
      kid: 'Your child memorizes the evacuation plan and helps keep the family moving quickly.',
      teen: 'Your child stays focused, helps others, and keeps communication clear.',
      adult: 'Your grown child helps coordinate family evacuation and check-ins.'
    },
    labels: {
      handsOn: {
        tiny: 'Practice "go up" + pack comfort items',
        little: 'Evac route practice + go-bag together',
        kid: 'Full evacuation drill together',
        teen: 'Lead the family evacuation plan',
        adult: 'Coordinate evacuation + family updates'
      },
      safety: 'Evacuate immediately',
      community: 'Help others evacuate',
      freeze: 'Wait for more info (dangerous)'
    }
  },
  {
    key: 'blizzard',
    emoji: '❄️',
    name: 'Blizzard / Ice Storm',
    weight: 0.85,
    costFactor: 0.85,
    stressFactor: 1.05,
    intro: {
      moderate: 'A winter storm hits. Roads freeze, school closes, and the house feels smaller.',
      major: 'A brutal ice storm knocks out power. Heating and food become real worries.',
      catastrophic: 'A long, severe blizzard isolates communities. Recovery takes weeks.'
    },
    kidLine: {
      tiny: 'Your child helps by picking warm layers and making a "cozy corner" during outages.',
      little: 'Your child helps pack blankets, snacks, and flashlight batteries into a winter kit.',
      kid: 'Your child helps shovel safely, checks on neighbors, and learns how to conserve heat.',
      teen: 'Your child helps manage supplies, clear paths, and keep the household steady.',
      adult: 'Your grown child helps handle repairs, errands, and family support.'
    },
    labels: {
      handsOn: {
        tiny: 'Make a cozy outage corner together',
        little: 'Build a winter kit together',
        kid: 'Shovel + neighbor check-ins',
        teen: 'Run the winter-storm plan together',
        adult: 'Coordinate repairs + family support'
      },
      safety: 'Stay in and conserve heat',
      community: 'Check on vulnerable neighbors',
      freeze: 'Do nothing (then scramble)'
    }
  },
  {
    key: 'heatwave',
    emoji: '☀️',
    name: 'Heatwave',
    weight: 1.0,
    costFactor: 0.65,
    stressFactor: 0.95,
    intro: {
      moderate: 'A heatwave stretches on. Sleep gets harder and tempers get shorter.',
      major: 'Extreme heat pushes infrastructure. Cooling is essential—and expensive.',
      catastrophic: 'A record heatwave leads to outages and health risks. The city feels like it is holding its breath.'
    },
    kidLine: {
      tiny: 'Your child learns "water, shade, and rest" as a simple safety mantra.',
      little: 'Your child helps set up a hydration station and learns how heat affects the body.',
      kid: 'Your child tracks water breaks, helps plan cool indoor activities, and learns about heat safety.',
      teen: 'Your child helps check on others and stays disciplined about rest and hydration.',
      adult: 'Your grown child helps coordinate family check-ins and cooling plans.'
    },
    labels: {
      handsOn: {
        tiny: 'Make a "water + shade" routine together',
        little: 'Set up a hydration station together',
        kid: 'Create a heat-safety plan together',
        teen: 'Heat plan + check on others',
        adult: 'Coordinate cooling plans + check-ins'
      },
      safety: 'Spend for safe cooling',
      community: 'Check on neighbors / donate water',
      freeze: 'Push through like nothing is wrong'
    }
  },
  {
    key: 'landslide',
    emoji: '🪨',
    name: 'Landslide',
    weight: 0.7,
    costFactor: 1.1,
    stressFactor: 1.1,
    intro: {
      moderate: 'After heavy rain, unstable ground becomes a real threat. Routes close and anxiety spikes.',
      major: 'A landslide damages roads and homes nearby. Disruption ripples through daily life.',
      catastrophic: 'A major landslide devastates parts of the region. Recovery is slow and uncertain.'
    },
    kidLine: {
      tiny: 'Your child stays close while you prioritize safety and calm routines.',
      little: 'Your child helps pack essentials and learns that leaving early is sometimes the brave choice.',
      kid: 'Your child helps track alerts and pack safely, learning situational awareness.',
      teen: 'Your child helps manage logistics and supports younger family members.',
      adult: 'Your grown child helps coordinate safe relocation and family support.'
    },
    labels: {
      handsOn: {
        tiny: 'Keep routines calm + pack essentials together',
        little: 'Pack essentials + practice leaving early',
        kid: 'Alerts + go-bag planning together',
        teen: 'Logistics + family support plan',
        adult: 'Coordinate relocation + support'
      },
      safety: 'Relocate temporarily',
      community: 'Help with cleanup / resources',
      freeze: 'Stay put and hope'
    }
  },
  {
    key: 'drought',
    emoji: '🏜️',
    name: 'Drought / Water Restrictions',
    weight: 0.8,
    costFactor: 0.55,
    stressFactor: 0.8,
    intro: {
      moderate: 'Water restrictions start. Small inconveniences stack up into a new kind of daily stress.',
      major: 'The drought worsens. Prices rise and routines change. Everyone is tired of counting drops.',
      catastrophic: 'A severe drought strains the region. Water becomes a constant concern and conflict point.'
    },
    kidLine: {
      tiny: 'Your child learns tiny habits: turn off taps, short rinses, "water is precious."',
      little: 'Your child helps track household water use and feels proud of saving resources.',
      kid: 'Your child helps build a conservation plan and learns about systems and tradeoffs.',
      teen: 'Your child helps lead conservation, educate others, and stay resilient.',
      adult: 'Your grown child helps coordinate support for family and community.'
    },
    labels: {
      handsOn: {
        tiny: 'Practice "water is precious" habits',
        little: 'Make a water-saving chart together',
        kid: 'Create a conservation plan together',
        teen: 'Lead the household conservation plan',
        adult: 'Family + community conservation support'
      },
      safety: 'Spend to adapt (filters/storage)',
      community: 'Help a community water drive',
      freeze: 'Ignore restrictions (consequences)'
    }
  },
  {
    key: 'storm',
    emoji: '⛈️',
    name: 'Severe Storms',
    weight: 1.1,
    costFactor: 0.95,
    stressFactor: 1.0,
    intro: {
      moderate: 'Severe storms keep rolling through. Outages and repairs become part of the year.',
      major: 'Repeated storms cause real damage. You start living by weather alerts.',
      catastrophic: 'A year of violent storms batters the region. Recovery feels never-ending.'
    },
    kidLine: {
      tiny: 'Your child helps by learning where flashlights live and staying close during thunder.',
      little: 'Your child helps build a power-outage kit and learns how to stay calm in loud weather.',
      kid: 'Your child helps secure outdoor items and practices a calm outage routine.',
      teen: 'Your child helps with repairs, planning, and emotional steadiness.',
      adult: 'Your grown child helps coordinate repairs and check-ins.'
    },
    labels: {
      handsOn: {
        tiny: 'Make the flashlight routine together',
        little: 'Build an outage kit together',
        kid: 'Secure the yard + outage routine',
        teen: 'Storm plan + repairs together',
        adult: 'Coordinate repairs + family updates'
      },
      safety: 'Hire help / reinforce the home',
      community: 'Help with cleanup',
      freeze: 'Do nothing until it breaks'
    }
  },
];

function getDisasterWeight(state, def) {
  const iso3 = String(state?.countryIso3 || 'USA').toUpperCase();
  const bonusMap = COUNTRY_HAZARD_BONUS[iso3] || {};
  const bonus = Number(bonusMap[def.key] || 1);

  // Mildly reduce extremely region-specific hazards outside bonus regions (keeps variety but avoids spam)
  const regionSpecific = new Set(['tsunami', 'volcano']);
  const outsidePenalty = regionSpecific.has(def.key) && !bonusMap[def.key] ? 0.65 : 1;

  return (def.weight || 1) * bonus * outsidePenalty;
}

function computeAnxietyDeltaForOption(optionId, band) {
  // Younger kids tend to feel the fear more strongly; older kids can gain agency.
  if (optionId === 'freeze') return band === 'tiny' ? 3 : band === 'little' ? 2 : 2;
  if (optionId === 'hands_on') return (band === 'tiny' || band === 'little') ? 1 : -1;
  if (optionId === 'community') return (band === 'tiny') ? 1 : 0;
  if (optionId === 'safety') return (band === 'tiny') ? 0 : -1;
  return 0;
}

function computeDisasterMitigation(state, hazardKey) {
  const items = Array.isArray(state?.inventory?.items) ? state.inventory.items : [];
  const hasItem = (id) => items.some(i => i?.id === id);

  let costMult = 1;
  let stressMult = 1;
  const badges = [];

  // Go-Bag: master prep item
  if (hasItem('def_go_bag')) {
    costMult *= 0.92;
    stressMult *= 0.90;
    badges.push('Go-Bag');
  }

  // First Aid: stress reduction
  if (hasItem('def_firstAid')) {
    stressMult *= 0.96;
    badges.push('First Aid');
  }

  // Radio: information reduces panic
  if (hasItem('def_radio')) {
    stressMult *= 0.97;
    badges.push('Emergency Radio');
  }

  // Flashlight: visibility and calm
  if (hasItem('def_flashlight')) {
    stressMult *= 0.98;
    badges.push('Flashlight');
  }

  // Fire Extinguisher: helps with fire-related hazards
  if (hasItem('def_fire_ext') && ['wildfire', 'storm', 'hurricane'].includes(hazardKey)) {
    costMult *= 0.96;
    badges.push('Fire Extinguisher');
  }

  // Water Jugs: helps with heat/drought hazards
  if (hasItem('def_water_pack') && ['heatwave', 'drought'].includes(hazardKey)) {
    stressMult *= 0.95;
    badges.push('Water Jugs');
  }

  // Portable Generator: helps with power-outage hazards
  if (hasItem('def_generator') && ['blizzard', 'storm', 'hurricane', 'heatwave'].includes(hazardKey)) {
    costMult *= 0.93;
    stressMult *= 0.94;
    badges.push('Generator');
  }

  // Clamp multipliers (0.75 is max 25% reduction)
  costMult = clamp(costMult, 0.75, 1);
  stressMult = clamp(stressMult, 0.75, 1);

  return {
    costMult,
    stressMult,
    badges,
    hasGoBag: hasItem('def_go_bag')
  };
}

function buildOptions(def, ctx) {
  const { band, childName, hasChild, mitigation } = ctx;

  const handsOnLabel = bandLine(def.labels?.handsOn, band) || 'Prepare together';
  const safeLabel = def.labels?.safety || 'Prioritize safety';
  const communityLabel = def.labels?.community || 'Help others';
  const freezeLabel = def.labels?.freeze || 'Do nothing';

  const childTag = hasChild ? ` with ${childName}` : '';
  const anxHands = computeAnxietyDeltaForOption('hands_on', band);
  const anxSafe = computeAnxietyDeltaForOption('safety', band);
  const anxComm = computeAnxietyDeltaForOption('community', band);
  const anxFreeze = computeAnxietyDeltaForOption('freeze', band);

  // Adjust hands_on label if go-bag ready
  let finalHandsOnLabel = handsOnLabel;
  if (mitigation?.hasGoBag) {
    finalHandsOnLabel = finalHandsOnLabel.replace(/[Pp]ack.*go-bag/i, 'Grab your go-bags +').replace(/[Mm]ake.*go-bag/i, 'Grab your go-bags +');
  } else {
    finalHandsOnLabel = finalHandsOnLabel.replace(/[Pp]ack|[Mm]ake/i, 'Pack essentials fast +');
  }

  let handsOnCostMult = 0.78;
  let handsOnStressMult = 0.95;

  // If go-bag exists, improve hands_on option slightly
  if (mitigation?.hasGoBag) {
    handsOnCostMult *= 0.96;
    handsOnStressMult *= 0.94;
  }

  return [
    {
      id: 'hands_on',
      label: hasChild ? finalHandsOnLabel.replace('{child}', childName) : finalHandsOnLabel.replace('together', 'yourself'),
      note: hasChild ? `Hands-on learning${childTag}.` : 'Hands-on, practical response.',
      costMult: handsOnCostMult,
      stressMult: handsOnStressMult,
      loveDelta: hasChild ? 1.0 : 0.3,
      deltas: {
        responsibility: 1,
        knowledge: 1,
        discipline: 0.6,
        confidence: 0.6,
        empathy: 0.3,
        anxiety: anxHands
      }
    },
    {
      id: 'safety',
      label: safeLabel,
      note: 'Safety first. Reduce risk and stabilize routines.',
      costMult: 0.92,
      stressMult: 0.85,
      loveDelta: hasChild ? 0.6 : 0.2,
      deltas: {
        responsibility: 0.6,
        knowledge: 0.4,
        discipline: 0.2,
        confidence: 0.3,
        empathy: 0.2,
        anxiety: anxSafe
      }
    },
    {
      id: 'community',
      label: communityLabel,
      note: 'Help others. Can be meaningful — and draining.',
      costMult: 0.86,
      stressMult: 1.05,
      loveDelta: hasChild ? 0.8 : 0.25,
      deltas: {
        empathy: 1.1,
        responsibility: 0.6,
        confidence: 0.2,
        knowledge: 0.3,
        anxiety: anxComm
      }
    },
    {
      id: 'freeze',
      label: freezeLabel,
      note: 'Avoid action. Often costs more later.',
      costMult: 1.18,
      stressMult: 1.10,
      loveDelta: hasChild ? -0.8 : -0.2,
      deltas: {
        responsibility: -0.6,
        discipline: -0.4,
        confidence: -0.3,
        anxiety: anxFreeze
      }
    },
  ];
}

function computeBaseCostAndStress(state, def, severityKey, rng) {
  const wealth = computeWealthBaseline(state);
  const sev = SEVERITY[severityKey] || SEVERITY.moderate;

  const roll01 = (rng?.nextFloat ? rng.nextFloat() : Math.random());
  const costPct = sev.costMin + (sev.costMax - sev.costMin) * roll01;
  const rawCost = wealth * costPct * (def.costFactor || 1);
  const cappedCost = Math.min(sev.maxCost, rawCost);
  const baseCost = Math.round(clamp(cappedCost, 150, sev.maxCost));

  const roll02 = (rng?.nextFloat ? rng.nextFloat() : Math.random());
  const stress = sev.stressMin + (sev.stressMax - sev.stressMin) * roll02;
  const baseStress = Math.round(clamp(stress * (def.stressFactor || 1), 4, 70));

  return { baseCost, baseStress };
}

function pickDisasterDef(state, rng) {
  const weighted = DISASTER_DEFS.map(def => ({
    item: def,
    weight: getDisasterWeight(state, def)
  }));
  return pickWeighted(rng, weighted) || DISASTER_DEFS[0];
}

function buildDescription(def, ctx) {
  const { severityKey, band, hasChild, countryName } = ctx;
  const intro = def.intro?.[severityKey] || def.intro?.moderate || 'A natural disaster disrupts life.';

  const kidLineText = hasChild ? bandLine(def.kidLine, band) : 'You focus on safety, supplies, and keeping your life functional.';

  const severityLine = severityKey === 'catastrophic'
    ? 'The impact is severe and long-lasting.'
    : severityKey === 'major'
      ? 'The disruption is serious — you will feel it for months.'
      : 'Frightening, but manageable with good decisions.';

  const description = `${intro}\n\n${kidLineText}\n\n${severityLine} Location: ${countryName}.`;
  return description;
}

export function rollNaturalDisaster(state, rng) {
  const chance = getNaturalDisasterAnnualChance(state);
  const roll = (rng?.nextFloat ? rng.nextFloat() : Math.random());
  if (roll >= chance) return null;

  const chaosLevel = getChaosLevelFromExpansions(state?.expansions || {});
  const severityKey = rollSeverity(rng, chaosLevel);

  const def = pickDisasterDef(state, rng);

  // A) Country-lock fix: use run's current country as source of truth
  const normalizedRunCountry = String(state?.countryIso3 || state?.countryConfig?.selectedCountryIso3 || 'USA').toUpperCase();
  const countryName = getCountryName(normalizedRunCountry);

  const year = toNum(state?.currentYear, 0);
  const band = getAgeBand(year);

  const childName = String(state?.child?.name || state?.selectedChild?.name || 'your child');
  const hasChild = hasChildInRun(state);

  const { baseCost, baseStress } = computeBaseCostAndStress(state, def, severityKey, rng);

  // C) Compute mitigation and apply it
  const mitigation = computeDisasterMitigation(state, def.key);
  const finalCost = Math.round(baseCost * mitigation.costMult);
  const finalStress = Math.round(baseStress * mitigation.stressMult);

  const options = buildOptions(def, { band, childName, hasChild, mitigation });

  const severityLabel = SEVERITY[severityKey]?.label || 'Severe';

  const title = `${def.emoji} ${def.name}`;
  const description = buildDescription(def, { severityKey, band, hasChild, countryName });

  return {
    kind: 'natural_disaster',
    hazardKey: def.key,
    year,
    severity: severityKey,
    severityLabel,
    title,
    description,
    baseCost: finalCost,
    baseStress: finalStress,
    countryIso3: normalizedRunCountry,
    countryName,
    options,
    mitigation
  };
}