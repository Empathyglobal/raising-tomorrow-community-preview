// Child Trauma System (Narrative Mechanic) - "Wounds & Worries"
// ------------------------------------------------------------
import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';
// This is a lightweight, game-facing system. It is NOT a clinical diagnosis.
//
// What it does:
// - Derives potential *event-based* child wounds from major moments (scenarios).
// - Derives potential *climate-based* wounds from chronic stress/low love.
// - Provides a catalog of wound "types" for story flavor and effects.
// - Derives a narrative "Attachment Lean" based on wounds and household climate.
// - Computes a small yearly stat "drift" based on active wounds.

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function hashStringToInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRng(seedString) {
  const seed = hashStringToInt(String(seedString || 'seed'));
  const rand = mulberry32(seed);
  return {
    nextFloat: () => rand(),
    chance: (p) => rand() < clamp(p, 0, 1),
    pick: (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return null;
      return arr[Math.floor(rand() * arr.length)];
    }
  };
}

export const CHILD_TRAUMA_CATALOG = [
 { id:'trust_rupture', label:'Trust Wobble', severityRange:[1,3],
   description:"They start checking your promises like they’re receipts. Warmth still exists—just with more scanning.",
   whatHelps:"Consistent follow‑through + honest repair: ‘I messed up, here’s what I’m doing differently.’",
   effectsHint:"More ‘testing’ behavior; Love gains feel slower when trust is shaky.",
   tags:["belonging"] },

 { id:'separation_anxiety', label:'Cling Alarm', severityRange:[1,3],
   description:"Goodbyes feel like tiny apocalypses. Even a short separation can read as ‘what if forever?’",
   whatHelps:"Predictable routines + clear returns (‘I’ll be back after X’) + calm reunions.",
   effectsHint:"More reassurance needs; Stress can tick up during transitions.",
   tags:["belonging"] },

 { id:'rejection_sensitivity', label:'Rejection Radar', severityRange:[1,3],
   description:"Their brain develops a ‘did you hate me?’ button and keeps leaning on it. Subtext becomes the main text.",
   whatHelps:"Name the feeling, reality-check gently, and practice social repair scripts.",
   effectsHint:"Anxiety drift; Social confidence can wobble after peer hits.",
   tags:["belonging","shame"] },

 { id:'comparison_spiral', label:'Comparison Brain', severityRange:[1,3],
   description:"They start measuring themselves against everyone—like life is an infinite leaderboard with no ‘log off’ button.",
   whatHelps:"Praise process > rank, reduce comparison triggers, help them define ‘my kind of win.’",
   effectsHint:"Happiness drift down; Anxiety drift up; sometimes Responsibility rises (overcompensation).",
   tags:["shame","belonging"] },

 { id:'conflict_fear', label:'Conflict Panic', severityRange:[1,3],
   description:"Raised voices = danger. Even normal disagreement can feel like the start of the end.",
   whatHelps:"Model calm conflict + repair afterward. Show that disagreement doesn’t erase love.",
   effectsHint:"Stress drift up; can boost Empathy (people‑pleasing) as a tradeoff.",
   tags:["threat"] },

 { id:'hypervigilance', label:'Hypervigilance Mode', severityRange:[1,3],
   description:"Their nervous system becomes a smoke alarm: it goes off when toast exists. Always scanning. Always ready.",
   whatHelps:"Predictability, safety cues, soothing routines, and less chaos at home.",
   effectsHint:"Anxiety drift up; Responsibility can rise; Stress drift up a bit.",
   tags:["threat","chaos"] },

 { id:'shame_shutdown', label:'Shame Shutdown', severityRange:[1,3],
   description:"Mistakes feel like identity. They go quiet, small, or numb—like the world is judging their entire existence.",
   whatHelps:"Separate ‘behavior’ from ‘worth’. Warm boundaries. Repair after harsh moments.",
   effectsHint:"Confidence drift down; Discipline can rise (perfectionism) as a tradeoff.",
   tags:["shame"] },

 { id:'instability_worry', label:'Chaos Forecast', severityRange:[1,3],
   description:"They stop trusting ‘normal.’ Plans feel flimsy. Their brain keeps packing an emotional go-bag.",
   whatHelps:"Routines, predictability, and telling the truth in age-appropriate ways (no doom vibes).",
   effectsHint:"Anxiety drift up; Responsibility drift up; Happiness drift down slightly.",
   tags:["chaos","threat"] },

 { id:'loss_grief', label:'Unfinished Grief', severityRange:[1,3],
   description:"Loss gets stuck. They carry it quietly, then it leaks out sideways (sleep, mood, irritability).",
   whatHelps:"Let grief be spoken. Rituals, remembrance, and permission to feel it without rushing them.",
   effectsHint:"Happiness drift down a bit; Empathy can rise over time.",
   tags:["loss"] },

 { id:'grief_shame', label:'Grief = Shame', severityRange:[2,3],
   description:"They learn that sadness is embarrassing. So they hide it… and it gets heavier.",
   whatHelps:"Undo the lesson: normalize grief, apologize, invite feelings back without pressure.",
   effectsHint:"Avoidant coping drift; Confidence drift down; Anxiety drift up.",
   tags:["loss","shame"] }
];


const CATEGORY_TO_TRAUMA_TYPE = {
  loss: 'loss_grief',
  separation: 'separation_anxiety',
  peer_pressure: 'rejection_sensitivity',
  confidence: 'shame_shutdown',
  school: 'shame_shutdown',
  identity: 'rejection_sensitivity',
  authority: 'shame_shutdown',
  aggression: 'conflict_fear',
  relationships: 'trust_rupture',
  digital: 'comparison_spiral',
  sleep: 'hypervigilance',
  boundaries: 'conflict_fear',
  privacy: 'trust_rupture',
  fairness: 'comparison_spiral',
  anxiety: 'hypervigilance',
  future: 'instability_worry',
  safety: 'hypervigilance',
  change: 'instability_worry',
  security: 'instability_worry',
  conflict: 'conflict_fear',
  social: 'rejection_sensitivity',
  values: 'shame_shutdown',
  mental_health: 'shame_shutdown',
  risk: 'hypervigilance',
};

const STICKY_CATEGORIES = new Set(['loss', 'peer_pressure', 'identity', 'authority', 'aggression', 'safety', 'school', 'confidence', 'future']);

function normalizeIntensity(intensity) {
  if (typeof intensity === 'number') return clamp(intensity, 1, 4);
  const s = String(intensity || '').toLowerCase();
  if (s.includes('high')) return 3;
  if (s.includes('med')) return 2;
  return 1;
}

function hasAnyNegativeDeltas(deltas) {
  if (!deltas || typeof deltas !== 'object') return false;
  return Object.values(deltas).some(v => typeof v === 'number' && v < 0);
}

function sumNegativeDeltas(deltas) {
    if (!deltas || typeof deltas !== 'object') return 0;
    return Object.values(deltas).reduce((sum, v) => sum + (typeof v === 'number' && v < 0 ? v : 0), 0);
}

export function computeScenarioTraumaRisk({ role, category, intensity, love, stress, deltas }) {
  let score = 0;
  
  // Role modifiers
  const roleMods = { connect: -1.2, teach: -0.4, boundary: -0.4, avoid: 1.0, harm: 2.0 };
  score += roleMods[role] || 0;

  // Intensity
  const i = normalizeIntensity(intensity);
  const intensityMods = { 1: 0.2, 2: 0.8, 3: 1.6, 4: 2.3 };
  score += intensityMods[i] || 0;

  // Sticky category
  if (STICKY_CATEGORIES.has(category)) {
    score += 0.7;
  }

  // Climate
  if (love <= 45) score += 0.6;
  if (love <= 30) score += 1.2;
  if (stress >= 70) score += 0.6;
  if (stress >= 85) score += 1.2;

  // Negative deltas
  if (hasAnyNegativeDeltas(deltas)) {
      score += 0.5;
      if (sumNegativeDeltas(deltas) <= -1) {
          score += 0.9;
      }
  }

  return score;
}

export function severityFromRiskScore(riskScore) {
  if (riskScore >= 6) return 3;
  if (riskScore >= 4.5) return 2;
  return 1;
}

function pickTraumaTypeId({ category, role }) {
  const normalizedCategory = String(category || '').toLowerCase();
  const mapped = CATEGORY_TO_TRAUMA_TYPE[normalizedCategory];
  if (mapped) return mapped;
  return role === 'harm' ? 'trust_rupture' : 'emotional_scar';
}

export function getChildTraumaCatalogEntry(typeId) {
    return CHILD_TRAUMA_CATALOG.find(e => e.id === typeId) || null;
}

export function maybeTraumaFromScenario({ scenario, activeChoice, gameState, age }) {
  if (!scenario || !activeChoice || !gameState) return null;

  const category = scenario?.meta?.category || scenario?.category || 'misc';
  const role = activeChoice.role || activeChoice?.meta?.choiceRole || 'unknown';
  const intensity = normalizeIntensity(scenario?.meta?.intensity);
  const love = gameState.love;
  const stress = gameState.stress;
  const deltas = activeChoice.deltas;

  // Gate: only consider if risky
  const isRisky = role === 'harm' || role === 'avoid' || intensity >= 3 || STICKY_CATEGORIES.has(category) || love <= 30 || stress >= 80 || hasAnyNegativeDeltas(deltas);
  if (!isRisky) return null;
  
  const riskScore = computeScenarioTraumaRisk({ role, category, intensity, love, stress, deltas });
  if (riskScore <= 1.5) return null;

  const seed = `${gameState.runSeed}|trauma|${age}|${scenario.meta?.hookId || scenario.id}|${activeChoice.letter || ''}`;
  const rng = createSeededRng(seed);

  const trigger =
    (riskScore >= 4.2) ||
    (riskScore >= 3.0 && rng.chance(0.55)) ||
    (riskScore >= 2.2 && rng.chance(0.30)) ||
    (riskScore >= 1.6 && rng.chance(0.15));

  if (!trigger) return null;

  const typeId = pickTraumaTypeId({ category, role });
  const def = getChildTraumaCatalogEntry(typeId) || CHILD_TRAUMA_CATALOG[0];
  const severity = severityFromRiskScore(riskScore);
  
  const because = (role === 'connect' || role === 'teach' || role === 'boundary')
    ? `Because: even handled well, this was a big ${category} moment (intensity ${intensity}) and it lingered.`
    : `Because: a high‑stakes ${category} moment (intensity ${intensity}) + you chose ${activeChoice.letter} (${role}).`;

  return {
    id: `event:${def.id}`,
    kind: 'event',
    typeId: def.id,
    label: def.label,
    description: def.description,
    whatHelps: def.whatHelps,
    effectsHint: def.effectsHint,
    age: Number(age ?? 0),
    severity,
    source: {
      type: 'scenario',
      hookId: scenario.meta?.hookId || null,
      scenarioId: scenario.id || null,
      category,
      choiceRole: role,
      choiceLetter: activeChoice.letter || null,
    },
    because
  };
}

export function mergeTraumaEvents(existing, incoming) {
  const list = Array.isArray(existing) ? existing : [];
  if (!incoming || !incoming.typeId) return list;

  const idx = list.findIndex(t => t && t.typeId === incoming.typeId);
  if (idx === -1) {
    return [
      ...list,
      {
        id: incoming.id || `event:${incoming.typeId}`,
        typeId: incoming.typeId,
        label: incoming.label || 'A hard moment',
        description: incoming.description || '',
        whatHelps: incoming.whatHelps || '',
        effectsHint: incoming.effectsHint || '',
        firstAge: Number.isFinite(incoming.age) ? incoming.age : 0,
        lastAge: Number.isFinite(incoming.age) ? incoming.age : 0,
        count: 1,
        severity: clamp(Number(incoming.severity ?? 1), 1, 3),
        sources: incoming.source ? [incoming.source] : [],
        because: incoming.because
      }
    ];
  }

  const prev = list[idx] || {};
  const next = {
    ...prev,
    label: prev.label || incoming.label,
    description: prev.description || incoming.description,
    whatHelps: prev.whatHelps || incoming.whatHelps,
    effectsHint: prev.effectsHint || incoming.effectsHint,
    lastAge: Math.max(Number(prev.lastAge ?? prev.firstAge ?? 0), Number(incoming.age ?? 0)),
    count: Number(prev.count ?? 1) + 1,
    severity: clamp(Number(prev.severity ?? 1) + clamp(Number(incoming.severity ?? 1) - 1, 0, 2), 1, 3),
    sources: [...(Array.isArray(prev.sources) ? prev.sources : []), ...(incoming.source ? [incoming.source] : [])].slice(-5),
    because: incoming.because // always use latest reason
  };

  const copy = [...list];
  copy[idx] = next;
  return copy;
}


export function maybeTraumaFromClimate({ gameState, age }) {
    const { childClimate, love, stress, runSeed } = gameState;
    if (!childClimate) return null;

    const { lowLoveStreak, highStressStreak } = childClimate;
    if (lowLoveStreak < 2 && highStressStreak < 2) return null;

    let typeId;
    if (highStressStreak >= 2 && stress >= 80) {
        typeId = 'hypervigilance';
    } else if (lowLoveStreak >= 2 && love <= 30) {
        typeId = createSeededRng(`${runSeed}|climate|${age}`).pick(['separation_anxiety', 'trust_rupture']);
    } else if (lowLoveStreak >= 2 && highStressStreak >= 2) {
        typeId = 'instability_worry';
    } else {
        return null;
    }

    let probability = 0.18;
    if (lowLoveStreak >= 3 || highStressStreak >= 3) probability += 0.08;
    if (love <= 25 || stress >= 90) probability += 0.10;
    
    const rng = createSeededRng(`${runSeed}|childClimate|age:${age}`);
    if (!rng.chance(Math.min(0.45, probability))) return null;

    const def = getChildTraumaCatalogEntry(typeId) || CHILD_TRAUMA_CATALOG[0];
    const severity = (lowLoveStreak >= 4 || highStressStreak >= 4) ? 2 : 1;

    return {
        id: `event:${def.id}`,
        typeId: def.id,
        label: def.label,
        description: def.description,
        whatHelps: def.whatHelps,
        effectsHint: def.effectsHint,
        severity,
        age,
        source: { kind: 'climate', category: 'climate', intensity: 2, hookId: 'climate', choiceLetter: null, choiceRole: null, note: `love=${love}, stress=${stress}, streaks=${lowLoveStreak}/${highStressStreak}` },
        because: "Because: the home climate stayed tense for a while (low love / high stress)."
    };
}

export function deriveChildAttachment({ childTraumaEvents, love, stress }) {
    const scores = { secure: 0, anxious: 0, avoidant: 0, mixed: 0 };

    if (love >= 70 && stress <= 35) scores.secure += 3;
    if (love <= 35) scores.anxious += 2;
    if (stress >= 75) scores.mixed += 2;

    (childTraumaEvents || []).forEach(evt => {
        const def = getChildTraumaCatalogEntry(evt.typeId);
        if (!def) return;
        const sev = evt.severity || 1;
        if (def.tags.includes('belonging')) scores.anxious += sev;
        if (def.tags.includes('shame')) scores.avoidant += sev;
        if (def.tags.includes('threat') || def.tags.includes('chaos')) scores.mixed += sev;
        if (def.tags.includes('loss')) scores.anxious += (sev * 0.5);
    });

    let highestStyle = 'secure';
    let maxScore = scores.secure;

    for (const style of ['anxious', 'avoidant', 'mixed']) {
        if (scores[style] > maxScore) {
            maxScore = scores[style];
            highestStyle = style;
        }
    }

    if (highestStyle !== 'secure' && love >= 60 && stress <= 50 && (maxScore - scores.secure) <= 1) {
        highestStyle = 'secure';
    }

    const explanations = {
        secure: "They expect care to show up.",
        anxious: "They crave closeness but worry it’ll vanish.",
        avoidant: "They act fine… and carry feelings alone.",
        mixed: "They want care and fear it at the same time."
    };

    return {
        style: highestStyle.charAt(0).toUpperCase() + highestStyle.slice(1),
        explanationLine: explanations[highestStyle],
        notes: [] 
    };
}

export function computeChildTraumaYearlyDrift({ childTraumaEvents, attachment }) {
  const events = Array.isArray(childTraumaEvents) ? childTraumaEvents : [];
  if (events.length === 0) return null;

  const deltas = { anxiety: 0, responsibility: 0, confidence: 0, happiness: 0 };
  let loveDelta = 0;
  let stressDelta = 0;

  events.forEach((evt) => {
    const def = getChildTraumaCatalogEntry(evt?.typeId);
    if (!def) return;
    const sev = clamp(Number(evt?.severity ?? 1), 1, 3);
    const tags = Array.isArray(def.tags) ? def.tags : [];

    if (tags.includes('threat') || tags.includes('chaos')) {
      deltas.anxiety += 0.12 * sev;
      stressDelta += 0.10 * sev;
      deltas.responsibility += 0.04 * sev; // hypervigilant over-functioning
    }
    if (tags.includes('shame')) {
      deltas.confidence -= 0.12 * sev;
      deltas.responsibility += 0.05 * sev; // perfectionism bump
    }
    if (tags.includes('belonging')) {
      deltas.anxiety += 0.08 * sev;
      deltas.happiness -= 0.08 * sev;
    }
    if (tags.includes('loss')) {
      deltas.happiness -= 0.06 * sev;
    }
  });

  const style = String(attachment?.style || '').toLowerCase();
  if (style === 'anxious') {
    deltas.anxiety += 0.06;
    stressDelta += 0.06;
  } else if (style === 'avoidant') {
    deltas.confidence -= 0.06;
    loveDelta -= 0.10;
  } else if (style === 'mixed') {
    deltas.anxiety += 0.05;
    stressDelta += 0.05;
  }

  // Clamp total drift
  deltas.anxiety = clamp(deltas.anxiety, 0, 0.6);
  deltas.responsibility = clamp(deltas.responsibility, 0, 0.4);
  deltas.confidence = clamp(deltas.confidence, -0.4, 0);
  deltas.happiness = clamp(deltas.happiness, -0.4, 0);
  loveDelta = clamp(loveDelta, -0.3, 0);
  stressDelta = clamp(stressDelta, 0, 0.6);

  const totalImpact = Object.values(deltas).reduce((s, v) => s + Math.abs(v), 0) + Math.abs(loveDelta) + Math.abs(stressDelta);
  if (totalImpact < 0.25) return null;

  return {
    deltas,
    loveDelta,
    stressDelta,
    logLine: "🧠 Emotional weather: {childName} feels a bit more on‑edge this year (old worries echo)."
  };
}

// === Partner Spillover + Single-Parent Load Extensions ===
export function getFamilyPatternEntry(patternId) {
  const id = String(patternId || '');
  const entry = (FAMILY_PATTERN_CATALOG || []).find(p => p.id === id) || null;
  if (!entry) return null;
  return {
    id: entry.id,
    label: entry.label,
    description: entry.short || entry.learn?.whatItCanFeelLike || '',
    tags: []
  };
}

const PARTNER_PATTERN_TO_CHILD_WOUND = {
  EMOTIONAL_NEGLECT: 'separation_anxiety',
  ABANDONMENT_DISAPPEARANCE: 'trust_rupture',
  CHAOTIC_RULES: 'instability_worry',
  EMOTIONAL_ABUSE: 'shame_shutdown',
  CONDITIONAL_LOVE_PERFECTIONISM: 'comparison_spiral',
  WITNESSED_DOMESTIC_VIOLENCE: 'conflict_fear',
  SUBSTANCE_USE_HOME: 'instability_worry',
  GRIEF_LOSS: 'loss_grief',
  FAMILY_SECRETS_BETRAYAL: 'trust_rupture',
  DISCRIMINATION_IDENTITY_STRESS: 'rejection_sensitivity',
  PHYSICAL_ABUSE_HISTORY: 'hypervigilance',
  COMMUNITY_VIOLENCE_EXPOSURE: 'hypervigilance',
  REFUGEE_FORCED_MIGRATION: 'hypervigilance',
  ENMESHMENT: 'rejection_sensitivity',
  PARENTIFICATION: 'instability_worry',
  BOUNDARY_VIOLATION_HISTORY: 'trust_rupture',
};

export function computePartnerSpillLoad({ gameState }) {
  const hasPartner = gameState?.householdType === 'two';
  const partnerName = gameState?.partnerName || gameState?.relationships?.byId?.partner?.name || 'your partner';
  const pp = gameState?.partnerPatterns || {};
  const ids = Array.isArray(pp.selectedIds) ? pp.selectedIds : [];
  const sevById = pp.severityById || {};
  const resolvedById = pp.resolvedById || {};

  const unresolved = ids
    .filter(id => (sevById[id] || 0) > 0 && !resolvedById[id])
    .map(id => ({ patternId: id, label: getFamilyPatternEntry(id)?.label || id, severity: Number(sevById[id] || 0) }));

  unresolved.sort((a, b) => b.severity - a.severity || String(a.patternId).localeCompare(String(b.patternId)));
  const topUnresolved = unresolved.slice(0, 3);
  const spillLoad = topUnresolved.reduce((s, p) => s + (p.severity || 0), 0);

  const love = Number(gameState?.love || 0);
  const stress = Number(gameState?.stress || 0);
  const partnerMeter = Number(gameState?.partnerMeter || 0);

  const buffer = (love >= 70 ? 1 : 0)
    + (partnerMeter >= 65 ? 1 : 0)
    + (stress <= 35 ? 1 : 0)
    + ((gameState?.partnerCounselingBuffer || 0) > 0 ? 1 : 0);

  return { hasPartner, partnerName, topUnresolved, spillLoad, buffer, notes: '' };
}

export function maybeTraumaFromPartnerSpill({ gameState, age }) {
  const load = computePartnerSpillLoad({ gameState });
  if (!load.hasPartner || load.topUnresolved.length === 0) return null;

  const love = Number(gameState?.love || 0);
  const stress = Number(gameState?.stress || 0);
  const sevSum = load.spillLoad;

  let p = 0.08
    + 0.04 * sevSum
    + (stress >= 75 ? 0.10 : 0)
    + (love <= 35 ? 0.08 : 0)
    - (love >= 70 ? 0.08 : 0)
    - ((gameState?.partnerCounselingBuffer || 0) > 0 ? 0.08 : 0);
  p = Math.max(0.05, Math.min(0.55, p));

  const top = load.topUnresolved[0];
  const topId = top?.patternId || 'none';
  const seed = `${gameState?.runSeed || 'seed'}|partnerSpill|age:${age}|top:${topId}`;
  const rng = createSeededRng(seed);
  if (!rng.chance(p)) return null;

  const typeId = PARTNER_PATTERN_TO_CHILD_WOUND[topId] || 'instability_worry';
  const def = getChildTraumaCatalogEntry(typeId) || CHILD_TRAUMA_CATALOG[0];
  const severity = (sevSum >= 6 && stress >= 80) ? 2 : 1;

  const patternLabel = getFamilyPatternEntry(topId)?.label || topId;
  const because = `Because: ${load.partnerName} is still carrying “${patternLabel}”, and it leaked into the home atmosphere.`;
  const whatHelps = "What helps: partner counseling + consistent repair + predictable routines.";

  return {
    id: `event:${def.id}`,
    typeId: def.id,
    label: def.label,
    description: def.description,
    whatHelps,
    effectsHint: def.effectsHint,
    severity,
    age: Number(age || 0),
    source: {
      kind: 'partnerSpill',
      patternId: topId,
      patternLabel,
      spillLoad: load.spillLoad,
      love,
      stress
    },
    because
  };
}

export function maybeTraumaFromSingleParentLoad({ gameState, age }) {
  const hasPartner = gameState?.householdType === 'two';
  if (hasPartner) return null;

  const love = Number(gameState?.love || 0);
  const stress = Number(gameState?.stress || 0);

  let p = (stress >= 75 ? 0.12 : 0)
    + (love <= 35 ? 0.08 : 0)
    + (stress >= 85 ? 0.10 : 0)
    - (love >= 65 ? 0.10 : 0);
  p = Math.max(0.05, Math.min(0.35, p));

  const seed = `${gameState?.runSeed || 'seed'}|singleParentLoad|age:${age}|love:${Math.round(love)}|stress:${Math.round(stress)}`;
  const rng = createSeededRng(seed);
  if (!rng.chance(p)) return null;

  let typeId;
  if (stress >= 85) typeId = 'hypervigilance';
  else if (love <= 30) typeId = rng.pick(['separation_anxiety', 'trust_rupture']) || 'separation_anxiety';
  else typeId = 'instability_worry';

  const def = getChildTraumaCatalogEntry(typeId) || CHILD_TRAUMA_CATALOG[0];
  const severity = (stress >= 85 ? 2 : 1);
  const because = "Because: with one adult in the home, the buffer is thinner when stress stays high — the kid feels it.";
  const whatHelps = "What helps: stable routines + support network + honest reassurance.";

  return {
    id: `event:${def.id}`,
    typeId: def.id,
    label: def.label,
    description: def.description,
    whatHelps,
    effectsHint: def.effectsHint,
    severity,
    age: Number(age || 0),
    source: { kind: 'singleParentLoad', love, stress },
    because
  };
}

// Legacy mapping: child wounds -> adult family patterns
export function mapChildWoundsToAdultPatterns(childTraumaEvents, { familyPatternCatalog } = {}) {
  const catalog = Array.isArray(familyPatternCatalog) && familyPatternCatalog.length
    ? familyPatternCatalog
    : (typeof FAMILY_PATTERN_CATALOG !== 'undefined' ? FAMILY_PATTERN_CATALOG : []);
  const have = new Set(catalog.map(c => c.id));

  const pickExisting = (ids) => ids.find(id => have.has(id));

  const MAP = {
    separation_anxiety: pickExisting(['ABANDONMENT_DISAPPEARANCE']) || null,
    trust_rupture: pickExisting(['EMOTIONAL_NEGLECT','FAMILY_SECRETS_BETRAYAL']) || null,
    conflict_fear: pickExisting(['WITNESSED_DOMESTIC_VIOLENCE']) || null,
    hypervigilance: pickExisting(['COMMUNITY_VIOLENCE_EXPOSURE','POVERTY_SCARCITY','FOOD_HOUSING_INSECURITY']) || null,
    shame_shutdown: pickExisting(['EMOTIONAL_ABUSE','CONDITIONAL_LOVE_PERFECTIONISM']) || null,
    comparison_spiral: pickExisting(['CONDITIONAL_LOVE_PERFECTIONISM','SIBLING_FAVORITISM']) || null,
    instability_worry: pickExisting(['CHAOTIC_RULES','POVERTY_SCARCITY','FOOD_HOUSING_INSECURITY']) || null,
    loss_grief: pickExisting(['GRIEF_LOSS']) || null,
    grief_shame: pickExisting(['GRIEF_LOSS']) || null,
  };

  const fallbackId = have.has('CHILDHOOD_WOUNDS') ? 'CHILDHOOD_WOUNDS' : null;
  const out = {};

  (Array.isArray(childTraumaEvents) ? childTraumaEvents : []).forEach(evt => {
    const typeId = String(evt?.typeId || '').toLowerCase();
    const target = MAP[typeId] || fallbackId;
    if (!target) {
      if (typeof window !== 'undefined' && window?.location?.hostname === 'localhost') {
        try { console.warn('[legacy-map] missing target for', typeId); } catch {}
      }
      return;
    }
    const sev = Math.max(1, Math.min(3, Number(evt?.severity || 1)));
    out[target] = Math.max(Number(out[target] || 0), sev);
  });

  return Object.entries(out).map(([patternId, severity]) => ({ patternId, severity }));
}

// Pet farewell helper: derive trauma if goodbye is handled harshly (E)
export function traumaFromPetFarewellChoice({ choiceLetter, age, petName }) {
  const letter = String(choiceLetter || '').toUpperCase();
  if (letter !== 'E') return null;
  const def = getChildTraumaCatalogEntry('grief_shame') || CHILD_TRAUMA_CATALOG[0];
  return {
    id: `event:${def.id}`,
    typeId: def.id,
    label: def.label,
    description: def.description,
    whatHelps: def.whatHelps,
    effectsHint: def.effectsHint,
    severity: 2,
    age: Number(age || 0),
    source: { type: 'pet_farewell', choiceLetter: letter, petName: petName || null },
    because: `Because: in saying goodbye to ${petName || 'the pet'}, grief was shamed and rushed.`
  };
}