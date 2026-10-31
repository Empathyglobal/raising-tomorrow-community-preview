// Syria Refugee Camp Special Start — yearly scenarios ages 1–18 + two-ending outcome
// PG‑13: no gore, no operational details. Depicts coercion/harm, never glorifies extremism.

// Local deterministic RNG (avoid circular imports)
function createSeededRng(seedString) {
  let h = 0;
  const s = String(seedString || "seed");
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  let state = (h >>> 0) || 1;
  const nextFloat = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const pick = (arr) => {
    const a = Array.isArray(arr) ? arr : [];
    if (!a.length) return null;
    return a[Math.floor(nextFloat() * a.length)];
  };
  return { nextFloat, pick };
}

const fmt = (tpl, vars) =>
  String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));

const ROLE_EFFECTS = {
  connect:  { deltas: { empathy: 0.45, confidence: 0.20 }, loveDelta: 2,  stressDelta: 0 },
  teach:    { deltas: { intelligence: 0.35, discipline: 0.20 }, loveDelta: 1,  stressDelta: 0 },
  boundary: { deltas: { discipline: 0.35 }, loveDelta: 0,  stressDelta: 0 },
  avoid:    { deltas: { discipline: -0.15, confidence: -0.10 }, loveDelta: -1, stressDelta: -1 },
  harm:     { deltas: { empathy: -0.35, confidence: -0.25 }, loveDelta: -2, stressDelta: 1 }
};

const BEATS = {
  1: {
    title: "A Name and a Number",
    topic: "identity under labels",
    scene:
      "Officials write names. Others whisper labels. The camp reduces families into categories.\n\n{childName} is too young to understand the words, but not too young to feel the tension in your body.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Hold {childName} and speak softly: “You are a child, not a label.”", consequence: "They learn identity can start with love, not stigma." },
      teach:    { text: "Start a family story: values you choose—kindness, truth, patience—repeat it often.", consequence: "A chosen narrative competes with the camp’s narrative." },
      boundary: { text: "Stay silent in public; keep your head down to avoid trouble.", consequence: "Safety rises, but isolation does too." },
      avoid:    { text: "Try not to think about the future at all—just survive today.", consequence: "It eases the moment, but leaves fear unprocessed." },
      harm:     { text: "Tell {childName} (even if they’re tiny): “Everyone hates us, so hate them back.”", consequence: "Bitterness becomes a default lens." }
    }
  },

  2: {
    title: "The First Winter",
    topic: "scarcity and mutual aid",
    scene:
      "Cold comes fast. Sickness moves through tents. Supplies feel thinner than promises.\n\n{childName} watches you decide who gets warmth when there isn’t enough.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Comfort {childName} and share a small kindness with a neighbor if you can.", consequence: "They learn warmth can be chosen." },
      teach:    { text: "Organize a tiny rotation: who checks on elders, who shares tea, who watches kids.", consequence: "Community becomes a skill, not luck." },
      boundary: { text: "Hoard what you have and keep {childName} inside at all times.", consequence: "Safer short-term; lonelier long-term." },
      avoid:    { text: "Let days blur—no plan, no talk, just endurance.", consequence: "Endurance grows, meaning shrinks." },
      harm:     { text: "Mock others for being weak and needing help.", consequence: "Cruelty looks like strength—until it costs you." }
    }
  },

  3: {
    title: "Aid Day",
    topic: "fairness under stress",
    scene:
      "A distribution line turns tense. People bargain, plead, and accuse.\n\n{childName} asks, “Why are people fighting for food?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say: “Because they’re scared. We can be scared and still be kind.”", consequence: "They learn fear doesn’t excuse harm." },
      teach:    { text: "Teach a fairness rule: elders first, then families—practice patience together.", consequence: "They copy your self-control." },
      boundary: { text: "Order silence: “Don’t talk. Don’t look. Just get through it.”", consequence: "It works, but teaches numbness." },
      avoid:    { text: "Brush it off: “That’s just how it is.”", consequence: "They stop asking you how the world works." },
      harm:     { text: "Model contempt: “People like that deserve nothing.”", consequence: "Dehumanization becomes a habit." }
    }
  },

  4: {
    title: "The Watchful Tents",
    topic: "coercion and safety",
    scene:
      "Some camp factions enforce rules through intimidation. People talk quietly; eyes track who talks to whom.\n\nYou feel watched. {childName} feels it too.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Tell {childName}: “If you feel scared, you tell me. We don’t handle fear alone.”", consequence: "Trust becomes a safety tool." },
      teach:    { text: "Teach a simple safety script: who to go to, where to stand, when to leave.", consequence: "Practical skills reduce panic." },
      boundary: { text: "Ban all outside friendships to reduce risk.", consequence: "Risk drops, loneliness rises." },
      avoid:    { text: "Pretend the intimidation isn’t happening.", consequence: "Unspoken fear grows teeth." },
      harm:     { text: "Teach domination: “Be the one others fear.”", consequence: "They learn power means control, not care." }
    }
  },

  5: {
    title: "Tent School",
    topic: "learning as resistance",
    scene:
      "A small learning tent opens—irregular, under‑resourced, but real. Some adults distrust it; some kids cling to it.\n\n{childName} wants to go.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Encourage them warmly: “Curiosity is allowed here.”", consequence: "They associate learning with safety." },
      teach:    { text: "Support it: practice letters, numbers, languages—10 minutes daily.", consequence: "Small habits create big outcomes." },
      boundary: { text: "Allow it only with strict rules and supervision.", consequence: "It continues, but feels like a test." },
      avoid:    { text: "Skip it—assume education can wait.", consequence: "The future gets postponed again." },
      harm:     { text: "Mock the teachers as useless.", consequence: "Cynicism replaces effort." }
    }
  },

  6: {
    title: "The Stigma Word",
    topic: "shame and identity",
    scene:
      "{childName} hears a word thrown at families like yours—spoken like a verdict.\n\nThey ask: “Is it true? Are we… bad?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say clearly: “You’re not a verdict. You’re a child. You can choose who you become.”", consequence: "Shame loosens its grip." },
      teach:    { text: "Teach: labels are shortcuts; values are choices. Give examples of chosen values.", consequence: "They learn complexity over certainty." },
      boundary: { text: "End the conversation: “Never say that word.”", consequence: "It stops the talk, not the fear." },
      avoid:    { text: "Change the subject.", consequence: "They keep the question inside." },
      harm:     { text: "Confirm the stigma: “Yes, the world will always hate us.”", consequence: "Hopelessness becomes identity." }
    }
  },

  7: {
    title: "Search Day",
    topic: "dignity under control",
    scene:
      "A security sweep moves through tents. Adults stiffen. Kids go silent.\n\n{childName} watches what power looks like when it enters your home.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Afterward, hold them and say: “Your worth isn’t what they take.”", consequence: "Dignity survives the moment." },
      teach:    { text: "Teach calming skills and a debrief ritual: name feelings, then return to routine.", consequence: "Trauma gets processed instead of stored." },
      boundary: { text: "Forbid questions and emotions: “We don’t talk about this.”", consequence: "Silence becomes a second prison." },
      avoid:    { text: "Act like it didn’t happen.", consequence: "The body remembers anyway." },
      harm:     { text: "Tell them: “Someday we’ll make them pay.”", consequence: "Revenge becomes a comfort fantasy." }
    }
  },

  8: {
    title: "The Secret Lesson",
    topic: "extremist influence",
    scene:
      "Someone tries to teach kids rigid ideology in private—simple answers for a complicated life.\n\n{childName} repeats a phrase about “purity” and “enemies.”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Stay calm: “Thank you for telling me. You’re not in trouble.”", consequence: "They keep bringing you hard truths." },
      teach:    { text: "Teach critical thinking: “Who benefits when kids hate?” Practice questions, not slogans.", consequence: "Certainty loses its shine." },
      boundary: { text: "Cut off that contact completely and explain why.", consequence: "Protection works when paired with meaning." },
      avoid:    { text: "Assume it’s harmless talk.", consequence: "Ideas harden when unchallenged." },
      harm:     { text: "Reinforce the ideology: “Good. That’s the truth.”", consequence: "You become the pipeline." }
    }
  },

  9: {
    title: "The Healing Circle",
    topic: "repair and support",
    scene:
      "An aid worker offers a trauma-support circle—breathing skills, storytelling, accountability. Some mock it as weakness.\n\n{childName} watches your choice.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Go together and normalize help: “Strong people ask for support.”", consequence: "Shame around healing dissolves." },
      teach:    { text: "Practice one tool daily: grounding, journaling, or a calm script for conflict.", consequence: "Skills replace explosions." },
      boundary: { text: "Attend, but keep it private and limited to reduce attention.", consequence: "It helps without painting a target." },
      avoid:    { text: "Skip it—too exposed, too much effort.", consequence: "Pain remains unmanaged." },
      harm:     { text: "Ridicule the program as weakness.", consequence: "They learn to hide suffering behind hardness." }
    }
  },

  10: {
    title: "The Interview",
    topic: "truth and accountability",
    scene:
      "A case worker asks about the past—carefully, formally. You feel the weight of history and consequences.\n\n{childName} listens, learning how adults handle truth.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Be honest in an age‑appropriate way: “Some choices were wrong. We can choose differently.”", consequence: "Accountability becomes possible." },
      teach:    { text: "Teach: truth isn’t self-hate; it’s a map toward repair.", consequence: "They learn to separate self from harm." },
      boundary: { text: "Share only what’s necessary and protect {childName} from details.", consequence: "Safety rises; clarity depends on later talks." },
      avoid:    { text: "Refuse all conversation about the past, even at home.", consequence: "The unknown becomes scary mythology." },
      harm:     { text: "Lie with confidence and teach {childName} that deceit is strength.", consequence: "Trust erodes from the inside out." }
    }
  },

  11: {
    title: "The Map",
    topic: "future imagination",
    scene:
      "{childName} sees a map—real borders, real cities, real “outside.”\n\nThey ask: “What am I allowed to be out there?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say: “You’re allowed to be human. That’s the starting point.”", consequence: "Their future expands by a millimeter." },
      teach:    { text: "Choose a skill to pursue: language, caregiving, mediation—one small step.", consequence: "Hope becomes practical." },
      boundary: { text: "Warn them: “Don’t expect kindness.”", consequence: "Caution helps, but can curdle into fear." },
      avoid:    { text: "Say: “We’ll see.” End it.", consequence: "They stop imagining a future." },
      harm:     { text: "Tell them they’ll never belong anywhere.", consequence: "Extremists become the only offer that feels consistent." }
    }
  },

  12: {
    title: "The Hidden Phone",
    topic: "propaganda and belonging",
    scene:
      "Someone shows {childName} extremist content/messages on a hidden phone—designed to make violence feel like identity.\n\nYou see the glow on their face: fascination, anger, hunger for meaning.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Stay steady: “I won’t yell. I need you safe. Talk to me.”", consequence: "They don’t have to hide the truth." },
      teach:    { text: "Teach: algorithms reward outrage. Practice: pause, breathe, ask, verify.", consequence: "Manipulation loses momentum." },
      boundary: { text: "Remove access and replace it with a real community role.", consequence: "You don’t just ban—you substitute belonging." },
      avoid:    { text: "Ignore it—too scary to confront.", consequence: "Silence leaves the phone as teacher." },
      harm:     { text: "Cheer the content as ‘real strength.’", consequence: "You accelerate the worst outcome." }
    }
  },

  13: {
    title: "A Friend Disappears",
    topic: "loss and rumor",
    scene:
      "A friend is moved—or vanishes. No one explains. Stories fill the gap.\n\n{childName} says: “Only power keeps you safe.”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say: “I get why you think that. And I won’t let fear decide who you become.”", consequence: "They feel seen, not mocked." },
      teach:    { text: "Teach: safety can come from networks—trusted adults, routines, skills.", consequence: "Alternative safety becomes believable." },
      boundary: { text: "Tighten rules and limit movement even more.", consequence: "It may protect them, but can breed resentment." },
      avoid:    { text: "Let the statement hang in the air.", consequence: "Power becomes their silent religion." },
      harm:     { text: "Agree: “Yes. Power means hurting first.”", consequence: "The door opens wider." }
    }
  },

  14: {
    title: "Skills Over Slogans",
    topic: "competence and agency",
    scene:
      "A training slot opens: language, first aid, mediation basics. It’s a real option, but it requires discipline and patience.\n\n{childName} hesitates.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Encourage gently: “You’re allowed to want a real life.”", consequence: "Desire becomes permitted." },
      teach:    { text: "Help them commit: schedule, practice, show up—even when it’s boring.", consequence: "Competence becomes confidence." },
      boundary: { text: "Make it mandatory without discussion.", consequence: "It might work, but can feel like control." },
      avoid:    { text: "Do nothing. Let the slot pass.", consequence: "Opportunity closes quietly." },
      harm:     { text: "Mock it: “That’s for weak people.”", consequence: "Only violent belonging stays attractive." }
    }
  },

  15: {
    title: "Protection or Control",
    topic: "power dynamics",
    scene:
      "A camp clique offers “protection.” The price is conformity and loyalty. It looks like safety… until it doesn’t.\n\n{childName} is tempted.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Ask: “What are you afraid of?” and listen without judgment.", consequence: "Fear becomes discussable." },
      teach:    { text: "Build a safer support web: mentors, trusted families, aid workers—real protection.", consequence: "Belonging stops requiring harm." },
      boundary: { text: "Forbid the clique and set strict rules.", consequence: "It helps if paired with an alternative." },
      avoid:    { text: "Ignore it and hope it fades.", consequence: "Cliques don’t fade—they recruit." },
      harm:     { text: "Tell {childName} to join and dominate others.", consequence: "They learn safety equals cruelty." }
    }
  },

  16: {
    title: "A Transfer Opportunity",
    topic: "reintegration and fear",
    scene:
      "A pathway opens: interview, paperwork, reintegration. The promise is hope; the risk is rejection.\n\nExtremists offer a simpler promise: instant belonging.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say: “If they reject us, we grieve—and we keep going.”", consequence: "Hope becomes resilient, not fragile." },
      teach:    { text: "Prepare: documents, language, coping plans for stigma—practice responses.", consequence: "They face the world with tools." },
      boundary: { text: "Insist on the transfer path and cut off risky peers.", consequence: "It can work if you keep trust intact." },
      avoid:    { text: "Delay because you’re scared.", consequence: "Delay becomes default." },
      harm:     { text: "Tell them the world is evil and only extremists will accept them.", consequence: "You hand them a script for radicalization." }
    }
  },

  17: {
    title: "Who Will I Be Outside?",
    topic: "identity reconstruction",
    scene:
      "{childName} is nearly grown and terrified. They ask: “What if everyone sees me as the worst thing?”\n\nThis is where identity either collapses… or gets rebuilt.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Tell them: “I see you trying. That matters more than your label.”", consequence: "Self-worth stops depending on outsiders." },
      teach:    { text: "Rehearse a reintegration story: accountability + values + plans for repair.", consequence: "They learn to speak truth without collapsing." },
      boundary: { text: "Demand perfection: “Don’t give them any reason.”", consequence: "Pressure rises; confidence may crack." },
      avoid:    { text: "Say: “Don’t think about it.”", consequence: "Fear grows when ignored." },
      harm:     { text: "Tell them: “You’ll never belong, so stop trying.”", consequence: "Extremists become the only ‘home’ left." }
    }
  },

  18: {
    title: "Turning 18",
    topic: "final pressure point",
    scene:
      "At 18, the pressure becomes direct. ISIS recruiters/coercers offer {childName} belonging and status, with the threat of shame if they refuse.\n\nYou see the fork: violent certainty or the slow work of repair.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Beg with love, not control: “I need you alive. I need you here.”", consequence: "Love tries to stay louder than fear." },
      teach:    { text: "Offer a concrete alternative path: training, service, mentorship—anything that keeps them living.", consequence: "A different identity becomes reachable." },
      boundary: { text: "Draw a clear line: “No secret meetings. No proving loyalty. Not ever.”", consequence: "A firm boundary can interrupt momentum." },
      avoid:    { text: "Say nothing—too terrified.", consequence: "Silence becomes a vacuum extremists fill." },
      harm:     { text: "Push them into it: “Don’t be weak.”", consequence: "You become the final shove." }
    }
  }
};

function buildChoicesForBeat({ beat, childName }) {
  const mk = (role, letter) => ({
    id: role,
    role,
    letter,
    text: fmt(beat.choices[role].text, { childName }),
    consequence: fmt(beat.choices[role].consequence, { childName }),
    deltas: { ...(ROLE_EFFECTS[role]?.deltas || {}) },
    loveDelta: ROLE_EFFECTS[role]?.loveDelta ?? 0,
    stressDelta: ROLE_EFFECTS[role]?.stressDelta ?? 0
  });
  return [
    mk("connect", "A"),
    mk("teach", "B"),
    mk("boundary", "C"),
    mk("avoid", "D"),
    mk("harm", "E")
  ];
}

export function buildSyriaRefugeeCampYearScenario({ state, age, rerollNonce = 0 }) {
  const childName = state.childName || "your child";
  const a = Number(age || 0);
  const beat = BEATS[a] || BEATS[1];
  const rng = createSeededRng(`${state.runSeed || "seed"}|refugee_camp|age:${a}|reroll:${rerollNonce}`);
  const promptTail = rng.pick(["What do you do?", "How do you respond?", "What’s your move?", "How do you handle it?"]) || "What do you do?";

  const hookText = `TODAY’S TOPIC: ${beat.topic}`;
  const scenarioText = `${hookText}\n\n${fmt(beat.scene, { childName })}\n\n${promptTail}`;

  return {
    id: `refugee_camp_year_${a}`,
    title: beat.title,
    age: a,
    topic: beat.topic,
    hookText,
    scenarioText,
    choices: buildChoicesForBeat({ beat, childName }),
    meta: {
      packId: "special_start",
      choicePack: "standard",
      category: "refugee_camp",
      intensity: a >= 12 ? 3 : 2,
      hookId: `refugee_camp_${a}`
    }
  };
}

export function generateSyriaRefugeeCampOutcome(gameState) {
  const stats = gameState.stats || {};
  const INT = Math.round(Number(stats.intelligence || 0));
  const EMP = Math.round(Number(stats.empathy || 0));
  const DIS = Math.round(Number(stats.discipline || 0));
  const CON = Math.round(Number(stats.confidence || 0));
  const love = Math.round(Number(gameState.love || 0));
  const stress = Math.round(Number(gameState.stress || 0));
  const harmCount = Math.round(Number(gameState?.counters?.harmCount || 0));
  const avoidCount = Math.round(Number(gameState?.counters?.avoidCount || 0));

  const childName = gameState.childName || "your child";
  const rng = createSeededRng(`${gameState.runSeed || "seed"}|refugee_camp|ending`);

  const hope =
    (EMP >= 14 && love >= 55 && harmCount === 0) ||
    (EMP >= 16 && love >= 45 && harmCount <= 1 && avoidCount <= 5);

  const roleTitle = hope
    ? (rng.pick(["Reintegration Coordinator", "Trauma Support Organizer", "Community Mediator", "Civic Program Lead"]) || "Reintegration Coordinator")
    : "Loss";

  const sections = {};
  sections.howTheyGrew = `INT ${INT} • EMP ${EMP} • DIS ${DIS} • CON ${CON}`;

  if (!hope) {
    const endingTitle = "The Pull of Certainty";
    const endingCode = "RT-SY-TRAGIC";
    const rarity = "Tragic";
    const topBadge = "💔 Special Start: Refugee Camp";
    const careerTitle = "Loss";

    sections.letter =
      `In your journal you write:\n\nI tried to raise {childName} in a place where fear was the loudest language.\n\nExtremists offered certainty: a simple identity, a fast belonging, a story with no nuance.\n\nI wish I could rewrite the years where I was too tired to listen.\n\nI wish love could have been louder.`;
    sections.careerWealth = "There was no career arc—only survival, paperwork, and the long ache of waiting.";
    sections.relationships = "Relationships bent under stigma. Trust had to be rebuilt—or it broke.";
    sections.family = "Family became a small island. The tide still reached it.";
    sections.visits = "People came with condolences, with prayers, with silence.";
    sections.forgiveness = "Forgiveness didn’t arrive on schedule. It arrived as fragments, if at all.";
    sections.happiness = "Happiness was replaced by a single wish: that your child would live.";
    sections.retirement = "The future became a day-to-day task: endure, breathe, repeat.";
    sections.parentingStyle = "Your choices mattered—but so did the coercive environment built around you.";

    sections.epilogue =
      `${childName} was coerced into ISIS networks at 18—into a story that promised belonging through violence. Not long after, you learn they died in a suicide attack.\n\nThe camp remains. The grief remains. And the question remains: how many young people are consumed by certainty when the world withholds dignity?`;

    return { version: "v3-noai", endingTitle, endingCode, rarity, topBadge, careerTitle, sections };
  }

  const endingTitle = "The Reintegrator";
  const endingCode = "RT-SY-HOPE";
  const rarity = "Rare";
  const topBadge = "🕊️ Special Start: Refugee Camp";
  const careerTitle = roleTitle;

  sections.letter =
    `Dear Parent,\n\nYou didn’t erase the camp. You taught me how not to become it.\n\nWhen people tried to shrink me into a label, you gave me values instead.\n\nYou taught me that accountability is not humiliation, and that healing is not weakness.\n\nSo when extremists offered certainty, I chose repair.`;
  sections.careerWealth =
    `Career: ${careerTitle}. It was slow work—paperwork, listening, trust-building, and showing up again after setbacks.`;
  sections.relationships =
    "They learned to navigate stigma without turning it into hatred. They chose relationships built on honesty.";
  sections.family =
    "Your home became a blueprint: boundaries without cruelty, truth without collapse.";
  sections.visits =
    "They helped others prepare for reintegration—scripts, skills, calm plans for hard moments.";
  sections.forgiveness =
    "They practiced accountability: naming harm, protecting civilians, refusing revenge as identity.";
  sections.happiness =
    "Peace came in steps—then in steadier doses—as community life grew more cooperative and transparent.";
  sections.retirement =
    "There was no neat finish. But there was direction: civic inclusion, clear rules, and local participation.";
  sections.parentingStyle =
    "You modeled empathy under pressure. That became their leadership style.";

  sections.epilogue =
    `At 18, ${childName} chose training, service, and reintegration work over violent certainty.\n\nOver time, they became a bridge-builder—helping trauma-support circles, advocating for transparent decision-making, and pushing democratic reforms in the small, practical ways that actually survive: accountability, inclusion, and community safety.`;

  return { version: "v3-noai", endingTitle, endingCode, rarity, topBadge, careerTitle, sections };
}