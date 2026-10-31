import { getJobById, ensureNoTrailingZero } from '@/components/game/jobSystem';
import { CAREER_EVENT_DECKS, CAREER_GENERIC_EVENTS } from '@/components/game/careerStoryContent';

export const DEFAULT_PLAYER_CAREER = {
  version: 2,
  employed: false,
  jobId: null,
  jobTitle: null,
  companyName: null,
  jobLevelIndex: 0,
  yearlyIncome: 0,
  performance: 55,
  careerRep: 55,
  networking: 30,
  burnout: 0,
  yearsInJob: 0,
  yearsByJobId: {},
  lastPromotionAge: null,
  lastFiredAge: null,
  flagsByAge: {},
  activeArc: null,
  storyHistory: [],
  totalsByArchetype: {},
  lastProcessedAge: null
};

export function clamp(n, min, max) { const x = Number(n) || 0; return Math.max(min, Math.min(max, x)); }

export function normalizePlayerCareer(raw, gameState) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const merged = { ...DEFAULT_PLAYER_CAREER, ...src };
  // Back-compat inference (only if not explicitly set)
  if (src?.employed == null) {
    if (src?.jobId) {
      merged.employed = true; // Job present implies employed (even if income is 0)
    } else if (src?.yearlyIncome != null) {
      merged.employed = Number(src.yearlyIncome) > 0;
    }
  }
  if (merged.performance == null) merged.performance = 55;
  if (merged.jobLevelIndex == null) merged.jobLevelIndex = 0;
  // Clamp gauges
  merged.performance = clamp(merged.performance, 0, 100);
  merged.careerRep = clamp(merged.careerRep, 0, 100);
  merged.networking = clamp(merged.networking, 0, 100);
  merged.burnout = clamp(merged.burnout, 0, 100);
  // Flags container
  if (!merged.flagsByAge || typeof merged.flagsByAge !== 'object') merged.flagsByAge = {};
  if (!merged.totalsByArchetype || typeof merged.totalsByArchetype !== 'object') merged.totalsByArchetype = {};
  // Job experience map (used for business synergy)
  if (!merged.yearsByJobId || typeof merged.yearsByJobId !== 'object') merged.yearsByJobId = {};
  // Backfill for older saves: treat current job tenure as experience if map is empty
  if (merged.jobId && (merged.yearsInJob || 0) > 0 && Object.keys(merged.yearsByJobId).length === 0) {
    merged.yearsByJobId[merged.jobId] = Number(merged.yearsInJob) || 0;
  }
  // History cap
  const hist = Array.isArray(merged.storyHistory) ? merged.storyHistory : [];
  merged.storyHistory = hist.slice(-80);
  // Title lookup and missing-job fallback
  if (merged.jobId) {
    const job = getJobById(merged.jobId);
    if (!job) {
      // Fallback for removed/unknown jobs (e.g., royal_family)
      const fallbackId = 'stay_at_home_parent';
      const fb = getJobById(fallbackId);
      merged.jobId = fallbackId;
      merged.jobTitle = fb?.title || 'Stay-at-Home Parent';
      merged.jobLevelIndex = 0;
      merged.yearlyIncome = Number(fb?.baseYearlyIncome || 0);
      if (src?.employed == null) merged.employed = true;
    } else if (!merged.jobTitle) {
      merged.jobTitle = job.title;
    }
  }
  // Enforce fallback: always have a baseline job
  if (!merged.jobId) {
    const fallbackId = 'government_assistance';
    const job = getJobById(fallbackId);
    merged.jobId = fallbackId;
    merged.jobTitle = job?.title || 'Government Assistance';
    merged.jobLevelIndex = 0;
    merged.yearlyIncome = Number.isFinite(Number(job?.baseYearlyIncome)) ? Number(job.baseYearlyIncome) : 1000;
    merged.yearsInJob = 0;
    if (src?.employed == null) merged.employed = true; // do not override explicit false
  }

  // Company fallback
  if (!merged.companyName && merged.jobId) {
    merged.companyName = buildCompanyName(gameState?.runSeed || 'seed', merged.jobId);
  }
  return merged;
}

function fameTierIndex(points) {
  const p = Number(points) || 0;
  if (p >= 600) return 4; // global
  if (p >= 300) return 3; // national
  if (p >= 150) return 2; // regional
  if (p >= 50) return 1;  // local
  return 0;               // unknown
}

export function getCareerStatusLabel(career, gameState) {
  const c = career || DEFAULT_PLAYER_CAREER;
  if (!c.employed || !c.jobId) return 'Between Legendary Eras';
  if (c.burnout >= 85) return 'One Email From Hermit Life';
  if (c.performance >= 85) return 'Certified Overachiever';
  if (c.performance <= 30) return 'Bare Minimum Icon';
  if ((c.networking || 0) >= 70) return 'Professional Social Butterfly';
  return 'Respectable Chaos Manager';
}

export function getWealthStatusLabel(gameState) {
  const money = Number(gameState?.money || 0);
  const retirement = Number(gameState?.retirementSavings || 0);
  const net = money + retirement;
  if (net >= 40000) return 'Fancy';
  if (net >= 20000) return 'Comfortable';
  if (net >= 5000) return 'Scrappy';
  return 'Character-Building';
}

function buildCompanyName(seed, jobId) {
  // Special-case: Space jobs get themed org names
  if (jobId === 'aerospace_program') {
    const orgs = [
      'National Space Agency',
      'Orbital Research Directorate',
      'Lunar Science Institute',
      'Deep Space Operations',
      'Planetary Survey Bureau',
      'AeroSpace Systems Lab'
    ];
    let h = 0; const s = String(seed + '|space_agency|' + jobId);
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return orgs[Math.abs(h) % orgs.length];
  }

  if (jobId === 'space_contractor') {
    const orgs = [
      'HelioDyne Aerospace',
      'Kestrel Orbital',
      'Pioneer Launch Systems',
      'Vanta Spaceworks',
      'Kepler Dynamics',
      'Skyforge Industries'
    ];
    let h = 0; const s = String(seed + '|space_private|' + jobId);
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return orgs[Math.abs(h) % orgs.length];
  }

  // Default generator for all other jobs
  const left = ['Bright', 'Moon', 'Snack', 'River', 'Cloud', 'Pixel', 'Kind', 'Cedar', 'Maple', 'Willow'];
  const right = ['Works', 'Studios', 'Logistics', 'Records', 'Systems', 'Collective', 'Labs', 'Partners', 'Holdings'];
  let h = 0; const s = String(seed + '|' + jobId);
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  const L = left[Math.abs(h) % left.length];
  const R = right[Math.abs(h >> 3) % right.length];
  return `${L}${R}`;
}

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}

// Minimal event bank (bigger bank lives in careerStoryContent if present)
const MICRO = [
  { id:'zoom_kid_photobomb', label:'Zoom Kid Photobomb Goes Viral', fame:+20, rep:+1, stress:+1 },
  { id:'printer_beef', label:'Coworker Starts Beef With The Office Printer', perf:+2, stress:+1 },
  { id:'boss_family', label:"Your Boss Says ‘We’re a Family’", rep:+1, stress:+1 },
  { id:'morale_dog', label:"Company Hires A Dog As ‘Chief Morale Officer’", netw:+5, love:+0.5 },
  { id:'one_clip_8m', label:'One Clip, 8M Views, Immediate Regret', fame:+30, rep:-5, stress:+2 }
];

export function processCareerYearEnd({ prevState, newAge }) {
  const gs = prevState || {};
  const career0 = normalizePlayerCareer(gs.playerCareer, gs);
  if (career0.lastProcessedAge === newAge) return { skip: true };
  if (!career0.employed || !career0.jobId) return {
    careerUpdates: { lastProcessedAge: newAge },
    logs: [], timelineEntries: []
  };

  const job = getJobById(career0.jobId);
  const actionAge = Math.max(0, Number(newAge || 0) - 1);
  const flags = (career0.flagsByAge?.[actionAge] || {});

  const didCareerInteractThisYear =
    Boolean(flags?.interacted) ||
    Boolean(flags?.workedHard) ||
    Boolean(flags?.trained) ||
    Boolean(flags?.networked) ||
    Boolean(flags?.tookRisk) ||
    Boolean(flags?.bookGig) ||
    Boolean(flags?.studioSession) ||
    Boolean(flags?.releaseSingle) ||
    Boolean(flags?.tour) ||
    (career0.lastAskedRaiseAge === actionAge) ||
    (career0.lastWorkedHardAge === actionAge);

  let neglectPenaltyApplied = false;

  let perf = career0.performance;
  let burnout = career0.burnout;
  let careerRep = career0.careerRep;
  let networking = career0.networking;
  let yearsInJob = (career0.yearsInJob || 0) + 1;

  // Track cumulative experience by jobId (used for business synergy bonuses)
  const yearsByJobId = { ...(career0.yearsByJobId || {}) };
  if (career0.jobId) {
    yearsByJobId[career0.jobId] = (Number(yearsByJobId[career0.jobId]) || 0) + 1;
  }

  // Performance drift:
  // - If you did ANY career interaction this year, use the normal drift model.
  // - If you did ZERO career interaction this year, apply a harsher neglect decay (-5).
  if (flags.workedHard) {
    perf += 2;
    burnout += 5;
  } else if (!didCareerInteractThisYear) {
    perf -= 5; // ✅ neglect decay
    neglectPenaltyApplied = true;
  } else {
    perf -= (2 + Math.floor((career0.burnout || 0) / 20));
  }

  if ((gs.stress || 0) > 70) perf -= 3;
  perf = clamp(perf, 0, 100);

  // Burnout changes
  if (flags.workedHard) burnout += 8;
  if (flags.trained) burnout += 2;
  if (flags.networked) burnout += 3;
  if ((gs.stress || 0) < 30) burnout -= 4;
  burnout = clamp(burnout, 0, 100);

  // Rep drift
  if (perf >= 80) careerRep += 2;
  if (perf <= 35) careerRep -= 2;
  careerRep = clamp(careerRep, 0, 100);

  const logs = [];
  const timelineEntries = [];

  if (neglectPenaltyApplied) {
    logs.push('📉 No career actions this year: performance slipped (-5).');
    timelineEntries.push({
      kind: 'career',
      title: '📉 Work Neglect',
      detail: 'You took no career actions this year. Performance -5.',
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
  }
  let fameDelta = 0;
  let publicRepDelta = 0;
  let fired = false;
  let promoted = false;

  // Family spillover (career effects)
  let stressDelta = 0;
  let loveDelta = 0;
  let childDeltas = null;

  // Archetype tally and yearly narrative event
  const archetype = job?.archetype || 'corporate';
  const totals = { ...(career0.totalsByArchetype || {}) };
  if (archetype !== 'special') totals[archetype] = (Number(totals[archetype]) || 0) + 1;

  try {
    const rng = mulberry32(Math.abs((gs.runSeed||'seed').length * (newAge+57)));
    if (rng() < 0.35) {
      const deck = CAREER_EVENT_DECKS[archetype] || CAREER_GENERIC_EVENTS || [];
      const recent = new Set((career0.storyHistory || []).slice(-20));
      const pool = deck.filter(e => !recent.has(e.id));
      const ev = (pool.length ? pool : deck)[Math.floor(rng() * (pool.length ? pool.length : deck.length))];
      if (ev) {
        const eff = ev.effects || {};
        const cEff = eff.career || {};
        perf = clamp(perf + (cEff.performance || 0), 0, 100);
        burnout = clamp(burnout + (cEff.burnout || 0), 0, 100);
        careerRep = clamp(careerRep + (cEff.careerRep || 0), 0, 100);
        networking = clamp(networking + (cEff.networking || 0), 0, 100);
        fameDelta += Number(eff.fameDelta || 0);
        publicRepDelta += Number(eff.publicRepDelta || 0);
        if (typeof eff.stressDelta === 'number') stressDelta += eff.stressDelta;
        if (typeof eff.loveDelta === 'number') loveDelta += eff.loveDelta;
        if (eff.childDeltas) childDeltas = { ...(childDeltas || {}), ...eff.childDeltas };
        timelineEntries.push({ kind: 'career_event', title: `💼 ${ev.title}`, detail: ev.detail, moneyDelta: 0, loveDelta: Number(eff.loveDelta||0), stressDelta: Number(eff.stressDelta||0), meta: { jobId: job.id, archetype, eventId: ev.id } });
      }
    }
  } catch {}

  // Promotion roll
  if (Array.isArray(job?.levels) && (career0.jobLevelIndex || 0) < job.levels.length - 1) {
    const base = 4 + Math.min(12, yearsInJob * 2);
    const perfBonus = (perf - 50) * 0.35;
    const repBonus = (careerRep - 50) * 0.20;
    const netBonus = ((networking || 0) - 30) * 0.15;
    const publicRep = Number(gs.reputation || 55);
    const publicBonus = (publicRep - 55) * 0.10;
    const fameIdx = fameTierIndex(gs.famePoints);
    const fameBonus = fameIdx * 3;
    const burnPenalty = burnout > 70 ? -10 : (burnout > 50 ? -5 : 0);
    let chance = clamp(base + perfBonus + repBonus + netBonus + publicBonus + fameBonus + burnPenalty, 2, 60);
    const rng = mulberry32(Math.abs((gs.runSeed||'seed').length * (newAge+31)));
    if (rng() * 100 < chance) {
      // Promote
      promoted = true;
      const nextIdx = (career0.jobLevelIndex || 0) + 1;
      const levelDef = job.levels[nextIdx] || { incomeMult: 1 };
      const base = Number(job.baseYearlyIncome || career0.yearlyIncome || 0);
      let newIncome = Math.round(base * (levelDef.incomeMult || 1));
      newIncome = ensureNoTrailingZero(clamp(newIncome, 0, 25000), base + nextIdx);
      careerRep = clamp(careerRep + 6, 0, 100);
      publicRepDelta += 2;
      if (['actor','musician','content_creator'].includes(job.id)) {
        fameDelta += 5 + Math.floor(nextIdx * 2.5);
      }
      logs.push('📈 Promotion!');
      timelineEntries.push({ kind:'career', title:'📈 Promotion!', detail:`Promoted to ${levelDef.title}. New income $${newIncome.toLocaleString()}/yr`, moneyDelta:0, loveDelta:0, stressDelta:0 });
      // Commit updates
      return {
        careerUpdates: {
          lastProcessedAge: newAge,
          yearsInJob,
          yearsByJobId,
          performance: perf,
          burnout,
          careerRep,
          networking,
          jobLevelIndex: nextIdx,
          lastPromotionAge: newAge,
          yearlyIncome: newIncome,
          totalsByArchetype: totals,
          storyHistory: [...(career0.storyHistory||[]), ...(timelineEntries.filter(e=>e.kind==='career_event').map(e=>e.meta?.eventId||''))].filter(Boolean).slice(-80)
        },
        logs, timelineEntries, fameDelta, publicRepDelta
      };
    }
  }

  // Firing roll (expanded low-performance risk)
  // NOTE: Promotion roll happens earlier and returns early if promoted.
  // That preserves "you can still get promoted" even when performance is slipping.
  if (perf < 45 || burnout > 90) {
    let firedChance =
      2 +
      Math.max(0, 45 - perf) * 1.6 +          // low perf drives risk
      Math.max(0, burnout - 80) * 0.8 -       // severe burnout drives risk
      (careerRep - 50) * 0.2;                 // good rep reduces risk a bit

    // If you totally neglected career actions this year, consequences accelerate.
    if (!didCareerInteractThisYear) firedChance += 8;

    firedChance = clamp(firedChance, 2, 70);

    const rng = mulberry32(Math.abs((gs.runSeed||'seed').length * (newAge+97)));
    if (rng() * 100 < firedChance) {
      fired = true;
      publicRepDelta -= 4;
      logs.push('💼 Let go');
      timelineEntries.push({
        kind:'career',
        title:'💼 Let Go',
        detail:`You were let go from ${career0.jobTitle || 'your job'}.`,
        moneyDelta:0,
        loveDelta:0,
        stressDelta:+2
      });
      return {
        careerUpdates: {
          lastProcessedAge: newAge,
          yearsInJob,
          yearsByJobId,
          performance: perf,
          burnout,
          careerRep: clamp(careerRep - 10, 0, 100),
          networking,
          employed: false,
          yearlyIncome: 0,
          lastFiredAge: newAge,
          totalsByArchetype: totals,
          storyHistory: [...(career0.storyHistory||[]), ...(timelineEntries.filter(e=>e.kind==='career_event').map(e=>e.meta?.eventId||''))].filter(Boolean).slice(-80)
        },
        logs,
        timelineEntries,
        publicRepDelta,
        stressDelta,
        loveDelta,
        childDeltas,
        spilloverStressDelta: Number(job?.parentStressDelta || 0),
        spilloverLoveDelta: Number(job?.parentLoveDelta || 0),
        spilloverChildDeltas: (()=>{ const raw = job?.childDeltas || null; if (!raw) return null; const out={}; Object.entries(raw).forEach(([k,v])=>{ out[k]=Number(v||0)*0.25;}); return out; })()
      };
    } else {
      // Optional but useful warning: only show when neglect penalty hit OR performance is very low
      if (neglectPenaltyApplied || perf < 30) {
        timelineEntries.push({
          kind: 'career',
          title: '⚠️ Performance Warning',
          detail: 'Your job feels less secure. Consider spending Focus on Career actions.',
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 0.5
        });
      }
    }
  }

  // Micro event (0–1 per year)
  const rng = mulberry32(Math.abs((gs.runSeed||'seed').length * (newAge+13)));
  if (rng() < 0.25) {
    const ev = pick(MICRO, rng);
    if (ev) {
      if (ev.fame) fameDelta += ev.fame;
      if (ev.rep) publicRepDelta += ev.rep;
      // minor stress recorded in timeline; parent stat deltas handled by caller if needed
      timelineEntries.push({ kind:'career', title:`🎭 ${ev.label}`, detail:'A work moment spilled into family life.', moneyDelta:0, loveDelta:0, stressDelta:ev.stress ? ev.stress : 0 });
    }
  }

  return {
    careerUpdates: {
      lastProcessedAge: newAge,
      yearsInJob,
      yearsByJobId,
      performance: perf,
      burnout,
      careerRep,
      networking,
            totalsByArchetype: totals,
            storyHistory: [...(career0.storyHistory||[]), ...(timelineEntries.filter(e=>e.kind==='career_event').map(e=>e.meta?.eventId||''))].filter(Boolean).slice(-80)
          }, logs, timelineEntries, fameDelta, publicRepDelta, stressDelta, loveDelta, childDeltas,
          spilloverStressDelta: Number(job?.parentStressDelta || 0),
          spilloverLoveDelta: Number(job?.parentLoveDelta || 0),
          spilloverChildDeltas: (()=>{ const raw = job?.childDeltas || null; if (!raw) return null; const out={}; Object.entries(raw).forEach(([k,v])=>{ out[k]=Number(v||0)*0.25;}); return out; })()
  };
}