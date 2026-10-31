// IMPORTANT: International travel destinations are limited to places we can represent
// with a landmark-style emoji (monuments / iconic places).
//
// Each destination includes:
// - code: ISO 3166-1 alpha-2 country code (used for passport stamping)
// - name: Country / destination label
// - flagEmoji: the country flag to record in the passport
// - emoji: the landmark emoji used as the destination icon (recorded in the passport)
// - baseCost: Base cost in player's currency unit (before scaling for location)

// DOMESTIC DESTINATIONS (new for Travel V2)
export const DOMESTIC_DESTINATIONS = [
  {
    code: "D1",
    name: "National Park Road Trip",
    flagEmoji: "🚗",
    emoji: "🏞️",
    baseCost: 520, // Averaged/Representative domestic cost
    vibe: "trees, trails & fresh air therapy",
    memories: [
      "They name every rock formation. By hour three, you're out of names.",
      "They discover trail mix is better outdoors. Science can't explain it.",
      "Sunrise over the valley stops them mid-complaint. Rare quiet moment."
    ],
    souvenirs: ["smooth rock", "postcard", "pinecone"]
  },
  {
    code: "D2",
    name: "Big City Weekend",
    flagEmoji: "🚗",
    emoji: "🏙️",
    baseCost: 480,
    vibe: "lights, crowds & nonstop energy",
    memories: [
      "They discover revolving doors and won't leave. Security notices.",
      "The skyline at night makes them gasp. 'It's like a giant computer.'",
      "They rate every street food vendor. Harsh critiques for a 7-year-old."
    ],
    souvenirs: ["metro ticket", "keychain", "photo"]
  },
  {
    code: "D3",
    name: "Beach Town",
    flagEmoji: "🚗",
    emoji: "🏖️",
    baseCost: 560,
    vibe: "sand, waves & saltwater therapy",
    memories: [
      "They build a sandcastle empire. Other kids join. You're supervising 12.",
      "The sunset paints the sky orange. They stop mid-dig to watch.",
      "They collect shells and rank them by 'shell-ness.' Criteria unclear."
    ],
    souvenirs: ["shell", "photo", "magnet"]
  },
  {
    code: "D4",
    name: "Theme Park Day",
    flagEmoji: "🚗",
    emoji: "🎢",
    baseCost: 540,
    vibe: "rides, sugar & controlled chaos",
    memories: [
      "They map out the perfect ride strategy. It's a 47-step plan.",
      "Fireworks finale lights up their face. Worth every penny.",
      "They win a giant stuffed animal. You're carrying it everywhere."
    ],
    souvenirs: ["photo", "keychain", "map print"]
  },
  {
    code: "D5",
    name: "Cabin in the Woods",
    flagEmoji: "🚗",
    emoji: "🛖",
    baseCost: 410,
    vibe: "cozy, quiet & analog life",
    memories: [
      "Stargazing without light pollution blows their mind. 'There's SO MANY.'",
      "They roast marshmallows with scientific precision. Char levels debated.",
      "Morning mist rolls in like a movie. They whisper to preserve magic."
    ],
    souvenirs: ["pinecone", "photo", "wood carving"]
  },
  {
    code: "D6",
    name: "Grandparents' Town",
    flagEmoji: "🚗",
    emoji: "🏡",
    baseCost: 470,
    vibe: "family, nostalgia & home cooking",
    memories: [
      "They listen to grandpa's stories like gospel. You've heard them 100 times.",
      "Family dinner around the table. No phones, just conversation.",
      "They learn a family recipe. Generational knowledge transfer."
    ],
    souvenirs: ["photo", "recipe card", "fabric swatch"]
  },
  {
    code: "D7",
    name: "Science Museum Sleepover",
    flagEmoji: "🚗",
    emoji: "🔭",
    baseCost: 560,
    vibe: "discovery, wonder & late-night exploration",
    memories: [
      "They sleep under the dinosaurs. Best sleepover ever.",
      "A live science demo sparks questions for weeks. Curiosity ignited.",
      "The space exhibit makes them dream bigger. 'Can I be an astronaut?'"
    ],
    souvenirs: ["museum ticket", "photo", "map print"]
  },
  {
    code: "D8",
    name: "Mountain Trip",
    flagEmoji: "🚗",
    emoji: "⛰️",
    baseCost: 510,
    vibe: "altitude, adventure & peak views",
    memories: [
      "Summit sunrise paints the peaks gold. They go silent with awe.",
      "They discover snow and lose their minds. Snowball fight mandatory.",
      "Mountain air hits different. 'Why does it smell so... clean?'"
    ],
    souvenirs: ["smooth rock", "photo", "snow globe"]
  }
];

// INTERNATIONAL DESTINATIONS (existing + unlockable expansions)
export const TRAVEL_DESTINATIONS = [
  {
    code: "US",
    name: "United States",
    flagEmoji: "🇺🇸",
    emoji: "🗽",
    baseCost: 950,
    vibe: "big skies & bigger dreams",
    memories: [
      "They stare up at the statue and whisper, 'She's holding a torch like it's a night‑light for the whole world.'",
      "They try to count skyscrapers, give up, and declare, 'Too many buildings. City win.'",
      "They learn the magic of a public park and start calling it 'outside living room.'"
    ],
    souvenirs: ["tiny torch keychain", "postcard", "snow globe"]
  },
  {
    code: "FR",
    name: "France",
    flagEmoji: "🇫🇷",
    emoji: "🗼",
    baseCost: 1650,
    vibe: "art, cafés & dramatic staring",
    memories: [
      "They see the tower light up and insist it's 'sparkle math.'",
      "They attempt a fancy 'bonjour' and end up bowing. Nobody minds.",
      "They treat every pastry like it deserves a slow clap."
    ],
    souvenirs: ["museum ticket", "tiny sketch", "macaron box"]
  },
  {
    code: "JP",
    name: "Japan",
    flagEmoji: "🇯🇵",
    emoji: "🗻",
    baseCost: 1950,
    vibe: "quiet wonder & mountain magic",
    memories: [
      "They see the mountain and go silent, like their brain is taking a screenshot.",
      "They decide 'respect' is part of the scenery and practice it out loud.",
      "They learn a greeting and use it on everyone with proud sincerity."
    ],
    souvenirs: ["tiny charm", "origami crane", "postcard"]
  },
  {
    code: "CL",
    name: "Chile (Rapa Nui)",
    flagEmoji: "🇨🇱",
    emoji: "🗿",
    baseCost: 1350,
    vibe: "mystery stones & ocean wind",
    memories: [
      "They look at the statues and whisper, 'These faces have seen everything.'",
      "They try to imitate the statues' expressions and accidentally invent a new family inside joke.",
      "They decide history is 'time's treasure chest' and ask to hear more."
    ],
    souvenirs: ["smooth sea stone", "tiny carved charm", "photo"]
  },
  {
    code: "GR",
    name: "Greece",
    flagEmoji: "🇬🇷",
    emoji: "🏛️",
    baseCost: 1700,
    vibe: "ancient echoes & sun on stone",
    memories: [
      "They point at columns and say, 'This is a building wearing ribs.'",
      "They ask if myths are 'history with glitter' and you can't fully disagree.",
      "They walk slowly, like they can hear old footsteps under the pavement."
    ],
    souvenirs: ["tiny coin", "marble pebble", "postcard"]
  },
  {
    code: "DE",
    name: "Germany",
    flagEmoji: "🇩🇪",
    emoji: "🏰",
    baseCost: 1600,
    vibe: "castles, clocks & tidy adventures",
    memories: [
      "They spot a castle and announce, 'This is where dragons would file paperwork.'",
      "They become obsessed with trains and start narrating departures like a sportscaster.",
      "They discover pretzels can be the size of feelings."
    ],
    souvenirs: ["train ticket", "tiny magnet", "pretzel bag"]
  },
  {
    code: "GB",
    name: "United Kingdom",
    flagEmoji: "🇬🇧",
    emoji: "🌉",
    baseCost: 1550,
    vibe: "bridges, museums & cozy rain",
    memories: [
      "They watch the bridge over the river and declare it 'a road that learned to fly.'",
      "They try tea, nod seriously, then whisper, 'I get it now.'",
      "They invent a rule that rainy days require extra kindness."
    ],
    souvenirs: ["ticket stub", "little pin", "tea tag"]
  },
  {
    code: "TR",
    name: "Turkey",
    flagEmoji: "🇹🇷",
    emoji: "🕌",
    baseCost: 1450,
    vibe: "domes, markets & story energy",
    memories: [
      "They look up at the dome and say, 'This ceiling feels like a hug.'",
      "They wander a market and whisper, 'This is like a quest hub.'",
      "They learn one polite phrase and use it like a superpower."
    ],
    souvenirs: ["small charm", "spice sachet", "postcard"]
  },
  {
    code: "IN",
    name: "India",
    flagEmoji: "🇮🇳",
    emoji: "🛕",
    baseCost: 1600,
    vibe: "colors, kindness & big feelings",
    memories: [
      "They stare at the colors and say, 'My eyes feel happy.'",
      "They learn a greeting and use it on everyone with pride.",
      "They try something spicy and immediately request water like it's a heroic side‑quest."
    ],
    souvenirs: ["bright ribbon", "sweet wrapper", "tiny bangle"]
  },
  {
    code: "IL",
    name: "Israel",
    flagEmoji: "🇮🇱",
    emoji: "🕍",
    baseCost: 1750,
    vibe: "old streets & deep stories",
    memories: [
      "They ask, 'How can one place have so many stories?' and you don't have a short answer.",
      "They get very quiet for a moment — the respectful kind.",
      "They decide history should be handled gently, like glass."
    ],
    souvenirs: ["small stone", "postcard", "bracelet"]
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flagEmoji: "🇸🇦",
    emoji: "🕋",
    baseCost: 1850,
    vibe: "awe, respect & quiet bravery",
    memories: [
      "They notice how seriously people treat sacred spaces and mirror that seriousness.",
      "They ask thoughtful questions, then practice listening more than talking.",
      "They learn that 'respect' is also a kind of courage."
    ],
    souvenirs: ["prayer beads (toy)", "small keepsake", "photo"]
  },
  {
    code: "VA",
    name: "Vatican City",
    flagEmoji: "🇻🇦",
    emoji: "⛪",
    baseCost: 1500,
    vibe: "art, echoes & whisper voices",
    memories: [
      "They walk into a huge cathedral and instinctively lower their voice — like the room asked.",
      "They look at the ceiling and say, 'Somebody painted the sky… indoors.'",
      "They decide museums are 'time machines you can walk through.'"
    ],
    souvenirs: ["tiny postcard", "museum booklet", "little charm"]
  },
  // UNLOCKABLE EXPANSION PACK (requires milestones)
  {
    code: "TH",
    name: "Thailand",
    flagEmoji: "🇹🇭",
    emoji: "🛕",
    baseCost: 1450,
    vibe: "temples, tuk-tuks & mango sticky rice",
    memories: [
      "They befriend every street cat. You're traveling with an entourage now.",
      "They discover mango sticky rice. Life-changing moment.",
      "Floating lantern festival leaves them speechless. Pure magic."
    ],
    souvenirs: ["tea cup", "fabric swatch", "small charm"],
    unlock: { minStamps: 3, milestoneId: 'frequent_flyer' }
  },
  {
    code: "IT",
    name: "Italy",
    flagEmoji: "🇮🇹",
    emoji: "🏛️",
    baseCost: 1600,
    vibe: "gelato, ruins & la dolce vita",
    memories: [
      "They discover gelato and refuse other desserts. Purist mentality.",
      "Roman Forum ruins spark history questions. Curiosity activated.",
      "Gondola ride through Venice. They sing off-key. Gondolier smiles."
    ],
    souvenirs: ["postcard", "museum ticket", "coin"],
    unlock: { minStamps: 3, milestoneId: 'frequent_flyer' }
  },
  {
    code: "MX",
    name: "Mexico",
    flagEmoji: "🇲🇽",
    emoji: "🏛️",
    baseCost: 800,
    vibe: "pyramids, tacos & vibrant culture",
    memories: [
      "They discover street tacos and won't stop ordering. Taco count: 12.",
      "Pyramid climb leaves them breathless. History feels real.",
      "Mariachi band serenades at dinner. They clap along, beaming."
    ],
    souvenirs: ["small flag", "postcard", "coin"],
    unlock: { minStamps: 3, milestoneId: 'frequent_flyer' }
  },
  {
    code: "IS",
    name: "Iceland",
    flagEmoji: "🇮🇸",
    emoji: "🌋",
    baseCost: 1500,
    vibe: "geysers, elves & otherworldly landscapes",
    memories: [
      "They're convinced they saw an elf. You don't correct them.",
      "Northern Lights dance overhead. They go completely silent with awe.",
      "Black sand beach contrasts with white waves. Nature's drama."
    ],
    souvenirs: ["snow globe", "postcard", "tiny charm"],
    unlock: { minStamps: 8, milestoneId: 'globetrotter' }
  },
  {
    code: "CA",
    name: "Canada",
    flagEmoji: "🇨🇦",
    emoji: "🍁",
    baseCost: 700,
    vibe: "maple, mountains & politeness",
    memories: [
      "They discover poutine and declare it the best food ever.",
      "Niagara Falls thunders beside them. 'It's SO LOUD.'",
      "Mountain hike reveals turquoise lakes. 'Why is it that color?'"
    ],
    souvenirs: ["small flag", "postcard", "keychain"],
    unlock: { minStamps: 5, milestoneId: 'world_school' }
  },
  {
    code: "KE",
    name: "Kenya",
    flagEmoji: "🇰🇪",
    emoji: "🦒",
    baseCost: 1750,
    vibe: "safari, savanna & wildlife wonders",
    memories: [
      "They spot a giraffe and lose their minds. Binoculars glued to face.",
      "Sunrise over the savanna stops time. Golden light everywhere.",
      "Elephant herd crosses the road. You wait, mesmerized."
    ],
    souvenirs: ["wood carving", "fabric swatch", "photo"],
    unlock: { minStamps: 8, milestoneId: 'globetrotter' }
  },
  {
    code: "AU",
    name: "Australia",
    flagEmoji: "🇦🇺",
    emoji: "🦘",
    baseCost: 2100,
    vibe: "beaches, wildlife & G'day energy",
    memories: [
      "They discover Vegemite. Opinions are STRONG.",
      "Great Barrier Reef snorkeling blows their mind. Colors everywhere.",
      "Sydney Opera House fascinates them. 'It looks like sails!'"
    ],
    souvenirs: ["shell", "postcard", "keychain"],
    unlock: { minStamps: 5, milestoneId: 'world_school' }
  },
  {
    code: "ES",
    name: "Spain",
    flagEmoji: "🇪🇸",
    emoji: "🏛️",
    baseCost: 1550,
    vibe: "flamenco, siestas & late dinners",
    memories: [
      "They discover churros con chocolate. New favorite breakfast.",
      "Sagrada Familia stuns them. 'How is it not done yet?'",
      "Flamenco show captivates them. Rhythm appreciation."
    ],
    souvenirs: ["postcard", "small flag", "coin"],
    unlock: { minStamps: 3, milestoneId: 'frequent_flyer' }
  }
];