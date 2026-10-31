export const CHAOS_EVENTS = [
  // --- CHILD EVENTS (0-2) ---
  {
    id: "chaos_diaper_trebuchet",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Diaper Trebuchet",
    body: "Your toddler discovers leverage. One diaper achieves unexpected airtime and lands with historic confidence somewhere high up.",
    choices: [
      {
        id: "laugh",
        letter: "A",
        emoji: "😂",
        text: "Applaud the physics",
        consequence: "You laugh so hard you cry. The mess is terrible, but the trajectory was impressive.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "clean",
        letter: "B",
        emoji: "🧹",
        text: "Silent deep clean",
        consequence: "You clean it up without a word. Your dignity takes a hit, but the wall is safe.",
        role: "avoid",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -10
      },
      {
        id: "teach",
        letter: "C",
        emoji: "📉",
        text: "Explain gravity gently",
        consequence: "You try to explain why flying diapers are bad. They just clap.",
        role: "teach",
        deltas: { intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_crayon_mural",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Crayon Wall Mural",
    body: "In the time it took you to blink, a 'family portrait' appears on the wall. Everyone has six arms. It's... expressive.",
    choices: [
      {
        id: "frame",
        letter: "A",
        emoji: "🖼️",
        text: "Frame it (mentally)",
        consequence: "You decide it's art now. The wall lives like this.",
        role: "connect",
        deltas: { confidence: 1 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "scrub",
        letter: "B",
        emoji: "🧽",
        text: "Scrub immediately",
        consequence: "You erase the masterpiece. The artist is heartbroken, but the deposit is safe.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 4,
        moneyDelta: -20
      },
      {
        id: "redirect",
        letter: "C",
        emoji: "📄",
        text: "Redirect to paper",
        consequence: "You tape paper over it. It's a compromise.",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos_bath_overflow",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "The Bath Overflow Symphony",
    body: "The faucet gets turned into a water-feature exhibit. The bathroom floor auditions as a lake.",
    choices: [
      {
        id: "swim",
        letter: "A",
        emoji: "🏊",
        text: "Accept the indoor pool",
        consequence: "You splash a bit before cleaning. Chaos managed with joy.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "panic",
        letter: "B",
        emoji: "😱",
        text: "Panic and towel",
        consequence: "You use every towel in the house. The stress is real.",
        role: "avoid",
        deltas: { discipline: 0 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -50
      },
      {
        id: "rule",
        letter: "C",
        emoji: "🚿",
        text: "Water safety lesson",
        consequence: "You turn the flood into a lesson on volume and displacement.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_sticker_diplomacy",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Sticker Diplomacy",
    body: "Your child 'solves' a conflict by placing stickers on every object involved, including your important paperwork.",
    choices: [
      {
        id: "accept",
        letter: "A",
        emoji: "📑",
        text: "Submit the stickered forms",
        consequence: "You send the documents with dinosaur stickers. The bank will just have to deal.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "peel",
        letter: "B",
        emoji: "💅",
        text: "Painstakingly peel",
        consequence: "You spend an hour removing adhesive. Your patience thins.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "redirect",
        letter: "C",
        emoji: "📒",
        text: "Buy a sticker book",
        consequence: "You trade the tax forms for a dedicated sticker album.",
        role: "teach",
        deltas: { intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos_grocery_parade",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "The Grocery Conveyor Parade",
    body: "At checkout, your kid slides items down the belt like a parade. Your phone tries to join.",
    choices: [
      {
        id: "catch",
        letter: "A",
        emoji: "📱",
        text: "Dive for the phone",
        consequence: "You save the phone with a ninja move. The cashier applauds.",
        role: "avoid",
        deltas: { discipline: 0 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "narrate",
        letter: "B",
        emoji: "🎙️",
        text: "Narrate the parade",
        consequence: "You announce 'And here comes the broccoli!' The kid beams.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "stop",
        letter: "C",
        emoji: "🛑",
        text: "Firm 'Hands Off'",
        consequence: "You stop the parade. Efficient, but less festive.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_marker_highlights",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Marker Hair Highlights",
    body: "You notice a new 'style choice' in their hair. The marker did not ask permission.",
    choices: [
      {
        id: "rock",
        letter: "A",
        emoji: "🤘",
        text: "Rock the look",
        consequence: "It's punk rock. You take a photo and let it fade naturally.",
        role: "connect",
        deltas: { confidence: 1 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "hat",
        letter: "B",
        emoji: "🧢",
        text: "Hat week",
        consequence: "You buy a cute hat. Problem covered.",
        role: "avoid",
        deltas: { discipline: 0 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -15
      },
      {
        id: "wash",
        letter: "C",
        emoji: "🛁",
        text: "Immediate scrub",
        consequence: "Lots of shampoo and tears. It comes out eventually.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 4,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos_couch_launch",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "The Couch Launch Program",
    body: "Your child announces, 'I can fly,' and performs a bold demonstration off the couch.",
    choices: [
      {
        id: "catch",
        letter: "A",
        emoji: "👐",
        text: "Human safety net",
        consequence: "You catch them mid-air. Heroic, but your back hurts.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "cushions",
        letter: "B",
        emoji: "🛋️",
        text: "Build a fort below",
        consequence: "You make a landing zone. If you can't stop it, soften it.",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "ban",
        letter: "C",
        emoji: "🚫",
        text: "Strict 'No Climbing'",
        consequence: "You enforce a ground-level policy. Safer, but boring.",
        role: "boundary",
        deltas: { discipline: 0.6 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_emergency_call",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Accidental Emergency Call",
    body: "A button gets pressed. A very serious voice answers. Your soul leaves your body briefly.",
    choices: [
      {
        id: "apologize",
        letter: "A",
        emoji: "😅",
        text: "Profuse apologies",
        consequence: "You explain it's a toddler. The operator sounds tired but understanding.",
        role: "avoid",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: 0
      },
      {
        id: "lock",
        letter: "B",
        emoji: "🔒",
        text: "Lock the phone away",
        consequence: "Phone goes on a high shelf. You live tech-free for a day.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "teach",
        letter: "C",
        emoji: "📞",
        text: "Explain 'Emergency'",
        consequence: "You try to explain 911. They mostly just want the button back.",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_pot_shoe",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Pot-as-Shoe Fashion Week",
    body: "Your kid refuses shoes and arrives wearing a saucepan with the confidence of a runway model.",
    choices: [
      {
        id: "wear",
        letter: "A",
        emoji: "🍳",
        text: "Let them wear it",
        consequence: "You go to the store with a saucepan-foot kid. People stare; you smile.",
        role: "connect",
        deltas: { confidence: 1 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "bribe",
        letter: "B",
        emoji: "🍪",
        text: "Bribe for shoes",
        consequence: "A cookie gets the shoes on. Bribery works.",
        role: "avoid",
        deltas: { discipline: -0.2 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -5
      },
      {
        id: "force",
        letter: "C",
        emoji: "👟",
        text: "Force the sneaker",
        consequence: "A wrestling match ensues. Shoes are on, but everyone is sweaty.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_snack_negotiation",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "The Snack Negotiation Summit",
    body: "Your child demands a snack in a meeting-like tone and appoints a stuffed animal as 'legal counsel.'",
    choices: [
      {
        id: "negotiate",
        letter: "A",
        emoji: "🤝",
        text: "Negotiate with the bear",
        consequence: "You offer terms to the stuffed bear. A compromise of crackers is reached.",
        role: "connect",
        deltas: { intelligence: 0.2 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "serve",
        letter: "B",
        emoji: "🍎",
        text: "Serve fruit immediately",
        consequence: "You bypass the lawyers and provide apples. Crisis averted.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -2
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "📵",
        text: "Close the kitchen",
        consequence: "You declare the kitchen closed. The bear looks disappointed.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_stuffie_hostage",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "The Great Stuffie Hostage Crisis",
    body: "A stuffed animal is 'trapped' somewhere dramatic (behind the radiator). Your child insists on a full rescue mission.",
    choices: [
      {
        id: "rescue",
        letter: "A",
        emoji: "🔦",
        text: "Mount a rescue op",
        consequence: "You get the flashlight and tongs. The reunion is tearful and joyous.",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "wait",
        letter: "B",
        emoji: "⏳",
        text: "Wait it out",
        consequence: "You say 'he's sleeping there.' The kid accepts this eventually.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "replace",
        letter: "C",
        emoji: "🧸",
        text: "Offer a substitute",
        consequence: "You offer a different bear. It is rejected with disdain.",
        role: "teach",
        deltas: { discipline: 0 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_mystery_collection",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "The Mystery Object Collection",
    body: "You find a stash of carefully collected 'treasures' (random household items) hidden like priceless artifacts.",
    choices: [
      {
        id: "praise",
        letter: "A",
        emoji: "🏆",
        text: "Praise the curation",
        consequence: "You admire the bottle cap and the spoon. They beam with pride.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "return",
        letter: "B",
        emoji: "🔄",
        text: "Return items slowly",
        consequence: "You sneak the spoon back to the drawer. They never notice.",
        role: "avoid",
        deltas: { intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "clear",
        letter: "C",
        emoji: "🗑️",
        text: "Clean sweep",
        consequence: "You reclaim your stuff. The museum is closed.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },

  // --- CHILD EVENTS (3-5) ---
  {
    id: "chaos_volcano",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Backyard Volcano Actually Works",
    body: "The baking soda experiment erupts like it's trying to reach orbit. The yard is now 'science.'",
    choices: [
      {
        id: "cheer",
        letter: "A",
        emoji: "🌋",
        text: "Cheer wildly",
        consequence: "You celebrate the mess. Future Nobel laureate in the making.",
        role: "connect",
        deltas: { intelligence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: -5
      },
      {
        id: "hose",
        letter: "B",
        emoji: "🚿",
        text: "Hose it down",
        consequence: "You wash away the lava before it stains the patio.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "kit",
        letter: "C",
        emoji: "🧪",
        text: "Buy a real kit",
        consequence: "You channel this energy into a controlled kit. Less vinegar smell.",
        role: "teach",
        deltas: { intelligence: 0.8 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -30
      }
    ]
  },
  {
    id: "chaos_glitter_justice",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Glitter Justice System",
    body: "Glitter appears in places you didn't know existed. Your home becomes a twinkling evidence locker.",
    choices: [
      {
        id: "accept",
        letter: "A",
        emoji: "✨",
        text: "Accept the sparkle",
        consequence: "You embrace the glam life. You will find glitter in 2030.",
        role: "connect",
        deltas: { confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "vacuum",
        letter: "B",
        emoji: "💨",
        text: "Vacuum marathon",
        consequence: "You wage war on the sparkles. You win battles, but not the war.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "ban",
        letter: "C",
        emoji: "🚫",
        text: "Ban the glitter",
        consequence: "Glitter is contraband now. The house is duller but cleaner.",
        role: "boundary",
        deltas: { discipline: 0.6 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_diy_haircut",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "DIY Haircut Salon",
    body: "Your child offers you 'a fresh look.' The scissors look eager.",
    choices: [
      {
        id: "allow",
        letter: "A",
        emoji: "💇",
        text: "Let them snip one lock",
        consequence: "You sacrifice a tiny piece of hair. They feel like a pro.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "swap",
        letter: "B",
        emoji: "🎀",
        text: "Swap for ribbons",
        consequence: "You offer to play salon with clips instead. Crisis diverted.",
        role: "teach",
        deltas: { intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -5
      },
      {
        id: "hide",
        letter: "C",
        emoji: "✂️",
        text: "Hide the scissors",
        consequence: "Scissors vanish. The salon is closed due to supply chain issues.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_doorbell_marathon",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Doorbell Marathon",
    body: "Your kid discovers the neighbor's doorbell and treats it like a cardio workout.",
    choices: [
      {
        id: "apologize",
        letter: "A",
        emoji: "🍪",
        text: "Apologize with cookies",
        consequence: "You bring cookies to the neighbor. You make a friend, maybe.",
        role: "teach",
        deltas: { empathy: 0.4 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -10
      },
      {
        id: "scold",
        letter: "B",
        emoji: "😤",
        text: "Stern lecture",
        consequence: "You explain why we don't ding-dong-ditch. They pout.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "distract",
        letter: "C",
        emoji: "🏃",
        text: "Run away together",
        consequence: "You grab them and scoot. It's bad parenting but good cardio.",
        role: "connect",
        deltas: { confidence: 0.3 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_talent_show_miscomm",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Talent Show Miscommunication",
    body: "You learn you've been volunteered to perform. You did not consent, but the class is excited.",
    choices: [
      {
        id: "perform",
        letter: "A",
        emoji: "🎤",
        text: "Do the robot",
        consequence: "You dance badly. The kids cheer. Your dignity is gone.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 3,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "decline",
        letter: "B",
        emoji: "🙅",
        text: "Politely decline",
        consequence: "You explain you have stage fright. Your kid is disappointed.",
        role: "boundary",
        deltas: { empathy: 0.2 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "snack",
        letter: "C",
        emoji: "🧁",
        text: "Bring cupcakes instead",
        consequence: "You buy your way out of performing. Sugar solves it.",
        role: "avoid",
        deltas: { intelligence: 0 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -20
      }
    ]
  },
  {
    id: "chaos_free_library",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "The Free Library Donation",
    body: "Your mail mysteriously vanishes. Later you spot it in the neighborhood free library... proudly displayed.",
    choices: [
      {
        id: "retrieve",
        letter: "A",
        emoji: "📫",
        text: "Sneak it back",
        consequence: "You reclaim your bills. The neighbors saw nothing.",
        role: "avoid",
        deltas: { confidence: 0 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "explain",
        letter: "B",
        emoji: "📚",
        text: "Explain 'books vs. bills'",
        consequence: "You explain what belongs in a library. They nod solemnly.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "donate",
        letter: "C",
        emoji: "📖",
        text: "Donate real books",
        consequence: "You replace the bills with old kids' books. Community spirit!",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos_costume_day",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Costume Day on a Regular Day",
    body: "Your child insists it's 'Astronaut Day.' Nobody else got the memo.",
    choices: [
      {
        id: "allow",
        letter: "A",
        emoji: "👨‍🚀",
        text: "Let them wear the suit",
        consequence: "They go to preschool in a spacesuit. They own it.",
        role: "connect",
        deltas: { confidence: 0.8 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "change",
        letter: "B",
        emoji: "👕",
        text: "Enforce normal clothes",
        consequence: "A morning struggle ensues. They look normal but feel sad.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "compromise",
        letter: "C",
        emoji: "🧦",
        text: "Space socks only",
        consequence: "You negotiate down to space accessories. Mission success.",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_birthday_guest_explosion",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "The Birthday Guest Explosion",
    body: "Your child invites 'everyone.' The RSVP list includes people you have never met.",
    choices: [
      {
        id: "host",
        letter: "A",
        emoji: "🎂",
        text: "Host them all",
        consequence: "You buy extra cake. It's a zoo, but a happy one.",
        role: "connect",
        deltas: { empathy: 0.6 },
        loveDelta: 2,
        stressDelta: 5,
        moneyDelta: -100
      },
      {
        id: "trim",
        letter: "B",
        emoji: "✂️",
        text: "Trim the list",
        consequence: "You explain budgets. Some imaginary friends get cut.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "park",
        letter: "C",
        emoji: "🌳",
        text: "Move to the park",
        consequence: "You make it a potluck at the park. Cheap and chaotic.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: -20
      }
    ]
  },
  {
    id: "chaos_lost_tooth_practice",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "The Lost Tooth Practice Run",
    body: "Your kid tries to stage a tooth fairy visit using a very suspicious piece of popcorn.",
    choices: [
      {
        id: "play",
        letter: "A",
        emoji: "🍿",
        text: "Pay up anyway",
        consequence: "You swap the popcorn for a quarter. They are thrilled.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: -1
      },
      {
        id: "truth",
        letter: "B",
        emoji: "🦷",
        text: "Explain tooth anatomy",
        consequence: "You show them a diagram. No money for popcorn.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "laugh",
        letter: "C",
        emoji: "😆",
        text: "Laugh and decline",
        consequence: "You laugh together. Nice try, kid.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_chalk_city",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Sidewalk Chalk City",
    body: "Your driveway becomes a full street map. Cars are rerouted by a four-year-old traffic planner.",
    choices: [
      {
        id: "park",
        letter: "A",
        emoji: "🚗",
        text: "Park on the street",
        consequence: "You respect the chalk city. The driveway is theirs today.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "wash",
        letter: "B",
        emoji: "🚿",
        text: "Rain dance (hose)",
        consequence: "You wash it away so you can park. The city falls.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "add",
        letter: "C",
        emoji: "🖍️",
        text: "Add a parking lot",
        consequence: "You draw a designated parking spot. Urban planning win.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_permanent_marker",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "The Permanent Marker Contract",
    body: "Your child signs 'important documents' (anything paper) with maximum seriousness.",
    choices: [
      {
        id: "file",
        letter: "A",
        emoji: "📂",
        text: "File it anyway",
        consequence: "You keep the signed junk mail. It's cute.",
        role: "connect",
        deltas: { confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "hide",
        letter: "B",
        emoji: "🖍️",
        text: "Switch to washable",
        consequence: "You swap the markers. A stealthy upgrade.",
        role: "avoid",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -5
      },
      {
        id: "lecture",
        letter: "C",
        emoji: "☝️",
        text: "Paper only rule",
        consequence: "You reiterate the rules of ink. Serious faces all around.",
        role: "teach",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_pet_pitch",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "The Pet Adoption Pitch",
    body: "Your kid arrives with a heartfelt speech about adopting a 'friend' (usually a stray creature with big dreams).",
    choices: [
      {
        id: "toy",
        letter: "A",
        emoji: "🧸",
        text: "Get a toy version",
        consequence: "You buy a plushie. It doesn't eat, which is a plus.",
        role: "avoid",
        deltas: { empathy: 0.3 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -15
      },
      {
        id: "no",
        letter: "B",
        emoji: "🚫",
        text: "Hard no",
        consequence: "You explain why we can't keep the squirrel. Tears ensue.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "feed",
        letter: "C",
        emoji: "🥜",
        text: "Leave food outside",
        consequence: "You support the friend from a distance. Nature channel vibes.",
        role: "teach",
        deltas: { empathy: 0.6 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: -5
      }
    ]
  },

  // --- CHILD EVENTS (6-10) ---
  {
    id: "chaos_smoke_alarm_science",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Smoke Alarm Science Fair",
    body: "A 'harmless' invention sets off the smoke alarm and your dignity along with it.",
    choices: [
      {
        id: "fan",
        letter: "A",
        emoji: "🌬️",
        text: "Fan the alarm",
        consequence: "You frantically wave a towel. The beeping stops. The smell lingers.",
        role: "avoid",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "praise",
        letter: "B",
        emoji: "🔬",
        text: "Praise the reaction",
        consequence: "You focus on the chemistry success. And open a window.",
        role: "connect",
        deltas: { intelligence: 0.6 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "safety",
        letter: "C",
        emoji: "🧯",
        text: "Fire safety drill",
        consequence: "You turn it into a safety lesson. Very responsible.",
        role: "teach",
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_reply_all",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Reply-All Emoji Saga",
    body: "A school email gets a reply. Then another. Then your child adds an emoji that sparks a parent email war.",
    choices: [
      {
        id: "apologize",
        letter: "A",
        emoji: "🙇",
        text: "Apologize to all",
        consequence: "You send a 'sorry' email. It adds to the spam.",
        role: "teach",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "ignore",
        letter: "B",
        emoji: "🙈",
        text: "Go silent",
        consequence: "You ghost the thread. Eventually it dies down.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "laugh",
        letter: "C",
        emoji: "😆",
        text: "Laugh with kid",
        consequence: "You explain email etiquette while chuckling.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_lunch_trade",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "The Lunch Trade Economy",
    body: "Your kid becomes a lunch-market genius. Suddenly, 'two crackers' equals 'one entire dessert.'",
    choices: [
      {
        id: "impress",
        letter: "A",
        emoji: "📈",
        text: "Be impressed",
        consequence: "You admire their hustle. Future CEO behavior.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "pack",
        letter: "B",
        emoji: "🥗",
        text: "Pack boring food",
        consequence: "You pack un-tradeable healthy food. The market crashes.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "ethics",
        letter: "C",
        emoji: "⚖️",
        text: "Teach fair trade",
        consequence: "You discuss fair value. They roll their eyes but listen.",
        role: "teach",
        deltas: { empathy: 0.5 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_field_trip_shortcut",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Field Trip Shortcut",
    body: "Your child confidently guides a group... directly away from where the group needed to be.",
    choices: [
      {
        id: "rescue",
        letter: "A",
        emoji: "🗺️",
        text: "Guide them back",
        consequence: "You step in and correct the course. Crisis managed.",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "adventure",
        letter: "B",
        emoji: "🧭",
        text: "Call it an adventure",
        consequence: "You pretend it was a scenic detour. The kids buy it.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "scold",
        letter: "C",
        emoji: "😤",
        text: "Scold the leader",
        consequence: "You tell them to follow, not lead. They deflate.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_picture_day_face_paint",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Picture Day Face Paint",
    body: "Ten minutes before photos, they add 'just a little' face paint. It is not little.",
    choices: [
      {
        id: "scrub",
        letter: "A",
        emoji: "🧼",
        text: "Scrub fast",
        consequence: "Their face is red, but the paint is gone. The photo looks painful.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "keep",
        letter: "B",
        emoji: "🐯",
        text: "Keep it",
        consequence: "The photo features a tiger. It's iconic.",
        role: "connect",
        deltas: { confidence: 0.7 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: -20
      },
      {
        id: "reschedule",
        letter: "C",
        emoji: "📅",
        text: "Retake day",
        consequence: "You skip today and wait for retakes. Logistics headache.",
        role: "avoid",
        deltas: { intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_window_soccer",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Window + Soccer Ball Diplomacy",
    body: "A ball meets a window. Now you meet a neighbor. Everyone pretends this is normal.",
    choices: [
      {
        id: "pay",
        letter: "A",
        emoji: "💸",
        text: "Pay and apologize",
        consequence: "You write a check. The neighbor forgives you.",
        role: "teach",
        deltas: { empathy: 0.4 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -200
      },
      {
        id: "chore",
        letter: "B",
        emoji: "🧹",
        text: "Kid does chores",
        consequence: "Your kid works off the debt. Character building!",
        role: "boundary",
        deltas: { discipline: 0.8 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: -100
      },
      {
        id: "insurance",
        letter: "C",
        emoji: "📋",
        text: "Claim it",
        consequence: "You handle it via paperwork. Impersonal but effective.",
        role: "avoid",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -50
      }
    ]
  },
  {
    id: "chaos_confetti_cannon",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Confetti Cannon Talent Show",
    body: "Your child brings 'stage effects.' Cleanup becomes a lifestyle.",
    choices: [
      {
        id: "help",
        letter: "A",
        emoji: "🧹",
        text: "Help clean up",
        consequence: "You sweep for hours. Bonding through labor.",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "hire",
        letter: "B",
        emoji: "🧼",
        text: "Hire a cleaner",
        consequence: "You pay someone else to deal with it. Worth it.",
        role: "avoid",
        deltas: { intelligence: 0 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -100
      },
      {
        id: "make_them",
        letter: "C",
        emoji: "☝️",
        text: "Make them clean",
        consequence: "They sweep until they hate confetti. Lesson learned.",
        role: "boundary",
        deltas: { discipline: 0.7 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_lost_instrument",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "The Lost Instrument Quest",
    body: "The rented instrument disappears. It's like the house ate it out of spite.",
    choices: [
      {
        id: "replace",
        letter: "A",
        emoji: "🎻",
        text: "Rent another",
        consequence: "You pay the fee. Life goes on.",
        role: "avoid",
        deltas: { confidence: 0 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -150
      },
      {
        id: "hunt",
        letter: "B",
        emoji: "🔍",
        text: "Tear house apart",
        consequence: "You find it under a bed. The house is wrecked.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 5,
        moneyDelta: 0
      },
      {
        id: "talk",
        letter: "C",
        emoji: "🗣️",
        text: "Responsibility talk",
        consequence: "You discuss keeping track of things. They listen... mostly.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_treasure_map",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Neighborhood Treasure Map",
    body: "Your kid buries something 'valuable' (probably your keys) and creates a map that makes zero sense.",
    choices: [
      {
        id: "dig",
        letter: "A",
        emoji: "⛏️",
        text: "Start digging",
        consequence: "You ruin the lawn but find the keys. Adventure!",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "spare",
        letter: "B",
        emoji: "🔑",
        text: "Use the spare",
        consequence: "You ignore the map and use the spare key. The keys stay buried.",
        role: "avoid",
        deltas: { intelligence: -0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -10
      },
      {
        id: "logic",
        letter: "C",
        emoji: "🧠",
        text: "Decode the map",
        consequence: "You treat it like a logic puzzle. It takes hours.",
        role: "teach",
        deltas: { intelligence: 0.6 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_pta_signup",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "The PTA Signup Surprise",
    body: "Your child 'helpfully' fills out a form. Congratulations on your new responsibility.",
    choices: [
      {
        id: "do_it",
        letter: "A",
        emoji: "🍪",
        text: "Do the job",
        consequence: "You bake the cookies. You are now a PTA hero.",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 1,
        stressDelta: 4,
        moneyDelta: -20
      },
      {
        id: "cancel",
        letter: "B",
        emoji: "📞",
        text: "Call and cancel",
        consequence: "You awkwardly explain. The PTA judges you.",
        role: "boundary",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "donate",
        letter: "C",
        emoji: "💵",
        text: "Donate instead",
        consequence: "You throw money at the problem. It works.",
        role: "avoid",
        deltas: { intelligence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -50
      }
    ]
  },
  {
    id: "chaos_viral_video",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Viral-at-School Video",
    body: "A video of you (doing something harmless but embarrassing) becomes playground legend.",
    choices: [
      {
        id: "own",
        letter: "A",
        emoji: "😎",
        text: "Own the fame",
        consequence: "You lean into it. The kids think you're cool (sort of).",
        role: "connect",
        deltas: { confidence: 0.8 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "delete",
        letter: "B",
        emoji: "🗑️",
        text: "Demand deletion",
        consequence: "You scrub the internet. You are now 'the uncool parent'.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🙈",
        text: "Ignore the buzz",
        consequence: "You pretend it isn't happening. It fades away.",
        role: "avoid",
        deltas: { confidence: 0 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_project_startup",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "The Class Project Startup",
    body: "Your kid turns a class project into a business plan and tries to invoice you.",
    choices: [
      {
        id: "invest",
        letter: "A",
        emoji: "💼",
        text: "Be an angel investor",
        consequence: "You fund the venture. They learn about equity.",
        role: "teach",
        deltas: { intelligence: 0.7 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -50
      },
      {
        id: "reject",
        letter: "B",
        emoji: "📉",
        text: "Reject the invoice",
        consequence: "You explain household economics. They are disappointed.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "play",
        letter: "C",
        emoji: "🎭",
        text: "Play along w/ fake money",
        consequence: "You pay in Monopoly money. It's a game again.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 2,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },

  // --- CHILD EVENTS (11-13) ---
  {
    id: "chaos_slime_vent",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Slime in the Vent",
    body: "Slime is made. Slime is placed somewhere it should not be. The house is now a science museum.",
    choices: [
      {
        id: "clean",
        letter: "A",
        emoji: "🧤",
        text: "Deep clean together",
        consequence: "You bond over the grossness. It takes all afternoon.",
        role: "connect",
        deltas: { empathy: 0.4 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: -10
      },
      {
        id: "pro",
        letter: "B",
        emoji: "👨‍🔧",
        text: "Call a pro",
        consequence: "The HVAC guy laughs. You pay the bill.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -150
      },
      {
        id: "ban",
        letter: "C",
        emoji: "🚫",
        text: "Ban slime forever",
        consequence: "Slime is outlawed. The house is safe but boring.",
        role: "boundary",
        deltas: { discipline: 0.6 },
        loveDelta: -2,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_cooking_smoke",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "The 'I Can Cook' Smoke Signal",
    body: "Your child decides to cook independently. The smoke alarm provides commentary.",
    choices: [
      {
        id: "encourage",
        letter: "A",
        emoji: "🍳",
        text: "Encourage the effort",
        consequence: "You salvage the meal and praise the attempt.",
        role: "connect",
        deltas: { confidence: 0.7 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: -20
      },
      {
        id: "teach",
        letter: "B",
        emoji: "📖",
        text: "Cooking lesson",
        consequence: "You step in and teach heat control.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "pizza",
        letter: "C",
        emoji: "🍕",
        text: "Order pizza",
        consequence: "You give up and order out. Everyone is happier.",
        role: "avoid",
        deltas: { discipline: -0.2 },
        loveDelta: 1,
        stressDelta: -1,
        moneyDelta: -30
      }
    ]
  },
  {
    id: "chaos_online_order_surprise",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Online Order Surprise Box",
    body: "A package arrives. It contains... far too many of one item. Your child says, 'It was a deal.'",
    choices: [
      {
        id: "keep",
        letter: "A",
        emoji: "📦",
        text: "Keep the bulk",
        consequence: "You now own 500 googly eyes. You'll use them someday.",
        role: "connect",
        deltas: { confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -40
      },
      {
        id: "return",
        letter: "B",
        emoji: "🔙",
        text: "Make them return it",
        consequence: "They learn about return policies and shipping labels.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "deduct",
        letter: "C",
        emoji: "💰",
        text: "Deduct from allowance",
        consequence: "You keep the stuff but they pay. Fair is fair.",
        role: "boundary",
        deltas: { discipline: 0.6 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_sleepover_escape",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Sleepover Becomes Escape Room",
    body: "The kids create an escape room. You become an unwilling participant.",
    choices: [
      {
        id: "play",
        letter: "A",
        emoji: "🧩",
        text: "Play the game",
        consequence: "You solve the puzzles. You are the cool parent.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 3,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "bribe",
        letter: "B",
        emoji: "🍦",
        text: "Bribe your way out",
        consequence: "You offer ice cream to be released. Freedom isn't free.",
        role: "avoid",
        deltas: { discipline: -0.1 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: -20
      },
      {
        id: "stop",
        letter: "C",
        emoji: "🛑",
        text: "End the lockdown",
        consequence: "You dismantle the barricade. The fun ends abruptly.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -2,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_screenshot",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Screenshot Catastrophe",
    body: "A screenshot is taken at the worst time and sent to the wrong place. Middle school chaos ensues.",
    choices: [
      {
        id: "damage",
        letter: "A",
        emoji: "🛡️",
        text: "Damage control",
        consequence: "You help draft the apology texts. Crisis managed.",
        role: "teach",
        deltas: { empathy: 0.6 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "ban",
        letter: "B",
        emoji: "📵",
        text: "Phone timeout",
        consequence: "You take the phone away. They feel isolated.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🤷",
        text: "Let them handle it",
        consequence: "You step back. They learn the hard way.",
        role: "avoid",
        deltas: { confidence: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_wrong_bus",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "The Wrong Bus Adventure",
    body: "Your child takes the wrong bus and accidentally tours the entire city.",
    choices: [
      {
        id: "rescue",
        letter: "A",
        emoji: "🚕",
        text: "Pick them up",
        consequence: "You drive across town. You are the savior.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: -10
      },
      {
        id: "guide",
        letter: "B",
        emoji: "🗺️",
        text: "Guide them home",
        consequence: "You talk them through transit maps. They feel capable.",
        role: "teach",
        deltas: { intelligence: 0.8 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "uber",
        letter: "C",
        emoji: "🚗",
        text: "Send a ride",
        consequence: "You pay for a ride. Problem solved with money.",
        role: "avoid",
        deltas: { discipline: 0 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -40
      }
    ]
  },
  {
    id: "chaos_club_overload",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Club Overload",
    body: "'I joined a club' turns into 'I joined seven clubs.' Your calendar catches fire.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🗓️",
        text: "Manage the schedule",
        consequence: "You become a logistics wizard. You are tired.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 2,
        stressDelta: 5,
        moneyDelta: -50
      },
      {
        id: "limit",
        letter: "B",
        emoji: "✂️",
        text: "Pick two",
        consequence: "You force a choice. They focus better.",
        role: "boundary",
        deltas: { discipline: 0.6 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "burnout",
        letter: "C",
        emoji: "🔥",
        text: "Let them burnout",
        consequence: "They quit most of them eventually. Natural consequences.",
        role: "avoid",
        deltas: { intelligence: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -20
      }
    ]
  },
  {
    id: "chaos_dress_code",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Dress Code Legal Brief",
    body: "Your kid writes a dramatic argument like they're defending a court case regarding school attire.",
    choices: [
      {
        id: "debate",
        letter: "A",
        emoji: "⚖️",
        text: "Debate the points",
        consequence: "You respect the logic. It's a good discussion.",
        role: "teach",
        deltas: { intelligence: 0.7 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "support",
        letter: "B",
        emoji: "✊",
        text: "Back the protest",
        consequence: "You help them petition. Power to the people.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "rule",
        letter: "C",
        emoji: "📜",
        text: "Rules are rules",
        consequence: "You shut it down. They feel unheard.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -2,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_hamster_surprise",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Hamster Surprise",
    body: "A 'class pet' appears at home with a tragic backstory and a tiny wheel.",
    choices: [
      {
        id: "adopt",
        letter: "A",
        emoji: "🐹",
        text: "Welcome the rodent",
        consequence: "You buy bedding. The hamster lives like a king.",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: -30
      },
      {
        id: "return",
        letter: "B",
        emoji: "🏫",
        text: "Return to school",
        consequence: "You drive it back. Not our hamster.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "care",
        letter: "C",
        emoji: "🥕",
        text: "Teach pet care",
        consequence: "They clean the cage. A valuable lesson.",
        role: "teach",
        deltas: { discipline: 0.6 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos_rumor_machine",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Rumor Machine",
    body: "A rumor spreads. Somehow, you are a main character. You did not audition.",
    choices: [
      {
        id: "clarify",
        letter: "A",
        emoji: "📢",
        text: "Set record straight",
        consequence: "You talk to the parents. Awkward but done.",
        role: "teach",
        deltas: { confidence: 0.4 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "ignore",
        letter: "B",
        emoji: "😎",
        text: "Be mysterious",
        consequence: "You let them talk. You are an enigma.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "laugh",
        letter: "C",
        emoji: "😂",
        text: "Laugh it off",
        consequence: "You joke about it. The power fades.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_diy_tech_support",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "DIY Tech Support",
    body: "Your kid 'optimizes' the Wi-Fi setup. The internet disappears like a magic trick.",
    choices: [
      {
        id: "fix",
        letter: "A",
        emoji: "🔧",
        text: "Fix it together",
        consequence: "You debug the router. Bonding over IP addresses.",
        role: "teach",
        deltas: { intelligence: 0.7 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "pro",
        letter: "B",
        emoji: "📞",
        text: "Call ISP",
        consequence: "You spend hours on hold. It gets fixed.",
        role: "avoid",
        deltas: { intelligence: -0.1 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "ban",
        letter: "C",
        emoji: "🚫",
        text: "Ban from router",
        consequence: "No more touching the box. They sulk.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_skateboard_delivery",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Skateboard Delivery Route",
    body: "Your child tries to 'help' by delivering something and returns two hours later with a new story arc.",
    choices: [
      {
        id: "listen",
        letter: "A",
        emoji: "👂",
        text: "Listen to the saga",
        consequence: "It's an epic tale. You validate their journey.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "scold",
        letter: "B",
        emoji: "⏱️",
        text: "Focus on time",
        consequence: "You lecture about punctuality. Story ruined.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "track",
        letter: "C",
        emoji: "📍",
        text: "Install tracker",
        consequence: "You track them next time. Safe but controlling.",
        role: "avoid",
        deltas: { discipline: 0.2 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: -20
      }
    ]
  },

  // --- CHILD EVENTS (14-18) ---
  {
    id: "chaos_driving_cones",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Practice Driving Cone City",
    body: "Practice driving turns a parking lot into a cone disaster documentary.",
    choices: [
      {
        id: "calm",
        letter: "A",
        emoji: "🧘",
        text: "Stay zen",
        consequence: "You calmly reset the cones. Nerves of steel.",
        role: "connect",
        deltas: { confidence: 0.7 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "pro",
        letter: "B",
        emoji: "🚗",
        text: "Hire instructor",
        consequence: "You outsource the danger. Best money spent.",
        role: "avoid",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -300
      },
      {
        id: "quit",
        letter: "C",
        emoji: "🛑",
        text: "End the session",
        consequence: "You drive home in silence. Confidence hit.",
        role: "boundary",
        deltas: { confidence: -0.3 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_job_overload",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Part-Time Job Becomes Full-Time",
    body: "Your teen is scheduled for an impossible number of hours and somehow thinks it's fine.",
    choices: [
      {
        id: "balance",
        letter: "A",
        emoji: "⚖️",
        text: "Teach balance",
        consequence: "You help them negotiate hours. A life skill.",
        role: "teach",
        deltas: { intelligence: 0.6 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "stop",
        letter: "B",
        emoji: "🛑",
        text: "Limit hours",
        consequence: "You enforce a cap. They grumble but sleep more.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "support",
        letter: "C",
        emoji: "☕",
        text: "Bring coffee",
        consequence: "You support the hustle. They are exhausted.",
        role: "connect",
        deltas: { discipline: 0.7 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos_basement_concert",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Basement Concert Premiere",
    body: "'We're practicing quietly' becomes a concert with neighbors as involuntary audience.",
    choices: [
      {
        id: "earplugs",
        letter: "A",
        emoji: "🎧",
        text: "Hand out earplugs",
        consequence: "You soothe the neighbors. The rock continues.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: -20
      },
      {
        id: "cutoff",
        letter: "B",
        emoji: "🔇",
        text: "Cut the power",
        consequence: "Silence falls. The band breaks up.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "schedule",
        letter: "C",
        emoji: "📅",
        text: "Set practice hours",
        consequence: "You agree on times. A loud compromise.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_college_essay",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "College Essay Overshare Draft",
    body: "Your teen writes an essay draft that is wildly dramatic. It's compelling. It's also... too much.",
    choices: [
      {
        id: "edit",
        letter: "A",
        emoji: "✏️",
        text: "Gentle edits",
        consequence: "You tone it down together. It's still weird.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "send",
        letter: "B",
        emoji: "🚀",
        text: "Let them send it",
        consequence: "They embrace their voice. Admissions will remember them.",
        role: "connect",
        deltas: { confidence: 0.8 },
        loveDelta: 2,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "hire",
        letter: "C",
        emoji: "👩‍🏫",
        text: "Hire a coach",
        consequence: "A pro fixes it. It's generic now.",
        role: "avoid",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -200
      }
    ]
  },
  {
    id: "chaos_prom_proposal",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Prom Proposal Logistics",
    body: "Your teen recruits you for an elaborate plan that requires spreadsheets and emotional strength.",
    choices: [
      {
        id: "help",
        letter: "A",
        emoji: "📋",
        text: "Manage the project",
        consequence: "You coordinate the flash mob. It works.",
        role: "connect",
        deltas: { empathy: 0.6 },
        loveDelta: 2,
        stressDelta: 4,
        moneyDelta: -50
      },
      {
        id: "simplify",
        letter: "B",
        emoji: "📉",
        text: "Scale it down",
        consequence: "You convince them to just ask. Less pressure.",
        role: "teach",
        deltas: { confidence: 0.4 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "refuse",
        letter: "C",
        emoji: "🙅",
        text: "Refuse to help",
        consequence: "You stay out of it. They pull it off poorly.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_debate_rival",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Debate Club Rival Dinner",
    body: "Your teen invites their debate rival over. Dinner becomes a live argument tournament.",
    choices: [
      {
        id: "judge",
        letter: "A",
        emoji: "⚖️",
        text: "Moderate the debate",
        consequence: "You declare a winner. Dessert is served in peace.",
        role: "connect",
        deltas: { intelligence: 0.6 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "stop",
        letter: "B",
        emoji: "🍽️",
        text: "Ban politics at table",
        consequence: "You enforce silence. The tension is palpable.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "leave",
        letter: "C",
        emoji: "🚪",
        text: "Eat elsewhere",
        consequence: "You take your plate to the living room. Cowardice wins.",
        role: "avoid",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_social_challenge",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Harmless Social Challenge Cleanup",
    body: "A social trend leads to a big mess that is technically not illegal but definitely ambitious.",
    choices: [
      {
        id: "clean",
        letter: "A",
        emoji: "🧽",
        text: "Oversee cleanup",
        consequence: "You make them fix it. Integrity grows.",
        role: "teach",
        deltas: { discipline: 0.7 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "laugh",
        letter: "B",
        emoji: "😂",
        text: "Laugh and help",
        consequence: "You join the cleanup crew. Bonding over absurdity.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "pay",
        letter: "C",
        emoji: "💸",
        text: "Pay for repairs",
        consequence: "You throw money at the damage. Easy way out.",
        role: "avoid",
        deltas: { discipline: -0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -100
      }
    ]
  },
  {
    id: "chaos_tryout_sprain",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Tryout Sprain Drama",
    body: "A tryout leads to a minor injury and a major emotional press conference.",
    choices: [
      {
        id: "comfort",
        letter: "A",
        emoji: "🩹",
        text: "Ice and sympathy",
        consequence: "You nurse the injury and the ego. They recover.",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: -20
      },
      {
        id: "tough",
        letter: "B",
        emoji: "🏋️",
        text: "Tough love",
        consequence: "You say 'walk it off.' They walk away angry.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "doctor",
        letter: "C",
        emoji: "🩺",
        text: "ER visit just in case",
        consequence: "You go to the doctor. It's nothing. Expensive reassurance.",
        role: "avoid",
        deltas: { intelligence: 0 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: -200
      }
    ]
  },
  {
    id: "chaos_router_rewire",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Router Rewire Adventure",
    body: "Your teen 'fixes' the router with confidence. The internet is now an ancient legend.",
    choices: [
      {
        id: "learn",
        letter: "A",
        emoji: "📚",
        text: "Learn networking",
        consequence: "You both read the manual. Hours later, connectivity.",
        role: "teach",
        deltas: { intelligence: 0.6 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "tether",
        letter: "B",
        emoji: "📱",
        text: "Hotspot life",
        consequence: "You survive on data. The router remains broken.",
        role: "avoid",
        deltas: { discipline: 0 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "pro",
        letter: "C",
        emoji: "👨‍💻",
        text: "Call the geek",
        consequence: "A pro fixes the mess. Humbling.",
        role: "avoid",
        deltas: { intelligence: -0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -100
      }
    ]
  },
  {
    id: "chaos_senior_prank",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Senior Prank Backfires Gently",
    body: "A prank attempt goes sideways, and suddenly you're negotiating with school administration.",
    choices: [
      {
        id: "advocate",
        letter: "A",
        emoji: "🤝",
        text: "Advocate for leniency",
        consequence: "You smooth it over. It goes on the permanent record, but lightly.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 2,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "consequence",
        letter: "B",
        emoji: "⚖️",
        text: "Accept punishment",
        consequence: "You let them face the music. Tough but fair.",
        role: "boundary",
        deltas: { discipline: 0.7 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "fix",
        letter: "C",
        emoji: "🧹",
        text: "Help clean up",
        consequence: "You help undo the prank. The school appreciates the labor.",
        role: "teach",
        deltas: { empathy: 0.4 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_surprise_interview",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Surprise Interview Trip",
    body: "A last-minute interview requires travel, good clothes, and a miracle.",
    choices: [
      {
        id: "drive",
        letter: "A",
        emoji: "🚗",
        text: "Road trip now",
        consequence: "You drop everything and drive. Bonding on the highway.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 2,
        stressDelta: 4,
        moneyDelta: -100
      },
      {
        id: "zoom",
        letter: "B",
        emoji: "💻",
        text: "Ask for Zoom",
        consequence: "You advise them to negotiate. They get a virtual slot.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "no",
        letter: "C",
        emoji: "🚫",
        text: "Can't make it",
        consequence: "You say no. Opportunity missed, lesson in planning learned.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -2,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_grad_cap_business",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Graduation Cap Business",
    body: "Your teen starts customizing graduation caps. Your home becomes an arts-and-crafts factory.",
    choices: [
      {
        id: "space",
        letter: "A",
        emoji: "🏭",
        text: "Give up the garage",
        consequence: "You dedicate space to the factory. Glitter everywhere.",
        role: "connect",
        deltas: { confidence: 0.7 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "invest",
        letter: "B",
        emoji: "💵",
        text: "Buy supplies",
        consequence: "You fund the glitter surplus. They make a profit.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -50
      },
      {
        id: "limit",
        letter: "C",
        emoji: "🛑",
        text: "Limit the mess",
        consequence: "You restrict operations. Production slows.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },

  // --- PARTNER EVENTS (requiresPartner=true) ---
  {
    id: "chaos_partner_volunteer",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Your Partner Volunteers You",
    body: "Your partner says, 'I signed us up!' You learn the details as the event begins.",
    choices: [
      {
        id: "go",
        letter: "A",
        emoji: "🙂",
        text: "Go with a smile",
        consequence: "You participate. It wasn't terrible.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: 5
      },
      {
        id: "grump",
        letter: "B",
        emoji: "😒",
        text: "Go but complain",
        consequence: "You go, but make your displeasure known.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "bail",
        letter: "C",
        emoji: "✌️",
        text: "Bail out",
        consequence: "You stay home. Your partner goes alone.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -5
      }
    ]
  },
  {
    id: "chaos_quick_diy",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "The 'Quick DIY' Hole",
    body: "Your partner tries a quick home fix. A new hole appears. It has opinions.",
    choices: [
      {
        id: "laugh",
        letter: "A",
        emoji: "😂",
        text: "Laugh it off",
        consequence: "You put a frame over it. Character added.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "pro",
        letter: "B",
        emoji: "📞",
        text: "Call a pro",
        consequence: "You pay to fix the fix.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -150,
        partnerMeterDelta: 0
      },
      {
        id: "scold",
        letter: "C",
        emoji: "😠",
        text: "I told you so",
        consequence: "You point out the error. True, but helpful?",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -4
      }
    ]
  },
  {
    id: "chaos_kombucha",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Competitive Kombucha Era",
    body: "Your partner starts brewing something 'simple.' The bottles disagree and become dramatic.",
    choices: [
      {
        id: "drink",
        letter: "A",
        emoji: "🥂",
        text: "Drink the potion",
        consequence: "It tastes like vinegar and love. You survive.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 4
      },
      {
        id: "contain",
        letter: "B",
        emoji: "📦",
        text: "Containment zone",
        consequence: "You move the lab to the garage.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -1
      },
      {
        id: "toss",
        letter: "C",
        emoji: "🗑️",
        text: "Accidental disposal",
        consequence: "Oops, the scoby is gone. Tragedy.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -5
      }
    ]
  },
  {
    id: "chaos_anniversary_recovery",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "The Forgotten Anniversary Recovery Plan",
    body: "Your partner forgets something important and over-corrects with a plan that involves logistics and panic.",
    choices: [
      {
        id: "accept",
        letter: "A",
        emoji: "❤️",
        text: "Accept the effort",
        consequence: "You enjoy the chaotic date. It's the thought that counts.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 5
      },
      {
        id: "cancel",
        letter: "B",
        emoji: "🍕",
        text: "Order pizza instead",
        consequence: "You cancel the madness and chill. Relief.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -30,
        partnerMeterDelta: 2
      },
      {
        id: "sulk",
        letter: "C",
        emoji: "😒",
        text: "Stay annoyed",
        consequence: "You let them sweat. They won't forget again.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -3
      }
    ]
  },
  {
    id: "chaos_work_call",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "The Work Call Goes Public",
    body: "A work call happens at the worst time, with maximum audience.",
    choices: [
      {
        id: "shush",
        letter: "A",
        emoji: "🤫",
        text: "Quiet everyone",
        consequence: "You become the silence enforcer. The call is saved.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "leave",
        letter: "B",
        emoji: "🚶",
        text: "Walk away",
        consequence: "You leave the room. Not your circus.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -1
      },
      {
        id: "interrupt",
        letter: "C",
        emoji: "🗣️",
        text: "Interrupt loudly",
        consequence: "You ask where the keys are. The meeting hears you.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: -4
      }
    ]
  },
  {
    id: "chaos_dog_slide_deck",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "The 'We Need a Dog' Slide Deck",
    body: "Your partner presents a persuasive slideshow complete with charts, as if pitching investors.",
    choices: [
      {
        id: "listen",
        letter: "A",
        emoji: "👏",
        text: "Applaud the data",
        consequence: "You admire the font choice. You consider the dog.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 4
      },
      {
        id: "veto",
        letter: "B",
        emoji: "🚫",
        text: "Veto the merger",
        consequence: "You reject the proposal. The board is unhappy.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "delay",
        letter: "C",
        emoji: "⏳",
        text: "Table for Q3",
        consequence: "You delay the decision. Stalling tactic effective.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -1
      }
    ]
  },
  {
    id: "chaos_gadget_infomercial",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Gadget Infomercial Night",
    body: "Your partner buys a gadget you've never seen before. It arrives in three boxes.",
    choices: [
      {
        id: "try",
        letter: "A",
        emoji: "🕹️",
        text: "Try to use it",
        consequence: "You slice a tomato in 0.2 seconds. It's kinda fun.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "return",
        letter: "B",
        emoji: "📦",
        text: "Return policy?",
        consequence: "You check the receipt. It goes back.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 50,
        partnerMeterDelta: -2
      },
      {
        id: "store",
        letter: "C",
        emoji: "🗄️",
        text: "Store it forever",
        consequence: "It joins the graveyard of gadgets.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 0
      }
    ]
  },
  {
    id: "chaos_plant_jungle",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "One Plant Turns Into a Jungle",
    body: "Your partner brings home 'just one plant.' It multiplies like a myth.",
    choices: [
      {
        id: "water",
        letter: "A",
        emoji: "🚿",
        text: "Help water them",
        consequence: "You live in a greenhouse now. The air is fresh.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "limit",
        letter: "B",
        emoji: "🛑",
        text: "Plant cap",
        consequence: "No more pots. The jungle growth is halted.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -1
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🌿",
        text: "Let them grow",
        consequence: "You push leaves aside to watch TV. Nature wins.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 1
      }
    ]
  },
  {
    id: "chaos_neighborhood_mediator",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Neighborhood Mediator",
    body: "Your partner volunteers to 'help resolve' a dispute and becomes committee leader by accident.",
    choices: [
      {
        id: "support",
        letter: "A",
        emoji: "🤝",
        text: "Co-chair the meetings",
        consequence: "You join the fray. The fence dispute is settled.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0,
        partnerMeterDelta: 4
      },
      {
        id: "mock",
        letter: "B",
        emoji: "😆",
        text: "Tease gently",
        consequence: "You call them 'Mr. Mayor.' They pretend to be annoyed.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 1
      },
      {
        id: "quit",
        letter: "C",
        emoji: "🚪",
        text: "Make them quit",
        consequence: "You insist they step down. Peace returns.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0,
        partnerMeterDelta: -2
      }
    ]
  },
  {
    id: "chaos_road_trip_detour",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Surprise Road Trip Detour",
    body: "Your partner takes a 'quick route' and accidentally discovers a festival.",
    choices: [
      {
        id: "join",
        letter: "A",
        emoji: "🎡",
        text: "Join the fun",
        consequence: "You eat fried dough. The delay was worth it.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -50,
        partnerMeterDelta: 4
      },
      {
        id: "stress",
        letter: "B",
        emoji: "⌚",
        text: "Stress about time",
        consequence: "You check the watch. The fun is damp.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "sleep",
        letter: "C",
        emoji: "😴",
        text: "Nap in car",
        consequence: "They explore; you sleep. A fair trade.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0,
        partnerMeterDelta: 0
      }
    ]
  },
  {
    id: "chaos_minimalism_purge",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Minimalism Purge Misfire",
    body: "Your partner donates things to declutter... including something you absolutely needed.",
    choices: [
      {
        id: "forgive",
        letter: "A",
        emoji: "🕊️",
        text: "Forgive and replace",
        consequence: "You buy a new one. Stuff is just stuff.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -40,
        partnerMeterDelta: 2
      },
      {
        id: "hunt",
        letter: "B",
        emoji: "🕵️",
        text: "Go to thrift store",
        consequence: "You hunt it down. You find it!",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -10,
        partnerMeterDelta: 1
      },
      {
        id: "ban",
        letter: "C",
        emoji: "🚫",
        text: "Ban touching my stuff",
        consequence: "You designate safe zones. Clutter returns.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: -3
      }
    ]
  },
  {
    id: "chaos_fitness_tracker",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Fitness Tracker War",
    body: "Your partner starts a steps competition. The household becomes an athletic training montage.",
    choices: [
      {
        id: "compete",
        letter: "A",
        emoji: "🏃",
        text: "Compete to win",
        consequence: "You walk in circles. You win!",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "ignore",
        letter: "B",
        emoji: "📺",
        text: "Watch from couch",
        consequence: "You cheer them on. From sitting.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0,
        partnerMeterDelta: 0
      },
      {
        id: "shake",
        letter: "C",
        emoji: "👋",
        text: "Shake the wrist",
        consequence: "You cheat with arm movements. They find out.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -1
      }
    ]
  },
  {
    id: "chaos_marketplace_bargain",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Marketplace Bargain Adventure",
    body: "Your partner bargains confidently and returns with far too much of one item.",
    choices: [
      {
        id: "laugh",
        letter: "A",
        emoji: "🤣",
        text: "Laugh at the pile",
        consequence: "You have 40 candles now. Romance time?",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 2
      },
      {
        id: "resell",
        letter: "B",
        emoji: "💰",
        text: "Resell the excess",
        consequence: "You flip the extras. Profit!",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 20,
        partnerMeterDelta: 1
      },
      {
        id: "scold",
        letter: "C",
        emoji: "🛑",
        text: "No more bulk buys",
        consequence: "You set a quantity limit. Sensible.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -2
      }
    ]
  },
  {
    id: "chaos_parenting_expert",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "The One-Article Parenting Expert",
    body: "Your partner reads one article and announces a brand-new parenting system.",
    choices: [
      {
        id: "try",
        letter: "A",
        emoji: "🧪",
        text: "Give it a week",
        consequence: "You try the method. It fails by Tuesday.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "ignore",
        letter: "B",
        emoji: "🙄",
        text: "Nod and ignore",
        consequence: "You continue as usual. They forget about it.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 0
      },
      {
        id: "debate",
        letter: "C",
        emoji: "🗣️",
        text: "Debate the logic",
        consequence: "You poke holes in the theory. They pout.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -3
      }
    ]
  },
  {
    id: "chaos_alarm_clock",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Alarm Clock Strategy",
    body: "Your partner sets twelve alarms as a 'system.' The neighbors develop concerns.",
    choices: [
      {
        id: "wake",
        letter: "A",
        emoji: "☕",
        text: "Wake them up",
        consequence: "You become the human alarm. It works better.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: 4
      },
      {
        id: "delete",
        letter: "B",
        emoji: "📱",
        text: "Delete the extras",
        consequence: "You thin the herd of beeps. Sleep saved.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "earplugs",
        letter: "C",
        emoji: "🙉",
        text: "Wear earplugs",
        consequence: "You sleep through the chaos. They are late.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 0
      }
    ]
  },
  {
    id: "chaos_karaoke",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Karaoke Commitment",
    body: "Your partner signs you both up for karaoke. You are now scheduled to be brave.",
    choices: [
      {
        id: "sing",
        letter: "A",
        emoji: "🎤",
        text: "Duet time",
        consequence: "You sing horribly together. It's magical.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -30,
        partnerMeterDelta: 5
      },
      {
        id: "watch",
        letter: "B",
        emoji: "👏",
        text: "Cheer from crowd",
        consequence: "You refuse to sing but clap loudly.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -20,
        partnerMeterDelta: 1
      },
      {
        id: "fake",
        letter: "C",
        emoji: "🤧",
        text: "Fake sore throat",
        consequence: "You lose your voice. Conveniently.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -1
      }
    ]
  },
  {
    id: "chaos_drone",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Drone Hobby Incident",
    body: "A drone is purchased. The tree becomes an antagonist.",
    choices: [
      {
        id: "ladder",
        letter: "A",
        emoji: "🪜",
        text: "Get the ladder",
        consequence: "You rescue the drone. Teamwork!",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "leave",
        letter: "B",
        emoji: "🌳",
        text: "It lives there now",
        consequence: "The drone belongs to the tree. Nature healing.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "buy",
        letter: "C",
        emoji: "🚁",
        text: "Buy another",
        consequence: "You buy a backup. An expensive solution.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -100,
        partnerMeterDelta: 2
      }
    ]
  },
  {
    id: "chaos_surprise_guests",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Surprise Guests RSVP",
    body: "Your partner invites guests to stay 'for a bit.' You learn this when they arrive.",
    choices: [
      {
        id: "host",
        letter: "A",
        emoji: "🥂",
        text: "Host flawlessly",
        consequence: "You pivot to host mode. Exhausting but impressive.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -50,
        partnerMeterDelta: 3
      },
      {
        id: "hotel",
        letter: "B",
        emoji: "🏨",
        text: "Send to hotel",
        consequence: "You pay for their room. Privacy preserved.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -200,
        partnerMeterDelta: -1
      },
      {
        id: "hide",
        letter: "C",
        emoji: "🙈",
        text: "Hide in bedroom",
        consequence: "You claim illness. The guests are confused.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -3
      }
    ]
  },
  {
    id: "chaos_car_upgrade",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Mystery Car Upgrade",
    body: "The car won't start because your partner installed something 'helpful.'",
    choices: [
      {
        id: "undo",
        letter: "A",
        emoji: "🔧",
        text: "Uninstall it",
        consequence: "You rip it out. The car starts. Silence is golden.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "mechanic",
        letter: "B",
        emoji: "👨‍🔧",
        text: "Call mechanic",
        consequence: "You pay to fix the upgrade.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -150,
        partnerMeterDelta: 0
      },
      {
        id: "laugh",
        letter: "C",
        emoji: "😆",
        text: "Laugh at attempt",
        consequence: "You appreciate the effort. You walk today.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 3
      }
    ]
  },
  {
    id: "chaos_pta_spy",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "PTA Like a Spy Movie",
    body: "Your partner treats a school volunteer role like covert ops and ropes you in as 'backup.'",
    choices: [
      {
        id: "mission",
        letter: "A",
        emoji: "🕶️",
        text: "Accept mission",
        consequence: "You wear sunglasses. The bake sale is secure.",
        role: "connect",
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 4
      },
      {
        id: "reality",
        letter: "B",
        emoji: "😐",
        text: "Reality check",
        consequence: "You remind them it's muffins, not missiles.",
        role: "boundary",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "drive",
        letter: "C",
        emoji: "🚗",
        text: "Getaway driver",
        consequence: "You drive the car. You ask no questions.",
        role: "avoid",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        partnerMeterDelta: 1
      }
    ]
  },

  // --- PARENT / WORLD EVENTS (81-100) ---
  {
    id: "chaos_tree_branch",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Tree Branch Hospital Episode",
    body: "A tree branch falls, you get a non-graphic injury, and the waiting room TV becomes your new best friend.",
    choices: [
      {
        id: "wait",
        letter: "A",
        emoji: "📺",
        text: "Wait it out",
        consequence: "You watch 4 hours of daytime TV. You heal.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -50
      },
      {
        id: "joke",
        letter: "B",
        emoji: "😆",
        text: "Joke with nurses",
        consequence: "You charm the staff. It still hurts.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -50
      },
      {
        id: "upgrade",
        letter: "C",
        emoji: "🏥",
        text: "Better care",
        consequence: "You go to the fancy clinic. Fast but pricey.",
        role: "boundary",
        deltas: { intelligence: 0 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -200
      }
    ]
  },
  {
    id: "chaos_autocorrect",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Autocorrect Betrayal",
    body: "Autocorrect sends a message that reads like you're starting a feud. It goes to the wrong person.",
    choices: [
      {
        id: "call",
        letter: "A",
        emoji: "📞",
        text: "Call immediately",
        consequence: "You explain it was 'duck' not... that. Crisis managed.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "followup",
        letter: "B",
        emoji: "📱",
        text: "Send correction",
        consequence: "You text 'oops.' They never reply. The mystery lingers.",
        role: "avoid",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "double",
        letter: "C",
        emoji: "😤",
        text: "Double down",
        consequence: "You pretend you meant it. Power move.",
        role: "boundary",
        deltas: { confidence: 0.5 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_elevator",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Elevator with a Theme Group",
    body: "You get stuck in an elevator with a very specific themed group who are extremely cheerful about it.",
    choices: [
      {
        id: "join",
        letter: "A",
        emoji: "🎭",
        text: "Join the song",
        consequence: "You sing along. You are an honorary member now.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "corner",
        letter: "B",
        emoji: "😶",
        text: "Stare at wall",
        consequence: "You dissociate until the doors open.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "tweet",
        letter: "C",
        emoji: "📱",
        text: "Live tweet it",
        consequence: "You go viral for 15 minutes. The clowns wave.",
        role: "teach",
        deltas: { intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_rooster",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "A Rooster Moves In",
    body: "A rooster adopts your yard and schedules loud announcements.",
    choices: [
      {
        id: "adopt",
        letter: "A",
        emoji: "🐔",
        text: "Keep the bird",
        consequence: "Free alarm clock. Neighbors hate you.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "rehome",
        letter: "B",
        emoji: "🚜",
        text: "Find a farm",
        consequence: "You drive it to the country. Peace returns.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -20
      },
      {
        id: "earplugs",
        letter: "C",
        emoji: "🎧",
        text: "Buy earplugs",
        consequence: "You ignore the crowing. Life goes on.",
        role: "avoid",
        deltas: { intelligence: 0 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos_parade_float",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Your Car Becomes a Parade Float",
    body: "Someone decorates your car for a 'community thing.' You learn when you try to drive.",
    choices: [
      {
        id: "drive",
        letter: "A",
        emoji: "🚙",
        text: "Drive it anyway",
        consequence: "You drive with streamers. People wave.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "clean",
        letter: "B",
        emoji: "🧼",
        text: "Remove it all",
        consequence: "You are late, but your car is dignified.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "uber",
        letter: "C",
        emoji: "🚕",
        text: "Take a taxi",
        consequence: "You leave the float. You deal with it later.",
        role: "avoid",
        deltas: { intelligence: 0 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -30
      }
    ]
  },
  {
    id: "chaos_neighborhood_watch",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Neighborhood Watch Captain",
    body: "You accidentally become the neighborhood watch captain and receive a clipboard.",
    choices: [
      {
        id: "lead",
        letter: "A",
        emoji: "📋",
        text: "Lead with honor",
        consequence: "You organize patrols. Crime (littering) drops.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "resign",
        letter: "B",
        emoji: "🏳️",
        text: "Resign instantly",
        consequence: "You hand back the clipboard. Freedom.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "ghost",
        letter: "C",
        emoji: "👻",
        text: "Ghost the group",
        consequence: "You keep the clipboard but do nothing.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_utility_mixup",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Utility Mix-Up",
    body: "The utility company believes your house is a different house. Bureaucracy ensues.",
    choices: [
      {
        id: "fight",
        letter: "A",
        emoji: "📞",
        text: "Fight on phone",
        consequence: "You yell at robots. It gets fixed eventually.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "pay",
        letter: "B",
        emoji: "💸",
        text: "Pay the difference",
        consequence: "You pay $12 to make it go away.",
        role: "avoid",
        deltas: { intelligence: -0.1 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -12
      },
      {
        id: "visit",
        letter: "C",
        emoji: "🏢",
        text: "Go in person",
        consequence: "You visit the office. They are confused but helpful.",
        role: "teach",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos_subscription_box",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Subscription Box Avalanche",
    body: "Boxes arrive daily. You do not remember subscribing to 'mystery crates.'",
    choices: [
      {
        id: "open",
        letter: "A",
        emoji: "🎁",
        text: "Open them all",
        consequence: "It's mostly snacks and socks. Not bad.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -50
      },
      {
        id: "cancel",
        letter: "B",
        emoji: "🛑",
        text: "Cancel cards",
        consequence: "You nuke your finances to stop the flow.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "gift",
        letter: "C",
        emoji: "🎀",
        text: "Regift everything",
        consequence: "Everyone gets mystery gifts. You are generous.",
        role: "avoid",
        deltas: { empathy: 0.3 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -20
      }
    ]
  },
  {
    id: "chaos_contest_win",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "You Win a Contest You Didn't Enter",
    body: "You win a prize that comes with obligations you did not agree to.",
    choices: [
      {
        id: "accept",
        letter: "A",
        emoji: "🏆",
        text: "Accept the ham",
        consequence: "You have a lifetime supply of ham. It's... salty.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "decline",
        letter: "B",
        emoji: "🙅",
        text: "Polite refusal",
        consequence: "You walk away. No ham for you.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "donate",
        letter: "C",
        emoji: "🏦",
        text: "Donate the prize",
        consequence: "The food bank is confused but grateful.",
        role: "teach",
        deltas: { empathy: 0.5 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_gps_landmark",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Your House Becomes a GPS Landmark",
    body: "Strangers keep showing up politely asking for directions.",
    choices: [
      {
        id: "help",
        letter: "A",
        emoji: "🗺️",
        text: "Give directions",
        consequence: "You become a local guide. It's quaint.",
        role: "connect",
        deltas: { empathy: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "sign",
        letter: "B",
        emoji: "🛑",
        text: "Put up a sign",
        consequence: "The sign says 'Not a landmark.' It helps.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -10
      },
      {
        id: "report",
        letter: "C",
        emoji: "💻",
        text: "Report map error",
        consequence: "You submit a ticket. It takes weeks.",
        role: "avoid",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_film_crew",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Film Crew Wants Your Driveway",
    body: "A tiny film crew asks to use your driveway. They say it'll be 'quick.'",
    choices: [
      {
        id: "yes",
        letter: "A",
        emoji: "🎬",
        text: "Say yes",
        consequence: "It takes all day. You get a free sandwich.",
        role: "connect",
        deltas: { confidence: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "money",
        letter: "B",
        emoji: "💰",
        text: "Demand payment",
        consequence: "They pay you $50. You feel mogul-ish.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 50
      },
      {
        id: "no",
        letter: "C",
        emoji: "🚪",
        text: "Close the blinds",
        consequence: "You ignore them. They leave.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_volunteer_shift",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "'One Hour' Volunteer Shift",
    body: "You volunteer for one hour and accidentally do twelve.",
    choices: [
      {
        id: "stay",
        letter: "A",
        emoji: "😅",
        text: "Stay the course",
        consequence: "You are exhausted but virtuous. A hero.",
        role: "connect",
        deltas: { empathy: 0.6 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "leave",
        letter: "B",
        emoji: "✌️",
        text: "Leave at hour 2",
        consequence: "You sneak out. Guilt follows you.",
        role: "avoid",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "complain",
        letter: "C",
        emoji: "🗣️",
        text: "Speak up",
        consequence: "You point out the time. They let you go.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_fire_drill_call",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Fire Drill During Important Call",
    body: "A fire drill happens during your most important call. Everyone is fine; your soul is not.",
    choices: [
      {
        id: "mute",
        letter: "A",
        emoji: "🔇",
        text: "Mute and run",
        consequence: "You run outside while smiling on video. Cardio.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "explain",
        letter: "B",
        emoji: "📢",
        text: "Explain the noise",
        consequence: "The client laughs. Humanizing moment.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "reschedule",
        letter: "C",
        emoji: "📅",
        text: "Reschedule now",
        consequence: "You hang up. Professional boundary set.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_squirrel_war",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Squirrel vs Trash Can",
    body: "A squirrel declares war on your trash can with strategic planning.",
    choices: [
      {
        id: "bungee",
        letter: "A",
        emoji: "🧗",
        text: "Bungee cords",
        consequence: "You secure the lid. The squirrel is baffled.",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -10
      },
      {
        id: "feed",
        letter: "B",
        emoji: "🥜",
        text: "Feed the enemy",
        consequence: "You offer peanuts elsewhere. A truce is formed.",
        role: "connect",
        deltas: { empathy: 0.4 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -5
      },
      {
        id: "chase",
        letter: "C",
        emoji: "🏃",
        text: "Chase it",
        consequence: "You run around the yard yelling. Neighbors watch.",
        role: "avoid",
        deltas: { confidence: -0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_bank_bananas",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Bank Flags the Bananas",
    body: "The bank flags your purchase because you bought an absurd number of bananas.",
    choices: [
      {
        id: "confirm",
        letter: "A",
        emoji: "🍌",
        text: "Confirm it",
        consequence: "You admit to the bananas. The fraud agent laughs.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "deny",
        letter: "B",
        emoji: "🛑",
        text: "Deny everything",
        consequence: "You cancel the card. No bananas, but also no card.",
        role: "avoid",
        deltas: { intelligence: -0.1 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "eat",
        letter: "C",
        emoji: "🍞",
        text: "Make bread",
        consequence: "You bake banana bread. Stress relief.",
        role: "teach",
        deltas: { empathy: 0.3 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_watermelons",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Grocery Order: 40 Watermelons",
    body: "The delivery arrives. It is mostly watermelons. You now own a watermelon empire.",
    choices: [
      {
        id: "party",
        letter: "A",
        emoji: "🍉",
        text: "Melon party",
        consequence: "You invite the street. Everyone gets a melon.",
        role: "connect",
        deltas: { empathy: 0.6 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -50
      },
      {
        id: "return",
        letter: "B",
        emoji: "🚚",
        text: "Send them back",
        consequence: "The driver is annoyed. You get a refund.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 50
      },
      {
        id: "smoothie",
        letter: "C",
        emoji: "🥤",
        text: "Juice them",
        consequence: "You drink melon juice for a week. Sticky.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_smart_alarm",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Smart Home Alarm Trigger",
    body: "A toy triggers the smart home alarm system and your neighbors briefly meet your panic voice.",
    choices: [
      {
        id: "wave",
        letter: "A",
        emoji: "👋",
        text: "Wave and smile",
        consequence: "You pretend it's fine. It is not fine.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "code",
        letter: "B",
        emoji: "🔢",
        text: "Enter code fast",
        consequence: "You silence it. Adrenaline spike.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "explain",
        letter: "C",
        emoji: "🗣️",
        text: "Explain to cop",
        consequence: "The police stop by. You show them the toy. Awkward.",
        role: "connect",
        deltas: { confidence: 0 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_parenting_panel",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "You're Invited to a Parenting Panel",
    body: "Someone thinks you're an expert. You are not, but they booked you anyway.",
    choices: [
      {
        id: "go",
        letter: "A",
        emoji: "🎤",
        text: "Fake it",
        consequence: "You say vague things like 'love is key.' They applaud.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "decline",
        letter: "B",
        emoji: "🚫",
        text: "Decline politely",
        consequence: "You stay home. Imposter syndrome avoided.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "truth",
        letter: "C",
        emoji: "🤷",
        text: "Admit chaos",
        consequence: "You tell stories of failure. The crowd loves the honesty.",
        role: "teach",
        deltas: { empathy: 0.6 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_single_sitter_cancel",
    scope: "parent",
    requiresSingle: true,
    minAge: 0,
    maxAge: 99,
    title: "Babysitter Cancels + Boss Calls",
    body: "The sitter cancels last minute and your boss calls immediately. The timing is cinematic.",
    choices: [
      {
        id: "screen",
        letter: "A",
        emoji: "📺",
        text: "TV babysitter",
        consequence: "Screens save the day. Guilt, but job saved.",
        role: "avoid",
        deltas: { intelligence: -0.1 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "honest",
        letter: "B",
        emoji: "🗣️",
        text: "Tell boss truth",
        consequence: "Boss understands. You reschedule. Human moment.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "bring",
        letter: "C",
        emoji: "👶",
        text: "Kid on call",
        consequence: "Kid makes noise. You mute aggressively.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos_bounce_house",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "The Bounce House Tries to Leave",
    body: "Wind grabs a bounce house like it has somewhere important to be. Everyone chases it politely.",
    choices: [
      {
        id: "chase",
        letter: "A",
        emoji: "🏃",
        text: "Sprint after it",
        consequence: "You tackle the vinyl. Heroic moment.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "watch",
        letter: "B",
        emoji: "🎥",
        text: "Film it",
        consequence: "You get a great video. Someone else catches it.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "yell",
        letter: "C",
        emoji: "📢",
        text: "Shout instructions",
        consequence: "You direct the team. Leadership!",
        role: "teach",
        deltas: { intelligence: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos2_porch_pirate",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Porch Pirate",
    body: "A package you actually needed is marked delivered. Your porch is empty. The universe smiles politely.",
    choices: [
      {
        id: "replace_now",
        letter: "A",
        emoji: "🛒",
        text: "Replace it immediately",
        consequence: "You pay to solve the problem fast. It works. It hurts.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -180
      },
      {
        id: "refund_fight",
        letter: "B",
        emoji: "☎️",
        text: "Fight for a refund",
        consequence: "You spend time and energy turning into a customer-service gladiator.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -10
      },
      {
        id: "cheap_substitute",
        letter: "C",
        emoji: "🧩",
        text: "Buy a cheap substitute and move on",
        consequence: "You compromise hard. It functions. Barely.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -35
      }
    ]
  },
  {
    id: "chaos2_daycare_shutdown",
    scope: "parent",
    minAge: 0,
    maxAge: 5,
    title: "Childcare Shutdown",
    body: "Childcare closes with no notice because of a building problem. Your calendar immediately catches fire.",
    choices: [
      {
        id: "emergency_sitter",
        letter: "A",
        emoji: "💸",
        text: "Pay for an emergency sitter",
        consequence: "It costs a lot, but you keep your day from collapsing completely.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -150
      },
      {
        id: "call_in_favors",
        letter: "B",
        emoji: "📨",
        text: "Call in favors (neighbor/friend/family)",
        consequence: "You lean on your community. It works, but you owe a favor the size of a planet.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: -20
      },
      {
        id: "miss_work",
        letter: "C",
        emoji: "🗓️",
        text: "Miss work and take the hit",
        consequence: "You protect your kid and sacrifice your plans. Real life, loud and messy.",
        role: "support",
        deltas: { empathy: 0.1 },
        loveDelta: 1,
        stressDelta: 5,
        moneyDelta: -80
      }
    ]
  },
  {
    id: "chaos2_poop_to_carpet",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Poop Tracks Into the Carpet",
    body: "You step in dog poop and track it into the house before realizing. The smell arrives like an accusation.",
    choices: [
      {
        id: "pro_clean",
        letter: "A",
        emoji: "🧼",
        text: "Call a professional cleaner",
        consequence: "Fast, effective, expensive. Your home recovers. Your wallet does not.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -200
      },
      {
        id: "diy_scrub",
        letter: "B",
        emoji: "🧽",
        text: "DIY scrub until your soul leaves your body",
        consequence: "You become one with cleaning products. You win… eventually.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: -40
      },
      {
        id: "rug_solution",
        letter: "C",
        emoji: "🧶",
        text: "Buy a rug and pretend it's fine",
        consequence: "You cover the evidence and pray. A bold strategy.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: -60
      }
    ]
  },
  {
    id: "chaos2_neighbor_renovation_leak",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Renovation Leak",
    body: "A neighbor's renovation causes a leak that finds its way into your life. Your ceiling develops a damp personality.",
    choices: [
      {
        id: "insurance_route",
        letter: "A",
        emoji: "🧾",
        text: "Go through insurance and document everything",
        consequence: "You do it \"the right way\" and spend your week filling out forms.",
        role: "teach",
        deltas: { discipline: 0.2, intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: -120
      },
      {
        id: "pay_fast_fix",
        letter: "B",
        emoji: "🛠️",
        text: "Pay for a fast fix to stop the damage",
        consequence: "You stop the bleeding quickly, but you pay for the privilege.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -300
      },
      {
        id: "patch_and_pray",
        letter: "C",
        emoji: "🩹",
        text: "Patch it temporarily and hope",
        consequence: "You buy time with a patch job and a prayer. The stain watches you.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 9,
        moneyDelta: -50
      }
    ]
  },
  {
    id: "chaos2_shattered_phone",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Shattered Phone Screen",
    body: "Your phone hits the ground and the screen turns into a spiderweb of regret.",
    choices: [
      {
        id: "fix_today",
        letter: "A",
        emoji: "📱",
        text: "Fix it today",
        consequence: "You pay for stability. The world becomes readable again.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -180
      },
      {
        id: "cheap_replacement",
        letter: "B",
        emoji: "🧾",
        text: "Buy a cheap replacement",
        consequence: "It works… mostly. Your camera quality enters a new era of sadness.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -80
      },
      {
        id: "live_with_it",
        letter: "C",
        emoji: "🫠",
        text: "Live with it for months",
        consequence: "You develop a new relationship with frustration. The screen cuts you once, just to feel powerful.",
        role: "harm",
        deltas: { discipline: -0.1 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos2_tire_blowout",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Tire Blowout",
    body: "A tire blows out like it's making a statement. The day becomes logistics. Loud, expensive logistics.",
    choices: [
      {
        id: "tow_new_tire",
        letter: "A",
        emoji: "🚚",
        text: "Tow + new tire now",
        consequence: "You solve it decisively. Your wallet screams a little.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: -220
      },
      {
        id: "spare_and_go",
        letter: "B",
        emoji: "🛞",
        text: "Use the spare and limp through the day",
        consequence: "You keep moving with a temporary fix and permanent anxiety.",
        role: "avoid",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: -60
      },
      {
        id: "neighbor_help",
        letter: "C",
        emoji: "🤝",
        text: "Ask for help (and owe a favor)",
        consequence: "Someone helps you. You feel grateful and slightly indebted forever.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 9,
        moneyDelta: -40
      }
    ]
  },
  {
    id: "chaos2_school_fee_surge",
    scope: "child",
    minAge: 6,
    maxAge: 17,
    title: "Surprise School Fee Surge",
    body: "You get a message: a fee is due tomorrow for something your kid \"needs\" for school. It's not small.",
    choices: [
      {
        id: "pay_it",
        letter: "A",
        emoji: "💳",
        text: "Pay it",
        consequence: "You protect the experience and take the financial hit.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -120
      },
      {
        id: "waiver_plan",
        letter: "B",
        emoji: "🧾",
        text: "Ask about a waiver or payment plan",
        consequence: "You advocate. It's awkward. It's also smart.",
        role: "teach",
        deltas: { confidence: 0.1, empathy: 0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -40
      },
      {
        id: "decline_activity",
        letter: "C",
        emoji: "🚫",
        text: "Decline the activity",
        consequence: "You choose survival over extras. Your kid is disappointed and you feel it.",
        role: "harm",
        deltas: { empathy: 0.1 },
        loveDelta: -1,
        stressDelta: 7,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos2_parking_lot_dent",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Parking Lot Dent (No Note)",
    body: "Your car has a new dent. There is no note. Your blood pressure learns a new hobby.",
    choices: [
      {
        id: "repair",
        letter: "A",
        emoji: "🛠️",
        text: "Repair it properly",
        consequence: "You restore the car and pay the price of being responsible.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -350
      },
      {
        id: "live_with_dent",
        letter: "B",
        emoji: "😮‍💨",
        text: "Live with it",
        consequence: "You choose peace over perfection. The dent becomes a personality trait.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -25
      },
      {
        id: "claim_and_buff",
        letter: "C",
        emoji: "📎",
        text: "Try to file a claim and DIY buff",
        consequence: "You spend a weekend arguing with paperwork and polishing a dent like it has feelings.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: -80
      }
    ]
  },
  {
    id: "chaos2_account_lockout",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Account Lockout Spiral",
    body: "Your account gets locked because of \"unusual activity.\" You were the unusual activity. Now everything needs a reset.",
    choices: [
      {
        id: "reset_all",
        letter: "A",
        emoji: "🔐",
        text: "Reset everything and tighten security",
        consequence: "You do the responsible thing and lose half a day to passwords.",
        role: "teach",
        deltas: { discipline: 0.2, intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: -20
      },
      {
        id: "pay_service",
        letter: "B",
        emoji: "🛡️",
        text: "Pay for a security service / manager",
        consequence: "You buy stability. It helps, but you still feel violated by the process.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -60
      },
      {
        id: "ignore_alerts",
        letter: "C",
        emoji: "🙈",
        text: "Ignore it and hope it resolves",
        consequence: "It does not resolve. It evolves.",
        role: "harm",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 9,
        moneyDelta: -150
      }
    ]
  },
  {
    id: "chaos2_school_meeting",
    scope: "child",
    minAge: 13,
    maxAge: 17,
    title: "School Meeting: Tomorrow",
    body: "The school calls and requests a meeting tomorrow. The tone is polite. The implication is not.",
    choices: [
      {
        id: "curious_approach",
        letter: "A",
        emoji: "🫶",
        text: "Approach with curiosity, not rage",
        consequence: "You seek the story before the punishment. Your kid feels safer telling the truth.",
        role: "connect",
        deltas: { empathy: 0.3 },
        loveDelta: 1,
        stressDelta: 8,
        moneyDelta: -40
      },
      {
        id: "hard_consequences",
        letter: "B",
        emoji: "🛑",
        text: "Bring hard consequences",
        consequence: "Clear boundary. Big feelings. It might help… or it might start a war.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 7,
        moneyDelta: -10
      },
      {
        id: "outside_support",
        letter: "C",
        emoji: "🧑‍🏫",
        text: "Get outside support (counselor/tutor/mentor)",
        consequence: "You spend money to buy structure and skills. It helps, but it's a lot.",
        role: "support",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -150
      }
    ]
  },
  {
    id: "chaos2_inlaws_boundary_pop",
    scope: "partner",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "In-Law Boundary Pop Quiz",
    body: "An in-law drops an expectation bomb: \"We're coming by.\" Your partner says it's \"no big deal.\" It is, in fact, a big deal.",
    choices: [
      {
        id: "united_front",
        letter: "A",
        emoji: "🤝",
        text: "Present a united front",
        consequence: "You coordinate, set limits, and somehow remain polite. Relationship points earned.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 7,
        moneyDelta: -40,
        partnerMeterDelta: 4
      },
      {
        id: "let_slide",
        letter: "B",
        emoji: "🕊️",
        text: "Let it slide to keep the peace",
        consequence: "Peace now, resentment later. A classic bundle deal.",
        role: "avoid",
        deltas: { empathy: 0.1 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -20,
        partnerMeterDelta: -2
      },
      {
        id: "fight_about_it",
        letter: "C",
        emoji: "🔥",
        text: "Fight about it",
        consequence: "You argue on hard mode. Nothing gets solved, but feelings sure happen.",
        role: "harm",
        deltas: { empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 9,
        moneyDelta: -10,
        partnerMeterDelta: -6
      }
    ]
  },
  {
    id: "chaos2_single_sick_kid_work",
    scope: "parent",
    requiresSingle: true,
    minAge: 0,
    maxAge: 99,
    title: "Sick Kid + No Backup",
    body: "Your kid gets sent home sick and your day has zero slack. You are the entire backup plan.",
    choices: [
      {
        id: "cancel_work",
        letter: "A",
        emoji: "🏠",
        text: "Cancel and stay home",
        consequence: "You choose care over everything else. It's the right call and it still hurts.",
        role: "support",
        deltas: { empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 7,
        moneyDelta: -120
      },
      {
        id: "ask_neighbor",
        letter: "B",
        emoji: "📨",
        text: "Ask someone for help",
        consequence: "You reach out. It's vulnerable. It's also how humans survive.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: -40
      },
      {
        id: "remote_with_kid",
        letter: "C",
        emoji: "💻",
        text: "Attempt remote work with a sick kid",
        consequence: "You multitask on nightmare difficulty and feel your brain overheat.",
        role: "harm",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 9,
        moneyDelta: -20
      }
    ]
  }
];