// Spouse-only Love Language system (married partner only).
// RULE: exactly one love language is always 0% and will never be accepted.

export const LOVE_LANGUAGES = [
  { id: 'words', label: 'Words of Affirmation', emoji: '💬' },
  { id: 'acts',  label: 'Acts of Service',      emoji: '🧰' },
  { id: 'gifts', label: 'Receiving Gifts',      emoji: '🎁' },
  { id: 'time',  label: 'Quality Time',        emoji: '⏳' },
  { id: 'touch', label: 'Physical Touch',      emoji: '🤝' },
];

const ACTION_TO_LANGUAGE = {
  talk: 'words',
  compliment: 'words',
  spendTime: 'time',
  dateNight: 'time',
  laugh: 'time',
  gift: 'gifts',
  coParentSync: 'acts',
  homeReset: 'acts',
  repair: 'acts',
  affection: 'touch',
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function hashStringToInt(str) {
  let hash = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function makeRng(seed) {
  let state = Number.isFinite(seed) ? seed : hashStringToInt(seed);
  return function () {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

export function getLanguageForAction(actionId) {
  return ACTION_TO_LANGUAGE[actionId] || null;
}

export function generateLoveLanguageProfile({ seed }) {
  const rng = makeRng(seed || 'loveLanguages');
  const ids = LOVE_LANGUAGES.map(l => l.id);

  // Pick the dead zone (always 0%)
  const deadId = ids[Math.floor(rng() * ids.length)];
  const remaining = ids.filter(id => id !== deadId);

  // Pick 2 primaries from remaining
  const primaryA = remaining.splice(Math.floor(rng() * remaining.length), 1)[0];
  const primaryB = remaining.splice(Math.floor(rng() * remaining.length), 1)[0];

  const secondaryA = remaining[0];
  const secondaryB = remaining[1];

  const weights = {
    [deadId]: 0,
    [primaryA]: 0.85 + rng() * 0.15,
    [primaryB]: 0.75 + rng() * 0.20,
    [secondaryA]: 0.35 + rng() * 0.30,
    [secondaryB]: 0.35 + rng() * 0.30,
  };

  const discovered = {};
  const exposures = {};
  ids.forEach(id => {
    discovered[id] = 'unknown'; // unknown | primary | liked | meh | dead
    exposures[id] = 0;
  });

  return {
    deadId,
    weights,
    discovered,
    exposures,
    lastClueAge: null,
  };
}

const LOVE_REACTIONS = {
  love: [
    "{name} melts. Like… cartoon-level heart eyes.",
    "{name} smiles so hard it looks like a new personality.",
    "{name} goes: “OH. You get me.” (rare loot)",
    "{name} visibly relaxes. You just unlocked the good timeline.",
    "{name} says: “Okay… that was actually perfect.”",
  ],
  like: [
    "{name} nods approvingly. Points were awarded.",
    "{name} says: “That was really sweet.”",
    "{name} looks genuinely pleased. Nice work.",
    "{name} says: “More of that, please.”",
    "{name} leans in: “Okay, I liked that.”",
  ],
  meh: [
    "{name} says: “Aw… thanks.” (polite, not life-changing)",
    "{name} appreciates it… in theory.",
    "{name} says: “Cute.” (you can't tell if that's good)",
    "{name} is like: “Nice.” (and then checks the fridge)",
    "{name} says: “That’s fine.” (the highest form of neutrality)",
  ],
  refuse: [
    "{name} says: “That’s… not my love language.”",
    "{name} rejects it gently. Like a bouncer in a cardigan.",
    "{name} goes: “Please don’t. I’m allergic to that vibe.”",
    "{name} says: “I hear you… but I do not receive you.”",
    "{name} refuses. Your relationship bar files a complaint.",
  ],
};

const DEAD_LANGUAGE_SNARK = {
  gifts: [
    "They push the gift back like it’s haunted. You keep your money. You lose your dignity.",
    "They say: “No gifts. Ever.” You consider returning capitalism.",
    "They refuse the gift and somehow you feel judged by their eyebrows."
  ],
  touch: [
    "They lean away like you’re a walking sweater of discomfort.",
    "They say: “I love you… from over there.”",
    "They hit you with a ‘side hug’ so powerful it removes hope."
  ],
  words: [
    "Compliments bounce off them like ping-pong balls of awkwardness.",
    "They say: “Please don’t narrate your feelings at me.”",
    "They go: “Thanks.” (and then immediately changes the topic)"
  ],
  acts: [
    "You do a helpful thing. They react like you just rearranged their soul.",
    "They say: “Stop doing tasks at me.”",
    "They look suspicious. Like chores are a trap."
  ],
  time: [
    "You try to hang out. They say: “I need… less togetherness.”",
    "They stare at the clock like it personally insulted them.",
    "They say: “I adore you. Separately.”"
  ]
};

export function applyLoveLanguageToInteraction({
  actionId,
  baseMeterDelta,
  baseMoneyDelta,
  loveProfile,
  partnerName
}) {
  const languageId = getLanguageForAction(actionId);
  if (!languageId || !loveProfile?.weights) {
    return {
      meterDelta: baseMeterDelta,
      moneyDelta: baseMoneyDelta,
      reactionLine: '',
      updatedProfile: null
    };
  }

  const weight = Number(loveProfile.weights[languageId] ?? 0.5);

  const updated = {
    ...loveProfile,
    exposures: { ...(loveProfile.exposures || {}) },
    discovered: { ...(loveProfile.discovered || {}) }
  };

  updated.exposures[languageId] = (updated.exposures[languageId] || 0) + 1;

  let meterDelta = baseMeterDelta;
  let moneyDelta = baseMoneyDelta;

  // Refusal (dead zone)
  if (weight <= 0) {
    meterDelta = -Math.max(5, Math.round(Math.abs(baseMeterDelta || 6) * 0.7));
    if (actionId === 'gift' && moneyDelta < 0) moneyDelta = 0; // gift refused => no spending

    updated.discovered[languageId] = 'dead';

    const deadSnark = pick(DEAD_LANGUAGE_SNARK[languageId] || []);
    const core = pick(LOVE_REACTIONS.refuse).replace('{name}', partnerName);

    return {
      meterDelta,
      moneyDelta,
      reactionLine: `🚫 ${core}${deadSnark ? `\n\n${deadSnark}` : ''}`,
      updatedProfile: updated
    };
  }

  // Positive / neutral outcomes
  if (weight >= 0.8) {
    meterDelta = Math.round(baseMeterDelta * 1.6);
    if (updated.discovered[languageId] === 'unknown' && updated.exposures[languageId] >= 2) {
      updated.discovered[languageId] = 'primary';
    }
    const core = pick(LOVE_REACTIONS.love).replace('{name}', partnerName);
    return {
      meterDelta,
      moneyDelta,
      reactionLine: `💖 ${core}`,
      updatedProfile: updated
    };
  }

  if (weight >= 0.5) {
    meterDelta = Math.round(baseMeterDelta * 1.15);
    if (updated.discovered[languageId] === 'unknown' && updated.exposures[languageId] >= 3) {
      updated.discovered[languageId] = 'liked';
    }
    const core = pick(LOVE_REACTIONS.like).replace('{name}', partnerName);
    return {
      meterDelta,
      moneyDelta,
      reactionLine: `🙂 ${core}`,
      updatedProfile: updated
    };
  }

  // Low weight (meh)
  meterDelta = Math.round(baseMeterDelta * 0.7);
  if (updated.discovered[languageId] === 'unknown' && updated.exposures[languageId] >= 3) {
    updated.discovered[languageId] = 'meh';
  }
  const core = pick(LOVE_REACTIONS.meh).replace('{name}', partnerName);
  return {
    meterDelta,
    moneyDelta,
    reactionLine: `😐 ${core}`,
    updatedProfile: updated
  };
}

export function getLoveLanguageClue({ loveProfile, currentYear, partnerName }) {
  if (!loveProfile) {
    return { clueText: `${partnerName} shrugs. “I dunno. I like… vibes?”`, updatedProfile: loveProfile };
  }

  if (loveProfile.lastClueAge === currentYear) {
    return {
      clueText: `${partnerName} says: “We already had the feelings meeting this year.”`,
      updatedProfile: loveProfile
    };
  }

  const updated = { ...loveProfile, discovered: { ...loveProfile.discovered }, lastClueAge: currentYear };

  const ids = LOVE_LANGUAGES.map(l => l.id);
  const unknown = ids.filter(id => updated.discovered[id] === 'unknown');
  const chosen = (unknown.length ? unknown : ids)[Math.floor(Math.random() * (unknown.length ? unknown.length : ids.length))];

  const meta = LOVE_LANGUAGES.find(l => l.id === chosen);
  const weight = Number(updated.weights?.[chosen] ?? 0.5);

  let clue = '';

  if (weight <= 0) {
    updated.discovered[chosen] = 'dead';
    clue = `${partnerName} admits: “Please don’t try to love me through *${meta?.label}*. It makes me recoil spiritually.”\n\n(Clue: one love language is always a 0% dead zone.)`;
  } else if (weight >= 0.8) {
    // Don't fully reveal "primary", just a strong hint
    if (updated.discovered[chosen] === 'unknown') updated.discovered[chosen] = 'liked';
    clue = `${partnerName} says: “If you want me to feel loved… lean into *${meta?.label}*.”\n\nYou quietly take notes like this is a final exam.`;
  } else if (weight >= 0.5) {
    if (updated.discovered[chosen] === 'unknown') updated.discovered[chosen] = 'meh';
    clue = `${partnerName} says: “*${meta?.label}* is nice, I guess.”\n\nNot fireworks. But not nothing.`;
  } else {
    if (updated.discovered[chosen] === 'unknown') updated.discovered[chosen] = 'meh';
    clue = `${partnerName} says: “*${meta?.label}* doesn’t do much for me.”\n\nYou nod like you totally expected this.`;
  }

  return { clueText: clue, updatedProfile: updated };
}