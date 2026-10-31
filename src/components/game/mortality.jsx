import { createSeededRng } from './childTraumaSystem'; // Re-using for deterministic RNG

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const MALE_DEATH_PROB = {
  20: 0.0005, 29: 0.0010, 39: 0.0015, 49: 0.0030, 59: 0.0070,
  69: 0.0150, 79: 0.0350, 89: 0.0800, 99: 0.1800, 150: 0.3500,
};

const FEMALE_DEATH_PROB = {
  20: 0.0003, 29: 0.0007, 39: 0.0012, 49: 0.0025, 59: 0.0060,
  69: 0.0130, 79: 0.0300, 89: 0.0700, 99: 0.1600, 150: 0.3200,
};

export function getAnnualDeathProbability(age, genderKey = 'unknown') {
  const table = genderKey === 'female' ? FEMALE_DEATH_PROB : MALE_DEATH_PROB;
  const unknownTable = FEMALE_DEATH_PROB;

  for (const maxAge in table) {
    if (age <= maxAge) {
      if (genderKey === 'unknown') {
        return (table[maxAge] + unknownTable[maxAge]) / 2;
      }
      return table[maxAge];
    }
  }
  return genderKey === 'female' ? 0.3200 : 0.3500; // Max probability
}

export function rollDeathThisYear({ runSeed, personId, currentYear, age, genderKey, mortalityMultiplier = 1.0 }) {
  const seed = `${runSeed}|death|${personId}|${currentYear}`;
  const rng = createSeededRng(seed);
  const probability = getAnnualDeathProbability(age, genderKey);
  const finalProbability = clamp(probability * mortalityMultiplier, 0, 0.95);
  return rng.chance(finalProbability);
}

const CAUSES_OF_DEATH = {
    under40: ['an accident', 'a sudden illness', 'a rare infection'],
    under60: ['a heart attack', 'cancer', 'a sudden illness', 'an accident'],
    under80: ['heart disease', 'cancer', 'a stroke', 'pneumonia', 'complications from a fall'],
    over80: ['old age', 'heart failure', 'pneumonia', 'a stroke', 'a long illness']
};

export function pickCauseOfDeath(age, genderKey, seedKey) {
  const rng = createSeededRng(seedKey);
  let pool = CAUSES_OF_DEATH.over80;
  if (age < 40) pool = CAUSES_OF_DEATH.under40;
  else if (age < 60) pool = CAUSES_OF_DEATH.under60;
  else if (age < 80) pool = CAUSES_OF_DEATH.under80;
  
  return rng.pick(pool);
}