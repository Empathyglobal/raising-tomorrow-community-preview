// Generic builder for special-start yearly scenarios
// Builds a playable scenario from the beats table

import { SPECIAL_START_YEARLY_BEATS } from './yearlyBeats/index';

function createSeededRng(seedString) {
  let h = 0;
  const s = String(seedString || "seed");
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  let state = (h >>> 0) || 1;
  const nextFloat = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const pick = (arr) => {
    const a = Array.isArray(arr) ? arr : [];
    if (!a.length) return null;
    return a[Math.floor(nextFloat() * a.length)];
  };
  return { nextFloat, pick };
}

function fmt(tpl, vars) {
  if (!tpl) return "";
  let out = String(tpl);
  Object.entries(vars || {}).forEach(([k, v]) => {
    out = out.split(`{${k}}`).join(String(v));
  });
  return out;
}

const DEFAULT_ROLE_EFFECTS = {
  connect:  { deltas: { empathy: 0.45, confidence: 0.15 }, loveDelta: 2,  stressDelta: 0 },
  teach:    { deltas: { intelligence: 0.45, discipline: 0.15 }, loveDelta: 1,  stressDelta: 0 },
  boundary: { deltas: { discipline: 0.50 }, loveDelta: 0,  stressDelta: 0 },
  avoid:    { deltas: { confidence: -0.15, empathy: -0.10 }, loveDelta: -1, stressDelta: -1 },
  harm:     { deltas: { empathy: -0.35, confidence: -0.25 }, loveDelta: -2, stressDelta: 1 }
};

const PROMPTS = [
  "What do you do?",
  "How do you respond?",
  "What's your move?",
  "How do you handle it?",
  "What happens next?"
];

/**
 * Build a special-start yearly scenario from beats table.
 * @param {Object} params
 * @param {Object} params.state - gameState
 * @param {number} params.age - child age (1-18)
 * @param {number} params.rerollNonce - for wisdom rerolls
 * @returns {Object|null} scenario object or null if no beats exist
 */
export function buildSpecialStartYearScenario({ state, age, rerollNonce = 0 }) {
  const specialStartId = state?.specialStartId;
  if (!specialStartId) return null;

  const beatsTable = SPECIAL_START_YEARLY_BEATS[specialStartId];
  if (!beatsTable) return null;

  const a = Number(age || 0);
  if (a < 1 || a > 18) return null;

  const beat = beatsTable[a];
  if (!beat) return null;

  const childName = state.childName || "your child";
  const rng = createSeededRng(`${state.runSeed || "seed"}|ss_yearly|${specialStartId}|age:${a}|reroll:${rerollNonce}`);

  const promptTail = rng.pick(PROMPTS) || "What do you do?";
  const hookText = `TODAY'S TOPIC: ${beat.topic}`;
  const sceneText = fmt(beat.scene, { childName });
  const scenarioText = `${hookText}\n\n${sceneText}\n\n${promptTail}`;

  // Build choices (A-E)
  const buildChoice = (role, letter) => {
    const choiceDef = beat.choices?.[role];
    if (!choiceDef) {
      // Fallback to defaults
      const eff = DEFAULT_ROLE_EFFECTS[role] || {};
      return {
        id: role,
        role,
        letter,
        text: `(Default ${role} option)`,
        consequence: `You chose ${role}.`,
        deltas: { ...(eff.deltas || {}) },
        loveDelta: eff.loveDelta ?? 0,
        stressDelta: eff.stressDelta ?? 0,
        moneyDelta: 0
      };
    }

    // Start with role defaults
    const baseEff = DEFAULT_ROLE_EFFECTS[role] || {};
    
    // Merge choice-specific overrides
    const deltas = choiceDef.deltas ?? baseEff.deltas ?? {};
    const loveDelta = choiceDef.loveDelta ?? baseEff.loveDelta ?? 0;
    const stressDelta = choiceDef.stressDelta ?? baseEff.stressDelta ?? 0;
    const moneyDelta = choiceDef.moneyDelta ?? 0;

    const choice = {
      id: role,
      role,
      letter,
      text: fmt(choiceDef.text || `Choose ${role}`, { childName }),
      consequence: fmt(choiceDef.consequence || "", { childName }),
      deltas,
      loveDelta,
      stressDelta,
      moneyDelta
    };

    // Include statePatch if present (for custom scenarios that need state updates)
    if (choiceDef.statePatch) {
      choice.statePatch = choiceDef.statePatch;
    }

    return choice;
  };

  const choices = [
    buildChoice("connect", "A"),
    buildChoice("teach", "B"),
    buildChoice("boundary", "C"),
    buildChoice("avoid", "D"),
    buildChoice("harm", "E")
  ];

  return {
    id: `${specialStartId}_year_${a}`,
    title: beat.title,
    age: a,
    topic: beat.topic,
    hookText,
    scenarioText,
    choices,
    meta: {
      packId: "special_start",
      choicePack: "standard",
      category: specialStartId,
      intensity: a >= 12 ? 3 : 2,
      hookId: `${specialStartId}_${a}`
    }
  };
}