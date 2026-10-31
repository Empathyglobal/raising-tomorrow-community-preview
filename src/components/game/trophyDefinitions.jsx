// Trophy Definitions - Secret and Non-Secret Achievements

export const TROPHY_DEFS = [
  {
    id: 'gym_cardio_machine',
    name: 'Cardio Machine',
    desc: 'Did 5 Cardio Days in a row.',
    icon: '🏃',
    secret: false
  },
  {
    id: 'gym_upper_machine',
    name: 'Upper Body Beast',
    desc: 'Did 5 Upper Body Days in a row.',
    icon: '💪',
    secret: false
  },
  {
    id: 'gym_legs_machine',
    name: 'Leg Day Legend',
    desc: 'Did 5 Leg Days in a row.',
    icon: '🦵',
    secret: false
  },
  {
    id: 'marathon_finisher',
    name: 'Marathon Finisher',
    desc: 'Completed your first marathon.',
    icon: '🏅',
    secret: false
  },
  {
    id: 'gardening_veg_streak_5',
    name: 'Green Thumb',
    desc: 'Did 5 Vegetable Garden sessions in a row.',
    icon: '🥕',
    secret: false
  },
  {
    id: 'gardening_flower_streak_5',
    name: 'Bloom Whisperer',
    desc: 'Did 5 Flower Garden sessions in a row.',
    icon: '🌸',
    secret: false
  },
  {
    id: 'gardening_herb_streak_5',
    name: 'Herb Alchemist',
    desc: 'Did 5 Herb Garden sessions in a row.',
    icon: '🌿',
    secret: false
  },
  {
    id: 'minibreak_breath_streak_5',
    name: 'Calm Operator',
    desc: 'Did 5 Breathwork sessions in a row.',
    icon: '🫁',
    secret: false
  },
  {
    id: 'sleep_screenfree_streak_5',
    name: 'Screen-Free Legend',
    desc: 'Did 5 Screen-Free Evening sessions in a row.',
    icon: '📵',
    secret: false
  },
  {
    id: 'sleep_routine_streak_5',
    name: 'Bedtime Boss',
    desc: 'Did 5 Bedtime Routine sessions in a row.',
    icon: '📚',
    secret: false
  },
  {
    id: 'sleep_early_streak_5',
    name: 'Early Bird',
    desc: 'Did 5 Earlier Bedtime sessions in a row.',
    icon: '⏰',
    secret: false
  },
  {
    id: 'phone_puzzle_streak_5',
    name: 'Digital Minimalist',
    desc: 'Did 5 Puzzle Game sessions in a row.',
    icon: '🧩',
    secret: false
  },
  // NON-SECRET TROPHIES
  {
    id: "science_fair_champion",
    name: "Science Fair Champion",
    secret: false,
    desc: "Your child won the National Science Fair.",
    icon: "🧪"
  },
  
  // SECRET LEGENDARY TROPHIES
  {
    id: "mars_pioneer",
    name: "First Human on Mars",
    secret: true,
    lockedName: "???",
    lockedDesc: "A legendary ending requiring extreme stats and rare choices.",
    desc: "They became the first human to set foot on Mars.",
    icon: "🚀"
  },
  {
    id: "hero_president",
    name: "The President (Listener)",
    secret: true,
    lockedName: "???",
    lockedDesc: "A rare ending earned through empathy + leadership.",
    desc: "They became a beloved elected leader known for listening.",
    icon: "🗳️"
  },
  {
    id: "supervillain_arc",
    name: "Supervillain Arc (Briefly)",
    secret: true,
    lockedName: "???",
    lockedDesc: "A chaotic ending that absolutely should not be goals.",
    desc: "They tried to become a supervillain. It didn't go as planned.",
    icon: "🧨"
  },
  {
    id: "asteroid_tycoon",
    name: "Asteroid Tycoon",
    secret: true,
    lockedName: "???",
    lockedDesc: "A fortune hidden in the belt.",
    desc: "They struck it rich as an asteroid miner.",
    icon: "☄️"
  },
  {
    id: "time_traveler",
    name: "Time Traveler",
    secret: true,
    lockedName: "???",
    lockedDesc: "History remembers them oddly.",
    desc: "They vanished into time. You found proof… 5,000 years later.",
    icon: "⏳"
  },
  {
    id: "blockcraft_2",
    name: "Blockcraft 2",
    secret: false,
    desc: "They made a game that took over the world: Blockcraft 2.",
    icon: "🧱"
  },
  {
    id: "music_star",
    name: "World Music Star",
    secret: false,
    desc: "They became a world-famous musician.",
    icon: "🎵"
  },
  {
    id: "music_star_dark",
    name: "Fame & Fallout",
    secret: true,
    lockedName: "???",
    lockedDesc: "Fame without grounding has a cost.",
    desc: "They became famous… and struggled with addiction.",
    icon: "🎵"
  },
  {
    id: "olympic_gold",
    name: "Olympic Gold",
    secret: false,
    desc: "They became an Olympic gold medalist.",
    icon: "🥇"
  },
  {
    id: "supermodel",
    name: "Supermodel",
    secret: false,
    desc: "They became a world-famous model.",
    icon: "🕶️"
  },
  {
    id: "adult_entertainment",
    name: "Adult Entertainment Career",
    secret: true,
    lockedName: "???",
    lockedDesc: "An adult-only career path (non-graphic).",
    desc: "They entered the adult entertainment industry.",
    icon: "🎬"
  },
  {
    id: "human_resistance",
    name: "Human Resistance",
    secret: true,
    lockedName: "???",
    lockedDesc: "You made a choice… and history turned.",
    desc: "Your child led humanity's resistance after the Machine War.",
    icon: "🤖"
  },
  {
    id: "room_designer",
    name: "Room Designer",
    secret: false,
    desc: "You turned a room into a story.",
    icon: "🏠"
  },
  {
    id: "prom_royalty",
    name: "Prom Royalty",
    secret: false,
    desc: "At 18, with extreme empathy and confidence, they win Prom King/Queen.",
    icon: "👑"
  },
  {
    id: "plush_space",
    name: "Rocket Bear",
    secret: false,
    desc: "Bought Rocket Bear at Age 2 in any run.",
    icon: "🧸🚀"
  },
  {
    id: "plush_animals",
    name: "Otter Pal",
    secret: false,
    desc: "Bought Otter Pal at Age 2 in any run.",
    icon: "🧸🦦"
  },
  {
    id: "plush_art",
    name: "Paint Bunny",
    secret: false,
    desc: "Bought Paint Bunny at Age 2 in any run.",
    icon: "🧸🎨"
  },
  {
    id: "plush_building",
    name: "Builder Bot",
    secret: false,
    desc: "Bought Builder Bot at Age 2 in any run.",
    icon: "🧸🤖"
  },
  {
    id: "plush_people",
    name: "Helper Heart",
    secret: false,
    desc: "Bought Helper Heart at Age 2 in any run.",
    icon: "🧸🤝"
  },
  {
    id: "plush_full_set",
    name: "Plush Completionist",
    secret: false,
    desc: "Collected every Age 2 plush across multiple runs.",
    icon: "🧸🏆"
  },
  {
    id: 'faith_service_streak_5',
    name: 'Faithful',
    secret: false,
    desc: 'Did 5 Attend Service sessions in a row.',
    icon: '🙏'
  },
  {
    id: 'faith_volunteer_streak_5',
    name: 'Servant Heart',
    secret: false,
    desc: 'Did 5 Volunteer sessions in a row.',
    icon: '🤝'
  },
  {
    id: 'faith_study_streak_5',
    name: 'Quiet Scholar',
    secret: false,
    desc: 'Did 5 Study/Reflection sessions in a row.',
    icon: '📖'
  },
  {
    id: 'donation_blood_streak_5',
    name: 'Blood Hero',
    secret: false,
    desc: 'Did 5 Blood donations in a row.',
    icon: '🩸'
  },
  {
    id: 'donation_plasma_streak_5',
    name: 'Plasma Patron',
    secret: false,
    desc: 'Did 5 Plasma donations in a row.',
    icon: '💛'
  },
  {
    id: 'donation_total_10',
    name: 'Regular Donor',
    secret: false,
    desc: 'Completed 10 total donations.',
    icon: '🫶'
  },
  {
    id: 'masterclass_track_master_5',
    name: 'Certified Parent Coach',
    secret: false,
    desc: 'Completed 5 masterclasses in any track.',
    icon: '🧾'
  },
  {
    id: 'therapy_streak_5',
    name: 'Therapy Regular',
    secret: false,
    desc: 'Did 5 therapy sessions of the same type in a row.',
    icon: '🛋️'
  },
  {
    id: 'gossip_vent_streak_5',
    name: 'Healthy Venting',
    secret: false,
    desc: 'Did 5 Vent Privately sessions in a row.',
    icon: '😮‍💨'
  },
  {
    id: 'routine_wizard',
    name: 'Routine Wizard',
    secret: false,
    desc: 'Mastered routines until they run on autopilot.',
    icon: '🗓️'
  },
  {
    id: 'green_thumb',
    name: 'Green Thumb',
    secret: false,
    desc: 'You turned dirt into a coping mechanism.',
    icon: '🌱'
  },
  {
    id: 'pet_whisperer',
    name: 'Pet Whisperer',
    secret: false,
    desc: 'You and your pet became a tiny team.',
    icon: '🐾'
  },
  {
    id: 'zombie_world_saved',
    name: 'World Saved: Zombies',
    secret: false,
    desc: 'You found a way to end the zombie apocalypse.',
    icon: '🧟‍♂️🏆'
  },
  {
    id: 'alien_world_saved',
    name: 'World Saved: Aliens',
    secret: false,
    desc: 'You defended Earth from an alien invasion.',
    icon: '👽🏆'
  },
  {
    id: 'world_destroyer',
    name: 'World Destroyer',
    secret: true,
    lockedName: '???',
    lockedDesc: 'A secret ending earned through a dark path.',
    desc: 'They nearly unleashed a fictional zombie plague — and were stopped before anyone was harmed.',
    icon: '🧟'
  },
  {
    id: 'nobel_tier_scientist',
    name: 'Nobel‑Tier Scientist',
    secret: false,
    desc: 'They turned curiosity into citations. (And probably forgot to eat lunch.)',
    icon: '🧠'
  },
  {
    id: 'olympic_medalist',
    name: 'Olympic Medalist',
    secret: false,
    desc: 'They stood on the podium while an anthem played. Years of 5am practice paid off.',
    icon: '🏅'
  },
  {
    id: 'peacemaker',
    name: 'Peacemaker',
    secret: false,
    desc: 'They ended conflicts that seemed impossible. Empathy became their superpower.',
    icon: '🕊️'
  },
  {
    id: 'media_mogul',
    name: 'Media Mogul',
    secret: false,
    desc: 'They built an empire out of attention, storytelling, and perfectly timed posts.',
    icon: '📺'
  },
  {
    id: 'kingmaker',
    name: 'Kingmaker',
    secret: false,
    desc: "They don't need the crown to run the kingdom. Power behind the throne energy.",
    icon: '🗳️'
  },
  {
    id: 'meme_icon',
    name: 'Accidental Meme Icon',
    secret: false,
    desc: 'The internet adopted them. Permanently. One moment became forever.',
    icon: '🤡'
  },
  {
    id: 'dynasty_builder',
    name: 'Dynasty Builder',
    secret: false,
    desc: 'Generational wealth unlocked. The receipts are real and the bedtime stories are legendary.',
    icon: '🏰'
  },
  {
    id: 'cult_leader',
    name: 'Cult Leader',
    secret: true,
    lockedName: '???',
    lockedDesc: 'A dark ending earned through extreme control and certainty.',
    desc: 'They built a harmful movement around certainty.',
    icon: '🕯️'
  },
  {
    id: 'micheline_three_stars',
    name: 'Micheline ⭐⭐⭐',
    secret: false,
    desc: 'Three stars. Reservations are impossible. Your name is spoken in whispers near butter.',
    icon: '🍽️⭐'
  },
  {
    id: 'lightning_in_a_bottle',
    name: 'Lightning in a Bottle',
    secret: false,
    desc: 'You captured lightning-on purpose-then wrote a paper about it like that is normal.',
    icon: '⚡🫙'
  },
  {
    id: 'anti_gravity_breakthrough',
    name: 'Anti-Gravity Breakthrough',
    secret: false,
    desc: 'You made something fall... upward. Physics filed a complaint.',
    icon: '🪐🧲'
  },
  {
    id: 'nobelle_physics',
    name: 'Nobelle Prize: Physics',
    secret: false,
    desc: 'You bent reality just enough to get a standing ovation from scientists.',
    icon: '🏅⚛️'
  },
  {
    id: 'nobelle_chemistry',
    name: 'Nobelle Prize: Chemistry',
    secret: false,
    desc: 'You turned molecules into money and meaning. Somehow both.',
    icon: '🏅🧪'
  },
  {
    id: 'nobelle_medicine',
    name: 'Nobelle Prize: Medicine',
    secret: false,
    desc: 'You helped people live longer—and made every hospital administrator cry tears of gratitude.',
    icon: '🏅🩺'
  },
  {
    id: 'nobelle_literature',
    name: 'Nobelle Prize: Literature',
    secret: false,
    desc: 'Your words rearranged hearts like furniture in a room someone finally feels safe in.',
    icon: '🏅📚'
  },
  {
    id: 'nobelle_peace',
    name: 'Nobelle Prize: Peace',
    secret: false,
    desc: 'You made enemies stop and listen. History exhaled.',
    icon: '🏅🕊️'
  },
  {
    id: 'nobelle_economics',
    name: 'Nobelle Prize: Economics',
    secret: false,
    desc: 'You changed how money moves—and everyone pretended they understood your charts.',
    icon: '🏅📈'
  },
  {
    id: "seti_first_contact",
    name: "First Contact",
    secret: true,
    lockedName: "???",
    lockedDesc: "You heard something… impossible.",
    desc: "You detected an unmistakable signal: first contact.",
    icon: "📡"
  },
  {
    id: "nobel_laureate",
    name: "Nobel Laureate",
    secret: true,
    lockedName: "???",
    lockedDesc: "A once-in-a-lifetime scientific honor.",
    desc: "You won the Nobel Prize for a scientific breakthrough.",
    icon: "🏅"
  }
  ];