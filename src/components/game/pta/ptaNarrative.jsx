export const PTA_SCENES = [
  {
    id: "SCENE_1",
    title: "The Invitation Folded Like a Program",
    triggerDesc: "Attend a PTA meeting with Standing ≥ 30 OR volunteer twice.",
    cast: ["Samira Patel", "{PARENT_NAME}"],
    opening: "As people stack chairs, Samira approaches with a smile that’s too calm for a room that just survived budget talk.\n\nSamira: “You handled yourself well tonight. Some parents mistake volume for leadership.”\nShe slips you a folded paper like it’s nothing—like it’s a bake sale flyer.\n\nInside: “THE LODGE MEETS WHEN THE HALLS ARE QUIET.”",
    choices: [
      { letter: "A", text: "I’m flattered. What is this?", dialogue: "{PARENT_NAME}: “Is this… a joke?”\nSamira (lightly): “Everything is a joke until it isn’t. Come if you want to help without making a mess.”", outcomeDesc: "+Influence, +Heat (small), unlock Lodge entry", effects: { influence: 5, heat: 3, unlockLodge: true } },
      { letter: "B", text: "No thanks. I’m just here for my kid.", dialogue: "{PARENT_NAME}: “I’m not into… whatever this is.”\nSamira: “That’s exactly what someone into it would say.” (beat) “Fair. But don’t be surprised when decisions happen around you.”", outcomeDesc: "+Integrity, reduced Influence opportunities; sets outsider path flags", effects: { integrity: 5, influence: -2, flagOutsider: true } },
      { letter: "C", text: "If this is about fundraising, I’m in.", dialogue: "{PARENT_NAME}: “If it helps the school, sure.”\nSamira: “It helps the school. And it helps the people who help the school. Dress casually.”", outcomeDesc: "+Influence (more), +Heat (more), unlock donor-related arc later", effects: { influence: 10, heat: 8, flagDonorArc: true, unlockLodge: true } }
    ]
  },
  {
    id: "SCENE_2",
    title: "The Lodge Is Just the Library (But Different)",
    triggerDesc: "Accept invitation.",
    cast: ["Archivist (voice)", "Elaine", "Coach Ramirez", "Jordan Wu", "{PARENT_NAME}"],
    opening: "The library lights are dimmed. A circle of parents sits like a book club that stopped reading books years ago.\n\nA person you can’t quite see speaks from behind a rolling whiteboard.\n\nArchivist: “We don’t run the school. We prevent the school from being run by the loudest person in the room.”\n\nElaine taps a folder.\nElaine: “We keep receipts. Figuratively. Sometimes literally.”\n\nCoach Ramirez nods once like a judge.\nCoach: “We protect programs.”\n\nJordan’s phone is upside down. That’s how you know this is serious.\nJordan: “We protect optics.”\n\nArchivist: “And you, {PARENT_NAME}, will protect… what?”",
    choices: [
      { letter: "A", text: "Teachers. They’re drowning.", dialogue: "{PARENT_NAME}: “Teachers. They’re holding everything.”\nMs. DeLeon (from the back): “Finally.”", outcomeDesc: "+Integrity, +TeacherRep relationship, unlock “Teacher Shield” arc", effects: { integrity: 5, rel_deleon: 10, flagTeacherShield: true } },
      { letter: "B", text: "My kid. I’m being honest.", dialogue: "{PARENT_NAME}: “My kid. If I’m here, it’s for them.”\nCoach: “Good. That’s why any of us start.”\nElaine: “It’s why we stay… if we’re lucky.”", outcomeDesc: "unlock stronger child-trust outcomes; “Personal Stake” arc", effects: { flagPersonalStake: true, childTrustMax: 5 } },
      { letter: "C", text: "The school. The whole school.", dialogue: "{PARENT_NAME}: “The school. Everyone’s kid.”\nArchivist: “Big promise. Big temptations.”", outcomeDesc: "+Influence, increased future Integrity-risk flags; “Grand Agenda” arc", effects: { influence: 8, flagGrandAgenda: true } }
    ]
  },
  {
    id: "SCENE_3",
    title: "Carpool Recon",
    triggerDesc: "After Lodge entry, any weekday pickup.",
    cast: ["Gwen Price", "{PARENT_NAME}"],
    opening: "Gwen’s SUV idles like it pays taxes here. She waves at the staff member like she owns the building.\n\nGwen: “You’re new. I notice new.”",
    choices: [
      { letter: "A", text: "Friendly", dialogue: "{PARENT_NAME}: “I’m just trying to help.”\nGwen: “Help is a word people use when they want credit.”", outcomeDesc: "+Standing, dossier note: “Gwen fears being irrelevant”", effects: { standing: 5, dossier: { id: "gwen", note: "Fears being irrelevant" } } },
      { letter: "B", text: "Direct", dialogue: "{PARENT_NAME}: “You’ve been here a while. What should I know?”\nGwen: “Know that the school smiles at donors and bleeds everyone else.”", outcomeDesc: "+Influence (small), +Heat (small), dossier: “Gwen values leverage”", effects: { influence: 3, heat: 3, dossier: { id: "gwen", note: "Values leverage" } } },
      { letter: "C", text: "Curious", dialogue: "{PARENT_NAME}: “What do you want most?”\nGwen (laughs): “Oh. You’re one of those.” (beat) “I want my kid in the accelerated track without begging.”", outcomeDesc: "dossier: “Goal: acceleration track; hidden soft spot later”", effects: { dossier: { id: "gwen", note: "Goal: acceleration track" } } }
    ]
  },
  {
    id: "SCENE_4",
    title: "The Archivist’s First Test",
    triggerDesc: "First time opening Dossiers.",
    cast: ["Archivist (message)", "{PARENT_NAME}"],
    opening: "Text message (anonymous number):\n“ A dossier is a mirror. Use it to see. Not to cut.\nChoose: Observe, Approach, or Ignore.”",
    choices: [
      { letter: "A", text: "Observe (safe)", dialogue: "", outcomeDesc: "+Dossier quality, -Heat", effects: { dossierQuality: 1, heat: -3 } },
      { letter: "B", text: "Approach (fast)", dialogue: "", outcomeDesc: "+Influence, +Heat", effects: { influence: 8, heat: 8 } },
      { letter: "C", text: "Ignore (moral stance)", dialogue: "", outcomeDesc: "+Integrity, slower rank progress", effects: { integrity: 8, rankProgressMult: 0.8 } }
    ]
  },
  {
    id: "SCENE_5",
    title: "The Meeting Where Everyone Claps Wrong",
    triggerDesc: "Any PTA meeting after joining.",
    cast: ["Samira", "Jordan", "random parents", "{PARENT_NAME}"],
    opening: "Samira calls the room to order. Someone starts clapping at a time that makes no sense. Then everyone claps because humans are herd animals.\n\nJordan (whisper): “Tonight is about the new security contract. Watch who speaks first.”\n\nMid-scene prompt: Choose your posture.",
    choices: [
      { letter: "A", text: "Sit with teachers", dialogue: "", outcomeDesc: "+Teacher relationship, +Integrity, -Influence with boosters", effects: { rel_deleon: 5, integrity: 5, rel_coach: -5 } },
      { letter: "B", text: "Sit with donors", dialogue: "", outcomeDesc: "+Influence, +Heat (tiny), Integrity-risk flag", effects: { influence: 5, heat: 2, flagIntegrityRisk: true } },
      { letter: "C", text: "Sit in the back, take notes", dialogue: "", outcomeDesc: "unlock “Control the Minutes” action", effects: { unlockAction: "minutes" } }
    ]
  },
  {
    id: "SCENE_6",
    title: "Closed Session: The Door Click",
    triggerDesc: "Page+ rank, first closed session.",
    cast: ["Archivist", "Samira", "Elaine", "Coach", "Jordan", "{PARENT_NAME}"],
    opening: "Samira closes the door. The click is too loud.\n\nSamira: “Open session was theater. Now we do work.”\n\nElaine slides a spreadsheet.\nElaine: “Security company offered a ‘community partnership discount.’ Which is code for… you know.”\n\nCoach: “They sponsor the scoreboard and suddenly we’re all safer? Please.”\nJordan: “If we vote no, someone will post ‘PTA refuses student safety.’”\nArchivist: “We need a third option.”\n\nPlayer prompt: Propose a third option",
    choices: [
      { letter: "A", text: "Pilot program + oversight committee", dialogue: "{PARENT_NAME}: “We pilot it. Three months. Clear metrics. Oversight committee with teacher seats.”\nElaine: “Metrics I can defend.”\nMs. DeLeon (cold): “Teacher seats or no deal.”", outcomeDesc: "+Integrity, +Influence, +Heat (small)", effects: { integrity: 5, influence: 5, heat: 3 } },
      { letter: "B", text: "Switch vendors + publish criteria", dialogue: "{PARENT_NAME}: “We open bids. Publish criteria. No backroom discounts.”\nJordan: “People hate processes. They love villains.”\nSamira: “We can frame it: ‘responsible stewardship.’”", outcomeDesc: "+Integrity, -Heat, +Standing", effects: { integrity: 8, heat: -5, standing: 5 } },
      { letter: "C", text: "Delay vote + town hall", dialogue: "{PARENT_NAME}: “Delay. Host a town hall. Let parents vent where it can’t change the facts.”\nCoach: “Town halls are where nuance goes to die.”\nArchivist: “But they’re also where anger goes to be witnessed.”", outcomeDesc: "-Heat (big), -Bandwidth (big), opens “Town Hall” arc", effects: { heat: -15, bandwidth: -20, flagTownHall: true } }
    ]
  },
  {
    id: "SCENE_7",
    title: "Your Child Notices",
    triggerDesc: "Two Lodge nights in one week.",
    cast: ["{CHILD_NAME}", "{PARENT_NAME}"],
    opening: "You come home and find {CHILD_NAME} awake, sitting on the stairs like a tiny landlord.\n\n{CHILD_NAME}: “Why do you keep going to the school at night?”",
    choices: [
      { letter: "A", text: "Honest (age-appropriate)", dialogue: "{PARENT_NAME}: “Adults make decisions there. I’m trying to make good ones.”\n{CHILD_NAME}: “Do you ever make decisions for me?”", outcomeDesc: "+Child Trust if you later use “Ask Your Kid’s Opinion”; otherwise risk -Child Trust", effects: { flagHonestParent: true } },
      { letter: "B", text: "Deflect", dialogue: "{PARENT_NAME}: “It’s boring grown-up stuff.”\n{CHILD_NAME}: “Boring stuff makes you weirdly stressed.”", outcomeDesc: "+Heat (small), -Child Trust", effects: { heat: 3, childTrust: -5 } },
      { letter: "C", text: "Overshare", dialogue: "{PARENT_NAME}: “It’s… complicated. There’s a group—”\n{CHILD_NAME}: “Is it like a secret club?”\n(They say it too loudly.)", outcomeDesc: "+Heat (medium), unlock “Rumor: Your Kid Said Something”", effects: { heat: 8, flagKidRumor: true } }
    ]
  },
  {
    id: "SCENE_8",
    title: "The Rumor Sprouts Legs",
    triggerDesc: "Child overshare OR Heat ≥ 40.",
    cast: ["Jordan", "{PARENT_NAME} (DM)"],
    opening: "Jordan (DM): “Heyyyy so random question: does the PTA have like… a secret thing? bc my kid heard something.”",
    choices: [
      { letter: "A", text: "Shut it down clean", dialogue: "{PARENT_NAME}: “No. Kids exaggerate. PTA meetings are the opposite of secret.”\nJordan: “Lol true. We can barely hide a bake sale.”", outcomeDesc: "-Heat, +Standing", effects: { heat: -5, standing: 5 } },
      { letter: "B", text: "Joke (risky)", dialogue: "{PARENT_NAME}: “We meet under the full moon and vote on snacks.”\nJordan: “STOP 😂 don’t tempt me.”", outcomeDesc: "small random Heat change", effects: { heat: 2 } },
      { letter: "C", text: "Threaten (bad)", dialogue: "{PARENT_NAME}: “Be careful what you repeat.”\nJordan: “Whoa. Noted.”", outcomeDesc: "+Heat (big), -Integrity, Jordan becomes potential rival", effects: { heat: 15, integrity: -10, rel_jordan: -20 } }
    ]
  },
  {
    id: "SCENE_9",
    title: "The Treasurer’s Receipt Trap",
    triggerDesc: "You host fundraiser or handle money.",
    cast: ["Elaine", "{PARENT_NAME}"],
    opening: "Elaine: “I need the receipts.”\nShe says it kindly, which somehow feels worse.",
    choices: [
      { letter: "A", text: "Provide everything", dialogue: "{PARENT_NAME}: “Here. Categorized.”\nElaine: “You’re either competent… or hiding something.”", outcomeDesc: "+Integrity, +Elaine trust, unlock “Budget Whisperer” perk", effects: { integrity: 5, rel_elaine: 10, perkBudget: true } },
      { letter: "B", text: "You lost one", dialogue: "{PARENT_NAME}: “I’m missing one receipt.”\nElaine smiles without teeth.", outcomeDesc: "+Heat, -Standing", effects: { heat: 5, standing: -5 } },
      { letter: "C", text: "You push back", dialogue: "{PARENT_NAME}: “It was a small expense.”\nElaine: “Small expenses are how audits are born.”", outcomeDesc: "+Heat (big), triggers “District Compliance” arc", effects: { heat: 12, flagAuditArc: true } }
    ]
  },
  {
    id: "SCENE_10",
    title: "District Compliance Pays a Visit",
    triggerDesc: "Heat ≥ 55 OR missing receipts OR Gwen complains.",
    cast: ["Mr. Callahan (district)", "Principal Kwon", "{PARENT_NAME}"],
    opening: "Callahan: “I’m here to observe PTA practices. Routine.”\nPrincipal Kwon looks like she wants to evaporate.",
    choices: [
      { letter: "A", text: "Transparency", dialogue: "{PARENT_NAME}: “Here’s our process. Here’s our documentation.”\nCallahan: “Good. Keep it boring.”", outcomeDesc: "-Heat, +Standing, +Principal relationship", effects: { heat: -8, standing: 5, rel_kwon: 5 } },
      { letter: "B", text: "Blame someone else", dialogue: "{PARENT_NAME}: “Elaine handles finances.”\nElaine’s eyes promise consequences.", outcomeDesc: "-Elaine relationship, -Integrity, short-term Heat reduction; long-term sabotage risk", effects: { rel_elaine: -15, integrity: -10, heat: -5, flagSabotage: true } },
      { letter: "C", text: "Charm", dialogue: "{PARENT_NAME}: “Would you like coffee?”\nCallahan: “No.” (pause) “Yes.”", outcomeDesc: "small advantage; unlock “Compliance Ally” if Integrity decent", effects: { advantage: 2, unlockComplianceAlly: true } }
    ]
  },
  {
    id: "SCENE_11",
    title: "The Teacher’s Breaking Point",
    triggerDesc: "Teacher rep relationship low OR workload policy debate.",
    cast: ["Ms. DeLeon", "{PARENT_NAME}"],
    opening: "Ms. DeLeon: “Parents keep adding ‘helpful’ ideas. Do you know what your helpful idea adds?”\n{PARENT_NAME}: “Time.”\nMs. DeLeon: “Exactly.”",
    choices: [
      { letter: "A", text: "Ask what teachers need", dialogue: "{PARENT_NAME}: “Tell me the one change that would help most.”\nMs. DeLeon: “Stop treating the school like a customer service desk.”", outcomeDesc: "+Integrity, unlock “Teacher Shield: Redirect Parent Requests”", effects: { integrity: 8, unlockTeacherShield: true } },
      { letter: "B", text: "Defend PTA", dialogue: "{PARENT_NAME}: “We’re trying to support you.”\nMs. DeLeon: “Support is not a synonym for control.”", outcomeDesc: "-Teacher relationship, +Heat", effects: { rel_deleon: -10, heat: 5 } },
      { letter: "C", text: "Offer a concrete fix", dialogue: "{PARENT_NAME}: “I’ll kill two initiatives tonight.”\nMs. DeLeon: “Do that… and I’ll believe you.”", outcomeDesc: "opens “Cut Initiatives” council vote", effects: { unlockCutVote: true } }
    ]
  },
  {
    id: "SCENE_12",
    title: "Initiative Guillotine (Council Vote)",
    triggerDesc: "You promised to cut initiatives.",
    cast: ["Council"],
    opening: "Samira: “We can’t cut things. Parents love things.”\nArchivist: “Parents love outcomes. They tolerate fewer things.”\n\nPlayer must choose two initiatives to cut:\n- Extra spirit days\n- New app rollout\n- Expanded volunteer screening\n- Additional testing prep nights\n- Social media content team",
    choices: [
      { letter: "A", text: "Cut Spirit Days & Social Media", dialogue: "Coach: “Don’t touch spirit days.”\nElaine: “Please touch spirit days.”", outcomeDesc: "-Heat (teachers relieved), +Integrity, potential -Standing with certain parents", effects: { heat: -5, integrity: 5, standing: -3 } },
      { letter: "B", text: "Cut New App & Prep Nights", dialogue: "Samira: \"But the app!\"\nMs. DeLeon: \"The app is a second job for me.\"", outcomeDesc: "+Integrity, -Heat", effects: { integrity: 5, heat: -5 } }
    ]
  },
  {
    id: "SCENE_13",
    title: "The Booster’s Offer",
    triggerDesc: "Coach relationship ≥ 60 OR you sit with donors often.",
    cast: ["Coach", "{PARENT_NAME}"],
    opening: "Coach: “I can bring in a donor. Big money.”\n{PARENT_NAME}: “What’s the catch?”\nCoach: “No catch. Just… priorities.”",
    choices: [
      { letter: "A", text: "Take donor, set boundaries", dialogue: "{PARENT_NAME}: “We’ll accept with written guidelines. No program favoritism.”\nCoach: “You’re adorable.”\n{PARENT_NAME}: “And firm.”", outcomeDesc: "+School funds, +Integrity, +Heat (small)", effects: { funds: 1000, integrity: 5, heat: 3 } },
      { letter: "B", text: "Take donor, wink-wink", dialogue: "{PARENT_NAME}: “We can… be grateful.”\nCoach: “Now you’re speaking my language.”", outcomeDesc: "+Influence big, -Integrity, future scandal risk", effects: { influence: 15, integrity: -10, flagScandalRisk: true } },
      { letter: "C", text: "Decline", dialogue: "{PARENT_NAME}: “Not like this.”\nCoach: “Then don’t complain when we’re broke.”", outcomeDesc: "+Integrity, -Influence with donors, unlock “Grassroots Fundraising” arc", effects: { integrity: 5, rel_coach: -5, unlockGrassroots: true } }
    ]
  },
  {
    id: "SCENE_14",
    title: "Jordan Wants a Story",
    triggerDesc: "Jordan relationship ≥ 50 OR rumor active.",
    cast: ["Jordan", "{PARENT_NAME}"],
    opening: "Jordan: “People need a narrative. Give me one.”\n{PARENT_NAME}: “About what?”\nJordan: “About why the PTA isn’t evil.”",
    choices: [
      { letter: "A", text: "Give sincere narrative", dialogue: "{PARENT_NAME}: “Parents are scared. We’re trying to help without breaking things.”\nJordan: “Okay… that’s actually good.”", outcomeDesc: "-Heat, +Standing", effects: { heat: -5, standing: 5 } },
      { letter: "B", text: "Give manipulative narrative", dialogue: "{PARENT_NAME}: “Say the opposition is funded by outside groups.”\nJordan: “Spicy. Potentially lawsuit-y.”", outcomeDesc: "+Influence short-term, +Heat big, -Integrity", effects: { influence: 10, heat: 15, integrity: -10 } },
      { letter: "C", text: "Refuse", dialogue: "{PARENT_NAME}: “No.”\nJordan: “Then someone else will write it.”", outcomeDesc: "neutral now; future rumor risk", effects: { flagRumorRisk: true } }
    ]
  },
  {
    id: "SCENE_15",
    title: "Gwen’s Gambit at Open Mic",
    triggerDesc: "Public meeting where Gwen speaks.",
    cast: ["Gwen", "crowd", "{PARENT_NAME}"],
    opening: "Gwen (to crowd): “Some people here make decisions behind closed doors.”\nEyes swing toward you like spotlights.",
    choices: [
      { letter: "A", text: "Calm transparency", dialogue: "{PARENT_NAME} (standing): “We meet to organize volunteer work and reduce chaos. Anyone can join committees.”\nGwen: “Committees are where ideas go to die.”", outcomeDesc: "-Heat (if Standing high), +Standing", effects: { heat: -5, standing: 5 } },
      { letter: "B", text: "Counterattack", dialogue: "{PARENT_NAME}: “That’s rich coming from someone who only shows up when her kid’s track placement is mentioned.”\nGasps. Gwen smiles.", outcomeDesc: "+Influence with some, +Heat big, -Integrity, rival escalation", effects: { influence: 5, heat: 15, integrity: -5, rel_gwen: -15 } },
      { letter: "C", text: "Redirect to principal", dialogue: "{PARENT_NAME}: “Principal Kwon, can you explain how decisions are made?”\nPrincipal’s expression says: why have you done this.", outcomeDesc: "+Integrity, -Principal relationship unless repaired later", effects: { integrity: 2, rel_kwon: -10 } }
    ]
  },
  {
    id: "SCENE_16",
    title: "Repair with Principal Kwon",
    triggerDesc: "You redirected to principal OR principal relationship low.",
    cast: ["Principal Kwon", "{PARENT_NAME}"],
    opening: "Principal: “I don’t mind parent involvement. I mind being used as a shield.”\n{PARENT_NAME}: “You’re right.”\nPrincipal: “So what do you want?”",
    choices: [
      { letter: "A", text: "Partnership", dialogue: "{PARENT_NAME}: “I want to make your job easier, not harder. Give me one thing to protect.”\nPrincipal exhales.", outcomeDesc: "+Principal relationship, unlock “Principal Backchannel”", effects: { rel_kwon: 15, unlockBackchannel: true } },
      { letter: "B", text: "Justification", dialogue: "{PARENT_NAME}: “I was trying to calm the crowd.”\nPrincipal: “At my expense.”", outcomeDesc: "small repair, no unlock", effects: { rel_kwon: 5 } },
      { letter: "C", text: "Defiance", dialogue: "{PARENT_NAME}: “If leadership were clearer, people wouldn’t speculate.”\nPrincipal: “If parents trusted schools, I wouldn’t need aspirin.”", outcomeDesc: "-relationship, +Heat", effects: { rel_kwon: -10, heat: 5 } }
    ]
  },
  {
    id: "SCENE_17",
    title: "The Archivist Offers You a Quill",
    triggerDesc: "Page rank.",
    cast: ["Archivist", "{PARENT_NAME}"],
    opening: "Archivist: “You’re ready to write the minutes.”\nA pen is placed on the table like a sword.\n\nArchivist: “Minutes are history. History decides who was reasonable.”",
    choices: [
      { letter: "A", text: "Write neutral minutes", dialogue: "", outcomeDesc: "+Integrity, -Heat", effects: { integrity: 5, heat: -3 } },
      { letter: "B", text: "Frame toward your agenda", dialogue: "", outcomeDesc: "+Influence, +Heat, -Integrity", effects: { influence: 8, heat: 5, integrity: -5 } },
      { letter: "C", text: "Frame toward teacher protection", dialogue: "", outcomeDesc: "+Integrity, +Teacher relationship, -Influence with boosters", effects: { integrity: 5, rel_deleon: 8, rel_coach: -5 } }
    ]
  },
  {
    id: "SCENE_18",
    title: "The New Parent Wants In",
    triggerDesc: "You attend school event; recruit option appears.",
    cast: ["New Parent (NPC)", "{PARENT_NAME}"],
    opening: "New Parent: “I heard you know how things work.”\n{PARENT_NAME}: “I know how people talk.”\nNew Parent: “Can you… help?”",
    choices: [
      { letter: "A", text: "Invite to committee", dialogue: "", outcomeDesc: "+Standing, low Heat, potential ally", effects: { standing: 5, heat: 2 } },
      { letter: "B", text: "Invite to Lodge (risky)", dialogue: "", outcomeDesc: "+Influence potential, +Heat, leak risk", effects: { influence: 8, heat: 5, flagLeakRisk: true } },
      { letter: "C", text: "Decline kindly", dialogue: "", outcomeDesc: "+Integrity, lose possible asset", effects: { integrity: 3 } }
    ]
  },
  {
    id: "SCENE_19",
    title: "Closed Session: The Scholarship Allocation",
    triggerDesc: "Budget season.",
    cast: ["Council"],
    opening: "Elaine shows a list.\nElaine: “We have funds for five scholarship waivers.”\n\nCoach: “My donor wants two earmarked.”\nMs. DeLeon: “Earmarked scholarships are just… polite exclusion.”\n\nPlayer choice: allocation philosophy",
    choices: [
      { letter: "A", text: "Needs-based only", dialogue: "{PARENT_NAME}: “Needs-based. No names, just criteria.”\nCoach: “Donors like names.”\nSamira: “Donors like press.”", outcomeDesc: "+Integrity big, +Standing, risk donor pullback", effects: { integrity: 15, standing: 5, rel_coach: -5 } },
      { letter: "B", text: "Merit + need mix", dialogue: "", outcomeDesc: "balanced, smaller swings", effects: { integrity: 5, influence: 5 } },
      { letter: "C", text: "Earmarks accepted", dialogue: "", outcomeDesc: "+Influence, -Integrity, future scandal possible", effects: { influence: 10, integrity: -10, flagScandalRisk: true } }
    ]
  },
  {
    id: "SCENE_20",
    title: "Your Kid’s Friend Gets Cut",
    triggerDesc: "Allocation decision OR track placement arc.",
    cast: ["{CHILD_NAME}", "{PARENT_NAME}"],
    opening: "{CHILD_NAME}: “Maya can’t do the trip. Her mom cried.”\nYou feel the Lodge in your pocket like a stone.",
    choices: [
      { letter: "A", text: "Use Influence to fix it quietly", dialogue: "", outcomeDesc: "+Child Trust (if honest later), +Heat, -Integrity if criteria violated", effects: { childTrust: 5, heat: 5, integrity: -5 } },
      { letter: "B", text: "Set up a public fund", dialogue: "", outcomeDesc: "+Standing, +Integrity, -Heat, costs Bandwidth", effects: { standing: 8, integrity: 8, heat: -5, bandwidth: -10 } },
      { letter: "C", text: "Do nothing", dialogue: "", outcomeDesc: "-Child Trust, +Integrity (if consistent), lingering guilt tone", effects: { childTrust: -5, integrity: 2 } }
    ]
  },
  {
    id: "SCENE_21",
    title: "The Trial: Jordan Leaked a Screenshot",
    triggerDesc: "rumor scandal; Jordan posts a “closed session” hint.",
    cast: ["Council", "Jordan"],
    opening: "Samira: “Jordan posted a screenshot of our agenda draft.”\nJordan: “I posted a cropped screenshot.”\nArchivist: “Cropped betrayal is still betrayal.”",
    choices: [
      { letter: "A", text: "Demand expulsion", dialogue: "", outcomeDesc: "-Heat short-term, +Heat long-term (retaliation), -Integrity", effects: { heat: -5, rel_jordan: -50, integrity: -5 } },
      { letter: "B", text: "Demand apology + probation", dialogue: "", outcomeDesc: "-Heat, +Integrity, Jordan relationship can recover", effects: { heat: -5, integrity: 5, rel_jordan: -10 } },
      { letter: "C", text: "Protect Jordan", dialogue: "", outcomeDesc: "+Jordan ally, +Heat, Samira relationship drops", effects: { rel_jordan: 20, heat: 5, rel_samira: -10 } }
    ]
  },
  {
    id: "SCENE_22",
    title: "The Apology (Written Script)",
    triggerDesc: "probation path.",
    cast: ["Jordan", "{PARENT_NAME}"],
    opening: "Jordan: “I can’t just say ‘sorry.’ People want a performance.”\n{PARENT_NAME}: “Then perform sincerity.”",
    choices: [
      { letter: "A", text: "Humble (best)", dialogue: "Jordan (posting draft): “I crossed a line by sharing internal planning. I was wrong. I’m stepping back and rebuilding trust.”\nJordan (to you): “It feels like swallowing glass.”\n{PARENT_NAME}: “Growth tastes bad.”", outcomeDesc: "-Heat, +Integrity, Jordan becomes loyal", effects: { heat: -10, integrity: 5, rel_jordan: 10 } },
      { letter: "B", text: "Funny", dialogue: "", outcomeDesc: "Mixed results", effects: { heat: -2 } },
      { letter: "C", text: "Defensive", dialogue: "", outcomeDesc: "Heat increases", effects: { heat: 5 } }
    ]
  },
  {
    id: "SCENE_23",
    title: "Gwen’s Soft Spot",
    triggerDesc: "Gwen rivalry high OR you offered her a soft landing.",
    cast: ["Gwen", "{PARENT_NAME}"],
    opening: "You find Gwen alone in the hallway, staring at a student art display like it’s a verdict.\n\nGwen: “My kid cries before math. You know that?”\nHer voice is smaller than her SUV.",
    choices: [
      { letter: "A", text: "Offer help without leverage", dialogue: "{PARENT_NAME}: “I know tutoring resources. And I can talk to the counselor.”\nGwen’s eyes flicker.", outcomeDesc: "+Integrity, rivalry reduces, unlock “Unexpected Ally” arc", effects: { integrity: 8, rel_gwen: 15, unlockAllyGwen: true } },
      { letter: "B", text: "Use it (bad)", dialogue: "{PARENT_NAME}: “Then maybe stop swinging at the PTA.”\nGwen’s face hardens.", outcomeDesc: "-Integrity, +Heat, Gwen becomes major antagonist", effects: { integrity: -10, heat: 5, rel_gwen: -20 } },
      { letter: "C", text: "Ask what she needs emotionally", dialogue: "{PARENT_NAME}: “What do you need right now?”\nGwen: “To not be judged.”", outcomeDesc: "+Empathy-like bonus; improves future repair options", effects: { rel_gwen: 5, empathy: 1 } }
    ]
  },
  {
    id: "SCENE_24",
    title: "Council Coup Attempt",
    triggerDesc: "Samira relationship low AND your Influence high.",
    cast: ["Archivist", "{PARENT_NAME}"],
    opening: "Archivist: “Samira is losing confidence. Someone is whispering your name.”",
    choices: [
      { letter: "A", text: "Refuse", dialogue: "{PARENT_NAME}: “No. This isn’t why I joined.”\nArchivist: “Good. Then you’ll survive.”", outcomeDesc: "+Integrity, slower Influence growth, -Heat", effects: { integrity: 10, influenceMult: 0.8, heat: -5 } },
      { letter: "B", text: "Accept", dialogue: "{PARENT_NAME}: “If I can stabilize things… yes.”\nArchivist: “Power doesn’t stabilize. It tests.”", outcomeDesc: "unlock Grand Convener path, +Heat baseline increases", effects: { flagGrandConvener: true, heatBase: 10 } },
      { letter: "C", text: "Redirect to a better candidate", dialogue: "", outcomeDesc: "+Integrity, +Relationship with chosen NPC, political debt created", effects: { integrity: 8, favorDebt: 1 } }
    ]
  },
  {
    id: "SCENE_25",
    title: "Town Hall Night (High Drama, High Grounding)",
    triggerDesc: "You chose delay + town hall.",
    cast: ["Parents", "Principal", "teachers", "{PARENT_NAME}"],
    opening: "A mic stands in the cafeteria like a weapon.\n\nParent #1: “Why are teachers indoctrinating kids?”\nTeacher: “I teach reading.”\n\nParent #2: “My kid is bullied and you’re buying iPads!”",
    choices: [
      { letter: "A", text: "Facilitate", dialogue: "{PARENT_NAME}: “We’re going to do this one at a time. Name the problem, name the desired outcome.”\nCrowd grumbles… then slows.", outcomeDesc: "+Standing, +Integrity, -Heat, -Bandwidth big", effects: { standing: 10, integrity: 8, heat: -10, bandwidth: -25 } },
      { letter: "B", text: "Defend school aggressively", dialogue: "", outcomeDesc: "+Influence with teachers, +Heat with parents", effects: { rel_deleon: 10, heat: 10 } },
      { letter: "C", text: "Stay silent", dialogue: "", outcomeDesc: "-Standing, Heat unpredictable", effects: { standing: -10, heat: 5 } }
    ]
  },
  {
    id: "SCENE_26",
    title: "The Archivist’s Praise (or Warning)",
    triggerDesc: "after big public event.",
    cast: ["Archivist"],
    opening: "Message:\n“You kept the room from turning feral.\nRemember: doing good publicly creates enemies privately.”",
    choices: [
      { letter: "A", text: "Acknowledge", dialogue: "", outcomeDesc: "Unlock: Mask → Cover Activities and Leak Control", effects: { unlockMask: true } }
    ]
  },
  {
    id: "SCENE_27",
    title: "Mask: Cover Activity — ‘Be Boring on Purpose’",
    triggerDesc: "Heat ≥ 60.",
    cast: ["{PARENT_NAME}"],
    opening: "Choose a cover:\n- bake sale sorting\n- hallway art hanging\n- library shelving\n- volunteering for lost-and-found\n\nShort scene:\nA parent smiles. “You’re so involved!”\nAnd for once it doesn’t feel like a threat.",
    choices: [
      { letter: "A", text: "Do the work", dialogue: "", outcomeDesc: "-Heat, +Standing, -Bandwidth", effects: { heat: -10, standing: 5, bandwidth: -5 } }
    ]
  },
  {
    id: "SCENE_28",
    title: "A Teacher Asks You to Stop",
    triggerDesc: "Influence too high OR Integrity low.",
    cast: ["Ms. DeLeon", "{PARENT_NAME}"],
    opening: "Ms. DeLeon: “I’m asking you as a human: stop pulling strings.”\n{PARENT_NAME}: “I’m helping.”\nMs. DeLeon: “You’re deciding.”",
    choices: [
      { letter: "A", text: "Apologize + step back", dialogue: "", outcomeDesc: "+Integrity, -Influence short-term, teacher alliance deepens long-term", effects: { integrity: 10, influence: -5, rel_deleon: 15 } },
      { letter: "B", text: "Argue", dialogue: "", outcomeDesc: "-Teacher relationship, +Heat", effects: { rel_deleon: -15, heat: 5 } },
      { letter: "C", text: "Quit the Lodge", dialogue: "", outcomeDesc: "immediate reset; unlock “Ex-member” arc", effects: { flagExMember: true, resetLodge: true } }
    ]
  },
  {
    id: "SCENE_29",
    title: "Ex-member Arc: The Exit Interview",
    triggerDesc: "You quit the Lodge.",
    cast: ["Samira", "Archivist", "{PARENT_NAME}"],
    opening: "Samira’s voice is gentle. That’s the terrifying part.\nSamira: “You can leave, {PARENT_NAME}. But you can’t unknow what you know.”\nArchivist: “We will not punish you. We will… remember you.”",
    choices: [
      { letter: "A", text: "Leave quietly", dialogue: "", outcomeDesc: "-Heat slowly, +Integrity, lose most Influence loops", effects: { heat: -20, integrity: 10, influence: -50 } },
      { letter: "B", text: "Leave loudly (whistleblow)", dialogue: "", outcomeDesc: "major public arc, massive Heat risk, possible district shakeup ending", effects: { flagWhistleblower: true, heat: 50 } },
      { letter: "C", text: "Negotiate a clean break", dialogue: "", outcomeDesc: "unlock perk “Trusted Neutral” (mediation access later)", effects: { perkNeutral: true } }
    ]
  },
  {
    id: "SCENE_30",
    title: "Whistleblow Path: The Article Draft",
    triggerDesc: "choose leave loudly.",
    cast: ["Jordan", "{PARENT_NAME}"],
    opening: "Jordan: “If you’re doing this, you need receipts.”\n{PARENT_NAME}: “Not that kind.”\nJordan: “Then it’s a vibe piece. Vibe pieces get eaten alive.”",
    choices: [
      { letter: "A", text: "Tell a personal story", dialogue: "", outcomeDesc: "Emotionally resonant, safer", effects: { standing: 10 } },
      { letter: "B", text: "Publish meeting notes (internal documentation)", dialogue: "", outcomeDesc: "Effective but high conflict", effects: { heat: 20, influence: -20 } },
      { letter: "C", text: "Do nothing", dialogue: "", outcomeDesc: "Abort whistleblower arc", effects: { flagWhistleblower: false } }
    ]
  },
  {
    id: "SCENE_31",
    title: "The Child Fallout",
    triggerDesc: "Any major scandal path.",
    cast: ["{CHILD_NAME}", "{PARENT_NAME}"],
    opening: "{CHILD_NAME}: “Kids said you’re… ‘the reason the principal cried.’”",
    choices: [
      { letter: "A", text: "Repair", dialogue: "{PARENT_NAME}: “I messed up. I’m sorry you’re carrying it.”", outcomeDesc: "+Child Trust, -Influence (step back)", effects: { childTrust: 5, influence: -10 } },
      { letter: "B", text: "Minimize", dialogue: "", outcomeDesc: "-Child Trust", effects: { childTrust: -10 } },
      { letter: "C", text: "Make your kid your ally (risky)", dialogue: "", outcomeDesc: "short-term closeness, long-term pressure, parenting consequences", effects: { childTrust: 2, flagParentingRisk: true } }
    ]
  },
  {
    id: "SCENE_32",
    title: "Redemption Arc: The Quiet Win",
    triggerDesc: "Integrity high, Heat managed, teacher alliance strong.",
    cast: ["Principal", "Ms. DeLeon", "{PARENT_NAME}"],
    opening: "Principal: “The new process… it worked. We kept two teachers who were going to quit.”\nMs. DeLeon nods once—rare approval.\n\nPrincipal: “No one will know you mattered.”\n{PARENT_NAME}: “Good.”",
    choices: [
      { letter: "A", text: "Accept the silence", dialogue: "", outcomeDesc: "strong healthy-power ending progress", effects: { flagHealthyPower: true, integrity: 10 } }
    ]
  },
  {
    id: "SCENE_33",
    title: "Corruption Arc: The Donor’s Son",
    triggerDesc: "Integrity low + donor path.",
    cast: ["Coach", "{PARENT_NAME}"],
    opening: "Coach: “Donor’s kid needs a spot.”\n{PARENT_NAME}: “That’s not how it works.”\nCoach: “It’s how it’s always worked.”",
    choices: [
      { letter: "A", text: "Refuse", dialogue: "", outcomeDesc: "+Integrity, donor withdraw threat", effects: { integrity: 10, funds: -500 } },
      { letter: "B", text: "Find a legal alternative", dialogue: "", outcomeDesc: "+Influence, -Heat small, costs Bandwidth, requires allies", effects: { influence: 5, heat: -2, bandwidth: -10 } },
      { letter: "C", text: "Comply", dialogue: "", outcomeDesc: "+Influence, -Integrity, later scandal guaranteed", effects: { influence: 15, integrity: -15, flagScandalGuaranteed: true } }
    ]
  },
  {
    id: "SCENE_34",
    title: "The Audit",
    triggerDesc: "scandals, missing receipts, donor manipulation.",
    cast: ["District compliance", "{PARENT_NAME}"],
    opening: "Callahan: “This isn’t personal. It’s paperwork.”\n(Which is how paperwork kills careers.)",
    choices: [
      { letter: "A", text: "Cooperate", dialogue: "", outcomeDesc: "cooperate reduces damage", effects: { heat: -5, standing: -5 } },
      { letter: "B", text: "Stonewall", dialogue: "", outcomeDesc: "stonewall increases Heat", effects: { heat: 10 } },
      { letter: "C", text: "Resign", dialogue: "", outcomeDesc: "resign protects child but loses Influence", effects: { influence: -50, childTrust: 5 } }
    ]
  },
  {
    id: "SCENE_35",
    title: "Final Council: Succession",
    triggerDesc: "Grand Convener path OR high Influence endgame.",
    cast: ["Council", "{PARENT_NAME}"],
    opening: "Archivist: “Choose the next Convener.”",
    choices: [
      { letter: "A", text: "Samira (order)", dialogue: "", outcomeDesc: "Status quo maintained", effects: { endState: "order" } },
      { letter: "B", text: "Elaine (compliance)", dialogue: "", outcomeDesc: "Strict adherence", effects: { endState: "compliance" } },
      { letter: "C", text: "Coach (donor power)", dialogue: "", outcomeDesc: "High funds, low equity", effects: { endState: "donor" } },
      { letter: "D", text: "Ms. DeLeon ally (teacher-first)", dialogue: "", outcomeDesc: "Teacher focus", effects: { endState: "teacher" } },
      { letter: "E", text: "Jordan (narrative power)", dialogue: "", outcomeDesc: "Optics focus", effects: { endState: "narrative" } },
      { letter: "F", text: "Gwen (chaos—if redeemed)", dialogue: "", outcomeDesc: "Unexpected turn", effects: { endState: "chaos_redeemed" } }
    ]
  },
  {
    id: "SCENE_36",
    title: "The Last Look at the Library",
    triggerDesc: "end of school year.",
    cast: ["{PARENT_NAME}"],
    opening: "You walk past the library. The lights are off. Still, you can almost hear the click of that door.\n\nPrompt: “What did you become?”",
    choices: [
      { letter: "A", text: "A protector", dialogue: "", outcomeDesc: "Integrity ending", effects: { endingType: "protector" } },
      { letter: "B", text: "A strategist", dialogue: "", outcomeDesc: "Balanced ending", effects: { endingType: "strategist" } },
      { letter: "C", text: "A kingmaker", dialogue: "", outcomeDesc: "Ruthless ending", effects: { endingType: "kingmaker" } },
      { letter: "D", text: "A cautionary tale", dialogue: "", outcomeDesc: "High Heat ending", effects: { endingType: "cautionary" } }
    ]
  },
  // --- COMPETITOR REMOVAL SCENES (37-50) ---
  {
    id: "SCENE_37",
    title: "The Courtesy Chair",
    triggerDesc: "Page+ rank AND Rival relationship ≤ 40 OR Rival publicly challenges you.",
    cast: ["Samira", "{PARENT_NAME}", "Rival (usually Gwen or Jordan)"],
    opening: "Samira slides a printed committee roster across the table like it’s a peace treaty.\n\nSamira: “We don’t always remove people. Sometimes we… place them.”\n\nShe taps a role titled: “Community Morale Liaison.”\n\nSamira: “It sounds important. It has no votes.”",
    choices: [
      { letter: "A", text: "Offer Courtesy Chair (sidelining)", dialogue: "{PARENT_NAME}: “Give them the ribbon. Keep the steering wheel.”\nRival: “I’m honored.”\nSamira (soft): “Good. Stay honored.”", outcomeDesc: "Rival influence decreases, +Heat (small), -Integrity (small if done cynically)", effects: { rivalPower: -20, heat: 3, integrity: -2 } },
      { letter: "B", text: "Refuse (too manipulative)", dialogue: "{PARENT_NAME}: “No. That’s humiliating.”\nSamira: “Humiliating is public. This is… velvet.”", outcomeDesc: "+Integrity, Rival remains active threat", effects: { integrity: 5 } },
      { letter: "C", text: "Turn it into a real role (ethical)", dialogue: "{PARENT_NAME}: “If we assign it, it needs scope. Real work. Real dignity.”\nSamira: “Annoyingly wholesome. Fine.”", outcomeDesc: "Rival influence decreases slightly, +Integrity, reduced Heat", effects: { rivalPower: -10, integrity: 5, heat: -2 } }
    ]
  },
  {
    id: "SCENE_38",
    title: "Motion of Censure",
    triggerDesc: "Rival breaks conduct (leaks, grandstands, targets staff) OR Heat ≥ 60 and Lodge needs scapegoat.",
    cast: ["Open Session crowd", "Samira", "Rival", "{PARENT_NAME}"],
    opening: "The agenda item appears like a thunderclap:\n“Motion: Censure for Conduct Unbecoming.”\n\nRival: “This is political retaliation.”\nSamira: “This is governance.”",
    choices: [
      { letter: "A", text: "Ethical censure (specific behavior, clear boundaries)", dialogue: "{PARENT_NAME}: “Name the behavior. Name the boundary. No character assassination.”\nCrowd murmurs—some disappointed, some relieved.", outcomeDesc: "-Heat (small), +Integrity, Rival influence reduced moderately", effects: { heat: -3, integrity: 5, rivalPower: -15 } },
      { letter: "B", text: "Weaponized censure (smear)", dialogue: "{PARENT_NAME}: “They’ve been undermining this PTA for months.”\nRival’s face goes still.", outcomeDesc: "Rival influence reduced sharply, +Heat (big), -Integrity, long-term blowback likely", effects: { rivalPower: -40, heat: 15, integrity: -10, flagBlowback: true } },
      { letter: "C", text: "Block censure (mercy)", dialogue: "{PARENT_NAME}: “This will turn into a circus. Handle it privately.”\nSamira: “Private is where the worst habits grow.”", outcomeDesc: "+Integrity (small), Rival remains; Heat unpredictable", effects: { integrity: 3, heat: 5 } }
    ]
  },
  {
    id: "SCENE_39",
    title: "Soft Landing Offer",
    triggerDesc: "Rival is vulnerable (relationship ≥ 30 OR dossier reveals pressure) OR you want low-Heat removal.",
    cast: ["Rival", "{PARENT_NAME}"],
    opening: "You find Rival alone by the trophy case, staring at a reflection that doesn’t flatter them.\n\nRival: “Are you here to finish me off?”\n{PARENT_NAME}: “No. I’m here to end the war.”",
    choices: [
      { letter: "A", text: "Offer face-saving exit", dialogue: "{PARENT_NAME}: “Resign with a statement about ‘focusing on family.’ We’ll publicly thank you.”\nRival: “And privately?”\n{PARENT_NAME}: “Privately, we both breathe.”", outcomeDesc: "Rival removed peacefully, -Heat (big), +Integrity, +Child Trust later", effects: { rivalRemoved: true, heat: -15, integrity: 5, childTrust: 5 } },
      { letter: "B", text: "Demand resignation (coercive)", dialogue: "{PARENT_NAME}: “Step down, or it gets ugly.”\nRival: “So it’s true. You people are a club.”", outcomeDesc: "Rival may resign, +Heat, -Integrity, triggers rumor arc", effects: { rivalRemoved: true, heat: 10, integrity: -10, flagRumorArc: true } },
      { letter: "C", text: "Offer mediation instead of exit", dialogue: "{PARENT_NAME}: “Stay, but we set rules. No ambushes. No staff targeting.”\nRival: “Rules for me. Not for you.”", outcomeDesc: "Rival remains but de-escalation chance, +Integrity", effects: { integrity: 8, rivalActive: true } }
    ]
  },
  {
    id: "SCENE_40",
    title: "The Coalition Whisper",
    triggerDesc: "You attempt Vote of No Confidence OR Committee Shuffle.",
    cast: ["Elaine", "Coach", "Jordan or Gwen", "{PARENT_NAME}"],
    opening: "Three parents stand in a hallway that smells like floor cleaner and secrets.\n\nElaine: “Numbers don’t vote. People do.”\nCoach: “People vote when they’re afraid of losing something.”\nJordan: “People vote when there’s a story.”",
    choices: [
      { letter: "A", text: "Build coalition ethically (shared goals)", dialogue: "{PARENT_NAME}: “We do this only if it protects the school. No personal vendettas.”\nElaine: “Define ‘protect.’”\n{PARENT_NAME}: “Protect staff. Protect kids. Protect process.”", outcomeDesc: "+Influence, +Integrity, moderate success chance, low Heat increase", effects: { influence: 5, integrity: 5, heat: 2, coalitionSuccess: 0.7 } },
      { letter: "B", text: "Build coalition transactionally (favors)", dialogue: "{PARENT_NAME}: “I can trade favors. Quietly.”\nCoach: “Now we’re talking.”", outcomeDesc: "+Influence big, +Heat, -Integrity, creates Favor debt", effects: { influence: 15, heat: 8, integrity: -5, favorDebt: 3, coalitionSuccess: 0.9 } },
      { letter: "C", text: "Back out", dialogue: "{PARENT_NAME}: “This is turning into something I don’t like.”\nJordan: “Then someone else will like it.”", outcomeDesc: "+Integrity, Rival remains; you lose momentum", effects: { integrity: 5, influence: -5 } }
    ]
  },
  {
    id: "SCENE_41",
    title: "The Archivist’s Red Line",
    triggerDesc: "Integrity ≤ 35 OR you used weaponized censure OR network freeze repeatedly.",
    cast: ["Archivist", "{PARENT_NAME}"],
    opening: "Message:\n“Removing a problem is not the same as solving a problem.\nIf you keep cutting people, eventually you’ll cut the wrong artery.”",
    choices: [
      { letter: "A", text: "Accept warning", dialogue: "{PARENT_NAME}: “Then tell me the clean way.”\nArchivist: “Clean is slower. But it lasts.”", outcomeDesc: "+Integrity, unlock “Restorative Removal” options", effects: { integrity: 10, unlockRestorative: true } },
      { letter: "B", text: "Ignore warning", dialogue: "{PARENT_NAME}: “Power is ugly. I didn’t invent it.”\nArchivist: “No. But you can choose whether to feed it.”", outcomeDesc: "+Influence short-term, +Heat baseline increases", effects: { influence: 5, heatBase: 5 } },
      { letter: "C", text: "Burn a dossier (symbolic reset)", dialogue: "{PARENT_NAME}: “I’m done collecting mirrors.”", outcomeDesc: "-Heat, +Integrity, lose some leverage temporarily", effects: { heat: -5, integrity: 10, leverage: -10 } }
    ]
  },
  {
    id: "SCENE_42",
    title: "The Ethics Complaint",
    triggerDesc: "Warden+ OR a staff member is harmed OR you choose ruthless path.",
    cast: ["Principal Kwon", "{PARENT_NAME}"],
    opening: "Principal Kwon holds a thin folder like it’s radioactive.\n\nPrincipal: “This is an ethics complaint. PTA-related.”\nShe looks at you carefully.\nPrincipal: “Is this real… or is this politics?”",
    choices: [
      { letter: "A", text: "Real complaint (protect staff)", dialogue: "{PARENT_NAME}: “It’s real. And it needs a boundary.”\nPrincipal: “Then we handle it with dignity.”", outcomeDesc: "+Integrity, Rival influence drops, -Heat (small)", effects: { integrity: 8, rivalPower: -10, heat: -3 } },
      { letter: "B", text: "Weaponized complaint (bad)", dialogue: "{PARENT_NAME}: “It’s… complicated.”\nPrincipal: “That’s a yes.”", outcomeDesc: "+Heat (big), -Integrity (big), triggers “Principal distrust” arc", effects: { heat: 15, integrity: -15, flagPrincipalDistrust: true } },
      { letter: "C", text: "Withdraw complaint", dialogue: "{PARENT_NAME}: “No. I won’t do this.”\nPrincipal: “Thank you.”", outcomeDesc: "+Integrity, Rival remains; you gain principal trust", effects: { integrity: 5, rel_kwon: 10 } }
    ]
  },
  {
    id: "SCENE_43",
    title: "Vote of No Confidence",
    triggerDesc: "High Influence, coalition built, Rival in office, Heat below cap.",
    cast: ["Closed Session council", "Rival", "{PARENT_NAME}"],
    opening: "Samira reads the motion without blinking.\n\nSamira: “Motion: No confidence in [Rival’s title].”\n\nRival: “You can’t do this.”\nElaine: “We can. It’s in the bylaws. Page 4.”",
    choices: [
      { letter: "A", text: "Make it about process (ethical)", dialogue: "{PARENT_NAME}: “This isn’t punishment. It’s a reset. We need stability.”\nArchivist: “Call the vote.”", outcomeDesc: "Rival removed, -Heat (small), +Integrity, high Standing gain if later handled well", effects: { rivalRemoved: true, heat: -5, integrity: 8, standing: 10 } },
      { letter: "B", text: "Make it about dominance (ruthless)", dialogue: "{PARENT_NAME}: “We’re done tolerating sabotage.”\nRival: “So you admit it.”", outcomeDesc: "Rival removed, +Heat (big), -Integrity, rumor spiral likely", effects: { rivalRemoved: true, heat: 20, integrity: -10, flagRumorSpiral: true } },
      { letter: "C", text: "Offer probation instead of removal", dialogue: "{PARENT_NAME}: “Probation. Clear terms. One more violation and they’re out.”\nRival exhales like they survived a drowning.", outcomeDesc: "Rival stays but weakened; +Integrity; Heat depends on future", effects: { rivalPower: -20, integrity: 5 } }
    ]
  },
  {
    id: "SCENE_44",
    title: "Aftermath: The Empty Chair",
    triggerDesc: "Rival removed (any method).",
    cast: ["Group chat", "{PARENT_NAME}"],
    opening: "At the next meeting, the chair is empty. Everyone pretends not to stare.\n\nGroup chat message:\nParent: “So… did [Rival] quit?”\nParent: “I heard they were ‘forced out.’”\nJordan (if not removed): “People are going to speculate.”",
    choices: [
      { letter: "A", text: "Transparent statement", dialogue: "{PARENT_NAME}: “We’re grateful for their service. Leadership transitions happen. We’re focused on students.”", outcomeDesc: "-Heat, +Standing", effects: { heat: -5, standing: 5 } },
      { letter: "B", text: "Snark (fun but risky)", dialogue: "{PARENT_NAME}: “They’re pursuing other opportunities… like not yelling at teachers.”", outcomeDesc: "+Heat, -Integrity", effects: { heat: 8, integrity: -5 } },
      { letter: "C", text: "Silence", dialogue: "", outcomeDesc: "Heat drifts upward; rumor chance increases", effects: { heat: 5, rumorChance: 0.2 } }
    ]
  },
  {
    id: "SCENE_45",
    title: "Blowback: The Counter-Rumor",
    triggerDesc: "Heat ≥ 60 OR removal was ruthless.",
    cast: ["Gwen/Jordan ally", "{PARENT_NAME}"],
    opening: "A parent corners you near the vending machines.\n\nParent: “Is it true you have a ‘club’ that decides everything?”\nYou hear the word club like a match strike.",
    choices: [
      { letter: "A", text: "De-escalate with humility", dialogue: "{PARENT_NAME}: “People talk. The PTA is messy. I’m trying to make it less messy.”", outcomeDesc: "-Heat, +Standing", effects: { heat: -5, standing: 5 } },
      { letter: "B", text: "Deny aggressively", dialogue: "{PARENT_NAME}: “That’s ridiculous.”\nParent: “Then why do you look guilty?”", outcomeDesc: "+Heat", effects: { heat: 10 } },
      { letter: "C", text: "Admit nuance (careful truth)", dialogue: "{PARENT_NAME}: “Adults form groups. It’s not a conspiracy. It’s… coordination. Sometimes too much.”", outcomeDesc: "+Integrity, moderate Heat change", effects: { integrity: 5, heat: 2 } }
    ]
  },
  {
    id: "SCENE_46",
    title: "Restorative Circle",
    triggerDesc: "You chose ethical paths OR Archivist warning accepted.",
    cast: ["Rival (if still around)", "Ms. DeLeon", "Principal", "{PARENT_NAME}"],
    opening: "Chairs in a circle. No microphones. No applause.\n\nMs. DeLeon: “We are not here to win. We are here to stop bleeding on each other.”\n\nRival: “I felt excluded.”\n{PARENT_NAME}: “I felt sabotaged.”",
    choices: [
      { letter: "A", text: "Apologize for your part", dialogue: "{PARENT_NAME}: “I used process like a weapon. I’m sorry.”\nRival’s shoulders drop slightly.", outcomeDesc: "+Integrity, -Heat, possible Rival redemption", effects: { integrity: 10, heat: -10, flagRivalRedemption: true } },
      { letter: "B", text: "Demand apology only", dialogue: "{PARENT_NAME}: “They need to apologize.”\nMs. DeLeon: “Then you learned nothing.”", outcomeDesc: "-Integrity, Heat unchanged", effects: { integrity: -5 } },
      { letter: "C", text: "End the circle (too raw)", dialogue: "{PARENT_NAME}: “This isn’t working.”\nPrincipal: “Then the hallway will keep doing it for us.”", outcomeDesc: "short-term relief, long-term conflict remains", effects: { stress: -2 } }
    ]
  },
  {
    id: "SCENE_47",
    title: "The Offer: President Behind the President",
    triggerDesc: "Very high Influence, Heat managed, and you have removed/neutralized key rivals OR guided succession.",
    cast: ["Archivist", "Samira or Elaine", "{PARENT_NAME}"],
    opening: "The Archivist meets you in the library with the lights half-off.\n\nArchivist: “You don’t need the title.”\nSamira (or Elaine): “Titles draw fire.”\n\nArchivist: “If you want to last, you become the hand behind the hand.”",
    choices: [
      { letter: "A", text: "Accept the Shadow President path", dialogue: "{PARENT_NAME}: “So I don’t stand at the podium.”\nArchivist: “You choose who stands there.”", outcomeDesc: "unlock “Shadow President” ending flag; Influence stays high, Heat baseline increases slightly, Standing becomes more fragile", effects: { flagShadowPresident: true, heatBase: 5, standingFragile: true } },
      { letter: "B", text: "Refuse (stay public or step back)", dialogue: "{PARENT_NAME}: “I’m not doing that.”\nSamira: “Healthier. Shorter.”", outcomeDesc: "+Integrity; normal endings apply", effects: { integrity: 10 } },
      { letter: "C", text: "Accept with ethical guardrails", dialogue: "{PARENT_NAME}: “Only if we protect teachers and publish fair criteria.”\nElaine: “Your version of shadow work involves spreadsheets.”\nArchivist: “Good.”", outcomeDesc: "unlock “Ethical Shadow” variant ending", effects: { flagShadowPresident: true, flagEthicalShadow: true } }
    ]
  },
  {
    id: "SCENE_48",
    title: "Choosing a Figurehead",
    triggerDesc: "Shadow President path active.",
    cast: ["Candidate(s)", "{PARENT_NAME}"],
    opening: "You meet a candidate in a quiet corner during a school event.\n\nCandidate: “Why me?”\n{PARENT_NAME}: “Because you can smile without needing to win.”\n\nPick one figurehead:\n- Samira (order)\n- Elaine (compliance)\n- Jordan (narrative)\n- Coach (donor power)\n- Redeemed Gwen (chaos turned constructive)\n\nConversation beat (applies to all):\nCandidate: “So I do the speeches… and you do the decisions?”\n{PARENT_NAME}: “You do the visible decisions. I do the invisible work: getting people to agree.”",
    choices: [
      { letter: "A", text: "Promise protection", dialogue: "{PARENT_NAME}: “If you take hits, I’ll reduce the heat.”", outcomeDesc: "+Loyalty, -Standing (slight; secrecy costs)", effects: { loyalty: 10, standing: -2 } },
      { letter: "B", text: "Promise ambition", dialogue: "{PARENT_NAME}: “We can change everything.”", outcomeDesc: "+Influence, +Heat", effects: { influence: 10, heat: 5 } },
      { letter: "C", text: "Promise nothing (cold)", dialogue: "{PARENT_NAME}: “You want the seat or not?”", outcomeDesc: "+Heat, -Integrity", effects: { heat: 5, integrity: -5 } }
    ]
  },
  {
    id: "SCENE_49",
    title: "Shadow President Epilogue (SUCCESS CUTSCENE)",
    triggerDesc: "Shadow President flag AND end-of-year success thresholds met.",
    cast: ["{PARENT_NAME}", "narration"],
    opening: "Epilogue text:\nAt the end-of-year banquet, someone else stands at the microphone.\nThey thank sponsors. They thank volunteers. They thank “community.”\n\nYou sit near the back, clapping at the correct time.\nYour phone buzzes with three messages:\n- a teacher saying, “Thank you for the new process.”\n- a parent asking, “Can you help me understand the forms?”\n- a single line from an unknown number: “The agenda is set.”\n\nThe new president smiles like they invented stability.\nBehind the smile, you feel the school’s machinery turning—quieter, smoother, still imperfect.\n\nYou don’t feel proud the way you expected.\nYou feel… responsible.\n\nAnd strangely, you sleep.",
    choices: [
      { letter: "A", text: "End", dialogue: "", outcomeDesc: "Unlock special badge/title: “Shadow President”", effects: { unlockBadge: "Shadow President" } }
    ]
  },
  {
    id: "SCENE_50",
    title: "Shadow War Exposed (FAILURE CUTSCENE)",
    triggerDesc: "Shadow President flag AND Heat too high OR scandal occurs OR child trust collapses.",
    cast: ["{CHILD_NAME}", "{PARENT_NAME}", "group chat"],
    opening: "A screenshot hits the group chat at 11:47 PM.\nIt’s not incriminating on paper.\nIt’s incriminating in vibe.\n\n{CHILD_NAME}: “Kids said you’re the ‘boss of the PTA.’”\nThey don’t sound impressed.\nThey sound tired.\n\nGroup chat:\nParent: “So who is REALLY in charge?”\nParent: “This is why no one trusts the PTA.”\nJordan (if present): “It’s going viral.”\n\nFinal beat:\nYou stare at the glowing screen.\nFor a moment, you can’t tell if the heat is on your face or in your chest.",
    choices: [
      { letter: "A", text: "End", dialogue: "", outcomeDesc: "massive Standing drop; potential resignation ending; child trust repair arc required", effects: { standing: -50, flagResignation: true, childTrust: -20 } }
    ]
  }
];

export const PTA_CHATS = [
  { id: "CHAT_1", title: "Safety Panic", messages: ["Parent A: “I heard there was an incident.”", "Parent B: “What incident??”", "Jordan: “I’m getting DMs.”"], choices: ["Ask for verified info", "Reassure vaguely", "Post official hotline/resources"] },
  { id: "CHAT_2", title: "Teacher Callout", messages: ["Parent: “My kid says Ms. DeLeon is mean.”"], choices: ["Defend the teacher", "Redirect to private conversation", "Pile on"] },
  { id: "CHAT_3", title: "Fundraiser Drama", messages: ["Parent: “Why is the gala ticket price so high?”"], choices: ["Explain scholarship subsidy", "Offer volunteer alternative", "Get defensive"] },
  { id: "CHAT_4", title: "Rumor: Secret Club", messages: ["Parent: “Is the PTA like… a cult?”"], choices: ["Joke", "Deny", "Share transparency link"] },
  { id: "CHAT_5", title: "Budget Spreadsheet Leak", messages: ["Someone posts partial numbers."], choices: ["Ask to remove (calm)", "Explain context", "Accuse leaker"] },
  { id: "CHAT_6", title: "Gwen Subtweets You", messages: [], choices: ["Ignore", "DM her", "Public clap back"] },
  { id: "CHAT_7", title: "Principal Hate Thread", messages: [], choices: ["Humanize principal", "Stay silent", "Join pile-on"] },
  { id: "CHAT_8", title: "Volunteer Shortage", messages: [], choices: ["Recruit gently", "Guilt people", "Do it yourself"] },
  { id: "CHAT_9", title: "Equity vs Excellence Flamewar", messages: [], choices: ["Set ground rules", "Post resources", "Pick a side loudly"] },
  { id: "CHAT_10", title: "Coach’s Donor Brag", messages: [], choices: ["Praise", "Thank + set boundaries", "Question optics"] },
  { id: "CHAT_11", title: "Teacher Appreciation Planning", messages: [], choices: ["Practical support", "Performative gifts", "Include student voices"] },
  { id: "CHAT_12", title: "End-of-Year Credit Fight", messages: [], choices: ["Share credit", "Claim credit", "Spotlight teachers"] }
];

export const PTA_MICROS = [
  { id: "MICRO_1", text: "A parent thanks you for “always knowing what’s going on.” You smile like you don’t.", choices: [{ text: "Deflect", effects: { heat: -2 } }, { text: "Invite them to volunteer", effects: { standing: 2 } }, { text: "Enjoy it", effects: { influence: 2, heat: 2 } }] },
  { id: "MICRO_2", text: "Elaine texts: “Do you have the receipt for the poster board?”", choices: [{ text: "Yes", effects: { integrity: 2 } }, { text: "No", effects: { heat: 2 } }, { text: "Change subject", effects: { integrity: -2 } }] },
  { id: "MICRO_3", text: "Coach says, “A donor wants a photo op with kids.”", choices: [{ text: "Set boundaries", effects: { integrity: 2, heat: 1 } }, { text: "Allow it", effects: { influence: 2, integrity: -2 } }, { text: "Refuse", effects: { integrity: 2, influence: -2 } }] },
  { id: "MICRO_4", text: "Your child asks, “Do you like the PTA more than me?”", choices: [{ text: "Repair", effects: { childTrust: 3 } }, { text: "Joke", effects: { childTrust: -1 } }, { text: "Dismiss", effects: { childTrust: -3 } }] },
  { id: "MICRO_5", text: "Jordan posts, “The PTA is working hard behind the scenes 💪”", choices: [{ text: "React", effects: { standing: 1 } }, { text: "Ask them to edit", effects: { heat: -1 } }, { text: "Ignore", effects: {} }] },
  { id: "MICRO_6", text: "Ms. DeLeon says, “Thank you for not making this about you.”", choices: [{ text: "Accept quietly", effects: { integrity: 2 } }, { text: "Make a speech", effects: { heat: 2 } }, { text: "Change topic to teacher needs", effects: { integrity: 2, rel_deleon: 3 } }] },
  { id: "MICRO_7", text: "Gwen corners you: “You’re not as innocent as you look.”", choices: [{ text: "Offer soft landing", effects: { heat: -2, integrity: 2 } }, { text: "Threaten", effects: { heat: 3, integrity: -2 } }, { text: "Walk away", effects: { heat: 1 } }] },
  { id: "MICRO_8", text: "Samira says, “We need someone to take the blame publicly.”", choices: [{ text: "Volunteer", effects: { integrity: 3, standing: -3 } }, { text: "Refuse", effects: { heat: 2 } }, { text: "Suggest a process statement", effects: { standing: 2, integrity: 2 } }] },
  { id: "MICRO_9", text: "You catch yourself rehearsing a meeting argument at dinner. Your child watches you like you’re a strange animal.", choices: [{ text: "Stop and listen", effects: { childTrust: 2 } }, { text: "Keep rehearsing", effects: { childTrust: -2 } }, { text: "Explain honestly", effects: { childTrust: 0 } }] },
  { id: "MICRO_10", text: "A new parent asks, “How do I get involved?”", choices: [{ text: "Committee invite", effects: { standing: 2 } }, { text: "Lodge tease (joke)", effects: { heat: 2 } }, { text: "Gatekeep", effects: { integrity: -2, heat: 2 } }] }
];

export const PTA_ENDINGS = [
  { id: 1, title: "The Quiet Builder", condition: "High Integrity, low-to-mid Heat, stable child trust.", text: "You never become famous. You become reliable.\nSystems improve. Teachers stay.\nYour child remembers you as present more than powerful." },
  { id: 2, title: "The Kingmaker", condition: "High Influence, mid Integrity, mid Heat.", text: "You can make outcomes happen.\nBut you notice how often you reach for control when you’re scared.\nYour child watches that habit grow." },
  { id: 3, title: "The Public Hero", condition: "High Standing, moderate Influence.", text: "People love you.\nThe Lodge finds you unpredictable.\nYou trade shadow power for daylight approval." },
  { id: 4, title: "The Scandal", condition: "Heat very high OR audit failure OR donor corruption.", text: "Your name becomes a caution.\nThe school survives you.\nYour child learns what it feels like to be associated with a headline." },
  { id: 5, title: "The Teacher Ally", condition: "Strong teacher relationships, Integrity high.", text: "The wins are quiet.\nA teacher cries in relief, not exhaustion.\nNo one puts that on a plaque, but it changes everything." },
  { id: 6, title: "The Donor Machine", condition: "Donor path + low Integrity.", text: "Programs thrive. Equity frays.\nYou tell yourself it’s “just how it works.”\nThen your child asks a question you can’t spin." },
  { id: 7, title: "The Exile", condition: "You lose trial / get removed / forced out.", text: "You become a ghost in the hallway.\nYou learn to parent without the lever of influence.\nIt hurts. It also heals." },
  { id: 8, title: "The Whistleblower", condition: "Loud exit path.", text: "You pull the curtain and the room erupts.\nReforms begin. Friendships end.\nYour child learns that honesty costs." },
  { id: 9, title: "The Redeemed Rival", condition: "Gwen redemption arc OR restorative circle success.", text: "Your greatest win isn’t a vote.\nIt’s a person you stopped treating like an enemy." },
  { id: 10, title: "The Boundary Parent", condition: "You intentionally step back + protect child trust.", text: "The Lodge continues without you.\nYour home gets quieter.\nYou stop confusing control with care." },
  { id: 11, title: "Shadow President", condition: "Shadow President success (Scene 49).", text: "At the end-of-year banquet, someone else stands at the microphone.\nThey thank sponsors. They thank volunteers. They thank “community.”\n\nYou sit near the back, clapping at the correct time.\nYour phone buzzes with three messages:\n- a teacher saying, “Thank you for the new process.”\n- a parent asking, “Can you help me understand the forms?”\n- a single line from an unknown number: “The agenda is set.”\n\nThe new president smiles like they invented stability.\nBehind the smile, you feel the school’s machinery turning—quieter, smoother, still imperfect.\n\nYou don’t feel proud the way you expected.\nYou feel… responsible.\n\nAnd strangely, you sleep.\n\n(You were the real president behind the president.)" }
];