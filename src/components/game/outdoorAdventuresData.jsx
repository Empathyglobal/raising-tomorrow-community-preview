// Outdoor adventures are always taken *with* your child.
// Costs:
// - Always costs 1 Focus
// - Some have a small money cost (gas + snacks)
// - Some have a larger cost (rentals / activities)

export const OUTDOOR_ADVENTURES = [
  {
    id: 'park_adventure',
    emoji: '🌳',
    title: 'Park Adventure',
    tagline: 'Easy win: swings, snacks, and fresh air.',
    minAge: 0,
    moneyCost: 50,
    deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    memories: [
      "They sprint to the playground like it's a heroic mission.",
      "They make up a new game with rules that change every 9 seconds.",
      "They collect leaves like they're priceless artifacts."
    ],
    coachNote: "Unstructured play + your steady presence = regulation and bonding. The park is basically connection in sneaker form."
  },
  {
    id: 'national_park',
    emoji: '🏞️',
    title: 'National Park Day',
    tagline: 'Trails, wonder, and the kind of quiet that actually helps.',
    minAge: 2,
    moneyCost: 150,
    deltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    memories: [
      "They stare at the view and whisper, 'Whoa.'",
      "They ask a hundred questions and somehow they're all good ones.",
      "They take the map very seriously and become your tiny tour guide."
    ],
    coachNote: "Awe makes brains light up. Shared wonder turns into “us” stories they carry."
  },
  {
    id: 'backyard_campout',
    emoji: '⛺',
    title: 'Backyard Campout',
    tagline: 'A micro‑adventure: blankets, flashlight stories, and giggles.',
    minAge: 0,
    moneyCost: 85,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 1 },
    loveDelta: 2,
    stressDelta: -1,
    memories: [
      "They insist the tent is 'a house for brave people.'",
      "They tell a spooky story that is mostly about cookies.",
      "They fall asleep smiling like the day tucked them in."
    ],
    coachNote: "Cozy novelty + ritual builds safety. Co-created memories become bedtime fuel for weeks."
  },
  {
    id: 'hike_trail',
    emoji: '🥾',
    title: 'Hike a Trail',
    tagline: "A little sweat, a lot of pride, and a million 'look at that!' moments.",
    minAge: 1,
    moneyCost: 35,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    memories: [
      "They keep stopping to show you rocks like they're museum pieces.",
      "They chant a little walking song and it weirdly works.",
      "They reach the top and throw their arms up like a champion."
    ],
    coachNote: "Small, safe challenge builds real confidence: “hard thing, done.”"
  },
  {
    id: 'bike_ride',
    emoji: '🚲',
    title: 'Bike Ride',
    tagline: 'Wind, speed, and the kind of confidence you can see.',
    minAge: 3,
    moneyCost: 25,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 2 },
    loveDelta: 1,
    stressDelta: 0,
    memories: [
      "They keep looking back to make sure you're watching them win.",
      "They race shadows on the sidewalk and take it personally.",
      "They learn a new trick and act like they invented physics."
    ],
    coachNote: "Practice + cheering (not rescuing) turns wobble into pride."
  },
  {
    id: 'fishing',
    emoji: '🎣',
    title: 'Fishing Afternoon',
    tagline: 'Patience training disguised as fun.',
    minAge: 4,
    moneyCost: 120,
    deltas: { intelligence: 0, empathy: 0, discipline: 2, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    memories: [
      "They whisper like fish can hear gossip.",
      "They get quiet in a way that feels rare and sweet.",
      "They celebrate a tiny catch like it's a trophy."
    ],
    coachNote: "Patience is learned in tiny moments. Quiet together is a skill, too."
  },
  {
    id: 'stargazing',
    emoji: '✨',
    title: 'Stargazing Night',
    tagline: 'Big sky, big questions, big feelings.',
    minAge: 4,
    moneyCost: 30,
    deltas: { intelligence: 2, empathy: 1, discipline: 0, confidence: 0 },
    loveDelta: 1,
    stressDelta: -1,
    memories: [
      "They try to count the stars and give up, delighted.",
      "They point at constellations like they're meeting famous people.",
      "They ask if the moon gets lonely and you both go quiet for a moment."
    ],
    coachNote: "Big questions + calm closeness grow curiosity and empathy."
  },
  {
    id: 'camping_weekend',
    emoji: '🔥',
    title: 'Camping Weekend',
    tagline: 'Messy, cozy, unforgettable.',
    minAge: 3,
    moneyCost: 450,
    deltas: { intelligence: 0, empathy: 1, discipline: 2, confidence: 1 },
    loveDelta: 2,
    stressDelta: 0,
    memories: [
      "They roast a marshmallow with the focus of a surgeon.",
      "They learn a simple camp job and glow with pride.",
      "They fall asleep to night sounds and feel brave about it."
    ],
    coachNote: "Shared responsibilities + adventure teach competence (even when it’s messy)."
  },
  {
    id: 'kayaking',
    emoji: '🛶',
    title: 'Kayaking',
    tagline: 'Paddles, teamwork, and splashes.',
    minAge: 6,
    moneyCost: 800,
    deltas: { intelligence: 0, empathy: 1, discipline: 1, confidence: 2 },
    loveDelta: 1,
    stressDelta: 0,
    memories: [
      "They insist on paddling and then proudly over‑paddle.",
      "They get soaked and act like it was the plan all along.",
      "They learn 'teamwork' means matching the rhythm, not winning it."
    ],
    coachNote: "Matching rhythm teaches teamwork without a single lecture."
  },
  {
    id: 'climbing_gym',
    emoji: '🧗',
    title: 'Climbing Wall',
    tagline: 'Brave hands, shaky knees, huge wins.',
    minAge: 6,
    moneyCost: 600,
    deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 3 },
    loveDelta: 1,
    stressDelta: 1,
    memories: [
      "They hesitate, then climb anyway—real courage in tiny steps.",
      "They hit the buzzer at the top and beam like a lighthouse.",
      "They discover their muscles have opinions and laugh about it."
    ],
    coachNote: "Bravery grows in small grips. You model: fear can ride along, it doesn’t drive."
  },
  {
    id: 'sledding',
    emoji: '🛷',
    title: 'Sledding & Hot Cocoa',
    tagline: 'Cold cheeks, warm laughs.',
    minAge: 3,
    moneyCost: 130,
    deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 2 },
    loveDelta: 2,
    stressDelta: -1,
    memories: [
      "They fly down the hill screaming pure joy.",
      "They wipe out softly and pop up laughing.",
      "They cradle hot cocoa like it's a sacred object."
    ],
    coachNote: "Joy + safe risk = confidence. Hot cocoa is just bonding in liquid form."
  },
  {
    id: 'atv_ride',
    emoji: '🏍️',
    title: 'ATV Trail Ride',
    tagline: 'Big thrills, big price tag, big safety talk.',
    minAge: 10,
    moneyCost: 2500,
    deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 3 },
    loveDelta: 1,
    stressDelta: 2,
    memories: [
      "They grip the handlebars like they're starring in an action movie.",
      "They keep shouting 'THIS IS AMAZING!' into the wind.",
      "They finish muddy, happy, and already planning the next ride."
    ],
    coachNote: "Thrills with clear boundaries teach self‑control and respect for risk."
  },
  {
    id: 'trail_cleanup',
    emoji: '🧤',
    title: 'Trail Cleanup',
    tagline: 'A good deed that still feels like an adventure.',
    minAge: 5,
    moneyCost: 40,
    deltas: { intelligence: 0, empathy: 2, discipline: 1, confidence: 1 },
    loveDelta: 1,
    stressDelta: -1,
    memories: [
      "They take the task seriously and still manage to make it fun.",
      "They feel proud helping a place they love stay beautiful.",
      "They say, 'We did something good today,' and you feel it land."
    ],
    coachNote: "Helping together builds empathy and identity: “we take care of our world.”"
  }
];