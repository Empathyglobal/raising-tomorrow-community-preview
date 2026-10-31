// Science Fair System Data

export const SCI_FAIR_LEVELS = [
  { id: "LOCAL", label: "Local Science Fair" },
  { id: "REGIONAL", label: "Regional Science Fair" },
  { id: "STATE", label: "State Science Fair" },
  { id: "NATIONAL", label: "National Science Fair" }
];

export const SCI_FAIR_PROJECTS = [
  { id: "rocket-nozzle", name: "Model Rocket Nozzle Test", tags: ["SPACE", "BUILDING"] },
  { id: "mars-soil", name: "Mars Soil Simulation (Safe Chemistry)", tags: ["SPACE"] },
  { id: "plant-light", name: "Plants & Light: Growth Experiment", tags: ["ANIMALS"] },
  { id: "bridge-strength", name: "Bridge Strength Challenge", tags: ["BUILDING"] },
  { id: "clean-water", name: "Simple Clean Water Filter Prototype", tags: ["PEOPLE", "BUILDING"] },
  { id: "sound-waves", name: "Sound Waves & Vibration Art", tags: ["ART"] },
  { id: "robot-sensor", name: "Tiny Robot Sensor Maze", tags: ["SPACE", "BUILDING"] },
  { id: "empathy-study", name: "Kindness Experiment (Consent + Surveys)", tags: ["PEOPLE"] }
];

export const SCI_FAIR_SUPPORT = [
  {
    id: "mentor",
    label: "🧠 Co-build & mentor patiently",
    bonus: 3,
    delta: { intelligence: 0.4, discipline: 0.2, confidence: 0.2, empathy: 0.2 },
    loveDelta: 0.3,
    stressDelta: 0.1
  },
  {
    id: "present",
    label: "🎤 Practice the presentation together",
    bonus: 2,
    delta: { confidence: 0.5, empathy: 0.2, discipline: 0.1, intelligence: 0.2 },
    loveDelta: 0.2,
    stressDelta: 0.1
  },
  {
    id: "coach",
    label: "💼 Hire a science coach (money)",
    bonus: 4,
    costs: { money: 600 },
    delta: { intelligence: 0.5, discipline: 0.2, confidence: 0.1 },
    loveDelta: 0.1,
    stressDelta: 0
  },
  {
    id: "lead",
    label: "🧩 Let them lead; you supervise lightly",
    bonus: 1,
    delta: { discipline: 0.2, confidence: 0.2, intelligence: 0.2, empathy: 0.1 },
    loveDelta: 0.1,
    stressDelta: 0
  },
  {
    id: "pressure",
    label: "😡 Pressure them to 'win' and micromanage",
    bonus: -3,
    delta: { empathy: -0.6, confidence: -0.4, discipline: -0.2 },
    loveDelta: -0.6,
    stressDelta: 0.5
  }
];

export const SCI_FAIR_FLAVOR = [
  "They take the project absurdly seriously… including a lab coat made from an old t-shirt.",
  "They name the project like it's a superhero: 'Operation: Extremely Scientific.'",
  "They practice explaining it to a stuffed animal and demand applause after every slide.",
  "They ask, very sincerely, if their volcano can get a LinkedIn profile.",
  "They insist the tri-fold board needs a 'dramatic reveal.'"
];

export const PRIMARY_INTERESTS = [
  { id: "SPACE", emoji: "🚀", label: "Space & rockets", delta: { intelligence: 0.2 } },
  { id: "ANIMALS", emoji: "🦋", label: "Animals & nature", delta: { empathy: 0.2 } },
  { id: "ART", emoji: "🎨", label: "Art & stories", delta: { confidence: 0.2 } },
  { id: "BUILDING", emoji: "🔧", label: "Building & machines", delta: { discipline: 0.2 } },
  { id: "PEOPLE", emoji: "🧑‍🤝‍🧑", label: "People & helping", delta: { empathy: 0.1, confidence: 0.1 } }
];