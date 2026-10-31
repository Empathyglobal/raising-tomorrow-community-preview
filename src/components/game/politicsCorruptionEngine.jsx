// Politics Corruption Engine (core loop)
// Purpose: default state, migration helper, deterministic RNG, and core tick logic.
// NOTE: No UI wiring here. Next prompts will hook:
//  - Year/age tick: processPoliticsCorruptionTick(state, { age, phase }, rng)
//  - Politics modal/actions UI: previewCorruptionAction/applyCorruptionAction

// ---- Tunables ----
export const HEAT_DECAY_PER_TICK = 6;              // decay per yearly tick (tune if monthly)
export const HEAT_CLAMP_MIN = 0;
export const HEAT_CLAMP_MAX = 100;
export const MAX_LEADS = 25;
export const MAX_INVESTIGATIONS = 6;
export const MAX_ACTIVE_SCANDALS = 15;

// Stage markers
export const INVEST_STAGE = {
  RUMOR: 0,
  INQUIRY: 1,
  INVESTIGATION: 2,
  CHARGES: 3,
  RESOLUTION: 4,
};

// Defaults
export const DEFAULT_POLITICS_CORRUPTION_STATE = {
  heat: 0,              // 0..100 scrutiny
  favors: 0,            // influence currency
  dirtyMoney: 0,        // abstract resource
  leads: [],            // [{id,type,severity,createdAtTick,hidden,convertBaseChance}]
  investigations: [],   // [{id,originLeadId,stage,progress,severity,public,startedAtTick}]
  actionCount: 0,       // increments per corrupt action (deterministic sequencing)
  lastCorruptTick: null,// last age/year/tick when corrupt action taken
  convictions: 0,       // long-term penalty counter
  recentActions: [],    // last few actions log lines
  transparencyBonusAges: 0, // extra decay for next N ticks when >0
};

/** Merge-safe ensure for corruption state block */
export function ensurePoliticsCorruptionState(existing) {
  const base = DEFAULT_POLITICS_CORRUPTION_STATE;
  const src = existing && typeof existing === 'object' ? existing : {};
  return {
    heat: clamp(Number(src.heat), HEAT_CLAMP_MIN, HEAT_CLAMP_MAX, base.heat),
    favors: nonnegNum(src.favors, base.favors),
    dirtyMoney: nonnegNum(src.dirtyMoney, base.dirtyMoney),
    leads: Array.isArray(src.leads) ? src.leads.slice(-MAX_LEADS) : base.leads,
    investigations: Array.isArray(src.investigations) ? src.investigations.slice(0, MAX_INVESTIGATIONS) : base.investigations,
    actionCount: nonnegNum(src.actionCount, base.actionCount),
    lastCorruptTick: src.lastCorruptTick ?? base.lastCorruptTick,
    convictions: nonnegNum(src.convictions, base.convictions),
    recentActions: Array.isArray(src.recentActions) ? src.recentActions.slice(-5) : [],
    transparencyBonusAges: nonnegNum(src.transparencyBonusAges, 0),
  };
}

function clamp(n, lo, hi, fallback = 0) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(lo, Math.min(hi, v));
}
function nonnegNum(n, fallback = 0) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, v);
}

/** Deterministic RNG (mulberry32) with string/number seed. */
export function makeRng(seed) {
  let s = 0;
  if (typeof seed === 'number' && Number.isFinite(seed)) s = seed >>> 0;
  else {
    const str = String(seed ?? 'seed');
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    s = h >>> 0;
  }
  if (s === 0) s = 0x6D2B79F5;
  let t = s >>> 0;
  const next = function () {
    t += 0x6D2B79F5;
    let r = t; r = Math.imul(r ^ (r >>> 15), r | 1); r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  }; next.nextFloat = next; return next;
}

// ---- Office tier mapping ----
// If repo office IDs differ, extend the map below.
const OFFICE_TIER_MAP = {
  mayor: 0,
  state_rep: 1,
  national_rep: 2,
  president: 3,
};

export function getOfficeTier(officeId) {
  if (!officeId) return 0;
  const key = String(officeId).toLowerCase();
  // Explicit mapping only — align with repo OFFICES ids
  if (Object.prototype.hasOwnProperty.call(OFFICE_TIER_MAP, key)) return OFFICE_TIER_MAP[key];
  return 0;
}

// ---- Corruption UX helpers (pure) ----
export function previewCorruptionAction(state, actionType) {
  const tier = getOfficeTier(state?.politics?.currentOfficeId);
  const tierExposureBase = [0.20, 0.14, 0.09, 0.05][Math.max(0, Math.min(3, tier))];
  const map = {
    accept_bribe: { heat: [5,8], favors: [1,2], dirty: [300,800], exposureMul: 1.0 },
    kickbacks: { heat: [10,16], favors: [1,3], dirty: [800,1800], exposureMul: 1.1 },
    patronage_hire: { heat: [3,6], favors: [2,4], dirty: [0,0], exposureMul: 0.8 },
    pressure_donor: { heat: [4,8], favors: [1,3], dirty: [0,0], war: [400,1200], exposureMul: 0.9 },
    launder_funds: { heat: [6,10], favors: [0,1], dirty: [-800,-200], war: [300,1200], exposureMul: 0.9 },
    cover_up: { heat: [-12,-6], favors: [0,0], dirty: [0,0], exposureMul: 0.35 },
    transparency_push: { heat: [-6,-4], favors: [0,0], dirty: [0,0], exposureMul: 0.2 },
  };
  const def = map[actionType] || { heat:[4,9], favors:[1,1], dirty:[150,300], exposureMul:1 };
  const estHeat = Math.round((def.heat[0]+def.heat[1])/2);
  const estFav = Math.round((def.favors[0]+def.favors[1])/2);
  const exposureChance = Math.max(0, Math.min(1, tierExposureBase * def.exposureMul));
  return {
    actionType,
    estimatedHeatDelta: estHeat,
    estimatedFavorsDelta: estFav,
    estimatedDirtyMoneyDelta: Math.round((def.dirty[0]+def.dirty[1])/2),
    exposureChance,
    notes: 'Abstract preview — outcomes scale by office tier.'
  };
}

// Utility: id
function makeId(prefix = 'id') {
  try { return `${prefix}_${crypto.randomUUID()}`; } catch { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`; }
}

// Utility: cap arrays
function capArray(arr, max) { if (!Array.isArray(arr)) return []; return arr.slice(-max); }

// Office tier-scaled rewards/penalties
const OFFICE_REWARD_MULT = [1.0, 1.6, 2.6, 4.2]; // mayor/state/national/president
const OFFICE_PENALTY_MULT = [1.0, 1.3, 1.8, 2.5];

// ---- Apply corruption action (generates heat + optional lead) ----
export function applyCorruptionAction(state, actionType, rng = makeRng('corruption')) {
  const rand = typeof rng === 'function' ? rng : makeRng('corruption');
  const next = { ...state };
  const pol = { ...(next.politics || {}), corruption: ensurePoliticsCorruptionState(next.politics?.corruption) };
  const c = { ...pol.corruption };
  const age = Number(next.currentYear || 0);

  const tier = getOfficeTier(pol.currentOfficeId);
  const tierExposureBase = [0.20, 0.14, 0.09, 0.05][Math.max(0, Math.min(3, tier))];
  const rewardMult = OFFICE_REWARD_MULT[Math.max(0, Math.min(3, tier))];
  const penaltyMult = OFFICE_PENALTY_MULT[Math.max(0, Math.min(3, tier))];

  // Action effects map (tuneable)
  const A = {
    accept_bribe: { heat:[5,8], favors:[1,2], dirty:[300,800], exposureMul:1.0, leads:[0,2] },
    kickbacks: { heat:[10,16], favors:[1,3], dirty:[800,1800], exposureMul:1.1, leads:[1,2] },
    patronage_hire: { heat:[3,6], favors:[2,4], dirty:[0,0], exposureMul:0.8, leads:[0,1] },
    pressure_donor: { heat:[4,8], favors:[1,3], dirty:[0,0], war:[400,1200], exposureMul:0.9, leads:[0,1] },
    launder_funds: { heat:[6,10], favors:[0,1], dirty:[-800,-200], war:[300,1200], exposureMul:0.9, leads:[0,2] },
    cover_up: { heat:[-12,-6], favors:[0,0], dirty:[0,0], exposureMul:0.35, leads:[0,0] },
    transparency_push: { heat:[-6,-4], favors:[0,0], dirty:[0,0], exposureMul:0.2, leads:[0,0] },
  };
  const def = A[actionType] || A.accept_bribe;

  const pickRange = (arr, mult = 1) => {
    const a = Number(arr?.[0]||0), b = Number(arr?.[1]||0);
    const v = Math.round((a + (b - a) * rand()) * mult);
    return v;
  };

  // Heat delta (penalties scale)
  const heatDelta = def.heat[0] < 0 ? pickRange(def.heat, penaltyMult) : pickRange(def.heat);
  c.heat = clamp(c.heat + heatDelta, HEAT_CLAMP_MIN, HEAT_CLAMP_MAX, c.heat);

  // Resources (rewards scale except embezzle which has own tier logic)
  const favGain = pickRange(def.favors, rewardMult);
  c.favors += favGain;
  const dirtyDelta = pickRange(def.dirty, rewardMult);
  if (dirtyDelta !== 0) c.dirtyMoney = Math.max(0, (c.dirtyMoney || 0) + dirtyDelta);
  const warGain = def.war ? pickRange(def.war, rewardMult) : 0;
  if (warGain) pol.warChest = Math.max(0, (pol.warChest || 0) + warGain);

  // Special behaviors
  if (actionType === 'cover_up') {
    // Try to reduce a lead severity first; small backfire chance increases heat
    let changed = false;
    if ((c.leads || []).length > 0) {
      const idx = Math.floor(rand() * c.leads.length);
      const L = { ...c.leads[idx] };
      L.severity = Math.max(1, (L.severity || 1) - 1);
      c.leads[idx] = L; changed = true;
    }
    // Backfire 20% (scaled by heat)
    const backfireP = Math.min(0.45, 0.20 + (c.heat/100)*0.15);
    if (rand() < backfireP) {
      c.heat = clamp(c.heat + 6 + Math.floor(rand()*4), HEAT_CLAMP_MIN, HEAT_CLAMP_MAX, c.heat);
    }
  }
  if (actionType === 'transparency_push') {
    c.transparencyBonusAges = Math.max(1, (c.transparencyBonusAges||0) + 1);
  }

  // Generate 0..N leads
  const toMake = (() => {
    const [minL, maxL] = def.leads || [0,1];
    return minL + Math.floor(rand() * (maxL - minL + 1));
  })();
  for (let i = 0; i < toMake; i++) {
    const severity = 1 + Math.floor(rand() * 5);
    const convertBaseChance = 0.06 + 0.02 * severity;
    const lead = { id: makeId('lead'), type: actionType, severity, createdAtTick: age, hidden: rand() > 0.4, convertBaseChance };
    c.leads = capArray([...(c.leads || []), lead], MAX_LEADS);
  }

  // Immediate exposure chance → public investigation
  const exposureChance = Math.max(0, Math.min(1, tierExposureBase * (def.exposureMul || 1)));
  if (rand() < exposureChance && (c.investigations || []).length < MAX_INVESTIGATIONS) {
    const sev = 2 + Math.floor(rand() * 4);
    const inv = { id: makeId('inv'), originLeadId: null, stage: INVEST_STAGE.INVESTIGATION, progress: 50 + Math.floor(rand()*26), severity: sev, public: true, startedAtTick: age };
    c.investigations = capArray([...(c.investigations || []), inv], MAX_INVESTIGATIONS);
    // Scandal entry
    const scId = `corruption_${inv.id}`;
    const penalty = 3 + sev * (1 + tier);
    const scandals = Array.isArray(pol.activeScandals) ? [...pol.activeScandals] : [];
    scandals.push({ id: scId, headline: 'Corruption Allegations', body: 'Outlets report a brewing investigation.', lingeringPenalty: penalty, age, type: 'corruption' });
    pol.activeScandals = scandals.slice(-MAX_ACTIVE_SCANDALS);
  }

  // Log recent action
  const label = actionType.replace(/_/g,' ');
  const line = `${label}: heat ${heatDelta>=0?'+':''}${heatDelta}, favors +${favGain}${dirtyDelta?`, dirty ${dirtyDelta>=0?'+':''}${dirtyDelta}`:''}${warGain?`, war +${warGain}`:''}`;
  c.recentActions = capArray([...(c.recentActions || []), line], 5);

  c.actionCount = (c.actionCount || 0) + 1;
  c.lastCorruptTick = age;

  pol.corruption = c;
  next.politics = pol;

  return { nextState: next, result: { success: true, roll: 1, risk: exposureChance, heat: c.heat, favors: c.favors, dirtyMoney: c.dirtyMoney, actionType } };
}

// ---- Core TICK ----
// tickCtx: { age, phase?: 'yearStart'|'yearEnd'|'monthly'|'weekly' }
export function processPoliticsCorruptionTick(state, tickCtx = {}, rng = makeRng('corruption_tick')) {
  const next = { ...state };
  const pol = { ...(next.politics || {}) };
  const corr = ensurePoliticsCorruptionState(pol.corruption);
  const age = Number(tickCtx?.age ?? next.currentYear ?? 0);

  // 1) Heat decay (more decay if last corrupt action is far in the past)
  const lastTick = Number.isFinite(Number(corr.lastCorruptTick)) ? Number(corr.lastCorruptTick) : null;
  let decay = HEAT_DECAY_PER_TICK;
  if (lastTick != null) {
    const gap = Math.max(0, age - lastTick);
    if (gap >= 3) decay += 2; // cool faster with time
    if (gap >= 6) decay += 2; // even more after long quiet period
  }
  if ((corr.transparencyBonusAges || 0) > 0) { decay += 2; corr.transparencyBonusAges = Math.max(0, (corr.transparencyBonusAges||0) - 1); }
  corr.heat = clamp(corr.heat - decay, HEAT_CLAMP_MIN, HEAT_CLAMP_MAX, corr.heat);

  // 2) Leads conversion / decay
  const leads = Array.isArray(corr.leads) ? [...corr.leads] : [];
  const newLeads = [];
  let newInvestigations = Array.isArray(corr.investigations) ? [...corr.investigations] : [];

  for (let i = 0; i < leads.length; i++) {
    const L = leads[i];
    const sev = clamp(L.severity, 1, 5, 1);
    const base = clamp(L.convertBaseChance, 0, 1, 0.06);
    const severityFactor = 0.25 + (sev - 1) * 0.05; // 0.25..0.45
    const convertChance = base * (1 + (corr.heat / 100) * severityFactor);

    const roll = rng();
    if (roll < convertChance && newInvestigations.length < MAX_INVESTIGATIONS) {
      // Convert lead to investigation
      const inv = {
        id: makeId('inv'),
        originLeadId: L.id,
        stage: INVEST_STAGE.INQUIRY, // start at 1
        progress: 10 + Math.floor(rng() * 16), // 10..25
        severity: sev,
        public: false,
        startedAtTick: age,
      };
      newInvestigations.push(inv);
      // do not keep lead
    } else {
      // Optional: low heat → lead severity fades, possible drop
      if (corr.heat < 18 && rng() < 0.15) {
        const newSev = Math.max(1, sev - 1);
        const faded = { ...L, severity: newSev };
        // small chance to drop entirely when weak
        if (newSev === 1 && rng() < 0.10) {
          // drop
        } else {
          newLeads.push(faded);
        }
      } else {
        newLeads.push(L);
      }
    }
  }

  corr.leads = capArray(newLeads, MAX_LEADS);

  // 3) Investigations progress
  const updatedInv = [];
  for (let i = 0; i < newInvestigations.length; i++) {
    const inv = { ...newInvestigations[i] };
    const sev = clamp(inv.severity, 1, 5, 1);
    const heatFactor = 1 + (corr.heat / 100) * 0.5; // up to +50% speed
    const baseProg = 6 + sev * 2; // 8..16 per tick
    inv.progress = clamp(inv.progress + Math.floor(baseProg * heatFactor), 0, 100, inv.progress);

    // Stage thresholds
    if (inv.progress >= 75 && inv.stage < INVEST_STAGE.CHARGES) inv.stage = INVEST_STAGE.CHARGES;
    else if (inv.progress >= 50 && inv.stage < INVEST_STAGE.INVESTIGATION) inv.stage = INVEST_STAGE.INVESTIGATION;
    else if (inv.progress >= 25 && inv.stage < INVEST_STAGE.INQUIRY) inv.stage = INVEST_STAGE.INQUIRY;

    // Becomes public when stage >= 2
    if (inv.stage >= INVEST_STAGE.INVESTIGATION) inv.public = true;

    // Resolve at 100
    if (inv.progress >= 100 && inv.stage < INVEST_STAGE.RESOLUTION) {
      inv.stage = INVEST_STAGE.RESOLUTION;
    }

    updatedInv.push(inv);
  }

  // 4) Resolution outcomes, plus Scandal integration
  const tier = getOfficeTier(pol.currentOfficeId);
  const scandals = Array.isArray(pol.activeScandals) ? [...pol.activeScandals] : [];

  const finalInv = [];
  for (let i = 0; i < updatedInv.length; i++) {
    const inv = updatedInv[i];

    // Ensure scandal entry exists if public
    if (inv.public && inv.stage >= INVEST_STAGE.INVESTIGATION) {
      const scId = `corruption_${inv.id}`;
      const existing = scandals.find(s => s?.id === scId);
      const penalty = 3 + inv.severity * (1 + tier); // stronger for tier & severity
      if (!existing) {
        scandals.push({
          id: scId,
          headline: 'Corruption Allegations (Inquiry)',
          body: 'An inquiry is underway. Details unclear.',
          lingeringPenalty: penalty,
          age: age,
          type: 'corruption',
        });
      } else {
        existing.lingeringPenalty = Math.max(existing.lingeringPenalty || 0, penalty);
        existing.body = inv.stage >= INVEST_STAGE.CHARGES ? 'Charges reported by outlets.' : 'Investigation continues.';
      }
    }

    if (inv.stage === INVEST_STAGE.RESOLUTION) {
      // Decide outcome with deterministic randomness
      const heat = corr.heat;
      const sev = clamp(inv.severity, 1, 5, 1);
      const riskScore = (sev / 5) * 0.5 + (heat / 100) * 0.5; // 0..1 mixture
      const r = rng();

      // Outcome weights: higher riskScore -> worse outcomes likelier
      // cleared, fine, resignation, conviction
      let outcome = 'cleared';
      if (r < Math.max(0.05, 0.20 - riskScore * 0.15)) outcome = 'cleared';
      else if (r < Math.min(0.65, 0.35 + riskScore * 0.25)) outcome = 'fine';
      else if (r < Math.min(0.90, 0.70 + riskScore * 0.20)) outcome = 'resignation';
      else outcome = 'conviction';

      // Apply consequences
      if (outcome === 'fine') {
        // simple money penalty scaled by tier & severity
        const fine = 200 * (tier + 1) * sev; // abstract
        const nextMoney = Math.max(0, Number(next.money || 0) - fine);
        next.money = nextMoney;
      } else if (outcome === 'resignation') {
        // Restore career snapshot when forced out
        const snap = pol.careerBeforeOfficeSnapshot;
        if (snap) {
          next.playerCareer = snap.playerCareer || null;
          next.partnerCareer = snap.partnerCareer || null;
          next.parentCareer = snap.parentCareer || null;
          next.incomeTier = snap.incomeTier || next.incomeTier;
        } else {
          next.playerCareer = null;
        }
        pol.currentOfficeId = null; // lose office
        pol.termEndsAtAge = null;
      } else if (outcome === 'conviction') {
        corr.convictions = (corr.convictions || 0) + 1;
        // spike heat, then will decay next ticks
        corr.heat = clamp(corr.heat + 15 + 5 * tier, HEAT_CLAMP_MIN, HEAT_CLAMP_MAX, corr.heat);
      }

      // Remove related scandal entry (resolved)
      const scId = `corruption_${inv.id}`;
      const idx = scandals.findIndex(s => s?.id === scId);
      if (idx >= 0) scandals.splice(idx, 1);

      // Drop investigation from list (resolved)
      // (We could also archive it; keep simple per constraints)
    } else {
      finalInv.push(inv);
    }
  }

  corr.investigations = capArray(finalInv, MAX_INVESTIGATIONS);
  pol.activeScandals = scandals.slice(-MAX_ACTIVE_SCANDALS);

  pol.corruption = corr;
  next.politics = pol;
  return next;
}