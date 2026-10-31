// OUTCOMES ENGINE V3 - NO AI - Pure Template + Tag System
// 100% deterministic, never throws, always returns valid text

import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';
import { OUTCOME_TEXT_BANK } from './outcomeTextBank';
import { hasAnyBlackBelt, MARTIAL_STYLES, MARTIAL_BELTS } from './martialArtsData';
import { getPassionMeta } from './passionTracks';
import { loadMetaAchievements } from '@/components/utils/metaAchievements';
import { BADGE_TO_TROPHY, SPECIAL_ENDING_NARRATIVE_LOCKS } from './specialEndingNarrativeLocks';
import { computeEndingArchetype, computeEndingBeatLines, computeEndingCallbacks, computeSignatureFromStats } from './endingNarrativeEngine';

// ===== SECTION ORDER (Single Render, No Duplicates) =====
export const OUTCOME_SECTION_ORDER = [
  "letter",
  "careerWealth",
  "relationships",
  "family",
  "visits",
  "forgiveness",
  "happiness",
  "retirement",
  "parentingStyle",
  "epilogue",
  "ptaEpilogue",
  "howTheyGrew"
];

// ===== PET HELPERS (Multi-Pet Support) =====
function getLivingPets(state) {
  const pets = Array.isArray(state?.pets) ? state.pets : [];
  // Backward compat: if pets array is empty but state.pet exists, convert it
  if (pets.length === 0 && state?.pet) {
    return [state.pet].filter(Boolean);
  }
  // If the game removes pets on death, presence == alive. Keep a defensive filter anyway:
  return pets.filter(p => p && typeof p.id === 'string');
}

function hasAnyPet(state) {
  return getLivingPets(state).length > 0;
}

function getActivePet(state) {
  const pets = getLivingPets(state);
  const activeId = state?.activePetId;
  if (activeId) {
    const match = pets.find(p => p.id === activeId);
    if (match) return match;
  }
  return pets[0] || null;
}

// ===== SEEDED RNG =====
function createSeededRng(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash = hash & hash;
  }
  
  let state = Math.abs(hash) | 0;
  
  const nextFloat = () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
  
  const pick = (array) => {
    if (!array || array.length === 0) return null;
    return array[Math.floor(nextFloat() * array.length)];
  };
  
  const pickN = (array, n, unique = true) => {
    if (!array || array.length === 0) return [];
    if (n >= array.length) return [...array];
    
    if (unique) {
      const shuffled = [...array].sort(() => nextFloat() - 0.5);
      return shuffled.slice(0, n);
    } else {
      const result = [];
      for (let i = 0; i < n; i++) {
        result.push(pick(array));
      }
      return result;
    }
  };
  
  const chance = (p) => nextFloat() < p;
  
  const weightedPick = (weights) => {
    if (!weights || weights.length === 0) return 0;
    const total = weights.reduce((sum, w) => sum + w, 0);
    if (total === 0) return 0;
    
    let roll = nextFloat() * total;
    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return i;
    }
    return weights.length - 1;
  };
  
  return { nextFloat, pick, pickN, chance, weightedPick };
}

// ===== HELPER: Safe Number =====
function safeNumber(value, fallback = 0) {
  if (typeof value !== 'number' || !isFinite(value)) return fallback;
  return value;
}

// ===== HELPER: Get Faith Score =====
function getFaithScore(state) {
  const f = state?.faith || {};
  const exposure = Math.max(0, Math.min(100, Number(f.exposure || 0)));
  const devotion = Math.max(0, Math.min(100, Number(f.devotion || 0)));
  return Math.max(0, Math.min(100, 0.6 * exposure + 0.4 * devotion));
}

// ===== HELPER: Safe Text =====
function safeText(value, fallback = "") {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

// ===== HELPER: Safe Array =====
function safeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

// ===== HELPER: Coerce Number =====
function coerceNumber(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

// ===== HELPER: Normalize Parent Role =====
function normalizeParentRole(role) {
  const r = String(role || "").trim().toLowerCase();
  if (["dad", "father", "pop", "papa"].includes(r)) return "dad";
  if (["mom", "mother", "mum", "mama"].includes(r)) return "mom";
  return r || "parent";
}

// ===== HELPER: Pick From (RNG-safe) =====
function pickFrom(rng, arr) {
  const a = Array.isArray(arr) ? arr : [];
  if (a.length === 0) return "";
  if (rng && typeof rng.pick === "function") return rng.pick(a);
  const idx = Math.floor(Math.random() * a.length);
  return a[Math.max(0, Math.min(a.length - 1, idx))];
}

// ===== HELPER: Love Band From Love =====
function loveBandFromLove(love) {
  if (love >= 45) return "close";
  if (love >= 20) return "warm";
  if (love >= 5) return "mixed";
  if (love >= -15) return "distant";
  return "fractured";
}

// ===== BUILD FALLBACK LETTER AND TRUTH =====
function buildFallbackLetterAndTruth(facts, rng) {
  const love = coerceNumber(facts?.loveLevel, 0);
  const band = loveBandFromLove(love);

  const role = normalizeParentRole(facts?.parentRole);
  const address =
    role === "dad" ? "Dad" :
    role === "mom" ? "Mom" :
    "Parent";

  const childName =
    facts?.childName ||
    facts?.kidName ||
    facts?.childFirstName ||
    "";

  const signoff =
    childName && String(childName).trim()
      ? `— ${String(childName).trim()}`
      : "— Your adult child";

  const openers = {
    close: [
      `Hey ${address},`,
      `${address},`,
      `Hi ${address},`
    ],
    warm: [
      `Hey ${address},`,
      `${address}, I've been thinking about you.`,
      `Hi ${address},`
    ],
    mixed: [
      `${address},`,
      `Hey ${address}, I'm writing because I don't want to carry this unspoken forever.`,
      `Hi ${address}, this might come out imperfect, but it's real.`
    ],
    distant: [
      `${address},`,
      `Hey ${address}. I'm keeping this simple.`,
      `${address}, I don't know if you expected to hear from me like this.`
    ],
    fractured: [
      `${address},`,
      `This is hard to write, ${address}.`,
      `${address}, I need to name what happened.`
    ],
  };

  const middles = {
    close: [
      `A lot of the good in me is traceable to you. Not in a "movie montage" way—more like the quiet stuff: how you showed up, how you tried again after a bad day, how you made "ordinary" feel safe.`,
      `When I think about growing up, I remember the feeling more than the facts. And the feeling was: I mattered. That doesn't happen by accident.`,
      `I don't say this enough: thank you. For the ways you protected the house from chaos, and for the times you apologized when you missed.`,
    ],
    warm: [
      `We weren't perfect—none of us were—but I can see the effort now. Some days it landed softly, some days it didn't. Still, the pattern I remember most is you trying.`,
      `I carry both things: gratitude for the warmth you gave, and the wish that some moments had gone differently. Both can be true without cancelling each other out.`,
      `You taught me things you probably didn't realize you were teaching: how to keep going, how to repair, how to be steady when emotions are loud.`,
    ],
    mixed: [
      `Our relationship feels like a box of photos where some are sharp and some are blurred. I remember love, and I also remember distance. I remember wanting you closer, and not knowing how to ask.`,
      `I'm not writing to win an argument from the past. I'm writing to tell the truth: what happened shaped me. And I'm still untangling which parts I want to keep and which parts I'm ready to put down.`,
      `If we ever rebuild, I want it to be on something honest. Not "everything was fine," not "everything was awful." Just honest.`,
    ],
    distant: [
      `We got through it, but "getting through it" isn't the same as feeling held. I learned independence early. Some of that is strength. Some of it is scar tissue.`,
      `I don't need you to agree with every memory. I just need you to know that the impact was real, even when the intentions were complicated.`,
      `I'm open to a better version of us. But it has to be built with consistency, not speeches.`,
    ],
    fractured: [
      `There are things I'm still angry about. Not because I enjoy anger—because it was the only emotion that made me feel protected when I felt small.`,
      `I needed you in ways I didn't get. I adapted. I survived. I became functional. But it cost something.`,
      `If you want to be in my life as an adult, it starts with accountability. Not punishment—accountability.`,
    ],
  };

  const closers = {
    close: [
      `I love you. I'm proud to be your kid. If you ever wonder whether you made a difference: you did.`,
      `I'm here. I'm not going anywhere. Call me when you're free—no agenda, just us.`,
      `Anyway. That's the letter. I hope you feel it in your chest the way I mean it.`,
    ],
    warm: [
      `I hope we keep choosing each other. Even in small ways. Even when it's awkward.`,
      `I'm not asking for perfection. I'm asking for us to keep showing up.`,
      `If we talk about this, I want it gentle. I want it real.`,
    ],
    mixed: [
      `I don't know exactly what comes next. But I know I don't want silence to be the thing that wins.`,
      `If you're willing, we can try again—slowly. With fewer assumptions. With more listening.`,
      `That's all. I'm putting this down now, instead of carrying it.`,
    ],
    distant: [
      `I'm not writing for drama. I'm writing for clarity. If we're going to have a relationship, it needs to be healthier than what we used to do.`,
      `Take this as an opening, not a conclusion.`,
      `I'm leaving the door unlocked, but I'm not chasing anyone through it.`,
    ],
    fractured: [
      `I'm protecting my peace now. If you want closeness, it comes with change.`,
      `I hope you can hear this without making it about being "the bad guy." It's about repair.`,
      `I'm done minimizing what it felt like. I'm ready for something different—or distance.`,
    ],
  };

  const tinyTruths = [
    `repair is a verb, not a vibe.`,
    `what we repeat becomes what we believe.`,
    `love is real, but so is impact.`,
    `closeness grows where honesty lives.`,
    `boundaries are how respect becomes visible.`,
  ];

  const body =
    `${pickFrom(rng, openers[band])}\n\n` +
    `${pickFrom(rng, middles[band])}\n\n` +
    `${pickFrom(rng, closers[band])}\n\n` +
    `${signoff}`;

  const tinyTruth = pickFrom(rng, tinyTruths);

  return { body, tinyTruth };
}

// ===== BUILD FALLBACK LETTER SECTION =====
function buildFallbackLetterSection(facts, rng, reason = "fallback") {
  const love = coerceNumber(facts?.loveLevel, 0);
  const parentRole = normalizeParentRole(facts?.parentRole);
  const fb = buildFallbackLetterAndTruth(
    { ...facts, loveLevel: love, parentRole },
    rng
  );

  return {
    type: "letter",
    id: "letter",
    key: "letter",
    title: "A Letter From Your Adult Child",
    loveLevel: love,
    parentRole,
    // Provide multiple keys so existing UI finds it no matter what it expects:
    text: fb.body,
    body: fb.body,
    letterText: fb.body,
    letter: fb.body,
    tinyTruth: fb.tinyTruth,
    _generatedBy: reason,
  };
}

// ===== READ LETTER TEXT (Handles Different Shapes) =====
function readLetterText(section) {
  if (!section) return "";
  return (
    section.text ||
    section.body ||
    section.letterText ||
    section.letter ||
    ""
  );
}

// ===== ENSURE LETTER SECTION (Always Valid) =====
function ensureLetterSection(sections, facts, rng) {
  const fb = buildFallbackLetterSection(facts, rng, "ensure-letter");

  if (!sections) return { letter: fb };

  // If sections are an array of blocks
  if (Array.isArray(sections)) {
    const idx = sections.findIndex(
      (s) =>
        s?.type === "letter" ||
        s?.id === "letter" ||
        s?.key === "letter" ||
        s?.title === "A Letter From Your Adult Child"
    );

    if (idx === -1) return [...sections, fb];

    const existing = sections[idx];
    const txt = readLetterText(existing);

    if (!txt || String(txt).includes("A letter couldn't be generated")) {
      const merged = {
        ...existing,
        ...fb,
        type: existing.type || "letter",
        id: existing.id || "letter",
        key: existing.key || "letter",
      };
      const copy = sections.slice();
      copy[idx] = merged;
      return copy;
    }

    return sections;
  }

  // If sections are an object with keys (e.g., { letter: {...}, ... })
  if (typeof sections === "object") {
    const existing = sections.letter;
    const txt = readLetterText(existing);

    if (!existing || !txt || String(txt).includes("A letter couldn't be generated")) {
      return { ...sections, letter: { ...existing, ...fb } };
    }

    return sections;
  }

  // Unknown shape: return object that at least has a letter
  return { letter: fb };
}

// ===== HELPER: Pick Top Signals =====
function pickTopSignals(facts, tags) {
  const signals = [];
  
  // Stress signals
  if (facts.stats.stress >= 10) signals.push("High stress");
  else if (facts.stats.stress <= 3) signals.push("Low stress");
  
  // Love signals
  if (facts.stats.love <= 2) signals.push("Low love");
  else if (facts.stats.love >= 9) signals.push("High love");
  
  // Confidence signals
  if (facts.stats.confidence <= 3) signals.push("Confidence dipped");
  else if (facts.stats.confidence >= 12) signals.push("Confidence soared");
  
  // Money signals
  if (facts.debt > 0) signals.push("Money tight");
  else if (facts.money >= 50000) signals.push("Money stable");
  
  // Pattern signals
  if (tags.has('HARSH_NONE') && facts.counters.harmCount === 0) {
    signals.push("No harmful choices");
  }
  
  // Return top 2-4
  return signals.slice(0, 4);
}

// ===== SECTION FALLBACK GENERATOR =====
function generateSectionFallback(sectionId, facts, tags, vars, rng) {
  // Generate basic content based on facts when templates fail
  const signals = pickTopSignals(facts, tags);
  
  const fallbacks = {
    letter: {
      headline: "A Letter From Your Adult Child",
      bullets: signals,
      paragraph: safeText(
        generateFallbackLetter(facts, tags, vars, rng),
        "A letter from your adult child. The relationship was shaped by what happened."
      ),
      tinyTruth: "Tiny truth: sometimes the absence of words says more than words could."
    },
    
    careerWealth: {
      headline: "Career & Wealth",
      bullets: [
        `Career: ${facts.stats.intelligence >= 10 ? 'Knowledge work' : 'Hands-on work'}`,
        `Wealth: ${determineWealthTier(facts)}`,
        ...signals.slice(0, 1)
      ],
      paragraph: "They found work that fits who they are—imperfect, real, and theirs. Income came from skills practiced over time.",
      tinyTruth: "Tiny truth: stability beats sparkle most days."
    },
    
    relationships: {
      headline: "Relationships",
      bullets: signals.slice(0, 2),
      paragraph: "They learned relationships are a skill, not a prize—and they keep practicing. Some connections landed; some taught what not to do again.",
      tinyTruth: "Tiny truth: attachment style is learned, then re-learned."
    },
    
    family: {
      headline: "Family",
      bullets: [
        `Kids: ${facts.stats.empathy >= 10 && facts.stats.love >= 8 ? '2-4' : facts.stats.love >= 5 ? '1-2' : '0-1'}`,
        `Vibe: ${facts.stats.stress > 10 ? 'Intense' : facts.stats.love >= 8 ? 'Warm' : 'Mixed'}`
      ],
      paragraph: "Their family life took a path that made sense for them. Some moments felt heavy; some felt light; most felt real.",
      tinyTruth: null
    },
    
    visits: {
      headline: "Visits",
      bullets: signals.slice(0, 2),
      paragraph: safeText(
        generateFallbackVisits(facts, tags, rng),
        "Your connection changed over time—sometimes close, sometimes complicated."
      ),
      tinyTruth: facts.stats.love >= 9 ? "Tiny truth: they text you first when good news happens." : null
    },
    
    forgiveness: {
      headline: "Forgiveness & Repair",
      bullets: signals.slice(0, 2),
      paragraph: safeText(
        generateFallbackForgiveness(facts, tags, rng),
        "Forgiveness was messy, not instant. Repair mattered more than perfection."
      ),
      tinyTruth: facts.stats.love >= 9 ? "Tiny truth: they remember the apologies more than the arguments." : null
    },
    
    happiness: {
      headline: "Happiness",
      bullets: signals,
      paragraph: "They're still becoming themselves, like everyone. Some years are light; some are heavy. They've learned coping tools—some from you, some from life.",
      tinyTruth: "Tiny truth: happiness isn't a trophy. It's a practice."
    },
    
    retirement: {
      headline: "Retirement",
      bullets: [
        `Savings: $${facts.retirement.toLocaleString()}`,
        `Tier: ${determineRetirementTier(facts)}`
      ],
      paragraph: facts.retirement >= 20000 
        ? "You saved well—emergencies are manageable." 
        : facts.retirement > 0 
          ? "You saved what you could—it's lean but real."
          : "Savings are sparse. Support networks matter more.",
      tinyTruth: facts.stats.love >= 8 ? "Tiny truth: they help when they can." : null
    },
    
    parentingStyle: {
      headline: "Parenting Style",
      bullets: signals.slice(0, 3),
      paragraph: "Your style had patterns—some helpful, some costly—and the story reflects that. Repair mattered more than perfection.",
      tinyTruth: null
    },
    
    epilogue: {
      headline: "Looking Back",
      bullets: signals,
      paragraph: "Time passed. Patterns emerged. Some were inherited; some were built; some were broken on purpose.",
      tinyTruth: "Tiny truth: nobody becomes perfect. Becoming real is the win."
    },
    
    howTheyGrew: {
      headline: "Growth",
      bullets: [
        `Intelligence: ${facts.stats.intelligence.toFixed(1)}`,
        `Empathy: ${facts.stats.empathy.toFixed(1)}`,
        `Discipline: ${facts.stats.discipline.toFixed(1)}`,
        `Confidence: ${facts.stats.confidence.toFixed(1)}`
      ],
      paragraph: "They grew in the margins: small wins, quiet shifts, and a few big moments that surprised everyone.",
      tinyTruth: "Tiny truth: growth happened when nobody was performing."
    }
  };
  
  return fallbacks[sectionId] || {
    headline: sectionId,
    bullets: signals,
    paragraph: "This chapter is still forming.",
    tinyTruth: null
  };
}

// ===== FALLBACK: Adult Child Letter =====
function generateFallbackLetter(facts, tags, vars, rng) {
  const love = safeNumber(facts.stats.love, 0);
  const stress = safeNumber(facts.stats.stress, 0);
  const confidence = safeNumber(facts.stats.confidence, 0);
  const empathy = safeNumber(facts.stats.empathy, 0);
  const discipline = safeNumber(facts.stats.discipline, 0);
  const intelligence = safeNumber(facts.stats.intelligence, 0);
  
  const paragraphs = [];
  
  // Greeting
  const salutation = vars.SALUTATION || "Dear Parent,";
  paragraphs.push(salutation);
  paragraphs.push("");
  
  // Paragraph 1: Emotional climate
  if (love <= 2 || stress >= 10) {
    paragraphs.push("It was hard. I needed distance to feel okay, and that hasn't fully changed. Stress shaped the emotional weather in our home.");
  } else if (love >= 8 && stress <= 4) {
    paragraphs.push("I felt loved more often than not, and that gave me a base to stand on. You weren't perfect, but you showed up.");
  } else {
    paragraphs.push("We weren't perfect. We were real. Some things still sting, and some things still help.");
  }
  
  // Paragraph 2: Strength + cost
  let strength = "connection";
  let cost = "boundaries";
  
  if (empathy >= discipline && empathy >= intelligence) {
    strength = "empathy";
    cost = discipline <= 2 ? "structure" : "limits";
  } else if (intelligence >= empathy && intelligence >= discipline) {
    strength = "problem-solving";
    cost = empathy <= 2 ? "emotional awareness" : "patience";
  } else {
    strength = "consistency";
    cost = confidence <= 2 ? "my confidence" : "flexibility";
  }
  
  paragraphs.push(`You taught me ${strength}, even when it was messy. The cost was ${cost}—I had to learn that part later.`);
  
  // Paragraph 3: Adult reflection + boundary/gratitude
  if (love <= 3) {
    paragraphs.push("I'm doing fine on my own now. I've built a life that doesn't require closeness to work.");
  } else if (love >= 8) {
    paragraphs.push("I'm grateful for how you showed up. I still call you when things go sideways.");
  } else {
    paragraphs.push("I've learned to appreciate what worked and set boundaries around what didn't. Repair is still possible.");
  }
  
  paragraphs.push("");
  
  // Sign-off
  const signOff = love >= 9 ? "Love," : love >= 6 ? "With care," : love >= 3 ? "—" : "Respectfully,";
  if (signOff) paragraphs.push(signOff);
  paragraphs.push(facts.childName);
  
  return paragraphs.join("\n");
}

// ===== FALLBACK: Forgiveness & Repair =====
function generateFallbackForgiveness(facts, tags, rng) {
  const love = safeNumber(facts.stats.love, 0);
  const empathy = safeNumber(facts.stats.empathy, 0);
  const stress = safeNumber(facts.stats.stress, 0);
  const harmCount = safeNumber(facts.counters.harmCount, 0);
  
  let paragraph = "";
  
  // Determine tone
  if (love <= 3 || stress >= 10 || harmCount >= 2) {
    paragraph = "Repair was possible in small moments, but it didn't always land. Distance became a way to protect themselves. ";
  } else if (love >= 8 && empathy >= 8) {
    paragraph = "Repair happened more often than not. They learned adults can mess up and still be safe. ";
  } else {
    paragraph = "Forgiveness was messy, not instant. Some moments landed; some didn't. ";
  }
  
  // Add actionable adult line
  if (tags.has('COUNSELOR_USED') || tags.has('STUDY_HEAVY')) {
    paragraph += "They learned to apologize, ask for repair, and try again—because you modeled it.";
  } else if (empathy >= 6) {
    paragraph += "They learned to talk about hard things, even when it's uncomfortable.";
  } else if (harmCount === 0) {
    paragraph += "They learned repair is a skill worth practicing.";
  } else {
    paragraph += "They learned to take space when they needed it.";
  }
  
  return safeText(paragraph, "Repair mattered more than perfection.");
}

// ===== FALLBACK: Visits =====
function generateFallbackVisits(facts, tags, rng) {
  const love = safeNumber(facts.stats.love, 0);
  
  if (love <= 2) {
    return "They don't really visit. Time passes. Messages are brief, if they come at all.";
  } else if (love <= 5) {
    return "Visits are rare—mostly obligation, mostly holidays, mostly short. Distance feels safer.";
  } else if (love <= 8) {
    return "They visit sometimes. Not constantly, but enough to remind you you're still in their life.";
  } else {
    return "They visit regularly. You're part of their routine, even as life gets busy.";
  }
}

// ===== HELPER: Clamp =====
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ===== SPECIAL ENDING NARRATIVE LOCKS =====
function applySpecialEndingNarrativeLocks({ gameState, facts, tags, topBadge, legendaryTrophyId, sections }) {
  try {
    if (!sections || typeof sections !== 'object') return sections;

    const trophyId = legendaryTrophyId || BADGE_TO_TROPHY[topBadge] || null;
    if (!trophyId) return sections;

    const lock = SPECIAL_ENDING_NARRATIVE_LOCKS[trophyId];
    if (!lock) return sections;

    // Preserve debug metadata if present
    const preservedDebug = sections.__debug ? { ...sections.__debug } : null;

    const rerolls = gameState?.outcomeRerolls || {};

    // Build formatting vars deterministically (no throws)
    const varsRng = createSeededRng(`${facts.runId}|specialLocks|${trophyId}|vars`);
    const vars = buildOutcomeVars(facts, tags, varsRng);

    const pickTpl = (sectionKey, list, suffix = "p") => {
      const arr = Array.isArray(list) ? list : [];
      if (arr.length === 0) return "";
      const r = Number(rerolls?.[sectionKey] || 0);
      const rng = createSeededRng(`${facts.runId}|specialLocks|${trophyId}|${sectionKey}|${suffix}|${r}`);
      return rng.pick(arr) || arr[0];
    };

    const buildLockedSection = (sectionKey, spec) => {
      if (!spec) return;
      const paragraphTpl = pickTpl(sectionKey, spec.paragraphs, "paragraph");
      const tinyTpl = pickTpl(sectionKey, spec.tinyTruths || [], "tiny");
      const bulletsTpl = Array.isArray(spec.bullets) ? spec.bullets : [];

      sections[sectionKey] = {
        headline: spec.headline || (sections?.[sectionKey]?.headline) || sectionKey,
        bullets: bulletsTpl.map(b => format(b, vars)).filter(Boolean),
        paragraph: format(paragraphTpl, vars),
        tinyTruth: tinyTpl ? format(tinyTpl, vars) : null
      };
    };

    // HARD LOCK THESE SECTIONS
    buildLockedSection("careerWealth", lock.careerWealth);
    buildLockedSection("letter", lock.letter);
    buildLockedSection("epilogue", lock.epilogue);
    buildLockedSection("howTheyGrew", lock.howTheyGrew);

    // Restore debug metadata + add lock marker
    sections.__debug = preservedDebug || {};
    sections.__debug.specialEndingLocked = trophyId;

    return sections;
  } catch (e) {
    console.error("[SpecialEndingLocks] failed (non-fatal):", e);
    return sections;
  }
}

// ===== COMPUTE FORGIVENESS (Deterministic, Non-Shaming) =====
function computeForgiveness(facts, tags, rng) {
  const love = safeNumber(facts.stats.love, 0);
  const emp = safeNumber(facts.stats.empathy, 0);
  const harshE = facts.counters.harmCount || 0;
  
  // Count repair signals
  let repairSignals = 0;
  if (tags.has('COUNSELOR_USED')) repairSignals++;
  if (tags.has('HEALING_SELF_SOME') || tags.has('HEALING_PARTNER_SOME')) repairSignals++;
  if (tags.has('STUDY_SOME') || tags.has('STUDY_HEAVY') || tags.has('STUDY_DEEP')) repairSignals++;
  
  // Build forgiveness index (0-1)
  const forgivenessIndex = clamp(
    0.45 * (love / 12) +
    0.25 * (emp / 12) +
    0.15 * (repairSignals > 0 ? 1 : 0) -
    0.20 * clamp(harshE / 3, 0, 1),
    0, 1
  );
  
  // Determine years to forgive
  let years = null;
  if (forgivenessIndex >= 0.80) {
    years = Math.floor(rng.nextFloat() * 3); // 0-2
  } else if (forgivenessIndex >= 0.60) {
    years = 2 + Math.floor(rng.nextFloat() * 5); // 2-6
  } else if (forgivenessIndex >= 0.40) {
    years = 5 + Math.floor(rng.nextFloat() * 8); // 5-12
  } else if (forgivenessIndex >= 0.25) {
    years = 10 + Math.floor(rng.nextFloat() * 11); // 10-20
  }
  
  // Apply repair modifiers
  if ((tags.has('COUNSELOR_USED') || tags.has('HEALING_SELF_SOME')) && years !== null) {
    const reduction = 1 + Math.floor(rng.nextFloat() * 3); // 1-3
    years = Math.max(0, years - reduction);
  }
  
  if (harshE >= 2 && years !== null) {
    const penalty = 2 + Math.floor(rng.nextFloat() * 4); // 2-5
    years = years + penalty;
  }
  
  if (love < 2 && harshE >= 2) {
    years = null;
  }
  
  // Convert to label
  let label = "";
  if (years === 0) {
    label = "Forgiveness came quickly.";
  } else if (years !== null && years <= 2) {
    label = "Forgiveness came within a couple years.";
  } else if (years !== null && years <= 6) {
    label = "Forgiveness took a few years.";
  } else if (years !== null && years <= 12) {
    label = "Forgiveness took a long time.";
  } else if (years !== null && years <= 20) {
    label = "Forgiveness took over a decade.";
  } else {
    label = "Forgiveness stayed complicated (and boundaries mattered).";
  }
  
  // Build why candidates
  const whyCandidates = [];
  if (tags.has('LOVE_HIGH')) whyCandidates.push("Love made it easier to come back to connection.");
  if (harshE > 0) whyCandidates.push("Some moments left bruises in trust—even when you didn't mean to.");
  if (tags.has('STRESS_HIGH')) whyCandidates.push("Stress shaped the emotional weather in the home.");
  if (tags.has('STUDY_SOME') || tags.has('STUDY_HEAVY') || tags.has('STUDY_DEEP')) {
    whyCandidates.push("You modeled learning instead of pretending you were done growing.");
  }
  if (tags.has('COUNSELOR_USED')) whyCandidates.push("Support gave the family language for repair.");
  if (tags.has('PHONE_LONG')) whyCandidates.push("Attention was a battleground sometimes.");
  
  const pickedWhy = rng.pickN(whyCandidates, Math.min(2, whyCandidates.length), false);
  const why = pickedWhy.join(" ");
  
  // Build helper candidates
  const helperCandidates = [
    "What helped most was consistent repair, not perfect behavior.",
    "What helped most was accountability without defensiveness.",
    "What helped most was making space for their feelings without arguing them.",
    "What helped most was boundaries that stayed respectful.",
    "What helped most was showing up after hard moments—again and again."
  ];
  const helper = rng.pick(helperCandidates);
  
  return { years, label, why, helper };
}

// ===== BUILD ACTION SUMMARY SAFE (Robust Counters) =====
export function buildActionSummarySafe(state) {
  const t = Array.isArray(state.timelineEntries) ? state.timelineEntries : [];
  
  const counts = {
    study: 0,
    tutoring: 0,
    harshChoiceE: 0,
    community: 0,
    musicYears: 0,
    sportsYears: 0,
    travelInternational: 0,
    therapyVisits: 0,
    doctorVisits: 0
  };
  
  const notable = {
    phoneYears: 0,
    hasPet: hasAnyPet(state),
    petTypes: getLivingPets(state).map(p => p.speciesKey || p.type || 'pet').filter(Boolean),
    martialArtsBlackBelt: false,
    scienceFairWonNational: state.education?.scienceFair?.wonNational === true,
    wonClassPresident: state.education?.studentLeadership?.wonClassPresident === true,
    wonListenFirst: state.education?.studentLeadership?.wonWithListenFirst === true
  };
  
  // Check martial arts black belt
  try {
    notable.martialArtsBlackBelt = hasAnyBlackBelt(state) === true;
  } catch (err) {
    console.error('Failed to check black belt:', err);
  }
  
  // Estimate phone years
  if (state.phoneOwned && state.phoneGivenAge !== null) {
    notable.phoneYears = Math.max(0, state.currentYear - state.phoneGivenAge);
  }
  
  // Parse timeline
  for (const e of t) {
    const title = (e?.title || "").toLowerCase();
    const kind = (e?.kind || "").toLowerCase();
    const meta = e?.meta || {};
    
    // Study
    if (kind === "study" || title.includes("study") || title.includes("learned")) {
      counts.study++;
    }
    
    // Tutoring
    if (kind === "tutor" || title.includes("tutor")) {
      counts.tutoring++;
    }
    
    // Harsh choice E
    if (meta.choiceLetter === "E" || meta.choiceRole === "harm" || kind === "harm") {
      counts.harshChoiceE++;
    }
    
    // Community (donation)
    if (title.includes("donate") || title.includes("blood") || title.includes("plasma")) {
      counts.community++;
    }
    
    // Music/voice programs
    if (title.includes("music") || title.includes("voice") || title.includes("piano")) {
      counts.musicYears++;
    }
    
    // Sports/martial arts
    if (title.includes("martial") || title.includes("taekwondo") || title.includes("karate") || title.includes("sport")) {
      counts.sportsYears++;
    }
    
    // International travel
    if (kind === "travel" || title.includes("travel") || meta.passport) {
      counts.travelInternational++;
    }
    
    // Therapy/counselor
    if (title.includes("counselor") || title.includes("therapy")) {
      counts.therapyVisits++;
    }
    
    // Doctor
    if (title.includes("doctor") || title.includes("checkup") || title.includes("pediatrician")) {
      counts.doctorVisits++;
    }
  }
  
  return { counts, notable };
}

// ===== BUILD ACTION SUMMARY (Action Echoes) =====
function buildActionSummary(facts) {
  const timeline = facts.timeline.entries || [];
  
  const counts = {
    study: 0,
    studyByModule: {},
    tutoring: 0,
    bond: 0,
    play: 0,
    travel: 0,
    doctor: 0,
    counselor: 0,
    donation: 0,
    faith: 0,
    mindBody: 0,
    shopping: 0,
    routine: 0,
    retirementContrib: 0,
    businessAttempt: 0,
    harshChoiceE: 0
  };
  
  const notable = {
    favoriteStudyModule: null,
    favoriteDestination: null,
    faithTradition: null,
    activitySignature: null,
    biggestPurchase: null,
    petType: null,
    petName: null,
    phoneYears: 0,
    debtYears: 0,
    martialArtsStyle: null,
    martialArtsBelt: null
  };
  
  const rememberedLines = [];
  
  // Parse timeline
  timeline.forEach(entry => {
    const title = (entry.title || "").toLowerCase();
    const detail = (entry.detail || "").toLowerCase();
    const kind = entry.kind || "";
    const meta = entry.meta || {};

    // Always remember major/memory beats (keeps endings specific)
    const kindNorm = String(kind || "").toLowerCase();
    if (["major", "memory", "milestone", "system"].includes(kindNorm)) {
      const dRaw = String(entry.detail || "").replace(/\s+/g, " ").trim();
      const dShort = dRaw ? (dRaw.length > 70 ? dRaw.slice(0, 70).trimEnd() + "…" : dRaw) : "";
      rememberedLines.push(`Age ${entry.age}: ${entry.title}${dShort ? " — " + dShort : ""}`);
    }

    // Study
    if (kind === 'study' || title.includes('study') || title.includes('learned')) {
      counts.study++;
      if (meta.module) {
        counts.studyByModule[meta.module] = (counts.studyByModule[meta.module] || 0) + 1;
      } else if (title.includes('positive parenting')) {
        counts.studyByModule['PositiveParenting'] = (counts.studyByModule['PositiveParenting'] || 0) + 1;
      } else if (title.includes('nvc')) {
        counts.studyByModule['NVC'] = (counts.studyByModule['NVC'] || 0) + 1;
      } else if (title.includes('empathy')) {
        counts.studyByModule['EmpathyKids'] = (counts.studyByModule['EmpathyKids'] || 0) + 1;
      }
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Tutoring
    if (title.includes('tutor')) {
      counts.tutoring++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Bond
    if (kind === 'bond' || title.includes('bond')) {
      counts.bond++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Play
    if (kind === 'play' || title.includes('play')) {
      counts.play++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Travel
    if (kind === 'travel' || title.includes('travel') || meta.passport) {
      counts.travel++;
      if (meta.destination && !notable.favoriteDestination) {
        notable.favoriteDestination = meta.destination;
      }
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Doctor
    if (title.includes('doctor') || title.includes('checkup') || title.includes('pediatrician')) {
      counts.doctor++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Counselor
    if (title.includes('counselor') || title.includes('therapy') || title.includes('therapist')) {
      counts.counselor++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Donation
    if (title.includes('donation') || title.includes('blood') || title.includes('plasma')) {
      counts.donation++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Faith
    if (title.includes('faith') || title.includes('church') || title.includes('temple') || title.includes('mosque')) {
      counts.faith++;
      if (!notable.faithTradition && detail.length > 0) {
        notable.faithTradition = entry.title.split(':')[0] || 'faith community';
      }
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Mind/Body activities
    if (title.includes('martial') || title.includes('music') || title.includes('dance') || title.includes('sport')) {
      counts.mindBody++;
      if (!notable.activitySignature) {
        if (title.includes('taekwondo')) notable.activitySignature = 'Taekwondo';
        else if (title.includes('piano')) notable.activitySignature = 'Piano';
        else if (title.includes('guitar')) notable.activitySignature = 'Guitar';
        else if (title.includes('dance')) notable.activitySignature = 'Dance';
        else if (title.includes('soccer')) notable.activitySignature = 'Soccer';
        else notable.activitySignature = 'structured activities';
      }
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Shopping
    if (kind === 'finance' || title.includes('bought') || title.includes('purchase')) {
      counts.shopping++;
      if (!notable.biggestPurchase && detail.length > 0) {
        notable.biggestPurchase = detail.split('.')[0];
      }
    }
    
    // Routine
    if (title.includes('routine') || title.includes('bedtime') || title.includes('ritual')) {
      counts.routine++;
    }
    
    // Retirement
    if (title.includes('retirement') || title.includes('401k') || title.includes('savings')) {
      counts.retirementContrib++;
    }
    
    // Business
    if (title.includes('business') || title.includes('side gig') || title.includes('startup')) {
      counts.businessAttempt++;
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
    
    // Harsh choices (Choice E)
    if (meta.choice === 'E' || title.includes('harsh') || kind === 'harm') {
      counts.harshChoiceE++;
    }
    
    // Pet
    if (kind === 'pet' || title.includes('pet') || title.includes('dog') || title.includes('cat')) {
      if (!notable.petType && meta.petType) {
        notable.petType = meta.petType;
      }
      if (!notable.petName && meta.petName) {
        notable.petName = meta.petName;
      }
      rememberedLines.push(`Age ${entry.age}: ${entry.title}`);
    }
  });
  
  // Determine favorite study module
  if (Object.keys(counts.studyByModule).length > 0) {
    const sorted = Object.entries(counts.studyByModule).sort((a, b) => b[1] - a[1]);
    notable.favoriteStudyModule = sorted[0][0];
  }
  
  // Pet info from facts if not in timeline
  if (!notable.petType && facts.schooling.hasPet) {
    notable.petType = facts.schooling.petTypes?.[0] || 'pet';
    notable.petName = facts.schooling.petNames?.[0] || 'their pet';
  }
  
  // Phone years (estimate based on endAge and phone presence)
  if (facts.schooling.hasPhone) {
    notable.phoneYears = Math.max(1, facts.endAge - 10); // rough estimate
  }
  
  // Debt years (estimate based on negative money)
  if (facts.debt > 0) {
    notable.debtYears = facts.debt > 20000 ? 5 : 2; // rough estimate
  }

  // Martial arts signature
  const martialArts = facts.mindBody?.martialArts;
  if (martialArts?.activeStyleId) {
    try {
      const beltIndex = martialArts.beltIndexByStyle?.[martialArts.activeStyleId] || 0;
      const style = MARTIAL_STYLES.find(s => s.id === martialArts.activeStyleId);
      const belt = MARTIAL_BELTS[beltIndex];

      if (style && belt) {
        notable.martialArtsStyle = style.name;
        notable.martialArtsBelt = belt.label;

        // If black belt, prioritize for signature
        if (beltIndex >= MARTIAL_BELTS.length - 1) {
          notable.activitySignature = `${style.name} (Black Belt)`;
        } else if (!notable.activitySignature) {
          notable.activitySignature = `${style.name} (${belt.label})`;
        }
      }
    } catch (err) {
      console.error('Failed to load martial arts data:', err);
    }
  }

  // Pick up to 6 remembered moments deterministically, with a bias toward older ages.
  const memRng = createSeededRng(`${facts.runId}|rememberedMoments`);
  const uniqueMemories = [...new Set(rememberedLines.filter(Boolean))];

  const parsed = uniqueMemories.map(line => {
    const m = /^Age\s+(\d+):/.exec(line);
    const age = m ? Number(m[1]) : NaN;
    return { line, age };
  });

  const older = parsed.filter(p => Number.isFinite(p.age) && p.age >= 10).map(p => p.line);
  const younger = parsed.filter(p => !Number.isFinite(p.age) || p.age < 10).map(p => p.line);

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(memRng.nextFloat() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  };
  const olderShuffled = shuffle(older);
  const youngerShuffled = shuffle(younger);

  const rememberedMoments = [...olderShuffled, ...youngerShuffled].slice(0, 6);

  return { counts, notable, rememberedMoments };

}

// ===== LEGENDARY ELIGIBILITY GATE =====
function canCheckLegendary(state) {
  const finalAge = state.endAge ?? state.currentYear;
  return finalAge >= 18;
}

// ===== LEGENDARY MARS ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForMarsPioneer(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const s = summary || {};
  const st = state.stats || {};
  
  // New hard gates
  const INTEREST_SPACE = state.childProfile?.primaryInterest === 'SPACE';
  const SCI_FAIR_CHAMP = state.education?.scienceFair?.wonNational === true;
  
  // Check black belt
  let BLACK_BELT = false;
  try {
    BLACK_BELT = hasAnyBlackBelt(state);
  } catch (err) {
    console.error('Failed to check black belt:', err);
  }
  
  // Existing legendary gates (brutal)
  const INT_OK = st.intelligence >= 52;
  const EMP_OK = st.empathy >= 50;
  const CON_OK = st.confidence >= 48;
  const DIS_OK = st.discipline >= 38 && st.discipline <= 60;
  
  const LOVE_OK = (st.love ?? state.love ?? 0) >= 32;
  const STRESS_OK = (state.parentStress ?? state.stress ?? 0) <= 18;
  
  const NO_HARSH_PATTERN = (s.counts?.harshChoiceE ?? 0) === 0;
  
  const STUDY_DEEP = (s.counts?.study ?? 0) >= 12;
  const TUTOR_SOME = (s.counts?.tutoring ?? 0) >= 5;
  
  const PHONE_LIMIT = (s.notable?.phoneYears ?? 0) <= 2;
  
  return INTEREST_SPACE && SCI_FAIR_CHAMP && BLACK_BELT
      && INT_OK && EMP_OK && CON_OK && DIS_OK
      && LOVE_OK && STRESS_OK
      && NO_HARSH_PATTERN
      && STUDY_DEEP && TUTOR_SOME
      && PHONE_LIMIT;
}

// ===== LEGENDARY SUPERVILLAIN ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForSupervillain(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const s = summary || {};
  const st = state.stats || {};
  const sci = state.education?.scienceFair;
  
  const SCI_FAIR_CHAMP = sci?.wonNational === true;
  const INTEREST_BUILDING = state.childProfile?.primaryInterest === 'BUILDING';
  const INT_OK = st.intelligence >= 55;
  const EMP_VERY_LOW = Number(st.empathy || 0) < 1;
  const CON_OK = st.confidence >= 28;
  const DIS_OK = st.discipline >= 20;
  const LOVE_LOWISH = (st.love ?? state.love ?? 0) <= 18;
  
  // NEW: Must have been to Juvenile Hall at least once
  const HALL_EVER = state.juvenileJustice?.hall?.ever === true || (state.juvenileJustice?.hall?.visits || 0) >= 1;
  
  const harshE = s.counts?.harshChoiceE ?? 0;
  
  return SCI_FAIR_CHAMP && INTEREST_BUILDING && INT_OK && EMP_VERY_LOW && CON_OK && DIS_OK && (LOVE_LOWISH || harshE >= 2) && HALL_EVER;
}

// ===== LEGENDARY HERO PRESIDENT ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForHeroPresident(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const s = summary || {};
  const st = state.stats || {};
  const lead = state.education?.studentLeadership;
  
  const WON_CLASS_PRES = lead?.wonClassPresident === true;
  const WON_LISTEN_FIRST = lead?.wonWithListenFirst === true;
  
  const INTEREST_PEOPLE = state.childProfile?.primaryInterest === 'PEOPLE';
  const EMP_OK = st.empathy >= 52;
  const CON_OK = st.confidence >= 48;
  const INT_OK = st.intelligence >= 45;
  const DIS_OK = st.discipline >= 30 && st.discipline <= 60;
  const LOVE_OK = (st.love ?? state.love ?? 0) >= 35;
  const STRESS_OK = (state.parentStress ?? state.stress ?? 0) <= 18;
  const NO_HARSH = (s.counts?.harshChoiceE ?? 0) === 0;
  
  return WON_CLASS_PRES && WON_LISTEN_FIRST && INTEREST_PEOPLE
      && EMP_OK && CON_OK && INT_OK && DIS_OK && LOVE_OK && STRESS_OK && NO_HARSH;
}

// ===== LEGENDARY ASTEROID MINER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForAsteroidMiner(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const s = summary || {};
  const st = state.stats || {};
  
  const INTEREST_SPACE = state.childProfile?.primaryInterest === 'SPACE';
  const SCI_FAIR_CHAMP = state.education?.scienceFair?.wonNational === true;
  
  let BLACK_BELT = false;
  try {
    BLACK_BELT = hasAnyBlackBelt(state);
  } catch (err) {
    console.error('Failed to check black belt:', err);
  }
  
  const INT_OK = st.intelligence >= 52;
  const DIS_OK = st.discipline >= 35;
  const EMP_OK = st.empathy >= 25;
  const CON_MID = st.confidence >= 28 && st.confidence <= 44; // Not quite Mars confidence
  const NO_HARSH = (s.counts?.harshChoiceE ?? 0) === 0;
  
  return INTEREST_SPACE && SCI_FAIR_CHAMP && BLACK_BELT
      && INT_OK && DIS_OK && EMP_OK && CON_MID && NO_HARSH;
}

// ===== LEGENDARY TIME TRAVELER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForTimeTraveler(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  
  const SCI_FAIR_CHAMP = state.education?.scienceFair?.wonNational === true;
  const INT_GENIUS = st.intelligence >= 60;
  const DIS_RECKLESS = st.discipline <= 18; // Reckless genius energy
  const EMP_OK = st.empathy >= 10; // Not evil, just... gone
  const STRESS_OK = (state.stress ?? 0) <= 22; // Not a breakdown
  
  return SCI_FAIR_CHAMP && INT_GENIUS && DIS_RECKLESS && EMP_OK && STRESS_OK;
}

// ===== LEGENDARY BLOCKCRAFT 2 ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForBlockcraft2(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const s = summary || {};
  const st = state.stats || {};
  const interest = state.childProfile?.primaryInterest;
  
  const INTEREST_OK = interest === 'BUILDING' || interest === 'ART';
  const INT_OK = st.intelligence >= 50;
  const CON_OK = st.confidence >= 40;
  const LEARNED = (s.counts?.study ?? 0) >= 6 || (s.counts?.tutoring ?? 0) >= 4;
  
  return INTEREST_OK && INT_OK && CON_OK && LEARNED;
}

// ===== WORLD DESTROYER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForWorldDestroyer(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  const sci = state.education?.scienceFair;
  
  const SCI_FAIR_CHAMP = sci?.wonNational === true;
  const INTEREST_BUILDING = state.childProfile?.primaryInterest === 'BUILDING';
  const INT_OK = st.intelligence >= 60;
  const EMP_VERY_LOW = st.empathy <= 4;
  const DIS_OK = st.discipline >= 20;
  const harshE = (summary?.counts?.harshChoiceE ?? 0);
  
  return SCI_FAIR_CHAMP && INTEREST_BUILDING && INT_OK && EMP_VERY_LOW && DIS_OK && harshE >= 2;
}

// ===== NOBEL-TIER SCIENTIST ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForNobelTier(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  const s = summary || {};
  
  const INT_HIGH = st.intelligence >= 65;
  const KNOWLEDGE_HIGH = st.knowledge >= 50;
  const DIS_MODERATE = st.discipline >= 30;
  const CURIOSITY_MODERATE = st.curiosity >= 25;
  const STUDY_DEEP = (s.counts?.study ?? 0) >= 10;
  
  return INT_HIGH && KNOWLEDGE_HIGH && DIS_MODERATE && CURIOSITY_MODERATE && STUDY_DEEP;
}

// ===== OLYMPIC MEDALIST ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForOlympicMedalist(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  
  const FITNESS_HIGH = st.fitness >= 50;
  const DIS_HIGH = st.discipline >= 40;
  const CON_MODERATE = st.confidence >= 30;
  const STRESS_OK = (state.stress ?? 0) <= 25;
  
  return FITNESS_HIGH && DIS_HIGH && CON_MODERATE && STRESS_OK;
}

// ===== PEACEMAKER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForPeacemaker(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  const s = summary || {};
  
  const EMP_VERY_HIGH = st.empathy >= 55;
  const SOCIAL_HIGH = st.social >= 40;
  const CON_MODERATE = st.confidence >= 30;
  const DIS_MODERATE = st.discipline >= 25;
  const NO_HARSH = (s.counts?.harshChoiceE ?? 0) === 0;
  
  return EMP_VERY_HIGH && SOCIAL_HIGH && CON_MODERATE && DIS_MODERATE && NO_HARSH;
}

// ===== MEDIA MOGUL ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForMediaMogul(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  
  const SOCIAL_HIGH = st.social >= 45;
  const CON_HIGH = st.confidence >= 40;
  const followers = Number(state?.socialMedia?.totalFollowers || 0);
  const accountsActive = Object.keys(state?.socialMedia?.accounts || {}).length;
  
  const FAME_STRONG = followers >= 25000 || accountsActive >= 2;
  
  return SOCIAL_HIGH && CON_HIGH && FAME_STRONG;
}

// ===== KINGMAKER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForKingmaker(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  
  const INT_HIGH = st.intelligence >= 50;
  const SOCIAL_HIGH = st.social >= 40;
  const CON_MODERATE = st.confidence >= 30;
  const DIS_MODERATE = st.discipline >= 25;
  
  const approval = Number(state?.politics?.approval || 0);
  const office = state?.politics?.currentOfficeId;
  const warChest = Number(state?.politics?.warChest || 0);
  
  const POLITICS_INVOLVED = office || approval >= 50 || warChest >= 10000;
  
  return INT_HIGH && SOCIAL_HIGH && CON_MODERATE && DIS_MODERATE && POLITICS_INVOLVED;
}

// ===== MEME ICON ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForMemeIcon(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  
  const CREATIVITY_HIGH = st.creativity >= 40;
  const SOCIAL_MODERATE = st.social >= 25;
  const followers = Number(state?.socialMedia?.totalFollowers || 0);
  
  const SOME_FAME = followers >= 5000;
  
  return CREATIVITY_HIGH && SOCIAL_MODERATE && SOME_FAME;
}

// ===== DYNASTY BUILDER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForDynastyBuilder(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  
  const INT_HIGH = st.intelligence >= 50;
  const DIS_HIGH = st.discipline >= 40;
  const CON_MODERATE = st.confidence >= 30;
  
  const money = Number(state?.money || 0);
  const biz = Number(state?.businessIncomePerYear || 0);
  const hasHome = state?.inventory?.items?.some(i => i.uniqueGroup === 'home') || (state?.realEstate?.properties?.length || 0) > 0;
  
  const WEALTH_STRONG = money >= 150000 || biz >= 50000 || (hasHome && money >= 80000);
  
  return INT_HIGH && DIS_HIGH && CON_MODERATE && WEALTH_STRONG;
}

// ===== CULT LEADER ELIGIBILITY (AGE 18+ ONLY) =====
function isEligibleForCultLeader(state, summary) {
  if (!canCheckLegendary(state)) return false;
  
  const st = state.stats || {};
  const FAITH_SCORE = getFaithScore(state);
  
  const FAITH_MAX = FAITH_SCORE >= 90;
  const EMP_VERY_LOW = Number(st.empathy || 0) < 1;
  const CON_OK = st.confidence >= 45;
  const DIS_OK = st.discipline >= 25;
  
  return FAITH_MAX && EMP_VERY_LOW && CON_OK && DIS_OK;
}

// ===== COMPUTE KIDS COUNT (DETERMINISTIC, WEIGHTED) =====
function computeKidsCount(facts, tags, rng) {
  // 1) Derive scores
  const love = safeNumber(facts.stats.love, 0);
  const emp = safeNumber(facts.stats.empathy, 0);
  const conf = safeNumber(facts.stats.confidence, 0);
  const moneyTier = tags.has('MONEY_HIGH') || tags.has('MONEY_VERYHIGH') ? 2 : 
                    tags.has('MONEY_MID') ? 1 : 0;
  
  // 2) Compute desire index (bounded 0-1)
  const desire = clamp(
    0.55 * (love / 12) + 
    0.25 * (emp / 12) + 
    0.15 * (conf / 12) + 
    0.05 * moneyTier,
    0, 1
  );
  
  // 3) Select weighted distribution based on desire
  let weights;
  if (desire < 0.20) {
    // Low desire: mostly 0-2 kids
    weights = [45, 30, 12, 6, 4, 2, 1, 0, 0];
  } else if (desire < 0.40) {
    // Low-mid desire: mostly 1-3 kids
    weights = [25, 28, 20, 12, 7, 4, 2, 1, 1];
  } else if (desire < 0.60) {
    // Mid desire: mostly 2-4 kids
    weights = [12, 20, 25, 18, 10, 7, 4, 2, 2];
  } else if (desire < 0.80) {
    // High-mid desire: balanced 1-5 kids
    weights = [8, 14, 20, 20, 14, 10, 6, 4, 4];
  } else {
    // High desire: more likely 3-6 kids, still rare 7-8
    weights = [6, 10, 14, 18, 16, 14, 10, 7, 5];
  }
  
  // 4) Pick from distribution
  let picked = rng.weightedPick(weights);
  
  // 5) Apply rare cap softener (keeps 7-8 very rare)
  if (rng.chance(0.65) && picked >= 7) {
    picked = Math.max(0, picked - 1);
  }
  
  // 6) Money constraint (large families cost money)
  if (tags.has('MONEY_LOW') && picked >= 6) {
    picked = Math.max(0, picked - 1);
  }
  
  // 7) Final clamp
  return clamp(picked, 0, 8);
}

// ===== BUILD OUTCOME FACTS =====
export function buildOutcomeFacts(gameState) {
  const stats = gameState.stats || {};
  const familyPatterns = gameState.familyPatterns || {};
  const partnerPatterns = gameState.partnerPatterns || {};
  const studyProgress = gameState.studyProgress || {};
  
  return {
    runId: gameState.runSeed || "default",
    endAge: safeNumber(gameState.endAge ?? gameState.currentYear, 18),
    childName: gameState.childName || "Your Child",
    childAvatar: gameState.childAvatarEmoji || "🧒",
    childGender: gameState.childAvatarGender || "",
    parentRole: gameState.parentRole || "Parent",
    promRoyalty: gameState.promRoyalty || null,
    parent: gameState.parent || {
      role: gameState.parentRole || "mom",
      name: ""
    },
    partner: gameState.householdType === 'two' ? {
      name: gameState.partnerName || "Partner",
      avatar: gameState.partnerEmoji || "🙂"
    } : null,
    
    stats: {
      intelligence: safeNumber(stats.intelligence, 0),
      empathy: safeNumber(stats.empathy, 0),
      discipline: safeNumber(stats.discipline, 0),
      confidence: safeNumber(stats.confidence, 0),
      love: safeNumber(gameState.love, 0),
      stress: safeNumber(gameState.stress, 0)
    },
    
    money: safeNumber(gameState.money, 0),
    debt: Math.max(0, -safeNumber(gameState.money, 0)),
    retirement: safeNumber(gameState.retirementSavings, 0),
    
    schooling: {
      mode: gameState.schoolType || "unknown",
      hasPhone: !!gameState.phoneOwned,
      hasPet: hasAnyPet(gameState),
      petNames: getLivingPets(gameState).map(p => p.name).filter(Boolean),
      petTypes: getLivingPets(gameState).map(p => p.speciesKey || p.type || 'pet').filter(Boolean)
    },
    
    studies: {
      positiveParenting: safeNumber(studyProgress.positiveParenting?.completedCount, 0),
      nvc: safeNumber(studyProgress.nvc?.completedCount, 0),
      empathyKids: safeNumber(studyProgress.empathyKids?.completedCount, 0)
    },
    
    patterns: {
      selfSelectedIds: familyPatterns.selectedIds || [],
      selfResolvedIds: Object.keys(familyPatterns.resolvedById || {}).filter(id => familyPatterns.resolvedById[id]),
      partnerSelectedIds: partnerPatterns.selectedIds || [],
      partnerResolvedIds: Object.keys(partnerPatterns.resolvedById || {}).filter(id => partnerPatterns.resolvedById[id])
    },

    mindBody: {
      martialArts: gameState.mindBody?.martialArts || {
        activeStyleId: null,
        beltIndexByStyle: {},
        yearsTrainedByStyle: {}
      }
    },
    
    profile: {
      primaryInterest: gameState.childProfile?.primaryInterest || null,
      pubertyPassion: gameState.childProfile?.pubertyPassion || null
    },
    
    timeline: {
      entries: Array.isArray(gameState.timelineEntries) ? gameState.timelineEntries : [],
      memories: Array.isArray(gameState.memories) ? gameState.memories : []
    },
    
    counters: {
      harmCount: safeNumber(gameState.counters?.harmCount, 0)
    },

    habits: {
      phoneGamesTotal: safeNumber(gameState.phoneGamesTotal, 0),
      phoneConfidenceLost: safeNumber(gameState.phoneGamesConfidenceLossApplied, 0)
    },

    room: {
      items: gameState.room?.items || [],
      seeds: gameState.room?.seeds || {},
      lastViewedAtAge: gameState.room?.lastViewedAtAge
    }
    };
    }

    // ===== ROOM HELPERS =====
    export function getRoomSeed(facts, seedKey) {
      return facts.room?.seeds?.[seedKey] || 0;
    }

    export function hasRoomTag(facts, tag) {
      const items = facts.room?.items || [];
      return items.some(item => item.tags && item.tags.includes(tag));
    }

    // ===== ROOM SEED HELPERS (for ending integration) =====
    function computeRoomSeeds(facts) {
      const seeds = facts.room?.seeds || {};
      return {
        sHero: (seeds.hero || 0) + (seeds.leadership || 0),
        sSpace: (seeds.space || 0) + (seeds.science || 0) + (seeds.engineering || 0),
        sMusic: (seeds.music || 0) + (seeds.performance || 0),
        sArt: seeds.art || 0,
        sNature: seeds.nature || 0,
        sRoutine: (seeds.routine || 0) + (seeds.reading || 0),
        sAthletics: seeds.athletics || 0,
        sMining: seeds.mining || 0
      };
    }

    // ===== ROOM-TRIGGERED SPECIAL CAREERS =====
    function checkRoomSpecialCareers(state, facts, rng, summary, tags) {
      const st = state.stats || {};
      const rs = computeRoomSeeds(facts);
      const items = facts.room?.items || [];

      const hasRoomTagLocal = (tag) => items.some(item => item.tags && item.tags.includes(tag));

      // A) Community Protector
      if (rs.sHero >= 3 && st.empathy >= 18 && st.confidence >= 18 && st.discipline >= 0) {
        const variants = [
          "They grew into someone who runs toward problems with a steady heart—helping, organizing, protecting.",
          "They never wanted fame. They wanted impact. Somehow, they got both in small, human ways.",
          "They became the person neighbors call when something goes wrong—and when something goes right.",
          "They built a life around service… and still remembered to laugh.",
          "They weren't 'a hero.' They were reliable. That's rarer.",
          "They learned courage isn't loud. It's showing up again tomorrow."
        ];
        const careerLabels = ["Community Protector", "First Responder", "Community Advocate"];

        return {
          careerId: "community_protector",
          careerTitle: rng.pick(careerLabels),
          careerText: rng.pick(variants),
          wealthVibe: "Stable"
        };
      }

      // B) Architect of Calm
      if ((hasRoomTagLocal("build") || hasRoomTagLocal("engineering")) && rs.sRoutine >= 3 && st.intelligence >= 16 && st.discipline >= 16) {
        const variants = [
          "They learned to turn chaos into structure—and somehow made structure feel kind.",
          "They built plans the way other people build art: patiently, precisely, with pride.",
          "They became the one who sees how parts fit together—homes, teams, projects, lives.",
          "They weren't obsessed with perfection. They were obsessed with making things work.",
          "They grew into a builder—of spaces, of routines, of stability."
        ];
        const careerLabels = ["Architect", "Systems Designer", "Project Planner"];

        return {
          careerId: "architect_of_calm",
          careerTitle: rng.pick(careerLabels),
          careerText: rng.pick(variants),
          wealthVibe: "Comfortable"
        };
      }

      // C) Creative Maker
      if ((rs.sArt >= 3 || hasRoomTagLocal("art")) && st.confidence >= 16) {
        const variants = [
          "They made things—messy, brave things—and people felt less alone because of it.",
          "They didn't 'find themselves.' They made themselves, one project at a time.",
          "They learned that creativity is allowed to be imperfect. That changed everything.",
          "They turned small feelings into big work.",
          "They built a life where making things wasn't a hobby—it was a language."
        ];

        return {
          careerId: "creative_maker",
          careerTitle: "Artist / Designer / Creator",
          careerText: rng.pick(variants),
          wealthVibe: "Variable"
        };
      }

      // D) Music on the Road (two-tone)
      if (rs.sMusic >= 3 && st.confidence >= 16) {
        if (st.empathy >= 16 && st.discipline >= 16) {
          // Grounded path
          const variants = [
            "They toured, played, came home, and kept their feet on the ground—mostly.",
            "They made music and still remembered the humans around them.",
            "They learned discipline in rehearsal and freedom on stage.",
            "They turned noise into meaning—and built a stable life around it."
          ];

          return {
            careerId: "music_grounded",
            careerTitle: "Touring Musician (grounded)",
            careerText: rng.pick(variants),
            wealthVibe: "Variable"
          };
        } else {
          // Chaotic path
          const variants = [
            "They chased the rush harder than the rest—and it cost them stability for a while.",
            "Fame showed up fast. Coping skills didn't. The story got messy before it got better.",
            "They ran hot: late nights, big feelings, and a few years that worried everyone.",
            "They weren't bad—just unsteady. Eventually, they either learned balance… or kept spinning."
          ];

          return {
            careerId: "music_chaotic",
            careerTitle: "Touring Musician (chaotic)",
            careerText: rng.pick(variants),
            wealthVibe: "Unstable"
          };
        }
      }

      // E) Gentle Earthkeeper
      if (rs.sNature >= 3 && st.empathy >= 16) {
        const variants = [
          "They took care of living things—quietly, consistently, like it mattered. Because it did.",
          "They built a life that feels like a deep breath.",
          "They helped people and animals in ways that don't trend online—but change real days.",
          "They chose 'useful' over 'impressive,' and ended up impressive anyway.",
          "They grew into someone who repairs, not destroys."
        ];
        const careerLabels = ["Vet Tech", "Wildlife Helper", "Community Gardener", "Aid Worker"];

        return {
          careerId: "gentle_earthkeeper",
          careerTitle: rng.pick(careerLabels),
          careerText: rng.pick(variants),
          wealthVibe: "Stable"
        };
      }

      return null;
    }

    // ===== COMPUTE OUTCOME TAGS =====
export function computeOutcomeTags(facts) {
  const tags = new Set();
  
  // Stat tier helper
  const tier = (v) => {
    if (v <= -2) return "VERYLOW";
    if (v <= 1) return "LOW";
    if (v <= 6) return "MID";
    if (v <= 12) return "HIGH";
    return "VERYHIGH";
  };

  // Love/Stress are 0–100 in the core game; use meaningful buckets.
  const tierPct = (v) => {
    const x = safeNumber(v, 0);
    if (x <= 20) return "VERYLOW";
    if (x <= 40) return "LOW";
    if (x <= 60) return "MID";
    if (x <= 80) return "HIGH";
    return "VERYHIGH";
  };
  
  // Intelligence now spans much higher values in a 0–18 run.
  // Align INT buckets to the updated intelligence descriptors:
  // LOW≈<=43, MID≈<=65, HIGH≈<=88, VERYHIGH>88
  const tierInt = (v) => {
    if (v <= 0) return "VERYLOW";
    if (v <= 43) return "LOW";
    if (v <= 65) return "MID";
    if (v <= 88) return "HIGH";
    return "VERYHIGH";
  };
  
  // Money tier
  const moneyTier = (m) => {
    if (m < -5000) return "VERYLOW";
    if (m < 0) return "LOW";
    if (m < 20000) return "MID";
    if (m < 80000) return "HIGH";
    return "VERYHIGH";
  };
  
  // Retirement tier
  const retireTier = (r) => {
    if (r < 2000) return "VERYLOW";
    if (r < 8000) return "LOW";
    if (r < 20000) return "MID";
    if (r < 50000) return "HIGH";
    return "VERYHIGH";
  };
  
  // Study tier
  const studyTier = (count) => {
    if (count === 0) return "NONE";
    if (count < 7) return "SOME";
    return "A_LOT";
  };
  
  // Add stat tags
  tags.add(`INT_${tier(facts.stats.intelligence)}`);
  tags.add(`EMP_${tier(facts.stats.empathy)}`);
  tags.add(`DIS_${tier(facts.stats.discipline)}`);
  tags.add(`CONF_${tier(facts.stats.confidence)}`);
  tags.add(`LOVE_${tierPct(facts.stats.love)}`);
  tags.add(`STRESS_${tierPct(facts.stats.stress)}`);
  
  // Add money/retirement tags
  tags.add(`MONEY_${moneyTier(facts.money)}`);
  tags.add(`RETIRE_${retireTier(facts.retirement)}`);
  
  // Add binary tags
  tags.add(facts.partner ? "PARTNER_YES" : "PARTNER_NO");
  tags.add(facts.schooling.hasPet ? "PET_YES" : "PET_NO");
  tags.add(facts.schooling.hasPhone ? "PHONE_YES" : "PHONE_NO");

  // Prom royalty (age 18+) — extremely high empathy + confidence
  // Note: this can be set explicitly in state (promRoyalty), but we also
  // derive it from endAge + stats so older saves still get the ending text.
  const promFromState = facts.promRoyalty?.won === true;
  const promFromThreshold =
    facts.endAge >= 18 &&
    safeNumber(facts.stats.empathy, 0) >= 90 &&
    safeNumber(facts.stats.confidence, 0) >= 90;
  if (promFromState || promFromThreshold) {
    tags.add("PROM_ROYALTY");
  }
  
  // Add study tags
  tags.add(`STUDY_PP_${studyTier(facts.studies.positiveParenting)}`);
  
  // Add pattern tags
  tags.add(facts.patterns.selfSelectedIds.length > 0 ? "PATTERNS_SELF_SOME" : "PATTERNS_SELF_NONE");
  tags.add(facts.patterns.partnerSelectedIds.length > 0 ? "PATTERNS_PARTNER_SOME" : "PATTERNS_PARTNER_NONE");
  
  // B) NEW TAGS FOR V4
  
  // 1) Schooling tags
  const schoolMode = facts.schooling.mode;
  if (schoolMode === 'standard') tags.add('SCHOOL_PUBLIC');
  else if (schoolMode === 'empathy') tags.add('SCHOOL_EMPATHY');
  else if (schoolMode === 'homeschool') tags.add('SCHOOL_HOMESCHOOL');
  else if (schoolMode === 'private') tags.add('SCHOOL_PRIVATE');
  else tags.add('SCHOOL_UNKNOWN');
  
  // 2) Debt tags
  if (facts.debt <= 0 && facts.money >= 0) tags.add('DEBT_NONE');
  else if (facts.debt > 0 && facts.debt < 20000) tags.add('DEBT_LOW');
  else if (facts.debt >= 20000) tags.add('DEBT_HIGH');
  if (facts.money < 0) tags.add('MONEY_NEGATIVE');
  
  // 3) Travel tags (count passport stamps from timeline)
  const stampCount = facts.timeline.entries.filter(e => 
    e.kind === 'travel' || (e.meta && e.meta.passport)
  ).length;
  if (stampCount === 0) tags.add('TRAVEL_NONE');
  else if (stampCount <= 2) tags.add('TRAVEL_SOME');
  else tags.add('TRAVEL_A_LOT');
  
  // 4) Business tags (stub - would need tracking in gameState)
  tags.add('BUSINESS_NONE');
  
  // 5) Trauma/healing tags
  if (facts.patterns.selfSelectedIds.length === 0) tags.add('TRAUMA_SELF_NONE');
  else tags.add('TRAUMA_SELF_SOME');
  
  if (facts.patterns.partnerSelectedIds.length === 0) tags.add('TRAUMA_PARTNER_NONE');
  else tags.add('TRAUMA_PARTNER_SOME');
  
  if (facts.patterns.selfResolvedIds.length > 0) tags.add('HEALING_SELF_SOME');
  if (facts.patterns.partnerResolvedIds.length > 0) tags.add('HEALING_PARTNER_SOME');
  
  // 6) Counseling tags
  const hasCounseling = facts.timeline.entries.some(e => 
    e.title && (e.title.includes('Counselor') || e.title.includes('Therapy'))
  );
  if (hasCounseling || facts.patterns.selfResolvedIds.length > 0 || facts.patterns.partnerResolvedIds.length > 0) {
    tags.add('COUNSELING_USED');
  }
  
  // 7) ACTION TAGS (Action Echoes)
  const summary = buildActionSummary(facts);
  
  // Study tags
  if (summary.counts.study === 0) tags.add('STUDY_NONE');
  else if (summary.counts.study <= 3) tags.add('STUDY_SOME');
  else if (summary.counts.study <= 7) tags.add('STUDY_HEAVY');
  else tags.add('STUDY_DEEP');
  
  // Tutoring tags
  if (summary.counts.tutoring === 0) tags.add('TUTOR_NONE');
  else if (summary.counts.tutoring <= 2) tags.add('TUTOR_SOME');
  else tags.add('TUTOR_HEAVY');
  
  // Play tags
  if (summary.counts.play <= 1) tags.add('PLAY_LOW');
  else if (summary.counts.play <= 3) tags.add('PLAY_MID');
  else tags.add('PLAY_HIGH');
  
  // Bond tags
  if (summary.counts.bond <= 1) tags.add('BOND_LOW');
  else if (summary.counts.bond <= 3) tags.add('BOND_MID');
  else tags.add('BOND_HIGH');
  
  // Doctor/counselor usage
  if (summary.counts.doctor >= 1) tags.add('DOCTOR_USED');
  if (summary.counts.counselor >= 1) tags.add('COUNSELOR_USED');
  
  // Community/faith tags
  if (summary.counts.donation >= 1) tags.add('COMMUNITY_GIVER');
  if (summary.counts.faith >= 2) tags.add('FAITH_ACTIVE');
  
  // Activity tags
  if (summary.counts.mindBody === 0) tags.add('ACTIVITY_NONE');
  else if (summary.counts.mindBody <= 2) tags.add('ACTIVITY_SOME');
  else tags.add('ACTIVITY_HEAVY');
  
  // Pet tags
  if (!summary.notable.petType) {
    tags.add('PET_NONE');
  } else {
    tags.add('PET_PRESENT');
    const petType = (summary.notable.petType || '').toLowerCase();
    if (petType.includes('dog')) tags.add('PET_DOG');
    else if (petType.includes('cat')) tags.add('PET_CAT');
    else if (petType.includes('fish')) tags.add('PET_FISH');
    else if (petType.includes('rabbit')) tags.add('PET_RABBIT');
    else if (petType.includes('bird')) tags.add('PET_BIRD');
    else tags.add('PET_OTHER');
  }
  
  // Phone habit tags
  if (summary.notable.phoneYears === 0) tags.add('PHONE_NONE');
  else if (summary.notable.phoneYears <= 2) tags.add('PHONE_SHORT');
  else tags.add('PHONE_LONG');
  
  // Harsh choice tags
  if (summary.counts.harshChoiceE === 0) tags.add('HARSH_NONE');
  else if (summary.counts.harshChoiceE === 1) tags.add('HARSH_SOME');
  else tags.add('HARSH_MANY');

  return tags;
  }

  // ===== COMPUTE FORGIVENESS TAGS =====
  export function computeForgivenessTags(facts, tags) {
  const rng = createSeededRng(`${facts.runId}|forgiveness`);
  const forgiveness = computeForgiveness(facts, tags, rng);

  if (forgiveness.years === 0 || (forgiveness.years !== null && forgiveness.years <= 2)) {
    tags.add('FORGIVE_FAST');
  } else if (forgiveness.years !== null && forgiveness.years <= 12) {
    tags.add('FORGIVE_SLOW');
  } else if (forgiveness.years !== null && forgiveness.years > 12) {
    tags.add('FORGIVE_VERY_SLOW');
  } else {
    tags.add('FORGIVE_COMPLICATED');
  }

  return tags;
}

// ===== LETTER SALUTATION HELPER (Love-Based) =====
function getLetterSalutation(state, rng = null) {
  const parent = state.parent || {};
  const role = parent.role || state.parentRole || "mom";
  const parentName = (parent.name || "").trim();
  
  // Love may be negative; handle safely
  const love = Number(state.stats?.love ?? state.love ?? 0);
  
  // Thresholds
  const NEGATIVE_LOVE = 0;
  const LOW_LOVE = 25;
  const HIGH_LOVE = 65;
  const VERY_HIGH_LOVE = 85;
  
  // Choose formal title based on role
  const formal = role === "dad" ? "Mr." : "Mrs.";
  
  // Safe fallback for name
  const safeName = parentName.length >= 2 ? parentName : (role === "dad" ? "Dad" : "Mom");
  
  // Cute nickname pools (hardcoded, rotate randomly)
  const mommyNicknames = [
    "Mommy Wommy",
    "Momma Llama",
    "Mama Bear",
    "Super Mom",
    "Mom‑of‑the‑Year (in my heart)",
    "My Favorite Human Mom"
  ];
  const daddyNicknames = [
    "Daddy Patty",
    "Papa Rocket",
    "Dad‑icus Prime",
    "Super Dad",
    "Captain Dad",
    "My Favorite Human Dad"
  ];
  
  // Pick function (use seeded RNG if available, else fallback)
  const pick = (arr) => {
    if (!rng || typeof rng.pick !== 'function') return arr[0];
    return rng.pick(arr);
  };
  
  if (love >= VERY_HIGH_LOVE) {
    // Very High Love: Cute nickname
    if (role === "dad") return `Dear ${pick(daddyNicknames)},`;
    if (role === "mom") return `Dear ${pick(mommyNicknames)},`;
    return `Dear ${safeName} (My Favorite Human),`;
  }
  
  if (love >= HIGH_LOVE) {
    // High Love: Warm standard
    if (role === "dad") return "Dear Dad,";
    if (role === "mom") return "Dear Mom,";
    return `Dear ${safeName},`;
  }
  
  if (love < NEGATIVE_LOVE) {
    // Negative Love: Cold/Formal
    // If name is available, use first name only. If not, use formal.
    if (parentName.length >= 2) return `${parentName},`;
    return `${formal} ${safeName},`;
  }
  
  if (love <= LOW_LOVE) {
    // Low/Distant Love: Just Name or Role
    if (parentName.length >= 2) return `${parentName},`;
    if (role === "dad") return "Father,";
    if (role === "mom") return "Mother,";
    return "Parent,";
  }
  
  // Default/Mid Love
  if (role === "dad") return "Hi Dad,";
  if (role === "mom") return "Hi Mom,";
  return `Hi ${safeName},`;
}

// ===== HELPER: Determine Wealth Tier =====
function determineWealthTier(facts) {
  const money = facts.money;
  if (money >= 80000) return "Wealthy";
  if (money >= 20000) return "Comfortable";
  if (money >= 0) return "Stable";
  if (money >= -5000) return "Tight";
  return "Precarious";
}

// ===== HELPER: Determine Retirement Tier =====
function determineRetirementTier(facts) {
  const r = facts.retirement;
  if (r >= 50000) return "Secure";
  if (r >= 20000) return "Comfortable";
  if (r >= 8000) return "Modest";
  if (r >= 2000) return "BareBones";
  return "Precarious";
}

// ===== FORMAT TEMPLATE =====
function format(template, vars) {
  if (!template) return "";
  let result = template;
  
  // Replace simple keys {key}
  Object.keys(vars || {}).forEach(key => {
    const val = vars[key];
    if (val !== undefined && val !== null) {
      result = result.split(`{${key}}`).join(String(val));
    }
  });
  
  return result;
}

function buildOutcomeVars(facts, tags, rng, options = {}) {
  // Construct template variables used by narrative strings
  return {
    name: facts.childName,
    childName: facts.childName,
    pronoun: facts.childPronoun,
    parent: facts.parentRole,
    ...facts
  };
}

// ===== MAIN GENERATOR (Pure) =====
export function generateOutcomeV3NoAI(gameState) {
  // 1. Build immutable facts from game state
  const facts = buildOutcomeFacts(gameState);
  
  // 2. Create seeded RNG
  const rng = createSeededRng(`${facts.runId}|outcomeV3`);
  
  // 3. Compute derived tags
  let tags = computeOutcomeTags(facts);
  tags = computeForgivenessTags(facts, tags);

  // 4. Compute "ending narrative" helpers (archetype + callbacks + beat lines)
  const seedKey = facts.runId || "default";
  const timelineEntries = facts?.timeline?.entries || [];

  const love = safeNumber(facts?.stats?.love, 0);
  const stress = safeNumber(facts?.stats?.stress, 0);
  const harmCount = safeNumber(facts?.counters?.harmCount, 0);
  const money = safeNumber(facts?.money, 0);
  const retirementSavings = safeNumber(facts?.retirement, 0);

  const narrativeStats = {
    intelligence: safeNumber(facts?.stats?.intelligence, 0),
    empathy: safeNumber(facts?.stats?.empathy, 0),
    discipline: safeNumber(facts?.stats?.discipline, 0),
    confidence: safeNumber(facts?.stats?.confidence, 0)
  };

  const sig = computeSignatureFromStats({ stats: narrativeStats, tags, seed: `${seedKey}|signature` });

  const arch = computeEndingArchetype({
    seed: seedKey,
    childName: facts.childName,
    parentRole: facts.parentRole,
    stats: narrativeStats,
    love,
    stress,
    money,
    retirementSavings,
    harmCount,
    tags,
    timelineEntries
  });

  if (arch?.id) tags.add(`ARCHETYPE_${arch.id}`);

  const callbacks = computeEndingCallbacks({
    seed: seedKey,
    timelineEntries,
    preferredAgeMin: 10,
    max: 3
  });

  const beats = computeEndingBeatLines({
    seed: seedKey,
    childName: facts.childName,
    parentRole: facts.parentRole,
    stats: narrativeStats,
    love,
    stress,
    money,
    retirementSavings,
    harmCount,
    tags,
    timelineEntries
  });

  // 5. Build variable map for templates
  const vars = buildOutcomeVars(facts, tags, rng, { sig, arch, callbacks, beats });
  
  // 5. Generate sections
  let sections = {};
  const sectionIds = OUTCOME_SECTION_ORDER;
  
  sectionIds.forEach(sectionId => {
    // A) Try to find a matching template in BANK
    const candidates = OUTCOME_TEXT_BANK[sectionId] || [];
    const valid = candidates.filter(tpl => {
      // Check required tags
      if (tpl.requireAll && tpl.requireAll.length > 0) {
        if (!tpl.requireAll.every(tag => tags.has(tag))) return false;
      }
      
      
      // Check requireAny tags
      if (tpl.requireAny && tpl.requireAny.length > 0) {
        if (!tpl.requireAny.some(tag => tags.has(tag))) return false;
      }
// Check excluded tags
      if (tpl.excludeAny && tpl.excludeAny.length > 0) {
        if (tpl.excludeAny.some(tag => tags.has(tag))) return false;
      }
      
      // Check specific ID (for legendary locks)
      if (tpl.id && tpl.id.startsWith("legendary_") && !tags.has(tpl.id.toUpperCase())) {
        // Special case: legendary templates might be auto-selected by tag, 
        // but let's trust the requireAll array instead.
      }
      
      return true;
    });
    
    // B) Pick one template
    let template = null;
    if (sectionId === "letter") {
      const specific = valid.filter(tpl => (
        (Array.isArray(tpl.requireAll) && tpl.requireAll.length > 0) ||
        (Array.isArray(tpl.requireAny) && tpl.requireAny.length > 0)
      ));
      const pool = specific.length > 0 ? specific : valid;
      template = rng.pick(pool);
    } else {
      template = rng.pick(valid);
    }
    
    // C) Render it (or fallback)
    if (template) {
      sections[sectionId] = {
        headline: rng.pick(template.headlines) || sectionId,
        bullets: (template.bullets || []).map(b => format(b, vars)),
        paragraph: format(rng.pick(template.paragraphs), vars),
        tinyTruth: format(rng.pick(template.tinyTruths), vars)
      };
    } else {
      // Fallback generator
      sections[sectionId] = generateSectionFallback(sectionId, facts, tags, vars, rng);
    }
  });
  
  // 6. Ensure Letter exists (critical fallback)
  sections = ensureLetterSection(sections, facts, rng);

  // 6b. Ensure Epilogue exists (critical fallback)
  if (!sections.epilogue || (!sections.epilogue.paragraph && !sections.epilogue.text)) {
    sections.epilogue = {
      headline: "Epilogue",
      bullets: [],
      paragraph: "This life ends here—for now. Regenerate to explore a different outcome voice.",
      tinyTruth: "Tiny truth: the story is yours to rewrite."
    };
  } else {
    // If it exists but paragraph is empty
    const ep = sections.epilogue;
    const txt = ep.paragraph || ep.text || ep.body || "";
    if (!txt.trim()) {
      sections.epilogue = {
        ...ep,
        paragraph: "This life ends here—for now. Regenerate to explore a different outcome voice.",
        tinyTruth: ep.tinyTruth || "Tiny truth: the story is yours to rewrite."
      };
    }
  }

  // 6c. Ensure Letter has content if it was "ensured" but empty
  const letterSec = sections.letter;
  const letterTxt = letterSec.paragraph || letterSec.text || letterSec.body || "";
  if (!letterTxt.trim()) {
    sections.letter = {
      ...letterSec,
      headline: letterSec.headline || "A Letter From Your Adult Child",
      paragraph: "Your ending letter couldn't be generated for this run, but your outcome details are below.",
      tinyTruth: letterSec.tinyTruth || "Tiny truth: sometimes words fail."
    };
  }
  
  // 7. Apply Special Ending Narrative Locks (if any)
  //    (This overrides sections if a trophy demands it)
  //    We pass the entire 'sections' object to be mutated/replaced.
  sections = applySpecialEndingNarrativeLocks({
    gameState,
    facts,
    tags,
    topBadge: gameState.topBadge, // Legacy support if badges stored on state
    legendaryTrophyId: null, // Could be passed if known
    sections
  });
  
  // 8. Final assembly
  return {
    version: "v3-no-ai",
    sections,
    tags: Array.from(tags),
    debug: {
      runId: facts.runId,
      seed: facts.runId, // legacy field name
      statSummary: `${facts.stats.intelligence}/${facts.stats.empathy}/${facts.stats.discipline}/${facts.stats.confidence}`
    }
  };
}