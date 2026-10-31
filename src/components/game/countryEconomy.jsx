import COUNTRIES from "./countriesData";

export const PRICING = { LOCAL: "LOCAL", GLOBAL: "GLOBAL" };

export const LEVEL_TO_SCALE = { 1: 0.35, 2: 0.50, 3: 0.70, 4: 0.90, 5: 1.00, 6: 1.30 };

// Fallback to USA if not found
export function getCountryByIso3(iso3) {
  return COUNTRIES.find(c => c.iso3 === iso3) || COUNTRIES.find(c => c.iso3 === "USA");
}

export function getCountryScale(iso3) {
  const country = getCountryByIso3(iso3);
  return LEVEL_TO_SCALE[country.level] || 1.0;
}

export function roundMoney(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? -1 : 1;
  
  if (abs < 100) return sign * (Math.round(abs / 5) * 5);
  if (abs < 1000) return sign * (Math.round(abs / 10) * 10);
  if (abs < 10000) return sign * (Math.round(abs / 50) * 50);
  return sign * (Math.round(abs / 100) * 100);
}

export function localizeAmount(baseAmount, scale, pricingType = PRICING.LOCAL) {
  if (pricingType === PRICING.GLOBAL) {
    return roundMoney(baseAmount);
  }
  return roundMoney(baseAmount * scale);
}

export function delocalizeAmount(localAmount, scale, pricingType = PRICING.LOCAL) {
  if (pricingType === PRICING.GLOBAL) {
    return localAmount;
  }
  if (scale <= 0) return localAmount;
  return localAmount / scale;
}

export function convertLocalBetweenCountries(localAmount, oldScale, newScale, pricingType = PRICING.LOCAL) {
  const base = delocalizeAmount(localAmount, oldScale, pricingType);
  return localizeAmount(base, newScale, pricingType);
}

// Simple seeded PRNG (Mulberry32)
function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Helper to hash string to integer seed
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function pickTenCountries(seed, pinnedIso3) {
  // Use string seed or number
  const seedNum = typeof seed === 'string' ? hashString(seed) : (seed || Date.now());
  const rng = mulberry32(seedNum);
  
  // Clone array
  const pool = [...COUNTRIES];
  
  // Fisher-Yates shuffle with seeded rng
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  // Take first 10 unique
  let selection = pool.slice(0, 10).map(c => c.iso3);
  
  // Ensure pinned is included
  if (pinnedIso3 && !selection.includes(pinnedIso3)) {
    selection[selection.length - 1] = pinnedIso3;
  }
  
  return selection;
}