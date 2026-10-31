// Middle School One-Offs Pack (Ages 10–13)
// - Each event has a 3% per-year chance (rolled at most once per year selection).
// - Each event can trigger at most once per run.
// - Events are NOT mutually exclusive across years (you can see different ones across ages 10–13).
// - These are explicitly separate from teen-only scenarios (ages 14–18).

import { getJobById } from "./jobSystem";

export const MIDDLE_SCHOOL_ONE_OFF_PREFIX = "ms_oneoff_";

function safeLower(x) {
  return String(x || "").trim().toLowerCase();
}

function rand01(rng) {
  try {
    if (rng && typeof rng.nextFloat === "function") return rng.nextFloat();
  } catch {}
  return Math.random();
}

function pick(rng, arr) {
  const a = Array.isArray(arr) ? arr : [];
  if (a.length === 0) return "";
  try {
    if (rng && typeof rng.pick === "function") return rng.pick(a);
  } catch {}
  const idx = Math.floor(Math.random() * a.length);
  return a[Math.max(0, Math.min(a.length - 1, idx))];
}

function getChildAge(state) {
  const a =
    state?.currentYear ??
    state?.childAge ??
    state?.age ??
    state?.childProfile?.age ??
    state?.kidAge ??
    null;
  const n = Number(a);
  return Number.isFinite(n) ? n : null;
}

function getKidName(state) {
  const n =
    state?.childName ??
    state?.childProfile?.name ??
    state?.kidName ??
    state?.name ??
    "your kid";
  return String(n || "your kid");
}

function getKidGenderLabel(state) {
  const raw =
    state?.childAvatarGender ??
    state?.childProfile?.gender ??
    state?.childProfile?.sex ??
    state?.childProfile?.sexAtBirth ??
    state?.childGender ??
    state?.kidGender ??
    "";
  return safeLower(raw);
}

function isGirlByLabel(state) {
  const g = getKidGenderLabel(state);
  // conservative: only trigger period scenario when label clearly indicates girl/female
  return (
    g.includes("girl") ||
    g.includes("female") ||
    g.includes("woman") ||
    g === "f"
  );
}

function isForcedScenarioId(id) {
  if (typeof window === "undefined") return false;
  try {
    const qs = new URLSearchParams(window.location.search || "");
    const forced = (qs.get("forceScenario") || qs.get("forceEvent") || "").trim();
    return forced === id;
  } catch {
    return false;
  }
}

function ensureOneOffs(state) {
  if (!state) return {};
  if (!state.oneOffs || typeof state.oneOffs !== "object") state.oneOffs = {};
  if (!state.oneOffs.middleSchoolOneOffFlags || typeof state.oneOffs.middleSchoolOneOffFlags !== "object") {
    state.oneOffs.middleSchoolOneOffFlags = {};
  }
  if (!Array.isArray(state.oneOffs.middleSchoolOneOffHistory)) {
    state.oneOffs.middleSchoolOneOffHistory = [];
  }
  return state.oneOffs;
}

function addStat(state, key, delta) {
  const d = Number(delta);
  if (!Number.isFinite(d) || d === 0) return;

  if (state?.stats && typeof state.stats === "object") {
    const cur = Number(state.stats[key]);
    state.stats[key] = (Number.isFinite(cur) ? cur : 0) + d;
    return;
  }

  const curTop = Number(state?.[key]);
  state[key] = (Number.isFinite(curTop) ? curTop : 0) + d;
}

const AGE_MIN = 10;
const AGE_MAX = 13;
const CHANCE = 0.03;

function getJobCategory(job, jobId) {
  try {
    const fields = Array.isArray(job?.fields) ? job.fields.map((x) => String(x).toLowerCase()) : [];
    const id = String(jobId || job?.id || job?.jobId || '').toLowerCase();
    const has = (k) => fields.includes(k);
    if (has('health')) return 'health';
    if (has('education')) return 'education';
    if (has('business')) return 'business';
    if (has('arts')) return 'arts';
    if (has('law') || has('policy') || has('law_policy')) return 'law_policy';
    if (has('stem') || id.includes('software') || id.includes('engineer') || id.includes('developer') || id.includes('science')) return 'stem';
    if (id.includes('retail') || id.includes('food') || id.includes('service') || has('service')) return 'service';
    if (id.includes('electrician') || id.includes('plumber') || id.includes('mechanic') || has('trades')) return 'trades';
    if (id.includes('stay_at_home_parent') || id.includes('homemaker')) return 'stay_home';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

const MS_ONE_OFF_EVENTS = [
  {
    key: "deodorant",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}deodorant`,
    title: "The Deodorant Negotiation",
    prompt: (kid, state, rng) => {
      const lines = [
        `You open ${kid}'s backpack and get hit by a smell that can only be described as "gym class's final form."`,
        `The room instantly becomes a science experiment.`,
        `${kid} says, very confidently: "It's not *bad*. It's… *natural*."`,
        `Somewhere, a sock quietly files for independence.`
      ];
      return (
        `${pick(rng, lines)}\n\n` +
        `They're starting puberty, and hygiene just became a sensitive topic—like defusing a bomb made of feelings.`
      );
    },
    choices: [
      {
        id: "support",
        label: "Handle it kindly (deodorant trip + zero shaming)",
        result: (kid) =>
          `You keep your face neutral like a professional diplomat.\n\n` +
          `You explain bodies are changing, sweat is normal, and deodorant is just a tool—not a moral judgment.\n\n` +
          `They don't feel attacked… so they don't have to defend the stink with their life.`,
        deltas: { love: +2, confidence: +1, stress: +2 },
      },
      {
        id: "crackdown",
        label: "Roast them (maximum damage, minimum deodorant)",
        result: (kid) =>
          `You make a joke. Then another. Then another.\n\n` +
          `${kid} laughs… but it's the kind of laugh that means "I will remember this forever."\n\n` +
          `Congrats: you achieved comedy. At the cost of trust.`,
        deltas: { love: -3, confidence: -2, stress: +3 },
      },
      {
        id: "ignore",
        label: "Ignore it (open a window and pray)",
        result: (kid) =>
          `You pretend nothing happened.\n\n` +
          `Which teaches ${kid} that this topic is either taboo or unimportant.\n\n` +
          `The smell remains. Your stress does too.`,
        deltas: { love: -2, confidence: 0, stress: +3 },
      },
    ],
  },

  {
    key: "first_period",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}first_period`,
    title: "The First Period Emergency Meeting",
    isEligible: (state) => isGirlByLabel(state),
    prompt: (kid) =>
      `${kid} knocks on your door like they're delivering bad news to a king.\n\n` +
      `They whisper: "Um… I think something happened."\n\n` +
      `It takes a second, then it clicks: this is a first period moment. They look terrified—like their body just changed the rules without telling them.`,
    choices: [
      {
        id: "support",
        label: "Be calm and helpful (supplies + reassurance, no weirdness)",
        result: (kid) =>
          `You keep your voice steady.\n\n` +
          `You tell them it's normal, they're not in trouble, and you've got them.\n\n` +
          `You get supplies, explain the basics, and make it clear: their body isn't an enemy.\n\n` +
          `They exhale like they've been holding their breath for an hour.`,
        deltas: { love: +4, confidence: +3, stress: +2 },
      },
      {
        id: "crackdown",
        label: "Act grossed out / scold them (make it shameful)",
        result: (kid) =>
          `You react like this is a crime scene.\n\n` +
          `${kid} instantly shrinks—like their body is something to hide.\n\n` +
          `You didn't just make today harder. You made *future conversations* harder.`,
        deltas: { love: -5, confidence: -4, stress: +5 },
      },
      {
        id: "ignore",
        label: "Pretend it's fine (leave supplies and avoid talking)",
        result: (kid) =>
          `You hand them supplies and rush the moment away.\n\n` +
          `They learn: "I can't talk about this here."\n\n` +
          `Nothing explodes… but something closes.`,
        deltas: { love: -3, confidence: 0, stress: +4 },
      },
    ],
  },

  {
    key: "acne",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}acne`,
    title: "The Pimple Summit",
    prompt: (kid, state, rng) => {
      const lines = [
        `${kid} stands in front of the mirror like it's a courtroom.`,
        `They lean in and gasp, like their forehead personally betrayed them.`,
        `They say: "I have… a situation." In the tone of someone reporting a meteor.`,
      ];
      return (
        `${pick(rng, lines)}\n\n` +
        `It's acne. It's normal. It also feels like the end of the world when you're 12.`
      );
    },
    choices: [
      {
        id: "support",
        label: "Help them gently (simple routine + reassurance)",
        result: (kid) =>
          `You don't dismiss it. You also don't panic.\n\n` +
          `You help them pick a basic routine and remind them their face isn't their value.\n\n` +
          `${kid} feels less alone—and way less doomed.`,
        deltas: { love: +2, confidence: +2, stress: +1 },
      },
      {
        id: "crackdown",
        label: "Make jokes (they'll \"get over it,\" right?)",
        result: (kid) =>
          `You tease them about it.\n\n` +
          `${kid} laughs once, then avoids mirrors and avoids you.\n\n` +
          `Small moment. Big bruise.`,
        deltas: { love: -3, confidence: -2, stress: +2 },
      },
      {
        id: "ignore",
        label: "Ignore it (it's \"not a big deal\")",
        result: (kid) =>
          `You wave it off.\n\n` +
          `${kid} hears: "Your feelings are inconvenient."\n\n` +
          `They stop bringing you the small stuff—which is where trust is built.`,
        deltas: { love: -2, confidence: 0, stress: +2 },
      },
    ],
  },

  {
    key: "growth_spurt",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}growth_spurt`,
    title: "The Long‑Limbed Era",
    prompt: (kid) =>
      `${kid} has grown two inches overnight.\n\n` +
      `Now their knees collide with tables like it's a hobby.\n\n` +
      `They trip over their own feet, knock over a glass, and mutter: "My body is trolling me."\n\n` +
      `They're embarrassed, frustrated, and pretending they aren't.`,
    choices: [
      {
        id: "support",
        label: "Be kind (new shoes + humor *with* them, not *at* them)",
        result: (kid) =>
          `You treat it like normal growing pains, not a character flaw.\n\n` +
          `You help them adjust—shoes, clothes, a little patience.\n\n` +
          `${kid} feels safer being awkward in front of you, which is… basically gold.`,
        deltas: { love: +2, confidence: +1, stress: +2 },
      },
      {
        id: "crackdown",
        label: "Get mad about the mess (clumsy = \"careless,\" apparently)",
        result: (kid) =>
          `You snap at them for breaking something.\n\n` +
          `${kid} takes it personally, because everything at this age is personal.\n\n` +
          `They don't get more coordinated. They just get more ashamed.`,
        deltas: { love: -3, confidence: -2, stress: +3 },
      },
      {
        id: "ignore",
        label: "Ignore it (they'll figure out their new limbs alone)",
        result: (kid) =>
          `You let it pass without comment.\n\n` +
          `${kid} keeps struggling quietly.\n\n` +
          `It's not a crisis… but it's a missed chance to be their safe place.`,
        deltas: { love: -2, confidence: 0, stress: +2 },
      },
    ],
  },

  {
    key: "voice_crack",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}voice_crack`,
    title: "Voice Crack: The Musical",
    prompt: (kid, state, rng) => {
      const lines = [
        `${kid} says "hello" and their voice briefly turns into a squeaky door hinge.`,
        `${kid} tries to speak normally and accidentally invents a new sound effect.`,
        `${kid} starts a sentence confidently… and ends it in a completely different octave.`,
      ];
      return (
        `${pick(rng, lines)}\n\n` +
        `They freeze. Their eyes say: "Please erase me from existence."`
      );
    },
    choices: [
      {
        id: "support",
        label: "Normalize it (no teasing, just reassurance)",
        result: (kid) =>
          `You keep it casual: "Yep. Puberty. It's weird. You're normal."\n\n` +
          `${kid} unclenches.\n\n` +
          `They don't need you to be funny. They need you to be safe.`,
        deltas: { love: +2, confidence: +2, stress: +1 },
      },
      {
        id: "crackdown",
        label: "Mimic it (you become the worst audience member)",
        result: (kid) =>
          `You repeat the sound.\n\n` +
          `${kid} laughs… then stops talking around you for the rest of the day.\n\n` +
          `You got a joke. They got a scar.`,
        deltas: { love: -4, confidence: -3, stress: +3 },
      },
      {
        id: "ignore",
        label: "Ignore it (pretend it didn't happen)",
        result: (kid) =>
          `You act like nothing happened.\n\n` +
          `${kid} is still spiraling internally.\n\n` +
          `Sometimes "nothing" is not the comfort it sounds like.`,
        deltas: { love: -2, confidence: 0, stress: +2 },
      },
    ],
  },

  {
    key: "first_crush",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}first_crush`,
    title: "Classified Crush",
    prompt: (kid) =>
      `${kid} casually says: "So… hypothetically… if someone liked someone… what would they do?"\n\n` +
      `They refuse to make eye contact.\n\n` +
      `This is not hypothetical. This is a first crush in a trench coat.`,
    choices: [
      {
        id: "support",
        label: "Be warm and discreet (advice + privacy)",
        result: (kid) =>
          `You keep it gentle: be kind, be respectful, don't pressure anyone, and it's okay to feel awkward.\n\n` +
          `${kid} relaxes because you didn't turn it into entertainment.\n\n` +
          `They trust you with something tender. That's huge.`,
        deltas: { love: +3, confidence: +2, stress: +1 },
      },
      {
        id: "crackdown",
        label: "Interrogate and tease (like a talk show host)",
        result: (kid) =>
          `You start asking questions at a rate that should require a permit.\n\n` +
          `${kid} turns bright red and immediately regrets speaking.\n\n` +
          `They will never bring you romance-adjacent feelings again. Congrats.`,
        deltas: { love: -4, confidence: -2, stress: +3 },
      },
      {
        id: "ignore",
        label: "Dismiss it (\"you're too young for that\")",
        result: (kid) =>
          `You shut it down.\n\n` +
          `${kid} learns their feelings are inconvenient.\n\n` +
          `They don't stop feeling them. They just stop sharing them.`,
        deltas: { love: -3, confidence: 0, stress: +3 },
      },
    ],
  },

  {
    key: "school_dance",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}school_dance`,
    title: "The Dance of a Thousand Sweat Beads",
    prompt: (kid) =>
      `${kid} brings home a school dance flyer like it's a legal summons.\n\n` +
      `They stare at it and whisper: "Everyone's going to be there."\n\n` +
      `Then, softer: "What if I'm… weird?"\n\n` +
      `Welcome to middle school: where standing near a wall is an Olympic sport.`,
    choices: [
      {
        id: "support",
        label: "Make a plan (friends + exit strategy + reassurance)",
        result: (kid) =>
          `You help them strategize: go with friends, show up for a bit, leave if it's too much.\n\n` +
          `You remind them that awkward isn't fatal.\n\n` +
          `${kid} feels braver because you didn't minimize them.`,
        deltas: { love: +2, confidence: +2, stress: +2 },
      },
      {
        id: "crackdown",
        label: "Force it (\"you're going and that's final\")",
        result: (kid) =>
          `You turn it into a command.\n\n` +
          `${kid} doesn't feel supported. They feel controlled.\n\n` +
          `Now it's not just a dance. It's a battle.`,
        deltas: { love: -3, confidence: -2, stress: +4 },
      },
      {
        id: "ignore",
        label: "Ignore it (they'll figure it out alone)",
        result: (kid) =>
          `You don't engage.\n\n` +
          `${kid} interprets that as: "You don't have my back."\n\n` +
          `They might still go. But they won't feel held.`,
        deltas: { love: -2, confidence: 0, stress: +3 },
      },
    ],
  },

  {
    key: "group_chat",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}group_chat`,
    title: "The Screenshot Apocalypse",
    prompt: (kid) =>
      `${kid} storms in like a tiny lawyer who just found evidence.\n\n` +
      `"Someone screenshotted it," they say. "It's *everywhere*."\n\n` +
      `The crime? A group chat message taken the worst possible way.\n\n` +
      `They're devastated. Middle school drama hits like meteorites.`,
    choices: [
      {
        id: "support",
        label: "Coach them through it (repair + boundaries + calm)",
        result: (kid) =>
          `You help them slow down and breathe.\n\n` +
          `You talk through what happened, what to apologize for (if needed), and what boundaries to set.\n\n` +
          `${kid} feels less trapped by the social tornado.`,
        deltas: { love: +2, confidence: +1, stress: +3 },
      },
      {
        id: "crackdown",
        label: "Confiscate the phone (instant war)",
        result: (kid) =>
          `You take the phone.\n\n` +
          `${kid} doesn't feel protected—they feel socially exiled.\n\n` +
          `The drama may reduce… but so does trust.`,
        deltas: { love: -3, confidence: -1, stress: +4 },
      },
      {
        id: "ignore",
        label: "Wave it off (\"it's not a big deal\")",
        result: (kid) =>
          `You minimize it.\n\n` +
          `${kid} hears: "Your pain is silly."\n\n` +
          `They stop coming to you for emotional storms—exactly when they need you most.`,
        deltas: { love: -3, confidence: 0, stress: +3 },
      },
    ],
  },

  {
    key: "pe_changing_room",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}pe_changing_room`,
    title: "Gym Class: The Dreaded Changing Room",
    prompt: (kid) =>
      `${kid} suddenly "doesn't feel good" every time P.E. happens.\n\n` +
      `After a few suspiciously-timed stomachaches, they finally admit it:\n\n` +
      `They hate the changing room. Their body feels different, they feel exposed, and they don't know how to say it without melting into the floor.`,
    choices: [
      {
        id: "support",
        label: "Take it seriously (plan + options + advocacy if needed)",
        result: (kid) =>
          `You treat it like a real problem, not drama.\n\n` +
          `You talk through options: different clothes, private changing strategies, a calm conversation with the teacher if needed.\n\n` +
          `${kid} feels protected *and* respected. The dread softens.`,
        deltas: { love: +3, confidence: +2, stress: +2 },
      },
      {
        id: "crackdown",
        label: "Call them dramatic (and force compliance)",
        result: (kid) =>
          `You push them through it.\n\n` +
          `${kid} learns that discomfort is something to swallow, not something you can bring to you.\n\n` +
          `They go to P.E. physically present—and emotionally alone.`,
        deltas: { love: -4, confidence: -3, stress: +4 },
      },
      {
        id: "ignore",
        label: "Ignore it (they'll \"get used to it\")",
        result: (kid) =>
          `You let it slide.\n\n` +
          `${kid} stays anxious, and the anxiety finds new places to live.\n\n` +
          `Nothing resolves. Everything simmers.`,
        deltas: { love: -2, confidence: 0, stress: +3 },
      },
    ],
  },

  {
    key: "am_i_normal",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}am_i_normal`,
    title: "The \"Am I Normal?\" Question",
    prompt: (kid, state, rng) => {
      const openers = [
        `${kid} lingers near you like they're about to ask for a loan.`,
        `${kid} says "can I ask you something" in the tone of a person defusing a bomb.`,
        `${kid} starts a sentence, stops, and then tries again like the words are slippery.`,
      ];
      return (
        `${pick(rng, openers)}\n\n` +
        `Then they finally blurt out:\n\n` +
        `"Is it normal to feel… weird? Like sweaty and awkward and mad for no reason?"\n\n` +
        `This is puberty: confusing, inconvenient, and extremely loud inside their head.`
      );
    },
    choices: [
      {
        id: "support",
        label: "Answer gently (facts + reassurance + no embarrassment)",
        result: (kid) =>
          `You keep it simple and kind: yes, it's normal. Bodies change. Emotions spike. None of it makes them broken.\n\n` +
          `You offer practical tips (sleep, food, deodorant, breaks) and emotional permission.\n\n` +
          `${kid} looks relieved—like you just handed them a map.`,
        deltas: { love: +3, confidence: +2, stress: +1 },
      },
      {
        id: "crackdown",
        label: "Make it weird (awkward jokes + discomfort)",
        result: (kid) =>
          `You get flustered and say something that lands like a wet paper bag.\n\n` +
          `${kid} decides they will now Google everything forever.\n\n` +
          `You didn't answer the question. You taught them you're not safe for it.`,
        deltas: { love: -4, confidence: -3, stress: +3 },
      },
      {
        id: "ignore",
        label: "Brush it off (\"you're fine, stop overthinking\")",
        result: (kid) =>
          `You dismiss it.\n\n` +
          `${kid} hears: "My feelings don't matter."\n\n` +
          `They stop asking questions—and start carrying confusion alone.`,
        deltas: { love: -3, confidence: 0, stress: +3 },
      },
    ],
  },
,
  {
    key: "take_to_work",
    id: `${MIDDLE_SCHOOL_ONE_OFF_PREFIX}take_to_work`,
    title: "Take Your Kid to Work Day",
    category: "career",
    // Chance: age 12 boosted, otherwise smaller but present
    chance: (state) => {
      const a = getChildAge(state);
      return a === 12 ? 0.18 : 0.08;
    },
    prompt: (kid, state, rng) => {
      const pc = state?.playerCareer || null;
      const hasPartner = (state?.householdType === 'two');
      const partnerC = hasPartner ? (state?.partnerCareer || null) : null;
      const usePartner = !pc?.jobId && partnerC?.jobId;
      const career = usePartner ? partnerC : pc;
      const jobId = career?.jobId || null;
      const job = jobId ? getJobById(jobId) : null;
      const levelIdx = Number(career?.jobLevelIndex || 0);
      const levelTitle = job?.levels?.[levelIdx]?.title || job?.title || (job ? 'their job' : 'Home Ops HQ');
      const cat = getJobCategory(job, jobId);

      const L = (arr) => (Array.isArray(arr) && arr.length ? arr : ["Today, the office is your stage and your kid is the main character."]);

      const PROMPTS = {
        health: [
          `${kid} gets a visitor badge and immediately starts whisper-checking people's heartbeats (politely).`,
          `A doctor says “stat”; ${kid} raises a hand and says “like, statistics?”` ,
          `${kid} calls hand sanitizer “the potion of adulthood.”`
        ],
        education: [
          `${kid} sits in tiny chairs and takes attendance for fun.`,
          `They correct a whiteboard typo and earn a mysterious teacher nod.`,
          `${kid} tapes a star to your shirt and declares you “line leader of life.”`
        ],
        stem: [
          `${kid} points at a server rack and says “that looks important; be nice to it.”`,
          `They call the prototype “a science pet” and honestly it tracks.`,
          `${kid} asks if your code has a bedtime.`
        ],
        business: [
          `A meeting begins. ${kid} slides snacks down the table like venture capital.`,
          `They network by complimenting everyone’s water bottle. It works.`,
          `${kid} hears “synergy” and glues two pencils together.`
        ],
        arts: [
          `${kid} puts on a lanyard and becomes Head of Vibes.`,
          `They whisper “wow” at a mood board like it’s a museum.`,
          `${kid} calls the editor “the story DJ.”`
        ],
        law_policy: [
          `${kid} asks “who makes the rules” and then asks “who makes *those* rules.”`,
          `They object to boredom. Overruled, but compelling.`,
          `${kid} declares themselves Junior Policy with a sticky-note badge.`
        ],
        service: [
          `${kid} learns the sacred art of the friendly hello and means it.`,
          `They organize napkins with alarming authority.`,
          `${kid} becomes an expert at “table radar.”`
        ],
        trades: [
          `${kid} gazes at tools like they’ve discovered Excalibur.`,
          `They measure everything, including the snack bar.`,
          `${kid} says “tighten that” at correct moments by accident.`
        ],
        stay_home: [
          `${kid} shadows you through logistics command center: laundry ops, snack budgeting, crisis mitigation.`,
          `They label the pantry like a junior quartermaster.`,
          `${kid} calls you “Director of Everything.”`
        ],
        unknown: [
          `${kid} sits at the desk and announces: “I will now be important.”`,
          `They respect the stapler. The stapler respects them back.`,
          `${kid} tells someone “my parent is the boss of emails.”`
        ]
      };

      const HEADLINES = {
        any: [
          `BREAKING: Middle schooler asks “what do you even do here?” — receives a 40‑minute answer.`,
          `Visitor badge obtained; policies immediately enforced by a child.`,
          `Local kid promoted to morale officer after distributing crackers.`
        ]
      };

      const lines = PROMPTS[cat] || PROMPTS.unknown;
      const opener = pick(rng, L(lines));
      const headline = pick(rng, L(HEADLINES.any));
      return `${opener}\n\n${headline}\n\nYou bring ${kid} to ${levelTitle}. Chaos is mild. Curiosity is loud.`;
    },
    choices: [
      {
        id: 'support',
        label: 'Guided tour + Q&A (make it inspiring)',
        result: (kid, state) => `You give a real tour and answer every question. People smile at ${kid} like they remember their own first badge.\n\nOn the drive home they say: "I think I want to do something like that."`,
        deltas: (state) => {
          const career = state?.playerCareer || (state?.householdType === 'two' ? state?.partnerCareer : null) || null;
          const jobId = career?.jobId || null;
          const job = jobId ? getJobById(jobId) : null;
          const cat = getJobCategory(job, jobId);
          const base = {
            health: { empathy: 2, knowledge: 1, confidence: 1 },
            education: { responsibility: 2, empathy: 1, confidence: 1 },
            stem: { intelligence: 2, curiosity: 2, knowledge: 1 },
            business: { discipline: 2, knowledge: 2, confidence: 1 },
            arts: { creativity: 3, confidence: 2, happiness: 1 },
            law_policy: { confidence: 2, responsibility: 2, social: 1 },
            service: { social: 2, confidence: 2, discipline: 1 },
            trades: { responsibility: 2, fitness: 1, confidence: 2, knowledge: 1 },
            stay_home: { responsibility: 2, empathy: 1, confidence: 1 },
            unknown: { responsibility: 2, empathy: 1, confidence: 1 }
          }[cat] || { responsibility: 2, empathy: 1, confidence: 1 };
          return { ...base, love: 3, stress: 1 };
        }
      },
      {
        id: 'crackdown',
        label: `Let them "help" like a tiny intern (risky)`,
        result: (kid) => `You let ${kid} “assist.” Papers get re‑sorted into an avant‑garde system. Someone thanks them anyway.\n\nOn the way out they whisper: "I was useful."`,
        deltas: (state) => {
          const career = state?.playerCareer || (state?.householdType === 'two' ? state?.partnerCareer : null) || null;
          const jobId = career?.jobId || null;
          const job = jobId ? getJobById(jobId) : null;
          const cat = getJobCategory(job, jobId);
          const amp = (obj) => {
            const entries = Object.entries(obj);
            if (!entries.length) return { confidence: 1 };
            const [k] = entries.sort((a,b)=>b[1]-a[1])[0];
            return { ...obj, [k]: (obj[k] || 0) + 1 };
          };
          const base = {
            health: { empathy: 2, knowledge: 1, confidence: 1 },
            education: { responsibility: 2, empathy: 1, confidence: 1 },
            stem: { intelligence: 2, curiosity: 2, knowledge: 1 },
            business: { discipline: 2, knowledge: 2, confidence: 1 },
            arts: { creativity: 3, confidence: 2, happiness: 1 },
            law_policy: { confidence: 2, responsibility: 2, social: 1 },
            service: { social: 2, confidence: 2, discipline: 1 },
            trades: { responsibility: 2, fitness: 1, confidence: 2, knowledge: 1 },
            stay_home: { responsibility: 2, empathy: 1, confidence: 1 },
            unknown: { responsibility: 2, empathy: 1, confidence: 1 }
          }[cat] || { responsibility: 2, empathy: 1, confidence: 1 };
          const boosted = amp(base);
          return { ...boosted, love: 1, stress: 3 };
        }
      },
      {
        id: 'ignore',
        label: 'Park them in the break room with snacks (opt out)',
        result: (kid) => `${kid} meets the vending machine and becomes Head of Pretzels. They’re content… but they wanted a peek behind the curtain.`,
        deltas: () => ({ love: -1, stress: -1 })
      }
    ]
  }
];

function buildScenario(state, event, rng) {
  const kid = getKidName(state);
  const prompt = typeof event.prompt === "function" ? event.prompt(kid, state, rng) : String(event.prompt || "");
  const choices = (event.choices || []).map((c) => ({
    id: c.id,
    letter: c.id === "support" ? "A" : c.id === "crackdown" ? "B" : "C",
    emoji: c.id === "support" ? "💚" : c.id === "crackdown" ? "⚡" : "🤷",
    text: c.label,
    consequence: typeof c.result === "function" ? c.result(kid, state, rng) : String(c.result || ""),
    deltas: typeof c.deltas === "function" ? (c.deltas(state, rng) || {}) : (c.deltas || {}),
    role: c.id === "support" ? "connect" : c.id === "crackdown" ? "harm" : "avoid"
  }));

  return {
    id: event.id,
    hookText: prompt,
    scenarioText: prompt,
    choices,
    meta: {
      specialType: "middle_school_one_off",
      msOneOffKey: event.key,
      msOneOffId: event.id,
      topic: event.title,
      category: event.category || "puberty",
      band: "middle_school",
      portraitKey: event.key === "school_fight_bruised" ? "kid_bruised" : null
    },
  };
}

export function isMiddleSchoolOneOffScenario(scenario) {
  return scenario?.meta?.specialType === "middle_school_one_off";
}

export function maybeGetMiddleSchoolOneOffScenario(state, rng) {
  const flags = state?.oneOffs?.middleSchoolOneOffFlags || {};

  // QA forcing: ?forceScenario=ms_oneoff_deodorant (etc)
  for (const ev of MS_ONE_OFF_EVENTS) {
    if (isForcedScenarioId(ev.id) && !flags?.[ev.key]) {
      if (typeof ev.isEligible === "function" && !ev.isEligible(state)) return null;
      return buildScenario(state, ev, rng);
    }
  }

  const age = getChildAge(state);
  if (age == null) return null;
  if (age < AGE_MIN || age > AGE_MAX) return null;

  const eligible = MS_ONE_OFF_EVENTS.filter((ev) => {
    if (flags?.[ev.key]) return false;
    if (typeof ev.isEligible === "function") return !!ev.isEligible(state);
    return true;
  });

  if (eligible.length === 0) return null;

  // Shuffle-ish order so the same event doesn't always win ties (deterministic if rng supports it)
  const ordered = eligible
    .map((ev) => ({ ev, r: rand01(rng) }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.ev);

  // Roll each eligible event at per-event chance (fallback to default CHANCE). If any hits, return the first hit.
  for (const ev of ordered) {
    const roll = rand01(rng);
    const chance = (typeof ev?.chance === 'function') ? ev.chance(state, age) : (ev?.chance ?? CHANCE);
    if (roll < (Number(chance) || 0)) return buildScenario(state, ev, rng);
  }

  return null;
}

export function applyMiddleSchoolOneOffChoice(state, scenario, choiceId) {
  if (!state || !scenario) return;
  if (!isMiddleSchoolOneOffScenario(scenario)) return;

  const oneOffs = ensureOneOffs(state);
  const flags = oneOffs.middleSchoolOneOffFlags;

  const key = scenario?.meta?.msOneOffKey;
  if (!key || typeof key !== "string") return;
  if (flags[key]) return; // safety: never apply twice

  const ev = MS_ONE_OFF_EVENTS.find((x) => x.key === key);
  if (!ev) return;

  // Only record and flag; do NOT apply stat deltas here (handled in Game.jsx)
  flags[key] = true;
  oneOffs.middleSchoolOneOffHistory.push({
    key,
    scenarioId: ev.id,
    choiceId: choiceId,
    age: getChildAge(state),
    recordedAt: Date.now(),
  });
  if (oneOffs.middleSchoolOneOffHistory.length > 50) {
    oneOffs.middleSchoolOneOffHistory = oneOffs.middleSchoolOneOffHistory.slice(-50);
  }
}