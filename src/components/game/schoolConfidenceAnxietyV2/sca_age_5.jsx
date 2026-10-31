const scenarios = [
  {
    id: "SCA_5_01",
    title: "KOALA MODE AT THE GATE",
    body: "Your child clamps onto your leg like a baby koala. Their eyes say: “This building is a trap.”",
    choices: [
      { key: "A", text: "Do a 10‑second “bravery ritual” + confident goodbye.", effects: { CONF: 0.5, ANX: -0.5, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Hand them a tiny “brave token” (coin/stone) and promise pick-up time.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "C", text: "Drag the goodbye out with extra cuddles (and the teacher watching).", effects: { CONF: -0.2, ANX: 0.2, BOND: 0.2, IND: -0.5 } },
      { key: "D", text: "“You’re fine.” Quick drop. No feelings. Just speed.", effects: { CONF: -0.2, ANX: 0.5, BOND: -0.5, IND: 0.2 } }
    ]
  },
  {
    id: "SCA_5_02",
    title: "THE BATHROOM PANIC",
    body: "Whispered emergency: “What if I need to pee and I’m too scared to ask?”",
    choices: [
      { key: "A", text: "Teach a simple script: “Excuse me, bathroom please.” Practice once.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "B", text: "Tell the teacher discreetly: “They’re shy about asking.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2 } },
      { key: "C", text: "Pack spare clothes and call it “just-in-case superhero gear.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "D", text: "“Just hold it.” (This will absolutely not backfire.)", effects: { CONF: -0.5, ANX: 1.0, BOND: -0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_5_03",
    title: "LUNCHBOX OF SHAME",
    body: "They open their lunchbox and gasp like it’s a horror movie. “What if everyone thinks my food is weird?”",
    choices: [
      { key: "A", text: "Rename it something cool: “Dragon Fuel” / “Power Crunch.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "B", text: "Swap tomorrow’s lunch to something they feel proud of.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2, SOC: 0.2 } },
      { key: "C", text: "“Everyone’s lunch is different.” Normalize + move on.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "D", text: "“Eat it or don’t.” (Cold. Efficient. Slightly devastating.)", effects: { CONF: -0.2, ANX: 0.5, BOND: -0.5, IND: 0.2 } }
    ]
  },
  {
    id: "SCA_5_04",
    title: "SHOW-AND-TELL DREAD",
    body: "Tonight they suddenly remember: “I have to talk in front of everyone.”",
    choices: [
      { key: "A", text: "Practice a 10‑second version and let them stop there.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2, SOC: 0.2 } },
      { key: "B", text: "Offer a “helper plan”: they can show it without speaking much.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2 } },
      { key: "C", text: "“You’ll be amazing!” Big hype (big pressure).", effects: { CONF: 0.2, ANX: 0.2 } },
      { key: "D", text: "“If you freeze, you freeze.” (Honest… not comforting.)", effects: { ANX: -0.2, BOND: 0.2, IND: 0.2 } }
    ]
  },
  {
    id: "SCA_5_05",
    title: "THE LOUD BELL IS “ANGRY”",
    body: "They flinch at the school bell and whisper: “It yelled at me.”",
    choices: [
      { key: "A", text: "Reframe: “It’s just a loud timer, not mad at you.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "B", text: "Make it silly: do a “bell dance” at home to defang it.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "C", text: "Ask the teacher if they can get a warning before bell times.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2 } },
      { key: "D", text: "“Stop being dramatic.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5 } }
    ]
  },
  {
    id: "SCA_5_06",
    title: "“YOU’LL COME BACK… RIGHT?”",
    body: "Drop-off: “What if you forget me?”",
    choices: [
      { key: "A", text: "Give a clear timeline: “After snack + story + play, I return.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2 } },
      { key: "B", text: "Draw a tiny heart on their hand: “Press it when you miss me.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5 } },
      { key: "C", text: "“Of course I’ll come back.” (Reassuring, but vague.)", effects: { ANX: -0.2, BOND: 0.2 } },
      { key: "D", text: "Joke: “I live here now.” (Funny to you… risky to them.)", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.2 } }
    ]
  },
  {
    id: "SCA_5_07",
    title: "RULES FEEL LIKE A MINEFIELD",
    body: "They whisper: “What if I do something wrong and everyone hates me?”",
    choices: [
      { key: "A", text: "“Mistakes are allowed.” Say it like it’s a rule.", effects: { CONF: 0.5, ANX: -0.5, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Teach 2 safe moves: “Ask teacher” + “copy the group.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Promise perfection: “Just behave and you’ll be fine.”", effects: { CONF: 0.2, ANX: 0.5 } },
      { key: "D", text: "“It doesn’t matter.”", effects: { CONF: -0.2, ANX: -0.2, BOND: -0.2 } }
    ]
  },
  {
    id: "SCA_5_08",
    title: "THE TOY SMUGGLE OPERATION",
    body: "They insist on bringing a toy “for bravery.” It’s huge. It’s loud. It’s… cursed.",
    choices: [
      { key: "A", text: "Pocket-sized compromise: tiny charm, keyring, or photo.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Let them bring it but keep it in their bag as “backup.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2 } },
      { key: "C", text: "Flat no: “Rules are rules.”", effects: { ANX: 0.2, BOND: -0.2, IND: 0.5 } },
      { key: "D", text: "Secretly sneak it in and hope nobody notices.", effects: { CONF: 0.2, ANX: -0.2, IND: -0.2 }, flags: ["RiskIfCaught"] }
    ]
  },
  {
    id: "SCA_5_09",
    title: "BUS SEAT PANIC",
    body: "They stare at the bus like it’s a dragon with wheels. “Where do I sit? What if nobody sits with me?”",
    choices: [
      { key: "A", text: "Ask school about a “buddy seat” system.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2, SOC: 0.2 } },
      { key: "B", text: "Role-play: “Can I sit here?” Practice the line.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "C", text: "Walk/drive today and build up to the bus later.", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] },
      { key: "D", text: "“Figure it out.”", effects: { ANX: 0.2, BOND: -0.2, IND: 0.5 } }
    ]
  },
  {
    id: "SCA_5_10",
    title: "FIRST DAY TEARS (YOURS TOO)",
    body: "You’re holding it together… barely. They notice. Now you’re both emotional.",
    choices: [
      { key: "A", text: "Keep it calm: “It’s okay to feel nervous. We can do nervous.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Make it playful: “We’re both brave beginners today.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5 } },
      { key: "C", text: "Cry openly together (bonding… but might amplify fear).", effects: { CONF: -0.2, ANX: 0.2, BOND: 0.5, IND: -0.2 } },
      { key: "D", text: "Pretend you feel nothing. Robot parent activated.", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.5, IND: 0.2 } }
    ]
  }
];

export default scenarios;