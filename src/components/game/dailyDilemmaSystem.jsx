// Daily Parenting Dilemma System
// - Generates a small daily choice with tiny rewards
// - Pause streak (never resets to 0)
// - Integrates with Talk-to-child flow

import { createSeededRng } from './GameStateContext';

const DILEMMA_POOL = [
  {
    id: 'tantrum_store',
    prompt: "Your child melts down at the store. Everyone's watching.",
    choices: [
      { id: 'calm', label: 'Stay calm, name the feeling, leave if needed', effectsHint: 'Empathy +0.1, Stress -0.1' },
      { id: 'distract', label: 'Promise a treat to stop the crying', effectsHint: 'Discipline -0.1, Stress -0.2' },
      { id: 'snap', label: 'Snap: "Stop it. Now."', effectsHint: 'Confidence -0.1, Stress +0.3' }
    ]
  },
  {
    id: 'screen_time_ask',
    prompt: "They beg for more screen time. You're exhausted.",
    choices: [
      { id: 'boundary', label: 'Hold the limit. No guilt.', effectsHint: 'Discipline +0.1, Love -0.05' },
      { id: 'give_in', label: 'Say yes. You need the quiet.', effectsHint: 'Discipline -0.1, Stress -0.1' },
      { id: 'offer_swap', label: 'Offer a swap: "10 minutes if we go outside after."', effectsHint: 'Empathy +0.1, Confidence +0.1' }
    ]
  },
  {
    id: 'sibling_fight',
    prompt: "They're fighting with a sibling/friend. Again.",
    choices: [
      { id: 'mediate', label: 'Mediate: hear both sides, teach repair.', effectsHint: 'Empathy +0.1, Discipline +0.1' },
      { id: 'ignore', label: 'Let them work it out.', effectsHint: 'Responsibility +0.1, Love -0.05' },
      { id: 'yell', label: 'Yell: "Why can\'t you just get along?"', effectsHint: 'Confidence -0.1, Stress +0.2' }
    ]
  },
  {
    id: 'bedtime_resist',
    prompt: 'Bedtime resistance. They want "just 5 more minutes."',
    choices: [
      { id: 'routine', label: "Keep the routine. It's bedtime.", effectsHint: 'Discipline +0.1' },
      { id: 'flex', label: 'Give 5 minutes. Worth the peace.', effectsHint: 'Discipline -0.1, Stress -0.1' },
      { id: 'power_struggle', label: 'Escalate: "I said NOW."', effectsHint: 'Love -0.1, Stress +0.2' }
    ]
  },
  {
    id: 'homework_avoid',
    prompt: "They're avoiding homework. You're tired of reminding.",
    choices: [
      { id: 'coach', label: 'Sit together. Make a micro-plan.', effectsHint: 'Intelligence +0.1, Empathy +0.1' },
      { id: 'let_fail', label: 'Let natural consequences teach.', effectsHint: 'Responsibility +0.1, Love -0.05' },
      { id: 'punish', label: "Punish: \"No fun until it's done.\"", effectsHint: 'Discipline +0.1, Confidence -0.1' }
    ]
  },
  {
    id: 'picky_eating',
    prompt: "They refuse dinner. You cooked it. They're \"not hungry.\"",
    choices: [
      { id: 'offer_backup', label: 'Offer a simple backup (no lecture).', effectsHint: 'Empathy +0.1, Stress -0.1' },
      { id: 'no_backup', label: "No backup meal. They'll eat when hungry.", effectsHint: 'Discipline +0.1, Love -0.05' },
      { id: 'force', label: 'Force it: "You sit until you finish."', effectsHint: 'Confidence -0.1, Stress +0.3' }
    ]
  },
  {
    id: 'mess_cleanup',
    prompt: "Their room is a disaster. You've asked 3 times.",
    choices: [
      { id: 'together', label: 'Clean it together. Make it a game.', effectsHint: 'Discipline +0.1, Empathy +0.1, Stress -0.1' },
      { id: 'consequence', label: 'Set a clear consequence and follow through.', effectsHint: 'Discipline +0.1, Love -0.05' },
      { id: 'do_it_yourself', label: 'Do it yourself. Faster that way.', effectsHint: 'Responsibility -0.1, Stress +0.2' }
    ]
  },
  {
    id: 'public_rudeness',
    prompt: "They're rude to a stranger in public. You're embarrassed.",
    choices: [
      { id: 'teach_moment', label: 'Pull aside. Name what happened. Teach repair.', effectsHint: 'Empathy +0.1, Confidence +0.1' },
      { id: 'apologize_move', label: 'Apologize fast and leave.', effectsHint: 'Stress -0.1, Empathy -0.1' },
      { id: 'shame', label: 'Shame them: "How could you?"', effectsHint: 'Confidence -0.1, Love -0.1, Stress +0.2' }
    ]
  }
];

/**
 * Generate daily dilemma for a specific date
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} seed - runSeed
 * @returns {object} - { id, prompt, choices }
 */
export function getDailyDilemma(dateStr, seed) {
  const fullSeed = `${seed}|dilemma|${dateStr}`;
  const rng = createSeededRng(fullSeed);
  
  const idx = Math.floor(rng.nextFloat() * DILEMMA_POOL.length);
  const base = DILEMMA_POOL[idx];
  
  return {
    id: `${base.id}_${dateStr}`,
    prompt: base.prompt,
    choices: base.choices,
    dateStr
  };
}

/**
 * Apply daily dilemma choice effects
 * @param {object} state - game state
 * @param {string} dilemmaId - dilemma ID
 * @param {string} choiceId - choice ID
 * @param {function} rng - random number generator
 * @returns {object} - { nextState, result }
 */
export function applyDailyDilemmaChoice(state, dilemmaId, choiceId, rng) {
  const next = { ...state };
  
  // Determine effects based on choiceId
  const effects = {
    calm: { empathy: 0.1, stress: -0.1 },
    distract: { discipline: -0.1, stress: -0.2 },
    snap: { confidence: -0.1, stress: 0.3 },
    boundary: { discipline: 0.1, love: -0.05 },
    give_in: { discipline: -0.1, stress: -0.1 },
    offer_swap: { empathy: 0.1, confidence: 0.1 },
    mediate: { empathy: 0.1, discipline: 0.1 },
    ignore: { responsibility: 0.1, love: -0.05 },
    yell: { confidence: -0.1, stress: 0.2 },
    routine: { discipline: 0.1 },
    flex: { discipline: -0.1, stress: -0.1 },
    power_struggle: { love: -0.1, stress: 0.2 },
    coach: { intelligence: 0.1, empathy: 0.1 },
    let_fail: { responsibility: 0.1, love: -0.05 },
    punish: { discipline: 0.1, confidence: -0.1 },
    offer_backup: { empathy: 0.1, stress: -0.1 },
    no_backup: { discipline: 0.1, love: -0.05 },
    force: { confidence: -0.1, stress: 0.3 },
    together: { discipline: 0.1, empathy: 0.1, stress: -0.1 },
    consequence: { discipline: 0.1, love: -0.05 },
    do_it_yourself: { responsibility: -0.1, stress: 0.2 },
    teach_moment: { empathy: 0.1, confidence: 0.1 },
    apologize_move: { stress: -0.1, empathy: -0.1 },
    shame: { confidence: -0.1, love: -0.1, stress: 0.2 }
  };
  
  const effect = effects[choiceId] || {};
  
  // Collectible reward (rotate: sticker or kid quote)
  const roll = rng.nextFloat();
  let collectible = null;
  
  if (roll < 0.5) {
    // Kid quote
    const quotes = [
      'I love you more than dinosaurs.',
      "You're my favorite grown-up.",
      'Can we do this again tomorrow?',
      'I feel safe with you.',
      'You make the best pancakes.',
      "I'm glad you're my parent."
    ];
    const q = quotes[Math.floor(rng.nextFloat() * quotes.length)];
    collectible = {
      type: 'kidQuotes',
      item: {
        id: `quote_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        text: q,
        unlockedAtYear: state.currentYear || 0,
        childName: state.childName || 'Child'
      }
    };
  } else {
    // Sticker
    const stickers = [
      { name: '⭐ Star Parent', id: 'star_parent' },
      { name: '💪 Stayed Calm', id: 'stayed_calm' },
      { name: '🧘 Regulated', id: 'regulated' },
      { name: '🎯 Followed Through', id: 'followed_through' },
      { name: '💖 Connected', id: 'connected' },
      { name: '🌈 Made It Work', id: 'made_it_work' }
    ];
    const s = stickers[Math.floor(rng.nextFloat() * stickers.length)];
    collectible = {
      type: 'stickers',
      item: {
        id: `${s.id}_${Date.now()}`,
        name: s.name,
        unlockedAtDate: new Date().toISOString()
      }
    };
  }
  
  // Rare diamond bonus (1-3%)
  const diamondRoll = rng.nextFloat();
  const diamondBonus = diamondRoll < 0.02 ? 1 : 0;
  
  return {
    nextState: next,
    result: {
      effect,
      collectible,
      diamondBonus
    }
  };
}