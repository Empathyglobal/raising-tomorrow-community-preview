// Focus Sprint utilities: seeded RNG, scoring, ratings, presets

// Simple string hash to uint32
function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// Mulberry32 from uint32 seed -> nextFloat()
export function makeSeededRng(seedStr) {
  let t = hash32(String(seedStr || 'seed')) >>> 0;
  return function nextFloat() {
    t += 0x6D2B79F5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Score function: 0..1 based on distance to target center and target width (normalized 0..1)
// Center = 1.0, edge of zone ~= 0.7, outside smoothly falls off to 0 at far edge
export function scoreAt(position01, targetCenter01, targetWidth) {
  const pos = Math.max(0, Math.min(1, Number(position01 || 0)));
  const center = Math.max(0, Math.min(1, Number(targetCenter01 || 0.5)));
  const width = Math.max(0.02, Math.min(0.6, Number(targetWidth || 0.16)));
  const half = width / 2;
  const d = Math.abs(pos - center);

  if (d <= half) {
    // Inside zone: linear from 1.0 (center) down to 0.7 at edges
    const t = d / half; // 0..1
    return Math.max(0, Math.min(1, 1 - 0.3 * t));
  }
  // Outside zone: fall from 0.7 -> 0 as approach the bar edges
  const maxOutside = Math.max(0.001, 0.5 - half);
  const outside = Math.min(maxOutside, d - half);
  const frac = outside / maxOutside; // 0..1
  // Exponential-ish dropoff (gentler near zone, harsher near edges)
  const val = 0.7 * Math.max(0, 1 - Math.pow(frac, 0.85));
  return Math.max(0, Math.min(1, val));
}

export function ratingFromAverage(avg) {
  const a = Math.max(0, Math.min(1, Number(avg || 0)));
  if (a >= 0.90) return { rating: 'Laser Focus', multiplier: 1.20 };
  if (a >= 0.75) return { rating: 'Locked In', multiplier: 1.12 };
  if (a >= 0.55) return { rating: 'Decent', multiplier: 1.05 };
  return { rating: 'Scattered', multiplier: 0.98 };
}

export const DIFFICULTY_PRESETS = {
  easy:   { targetWidth: 0.30, speed: 1.3 },
  medium: { targetWidth: 0.22, speed: 1.6 },
  hard:   { targetWidth: 0.14, speed: 2.0 }
};