export const SPECIAL_START_YEARLY_BEATS__INSANE_02 = {
  witness_protection: {
    1: {
      title: "Born Into Hiding",
      topic: "New identity",
      scene: "{childName} is born to parent(s) in witness protection.",
      choices: {
        connect: { text: "Love them despite danger.", consequence: "{childName} feels wanted." },
        teach: { text: "Create safety within hidden life.", consequence: "They feel secure." },
        boundary: { text: "They're innocent of crimes.", consequence: "They're children." },
        avoid: { text: "Make them feel afraid always.", consequence: "{childName} becomes hypervigilant." },
        harm: { text: "Tell them 'people want us dead.'", consequence: "{childName} internalizes terror." }
      }
    },
    2: {
      title: "Everything Is Covered: False Names, False History",
      topic: "Constant deception",
      scene: "{childName} is 2-3. Living under false identity.",
      choices: {
        connect: { text: "Normalize the false identity as home.", consequence: "{childName} accepts it." },
        teach: { text: "Help them understand without fear.", consequence: "They grasp basics." },
        boundary: { text: "False name doesn't change who they are.", consequence: "They're secure." },
        avoid: { text: "Make false identity feel like prison.", consequence: "{childName} internalizes confinement." },
        harm: { text: "Tell them 'everyone is an enemy.'", consequence: "{childName} internalizes paranoia." }
      }
    },
    3: {
      title: "Can't Tell Anyone: Keeping the Secret",
      topic: "Isolation through secrecy",
      scene: "{childName} is 3-4. Taught never to share true identity.",
      choices: {
        connect: { text: "Make secrecy feel safe, not shameful.", consequence: "{childName} understands." },
        teach: { text: "Explain that some secrets protect.", consequence: "They grasp purpose." },
        boundary: { text: "Secrecy doesn't mean shame.", consequence: "They're secure." },
        avoid: { text: "Make them feel ashamed of family.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'if anyone knows, we die.'", consequence: "{childName} internalizes terror." }
      }
    },
    4: {
      title: "School: Double Life Begins",
      topic: "Public facade",
      scene: "{childName} is in school under false name.",
      choices: {
        connect: { text: "Help them navigate double life.", consequence: "{childName} manages well." },
        teach: { text: "Support their school identity.", consequence: "They can succeed." },
        boundary: { text: "School is safe space.", consequence: "They're secure." },
        avoid: { text: "Make school feel like deception zone.", consequence: "{childName} internalizes dishonesty." },
        harm: { text: "Tell them 'peers would reject true you.'", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "Moving Again: Identity Changes",
      topic: "Constant disruption",
      scene: "{childName} is 5-6. Being relocated to new identity.",
      choices: {
        connect: { text: "Support identity transitions gently.", consequence: "{childName} adapts." },
        teach: { text: "Help them grieve old identity.", consequence: "They process change." },
        boundary: { text: "Moves are for safety.", consequence: "They're protected." },
        avoid: { text: "Make moves feel like punishment.", consequence: "{childName} internalizes instability." },
        harm: { text: "Tell them moves are their fault.", consequence: "{childName} internalizes guilt." }
      }
    },
    6: {
      title: "Identity Crisis: Who Are They Really?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Multiple identities, which is real?",
      choices: {
        connect: { text: "Affirm their core self beneath names.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that true self is unchanging.", consequence: "They develop identity." },
        boundary: { text: "Names are tools, not identity.", consequence: "They're secure." },
        avoid: { text: "Make identity feel fragmented.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them 'you have no real identity.'", consequence: "{childName} internalizes depersonalization." }
      }
    },
    7: {
      title: "Danger Always Possible: Hypervigilance Training",
      topic: "Fear management",
      scene: "{childName} is 7. Parent teaches threat awareness.",
      choices: {
        connect: { text: "Teach realistic safety without paranoia.", consequence: "{childName} is prepared." },
        teach: { text: "Discuss when danger is real vs. fear.", consequence: "They think critically." },
        boundary: { text: "Safety doesn't mean constant fear.", consequence: "They're secure." },
        avoid: { text: "Train them to be always afraid.", consequence: "{childName} becomes hypervigilant." },
        harm: { text: "Tell them 'danger is always coming.'", consequence: "{childName} internalizes constant threat." }
      }
    },
    8: {
      title: "What Did Parent Testify About?",
      topic: "Knowing the danger",
      scene: "{childName} is 8. Old enough to understand why they're hiding.",
      choices: {
        connect: { text: "Explain honestly without traumatizing.", consequence: "{childName} understands." },
        teach: { text: "Discuss that parent was brave.", consequence: "They respect parent." },
        boundary: { text: "Parent's choice led to their safety.", consequence: "They're secure." },
        avoid: { text: "Hide details.", consequence: "{childName} invents worse scenarios." },
        harm: { text: "Tell them parent put them in danger.", consequence: "{childName} internalizes resentment." }
      }
    },
    9: {
      title: "Peer Relationships: Never Real Friendship",
      topic: "Authentic connection impossible",
      scene: "{childName} is 9. Can't let anyone know them.",
      choices: {
        connect: { text: "Help them develop meaningful connection within limits.", consequence: "{childName} has bonds." },
        teach: { text: "Discuss that they can have real friends.", consequence: "They believe it." },
        boundary: { text: "Friendship is possible despite secrecy.", consequence: "They're secure." },
        avoid: { text: "Tell them no one can really know them.", consequence: "{childName} becomes cynical." },
        harm: { text: "Tell them all friendships are lies.", consequence: "{childName} internalizes distrust." }
      }
    },
    10: {
      title: "Agent Check-Ins: Someone Watching Always",
      topic: "Government surveillance",
      scene: "{childName} is 10. Federal agents monitoring them.",
      choices: {
        connect: { text: "Help them see agents as protectors.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that surveillance is for safety.", consequence: "They understand." },
        boundary: { text: "They're protected, not trapped.", consequence: "They're secure." },
        avoid: { text: "Make surveillance feel invasive.", consequence: "{childName} internalizes violation." },
        harm: { text: "Tell them agents will betray them.", consequence: "{childName} internalizes paranoia." }
      }
    },
    11: {
      title: "Adolescence: Want Out of Program?",
      topic: "Identity questioning",
      scene: "{childName} is 11. Wondering if they can leave witness protection.",
      choices: {
        connect: { text: "Support their questions honestly.", consequence: "{childName} thinks critically." },
        teach: { text: "Discuss that program protects them.", consequence: "They understand." },
        boundary: { text: "They have agency within safety.", consequence: "They're empowered." },
        avoid: { text: "Tell them they can never leave.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them leaving means death.", consequence: "{childName} internalizes terror." }
      }
    },
    12: {
      title: "Dating & Relationships: Can't Be Honest",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Discuss how to be honest within limits.", consequence: "They navigate." },
        boundary: { text: "They can have authentic connections.", consequence: "They're secure." },
        avoid: { text: "Tell them dating is impossible.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them to deceive partners.", consequence: "{childName} internalizes dishonesty." }
      }
    },
    13: {
      title: "Internet Danger: Can't Have Real Online Presence",
      topic: "Digital isolation",
      scene: "{childName} is 13. Can't use social media normally.",
      choices: {
        connect: { text: "Help them understand digital safety.", consequence: "{childName} is wise." },
        teach: { text: "Discuss why online presence is dangerous.", consequence: "They grasp it." },
        boundary: { text: "Safety is more important than connection.", consequence: "They're secure." },
        avoid: { text: "Make them feel completely cut off.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them internet will expose them.", consequence: "{childName} internalizes fear." }
      }
    },
    14: {
      title: "What If They're Found? Contingency Plans",
      topic: "Emergency reality",
      scene: "{childName} is 14. Learning what happens if cover is blown.",
      choices: {
        connect: { text: "Prepare them without traumatizing.", consequence: "{childName} is ready." },
        teach: { text: "Discuss emergency procedures.", consequence: "They know what to do." },
        boundary: { text: "Plans exist to keep them safe.", consequence: "They're secure." },
        avoid: { text: "Make emergency seem imminent.", consequence: "{childName} becomes hypervigilant." },
        harm: { text: "Tell them they'll be killed.", consequence: "{childName} internalizes terror." }
      }
    },
    15: {
      title: "College Planning: Leaving Program?",
      topic: "Future independence",
      scene: "{childName} is 15. Planning life after high school.",
      choices: {
        connect: { text: "Support their independence within safety.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss college options within program.", consequence: "They see paths." },
        boundary: { text: "They can build a life.", consequence: "Autonomy is possible." },
        avoid: { text: "Tell them program is forever.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them college is impossible.", consequence: "{childName} gives up." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Secret",
      topic: "Romantic truth",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them navigate trust with partner.", consequence: "They communicate." },
        boundary: { text: "Real love requires honesty.", consequence: "They're free." },
        avoid: { text: "Make them keep secret forever.", consequence: "{childName} loses intimacy." },
        harm: { text: "Tell them never to tell partner.", consequence: "{childName} internalizes dishonesty." }
      }
    },
    17: {
      title: "Understanding Parent's Choice: Was It Worth It?",
      topic: "Parental justification",
      scene: "{childName} is 17. Can they understand parent's decision?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that parent chose their safety.", consequence: "Empathy develops." },
        boundary: { text: "Parent's choice kept them alive.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent ruined their life.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Reveal or Hide Forever?",
      topic: "Self-determination",
      scene: "{childName} is 18. Can they choose their identity?",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about truth and safety.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay hidden.", consequence: "{childName} might resent." },
        harm: { text: "Tell them revealing means death.", consequence: "{childName} internalizes terror." }
      }
    }
  },

  royal_heir_protocol: {
    1: {
      title: "Born Crown Heir",
      topic: "Absolute duty",
      scene: "{childName} is born as royal heir to throne.",
      choices: {
        connect: { text: "Love them beyond their title.", consequence: "{childName} feels wanted." },
        teach: { text: "Create childhood within duty.", consequence: "They're still a child." },
        boundary: { text: "They're a person first, heir second.", consequence: "They're secure." },
        avoid: { text: "Treat them as property of crown.", consequence: "{childName} internalizes instrumentality." },
        harm: { text: "Tell them 'you exist for dynasty.'", consequence: "{childName} internalizes that they = title." }
      }
    },
    2: {
      title: "Isolated for Safety: Palace Only",
      topic: "Protective imprisonment",
      scene: "{childName} is 2-3. Confined to palace for security.",
      choices: {
        connect: { text: "Create rich childhood within palace.", consequence: "{childName} is happy." },
        teach: { text: "Fill palace with learning and art.", consequence: "They develop well." },
        boundary: { text: "Palace can be home.", consequence: "They're secure." },
        avoid: { text: "Make palace feel like prison.", consequence: "{childName} internalizes confinement." },
        harm: { text: "Tell them 'world is full of assassins.'", consequence: "{childName} internalizes terror." }
      }
    },
    3: {
      title: "Protocol Training: Manners, Bearing, Duty",
      topic: "Rigorous conditioning",
      scene: "{childName} is 3-4. Formal training begins.",
      choices: {
        connect: { text: "Teach protocol with compassion.", consequence: "{childName} learns gracefully." },
        teach: { text: "Explain why protocol matters.", consequence: "They understand purpose." },
        boundary: { text: "Protocol doesn't suppress personality.", consequence: "They're still themselves." },
        avoid: { text: "Force rigid conformity.", consequence: "{childName} becomes stiff." },
        harm: { text: "Punish protocol failures harshly.", consequence: "{childName} becomes fearful." }
      }
    },
    4: {
      title: "Limited Education: Only Approved Knowledge",
      topic: "Curated learning",
      scene: "{childName} is in school-age. Tutors screen all information.",
      choices: {
        connect: { text: "Provide excellent education within bounds.", consequence: "{childName} learns well." },
        teach: { text: "Expose them to diverse perspectives secretly.", consequence: "They get fuller knowledge." },
        boundary: { text: "They can think for themselves.", consequence: "They're empowered." },
        avoid: { text: "Restrict education completely.", consequence: "{childName} is intellectually limited." },
        harm: { text: "Tell them truth is dangerous.", consequence: "{childName} suppresses questioning." }
      }
    },
    5: {
      title: "Public Appearances: Being Displayed",
      topic: "Public persona",
      scene: "{childName} is 5-6. Displayed to public regularly.",
      choices: {
        connect: { text: "Make public time meaningful.", consequence: "{childName} is confident." },
        teach: { text: "Help them understand public interest.", consequence: "They grasp it." },
        boundary: { text: "They're a person, not an object.", consequence: "They're secure." },
        avoid: { text: "Make displays feel objectifying.", consequence: "{childName} internalizes commodification." },
        harm: { text: "Tell them people are judging them.", consequence: "{childName} internalizes judgment." }
      }
    },
    6: {
      title: "Identity: Who Are They Without Title?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Separating self from crown.",
      choices: {
        connect: { text: "Affirm their individual self.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're more than title.", consequence: "They develop identity." },
        boundary: { text: "Their personhood is separate from crown.", consequence: "They're secure." },
        avoid: { text: "Make crown their only identity.", consequence: "{childName} becomes entrenched." },
        harm: { text: "Tell them they are the crown.", consequence: "{childName} internalizes that they = title." }
      }
    },
    7: {
      title: "Succession Training: Future Ruler",
      topic: "Leadership preparation",
      scene: "{childName} is 7. Formal leadership training begins.",
      choices: {
        connect: { text: "Mentor them with love.", consequence: "{childName} embraces learning." },
        teach: { text: "Discuss ruler's moral responsibility.", consequence: "They develop ethics." },
        boundary: { text: "Power comes with accountability.", consequence: "They're grounded." },
        avoid: { text: "Teach them to rule without accountability.", consequence: "{childName} becomes tyrannical." },
        harm: { text: "Tell them power is all that matters.", consequence: "{childName} internalizes that might = right." }
      }
    },
    8: {
      title: "Duty Before Self: Protocol Comes First",
      topic: "Suppression of autonomy",
      scene: "{childName} is 8. Learning that duty supersedes desire.",
      choices: {
        connect: { text: "Balance duty with self-care.", consequence: "{childName} is healthy." },
        teach: { text: "Discuss healthy duty.", consequence: "They understand balance." },
        boundary: { text: "Their needs matter too.", consequence: "They're secure." },
        avoid: { text: "Make them sacrifice everything.", consequence: "{childName} loses sense of self." },
        harm: { text: "Tell them 'your desires don't matter.'", consequence: "{childName} suppresses self." }
      }
    },
    9: {
      title: "Peer Relationships: Servants, Not Friends",
      topic: "Isolation through status",
      scene: "{childName} is 9. Only surrounded by staff and protocol.",
      choices: {
        connect: { text: "Help them find authentic connection.", consequence: "{childName} has real bonds." },
        teach: { text: "Discuss that people can like them for them.", consequence: "They believe it." },
        boundary: { text: "Real friendship is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them no one can be a real friend.", consequence: "{childName} becomes cynical." },
        harm: { text: "Tell them everyone is using them.", consequence: "{childName} internalizes distrust." }
      }
    },
    10: {
      title: "Marriage Politics: Dynasty Succession Planning",
      topic: "Future marriage as duty",
      scene: "{childName} is 10. Hearing about potential arranged marriage.",
      choices: {
        connect: { text: "Protect their romantic autonomy.", consequence: "{childName} has agency." },
        teach: { text: "Discuss that they choose their partner.", consequence: "They feel empowered." },
        boundary: { text: "Love matters in marriage.", consequence: "They're secure." },
        avoid: { text: "Begin arranging marriage.", consequence: "{childName} internalizes powerlessness." },
        harm: { text: "Tell them marriage is non-negotiable duty.", consequence: "{childName} internalizes coercion." }
      }
    },
    11: {
      title: "Adolescence: Freedom or More Control?",
      topic: "Rebellion emerging",
      scene: "{childName} is 11. Adolescence brings desire for normal life.",
      choices: {
        connect: { text: "Support age-appropriate autonomy.", consequence: "{childName} develops healthily." },
        teach: { text: "Discuss that they can have some freedom.", consequence: "They feel hopeful." },
        boundary: { text: "Some rebellion is healthy.", consequence: "They're secure." },
        avoid: { text: "Increase restrictions.", consequence: "{childName} becomes resentful." },
        harm: { text: "Tell them escape is impossible.", consequence: "{childName} internalizes despair." }
      }
    },
    12: {
      title: "Dating & Relationships: Political or Personal?",
      topic: "Romantic autonomy",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops naturally." },
        teach: { text: "Help them distinguish personal from political.", consequence: "They think critically." },
        boundary: { text: "Some love is just for them.", consequence: "They're secure." },
        avoid: { text: "Make all relationships political.", consequence: "{childName} loses authentic connection." },
        harm: { text: "Tell them love isn't for them.", consequence: "{childName} internalizes that they're unlovable." }
      }
    },
    13: {
      title: "First Real Secret: Forbidden Relationship",
      topic: "Rebellion and deception",
      scene: "{childName} is 13. Hiding a relationship from court.",
      choices: {
        connect: { text: "Support their secrets gently.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that all teens have secrets.", consequence: "They feel normal." },
        boundary: { text: "Their private life is theirs.", consequence: "They're empowered." },
        avoid: { text: "Spy on them.", consequence: "{childName} internalizes violation." },
        harm: { text: "Expose their secret publicly.", consequence: "{childName} internalizes betrayal." }
      }
    },
    14: {
      title: "Succession Crisis: What If They Refuse?",
      topic: "Power and choice",
      scene: "{childName} is 14. Court discusses what if they refuse crown.",
      choices: {
        connect: { text: "Support their emerging autonomy.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss that they have choices.", consequence: "They see options." },
        boundary: { text: "Their life is theirs to choose.", consequence: "Agency is real." },
        avoid: { text: "Tell them they have no choice.", consequence: "{childName} feels trapped." },
        harm: { text: "Threaten them if they refuse.", consequence: "{childName} internalizes coercion." }
      }
    },
    15: {
      title: "College Escape Fantasies: Could They Leave?",
      topic: "Freedom dreams",
      scene: "{childName} is 15. Dreaming of normal college life.",
      choices: {
        connect: { text: "Support their dreams without judgment.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss realistic options.", consequence: "They think critically." },
        boundary: { text: "Some escape might be possible.", consequence: "They're hopeful." },
        avoid: { text: "Crush their dreams.", consequence: "{childName} becomes depressed." },
        harm: { text: "Tell them they'll never be normal.", consequence: "{childName} internalizes despair." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Dynasty Pressure",
      topic: "Love vs. duty",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them balance love and duty.", consequence: "They navigate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Force them to end relationship.", consequence: "{childName} loses love." },
        harm: { text: "Use partner to control them.", consequence: "{childName} internalizes coercion." }
      }
    },
    17: {
      title: "Understanding Parent's Burden: The Crown",
      topic: "Parental duty",
      scene: "{childName} is 17. Can they understand parent's choices?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that parent sacrificed for them.", consequence: "Empathy develops." },
        boundary: { text: "Understanding doesn't mean accepting your own path.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them 'you'll suffer like parent.'", consequence: "{childName} internalizes despair." }
      }
    },
    18: {
      title: "Adult Choice: Crown or Freedom?",
      topic: "Self-determination",
      scene: "{childName} is 18. Time to choose their path.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about duty and happiness.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must take crown.", consequence: "{childName} might resent." },
        harm: { text: "Tell them refusing crown means death.", consequence: "{childName} internalizes terror." }
      }
    }
  },

  apocalypse_bunker_stream: {
    1: {
      title: "Born Underground: Streaming the Bunker",
      topic: "Doomsday dwelling",
      scene: "{childName} is born in apocalypse bunker being livestreamed.",
      choices: {
        connect: { text: "Love them beyond the cameras.", consequence: "{childName} feels wanted." },
        teach: { text: "Create safe private moments.", consequence: "They have sanctuary." },
        boundary: { text: "They're not content.", consequence: "They're a person." },
        avoid: { text: "Make every moment streamed.", consequence: "{childName} loses privacy." },
        harm: { text: "Tell them 'the stream is more important.'", consequence: "{childName} internalizes instrumentality." }
      }
    },
    2: {
      title: "Bunker as World: Underground Childhood",
      topic: "Enclosed environment",
      scene: "{childName} is 2-3. Never seen natural light.",
      choices: {
        connect: { text: "Create joy and growth underground.", consequence: "{childName} is healthy." },
        teach: { text: "Explain sunlight and outdoors.", consequence: "They understand." },
        boundary: { text: "Bunker is safe home.", consequence: "They're secure." },
        avoid: { text: "Make bunker feel like prison.", consequence: "{childName} internalizes confinement." },
        harm: { text: "Tell them 'outside world is poison.'", consequence: "{childName} internalizes fear." }
      }
    },
    3: {
      title: "Millions Watching: Public As Parent",
      topic: "Viewer control",
      scene: "{childName} is 3-4. Millions of people invested in them.",
      choices: {
        connect: { text: "Protect them from viewer influence.", consequence: "{childName} is safe." },
        teach: { text: "Help them understand viewers aren't family.", consequence: "They grasp distinction." },
        boundary: { text: "Viewers don't get to decide them.", consequence: "They're secure." },
        avoid: { text: "Let viewers influence parenting.", consequence: "{childName} internalizes being controlled." },
        harm: { text: "Tell them 'millions of people care.'", consequence: "{childName} internalizes that strangers matter." }
      }
    },
    4: {
      title: "Bunker School: Homeschooled on Stream",
      topic: "Public education",
      scene: "{childName} is in school-age. Learning while being watched.",
      choices: {
        connect: { text: "Make learning private despite stream.", consequence: "{childName} learns well." },
        teach: { text: "Help them focus despite audience.", consequence: "They concentrate." },
        boundary: { text: "Learning is for them, not viewers.", consequence: "They're secure." },
        avoid: { text: "Make learning into entertainment.", consequence: "{childName} internalizes that learning = performance." },
        harm: { text: "Let viewers criticize their learning.", consequence: "{childName} internalizes judgment." }
      }
    },
    5: {
      title: "Apocalypse Updates: Why Are We Here?",
      topic: "Living the narrative",
      scene: "{childName} is 5-6. Learning about the apocalypse.",
      choices: {
        connect: { text: "Explain reality without traumatizing.", consequence: "{childName} understands." },
        teach: { text: "Discuss bunker as safe place.", consequence: "They feel secure." },
        boundary: { text: "Apocalypse doesn't define them.", consequence: "They're secure." },
        avoid: { text: "Make apocalypse feel imminent.", consequence: "{childName} internalizes dread." },
        harm: { text: "Tell them 'surface is always dying.'", consequence: "{childName} internalizes terror." }
      }
    },
    6: {
      title: "Identity: Bunker Child or Real Person?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they beyond stream?",
      choices: {
        connect: { text: "Affirm their authentic self.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're more than content.", consequence: "They develop identity." },
        boundary: { text: "Their true self is separate from stream.", consequence: "They're secure." },
        avoid: { text: "Make stream personality their identity.", consequence: "{childName} loses authentic self." },
        harm: { text: "Tell them stream is their real life.", consequence: "{childName} internalizes false identity." }
      }
    },
    7: {
      title: "Bunker Systems: Learning Responsibility",
      topic: "Survival skills",
      scene: "{childName} is 7. Helping maintain bunker systems.",
      choices: {
        connect: { text: "Teach responsibility with age-appropriate tasks.", consequence: "{childName} is capable." },
        teach: { text: "Explain why systems matter.", consequence: "They understand." },
        boundary: { text: "Responsibility matches their age.", consequence: "They're confident." },
        avoid: { text: "Overload them with adult tasks.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them survival depends on them.", consequence: "{childName} internalizes impossible burden." }
      }
    },
    8: {
      title: "Social Media Comments: Strangers Know Them",
      topic: "Online judgment",
      scene: "{childName} is 8. Reading comments about themselves.",
      choices: {
        connect: { text: "Protect them from cruel comments.", consequence: "{childName} is safe." },
        teach: { text: "Help them understand online cruelty.", consequence: "They're informed." },
        boundary: { text: "Strangers' opinions don't define them.", consequence: "They're secure." },
        avoid: { text: "Show them harsh comments.", consequence: "{childName} internalizes judgment." },
        harm: { text: "Tell them people hate them.", consequence: "{childName} internalizes rejection." }
      }
    },
    9: {
      title: "No Outside Peers: Only the Stream",
      topic: "Isolation through environment",
      scene: "{childName} is 9. No other children in bunker.",
      choices: {
        connect: { text: "Help them develop meaningful connection.", consequence: "{childName} has bonds." },
        teach: { text: "Discuss that they can have real friends.", consequence: "They believe it." },
        boundary: { text: "Real friendship is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them they're alone forever.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them all peers are surface dwellers.", consequence: "{childName} internalizes superiority/inferiority." }
      }
    },
    10: {
      title: "What If Stream Ends? Identity Crisis",
      topic: "Existential fear",
      scene: "{childName} is 10. Wondering what if livestream stops.",
      choices: {
        connect: { text: "Help them develop identity beyond stream.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're valuable without stream.", consequence: "They feel worthy." },
        boundary: { text: "Their worth isn't stream-dependent.", consequence: "They're secure." },
        avoid: { text: "Make them feel stream is all that matters.", consequence: "{childName} internalizes dependence." },
        harm: { text: "Tell them stream is forever.", consequence: "{childName} internalizes that they = content." }
      }
    },
    11: {
      title: "Adolescence: Want to Leave Bunker?",
      topic: "Freedom desire",
      scene: "{childName} is 11. Adolescence brings escape fantasies.",
      choices: {
        connect: { text: "Support their questions.", consequence: "{childName} thinks critically." },
        teach: { text: "Discuss that surface world exists.", consequence: "They wonder." },
        boundary: { text: "They can question safety claims.", consequence: "They're empowered." },
        avoid: { text: "Suppress escape fantasies.", consequence: "{childName} becomes resentful." },
        harm: { text: "Tell them surface means death.", consequence: "{childName} internalizes terror." }
      }
    },
    12: {
      title: "Dating & Relationships: Streamed Romance?",
      topic: "Romantic privacy",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support private relationships.", consequence: "{childName} develops naturally." },
        teach: { text: "Discuss that romance needs privacy.", consequence: "They understand." },
        boundary: { text: "Their relationships are theirs.", consequence: "They're secure." },
        avoid: { text: "Stream dating moments.", consequence: "{childName} internalizes that intimacy is public." },
        harm: { text: "Let viewers choose their partner.", consequence: "{childName} internalizes being controlled." }
      }
    },
    13: {
      title: "First Conflict: Bunker Problems on Stream",
      topic: "Public family drama",
      scene: "{childName} is 13. Family conflict broadcasted live.",
      choices: {
        connect: { text: "Protect them from exposure.", consequence: "{childName} is safe." },
        teach: { text: "Discuss that conflict is private.", consequence: "They understand boundaries." },
        boundary: { text: "Family issues shouldn't be content.", consequence: "They're protected." },
        avoid: { text: "Make conflict into entertainment.", consequence: "{childName} internalizes that pain is content." },
        harm: { text: "Let viewers judge family.", consequence: "{childName} internalizes judgment." }
      }
    },
    14: {
      title: "Escape Attempt: Testing Bunker Limits",
      topic: "Rebellion",
      scene: "{childName} is 14. Testing if they could leave.",
      choices: {
        connect: { text: "Allow them to explore within safety.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss autonomy and bunker needs.", consequence: "They understand complexity." },
        boundary: { text: "They have some agency.", consequence: "They're secure." },
        avoid: { text: "Punish them severely.", consequence: "{childName} becomes resentful." },
        harm: { text: "Tell them escape is impossible.", consequence: "{childName} internalizes despair." }
      }
    },
    15: {
      title: "College Planning: Outside Education Possible?",
      topic: "Future education",
      scene: "{childName} is 15. Considering life outside bunker.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss educational options.", consequence: "They see paths." },
        boundary: { text: "They can build a life.", consequence: "Autonomy is possible." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them outside is death.", consequence: "{childName} internalizes terror." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Escape Plan?",
      topic: "Love and freedom",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them navigate together.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Force them to separate.", consequence: "{childName} loses love." },
        harm: { text: "Tell them partner doesn't really love them.", consequence: "{childName} internalizes rejection." }
      }
    },
    17: {
      title: "Understanding Parents: Why The Bunker? Why The Stream?",
      topic: "Parental choices",
      scene: "{childName} is 17. Can they understand parent's decisions?",
      choices: {
        connect: { text: "Share parents' perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss apocalypse beliefs and streaming.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding doesn't mean accepting.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them 'parents are crazy.'", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Bunker or World?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about both worlds.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} might resent." },
        harm: { text: "Tell them leaving means abandoning family.", consequence: "{childName} internalizes guilt." }
      }
    }
  },

  traveling_circus: {
    1: {
      title: "Born Into Circus",
      topic: "Constant motion",
      scene: "{childName} is born into traveling circus family.",
      choices: {
        connect: { text: "Love them fully in this transient life.", consequence: "{childName} feels wanted." },
        teach: { text: "Create stability within movement.", consequence: "They feel secure." },
        boundary: { text: "They're a child first.", consequence: "They're innocent." },
        avoid: { text: "Make movement feel chaotic.", consequence: "{childName} internalizes instability." },
        harm: { text: "Tell them 'circus is all we have.'", consequence: "{childName} internalizes limited horizons." }
      }
    },
    2: {
      title: "Home Is the Caravan: No Permanent Place",
      topic: "Rootless living",
      scene: "{childName} is 2-3. Caravan is their only home.",
      choices: {
        connect: { text: "Make caravan feel like home.", consequence: "{childName} feels secure." },
        teach: { text: "Help them adapt to constant change.", consequence: "They're flexible." },
        boundary: { text: "Caravan can be nurturing.", consequence: "They're secure." },
        avoid: { text: "Make movement feel unstable.", consequence: "{childName} internalizes rootlessness." },
        harm: { text: "Tell them they belong nowhere.", consequence: "{childName} internalizes disconnection." }
      }
    },
    3: {
      title: "Circus Performance: Learning the Acts",
      topic: "Physical training",
      scene: "{childName} is 3-4. Beginning circus skills training.",
      choices: {
        connect: { text: "Train them with joy and safety.", consequence: "{childName} loves circus." },
        teach: { text: "Teach that their body is capable.", consequence: "They develop confidence." },
        boundary: { text: "Training respects their development stage.", consequence: "They're safe." },
        avoid: { text: "Push them too hard too young.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them to risk injury.", consequence: "{childName} internalizes danger." }
      }
    },
    4: {
      title: "School on the Road: Inconsistent Education",
      topic: "Fragmented learning",
      scene: "{childName} is in school-age. Education is inconsistent.",
      choices: {
        connect: { text: "Find quality education within movement.", consequence: "{childName} learns." },
        teach: { text: "Supplement traveling education.", consequence: "They develop well." },
        boundary: { text: "Education is continuous.", consequence: "They're supported." },
        avoid: { text: "Neglect education for circus.", consequence: "{childName} falls behind." },
        harm: { text: "Tell them education doesn't matter.", consequence: "{childName} loses literacy." }
      }
    },
    5: {
      title: "Traveling: New Town Every Few Weeks",
      topic: "Constant relocation",
      scene: "{childName} is 5-6. Never in one place long.",
      choices: {
        connect: { text: "Help them adapt to constant change.", consequence: "{childName} is resilient." },
        teach: { text: "Support friendships despite transitions.", consequence: "They bond." },
        boundary: { text: "Transitions can be manageable.", consequence: "They're secure." },
        avoid: { text: "Make transitions traumatic.", consequence: "{childName} internalizes instability." },
        harm: { text: "Tell them they'll always be alone.", consequence: "{childName} internalizes isolation." }
      }
    },
    6: {
      title: "Identity: Circus Kid",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Support circus identity with pride.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that they're more than circus.", consequence: "They develop identity." },
        boundary: { text: "Circus identity is valid.", consequence: "They're secure." },
        avoid: { text: "Make circus identity limiting.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them circus is their destiny.", consequence: "{childName} internalizes entrapment." }
      }
    },
    7: {
      title: "High-Wire Act: Real Danger?",
      topic: "Physical risk",
      scene: "{childName} is 7. Learning risky circus acts.",
      choices: {
        connect: { text: "Train them with strict safety.", consequence: "{childName} is safe." },
        teach: { text: "Teach risk management.", consequence: "They're smart." },
        boundary: { text: "Safety comes first.", consequence: "They're protected." },
        avoid: { text: "Let them perform dangerous acts.", consequence: "{childName} gets injured." },
        harm: { text: "Tell them to ignore pain.", consequence: "{childName} internalizes injury tolerance." }
      }
    },
    8: {
      title: "Performing for Money: They're an Asset",
      topic: "Commodification",
      scene: "{childName} is 8. Earning money through performance.",
      choices: {
        connect: { text: "Value them beyond their earnings.", consequence: "{childName} feels worthy." },
        teach: { text: "Discuss that their work has value.", consequence: "They understand economics." },
        boundary: { text: "They're not just assets.", consequence: "They're secure." },
        avoid: { text: "Exploit them for money.", consequence: "{childName} internalizes being used." },
        harm: { text: "Tell them their only value is earnings.", consequence: "{childName} internalizes instrumentality." }
      }
    },
    9: {
      title: "Peer Relationships: Constantly Changing",
      topic: "Unstable friendships",
      scene: "{childName} is 9. Friends change with every town.",
      choices: {
        connect: { text: "Help them develop meaningful connections.", consequence: "{childName} has bonds." },
        teach: { text: "Discuss that they're capable of friendship.", consequence: "They believe it." },
        boundary: { text: "Real friendships are possible.", consequence: "They're secure." },
        avoid: { text: "Tell them friendship is impossible.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them people are temporary.", consequence: "{childName} internalizes disconnection." }
      }
    },
    10: {
      title: "Staying Vs. Leaving: Loyalty to Circus Family",
      topic: "Family obligation",
      scene: "{childName} is 10. Understanding they could theoretically leave.",
      choices: {
        connect: { text: "Support their choices.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss that they have options.", consequence: "They see possibilities." },
        boundary: { text: "They have agency.", consequence: "They're free." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them leaving is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    },
    11: {
      title: "Adolescence: Normal Life Fantasies",
      topic: "Identity questioning",
      scene: "{childName} is 11. Wondering about normal school life.",
      choices: {
        connect: { text: "Support their questions.", consequence: "{childName} thinks critically." },
        teach: { text: "Discuss both circus and normal life.", consequence: "They see options." },
        boundary: { text: "They can choose their path.", consequence: "They're empowered." },
        avoid: { text: "Shame them for wanting normal.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them normal is boring.", consequence: "{childName} suppresses doubts." }
      }
    },
    12: {
      title: "Dating & Relationships: Moving Romance",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them navigate moving relationships.", consequence: "They navigate." },
        boundary: { text: "Relationships can be real.", consequence: "They're secure." },
        avoid: { text: "Tell them long-distance is impossible.", consequence: "{childName} isolates." },
        harm: { text: "Tell them to not get attached.", consequence: "{childName} internalizes disconnection." }
      }
    },
    13: {
      title: "School Attendance: Truancy or Homeschooling?",
      topic: "Educational status",
      scene: "{childName} is 13. Education system is complicated.",
      choices: {
        connect: { text: "Ensure they get full education.", consequence: "{childName} is educated." },
        teach: { text: "Find legitimate schooling options.", consequence: "They learn." },
        boundary: { text: "Education is their right.", consequence: "They're supported." },
        avoid: { text: "Neglect formal education.", consequence: "{childName} falls behind." },
        harm: { text: "Tell them circus education is enough.", consequence: "{childName} has gaps." }
      }
    },
    14: {
      title: "Injury: What If They Can't Perform?",
      topic: "Identity dependence",
      scene: "{childName} is 14. Imagining life without circus ability.",
      choices: {
        connect: { text: "Help them develop identity beyond performance.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're valuable beyond acts.", consequence: "They feel worthy." },
        boundary: { text: "Their worth isn't performance-dependent.", consequence: "They're secure." },
        avoid: { text: "Make them feel worthless without circus.", consequence: "{childName} internalizes dependence." },
        harm: { text: "Tell them injury means worthlessness.", consequence: "{childName} internalizes depersonalization." }
      }
    },
    15: {
      title: "College Planning: Escape the Circus?",
      topic: "Future independence",
      scene: "{childName} is 15. Considering life beyond circus.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss educational and career options.", consequence: "They see paths." },
        boundary: { text: "They can build different lives.", consequence: "Autonomy is possible." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them they'll fail without circus.", consequence: "{childName} internalizes limitation." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Stability",
      topic: "Romantic commitment",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them navigate stability within circus.", consequence: "They negotiate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make partner uncomfortable.", consequence: "{childName} feels torn." },
        harm: { text: "Tell them partner will leave.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Parents: Why the Circus?",
      topic: "Parental choices",
      scene: "{childName} is 17. Can they understand why parents chose this?",
      choices: {
        connect: { text: "Share parents' perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that people love different things.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding doesn't mean you must stay.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them 'parents are running away.'", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Circus or Different Life?",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about both lives.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} might resent." },
        harm: { text: "Tell them leaving is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    }
  },

  superhero_coparent: {
    1: {
      title: "Born to Superhero Parent",
      topic: "Super responsibilities",
      scene: "{childName} is born to parent(s) with superhero identity.",
      choices: {
        connect: { text: "Love them beyond their parent's powers.", consequence: "{childName} feels wanted." },
        teach: { text: "Create normal childhood within super context.", consequence: "They're still a child." },
        boundary: { text: "They're not sidekick or asset.", consequence: "They're a person." },
        avoid: { text: "Train them as junior hero immediately.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them 'you must have powers too.'", consequence: "{childName} internalizes pressure." }
      }
    },
    2: {
      title: "Secret Identity: Knowing the Truth",
      topic: "Hidden reality",
      scene: "{childName} is 2-3. Learning parent has secret identity.",
      choices: {
        connect: { text: "Help them keep secret safely.", consequence: "{childName} feels trusted." },
        teach: { text: "Discuss that secrets protect family.", consequence: "They understand." },
        boundary: { text: "Secret-keeping is love.", consequence: "They're secure." },
        avoid: { text: "Make secrecy feel burdensome.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them 'if anyone knows, family is in danger.'", consequence: "{childName} internalizes terror." }
      }
    },
    3: {
      title: "Parent Missing: Called Away for Emergency",
      topic: "Unpredictable absence",
      scene: "{childName} is 3-4. Parent called away mid-bedtime.",
      choices: {
        connect: { text: "Provide comfort despite parent's absence.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand emergency.", consequence: "They grasp importance." },
        boundary: { text: "Parent always comes back.", consequence: "They're secure." },
        avoid: { text: "Make absences feel like abandonment.", consequence: "{childName} internalizes rejection." },
        harm: { text: "Tell them 'parent loves saving world more.'", consequence: "{childName} internalizes inadequacy." }
      }
    },
    4: {
      title: "School: Explaining Parent's Unusual Schedule",
      topic: "Public explanation",
      scene: "{childName} is in school. Teachers notice parent pattern.",
      choices: {
        connect: { text: "Help them explain with confidence.", consequence: "{childName} is secure." },
        teach: { text: "Develop cover story together.", consequence: "They manage well." },
        boundary: { text: "Their explanation is theirs.", consequence: "They're empowered." },
        avoid: { text: "Make them feel ashamed of parent.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them to lie constantly.", consequence: "{childName} internalizes dishonesty." }
      }
    },
    5: {
      title: "Parent Injured: Hero Gets Hurt",
      topic: "Parental vulnerability",
      scene: "{childName} is 5-6. Parent comes home badly injured.",
      choices: {
        connect: { text: "Process injury with compassion.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand heroism has costs.", consequence: "They grasp reality." },
        boundary: { text: "Injury is serious but survivable.", consequence: "They're secure." },
        avoid: { text: "Expose them to graphic injury.", consequence: "{childName} is traumatized." },
        harm: { text: "Tell them 'parent might die.'", consequence: "{childName} internalizes terror." }
      }
    },
    6: {
      title: "Identity: Are They Proud or Ashamed?",
      topic: "Self-understanding",
      scene: "{childName} is 6. How do they feel about superhero parent?",
      choices: {
        connect: { text: "Support whatever feelings they have.", consequence: "{childName} is authentic." },
        teach: { text: "Discuss that both pride and worry are normal.", consequence: "They understand complexity." },
        boundary: { text: "Their feelings are valid.", consequence: "They're secure." },
        avoid: { text: "Force pride.", consequence: "{childName} suppresses feelings." },
        harm: { text: "Tell them they should be ashamed.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "Training Talks: 'You Could Be a Hero Too'",
      topic: "Pressure to inherit role",
      scene: "{childName} is 7. Parent begins discussing their potential.",
      choices: {
        connect: { text: "Support their own choices about powers.", consequence: "{childName} decides freely." },
        teach: { text: "Discuss that they have options.", consequence: "They see possibilities." },
        boundary: { text: "Heroism is a choice, not destiny.", consequence: "They're free." },
        avoid: { text: "Pressure them into training.", consequence: "{childName} loses autonomy." },
        harm: { text: "Tell them 'you have to be a hero.'", consequence: "{childName} internalizes obligation." }
      }
    },
    8: {
      title: "Recognizing Parent on News: Public Knowledge Leaks",
      topic: "Secret exposure",
      scene: "{childName} is 8. They spot parent on news footage.",
      choices: {
        connect: { text: "Discuss what they saw.", consequence: "{childName} feels heard." },
        teach: { text: "Help them understand news dynamics.", consequence: "They're informed." },
        boundary: { text: "News doesn't change reality.", consequence: "They're secure." },
        avoid: { text: "Blame them for noticing.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them secret is in danger.", consequence: "{childName} internalizes anxiety." }
      }
    },
    9: {
      title: "Peer Knowledge: Friends Know Parent's Secret?",
      topic: "Secret burden",
      scene: "{childName} is 9. One friend suspects or knows.",
      choices: {
        connect: { text: "Help them decide who to trust.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss trust carefully.", consequence: "They think critically." },
        boundary: { text: "They can have confidants.", consequence: "They're not alone." },
        avoid: { text: "Forbid all friendships.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them no one can know.", consequence: "{childName} internalizes complete isolation." }
      }
    },
    10: {
      title: "Real Danger: Villains Targeting Parent",
      topic: "Existential threat",
      scene: "{childName} is 10. Learning parent has enemies.",
      choices: {
        connect: { text: "Prepare them without traumatizing.", consequence: "{childName} is informed." },
        teach: { text: "Discuss that parent can protect them.", consequence: "They feel safe." },
        boundary: { text: "Danger is real but manageable.", consequence: "They're secure." },
        avoid: { text: "Expose them to danger.", consequence: "{childName} is traumatized." },
        harm: { text: "Tell them 'we might be killed.'", consequence: "{childName} internalizes constant terror." }
      }
    },
    11: {
      title: "Adolescence: Want Powers Too? Or Different Path?",
      topic: "Identity formation",
      scene: "{childName} is 11. Deciding their own path.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss all possibilities.", consequence: "They see options." },
        boundary: { text: "Their path is their own.", consequence: "They're empowered." },
        avoid: { text: "Tell them they must be hero.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them non-heroes are worthless.", consequence: "{childName} internalizes pressure." }
      }
    },
    12: {
      title: "Dating & Relationships: How Much to Tell Partner?",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops naturally." },
        teach: { text: "Help them decide about disclosure.", consequence: "They navigate." },
        boundary: { text: "They choose what to share.", consequence: "They're empowered." },
        avoid: { text: "Tell them not to date.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them partners can't handle truth.", consequence: "{childName} internalizes that relationships = dishonesty." }
      }
    },
    13: {
      title: "First Real Fight: Parent Needs Them as Backup",
      topic: "Unwanted responsibility",
      scene: "{childName} is 13. Parent wants them to help with villain.",
      choices: {
        connect: { text: "Protect them from being weaponized.", consequence: "{childName} is safe." },
        teach: { text: "Help them understand why they can't help yet.", consequence: "They grasp it." },
        boundary: { text: "They have right to safety.", consequence: "They're protected." },
        avoid: { text: "Let them fight unprepared.", consequence: "{childName} is injured." },
        harm: { text: "Tell them parent's life depends on them.", consequence: "{childName} internalizes impossible burden." }
      }
    },
    14: {
      title: "Powers Developing? Or Not?",
      topic: "Genetic uncertainty",
      scene: "{childName} is 14. Waiting to see if powers manifest.",
      choices: {
        connect: { text: "Support them with or without powers.", consequence: "{childName} feels worthy." },
        teach: { text: "Discuss that powers don't define value.", consequence: "They understand worth." },
        boundary: { text: "They're valuable either way.", consequence: "They're secure." },
        avoid: { text: "Make them feel inadequate without powers.", consequence: "{childName} internalizes inferiority." },
        harm: { text: "Tell them they're useless without powers.", consequence: "{childName} internalizes that they = their powers." }
      }
    },
    15: {
      title: "College Planning: Normal Life or Hero Training?",
      topic: "Future paths",
      scene: "{childName} is 15. Deciding their direction.",
      choices: {
        connect: { text: "Support their choice.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss both paths honestly.", consequence: "They think critically." },
        boundary: { text: "Their life is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Tell them they must train.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them normal is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Danger",
      topic: "Romantic risk",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them navigate danger with partner.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Tell them relationship is too risky.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them partner will be killed.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Parent: Hero Burden",
      topic: "Parental sacrifice",
      scene: "{childName} is 17. Can they understand parent's burden?",
      choices: {
        connect: { text: "Share parent's perspective with compassion.", consequence: "{childName} understands." },
        teach: { text: "Discuss that heroes sacrifice.", consequence: "Empathy deepens." },
        boundary: { text: "Understanding doesn't mean you owe same.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them 'parent loves duty more than you.'", consequence: "{childName} internalizes rejection." }
      }
    },
    18: {
      title: "Adult Choice: Hero or Not?",
      topic: "Self-determination",
      scene: "{childName} is 18. Their ultimate choice.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about duty and happiness.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must be hero.", consequence: "{childName} might resent." },
        harm: { text: "Tell them non-heroes are worthless.", consequence: "{childName} internalizes pressure." }
      }
    }
  }
};