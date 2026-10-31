import { PACK_YEARLY_CHECKINS } from '@/components/game/packYearlyCheckins';

// Tiny deterministic RNG (LCG)
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h; // Convert to 32bit integer
  }
  return Math.abs(h);
}

function createSeededRng(seed) {
  let state = simpleHash(seed) || 12345;
  return {
    nextFloat: () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    },
    pick: (arr) => {
      return arr[Math.floor(this.nextFloat() * arr.length)];
    }
  };
}

const AGE_LENS = {
  '1': "Age 1: They're learning to walk — your furniture is learning fear.",
  '2': "Age 2: They discovered the word \"NO\" and use it like a superpower.",
  '3': "Age 3: They negotiate like a tiny lawyer with crumbs on their face.",
  '4': "Age 4: The \"why\" questions have no off-switch.",
  '5': "Age 5: School begins — suddenly they have strong opinions about snacks.",
  '6': "Age 6: They lose something daily. You become the household lost-and-found.",
  '7': "Age 7: They learn secrets… and immediately tell them to everyone.",
  '8': "Age 8: Their interests get expensive in a very creative way.",
  '9': "Age 9: They understand fairness and will prosecute you over unequal cookies.",
  '10': "Age 10: Other kids' opinions start to matter — a lot.",
  '11': "Age 11: Preteen energy: big feelings, small patience, unexpected wisdom.",
  '12': "Age 12: Mood swings arrive with zero patch notes.",
  '13': "Age 13: Teen mode activates. Everything you say is \"a lecture.\"",
  '14': "Age 14: They want freedom… and also need you to find their charger.",
  '15': "Age 15: Boundaries get tested. Patience gets tested. Everyone gets tested.",
  '16': "Age 16: Future plans appear — and change every other week.",
  '17': "Age 17: Nearly adult: they want trust, independence, and the occasional ride.",
  '18': "Age 18: You blink and the tutorial ends."
};

const PROMPT_TAILS = [
  "Your child is watching how you handle this.",
  "This is the kind of year that leaves a mark — in good ways or bad.",
  "The situation is loud, but your values can be louder.",
  "Even small choices compound over time.",
  "You can't control everything — but you can control your response."
];

const CHOICE_EFFECTS = {
  connect: {
    deltas: { empathy: 0.45, confidence: 0.15 },
    loveDelta: 2,
    stressDelta: 0
  },
  teach: {
    deltas: { intelligence: 0.45, discipline: 0.15 },
    loveDelta: 1,
    stressDelta: 0
  },
  boundary: {
    deltas: { discipline: 0.5 },
    loveDelta: 0,
    stressDelta: 0
  },
  avoid: {
    deltas: { confidence: -0.15, empathy: -0.1 },
    loveDelta: -1,
    stressDelta: -1
  },
  harm: {
    deltas: { empathy: -0.35, discipline: -0.2, confidence: -0.15 },
    loveDelta: -2,
    stressDelta: 1
  }
};

export function buildSpotlightYearlyMomentReplacementScenario({ state, age, rerollNonce = 0 }) {
  const childName = state.childName || 'your child';
  const rng = createSeededRng(`${state.runSeed}|spotlightMoment|${state.specialStartId}|age:${age}|reroll:${rerollNonce}`);

  // Find the matching pack
  const pack = Object.values(PACK_YEARLY_CHECKINS).find(p => 
    p.specialStartIds && p.specialStartIds.includes(state.specialStartId) && 
    p.packId && p.packId.startsWith('ss_spotlight_')
  );

  const topicLabel = pack?.packName || 'spotlight';
  const fallbackBody = `Another year in the ${topicLabel} spotlight. The pressure finds new angles — and ${childName} keeps growing anyway.`;
  let baseBody = fallbackBody;
  let selectedTitle = `Year ${age} — ${topicLabel}`;

  // Find ageBand for this age (with crash protection)
  try {
    if (pack && pack.ageBands) {
      const band = pack.ageBands.find(b => b.minAge <= age && age <= b.maxAge);
      if (band) {
        selectedTitle = band.title || selectedTitle;

        // Pick variant if available
        if (band.variants && band.variants.length > 0) {
          const variant = band.variants[Math.floor(rng.nextFloat() * band.variants.length)];
          if (variant) {
            selectedTitle = variant.title || selectedTitle;
            
            // NO-CRASH GUARANTEE: wrap body function call
            try {
              if (typeof variant.body === 'function') {
                const result = variant.body(age, state);
                if (result && String(result).trim().length > 0) {
                  baseBody = result;
                }
              } else if (variant.body && String(variant.body).trim().length > 0) {
                baseBody = variant.body;
              }
            } catch (e) {
              // Body threw, use fallback
              baseBody = fallbackBody;
            }
          }
        }
      }
    }
  } catch (e) {
    // Pack lookup failed, use fallback
    baseBody = fallbackBody;
  }

  // Pick a prompt tail deterministically (includes rerollNonce in seed)
  const pickedPromptTail = PROMPT_TAILS[Math.floor(rng.nextFloat() * PROMPT_TAILS.length)];

  // DIFFERENT EACH YEAR: AGE_LENS must be in scenarioText
  const ageLens = AGE_LENS[String(age)] || '';
  const scenarioText = `${baseBody}\n\n${ageLens}\n\n${pickedPromptTail}\n\nWhat do you do?`;

  // Build 5 choices (A-E) with role IDs for ScenarioModal
  const choices = [
    {
      id: 'connect',
      role: 'connect',
      letter: 'A',
      emoji: '❤️',
      text: `Pause the ${topicLabel} chaos and connect with ${childName}.`,
      deltas: CHOICE_EFFECTS.connect.deltas,
      consequence: `${childName} feels prioritized — even when your life is loud.`,
      loveDelta: CHOICE_EFFECTS.connect.loveDelta,
      stressDelta: CHOICE_EFFECTS.connect.stressDelta
    },
    {
      id: 'teach',
      role: 'teach',
      letter: 'B',
      emoji: '🧠',
      text: `Teach ${childName} how you navigate the spotlight and its challenges.`,
      deltas: CHOICE_EFFECTS.teach.deltas,
      consequence: `They learn that success and struggle are both real.`,
      loveDelta: CHOICE_EFFECTS.teach.loveDelta,
      stressDelta: CHOICE_EFFECTS.teach.stressDelta
    },
    {
      id: 'boundary',
      role: 'boundary',
      letter: 'C',
      emoji: '🚪',
      text: `Set a firm boundary between ${topicLabel} life and family time.`,
      deltas: CHOICE_EFFECTS.boundary.deltas,
      consequence: `${childName} learns what matters and what doesn't.`,
      loveDelta: CHOICE_EFFECTS.boundary.loveDelta,
      stressDelta: CHOICE_EFFECTS.boundary.stressDelta
    },
    {
      id: 'avoid',
      role: 'avoid',
      letter: 'D',
      emoji: '⚠️',
      text: `Dismiss the concern and stay focused on your ${topicLabel} demands.`,
      deltas: CHOICE_EFFECTS.avoid.deltas,
      consequence: `${childName} learns they're secondary to your obligations.`,
      loveDelta: CHOICE_EFFECTS.avoid.loveDelta,
      stressDelta: CHOICE_EFFECTS.avoid.stressDelta
    },
    {
      id: 'harm',
      role: 'harm',
      letter: 'E',
      emoji: '💔',
      text: `Use the ${topicLabel} life to control or leverage ${childName}.`,
      deltas: CHOICE_EFFECTS.harm.deltas,
      consequence: `They internalize that your love is conditional on your success.`,
      loveDelta: CHOICE_EFFECTS.harm.loveDelta,
      stressDelta: CHOICE_EFFECTS.harm.stressDelta
    }
  ];

  // Build scenario object compatible with ScenarioModal
  const scenario = {
    id: `spotlight_${state.specialStartId}_year_${age}_r${rerollNonce}`,
    title: selectedTitle,
    age,
    topic: topicLabel,
    hookText: baseBody,
    scenarioText,
    choices,
    meta: {
      packId: 'special_start',
      choicePack: 'standard',
      isSpecialStartYearlyReplacement: true,
      specialStartId: state.specialStartId,
      age,
      rerollNonce
    }
  };

  return scenario;
}