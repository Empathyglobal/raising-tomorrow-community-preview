export const CHAOS_EVENTS_L1 = [
  {
    id: "chaos1_sippy_cup_tsunami",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Sippy Cup Tsunami",
    body: "A sippy cup is shaken like a maraca. Physics wins. Your floor gets a surprise beverage.",
    choices: [
      {
        id: "laugh_mop",
        letter: "A",
        emoji: "😂",
        text: "Laugh, mop, move on",
        consequence: "You treat it like a normal mess, not a crisis. Your kid learns: mistakes are fixable.",
        role: "connect",
        deltas: { confidence: 0.3, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "new_rule",
        letter: "B",
        emoji: "🛑",
        text: "Make a 'no shaking' rule",
        consequence: "Clear boundary. Slightly dramatic, but effective.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "outside_shaker",
        letter: "C",
        emoji: "🧪",
        text: "Give them a 'shake bottle' outside",
        consequence: "You redirect the chaos into science. Everyone wins, mostly.",
        role: "teach",
        deltas: { intelligence: 0.3, discipline: 0.1 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos1_sock_vanish",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "The Great Sock Vanishing",
    body: "You put ten socks in the laundry. You retrieve eight. The missing two are now folklore.",
    choices: [
      {
        id: "buy_more",
        letter: "A",
        emoji: "🧦",
        text: "Buy a new pack and accept reality",
        consequence: "You solve it with money and denial. A classic adult move.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -15
      },
      {
        id: "make_story",
        letter: "B",
        emoji: "📖",
        text: "Invent a silly sock myth",
        consequence: "Your kid becomes emotionally invested in the 'Sock Kingdom.' Weirdly comforting.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "detective_mode",
        letter: "C",
        emoji: "🕵️",
        text: "Go full detective under every couch",
        consequence: "You find one sock… and three crumbs that predate civilization.",
        role: "teach",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_stuffie_parade",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Stuffie Parade Attendance",
    body: "Your toddler lines up stuffed animals for 'roll call' and demands you greet each one properly.",
    choices: [
      {
        id: "greet_all",
        letter: "A",
        emoji: "🎭",
        text: "Commit to the bit",
        consequence: "You greet every stuffed animal like a tiny dignitary. Your kid is delighted.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.3 },
        loveDelta: 2,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "time_limit",
        letter: "B",
        emoji: "⏱️",
        text: "Set a time limit",
        consequence: "Structure enters the chat. Some protest, but it works.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "photo_then_move",
        letter: "C",
        emoji: "📸",
        text: "Take a photo, then transition",
        consequence: "You honor the moment and gently move on. Smooth parenting.",
        role: "teach",
        deltas: { intelligence: 0.2, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_snack_treaty",
    scope: "child",
    minAge: 0,
    maxAge: 2,
    title: "Snack Treaty Negotiations",
    body: "Your toddler proposes a 'treaty' where snacks happen continuously until bedtime.",
    choices: [
      {
        id: "tiny_treaty",
        letter: "A",
        emoji: "🤝",
        text: "Negotiate a tiny treaty",
        consequence: "You agree on snack times. Your toddler feels powerful and slightly less feral.",
        role: "teach",
        deltas: { intelligence: 0.2, discipline: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -5
      },
      {
        id: "hard_no",
        letter: "B",
        emoji: "🚫",
        text: "Say no (politely, firmly)",
        consequence: "Boundary established. A dramatic sigh is performed for the ages.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "distract",
        letter: "C",
        emoji: "🧸",
        text: "Distract with an activity",
        consequence: "You redirect. Snacks are forgotten… for now.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_glitter_sneeze",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Glitter Sneezes",
    body: "A craft project becomes a glitter situation. Glitter is now in places that do not make sense.",
    choices: [
      {
        id: "vacuum_calm",
        letter: "A",
        emoji: "🧹",
        text: "Vacuum calmly, no speeches",
        consequence: "You clean with zen energy. Your kid learns cleanup is normal, not shameful.",
        role: "teach",
        deltas: { discipline: 0.3, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "lean_in",
        letter: "B",
        emoji: "✨",
        text: "Lean in: 'We live here now'",
        consequence: "You laugh it off. Everyone sparkles a little. Emotionally, too.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "ban_glitter",
        letter: "C",
        emoji: "🛑",
        text: "Ban glitter forever",
        consequence: "Harsh but understandable. Your kid mourns the sparkle era.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_cape_to_school",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Cape to School Day (Unplanned)",
    body: "Your kid insists on wearing a cape to school. They say it's 'for bravery.'",
    choices: [
      {
        id: "let_cape",
        letter: "A",
        emoji: "🦸",
        text: "Let the cape happen",
        consequence: "They feel unstoppable. The cape flutters with pure confidence.",
        role: "connect",
        deltas: { confidence: 0.5 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "pocket_cape",
        letter: "B",
        emoji: "🧥",
        text: "Compromise: cape in the backpack",
        consequence: "They can deploy it when needed. Tactical heroism.",
        role: "teach",
        deltas: { intelligence: 0.3, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "no_cape",
        letter: "C",
        emoji: "🚪",
        text: "No cape today",
        consequence: "Boundary held. A tiny villain monologue may occur.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_playground_narrator",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Playground Narrator",
    body: "Your kid narrates the playground like a sports commentator. Loudly. With opinions.",
    choices: [
      {
        id: "coach_kind",
        letter: "A",
        emoji: "🗣️",
        text: "Coach 'kind commentary'",
        consequence: "They learn to hype people up instead of roasting them. Glow-up energy.",
        role: "teach",
        deltas: { empathy: 0.4, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "let_be",
        letter: "B",
        emoji: "🎙️",
        text: "Let them be weird",
        consequence: "It's harmless and honestly pretty funny. A kid giggles. A parent smiles.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "redirect",
        letter: "C",
        emoji: "🧩",
        text: "Redirect to a quieter game",
        consequence: "You steer the energy elsewhere. The narrator takes a brief intermission.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_toothpaste_sculpture",
    scope: "child",
    minAge: 3,
    maxAge: 5,
    title: "Toothpaste Sculpture",
    body: "You walk in to find the entire toothpaste tube used to create a 'mountain range.'",
    choices: [
      {
        id: "clean_together",
        letter: "A",
        emoji: "🧽",
        text: "Clean together, no yelling",
        consequence: "Mess becomes a lesson. Your kid learns cleanup is part of creating.",
        role: "teach",
        deltas: { discipline: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -4
      },
      {
        id: "laugh_photo",
        letter: "B",
        emoji: "📸",
        text: "Laugh, take a photo, then clean",
        consequence: "You capture the chaos and move on. The 'art' lives forever in your camera roll.",
        role: "connect",
        deltas: { confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -4
      },
      {
        id: "new_rule",
        letter: "C",
        emoji: "🚫",
        text: "New rule: toothpaste is supervised",
        consequence: "Strict but fair. Toothpaste privileges are now a thing.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: -4
      }
    ]
  },
  {
    id: "chaos1_permission_slip",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Permission Slip Treasure Hunt",
    body: "Field trip day. The permission slip is 'somewhere safe.' No one knows where.",
    choices: [
      {
        id: "sign_fast",
        letter: "A",
        emoji: "✍️",
        text: "Sign whatever they hand you",
        consequence: "You sign on a clipboard in the parking lot like a professional improviser.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "call_teacher",
        letter: "B",
        emoji: "📞",
        text: "Call the teacher and be honest",
        consequence: "The teacher is used to this. You feel human. They feel relieved.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "systems_fix",
        letter: "C",
        emoji: "🗂️",
        text: "Set up a 'school papers' station",
        consequence: "You build a system. It might even work. For a week.",
        role: "teach",
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -8
      }
    ]
  },
  {
    id: "chaos1_library_timewarp",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Library Book Time Warp",
    body: "A library book returns from the depths of your house… wildly overdue and covered in crumbs.",
    choices: [
      {
        id: "pay_fine",
        letter: "A",
        emoji: "💳",
        text: "Pay the fine and move on",
        consequence: "You support public libraries with your wallet and your shame.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -12
      },
      {
        id: "apology_note",
        letter: "B",
        emoji: "📝",
        text: "Write an apology note with your kid",
        consequence: "Your kid learns accountability. The librarian smiles. You survive.",
        role: "teach",
        deltas: { empathy: 0.4, discipline: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -6
      },
      {
        id: "organize_books",
        letter: "C",
        emoji: "📚",
        text: "Create a 'return shelf' at home",
        consequence: "You invent order. Chaos immediately takes notes for later.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_science_fair_tape",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Science Fair: Mostly Tape",
    body: "It's the night before the science fair. Your kid's project is currently… a concept.",
    choices: [
      {
        id: "all_nighter",
        letter: "A",
        emoji: "🌙",
        text: "Pull a mini all-nighter together",
        consequence: "It's messy, but you finish. Your kid feels supported.",
        role: "connect",
        deltas: { confidence: 0.4, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: -10
      },
      {
        id: "simple_project",
        letter: "B",
        emoji: "🧊",
        text: "A small project done well beats a big project never started.",
        consequence: "A small project done well beats a big project never started.",
        role: "teach",
        deltas: { intelligence: 0.3, confidence: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -5
      },
      {
        id: "let_it_be",
        letter: "C",
        emoji: "🤷",
        text: "Let consequences teach",
        consequence: "They learn planning matters. You also learn guilt has a price.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_lunchbox_diplomacy",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Lunchbox Diplomacy",
    body: "Your kid traded lunches and now you have a note that says: 'We swapped. It was fair.'",
    choices: [
      {
        id: "talk_about_it",
        letter: "A",
        emoji: "🥪",
        text: "Talk about consent + boundaries",
        consequence: "You make it a learning moment without making it a courtroom drama.",
        role: "teach",
        deltas: { empathy: 0.4, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "laugh_off",
        letter: "B",
        emoji: "😅",
        text: "Laugh it off",
        consequence: "Kids do weird kid things. You file this under 'harmless.'",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "no_swaps",
        letter: "C",
        emoji: "🚫",
        text: "Ban lunch swapping",
        consequence: "Rules happen. Your kid is unimpressed by your policies.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_groupchat_translation",
    scope: "parent",
    minAge: 11,
    maxAge: 13,
    title: "Group Chat Translation Failure",
    body: "You try to decode a middle-school group chat screenshot. It reads like ancient prophecy.",
    choices: [
      {
        id: "ask_calmly",
        letter: "A",
        emoji: "🧠",
        text: "Ask calmly what it means",
        consequence: "You stay curious instead of accusatory. Miraculously, you learn something.",
        role: "connect",
        deltas: { empathy: 0.3, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "ignore_it",
        letter: "B",
        emoji: "🙈",
        text: "Ignore it (for your sanity)",
        consequence: "You choose peace. The chat continues without your involvement.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "internet_talk",
        letter: "C",
        emoji: "📵",
        text: "Do a quick digital-safety talk",
        consequence: "You cover basics: screenshots are forever, kindness matters, sleep is real.",
        role: "teach",
        deltas: { discipline: 0.3, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_locker_combo",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Locker Combination Ritual",
    body: "Your kid forgets their locker combo again. The hallway becomes a tiny crisis scene.",
    choices: [
      {
        id: "practice_system",
        letter: "A",
        emoji: "🔐",
        text: "Practice a simple system together",
        consequence: "Reps + routine. It's boring… which is exactly why it works.",
        role: "teach",
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "give_grace",
        letter: "B",
        emoji: "💛",
        text: "Give them grace and a pep talk",
        consequence: "They feel supported. Their combo memory remains mysterious.",
        role: "connect",
        deltas: { confidence: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "stern",
        letter: "C",
        emoji: "🧱",
        text: "Be stern: 'You have to remember'",
        consequence: "Pressure motivates… sometimes. Sometimes it just stresses everyone out.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_meme_presentation",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Meme in the Presentation",
    body: "Your kid accidentally leaves a meme slide in their school presentation. The teacher sees it.",
    choices: [
      {
        id: "own_it",
        letter: "A",
        emoji: "😎",
        text: "Encourage them to own it politely",
        consequence: "They apologize, explain, and move on. Confidence grows.",
        role: "teach",
        deltas: { confidence: 0.5, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "panic",
        letter: "B",
        emoji: "😬",
        text: "Panic together privately",
        consequence: "You both spiral for five minutes, then laugh. Mostly harmless.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "lecture",
        letter: "C",
        emoji: "📚",
        text: "Give a stern 'professionalism' lecture",
        consequence: "They learn. They also roll their eyes so hard it's impressive.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_bracelet_politics",
    scope: "child",
    minAge: 11,
    maxAge: 13,
    title: "Friendship Bracelet Politics",
    body: "Friendship bracelets become serious business. Someone didn't get one and now it's a whole thing.",
    choices: [
      {
        id: "empathy_talk",
        letter: "A",
        emoji: "🫶",
        text: "Talk empathy + inclusion",
        consequence: "You help your kid think about how it feels to be left out.",
        role: "teach",
        deltas: { empathy: 0.5 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "craft_more",
        letter: "B",
        emoji: "🧵",
        text: "Craft a few extra together",
        consequence: "You turn it into a generosity moment. Also: glitter risk.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: -6
      },
      {
        id: "stay_out",
        letter: "C",
        emoji: "🙅",
        text: "Stay out of it",
        consequence: "You let them navigate. Sometimes that's the lesson.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_driving_playlist",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Driving Playlist Diplomacy",
    body: "Your teen refuses to practice driving unless their playlist is 'exactly right.'",
    choices: [
      {
        id: "take_turns",
        letter: "A",
        emoji: "🎶",
        text: "Take turns picking songs",
        consequence: "Compromise achieved. You learn new music you did not ask for.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.3 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "quiet_drive",
        letter: "B",
        emoji: "🤫",
        text: "Quiet drive today",
        consequence: "Focus first. Playlist later. They sigh dramatically, then drive fine.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "let_them_choose",
        letter: "C",
        emoji: "🚗",
        text: "Let them choose the vibe",
        consequence: "They feel in control and drive with confidence. You white-knuckle politely.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_uniform_surprise",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Uniform Surprise",
    body: "Your teen gets a part-time job and the uniform is… aggressively embarrassing.",
    choices: [
      {
        id: "hype_them",
        letter: "A",
        emoji: "👏",
        text: "Hype them up anyway",
        consequence: "You treat it like a badge of honor. They feel supported.",
        role: "connect",
        deltas: { confidence: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "offer_alter",
        letter: "B",
        emoji: "🧵",
        text: "Offer small alterations (if allowed)",
        consequence: "A little tailoring, a little dignity. Practical magic.",
        role: "teach",
        deltas: { intelligence: 0.2, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -15
      },
      {
        id: "tease_lightly",
        letter: "C",
        emoji: "😈",
        text: "Tease lightly (very lightly)",
        consequence: "Risky! If you nail the tone, it's funny. If not… oof.",
        role: "connect",
        deltas: { empathy: -0.1, confidence: 0.1 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_essay_link",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Essay Link Oops",
    body: "Your teen accidentally shares a draft link to their essay with the wrong person. Panic ensues.",
    choices: [
      {
        id: "damage_control",
        letter: "A",
        emoji: "🧯",
        text: "Help with calm damage control",
        consequence: "You fix the link, breathe, and remind them mistakes happen.",
        role: "teach",
        deltas: { intelligence: 0.3, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "let_them_handle",
        letter: "B",
        emoji: "🧍",
        text: "Let them handle it",
        consequence: "They learn self-advocacy. You learn to not refresh your phone constantly.",
        role: "boundary",
        deltas: { confidence: 0.3, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "lecture",
        letter: "C",
        emoji: "📵",
        text: "Lecture about internet mistakes",
        consequence: "Technically correct. Emotionally… less helpful.",
        role: "boundary",
        deltas: { discipline: 0.3, empathy: -0.1 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_senior_photo_prop",
    scope: "child",
    minAge: 14,
    maxAge: 18,
    title: "Senior Photo Prop Debate",
    body: "Your teen insists their senior photo needs a prop. The prop is… questionable.",
    choices: [
      {
        id: "approve_if_safe",
        letter: "A",
        emoji: "📷",
        text: "Approve it (if it's safe)",
        consequence: "They feel seen. Future them might cringe, but that's growth.",
        role: "connect",
        deltas: { confidence: 0.4 },
        loveDelta: 1,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "compromise",
        letter: "B",
        emoji: "🤝",
        text: "Compromise on a different prop",
        consequence: "You guide without crushing the vibe. Skilled diplomacy.",
        role: "teach",
        deltas: { intelligence: 0.2, empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -10
      },
      {
        id: "no_prop",
        letter: "C",
        emoji: "🛑",
        text: "No prop",
        consequence: "You keep it classic. They keep it dramatic.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: -1,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_calendar_doublebook",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Calendar Double-Booked",
    body: "You realize two important things are scheduled at the same time. Past You was optimistic.",
    choices: [
      {
        id: "delegate",
        letter: "A",
        emoji: "📨",
        text: "Delegate one thing",
        consequence: "You ask for help like a functional adult. It works!",
        role: "teach",
        deltas: { intelligence: 0.2, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "do_both",
        letter: "B",
        emoji: "🏃",
        text: "Try to do both",
        consequence: "You sprint through life like an action movie. Exhausting, but impressive.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "cancel_one",
        letter: "C",
        emoji: "🗓️",
        text: "Cancel one and accept it",
        consequence: "You choose sanity. You also feel a tiny pang of guilt. Normal.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_delivery_swap",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Delivery Swap Surprise",
    body: "A package arrives. It's not yours. It's also extremely interesting.",
    choices: [
      {
        id: "return_it",
        letter: "A",
        emoji: "📦",
        text: "Return it properly",
        consequence: "You do the right thing. The universe nods approvingly.",
        role: "teach",
        deltas: { empathy: 0.3, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "neighbor_knock",
        letter: "B",
        emoji: "🚪",
        text: "Bring it to the neighbor",
        consequence: "Neighbor diplomacy! You earn a smile and maybe future goodwill.",
        role: "connect",
        deltas: { confidence: 0.2, empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      },
      {
        id: "peek_then_return",
        letter: "C",
        emoji: "👀",
        text: "Peek at the label… then return it",
        consequence: "You satisfy curiosity without going full goblin.",
        role: "avoid",
        deltas: { intelligence: 0.1 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_self_checkout",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Self-Checkout Symphony",
    body: "The self-checkout machine politely accuses you of wrongdoing. Repeatedly. Loudly.",
    choices: [
      {
        id: "call_attendant",
        letter: "A",
        emoji: "🧑‍💼",
        text: "Call the attendant immediately",
        consequence: "You choose efficiency over pride. Bless.",
        role: "teach",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "fight_machine",
        letter: "B",
        emoji: "🤺",
        text: "Fight the machine with patience",
        consequence: "You win eventually. It costs you a small piece of your soul.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "laugh_leave",
        letter: "C",
        emoji: "😅",
        text: "Laugh and switch lines",
        consequence: "You escape with dignity and a good story.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_neighbor_noise",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor Noise Diplomacy",
    body: "A neighbor mentions the noise. Not angrily. But… pointedly.",
    choices: [
      {
        id: "apologize_plan",
        letter: "A",
        emoji: "🙏",
        text: "Apologize and make a plan",
        consequence: "You lower tension and keep the peace. Adulting achieved.",
        role: "connect",
        deltas: { empathy: 0.3, discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "gift",
        letter: "B",
        emoji: "🍪",
        text: "Offer a small peace offering",
        consequence: "Cookies fix many things. Not everything. But many things.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: -8
      },
      {
        id: "defensive",
        letter: "C",
        emoji: "🧱",
        text: "Get defensive",
        consequence: "You hold your ground. The vibes get worse.",
        role: "boundary",
        deltas: { confidence: 0.1, empathy: -0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_laundry_label_war",
    scope: "parent",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "Laundry Label War",
    body: "You and your partner disagree about what 'cold wash' means. The laundry basket listens silently.",
    choices: [
      {
        id: "agree_system",
        letter: "A",
        emoji: "🧺",
        text: "Agree on a simple system",
        consequence: "You create rules for fabric. Romance, but for chores.",
        role: "teach",
        deltas: { discipline: 0.3, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 4
      },
      {
        id: "let_it_go",
        letter: "B",
        emoji: "🕊️",
        text: "Let it go",
        consequence: "You choose peace. The shirts remain a mystery.",
        role: "avoid",
        deltas: { empathy: 0.1 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0,
        partnerMeterDelta: 1
      },
      {
        id: "argue",
        letter: "C",
        emoji: "🔥",
        text: "Argue like it's a sport",
        consequence: "No one wins. The laundry definitely doesn't win.",
        role: "boundary",
        deltas: { confidence: 0.1, empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -4
      }
    ]
  },
  {
    id: "chaos1_we_both_thought_you",
    scope: "parent",
    requiresPartner: true,
    minAge: 0,
    maxAge: 99,
    title: "'We Both Thought You Did It'",
    body: "A small but important task didn't get done because you both assumed the other person handled it.",
    choices: [
      {
        id: "laugh_reset",
        letter: "A",
        emoji: "😂",
        text: "Laugh and reset expectations",
        consequence: "You turn it into teamwork instead of blame. Growth!",
        role: "connect",
        deltas: { empathy: 0.3, intelligence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 3
      },
      {
        id: "checklist",
        letter: "B",
        emoji: "✅",
        text: "Make a shared checklist",
        consequence: "You build a system. It's not romantic, but it is effective.",
        role: "teach",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        partnerMeterDelta: 2
      },
      {
        id: "blame",
        letter: "C",
        emoji: "🧊",
        text: "Blame each other",
        consequence: "You both feel worse. The task still needs doing.",
        role: "boundary",
        deltas: { empathy: -0.2 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0,
        partnerMeterDelta: -5
      }
    ]
  },
  {
    id: "chaos1_solo_teleportation",
    scope: "parent",
    requiresSingle: true,
    minAge: 0,
    maxAge: 99,
    title: "Solo Parent Teleportation Problem",
    body: "Two things need you at the same time. You consider cloning. Briefly.",
    choices: [
      {
        id: "ask_help",
        letter: "A",
        emoji: "📨",
        text: "Ask someone for help",
        consequence: "You build community instead of suffering alone. That's a win.",
        role: "connect",
        deltas: { empathy: 0.2, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: 0
      },
      {
        id: "do_both",
        letter: "B",
        emoji: "🏃",
        text: "Try to do both anyway",
        consequence: "You pull it off… barely. Superhero fatigue is real.",
        role: "avoid",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "prioritize",
        letter: "C",
        emoji: "🧭",
        text: "Prioritize one and let the other go",
        consequence: "You choose what matters most. It's hard — and it's wise.",
        role: "boundary",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0
      }
    ]
  },
  {
    id: 'l1_overdraft_domino',
    scope: 'parent',
    minAge: 0,
    maxAge: 99,
    title: 'Overdraft Domino',
    body:
      "A tiny auto-payment hits before your paycheck clears. Your balance dips negative and the bank stacks fees like it's a sport.",
    choices: [
      {
        id: 'call_bank',
        letter: 'A',
        emoji: '☎️',
        text: 'Call the bank and plead politely',
        consequence:
          'You get one fee waived, but the call takes forever and your nerves take a hit.',
        role: 'support',
        moneyDelta: -35,
        stressDelta: 4,
        loveDelta: 0
      },
      {
        id: 'transfer_money',
        letter: 'B',
        emoji: '🔁',
        text: 'Move money around and eat the fees',
        consequence:
          'You stabilize things quickly, but it still costs you — and it\'s humiliating.',
        role: 'neutral',
        moneyDelta: -75,
        stressDelta: 3,
        loveDelta: 0
      },
      {
        id: 'ignore',
        letter: 'C',
        emoji: '🫥',
        text: 'Ignore it until next month',
        consequence:
          'The fees compound. The stress sits in your chest all week.',
        role: 'harm',
        moneyDelta: -140,
        stressDelta: 7,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_car_battery_dead',
    scope: 'parent',
    minAge: 0,
    maxAge: 99,
    title: 'Car Battery: Dead on Arrival',
    body:
      "You turn the key. Click. Nothing. The day's schedule instantly becomes a mess.",
    choices: [
      {
        id: 'jumpstart',
        letter: 'A',
        emoji: '🔌',
        text: 'Find a jump and hope it holds',
        consequence:
          'You get moving, but you spend the whole day waiting for it to die again.',
        role: 'neutral',
        moneyDelta: 0,
        stressDelta: 5,
        loveDelta: 0
      },
      {
        id: 'new_battery',
        letter: 'B',
        emoji: '🔋',
        text: 'Buy a new battery today',
        consequence:
          'It hurts financially, but at least you stop bleeding time.',
        role: 'support',
        moneyDelta: -180,
        stressDelta: 3,
        loveDelta: 0
      },
      {
        id: 'tow',
        letter: 'C',
        emoji: '🚚',
        text: 'Tow it to a shop',
        consequence:
          'Expensive and slow. You lose the day and gain a headache.',
        role: 'harm',
        moneyDelta: -320,
        stressDelta: 7,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_daycare_closed',
    scope: 'family',
    minAge: 0,
    maxAge: 12,
    title: 'Unexpected Closure',
    body:
      "You get a message: childcare is closed today. No explanation. No backup provided. The clock starts screaming.",
    choices: [
      {
        id: 'call_in_favor',
        letter: 'A',
        emoji: '🙏',
        text: 'Ask someone for emergency help',
        consequence:
          'You patch it together, but you feel indebted and exhausted.',
        role: 'support',
        moneyDelta: -40,
        stressDelta: 6,
        loveDelta: 0
      },
      {
        id: 'take_day_off',
        letter: 'B',
        emoji: '🗓️',
        text: 'Take the day off work',
        consequence:
          'You keep your child safe, but your finances and workload suffer.',
        role: 'neutral',
        moneyDelta: -120,
        stressDelta: 5,
        loveDelta: 1
      },
      {
        id: 'wing_it',
        letter: 'C',
        emoji: '🧨',
        text: 'Wing it and hope nobody notices',
        consequence:
          'It "works," but the anxiety is brutal and the fallout is looming.',
        role: 'harm',
        moneyDelta: 0,
        stressDelta: 9,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_surprise_medical_bill',
    scope: 'family',
    minAge: 0,
    maxAge: 99,
    title: 'A Bill You Didn\'t Expect',
    body:
      'A medical bill arrives for something you thought was covered. The amount is… not small.',
    choices: [
      {
        id: 'payment_plan',
        letter: 'A',
        emoji: '🧾',
        text: 'Set up a payment plan',
        consequence:
          'You reduce the immediate damage, but you add another monthly weight.',
        role: 'support',
        moneyDelta: -120,
        stressDelta: 4,
        loveDelta: 0
      },
      {
        id: 'pay_full',
        letter: 'B',
        emoji: '💳',
        text: 'Pay it in full just to make it stop',
        consequence:
          'Relief now. Regret later.',
        role: 'neutral',
        moneyDelta: -480,
        stressDelta: 3,
        loveDelta: 0
      },
      {
        id: 'fight_it',
        letter: 'C',
        emoji: '⚖️',
        text: 'Fight it with phone calls and paperwork',
        consequence:
          'You might win, but it costs time, energy, and your sanity.',
        role: 'harm',
        moneyDelta: 0,
        stressDelta: 8,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_plumbing_leak',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'The Slow Leak',
    body:
      "You notice water where water shouldn't be. Not a flood — yet. But you can tell it's headed there.",
    choices: [
      {
        id: 'diy_patch',
        letter: 'A',
        emoji: '🪠',
        text: 'DIY patch and monitor',
        consequence:
          'It holds for now… hopefully.',
        role: 'neutral',
        moneyDelta: -35,
        stressDelta: 5,
        loveDelta: 0
      },
      {
        id: 'call_plumber',
        letter: 'B',
        emoji: '🧑‍🔧',
        text: 'Call a plumber immediately',
        consequence:
          'Expensive, but you stop the problem before it becomes a disaster.',
        role: 'support',
        moneyDelta: -260,
        stressDelta: 3,
        loveDelta: 0
      },
      {
        id: 'ignore_leak',
        letter: 'C',
        emoji: '🙈',
        text: 'Ignore it for now',
        consequence:
          'It gets worse. Much worse. And you knew it would.',
        role: 'harm',
        moneyDelta: 0,
        stressDelta: 9,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_package_stolen',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'Porch Pirate',
    body:
      'A package you were counting on is marked delivered… but your porch is empty.',
    choices: [
      {
        id: 'reorder',
        letter: 'A',
        emoji: '📦',
        text: 'Reorder it immediately',
        consequence:
          'Fast solution, painful cost.',
        role: 'neutral',
        moneyDelta: -120,
        stressDelta: 4,
        loveDelta: 0
      },
      {
        id: 'report',
        letter: 'B',
        emoji: '📝',
        text: 'Report it and chase a refund',
        consequence:
          'You might get your money back, but you\'ll burn time and patience.',
        role: 'support',
        moneyDelta: 0,
        stressDelta: 6,
        loveDelta: 0
      },
      {
        id: 'let_go',
        letter: 'C',
        emoji: '🫠',
        text: 'Let it go and improvise',
        consequence:
          'You swallow the loss, but it leaves a bitter taste.',
        role: 'harm',
        moneyDelta: -60,
        stressDelta: 5,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_work_ambush_meeting',
    scope: 'parent',
    minAge: 0,
    maxAge: 99,
    title: 'The Meeting Ambush',
    body:
      "You're pulled into a \"quick meeting\" that turns into a surprise performance review moment — right when you're already stretched thin.",
    choices: [
      {
        id: 'stay_calm',
        letter: 'A',
        emoji: '🧊',
        text: 'Stay calm and ask for clarity',
        consequence:
          'You keep it professional. It still shakes you.',
        role: 'support',
        moneyDelta: 0,
        stressDelta: 5,
        loveDelta: 0
      },
      {
        id: 'overwork',
        letter: 'B',
        emoji: '🧱',
        text: 'Overcompensate and take on more',
        consequence:
          'It helps your standing… but you pay with exhaustion.',
        role: 'neutral',
        moneyDelta: 0,
        stressDelta: 7,
        loveDelta: -1
      },
      {
        id: 'snap',
        letter: 'C',
        emoji: '💥',
        text: 'Snap and say what you really think',
        consequence:
          'Momentary relief. Long-term consequences.',
        role: 'harm',
        moneyDelta: -200,
        stressDelta: 8,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_school_fundraiser',
    scope: 'child',
    minAge: 5,
    maxAge: 18,
    title: 'Fundraiser Pressure',
    body:
      "Another school fundraiser. Another envelope. Your child's hopeful eyes make it feel personal.",
    choices: [
      {
        id: 'participate_small',
        letter: 'A',
        emoji: '🪙',
        text: 'Contribute a small amount',
        consequence:
          'You participate without breaking your budget. Barely.',
        role: 'support',
        moneyDelta: -40,
        stressDelta: 3,
        loveDelta: 1
      },
      {
        id: 'go_big',
        letter: 'B',
        emoji: '💸',
        text: 'Go big so your child feels proud',
        consequence:
          'It helps your child, but your finances feel it immediately.',
        role: 'neutral',
        moneyDelta: -180,
        stressDelta: 5,
        loveDelta: 2
      },
      {
        id: 'decline',
        letter: 'C',
        emoji: '🧾',
        text: 'Decline and explain boundaries',
        consequence:
          'A mature lesson… and an awkward week.',
        role: 'harm',
        moneyDelta: 0,
        stressDelta: 4,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_phone_shattered',
    scope: 'family',
    minAge: 0,
    maxAge: 99,
    title: 'Shattered Screen',
    body:
      'Someone drops a phone. The screen spiderwebs instantly. You feel your soul leave your body.',
    choices: [
      {
        id: 'cheap_fix',
        letter: 'A',
        emoji: '🩹',
        text: 'Cheap repair / off-brand screen',
        consequence:
          'It works… mostly. You accept some jank.',
        role: 'support',
        moneyDelta: -120,
        stressDelta: 4,
        loveDelta: 0
      },
      {
        id: 'replace',
        letter: 'B',
        emoji: '📱',
        text: 'Replace it',
        consequence:
          'The clean solution. The painful price.',
        role: 'neutral',
        moneyDelta: -650,
        stressDelta: 5,
        loveDelta: 0
      },
      {
        id: 'live_with_it',
        letter: 'C',
        emoji: '🫥',
        text: 'Live with it for now',
        consequence:
          'Every glitch becomes a reminder of how thin your margin is.',
        role: 'harm',
        moneyDelta: 0,
        stressDelta: 6,
        loveDelta: -1
      }
    ]
  },
  {
    id: 'l1_lost_keys',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'Lost Keys',
    body:
      'Keys vanish. You retrace your steps. You tear the house apart. Time evaporates.',
    choices: [
      {
        id: 'locksmith',
        letter: 'A',
        emoji: '🔑',
        text: 'Call a locksmith',
        consequence:
          'Fast, expensive, infuriating — but you get back inside.',
        role: 'neutral',
        moneyDelta: -220,
        stressDelta: 6,
        loveDelta: 0
      },
      {
        id: 'break_in',
        letter: 'B',
        emoji: '🪟',
        text: 'Break in (carefully)',
        consequence:
          'You manage… but now you also have to fix what you damaged.',
        role: 'harm',
        moneyDelta: -180,
        stressDelta: 8,
        loveDelta: -1
      },
      {
        id: 'wait',
        letter: 'C',
        emoji: '🧍',
        text: 'Wait it out and keep searching',
        consequence:
          'It eventually works, but the stress is relentless.',
        role: 'support',
        moneyDelta: 0,
        stressDelta: 7,
        loveDelta: 0
      }
    ]
  },
  {
    id: 'l1_rent_increase',
    scope: 'home',
    minAge: 0,
    maxAge: 99,
    title: 'Rent Increase Notice',
    body:
      'A polite letter informs you your housing costs are going up. The tone is friendly. The impact is not.',
    choices: [
      {
        id: 'negotiate',
        letter: 'A',
        emoji: '🤝',
        text: 'Try to negotiate',
        consequence:
          'You might shave it down a little, but it\'s still a punch.',
        role: 'support',
        moneyDelta: -120,
        stressDelta: 5,
        loveDelta: 0
      },
      {
        id: 'accept',
        letter: 'B',
        emoji: '🧾',
        text: 'Accept and cut elsewhere',
        consequence:
          'You keep stability, but you lose comfort.',
        role: 'neutral',
        moneyDelta: -220,
        stressDelta: 6,
        loveDelta: 0
      },
      {
        id: 'plan_move',
        letter: 'C',
        emoji: '📦',
        text: 'Start planning a move',
        consequence:
          'Possible long-term win. Immediate stress spike.',
        role: 'harm',
        moneyDelta: -300,
        stressDelta: 8,
        loveDelta: -1
      }
    ]
  },
  {
    id: "chaos1_dog_poop_landmine",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Dog Poop Landmine",
    body: "You step on dog poop so fresh it still has opinions. Your shoe makes a sound that should be illegal.",
    choices: [
      {
        id: "make_joke",
        letter: "A",
        emoji: "😂",
        text: "Make it a joke and keep walking",
        consequence: "You narrate it like a comedy bit. Disgusting? Yes. Memorable? Also yes.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "cleanup_now",
        letter: "B",
        emoji: "🧻",
        text: "Do the full scrape + wipe-down",
        consequence: "You handle it immediately with grim determination. Your dignity takes a tiny hit, but the car stays safe.",
        role: "teach",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -3
      },
      {
        id: "denial",
        letter: "C",
        emoji: "🫣",
        text: "Pretend it's just mud until proven otherwise",
        consequence: "Denial works for about eight minutes. Then the smell tells the truth.",
        role: "avoid",
        deltas: { confidence: -0.1 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -5
      }
    ]
  },
  {
    id: "chaos1_leafblower_naptime",
    scope: "home",
    minAge: 0,
    maxAge: 5,
    title: "Leaf Blower: Nap-Time Edition",
    body: "The neighbor fires up a leaf blower precisely when your kid finally falls asleep. It's loud. It's personal.",
    choices: [
      {
        id: "white_noise",
        letter: "A",
        emoji: "🎧",
        text: "White noise and surrender",
        consequence: "You build a tiny fortress of sound and hope the nap survives.",
        role: "avoid",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "polite_request",
        letter: "B",
        emoji: "🙏",
        text: "Politely ask for a time switch",
        consequence: "You attempt neighbor diplomacy with your best calm voice. Risky. Brave.",
        role: "connect",
        deltas: { empathy: 0.3, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "rage_clean",
        letter: "C",
        emoji: "🧹",
        text: "Rage-clean the house quietly",
        consequence: "You can't control the noise, but you can control the baseboards. Apparently.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_party_gift_panic",
    scope: "child",
    minAge: 3,
    maxAge: 10,
    title: "Birthday Gift Panic",
    body: "The party is soon. You realize you forgot the gift. Time starts moving faster out of spite.",
    choices: [
      {
        id: "emergency_store",
        letter: "A",
        emoji: "🛒",
        text: "Emergency store run",
        consequence: "You buy something decent and arrive slightly sweaty but victorious.",
        role: "support",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -20
      },
      {
        id: "handmade_card",
        letter: "B",
        emoji: "✂️",
        text: "Handmade card + heartfelt apology",
        consequence: "You model sincerity over perfection. It's genuinely sweet (and slightly chaotic).",
        role: "teach",
        deltas: { empathy: 0.4 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: -2
      },
      {
        id: "borrow_from_home",
        letter: "C",
        emoji: "🧸",
        text: "Borrow something from your kid's room",
        consequence: "It looks like a gift. It feels like a crime. Your kid notices immediately.",
        role: "avoid",
        deltas: { confidence: -0.1, empathy: -0.1 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_phone_one_percent",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Phone at 1%",
    body: "Your phone hits 1% exactly when you need directions / a code / a school message. The screen dims like it's disappointed in you.",
    choices: [
      {
        id: "borrow_charger",
        letter: "A",
        emoji: "🔌",
        text: "Borrow a charger like a civilized person",
        consequence: "You ask for help. A stranger/neighbor saves the day. Humbling.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "buy_cable",
        letter: "B",
        emoji: "💸",
        text: "Buy an overpriced cable immediately",
        consequence: "You pay the convenience tax and feel emotionally robbed.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -15
      },
      {
        id: "raw_dog_it",
        letter: "C",
        emoji: "🧭",
        text: "Wing it from memory and vibes",
        consequence: "You guess. You take the wrong turn. You learn something about yourself.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_backpack_fossil_snack",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Backpack Fossil Snack",
    body: "You open the backpack and discover a forgotten snack that has achieved a new level of existence.",
    choices: [
      {
        id: "clean_together",
        letter: "A",
        emoji: "🧽",
        text: "Clean it together (no shame)",
        consequence: "Gross, but productive. Your kid learns cleanup is part of life, not a moral failure.",
        role: "teach",
        deltas: { discipline: 0.4, empathy: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: -4
      },
      {
        id: "bin_it_silently",
        letter: "B",
        emoji: "🗑️",
        text: "Throw it out quietly and move on",
        consequence: "You choose peace over a lesson. Sometimes that's wisdom.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "snack_check_system",
        letter: "C",
        emoji: "✅",
        text: "Start a daily 'snack check' ritual",
        consequence: "You build a tiny system that might prevent future backpack archaeology.",
        role: "boundary",
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_theme_day_ambush",
    scope: "child",
    minAge: 6,
    maxAge: 10,
    title: "Theme Day Ambush",
    body: "At drop-off you learn today is Theme Day. Everyone is dressed. Your kid is… not.",
    choices: [
      {
        id: "improvise",
        letter: "A",
        emoji: "🎭",
        text: "Improvise with whatever is in the car",
        consequence: "A hoodie becomes a costume. A hair tie becomes a statement. You are an artist.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "next_time",
        letter: "B",
        emoji: "🗓️",
        text: "Promise you'll crush it next time",
        consequence: "You normalize imperfection. Your kid is mildly annoyed, but okay.",
        role: "teach",
        deltas: { empathy: 0.2, discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "store_run",
        letter: "C",
        emoji: "🏃",
        text: "Do an emergency mini-shopping run",
        consequence: "You spend money to save feelings. It works. You arrive late anyway.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: -12
      }
    ]
  },
  {
    id: "chaos1_neighbor_dog_escape",
    scope: "family",
    minAge: 0,
    maxAge: 99,
    title: "Neighbor's Dog Escape",
    body: "A neighbor's dog slips the leash and bolts. Suddenly the whole street becomes a slow-motion action movie.",
    choices: [
      {
        id: "help_chase",
        letter: "A",
        emoji: "🐕",
        text: "Help catch the dog",
        consequence: "You sprint in public like you meant to. The dog is fast. Your heart is faster.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "block_and_call",
        letter: "B",
        emoji: "🚧",
        text: "Block the route and call the neighbor",
        consequence: "You become traffic control. It's weirdly effective.",
        role: "teach",
        deltas: { discipline: 0.3 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "hands_off",
        letter: "C",
        emoji: "🧍",
        text: "Stay out of it (politely)",
        consequence: "You protect your time and your ankles. The dog does its own thing anyway.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_parking_ticket_surprise",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Parking Ticket Surprise",
    body: "You return to the car and find a parking ticket like a little paper insult.",
    choices: [
      {
        id: "pay_now",
        letter: "A",
        emoji: "💳",
        text: "Pay it immediately and move on",
        consequence: "You choose speed over justice. Your future self thanks you.",
        role: "avoid",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -35
      },
      {
        id: "contest",
        letter: "B",
        emoji: "⚖️",
        text: "Contest it out of pure principle",
        consequence: "You fight the system. You also spend an hour assembling evidence like a detective.",
        role: "boundary",
        deltas: { confidence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "new_system",
        letter: "C",
        emoji: "🧠",
        text: "Set a reminder system for next time",
        consequence: "You build tiny protections against future nonsense. It feels like growth.",
        role: "teach",
        deltas: { discipline: 0.4 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_tween_group_chat",
    scope: "child",
    minAge: 11,
    maxAge: 14,
    title: "Group Chat Emergency",
    body: "Your kid shows you a group chat like it's a crime scene. Someone said something. Screenshots exist. Emotions are loud.",
    choices: [
      {
        id: "listen_validate",
        letter: "A",
        emoji: "🫶",
        text: "Listen first, validate, don't fix yet",
        consequence: "You become a calm landing pad. Your kid feels seen, even if the situation is messy.",
        role: "connect",
        deltas: { empathy: 0.5 },
        loveDelta: 1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "phone_break",
        letter: "B",
        emoji: "📵",
        text: "Suggest a short phone break",
        consequence: "Boundary helps… after the initial outrage. You absorb a dramatic sigh.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: 0
      },
      {
        id: "craft_reply",
        letter: "C",
        emoji: "✍️",
        text: "Help craft a kind response",
        consequence: "You teach communication like it's a life skill (because it is).",
        role: "teach",
        deltas: { intelligence: 0.2, empathy: 0.3 },
        loveDelta: 1,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_teen_overslept",
    scope: "child",
    minAge: 15,
    maxAge: 17,
    title: "Overslept Crisis",
    body: "Your teen oversleeps on a day that really mattered. Everyone is moving at maximum speed and minimum kindness.",
    choices: [
      {
        id: "drive_them",
        letter: "A",
        emoji: "🚗",
        text: "Drive them and keep it calm",
        consequence: "You save the situation without making it a character flaw. Mature. Difficult.",
        role: "support",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "natural_consequence",
        letter: "B",
        emoji: "⏳",
        text: "Let them face the consequences",
        consequence: "They learn time is real. You learn guilt is also real.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "system_plan",
        letter: "C",
        emoji: "⏰",
        text: "Problem-solve a better system together",
        consequence: "Two alarms, a backup plan, and a mutual agreement to not scream. Growth.",
        role: "teach",
        deltas: { discipline: 0.3, intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_crumbs_in_bed",
    scope: "family",
    minAge: 0,
    maxAge: 99,
    title: "Crumbs in Bed",
    body: "You get into bed and feel crumbs. Nobody admits to eating. Everyone swears it wasn't them.",
    choices: [
      {
        id: "crumb_court",
        letter: "A",
        emoji: "⚖️",
        text: "Hold a silly 'crumb court'",
        consequence: "You keep it playful. The crumbs get cleaned, and the vibe survives.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.1 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "no_food_rule",
        letter: "B",
        emoji: "🚫",
        text: "New rule: no food in bedrooms",
        consequence: "A boundary is born. Someone complains like you outlawed joy.",
        role: "boundary",
        deltas: { discipline: 0.4 },
        loveDelta: -1,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "vacuum_and_move_on",
        letter: "C",
        emoji: "🧼",
        text: "Vacuum and move on",
        consequence: "You choose quiet competence. The crumbs do not deserve a meeting.",
        role: "avoid",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_spilled_coffee_forms",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Coffee vs. Paperwork",
    body: "You spill coffee on important forms. The ink runs like it's trying to escape accountability.",
    choices: [
      {
        id: "redo",
        letter: "A",
        emoji: "📝",
        text: "Reprint and redo everything",
        consequence: "You rebuild the paperwork mountain one page at a time. Painful, but clean.",
        role: "teach",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -2
      },
      {
        id: "ask_new_copy",
        letter: "B",
        emoji: "📞",
        text: "Ask the office for a fresh copy",
        consequence: "You outsource the problem like a wise adult. Mild embarrassment, big relief.",
        role: "connect",
        deltas: { empathy: 0.2 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "tape_it",
        letter: "C",
        emoji: "🩹",
        text: "Tape it, scan it, and hope it counts",
        consequence: "You attempt chaos engineering. It might work. It might come back later.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0
      }
    ]
  },
  {
    id: "chaos1_broken_glasses",
    scope: "child",
    minAge: 6,
    maxAge: 17,
    title: "Glasses Snap",
    body: "Your kid's glasses break at the worst possible time. The world is suddenly blurry and everyone is stressed.",
    choices: [
      {
        id: "quick_fix",
        letter: "A",
        emoji: "🛠️",
        text: "Quick fix + schedule replacement",
        consequence: "You do a temporary repair and make a plan. Not perfect, but functional.",
        role: "support",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: -25
      },
      {
        id: "replace_now",
        letter: "B",
        emoji: "👓",
        text: "Replace them ASAP",
        consequence: "You pay for clarity and peace. It hurts, but it solves the problem fast.",
        role: "support",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -140
      },
      {
        id: "lecture",
        letter: "C",
        emoji: "🗣️",
        text: "Lecture about being careful",
        consequence: "You try to prevent the next break with a speech. The speech does not prevent the next break.",
        role: "boundary",
        deltas: { discipline: 0.2, empathy: -0.1 },
        loveDelta: -1,
        stressDelta: 3,
        moneyDelta: -40
      }
    ]
  },
  {
    id: "chaos1_refund_purgatory",
    scope: "parent",
    minAge: 0,
    maxAge: 99,
    title: "Refund Purgatory",
    body: "A refund you're counting on is \"processing\" in a way that feels philosophical. You check the status too many times.",
    choices: [
      {
        id: "call_support",
        letter: "A",
        emoji: "☎️",
        text: "Call customer support and endure the hold",
        consequence: "You fight politely for your own money. It takes forever. You survive.",
        role: "boundary",
        deltas: { discipline: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "dispute",
        letter: "B",
        emoji: "🏦",
        text: "Dispute it through your bank",
        consequence: "More forms, more steps, more adult hoops. But at least it moves.",
        role: "teach",
        deltas: { intelligence: 0.2 },
        loveDelta: 0,
        stressDelta: 4,
        moneyDelta: 0
      },
      {
        id: "eat_loss",
        letter: "C",
        emoji: "😮‍💨",
        text: "Accept the loss and adjust",
        consequence: "You choose emotional peace over financial justice. It stings anyway.",
        role: "avoid",
        deltas: { confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: -40
      }
    ]
  },
  {
    id: "chaos1_sprinkler_ambush",
    scope: "home",
    minAge: 0,
    maxAge: 10,
    title: "Sprinkler Ambush",
    body: "You walk past a neighbor's yard and get hit by sprinklers like the universe is pranking you personally.",
    choices: [
      {
        id: "laugh_splash",
        letter: "A",
        emoji: "💦",
        text: "Laugh and let the kid splash a little",
        consequence: "You turn it into a moment. Everyone is damp and oddly happier.",
        role: "connect",
        deltas: { confidence: 0.2 },
        loveDelta: 1,
        stressDelta: 1,
        moneyDelta: 0
      },
      {
        id: "ask_schedule",
        letter: "B",
        emoji: "🗣️",
        text: "Ask about the sprinkler schedule",
        consequence: "You request a small adjustment like a brave adult. It's awkward, but doable.",
        role: "connect",
        deltas: { empathy: 0.2, confidence: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      },
      {
        id: "avoid_route",
        letter: "C",
        emoji: "🗺️",
        text: "Avoid that route forever",
        consequence: "You reroute your whole life to avoid one yard. Relatable.",
        role: "avoid",
        deltas: { discipline: 0.1 },
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0
      }
    ]
  }
];