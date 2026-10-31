export const SPECIAL_START_YEARLY_BEATS__TRAGIC_02 = {
  homelessness: {
    1: {
      title: "Born Into Homelessness",
      topic: "Shelter insecurity",
      scene: "{childName} is born to family living in car or shelter.",
      choices: {
        connect: { text: "Love them fully despite homelessness.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They feel secure." },
        boundary: { text: "They're a child first.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'we have nowhere.'", consequence: "{childName} internalizes despair." }
      }
    },
    2: {
      title: "No Fixed Address: Always Moving",
      topic: "Instability",
      scene: "{childName} is 2-3. Living in shelters, cars, temporary spaces.",
      choices: {
        connect: { text: "Create consistency within chaos.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand their situation.", consequence: "They're grounded." },
        boundary: { text: "Home is where family is.", consequence: "They're safe." },
        avoid: { text: "Make homelessness feel permanent.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Tell them 'we'll always be homeless.'", consequence: "{childName} internalizes despair." }
      }
    },
    3: {
      title: "Shelter Conditions: Crowded and Unsafe",
      topic: "Environmental trauma",
      scene: "{childName} is 3-4. Shelters are cramped and sometimes dangerous.",
      choices: {
        connect: { text: "Protect them from worst of shelter.", consequence: "{childName} feels loved." },
        teach: { text: "Help them understand they're safe with family.", consequence: "They're grounded." },
        boundary: { text: "Safety is possible.", consequence: "They're secure." },
        avoid: { text: "Expose them to dangerous situations.", consequence: "{childName} internalizes fear of environment." },
        harm: { text: "Tell them 'this is all we get.'", consequence: "{childName} internalizes acceptance of harm." }
      }
    },
    4: {
      title: "School: Where Can They Sleep?",
      topic: "Educational access",
      scene: "{childName} is in school. Tired from shelter conditions.",
      choices: {
        connect: { text: "Help them get rest and focus.", consequence: "{childName} can learn." },
        teach: { text: "Advocate for their needs.", consequence: "They're supported." },
        boundary: { text: "Education is their right.", consequence: "They're protected." },
        avoid: { text: "Let schooling suffer.", consequence: "{childName} falls behind." },
        harm: { text: "Tell them school doesn't matter.", consequence: "{childName} disengages." }
      }
    },
    5: {
      title: "Visible Homelessness: Peers Notice",
      topic: "Social shame",
      scene: "{childName} is 5-6. Peers see them at shelter or in worn clothes.",
      choices: {
        connect: { text: "Help them navigate with dignity.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that homelessness isn't shameful.", consequence: "They're grounded." },
        boundary: { text: "Their worth isn't their housing.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} becomes isolated." }
      }
    },
    6: {
      title: "Identity: Homeless Child",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value beyond housing.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that homelessness is circumstance.", consequence: "They understand." },
        boundary: { text: "They're more than homelessness.", consequence: "They're secure." },
        avoid: { text: "Make homelessness their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they'll always be homeless.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    7: {
      title: "Shelter Rules: Restrictions and Control",
      topic: "Loss of autonomy",
      scene: "{childName} is 7. Shelter has strict rules.",
      choices: {
        connect: { text: "Help them understand rules protect them.", consequence: "{childName} is cooperative." },
        teach: { text: "Discuss that rules are temporary.", consequence: "They're grounded." },
        boundary: { text: "Rules aren't punishment.", consequence: "They're secure." },
        avoid: { text: "Make rules feel oppressive.", consequence: "{childName} internalizes resentment." },
        harm: { text: "Tell them they're prisoners.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Peer Relationships: Explaining Where They Live",
      topic: "Social navigation",
      scene: "{childName} is 8. Hiding or explaining their shelter.",
      choices: {
        connect: { text: "Help them with honest explanations.", consequence: "{childName} is secure." },
        teach: { text: "Discuss selective disclosure.", consequence: "They navigate." },
        boundary: { text: "Their truth is valid.", consequence: "They're protected." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} becomes secretive." },
        harm: { text: "Tell them no one would accept them.", consequence: "{childName} isolates." }
      }
    },
    9: {
      title: "Escape Fantasy: Having a Home",
      topic: "Longing and hope",
      scene: "{childName} is 9. Dreaming of a real house.",
      choices: {
        connect: { text: "Validate their dreams.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss paths to housing.", consequence: "They're hopeful." },
        boundary: { text: "Home is possible.", consequence: "They're secure." },
        avoid: { text: "Dismiss their dreams.", consequence: "{childName} loses hope." },
        harm: { text: "Tell them they'll never have a home.", consequence: "{childName} internalizes despair." }
      }
    },
    10: {
      title: "Family Strength in Crisis",
      topic: "Bonding through hardship",
      scene: "{childName} is 10. Learning family stays together.",
      choices: {
        connect: { text: "Celebrate family bonds.", consequence: "{childName} feels loved." },
        teach: { text: "Discuss that family is home.", consequence: "They're grounded." },
        boundary: { text: "Love transcends housing.", consequence: "They're secure." },
        avoid: { text: "Tell them family is failing them.", consequence: "{childName} internalizes resentment." },
        harm: { text: "Threaten family separation.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    11: {
      title: "Adolescence: Will Things Improve?",
      topic: "Future uncertainty",
      scene: "{childName} is 11. Wondering if they'll ever get housing.",
      choices: {
        connect: { text: "Support their hope.", consequence: "{childName} is resilient." },
        teach: { text: "Discuss paths forward.", consequence: "They see options." },
        boundary: { text: "Better future is possible.", consequence: "They're empowered." },
        avoid: { text: "Tell them it only gets worse.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them homelessness is their fate.", consequence: "{childName} gives up." }
      }
    },
    12: {
      title: "Dating & Relationships: Where Can They Go?",
      topic: "Romantic limitations",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them navigate dating in shelter.", consequence: "They navigate." },
        boundary: { text: "Their relationships are valid.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will date them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them their situation makes them unlovable.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    13: {
      title: "Getting Out: Transition Housing Possibility",
      topic: "Hope emerging",
      scene: "{childName} is 13. Family might get into transitional housing.",
      choices: {
        connect: { text: "Support this possibility.", consequence: "{childName} is hopeful." },
        teach: { text: "Help them prepare for change.", consequence: "They're grounded." },
        boundary: { text: "Progress is possible.", consequence: "They're secure." },
        avoid: { text: "Make them fear change.", consequence: "{childName} internalizes that change = danger." },
        harm: { text: "Tell them transitional won't last.", consequence: "{childName} internalizes despair." }
      }
    },
    14: {
      title: "Housing Secured: Moving Into Own Place",
      topic: "Major life transition",
      scene: "{childName} is 14. Family gets stable housing.",
      choices: {
        connect: { text: "Celebrate this milestone.", consequence: "{childName} feels secure." },
        teach: { text: "Help them adjust to housed life.", consequence: "They adapt." },
        boundary: { text: "Home is theirs now.", consequence: "They're secure." },
        avoid: { text: "Make them fear losing housing.", consequence: "{childName} internalizes housing fragility." },
        harm: { text: "Tell them they don't deserve this.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    15: {
      title: "College Planning: Different Opportunities",
      topic: "Educational possibility",
      scene: "{childName} is 15. Stability allows planning.",
      choices: {
        connect: { text: "Support their educational goals.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss paths to college.", consequence: "They're informed." },
        boundary: { text: "Education is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them homelessness blocked them.", consequence: "{childName} internalizes past as permanent." },
        harm: { text: "Tell them they don't deserve college.", consequence: "{childName} suppresses ambition." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Home",
      topic: "Love amid stability",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them enjoy being housed.", consequence: "They're present." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make housing a point of insecurity.", consequence: "{childName} loses confidence." },
        harm: { text: "Tell them partner will leave.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Family's Journey: How They Survived",
      topic: "Parental resilience",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share family's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss survival and strength.", consequence: "They're proud." },
        boundary: { text: "Their story is powerful.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them family's choices were foolish.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Building Safe Housing Future",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about housing security.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} might resent." },
        harm: { text: "Tell them homelessness will return.", consequence: "{childName} internalizes hypervigilance." }
      }
    }
  },

  food_insecurity: {
    1: {
      title: "Born Into Food Insecurity",
      topic: "Hunger as normalcy",
      scene: "{childName} is born into family where meals are uncertain.",
      choices: {
        connect: { text: "Love them fully despite hunger.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe about food.", consequence: "They're grounded." },
        boundary: { text: "They're not responsible for hunger.", consequence: "They're protected." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'food is scarce.'", consequence: "{childName} internalizes food anxiety." }
      }
    },
    2: {
      title: "Inconsistent Meals: Never Knowing",
      topic: "Hunger uncertainty",
      scene: "{childName} is 2-3. Some days have meals, some don't.",
      choices: {
        connect: { text: "Feed them when you can with love.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand meal patterns.", consequence: "They're grounded." },
        boundary: { text: "Food insecurity isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Make them feel responsible.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them they eat too much.", consequence: "{childName} internalizes food shame." }
      }
    },
    3: {
      title: "School Meals: Only Reliable Food",
      topic: "Institutional reliance",
      scene: "{childName} is 3-4. School meals might be primary food.",
      choices: {
        connect: { text: "Ensure they get school meals.", consequence: "{childName} gets nutrition." },
        teach: { text: "Help them understand school support.", consequence: "They're grounded." },
        boundary: { text: "School meals are good.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed of need.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're dependent on charity.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "Visible Hunger: Stomach Pain at School",
      topic: "Physical manifestation",
      scene: "{childName} is in school. Sometimes hungry during day.",
      choices: {
        connect: { text: "Help them get snacks or aid.", consequence: "{childName} can focus." },
        teach: { text: "Discuss that hunger is real and manageable.", consequence: "They're grounded." },
        boundary: { text: "Their body matters.", consequence: "They're protected." },
        avoid: { text: "Ignore their hunger.", consequence: "{childName} internalizes that needs don't matter." },
        harm: { text: "Tell them to just work through hunger.", consequence: "{childName} internalizes that their body doesn't matter." }
      }
    },
    5: {
      title: "Eating Less So Others Can Eat",
      topic: "Sacrifice awareness",
      scene: "{childName} is 5-6. Noticing parent rations food.",
      choices: {
        connect: { text: "Feed them enough without guilt.", consequence: "{childName} feels loved." },
        teach: { text: "Discuss family sharing.", consequence: "They're grounded." },
        boundary: { text: "They shouldn't sacrifice childhood.", consequence: "They're protected." },
        avoid: { text: "Make them feel guilty for eating.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them their eating hurts family.", consequence: "{childName} internalizes guilt and shame." }
      }
    },
    6: {
      title: "Identity: Hungry Child",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value beyond hunger.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that hunger is circumstance.", consequence: "They understand." },
        boundary: { text: "Hunger doesn't define them.", consequence: "They're secure." },
        avoid: { text: "Make hunger their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're hungry because they're less.", consequence: "{childName} internalizes that poverty = worth." }
      }
    },
    7: {
      title: "Food Bank and Assistance Programs",
      topic: "Aid navigation",
      scene: "{childName} is 7. Helping access food assistance.",
      choices: {
        connect: { text: "Frame assistance as support.", consequence: "{childName} is grateful." },
        teach: { text: "Teach gratitude for resources.", consequence: "They're appreciative." },
        boundary: { text: "Getting help is normal.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed of aid.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'this is all we deserve.'", consequence: "{childName} internalizes that they're less." }
      }
    },
    8: {
      title: "Peer Relationships: Different Lunches",
      topic: "Social comparison",
      scene: "{childName} is 8. Peers have different food.",
      choices: {
        connect: { text: "Help them feel okay about their food.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that all food feeds.", consequence: "They're grounded." },
        boundary: { text: "Their food is enough.", consequence: "They're secure." },
        avoid: { text: "Make them embarrassed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them their food is inferior.", consequence: "{childName} internalizes that poverty = less." }
      }
    },
    9: {
      title: "Learning to Cook Cheap: Family Contribution",
      topic: "Skill development",
      scene: "{childName} is 9. Helping make food stretch.",
      choices: {
        connect: { text: "Make it bonding and skill-building.", consequence: "{childName} feels capable." },
        teach: { text: "Teach them nutrition and budgeting.", consequence: "They're knowledgeable." },
        boundary: { text: "Cooking is a skill.", consequence: "They're proud." },
        avoid: { text: "Make cooking feel like burden.", consequence: "{childName} internalizes resentment." },
        harm: { text: "Tell them they must cook or family starves.", consequence: "{childName} internalizes guilt." }
      }
    },
    10: {
      title: "Escape Fantasy: Unlimited Food",
      topic: "Longing and hope",
      scene: "{childName} is 10. Dreaming of eating whenever hungry.",
      choices: {
        connect: { text: "Validate their dreams.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss paths to food security.", consequence: "They're hopeful." },
        boundary: { text: "Food security is possible.", consequence: "They're secure." },
        avoid: { text: "Dismiss their dreams.", consequence: "{childName} loses hope." },
        harm: { text: "Tell them they'll always be hungry.", consequence: "{childName} internalizes despair." }
      }
    },
    11: {
      title: "Adolescence: Growing Hunger Needs",
      topic: "Teenage appetite reality",
      scene: "{childName} is 11. Teen body needs more food.",
      choices: {
        connect: { text: "Try to meet their growing needs.", consequence: "{childName} feels loved." },
        teach: { text: "Discuss nutrition and growth.", consequence: "They're grounded." },
        boundary: { text: "Their body's needs are valid.", consequence: "They're protected." },
        avoid: { text: "Tell them not to eat so much.", consequence: "{childName} internalizes food shame." },
        harm: { text: "Tell them their appetite is burden.", consequence: "{childName} internalizes guilt." }
      }
    },
    12: {
      title: "Dating & Relationships: Where to Eat?",
      topic: "Romantic shame",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them navigate dating.", consequence: "They navigate." },
        boundary: { text: "Food insecurity doesn't disqualify them.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will date them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they'll embarrass potential dates.", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Working to Help Feed Family",
      topic: "Economic pressure",
      scene: "{childName} is 13. Income helps buy food.",
      choices: {
        connect: { text: "Balance school and work.", consequence: "{childName} manages." },
        teach: { text: "Help them protect their education.", consequence: "They're strategic." },
        boundary: { text: "They deserve education.", consequence: "They're protected." },
        avoid: { text: "Pull them from school.", consequence: "{childName} loses literacy." },
        harm: { text: "Tell them food is more important than school.", consequence: "{childName} internalizes that survival = all." }
      }
    },
    14: {
      title: "Food Becomes More Stable: Relief",
      topic: "Basic need met",
      scene: "{childName} is 14. More reliable food access.",
      choices: {
        connect: { text: "Celebrate this stability.", consequence: "{childName} feels secure." },
        teach: { text: "Help them adjust to predictable meals.", consequence: "They're grounded." },
        boundary: { text: "Stability is good.", consequence: "They're secure." },
        avoid: { text: "Make them fear losing food again.", consequence: "{childName} internalizes food anxiety." },
        harm: { text: "Tell them to not get used to it.", consequence: "{childName} internalizes hypervigilance." }
      }
    },
    15: {
      title: "College Planning: Different Opportunities",
      topic: "Educational possibility",
      scene: "{childName} is 15. Stability allows planning.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss paths forward.", consequence: "They're informed." },
        boundary: { text: "Future is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them food insecurity blocks them.", consequence: "{childName} internalizes past as permanent." },
        harm: { text: "Tell them they don't deserve opportunity.", consequence: "{childName} suppresses ambition." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Food",
      topic: "Love amid stability",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them be comfortable with meals.", consequence: "They're present." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make food a point of insecurity.", consequence: "{childName} loses confidence." },
        harm: { text: "Tell them partner will judge their past.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Understanding Family's Survival: How They Fed Them",
      topic: "Parental sacrifice",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share family's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss sacrifice and love.", consequence: "They're proud." },
        boundary: { text: "Their story is powerful.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them they were burden.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Building Food Security Future",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about building security.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} might resent." },
        harm: { text: "Tell them food insecurity will return.", consequence: "{childName} internalizes hypervigilance." }
      }
    }
  },

  repression_surveillance: {
    1: {
      title: "Born Into Surveillance State",
      topic: "Political oppression",
      scene: "{childName} is born in country with repressive government.",
      choices: {
        connect: { text: "Love them fully amid fear.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand their world safely.", consequence: "They're grounded." },
        boundary: { text: "They're a child in difficult times.", consequence: "They're innocent." },
        avoid: { text: "Pass adult fear to them.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them 'government will come for us.'", consequence: "{childName} internalizes paranoia." }
      }
    },
    2: {
      title: "Constant Monitoring: Government Presence",
      topic: "Loss of privacy",
      scene: "{childName} is 2-3. Aware of government surveillance.",
      choices: {
        connect: { text: "Create safety within monitoring.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand caution.", consequence: "They're grounded." },
        boundary: { text: "Privacy is important.", consequence: "They're secure." },
        avoid: { text: "Make them paranoid.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them 'no one is safe.'", consequence: "{childName} internalizes permanent fear." }
      }
    },
    3: {
      title: "Controlled Messaging: What They Learn",
      topic: "Information control",
      scene: "{childName} is 3-4. Learning government-controlled narrative.",
      choices: {
        connect: { text: "Plant seeds of critical thinking.", consequence: "{childName} questions safely." },
        teach: { text: "Help them understand nuance.", consequence: "They think carefully." },
        boundary: { text: "Truth exists beyond propaganda.", consequence: "They're grounded." },
        avoid: { text: "Accept propaganda fully.", consequence: "{childName} internalizes misinformation." },
        harm: { text: "Tell them questioning is dangerous.", consequence: "{childName} suppresses thought." }
      }
    },
    4: {
      title: "School: Government Indoctrination",
      topic: "Educational control",
      scene: "{childName} is in school. Curriculum is politically controlled.",
      choices: {
        connect: { text: "Encourage careful thinking.", consequence: "{childName} thinks critically." },
        teach: { text: "Help them question respectfully.", consequence: "They're thoughtful." },
        boundary: { text: "Truth-seeking is important.", consequence: "They're empowered." },
        avoid: { text: "Force them into ideology.", consequence: "{childName} internalizes propaganda." },
        harm: { text: "Tell them doubt is evil.", consequence: "{childName} suppresses thought." }
      }
    },
    5: {
      title: "Fear of Saying Wrong Thing",
      topic: "Self-censorship begins",
      scene: "{childName} is 5-6. Learning to watch what they say.",
      choices: {
        connect: { text: "Help them navigate safely.", consequence: "{childName} is smart." },
        teach: { text: "Discuss careful speech.", consequence: "They're grounded." },
        boundary: { text: "Their thoughts are theirs.", consequence: "They're secure." },
        avoid: { text: "Make them terrified of speaking.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them honest thoughts are dangerous.", consequence: "{childName} loses voice." }
      }
    },
    6: {
      title: "Identity: Citizen of Repressive State",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their inner self.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that identity is internal.", consequence: "They develop self." },
        boundary: { text: "Their true self belongs to them.", consequence: "They're secure." },
        avoid: { text: "Make state identity their only one.", consequence: "{childName} loses self." },
        harm: { text: "Tell them their self is dangerous.", consequence: "{childName} suppresses self." }
      }
    },
    7: {
      title: "Reporting Culture: Family Can't Be Trusted",
      topic: "Relationship trauma",
      scene: "{childName} is 7. Learning even family might report.",
      choices: {
        connect: { text: "Protect family bonds.", consequence: "{childName} feels loved." },
        teach: { text: "Help them be careful but still trust.", consequence: "They're grounded." },
        boundary: { text: "Some trust is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them no one is trustworthy.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them everyone will betray them.", consequence: "{childName} internalizes permanent distrust." }
      }
    },
    8: {
      title: "Peer Relationships: Who Can They Trust?",
      topic: "Social caution",
      scene: "{childName} is 8. Afraid to share with peers.",
      choices: {
        connect: { text: "Help them find safe peers.", consequence: "{childName} has friends." },
        teach: { text: "Discuss selective trust.", consequence: "They navigate carefully." },
        boundary: { text: "Friendship is possible.", consequence: "They're secure." },
        avoid: { text: "Make them isolate.", consequence: "{childName} becomes lonely." },
        harm: { text: "Tell them all peers are spies.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Escape Fantasy: Freedom in Another Country",
      topic: "Forbidden dreams",
      scene: "{childName} is 9. Dreaming of escape.",
      choices: {
        connect: { text: "Validate their dreams safely.", consequence: "{childName} has hope." },
        teach: { text: "Discuss possibilities carefully.", consequence: "They're grounded." },
        boundary: { text: "Hope is important.", consequence: "They're secure." },
        avoid: { text: "Tell them escape is impossible.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them escape means death.", consequence: "{childName} internalizes terror." }
      }
    },
    10: {
      title: "Secret Knowledge: What's Really Happening",
      topic: "Hidden truth-seeking",
      scene: "{childName} is 10. Learning real information in secret.",
      choices: {
        connect: { text: "Help them process real truth.", consequence: "{childName} understands reality." },
        teach: { text: "Discuss careful knowledge-seeking.", consequence: "They're thoughtful." },
        boundary: { text: "Truth matters.", consequence: "They're empowered." },
        avoid: { text: "Tell them to stay ignorant.", consequence: "{childName} internalizes that truth = danger." },
        harm: { text: "Tell them truth-seeking will get them killed.", consequence: "{childName} internalizes terror." }
      }
    },
    11: {
      title: "Adolescence: Realizing the Full Scope",
      topic: "Political awareness",
      scene: "{childName} is 11. Understanding how bad repression is.",
      choices: {
        connect: { text: "Support their awakening.", consequence: "{childName} develops consciousness." },
        teach: { text: "Help them process reality.", consequence: "They're grounded." },
        boundary: { text: "Understanding is important.", consequence: "They're empowered." },
        avoid: { text: "Tell them to stop questioning.", consequence: "{childName} suppresses growth." },
        harm: { text: "Tell them they're powerless.", consequence: "{childName} internalizes helplessness." }
      }
    },
    12: {
      title: "Dating & Relationships: Impossible Privacy",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them navigate surveillance.", consequence: "They navigate carefully." },
        boundary: { text: "Their relationships are valid.", consequence: "They're worthy." },
        avoid: { text: "Tell them dating is forbidden.", consequence: "{childName} suppresses development." },
        harm: { text: "Tell them relationships will get them in trouble.", consequence: "{childName} internalizes fear." }
      }
    },
    13: {
      title: "Political Underground: Meeting Resisters",
      topic: "Covert community",
      scene: "{childName} is 13. Learning of underground resistance.",
      choices: {
        connect: { text: "Support their awakening.", consequence: "{childName} finds community." },
        teach: { text: "Discuss risks and ethics.", consequence: "They're thoughtful." },
        boundary: { text: "Resistance is possible.", consequence: "They're empowered." },
        avoid: { text: "Push them into danger.", consequence: "{childName} becomes exposed." },
        harm: { text: "Tell them resistance is futile.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    14: {
      title: "Choices: Conform or Resist",
      topic: "Moral fork in road",
      scene: "{childName} is 14. Understanding they have choices.",
      choices: {
        connect: { text: "Support their autonomy.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss consequences carefully.", consequence: "They're informed." },
        boundary: { text: "Their choice matters.", consequence: "They're secure." },
        avoid: { text: "Tell them to conform.", consequence: "{childName} loses self." },
        harm: { text: "Tell them resistance is suicide.", consequence: "{childName} internalizes fear." }
      }
    },
    15: {
      title: "College Planning: Approved Education Only",
      topic: "Educational limitation",
      scene: "{childName} is 15. Higher education is controlled.",
      choices: {
        connect: { text: "Help them find genuine learning.", consequence: "{childName} is educated." },
        teach: { text: "Discuss critical thinking within limits.", consequence: "They're informed." },
        boundary: { text: "Real education is possible.", consequence: "They're secure." },
        avoid: { text: "Let propaganda be their education.", consequence: "{childName} internalizes misinformation." },
        harm: { text: "Tell them education is indoctrination.", consequence: "{childName} rejects learning." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Exposure",
      topic: "Love amid danger",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them navigate surveillance together.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Use partner against them.", consequence: "{childName} loses love." },
        harm: { text: "Tell them partner will betray them.", consequence: "{childName} internalizes distrust." }
      }
    },
    17: {
      title: "Understanding the System: Why Repression?",
      topic: "Political analysis",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share analysis honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss how systems of control work.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding is important.", consequence: "They're empowered." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them system is unchangeable.", consequence: "{childName} internalizes despair." }
      }
    },
    18: {
      title: "Adult Choice: Stay and Resist or Leave?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about resistance and survival.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} might resent." },
        harm: { text: "Tell them leaving is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    }
  },

  incarcerated_parent: {
    1: {
      title: "Born While Parent Incarcerated",
      topic: "Parental absence",
      scene: "{childName} is born. Parent is in prison.",
      choices: {
        connect: { text: "Love them fully despite parent's absence.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand their situation.", consequence: "They're grounded." },
        boundary: { text: "They're not responsible for parent.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like shame.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'parent abandoned us.'", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    2: {
      title: "Prison Visits: Meeting Incarcerated Parent",
      topic: "Visitation trauma",
      scene: "{childName} is 2-3. Visiting parent in prison.",
      choices: {
        connect: { text: "Make visits safe and loving.", consequence: "{childName} sees parent." },
        teach: { text: "Help them understand prison.", consequence: "They grasp it." },
        boundary: { text: "Parent's incarceration isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Make visits terrifying.", consequence: "{childName} internalizes fear of prison." },
        harm: { text: "Tell them 'parent is monster.'", consequence: "{childName} internalizes parent shame." }
      }
    },
    3: {
      title: "Missing Parent: The Absence",
      topic: "Grief and loss",
      scene: "{childName} is 3-4. Feeling parent's absence acutely.",
      choices: {
        connect: { text: "Acknowledge their grief.", consequence: "{childName} grieves healthily." },
        teach: { text: "Help them understand incarceration.", consequence: "They grasp reality." },
        boundary: { text: "Parent's love still exists.", consequence: "They're secure." },
        avoid: { text: "Deny their grief.", consequence: "{childName} internalizes unprocessed loss." },
        harm: { text: "Tell them parent doesn't love them.", consequence: "{childName} internalizes abandonment." }
      }
    },
    4: {
      title: "School: Explaining Missing Parent",
      topic: "Social explanation",
      scene: "{childName} is in school. Teachers notice missing parent.",
      choices: {
        connect: { text: "Help them explain calmly.", consequence: "{childName} is secure." },
        teach: { text: "Develop honest explanation.", consequence: "They navigate." },
        boundary: { text: "They're not responsible for adult system.", consequence: "They're protected." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Limited Communication: Letters or Calls",
      topic: "Connection maintenance",
      scene: "{childName} is 5-6. Limited contact with parent.",
      choices: {
        connect: { text: "Facilitate every communication.", consequence: "{childName} stays connected." },
        teach: { text: "Help them write letters.", consequence: "They maintain bond." },
        boundary: { text: "Connection is important.", consequence: "They're secure." },
        avoid: { text: "Block communication.", consequence: "{childName} feels abandoned." },
        harm: { text: "Tell them parent doesn't care.", consequence: "{childName} internalizes abandonment." }
      }
    },
    6: {
      title: "Identity: Child of Incarcerated Parent",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their identity beyond parent's crime.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're not responsible.", consequence: "They understand." },
        boundary: { text: "They're not defined by parent's choices.", consequence: "They're secure." },
        avoid: { text: "Make them feel responsible.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them they're like parent.", consequence: "{childName} internalizes that they're bad." }
      }
    },
    7: {
      title: "Economic Impact: Single Income or Welfare",
      topic: "Financial strain",
      scene: "{childName} is 7. Family struggles economically.",
      choices: {
        connect: { text: "Provide stability despite hardship.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand economics.", consequence: "They're grounded." },
        boundary: { text: "Economic struggle isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Tell them they're burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent caused this poverty.", consequence: "{childName} internalizes resentment." }
      }
    },
    8: {
      title: "Peer Relationships: Keeping Secret",
      topic: "Social concealment",
      scene: "{childName} is 8. Hiding parent's incarceration.",
      choices: {
        connect: { text: "Let them share truth selectively.", consequence: "{childName} is authentic." },
        teach: { text: "Discuss selective disclosure.", consequence: "They navigate." },
        boundary: { text: "Their story is theirs to tell.", consequence: "They're empowered." },
        avoid: { text: "Force them to lie.", consequence: "{childName} internalizes dishonesty." },
        harm: { text: "Tell them they can't tell anyone.", consequence: "{childName} becomes secretive and isolated." }
      }
    },
    9: {
      title: "Parent's Release: Hope and Anxiety",
      topic: "Anticipation of reunion",
      scene: "{childName} is 9. Parent's release date is coming.",
      choices: {
        connect: { text: "Help them prepare for reunion.", consequence: "{childName} is hopeful." },
        teach: { text: "Discuss that reunion takes adjustment.", consequence: "They're grounded." },
        boundary: { text: "Reunion is complex.", consequence: "They're secure." },
        avoid: { text: "Build unrealistic expectations.", consequence: "{childName} will be disappointed." },
        harm: { text: "Tell them parent will fail them again.", consequence: "{childName} internalizes fear." }
      }
    },
    10: {
      title: "Parent Returns: Stranger in Home",
      topic: "Reunion reality",
      scene: "{childName} is 10. Parent is released and comes home.",
      choices: {
        connect: { text: "Support gradual reconnection.", consequence: "{childName} bonds slowly." },
        teach: { text: "Help them adjust to parent.", consequence: "They reconnect." },
        boundary: { text: "Bonding takes time.", consequence: "They're secure." },
        avoid: { text: "Force immediate perfect relationship.", consequence: "{childName} feels pressured." },
        harm: { text: "Tell them parent is still criminal.", consequence: "{childName} rejects parent." }
      }
    },
    11: {
      title: "Adolescence: Processing All of It",
      topic: "Complex emotions",
      scene: "{childName} is 11. Old enough to understand fully.",
      choices: {
        connect: { text: "Support their processing.", consequence: "{childName} heals." },
        teach: { text: "Help them understand crime doesn't define.", consequence: "They're thoughtful." },
        boundary: { text: "Understanding is healing.", consequence: "They're secure." },
        avoid: { text: "Tell them to forget.", consequence: "{childName} internalizes unprocessed feelings." },
        harm: { text: "Tell them they should hate parent.", consequence: "{childName} internalizes anger." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Family",
      topic: "Romantic honesty",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about disclosure.", consequence: "They navigate." },
        boundary: { text: "Their family is valid.", consequence: "They're worthy." },
        avoid: { text: "Tell them no one will accept them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will judge them.", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Parental Re-Offense Risk or Stable Recovery",
      topic: "Future uncertainty",
      scene: "{childName} is 13. Wondering if parent will stay out.",
      choices: {
        connect: { text: "Be honest about recovery.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that recovery is possible.", consequence: "They're hopeful." },
        boundary: { text: "Change is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them parent will reoffend.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them parent is beyond help.", consequence: "{childName} internalizes despair." }
      }
    },
    14: {
      title: "Repairing Relationship: Parent Makes Effort",
      topic: "Reconciliation possibility",
      scene: "{childName} is 14. Parent works to rebuild trust.",
      choices: {
        connect: { text: "Support reconciliation process.", consequence: "{childName} heals." },
        teach: { text: "Help them rebuild cautiously.", consequence: "They're thoughtful." },
        boundary: { text: "Healing takes time.", consequence: "They're secure." },
        avoid: { text: "Force immediate forgiveness.", consequence: "{childName} feels pressured." },
        harm: { text: "Tell them to never trust parent.", consequence: "{childName} internalizes permanent distrust." }
      }
    },
    15: {
      title: "College Planning: New Opportunities",
      topic: "Educational future",
      scene: "{childName} is 15. Planning education.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss that family history doesn't limit them.", consequence: "They're hopeful." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them family history will haunt them.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they don't deserve opportunity.", consequence: "{childName} suppresses ambition." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Family",
      topic: "Love amid complexity",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them navigate family story.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make family history toxic in relationship.", consequence: "{childName} loses love." },
        harm: { text: "Tell them partner will leave when they know.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Understanding Parent: Why Crime? Rehabilitation?",
      topic: "Parental truth",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share parent's story honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss crime, punishment, and change.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding doesn't mean excusing.", consequence: "They're grounded." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is irredeemable.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    18: {
      title: "Adult Choice: Building Relationship or Distance?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their relationship with parent.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about family and redemption.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they owe parent.", consequence: "{childName} might resent." },
        harm: { text: "Tell them family bonds are broken forever.", consequence: "{childName} internalizes permanent loss." }
      }
    }
  }
};