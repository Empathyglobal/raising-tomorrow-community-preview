// Travel V2 Assets: Config, Content Pools, Souvenirs, Milestones
// Central hub for all travel content (domestic + international)

export const TRAVEL_CONFIG = {
  baseCost: {
    domestic: 900,
    international: 15000
  },
  lengthMultipliers: {
    weekend: 0.6,
    week: 1.0,
    month: 1.7
  },
  styleMultipliers: {
    budget: 0.75,
    education: 1.05,
    adventure: 1.15,
    familyVisit: 0.7,
    luxury: 1.8,
    volunteer: 0.9
  },
  companionMultipliers: {
    justUs: 1.0,
    partner: 1.15,
    grandparents: 1.05,
    schoolGroup: 0.85,
    friendFamily: 1.0
  },
  baseRisk: {
    domestic: 0.14,
    international: 0.24
  },
  riskAdds: {
    length: { weekend: -0.02, week: 0, month: 0.04 },
    style: { budget: 0.05, education: -0.02, adventure: 0.08, familyVisit: -0.05, luxury: -0.08, volunteer: 0.02 },
    prep: { overplan: -0.06, goWithFlow: 0.05, etiquettePhrases: -0.03, snackBackup: -0.04, kidHelpsPlan: -0.02 }
  },
  deltaScaling: {
    weekend: 0.8,
    week: 1.0,
    month: 1.35
  }
};

export const TRAVEL_LENGTHS = {
  weekend: {
    id: 'weekend',
    emoji: '🏃',
    label: 'Weekend',
    tooltip: 'Quick getaway (Fri-Sun)',
    focusCost: 1
  },
  week: {
    id: 'week',
    emoji: '📅',
    label: 'Week',
    tooltip: 'Full week vacation',
    focusCost: 1
  },
  month: {
    id: 'month',
    emoji: '🗓️',
    label: 'Month',
    tooltip: 'Extended stay',
    focusCost: 2
  }
};

export const TRAVEL_STYLES = {
  budget: {
    id: 'budget',
    emoji: '💸',
    label: 'Budget',
    desc: 'Hostels, street food, walking tours',
    costMult: 0.75,
    riskAdd: 0.05,
    baseDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    baseLoveDelta: 0,
    baseStressDelta: 1
  },
  education: {
    id: 'education',
    emoji: '🏛️',
    label: 'Educational',
    desc: 'Museums, history, cultural sites',
    costMult: 1.05,
    riskAdd: -0.02,
    baseDeltas: { intelligence: 2, empathy: 1, discipline: 0, confidence: 0 },
    baseLoveDelta: 0,
    baseStressDelta: 0
  },
  adventure: {
    id: 'adventure',
    emoji: '🧗',
    label: 'Adventure',
    desc: 'Hiking, ziplining, exploring',
    costMult: 1.15,
    riskAdd: 0.08,
    baseDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 2 },
    baseLoveDelta: 1,
    baseStressDelta: -1
  },
  familyVisit: {
    id: 'familyVisit',
    emoji: '🧡',
    label: 'Family Visit',
    desc: 'Stay with relatives, low-key connection',
    costMult: 0.7,
    riskAdd: -0.05,
    baseDeltas: { intelligence: 0, empathy: 2, discipline: 0, confidence: 0 },
    baseLoveDelta: 2,
    baseStressDelta: -1
  },
  luxury: {
    id: 'luxury',
    emoji: '🥂',
    label: 'Luxury',
    desc: 'Five-star hotels, spa, fine dining',
    costMult: 1.8,
    riskAdd: -0.08,
    baseDeltas: { intelligence: 0, empathy: -1, discipline: -1, confidence: 1 },
    baseLoveDelta: -1,
    baseStressDelta: -2
  },
  volunteer: {
    id: 'volunteer',
    emoji: '🤝',
    label: 'Volunteer',
    desc: 'Service projects, community work',
    costMult: 0.9,
    riskAdd: 0.02,
    baseDeltas: { intelligence: 0, empathy: 2, discipline: 1, confidence: 1 },
    baseLoveDelta: 1,
    baseStressDelta: 1
  }
};

export const TRAVEL_PREP_OPTIONS = {
  overplan: {
    id: 'overplan',
    emoji: '🗂️',
    label: 'Overplan Everything',
    desc: 'Itinerary down to the minute',
    riskAdd: -0.06,
    prepDeltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
    prepLoveDelta: 0,
    prepStressDelta: 1
  },
  goWithFlow: {
    id: 'goWithFlow',
    emoji: '🌊',
    label: 'Go With The Flow',
    desc: 'Wing it, spontaneous vibes',
    riskAdd: 0.05,
    prepDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
    prepLoveDelta: 1,
    prepStressDelta: -1
  },
  etiquettePhrases: {
    id: 'etiquettePhrases',
    emoji: '🗣️',
    label: 'Learn Key Phrases',
    desc: 'Practice local greetings & etiquette',
    riskAdd: -0.03,
    prepDeltas: { intelligence: 1, empathy: 1, discipline: 0, confidence: 0 },
    prepLoveDelta: 0,
    prepStressDelta: 0
  },
  snackBackup: {
    id: 'snackBackup',
    emoji: '🍪',
    label: 'Pack Snack Backup',
    desc: 'Emergency snacks for meltdowns',
    riskAdd: -0.04,
    prepDeltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
    prepLoveDelta: 0,
    prepStressDelta: -1
  },
  kidHelpsPlan: {
    id: 'kidHelpsPlan',
    emoji: '🧩',
    label: 'Kid Helps Plan',
    desc: 'They pick 2 activities',
    riskAdd: -0.02,
    prepDeltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 1 },
    prepLoveDelta: 1,
    prepStressDelta: 0
  }
};

export const TRAVEL_COMPANIONS = {
  justUs: {
    id: 'justUs',
    emoji: '👩‍👧',
    label: 'Just Us',
    desc: 'You and your child',
    costMult: 1.0,
    available: () => true
  },
  partner: {
    id: 'partner',
    emoji: '👫',
    label: 'With Partner',
    desc: 'Bring your partner along',
    costMult: 1.15,
    available: (gameState) => gameState.partnerMeter > 0
  },
  grandparents: {
    id: 'grandparents',
    emoji: '👵',
    label: 'With Grandparents',
    desc: 'Grandparents join the trip',
    costMult: 1.05,
    available: () => true
  },
  schoolGroup: {
    id: 'schoolGroup',
    emoji: '🎒',
    label: 'School Group',
    desc: 'Class trip with teachers',
    costMult: 0.85,
    available: (gameState) => gameState.currentYear >= 10 && gameState.inSchool
  },
  friendFamily: {
    id: 'friendFamily',
    emoji: '👯',
    label: 'Friend + Family',
    desc: 'Travel with another family',
    costMult: 1.0,
    available: () => true
  }
};

export const TRAVEL_MILESTONES = [
  {
    id: 'first_stamp',
    stampsRequired: 1,
    label: 'First Stamp',
    desc: 'First international trip!',
    emoji: '✈️',
    immediateBonus: { intelligence: 1, empathy: 0, discipline: 0, confidence: 1 },
    logLine: '✈️ First international stamp! Your passport is born.'
  },
  {
    id: 'frequent_flyer',
    stampsRequired: 3,
    label: 'Frequent Flyer',
    desc: 'Unlocks extra destinations + education style',
    emoji: '🌍',
    immediateBonus: { intelligence: 1, empathy: 1, discipline: 0, confidence: 1 },
    logLine: '🌍 Frequent Flyer milestone! New destinations + education travel unlocked.'
  },
  {
    id: 'world_school',
    stampsRequired: 5,
    label: 'World School',
    desc: 'Unlocks Study Abroad + school group companion',
    emoji: '🎓',
    immediateBonus: { intelligence: 2, empathy: 1, discipline: 0, confidence: 1 },
    logLine: '🎓 World School milestone! Study Abroad now available in School Options.'
  },
  {
    id: 'globetrotter',
    stampsRequired: 8,
    label: 'Globetrotter',
    desc: 'Unlocks volunteer style + rare destinations',
    emoji: '🗺️',
    immediateBonus: { intelligence: 1, empathy: 2, discipline: 1, confidence: 1 },
    logLine: '🗺️ Globetrotter milestone! Volunteer travel + rare destinations unlocked.'
  },
  {
    id: 'passport_legend',
    stampsRequired: 10,
    label: 'Passport Legend',
    desc: 'Unlocks Trip-of-a-Lifetime chain',
    emoji: '🏆',
    immediateBonus: { intelligence: 2, empathy: 2, discipline: 1, confidence: 2 },
    logLine: '🏆 Passport Legend! Trip-of-a-Lifetime opportunity now possible.'
  }
];

export const TRAVEL_SOUVENIR_DEFS = {
  postcard: { emoji: '📨', name: 'Postcard', perk: { durationAges: 1, deltas: { empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0, description: 'LOVE +0.1, EMP +0.1' } },
  photo: { emoji: '📸', name: 'Photo', perk: { durationAges: 1, deltas: { confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0, description: 'LOVE +0.1, CON +0.1' } },
  museumTicket: { emoji: '🎟️', name: 'Museum Ticket', perk: { durationAges: 1, deltas: { intelligence: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'INT +0.1' } },
  trainTicket: { emoji: '🚆', name: 'Train Ticket', perk: { durationAges: 1, deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'DIS +0.1' } },
  snowGlobe: { emoji: '🌐', name: 'Snow Globe', perk: { durationAges: 1, deltas: {}, loveDelta: 0, stressDelta: -0.1, description: 'STRESS -0.1' } },
  tinyCharm: { emoji: '🧿', name: 'Tiny Charm', perk: { durationAges: 1, deltas: { confidence: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'CON +0.1' } },
  keychain: { emoji: '🔑', name: 'Keychain', perk: { durationAges: 1, deltas: { discipline: 0.1 }, loveDelta: 0.1, stressDelta: 0, description: 'DIS +0.1, LOVE +0.1' } },
  magnet: { emoji: '🧲', name: 'Fridge Magnet', perk: { durationAges: 1, deltas: { empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0, description: 'LOVE +0.1, EMP +0.1' } },
  shell: { emoji: '🐚', name: 'Seashell', perk: { durationAges: 1, deltas: { confidence: 0.1 }, loveDelta: 0, stressDelta: -0.1, description: 'CON +0.1, STRESS -0.1' } },
  coin: { emoji: '🪙', name: 'Foreign Coin', perk: { durationAges: 1, deltas: { intelligence: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'INT +0.1' } },
  teaCup: { emoji: '🍵', name: 'Tea Cup', perk: { durationAges: 1, deltas: { empathy: 0.1 }, loveDelta: 0, stressDelta: -0.1, description: 'EMP +0.1, STRESS -0.1' } },
  woodCarving: { emoji: '🪵', name: 'Wood Carving', perk: { durationAges: 1, deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'DIS +0.1' } },
  fabricSwatch: { emoji: '🧵', name: 'Fabric Swatch', perk: { durationAges: 1, deltas: { empathy: 0.1, intelligence: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'INT +0.1, EMP +0.1' } },
  smallFlag: { emoji: '🏴', name: 'Small Flag', perk: { durationAges: 1, deltas: { confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0, description: 'CON +0.1, LOVE +0.1' } },
  mapPrint: { emoji: '🗺️', name: 'Map Print', perk: { durationAges: 1, deltas: { intelligence: 0.1 }, loveDelta: 0, stressDelta: 0, description: 'INT +0.1' } }
};

export const TRAVEL_EVENT_POOLS = {
  // DOMESTIC DESTINATIONS
  D1: {
    kid: [
      "They refuse to hike another step until you carry their pack. It's empty.",
      "They collect 47 rocks. You're now a portable geology exhibit.",
      "They ask if bears know not to attack kids. You lie confidently.",
      "They name every tree. By hour two, you're out of names.",
      "They insist on camping 'like pioneers.' The tent collapses twice.",
      "They find a stick and won't stop poking things. Everything."
    ],
    culture: [
      "The ranger talk about ecosystems actually lands. They're glued to every word.",
      "Sunrise over the valley stops them mid-complaint. A rare quiet moment.",
      "Trail snacks taste better outdoors. Science can't explain it, but it's true."
    ],
    complication: [
      "They get car sick on the winding road. Window down, damage contained.",
      "A forgotten water bottle means rationing. Lessons in sharing emerge.",
      "Mosquitoes declare war. You lose."
    ]
  },
  D2: {
    kid: [
      "They discover revolving doors and won't leave. Security notices.",
      "They rate every subway busker. Harsh critiques for a 7-year-old.",
      "They lose a shoe in a taxi. The driver finds it three blocks later.",
      "They ask why everyone's in such a hurry. You don't have an answer.",
      "They try street vendor food and become a critic. 'Needs salt.'",
      "They collect metro tickets like trading cards."
    ],
    culture: [
      "A street performer juggles fire. They watch, hypnotized, for 20 minutes.",
      "The skyline at night makes them gasp. 'It's like a giant computer.'",
      "They overhear three languages in one block. 'How do they all know what to say?'"
    ],
    complication: [
      "You lose them for 90 seconds in a crowd. Longest 90 seconds of your life.",
      "Hotel room service costs more than the flight. Lesson learned.",
      "They touch a 'Do Not Touch' sculpture. Alarms sound."
    ]
  },
  D3: {
    kid: [
      "They build a sandcastle empire. Other kids join. You're now supervising 12.",
      "They refuse to leave the water. Pruney fingers don't deter them.",
      "They collect shells and rank them by 'shell-ness.' The criteria are unclear.",
      "They discover hermit crabs and want to adopt one. You negotiate.",
      "They ask why the ocean is salty. Your answer is 50% accurate.",
      "They bury your feet in sand. You're stuck for 10 minutes."
    ],
    culture: [
      "The sunset paints the sky orange. They stop mid-dig to watch.",
      "A fishing boat pulls in with the catch. They learn where food comes from.",
      "Boardwalk arcade lights flicker on. Pure, unfiltered joy."
    ],
    complication: [
      "Sunscreen application becomes a wrestling match. SPF 50 everywhere.",
      "They step on a sharp shell. First aid kit earns its keep.",
      "Lost flip-flop washes out to sea. Barefoot walk back."
    ]
  },
  D4: {
    kid: [
      "They map out the perfect ride strategy. It's a 47-step plan.",
      "They win a giant stuffed animal. You're now carrying it everywhere.",
      "They discover churros. Repeat visits to the cart ensue.",
      "They convince you to go on the scariest ride. You regret it.",
      "They rate every mascot hug. The scoring system is brutal.",
      "They memorize the park map. Better navigation than you."
    ],
    culture: [
      "The parade stops them in their tracks. 'How do they make it float?'",
      "Fireworks finale lights up their face. Worth every penny.",
      "Character meet-and-greet goes perfectly. Photo-op gold."
    ],
    complication: [
      "Bathroom line takes 30 minutes. Strategic error.",
      "They eat too much cotton candy. Regret is instant.",
      "Lost in the crowd for 2 minutes. Reunification hugs are tight."
    ]
  },
  D5: {
    kid: [
      "They discover the joy of feeding chipmunks. You now have 8 new friends.",
      "They insist on 'survival mode.' No electricity after dark.",
      "They ask if Bigfoot is real. You leave room for mystery.",
      "They build a fort out of couch cushions. It's architecturally impressive.",
      "They find a creek and won't leave. Waterlogged socks incoming.",
      "They roast marshmallows with scientific precision. Char levels debated."
    ],
    culture: [
      "Stargazing without light pollution blows their mind. 'There's SO MANY.'",
      "Morning mist rolls in like a movie. They whisper to preserve the magic.",
      "Reading by firelight hits different. Cozy doesn't cover it."
    ],
    complication: [
      "The cabin has no Wi-Fi. Withdrawal symptoms last 4 hours.",
      "A raccoon gets into the trash. Nature: 1, You: 0.",
      "They forget their favorite stuffed animal. Emotional crisis averted via facetime."
    ]
  },
  D6: {
    kid: [
      "They eat grandma's cookies until you intervene. Stomachache imminent.",
      "They listen to grandpa's stories like gospel. You've heard them 100 times.",
      "They discover old photo albums. 'You looked WEIRD as a kid.'",
      "They help in the garden and get filthy. Bath required.",
      "They ask why everything smells different here. Nostalgia is real.",
      "They bond over a card game. Grandparents let them win (mostly)."
    ],
    culture: [
      "Family dinner around the table. No phones, just conversation.",
      "They learn a family recipe. Generational knowledge transfer.",
      "Old neighborhood walk. 'This is where you grew up?' Awe in their voice."
    ],
    complication: [
      "They break a 'priceless' vase. Turns out it's from Target.",
      "Bedtime routine is off. Overtired meltdown at 9 PM.",
      "They eat something they're not used to. Tummy protests."
    ]
  },
  D7: {
    kid: [
      "They touch every interactive exhibit. Twice.",
      "They ask 'why' 400 times during the planetarium show.",
      "They befriend a docent and get a private tour. Charisma wins.",
      "They discover the gift shop. You negotiate a $10 limit.",
      "They build a robot in the workshop. It doesn't work, but they're proud.",
      "They sleep under the dinosaurs. Best sleepover ever."
    ],
    culture: [
      "A live science demo sparks questions for weeks. Curiosity ignited.",
      "The space exhibit makes them dream bigger. 'Can I be an astronaut?'",
      "A fossil display stops them cold. 'This is MILLIONS of years old.'"
    ],
    complication: [
      "They get overstimulated by closing time. Sensory overload meltdown.",
      "They lose their jacket. Found in the meteorite section.",
      "They eat museum cafe food. It's worse than school lunch."
    ]
  },
  D8: {
    kid: [
      "They discover altitude and complain about breathing. Drama level: 10.",
      "They collect pinecones like treasure. Your bag weighs 40 lbs.",
      "They ask if you can see your house from here. You cannot.",
      "They insist on leading the hike. You get slightly lost.",
      "They discover snow and lose their minds. Snowball fight mandatory.",
      "They rate the view. '8 out of 10. Needs more rainbows.'"
    ],
    culture: [
      "Summit sunrise paints the peaks gold. They go silent with awe.",
      "Mountain air hits different. 'Why does it smell so... clean?'",
      "Cable car ride terrifies and thrills them. White knuckles the whole way."
    ],
    complication: [
      "They get a minor altitude headache. Water and rest fix it.",
      "Forgotten gloves mean cold hands. Shared warmth required.",
      "Trail snack runs out early. Hangry child activated."
    ]
  },

  // INTERNATIONAL DESTINATIONS (existing + unlockable)
  JP: {
    kid: [
      "They discover vending machines that sell everything. Button-pushing marathon.",
      "They bow to everyone. Politeness level: expert.",
      "They try chopsticks and refuse help. Determination wins after 20 minutes.",
      "They collect origami paper and fold 50 cranes. Your hotel room is a gallery.",
      "They ask if anime is real life here. You gently correct.",
      "They rank every conveyor belt sushi plate. The octopus loses."
    ],
    culture: [
      "Temple bells at dawn stop them mid-step. Reverence is automatic.",
      "Cherry blossoms fall like snow. They try to catch every petal.",
      "Shinkansen glides past at 200 mph. 'How is it so QUIET?'"
    ],
    complication: [
      "They get overwhelmed in Shibuya crossing. Crowd density = chaos.",
      "Jet lag hits hard. 3 AM wake-up calls for a week.",
      "They eat too much mochi. Tummy regrets."
    ]
  },
  FR: {
    kid: [
      "They refuse to eat anything but bread and chocolate. Carb-loading champion.",
      "They try to speak French. Every word sounds like 'bonjour.'",
      "They climb the Eiffel Tower stairs. Complain the whole way.",
      "They rate every croissant. The scoring system is harsh.",
      "They discover macarons and won't stop asking for more.",
      "They ask why everyone sounds fancy. You shrug."
    ],
    culture: [
      "Louvre overwhelms them in the best way. 'There's SO MUCH ART.'",
      "Street musicians play accordion. They dance unselfconsciously.",
      "Seine river cruise at sunset. They go quiet, soaking it in."
    ],
    complication: [
      "They get hangry during museum hour 3. Emergency snack deployed.",
      "Lost in the Metro. Google Maps saves the day.",
      "They touch a 'Do Not Touch' painting. Alarms sound."
    ]
  },
  TH: {
    kid: [
      "They befriend every street cat. You're now traveling with an entourage.",
      "They discover mango sticky rice. Life-changing moment.",
      "They try to haggle at the market. Vendor laughs and gives them a deal.",
      "They ask if elephants are everywhere. You explain sanctuaries.",
      "They collect tuk-tuk rides like Pokemon. 'Gotta ride 'em all.'",
      "They learn 'sawadee ka' and use it constantly. Pronunciation: questionable."
    ],
    culture: [
      "Temple etiquette lesson sinks in. They remove shoes without prompting.",
      "Floating lantern festival leaves them speechless. Pure magic.",
      "Longtail boat ride through floating markets. Sensory overload in the best way."
    ],
    complication: [
      "They eat something too spicy. Milk emergency.",
      "Mosquito bites everywhere. Itch fest for days.",
      "They lose a flip-flop in a canal. Gone forever."
    ]
  },
  IT: {
    kid: [
      "They discover gelato and refuse other desserts. Purist mentality.",
      "They throw a coin in the Trevi Fountain. 'When do we come back?'",
      "They climb the Colosseum stairs and pretend they're gladiators.",
      "They ask if pizza here is 'real pizza.' You confirm.",
      "They collect postcards and rank them by 'Italy-ness.'",
      "They learn 'ciao' and use it on everyone. Charm offensive works."
    ],
    culture: [
      "Roman Forum ruins spark history questions. Curiosity activated.",
      "Gondola ride through Venice canals. They sing off-key. Gondolier smiles.",
      "Sistine Chapel ceiling stops them cold. 'How did they paint that?'"
    ],
    complication: [
      "They get lost in narrow streets. GPS fails. You ask locals.",
      "They eat too much pasta. Carb coma hits.",
      "Pickpocket attempt. You catch it. They don't notice."
    ]
  },
  MX: {
    kid: [
      "They discover street tacos and won't stop ordering. Taco count: 12.",
      "They collect Lucha Libre masks. Your suitcase is now 50% masks.",
      "They ask if everyone knows how to dance. You say yes.",
      "They learn 'hola' and use it constantly. Enthusiasm: 100%.",
      "They discover churros and rank every vendor. The competition is fierce.",
      "They befriend a street dog. You negotiate (no adoption)."
    ],
    culture: [
      "Pyramid climb at Teotihuacan leaves them breathless. History feels real.",
      "Mariachi band serenades at dinner. They clap along, beaming.",
      "Beach sunset paints the sky pink. They stop building sandcastles to watch."
    ],
    complication: [
      "They drink too much agua fresca. Bathroom runs commence.",
      "Sunburn despite SPF 50. Aloe vera to the rescue.",
      "They lose their hat in the ocean. Wave: 1, Hat: 0."
    ]
  },
  IS: {
    kid: [
      "They're convinced they saw an elf. You don't correct them.",
      "They discover hot springs and refuse to leave. Pruney skin incoming.",
      "They collect volcanic rocks. Your bag weighs 50 lbs.",
      "They ask if Iceland has ice cream. You find some. It's excellent.",
      "They rate every waterfall. The scoring criteria evolve.",
      "They learn 'takk' and use it constantly. Politeness level: expert."
    ],
    culture: [
      "Northern Lights dance overhead. They go completely silent with awe.",
      "Geothermal pools steam in the cold. 'It's like magic.'",
      "Black sand beach contrasts with white waves. Nature's drama."
    ],
    complication: [
      "They forget gloves. Cold hands emergency.",
      "Wind nearly blows them over. You hold tight.",
      "They eat fermented shark. Immediate regret."
    ]
  },
  CA: {
    kid: [
      "They discover poutine and declare it the best food ever.",
      "They ask if everyone really says 'eh.' You say yes (mostly).",
      "They collect maple leaf souvenirs. The collection grows.",
      "They learn 'bonjour' in Quebec. Pronunciation: adorable.",
      "They rate every Tim Hortons visit. The donuts win.",
      "They ask if polar bears are everywhere. You explain geography."
    ],
    culture: [
      "Niagara Falls thunders beside them. 'It's SO LOUD.'",
      "Hockey game atmosphere electrifies them. They learn to cheer.",
      "Mountain hike reveals turquoise lakes. 'Why is it that color?'"
    ],
    complication: [
      "They underestimate the cold. Extra layers required.",
      "They get syrup on everything. Sticky situation.",
      "Lost in a big mall. Security helps reunite."
    ]
  },
  KE: {
    kid: [
      "They spot a giraffe and lose their minds. Binoculars won't leave their face.",
      "They ask if lions are friendly. You explain 'no' firmly.",
      "They collect safari photos. Camera roll: 500 images of grass.",
      "They learn Swahili greetings. 'Jambo' becomes their favorite word.",
      "They discover ugali and rate it. 'Interesting texture.'",
      "They befriend a safari guide. Stories for days."
    ],
    culture: [
      "Sunrise over the savanna stops time. Golden light everywhere.",
      "Maasai village visit teaches them about different ways of living.",
      "Elephant herd crosses the road. You wait, mesmerized."
    ],
    complication: [
      "They get motion sick in the safari vehicle. Window down helps.",
      "Mosquito bites despite repellent. Itch cream deployed.",
      "They forget their camera. Your phone storage fills up."
    ]
  },
  AU: {
    kid: [
      "They discover Vegemite. Opinions are STRONG.",
      "They ask if everything here can kill you. You say 'mostly.'",
      "They collect seashells on the beach. Variety impresses.",
      "They learn 'G'day' and use it constantly. Accent: questionable.",
      "They discover Tim Tams and won't share. Fair enough.",
      "They rate every kangaroo sighting. The bar keeps rising."
    ],
    culture: [
      "Great Barrier Reef snorkeling blows their mind. Colors everywhere.",
      "Sydney Opera House architecture fascinates them. 'It looks like sails!'",
      "Beach culture teaches them surf lingo. They use it wrong but enthusiastically."
    ],
    complication: [
      "They get sunburned despite sunscreen. Aloe vera emergency.",
      "Jet lag is brutal. Time zone: defeated.",
      "They eat too much gelato. Tummy protests."
    ]
  },

  // Add more for other existing destinations from travelDestinations.jsx
  US: {
    kid: [
      "They rate every state they see from the plane. The criteria are unclear.",
      "They discover regional accents and try to mimic them. Results vary.",
      "They collect pennies from every state. Numismatics begins.",
      "They ask why some places don't have mountains. Geography lesson ensues.",
      "They try new regional food and become critics. 'Needs more flavor.'",
      "They discover time zones and won't stop talking about them."
    ],
    culture: [
      "National monument visit sparks patriotism questions. Complex conversations.",
      "Regional music style surprises them. 'Why does it sound different?'",
      "Local festival immerses them in community. Belonging feels universal."
    ],
    complication: [
      "They lose their tablet charger. Screen time rationing begins.",
      "Flight delay means airport camping. Snack budget exhausted.",
      "They get carsick on a winding road. Window down, damage minimal."
    ]
  },
  GB: {
    kid: [
      "They discover afternoon tea and insist on doing it 'properly.'",
      "They collect double-decker bus photos. Red bus obsession.",
      "They ask why everyone sounds 'fancy.' Accent appreciation.",
      "They learn British slang and use it wrong. 'Cheerio!' at breakfast.",
      "They discover fish and chips. Life-changing moment.",
      "They rate every palace guard. The stoic ones win."
    ],
    culture: [
      "Tower of London history lesson lands. 'They did WHAT?'",
      "Changing of the guard mesmerizes them. Precision appreciated.",
      "Thames river cruise reveals the city's layout. Geography clicks."
    ],
    complication: [
      "They get confused by 'looking right' when crossing. Close calls.",
      "Rain catches you without umbrella. Soggy afternoon.",
      "They eat too much candy. Sugar crash imminent."
    ]
  },
  ES: {
    kid: [
      "They discover churros con chocolate. New favorite breakfast.",
      "They try to take a siesta. It doesn't work. Too excited.",
      "They learn 'hola' and 'gracias.' Pronunciation: adorable.",
      "They collect flamenco fan souvenirs. The collection grows.",
      "They ask why dinner is so late. You explain culture.",
      "They discover paella and won't stop talking about it."
    ],
    culture: [
      "Sagrada Familia architecture stuns them. 'How is it not done yet?'",
      "Flamenco show captivates them. Rhythm appreciation.",
      "Beach culture teaches them Mediterranean pace. They adapt."
    ],
    complication: [
      "They get overwhelmed in Las Ramblas. Crowd density chaos.",
      "Siesta time confuses them. Everything's closed?!",
      "They eat too much gelato. Tummy regrets."
    ]
  }
};

export const TRAVEL_INTEREST_SYNERGY = {
  animals: { bonus: { empathy: 0.1 }, line: "Their animal interest sparks extra questions about local wildlife." },
  space: { bonus: { intelligence: 0.1 }, line: "Their space fascination connects to navigation and geography talk." },
  music: { bonus: { confidence: 0.1 }, line: "Their music interest helps them appreciate local sounds and rhythms." },
  building: { bonus: { discipline: 0.1 }, line: "Their building interest makes them notice architecture everywhere." },
  art: { bonus: { intelligence: 0.1 }, line: "Their art interest heightens appreciation for visual culture." },
  helping: { bonus: { empathy: 0.1 }, line: "Their helping nature makes them notice how communities work together." },
  sports: { bonus: { confidence: 0.1 }, line: "Their sports interest keeps them energized for physical activities." }
};

export const QUIRK_FOLLOWUP_TAGS = [
  "quirk_tea_time",
  "quirk_postcard_wall",
  "quirk_museum_whisper",
  "quirk_train_announcer",
  "quirk_new_word",
  "quirk_map_reader",
  "quirk_souvenir_collector",
  "quirk_travel_journal"
];