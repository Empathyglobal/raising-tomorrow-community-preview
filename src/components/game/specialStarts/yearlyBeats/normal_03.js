
export const SPECIAL_START_YEARLY_BEATS__NORMAL_03 = {
  child_deaf_hoh: {
    1: {
      title: "Born Deaf or Hard of Hearing",
      topic: "Communication beginning",
      scene: "{childName} is born deaf or hard of hearing. Communication journey begins.",
      choices: {
        connect: { text: "Love them fully and celebrate their identity.", consequence: "{childName} feels valued." },
        teach: { text: "Learn sign language and their communication methods.", consequence: "Connection is real." },
        boundary: { text: "Their deafness is not something to fix.", consequence: "Identity is affirmed." },
        avoid: { text: "Treat deafness as tragedy.", consequence: "{childName} internalizes shame." },
        harm: { text: "Force hearing aids or implants against their will.", consequence: "{childName} feels violated." }
      }
    },
    2: {
      title: "Language Development: Sign, Speech, or Both",
      topic: "Communication foundation",
      scene: "{childName} is developing language. Which modality is primary?",
      choices: {
        connect: { text: "Support whatever communication method works best.", consequence: "{childName} communicates freely." },
        teach: { text: "Expose them to sign language and spoken language.", consequence: "Options are available." },
        boundary: { text: "Communication is their choice.", consequence: "Agency is respected." },
        avoid: { text: "Force only one communication method.", consequence: "{childName} struggles." },
        harm: { text: "Shame them for their communication style.", consequence: "{childName} internalizes shame." }
      }
    },
    3: {
      title: "Hearing Aid or Implant: What's Right for Them?",
      topic: "Technology decisions",
      scene: "{childName} is 3. Hearing aids, cochlear implants, or no technology?",
      choices: {
        connect: { text: "Let them explore options as they grow.", consequence: "{childName} decides authentically." },
        teach: { text: "Discuss pros and cons of each option.", consequence: "Informed choice develops." },
        boundary: { text: "Their body, their choice.", consequence: "Autonomy is respected." },
        avoid: { text: "Force technology on them.", consequence: "{childName} resents it." },
        harm: { text: "Make them feel broken without devices.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "Deaf Community: Do You Connect?",
      topic: "Identity and belonging",
      scene: "{childName} has access to Deaf community or is mostly with hearing people.",
      choices: {
        connect: { text: "Connect them with Deaf community and culture.", consequence: "{childName} has identity anchor." },
        teach: { text: "Share Deaf history and culture.", consequence: "Pride develops." },
        boundary: { text: "Deaf identity is valid and beautiful.", consequence: "They're affirmed." },
        avoid: { text: "Isolate them from Deaf people.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them Deaf culture is less than.", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "School: Deaf School, Mainstream, or Both?",
      topic: "Educational placement",
      scene: "{childName} is 5. Where should they learn?",
      choices: {
        connect: { text: "Choose school based on their needs and preferences.", consequence: "{childName} thrives academically." },
        teach: { text: "Discuss pros and cons of each setting.", consequence: "Informed choice develops." },
        boundary: { text: "Their education is their choice.", consequence: "Autonomy is respected." },
        avoid: { text: "Force mainstream without support.", consequence: "{childName} struggles." },
        harm: { text: "Isolate them in restrictive setting.", consequence: "{childName} internalizes rejection." }
      }
    },
    6: {
      title: "Interpreters & Access: School Communication",
      topic: "Academic access",
      scene: "{childName} is 6. Do they have interpreters and full access?",
      choices: {
        connect: { text: "Ensure they have quality interpreters.", consequence: "{childName} understands everything." },
        teach: { text: "Advocate for their communication needs.", consequence: "Access is real." },
        boundary: { text: "Access is their right.", consequence: "Education is equitable." },
        avoid: { text: "Let school deny access.", consequence: "{childName} falls behind." },
        harm: { text: "Blame {childName} for struggles without support.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "Peer Communication: Making Friends at School",
      topic: "Social inclusion",
      scene: "{childName} is 7. Making friends with hearing peers.",
      choices: {
        connect: { text: "Help them navigate peer communication.", consequence: "{childName} makes genuine friends." },
        teach: { text: "Discuss how to be a good friend.", consequence: "Social skills develop." },
        boundary: { text: "Real friends learn their communication.", consequence: "True connection is possible." },
        avoid: { text: "Tell them to just 'try harder' to fit in.", consequence: "{childName} feels unaccepted." },
        harm: { text: "Allow bullying about deafness.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Identifying as Deaf: Pride or Shame?",
      topic: "Identity crystallizing",
      scene: "{childName} is 8. How do they feel about being Deaf?",
      choices: {
        connect: { text: "Affirm Deaf identity as beautiful and valid.", consequence: "{childName} develops pride." },
        teach: { text: "Discuss Deaf culture and history.", consequence: "Cultural pride grows." },
        boundary: { text: "Deafness is not a deficit.", consequence: "Self-love develops." },
        avoid: { text: "Treat deafness as something to overcome.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'you'd be better if you weren't deaf.'", consequence: "{childName} self-hates." }
      }
    },
    9: {
      title: "Deaf Adults as Role Models",
      topic: "Future vision",
      scene: "{childName} is 9. Do they see Deaf adults thriving?",
      choices: {
        connect: { text: "Connect them with successful Deaf adults.", consequence: "{childName} sees their future." },
        teach: { text: "Share stories of Deaf achievement.", consequence: "Possibilities expand." },
        boundary: { text: "Deaf adults live full, meaningful lives.", consequence: "Hope is real." },
        avoid: { text: "Only show them 'overcoming' narratives.", consequence: "{childName} sees deafness as problem." },
        harm: { text: "Say 'deaf people can't do X.'", consequence: "{childName} limits themselves." }
      }
    },
    10: {
      title: "Sign Language Fluency: How Strong?",
      topic: "Communication mastery",
      scene: "{childName} is 10. Sign language fluency varies based on environment.",
      choices: {
        connect: { text: "Support sign language development actively.", consequence: "{childName} communicates fluently." },
        teach: { text: "Celebrate linguistic abilities.", consequence: "Pride in language develops." },
        boundary: { text: "Multiple languages are strength.", consequence: "They're bilingual/bicultural." },
        avoid: { text: "Downgrade sign language.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'sign language is limiting.'", consequence: "{childName} rejects identity." }
      }
    },
    11: {
      title: "Technology Evolution: New Hearing Devices",
      topic: "Autonomy in choices",
      scene: "{childName} is 11. New technologies available. Their choice?",
      choices: {
        connect: { text: "Let them decide about new tech.", consequence: "{childName} owns their choices." },
        teach: { text: "Discuss implications of new devices.", consequence: "Informed choice happens." },
        boundary: { text: "Their body, their technology decisions.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push new technology.", consequence: "{childName} might resent it." },
        harm: { text: "Force technology to 'normalize' them.", consequence: "{childName} internalizes being broken." }
      }
    },
    12: {
      title: "School Accessibility: Is It Real?",
      topic: "Systemic support",
      scene: "{childName} is 12. Are they truly included at school?",
      choices: {
        connect: { text: "Advocate fiercely for real accessibility.", consequence: "{childName} gets what they need." },
        teach: { text: "Help them advocate for themselves.", consequence: "Self-advocacy develops." },
        boundary: { text: "Full access is their right.", consequence: "Equity is real." },
        avoid: { text: "Accept inadequate accommodations.", consequence: "{childName} falls behind." },
        harm: { text: "Blame {childName} for school failure.", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Dating & Communication: Explaining Deafness",
      topic: "Romantic inclusion",
      scene: "{childName} is 13. Dating means explaining deafness.",
      choices: {
        connect: { text: "Help them communicate about deafness.", consequence: "{childName} dates authentically." },
        teach: { text: "Discuss what real acceptance looks like.", consequence: "Standards are high." },
        boundary: { text: "Partners who care will learn.", consequence: "True connection is possible." },
        avoid: { text: "Tell them to hide deafness.", consequence: "{childName}'s relationships stay shallow." },
        harm: { text: "Say 'no one will want to date you.'", consequence: "{childName} internalizes undesirability." }
      }
    },
    14: {
      title: "Workplace Accessibility: Future Questions",
      topic: "Career planning",
      scene: "{childName} is 14. Considering future work and accommodations.",
      choices: {
        connect: { text: "Discuss accommodations as normal in work.", consequence: "{childName} plans confidently." },
        teach: { text: "Share stories of Deaf professionals.", consequence: "Career paths seem real." },
        boundary: { text: "Disability accommodations are legal right.", consequence: "Confidence grows." },
        avoid: { text: "Tell them career options are limited.", consequence: "{childName} limits themselves." },
        harm: { text: "Say 'you'll never find employment.'", consequence: "{childName} loses hope." }
      }
    },
    15: {
      title: "Cochlear Implant Debates: Their Body, Their Choice",
      topic: "Autonomy in medical decisions",
      scene: "{childName} is 15. Implants a possibility. Is this their choice?",
      choices: {
        connect: { text: "Support whatever choice they make.", consequence: "{childName} owns their body." },
        teach: { text: "Present all options without pressure.", consequence: "Informed decision happens." },
        boundary: { text: "No coercion about their body.", consequence: "Autonomy is sacred." },
        avoid: { text: "Pressure them toward implant.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you must implant to be normal.'", consequence: "{childName} internalizes being broken." }
      }
    },
    16: {
      title: "College Accessibility: Planning Access",
      topic: "Academic future",
      scene: "{childName} is 16. College access is possible with right support.",
      choices: {
        connect: { text: "Help them research accessible colleges.", consequence: "{childName} plans college." },
        teach: { text: "Discuss their accommodation needs.", consequence: "Planning is realistic." },
        boundary: { text: "Full access is non-negotiable.", consequence: "They choose schools accordingly." },
        avoid: { text: "Suggest limited college options.", consequence: "{childName} limits dreams." },
        harm: { text: "Say 'college isn't for Deaf people.'", consequence: "{childName} gives up." }
      }
    },
    17: {
      title: "Adult Identity: Deaf Pride",
      topic: "Self-determination",
      scene: "{childName} is 17. Building adult identity as Deaf person.",
      choices: {
        connect: { text: "Celebrate their Deaf identity fully.", consequence: "{childName} feels proud." },
        teach: { text: "Share path to Deaf adulthood.", consequence: "They see their future." },
        boundary: { text: "Deaf identity is beautiful.", consequence: "Self-love is deep." },
        avoid: { text: "Push them toward hearing world.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'being Deaf is tragic.'", consequence: "{childName} hates themselves." }
      }
    },
    18: {
      title: "Adult Deaf Life: Career, Community, Love",
      topic: "Life building",
      scene: "{childName} is 18. Building Deaf adult life.",
      choices: {
        connect: { text: "Support their Deaf adult journey fully.", consequence: "{childName} thrives." },
        teach: { text: "Share wisdom about Deaf living.", consequence: "They build wisely." },
        boundary: { text: "Deaf life is full and beautiful.", consequence: "They live authentically." },
        avoid: { text: "Push them toward hearing world.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you'd be better hearing.'", consequence: "{childName} self-hates." }
      }
    }
  },

  child_mobility_aid: {
    1: {
      title: "Born With or Developing Mobility Difference",
      topic: "Difference emerging",
      scene: "{childName} is born with or develops a condition requiring mobility aids.",
      choices: {
        connect: { text: "Love them fully as they are.", consequence: "{childName} feels valued." },
        teach: { text: "Learn about their mobility needs.", consequence: "Understanding grows." },
        boundary: { text: "Mobility aid is tool, not tragedy.", consequence: "Perspective is healthy." },
        avoid: { text: "Grieve over their mobility.", consequence: "{childName} internalizes sorrow." },
        harm: { text: "Say 'I wish you were normal.'", consequence: "{childName} internalizes shame." }
      }
    },
    2: {
      title: "Accessing the Physical World: Ramps, Stairs, Spaces",
      topic: "Environmental barriers",
      scene: "{childName} is 2-3. Learning that world isn't built for them.",
      choices: {
        connect: { text: "Fight for their access consistently.", consequence: "{childName} sees advocacy." },
        teach: { text: "Help them problem-solve access issues.", consequence: "Problem-solving develops." },
        boundary: { text: "Access is their right.", consequence: "Confidence grows." },
        avoid: { text: "Let barriers stop them.", consequence: "{childName} internalizes helplessness." },
        harm: { text: "Blame them for barriers.", consequence: "{childName} internalizes shame." }
      }
    },
    3: {
      title: "Independence & Dependence: Finding Balance",
      topic: "Autonomy development",
      scene: "{childName} is 3. Can they do things themselves with aids?",
      choices: {
        connect: { text: "Support independence within their ability.", consequence: "{childName} is confident." },
        teach: { text: "Celebrate what they can do.", consequence: "Pride in ability develops." },
        boundary: { text: "They're not helpless; they're creative.", consequence: "Resilience builds." },
        avoid: { text: "Do everything for them.", consequence: "{childName} doesn't develop independence." },
        harm: { text: "Mock them for needing help.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "Play & Adaptations: Can They Play Like Peers?",
      topic: "Inclusive play",
      scene: "{childName} is 4. Playground and play adapted for them?",
      choices: {
        connect: { text: "Find or create accessible play.", consequence: "{childName} plays freely." },
        teach: { text: "Help them discover what they CAN do.", consequence: "Joy in movement develops." },
        boundary: { text: "Play is their right.", consequence: "Childhood is normal." },
        avoid: { text: "Keep them from play.", consequence: "{childName} is isolated." },
        harm: { text: "Allow peers to exclude them.", consequence: "{childName} internalizes rejection." }
      }
    },
    5: {
      title: "School Accessibility: Ramps, Accessible Bathrooms, Inclusion",
      topic: "Educational access",
      scene: "{childName} is 5. School accessible?",
      choices: {
        connect: { text: "Ensure school is fully accessible.", consequence: "{childName} learns successfully." },
        teach: { text: "Advocate for their accessibility needs.", consequence: "Advocacy skills develop." },
        boundary: { text: "Accessibility is non-negotiable.", consequence: "They're included." },
        avoid: { text: "Accept inaccessible school.", consequence: "{childName} struggles." },
        harm: { text: "Blame {childName} for school barriers.", consequence: "{childName} internalizes shame." }
      }
    },
    6: {
      title: "Peer Recognition: Being 'Different'",
      topic: "Social integration",
      scene: "{childName} is 6. Peers notice mobility aid.",
      choices: {
        connect: { text: "Help them talk about their mobility openly.", consequence: "{childName} is confident." },
        teach: { text: "Normalize difference to peers.", consequence: "Acceptance grows." },
        boundary: { text: "Difference doesn't define worth.", consequence: "They're secure." },
        avoid: { text: "Tell them to hide mobility aid.", consequence: "{childName} internalizes shame." },
        harm: { text: "Allow bullying about mobility.", consequence: "{childName} internalizes rejection." }
      }
    },
    7: {
      title: "Pain, Fatigue, or Limitations: Understanding Their Body",
      topic: "Body awareness",
      scene: "{childName} is 7. Managing pain, fatigue, or physical limits.",
      choices: {
        connect: { text: "Listen to their body signals.", consequence: "{childName} respects their body." },
        teach: { text: "Help them understand their limits.", consequence: "Self-awareness develops." },
        boundary: { text: "Pacing is wise, not weakness.", consequence: "Health is prioritized." },
        avoid: { text: "Push them past safe limits.", consequence: "{childName} gets injured." },
        harm: { text: "Mock them for resting.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Sports & Recreation: Adapted or Different Activities",
      topic: "Active life",
      scene: "{childName} is 8. What physical activities are possible?",
      choices: {
        connect: { text: "Find activities that fit their body.", consequence: "{childName} stays active." },
        teach: { text: "Celebrate adaptive sports.", consequence: "Pride in capability develops." },
        boundary: { text: "Physical activity is possible.", consequence: "They're not sedentary." },
        avoid: { text: "Tell them they can't do sports.", consequence: "{childName} limits themselves." },
        harm: { text: "Force them into inaccessible sports.", consequence: "{childName} gets injured." }
      }
    },
    9: {
      title: "Identifying as Disabled: What Does That Mean?",
      topic: "Identity forming",
      scene: "{childName} is 9. Understanding disability identity.",
      choices: {
        connect: { text: "Help them see disability as identity.", consequence: "{childName} develops pride." },
        teach: { text: "Share disability history and culture.", consequence: "Pride grows." },
        boundary: { text: "Disability is part of them.", consequence: "Self-acceptance develops." },
        avoid: { text: "Tell them disability is tragedy.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'don't think of yourself as disabled.'", consequence: "{childName} internalizes denial." }
      }
    },
    10: {
      title: "Disabled Role Models: Do They Exist?",
      topic: "Representation",
      scene: "{childName} is 10. Seeing disabled adults thriving.",
      choices: {
        connect: { text: "Connect them with disabled mentors.", consequence: "{childName} sees their future." },
        teach: { text: "Share stories of disabled achievement.", consequence: "Possibilities expand." },
        boundary: { text: "Disabled people live full lives.", consequence: "Hope is real." },
        avoid: { text: "Only show 'inspiration porn.'", consequence: "{childName} sees disability as tragedy." },
        harm: { text: "Say 'disabled people can't do X.'", consequence: "{childName} limits themselves." }
      }
    },
    11: {
      title: "Autonomy in Medical Decisions: Their Body",
      topic: "Bodily autonomy",
      scene: "{childName} is 11. Medical decisions about their body.",
      choices: {
        connect: { text: "Include them in medical decisions.", consequence: "{childName} owns their body." },
        teach: { text: "Explain medical options clearly.", consequence: "Informed choice develops." },
        boundary: { text: "Their body, their consent.", consequence: "Autonomy is sacred." },
        avoid: { text: "Make decisions without them.", consequence: "{childName} feels violated." },
        harm: { text: "Force medical interventions.", consequence: "{childName} feels powerless." }
      }
    },
    12: {
      title: "School Continuing: Are Teachers Supportive?",
      topic: "Educational relationship",
      scene: "{childName} is 12. School attitude toward disability.",
      choices: {
        connect: { text: "Advocate for supportive teachers.", consequence: "{childName} learns well." },
        teach: { text: "Help them self-advocate at school.", consequence: "Confidence grows." },
        boundary: { text: "Teachers must respect them.", consequence: "Dignity is maintained." },
        avoid: { text: "Accept dismissive teachers.", consequence: "{childName} struggles." },
        harm: { text: "Side with teachers over {childName}.", consequence: "{childName} internalizes rejection." }
      }
    },
    13: {
      title: "Dating & Romance: Will Anyone Like Me?",
      topic: "Romantic possibilities",
      scene: "{childName} is 13. Dating with disability concerns.",
      choices: {
        connect: { text: "Affirm their desirability.", consequence: "{childName} dates confidently." },
        teach: { text: "Discuss that real partners accept them.", consequence: "Standards are high." },
        boundary: { text: "They deserve love fully.", consequence: "Self-worth is stable." },
        avoid: { text: "Suggest they're undesirable.", consequence: "{childName} internalizes undesirability." },
        harm: { text: "Say 'no one will want you.'", consequence: "{childName} self-hates." }
      }
    },
    14: {
      title: "Physical Development & Puberty: Changes in Their Body",
      topic: "Adolescent changes",
      scene: "{childName} is 14. Puberty and changing mobility/pain.",
      choices: {
        connect: { text: "Support them through physical changes.", consequence: "{childName} adjusts well." },
        teach: { text: "Help them understand changing body.", consequence: "Adaptation happens." },
        boundary: { text: "Their changing body is normal.", consequence: "They accept change." },
        avoid: { text: "Ignore their physical changes.", consequence: "{childName} is confused." },
        harm: { text: "Mock their changing body.", consequence: "{childName} develops dysphoria." }
      }
    },
    15: {
      title: "Future Accessibility: College, Work, Independence",
      topic: "Adult planning",
      scene: "{childName} is 15. Planning accessible future.",
      choices: {
        connect: { text: "Plan accessible future together.", consequence: "{childName} is confident." },
        teach: { text: "Research accessible colleges/work.", consequence: "Real options exist." },
        boundary: { text: "Accessibility is non-negotiable.", consequence: "Future is secure." },
        avoid: { text: "Suggest limited options.", consequence: "{childName} limits themselves." },
        harm: { text: "Say 'you can't live independently.'", consequence: "{childName} loses hope." }
      }
    },
    16: {
      title: "Work & Accommodations: What's Possible?",
      topic: "Career possibilities",
      scene: "{childName} is 16. Work and disability accommodations.",
      choices: {
        connect: { text: "Help them envision accessible work.", consequence: "{childName} plans career." },
        teach: { text: "Discuss accommodations as right.", consequence: "Confidence grows." },
        boundary: { text: "They can work with accommodations.", consequence: "Options are real." },
        avoid: { text: "Tell them work isn't possible.", consequence: "{childName} limits dreams." },
        harm: { text: "Say 'you'll never be employed.'", consequence: "{childName} gives up." }
      }
    },
    17: {
      title: "Adult Disability Identity: Pride & Community",
      topic: "Self-determination",
      scene: "{childName} is 17. Building adult disability identity.",
      choices: {
        connect: { text: "Celebrate their disabled identity.", consequence: "{childName} feels proud." },
        teach: { text: "Connect them with disability community.", consequence: "Belonging is real." },
        boundary: { text: "Disabled identity is beautiful.", consequence: "Self-love is deep." },
        avoid: { text: "Push them away from disabled community.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'being disabled is tragic.'", consequence: "{childName} self-hates." }
      }
    },
    18: {
      title: "Adult Disabled Life: Independence, Relationships, Thriving",
      topic: "Life building",
      scene: "{childName} is 18. Building adult life as disabled person.",
      choices: {
        connect: { text: "Support their disabled adult journey.", consequence: "{childName} thrives." },
        teach: { text: "Share wisdom about disabled living.", consequence: "They build wisely." },
        boundary: { text: "Disabled life is full and beautiful.", consequence: "They live authentically." },
        avoid: { text: "Push them toward 'normalcy.'", consequence: "{childName} might resent it." },
        harm: { text: "Say 'I wish you weren't disabled.'", consequence: "{childName} self-hates." }
      }
    }
  },

  single_parent_household: {
    1: {
      title: "Born to Single Parent",
      topic: "Family structure",
      scene: "{childName} is born to single parent raising them alone.",
      choices: {
        connect: { text: "Celebrate your love for {childName}.", consequence: "{childName} feels wanted." },
        teach: { text: "Show that families come in many forms.", consequence: "Normalcy is established." },
        boundary: { text: "Single parent is enough.", consequence: "They're secure." },
        avoid: { text: "Treat {childName} as burden.", consequence: "{childName} internalizes unwantedness." },
        harm: { text: "Say 'you're a mistake.'", consequence: "{childName} internalizes shame." }
      }
    },
    2: {
      title: "Financial Pressure: Doing It All",
      topic: "Economic stress",
      scene: "{childName} grows up with single parent stretched thin financially.",
      choices: {
        connect: { text: "Protect childhood from adult stress.", consequence: "{childName} is just a kid." },
        teach: { text: "Age-appropriately explain situation.", consequence: "Understanding develops." },
        boundary: { text: "Their childhood isn't compromised.", consequence: "They play and grow." },
        avoid: { text: "Make them responsible for finances.", consequence: "{childName} loses childhood." },
        harm: { text: "Blame them for financial struggles.", consequence: "{childName} internalizes guilt." }
      }
    },
    3: {
      title: "Childcare Challenges: Who Watches Them?",
      topic: "Care arrangements",
      scene: "{childName} is 3-4. Finding reliable, affordable childcare.",
      choices: {
        connect: { text: "Find trustworthy, loving care.", consequence: "{childName} feels safe." },
        teach: { text: "Build stable, predictable care schedule.", consequence: "Security develops." },
        boundary: { text: "Care is consistent and safe.", consequence: "They're secure." },
        avoid: { text: "Leave them in unsafe situations.", consequence: "{childName} is at risk." },
        harm: { text: "Neglect them due to busy schedule.", consequence: "{childName} feels unimportant." }
      }
    },
    4: {
      title: "Two Homes? Or Just One?",
      topic: "Living arrangements",
      scene: "{childName} is 4. Do they spend time with other parent?",
      choices: {
        connect: { text: "Support whatever arrangement works.", consequence: "{childName} adapts well." },
        teach: { text: "Help them understand why arrangements are.", consequence: "They grasp situation." },
        boundary: { text: "Both parents are welcome in their life.", consequence: "They're not forced to choose." },
        avoid: { text: "Keep them from other parent.", consequence: "{childName} feels abandoned." },
        harm: { text: "Use them as message to other parent.", consequence: "{childName} feels like pawn." }
      }
    },
    5: {
      title: "School Costs & Resources: Affording Everything",
      topic: "Resource scarcity",
      scene: "{childName} is 5. School supplies, activities, fees.",
      choices: {
        connect: { text: "Find ways to afford what they need.", consequence: "{childName} can participate." },
        teach: { text: "Discuss financial reality age-appropriately.", consequence: "They understand." },
        boundary: { text: "They don't go without essentials.", consequence: "Dignity is maintained." },
        avoid: { text: "Let them miss out due to money.", consequence: "{childName} feels shame." },
        harm: { text: "Blame them for financial stress.", consequence: "{childName} internalizes guilt." }
      }
    },
    6: {
      title: "Different Family Structure: Explaining to Peers",
      topic: "Social identity",
      scene: "{childName} is 6. School asks about family structure.",
      choices: {
        connect: { text: "Help them talk about their family proudly.", consequence: "{childName} is confident." },
        teach: { text: "Normalize different family structures.", consequence: "Pride in family develops." },
        boundary: { text: "Their family is valid.", consequence: "They're not ashamed." },
        avoid: { text: "Make them hide their family structure.", consequence: "{childName} internalizes shame." },
        harm: { text: "Allow bullying about single parent.", consequence: "{childName} internalizes rejection." }
      }
    },
    7: {
      title: "Parent Exhaustion: Guilt About Working So Much",
      topic: "Parental sacrifice",
      scene: "{childName} is 7. Single parent is exhausted from work.",
      choices: {
        connect: { text: "Be present when you can.", consequence: "{childName} feels loved." },
        teach: { text: "Help them understand your work matters.", consequence: "They understand sacrifice." },
        boundary: { text: "Quality matters more than quantity.", consequence: "Connection is real." },
        avoid: { text: "Let exhaustion make you neglectful.", consequence: "{childName} feels unimportant." },
        harm: { text: "Make them feel guilty for existing.", consequence: "{childName} internalizes burden." }
      }
    },
    8: {
      title: "Emotional Parentification: Are They Your Support?",
      topic: "Boundary violation",
      scene: "{childName} is 8. Danger of relying on them emotionally.",
      choices: {
        connect: { text: "Find adult support for yourself.", consequence: "{childName} stays a kid." },
        teach: { text: "Keep parent-child roles clear.", consequence: "Boundaries are healthy." },
        boundary: { text: "They're not your therapist.", consequence: "They're protected." },
        avoid: { text: "Use them as emotional support.", consequence: "{childName} loses childhood." },
        harm: { text: "Burden them with adult problems.", consequence: "{childName} internalizes responsibility." }
      }
    },
    9: {
      title: "Latchkey Kid? Caring for Self or Siblings",
      topic: "Independence and responsibility",
      scene: "{childName} is 9. Responsible for themselves or siblings?",
      choices: {
        connect: { text: "Build age-appropriate independence.", consequence: "{childName} is capable." },
        teach: { text: "Teach responsibility without overload.", consequence: "Competence develops." },
        boundary: { text: "Responsibilities match their age.", consequence: "They're not overburdened." },
        avoid: { text: "Leave them to raise themselves.", consequence: "{childName} loses childhood." },
        harm: { text: "Make them parent their siblings.", consequence: "{childName} internalizes burden." }
      }
    },
    10: {
      title: "Resources for Extras: Sports, Music, Activities",
      topic: "Opportunity access",
      scene: "{childName} is 10. Can they afford activities like peers?",
      choices: {
        connect: { text: "Find affordable or free activities.", consequence: "{childName} participates." },
        teach: { text: "Help them find scholarships/aid.", consequence: "Access is expanded." },
        boundary: { text: "They can do activities.", consequence: "They're not left behind." },
        avoid: { text: "Tell them they can't do activities.", consequence: "{childName} feels excluded." },
        harm: { text: "Use activity denial as punishment.", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Peer Questions: 'Where's Your Other Parent?'",
      topic: "Social explanation",
      scene: "{childName} is 11. Peers ask about other parent.",
      choices: {
        connect: { text: "Help them explain their situation.", consequence: "{childName} is confident." },
        teach: { text: "Discuss how to respond to questions.", consequence: "They handle it well." },
        boundary: { text: "Their family story is theirs to tell.", consequence: "Privacy is protected." },
        avoid: { text: "Make them feel ashamed of situation.", consequence: "{childName} hides family." },
        harm: { text: "Allow bullying about family structure.", consequence: "{childName} internalizes rejection." }
      }
    },
    12: {
      title: "Dating Parent: How Does That Affect Them?",
      topic: "Changing family dynamics",
      scene: "{childName} is 12. You're dating or in new relationship.",
      choices: {
        connect: { text: "Include them in relationship development.", consequence: "{childName} adjusts well." },
        teach: { text: "Discuss new relationships openly.", consequence: "They understand." },
        boundary: { text: "Their relationship with you stays primary.", consequence: "Security is maintained." },
        avoid: { text: "Hide relationships from them.", consequence: "{childName} feels betrayed." },
        harm: { text: "Neglect them for new relationship.", consequence: "{childName} internalizes rejection." }
      }
    },
    13: {
      title: "Money & Values: Wants vs. Needs",
      topic: "Financial literacy",
      scene: "{childName} is 13. Understanding financial limits.",
      choices: {
        connect: { text: "Teach money management thoughtfully.", consequence: "{childName} has good financial sense." },
        teach: { text: "Discuss values about spending.", consequence: "Money wisdom develops." },
        boundary: { text: "Wants and needs are different.", consequence: "They're grounded." },
        avoid: { text: "Either spoil them or deprive them.", consequence: "{childName} has unhealthy relationship with money." },
        harm: { text: "Make them feel guilty for wanting things.", consequence: "{childName} internalizes shame." }
      }
    },
    14: {
      title: "Parent New Relationship Becoming Serious",
      topic: "Family expansion",
      scene: "{childName} is 14. New person becoming major part of family.",
      choices: {
        connect: { text: "Transition slowly and thoughtfully.", consequence: "{childName} adjusts well." },
        teach: { text: "Discuss new family structure.", consequence: "They understand." },
        boundary: { text: "Their bond with you stays primary.", consequence: "Security is maintained." },
        avoid: { text: "Push new person on them.", consequence: "{childName} might resist." },
        harm: { text: "Replace them with new relationship.", consequence: "{childName} internalizes rejection." }
      }
    },
    15: {
      title: "College & Finances: Can They Afford It?",
      topic: "Educational future",
      scene: "{childName} is 15. College seems unaffordable.",
      choices: {
        connect: { text: "Research scholarships and aid together.", consequence: "{childName} can go to college." },
        teach: { text: "Discuss educational options.", consequence: "Paths feel real." },
        boundary: { text: "College is possible with planning.", consequence: "Hope is real." },
        avoid: { text: "Tell them college isn't possible.", consequence: "{childName} limits dreams." },
        harm: { text: "Say 'you're poor, you won't go far.'", consequence: "{childName} internalizes limitation." }
      }
    },
    16: {
      title: "Work & School Balance: Do They Need to Work?",
      topic: "Adolescent responsibility",
      scene: "{childName} is 16. Working to help family or for college.",
      choices: {
        connect: { text: "Support work while protecting school.", consequence: "{childName} balances well." },
        teach: { text: "Help them manage responsibility.", consequence: "Maturity develops." },
        boundary: { text: "School isn't sacrificed for work.", consequence: "Future is protected." },
        avoid: { text: "Push them to work too much.", consequence: "{childName} might burn out." },
        harm: { text: "Make them feel responsible for family survival.", consequence: "{childName} internalizes burden." }
      }
    },
    17: {
      title: "Understanding Sacrifice: Why You Do This",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand your journey?",
      choices: {
        connect: { text: "Share your story authentically.", consequence: "{childName} understands you." },
        teach: { text: "Discuss how you became single parent.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to discuss your journey.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame them for your sacrifices.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Relationship: Peers as Family",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own family and community.",
      choices: {
        connect: { text: "Support their family-building journey.", consequence: "{childName} creates chosen family." },
        teach: { text: "Share what you learned about family.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Expect them to replicate your path.", consequence: "{childName} might resent it." },
        harm: { text: "Guilt them for leaving.", consequence: "{childName} is burdened." }
      }
    }
  },

  blended_family: {
    1: {
      title: "Born or Joining Blended Family",
      topic: "Complex family structure",
      scene: "{childName} is born into or joins a blended family with step-parents and step-siblings.",
      choices: {
        connect: { text: "Love them fully as part of family.", consequence: "{childName} feels wanted." },
        teach: { text: "Explain family structure age-appropriately.", consequence: "Understanding develops." },
        boundary: { text: "Blended family is valid family.", consequence: "They're secure." },
        avoid: { text: "Make them feel like outsider.", consequence: "{childName} internalizes rejection." },
        harm: { text: "Compare them to step-siblings.", consequence: "{childName} internalizes inferiority." }
      }
    },
    2: {
      title: "Two Homes or Complex Custody",
      topic: "Living arrangements",
      scene: "{childName} is 2-3. Moving between homes or adjusted custody arrangements.",
      choices: {
        connect: { text: "Create stable, loving spaces in each home.", consequence: "{childName} feels at home." },
        teach: { text: "Help them understand arrangements.", consequence: "Security develops." },
        boundary: { text: "Both homes are theirs.", consequence: "They belong in both." },
        avoid: { text: "Create instability or conflicts.", consequence: "{childName} feels unsafe." },
        harm: { text: "Use them as messenger between homes.", consequence: "{childName} feels like pawn." }
      }
    },
    3: {
      title: "Step-Parent Relationships: Building Connection",
      topic: "New adult relationships",
      scene: "{childName} is 3-4. Getting to know step-parent.",
      choices: {
        connect: { text: "Let relationships develop naturally.", consequence: "{childName} connects authentically." },
        teach: { text: "Explain new family members.", consequence: "Understanding develops." },
        boundary: { text: "Relationships are their choice.", consequence: "No forced bonds." },
        avoid: { text: "Force immediate closeness.", consequence: "{childName} resists." },
        harm: { text: "Punish them for not loving step-parent.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "Step-Siblings: New Sibling Relationships",
      topic: "Sibling dynamics",
      scene: "{childName} is 4. Adjusting to step-siblings.",
      choices: {
        connect: { text: "Support positive sibling relationships.", consequence: "{childName} bonds with step-siblings." },
        teach: { text: "Help them navigate sibling dynamics.", consequence: "Relationships develop." },
        boundary: { text: "They don't have to love step-siblings.", consequence: "Authentic connection happens." },
        avoid: { text: "Force sibling closeness.", consequence: "{childName} resists." },
        harm: { text: "Use step-siblings to replace bio-parent.", consequence: "{childName} internalizes loss." }
      }
    },
    5: {
      title: "Loyalty Conflicts: Loving Both Parents",
      topic: "Divided feelings",
      scene: "{childName} is 5. Fear of betraying either parent by loving other.",
      choices: {
        connect: { text: "Affirm that loving both is okay.", consequence: "{childName} feels guilt-free." },
        teach: { text: "Discuss that love isn't limited.", consequence: "Understanding develops." },
        boundary: { text: "They can love multiple parents.", consequence: "They're secure." },
        avoid: { text: "Make them choose between parents.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Criticize other parent to make them choose.", consequence: "{childName} internalizes guilt." }
      }
    },
    6: {
      title: "School: Explaining Complex Family",
      topic: "Social identity",
      scene: "{childName} is 6. School asks about family structure.",
      choices: {
        connect: { text: "Help them talk about family confidently.", consequence: "{childName} is secure." },
        teach: { text: "Normalize blended families.", consequence: "Pride in family develops." },
        boundary: { text: "Their family is valid.", consequence: "They're not ashamed." },
        avoid: { text: "Make them hide family structure.", consequence: "{childName} internalizes shame." },
        harm: { text: "Allow bullying about family.", consequence: "{childName} internalizes rejection." }
      }
    },
    7: {
      title: "Holiday Complications: Where for Christmas?",
      topic: "Celebration logistics",
      scene: "{childName} is 7. Holiday schedules and split-family dynamics.",
      choices: {
        connect: { text: "Plan celebrations that honor all families.", consequence: "{childName} feels included." },
        teach: { text: "Discuss holiday transitions positively.", consequence: "They adapt well." },
        boundary: { text: "Holidays include both/all families.", consequence: "No one is left out." },
        avoid: { text: "Use holidays as conflict zone.", consequence: "{childName} feels torn." },
        harm: { text: "Force them to choose which parent to spend time with.", consequence: "{childName} internalizes guilt." }
      }
    },
    8: {
      title: "Birth Parent Absence: Do They Miss Someone?",
      topic: "Loss and grief",
      scene: "{childName} is 8. Birth parent may be distant or absent.",
      choices: {
        connect: { text: "Acknowledge their feelings about absence.", consequence: "{childName} can grieve." },
        teach: { text: "Help them understand it's not their fault.", consequence: "Guilt is relieved." },
        boundary: { text: "Absence is about parent, not them.", consequence: "They're not blamed." },
        avoid: { text: "Ignore their grief.", consequence: "{childName} internalizes loss." },
        harm: { text: "Blame them for parent's absence.", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "Identity: Whose Family Am I In?",
      topic: "Identity crystallizing",
      scene: "{childName} is 9. Who are they in complicated family system?",
      choices: {
        connect: { text: "Support multifaceted family identity.", consequence: "{childName} is secure." },
        teach: { text: "Discuss identity across families.", consequence: "Integration happens." },
        boundary: { text: "They belong in all their families.", consequence: "They're not torn." },
        avoid: { text: "Force single family identity.", consequence: "{childName} internalizes fragmentation." },
        harm: { text: "Say 'you're only part of one family.'", consequence: "{childName} internalizes rejection." }
      }
    },
    10: {
      title: "Finances Across Families: Understanding Support",
      topic: "Economic complexity",
      scene: "{childName} is 10. Child support, unequal resources across homes.",
      choices: {
        connect: { text: "Manage finances fairly across homes.", consequence: "{childName} feels secure." },
        teach: { text: "Explain financial arrangements simply.", consequence: "They understand." },
        boundary: { text: "They're not responsible for finances.", consequence: "They're protected." },
        avoid: { text: "Use finances as control tool.", consequence: "{childName} feels manipulated." },
        harm: { text: "Make them feel guilty about support payments.", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Peer Questions: 'How Many Siblings Do You Have?'",
      topic: "Social explanation",
      scene: "{childName} is 11. Questions about siblings become complicated.",
      choices: {
        connect: { text: "Help them answer comfortably.", consequence: "{childName} is confident." },
        teach: { text: "Discuss how to explain blended family.", consequence: "They handle questions well." },
        boundary: { text: "Their family story is valid.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} hides family." },
        harm: { text: "Allow bullying about family.", consequence: "{childName} internalizes rejection." }
      }
    },
    12: {
      title: "Custody Decisions: Does Their Preference Matter?",
      topic: "Autonomy emerging",
      scene: "{childName} is 12. Custody arrangements they have voice in.",
      choices: {
        connect: { text: "Include their preferences in decisions.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss why their input matters.", consequence: "They have agency." },
        boundary: { text: "Their preferences are considered.", consequence: "Autonomy is respected." },
        avoid: { text: "Ignore their preferences.", consequence: "{childName} feels unheard." },
        harm: { text: "Use them as pawn between parents.", consequence: "{childName} feels manipulated." }
      }
    },
    13: {
      title: "Step-Parent Authority: Do They Have It?",
      topic: "Power dynamics",
      scene: "{childName} is 13. How much authority does step-parent have?",
      choices: {
        connect: { text: "Clarify respectful step-parent roles.", consequence: "{childName} feels respected." },
        teach: { text: "Discuss healthy step-parent relationships.", consequence: "Boundaries are clear." },
        boundary: { text: "Step-parent is not replacement parent.", consequence: "Bio-parents remain primary." },
        avoid: { text: "Let step-parent overstep boundaries.", consequence: "{childName} feels disrespected." },
        harm: { text: "Use step-parent as disciplinarian.", consequence: "{childName} resents step-parent." }
      }
    },
    14: {
      title: "Dating & Romance: Explaining Complex Family",
      topic: "Romantic complications",
      scene: "{childName} is 14. Dating means explaining family.",
      choices: {
        connect: { text: "Help them explain family confidently.", consequence: "{childName} dates openly." },
        teach: { text: "Discuss what partners should understand.", consequence: "Standards develop." },
        boundary: { text: "Their family is nothing to hide.", consequence: "They're proud." },
        avoid: { text: "Tell them to hide family structure.", consequence: "{childName}'s relationships stay shallow." },
        harm: { text: "Say 'no one will understand your family.'", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "Multiple Parents, Multiple Homes: Identity Integration",
      topic: "Maturation",
      scene: "{childName} is 15. Growing up across multiple family systems.",
      choices: {
        connect: { text: "Help them integrate identities.", consequence: "{childName} is whole." },
        teach: { text: "Discuss identity across families.", consequence: "Integration is healthy." },
        boundary: { text: "Multiple homes make them richer.", consequence: "They're grounded." },
        avoid: { text: "Force loyalty to one family.", consequence: "{childName} internalizes fragmentation." },
        harm: { text: "Tell them they're divided.", consequence: "{childName} internalizes shame." }
      }
    },
    16: {
      title: "College & Identity: Where Do I Belong?",
      topic: "Adult identity forming",
      scene: "{childName} is 16. Where will they go? Which family support?",
      choices: {
        connect: { text: "Support their college journey.", consequence: "{childName} goes to college." },
        teach: { text: "Discuss that families can support together.", consequence: "Integration is possible." },
        boundary: { text: "All their families support them.", consequence: "They're secure." },
        avoid: { text: "Make college a loyalty test.", consequence: "{childName} feels torn." },
        harm: { text: "Say 'we won't help if you choose the other family.'", consequence: "{childName} is torn." }
      }
    },
    17: {
      title: "Adult Perspective: Understanding Everyone's Journey",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand all parents' perspectives?",
      choices: {
        connect: { text: "Share stories authentically.", consequence: "{childName} understands complexity." },
        teach: { text: "Discuss how people become who they are.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed.", consequence: "Relationships are real." },
        avoid: { text: "Demand they take sides.", consequence: "{childName} feels torn." },
        harm: { text: "Bad-mouth other parents.", consequence: "{childName} internalizes conflict." }
      }
    },
    18: {
      title: "Adult: Building Own Family Vision",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own idea of family.",
      choices: {
        connect: { text: "Support whatever family they create.", consequence: "{childName} builds wisely." },
        teach: { text: "Share what you learned about family.", consequence: "They build thoughtfully." },
        boundary: { text: "Their family is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them to replicate your family.", consequence: "{childName} might resent it." },
        harm: { text: "Reject their choices about family.", consequence: "{childName} internalizes rejection." }
      }
    }
  },

  first_gen_immigrant: {
    1: {
      title: "Born in New Country or Arrived Young",
      topic: "Displacement and belonging",
      scene: "{childName} is born or arrives in new country. Cultural disorientation begins.",
      choices: {
        connect: { text: "Love them fully as bridge between cultures.", consequence: "{childName} feels valued." },
        teach: { text: "Share heritage and new culture.", consequence: "Bicultural identity starts." },
        boundary: { text: "Both cultures belong to them.", consequence: "They're secure." },
        avoid: { text: "Push assimilation only.", consequence: "{childName} loses heritage." },
        harm: { text: "Say 'forget your old country.'", consequence: "{childName} internalizes rejection of heritage." }
      }
    },
    2: {
      title: "Language: Which Language Is Home?",
      topic: "Language development",
      scene: "{childName} is 2-3. Growing up with multiple languages.",
      choices: {
        connect: { text: "Support bilingualism actively.", consequence: "{childName} is bilingual." },
        teach: { text: "Celebrate multiple languages.", consequence: "Pride in languages develops." },
        boundary: { text: "Multiple languages are strength.", consequence: "They're not forced to choose." },
        avoid: { text: "Suppress heritage language.", consequence: "{childName} loses connection to roots." },
        harm: { text: "Mock their accent or language.", consequence: "{childName} internalizes shame." }
      }
    },
    3: {
      title: "Cultural Practices: Keep or Abandon?",
      topic: "Identity choices",
      scene: "{childName} is 3-4. Growing up with home culture and new culture.",
      choices: {
        connect: { text: "Let them keep meaningful cultural practices.", consequence: "{childName} is grounded." },
        teach: { text: "Explain cultural significance.", consequence: "Understanding develops." },
        boundary: { text: "Their culture is theirs to keep.", consequence: "Identity is affirmed." },
        avoid: { text: "Dismiss home culture.", consequence: "{childName} loses roots." },
        harm: { text: "Force assimilation at expense of heritage.", consequence: "{childName} internalizes rejection." }
      }
    },
    4: {
      title: "Racial/Ethnic Identity in New Place",
      topic: "Visible identity",
      scene: "{childName} is 4. Experiencing racial/ethnic difference in new country.",
      choices: {
        connect: { text: "Help them understand and be proud of identity.", consequence: "{childName} is proud." },
        teach: { text: "Discuss racism and belonging.", consequence: "Critical consciousness develops." },
        boundary: { text: "Their identity is beautiful.", consequence: "Self-love is strong." },
        avoid: { text: "Pretend racism doesn't exist.", consequence: "{childName} is unprepared." },
        harm: { text: "Say 'you don't belong here because of how you look.'", consequence: "{childName} internalizes rejection." }
      }
    },
    5: {
      title: "School: Language Barrier or Advantage?",
      topic: "Educational entry",
      scene: "{childName} is 5. Starting school in new language/culture.",
      choices: {
        connect: { text: "Support language development at school.", consequence: "{childName} learns successfully." },
        teach: { text: "Explain school system vs. home culture.", consequence: "Navigation develops." },
        boundary: { text: "They have access to education.", consequence: "Equity is real." },
        avoid: { text: "Let language barrier isolate them.", consequence: "{childName} falls behind." },
        harm: { text: "Blame them for language struggles.", consequence: "{childName} internalizes shame." }
      }
    },
    6: {
      title: "Food, Clothes, Customs: Are They 'Normal'?",
      topic: "Cultural visibility",
      scene: "{childName} is 6. Home food, clothes, customs visible at school.",
      choices: {
        connect: { text: "Celebrate their cultural practices.", consequence: "{childName} is proud." },
        teach: { text: "Explain cultural differences positively.", consequence: "Pride develops." },
        boundary: { text: "Their culture is beautiful, not weird.", consequence: "They're secure." },
        avoid: { text: "Make them hide culture at school.", consequence: "{childName} develops shame." },
        harm: { text: "Mock their food or customs.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "Peer Inclusion: Do They Fit In?",
      topic: "Social belonging",
      scene: "{childName} is 7. Making friends in new country.",
      choices: {
        connect: { text: "Help them navigate belonging.", consequence: "{childName} makes friends." },
        teach: { text: "Discuss difference as normal.", consequence: "Confidence develops." },
        boundary: { text: "They belong despite differences.", consequence: "Inclusion is real." },
        avoid: { text: "Suggest they should assimilate completely.", consequence: "{childName} loses identity." },
        harm: { text: "Allow bullying about accent or origin.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Parent Homesickness: Missing Home Country",
      topic: "Parental emotion",
      scene: "{childName} is 8. Parent is homesick and struggling.",
      choices: {
        connect: { text: "Protect them from adult grief.", consequence: "{childName} is still a kid." },
        teach: { text: "Age-appropriately acknowledge homesickness.", consequence: "They understand but aren't burdened." },
        boundary: { text: "Their childhood isn't compromised.", consequence: "They're safe." },
        avoid: { text: "Make them responsible for parent's happiness.", consequence: "{childName} internalizes burden." },
        harm: { text: "Blame them for parent's sacrifice.", consequence: "{childName} internalizes guilt." }
      }
    },
    9: {
      title: "Cultural Mediator: Translating for Family",
      topic: "Adultification",
      scene: "{childName} is 9. Translating, explaining culture, being mediator.",
      choices: {
        connect: { text: "Let them help without making it their job.", consequence: "{childName} is helpful but not burdened." },
        teach: { text: "Celebrate their bridge role.", consequence: "Pride develops." },
        boundary: { text: "They're not your interpreter.", consequence: "Childhood is protected." },
        avoid: { text: "Make them depend on them for survival.", consequence: "{childName} loses childhood." },
        harm: { text: "Resent them for not translating well.", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Identifying as Immigrant Child: Is That Who They Are?",
      topic: "Identity crystallizing",
      scene: "{childName} is 10. How does immigrant identity feel?",
      choices: {
        connect: { text: "Support immigrant identity as strength.", consequence: "{childName} is proud." },
        teach: { text: "Discuss bicultural identity.", consequence: "Integration happens." },
        boundary: { text: "Immigrant identity is valuable.", consequence: "Pride develops." },
        avoid: { text: "Treat immigrant identity as shame.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'you'll never be truly local.'", consequence: "{childName} internalizes alienation." }
      }
    },
    11: {
      title: "Citizenship & Documentation: Understanding Status",
      topic: "Legal identity",
      scene: "{childName} is 11. Beginning to understand citizenship/immigration status.",
      choices: {
        connect: { text: "Explain status age-appropriately.", consequence: "{childName} understands." },
        teach: { text: "Discuss legal rights and safety.", consequence: "Awareness develops." },
        boundary: { text: "Status doesn't define worth.", consequence: "They're secure." },
        avoid: { text: "Hide status complexity from them.", consequence: "{childName} is confused." },
        harm: { text: "Use status to control or scare them.", consequence: "{childName} internalizes fear." }
      }
    },
    12: {
      title: "School: Academic Achievement Pressure",
      topic: "Model minority myth",
      scene: "{childName} is 12. Pressure to be 'model minority' student.",
      choices: {
        connect: { text: "Support them without achievement pressure.", consequence: "{childName} does well naturally." },
        teach: { text: "Discuss that all paths are valid.", consequence: "Pressure eases." },
        boundary: { text: "Their worth isn't their grades.", consequence: "They're secure." },
        avoid: { text: "Push achievement obsessively.", consequence: "{childName} might burn out." },
        harm: { text: "Say 'immigrants have to be perfect.'", consequence: "{childName} internalizes pressure." }
      }
    },
    13: {
      title: "Dating & Cultural Expectations: Who Can They Date?",
      topic: "Cultural conflict",
      scene: "{childName} is 13. Dating and cultural/religious expectations conflict.",
      choices: {
        connect: { text: "Support their dating within reasonable bounds.", consequence: "{childName} dates authentically." },
        teach: { text: "Discuss both cultures' values.", consequence: "Integration is possible." },
        boundary: { text: "Some autonomy in dating is theirs.", consequence: "Consent is real." },
        avoid: { text: "Force arranged relationship.", consequence: "{childName} resents it." },
        harm: { text: "Say 'you can only date within our culture.'", consequence: "{childName} internalizes rejection." }
      }
    },
    14: {
      title: "Economic Pressure: Parent Working Below Skills",
      topic: "Family sacrifice",
      scene: "{childName} is 14. Parent working menial job despite credentials.",
      choices: {
        connect: { text: "Celebrate parent's sacrifice without making them feel guilty.", consequence: "{childName} is proud." },
        teach: { text: "Discuss immigration realities.", consequence: "Understanding develops." },
        boundary: { text: "Parent's sacrifice isn't {childName}'s burden.", consequence: "They're protected." },
        avoid: { text: "Make them feel responsible for parent's struggle.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Resent them for parent's situation.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "College & Future: Building New American Dream",
      topic: "Future planning",
      scene: "{childName} is 15. College and career planning in new country.",
      choices: {
        connect: { text: "Support their authentic career path.", consequence: "{childName} plans wisely." },
        teach: { text: "Discuss opportunity and access.", consequence: "Real options exist." },
        boundary: { text: "Their dreams matter.", consequence: "They're encouraged." },
        avoid: { text: "Push them toward one type of career.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you'll never succeed like local kids.'", consequence: "{childName} internalizes inferiority." }
      }
    },
    16: {
      title: "Language: Fluency & Accent Still Noticeable",
      topic: "Ongoing identity",
      scene: "{childName} is 16. Still navigating language in new country.",
      choices: {
        connect: { text: "Celebrate their linguistic abilities.", consequence: "{childName} is proud." },
        teach: { text: "Discuss that accents are normal.", consequence: "They accept themselves." },
        boundary: { text: "Their language journey is valid.", consequence: "They're secure." },
        avoid: { text: "Tell them to hide accent.", consequence: "{childName} internalizes shame." },
        harm: { text: "Mock their accent or grammar.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Adult Perspective: Understanding Parent's Sacrifice",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand parent's immigration journey?",
      choices: {
        connect: { text: "Share your immigration story authentically.", consequence: "{childName} understands." },
        teach: { text: "Discuss what you sacrificed and why.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to discuss your journey.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame them for your sacrifice.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Identity: Bicultural, Bilingual, Home & Belonging",
      topic: "Self-determination",
      scene: "{childName} is 18. Building adult identity as first-generation immigrant.",
      choices: {
        connect: { text: "Celebrate their bicultural identity.", consequence: "{childName} is proud." },
        teach: { text: "Share wisdom about belonging.", consequence: "They build wisely." },
        boundary: { text: "Both cultures are theirs.", consequence: "They're whole." },
        avoid: { text: "Push them toward one culture.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you'll never truly belong here.'", consequence: "{childName} internalizes alienation." }
      }
    }
  }
};
