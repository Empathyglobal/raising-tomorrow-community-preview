export const SPECIAL_START_YEARLY_BEATS__TABOO_01 = {
  taboo_adult_entertainer: {
    1: {
      title: "Born to Parent With Secret Work",
      topic: "Hidden profession",
      scene: "{childName} is born. Parent works in adult entertainment industry.",
      choices: {
        connect: { text: "Love them fully despite complexity.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're grounded." },
        boundary: { text: "Parent's work doesn't define them.", consequence: "They're innocent." },
        avoid: { text: "Make them feel ashamed of parent.", consequence: "{childName} internalizes parent shame." },
        harm: { text: "Tell them parent's work is shameful.", consequence: "{childName} internalizes that parent = wrong." }
      }
    },
    2: {
      title: "Daycare and Caregiver: Keeping Work Secret",
      topic: "Professional secrecy",
      scene: "{childName} is 2-3. Parent carefully manages who knows.",
      choices: {
        connect: { text: "Create stability without judgment.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand privacy is normal.", consequence: "They grasp it." },
        boundary: { text: "Privacy protects them.", consequence: "They're safe." },
        avoid: { text: "Make them feel like they're hiding something shameful.", consequence: "{childName} internalizes that secrecy = shame." },
        harm: { text: "Tell them parent's job is bad.", consequence: "{childName} internalizes parent disapproval." }
      }
    },
    3: {
      title: "Questions: Why Does Parent Work at Night?",
      topic: "Schedule explanation",
      scene: "{childName} is 3-4. Asking about unusual schedule.",
      choices: {
        connect: { text: "Answer honestly without details.", consequence: "{childName} understands." },
        teach: { text: "Explain parents have different jobs.", consequence: "They grasp diversity." },
        boundary: { text: "Different jobs are okay.", consequence: "They're secure." },
        avoid: { text: "Make them suspicious and secretive.", consequence: "{childName} internalizes distrust." },
        harm: { text: "Tell them parent's work is wrong.", consequence: "{childName} internalizes judgment." }
      }
    },
    4: {
      title: "School: What Does Your Parent Do?",
      topic: "Social explanation",
      scene: "{childName} is in school. Peers ask what parent does.",
      choices: {
        connect: { text: "Help them develop honest simple answer.", consequence: "{childName} navigates." },
        teach: { text: "Discuss that not all jobs are explained.", consequence: "They understand privacy." },
        boundary: { text: "It's okay not to explain everything.", consequence: "They're protected." },
        avoid: { text: "Make them feel caught lying.", consequence: "{childName} internalizes shame about parent." },
        harm: { text: "Tell them they should be ashamed.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Identity: Who Is Parent Really?",
      topic: "Parental complexity",
      scene: "{childName} is 5-6. Beginning to understand parent has secret life.",
      choices: {
        connect: { text: "Help them see parent is multifaceted.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that people are complex.", consequence: "They understand." },
        boundary: { text: "Parent can be loved despite complexity.", consequence: "They're secure." },
        avoid: { text: "Make parent seem like stranger.", consequence: "{childName} internalizes that parent is deceiver." },
        harm: { text: "Tell them parent is hypocritical.", consequence: "{childName} internalizes judgment of parent." }
      }
    },
    6: {
      title: "Internet and Digital Age: Information Accessible",
      topic: "Digital exposure risk",
      scene: "{childName} is 6. Old enough to find things online.",
      choices: {
        connect: { text: "Proactively discuss before they find out.", consequence: "{childName} hears truth from parent." },
        teach: { text: "Help them understand work doesn't define worth.", consequence: "They're grounded." },
        boundary: { text: "Information doesn't change love.", consequence: "They're secure." },
        avoid: { text: "Hope they never find out.", consequence: "{childName} may find out harshly from others." },
        harm: { text: "Tell them parent is deceptive.", consequence: "{childName} internalizes trust issues." }
      }
    },
    7: {
      title: "Peer Jokes or Rumors: Potential Mockery",
      topic: "Social risk",
      scene: "{childName} is 7. Other kids might tease.",
      choices: {
        connect: { text: "Prepare them emotionally.", consequence: "{childName} feels prepared." },
        teach: { text: "Help them respond with confidence.", consequence: "They're empowered." },
        boundary: { text: "Their parent's worth isn't determined by others' judgment.", consequence: "They're secure." },
        avoid: { text: "Make them terrified of being discovered.", consequence: "{childName} internalizes hypervigilance." },
        harm: { text: "Tell them they deserve mockery.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Financial Reality: Parent's Income Visible",
      topic: "Class indicators",
      scene: "{childName} is 8. Noticing parent's income is higher than others.",
      choices: {
        connect: { text: "Help them understand work provides.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that money comes from honest work.", consequence: "They understand." },
        boundary: { text: "Parent's sacrifice is real.", consequence: "They're secure." },
        avoid: { text: "Make them feel guilty about benefits.", consequence: "{childName} internalizes shame about privilege." },
        harm: { text: "Tell them money is dirty.", consequence: "{childName} internalizes that support = wrong." }
      }
    },
    9: {
      title: "Puberty Conversations: The Talk",
      topic: "Sex education complication",
      scene: "{childName} is 9. Parent giving sex education talk.",
      choices: {
        connect: { text: "Let parent give talk with honesty.", consequence: "{childName} is informed." },
        teach: { text: "Help parent address elephant in room.", consequence: "They communicate." },
        boundary: { text: "Parent can discuss sexuality and still be respected.", consequence: "They're secure." },
        avoid: { text: "Make conversation impossibly awkward.", consequence: "{childName} suppresses questions." },
        harm: { text: "Tell them parent is hypocrite for giving talk.", consequence: "{childName} suppresses learning." }
      }
    },
    10: {
      title: "Growing Understanding: Finding Out Explicitly",
      topic: "Discovery",
      scene: "{childName} is 10. May find out about parent's work directly.",
      choices: {
        connect: { text: "Support them through discovery.", consequence: "{childName} processes it." },
        teach: { text: "Help them understand complexity.", consequence: "They're grounded." },
        boundary: { text: "Knowledge doesn't erase love.", consequence: "They're secure." },
        avoid: { text: "Tell them to hate parent.", consequence: "{childName} internalizes conflict." },
        harm: { text: "Tell them parent is immoral.", consequence: "{childName} internalizes judgment." }
      }
    },
    11: {
      title: "Adolescence: Complex Feelings Emerge",
      topic: "Teen emotional complexity",
      scene: "{childName} is 11. Dealing with conflicting feelings.",
      choices: {
        connect: { text: "Allow all feelings without judgment.", consequence: "{childName} processes emotion." },
        teach: { text: "Help them integrate knowledge and love.", consequence: "They develop nuance." },
        boundary: { text: "Complex feelings are okay.", consequence: "They're secure." },
        avoid: { text: "Force them to judge parent.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them they should be ashamed of parent.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Dating & Relationships: Disclosing Parent's Work",
      topic: "Romantic complication",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about disclosing.", consequence: "They navigate." },
        boundary: { text: "It's their choice what to share.", consequence: "They're empowered." },
        avoid: { text: "Tell them to hide parent.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them no one will accept them.", consequence: "{childName} internalizes isolation." }
      }
    },
    13: {
      title: "Safety and Boundaries: Protecting Them",
      topic: "Parental responsibility",
      scene: "{childName} is 13. Parent ensuring no content involves them.",
      choices: {
        connect: { text: "Respect parent's protective boundaries.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that parent is separating work from family.", consequence: "They understand." },
        boundary: { text: "Parent is protecting them.", consequence: "They're secure." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent is selfish.", consequence: "{childName} internalizes resentment." }
      }
    },
    14: {
      title: "Peer Knowledge: Friends Know or Find Out",
      topic: "Social integration",
      scene: "{childName} is 14. Friends may know about parent.",
      choices: {
        connect: { text: "Support them navigating peer knowledge.", consequence: "{childName} manages it." },
        teach: { text: "Help them discuss with friends.", consequence: "They navigate." },
        boundary: { text: "Friends' reactions don't define parent's worth.", consequence: "They're secure." },
        avoid: { text: "Make them feel permanently exposed.", consequence: "{childName} internalizes hypervigilance." },
        harm: { text: "Tell them they should expect rejection.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "College Planning: Moving Forward",
      topic: "Future independence",
      scene: "{childName} is 15. Planning education and future.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them build their own identity.", consequence: "They develop." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them parent's work limits them.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're marked by parent.", consequence: "{childName} internalizes that origin = destiny." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Full Story",
      topic: "Love and honesty",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them decide about sharing.", consequence: "They navigate." },
        boundary: { text: "Their choice what to share.", consequence: "They're empowered." },
        avoid: { text: "Make them hide truth.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them partner will leave.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    17: {
      title: "Understanding Parent: Complexity and Choices",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand parent's choices.",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss nuance without judgment.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding brings compassion.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is immoral.", consequence: "{childName} internalizes judgment." }
      }
    },
    18: {
      title: "Adult Choice: Own Path and Judgment",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their own values.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom without pressure.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must judge parent.", consequence: "{childName} might resent." },
        harm: { text: "Tell them parent's choices define theirs.", consequence: "{childName} internalizes that origin = destiny." }
      }
    }
  },

  taboo_anonymous_persona: {
    1: {
      title: "Born to Parent With Secret Online Life",
      topic: "Digital double life",
      scene: "{childName} is born. Parent maintains anonymous online persona.",
      choices: {
        connect: { text: "Love them fully despite hidden aspects.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're grounded." },
        boundary: { text: "Parent's private life doesn't define them.", consequence: "They're innocent." },
        avoid: { text: "Make them feel unsafe.", consequence: "{childName} internalizes that home = unstable." },
        harm: { text: "Tell them parent is deceiver.", consequence: "{childName} internalizes distrust." }
      }
    },
    2: {
      title: "Parent Distracted: Screen Time and Distance",
      topic: "Attention divided",
      scene: "{childName} is 2-3. Noticing parent spends time online.",
      choices: {
        connect: { text: "Ensure real connection time.", consequence: "{childName} bonds with parent." },
        teach: { text: "Help them not feel neglected.", consequence: "They feel valued." },
        boundary: { text: "Parent's online time isn't rejection.", consequence: "They're secure." },
        avoid: { text: "Make them feel like second priority.", consequence: "{childName} internalizes that they're unimportant." },
        harm: { text: "Tell them parent cares more about online world.", consequence: "{childName} internalizes abandonment." }
      }
    },
    3: {
      title: "Privacy Boundaries: Locked Devices and Rooms",
      topic: "Information control",
      scene: "{childName} is 3-4. Noticing parent's privacy measures.",
      choices: {
        connect: { text: "Create transparency within privacy.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand privacy is normal.", consequence: "They grasp it." },
        boundary: { text: "Privacy and love coexist.", consequence: "They're secure." },
        avoid: { text: "Make them feel excluded from parent.", consequence: "{childName} internalizes that closeness = violation." },
        harm: { text: "Tell them parent is hiding something bad.", consequence: "{childName} internalizes distrust." }
      }
    },
    4: {
      title: "School: Parent's Job Unclear",
      topic: "Vague professional identity",
      scene: "{childName} is in school. Can't clearly explain parent's work.",
      choices: {
        connect: { text: "Help them develop honest vague answer.", consequence: "{childName} navigates." },
        teach: { text: "Discuss that not all jobs are easily explained.", consequence: "They understand." },
        boundary: { text: "It's okay not to know everything.", consequence: "They're protected." },
        avoid: { text: "Make them feel caught.", consequence: "{childName} internalizes shame about parent." },
        harm: { text: "Tell them parent is suspicious.", consequence: "{childName} internalizes distrust." }
      }
    },
    5: {
      title: "Identity: Who Is Parent Behind Screens?",
      topic: "Parental mystery",
      scene: "{childName} is 5-6. Realizing parent is different online.",
      choices: {
        connect: { text: "Help them see parent is multifaceted.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that people have different contexts.", consequence: "They understand." },
        boundary: { text: "Multiple selves can be honest.", consequence: "They're secure." },
        avoid: { text: "Make parent seem like stranger.", consequence: "{childName} internalizes that parent is deceiver." },
        harm: { text: "Tell them parent is fake.", consequence: "{childName} internalizes distrust." }
      }
    },
    6: {
      title: "Technology Growing: What Can They Find?",
      topic: "Digital exposure",
      scene: "{childName} is 6. Getting access to technology.",
      choices: {
        connect: { text: "Teach healthy digital boundaries.", consequence: "{childName} is informed." },
        teach: { text: "Help them understand privacy.", consequence: "They respect it." },
        boundary: { text: "Everyone deserves privacy.", consequence: "They're secure." },
        avoid: { text: "Tell them to snoop.", consequence: "{childName} internalizes that violations are okay." },
        harm: { text: "Make them accidentally discover things.", consequence: "{childName} feels violated." }
      }
    },
    7: {
      title: "Internet Safety Talks: Parent as Authority",
      topic: "Authority paradox",
      scene: "{childName} is 7. Parent teaching internet safety.",
      choices: {
        connect: { text: "Support parent's genuine care about safety.", consequence: "{childName} learns safety." },
        teach: { text: "Help them understand parent wants to protect them.", consequence: "They believe." },
        boundary: { text: "Parent's advice is still valid.", consequence: "They're secure." },
        avoid: { text: "Make them cynical about advice.", consequence: "{childName} ignores genuine safety guidance." },
        harm: { text: "Tell them parent is hypocrite.", consequence: "{childName} suppresses learning." }
      }
    },
    8: {
      title: "Accidental Discovery: Seeing Parent's Persona",
      topic: "Unwanted truth",
      scene: "{childName} is 8. Accidentally discovers parent's online identity.",
      choices: {
        connect: { text: "Help them process discovery.", consequence: "{childName} processes shock." },
        teach: { text: "Facilitate conversation with parent.", consequence: "They communicate." },
        boundary: { text: "Accidents happen and can be overcome.", consequence: "They're secure." },
        avoid: { text: "Tell them to never speak of it.", consequence: "{childName} internalizes that truth = forbidden." },
        harm: { text: "Tell them parent is deceiver.", consequence: "{childName} internalizes distrust." }
      }
    },
    9: {
      title: "Peer Knowledge: Digital Spread",
      topic: "Privacy vulnerability",
      scene: "{childName} is 9. Information might spread among peers.",
      choices: {
        connect: { text: "Prepare them emotionally.", consequence: "{childName} feels prepared." },
        teach: { text: "Help them respond to questions.", consequence: "They're empowered." },
        boundary: { text: "Parent's privacy isn't their burden.", consequence: "They're protected." },
        avoid: { text: "Make them terrified of exposure.", consequence: "{childName} internalizes hypervigilance." },
        harm: { text: "Tell them they should be ashamed.", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Growing Up Online: Understanding Context",
      topic: "Digital sophistication",
      scene: "{childName} is 10. Understanding internet better.",
      choices: {
        connect: { text: "Help them understand digital complexity.", consequence: "{childName} is informed." },
        teach: { text: "Discuss why people use anonymity.", consequence: "They grasp reasons." },
        boundary: { text: "Anonymity has legitimate purposes.", consequence: "They're secure." },
        avoid: { text: "Tell them anonymity = deception.", consequence: "{childName} internalizes distrust." },
        harm: { text: "Tell them parent is criminal.", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Adolescence: Nuance and Judgment",
      topic: "Complex understanding",
      scene: "{childName} is 11. Processing complex feelings.",
      choices: {
        connect: { text: "Allow all feelings without judgment.", consequence: "{childName} processes emotion." },
        teach: { text: "Help them develop own standards.", consequence: "They think critically." },
        boundary: { text: "Complex feelings are okay.", consequence: "They're secure." },
        avoid: { text: "Force them to judge.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them they should hate parent.", consequence: "{childName} internalizes conflict." }
      }
    },
    12: {
      title: "Dating & Relationships: Trust Issues",
      topic: "Romantic fear",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them build healthy trust.", consequence: "They learn." },
        boundary: { text: "Trust is possible.", consequence: "They're worthy." },
        avoid: { text: "Make them paranoid about partners.", consequence: "{childName} internalizes distrust." },
        harm: { text: "Tell them everyone is deceiver.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    13: {
      title: "Digital Privacy: Own Boundaries",
      topic: "Self-protection",
      scene: "{childName} is 13. Developing own digital privacy.",
      choices: {
        connect: { text: "Support healthy boundaries.", consequence: "{childName} is empowered." },
        teach: { text: "Help them protect themselves.", consequence: "They're informed." },
        boundary: { text: "Their privacy is valid.", consequence: "They're secure." },
        avoid: { text: "Tell them privacy is suspicious.", consequence: "{childName} internalizes that privacy = bad." },
        harm: { text: "Violate their privacy.", consequence: "{childName} internalizes that boundaries don't exist." }
      }
    },
    14: {
      title: "Understanding Parent: Why Anonymity?",
      topic: "Reasons and complexity",
      scene: "{childName} is 14. Wanting to understand parent's choices.",
      choices: {
        connect: { text: "Have honest conversation.", consequence: "{childName} understands." },
        teach: { text: "Discuss various reasons for anonymity.", consequence: "They grasp nuance." },
        boundary: { text: "Understanding brings compassion.", consequence: "They're secure." },
        avoid: { text: "Refuse conversation.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them parent is immoral.", consequence: "{childName} internalizes judgment." }
      }
    },
    15: {
      title: "College Planning: Moving Forward",
      topic: "Future independence",
      scene: "{childName} is 15. Planning education and future.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them build their own identity.", consequence: "They develop." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them parent's choices limit them.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're marked by parent.", consequence: "{childName} internalizes that origin = destiny." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Trust",
      topic: "Love and honesty",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them build authentic trust.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "They're free." },
        avoid: { text: "Make them paranoid.", consequence: "{childName} sabotages love." },
        harm: { text: "Tell them partner will deceive them.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Parent: Integration and Acceptance",
      topic: "Parental journey",
      scene: "{childName} is 17. Ready to fully understand.",
      choices: {
        connect: { text: "Share parent's perspective.", consequence: "{childName} understands." },
        teach: { text: "Discuss complexity without judgment.", consequence: "They grasp humanity." },
        boundary: { text: "Understanding brings peace.", consequence: "They're secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is deceptive.", consequence: "{childName} internalizes judgment." }
      }
    },
    18: {
      title: "Adult Choice: Own Values and Boundaries",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their own values.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about authenticity.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them to judge parent.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they must hide too.", consequence: "{childName} internalizes that authenticity = impossible." }
      }
    }
  },

  taboo_double_life: {
    1: {
      title: "Born to Parent Living Double Life",
      topic: "Hidden identity",
      scene: "{childName} is born. Parent lives fundamentally different life in secret.",
      choices: {
        connect: { text: "Love them fully despite complexity.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're grounded." },
        boundary: { text: "Parent's secrets don't define them.", consequence: "They're innocent." },
        avoid: { text: "Make them feel unsafe.", consequence: "{childName} internalizes that safety = illusion." },
        harm: { text: "Tell them parent is deceiver.", consequence: "{childName} internalizes distrust." }
      }
    },
    2: {
      title: "Parent's Absences: Unexplained Trips",
      topic: "Mystery and distance",
      scene: "{childName} is 2-3. Noticing parent's frequent unexplained absences.",
      choices: {
        connect: { text: "Provide consistency with other parent/caregiver.", consequence: "{childName} feels secure." },
        teach: { text: "Create stable routines.", consequence: "They adapt." },
        boundary: { text: "Parent's absence isn't rejection.", consequence: "They're protected." },
        avoid: { text: "Make them feel abandoned.", consequence: "{childName} internalizes abandonment fear." },
        harm: { text: "Tell them parent doesn't care.", consequence: "{childName} internalizes unworthiness." }
      }
    },
    3: {
      title: "Phone Calls and Secrets: Parent's Privacy",
      topic: "Information control",
      scene: "{childName} is 3-4. Noticing parent keeps information private.",
      choices: {
        connect: { text: "Respect parent's boundaries.", consequence: "{childName} learns privacy is normal." },
        teach: { text: "Help them understand adults have private lives.", consequence: "They grasp it." },
        boundary: { text: "Privacy is healthy.", consequence: "They're secure." },
        avoid: { text: "Make them suspicious.", consequence: "{childName} internalizes that privacy = deception." },
        harm: { text: "Tell them parent is hiding something bad.", consequence: "{childName} internalizes distrust." }
      }
    },
    4: {
      title: "School: Conflicting Stories About Family",
      topic: "Narrative confusion",
      scene: "{childName} is in school. Parent's stories don't quite match.",
      choices: {
        connect: { text: "Help them develop simple honest answer.", consequence: "{childName} navigates." },
        teach: { text: "Discuss that family stories are complex.", consequence: "They understand." },
        boundary: { text: "It's okay not to explain everything.", consequence: "They're protected." },
        avoid: { text: "Make them feel caught in lies.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them parent is liar.", consequence: "{childName} internalizes distrust." }
      }
    },
    5: {
      title: "Identity: Unsettled Feelings About Parent",
      topic: "Unease",
      scene: "{childName} is 5-6. Feeling something is off without understanding why.",
      choices: {
        connect: { text: "Validate their intuition.", consequence: "{childName} trusts their feelings." },
        teach: { text: "Help them name what they're sensing.", consequence: "They develop awareness." },
        boundary: { text: "Their instincts are valid.", consequence: "They're secure." },
        avoid: { text: "Tell them they're imagining things.", consequence: "{childName} internalizes distrust of own perception." },
        harm: { text: "Tell them parent is deceptive.", consequence: "{childName} internalizes parent judgment." }
      }
    },
    6: {
      title: "Different Versions of Parent",
      topic: "Personality shift",
      scene: "{childName} is 6. Noticing parent acts differently in different contexts.",
      choices: {
        connect: { text: "Help them see people are complex.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that context shapes behavior.", consequence: "They understand." },
        boundary: { text: "People have different sides.", consequence: "They're secure." },
        avoid: { text: "Make parent seem like stranger.", consequence: "{childName} internalizes that parent is deceptive." },
        harm: { text: "Tell them parent is fake.", consequence: "{childName} internalizes distrust." }
      }
    },
    7: {
      title: "Lie Detection: Child Becoming Skeptical",
      topic: "Growing awareness",
      scene: "{childName} is 7. Starting to notice inconsistencies.",
      choices: {
        connect: { text: "Validate their observation.", consequence: "{childName} trusts their perception." },
        teach: { text: "Help them understand complexity.", consequence: "They grasp nuance." },
        boundary: { text: "Their perception is real.", consequence: "They're secure." },
        avoid: { text: "Gaslight them about inconsistencies.", consequence: "{childName} internalizes that their perception is wrong." },
        harm: { text: "Tell them parent is liar.", consequence: "{childName} internalizes parent judgment." }
      }
    },
    8: {
      title: "Accidental Discovery: Finding Evidence",
      topic: "Unwanted truth",
      scene: "{childName} is 8. Accidentally discovers proof of parent's other life.",
      choices: {
        connect: { text: "Help them process discovery.", consequence: "{childName} processes shock." },
        teach: { text: "Facilitate conversation with parent.", consequence: "They can communicate." },
        boundary: { text: "Accidents happen and can be overcome.", consequence: "They're secure." },
        avoid: { text: "Tell them to never speak of it.", consequence: "{childName} internalizes that truth = forbidden." },
        harm: { text: "Tell them parent is deceiver.", consequence: "{childName} internalizes deep distrust." }
      }
    },
    9: {
      title: "Keeping the Secret: Carrying Burden",
      topic: "Cognitive burden",
      scene: "{childName} is 9. Knows something parent doesn't want them to know.",
      choices: {
        connect: { text: "Release them from burden.", consequence: "{childName} feels freed." },
        teach: { text: "Help them communicate with parent.", consequence: "They're empowered." },
        boundary: { text: "Children shouldn't carry adult secrets.", consequence: "They're protected." },
        avoid: { text: "Tell them to keep secret.", consequence: "{childName} internalizes that complicity = love." },
        harm: { text: "Make secret seem shameful.", consequence: "{childName} internalizes that knowledge = guilt." }
      }
    },
    10: {
      title: "Growing Understanding: Piecing It Together",
      topic: "Integration of knowledge",
      scene: "{childName} is 10. Understanding double life more fully.",
      choices: {
        connect: { text: "Support their understanding.", consequence: "{childName} processes it." },
        teach: { text: "Help them integrate knowledge.", consequence: "They're grounded." },
        boundary: { text: "Knowledge doesn't change love.", consequence: "They're secure." },
        avoid: { text: "Tell them to pretend they don't know.", consequence: "{childName} internalizes that honesty = betrayal." },
        harm: { text: "Tell them parent is immoral.", consequence: "{childName} internalizes judgment." }
      }
    },
    11: {
      title: "Adolescence: Complex Feelings Explode",
      topic: "Teen emotional intensity",
      scene: "{childName} is 11. Dealing with complicated feelings.",
      choices: {
        connect: { text: "Allow all feelings without judgment.", consequence: "{childName} processes emotion." },
        teach: { text: "Help them develop own values.", consequence: "They think critically." },
        boundary: { text: "Complex feelings are okay.", consequence: "They're secure." },
        avoid: { text: "Force them to judge.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them they should hate parent.", consequence: "{childName} internalizes conflict." }
      }
    },
    12: {
      title: "Dating & Relationships: Trust Damage",
      topic: "Romantic impact",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them build healthy trust.", consequence: "They learn." },
        boundary: { text: "Trust is possible.", consequence: "They're worthy." },
        avoid: { text: "Make them paranoid about partners.", consequence: "{childName} internalizes distrust." },
        harm: { text: "Tell them everyone is deceptive.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    13: {
      title: "Confrontation: Knowing but Pretending",
      topic: "Emotional contradiction",
      scene: "{childName} is 13. Trapped between knowledge and pretense.",
      choices: {
        connect: { text: "Release them from pretense.", consequence: "{childName} feels freed." },
        teach: { text: "Facilitate honest conversation.", consequence: "They can communicate." },
        boundary: { text: "Honesty is healthy.", consequence: "They're secure." },
        avoid: { text: "Tell them to keep pretending.", consequence: "{childName} internalizes emotional suppression." },
        harm: { text: "Make honesty feel like betrayal.", consequence: "{childName} internalizes that truth = harmful." }
      }
    },
    14: {
      title: "Understanding Parent: Reasons Without Justification",
      topic: "Complex empathy",
      scene: "{childName} is 14. Wanting to understand parent's choices.",
      choices: {
        connect: { text: "Have honest conversation.", consequence: "{childName} understands." },
        teach: { text: "Help them separate understanding from approval.", consequence: "They develop nuance." },
        boundary: { text: "Understanding doesn't mean approval.", consequence: "They're secure." },
        avoid: { text: "Refuse conversation.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they must justify parent.", consequence: "{childName} internalizes burden." }
      }
    },
    15: {
      title: "College Planning: Escape or Understanding?",
      topic: "Future independence",
      scene: "{childName} is 15. Planning education and future.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them build identity beyond this.", consequence: "They develop." },
        boundary: { text: "Their future is theirs.", consequence: "They're secure." },
        avoid: { text: "Tell them they must stay.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them they're complicit in parent's lies.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Whether to Disclose",
      topic: "Love and secrets",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them decide what to share.", consequence: "They navigate." },
        boundary: { text: "It's their choice what to share.", consequence: "They're empowered." },
        avoid: { text: "Make them hide truth.", consequence: "{childName} internalizes that relationships = dishonest." },
        harm: { text: "Tell them partner will judge them.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Understanding Parent: Can They Forgive?",
      topic: "Redemption possibility",
      scene: "{childName} is 17. Processing whether forgiveness is possible.",
      choices: {
        connect: { text: "Support their own process.", consequence: "{childName} decides freely." },
        teach: { text: "Discuss that forgiveness is complex.", consequence: "They understand." },
        boundary: { text: "Their feelings are valid.", consequence: "They're secure." },
        avoid: { text: "Force forgiveness.", consequence: "{childName} internalizes pressure." },
        harm: { text: "Tell them they must hate parent.", consequence: "{childName} internalizes conflict." }
      }
    },
    18: {
      title: "Adult Choice: Own Values and Honesty",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their own values.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about authenticity.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them to repeat parent's pattern.", consequence: "{childName} might perpetuate cycle." },
        harm: { text: "Tell them honesty is impossible.", consequence: "{childName} internalizes that authenticity = failure." }
      }
    }
  }
};