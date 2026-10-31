// Trauma-Relationship Effects System
// How player's family patterns affect relationships with parents/siblings
// Extended with Family Dynamics system for deeper simulation.

import { FAMILY_PATTERN_CATALOG, DEFAULT_PATTERN_SEVERITY } from './familyPatternCatalog';
import { 
  initializeFamilyDynamics,
  getFamilyDynamicsModifiers,
  deriveAttachmentStyle,
  computeActiveScripts
} from './familyDynamics';
import { computeFamilyTraumaLoad } from './familyTraumaLoad';

// Deterministic RNG (Mulberry32)
function hashStringToInt(str) {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function makeRng(seed) {
  let state = seed | 0;
  return function rng() {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pick(list, rng) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(rng() * list.length)];
}



/**
 * Get relationship modifiers for family members based on trauma load + family dynamics
 */
export function getFamilyRelationshipModifier(gameState, personRole) {
  // Only apply to family roles (including in-laws)
  if (!['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'].includes(personRole)) {
    return {
      gainMult: 1.0,
      lossMult: 1.0,
      driftDelta: 0,
      stressAdd: 0,
      triggerChance: 0.02,
      triggerSeverity: 1,
      flavorKeys: []
    };
  }

  // Initialize family dynamics if missing
  if (!gameState.familyDynamics) {
    gameState.familyDynamics = initializeFamilyDynamics(gameState);
  }

  const load = computeFamilyTraumaLoad(gameState);

  if (load.loadScore === 0 && !gameState.familyDynamics.attachmentStyle) {
    return {
      gainMult: 1.0,
      lossMult: 1.0,
      driftDelta: 0,
      stressAdd: 0,
      triggerChance: 0.02,
      triggerSeverity: 1,
      flavorKeys: []
    };
  }

  // Base modifiers (original trauma system)
  let gainMult = 1.0;
  let lossMult = 1.0;
  let driftDelta = 0;
  let stressAdd = 0;
  let triggerChance = 0.02;

  // Scale by loadScore (0..10)
  const loadPct = load.loadScore / 10;
  
  gainMult = 1.0 - (loadPct * 0.25);
  lossMult = 1.0 + (loadPct * 0.25);
  driftDelta = -Math.round(loadPct * 2);
  stressAdd = loadPct * 0.08;
  triggerChance = 0.02 + (loadPct * 0.08);

  // Tag-specific modifiers
  const { shame, threat, chaos, role } = load.tags;

  if (shame >= 6) {
    gainMult *= 0.92;
    triggerChance += 0.02;
  }

  if (threat >= 6) {
    lossMult *= 1.08;
    triggerChance += 0.02;
  }

  if (chaos >= 6) {
    driftDelta -= 1;
  }

  if (role >= 6 && personRole === 'sibling') {
    gainMult *= 0.88;
  }

  // Layer in Family Dynamics modifiers
  const dynamicsMods = getFamilyDynamicsModifiers(gameState, personRole);
  
  gainMult *= dynamicsMods.gainMult;
  lossMult *= dynamicsMods.lossMult;
  triggerChance = Math.max(triggerChance, dynamicsMods.triggerChance);

  // Trigger severity based on loadScore + unresolvedCount
  let triggerSeverity = 1;
  if (load.loadScore >= 7 || load.unresolvedCount >= 3) {
    triggerSeverity = 3;
  } else if (load.loadScore >= 4 || load.unresolvedCount >= 2) {
    triggerSeverity = 2;
  }

  // Flavor keys for text generation
  const flavorKeys = [];
  if (shame >= 4) flavorKeys.push('shame');
  if (threat >= 4) flavorKeys.push('threat');
  if (chaos >= 4) flavorKeys.push('chaos');
  if (role >= 4) flavorKeys.push('role');

  return {
    gainMult: clamp(gainMult, 0.40, 1.10), // Always allow some gain
    lossMult: clamp(lossMult, 1.0, 2.0),
    driftDelta: clamp(driftDelta, -4, 0),
    stressAdd: clamp(stressAdd, 0, 0.15),
    triggerChance: clamp(triggerChance, 0.02, 0.25),
    triggerSeverity,
    flavorKeys
  };
}

/**
 * Roll for a family trigger moment (returns null or trigger object)
 */
export function rollFamilyTriggerMoment({ gameState, person, actionId, rngSeed }) {
  // Check for repair buffer (halves trigger chance)
  const ageData = person.interactionsByAge?.[gameState.currentYear] || {};
  const hasRepairBuffer = !!ageData.repairBuffer;
  
  const modifier = getFamilyRelationshipModifier(gameState, person.role);
  
  let effectiveChance = modifier.triggerChance;
  if (hasRepairBuffer) {
    effectiveChance *= 0.5;
  }

  // Deterministic roll
  const seed = hashStringToInt(rngSeed);
  const rng = makeRng(seed);
  
  if (rng() > effectiveChance) {
    return null;
  }

  // Build trigger moment
  const load = computeFamilyTraumaLoad(gameState);
  
  // Trigger templates by severity
  const TRIGGERS = {
    1: { // Mild
      generic: [
        { title: 'Old script', body: 'You go quiet mid-conversation. They notice.', meterDelta: -2, stressDelta: 0.05 },
        { title: 'Tone misread', body: 'You hear criticism where there wasn\'t any. Small tension.', meterDelta: -2, stressDelta: 0.05 },
        { title: 'Walking on eggshells', body: 'You both tread carefully. It passes, but it was there.', meterDelta: -1, stressDelta: 0.03 }
      ],
      shame: [
        { title: 'Compliment deflection', body: 'They compliment you. You deflect. It lands awkwardly.', meterDelta: -2, stressDelta: 0.04 }
      ],
      threat: [
        { title: 'Defensive spike', body: 'They ask a normal question. You snap before you realize it.', meterDelta: -3, stressDelta: 0.06 }
      ],
      chaos: [
        { title: 'Plan changes, panic follows', body: 'Plans shift. You overreact. They look confused.', meterDelta: -2, stressDelta: 0.05 }
      ],
      role: [
        { title: 'Caretaker reflex', body: 'You try to fix their problem before they finish talking.', meterDelta: -2, stressDelta: 0.04 }
      ]
    },
    2: { // Medium
      generic: [
        { title: 'Old pattern shows up', body: 'You feel 14 again. Not in a fun way.', meterDelta: -4, stressDelta: 0.08 },
        { title: 'Comparison spiral', body: 'Someone mentions a sibling achievement. You shut down.', meterDelta: -3, stressDelta: 0.07 },
        { title: 'Advice turns into lecture', body: 'They give advice. It lands like control. You retreat.', meterDelta: -4, stressDelta: 0.08 }
      ],
      shame: [
        { title: 'Performance pressure', body: 'They ask how you\'re doing. You feel graded. You lie.', meterDelta: -4, stressDelta: 0.08 }
      ],
      threat: [
        { title: 'Fight reflex', body: 'A mild disagreement escalates fast. Old fear kicks in.', meterDelta: -5, stressDelta: 0.10 }
      ],
      chaos: [
        { title: 'Need = burden script', body: 'You need help. You can\'t ask. Distance grows.', meterDelta: -4, stressDelta: 0.09 }
      ],
      role: [
        { title: 'Parentified protector mode', body: 'You manage their emotions before your own. Exhausting.', meterDelta: -3, stressDelta: 0.10 }
      ]
    },
    3: { // Severe
      generic: [
        { title: 'Trigger spiral', body: 'Old wounds resurface. You leave feeling small.', meterDelta: -6, stressDelta: 0.12 },
        { title: 'Safety shutdown', body: 'You shut down mid-conversation. They don\'t get why.', meterDelta: -5, stressDelta: 0.11 },
        { title: 'Invisible wall', body: 'You want closeness. Something stops you. Neither of you name it.', meterDelta: -5, stressDelta: 0.10 }
      ],
      shame: [
        { title: 'Never good enough reflex', body: 'They praise you. It feels fake. You don\'t believe it.', meterDelta: -6, stressDelta: 0.12 }
      ],
      threat: [
        { title: 'Conflict freeze', body: 'Tension arrives. You freeze or flee. No repair happens.', meterDelta: -7, stressDelta: 0.15 }
      ],
      chaos: [
        { title: 'Attachment panic', body: 'They cancel plans. You spiral into "they\'re leaving" mode.', meterDelta: -6, stressDelta: 0.13 }
      ],
      role: [
        { title: 'Parentified resentment', body: 'You resent being the adult again. It shows.', meterDelta: -6, stressDelta: 0.12 }
      ]
    }
  };

  // Pick trigger pool
  const severity = modifier.triggerSeverity;
  const pool = TRIGGERS[severity];
  
  // Use flavor keys to pick specialized trigger if possible
  let candidates = pool.generic;
  if (modifier.flavorKeys.length > 0) {
    const flavor = pick(modifier.flavorKeys, rng);
    if (pool[flavor] && pool[flavor].length > 0) {
      candidates = [...pool[flavor], ...pool.generic];
    }
  }

  const trigger = pick(candidates, rng);
  if (!trigger) {
    return null;
  }

  return {
    title: trigger.title,
    body: `${trigger.body}\n\nOld patterns show up.`,
    meterDelta: trigger.meterDelta,
    stressDelta: trigger.stressDelta,
    tag: modifier.flavorKeys[0] || 'generic',
    patternHintIds: load.topPatternIds.slice(0, 2)
  };
}