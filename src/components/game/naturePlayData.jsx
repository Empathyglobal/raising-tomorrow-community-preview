import { getCountryByIso3 } from './countryEconomy';

export const DEFAULT_BIRDS = [
  "Sparrow",
  "Pigeon",
  "Crow",
  "Seagull",
  "Duck",
  "Hawk"
];

// The game currently supports these ISO3s in countriesData.jsx.
// Give each a distinct-feeling bird list so Bird Watch truly feels “local”.
export const BIRDS_BY_ISO3 = {
  USA: ["Northern cardinal", "American robin", "Blue jay", "Bald eagle", "Red-tailed hawk", "Mallard"],
  NOR: ["Atlantic puffin", "Whooper swan", "White-tailed eagle", "Common eider", "Eurasian magpie", "Great tit"],
  HTI: ["Hispaniolan trogon", "Bananaquit", "Hispaniolan parrot", "Caribbean dove", "Great egret", "Antillean palm swift"],
  IDN: ["Bali myna", "Rhinoceros hornbill", "Javan kingfisher", "Zebra dove", "Olive-backed sunbird", "White-rumped shama"],
  JPN: ["Japanese white-eye", "Red-crowned crane", "Eurasian tree sparrow", "Barn swallow", "Carrion crow", "Black-faced spoonbill"],
  AUS: ["Laughing kookaburra", "Rainbow lorikeet", "Sulphur-crested cockatoo", "Australian magpie", "Emu", "Galah"],
  DEU: ["European robin", "Common blackbird", "Great tit", "Eurasian jay", "White stork", "Mute swan"],
  BRA: ["Toco toucan", "Hyacinth macaw", "Rufous-bellied thrush", "Hummingbird", "Southern caracara", "Scarlet ibis"],
  IND: ["Indian peafowl", "Common myna", "Rose-ringed parakeet", "White-throated kingfisher", "Black kite", "Cattle egret"],
  ZAF: ["Hadeda ibis", "Cape weaver", "Sunbird", "Secretarybird", "Ostrich", "African penguin"],
  MEX: ["Roadrunner", "Vermilion flycatcher", "Great-tailed grackle", "Green jay", "Turkey vulture", "Plain chachalaca"],
  GBR: ["European robin", "Blue tit", "Magpie", "Mute swan", "Peregrine falcon", "Mallard"],
  FRA: ["European robin", "Great tit", "Common blackbird", "Grey heron", "Barn owl", "Eurasian magpie"],
  SGP: ["Collared kingfisher", "Oriental pied hornbill", "Javan myna", "Pink-necked green pigeon", "White-bellied sea eagle", "Olive-backed sunbird"]
};

export function getBirdListForIso3(iso3) {
  return BIRDS_BY_ISO3[iso3] || DEFAULT_BIRDS;
}

function pickOne(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function pickUnique(list, count = 3) {
  const pool = Array.isArray(list) ? [...list] : [];
  const picked = [];
  while (pool.length > 0 && picked.length < count) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  while (picked.length < count) {
    picked.push(DEFAULT_BIRDS[picked.length % DEFAULT_BIRDS.length]);
  }
  return picked;
}

function ageBand(age) {
  if (age <= 5) return "young";
  if (age <= 12) return "kid";
  return "teen";
}

export const NATURE_PLAY_ACTIVITIES = [
  {
    id: "play_in_nature",
    emoji: "🐸",
    title: "Play in Nature",
    tagline: "Mud potions, bug drama, and pockets full of 'treasures.'",
    minAge: 0,
    maxAge: 18
  },
  {
    id: "bird_watch",
    emoji: "🦜",
    title: "Bird Watch",
    tagline: "Tiny dinosaurs with wings. You are now a bird detective.",
    minAge: 0,
    maxAge: 18
  },
  {
    id: "rock_leaf_museum",
    emoji: "🪨",
    title: "Rock & Leaf Museum",
    tagline: "Curate the world’s messiest museum… in your home.",
    minAge: 0,
    maxAge: 18
  },
  {
    id: "cloud_detective",
    emoji: "☁️",
    title: "Cloud Detective",
    tagline: "Science, stories, and dramatic weather predictions.",
    minAge: 0,
    maxAge: 18
  },
  {
    id: "map_quest",
    emoji: "🧭",
    title: "Mini Expedition Map Quest",
    tagline: "Treasure-map energy, but make it educational.",
    minAge: 3,
    maxAge: 18
  },
  {
    id: "seed_to_sprout",
    emoji: "🌱",
    title: "Seed-to-Sprout Lab",
    tagline: "Grow something… and try not to forget to water it.",
    minAge: 3,
    maxAge: 18
  },
  {
    id: "night_sounds_safari",
    emoji: "🌙",
    title: "Night Sounds Safari",
    tagline: "Listen like a spy. Identify like a scientist.",
    minAge: 4,
    maxAge: 18
  },
  {
    id: "trail_cleanup_mission",
    emoji: "🧤",
    title: "Trail Cleanup Mission",
    tagline: "Small hero energy. Big character-building.",
    minAge: 4,
    maxAge: 18
  }
];

// Build a scenario object for an activity.
// Each activity must result in a QUESTION + choices.
// Every choice must give Intelligence (>= +1).
export function buildNatureScenario(activityId, ctx) {
  const age = Number(ctx?.age ?? 0);
  const childName = ctx?.childName || "your child";
  const countryIso3 = ctx?.countryIso3 || "USA";
  const band = ageBand(age);

  const country = getCountryByIso3(countryIso3);
  const countryName = country?.name || "your area";

  if (activityId === "bird_watch") {
    const birds = pickUnique(getBirdListForIso3(countryIso3), 3);
    const birdsText = `${birds[0]}, ${birds[1]}, and ${birds[2]}`;

    if (band === "young") {
      return {
        activityId,
        emoji: "🦜",
        title: "Bird Watch",
        setup: `You and ${childName} go bird-spotting in ${countryName}. You spot ${birdsText}. ${childName} confidently calls every bird “Birdy McBirdface.”`,
        question: "What do you do?",
        choices: [
          {
            id: "silly_names",
            label: "Make it a silly naming game",
            emoji: "😄",
            deltas: { intelligence: 1, confidence: 1, empathy: 1, discipline: 0 },
            loveDelta: 1,
            stressDelta: -0.3,
            logLine: `${childName} invents ridiculous bird names. You laugh a lot and somehow learn real bird details too.`
          },
          {
            id: "gentle_quiz",
            label: "Gentle quiz time",
            emoji: "🧠",
            deltas: { intelligence: 2, discipline: 1, confidence: 0, empathy: 0 },
            loveDelta: 0.4,
            stressDelta: 0.4,
            logLine: `You turn it into a tiny quiz. ${childName} gets one right and immediately becomes “Professor Bird.”`
          },
          {
            id: "quiet_wonder",
            label: "Just watch and wonder (30 seconds of quiet… ish)",
            emoji: "🤫",
            deltas: { intelligence: 1, empathy: 2, discipline: 0, confidence: 0 },
            loveDelta: 0.8,
            stressDelta: -0.7,
            logLine: `You watch quietly. ${childName} whispers anyway. Close enough — it’s peaceful and grounding.`
          }
        ]
      };
    }

    if (band === "kid") {
      return {
        activityId,
        emoji: "🦜",
        title: "Bird Watch",
        setup: `You bring binoculars and snacks (because you’re not a monster). In ${countryName}, you spot ${birdsText}. ${childName} asks which one is secretly in charge.`,
        question: "How do you make the learning stick?",
        choices: [
          {
            id: "field_guide_detective",
            label: "Field-guide detective mode",
            emoji: "🔎",
            deltas: { intelligence: 3, discipline: 1, confidence: 1, empathy: 0 },
            loveDelta: 0.5,
            stressDelta: 0.5,
            logLine: `You look them up, compare calls, and ${childName} turns into a tiny scientist with binoculars.`
          },
          {
            id: "bird_bingo",
            label: "Make a bird bingo card",
            emoji: "🟩",
            deltas: { intelligence: 2, confidence: 2, discipline: 0, empathy: 0 },
            loveDelta: 0.8,
            stressDelta: 0,
            logLine: `You make a silly bingo card and suddenly observation is a competitive sport. ${childName} is locked in.`
          },
          {
            id: "sketch_story",
            label: "Sketch + story time",
            emoji: "✏️",
            deltas: { intelligence: 2, empathy: 1, confidence: 1, discipline: 0 },
            loveDelta: 0.7,
            stressDelta: -0.3,
            logLine: `${childName} draws a lopsided bird and gives it a dramatic backstory. Weirdly memorable.`
          }
        ]
      };
    }

    // teen
    return {
      activityId,
      emoji: "🦜",
      title: "Bird Watch",
      setup: `You go on a low-key bird walk with ${childName} in ${countryName}. You spot ${birdsText}. ${childName} pretends not to care… while caring a lot.`,
      question: "How do you keep it teen-approved?",
      choices: [
        {
          id: "photo_challenge",
          label: "Photo challenge: best bird pic wins",
          emoji: "📸",
          deltas: { intelligence: 2, confidence: 2, discipline: 0, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: 0,
          logLine: `${childName} takes 47 photos, deletes 46, and the final one is actually great. You both brag (quietly).`
        },
        {
          id: "ecology_talk",
          label: "Talk ecology (the real-world version)",
          emoji: "🌍",
          deltas: { intelligence: 3, empathy: 1, discipline: 0, confidence: 0 },
          loveDelta: 0.2,
          stressDelta: 0.5,
          logLine: `You talk habitat, migration, and how humans mess it up. It gets real in a good way.`
        },
        {
          id: "silent_walk_snack",
          label: "Silent walk + snack debrief",
          emoji: "🥨",
          deltas: { intelligence: 1, empathy: 2, discipline: 1, confidence: 0 },
          loveDelta: 0.6,
          stressDelta: -0.4,
          logLine: `You keep it quiet, then debrief over snacks like it’s a podcast episode. Surprisingly close.`
        }
      ]
    };
  }

  if (activityId === "play_in_nature") {
    // Random encounter selection (age-gated).
    const encounters = [
      { id: "frog", minAge: 0 },
      { id: "firefly", minAge: 0 },
      { id: "butterfly", minAge: 0 },
      { id: "mud", minAge: 0 },
      { id: "fort", minAge: 3 },
      { id: "mantis", minAge: 6 }
    ].filter(e => age >= e.minAge);

    const chosen = pickOne(encounters)?.id || "frog";

    if (chosen === "frog") {
      return {
        activityId,
        emoji: "🐸",
        title: "Play in Nature: Frog Debate",
        setup: `You spot a frog near the water. ${childName} gasps like they just discovered a dragon in disguise.`,
        question: "What do you do with Captain Hops?",
        choices: [
          {
            id: "learn_release",
            label: "Observe, learn, release",
            emoji: "📚",
            deltas: { intelligence: 2, empathy: 1, confidence: 1, discipline: 0 },
            loveDelta: 0.8,
            stressDelta: -0.3,
            logLine: `You count toes, notice patterns, and release the frog. ${childName} waves goodbye like it’s a celebrity.`
          },
          {
            id: "frog_hotel",
            label: "Build a 24-hour frog hotel, then release",
            emoji: "🏨",
            deltas: { intelligence: 3, discipline: 1, empathy: 1, confidence: 0 },
            loveDelta: 0.5,
            stressDelta: 0.6,
            logLine: `You build a temporary frog hotel. ${childName} demands room service. You negotiate with a frog.`
          },
          {
            id: "keep_pet",
            label: "Keep it as a pet (uh oh)",
            emoji: "😅",
            deltas: { intelligence: 1, discipline: -1, empathy: -1, confidence: 1 },
            loveDelta: 0.2,
            stressDelta: 1.2,
            logLine: `By bedtime, the frog is gone. You both become amateur detectives. Case status: UNSOLVED.`
          }
        ]
      };
    }

    if (chosen === "firefly") {
      return {
        activityId,
        emoji: "✨",
        title: "Play in Nature: Firefly Lights",
        setup: `Night falls and fireflies start blinking like nature’s tiny Wi‑Fi. ${childName} tries to catch a “sparkle bug.”`,
        question: "What’s the plan?",
        choices: [
          {
            id: "short_jar_release",
            label: "Catch for 5 minutes, then release (with air holes!)",
            emoji: "🫙",
            deltas: { intelligence: 2, empathy: 1, discipline: 1, confidence: 0 },
            loveDelta: 0.6,
            stressDelta: 0.2,
            logLine: `You admire the glow, talk about insects, then release it gently. ${childName} says, “Good luck, tiny flashlight.”`
          },
          {
            id: "count_flashes",
            label: "Don’t catch — count flashes like a scientist",
            emoji: "🔢",
            deltas: { intelligence: 3, discipline: 1, empathy: 0, confidence: 0 },
            loveDelta: 0.4,
            stressDelta: -0.2,
            logLine: `You count patterns and make a mini theory. ${childName} feels like a nature spy.`
          },
          {
            id: "dramatic_story",
            label: "Make up a dramatic firefly story",
            emoji: "🎭",
            deltas: { intelligence: 1, confidence: 2, empathy: 1, discipline: 0 },
            loveDelta: 0.8,
            stressDelta: -0.4,
            logLine: `${childName} narrates an epic saga: “Sir Glowington returns to the kingdom.” You both laugh way too hard.`
          }
        ]
      };
    }

    if (chosen === "butterfly") {
      return {
        activityId,
        emoji: "🦋",
        title: "Play in Nature: Butterfly Moment",
        setup: `A butterfly flutters past. ${childName} tries to “gently borrow it for a second.”`,
        question: "How do you handle the butterfly excitement?",
        choices: [
          {
            id: "watch_respect",
            label: "Watch respectfully and learn the life cycle",
            emoji: "🔄",
            deltas: { intelligence: 3, empathy: 1, discipline: 0, confidence: 0 },
            loveDelta: 0.5,
            stressDelta: 0.2,
            logLine: `You talk metamorphosis and how wild it is. ${childName} looks genuinely impressed by… bugs.`
          },
          {
            id: "flower_mission",
            label: "Turn it into a “pollinator mission”",
            emoji: "🌸",
            deltas: { intelligence: 2, empathy: 2, discipline: 1, confidence: 0 },
            loveDelta: 0.6,
            stressDelta: 0.4,
            logLine: `You hunt for flowers like it’s a quest. ${childName} becomes the official Butterfly Helper.`
          },
          {
            id: "silly_chase",
            label: "Do a silly butterfly chase (no grabbing)",
            emoji: "🏃",
            deltas: { intelligence: 1, confidence: 2, empathy: 1, discipline: 0 },
            loveDelta: 0.9,
            stressDelta: -0.3,
            logLine: `You both jog around like joyful weirdos. ${childName} calls it “training for butterfly Olympics.”`
          }
        ]
      };
    }

    if (chosen === "mantis") {
      // Slightly more intense: keep it curious, not traumatic.
      return {
        activityId,
        emoji: "🦗",
        title: "Play in Nature: Mantis vs. Grasshopper",
        setup: `You find a praying mantis holding a grasshopper like it’s about to explain taxes. Nature is… doing nature.`,
        question: "What do you do?",
        choices: [
          {
            id: "food_chain_talk",
            label: "Let it be and explain the food chain",
            emoji: "🧠",
            deltas: { intelligence: 3, empathy: 1, discipline: 0, confidence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.6,
            logLine: `It’s a little intense, but you talk ecosystems and survival. ${childName} learns real-life science.`
          },
          {
            id: "separate_gently",
            label: "Gently separate them",
            emoji: "🫶",
            deltas: { intelligence: 1, empathy: 2, discipline: 1, confidence: 0 },
            loveDelta: 0.5,
            stressDelta: 0.3,
            logLine: `You separate them carefully. ${childName} says, “Everybody gets a second chance today.”`
          },
          {
            id: "walk_away",
            label: "Walk away and reset the vibe",
            emoji: "🍎",
            deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 1 },
            loveDelta: 0.6,
            stressDelta: -0.2,
            logLine: `You pivot to snacks and a different activity. Sometimes the best lesson is: “Nope, not today.”`
          }
        ]
      };
    }

    if (chosen === "fort") {
      return {
        activityId,
        emoji: "🪵",
        title: "Play in Nature: Stick Fort Engineering",
        setup: `${childName} starts dragging sticks around like a tiny contractor. A fort is happening whether you consent or not.`,
        question: "How do you build it?",
        choices: [
          {
            id: "blueprint",
            label: "Make a tiny plan first",
            emoji: "🧩",
            deltas: { intelligence: 2, discipline: 2, confidence: 0, empathy: 0 },
            loveDelta: 0.4,
            stressDelta: 0.5,
            logLine: `You plan, then build. ${childName} calls you “Chief Engineer.” You both feel oddly proud.`
          },
          {
            id: "team_build",
            label: "Team build: roles + teamwork",
            emoji: "🤝",
            deltas: { intelligence: 2, empathy: 1, discipline: 1, confidence: 1 },
            loveDelta: 0.7,
            stressDelta: 0.3,
            logLine: `You split roles and collaborate. The fort is lopsided. The teamwork is excellent.`
          },
          {
            id: "chaos_build",
            label: "Freestyle chaos build (creative mode)",
            emoji: "🎨",
            deltas: { intelligence: 1, confidence: 2, empathy: 0, discipline: 0 },
            loveDelta: 0.8,
            stressDelta: -0.1,
            logLine: `You freestyle it. It looks like a squirrel designed it… but ${childName} is thrilled.`
          }
        ]
      };
    }

    // mud default
    return {
      activityId,
      emoji: "🪣",
      title: "Play in Nature: Mud Potion Lab",
      setup: `You step near a puddle and suddenly ${childName} is brewing “mud soup” like it’s a Michelin-star recipe.`,
      question: "What’s the rule?",
      choices: [
        {
          id: "yes_boundaries",
          label: "Yes, with boundaries (mud zone only)",
          emoji: "📍",
          deltas: { intelligence: 1, discipline: 2, confidence: 1, empathy: 0 },
          loveDelta: 0.5,
          stressDelta: 0.5,
          logLine: `You allow the mess — but contained. ${childName} negotiates like a diplomat. You hold the line.`
        },
        {
          id: "full_send",
          label: "Full send (extra laundry edition)",
          emoji: "🧼",
          deltas: { intelligence: 1, confidence: 2, empathy: 1, discipline: 0 },
          loveDelta: 0.9,
          stressDelta: 0.8,
          logLine: `You let it happen. ${childName} is ecstatic. Your washing machine files a complaint.`
        },
        {
          id: "pivot",
          label: "Pivot to a cleaner nature game",
          emoji: "🪨",
          deltas: { intelligence: 2, discipline: 1, confidence: 0, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: -0.1,
          logLine: `You pivot to rocks, sticks, and skipping. Less mess — still outdoors, still learning.`
        }
      ]
    };
  }

  if (activityId === "rock_leaf_museum") {
    if (band === "young") {
      return {
        activityId,
        emoji: "🪨",
        title: "Rock & Leaf Museum",
        setup: `${childName} starts collecting rocks and leaves like they’re rare artifacts. Your pockets become a traveling museum.`,
        question: "What’s the museum policy?",
        choices: [
          {
            id: "one_treasure",
            label: "One treasure each (museum rules!)",
            emoji: "🏛️",
            deltas: { intelligence: 1, discipline: 2, confidence: 0, empathy: 0 },
            loveDelta: 0.4,
            stressDelta: 0.3,
            logLine: `You pick one “top artifact” each. ${childName} takes this very seriously.`
          },
          {
            id: "photo_only",
            label: "Photo-only scavenger hunt",
            emoji: "📷",
            deltas: { intelligence: 2, empathy: 1, discipline: 1, confidence: 0 },
            loveDelta: 0.6,
            stressDelta: -0.2,
            logLine: `You take photos and name them. ${childName} loves the “collection” with zero mess at home.`
          },
          {
            id: "take_everything",
            label: "Take everything (chaos mode)",
            emoji: "🌀",
            deltas: { intelligence: 1, discipline: -1, confidence: 1, empathy: 0 },
            loveDelta: 0.2,
            stressDelta: 1,
            logLine: `You bring home a geological fortune. Later, you find a rock in the couch. The museum is… everywhere.`
          }
        ]
      };
    }

    return {
      activityId,
      emoji: "🪨",
      title: "Rock & Leaf Museum",
      setup: `You and ${childName} start curating a “museum.” You end up debating what counts as “rare” with shocking intensity.`,
      question: "How do you level it up?",
      choices: [
        {
          id: "label_and_sort",
          label: "Label + sort like a real collection",
          emoji: "🏷️",
          deltas: { intelligence: 3, discipline: 1, confidence: 0, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: 0.5,
          logLine: `You label and sort everything. ${childName} learns classification and acts like a curator on opening night.`
        },
        {
          id: "research_one",
          label: "Research ONE item deeply",
          emoji: "📖",
          deltas: { intelligence: 3, discipline: 0, confidence: 1, empathy: 0 },
          loveDelta: 0.4,
          stressDelta: 0.2,
          logLine: `You research one rock/leaf together. ${childName} discovers that “boring” things are actually complicated.`
        },
        {
          id: "leave_some",
          label: "Take a few, leave a few (respect the place)",
          emoji: "🌿",
          deltas: { intelligence: 2, empathy: 2, discipline: 0, confidence: 0 },
          loveDelta: 0.5,
          stressDelta: -0.2,
          logLine: `You keep some treasures but leave others. ${childName} learns stewardship without losing the fun.`
        }
      ]
    };
  }

  if (activityId === "cloud_detective") {
    if (band === "young") {
      return {
        activityId,
        emoji: "☁️",
        title: "Cloud Detective",
        setup: `You lie down and stare at the sky. ${childName} points at a cloud and says, “That one is definitely a dinosaur eating spaghetti.”`,
        question: "What’s your cloud strategy?",
        choices: [
          {
            id: "make_stories",
            label: "Make cloud stories",
            emoji: "📚",
            deltas: { intelligence: 1, confidence: 2, empathy: 1, discipline: 0 },
            loveDelta: 0.8,
            stressDelta: -0.4,
            logLine: `You make stories together. ${childName} becomes a cloud novelist. The plot makes no sense. Perfect.`
          },
          {
            id: "tiny_science",
            label: "Tiny science: “what might happen next?”",
            emoji: "🔬",
            deltas: { intelligence: 2, discipline: 1, confidence: 0, empathy: 0 },
            loveDelta: 0.4,
            stressDelta: 0.2,
            logLine: `You gently predict weather: “Those clouds might mean rain.” ${childName} is impressed by your wizard powers.`
          },
          {
            id: "breathing_game",
            label: "Turn it into a calm-down breathing game",
            emoji: "🧘",
            deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 0 },
            loveDelta: 0.6,
            stressDelta: -0.8,
            logLine: `You breathe slowly together. ${childName} tries… then laughs… then actually relaxes.`
          }
        ]
      };
    }

    return {
      activityId,
      emoji: "☁️",
      title: "Cloud Detective",
      setup: `You and ${childName} stare at the sky like it’s a giant mood ring. The clouds are shifting fast.`,
      question: "How do you run the investigation?",
      choices: [
        {
          id: "learn_cloud_types",
          label: "Learn cloud types (yes, there are categories)",
          emoji: "🧠",
          deltas: { intelligence: 3, discipline: 1, confidence: 0, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: 0.4,
          logLine: `${childName} learns that clouds have names. They immediately start correcting strangers in their head.`
        },
        {
          id: "predict_weather",
          label: "Predict the weather, then test it",
          emoji: "🌦️",
          deltas: { intelligence: 3, discipline: 1, confidence: 1, empathy: 0 },
          loveDelta: 0.2,
          stressDelta: 0.5,
          logLine: `You predict and test. When you’re right, ${childName} looks at you like you invented the sky.`
        },
        {
          id: "cloud_art",
          label: "Cloud sketches + meanings",
          emoji: "✏️",
          deltas: { intelligence: 2, confidence: 2, empathy: 0, discipline: 0 },
          loveDelta: 0.5,
          stressDelta: -0.2,
          logLine: `You sketch clouds and make up meanings. It’s science-adjacent and surprisingly bonding.`
        }
      ]
    };
  }

  if (activityId === "map_quest") {
    if (band === "young") {
      return {
        activityId,
        emoji: "🧭",
        title: "Mini Expedition Map Quest",
        setup: `You draw a tiny treasure map. ${childName} takes it so seriously they start whispering like a pirate.`,
        question: "How do you run the quest?",
        choices: [
          {
            id: "kid_leads",
            label: "Let them lead (you pretend not to know)",
            emoji: "🏴‍☠️",
            deltas: { intelligence: 1, confidence: 2, empathy: 0, discipline: 1 },
            loveDelta: 0.8,
            stressDelta: -0.2,
            logLine: `${childName} leads bravely. You follow like a loyal crew member. They feel powerful in the best way.`
          },
          {
            id: "team_plan",
            label: "Plan together: “what’s our route?”",
            emoji: "🗺️",
            deltas: { intelligence: 2, discipline: 2, confidence: 0, empathy: 0 },
            loveDelta: 0.4,
            stressDelta: 0.4,
            logLine: `You plan a route together. ${childName} learns sequencing and immediately adds “trap doors” to the map.`
          },
          {
            id: "clue_game",
            label: "Clue game: solve riddles to move on",
            emoji: "🧩",
            deltas: { intelligence: 3, discipline: 1, confidence: 0, empathy: 0 },
            loveDelta: 0.3,
            stressDelta: 0.5,
            logLine: `You do riddles. ${childName} surprises you with logic… then asks if rocks are edible.`
          }
        ]
      };
    }

    return {
      activityId,
      emoji: "🧭",
      title: "Mini Expedition Map Quest",
      setup: `You and ${childName} do a mini expedition: neighborhood route, park loop, or trail. You navigate without relying on autopilot.`,
      question: "Who runs the navigation?",
      choices: [
        {
          id: "kid_navigator",
          label: "Make them the navigator",
          emoji: "🧑‍✈️",
          deltas: { intelligence: 2, confidence: 2, discipline: 1, empathy: 0 },
          loveDelta: 0.5,
          stressDelta: 0.4,
          logLine: `${childName} navigates and takes it seriously. They learn direction, planning, and a little accountability.`
        },
        {
          id: "swap_roles",
          label: "Swap roles halfway",
          emoji: "🔁",
          deltas: { intelligence: 2, confidence: 1, discipline: 1, empathy: 1 },
          loveDelta: 0.6,
          stressDelta: 0.2,
          logLine: `You swap roles halfway. ${childName} learns perspective… and that navigation is harder than it looks.`
        },
        {
          id: "time_trial",
          label: "Time-trial challenge (safe + fun)",
          emoji: "⏱️",
          deltas: { intelligence: 2, confidence: 1, discipline: 1, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: 0.6,
          logLine: `You do a playful time trial. ${childName} learns pacing and focus — and demands a rematch.`
        }
      ]
    };
  }

  if (activityId === "seed_to_sprout") {
    return {
      activityId,
      emoji: "🌱",
      title: "Seed-to-Sprout Lab",
      setup: `You and ${childName} plant seeds. It’s part science, part patience training, and part “please don’t forget to water it.”`,
      question: "How do you do the experiment?",
      choices: [
        {
          id: "conditions_experiment",
          label: "Test conditions: sun vs shade vs water",
          emoji: "🔬",
          deltas: { intelligence: 3, discipline: 1, confidence: 0, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: 0.5,
          logLine: `You run a mini experiment. ${childName} learns variables — and gets weirdly proud of “Plant #2.”`
        },
        {
          id: "daily_responsibility",
          label: "Adopt-a-plant: daily care chart",
          emoji: "✅",
          deltas: { intelligence: 2, discipline: 2, confidence: 1, empathy: 0 },
          loveDelta: 0.2,
          stressDelta: 0.6,
          logLine: `${childName} tracks watering like a pro. Discipline grows… along with the plant. Hopefully.`
        },
        {
          id: "compost_worms",
          label: "Start compost (aka: the worm hotel)",
          emoji: "🪱",
          deltas: { intelligence: 2, empathy: 1, discipline: 1, confidence: 0 },
          loveDelta: 0.4,
          stressDelta: 0.5,
          logLine: `${childName} meets worms and becomes weirdly protective of them. “They’re recycling heroes.”`
        }
      ]
    };
  }

  if (activityId === "night_sounds_safari") {
    return {
      activityId,
      emoji: "🌙",
      title: "Night Sounds Safari",
      setup: `You go outside at night. Everything sounds louder, weirder, and slightly more mysterious. ${childName} is equal parts excited and dramatic.`,
      question: "How do you explore?",
      choices: [
        {
          id: "sound_scavenger",
          label: "Sound scavenger hunt",
          emoji: "👂",
          deltas: { intelligence: 2, empathy: 1, discipline: 1, confidence: 0 },
          loveDelta: 0.6,
          stressDelta: -0.1,
          logLine: `You hunt sounds: crickets, wind, distant dogs. ${childName} learns attention like a superpower.`
        },
        {
          id: "record_and_id",
          label: "Record sounds, identify later",
          emoji: "🎙️",
          deltas: { intelligence: 3, discipline: 1, confidence: 0, empathy: 0 },
          loveDelta: 0.3,
          stressDelta: 0.4,
          logLine: `You record mystery sounds and later identify them. ${childName} feels like a researcher on a mission.`
        },
        {
          id: "silent_minute",
          label: "Silent minute challenge (then discuss)",
          emoji: "🤫",
          deltas: { intelligence: 1, discipline: 2, empathy: 1, confidence: 0 },
          loveDelta: 0.5,
          stressDelta: -0.3,
          logLine: `You do a silent minute. ${childName} makes it 22 seconds… then tries again. Growth is real.`
        }
      ]
    };
  }

  if (activityId === "trail_cleanup_mission") {
    return {
      activityId,
      emoji: "🧤",
      title: "Trail Cleanup Mission",
      setup: `You spot litter. ${childName} looks at it like it personally offended them. A mission is forming.`,
      question: "How do you do it?",
      choices: [
        {
          id: "game_points",
          label: "Make it a points game",
          emoji: "🏁",
          deltas: { intelligence: 1, discipline: 2, confidence: 1, empathy: 1 },
          loveDelta: 0.5,
          stressDelta: 0.4,
          logLine: `You turn cleanup into a game. ${childName} is suddenly the fastest helpful person alive.`
        },
        {
          id: "stewardship_talk",
          label: "Talk stewardship + community",
          emoji: "🌍",
          deltas: { intelligence: 1, empathy: 2, discipline: 1, confidence: 0 },
          loveDelta: 0.3,
          stressDelta: 0.5,
          logLine: `You talk about taking care of shared places. ${childName} feels proud — like a tiny guardian.`
        },
        {
          id: "quiet_lead",
          label: "Lead quietly by example",
          emoji: "🧘",
          deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 1 },
          loveDelta: 0.4,
          stressDelta: -0.1,
          logLine: `You just start cleaning without a speech. ${childName} follows. Sometimes that’s the strongest lesson.`
        }
      ]
    };
  }

  // Fallback (shouldn’t happen)
  return {
    activityId,
    emoji: "🌿",
    title: "Nature Play",
    setup: `You step outside with ${childName}. Somehow, it becomes a learning moment.`,
    question: "What do you do?",
    choices: [
      {
        id: "default",
        label: "Follow their curiosity",
        emoji: "✨",
        deltas: { intelligence: 1, empathy: 1, confidence: 1, discipline: 0 },
        loveDelta: 0.5,
        stressDelta: -0.2,
        logLine: `You follow ${childName}’s curiosity and it turns into a surprisingly sweet moment.`
      }
    ]
  };
}