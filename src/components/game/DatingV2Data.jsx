import { generateFamilyPatternsForMatch } from './familyPatterns';
import { DATING_ABOUT_LINES } from './datingAboutLines';
import { computeRandomPartnerCareer } from './jobSystem';
import { generatePartnerWealth } from './relationshipWealthData';

// --- CONSTANTS ---

export const DATING_ROSTER_SIZE = 8;
export const DATING_REFRESH_COST = 250;

export const DATING_AGE_RANGES = [
  { id: 'near_my_age', label: 'Near my age', dynamic: true, years: 5 },
  { id: '18_22', label: '18–22', min: 18, max: 22 },
  { id: '23_32', label: '23–32', min: 23, max: 32 },
  { id: '33_42', label: '33–42', min: 33, max: 42 },
  { id: '43_52', label: '43–52', min: 43, max: 52 },
  { id: '53_65', label: '53–65', min: 53, max: 65 },
  { id: '66_75', label: '66–75', min: 66, max: 75 },
  { id: 'any_18_75', label: 'Any (18–75)', min: 18, max: 75 }
];

// Reused from V1
export const FEMALE_NAMES = [
  'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Ella', 'Elizabeth', 'Camila', 'Luna', 'Sofia', 'Avery', 'Mila', 'Aria',
  'Scarlett', 'Penelope', 'Layla', 'Chloe', 'Victoria', 'Madison', 'Eleanor', 'Grace', 'Nora', 'Riley'
];
export const MALE_NAMES = [
  'Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander',
  'Mason', 'Michael', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Levi', 'Sebastian', 'Mateo',
  'Jack', 'Owen', 'Theodore', 'Aiden', 'Samuel', 'Joseph', 'John', 'David', 'Wyatt', 'Matthew'
];

export const FEMALE_AVATARS = ['👩', '👩‍🦱', '👩‍🦰', '👩‍🦳', '👩🏽', '👩🏾', '👩🏻', '👩‍🎓', '👩‍⚕️', '👩‍🍳', '👩‍💻'];
export const MALE_AVATARS = ['👨', '👨‍🦱', '👨‍🦰', '👨‍🦳', '👨🏽', '👨🏾', '👨🏻', '👨‍🎓', '👨‍⚕️', '👨‍🍳', '👨‍💻'];

export const PROFILE_TAG_POOL = [
  { emoji: '📚', label: 'Bookworm' },
  { emoji: '🐕', label: 'Dog person' },
  { emoji: '🐈', label: 'Cat person' },
  { emoji: '🎧', label: 'Podcast nerd' },
  { emoji: '🍳', label: 'Home cook' },
  { emoji: '🌱', label: 'Plant parent' },
  { emoji: '🏃', label: 'Tries to run' },
  { emoji: '🧘', label: 'Meditates (sometimes)' },
  { emoji: '🎲', label: 'Board games' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '🏛️', label: 'Museum lover' },
  { emoji: '🎶', label: 'Live music' },
  { emoji: '🧺', label: 'Picnic energy' },
  { emoji: '☕', label: 'Coffee ritual' },
  { emoji: '🧠', label: 'Deep talks' },
  { emoji: '😂', label: 'Likes to laugh' },
  { emoji: '🧼', label: 'Clean-ish' },
  { emoji: '🧩', label: 'Puzzle brain' },
  { emoji: '🌮', label: 'Food truck fan' },
  { emoji: '✨', label: 'Soft life' }
];

// New V2 Pools
export const JOB_VIBES = [
  'Teacher', 'Nurse', 'Freelancer', 'Chef', 'Accountant', 'Mechanic', 'Sales Rep', 'Artist',
  'Software Dev', 'Trainer', 'Realtor', 'Barber/Stylist', 'Small Business Owner', 'Barista',
  'Driver', 'Contractor', 'Librarian'
];

export const INTENTS = [
  'Casual', 'Serious', 'Open to co-parenting', 'Not sure yet', 'Prefers child-free'
];

export const QUIRKS = [
  'Night owl', 'Early riser', 'Always late', 'Meal-prep era', 'Gym sometimes',
  'Reads menus first', 'Sends memes', 'Hates phone calls', 'Talks to plants',
  'Overpacks for everything', 'Sings in the car', 'Owns too many mugs'
];

export const KID_VIBES = [
  'Great with kids', 'Good with kids (in small doses)', 'Wants a big family',
  'Open to co-parenting', 'Not sure about kids', 'Prefers child-free'
];

export const VIBE_HINTS = [
  'Feels steady', 'Feels intense', 'Feels unpredictable', 'Feels grounded',
  'Feels emotionally mature', 'Feels chaotic (but fun)'
];

// --- HELPERS ---

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple(arr, count) {
  const pool = [...arr];
  const out = [];
  while (out.length < count && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function getAgeRangeById(id, gameState) {
  const def = DATING_AGE_RANGES.find(r => r.id === id) || DATING_AGE_RANGES[DATING_AGE_RANGES.length - 1]; // fallback 'any'

  if (def.dynamic) {
    const parentAge = (gameState?.parentCareer?.ageAtBirth ?? 28) + (gameState?.currentYear ?? 0);
    const min = clamp(parentAge - def.years, 18, 75);
    const max = clamp(parentAge + def.years, 18, 75);
    return { ...def, min: Math.min(min, max), max: Math.max(min, max) };
  }
  return def;
}

// --- GENERATOR ---

export function generateDatingRoster({ gameState, preference, ageRangeId, excludeSignatures = [], seenSignatures = [], size = 8 }) {
  const roster = [];
  const range = getAgeRangeById(ageRangeId, gameState);
  
  // Player Stats for Compatibility
  const pStats = gameState.stats || {};
  const playerAxes = {
    social: clamp((pStats.confidence || 0) / 20, 0, 1),
    structure: clamp((pStats.discipline || 0) / 20, 0, 1),
    career: clamp((pStats.intelligence || 0) / 20, 0, 1),
    warmth: clamp((pStats.empathy || 0) / 20, 0, 1)
  };

  const usedNamesThisBatch = new Set();

  for (let i = 0; i < size; i++) {
    let profile = null;
    let attempts = 0;

    while (!profile && attempts < 20) {
      attempts++;

      // Gender Logic
      let gender = 'woman';
      if (preference === 'men') gender = 'man';
      else if (preference === 'anyone') gender = Math.random() < 0.5 ? 'woman' : 'man';
      else gender = 'woman'; // default

      // Name & Avatar
      const namePool = gender === 'man' ? MALE_NAMES : FEMALE_NAMES;
      const avatarPool = gender === 'man' ? MALE_AVATARS : FEMALE_AVATARS;
      
      const name = pick(namePool);
      if (usedNamesThisBatch.has(name)) continue; // Try distinct names per roster

      // Age
      const age = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

      // Avatar selection (older weighting)
      let avatar = pick(avatarPool);
      if (age >= 60 && Math.random() < 0.6) {
        // Try to find the older avatar variants specifically if possible, 
        // but since we just have a flat list, we'll just pick again and hope or map specific indices if we knew them.
        // The list is short: ['👩','👩‍🦱','👩‍🦰','👩‍🦳'...] 👩‍🦳 is index 3.
        // Let's explicitly pick the white hair variants if available in standard set
        const olderVariant = gender === 'man' ? '👨‍🦳' : '👩‍🦳';
        if (avatarPool.includes(olderVariant)) avatar = olderVariant;
      }

      // Fields
      const jobVibe = pick(JOB_VIBES);
      const intent = pick(INTENTS);
      const quirk = pick(QUIRKS);
      const kidVibe = pick(KID_VIBES);
      const vibeHint = pick(VIBE_HINTS);
      const about = pick(DATING_ABOUT_LINES);
      const tags = pickMultiple(PROFILE_TAG_POOL, 3);

      // Signature
      const signature = `${name}|${age}|${jobVibe}|${intent}|${quirk}|${kidVibe}`;

      // Deterministic career + wealth for this profile (we show only tier; exact amount is hidden until marriage)
      const careerSeed = `${gameState?.runSeed || 0}|datingCareer|${signature}`;
      const estCareer = computeRandomPartnerCareer({
        seed: careerSeed,
        ageAtBirth: gameState?.parentCareer?.ageAtBirth || 30
      });

      const wealthSeed = `${gameState?.runSeed || 0}|datingWealth|${signature}`;
      const wealth = generatePartnerWealth({
        seed: wealthSeed,
        age,
        estimatedIncome: estCareer.yearlyIncome
      });

      // Exclusions
      if (excludeSignatures.includes(signature)) continue;
      
      // Soft seen check (skip if seen recently, but allow if attempts getting high)
      if (attempts < 10 && seenSignatures.includes(signature)) continue;

      // Compatibility Math
      const values = {
        social: Math.random(),
        structure: Math.random(),
        career: Math.random(),
        warmth: Math.random()
      };

      const diffs = [
        Math.abs(playerAxes.social - values.social),
        Math.abs(playerAxes.structure - values.structure),
        Math.abs(playerAxes.career - values.career),
        Math.abs(playerAxes.warmth - values.warmth)
      ];
      
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / 4;
      let rawScore = Math.round((1 - avgDiff) * 100);

      // Parenting Realism Modifier
      if (kidVibe === 'Prefers child-free' || intent === 'Prefers child-free') {
        rawScore -= 15;
      }
      
      const compatibilityScore = clamp(rawScore, 0, 100);

      let matchStrength = 'Long shot';
      if (compatibilityScore >= 75) matchStrength = 'Strong match';
      else if (compatibilityScore >= 55) matchStrength = 'Decent chance';

      // Family Patterns
      const patterns = generateFamilyPatternsForMatch();

      profile = {
        id: `v2_${Date.now()}_${i}_${Math.floor(Math.random()*1000)}`,
        name,
        age,
        gender,
        avatar,
        about,
        tags,
        jobVibe,
        intent,
        quirk,
        kidVibe,
        vibeHint,
        values,
        compatibilityScore,
        matchStrength,
        patternIds: patterns.patternIds,
        patternSev: patterns.patternSev,
        createdAtAge: gameState.currentYear || 0,
        signature,
        estimatedIncome: estCareer.yearlyIncome,
        wealthAmount: wealth.amount,
        wealthTierId: wealth.tierId,
        wealthLabel: wealth.label,
        wealthEmoji: wealth.emoji
      };
      
      usedNamesThisBatch.add(name);
    }

    if (profile) roster.push(profile);
  }

  return roster;
}