export const SPECIAL_START_YEARLY_BEATS__INSANE_01 = {
  mafia_family: {
    1: {
      title: "Born Into the Life",
      topic: "Organized crime heritage",
      scene: "{childName} is born into established mafia family.",
      choices: {
        connect: { text: "Love them despite family business.", consequence: "{childName} feels wanted." },
        teach: { text: "Explain family as normal.", consequence: "They accept reality." },
        boundary: { text: "They're innocent of family choices.", consequence: "They're a child." },
        avoid: { text: "Make them feel shame immediately.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'this is your destiny.'", consequence: "{childName} internalizes entrapment." }
      }
    },
    2: {
      title: "Protected by Family: Nothing Bad Touches Them",
      topic: "Mafia protection",
      scene: "{childName} is 2-3. Family wealth and power protect them.",
      choices: {
        connect: { text: "Create safe childhood within system.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand family structure.", consequence: "They normalize it." },
        boundary: { text: "Childhood is protected.", consequence: "They're innocent." },
        avoid: { text: "Expose them to violence.", consequence: "{childName} internalizes terror." },
        harm: { text: "Tell them danger is always near.", consequence: "{childName} becomes hypervigilant." }
      }
    },
    3: {
      title: "Learning the Family Business Exists",
      topic: "Awareness of crime",
      scene: "{childName} is 3-4. Beginning to understand family isn't normal.",
      choices: {
        connect: { text: "Age-appropriately acknowledge reality.", consequence: "{childName} understands." },
        teach: { text: "Explain business without detail.", consequence: "They grasp basics." },
        boundary: { text: "They're not responsible for family.", consequence: "They're innocent." },
        avoid: { text: "Hide completely.", consequence: "{childName} invents worse stories." },
        harm: { text: "Tell them crime is what families do.", consequence: "{childName} internalizes normality." }
      }
    },
    4: {
      title: "School: The Lie They Tell Everyone",
      topic: "Public cover story",
      scene: "{childName} is in school. Must hide family business.",
      choices: {
        connect: { text: "Help them navigate lie without shame.", consequence: "{childName} manages well." },
        teach: { text: "Discuss that some things are private.", consequence: "They understand." },
        boundary: { text: "Lying for safety is different.", consequence: "They're secure." },
        avoid: { text: "Make them feel dishonest.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'everyone would hate us if they knew.'", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "Seeing a Problem: Peer's Parent Gets 'Business'",
      topic: "Witnessing consequences",
      scene: "{childName} is 5-6. Realizes peers have disappeared or parents are hurt.",
      choices: {
        connect: { text: "Help them process without traumatizing.", consequence: "{childName} understands reality." },
        teach: { text: "Discuss that this is serious.", consequence: "They grasp gravity." },
        boundary: { text: "They're not responsible.", consequence: "They're innocent." },
        avoid: { text: "Let them witness violence.", consequence: "{childName} is traumatized." },
        harm: { text: "Tell them 'that's what happens to enemies.'", consequence: "{childName} internalizes threat." }
      }
    },
    6: {
      title: "Identity: Mafia Kid",
      topic: "Self-understanding",
      scene: "{childName} is 6. Understanding their unique position.",
      choices: {
        connect: { text: "Support identity without glorifying crime.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're more than family.", consequence: "They develop self." },
        boundary: { text: "Family identity doesn't define worth.", consequence: "They're secure." },
        avoid: { text: "Make family identity their only identity.", consequence: "{childName} becomes entrenched." },
        harm: { text: "Tell them 'you're mafia, that's your future.'", consequence: "{childName} internalizes entrapment." }
      }
    },
    7: {
      title: "Loyalty Testing: Family First Always",
      topic: "Duty and obligation",
      scene: "{childName} is 7. Learning that loyalty to family is absolute.",
      choices: {
        connect: { text: "Support appropriate loyalty without coercion.", consequence: "{childName} is secure." },
        teach: { text: "Discuss that loyalty has limits.", consequence: "They develop ethics." },
        boundary: { text: "Loyalty doesn't mean blind obedience.", consequence: "They're secure." },
        avoid: { text: "Demand absolute loyalty.", consequence: "{childName} becomes repressed." },
        harm: { text: "Tell them 'betrayal means death.'", consequence: "{childName} internalizes terror." }
      }
    },
    8: {
      title: "Money: Everything They Could Want",
      topic: "Corruption of ease",
      scene: "{childName} is 8. Any desire is instantly satisfied.",
      choices: {
        connect: { text: "Teach gratitude and consequences of crime money.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that money has moral weight.", consequence: "They think critically." },
        boundary: { text: "Money doesn't solve everything.", consequence: "They're wise." },
        avoid: { text: "Let them become entitled.", consequence: "{childName} becomes spoiled." },
        harm: { text: "Tell them 'this is what crime provides.'", consequence: "{childName} internalizes crime as acceptable." }
      }
    },
    9: {
      title: "Peer Relationships: Friends or Leverage?",
      topic: "Relationship authenticity",
      scene: "{childName} is 9. Unsure if peers like them or fear family.",
      choices: {
        connect: { text: "Help them develop genuine friendships.", consequence: "{childName} has real friends." },
        teach: { text: "Discuss authentic connection.", consequence: "They understand." },
        boundary: { text: "Real friendship exists despite family.", consequence: "They're confident." },
        avoid: { text: "Tell them no one genuinely likes them.", consequence: "{childName} becomes cynical." },
        harm: { text: "Tell them to use fear strategically.", consequence: "{childName} internalizes manipulation." }
      }
    },
    10: {
      title: "Understanding the Business: What Exactly Happens?",
      topic: "Moral clarity",
      scene: "{childName} is 10. Old enough to understand family crimes.",
      choices: {
        connect: { text: "Be honest about crimes without traumatizing.", consequence: "{childName} understands." },
        teach: { text: "Discuss moral complexity.", consequence: "They think critically." },
        boundary: { text: "Understanding doesn't mean accepting.", consequence: "They're secure." },
        avoid: { text: "Hide details.", consequence: "{childName} invents worse." },
        harm: { text: "Tell them crimes are justified.", consequence: "{childName} internalizes justification." }
      }
    },
    11: {
      title: "Adolescence: Could They Do This?",
      topic: "Identity questioning",
      scene: "{childName} is 11. Wondering if they could become like family.",
      choices: {
        connect: { text: "Support questioning their path.", consequence: "{childName} develops agency." },
        teach: { text: "Discuss choices and consequences.", consequence: "They see options." },
        boundary: { text: "They can choose differently.", consequence: "They're empowered." },
        avoid: { text: "Tell them family path is inevitable.", consequence: "{childName} feels trapped." },
        harm: { text: "Begin recruitment into family business.", consequence: "{childName} internalizes entrapment." }
      }
    },
    12: {
      title: "Dating & Relationships: Power Dynamics",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops normally." },
        teach: { text: "Help them understand healthy dynamics.", consequence: "They develop ethics." },
        boundary: { text: "Dating is about connection, not power.", consequence: "They're secure." },
        avoid: { text: "Let them use family power in dating.", consequence: "{childName} becomes controlling." },
        harm: { text: "Tell them partners are subordinates.", consequence: "{childName} internalizes power corruption." }
      }
    },
    13: {
      title: "Pressure to Enter Business: Subtle or Direct?",
      topic: "Family recruitment",
      scene: "{childName} is 13. Family begins grooming them.",
      choices: {
        connect: { text: "Protect their childhood.", consequence: "{childName} is innocent." },
        teach: { text: "Help them see options beyond family.", consequence: "They see freedom." },
        boundary: { text: "They have agency.", consequence: "They're empowered." },
        avoid: { text: "Let family pressure mount.", consequence: "{childName} becomes trapped." },
        harm: { text: "Begin training them in business.", consequence: "{childName} internalizes entrapment." }
      }
    },
    14: {
      title: "First Task: Testing Their Loyalty",
      topic: "Initiation pressure",
      scene: "{childName} is 14. Family tests whether they'll participate.",
      choices: {
        connect: { text: "Support their refusal without punishment.", consequence: "{childName} is safe." },
        teach: { text: "Discuss that they can say no.", consequence: "They feel empowered." },
        boundary: { text: "They're not obligated.", consequence: "They're free." },
        avoid: { text: "Pressure them to comply.", consequence: "{childName} complies under duress." },
        harm: { text: "Punish refusal severely.", consequence: "{childName} internalizes coercion." }
      }
    },
    15: {
      title: "College Planning: Escape or Return?",
      topic: "Future independence",
      scene: "{childName} is 15. College could mean escape.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss that distance is possible.", consequence: "They see freedom." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Tell them they can't leave.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them betrayal of family means death.", consequence: "{childName} internalizes terror." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Family Threat",
      topic: "Protective violence",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Discuss protecting partners from family.", consequence: "They're protective." },
        boundary: { text: "Their relationship is theirs.", consequence: "They're free." },
        avoid: { text: "Use family power to intimidate partner.", consequence: "{childName} internalizes coercion." },
        harm: { text: "Threaten or harm the partner.", consequence: "{childName} internalizes that love means control." }
      }
    },
    17: {
      title: "Understanding Family: Why Crime?",
      topic: "Parental motivations",
      scene: "{childName} is 17. Can they understand family's choices?",
      choices: {
        connect: { text: "Share family history honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that circumstances drive choices.", consequence: "Empathy develops." },
        boundary: { text: "Understanding doesn't mean accepting.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them crime is inevitable.", consequence: "{childName} internalizes inevitability." }
      }
    },
    18: {
      title: "Adult Choice: Family or Freedom?",
      topic: "Self-determination",
      scene: "{childName} is 18. Making their own choice.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about consequences.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Coerce them into family business.", consequence: "{childName} might resent." },
        harm: { text: "Tell them rejecting family means death.", consequence: "{childName} internalizes terror." }
      }
    }
  },

  polygamist_doctor_indonesia: {
    1: {
      title: "Born to Polygamist Doctor Parent",
      topic: "Multiple mothers",
      scene: "{childName} is born to prestigious doctor with multiple wives.",
      choices: {
        connect: { text: "Love them fully in complex family.", consequence: "{childName} feels wanted." },
        teach: { text: "Explain multiple mothers naturally.", consequence: "They accept it." },
        boundary: { text: "All mothers are equally valid.", consequence: "They're secure." },
        avoid: { text: "Make them feel confused about mothers.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them one mother is 'real.'", consequence: "{childName} internalizes hierarchy." }
      }
    },
    2: {
      title: "Multiple Households: Rotating Between Mothers",
      topic: "Divided time",
      scene: "{childName} is 2-3. Spending time with different mothers.",
      choices: {
        connect: { text: "Create routine across households.", consequence: "{childName} adapts well." },
        teach: { text: "Help them normalize rotation.", consequence: "They accept it." },
        boundary: { text: "All homes are equally home.", consequence: "They're secure." },
        avoid: { text: "Make rotation feel chaotic.", consequence: "{childName} develops anxiety." },
        harm: { text: "Favor one mother over others.", consequence: "{childName} internalizes favoritism." }
      }
    },
    3: {
      title: "Half-Siblings: Many Brothers & Sisters",
      topic: "Large extended family",
      scene: "{childName} is 3-4. Living with many step/half siblings.",
      choices: {
        connect: { text: "Foster sibling bonds.", consequence: "{childName} has family." },
        teach: { text: "Discuss that all are equally siblings.", consequence: "They bond." },
        boundary: { text: "Family is large and loving.", consequence: "They're secure." },
        avoid: { text: "Create sibling rivalry.", consequence: "{childName} internalizes competition." },
        harm: { text: "Tell them some siblings matter more.", consequence: "{childName} internalizes hierarchy." }
      }
    },
    4: {
      title: "School: Explaining Family Structure",
      topic: "Public identity",
      scene: "{childName} is in school. Explaining multiple mothers.",
      choices: {
        connect: { text: "Help them explain with confidence.", consequence: "{childName} is secure." },
        teach: { text: "Discuss that families are diverse.", consequence: "They're proud." },
        boundary: { text: "Their family is valid.", consequence: "They're confident." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will judge them.", consequence: "{childName} becomes secretive." }
      }
    },
    5: {
      title: "Father's Prestige: Living in Privilege",
      topic: "Medical status",
      scene: "{childName} is 5-6. Father's status provides luxury.",
      choices: {
        connect: { text: "Teach gratitude for privilege.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that privilege comes with responsibility.", consequence: "They understand." },
        boundary: { text: "Money doesn't buy happiness.", consequence: "They're wise." },
        avoid: { text: "Let them become entitled.", consequence: "{childName} becomes spoiled." },
        harm: { text: "Tell them money is all that matters.", consequence: "{childName} internalizes materialism." }
      }
    },
    6: {
      title: "Identity: Who Is Their 'Real' Mother?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Questioning motherhood.",
      choices: {
        connect: { text: "Affirm that all mothers are real.", consequence: "{childName} is secure." },
        teach: { text: "Discuss that love doesn't divide.", consequence: "They understand." },
        boundary: { text: "Multiple mothers = multiple loves.", consequence: "They're confident." },
        avoid: { text: "Make them choose one mother.", consequence: "{childName} internalizes conflict." },
        harm: { text: "Tell them one mother is the 'real' one.", consequence: "{childName} internalizes hierarchy." }
      }
    },
    7: {
      title: "Mothers' Relationships: Tension or Cooperation?",
      topic: "Family dynamics",
      scene: "{childName} is 7. Aware of mothers' complex relationships.",
      choices: {
        connect: { text: "Shield them from adult conflict.", consequence: "{childName} is innocent." },
        teach: { text: "Help them understand without burden.", consequence: "They grasp complexity." },
        boundary: { text: "Mothers' conflicts aren't their problem.", consequence: "They're innocent." },
        avoid: { text: "Use them as messenger between mothers.", consequence: "{childName} internalizes burden." },
        harm: { text: "Force them to take sides.", consequence: "{childName} internalizes conflict." }
      }
    },
    8: {
      title: "Extended Family: Complex Relationships",
      topic: "Kinship networks",
      scene: "{childName} is 8. Many aunts, uncles, cousins.",
      choices: {
        connect: { text: "Help them navigate large family.", consequence: "{childName} has support." },
        teach: { text: "Discuss that they're not responsible for peace.", consequence: "They're innocent." },
        boundary: { text: "Family is large but manageable.", consequence: "They're secure." },
        avoid: { text: "Get them involved in family drama.", consequence: "{childName} internalizes burden." },
        harm: { text: "Tell them to choose sides.", consequence: "{childName} internalizes conflict." }
      }
    },
    9: {
      title: "Peer Understanding: Explaining Polygamy",
      topic: "Social integration",
      scene: "{childName} is 9. Peers ask about multiple mothers.",
      choices: {
        connect: { text: "Help them explain with pride.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that polygamy is accepted in their culture.", consequence: "They're proud." },
        boundary: { text: "Their family is valid.", consequence: "They're secure." },
        avoid: { text: "Tell them to hide family structure.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will judge them.", consequence: "{childName} becomes secretive." }
      }
    },
    10: {
      title: "Father's Authority: Patriarch Power",
      topic: "Power dynamics",
      scene: "{childName} is 10. Father's word is law.",
      choices: {
        connect: { text: "Support healthy respect for father.", consequence: "{childName} is secure." },
        teach: { text: "Discuss that authority has limits.", consequence: "They develop critical thinking." },
        boundary: { text: "Fathers aren't absolute rulers.", consequence: "They're empowered." },
        avoid: { text: "Make father's authority absolute.", consequence: "{childName} internalizes powerlessness." },
        harm: { text: "Tell them to obey without question.", consequence: "{childName} suppresses self." }
      }
    },
    11: {
      title: "Adolescence: Questioning Polygamy",
      topic: "Moral development",
      scene: "{childName} is 11. Adolescence brings questioning.",
      choices: {
        connect: { text: "Support their questioning.", consequence: "{childName} develops ethics." },
        teach: { text: "Discuss polygamy's complexities.", consequence: "They think critically." },
        boundary: { text: "They can develop their own values.", consequence: "They're empowered." },
        avoid: { text: "Tell them to accept without question.", consequence: "{childName} suppresses self." },
        harm: { text: "Tell them monogamy is superior/inferior.", consequence: "{childName} internalizes judgment." }
      }
    },
    12: {
      title: "Dating & Relationships: What Kind of Partner?",
      topic: "Romantic values",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops naturally." },
        teach: { text: "Help them develop relationship values.", consequence: "They think critically." },
        boundary: { text: "Their values are theirs to develop.", consequence: "They're empowered." },
        avoid: { text: "Push them toward polygamy.", consequence: "{childName} might rebel." },
        harm: { text: "Tell them monogamy is weakness.", consequence: "{childName} internalizes pressure." }
      }
    },
    13: {
      title: "Mothers' Health: Multiple Care Systems",
      topic: "Family complexity",
      scene: "{childName} is 13. Multiple mothers means multiple health concerns.",
      choices: {
        connect: { text: "Help them support mothers without overload.", consequence: "{childName} is compassionate." },
        teach: { text: "Discuss appropriate help.", consequence: "They're supportive." },
        boundary: { text: "They're not responsible for mothers' health.", consequence: "They're innocent." },
        avoid: { text: "Make them primary caregiver.", consequence: "{childName} loses adolescence." },
        harm: { text: "Blame them for mothers' illness.", consequence: "{childName} internalizes guilt." }
      }
    },
    14: {
      title: "Inheritance: Multiple Claims",
      topic: "Future wealth",
      scene: "{childName} is 14. Realizing inheritance complexity.",
      choices: {
        connect: { text: "Discuss inheritance fairly.", consequence: "{childName} understands." },
        teach: { text: "Explain multiple households complicate inheritance.", consequence: "They grasp complexity." },
        boundary: { text: "Fairness is possible.", consequence: "They're secure." },
        avoid: { text: "Create competition between mothers.", consequence: "{childName} internalizes conflict." },
        harm: { text: "Tell them only one mother's children matter.", consequence: "{childName} internalizes hierarchy." }
      }
    },
    15: {
      title: "College Planning: Escape or Duty?",
      topic: "Future independence",
      scene: "{childName} is 15. Planning college.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss that they can build their own life.", consequence: "They feel ready." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Tell them family needs them.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them leaving is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Family Complexity",
      topic: "Partner integration",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them explain family to partner.", consequence: "They communicate." },
        boundary: { text: "Their relationship is theirs.", consequence: "They're free." },
        avoid: { text: "Make partner uncomfortable.", consequence: "{childName} feels torn." },
        harm: { text: "Force partner to accept everything.", consequence: "{childName} internalizes coercion." }
      }
    },
    17: {
      title: "Understanding Polygamy: Why Father Chose This",
      topic: "Parental motivations",
      scene: "{childName} is 17. Can they understand father's choice?",
      choices: {
        connect: { text: "Share father's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that people have different values.", consequence: "Empathy develops." },
        boundary: { text: "Understanding doesn't mean approval.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them polygamy is wrong.", consequence: "{childName} internalizes shame." }
      }
    },
    18: {
      title: "Adult Life: Their Own Relationship Choices",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own life.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about relationships.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward polygamy.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they owe family tradition.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  closed_polygamist_compound: {
    1: {
      title: "Born Into Closed Community",
      topic: "Compound isolation",
      scene: "{childName} is born into closed polygamist compound.",
      choices: {
        connect: { text: "Love them fully despite isolation.", consequence: "{childName} feels wanted." },
        teach: { text: "Create stability within community.", consequence: "They feel secure." },
        boundary: { text: "They're innocent of community beliefs.", consequence: "They're a child." },
        avoid: { text: "Make compound feel like prison.", consequence: "{childName} internalizes confinement." },
        harm: { text: "Tell them 'outside world wants to destroy us.'", consequence: "{childName} internalizes fear." }
      }
    },
    2: {
      title: "Compound as Entire World: No Outside Reference",
      topic: "Total isolation",
      scene: "{childName} is 2-3. Compound is their only reality.",
      choices: {
        connect: { text: "Create joy and safety within bounds.", consequence: "{childName} is happy." },
        teach: { text: "Provide age-appropriate education.", consequence: "They learn." },
        boundary: { text: "Compound can be a good home.", consequence: "They're secure." },
        avoid: { text: "Make confinement feel oppressive.", consequence: "{childName} internalizes confinement." },
        harm: { text: "Tell them outside is evil.", consequence: "{childName} internalizes fear." }
      }
    },
    3: {
      title: "Multiple Parents: Many Mother Figures",
      topic: "Collective parenting",
      scene: "{childName} is 3-4. Many adults care for many children.",
      choices: {
        connect: { text: "Support secure attachments to multiple adults.", consequence: "{childName} has stable bonds." },
        teach: { text: "Help them understand shared parenting.", consequence: "They adapt." },
        boundary: { text: "Multiple caregivers can be loving.", consequence: "They're secure." },
        avoid: { text: "Make parenting feel impersonal.", consequence: "{childName} internalizes abandonment." },
        harm: { text: "Use emotional withdrawal as control.", consequence: "{childName} internalizes insecurity." }
      }
    },
    4: {
      title: "Compound School: Limited Education",
      topic: "Restricted learning",
      scene: "{childName} is in school-age. Learning only compound teachings.",
      choices: {
        connect: { text: "Provide the best education possible.", consequence: "{childName} learns well." },
        teach: { text: "Expand curriculum secretly if possible.", consequence: "They get more knowledge." },
        boundary: { text: "Education expands their mind.", consequence: "They're prepared." },
        avoid: { text: "Limit education deliberately.", consequence: "{childName} is intellectually stunted." },
        harm: { text: "Tell them critical thinking is evil.", consequence: "{childName} suppresses questioning." }
      }
    },
    5: {
      title: "Obedience: Absolute Authority of Leader",
      topic: "Cult control",
      scene: "{childName} is 5-6. Leader's word is absolute.",
      choices: {
        connect: { text: "Model respectful but questioning obedience.", consequence: "{childName} is secure." },
        teach: { text: "Help them develop critical thinking.", consequence: "They question appropriately." },
        boundary: { text: "Authority shouldn't be absolute.", consequence: "They're empowered." },
        avoid: { text: "Enforce blind obedience.", consequence: "{childName} suppresses self." },
        harm: { text: "Punish questioning severely.", consequence: "{childName} internalizes terror." }
      }
    },
    6: {
      title: "Identity: Compound Child",
      topic: "Self-understanding",
      scene: "{childName} is 6. Is this normal?",
      choices: {
        connect: { text: "Affirm their identity with gentle reality.", consequence: "{childName} is grounded." },
        teach: { text: "Age-appropriately suggest the world is larger.", consequence: "They wonder." },
        boundary: { text: "Their humanity is universal.", consequence: "They're secure." },
        avoid: { text: "Tell them compound is only right way.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them they're special/chosen.", consequence: "{childName} internalizes superiority." }
      }
    },
    7: {
      title: "Seeing the Walls: Literal and Psychological",
      topic: "Confinement awareness",
      scene: "{childName} is 7. Beginning to notice physical restrictions.",
      choices: {
        connect: { text: "Acknowledge reality without despair.", consequence: "{childName} understands." },
        teach: { text: "Discuss safety within reason.", consequence: "They grasp some necessity." },
        boundary: { text: "Restrictions have limits.", consequence: "They're secure." },
        avoid: { text: "Make confinement feel absolute.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Tell them outside will kill them.", consequence: "{childName} internalizes terror." }
      }
    },
    8: {
      title: "Forbidden Knowledge: What's Hidden From Them?",
      topic: "Information control",
      scene: "{childName} is 8. Realizing some things are hidden.",
      choices: {
        connect: { text: "Gently expand their understanding.", consequence: "{childName} is informed." },
        teach: { text: "Help them question appropriately.", consequence: "Critical thinking develops." },
        boundary: { text: "They deserve age-appropriate truth.", consequence: "They're secure." },
        avoid: { text: "Expand restrictions.", consequence: "{childName} internalizes being controlled." },
        harm: { text: "Punish curiosity.", consequence: "{childName} suppresses questioning." }
      }
    },
    9: {
      title: "Peer Relationships: Only Compound Peers",
      topic: "Social limitation",
      scene: "{childName} is 9. Only friends are compound members.",
      choices: {
        connect: { text: "Support meaningful compound friendships.", consequence: "{childName} has bonds." },
        teach: { text: "Discuss that friendship is valuable anywhere.", consequence: "They value connection." },
        boundary: { text: "Friendships can be real within limits.", consequence: "They're secure." },
        avoid: { text: "Control peer relationships.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them peers are their only choice.", consequence: "{childName} internalizes limitation." }
      }
    },
    10: {
      title: "Physical Restrictions: Can They Leave?",
      topic: "Freedom of movement",
      scene: "{childName} is 10. Understanding they cannot freely leave.",
      choices: {
        connect: { text: "Acknowledge reality with compassion.", consequence: "{childName} understands." },
        teach: { text: "Discuss that this is their home.", consequence: "They accept." },
        boundary: { text: "Home has value despite restrictions.", consequence: "They're secure." },
        avoid: { text: "Make restrictions feel like imprisonment.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them escape is impossible.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    11: {
      title: "Adolescence: Questioning Everything",
      topic: "Rebellion emerging",
      scene: "{childName} is 11. Adolescence brings questions.",
      choices: {
        connect: { text: "Support questioning with safety.", consequence: "{childName} develops ethics." },
        teach: { text: "Create space for doubt.", consequence: "They think critically." },
        boundary: { text: "They can question and stay safe.", consequence: "They're empowered." },
        avoid: { text: "Suppress questioning harshly.", consequence: "{childName} internalizes repression." },
        harm: { text: "Tell them doubt is evil.", consequence: "{childName} suppresses self." }
      }
    },
    12: {
      title: "Dating & Marriage: Arranged or Chosen?",
      topic: "Romantic autonomy",
      scene: "{childName} is 12. Future marriage discussed.",
      choices: {
        connect: { text: "Protect their choice in partners.", consequence: "{childName} has agency." },
        teach: { text: "Discuss that marriage should have consent.", consequence: "They understand." },
        boundary: { text: "They should choose their partner.", consequence: "They're empowered." },
        avoid: { text: "Arrange marriage without choice.", consequence: "{childName} internalizes powerlessness." },
        harm: { text: "Tell them marriage is non-negotiable duty.", consequence: "{childName} internalizes coercion." }
      }
    },
    13: {
      title: "First Taste of Outside: Glimpse or Contact?",
      topic: "World awareness",
      scene: "{childName} is 13. Brief outside contact or discovery.",
      choices: {
        connect: { text: "Process outside experience safely.", consequence: "{childName} integrates it." },
        teach: { text: "Discuss what they experienced.", consequence: "They wonder." },
        boundary: { text: "Outside is different, not evil.", consequence: "They're informed." },
        avoid: { text: "Punish outside contact harshly.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them they're corrupted.", consequence: "{childName} internalizes shame." }
      }
    },
    14: {
      title: "Secrets: Knowledge They're Not Supposed to Have",
      topic: "Information forbidden",
      scene: "{childName} is 14. Overhears or discovers forbidden knowledge.",
      choices: {
        connect: { text: "Process discovery without judgment.", consequence: "{childName} integrates it." },
        teach: { text: "Discuss what they discovered.", consequence: "They understand." },
        boundary: { text: "Knowledge is theirs to have.", consequence: "They're empowered." },
        avoid: { text: "Punish them for discovery.", consequence: "{childName} becomes secretive." },
        harm: { text: "Tell them they've sinned.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "Questioning Leader: Is Everything True?",
      topic: "Critical thinking",
      scene: "{childName} is 15. Doubting leader's teachings.",
      choices: {
        connect: { text: "Support their critical thinking.", consequence: "{childName} thinks clearly." },
        teach: { text: "Create safe space for doubt.", consequence: "They develop ethics." },
        boundary: { text: "They can question and stay safe.", consequence: "They're empowered." },
        avoid: { text: "Suppress doubt harshly.", consequence: "{childName} internalizes repression." },
        harm: { text: "Tell them doubt means expulsion.", consequence: "{childName} internalizes terror." }
      }
    },
    16: {
      title: "Escape Possibility: Can They Leave Safely?",
      topic: "Freedom emerging",
      scene: "{childName} is 16. Realizing they might escape.",
      choices: {
        connect: { text: "Support whatever choice they make.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss safety of leaving.", consequence: "They're informed." },
        boundary: { text: "They have agency.", consequence: "They're free." },
        avoid: { text: "Tell them escape is impossible.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them leaving means death.", consequence: "{childName} internalizes terror." }
      }
    },
    17: {
      title: "Understanding the Compound: How Did They Get Here?",
      topic: "Parental motivations",
      scene: "{childName} is 17. Can they understand parent's choice?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that people believe different things.", consequence: "Empathy develops." },
        boundary: { text: "Understanding doesn't mean accepting.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is evil.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Stay or Go?",
      topic: "Self-determination",
      scene: "{childName} is 18. Making their own choice.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about both worlds.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them leaving is death.", consequence: "{childName} internalizes terror." }
      }
    }
  },

  reality_tv_family: {
    1: {
      title: "Born Into Cameras",
      topic: "Constant documentation",
      scene: "{childName} is born. Parents are reality TV stars.",
      choices: {
        connect: { text: "Love them beyond the cameras.", consequence: "{childName} feels genuinely wanted." },
        teach: { text: "Create private family moments.", consequence: "They have authentic experiences." },
        boundary: { text: "They're not content first.", consequence: "They're a person." },
        avoid: { text: "Make every moment filmed.", consequence: "{childName} loses privacy." },
        harm: { text: "Tell them 'you exist for content.'", consequence: "{childName} internalizes instrumentality." }
      }
    },
    2: {
      title: "Public Property: Everyone Knows Them",
      topic: "Constant visibility",
      scene: "{childName} is 2-3. Already recognized in public.",
      choices: {
        connect: { text: "Protect private moments fiercely.", consequence: "{childName} has safe spaces." },
        teach: { text: "Help them understand being famous.", consequence: "They adapt." },
        boundary: { text: "Some moments are private.", consequence: "They're protected." },
        avoid: { text: "Expose them constantly.", consequence: "{childName} loses sense of privacy." },
        harm: { text: "Tell them 'everyone knows you.'", consequence: "{childName} internalizes surveillance." }
      }
    },
    3: {
      title: "Dramatic Moments for Ratings: Manufactured Drama",
      topic: "Authentic life vs. content",
      scene: "{childName} is 3-4. Parents create drama for show.",
      choices: {
        connect: { text: "Protect them from manufactured conflict.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand performance.", consequence: "They grasp difference." },
        boundary: { text: "Real life is separate from show.", consequence: "They're secure." },
        avoid: { text: "Use them in manufactured drama.", consequence: "{childName} internalizes that life is performance." },
        harm: { text: "Make their actual struggles into content.", consequence: "{childName} internalizes that pain is entertainment." }
      }
    },
    4: {
      title: "School: Famous Child",
      topic: "Social complications",
      scene: "{childName} is in school. Peers know about show.",
      choices: {
        connect: { text: "Help them navigate fame at school.", consequence: "{childName} handles it." },
        teach: { text: "Discuss that fame doesn't determine worth.", consequence: "They're grounded." },
        boundary: { text: "They're a person, not a celebrity.", consequence: "They're secure." },
        avoid: { text: "Let fame define them.", consequence: "{childName} internalizes that fame = worth." },
        harm: { text: "Tell them peers are jealous.", consequence: "{childName} internalizes isolation." }
      }
    },
    5: {
      title: "Authenticity Questions: What's Real?",
      topic: "Performance vs. reality",
      scene: "{childName} is 5-6. Beginning to question what's real.",
      choices: {
        connect: { text: "Be honest about what's authentic.", consequence: "{childName} understands." },
        teach: { text: "Discuss performance vs. reality.", consequence: "They grasp distinction." },
        boundary: { text: "Their real self is separate from show.", consequence: "They're secure." },
        avoid: { text: "Make everything performative.", consequence: "{childName} loses sense of self." },
        harm: { text: "Tell them there's no real self, only performance.", consequence: "{childName} internalizes depersonalization." }
      }
    },
    6: {
      title: "Identity: Are They Themselves or Characters?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their authentic self.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that they're more than show.", consequence: "They develop identity." },
        boundary: { text: "Their true self matters most.", consequence: "They're secure." },
        avoid: { text: "Make show persona their identity.", consequence: "{childName} loses authentic self." },
        harm: { text: "Tell them show personality is their real personality.", consequence: "{childName} internalizes false identity." }
      }
    },
    7: {
      title: "Social Media Comments: Reading What Public Says",
      topic: "Online judgment",
      scene: "{childName} is 7. Learning people comment on them online.",
      choices: {
        connect: { text: "Protect them from cruel comments.", consequence: "{childName} is safe." },
        teach: { text: "Help them understand online cruelty.", consequence: "They're informed." },
        boundary: { text: "Online strangers don't define them.", consequence: "They're secure." },
        avoid: { text: "Show them cruel comments.", consequence: "{childName} internalizes judgment." },
        harm: { text: "Tell them 'people hate you.'", consequence: "{childName} internalizes rejection." }
      }
    },
    8: {
      title: "Betrayal: Personal Moments Made Public",
      topic: "Privacy violation",
      scene: "{childName} is 8. Private struggles become show content.",
      choices: {
        connect: { text: "Protect their private struggles.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that some things should stay private.", consequence: "They understand." },
        boundary: { text: "Their struggles aren't entertainment.", consequence: "They're protected." },
        avoid: { text: "Use their struggles for ratings.", consequence: "{childName} internalizes that pain is entertainment." },
        harm: { text: "Tell them 'your pain is our job.'", consequence: "{childName} internalizes that suffering is commodity." }
      }
    },
    9: {
      title: "Money From Fame: Do They Understand?",
      topic: "Financial literacy",
      scene: "{childName} is 9. Money comes from their image.",
      choices: {
        connect: { text: "Teach them money value separate from image.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that their image generates income.", consequence: "They understand." },
        boundary: { text: "Money doesn't validate their existence.", consequence: "They're secure." },
        avoid: { text: "Tell them they exist to make money.", consequence: "{childName} internalizes instrumentality." },
        harm: { text: "Make them feel guilty for earning.", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Control: What Can They Say/Do On Camera?",
      topic: "Autonomy and performance",
      scene: "{childName} is 10. Parents control their image.",
      choices: {
        connect: { text: "Give them some control over their image.", consequence: "{childName} has agency." },
        teach: { text: "Discuss healthy boundaries.", consequence: "They understand." },
        boundary: { text: "They get to decide their image.", consequence: "They're empowered." },
        avoid: { text: "Make all decisions for them.", consequence: "{childName} internalizes powerlessness." },
        harm: { text: "Tell them to perform always.", consequence: "{childName} loses authentic self." }
      }
    },
    11: {
      title: "Adolescence: Wanting Privacy, Getting Exposure",
      topic: "Privacy and development",
      scene: "{childName} is 11. Adolescence makes exposure harder.",
      choices: {
        connect: { text: "Respect their emerging privacy needs.", consequence: "{childName} develops securely." },
        teach: { text: "Discuss that adolescence is private.", consequence: "They're understood." },
        boundary: { text: "They need privacy to develop.", consequence: "They're protected." },
        avoid: { text: "Increase exposure during adolescence.", consequence: "{childName} internalizes violation." },
        harm: { text: "Make adolescent struggles into content.", consequence: "{childName} internalizes that pain is entertainment." }
      }
    },
    12: {
      title: "Dating & Relationships: Public or Private?",
      topic: "Romantic privacy",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support private relationships.", consequence: "{childName} develops naturally." },
        teach: { text: "Discuss that dating should be private.", consequence: "They understand." },
        boundary: { text: "Their relationships are theirs.", consequence: "They're secure." },
        avoid: { text: "Make dating into content.", consequence: "{childName} internalizes that intimacy is performance." },
        harm: { text: "Tell them dating must be filmed.", consequence: "{childName} internalizes that intimacy is public." }
      }
    },
    13: {
      title: "Controversial Moments: Being Edited as Villain",
      topic: "Narrative control",
      scene: "{childName} is 13. Moment makes them look bad on show.",
      choices: {
        connect: { text: "Support them through distorted narrative.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that editing creates false narrative.", consequence: "They understand." },
        boundary: { text: "Truth matters more than ratings.", consequence: "They're secure." },
        avoid: { text: "Leave them to defend false narrative.", consequence: "{childName} internalizes shame." },
        harm: { text: "Support false narrative for ratings.", consequence: "{childName} internalizes being disposable." }
      }
    },
    14: {
      title: "Fan Obsession: People Know Intimate Details",
      topic: "Invasion of privacy",
      scene: "{childName} is 14. Fans know private details.",
      choices: {
        connect: { text: "Protect them from fan obsession.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand fan dynamics.", consequence: "They're informed." },
        boundary: { text: "Fans don't own them.", consequence: "They're secure." },
        avoid: { text: "Encourage fan obsession.", consequence: "{childName} internalizes invasion." },
        harm: { text: "Tell them fans own them.", consequence: "{childName} internalizes depersonalization." }
      }
    },
    15: {
      title: "College Planning: Want Out of Show?",
      topic: "Future independence",
      scene: "{childName} is 15. Considering life without show.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss both continuing or leaving.", consequence: "They see options." },
        boundary: { text: "Their life is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them they owe the show.", consequence: "{childName} internalizes obligation." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Public Scrutiny",
      topic: "Romantic exposure",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Protect their relationship privacy.", consequence: "{childName} develops safely." },
        teach: { text: "Discuss managing public interest.", consequence: "They navigate." },
        boundary: { text: "Their relationship is theirs.", consequence: "They're free." },
        avoid: { text: "Make relationship into content.", consequence: "{childName} internalizes that intimacy is performance." },
        harm: { text: "Subject partner to public criticism.", consequence: "{childName} feels responsible for partner's pain." }
      }
    },
    17: {
      title: "Understanding Parents' Choices: Why The Show?",
      topic: "Parental motivations",
      scene: "{childName} is 17. Can they understand parent's choice?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss money and fame motivations.", consequence: "They understand complexity." },
        boundary: { text: "Understanding doesn't mean accepting.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parents put show before them.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Life: Their Own Choices About Privacy",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own life.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about privacy and authenticity.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them back into entertainment.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they owe the show.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  time_loop_parent: {
    1: {
      title: "Born to Looping Parent",
      topic: "Impossible parent",
      scene: "{childName} is born. Parent is caught in time loop (reliving same day).",
      choices: {
        connect: { text: "Love them despite parent's impossible condition.", consequence: "{childName} feels wanted." },
        teach: { text: "Create stability within impossible situation.", consequence: "They feel secure." },
        boundary: { text: "They're not responsible for parent's curse.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like parent's burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'parent would undo your existence.'", consequence: "{childName} internalizes rejection." }
      }
    },
    2: {
      title: "Parent Remembers Everything, They Remember Nothing",
      topic: "Memory asymmetry",
      scene: "{childName} is 2-3. Parent remembers infinite loops, {childName} resets daily.",
      choices: {
        connect: { text: "Create consistency within uncertainty.", consequence: "{childName} feels secure." },
        teach: { text: "Help them develop trust despite reset.", consequence: "They feel safe." },
        boundary: { text: "They're innocent of parent's burden.", consequence: "They're a child." },
        avoid: { text: "Let them sense parent's despair.", consequence: "{childName} internalizes parent's pain." },
        harm: { text: "Tell them 'parent is losing their mind.'", consequence: "{childName} internalizes fear." }
      }
    },
    3: {
      title: "Parental Exhaustion: Infinite Attempts",
      topic: "Parental burnout",
      scene: "{childName} is 3-4. Parent is desperately trying to break loop.",
      choices: {
        connect: { text: "Protect them from parent's desperation.", consequence: "{childName} is safe." },
        teach: { text: "Age-appropriately explain parent's situation.", consequence: "They understand." },
        boundary: { text: "Parent's struggle isn't their responsibility.", consequence: "They're innocent." },
        avoid: { text: "Make them feel responsible for loop.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'parent's suffering is your fault.'", consequence: "{childName} internalizes guilt." }
      }
    },
    4: {
      title: "School: Parent Can't Remember Teacher Names",
      topic: "Parental limitation",
      scene: "{childName} is in school. Parent can't participate normally.",
      choices: {
        connect: { text: "Find other adults to support their school life.", consequence: "{childName} is supported." },
        teach: { text: "Help them understand parent's limitation.", consequence: "They're compassionate." },
        boundary: { text: "Parent's condition isn't their fault.", consequence: "They're innocent." },
        avoid: { text: "Let them feel unsupported at school.", consequence: "{childName} internalizes abandonment." },
        harm: { text: "Tell them 'parent doesn't care about school.'", consequence: "{childName} internalizes rejection." }
      }
    },
    5: {
      title: "Parent's Different Attempts: Each Loop Tries Something New",
      topic: "Unpredictability",
      scene: "{childName} is 5-6. Parent tries different parenting strategies daily.",
      choices: {
        connect: { text: "Create consistency despite parent's experiments.", consequence: "{childName} feels secure." },
        teach: { text: "Help them adapt to variation.", consequence: "They're resilient." },
        boundary: { text: "Variation isn't their fault.", consequence: "They're safe." },
        avoid: { text: "Let them be test subject.", consequence: "{childName} internalizes instability." },
        harm: { text: "Tell them 'parent is using you as experiment.'", consequence: "{childName} internalizes being used." }
      }
    },
    6: {
      title: "Identity: Who Is This Parent?",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who is the parent across resets?",
      choices: {
        connect: { text: "Affirm parent's love despite resets.", consequence: "{childName} feels loved." },
        teach: { text: "Explain that parent is same person.", consequence: "They understand." },
        boundary: { text: "Parent's condition doesn't change love.", consequence: "They're secure." },
        avoid: { text: "Make them unsure about parent.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them 'parent isn't real parent.'", consequence: "{childName} internalizes rejection." }
      }
    },
    7: {
      title: "Does Parent Know Something Will Happen?",
      topic: "Warning and anxiety",
      scene: "{childName} is 7. Parent warns them about bad things.",
      choices: {
        connect: { text: "Process warnings without traumatizing.", consequence: "{childName} is informed." },
        teach: { text: "Help them distinguish warning from prophecy.", consequence: "They're grounded." },
        boundary: { text: "Warnings don't guarantee harm.", consequence: "They're safe." },
        avoid: { text: "Let warnings create constant anxiety.", consequence: "{childName} becomes hypervigilant." },
        harm: { text: "Tell them 'bad things will definitely happen.'", consequence: "{childName} internalizes dread." }
      }
    },
    8: {
      title: "Exhausted Parent: Sometimes Gives Up",
      topic: "Parental collapse",
      scene: "{childName} is 8. Some loops parent is too exhausted to function.",
      choices: {
        connect: { text: "Find backup care on those days.", consequence: "{childName} is safe." },
        teach: { text: "Help them understand parent's limits.", consequence: "They're compassionate." },
        boundary: { text: "Parent's exhaustion isn't their fault.", consequence: "They're innocent." },
        avoid: { text: "Leave them to care for parent.", consequence: "{childName} parentifies." },
        harm: { text: "Tell them 'parent's exhaustion is your fault.'", consequence: "{childName} internalizes guilt." }
      }
    },
    9: {
      title: "Breaking the Loop: Is It Possible?",
      topic: "Hope and despair",
      scene: "{childName} is 9. Parent desperately trying to break loop.",
      choices: {
        connect: { text: "Support parent's efforts without burdening them.", consequence: "{childName} is supportive." },
        teach: { text: "Discuss that some things are beyond control.", consequence: "They're wise." },
        boundary: { text: "Breaking loop isn't their responsibility.", consequence: "They're innocent." },
        avoid: { text: "Make them feel responsible for solution.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'you can save parent.'", consequence: "{childName} internalizes impossible burden." }
      }
    },
    10: {
      title: "Parent's Different Personas: Loops Make Them Different",
      topic: "Psychological impact",
      scene: "{childName} is 10. Parent's personality shifts across loops.",
      choices: {
        connect: { text: "Help them understand core parent beneath shifts.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss that parent is same person underneath.", consequence: "They understand." },
        boundary: { text: "Shifts aren't their fault.", consequence: "They're secure." },
        avoid: { text: "Let personality shifts confuse them.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them 'parent has gone crazy.'", consequence: "{childName} internalizes fear." }
      }
    },
    11: {
      title: "Adolescence: Understanding Impossible Situation",
      topic: "Maturity",
      scene: "{childName} is 11. Old enough to grasp parent's plight.",
      choices: {
        connect: { text: "Share parent's perspective with compassion.", consequence: "{childName} is empathetic." },
        teach: { text: "Discuss infinity and suffering.", consequence: "They develop philosophical thinking." },
        boundary: { text: "They're not responsible for infinite suffering.", consequence: "They're innocent." },
        avoid: { text: "Make them feel responsible for parent.", consequence: "{childName} internalizes burden." },
        harm: { text: "Tell them 'parent would undo your existence.'", consequence: "{childName} internalizes rejection." }
      }
    },
    12: {
      title: "Dating & Relationships: Does Parent Remember?",
      topic: "Romantic complications",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops normally." },
        teach: { text: "Help them explain parent's situation to others.", consequence: "They navigate." },
        boundary: { text: "Their relationships are theirs.", consequence: "They're secure." },
        avoid: { text: "Make relationships complicated by parent's situation.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them 'parent will forget your partners.'", consequence: "{childName} internalizes loss." }
      }
    },
    13: {
      title: "Emotional Weight: Carrying Parent's Despair",
      topic: "Emotional burden",
      scene: "{childName} is 13. Aware of parent's infinite suffering.",
      choices: {
        connect: { text: "Help them process without absorbing.", consequence: "{childName} is compassionate but safe." },
        teach: { text: "Discuss that they're not responsible.", consequence: "They're unburdened." },
        boundary: { text: "Parent's suffering isn't their fault.", consequence: "They're safe." },
        avoid: { text: "Let them absorb parent's despair.", consequence: "{childName} becomes depressed." },
        harm: { text: "Tell them 'you should feel guilty.'", consequence: "{childName} internalizes guilt." }
      }
    },
    14: {
      title: "Philosophical Questions: Is This Real?",
      topic: "Reality questioning",
      scene: "{childName} is 14. Questioning reality itself.",
      choices: {
        connect: { text: "Discuss philosophy and reality.", consequence: "{childName} thinks deeply." },
        teach: { text: "Ground them in what's real.", consequence: "They're grounded." },
        boundary: { text: "Their life is real even if parent's isn't normal.", consequence: "They're secure." },
        avoid: { text: "Let reality questions destabilize them.", consequence: "{childName} becomes disconnected." },
        harm: { text: "Tell them 'nothing is real.'", consequence: "{childName} internalizes depersonalization." }
      }
    },
    15: {
      title: "College Planning: Escape or Responsibility?",
      topic: "Future independence",
      scene: "{childName} is 15. Planning college.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss that they can build their own life.", consequence: "They feel ready." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Guilt them into staying.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them 'you must save parent.'", consequence: "{childName} internalizes impossible burden." }
      }
    },
    16: {
      title: "Dating: Does Parent Get Reset Too?",
      topic: "Relationship paradox",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves openly." },
        teach: { text: "Help them navigate parent's reset.", consequence: "They communicate." },
        boundary: { text: "Their relationship is real.", consequence: "They're free." },
        avoid: { text: "Make parent's reset painful.", consequence: "{childName} feels loss." },
        harm: { text: "Tell them 'partner will be forgotten.'", consequence: "{childName} internalizes loss." }
      }
    },
    17: {
      title: "Understanding Parent's Curse: Origin and Meaning",
      topic: "Parental burden",
      scene: "{childName} is 17. Can they understand parent's plight?",
      choices: {
        connect: { text: "Share parent's perspective with compassion.", consequence: "{childName} understands." },
        teach: { text: "Discuss that parent is suffering infinitely.", consequence: "Empathy deepens." },
        boundary: { text: "Suffering isn't their responsibility.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent would undo their existence.", consequence: "{childName} internalizes rejection." }
      }
    },
    18: {
      title: "Adult Life: Living With Infinite Parent",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own life.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about accepting impossible.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must fix parent.", consequence: "{childName} internalizes burden." },
        harm: { text: "Tell them parent's suffering is their fault.", consequence: "{childName} internalizes guilt." }
      }
    }
  }
};