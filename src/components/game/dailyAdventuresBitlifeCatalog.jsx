// BitLife-style Daily Adventures Catalog
// Parenting + Adult adventures, fail-heavy mini-tests

export const PARENTING_ADVENTURES = [
  {
    id: "sticker_cartel_summit",
    category: "parenting",
    title: "Sticker Cartel Summit",
    tagline: "The playground economy is in shambles.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "start",
    nodes: {
      start: {
        text: "{childName} comes home whispering about a ‘sticker economy’ at school. Apparently there’s inflation. Somehow.",
        prompt: "How do you respond?",
        choices: [
          {
            id: "a",
            text: "Ask calm questions like you’re in a documentary.",
            riskTier: "low",
            runDelta: { composure: 1 },
            check: { stats: { empathy: 0.015, social: 0.012 }, run: { composure: 0.03 } },
            onSuccess: {
              next: "node2",
              text: "{childName} relaxes and spills the entire sticker tea. There’s a ‘Sticker Council.’",
              effects: { love: 0.3, stress: -0.3 }
            },
            onFail: {
              next: "FAIL",
              text: "You come off like an undercover cop. {childName} suddenly ‘doesn’t remember anything.’",
              effects: { love: -0.4, stress: 0.6 }
            }
          },
          {
            id: "b",
            text: "Declare a sticker embargo effective immediately.",
            riskTier: "medium",
            runDelta: { chaos: 1 },
            check: { stats: { discipline: 0.012 }, run: { chaos: -0.03 } },
            onSuccess: {
              next: "node2",
              text: "{childName} sulks… but hands over the contraband like it’s a spy movie.",
              effects: { love: -0.1, stress: -0.2 }
            },
            onFail: {
              next: "FAIL",
              text: "{childName} starts hiding stickers in places you didn’t know existed. Even the freezer.",
              effects: { love: -0.3, stress: 0.7 }
            }
          },
          {
            id: "c",
            text: "Offer to become their Sticker CFO.",
            riskTier: "high",
            runDelta: { chaos: 2, cred: 1 },
            check: { stats: { creativity: 0.01 }, run: { chaos: -0.04, cred: 0.02 } },
            onSuccess: {
              next: "node2",
              text: "Congratulations. You’re now ‘CFO.’ Your benefits package is one gummy bear.",
              effects: { love: 0.2, stress: -0.1 }
            },
            onFail: {
              next: "FAIL",
              text: "You say ‘CFO’ out loud. {childName} says ‘cringe’ and walks away forever.",
              effects: { love: -0.5, stress: 0.6 }
            }
          }
        ]
      },
      node2: {
        text: "The Sticker Council demands {childName} deliver a rare holographic unicorn by tomorrow. The market is… unstable.",
        prompt: "What’s your plan?",
        choices: [
          {
            id: "a",
            text: "Teach them to negotiate: offer two regulars + one shiny.",
            riskTier: "low",
            runDelta: { composure: 1 },
            check: { stats: { social: 0.015, confidence: 0.015 }, run: { composure: 0.03 } },
            onSuccess: {
              next: "node3",
              text: "{childName} practices negotiation in the mirror like a tiny lawyer.",
              effects: { love: 0.3, stress: -0.3 }
            },
            onFail: {
              next: "FAIL",
              text: "{childName} negotiates by yelling ‘FINAL OFFER!’ and it goes… poorly.",
              effects: { love: -0.3, stress: 0.6 }
            }
          },
          {
            id: "b",
            text: "Print a ‘totally real’ unicorn at home.",
            riskTier: "medium",
            runDelta: { chaos: 1 },
            check: { stats: { intelligence: 0.012, creativity: 0.012 }, run: { chaos: -0.02 } },
            onSuccess: {
              next: "node3",
              text: "Your printer wheezes like it’s giving its last breath for the cause.",
              effects: { stress: -0.1, money: -1 }
            },
            onFail: {
              next: "FAIL",
              text: "The printer produces a cursed rectangle. {childName} calls it ‘haunted.’",
              effects: { love: -0.2, stress: 0.6, money: -1 }
            }
          },
          {
            id: "c",
            text: "Show up at school and demand to speak to the Sticker Council.",
            riskTier: "high",
            runDelta: { chaos: 2 },
            check: { stats: { confidence: 0.012, empathy: 0.01 }, run: { chaos: -0.04 } },
            onSuccess: {
              next: "node3",
              text: "You stride in with confidence. The Council meets behind the slide.",
              effects: { love: 0.1 }
            },
            onFail: {
              next: "FAIL",
              text: "You get politely asked to leave by a second grader with authority in their eyes.",
              effects: { love: -0.3, stress: 0.7 }
            }
          }
        ]
      },
      node3: {
        text: "You face the Sticker Council (three kids in sunglasses). The unicorn question hangs in the air.",
        prompt: "Final move?",
        choices: [
          {
            id: "a",
            text: "Apologize + propose fair trades for everyone.",
            riskTier: "low",
            runDelta: { composure: 1, cred: 1 },
            check: { stats: { empathy: 0.018, social: 0.015 }, run: { composure: 0.03, cred: 0.03 } },
            onSuccess: {
              next: "WIN",
              text: "The Council agrees. Peace returns. Inflation drops. You are… oddly proud.",
              effects: { love: 0.5, stress: -0.5 }
            },
            onFail: {
              next: "FAIL",
              text: "The Council votes ‘no.’ You are sentenced to ‘no snack table access.’",
              effects: { love: -0.4, stress: 0.8 }
            }
          },
          {
            id: "b",
            text: "Offer a dramatic ‘one-time deal’ and walk away mid-sentence.",
            riskTier: "medium",
            runDelta: { cred: 1, chaos: 1 },
            check: { stats: { confidence: 0.018 }, run: { cred: 0.03, chaos: -0.02 } },
            onSuccess: {
              next: "WIN",
              text: "They respect the confidence. Your exit is powerful. A pigeon applauds.",
              effects: { love: 0.3, stress: -0.2 }
            },
            onFail: {
              next: "FAIL",
              text: "You trip on a backpack. The Council labels you ‘unserious.’",
              effects: { love: -0.3, stress: 0.7 }
            }
          },
          {
            id: "c",
            text: "Bribe them with fancy snacks.",
            riskTier: "high",
            runDelta: { chaos: 1 },
            check: { parent: { money: 0.00002 }, run: { chaos: -0.03 } },
            onSuccess: {
              next: "WIN",
              text: "They accept the tribute. The Sticker Council now runs on cheddar crackers.",
              effects: { stress: -0.2, money: -3 }
            },
            onFail: {
              next: "FAIL",
              text: "Your snack offering is deemed ‘mid.’ The Council banishes you socially.",
              effects: { love: -0.3, stress: 0.6, money: -2 }
            }
          }
        ]
      }
    },
    winText: "✅ You survive the sticker economy without triggering a full recession. {childName} calls you ‘kinda legendary’ (then immediately asks for juice).",
    failText: "💥 The sticker market crashes. You become a cautionary tale told in whispers near the monkey bars."
  },
  // 2) Tooth Fairy Arbitration Board
  {
    id: "tooth_fairy_arbitration",
    category: "parenting",
    title: "Tooth Fairy Arbitration Board",
    tagline: "Rates have gone up, apparently.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "s1",
    nodes: {
      s1: {
        text: "{childName} files a formal complaint about low tooth prices. There’s a handwritten invoice.",
        prompt: "Opening move?",
        choices: [
          { id: "a", text: "Negotiate like you’re on TV.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { social: 0.015, empathy: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "s2", text: "You secure a hearing with the Board (two stuffed animals).", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "You say ‘market forces.’ {childName} Googles you.", effects: { love: -0.2, stress: 0.5 } } },
          { id: "b", text: "Offer a performance bonus for ‘sparkly brushing.’", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { responsibility: 0.012, confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "s2", text: "The Board agrees to benchmarks (there’s a sticker chart).", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "{childName} says this is wage theft, somehow.", effects: { love: -0.3, stress: 0.5 } } },
          { id: "c", text: "Pay more and hope they forget this happened.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { money: 0.00002 }, run: { chaos: -0.02 } }, onSuccess: { next: "s2", text: "Immediate relief. Long-term precedent: terrible.", effects: { money: -2 } }, onFail: { next: "FAIL", text: "A spreadsheet appears under the pillow. You are audited.", effects: { stress: 0.7, money: -1 } } }
        ]
      },
      s2: {
        text: "The Board convenes. Tiny gavels. Real judgment.",
        prompt: "Final offer?",
        choices: [
          { id: "a", text: "Tiered plan: first tooth premium, others standard.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { intelligence: 0.012, social: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Adopted unanimously. The Board declares ‘justice.’", effects: { love: 0.3, stress: -0.3 } }, onFail: { next: "FAIL", text: "Amendment 4b: back pay. You lose 3 dollars and your pride.", effects: { money: -3, stress: 0.6 } } },
          { id: "b", text: "Introduce ‘Tooth of the Month’ bonus.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { creativity: 0.012, confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "They cheer. You get a handshake and glitter on your shirt.", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "They unionize mid-meeting.", effects: { love: -0.2, stress: 0.7 } } },
          { id: "c", text: "Filibuster with bedtime.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { discipline: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Meeting adjourned due to yawns. You win on a technicality.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "You are ruled ‘boring.’ Motion to raise rates passes.", effects: { money: -2, stress: 0.5 } } }
        ]
      }
    },
    winText: "✅ Historic settlement reached. Tooth futures stabilize.",
    failText: "💥 The Board publishes a scathing pillow-side report."
  },
  // 3) Science Fair — Is This Lava?
  {
    id: "science_fair_is_this_lava",
    category: "parenting",
    title: "Science Fair: ‘Is This Lava?’",
    tagline: "Molten ambitions, plastic tablecloths.",
    difficulty: 4,
    rewardHint: "💎 2–3",
    startNodeId: "a1",
    nodes: {
      a1: {
        text: "{childName} wants ‘real lava.’ You suggest ‘lava-like.’ Smoke detector eyes you from afar.",
        prompt: "First step?",
        choices: [
          { id: "a", text: "Vinegar + baking soda volcano classic.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { intelligence: 0.012, curiosity: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "a2", text: "Foam happens. Cheer erupts. The carpet survives.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "Explosion fizzles. Everyone stares. You clap anyway.", effects: { stress: 0.6 } } },
          { id: "b", text: "Buy a fog machine ‘for science.’", riskTier: "medium", runDelta: { chaos: 1 }, check: { parent: { money: 0.00002 }, run: { chaos: -0.02 } }, onSuccess: { next: "a2", text: "Dramatic! PTA assumes you’re a professional.", effects: { money: -5 } }, onFail: { next: "FAIL", text: "Sprinklers consider it.", effects: { stress: 0.7, money: -2 } } },
          { id: "c", text: "Molten sugar ‘lava’ (YouTube says it’s fine).", riskTier: "high", runDelta: { chaos: 2 }, check: { stats: { creativity: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "a2", text: "It looks incredible. Smells like a caramel crime.", effects: { } }, onFail: { next: "FAIL", text: "You create ‘tar.’ The table begs for mercy.", effects: { stress: 0.8, money: -3 } } }
        ]
      },
      a2: {
        text: "Judge approaches. Clipboard aura. ‘So, is this lava?’",
        prompt: "How do you answer?",
        choices: [
          { id: "a", text: "Educational honesty with flair.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { confidence: 0.015, intelligence: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "a3", text: "Judge nods thoughtfully. You exhale dramatically.", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "You say ‘lava-adjacent’ too many times.", effects: { stress: 0.6 } } },
          { id: "b", text: "Deflect with a mini-lecture on volcano types.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { knowledge: 0.012, confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "a3", text: "Judge writes ‘impressive.’ You blush for no reason.", effects: { } }, onFail: { next: "FAIL", text: "Judge writes ‘talks a lot.’ Ouch.", effects: { stress: 0.5 } } },
          { id: "c", text: "‘Touch it and find out.’ (do not)", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { social: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "a3", text: "Judge laughs. You are suddenly charming.", effects: { } }, onFail: { next: "FAIL", text: "Silence. You are escorted to ‘safety corner.’",
            effects: { stress: 0.7 } } }
        ]
      },
      a3: {
        text: "Final moment: present your ‘lava’ with confidence.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Let {childName} do the proud speech.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { confidence: 0.018, curiosity: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "They nail it. Applause. Your eyes do a tiny cry.", effects: { love: 0.4, stress: -0.3 } }, onFail: { next: "FAIL", text: "They whisper ‘lava’ like a ghost and flee.", effects: { love: -0.2, stress: 0.6 } } },
          { id: "b", text: "Demo with extra pizazz.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { creativity: 0.015 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Showstopper. PTA claps politely like it’s the opera.", effects: { } }, onFail: { next: "FAIL", text: "You trigger the ‘oops table.’", effects: { stress: 0.7 } } },
          { id: "c", text: "Over-explain the rubric until time runs out.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { discipline: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "You thread the needle. Barely. ‘Competent’ ribbon acquired.", effects: { } }, onFail: { next: "FAIL", text: "You become That Parent. Smoke detector glares.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Hot success without actual heat. Legendary restraint.",
    failText: "💥 You set off a metaphorical alarm… and almost a literal one."
  },
  // 4) The Stuffed Animal Union
  {
    id: "stuffed_animal_union",
    category: "parenting",
    title: "The Stuffed Animal Union",
    tagline: "Collective bargaining at bedtime.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "u1",
    nodes: {
      u1: {
        text: "Stuffed animals demand rights: blanket parity, window seat rotation, hazard pay during thunderstorms.",
        prompt: "Opening proposal?",
        choices: [
          { id: "a", text: "Form a bedtime contract.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { responsibility: 0.015, empathy: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "u2", text: "Union agrees to talks. A penguin takes minutes.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "They chant ‘no contract, no cuddles.’", effects: { love: -0.2, stress: 0.6 } } },
          { id: "b", text: "Offer bedtime snacks (carrots?).", riskTier: "medium", runDelta: { chaos: 1 }, check: { parent: { money: 0.00002 }, run: { chaos: -0.02 } }, onSuccess: { next: "u2", text: "Morale up. Bunny nods, solemnly.", effects: { money: -1 } }, onFail: { next: "FAIL", text: "Snacks escalate demands to ‘pastries.’", effects: { money: -1, stress: 0.5 } } },
          { id: "c", text: "Declare emergency powers (lights out).", riskTier: "high", runDelta: { chaos: 2 }, check: { stats: { discipline: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "u2", text: "Silence falls. Respect? Maybe.", effects: { } }, onFail: { next: "FAIL", text: "A bear files a grievance. You lose in arbitration.", effects: { stress: 0.8 } } }
        ]
      },
      u2: {
        text: "Final demand: bedtime story with fair representation for all plushies.",
        prompt: "Resolution?",
        choices: [
          { id: "a", text: "Assign story roles equitably.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { empathy: 0.018, creativity: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Ratified. Everyone snores union-strong.", effects: { love: 0.3, stress: -0.3 } }, onFail: { next: "FAIL", text: "Giraffe says tokenism. You are canceled (by plushies).", effects: { love: -0.2, stress: 0.6 } } },
          { id: "b", text: "Offer double cuddles, no roles.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { social: 0.012, confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Cuddles ratified. Seal bangs tiny gavel.", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "Cuddles deemed ‘insufficient compensation.’", effects: { stress: 0.6 } } },
          { id: "c", text: "Announce rotating cast based on seniority.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { intelligence: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Bureaucracy wins for once. Order restored.", effects: { } }, onFail: { next: "FAIL", text: "Spreadsheet required. Everyone wakes up.", effects: { stress: 0.7 } } }
        ]
      }
    },
    winText: "✅ You avert the 2 AM strike. The night sleeps soundly.",
    failText: "💥 You are forced into collective bargaining at 2 AM. Again."
  },
  // 5) Daycare Drop-Off: The Password
  {
    id: "daycare_password",
    category: "parenting",
    title: "Daycare Drop-Off: The Password",
    tagline: "You definitely wrote it down somewhere.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "d1",
    nodes: {
      d1: {
        text: "New policy: password at pickup. You are 60% certain it’s ‘pineapple.’",
        prompt: "Approach?",
        choices: [
          { id: "a", text: "Admit you forgot and ask nicely.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { social: 0.015, empathy: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "d2", text: "Staff smiles. You’re re-educated kindly.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "You are handed pamphlets. So many pamphlets.", effects: { stress: 0.5 } } },
          { id: "b", text: "Confidently say ‘pineapple.’", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "d2", text: "Nailed it. You beam like a valedictorian.", effects: { } }, onFail: { next: "FAIL", text: "Password was ‘mango.’ You are mango now.", effects: { stress: 0.6 } } },
          { id: "c", text: "Attempt password hint charades.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { creativity: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "d2", text: "They guess it. You are legend.", effects: { } }, onFail: { next: "FAIL", text: "You mime fruit for three minutes. Security waves.", effects: { stress: 0.7 } } }
        ]
      },
      d2: {
        text: "Final check. Clipboard awaits.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Present ID and smile.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { responsibility: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "All clear. You get a gold star (figurative).", effects: { love: 0.1 } }, onFail: { next: "FAIL", text: "Your ID is upside-down for 30 seconds.", effects: { stress: 0.5 } } },
          { id: "b", text: "Crack a daycare joke.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { social: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Laughs! You are invited to the group chat you won’t use.", effects: { } }, onFail: { next: "FAIL", text: "You bomb so hard the fish look away.", effects: { stress: 0.6 } } },
          { id: "c", text: "Declare ‘I know my rights!’ as a bit.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { confidence: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "They have a sense of humor. Barely.", effects: { } }, onFail: { next: "FAIL", text: "Bit misunderstood. You get The Clipboard.", effects: { stress: 0.7 } } }
        ]
      }
    },
    winText: "✅ Password mastered. Drop-off civilized.",
    failText: "💥 You confidently said the wrong password like it was correct."
  },
  // 6) Library Book Teleportation
  {
    id: "library_book_teleport",
    category: "parenting",
    title: "The Library Book Teleportation",
    tagline: "It’s always under something.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "l1",
    nodes: {
      l1: {
        text: "The book is ‘missing.’ Snack crumbs form a clue trail.",
        prompt: "Plan?",
        choices: [
          { id: "a", text: "Systematic search with bins.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { responsibility: 0.015, discipline: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "l2", text: "Bins reveal a civilization of crumbs.", effects: { } }, onFail: { next: "FAIL", text: "You organize… nothing. Crumbs win.", effects: { stress: 0.5 } } },
          { id: "b", text: "Bribe the house with cookies.", riskTier: "medium", runDelta: { chaos: 1 }, check: { parent: { money: 0.00002 }, run: { chaos: -0.02 } }, onSuccess: { next: "l2", text: "{childName} becomes a helpful raccoon.", effects: { money: -1 } }, onFail: { next: "FAIL", text: "You eat the cookie. Morale unchanged.", effects: { stress: 0.5, money: -1 } } },
          { id: "c", text: "Accuse the couch. Shake it.", riskTier: "high", runDelta: { chaos: 2 }, check: { stats: { confidence: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "l2", text: "Coins rain. Hope returns.", effects: { money: 1 } }, onFail: { next: "FAIL", text: "You summon dust spirits. They judge you.", effects: { stress: 0.7 } } }
        ]
      },
      l2: {
        text: "Final sweep: under bed? Backpack? Quantum realm?",
        prompt: "Where?",
        choices: [
          { id: "a", text: "Under the bed with snacks.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { curiosity: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Found! It smells like crackers but it’s alive.", effects: { stress: -0.3 } }, onFail: { next: "FAIL", text: "You bonk your head and find… a sock.", effects: { stress: 0.6 } } },
          { id: "b", text: "Backpack archaeology.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { responsibility: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "There it is. Pressed flat like a fossil.", effects: { } }, onFail: { next: "FAIL", text: "You unleash a smell that cannot be named.", effects: { stress: 0.7 } } },
          { id: "c", text: "Call the librarian with shame.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { social: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Mercy granted. Renewed remotely.", effects: { love: 0.1 } }, onFail: { next: "FAIL", text: "You are recognized as ‘the regular.’", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ The book returns to its home world (the library).",
    failText: "💥 The librarian knows you by name now. Not ideal."
  },
  // 7) The ‘I Brushed’ Dentist Trial
  {
    id: "dentist_trial_brushed",
    category: "parenting",
    title: "The ‘I Brushed’ Dentist Trial",
    tagline: "Confidence on the stand.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "dt1",
    nodes: {
      dt1: {
        text: "Dentist asks about brushing. {childName} answers ‘Yes’ with Oscar-level conviction.",
        prompt: "Defense strategy?",
        choices: [
          { id: "a", text: "Coach honest but positive framing.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { empathy: 0.015, responsibility: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "dt2", text: "They downgrade from ‘always’ to ‘usually.’ Progress.", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "They double down: ‘Twice every five minutes.’", effects: { stress: 0.5 } } },
          { id: "b", text: "Flash a new toothbrush like exhibit A.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { responsibility: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "dt2", text: "The jury (hygienist) softens.", effects: { } }, onFail: { next: "FAIL", text: "Toothbrush still has price tag.", effects: { stress: 0.6 } } },
          { id: "c", text: "Change subject to flossing law.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { creativity: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "dt2", text: "You filibuster with charm.", effects: { } }, onFail: { next: "FAIL", text: "Hygienist gives you a look that ages you 10 years.", effects: { stress: 0.8 } } }
        ]
      },
      dt2: {
        text: "Final ruling pending.",
        prompt: "Closing argument?",
        choices: [
          { id: "a", text: "Commit to a brushing chart.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { discipline: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Case dismissed with free toothpaste.", effects: { love: 0.2, stress: -0.2 } }, onFail: { next: "FAIL", text: "Chart falls off fridge in real-time.", effects: { stress: 0.5 } } },
          { id: "b", text: "Plaque jokes (you had to).", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { social: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Laughs. Small ones. Still counts.", effects: { } }, onFail: { next: "FAIL", text: "Silence. Somewhere, a drill whirs.", effects: { stress: 0.6 } } },
          { id: "c", text: "Offer to buy fancy mouthwash.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { money: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Approved. Wallet sighs.", effects: { money: -2 } }, onFail: { next: "FAIL", text: "Mouthwash is glitter. Why.", effects: { stress: 0.7, money: -2 } } }
        ]
      }
    },
    winText: "✅ Tiny justice for tiny teeth.",
    failText: "💥 The hygienist’s look lives in your head now."
  },
  // 8) The Sleepover Snack Heist
  {
    id: "sleepover_snack_heist",
    category: "parenting",
    title: "The Sleepover Snack Heist",
    tagline: "Stealth, crumbs, betrayal.",
    difficulty: 4,
    rewardHint: "💎 2–3",
    startNodeId: "sh1",
    nodes: {
      sh1: {
        text: "Midnight whispers. Operation: Pantry.",
        prompt: "Your role?",
        choices: [
          { id: "a", text: "Gentle redirect to fruit.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { empathy: 0.015, discipline: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "sh2", text: "They consider grapes like philosophers.", effects: { love: 0.1 } }, onFail: { next: "FAIL", text: "They hiss ‘traitor’ and scuttle.", effects: { love: -0.2, stress: 0.5 } } },
          { id: "b", text: "Decoy with a ‘ghost story’ time sink.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { creativity: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "sh2", text: "You buy 20 minutes of peace.", effects: { } }, onFail: { next: "FAIL", text: "They tell you a scarier story. You lose.", effects: { stress: 0.6 } } },
          { id: "c", text: "Join the heist as ‘Snack Dad.’", riskTier: "high", runDelta: { chaos: 2 }, check: { stats: { social: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "sh2", text: "Legend status achieved. Crumbs everywhere.", effects: { } }, onFail: { next: "FAIL", text: "You step on a crunchy chip and blow your cover.", effects: { stress: 0.8 } } }
        ]
      },
      sh2: {
        text: "Final sweep before sleep.",
        prompt: "Endgame?",
        choices: [
          { id: "a", text: "Seal the kitchen with kindness and tape.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { responsibility: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Mission accomplished. Crumb level: manageable.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "Tape peels. Anarchy resumes.", effects: { stress: 0.7 } } },
          { id: "b", text: "Midnight pancakes (why not).", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { money: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "You are immortalized in lore.", effects: { money: -3 } }, onFail: { next: "FAIL", text: "Syrup incident. Do not discuss.", effects: { stress: 0.8, money: -2 } } },
          { id: "c", text: "Confiscate and lecture.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { discipline: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Respect achieved. Briefly.", effects: { } }, onFail: { next: "FAIL", text: "Lecture fails. Crumbs vote you out.", effects: { stress: 0.7 } } }
        ]
      }
    },
    winText: "✅ The night ends in relative peace and light glucose.",
    failText: "💥 The heist succeeds… against you."
  },
  // 9) Parent-Teacher Conference Mix-Up
  {
    id: "pt_conference_mixup",
    category: "parenting",
    title: "Parent-Teacher Conference Mix-Up",
    tagline: "Wrong class, full confidence.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "pt1",
    nodes: {
      pt1: {
        text: "You walk into the wrong classroom and nod like you belong.",
        prompt: "Do you…?",
        choices: [
          { id: "a", text: "Own it and apologize.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { social: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "pt2", text: "Everyone smiles. You are gently re-routed.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "You monologue. A bell rings for you specifically.", effects: { stress: 0.5 } } },
          { id: "b", text: "Commit to being Greg’s parent.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "pt2", text: "You give decent advice to a stranger child.", effects: { } }, onFail: { next: "FAIL", text: "You give advice about the wrong child with full confidence.", effects: { stress: 0.6 } } },
          { id: "c", text: "Change the subject to homework policy.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { discipline: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "pt2", text: "You start a discussion panel somehow.", effects: { } }, onFail: { next: "FAIL", text: "You are escorted to Correct Room.", effects: { stress: 0.7 } } }
        ]
      },
      pt2: {
        text: "You reach the right room. Teacher smiles like they’ve seen things.",
        prompt: "Final move?",
        choices: [
          { id: "a", text: "Listen, ask one thoughtful question.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { empathy: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Great chat. You are normal again.", effects: { love: 0.1 } }, onFail: { next: "FAIL", text: "You ask about Greg. Greg is not here.", effects: { stress: 0.6 } } },
          { id: "b", text: "Pitch a volunteer idea you can’t deliver.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { social: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Somehow fine.", effects: { } }, onFail: { next: "FAIL", text: "You are handed a clipboard.", effects: { stress: 0.6 } } },
          { id: "c", text: "Brag about lava project.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { confidence: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Respect achieved.", effects: { } }, onFail: { next: "FAIL", text: "They remember the smoke detector.", effects: { stress: 0.7 } } }
        ]
      }
    },
    winText: "✅ Correct room, correct child, minimal chaos.",
    failText: "💥 You are Greg’s parent now."
  },
  // 10) The Lost Shoe Mystery
  {
    id: "lost_shoe_mystery",
    category: "parenting",
    title: "The Lost Shoe Mystery",
    tagline: "There was definitely two before.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "s1",
    nodes: {
      s1: {
        text: "One shoe has vanished. The other mocks you.",
        prompt: "Search plan?",
        choices: [
          { id: "a", text: "Trace steps like detectives.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { responsibility: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "s2", text: "A clue: sock footprint.", effects: { } }, onFail: { next: "FAIL", text: "You find a banana sticker.", effects: { stress: 0.5 } } },
          { id: "b", text: "Ask {childName} nicely.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { empathy: 0.012, social: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "s2", text: "They recall ‘under something.’ Helpful.", effects: { } }, onFail: { next: "FAIL", text: "They say ‘I don’t know’ so hard it echoes.", effects: { stress: 0.6 } } },
          { id: "c", text: "Accept fate. Wear mismatched.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { confidence: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "s2", text: "Trendsetter energy.", effects: { } }, onFail: { next: "FAIL", text: "You are roasted by a six-year-old.", effects: { stress: 0.7 } } }
        ]
      },
      s2: {
        text: "Closing in.",
        prompt: "Where’s the shoe?",
        choices: [
          { id: "a", text: "Your own bag.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { curiosity: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "It’s in your bag. Two days later. Classic.", effects: { stress: -0.2 } }, onFail: { next: "FAIL", text: "Bag reveals only crumbs.", effects: { stress: 0.5 } } },
          { id: "b", text: "Car abyss.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { responsibility: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Found next to a fossilized fry.", effects: { } }, onFail: { next: "FAIL", text: "You lose a pen to the abyss.", effects: { stress: 0.6 } } },
          { id: "c", text: "Dimension behind the couch.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { creativity: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Portal returns a shoe. Probably yours.", effects: { } }, onFail: { next: "FAIL", text: "Portal returns judgment.", effects: { stress: 0.7 } } }
        ]
      }
    },
    winText: "✅ Two shoes acquired. Civilization restores.",
    failText: "💥 It was in your own bag… eventually."
  },
  // 11) The Birthday Cake Sabotage
  {
    id: "birthday_cake_sabotage",
    category: "parenting",
    title: "The Birthday Cake Sabotage",
    tagline: "Frosting triage.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "b1",
    nodes: {
      b1: {
        text: "Cake collapses right before guests arrive.",
        prompt: "Fix?",
        choices: [
          { id: "a", text: "Toothpick scaffolding.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { creativity: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "b2", text: "Architecture holds. Barely.", effects: { } }, onFail: { next: "FAIL", text: "Structure fails like your calm.", effects: { stress: 0.6 } } },
          { id: "b", text: "Frosting spackle, thick layer.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { confidence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "b2", text: "It’s a frosted boulder. Iconic.", effects: { } }, onFail: { next: "FAIL", text: "Frosting avalanche. No survivors.", effects: { stress: 0.7 } } },
          { id: "c", text: "Serve it as ‘deconstructed cake.’", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { social: 0.01 }, run: { chaos: -0.03 } }, onSuccess: { next: "b2", text: "Guests nod like it’s a tasting menu.", effects: { } }, onFail: { next: "FAIL", text: "You invent Cake Soup.", effects: { stress: 0.8 } } }
        ]
      },
      b2: {
        text: "Candles time. The moment of truth.",
        prompt: "Final?",
        choices: [
          { id: "a", text: "Distract with singing enthusiasm.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { social: 0.015 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Everyone has fun. Cake is edible-ish.", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "Silence after song. They see everything.", effects: { stress: 0.6 } } },
          { id: "b", text: "Slice strategically to hide chaos.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { intelligence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "No one notices. You exhale.", effects: { } }, onFail: { next: "FAIL", text: "Chaos slices back.", effects: { stress: 0.7 } } },
          { id: "c", text: "Own the disaster with flair.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { confidence: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Legendary party story created.", effects: { } }, onFail: { next: "FAIL", text: "A child says ‘yikes.’ It echoes.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Cake-ish victory. Memories > perfection.",
    failText: "💥 Cake Soup enters family lore."
  },
  // 12) Screen-Time Court Hearing
  {
    id: "screen_time_court",
    category: "parenting",
    title: "Screen-Time Court Hearing",
    tagline: "Order in the living room.",
    difficulty: 5,
    rewardHint: "💎 2–4",
    startNodeId: "sc1",
    nodes: {
      sc1: {
        text: "{childName} convenes ‘court’ to appeal screen limits. There are exhibits.",
        prompt: "Opening statement?",
        choices: [
          { id: "a", text: "Empathy + boundaries.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { empathy: 0.018, discipline: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "sc2", text: "Court acknowledges ‘fairness.’", effects: { love: 0.2 } }, onFail: { next: "FAIL", text: "Court finds you ‘in contempt of snacks.’", effects: { love: -0.2, stress: 0.6 } } },
          { id: "b", text: "Data: sleep charts and melted brains.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { intelligence: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "sc2", text: "Charts impress. Barely.", effects: { } }, onFail: { next: "FAIL", text: "Charts boomerang into Minecraft.", effects: { stress: 0.6 } } },
          { id: "c", text: "Plea deal: chores for minutes.", riskTier: "high", runDelta: { chaos: 1 }, check: { stats: { responsibility: 0.012 }, run: { chaos: -0.03 } }, onSuccess: { next: "sc2", text: "Agreement pending. Tiny gavel hovers.", effects: { } }, onFail: { next: "FAIL", text: "They countersue: ‘unlimited weekends.’", effects: { stress: 0.7 } } }
        ]
      },
      sc2: {
        text: "Closing arguments.",
        prompt: "Verdict swing?",
        choices: [
          { id: "a", text: "Timer + shared activity replacement.", riskTier: "low", runDelta: { composure: 1 }, check: { stats: { responsibility: 0.018, empathy: 0.012 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Order restored. Play happens. Screens wait.", effects: { love: 0.2, stress: -0.2 } }, onFail: { next: "FAIL", text: "Timer beeps into chaos.", effects: { stress: 0.7 } } },
          { id: "b", text: "Weekend voucher system.", riskTier: "medium", runDelta: { cred: 1 }, check: { stats: { discipline: 0.012 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Manageable. Bureaucratic. Works.", effects: { } }, onFail: { next: "FAIL", text: "Vouchers counterfeited immediately.", effects: { stress: 0.8 } } },
          { id: "c", text: "Confiscate router (dramatic).", riskTier: "high", runDelta: { chaos: 2 }, check: { stats: { confidence: 0.012 }, run: { chaos: -0.04 } }, onSuccess: { next: "WIN", text: "Respect and silence achieved.", effects: { } }, onFail: { next: "FAIL", text: "Rebellion. Court adjourns in screams.", effects: { stress: 0.9 } } }
        ]
      }
    },
    winText: "✅ Court recognizes your authority (today).",
    failText: "💥 You are found ‘in contempt of snacks.’"
  }
];

export const ADULT_ADVENTURES = [
  // 1) Office Potluck: The Mystery Casserole
  {
    id: "office_potluck_mystery_casserole",
    category: "adult",
    title: "Office Potluck: The Mystery Casserole",
    tagline: "Everyone says ‘interesting.’",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "p1",
    nodes: {
      p1: {
        text: "Your dish becomes controversial within three bites.",
        prompt: "Spin it?",
        choices: [
          { id: "a", text: "Own it: ‘experimental fusion.’", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "p2", text: "Nods. Someone says ‘bold.’", effects: { } }, onFail: { next: "FAIL", text: "Silence. Slack memes sprout.", effects: { stress: 0.5 } } },
          { id: "b", text: "Rebrand it as a dip.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { money: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "p2", text: "Suddenly edible.", effects: { } }, onFail: { next: "FAIL", text: "The chips break on contact.", effects: { stress: 0.6 } } },
          { id: "c", text: "Swap labels with the good dish.", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "p2", text: "Heist succeeds. You live in moral gray.", effects: { } }, onFail: { next: "FAIL", text: "Camera catches you. HR says ‘hey.’", effects: { stress: 0.8 } } }
        ]
      },
      p2: {
        text: "Your manager hovers. Smiles with teeth.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Joke before they do.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Room laughs. You are free (for now).", effects: { } }, onFail: { next: "FAIL", text: "You bomb and become a reaction image.", effects: { stress: 0.7 } } },
          { id: "b", text: "Donate leftovers to ‘science.’", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { money: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Cleanup hero arc.", effects: { } }, onFail: { next: "FAIL", text: "Leftovers multiply like a curse.", effects: { stress: 0.6 } } },
          { id: "c", text: "Insist it’s ‘regional.’", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Someone Googles and finds kind of a match.", effects: { } }, onFail: { next: "FAIL", text: "You become a meme in the group chat.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Your casserole escapes infamy by inches.",
    failText: "💥 Everyone says ‘interesting.’ You hear it forever."
  },
  // 2) Parking Ticket Diplomacy
  {
    id: "parking_ticket_diplomacy",
    category: "adult",
    title: "Parking Ticket Diplomacy",
    tagline: "You plead your case.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "k1",
    nodes: {
      k1: {
        text: "Meter attendant approaches. You have a monologue ready.",
        prompt: "First angle?",
        choices: [
          { id: "a", text: "Polite honesty.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "k2", text: "They hear you out.", effects: { } }, onFail: { next: "FAIL", text: "They write faster.", effects: { money: -1, stress: 0.5 } } },
          { id: "b", text: "Charm offensive.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "k2", text: "You get a sympathetic shrug.", effects: { } }, onFail: { next: "FAIL", text: "You accidentally confess to a different parking crime.", effects: { stress: 0.6 } } },
          { id: "c", text: "Quote obscure ordinance.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "k2", text: "They hesitate. Power rises.", effects: { } }, onFail: { next: "FAIL", text: "They quote a bigger ordinance. Ticket doubles.", effects: { money: -2, stress: 0.7 } } }
        ]
      },
      k2: {
        text: "Final verdict incoming.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Ask for a warning.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Mercy granted. You live to overpark again.", effects: { } }, onFail: { next: "FAIL", text: "They print while staring at you.", effects: { money: -2, stress: 0.6 } } },
          { id: "b", text: "Offer to move immediately.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "You peel away victorious.", effects: { } }, onFail: { next: "FAIL", text: "Printer says no.", effects: { money: -2, stress: 0.6 } } },
          { id: "c", text: "Pretend your car is haunted.", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "They laugh, wave you off.", effects: { } }, onFail: { next: "FAIL", text: "Bodycam sees your ‘ghost.’", effects: { money: -3, stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Ticket dodged via vibes and luck.",
    failText: "💥 Ticket secured. You argue with a printer in public."
  },
  // 3) Networking Event: Wrong Name Tag
  {
    id: "networking_wrong_nametag",
    category: "adult",
    title: "Networking Event: Wrong Name Tag",
    tagline: "You are Greg now.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "n1",
    nodes: {
      n1: {
        text: "Your name tag says ‘GREG.’ Your name is not Greg.",
        prompt: "Identity plan?",
        choices: [
          { id: "a", text: "Fix it immediately.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "n2", text: "You are you again.", effects: { } }, onFail: { next: "FAIL", text: "Label rips. You are blank.", effects: { stress: 0.5 } } },
          { id: "b", text: "Commit to Greg.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "n2", text: "Greg makes connections. You… do great?", effects: { } }, onFail: { next: "FAIL", text: "You commit so hard you answer to it at home.", effects: { stress: 0.7 } } },
          { id: "c", text: "Use ‘Greg’ as alter ego to pitch boldly.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "n2", text: "Pitch lands. Greg is powerful.", effects: { } }, onFail: { next: "FAIL", text: "Security asks for Greg’s last name.", effects: { stress: 0.7 } } }
        ]
      },
      n2: {
        text: "Final card swap.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Ask great questions.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "People like Not-Greg.", effects: { } }, onFail: { next: "FAIL", text: "You ask about someone else’s company at the wrong booth.", effects: { stress: 0.6 } } },
          { id: "b", text: "Follow-up immediately on LinkedIn.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Strong move.", effects: { } }, onFail: { next: "FAIL", text: "You connect with actual Greg. Chaos ensues.", effects: { stress: 0.6 } } },
          { id: "c", text: "Start a group selfie.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Viral moment (small circle viral).", effects: { } }, onFail: { next: "FAIL", text: "Half the group leaves frame.", effects: { stress: 0.7 } } }
        ]
      }
    },
    winText: "✅ You leave with cards and dignity.",
    failText: "💥 You are Greg now. Forever in two inboxes."
  },
  // 4) DIY Faucet Repair
  {
    id: "diy_faucet_repair",
    category: "adult",
    title: "DIY Faucet Repair",
    tagline: "Five-minute fix, famous last words.",
    difficulty: 4,
    rewardHint: "💎 2–3",
    startNodeId: "f1",
    nodes: {
      f1: {
        text: "You watch one video. You feel invincible.",
        prompt: "Step one?",
        choices: [
          { id: "a", text: "Turn off water valve.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "f2", text: "Silence. Good sign.", effects: { } }, onFail: { next: "FAIL", text: "You turn the wrong valve. Shower applauds.", effects: { stress: 0.6, money: -2 } } },
          { id: "b", text: "Use mystery wrench ‘because it fits.’", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { stress: -0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "f2", text: "It fits. Somehow.", effects: { } }, onFail: { next: "FAIL", text: "Bolt screams. So do you.", effects: { stress: 0.7 } } },
          { id: "c", text: "WD-40 baptism.", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "f2", text: "Slick success.", effects: { } }, onFail: { next: "FAIL", text: "Slip ‘n’ drip. Faucet chooses violence.", effects: { stress: 0.8, money: -2 } } }
        ]
      },
      f2: {
        text: "Moment of reassembly.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Read instructions (now).", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "It works. You strut modestly.", effects: { } }, onFail: { next: "FAIL", text: "Instructions say call a pro.", effects: { money: -3, stress: 0.6 } } },
          { id: "b", text: "Proceed via vibes.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { stress: -0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Vibes were enough. Legend.", effects: { } }, onFail: { next: "FAIL", text: "Leak produces jazz. Not good.", effects: { stress: 0.8, money: -3 } } },
          { id: "c", text: "Declare faucet sentient. Negotiate.", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { love: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Peace treaty signed.", effects: { } }, onFail: { next: "FAIL", text: "It chooses violence again.", effects: { stress: 0.9 } } }
        ]
      }
    },
    winText: "✅ Faucet bows to your will.",
    failText: "💥 Faucet achieves sentience and chooses violence."
  },
  // 5) Delivery Mix-Up: “Future You”
  {
    id: "delivery_mixup_future_you",
    category: "adult",
    title: "Delivery Mix-Up: ‘Future You’",
    tagline: "To be opened by… who?",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "dy1",
    nodes: {
      dy1: {
        text: "Package addressed to ‘Future You.’ Temptation hums.",
        prompt: "Move?",
        choices: [
          { id: "a", text: "Wait, ask neighbors.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "dy2", text: "Neighbor claims it. Mystery solved-ish.", effects: { } }, onFail: { next: "FAIL", text: "No one answers. Mystery deepens.", effects: { stress: 0.5 } } },
          { id: "b", text: "Open carefully, document.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { responsibility: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "dy2", text: "It’s harmless and odd.", effects: { } }, onFail: { next: "FAIL", text: "Deeply embarrassing but harmless.", effects: { stress: 0.6 } } },
          { id: "c", text: "Make an unboxing video.", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "dy2", text: "Three views. One is you.", effects: { } }, onFail: { next: "FAIL", text: "It auto-posts to a group chat.", effects: { stress: 0.7 } } }
        ]
      },
      dy2: {
        text: "Return or keep?",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Return honorably.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Karma obtained.", effects: { } }, onFail: { next: "FAIL", text: "Label peels and dies.", effects: { stress: 0.6 } } },
          { id: "b", text: "Keep ‘as intended.’", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { money: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "It’s actually useful. Weird.", effects: { } }, onFail: { next: "FAIL", text: "It’s… chalk holders.", effects: { stress: 0.5 } } },
          { id: "c", text: "Gift to a friend as a bit.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { love: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "They laugh. Friendship levels up.", effects: { } }, onFail: { next: "FAIL", text: "They already have three.", effects: { stress: 0.6 } } }
        ]
      }
    },
    winText: "✅ Future You approves.",
    failText: "💥 You open it and it’s… embarrassing but harmless."
  },
  // 6) Marketplace Buyer Scam Vibes
  {
    id: "marketplace_buyer_scam_vibes",
    category: "adult",
    title: "Marketplace Buyer Scam Vibes",
    tagline: "Gift cards are a red flag.",
    difficulty: 4,
    rewardHint: "💎 2–3",
    startNodeId: "m1",
    nodes: {
      m1: {
        text: "Buyer insists on gift cards. Puppy profile picture. Uh oh.",
        prompt: "Strategy?",
        choices: [
          { id: "a", text: "Insist on safe payment app.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { responsibility: 0.00001 }, run: { composure: 0.03 } }, onSuccess: { next: "m2", text: "They stall but agree.", effects: { } }, onFail: { next: "FAIL", text: "They ghost. Puppy remains.", effects: { stress: 0.5 } } },
          { id: "b", text: "Ask for video proof with today’s date.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "m2", text: "They vanish: scam averted.", effects: { } }, onFail: { next: "FAIL", text: "They send AI video. It blinks sideways.", effects: { stress: 0.6 } } },
          { id: "c", text: "Proceed anyway (you’re built different).", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "m2", text: "Against odds, not a scam.", effects: { } }, onFail: { next: "FAIL", text: "Scam city. Wallet sobs.", effects: { money: -4, stress: 0.9 } } }
        ]
      },
      m2: {
        text: "Final deal terms.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Public place + friend.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { responsibility: 0.00001 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Deal safe. You live to declutter again.", effects: { } }, onFail: { next: "FAIL", text: "They cancel at the last second.", effects: { stress: 0.6 } } },
          { id: "b", text: "Ship with tracking only.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { money: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Tracking saves the day.", effects: { } }, onFail: { next: "FAIL", text: "They dispute anyway.", effects: { stress: 0.8, money: -2 } } },
          { id: "c", text: "Cash only in an alley (lol).", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Chaos works. Somehow.", effects: { } }, onFail: { next: "FAIL", text: "Chaotic neutral, chaotic broke.", effects: { stress: 0.9 } } }
        ]
      }
    },
    winText: "✅ Scam avoided or mitigated.",
    failText: "💥 You get emotionally manipulated by a puppy."
  },
  // 7) Public Speaking, No Slides
  {
    id: "public_speaking_no_slides",
    category: "adult",
    title: "Public Speaking, No Slides",
    tagline: "‘As you can see here…’ (we can’t).",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "ps1",
    nodes: {
      ps1: {
        text: "Projector dies. Room alive.",
        prompt: "Move?",
        choices: [
          { id: "a", text: "Whiteboard bullets.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "ps2", text: "Clarity arrives.", effects: { } }, onFail: { next: "FAIL", text: "Marker is dry. Spirit follows.", effects: { stress: 0.6 } } },
          { id: "b", text: "Audience Q&A format.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "ps2", text: "You engage like a pro.", effects: { } }, onFail: { next: "FAIL", text: "You say ‘as you can see here’ while seeing nothing.", effects: { stress: 0.7 } } },
          { id: "c", text: "Mime your charts.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "ps2", text: "Weirdly compelling.", effects: { } }, onFail: { next: "FAIL", text: "You invent interpretive spreadsheet dance.", effects: { stress: 0.8 } } }
        ]
      },
      ps2: {
        text: "Closing line.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Strong summary, no slides.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "You land it. Applause.", effects: { } }, onFail: { next: "FAIL", text: "You ramble into your own outro.", effects: { stress: 0.6 } } },
          { id: "b", text: "Call-to-action with humor.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "They smile. You survive.", effects: { } }, onFail: { next: "FAIL", text: "Joke collapses like your slides.", effects: { stress: 0.7 } } },
          { id: "c", text: "Mic drop (figurative).", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Power move.", effects: { } }, onFail: { next: "FAIL", text: "Actual mic drops. Feedback screams.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Words carried you.",
    failText: "💥 You said ‘as you can see here’ to a wall."
  },
  // 8) Gym Challenge: Treadmill Pride
  {
    id: "gym_treadmill_pride",
    category: "adult",
    title: "Gym Challenge: Treadmill Pride",
    tagline: "Speed vs dignity.",
    difficulty: 3,
    rewardHint: "💎 1–3",
    startNodeId: "g1",
    nodes: {
      g1: {
        text: "You accept a treadmill challenge you shouldn’t.",
        prompt: "Pace?",
        choices: [
          { id: "a", text: "Start modest.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { playerHealth: 0.00002, stress: -0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "g2", text: "You live to jog another minute.", effects: { } }, onFail: { next: "FAIL", text: "Modest pace is a lie today.", effects: { stress: 0.6 } } },
          { id: "b", text: "Impress with a sprint.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { playerHealth: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "g2", text: "You look cool for four seconds.", effects: { } }, onFail: { next: "FAIL", text: "Treadmill ejects your dignity (not your body).", effects: { stress: 0.7 } } },
          { id: "c", text: "Incline mountain.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { playerHealth: 0.00002, stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "g2", text: "Quads awaken.", effects: { } }, onFail: { next: "FAIL", text: "You make snow-angels in sweat.", effects: { stress: 0.8 } } }
        ]
      },
      g2: {
        text: "Final minute.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Finish controlled.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { playerHealth: 0.00002, stress: -0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "You bow internally.", effects: { } }, onFail: { next: "FAIL", text: "You wobble into the side rail.", effects: { stress: 0.6 } } },
          { id: "b", text: "Victory sprint.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { playerHealth: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Camera catches a heroic blur.", effects: { } }, onFail: { next: "FAIL", text: "Camera catches the aftermath.", effects: { stress: 0.7 } } },
          { id: "c", text: "Hands-up celebration.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { playerHealth: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Anthem plays (in your mind).", effects: { } }, onFail: { next: "FAIL", text: "Hand slips. Dignity slides.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Pride intact-ish.",
    failText: "💥 The treadmill took only your dignity."
  },
  // 9) Coffee Catastrophe 2.0
  {
    id: "coffee_catastrophe_v2",
    category: "adult",
    title: "Coffee Catastrophe 2.0",
    tagline: "Napkins worsen it.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "c1",
    nodes: {
      c1: {
        text: "Coffee meets important thing.",
        prompt: "Fix?",
        choices: [
          { id: "a", text: "Blot gently.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { responsibility: 0.00001 }, run: { composure: 0.03 } }, onSuccess: { next: "c2", text: "Damage contained.", effects: { } }, onFail: { next: "FAIL", text: "You smear it artistically.", effects: { stress: 0.5 } } },
          { id: "b", text: "Hairdryer hack.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { money: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "c2", text: "Crisp and saved.", effects: { } }, onFail: { next: "FAIL", text: "You melt a corner. Modern art now.", effects: { stress: 0.6 } } },
          { id: "c", text: "Pretend it’s supposed to be brown.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "c2", text: "Narrative spin succeeds.", effects: { } }, onFail: { next: "FAIL", text: "Napkins make it worse.", effects: { stress: 0.7 } } }
        ]
      },
      c2: {
        text: "Final presentation.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Lead with confidence.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "No one notices.", effects: { } }, onFail: { next: "FAIL", text: "Everyone notices.", effects: { stress: 0.6 } } },
          { id: "b", text: "Own the spill with a joke.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Laughs achieved.", effects: { } }, onFail: { next: "FAIL", text: "Joke spills, too.", effects: { stress: 0.7 } } },
          { id: "c", text: "Distract with snacks.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { money: 0.00001 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "No one cares anymore.", effects: { money: -2 } }, onFail: { next: "FAIL", text: "Snacks drip coffee now.", effects: { stress: 0.8, money: -1 } } }
        ]
      }
    },
    winText: "✅ Coffee forgiven.",
    failText: "💥 You ‘fix’ it with napkins and make it worse."
  },
  // 10) The Neighbor Group Chat War
  {
    id: "neighbor_group_chat_war",
    category: "adult",
    title: "The Neighbor Group Chat War",
    tagline: "Mystery smells and blame.",
    difficulty: 4,
    rewardHint: "💎 2–3",
    startNodeId: "ng1",
    nodes: {
      ng1: {
        text: "Chat accuses someone of ‘mystery smells.’ The vibes sour.",
        prompt: "Move?",
        choices: [
          { id: "a", text: "Calm de-escalation.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "ng2", text: "Tone softens. You buy time.", effects: { } }, onFail: { next: "FAIL", text: "You are accused of being the smell.", effects: { stress: 0.6 } } },
          { id: "b", text: "Demand evidence.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { responsibility: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "ng2", text: "Everyone calms. Briefly.", effects: { } }, onFail: { next: "FAIL", text: "Screenshots of your compost appear.", effects: { stress: 0.7 } } },
          { id: "c", text: "Start a poll titled ‘Not Me.’", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "ng2", text: "Comedy diffuses tension.", effects: { } }, onFail: { next: "FAIL", text: "You become the prime suspect.", effects: { stress: 0.9 } } }
        ]
      },
      ng2: {
        text: "Resolution attempt.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Organize a sniff-and-solve walk.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { responsibility: 0.00001 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "It was a trash day schedule.", effects: { } }, onFail: { next: "FAIL", text: "Now everyone is outside sniffing you.", effects: { stress: 0.7 } } },
          { id: "b", text: "Share city hotline info.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { responsibility: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Civics saves the day.", effects: { } }, onFail: { next: "FAIL", text: "Hotline returns with hold music in your soul.", effects: { stress: 0.6 } } },
          { id: "c", text: "Accuse the raccoons.", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "Raccoons accept blame (probably).", effects: { } }, onFail: { next: "FAIL", text: "You get raccoon-memed.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Peace restored via bureaucratic links or raccoons.",
    failText: "💥 You are the prime suspect for no reason."
  },
  // 11) The Unexpected Volunteer Signup
  {
    id: "unexpected_volunteer_signup",
    category: "adult",
    title: "The Unexpected Volunteer Signup",
    tagline: "The clipboard chooses you.",
    difficulty: 2,
    rewardHint: "💎 1–2",
    startNodeId: "v1",
    nodes: {
      v1: {
        text: "You accidentally sign up for a role at an event.",
        prompt: "Escape?",
        choices: [
          { id: "a", text: "Clarify politely.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "v2", text: "They adjust your role to ‘helper.’", effects: { } }, onFail: { next: "FAIL", text: "You get ‘lead.’ Immediately.", effects: { stress: 0.6 } } },
          { id: "b", text: "Find a co-lead fast.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { social: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "v2", text: "Shared pain acquired.", effects: { } }, onFail: { next: "FAIL", text: "Co-lead bails. Clipboard stays.", effects: { stress: 0.6 } } },
          { id: "c", text: "Lean in with a whistle.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { love: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "v2", text: "You channel coach energy.", effects: { } }, onFail: { next: "FAIL", text: "You are handed a whistle and immediately regret everything.", effects: { stress: 0.8 } } }
        ]
      },
      v2: {
        text: "Final hour arrives.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Logistics and labels.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { responsibility: 0.00001 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Event runs. Somehow.", effects: { } }, onFail: { next: "FAIL", text: "Labels rebel. Chaos reigns.", effects: { stress: 0.6 } } },
          { id: "b", text: "Delegate wildly.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { social: 0.00001 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "It works. Leadership unlocked.", effects: { } }, onFail: { next: "FAIL", text: "No one hears you over the speakers.", effects: { stress: 0.7 } } },
          { id: "c", text: "Hide in the supply closet (briefly).", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { stress: -0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "You emerge recharged and weirdly effective.", effects: { } }, onFail: { next: "FAIL", text: "You are found by a child with a whistle.", effects: { stress: 0.8 } } }
        ]
      }
    },
    winText: "✅ Volunteer arc: survived.",
    failText: "💥 Clipboard owns your soul now."
  },
  // 12) Cooking Experiment Goes Viral
  {
    id: "cooking_experiment_viral",
    category: "adult",
    title: "Cooking Experiment Goes Viral",
    tagline: "The smoke alarm has thoughts.",
    difficulty: 5,
    rewardHint: "💎 2–4",
    startNodeId: "ce1",
    nodes: {
      ce1: {
        text: "You attempt a trendy recipe. Camera rolling.",
        prompt: "Step one?",
        choices: [
          { id: "a", text: "Mise en place like a pro.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { responsibility: 0.00001 }, run: { composure: 0.03 } }, onSuccess: { next: "ce2", text: "Smooth start.", effects: { } }, onFail: { next: "FAIL", text: "You forgot the pan. The pan forgot you.", effects: { stress: 0.6 } } },
          { id: "b", text: "Wing it for content.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { stress: -0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "ce2", text: "Chaotic but watchable.", effects: { } }, onFail: { next: "FAIL", text: "You salt the sugar. Comments are loud.", effects: { stress: 0.7 } } },
          { id: "c", text: "Hack the oven ‘for speed.’", riskTier: "high", runDelta: { chaos: 2 }, check: { parent: { playerHealth: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "ce2", text: "Turbo bake!", effects: { } }, onFail: { next: "FAIL", text: "Your smoke alarm posts its own reaction video.", effects: { stress: 0.9 } } }
        ]
      },
      ce2: {
        text: "Plating and posting.",
        prompt: "Closer?",
        choices: [
          { id: "a", text: "Natural light + angle.", riskTier: "low", runDelta: { composure: 1 }, check: { parent: { love: 0.00002 }, run: { composure: 0.03 } }, onSuccess: { next: "WIN", text: "Looks amazing. Comments: kind.", effects: { } }, onFail: { next: "FAIL", text: "Photo reveals a smoke cloud cameo.", effects: { stress: 0.7 } } },
          { id: "b", text: "Add sizzling ASMR.", riskTier: "medium", runDelta: { cred: 1 }, check: { parent: { love: 0.00002 }, run: { cred: 0.03 } }, onSuccess: { next: "WIN", text: "Algorithm nods.", effects: { } }, onFail: { next: "FAIL", text: "Microphone captures your yell.", effects: { stress: 0.8 } } },
          { id: "c", text: "Live stream the first bite.", riskTier: "high", runDelta: { chaos: 1 }, check: { parent: { playerHealth: 0.00002 }, run: { chaos: -0.03 } }, onSuccess: { next: "WIN", text: "It’s actually good!", effects: { } }, onFail: { next: "FAIL", text: "You cough. Twice. Viral anyway.", effects: { stress: 0.9 } } }
        ]
      }
    },
    winText: "✅ You trend for good reasons.",
    failText: "💥 Your smoke alarm goes viral instead."
  }
];