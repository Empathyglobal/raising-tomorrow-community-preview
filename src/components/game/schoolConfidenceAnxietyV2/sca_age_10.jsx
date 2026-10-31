const scenarios = [
  {
    id: "SCA_10_01",
    title: "GROUP PROJECT: THE FREELOADER SITUATION",
    body: "“They’re not doing anything and I’m gonna get blamed.”",
    choices: [
      { key: "A", text: "Coach a calm message: “Let’s split tasks clearly.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "B", text: "Tell them to speak to the teacher privately.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: 0.2 } },
      { key: "C", text: "Take over the project at home (grade wins, confidence loses).", effects: { CONF: -0.2, ANX: -0.2, BOND: 0.2, IND: -0.5 } },
      { key: "D", text: "“Let it fail. Teach them a lesson.” (Chaos + risk.)", effects: { CONF: 0.2, ANX: 0.5, BOND: -0.2, IND: 0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_10_02",
    title: "NOT IN THE GROUP CHAT",
    body: "Everyone’s laughing about messages they never saw. “Oh. I’m not in it.”",
    choices: [
      { key: "A", text: "Plan a low-risk ask: “Can you add me?”", effects: { CONF: 0.2, ANX: -0.2, IND: 0.5, SOC: 0.5 } },
      { key: "B", text: "“You don’t need it.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2, SOC: -0.2 } },
      { key: "C", text: "Ban all screens forever (overcorrection).", effects: { ANX: -0.2, BOND: -0.5, IND: -0.2, SOC: -1.0 } },
      { key: "D", text: "“Make your own chat.” (Power move… maybe.)", effects: { CONF: 0.5, ANX: 0.2, IND: 0.5, SOC: 0.5 } }
    ]
  },
  {
    id: "SCA_10_03",
    title: "GYM CLASS BODY ALARM",
    body: "They suddenly hate changing rooms / uniforms / being perceived.",
    choices: [
      { key: "A", text: "Normalize: “Puberty is weird. Everyone feels awkward.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Problem-solve: layers, privacy strategies, teacher support.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“Stop being dramatic.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -1.0, SOC: -0.2 } },
      { key: "D", text: "Let them skip gym (relief now, fear grows later).", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_10_04",
    title: "TEST SCORE SHOCK",
    body: "They got a bad mark and whisper: “I’m not smart.”",
    choices: [
      { key: "A", text: "Separate identity from result: “That’s a score, not you.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Make a micro plan: review errors + one small practice.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Lecture about the future (fear-based motivation).", effects: { ANX: 0.5, BOND: -0.2 } },
      { key: "D", text: "Bribe: “Better score = reward.”", effects: { CONF: 0.2, ANX: 0.2 } }
    ]
  },
  {
    id: "SCA_10_05",
    title: "FRIEND GROUP POLITICS",
    body: "“They said I can sit with them… but only if I don’t talk to her.”",
    choices: [
      { key: "A", text: "Teach boundaries: “Friends don’t make you choose like that.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "B", text: "Coach an exit line: “I’m not doing that.”", effects: { CONF: 0.5, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“Do what you need to fit in.” (Safety vs values.)", effects: { CONF: -0.2, ANX: 0.2, IND: -0.2, SOC: 0.2 } },
      { key: "D", text: "Call it “mean girl behavior” and rant (might help, might inflame).", effects: { ANX: 0.2, BOND: 0.2, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_10_06",
    title: "“THE TEACHER EMBARRASSED ME”",
    body: "They say: “Everyone laughed. I wanted to disappear.”",
    choices: [
      { key: "A", text: "Validate + ask: “What do you need?”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Help them rehearse a respectful self-advocacy line.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Email the teacher immediately (could help, could escalate).", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: -0.2 } },
      { key: "D", text: "“Build character.”", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.2 } }
    ]
  },
  {
    id: "SCA_10_07",
    title: "TRYOUTS / AUDITION JITTERS",
    body: "They want to try out… and also want to vanish.",
    choices: [
      { key: "A", text: "“Go for experience, not approval.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Practice once, then stop (avoid obsession spiral).", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“If you don’t make it, you’ll regret it forever.” (Pressure.)", effects: { ANX: 0.5, BOND: -0.2 } },
      { key: "D", text: "“Don’t bother.” (Protection that becomes limitation.)", effects: { CONF: -0.5, ANX: -0.2, BOND: 0.2, IND: -0.2, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_10_08",
    title: "RUMOR ALERT",
    body: "They whisper: “Someone said something about me. People are looking.”",
    choices: [
      { key: "A", text: "Calm plan: don’t chase it; find one safe friend; tell an adult if needed.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Teach them to name it: “That’s not true. Stop.”", effects: { CONF: 0.5, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "C", text: "“Hit back harder.” (Escalation choice.)", effects: { CONF: 0.2, ANX: 0.5, BOND: -0.2, SOC: -0.5 } },
      { key: "D", text: "“Ignore it.” (Sometimes works, sometimes isolates.)", effects: { ANX: 0.2, IND: 0.2, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_10_09",
    title: "OVERNIGHT TRIP PANIC",
    body: "They’re excited… until bedtime: “What if I cry and everyone knows?”",
    choices: [
      { key: "A", text: "Pack a “quiet comfort kit” + a plan for calling you.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: 0.2, SOC: 0.2 } },
      { key: "B", text: "Normalize: “Lots of kids miss home. It’s okay.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5 } },
      { key: "C", text: "Pull them out of the trip (relief now, fear later).", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.5 }, flags: ["AvoidancePlusOne"] },
      { key: "D", text: "“Don’t embarrass yourself.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5, IND: -0.2, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_10_10",
    title: "THE NEW KID MOMENT",
    body: "They notice a new kid sitting alone… and want to help… but freeze.",
    choices: [
      { key: "A", text: "Coach a low-risk opener: “Want to sit with us?”", effects: { CONF: 0.2, BOND: 0.2, IND: 0.2, SOC: 0.5 } },
      { key: "B", text: "“You don’t have to save everyone.” (True, but…)", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "C", text: "Buddy plan: invite them into something already happening.", effects: { CONF: 0.5, BOND: 0.2, IND: 0.5, SOC: 0.5 } },
      { key: "D", text: "“Stay out of it.” (Safety-first, connection-last.)", effects: { CONF: -0.2, ANX: -0.2, SOC: -0.2 } }
    ]
  }
];

export default scenarios;