// Local deterministic RNG (copy to avoid circular imports)
function createSeededRng(seedString) {
  let h = 0;
  const s = String(seedString || "seed");
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  let state = (h >>> 0) || 1;

  const nextFloat = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const pick = (arr) => {
    const a = Array.isArray(arr) ? arr : [];
    if (!a.length) return null;
    return a[Math.floor(nextFloat() * a.length)];
  };
  return { nextFloat, pick };
}

function bandForAge(age){
  if (age <= 3) return 'toddler';
  if (age <= 7) return 'child';
  if (age <= 11) return 'preteen';
  if (age <= 15) return 'teen';
  return 'lateTeen';
}

const TOPICS = {
  toddler: [
    'First propaganda photo',
    'They copy the salute',
    'A "normal" playdate with selected children',
    'They ask why they are called "Young Marshal"',
    'Security drills interrupt bedtime',
    'A handler corrects their "unsafe" words'
  ],
  child: [
    'Elite kindergarten: "The state is family"',
    'They giggle during a serious ceremony',
    'Teacher asks them to report what others say',
    'They ask about hunger after seeing outside',
    'First rehearsal for a public speech',
    'They form an attachment to a guard'
  ],
  preteen: [
    'They discover a forbidden foreign cartoon',
    'A general praises them; another looks annoyed',
    'They want a real friend, not a "selected" one',
    "They ask if they're allowed to be wrong",
    'A rumor about your health reaches them',
    'They practice charisma for a televised visit'
  ],
  teen: [
    'A loyalty test: do they protect a classmate?',
    'They ask what "freedom" means',
    'They notice fear in the room and name it',
    "They're pressured to punish someone socially",
    'They question propaganda privately',
    'They want to travel and see the world',
    'They attend a staged punishment ceremony'
  ],
  lateTeen: [
    'Succession meeting: factions form',
    'They want to speak honestly on camera',
    'Sanctions tighten; the palace wants scapegoats',
    'They practice calm under pressure',
    'They ask what you regret',
    'They ask what kind of leader you want them to be',
    'They attend a staged punishment ceremony'
  ]
};

const TOPIC_DETAILS = {
  "They discover a forbidden foreign cartoon": "You catch them watching a forbidden foreign cartoon in a quiet hallway. Their eyes are wide: it's bright, silly, and *human* in a way palace TV never is.",
  "Teacher asks them to report what others say": "A teacher smiles too hard and says it's time your child learns 'duty': listening for disloyalty and reporting it. Your child looks at you like: is this normal?",
  "A loyalty test: do they protect a classmate?": "A staged 'loyalty test' is arranged. Someone is set up to fail. Your child is being watched to see if they help… or join the crowd.",
  "They attend a staged punishment ceremony": "A punishment ceremony is staged for deterrence. It's meant to teach fear. Your child whispers: 'Do I have to watch?'",
  "Succession meeting: factions form": "Generals and advisers circle the table. Everyone smiles. Nobody relaxes. Your child is being measured as the next symbol—and the next weapon.",
  "They ask what \"freedom\" means": "They ask, quietly: 'What does freedom mean?' Then they add: 'Am I allowed to ask that?'"
};

export function buildKimYearScenario({ state, age, rerollNonce = 0 }) {
  const childName = state.childName || 'your child';
  const b = bandForAge(age);
  const rng = createSeededRng(`${state.runSeed || 'seed'}|kim|age:${age}|reroll:${rerollNonce}`);
  
  // AGE 1: Special succession training intro
  if (age === 1) {
    return {
      id: "kim_year_1_intro",
      title: "Succession Training: Year One",
      age: 1,
      topic: "The palace wants a successor",
      hookText: "TODAY'S TOPIC: The palace wants a successor",
      scenarioText: `At age 1, the generals have already asked about ${childName}'s temperament.\n\nYou are the Supreme Leader. The palace wants a successor. A parent wants a child. Those two things are not always compatible.\n\nSuccession training begins now.\n\nWhat do you do?`,
      choices: [
        {
          id: 'connect', role: 'connect', letter: 'A',
          text: `Away from cameras, you act like a parent, not a regime.`,
          consequence: `${childName} gets attachment before propaganda. The generals can wait.`,
          deltas: { empathy: 0.55, confidence: 0.15 }, loveDelta: 2, stressDelta: 0
        },
        {
          id: 'teach', role: 'teach', letter: 'B',
          text: `Teach the 'public smile' and the salute like it's alphabet practice.`,
          consequence: 'They wave on cue. The crowd approves. You hope they still know the difference.',
          deltas: { intelligence: 0.50, discipline: 0.20 }, loveDelta: 1, stressDelta: 0
        },
        {
          id: 'boundary', role: 'boundary', letter: 'C',
          text: `No crying in public. Practice again until it's automatic.`,
          consequence: 'Control arrives early. So does pressure.',
          deltas: { discipline: 0.55, confidence: 0.15, empathy: -0.20 }, loveDelta: 0, stressDelta: 0
        },
        {
          id: 'avoid', role: 'avoid', letter: 'D',
          text: `Outsource parenting to handlers and tutors. The machine will raise them.`,
          consequence: `The child learns silence early. Guidance feels optional.`,
          deltas: { confidence: -0.20, empathy: -0.10 }, loveDelta: -1, stressDelta: -1
        },
        {
          id: 'harm', role: 'harm', letter: 'E',
          text: `Fear-based compliance. They obey because they're scared, not safe.`,
          consequence: 'They stop crying. They also stop asking for you.',
          deltas: { empathy: -0.55, discipline: 0.15, confidence: 0.15 }, loveDelta: -2, stressDelta: 1
        }
      ],
      meta: { packId: 'special_start', choicePack: 'standard', category: 'kim_jong_un', intensity: 2, hookId: 'kim_year_1_intro' }
    };
  }

  // AGE 12: Special "loyalty lesson" scenario
  if (age === 12) {
    return {
      id: "kim_year_12_traitor",
      title: "The Loyalty Lesson",
      age: 12,
      topic: "A traitor is punished",
      hookText: "TODAY'S TOPIC: A traitor is punished",
      scenarioText: `At age 12, a high-ranking relative is publicly denounced as a traitor.\n\nThe palace broadcasts the sentence. The crowd is silent. The camera will capture who cries and who doesn't.\n\nThe palace expects ${childName} to watch and learn the "correct" reaction.\n\n${childName} begs not to watch.\n\nWhat do you do?`,
      choices: [
        {
          id: 'connect', role: 'connect', letter: 'A',
          text: `Let them skip it. Talk privately after. "This is survival theater. It's not who we are."`,
          consequence: `They learn the difference between performance and principle. Trust deepens.`,
          deltas: { empathy: 0.75, confidence: 0.25 }, loveDelta: 3, stressDelta: 0
        },
        {
          id: 'teach', role: 'teach', letter: 'B',
          text: `Teach the script and a breathing reset. "You have to be in the room. But you can stay human inside."`,
          consequence: 'They survive the moment. Skill protects them from full compliance.',
          deltas: { intelligence: 0.50, discipline: 0.30, empathy: -0.10 }, loveDelta: 1, stressDelta: 0
        },
        {
          id: 'boundary', role: 'boundary', letter: 'C',
          text: `Make them watch. "No tears. No questions. This is how power works."`,
          consequence: 'They comply. They also learn loyalty is a performance—and empathy is a risk.',
          deltas: { discipline: 0.60, confidence: 0.20, empathy: -0.40 }, loveDelta: -1, stressDelta: 0
        },
        {
          id: 'avoid', role: 'avoid', letter: 'D',
          text: `Let handlers deal with it. You don't want to be part of this moment.`,
          consequence: `They learn the palace trains silence better than you teach safety.`,
          deltas: { confidence: -0.30, empathy: -0.20 }, loveDelta: -2, stressDelta: -1
        },
        {
          id: 'harm', role: 'harm', letter: 'E',
          text: `Punish them for crying. "Weakness invites judgment. Never show it again."`,
          consequence: 'They stop crying—and stop trusting you with real feelings.',
          deltas: { empathy: -0.70, confidence: -0.30, discipline: 0.20 }, loveDelta: -3, stressDelta: 1
        }
      ],
      meta: { packId: 'special_start', choicePack: 'standard', category: 'kim_jong_un', intensity: 3, hookId: 'kim_year_12_traitor' }
    };
  }

  // GENERIC YEARS: funnier + palace-flavored
  const topic = rng.pick(TOPICS[b]);
  const detail = TOPIC_DETAILS[topic] || "The palace presents a lesson. You decide whether your child becomes softer—or sharper.";

  const hookText = `TODAY'S TOPIC: ${topic}`;
  const scenarioText =
    `${hookText}\n\n` +
    `${detail}\n\n` +
    `(In this special start, Empathy is the deciding stat for the ending.)\n\n` +
    `What do you do?`;

  const baseChoices = [
    {
      id: 'connect', role: 'connect', letter: 'A',
      text: `Connect in private. Name the feeling. "You're safe with me—even if the room isn't."`,
      consequence: `${childName} trusts you a little more than the palace.`,
      deltas: { empathy: 0.55, confidence: 0.15 }, loveDelta: 2, stressDelta: 0
    },
    {
      id: 'teach', role: 'teach', letter: 'B',
      text: 'Teach a tiny skill: signal phrases, a breathing reset, a plan for when eyes are watching.',
      consequence: 'Skill beats fear—by inches, not miles.',
      deltas: { intelligence: 0.50, discipline: 0.20 }, loveDelta: 1, stressDelta: 0
    },
    {
      id: 'boundary', role: 'boundary', letter: 'C',
      text: 'Set a hard line on image: no mistakes in public; rehearse again.',
      consequence: 'Polish increases. Pressure does too.',
      deltas: { discipline: 0.55, confidence: 0.15, empathy: -0.20 }, loveDelta: 0, stressDelta: 0
    },
    {
      id: 'avoid', role: 'avoid', letter: 'D',
      text: 'Ignore it. The machine will raise them.',
      consequence: `${childName} learns silence is survival and guidance is scarce.`,
      deltas: { confidence: -0.20, empathy: -0.10 }, loveDelta: -1, stressDelta: -1
    },
    {
      id: 'harm', role: 'harm', letter: 'E',
      text: 'Scare them into compliance—image over innocence.',
      consequence: 'They perform better and trust less.',
      deltas: { empathy: -0.55, discipline: 0.15, confidence: 0.15 }, loveDelta: -2, stressDelta: 1
    }
  ];

  let choices = baseChoices;

  // Topic-specific choice overrides
  if (topic === "They discover a forbidden foreign cartoon") {
    choices = [
      {
        id: 'watch_together', role: 'connect', letter: 'A',
        text: 'Watch it together privately. "We can enjoy this. Just keep it quiet."',
        consequence: `${childName} learns joy doesn't need permission—just caution.`,
        deltas: { empathy: 0.65, confidence: 0.20 }, loveDelta: 3, stressDelta: 1.5
      },
      {
        id: 'ban_gently', role: 'teach', letter: 'B',
        text: 'Explain the risk without shame. "Not safe, but I get why you wanted to see it."',
        consequence: 'They understand context beats control.',
        deltas: { empathy: 0.40, intelligence: 0.30 }, loveDelta: 1, stressDelta: 0
      },
      {
        id: 'destroy_it', role: 'boundary', letter: 'C',
        text: 'Destroy it. "This is never allowed. Never again."',
        consequence: 'Compliance arrives. So does mistrust.',
        deltas: { discipline: 0.60, empathy: -0.50, confidence: -0.20 }, loveDelta: -1, stressDelta: 0
      },
      {
        id: 'pretend_ignore', role: 'avoid', letter: 'D',
        text: "Pretend you didn't see. Let them handle the risk alone.",
        consequence: 'You avoid the confrontation. They learn silence from you.',
        deltas: { confidence: -0.30, empathy: -0.15 }, loveDelta: -1, stressDelta: -0.5
      }
    ];
  }

  if (topic === "Teacher asks them to report what others say" || topic === "A loyalty test: do they protect a classmate?") {
    choices = [
      {
        id: 'protect_empathy', role: 'connect', letter: 'A',
        text: 'Privately: "Real loyalty means protecting people, not just the system."',
        consequence: `${childName} chooses kindness over performance. The palace notices. You protect them anyway.`,
        deltas: { empathy: 0.75, confidence: 0.30 }, loveDelta: 3, stressDelta: 1
      },
      {
        id: 'teach_code', role: 'teach', letter: 'B',
        text: 'Teach the code-switch: "Public loyalty. Private humanity. Both can exist."',
        consequence: "They learn survival theater doesn't mean abandoning conscience.",
        deltas: { intelligence: 0.55, empathy: 0.25 }, loveDelta: 1, stressDelta: 0
      },
      {
        id: 'enforce_loyalty', role: 'boundary', letter: 'C',
        text: 'Enforce the loyalty script. "Your job is to report. Do not question it."',
        consequence: 'They comply. Empathy becomes optional.',
        deltas: { discipline: 0.70, empathy: -0.60, confidence: 0.20 }, loveDelta: -1, stressDelta: 0
      },
      {
        id: 'avoid_topic', role: 'avoid', letter: 'D',
        text: 'Say nothing. Let the system teach.',
        consequence: 'The machine wins by default.',
        deltas: { empathy: -0.30, confidence: -0.20 }, loveDelta: -2, stressDelta: -1
      },
      {
        id: 'punish_hesitation', role: 'harm', letter: 'E',
        text: 'Punish them for hesitating. "Loyalty is never optional."',
        consequence: 'They report everyone. Trust never returns.',
        deltas: { empathy: -0.80, discipline: 0.30, confidence: -0.30 }, loveDelta: -3, stressDelta: 1
      }
    ];
  }

  if (topic === "They attend a staged punishment ceremony") {
    choices = [
      {
        id: 'let_skip', role: 'connect', letter: 'A',
        text: 'Let them skip and debrief privately. "This is propaganda, not truth."',
        consequence: `${childName} learns fear is a tool—not reality. Trust deepens.`,
        deltas: { empathy: 0.80, confidence: 0.35 }, loveDelta: 3, stressDelta: 0
      },
      {
        id: 'mercy_lesson', role: 'teach', letter: 'B',
        text: 'Turn it into a "mercy" lesson. "Power includes restraint. Remember that."',
        consequence: 'They internalize compassion as strength. The palace dislikes this narrative.',
        deltas: { empathy: 0.70, intelligence: 0.25, discipline: -0.15 }, loveDelta: 2, stressDelta: 0.5
      },
      {
        id: 'attend_stone', role: 'boundary', letter: 'C',
        text: 'Make them attend. "No emotion. Watch and learn."',
        consequence: 'They obey. Empathy becomes a liability they hide.',
        deltas: { discipline: 0.70, confidence: 0.25, empathy: -0.70 }, loveDelta: -2, stressDelta: 1
      },
      {
        id: 'force_watch', role: 'harm', letter: 'D',
        text: 'Force them to watch. "This is what happens to weakness."',
        consequence: 'They watch. They stop asking questions. Humanity becomes a risk.',
        deltas: { empathy: -0.85, discipline: 0.40, confidence: 0.30 }, loveDelta: -3, stressDelta: 2
      }
    ];
  }

  if (topic === "Succession meeting: factions form" || topic === "They ask what \"freedom\" means") {
    choices = [
      {
        id: 'soft_reform', role: 'connect', letter: 'A',
        text: 'Teach quiet reform: "Power can unify, not just control. Plan for elections—slowly."',
        consequence: `${childName} learns transformation beats suppression. Generals disapprove.`,
        deltas: { empathy: 0.75, confidence: 0.40, discipline: -0.25 }, loveDelta: 3, stressDelta: 1
      },
      {
        id: 'play_both', role: 'teach', letter: 'B',
        text: 'Play both sides. "Smile for hardliners. Plan for reformers. Stay alive."',
        consequence: 'They learn survival is strategic—not principled.',
        deltas: { intelligence: 0.60, empathy: 0.15, confidence: 0.20 }, loveDelta: 1, stressDelta: 1.5
      },
      {
        id: 'hardline_dynasty', role: 'boundary', letter: 'C',
        text: 'Dynasty first. "The machine stays. Reform is weakness."',
        consequence: 'Control tightens. Empathy is discarded.',
        deltas: { discipline: 0.75, confidence: 0.30, empathy: -0.65 }, loveDelta: 0, stressDelta: 0
      },
      {
        id: 'defer_generals', role: 'avoid', letter: 'D',
        text: 'Defer to the generals. Let them shape policy.',
        consequence: 'You avoid decisions. The hardliners win.',
        deltas: { empathy: -0.40, confidence: -0.30 }, loveDelta: -1, stressDelta: -0.5
      }
    ];
  }

  return {
    id: `kim_year_${age}`,
    title: 'Succession Training',
    age,
    topic: topic,
    hookText,
    scenarioText,
    choices,
    meta: { packId: 'special_start', choicePack: 'standard', category: 'kim_jong_un', intensity: age >= 12 ? 3 : 2, hookId: `kim_${b}` }
  };
}

export function generateKimOutcome(gameState) {
  const stats = gameState.stats || {};
  const INT = Math.round(Number(stats.intelligence || 0));
  const EMP = Math.round(Number(stats.empathy || 0));
  const DIS = Math.round(Number(stats.discipline || 0));
  const CON = Math.round(Number(stats.confidence || 0));
  const love = Math.round(Number(gameState.love || 0));
  const harmCount = Math.round(Number(gameState?.counters?.harmCount || 0));
  const rng = createSeededRng(`${gameState.runSeed || 'seed'}|kim|ending`);

  // Assassination method (safe, vague)
  const methods = [
    'a sniper attack during a public appearance',
    'a bomb planted in a vehicle',
    'poisoning by an insider',
    'an internal palace coup',
    'an explosion during a motorcade route'
  ];
  const method = rng.pick(methods);

  function pickCivilianJob({ INT, EMP, DIS, CON, rng }) {
    const buckets = [];
    if (INT >= EMP && INT >= DIS && INT >= CON) buckets.push('Engineer','Researcher','Software Developer');
    if (EMP >= INT && EMP >= DIS && EMP >= CON) buckets.push('Teacher','Counselor','Social Worker');
    if (DIS >= INT && DIS >= EMP && DIS >= CON) buckets.push('Operations Manager','Accountant','Project Coordinator');
    if (CON >= INT && CON >= EMP && CON >= DIS) buckets.push('Broadcaster','Sales Lead','Public Speaker');
    if (buckets.length === 0) buckets.push('Coordinator','Analyst','Technician');
    return rng.pick(buckets);
  }

  // Branching: empathy-driven (deterministic)
  let ending = 'A';

  // Legendary unifier: very high empathy + stable parenting
  if (EMP >= 15 && DIS >= 10 && love >= 55 && harmCount === 0) {
    ending = 'C';
  }
  // Revolution: empathy too high to maintain the machine
  else if (EMP >= 12) {
    ending = 'B';
  }
  // Otherwise: dynasty maintained
  else {
    ending = 'A';
  }

  const childName = gameState.childName || 'your child';
  const jobTitle = pickCivilianJob({ INT, EMP, DIS, CON, rng });

  const sections = {};
  sections.successionTwist = {
    headline: 'On their 18th birthday, the regime snaps into motion.',
    bullets: [
      `An assassination attempt shakes the regime — ${method}.`,
      'Your child is rushed into a secured command space.',
      'Within hours, succession is announced.'
    ],
    paragraph: 'No childhood preparation can make this normal. But you built a machine around them. And now the machine demands a driver.',
    tinyTruth: 'Power trains reflexes. Love trains conscience.'
  };

  let endingTitle, endingCode, rarity, careerTitle, topBadge, epilogue;
  if (ending === 'A') {
    endingTitle = 'The Next Supreme Leader';
    endingCode = 'RT-PRK-001';
    rarity = 'Classified';
    careerTitle = 'Supreme Leader of North Korea';
    topBadge = '🟥 Insane Start: Dynasty Maintained';
    epilogue = `${childName} takes power and maintains control. Stability comes wrapped in surveillance. Loyalty is engineered; trust is rare. They learn the art of appearing immovable, and the cost of never being fully known.`;
  } else if (ending === 'B') {
    endingTitle = 'The Revolution';
    endingCode = 'RT-PRK-002';
    rarity = 'Rare';
    careerTitle = `Civilian Life — ${jobTitle}`;
    topBadge = '🟦 Insane Start: Overthrown';
    epilogue = `A democratic movement breaks the old machine. ${childName} survives the transition and, with enough empathy to integrate, becomes a regular citizen. They take a job as ${jobTitle}, learning how ordinary life is its own kind of courage.`;
  } else {
    endingTitle = 'The Unifier';
    endingCode = 'RT-PRK-003';
    rarity = 'Legendary';
    careerTitle = `Retired Reformer — ${jobTitle}`;
    topBadge = '🟩 Insane Start: Elections & Unification';
    epilogue = `${childName} takes command, then opens elections. They lead a careful unification with the South, step down, and work as ${jobTitle}. Power was a bridge, not a throne.`;
  }

  // Basic additional sections for compatibility
  sections.letter = `Dear Parent,\n\nWe trained for a throne. I kept the parts I needed and tried to grow the parts I needed more. Whatever came next, I learned that fear moves people quickly; love moves them far.`;
  sections.careerWealth = `Career: ${careerTitle}. Money matters less than legitimacy; routine matters more than drama.`;
  sections.relationships = 'They keep a tiny circle. Paranoia fades slowly; steadiness arrives slowly.';
  sections.family = 'Family is security theater and also real. Both truths exist.';
  sections.visits = 'Distance is measured in risk, not miles. Contacts become deliberate and safe.';
  sections.forgiveness = 'Repair takes years. Some doors open. Some stay closed.';
  sections.happiness = 'Happiness is replaced by meaning. Later, meaning makes room for peace.';
  sections.retirement = "Whatever power didn't consume is set down. Ordinary life is a surprising relief.";
  sections.parentingStyle = 'Your style echoed here: boundaries, image, and—when you chose it—warmth.';
  sections.epilogue = epilogue;
  sections.howTheyGrew = `INT ${INT} • EMP ${EMP} • DIS ${DIS} • CON ${CON}`;

  return {
    version: 'v3-noai',
    endingTitle,
    endingCode,
    rarity,
    topBadge,
    careerTitle,
    sections
  };
}