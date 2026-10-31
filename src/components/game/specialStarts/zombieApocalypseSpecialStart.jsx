// Zombie Apocalypse Special Start — Year-specific scenarios with wife arc
// PG-13, comedic tone, no graphic violence

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

const ZOMBIE_LORE_BY_AGE = {
  1: "You learn the first law of the new world: noise travels farther than courage. You start teaching {childName} tiny games—freeze on a hand-squeeze, breathe through the scary parts, move only when the wind covers you.",
  2: "Winter makes everything brittle. Walkers slow down, but they never stop. A scouting run goes wrong—and your world gets smaller overnight.",
  3: "Settlements trade batteries like gold and stories like medicine. You hear whispers about a migrating horde people call the Redline—an endless line of bodies that moves like weather.",
  4: "Rain turns roads into traps. Safe routes change, alliances shift, and grief becomes something you carry like a tool: not to use, just to survive holding.",
  5: "You stop thinking in days and start thinking in systems: water, light, walls, watch rotations. Your child learns that safety is built, not found.",
  6: "Someone starts a 'quiet school' in a basement. Kids practice reading lips, drawing maps, and telling jokes without sound. Somehow, laughter survives.",
  7: "People swear some walkers are changing—moving in clusters, lingering near lights, reacting to patterns. Whether it's evolution or imagination, you can't afford to ignore it.",
  8: "You help rig solar panels on a rooftop and the settlement sees electric light for the first time in years. A distant broadcast mentions a lab: 'Station Aurora'—and the word 'research' feels like a miracle.",
  9: "You learn to read the world like a forecast: wind direction, bird silence, the wrong kind of stillness. Your child starts noticing danger before you do.",
  10: "You salvage books from a flooded office tower. You don't just want {childName} to survive—you want them to remember what 'normal' once meant.",
  11: "Two settlements argue over a bridge and almost start a war over it. Zombies are the obvious enemy. People are the complicated one.",
  12: "{childName} wants more responsibility—scouting, watch duty, real decisions. You feel pride and fear arriving at the same time.",
  13: "A rumor spreads: a convoy with a prototype cure was seen moving north. Half the settlement wants to chase hope. Half wants to protect what exists.",
  14: "You find an abandoned university wing sealed behind heavy doors. On the walls: notes, dates, failed attempts—and one page labeled 'Not impossible.'",
  15: "Fewer walkers roam the roads, but they're harder to predict. Survival becomes less about sprinting and more about patience, community, and planning.",
  16: "The Redline returns. The settlement goes quiet in a way that feels rehearsed. Everyone checks straps, locks, signals—because this year, preparation is the only prayer that counts.",
  17: "After the worst of it, the world feels strangely open. You plant in the spring like it matters. You build like you'll be here to see it.",
  18: "{childName} stands on the wall at sunrise—older now, steadier. The world is scarred, but it's real. And you helped make it livable."
};

function injectLore(scenarioText, age, childName) {
  const loreRaw = ZOMBIE_LORE_BY_AGE[age];
  if (!loreRaw) return scenarioText;
  const lore = String(loreRaw).split('{childName}').join(childName);
  return `📻 Survivor Log — Year ${age}\n${lore}\n\n---\n\n${scenarioText}`;
}

export function buildZombieYearScenario({ state, age, rerollNonce = 0 }) {
  const childName = state.childName || 'your child';
  const wifeName = state.partnerName || 'your wife';
  const threat = state.zombieThreat || 20;
  const wifeState = state.zombieWifeState || "human";
  
  // Year 3: Wife is bitten (if she's still human)
  if (age === 3 && state.householdType === "two" && wifeState === "human") {
    return {
      id: 'zombie_wife_bitten_year_3',
      title: '🧟 Your Wife Is Bitten',
      age: 3,
      hookText: `A supply run went wrong. ${wifeName} got scratched by a walker. She's trying to stay calm. ${childName} is asking why Mom looks scared.`,
      scenarioText: injectLore(`A supply run went wrong. ${wifeName} got scratched by a walker. She's trying to stay calm. ${childName} is asking why Mom looks scared.\n\n🧟 Bite Risk: ${threat}%\n\nWhat do you do?`, age, childName),
      choices: [
        {
          id: 'keep',
          letter: 'A',
          role: 'boundary',
          text: `Keep her (locked room, safety plan)`,
          consequence: `You lock her in the basement. ${childName} asks where Mom is every night. You lie and say "resting." It's not sustainable, but she's still… here.`,
          deltas: { discipline: 0.3, empathy: -0.2 },
          loveDelta: -1,
          stressDelta: 2,
          meta: {
            zombieThreatDelta: 10,
            zombieInstantDeath: false,
            zombieWifeNextState: "zombie_kept"
          }
        },
        {
          id: 'disappear',
          letter: 'B',
          role: 'avoid',
          text: `Send her away (exile)`,
          consequence: `You tell her to leave. She walks into the woods without looking back. ${childName} asks where Mom went. You say "She's helping others." The truth hurts too much.`,
          deltas: { confidence: -0.3, empathy: -0.2 },
          loveDelta: -2,
          stressDelta: 1,
          meta: {
            zombieThreatDelta: -5,
            zombieInstantDeath: false,
            zombieWifeNextState: "missing"
          }
        },
        {
          id: 'end',
          letter: 'C',
          role: 'harm',
          text: `End it (mercy)`,
          consequence: `You do what needs to be done. ${childName} doesn't see. You bury her behind the house. The silence is permanent now.`,
          deltas: { discipline: 0.4, confidence: -0.4, empathy: -0.3 },
          loveDelta: -3,
          stressDelta: 3,
          meta: {
            zombieThreatDelta: -10,
            zombieInstantDeath: false,
            zombieWifeNextState: "dead"
          }
        },
        {
          id: 'denial',
          letter: 'D',
          role: 'avoid',
          text: `"It's just a scratch" (denial)`,
          consequence: `You convince yourself the fever is normal. Two days later, she's groaning and her eyes are milky. You panic and lock her in the basement. ${childName} heard everything.`,
          deltas: { discipline: -0.3, confidence: -0.3, empathy: -0.2 },
          loveDelta: -2,
          stressDelta: 3,
          meta: {
            zombieThreatDelta: 25,
            zombieInstantDeath: false,
            zombieWifeNextState: "zombie_kept"
          }
        }
      ],
      meta: {
        kind: 'zombie_survival',
        packId: 'zombie_apocalypse',
        choicePack: 'standard',
        category: 'survival',
        intensity: 3,
        hookId: 'zombie_wife_bitten_year_3'
      }
    };
  }
  
  // Year 7: She came back (if she was sent away and hasn't returned yet)
  if (age === 7 && wifeState === "missing" && !state.zombieWifeReturnUsed) {
    return {
      id: 'zombie_wife_return_year_7',
      title: '🧟 She Came Back',
      age: 7,
      hookText: `There's a knock at the door. It's ${wifeName}—or what used to be ${wifeName}. She's a walker now. ${childName} recognizes her voice through the door.`,
      scenarioText: injectLore(`There's a knock at the door. It's ${wifeName}—or what used to be ${wifeName}. She's a walker now. ${childName} recognizes her voice through the door.\n\nWhat do you do?`, age, childName),
      choices: [
        {
          id: 'let_in',
          letter: 'A',
          role: 'boundary',
          text: `Let her in (locked room again)`,
          consequence: `You let her in and lock her in the basement. ${childName} doesn't understand why Mom can't come upstairs. You say "She's sick." It's technically true.`,
          deltas: { discipline: 0.2, empathy: -0.2 },
          loveDelta: -1,
          stressDelta: 2,
          meta: {
            zombieThreatDelta: 15,
            zombieInstantDeath: false,
            zombieWifeNextState: "zombie_kept",
            zombieWifeReturnUsed: true
          }
        },
        {
          id: 'send_away',
          letter: 'B',
          role: 'boundary',
          text: `Send her away again`,
          consequence: `You tell her—it—to leave. She stumbles back into the woods. ${childName} cries for hours. You don't have words.`,
          deltas: { discipline: 0.3, confidence: -0.2, empathy: -0.2 },
          loveDelta: -2,
          stressDelta: 2,
          meta: {
            zombieThreatDelta: -5,
            zombieInstantDeath: false,
            zombieWifeNextState: "dead",
            zombieWifeReturnUsed: true
          }
        },
        {
          id: 'end_it',
          letter: 'C',
          role: 'harm',
          text: `End it (final choice)`,
          consequence: `You do what you should have done four years ago. ${childName} doesn't watch. You bury what's left. It's over now.`,
          deltas: { discipline: 0.4, confidence: -0.3, empathy: -0.3 },
          loveDelta: -3,
          stressDelta: 3,
          meta: {
            zombieThreatDelta: -10,
            zombieInstantDeath: false,
            zombieWifeNextState: "dead",
            zombieWifeReturnUsed: true
          }
        },
        {
          id: 'freeze',
          letter: 'D',
          role: 'avoid',
          text: `Freeze (panic)`,
          consequence: `You freeze. ${childName} opens the door. She lunges. You push ${childName} aside and she gets you instead. You're bitten. Game over.`,
          deltas: {},
          loveDelta: 0,
          stressDelta: 0,
          meta: {
            zombieThreatDelta: 0,
            zombieInstantDeath: true,
            zombieWifeNextState: "dead",
            zombieWifeReturnUsed: true
          }
        }
      ],
      meta: {
        kind: 'zombie_survival',
        packId: 'zombie_apocalypse',
        choicePack: 'standard',
        category: 'survival',
        intensity: 3,
        hookId: 'zombie_wife_return_year_7'
      }
    };
  }
  
  // Year 16: Vaccine exists (if wife is still a zombie)
  if (age === 16 && wifeState === "zombie_kept") {
    return {
      id: 'zombie_vaccine_year_16',
      title: '💉 The Vaccine Exists',
      age: 16,
      hookText: `A trader shows up with a single dose of the cure. Real, verified, working. He wants $5,000 or three months of labor. ${childName} is old enough to understand what this means.`,
      scenarioText: injectLore(`A trader shows up with a single dose of the cure. Real, verified, working. He wants $5,000 or three months of labor. ${childName} is old enough to understand what this means.\n\nWhat do you do?`, age, childName),
      choices: [
        {
          id: 'use_vaccine',
          letter: 'A',
          role: 'connect',
          text: `Use it on her (bring Mom back)`,
          consequence: `You pay everything. The vaccine works. ${wifeName} wakes up human again—scared, confused, and crying. ${childName} hugs her for the first time in 13 years. Your family is together again.`,
          deltas: { empathy: 0.5, confidence: 0.3 },
          loveDelta: 3,
          stressDelta: -2,
          meta: {
            zombieThreatDelta: -15,
            zombieInstantDeath: false,
            zombieWifeNextState: "cured",
            zombieMoneyDelta: -5000
          }
        },
        {
          id: 'save_it',
          letter: 'B',
          role: 'boundary',
          text: `Save it for later (insurance)`,
          consequence: `You hide the vaccine. "Not yet," you tell ${childName}. "We might need it more later." ${childName} doesn't forgive you for this. The basement groaning continues.`,
          deltas: { discipline: 0.3, empathy: -0.3, confidence: -0.2 },
          loveDelta: -2,
          stressDelta: 1,
          meta: {
            zombieThreatDelta: 5,
            zombieInstantDeath: false,
            zombieWifeNextState: "zombie_kept"
          }
        },
        {
          id: 'trade_it',
          letter: 'C',
          role: 'avoid',
          text: `Trade it (survival resources)`,
          consequence: `You trade the vaccine for supplies and ammo. ${childName} watches silently. "Mom's gone anyway," you say. ${childName} stops talking to you for weeks.`,
          deltas: { discipline: 0.2, empathy: -0.4, confidence: -0.2 },
          loveDelta: -3,
          stressDelta: 2,
          meta: {
            zombieThreatDelta: 10,
            zombieInstantDeath: false,
            zombieWifeNextState: "zombie_kept",
            zombieMoneyDelta: 8000
          }
        },
        {
          id: 'drop_it',
          letter: 'D',
          role: 'harm',
          text: `Drop it / ruin it (accident)`,
          consequence: `You fumble during the handoff. The vial shatters on the ground. The trader leaves. ${childName} stares at you in disbelief. "You had one job, Dad." Mom stays in the basement forever.`,
          deltas: { confidence: -0.5, empathy: -0.3 },
          loveDelta: -4,
          stressDelta: 3,
          meta: {
            zombieThreatDelta: 20,
            zombieInstantDeath: false,
            zombieWifeNextState: "zombie_kept"
          }
        }
      ],
      meta: {
        kind: 'zombie_survival',
        packId: 'zombie_apocalypse',
        choicePack: 'standard',
        category: 'survival',
        intensity: 3,
        hookId: 'zombie_vaccine_year_16'
      }
    };
  }
  
  // Generic yearly zombie scenarios (v1 behavior)
  const ZOMBIE_SCENARIOS = [
    {
      title: '🧟 Horde at the Gate',
      hookText: `A horde surrounds the safe house. ${childName} is watching from the window. The walls won't hold forever.`,
      choices: [
        { id: 'smart', letter: 'A', role: 'teach', text: 'Set a diversion and escape quietly', consequence: `You light a fire three blocks away. The horde follows the noise. You and ${childName} slip out the back. Smart survives.`, deltas: { intelligence: 0.4, discipline: 0.2 }, loveDelta: 1, stressDelta: 0, meta: { zombieThreatDelta: -10 } },
        { id: 'risky', letter: 'B', role: 'boundary', text: 'Fight your way out', consequence: `You grab a bat and make noise. It works… barely. ${childName} sees too much. You both make it, but the fear sticks.`, deltas: { confidence: 0.3, discipline: 0.2 }, loveDelta: 0, stressDelta: 1, meta: { zombieThreatDelta: 20 } },
        { id: 'panic', letter: 'C', role: 'avoid', text: 'Hide and hope they leave', consequence: `You hide in a closet for 18 hours. The horde wanders off. ${childName} whispers, "Are we safe now?" You don't know.`, deltas: { confidence: -0.3, discipline: -0.2 }, loveDelta: -1, stressDelta: 2, meta: { zombieThreatDelta: 35 } },
        { id: 'death', letter: 'D', role: 'harm', text: 'Run outside screaming', consequence: `You panic and run outside. Big mistake. You're bitten in seconds.`, deltas: {}, loveDelta: 0, stressDelta: 0, meta: { zombieThreatDelta: 0, zombieInstantDeath: true } }
      ]
    },
    {
      title: '🧟 Food Is Running Out',
      hookText: `The pantry is almost empty. ${childName} is hungry. There's a store two blocks away… and it's crawling with walkers.`,
      choices: [
        { id: 'plan', letter: 'A', role: 'teach', text: 'Scout, plan, execute (careful)', consequence: `You scout for hours, find a safe route, grab what you need, and get out. ${childName} learns patience is survival.`, deltas: { intelligence: 0.4, discipline: 0.3 }, loveDelta: 1, stressDelta: 0, meta: { zombieThreatDelta: -10 } },
        { id: 'rush', letter: 'B', role: 'boundary', text: 'Quick in and out (risky)', consequence: `You sprint in, grab cans, sprint out. A walker grabs your jacket. You tear free. ${childName} sees your hands shaking.`, deltas: { confidence: 0.2 }, loveDelta: 0, stressDelta: 1, meta: { zombieThreatDelta: 20 } },
        { id: 'ration', letter: 'C', role: 'avoid', text: 'Ration what you have (hungry)', consequence: `You split one can between two people for three days. ${childName} stops complaining about being hungry. That's worse.`, deltas: { discipline: 0.2, confidence: -0.2 }, loveDelta: -1, stressDelta: 1, meta: { zombieThreatDelta: 35 } },
        { id: 'yolo', letter: 'D', role: 'harm', text: 'Run in without a plan', consequence: `You charge in with no strategy. A walker gets you from behind. Game over.`, deltas: {}, loveDelta: 0, stressDelta: 0, meta: { zombieThreatDelta: 0, zombieInstantDeath: true } }
      ]
    },
    {
      title: '🧟 Survivor Group Invitation',
      hookText: `A group of survivors invites you to join their camp. They have walls, food, and rules. ${childName} wants to go. You're not sure you trust strangers.`,
      choices: [
        { id: 'join', letter: 'A', role: 'connect', text: 'Join the group (community)', consequence: `You join. The walls are real, the food is shared, and ${childName} makes a friend. Safety has a cost, but isolation costs more.`, deltas: { empathy: 0.4, confidence: 0.2 }, loveDelta: 2, stressDelta: -1, meta: { zombieThreatDelta: -10 } },
        { id: 'test', letter: 'B', role: 'teach', text: 'Test them first (cautious)', consequence: `You stay nearby for a week, watch their patterns, then join. ${childName} learns trust is earned, not assumed.`, deltas: { intelligence: 0.3, discipline: 0.2 }, loveDelta: 1, stressDelta: 0, meta: { zombieThreatDelta: 20 } },
        { id: 'refuse', letter: 'C', role: 'boundary', text: 'Refuse (stay solo)', consequence: `You say no. ${childName} asks why. You say "We don't need them." Winter is hard alone.`, deltas: { discipline: 0.2, confidence: -0.2 }, loveDelta: -1, stressDelta: 1, meta: { zombieThreatDelta: 35 } },
        { id: 'attack', letter: 'D', role: 'harm', text: 'Attack them (paranoia)', consequence: `You pull a weapon on them. They respond. You're outnumbered. You're bitten in the fight.`, deltas: {}, loveDelta: 0, stressDelta: 0, meta: { zombieThreatDelta: 0, zombieInstantDeath: true } }
      ]
    },
    {
      title: '🧟 Stranger Needs Help',
      hookText: `A stranger is being chased by walkers. They're screaming for help. ${childName} wants to help. You know opening the door is a risk.`,
      choices: [
        { id: 'help', letter: 'A', role: 'connect', text: 'Help them (humanity first)', consequence: `You open the gate, pull them in, lock it fast. ${childName} learns: we save people when we can. The stranger is grateful. Threat decreases.`, deltas: { empathy: 0.5, confidence: 0.2 }, loveDelta: 2, stressDelta: 0, meta: { zombieThreatDelta: -10 } },
        { id: 'observe', letter: 'B', role: 'teach', text: 'Watch first (verify)', consequence: `You wait to see if it's a trap. It's not. You help them after the walkers pass. ${childName} learns caution and compassion can coexist.`, deltas: { intelligence: 0.3, empathy: 0.2 }, loveDelta: 1, stressDelta: 0, meta: { zombieThreatDelta: 20 } },
        { id: 'ignore', letter: 'C', role: 'avoid', text: 'Ignore them (safety first)', consequence: `You close the blinds. The screaming stops. ${childName} asks, "Why didn't we help?" You don't have a good answer.`, deltas: { discipline: 0.2, empathy: -0.4, confidence: -0.2 }, loveDelta: -2, stressDelta: 1, meta: { zombieThreatDelta: 35 } },
        { id: 'bait', letter: 'D', role: 'harm', text: 'Use them as bait', consequence: `You lock them outside to distract the horde. It works. ${childName} learns the wrong lesson. And you get bitten trying to close the gate.`, deltas: {}, loveDelta: 0, stressDelta: 0, meta: { zombieThreatDelta: 0, zombieInstantDeath: true } }
      ]
    }
  ];
  
  // Pick a random scenario based on seed
  const rng = createSeededRng(`${state.runSeed || 'seed'}|zombie|age:${age}|reroll:${rerollNonce}`);
  const picked = rng.pick(ZOMBIE_SCENARIOS);
  
  return {
    id: `zombie_year_${age}_v${rerollNonce}`,
    title: picked.title,
    age: age,
    hookText: picked.hookText,
    scenarioText: injectLore(`${picked.hookText}\n\n🧟 Bite Risk: ${threat}%\n\nWhat do you do?`, age, childName),
    choices: picked.choices,
    meta: {
      kind: 'zombie_survival',
      packId: 'zombie_apocalypse',
      choicePack: 'standard',
      category: 'survival',
      intensity: 3,
      hookId: `zombie_year_${age}`
    }
  };
}

export function buildZombieTrainingScenario({ state, age, rerollNonce = 0 }) {
  const childName = state.childName || 'your child';
  const training = state.zombieTraining || 0;
  
  const TRAINING_VARIANTS = [
    {
      id: 'bandage_basics',
      title: '🩹 Bandage Basics',
      hookText: `You teach ${childName} how to clean and wrap wounds using supplies you found in an abandoned pharmacy. The bandages are expired, but knowledge isn't.`,
      choices: [
        { id: 'thorough', letter: 'A', text: 'Full first-aid course (supplies)', deltas: { intelligence: 0.3, empathy: 0.2 }, moneyDelta: -150, training: 10, consequence: `${childName} learns pressure points, tourniquets, and when to say "we need real help." This could save a life.` },
        { id: 'basics', letter: 'B', text: 'Cover the essentials (conserve)', deltas: { intelligence: 0.2, discipline: 0.1 }, moneyDelta: -80, training: 7, consequence: `You teach clean hands, pressure, and bandages. ${childName} gets the idea. Good enough for now.` },
        { id: 'practice', letter: 'C', text: 'Practice on a teddy bear (free)', deltas: { confidence: 0.2 }, moneyDelta: 0, training: 4, consequence: `The teddy bear is now a trauma patient. ${childName} giggles and learns anyway.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'quiet_feet',
      title: '👣 Quiet Feet Challenge',
      hookText: `You teach ${childName} to move silently. Walkers track sound. Crunchy leaves are the enemy.`,
      choices: [
        { id: 'drills', letter: 'A', text: 'Daily stealth drills', deltas: { discipline: 0.3, confidence: 0.1 }, moneyDelta: -50, training: 8, consequence: `${childName} learns to roll heel-to-toe and breathe quietly. It's creepy how good they get.` },
        { id: 'game', letter: 'B', text: 'Make it a game (shoes off)', deltas: { discipline: 0.2, empathy: 0.1 }, moneyDelta: -20, training: 6, consequence: `"Ninja mode!" ${childName} loves it. You feel guilty making survival fun, but it works.` },
        { id: 'observe', letter: 'C', text: 'Watch walkers together (study)', deltas: { intelligence: 0.2, confidence: 0.1 }, moneyDelta: 0, training: 5, consequence: `You sit on a rooftop and observe walker behavior. ${childName} asks good questions. Fear becomes data.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'barricade_cardboard',
      title: '📦 Barricade Engineering (Cardboard Edition)',
      hookText: `You teach ${childName} how to fortify doors and windows using whatever you find. Today's lesson: cardboard boxes are surprisingly structural.`,
      choices: [
        { id: 'build', letter: 'A', text: 'Build a real barricade (supplies)', deltas: { intelligence: 0.3, discipline: 0.2 }, moneyDelta: -120, training: 10, consequence: `You build a layered door defense using wood, nails, and hope. ${childName} learns angles and leverage. Engineering in the apocalypse.` },
        { id: 'theory', letter: 'B', text: 'Teach the theory (no supplies)', deltas: { intelligence: 0.3 }, moneyDelta: 0, training: 6, consequence: `You draw diagrams in the dirt. ${childName} nods and says "so it's like Jenga but backwards." Close enough.` },
        { id: 'test', letter: 'C', text: 'Test existing walls (inspection)', deltas: { discipline: 0.2, confidence: 0.1 }, moneyDelta: -40, training: 7, consequence: `You inspect every entry point together. ${childName} finds two weak spots you missed. Good eye.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'barter_school',
      title: '💰 Barter School',
      hookText: `Supplies are currency now. You teach ${childName} how to trade without getting ripped off (or stabbed).`,
      choices: [
        { id: 'roleplay', letter: 'A', text: 'Roleplay negotiations (practice)', deltas: { confidence: 0.3, empathy: 0.2 }, moneyDelta: -80, training: 8, consequence: `You pretend to be a grumpy trader. ${childName} learns to read faces and walk away when it smells wrong.` },
        { id: 'observe', letter: 'B', text: 'Watch real trades (field lesson)', deltas: { intelligence: 0.2, empathy: 0.2 }, moneyDelta: -50, training: 7, consequence: `You bring ${childName} to the market. They watch how people lie, bluff, and survive. It's an education.` },
        { id: 'trust', letter: 'C', text: 'Teach value of trust', deltas: { empathy: 0.3, confidence: 0.1 }, moneyDelta: 0, training: 5, consequence: `You explain: "Fair trades build reputation. Reputation keeps you alive." ${childName} gets it.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'water_logistics',
      title: '💧 Water Logistics',
      hookText: `Clean water is rarer than bullets. You teach ${childName} collection, filtration, and rationing.`,
      choices: [
        { id: 'system', letter: 'A', text: 'Build a rain collection system', deltas: { intelligence: 0.3, discipline: 0.2 }, moneyDelta: -100, training: 9, consequence: `You rig tarps, barrels, and a basic filter. ${childName} learns systems thinking. Water becomes predictable.` },
        { id: 'purify', letter: 'B', text: 'Teach purification methods', deltas: { intelligence: 0.3, discipline: 0.1 }, moneyDelta: -60, training: 8, consequence: `Boil, filter, test. ${childName} memorizes the steps. You practice until it's automatic.` },
        { id: 'ration', letter: 'C', text: 'Practice rationing discipline', deltas: { discipline: 0.3, confidence: 0.1 }, moneyDelta: 0, training: 6, consequence: `You give ${childName} a canteen and say "make it last three days." They do. Discipline is survival.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'morale_night',
      title: '🎭 Morale Night',
      hookText: `Survival isn't just physical. You organize a "morale night"—jokes, stories, and pretending the world is normal for two hours.`,
      choices: [
        { id: 'stories', letter: 'A', text: 'Share stories (bonding)', deltas: { empathy: 0.3, confidence: 0.2 }, moneyDelta: -60, training: 7, consequence: `You tell stories about the old world. ${childName} laughs. For a moment, you're not just surviving—you're living.` },
        { id: 'music', letter: 'B', text: 'Make music (battery-powered radio)', deltas: { empathy: 0.2, confidence: 0.2 }, moneyDelta: -40, training: 6, consequence: `You find a working radio and dance in the living room. ${childName} says "this is weird." You say "good weird."` },
        { id: 'game', letter: 'C', text: 'Play a board game (old box)', deltas: { empathy: 0.2, confidence: 0.1 }, moneyDelta: 0, training: 5, consequence: `You play Monopoly with half the pieces missing. ${childName} wins. Normalcy is a gift.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'map_reading',
      title: '🗺️ Map Reading for Beginners',
      hookText: `GPS is dead. Paper maps are gold. You teach ${childName} how to navigate without getting lost (or eaten).`,
      choices: [
        { id: 'practice', letter: 'A', text: 'Practice routes (field work)', deltas: { intelligence: 0.3, confidence: 0.2 }, moneyDelta: -90, training: 9, consequence: `You walk three routes together and quiz directions. ${childName} learns landmarks, cardinal directions, and when to turn back.` },
        { id: 'theory', letter: 'B', text: 'Teach map symbols (classroom)', deltas: { intelligence: 0.3, discipline: 0.1 }, moneyDelta: -30, training: 7, consequence: `You explain contour lines, scale, and "the red X means walkers." ${childName} is a fast learner.` },
        { id: 'trust', letter: 'C', text: 'Trust their instincts', deltas: { confidence: 0.3, empathy: 0.1 }, moneyDelta: 0, training: 5, consequence: `You let ${childName} lead a short trip. They get you home. Pride blooms in dark times.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'self_defense',
      title: '🥊 Self-Defense Drills',
      hookText: `You teach ${childName} basic self-defense—how to escape a grab, when to run, and when to fight. No graphic violence. Just survival skills.`,
      choices: [
        { id: 'drills', letter: 'A', text: 'Full defense training (gear + practice)', deltas: { discipline: 0.3, confidence: 0.3 }, moneyDelta: -130, training: 10, consequence: `You teach holds, escapes, and the golden rule: "Run first, fight last." ${childName} practices until muscle memory kicks in.` },
        { id: 'basics', letter: 'B', text: 'Teach the basics (awareness)', deltas: { confidence: 0.2, discipline: 0.2 }, moneyDelta: -70, training: 8, consequence: `You cover awareness, spacing, and "yell before you swing." ${childName} learns to be loud and fast.` },
        { id: 'psychology', letter: 'C', text: 'Teach psychology of threat', deltas: { intelligence: 0.3, empathy: 0.1 }, moneyDelta: 0, training: 6, consequence: `You explain: "Most threats want easy targets. Don't be easy." ${childName} stands a little taller.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'zombie_garden',
      title: '🌱 Garden of Questionable Vegetables',
      hookText: `You teach ${childName} to grow food in contaminated soil. The tomatoes look suspicious, but they're edible. Probably.`,
      choices: [
        { id: 'system', letter: 'A', text: 'Build a real garden (seeds + tools)', deltas: { discipline: 0.3, intelligence: 0.2 }, moneyDelta: -110, training: 9, consequence: `You plant, water, and wait. ${childName} learns patience and the miracle of photosynthesis. The tomatoes are… fine.` },
        { id: 'forage', letter: 'B', text: 'Teach foraging (free food)', deltas: { intelligence: 0.3, discipline: 0.1 }, moneyDelta: -40, training: 7, consequence: `You identify edible plants together. ${childName} asks "what if we're wrong?" You say "we test small amounts first." Science!` },
        { id: 'inspire', letter: 'C', text: 'Make it hopeful (morale)', deltas: { empathy: 0.2, confidence: 0.2 }, moneyDelta: 0, training: 5, consequence: `You say "growing food is hope you can eat." ${childName} smiles. The garden becomes a ritual.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'radio_etiquette',
      title: '📻 Radio Etiquette',
      hookText: `Communication is life. You teach ${childName} radio protocol, codes, and when to stay silent.`,
      choices: [
        { id: 'codes', letter: 'A', text: 'Teach codes and protocol', deltas: { intelligence: 0.3, discipline: 0.2 }, moneyDelta: -70, training: 8, consequence: `You drill call signs, brevity codes, and "never say your real location." ${childName} becomes a radio pro.` },
        { id: 'listen', letter: 'B', text: 'Practice listening (passive)', deltas: { intelligence: 0.2, discipline: 0.1 }, moneyDelta: -30, training: 6, consequence: `You tune into survivor channels and decode patterns. ${childName} learns: information is survival.` },
        { id: 'trust', letter: 'C', text: 'Teach when to trust voices', deltas: { empathy: 0.2, confidence: 0.2 }, moneyDelta: 0, training: 5, consequence: `You explain: "Some voices are traps. Some are hope. Listen for the difference." ${childName} gets it.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'community_rules',
      title: '🤝 Community Rules Workshop',
      hookText: `You teach ${childName} how survivor groups work: contribute, respect, and don't steal rations. Simple rules keep people alive.`,
      choices: [
        { id: 'roleplay', letter: 'A', text: 'Roleplay group scenarios', deltas: { empathy: 0.3, discipline: 0.2 }, moneyDelta: -60, training: 8, consequence: `You practice "what if someone hoards food?" and "what if someone lies?" ${childName} learns diplomacy.` },
        { id: 'stories', letter: 'B', text: 'Tell stories (cautionary)', deltas: { empathy: 0.2, intelligence: 0.2 }, moneyDelta: 0, training: 6, consequence: `You tell stories of groups that fell apart. ${childName} learns: trust is fragile, rules protect it.` },
        { id: 'values', letter: 'C', text: 'Teach core values', deltas: { empathy: 0.3, confidence: 0.1 }, moneyDelta: 0, training: 5, consequence: `"Help when you can. Don't take more than you need. Protect the weak." ${childName} memorizes it.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    },
    {
      id: 'scavenge_planning',
      title: '🔍 Scavenge Planning (Not the Scavenge)',
      hookText: `You don't take ${childName} scavenging yet—but you teach the planning part. Routes, risks, and the art of the quiet exit.`,
      choices: [
        { id: 'plan', letter: 'A', text: 'Full planning drills (maps + timing)', deltas: { intelligence: 0.3, discipline: 0.2 }, moneyDelta: -75, training: 8, consequence: `You map buildings, mark exits, and time walker patrol patterns. ${childName} learns: luck is just planning you can't see.` },
        { id: 'stories', letter: 'B', text: 'Tell scavenge war stories', deltas: { intelligence: 0.2, confidence: 0.2 }, moneyDelta: 0, training: 6, consequence: `You tell ${childName} about close calls and smart escapes. They absorb the lessons without the trauma.` },
        { id: 'quiz', letter: 'C', text: 'Quiz them on risks', deltas: { discipline: 0.2, intelligence: 0.2 }, moneyDelta: 0, training: 5, consequence: `"What if the door is locked? What if you hear footsteps?" ${childName} thinks through scenarios. Fear becomes strategy.` },
        { id: 'skip', letter: 'D', text: 'Skip training this year', deltas: {}, moneyDelta: 0, training: 0, consequence: `You're too tired this year. Training will wait.` }
      ]
    }
  ];
  
  const rng = createSeededRng(`${state.runSeed || 'seed'}|zombie|training|age:${age}|nonce:${rerollNonce}`);
  const picked = rng.pick(TRAINING_VARIANTS);
  
  const scenarioText = injectLore(`${picked.hookText}\n\n🧠 Survivor Training: ${training}/100\n\nWhat do you teach ${childName} this year?`, age, childName);
  
  const choicesWithPatches = picked.choices.map(c => ({
    ...c,
    statePatch: c.training > 0 ? ((prev) => {
      const cur = Number(prev.zombieTraining || 0);
      return { zombieTraining: Math.max(0, Math.min(100, cur + c.training)) };
    }) : null
  }));
  
  return {
    id: `zombie_training_${age}_${picked.id}`,
    title: picked.title,
    age: age,
    hookText: picked.hookText,
    scenarioText: scenarioText,
    choices: choicesWithPatches,
    meta: {
      kind: 'zombie_training',
      packId: 'zombie_apocalypse',
      choicePack: 'standard',
      category: 'training',
      intensity: 2,
      hookId: `zombie_training_${age}`
    }
  };
}