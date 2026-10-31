export const SPECIAL_START_YEARLY_BEATS__TRAGIC_04 = {
  nicu_first_year: {
    1: {
      title: "Born Too Early: NICU Admission",
      topic: "Premature birth crisis",
      scene: "{childName} is born prematurely, immediately sent to NICU.",
      choices: {
        connect: { text: "Stay close despite medical equipment.", consequence: "{childName} feels parent's presence." },
        teach: { text: "Help parent understand NICU care.", consequence: "They grasp it's helping." },
        boundary: { text: "Medical intervention is love.", consequence: "They're protected." },
        avoid: { text: "Abandon them in hospital.", consequence: "{childName} internalizes abandonment." },
        harm: { text: "Tell them baby might not survive.", consequence: "{childName} internalizes fear." }
      }
    },
    2: {
      title: "Fragile Days: Monitoring Vital Signs",
      topic: "Medical fragility",
      scene: "{childName} is weeks old. Breathing support, constant monitoring.",
      choices: {
        connect: { text: "Talk to them through medical care.", consequence: "{childName} hears parent's voice." },
        teach: { text: "Explain that machines are helping.", consequence: "They're grounded." },
        boundary: { text: "They're being saved.", consequence: "They're secure." },
        avoid: { text: "Treat them as already lost.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Tell them they're burden.", consequence: "{childName} internalizes guilt." }
      }
    },
    3: {
      title: "First Setback: Health Crisis",
      topic: "Complication fear",
      scene: "{childName} is 3-4 weeks. Infection or breathing issue.",
      choices: {
        connect: { text: "Support parent through fear.", consequence: "{childName} feels held." },
        teach: { text: "Help parent understand recovery is possible.", consequence: "They find hope." },
        boundary: { text: "Medical team is fighting for them.", consequence: "They're protected." },
        avoid: { text: "Tell parent to prepare for death.", consequence: "{childName} internalizes despair." },
        harm: { text: "Make parent feel responsible.", consequence: "{childName} internalizes parental guilt transfer." }
      }
    },
    4: {
      title: "Gradual Progress: Small Milestones",
      topic: "Recovery increments",
      scene: "{childName} is 4-6 weeks. Breathing improves, less support needed.",
      choices: {
        connect: { text: "Celebrate every small victory.", consequence: "{childName} feels hope." },
        teach: { text: "Help parent see trajectory.", consequence: "They believe in recovery." },
        boundary: { text: "Progress is real.", consequence: "They're secure." },
        avoid: { text: "Expect setbacks constantly.", consequence: "{childName} internalizes anxiety." },
        harm: { text: "Tell them to not hope.", consequence: "{childName} internalizes protection through despair." }
      }
    },
    5: {
      title: "Feeding Journey: Learning to Eat",
      topic: "Developmental milestone",
      scene: "{childName} is 6-8 weeks. Learning to bottle or breastfeed.",
      choices: {
        connect: { text: "Support feeding attempts with patience.", consequence: "{childName} learns." },
        teach: { text: "Celebrate every ounce gained.", consequence: "They feel progress." },
        boundary: { text: "Feeding is bonding.", consequence: "They're secure." },
        avoid: { text: "Force feeding or show frustration.", consequence: "{childName} internalizes shame about eating." },
        harm: { text: "Tell them they're failing.", consequence: "{childName} internalizes inadequacy." }
      }
    },
    6: {
      title: "Identity: NICU Baby",
      topic: "Self-understanding",
      scene: "{childName} is 8-10 weeks. Still in NICU care.",
      choices: {
        connect: { text: "Affirm they're a fighter.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss their strength.", consequence: "They're proud." },
        boundary: { text: "NICU is temporary.", consequence: "They're secure." },
        avoid: { text: "Make NICU their whole identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're fragile forever.", consequence: "{childName} internalizes fragility belief." }
      }
    },
    7: {
      title: "Getting Closer: Room Temperature Success",
      topic: "Care independence",
      scene: "{childName} is 10-12 weeks. No longer needs incubator.",
      choices: {
        connect: { text: "Hold them close more.", consequence: "{childName} bonds deeply." },
        teach: { text: "Celebrate their capability.", consequence: "They're proud." },
        boundary: { text: "They're growing stronger.", consequence: "They're secure." },
        avoid: { text: "Still treat them as fragile.", consequence: "{childName} internalizes fragility." },
        harm: { text: "Tell them they're still at risk.", consequence: "{childName} internalizes fear." }
      }
    },
    8: {
      title: "Discharge Planning: Going Home",
      topic: "NICU exit preparation",
      scene: "{childName} is 12-14 weeks. Ready to leave NICU soon.",
      choices: {
        connect: { text: "Support family's excitement and anxiety.", consequence: "{childName} feels mixed emotions." },
        teach: { text: "Help parent learn home care.", consequence: "They're prepared." },
        boundary: { text: "Home is safe.", consequence: "They're secure." },
        avoid: { text: "Make parents terrified of home care.", consequence: "{childName} internalizes parental anxiety." },
        harm: { text: "Tell them they're not ready.", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "First Weeks Home: Adjusted to Normal",
      topic: "Transition success",
      scene: "{childName} is 3-4 months. Home from NICU.",
      choices: {
        connect: { text: "Create safe, calm home.", consequence: "{childName} feels secure." },
        teach: { text: "Help them adjust to home.", consequence: "They're grounded." },
        boundary: { text: "Home is healing.", consequence: "They're secure." },
        avoid: { text: "Keep NICU-level anxiety at home.", consequence: "{childName} internalizes parental fear." },
        harm: { text: "Tell them they shouldn't have survived.", consequence: "{childName} internalizes that existence = burden." }
      }
    },
    10: {
      title: "Catching Up: Developmental Delays",
      topic: "Prematurity catch-up",
      scene: "{childName} is 4-5 months corrected age. Reaching milestones.",
      choices: {
        connect: { text: "Celebrate their pace of development.", consequence: "{childName} is proud." },
        teach: { text: "Discuss that prematurity explains delays.", consequence: "They're grounded." },
        boundary: { text: "They'll catch up.", consequence: "They're secure." },
        avoid: { text: "Push them to develop faster.", consequence: "{childName} internalizes performance pressure." },
        harm: { text: "Tell them they're behind forever.", consequence: "{childName} internalizes inadequacy." }
      }
    },
    11: {
      title: "Health Follow-Ups: Ongoing Medical Care",
      topic: "Residual monitoring",
      scene: "{childName} is 6-8 months. Regular specialist visits.",
      choices: {
        connect: { text: "Make medical visits feel safe.", consequence: "{childName} cooperates." },
        teach: { text: "Explain care is preventative.", consequence: "They understand." },
        boundary: { text: "Follow-ups are important.", consequence: "They're secure." },
        avoid: { text: "Traumatize them in medical settings.", consequence: "{childName} internalizes medical fear." },
        harm: { text: "Tell them they're still very sick.", consequence: "{childName} internalizes ongoing fragility." }
      }
    },
    12: {
      title: "Processing NICU: Parent's Trauma",
      topic: "Family emotional aftermath",
      scene: "{childName} is 8-10 months. Parent processing their NICU experience.",
      choices: {
        connect: { text: "Support parent's healing.", consequence: "{childName} feels safe." },
        teach: { text: "Help parent integrate experience.", consequence: "They process." },
        boundary: { text: "Parent's trauma isn't child's burden.", consequence: "They're protected." },
        avoid: { text: "Make parent's trauma child's responsibility.", consequence: "{childName} internalizes caregiver burden." },
        harm: { text: "Tell them parent's grief is their fault.", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "First Year Milestone: Celebrating Survival",
      topic: "Anniversary reflection",
      scene: "{childName} is 12 months. First birthday.",
      choices: {
        connect: { text: "Celebrate their strength.", consequence: "{childName} is proud." },
        teach: { text: "Help them understand their journey.", consequence: "They're grounded." },
        boundary: { text: "Survival is strength.", consequence: "They're secure." },
        avoid: { text: "Focus only on medical trauma.", consequence: "{childName} internalizes that existence = crisis." },
        harm: { text: "Tell them they're still fragile.", consequence: "{childName} internalizes fragility belief." }
      }
    },
    14: {
      title: "Moving Forward: Beyond NICU Identity",
      topic: "Future orientation",
      scene: "{childName} is 14 months. Moving past NICU experience.",
      choices: {
        connect: { text: "Let them develop as normal child.", consequence: "{childName} thrives." },
        teach: { text: "Help parent release overprotection.", consequence: "They allow growth." },
        boundary: { text: "NICU is past.", consequence: "They're secure." },
        avoid: { text: "Keep them in NICU mindset.", consequence: "{childName} internalizes overprotection." },
        harm: { text: "Tell them they should expect crisis.", consequence: "{childName} internalizes hypervigilance." }
      }
    },
    15: {
      title: "School Readiness: Healthy Development",
      topic: "Developmental normalization",
      scene: "{childName} is 15 months. Approaching toddlerhood fully.",
      choices: {
        connect: { text: "Support normal growth.", consequence: "{childName} develops well." },
        teach: { text: "Help parent embrace typical challenges.", consequence: "They allow autonomy." },
        boundary: { text: "They're a healthy child now.", consequence: "They're secure." },
        avoid: { text: "Treat them as medically fragile.", consequence: "{childName} internalizes that they're breakable." },
        harm: { text: "Tell them they should be grateful forever.", consequence: "{childName} internalizes obligation." }
      }
    },
    16: {
      title: "Processing Medical Trauma: Therapy if Needed",
      topic: "Family healing",
      scene: "{childName} is 16 months. Family processing NICU experience.",
      choices: {
        connect: { text: "Support family's emotional processing.", consequence: "{childName} is secure." },
        teach: { text: "Help integrate experience as survival.", consequence: "They're grounded." },
        boundary: { text: "Healing is possible.", consequence: "They're secure." },
        avoid: { text: "Pretend NICU didn't happen.", consequence: "{childName} internalizes unprocessed trauma." },
        harm: { text: "Make NICU failure parent's shame.", consequence: "{childName} internalizes parental shame." }
      }
    },
    17: {
      title: "Understanding Their Story: Resilience Narrative",
      topic: "Strength recognition",
      scene: "{childName} is 17 months. Old enough to sense their story.",
      choices: {
        connect: { text: "Frame their NICU as strength.", consequence: "{childName} is proud." },
        teach: { text: "Help them understand they fought hard.", consequence: "They're grounded." },
        boundary: { text: "Their survival is powerful.", consequence: "They're secure." },
        avoid: { text: "Hide their medical history.", consequence: "{childName} internalizes that truth = shame." },
        harm: { text: "Tell them NICU was their fault.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Entering Toddlerhood: Full Recovery",
      topic: "Post-NICU life",
      scene: "{childName} is 18 months. Thriving toddler.",
      choices: {
        connect: { text: "Celebrate their thriving.", consequence: "{childName} is confident." },
        teach: { text: "Help parent release fear.", consequence: "They allow growth." },
        boundary: { text: "They're healthy and strong.", consequence: "They're secure." },
        avoid: { text: "Keep them in NICU mindset.", consequence: "{childName} internalizes limitations." },
        harm: { text: "Tell them they should always be grateful.", consequence: "{childName} internalizes obligatory gratitude." }
      }
    }
  },

  grief_year: {
    1: {
      title: "Loss Occurs: Someone Important Dies",
      topic: "Sudden absence",
      scene: "{childName} is born or young when family member dies.",
      choices: {
        connect: { text: "Love them fully despite grief.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're grounded." },
        boundary: { text: "Death isn't their fault.", consequence: "They're innocent." },
        avoid: { text: "Hide the death from them.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them person abandoned them.", consequence: "{childName} internalizes abandonment shame." }
      }
    },
    2: {
      title: "Funeral and Goodbyes",
      topic: "Ritualized grief",
      scene: "{childName} experiences funeral or goodbye ritual.",
      choices: {
        connect: { text: "Include them appropriately in ritual.", consequence: "{childName} feels part of goodbye." },
        teach: { text: "Help them understand ritual's meaning.", consequence: "They grasp closure." },
        boundary: { text: "Ritual is honoring.", consequence: "They're secure." },
        avoid: { text: "Shield them completely from grief.", consequence: "{childName} internalizes that grief is shameful." },
        harm: { text: "Traumatize them with graphic details.", consequence: "{childName} internalizes horror of death." }
      }
    },
    3: {
      title: "Empty Space: Person's Absence",
      topic: "Presence absence",
      scene: "{childName} is 3-4 weeks/months. Noticing person is gone.",
      choices: {
        connect: { text: "Acknowledge their loss gently.", consequence: "{childName} feels understood." },
        teach: { text: "Explain absence clearly.", consequence: "They grasp reality." },
        boundary: { text: "Sadness is okay.", consequence: "They're protected." },
        avoid: { text: "Tell them person is coming back.", consequence: "{childName} internalizes false hope." },
        harm: { text: "Tell them they caused the death.", consequence: "{childName} internalizes guilt." }
      }
    },
    4: {
      title: "School or Daycare: Explaining Loss",
      topic: "Social disclosure",
      scene: "{childName} is in school/care. Someone notices absence.",
      choices: {
        connect: { text: "Help them explain with support.", consequence: "{childName} processes it." },
        teach: { text: "Develop honest explanation.", consequence: "They navigate." },
        boundary: { text: "Loss is understandable.", consequence: "They're protected." },
        avoid: { text: "Make them hide their grief.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "First Holiday Without Them",
      topic: "Absence in tradition",
      scene: "{childName} is 5-6 months/years. First holiday cycle.",
      choices: {
        connect: { text: "Honor the absence while celebrating.", consequence: "{childName} processes both feelings." },
        teach: { text: "Create new traditions.", consequence: "They adapt." },
        boundary: { text: "Grief and joy coexist.", consequence: "They're secure." },
        avoid: { text: "Skip holidays entirely.", consequence: "{childName} internalizes that grief = stopping living." },
        harm: { text: "Tell them holidays are ruined.", consequence: "{childName} internalizes permanent loss." }
      }
    },
    6: {
      title: "Identity: Child Without This Person",
      topic: "Self-understanding",
      scene: "{childName} is 6+ months. Who are they now?",
      choices: {
        connect: { text: "Affirm their value unchanged.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that loss doesn't define them.", consequence: "They understand." },
        boundary: { text: "They're whole despite loss.", consequence: "They're secure." },
        avoid: { text: "Make loss their identity.", consequence: "{childName} internalizes being 'the grief child'." },
        harm: { text: "Tell them they're incomplete.", consequence: "{childName} internalizes inadequacy." }
      }
    },
    7: {
      title: "Grief Waves: Unexpected Crying",
      topic: "Resurging emotion",
      scene: "{childName} is 7+ months. Waves of grief hit suddenly.",
      choices: {
        connect: { text: "Hold them through grief.", consequence: "{childName} feels safe grieving." },
        teach: { text: "Normalize grief waves.", consequence: "They understand grief isn't linear." },
        boundary: { text: "Crying is healthy.", consequence: "They're protected." },
        avoid: { text: "Tell them to stop crying.", consequence: "{childName} internalizes emotional suppression." },
        harm: { text: "Tell them grief means person wasn't cared for.", consequence: "{childName} internalizes that grief = failure." }
      }
    },
    8: {
      title: "Peer Relationships: Grief Isolation",
      topic: "Social separation",
      scene: "{childName} is 8+ months. Peers don't understand.",
      choices: {
        connect: { text: "Help them find supportive friends.", consequence: "{childName} has peers." },
        teach: { text: "Discuss that grief is normal.", consequence: "They understand others grieve." },
        boundary: { text: "Peers can be kind.", consequence: "They're secure." },
        avoid: { text: "Make them feel alone in grief.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them no one will understand.", consequence: "{childName} internalizes permanent loneliness." }
      }
    },
    9: {
      title: "Memories: Recalling the Person",
      topic: "Preservation",
      scene: "{childName} is 9+ months. Sharing memories.",
      choices: {
        connect: { text: "Celebrate memories together.", consequence: "{childName} keeps person alive in heart." },
        teach: { text: "Create memory rituals.", consequence: "They honor the person." },
        boundary: { text: "Memories are precious.", consequence: "They're secure." },
        avoid: { text: "Refuse to talk about person.", consequence: "{childName} internalizes that honoring = pain." },
        harm: { text: "Tell them memories are painful and should stop.", consequence: "{childName} suppresses memory and love." }
      }
    },
    10: {
      title: "One Year Anniversary: Major Grief Wave",
      topic: "Anniversary grief",
      scene: "{childName} is 10+ months/1 year. Anniversary approaches.",
      choices: {
        connect: { text: "Plan meaningful commemoration.", consequence: "{childName} processes milestone." },
        teach: { text: "Discuss that anniversaries are hard.", consequence: "They're prepared." },
        boundary: { text: "Honoring is healing.", consequence: "They're secure." },
        avoid: { text: "Pretend anniversary doesn't matter.", consequence: "{childName} internalizes that grief has expiration." },
        harm: { text: "Tell them they should 'be over it' by now.", consequence: "{childName} internalizes shame for ongoing grief." }
      }
    },
    11: {
      title: "Processing Grief Fully: Understanding Death",
      topic: "Existential awareness",
      scene: "{childName} is 11+ months. Old enough to understand.",
      choices: {
        connect: { text: "Support their death understanding.", consequence: "{childName} processes reality." },
        teach: { text: "Help them grasp mortality.", consequence: "They're grounded." },
        boundary: { text: "Death is part of life.", consequence: "They're secure." },
        avoid: { text: "Pretend death won't happen to others.", consequence: "{childName} internalizes denial." },
        harm: { text: "Tell them they'll lose everyone.", consequence: "{childName} internalizes terror of death." }
      }
    },
    12: {
      title: "Family Changes: New Normal Without Them",
      topic: "Family restructuring",
      scene: "{childName} is 12+ months. Family adjusting to absence.",
      choices: {
        connect: { text: "Help family adjust together.", consequence: "{childName} adapts with support." },
        teach: { text: "Create new family structures.", consequence: "They find new patterns." },
        boundary: { text: "New normal is possible.", consequence: "They're secure." },
        avoid: { text: "Deny that family changed.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them family is broken.", consequence: "{childName} internalizes that loss = permanent breakage." }
      }
    },
    13: {
      title: "Living With Grief: Ongoing Loss",
      topic: "Permanent absence",
      scene: "{childName} is 13+ months. Grief becomes ongoing presence.",
      choices: {
        connect: { text: "Support their lifelong grief.", consequence: "{childName} grieves healthily." },
        teach: { text: "Discuss that grief doesn't end.", consequence: "They're grounded." },
        boundary: { text: "Grief and happiness coexist.", consequence: "They're secure." },
        avoid: { text: "Tell them grief should fade.", consequence: "{childName} internalizes that love = grief that must end." },
        harm: { text: "Tell them they should 'move on.'", consequence: "{childName} internalizes that honoring = weakness." }
      }
    },
    14: {
      title: "Growth Despite Grief: Finding Joy Again",
      topic: "Healing integration",
      scene: "{childName} is 14+ months. Laughing again.",
      choices: {
        connect: { text: "Celebrate that joy returns.", consequence: "{childName} feels free to be happy." },
        teach: { text: "Discuss that joy honors the person.", consequence: "They understand." },
        boundary: { text: "Happiness is allowed.", consequence: "They're secure." },
        avoid: { text: "Make them feel guilty for joy.", consequence: "{childName} suppresses happiness." },
        harm: { text: "Tell them that being happy betrays person.", consequence: "{childName} internalizes obligation to suffer." }
      }
    },
    15: {
      title: "New Relationships: Can They Love Again?",
      topic: "Opening heart",
      scene: "{childName} is 15+ months. Forming new attachments.",
      choices: {
        connect: { text: "Support new bonds.", consequence: "{childName} loves again." },
        teach: { text: "Discuss that love expands.", consequence: "They understand." },
        boundary: { text: "New love honors old love.", consequence: "They're secure." },
        avoid: { text: "Tell them they're betraying person.", consequence: "{childName} suppresses new bonds." },
        harm: { text: "Tell them everyone will die.", consequence: "{childName} internalizes fear of attachment." }
      }
    },
    16: {
      title: "Understanding the Person: Complexity",
      topic: "Nuanced memory",
      scene: "{childName} is 16+ months. Old enough to remember complexity.",
      choices: {
        connect: { text: "Share honest memories.", consequence: "{childName} understands their full humanity." },
        teach: { text: "Discuss good and challenging things.", consequence: "They integrate memory." },
        boundary: { text: "People are complex.", consequence: "They're secure." },
        avoid: { text: "Idealize person beyond reality.", consequence: "{childName} internalizes that grief = sainthood." },
        harm: { text: "Tell them person was all bad.", consequence: "{childName} internalizes complicated shame." }
      }
    },
    17: {
      title: "Year of Grief: Reflecting on Journey",
      topic: "Grief integration",
      scene: "{childName} is 17+ months. Year has passed.",
      choices: {
        connect: { text: "Celebrate their survival of grief year.", consequence: "{childName} is proud." },
        teach: { text: "Help them recognize their strength.", consequence: "They're grounded." },
        boundary: { text: "They've survived loss.", consequence: "They're secure." },
        avoid: { text: "Tell them grief should be over.", consequence: "{childName} internalizes that grief has deadline." },
        harm: { text: "Tell them they failed in grieving.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Moving Forward: Life After Loss",
      topic: "New chapter",
      scene: "{childName} is 18+ months. Beginning to live forward.",
      choices: {
        connect: { text: "Support their moving forward.", consequence: "{childName} feels free to live." },
        teach: { text: "Share wisdom about living with loss.", consequence: "They build wisely." },
        boundary: { text: "Living honors the dead.", consequence: "They're secure." },
        avoid: { text: "Keep them grieving indefinitely.", consequence: "{childName} internalizes that moving on = betrayal." },
        harm: { text: "Tell them grief will always consume them.", consequence: "{childName} internalizes that loss = permanent devastation." }
      }
    }
  },

  foster_kinship_guardian: {
    1: {
      title: "Placed With Kinship Guardian",
      topic: "Family separation",
      scene: "{childName} is born or young when placed with kinship guardian.",
      choices: {
        connect: { text: "Love them fully despite circumstances.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe with guardian.", consequence: "They're grounded." },
        boundary: { text: "Guardian's home is safe.", consequence: "They're innocent." },
        avoid: { text: "Make them feel abandoned.", consequence: "{childName} internalizes abandonment." },
        harm: { text: "Tell them they caused separation.", consequence: "{childName} internalizes guilt." }
      }
    },
    2: {
      title: "Adjusting to New Home: New Rules",
      topic: "Environmental transition",
      scene: "{childName} is 2-3. Learning guardian's home.",
      choices: {
        connect: { text: "Create predictable routines.", consequence: "{childName} feels secure." },
        teach: { text: "Help them learn new home structure.", consequence: "They adapt." },
        boundary: { text: "Home is stable.", consequence: "They're secure." },
        avoid: { text: "Keep changing rules.", consequence: "{childName} internalizes unpredictability." },
        harm: { text: "Tell them they don't belong.", consequence: "{childName} internalizes that they're temporary." }
      }
    },
    3: {
      title: "Original Family Contact: Visits or Letters",
      topic: "Dual attachment",
      scene: "{childName} is 3-4. Contact with original family.",
      choices: {
        connect: { text: "Support loving relationships with both.", consequence: "{childName} bonds with both." },
        teach: { text: "Help them understand two families.", consequence: "They're grounded." },
        boundary: { text: "Both families can be loved.", consequence: "They're secure." },
        avoid: { text: "Make them choose families.", consequence: "{childName} internalizes that love = conflict." },
        harm: { text: "Tell them original family abandoned them.", consequence: "{childName} internalizes rejection." }
      }
    },
    4: {
      title: "School: Explaining Family Structure",
      topic: "Social disclosure",
      scene: "{childName} is in school. Teachers ask about family.",
      choices: {
        connect: { text: "Help them explain with pride.", consequence: "{childName} is confident." },
        teach: { text: "Develop honest explanation.", consequence: "They navigate." },
        boundary: { text: "Their family is valid.", consequence: "They're protected." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will judge them.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Bonding With Guardian: Growing Love",
      topic: "Attachment development",
      scene: "{childName} is 5-6. Deepening relationship with guardian.",
      choices: {
        connect: { text: "Encourage genuine bonding.", consequence: "{childName} loves guardian." },
        teach: { text: "Help them feel secure in relationship.", consequence: "They trust." },
        boundary: { text: "Love can grow.", consequence: "They're secure." },
        avoid: { text: "Tell them bonding is betrayal.", consequence: "{childName} suppresses love." },
        harm: { text: "Make them fear guardian leaving.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    6: {
      title: "Identity: Foster/Kinship Child",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value as wanted.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that placement doesn't define them.", consequence: "They understand." },
        boundary: { text: "They're more than their origin.", consequence: "They're secure." },
        avoid: { text: "Make foster status their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're 'lucky' to be placed.", consequence: "{childName} internalizes gratitude for basic care." }
      }
    },
    7: {
      title: "Original Family Changes: Reunification Possibility",
      topic: "Family system complexity",
      scene: "{childName} is 7. Possibility of family reunification.",
      choices: {
        connect: { text: "Support their feelings about possibility.", consequence: "{childName} processes emotion." },
        teach: { text: "Help them understand it's complicated.", consequence: "They're grounded." },
        boundary: { text: "Either outcome is valid.", consequence: "They're secure." },
        avoid: { text: "Promise reunion won't happen.", consequence: "{childName} internalizes uncertainty." },
        harm: { text: "Tell them reunion will tear them apart.", consequence: "{childName} internalizes fear." }
      }
    },
    8: {
      title: "Peer Relationships: Feeling Different",
      topic: "Social separation",
      scene: "{childName} is 8. Peers have different family structures.",
      choices: {
        connect: { text: "Help them feel normal despite difference.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that family comes in many forms.", consequence: "They're grounded." },
        boundary: { text: "Their family is valid.", consequence: "They're secure." },
        avoid: { text: "Make them feel abnormal.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're broken family.", consequence: "{childName} internalizes that their family = damaged." }
      }
    },
    9: {
      title: "Guardian Struggles: Financial or Health Issues",
      topic: "System vulnerability",
      scene: "{childName} is 9. Guardian facing challenges.",
      choices: {
        connect: { text: "Reassure them guardian isn't leaving.", consequence: "{childName} feels safe." },
        teach: { text: "Help age-appropriate understanding.", consequence: "They're grounded." },
        boundary: { text: "Guardian's struggles aren't their fault.", consequence: "They're protected." },
        avoid: { text: "Make them feel responsible.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them they're burden.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    10: {
      title: "Understanding Origin: Why Placement Happened",
      topic: "Story understanding",
      scene: "{childName} is 10. Ready to understand history.",
      choices: {
        connect: { text: "Share their story honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss circumstances not judgments.", consequence: "They're grounded." },
        boundary: { text: "Understanding helps healing.", consequence: "They're secure." },
        avoid: { text: "Hide their story.", consequence: "{childName} internalizes that truth = shame." },
        harm: { text: "Tell them they were unwanted.", consequence: "{childName} internalizes that they're unlovable." }
      }
    },
    11: {
      title: "Adolescence: Identity Questions Deepen",
      topic: "Complex belonging",
      scene: "{childName} is 11. Wondering about belonging.",
      choices: {
        connect: { text: "Support their identity questions.", consequence: "{childName} explores freely." },
        teach: { text: "Help them integrate both heritages.", consequence: "They develop identity." },
        boundary: { text: "They can belong everywhere.", consequence: "They're secure." },
        avoid: { text: "Tell them they don't belong anywhere.", consequence: "{childName} internalizes homelessness." },
        harm: { text: "Tell them they're caught between.", consequence: "{childName} internalizes fragmentation." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Family",
      topic: "Romantic disclosure",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about sharing story.", consequence: "They navigate." },
        boundary: { text: "Their story is theirs to share.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will accept them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they should hide their history.", consequence: "{childName} internalizes that honesty = danger." }
      }
    },
    13: {
      title: "Permanency Decisions: Will Guardian Adopt?",
      topic: "Legal security",
      scene: "{childName} is 13. Discussing permanency.",
      choices: {
        connect: { text: "Support whatever decision is made.", consequence: "{childName} feels secure either way." },
        teach: { text: "Help them understand legal implications.", consequence: "They're informed." },
        boundary: { text: "Legal permanency or not, love is real.", consequence: "They're secure." },
        avoid: { text: "Make them feel unsecure.", consequence: "{childName} internalizes fear of rejection." },
        harm: { text: "Tell them adoption means forgetting origin.", consequence: "{childName} internalizes that honoring = conflict." }
      }
    },
    14: {
      title: "Exploring Roots: Original Family Search",
      topic: "Connection seeking",
      scene: "{childName} is 14. Wanting to know more.",
      choices: {
        connect: { text: "Support their search.", consequence: "{childName} seeks truth." },
        teach: { text: "Help them navigate search wisely.", consequence: "They're empowered." },
        boundary: { text: "They can know their story.", consequence: "They're empowered." },
        avoid: { text: "Tell them search will disappoint.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them search betrays guardian.", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "College Planning: Independence and Belonging",
      topic: "Future path",
      scene: "{childName} is 15. Planning future.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them plan for independence.", consequence: "They're strategic." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them they should stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them leaving is abandonment.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Full Story",
      topic: "Love and honesty",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them communicate their story.", consequence: "They're honest." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make them hide their history.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them partner will judge them.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    17: {
      title: "Understanding Guardian's Journey: Their Sacrifice",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share guardian's perspective.", consequence: "{childName} understands." },
        teach: { text: "Discuss sacrifice and love.", consequence: "They're grateful." },
        boundary: { text: "Guardian's love is real.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them they're burden.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Choice: Defining Their Belonging",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about belonging.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay loyal.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they belong nowhere.", consequence: "{childName} internalizes permanent displacement." }
      }
    }
  },

  survival_quarantine_protocol: {
    1: {
      title: "Lockdown Begins: Isolation Protocol",
      topic: "Sudden confinement",
      scene: "{childName} is young when quarantine/lockdown begins.",
      choices: {
        connect: { text: "Love them fully amid confinement.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand protocol.", consequence: "They're grounded." },
        boundary: { text: "Isolation is temporary.", consequence: "They're innocent." },
        avoid: { text: "Make them terrified of outside.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them everyone is sick.", consequence: "{childName} internalizes terror." }
      }
    },
    2: {
      title: "Home Becomes Entire World",
      topic: "Complete containment",
      scene: "{childName} is 2-3 months in. Home is everything.",
      choices: {
        connect: { text: "Create enrichment at home.", consequence: "{childName} finds meaning." },
        teach: { text: "Help them understand limited world.", consequence: "They're grounded." },
        boundary: { text: "Home is safe.", consequence: "They're secure." },
        avoid: { text: "Let boredom overwhelm them.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them they'll never leave.", consequence: "{childName} internalizes permanent confinement." }
      }
    },
    3: {
      title: "Separation From Extended Family",
      topic: "Relationship isolation",
      scene: "{childName} is 3+ months. Can't see relatives.",
      choices: {
        connect: { text: "Create remote connection.", consequence: "{childName} stays bonded." },
        teach: { text: "Help video calls feel real.", consequence: "They maintain attachment." },
        boundary: { text: "Love transcends distance.", consequence: "They're secure." },
        avoid: { text: "Let them feel completely cut off.", consequence: "{childName} internalizes abandonment." },
        harm: { text: "Tell them they'll never see family again.", consequence: "{childName} internalizes permanent loss." }
      }
    },
    4: {
      title: "School or Daycare Closure: Education at Home",
      topic: "Education disruption",
      scene: "{childName} is in school/care. Suddenly remote or closed.",
      choices: {
        connect: { text: "Support learning at home.", consequence: "{childName} continues learning." },
        teach: { text: "Make home learning feel productive.", consequence: "They're engaged." },
        boundary: { text: "Education continues.", consequence: "They're secure." },
        avoid: { text: "Let education collapse.", consequence: "{childName} falls behind." },
        harm: { text: "Tell them learning doesn't matter.", consequence: "{childName} suppresses effort." }
      }
    },
    5: {
      title: "Mask and Distance: Physical Boundaries",
      topic: "Embodied fear",
      scene: "{childName} is 5+ months. Learning mask wearing and distance.",
      choices: {
        connect: { text: "Normalize safety precautions.", consequence: "{childName} feels protected." },
        teach: { text: "Explain why precautions are needed.", consequence: "They understand." },
        boundary: { text: "Safety is love.", consequence: "They're secure." },
        avoid: { text: "Make masks traumatic.", consequence: "{childName} internalizes claustrophobia." },
        harm: { text: "Tell them they're dangerous to others.", consequence: "{childName} internalizes guilt." }
      }
    },
    6: {
      title: "Identity: Quarantine Child",
      topic: "Self-understanding",
      scene: "{childName} is 6+ months. Who are they in confinement?",
      choices: {
        connect: { text: "Affirm they're still growing.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that confinement is temporary.", consequence: "They believe in future." },
        boundary: { text: "They're more than isolation.", consequence: "They're secure." },
        avoid: { text: "Make confinement their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're defined by crisis.", consequence: "{childName} internalizes that crisis = self." }
      }
    },
    7: {
      title: "Mental Health Impact: Stress and Anxiety",
      topic: "Psychological toll",
      scene: "{childName} is 7+ months. Showing anxiety symptoms.",
      choices: {
        connect: { text: "Support their mental health.", consequence: "{childName} feels cared for." },
        teach: { text: "Help them name their feelings.", consequence: "They process emotion." },
        boundary: { text: "Anxiety is understandable.", consequence: "They're protected." },
        avoid: { text: "Dismiss their anxiety.", consequence: "{childName} internalizes that feelings don't matter." },
        harm: { text: "Tell them they're weak for struggling.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Peer Relationships: Limited to Screens",
      topic: "Mediated connection",
      scene: "{childName} is 8+ months. Friends only through screens.",
      choices: {
        connect: { text: "Support online friendships.", consequence: "{childName} has connection." },
        teach: { text: "Help them maintain real friendships.", consequence: "They bond online." },
        boundary: { text: "Online connection is real connection.", consequence: "They're secure." },
        avoid: { text: "Tell them online isn't real.", consequence: "{childName} internalizes that friendships are invalid." },
        harm: { text: "Tell them they'll have no friends.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Hopes Rise: Restrictions Loosen",
      topic: "Emerging hope",
      scene: "{childName} is 9+ months. Some restrictions ease.",
      choices: {
        connect: { text: "Share their excitement carefully.", consequence: "{childName} feels hope." },
        teach: { text: "Manage expectations realistically.", consequence: "They're grounded." },
        boundary: { text: "Change is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them nothing will change.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them to not hope.", consequence: "{childName} suppresses hope." }
      }
    },
    10: {
      title: "Reintegration: Venturing Outside Again",
      topic: "Re-entry anxiety",
      scene: "{childName} is 10+ months. Going outside again.",
      choices: {
        connect: { text: "Support their re-entry gently.", consequence: "{childName} adapts." },
        teach: { text: "Help them feel safe outside.", consequence: "They explore." },
        boundary: { text: "Outside is still safe.", consequence: "They're secure." },
        avoid: { text: "Make them terrified of outside.", consequence: "{childName} internalizes agoraphobia." },
        harm: { text: "Tell them outside is dangerous.", consequence: "{childName} internalizes hypervigilance." }
      }
    },
    11: {
      title: "School Reopening: Reintegrating Socially",
      topic: "Social recalibration",
      scene: "{childName} is 11+ months. Returning to school.",
      choices: {
        connect: { text: "Support their social reentry.", consequence: "{childName} reconnects." },
        teach: { text: "Help them readjust to crowds.", consequence: "They're grounded." },
        boundary: { text: "Social connection is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them they don't belong anymore.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them they'll be judged for absence.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Processing the Isolation: Therapy if Needed",
      topic: "Psychological integration",
      scene: "{childName} is 12+ months. Reflecting on experience.",
      choices: {
        connect: { text: "Support their processing.", consequence: "{childName} processes experience." },
        teach: { text: "Help them integrate trauma.", consequence: "They're grounded." },
        boundary: { text: "Processing is healing.", consequence: "They're secure." },
        avoid: { text: "Tell them to forget it.", consequence: "{childName} internalizes unprocessed trauma." },
        harm: { text: "Tell them they should be grateful.", consequence: "{childName} internalizes obligatory gratitude." }
      }
    },
    13: {
      title: "Long-Term Restrictions End: Return to Normal",
      topic: "Crisis resolution",
      scene: "{childName} is 13+ months. Full reopening beginning.",
      choices: {
        connect: { text: "Celebrate return to normalcy.", consequence: "{childName} is hopeful." },
        teach: { text: "Help them adjust to new normal.", consequence: "They're grounded." },
        boundary: { text: "Normal is possible.", consequence: "They're secure." },
        avoid: { text: "Keep them in crisis mode.", consequence: "{childName} internalizes prolonged trauma." },
        harm: { text: "Tell them crisis will happen again.", consequence: "{childName} internalizes hypervigilance." }
      }
    },
    14: {
      title: "Grief and Relief: Complex Emotions",
      topic: "Emotional integration",
      scene: "{childName} is 14+ months. End of protocol.",
      choices: {
        connect: { text: "Validate mixed emotions.", consequence: "{childName} processes both feelings." },
        teach: { text: "Discuss that grief and relief coexist.", consequence: "They understand complexity." },
        boundary: { text: "All feelings are valid.", consequence: "They're secure." },
        avoid: { text: "Tell them to only feel relief.", consequence: "{childName} suppresses grief." },
        harm: { text: "Tell them grief means weakness.", consequence: "{childName} internalizes shame about feelings." }
      }
    },
    15: {
      title: "Looking Ahead: New Possibilities",
      topic: "Future vision",
      scene: "{childName} is 15+ months. Planning forward.",
      choices: {
        connect: { text: "Support their new dreams.", consequence: "{childName} is hopeful." },
        teach: { text: "Help them set goals.", consequence: "They're strategic." },
        boundary: { text: "Future is open.", consequence: "They're secure." },
        avoid: { text: "Tell them future is limited.", consequence: "{childName} suppresses ambition." },
        harm: { text: "Tell them crisis defines their future.", consequence: "{childName} internalizes that trauma = destiny." }
      }
    },
    16: {
      title: "Understanding Pandemic: Learning Context",
      topic: "Historical awareness",
      scene: "{childName} is 16+ months. Old enough to understand.",
      choices: {
        connect: { text: "Share context and history.", consequence: "{childName} understands." },
        teach: { text: "Discuss global impact.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding helps meaning-making.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them they should have known better.", consequence: "{childName} internalizes impossible responsibility." }
      }
    },
    17: {
      title: "Recognizing Resilience: What They Survived",
      topic: "Strength acknowledgment",
      scene: "{childName} is 17+ months. Reflecting on their strength.",
      choices: {
        connect: { text: "Celebrate their survival.", consequence: "{childName} is proud." },
        teach: { text: "Help them recognize their resilience.", consequence: "They're confident." },
        boundary: { text: "They've survived much.", consequence: "They're secure." },
        avoid: { text: "Minimize what they endured.", consequence: "{childName} internalizes that suffering doesn't matter." },
        harm: { text: "Tell them they should feel broken.", consequence: "{childName} internalizes shame." }
      }
    },
    18: {
      title: "Moving Forward: Life After Lockdown",
      topic: "New normal integration",
      scene: "{childName} is 18+ months. Life continues.",
      choices: {
        connect: { text: "Support their building forward.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about resilience.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them crisis will happen again.", consequence: "{childName} might live in fear." },
        harm: { text: "Tell them they're permanently changed.", consequence: "{childName} internalizes that crisis = permanent damage." }
      }
    }
  }
};