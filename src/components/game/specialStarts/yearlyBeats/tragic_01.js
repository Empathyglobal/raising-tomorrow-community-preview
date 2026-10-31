export const SPECIAL_START_YEARLY_BEATS__TRAGIC_01 = {
  no_safety_net: {
    1: {
      title: "Born Into Poverty",
      topic: "Economic survival",
      scene: "{childName} is born into family with no resources or safety net.",
      choices: {
        connect: { text: "Love them fully despite poverty.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand their circumstances.", consequence: "They grasp reality." },
        boundary: { text: "They're a child first.", consequence: "They're innocent." },
        avoid: { text: "Make them feel responsible.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'we're helpless.'", consequence: "{childName} internalizes hopelessness." }
      }
    },
    2: {
      title: "Basic Needs Are Struggles",
      topic: "Survival mode",
      scene: "{childName} is 2-3. Food, shelter, healthcare all uncertain.",
      choices: {
        connect: { text: "Provide what you can with love.", consequence: "{childName} feels cared for." },
        teach: { text: "Help them understand priorities.", consequence: "They're grounded." },
        boundary: { text: "They're not responsible for survival.", consequence: "They're protected." },
        avoid: { text: "Make them aware of every shortage.", consequence: "{childName} internalizes that they're burden." },
        harm: { text: "Tell them they're too expensive.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    3: {
      title: "No Safety Net: Falling Means Disaster",
      topic: "Fragility",
      scene: "{childName} is 3-4. One illness or injury means crisis.",
      choices: {
        connect: { text: "Protect them as much as possible.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand caution.", consequence: "They're careful." },
        boundary: { text: "Prevention is important.", consequence: "They're secure." },
        avoid: { text: "Make them feel unsafe.", consequence: "{childName} internalizes anxiety." },
        harm: { text: "Tell them 'one mistake ruins us.'", consequence: "{childName} internalizes perfectionism." }
      }
    },
    4: {
      title: "School: Visible Poverty",
      topic: "Social shame",
      scene: "{childName} is in school. Peers notice their poverty.",
      choices: {
        connect: { text: "Help them navigate with dignity.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that poverty isn't shameful.", consequence: "They're grounded." },
        boundary: { text: "Their worth isn't their wealth.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Food Insecurity: Will There Be Enough?",
      topic: "Hunger reality",
      scene: "{childName} is 5-6. Meals aren't guaranteed.",
      choices: {
        connect: { text: "Feed them when you can with love.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand meal planning.", consequence: "They grasp it." },
        boundary: { text: "Food insecurity isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Make them feel responsible.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them they eat too much.", consequence: "{childName} internalizes food shame." }
      }
    },
    6: {
      title: "Identity: Who Are They?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they without money?",
      choices: {
        connect: { text: "Affirm their value beyond poverty.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that poverty is circumstance, not identity.", consequence: "They understand." },
        boundary: { text: "They're more than their poverty.", consequence: "They're secure." },
        avoid: { text: "Make poverty their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them poverty defines them.", consequence: "{childName} internalizes that wealth = worth." }
      }
    },
    7: {
      title: "Work Early: Helping Family Survive",
      topic: "Child labor reality",
      scene: "{childName} is 7. Contributing to family survival.",
      choices: {
        connect: { text: "Assign age-appropriate help.", consequence: "{childName} contributes meaningfully." },
        teach: { text: "Balance work with childhood.", consequence: "They develop well." },
        boundary: { text: "Childhood is protected.", consequence: "They're secure." },
        avoid: { text: "Overload them with adult work.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them work is all they're worth.", consequence: "{childName} internalizes servitude." }
      }
    },
    8: {
      title: "Peer Relationships: Can They Afford Friends?",
      topic: "Social participation",
      scene: "{childName} is 8. Peers do activities that cost money.",
      choices: {
        connect: { text: "Find free activities for them.", consequence: "{childName} has friends." },
        teach: { text: "Help them explain their situation.", consequence: "They navigate." },
        boundary: { text: "Friendship transcends money.", consequence: "They're secure." },
        avoid: { text: "Make them feel excluded.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they don't belong.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Escape Fantasy: Winning Lottery or Fortune",
      topic: "Magical thinking",
      scene: "{childName} is 9. Dreaming of sudden wealth.",
      choices: {
        connect: { text: "Validate their dreams.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss realistic paths forward.", consequence: "They're grounded." },
        boundary: { text: "Hope is important.", consequence: "They're secure." },
        avoid: { text: "Crush their dreams.", consequence: "{childName} loses hope." },
        harm: { text: "Tell them they'll always be poor.", consequence: "{childName} internalizes despair." }
      }
    },
    10: {
      title: "Developing Skills: Only Asset They Have",
      topic: "Self-reliance",
      scene: "{childName} is 10. Their skills are their wealth.",
      choices: {
        connect: { text: "Help them develop valuable skills.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that skills can create opportunity.", consequence: "They believe in themselves." },
        boundary: { text: "Skills matter.", consequence: "They're empowered." },
        avoid: { text: "Tell them skills won't help.", consequence: "{childName} internalizes helplessness." },
        harm: { text: "Tell them they're worthless.", consequence: "{childName} internalizes self-hatred." }
      }
    },
    11: {
      title: "Adolescence: Will Things Get Better or Worse?",
      topic: "Future uncertainty",
      scene: "{childName} is 11. Wondering about their trajectory.",
      choices: {
        connect: { text: "Support their hope.", consequence: "{childName} is resilient." },
        teach: { text: "Discuss paths to improvement.", consequence: "They see options." },
        boundary: { text: "Better future is possible.", consequence: "They're empowered." },
        avoid: { text: "Tell them it only gets worse.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them poverty is their destiny.", consequence: "{childName} gives up." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Poverty",
      topic: "Romantic shame",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them navigate poverty in relationships.", consequence: "They navigate." },
        boundary: { text: "Poverty doesn't disqualify them.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will want them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they'll endanger partners.", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "Working Teen: Money Needed Now",
      topic: "Economic pressure",
      scene: "{childName} is 13. Family needs their income.",
      choices: {
        connect: { text: "Balance school and work.", consequence: "{childName} manages well." },
        teach: { text: "Help them protect their future.", consequence: "They're strategic." },
        boundary: { text: "They deserve education.", consequence: "They're protected." },
        avoid: { text: "Pull them from school.", consequence: "{childName} loses literacy." },
        harm: { text: "Tell them education is luxury.", consequence: "{childName} internalizes that survival = all." }
      }
    },
    14: {
      title: "Education or Work: Impossible Choice",
      topic: "Future stakes",
      scene: "{childName} is 14. Can't afford both school and survival.",
      choices: {
        connect: { text: "Help them find resources.", consequence: "{childName} can do both." },
        teach: { text: "Discuss that education opens doors.", consequence: "They believe in it." },
        boundary: { text: "Both are possible.", consequence: "They're empowered." },
        avoid: { text: "Tell them to choose work.", consequence: "{childName} loses education." },
        harm: { text: "Tell them education is impossible.", consequence: "{childName} loses hope." }
      }
    },
    15: {
      title: "College Planning: Unaffordable Dream?",
      topic: "Future education",
      scene: "{childName} is 15. College seems impossible.",
      choices: {
        connect: { text: "Research scholarships and aid.", consequence: "{childName} can attend." },
        teach: { text: "Discuss paths to college.", consequence: "They're informed." },
        boundary: { text: "College is accessible.", consequence: "They're empowered." },
        avoid: { text: "Tell them college isn't possible.", consequence: "{childName} limits dreams." },
        harm: { text: "Tell them to accept their poverty.", consequence: "{childName} gives up." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Financial Reality",
      topic: "Love amid poverty",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them navigate poverty in partnership.", consequence: "They communicate." },
        boundary: { text: "Poverty doesn't invalidate love.", consequence: "They're worthy." },
        avoid: { text: "Tell them partner will leave.", consequence: "{childName} internalizes abandonment fear." },
        harm: { text: "Tell them their poverty will ruin partner.", consequence: "{childName} internalizes guilt." }
      }
    },
    17: {
      title: "Understanding Parents: Why This Poverty?",
      topic: "Parental reality",
      scene: "{childName} is 17. Can they understand?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss systemic poverty.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding doesn't mean blame.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parents failed them.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Break the Cycle or Accept It?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about breaking cycles.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them poverty is destiny.", consequence: "{childName} might give up." },
        harm: { text: "Tell them they'll always be poor.", consequence: "{childName} internalizes hopelessness." }
      }
    }
  },

  frida_eric: {
    1: {
      title: "Abuela Becomes Guardian",
      topic: "Sudden responsibility",
      scene: "{childName} is 1. Grandmother takes custody. She has pension only.",
      choices: {
        connect: { text: "Love them with all her heart.", consequence: "{childName} feels wanted." },
        teach: { text: "Teach {childName} about their situation gently.", consequence: "They're grounded." },
        boundary: { text: "Family bonds are strong.", consequence: "They're secure." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'we have nothing.'", consequence: "{childName} internalizes shame." }
      }
    },
    2: {
      title: "Food Stamps and Government Help",
      topic: "Assistance survival",
      scene: "{childName} is 2-3. Abuela budgets with food stamps.",
      choices: {
        connect: { text: "Make meals loving despite limits.", consequence: "{childName} feels cared for." },
        teach: { text: "Help them understand budgeting.", consequence: "They grasp reality." },
        boundary: { text: "Assistance is support, not shame.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed of help.", consequence: "{childName} internalizes shame of poverty." },
        harm: { text: "Tell them 'we're taking charity.'", consequence: "{childName} internalizes shame." }
      }
    },
    3: {
      title: "Government Food Boxes: Confusion About Contents",
      topic: "Donated goods",
      scene: "{childName} is 3-4. Learning about food assistance boxes.",
      choices: {
        connect: { text: "Frame government help as support.", consequence: "{childName} understands." },
        teach: { text: "Teach gratitude for resources.", consequence: "They're appreciative." },
        boundary: { text: "Using help is normal.", consequence: "They're secure." },
        avoid: { text: "Make them feel like recipients of charity.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'this is all we deserve.'", consequence: "{childName} internalizes that they're less." }
      }
    },
    4: {
      title: "School: Noticing Food Differences",
      topic: "Peer comparison",
      scene: "{childName} is 4-5. Peers have different food.",
      choices: {
        connect: { text: "Affirm their lunch with love.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that all food feeds the body.", consequence: "They're grounded." },
        boundary: { text: "Their food is theirs.", consequence: "They're secure." },
        avoid: { text: "Make them embarrassed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them their food is inferior.", consequence: "{childName} internalizes that poverty = less." }
      }
    },
    5: {
      title: "Salvaging: Finding Value in Discards",
      topic: "Resourcefulness begins",
      scene: "{childName} is 5-6. Abuela teaches finding good items in waste.",
      choices: {
        connect: { text: "Frame salvaging as skill and resourcefulness.", consequence: "{childName} is proud." },
        teach: { text: "Teach careful selection and cleaning.", consequence: "They're thoughtful." },
        boundary: { text: "Finding good things is smart, not shameful.", consequence: "They're secure." },
        avoid: { text: "Make them feel like they're begging.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them salvaging is degrading.", consequence: "{childName} internalizes shame." }
      }
    },
    6: {
      title: "Identity: Who Are They?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Abuela teaching them about themselves.",
      choices: {
        connect: { text: "Affirm their worth beyond poverty.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss family strength and resilience.", consequence: "They're proud." },
        boundary: { text: "They're valuable as they are.", consequence: "They're secure." },
        avoid: { text: "Let them absorb others' judgments.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them poverty defines them.", consequence: "{childName} internalizes limitation." }
      }
    },
    7: {
      title: "Helping Abuela: Working Early",
      topic: "Family contribution",
      scene: "{childName} is 7. Helping find and repair salvaged items.",
      choices: {
        connect: { text: "Make it bonding time with Abuela.", consequence: "{childName} feels connected." },
        teach: { text: "Teach them practical skills.", consequence: "They're capable." },
        boundary: { text: "Work respects their childhood.", consequence: "They're secure." },
        avoid: { text: "Burden them with adult work.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them work is their value.", consequence: "{childName} internalizes servitude." }
      }
    },
    8: {
      title: "Trash Treasures: Learning Value in Discards",
      topic: "Economic creativity",
      scene: "{childName} is 8. Understanding what others discard, they value.",
      choices: {
        connect: { text: "Celebrate their resourcefulness.", consequence: "{childName} is clever." },
        teach: { text: "Discuss economics and waste.", consequence: "They think critically." },
        boundary: { text: "Finding things is a skill.", consequence: "They're proud." },
        avoid: { text: "Make them feel like scavengers.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're poor so they deserve waste.", consequence: "{childName} internalizes worthlessness." }
      }
    },
    9: {
      title: "Peer Relationships: Hiding the Salvaging",
      topic: "Social shame",
      scene: "{childName} is 9. Keeping salvaging secret from peers.",
      choices: {
        connect: { text: "Affirm that resourcefulness is good.", consequence: "{childName} is confident." },
        teach: { text: "Discuss selective disclosure.", consequence: "They navigate." },
        boundary: { text: "They're not ashamed of survival.", consequence: "They're secure." },
        avoid: { text: "Make them internalize shame.", consequence: "{childName} becomes secretive." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} internalizes that helping family = shameful." }
      }
    },
    10: {
      title: "Electronics in the Waste: First Interest",
      topic: "Skills emerging",
      scene: "{childName} is 10. Finding discarded electronics, becoming curious.",
      choices: {
        connect: { text: "Support their curiosity about tech.", consequence: "{childName} is engaged." },
        teach: { text: "Help them learn how things work.", consequence: "They're analytical." },
        boundary: { text: "Their interest is valuable.", consequence: "They're secure." },
        avoid: { text: "Tell them electronics are not their world.", consequence: "{childName} suppresses interest." },
        harm: { text: "Tell them they're wasting time.", consequence: "{childName} internalizes that their interests don't matter." }
      }
    },
    11: {
      title: "Adolescence: Learning to Fix Things",
      topic: "Skill development",
      scene: "{childName} is 11-12. Teaching themselves to repair electronics.",
      choices: {
        connect: { text: "Support their skill development.", consequence: "{childName} is confident." },
        teach: { text: "Help them learn systematically.", consequence: "They're analytical." },
        boundary: { text: "Their skills matter.", consequence: "They're empowered." },
        avoid: { text: "Tell them skill-learning is waste of time.", consequence: "{childName} internalizes self-doubt." },
        harm: { text: "Tell them they'll never succeed.", consequence: "{childName} gives up." }
      }
    },
    12: {
      title: "Selling First Repaired Item",
      topic: "Economic turning point",
      scene: "{childName} is 12. First successful repair and sale.",
      choices: {
        connect: { text: "Celebrate their achievement.", consequence: "{childName} is proud." },
        teach: { text: "Discuss money and responsibility.", consequence: "They're thoughtful." },
        boundary: { text: "Their work has value.", consequence: "They're empowered." },
        avoid: { text: "Tell them it won't last.", consequence: "{childName} internalizes self-doubt." },
        harm: { text: "Tell them they're exploiting others.", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "Real Income: Money Makes Things Easier",
      topic: "Economic shift",
      scene: "{childName} is 13. Their income helps Abuela noticeably.",
      choices: {
        connect: { text: "Affirm their contribution.", consequence: "{childName} feels valued." },
        teach: { text: "Help them manage expectations.", consequence: "They're grounded." },
        boundary: { text: "Their work matters.", consequence: "They're secure." },
        avoid: { text: "Make them feel their work isn't enough.", consequence: "{childName} internalizes inadequacy." },
        harm: { text: "Tell them if they stop, Abuela suffers.", consequence: "{childName} internalizes guilt." }
      }
    },
    14: {
      title: "Refurbishing Business: Growing Operation",
      topic: "Economic success beginning",
      scene: "{childName} is 14. Money is real. Quality of life improves.",
      choices: {
        connect: { text: "Balance schooling and work.", consequence: "{childName} manages." },
        teach: { text: "Discuss long-term planning.", consequence: "They're strategic." },
        boundary: { text: "Education matters still.", consequence: "They're protected." },
        avoid: { text: "Let them drop school for income.", consequence: "{childName} loses literacy." },
        harm: { text: "Tell them school is luxury they can't afford.", consequence: "{childName} prioritizes money over future." }
      }
    },
    15: {
      title: "Money Success: New Pressures Emerge",
      topic: "Risk and exploitation",
      scene: "{childName} is 15. Making real money, but attracting attention.",
      choices: {
        connect: { text: "Help them navigate new status.", consequence: "{childName} is wise." },
        teach: { text: "Discuss risks of visible wealth.", consequence: "They're cautious." },
        boundary: { text: "Their safety matters.", consequence: "They're protected." },
        avoid: { text: "Ignore exploitation risks.", consequence: "{childName} becomes vulnerable." },
        harm: { text: "Tell them to trust everyone.", consequence: "{childName} gets taken advantage of." }
      }
    },
    16: {
      title: "Dating: Explaining Their Different Life",
      topic: "Romantic complications",
      scene: "{childName} is 16 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them explain their unique situation.", consequence: "They navigate." },
        boundary: { text: "Their life is valid.", consequence: "They're worthy." },
        avoid: { text: "Tell them peers won't understand.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're undesirable because of their past.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "School Suspicion: Why Are They Working?",
      topic: "Institutional conflict",
      scene: "{childName} is 17. Teachers question their work/school balance.",
      choices: {
        connect: { text: "Advocate for their reality.", consequence: "{childName} feels supported." },
        teach: { text: "Help them explain their situation.", consequence: "They advocate for themselves." },
        boundary: { text: "Working doesn't make them bad.", consequence: "They're secure." },
        avoid: { text: "Accept institutional judgment.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're doing something wrong.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Choice: Continue Business or Different Path?",
      topic: "Self-determination",
      scene: "{childName} is 18. Money helped, but at what cost?",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about success and cost.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must continue for Abuela.", consequence: "{childName} might resent." },
        harm: { text: "Tell them their work was exploitative.", consequence: "{childName} internalizes shame." }
      }
    }
  },

  border_crossing: {
    1: {
      title: "Born as Refugee",
      topic: "Displacement",
      scene: "{childName} is born in displacement or crossing situation.",
      choices: {
        connect: { text: "Love them fully amid chaos.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They grasp that safety is possible." },
        boundary: { text: "They're a child in crisis.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'we might not survive.'", consequence: "{childName} internalizes terror." }
      }
    },
    2: {
      title: "Constant Movement: No Fixed Home",
      topic: "Instability",
      scene: "{childName} is 2-3. Always moving, always uncertain.",
      choices: {
        connect: { text: "Create consistency within chaos.", consequence: "{childName} feels secure." },
        teach: { text: "Help them adapt to change.", consequence: "They're resilient." },
        boundary: { text: "Home is where family is.", consequence: "They're grounded." },
        avoid: { text: "Let instability overwhelm them.", consequence: "{childName} internalizes that nothing is safe." },
        harm: { text: "Tell them 'we're always hunted.'", consequence: "{childName} internalizes paranoia." }
      }
    },
    3: {
      title: "Language Barriers: Can't Communicate",
      topic: "Alienation",
      scene: "{childName} is 3-4. Learning new language or isolated by it.",
      choices: {
        connect: { text: "Help them navigate multiple languages.", consequence: "{childName} is capable." },
        teach: { text: "Support language learning.", consequence: "They develop." },
        boundary: { text: "Language barriers are temporary.", consequence: "They're secure." },
        avoid: { text: "Make them feel inferior.", consequence: "{childName} internalizes language shame." },
        harm: { text: "Tell them they'll never belong.", consequence: "{childName} internalizes permanent alienation." }
      }
    },
    4: {
      title: "School: New Country, New Rules",
      topic: "Cultural integration",
      scene: "{childName} is in school. Everything is foreign.",
      choices: {
        connect: { text: "Help them navigate new culture.", consequence: "{childName} adapts." },
        teach: { text: "Explain new cultural norms.", consequence: "They understand." },
        boundary: { text: "Both cultures can be theirs.", consequence: "They're secure." },
        avoid: { text: "Make them feel like outsider.", consequence: "{childName} internalizes rejection." },
        harm: { text: "Tell them they'll never fit in.", consequence: "{childName} internalizes permanent alienation." }
      }
    },
    5: {
      title: "Trauma Awareness: What Did They Witness?",
      topic: "Psychological burden",
      scene: "{childName} is 5-6. Old enough to remember crossing.",
      choices: {
        connect: { text: "Gently process trauma with love.", consequence: "{childName} heals gradually." },
        teach: { text: "Help them understand they survived.", consequence: "They develop resilience." },
        boundary: { text: "Trauma isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Ignore their trauma.", consequence: "{childName} internalizes unprocessed pain." },
        harm: { text: "Tell them they should be grateful.", consequence: "{childName} internalizes that trauma = shameful." }
      }
    },
    6: {
      title: "Identity: Child of Which Country?",
      topic: "Belonging questions",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their dual heritage.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that both homes matter.", consequence: "They integrate." },
        boundary: { text: "They belong to both worlds.", consequence: "They're secure." },
        avoid: { text: "Force them to choose.", consequence: "{childName} internalizes fragmentation." },
        harm: { text: "Tell them they're foreign forever.", consequence: "{childName} internalizes permanent outsider status." }
      }
    },
    7: {
      title: "Documentation Fears: Are They Legal?",
      topic: "Legal precarity",
      scene: "{childName} is 7. Aware of legal status questions.",
      choices: {
        connect: { text: "Protect them from adult fear.", consequence: "{childName} feels safe." },
        teach: { text: "Age-appropriately explain.", consequence: "They grasp reality." },
        boundary: { text: "Legal status doesn't define worth.", consequence: "They're secure." },
        avoid: { text: "Make them terrified of authorities.", consequence: "{childName} internalizes terror." },
        harm: { text: "Tell them they could be deported.", consequence: "{childName} internalizes existential dread." }
      }
    },
    8: {
      title: "Peer Relationships: Different Background",
      topic: "Social integration",
      scene: "{childName} is 8. Peers question their origins.",
      choices: {
        connect: { text: "Help them explain with confidence.", consequence: "{childName} is secure." },
        teach: { text: "Discuss selective disclosure.", consequence: "They navigate." },
        boundary: { text: "Their story is theirs to tell.", consequence: "They're empowered." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they don't belong.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Economic Struggle: Refugee Family Rebuilding",
      topic: "Poverty and displacement",
      scene: "{childName} is 9. Family struggling economically.",
      choices: {
        connect: { text: "Help them understand survival.", consequence: "{childName} is resilient." },
        teach: { text: "Frame struggle as temporary.", consequence: "They have hope." },
        boundary: { text: "They're not responsible for survival.", consequence: "They're protected." },
        avoid: { text: "Tell them they're burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them family sacrificed everything.", consequence: "{childName} internalizes guilt." }
      }
    },
    10: {
      title: "Home Memory vs. New Home",
      topic: "Belonging and loss",
      scene: "{childName} is 10. Missing home vs. accepting new one.",
      choices: {
        connect: { text: "Honor both homes.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that memory and reality both matter.", consequence: "They integrate." },
        boundary: { text: "Both can be home.", consequence: "They're secure." },
        avoid: { text: "Tell them to forget home.", consequence: "{childName} internalizes loss." },
        harm: { text: "Tell them old home was wrong.", consequence: "{childName} internalizes that heritage = shame." }
      }
    },
    11: {
      title: "Adolescence: Caught Between Worlds",
      topic: "Identity formation",
      scene: "{childName} is 11. Who are they becoming?",
      choices: {
        connect: { text: "Support their bicultural identity.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that both cultures strengthen them.", consequence: "They're confident." },
        boundary: { text: "Both worlds are theirs.", consequence: "They're secure." },
        avoid: { text: "Force them to choose sides.", consequence: "{childName} internalizes fragmentation." },
        harm: { text: "Tell them they're fully neither.", consequence: "{childName} internalizes alienation." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Their Story",
      topic: "Romantic honesty",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about disclosure.", consequence: "They navigate." },
        boundary: { text: "Their story is valid.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will accept them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them partners will reject them.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    13: {
      title: "Looking Back: Processing Displacement",
      topic: "Trauma processing",
      scene: "{childName} is 13. Able to understand what happened.",
      choices: {
        connect: { text: "Support their processing.", consequence: "{childName} heals." },
        teach: { text: "Help them understand they survived.", consequence: "They're resilient." },
        boundary: { text: "Trauma isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Tell them to forget.", consequence: "{childName} internalizes unprocessed pain." },
        harm: { text: "Tell them they should be grateful.", consequence: "{childName} internalizes guilt." }
      }
    },
    14: {
      title: "Opportunity: New Country Provides Access",
      topic: "Possibility emerging",
      scene: "{childName} is 14. Realizing opportunities they wouldn't have had.",
      choices: {
        connect: { text: "Support their aspirations.", consequence: "{childName} is hopeful." },
        teach: { text: "Help them develop opportunities.", consequence: "They're empowered." },
        boundary: { text: "Future is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them they don't deserve opportunities.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them seizing opportunities is betrayal.", consequence: "{childName} suppresses ambition." }
      }
    },
    15: {
      title: "College Planning: Education as Path Forward",
      topic: "Future independence",
      scene: "{childName} is 15. Education seems achievable.",
      choices: {
        connect: { text: "Support their educational goals.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss education as opportunity.", consequence: "They're informed." },
        boundary: { text: "Education is accessible.", consequence: "They're secure." },
        avoid: { text: "Tell them education isn't for them.", consequence: "{childName} limits dreams." },
        harm: { text: "Tell them they're taking opportunity from citizens.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Different Background",
      topic: "Love and cultural difference",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them navigate cultural differences.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make partner's family uncomfortable.", consequence: "{childName} loses love." },
        harm: { text: "Tell them partner's family will reject them.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Journey: How Did They Get Here?",
      topic: "Narrative integration",
      scene: "{childName} is 17. Ready to understand their story.",
      choices: {
        connect: { text: "Share family's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss resilience and survival.", consequence: "They're proud." },
        boundary: { text: "Their story is powerful.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them their family's choices were wrong.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Build in New Country or Revisit Old?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their future.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about belonging.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} might resent." },
        harm: { text: "Tell them going back is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    }
  },

  disaster_rebuild: {
    1: {
      title: "Born Into Disaster Recovery",
      topic: "Post-catastrophe",
      scene: "{childName} is born right after family loses everything in disaster.",
      choices: {
        connect: { text: "Love them fully amid rebuilding.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand their situation.", consequence: "They grasp resilience." },
        boundary: { text: "They're not responsible for disaster.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like reminder of loss.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'we've lost everything.'", consequence: "{childName} internalizes despair." }
      }
    },
    2: {
      title: "Temporary Housing: No Real Home",
      topic: "Instability after loss",
      scene: "{childName} is 2-3. Living in emergency shelter or temporary housing.",
      choices: {
        connect: { text: "Create comfort wherever possible.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand temporary state.", consequence: "They adapt." },
        boundary: { text: "Home is where family is.", consequence: "They're secure." },
        avoid: { text: "Make homelessness feel permanent.", consequence: "{childName} internalizes that they'll never have home." },
        harm: { text: "Tell them 'we'll always be homeless.'", consequence: "{childName} internalizes hopelessness." }
      }
    },
    3: {
      title: "Rebuilding from Rubble: Everything Lost",
      topic: "Material loss",
      scene: "{childName} is 3-4. Growing up with no possessions from before.",
      choices: {
        connect: { text: "Help them find joy in simplicity.", consequence: "{childName} is grateful." },
        teach: { text: "Discuss that people matter, possessions don't.", consequence: "They're grounded." },
        boundary: { text: "Rebuilding is possible.", consequence: "They're hopeful." },
        avoid: { text: "Make them feel deprived.", consequence: "{childName} internalizes resentment." },
        harm: { text: "Tell them loss will define them forever.", consequence: "{childName} internalizes despair." }
      }
    },
    4: {
      title: "School in New Location: Everything Changed",
      topic: "Social displacement",
      scene: "{childName} is in school. At new school in new place.",
      choices: {
        connect: { text: "Help them make new friendships.", consequence: "{childName} adapts." },
        teach: { text: "Discuss that new starts are possible.", consequence: "They're hopeful." },
        boundary: { text: "Old loss doesn't define new.", consequence: "They're secure." },
        avoid: { text: "Make them feel like outsider.", consequence: "{childName} internalizes rejection." },
        harm: { text: "Tell them they'll never fit in.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Memories of Lost Home",
      topic: "Grief for past",
      scene: "{childName} is 5-6. Starting to remember what was lost.",
      choices: {
        connect: { text: "Honor their memories and sadness.", consequence: "{childName} grieves healthily." },
        teach: { text: "Discuss that grief is love.", consequence: "They understand loss." },
        boundary: { text: "Memory is precious.", consequence: "They're secure." },
        avoid: { text: "Tell them to forget.", consequence: "{childName} internalizes that loss = shameful." },
        harm: { text: "Tell them they should be grateful they survived.", consequence: "{childName} suppresses grief." }
      }
    },
    6: {
      title: "Identity: Child of Disaster?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their identity beyond disaster.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that disaster doesn't define them.", consequence: "They're confident." },
        boundary: { text: "They're more than loss.", consequence: "They're secure." },
        avoid: { text: "Make disaster their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're disaster children.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "Helping Rebuild: Contributing to Family",
      topic: "Participation in recovery",
      scene: "{childName} is 7. Helping with rebuilding efforts.",
      choices: {
        connect: { text: "Make it bonding experience.", consequence: "{childName} feels connected." },
        teach: { text: "Teach them that rebuilding is possible.", consequence: "They're empowered." },
        boundary: { text: "Work respects their age.", consequence: "They're secure." },
        avoid: { text: "Overburden them with adult work.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them rebuilding is all their responsibility.", consequence: "{childName} internalizes guilt." }
      }
    },
    8: {
      title: "Progress: New Home Taking Shape",
      topic: "Hope and recovery",
      scene: "{childName} is 8. Seeing new structure being built.",
      choices: {
        connect: { text: "Celebrate progress together.", consequence: "{childName} feels hopeful." },
        teach: { text: "Discuss that rebuilding takes time.", consequence: "They're patient." },
        boundary: { text: "Progress is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them rebuilding is impossible.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them new home will be disaster again.", consequence: "{childName} internalizes fear." }
      }
    },
    9: {
      title: "Peer Relationships: Different Experience",
      topic: "Social navigation",
      scene: "{childName} is 9. Peers haven't experienced disaster.",
      choices: {
        connect: { text: "Help them feel normal.", consequence: "{childName} is confident." },
        teach: { text: "Discuss shared human experience.", consequence: "They bond authentically." },
        boundary: { text: "Their experience is valid.", consequence: "They're secure." },
        avoid: { text: "Make them feel isolated.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them no one understands.", consequence: "{childName} becomes isolated." }
      }
    },
    10: {
      title: "New Home: Finally Stable Housing",
      topic: "Recovery milestone",
      scene: "{childName} is 10. Family moves into rebuilt or new home.",
      choices: {
        connect: { text: "Celebrate this milestone.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss that recovery is real.", consequence: "They're grounded." },
        boundary: { text: "Home is theirs again.", consequence: "They're secure." },
        avoid: { text: "Tell them stability is temporary.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them this home will be lost too.", consequence: "{childName} internalizes dread." }
      }
    },
    11: {
      title: "Adolescence: Processing What Happened",
      topic: "Trauma integration",
      scene: "{childName} is 11. Old enough to understand full impact.",
      choices: {
        connect: { text: "Support their processing.", consequence: "{childName} heals." },
        teach: { text: "Help them understand resilience.", consequence: "They're proud." },
        boundary: { text: "Understanding is healing.", consequence: "They're secure." },
        avoid: { text: "Suppress conversation about disaster.", consequence: "{childName} internalizes unprocessed trauma." },
        harm: { text: "Tell them they should be grateful.", consequence: "{childName} suppresses grief and fear." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Their Story",
      topic: "Romantic honesty",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about disclosure.", consequence: "They navigate." },
        boundary: { text: "Their story is valid.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will accept them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them their past makes them unlovable.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    13: {
      title: "Fear of Future Disasters: Anxiety Emerging",
      topic: "PTSD awareness",
      scene: "{childName} is 13. Anxious about future disasters.",
      choices: {
        connect: { text: "Support their fears with compassion.", consequence: "{childName} feels heard." },
        teach: { text: "Teach grounding and resilience.", consequence: "They're empowered." },
        boundary: { text: "Fear is understandable.", consequence: "They're secure." },
        avoid: { text: "Dismiss their fears.", consequence: "{childName} internalizes that feelings don't matter." },
        harm: { text: "Tell them disaster will happen again.", consequence: "{childName} internalizes hypervigilance." }
      }
    },
    14: {
      title: "Rebuilding Success: Family's New Normal",
      topic: "New stability",
      scene: "{childName} is 14. Family has stabilized and rebuilt.",
      choices: {
        connect: { text: "Celebrate their resilience together.", consequence: "{childName} is proud." },
        teach: { text: "Discuss what they learned.", consequence: "They're wise." },
        boundary: { text: "They survived and thrived.", consequence: "They're secure." },
        avoid: { text: "Minimize what they endured.", consequence: "{childName} internalizes that suffering doesn't matter." },
        harm: { text: "Tell them success is temporary.", consequence: "{childName} internalizes anxiety." }
      }
    },
    15: {
      title: "College Planning: Building Their Own Future",
      topic: "Independent future",
      scene: "{childName} is 15. Planning education and future.",
      choices: {
        connect: { text: "Support their aspirations.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss that they're not limited by past.", consequence: "They're hopeful." },
        boundary: { text: "Future is theirs to build.", consequence: "They're secure." },
        avoid: { text: "Tell them they should stay home.", consequence: "{childName} suppresses ambition." },
        harm: { text: "Tell them they owe family sacrifice.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Trauma",
      topic: "Love amid healing",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them communicate their needs.", consequence: "They're honest." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make them feel broken.", consequence: "{childName} internalizes that trauma = unlovable." },
        harm: { text: "Tell them partner will leave if they knew.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Understanding Family's Journey: Why/How They Survived",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share family's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss resilience and love.", consequence: "They're proud." },
        boundary: { text: "Their story is powerful.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them family's choices were foolish.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Build Somewhere Safe or Different?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing where to build their life.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about resilience.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay local.", consequence: "{childName} might resent." },
        harm: { text: "Tell them leaving is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    }
  }
};