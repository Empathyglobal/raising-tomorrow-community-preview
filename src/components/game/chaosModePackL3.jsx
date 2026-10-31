export const CHAOS_EVENTS_L3 = [
  {
    id: "chaos3_robo_vac_diaper",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Robot Vacuum vs. Diaper",
    body: "Your robot vacuum attempts to eat a diaper. It succeeds spiritually. Now it's making a noise that sounds like regret.",
    choices: [
      {
        id: "rescue_mission",
        letter: "A",
        emoji: "🛠️",
        text: "Perform a rescue mission",
        consequence: "You free the vacuum and the diaper. Everyone survives. Barely.",
        role: "teach",
        deltas: { intelligence: 0.3, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -25
      },
      {
        id: "turn_off_forever",
        letter: "B",
        emoji: "🔌",
        text: "Unplug it and banish it",
        consequence: "Peace returns. Dust quietly celebrates.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "name_it",
        letter: "C",
        emoji: "🤡",
        text: "Name it and make it a family villain",
        consequence: "Your kid now blames the vacuum for everything. Honestly? Effective.",
        role: "connect",
        deltas: { confidence: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_baby_monitor_broadcast",
    scope: "parent",
    minAge: 0,
    maxAge: 2,
    title: "Baby Monitor Broadcast",
    body: "For ten seconds, your baby monitor audio connects to a neighbor's speaker. Your lullaby playlist becomes public programming.",
    choices: [
      {
        id: "apologize_neighbor",
        letter: "A",
        emoji: "🙏",
        text: "Apologize and fix it",
        consequence: "You handle it like a grown-up. Your neighbor laughs. You exhale.",
        role: "connect",
        deltas: { empathy: 0.3, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "pretend_confident",
        letter: "B",
        emoji: "😎",
        text: "Pretend it was intentional",
        consequence: "You lean into it like you're hosting a radio station. Confidence through delusion.",
        role: "avoid",
        deltas: { confidence: 0.5 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "upgrade_security",
        letter: "C",
        emoji: "🔒",
        text: "Upgrade / reconfigure everything",
        consequence: "You secure the tech… and lose an evening to passwords.",
        role: "teach",
        deltas: { intelligence: 0.4 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -40
      }
    ]
  },
  {
    id: "chaos3_crayon_everywhere",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Crayon: Unlimited Surfaces",
    body: "One crayon. Infinite ambition. Your walls are now part of a 'big color plan.'",
    choices: [
      {
        id: "mural_corner",
        letter: "A",
        emoji: "🖍️",
        text: "Designate a 'mural corner'",
        consequence: "You contain the art to one zone. Mostly. Some color escapes anyway.",
        role: "teach",
        deltas: { discipline: 0.3, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: -15
      },
      {
        id: "scrub_now",
        letter: "B",
        emoji: "🧽",
        text: "Scrub immediately with dramatic energy",
        consequence: "You remove the evidence. Your kid watches, fascinated by consequences.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 5,
        moneyDelta: -10
      },
      {
        id: "photo_then_clean",
        letter: "C",
        emoji: "📸",
        text: "Photo it, laugh, then clean",
        consequence: "You capture the chaos and keep perspective. A+ emotional regulation.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -10
      }
    ]
  },
  {
    id: "chaos3_toddler_emergency_button",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Emergency Button: Banana Edition",
    body: "Your toddler hits an emergency button and requests urgent assistance for a 'missing banana.' A very patient adult responds.",
    choices: [
      {
        id: "polite_explain",
        letter: "A",
        emoji: "🗣️",
        text: "Explain politely and apologize",
        consequence: "You handle it respectfully. You also hide your phone forever after.",
        role: "teach",
        deltas: { discipline: 0.3, empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: 0
      },
      {
        id: "make_it_game",
        letter: "B",
        emoji: "🕵️",
        text: "Turn it into a 'find the banana' game",
        consequence: "You redirect the panic into play. Banana justice is restored.",
        role: "connect",
        deltas: { confidence: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "lockdown_devices",
        letter: "C",
        emoji: "🔐",
        text: "Lock down all devices",
        consequence: "Strong boundaries. Tech becomes boring. Peace returns.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_glitter_ceiling_fan",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Glitter Ceiling Fan Incident",
    body: "A craft project plus a ceiling fan equals a sparkling weather system inside your home.",
    choices: [
      {
        id: "containment_plan",
        letter: "A",
        emoji: "🧯",
        text: "Contain and clean like a professional",
        consequence: "You go full hazmat-parent. It's exhausting, but effective.",
        role: "teach",
        deltas: { discipline: 0.4, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -20
      },
      {
        id: "laugh_accept",
        letter: "B",
        emoji: "✨",
        text: "Accept you live in sparkle now",
        consequence: "You laugh so you don't cry. Your kid thinks you're legendary.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "ban_crafts",
        letter: "C",
        emoji: "🚫",
        text: "Ban crafts (temporarily)",
        consequence: "The arts community is devastated. The floor is relieved.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_costume_stuck",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Costume Stuck in Reality",
    body: "Your kid wears a full dragon costume and gets stuck in a doorway. The dragon demands help with dignity.",
    choices: [
      {
        id: "gentle_help",
        letter: "A",
        emoji: "🐉",
        text: "Help gently, stay in character",
        consequence: "You rescue the dragon without embarrassment. Truly elite parenting.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.4 },
        loveDelta: 2,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "remove_costume",
        letter: "B",
        emoji: "🧥",
        text: "Remove the costume immediately",
        consequence: "Practicality wins. The dragon mourns their identity briefly.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "teach_safety",
        letter: "C",
        emoji: "🧠",
        text: "Teach 'costume safety rules'",
        consequence: "You introduce safety guidelines. The dragon reluctantly agrees.",
        role: "teach",
        deltas: { intelligence: 0.3, discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_birthday_domino",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Birthday Party Domino Effect",
    body: "One balloon pops. Three kids cry. Someone yells 'it's a warning!' The party briefly becomes a prophecy.",
    choices: [
      {
        id: "calm_story",
        letter: "A",
        emoji: "🫶",
        text: "Calm everyone with a silly story",
        consequence: "You defuse the drama with comedy. Crowd control: unlocked.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 4,
        moneyDelta: -10
      },
      {
        id: "structure_games",
        letter: "B",
        emoji: "🎯",
        text: "Redirect into structured games",
        consequence: "You impose order through activities. It works… mostly.",
        role: "teach",
        deltas: { discipline: 0.4, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -15
      },
      {
        id: "end_early",
        letter: "C",
        emoji: "🚪",
        text: "End it early",
        consequence: "You protect peace. Some parents look relieved.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_treasure_day_keys",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "'Treasure Day' Is Today",
    body: "Your kid announces it's 'Bring a Treasure' day at school… and the treasure they picked is your keys.",
    choices: [
      {
        id: "swap_treasure",
        letter: "A",
        emoji: "🗝️",
        text: "Swap it for a 'special rock'",
        consequence: "You improvise a new treasure. The rock is now legendary.",
        role: "teach",
        deltas: { intelligence: 0.3, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "let_keys",
        letter: "B",
        emoji: "😵",
        text: "Let the keys go (and suffer)",
        consequence: "Bold choice. You spend the day imagining key-related disasters.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -20
      },
      {
        id: "boundary_no",
        letter: "C",
        emoji: "🚫",
        text: "Hard no, explain why",
        consequence: "Boundary held. A dramatic 'but it's TREASURE' speech occurs.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_volcano_alarm",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Volcano Triggers the Alarm",
    body: "Your kid's science volcano is technically safe… but it sets off a smoke detector anyway. The school treats it like an incident.",
    choices: [
      {
        id: "own_it",
        letter: "A",
        emoji: "🧯",
        text: "Own it and apologize",
        consequence: "You model accountability. The staff appreciates your sanity.",
        role: "teach",
        deltas: { empathy: 0.3, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -30
      },
      {
        id: "laugh_story",
        letter: "B",
        emoji: "😂",
        text: "Laugh and reframe it as a story",
        consequence: "You keep it light. Your kid feels proud instead of ashamed.",
        role: "connect",
        deltas: { confidence: 0.5, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "strict_rules",
        letter: "C",
        emoji: "📏",
        text: "Strict rules on projects now",
        consequence: "Order is restored. Creativity sulks in a corner.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_hamster_hvac",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Hamster in the HVAC",
    body: "The class pet escapes and disappears into a vent. The building becomes a tiny wildlife documentary.",
    choices: [
      {
        id: "help_search",
        letter: "A",
        emoji: "🔦",
        text: "Volunteer to help search",
        consequence: "You become an honorary zookeeper. The hamster is eventually found. Probably judging you.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -25
      },
      {
        id: "donate_supplies",
        letter: "B",
        emoji: "🥕",
        text: "Donate supplies and let staff handle it",
        consequence: "You support without spiraling. Practical compassion.",
        role: "teach",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -20
      },
      {
        id: "avoid",
        letter: "C",
        emoji: "🙈",
        text: "Avoid the situation entirely",
        consequence: "You choose peace. The hamster chooses chaos without you.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_book_fair_cart",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Book Fair Buying Frenzy",
    body: "Your kid discovers the book fair and experiences capitalism for the first time. They 'accidentally' add a lot to the cart.",
    choices: [
      {
        id: "pay_and_celebrate",
        letter: "A",
        emoji: "📚",
        text: "Pay and celebrate reading",
        consequence: "You take the hit. Your kid feels supported and wildly literate.",
        role: "connect",
        deltas: { intelligence: 0.5, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 4,
        moneyDelta: -120
      },
      {
        id: "return_some",
        letter: "B",
        emoji: "🧾",
        text: "Return some together",
        consequence: "You teach budgeting without making books feel like punishment.",
        role: "teach",
        deltas: { discipline: 0.4, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -40
      },
      {
        id: "ban_book_fair",
        letter: "C",
        emoji: "🚫",
        text: "Ban the book fair next time",
        consequence: "Financial safety achieved. Your kid mourns the loss of book treasure.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_chaperone_meme",
    scope: "parent",
    minAge: 6,
    maxAge: 10,
    title: "Chaperone Photo Curse",
    body: "You volunteer as chaperone and somehow end up in every single photo. Your face becomes 'the vibe' of the trip.",
    choices: [
      {
        id: "own_it",
        letter: "A",
        emoji: "😎",
        text: "Own it with confidence",
        consequence: "You become a wholesome legend. Your kid is half proud, half horrified.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "ask_remove",
        letter: "B",
        emoji: "🫣",
        text: "Ask politely to remove a few",
        consequence: "You set boundaries without being weird. Mostly successful.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🕊️",
        text: "Ignore it for your sanity",
        consequence: "You choose peace. The photos choose immortality.",
        role: "avoid",
        deltas: { empathy: 0.1 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_tooth_invoice",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Tooth Fairy Invoice",
    body: "Your kid loses a tooth and presents an invoice: 'Base rate + hardship bonus + same-day processing fee.'",
    choices: [
      {
        id: "pay_bonus",
        letter: "A",
        emoji: "🧚",
        text: "Pay the bonus (laughing)",
        consequence: "They feel powerful and start planning their next negotiation immediately.",
        role: "connect",
        deltas: { confidence: 0.4, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -20
      },
      {
        id: "negotiate",
        letter: "B",
        emoji: "🤝",
        text: "Negotiate like it's business",
        consequence: "You teach bargaining and fairness. Your kid is thrilled to spar.",
        role: "teach",
        deltas: { intelligence: 0.4, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -10
      },
      {
        id: "flat_rate",
        letter: "C",
        emoji: "📏",
        text: "Flat rate. No fees.",
        consequence: "Strict but clear. The Tooth Fairy 'union' files a complaint.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos3_screenshot_teacher",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Screenshot to the Teacher",
    body: "A screenshot meant for a friend gets sent to a teacher. It is instantly a big deal in a small way.",
    choices: [
      {
        id: "honesty",
        letter: "A",
        emoji: "🗣️",
        text: "Encourage honest cleanup",
        consequence: "They apologize, explain, and learn. It's uncomfortable — and mature.",
        role: "teach",
        deltas: { discipline: 0.4, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: 0
      },
      {
        id: "damage_control",
        letter: "B",
        emoji: "🧯",
        text: "Do quiet damage control",
        consequence: "You help craft a calm message and remove panic from the equation.",
        role: "connect",
        deltas: { intelligence: 0.3, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "ignore",
        letter: "C",
        emoji: "🙈",
        text: "Ignore it and hope it fades",
        consequence: "It might fade. Or it might become lore.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_wrong_bus_story",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Wrong Bus, Right Story",
    body: "Your kid takes the wrong bus and ends up at the wrong school. They're safe. You, however, briefly leave your body.",
    choices: [
      {
        id: "calm_pickup",
        letter: "A",
        emoji: "🚗",
        text: "Calm pickup + calm debrief",
        consequence: "You turn panic into a lesson in problem-solving and asking for help.",
        role: "teach",
        deltas: { intelligence: 0.4, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 6,
        moneyDelta: 0
      },
      {
        id: "big_reaction",
        letter: "B",
        emoji: "😱",
        text: "Big reaction (you can't help it)",
        consequence: "Your kid learns you care… and also learns fear is contagious.",
        role: "connect",
        deltas: { empathy: 0.1, confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: 0
      },
      {
        id: "systems_fix",
        letter: "C",
        emoji: "🗺️",
        text: "Build a transit plan + backup rules",
        consequence: "You add structure. It reduces chaos… until the next weird thing.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_parent_react_wrong_chat",
    scope: "parent",
    minAge: 11,
    maxAge: 13,
    title: "Accidental Parent Reaction",
    body: "You react to a serious parent-group message with the wrong emoji. The vibe shifts immediately.",
    choices: [
      {
        id: "apologize",
        letter: "A",
        emoji: "🙏",
        text: "Apologize quickly",
        consequence: "You repair it fast. Everyone pretends it never happened. Mostly.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "double_down_joke",
        letter: "B",
        emoji: "🤡",
        text: "Make a joke and move on",
        consequence: "Risky, but it can land. Sometimes chaos is charisma.",
        role: "avoid",
        deltas: { confidence: 0.4 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "mute_chat",
        letter: "C",
        emoji: "🔇",
        text: "Mute the chat forever",
        consequence: "You reclaim peace. You also miss 900 updates about cupcakes.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_cardboard_viral",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Cardboard Project Goes Viral",
    body: "Your kid posts a cardboard invention online and it goes weirdly viral. A local news account wants an interview.",
    choices: [
      {
        id: "support_safely",
        letter: "A",
        emoji: "🎤",
        text: "Support it with clear boundaries",
        consequence: "You help them enjoy it without getting swallowed by the internet.",
        role: "teach",
        deltas: { intelligence: 0.4, discipline: 0.3 },
        loveDelta: 1,
        stressDelta: 5,
        moneyDelta: 0
      },
      {
        id: "shut_it_down",
        letter: "B",
        emoji: "🛑",
        text: "Shut it down immediately",
        consequence: "You protect privacy. Your kid feels crushed. Safety vs joy is hard.",
        role: "boundary",
        deltas: { discipline: 0.4, confidence: -0.2 },
        loveDelta: -1,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "let_them_run",
        letter: "C",
        emoji: "🏃",
        text: "Let them run with it",
        consequence: "They soar… and you become their exhausted manager.",
        role: "connect",
        deltas: { confidence: 0.6 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_rubber_duck_prank",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Senior Prank: Rubber Duck Flood",
    body: "A senior prank releases hundreds of tiny rubber ducks into a hallway. Your teen claims they were 'just there.'",
    choices: [
      {
        id: "accountability",
        letter: "A",
        emoji: "🧾",
        text: "Push accountability + repair",
        consequence: "They help clean up. It's awkward, but it's growth.",
        role: "teach",
        deltas: { discipline: 0.5, empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -50
      },
      {
        id: "laugh_private",
        letter: "B",
        emoji: "😂",
        text: "Laugh privately, set a boundary",
        consequence: "You acknowledge it's funny… and still draw a line.",
        role: "boundary",
        deltas: { discipline: 0.3, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -20
      },
      {
        id: "deny",
        letter: "C",
        emoji: "🙈",
        text: "Deny everything",
        consequence: "Short-term calm, long-term… consequences tend to arrive eventually.",
        role: "avoid",
        deltas: { confidence: 0.2, empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_promposal_flashmob",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Promposal Flash Mob Invite",
    body: "Your teen accidentally invites the entire school to a promposal. Now it's basically an event with attendees.",
    choices: [
      {
        id: "help_scale_down",
        letter: "A",
        emoji: "🧠",
        text: "Help scale it down respectfully",
        consequence: "You save them from a public meltdown and teach planning.",
        role: "teach",
        deltas: { intelligence: 0.4, discipline: 0.2 },
        loveDelta: 1,
        stressDelta: 5,
        moneyDelta: -30
      },
      {
        id: "go_big",
        letter: "B",
        emoji: "🎉",
        text: "Go big and commit",
        consequence: "It becomes iconic. It also becomes exhausting and expensive.",
        role: "connect",
        deltas: { confidence: 0.7 },
        loveDelta: 0,
        stressDelta: 7,
        moneyDelta: -180
      },
      {
        id: "cancel",
        letter: "C",
        emoji: "🛑",
        text: "Cancel it",
        consequence: "You stop the chaos. Your teen mourns the dream. Mixed feelings everywhere.",
        role: "boundary",
        deltas: { discipline: 0.3, confidence: -0.2 },
        loveDelta: -1,
        stressDelta: 4,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_dmv_timewarp",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "DMV Time Warp Appointment",
    body: "You realize the driving test appointment is at 6:00 AM. You don't remember agreeing to this timeline.",
    choices: [
      {
        id: "show_up",
        letter: "A",
        emoji: "⏰",
        text: "Show up and power through",
        consequence: "You sacrifice sleep for progress. Your teen learns commitment.",
        role: "teach",
        deltas: { discipline: 0.4, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: 0
      },
      {
        id: "reschedule",
        letter: "B",
        emoji: "📅",
        text: "Reschedule (and accept delays)",
        consequence: "You protect sanity. It takes longer, but you keep your soul.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "bribe_with_breakfast",
        letter: "C",
        emoji: "🥞",
        text: "Bribe everyone with breakfast afterward",
        consequence: "You buy morale. It works suspiciously well.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 4,
        moneyDelta: -25
      }
    ]
  },
  {
    id: "chaos3_mock_interview_real",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Mock Interview… Actually Real",
    body: "Your teen signs up for a 'mock interview' event. Surprise: it's a real employer scouting talent.",
    choices: [
      {
        id: "prep_fast",
        letter: "A",
        emoji: "🧠",
        text: "Prep fast and hype them up",
        consequence: "They show up ready enough. Confidence grows through action.",
        role: "teach",
        deltas: { confidence: 0.5, intelligence: 0.3 },
        loveDelta: 1,
        stressDelta: 5,
        moneyDelta: 0
      },
      {
        id: "skip",
        letter: "B",
        emoji: "🙈",
        text: "Skip it to avoid pressure",
        consequence: "You protect them from stress… but they wonder 'what if.'",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "let_them_drive",
        letter: "C",
        emoji: "🚀",
        text: "Let them handle it solo",
        consequence: "They rise to the moment. You pace like a haunted house actor.",
        role: "boundary",
        deltas: { confidence: 0.6 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_neighborhood_chat_war",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Neighborhood Group Chat War",
    body: "The neighborhood chat explodes over something tiny. Everyone is writing essays. Someone posts a blurry photo of a raccoon like it's evidence.",
    choices: [
      {
        id: "deescalate",
        letter: "A",
        emoji: "🕊️",
        text: "De-escalate politely",
        consequence: "You bring the temperature down. A few people even calm down. Miracles happen.",
        role: "connect",
        deltas: { empathy: 0.3, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: 0
      },
      {
        id: "mute_forever",
        letter: "B",
        emoji: "🔇",
        text: "Mute it forever",
        consequence: "Your peace returns instantly. You also miss useful info sometimes. Worth it.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "lean_into_drama",
        letter: "C",
        emoji: "🍿",
        text: "Watch like it's entertainment",
        consequence: "You observe the chaos like a nature documentary. Slightly toxic, very relaxing.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: -2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_smart_home_rebellion",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Smart Home Rebellion",
    body: "Your smart lights develop opinions. They turn on at 3 AM, off at dinner, and blink when you sigh.",
    choices: [
      {
        id: "reconfigure",
        letter: "A",
        emoji: "🔧",
        text: "Reconfigure everything",
        consequence: "You defeat the machine… after fighting five apps and twelve passwords.",
        role: "teach",
        deltas: { intelligence: 0.5 },
        loveDelta: 0,
        stressDelta: 6,
        moneyDelta: -35
      },
      {
        id: "go_manual",
        letter: "B",
        emoji: "🕯️",
        text: "Go manual like it's 1997",
        consequence: "You regain control. You also discover you miss convenience.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "laugh_accept",
        letter: "C",
        emoji: "😅",
        text: "Laugh and accept the chaos",
        consequence: "You stop fighting it. The lights continue their artistic journey.",
        role: "avoid",
        deltas: { confidence: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos3_subscription_avalanche",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Subscription Box Avalanche",
    body: "You discover you've been subscribed to something for months. Now a box arrives containing an absurd quantity of tiny stickers.",
    choices: [
      {
        id: "cancel_refund",
        letter: "A",
        emoji: "🧾",
        text: "Cancel and attempt refunds",
        consequence: "You battle customer service and win… a partial victory.",
        role: "teach",
        deltas: { discipline: 0.3, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 5,
        moneyDelta: -60
      },
      {
        id: "embrace_stickers",
        letter: "B",
        emoji: "✨",
        text: "Embrace stickers as a lifestyle",
        consequence: "Everything becomes decorated. Your kid is thrilled. Your furniture is not.",
        role: "connect",
        deltas: { confidence: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: -40
      },
      {
        id: "gift_them",
        letter: "C",
        emoji: "🎁",
        text: "Gift them to teachers / friends",
        consequence: "You convert chaos into goodwill. Social karma unlocked.",
        role: "connect",
        deltas: { empathy: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -20
      }
    ]
  },
  {
    id: "chaos3_partner_volunteers_you",
    scope: "parent",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Volunteer Surprise",
    body: "Your partner casually mentions they 'signed you up' to coordinate an event. There is a spreadsheet. There are expectations.",
    choices: [
      {
        id: "team_up",
        letter: "A",
        emoji: "🤝",
        text: "Team up and do it together",
        consequence: "You turn it into teamwork. Slightly chaotic, but bonding.",
        role: "connect",
        deltas: { empathy: 0.2, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 5,
        moneyDelta: -30,
        partnerMeterDelta: 4
      },
      {
        id: "set_boundary",
        letter: "B",
        emoji: "🛑",
        text: "Set a firm boundary",
        consequence: "You protect your time. It's tense, but honest.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0,
        partnerMeterDelta: -2
      },
      {
        id: "suffer_silently",
        letter: "C",
        emoji: "😵",
        text: "Suffer silently and do it anyway",
        consequence: "You get it done… while quietly inventing resentment.",
        role: "avoid",
        deltas: { confidence: 0.2, empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 7,
        moneyDelta: -25,
        partnerMeterDelta: -5
      }
    ]
  },
  {
    id: "chaos3_single_two_calls",
    scope: "parent",
    requiresSingle: true,
    minAge: 0,
    maxAge: 99,
    title: "Two Calls at Once",
    body: "You get two calls at the same time: one from school, one from work. You briefly consider teleportation.",
    choices: [
      {
        id: "ask_support",
        letter: "A",
        emoji: "📨",
        text: "Ask someone for support",
        consequence: "You build a safety net. It helps — and you feel less alone.",
        role: "connect",
        deltas: { empathy: 0.2, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "handle_both",
        letter: "B",
        emoji: "🏃",
        text: "Handle both, somehow",
        consequence: "You pull off a miracle and immediately need a nap.",
        role: "avoid",
        deltas: { confidence: 0.3 },
        loveDelta: 0,
        stressDelta: 8,
        moneyDelta: 0
      },
      {
        id: "prioritize_one",
        letter: "C",
        emoji: "🧭",
        text: "Prioritize one and accept consequences",
        consequence: "You make the hard call. It's not perfect — it's real life.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      }
    ]
  },
  {
    id: 'l3_car_stolen',
    scope: 'family',
    minAge: 0,
    maxAge: 99,
    title: 'Car Stolen',
    body:
      "You walk outside and your car is gone. Not towed. Not borrowed. Gone.",
    choices: [
      {
        id: 'police_insurance',
        letter: 'A',
        emoji: '🚔',
        text: 'File reports and start the insurance nightmare',
        consequence:
          'You do everything "right." It still takes weeks and costs you anyway.',
        role: 'support',
        moneyDelta: -1200,
        stressDelta: 12,
        loveDelta: 0
      },
      {
        id: 'replace_fast',
        letter: 'B',
        emoji: '💳',
        text: 'Replace it immediately (debt and all)',
        consequence:
          'You regain mobility fast. Your budget catches fire.',
        role: 'neutral',
        moneyDelta: -9000,
        stressDelta: 10,
        loveDelta: 0
      },
      {
        id: 'no_car',
        letter: 'C',
        emoji: '🚌',
        text: 'Try to survive without a car',
        consequence:
          'Every errand becomes a battle. Every schedule falls apart.',
        role: 'harm',
        moneyDelta: -600,
        stressDelta: 16,
        loveDelta: -2
      }
    ]
  },
  {
    id: 'l3_house_fire',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'Kitchen Fire',
    body:
      'A small flame becomes a real fire frighteningly fast. It\'s put out — but the damage is immediate and brutal.',
    choices: [
      {
        id: 'insurance_claim',
        letter: 'A',
        emoji: '🧾',
        text: 'File an insurance claim and live in disruption',
        consequence:
          'You trade money for months of chaos and strangers in your home.',
        role: 'support',
        moneyDelta: -4500,
        stressDelta: 14,
        loveDelta: 0
      },
      {
        id: 'pay_out_of_pocket',
        letter: 'B',
        emoji: '🏚️',
        text: 'Pay out-of-pocket to fix it fast',
        consequence:
          'You buy speed. The price is devastating.',
        role: 'neutral',
        moneyDelta: -14000,
        stressDelta: 11,
        loveDelta: 0
      },
      {
        id: 'make_do',
        letter: 'C',
        emoji: '🍽️',
        text: 'Make do with temporary solutions',
        consequence:
          'It drags on and grinds everyone down day after day.',
        role: 'harm',
        moneyDelta: -2500,
        stressDelta: 16,
        loveDelta: -2
      }
    ]
  },
  {
    id: 'l3_flood_damage',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'Flood Damage',
    body:
      "Water gets in. Then it keeps coming. You save what you can, but you can't save everything.",
    choices: [
      {
        id: 'remediation',
        letter: 'A',
        emoji: '🧑‍🔧',
        text: 'Hire remediation immediately',
        consequence:
          'You stop mold and structural damage — but your bank account screams.',
        role: 'support',
        moneyDelta: -8500,
        stressDelta: 12,
        loveDelta: 0
      },
      {
        id: 'diy_cleanup',
        letter: 'B',
        emoji: '🧤',
        text: 'DIY cleanup and hope it\'s enough',
        consequence:
          'Backbreaking work. It still might not be enough.',
        role: 'neutral',
        moneyDelta: -2200,
        stressDelta: 16,
        loveDelta: -1
      },
      {
        id: 'ignore_mold',
        letter: 'C',
        emoji: '☣️',
        text: 'Delay cleanup (you don\'t have the money)',
        consequence:
          'The house smells wrong. Your stress spikes. Health issues start looming.',
        role: 'harm',
        moneyDelta: -900,
        stressDelta: 18,
        loveDelta: -2
      }
    ]
  },
  {
    id: 'l3_identity_theft',
    scope: 'parent',
    minAge: 0,
    maxAge: 99,
    title: 'Identity Theft',
    body:
      "Accounts you didn't open. Charges you didn't make. Your identity is being worn like a costume by someone else.",
    choices: [
      {
        id: 'lock_everything',
        letter: 'A',
        emoji: '🔒',
        text: 'Freeze credit and lock everything down',
        consequence:
          'You regain some control, but the cleanup becomes a long second job.',
        role: 'support',
        moneyDelta: -600,
        stressDelta: 14,
        loveDelta: 0
      },
      {
        id: 'lawyer_help',
        letter: 'B',
        emoji: '⚖️',
        text: 'Pay for professional help',
        consequence:
          'You get help, but you pay heavily for it.',
        role: 'neutral',
        moneyDelta: -3800,
        stressDelta: 11,
        loveDelta: 0
      },
      {
        id: 'ride_it_out',
        letter: 'C',
        emoji: '🫠',
        text: 'Ride it out and deal with it later',
        consequence:
          'Later becomes worse. Much worse.',
        role: 'harm',
        moneyDelta: -1800,
        stressDelta: 18,
        loveDelta: -2
      }
    ]
  },
  {
    id: 'l3_major_medical',
    scope: 'family',
    minAge: 0,
    maxAge: 99,
    title: 'Major Medical Emergency',
    body:
      "A medical emergency hits your family. Everything else stops. Time, money, and fear take over.",
    choices: [
      {
        id: 'best_care',
        letter: 'A',
        emoji: '🏥',
        text: 'Choose the best care available',
        consequence:
          'You do what you must. The bill is brutal, but you get peace of mind.',
        role: 'support',
        moneyDelta: -12000,
        stressDelta: 12,
        loveDelta: 1
      },
      {
        id: 'coverage_only',
        letter: 'B',
        emoji: '🧾',
        text: 'Stick to what insurance covers',
        consequence:
          'It\'s not nothing — but it still costs you emotionally and financially.',
        role: 'neutral',
        moneyDelta: -6500,
        stressDelta: 14,
        loveDelta: 0
      },
      {
        id: 'delay',
        letter: 'C',
        emoji: '⏳',
        text: 'Delay decisions due to cost',
        consequence:
          'The guilt and stress are crushing.',
        role: 'harm',
        moneyDelta: -2500,
        stressDelta: 18,
        loveDelta: -2
      }
    ]
  },
  {
    id: 'l3_housing_crisis',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'Housing Crisis',
    body:
      "A housing crisis hits: a legal threat, an eviction scare, or a sudden \"you must leave\" situation. It's real and it's immediate.",
    choices: [
      {
        id: 'pay_to_stay',
        letter: 'A',
        emoji: '💸',
        text: 'Pay whatever it takes to stay put',
        consequence:
          'You buy stability at a terrifying price.',
        role: 'neutral',
        moneyDelta: -9000,
        stressDelta: 14,
        loveDelta: 0
      },
      {
        id: 'lawyer',
        letter: 'B',
        emoji: '⚖️',
        text: 'Fight it legally',
        consequence:
          'You enter the legal grind. You might win — but you bleed money and energy.',
        role: 'support',
        moneyDelta: -4200,
        stressDelta: 16,
        loveDelta: 0
      },
      {
        id: 'move_now',
        letter: 'C',
        emoji: '📦',
        text: 'Move immediately',
        consequence:
          'Chaotic, disruptive, and heartbreaking — but you survive.',
        role: 'harm',
        moneyDelta: -6500,
        stressDelta: 18,
        loveDelta: -2
      }
    ]
  },
  {
    id: "chaos3_gas_leak_evacuation",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Gas Leak Evacuation",
    body: "You smell gas. You don't debate it. You evacuate. Suddenly you're living out of a bag and paying for it.",
    choices: [
      {
        id: "hotel_now",
        letter: "A",
        emoji: "🏨",
        text: "Hotel until it's safe",
        consequence: "You buy safety and stability. It's expensive and absolutely worth it.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 13,
        moneyDelta: -450
      },
      {
        id: "stay_with_friend",
        letter: "B",
        emoji: "🤝",
        text: "Stay with a friend/neighbor",
        consequence: "You lean on community. It helps, but it's still disruptive and awkward.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -80
      },
      {
        id: "car_camp",
        letter: "C",
        emoji: "🚗",
        text: "Car-camp to save money",
        consequence: "You save cash, lose comfort, and feel like the universe is testing you personally.",
        role: "harm",
        deltas: { confidence: -0.1 },
        loveDelta: -1,
        stressDelta: 15,
        moneyDelta: -20
      }
    ]
  },
  {
    id: "chaos3_midnight_urgent_care",
    scope: "child",
    minAge: 0,
    maxAge: 10,
    title: "Midnight Urgent Care",
    body: "A scary symptom shows up at night. You're suddenly awake, alarmed, and making decisions with zero sleep.",
    choices: [
      {
        id: "go_now",
        letter: "A",
        emoji: "🚑",
        text: "Go in now",
        consequence: "You choose certainty over waiting. It's stressful, but you don't second-guess it later.",
        role: "support",
        deltas: { empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 14,
        moneyDelta: -800
      },
      {
        id: "nurse_line_plan",
        letter: "B",
        emoji: "📞",
        text: "Call a nurse line and follow a plan",
        consequence: "You get guidance and reduce panic. You still lose the night.",
        role: "teach",
        deltas: { intelligence: 0.1, discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 12,
        moneyDelta: -200
      },
      {
        id: "telehealth",
        letter: "C",
        emoji: "💻",
        text: "Telehealth + emergency pharmacy run",
        consequence: "You patch together help and logistics. It works… barely.",
        role: "avoid",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -350
      }
    ]
  },
  {
    id: "chaos3_burst_pipe_flood",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Burst Pipe Flood",
    body: "A pipe bursts and water goes places water should never go. Your home becomes a disaster documentary.",
    choices: [
      {
        id: "emergency_plumber",
        letter: "A",
        emoji: "🧰",
        text: "Emergency plumber now",
        consequence: "You stop the damage fast, but the bill arrives like a punchline.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -1800
      },
      {
        id: "shut_water_wait",
        letter: "B",
        emoji: "🚰",
        text: "Shut the water and wait for morning",
        consequence: "You contain what you can, but the cleanup still eats your week.",
        role: "avoid",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -900
      },
      {
        id: "patch_and_call",
        letter: "C",
        emoji: "🩹",
        text: "Patch what you can and call for help",
        consequence: "You do triage like a pro. It's still expensive and exhausting.",
        role: "teach",
        deltas: { intelligence: 0.1, discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -1200
      }
    ]
  },
  {
    id: "chaos3_tree_through_roof",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Tree Through the Roof",
    body: "A storm drops a tree onto your roof. The noise is unforgettable. The repairs are worse.",
    choices: [
      {
        id: "insurance_hotel",
        letter: "A",
        emoji: "🏚️",
        text: "Insurance claim + hotel",
        consequence: "You escape immediate danger and enter paperwork purgatory.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -1500
      },
      {
        id: "tarp_and_one_room",
        letter: "B",
        emoji: "🧺",
        text: "Tarp it and live in one room",
        consequence: "You reduce costs and increase stress. Everyone is cranky and damp.",
        role: "harm",
        deltas: { discipline: 0.1 },
        loveDelta: -1,
        stressDelta: 16,
        moneyDelta: -400
      },
      {
        id: "fight_neighbor",
        letter: "C",
        emoji: "⚖️",
        text: "Fight with the neighbor about responsibility",
        consequence: "The conflict becomes its own disaster. Energy drains. Bills rise.",
        role: "harm",
        deltas: { empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 17,
        moneyDelta: -600
      }
    ]
  },
  {
    id: "chaos3_identity_theft",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Identity Theft Nightmare",
    body: "You discover accounts opened in your name. Fixing it becomes a second job you didn't apply for.",
    choices: [
      {
        id: "freeze_and_report",
        letter: "A",
        emoji: "🧊",
        text: "Freeze credit and file reports",
        consequence: "You do everything correctly. It still takes forever and costs you anyway.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -500
      },
      {
        id: "pay_pro_help",
        letter: "B",
        emoji: "🛡️",
        text: "Pay for professional help",
        consequence: "You buy expertise and time. It helps, but it's still infuriating.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -1200
      },
      {
        id: "ignore_it",
        letter: "C",
        emoji: "🙈",
        text: "Ignore it and hope it goes away",
        consequence: "It does not go away. It expands.",
        role: "harm",
        deltas: { confidence: -0.2 },
        loveDelta: -1,
        stressDelta: 18,
        moneyDelta: -3000
      }
    ]
  },
  {
    id: "chaos3_layoff_shock",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Sudden Layoff Shock",
    body: "Work calls. It's short. Your income changes instantly and your brain starts doing survival math.",
    choices: [
      {
        id: "unemployment_budget",
        letter: "A",
        emoji: "📉",
        text: "File for support and cut hard",
        consequence: "You shift into survival mode. It works, but it's a brutal emotional pivot.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -1000
      },
      {
        id: "gig_now",
        letter: "B",
        emoji: "🛵",
        text: "Start gig work immediately",
        consequence: "You hustle hard and hold it together… with your teeth clenched.",
        role: "harm",
        deltas: { confidence: 0.1 },
        loveDelta: -1,
        stressDelta: 18,
        moneyDelta: -600
      },
      {
        id: "ask_help",
        letter: "C",
        emoji: "🤝",
        text: "Ask for help and buy time",
        consequence: "You lean on your network and breathe. Pride takes a hit. Stability returns a little.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -400
      }
    ]
  },
  {
    id: "chaos3_car_totaled",
    scope: "family",
    minAge: 0,
    maxAge: 99,
    title: "Car Totaled (Everyone Safe)",
    body: "A bad accident totals the car. Everyone is physically okay, but your life logistics just exploded.",
    choices: [
      {
        id: "insurance_rental",
        letter: "A",
        emoji: "🚘",
        text: "Insurance + rental car chaos",
        consequence: "You enter the claims maze and pay for temporary mobility.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -1800
      },
      {
        id: "buy_used_fast",
        letter: "B",
        emoji: "💳",
        text: "Buy a used car quickly (debt and all)",
        consequence: "You solve the problem immediately and inherit a new financial burden.",
        role: "harm",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -5000
      },
      {
        id: "go_carless",
        letter: "C",
        emoji: "🚌",
        text: "Go car-less and restructure everything",
        consequence: "You save money long-term but spend the next month in transportation hell.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: -1,
        stressDelta: 18,
        moneyDelta: -800
      }
    ]
  },
  {
    id: "chaos3_black_mold",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Black Mold Discovery",
    body: "You discover black mold in a place you wish you hadn't looked. The fix is expensive and immediate.",
    choices: [
      {
        id: "full_remediation",
        letter: "A",
        emoji: "🧪",
        text: "Full professional remediation",
        consequence: "You solve it properly and feel sick about the bill.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -3000
      },
      {
        id: "temporary_move",
        letter: "B",
        emoji: "📦",
        text: "Temporarily relocate and handle it in stages",
        consequence: "You trade money for time and stability. It's still disruptive.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 17,
        moneyDelta: -1200
      },
      {
        id: "seal_and_consult",
        letter: "C",
        emoji: "🚧",
        text: "Seal off the area and pay for expert guidance",
        consequence: "You contain risk and still pay a lot. Adulting is expensive.",
        role: "teach",
        deltas: { intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 18,
        moneyDelta: -1800
      }
    ]
  },
  {
    id: "chaos3_data_breach_everything",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Data Breach: Everything",
    body: "A data breach hits a service you use for everything. Your accounts become a domino chain of lockouts.",
    choices: [
      {
        id: "security_overhaul",
        letter: "A",
        emoji: "🔐",
        text: "Security overhaul (two-factor, new passwords, all of it)",
        consequence: "You harden your digital life and lose an entire day doing it.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -200
      },
      {
        id: "pay_it_help",
        letter: "B",
        emoji: "🧑‍💻",
        text: "Pay for professional help",
        consequence: "You buy expertise and a faster path out. Still infuriating, but effective.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 13,
        moneyDelta: -800
      },
      {
        id: "hope_for_best",
        letter: "C",
        emoji: "🙃",
        text: "Hope for the best and do the minimum",
        consequence: "The minimum becomes the maximum later.",
        role: "harm",
        deltas: { confidence: -0.1 },
        loveDelta: -1,
        stressDelta: 16,
        moneyDelta: -2000
      }
    ]
  },
  {
    id: "chaos3_kitchen_fire",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Kitchen Fire (Contained)",
    body: "A kitchen fire starts fast and stops fast. You're safe — but the cleanup and replacement costs are not.",
    choices: [
      {
        id: "replace_and_clean",
        letter: "A",
        emoji: "🧯",
        text: "Replace damaged items and deep clean",
        consequence: "You restore the kitchen and feel exhausted by the effort and cost.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -900
      },
      {
        id: "takeout_week",
        letter: "B",
        emoji: "🥡",
        text: "Takeout week while repairs happen",
        consequence: "You buy survival and lose money to convenience.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -400
      },
      {
        id: "insurance_claim",
        letter: "C",
        emoji: "🧾",
        text: "File an insurance claim and wait",
        consequence: "You enter paperwork purgatory while your kitchen stays half-functional.",
        role: "teach",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -700
      }
    ]
  },
  {
    id: "chaos3_power_outage_week",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Power Outage: The Long One",
    body: "The power goes out and stays out. Food spoils. Devices die. Everyone becomes feral faster than expected.",
    choices: [
      {
        id: "hotel_escape",
        letter: "A",
        emoji: "🏨",
        text: "Hotel escape",
        consequence: "You buy comfort and stability while the grid sorts itself out.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -1200
      },
      {
        id: "generator",
        letter: "B",
        emoji: "🔋",
        text: "Generator / backup power",
        consequence: "You create a bubble of functionality and still feel exhausted the whole time.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -600
      },
      {
        id: "ride_it_out",
        letter: "C",
        emoji: "🕯️",
        text: "Ride it out with safety basics",
        consequence: "You endure a week of inconvenience and stress with very little sleep.",
        role: "harm",
        deltas: { confidence: -0.1 },
        loveDelta: -1,
        stressDelta: 17,
        moneyDelta: -200
      }
    ]
  },
  {
    id: "chaos3_eviction_notice",
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Lease Terminated / Eviction Pressure",
    body: "You receive notice that your housing situation is changing fast. The timeline is brutal. The options are worse.",
    choices: [
      {
        id: "move_fast",
        letter: "A",
        emoji: "📦",
        text: "Find a new place fast",
        consequence: "You protect stability at the cost of money and sanity.",
        role: "harm",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 18,
        moneyDelta: -4000
      },
      {
        id: "negotiate_time",
        letter: "B",
        emoji: "🗣️",
        text: "Negotiate for more time",
        consequence: "You buy breathing room, but it still costs you and keeps you anxious.",
        role: "boundary",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 17,
        moneyDelta: -1500
      },
      {
        id: "move_in_family",
        letter: "C",
        emoji: "🏠",
        text: "Temporarily move in with family",
        consequence: "You reduce cost and increase interpersonal tension. Survival is complicated.",
        role: "connect",
        deltas: { empathy: 0.1 },
        loveDelta: -1,
        stressDelta: 16,
        moneyDelta: -800
      }
    ]
  },
  {
    id: "chaos3_dental_emergency",
    scope: "family",
    minAge: 0,
    maxAge: 99,
    title: "Dental Emergency",
    body: "A dental problem becomes urgent and cannot be ignored. The pain is real. The bill is also real.",
    choices: [
      {
        id: "emergency_visit",
        letter: "A",
        emoji: "🦷",
        text: "Emergency dentist visit",
        consequence: "You solve the immediate problem and pay the price of relief.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -1200
      },
      {
        id: "payment_plan",
        letter: "B",
        emoji: "🧾",
        text: "Payment plan and follow-ups",
        consequence: "You manage the cost but extend the stress and appointments.",
        role: "teach",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -700
      },
      {
        id: "delay_short",
        letter: "C",
        emoji: "⏳",
        text: "Delay briefly and patch together care",
        consequence: "You buy time. The stress spikes and you feel the countdown in your bones.",
        role: "harm",
        deltas: { confidence: -0.1 },
        loveDelta: -1,
        stressDelta: 17,
        moneyDelta: -500
      }
    ]
  },
  {
    id: "chaos3_insurance_denied",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Insurance Denies the Claim",
    body: "After everything, insurance denies the claim. The email is calm. You are not.",
    choices: [
      {
        id: "appeal",
        letter: "A",
        emoji: "📎",
        text: "Appeal with documentation",
        consequence: "You build a case like a lawyer. It's exhausting but sometimes it works.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -300
      },
      {
        id: "hire_help",
        letter: "B",
        emoji: "⚖️",
        text: "Hire help to fight it",
        consequence: "You pay for leverage and a little sanity.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -900
      },
      {
        id: "pay_out_of_pocket",
        letter: "C",
        emoji: "💥",
        text: "Pay out of pocket and move on",
        consequence: "You stop the fight by absorbing the damage. It hurts in every way.",
        role: "harm",
        deltas: { confidence: -0.1 },
        loveDelta: -1,
        stressDelta: 17,
        moneyDelta: -2500
      }
    ]
  },
  {
    id: "arc_neighborNemesis_step1_first_note",
    arcId: "neighborNemesis",
    arcStep: 1,
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Nemesis: The First Note",
    body: "A note appears on your door. {neighborName} — your {neighborArchetype} neighbor — is upset about something small, and somehow makes it feel enormous. The note ends with: \"{neighborSignature}\"",
    choices: [
      {
        id: "cookies_intro",
        letter: "A",
        emoji: "🍪",
        text: "Bake something and introduce yourself",
        consequence: "You lead with warmth. It doesn't fix everything, but it lowers the temperature in the room.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.1 },
        loveDelta: 1,
        stressDelta: 8,
        moneyDelta: -30,
        arcEffects: { heatDelta: -1 }
      },
      {
        id: "polite_boundary",
        letter: "B",
        emoji: "🧾",
        text: "Reply politely and set a clear boundary",
        consequence: "You keep it calm and firm. The message is received… and silently evaluated.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 9,
        moneyDelta: 0,
        arcEffects: { heatDelta: 0 }
      },
      {
        id: "paper_trail",
        letter: "C",
        emoji: "📸",
        text: "Start a paper trail and file a counter-complaint",
        consequence: "You choose paperwork warfare. It feels powerful now… and sets the tone for later.",
        role: "harm",
        deltas: { confidence: 0.1, empathy: -0.1 },
        loveDelta: -1,
        stressDelta: 10,
        moneyDelta: -50,
        arcEffects: { heatDelta: 2 }
      }
    ]
  },
  {
    id: "arc_neighborNemesis_step2_renovation_runoff",
    arcId: "neighborNemesis",
    arcStep: 2,
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Nemesis: Renovation Runoff",
    body: "{neighborName}'s \"small project\" turns into a full renovation. Dust, debris, and moisture show up on your side like uninvited guests. When you mention it, they shrug: \"Not our problem.\"",
    choices: [
      {
        id: "emergency_fix_then_bill",
        letter: "A",
        emoji: "🧰",
        text: "Pay for emergency mitigation, then demand reimbursement",
        consequence: "You stop the damage fast. The bill is brutal, and the conversation is worse.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 13,
        moneyDelta: -2200,
        arcEffects: { heatDelta: 1 }
      },
      {
        id: "document_insurance_city",
        letter: "B",
        emoji: "🧾",
        text: "Document everything and go through official channels",
        consequence: "You become a calm, relentless document machine. It's effective… and exhausting.",
        role: "boundary",
        deltas: { intelligence: 0.1, discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -900,
        arcEffects: { heatDelta: 2 }
      },
      {
        id: "diy_patch_peace",
        letter: "C",
        emoji: "🩹",
        text: "DIY patch to keep the peace (for now)",
        consequence: "You patch the problem and swallow the irritation. Peace is cheaper today — not necessarily tomorrow.",
        role: "avoid",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 12,
        moneyDelta: -450,
        arcEffects: { heatDelta: -1 }
      }
    ]
  },
  {
    id: "arc_neighborNemesis_step3_noise_complaint",
    arcId: "neighborNemesis",
    arcStep: 3,
    scope: "family",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Nemesis: The Complaint",
    body: "{neighborName} files an official noise complaint on the one day your home is already loud. A warning shows up with your name on it. While you read it, you step in dog poop — because the universe enjoys layering its jokes.",
    choices: [
      {
        id: "quiet_hours_plan",
        letter: "A",
        emoji: "🕯️",
        text: "Adjust your routine and keep everything documented",
        consequence: "You make small changes and keep receipts. You refuse to give them an easy win.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 12,
        moneyDelta: -80,
        arcEffects: { heatDelta: -1 }
      },
      {
        id: "request_mediation",
        letter: "B",
        emoji: "🫱",
        text: "Request mediation and talk like adults",
        consequence: "You attempt diplomacy. It's awkward, but it's also the only path that isn't war.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.1 },
        loveDelta: 1,
        stressDelta: 13,
        moneyDelta: -250,
        arcEffects: { heatDelta: 0 }
      },
      {
        id: "fight_back",
        letter: "C",
        emoji: "⚔️",
        text: "Fight the complaint and push back hard",
        consequence: "You go on offense. The complaint might disappear… but the feud becomes official.",
        role: "harm",
        deltas: { confidence: 0.2, empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 14,
        moneyDelta: -600,
        arcEffects: { heatDelta: 2 }
      }
    ]
  },
  {
    id: "arc_neighborNemesis_step4_fence_fallout",
    arcId: "neighborNemesis",
    arcStep: 4,
    scope: "home",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Nemesis: Fence & Fallout",
    body: "A shared fence fails spectacularly (and loudly). It topples into your space and nearly hits something important. {neighborName} says, \"Wow. Crazy.\" like you're watching a nature documentary together.",
    choices: [
      {
        id: "fix_now_claim_later",
        letter: "A",
        emoji: "🛠️",
        text: "Fix it now to keep your family safe, then pursue a claim",
        consequence: "You pay for safety first. It's responsible — and painfully expensive.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 15,
        moneyDelta: -4800,
        arcEffects: { heatDelta: 1 }
      },
      {
        id: "lawyer_up",
        letter: "B",
        emoji: "⚖️",
        text: "Lawyer up and go hard",
        consequence: "You hire someone whose job is conflict. It helps… while also making everything more intense.",
        role: "boundary",
        deltas: { discipline: 0.1, confidence: 0.1 },
        loveDelta: -1,
        stressDelta: 16,
        moneyDelta: -2500,
        arcEffects: { heatDelta: 2 }
      },
      {
        id: "patch_and_boundary",
        letter: "C",
        emoji: "🚧",
        text: "Patch it yourself and set a firm boundary",
        consequence: "You do triage and draw a line. It's not pretty, but it stops the bleeding.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 14,
        moneyDelta: -900,
        arcEffects: { heatDelta: -1 }
      }
    ]
  },
  {
    id: "arc_neighborNemesis_step5_final_boss",
    arcId: "neighborNemesis",
    arcStep: 5,
    scope: "family",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Nemesis: Final Boss",
    body: "After years of tension, something has to change. {neighborName} isn't going to magically become easy — and you can't keep living like every day might become a new incident report. You choose your ending.",
    choices: [
      {
        id: "move_for_peace",
        letter: "A",
        emoji: "📦",
        text: "Move. Choose peace.",
        consequence: "You trade money for quiet. The relief is real — and so is the cost.",
        role: "support",
        deltas: { confidence: 0.1 },
        loveDelta: -1,
        stressDelta: 14,
        moneyDelta: -12000,
        arcEffects: { heatDelta: -2, resolve: true }
      },
      {
        id: "legal_victory",
        letter: "B",
        emoji: "🏛️",
        text: "Win on paper and set hard limits",
        consequence: "You push it through formal channels until the rules finally protect you. It works… after it drains you.",
        role: "boundary",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 16,
        moneyDelta: -6500,
        arcEffects: { heatDelta: 0, resolve: true }
      },
      {
        id: "truce_mediator",
        letter: "C",
        emoji: "🕊️",
        text: "Make a truce (mediator + honest talk)",
        consequence: "Against all odds, you build a functional truce. It's not friendship — but it's livable.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 2,
        stressDelta: 12,
        moneyDelta: -1500,
        arcEffects: { heatDelta: -3, resolve: true }
      }
    ]
  }
];