// Golden Moments System
// - Rare special moments that trigger after meaningful actions
// - Deterministic (seeded) to prevent reload reroll
// - Unlocks collectibles

import { createSeededRng } from './GameStateContext';

// Actions that can trigger golden moments
const ELIGIBLE_ACTIONS = new Set([
  'bond',
  'play',
  'tell_bedtime_story',
  'outings',
  'study',
  'outdoorAdventures',
  'naturePlay'
]);

const GOLDEN_MOMENT_TEXTS = [
  {
    title: 'Pure Joy',
    text: "They laugh so hard they can't breathe. You laugh too. Nothing else matters.",
    effects: { love: 1, stress: -1, confidence: 0.5 }
  },
  {
    title: 'Quiet Understanding',
    text: 'No words. Just eye contact and a hug that says everything.',
    effects: { love: 1.5, empathy: 0.5 }
  },
  {
    title: 'Unexpected Wisdom',
    text: "They say something so insightful you have to pause and just… take it in.",
    effects: { love: 0.5, intelligence: 0.5, stress: -0.5 }
  },
  {
    title: 'Perfect Timing',
    text: 'You needed this exact moment. And somehow, it arrived.',
    effects: { love: 1, stress: -1.5 }
  },
  {
    title: 'Pride Moment',
    text: "They do something brave. You see who they're becoming.",
    effects: { love: 1, confidence: 1 }
  },
  {
    title: 'Magic in the Mundane',
    text: "A regular moment turns golden. You'll remember this one.",
    effects: { love: 0.5, happiness: 0.5, stress: -0.5 }
  }
];

/**
 * Check if a golden moment should trigger
 * @param {object} gameState
 * @param {string} actionId
 * @returns {object|null} - golden moment data or null
 */
export function tryTriggerGoldenMoment(gameState, actionId) {
  if (!ELIGIBLE_ACTIONS.has(actionId)) return null;
  
  const age = Number(gameState.currentYear || 0);
  const eventCount = Array.isArray(gameState.yearLog?.events) ? gameState.yearLog.events.length : 0;
  
  const seed = `${gameState.runSeed}|golden|year:${age}|action:${actionId}|count:${eventCount}`;
  const rng = createSeededRng(seed);
  
  // Base chance 2%, modified slightly by love
  const love = Number(gameState.love || 50);
  let chance = 0.02;
  if (love >= 70) chance += 0.01;
  if (love <= 30) chance -= 0.005;
  
  // Cap at 5%
  chance = Math.min(0.05, Math.max(0.005, chance));
  
  const roll = rng.nextFloat();
  if (roll >= chance) return null;
  
  // Pick a golden moment
  const idx = Math.floor(rng.nextFloat() * GOLDEN_MOMENT_TEXTS.length);
  const golden = GOLDEN_MOMENT_TEXTS[idx];
  
  return {
    id: `golden_${age}_${actionId}_${Date.now()}`,
    title: golden.title,
    text: golden.text,
    effects: golden.effects,
    unlockedAtYear: age
  };
}

/**
 * Build a kid quote from golden moment
 */
export function buildGoldenMomentQuote(gameState, goldenMoment) {
  const childName = gameState.childName || 'Child';
  const quotes = [
    "This is my favorite day ever.",
    "I love when we do this.",
    "You're the best.",
    "Can we stay like this forever?",
    "I'm so happy right now."
  ];
  
  const seed = `${gameState.runSeed}|goldenQuote|${goldenMoment.id}`;
  const rng = createSeededRng(seed);
  const text = quotes[Math.floor(rng.nextFloat() * quotes.length)];
  
  return {
    id: `quote_golden_${Date.now()}`,
    text,
    unlockedAtYear: gameState.currentYear || 0,
    childName,
    fromGolden: true
  };
}