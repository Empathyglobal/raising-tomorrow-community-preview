export const EXTREME_SPORTS = [
  {
    id: 'carrier_ridge_hike',
    emoji: '🎒',
    title: 'Carrier Ridge Hike',
    tagline: 'Steep trail, fresh air, and tiny joy (with big safety vibes).',
    minAge: 0,
    moneyCost: 25,
    riskLabel: 'Low',
    injuryChance: 0.03,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 3,
    successMemories: [
      "They fall asleep against you like you're the safest place on earth.",
      "They babble at trees like they're old friends.",
      "At the top, they grin so wide you forget your legs are tired."
    ],
    injuryIncidents: [
      "A wiggly roll during a blanket break turns into a tiny bump.",
      "They get too excited exploring and bonk their forehead on the way down.",
      "A surprise stumble ends with a small tumble and a big cry."
    ],
    injuryAftercare: [
      "You scoop them up, check them over, and they calm down fast—then demand snacks like a tiny CEO.",
      "You do the calm-parent voice, and they mirror it. Big feelings, then a deep breath.",
      "They cry for a minute, then proudly show off the bandaid to anyone who will look."
    ],
    injuryNote: "a small bruise from a trail tumble",
    coachNote: "Safe, slightly-scary experiences build secure confidence when you stay calm and present. You teach: fear is information, not a stop sign."
  },

  {
    id: 'balance_bike_pump_track',
    emoji: '🚲',
    title: 'Balance Bike Pump Track',
    tagline: "Speed (tiny), bravery (huge). Helmets mandatory.",
    minAge: 2,
    moneyCost: 80,
    riskLabel: 'Medium',
    injuryChance: 0.08,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 2 },
    loveDelta: 1,
    stressDelta: 0,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 3,
    successMemories: [
      "They keep whispering 'watch this' before every tiny hill.",
      "They wipe out, pop up, and announce: 'I'm okay!' like it's a superpower.",
      "They start coaching other kids: 'Feet ready. Brake. Then go!'"
    ],
    injuryIncidents: [
      "A front wheel catches a groove and they slide out.",
      "They misjudge a turn and take a classic knee-first landing.",
      "They go a little too fast, then look surprised when gravity answers."
    ],
    injuryAftercare: [
      "You clean it, hug them, and they insist on getting back on the bike (after a dramatic snack).",
      "They look embarrassed, so you praise the bravery of trying again.",
      "They limp for a day and milk it for sympathy—and honestly, fair."
    ],
    injuryNote: "a scraped knee from a bike wipeout",
    coachNote: "Progress comes from repetition + recovery. You reinforce: falling is part of learning, and we repair without shame."
  },

  {
    id: 'tree_climbing_challenge',
    emoji: '🌳',
    title: 'Tree Climbing Challenge',
    tagline: 'A classic: nature parkour with a safety talk.',
    minAge: 3,
    moneyCost: 20,
    riskLabel: 'Medium',
    injuryChance: 0.10,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 2 },
    loveDelta: 1,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They pick a 'home branch' and declare themselves the mayor of that tree.",
      "They climb down with shaky legs, then immediately want to go again.",
      "They start noticing where to place hands and feet—real problem-solving."
    ],
    injuryIncidents: [
      "A hand slips on bark and they slide down a little too fast.",
      "They drop the last two feet and land awkwardly.",
      "They get overconfident and forget the 'three points of contact' rule."
    ],
    injuryAftercare: [
      "You sit with them, breathe with them, and make a plan for next time: slower, safer, still brave.",
      "They rage-cry for a minute, then let you wrap them up and accept a 'bravery badge' sticker.",
      "You turn it into a repair moment: comfort first, lesson later."
    ],
    injuryNote: "a sore ankle from a tree-climbing slip",
    coachNote: "Big confidence grows from small risks with clear boundaries. You teach safety as a skill—not a buzzkill."
  },

  {
    id: 'ninja_parkour_gym',
    emoji: '🥷',
    title: 'Ninja Parkour Gym',
    tagline: "Obstacle courses that turn effort into pride.",
    minAge: 4,
    moneyCost: 200,
    riskLabel: 'Medium',
    injuryChance: 0.09,
    deltas: { intelligence: 0, empathy: 0, discipline: 2, confidence: 2 },
    loveDelta: 0,
    stressDelta: 0,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 3,
    successMemories: [
      "They treat every obstacle like a quest with a soundtrack.",
      "They practice the same jump until it finally clicks—and they glow.",
      "They start stretching without being asked, like a tiny athlete."
    ],
    injuryIncidents: [
      "They mistime a landing and thump their shin on a box.",
      "A jump turns into a stumble, and they catch themselves the hard way.",
      "They try a 'bigger kid' move before they're ready."
    ],
    injuryAftercare: [
      "They sit, breathe, and watch others—then ask to try again, smaller this time.",
      "You name what happened without shame: 'Your body said not yet.'",
      "They complain loudly for the rest of the day, then brag about the bruise like a trophy."
    ],
    injuryNote: "a bruised shin from a parkour misstep",
    coachNote: "Discipline is doing the reps. Confidence is trying again after a miss. You help them build both without turning it into pressure."
  },

  {
    id: 'snow_tubing',
    emoji: '🛷',
    title: 'Snow Tubing & Hot Cocoa',
    tagline: "Cold cheeks, fast slides, big laughs.",
    minAge: 4,
    moneyCost: 130,
    riskLabel: 'Low',
    injuryChance: 0.05,
    deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 3,
    successMemories: [
      "They scream-laugh all the way down and demand an instant rematch.",
      "They help carry the tube uphill with surprising determination.",
      "They announce hot cocoa is 'the best medicine for cold air.'"
    ],
    injuryIncidents: [
      "They bounce off a bump, land weird, and sit down hard.",
      "A spin gets a little too spicy and they slide off the tube.",
      "They collide gently with another tube and get rattled."
    ],
    injuryAftercare: [
      "You switch to a gentler hill and they regain confidence in minutes.",
      "They pout, then accept cocoa, then return to chaos.",
      "They need a cuddle and some reassurance that falling isn't failing."
    ],
    injuryNote: "a sore back from a hard tubing landing",
    coachNote: "Joy matters. Shared fun builds resilience—especially when you help them recover after something scary."
  },

  {
    id: 'indoor_rock_climbing',
    emoji: '🧗',
    title: 'Indoor Rock Climbing',
    tagline: 'Tiny hands, big courage, and a lot of chalk.',
    minAge: 6,
    moneyCost: 600,
    riskLabel: 'Medium',
    injuryChance: 0.08,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 3 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They hesitate at the first hold, then go anyway—pure courage.",
      "They hit the top and look like they just conquered a mountain.",
      "They start talking about 'routes' and 'resting,' like a serious climber."
    ],
    injuryIncidents: [
      "A foot slips and they swing into the wall, awkwardly.",
      "They jump down before you're ready and tweak their wrist.",
      "They overgrip and strain their forearm, then try to hide it."
    ],
    injuryAftercare: [
      "You praise the attempt, not the height, and they soften.",
      "They learn the grown-up move: stop when your body says stop.",
      "You spend the next weeks doing gentle rehab exercises together, like a team."
    ],
    injuryNote: "a sprained wrist from a climbing slip",
    coachNote: "Climbing turns fear into a sequence of small steps. You reinforce persistence and body-awareness—not perfection."
  },

  {
    id: 'ropes_zipline_course',
    emoji: '🪢',
    title: 'Zipline & High Ropes',
    tagline: 'Harness on. Heart racing. Trust growing.',
    minAge: 8,
    moneyCost: 450,
    riskLabel: 'Low',
    injuryChance: 0.05,
    deltas: { intelligence: 0, empathy: 2, discipline: 1, confidence: 2 },
    loveDelta: 0,
    stressDelta: 0,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 3,
    successMemories: [
      "They step off the platform shaking, then scream with joy mid-zip.",
      "They learn to trust the harness—and themselves.",
      "They coach you: 'Look forward, not down!'"
    ],
    injuryIncidents: [
      "A rope burn surprises them when they grab too fast.",
      "They slip on a plank and catch themselves, but not gracefully.",
      "They bang a hand on a cable and wince hard."
    ],
    injuryAftercare: [
      "You slow it down, review the rules, and they get their bravery back.",
      "They take a break, then return with a quieter kind of confidence.",
      "You celebrate the quit-that-was-smart choice as much as the finish."
    ],
    injuryNote: "a scraped hand from a ropes-course slip",
    coachNote: "Trust + courage is a powerful combo. You teach: bravery includes pausing, asking for help, and listening to your body."
  },

  {
    id: 'skatepark_progression',
    emoji: '🛹',
    title: 'Skatepark Progression',
    tagline: 'Pads, patience, and the slow magic of practice.',
    minAge: 9,
    moneyCost: 150,
    riskLabel: 'High',
    injuryChance: 0.15,
    deltas: { intelligence: 0, empathy: 0, discipline: 2, confidence: 3 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They practice the same line until it finally looks smooth.",
      "They learn the skatepark language: wait your turn, respect the flow.",
      "They land a new trick and immediately act like they're sponsored."
    ],
    injuryIncidents: [
      "A wheel catches and they slam, fast and loud.",
      "They bail late and twist their ankle trying to save it.",
      "They drop in too early and eat concrete (pads do their job)."
    ],
    injuryAftercare: [
      "You sit on the curb together, let the feelings happen, then decide what 'safe brave' means now.",
      "They get scared of the ramp for a while—and you help them rebuild step by step.",
      "They insist the helmet is non‑negotiable now, like a wiser older sibling."
    ],
    injuryNote: "a sprained ankle from a skatepark fall",
    coachNote: "Extreme confidence is built by repeated failure in a safe container. You help them turn wipes into learning—not shame."
  },

  {
    id: 'indoor_skydiving',
    emoji: '🌪️',
    title: 'Indoor Skydiving (Wind Tunnel)',
    tagline: 'Flying, but with instructors and a controlled environment.',
    minAge: 10,
    moneyCost: 900,
    riskLabel: 'Low',
    injuryChance: 0.04,
    deltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: 2 },
    loveDelta: 0,
    stressDelta: 0,
    injuryDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They hover for a second and their whole face says: 'I can fly.'",
      "They learn tiny body adjustments and get obsessed with getting it right.",
      "They walk out with 'wind hair' and unstoppable confidence."
    ],
    injuryIncidents: [
      "A weird gust spins them and they land awkwardly on a shoulder.",
      "They tense up mid-float and come down a little too hard.",
      "They forget the hand signal and get gently bumped by the instructor."
    ],
    injuryAftercare: [
      "They feel embarrassed, so you normalize it: learning looks like wobbling.",
      "You turn it into a body lesson: relax, breathe, try again later.",
      "They take a break, watch others, then come back with a calmer focus."
    ],
    injuryNote: "a sore shoulder from a hard wind-tunnel landing",
    coachNote: "High novelty + coaching builds confidence fast. You reinforce regulation: breathe, loosen, adjust, try again."
  },

  {
    id: 'paintball_day',
    emoji: '🎯',
    title: 'Paintball Day',
    tagline: 'Teamwork, strategy, and lots of protective gear.',
    minAge: 12,
    moneyCost: 500,
    riskLabel: 'Medium',
    injuryChance: 0.12,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 2 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They discover teamwork is an actual superpower.",
      "They learn to stay calm under pressure and communicate clearly.",
      "They come home covered in paint and stories."
    ],
    injuryIncidents: [
      "A close-range hit blooms into a nasty bruise.",
      "They trip while sprinting and smack their elbow on the ground.",
      "A paintball sneaks past a pad and stings way more than expected."
    ],
    injuryAftercare: [
      "They feel shaken, so you praise them for calling time-out and getting help.",
      "You do an equipment check and set stricter rules for next time.",
      "They spend a week showing the bruise to everyone like it's proof of bravery."
    ],
    injuryNote: "a nasty bruise from a paintball hit",
    coachNote: "Team sports under stress build self-control and communication. You emphasize rules + safety + repair after conflict."
  },

  {
    id: 'surf_lessons',
    emoji: '🏄',
    title: 'Surf Lessons',
    tagline: 'Wipeouts, waves, and learning to respect the ocean.',
    minAge: 12,
    moneyCost: 950,
    riskLabel: 'Medium',
    injuryChance: 0.10,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 2 },
    loveDelta: 0,
    stressDelta: 0,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They wipe out 20 times and laugh 19 of them off.",
      "They finally stand up for three seconds and act like it was a whole minute.",
      "They start talking about tides like they're part of the ocean now."
    ],
    injuryIncidents: [
      "They step on a rock and scrape their foot badly.",
      "A board bumps them on the shin and they yelp.",
      "They get tumbled by a wave and come up rattled and coughing."
    ],
    injuryAftercare: [
      "You switch to smaller waves and they rebuild trust with the water.",
      "They get frustrated, so you reframe it: every wipeout is data.",
      "You make recovery part of training: rest, stretch, patience."
    ],
    injuryNote: "a scraped foot from a rocky wipeout",
    coachNote: "Resilience is built in the reset: fall, breathe, try again. You help them keep a respectful relationship with risk."
  },

  {
    id: 'downhill_mtb',
    emoji: '🚵',
    title: 'Downhill Mountain Biking',
    tagline: "Fast, technical, and not for the unprepared.",
    minAge: 13,
    moneyCost: 1200,
    riskLabel: 'High',
    injuryChance: 0.18,
    deltas: { intelligence: 0, empathy: 0, discipline: 2, confidence: 3 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They learn the difference between 'fast' and 'in control.'",
      "They start talking about lines, braking points, and balance like a pro.",
      "They finish muddy, thrilled, and very hungry."
    ],
    injuryIncidents: [
      "They hit loose gravel and slide out in slow motion.",
      "A jump goes wrong and they take a hard shoulder scrape.",
      "They clip a tree and tumble into the soft-but-not-that-soft dirt."
    ],
    injuryAftercare: [
      "You get them patched up, then do the gentlest ride possible—just to end on courage, not fear.",
      "They sulk for a day, then watch videos and plan a safer comeback.",
      "They learn the real thrill is skill—not recklessness."
    ],
    injuryNote: "a painful shoulder scrape from a mountain-bike crash",
    coachNote: "High-risk sports teach planning and humility. You reinforce: skill first, ego last, and safety is part of mastery."
  },

  {
    id: 'whitewater_rafting',
    emoji: '🛶',
    title: 'Whitewater Rafting (Family Run)',
    tagline: 'Guides, helmets, paddles, teamwork.',
    minAge: 14,
    moneyCost: 1100,
    riskLabel: 'Medium',
    injuryChance: 0.09,
    deltas: { intelligence: 0, empathy: 2, discipline: 1, confidence: 2 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They paddle in sync and feel like part of a team.",
      "They scream through a rapid, then laugh until they can't breathe.",
      "They learn respect for water—and for guides."
    ],
    injuryIncidents: [
      "A wave tosses them and they knock into the side of the raft.",
      "They get a surprise splash in the face and panic for a moment.",
      "A rough rapid jolts them and leaves them sore for days."
    ],
    injuryAftercare: [
      "You debrief calmly: what was scary, what worked, what to do next time.",
      "They replay the scary part in their head, so you help them tell a recovery story: 'I got through it.'",
      "They recover, and their confidence comes back in a quieter, sturdier way."
    ],
    injuryNote: "a bruised side from a rough rapid",
    coachNote: "Teamwork under pressure builds confidence and emotional regulation. You teach them how to recover after fear."
  },

  {
    id: 'scuba_cert',
    emoji: '🤿',
    title: 'Scuba Certification',
    tagline: 'Calm, careful, and surprisingly intense.',
    minAge: 15,
    moneyCost: 2600,
    riskLabel: 'Medium',
    injuryChance: 0.06,
    deltas: { intelligence: 1, empathy: 0, discipline: 2, confidence: 2 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They learn to stay calm, check gear, and trust their training.",
      "They see something underwater and go silent with awe.",
      "They become annoyingly responsible about safety (in a good way)."
    ],
    injuryIncidents: [
      "They descend too fast and get a painful ear squeeze.",
      "A fin kicks up sand and they get disoriented for a second.",
      "They misjudge buoyancy and bump a knee on the ladder."
    ],
    injuryAftercare: [
      "They take recovery seriously and learn 'slow is smooth' in their bones.",
      "You keep it supportive, not shaming, and they stay open to learning.",
      "They come back with more respect—and better habits."
    ],
    injuryNote: "an ear squeeze from descending too fast",
    coachNote: "Disciplined skills build confidence. You teach them to respect procedure and to pause when their body says pause."
  },

  {
    id: 'paragliding_tandem',
    emoji: '🪂',
    title: 'Tandem Paragliding',
    tagline: 'Quiet flight, huge feelings, unforgettable view.',
    minAge: 16,
    moneyCost: 1600,
    riskLabel: 'High',
    injuryChance: 0.08,
    deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 3 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They step into the harness trembling, then start laughing in the air.",
      "They watch the world get small and suddenly feel big.",
      "They talk about that flight for months."
    ],
    injuryIncidents: [
      "A gust on landing knocks them into a stumble and they bruise hard.",
      "They tense up during takeoff and twist awkwardly on the run.",
      "They land a bit sideways and tweak their knee."
    ],
    injuryAftercare: [
      "They need a day to calm their nervous system, then they start telling the story like a legend.",
      "You help them name it: 'That was scary and we handled it.'",
      "They learn confidence isn't the absence of fear—it's moving with it."
    ],
    injuryNote: "a hard-landing bruise from paragliding",
    coachNote: "Awe builds identity. You help them integrate fear into the story: 'I was scared, and I did it safely anyway.'"
  },

  {
    id: 'bungee_jump',
    emoji: '🧗‍♂️',
    title: 'Bungee Jumping',
    tagline: 'Pure adrenaline. Pure screaming. Pure bragging rights.',
    minAge: 16,
    moneyCost: 650,
    riskLabel: 'High',
    injuryChance: 0.10,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 4 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They stand on the platform, breathe, and choose brave on purpose.",
      "The scream turns into laughter halfway down.",
      "Afterward, they look at you like: 'Did we just do that?'"
    ],
    injuryIncidents: [
      "The harness jerks awkwardly and they end up with a sore neck.",
      "They bounce wrong and get a rough strap bruise.",
      "They land the rebound oddly and their back complains loudly."
    ],
    injuryAftercare: [
      "You treat recovery as part of the adventure: hydration, rest, and a little humility.",
      "They feel embarrassed about being sore, so you normalize it: bodies have limits.",
      "They decide the next thrill will be 'slightly less violent.'"
    ],
    injuryNote: "a sore neck from a rough bungee rebound",
    coachNote: "Confidence is the ability to face discomfort and still act intentionally. You model: prepare, commit, recover."
  },

  {
    id: 'skydiving_tandem',
    emoji: '🪂',
    title: 'Tandem Skydiving',
    tagline: 'The big one. The story they tell forever.',
    minAge: 18,
    moneyCost: 3000,
    riskLabel: 'High',
    injuryChance: 0.06,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 4 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 7,
    successMemories: [
      "They step out of the plane and become pure adrenaline and joy.",
      "They land shaking, then start laughing like they can't stop.",
      "They say, 'I feel like I can do anything,' and you believe them."
    ],
    injuryIncidents: [
      "The landing is rough and they twist an ankle.",
      "They stumble on touchdown and take a knee-first slide.",
      "A hard flare surprises them and they come down heavier than planned."
    ],
    injuryAftercare: [
      "They get frustrated by the recovery time, so you help them stay patient and proud.",
      "You frame it as a life skill: plan, risk, consequence, repair.",
      "They heal, but the lesson sticks: brave is better with preparation."
    ],
    injuryNote: "a twisted ankle from a rough skydive landing",
    coachNote: "High-intensity milestones shape identity. You help them hold both truths: 'That was scary' and 'I can handle hard things.'"
  },
  {
    id: 'trampoline_park',
    emoji: '🤸',
    title: 'Trampoline Park Session',
    tagline: 'Bouncy chaos with rules: one jumper per square.',
    minAge: 3,
    moneyCost: 120,
    riskLabel: 'Medium',
    injuryChance: 0.09,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 2 },
    loveDelta: 1,
    stressDelta: -1,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They invent a signature move called 'the bouncy rocket' and demand you clap for it.",
      "They learn to take turns, wait, then explode into motion like a tiny spring.",
      "They bounce until they're giggling too hard to stand up."
    ],
    injuryIncidents: [
      "They land a little sideways and their ankle complains loudly.",
      "They try a flip they saw a bigger kid do and land on a knee.",
      "A double-bounce surprises them and they tumble into the padding."
    ],
    injuryAftercare: [
      "You ice it, cuddle it, and they immediately ask when they can bounce again.",
      "You turn it into a safety reset: rules first, tricks later, always.",
      "They spend a day dramatically limping, then suddenly forget to limp when snacks appear."
    ],
    injuryNote: "a sprained ankle from a trampoline landing",
    coachNote: "Big energy needs safe containers. You teach boundaries as the thing that makes freedom possible."
  },

  {
    id: 'go_karting_day',
    emoji: '🏎️',
    title: 'Go-Kart Track Day',
    tagline: 'Speed with structure: brakes, flags, and focus.',
    minAge: 6,
    moneyCost: 350,
    riskLabel: 'Medium',
    injuryChance: 0.07,
    deltas: { intelligence: 1, empathy: 0, discipline: 2, confidence: 2 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They start whispering, 'late brake, smooth turn' like a tiny race engineer.",
      "They learn the flags fast and take pride in driving responsibly.",
      "They step out of the kart vibrating with joy and demanding a rematch."
    ],
    injuryIncidents: [
      "A bump in the corner jolts them and they whack their elbow on the seat edge.",
      "They brake too late and tap the barrier, leaving them rattled and sore.",
      "They tense up at speed and come away with a stiff neck."
    ],
    injuryAftercare: [
      "You slow the day down: water, rest, and a calmer second session—if they want it.",
      "You frame it as data: 'Now you know where your limit is today.'",
      "They tell the story like a legend but skip the part where they got scared."
    ],
    injuryNote: "a stiff neck from a rough go-kart bump",
    coachNote: "Controlled risk is a classroom. You teach attention, restraint, and the confidence that comes from following rules under pressure."
  },

  {
    id: 'archery_tag',
    emoji: '🏹',
    title: 'Archery Tag',
    tagline: 'Team tactics with foam-tipped arrows and strict safety rules.',
    minAge: 10,
    moneyCost: 220,
    riskLabel: 'Low',
    injuryChance: 0.05,
    deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 1 },
    loveDelta: 0,
    stressDelta: 0,
    injuryDeltas: { intelligence: 1, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 4,
    successMemories: [
      "They discover that communicating calmly wins more rounds than yelling.",
      "They learn angles and timing, then start calling plays like a coach.",
      "They high-five teammates like they just won a championship."
    ],
    injuryIncidents: [
      "They pull the string wrong and jam a finger.",
      "They get tagged on the forearm and it bruises more than expected.",
      "They trip while sprinting to cover and land hard on a wrist."
    ],
    injuryAftercare: [
      "You pause, reset, and remind them that smart play includes stopping for care.",
      "They feel embarrassed, so you praise the responsible choice to take a break.",
      "They become the biggest advocate for safety gear for the rest of the year."
    ],
    injuryNote: "a jammed finger from a bad bow pull",
    coachNote: "Strategy plus self-control builds real confidence. You reinforce: protect teammates, follow rules, and don't confuse aggression with courage."
  },

  {
    id: 'fencing_club_trial',
    emoji: '🤺',
    title: 'Fencing Club Trial',
    tagline: 'Fast feet, sharp focus, and very respectful duels.',
    minAge: 10,
    moneyCost: 400,
    riskLabel: 'Low',
    injuryChance: 0.04,
    deltas: { intelligence: 1, empathy: 0, discipline: 2, confidence: 2 },
    loveDelta: 0,
    stressDelta: 0,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 3,
    successMemories: [
      "They learn the salute and suddenly take sportsmanship seriously.",
      "They get obsessed with footwork and practice lunges in the hallway at home.",
      "They land a clean touch and look shocked at their own skill."
    ],
    injuryIncidents: [
      "Too many lunges in a row leaves them with a sore knee.",
      "They grip too tight and strain their forearm.",
      "A clumsy step turns into a rolled ankle."
    ],
    injuryAftercare: [
      "You normalize it: new muscles wake up when you learn something new.",
      "They rest, stretch, and come back feeling more in control.",
      "They start respecting warm-ups like it's a sacred ritual."
    ],
    injuryNote: "a strained forearm from fencing drills",
    coachNote: "Precision sports teach emotional regulation. You help them learn: calm focus wins, and recovery is part of training."
  },

  {
    id: 'obstacle_course_race',
    emoji: '🏁',
    title: 'Obstacle Course Race',
    tagline: 'Mud, ropes, walls, and the art of not quitting.',
    minAge: 10,
    moneyCost: 450,
    riskLabel: 'Medium',
    injuryChance: 0.11,
    deltas: { intelligence: 0, empathy: 1, discipline: 2, confidence: 2 },
    loveDelta: 1,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They help a smaller kid over a wall and get proud in a quiet way.",
      "They discover they can do hard things when they keep moving.",
      "They cross the finish muddy, exhausted, and glowing."
    ],
    injuryIncidents: [
      "A rope climb tears up their palm and it stings for days.",
      "They slip on a muddy landing and tweak their knee.",
      "They swing from a bar and drop a little too hard onto their shoulder."
    ],
    injuryAftercare: [
      "You clean it, wrap it, and celebrate the finish anyway.",
      "They need a pep talk, so you praise effort—not speed.",
      "They start carrying bandaids in their bag like an experienced adventurer."
    ],
    injuryNote: "a scraped palm from a rope climb",
    coachNote: "This is endurance training for life. You teach pacing, problem solving, and the confidence that comes from finishing—even imperfectly."
  },

  {
    id: 'guided_spelunking',
    emoji: '🕳️',
    title: 'Guided Spelunking Trip',
    tagline: 'Headlamps on. Voices quiet. Courage loud.',
    minAge: 10,
    moneyCost: 700,
    riskLabel: 'Medium',
    injuryChance: 0.08,
    deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 2 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They whisper like it's a sacred place, then grin when the guide calls them 'a natural.'",
      "They learn to move slowly and deliberately, like a real explorer.",
      "They come out to daylight and look genuinely proud of themselves."
    ],
    injuryIncidents: [
      "They bump their head on a low ceiling and see stars for a second.",
      "A crawl turns into a knee-first slide on rock.",
      "They slip on wet stone and catch themselves the hard way."
    ],
    injuryAftercare: [
      "You slow everything down, check them carefully, and they learn that safety is part of adventure.",
      "They feel shaky, so you narrate the calm plan: breathe, rest, exit together.",
      "They recover, then start telling people, 'Caves are cooler than movies.'"
    ],
    injuryNote: "a bruised knee from a cave crawl",
    coachNote: "Facing the dark builds a sturdy kind of courage. You teach: slow movement, clear communication, and trusting the team."
  },

  {
    id: 'via_ferrata_route',
    emoji: '⛰️',
    title: 'Via Ferrata Route',
    tagline: 'Clipped in the whole time—big exposure, controlled risk.',
    minAge: 12,
    moneyCost: 1500,
    riskLabel: 'High',
    injuryChance: 0.09,
    deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 3 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They tremble at the first ladder, then clip, step, and suddenly… keep going.",
      "They learn to breathe through fear and move one clip at a time.",
      "At the viewpoint they go quiet, then say, 'I didn't think I could do that.'"
    ],
    injuryIncidents: [
      "A slip leaves them swinging into the rock and bruising a hip.",
      "Their hands get shredded by the cable and they get a nasty blister.",
      "A tough traverse strains their shoulder and they have to stop early."
    ],
    injuryAftercare: [
      "You celebrate the smart decision to stop and protect their body.",
      "They feel disappointed, so you remind them: 'Quitting early can be brave too.'",
      "They rest, heal, and return later with better prep and calmer confidence."
    ],
    injuryNote: "a bruised hip from a via ferrata slip",
    coachNote: "This is fear management in its purest form. You model: clip carefully, move intentionally, and never let pride override safety."
  },

  {
    id: 'outdoor_rappelling',
    emoji: '🧗',
    title: 'Outdoor Rappelling Day',
    tagline: 'Trust the rope. Trust the system. Trust yourself.',
    minAge: 12,
    moneyCost: 850,
    riskLabel: 'Medium',
    injuryChance: 0.07,
    deltas: { intelligence: 1, empathy: 1, discipline: 1, confidence: 3 },
    loveDelta: 0,
    stressDelta: 1,
    injuryDeltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: -1 },
    injuryLoveDelta: 1,
    injuryStressDelta: 5,
    successMemories: [
      "They lean back over the edge and laugh in disbelief when it works.",
      "They get obsessed with the 'brake hand' rule and repeat it like a mantra.",
      "They finish the last rappel and look older somehow—more capable."
    ],
    injuryIncidents: [
      "They let the rope slide too fast and get a painful rope burn.",
      "They swing into the rock and bang a knee.",
      "They step wrong at the bottom and twist an ankle."
    ],
    injuryAftercare: [
      "You treat the rope burn, then talk about why slow control is the real skill.",
      "They feel ashamed, so you praise the learning moment, not the mistake.",
      "They start asking for gear checks before every activity—like a pro."
    ],
    injuryNote: "a rope burn from descending too fast",
    coachNote: "Rappelling teaches trust, systems, and self-control. You reinforce: check, communicate, descend slowly, and ask for help early."
  },

  {
    id: 'snowboard_terrain_park',
    emoji: '🏂',
    title: 'Snowboard Terrain Park',
    tagline: 'Small jumps first. Style later. Safety always.',
    minAge: 12,
    moneyCost: 900,
    riskLabel: 'High',
    injuryChance: 0.17,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 3 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They practice the same tiny jump until it looks smooth and effortless.",
      "They learn to fall safely and pop up laughing instead of panicking.",
      "They land a clean run and suddenly carry themselves like an athlete."
    ],
    injuryIncidents: [
      "A bad landing twists their knee and they go down hard.",
      "They catch an edge and slam their tailbone.",
      "They overshoot a feature and bruise their ribs on the impact."
    ],
    injuryAftercare: [
      "You switch to easy runs and rebuild trust in their board.",
      "They get angry at their body, so you teach patience: healing is part of sport.",
      "They come back later with better form and a smarter kind of confidence."
    ],
    injuryNote: "a twisted knee from a bad jump landing",
    coachNote: "Terrain parks reward discipline. You teach: progress in steps, respect your limits, and treat recovery as training—not weakness."
  },

  {
    id: 'dirt_bike_lesson',
    emoji: '🏍️',
    title: 'Dirt Bike Lesson',
    tagline: "Throttle control, body position, and big respect for speed.",
    minAge: 13,
    moneyCost: 1000,
    riskLabel: 'High',
    injuryChance: 0.16,
    deltas: { intelligence: 1, empathy: 0, discipline: 2, confidence: 3 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They learn that control feels better than reckless speed.",
      "They start talking about braking zones like it's a science.",
      "They finish dusty, thrilled, and weirdly calm."
    ],
    injuryIncidents: [
      "They grab the front brake too hard and tip over fast.",
      "A rut catches the wheel and they go down on a wrist.",
      "They stall on a hill and tumble sideways into the dirt."
    ],
    injuryAftercare: [
      "You slow the pace and turn the rest of the year into skill-building, not showing off.",
      "They feel shaken, so you praise the decision to ride smaller until ready.",
      "They come back with humility—and better technique."
    ],
    injuryNote: "a sprained wrist from a dirt-bike fall",
    coachNote: "Motorsports teach responsibility. You reinforce: gear on, ego off, and mastery is measured by control."
  },

  {
    id: 'kitesurfing_lessons',
    emoji: '🪁',
    title: 'Kitesurfing Lessons',
    tagline: "Wind, water, and a sport that rewards discipline.",
    minAge: 14,
    moneyCost: 1900,
    riskLabel: 'High',
    injuryChance: 0.14,
    deltas: { intelligence: 1, empathy: 0, discipline: 2, confidence: 3 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 6,
    successMemories: [
      "They learn to read the wind like it's a language.",
      "They do their first water start and whoop so loud people look over.",
      "They start respecting weather forecasts like it's serious business."
    ],
    injuryIncidents: [
      "A sudden tug yanks their shoulder and they wince hard.",
      "They wipe out at speed and collect a big bruise from the board.",
      "They mis-time a turn and swallow a mouthful of salty consequences."
    ],
    injuryAftercare: [
      "You normalize it: wind sports are humbling. Skill comes from patience.",
      "They rest, rehab, and return with better habits and calmer focus.",
      "They learn the coolest riders are the safest ones."
    ],
    injuryNote: "a sore shoulder from a strong kite yank",
    coachNote: "Kitesurfing builds respect for forces bigger than you. You teach: check conditions, follow procedure, and never rush progression."
  },

  {
    id: 'ice_climbing_intro',
    emoji: '🧊',
    title: 'Ice Climbing Intro',
    tagline: 'Crampons, tools, and the quiet focus of winter walls.',
    minAge: 16,
    moneyCost: 1800,
    riskLabel: 'High',
    injuryChance: 0.10,
    deltas: { intelligence: 1, empathy: 0, discipline: 2, confidence: 3 },
    loveDelta: 0,
    stressDelta: 2,
    injuryDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: -2 },
    injuryLoveDelta: 1,
    injuryStressDelta: 7,
    successMemories: [
      "They swing, stick, and suddenly trust their own grip.",
      "They learn to move slowly and deliberately—strength with restraint.",
      "They top out and look at the ice like it taught them something."
    ],
    injuryIncidents: [
      "A tool mis-hit jars their arm and strains their shoulder.",
      "A crampon catches and they twist a knee awkwardly.",
      "Cold hands make them clumsy and they bang a knuckle hard."
    ],
    injuryAftercare: [
      "They take rehab seriously and learn that strength includes patience.",
      "You turn it into a lesson about preparation: warm-ups, gloves, pace.",
      "They come back later with better technique and quieter confidence."
    ],
    injuryNote: "a strained shoulder from swinging an ice tool",
    coachNote: "Winter sports teach humility and focus. You reinforce: slow is safe, skill beats force, and preparation is part of bravery."
  }
];