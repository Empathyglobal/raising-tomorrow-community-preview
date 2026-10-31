// Gaza War Zone Special Start — yearly scenarios ages 1–18 + two-ending outcome
// PG‑13: no gore, no operational details. Depicts coercion/harm, never glorifies violence.

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

// One beat per year, ages 1..18
const BEATS = {
  1: {
    title: "The Night the Lights Blinked",
    topic: "fear and safety",
    scene:
      "The electricity cuts mid‑lullaby. In the dark, {childName} grips your shirt like it’s a rope.\n\nOutside, the city goes quiet until it doesn’t. You can’t control the sky. You can control what {childName} learns about fear.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Hold {childName} close and name it gently: “That was scary. I’m here.”", consequence: "{childName} learns fear can be shared without shame." },
      teach:    { text: "Start a tiny calming routine: breathe, count, hum—repeat every blackout.", consequence: "A small ritual becomes a tool they can carry." },
      boundary: { text: "Keep bedtime firm: “We’re safe inside. We still sleep now.”", consequence: "Structure helps, but it feels cold if you skip comfort." },
      avoid:    { text: "Distract quickly—anything to stop the crying.", consequence: "It calms now, but the feeling stays unnamed." },
      harm:     { text: "Snap: “Stop it. You’re fine.”", consequence: "{childName} goes quiet, but not calm." }
    }
  },

  2: {
    title: "The Water Line",
    topic: "scarcity and fairness",
    scene:
      "You wait for water longer than you planned. People argue, then apologize, then argue again. {childName} watches every adult face.\n\nA small hand tugs yours: “Why are they pushing?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Kneel to eye level: “People are scared. We can still choose kindness.”", consequence: "{childName} notices you didn’t join the shouting." },
      teach:    { text: "Explain a simple rule: elders first, then families—help carry if you can.", consequence: "Fairness becomes something you practice, not preach." },
      boundary: { text: "Keep {childName} close and focused: “Stay beside me. Don’t wander.”", consequence: "Safety improves, but the lesson stays only “danger.”" },
      avoid:    { text: "Ignore the question and just get through the line.", consequence: "They learn the world is loud and adults don’t explain it." },
      harm:     { text: "Point and hiss: “Those people are animals.”", consequence: "Hate feels simple. It also sticks." }
    }
  },

  3: {
    title: "Play in a Narrow Safe Space",
    topic: "childhood under constraint",
    scene:
      "A tiny “safe enough” space opens—an alley corner, a courtyard moment, a patch of normal. {childName} wants to run.\n\nYour body wants to say no. Your heart wants to say yes.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Join the play for five minutes. Laugh where you can.", consequence: "{childName} remembers your face, not just the fear." },
      teach:    { text: "Make a safety game: “If I call, you freeze and come back.” Practice once.", consequence: "Freedom gets guardrails instead of walls." },
      boundary: { text: "Say no today and offer a quieter indoor game instead.", consequence: "It’s safer, but disappointment builds." },
      avoid:    { text: "Let them go without watching closely—too tired to manage it.", consequence: "Nothing happens today… but the risk isn’t a strategy." },
      harm:     { text: "Shame them for wanting to play: “What’s wrong with you?”", consequence: "Joy becomes something they hide." }
    }
  },

  4: {
    title: "School in Shifts",
    topic: "learning and hope",
    scene:
      "School reopens in shifts. The classroom is crowded. Supplies are improvised. The teacher tries anyway.\n\n{childName} asks, “Is school real if it keeps stopping?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Answer honestly and warmly: “It’s real because you are real.”", consequence: "{childName} feels worth investing in." },
      teach:    { text: "Build a tiny home lesson plan—10 minutes a day, consistent.", consequence: "Consistency becomes a quiet rebellion." },
      boundary: { text: "Push hard: “No excuses. You will keep up.”", consequence: "Output rises; connection strains." },
      avoid:    { text: "Assume learning can wait until life is calmer.", consequence: "The gap widens quietly." },
      harm:     { text: "Mock the school and the teacher: “It’s all pointless.”", consequence: "Cynicism becomes the curriculum." }
    }
  },

  5: {
    title: "The Broken Toy",
    topic: "repair and patience",
    scene:
      "A favorite toy breaks. There’s no replacement. {childName} stares at it like it’s a betrayal.\n\nThey ask, “Do we ever get new things?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Sit with the sadness: “It mattered. It’s okay to be upset.”", consequence: "They learn grief can be held, not denied." },
      teach:    { text: "Repair together with whatever you have. Praise effort, not perfection.", consequence: "They learn skill where others learn helplessness." },
      boundary: { text: "Say: “We don’t cry over objects.” End the conversation.", consequence: "Tears stop. Feelings don’t." },
      avoid:    { text: "Promise a replacement later even if you can’t be sure.", consequence: "Hope turns into distrust when it doesn’t come." },
      harm:     { text: "Call them spoiled for caring about it.", consequence: "They stop asking for comfort." }
    }
  },

  6: {
    title: "The Clinic Line",
    topic: "dignity and care",
    scene:
      "You spend half a day at a clinic. People look exhausted. Someone offers you a seat; someone else cuts the line.\n\n{childName} whispers, “Why is everyone angry?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Whisper back: “Because they’re hurting. We can still be gentle.”", consequence: "{childName} sees compassion as strength." },
      teach:    { text: "Give {childName} a helper role: hold water, offer a spot to an elder.", consequence: "Service becomes belonging." },
      boundary: { text: "Keep them silent and still: “No talking. Just wait.”", consequence: "It works, but it teaches numbness." },
      avoid:    { text: "Zone out and scroll/space out (if possible).", consequence: "You survive the day, but miss the moment to guide." },
      harm:     { text: "Model contempt: “They deserve it.”", consequence: "Cruelty gets normalized." }
    }
  },

  7: {
    title: "Rumor Heat",
    topic: "language and dehumanization",
    scene:
      "A rumor spreads after a tense incident. Adults speak in absolutes. {childName} repeats a cruel sentence they heard.\n\nYou hear it and your stomach drops.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Correct without shaming: “We don’t talk about people that way.”", consequence: "They learn boundaries on hatred." },
      teach:    { text: "Teach a rule: “Check before you repeat. Anger lies.” Practice rephrasing.", consequence: "Critical thinking interrupts the spiral." },
      boundary: { text: "Ban certain talk at home: “Not in this house.”", consequence: "Safer space, but they still need meaning." },
      avoid:    { text: "Let it pass—too tired to fight every phrase.", consequence: "The phrase becomes part of them." },
      harm:     { text: "Encourage it: “Good. Never forget.”", consequence: "Bitterness hardens into identity." }
    }
  },

  8: {
    title: "Electric Hour",
    topic: "media and meaning",
    scene:
      "Power returns briefly. Neighbors share charged phones and noisy clips. Some videos spark rage; some spark despair.\n\n{childName} wants to watch what the older kids watch.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Watch together and check in: “What did that make you feel?”", consequence: "Feelings get processed instead of swallowed." },
      teach:    { text: "Teach media literacy: “Someone chose what to show you. Ask why.”",
        consequence: "They learn to resist manipulation." },
      boundary: { text: "Set a hard rule: no violent clips, only family messages/learning.", consequence: "Protection helps—if you explain it." },
      avoid:    { text: "Let it happen. It’s one hour. You need the quiet.", consequence: "The internet becomes their teacher." },
      harm:     { text: "Feed the rage: “Yes—hate them. That’s the truth.”", consequence: "Anger becomes a shortcut to belonging." }
    }
  },

  9: {
    title: "Rooftop Question",
    topic: "identity and compassion",
    scene:
      "On a rooftop, the air is almost calm. {childName} asks quietly: “Are we hated? Are we… bad?”\n\nThe question is heavier than their age.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say: “You are not bad. You’re a child. You deserve safety.”", consequence: "Shame loosens its grip." },
      teach:    { text: "Explain simply: “Politics hurts people. Civilians are human everywhere.”", consequence: "Empathy becomes possible without erasing pain." },
      boundary: { text: "End the talk: “Don’t ask that. Focus on surviving.”", consequence: "They learn questions are unsafe." },
      avoid:    { text: "Change the subject to something practical.", consequence: "The fear stays, unspoken." },
      harm:     { text: "Answer with fatalism: “No one cares. That’s life.”", consequence: "Hopelessness becomes their baseline." }
    }
  },

  10: {
    title: "The First March",
    topic: "dignity without violence",
    scene:
      "{childName} wants to join older kids chanting in the street. The energy feels like belonging and danger at once.\n\nThey ask: “Can I go?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Talk first: “I get why you want to. What do you hope it changes?”", consequence: "They feel respected instead of controlled." },
      teach:    { text: "Teach nonviolent principles and safety: stay with a buddy, leave early, no escalation.", consequence: "They learn courage can be careful." },
      boundary: { text: "Say no, firmly, and offer a safer community task instead.", consequence: "They’re frustrated, but protected." },
      avoid:    { text: "Say yes without discussion—too exhausted to negotiate.", consequence: "Belonging grows… with unmanaged risk." },
      harm:     { text: "Encourage only vengeance language: “Show them fear.”", consequence: "They learn power equals harm." }
    }
  },

  11: {
    title: "The Teacher Leaves",
    topic: "mentors and continuity",
    scene:
      "A good teacher disappears—moved away, burned out, gone. {childName} acts like they don’t care, but their eyes do.\n\nThey say: “People always leave.”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Acknowledge it: “It hurts. I’m still here.”", consequence: "Attachment strengthens under stress." },
      teach:    { text: "Help {childName} write a thank‑you note and find a new mentor.", consequence: "Grief becomes connection, not collapse." },
      boundary: { text: "Push forward: “No time for feelings. Keep studying.”", consequence: "Productivity rises; isolation too." },
      avoid:    { text: "Let the sadness sit without talking about it.", consequence: "It leaks out later as anger." },
      harm:     { text: "Mock the teacher for leaving.", consequence: "Distrust becomes a habit." }
    }
  },

  12: {
    title: "Group Chat Fire",
    topic: "belonging and radical talk",
    scene:
      "Friends talk in absolutes—who’s “real,” who’s “weak,” who “deserves” pain. The words feel powerful in a powerless place.\n\n{childName} wants to fit in.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Make home a safe place to confess: “Tell me what they say. No punishment.”", consequence: "They bring you the truth instead of hiding it." },
      teach:    { text: "Teach a script: “I’m not into harming civilians.” Practice saying it calmly.", consequence: "They learn refusal without humiliation." },
      boundary: { text: "Set limits on who they spend time with—and explain why.", consequence: "Protection works better when it isn’t secrecy." },
      avoid:    { text: "Ignore it. Teen talk is teen talk.", consequence: "Sometimes it’s talk. Sometimes it’s a door." },
      harm:     { text: "Praise cruelty as strength.", consequence: "You become part of the pressure." }
    }
  },

  13: {
    title: "The Charismatic Invite",
    topic: "recruitment pressure",
    scene:
      "An older teen offers {childName} a “real purpose” and an inner circle. It’s framed as honor, not danger.\n\n{childName} doesn’t want to feel small anymore.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Ask what they’re craving: respect, safety, meaning—and listen.", consequence: "Need gets named before it gets exploited." },
      teach:    { text: "Teach warning signs: secrecy, us‑vs‑them language, pressure to prove loyalty.", consequence: "They learn to spot manipulation." },
      boundary: { text: "Forbid contact with that teen—clear and direct.", consequence: "It may work… or backfire if it becomes taboo." },
      avoid:    { text: "Assume it’s harmless and do nothing.", consequence: "The invitation grows in the dark." },
      harm:     { text: "Tell {childName} to prove themselves no matter what.", consequence: "Danger becomes validation." }
    }
  },

  14: {
    title: "The Humiliation Moment",
    topic: "anger and repair",
    scene:
      "A harsh encounter leaves {childName} humiliated. They come home shaking—then furious.\n\nThey say: “I want them to feel what I feel.”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Let them rage safely, then say: “I won’t let anger choose your future.”", consequence: "They feel held without being unleashed." },
      teach:    { text: "Teach a redirect: write it, run it out, help someone—turn heat into action.", consequence: "They learn anger can power repair." },
      boundary: { text: "Set a firm rule: no revenge talk, no threats—period.", consequence: "It’s safer, but they still need a path for the feeling." },
      avoid:    { text: "Say nothing. Pretend you didn’t hear it.", consequence: "The fantasy grows unchecked." },
      harm:     { text: "Encourage revenge as justice.", consequence: "Violence becomes the only language they trust." }
    }
  },

  15: {
    title: "Work or Study",
    topic: "options and sacrifice",
    scene:
      "Money is tight. {childName} can work more, or protect time for study. Both choices come with guilt.\n\nThey ask: “What’s the point of studying here?”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Share the burden: “I see how hard you’re trying. I’m proud of you.”", consequence: "Love becomes fuel instead of pressure." },
      teach:    { text: "Make a plan: part‑time work + a realistic study schedule + one mentor.", consequence: "Small structure creates real options." },
      boundary: { text: "Insist on one path (work or school) without discussion.", consequence: "Clarity helps, but resentment can grow." },
      avoid:    { text: "Let the year drift without a plan.", consequence: "Time passes; options shrink." },
      harm:     { text: "Call them ungrateful for asking.", consequence: "They stop sharing doubts with you." }
    }
  },

  16: {
    title: "A Program Opens",
    topic: "prosocial belonging",
    scene:
      "A youth program appears—first aid, peer mediation, community service. It’s small, fragile, and real.\n\nAt the same time, others promise faster “power.”\n\nWhat do you do?",
    choices: {
      connect:  { text: "Ask {childName} what kind of person they want to be—and believe them.", consequence: "Identity becomes a choice, not a drift." },
      teach:    { text: "Help them apply and prepare. Practice interviews, show up on time, keep promises.", consequence: "Competence competes with despair." },
      boundary: { text: "Ban the risky peer group entirely and monitor closely.", consequence: "Safety improves; trust depends on your tone." },
      avoid:    { text: "Stay passive: “Do what you want.”", consequence: "They’ll choose belonging somewhere—anywhere." },
      harm:     { text: "Push them toward the ‘power’ group to toughen them up.", consequence: "You hand them to the current." }
    }
  },

  17: {
    title: "The Scholarship vs. The Shortcut",
    topic: "future orientation",
    scene:
      "A fragile scholarship/placement is possible—but uncertain. Meanwhile, a militant network offers certainty: money, status, belonging.\n\n{childName} is tired of uncertainty.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say: “I can’t promise ease. I can promise I won’t abandon you.”", consequence: "Trust becomes a shelter." },
      teach:    { text: "Lay out consequences without threats: what violence destroys, what service builds.", consequence: "They see the long horizon again." },
      boundary: { text: "Make a hard rule: “If you join them, you can’t live here.”", consequence: "It may stop them—or push them away." },
      avoid:    { text: "Hope the decision makes itself.", consequence: "The loudest voice wins." },
      harm:     { text: "Frame violence as the only honorable path.", consequence: "A door closes behind them." }
    }
  },

  18: {
    title: "Turning 18",
    topic: "final pressure point",
    scene:
      "At 18, the pressure becomes direct. People offer {childName} a role in Hamas—framed as duty and honor, with little room to refuse.\n\nYou see the fork: the pull of violent belonging, or the fragile work of repair.\n\nWhat do you do?",
    choices: {
      connect:  { text: "Say the hard truth with love: “I won’t stop loving you. I will beg you not to do this.”", consequence: "Love tries to stay louder than fear." },
      teach:    { text: "Offer a concrete alternative: service role, mentor, aid work—any path that keeps them alive.", consequence: "A different identity becomes reachable." },
      boundary: { text: "Set a boundary and ask them to choose home over the group—today.", consequence: "It’s a line in the sand. Outcomes vary." },
      avoid:    { text: "Say nothing—too terrified to speak.", consequence: "Silence becomes permission." },
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

export function buildGazaWarZoneYearScenario({ state, age, rerollNonce = 0 }) {
  const childName = state.childName || "your child";
  const a = Number(age || 0);
  const beat = BEATS[a] || BEATS[1];
  const rng = createSeededRng(`${state.runSeed || "seed"}|war_zone|age:${a}|reroll:${rerollNonce}`);
  // Tiny deterministic variation to keep reroll meaningful without changing the plot
  const promptTail = rng.pick(["What do you do?", "How do you respond?", "What’s your move?", "How do you handle it?"]) || "What do you do?";

  const hookText = `TODAY’S TOPIC: ${beat.topic}`;
  const scenarioText = `${hookText}\n\n${fmt(beat.scene, { childName })}\n\n${promptTail}`;

  return {
    id: `war_zone_year_${a}`,
    title: beat.title,
    age: a,
    topic: beat.topic,
    hookText,
    scenarioText,
    choices: buildChoicesForBeat({ beat, childName }),
    meta: {
      packId: "special_start",
      choicePack: "standard",
      category: "war_zone",
      intensity: a >= 12 ? 3 : 2,
      hookId: `war_zone_${a}`
    }
  };
}

export function generateGazaWarZoneOutcome(gameState) {
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
  const rng = createSeededRng(`${gameState.runSeed || "seed"}|war_zone|ending`);

  // Hidden-ish threshold (players are not told)
  const hope =
    (EMP >= 14 && love >= 55 && harmCount === 0) ||
    (EMP >= 16 && love >= 45 && harmCount <= 1 && avoidCount <= 5);

  const roleTitle = hope
    ? (rng.pick(["Community Mediator", "Public Health Organizer", "Youth Civic Leader", "Reconstruction Coordinator"]) || "Community Mediator")
    : "—";

  const sections = {};

  // Always show growth line for compatibility
  sections.howTheyGrew = `INT ${INT} • EMP ${EMP} • DIS ${DIS} • CON ${CON}`;

  if (!hope) {
    // Tragic ending — explicit but PG‑13 and non-operational
    const endingTitle = "The Cycle Continues";
    const endingCode = "RT-GZ-TRAGIC";
    const rarity = "Tragic";
    const topBadge = "💔 Special Start: War Zone";
    const careerTitle = "Loss";

    sections.letter =
      `In your journal you write:\n\nI tried to raise a child inside a storm. Some years I was gentle. Some years I was tired. Some years I was wrong.\n\nAnd then the world offered a shortcut: belonging through violence.\n\nI would trade every argument, every mistake, every shortage—just to have {childName} back.`;
    sections.careerWealth = "There was no career arc—only survival, until survival failed.";
    sections.relationships = "Grief rearranged every relationship. Some people came closer; others disappeared into silence.";
    sections.family = "Family became a small circle of aching love and unanswered questions.";
    sections.visits = "People stopped by, whispered prayers, left food, and didn’t know what to say.";
    sections.forgiveness = "Forgiveness did not arrive all at once. It arrived in fragments—or not at all.";
    sections.happiness = "Happiness wasn’t the point. Keeping a child alive was. Losing them broke the math.";
    sections.retirement = "The future became a smaller thing: a day, then another day.";
    sections.parentingStyle = "Your choices mattered—but so did the forces outside your home.";

    sections.epilogue =
      `${childName} was pulled into Hamas at 18—into a story that promised honor and certainty. Not long after, you learn they died in a suicide attack.\n\nNothing feels solved. The pain spreads outward. You are left with the quiet question that never stops: what could have been different?`;

    return { version: "v3-noai", endingTitle, endingCode, rarity, topBadge, careerTitle, sections };
  }

  // Hope ending
  const endingTitle = "The Bridge Builder";
  const endingCode = "RT-GZ-HOPE";
  const rarity = "Rare";
  const topBadge = "🕊️ Special Start: War Zone";
  const careerTitle = roleTitle;

  sections.letter =
    `Dear Parent,\n\nYou didn’t give me a perfect childhood. You gave me something rarer: a way to stay human.\n\nYou taught me that dignity doesn’t require cruelty, and that anger can be turned into repair.\n\nWhen people tried to sell me certainty through violence, I remembered your voice.\n\nI chose to build.`;
  sections.careerWealth =
    `Career: ${careerTitle}. It wasn’t glamorous work. It was meetings, logistics, listening, and showing up again after setbacks.`;
  sections.relationships =
    "They learned to disagree without dehumanizing. They kept friends who chose service over status.";
  sections.family =
    "Your home became a model: hard truths spoken with warmth, boundaries held without humiliation.";
  sections.visits =
    "They traveled when possible—sometimes only across neighborhoods—building trust one conversation at a time.";
  sections.forgiveness =
    "They practiced accountability without hatred: naming harm, protecting civilians, and refusing revenge as identity.";
  sections.happiness =
    "Happiness came in small doses—then in steadier ones—as community life stabilized around cooperation.";
  sections.retirement =
    "There was no neat ending. But there was a direction: fewer lies, more participation, more safety for kids.";
  sections.parentingStyle =
    "You modeled empathy under pressure. That became their leadership style.";

  sections.epilogue =
    `At 18, ${childName} chose the slow work: aid coordination, peer mediation, and local civic projects that rewarded transparency instead of intimidation.\n\nOver time, they helped push democratic norms in their community—open meetings, shared decision-making, and accountability. The pain didn’t vanish. But it stopped being the only story.`;

  return { version: "v3-noai", endingTitle, endingCode, rarity, topBadge, careerTitle, sections };
}