// Adult Crime Engine - safe-by-default, standalone

export const DEFAULT_ADULT_CRIME_STATE = {
  heat: 0,
  record: 0,
  skill: 0,
  crew: 0,
  probationYears: 0,
  openCases: [],
  attemptsThisYear: 0,
  queuedCourtCases: []
};

function clampNumber(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function ensureAdultCrimeState(adultCrime) {
  const ac = adultCrime && typeof adultCrime === "object" ? adultCrime : {};
  return {
    ...DEFAULT_ADULT_CRIME_STATE,
    ...ac,
    heat: clampNumber(ac.heat, 0, 100, 0),
    record: clampNumber(ac.record, 0, 9999, 0),
    skill: clampNumber(ac.skill, 0, 100, 0),
    crew: clampNumber(ac.crew, 0, 100, 0),
    probationYears: clampNumber(ac.probationYears, 0, 99, 0),
    attemptsThisYear: clampNumber(ac.attemptsThisYear, 0, 99, 0),
    openCases: Array.isArray(ac.openCases) ? ac.openCases : [],
    queuedCourtCases: Array.isArray(ac.queuedCourtCases) ? ac.queuedCourtCases : []
  };
}

export function processAdultCrimeYearEnd(state) {
  const s = state && typeof state === "object" ? state : {};
  const adultCrime0 = ensureAdultCrimeState(s.adultCrime);

  // 1) annual decay + reset
  const nextAdultCrime = {
    ...adultCrime0,
    heat: Math.max(0, adultCrime0.heat - 8),
    probationYears: Math.max(0, adultCrime0.probationYears - 1),
    attemptsThisYear: 0,
    queuedCourtCases: Array.isArray(adultCrime0.queuedCourtCases) ? adultCrime0.queuedCourtCases : []
  };

  // 2) open cases: safe processing, no crashes
  const openCases = Array.isArray(adultCrime0.openCases) ? adultCrime0.openCases : [];
  const stillOpen = [];
  const newQueued = [...nextAdultCrime.queuedCourtCases];

  for (const c of openCases) {
    if (!c || typeof c !== "object") continue;

    const status = typeof c.status === "string" ? c.status : "open";
    if (status !== "open") {
      stillOpen.push(c);
      continue;
    }

    const severity = clampNumber(c.severity, 1, 5, 1);
    const suspicion = clampNumber(c.suspicion, 0, 100, 20);

    // Cold-case chance rises if time passes / your heat is low
    const coldChance = Math.min(
      0.35,
      0.08 + (nextAdultCrime.skill / 1200) + ((100 - nextAdultCrime.heat) / 800)
    );

    // Escalation chance rises with suspicion, severity, heat, record, and probation
    const arrestChance = Math.min(
      0.45,
      0.03 +
        (severity * 0.03) +
        (suspicion / 500) +
        (nextAdultCrime.heat / 600) +
        (nextAdultCrime.record * 0.01) +
        (nextAdultCrime.probationYears > 0 ? 0.06 : 0)
    );

    const r = Math.random();
    if (r < coldChance) {
      // goes cold: quietly close
      continue; // drop it
    } else if (r < coldChance + arrestChance) {
      // escalates into court queue (delayed consequence)
      newQueued.push({
        caseId: c.id || `case_${Date.now()}`,
        crimeId: c.crimeId || c.offenseId || "unknown",
        severity,
        evidenceTags: Array.isArray(c.evidenceTags) ? c.evidenceTags : [],
        source: "open_case"
      });
      // do not keep it open
      continue;
    } else {
      // remains open, slowly grows suspicion
      stillOpen.push({
        ...c,
        suspicion: Math.min(100, suspicion + 6)
      });
    }
  }

  nextAdultCrime.openCases = stillOpen;
  nextAdultCrime.queuedCourtCases = newQueued;

  return { ...s, adultCrime: nextAdultCrime };
}

function randPick(arr, fallback="") {
  const a = Array.isArray(arr) ? arr.filter(Boolean) : [];
  if (!a.length) return fallback;
  return a[Math.floor(Math.random() * a.length)] || fallback;
}

function clamp01(n, min=0, max=1) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function randomInRange(min, max) {
  const a = Number(min)||0, b = Number(max)||0;
  const lo = Math.min(a,b), hi = Math.max(a,b);
  return Math.round(lo + Math.random() * (hi - lo));
}

export function attemptAdultCrime({ state, crime, approach }) {
  const s = state && typeof state === 'object' ? state : {};
  const adultCrime0 = ensureAdultCrimeState(s.adultCrime);
  const ap = approach || { caughtMod: 0, successMod: 0, payoutMult: 1, heatMult: 1 };
  const pool = (crime && crime.text) || {};

  const caughtChance = clamp01(
    (Number(crime?.baseCaught)||0) + (adultCrime0.heat/200) + (adultCrime0.record*0.02) + (adultCrime0.probationYears>0?0.08:0) - (adultCrime0.skill/250) + (Number(ap.caughtMod)||0),
    0.02,
    0.95
  );

  const wasCaught = Math.random() < caughtChance;
  const evidenceTags = (Array.isArray(crime?.evidenceTagsPool) ? crime.evidenceTagsPool : []).filter(()=> Math.random() < 0.5).slice(0,3);

  if (wasCaught) {
    const quote = randPick(pool.quotes, "I regret my timing.");
    const body = randPick(pool.caught, "You are invited to a very serious chat.");
    return {
      type: 'caught',
      nextPatch: { attemptsThisYear: (adultCrime0.attemptsThisYear||0)+1, heat: Math.min(100, adultCrime0.heat + Math.max(1, Number(crime?.heatGain)||1)) },
      moneyDelta: 0,
      evidenceTags,
      result: { headline: `${crime?.emoji||''} ${crime?.title||'Incident'}`, body, quote }
    };
  }

  const successChance = clamp01(
    (Number(crime?.baseSuccess)||0) + (adultCrime0.skill/220) - (adultCrime0.heat/300) - (adultCrime0.record*0.01) + (Number(ap.successMod)||0),
    0.05,
    0.95
  );

  const success = Math.random() < successChance;
  let payout = 0;
  let heatGain = Math.max(0, Number(crime?.heatGain)||0);
  let skillGain = 0.6;

  const nextPatchBase = { attemptsThisYear: (adultCrime0.attemptsThisYear||0)+1 };

  if (success) {
    payout = Math.round(randomInRange(crime.payoutMin, crime.payoutMax) * (Number(ap.payoutMult)||1));
    heatGain = Math.round(heatGain * (Number(ap.heatMult)||1));
    skillGain = 1 + Math.min(2, Math.ceil((crime.severity||1)/2));

    // Chance of an open case if evidence exists
    const openChance = clamp01(0.2 + (evidenceTags.length*0.1) + ((crime.severity||1)*0.04), 0, 0.6);
    const newOpenCases = Array.isArray(adultCrime0.openCases) ? [...adultCrime0.openCases] : [];
    if (evidenceTags.length>0 && Math.random() < openChance) {
      newOpenCases.push({
        id: `oc_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        crimeId: crime.id,
        severity: Number(crime.severity)||1,
        evidenceTags: [...evidenceTags],
        status: 'open',
        suspicion: 20,
        createdAge: Number(s.currentYear)||0
      });
    }

    const viral = Math.random() < 0.05 ? randPick(pool.viral, "It almost trends. Almost.") : null;
    return {
      type: 'success',
      nextPatch: {
        ...nextPatchBase,
        heat: Math.min(100, adultCrime0.heat + heatGain),
        skill: Math.min(100, adultCrime0.skill + skillGain),
        openCases: (Array.isArray(adultCrime0.openCases) ? newOpenCases : [])
      },
      moneyDelta: payout,
      evidenceTags,
      result: {
        headline: `${crime?.emoji||''} ${crime?.title||'Score'}`,
        body: randPick(pool.success, "Somehow, it works."),
        quote: randPick(pool.quotes, "I did it for the plot."),
        viral
      }
    };
  }

  // fail but not caught
  return {
    type: 'fail',
    nextPatch: {
      ...nextPatchBase,
      heat: Math.min(100, adultCrime0.heat + Math.max(1, Math.round(heatGain*0.5))),
      skill: Math.min(100, adultCrime0.skill + 0.5)
    },
    moneyDelta: 0,
    evidenceTags,
    result: {
      headline: `${crime?.emoji||''} ${crime?.title||'Attempt'}`,
      body: randPick(pool.fail, "It fizzles politely."),
      quote: randPick(pool.quotes, "I panicked with confidence."),
    }
  };
}

export function resolveAdultCourt({ state, crime, courtChoice, evidenceTags }) {
  const s = state && typeof state === 'object' ? state : {};
  const adultCrime0 = ensureAdultCrimeState(s.adultCrime);
  const pool = (crime && crime.text && crime.text.court) || {};
  const judgeLines = (crime && crime.text && crime.text.court && crime.text.court.judge) || [];

  const sev = Number(crime?.severity)||1;
  const evWeight = Math.min(0.3, (Array.isArray(evidenceTags)?evidenceTags.length:0) * 0.06);
  let conviction = 0.35 + (sev*0.08) + evWeight + (adultCrime0.record*0.01) + (adultCrime0.probationYears>0?0.06:0);
  let fine = Math.round(50 * sev + 30 * (Array.isArray(evidenceTags)?evidenceTags.length:0));
  let probation = 0;
  let prisonYears = 0;
  let lawyerCost = 0;

  if (courtChoice === 'plea') {
    conviction = clamp01(conviction + 0.25, 0.2, 0.99);
    fine += 150*sev;
    probation = Math.min(3, Math.max(0, sev-1));
  } else if (courtChoice === 'fight') {
    conviction = clamp01(conviction - 0.12, 0.05, 0.95);
    fine += 80*sev;
  } else if (courtChoice === 'lawyer') {
    lawyerCost = 500 + 400*sev;
    conviction = clamp01(conviction - 0.2, 0.03, 0.9);
    fine += 120*sev;
  } else if (courtChoice === 'charm') {
    conviction = clamp01(conviction - 0.06, 0.05, 0.98);
    fine += 40*sev;
  }

  const convicted = Math.random() < conviction;
  if (convicted) {
    // sentencing
    prisonYears = Math.max(0, Math.round((sev-2) * 0.8 + (Array.isArray(evidenceTags)?evidenceTags.length:0)*0.3 + (adultCrime0.record>0?0.5:0)));
    prisonYears = Math.min(8, prisonYears);
    if (courtChoice === 'plea') prisonYears = Math.max(0, prisonYears - 1);
    if (courtChoice === 'lawyer') prisonYears = Math.max(0, prisonYears - 1);
    probation = Math.max(probation, prisonYears === 0 ? Math.min(4, 1 + Math.floor(sev/2)) : Math.floor(sev/2));
  }

  const recordInc = convicted ? Math.max(1, Math.ceil(sev/2)) : 0;
  const nextPatch = {
    heat: Math.max(0, Math.min(100, adultCrime0.heat + (convicted ? 6 : 2))),
    record: Math.max(0, adultCrime0.record + recordInc),
    probationYears: Math.max(0, Math.min(99, (adultCrime0.probationYears||0) + probation)),
  };

  const courtBody = convicted
    ? randPick(pool.fightLose || pool.plea || [], "Consequences arrive precisely on time.")
    : randPick(pool.fightWin || [], "You thread the needle of relief.");
  const judge = randPick(judgeLines, "Actions have paperwork.");
  const headline = convicted ? "⚖️ Verdict: Guilty-ish" : "⚖️ Verdict: Relief";

  return {
    convicted,
    nextPatch,
    moneyDelta: -Math.max(0, fine + lawyerCost),
    fine,
    lawyerCost,
    probationYears: convicted ? probation : 0,
    prisonYears,
    result: { headline, body: `${courtBody}\n\n${judge}` }
  };
}