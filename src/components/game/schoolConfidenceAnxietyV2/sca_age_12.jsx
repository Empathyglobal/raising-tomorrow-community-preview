const scenarios = [
  {
    id: "SCA_12_01",
    title: "LOCKER WON’T OPEN",
    body: "They’re near tears: “Everyone’s staring. I look stupid.”",
    choices: [
      { key: "A", text: "Practice at home + teach “ask for help” without shame.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "B", text: "Give them a reset line: “Can you show me? I’m new.”", effects: { CONF: 0.5, ANX: -0.2, IND: 1.0, SOC: 0.2 } },
      { key: "C", text: "“Just figure it out.” (Brutal.)", effects: { ANX: 0.2, BOND: -0.2, IND: 0.5 } },
      { key: "D", text: "Storm the school and demand a locker refund. (Iconic but messy.)", effects: { CONF: 0.2, ANX: 0.2, BOND: 0.2, IND: -0.5, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_12_02",
    title: "WRONG CLASS, WRONG LIFE",
    body: "They went to the wrong room and now think they’re doomed socially forever.",
    choices: [
      { key: "A", text: "Normalize: “Every new kid does this.”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2 } },
      { key: "B", text: "Create a simple system: photo of schedule + map + backup adult.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Lecture about responsibility (more shame, less help).", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5 } },
      { key: "D", text: "“Skip tomorrow.” (Avoidance spiral.)", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_12_03",
    title: "LUNCH TABLE HUNGER GAMES",
    body: "They say: “If you sit wrong, you die.” (Emotionally.)",
    choices: [
      { key: "A", text: "Plan: find one friendly person + sit near them.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2, SOC: 0.5 } },
      { key: "B", text: "Teach confidence move: sit, eat, headphones/book if allowed.", effects: { CONF: 0.5, ANX: -0.2, IND: 1.0, SOC: -0.2 } },
      { key: "C", text: "Tell them to “be popular” (how? magic?).", effects: { CONF: -0.2, ANX: 0.5, BOND: -0.2 } },
      { key: "D", text: "Email the school about assigned seating (might help, might label).", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: -0.2, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_12_04",
    title: "OLDER KIDS ENERGY",
    body: "They saw older students and now feel like prey in the wild.",
    choices: [
      { key: "A", text: "Reframe: most older kids don’t care; they’re busy surviving too.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2 } },
      { key: "B", text: "Teach safety: stick with a buddy in halls, know safe adults.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "C", text: "“Fight back if someone messes with you.” (Risky messaging.)", effects: { CONF: 0.2, ANX: 0.2, BOND: -0.2, IND: 0.2, SOC: -0.5 } },
      { key: "D", text: "“You’re overreacting.”", effects: { CONF: -0.5, ANX: 0.5, BOND: -0.5 } }
    ]
  },
  {
    id: "SCA_12_05",
    title: "GYM CHANGING ROOM TERROR",
    body: "They’re suddenly quiet about gym days. Very quiet.",
    choices: [
      { key: "A", text: "Open gently: “Is it the changing room? The comments? The privacy?”", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Problem-solve options: changing stall, timing, talk to teacher/counselor.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "Push: “Everyone does it.”", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.5 } },
      { key: "D", text: "Let them skip gym forever (short relief, long fear win).", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.5 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_12_06",
    title: "CRUSH CATASTROPHE",
    body: "Their crush looked at them. They combusted. Now school is unsafe.",
    choices: [
      { key: "A", text: "Normalize: “Congrats, you’re human. This is normal.”", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.5 } },
      { key: "B", text: "Coach a tiny brave move: smile + “hi” once.", effects: { CONF: 0.5, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "C", text: "Tease them (funny to you, mortifying to them).", effects: { CONF: -0.2, ANX: 0.5, BOND: -0.5, SOC: -0.2 } },
      { key: "D", text: "Tell everyone in the family immediately (villain choice).", effects: { CONF: -0.5, ANX: 1.0, BOND: -1.0, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_12_07",
    title: "SCREENSHOT DRAMA",
    body: "They whisper: “Someone screenshotted something. It’s spreading.”",
    choices: [
      { key: "A", text: "Calm triage: what’s spreading, who’s safe, involve adult support.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5 } },
      { key: "B", text: "Teach: stop responding, save evidence, block/report.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 1.0 } },
      { key: "C", text: "“Delete your phone.” (Overcorrection.)", effects: { ANX: -0.2, BOND: -0.5, IND: -0.2, SOC: -1.0 } },
      { key: "D", text: "“It’s your fault for texting.” (Shame bomb.)", effects: { CONF: -1.0, ANX: 1.0, BOND: -1.0, IND: -0.2, SOC: -0.2 } }
    ]
  },
  {
    id: "SCA_12_08",
    title: "HOMEWORK AVALANCHE",
    body: "Multiple teachers. Multiple platforms. Zero peace.",
    choices: [
      { key: "A", text: "Build a 10-minute planning habit + one checklist.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "B", text: "“You don’t have to do it all tonight.” Prioritize together.", effects: { CONF: 0.2, ANX: -0.5, BOND: 0.5, IND: 0.2 } },
      { key: "C", text: "Take over their planner (control = calm… for you).", effects: { ANX: -0.2, BOND: -0.2, IND: -0.5 } },
      { key: "D", text: "“Welcome to life.”", effects: { CONF: -0.2, ANX: 0.2, BOND: -0.2 } }
    ]
  },
  {
    id: "SCA_12_09",
    title: "“I’M NOT SMART ENOUGH”",
    body: "They compare themselves to a high-achieving classmate and spiral hard.",
    choices: [
      { key: "A", text: "“Comparison is a liar.” Refocus on their growth.", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.2 } },
      { key: "B", text: "Help them ask for help early (teacher office hours / tutoring).", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5 } },
      { key: "C", text: "“You need to work harder.” (Pressure.)", effects: { ANX: 0.5, BOND: -0.2, IND: 0.2 } },
      { key: "D", text: "“Then drop the class.” (Avoidance.)", effects: { CONF: -0.2, ANX: -0.5, BOND: 0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] }
    ]
  },
  {
    id: "SCA_12_10",
    title: "CLUB REJECTION FEAR",
    body: "They want to join something… but fear rejection more than anything.",
    choices: [
      { key: "A", text: "“Brave is applying.” Make the goal “submit,” not “win.”", effects: { CONF: 0.5, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "B", text: "Practice a quick intro: name + interest + question.", effects: { CONF: 0.2, ANX: -0.2, BOND: 0.2, IND: 0.5, SOC: 0.2 } },
      { key: "C", text: "“Don’t try. It’s embarrassing.” (Protective sabotage.)", effects: { CONF: -0.5, ANX: -0.2, IND: -0.5, SOC: -0.2 }, flags: ["AvoidancePlusOne"] },
      { key: "D", text: "Force them to join something immediately (power push).", effects: { CONF: 0.2, ANX: 0.5, BOND: -0.5, IND: -0.2, SOC: 0.2 } }
    ]
  }
];

export default scenarios;