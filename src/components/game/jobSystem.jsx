import { CAREER_CATALOG } from '@/components/data/careers/careerCatalog';

// Job System
// Education → field → job → starting budget + cash.
// Also derives incomeTier (low/medium/high) to preserve existing balancing.
// NOTE: Career data is centralized in components/data/careers/careerCatalog.js

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Ensure salary never ends in 0
export function ensureNoTrailingZero(n, salt = 0) {
  const x = Math.round(Number(n) || 0);
  if (x === 0) return 0;
  if (Math.abs(x) % 10 !== 0) return x;

  // deterministic small bump 1..9 (based on salt) so it never ends in 0
  const bump = (Math.abs((salt | 0) * 1103515245 + 12345) % 9) + 1;

  // Prefer bumping up unless it breaks caps (though caps are usually fine)
  if (x > 0) return x + bump;
  return x - bump;
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const EDUCATION_LEVELS = [
  { id: 'high_school', label: 'High School', emoji: '🎒' },
  { id: 'trade', label: 'Trade School', emoji: '🔧' },
  { id: 'associate', label: 'Associate Degree', emoji: '📄' },
  { id: 'bachelors', label: "Bachelor's Degree", emoji: '🎓' },
  { id: 'college', label: 'College', emoji: '🎓' }, // Legacy alias
  { id: 'masters', label: "Master's Degree", emoji: '🧠' },
  { id: 'phd', label: 'PhD', emoji: '🔬' },
  { id: 'jd', label: 'JD (Law)', emoji: '⚖️' },
  { id: 'md', label: 'MD (Medicine)', emoji: '🩺' },
  { id: 'dds', label: 'DDS (Dental)', emoji: '🦷' },
  { id: 'dvm', label: 'DVM (Veterinary)', emoji: '🐾' },
  { id: 'mba', label: 'MBA', emoji: '💼' }
];

// Field selection only applies to college/masters starts.
export const EDUCATION_FIELDS = [
  { id: 'stem', label: 'STEM (CS / Engineering / Data)', emoji: '💻' },
  { id: 'business', label: 'Business (Finance / Marketing / Ops)', emoji: '📈' },
  { id: 'health', label: 'Health (Nursing / Medicine)', emoji: '🩺' },
  { id: 'education', label: 'Education', emoji: '🍎' },
  { id: 'arts', label: 'Arts & Media', emoji: '🎨' },
  { id: 'law_policy', label: 'Law & Public Policy', emoji: '⚖️' },
  { id: 'social', label: 'Psychology & Social Work', emoji: '🤝' },
  { id: 'science', label: 'Science & Research', emoji: '🔬' }
];

export const EDUCATION_RANK = {
  high_school: 0,
  trade: 1,
  associate: 1,
  bachelors: 2,
  college: 2, // Legacy alias
  masters: 3,
  phd: 4,
  jd: 4,
  md: 5,
  dds: 5,
  dvm: 5,
  mba: 4
};

export const JOB_CATALOG = CAREER_CATALOG;

export function educationRank(levelId) {
  return EDUCATION_RANK[levelId] ?? 0;
}

export function getJobById(jobId) {
  return JOB_CATALOG.find(j => j.id === jobId) || null;
}

export function getEligibleJobs(educationLevelId, fieldId) {
  const rank = educationRank(educationLevelId);
  
  // Determine if this education level uses field filtering
  const FIELD_EDUS = new Set(['bachelors', 'college', 'masters', 'phd', 'mba']);
  const usesField = FIELD_EDUS.has(educationLevelId);

  // For non-field educations (high_school, trade, associate, jd, md, dds, dvm):
  // Return all jobs at or below their rank, excluding hidden and special careers
  if (!usesField) {
    return JOB_CATALOG.filter(j => educationRank(j.minEducation) <= rank && !j.hidden && !j.isSpecialCareer);
  }

  // For field-based educations: filter by field and exclude special careers
  return JOB_CATALOG.filter(j => {
    if (j.hidden) return false;
    if (j.isSpecialCareer) return false;
    if (educationRank(j.minEducation) > rank) return false;
    if (!fieldId) return true;
    if (!Array.isArray(j.fields) || j.fields.length === 0) return false;
    return j.fields.includes(fieldId);
  });
}

function normalizeAgeAtBirth(ageAtBirth) {
  const n = Number(ageAtBirth);
  if (!Number.isFinite(n)) return 28;
  return clamp(Math.round(n), 18, 60);
}

// Salary model notes:
// - baseYearlyIncome is "disposable budget after bills" (matches current game economy scale).
// - ageAtBirth acts as a proxy for experience/tenure.
// - We clamp to keep the existing economy bounded.
export function computeYearlyIncomeForJob(job, ageAtBirth) {
  if (!job) return 0;
  
  // Special case: Government Assistance is fixed
  if (job.id === 'government_assistance') return 1000;


  if (Number(job.baseYearlyIncome) === 0) return 0; // SAHP

  const age = normalizeAgeAtBirth(ageAtBirth);

  // Experience factor around age 22 as a baseline.
  const expYears = age - 22;
  const expFactor = 1 + clamp(expYears * 0.015, -0.08, 0.35);

  let raw = Math.round((job.baseYearlyIncome || 0) * expFactor);

  // Keep within game balance bounds.
  let clamped = clamp(raw, 1500, 25000);
  
  // No trailing zeros
  const salt = hashString(job.id + '|' + age);
  return ensureNoTrailingZero(clamped, salt);
}

export function computeStartMoney(yearlyIncome) {
  const y = Number(yearlyIncome) || 0;

  // Roughly "cash buffer" proportional to yearly budget.
  // Calibrated to match the old tiers:
  // - low (2000/2000) -> ~2000
  // - medium (10000/6000) -> ~7000
  // - high (20000/15000) -> ~14000
  const raw = Math.round(y * 0.7);

  const clamped = clamp(raw, 2000, 22000);
  // No trailing zeros for start money either
  return ensureNoTrailingZero(clamped, 999);
}

export function incomeTierFromYearlyIncome(yearlyIncome) {
  const y = Number(yearlyIncome) || 0;
  if (y < 6000) return 'low';
  if (y < 15000) return 'medium';
  return 'high';
}

export function computeStartingCareer({ educationLevelId, fieldId, ageAtBirth, jobId, allowHiddenJobId = false }) {
  const edu = educationLevelId || 'high_school';
  const rank = educationRank(edu);
  
  // Determine if this education uses field filtering
  const FIELD_EDUS = new Set(['bachelors', 'college', 'masters', 'phd', 'mba']);
  const usesField = FIELD_EDUS.has(edu);
  const field = usesField ? (fieldId || 'business') : null;
  
  const age = normalizeAgeAtBirth(ageAtBirth);

  const eligible = getEligibleJobs(edu, field);

  // If jobId is explicitly provided, validate it
  let job = null;
  if (jobId) {
    job = getJobById(jobId);
    if (job) {
      // Check education requirement
      if (educationRank(job.minEducation) > rank) {
        job = null;
      }
      // Check hidden status (only allow if explicitly permitted)
      else if (job.hidden && !allowHiddenJobId) {
        job = null;
      }
      // If job passes validation, use it (don't require it to be in eligible list)
    }
  }
  
  // Fallback to first eligible if no valid job found
  if (!job) {
    job = eligible[0] || getJobById('retail_associate');
  }

  const yearlyIncome = computeYearlyIncomeForJob(job, age);
  const startMoney = computeStartMoney(yearlyIncome);
  const incomeTier = incomeTierFromYearlyIncome(yearlyIncome);

  return {
    educationLevelId: edu,
    educationFieldId: field,
    ageAtBirth: age,
    jobId: job?.id || null,
    job,
    yearlyIncome,
    startMoney,
    incomeTier
  };
}

export function computeRandomPartnerCareer({ seed = '', ageAtBirth = 28 } = {}) {
  // weighted education distribution to avoid “partner is always a doctor”
  const eduWeighted = [
    ['high_school', 36],
    ['trade', 14],
    ['associate', 12],
    ['bachelors', 25],
    ['masters', 8],
    ['phd', 1],
    ['md', 1],
    ['dds', 1],
    ['dvm', 1],
    ['jd', 1]
  ];

  // deterministic RNG
  const rng = mulberry32(Math.abs(hashString(String(seed || 'partner'))));
  function pickWeighted() {
    const total = eduWeighted.reduce((a, [,w]) => a+w, 0);
    let roll = rng() * total;
    for (const [id,w] of eduWeighted) { roll -= w; if (roll <= 0) return id; }
    return 'high_school';
  }

  const educationLevelId = pickWeighted();

  // pick among jobs that require <= that education
  const maxRank = EDUCATION_RANK[educationLevelId] ?? 0;
  const eligible = JOB_CATALOG
    .filter(j => j.id !== 'stay_at_home_parent')
    .filter(j => !j.hidden)
    .filter(j => !j.isSpecialCareer)
    .filter(j => (EDUCATION_RANK[j.minEducation] ?? 0) <= maxRank);

  const job = eligible[Math.floor(rng() * eligible.length)] || eligible[0];

  const career = computeStartingCareer({
    educationLevelId,
    educationFieldId: null,
    ageAtBirth,
    jobId: job?.id
  });

  // enforce “no trailing zeros”
  const salted = ensureNoTrailingZero(career.yearlyIncome, hashString(seed + '|income'));
  
  // Make sure we return a structure compatible with game state partnerCareer
  return {
    jobId: job.id,
    jobTitle: job.title, // Add job title for display
    yearlyIncome: salted,
    educationLevelId,
    jobLevelIndex: 0,
    yearsInJob: 0,
    performance: 55
  };
}

export function getJobBoardForYear({
  seed = '',
  year = 0,
  countryIso3,
  householdType,
  limit = 10,
  educationLevelId = null,
  fieldId = null,
  mode = 'recommended',
  includeSpecialCareers = false
} = {}) {
  const ALWAYS_IDS = ['government_assistance', 'stay_at_home_parent'];
  const always = ALWAYS_IDS.map(id => JOB_CATALOG.find(j => j.id === id)).filter(Boolean);
  
  const maxRank = educationLevelId ? educationRank(educationLevelId) : null;
  
  // Base pool excludes always-included and hidden jobs
  let pool = JOB_CATALOG
    .filter(j => !ALWAYS_IDS.includes(j.id))
    .filter(j => !j.hidden)
    .filter(j => (maxRank == null ? true : educationRank(j.minEducation) <= maxRank));

  // Filter special careers based on flag
  if (!includeSpecialCareers) {
    pool = pool.filter(j => !j.isSpecialCareer);
  }

  // Mode-based filtering and sorting
  if (mode === 'recommended' && fieldId) {
    const exactMatch = pool.filter(j => {
      if (!Array.isArray(j.fields) || j.fields.length === 0) return false;
      return j.fields.includes(fieldId) && educationRank(j.minEducation) === maxRank;
    });

    const fieldMatchHigherEdu = pool.filter(j => {
      if (!Array.isArray(j.fields) || j.fields.length === 0) return false;
      const jobRank = educationRank(j.minEducation);
      return j.fields.includes(fieldId) && jobRank < maxRank;
    });

    const fieldMatchAny = pool.filter(j => {
      if (!Array.isArray(j.fields) || j.fields.length === 0) return false;
      return j.fields.includes(fieldId);
    });

    const nonFieldJobs = pool.filter(j => !Array.isArray(j.fields) || j.fields.length === 0);

    pool = [
      ...exactMatch,
      ...fieldMatchHigherEdu.filter(j => !exactMatch.includes(j)),
      ...fieldMatchAny.filter(j => !exactMatch.includes(j) && !fieldMatchHigherEdu.includes(j)),
      ...nonFieldJobs
    ];
  }

  const seedString = `${seed}|jobBoard|${year}|${mode}|${fieldId || 'none'}`;
  const rng = mulberry32(Math.abs(hashString(String(seedString))));
  const arr = [...pool];
  
  for (let i = arr.length - 1; i > 0; i--) {
    const r = Math.floor(rng() * (i + 1));
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }

  const pickCount = Math.max(0, limit - always.length);
  const picks = arr.slice(0, pickCount);

  const seen = new Set();
  const out = [];
  for (const j of [...always, ...picks]) {
    if (j && !seen.has(j.id)) { seen.add(j.id); out.push(j); }
  }
  let idx = pickCount;
  while (out.length < limit && idx < arr.length) {
    const j = arr[idx++];
    if (j && !seen.has(j.id)) { seen.add(j.id); out.push(j); }
  }
  return out.slice(0, limit);
}

export function formatMoneyCompact(n) {
  const v = Math.round(Number(n) || 0);
  return v.toLocaleString();
}