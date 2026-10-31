/**
 * Airport Micro-Scenarios v1
 * Occasional airport/flight hassles for International Trips only.
 * 
 * Probability:
 * - 5% of flights: "Forbidden Joke" security ordeal
 * - Additional 28% of flights: one of 9 other airport scenarios
 * - Total: 33% chance per international trip
 */

export const AIRPORT_EVENT_TOTAL_PROB = 0.33;
export const AIRPORT_BOMB_JOKE_PROB = 0.05;

export const AIRPORT_SCENARIOS = [
  {
    id: 'airport_forbidden_joke',
    title: 'The Forbidden Word',
    setup: `At security for your flight to {destination} {flag}, {child} spots the big sign that says 'Do not joke about bombs'… and immediately decides to test the law of irony.

The scanner beeps. A professional person with tired eyes says, very politely, 'Step aside, please.'`,
    base: { stressDelta: 5 },
    choices: [
      {
        id: 'A',
        emoji: '🧘',
        text: 'Stay calm. Quick coaching: "We never joke about safety—ever."',
        deltas: { discipline: 1, empathy: 1, intelligence: 0, confidence: 0 },
        stressDelta: -1,
        resultLine: 'You keep your voice low and your message clear.'
      },
      {
        id: 'B',
        emoji: '🙇',
        text: 'Own it. Apologize sincerely and redirect: "They\'re a kid. We\'re sorry. That was not okay."',
        deltas: { empathy: 2, intelligence: 0, discipline: 0, confidence: 0 },
        loveDelta: 1,
        resultLine: 'You de‑escalate fast.'
      },
      {
        id: 'C',
        emoji: '🧊',
        text: 'Hard boundary: "We are DONE. Consequences when we land."',
        deltas: { discipline: 2, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -1,
        resultLine: 'They learn that "airport jokes" are not a genre.'
      },
      {
        id: 'D',
        emoji: '👮',
        text: 'Let the staff explain why it\'s serious. You back them up.',
        deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
        resultLine: 'A stranger helps teach a life rule.'
      }
    ]
  },

  {
    id: 'airport_delay',
    title: 'Delay Spiral',
    setup: `Your flight to {destination} {flag} is delayed. The gate area becomes a tiny democracy with no laws.

{child} has discovered the joy of sprinting in a zig‑zag pattern.`,
    base: { stressDelta: 2 },
    choices: [
      {
        id: 'A',
        emoji: '🎲',
        text: 'Make it a game: "Every time you pass that pole, you have to walk like a penguin."',
        deltas: { confidence: 1, empathy: 1, intelligence: 0, discipline: 0 },
        stressDelta: -1,
        resultLine: 'You turn chaos into structure with humor.'
      },
      {
        id: 'B',
        emoji: '📱',
        text: 'Screen-time truce. Download something and breathe.',
        deltas: { intelligence: 1, discipline: -1, empathy: 0, confidence: 0 },
        stressDelta: -1,
        resultLine: 'Peace treaty achieved.'
      },
      {
        id: 'C',
        emoji: '🏃',
        text: 'Airport "energy circuit"—walk laps together.',
        deltas: { confidence: 2, intelligence: 0, empathy: 0, discipline: 0 },
        resultLine: 'You burn off the wiggles productively.'
      },
      {
        id: 'D',
        emoji: '🔥',
        text: 'Snap. Loud whisper. Everyone hears the whisper.',
        deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        resultLine: 'It works, but at a cost.'
      }
    ]
  },

  {
    id: 'airport_gate_change',
    title: 'Gate Change Olympics',
    setup: `A gate change hits and the airport app updates like it's trying to win an award.

You're suddenly speed-walking to Gate 97B like you trained for this.`,
    base: { stressDelta: 2 },
    choices: [
      {
        id: 'A',
        emoji: '🧭',
        text: 'Give {child} the mission: "You lead. Find the gate number."',
        deltas: { confidence: 2, discipline: 1, intelligence: 0, empathy: 0 },
        resultLine: 'They take the mission VERY seriously.'
      },
      {
        id: 'B',
        emoji: '🧸',
        text: 'Carry them + bags. Hero mode.',
        deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: 1,
        stressDelta: 1,
        resultLine: 'You\'re exhausted but they feel safe.'
      },
      {
        id: 'C',
        emoji: '🧊',
        text: 'Cold efficiency: "No talking. We move."',
        deltas: { discipline: 2, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -1,
        resultLine: 'It works but feels mechanical.'
      },
      {
        id: 'D',
        emoji: '😅',
        text: 'Laugh it off. "Okay, team—operation: not missing the plane."',
        deltas: { confidence: 1, empathy: 1, intelligence: 0, discipline: 0 },
        stressDelta: -1,
        resultLine: 'You frame stress as adventure.'
      }
    ]
  },

  {
    id: 'airport_liquids',
    title: 'The Water Bottle Tragedy',
    setup: `Security spots the water bottle you forgot existed until this exact moment.

{child} watches it get tossed like it's a movie villain origin story.`,
    base: { stressDelta: 1 },
    choices: [
      {
        id: 'A',
        emoji: '🧠',
        text: 'Explain the rule and validate the feeling.',
        deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
        resultLine: 'They understand without feeling dismissed.'
      },
      {
        id: 'B',
        emoji: '💸',
        text: 'Buy overpriced water + snack peace treaty.',
        moneyDelta: -80,
        loveDelta: 1,
        stressDelta: -1,
        deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
        resultLine: 'Money solves the immediate crisis.'
      },
      {
        id: 'C',
        emoji: '🪨',
        text: 'Let them be mad. "You can be upset. Rules are rules."',
        deltas: { confidence: 1, discipline: 1, intelligence: 0, empathy: 0 },
        loveDelta: -1,
        resultLine: 'You hold the boundary through the feelings.'
      },
      {
        id: 'D',
        emoji: '🧊',
        text: 'Blame them for "distracting you" (it lands badly).',
        deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        resultLine: 'They shrink a little.'
      }
    ]
  },

  {
    id: 'airport_duty_free',
    title: 'Duty-Free Negotiations',
    setup: `Duty-free has a glittery object that costs the same as a small appliance.

{child} says, "But it's basically a memory you can hold."`,
    base: { stressDelta: 1 },
    choices: [
      {
        id: 'A',
        emoji: '🧾',
        text: 'Budget lesson: "We can pick one small thing."',
        moneyDelta: -250,
        deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: 1,
        resultLine: 'You teach limits with flexibility.'
      },
      {
        id: 'B',
        emoji: '🚫',
        text: 'No. Boundary. Simple sentence.',
        deltas: { discipline: 2, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -1,
        resultLine: 'Clear but cold.'
      },
      {
        id: 'C',
        emoji: '🥂',
        text: 'Fine. Treat yourself… and them.',
        moneyDelta: -800,
        loveDelta: 2,
        deltas: { confidence: 1, discipline: -1, intelligence: 0, empathy: 0 },
        resultLine: 'Sometimes you just say yes.'
      },
      {
        id: 'D',
        emoji: '🎁',
        text: 'Promise it as a "trip milestone reward" if behavior stays good.',
        deltas: { discipline: 1, confidence: 1, intelligence: 0, empathy: 0 },
        stressDelta: -1,
        resultLine: 'You delay gratification with clarity.'
      }
    ]
  },

  {
    id: 'airport_seat_split',
    title: 'The Seat Shuffle',
    setup: `You check the boarding passes and realize you're not seated together.

{child} says, "I'll just sit with a stranger and tell them my life story."`,
    base: { stressDelta: 2 },
    choices: [
      {
        id: 'A',
        emoji: '🙏',
        text: 'Politely ask someone to swap.',
        deltas: { confidence: 1, empathy: 1, intelligence: 0, discipline: 0 },
        stressDelta: -1,
        resultLine: 'Kindness from strangers saves the day.'
      },
      {
        id: 'B',
        emoji: '🧍',
        text: 'Teach independence: they sit alone (with a plan).',
        deltas: { confidence: 2, intelligence: 0, empathy: 0, discipline: 0 },
        loveDelta: -1,
        resultLine: 'They handle it, but miss you.'
      },
      {
        id: 'C',
        emoji: '💳',
        text: 'Pay to upgrade seats together.',
        moneyDelta: -1500,
        stressDelta: -1,
        loveDelta: 1,
        deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
        resultLine: 'Money buys peace of mind.'
      },
      {
        id: 'D',
        emoji: '😬',
        text: 'Panic and pressure the gate agent.',
        deltas: { discipline: 1, empathy: -1, intelligence: 0, confidence: 0 },
        stressDelta: 1,
        resultLine: 'It works but you feel terrible about it.'
      }
    ]
  },

  {
    id: 'airport_lost_plush',
    title: 'The Missing Stuffie',
    setup: `Right before boarding, the favorite stuffed animal is suddenly not in the universe.

{child} whispers, "We have to go back. We HAVE to."`,
    base: { stressDelta: 2 },
    choices: [
      {
        id: 'A',
        emoji: '🔎',
        text: 'Quick search party. Two minutes, then we board.',
        deltas: { discipline: 1, confidence: 1, intelligence: 0, empathy: 0 },
        stressDelta: 1,
        resultLine: 'You balance urgency with their need.'
      },
      {
        id: 'B',
        emoji: '🛍️',
        text: 'Replacement mission at the airport shop.',
        moneyDelta: -220,
        loveDelta: 1,
        stressDelta: -1,
        deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
        resultLine: 'Crisis averted with capitalism.'
      },
      {
        id: 'C',
        emoji: '🕯️',
        text: 'Resilience ritual: "We\'ll remember them and keep going."',
        deltas: { empathy: 1, confidence: 1, intelligence: 0, discipline: 0 },
        loveDelta: 1,
        resultLine: 'You turn loss into a growth moment.'
      },
      {
        id: 'D',
        emoji: '🧊',
        text: 'Toughen-up speech (too harsh for the moment).',
        deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -2,
        resultLine: 'They comply but feel alone.'
      }
    ]
  },

  {
    id: 'airport_snack_trade',
    title: 'The Snack Exchange Program',
    setup: `{child} tries to trade snacks with another kid like it's an international treaty.

You realize you're about to become "that parent" in someone else's story.`,
    base: { stressDelta: 1 },
    choices: [
      {
        id: 'A',
        emoji: '🤝',
        text: 'Coach consent/boundaries: ask first, trade fairly.',
        deltas: { empathy: 2, discipline: 1, intelligence: 0, confidence: 0 },
        resultLine: 'You model social skills in real time.'
      },
      {
        id: 'B',
        emoji: '🚫',
        text: 'Stop it immediately. "No trading food."',
        deltas: { discipline: 2, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -1,
        resultLine: 'Safety first, feelings second.'
      },
      {
        id: 'C',
        emoji: '😅',
        text: 'Let it happen but supervise closely.',
        deltas: { empathy: 1, intelligence: 0, discipline: 0, confidence: 0 },
        stressDelta: 1,
        resultLine: 'You monitor but don\'t micromanage.'
      },
      {
        id: 'D',
        emoji: '🎭',
        text: 'Turn it into a "market" game: "One snack = one story."',
        deltas: { confidence: 1, empathy: 1, intelligence: 0, discipline: 0 },
        stressDelta: -1,
        resultLine: 'You add structure through play.'
      }
    ]
  },

  {
    id: 'airport_moving_walkway',
    title: 'The Moving Walkway Temptation',
    setup: `{child} sees the moving walkway and immediately treats it like a treadmill challenge.

There's a luggage pileup risk that feels… very real.`,
    base: { stressDelta: 1 },
    choices: [
      {
        id: 'A',
        emoji: '🧠',
        text: 'Rules + reason: "Walk normally or we step off."',
        deltas: { discipline: 1, intelligence: 1, empathy: 0, confidence: 0 },
        resultLine: 'You set the expectation clearly.'
      },
      {
        id: 'B',
        emoji: '🏃',
        text: 'Burn energy: "Fast walk beside me. Race me—without bumping anyone."',
        deltas: { confidence: 2, intelligence: 0, empathy: 0, discipline: 0 },
        resultLine: 'You redirect the energy productively.'
      },
      {
        id: 'C',
        emoji: '🧎',
        text: 'Get down to eye level and do a calm reset.',
        deltas: { empathy: 1, intelligence: 0, discipline: 0, confidence: 0 },
        loveDelta: 1,
        stressDelta: -1,
        resultLine: 'You pause and reconnect.'
      },
      {
        id: 'D',
        emoji: '🔥',
        text: 'Yank-and-scold (everyone stares).',
        deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -2,
        stressDelta: 1,
        resultLine: 'Effective but embarrassing for both of you.'
      }
    ]
  },

  {
    id: 'airport_customs_form',
    title: 'Customs Form Comedy',
    setup: `At the kiosk/form, {child} tries to answer for you.

You look down and see they've written something like "PURPOSE OF VISIT: VIBES."`,
    base: { stressDelta: 1 },
    choices: [
      {
        id: 'A',
        emoji: '😂',
        text: 'Laugh, fix it, and explain what it actually means.',
        deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
        stressDelta: -1,
        resultLine: 'You turn a mistake into a teaching moment.'
      },
      {
        id: 'B',
        emoji: '🧊',
        text: 'Stern correction: "This is not a joke zone."',
        deltas: { discipline: 2, intelligence: 0, empathy: 0, confidence: 0 },
        loveDelta: -1,
        resultLine: 'The mood goes cold fast.'
      },
      {
        id: 'C',
        emoji: '📝',
        text: 'Make it a teaching moment: "You can help if you take it seriously."',
        deltas: { discipline: 1, confidence: 1, intelligence: 0, empathy: 0 },
        resultLine: 'You set expectations and give responsibility.'
      },
      {
        id: 'D',
        emoji: '🙈',
        text: 'You take over completely and shut them out.',
        deltas: { discipline: 1, empathy: -1, intelligence: 0, confidence: 0 },
        loveDelta: -1,
        resultLine: 'They feel sidelined and frustrated.'
      }
    ]
  }
];

/**
 * Helper: Generate a seeded float between 0 and 1
 */
function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function seededFloat01(seed) {
  const hash = hashString(seed);
  const rng = mulberry32(hash);
  return rng();
}

/**
 * Select an airport scenario for this international trip
 * @param {string} runSeed - Game run seed
 * @param {number} currentYear - Current age
 * @param {string} destinationCode - Destination airport code
 * @returns {object|null} - Selected airport scenario or null
 */
export function selectAirportScenario(runSeed, currentYear, destinationCode) {
  const seed = `airportRoll|${runSeed}|${currentYear}|${destinationCode}`;
  const roll = seededFloat01(seed);

  if (roll < AIRPORT_BOMB_JOKE_PROB) {
    // 5% chance: Forbidden Joke scenario
    return AIRPORT_SCENARIOS.find(s => s.id === 'airport_forbidden_joke');
  } else if (roll < AIRPORT_EVENT_TOTAL_PROB) {
    // Additional 28% chance: Pick from other 9 scenarios
    const otherScenarios = AIRPORT_SCENARIOS.filter(s => s.id !== 'airport_forbidden_joke');
    const pickSeed = `${seed}|pick`;
    const pickRoll = seededFloat01(pickSeed);
    const index = Math.floor(pickRoll * otherScenarios.length);
    return otherScenarios[index];
  }

  // 67% chance: No airport scenario
  return null;
}

/**
 * Replace placeholders in scenario text
 */
export function formatAirportScenarioText(text, childName, destinationName, flagEmoji) {
  return text
    .replace(/\{child\}/g, childName)
    .replace(/\{destination\}/g, destinationName)
    .replace(/\{flag\}/g, flagEmoji);
}