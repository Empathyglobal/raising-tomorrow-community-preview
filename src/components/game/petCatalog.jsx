export const PET_CATALOG = [
  {
    speciesKey: "dog",
    displayName: "Dog",
    selTheme: "Empathy + Responsibility",
    vibeLine: "A loyal routine-builder with big comfort energy.",
    upfrontCostRange: [300, 1200],
    yearlyUpkeepRange: [300, 800],
    lifespanRangeYears: [10, 13],
    startingAgeRange: [0, 12],
    names: ["Buddy","Clover","Sunny","Scout","Noodle","Pepper","Bear","Luna","Rocky","Daisy"],
    actions: [
      { id: "walk", name: "Daily Walk", emoji: "🦮", focusCost: 1, effects: { stress: -1, discipline: 0.2, empathy: 0.2 } },
      { id: "play", name: "Play Fetch", emoji: "🎾", focusCost: 1, effects: { stress: -2, confidence: 0.2 } },
      { id: "feed", name: "Premium Treat", emoji: "🦴", moneyCost: 15, effects: { love: 1, stress: -0.5 } },
      { id: "bathe", name: "Bath Time", emoji: "🛁", focusCost: 1, effects: { discipline: 0.3, stress: 1 } }
    ],
    miniEvents: [
      {
        id: "dog_leash",
        title: "Lost Leash Lesson",
        body: "Halfway home, the leash clip pops free. Your dog freezes, then looks to your child like it’s asking, “Now what?”",
        choices: [
          { text: "Stay calm and call gently", effects: { stress: -1, confidence: 0.2, empathy: 0.2 } },
          { text: "Chase and grab", effects: { stress: 1, discipline: 0.1 } }
        ]
      },
      {
        id: "dog_comfort",
        title: "The Quiet Comfort",
        body: "After a hard day, your child sits down. Your dog simply leans in—warm and silent. No advice. Just presence.",
        choices: [
          { text: "Let the moment be enough", effects: { stress: -1, empathy: 0.3 } }
        ]
      },
      {
        id: "dog_mud",
        title: "Mud Paw Diplomacy",
        body: "Your dog returns proudly coated in mud. Your child laughs… then remembers the couch exists.",
        choices: [
          { text: "Make cleanup a team job", effects: { discipline: 0.2, stress: -1 } },
          { text: "Scold first, clean later", effects: { stress: 1, empathy: 0.1 } }
        ]
      },
      {
        id: "dog_training",
        title: "Training Pays Off",
        body: "You try a simple “sit.” Your dog listens on the first try. Your child lights up like they unlocked a life skill.",
        choices: [
          { text: "Celebrate the win", effects: { discipline: 0.3, confidence: 0.2 } }
        ]
      },
      {
        id: "dog_neighbor",
        title: "A Nervous Neighbor",
        body: "A nearby dog barks wildly. Your child notices the fear behind the noise and keeps a respectful distance.",
        choices: [
          { text: "Model calm and space", effects: { empathy: 0.3, confidence: 0.1 } }
        ]
      },
      {
        id: "dog_rain",
        title: "Rain Walk Resolve",
        body: "It’s raining. Your dog still needs a walk. Your child hesitates, then grabs a jacket anyway.",
        choices: [
          { text: "Go anyway", effects: { discipline: 0.3, confidence: 0.1 } }
        ]
      },
      {
        id: "dog_sandwich",
        title: "The Stolen Sandwich",
        body: "A sandwich disappears. Your dog looks extremely innocent in a way that is not convincing.",
        choices: [
          { text: "Teach boundaries calmly", effects: { discipline: 0.2, empathy: 0.1 } },
          { text: "Get angry", effects: { stress: 1 } }
        ]
      },
      {
        id: "dog_waterbowl",
        title: "A Small Act of Care",
        body: "Without being asked, your child refills the water bowl. Your dog wags like it’s the best day of the year.",
        choices: [
          { text: "Notice it out loud", effects: { discipline: 0.2, empathy: 0.2 } }
        ]
      }
    ]
  },
  {
    speciesKey: "cat",
    displayName: "Cat",
    selTheme: "Emotional Regulation + Boundaries",
    vibeLine: "A calm companion who teaches ‘yes’ and ‘not now.’",
    upfrontCostRange: [100, 600],
    yearlyUpkeepRange: [200, 600],
    lifespanRangeYears: [12, 16],
    names: ["Mochi","Shadow","Cleo","Simba","Poppy","Soot","Willow","Bean","Nova","Miso"],
    actions: [
      { id: "cuddle", name: "Quiet Cuddle", emoji: "😺", focusCost: 1, effects: { stress: -1, confidence: 0.2, empathy: 0.1 } },
      { id: "play", name: "Laser Pointer", emoji: "🔦", focusCost: 1, effects: { stress: -1, confidence: 0.1 } },
      { id: "feed", name: "Salmon Treat", emoji: "🐟", moneyCost: 10, effects: { love: 1 } },
      { id: "brush", name: "Brush Coat", emoji: "🖌️", focusCost: 1, effects: { empathy: 0.2, stress: -0.5 } }
    ],
    miniEvents: [
      {
        id: "cat_chosen",
        title: "Chosen",
        body: "For the first time, your cat hops into your child’s lap by choice. Your child freezes, then smiles like they’ve been trusted with a secret.",
        choices: [
          { text: "Stay still and present", effects: { confidence: 0.3, empathy: 0.2, stress: -1 } }
        ]
      },
      {
        id: "cat_boundary",
        title: "Not Now",
        body: "Your child reaches to pet, and the cat steps away. A tiny lesson in ‘no.’",
        choices: [
          { text: "Respect the boundary", effects: { empathy: 0.2, discipline: 0.1 } },
          { text: "Try to force affection", effects: { stress: 1 } }
        ]
      },
      {
        id: "cat_purr",
        title: "Purring While Sad",
        body: "Your child is upset. The cat sits nearby, purring like a tiny engine of calm.",
        choices: [
          { text: "Let calm arrive slowly", effects: { stress: -1, empathy: 0.2 } }
        ]
      },
      {
        id: "cat_zoomies",
        title: "Midnight Zoomies",
        body: "At night, the cat sprints through the house like it’s training for a championship.",
        choices: [
          { text: "Laugh and adjust", effects: { stress: -1, confidence: 0.1 } },
          { text: "Get frustrated", effects: { stress: 1 } }
        ]
      },
      {
        id: "cat_scratch",
        title: "Curious Claws",
        body: "The cat claws something important. Very important.",
        choices: [
          { text: "Set a boundary and offer a scratch post", effects: { discipline: 0.2, intelligence: 0.1 } },
          { text: "Yell", effects: { stress: 1 } }
        ]
      },
      {
        id: "cat_slowblink",
        title: "Slow Blink Language",
        body: "You teach your child the slow blink. The cat returns it—like a conversation without words.",
        choices: [
          { text: "Practice gentle signals", effects: { confidence: 0.2, empathy: 0.2 } }
        ]
      },
      {
        id: "cat_routine",
        title: "Feeding Clock",
        body: "The cat appears exactly on schedule. Your child realizes routines can be comforting.",
        choices: [
          { text: "Keep the ritual", effects: { discipline: 0.2 } }
        ]
      },
      {
        id: "cat_sharedsilence",
        title: "Shared Silence",
        body: "Nothing happens. It’s just quiet. And somehow, that helps.",
        choices: [
          { text: "Enjoy the quiet", effects: { stress: -1, confidence: 0.1 } }
        ]
      }
    ]
  },
  {
    speciesKey: "rabbit",
    displayName: "Rabbit",
    selTheme: "Gentleness + Patience",
    vibeLine: "Soft trust that grows only when you slow down.",
    upfrontCostRange: [40, 150],
    yearlyUpkeepRange: [150, 350],
    lifespanRangeYears: [7, 10],
    startingAgeRange: [0, 7],
    names: ["Thumper","Snowdrop","Biscuit","Hazel","Cocoa","Marble","Dandelion","Sprout","Juniper","Nibbles"],
    actions: [
      { id: "care", name: "Gentle Care", emoji: "🐰", focusCost: 1, effects: { empathy: 0.3, discipline: 0.1 } },
      { id: "feed", name: "Fresh Greens", emoji: "🥬", moneyCost: 5, effects: { love: 0.5, stress: -0.2 } },
      { id: "clean", name: "Clean Hutch", emoji: "🧹", focusCost: 1, effects: { discipline: 0.3 } }
    ],
    miniEvents: [
      {
        id: "rab_startle",
        title: "Soft Startle",
        body: "A sudden noise makes the rabbit freeze. Your child whispers and moves slowly, like they’re learning a new way to exist.",
        choices: [
          { text: "Go slow together", effects: { empathy: 0.3, confidence: 0.1 } }
        ]
      },
      {
        id: "rab_handfeed",
        title: "Tiny Trust",
        body: "The rabbit eats from your child’s hand. Your child looks proud—then quieter than usual.",
        choices: [
          { text: "Let trust take its time", effects: { empathy: 0.2, stress: -1 } }
        ]
      },
      {
        id: "rab_chew",
        title: "Chewed Corner",
        body: "The rabbit nibbles something it shouldn’t. Your child learns that prevention beats panic.",
        choices: [
          { text: "Rabbit-proof calmly", effects: { discipline: 0.2, intelligence: 0.1 } },
          { text: "Panic", effects: { stress: 1 } }
        ]
      },
      {
        id: "rab_sick",
        title: "Careful Care",
        body: "The rabbit seems unwell. Your child follows each instruction carefully—like responsibility just got real.",
        choices: [
          { text: "Do the care steps", effects: { discipline: 0.3, empathy: 0.2 } }
        ]
      },
      {
        id: "rab_wait",
        title: "Patience Practice",
        body: "The rabbit won’t come out today. Your child waits anyway.",
        choices: [
          { text: "Wait without rushing", effects: { discipline: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "rab_cleanup",
        title: "Not Glamorous, Still Love",
        body: "You clean the habitat together. It’s not exciting, but it’s care in its most honest form.",
        choices: [
          { text: "Finish the job", effects: { discipline: 0.2, empathy: 0.1 } }
        ]
      },
      {
        id: "rab_joyhop",
        title: "Small Joy",
        body: "The rabbit does a tiny hop of excitement. Your child laughs like it’s the best comedy show.",
        choices: [
          { text: "Let joy be small and real", effects: { stress: -1, confidence: 0.1 } }
        ]
      },
      {
        id: "rab_gentlevoice",
        title: "Gentle Voice",
        body: "Your child notices the rabbit relaxes more with soft tones than loud ones.",
        choices: [
          { text: "Practice softness", effects: { empathy: 0.2 } }
        ]
      }
    ]
  },
  {
    speciesKey: "fish",
    displayName: "Fish",
    selTheme: "Mindfulness + Consistency",
    vibeLine: "Quiet routines that teach steady attention.",
    upfrontCostRange: [80, 300],
    yearlyUpkeepRange: [60, 200],
    lifespanRangeYears: [3, 10],
    startingAgeRange: [0, 4],
    names: ["Bubbles","Coral","Finn","Ripple","Neon","Pebble","Blue","Sunny","Flash","Drift"],
    actions: [
      { id: "check", name: "Tank Check", emoji: "🔎", focusCost: 1, effects: { stress: -1, discipline: 0.2 } },
      { id: "feed", name: "Flakes", emoji: "🥫", moneyCost: 2, effects: { stress: -0.1 } },
      { id: "clean", name: "Water Change", emoji: "💧", focusCost: 1, effects: { discipline: 0.3, intelligence: 0.1 } }
    ],
    miniEvents: [
      {
        id: "fish_cloudy",
        title: "Cloudy Water",
        body: "The tank gets cloudy. Your child learns that neglect doesn’t scream—it slowly appears.",
        choices: [
          { text: "Fix it step by step", effects: { discipline: 0.3, intelligence: 0.1 } },
          { text: "Put it off", effects: { stress: 1 } }
        ]
      },
      {
        id: "fish_watch",
        title: "Quiet Watching",
        body: "Your child watches the fish swim in circles. Their shoulders drop.",
        choices: [
          { text: "Breathe with the rhythm", effects: { stress: -1, confidence: 0.1 } }
        ]
      },
      {
        id: "fish_overfeed",
        title: "Overfeeding Lesson",
        body: "Too much food, too fast. The tank suffers. Your child learns moderation.",
        choices: [
          { text: "Adjust the habit", effects: { discipline: 0.2, intelligence: 0.1 } }
        ]
      },
      {
        id: "fish_test",
        title: "Water Test Scientist",
        body: "Your child treats the water test like real science.",
        choices: [
          { text: "Learn what the numbers mean", effects: { intelligence: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "fish_plant",
        title: "A New Plant",
        body: "You add a plant. The tank looks calmer. So does your child.",
        choices: [
          { text: "Enjoy the small upgrade", effects: { stress: -1, empathy: 0.1 } }
        ]
      },
      {
        id: "fish_maintenance",
        title: "Maintenance Day",
        body: "It isn’t exciting, but it works. Your child learns consistency is a kind of strength.",
        choices: [
          { text: "Keep the streak going", effects: { discipline: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "fish_gentleloss",
        title: "A Gentle Loss",
        body: "One fish doesn’t make it. Your child feels sad—and thoughtful. You talk about caring without controlling outcomes.",
        choices: [
          { text: "Name the feelings", effects: { empathy: 0.2, stress: 1 } }
        ]
      },
      {
        id: "fish_pride",
        title: "Routine Pride",
        body: "Without being asked, your child checks the tank first thing.",
        choices: [
          { text: "Praise the consistency", effects: { discipline: 0.3 } }
        ]
      }
    ]
  },
  {
    speciesKey: "bird",
    displayName: "Bird",
    selTheme: "Curiosity + Communication",
    vibeLine: "A chatty teacher of patience, words, and connection.",
    upfrontCostRange: [50, 500],
    yearlyUpkeepRange: [150, 500],
    lifespanRangeYears: [8, 20],
    startingAgeRange: [0, 8],
    names: ["Kiwi","Pico","Skye","Sunny","Echo","Rio","Coco","Pip","Opal","Zazu"],
    actions: [
      { id: "teach", name: "Teach Phrase", emoji: "🗣️", focusCost: 1, effects: { confidence: 0.2, empathy: 0.1, intelligence: 0.1 } },
      { id: "play", name: "Play Perch", emoji: "🪜", focusCost: 1, effects: { stress: -1, empathy: 0.1 } },
      { id: "feed", name: "Seed Stick", emoji: "🌾", moneyCost: 5, effects: { love: 0.5 } }
    ],
    miniEvents: [
      {
        id: "bird_feelings",
        title: "Feeling Words",
        body: "The bird repeats a phrase your child has been practicing: “I feel upset.” It lands like a tiny emotional mirror.",
        choices: [
          { text: "Practice the phrase together", effects: { empathy: 0.3, confidence: 0.2 } }
        ]
      },
      {
        id: "bird_patience",
        title: "Patient Repetition",
        body: "It takes many tries, but the bird learns. Your child learns too.",
        choices: [
          { text: "Stick with it", effects: { discipline: 0.2, intelligence: 0.1 } }
        ]
      },
      {
        id: "bird_volume",
        title: "Gentle Volume",
        body: "The bird startles at loud voices. Your child tries a softer tone—and sees it work.",
        choices: [
          { text: "Keep it gentle", effects: { empathy: 0.2, stress: -1 } }
        ]
      },
      {
        id: "bird_trust",
        title: "Trust Perch",
        body: "The bird hops onto your child’s finger like it’s no big deal. Your child disagrees—it’s a huge deal.",
        choices: [
          { text: "Celebrate quietly", effects: { confidence: 0.3 } }
        ]
      },
      {
        id: "bird_wrongtime",
        title: "Wrong Timing",
        body: "The bird repeats a phrase at the worst possible moment. Your child tries not to laugh. Tries.",
        choices: [
          { text: "Laugh and move on", effects: { stress: -1, confidence: 0.1 } }
        ]
      },
      {
        id: "bird_questions",
        title: "Curious Questions",
        body: "Your child asks why birds mimic. You look it up together.",
        choices: [
          { text: "Learn one new fact", effects: { intelligence: 0.2 } }
        ]
      },
      {
        id: "bird_space",
        title: "Respect Space",
        body: "The bird steps away. Your child pauses instead of pushing.",
        choices: [
          { text: "Let “no” be okay", effects: { empathy: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "bird_morningsong",
        title: "Morning Song",
        body: "The bird sings early. Your child grumbles—then laughs. Routines can be shared, even when they’re annoying.",
        choices: [
          { text: "Adapt the routine", effects: { discipline: 0.2, stress: -1 } }
        ]
      }
    ]
  },
  {
    speciesKey: "snake",
    displayName: "Snake",
    selTheme: "Courage + Calm Under Pressure",
    vibeLine: "A calm companion that rewards steady hands and steady breath.",
    upfrontCostRange: [200, 800],
    yearlyUpkeepRange: [150, 500],
    lifespanRangeYears: [12, 20],
    startingAgeRange: [0, 10],
    names: ["Sable","Jade","Onyx","Nori","Ivy","Ember","Rune","Slinky","Quartz","Nyx"],
    actions: [
      { id: "handle", name: "Gentle Handling", emoji: "🤲", focusCost: 1, effects: { stress: -1, confidence: 0.3, empathy: 0.1 } },
      { id: "feed", name: "Feeding Time", emoji: "🐁", moneyCost: 8, effects: { intelligence: 0.1, discipline: 0.1 } },
      { id: "observe", name: "Observe Shed", emoji: "👀", focusCost: 1, effects: { intelligence: 0.2 } }
    ],
    miniEvents: [
      {
        id: "snake_shed",
        title: "Shed Skin, New Story",
        body: "You find a perfect shed skin. Your child holds it like proof that change can be clean and complete.",
        choices: [
          { text: "Talk about growth", effects: { confidence: 0.3, intelligence: 0.1 } }
        ]
      },
      {
        id: "snake_breath",
        title: "Breath First",
        body: "Your child gets nervous before handling. They try one slow breath. Then another.",
        choices: [
          { text: "Practice calm on purpose", effects: { stress: -1, confidence: 0.2 } }
        ]
      },
      {
        id: "snake_myths",
        title: "Myths vs Facts",
        body: "A friend calls the snake “scary.” Your child says, “It’s just different.” You look up facts together.",
        choices: [
          { text: "Learn and reframe", effects: { intelligence: 0.2, confidence: 0.2 } }
        ]
      },
      {
        id: "snake_temp",
        title: "Temperature Check",
        body: "Your child learns how sensitive the habitat is. Small details matter.",
        choices: [
          { text: "Do the careful setup", effects: { discipline: 0.2, intelligence: 0.2 } }
        ]
      },
      {
        id: "snake_slowhands",
        title: "Slow Hands Win",
        body: "Fast motions stress the snake. Your child practices slow control and sees the difference.",
        choices: [
          { text: "Move slower next time", effects: { discipline: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "snake_consent",
        title: "Stop Means Stop",
        body: "Your child learns: if the snake is stressed, you stop. That’s the rule.",
        choices: [
          { text: "Respect the signal", effects: { empathy: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "snake_quietpride",
        title: "Quiet Pride",
        body: "The snake rests calmly. Your child looks proud without needing to brag.",
        choices: [
          { text: "Let pride be quiet", effects: { confidence: 0.2 } }
        ]
      },
      {
        id: "snake_steadymoment",
        title: "Calm Under Pressure",
        body: "A sudden sound startles everyone. Your child stays steady anyway.",
        choices: [
          { text: "Name the skill", effects: { confidence: 0.3 } }
        ]
      }
    ]
  },
  {
    speciesKey: "turtle",
    displayName: "Turtle",
    selTheme: "Patience + Long-Term Thinking",
    vibeLine: "A slow companion that teaches long-view responsibility.",
    upfrontCostRange: [150, 700],
    yearlyUpkeepRange: [120, 400],
    lifespanRangeYears: [25, 40],
    startingAgeRange: [0, 15],
    names: ["Shelly","Atlas","Moss","Pebble","Olive","Tank","Cedar","Mango","Sage","Puddle"],
    actions: [
      { id: "clean", name: "Clean Tank", emoji: "🚿", focusCost: 1, effects: { discipline: 0.3, stress: -0.5 } },
      { id: "feed", name: "Vegetables", emoji: "🥬", moneyCost: 5, effects: { stress: -0.2 } },
      { id: "watch", name: "Turtle Time", emoji: "🐢", focusCost: 1, effects: { stress: -1, patience: 0.2 } }
    ],
    miniEvents: [
      {
        id: "turtle_slowwins",
        title: "Slow Progress, Real Progress",
        body: "Your child checks again. Still slow. They learn that not everything rewards urgency.",
        choices: [
          { text: "Stick with steady", effects: { discipline: 0.2, stress: -1 } }
        ]
      },
      {
        id: "turtle_longview",
        title: "The Long View",
        body: "Your child realizes this pet is a long commitment, not a phase.",
        choices: [
          { text: "Talk about commitment", effects: { discipline: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "turtle_observe",
        title: "Observation Skill",
        body: "Your child notices a subtle change and mentions it calmly.",
        choices: [
          { text: "Reward noticing", effects: { intelligence: 0.2 } }
        ]
      },
      {
        id: "turtle_science",
        title: "Habitat Science",
        body: "You adjust lighting and temperature. Your child treats it like a real project.",
        choices: [
          { text: "Learn why it matters", effects: { intelligence: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "turtle_quiet",
        title: "Quiet Company",
        body: "The turtle simply exists. Your child relaxes beside it.",
        choices: [
          { text: "Enjoy the calm", effects: { stress: -1 } }
        ]
      },
      {
        id: "turtle_norush",
        title: "No Rush",
        body: "Your child stops hurrying the turtle and laughs at themselves.",
        choices: [
          { text: "Practice patience", effects: { stress: -1, confidence: 0.1 } }
        ]
      },
      {
        id: "turtle_consistency",
        title: "Consistency Pays Later",
        body: "Small care today prevents problems later. Your child connects the dots.",
        choices: [
          { text: "Keep the routine", effects: { discipline: 0.3, intelligence: 0.1 } }
        ]
      },
      {
        id: "turtle_earnedpride",
        title: "Earned Pride",
        body: "Weeks later, the habitat looks great. Your child feels a pride that had to be earned.",
        choices: [
          { text: "Acknowledge effort", effects: { confidence: 0.2, discipline: 0.2 } }
        ]
      }
    ]
  },
  {
    speciesKey: "hamster",
    displayName: "Hamster",
    selTheme: "Routine + Gentle Responsibility",
    vibeLine: "Small chores, big lessons in accountability.",
    upfrontCostRange: [60, 250],
    yearlyUpkeepRange: [80, 220],
    lifespanRangeYears: [2, 7],
    startingAgeRange: [0, 3],
    names: ["Nibbles","Peanut","Pudding","Muffin","Gizmo","Dot","Waffles","Toffee","Pip","Cinnamon"],
    actions: [
      { id: "clean", name: "Clean Cage", emoji: "🛖", focusCost: 1, effects: { discipline: 0.3, empathy: 0.1 } },
      { id: "play", name: "Hamster Ball", emoji: "🎾", focusCost: 1, effects: { stress: -1 } },
      { id: "feed", name: "Seeds", emoji: "🌻", moneyCost: 2, effects: { love: 0.2 } }
    ],
    miniEvents: [
      {
        id: "ham_forget",
        title: "Forgot Once",
        body: "Your child forgets feeding time. Later, they notice and feel awful.",
        choices: [
          { text: "Own it and fix it", effects: { discipline: 0.3, empathy: 0.2 } },
          { text: "Blame something else", effects: { stress: 1 } }
        ]
      },
      {
        id: "ham_clean",
        title: "Clean Cage Day",
        body: "Your child finishes the task without complaining. Miracles happen.",
        choices: [
          { text: "Keep that energy", effects: { discipline: 0.3 } }
        ]
      },
      {
        id: "ham_boundaries",
        title: "Not Every Day Is a Holding Day",
        body: "The hamster squirms away. Your child learns to pause instead of insisting.",
        choices: [
          { text: "Respect the signal", effects: { empathy: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "ham_pride",
        title: "It Depends on Me",
        body: "Your child says, “It depends on me,” like they just discovered a new kind of power.",
        choices: [
          { text: "Reinforce responsibility", effects: { confidence: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "ham_routine",
        title: "Routine Pride",
        body: "Your child checks the water bottle automatically.",
        choices: [
          { text: "Praise the habit", effects: { discipline: 0.2 } }
        ]
      },
      {
        id: "ham_wheel",
        title: "Wheel at Night",
        body: "The hamster runs like it’s powering the house.",
        choices: [
          { text: "Laugh and adapt", effects: { stress: -1, confidence: 0.1 } }
        ]
      },
      {
        id: "ham_learningcurve",
        title: "Learning Curve",
        body: "You correct a small mistake kindly. Your child improves without shutting down.",
        choices: [
          { text: "Keep it kind", effects: { confidence: 0.2, stress: -1 } }
        ]
      },
      {
        id: "ham_softjoy",
        title: "Soft Joy",
        body: "The hamster settles calmly in your child’s hands.",
        choices: [
          { text: "Enjoy the moment", effects: { empathy: 0.2, stress: -1 } }
        ]
      }
    ]
  },
  {
    speciesKey: "goat",
    displayName: "Goat",
    selTheme: "Playfulness + Confidence",
    vibeLine: "A chaos comedian that teaches humor and boundaries.",
    upfrontCostRange: [150, 500],
    yearlyUpkeepRange: [250, 700],
    lifespanRangeYears: [10, 15],
    startingAgeRange: [0, 10],
    names: ["Pickles","Dottie","Bandit","Maple","Oreo","Junebug","Rocket","Poppy","Basil","Sprinkles"],
    actions: [
      { id: "play", name: "Outdoor Play", emoji: "🐐", focusCost: 1, effects: { stress: -1, confidence: 0.2, empathy: 0.1 } },
      { id: "feed", name: "Veggie Scraps", emoji: "🥕", moneyCost: 5, effects: { love: 0.5 } },
      { id: "clean", name: "Muck Out", emoji: "🧹", focusCost: 1, effects: { discipline: 0.3 } }
    ],
    miniEvents: [
      {
        id: "goat_chaos",
        title: "Goat Chaos",
        body: "The goat steals something ridiculous and prances like it won an award.",
        choices: [
          { text: "Laugh, then set a boundary", effects: { stress: -1, confidence: 0.2, discipline: 0.2 } },
          { text: "Overreact", effects: { stress: 1 } }
        ]
      },
      {
        id: "goat_brave",
        title: "Brave Try",
        body: "Inspired by the goat’s fearless energy, your child tries a new task without asking for reassurance.",
        choices: [
          { text: "Encourage the try", effects: { confidence: 0.3 } }
        ]
      },
      {
        id: "goat_calm",
        title: "Calm Works Better",
        body: "Your child learns the goat responds better to calm than force.",
        choices: [
          { text: "Practice calm leadership", effects: { empathy: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "goat_outdoor",
        title: "Outdoor Routine",
        body: "Feeding becomes a consistent habit. Your child starts treating it like a real responsibility.",
        choices: [
          { text: "Keep it consistent", effects: { discipline: 0.3 } }
        ]
      },
      {
        id: "goat_humor",
        title: "Humor Helps",
        body: "A stressful day ends with unexpected laughter in the yard.",
        choices: [
          { text: "Let laughter count", effects: { stress: -1 } }
        ]
      },
      {
        id: "goat_boundaries",
        title: "Firm, Calm Boundaries",
        body: "The goat pushes into personal space. Your child practices a firm voice without yelling.",
        choices: [
          { text: "Do firm + calm", effects: { confidence: 0.2, discipline: 0.2 } }
        ]
      },
      {
        id: "goat_help",
        title: "Helping Hands",
        body: "Your child notices you need help and offers it without being asked.",
        choices: [
          { text: "Accept the help", effects: { empathy: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "goat_proudwork",
        title: "Proud Work",
        body: "Your child finishes the outdoor tasks and stands a little taller.",
        choices: [
          { text: "Acknowledge effort", effects: { confidence: 0.2, discipline: 0.2 } }
        ]
      }
    ]
  },
  {
    speciesKey: "horse",
    displayName: "Horse",
    selTheme: "Leadership + Discipline",
    vibeLine: "A high-cost commitment that builds calm leadership.",
    upfrontCostRange: [5000, 20000],
    yearlyUpkeepRange: [3000, 12000],
    lifespanRangeYears: [25, 30],
    startingAgeRange: [0, 15],
    names: ["Storm","Willow","Comet","Sapphire","Ace","Honey","Arrow","Indigo","Maverick","Belle"],
    actions: [
      { id: "ride", name: "Riding Lesson", emoji: "🏇", focusCost: 1, effects: { discipline: 0.4, confidence: 0.3, stress: -0.5 } },
      { id: "groom", name: "Grooming", emoji: "🪮", focusCost: 1, effects: { empathy: 0.3, stress: -1 } },
      { id: "feed", name: "Apples", emoji: "🍎", moneyCost: 10, effects: { love: 0.5 } }
    ],
    miniEvents: [
      {
        id: "horse_mirror",
        title: "Mirrors Emotions",
        body: "The horse reacts to your child’s tension. When your child relaxes their breath, the horse settles too.",
        choices: [
          { text: "Practice calm together", effects: { stress: -1, confidence: 0.3 } }
        ]
      },
      {
        id: "horse_leadership",
        title: "Leadership Is Clarity",
        body: "The horse follows a gentle command. Your child realizes leadership is clarity, not force.",
        choices: [
          { text: "Name the lesson", effects: { discipline: 0.3, confidence: 0.2, empathy: 0.1 } }
        ]
      },
      {
        id: "horse_work",
        title: "Hard Work Day",
        body: "Stable care is not glamorous. Your child does it anyway.",
        choices: [
          { text: "Finish the routine", effects: { discipline: 0.4 } }
        ]
      },
      {
        id: "horse_commitment",
        title: "Big Commitment",
        body: "Your child understands the cost and responsibility. It changes how they talk about choices.",
        choices: [
          { text: "Talk it through", effects: { discipline: 0.3, intelligence: 0.1 } }
        ]
      },
      {
        id: "horse_confidence",
        title: "Confidence Ride",
        body: "Your child rides with steadier posture than last time.",
        choices: [
          { text: "Celebrate progress", effects: { confidence: 0.3 } }
        ]
      },
      {
        id: "horse_kindcorrection",
        title: "Gentle Correction",
        body: "A mistake happens. You correct it calmly. Your child learns growth is allowed.",
        choices: [
          { text: "Keep it kind", effects: { confidence: 0.2, stress: -1 } }
        ]
      },
      {
        id: "horse_helpothers",
        title: "Teaching Moment",
        body: "Your child helps a younger rider understand safety.",
        choices: [
          { text: "Encourage leadership", effects: { confidence: 0.2, empathy: 0.2 } }
        ]
      },
      {
        id: "horse_calmvoice",
        title: "Calm Command",
        body: "The horse responds to a calm voice. Your child practices calm like it’s a skill.",
        choices: [
          { text: "Train the calm", effects: { discipline: 0.2, confidence: 0.2, stress: -1 } }
        ]
      }
    ]
  },
  {
    speciesKey: "lizard",
    displayName: "Lizard",
    selTheme: "Curiosity + Gentle Respect",
    vibeLine: "A quiet observer’s pet that teaches consent and care.",
    upfrontCostRange: [150, 600],
    yearlyUpkeepRange: [120, 350],
    lifespanRangeYears: [8, 15],
    names: ["Spike","Gobi","Sunny","Cinder","Echo","Ziggy","Saffron","Pixel","Tango","Nova"],
    actions: [
      { id: "handle", name: "Gentle Handling", emoji: "🦎", focusCost: 1, effects: { intelligence: 0.2, empathy: 0.1 } },
      { id: "feed", name: "Crickets", emoji: "🦗", moneyCost: 5, effects: { love: 0.2 } },
      { id: "clean", name: "Habitat Care", emoji: "🧹", focusCost: 1, effects: { discipline: 0.2 } }
    ],
    miniEvents: [
      {
        id: "liz_consent",
        title: "Consent Lesson",
        body: "Your child learns to stop when the lizard signals stress. It’s a lesson in listening.",
        choices: [
          { text: "Respect the signal", effects: { empathy: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "liz_research",
        title: "Curious Research",
        body: "Your child asks a question and looks up the answer without being told.",
        choices: [
          { text: "Learn together", effects: { intelligence: 0.2 } }
        ]
      },
      {
        id: "liz_details",
        title: "Details Matter",
        body: "Small habitat changes create big differences. Your child notices patterns.",
        choices: [
          { text: "Tune the setup", effects: { intelligence: 0.2, discipline: 0.1 } }
        ]
      },
      {
        id: "liz_pride",
        title: "Gentle Pride",
        body: "Your child handles carefully and feels capable.",
        choices: [
          { text: "Acknowledge the skill", effects: { confidence: 0.2 } }
        ]
      },
      {
        id: "liz_routine",
        title: "Feeding Routine",
        body: "The routine sticks. Your child starts treating it like a promise.",
        choices: [
          { text: "Keep the promise", effects: { discipline: 0.2 } }
        ]
      },
      {
        id: "liz_difference",
        title: "Respect for Difference",
        body: "Your child realizes connection doesn’t have to look like cuddling.",
        choices: [
          { text: "Appreciate quiet bonds", effects: { empathy: 0.2, stress: -1 } }
        ]
      },
      {
        id: "liz_observe",
        title: "Observation Skill",
        body: "Your child notices a subtle behavior change and responds calmly.",
        choices: [
          { text: "Use what you notice", effects: { intelligence: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "liz_patience",
        title: "Learning Patience",
        body: "Not every pet performs on command. Your child accepts that.",
        choices: [
          { text: "Practice patience", effects: { empathy: 0.2, discipline: 0.1 } }
        ]
      }
    ]
  },
  {
    speciesKey: "chickens",
    displayName: "Chickens",
    selTheme: "Responsibility + Contribution",
    vibeLine: "A daily routine that makes your child feel useful and proud.",
    upfrontCostRange: [200, 800],
    yearlyUpkeepRange: [150, 500],
    lifespanRangeYears: [5, 10],
    startingAgeRange: [0, 6],
    names: ["Sunny","Pepper","Nugget","Goldie","Poppy","Hazel","Dot","Rusty","Honey","Mabel"],
    actions: [
      { id: "coop", name: "Coop Routine", emoji: "🏚️", focusCost: 1, effects: { discipline: 0.3, confidence: 0.1 } },
      { id: "feed", name: "Scatter Feed", emoji: "🌽", moneyCost: 5, effects: { love: 0.5 } },
      { id: "collect", name: "Collect Eggs", emoji: "🥚", focusCost: 1, effects: { confidence: 0.2, stress: -0.5 } }
    ],
    miniEvents: [
      {
        id: "chick_firstegg",
        title: "First Egg",
        body: "Your child finds the first egg and holds it like a trophy earned through consistency.",
        choices: [
          { text: "Celebrate stewardship", effects: { confidence: 0.3, discipline: 0.2 } }
        ]
      },
      {
        id: "chick_routine",
        title: "Routine Wins",
        body: "Your child does the coop routine without reminders.",
        choices: [
          { text: "Praise the streak", effects: { discipline: 0.3 } }
        ]
      },
      {
        id: "chick_contribution",
        title: "Real Contribution",
        body: "Your child realizes their actions feed the household. They stand a little taller.",
        choices: [
          { text: "Name the contribution", effects: { confidence: 0.2, empathy: 0.1 } }
        ]
      },
      {
        id: "chick_weather",
        title: "Weather Care",
        body: "Your child adjusts care for the weather instead of ignoring it.",
        choices: [
          { text: "Adapt responsibly", effects: { discipline: 0.2, intelligence: 0.1 } }
        ]
      },
      {
        id: "chick_gentle",
        title: "Gentle Handling",
        body: "Your child learns chickens need calm hands and slow movements.",
        choices: [
          { text: "Practice gentle hands", effects: { empathy: 0.2 } }
        ]
      },
      {
        id: "chick_fix",
        title: "Problem Solver",
        body: "Your child notices something could harm the flock and fixes it.",
        choices: [
          { text: "Reward initiative", effects: { confidence: 0.2, discipline: 0.2 } }
        ]
      },
      {
        id: "chick_share",
        title: "Sharing Pride",
        body: "Your child shares eggs with someone and feels good about it.",
        choices: [
          { text: "Encourage generosity", effects: { empathy: 0.2, confidence: 0.1 } }
        ]
      },
      {
        id: "chick_steward",
        title: "Stewardship",
        body: "Your child starts talking about “taking care” like it’s part of who they are.",
        choices: [
          { text: "Let it sink in", effects: { empathy: 0.2, discipline: 0.2 } }
        ]
      }
    ]
  },
  // --- Mythical Easter Egg Pets ---
  {
    speciesKey: "unicorn",
    displayName: "Unicorn",
    selTheme: "Wonder + Generosity",
    vibeLine: "A sparkly budget-destroyer that makes responsibility feel like magic.",
    upfrontCostRange: [777777, 777777],
    yearlyUpkeepRange: [333333, 333333],
    lifespanRangeYears: [30, 80],
    startingAgeRange: [30, 80],
    names: ["Glitterhoof","Moonbeam","Prism","Opal","Stardust","Sir Sparkles","Aurora","Confetti","Nimbus","Marshmallow"],
    actions: [
      { id: "rainbow_ride", name: "Rainbow Ride", emoji: "🌈", focusCost: 1, effects: { stress: -2, confidence: 0.4, empathy: 0.2 } },
      { id: "diamond_horn", name: "Diamond Horn Polish", emoji: "💎", moneyCost: 200000, effects: { love: 2, confidence: 0.2, stress: -0.5 } },
      { id: "moon_sugar", name: "Moonlit Sugar Cubes", emoji: "🍬", moneyCost: 50000, effects: { love: 1, empathy: 0.1 } },
      { id: "wish_ceremony", name: "Wish-Granting Ceremony", emoji: "🪄", moneyCost: 333333, effects: { intelligence: 0.2, confidence: 0.3, stress: -1 } }
    ],
    miniEvents: [
      {
        id: "uni_glitter_everywhere",
        title: "Glitter… In Places Glitter Should Not Be",
        body: "You find sparkles on the couch, the floor, and somehow… your child’s math homework. The unicorn looks proud.",
        choices: [
          { text: "Laugh and clean it together", effects: { stress: -1, discipline: 0.2, empathy: 0.1 } },
          { text: "Get annoyed", effects: { stress: 1 } }
        ]
      },
      {
        id: "uni_kindness",
        title: "A Small, Weird Kindness",
        body: "Your child offers the unicorn a snack and whispers, “Thanks for being here.” It’s corny. It’s sweet. It works.",
        choices: [
          { text: "Name the kindness out loud", effects: { empathy: 0.3, confidence: 0.1, stress: -1 } }
        ]
      },
      {
        id: "uni_patience",
        title: "Magic Has Rules",
        body: "The unicorn won’t move until your child slows down and uses a calm voice. The lesson is immediate.",
        choices: [
          { text: "Practice calm leadership", effects: { discipline: 0.2, confidence: 0.2 } }
        ]
      },
      {
        id: "uni_attention",
        title: "Attention Isn’t a Trick",
        body: "Your child realizes the unicorn responds most when they’re fully present—not multitasking.",
        choices: [
          { text: "Give full attention", effects: { empathy: 0.2, intelligence: 0.1, stress: -1 } }
        ]
      }
    ]
  },
  {
    speciesKey: "dragon",
    displayName: "Dragon",
    selTheme: "Courage + Responsibility",
    vibeLine: "A majestic fire-breathing liability with a very expensive appetite.",
    upfrontCostRange: [1000000, 1000000],
    yearlyUpkeepRange: [1000000, 1000000],
    lifespanRangeYears: [100, 300],
    startingAgeRange: [66, 175],
    names: ["Smolder","Ember","Cinder","Ash","Ruby","Goldtooth","Molten","Volcano","Hoardy","Sir Roast-a-Lot"],
    actions: [
      { id: "gold_steak", name: "Gold-Leaf Steak Dinner", emoji: "🥩", moneyCost: 250000, effects: { love: 2, confidence: 0.2, stress: -1 } },
      { id: "flight_lesson", name: "Dragon Flight Lesson", emoji: "🪽", focusCost: 1, moneyCost: 500000, effects: { confidence: 0.6, discipline: 0.3, stress: -0.5 } },
      { id: "fire_insurance", name: "Fireproof Insurance Renewal", emoji: "🧯", moneyCost: 1000000, effects: { discipline: 0.2, stress: -2 } },
      { id: "add_to_hoard", name: "Add to the Hoard", emoji: "🪙", moneyCost: 750000, effects: { intelligence: 0.2, confidence: 0.2 } }
    ],
    miniEvents: [
      {
        id: "drag_neighbor",
        title: "The Neighbor Saw Everything",
        body: "A neighbor watches your dragon sneeze a tiny puff of smoke. Your child instinctively steps between the dragon and the crowd, calm and protective.",
        choices: [
          { text: "Model calm accountability", effects: { discipline: 0.2, confidence: 0.2, empathy: 0.1 } }
        ]
      },
      {
        id: "drag_breath",
        title: "Breath Before Fire",
        body: "Your child learns the dragon responds to slow breathing and steady hands. Panic escalates. Calm de-escalates.",
        choices: [
          { text: "Practice calm on purpose", effects: { stress: -1, confidence: 0.2 } }
        ]
      },
      {
        id: "drag_responsibility",
        title: "Big Creature, Big Responsibility",
        body: "Your child says, “We can’t just… have a dragon and be sloppy.” They’re right. This is growth (and also insurance paperwork).",
        choices: [
          { text: "Lean into the responsibility", effects: { discipline: 0.3, intelligence: 0.1 } }
        ]
      },
      {
        id: "drag_kindness",
        title: "Gentle Giant Moment",
        body: "The dragon carefully lowers its head so your child can pat it. Your child is quiet—like they just earned trust the hard way.",
        choices: [
          { text: "Let the moment land", effects: { empathy: 0.3, confidence: 0.1, stress: -1 } }
        ]
      }
    ]
  }
];