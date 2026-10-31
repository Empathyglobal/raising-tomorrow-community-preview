const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const asNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

function hashToUint32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFrom(seedStr) {
  const r = mulberry32(hashToUint32(seedStr));
  return {
    f: () => r(),
    i: (max) => Math.floor(r() * max),
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    weightedPick: (items) => {
      const total = items.reduce((s, it) => s + (it.w || 0), 0);
      if (total <= 0) return items[0]?.v ?? null;
      let roll = r() * total;
      for (const it of items) {
        roll -= (it.w || 0);
        if (roll <= 0) return it.v;
      }
      return items[items.length - 1].v;
    }
  };
}

const PARTNERS = [
  "Alex","Sam","Jordan","Taylor","Casey","Riley","Morgan","Jamie","Avery","Quinn",
  "Cameron","Drew","Parker","Rowan","Reese","Hayden","Sage","Charlie","Emerson"
];
const GRANDKID_NAMES = [
  "Mia","Noah","Ava","Liam","Sofia","Ethan","Isla","Leo","Aria","Kai",
  "Nora","Milo","Elena","Zara","Ivy","Jude","Ruby","Finn","Luna","Theo"
];
const MAJORS = [
  "Computer Science","Nursing","Business","Engineering","Education","Psychology","Biology",
  "Economics","Design","Communications","Accounting","Mathematics"
];
const FIELDS = [
  "Retail","Hospitality","Tech","Trades","Healthcare","Education","Creative","Finance",
  "Service","Logistics","Admin","Construction","Public Service","Customer Support"
];

const DEATH_CAUSES = [
  "a sudden accident",
  "an unexpected medical emergency",
  "a tragic incident",
  "a fatal event that no one saw coming"
];

function getStats(kid) {
  const s = kid?.childSlice?.stats || {};
  const intelligence = clamp(asNum(s.intelligence, 0), 0, 100);
  const discipline = clamp(asNum(s.discipline, 0), 0, 100);
  const confidence = clamp(asNum(s.confidence, 0), 0, 100);
  const empathy = clamp(asNum(s.empathy, 0), 0, 100);
  return { intelligence, discipline, confidence, empathy };
}

export function getKidName(kid) {
  return String(kid?.childSlice?.childName || kid?.childSlice?.name || kid?.name || "Your child");
}

export function getKidLove(kid, fallback = 50) {
  const v = asNum(kid?.childSlice?.love, NaN);
  return Number.isFinite(v) ? clamp(v, 0, 100) : fallback;
}

export function getParentAge(state) {
  const start = asNum(state?.parentAgeStart, 30);
  const years = asNum(state?.currentYear, 0);
  return Math.max(18, start + years);
}

function contactStyleFrom(love, distance) {
  if (love >= 75 && distance !== 'far') return 'frequent';
  if (love >= 55) return 'normal';
  if (love <= 18) return 'rare';
  return distance === 'far' ? 'rare' : 'normal';
}

function relationshipWithParentFrom(love) {
  if (love >= 80) return 'close';
  if (love >= 50) return 'normal';
  if (love >= 20) return 'strained';
  return 'no_contact';
}

function mortalityChance({ age, discipline, parentStress, unemployed }) {
  // 0% under 18 is enforced by caller.
  // Scales with age (gentle early, sharper later), then multiplied by risk factors.
  const ageOver = Math.max(0, age - 18);
  let base = 0.0015; // 0.15% at 18
  let slope = 0.00055; // +0.055% per year
  let chance = base + slope * ageOver; // ~1% around age 34-35
  chance = clamp(chance, 0.0015, 0.03); // cap at 3%

  const discFactor = clamp(1.35 - (discipline / 100) * 0.75, 0.65, 1.35); // disciplined -> safer
  const stress = clamp(parentStress, 0, 100);
  const stressFactor = clamp(0.9 + stress / 260, 0.9, 1.25); // stressed parent -> less stable environment / risk up a bit
  const unempFactor = unemployed ? 1.12 : 1.0;

  return clamp(chance * discFactor * stressFactor * unempFactor, 0, 0.04);
}

function mkPopup({ id, kind = 'event', year, kidId, kidName, title, body, tags = [], choices }) {
  return { id, kind, year, kidId, kidName, title, body, tags, choices };
}

function mkChoices(defs) {
  const letters = ['A', 'B', 'C', 'D'];
  return defs.map((d, idx) => ({
    letter: letters[idx] || String.fromCharCode(65 + idx),
    ...d
  }));
}

function pushUnique(arr, item) {
  const a = Array.isArray(arr) ? arr : [];
  if (!a.includes(item)) a.push(item);
  return a;
}

function addUsed(life, id) {
  life.usedEventIds = Array.isArray(life.usedEventIds) ? life.usedEventIds : [];
  life.usedEventIds.push(id);
  if (life.usedEventIds.length > 80) life.usedEventIds = life.usedEventIds.slice(-80);
}

function wasUsedRecently(life, id) {
  const used = Array.isArray(life.usedEventIds) ? life.usedEventIds : [];
  return used.slice(-14).includes(id);
}

function dedupeWeight(life, id, baseW) {
  return wasUsedRecently(life, id) ? baseW * 0.18 : baseW;
}

function formatDistance(distance) {
  if (distance === 'home') return 'nearby (still close to home)';
  if (distance === 'near') return 'nearby';
  if (distance === 'far') return 'far away';
  return 'unknown';
}

/**
 * AdultLife data model:
 * kid.adultLife = {
 *   v: 2,
 *   alive: true/false,
 *   deathYear, deathCause, deathNotified,
 *   distance,
 *   wellbeing, resilience,
 *   contactStyle, relationshipWithParent,
 *   education { track, status, yearInProgram, yearsTotal, major, debt },
 *   career { status, field, stability },
 *   relationship { status, partnerName, quality, pastPartners: [] },
 *   grandkidIds: [],
 *   pending: [ { id, kind, dueYear, ...payload } ],
 *   due: [ { id, kind, ...payload } ],
 *   flags: [],
 *   lastSimYear, lastEventYear,
 *   usedEventIds: []
 * }
 */
export function ensureAdultLife({ state, kid, displayedAge }) {
  if (!kid) return kid;
  if (kid.relation !== 'child') return kid;
  if (displayedAge < 18) return kid;

  const runSeed = String(state?.runSeed || 'seed');
  const parentStress = asNum(state?.stress, 0);
  const love = getKidLove(kid, 50);
  const { intelligence, discipline, confidence, empathy } = getStats(kid);
  const r = rngFrom(`${runSeed}|adultInitV2|kid:${kid.id}|age:${displayedAge}`);

  // If already exists, gently migrate missing fields
  if (kid.adultLife && typeof kid.adultLife === 'object') {
    const prev = kid.adultLife;
    const migrated = {
      v: 2,
      alive: prev.alive !== false,
      deathYear: prev.deathYear ?? null,
      deathCause: prev.deathCause ?? null,
      deathNotified: prev.deathNotified ?? false,
      distance: prev.distance ?? 'near',
      wellbeing: Number.isFinite(Number(prev.wellbeing)) ? clamp(Number(prev.wellbeing), 0, 100) : 60,
      resilience: Number.isFinite(Number(prev.resilience)) ? clamp(Number(prev.resilience), 0, 100) : 55,
      contactStyle: prev.contactStyle ?? contactStyleFrom(love, prev.distance ?? 'near'),
      relationshipWithParent: prev.relationshipWithParent ?? relationshipWithParentFrom(love),
      education: prev.education || { track: 'work', status: 'none', yearInProgram: 0, yearsTotal: 0, major: null, debt: 0 },
      career: prev.career || { status: 'employed', field: r.pick(FIELDS), stability: 55 },
      relationship: prev.relationship || { status: 'single', partnerName: null, quality: 55, pastPartners: [] },
      grandkidIds: Array.isArray(prev.grandkidIds) ? prev.grandkidIds : [],
      pending: Array.isArray(prev.pending) ? prev.pending : [],
      due: Array.isArray(prev.due) ? prev.due : [],
      flags: Array.isArray(prev.flags) ? prev.flags : [],
      lastSimYear: prev.lastSimYear ?? null,
      lastEventYear: prev.lastEventYear ?? null,
      usedEventIds: Array.isArray(prev.usedEventIds) ? prev.usedEventIds : []
    };
    return { ...kid, adultLife: migrated };
  }

  // Track selection based on pre-18 stats
  const uniScore = clamp(0.22 + intelligence / 260 + discipline / 360, 0.05, 0.75);
  const tradeScore = clamp(0.16 + discipline / 320, 0.05, 0.55);
  const roll = r.f();
  let track = 'work';
  if (roll < uniScore) track = 'university';
  else if (roll < uniScore + tradeScore) track = 'trade';

  const dist = r.weightedPick([
    { w: 5, v: 'home' },
    { w: 6, v: 'near' },
    { w: 4, v: 'far' }
  ]);

  const baseWellbeing =
    clamp(
      54
        + discipline * 0.18
        + empathy * 0.12
        + confidence * 0.06
        + love * 0.12
        - parentStress * 0.12
        + (r.i(11) - 5),
      8,
      95
    );

  const baseResilience =
    clamp(
      48
        + discipline * 0.20
        + empathy * 0.10
        - parentStress * 0.08
        + (r.i(11) - 5),
      6,
      95
    );

  const relStatus = r.f() < clamp(0.25 + confidence / 500 + empathy / 600, 0.18, 0.60) ? 'dating' : 'single';
  const partner = relStatus === 'dating' ? r.pick(PARTNERS) : null;

  const life = {
    v: 2,
    alive: true,
    deathYear: null,
    deathCause: null,
    deathNotified: false,

    distance: dist,
    wellbeing: baseWellbeing,
    resilience: baseResilience,

    contactStyle: contactStyleFrom(love, dist),
    relationshipWithParent: relationshipWithParentFrom(love),

    education: {
      track,
      status: track === 'university' || track === 'trade' ? 'enrolled' : 'none',
      yearInProgram: track === 'university' || track === 'trade' ? 1 : 0,
      yearsTotal: track === 'university' ? 4 : track === 'trade' ? 2 : 0,
      major: track === 'university' ? r.pick(MAJORS) : null,
      debt: track === 'university' ? 2000 + r.i(4000) : track === 'trade' ? 700 + r.i(1200) : 0
    },

    career: {
      status: track === 'work' ? 'employed' : 'student',
      field: r.pick(FIELDS),
      stability: clamp(45 + discipline * 0.18 + (r.i(21) - 10), 0, 100)
    },

    relationship: {
      status: relStatus, // single | dating | engaged | married | divorced
      partnerName: partner,
      quality: clamp(48 + empathy * 0.20 + (r.i(21) - 10), 0, 100),
      pastPartners: []
    },

    grandkidIds: [],
    pending: [],
    due: [],
    flags: [],
    lastSimYear: null,
    lastEventYear: null,
    usedEventIds: []
  };

  return { ...kid, adultLife: life };
}

export function simulateAdultLifeYear({ state, kid, displayedAge, year }) {
  if (!kid?.adultLife) return kid;
  const life = { ...kid.adultLife };
  if (life.alive === false) return { ...kid, adultLife: life };
  if (life.lastSimYear === year) return kid;

  const runSeed = String(state?.runSeed || 'seed');
  const parentStress = asNum(state?.stress, 0);
  const love = getKidLove(kid, 50);
  const { intelligence, discipline, confidence, empathy } = getStats(kid);
  const r = rngFrom(`${runSeed}|adultSimV2|kid:${kid.id}|year:${year}|age:${displayedAge}`);

  // Relationship with parent evolves (not deterministically)
  life.relationshipWithParent = relationshipWithParentFrom(love);
  life.contactStyle = contactStyleFrom(love, life.distance);

  // Wellbeing drifts (embodies parent stress + their life stability)
  const unemp = life.career?.status === 'unemployed';
  const drift =
    (+love / 70)
    - (parentStress / 42)
    - (unemp ? 4.2 : 0)
    + (life.relationship?.status === 'divorced' ? -2.2 : 0)
    + (life.relationship?.status === 'married' ? +1.6 : 0)
    + (discipline / 85)
    + (empathy / 120)
    + (r.i(7) - 3);

  life.wellbeing = clamp(asNum(life.wellbeing, 60) + drift * 0.6, 0, 100);
  life.resilience = clamp(asNum(life.resilience, 55) + (discipline / 120) - (parentStress / 140) + (r.i(5) - 2), 0, 100);

  // Education progression (stats influence stumble risk)
  if (life.education?.status === 'enrolled') {
    const stumble = clamp(0.08 + (parentStress / 700) + (40 - discipline) / 800, 0.05, 0.20);
    if (r.f() < stumble) {
      life.career.stability = clamp(asNum(life.career.stability, 55) - 7, 0, 100);
      life.wellbeing = clamp(life.wellbeing - 3, 0, 100);
      pushUnique(life.flags, `flag_stumble_${year}`);
    }

    life.education.yearInProgram = asNum(life.education.yearInProgram, 1) + 1;
    if (life.education.yearInProgram >= asNum(life.education.yearsTotal, 0)) {
      life.education.status = 'graduated';
      life.career.status = 'employed';
      life.career.stability = clamp(asNum(life.career.stability, 55) + 10 + intelligence / 20, 0, 100);
      pushUnique(life.flags, `milestone_graduation_${year}`);
      // debt does not vanish automatically; they carry it
    }
  }

  // Career volatility (discipline helps, parent stress + low wellbeing hurts)
  if (life.career?.status === 'employed') {
    const layoffChance = clamp(0.07 + (parentStress / 900) + (35 - discipline) / 900 + (35 - life.wellbeing) / 600, 0.05, 0.18);
    const promotionChance = clamp(0.10 + discipline / 350 + intelligence / 500 + confidence / 600, 0.08, 0.26);

    const roll = r.f();
    if (roll < layoffChance) {
      life.career.status = 'unemployed';
      life.career.stability = clamp(asNum(life.career.stability, 55) - 18, 0, 100);
      life.wellbeing = clamp(life.wellbeing - 6, 0, 100);
      pushUnique(life.flags, `milestone_jobloss_${year}`);
    } else if (roll < layoffChance + promotionChance) {
      life.career.stability = clamp(asNum(life.career.stability, 55) + 10, 0, 100);
      life.wellbeing = clamp(life.wellbeing + 3, 0, 100);
      pushUnique(life.flags, `milestone_promotion_${year}`);
    }
  } else if (life.career?.status === 'unemployed') {
    const rehireChance = clamp(0.34 + discipline / 300 + confidence / 450 + love / 500, 0.28, 0.68);
    if (r.f() < rehireChance) {
      life.career.status = 'employed';
      life.career.stability = clamp(asNum(life.career.stability, 40) + 10, 0, 100);
      life.wellbeing = clamp(life.wellbeing + 4, 0, 100);
      pushUnique(life.flags, `milestone_newjob_${year}`);
    }
  }

  // Relationship progression w/ breakups + multiple partners
  const rel = life.relationship || { status: 'single', partnerName: null, quality: 55, pastPartners: [] };
  life.relationship = rel;
  rel.pastPartners = Array.isArray(rel.pastPartners) ? rel.pastPartners : [];

  if (rel.status === 'single' && displayedAge >= 18) {
    const dateChance = clamp(0.18 + confidence / 450 + empathy / 650 + (life.wellbeing - 50) / 300, 0.10, 0.55);
    if (r.f() < dateChance) {
      rel.status = 'dating';
      rel.partnerName = r.pick(PARTNERS);
      rel.quality = clamp(asNum(rel.quality, 55) + 5, 0, 100);
      pushUnique(life.flags, `milestone_newpartner_${year}`);
    }
  } else if (rel.status === 'dating') {
    const breakupChance = clamp(0.10 + (50 - rel.quality) / 400 + parentStress / 1200 + (40 - life.wellbeing) / 800, 0.06, 0.22);
    const engageChance = displayedAge >= 22 ? clamp(0.10 + (rel.quality / 500) + empathy / 900, 0.07, 0.22) : 0;

    const roll = r.f();
    if (roll < breakupChance) {
      // breakup
      if (rel.partnerName) rel.pastPartners.push(rel.partnerName);
      rel.partnerName = null;
      rel.status = 'single';
      rel.quality = clamp(rel.quality - 12, 0, 100);
      life.wellbeing = clamp(life.wellbeing - 4, 0, 100);
      pushUnique(life.flags, `milestone_breakup_${year}`);
    } else if (roll < breakupChance + engageChance) {
      rel.status = 'engaged';
      pushUnique(life.flags, `milestone_engaged_${year}`);
    }
  } else if (rel.status === 'engaged') {
    const marryChance = clamp(0.28 + rel.quality / 500, 0.22, 0.55);
    if (r.f() < marryChance) {
      rel.status = 'married';
      pushUnique(life.flags, `milestone_married_${year}`);
      life.wellbeing = clamp(life.wellbeing + 2, 0, 100);
    }
  } else if (rel.status === 'married') {
    const divorceChance = clamp(0.035 + (50 - rel.quality) / 1400 + parentStress / 2400, 0.02, 0.09);
    if (r.f() < divorceChance) {
      if (rel.partnerName) rel.pastPartners.push(rel.partnerName);
      rel.status = 'divorced';
      rel.partnerName = null;
      rel.quality = clamp(rel.quality - 25, 0, 100);
      life.wellbeing = clamp(life.wellbeing - 8, 0, 100);
      pushUnique(life.flags, `milestone_divorced_${year}`);
    }
  } else if (rel.status === 'divorced') {
    // Some recover into dating again
    const recoverChance = clamp(0.18 + confidence / 650 + (life.resilience / 600), 0.10, 0.40);
    if (r.f() < recoverChance) {
      rel.status = 'dating';
      rel.partnerName = r.pick(PARTNERS);
      rel.quality = clamp(45 + empathy * 0.20 + (r.i(21) - 10), 0, 100);
      pushUnique(life.flags, `milestone_newpartner_${year}`);
    }
  }

  // Baby "due" event (requires married, age 23+, not too many grandkids)
  const gkCount = Array.isArray(life.grandkidIds) ? life.grandkidIds.length : 0;
  if (life.relationship.status === 'married' && displayedAge >= 23 && gkCount < 4) {
    const babyChance = clamp(0.05 + (displayedAge - 23) * 0.007 + empathy / 2500, 0.05, 0.16);
    if (r.f() < babyChance) {
      // create a due event that forces a baby popup (player choice creates the grandkid entity)
      life.due = Array.isArray(life.due) ? life.due : [];
      const dueId = `due_baby_${kid.id}_${year}`;
      if (!life.due.some(d => d.id === dueId)) {
        life.due.push({
          id: dueId,
          kind: 'baby',
          year,
          suggestedName: r.pick(GRANDKID_NAMES)
        });
      }
    }
  }

  // Resolve pending items into due events when time arrives
  life.pending = Array.isArray(life.pending) ? life.pending : [];
  life.due = Array.isArray(life.due) ? life.due : [];
  const stillPending = [];
  for (const item of life.pending) {
    if (asNum(item?.dueYear, year + 999) <= year) {
      // move to due queue
      life.due.push({ ...item, kind: item.kind || 'unknown' });
    } else {
      stillPending.push(item);
    }
  }
  life.pending = stillPending;

  // Adult child death roll (ONLY after 18; caller enforces age>=18)
  const chance = mortalityChance({
    age: displayedAge,
    discipline,
    parentStress,
    unemployed: life.career?.status === 'unemployed'
  });

  if (r.f() < chance) {
    life.alive = false;
    life.deathYear = year;
    life.deathCause = r.pick(DEATH_CAUSES);
    life.deathNotified = false;

    // force a due death popup this year
    const dueId = `due_death_${kid.id}_${year}`;
    if (!life.due.some(d => d.id === dueId)) {
      life.due.unshift({ id: dueId, kind: 'death', year, cause: life.deathCause });
    }
  }

  life.lastSimYear = year;
  return { ...kid, adultLife: life };
}

function popupDeath({ kid, year }) {
  const name = getKidName(kid);
  const life = kid.adultLife;
  const cause = life?.deathCause || "a tragedy";
  return mkPopup({
    id: `adult_death_${kid.id}_${year}`,
    kind: 'death',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'A Call You Never Wanted',
    tags: ['Adult', 'Tragedy'],
    body:
      `The phone call does not feel real.\n\n` +
      `${name} is gone: ${cause}.\n\n` +
      `Your body reacts before your mind can. You feel hollow. You feel angry. You feel everything.\n\n` +
      `This year will never be the same.`,
    choices: mkChoices([
      {
        id: 'death_memorial',
        emoji: '🕯️',
        text: 'Hold a memorial and let people show up',
        consequence:
          'You don\'t "get over it." But you don\'t carry it alone.',
        moneyDelta: -900,
        stressDelta: 26,
        loveDelta: 0,
        effects: {
          clearDueKind: 'death',
          markDeathNotified: true,
          // family tends to draw closer after loss (small boost to other adult kids is handled by resolver if provided)
          multiLoveMode: 'comfort'
        }
      },
      {
        id: 'death_work',
        emoji: '🧱',
        text: 'Disappear into work and responsibilities',
        consequence:
          'You function. You survive. But grief piles up quietly.',
        moneyDelta: 0,
        stressDelta: 22,
        loveDelta: 0,
        effects: {
          clearDueKind: 'death',
          markDeathNotified: true,
          multiLoveMode: 'distance'
        }
      },
      {
        id: 'death_family',
        emoji: '🫶',
        text: 'Lean hard on family and ask for help',
        consequence:
          'It is messy and honest. It also keeps you from drowning alone.',
        moneyDelta: -250,
        stressDelta: 24,
        loveDelta: 0,
        effects: {
          clearDueKind: 'death',
          markDeathNotified: true,
          multiLoveMode: 'bond'
        }
      }
    ])
  });
}

function popupBabyDue({ kid, year, dueItem }) {
  const name = getKidName(kid);
  const babyName = dueItem?.suggestedName || 'a baby';
  return mkPopup({
    id: dueItem?.id || `adult_baby_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'A Baby Is Coming',
    tags: ['Adult', 'Grandparent', 'Milestone'],
    body:
      `${name} calls, voice shaking: excited and terrified.\n\n` +
      `"We're having a baby."\n\n` +
      `They ask if you'll be involved.\n\n` +
      `The baby's name might be ${babyName}.`,
    choices: mkChoices([
      {
        id: 'baby_commit',
        emoji: '👶',
        text: 'Commit to being involved (time, visits, real support)',
        consequence:
          'You become part of their support system not as control, but as love.',
        moneyDelta: -250,
        stressDelta: 5,
        loveDelta: 4,
        effects: {
          clearDueId: dueItem?.id,
          wellbeingDelta: +4,
          relationshipQualityDelta: +2,
          createGrandkid: { name: babyName }
        }
      },
      {
        id: 'baby_support_afar',
        emoji: '📦',
        text: 'Support from afar (gifts, check-ins, boundaries)',
        consequence:
          'Helpful and manageable: less intense, still meaningful.',
        moneyDelta: -160,
        stressDelta: 3,
        loveDelta: 2,
        effects: {
          clearDueId: dueItem?.id,
          wellbeingDelta: +2,
          createGrandkid: { name: babyName }
        }
      },
      {
        id: 'baby_distance',
        emoji: '🧊',
        text: 'Keep distance ("I do not want to interfere")',
        consequence:
          'You avoid stress and you miss closeness.',
        moneyDelta: 0,
        stressDelta: 1,
        loveDelta: -2,
        effects: {
          clearDueId: dueItem?.id,
          wellbeingDelta: -1,
          createGrandkid: { name: babyName }
        }
      }
    ])
  });
}

function popupInvestmentPitch({ state, kid, year, displayedAge }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|invPitch|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const base = [800, 1200, 1800, 2500, 4000][r.i(5)];
  const amount = base + r.i(700);
  const horizon = r.pick([1, 2]); // years until results
  const idea = r.pick([
    'a small online shop',
    'a food cart idea',
    'a service business',
    'a mobile app idea',
    'a local repair business',
    'a creative studio project'
  ]);

  const pitchLines = [
    `${name} is excited - the kind of excited that makes you nervous.\n\nThey pitch ${idea}.\n\n"Just one push," they say. "I can make it real."`,
    `${name} asks for a serious conversation.\n\nThey want to try ${idea}.\n\nThey are asking for help not permission.`,
    `${name} sends a document: a plan.\n\nIt is imperfect, but it is real.\n\nThey want to build ${idea}.`
  ];

  // schedule outcome
  const pendingId = `pending_inv_${kid.id}_${year}_${hashToUint32(`${kid.id}|${year}|${amount}|${idea}`)}`;
  const dueYear = year + horizon;

  return mkPopup({
    id: `adult_investment_pitch_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Investment Pitch',
    tags: ['Adult', 'Choice', 'Consequences'],
    body: r.pick(pitchLines) + `\n\nThey ask for ${amount}.`,
    choices: mkChoices([
      {
        id: 'invest_yes',
        emoji: '💸',
        text: `Invest (${amount})`,
        consequence:
          `You back them fully. In ${horizon} year(s), you'll find out whether it was brave... or foolish.`,
        moneyDelta: -amount,
        stressDelta: 4,
        loveDelta: 3,
        effects: {
          addPending: {
            id: pendingId,
            kind: 'investment',
            dueYear,
            amount,
            idea,
            invested: amount
          },
          wellbeingDelta: +2
        }
      },
      {
        id: 'invest_partial',
        emoji: '🤝',
        text: `Invest partially (${Math.floor(amount * 0.4)}) + ask them to match`,
        consequence:
          `You support them and force them to carry responsibility too. In ${horizon} year(s), you'll see the result.`,
        moneyDelta: -Math.floor(amount * 0.4),
        stressDelta: 3,
        loveDelta: 2,
        effects: {
          addPending: {
            id: pendingId,
            kind: 'investment',
            dueYear,
            amount,
            idea,
            invested: Math.floor(amount * 0.4)
          },
          wellbeingDelta: +1
        }
      },
      {
        id: 'invest_no',
        emoji: '🧱',
        text: 'Decline',
        consequence:
          'A boundary. Also a bruise. They may still try — just without you.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupInvestmentOutcome({ state, kid, year, dueItem }) {
  const name = getKidName(kid);
  const life = kid.adultLife;
  const { intelligence, discipline, confidence } = getStats(kid);
  const parentStress = asNum(state?.stress, 0);

  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|invOutcome|kid:${kid.id}|year:${year}|id:${dueItem?.id}`);

  const idea = dueItem?.idea || 'the project';
  const invested = asNum(dueItem?.invested, 0);
  const amount = asNum(dueItem?.amount, invested);

  // Success probability based on stats + wellbeing + how much they invested personally (partial invests imply effort)
  const wellbeing = clamp(asNum(life?.wellbeing, 60), 0, 100);
  const baseP = 0.34
    + intelligence / 320
    + discipline / 340
    + wellbeing / 500
    - parentStress / 900
    + confidence / 900;

  const p = clamp(baseP, 0.18, 0.78);
  const success = r.f() < p;

  if (success) {
    const mult = r.pick([1.2, 1.5, 2.0, 2.6]);
    const payout = Math.floor(invested * mult);
    return mkPopup({
      id: `adult_investment_outcome_success_${kid.id}_${year}`,
      kind: 'event',
      year,
      kidId: kid.id,
      kidName: name,
      title: 'It Worked',
      tags: ['Adult', 'Pride', 'Consequences'],
      body:
        `${name} calls you, breathless.\n\n` +
        `The investment in ${idea} actually worked.\n\n` +
        `They pay you back ${payout}.\n\n` +
        `"I couldn't have done it without you," they say.`,
      choices: mkChoices([
        {
          id: 'take_money',
          emoji: '💰',
          text: `Take the money (${payout})`,
          consequence:
            'You accept the win. Sometimes support becomes a real return.',
          moneyDelta: +payout,
          stressDelta: -3,
          loveDelta: 2,
          effects: {
            clearDueId: dueItem?.id,
            wellbeingDelta: +3,
            careerStabilityDelta: +6,
            addFlag: 'flag_invest_success'
          }
        },
        {
          id: 'reinvest',
          emoji: '📈',
          text: 'Reinvest it into them',
          consequence:
            'You double down on their future. It is risky but it is powerful.',
          moneyDelta: 0,
          stressDelta: 1,
          loveDelta: 3,
          effects: {
            clearDueId: dueItem?.id,
            wellbeingDelta: +4,
            careerStabilityDelta: +8,
            addFlag: 'flag_reinvested'
          }
        },
        {
          id: 'gift_back',
          emoji: '🎁',
          text: 'Take a portion and gift the rest back',
          consequence:
            'You model gratitude and boundaries at the same time.',
          moneyDelta: +Math.floor(payout * 0.5),
          stressDelta: -2,
          loveDelta: 3,
          effects: {
            clearDueId: dueItem?.id,
            wellbeingDelta: +3,
            careerStabilityDelta: +6,
            addFlag: 'flag_shared_win'
          }
        }
      ])
    });
  }

  // Failure
  const fallout = r.pick([
    "It didn't take off. Not enough customers.",
    "A partner flaked at the worst time.",
    "Costs rose and the margin vanished.",
    "They tried hard it just didn't work."
  ]);
  return mkPopup({
    id: `adult_investment_outcome_fail_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'It Did Not Work',
    tags: ['Adult', 'Consequences'],
    body:
      `${name} calls. Their voice is small.\n\n` +
      `${fallout}\n\n` +
      `The money is gone.\n\n` +
      `They're waiting to see who you are in this moment.`,
    choices: mkChoices([
      {
        id: 'comfort',
        emoji: '🫶',
        text: 'Comfort them and focus on learning',
        consequence:
          'You turn failure into a lesson instead of a wound.',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: 2,
        effects: {
          clearDueId: dueItem?.id,
          wellbeingDelta: +2,
          addFlag: 'flag_failure_supported'
        }
      },
      {
        id: 'boundaries',
        emoji: '🧾',
        text: 'Support them emotionally, set financial boundaries',
        consequence:
          'Compassion with limits. Hard to hear. Healthy long-term.',
        moneyDelta: 0,
        stressDelta: 5,
        loveDelta: 0,
        effects: {
          clearDueId: dueItem?.id,
          wellbeingDelta: +1,
          addFlag: 'flag_failure_boundaries'
        }
      },
      {
        id: 'blame',
        emoji: '🧨',
        text: 'Blame them for wasting it',
        consequence:
          'You may be right about the money. You will be wrong about the relationship.',
        moneyDelta: 0,
        stressDelta: 6,
        loveDelta: -4,
        effects: {
          clearDueId: dueItem?.id,
          wellbeingDelta: -4,
          addFlag: 'flag_failure_blamed'
        }
      }
    ])
  });
}

function popupSmallCheckIn({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|checkin|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const msgs = [
    `${name} sends a photo of their dinner: "I didn't burn it."`,
    `${name} texts: "Handled something hard today. Just wanted you to know."`,
    `${name} sends a meme that hits way too close to home.`,
    `${name} sends a selfie with a tired smile: "Long week. Still standing."`,
    `${name} texts: "I used something you taught me. It worked."`
  ];

  return mkPopup({
    id: `adult_small_checkin_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'A Small Moment',
    tags: ['Adult', 'Connection', 'Relief'],
    body: r.pick(msgs),
    choices: mkChoices([
      {
        id: 'reply_warm',
        emoji: '💬',
        text: 'Reply warmly and keep the thread going',
        consequence: 'Small connections build real closeness over time.',
        moneyDelta: 0,
        stressDelta: -1,
        loveDelta: 2,
        effects: { wellbeingDelta: +1 }
      },
      {
        id: 'react',
        emoji: '😂',
        text: 'React with an emoji and move on',
        consequence: 'Minimal, but it still counts.',
        moneyDelta: 0,
        stressDelta: 0,
        loveDelta: 1,
        effects: { wellbeingDelta: +0 }
      },
      {
        id: 'ignore',
        emoji: '🫥',
        text: 'Ignore it',
        consequence: 'The thread goes quiet.',
        moneyDelta: 0,
        stressDelta: 1,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupPridePromotion({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|promotion|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const prideLines = [
    `${name} got recognized at work.\n\nNot just "good job." Real recognition.\n\nThey sound proud... and almost shocked.`,
    `${name} calls you first.\n\n"They picked me," they say.\n\nYou can hear how much it matters.`,
    `${name} sends a message: "I did it."\n\nA promotion. A raise. A step forward.`
  ];

  return mkPopup({
    id: `adult_pride_promotion_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'A Win',
    tags: ['Adult', 'Pride', 'Positive'],
    body: r.pick(prideLines),
    choices: mkChoices([
      {
        id: 'celebrate',
        emoji: '🎉',
        text: 'Celebrate loudly',
        consequence: 'They feel seen. Fully.',
        moneyDelta: -80,
        stressDelta: -2,
        loveDelta: 2,
        effects: { wellbeingDelta: +2, careerStabilityDelta: +4 }
      },
      {
        id: 'practical',
        emoji: '🧾',
        text: 'Celebrate + give practical advice (savings, boundaries)',
        consequence: 'Love and structure in one package.',
        moneyDelta: 0,
        stressDelta: -1,
        loveDelta: 1,
        effects: { wellbeingDelta: +1, careerStabilityDelta: +3 }
      },
      {
        id: 'dismiss',
        emoji: '🧊',
        text: 'Be distant',
        consequence: 'They notice. They always notice.',
        moneyDelta: 0,
        stressDelta: 0,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupPartnerIntro({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|partnerIntro|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const life = kid.adultLife;
  const partner = life?.relationship?.partnerName || r.pick(PARTNERS);

  // ensure partner name exists
  if (life?.relationship) life.relationship.partnerName = partner;

  const body = r.pick([
    `${name} wants you to meet ${partner}.\n\n"Please be normal," they joke.\n\nBut you can tell it matters.`,
    `${name} says they are serious about someone.\n\nThey want you to meet ${partner}.\n\nThis is a door opening.`,
    `${name} invites you to dinner.\n\n"Someone important will be there," they say.\n\nIt's ${partner}.`
  ]);

  return mkPopup({
    id: `adult_partner_intro_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Meeting the Partner',
    tags: ['Adult', 'Relationship', 'Positive'],
    body,
    choices: mkChoices([
      {
        id: 'warm',
        emoji: '🤝',
        text: 'Be warm and welcoming',
        consequence: 'You strengthen trust and make the future feel safer.',
        moneyDelta: -80,
        stressDelta: 1,
        loveDelta: 3,
        effects: { relationshipQualityDelta: +4, wellbeingDelta: +2 }
      },
      {
        id: 'neutral',
        emoji: '🙂',
        text: 'Be polite but neutral',
        consequence: 'You keep peace without overinvesting.',
        moneyDelta: 0,
        stressDelta: 1,
        loveDelta: 1,
        effects: { relationshipQualityDelta: +1 }
      },
      {
        id: 'skeptical',
        emoji: '🧐',
        text: 'Be openly skeptical',
        consequence: 'You may be right someday - today you create distance.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: -3,
        effects: { relationshipQualityDelta: -3, wellbeingDelta: -2 }
      }
    ])
  });
}

function popupEngagement({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|engaged|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);
  const life = kid.adultLife;
  const partner = life?.relationship?.partnerName || r.pick(PARTNERS);

  if (life?.relationship) {
    life.relationship.partnerName = partner;
    life.relationship.status = 'engaged';
  }

  return mkPopup({
    id: `adult_engagement_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Engagement',
    tags: ['Adult', 'Relationship', 'Milestone', 'Positive'],
    body:
      `${name} sends a photo.\n\nA ring.\n\nThey are engaged to ${partner}.\n\n` +
      `For a moment, the world feels lighter.`,
    choices: mkChoices([
      {
        id: 'celebrate',
        emoji: '🎉',
        text: 'Celebrate loudly',
        consequence: 'They feel loved and supported.',
        moneyDelta: -120,
        stressDelta: -1,
        loveDelta: 3,
        effects: { relationshipQualityDelta: +3, wellbeingDelta: +2 }
      },
      {
        id: 'practical',
        emoji: '🧾',
        text: 'Celebrate + talk about finances gently',
        consequence: 'Helpful, even if it dampens the moment a bit.',
        moneyDelta: 0,
        stressDelta: 0,
        loveDelta: 1,
        effects: { wellbeingDelta: +1 }
      },
      {
        id: 'warn',
        emoji: '⚠️',
        text: 'Warn them to slow down',
        consequence: 'Sometimes warnings are love. Sometimes they are just wounds.',
        moneyDelta: 0,
        stressDelta: 1,
        loveDelta: -2,
        effects: { relationshipQualityDelta: -2, wellbeingDelta: -1 }
      }
    ])
  });
}

function popupWeddingPlans({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|wedding|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);
  const cost = 500 + r.i(2800);

  return mkPopup({
    id: `adult_wedding_plans_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Wedding Plans',
    tags: ['Adult', 'Family', 'Milestone'],
    body:
      `${name} is planning a wedding.\n\n` +
      `It is exciting.\n\nIt is also expensive.\n\n` +
      `They ask if you can help with about ${cost}.`,
    choices: mkChoices([
      {
        id: 'help_money',
        emoji: '💐',
        text: `Help financially (${cost})`,
        consequence: 'They feel supported. Your budget tightens instantly.',
        moneyDelta: -cost,
        stressDelta: 5,
        loveDelta: 2,
        effects: { wellbeingDelta: +2, relationshipQualityDelta: +2 }
      },
      {
        id: 'help_labor',
        emoji: '🧰',
        text: 'Help with labor and planning (time > money)',
        consequence: 'Exhausting but bonding.',
        moneyDelta: -200,
        stressDelta: 7,
        loveDelta: 2,
        effects: { wellbeingDelta: +2 }
      },
      {
        id: 'boundary',
        emoji: '🧱',
        text: 'Set a firm boundary',
        consequence: 'Healthy... and it hurts.',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupFirstHome({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|home|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const down = [1500, 2500, 4000, 6500, 9000][r.i(5)];
  const body = r.pick([
    `${name} is thinking about buying a home.\n\nThey sound excited and terrified.\n\nThey ask if you can help with a down payment.`,
    `${name} found a place.\n\nNot perfect. Not forever.\n\nBut theirs.\n\nThey ask if you can help with the down payment.`,
    `${name} asks quietly: "Do you think I can do this?"\n\nThey want to buy a home, but the down payment is the wall.`
  ]);

  return mkPopup({
    id: `adult_first_home_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'A Place of Their Own',
    tags: ['Adult', 'Milestone', 'Consequences'],
    body: `${body}\n\nDown payment ask: ${down}.`,
    choices: mkChoices([
      {
        id: 'pay_down',
        emoji: '🏠',
        text: `Help (${down})`,
        consequence: 'You buy them stability. You take the hit.',
        moneyDelta: -down,
        stressDelta: 6,
        loveDelta: 3,
        effects: { wellbeingDelta: +3, careerStabilityDelta: +2, addFlag: 'flag_home_helped' }
      },
      {
        id: 'partial_down',
        emoji: '🤝',
        text: `Help partially (${Math.floor(down * 0.35)})`,
        consequence: 'A compromise that still matters.',
        moneyDelta: -Math.floor(down * 0.35),
        stressDelta: 4,
        loveDelta: 2,
        effects: { wellbeingDelta: +2 }
      },
      {
        id: 'no_down',
        emoji: '🧱',
        text: 'Decline',
        consequence: 'A boundary. They may interpret it as a lack of belief.',
        moneyDelta: 0,
        stressDelta: 3,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupJobLoss({ state, kid, year }) {
  const name = getKidName(kid);
  return mkPopup({
    id: `adult_job_loss_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Layoff',
    tags: ['Adult', 'Career'],
    body:
      `${name} got laid off.\n\n` +
      `They try to sound calm.\n\nThey are not.\n\n` +
      `They ask if they can lean on you while they recover.`,
    choices: mkChoices([
      {
        id: 'support_cash',
        emoji: '💸',
        text: 'Provide financial support + a plan',
        consequence: 'You help them breathe again and take the hit.',
        moneyDelta: -1800,
        stressDelta: 6,
        loveDelta: 3,
        effects: { wellbeingDelta: +3, careerStabilityDelta: +3 }
      },
      {
        id: 'support_jobhunt',
        emoji: '🔎',
        text: 'Help with job hunt and emotional support',
        consequence: 'You help them move forward without fully carrying the cost.',
        moneyDelta: -250,
        stressDelta: 6,
        loveDelta: 2,
        effects: { wellbeingDelta: +2, careerStabilityDelta: +2 }
      },
      {
        id: 'tough',
        emoji: '🪨',
        text: 'Tough love: they must solve it alone',
        consequence: 'It may push independence... or break trust.',
        moneyDelta: 0,
        stressDelta: 5,
        loveDelta: -3,
        effects: { wellbeingDelta: -3, careerStabilityDelta: -2 }
      }
    ])
  });
}

function popupBreakup({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|breakupPopup|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const lines = [
    `${name} calls late.\n\n"They left," they say.\n\nTheir voice breaks.\n\nThey're trying to be tough — and failing.`,
    `${name} texts: "I'm not okay."\n\nThey went through a breakup.\n\nYou can feel how raw it is.`,
    `${name} shows up emotional and exhausted.\n\nA breakup.\n\nThey look smaller than you remember.`
  ];

  return mkPopup({
    id: `adult_breakup_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Breakup',
    tags: ['Adult', 'Relationship'],
    body: r.pick(lines),
    choices: mkChoices([
      {
        id: 'listen',
        emoji: '🫶',
        text: 'Listen and validate',
        consequence: 'They feel safer instantly.',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: 3,
        effects: { wellbeingDelta: +3, relationshipQualityDelta: +1 }
      },
      {
        id: 'distract',
        emoji: '🍜',
        text: 'Show up with comfort (food, a visit, a movie)',
        consequence: 'You do not fix it. You soften it.',
        moneyDelta: -120,
        stressDelta: 5,
        loveDelta: 2,
        effects: { wellbeingDelta: +2 }
      },
      {
        id: 'dismiss',
        emoji: '🧊',
        text: 'Dismiss it as drama',
        consequence: 'They stop sharing. The distance grows.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: -4,
        effects: { wellbeingDelta: -4 }
      }
    ])
  });
}

function popupMarriageStress({ state, kid, year }) {
  const name = getKidName(kid);
  return mkPopup({
    id: `adult_marriage_stress_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Marriage Stress',
    tags: ['Adult', 'Relationship'],
    body:
      `${name} admits things are tense at home.\n\n` +
      `"I don't know if we are okay."`,
    choices: mkChoices([
      {
        id: 'listen',
        emoji: '🫶',
        text: 'Listen and validate',
        consequence: 'They feel safer instantly.',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: 3,
        effects: { wellbeingDelta: +2, relationshipQualityDelta: +2 }
      },
      {
        id: 'plan',
        emoji: '🧩',
        text: 'Help them make a plan (therapy, boundaries, communication)',
        consequence: 'Uncomfortable — but real support.',
        moneyDelta: -250,
        stressDelta: 6,
        loveDelta: 2,
        effects: { wellbeingDelta: +2, relationshipQualityDelta: +3 }
      },
      {
        id: 'dismiss',
        emoji: '🧊',
        text: 'Dismiss it',
        consequence: 'They stop sharing. The distance grows.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: -4,
        effects: { wellbeingDelta: -3, relationshipQualityDelta: -3 }
      }
    ])
  });
}

function popupSilence({ state, kid, year }) {
  const name = getKidName(kid);
  return mkPopup({
    id: `adult_silence_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Silence',
    tags: ['Adult', 'Distance'],
    body:
      `${name} does not reach out this year.\n\n` +
      `No call. No text. Nothing.\n\n` +
      `You can feel the distance: emotional, not just physical.`,
    choices: mkChoices([
      {
        id: 'gentle',
        emoji: '📩',
        text: 'Send a gentle message with no pressure',
        consequence: 'You keep the door open without forcing it.',
        moneyDelta: 0,
        stressDelta: 3,
        loveDelta: 2,
        effects: { wellbeingDelta: +1 }
      },
      {
        id: 'push',
        emoji: '☎️',
        text: 'Call repeatedly until they answer',
        consequence: 'You get an answer but it turns cold fast.',
        moneyDelta: 0,
        stressDelta: 6,
        loveDelta: -3,
        effects: { wellbeingDelta: -2 }
      },
      {
        id: 'respect',
        emoji: '🧊',
        text: 'Respect their space',
        consequence: 'It hurts, but you avoid escalating things.',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: -1,
        effects: { wellbeingDelta: 0 }
      }
    ])
  });
}

function popupNeedAdvice({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|advice|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const topics = [
    'whether to quit a job',
    'how to handle a partner conflict',
    'money stress and budgeting',
    'choosing between two paths',
    'repairing a friendship they damaged',
    'how to set boundaries at work',
    'whether to move to a new city'
  ];

  return mkPopup({
    id: `adult_need_advice_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'They Want Your Advice',
    tags: ['Adult', 'Advice', 'Connection'],
    body:
      `${name} calls.\n\n` +
      `They want your advice about ${r.pick(topics)}.\n\n` +
      `Not a lecture. Not control. Just help.`,
    choices: mkChoices([
      {
        id: 'support',
        emoji: '🫶',
        text: 'Be supportive and collaborative',
        consequence: 'They feel safe with you.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: 2,
        effects: { wellbeingDelta: +2 }
      },
      {
        id: 'tough',
        emoji: '🪨',
        text: 'Tough love',
        consequence: 'Sometimes needed. Sometimes it lands badly.',
        moneyDelta: 0,
        stressDelta: 3,
        loveDelta: 0,
        effects: { wellbeingDelta: +0 }
      },
      {
        id: 'hands_off',
        emoji: '🧊',
        text: 'Stay hands-off',
        consequence: 'They hear distance when you meant respect.',
        moneyDelta: 0,
        stressDelta: 3,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupHolidayPlans({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|holiday|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);

  const holiday = r.pick([
    'a big holiday',
    'a family birthday',
    'a long weekend',
    'a tradition you used to share',
    'a family gathering'
  ]);

  const options = r.pick([
    'travel to you',
    'host at their place',
    'split time with a partner family',
    'skip it entirely this year',
    'do something small instead'
  ]);

  return mkPopup({
    id: `adult_holiday_plans_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Family Plans',
    tags: ['Adult', 'Family'],
    body:
      `${name} wants to talk about ${holiday}.\n\n` +
      `They are considering whether to ${options}.\n\n` +
      `You can feel old expectations waking up.`,
    choices: mkChoices([
      {
        id: 'flexible',
        emoji: '🫶',
        text: 'Be flexible and supportive',
        consequence: 'You choose relationship over control.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: 2,
        effects: { wellbeingDelta: +1 }
      },
      {
        id: 'tradition',
        emoji: '🏠',
        text: 'Push tradition (family should be together)',
        consequence: 'Sometimes it works. Sometimes it backfires.',
        moneyDelta: 0,
        stressDelta: 3,
        loveDelta: -1,
        effects: { wellbeingDelta: -1 }
      },
      {
        id: 'withdraw',
        emoji: '🧊',
        text: 'Withdraw and say do whatever',
        consequence: 'They hear disappointment even if you do not say it.',
        moneyDelta: 0,
        stressDelta: 2,
        loveDelta: -2,
        effects: { wellbeingDelta: -1 }
      }
    ])
  });
}

function popupMoveBackHome({ state, kid, year }) {
  const name = getKidName(kid);
  return mkPopup({
    id: `adult_move_back_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: 'Move Back Home?',
    tags: ['Adult', 'Family'],
    body:
      `${name} asks if they can move back home "for a bit."\n\n` +
      `They say it is temporary.\n\nYou have heard "temporary" before.`,
    choices: mkChoices([
      {
        id: 'rules',
        emoji: '🏠',
        text: 'Yes with clear rules',
        consequence: 'You help them reset and protect your sanity.',
        moneyDelta: -300,
        stressDelta: 8,
        loveDelta: 2,
        effects: { wellbeingDelta: +1 }
      },
      {
        id: 'yes',
        emoji: '🫶',
        text: 'Yes no rules, just support',
        consequence: 'They feel loved. Your stress spikes fast.',
        moneyDelta: -600,
        stressDelta: 12,
        loveDelta: 3,
        effects: { wellbeingDelta: +2 }
      },
      {
        id: 'no',
        emoji: '🧱',
        text: 'No',
        consequence: 'Healthy boundary. Painful moment.',
        moneyDelta: 0,
        stressDelta: 6,
        loveDelta: -3,
        effects: { wellbeingDelta: -2 }
      }
    ])
  });
}

function popupGrandkidMilestone({ state, kid, year, grandkid }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|gkMilestone|gk:${grandkid.id}|year:${year}`);
  const adultName = getKidName(kid);
  const gkName = getKidName(grandkid);

  const milestone = r.pick([
    `first day of school`,
    `first performance`,
    `a big birthday`,
    `a difficult week`,
    `a proud moment`,
    `a why phase that never ends`
  ]);

  const body = r.pick([
    `${adultName} sends you a photo.\n\n${gkName} has their ${milestone}.\n\nYou feel something warm in your chest.`,
    `${adultName} asks if you can be there.\n\n${gkName} has their ${milestone}.\n\nThis is the kind of memory that sticks.`,
    `${gkName} asks about you.\n\n"Can we see them?"\n\n${adultName} tells you with a small smile.`
  ]);

  return mkPopup({
    id: `grandkid_milestone_${grandkid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: adultName,
    title: `Grandkid Moment — ${gkName}`,
    tags: ['Grandparent', 'Positive', 'Family'],
    body,
    choices: mkChoices([
      {
        id: 'show_up',
        emoji: '🚗',
        text: 'Show up and be present',
        consequence: 'Time is the real gift. It deepens bonds.',
        moneyDelta: -120,
        stressDelta: 3,
        loveDelta: 1,
        effects: { grandkidLoveDelta: { id: grandkid.id, delta: +4 }, wellbeingDelta: +1 }
      },
      {
        id: 'send_gift',
        emoji: '🎁',
        text: 'Send a gift and a message',
        consequence: 'Supportive and manageable.',
        moneyDelta: -80,
        stressDelta: 1,
        loveDelta: 1,
        effects: { grandkidLoveDelta: { id: grandkid.id, delta: +2 } }
      },
      {
        id: 'miss',
        emoji: '🫥',
        text: 'Miss it',
        consequence: 'Life happens. So does distance.',
        moneyDelta: 0,
        stressDelta: 1,
        loveDelta: -1,
        effects: { grandkidLoveDelta: { id: grandkid.id, delta: -2 }, wellbeingDelta: -1 }
      }
    ])
  });
}

function popupParentAging({ state, kid, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|parentAging|kid:${kid.id}|year:${year}`);
  const name = getKidName(kid);
  const parentAge = getParentAge(state);

  const scenario = r.pick([
    {
      title: 'Health Scare',
      body:
        `You have a health scare.\n\nIt is not the end but it is real.\n\n` +
        `You consider telling ${name}.\n\nYou realize: the roles are slowly changing.`,
      cost: 350
    },
    {
      title: 'You Cannot Drive For a While',
      body:
        `Something happens and you can't drive for a while.\n\n` +
        `You can manage… but it's harder than you want to admit.\n\n` +
        `${name} might help if you ask.`,
      cost: 0
    },
    {
      title: 'Downsizing',
      body:
        `You look around your home and realize you have too much.\n\n` +
        `Downsizing would be smart and emotional.\n\n` +
        `Do you ask ${name} for help?`,
      cost: 0
    }
  ]);

  return mkPopup({
    id: `parent_aging_${kid.id}_${year}`,
    kind: 'event',
    year,
    kidId: kid.id,
    kidName: name,
    title: `Aging (${parentAge}) — ${scenario.title}`,
    tags: ['Parent', 'Role Reversal', 'Family'],
    body: scenario.body,
    choices: mkChoices([
      {
        id: 'tell',
        emoji: '🫶',
        text: 'Tell them and accept help',
        consequence: 'Hard to admit and it brings closeness.',
        moneyDelta: -(scenario.cost || 0),
        stressDelta: 6,
        loveDelta: 2,
        effects: { wellbeingDelta: +1 }
      },
      {
        id: 'hide',
        emoji: '🧱',
        text: 'Hide it and handle it alone',
        consequence: 'You keep control. You also carry it alone.',
        moneyDelta: 0,
        stressDelta: 8,
        loveDelta: -1,
        effects: { wellbeingDelta: -1 }
      },
      {
        id: 'partial',
        emoji: '🧾',
        text: 'Tell them partially (I am fine)',
        consequence: 'A half-truth that keeps everyone uneasy.',
        moneyDelta: 0,
        stressDelta: 7,
        loveDelta: 0,
        effects: { wellbeingDelta: 0 }
      }
    ])
  });
}

function popupSiblingConflict({ state, kidA, kidB, year }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|adultSibling|A:${kidA.id}|B:${kidB.id}|year:${year}`);
  const aName = getKidName(kidA);
  const bName = getKidName(kidB);

  const topic = r.pick([
    'money and who gets helped',
    'holiday plans',
    'who "shows up" for family',
    'old childhood grudges',
    'who you "favor"',
    'who has the harder life'
  ]);

  return mkPopup({
    id: `adult_sibling_conflict_${kidA.id}_${kidB.id}_${year}`,
    kind: 'event',
    year,
    kidId: kidA.id, // anchor popup to A for display; effects can hit both
    kidName: aName,
    title: 'Adult Sibling Conflict',
    tags: ['Adult', 'Family', 'Drama'],
    body:
      `${aName} and ${bName} are fighting.\n\n` +
      `Not a small fight.\n\n` +
      `It is about ${topic}.\n\n` +
      `Both of them want you on their side.`,
    choices: mkChoices([
      {
        id: 'mediate',
        emoji: '🤝',
        text: 'Mediate carefully (no taking sides)',
        consequence: 'Hard work — but it can prevent permanent damage.',
        moneyDelta: 0,
        stressDelta: 7,
        loveDelta: 0,
        effects: {
          multiLoveDeltas: { [kidA.id]: +1, [kidB.id]: +1 }
        }
      },
      {
        id: 'pick_side',
        emoji: '⚔️',
        text: 'Pick a side',
        consequence: 'One feels validated. The other feels betrayed.',
        moneyDelta: 0,
        stressDelta: 6,
        loveDelta: 0,
        effects: {
          // pick which side by RNG at resolve time? Keep deterministic: side = kidA by default.
          multiLoveDeltas: { [kidA.id]: +2, [kidB.id]: -4 }
        }
      },
      {
        id: 'refuse',
        emoji: '🧊',
        text: 'Refuse to engage',
        consequence: 'You avoid the fight — and the resentment grows anyway.',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: 0,
        effects: {
          multiLoveDeltas: { [kidA.id]: -1, [kidB.id]: -1 }
        }
      }
    ])
  });
}

export function buildAdultLifePopupForKid({ state, kid, displayedAge, year, allKids }) {
  // Must have adultLife ensured + simulated already.
  const life = kid?.adultLife;
  if (!life) return null;

  // Priority 1: due death (even if they are now dead)
  life.due = Array.isArray(life.due) ? life.due : [];
  const dueDeath = life.due.find(d => d.kind === 'death');
  if (dueDeath && !life.deathNotified) {
    return popupDeath({ kid, year });
  }

  // Priority 2: due baby
  const dueBaby = life.due.find(d => d.kind === 'baby');
  if (dueBaby) {
    return popupBabyDue({ kid, year, dueItem: dueBaby });
  }

  // Priority 3: due investment resolution
  const dueInv = life.due.find(d => d.kind === 'investment');
  if (dueInv) {
    return popupInvestmentOutcome({ state, kid, year, dueItem: dueInv });
  }

  // If they are dead and already notified, no more popups for them.
  if (life.alive === false) return null;

  const runSeed = String(state?.runSeed || 'seed');
  const parentStress = asNum(state?.stress, 0);
  const love = getKidLove(kid, 50);
  const { discipline, empathy } = getStats(kid);
  const r = rngFrom(`${runSeed}|adultPickForKid|kid:${kid.id}|year:${year}`);

  // tone weights: more love -> more positive; more parent stress -> more negative
  const posW = clamp(4 + love / 20 - parentStress / 30, 2.2, 8.5);
  const neuW = 4.2;
  const negW = clamp(4 + (40 - love) / 20 + parentStress / 35, 2.2, 8.5);

  const tone = r.weightedPick([
    { w: posW, v: 'pos' },
    { w: neuW, v: 'neu' },
    { w: negW, v: 'neg' }
  ]);

  // Candidate events depend on life state; all are deduped
  const candidates = [];

  // Always possible, but weighted by tone:
  candidates.push({ id: 'small_checkin', w: tone === 'pos' ? 7 : 4 });
  candidates.push({ id: 'need_advice', w: tone === 'neu' ? 6 : 4 });

  // Pride / wins
  if (tone === 'pos') {
    candidates.push({ id: 'pride_promotion', w: 7 });
    if (life.education?.status === 'graduated') candidates.push({ id: 'pride_promotion', w: 3 });
    candidates.push({ id: 'holiday_plans', w: 5 });
  }

  // Relationship highlights
  if (tone !== 'neg') {
    if (life.relationship?.status === 'dating') candidates.push({ id: 'partner_intro', w: 6 });
    if (life.relationship?.status === 'engaged') candidates.push({ id: 'wedding_plans', w: 6 });
  }
  if (life.relationship?.status === 'single' && displayedAge >= 19 && tone === 'pos') candidates.push({ id: 'partner_intro', w: 3 });

  // Home milestone
  if (tone === 'pos' && displayedAge >= 24 && r.f() < 0.5) candidates.push({ id: 'first_home', w: 5 });

  // Consequence chain starter: investment pitch (not too often)
  if (!wasUsedRecently(life, 'adult_investment_pitch') && tone !== 'neg' && displayedAge >= 20) {
    candidates.push({ id: 'investment_pitch', w: 5 });
  }

  // Crisis events (still exist, but not dominating unless low love / high stress)
  if (tone === 'neg') {
    candidates.push({ id: 'job_loss', w: 7 });
    candidates.push({ id: 'breakup', w: 6 });
    candidates.push({ id: 'marriage_stress', w: 6 });
    candidates.push({ id: 'silence', w: 6 });
  } else {
    // still can happen sometimes
    if (r.f() < 0.22) candidates.push({ id: 'job_loss', w: 4 });
    if (r.f() < 0.18) candidates.push({ id: 'breakup', w: 3 });
  }

  // Distance year more likely when love low or distance far
  if (love <= 20 || life.distance === 'far') candidates.push({ id: 'silence', w: tone === 'neg' ? 6 : 3 });

  // Parent aging role reversal event becomes available later
  const parentAge = getParentAge(state);
  if (parentAge >= 55 && r.f() < 0.20) candidates.push({ id: 'parent_aging', w: 5 });

  // Grandkid joy moments (if grandkids exist in world)
  const all = Array.isArray(allKids) ? allKids : [];
  const gkids = all.filter(k => k?.relation === 'grandchild' && k?.parentKidId === kid.id);
  if (gkids.length && tone === 'pos') candidates.push({ id: 'grandkid_milestone', w: 7 });
  if (gkids.length && tone !== 'neg' && r.f() < 0.25) candidates.push({ id: 'grandkid_milestone', w: 4 });

  // Adult sibling conflict (rare, only if multiple adult kids alive)
  const adultSibs = (Array.isArray(allKids) ? allKids : []).filter(k => k?.relation === 'child' && k?.id !== kid.id && (k?.adultLife?.alive !== false));
  if (adultSibs.length >= 1 && r.f() < 0.18) candidates.push({ id: 'adult_sibling_conflict', w: 5 });

  // Dedupe weights
  const weighted = candidates.map(c => ({ w: dedupeWeight(life, c.id, c.w), v: c.id }));
  const picked = r.weightedPick(weighted) || 'small_checkin';

  // record use
  addUsed(life, picked);

  // Build popup
  if (picked === 'small_checkin') return popupSmallCheckIn({ state, kid, year });
  if (picked === 'pride_promotion') return popupPridePromotion({ state, kid, year });
  if (picked === 'partner_intro') return popupPartnerIntro({ state, kid, year });
  if (picked === 'wedding_plans') return popupWeddingPlans({ state, kid, year });
  if (picked === 'first_home') return popupFirstHome({ state, kid, year });
  if (picked === 'investment_pitch') {
    // mark general id for dedupe
    addUsed(life, 'adult_investment_pitch');
    return popupInvestmentPitch({ state, kid, year, displayedAge });
  }
  if (picked === 'job_loss') return popupJobLoss({ state, kid, year });
  if (picked === 'breakup') return popupBreakup({ state, kid, year });
  if (picked === 'marriage_stress') return popupMarriageStress({ state, kid, year });
  if (picked === 'silence') return popupSilence({ state, kid, year });
  if (picked === 'need_advice') return popupNeedAdvice({ state, kid, year });
  if (picked === 'holiday_plans') return popupHolidayPlans({ state, kid, year });
  if (picked === 'parent_aging') return popupParentAging({ state, kid, year });
  if (picked === 'grandkid_milestone') {
    const all = Array.isArray(allKids) ? allKids : [];
    const gkids = all.filter(k => k?.relation === 'grandchild' && k?.parentKidId === kid.id);
    const pickG = gkids[0];
    if (!pickG) return popupSmallCheckIn({ state, kid, year });
    // prefer grandkid with highest love
    const sorted = [...gkids].sort((a, b) => getKidLove(b, 50) - getKidLove(a, 50));
    return popupGrandkidMilestone({ state, kid, year, grandkid: sorted[0] });
  }
  if (picked === 'adult_sibling_conflict') {
    const all = Array.isArray(allKids) ? allKids : [];
    const sibs = all.filter(k => k?.relation === 'child' && k?.id !== kid.id && (k?.adultLife?.alive !== false));
    if (!sibs.length) return popupSmallCheckIn({ state, kid, year });
    const runSeed = String(state?.runSeed || 'seed');
    const r2 = rngFrom(`${runSeed}|pickSib|kid:${kid.id}|year:${year}`);
    const sib = sibs[r2.i(sibs.length)];
    return popupSiblingConflict({ state, kidA: kid, kidB: sib, year });
  }

  return popupSmallCheckIn({ state, kid, year });
}

export function pickAdultLifePopup({ state, adultEntries, year, focusKidId = null, allKids }) {
  // adultEntries: [{ kid, displayedAge }]
  const entries = Array.isArray(adultEntries) ? adultEntries : [];
  if (!entries.length) return null;

  // 1) urgent due events across all kids (death > baby > investment)
  // If any kid has due death and not notified, return immediately
  for (const e of entries) {
    const k = e.kid;
    const life = k?.adultLife;
    if (life?.due?.some(d => d.kind === 'death') && life?.deathNotified !== true) {
      return popupDeath({ kid: k, year });
    }
  }
  for (const e of entries) {
    const life = e.kid?.adultLife;
    if (life?.due?.some(d => d.kind === 'baby')) {
      const due = life.due.find(d => d.kind === 'baby');
      return popupBabyDue({ kid: e.kid, year, dueItem: due });
    }
  }
  for (const e of entries) {
    const life = e.kid?.adultLife;
    if (life?.due?.some(d => d.kind === 'investment')) {
      const due = life.due.find(d => d.kind === 'investment');
      return popupInvestmentOutcome({ state, kid: e.kid, year, dueItem: due });
    }
  }

  // 2) choose kid (focus overrides)
  let chosen = null;
  if (focusKidId) {
    chosen = entries.find(e => e.kid?.id === focusKidId) || null;
  }
  if (!chosen) {
    const runSeed = String(state?.runSeed || 'seed');
    const rPick = rngFrom(`${runSeed}|adultKidPickV2|year:${year}`);
    chosen = rPick.weightedPick(
      entries.map(e => {
        const love = getKidLove(e.kid, 50);
        const alive = e.kid?.adultLife?.alive !== false;
        const w = alive ? clamp(0.9 + love / 28, 0.9, 4.4) : 0.1;
        return { w, v: e };
      })
    );
  }
  if (!chosen) chosen = entries[0];

  return buildAdultLifePopupForKid({
    state,
    kid: chosen.kid,
    displayedAge: chosen.displayedAge,
    year,
    allKids
  });
}

export function generateAdultContactPings({ state, adultEntries, year }) {
  // non-blocking "texts" for flavor; cap to 2/year total
  const entries = Array.isArray(adultEntries) ? adultEntries : [];
  if (!entries.length) return [];

  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|adultPings|year:${year}`);

  const pings = [];
  // choose up to 2 kids
  const shuffled = [...entries].sort(() => (r.f() < 0.5 ? -1 : 1));

  for (const e of shuffled) {
    if (pings.length >= 2) break;
    const k = e.kid;
    if (!k?.adultLife || k.adultLife.alive === false) continue;

    const love = getKidLove(k, 50);
    const dist = k.adultLife.distance || 'near';

    const baseChance = clamp(0.10 + love / 200 + (dist === 'far' ? -0.04 : 0.02), 0.06, 0.35);
    if (r.f() > baseChance) continue;

    const name = getKidName(k);
    const msg = r.pick([
      `📩 ${name}: "Just checking in. You okay?"`,
      `📩 ${name}: "I saw something that reminded me of you."`,
      `📩 ${name}: "Thanks for the talk last time. It helped."`,
      `📩 ${name}: "I'm tired… but I'm okay."`,
      `📩 ${name}: "I miss you."`,
      `📩 ${name}: "Small win today. Thought you'd like to know."`
    ]);

    pings.push(msg);
  }

  return pings;
}

export function makeGrandkidKid({ state, parentKidId, year, nameOverride }) {
  const runSeed = String(state?.runSeed || 'seed');
  const r = rngFrom(`${runSeed}|grandkid|parent:${parentKidId}|year:${year}`);

  const name = nameOverride || r.pick(GRANDKID_NAMES);
  const id = `gkid_${hashToUint32(`${parentKidId}|${year}|${name}|${runSeed}`)}`;

  return {
    id,
    relation: 'grandchild',
    parentKidId,
    createdAtYear: year,
    childSlice: {
      childName: name,
      love: 60,
      stats: {
        intelligence: 0,
        discipline: 0,
        confidence: 0,
        empathy: 0
      }
    }
  };
}

export function applyAdultLifeChoice({ state, kid, year, choice }) {
  // Returns { updatedKid, newGrandkidKid|null }
  if (!kid?.adultLife) return { updatedKid: kid, newGrandkidKid: null };

  const updated = { ...kid, adultLife: { ...kid.adultLife } };
  const life = updated.adultLife;

  const eff = choice?.effects || {};
  let newGrandkidKid = null;

  // Clear due events
  if (eff.clearDueId) {
    life.due = Array.isArray(life.due) ? life.due.filter(d => d.id !== eff.clearDueId) : [];
  }
  if (eff.clearDueKind) {
    life.due = Array.isArray(life.due) ? life.due.filter(d => d.kind !== eff.clearDueKind) : [];
  }

  // Mark death notified
  if (eff.markDeathNotified) {
    life.deathNotified = true;
  }

  // Add flags
  if (eff.addFlag) {
    life.flags = Array.isArray(life.flags) ? life.flags : [];
    pushUnique(life.flags, String(eff.addFlag));
  }

  // Add pending chain
  if (eff.addPending && typeof eff.addPending === 'object') {
    life.pending = Array.isArray(life.pending) ? life.pending : [];
    life.pending.push({ ...eff.addPending, createdYear: year });
  }

  // Deltas
  if (Number.isFinite(Number(eff.wellbeingDelta))) {
    life.wellbeing = clamp(asNum(life.wellbeing, 60) + Number(eff.wellbeingDelta), 0, 100);
  }
  if (Number.isFinite(Number(eff.careerStabilityDelta))) {
    life.career = life.career || { status: 'employed', field: 'Work', stability: 55 };
    life.career.stability = clamp(asNum(life.career.stability, 55) + Number(eff.careerStabilityDelta), 0, 100);
  }
  if (Number.isFinite(Number(eff.relationshipQualityDelta))) {
    life.relationship = life.relationship || { status: 'single', partnerName: null, quality: 55, pastPartners: [] };
    life.relationship.quality = clamp(asNum(life.relationship.quality, 55) + Number(eff.relationshipQualityDelta), 0, 100);
  }

  // Grandkid creation (creates a kid entity; caller must insert into state.kids)
  if (eff.createGrandkid) {
    const gkName = String(eff.createGrandkid.name || '');
    newGrandkidKid = makeGrandkidKid({ state, parentKidId: kid.id, year, nameOverride: gkName || undefined });
    life.grandkidIds = Array.isArray(life.grandkidIds) ? life.grandkidIds : [];
    if (!life.grandkidIds.includes(newGrandkidKid.id)) life.grandkidIds.push(newGrandkidKid.id);

    // clear any due baby item (best-effort)
    life.due = Array.isArray(life.due) ? life.due.filter(d => d.kind !== 'baby') : [];
  }

  updated.adultLife = life;
  return { updatedKid: updated, newGrandkidKid };
}