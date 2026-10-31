const scenarios = [
  {
    id: "SCA_14_01",
    title: "FRESHMAN IN THE HALLWAY",
    body: "They walk into school like it’s a movie where everyone is cooler than them.",
    choices: [
      { key: "A", text: "Normalize: “Everyone feels like an imposter at first.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Create a survival plan: routes, safe spots, one safe friend/adult.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“Just act confident.”", effects: { CONF: 0.2, ANX: 0.2, IND: 0.2 } },
      { key: "D", text: "“High school is brutal.” (Anxiety rocket fuel.)", effects: { CONF: -0.5, ANX: 1.0, BOND: -0.2 } }
    ]
  },
  {
    id: "SCA_14_02",
    title: "OUTFIT SPIRAL",
    body: "They change outfits three times and still look like they’re losing a battle.",
    choices: [
      { key: "A", text: "“Comfort is confidence.” Help them pick one workable fit.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Compliment something specific (not fake hype).", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5 } },
      { key: "C", text: "“You’re being ridiculous.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5 } },
      { key: "D", text: "Buy new clothes immediately (temporary relief).", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: -0.2, SOC: 0.2 } }
    ]
  },
  {
    id: "SCA_14_03",
    title: "FIRST BIG EXAM PANIC",
    body: "They’re studying like it’s the end of the world. Because it is. (To them.)",
    choices: [
      { key: "A", text: "Teach a plan: breaks + sleep + “done is better than perfect.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5, IND: 0.2 } },
      { key: "B", text: "Help them prioritize what matters most.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 1.0 } },
      { key: "C", text: "Pressure speech about college (fear accelerator).", effects: { ANX: 1.0, BOND: -0.2 } },
      { key: "D", text: "“If you fail, you fail.” (Cold realism.)", effects: { ANX: 0.2, BOND: -0.2, IND: 0.2 } }
    ]
  },
  {
    id: "SCA_14_04",
    title: "TRYOUTS PRESSURE",
    body: "They want the team / role… but their stomach says “no.”",
    choices: [
      { key: "A", text: "Reframe: “Tryouts are practice for courage.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Ask: “Do you want it, or do you want approval?”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5, IND: 0.5 } },
      { key: "C", text: "Push hard: “You have to win.”", effects: { CONF: 0.2, ANX: 0.5, BOND: -0.2 } },
      { key: "D", text: "Tell them not to go (protection that shrinks life).", effects: { CONF: -0.5, ANX: -0.2, BOND: 0.2, IND: -0.2, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_14_05",
    title: "FRIEND GROUP RE-ORG",
    body: "They say: “My friends are different now. I don’t know where I fit.”",
    choices: [
      { key: "A", text: "Validate grief + encourage new connections without trashing old ones.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5, IND: 0.2, SOC: 0.2 } },
      { key: "B", text: "Suggest one anchor: club/sport/class where they can belong.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.5 } },
      { key: "C", text: "“Friends don’t matter.” (False.)", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.2, SOC: -0.5 } },
      { key: "D", text: "Blame the friends (creates more insecurity).", effects: { CONF: 0.2, ANX: 0.2, SOC: -0.5 } }
    ]
  },
  {
    id: "SCA_14_06",
    title: "DATING / BREAKUP DOOMSCROLL",
    body: "They’re “fine.” They’re not fine. They’re scrolling like it’s a doom spell.",
    choices: [
      { key: "A", text: "Be steady: “That hurts. I’m here. No lecture.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 1.0 } },
      { key: "B", text: "Coach boundaries: mute/block/space without revenge posting.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“I told you so.” (Villain line.)", effects: { CONF: -0.5, ANX: 0.5, BOND: -1.0 } },
      { key: "D", text: "Investigate aggressively (may feel like betrayal).", effects: { ANX: 0.2, BOND: -0.5, IND: -0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_14_07",
    title: "PUBLIC SPEAKING DOOM",
    body: "They have to present. They would rather teleport out of existence.",
    choices: [
      { key: "A", text: "Teach a cheat code: short notes + slow start + look above heads.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "B", text: "Practice once, then stop (don’t feed the anxiety).", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“If you mess up, everyone will remember.” (Not true. But terror.)", effects: { CONF: -0.2, ANX: 1.0, BOND: -0.5 } },
      { key: "D", text: "“Skip school.” (Avoidance boss level.)", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_14_08",
    title: "ONLINE IMAGE ANXIETY",
    body: "They hate how they look in photos. They spiral about being “cringe.”",
    choices: [
      { key: "A", text: "Normalize: “Teen brains are brutal. Photos aren’t truth.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Help them curate: privacy settings, who can post, what’s okay.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“Just get over it.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5 } },
      { key: "D", text: "Join the spiral: “Yeah, social media is toxic.”", effects: { CONF: -0.2, ANX: 0.2, BOND: 0.2, IND: -0.2 } }
    ]
  },
  {
    id: "SCA_14_09",
    title: "OVERLOADED SCHEDULE",
    body: "They’re doing school + clubs + maybe a job + zero rest. They’re snapping at everyone.",
    choices: [
      { key: "A", text: "Help them drop one thing (rest as a strategy).", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: 0.5, SOC: -0.2 } },
      { key: "B", text: "Teach pacing: 2 priorities max + protected sleep.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“You chose this.” (Blame.)", effects: { CONF: -0.2, ANX: 0.5, BOND: -0.5 } },
      { key: "D", text: "Add more structure and rules (control can backfire).", effects: { ANX: -0.2, BOND: -0.5, IND: -0.5 } }
    ]
  },
  {
    id: "SCA_14_10",
    title: "BURNOUT MORNING",
    body: "They can’t get out of bed. They say: “I can’t do today.”",
    choices: [
      { key: "A", text: "Calm check-in: “Is this stress, sleep, or something deeper?”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Offer a tiny step: shower + breakfast + decide after.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Threaten consequences (may worsen shutdown).", effects: { CONF: -0.2, ANX: 0.5, BOND: -0.5 } },
      { key: "D", text: "Let them stay home with zero follow-up plan.", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  }
];

export default scenarios;