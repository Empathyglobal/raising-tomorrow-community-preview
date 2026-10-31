/**
 * Dating Date Night Expansion (BitLife-style)
 * - Pick a date idea
 * - Roll: Great / Good / Meh / Bad
 * - Generate a mini story (PG, parenting-friendly)
 * - Output deltas for Stress/Love + a "meterDelta" (chemistry for singles, partnerMeter for couples)
 *
 * Placeholders supported in story fragments:
 *  {name}      -> partner/match name
 *  {childName} -> child name (fallback: "your kid")
 *  {activity}  -> date activity label
 */

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const round1 = (n) => Math.round(n * 10) / 10;

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

const rollWeighted = (rng, items) => {
  const total = items.reduce((sum, it) => sum + (it.weight || 0), 0);
  let r = rng() * total;
  for (const it of items) {
    r -= (it.weight || 0);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
};

const fill = (tpl, ctx) =>
  String(tpl).replace(/\{(\w+)\}/g, (_, key) => {
    const v = ctx?.[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });

const QUALITY_LABEL = {
  great: "Great",
  good: "Good",
  meh: "Meh",
  bad: "Bad"
};

// These are MODIFIERS added on top of the activity's base effects.
// Overall dating is positive, but "bad" is meaningfully bad.
const QUALITY_MODS = {
  great: { stressDelta: -2.0, loveDelta: 0.2, meterDelta: 10 },
  good:  { stressDelta: -1.0, loveDelta: 0.1, meterDelta: 6  },
  meh:   { stressDelta:  0.0, loveDelta: 0.0, meterDelta: 1  },
  bad:   { stressDelta:  1.8, loveDelta: -0.2, meterDelta: -9 }
};

// Flavor pools (combinatorial = lots of possible stories)
const OPENERS_SINGLE = [
  "You arrive five minutes early and pretend you're just *really into ambiance*.",
  "You do the mirror pep-talk: “Be normal.” Immediately, you are not.",
  "Your stomach does that tiny flip like it’s 2009 and you’re about to text first.",
  "You consider canceling for three seconds, then remember you deserve fun too.",
  "You walk in like it’s chill. It is… mostly chill.",
  "You rehearse a greeting in your head and still say something slightly different out loud.",
  "You silence your phone… and then check it anyway. For safety. For science.",
  "You remind yourself: this is not a performance review. It's a date.",
  "You take a deep breath and choose curiosity over catastrophizing.",
  "You show up tired, but determined to let the night be kind to you.",
  "You double-check your phone: babysitter status… green light.",
  "You remind yourself this counts as self-care, actually.",
  "You practice saying ‘I’m a parent’ casually. It’s never casual.",
  "You mentally review your kid's schedule one last time, then exhale.",
  "You check for spit-up on your shirt. Clear. Probably.",
  "You send one last 'emergency only' text to the sitter, then silence the phone."
];

const OPENERS_PARTNER = [
  "After a sitter shuffle and a last-second outfit debate, you and {name} step into the night like you still remember how to be adults.",
  "You and {name} high-five because the sitter arrived on time. Romance, but make it logistics.",
  "You both promise not to talk about chores. You both lie a little.",
  "You and {name} leave the house quietly like you're escaping a museum exhibit called “Parenting.”",
  "You exchange that look that means: “We’re tired, but we’re trying.”",
  "You and {name} get into the car and just sit in silence for a second. It’s… nice.",
  "You both laugh because you almost forgot your keys—again. Classic you.",
  "You and {name} decide tonight is for connection, not efficiency. (You try.)",
  "You step outside and realize fresh air is basically a luxury item.",
  "You and {name} agree: no heavy talks unless the night earns it."
];

const GOOD_MOMENTS = [
  "At some point you both laugh at the same tiny thing—a very confident pigeon, a dramatic menu item—and it feels like a secret handshake.",
  "{name} asks a real question and actually waits for the answer.",
  "You catch yourself smiling before you can stop it.",
  "Nobody talks about schedules for ten full minutes. Your shoulders drop.",
  "You both admit the weirdest snack you hide from your kid, and it’s the same one.",
  "The conversation stays warm even when it gets honest.",
  "You realize you’re not bracing for impact—you’re present.",
  "There’s an easy quiet that doesn’t feel like punishment.",
  "You both share a story that could’ve been embarrassing, and it lands gently instead.",
  "{name} notices you’re tired and doesn’t make you perform.",
  "You end up talking about what you want life to feel like, not just what you need to do.",
  "You both do that thing where you try not to laugh and then fail spectacularly."
];

const BAD_MOMENTS = [
  "The conversation keeps snagging on awkward silences that feel a little too loud.",
  "A message pops up that says, “We need to talk,” and your stomach drops.",
  "{name} makes a joke about parenting that lands wrong, and you can’t unhear it.",
  "You both keep checking your phones, and it turns into a quiet competition.",
  "The place is so loud you end up shouting about groceries and it’s not romantic.",
  "The bill shows up and you realize you disagree about money in a big way.",
  "You spill something immediately. It is not a charming rom-com spill.",
  "You both show up tired and it turns into two exhausted people politely failing.",
  "You run into someone you know and the small talk becomes a hostage situation.",
  "A tiny misunderstanding becomes a bigger one because neither of you has the energy for nuance."
];

const GOOD_TWISTS = [
  "A small hiccup happens, and you two handle it like a team. That’s the actual romance.",
  "You both end up making fun of yourselves in the same gentle way, and it’s weirdly intimate.",
  "You discover you have the same oddly specific comfort movie and you both get way too excited.",
  "The night turns into a mini reset—you remember you’re allowed to be a person, not just a parent.",
  "You share a future-ish thought and it doesn’t feel scary. It feels steady.",
  "You leave with a tiny inside joke that makes the whole week feel lighter.",
  "You realize you feel safer after the date than before it.",
  "{name} does something thoughtful that costs nothing, and it hits harder than fancy plans.",
  "You talk about boundaries in a way that feels respectful, not tense.",
  "You both agree the one simple thing: you want peace in your home."
];

const BAD_TWISTS = [
  "The night starts feeling like a negotiation instead of a connection.",
  "You catch yourself performing, and suddenly you’re exhausted by your own face.",
  "Something small—tone, timing, a joke—lands wrong and sticks.",
  "You both try to fix the vibe and accidentally make it worse.",
  "The date becomes a series of polite compromises that nobody enjoys.",
  "You realize you’re not being met with curiosity—you’re being evaluated.",
  "A logistical curveball (late sitter, weird parking, long line) eats the whole mood.",
  "You leave feeling more alone than when you arrived, which is impressive, honestly.",
  "You both want the night to be good, but wanting isn’t the same as it being good.",
  "You silently decide you’d rather be home in sweatpants than proving a point."
];

const ENDINGS_GOOD = [
  "When you get home, {childName} is asleep. You and {name} high-five in the hallway like co-survivors.",
  "You end the night with a hug that lingers one second longer than usual, in a good way.",
  "On the way back, you realize your jaw isn’t clenched. That’s a win.",
  "You go to bed feeling a little more human and a little less haunted by your to-do list.",
  "You send a “Made it home” text and actually mean the smiley face.",
  "You fall asleep thinking, “Okay… that was nice. I want more of that.”",
  "You catch yourself planning the next date, quietly, without panic.",
  "{name} says something simple like “I’m glad we did this,” and it lands."
];

const ENDINGS_BAD = [
  "You get home and immediately crave silence like it’s medicine.",
  "You lie in bed replaying the night and wishing you could edit your own dialogue.",
  "You decide to call it an early night because your brain is done taking feedback.",
  "You end up doom-scrolling for comfort, which is a cruel hobby.",
  "You clean something that doesn’t need cleaning just to move the stress somewhere else.",
  "You go to bed feeling heavier, like the date took more than it gave.",
  "You realize the best part of the night was leaving. Ouch."
];

const SUMMARY_BY_QUALITY = {
  great: [
    "✨ {activity} turns into a real reset with {name}.",
    "✨ You and {name} absolutely nail {activity}.",
    "✨ A surprisingly perfect {activity} with {name}."
  ],
  good: [
    "💛 {activity} with {name} goes genuinely well.",
    "💛 A solid {activity} with {name}.",
    "💛 {activity} with {name} leaves you lighter."
  ],
  meh: [
    "😐 {activity} with {name} is… fine. Just fine.",
    "😐 {activity} with {name} is a neutral experience.",
    "😐 {activity} with {name} happens. Nobody wins."
  ],
  bad: [
    "💥 {activity} with {name} goes kind of rough.",
    "💥 A bad vibe creeps into {activity} with {name}.",
    "💥 {activity} with {name} leaves you stressed."
  ]
};

// 30+ date ideas with activity-specific scenes.
// Risk is only used for UI flavor; outcomes are handled by weights + random roll.
export const DATE_IDEAS = [
  // LOW-KEY
  {
    id: "coffee_walk",
    category: "Low-Key",
    emoji: "☕",
    label: "Coffee & Walk",
    blurb: "Low pressure, high conversation, easy exit.",
    baseCost: 18,
    risk: "low",
    effects: { stressDelta: -0.8, loveDelta: 0.1, meterDelta: 5 },
    scenes: [
      "You meet {name} at a small coffee spot that smells like cinnamon and second chances.",
      "You grab drinks and wander aimlessly, rating dogs you pass like you're both judges on a wholesome reality show.",
      "You split something sweet and take a slow walk where nobody has to be impressive.",
      "You choose outdoor seating so you can breathe. It helps more than you expected."
    ]
  },
  {
    id: "bookstore_browse",
    category: "Low-Key",
    emoji: "📚",
    label: "Bookstore Browsing",
    blurb: "Quiet, cozy, and full of conversation starters.",
    baseCost: 22,
    risk: "low",
    effects: { stressDelta: -0.7, loveDelta: 0.1, meterDelta: 5 },
    scenes: [
      "You wander a bookstore with {name}, pretending you’re just “browsing” while secretly judging each other’s taste.",
      "You both pick the worst romance novel cover you can find and take it way too seriously.",
      "You spend ten minutes in the stationery aisle like it’s a museum exhibit called “Hope.”",
      "You find a tiny kids’ section and both go quiet for a second, in a thoughtful way."
    ]
  },
  {
    id: "farmers_market",
    category: "Low-Key",
    emoji: "🥕",
    label: "Farmers Market Stroll",
    blurb: "Snacks, sunlight, and pretending to know about vegetables.",
    baseCost: 28,
    risk: "low",
    effects: { stressDelta: -0.8, loveDelta: 0.1, meterDelta: 5 },
    scenes: [
      "You and {name} wander a farmers market like you’re starring in a calm lifestyle show.",
      "You sample an alarming number of jams and develop very strong opinions very quickly.",
      "You buy something you don’t normally buy—just because it looks cheerful.",
      "You stand near a flower stall and suddenly everything feels softer."
    ]
  },
  {
    id: "ice_cream_drive",
    category: "Low-Key",
    emoji: "🍦",
    label: "Ice Cream & Drive",
    blurb: "Simple, sweet, and surprisingly soothing.",
    baseCost: 16,
    risk: "low",
    effects: { stressDelta: -0.7, loveDelta: 0.1, meterDelta: 4 },
    scenes: [
      "You and {name} get ice cream and immediately regret not ordering the bigger size.",
      "You sit in the car and talk like the world isn’t expecting anything from you right now.",
      "You pick the weirdest flavor on purpose, for bravery.",
      "You take the long way back just because the night feels calm."
    ]
  },
  {
    id: "picnic_park",
    category: "Low-Key",
    emoji: "🧺",
    label: "Picnic in the Park",
    blurb: "Blanket, snacks, and a little bit of movie magic.",
    baseCost: 30,
    risk: "medium",
    effects: { stressDelta: -0.6, loveDelta: 0.1, meterDelta: 6 },
    scenes: [
      "You lay out a picnic with {name} and try to keep the wind from stealing your dignity.",
      "You eat snacks like they’re fancy, even if they’re just… normal snacks.",
      "You people-watch and invent harmless backstories for strangers.",
      "You lean back and let the sky do some of the work for you."
    ]
  },
  {
    id: "stargazing",
    category: "Low-Key",
    emoji: "✨",
    label: "Stargazing",
    blurb: "Low cost, high feelings, small blanket energy.",
    baseCost: 8,
    risk: "medium",
    effects: { stressDelta: -0.6, loveDelta: 0.1, meterDelta: 6 },
    scenes: [
      "You and {name} find a quiet spot and pretend you know constellations.",
      "You share a blanket and point at the sky like it’s telling secrets.",
      "You make up star names that are suspiciously emotional.",
      "The night is quiet enough to hear your own thoughts… and they’re not mean for once."
    ]
  },
  {
    id: "thrift_store_date",
    category: "Low-Key",
    emoji: "🧥",
    label: "Thrift Store Challenge",
    blurb: "Find each other an outfit. Be kind. Laugh a lot.",
    baseCost: 20,
    risk: "low",
    effects: { stressDelta: -0.7, loveDelta: 0.1, meterDelta: 6 },
    scenes: [
      "You and {name} do a thrift-store challenge: pick each other an outfit and commit fully.",
      "You find something ridiculous and immediately insist it’s a “statement piece.”",
      "You both get weirdly excited over a perfect mug you don’t need.",
      "You laugh in a way that makes other people glance over and smile."
    ]
  },

  // PLAYFUL
  {
    id: "mini_golf",
    category: "Playful",
    emoji: "⛳",
    label: "Mini Golf",
    blurb: "Low stakes competition (and mild trash talk).",
    baseCost: 40,
    risk: "medium",
    effects: { stressDelta: -0.5, loveDelta: 0.0, meterDelta: 7 },
    scenes: [
      "You and {name} play mini golf like it’s the Olympics and your pride is on the line.",
      "You both pretend you’re calm while secretly keeping score in your soul.",
      "A child nearby is better than both of you and you have to accept it spiritually.",
      "You try a trick shot and immediately learn humility."
    ]
  },
  {
    id: "bowling",
    category: "Playful",
    emoji: "🎳",
    label: "Bowling",
    blurb: "Comfort food energy + goofy high fives.",
    baseCost: 55,
    risk: "medium",
    effects: { stressDelta: -0.4, loveDelta: 0.0, meterDelta: 7 },
    scenes: [
      "You and {name} bowl with confidence that is not supported by skill.",
      "You both celebrate strikes like you invented bowling.",
      "Someone’s shoes squeak dramatically and it becomes an ongoing joke.",
      "You eat fries like they’re part of the emotional experience."
    ]
  },
  {
    id: "arcade",
    category: "Playful",
    emoji: "🕹️",
    label: "Arcade Night",
    blurb: "Tickets, neon lights, and accidental intensity.",
    baseCost: 65,
    risk: "medium",
    effects: { stressDelta: -0.3, loveDelta: 0.0, meterDelta: 7 },
    scenes: [
      "You and {name} hit an arcade and immediately take it too seriously.",
      "You win a tiny prize that is objectively useless and emotionally priceless.",
      "A game malfunctions and you both treat it like a conspiracy.",
      "You discover {name} has a hidden talent and it’s mildly intimidating."
    ]
  },
  {
    id: "escape_room",
    category: "Playful",
    emoji: "🧩",
    label: "Escape Room",
    blurb: "Teamwork… or a gentle chaos test.",
    baseCost: 90,
    risk: "high",
    effects: { stressDelta: -0.1, loveDelta: 0.0, meterDelta: 8 },
    weights: { great: 12, good: 50, meh: 20, bad: 18 },
    scenes: [
      "You and {name} enter an escape room and immediately argue about what counts as a clue.",
      "You find a lock that refuses to cooperate, like it has personal boundaries.",
      "You both get very confident about the wrong solution for a solid five minutes.",
      "You solve something and feel like geniuses, briefly."
    ]
  },
  {
    id: "karaoke",
    category: "Playful",
    emoji: "🎤",
    label: "Karaoke",
    blurb: "Brave, chaotic, and weirdly bonding.",
    baseCost: 45,
    risk: "high",
    effects: { stressDelta: -0.2, loveDelta: 0.0, meterDelta: 8 },
    weights: { great: 14, good: 48, meh: 20, bad: 18 },
    scenes: [
      "You and {name} do karaoke and discover confidence is mostly volume.",
      "Someone before you sings with terrifying talent and you have to follow that.",
      "You pick a song you loved as a teenager and immediately become that teenager again.",
      "You both agree the point is *commitment*, not excellence."
    ]
  },
  {
    id: "paint_night",
    category: "Playful",
    emoji: "🎨",
    label: "Paint Night",
    blurb: "Art, snacks, and laughing at your own masterpieces.",
    baseCost: 75,
    risk: "medium",
    effects: { stressDelta: -0.4, loveDelta: 0.1, meterDelta: 7 },
    scenes: [
      "You and {name} go to a paint night and quickly learn you have strong feelings about brush strokes.",
      "Your painting turns out… abstract. You claim it’s intentional.",
      "You both end up with paint on your hands and call it “character.”",
      "Somebody’s canvas is unbelievably good and you feel personally attacked."
    ]
  },
  {
    id: "dance_class",
    category: "Playful",
    emoji: "💃",
    label: "Beginner Dance Class",
    blurb: "Awkward at first, adorable by the end.",
    baseCost: 85,
    risk: "high",
    effects: { stressDelta: -0.2, loveDelta: 0.1, meterDelta: 8 },
    weights: { great: 12, good: 52, meh: 18, bad: 18 },
    scenes: [
      "You and {name} take a beginner dance class and immediately forget what your feet are for.",
      "The instructor says “relax” and you both laugh, because that’s not how bodies work.",
      "You step on each other’s toes and call it intimacy.",
      "Somehow, you start moving in sync for a few seconds and it feels like magic."
    ]
  },

  // CULTURE / ENTERTAINMENT
  {
    id: "museum",
    category: "Culture",
    emoji: "🏛️",
    label: "Museum Date",
    blurb: "Quiet, thoughtful, and full of conversation hooks.",
    baseCost: 55,
    risk: "low",
    effects: { stressDelta: -0.6, loveDelta: 0.1, meterDelta: 6 },
    scenes: [
      "You and {name} wander a museum and make up dramatic backstories for portraits.",
      "You stand in front of one piece way too long, pretending you’re deep.",
      "You both find something unexpectedly moving and don’t rush past it.",
      "You read exhibit labels with the intensity of people trying to be good at life."
    ]
  },
  {
    id: "comedy_show",
    category: "Culture",
    emoji: "😂",
    label: "Comedy Show",
    blurb: "Laughing counts as self-care.",
    baseCost: 80,
    risk: "medium",
    effects: { stressDelta: -0.5, loveDelta: 0.0, meterDelta: 7 },
    scenes: [
      "You and {name} go to a comedy show and immediately test your laugh-compatibility.",
      "A joke hits a little too close to home and you both make eye contact like, “Yep.”",
      "The comedian roasts the front row and you’re relieved you’re not in it.",
      "You laugh hard enough that your body remembers what joy feels like."
    ]
  },
  {
    id: "live_music",
    category: "Culture",
    emoji: "🎶",
    label: "Live Music",
    blurb: "A soundtrack for your nervous system.",
    baseCost: 90,
    risk: "medium",
    effects: { stressDelta: -0.4, loveDelta: 0.0, meterDelta: 7 },
    scenes: [
      "You and {name} catch live music and let the sound do some of the talking.",
      "You both pretend you’re cool about it, but you’re actually having feelings.",
      "The crowd sways like a sea of humans trying to cope.",
      "You share a look during a favorite song moment that says: “This is nice.”"
    ]
  },
  {
    id: "movie_night",
    category: "Culture",
    emoji: "🎬",
    label: "Movie Night",
    blurb: "Popcorn therapy + shared reactions.",
    baseCost: 60,
    risk: "low",
    effects: { stressDelta: -0.5, loveDelta: 0.0, meterDelta: 5 },
    scenes: [
      "You and {name} go to a movie and treat snacks like an important part of the plot.",
      "You both whisper jokes and then apologize and then whisper again.",
      "The film is better than expected and you feel grateful for small surprises.",
      "You leave quoting one line like it’s now part of your personality."
    ]
  },
  {
    id: "aquarium",
    category: "Culture",
    emoji: "🐠",
    label: "Aquarium Visit",
    blurb: "Quiet wonder + fish with attitude.",
    baseCost: 70,
    risk: "low",
    effects: { stressDelta: -0.6, loveDelta: 0.1, meterDelta: 6 },
    scenes: [
      "You and {name} visit an aquarium and immediately pick favorites like it’s a draft.",
      "A fish stares at you with judgment and you respect it.",
      "You both get calm in that dim blue light like your brain needed it.",
      "You stand in front of jellyfish and feel your own thoughts slow down."
    ]
  },
  {
    id: "food_truck_tour",
    category: "Culture",
    emoji: "🌮",
    label: "Food Truck Tour",
    blurb: "Little bites, lots of laughter.",
    baseCost: 55,
    risk: "medium",
    effects: { stressDelta: -0.4, loveDelta: 0.0, meterDelta: 7 },
    scenes: [
      "You and {name} try multiple food trucks and become professional snack critics.",
      "You both pretend you’re going to split things and then immediately do not.",
      "Someone drops a taco and everyone mourns briefly.",
      "You discover a weirdly perfect combo and feel like you unlocked a level."
    ]
  },

  // COZY / HOMEY
  {
    id: "cooking_class",
    category: "Cozy",
    emoji: "👩‍🍳",
    label: "Cooking Class",
    blurb: "Teamwork, knives (safely), and delicious pride.",
    baseCost: 110,
    risk: "medium",
    effects: { stressDelta: -0.2, loveDelta: 0.1, meterDelta: 8 },
    scenes: [
      "You and {name} take a cooking class and immediately argue about chopping technique like you’re both chefs.",
      "You burn something slightly and call it “smoky.”",
      "You taste the final dish and feel proud in a very adult way.",
      "You end up laughing while cleaning up like you’re in a montage."
    ]
  },
  {
    id: "home_game_night",
    category: "Cozy",
    emoji: "🎲",
    label: "Board Game Café",
    blurb: "Playful connection with low pressure.",
    baseCost: 45,
    risk: "medium",
    effects: { stressDelta: -0.4, loveDelta: 0.1, meterDelta: 7 },
    scenes: [
      "You and {name} hit a board game café and pick a game that looks easy and is not.",
      "You both make alliances and break them immediately. It’s fine. It’s healthy.",
      "A nearby table is loudly competitive and you feel validated by comparison.",
      "You realize laughter is basically nervous system glue."
    ]
  },
  {
    id: "sunset_hike",
    category: "Adventure",
    emoji: "🥾",
    label: "Sunset Hike",
    blurb: "Fresh air and feelings (weather may vary).",
    baseCost: 0,
    risk: "high",
    effects: { stressDelta: -0.5, loveDelta: 0.1, meterDelta: 8 },
    weights: { great: 14, good: 45, meh: 20, bad: 21 },
    scenes: [
      "You and {name} hike at sunset and pretend your lungs aren’t filing complaints.",
      "You stop at a viewpoint and let the sky remind you the world is bigger than the day you had.",
      "You both bring water and feel wildly responsible.",
      "A breeze hits and you both go quiet in a peaceful way."
    ]
  },
  {
    id: "beach_evening",
    category: "Adventure",
    emoji: "🏖️",
    label: "Beach / Lakeside Evening",
    blurb: "Sand, water, and calm—unless the wind chooses violence.",
    baseCost: 15,
    risk: "high",
    effects: { stressDelta: -0.4, loveDelta: 0.1, meterDelta: 8 },
    weights: { great: 14, good: 45, meh: 20, bad: 21 },
    scenes: [
      "You and {name} walk near the water and let your thoughts float away a little.",
      "You sit and watch the light change and feel your brain stop sprinting.",
      "You throw a rock and it skips once and you both celebrate like it’s a miracle.",
      "You share snacks and your hands smell like sunscreen and peace."
    ]
  },
  {
    id: "roller_skating",
    category: "Adventure",
    emoji: "🛼",
    label: "Roller Skating",
    blurb: "Goofy, brave, and a little chaotic.",
    baseCost: 50,
    risk: "high",
    effects: { stressDelta: -0.1, loveDelta: 0.0, meterDelta: 8 },
    weights: { great: 12, good: 48, meh: 18, bad: 22 },
    scenes: [
      "You and {name} go roller skating and immediately discover your ankles have opinions.",
      "You wobble, you laugh, you grab a wall like it’s your best friend.",
      "A kid zooms past like a comet and you feel humbled spiritually.",
      "You both attempt a spin and learn a lesson about humility."
    ]
  },

  // FANCY / BIG SWING
  {
    id: "fancy_dinner",
    category: "Fancy",
    emoji: "🍽️",
    label: "Fancy Dinner",
    blurb: "Dress up, slow down, and pretend you’re not tired.",
    baseCost: 180,
    risk: "medium",
    effects: { stressDelta: -0.2, loveDelta: 0.0, meterDelta: 8 },
    scenes: [
      "You and {name} go to a fancy dinner and suddenly remember how candles work.",
      "You read the menu like it’s a puzzle you’re determined to solve.",
      "You both try a new thing and feel brave in a silly way.",
      "Dessert arrives and you realize you’ve been relaxed for a full minute."
    ]
  },
  {
    id: "rooftop_mocktails",
    category: "Fancy",
    emoji: "🌆",
    label: "Rooftop Drinks (Mocktails OK)",
    blurb: "City lights + deep talks if the vibe allows.",
    baseCost: 140,
    risk: "medium",
    effects: { stressDelta: -0.2, loveDelta: 0.0, meterDelta: 8 },
    scenes: [
      "You and {name} sit under string lights and let the city do the flirting for you.",
      "You sip something fancy and feel like a person with hobbies.",
      "You both people-watch and create a whole imaginary sitcom.",
      "The air is warm and the conversation is softer than usual."
    ]
  },
  {
    id: "mini_getaway",
    category: "Big Swing",
    emoji: "🧳",
    label: "Mini Getaway",
    blurb: "A night away. Logistics included.",
    baseCost: 500,
    risk: "high",
    effects: { stressDelta: 0.4, loveDelta: 0.0, meterDelta: 10 },
    weights: { great: 12, good: 45, meh: 25, bad: 18 },
    scenes: [
      "You and {name} attempt a mini getaway and immediately discover travel is 70% logistics.",
      "You arrive and feel your nervous system unclench like it finally got permission.",
      "You both forget something important and decide it’s character-building.",
      "You sit somewhere quiet and realize rest is not a reward—it's a need."
    ]
  },

  // SWEET / GROUNDED
  {
    id: "volunteer_together",
    category: "Grounded",
    emoji: "🤝",
    label: "Volunteer Together",
    blurb: "Do good, feel connected, keep it simple.",
    baseCost: 0,
    risk: "low",
    effects: { stressDelta: -0.3, loveDelta: 0.2, meterDelta: 7 },
    scenes: [
      "You and {name} volunteer together and realize teamwork can be quiet and meaningful.",
      "You do something small that helps someone else, and it shifts your whole mood.",
      "You end up laughing in that “we’re both trying” way that feels tender.",
      "You leave feeling grounded, like your feet found the floor again."
    ]
  },
  {
    id: "breakfast_date",
    category: "Grounded",
    emoji: "🍳",
    label: "Breakfast Date",
    blurb: "Pancakes and low-drama daylight vibes.",
    baseCost: 35,
    risk: "low",
    effects: { stressDelta: -0.6, loveDelta: 0.1, meterDelta: 6 },
    scenes: [
      "You meet {name} for breakfast and immediately trust anyone who orders coffee first.",
      "You both get something comforting, like your brains requested softness.",
      "The daylight makes everything feel less intense in a good way.",
      "You leave with syrup on your hands and a little hope in your chest."
    ]
  }
];

// Return a fully-generated outcome object
export function rollDateOutcome({ ideaId, context, mode = "single", rng = Math.random }) {
  const idea = DATE_IDEAS.find(d => d.id === ideaId) || DATE_IDEAS[0];

  const weights = idea.weights || {};
  const quality = rollWeighted(rng, [
    { id: "great", weight: weights.great ?? 15 },
    { id: "good",  weight: weights.good  ?? 55 },
    { id: "meh",   weight: weights.meh   ?? 20 },
    { id: "bad",   weight: weights.bad   ?? 10 }
  ]).id;

  const ctx = {
    ...(context || {}),
    childName: context?.childName || "your kid",
    activity: idea.label
  };

  const opener = mode === "partner" ? pick(rng, OPENERS_PARTNER) : pick(rng, OPENERS_SINGLE);
  const scene = pick(rng, idea.scenes);
  const moment = quality === "bad" ? pick(rng, BAD_MOMENTS) : pick(rng, GOOD_MOMENTS);
  const twist  = quality === "bad" ? pick(rng, BAD_TWISTS)  : pick(rng, GOOD_TWISTS);
  const ending = quality === "bad" ? pick(rng, ENDINGS_BAD) : pick(rng, ENDINGS_GOOD);

  const story = fill([opener, scene, moment, twist, ending].join("\n\n"), ctx);

  // Money cost with slight variability (feels more alive)
  const costJitter = 0.85 + rng() * 0.35; // 0.85–1.20
  const moneyCost = Math.max(0, Math.round((idea.baseCost || 0) * costJitter));

  const base = idea.effects || { stressDelta: -0.5, loveDelta: 0, meterDelta: 5 };
  const mod = QUALITY_MODS[quality] || QUALITY_MODS.good;

  // Singles can feel slightly more nervous; partners slightly calmer. Keep it subtle.
  const modeStressNudge = mode === "single" ? 0.2 : -0.1;

  const stressDelta = round1((base.stressDelta || 0) + (mod.stressDelta || 0) + modeStressNudge);
  const loveDelta   = round1((base.loveDelta || 0)   + (mod.loveDelta || 0));
  const meterDelta  = Math.round((base.meterDelta || 0) + (mod.meterDelta || 0));

  const summary = fill(pick(rng, SUMMARY_BY_QUALITY[quality] || SUMMARY_BY_QUALITY.good), ctx);

  return {
    idea,
    quality,
    qualityLabel: QUALITY_LABEL[quality] || "Good",
    story,
    summary,
    moneyCost,
    stressDelta,
    loveDelta,
    meterDelta,
    tags: ["date", idea.category?.toLowerCase?.() || "date", quality]
  };
}

// Small helper for UI label
export function getQualityPill(quality) {
  if (quality === "great") return { text: "Great", className: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  if (quality === "good")  return { text: "Good",  className: "bg-pink-100 text-pink-800 border-pink-200" };
  if (quality === "meh")   return { text: "Meh",   className: "bg-slate-100 text-slate-700 border-slate-200" };
  return { text: "Bad", className: "bg-red-100 text-red-800 border-red-200" };
}

export const clampMeter = clamp;