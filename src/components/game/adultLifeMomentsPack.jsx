/* components/game/adultLifeMomentsPack.jsx */

// Adult Life Moments Pack
//
// Used for child-free / young adult runs (no kid on the board yet).
// The goal: a yearly popup with real-life (funny, slightly-too-real) adult moments.
//
// Data contract (consumed by GameStateContext):
// - id: string
// - minAdultAge / maxAdultAge: number
// - weight: number (optional, default 1)
// - requires?: { hasPartner?, employed?, inSchool?, hasPets?, sex? }
// - title: string
// - body: string
// - choices: Array<{
//     id, emoji, text, consequence,
//     deltas?: { intelligence?, empathy?, discipline?, confidence? },
//     loveDelta?: number, stressDelta?: number, moneyDelta?: number,
//     babyPressureDelta?: number,
//     moneyCategory?: string
//   }>

export const ADULT_LIFE_MOMENTS = [
  {
    id: 'adult_just_one_drink',
    minAdultAge: 18,
    maxAdultAge: 34,
    weight: 1.2,
    title: '🍻 The "Just One Drink" Trap',
    body: `A friend texts: "One drink?"\nYou know this is a lie.\nYour stress says "no." Your group chat says "character development."`,
    choices: [
      {
        id: 'go_legend',
        emoji: '🍹',
        text: "Go. It's called \"networking.\"",
        consequence: `You wake up with a receipt, a new contact named "DJ maybe??", and a deep respect for water.`,
        stressDelta: +1,
        moneyDelta: -80,
        babyPressureDelta: -2,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'go_soft',
        emoji: '🫧',
        text: 'Go… but leave early and hydrate.',
        consequence: `You socialize. You escape. You drink water like it\'s a side quest reward.`,
        stressDelta: -1,
        moneyDelta: -35,
        babyPressureDelta: -1,
        deltas: { discipline: +0.3, confidence: +0.1 }
      },
      {
        id: 'stay_in',
        emoji: '🛌',
        text: 'Decline. Become one with your blanket.',
        consequence: `Peace. Silence. Your phone buzzes with 37 updates you don't understand.\nYou feel… fine.`,
        stressDelta: -2,
        babyPressureDelta: +1,
        deltas: { discipline: +0.2 }
      }
    ]
  },

  {
    id: 'adult_groupchat_brunch',
    minAdultAge: 18,
    maxAdultAge: 40,
    weight: 1.1,
    title: '🥐 The Group Chat Wants Brunch',
    body: `The group chat proposes brunch.\nFour people reply "down."\nTwo people add a calendar poll.\nOne person asks if "we can make it child-friendly" (for a child you do not own).`,
    choices: [
      {
        id: 'host',
        emoji: '🍳',
        text: 'Host brunch. Be the responsible legend.',
        consequence: `You spend money, you clean, and somehow everyone leaves with leftovers.\nSocial glue: applied.`,
        stressDelta: +1,
        moneyDelta: -45,
        babyPressureDelta: -2,
        deltas: { empathy: +0.3, discipline: +0.2 }
      },
      {
        id: 'attend',
        emoji: '🧃',
        text: 'Attend. Bring a single respectable dish.',
        consequence: `You arrive with pastries.\nYou leave with gossip.\nThis is the ancient exchange.`,
        stressDelta: -1,
        moneyDelta: -20,
        babyPressureDelta: -1,
        deltas: { confidence: +0.2 }
      },
      {
        id: 'ghost',
        emoji: '👻',
        text: 'Say "maybe!" and then vanish.',
        consequence: `Your friends suspect you are either thriving or in a cave.\nYou are actually just tired.`,
        stressDelta: -2,
        babyPressureDelta: +2,
        deltas: { discipline: +0.1 }
      }
    ]
  },

  {
    id: 'adult_rent_jump',
    minAdultAge: 18,
    maxAdultAge: 55,
    weight: 1.0,
    title: '🏠 Your Rent Has Been Updated (Threat)',
    body: `Your landlord emails a "friendly update."\nThe update is: money leaves your body faster now.\nAdulting is so creative.`,
    choices: [
      {
        id: 'negotiate',
        emoji: '🧠',
        text: 'Negotiate calmly like a spreadsheet wizard.',
        consequence: `You present facts, comps, and vibes.\nYou don\'t win fully… but you don\'t lose your dignity.`,
        stressDelta: +1,
        babyPressureDelta: +1,
        deltas: { intelligence: +0.4, confidence: +0.2 }
      },
      {
        id: 'move',
        emoji: '📦',
        text: 'Move. Embrace chaos and cardboard.',
        consequence: `You discover: you own more things than you remember.\nAlso: packing tape is a scam.`,
        stressDelta: +2,
        moneyDelta: -120,
        babyPressureDelta: +1,
        deltas: { discipline: +0.3 }
      },
      {
        id: 'roommate',
        emoji: '🤝',
        text: 'Get a roommate. Become a social experiment.',
        consequence: `You save money.\nYou learn your roommate\'s entire emotional history via dishes.`,
        stressDelta: 0,
        moneyDelta: +60,
        babyPressureDelta: -1,
        deltas: { empathy: +0.2 }
      }
    ]
  },

  {
    id: 'adult_coworker_kids_question',
    minAdultAge: 22,
    maxAdultAge: 60,
    weight: 1.3,
    requires: { employed: true },
    title: '🗣️ The Coworker Question',
    body: `At work, someone asks:\n"So… when are you having kids?"\nThey say it like they\'re asking what time it is.`,
    choices: [
      {
        id: 'joke',
        emoji: '😅',
        text: 'Make a joke and redirect.',
        consequence: `You deploy humor.\nThey laugh.\nYou escape.`,
        stressDelta: -1,
        babyPressureDelta: +2,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'boundary',
        emoji: '🛑',
        text: 'Set a boundary politely.',
        consequence: `You say, "That's personal."\nA miracle occurs: they respect it.`,
        stressDelta: -2,
        babyPressureDelta: -1,
        deltas: { confidence: +0.4, discipline: +0.1 }
      },
      {
        id: 'spiral',
        emoji: '🌀',
        text: 'Smile… then spiral internally later.',
        consequence: `You replay the conversation in the shower like it\'s award season.\nYour brain wins Best Drama.`,
        stressDelta: +2,
        babyPressureDelta: +5,
        deltas: { empathy: +0.1 }
      }
    ]
  },

  {
    id: 'adult_family_groupchat_pressure',
    minAdultAge: 20,
    maxAdultAge: 70,
    weight: 1.2,
    title: '📱 The Family Group Chat (Again)',
    body: `A relative posts:\n"Any updates 👀"\nNo context.\nJust vibes and emotional terrorism.`,
    choices: [
      {
        id: 'ignore',
        emoji: '🙈',
        text: 'Ignore it. Protect your peace.',
        consequence: `Silence is a strategy.\nYour nervous system thanks you.`,
        stressDelta: -2,
        babyPressureDelta: +3,
        deltas: { discipline: +0.2 }
      },
      {
        id: 'reply_funny',
        emoji: '🎭',
        text: 'Reply with a meme and no information.',
        consequence: `You give them content but not access.\nA masterclass.`,
        stressDelta: -1,
        babyPressureDelta: +1,
        deltas: { confidence: +0.2, intelligence: +0.1 }
      },
      {
        id: 'honest',
        emoji: '💬',
        text: 'Be honest: "We\'ll see."',
        consequence: `You open the door a crack.\nThey push it a little.\nBoundaries remain important.`,
        stressDelta: +1,
        babyPressureDelta: +2,
        deltas: { empathy: +0.2 }
      }
    ]
  },

  {
    id: 'adult_baby_shower_onslaught',
    minAdultAge: 23,
    maxAdultAge: 45,
    weight: 1.15,
    title: '🎁 Baby Shower Season',
    body: `Another invite appears.\nTiny socks.\nDiaper cakes.\nEveryone\'s saying "It\'ll be YOU next!" like it\'s a prophecy.`,
    choices: [
      {
        id: 'go_support',
        emoji: '🧸',
        text: 'Go and be supportive (and snack-max).',
        consequence: `You show up with a gift and a brave face.\nYou leave with cake and complicated feelings.`,
        stressDelta: +1,
        moneyDelta: -40,
        babyPressureDelta: +4,
        deltas: { empathy: +0.3 }
      },
      {
        id: 'send_gift',
        emoji: '📦',
        text: 'Send a gift. Skip the emotional boss fight.',
        consequence: `You are present… from a safe distance.\nThis is called "adult tactics."`,
        stressDelta: -1,
        moneyDelta: -35,
        babyPressureDelta: +2,
        deltas: { discipline: +0.2 }
      },
      {
        id: 'decline',
        emoji: '🗓️',
        text: 'Decline. Book self-care instead.',
        consequence: `You take a long walk and remember you are a person, not a timeline.`,
        stressDelta: -2,
        babyPressureDelta: -1,
        deltas: { confidence: +0.2 }
      }
    ]
  },

  {
    id: 'adult_wedding_bouquet',
    minAdultAge: 20,
    maxAdultAge: 38,
    weight: 1.05,
    title: '💐 Bouquet Trauma',
    body: `At a wedding, the DJ announces:\n"Singles to the dance floor!"\nYou consider pretending you\'re not single. Or not human.`,
    choices: [
      {
        id: 'dance',
        emoji: '🪩',
        text: 'Dance. Commit to the bit.',
        consequence: `You dance hard enough that nobody can ask follow-up questions.`,
        stressDelta: -1,
        babyPressureDelta: +1,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'escape',
        emoji: '🚪',
        text: 'Escape to the snack table.',
        consequence: `You become one with the spring rolls.\nThis is strategic positioning.`,
        stressDelta: -2,
        babyPressureDelta: +2,
        deltas: { discipline: +0.1 }
      },
      {
        id: 'catch',
        emoji: '🧲',
        text: 'Catch the bouquet. Become chaos.',
        consequence: `You catch it.\nEveryone screams.\nYou laugh too loudly.\nYou are now folklore.`,
        stressDelta: +1,
        babyPressureDelta: +3,
        deltas: { confidence: +0.4 }
      }
    ]
  },

  {
    id: 'adult_exam_week',
    minAdultAge: 18,
    maxAdultAge: 35,
    weight: 1.0,
    requires: { inSchool: true },
    title: '📚 Exam Week: The Villain Arc',
    body: `You have exams.\nYour brain has opinions.\nSleep becomes theoretical.`,
    choices: [
      {
        id: 'study_plan',
        emoji: '🗂️',
        text: 'Make a schedule and follow it.',
        consequence: `You become a disciplined machine.\nA little scary, but effective.`,
        stressDelta: +1,
        babyPressureDelta: -1,
        deltas: { discipline: +0.5, intelligence: +0.3 }
      },
      {
        id: 'cram',
        emoji: '⚡',
        text: 'Cram with caffeine and hope.',
        consequence: `You learn 40% of the material in 10% of the time.\nNature is healing (???).`,
        stressDelta: +2,
        babyPressureDelta: +1,
        deltas: { intelligence: +0.4 }
      },
      {
        id: 'selfcare',
        emoji: '🧘',
        text: 'Prioritize sleep and mental health.',
        consequence: `You are not the top scorer.\nBut you remain a person.\nThis is a win.`,
        stressDelta: -1,
        babyPressureDelta: -1,
        deltas: { empathy: +0.2, discipline: +0.2 }
      }
    ]
  },

  {
    id: 'adult_promotion',
    minAdultAge: 22,
    maxAdultAge: 65,
    weight: 0.9,
    requires: { employed: true },
    title: '📈 Promotion Opportunity',
    body: `A new role opens.\nMore money.\nMore responsibility.\nMore meetings that should've been emails.`,
    choices: [
      {
        id: 'go_for_it',
        emoji: '🏆',
        text: 'Go for it.',
        consequence: `You sharpen your resume and your elbows.\nYou feel capable. Slightly feral.`,
        stressDelta: +1,
        moneyDelta: +120,
        babyPressureDelta: +1,
        deltas: { confidence: +0.4, discipline: +0.2 }
      },
      {
        id: 'wait',
        emoji: '⏳',
        text: 'Wait. Your bandwidth is cooked.',
        consequence: `You choose peace.\nFuture-you nods respectfully.`,
        stressDelta: -1,
        babyPressureDelta: +1,
        deltas: { discipline: +0.2 }
      },
      {
        id: 'negotiate',
        emoji: '🤝',
        text: 'Go for it — but negotiate hard.',
        consequence: `You ask for the number you deserve.\nYour voice shakes a little.\nYou do it anyway.`,
        stressDelta: +2,
        moneyDelta: +160,
        babyPressureDelta: +2,
        deltas: { confidence: +0.5 }
      }
    ]
  },

  {
    id: 'adult_layoff_rumor',
    minAdultAge: 22,
    maxAdultAge: 65,
    weight: 0.9,
    requires: { employed: true },
    title: '📉 Layoff Rumors',
    body: `The office is "quiet quiet."\nYour manager is "busy busy."\nYour stomach is "no no."`,
    choices: [
      {
        id: 'update_resume',
        emoji: '🧾',
        text: 'Update resume and quietly apply.',
        consequence: `You become a stealth professional.\nFear turns into action.`,
        stressDelta: +1,
        babyPressureDelta: -1,
        deltas: { discipline: +0.4, intelligence: +0.2 }
      },
      {
        id: 'panic',
        emoji: '🔥',
        text: 'Panic. Doomscroll job boards at 2am.',
        consequence: `You learn 400 new acronyms.\nNone of them soothe you.`,
        stressDelta: +3,
        babyPressureDelta: +2,
        deltas: { empathy: +0.1 }
      },
      {
        id: 'talk',
        emoji: '🗣️',
        text: 'Ask directly (calmly).',
        consequence: `You get partial clarity.\nYour nervous system stops doing parkour.`,
        stressDelta: -1,
        babyPressureDelta: 0,
        deltas: { confidence: +0.3 }
      }
    ]
  },

  {
    id: 'adult_partner_checkin',
    minAdultAge: 22,
    maxAdultAge: 55,
    weight: 1.1,
    requires: { hasPartner: true },
    title: '💞 "So… Where Is This Going?"',
    body: `Your partner suggests a "future talk."\nA normal adult conversation.\nYour heart interprets it as a boss battle.`,
    choices: [
      {
        id: 'talk_open',
        emoji: '🗺️',
        text: 'Talk openly and make a loose plan.',
        consequence: `You feel seen.\nAlso slightly terrified.\nBut mostly seen.`,
        stressDelta: +1,
        babyPressureDelta: +3,
        deltas: { empathy: +0.4, confidence: +0.2 }
      },
      {
        id: 'delay',
        emoji: '🫠',
        text: 'Delay: "Can we talk after this week?"',
        consequence: `You buy time.\nTime buys anxiety.\nInterest rates vary.`,
        stressDelta: +2,
        babyPressureDelta: +2,
        deltas: { discipline: -0.1 }
      },
      {
        id: 'boundary',
        emoji: '🧱',
        text: 'Set boundaries and clarify values.',
        consequence: `You don\'t promise what you can\'t deliver.\nRespect grows quietly.`,
        stressDelta: -1,
        babyPressureDelta: -2,
        deltas: { confidence: +0.4, discipline: +0.2 }
      }
    ]
  },

  {
    id: 'adult_dating_app',
    minAdultAge: 18,
    maxAdultAge: 50,
    weight: 1.0,
    requires: { hasPartner: false },
    title: '📲 Dating App: The Algorithm Judges You',
    body: `You open a dating app.\nThe first profile says "Looking for someone who loves adventure."\nThey mean brunch.`,
    choices: [
      {
        id: 'take_seriously',
        emoji: '📝',
        text: 'Update profile like it\'s a grant proposal.',
        consequence: `You become both authentic and marketable.\nA rare combo.`,
        stressDelta: +1,
        babyPressureDelta: +1,
        deltas: { intelligence: +0.3, confidence: +0.2 }
      },
      {
        id: 'go_funny',
        emoji: '😂',
        text: 'Make it funny. Let the right people find you.',
        consequence: `You get fewer matches.\nBut the matches you get are elite.`,
        stressDelta: -1,
        babyPressureDelta: -1,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'delete',
        emoji: '🗑️',
        text: 'Delete app. Touch grass instead.',
        consequence: `You take a walk.\nYou remember: the sun is real.\nPeople exist outside rectangles.`,
        stressDelta: -2,
        babyPressureDelta: +2,
        deltas: { discipline: +0.2 }
      }
    ]
  },

  {
    id: 'adult_fertility_ad',
    minAdultAge: 28,
    maxAdultAge: 46,
    weight: 1.0,
    title: '🧬 The Fertility Ad Finds You',
    body: `You see an ad about fertility timelines.\nIt feels… personal.\nRude, actually.`,
    choices: [
      {
        id: 'research',
        emoji: '🔎',
        text: 'Research options calmly.',
        consequence: `You learn facts.\nFacts reduce chaos.\nSometimes.`,
        stressDelta: +1,
        babyPressureDelta: +4,
        deltas: { intelligence: +0.4, discipline: +0.2 }
      },
      {
        id: 'mute',
        emoji: '🔕',
        text: 'Mute/Block. Protect your brain.',
        consequence: `You curate your inputs.\nYour peace increases.\nSo does your stubbornness.`,
        stressDelta: -2,
        babyPressureDelta: -2,
        deltas: { discipline: +0.2 }
      },
      {
        id: 'spiral',
        emoji: '🫣',
        text: 'Spiral and text a friend "lol anyway".',
        consequence: `Your friend sends support.\nYou pretend it\'s memes.\nIt\'s support.`,
        stressDelta: +2,
        babyPressureDelta: +6,
        deltas: { empathy: +0.2 }
      }
    ]
  },

  {
    id: 'adult_therapy',
    minAdultAge: 18,
    maxAdultAge: 80,
    weight: 0.9,
    title: '🛋️ Therapy Session: The Plot Thickens',
    body: `You book therapy.\nYou start with "I\'m fine."\nYou end with "Oh."`,
    choices: [
      {
        id: 'commit',
        emoji: '🧠',
        text: 'Commit for a few sessions.',
        consequence: `You unpack a suitcase you didn\'t know you were carrying.\nIt\'s heavy. It\'s helpful.`,
        stressDelta: -2,
        moneyDelta: -60,
        babyPressureDelta: -3,
        deltas: { empathy: +0.4, intelligence: +0.2 }
      },
      {
        id: 'journal',
        emoji: '📓',
        text: 'Skip therapy. Start journaling instead.',
        consequence: `You write like nobody\'s grading.\nYour brain feels quieter.`,
        stressDelta: -1,
        babyPressureDelta: -1,
        deltas: { discipline: +0.2, intelligence: +0.2 }
      },
      {
        id: 'avoid',
        emoji: '🚫',
        text: 'Avoid feelings. Become productivity.',
        consequence: `You get a lot done.\nYour emotions form a union and schedule a meeting.`,
        stressDelta: +2,
        babyPressureDelta: +2,
        deltas: { discipline: +0.2, empathy: -0.1 }
      }
    ]
  },

  {
    id: 'adult_spontaneous_trip',
    minAdultAge: 18,
    maxAdultAge: 55,
    weight: 0.95,
    title: '✈️ Spontaneous Trip Invitation',
    body: `A friend invites you on a last-minute trip.\nYour wallet says "absolutely not."\nYour soul says "absolutely yes."`,
    choices: [
      {
        id: 'go',
        emoji: '🌴',
        text: 'Go. Make memories.',
        consequence: `You come back tired but happier.\nYour camera roll becomes 87% sunsets.`,
        stressDelta: -1,
        moneyDelta: -150,
        babyPressureDelta: -2,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'mini',
        emoji: '🚗',
        text: 'Do a cheaper local version.',
        consequence: `You hack the experience.\nYour bank account exhales.`,
        stressDelta: -1,
        moneyDelta: -40,
        babyPressureDelta: -1,
        deltas: { intelligence: +0.2, discipline: +0.2 }
      },
      {
        id: 'decline',
        emoji: '🧾',
        text: 'Decline and save money.',
        consequence: `You\'re responsible.\nAlso slightly jealous.\nBoth can be true.`,
        stressDelta: 0,
        moneyDelta: +60,
        babyPressureDelta: +1,
        deltas: { discipline: +0.3 }
      }
    ]
  },

  {
    id: 'adult_pet_adoption',
    minAdultAge: 18,
    maxAdultAge: 60,
    weight: 0.9,
    requires: { hasPets: false },
    title: '🐶 Pet Adoption Spiral',
    body: `You "just look" at adoptable pets.\nTen minutes later you've named three dogs and planned your life around them.`,
    choices: [
      {
        id: 'adopt',
        emoji: '🏡',
        text: 'Adopt. Become a loving provider.',
        consequence: `You gain a tiny roommate with big opinions.\nYour home is louder. Your heart is fuller.`,
        stressDelta: +1,
        moneyDelta: -50,
        babyPressureDelta: -3,
        deltas: { empathy: +0.4, discipline: +0.1 }
      },
      {
        id: 'foster',
        emoji: '🤲',
        text: 'Foster first. Test the vibes.',
        consequence: `You do a trial run.\nYou still end up emotionally attached.\nOf course you do.`,
        stressDelta: 0,
        moneyDelta: -20,
        babyPressureDelta: -2,
        deltas: { empathy: +0.3 }
      },
      {
        id: 'close_tab',
        emoji: '❌',
        text: 'Close the tab. Too powerful.',
        consequence: `You resist.\nThis is discipline.\nAlso fear.`,
        stressDelta: -1,
        babyPressureDelta: +1,
        deltas: { discipline: +0.3 }
      }
    ]
  },

  {
    id: 'adult_holiday_table',
    minAdultAge: 20,
    maxAdultAge: 70,
    weight: 1.0,
    title: '🦃 Holiday Table Interrogation',
    body: `At a family meal, someone asks three questions in a row:\n1) Work?\n2) Partner?\n3) Babies?\nYou are a person, not a survey.`,
    choices: [
      {
        id: 'deflect',
        emoji: '🎯',
        text: 'Deflect with jokes and food.',
        consequence: `You redirect like a professional.\nAlso you eat more potatoes.\nWin-win.`,
        stressDelta: -1,
        babyPressureDelta: +2,
        deltas: { confidence: +0.2 }
      },
      {
        id: 'truth',
        emoji: '🧊',
        text: 'Answer honestly and set limits.',
        consequence: `You speak calmly.\nThey get awkward.\nPeace enters the chat.`,
        stressDelta: -2,
        babyPressureDelta: -1,
        deltas: { confidence: +0.4, discipline: +0.1 }
      },
      {
        id: 'storm',
        emoji: '🌩️',
        text: 'Get snappy. You\'re tired of this.',
        consequence: `It feels good for 4 seconds.\nThen everyone remembers forever.`,
        stressDelta: +2,
        babyPressureDelta: +3,
        deltas: { confidence: +0.2, empathy: -0.1 }
      }
    ]
  },

  {
    id: 'adult_adoption_info_night',
    minAdultAge: 28,
    maxAdultAge: 60,
    weight: 0.7,
    title: '🧾 "Adoption Info Night" Flyer',
    body: `You see a flyer for an adoption info night.\nIt doesn't feel like pressure.\nIt feels like… an option.`,
    choices: [
      {
        id: 'attend',
        emoji: '🪑',
        text: 'Attend and learn.',
        consequence: `You leave with knowledge.\nAnd a surprising amount of feelings.`,
        stressDelta: +1,
        babyPressureDelta: +3,
        deltas: { intelligence: +0.4, empathy: +0.2 }
      },
      {
        id: 'save',
        emoji: '📌',
        text: 'Save it for later.',
        consequence: `You\'re not ready, but you\'re curious.\nThat counts.`,
        stressDelta: 0,
        babyPressureDelta: +1,
        deltas: { discipline: +0.1 }
      },
      {
        id: 'ignore',
        emoji: '🫥',
        text: 'Ignore it. Not today.',
        consequence: `You protect your bandwidth.\nBandwidth is sacred.`,
        stressDelta: -1,
        babyPressureDelta: -1,
        deltas: { discipline: +0.2 }
      }
    ]
  },

  {
    id: 'adult_midlife_purchase',
    minAdultAge: 35,
    maxAdultAge: 60,
    weight: 0.6,
    title: '🚗 Retail Therapy, But Make It Expensive',
    body: `You consider buying something dramatic.\nA watch. A motorcycle. A chair that costs more than rent.\nYou ask yourself: "Is this growth or a cry for help?"`,
    choices: [
      {
        id: 'buy_small',
        emoji: '🪴',
        text: 'Buy something small and meaningful.',
        consequence: `You scratch the itch without lighting your budget on fire.\nMaturity!`,
        stressDelta: -1,
        moneyDelta: -30,
        babyPressureDelta: -1,
        deltas: { discipline: +0.2 }
      },
      {
        id: 'buy_big',
        emoji: '💸',
        text: 'Buy the dramatic thing.',
        consequence: `You feel alive.\nYour bank account faints.\nYou wave at it from afar.`,
        stressDelta: +1,
        moneyDelta: -200,
        babyPressureDelta: -2,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'no_buy',
        emoji: '🧊',
        text: 'Do not buy. Sit with the feelings.',
        consequence: `You raw-dog reality.\nIt's hard.\nYou survive.`,
        stressDelta: +2,
        babyPressureDelta: +1,
        deltas: { discipline: +0.3 }
      }
    ]
  },

  {
    id: 'adult_acceptance_arc',
    minAdultAge: 46,
    maxAdultAge: 80,
    weight: 0.7,
    title: '🌅 The Acceptance Arc',
    body: `You notice something new:\nThe pressure isn\'t as loud as it used to be.\nNot because it was "solved."\nBecause you\'ve grown around it.`,
    choices: [
      {
        id: 'mentor',
        emoji: '🫶',
        text: 'Mentor someone younger.',
        consequence: `You share what you've learned.\nYou realize you are wiser than you feel.`,
        stressDelta: -2,
        babyPressureDelta: -4,
        deltas: { empathy: +0.4, confidence: +0.2 }
      },
      {
        id: 'celebrate',
        emoji: '🥂',
        text: 'Celebrate your life as it is.',
        consequence: `You make a list of what you love.\nIt's longer than you expected.`,
        stressDelta: -2,
        babyPressureDelta: -3,
        deltas: { confidence: +0.3 }
      },
      {
        id: 'reopen',
        emoji: '🧭',
        text: 'Revisit "options" with a calm mind.',
        consequence: `You don\'t force an answer.\nYou just allow possibilities.\nThat\'s different.`,
        stressDelta: -1,
        babyPressureDelta: -1,
        deltas: { intelligence: +0.2, discipline: +0.2 }
      }
    ]
  }
];