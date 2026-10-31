// LEGENDARY ENDINGS SYSTEM - Deterministic, Rare, Shareable
// All text is prewritten here (no runtime AI)

// Helper to get salutation
function getLetterSalutation(state) {
  const role = state.parentRole || "Parent";
  if (role === "mom") return "Dear Mom,";
  if (role === "dad") return "Dear Dad,";
  return "Dear Parent,";
}

// Helper to replace placeholders
function format(text, state) {
  const childName = state.childName || "Your Child";
  const salutation = getLetterSalutation(state);
  
  return text
    .replace(/\{SALUTATION\}/g, salutation)
    .replace(/\{childName\}/g, childName);
}

// ===== LEGENDARY ENDINGS CATALOG =====
export const LEGENDARY_ENDINGS = [
  // 1) CYCLE_BREAKER
  {
    id: "CYCLE_BREAKER",
    title: "Cycle Breaker",
    trophyName: "Cycle Breaker",
    priority: 50,
    weight: 5,
    
    requires: (state) => {
      const m = state.milestones || {};
      const st = state.stats || {};
      const L = st.love || state.love || 0;
      const E = st.empathy || 0;
      
      return (m.parentTraumasSelected || 0) >= 2
          && (m.parentTraumasHealed || 0) >= 1
          && L >= 8
          && E >= 22;
    },
    
    apply: (state, outcome, rng) => {
      const letters = [
        "{SALUTATION}\n\nI don't think you realize how rare it is to be raised by someone who decides to heal.\nYou didn't pretend you were perfect. You didn't make your pain my homework.\nYou learned. You tried again. You repaired.\n\nI still have struggles—because I'm human.\nBut I also have a steady feeling underneath it all:\nI am safe to grow.\n\nLove,\n{childName}",
        
        "{SALUTATION}\n\nYou broke patterns you didn't create.\nThat might be the most heroic thing you can do without a cape.\n\nWhen you messed up, you came back.\nWhen you got scared, you got curious.\nWhen old ghosts showed up, you didn't hand them the steering wheel.\n\nI'm proud of you.\nAnd yeah… I'm proud of me too.\n\n— {childName}",
        
        "{SALUTATION}\n\nSome families pass down heirlooms.\nOurs passed down coping skills.\n\nYou taught me that feelings aren't emergencies.\nThat mistakes aren't identities.\nAnd that love can be consistent—even when life isn't.\n\nI'm taking that with me.\nAlways.\n\n— {childName}",
        
        "{SALUTATION}\n\nYou didn't erase the past.\nYou stopped it from becoming my future.\n\nThat changed everything.\n\n— {childName}",
        
        "{SALUTATION}\n\nYou chose the hard kind of strength: therapy, reflection, learning.\nNo fireworks. Just real change.\n\nIt worked.\nI feel it in the way I treat myself.\n\nThank you.\n\n— {childName}"
      ];
      
      const epilogues = [
        "Epilogue: Some legacies are broken. Others are built.",
        "Epilogue: The family story didn't end. It evolved.",
        "Epilogue: Healing became the loudest tradition.",
        "Epilogue: The cycle didn't survive you."
      ];
      
      const shareLines = [
        "🏆 Cycle Breaker unlocked — my kid grew up loved *and* I grew up too.",
        "I got the 'Cycle Breaker' ending in Raising Tomorrow. It hit me in the chest.",
        "Raising Tomorrow: I healed enough that my kid felt safe. 10/10 cried a little."
      ];
      
      const letter = format(rng.pick(letters), state);
      const epilogue = rng.pick(epilogues);
      const shareLine = rng.pick(shareLines);
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: letter,
        tinyTruth: null
      };
      
      outcome.sections.epilogue = {
        ...outcome.sections.epilogue,
        paragraph: epilogue
      };
      
      outcome.specialEnding = {
        id: "CYCLE_BREAKER",
        title: "Cycle Breaker",
        trophyName: "Cycle Breaker",
        shareLine
      };
    }
  },
  
  // 2) MARS_PIONEER
  {
    id: "MARS_PIONEER",
    title: "First Human on Mars",
    trophyName: "Mars Pioneer",
    priority: 90,
    weight: 2,
    
    requires: (state) => {
      const st = state.stats || {};
      const m = state.milestones || {};
      const room = state.room || { seeds: {} };
      const seeds = room.seeds || {};
      
      const I = st.intelligence || 0;
      const E = st.empathy || 0;
      const C = st.confidence || 0;
      const D = st.discipline || 0;
      
      const spaceSeed = (seeds.space || 0) + (seeds.science || 0) + (seeds.engineering || 0);
      
      return I >= 44
          && E >= 34
          && C >= 28
          && D >= 20
          && spaceSeed >= 4
          && m.scienceFairChampion === true;
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: Against ridiculous odds, they became the first human to step onto Mars. History remembers their name—and the quiet discipline it took to get there.",
        "Career & Wealth: They trained for years, failed publicly, tried again, and finally earned a place on the first Mars mission. The paycheck was good. The legacy was unreal.",
        "Career & Wealth: Their mind was sharp, their heart stayed human, and their courage held steady. That rare mix got them to Mars before anyone else.",
        "Career & Wealth: They didn't just chase space. They chased meaning. The result was one small step… and a very big headline."
      ];
      
      const letters = [
        "{SALUTATION}\n\nI'm writing this from a place that used to be a red dot in textbooks.\nMars is quieter than I expected.\n\nEveryone asks about my training. No one asks about my childhood.\nBut I know where the real foundation was:\nThe way you helped me fail without shame.\nThe way you made curiosity feel safe.\n\nI carried that farther than gravity.\n\nLove,\n{childName}",
        
        "{SALUTATION}\n\nI know it sounds fake:\nI'm the first person on Mars.\n\nBut the truth is less glamorous and more you:\nroutines, support, repair, and patience when I was messy.\n\nAnyway, if you ever see a kid staring at the sky… be kind.\nThey might be building a life.\n\n— {childName}",
        
        "{SALUTATION}\n\nMars is mostly dust and math.\nBut sometimes, in the habitat's quiet, I remember you reading to me and taking me seriously.\n\nThat mattered more than the rocket.\n\n— {childName}",
        
        "{SALUTATION}\n\nI used to put space posters on my wall.\nYou thought it was cute.\nI thought it was a plan.\n\nIt worked.\n\n— {childName}",
        
        "{SALUTATION}\n\nThey asked who inspired me.\nI could've said a scientist.\nI said: my parent.\nBecause you made learning feel like love.\n\n— {childName}"
      ];
      
      const shareLines = [
        "🚀 Secret-ish ending: my kid became the first human on Mars.",
        "Raising Tomorrow: I got the 'First Human on Mars' ending. Absolutely wild.",
        "Mars ending unlocked. Space posters were not just decor apparently."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "MARS_PIONEER",
        title: "First Human on Mars",
        trophyName: "Mars Pioneer",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 3) ASTEROID_MINER
  {
    id: "ASTEROID_MINER",
    title: "Asteroid Prospector",
    trophyName: "Asteroid Prospector",
    priority: 70,
    weight: 4,
    
    requires: (state) => {
      const st = state.stats || {};
      const room = state.room || { seeds: {} };
      const seeds = room.seeds || {};
      
      const I = st.intelligence || 0;
      const C = st.confidence || 0;
      const D = st.discipline || 0;
      const E = st.empathy || 0;
      
      const spaceSeed = (seeds.space || 0) + (seeds.science || 0) + (seeds.engineering || 0);
      
      return I >= 40
          && C >= 18
          && D >= 16
          && spaceSeed >= 3
          && E >= 8 && E <= 30;
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They avoided the spotlight but mastered the frontier—working as an asteroid prospector. The money came in waves, like space‑tides.",
        "Career & Wealth: They found a niche in off‑world resource work: dangerous, technical, and weirdly profitable. They lived well—and slept in gravity only sometimes.",
        "Career & Wealth: They didn't need fame. They needed a challenge. Asteroid mining gave them both risk and reward."
      ];
      
      const letters = [
        "{SALUTATION}\n\nI'm not famous.\nBut I am… surprisingly rich.\n\nIt turns out rocks in space are worth more than most people's houses.\nThanks for letting me be curious without needing to be impressive.\n\n— {childName}",
        
        "{SALUTATION}\n\nI work in space, mostly with machines and math.\nWhen I miss Earth, I remember our small rituals.\nThe steady stuff.\n\nThat's home.\n\n— {childName}",
        
        "{SALUTATION}\n\nYou always said: 'Learn how things work.'\nI took that personally.\nNow I mine asteroids for a living.\n\nLife is strange.\n\n— {childName}"
      ];
      
      const shareLines = [
        "☄️ Asteroid Prospector ending unlocked — my kid got rich in the weirdest way.",
        "Raising Tomorrow: asteroid mining ending. Space capitalism speedrun."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "ASTEROID_MINER",
        title: "Asteroid Prospector",
        trophyName: "Asteroid Prospector",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 4) NOBEL_PEACE
  {
    id: "NOBEL_PEACE",
    title: "Nobel Peace Prize",
    trophyName: "Nobel Peace Prize Winner",
    priority: 85,
    weight: 3,
    
    requires: (state) => {
      const st = state.stats || {};
      const m = state.milestones || {};
      const studyCounts = state.studyCounts || {};
      
      const E = st.empathy || 0;
      const I = st.intelligence || 0;
      const C = st.confidence || 0;
      
      const studySum = (studyCounts.nvc || 0) + (studyCounts.positiveParenting || 0) + (studyCounts.empathyKids || 0);
      
      return E >= 45
          && I >= 34
          && C >= 20
          && ((m.communityServiceCount || 0) >= 2 || (m.donateCount || 0) >= 2)
          && studySum >= 10;
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They built peace where it didn't want to exist—negotiation, aid, coalition‑building. Eventually, it earned them a Nobel Peace Prize.",
        "Career & Wealth: Their work wasn't flashy. It was hard, human, and effective. The Nobel came later, like a footnote to years of quiet courage.",
        "Career & Wealth: They became a bridge‑builder—between groups, between ideologies, between people who forgot each other's humanity.",
        "Career & Wealth: They didn't win by dominating. They won by understanding. The world noticed."
      ];
      
      const relationships = [
        "Relationships: They learned to listen like it matters—and people kept coming back to that.",
        "Relationships: Their relationships weren't perfect. But they were honest. Repair became normal.",
        "Relationships: They held boundaries without losing kindness—rare, and magnetic.",
        "Relationships: They didn't collect people. They cultivated connection."
      ];
      
      const letters = [
        "{SALUTATION}\n\nThey gave me a medal and a speech.\nBut the real training happened at home:\nYou taught me to name feelings and still choose actions.\n\nEmpathy didn't make me weak.\nIt made me effective.\n\n— {childName}",
        
        "{SALUTATION}\n\nI learned early that people act tough when they're scared.\nYou didn't punish my fear. You helped me understand it.\n\nI use that skill every day.\nSometimes it changes a room.\nSometimes it changes a country.\n\nLove,\n{childName}",
        
        "{SALUTATION}\n\nMy job is basically: 'Turn drama into solutions.'\n\nThank you for teaching me the first version of that.\n\n— {childName}",
        
        "{SALUTATION}\n\nThe Nobel is shiny.\nThe real prize is that I can stay human under pressure.\n\nThat came from you.\n\n— {childName}"
      ];
      
      const shareLines = [
        "🏅 Nobel Peace Prize ending unlocked — empathy became a superpower.",
        "Raising Tomorrow: Nobel Peace Prize ending. I did not expect to feel emotional.",
        "Got the Nobel Peace ending. Studying empathy paid off."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.relationships = {
        headline: "Relationships",
        bullets: [],
        paragraph: rng.pick(relationships),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "NOBEL_PEACE",
        title: "Nobel Peace Prize",
        trophyName: "Nobel Peace Prize Winner",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 5) TIME_TRAVELER
  {
    id: "TIME_TRAVELER",
    title: "Time Traveler",
    trophyName: "Time Traveler",
    priority: 60,
    weight: 3,
    
    requires: (state) => {
      const st = state.stats || {};
      const room = state.room || { seeds: {} };
      const seeds = room.seeds || {};
      
      const I = st.intelligence || 0;
      const D = st.discipline || 0;
      const C = st.confidence || 0;
      
      const techSeed = (seeds.tech || 0) + (seeds.engineering || 0);
      
      return I >= 46
          && techSeed >= 3
          && D <= 12
          && C >= 20;
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They became a time traveler. No, really. The only proof you have is a museum photo of a sculpture made 5,000 years ago… with their face.",
        "Career & Wealth: They worked in experimental physics until 'impossible' became a scheduling issue. Then they vanished. Politely.",
        "Career & Wealth: Their research bent time like paper. After that, normal jobs felt… optional.",
        "Career & Wealth: They disappeared into a project so classified that even the future won't confirm it."
      ];
      
      const letters = [
        "{SALUTATION}\n\nThis letter might arrive before I wrote it.\nSorry.\n\nI did the thing everyone said not to do.\nI pushed the button.\nTime folded.\n\nI'm okay.\nI miss you in a weird, sideways way.\n\n— {childName}",
        
        "{SALUTATION}\n\nI used to stare at diagrams like they were stories.\nYou never mocked me for it.\n\nNow I'm… not exactly in the same year as you.\nBut you're still my anchor.\n\nLove,\n{childName}",
        
        "{SALUTATION}\n\nIf you find an ancient Egyptian statue of me…\nYes.\nIt's me.\nLong story.\n\n— {childName}",
        
        "{SALUTATION}\n\nI'm writing quickly.\nI have a meeting yesterday.\n\nThanks for raising me to be curious.\nOops.\n\n— {childName}"
      ];
      
      const epilogues = [
        "Epilogue: Time moved on. Sometimes literally.",
        "Epilogue: The future kept changing… but the early lessons stayed."
      ];
      
      const shareLines = [
        "⌛ Time Traveler ending unlocked. I have questions.",
        "Raising Tomorrow: my kid became a time traveler. The museum photo was insane."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.sections.epilogue = {
        ...outcome.sections.epilogue,
        paragraph: rng.pick(epilogues)
      };
      
      outcome.specialEnding = {
        id: "TIME_TRAVELER",
        title: "Time Traveler",
        trophyName: "Time Traveler",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 6) BLOCKCRAFT2_DEV
  {
    id: "BLOCKCRAFT2_DEV",
    title: "Invents the next mega‑game",
    trophyName: "BlockCraft 2 Developer",
    priority: 55,
    weight: 4,
    
    requires: (state) => {
      const st = state.stats || {};
      const m = state.milestones || {};
      const room = state.room || { seeds: {} };
      const seeds = room.seeds || {};
      
      const I = st.intelligence || 0;
      const D = st.discipline || 0;
      
      const techSeed = (seeds.tech || 0) + (seeds.engineering || 0);
      
      return I >= 38
          && D >= 16
          && (m.videoGameNights || 0) >= 2
          && (techSeed >= 2 || (seeds.engineering || 0) >= 2);
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They became a game developer and released BlockCraft 2. The internet called it 'Minecraft 2' even though it absolutely isn't. (It's better.)",
        "Career & Wealth: They built a game so addictive it became a cultural landmark. Their bank account became a jump‑scare.",
        "Career & Wealth: They turned imagination into code—and then turned code into a world millions lived inside.",
        "Career & Wealth: They shipped a game that made people feel creative again. That's rare wealth."
      ];
      
      const letters = [
        "{SALUTATION}\n\nRemember when you played games with me instead of judging them?\nYeah.\nThat mattered.\n\nNow millions of people are building tiny worlds.\nIt started in our living room.\n\n— {childName}",
        
        "{SALUTATION}\n\nI make games.\nWhich means I basically manufacture joy and arguments about updates.\n\nThank you for letting me be a nerd without shame.\n\n— {childName}",
        
        "{SALUTATION}\n\nThey asked how I learned discipline.\nI said: you made routines feel like support, not control.\n\nAlso: deadlines are scary.\n\nLove,\n{childName}",
        
        "{SALUTATION}\n\nMy game has a 'Parent NPC' in it.\nThey're surprisingly kind.\nI wonder where I got that.\n\n— {childName}"
      ];
      
      const shareLines = [
        "🧱 BlockCraft 2 ending unlocked — my kid made the next mega‑game.",
        "Raising Tomorrow: 'Minecraft 2' ending (not really Minecraft). Hilarious."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "BLOCKCRAFT2_DEV",
        title: "Invents the next mega‑game",
        trophyName: "BlockCraft 2 Developer",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 7) SUPREME_COMMANDER
  {
    id: "SUPREME_COMMANDER",
    title: "Dictator Ending",
    trophyName: "Supreme Commander",
    priority: 65,
    weight: 2,
    
    requires: (state) => {
      const st = state.stats || {};
      
      const C = st.confidence || 0;
      const D = st.discipline || 0;
      const I = st.intelligence || 0;
      const E = st.empathy || 0;
      
      return C >= 34
          && D >= 38
          && I >= 24
          && E <= 6;
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They rose through power structures fast. Eventually the world called them 'Supreme Commander.' History called it complicated.",
        "Career & Wealth: They built a regime on discipline and control. It worked… until it didn't.",
        "Career & Wealth: They became the kind of leader people obey. Not always the kind people trust."
      ];
      
      const relationships = [
        "Relationships: They treated closeness like a liability. Loyalty was earned, not given.",
        "Relationships: Their circle was small. Power makes relationships… weird."
      ];
      
      const letters = [
        "{SALUTATION}\n\nPeople salute when I enter rooms.\nIt's efficient.\n\nI'm good at control.\nI'm still learning kindness.\n\nYou taught me strength.\nI had to find empathy elsewhere.\n\n— {childName}",
        
        "{SALUTATION}\n\nI run a country now.\nI wish that automatically made me wise.\nIt doesn't.\n\nAnyway. I hope you're well.\n\n— {childName}",
        
        "{SALUTATION}\n\nI don't have time for feelings in public.\nBut I'm sending this anyway.\n\n— {childName}",
        
        "{SALUTATION}\n\nI learned early that rules make life predictable.\nI built a whole system out of that.\n\nTurns out humans don't love being systems.\n\n— {childName}",
        
        "{SALUTATION}\n\nI got what I wanted: power.\nNow I'm trying to figure out what I need.\n\n— {childName}"
      ];
      
      const shareLines = [
        "🎖️ Supreme Commander ending unlocked. It's… uncomfortable.",
        "Raising Tomorrow: dictator ending achieved. Do not recommend as a parenting goal."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.relationships = {
        headline: "Relationships",
        bullets: [],
        paragraph: rng.pick(relationships),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "SUPREME_COMMANDER",
        title: "Dictator Ending",
        trophyName: "Supreme Commander",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 8) CULT_FOUNDER
  {
    id: "CULT_FOUNDER",
    title: "Starts a Cult",
    trophyName: "Cult Founder",
    priority: 58,
    weight: 3,
    
    requires: (state) => {
      const st = state.stats || {};
      const m = state.milestones || {};
      const room = state.room || { seeds: {} };
      const seeds = room.seeds || {};
      
      const C = st.confidence || 0;
      const I = st.intelligence || 0;
      const E = st.empathy || 0;
      
      const readingSeed = (seeds.reading || 0) + (seeds.routine || 0);
      
      return C >= 40
          && I >= 28
          && E <= 12
          && (readingSeed >= 2 || (m.communityServiceCount || 0) >= 1);
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They started a 'wellness community' that became… a cult. The merch was excellent. The boundaries were not.",
        "Career & Wealth: They built a movement around their charisma. People followed. Some should not have.",
        "Career & Wealth: They became a leader with an alarming talent for persuasion. The line between 'community' and 'cult' got blurry fast."
      ];
      
      const letters = [
        "{SALUTATION}\n\nGood news: people listen to me.\nBad news: they listen to me.\n\nI'm working on using my influence responsibly.\nPlease don't join anything that requires matching robes.\n\n— {childName}",
        
        "{SALUTATION}\n\nI accidentally started a movement.\nIt began with a group chat.\nIt ended with a slogan.\n\nAnyway. I'm fine. Probably.\n\n— {childName}",
        
        "{SALUTATION}\n\nI'm a 'thought leader' now.\nThat's what they call it.\n\nSometimes I miss when the biggest drama was bedtime.\n\n— {childName}",
        
        "{SALUTATION}\n\nI'm famous.\nI'm also… slightly terrifying.\n\nI'm trying to grow up even while people treat me like an oracle.\n\n— {childName}",
        
        "{SALUTATION}\n\nI learned confidence early.\nEmpathy… came later.\nI'm still catching up.\n\n— {childName}"
      ];
      
      const shareLines = [
        "🕯️ Cult Founder ending unlocked. The group chat escalated.",
        "Raising Tomorrow: my kid started a cult. 10/10 darkly funny."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "CULT_FOUNDER",
        title: "Starts a Cult",
        trophyName: "Cult Founder",
        shareLine: rng.pick(shareLines)
      };
    }
  },
  
  // 9) OLYMPIC_GOLD
  {
    id: "OLYMPIC_GOLD",
    title: "Olympic Gold Medalist",
    trophyName: "Olympic Gold Medalist",
    priority: 75,
    weight: 3,
    
    requires: (state) => {
      const st = state.stats || {};
      const m = state.milestones || {};
      const room = state.room || { seeds: {} };
      const seeds = room.seeds || {};
      
      const D = st.discipline || 0;
      const C = st.confidence || 0;
      
      return D >= 42
          && C >= 30
          && (m.blackBelt === true || (seeds.athletics || 0) >= 2);
    },
    
    apply: (state, outcome, rng) => {
      const careers = [
        "Career & Wealth: They became an Olympic gold medalist. Years of training turned into one moment the world replayed forever.",
        "Career & Wealth: They chased mastery, not applause—then the applause arrived anyway.",
        "Career & Wealth: Discipline became their superpower. The podium was the receipt."
      ];
      
      const letters = [
        "{SALUTATION}\n\nI won gold.\n\nIt felt like lightning.\nBut the real story was the years of ordinary days—practice, patience, recovery.\n\nThank you for teaching me how to keep going.\n\n— {childName}",
        
        "{SALUTATION}\n\nEveryone saw the medal.\nNo one saw the mornings.\n\nYou did.\nYou showed up.\n\nLove,\n{childName}",
        
        "{SALUTATION}\n\nI used to quit when things got hard.\nThen you taught me routines.\n\nNow I do hard things for a living.\n\n— {childName}",
        
        "{SALUTATION}\n\nGold is heavy.\nSo was the work.\n\nWorth it.\n\n— {childName}"
      ];
      
      const shareLines = [
        "🥇 Olympic Gold ending unlocked. Discipline actually did the thing.",
        "Raising Tomorrow: my kid became an Olympic champion. Proud-parent simulator engaged."
      ];
      
      outcome.sections.careerWealth = {
        headline: "Career & Wealth",
        bullets: [],
        paragraph: rng.pick(careers),
        tinyTruth: null
      };
      
      outcome.sections.letter = {
        headline: "A Letter From Your Adult Child",
        bullets: [],
        paragraph: format(rng.pick(letters), state),
        tinyTruth: null
      };
      
      outcome.specialEnding = {
        id: "OLYMPIC_GOLD",
        title: "Olympic Gold Medalist",
        trophyName: "Olympic Gold Medalist",
        shareLine: rng.pick(shareLines)
      };
    }
  }
];

// ===== GET ELIGIBLE ENDINGS =====
export function getEligibleLegendaryEndings(state) {
  // Skip if launch codes secret ending active
  if (state.flags?.launchCodesSold === true) {
    return [];
  }
  
  try {
    return LEGENDARY_ENDINGS.filter(ending => {
      try {
        return ending.requires(state);
      } catch (err) {
        console.error(`Error checking ${ending.id}:`, err);
        return false;
      }
    });
  } catch (error) {
    console.error('Error getting eligible endings:', error);
    return [];
  }
}

// ===== APPLY LEGENDARY ENDING =====
export function applyLegendaryEndingIfAny(state, outcome, rng) {
  try {
    const eligible = getEligibleLegendaryEndings(state);
    
    if (eligible.length === 0) {
      return; // No legendary ending
    }
    
    // Group by priority
    const maxPriority = Math.max(...eligible.map(e => e.priority));
    const topTier = eligible.filter(e => e.priority === maxPriority);
    
    // Weighted pick among top tier
    const weights = topTier.map(e => e.weight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let roll = rng.nextFloat() * totalWeight;
    let picked = topTier[0];
    
    for (let i = 0; i < topTier.length; i++) {
      roll -= topTier[i].weight;
      if (roll <= 0) {
        picked = topTier[i];
        break;
      }
    }
    
    // Apply the ending
    picked.apply(state, outcome, rng);
    
    console.log(`[LegendaryEnding] Applied: ${picked.id}`);
    
  } catch (error) {
    console.error('Error applying legendary ending:', error);
    // Fail silently - don't break outcome generation
  }
}