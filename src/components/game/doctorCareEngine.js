// BitLife-style Doctor System
// Price/Quality trade-offs, seeded RNG for diagnosis accuracy, medication selection

import { createSeededRng } from './GameStateContext';

// Doctor Definitions
export const ADULT_DOCTORS = [
  {
    id: 'walkin',
    emoji: '🏥',
    name: 'Walk-In Clinic',
    tagline: 'You heal under fluorescent lighting and questionable magazines.',
    baseCost: 110,
    focusCost: 1,
    quality: 45,
    bedside: 45
  },
  {
    id: 'familydoc',
    emoji: '🩺',
    name: 'Family Doctor',
    tagline: 'Actually reads your chart. A rare skill.',
    baseCost: 180,
    focusCost: 1,
    quality: 70,
    bedside: 70
  },
  {
    id: 'concierge',
    emoji: '✨',
    name: 'Concierge Specialist',
    tagline: 'The water is infused. Your bill is also infused.',
    baseCost: 450,
    focusCost: 1,
    quality: 92,
    bedside: 85
  }
];

export const CHILD_DOCTORS = [
  {
    id: 'communitypeds',
    emoji: '🧸',
    name: 'Community Pediatric Clinic',
    tagline: 'Fast, kind, slightly chaotic energy.',
    baseCost: 140,
    focusCost: 1,
    quality: 58,
    bedside: 65
  },
  {
    id: 'pediatrician',
    emoji: '🩺',
    name: 'Board-Certified Pediatrician',
    tagline: 'Explains everything. Even the sticker choices.',
    baseCost: 220,
    focusCost: 1,
    quality: 78,
    bedside: 78
  },
  {
    id: 'childrenshospital',
    emoji: '🏨',
    name: "Children's Hospital Specialist",
    tagline: 'They have a machine that goes "beep" in three languages.',
    baseCost: 550,
    focusCost: 1,
    quality: 95,
    bedside: 82
  }
];

// Quality to stars mapping
export function getStarsForQuality(quality) {
  if (quality >= 86) return 5;
  if (quality >= 71) return 4;
  if (quality >= 56) return 3;
  if (quality >= 40) return 2;
  return 1;
}

// Medication / Action Catalog
export const MEDICATION_CATALOG = [
  { id: 'electrolytes', emoji: '🥤', label: 'Electrolytes + hydration', minAge: 0, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 2, stress: -0.3, childHealthStat: 0.2 } },
  { id: 'painrelief', emoji: '💊', label: 'OTC pain relief', minAge: 2, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 2, stress: -0.2, childHealthStat: 0.1 } },
  { id: 'antibiotics', emoji: '🧫', label: 'Antibiotic course (if bacterial)', minAge: 2, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 5, stress: -0.2, childHealthStat: 0.2 } },
  { id: 'inhaler', emoji: '🫁', label: 'Inhaler (breathing support)', minAge: 5, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 3, stress: -0.1, childHealthStat: 0.2 } },
  { id: 'antihistamine', emoji: '🌼', label: 'Antihistamine (allergy help)', minAge: 6, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 2, stress: -0.1, childHealthStat: 0.1 } },
  { id: 'topical', emoji: '🧴', label: 'Topical cream (skin)', minAge: 1, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 1, stress: 0, childHealthStat: 0.2 } },
  { id: 'physio', emoji: '🧘', label: 'Physical therapy referral', minAge: 8, patientAllowed: ['self', 'child', 'partner'], effect: { playerHealth: 3, stress: -0.1, childHealthStat: 0.2 } },
  { id: 'bpmeds', emoji: '🫀', label: 'Blood pressure medication (discussion)', minAge: 30, patientAllowed: ['self', 'partner'], effect: { playerHealth: 2, stress: -0.1 } },
  { id: 'statin', emoji: '🧬', label: 'Cholesterol medication (discussion)', minAge: 40, patientAllowed: ['self', 'partner'], effect: { playerHealth: 2, stress: 0 } },
  { id: 'metformin', emoji: '🍬', label: 'Blood sugar support (discussion)', minAge: 35, patientAllowed: ['self', 'partner'], effect: { playerHealth: 1, stress: 0 } },
  { id: 'ssri', emoji: '🧠', label: 'Mood support medication (discussion)', minAge: 18, patientAllowed: ['self', 'partner'], effect: { playerHealth: 0, stress: -1.5 } },
  { id: 't_eval', emoji: '🧪', label: 'Testosterone labs (discussion)', minAge: 50, patientAllowed: ['self', 'partner'], effect: { playerHealth: 0, stress: -0.2 } }
];

// Diagnosis candidates
const DIAGNOSIS_INJURY = ['Sprain/strain', 'Minor fracture', 'Bruise + swelling', 'Overuse injury'];
const DIAGNOSIS_ILLNESS = ['Viral illness', 'Bacterial infection', 'Seasonal flu', 'Stomach bug'];
const DIAGNOSIS_BURNOUT = ['Stress exhaustion', 'Sleep debt spiral', 'Dehydration + stress combo'];
const DIAGNOSIS_CHECKUP = ['Routine checkup', 'Preventive care review', '"You\'re fine… but drink water."'];

function pickDiagnosis(visitMode, sickNote, patientKey, playerHealth, stress, rng) {
  if (visitMode === 'checkup') {
    return rng.pick(DIAGNOSIS_CHECKUP);
  }
  
  // Treatment mode: pick category
  const note = String(sickNote || '').toLowerCase();
  let pool = DIAGNOSIS_ILLNESS;
  
  if (note.includes('sprain') || note.includes('fracture') || note.includes('bone') || note.includes('ankle') || note.includes('wrist') || note.includes('injury')) {
    pool = DIAGNOSIS_INJURY;
  } else if (patientKey === 'self' && playerHealth < 40 && stress >= 60) {
    pool = DIAGNOSIS_BURNOUT;
  }
  
  return rng.pick(pool);
}

// Preventive recommendations by age/sex
function buildPreventiveRecs(age, sexKey, quality) {
  const recs = [];
  
  if (quality < 56) {
    recs.push('• Sleep 7-9 hours per night');
    recs.push('• Stay hydrated');
    if (recs.length < 3) recs.push('• Follow up in 12 months');
    return recs;
  }
  
  // Quality 56-84: medium detail
  if (age >= 45) recs.push('• Colon cancer screening is usually recommended starting around 45.');
  if (sexKey === 'female' && age >= 40 && age <= 74) recs.push('• Breast screening is commonly done every other year starting around 40.');
  if (sexKey === 'female' && age >= 21 && age <= 29) recs.push('• Cervical screening often starts at 21 (Pap every ~3 years).');
  if (sexKey === 'female' && age >= 30 && age <= 65) recs.push('• Cervical screening options often include HPV testing intervals.');
  if (sexKey === 'male' && age >= 55 && age <= 69) recs.push('• Prostate screening is a shared decision around 55–69.');
  if (age >= 35 && age <= 70) recs.push('• Blood sugar screening is often discussed starting mid-30s for higher-risk adults.');
  if (age >= 50) recs.push('• Shingles vaccine is commonly recommended around 50+.');
  recs.push('• Td/Tdap booster about every 10 years.');
  
  if (quality >= 85) {
    // High quality: more detail
    if (age >= 50 && age <= 80) recs.push('• Some guidelines recommend annual low-dose CT screening for heavy smokers.');
  }
  
  return recs.slice(0, quality >= 85 ? 8 : 6);
}

function buildChildPreventiveRecs(age, quality) {
  const recs = [];
  
  if (quality < 56) {
    recs.push('• Keep up with vaccines');
    recs.push('• Monitor growth and development');
    return recs;
  }
  
  if (age >= 0 && age <= 2) recs.push('• Frequent well-child checkups early on; sleep + feeding guidance.');
  if (age >= 3 && age <= 10) recs.push('• Annual well-child visits; vision/hearing checks.');
  if (age >= 9) recs.push('• HPV vaccine can start around age 9.');
  if (age >= 11 && age <= 12) recs.push('• HPV vaccine is routinely recommended around 11–12.');
  recs.push('• Vaccines, nutrition, sleep routine, and safety habits review.');
  
  return recs.slice(0, quality >= 85 ? 7 : quality >= 70 ? 5 : 3);
}

// Build medication list
function buildMedicationList(visitMode, diagnosis, isCorrect, patientAge, quality, rng) {
  const meds = [];
  
  // Always electrolytes in treatment
  if (visitMode === 'treatment') {
    meds.push(MEDICATION_CATALOG.find(m => m.id === 'electrolytes'));
  }
  
  // Injury: pain relief + maybe physio
  if (diagnosis && DIAGNOSIS_INJURY.some(d => diagnosis.includes(d))) {
    meds.push(MEDICATION_CATALOG.find(m => m.id === 'painrelief'));
    if (quality >= 70 && rng.nextFloat() < 0.35) {
      meds.push(MEDICATION_CATALOG.find(m => m.id === 'physio'));
    }
  }
  
  // Illness: pain relief + antibiotics only if bacterial AND correct
  if (visitMode === 'treatment' && diagnosis && DIAGNOSIS_ILLNESS.some(d => diagnosis.includes(d))) {
    meds.push(MEDICATION_CATALOG.find(m => m.id === 'painrelief'));
    if (diagnosis === 'Bacterial infection' && isCorrect) {
      meds.push(MEDICATION_CATALOG.find(m => m.id === 'antibiotics'));
    } else if (!isCorrect && quality < 56 && rng.nextFloat() < 0.25) {
      // Low quality misdiagnosis: may prescribe antibiotics incorrectly
      meds.push(MEDICATION_CATALOG.find(m => m.id === 'antibiotics'));
    }
  }
  
  return meds.filter(Boolean).filter(m => patientAge >= m.minAge);
}

export function runPrimaryCareVisit({ state, patientKey, doc, getLocalAmount, applyMoneyDelta, spendFocus, applyStress, applyPlayerHealth, applyDeltas, applyLove, updateState, addLog, recordTimelineEntry, emitActionResult, formatMoney }) {
  const { currentYear, runSeed, childSickThisAge, playerSickThisAge, partnerSickThisAge, playerHealth, stress } = state;
  
  // 1) Validate focus
  if (state.actionPoints < doc.focusCost) {
    return { success: false, reason: 'Not enough Focus.' };
  }
  
  // 2) Spend focus + money
  if (!spendFocus(doc.focusCost, 'Doctor')) {
    return { success: false, reason: 'Focus spend failed.' };
  }
  
  const cost = getLocalAmount(doc.baseCost, { category: 'medical' });
  applyMoneyDelta(-cost, { source: `Doctor: ${doc.name}`, category: 'medical', allowCreditMessage: true });
  
  // 3) Determine patient age + sex
  let patientAge = 0;
  let sexKey = 'unspecified';
  let childName = state.childName || 'your child';
  
  if (patientKey === 'self' || patientKey === 'partner') {
    const parentAgeAtBirth = Number(state.parentAgeAtBirth ?? 28);
    patientAge = parentAgeAtBirth + currentYear;
    
    if (patientKey === 'self') {
      const g = String(state?.parentAvatarGender || '').toLowerCase();
      if (g === 'female') sexKey = 'female';
      else if (g === 'male') sexKey = 'male';
      else {
        const role = String(state?.parentRole || '').toLowerCase();
        if (role === 'mom' || role === 'mother') sexKey = 'female';
        else if (role === 'dad' || role === 'father') sexKey = 'male';
      }
    } else {
      // Partner sex (assume opposite of player for simplicity)
      sexKey = (sexKey === 'female') ? 'male' : 'female';
    }
  } else if (patientKey === 'child') {
    const kids = Array.isArray(state.kids) ? state.kids : [];
    const activeKidId = state.activeKidId;
    const activeKid = kids.find(k => k.id === activeKidId) || kids.find(k => k.relation === 'child') || null;
    
    if (activeKid) {
      const created = Number(activeKid.createdAtYear ?? 0);
      patientAge = Math.max(0, currentYear - created);
    } else {
      patientAge = Number(currentYear || 0);
    }
    
    const g = String(state?.childAvatarGender || state?.childGender || '').toLowerCase();
    if (g === 'boy') sexKey = 'male';
    else if (g === 'girl') sexKey = 'female';
  }
  
  // 4) Determine visit mode
  const sickNote = patientKey === 'child' ? state.childSickNote : patientKey === 'self' ? state.playerSickNote : state.partnerSickNote;
  const isSick = patientKey === 'child' ? childSickThisAge : patientKey === 'self' ? playerSickThisAge : partnerSickThisAge;
  
  let visitMode = 'checkup';
  if (isSick) {
    visitMode = 'treatment';
  } else if (patientKey === 'self' && playerHealth < 40) {
    visitMode = 'treatment';
  }
  
  // 5) Seeded RNG
  const rng = createSeededRng(`${runSeed}|doctor|age:${currentYear}|patient:${patientKey}|doc:${doc.id}`);
  
  // 6) Diagnosis accuracy
  const pCorrect = Math.max(0.35, Math.min(0.95, 0.35 + (doc.quality / 100) * 0.60));
  const isCorrect = rng.nextFloat() < pCorrect;
  
  const trueDiagnosis = pickDiagnosis(visitMode, sickNote, patientKey, playerHealth, stress, rng);
  let diagnosis = trueDiagnosis;
  
  if (!isCorrect && visitMode === 'treatment') {
    // Plausible wrong diagnosis
    const note = String(sickNote || '').toLowerCase();
    if (note.includes('injury') || note.includes('sprain')) {
      diagnosis = rng.pick([...DIAGNOSIS_ILLNESS, ...DIAGNOSIS_BURNOUT]);
    } else if (stress >= 60 && playerHealth < 40) {
      diagnosis = rng.pick([...DIAGNOSIS_ILLNESS, ...DIAGNOSIS_INJURY]);
    } else {
      diagnosis = rng.pick(DIAGNOSIS_ILLNESS);
    }
  }
  
  // 7) Build medication list
  const meds = buildMedicationList(visitMode, diagnosis, isCorrect, patientAge, doc.quality, rng);
  
  // 8) Build recommendations
  let recs = [];
  if (patientKey === 'child') {
    recs = buildChildPreventiveRecs(patientAge, doc.quality);
  } else {
    recs = buildPreventiveRecs(patientAge, sexKey, doc.quality);
    
    // Discussion meds for adults (checkup mode only)
    if (visitMode === 'checkup' && doc.quality >= 70 && rng.nextFloat() < 0.55) {
      if (patientAge >= 50 && sexKey === 'male' && (stress >= 60 || playerHealth < 55)) {
        recs.push('• Testosterone labs discussion (optional screening).');
      }
      if (patientAge >= 40 && playerHealth < 60 && rng.nextFloat() < 0.5) {
        recs.push('• Cholesterol or blood pressure discussion.');
      }
      if (patientAge >= 35 && patientAge <= 70 && playerHealth < 60) {
        recs.push('• Blood sugar support (preventive discussion).');
      }
      if (stress >= 75) {
        recs.push('• Mood support options available if interested.');
      }
    }
  }
  
  // 9) Apply game effects
  let stressDelta = -(0.2 + (doc.bedside / 100) * 0.8);
  if (visitMode === 'treatment') stressDelta -= 0.2;
  stressDelta = Math.max(-1.2, Math.min(-0.1, stressDelta));
  
  applyStress(stressDelta, 'Doctor visit');
  
  // Health effects
  let healthGain = 0;
  if (patientKey === 'self') {
    healthGain = visitMode === 'treatment' 
      ? (6 + Math.round(doc.quality / 20)) 
      : (2 + Math.round(doc.quality / 35));
    applyPlayerHealth(healthGain, 'Doctor visit');
  } else if (patientKey === 'partner') {
    // Partner health not tracked globally; just reduce stress and clear sick flag
  } else if (patientKey === 'child') {
    const childHealthDelta = visitMode === 'treatment' ? 0.5 : 0.3;
    applyDeltas({ health: childHealthDelta }, 'Doctor visit');
    if (visitMode === 'treatment') {
      applyLove(0.2, 'Doctor visit');
    }
  }
  
  // Clear sick flags
  if (visitMode === 'treatment') {
    if (patientKey === 'child') {
      updateState({ childSickThisAge: false, childSickNote: null });
    } else if (patientKey === 'self') {
      updateState({ playerSickThisAge: false, playerSickNote: null });
    } else if (patientKey === 'partner') {
      updateState({ partnerSickThisAge: false, partnerSickNote: null });
    }
  }
  
  // Side effects
  const pSideEffect = Math.max(0.02, 0.18 - (doc.quality / 100) * 0.14);
  const hasSideEffect = rng.nextFloat() < pSideEffect;
  let sideEffectLine = '';
  
  if (hasSideEffect) {
    applyStress(0.8, 'Side effects');
    if (patientKey === 'self') {
      applyPlayerHealth(-2, 'Side effects');
    }
    sideEffectLine = '\n\nSide effect: you feel weird for a week.';
  }
  
  // Checkup gating
  if (visitMode === 'checkup') {
    updateState(prev => ({
      primaryCare: {
        ...(prev.primaryCare || {}),
        lastCheckupAge: {
          ...(prev.primaryCare?.lastCheckupAge || {}),
          [patientKey]: currentYear
        }
      }
    }));
  }
  
  // 10) Build result body
  const stars = '★'.repeat(getStarsForQuality(doc.quality)) + '☆'.repeat(5 - getStarsForQuality(doc.quality));
  const patientLabel = patientKey === 'child' ? childName : patientKey === 'self' ? 'You' : 'Partner';
  
  let bodyParts = [
    `Provider: ${doc.emoji} ${doc.name} (${stars} • Quality: ${doc.quality}/100)`,
    `\nDiagnosis: ${diagnosis}`,
    `\nRecommendations:\n${recs.join('\n')}`,
  ];
  
  if (meds.length > 0) {
    const medLabels = meds.map(m => `${m.emoji} ${m.label}`).join(', ');
    bodyParts.push(`\nMedications/Plan: ${medLabels}`);
  }
  
  // Funny closer
  const docQuips = {
    walkin: 'The magazines are from 2017. Nobody knows why.',
    familydoc: 'Your doctor remembered your name without checking the chart. You feel seen.',
    concierge: 'The lobby has a waterfall. Your co-pay also has a waterfall.',
    communitypeds: 'Your child gets 4 stickers. They ask for 5. Negotiations begin.',
    pediatrician: 'The doctor explains the immune system using dinosaurs. It works.',
    childrenshospital: 'The beeping machine speaks three languages. None of them are reassuring.'
  };
  bodyParts.push(`\n${docQuips[doc.id] || 'The visit goes smoothly enough.'}`);
  bodyParts.push(sideEffectLine);
  bodyParts.push('\n\nGame flavor only — not medical advice.');
  
  const body = bodyParts.join('');
  
  // 11) Emit result + timeline
  emitActionResult({
    actionId: 'doctor',
    title: `🩺 Doctor Visit — ${doc.name}`,
    body,
    deltas: patientKey === 'child' ? { health: visitMode === 'treatment' ? 0.5 : 0.3 } : null,
    loveDelta: (patientKey === 'child' && visitMode === 'treatment') ? 0.2 : 0,
    stressDelta,
    moneyDelta: -cost,
    focusDelta: -doc.focusCost,
    tags: ['health', 'doctor'],
    meta: { emoji: doc.emoji, patientKey, visitMode }
  });
  
  recordTimelineEntry({
    kind: 'health',
    title: `${doc.emoji} Doctor: ${doc.name} (${patientLabel})`,
    detail: body,
    deltas: patientKey === 'child' ? { health: visitMode === 'treatment' ? 0.5 : 0.3 } : null,
    loveDelta: (patientKey === 'child' && visitMode === 'treatment') ? 0.2 : 0,
    stressDelta,
    moneyDelta: -cost
  });
  
  return { success: true };
}