
export const SPECIAL_START_YEARLY_BEATS__TABOO_02 = {
  taboo_gambling_debt: {
    1: {
      title: "Born Into Financial Chaos",
      topic: "Parental addiction",
      scene: "{childName} is born. Parent struggles with gambling addiction.",
      choices: {
        connect: { text: "Love them fully despite financial stress.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel secure.", consequence: "They're grounded." },
        boundary: { text: "Parent's addiction isn't their fault.", consequence: "They're innocent." },
        avoid: { text: "Let financial stress overwhelm them.", consequence: "{childName} internalizes financial anxiety." },
        harm: { text: "Tell them parent is weak.", consequence: "{childName} internalizes parent judgment." }
      }
    },
    2: {
      title: "Unpredictable Finances: Money Appears and Disappears",
      topic: "Financial instability",
      scene: "{childName} is 2-3. Money fluctuates wildly.",
      choices: {
        connect: { text: "Create stability within chaos.", consequence: "{childName} feels somewhat secure." },
        teach: { text: "Help them understand finances are complicated.", consequence: "They grasp it." },
        boundary: { text: "Financial stress isn't their burden.", consequence: "They're protected." },
        avoid: { text: "Make them aware of every financial problem.", consequence: "{childName} internalizes financial anxiety." },
        harm: { text: "Tell them they're expensive.", consequence: "{childName} internalizes guilt." }
      }
    },
    3: {
      title: "Creditor Calls: Unsettling Phone Conversations",
      topic: "Debt collection pressure",
      scene: "{childName} is 3-4. Hearing stressful phone calls.",
      choices: {
        connect: { text: "Protect them from worst stress.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand without frightening them.", consequence: "They're grounded." },
        boundary: { text: "Adult financial problems aren't their responsibility.", consequence: "They're protected." },
        avoid: { text: "Make them listen to calls.", consequence: "{childName} internalizes financial trauma." },
        harm: { text: "Tell them everyone is angry at family.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "School: Explaining Gaps in Resources",
      topic: "Social class visibility",
      scene: "{childName} is in school. Can't afford things peers have.",
      choices: {
        connect: { text: "Help them navigate with dignity.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that finances vary.", consequence: "They understand." },
        boundary: { text: "Money doesn't determine worth.", consequence: "They're secure." },
        avoid: { text: "Make them ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're less than peers.", consequence: "{childName} internalizes inadequacy." }
      }
    },
    5: {
      title: "Eviction Threats: Unstable Housing",
      topic: "Shelter insecurity",
      scene: "{childName} is 5-6. Hearing about potential homelessness.",
      choices: {
        connect: { text: "Reassure them about home.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand adult problems.", consequence: "They're grounded." },
        boundary: { text: "Housing security is parent's responsibility.", consequence: "They're protected." },
        avoid: { text: "Make them terrified of homelessness.", consequence: "{childName} internalizes housing anxiety." },
        harm: { text: "Tell them family might lose home.", consequence: "{childName} internalizes existential dread." }
      }
    },
    6: {
      title: "Identity: Child of Financial Crisis",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they in this situation?",
      choices: {
        connect: { text: "Affirm their value.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that finances don't define worth.", consequence: "They understand." },
        boundary: { text: "They're more than financial circumstances.", consequence: "They're secure." },
        avoid: { text: "Make financial struggle their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're burden.", consequence: "{childName} internalizes guilt." }
      }
    },
    7: {
      title: "Parent's Mood Swings: Connected to Gambling",
      topic: "Parental emotional instability",
      scene: "{childName} is 7. Parent's mood depends on gambling outcomes.",
      choices: {
        connect: { text: "Create emotional consistency with them.", consequence: "{childName} feels stable." },
        teach: { text: "Help them understand parent's struggles.", consequence: "They grasp it." },
        boundary: { text: "Parent's moods aren't their fault.", consequence: "They're protected." },
        avoid: { text: "Make them responsible for parent's mood.", consequence: "{childName} internalizes emotional labor." },
        harm: { text: "Tell them parent is unstable.", consequence: "{childName} internalizes that love = volatile." }
      }
    },
    8: {
      title: "Peer Relationships: Hiding Financial Reality",
      topic: "Social concealment",
      scene: "{childName} is 8. Hiding financial situation from friends.",
      choices: {
        connect: { text: "Help them have authentic friendships.", consequence: "{childName} has real friends." },
        teach: { text: "Discuss selective disclosure.", consequence: "They navigate." },
        boundary: { text: "Their story is theirs to share.", consequence: "They're protected." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "Debt Collection Threats: Escalating Pressure",
      topic: "Legal consequences visible",
      scene: "{childName} is 9. Seeing escalation of debt problems.",
      choices: {
        connect: { text: "Reassure them about legal protection.", consequence: "{childName} feels safe." },
        teach: { text: "Age-appropriately explain situation.", consequence: "They understand." },
        boundary: { text: "Legal issues are parent's to handle.", consequence: "They're protected." },
        avoid: { text: "Make them terrified of consequences.", consequence: "{childName} internalizes legal anxiety." },
        harm: { text: "Tell them family will be ruined.", consequence: "{childName} internalizes despair." }
      }
    },
    10: {
      title: "Accessing Help: Recovery Possibility",
      topic: "Hope for healing",
      scene: "{childName} is 10. Parent seeking help for gambling.",
      choices: {
        connect: { text: "Support parent's recovery.", consequence: "{childName} feels hope." },
        teach: { text: "Help them understand recovery is possible.", consequence: "They believe." },
        boundary: { text: "Parent's recovery is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them recovery won't work.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Tell them parent will relapse.", consequence: "{childName} internalizes despair." }
      }
    },
    11: {
      title: "Adolescence: Understanding Addiction",
      topic: "Complex comprehension",
      scene: "{childName} is 11. Old enough to understand addiction.",
      choices: {
        connect: { text: "Support their understanding.", consequence: "{childName} processes reality." },
        teach: { text: "Help them understand addiction isn't weakness.", consequence: "They grasp it." },
        boundary: { text: "Understanding brings compassion.", consequence: "They're secure." },
        avoid: { text: "Tell them parent is weak.", consequence: "{childName} internalizes parent judgment." },
        harm: { text: "Tell them they caused parent's addiction.", consequence: "{childName} internalizes guilt." }
      }
    },
    12: {
      title: "Dating & Relationships: Trust Issues",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them develop healthy trust.", consequence: "They learn." },
        boundary: { text: "Healthy relationships are possible.", consequence: "They're worthy." },
        avoid: { text: "Tell them relationships are unreliable.", consequence: "{childName} internalizes distrust." },
        harm: { text: "Tell them they'll repeat parent's pattern.", consequence: "{childName} internalizes fatalism." }
      }
    },
    13: {
      title: "Relapse Fear: Setback in Recovery",
      topic: "Hope fragility",
      scene: "{childName} is 13. Parent struggles in recovery.",
      choices: {
        connect: { text: "Support through uncertainty.", consequence: "{childName} feels held." },
        teach: { text: "Help them understand setbacks are part of recovery.", consequence: "They're grounded." },
        boundary: { text: "Recovery is nonlinear.", consequence: "They're secure." },
        avoid: { text: "Tell them recovery failed.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Tell them parent will always be addict.", consequence: "{childName} internalizes despair." }
      }
    },
    14: {
      title: "Financial Stability Improving: New Normal",
      topic: "Healing progress",
      scene: "{childName} is 14. Family finances stabilizing.",
      choices: {
        connect: { text: "Celebrate improvement.", consequence: "{childName} feels hopeful." },
        teach: { text: "Help them recognize family progress.", consequence: "{childName} is proud." },
        boundary: { text: "Improvement is real.", consequence: "They're secure." },
        avoid: { text: "Wait for relapse.", consequence: "{childName} internalizes hypervigilance." },
        harm: { text: "Tell them stability won't last.", consequence: "{childName} internalizes fear." }
      }
    },
    15: {
      title: "College Planning: Stable Family Foundation",
      topic: "Future possibility",
      scene: "{childName} is 15. Planning education.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them build independent future.", consequence: "They're strategic." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them family problems limit them.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're destined to struggle.", consequence: "{childName} suppresses ambition." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Family Health",
      topic: "Love with healthy family",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them share family journey.", consequence: "They communicate." },
        boundary: { text: "Their family is healing.", consequence: "They're worthy." },
        avoid: { text: "Make them hide family history.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them partner will judge them.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    17: {
      title: "Understanding Parent: Journey From Addiction to Recovery",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand fully.",
      choices: {
        connect: { text: "Share parent's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss strength in recovery.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding brings compassion.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is irredeemable.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Building Life Beyond Crisis",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about breaking cycles.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay close.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they're destined to repeat.", consequence: "{childName} internalizes hopelessness." }
      }
    }
  },

  taboo_nightlife_hostess: {
    1: {
      title: "Born to Parent Working Nights",
      topic: "Non-traditional schedule",
      scene: "{childName} is born. Parent works in nightlife industry.",
      choices: {
        connect: { text: "Love them fully despite schedule.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're grounded." },
        boundary: { text: "Parent's work doesn't define them.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent is irresponsible.", consequence: "{childName} internalizes parent judgment." }
      }
    },
    2: {
      title: "Reversed Schedule: Parent Sleeps During Day",
      topic: "Lifestyle adjustment",
      scene: "{childName} is 2-3. Learning parent's sleep schedule.",
      choices: {
        connect: { text: "Create structured routine.", consequence: "{childName} adapts." },
        teach: { text: "Help them understand different schedules exist.", consequence: "They grasp it." },
        boundary: { text: "Different schedules are okay.", consequence: "They're secure." },
        avoid: { text: "Make them feel like they're inconvenience.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent doesn't care about them.", consequence: "{childName} internalizes abandonment." }
      }
    },
    3: {
      title: "Daycare and Caregiver Dependency",
      topic: "Parental availability",
      scene: "{childName} is 3-4. Significant time with other caregivers.",
      choices: {
        connect: { text: "Create secure attachments with all caregivers.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand parent works.", consequence: "They grasp it." },
        boundary: { text: "Multiple caregivers can love them.", consequence: "They're secure." },
        avoid: { text: "Make them feel parent doesn't care.", consequence: "{childName} internalizes abandonment." },
        harm: { text: "Tell them parent chooses work over them.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    4: {
      title: "School: Explaining Parent's Schedule",
      topic: "Social explanation",
      scene: "{childName} is in school. Explaining why parent works nights.",
      choices: {
        connect: { text: "Help them develop honest answer.", consequence: "{childName} navigates." },
        teach: { text: "Discuss that people have different schedules.", consequence: "They understand." },
        boundary: { text: "Different jobs are normal.", consequence: "They're protected." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them parent's job is bad.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Parent's Appearance and Presentation",
      topic: "Self-presentation",
      scene: "{childName} is 5-6. Noticing parent dresses differently for work.",
      choices: {
        connect: { text: "Help them understand context-appropriate presentation.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that people present differently in different contexts.", consequence: "They understand." },
        boundary: { text: "Different presentations are normal.", consequence: "They're secure." },
        avoid: { text: "Make them uncomfortable with parent's appearance.", consequence: "{childName} internalizes shame about parent." },
        harm: { text: "Tell them parent is being fake.", consequence: "{childName} internalizes distrust." }
      }
    },
    6: {
      title: "Identity: Who Is Parent?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Understanding parent has different personas.",
      choices: {
        connect: { text: "Help them see parent is whole person.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that people are multifaceted.", consequence: "They understand." },
        boundary: { text: "Parent is one person in different contexts.", consequence: "They're secure." },
        avoid: { text: "Make parent seem like stranger.", consequence: "{childName} internalizes that parent is deceiver." },
        harm: { text: "Tell them parent is fake.", consequence: "{childName} internalizes distrust." }
      }
    },
    7: {
      title: "Sleep and Homework: Parental Involvement Challenges",
      topic: "Availability gaps",
      scene: "{childName} is 7. Parent unavailable for evening homework.",
      choices: {
        connect: { text: "Find alternative homework support.", consequence: "{childName} gets help." },
        teach: { text: "Help them understand parent's schedule.", consequence: "They grasp it." },
        boundary: { text: "Homework can get support from others.", consequence: "They're secure." },
        avoid: { text: "Make them feel abandoned.", consequence: "{childName} internalizes that parent doesn't care." },
        harm: { text: "Tell them parent chooses work over education.", consequence: "{childName} internalizes resentment." }
      }
    },
    8: {
      title: "Peer Relationships: Explaining Parent's Work",
      topic: "Social navigation",
      scene: "{childName} is 8. Peers ask what parent does.",
      choices: {
        connect: { text: "Help them develop answer.", consequence: "{childName} navigates." },
        teach: { text: "Discuss selective disclosure.", consequence: "They learn." },
        boundary: { text: "It's okay not to explain everything.", consequence: "They're protected." },
        avoid: { text: "Make them feel caught.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they should be ashamed.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Growing Up: Understanding Industry Better",
      topic: "Increased awareness",
      scene: "{childName} is 9. Learning more about nightlife industry.",
      choices: {
        connect: { text: "Answer questions honestly.", consequence: "{childName} understands." },
        teach: { text: "Help them understand work is work.", consequence: "They're grounded." },
        boundary: { text: "Different jobs are valid.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed of parent.", consequence: "{childName} internalizes parent judgment." },
        harm: { text: "Tell them parent's job is shameful.", consequence: "{childName} internalizes judgment." }
      }
    },
    10: {
      title: "Finding Out About Parent's Income",
      topic: "Financial reality",
      scene: "{childName} is 10. Noticing parent's income is high.",
      choices: {
        connect: { text: "Help them understand work provides.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that different work has different pay.", consequence: "They understand." },
        boundary: { text: "Parent's sacrifice is real.", consequence: "They're secure." },
        avoid: { text: "Make them feel guilty about benefits.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them money is dirty.", consequence: "{childName} internalizes that support = wrong." }
      }
    },
    11: {
      title: "Adolescence: Processing Parent's Work",
      topic: "Teen awareness",
      scene: "{childName} is 11. Developing own opinions.",
      choices: {
        connect: { text: "Allow their processing.", consequence: "{childName} develops values." },
        teach: { text: "Help them think critically.", consequence: "They develop nuance." },
        boundary: { text: "Complex feelings are okay.", consequence: "They're secure." },
        avoid: { text: "Tell them what to think.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them they should judge parent.", consequence: "{childName} internalizes conflict." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Parent's Work",
      topic: "Romantic disclosure",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about sharing.", consequence: "They navigate." },
        boundary: { text: "It's their choice what to share.", consequence: "They're empowered." },
        avoid: { text: "Tell them to hide parent.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them no one will accept them.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    13: {
      title: "Safety and Boundaries: Parent Protects Their Privacy",
      topic: "Parental responsibility",
      scene: "{childName} is 13. Parent ensures work doesn't affect them.",
      choices: {
        connect: { text: "Respect parent's boundaries.", consequence: "{childName} feels protected." },
        teach: { text: "Understand parent is separating.", consequence: "They grasp it." },
        boundary: { text: "Parent is protecting them.", consequence: "They're secure." },
        avoid: { text: "Make them feel isolated.", consequence: "{childName} internalizes secrets." },
        harm: { text: "Tell them parent is hiding shameful things.", consequence: "{childName} internalizes parent shame." }
      }
    },
    14: {
      title: "Peer Knowledge: Friends May Know About Parent",
      topic: "Social integration",
      scene: "{childName} is 14. Friends may know about parent's work.",
      choices: {
        connect: { text: "Support them navigating peer knowledge.", consequence: "{childName} manages it." },
        teach: { text: "Help them discuss with friends.", consequence: "They navigate." },
        boundary: { text: "Friends' reactions don't define parent.", consequence: "They're secure." },
        avoid: { text: "Make them feel permanently exposed.", consequence: "{childName} internalizes hypervigilance." },
        harm: { text: "Tell them friends will judge them.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "College Planning: Building Independent Future",
      topic: "Educational goals",
      scene: "{childName} is 15. Planning education.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them build their own identity.", consequence: "They develop." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them parent's work limits them.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're marked by parent.", consequence: "{childName} internalizes fatalism." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Family Reality",
      topic: "Love and honesty",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them decide about sharing.", consequence: "They navigate." },
        boundary: { text: "Their choice what to share.", consequence: "They're empowered." },
        avoid: { text: "Make them hide truth.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them partner will judge them.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    17: {
      title: "Understanding Parent: Complexity and Choice",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share parent's perspective.", consequence: "{childName} understands." },
        teach: { text: "Discuss nuance without judgment.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding brings compassion.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is immoral.", consequence: "{childName} internalizes judgment." }
      }
    },
    18: {
      title: "Adult Choice: Own Values and Judgment",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their values.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom without pressure.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them to judge parent.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they must repeat parent's path.", consequence: "{childName} internalizes fatalism." }
      }
    }
  },

  taboo_fleeing_cult: {
    1: {
      title: "Born Into Closed Community",
      topic: "Controlled environment",
      scene: "{childName} is born into family in cultic group.",
      choices: {
        connect: { text: "Love them fully despite isolation.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're grounded." },
        boundary: { text: "They're a child first.", consequence: "They're innocent." },
        avoid: { text: "Make them feel trapped.", consequence: "{childName} internalizes claustrophobia." },
        harm: { text: "Tell them outside is evil.", consequence: "{childName} internalizes fear of outside." }
      }
    },
    2: {
      title: "Limited Outside Contact: Insular Life",
      topic: "Social isolation",
      scene: "{childName} is 2-3. Only interacting with community members.",
      choices: {
        connect: { text: "Create safe connection.", consequence: "{childName} feels loved." },
        teach: { text: "Help them understand their world.", consequence: "They grasp it." },
        boundary: { text: "Love exists in any community.", consequence: "They're secure." },
        avoid: { text: "Tell them outside world is evil.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them they're special chosen ones.", consequence: "{childName} internalizes that outside = damned." }
      }
    },
    3: {
      title: "Indoctrination Begins: Teachings and Rules",
      topic: "Belief system imposition",
      scene: "{childName} is 3-4. Learning community's ideology.",
      choices: {
        connect: { text: "Keep them curious and questioning.", consequence: "{childName} thinks." },
        teach: { text: "Help them understand people have different beliefs.", consequence: "They grasp diversity." },
        boundary: { text: "Critical thinking is safe.", consequence: "They're secure." },
        avoid: { text: "Suppress their questions.", consequence: "{childName} internalizes that questioning = dangerous." },
        harm: { text: "Tell them doubting is betrayal.", consequence: "{childName} suppresses thought." }
      }
    },
    4: {
      title: "No Outside School: Isolated Education",
      topic: "Educational restriction",
      scene: "{childName} is in school age. Homeschooled within community.",
      choices: {
        connect: { text: "Ensure quality education.", consequence: "{childName} learns." },
        teach: { text: "Balance community teachings with broader learning.", consequence: "They develop." },
        boundary: { text: "Education should expand minds.", consequence: "They're secure." },
        avoid: { text: "Tell them outside education is lies.", consequence: "{childName} internalizes distrust of knowledge." },
        harm: { text: "Only teach ideology.", consequence: "{childName} becomes indoctrinated." }
      }
    },
    5: {
      title: "Identity: Community Member",
      topic: "Self-understanding",
      scene: "{childName} is 5-6. Only knowing themselves as community member.",
      choices: {
        connect: { text: "Affirm their individual identity.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that people are individuals.", consequence: "They understand." },
        boundary: { text: "They're a person beyond community.", consequence: "They're secure." },
        avoid: { text: "Make community their entire identity.", consequence: "{childName} internalizes complete dependence." },
        harm: { text: "Tell them leaving community = death.", consequence: "{childName} internalizes terror." }
      }
    },
    6: {
      title: "Prohibited Knowledge: Forbidden Outside Information",
      topic: "Information control",
      scene: "{childName} is 6. Learning certain things are forbidden.",
      choices: {
        connect: { text: "Keep them curious.", consequence: "{childName} thinks." },
        teach: { text: "Help them understand knowledge expands.", consequence: "They question." },
        boundary: { text: "Curiosity is healthy.", consequence: "They're secure." },
        avoid: { text: "Tell them curiosity is dangerous.", consequence: "{childName} suppresses questioning." },
        harm: { text: "Make forbidden knowledge seem evil.", consequence: "{childName} internalizes that learning = betrayal." }
      }
    },
    7: {
      title: "Peer Relationships: Only With Community Members",
      topic: "Social restriction",
      scene: "{childName} is 7. All friends are community members.",
      choices: {
        connect: { text: "Support their friendships.", consequence: "{childName} has connection." },
        teach: { text: "Help them understand broader friendship possibilities.", consequence: "They imagine." },
        boundary: { text: "People can be friends across communities.", consequence: "They're secure." },
        avoid: { text: "Tell them outside friendships are evil.", consequence: "{childName} internalizes fear of others." },
        harm: { text: "Tell them they must avoid outsiders.", consequence: "{childName} internalizes isolation." }
      }
    },
    8: {
      title: "Increasing Demands: Community Expectations Grow",
      topic: "Pressure escalation",
      scene: "{childName} is 8. Expected to participate more in community activities.",
      choices: {
        connect: { text: "Protect their childhood.", consequence: "{childName} develops normally." },
        teach: { text: "Help them understand boundaries.", consequence: "They learn." },
        boundary: { text: "Childhood should be protected.", consequence: "They're secure." },
        avoid: { text: "Let community demands overwhelm them.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them community needs come first.", consequence: "{childName} internalizes self-sacrifice." }
      }
    },
    9: {
      title: "Escape Fantasy: Imagining Different Life",
      topic: "Dreams of freedom",
      scene: "{childName} is 9. Wondering about outside world.",
      choices: {
        connect: { text: "Validate their curiosity.", consequence: "{childName} feels understood." },
        teach: { text: "Help them imagine possibilities.", consequence: "They dream." },
        boundary: { text: "Dreaming is healthy.", consequence: "They're secure." },
        avoid: { text: "Tell them dreams are dangerous.", consequence: "{childName} suppresses hope." },
        harm: { text: "Tell them leaving means death.", consequence: "{childName} internalizes terror." }
      }
    },
    10: {
      title: "Glimpses of Outside: Forbidden Knowledge Discovered",
      topic: "Reality intrudes",
      scene: "{childName} is 10. Finding out things community taught aren't true.",
      choices: {
        connect: { text: "Support their questioning.", consequence: "{childName} thinks critically." },
        teach: { text: "Help them process contradictions.", consequence: "They're informed." },
        boundary: { text: "Truth is important.", consequence: "They're secure." },
        avoid: { text: "Tell them to ignore truth.", consequence: "{childName} internalizes denial." },
        harm: { text: "Make them feel guilty for learning.", consequence: "{childName} internalizes that truth = betrayal." }
      }
    },
    11: {
      title: "Adolescence: Questions Can't Be Suppressed",
      topic: "Doubts emerge",
      scene: "{childName} is 11. Teen doubts can't be ignored.",
      choices: {
        connect: { text: "Allow their questioning.", consequence: "{childName} develops critical thinking." },
        teach: { text: "Help them think for themselves.", consequence: "They're empowered." },
        boundary: { text: "Questions are healthy.", consequence: "They're secure." },
        avoid: { text: "Suppress questions harshly.", consequence: "{childName} internalizes that thought = dangerous." },
        harm: { text: "Tell them they should be ashamed.", consequence: "{childName} internalizes guilt about thinking." }
      }
    },
    12: {
      title: "Contact With Outsiders: Reality Check",
      topic: "Exposure to alternatives",
      scene: "{childName} is 12. Interacting with people outside community.",
      choices: {
        connect: { text: "Support their new perspectives.", consequence: "{childName} expands thinking." },
        teach: { text: "Help them process differences.", consequence: "They're informed." },
        boundary: { text: "Different people can be kind.", consequence: "They're secure." },
        avoid: { text: "Tell them outsiders are dangerous.", consequence: "{childName} internalizes fear." },
        harm: { text: "Punish them for outside contact.", consequence: "{childName} internalizes that exploration = punishment." }
      }
    },
    13: {
      title: "Escape Plans: First Real Possibility",
      topic: "Freedom becomes real",
      scene: "{childName} is 13. Beginning to seriously consider escape.",
      choices: {
        connect: { text: "Support their safety and planning.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them think through escape safely.", consequence: "They're strategic." },
        boundary: { text: "Escape is possible and safe.", consequence: "They're secure." },
        avoid: { text: "Tell them escape is impossible.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Tell them escape means death.", consequence: "{childName} internalizes terror." }
      }
    },
    14: {
      title: "Building Relationships Outside: Secret Connections",
      topic: "Forbidden friendship",
      scene: "{childName} is 14. Secretly building relationships outside community.",
      choices: {
        connect: { text: "Support their outside friendships.", consequence: "{childName} has connection." },
        teach: { text: "Help them be strategic.", consequence: "They're careful." },
        boundary: { text: "Friendships are valuable.", consequence: "They're secure." },
        avoid: { text: "Make them feel guilty.", consequence: "{childName} internalizes shame about friendships." },
        harm: { text: "Tell them friendships are betrayal.", consequence: "{childName} suppresses connection." }
      }
    },
    15: {
      title: "The Escape: Leaving the Community",
      topic: "Departure and freedom",
      scene: "{childName} is 15. Actually leaves community.",
      choices: {
        connect: { text: "Support their escape fully.", consequence: "{childName} is safe." },
        teach: { text: "Help them adjust to outside world.", consequence: "They adapt." },
        boundary: { text: "Escape is brave and right.", consequence: "They're secure." },
        avoid: { text: "Tell them they should go back.", consequence: "{childName} internalizes guilt about escape." },
        harm: { text: "Tell them outside world will destroy them.", consequence: "{childName} internalizes fear." }
      }
    },
    16: {
      title: "Decompression: Processing Cult Trauma",
      topic: "Emotional processing",
      scene: "{childName} is 16. Processing what happened.",
      choices: {
        connect: { text: "Support their healing.", consequence: "{childName} processes." },
        teach: { text: "Help them understand it wasn't their fault.", consequence: "They grasp it." },
        boundary: { text: "Healing is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them to forget.", consequence: "{childName} internalizes unprocessed trauma." },
        harm: { text: "Tell them they were brainwashed and weak.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Understanding the Experience: Making Meaning",
      topic: "Integration",
      scene: "{childName} is 17. Beginning to make sense of experience.",
      choices: {
        connect: { text: "Support their meaning-making.", consequence: "{childName} heals." },
        teach: { text: "Help them understand indoctrination wasn't their fault.", consequence: "They're grounded." },
        boundary: { text: "Understanding brings peace.", consequence: "They're secure." },
        avoid: { text: "Tell them their experience is worthless.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're permanently damaged.", consequence: "{childName} internalizes permanent harm belief." }
      }
    },
    18: {
      title: "Adult Choice: Building Life in Freedom",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own life.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about building authentic life.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must warn others.", consequence: "{childName} might feel obligated." },
        harm: { text: "Tell them they're forever marked by cult.", consequence: "{childName} internalizes permanent victim status." }
      }
    }
  }
};
