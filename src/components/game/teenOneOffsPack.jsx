// Teen One-Offs Pack
// - Ages 14–18 inclusive
// - Each event has a 3% per-year chance
// - Each event triggers at most once per run
// - Events are NOT mutually exclusive across years (you can see multiple different ones in a run)

export const TEEN_ONE_OFF_PREFIX = "teen_oneoff_";

const AGE_MIN = 14;
const AGE_MAX = 18;
const CHANCE = 0.03; // ~3% chance per eligible event per year

function rand01(rng) {
  try {
    if (rng && typeof rng.nextFloat === "function") return rng.nextFloat();
  } catch {}
  return Math.random();
}

function safeLower(v) {
  return String(v || "").trim().toLowerCase();
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

function getChildAge(state) {
  // game uses currentYear as child age
  return Number(state?.currentYear ?? 0);
}

function getChildName(state) {
  return String(state?.childName || state?.childProfile?.name || "your child");
}

// Mutating helper ONLY for applyTeenOneOffChoice (safe because Game.jsx applies it to a cloned nextState)
function ensureOneOffs(state) {
  if (!state) return {};
  if (!state.oneOffs || typeof state.oneOffs !== "object") state.oneOffs = {};
  if (!state.oneOffs.teenOneOffFlags || typeof state.oneOffs.teenOneOffFlags !== "object") {
    state.oneOffs.teenOneOffFlags = {};
  }
  if (!Array.isArray(state.oneOffs.teenOneOffHistory)) {
    state.oneOffs.teenOneOffHistory = [];
  }
  return state.oneOffs;
}

const TEEN_ONE_OFF_EVENTS = [
  {
    key: "vegetarian",
    id: `${TEEN_ONE_OFF_PREFIX}vegetarian`,
    title: "The Broccoli Manifesto",
    hookText: "You open the fridge and they're standing there like they're about to deliver a State of the Union.\n\n\"I've decided I'm vegetarian,\" they announce, gently sliding the deli drawer shut like it's a crime scene.\n\nThere's a sticky note on the milk that says: \"BE KIND. ALSO: TOFU.\"",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🥬",
        text: "Lean in (and learn 3 tofu recipes)",
        consequence: "You don't mock it. You ask what they want to eat and actually listen.\n\nThey look relieved—like they expected a courtroom and got a kitchen.\n\nThe tofu is… a learning curve. But the respect lands perfectly.",
        loveDelta: 2,
        stressDelta: 0,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "📢",
        text: "Lecture them about protein like it's your new hobby",
        consequence: "You launch into a TED Talk titled 'Soy Will Personally Ruin Your Life.'\n\nThey nod with the dead-eyed patience of someone watching an unskippable ad.\n\nYou win the lecture. You lose the moment.",
        loveDelta: -2,
        stressDelta: 2,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🍕",
        text: "Say 'cool' and order pepperoni anyway",
        consequence: "You acknowledge it with the emotional warmth of a receipt printer.\n\nThey quietly realize they'll need to advocate for themselves… in their own house.\n\nNo fight. No connection. Just… vibes (bad ones).",
        loveDelta: -1,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "carnivore",
    id: `${TEEN_ONE_OFF_PREFIX}carnivore`,
    title: "The Leaf Tax Rebellion",
    hookText: "They're on a new diet. Not 'less sugar,' not 'more veggies.'\n\nThey look you dead in the eyes and say: 'I'm carnivore now.'\n\nThen they point at a head of lettuce and whisper: 'Leaf tax.'",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🥩",
        text: "Meet halfway (meat… plus something green that doesn't scream)",
        consequence: "You don't treat it like a personality test. You treat it like parenting.\n\nYou talk balance. You offer options. You keep it calm.\n\nThey don't feel cornered—which, surprisingly, helps them listen.",
        loveDelta: 1,
        stressDelta: 1,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🥦",
        text: "Declare broccoli mandatory, like it's the law",
        consequence: "You turn dinner into a standoff.\n\nThey eat exactly one carrot with the expression of a hostage.\n\nCongrats: you enforced vegetables. Also: resentment.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🍖",
        text: "Ignore it (and let the grocery bill become your villain origin story)",
        consequence: "You let it ride… until you realize you're funding a household wolf.\n\nThe meat disappears at a rate that feels personally disrespectful.\n\nYou didn't solve the problem. You just subscribed to it.",
        loveDelta: -1,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "cult",
    id: `${TEEN_ONE_OFF_PREFIX}cult`,
    title: "The Shiny Orb Society",
    hookText: "They hand you a glossy pamphlet.\n\n\"It's not a cult,\" they say immediately, which is… not a comforting opener.\n\nThe brochure promises 'belonging,' 'clarity,' and 'weekly meetings that are definitely normal.'\n\nThere's an illustration of a glowing orb wearing what appears to be a little vest.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🔍",
        text: "Stay calm, ask questions, keep the door open",
        consequence: "You don't laugh. You don't explode. You get curious.\n\nYou ask what they like about it. Who's involved. What they're being asked to do.\n\nThey keep talking. That alone is a win.",
        loveDelta: 1,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🚨",
        text: "Full intervention (diagrams, rules, and a suspiciously intense tone)",
        consequence: "You go nuclear.\n\nThey stop sharing details and start sharing only lies that are easy to maintain.\n\nYou might have scared them away from the orb… but you also scared them away from you.",
        loveDelta: -3,
        stressDelta: 6,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🙈",
        text: "Pretend it's a phase and hope the orb gets bored",
        consequence: "You act like it's nothing.\n\nWhich means they learn they can be quietly absorbed by weirdness with zero adult input.\n\nThe orb remains shiny. Your stress becomes shinier.",
        loveDelta: -2,
        stressDelta: 5,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "weeaboo",
    id: `${TEEN_ONE_OFF_PREFIX}weeaboo`,
    title: "The Anime Arc",
    hookText: "It starts small: a show. A poster. A theme song that gets stuck in the walls.\n\nThen they bow dramatically and call the kitchen 'my training dojo.'\n\nThey've begun sprinkling random Japanese words into sentences with the confidence of someone holding a microphone.\n\nThis is an era. You can feel it.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🎌",
        text: "Take interest (and keep it respectful, not cringe)",
        consequence: "You ask what they like about it. You let them explain.\n\nThey light up. It's not about the cartoons—it's about being seen.\n\nYou also gently steer them away from being weird to real people. Win-win.",
        loveDelta: 2,
        stressDelta: 0,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🙄",
        text: "Mock it until it dies (or you do)",
        consequence: "You make jokes. A lot of jokes.\n\nThey don't stop liking it. They just stop liking you being near it.\n\nThe anime survives. Your connection takes a hit.",
        loveDelta: -3,
        stressDelta: 3,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "📺",
        text: "Ignore it (this is between them and the algorithm)",
        consequence: "You don't engage.\n\nThey become a one-person fandom ecosystem.\n\nMostly harmless… but also a missed chance to bond over something low-stakes.",
        loveDelta: -1,
        stressDelta: 1,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "doomscroll",
    id: `${TEEN_ONE_OFF_PREFIX}doomscroll`,
    title: "Doomscroll After Dark",
    hookText: "It's 2:37 a.m. and the house is silent—except for the faint *shh-shh-shh* of a thumb moving at 200 mph.\n\nYou find them awake, face lit by a phone like it's a tiny haunted campfire.\n\n'Just one more video,' they whisper… for the 90th time.\n\nTheir sleep is wrecked. Their mood is brittle. This isn't 'normal teen internet.' It's compulsive.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🤝",
        text: "Team up: boundaries + compassion (phone curfew, not phone war)",
        consequence: "You don't shame them—you problem-solve with them.\n\nYou set a plan: charging station outside the bedroom, calmer evening routine, check-ins.\n\nThey don't feel attacked… so they don't have to defend the addiction.",
        loveDelta: 2,
        stressDelta: 2,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "📵",
        text: "Confiscate the phone like it owes you money",
        consequence: "You yank the phone away and declare victory.\n\nThey learn a new hobby: hiding things.\n\nYou reduced screen time. You also reduced trust.",
        loveDelta: -2,
        stressDelta: 4,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😴",
        text: "Ignore it (sleep is a suggestion, apparently)",
        consequence: "You walk away because you're tired—and because fighting feels impossible.\n\nWhich means nothing changes, and your stress quietly compounds.\n\nThey keep scrolling. You keep worrying.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "gaming",
    id: `${TEEN_ONE_OFF_PREFIX}gaming`,
    title: "NPC Parent, Real Gamer Kid",
    hookText: "They've started referring to real life as 'the tutorial.'\n\nThey're always 'in a match,' 'in a raid,' or 'five minutes away' (which is teen for 'never').\n\nHomework is missing. Sleep is optional. When you ask how their day went, they say: 'Side quest.'",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🎮",
        text: "Set a schedule (and join one round so you understand the world)",
        consequence: "You negotiate rules like a calm adult, not a final boss.\n\nYou set limits, sleep expectations, and a 'homework first' pact.\n\nThey feel respected… which makes them more willing to respect the boundaries.",
        loveDelta: 2,
        stressDelta: 2,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "⚔️",
        text: "Go nuclear: threaten the console's existence",
        consequence: "You slam down consequences like a gavel.\n\nThey don't learn balance. They learn resentment and stealth.\n\nThe house feels 'loud' even when it's quiet.",
        loveDelta: -4,
        stressDelta: 6,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🕹️",
        text: "Ignore it (they'll totally self-regulate, surely)",
        consequence: "You let it slide because you're exhausted.\n\nThen you realize you haven't seen them in sunlight in three days.\n\nThe problem didn't disappear. It just moved in.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "vaping",
    id: `${TEEN_ONE_OFF_PREFIX}vaping`,
    title: "The Fruit-Flavored Cloud",
    hookText: "You walk into their room and the air smells like 'Mystery Mango Thunder.'\n\nThere's a small device on the desk that definitely isn't a USB stick.\n\nThey look at you like they're trying to remember if you're the kind of parent who faints.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🤝",
        text: "Stay calm: talk, listen, make a plan to stop",
        consequence: "You breathe. You keep your voice steady.\n\nYou talk about why they started and what they get out of it.\n\nYou don't normalize it—but you also don't turn it into a screaming contest.",
        loveDelta: 1,
        stressDelta: 4,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🚨",
        text: "Explode and punish (maximum volume, minimum connection)",
        consequence: "You go straight to rage.\n\nThey go straight to shutdown.\n\nYou might win compliance… and lose honesty.",
        loveDelta: -3,
        stressDelta: 5,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🙈",
        text: "Ignore it (this is definitely fine and won't become a bigger thing)",
        consequence: "You pretend you didn't see it.\n\nThey learn they can keep doing it with zero adult friction.\n\nYour stress grows quietly, like mold.",
        loveDelta: -2,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "crypto",
    id: `${TEEN_ONE_OFF_PREFIX}crypto`,
    title: "The Meme Coin Messiah",
    hookText: "They burst in like they just discovered fire.\n\n'I found the next big thing,' they say, shoving a chart in your face.\n\nThe chart looks like a heart monitor. The coin has a dog wearing sunglasses. The plan involves your credit card.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "💡",
        text: "Teach budgeting and risk (no shame, just reality)",
        consequence: "You turn it into a lesson: scams, volatility, and the difference between 'investing' and 'gambling with confetti.'\n\nThey actually listen—because you didn't belittle them.\n\nThey still love the dog coin. But now they also understand math.",
        loveDelta: 2,
        stressDelta: 2,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "⛔",
        text: "Ban it and call it stupid",
        consequence: "You shut it down with a single sentence: 'Absolutely not.'\n\nThey learn the lesson that matters most: do it in secret.\n\nAlso, they become 12% more annoying about it.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🐕",
        text: "Ignore it (and pray your bank account survives)",
        consequence: "You don't engage.\n\nWhich means they fill the silence with strangers online who are extremely confident and extremely wrong.\n\nYou feel stress. You also feel… impending doom.",
        loveDelta: -1,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "conspiracy",
    id: `${TEEN_ONE_OFF_PREFIX}conspiracy`,
    title: "The Rabbit Hole Has Wi‑Fi",
    hookText: "They've taped paper over their webcam.\n\nThey whisper: 'You can't say that near the router.'\n\nThey show you a video titled: 'PROOF the moon is a corporate logo.'\n\nYou blink slowly, like you're buffering.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🧠",
        text: "Go gentle: ask questions + teach media literacy",
        consequence: "You don't laugh. You don't attack.\n\nYou ask: 'What would convince you this isn't true?' and 'Who benefits from you believing this?'\n\nThey argue less when you're not trying to humiliate them.",
        loveDelta: 2,
        stressDelta: 2,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "📢",
        text: "Argue and shame them until they double down",
        consequence: "You call it ridiculous.\n\nThey hear: 'You're ridiculous.'\n\nThey don't climb out of the hole. They just invite the hole to live in the house.",
        loveDelta: -3,
        stressDelta: 4,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🌐",
        text: "Ignore it (this is probably fine… right?)",
        consequence: "You avoid it because it's exhausting.\n\nBut ignoring a rabbit hole doesn't fill it.\n\nIt just lets the algorithm keep digging.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "goth",
    id: `${TEEN_ONE_OFF_PREFIX}goth`,
    title: "The Black Hoodie Epoch",
    hookText: "They appear wearing approximately 40% more black than physics should allow.\n\nThey stare out the window dramatically—at nothing.\n\n'It's not a phase,' they say, while being 100% in a phase.\n\nThe eyeliner is either art or a cry for help. Possibly both.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🖤",
        text: "Accept the vibe (and check in for real)",
        consequence: "You don't panic.\n\nYou compliment the creativity and gently ask how they're feeling.\n\nThey relax. When you don't treat them like a problem, they're more likely to tell you if there *is* one.",
        loveDelta: 2,
        stressDelta: 0,
        deltas: { confidence: 2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🌈",
        text: "Ban the clothes like you're fighting fashion itself",
        consequence: "You start a war with fabric.\n\nThey comply in the house… then wear the hoodie immediately after leaving.\n\nYou taught them to hide, not to share.",
        loveDelta: -3,
        stressDelta: 4,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🎭",
        text: "Ignore it (vibes will sort themselves, probably)",
        consequence: "You act unbothered.\n\nThey interpret it as either 'cool parent energy' or 'parent doesn't care.' Hard to tell.\n\nThe phase continues. You stay distant.",
        loveDelta: -1,
        stressDelta: 1,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "hair_dye",
    id: `${TEEN_ONE_OFF_PREFIX}hair_dye`,
    title: "The Blue Hair Incident",
    hookText: "You hear the bathroom fan running for an hour.\n\nThen they emerge, looking like a Pixar character who just discovered independence.\n\n'It's semi-permanent,' they say, as if that makes it less blue.\n\nThe sink is… not okay.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "💙",
        text: "React calmly (it's hair, not a felony)",
        consequence: "You take a breath and say: 'I like that you tried something new.'\n\nThey weren't expecting that.\n\nRespect lands better than rules sometimes.",
        loveDelta: 2,
        stressDelta: 0,
        deltas: { confidence: 2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "😡",
        text: "Freak out (and demand they fix it immediately)",
        consequence: "You react like they dyed your actual soul.\n\nThey don't understand the rage. You don't understand the hair.\n\nThe bathroom stays blue. The trust stays damaged.",
        loveDelta: -3,
        stressDelta: 5,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🙃",
        text: "Act like you didn't notice (which is… a choice)",
        consequence: "You pretend nothing happened.\n\nThey wanted a reaction—good or bad.\n\nInstead they got emotional indifference, which somehow stings more.",
        loveDelta: -2,
        stressDelta: 1,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "piercing",
    id: `${TEEN_ONE_OFF_PREFIX}piercing`,
    title: "The Unauthorized Nose Stud",
    hookText: "They come home with a tiny new sparkle on their face.\n\n'It's hypoallergenic,' they say, like that was your main concern.\n\nYou weren't consulted. You are now being informed.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "✨",
        text: "Stay calm: set a 'next time we talk first' boundary",
        consequence: "You breathe through the surprise.\n\nYou acknowledge it, set a boundary for future body choices, and keep moving.\n\nThey feel seen—not attacked.",
        loveDelta: 1,
        stressDelta: 2,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🚫",
        text: "Demand they remove it (and prepare for war)",
        consequence: "You turn it into a power struggle.\n\nThey keep the piercing. You keep the resentment.\n\nNobody wins. Everybody's mad.",
        loveDelta: -3,
        stressDelta: 5,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😐",
        text: "Say nothing (because you have no idea how to handle this)",
        consequence: "You freeze.\n\nThey interpret silence as either permission or passive-aggression.\n\nEither way, clarity would've been kinder.",
        loveDelta: -1,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "tattoo",
    id: `${TEEN_ONE_OFF_PREFIX}tattoo`,
    title: "The Stick-n-Poke Era",
    hookText: "They casually mention they got a tattoo.\n\nA stick-n-poke. In someone's garage.\n\nIt's a tiny symbol that 'represents resilience.'\n\nYou're trying very hard not to think about infection protocols.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🩹",
        text: "Focus on safety (aftercare > anger)",
        consequence: "You don't love it. You also don't explode.\n\nYou make sure they know how to clean it properly and set a 'next time we talk first' rule.\n\nThey feel cared for—not controlled.",
        loveDelta: 1,
        stressDelta: 3,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "😡",
        text: "Freak out and threaten consequences",
        consequence: "You treat them like a criminal.\n\nThey treat you like a warden.\n\nThe tattoo stays. The resentment grows.",
        loveDelta: -3,
        stressDelta: 6,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🙈",
        text: "Pretend you didn't hear it",
        consequence: "You avoid it.\n\nThey learn they can do risky things and you won't even check if they're okay.\n\nNot ideal.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "fake_id",
    id: `${TEEN_ONE_OFF_PREFIX}fake_id`,
    title: "The Borrowed Birthday",
    hookText: "You find a driver's license with their photo… and someone else's birthday.\n\nThe name is misspelled. The hologram is blurry.\n\nThey see you holding it and freeze like a paused video game.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🆔",
        text: "Serious talk: consequences + why this matters",
        consequence: "You don't yell. You explain.\n\nYou talk about legal risk, fake IDs that fail, and the 'not worth it' reality.\n\nThey don't love the lecture—but they respect that you didn't humiliate them.",
        loveDelta: 1,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 1, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🚔",
        text: "Grounding + lecture + shame (the full combo)",
        consequence: "You lock down their life.\n\nThey don't learn discernment. They learn to hide better.\n\nYou also learn they're better at secrets than you expected.",
        loveDelta: -3,
        stressDelta: 6,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🤷",
        text: "Put it back and pretend it's not your problem",
        consequence: "You avoid the conversation.\n\nWhich means they learn: 'I can do risky stuff and nobody will check.'\n\nStress increases. Safety decreases.",
        loveDelta: -2,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "driving",
    id: `${TEEN_ONE_OFF_PREFIX}driving`,
    title: "The Parking Lot Incident",
    hookText: "They borrowed your car 'just to move it.'\n\nNow it's parked at a 47-degree angle across two spots.\n\nThere's a shopping cart dent. They claim it 'was already there.'\n\nIt was not.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🚗",
        text: "Stay calm: consequences + a driving lesson",
        consequence: "You don't explode.\n\nYou set a consequence (they pay half the repair) and schedule real practice.\n\nThey learn accountability without being shamed into hiding mistakes.",
        loveDelta: 1,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 1 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🔥",
        text: "Explode and ban them from driving for months",
        consequence: "You go full courtroom prosecutor.\n\nThey stop asking to practice… which means they don't get better.\n\nYou protected the car. You also delayed their learning.",
        loveDelta: -2,
        stressDelta: 5,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😬",
        text: "Fix it quietly and never mention it",
        consequence: "You avoid the fight.\n\nThey don't learn repair, accountability, or honesty.\n\nThey just learn that problems disappear if ignored long enough.",
        loveDelta: -1,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: -1 }
      }
    ]
  },

  {
    key: "sneaking_out",
    id: `${TEEN_ONE_OFF_PREFIX}sneaking_out`,
    title: "The Midnight Cartographer",
    hookText: "It's 1:43 a.m. and you hear the front door close like a guilty whisper.\n\nYou check their room. Empty.\n\nThey snuck out. You're awake. This is happening.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🚪",
        text: "Wait up, talk calmly, set boundaries (not rage)",
        consequence: "You stay up—not to ambush, but to talk.\n\nWhen they return, you keep it calm: 'This isn't safe. Here's why. What do you need that made sneaking out feel worth it?'\n\nThey didn't expect that. It lands.",
        loveDelta: 2,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 1 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🔒",
        text: "Lock them down (grounding + surveillance mode)",
        consequence: "You turn the house into a minimum-security facility.\n\nThey don't sneak out again… but they also stop trusting you with hard things.\n\nYou won compliance. You lost closeness.",
        loveDelta: -3,
        stressDelta: 6,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😴",
        text: "Pretend you didn't notice (and lie awake all night)",
        consequence: "You avoid the fight.\n\nThey don't know you know… so they keep doing it.\n\nYour stress compounds silently, like interest.",
        loveDelta: -2,
        stressDelta: 5,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "friend_breakup",
    id: `${TEEN_ONE_OFF_PREFIX}friend_breakup`,
    title: "The Friend Breakup Arc",
    hookText: "Their best friend isn't their best friend anymore.\n\nThey won't say why. They won't cry. They just go quiet in a way that feels loud.\n\nYou watch them pretend it's fine. It is not fine.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "💛",
        text: "Validate, stay close, let them process (no fixing)",
        consequence: "You don't rush in with solutions.\n\nYou say: 'That's hard. I'm here.'\n\nThey don't open up immediately—but they stop pretending around you.",
        loveDelta: 2,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 1, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🎯",
        text: "Diagnose the problem and deliver unsolicited advice",
        consequence: "You turn their grief into a strategy session.\n\nThey didn't ask for advice. They wanted presence.\n\nYou meant well. It still landed badly.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🤐",
        text: "Act normal (because you don't know what to say)",
        consequence: "You avoid it.\n\nThey feel alone in a house with people.\n\nNo connection. No repair. Just quiet.",
        loveDelta: -2,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "college_stress",
    id: `${TEEN_ONE_OFF_PREFIX}college_stress`,
    title: "The Future Panic",
    hookText: "They're spiraling.\n\n'Everyone knows what they're doing,' they say, staring at a college brochure like it's a ransom note.\n\n'I don't even know what I like. How am I supposed to pick a *major*?'\n\nTheir hands are shaking a little.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🫂",
        text: "Normalize the uncertainty (and lower the pressure)",
        consequence: "You say: 'Not knowing is normal. Most adults are still figuring it out.'\n\nThey exhale.\n\nYou didn't fix the stress—but you made it smaller.",
        loveDelta: 2,
        stressDelta: -2,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "📈",
        text: "Demand a plan (because panic should totally motivate clarity)",
        consequence: "You add pressure to pressure.\n\nThey don't get sharper. They get more frozen.\n\nYou wanted urgency. You got shutdown.",
        loveDelta: -2,
        stressDelta: 4,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🤷",
        text: "Act like it's no big deal (which… doesn't help)",
        consequence: "You minimize it.\n\nThey feel dismissed—like their stress is an overreaction.\n\nThe panic doesn't shrink. It just goes underground.",
        loveDelta: -1,
        stressDelta: 2,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "breakup",
    id: `${TEEN_ONE_OFF_PREFIX}breakup`,
    title: "The First Real Heartbreak",
    hookText: "They got dumped.\n\nThey're playing sad music on repeat like it's a competitive sport.\n\nThey won't eat. They won't talk. They just… radiate grief.\n\nYou remember this feeling. It was terrible then too.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "💔",
        text: "Validate the pain (don't minimize, don't fix)",
        consequence: "You say: 'Heartbreak is real. I'm sorry.'\n\nYou don't rush them. You don't joke.\n\nThey feel less alone—which is all they needed.",
        loveDelta: 2,
        stressDelta: 1,
        deltas: { confidence: 0, intelligence: 0, empathy: 1, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "⏭️",
        text: "Tell them to 'get over it' (because that's super helpful)",
        consequence: "You dismiss their feelings.\n\nThey learn grief isn't allowed around you.\n\nThey stop sharing hard things.",
        loveDelta: -3,
        stressDelta: 3,
        deltas: { confidence: -1, intelligence: 0, empathy: -1, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😶",
        text: "Avoid it (because you don't know what to say)",
        consequence: "You stay silent because emotions are awkward.\n\nThey feel alone in a full house.\n\nPresence would've been enough. You didn't offer it.",
        loveDelta: -2,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "diary",
    id: `${TEEN_ONE_OFF_PREFIX}diary`,
    title: "The Diary You Shouldn't Have Read",
    hookText: "You found their journal.\n\nYou told yourself you wouldn't read it.\n\nYou read it.\n\nNow you know things you can't unknow… and they don't know you know.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "📔",
        text: "Confess and apologize (honesty > comfort)",
        consequence: "You admit you read it. You apologize.\n\nThey're furious… but also a little relieved you didn't weaponize what you learned.\n\nTrust takes a hit—but repair is possible.",
        loveDelta: 0,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 1, discipline: 0 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🔍",
        text: "Confront them about what you read (without admitting you invaded privacy)",
        consequence: "You act like you magically 'sensed' things.\n\nThey know you read it. You know they know.\n\nNobody says it. Trust crumbles anyway.",
        loveDelta: -3,
        stressDelta: 5,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🤐",
        text: "Pretend it never happened (and carry the guilt forever)",
        consequence: "You stay silent.\n\nThey never know you invaded their privacy… but you do.\n\nThe guilt lives in your chest like a tiny stress goblin.",
        loveDelta: -1,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "party",
    id: `${TEEN_ONE_OFF_PREFIX}party`,
    title: "The Party You Weren't Invited To",
    hookText: "You come home early.\n\nThere are 14 teenagers in your living room.\n\nNobody is supposed to be here.\n\nThey freeze like a nature documentary.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🏠",
        text: "Stay calm: end it safely, talk later",
        consequence: "You don't scream. You calmly send everyone home.\n\nLater, you have a real talk about trust, safety, and consequences.\n\nThey broke a rule—and you handled it like an adult.",
        loveDelta: 1,
        stressDelta: 4,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: 1 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "😡",
        text: "Lose it in front of everyone (max embarrassment mode)",
        consequence: "You yell. Loudly. In front of their friends.\n\nThey comply… and also quietly resent you for the next decade.\n\nYou won the moment. You lost the relationship.",
        loveDelta: -4,
        stressDelta: 6,
        deltas: { confidence: -3, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🎉",
        text: "Act cool and join the party (boundary? what boundary?)",
        consequence: "You try to be the 'fun parent.'\n\nThey don't want you at the party. They wanted a parent.\n\nYou didn't set a limit. You also didn't earn respect.",
        loveDelta: -2,
        stressDelta: 2,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: -1 }
      }
    ]
  },

  {
    key: "grades",
    id: `${TEEN_ONE_OFF_PREFIX}grades`,
    title: "The Report Card Catastrophe",
    hookText: "The email from school has a subject line that radiates doom.\n\nThey're failing two classes.\n\nNot 'struggling'—failing.\n\nThey've been hiding it for weeks.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "📚",
        text: "Problem-solve together (tutoring, check-ins, no shame)",
        consequence: "You don't yell. You ask what happened.\n\nYou build a plan: tutoring, accountability, and consistent follow-up.\n\nThey feel supported—not attacked.",
        loveDelta: 2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 1, empathy: 0, discipline: 1 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "📉",
        text: "Punish and lecture (because fear totally improves grades)",
        consequence: "You ground them and deliver a 40-minute TED Talk about their future.\n\nThey don't study harder. They just hide stress better.\n\nYou wanted urgency. You got shutdown.",
        loveDelta: -3,
        stressDelta: 5,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🤷",
        text: "Ignore it (school will sort it out, surely)",
        consequence: "You don't engage.\n\nThey interpret it as: 'Nobody cares.'\n\nThe grades don't improve. The distance grows.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: 0, discipline: -1 }
      }
    ]
  },

  {
    key: "job",
    id: `${TEEN_ONE_OFF_PREFIX}job`,
    title: "The First Paycheck Prophet",
    hookText: "They got a job.\n\nA real one. With a nametag and everything.\n\nThey come home exhausted, newly aware that 'customer service' is a war crime.\n\n'Adults do this… every day?' they whisper, horrified.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "💼",
        text: "Celebrate and coach (budgeting, boundaries, rest)",
        consequence: "You congratulate them—and help them navigate hours, saving, and burnout.\n\nThey feel proud… and supported.\n\nWork becomes a skill, not just survival.",
        loveDelta: 2,
        stressDelta: 1,
        deltas: { confidence: 1, intelligence: 0, empathy: 0, discipline: 1 }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "💸",
        text: "Immediately demand rent (because parenting is a side hustle now)",
        consequence: "You treat them like a tenant.\n\nThey learn money is transactional… even at home.\n\nYou got $200. You lost warmth.",
        loveDelta: -2,
        stressDelta: 3,
        deltas: { confidence: 0, intelligence: 0, empathy: -1, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😐",
        text: "Barely acknowledge it (because you're distracted)",
        consequence: "You say 'cool' and move on.\n\nThey wanted pride. They got a receipt-printer vibe.\n\nThe moment passes. So does connection.",
        loveDelta: -1,
        stressDelta: 1,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  },

  {
    key: "punk_rocker",
    id: `${TEEN_ONE_OFF_PREFIX}punk_rocker`,
    title: "The Punk Rocker Declaration",
    hookText: "They walk in wearing a leather jacket covered in patches and safety pins.\n\n'I'm going punk,' they announce.\n\nYou blink. They're serious.\n\nThe hair is next. The music is already very, very loud.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🎸",
        text: "Support the style (it's expression, not rebellion)",
        consequence: "You say: 'I like that you're trying something bold.'\n\nThey weren't expecting that.\n\nYou didn't freak out—which makes them trust you more, not less.",
        loveDelta: 3,
        stressDelta: 0,
        deltas: { confidence: 2, intelligence: 0, empathy: 0, discipline: 0 },
        meta: { setTeenStyle: 'punk' }
      },
      {
        id: "crackdown",
        letter: "B",
        emoji: "🚫",
        text: "Ban it immediately (because conformity = safety, right?)",
        consequence: "You treat the jacket like contraband.\n\nThey comply at home… and dress up elsewhere.\n\nYou won the wardrobe war. You lost the kid.",
        loveDelta: -3,
        stressDelta: 4,
        deltas: { confidence: -2, intelligence: 0, empathy: 0, discipline: 0 }
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "😐",
        text: "Ignore it (this is definitely just a phase)",
        consequence: "You act unbothered.\n\nThey wanted a reaction—good or bad.\n\nYou gave indifference, which somehow stings more.",
        loveDelta: -2,
        stressDelta: 1,
        deltas: { confidence: -1, intelligence: 0, empathy: 0, discipline: 0 }
      }
    ]
  }
];

function hasHappened(state, eventKey) {
  const flags = state?.oneOffs?.teenOneOffFlags;
  if (!flags || typeof flags !== "object") return false;
  return !!flags[eventKey];
}

export function maybeGetTeenOneOffScenario(state, rng) {
  const age = getChildAge(state) ?? state?.currentYear ?? 0;

  if (age < AGE_MIN || age > AGE_MAX) return null;

  // Forced override (only if not already happened)
  for (const evt of TEEN_ONE_OFF_EVENTS) {
    if (isForcedScenarioId(evt.id) && !hasHappened(state, evt.key)) {
      return buildScenarioFromEvent(evt, state);
    }
  }

  const eligible = TEEN_ONE_OFF_EVENTS.filter(evt => !hasHappened(state, evt.key));
  if (!eligible.length) return null;

  // Shuffle-ish order so it isn’t biased toward early list items
  const shuffled = eligible
    .map(evt => ({ evt, r: rand01(rng) }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.evt);

  for (const evt of shuffled) {
    if (rand01(rng) < CHANCE) {
      return buildScenarioFromEvent(evt, state);
    }
  }

  return null;
}

// Build scenario object from event definition
function buildScenarioFromEvent(evt, state) {
  const kidName = getChildName(state);
  const hookText = typeof evt.hookText === "function" 
    ? evt.hookText(kidName)
    : String(evt.hookText || "").replace(/\{kid\}/g, kidName).replace(/\{childName\}/g, kidName);

  return {
    id: evt.id,
    hookId: evt.id,
    age: getChildAge(state) ?? state.currentYear ?? 0,
    scenarioText: hookText,
    hookText: hookText,
    choices: evt.choices.map(c => ({
      ...c,
      role: c.id === "support" ? "connect" : c.id === "crackdown" ? "harm" : "avoid"
    })),
    meta: {
      category: "teen_oneoff",
      band: "teen",
      topic: evt.title,
      packId: "teen_oneoffs",
      choicePack: "teen_oneoffs",
      isTeenOneOff: true,
      eventKey: evt.key,
      portraitKey: evt.key === "punk_rocker" ? "teen_punk" : null
    }
  };
}

// Choice resolver (call this in Game.jsx after detecting a teen one-off scenario)
export function applyTeenOneOffChoice(state, scenario, choiceLetter) {
  if (!scenario || !scenario.meta?.isTeenOneOff) return;

  const choice = scenario.choices.find(c => c.letter === choiceLetter);
  if (!choice) return;

  // Apply deltas
  if (choice.deltas) {
    Object.keys(choice.deltas).forEach(key => {
      addStat(state, key, choice.deltas[key]);
    });
  }

  // Apply love
  if (choice.loveDelta) {
    const love = Number(state?.love ?? 0);
    state.love = love + Number(choice.loveDelta);
  }

  // Apply stress
  if (choice.stressDelta) {
    let stress = Number(state?.stress ?? 0);
    stress += Number(choice.stressDelta);
    if (stress < 0) stress = 0;
    state.stress = stress;
  }

  // Apply teen style change if requested
  if (choice.meta?.setTeenStyle) {
    if (!state.childAvatarStyleByStage) state.childAvatarStyleByStage = {};
    state.childAvatarStyleByStage.teen = choice.meta.setTeenStyle;
  }

  // Mark happened so it won't repeat
  try {
    const eventKey = scenario?.meta?.eventKey;
    if (eventKey) {
      const oneOffs = ensureOneOffs(state);
      if (!oneOffs.teenOneOffFlags[eventKey]) {
        oneOffs.teenOneOffFlags[eventKey] = true;
        oneOffs.teenOneOffHistory.push({
          eventKey,
          age: getChildAge(state) ?? state.currentYear ?? 0,
          choice: choiceLetter,
          scenarioId: scenario?.id || null,
          timestamp: Date.now()
        });
      }
    }
  } catch {}
}

// Helper: Check if scenario is a teen one-off
export function isTeenOneOffScenario(scenario) {
  return scenario?.id?.startsWith(TEEN_ONE_OFF_PREFIX) || scenario?.meta?.isTeenOneOff === true;
}

// Helper for stat application
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