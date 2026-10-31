// OUTCOME HEADLINERS - "What stuck with them"
// Deterministic selection of EXACTLY 2 impactful lines per run

// ===== COPY BANK =====
const GOOD_LINES = [
  "You put your phone down mid-sentence. Your child learned they can compete with the world—and win.",
  'You apologized without adding a "but." They learned adults can be wrong and still be safe.',
  "You kept your promise, even when it was inconvenient. Trust became their default setting.",
  "You noticed the small win. They started noticing themselves.",
  "You let them cry without fixing it. They learned feelings are weather, not emergencies.",
  "You praised effort, not the trophy. They learned how to try again.",
  'You held the boundary and stayed kind. They learned "no" doesn\'t mean "not loved."',
  "You admitted you didn't know and looked it up together. Curiosity became normal.",
  "You protected their sleep like it mattered. Their brain finally believed it was safe to rest.",
  'You asked, "What do you think we should do?" Problem-solving became a muscle.',
  "You made space for their weird hobby. They grew a self that doesn't need permission.",
  "You didn't laugh when they mispronounced the word. They kept speaking up.",
  "You showed up—late, tired, imperfect—anyway. Reliability beat perfection.",
  "You defended them in public and coached them in private. They learned dignity and growth can coexist.",
  "You taught them the name of what they felt. Their emotions stopped being monsters.",
  "You ended the argument before it became a wound. They learned conflict can end gently.",
  "You told the truth in an age-appropriate way. They learned reality doesn't require secrecy.",
  "You let them fail safely. Confidence became earned, not gifted.",
  "You didn't make their success about you. They kept wanting to succeed.",
  "You kept your standards high and your love higher. They learned worth isn't performance-based.",
  "You listened to the whole story. They learned they don't have to edit themselves to be loved.",
  'You respected their "no" on something small. They learned consent isn\'t a lecture—it\'s a lifestyle.',
  'You let them be mad at you without punishing it. They learned honesty won\'t cost them connection.',
  'You repaired after a rough day. Their nervous system learned: "bad moments aren\'t the end."',
  "You broke the cycle you inherited. They grew up with a future you never got."
];

const BAD_LINES = [
  'You said "I\'m fine" in that voice. They learned to read moods, not words.',
  "You joked about their mistake in front of others. They started practicing silence.",
  "You corrected them faster than you understood them. They stopped bringing you drafts of themselves.",
  "You praised them only when they were easy. They learned love is a job.",
  "You fixed every problem before they touched it. They grew up allergic to discomfort.",
  "You made everything a lesson. They stopped bringing you anything real.",
  "You asked for honesty, then punished it. They became excellent at hiding.",
  'You compared them to "kids who behave." They became a kid who performs.',
  "You kept score of sacrifices. Gratitude turned into guilt.",
  'You turned "help" into control. They learned independence is the only privacy.',
  "You vented to them like they were an adult. They learned love means carrying weight.",
  'You called them "dramatic" when they were scared. They learned to doubt their own alarm bells.',
  "You demanded respect without modeling it. They learned power, not leadership.",
  "You made their feelings inconvenient. They became convenient.",
  "You only noticed them when something went wrong. They started expecting disaster to feel seen.",
  'You broke a promise and called it "life." They learned hope is embarrassing.',
  'You said "Because I said so" too often. They learned not to ask why—just to sneak.',
  "You mocked the thing they loved. They learned joy is a liability.",
  "You treated mistakes like character flaws. They learned perfection is safer than growth.",
  "You used shame as motivation. It worked—until it became their voice.",
  "You demanded they be grateful while they were hurting. They learned pain is rude.",
  "You made affection unpredictable. They became excellent at earning scraps.",
  "You punished the symptom and ignored the need. The need didn't disappear—it went underground.",
  "You kept moving the goalposts. They stopped feeling proud, even when they won.",
  "You taught them peace comes from staying small. They stayed small—even when they were ready to grow."
];

// Legacy structured library (kept for backward compatibility, but not used)
const HEADLINER_LIBRARY = {
  positive: [
    {
      text: "You put your phone down mid-sentence. Your child learned they can compete with the world—and win.",
      condition: (signals) => (signals.bondYears + signals.playYears) >= 4 || signals.loveBand === 'high' || signals.loveBand === 'veryHigh'
    },
    {
      text: 'You apologized without adding a "but." They learned adults can be wrong and still be safe.',
      condition: (signals) => signals.repairYears >= 1 || signals.studyYears >= 2
    },
    {
      text: "You kept your promise, even when it was inconvenient. Trust became their default setting.",
      condition: (signals) => signals.routineYears >= 2 && signals.harsh === 0
    },
    {
      text: "You noticed the small win. They started noticing themselves.",
      condition: (signals) => signals.bondYears >= 2 || signals.playYears >= 3
    },
    {
      text: "You let them cry without fixing it. They learned feelings are weather, not emergencies.",
      condition: (signals) => (signals.empathyBand === 'high' || signals.empathyBand === 'veryHigh') && signals.harsh === 0
    },
    {
      text: "You praised effort, not the trophy. They learned how to try again.",
      condition: (signals) => signals.confidenceBand === 'high' || signals.confidenceBand === 'veryHigh' || (signals.studyYears >= 2 && signals.bondYears >= 1)
    },
    {
      text: 'You held the boundary and stayed kind. They learned "no" doesn\'t mean "not loved."',
      condition: (signals) => (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh') && signals.empathyBand !== 'neg' && signals.empathyBand !== 'low' && signals.harsh === 0
    },
    {
      text: "You admitted you didn't know and looked it up together. Curiosity became normal.",
      condition: (signals) => signals.studyYears >= 2 || signals.intelligenceBand === 'high' || signals.intelligenceBand === 'veryHigh'
    },
    {
      text: "You protected their sleep like it mattered. Their brain finally believed it was safe to rest.",
      condition: (signals) => signals.sleepYears >= 1
    },
    {
      text: 'You asked, "What do you think we should do?" Problem-solving became a muscle.',
      condition: (signals) => (signals.empathyBand === 'high' || signals.empathyBand === 'veryHigh') && signals.confidenceBand !== 'neg' && signals.confidenceBand !== 'low'
    },
    {
      text: "You made space for their weird hobby. They grew a self that doesn't need permission.",
      condition: (signals) => signals.hasInterest && (signals.bondYears + signals.playYears) >= 3
    },
    {
      text: "You didn't laugh when they mispronounced the word. They kept speaking up.",
      condition: (signals) => (signals.empathyBand === 'high' || signals.empathyBand === 'veryHigh') && signals.harsh === 0
    },
    {
      text: "You showed up—late, tired, imperfect—anyway. Reliability beat perfection.",
      condition: (signals) => (signals.stressBand === 'mid' || signals.stressBand === 'high' || signals.stressBand === 'veryHigh') && signals.bondYears >= 2
    },
    {
      text: "You defended them in public and coached them in private. They learned dignity and growth can coexist.",
      condition: (signals) => (signals.empathyBand === 'high' || signals.empathyBand === 'veryHigh') && (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh')
    },
    {
      text: "You taught them the name of what they felt. Their emotions stopped being monsters.",
      condition: (signals) => signals.empathyBand === 'high' || signals.empathyBand === 'veryHigh' || signals.repairYears >= 1
    },
    {
      text: "You ended the argument before it became a wound. They learned conflict can end gently.",
      condition: (signals) => signals.repairYears >= 1 && signals.harsh === 0
    },
    {
      text: "You told the truth in an age-appropriate way. They learned reality doesn't require secrecy.",
      condition: (signals) => signals.empathyBand !== 'neg' && signals.empathyBand !== 'low' && signals.harsh === 0
    },
    {
      text: "You let them fail safely. Confidence became earned, not gifted.",
      condition: (signals) => (signals.confidenceBand === 'high' || signals.confidenceBand === 'veryHigh') && signals.disciplineBand !== 'neg' && signals.disciplineBand !== 'low'
    },
    {
      text: "You didn't make their success about you. They kept wanting to succeed.",
      condition: (signals) => (signals.loveBand === 'high' || signals.loveBand === 'veryHigh') && signals.harsh === 0
    },
    {
      text: "You kept your standards high and your love higher. They learned worth isn't performance-based.",
      condition: (signals) => (signals.loveBand === 'high' || signals.loveBand === 'veryHigh') && (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh')
    },
    {
      text: "You listened to the whole story. They learned they don't have to edit themselves to be loved.",
      condition: (signals) => signals.bondYears >= 2 && signals.empathyBand !== 'neg' && signals.empathyBand !== 'low'
    },
    {
      text: 'You respected their "no" on something small. They learned consent isn\'t a lecture—it\'s a lifestyle.',
      condition: (signals) => (signals.empathyBand === 'high' || signals.empathyBand === 'veryHigh') && signals.disciplineBand !== 'veryHigh'
    },
    {
      text: 'You let them be mad at you without punishing it. They learned honesty won\'t cost them connection.',
      condition: (signals) => (signals.loveBand === 'high' || signals.loveBand === 'veryHigh') && signals.harsh === 0
    },
    {
      text: 'You repaired after a rough day. Their nervous system learned: "bad moments aren\'t the end."',
      condition: (signals) => signals.repairYears >= 1
    },
    {
      text: "You broke the cycle you inherited. They grew up with a future you never got.",
      condition: (signals) => signals.harsh === 0 && signals.repairYears >= 2
    }
  ],
  negative: [
    {
      text: 'You said "I\'m fine" in that voice. They learned to read moods, not words.',
      condition: (signals) => (signals.stressBand === 'high' || signals.stressBand === 'veryHigh') && (signals.loveBand === 'low' || signals.loveBand === 'neg')
    },
    {
      text: "You joked about their mistake in front of others. They started practicing silence.",
      condition: (signals) => signals.empathyBand === 'low' || signals.empathyBand === 'neg'
    },
    {
      text: "You corrected them faster than you understood them. They stopped bringing you drafts of themselves.",
      condition: (signals) => (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh') && (signals.empathyBand === 'low' || signals.empathyBand === 'neg')
    },
    {
      text: "You praised them only when they were easy. They learned love is a job.",
      condition: (signals) => (signals.loveBand === 'low' || signals.loveBand === 'neg') && signals.harsh >= 1
    },
    {
      text: "You fixed every problem before they touched it. They grew up allergic to discomfort.",
      condition: (signals) => (signals.confidenceBand === 'low' || signals.confidenceBand === 'neg') && (signals.bondYears + signals.playYears) >= 3
    },
    {
      text: "You made everything a lesson. They stopped bringing you anything real.",
      condition: (signals) => signals.studyYears >= 3 && signals.bondYears === 0 && signals.playYears === 0
    },
    {
      text: "You asked for honesty, then punished it. They became excellent at hiding.",
      condition: (signals) => signals.harsh >= 2
    },
    {
      text: 'You compared them to "kids who behave." They became a kid who performs.',
      condition: (signals) => signals.harsh >= 1 && (signals.confidenceBand === 'low' || signals.confidenceBand === 'neg')
    },
    {
      text: "You kept score of sacrifices. Gratitude turned into guilt.",
      condition: (signals) => (signals.stressBand === 'high' || signals.stressBand === 'veryHigh') && (signals.loveBand === 'low' || signals.loveBand === 'neg')
    },
    {
      text: 'You turned "help" into control. They learned independence is the only privacy.',
      condition: (signals) => signals.disciplineBand === 'veryHigh' && (signals.empathyBand === 'low' || signals.empathyBand === 'neg')
    },
    {
      text: "You vented to them like they were an adult. They learned love means carrying weight.",
      condition: (signals) => (signals.stressBand === 'high' || signals.stressBand === 'veryHigh') && (signals.empathyBand === 'low' || signals.empathyBand === 'neg')
    },
    {
      text: 'You called them "dramatic" when they were scared. They learned to doubt their own alarm bells.',
      condition: (signals) => (signals.empathyBand === 'low' || signals.empathyBand === 'neg') && (signals.confidenceBand === 'low' || signals.confidenceBand === 'neg')
    },
    {
      text: "You demanded respect without modeling it. They learned power, not leadership.",
      condition: (signals) => (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh') && signals.harsh >= 1
    },
    {
      text: "You made their feelings inconvenient. They became convenient.",
      condition: (signals) => signals.empathyBand === 'low' || signals.empathyBand === 'neg'
    },
    {
      text: "You only noticed them when something went wrong. They started expecting disaster to feel seen.",
      condition: (signals) => signals.bondYears === 0 && signals.playYears === 0
    },
    {
      text: 'You broke a promise and called it "life." They learned hope is embarrassing.',
      condition: (signals) => signals.routineYears === 0 && (signals.loveBand === 'low' || signals.loveBand === 'neg')
    },
    {
      text: 'You said "Because I said so" too often. They learned not to ask why—just to sneak.',
      condition: (signals) => (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh') && (signals.empathyBand === 'low' || signals.empathyBand === 'neg') && signals.harsh >= 1
    },
    {
      text: "You mocked the thing they loved. They learned joy is a liability.",
      condition: (signals) => (signals.loveBand === 'low' || signals.loveBand === 'neg') && (signals.empathyBand === 'low' || signals.empathyBand === 'neg')
    },
    {
      text: "You treated mistakes like character flaws. They learned perfection is safer than growth.",
      condition: (signals) => (signals.empathyBand === 'low' || signals.empathyBand === 'neg') && (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh')
    },
    {
      text: "You used shame as motivation. It worked—until it became their voice.",
      condition: (signals) => signals.harsh >= 2 || signals.empathyBand === 'neg'
    },
    {
      text: "You demanded they be grateful while they were hurting. They learned pain is rude.",
      condition: (signals) => signals.empathyBand === 'neg' && (signals.loveBand === 'low' || signals.loveBand === 'neg')
    },
    {
      text: "You made affection unpredictable. They became excellent at earning scraps.",
      condition: (signals) => (signals.loveBand === 'low' || signals.loveBand === 'neg') && signals.harsh >= 1
    },
    {
      text: "You punished the symptom and ignored the need. The need didn't disappear—it went underground.",
      condition: (signals) => signals.harsh >= 1 && (signals.empathyBand === 'low' || signals.empathyBand === 'neg')
    },
    {
      text: "You kept moving the goalposts. They stopped feeling proud, even when they won.",
      condition: (signals) => (signals.disciplineBand === 'high' || signals.disciplineBand === 'veryHigh') && (signals.loveBand === 'low' || signals.loveBand === 'neg')
    },
    {
      text: "You taught them peace comes from staying small. They stayed small—even when they were ready to grow.",
      condition: (signals) => (signals.confidenceBand === 'low' || signals.confidenceBand === 'neg') && (signals.loveBand === 'low' || signals.loveBand === 'neg')
    }
  ]
};

// ===== BAND HELPER =====
function band(v) {
  if (v < 0) return "neg";
  if (v < 10) return "low";
  if (v < 25) return "mid";
  if (v < 40) return "high";
  return "veryHigh";
}

// ===== SEEDED RNG =====
function createSeededRng(seed) {
  let state = 0;
  for (let i = 0; i < seed.length; i++) {
    state = ((state << 5) - state) + seed.charCodeAt(i);
    state = state & state;
  }
  state = Math.abs(state) | 0;
  
  return {
    nextFloat: () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    },
    pick: (array) => {
      if (!array || array.length === 0) return null;
      return array[Math.floor((state = (state * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff * array.length)];
    }
  };
}

// ===== MAIN HEADLINER FUNCTION =====
// Returns EXACTLY 2 lines per run
export function getOutcomeHeadliners(gameState) {
  try {
    const stats = gameState.stats || {};
    const love = stats.love ?? 0;
    const empathy = stats.empathy ?? 0;
    const stress = gameState.stress ?? 0;
    
    // ===== DETERMINE OUTCOME TONE =====
    // Primarily based on Love + Empathy + Stress
    let outcomeTone = "mixed";
    
    // Bad indicators
    const loveLow = love <= 0;
    const empathyLow = empathy <= 0;
    const stressHigh = stress >= 12;
    
    // Good indicators
    const loveHigh = love >= 12;
    const empathyHigh = empathy >= 12;
    const stressLow = stress <= 3;
    
    // Determine tone
    if ((loveLow || empathyLow) || stressHigh) {
      outcomeTone = "bad";
    } else if (loveHigh && empathyHigh && stressLow) {
      outcomeTone = "good";
    }
    
    // Seeded RNG (deterministic per run)
    const seed = `${gameState.runSeed || 'default'}|headliners2|${gameState.childName}`;
    const rng = createSeededRng(seed);
    
    // ===== SELECT EXACTLY 2 LINES =====
    const result = [];
    
    if (outcomeTone === "good") {
      // Pick 2 from GOOD_LINES (no repeats)
      const shuffled = [...GOOD_LINES].sort(() => rng.nextFloat() - 0.5);
      result.push(shuffled[0], shuffled[1]);
    } else if (outcomeTone === "bad") {
      // Pick 2 from BAD_LINES (no repeats)
      const shuffled = [...BAD_LINES].sort(() => rng.nextFloat() - 0.5);
      result.push(shuffled[0], shuffled[1]);
    } else {
      // Mixed: 1 from GOOD_LINES + 1 from BAD_LINES
      const goodShuffled = [...GOOD_LINES].sort(() => rng.nextFloat() - 0.5);
      const badShuffled = [...BAD_LINES].sort(() => rng.nextFloat() - 0.5);
      result.push(goodShuffled[0], badShuffled[0]);
    }
    
    // Failsafe (should never hit)
    if (result.length < 2) {
      while (result.length < 2) {
        result.push("Time passed. Patterns stuck.");
      }
    }
    
    return result.slice(0, 2); // Guarantee exactly 2
  } catch (error) {
    console.error('[getOutcomeHeadliners] Error:', error);
    // Fallback: return 2 neutral lines
    return ["Time passed.", "Patterns stuck."];
  }
}