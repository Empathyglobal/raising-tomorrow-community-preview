// endingNarrativeEngine.js
// Deterministic "wow" epilogue helpers: archetypes + callback moments + beat lines.
// Pure functions, no React, safe to import from both outcomesEngineV3 and outcomesEngine (v4).

function hash32(str) {
  let h = 2166136261;
  const s = String(str ?? "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function pick(rng, arr, fallback = "") {
  if (!Array.isArray(arr) || arr.length === 0) return fallback;
  return arr[Math.floor(rng() * arr.length)] ?? fallback;
}

function shuffleInPlace(rng, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function uniq(arr) {
  return [...new Set((Array.isArray(arr) ? arr : []).filter(Boolean))];
}

function normTags(tags) {
  if (!tags) return new Set();
  if (tags instanceof Set) return tags;
  if (Array.isArray(tags)) return new Set(tags);
  return new Set();
}

function toTitleParentRole(parentRole) {
  const r = String(parentRole || "").toLowerCase();
  if (r === "dad" || r === "father") return "Dad";
  if (r === "mom" || r === "mother") return "Mom";
  return "Parent";
}

function detectPetNoun(timelineEntries = [], tags = null) {
  const t = Array.isArray(timelineEntries) ? timelineEntries : [];
  const tagSet = normTags(tags);
  if (tagSet.has("PET_DOG")) return "dog";
  if (tagSet.has("PET_CAT")) return "cat";
  if (tagSet.has("PET_BIRD")) return "bird";
  if (tagSet.has("PET_RABBIT")) return "rabbit";
  if (tagSet.has("PET_FISH")) return "fish";
  // Try timeline meta
  for (const e of t) {
    const meta = e?.meta || {};
    const pt = String(meta.petType || meta.pet || "").toLowerCase();
    if (pt.includes("dog")) return "dog";
    if (pt.includes("cat")) return "cat";
    if (pt.includes("bird")) return "bird";
    if (pt.includes("rabbit")) return "rabbit";
    if (pt.includes("fish")) return "fish";
  }
  return tagSet.has("PET_PRESENT") || tagSet.has("PET_YES") ? "pet" : "";
}

function formatTimelineCallback(entry) {
  if (!entry || !entry.title) return "";
  const age = Number(entry.age);
  const agePart = Number.isFinite(age) ? `Age ${age}: ` : "";
  const title = String(entry.title || "").trim();
  const detailRaw = String(entry.detail || "").trim();
  // Detail can be long / already contains punctuation; keep it short and optional.
  let detail = "";
  if (detailRaw) {
    const clean = detailRaw.replace(/\s+/g, " ").trim();
    if (clean.length <= 70) detail = clean;
    else detail = clean.slice(0, 70).trimEnd() + "…";
  }
  return detail ? `${agePart}${title} — ${detail}` : `${agePart}${title}`;
}

export function computeEndingCallbacks({ seed, timelineEntries, preferredAgeMin = 10, max = 2 }) {
  const rng = mulberry32(hash32(`${seed}|endingCallbacks`));
  const t = Array.isArray(timelineEntries) ? timelineEntries : [];

  const formatted = uniq(
    t.map(formatTimelineCallback).filter(Boolean)
  );

  // If timeline is empty, return safe fallbacks.
  if (formatted.length === 0) {
    return {
      callback1: "A small moment you thought they'd forget — they didn't.",
      callback2: "One hard season you both survived — and carried forward.",
      callback3: ""
    };
  }

  const parsed = formatted.map(line => {
    const m = /^Age\s+(\d+):/.exec(line);
    const age = m ? Number(m[1]) : NaN;
    return { line, age };
  });

  const older = parsed.filter(p => Number.isFinite(p.age) && p.age >= preferredAgeMin).map(p => p.line);
  const younger = parsed.filter(p => !Number.isFinite(p.age) || p.age < preferredAgeMin).map(p => p.line);

  shuffleInPlace(rng, older);
  shuffleInPlace(rng, younger);

  const out = [];
  // Prefer older moments; backfill with younger.
  for (const line of older) {
    if (out.length >= max) break;
    out.push(line);
  }
  for (const line of younger) {
    if (out.length >= max) break;
    out.push(line);
  }

  return {
    callback1: out[0] || "",
    callback2: out[1] || "",
    callback3: out[2] || ""
  };
}

// A small, stable set of "ending archetypes".
// Archetype is a *voice* layer: it should never contradict section facts.
export function computeEndingArchetype({
  seed,
  childName,
  parentRole,
  stats = {},
  love = 0,
  stress = 0,
  money = 0,
  retirementSavings = 0,
  harmCount = 0,
  tags = null,
  timelineEntries = []
}) {
  const rng = mulberry32(hash32(`${seed}|endingArchetype`));
  const tagSet = normTags(tags);
  const roleTitle = toTitleParentRole(parentRole);

  const INT = Number(stats.intelligence || stats.INT || 0);
  const EMP = Number(stats.empathy || stats.EMP || 0);
  const DIS = Number(stats.discipline || stats.DIS || 0);
  const CON = Number(stats.confidence || stats.CON || 0);

  const loveN = clamp(love, 0, 100);
  const stressN = clamp(stress, 0, 100);

  // Quick helper tiers (loose on purpose)
  const loveTier = loveN >= 75 ? "high" : loveN >= 45 ? "mid" : "low";
  const stressTier = stressN >= 60 ? "high" : stressN >= 30 ? "mid" : "low";
  const moneyTier = money >= 80000 ? "high" : money >= 0 ? "mid" : "low";

  const petNoun = detectPetNoun(timelineEntries, tagSet);

  // Determine archetype id using simple, legible rules.
  let id = "EVERYDAY_EPIC";
  let tone = "bittersweet";

  if (harmCount >= 3 && loveTier === "low") { id = "POLISHED_WOUND"; tone = "tragic"; }
  else if (harmCount >= 2 && stressTier === "high") { id = "SURVIVOR_WITH_JOKES"; tone = "darkComedy"; }
  else if (moneyTier === "high" && loveTier === "low") { id = "GOLDEN_CAGE"; tone = "bittersweet"; }
  else if (Number.isFinite(INT) && INT >= 88 && loveTier !== "high" && (EMP <= 8 || tagSet.has("BOND_LOW"))) { id = "LONELY_PRODIGY"; tone = "quiet"; }
  else if (loveTier === "high" && (DIS >= 12 || tagSet.has("DIS_HIGH") || tagSet.has("DIS_VERYHIGH")) && stressTier !== "high") { id = "STEEL_ORCHID"; tone = "heroic"; }
  else if (loveTier === "high" && (EMP >= 12 || tagSet.has("EMP_HIGH") || tagSet.has("EMP_VERYHIGH"))) { id = "GENTLE_GIANT"; tone = "warm"; }
  else if (stressTier === "high" && (tagSet.has("PLAY_HIGH") || tagSet.has("TRAVEL_A_LOT"))) { id = "CHAOS_DIPLOMAT"; tone = "comedy"; }
  else if (tagSet.has("COUNSELOR_USED") || tagSet.has("HEALING_SELF_SOME") || tagSet.has("HEALING_PARTNER_SOME")) { id = "WOUNDED_HEALER"; tone = "healing"; }
  else if ((CON >= 50 || tagSet.has("CONF_VERYHIGH")) && (DIS <= 6 || tagSet.has("DIS_LOW")) && (tagSet.has("TRAVEL_SOME") || tagSet.has("TRAVEL_A_LOT"))) { id = "WILD_CARD"; tone = "comedy"; }

  const BANK = {
    STEEL_ORCHID: {
      title: [
        "Steel Orchid",
        "The Calm Builder",
        "The Quiet Hero",
        "The One Who Shows Up"
      ],
      hook: [
        "{childName} grew up in a house where love wasn't a mood—it was a practice.",
        "The story isn't that everything went right. It's that repair was normal.",
        "They learned the rare skill of being steady without being cold."
      ],
      truth: [
        "When people ask how they're so grounded, they shrug. The truth is: someone stayed.",
        "Their adulthood isn't flashy. It's sturdy. That’s the flex."
      ],
      stinger: [
        "Generational calm is a rare drop. You got it.",
        "Some kids inherit money. This one inherited safety.",
        "They call you when life breaks. Not because they need saving—because they trust you."
      ]
    },

    GENTLE_GIANT: {
      title: [
        "Gentle Giant",
        "The Listener",
        "Soft Power",
        "The Kind One With Teeth"
      ],
      hook: [
        "{childName} learned early that feelings can exist without punishment.",
        "You taught them that tenderness and strength aren't opposites.",
        "They grew up fluent in empathy—and still able to say “no.”"
      ],
      truth: [
        "They became the person friends call at 2AM—because they actually help.",
        "They carry warmth the way some people carry status: quietly, constantly."
      ],
      stinger: [
        "They didn’t harden. They learned boundaries.",
        "Your best legacy was the way they treat themselves.",
        "Kindness stayed—without turning into self-erasure."
      ]
    },

    CHAOS_DIPLOMAT: {
      title: [
        "Chaos Diplomat",
        "The Peacekeeper With Snacks",
        "The Emotional Firefighter",
        "The One Who Can Handle A Lot"
      ],
      hook: [
        "{childName} grew up in weather, not climate: some sunny days, some storms.",
        "Life was loud. They learned to translate noise into meaning.",
        "They learned to find humor without using it as a hiding place."
      ],
      truth: [
        "They can walk into a room that's tense and leave it softer.",
        "They learned calm later—but they learned it on purpose."
      ],
      stinger: [
        "They survived hard mode and still laugh on purpose.",
        "Their superpower is turning mess into a plan.",
        "They can make a bad day smaller. That's rare."
      ]
    },

    GOLDEN_CAGE: {
      title: [
        "Golden Cage",
        "The Successful Stranger",
        "The Shiny Life With Quiet Rooms",
        "Achievement Armor"
      ],
      hook: [
        "{childName} built a life that looks impressive from the outside.",
        "They learned how to win—then had to learn how to feel.",
        "They got good at success faster than they got good at rest."
      ],
      truth: [
        "Somewhere under the achievements, they still want to be known.",
        "They can buy comfort. They're still learning belonging."
      ],
      stinger: [
        "Money can buy silence. It can't buy repair.",
        "They have receipts for everything—except the conversations they wanted.",
        "They learned to stop proving and start living."
      ]
    },

    LONELY_PRODIGY: {
      title: [
        "Lonely Prodigy",
        "Bright Mind, Quiet Heart",
        "The Gifted Kid Who Kept Going",
        "Brains Without A Map"
      ],
      hook: [
        "{childName} was always sharp. The world rewarded that fast.",
        "They learned to be competent before they learned to be held.",
        "They grew up carrying a lot alone—and calling it independence."
      ],
      truth: [
        "They can solve problems. Letting people in is the harder skill.",
        "They look confident. Inside, they're still learning safety."
      ],
      stinger: [
        "Being impressive is not the same as being okay.",
        "They’re learning closeness like a second language.",
        "They didn’t need more pressure. They needed more presence."
      ]
    },

    WOUNDED_HEALER: {
      title: [
        "Wounded Healer",
        "The Cycle Breaker",
        "Repair Specialist",
        "The One Who Learned On Purpose"
      ],
      hook: [
        "The early chapters were complicated. The later chapters were intentional.",
        "{childName} didn't get an easy start. They got a real one.",
        "They learned healing like a craft: slow, specific, earned."
      ],
      truth: [
        "They became someone who can name a feeling—and then do something with it.",
        "They turned pain into wisdom without making it their whole identity."
      ],
      stinger: [
        "They stopped repeating the pattern. That’s a plot twist.",
        "They learned to forgive without forgetting themselves.",
        "They made tenderness feel safe again."
      ]
    },

    SURVIVOR_WITH_JOKES: {
      title: [
        "Survivor With Jokes",
        "Hard Mode Comedian",
        "The One Who Made It Anyway",
        "Resilience (Unpaid Internship)"
      ],
      hook: [
        "{childName} learned survival before comfort. That's not fair. It's true.",
        "They grew up fast. Then, years later, they slowed down on purpose.",
        "They learned to laugh as a life raft—and eventually as joy."
      ],
      truth: [
        "Their boundaries are strong because they had to be.",
        "They didn’t get a clean ending. They built a true one."
      ],
      stinger: [
        "They made it out. That counts more than perfection.",
        "They chose 'better' even when 'easy' was right there.",
        "They’re still here. Still trying. Still worthy."
      ]
    },

    POLISHED_WOUND: {
      title: [
        "Polished Wound",
        "The Distant Orbit",
        "Successful, But Far",
        "The One Who Left Quietly"
      ],
      hook: [
        "Distance didn't start at 18. It started in small moments.",
        "{childName} learned to be careful. Sometimes careful looks like cold.",
        "They built a life where no one gets to hurt them twice."
      ],
      truth: [
        "They keep contact in the ways that feel safe, not chaotic.",
        "They’re not cruel. They’re protecting something tender."
      ],
      stinger: [
        "Boundaries were the first home they built for themselves.",
        "Love without safety becomes stress. They refused to keep paying that price.",
        "Maybe it softens later. Maybe it doesn’t. Either way: they chose survival."
      ]
    },

    WILD_CARD: {
      title: [
        "Wild Card",
        "Spark With A Steering Wheel",
        "Chaos With Confidence",
        "The Main Character (Respectfully)"
      ],
      hook: [
        "{childName} learned to take up space—and then learned when to share it.",
        "They tried a lot of lives on like jackets until one fit.",
        "They collected stories the way some people collect trophies."
      ],
      truth: [
        "They’re not predictable. They’re alive.",
        "They grew into someone who can fail, laugh, and try again."
      ],
      stinger: [
        "The world is bigger because they keep exploring it.",
        "They turned freedom into a skill, not an excuse.",
        "Somehow, they make chaos look like art."
      ]
    },

    EVERYDAY_EPIC: {
      title: [
        "Everyday Epic",
        "A Real Human",
        "The Surprisingly Okay Adult",
        "Quietly Becoming"
      ],
      hook: [
        "The ending isn't a single twist. It's a mosaic of ordinary choices.",
        "{childName} didn't become perfect. They became real.",
        "Some years were messy. Some years were gentle. All of it counted."
      ],
      truth: [
        "They kept growing after 18. That’s the real epilogue.",
        "They carry pieces of you forward—and leave some behind."
      ],
      stinger: [
        "Parenting echoes longer than you expect.",
        "The story doesn’t end. It just changes narrators.",
        "They are flawed, capable, and unmistakably themselves."
      ]
    }
  };

  const bank = BANK[id] || BANK.EVERYDAY_EPIC;

  // A couple of micro-personalizations without implying anything UI can't prove.
  const hook = pick(rng, bank.hook, "").replace("{childName}", childName || "your child").replace("{parentRole}", roleTitle);
  const truth = pick(rng, bank.truth, "").replace("{childName}", childName || "your child").replace("{parentRole}", roleTitle);
  const stinger = pick(rng, bank.stinger, "").replace("{childName}", childName || "your child").replace("{parentRole}", roleTitle);

  const title = pick(rng, bank.title, "Everyday Epic");

  // Optional tiny pet flourish (non-blocking)
  const petFlourish = petNoun
    ? pick(rng, [
        `Also: at least one ${petNoun} is still convinced it runs the household.`,
        `Somewhere, a ${petNoun} still believes it is the main character.`,
        `The ${petNoun} era left its mark. (It always does.)`
      ], "")
    : "";

  return { id, tone, title, hook, truth, stinger, petFlourish };
}

export function computeEndingBeatLines({
  seed,
  childName,
  parentRole,
  stats = {},
  love = 0,
  stress = 0,
  money = 0,
  retirementSavings = 0,
  harmCount = 0,
  tags = null,
  timelineEntries = []
}) {
  const rng = mulberry32(hash32(`${seed}|endingBeats`));
  const tagSet = normTags(tags);
  const roleTitle = toTitleParentRole(parentRole);
  const petNoun = detectPetNoun(timelineEntries, tagSet);

  const beats = [];

  // Beats are short and "shown", not abstract moralizing.
  if (tagSet.has("TRAVEL_A_LOT")) {
    beats.push("Passport stamps became proof that wonder is real—and that fear doesn't get to be the boss forever.");
  } else if (tagSet.has("TRAVEL_SOME")) {
    beats.push("A few trips were enough to teach them: the world is bigger than one hard week.");
  }

  if (tagSet.has("COUNSELOR_USED") || tagSet.has("COUNSELING_USED")) {
    beats.push("They learned to ask for help before breaking—and stopped calling that weakness.");
  }

  if (tagSet.has("COMMUNITY_GIVER")) {
    beats.push("They give quietly, without needing to be the hero. It's a habit now.");
  }

  if (tagSet.has("PET_PRESENT") || tagSet.has("PET_YES")) {
    const noun = petNoun || "pet";
    beats.push(`Care showed up in daily rituals: food bowls, little walks, and ${noun}-level devotion.`);
  }

  if (tagSet.has("DEBT_HIGH") || tagSet.has("MONEY_NEGATIVE")) {
    beats.push("Money stress was a thundercloud in the house. Later, they learned to build shelter—and call it a plan.");
  }

  if (tagSet.has("PHONE_LONG")) {
    beats.push("Screens helped them cope. Then they learned the harder skill: being bored without panicking.");
  }

  if (tagSet.has("HARSH_MANY")) {
    beats.push("They learned to read rooms early. Later, they learned they don't have to.");
  }

  if (tagSet.has("BOND_HIGH")) {
    beats.push(`They still remember the way you looked at them when they did something small and brave. That stayed.`);
  }

  if (tagSet.has("STUDY_DEEP") || tagSet.has("STUDY_HEAVY")) {
    beats.push("They watched you learn on purpose. Now they treat growth like a verb, not a personality trait.");
  }

  if (tagSet.has("PLAY_HIGH")) {
    beats.push("Joy wasn't an emergency break—it was part of the routine. That taught them how to rest.");
  }


  // School context (adds specificity without needing UI changes)
  if (tagSet.has("SCHOOL_PRIVATE")) {
    beats.push("Opportunity came with pressure. They learned to carry both, then set the extra down.");
  } else if (tagSet.has("SCHOOL_HOMESCHOOL")) {
    beats.push("Home was a classroom. Some lessons were tender, some were loud—but it was personal.");
  } else if (tagSet.has("SCHOOL_PUBLIC")) {
    beats.push("They learned to navigate a bigger world early—hallways, cliques, and kindness under fluorescent lights.");
  }

  // Support systems
  if (tagSet.has("TUTOR_HEAVY")) {
    beats.push("Help wasn't shame—it was strategy. They learned to reach for it before drowning.");
  } else if (tagSet.has("TUTOR_SOME")) {
    beats.push("A tutor showed up like a lantern: not magic, just light in the right place.");
  }

  if (tagSet.has("DOCTOR_USED")) {
    beats.push("They learned to take the body seriously: checkups, sleep, and the humility of asking a professional.");
  }

  if (tagSet.has("FAITH_ACTIVE")) {
    beats.push("Faith was a community more than a rulebook—hands on shoulders, meals after bad weeks, songs in the dark.");
  }

  if (tagSet.has("ACTIVITY_HEAVY")) {
    beats.push("Movement became medicine: sweat, breath, and a nervous system learning it's allowed to calm down.");
  }

  // Big-life social signal
  if (tagSet.has("PROM_ROYALTY")) {
    beats.push("Being seen felt good—and instead of getting cruel with it, they stayed human.");
  }

  // Relationship structure beats (non-judgmental)
  const loveN = clamp(love, 0, 100);
  if (tagSet.has("PARTNER_YES") && loveN >= 55) {
    beats.push("They learned to build a home with another person—two imperfect systems learning to cooperate.");
  } else if (tagSet.has("PARTNER_NO") && loveN >= 55) {
    beats.push("They learned solitude without loneliness: quiet nights, real friends, and a life that still felt full.");
  }

  // Hard years / disasters (if the run had any crisis-type timeline entries)
  const hadDisaster = (Array.isArray(timelineEntries) ? timelineEntries : []).some((e) => {
    const t = String(e?.title || "").toLowerCase();
    const k = String(e?.kind || "").toLowerCase();
    return (
      k.includes("disaster") ||
      k.includes("crisis") ||
      t.includes("wildfire") ||
      t.includes("evac") ||
      t.includes("hurricane") ||
      t.includes("earthquake")
    );
  });
  if (hadDisaster) {
    beats.push("A bad year taught them this: life can change fast. They can, too.");
  }

  // Safety/scars beat
  if (harmCount === 0 && loveN >= 55) {
    beats.push("They grew up safe enough to be brave—because fear wasn't the default setting at home.");
  } else if (harmCount >= 2) {
    beats.push("They carry scars. Not as an identity—just as proof they lived through something and kept going.");
  }

  // If none fired, give a gentle general beat.
  if (beats.length === 0) {
    beats.push("The small choices accumulated into a life. Not perfect. Real.");
  }

  // Pick up to 3 unique beats deterministically.
  const unique = uniq(beats);
  shuffleInPlace(rng, unique);

  const picked = unique.slice(0, 3);
  return {
    beat1: picked[0] || "",
    beat2: picked[1] || "",
    beat3: picked[2] || ""
  };
}

export function computeSignatureFromStats({ stats = {}, tags = null, seed = "sig" }) {
  const rng = mulberry32(hash32(`${seed}|signatureFromStats`));
  const tagSet = normTags(tags);
  const INT = Number(stats.intelligence || 0);
  const EMP = Number(stats.empathy || 0);
  const DIS = Number(stats.discipline || 0);
  const CON = Number(stats.confidence || 0);

  const statList = [
    { key: "INT", label: "Intelligence", value: INT },
    { key: "EMP", label: "Empathy", value: EMP },
    { key: "DIS", label: "Discipline", value: DIS },
    { key: "CON", label: "Confidence", value: CON }
  ].slice().sort((a, b) => (b.value || 0) - (a.value || 0));

  const best = statList[0]?.key || "INT";
  const worst = statList[statList.length - 1]?.key || "CON";

  const STRENGTH = {
    INT: [
      "solving problems without panicking",
      "learning fast and teaching gently",
      "seeing patterns other people miss",
      "turning chaos into a plan"
    ],
    EMP: [
      "listening like it matters",
      "making people feel safe",
      "reading the room and choosing kindness anyway",
      "noticing who’s being left out"
    ],
    DIS: [
      "showing up consistently",
      "doing the boring things that make life work",
      "finishing what they start",
      "building routines that protect peace"
    ],
    CON: [
      "taking up space without apology",
      "trying again in public",
      "speaking clearly under pressure",
      "leading when it’s scary"
    ]
  };

  const SHADOW = {
    INT: [
      "overthinking until sleep disappears",
      "using logic to dodge feelings",
      "getting impatient with “obvious” things",
      "turning problems into identity"
    ],
    EMP: [
      "people-pleasing on autopilot",
      "taking responsibility for everyone’s mood",
      "avoiding conflict until it stacks",
      "mistaking caretaking for love"
    ],
    DIS: [
      "rigidity when life gets messy",
      "judging themselves for resting",
      "thinking worth equals productivity",
      "getting stuck in “should”"
    ],
    CON: [
      "reacting fast when hurt",
      "bravado as armor",
      "leaping before checking the landing",
      "picking intensity over stability"
    ]
  };

  return {
    bestStatKey: best,
    worstStatKey: worst,
    signatureStrength: pick(rng, STRENGTH[best] || STRENGTH.INT, "solving problems"),
    workShadow: pick(rng, SHADOW[worst] || SHADOW.CON, "overcommitting")
  };
}