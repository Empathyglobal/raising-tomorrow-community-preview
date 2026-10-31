// PURE PRISON SYSTEM (no React, no imports that cause circular deps)
// Safe-by-default, defensive guards on all inputs.

export const DEFAULT_PRISON_STATE = {
  active: false,
  sentenceYears: 0,
  yearsRemaining: 0,
  securityLevel: 1,          // 1=min, 2=medium, 3=max
  offenseId: null,
  offenseLabel: '',
  startedAge: null,
  releaseAge: null,
  paroleEligibleAge: null,
  paroleDeniedCount: 0,
  respect: 25,
  behavior: 55,
  guardHeat: 20,
  actionsUsedThisAge: 0,
  visitUsedThisAge: false,
  visitPendingThisAge: false,
  jobId: null,
  programId: null,
  programProgress: 0,        // 0..100
  contraband: 0,             // 0..10
  solitaryYears: 0
};

export function ensurePrisonState(prison) {
  const base = { ...DEFAULT_PRISON_STATE };
  if (!prison || typeof prison !== 'object') return base;
  
  return {
    active: Boolean(prison.active),
    sentenceYears: Math.max(0, Number(prison.sentenceYears) || 0),
    yearsRemaining: Math.max(0, Number(prison.yearsRemaining) || 0),
    securityLevel: Math.max(1, Math.min(3, Number(prison.securityLevel) || 1)),
    offenseId: String(prison.offenseId || ''),
    offenseLabel: String(prison.offenseLabel || ''),
    startedAge: Number.isFinite(prison.startedAge) ? Number(prison.startedAge) : null,
    releaseAge: Number.isFinite(prison.releaseAge) ? Number(prison.releaseAge) : null,
    paroleEligibleAge: Number.isFinite(prison.paroleEligibleAge) ? Number(prison.paroleEligibleAge) : null,
    paroleDeniedCount: Math.max(0, Number(prison.paroleDeniedCount) || 0),
    respect: Math.max(0, Math.min(100, Number(prison.respect) || 25)),
    behavior: Math.max(0, Math.min(100, Number(prison.behavior) || 55)),
    guardHeat: Math.max(0, Math.min(100, Number(prison.guardHeat) || 20)),
    actionsUsedThisAge: Math.max(0, Number(prison.actionsUsedThisAge) || 0),
    visitUsedThisAge: Boolean(prison.visitUsedThisAge),
    visitPendingThisAge: Boolean(prison.visitPendingThisAge),
    jobId: prison.jobId ? String(prison.jobId) : null,
    programId: prison.programId ? String(prison.programId) : null,
    programProgress: Math.max(0, Math.min(100, Number(prison.programProgress) || 0)),
    contraband: Math.max(0, Math.min(10, Number(prison.contraband) || 0)),
    solitaryYears: Math.max(0, Number(prison.solitaryYears) || 0)
  };
}

export function startPrisonSentence({ state, prisonYears, offenseId, offenseLabel, severity }) {
  if (!state || !Number.isFinite(prisonYears) || prisonYears <= 0) return null;
  
  const years = Math.max(1, prisonYears);
  const sev = Math.max(1, Number(severity) || 1);
  
  // Determine security level
  let securityLevel = 1;
  if (years >= 5 || sev >= 4) securityLevel = 3;
  else if (years >= 2 || sev >= 3) securityLevel = 2;
  else securityLevel = 1;
  
  const startedAge = Number(state.currentYear) || 0;
  const releaseAge = startedAge + years;
  const paroleEligibleAge = startedAge + Math.max(1, Math.floor(years / 2));
  
  // Preserve household totals if coop is enabled
  let preMax = Number(state.maxFocusTokens) || 3;
  let preAP = Number(state.actionPoints) || 3;
  
  if (state.coop?.enabled === true && state.coop.focus) {
    const f = state.coop.focus;
    if (Number.isFinite(Number(f.householdMax))) {
      preMax = Number(f.householdMax);
    } else {
      preMax = (Number(f.playerMax || 0) + Number(f.partnerMax || 0)) || preMax;
    }
    
    if (Number.isFinite(Number(f.householdRemaining))) {
      preAP = Number(f.householdRemaining);
    } else {
      preAP = (Number(f.playerRemaining || 0) + Number(f.partnerRemaining || 0)) || preAP;
    }
  }
  
  const prisonPatch = {
    active: true,
    sentenceYears: years,
    yearsRemaining: years,
    securityLevel,
    offenseId: String(offenseId || ''),
    offenseLabel: String(offenseLabel || 'Crime'),
    startedAge,
    releaseAge,
    paroleEligibleAge,
    paroleDeniedCount: 0,
    respect: 20 + securityLevel * 5,
    behavior: 55,
    guardHeat: 20 + securityLevel * 10,
    actionsUsedThisAge: 0,
    visitUsedThisAge: false,
    visitPendingThisAge: false,
    jobId: null,
    programId: null,
    programProgress: 0,
    contraband: 0,
    solitaryYears: 0,
    prePrisonMaxFocusTokens: preMax,
    prePrisonActionPoints: preAP
  };
  
  const statePatches = {
    scenarioPending: false,
    pendingScenario: false,
    scenarioCompletedThisAge: true,
    currentScenario: null,
    currentScenarioHookId: null
  };
  
  const logs = [
    `🚔 Sentenced to ${years} year${years === 1 ? '' : 's'} in prison`,
    `📍 Security level: ${['Minimum', 'Medium', 'Maximum'][securityLevel - 1]}`
  ];
  
  const timelineEntry = {
    kind: 'crime',
    title: '🚔 Sentenced to Prison',
    detail: `${years} year${years === 1 ? '' : 's'} for ${offenseLabel}`,
    age: startedAge
  };
  
  const actionResult = {
    title: 'Sentenced to Prison',
    body: `You received a ${years}-year sentence in a ${['minimum', 'medium', 'maximum'][securityLevel - 1]}-security facility.`,
    tags: ['crime', 'prison'],
    meta: { emoji: '🚔', securityLevel }
  };
  
  return { prisonPatch, statePatches, logs, timelineEntry, actionResult };
}

export function beginPrisonYear({ state, newAge }) {
  if (!state || !state.prison) return { prisonPatch: {}, logs: [] };
  
  const prison = ensurePrisonState(state.prison);
  if (!prison.active) return { prisonPatch: {}, logs: [] };
  
  const prisonPatch = {
    actionsUsedThisAge: 0,
    visitUsedThisAge: false,
    visitPendingThisAge: true,
    guardHeat: Math.max(0, prison.guardHeat - 8)
  };
  
  // Decay respect if behavior is low
  if (prison.behavior < 40) {
    prisonPatch.respect = Math.max(10, prison.respect - 2);
  }
  
  const logs = [];
  if (prisonPatch.guardHeat < prison.guardHeat) {
    logs.push(`📉 Guard heat decreased (good behavior helps)`);
  }
  
  return { prisonPatch, logs };
}

export function applyPrisonAction({ state, actionId, choice }) {
  if (!state || !state.prison || !actionId) return null;
  
  const prison = ensurePrisonState(state.prison);
  if (!prison.active) return null;
  
  const prisonPatch = { actionsUsedThisAge: prison.actionsUsedThisAge + 1 };
  const deltas = { moneyDelta: 0, stressDelta: 0, playerHealthDelta: 0 };
  const logs = [];
  let actionResult = null;
  let timelineEntry = null;
  
  // Helper: random chance (0..100)
  const chance = (pct) => Math.random() < (pct / 100);
  
  switch (actionId) {
    case 'cry': {
      prisonPatch.behavior = Math.min(100, prison.behavior + 1);
      deltas.stressDelta = -1.0;
      logs.push(`😢 You cry it out. Stress relief.`);
      actionResult = {
        title: 'Emotional Release',
        body: 'Sometimes you need a good cry.',
        tags: ['prison']
      };
      break;
    }
    
    case 'work': {
      const baseIncome = 25 + Math.random() * 35;
      const securityAdjust = prison.securityLevel === 1 ? 1.2 : prison.securityLevel === 3 ? 0.8 : 1.0;
      deltas.moneyDelta = Math.round(baseIncome * securityAdjust);
      prisonPatch.behavior = Math.min(100, prison.behavior + 2);
      prisonPatch.respect = Math.min(100, prison.respect + 1);
      logs.push(`💼 Prison job: +$${deltas.moneyDelta}`);
      actionResult = {
        title: 'Prison Job',
        body: `Earned $${deltas.moneyDelta} from work assignment.`,
        tags: ['prison', 'money']
      };
      break;
    }
    
    case 'work_set_job': {
      const jobs = ['kitchen', 'laundry', 'library', 'workshop'];
      const jobChoice = (choice && typeof choice === 'object') ? choice.jobId : choice;
      prisonPatch.jobId = jobs.includes(jobChoice) ? jobChoice : jobs[0];
      logs.push(`📋 Assigned to ${prisonPatch.jobId}`);
      actionResult = {
        title: 'Job Assignment',
        body: `You're now working in the ${prisonPatch.jobId}.`,
        tags: ['prison']
      };
      break;
    }
    
    case 'study': {
      prisonPatch.programProgress = Math.min(100, prison.programProgress + 25);
      deltas.statsDelta = { intelligence: 1 };
      prisonPatch.behavior = Math.min(100, prison.behavior + 1);
      logs.push(`📚 Study session: progress +25%`);
      actionResult = {
        title: 'Educational Program',
        body: `Studying builds skills and keeps you focused.`,
        tags: ['prison', 'learning']
      };
      break;
    }
    
    case 'study_set_program': {
      const programs = ['ged', 'trade', 'parenting_class', 'anger_management'];
      const programChoice = (choice && typeof choice === 'object') ? choice.programId : choice;
      prisonPatch.programId = programs.includes(programChoice) ? programChoice : programs[0];
      prisonPatch.programProgress = 0;
      logs.push(`🎓 Enrolled in: ${prisonPatch.programId}`);
      actionResult = {
        title: 'Program Enrollment',
        body: `You've enrolled in the ${prisonPatch.programId} program.`,
        tags: ['prison', 'learning']
      };
      break;
    }
    
    case 'workout': {
      deltas.playerHealthDelta = 0.8;
      deltas.stressDelta = -0.3;
      prisonPatch.respect = Math.min(100, prison.respect + 1);
      logs.push(`💪 Workout: health +0.8, respect +1`);
      actionResult = {
        title: 'Exercise',
        body: 'Building strength and mental toughness.',
        tags: ['prison', 'health']
      };
      break;
    }
    
    case 'meditate': {
      deltas.stressDelta = -0.8;
      prisonPatch.behavior = Math.min(100, prison.behavior + 2);
      logs.push(`🧘 Meditation: stress -0.8, behavior +2`);
      actionResult = {
        title: 'Meditation',
        body: 'Finding peace in confinement.',
        tags: ['prison', 'stress']
      };
      break;
    }
    
    case 'smuggle': {
      prisonPatch.contraband = Math.min(10, prison.contraband + 1);
      deltas.stressDelta = 0.2;
      prisonPatch.guardHeat = Math.min(100, prison.guardHeat + 10);
      logs.push(`🚬 Smuggled contraband. Guard heat +10`);
      
      if (chance(25)) {
        prisonPatch.solitaryYears = prison.solitaryYears + 1;
        logs.push(`⚠️ Caught! Sent to solitary for 1 year.`);
      }
      if (chance(10) && !(prisonPatch.solitaryYears > prison.solitaryYears)) {
        prisonPatch.yearsRemaining = prison.yearsRemaining + 1;
        logs.push(`⚠️ Extra charge added. Sentence +1 year.`);
      }
      
      actionResult = {
        title: 'Contraband',
        body: 'High risk, but some items help pass time.',
        tags: ['prison', 'risk']
      };
      break;
    }
    
    case 'fight': {
      prisonPatch.respect = Math.min(100, prison.respect + 6);
      prisonPatch.behavior = Math.max(0, prison.behavior - 6);
      prisonPatch.guardHeat = Math.min(100, prison.guardHeat + 12);
      logs.push(`✊ Fight: respect +6, behavior -6, guard heat +12`);
      
      if (chance(35)) {
        prisonPatch.solitaryYears = prison.solitaryYears + 1;
        logs.push(`⚠️ Sent to solitary (assault).`);
      }
      if (chance(20)) {
        deltas.playerHealthDelta = -2.0;
        logs.push(`🩹 You got hurt badly.`);
      }
      if (chance(15) && !(prisonPatch.solitaryYears > prison.solitaryYears)) {
        prisonPatch.yearsRemaining = prison.yearsRemaining + 1;
        logs.push(`⚠️ Additional charges. Sentence +1 year.`);
      }
      
      actionResult = {
        title: 'Prison Fight',
        body: 'Respect gained, but consequences are real.',
        tags: ['prison', 'violence']
      };
      break;
    }
    
    case 'apply_parole': {
      const currentAge = Number(state.currentYear) || 0;
      if (currentAge < prison.paroleEligibleAge) {
        return null; // Not eligible yet
      }
      
      // Parole chance calculation
      const baseChance = 0.25;
      const behaviorBonus = (prison.behavior - 50) / 200;
      const respectBonus = (prison.respect - 25) / 300;
      const heatPenalty = -prison.guardHeat / 250;
      const totalChance = Math.max(0.05, Math.min(0.95, baseChance + behaviorBonus + respectBonus + heatPenalty));
      
      if (chance(totalChance * 100)) {
        // Success! Released
        prisonPatch.active = false;
        prisonPatch.yearsRemaining = 0;
        logs.push(`✅ PAROLE GRANTED! You are released.`);
        actionResult = {
          title: 'Paroled',
          body: 'Your request for parole was approved. You are free.',
          tags: ['prison', 'release'],
          meta: { special: 'parole_granted' }
        };
        timelineEntry = {
          kind: 'crime',
          title: '✅ Paroled',
          detail: `Released from prison after serving ${prison.sentenceYears} years`,
          age: currentAge
        };
      } else {
        // Denied
        prisonPatch.paroleDeniedCount = prison.paroleDeniedCount + 1;
        prisonPatch.behavior = Math.max(0, prison.behavior - 2);
        prisonPatch.guardHeat = Math.min(100, prison.guardHeat + 3);
        logs.push(`❌ Parole denied. Try again later.`);
        actionResult = {
          title: 'Parole Denied',
          body: 'Your parole request was rejected. You must continue serving your sentence.',
          tags: ['prison']
        };
      }
      break;
    }
    
    default:
      return null;
  }
  
  return {
    prisonPatch,
    deltas,
    logs,
    timelineEntry,
    actionResult
  };
}

export function isInPrison(state) {
  if (!state || !state.prison) return false;
  return ensurePrisonState(state.prison).active;
}