/**
 * Family Dynamics System
 * 
 * Extends trauma system into attachment styles, family scripts, repair skills,
 * and relationship trajectories. Story-friendly, deterministic, save-safe.
 */

// ============================================================================
// ATTACHMENT STYLES
// ============================================================================

import { computeFamilyTraumaLoad } from './familyTraumaLoad';

export const ATTACHMENT_STYLES = {
  SECURE: 'secure',
  ANXIOUS: 'anxious',
  AVOIDANT: 'avoidant',
  DISORGANIZED: 'disorganized'
};

export const STYLE_RATIONALES = {
  [ATTACHMENT_STYLES.SECURE]: [
    "You learned love could be steady.",
    "Trust felt safe enough to risk.",
    "You grew up feeling basically okay."
  ],
  [ATTACHMENT_STYLES.ANXIOUS]: [
    "You learned to watch for signs of withdrawal.",
    "Love felt conditional on performance.",
    "You got good at reading the room."
  ],
  [ATTACHMENT_STYLES.AVOIDANT]: [
    "You learned to stay quiet to keep peace.",
    "Feelings were safer kept private.",
    "Independence became your superpower."
  ],
  [ATTACHMENT_STYLES.DISORGANIZED]: [
    "Safety felt unpredictable.",
    "You learned to brace for anything.",
    "Home was both comfort and chaos."
  ]
};

export const STYLE_MULTIPLIERS = {
  [ATTACHMENT_STYLES.SECURE]: {
    gainMult: 1.1,
    lossMult: 0.9,
    triggerChance: 0.05
  },
  [ATTACHMENT_STYLES.ANXIOUS]: {
    gainMult: 0.9,
    lossMult: 1.2,
    triggerChance: 0.12
  },
  [ATTACHMENT_STYLES.AVOIDANT]: {
    gainMult: 0.8,
    lossMult: 1.1,
    triggerChance: 0.08
  },
  [ATTACHMENT_STYLES.DISORGANIZED]: {
    gainMult: 1.3, // Big gains when repair works
    lossMult: 1.4,
    triggerChance: 0.15
  }
};

// ============================================================================
// FAMILY SCRIPTS CATALOG
// ============================================================================

export const FAMILY_SCRIPTS = {
  scoreboardSibling: {
    id: 'scoreboardSibling',
    label: 'Scoreboard Sibling',
    emoji: '📊',
    description: 'Everything becomes comparison.',
    triggerTags: ['shame', 'role'],
    roles: ['sibling'],
    gainPenalty: 0.15,
    lossPenalty: 0.25,
    counterSkills: ['boundaries', 'selfReg']
  },
  adviceInsteadOfLove: {
    id: 'adviceInsteadOfLove',
    label: 'Advice Instead of Love',
    emoji: '💡',
    description: 'Feelings turn into fix-it sessions.',
    triggerTags: ['shame', 'role'],
    roles: ['mother', 'father', 'my_mom', 'my_dad'],
     gainPenalty: 0.20,
    lossPenalty: 0.10,
    counterSkills: ['repairTalk', 'boundaries']
  },
  walkingOnEggshells: {
    id: 'walkingOnEggshells',
    label: 'Walking on Eggshells',
    emoji: '🥚',
    description: 'Everyone is polite but tense.',
    triggerTags: ['threat', 'chaos'],
    roles: ['mother', 'father', 'my_mom', 'my_dad', 'sibling'],
     gainPenalty: 0.25,
    lossPenalty: 0.20,
    counterSkills: ['boundaries', 'humor']
  },
  silentTreatment: {
    id: 'silentTreatment',
    label: 'Silent Treatment',
    emoji: '🤐',
    description: 'Withdrawal as a weapon.',
    triggerTags: ['threat', 'neglect'],
    roles: ['mother', 'father', 'my_mom', 'my_dad', 'sibling'],
     gainPenalty: 0.30,
    lossPenalty: 0.35,
    counterSkills: ['repairTalk', 'apology']
  },
  jokesAsArmor: {
    id: 'jokesAsArmor',
    label: 'Jokes as Armor',
    emoji: '🎭',
    description: 'Humor dodges vulnerability.',
    triggerTags: ['shame', 'neglect'],
    roles: ['mother', 'father', 'my_mom', 'my_dad', 'sibling'],
     gainPenalty: 0.10,
    lossPenalty: 0.05,
    counterSkills: ['repairTalk', 'selfReg']
  },
  parentifiedPeacemaker: {
    id: 'parentifiedPeacemaker',
    label: 'Parentified Peacemaker',
    emoji: '🕊️',
    description: "You manage everyone's emotions.",
    triggerTags: ['role', 'chaos'],
    roles: ['mother', 'father', 'my_mom', 'my_dad', 'sibling'],
     gainPenalty: 0.20,
    lossPenalty: 0.15,
    counterSkills: ['boundaries', 'selfReg']
  },
  holidayBlowup: {
    id: 'holidayBlowup',
    label: 'Holiday Blowup',
    emoji: '🎄',
    description: 'Big events amplify everything.',
    triggerTags: ['chaos', 'threat'],
    roles: ['mother', 'father', 'my_mom', 'my_dad', 'sibling'],
     gainPenalty: 0.15,
    lossPenalty: 0.30,
    counterSkills: ['boundaries', 'humor']
  },
  moneyStrings: {
    id: 'moneyStrings',
    label: 'Money Strings',
    emoji: '💰',
    description: 'Help comes with conditions.',
    triggerTags: ['shame', 'role'],
    roles: ['mother', 'father', 'my_mom', 'my_dad'],
         gainPenalty: 0.25,
    lossPenalty: 0.20,
    counterSkills: ['boundaries', 'selfReg']
  }
};

// ============================================================================
// SKILLS
// ============================================================================

export const FAMILY_SKILLS = {
  repairTalk: { id: 'repairTalk', label: '🧵 Repair Talk', description: 'Say the hard thing gently.' },
  boundaries: { id: 'boundaries', label: '🧱 Boundaries', description: 'Hold your line without cruelty.' },
  selfReg: { id: 'selfReg', label: '🧘 Self-Regulation', description: 'Breathe before you react.' },
  humor: { id: 'humor', label: '🎭 Strategic Humor', description: 'Lighten the room, not dodge.' },
  apology: { id: 'apology', label: '🧾 Real Apology', description: 'Own it without defending.' }
};

// ============================================================================
// TRAJECTORIES
// ============================================================================

export const TRAJECTORIES = {
  close: { label: 'Close', emoji: '💚', description: 'Solid foundation, trust flowing.' },
  cordial: { label: 'Cordial', emoji: '🤝', description: 'Pleasant but careful.' },
  tense: { label: 'Tense', emoji: '⚡', description: 'Friction is the norm.' },
  distant: { label: 'Distant', emoji: '🌫️', description: 'Checked out emotionally.' },
  rebuilding: { label: 'Rebuilding', emoji: '🌱', description: 'Awkward, but improving.' }
};

// ============================================================================
// DETERMINISTIC RNG
// ============================================================================

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function seededRandom(runSeed, context) {
  const seed = hashString(`${runSeed}|${context}`);
  return mulberry32(seed)();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeFamilyDynamics(gameState) {
  if (gameState.familyDynamics) return gameState.familyDynamics;

  return {
    attachmentStyle: ATTACHMENT_STYLES.SECURE,
    styleStrength: 30,
    rationaleKeys: [],
    learnedSkills: {},
    scripts: {},
    perPerson: {},
    yearlyFlags: {},
    skillProgress: {
      repairTalkCount: 0,
      boundaryCount: 0,
      apologyCount: 0,
      supportSuccessCount: 0,
      jokeCount: 0
    }
  };
}

// ============================================================================
// ATTACHMENT STYLE DERIVATION
// ============================================================================

function normalizeParentRole(role) {
  if (role === 'my_mom') return 'mother';
  if (role === 'my_dad') return 'father';
  return role;
}

export function deriveAttachmentStyle(gameState) {
  // Import trauma system
  const load = computeFamilyTraumaLoad(gameState);
  
  const { totalScore = 0, unresolvedCount = 0, tagCounts = { shame: 0, threat: 0, chaos: 0, role: 0 } } = load;
  
  // Milestone ages only (avoid flip-flopping)
  const age = gameState.currentYear;
  const isMilestone = [6, 12, 16].includes(age);
  
  // If not milestone and style exists, keep it
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  if (!isMilestone && fd.attachmentStyle) {
    return {
      style: fd.attachmentStyle,
      strength: fd.styleStrength,
      rationaleKeys: fd.rationaleKeys
    };
  }
  
  // Derive style
  let style = ATTACHMENT_STYLES.SECURE;
  let strength = 30;
  let rationaleKeys = [];
  
  const chaos = tagCounts.chaos || 0;
  const threat = tagCounts.threat || 0;
  const shame = tagCounts.shame || 0;
  const role = tagCounts.role || 0;
  
  if (unresolvedCount >= 3) {
    if (chaos >= 2 && threat >= 2) {
      style = ATTACHMENT_STYLES.DISORGANIZED;
      strength = 60 + (unresolvedCount * 5);
      rationaleKeys = STYLE_RATIONALES[ATTACHMENT_STYLES.DISORGANIZED];
    } else if (shame >= 2 && threat >= 1) {
      style = ATTACHMENT_STYLES.ANXIOUS;
      strength = 50 + (unresolvedCount * 5);
      rationaleKeys = STYLE_RATIONALES[ATTACHMENT_STYLES.ANXIOUS];
    } else if (shame >= 2 || role >= 2) {
      style = ATTACHMENT_STYLES.AVOIDANT;
      strength = 50 + (unresolvedCount * 5);
      rationaleKeys = STYLE_RATIONALES[ATTACHMENT_STYLES.AVOIDANT];
    }
  }
  
  // Resolution decreases strength
  const skillCount = Object.keys(fd.learnedSkills || {}).length;
  strength = Math.max(20, strength - (skillCount * 10));
  
  if (totalScore < 5 || unresolvedCount === 0) {
    style = ATTACHMENT_STYLES.SECURE;
    strength = 30;
    rationaleKeys = STYLE_RATIONALES[ATTACHMENT_STYLES.SECURE];
  }
  
  return { style, strength, rationaleKeys };
}

// ============================================================================
// SCRIPT COMPUTATION
// ============================================================================

export function computeActiveScripts(gameState, personRole) {
  const load = computeFamilyTraumaLoad(gameState) || { tagCounts: { shame: 0, threat: 0, chaos: 0, role: 0 } };
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  if (!fd.perPerson) fd.perPerson = {};
  if (!fd.scripts) fd.scripts = {};
  if (!fd.learnedSkills) fd.learnedSkills = {};
  const role = normalizeParentRole(personRole);
  
  const activeScripts = [];
  const intensityMap = {};
  
  Object.values(FAMILY_SCRIPTS).forEach(script => {
    // Check if script applies to this role
    if (!script.roles.includes(role)) return;
    
    // Check if trauma tags match
    const tagCounts = load.tagCounts || { shame: 0, threat: 0, chaos: 0, role: 0 };
  const tagMatch = script.triggerTags.some(tag => (tagCounts[tag] || 0) > 0);
    if (!tagMatch) return;
    
    // Compute intensity
    let intensity = 0;
    const tagCounts2 = load.tagCounts || { shame: 0, threat: 0, chaos: 0, role: 0 };
    script.triggerTags.forEach(tag => {
      intensity += (tagCounts2[tag] || 0) * 15;
    });
    
    // Attachment style bonus
    if (fd.attachmentStyle === ATTACHMENT_STYLES.DISORGANIZED) intensity += 20;
    if (fd.attachmentStyle === ATTACHMENT_STYLES.ANXIOUS) intensity += 15;
    
    // Existing script state
    const existingScript = fd.scripts[script.id];
    if (existingScript) {
      intensity = existingScript.intensity;
      if (existingScript.resolved) intensity = Math.max(0, intensity - 30);
    }
    
    // Skill reductions
    script.counterSkills.forEach(skillId => {
      if (fd.learnedSkills[skillId]) {
        intensity = Math.max(0, intensity - 25);
      }
    });
    
    intensity = Math.min(100, Math.max(0, intensity));
    
    if (intensity > 20) {
      activeScripts.push(script.id);
      intensityMap[script.id] = intensity;
    }
  });
  
  return { scriptIds: activeScripts, intensityMap };
}

// ============================================================================
// PER-PERSON STATS & TRAJECTORY
// ============================================================================

export function initializePersonStats(gameState, personId) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  
  if (fd.perPerson[personId]) return fd.perPerson[personId];
  
  return {
    trust: 60,
    closeness: 60,
    friction: 20,
    trajectory: 'cordial',
    lastInteractionAge: 0
  };
}

export function updatePersonStats(gameState, personId, deltas) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  const person = fd.perPerson[personId] || initializePersonStats(gameState, personId);
  
  const newPerson = {
    ...person,
    trust: Math.max(0, Math.min(100, person.trust + (deltas.trust || 0))),
    closeness: Math.max(0, Math.min(100, person.closeness + (deltas.closeness || 0))),
    friction: Math.max(0, Math.min(100, person.friction + (deltas.friction || 0))),
    lastInteractionAge: gameState.currentYear
  };
  
  return newPerson;
}

export function computeTrajectory(person) {
  const { trust, closeness, friction } = person;
  
  if (trust >= 65 && closeness >= 65 && friction <= 30) {
    return 'close';
  }
  
  if (closeness <= 35) {
    return 'distant';
  }
  
  if (friction >= 60) {
    return 'tense';
  }
  
  // Rebuilding: trust is rising after tense
  const wasTense = person.trajectory === 'tense' || person.trajectory === 'distant';
  if (wasTense && trust >= 50 && closeness >= 45) {
    return 'rebuilding';
  }
  
  return 'cordial';
}

export function updateFamilyTrajectory(gameState, personId, interactionSummary) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  const person = fd.perPerson[personId] || initializePersonStats(gameState, personId);
  
  const newTrajectory = computeTrajectory(person);
  
  return {
    ...person,
    trajectory: newTrajectory
  };
}

// ============================================================================
// YEARLY DRIFT
// ============================================================================

export function applyYearlyFamilyDrift(gameState) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  
  Object.keys(fd.perPerson).forEach(personId => {
    const person = fd.perPerson[personId];
    const age = gameState.currentYear;
    
    // No interaction this year? Drift towards distant
    if (person.lastInteractionAge < age) {
      person.closeness = Math.max(0, person.closeness - 3);
      
      // Avoidant style amplifies
      if (fd.attachmentStyle === ATTACHMENT_STYLES.AVOIDANT) {
        person.closeness = Math.max(0, person.closeness - 2);
      }
    }
    
    // High friction causes trust erosion
    if (person.friction >= 60) {
      person.trust = Math.max(0, person.trust - 2);
    }
    
    // Update trajectory
    person.trajectory = computeTrajectory(person);
  });
  
  return fd;
}

// ============================================================================
// MICRO-TRIGGERS
// ============================================================================

const MICRO_TRIGGER_TEXTS = {
  [ATTACHMENT_STYLES.SECURE]: [
    "They ask if you're okay. You say yes. It's mostly true.",
    "A hug happens. It's not weird.",
    "You laugh at the same thing. Easy."
  ],
  [ATTACHMENT_STYLES.ANXIOUS]: [
    "They don't text back for 3 hours. Your brain writes a movie.",
    "You say something vulnerable. They say 'interesting.' You die inside.",
    "You check if they're mad. They say no. You don't believe them."
  ],
  [ATTACHMENT_STYLES.AVOIDANT]: [
    "They ask how you're feeling. You say 'fine' on autopilot.",
    "The conversation gets deep. You make a joke and leave.",
    "They reach out. You wait 6 hours to reply."
  ],
  [ATTACHMENT_STYLES.DISORGANIZED]: [
    "You want to call. You don't. You feel guilty both ways.",
    "They're nice to you. You brace for the other shoe.",
    "A normal conversation feels like a test you might fail."
  ]
};

export function shouldTriggerMicroMoment(gameState, personId) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  const person = fd.perPerson[personId] || initializePersonStats(gameState, personId);
  
  // Already triggered this year?
  const yearKey = `micro_${personId}_${gameState.currentYear}`;
  if (fd.yearlyFlags[yearKey]) return null;
  
  // Compute chance
  let baseChance = 0.08;
  
  if (fd.attachmentStyle === ATTACHMENT_STYLES.DISORGANIZED) baseChance = 0.15;
  else if (fd.attachmentStyle === ATTACHMENT_STYLES.ANXIOUS) baseChance = 0.12;
  
  if (person.friction >= 60) baseChance += 0.05;
  if (person.trajectory === 'tense') baseChance += 0.05;
  
  const roll = seededRandom(gameState.runSeed, yearKey);
  
  if (roll > baseChance) return null;
  
  // Pick text
  const texts = MICRO_TRIGGER_TEXTS[fd.attachmentStyle] || MICRO_TRIGGER_TEXTS[ATTACHMENT_STYLES.SECURE];
  const textIndex = Math.floor(seededRandom(gameState.runSeed, `${yearKey}_text`) * texts.length);
  
  return {
    personId,
    text: texts[textIndex],
    emoji: '😬'
  };
}

// ============================================================================
// MAJOR FAMILY MOMENTS
// ============================================================================

const MAJOR_MOMENTS = [
  {
    id: 'forgot_birthday',
    title: 'Forgot Birthday',
    roles: ['mother', 'father', 'my_mom', 'my_dad', 'sibling'],
    prompt: (personLabel) => `${personLabel} forgot your birthday. Again.`,
    choices: [
      {
        id: 'repair',
        label: 'Say how it hurt',
        emoji: '🧵',
        effects: { trust: -5, closeness: +10, friction: -10, relationship: +2, stress: +2 }
      },
      {
        id: 'boundary',
        label: 'Stop expecting them to remember',
        emoji: '🧱',
        effects: { trust: 0, closeness: -5, friction: -15, relationship: -3, stress: -1 }
      },
      {
        id: 'avoid',
        label: 'Say "no big deal"',
        emoji: '🫥',
        effects: { trust: -3, closeness: -8, friction: +5, relationship: 0, stress: -2 }
      },
      {
        id: 'perform',
        label: 'Pretend you forgot too',
        emoji: '🎭',
        effects: { trust: -5, closeness: -10, friction: +10, relationship: +1, stress: +3 }
      }
    ]
  },
  {
    id: 'unsolicited_advice',
    title: 'Unsolicited Life Advice',
    roles: ['mother', 'father', 'my_mom', 'my_dad'],
    prompt: (personLabel) => `${personLabel} turns your vulnerable share into a TED talk.`,
    choices: [
      {
        id: 'repair',
        label: 'Ask them to just listen',
        emoji: '🧵',
        effects: { trust: +5, closeness: +8, friction: -5, relationship: +3, stress: +1 }
      },
      {
        id: 'boundary',
        label: 'Change the subject',
        emoji: '🧱',
        effects: { trust: 0, closeness: -3, friction: -10, relationship: -2, stress: 0 }
      },
      {
        id: 'avoid',
        label: 'Nod and tune out',
        emoji: '🫥',
        effects: { trust: -2, closeness: -10, friction: +8, relationship: 0, stress: -1 }
      },
      {
        id: 'perform',
        label: 'Thank them enthusiastically',
        emoji: '🎭',
        effects: { trust: -5, closeness: -5, friction: +5, relationship: +2, stress: +2 }
      }
    ]
  },
  {
    id: 'sibling_comparison',
    title: 'Sibling Comparison',
    roles: ['sibling'],
    prompt: (personLabel) => `${personLabel} says you're "lucky" for what they don't see you struggling with.`,
    choices: [
      {
        id: 'repair',
        label: 'Share your real struggles',
        emoji: '🧵',
        effects: { trust: +8, closeness: +12, friction: -10, relationship: +4, stress: +2 }
      },
      {
        id: 'boundary',
        label: 'Call out the comparison',
        emoji: '🧱',
        effects: { trust: +2, closeness: -5, friction: -15, relationship: -1, stress: +1 }
      },
      {
        id: 'avoid',
        label: 'Shrug it off',
        emoji: '🫥',
        effects: { trust: -3, closeness: -12, friction: +10, relationship: 0, stress: -1 }
      },
      {
        id: 'perform',
        label: 'Agree and downplay yourself',
        emoji: '🎭',
        effects: { trust: -8, closeness: -8, friction: +15, relationship: +1, stress: +3 }
      }
    ]
  }
];

export function shouldEnqueueMajorFamilyMoment(gameState) {
  const age = gameState.currentYear;
  if (age < 10 || age > 18) return null;
  
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  const yearKey = `majorFam_${age}`;
  
  if (fd.yearlyFlags[yearKey]) return null;
  
  // 3% chance
  const roll = seededRandom(gameState.runSeed, yearKey);
  if (roll > 0.03) return null;
  
  // Pick moment
  const eligibleMoments = MAJOR_MOMENTS;
  const momentIndex = Math.floor(seededRandom(gameState.runSeed, `${yearKey}_moment`) * eligibleMoments.length);
  const moment = eligibleMoments[momentIndex];
  
  // Pick person
  const eligibleRoles = moment.roles;
  const roleIndex = Math.floor(seededRandom(gameState.runSeed, `${yearKey}_role`) * eligibleRoles.length);
  const role = eligibleRoles[roleIndex];
  
  // Find person ID with that role
  const roster = Array.isArray(gameState.relationships?.roster) ? gameState.relationships.roster : [];
  const person = roster.find(p => p.role === role);
  if (!person) return null;
  
  return {
    momentId: moment.id,
    personId: person.id,
    personLabel: person.name || role,
    moment
  };
}

// ============================================================================
// SKILL UNLOCK LOGIC
// ============================================================================

export function checkSkillUnlocks(gameState, actionId) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  const progress = fd.skillProgress || {};
  const unlocked = [];
  
  // Repair Talk unlocks selfReg
  if (actionId === 'repairTalk') {
    progress.repairTalkCount = (progress.repairTalkCount || 0) + 1;
    if (progress.repairTalkCount >= 3 && !fd.learnedSkills.selfReg) {
      fd.learnedSkills.selfReg = true;
      unlocked.push(FAMILY_SKILLS.selfReg);
    }
  }
  
  // Boundary unlocks boundaries skill
  if (actionId === 'setBoundary') {
    progress.boundaryCount = (progress.boundaryCount || 0) + 1;
    if (progress.boundaryCount >= 2 && !fd.learnedSkills.boundaries) {
      fd.learnedSkills.boundaries = true;
      unlocked.push(FAMILY_SKILLS.boundaries);
    }
  }
  
  // Apology unlocks apology skill
  if (actionId === 'apologize') {
    progress.apologyCount = (progress.apologyCount || 0) + 1;
    if (progress.apologyCount >= 1 && !fd.learnedSkills.apology) {
      fd.learnedSkills.apology = true;
      unlocked.push(FAMILY_SKILLS.apology);
    }
  }
  
  // Ask for support success unlocks repairTalk
  if (actionId === 'askSupport_success') {
    progress.supportSuccessCount = (progress.supportSuccessCount || 0) + 1;
    if (progress.supportSuccessCount >= 1 && !fd.learnedSkills.repairTalk) {
      fd.learnedSkills.repairTalk = true;
      unlocked.push(FAMILY_SKILLS.repairTalk);
    }
  }
  
  // Joke usage
  if (actionId === 'makeJoke') {
    progress.jokeCount = (progress.jokeCount || 0) + 1;
    if (progress.jokeCount >= 5 && !fd.learnedSkills.humor) {
      fd.learnedSkills.humor = true;
      unlocked.push(FAMILY_SKILLS.humor);
      
      // Check if jokes as armor script is active
      const scripts = computeActiveScripts(gameState, 'mother'); // Check any role
      if (scripts.scriptIds.includes('jokesAsArmor')) {
        // Increase intensity if no repair balance
        if (!fd.learnedSkills.repairTalk && fd.scripts.jokesAsArmor) {
          fd.scripts.jokesAsArmor.intensity = Math.min(100, (fd.scripts.jokesAsArmor.intensity || 50) + 15);
        }
      }
    }
  }
  
  fd.skillProgress = progress;
  
  return unlocked;
}

// ============================================================================
// SCRIPT INTENSITY REDUCTION
// ============================================================================

export function reduceScriptIntensity(gameState, scriptId, amount) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  
  if (!fd.scripts[scriptId]) {
    fd.scripts[scriptId] = { intensity: 50, resolved: false };
  }
  
  fd.scripts[scriptId].intensity = Math.max(0, fd.scripts[scriptId].intensity - amount);
  
  if (fd.scripts[scriptId].intensity <= 10) {
    fd.scripts[scriptId].resolved = true;
  }
  
  return fd.scripts[scriptId];
}

// ============================================================================
// INTEGRATION WITH TRAUMA SYSTEM
// ============================================================================

export function getFamilyDynamicsModifiers(gameState, personRole) {
  const fd = gameState.familyDynamics || initializeFamilyDynamics(gameState);
  if (!fd.perPerson) fd.perPerson = {};
  if (!fd.scripts) fd.scripts = {};
  if (!fd.learnedSkills) fd.learnedSkills = {};
  const role = normalizeParentRole(personRole);
  
  // Attachment style multipliers
  const styleMult = STYLE_MULTIPLIERS[fd.attachmentStyle] || STYLE_MULTIPLIERS[ATTACHMENT_STYLES.SECURE];
  
  // Script penalties
  const scripts = computeActiveScripts(gameState, role);
  let scriptGainPenalty = 0;
  let scriptLossPenalty = 0;
  
  scripts.scriptIds.forEach(scriptId => {
    const script = FAMILY_SCRIPTS[scriptId];
    const intensity = scripts.intensityMap[scriptId] || 0;
    const factor = intensity / 100;
    
    scriptGainPenalty += script.gainPenalty * factor;
    scriptLossPenalty += script.lossPenalty * factor;
  });
  
  // Trajectory multipliers
  const roster = Array.isArray(gameState.relationships?.roster) ? gameState.relationships.roster : [];
  const rel = roster.find(p => normalizeParentRole(p.role) === role);
  const person = rel ? (fd.perPerson?.[rel.id] || null) : null;
  let trajectoryGainMult = 1.0;
  let trajectoryLossMult = 1.0;
  
  if (person) {
    if (person.trajectory === 'close') {
      trajectoryGainMult = 1.15;
      trajectoryLossMult = 0.85;
    } else if (person.trajectory === 'tense') {
      trajectoryGainMult = 0.75;
      trajectoryLossMult = 1.25;
    } else if (person.trajectory === 'distant') {
      trajectoryGainMult = 0.60;
      trajectoryLossMult = 1.10;
    } else if (person.trajectory === 'rebuilding') {
      trajectoryGainMult = 1.10;
      trajectoryLossMult = 0.95;
    }
  }
  
  const finalGainMult = styleMult.gainMult * (1 - scriptGainPenalty) * trajectoryGainMult;
  const finalLossMult = styleMult.lossMult * (1 + scriptLossPenalty) * trajectoryLossMult;
  
  // Trigger chance
  let triggerChance = styleMult.triggerChance;
  scripts.scriptIds.forEach(scriptId => {
    const intensity = scripts.intensityMap[scriptId] || 0;
    triggerChance += (intensity / 100) * 0.05;
  });
  
  // Skill reductions
  Object.keys(fd.learnedSkills || {}).forEach(skillId => {
    triggerChance = Math.max(0.02, triggerChance - 0.03);
  });
  
  return {
    gainMult: Math.max(0.4, finalGainMult), // Always allow some gain
    lossMult: finalLossMult,
    triggerChance: Math.min(0.25, triggerChance)
  };
}