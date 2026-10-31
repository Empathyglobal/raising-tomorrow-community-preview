const scenarios = [
  {
    id: "SCA_7_01",
    title: "BEST FRIEND BETRAYAL (ACT 1)",
    body: "They hiss: “My best friend played with someone else. On PURPOSE.”",
    choices: [
      { key: "A", text: "Validate + widen the world: “Friends can have more than one friend.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2, SOC: 0.2 } },
      { key: "B", text: "Coach a simple approach: “Want to play?” + “Can I join?”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.5 } },
      { key: "C", text: "“Ignore them back.” (Petty strategy.)", effects: { CONF: 0.2, ANX: 0.2, BOND: -0.2, SOC: -0.5 } },
      { key: "D", text: "Message the other parent. (Escalation speedrun.)", effects: { ANX: 0.2, BOND: 0.2, IND: -0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_7_02",
    title: "READING OUT LOUD PANIC",
    body: "Teacher calls on them. They freeze. Now they’re convinced everyone thinks they’re “stupid.”",
    choices: [
      { key: "A", text: "“Freezing happens.” Practice one calm recovery line.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "B", text: "Ask teacher for a heads-up system (quiet support).", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: -0.2 } },
      { key: "C", text: "Drill practice every night (results… and stress).", effects: { CONF: 0.5, ANX: 0.2, BOND: -0.2, IND: 0.2 } },
      { key: "D", text: "“You’re overreacting.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_7_03",
    title: "THE “I’M BAD AT MATH” SPIRAL",
    body: "One tricky worksheet and suddenly they’re “the worst kid alive.”",
    choices: [
      { key: "A", text: "“Hard doesn’t mean impossible.” Reframe as brain growth.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Make a tiny plan: 5 minutes, then break.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Do it for them (fast… but confidence damage).", effects: { CONF: -0.2, ANX: -0.2, BOND: 0.2, IND: -0.5 } },
      { key: "D", text: "“If you don’t try, you’ll fall behind.” (Fear fuel.)", effects: { ANX: 0.5, BOND: -0.2, IND: 0.2 } }
    ]
  },
  {
    id: "SCA_7_04",
    title: "PLAYGROUND COURT DRAMA",
    body: "They say: “They wouldn’t let me play. They made rules to keep me out.”",
    choices: [
      { key: "A", text: "Teach boundary line: “That’s not fair. I’m choosing something else.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "B", text: "Problem-solve: find 1 kid who’s kind + build from there.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2, SOC: 0.5 } },
      { key: "C", text: "“Just be tougher.”", effects: { ANX: 0.2, BOND: -0.2, IND: 0.2 } },
      { key: "D", text: "March in tomorrow like the playground police.", effects: { CONF: 0.2, ANX: 0.2, BOND: 0.2, IND: -0.5, SOC: -0.5 } }
    ]
  },
  {
    id: "SCA_7_05",
    title: "LOST-AND-FOUND NIGHTMARE",
    body: "They lost their hoodie and now school feels unsafe. “It’s gone forever. My life is over.”",
    choices: [
      { key: "A", text: "Calm plan: retrace steps + ask one adult for help.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "B", text: "Label everything + make it a “detective mission.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5, IND: 0.2 } },
      { key: "C", text: "Replace it immediately (comfort… but no skill building).", effects: { ANX: -0.5, BOND: 0.2, IND: -0.2 } },
      { key: "D", text: "“Too bad.”", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.5, IND: 0.5 } }
    ]
  },
  {
    id: "SCA_7_06",
    title: "NOISE OVERLOAD",
    body: "They cover their ears in the cafeteria: “It’s too loud. I hate it.”",
    choices: [
      { key: "A", text: "Normalize + plan: quieter seat, headphones if allowed.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, SOC: -0.2 } },
      { key: "B", text: "Teach a “reset trick”: slow breaths + squeeze hands.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“Everyone deals with it.”", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.5 } },
      { key: "D", text: "Pull them from lunchroom entirely.", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.5 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_7_07",
    title: "A NOTE HOME",
    body: "Teacher message: “Your child seems anxious / teary / distracted.”",
    choices: [
      { key: "A", text: "Partner with teacher: “What helps in class? Let’s align.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Ask your child first: “What’s the hardest moment of the day?”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5, IND: 0.2 } },
      { key: "C", text: "“Don’t embarrass me again.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -1.0, IND: -0.2, SOC: -0.2 } },
      { key: "D", text: "Pretend you didn’t see the note.", effects: { CONF: -0.2, ANX: 0.2 } }
    ]
  },
  {
    id: "SCA_7_08",
    title: "SEAT CHANGE BETRAYAL",
    body: "“They moved my seat away from my friend. They ruined my life.”",
    choices: [
      { key: "A", text: "Reframe: “It’s not punishment, it’s class management.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "B", text: "Teach coping: make one new “seat buddy hello.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.5 } },
      { key: "C", text: "Complain to teacher immediately.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: -0.2, SOC: -0.2 } },
      { key: "D", text: "“Good. Now you’ll focus.”", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_7_09",
    title: "FIELD DAY FEAR",
    body: "They whisper: “What if I’m the slowest and everyone laughs?”",
    choices: [
      { key: "A", text: "“Everyone’s good at different things.” Name their strengths.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "B", text: "Teach confidence script: “I’m trying. That counts.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "C", text: "Train aggressively (could boost, could pressure).", effects: { CONF: 0.5, ANX: 0.2, BOND: -0.2, IND: 0.2 } },
      { key: "D", text: "“Winning matters.”", effects: { CONF: 0.2, ANX: 0.5, BOND: -0.5 } }
    ]
  },
  {
    id: "SCA_7_10",
    title: "BIRTHDAY PARTY EXCLUSION",
    body: "“They invited everyone except me.” That sentence lands like a brick.",
    choices: [
      { key: "A", text: "Validate + comfort first. No fixing yet.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Help them plan: invite 1–2 kids for something simple.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.5 } },
      { key: "C", text: "“Maybe you’re annoying.”", effects: { CONF: -1.0, ANX: 1.0, BOND: -1.0, IND: -0.2, SOC: -0.5 } },
      { key: "D", text: "Rage-text the group chat.", effects: { ANX: 0.5, BOND: -0.2, IND: -0.5, SOC: -1.0 } }
    ]
  }
];

export default scenarios;