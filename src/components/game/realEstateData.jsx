// Real Estate system helpers & data
// Time unit: 1 "age" == 1 year. All rents/expenses are per-year.

export const DEFAULT_REAL_ESTATE_STATE = {
  properties: [],
  market: { purchasedListingIdsByAge: {}, purchasedAuctionIdsByAge: {} },
  lastProcessedAge: -1,
  landlordPolicy: "balanced",
  primaryResidencePropertyId: null
};

// --- Landlord Legacy defaults (optional expansion-safe schema) ---
export const DEFAULT_MANAGER = { enabled: false, hiredAge: null, feePct: 0.10 };

export const DEFAULT_INSURANCE = {
  planId: "none",
  lastClaimAge: null,
  lastPayout: 0,
  lastDisaster: null
};

export const DEFAULT_TENANT = {
  status: "vacant",
  quality: null,
  startedAge: null,
  strikes: 0,
  owed: 0,
  warningSentAge: null,
  evictionStartedAge: null,
  legalStartedAge: null,
  archetypeId: null,
  satisfaction: 0,
  avatarEmoji: "🧑"
};

export const TENANT_ARCHETYPES = [
  { id: "single_parent", label: "Single Parent", emoji: "🧸", riskAdj: 0.03, hardshipChance: 0.14 },
  { id: "grad_student", label: "Grad Student", emoji: "📚", riskAdj: 0.04, hardshipChance: 0.12 },
  { id: "night_nurse", label: "Night-Shift Nurse", emoji: "🩺", riskAdj: -0.01, hardshipChance: 0.05 },
  { id: "tech_worker", label: "Tech Worker", emoji: "💻", riskAdj: -0.03, hardshipChance: 0.03 },
  { id: "gig_worker", label: "Gig Worker", emoji: "🛵", riskAdj: 0.06, hardshipChance: 0.16 },
  { id: "retiree", label: "Retiree", emoji: "🧓", riskAdj: -0.02, hardshipChance: 0.06 },
  { id: "artist", label: "Artist", emoji: "🎨", riskAdj: 0.04, hardshipChance: 0.10 },
  { id: "influencer", label: "Influencer", emoji: "📸", riskAdj: 0.02, hardshipChance: 0.08 },
  { id: "small_business_owner", label: "Small Business Owner", emoji: "🧾", riskAdj: 0.00, hardshipChance: 0.07 },
  { id: "veteran", label: "Veteran", emoji: "🎖️", riskAdj: -0.01, hardshipChance: 0.08 }
];

export function getTenantArchetype(id) {
  return TENANT_ARCHETYPES.find(a => a.id === id) || null;
}

function weightedPick(items, rng) {
  const total = items.reduce((s, x) => s + x.w, 0);
  let r = rng() * total;
  for (const it of items) {
    r -= it.w;
    if (r <= 0) return it.id;
  }
  return items[items.length - 1]?.id || null;
}

export function pickTenantArchetype({ templateId, value, rng }) {
  const t = String(templateId || "");

  // High-end rentals skew toward stable earners.
  if (value >= 900000) {
    const pool = [
      { id: "tech_worker", w: 4 },
      { id: "small_business_owner", w: 3 },
      { id: "influencer", w: 2 },
      { id: "retiree", w: 1 }
    ];
    return weightedPick(pool, rng);
  }

  // Apartments skew younger / rotational.
  if (t.includes("apartment") || t.includes("studio") || t.includes("loft")) {
    const pool = [
      { id: "grad_student", w: 3 },
      { id: "gig_worker", w: 3 },
      { id: "influencer", w: 2 },
      { id: "night_nurse", w: 2 },
      { id: "artist", w: 2 }
    ];
    return weightedPick(pool, rng);
  }

  // Rural / vacation skew seasonal.
  if (t.includes("farm") || t.includes("chalet") || t.includes("mountain") || t.includes("beach")) {
    const pool = [
      { id: "retiree", w: 3 },
      { id: "veteran", w: 2 },
      { id: "artist", w: 2 },
      { id: "gig_worker", w: 1 }
    ];
    return weightedPick(pool, rng);
  }

  // Default suburban mix.
  const pool = [
    { id: "single_parent", w: 3 },
    { id: "night_nurse", w: 2 },
    { id: "tech_worker", w: 2 },
    { id: "gig_worker", w: 3 },
    { id: "retiree", w: 2 },
    { id: "small_business_owner", w: 2 },
    { id: "veteran", w: 1 }
  ];
  return weightedPick(pool, rng);
}

export const INSURANCE_PLANS = {
  none:     { id: "none",     label: "No Insurance", emoji: "⚠️", premiumRate: 0.0000, deductible: 0,    disasterCoverage: 0.00, tenantDamageCoverage: 0.00 },
  basic:    { id: "basic",    label: "Basic",        emoji: "🛡️", premiumRate: 0.0035, deductible: 750,  disasterCoverage: 0.55, tenantDamageCoverage: 0.00 },
  standard: { id: "standard", label: "Standard",     emoji: "🛡️", premiumRate: 0.0055, deductible: 900,  disasterCoverage: 0.72, tenantDamageCoverage: 0.30 },
  premium:  { id: "premium",  label: "Premium",      emoji: "🛡️", premiumRate: 0.0075, deductible: 1200, disasterCoverage: 0.85, tenantDamageCoverage: 0.50 }
};

export function getInsurancePlan(planId) {
  return INSURANCE_PLANS[String(planId || "none")] || INSURANCE_PLANS.none;
}

// How mortgages work in this game (simple annual amortization)
export const DEFAULT_MORTGAGE_TERMS = {
  downPaymentPct: 0.25,      // 25% down
  annualRate: 0.08,          // 8% yearly interest (game economy is compressed)
  termYears: 15              // paid yearly
};

export const SELLING_FEE_PCT = 0.06; // closing costs / agent fees

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const REAL_ESTATE_TEMPLATES = [
  {
    id: "tiny_cabin",
    emoji: "🏕️",
    label: "Tiny Cabin",
    blurb: "Small, simple, always in demand.",
    basePrice: 25000,
    baseRent: 3600,
    maintenanceRate: 0.012,
    taxRate: 0.0040,
    conditionRange: [60, 90],
    volatility: 0.10,
    demandMult: 1.00,
    tenantRiskMult: 1.00
  },
  {
    id: "studio_apartment",
    emoji: "🏢",
    label: "Studio Apartment",
    blurb: "Fast to fill. Tenants rotate often.",
    basePrice: 85000,
    baseRent: 10200,
    maintenanceRate: 0.010,
    taxRate: 0.0042,
    conditionRange: [65, 92],
    volatility: 0.10,
    demandMult: 1.05,
    tenantRiskMult: 1.05
  },
  {
    id: "starter_condo",
    emoji: "🏙️",
    label: "Starter Condo",
    blurb: "Stable tenants, steady appreciation.",
    basePrice: 135000,
    baseRent: 14400,
    maintenanceRate: 0.010,
    taxRate: 0.0045,
    conditionRange: [60, 92],
    volatility: 0.11,
    demandMult: 1.00,
    tenantRiskMult: 1.00
  },
  {
    id: "fixer_bungalow",
    emoji: "🛠️",
    label: "Fixer‑Upper Bungalow",
    blurb: "Cheap(er) now. Repairs forever.",
    basePrice: 95000,
    baseRent: 13200,
    maintenanceRate: 0.018,
    taxRate: 0.0040,
    conditionRange: [30, 70],
    volatility: 0.20,
    demandMult: 0.90,
    tenantRiskMult: 1.20
  },
  {
    id: "townhouse",
    emoji: "🏘️",
    label: "Townhouse",
    blurb: "Solid neighborhood, dependable rent.",
    basePrice: 220000,
    baseRent: 22800,
    maintenanceRate: 0.012,
    taxRate: 0.0048,
    conditionRange: [60, 94],
    volatility: 0.12,
    demandMult: 1.00,
    tenantRiskMult: 0.98
  },
  {
    id: "suburban_home",
    emoji: "🏡",
    label: "Suburban Home",
    blurb: "Family demand, moderate upkeep.",
    basePrice: 320000,
    baseRent: 30000,
    maintenanceRate: 0.012,
    taxRate: 0.0050,
    conditionRange: [55, 92],
    volatility: 0.13,
    demandMult: 0.98,
    tenantRiskMult: 1.00
  },
  {
    id: "duplex",
    emoji: "🏠",
    label: "Duplex",
    blurb: "Two units, two chances for drama.",
    basePrice: 450000,
    baseRent: 48000,
    maintenanceRate: 0.013,
    taxRate: 0.0052,
    conditionRange: [55, 90],
    volatility: 0.14,
    demandMult: 1.02,
    tenantRiskMult: 1.08
  },
  {
    id: "triplex",
    emoji: "🏢",
    label: "Triplex",
    blurb: "Three units. Cashflow with complications.",
    basePrice: 600000,
    baseRent: 66000,
    maintenanceRate: 0.013,
    taxRate: 0.0053,
    conditionRange: [50, 90],
    volatility: 0.15,
    demandMult: 1.03,
    tenantRiskMult: 1.10
  },
  {
    id: "fourplex",
    emoji: "🏬",
    label: "Fourplex",
    blurb: "Big rent. Bigger maintenance surprises.",
    basePrice: 750000,
    baseRent: 84000,
    maintenanceRate: 0.014,
    taxRate: 0.0054,
    conditionRange: [50, 88],
    volatility: 0.16,
    demandMult: 1.04,
    tenantRiskMult: 1.12
  },
  {
    id: "small_farmhouse",
    emoji: "🚜",
    label: "Small Farmhouse",
    blurb: "Rural charm, seasonal vacancy risk.",
    basePrice: 280000,
    baseRent: 25200,
    maintenanceRate: 0.014,
    taxRate: 0.0042,
    conditionRange: [50, 88],
    volatility: 0.15,
    demandMult: 0.85,
    tenantRiskMult: 1.05
  },
  {
    id: "beach_cottage",
    emoji: "🏖️",
    label: "Beach Cottage",
    blurb: "High rent, high vacancy, salty repairs.",
    basePrice: 520000,
    baseRent: 54000,
    maintenanceRate: 0.014,
    taxRate: 0.0048,
    conditionRange: [55, 92],
    volatility: 0.20,
    demandMult: 0.75,
    tenantRiskMult: 1.10
  },
  {
    id: "city_loft",
    emoji: "🌆",
    label: "City Loft",
    blurb: "Trendy. Tenants expect perfection.",
    basePrice: 650000,
    baseRent: 66000,
    maintenanceRate: 0.013,
    taxRate: 0.0056,
    conditionRange: [60, 96],
    volatility: 0.17,
    demandMult: 0.95,
    tenantRiskMult: 0.95
  },
  {
    id: "mountain_chalet",
    emoji: "🏔️",
    label: "Mountain Chalet",
    blurb: "Beautiful. Weather and vacancy are brutal.",
    basePrice: 720000,
    baseRent: 72000,
    maintenanceRate: 0.015,
    taxRate: 0.0050,
    conditionRange: [55, 92],
    volatility: 0.22,
    demandMult: 0.70,
    tenantRiskMult: 1.15
  },
  {
    id: "luxury_home",
    emoji: "🏰",
    label: "Luxury Home",
    blurb: "Massive costs. Big swings. Big flex.",
    basePrice: 950000,
    baseRent: 90000,
    maintenanceRate: 0.015,
    taxRate: 0.0060,
    conditionRange: [65, 98],
    volatility: 0.24,
    demandMult: 0.85,
    tenantRiskMult: 0.90
  },
  {
    id: "penthouse_suite",
    emoji: "🏙️",
    label: "Penthouse Suite",
    blurb: "Ultra-premium. Vacancy can last years.",
    basePrice: 1400000,
    baseRent: 105000,
    maintenanceRate: 0.014,
    taxRate: 0.0062,
    conditionRange: [70, 100],
    volatility: 0.26,
    demandMult: 0.75,
    tenantRiskMult: 0.85
  },
  {
    id: "apartment_building",
    emoji: "🏢",
    label: "Apartment Building (8 Units)",
    blurb: "Serious cashflow. Always something breaking.",
    basePrice: 1800000,
    baseRent: 198000,
    maintenanceRate: 0.016,
    taxRate: 0.0065,
    conditionRange: [55, 94],
    volatility: 0.20,
    demandMult: 1.05,
    tenantRiskMult: 1.08
  },
  {
    id: "estate_mansion",
    emoji: "🏛️",
    label: "Estate Mansion",
    blurb: "Rare buyers, rare tenants, constant upkeep.",
    basePrice: 2500000,
    baseRent: 132000,
    maintenanceRate: 0.018,
    taxRate: 0.0068,
    conditionRange: [60, 98],
    volatility: 0.30,
    demandMult: 0.65,
    tenantRiskMult: 0.90
  }
];

const TEMPLATE_BY_ID = Object.fromEntries(REAL_ESTATE_TEMPLATES.map(t => [t.id, t]));

export function getRealEstateTemplate(templateId) {
  return TEMPLATE_BY_ID[templateId] || null;
}

// --- Deterministic RNG helpers (Mulberry32) ---
export function hashStringToInt(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function makeRng(seed) {
  let state = seed | 0;
  return function rng() {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ADJECTIVES = [
  "Sunny", "Cozy", "Quiet", "Bright", "Lucky", "Charming", "Blue‑Door", "Corner‑Lot",
  "Garden", "Vintage", "Fresh", "Cedar", "Maple", "Willow", "Pine", "Oak"
];

const STREET = [
  "Maple", "Oak", "Pine", "Cedar", "Willow", "Sunset", "Ridge", "Lake", "Meadow", "Elm", "Aspen", "River"
];

const AUCTION_EXTERIOR_HINTS_BY_BAND = {
  low: [
    "Looks maintained-ish.",
    "Could be worse.",
    "Curb appeal exists."
  ],
  mid: [
    "Sketchy, but standing.",
    "Survivable vibes.",
    "You'll need to bring tools."
  ],
  high: [
    "Yikes.",
    "Condemned energy.",
    "This might be a mistake."
  ],
  chaos: [
    "Windows missing. Spiritually haunted.",
    "Post-apocalyptic chic.",
    "Nature is reclaiming it."
  ]
};

const AUCTION_SURPRISE_EVENTS = [
  { id: 'nothing', label: 'Nothing (miracle)', costMultAdd: 0, flatAdd: 0, weight: 2 },
  { id: 'mold', label: 'Mold remediation', costMultAdd: 0.08, flatAdd: 600, weight: 3 },
  { id: 'taxes', label: 'Back taxes', costMultAdd: 0.12, flatAdd: 800, weight: 3 },
  { id: 'permit', label: 'Permit nightmare', costMultAdd: 0.06, flatAdd: 400, weight: 2 },
  { id: 'copper', label: 'Copper theft', costMultAdd: 0.04, flatAdd: 500, weight: 2 },
  { id: 'squatters', label: 'Squatters', costMultAdd: 0.10, flatAdd: 700, weight: 2 },
  { id: 'foundation', label: 'Foundation cracks', costMultAdd: 0.15, flatAdd: 1200, weight: 1 }
];

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

export function generateMarketListings({ age, runSeed, count = 6 }) {
  const runSeedInt = Number.isFinite(Number(runSeed)) ? Number(runSeed) : hashStringToInt(String(runSeed));
  const seed = runSeedInt + (Number(age) || 0) * 10007 + 1337;
  const rng = makeRng(seed);

  // Shuffle templates deterministically
  const pool = [...REAL_ESTATE_TEMPLATES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picked = pool.slice(0, clamp(count, 1, 12));

  return picked.map((t, idx) => {
    const premium = (rng() * 0.30) - 0.10; // -10% .. +20%
    const price = Math.max(500, Math.round(t.basePrice * (1 + premium)));

    const [cMin, cMax] = t.conditionRange;
    const condition = Math.round(cMin + rng() * (cMax - cMin));

    const conditionMult = 0.70 + (condition / 100) * 0.30; // 0.70..1.00
    const estRent = Math.max(0, Math.round(t.baseRent * conditionMult));

    const name = `${pick(ADJECTIVES, rng)} ${t.label}`;
    const neighborhood = pick(STREET, rng);

    const tag =
      condition < 50 ? "Needs work" :
      premium < -0.05 ? "Great deal" :
      premium > 0.12 ? "Hot listing" :
      "On the market";

    return {
      listingId: `re_${age}_${t.id}_${idx}_${price}`,
      templateId: t.id,
      emoji: t.emoji,
      name,
      neighborhood: `${neighborhood} Area`,
      tag,
      price,
      condition,
      estRent
    };
  });
}

export function generateForeclosureAuctionListings({ age, runSeed, count = 4 }) {
  const runSeedInt = Number.isFinite(Number(runSeed)) ? Number(runSeed) : hashStringToInt(String(runSeed));
  const seed = runSeedInt + (Number(age) || 0) * 10007 + 4242;
  const rng = makeRng(seed);

  // Shuffle templates deterministically
  const pool = [...REAL_ESTATE_TEMPLATES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picked = pool.slice(0, clamp(count, 1, 8));

  return picked.map((t, idx) => {
    const discount = rng() * 0.45 + 0.15; // 15%..60% off
    const price = Math.max(400, Math.round(t.basePrice * (1 - discount)));

    // Determine risk band (hidden condition range)
    const bandRoll = rng();
    let conditionBand;
    if (bandRoll < 0.25) conditionBand = 'low';
    else if (bandRoll < 0.60) conditionBand = 'mid';
    else if (bandRoll < 0.90) conditionBand = 'high';
    else conditionBand = 'chaos';

    const riskTag =
      conditionBand === 'low' ? 'Low Risk' :
      conditionBand === 'mid' ? 'Medium Risk' :
      conditionBand === 'high' ? 'High Risk' :
      'Chaos';

    const exteriorHint = pick(AUCTION_EXTERIOR_HINTS_BY_BAND[conditionBand], rng);
    const neighborhood = pick(STREET, rng);

    return {
      auctionId: `auc_${age}_${t.id}_${idx}_${price}`,
      templateId: t.id,
      emoji: t.emoji,
      label: t.label,
      name: `Foreclosed ${t.label}`,
      neighborhood: `${neighborhood} Area`,
      price,
      riskTag,
      exteriorHint,
      conditionBand
    };
  });
}

export function resolveForeclosurePurchaseOutcome({ listing, age, runSeed }) {
  const runSeedInt = Number.isFinite(Number(runSeed)) ? Number(runSeed) : hashStringToInt(String(runSeed));
  const seed = runSeedInt + (Number(age) || 0) * 99991 + hashStringToInt(listing.auctionId);
  const rng = makeRng(seed);

  const t = getRealEstateTemplate(listing.templateId);

  // Determine actual condition based on band
  const ranges = {
    low: [55, 80],
    mid: [35, 70],
    high: [20, 60],
    chaos: [5, 55]
  };

  const [min, max] = ranges[listing.conditionBand] || [35, 70];
  const revealedCondition = Math.round(min + rng() * (max - min));

  // Rent calculation (same as market)
  const conditionMult = 0.70 + (revealedCondition / 100) * 0.30;
  const rentPerYear = Math.max(0, Math.round((t?.baseRent || 0) * conditionMult));

  // Base surprise by condition
  const price = Number(listing.price) || 0;
  let baseSurprise = 0;
  if (revealedCondition >= 70) {
    baseSurprise = Math.round(price * (rng() * 0.06));
  } else if (revealedCondition >= 50) {
    baseSurprise = Math.round(price * (0.02 + rng() * 0.10));
  } else if (revealedCondition >= 30) {
    baseSurprise = Math.round(price * (0.06 + rng() * 0.16));
  } else {
    baseSurprise = Math.round(price * (0.15 + rng() * 0.30));
  }

  // Surprise event (weighted pick)
  const totalWeight = AUCTION_SURPRISE_EVENTS.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.floor(rng() * totalWeight);
  let event = AUCTION_SURPRISE_EVENTS[0];
  for (const e of AUCTION_SURPRISE_EVENTS) {
    roll -= e.weight;
    if (roll < 0) {
      event = e;
      break;
    }
  }

  const eventCost = Math.round(price * event.costMultAdd) + event.flatAdd;
  const surpriseCost = clamp(baseSurprise + eventCost, 0, Math.max(200, Math.round(price * 0.75)));
  const surpriseLabel = event.label;

  // Story lines
  const storyLines = [];
  
  if (revealedCondition >= 75) {
    storyLines.push("Against all odds, it's shockingly fine.");
  } else if (revealedCondition >= 55) {
    storyLines.push("Livable but needs love.");
  } else if (revealedCondition >= 35) {
    storyLines.push("Classic fixer. You knew the risk.");
  } else if (revealedCondition >= 15) {
    storyLines.push("Disaster. This is why auctions are gambling.");
  } else {
    storyLines.push("Post-apocalyptic. You played yourself.");
  }

  if (surpriseCost === 0) {
    storyLines.push("No surprise bills. Actual miracle.");
  } else if (surpriseCost < price * 0.10) {
    storyLines.push("Surprise costs are manageable.");
  } else if (surpriseCost < price * 0.30) {
    storyLines.push("Surprise costs hurt, but you can absorb it.");
  } else {
    storyLines.push("Surprise costs are brutal. Welcome to auctions.");
  }

  return {
    revealedCondition,
    surpriseCost,
    surpriseLabel,
    storyLines,
    rentPerYear
  };
}

// Standard amortization (annual)
export function calcMortgagePayment(principal, annualRate, years) {
  const P = Math.max(0, Number(principal) || 0);
  const r = Math.max(0, Number(annualRate) || 0);
  const n = Math.max(1, Math.floor(Number(years) || 1));

  if (P <= 0) return 0;
  if (r === 0) return Math.round(P / n);

  const payment = (P * r) / (1 - Math.pow(1 + r, -n));
  return Math.round(payment);
}

export function computeConditionMultiplier(condition) {
  const c = clamp(Number(condition) || 0, 0, 100);
  return 0.60 + (c / 100) * 0.40; // 0.60..1.00
}

export function estimateAnnualCosts(property) {
  const p = property || {};
  const t = getRealEstateTemplate(p.templateId);
  if (!t) return { maintenance: 0, tax: 0 };

  const value = Math.max(0, Number(p.currentValue ?? p.purchasePrice) || 0);

  const baseMaintenance = Math.max(50, Math.round(value * t.maintenanceRate));
  const maintenance = Math.round(baseMaintenance * (p.renting ? 1.15 : 1.0));

  const tax = Math.max(0, Math.round(value * t.taxRate));
  return { maintenance, tax };
}

function normalizeLandlordPolicy(policy) {
  const p = String(policy || "balanced");
  if (p === "strict" || p === "balanced" || p === "compassionate") return p;
  return "balanced";
}

function normalizeManager(manager) {
  const m = manager && typeof manager === "object" ? manager : {};
  return {
    enabled: !!m.enabled,
    hiredAge: Number.isFinite(Number(m.hiredAge)) ? Number(m.hiredAge) : null,
    feePct: Number.isFinite(Number(m.feePct)) ? Number(m.feePct) : 0.10
  };
}

function normalizeInsurance(insurance) {
  const i = insurance && typeof insurance === "object" ? insurance : {};
  return {
    planId: String(i.planId || "none"),
    lastClaimAge: Number.isFinite(Number(i.lastClaimAge)) ? Number(i.lastClaimAge) : null,
    lastPayout: Number(i.lastPayout) || 0,
    lastDisaster: i.lastDisaster ? String(i.lastDisaster) : null
  };
}

function normalizeTenant(tenant, allowExtendedStatuses) {
  const t = tenant && typeof tenant === "object" ? tenant : {};
  const status = String(t.status || "vacant");
  const allowed = allowExtendedStatuses
    ? ["vacant", "occupied", "delinquent", "eviction_notice", "squatting", "legal_case"]
    : ["vacant", "occupied"];

  return {
    status: allowed.includes(status) ? status : "vacant",
    quality: t.quality || null,
    startedAge: Number.isFinite(Number(t.startedAge)) ? Number(t.startedAge) : null,
    strikes: Number(t.strikes) || 0,
    owed: Number(t.owed) || 0,
    warningSentAge: Number.isFinite(Number(t.warningSentAge)) ? Number(t.warningSentAge) : null,
    evictionStartedAge: Number.isFinite(Number(t.evictionStartedAge)) ? Number(t.evictionStartedAge) : null,
    legalStartedAge: Number.isFinite(Number(t.legalStartedAge)) ? Number(t.legalStartedAge) : null,
    archetypeId: t.archetypeId ? String(t.archetypeId) : null,
    satisfaction: clamp(Number(t.satisfaction) || 0, 0, 100),
    avatarEmoji: t.avatarEmoji ? String(t.avatarEmoji) : "🧑"
  };
}

function clearTenantToVacant(tenant) {
  const next = { ...tenant };
  next.status = "vacant";
  next.quality = null;
  next.startedAge = null;
  next.strikes = 0;
  next.owed = 0;
  next.warningSentAge = null;
  next.evictionStartedAge = null;
  next.legalStartedAge = null;
  next.archetypeId = null;
  next.satisfaction = 0;
  next.avatarEmoji = "🧑";
  return next;
}

// Annual processing at age start: rent, wear, repairs, mortgage, value movement
export function simulateAnnualRealEstateTick({ realEstate, age, runSeed, landlordLegacyOn = false }) {
  const safeRe = realEstate && typeof realEstate === "object" ? realEstate : DEFAULT_REAL_ESTATE_STATE;
  const legacyOn = !!landlordLegacyOn;
  const rawPolicy = String(safeRe.landlordPolicy || "balanced");
  const landlordPolicy = (rawPolicy === "strict" || rawPolicy === "balanced" || rawPolicy === "compassionate")
    ? rawPolicy
    : "balanced";

  if (safeRe.lastProcessedAge === age) {
    return {
      nextRealEstate: safeRe,
      moneyDelta: 0,
      stressDelta: 0,
      summaryLines: []
    };
  }

  const properties = Array.isArray(safeRe.properties) ? safeRe.properties : [];
  if (properties.length === 0) {
    return {
      nextRealEstate: { ...safeRe, properties: [], lastProcessedAge: age },
      moneyDelta: 0,
      stressDelta: 0,
      summaryLines: []
    };
  }

  let moneyDelta = 0;
  let stressDelta = 0;
  const notable = [];

  const fmtMoney = (n) => Math.round(Number(n) || 0).toLocaleString();

  const updatedProps = properties.map((prop) => {
    const p = { ...prop };
    const t = getRealEstateTemplate(p.templateId);

    // Normalize manager / insurance / tenant (migration-safe)
    p.manager = p.manager && typeof p.manager === "object" ? { ...DEFAULT_MANAGER, ...p.manager } : { ...DEFAULT_MANAGER };
    p.insurance = p.insurance && typeof p.insurance === "object" ? { ...DEFAULT_INSURANCE, ...p.insurance } : { ...DEFAULT_INSURANCE };
    p.tenant = p.tenant && typeof p.tenant === "object" ? { ...DEFAULT_TENANT, ...p.tenant } : { ...DEFAULT_TENANT };

    const allowedStatuses = legacyOn
      ? ["vacant", "occupied", "delinquent", "eviction_notice", "squatting", "legal_case"]
      : ["vacant", "occupied"];

    if (!allowedStatuses.includes(String(p.tenant.status || "vacant"))) {
      p.tenant.status = "vacant";
    }

    const runSeedInt = Number.isFinite(Number(runSeed)) ? Number(runSeed) : hashStringToInt(String(runSeed));
    const baseSeed = runSeedInt + (Number(age) || 0) * 100000 + (hashStringToInt(p.id) % 100000);
    const rng = makeRng(baseSeed);

    const valueBefore = Math.max(0, Number(p.currentValue ?? p.purchasePrice) || 0);
    const vol = t ? t.volatility : 0.12;
    const marketShift = (rng() * vol) - (vol * 0.40); 
    const valueAfter = Math.max(500, Math.round(valueBefore * (1 + marketShift)));
    p.currentValue = valueAfter;

    // Wear & tear
    const baseWear = 2 + Math.floor(rng() * 5); 
    const rentalWear = p.renting ? (1 + Math.floor(rng() * 4)) : 0;
    const renoMitigation = Math.min(2, Number(p.renovation?.level || 0));
    const wear = Math.max(1, baseWear + rentalWear - renoMitigation);

    const condBefore = clamp(Number(p.condition ?? 75), 0, 100);
    let condAfter = clamp(condBefore - wear, 0, 100);

    const costs = estimateAnnualCosts({ ...p, currentValue: valueAfter });
    let maintenance = costs.maintenance;
    let tax = costs.tax;

    let extraExpenses = 0;
    let insurancePremium = 0;
    let mgmtFee = 0;

    const plan = legacyOn ? getInsurancePlan(p.insurance.planId) : getInsurancePlan("none");

    if (legacyOn && plan.id !== "none") {
      insurancePremium = clamp(Math.round(valueAfter * plan.premiumRate), 120, 50000);
      extraExpenses += insurancePremium;
    }

    if (legacyOn) {
      let disasterChance = clamp(0.012 + ((t?.volatility || 0.12) * 0.040), 0.01, 0.06);
      if (p.renting) disasterChance *= 1.15;
      if (condAfter < 50) disasterChance *= 1.25;

      if (rng() < disasterChance) {
        const type = weightedPick([
          { id: "storm", w: 4 },
          { id: "pipe_burst", w: 4 },
          { id: "break_in", w: 3 },
          { id: "flood", w: 2 },
          { id: "fire", w: 1 },
          { id: "mold", w: 2 },
          { id: "tree_fall", w: 2 }
        ], rng);

        const meta = ({
          storm: { emoji: "🌪️", label: "Storm" },
          pipe_burst: { emoji: "🚰", label: "Pipe burst" },
          break_in: { emoji: "🔓", label: "Break-in" },
          flood: { emoji: "🌊", label: "Flood" },
          fire: { emoji: "🔥", label: "Fire" },
          mold: { emoji: "🦠", label: "Mold" },
          tree_fall: { emoji: "🌳", label: "Tree fall" }
        }[type]) || { emoji: "⚠️", label: "Disaster" };

        const s = rng();
        const severity = s < 0.70 ? "minor" : s < 0.95 ? "major" : "catastrophic";

        const minorDamage = clamp(Math.round(valueAfter * (0.004 + rng() * 0.010)), 400, 60000);
        const majorDamage = clamp(Math.round(valueAfter * (0.012 + rng() * 0.025)), 1500, 180000);
        const catDamage   = clamp(Math.round(valueAfter * (0.035 + rng() * 0.070)), 6000, 450000);

        const damage = severity === "minor" ? minorDamage : severity === "major" ? majorDamage : catDamage;

        const condHit =
          severity === "minor" ? Math.floor(6 + rng() * 9) :
          severity === "major" ? Math.floor(15 + rng() * 21) :
          Math.floor(30 + rng() * 31);

        condAfter = clamp(condAfter - condHit, 0, 100);

        const payoutCap = Math.round(valueAfter * 0.25);

        if (plan.id !== "none") {
          const coveredBase = Math.max(0, damage - plan.deductible);
          let payout = Math.round(coveredBase * plan.disasterCoverage);
          payout = clamp(payout, 0, payoutCap);
          const playerPays = damage - payout;

          maintenance += playerPays;

          p.insurance.lastClaimAge = age;
          p.insurance.lastPayout = payout;
          p.insurance.lastDisaster = type;

          notable.push(`${meta.emoji} ${meta.label} damage at ${p.name || t?.label || "a property"}. Insurance paid $${fmtMoney(payout)}; you paid $${fmtMoney(playerPays)}.`);
        } else {
          maintenance += damage;
          notable.push(`${meta.emoji} ${meta.label} damage at ${p.name || t?.label || "a property"}. You paid $${fmtMoney(damage)} (no insurance).`);
        }

        stressDelta += severity === "minor" ? 0.25 : severity === "major" ? 0.55 : 0.95;
      }
    }

    // Tenant mechanics + rent

    let rentCollected = 0;
    let tenantEvent = null;

    const propName = p.name || t?.label || "a property";
    const tenantStatusAtStart = String(p.tenant.status || "vacant");
    const managerEnabled = legacyOn && !!p.manager?.enabled;

    // Rent due (used for manager fees + hardship)
    const baseRentForYear = Math.max(0, Number(p.rentPerYear ?? t?.baseRent ?? 0));
    const condMultForRent = 0.70 + (condAfter / 100) * 0.30;
    const rentDue = Math.round(baseRentForYear * condMultForRent);

    if (managerEnabled && p.renting) {
      mgmtFee = clamp(Math.round(rentDue * 0.10) + 150, 200, 30000);
      extraExpenses += mgmtFee;
    }

    if (p.renting) {
      // B) Tenant filling
      if (p.tenant.status === "vacant") {
        const renovationLevel = Number(p.renovation?.level || 0);
        const demandMult = t?.demandMult || 1;
        let fillChance = clamp(0.35 + (condAfter / 160) + (Number(p.renovation?.level || 0) * 0.05), 0.25, 0.85);
        if (managerEnabled) fillChance = clamp(fillChance + 0.10, 0.25, 0.95);

        if (rng() < fillChance) {
          p.tenant.status = "occupied";
          p.tenant.startedAge = age;
          p.tenant.strikes = 0;

          if (legacyOn) {
            p.tenant.owed = 0;
            p.tenant.warningSentAge = null;
            p.tenant.evictionStartedAge = null;
            p.tenant.legalStartedAge = null;

            p.tenant.archetypeId = pickTenantArchetype({ templateId: p.templateId, value: valueAfter, rng });
            const a = getTenantArchetype(p.tenant.archetypeId);
            p.tenant.avatarEmoji = a?.emoji || "🧑";

            const baseSat = clamp(
              Math.round(55 + rng() * 25 + (condAfter >= 80 ? 10 : condAfter >= 65 ? 5 : 0)),
              45,
              95
            );
            p.tenant.satisfaction = baseSat;
          }

          p.tenant.owed = 0;
          
          const qRoll = rng();
          if (condAfter >= 85) {
            p.tenant.quality = qRoll < 0.55 ? "good" : qRoll < 0.95 ? "ok" : "rough";
          } else if (condAfter >= 65) {
            p.tenant.quality = qRoll < 0.35 ? "good" : qRoll < 0.85 ? "ok" : "rough";
          } else {
            p.tenant.quality = qRoll < 0.15 ? "good" : qRoll < 0.65 ? "ok" : "rough";
          }
          tenantEvent = `New tenant moved into ${p.name}.`;
        }
      }

      // C) Rent due
      const baseRentPerYear = Number(p.rentPerYear) || (t?.baseRent || 0);
      const rentDue = Math.round(baseRentPerYear * (0.70 + (condAfter / 100) * 0.30));

      // D) Payment outcomes
      if (p.tenant.status === "occupied") {
        const quality = p.tenant.quality || "ok";

        let riskMult = t?.tenantRiskMult || 1;
        let strictHardshipPenalty = false;
        let skipPaymentRoll = false;

        if (legacyOn) {
          if (!p.tenant.archetypeId) {
            p.tenant.archetypeId = pickTenantArchetype({ templateId: p.templateId, value: valueAfter, rng });
          }
          const a = getTenantArchetype(p.tenant.archetypeId);
          p.tenant.avatarEmoji = p.tenant.avatarEmoji || a?.emoji || "🧑";

          riskMult = 1 + (a?.riskAdj || 0);
          if (managerEnabled) riskMult *= 0.85;
          riskMult = clamp(riskMult, 0.70, 1.50);

          if (!Number.isFinite(Number(p.tenant.satisfaction)) || Number(p.tenant.satisfaction) <= 0) {
            const baseSat = clamp(
              Math.round(55 + rng() * 25 + (condAfter >= 80 ? 10 : condAfter >= 65 ? 5 : 0)),
              45,
              95
            );
            p.tenant.satisfaction = baseSat;
          }

          const hardshipChance =
            (a?.hardshipChance || 0) +
            (p.tenant.satisfaction < 50 ? 0.03 : 0) +
            (condAfter < 60 ? 0.03 : 0);

          if (rng() < hardshipChance) {
            if (landlordPolicy === "compassionate") {
              const relief = Math.round(rentDue * 0.25);
              rentCollected = Math.max(0, rentDue - relief);
              p.tenant.satisfaction = clamp(p.tenant.satisfaction + 12, 0, 100);
              stressDelta -= 0.10;
              tenantEvent = `🤝 You gave hardship relief at ${propName} (-$${fmtMoney(relief)} rent).`;
              skipPaymentRoll = true;
            } else if (landlordPolicy === "balanced") {
              rentCollected = Math.round(rentDue * 0.60);
              p.tenant.owed = (Number(p.tenant.owed) || 0) + (rentDue - rentCollected);
              p.tenant.status = "delinquent";
              p.tenant.satisfaction = clamp(p.tenant.satisfaction + 6, 0, 100);
              stressDelta += 0.10;
              tenantEvent = `🧾 Tenant requested relief at ${propName}. You set a payment plan.`;
              skipPaymentRoll = true;
            } else {
              p.tenant.satisfaction = clamp(p.tenant.satisfaction - 10, 0, 100);
              strictHardshipPenalty = true;
              stressDelta += 0.05;
              tenantEvent = `🧾 You refused hardship relief at ${propName}.`;
            }
          }
        }

        if (!skipPaymentRoll) {
          const missBase = quality === "good" ? 0.02 : quality === "ok" ? 0.06 : 0.16;
          const missChance = legacyOn
            ? clamp((missBase * riskMult) + (strictHardshipPenalty ? 0.10 : 0), 0.01, 0.65)
            : missBase;

          const partialBase = quality === "good" ? 0.06 : quality === "rough" ? 0.12 : 0.10;
          const partialChance = clamp(partialBase * riskMult, 0, 0.70);
          
          const roll = rng();
          if (roll < missChance) {
            rentCollected = 0;
            p.tenant.strikes = Number(p.tenant.strikes || 0) + 1;

            if (legacyOn) {
              p.tenant.status = "delinquent";
              p.tenant.owed = (Number(p.tenant.owed) || 0) + rentDue;
            } else {
              p.tenant.owed += rentDue;
              p.tenant.status = "delinquent";
            }

            stressDelta += 0.55;
            tenantEvent = `Missed rent at ${p.name}.`;
          } else if (roll < missChance + partialChance) {
            rentCollected = Math.round(rentDue * 0.60);
            p.tenant.owed += (rentDue - rentCollected);
            p.tenant.strikes += 1;
            p.tenant.status = "delinquent";
            stressDelta += 0.30;
            tenantEvent = `Partial rent payment at ${p.name}.`;
          } else {
            rentCollected = rentDue;
            p.tenant.strikes = 0;
            p.tenant.owed = 0;
            p.tenant.status = "occupied";
          }
        }

        // Turnover check (only if still occupied and paid)
        if (p.tenant.status === "occupied") {
          const quality = p.tenant.quality || "ok";
          let leaveChance = 0.15; // default turnover
          if (quality === "good") leaveChance = 0.08;
          if (quality === "rough") leaveChance = 0.25;
          if (t?.id.includes("apartment")) leaveChance += 0.10;
          
          if (rng() < leaveChance) {
            p.tenant.status = "vacant";
            Object.assign(p.tenant, {
              quality: null, startedAge: null, strikes: 0, owed: 0,
              warningSentAge: null, evictionStartedAge: null, legalStartedAge: null,
              satisfaction: 0, archetypeId: null
            });
            tenantEvent = `Tenant moved out of ${p.name} (natural turnover).`;
          }
        }
      }
      // E) Delinquent
      else if (p.tenant.status === "delinquent") {
        rentCollected = 0; 
        const quality = p.tenant.quality || "ok";
        
        let runnerChance = 0.10;
        if (quality === "good") runnerChance = 0.05;
        if (quality === "rough") runnerChance = 0.14;
        
        if (rng() < runnerChance) {
          p.tenant.status = "vacant";
          Object.assign(p.tenant, {
            quality: null, startedAge: null, strikes: 0, owed: 0,
            warningSentAge: null, evictionStartedAge: null, legalStartedAge: null
          });
          stressDelta += 0.30;
          tenantEvent = `Tenant vanished from ${p.name}. You eat the losses.`;
        } else {
          let cureChance = 0.18;
          if (quality === "good") cureChance = 0.35;
          if (quality === "rough") cureChance = 0.08;
          if (p.tenant.warningSentAge === age - 1) cureChance = Math.min(0.80, cureChance + 0.20);

          if (rng() < cureChance) {
            const curePayment = Math.min(p.tenant.owed, Math.round(rentDue * 0.50));
            rentCollected = curePayment;
            p.tenant.owed -= curePayment;
            if (p.tenant.owed <= 0) {
              p.tenant.owed = 0;
              p.tenant.strikes = 0;
              p.tenant.status = "occupied";
            }
            tenantEvent = `Tenant paid some back-rent at ${p.name}.`;
          } else {
            if (!legacyOn && p.tenant.strikes >= 2) {
              let squatChance = 0.12;
              if (quality === "good") squatChance = 0.05;
              if (quality === "rough") squatChance = 0.28;
              if (p.tenant.warningSentAge === age - 1) squatChance = Math.max(0, squatChance - 0.10);
              if (condAfter < 50) squatChance += 0.08;

              if (rng() < squatChance) {
                p.tenant.status = "squatting";
                stressDelta += 0.85;
                tenantEvent = `Squatter situation at ${p.name}. Legal help needed.`;
              }
            }
          }
        }
      }
      // F) Eviction Notice
      else if (p.tenant.status === "eviction_notice") {
        rentCollected = 0;
        const quality = p.tenant.quality || "ok";
        let successChance = 0.75;
        if (quality === "good") successChance = 0.85;
        if (quality === "rough") successChance = 0.60;
        if (condAfter > 80) successChance += 0.05;
        if (condAfter < 45) successChance -= 0.05;
        successChance = clamp(successChance, 0.35, 0.95);

        if (rng() < successChance) {
          p.tenant.status = "vacant";
          Object.assign(p.tenant, {
            quality: null, startedAge: null, strikes: 0, owed: 0,
            warningSentAge: null, evictionStartedAge: null, legalStartedAge: null
          });
          stressDelta += 0.20;
          tenantEvent = `Eviction succeeded at ${p.name}.`;
        } else {
          p.tenant.status = "squatting";
          stressDelta += 0.95;
          tenantEvent = `Eviction failed at ${p.name}. They’re squatting now.`;
        }
      }
      // G) Squatting
      else if (p.tenant.status === "squatting") {
        rentCollected = 0;
        const squatterDamage = clamp(Math.round(valueAfter * 0.006 + (rng() * 800)), 600, 40000);
        maintenance += squatterDamage;
        const condDrop = clamp(8 + Math.floor(rng() * 12), 8, 20);
        condAfter = clamp(condAfter - condDrop, 0, 100);
        stressDelta += 0.70;
      }
      // Legal Case
      else if (p.tenant.status === "legal_case") {
        rentCollected = 0;
        const legalRetainer = clamp(Math.round(valueAfter * 0.003), 500, 20000);
        maintenance += legalRetainer;
        
        const legalCaseDamage = clamp(Math.round(valueAfter * 0.002 + (rng() * 500)), 300, 25000);
        maintenance += legalCaseDamage;
        const condDrop = clamp(4 + Math.floor(rng() * 8), 4, 12);
        condAfter = clamp(condAfter - condDrop, 0, 100);
        stressDelta += 0.55;

        if (p.tenant.legalStartedAge != null && age - p.tenant.legalStartedAge >= 1) {
          let legalWinChance = 0.85;
          if (p.tenant.quality === "rough") legalWinChance -= 0.10;
          legalWinChance = clamp(legalWinChance, 0.50, 0.95);

          if (rng() < legalWinChance) {
            p.tenant.status = "vacant";
            Object.assign(p.tenant, {
              quality: null, startedAge: null, strikes: 0, owed: 0,
              warningSentAge: null, evictionStartedAge: null, legalStartedAge: null
            });
            stressDelta += 0.20;
            tenantEvent = `Legal services removed the squatter at ${p.name}.`;
          } else {
            stressDelta += 0.35;
            tenantEvent = `Legal case dragged on at ${p.name}.`;
          }
        }
      }
    // Satisfaction tick each year if renting and not vacant
    if (legacyOn && p.renting && p.tenant.status !== "vacant") {
      const policyLocal = landlordPolicy || "balanced";
      let satDelta =
        condAfter >= 85 ? 3 :
        condAfter >= 70 ? 1 :
        condAfter >= 50 ? -2 : -4;
      if (["delinquent","eviction_notice","squatting","legal_case"].includes(p.tenant.status)) satDelta -= 6;
      if (policyLocal === "strict") satDelta -= 3;
      else if (policyLocal === "compassionate") satDelta += 2;
      p.tenant.satisfaction = clamp(Math.round((Number(p.tenant.satisfaction)||0)+satDelta), 0, 100);
    }

    } else {
      // Not renting -> Ensure vacant
      if (!["vacant", "occupied", "delinquent", "eviction_notice", "squatting", "legal_case"].includes(p.tenant.status)) {
        p.tenant.status = "vacant";
        Object.assign(p.tenant, {
          quality: null, startedAge: null, strikes: 0, owed: 0,
          warningSentAge: null, evictionStartedAge: null, legalStartedAge: null
        });
        maintenance = Math.round(maintenance * 0.85);
      }
    }

    // Tenant damage event (Landlord Legacy; Standard/Premium insurance can help)
    if (legacyOn && p.renting && String(p.tenant?.status || "vacant") === "occupied") {
      const propNameLocal = p.name || t?.label || "a property";
      const quality = p.tenant.quality || "ok";

      const archetype = getTenantArchetype(p.tenant.archetypeId);
      let riskMultLocal = 1 + (archetype?.riskAdj || 0);
      if (p.manager?.enabled) riskMultLocal *= 0.85;
      riskMultLocal = clamp(riskMultLocal, 0.70, 1.50);

      const baseDamageChance = quality === "good" ? 0.02 : quality === "ok" ? 0.06 : 0.15;
      const damageChance = clamp(baseDamageChance * riskMultLocal, 0.01, 0.45);

      if (rng() < damageChance) {
        const damageCost = 120 + Math.round(rng() * 900);
        const condHit = 4 + Math.floor(rng() * 12);
        condAfter = clamp(condAfter - condHit, 0, 100);

        const planForTenantDamage =
          (typeof plan !== "undefined" && plan)
            ? plan
            : getInsurancePlan(p.insurance?.planId);

        if (planForTenantDamage.tenantDamageCoverage > 0) {
          const coveredBase = Math.max(0, damageCost - planForTenantDamage.deductible);
          let payout = Math.round(coveredBase * planForTenantDamage.tenantDamageCoverage);
          payout = clamp(payout, 0, Math.round(valueAfter * 0.10));
          const playerPays = damageCost - payout;

          maintenance += playerPays;
          notable.push(`🛡️ Insurance helped with tenant damage at ${propNameLocal}.`);
        } else {
          maintenance += damageCost;
        }

        if (!tenantEvent) tenantEvent = `Property damage at ${propNameLocal} (repairs needed).`;
        stressDelta += 0.30;
      }
    }

    // H) Scale damage / urgent repairs
    if (condAfter < 25) {
      const urgentRepairs = clamp(Math.round(valueAfter * (0.004 + rng() * 0.010)), 500, 50000);
      maintenance += urgentRepairs;
      condAfter = clamp(condAfter + 12, 0, 100);
      notable.push(`🛠️ ${p.name} needed urgent repairs.`);
      stressDelta += 0.40;
    }

    // Mortgage
    let mortgagePaid = 0;
    p.mortgage = p.mortgage && typeof p.mortgage === "object" ? { ...p.mortgage } : { active: false, balance: 0, annualRate: DEFAULT_MORTGAGE_TERMS.annualRate, paymentPerYear: 0, yearsRemaining: 0 };

    if (p.mortgage.active && Number(p.mortgage.balance || 0) > 0) {
      mortgagePaid = Math.round(Number(p.mortgage.paymentPerYear || 0));
      const bal = Math.max(0, Number(p.mortgage.balance || 0));
      const rate = Math.max(0, Number(p.mortgage.annualRate ?? DEFAULT_MORTGAGE_TERMS.annualRate));
      const interest = Math.round(bal * rate);
      const principalPaid = Math.max(0, mortgagePaid - interest);
      const newBal = Math.max(0, Math.round(bal - principalPaid));

      p.mortgage.balance = newBal;
      p.mortgage.yearsRemaining = Math.max(0, Math.round(Number(p.mortgage.yearsRemaining || 0) - 1));

      if (newBal <= 0 || p.mortgage.yearsRemaining <= 0) {
        p.mortgage.active = false;
        p.mortgage.balance = 0;
        p.mortgage.paymentPerYear = 0;
        p.mortgage.yearsRemaining = 0;
      }
    }

    const expenses = maintenance + tax + mortgagePaid + extraExpenses;
    const net = rentCollected - expenses;
    moneyDelta += net;

    p.lastYear = {
      age,
      rentCollected,
      expenses,
      net,
      maintenance,
      tax,
      mortgagePaid,
      valueBefore,
      valueAfter,
      insurancePremium,
      mgmtFee,
      extraExpenses
    };

    p.condition = condAfter;

    if (tenantEvent) notable.push(`🏠 ${tenantEvent}`);
    if (p.renting) stressDelta += (legacyOn && (typeof managerEnabled !== "undefined" ? managerEnabled : !!p.manager?.enabled)) ? 0.02 : 0.08;

    return p;
  });

  const summaryLines = notable.slice(0, 3);

  return {
    nextRealEstate: {
      ...safeRe,
      properties: updatedProps,
      lastProcessedAge: age
    },
    moneyDelta: Math.round(moneyDelta),
    stressDelta: Number(stressDelta.toFixed(2)),
    summaryLines
  };
}