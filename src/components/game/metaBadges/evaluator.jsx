// Frontend helper utilities for Meta Badges
// computeRunMetrics(run) and evaluateBadge(def, metrics)

export function computeRunMetrics(run) {
  // This mirrors the backend logic; keep in sync if updated
  const years = Array.isArray(run?.years) ? run.years : [];
  const timeline = Array.isArray(run?.timeline) ? run.timeline : [];
  const end = run?.endStats || {};
  const flags = run?.flags || {};

  const loveVals = years.map((y) => Number(y?.love ?? 0));
  const stressVals = years.map((y) => Number(y?.stress ?? 0));
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const roleCounts = { connect: 0, teach: 0, boundary: 0, avoid: 0, harm: 0 };
  const letterCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  let highIntensityEventCount = 0;
  let traumaEventCount = 0;
  let repairOpportunityCount = 0;
  let repairsTakenCount = 0;
  let supportActionCount = 0;

  for (const e of timeline) {
    const role = e?.roleType;
    if (role && roleCounts[role] != null) roleCounts[role]++;
    const letter = e?.choiceLetter;
    if (letter && letterCounts[letter] != null) letterCounts[letter]++;
    if (e?.intensity >= 3) highIntensityEventCount++;
    if (e?.tags?.includes?.('trauma')) traumaEventCount++;
    if (e?.tags?.includes?.('repair_opportunity')) repairOpportunityCount++;
    if (e?.tags?.includes?.('repair_taken')) repairsTakenCount++;
    
    const tags = e?.tags || [];
    if (tags.includes('therapy') || tags.includes('schoolMeeting') || tags.includes('accommodation') || tags.includes('communitySupport')) {
      supportActionCount++;
    }
  }

  const teacherTrustEnd = Number(run?.endRelationships?.teacherTrust ?? 0);
  const peerCircleEnd = Number(run?.endRelationships?.peerCircle ?? 0);
  const completedAge = Number(run?.completedAge ?? 0);
  const totalChoices = Object.values(roleCounts).reduce((a, b) => a + b, 0);

  return {
    runId: String(run?.runId || ''),
    completedAge,
    yearsPlayed: years.length,
    avgLove: avg(loveVals),
    avgStress: avg(stressVals),
    minLove: loveVals.length ? Math.min(...loveVals) : 0,
    maxStress: stressVals.length ? Math.max(...stressVals) : 0,
    endConfidence: Number(end?.confidence ?? 0),
    endDiscipline: Number(end?.discipline ?? 0),
    endMoney: Number(end?.money ?? 0),
    endMoneyK: Number(end?.money ?? 0) / 1000,
    roleCounts,
    totalChoices,
    harm: roleCounts.harm,
    boundary: roleCounts.boundary,
    repairRate: repairsTakenCount / Math.max(1, repairOpportunityCount),
    boundaryRate: totalChoices > 0 ? roleCounts.boundary / totalChoices : 0,
    harmRate: totalChoices > 0 ? roleCounts.harm / totalChoices : 0,
    choiceLetterCounts: letterCounts,
    highIntensityEventCount,
    traumaEventCount,
    repairOpportunityCount,
    repairsTakenCount,
    supportActionCount,
    teacherTrustEnd,
    peerCircleEnd,
    chaosModeEnabled: !!flags?.chaosMode,
    specialStartId: run?.specialStartId ?? null,
  };
}

function tierRank(t) { return t === 'Gold' ? 3 : t === 'Silver' ? 2 : t === 'Bronze' ? 1 : 0; }

function evalPrimitive(crit, m) {
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const safeNum = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  const cmp = (a, b, op) => {
    if (op === '>=') return a >= b;
    if (op === '<=') return a <= b;
    if (op === '>') return a > b;
    if (op === '<') return a < b;
    if (op === '==') return a === b;
    return false;
  };
  if (crit.type === 'metricCompare') {
    const a = safeNum(m[crit.metricKey]);
    const b = safeNum(crit.value);
    const passed = cmp(a, b, crit.op);
    const rel = b === 0 ? (a === 0 ? 1 : 1) : a / b;
    const prog = crit.op === '<' || crit.op === '<=' ? clamp01(b / (a === 0 ? 1 : a)) : clamp01(rel);
    return { passed, progress: passed ? 1 : prog };
  }
  if (crit.type === 'ratioCompare') {
    const num = safeNum(m[crit.numeratorKey]);
    const den = safeNum(m[crit.denominatorKey]);
    const ratio = den === 0 ? 0 : num / den;
    const b = safeNum(crit.value);
    const passed = cmp(ratio, b, crit.op);
    const rel = b === 0 ? (ratio === 0 ? 1 : 1) : ratio / b;
    const prog = crit.op === '<' || crit.op === '<=' ? clamp01(b / (ratio === 0 ? 1 : ratio)) : clamp01(rel);
    return { passed, progress: passed ? 1 : prog };
  }
  if (crit.type === 'minCount') {
    const a = safeNum(m[crit.metricKey]);
    const b = safeNum(crit.value);
    const passed = a >= b;
    const prog = clamp01(a / (b || 1));
    return { passed, progress: passed ? 1 : prog };
  }
  if (crit.type === 'maxCount') {
    const a = safeNum(m[crit.metricKey]);
    const b = safeNum(crit.value);
    const passed = a <= b;
    const prog = passed ? 1 : clamp01(b / (a || 1));
    return { passed, progress: passed ? 1 : prog };
  }
  if (crit.type === 'booleanIs') {
    const a = !!m[crit.metricKey];
    const b = !!crit.value;
    const passed = a === b;
    return { passed, progress: passed ? 1 : 0 };
  }
  return { passed: false, progress: 0 };
}

function evalCriteriaGroup(group, m, progressOut) {
  if (!group || typeof group !== 'object') return { passed: false };
  const op = group.op === 'OR' ? 'OR' : 'AND';
  const items = Array.isArray(group.items) ? group.items : [];
  if (items.length === 0) return { passed: true };
  const results = items.map((it) => {
    if (it && it.type) {
      const r = evalPrimitive(it, m);
      progressOut.push(r.progress);
      return r.passed;
    }
    return evalCriteriaGroup(it, m, progressOut).passed;
  });
  const passed = op === 'AND' ? results.every(Boolean) : results.some(Boolean);
  return { passed };
}

export function evaluateBadge(def, metrics) {
  const order = ['Gold', 'Silver', 'Bronze'];
  const progressByTier = {};
  for (const t of order) {
    const tierDef = (def.tiers || []).find((x) => x.tier === t);
    if (!tierDef) continue;
    const progressList = [];
    const { passed } = evalCriteriaGroup(tierDef.criteria, metrics, progressList);
    progressByTier[t] = progressList;
    if (passed) return { tier: t, progressByCriterion: progressList, progressByTier };
  }
  return { tier: null, progressByCriterion: [], progressByTier };
}