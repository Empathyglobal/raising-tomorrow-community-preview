export const SPECIAL_START_YEARLY_BEATS__NORMAL_06 = {
  taboo_secret_bigamy: {
    1: {
      title: "Born Into Secret Family",
      topic: "Hidden family structure",
      scene: "{childName} is born. Their parent has another family elsewhere.",
      choices: {
        connect: { text: "Love them fully despite complexity.", consequence: "{childName} feels wanted." },
        teach: { text: "Create stability in their immediate family.", consequence: "They feel secure." },
        boundary: { text: "They're innocent of this situation.", consequence: "They're protected." },
        avoid: { text: "Make them feel like a secret shame.", consequence: "{childName} internalizes unwantedness." },
        harm: { text: "Tell them 'you're the other family.'", consequence: "{childName} internalizes rejection." }
      }
    },
    2: {
      title: "Parent's Divided Time",
      topic: "Parental absence pattern",
      scene: "{childName} grows up with parent who disappears for stretches.",
      choices: {
        connect: { text: "Create stable routine despite absences.", consequence: "{childName} feels secure." },
        teach: { text: "Explain absences gently.", consequence: "They adapt." },
        boundary: { text: "They're not responsible for parent's time.", consequence: "They're innocent." },
        avoid: { text: "Let absences be traumatic surprises.", consequence: "{childName} develops anxiety." },
        harm: { text: "Tell them 'parent doesn't care.'", consequence: "{childName} internalizes rejection." }
      }
    },
    3: {
      title: "Keeping the Secret: Being Quiet",
      topic: "Dangerous secrecy",
      scene: "{childName} is 3-4. Implicit message to keep family private.",
      choices: {
        connect: { text: "Protect their childhood despite secrecy.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand discretion without shame.", consequence: "They understand nuance." },
        boundary: { text: "They're not responsible for keeping secrets.", consequence: "Burden is eased." },
        avoid: { text: "Make them complicit in deception.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Punish them if they mention other family.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "School: Explaining Single-Parent Household",
      topic: "Public identity vs. private truth",
      scene: "{childName} is in school. Story is that parent is single.",
      choices: {
        connect: { text: "Keep their school life stable and unburdened.", consequence: "{childName} is secure." },
        teach: { text: "Help them understand public vs. private.", consequence: "They adapt." },
        boundary: { text: "School is safe space.", consequence: "They're protected." },
        avoid: { text: "Make them lie constantly.", consequence: "{childName} internalizes deception." },
        harm: { text: "Tell them they're responsible for lying.", consequence: "{childName} internalizes guilt." }
      }
    },
    5: {
      title: "Questions About Other Parent",
      topic: "Curiosity and confusion",
      scene: "{childName} is 5-6. Asking where their other parent is.",
      choices: {
        connect: { text: "Answer truthfully but age-appropriately.", consequence: "{childName} understands." },
        teach: { text: "Discuss that families are complicated.", consequence: "They grasp reality." },
        boundary: { text: "They deserve to know the truth.", consequence: "Trust is possible." },
        avoid: { text: "Make up stories about missing parent.", consequence: "{childName} internalizes lies." },
        harm: { text: "Tell them 'parent doesn't exist.'", consequence: "{childName} internalizes abandonment." }
      }
    },
    6: {
      title: "Other Family Might Exist: Do They Know?",
      topic: "Sibling awareness",
      scene: "{childName} is 6. Possibility that siblings exist elsewhere.",
      choices: {
        connect: { text: "Eventually tell them gently if/when appropriate.", consequence: "{childName} can process." },
        teach: { text: "Discuss that family is complex.", consequence: "They understand." },
        boundary: { text: "Knowledge is theirs to have.", consequence: "They're not deceived." },
        avoid: { text: "Keep them ignorant indefinitely.", consequence: "{childName} distrusts eventually." },
        harm: { text: "Use knowledge as punishment.", consequence: "{childName} internalizes trauma." }
      }
    },
    7: {
      title: "Parent's Guilt & Overcompensation",
      topic: "Emotional manipulation",
      scene: "{childName} is 7. Parent acts guilty about absences.",
      choices: {
        connect: { text: "Protect them from parent's guilt.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand guilt isn't their problem.", consequence: "Boundaries form." },
        boundary: { text: "They're not responsible for parent's emotions.", consequence: "They're a child." },
        avoid: { text: "Use them to manage parent's guilt.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them they caused parent's guilt.", consequence: "{childName} internalizes guilt." }
      }
    },
    8: {
      title: "Financial Impact: Resource Allocation",
      topic: "Economic strain",
      scene: "{childName} is 8. Family finances stretched thin due to secret obligations.",
      choices: {
        connect: { text: "Manage finances without burdening them.", consequence: "{childName} is secure." },
        teach: { text: "Explain financial reality simply.", consequence: "They understand." },
        boundary: { text: "They're not responsible for finances.", consequence: "Childhood is protected." },
        avoid: { text: "Make them feel financial burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'parent spends money on other family.'", consequence: "{childName} internalizes resentment." }
      }
    },
    9: {
      title: "The Secret Grows Heavier",
      topic: "Burden of secrecy",
      scene: "{childName} is 9. Secret knowledge feels like weight.",
      choices: {
        connect: { text: "Acknowledge burden without asking them to bear it.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss that adults keep secrets, not children.", consequence: "Boundary forms." },
        boundary: { text: "They shouldn't carry this secret.", consequence: "Burden is eased." },
        avoid: { text: "Rely on them to keep secret.", consequence: "{childName} internalizes responsibility." },
        harm: { text: "Threaten consequences if they tell.", consequence: "{childName} internalizes fear." }
      }
    },
    10: {
      title: "Peer Awareness: Fear of Exposure",
      topic: "Social shame",
      scene: "{childName} is 10. Terrified someone will find out.",
      choices: {
        connect: { text: "Ease their fear about social judgment.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that truth eventually comes out.", consequence: "Acceptance grows." },
        boundary: { text: "They're not ashamed of truth.", consequence: "They're secure." },
        avoid: { text: "Amplify their fear of exposure.", consequence: "{childName} becomes isolated." },
        harm: { text: "Use exposure threat as control.", consequence: "{childName} internalizes fear." }
      }
    },
    11: {
      title: "Discovery Risk: Truth Gets Closer",
      topic: "Approaching exposure",
      scene: "{childName} is 11. Someone might discover the truth.",
      choices: {
        connect: { text: "Prepare them for possible truth-telling.", consequence: "{childName} feels ready." },
        teach: { text: "Discuss that truth is better than lies.", consequence: "They find peace." },
        boundary: { text: "They're prepared for any outcome.", consequence: "They're strong." },
        avoid: { text: "Let them live in fear.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them exposure would ruin family.", consequence: "{childName} internalizes fear." }
      }
    },
    12: {
      title: "Adolescence: Moral Confusion About Deception",
      topic: "Values conflict",
      scene: "{childName} is 12. Adolescent morality questions family lies.",
      choices: {
        connect: { text: "Discuss morality without condemning parent.", consequence: "{childName} processes." },
        teach: { text: "Explain complexity of adult choices.", consequence: "Nuance develops." },
        boundary: { text: "They're allowed to question.", consequence: "Their voice matters." },
        avoid: { text: "Tell them not to judge parent.", consequence: "{childName} suppresses self." },
        harm: { text: "Tell them they're complicit in deception.", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Dating & Relationships: What Do They Learn?",
      topic: "Relationship modeling",
      scene: "{childName} is 13. What example is parent setting?",
      choices: {
        connect: { text: "Model honesty in your own relationships.", consequence: "{childName} learns integrity." },
        teach: { text: "Discuss healthy vs. deceptive relationships.", consequence: "Values clarify." },
        boundary: { text: "Deception isn't relationship norm.", consequence: "Standards are high." },
        avoid: { text: "Let parent's pattern become their pattern.", consequence: "{childName} repeats cycle." },
        harm: { text: "Tell them 'all relationships involve secrets.'", consequence: "{childName} internalizes deception." }
      }
    },
    14: {
      title: "The Truth Comes Out (Or Risks Coming Out)",
      topic: "Crisis point",
      scene: "{childName} is 14. Secret is threatened or revealed.",
      choices: {
        connect: { text: "Support them through truth-telling.", consequence: "{childName} can process." },
        teach: { text: "Discuss that truth is painful but necessary.", consequence: "They accept reality." },
        boundary: { text: "They're not responsible for how truth affects others.", consequence: "They're innocent." },
        avoid: { text: "Blame them if truth emerges.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them they ruined the family.", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "Aftermath: Dealing With Revealed Secret",
      topic: "Family restructuring",
      scene: "{childName} is 15. Living with revealed bigamy.",
      choices: {
        connect: { text: "Support them through family chaos.", consequence: "{childName} feels held." },
        teach: { text: "Discuss that families can recover.", consequence: "Hope grows." },
        boundary: { text: "They're not responsible for family healing.", consequence: "They're a teen." },
        avoid: { text: "Make them manage adult chaos.", consequence: "{childName} loses teen years." },
        harm: { text: "Make them mediator between families.", consequence: "{childName} is devastated." }
      }
    },
    16: {
      title: "New Family Reality: Multiple Parents?",
      topic: "Relationship restructuring",
      scene: "{childName} is 16. Possibly meeting other family.",
      choices: {
        connect: { text: "Support relationships forming as they will.", consequence: "{childName} can connect." },
        teach: { text: "Discuss that relationships are complex.", consequence: "They navigate well." },
        boundary: { text: "They're allowed to have mixed feelings.", consequence: "Their emotions matter." },
        avoid: { text: "Force relationships or rejection.", consequence: "{childName} feels controlled." },
        harm: { text: "Tell them they must reject other family.", consequence: "{childName} loses part of self." }
      }
    },
    17: {
      title: "Understanding Parent's Choice: Why Bigamy?",
      topic: "Empathy and morality",
      scene: "{childName} is 17. Can they understand parent's deception?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that understanding ≠ condoning.", consequence: "Nuance develops." },
        boundary: { text: "Complexity is allowed.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to explain parent's choices.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is simply evil.", consequence: "{childName} internalizes judgment." }
      }
    },
    18: {
      title: "Adult Life: Building Trust & Honesty",
      topic: "Self-determination",
      scene: "{childName} is 18. Building relationships with integrity.",
      choices: {
        connect: { text: "Support their commitment to honesty.", consequence: "{childName} builds healthy." },
        teach: { text: "Share wisdom about relationship integrity.", consequence: "They build wisely." },
        boundary: { text: "Their relationships are theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward parent's pattern.", consequence: "{childName} might rebel." },
        harm: { text: "Tell them they're destined to repeat pattern.", consequence: "{childName} internalizes hopelessness." }
      }
    }
  },

  taboo_fifty_shades_maroon: {
    1: {
      title: "Born Into BDSM Household",
      topic: "Kink-aware parenting",
      scene: "{childName} is born into household where parents practice BDSM.",
      choices: {
        connect: { text: "Love them fully in their home.", consequence: "{childName} feels wanted." },
        teach: { text: "Create age-appropriate boundaries.", consequence: "They're safe." },
        boundary: { text: "Children are protected from adult sexuality.", consequence: "They're innocent." },
        avoid: { text: "Expose them to sexual content.", consequence: "{childName} is damaged." },
        harm: { text: "Involve them in adult activities.", consequence: "{childName} is traumatized." }
      }
    },
    2: {
      title: "Age-Appropriate Ignorance",
      topic: "Child safety",
      scene: "{childName} is 2-3. Household has adult activities kept private.",
      choices: {
        connect: { text: "Keep them completely protected.", consequence: "{childName} is safe." },
        teach: { text: "Establish clear boundaries.", consequence: "They're innocent." },
        boundary: { text: "Children never see adult content.", consequence: "They're protected." },
        avoid: { text: "Let them see adult interactions.", consequence: "{childName} is confused." },
        harm: { text: "Show them adult content.", consequence: "{childName} is damaged." }
      }
    },
    3: {
      title: "Privacy & Boundaries: Locked Doors & Off-Limits Spaces",
      topic: "Household boundaries",
      scene: "{childName} is 3-4. Some spaces are off-limits for safety.",
      choices: {
        connect: { text: "Establish firm, natural boundaries.", consequence: "{childName} respects space." },
        teach: { text: "Explain boundaries matter.", consequence: "They understand." },
        boundary: { text: "Off-limits spaces are normal.", consequence: "They're secure." },
        avoid: { text: "Let them access adult spaces.", consequence: "{childName} sees inappropriate content." },
        harm: { text: "Tell them they're hidden from for punishment.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "School: Explaining Household to Teachers",
      topic: "Public reputation management",
      scene: "{childName} is in school. Teachers don't know household details.",
      choices: {
        connect: { text: "Keep school life completely separate.", consequence: "{childName} is safe." },
        teach: { text: "Explain privacy about home.", consequence: "They understand discretion." },
        boundary: { text: "School and home are separate worlds.", consequence: "They're protected." },
        avoid: { text: "Let them talk about adult activities.", consequence: "School becomes aware." },
        harm: { text: "Tell them to hide 'weird' home.", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "Questions About Marks or Bruises",
      topic: "Explaining physical evidence",
      scene: "{childName} is 5-6. Noticing marks on parents.",
      choices: {
        connect: { text: "Answer simply without detail.", consequence: "{childName} is satisfied." },
        teach: { text: "Explain that adults have private things.", consequence: "They understand privacy." },
        boundary: { text: "Their parents are safe.", consequence: "They're secure." },
        avoid: { text: "Ignore questions.", consequence: "{childName} invents wrong explanations." },
        harm: { text: "Show them what caused marks.", consequence: "{childName} is traumatized." }
      }
    },
    6: {
      title: "Distinguishing Parents' Relationship From Abuse",
      topic: "Consent understanding",
      scene: "{childName} is 6. Learning about healthy vs. harmful touching.",
      choices: {
        connect: { text: "Teach consent and safety.", consequence: "{childName} understands." },
        teach: { text: "Discuss that consent is essential.", consequence: "Values clarify." },
        boundary: { text: "Parents' relationship is consensual.", consequence: "They're secure." },
        avoid: { text: "Let them confuse parents with abuse.", consequence: "{childName} develops anxiety." },
        harm: { text: "Tell them to report parents.", consequence: "{childName} is traumatized." }
      }
    },
    7: {
      title: "Puberty Education: Understanding Adult Sexuality",
      topic: "Age-appropriate learning",
      scene: "{childName} is 7-8. Beginning sex education.",
      choices: {
        connect: { text: "Provide standard, age-appropriate education.", consequence: "{childName} learns naturally." },
        teach: { text: "Discuss consent and safety.", consequence: "Values form." },
        boundary: { text: "Education is age-appropriate.", consequence: "They learn healthy views." },
        avoid: { text: "Expose them to kink-specific content.", consequence: "{childName} is confused." },
        harm: { text: "Make them feel sex is shameful.", consequence: "{childName} develops issues." }
      }
    },
    8: {
      title: "Identity: Kid in Kink-Aware Household",
      topic: "Self-understanding",
      scene: "{childName} is 8. Understanding their family is different.",
      choices: {
        connect: { text: "Normalize their home without exposing them.", consequence: "{childName} feels normal." },
        teach: { text: "Discuss that families are different.", consequence: "They see diversity." },
        boundary: { text: "Different doesn't mean bad.", consequence: "They're secure." },
        avoid: { text: "Make them ashamed of home.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them their home is wrong.", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "Privacy & Secrets: What They Know vs. What They Discuss",
      topic: "Discretion developing",
      scene: "{childName} is 9. Learning not to share family details.",
      choices: {
        connect: { text: "Teach healthy privacy without shame.", consequence: "{childName} is discreet." },
        teach: { text: "Discuss that family details stay private.", consequence: "They understand." },
        boundary: { text: "Privacy isn't shame-based.", consequence: "They're confident." },
        avoid: { text: "Make them terrified of exposure.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them home is shameful.", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Peer Awareness: Different Household",
      topic: "Social integration",
      scene: "{childName} is 10. Aware their home is different.",
      choices: {
        connect: { text: "Help them feel normal despite differences.", consequence: "{childName} is secure." },
        teach: { text: "Discuss that different is okay.", consequence: "Confidence develops." },
        boundary: { text: "They're not responsible for parent choices.", consequence: "They're a child." },
        avoid: { text: "Make them feel abnormal.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them to be ashamed of home.", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Adolescence: Understanding Consent & Power Exchange",
      topic: "Developmental learning",
      scene: "{childName} is 11. Adolescence brings new questions.",
      choices: {
        connect: { text: "Answer questions honestly and age-appropriately.", consequence: "{childName} learns well." },
        teach: { text: "Discuss consent and negotiation.", consequence: "Values form." },
        boundary: { text: "Consent is essential in all relationships.", consequence: "They understand." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} gets misinformation." },
        harm: { text: "Expose them to actual kink practices.", consequence: "{childName} is traumatized." }
      }
    },
    12: {
      title: "Dating & Relationships: What Do They Learn About Power?",
      topic: "Relationship modeling",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Model healthy power dynamics.", consequence: "{childName} learns well." },
        teach: { text: "Discuss that healthy relationships have balance.", consequence: "Values clarify." },
        boundary: { text: "Consent is foundation of all relationships.", consequence: "They understand." },
        avoid: { text: "Let them think power imbalance is normal.", consequence: "{childName} might replicate." },
        harm: { text: "Tell them to dominate partners.", consequence: "{childName} develops unhealthy patterns." }
      }
    },
    13: {
      title: "Teen Years: Learning Difference Between Healthy & Harmful",
      topic: "Critical thinking",
      scene: "{childName} is 13. Developing moral compass.",
      choices: {
        connect: { text: "Discuss ethical sexuality.", consequence: "{childName} thinks critically." },
        teach: { text: "Explain consent and boundaries.", consequence: "Values solidify." },
        boundary: { text: "Consent is always required.", consequence: "They understand integrity." },
        avoid: { text: "Let them be confused about consent.", consequence: "{childName} might hurt others." },
        harm: { text: "Tell them consent doesn't matter.", consequence: "{childName} becomes predatory." }
      }
    },
    14: {
      title: "Puberty & Sexual Development: Processing Own Sexuality",
      topic: "Healthy sexual development",
      scene: "{childName} is 14. Navigating their own emerging sexuality.",
      choices: {
        connect: { text: "Support healthy sexual development.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss consent and respect.", consequence: "Values are clear." },
        boundary: { text: "Their sexuality is theirs to discover.", consequence: "They're free." },
        avoid: { text: "Shame their sexual development.", consequence: "{childName} develops issues." },
        harm: { text: "Expose them to inappropriate content.", consequence: "{childName} is damaged." }
      }
    },
    15: {
      title: "Dating: Explaining Their Family If Partners Ask",
      topic: "Social integration",
      scene: "{childName} is 15 and dating. Managing family privacy.",
      choices: {
        connect: { text: "Help them keep appropriate privacy.", consequence: "{childName} dates comfortably." },
        teach: { text: "Discuss healthy disclosure.", consequence: "They navigate well." },
        boundary: { text: "They control what they share.", consequence: "Privacy is theirs." },
        avoid: { text: "Make them hide family shamefully.", consequence: "{childName} develops anxiety." },
        harm: { text: "Tell them to expose family to partners.", consequence: "{childName} faces judgment." }
      }
    },
    16: {
      title: "First Serious Relationship: Power Dynamics",
      topic: "Relationship learning",
      scene: "{childName} is 16 in first serious relationship.",
      choices: {
        connect: { text: "Support healthy relationship patterns.", consequence: "{childName} loves well." },
        teach: { text: "Discuss consent and equality.", consequence: "They build well." },
        boundary: { text: "Power should be equal.", consequence: "They're secure." },
        avoid: { text: "Let them replicate unhealthy patterns.", consequence: "{childName} might be harmed." },
        harm: { text: "Encourage power imbalance.", consequence: "{childName} becomes predatory or prey." }
      }
    },
    17: {
      title: "Understanding Parents' Choices: BDSM & Relationships",
      topic: "Adult sexuality understanding",
      scene: "{childName} is 17. Can they understand parents' choices?",
      choices: {
        connect: { text: "Explain openly and maturely.", consequence: "{childName} understands." },
        teach: { text: "Discuss consent and negotiation.", consequence: "Nuance develops." },
        boundary: { text: "Different relationship styles are valid.", consequence: "Understanding grows." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent's sexuality is shameful.", consequence: "{childName} internalizes shame." }
      }
    },
    18: {
      title: "Adult Life: Building Own Healthy Relationships",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own relationships.",
      choices: {
        connect: { text: "Support whatever relationship style they choose.", consequence: "{childName} feels free." },
        teach: { text: "Share wisdom about consent and safety.", consequence: "They build wisely." },
        boundary: { text: "Consent and safety are non-negotiable.", consequence: "They prioritize health." },
        avoid: { text: "Push them toward parent's style.", consequence: "{childName} might rebel." },
        harm: { text: "Tell them consent doesn't matter.", consequence: "{childName} becomes harmful." }
      }
    }
  },

  taboo_vip_patron: {
    1: {
      title: "Born Into Patron Relationship",
      topic: "Transactional family",
      scene: "{childName} is born. Parent's relationship with patron provides security.",
      choices: {
        connect: { text: "Love them fully in their family structure.", consequence: "{childName} feels wanted." },
        teach: { text: "Create stability regardless of arrangement.", consequence: "They feel secure." },
        boundary: { text: "They're innocent of adult arrangements.", consequence: "They're protected." },
        avoid: { text: "Make them feel like transaction.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'you're why parent needs patron.'", consequence: "{childName} internalizes guilt." }
      }
    },
    2: {
      title: "Luxury Lifestyle: Patron-Funded Comfort",
      topic: "Economic dependency",
      scene: "{childName} grows up with patron's financial support.",
      choices: {
        connect: { text: "Provide stability without making it conditional.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand their life situation.", consequence: "They grasp reality." },
        boundary: { text: "Luxury doesn't equal love.", consequence: "Values clarify." },
        avoid: { text: "Make them entitled to patron's wealth.", consequence: "{childName} becomes entitled." },
        harm: { text: "Tell them 'you owe the patron.'", consequence: "{childName} internalizes obligation." }
      }
    },
    3: {
      title: "Patron's Presence: Not Really Family",
      topic: "Ambiguous relationships",
      scene: "{childName} is 3-4. Patron is present but not parent.",
      choices: {
        connect: { text: "Establish clear, honest roles.", consequence: "{childName} understands." },
        teach: { text: "Explain patron relationship simply.", consequence: "They grasp situation." },
        boundary: { text: "Patron is not their parent.", consequence: "They're secure." },
        avoid: { text: "Pretend patron is family.", consequence: "{childName} becomes confused." },
        harm: { text: "Tell them they must accept patron as parent.", consequence: "{childName} internalizes unwantedness." }
      }
    },
    4: {
      title: "School: Explaining Patron's Role",
      topic: "Public identity management",
      scene: "{childName} is in school. Patron sometimes visible in their life.",
      choices: {
        connect: { text: "Keep school life separate from patron.", consequence: "{childName} is safe." },
        teach: { text: "Help them manage what they share.", consequence: "They learn discretion." },
        boundary: { text: "School is neutral space.", consequence: "They're secure." },
        avoid: { text: "Let patron be prominent at school.", consequence: "Peers might judge." },
        harm: { text: "Make them explain patron relationship.", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "Questions About Money & Lifestyle",
      topic: "Financial awareness",
      scene: "{childName} is 5-6. Noticing they have more than other kids.",
      choices: {
        connect: { text: "Explain situation honestly and age-appropriately.", consequence: "{childName} understands." },
        teach: { text: "Discuss that families have different resources.", consequence: "They see diversity." },
        boundary: { text: "Wealth doesn't determine worth.", consequence: "They're grounded." },
        avoid: { text: "Make them ungrateful for patron's money.", consequence: "{childName} develops entitlement." },
        harm: { text: "Tell them 'you're only valuable because of money.'", consequence: "{childName} internalizes that worth = money." }
      }
    },
    6: {
      title: "Patron's Expectations: Are There Strings?",
      topic: "Conditional support",
      scene: "{childName} is 6. Patron may expect things in return.",
      choices: {
        connect: { text: "Protect them from patron's expectations.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand relationships aren't transactional with children.", consequence: "Boundaries form." },
        boundary: { text: "They're not responsible for adult arrangements.", consequence: "They're a child." },
        avoid: { text: "Expose them to patron's demands.", consequence: "{childName} feels burdened." },
        harm: { text: "Tell them to obey patron.", consequence: "{childName} loses autonomy." }
      }
    },
    7: {
      title: "Parent's Dependence: Visible to {childName}",
      topic: "Power dynamics",
      scene: "{childName} is 7. They sense parent is dependent on patron.",
      choices: {
        connect: { text: "Protect them from adult dynamics.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand complex relationships.", consequence: "Nuance develops." },
        boundary: { text: "Parent's choices are parent's choices.", consequence: "They're innocent." },
        avoid: { text: "Make them feel parent is weak.", consequence: "{childName} internalizes judgment." },
        harm: { text: "Tell them parent sold out.", consequence: "{childName} internalizes resentment." }
      }
    },
    8: {
      title: "Identity: Rich Kid But In Strange Family",
      topic: "Belonging confusion",
      scene: "{childName} is 8. Having wealth but feeling like outsider.",
      choices: {
        connect: { text: "Help them feel secure despite ambiguity.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that family structures are diverse.", consequence: "They see validity." },
        boundary: { text: "Their family is theirs to define.", consequence: "They're secure." },
        avoid: { text: "Make them feel their family is wrong.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them their family is a scandal.", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "Awareness Growing: Understanding the Arrangement",
      topic: "Relationship clarity",
      scene: "{childName} is 9. Beginning to understand adult arrangements.",
      choices: {
        connect: { text: "Explain honestly and compassionately.", consequence: "{childName} understands." },
        teach: { text: "Discuss that adults make different choices.", consequence: "They accept complexity." },
        boundary: { text: "Parent's choice doesn't define them.", consequence: "They're secure." },
        avoid: { text: "Hide truth from them.", consequence: "{childName} invents wrong stories." },
        harm: { text: "Tell them parent is shameful.", consequence: "{childName} internalizes resentment." }
      }
    },
    10: {
      title: "Patron Aging or Relationship Changing",
      topic: "Uncertainty about stability",
      scene: "{childName} is 10. What happens if arrangement changes?",
      choices: {
        connect: { text: "Plan for contingencies without alarming them.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss that relationships change.", consequence: "They're prepared." },
        boundary: { text: "They're not responsible for arrangement.", consequence: "They're a child." },
        avoid: { text: "Leave them unprepared for changes.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them arrangement is fragile.", consequence: "{childName} internalizes fear." }
      }
    },
    11: {
      title: "Peer Awareness: Why Is Their Life Different?",
      topic: "Social integration",
      scene: "{childName} is 11. Peers notice their unusual situation.",
      choices: {
        connect: { text: "Help them manage peer reactions.", consequence: "{childName} feels confident." },
        teach: { text: "Discuss that families are different.", consequence: "They see diversity." },
        boundary: { text: "They're not responsible for adult choices.", consequence: "They're secure." },
        avoid: { text: "Make them ashamed of their life.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them to hide their family.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Adolescence: Developing Values About Money & Relationships",
      topic: "Moral development",
      scene: "{childName} is 12. Adolescent morality questions arrangement.",
      choices: {
        connect: { text: "Discuss values without judgment.", consequence: "{childName} thinks critically." },
        teach: { text: "Explain that people make different choices.", consequence: "Nuance develops." },
        boundary: { text: "They're allowed to question.", consequence: "Their voice matters." },
        avoid: { text: "Tell them not to judge parent.", consequence: "{childName} suppresses self." },
        harm: { text: "Tell them they're shameful for having wealth.", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "Dating & Relationships: Learning What's Transactional vs. Real",
      topic: "Relationship clarity",
      scene: "{childName} is 13 and interested in dating.",
      choices: {
        connect: { text: "Model healthy relationships.", consequence: "{childName} builds well." },
        teach: { text: "Discuss healthy vs. transactional relationships.", consequence: "Values clarify." },
        boundary: { text: "Love shouldn't be for sale.", consequence: "They understand." },
        avoid: { text: "Let them think transactional is normal.", consequence: "{childName} might replicate pattern." },
        harm: { text: "Tell them 'all relationships are transactional.'", consequence: "{childName} internalizes cynicism." }
      }
    },
    14: {
      title: "Patron's Expectations Potentially Increasing",
      topic: "Boundary pressure",
      scene: "{childName} is 14. Patron may expect more as they mature.",
      choices: {
        connect: { text: "Protect them fiercely from expectations.", consequence: "{childName} is safe." },
        teach: { text: "Establish clear boundaries.", consequence: "They know their rights." },
        boundary: { text: "They're never obligated to patron.", consequence: "They're protected." },
        avoid: { text: "Let patron pressure them.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them to satisfy patron.", consequence: "{childName} is abused." }
      }
    },
    15: {
      title: "College Planning: Independence or Dependence?",
      topic: "Future autonomy",
      scene: "{childName} is 15. College means potential freedom from patron.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss financial independence.", consequence: "They plan wisely." },
        boundary: { text: "They can choose their path.", consequence: "Autonomy is real." },
        avoid: { text: "Make patron's funding conditional on control.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them they can never escape patron.", consequence: "{childName} loses hope." }
      }
    },
    16: {
      title: "Dating Others: Freedom or Complicated?",
      topic: "Romantic independence",
      scene: "{childName} is 16 and dating.",
      choices: {
        connect: { text: "Support healthy romantic relationships.", consequence: "{childName} loves well." },
        teach: { text: "Discuss healthy relationships.", consequence: "They learn." },
        boundary: { text: "Romantic relationships are theirs.", consequence: "They're free." },
        avoid: { text: "Make patron involved in dating.", consequence: "{childName} loses autonomy." },
        harm: { text: "Tell them patron approval is needed.", consequence: "{childName} feels controlled." }
      }
    },
    17: {
      title: "Understanding Parent's Choice: Why Accept Patron Arrangement?",
      topic: "Complex motivations",
      scene: "{childName} is 17. Can they understand parent's choice?",
      choices: {
        connect: { text: "Share parent's perspective honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss that people make difficult choices.", consequence: "Nuance develops." },
        boundary: { text: "Parent's choices are theirs.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss parent's choices.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is shameful.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Life: Independence & Their Own Path",
      topic: "Self-determination",
      scene: "{childName} is 18. Building independent life.",
      choices: {
        connect: { text: "Support their independence fully.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about financial autonomy.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Keep them dependent on patron.", consequence: "{childName} loses freedom." },
        harm: { text: "Tell them they can never escape.", consequence: "{childName} loses hope." }
      }
    }
  },

  taboo_anonymous_celebrity: {
    1: {
      title: "Born to Anonymous Celebrity",
      topic: "Secret famous parent",
      scene: "{childName} is born to parent who is famous but hiding it.",
      choices: {
        connect: { text: "Love them fully in their private family.", consequence: "{childName} feels wanted." },
        teach: { text: "Create safe, normal childhood.", consequence: "They feel secure." },
        boundary: { text: "They deserve normal childhood.", consequence: "They're protected." },
        avoid: { text: "Treat them as celebrity child.", consequence: "{childName} loses privacy." },
        harm: { text: "Tell them 'parent's fame means you matter.'", consequence: "{childName} internalizes fame = worth." }
      }
    },
    2: {
      title: "Parent's Secret Identity",
      topic: "Maintaining anonymity",
      scene: "{childName} grows up with parent who has hidden public life.",
      choices: {
        connect: { text: "Protect their privacy fiercely.", consequence: "{childName} is safe." },
        teach: { text: "Explain parent's need for privacy.", consequence: "They understand." },
        boundary: { text: "Their family's privacy is sacred.", consequence: "They're secure." },
        avoid: { text: "Expose parent's identity.", consequence: "{childName} loses privacy." },
        harm: { text: "Tell them parent's fame is secret shame.", consequence: "{childName} internalizes shame." }
      }
    },
    3: {
      title: "Disguises & Privacy: Strange Routines",
      topic: "Secrecy practices",
      scene: "{childName} is 3-4. Parent has unusual secrecy practices.",
      choices: {
        connect: { text: "Make privacy practices feel safe, not scary.", consequence: "{childName} accepts them." },
        teach: { text: "Explain privacy without creating fear.", consequence: "They understand." },
        boundary: { text: "Privacy practices protect them.", consequence: "They feel secure." },
        avoid: { text: "Make secrecy feel shameful.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're in danger.", consequence: "{childName} becomes anxious." }
      }
    },
    4: {
      title: "School: Normal Family Story",
      topic: "Public identity maintenance",
      scene: "{childName} starts school with normal family story.",
      choices: {
        connect: { text: "Keep school life completely separate.", consequence: "{childName} is safe." },
        teach: { text: "Help them manage what they share.", consequence: "They learn discretion." },
        boundary: { text: "School is safe, normal space.", consequence: "They're secure." },
        avoid: { text: "Let parent be known at school.", consequence: "Privacy is exposed." },
        harm: { text: "Tell them to lie about parent.", consequence: "{childName} internalizes deception." }
      }
    },
    5: {
      title: "Questions About Parent's Strange Routines",
      topic: "Curiosity about privacy",
      scene: "{childName} is 5-6. Asking why parent is secretive.",
      choices: {
        connect: { text: "Answer honestly without over-explaining.", consequence: "{childName} is satisfied." },
        teach: { text: "Explain that some people value privacy.", consequence: "They understand." },
        boundary: { text: "Privacy is normal and healthy.", consequence: "They feel secure." },
        avoid: { text: "Make them fear parent's secrecy.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them parent is dangerous.", consequence: "{childName} is traumatized." }
      }
    },
    6: {
      title: "Accidental Exposure Risk: What If Someone Recognizes Parent?",
      topic: "Exposure anxiety",
      scene: "{childName} is 6. Parent worried about being recognized.",
      choices: {
        connect: { text: "Ease their fears without making them paranoid.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss that privacy is manageable.", consequence: "They trust plan." },
        boundary: { text: "Parent has strategies to stay private.", consequence: "They're confident." },
        avoid: { text: "Make them anxious about exposure.", consequence: "{childName} becomes paranoid." },
        harm: { text: "Tell them to watch for danger.", consequence: "{childName} becomes hypervigilant." }
      }
    },
    7: {
      title: "Different Worlds: Parent's Public vs. Private Life",
      topic: "Identity split",
      scene: "{childName} is 7. Aware parent has two distinct lives.",
      choices: {
        connect: { text: "Help them understand both parts of parent.", consequence: "{childName} accepts complexity." },
        teach: { text: "Discuss that people have multiple roles.", consequence: "They understand." },
        boundary: { text: "Both versions of parent are real.", consequence: "They're secure." },
        avoid: { text: "Make them feel parent is dishonest.", consequence: "{childName} loses trust." },
        harm: { text: "Tell them parent's fame is shameful.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Identity: Child of Famous (But Hidden) Parent",
      topic: "Secret knowledge",
      scene: "{childName} is 8. Carrying secret knowledge about parent.",
      choices: {
        connect: { text: "Acknowledge burden without asking them to hide it.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss that some secrets are protective.", consequence: "They understand." },
        boundary: { text: "They shouldn't fear telling trusted people.", consequence: "Burden eases." },
        avoid: { text: "Make them feel secret is shameful.", consequence: "{childName} internalizes shame." },
        harm: { text: "Threaten consequences if they tell.", consequence: "{childName} internalizes fear." }
      }
    },
    9: {
      title: "Peer Relationships: Can't Talk About Home",
      topic: "Social isolation",
      scene: "{childName} is 9. Unable to share home life with peers.",
      choices: {
        connect: { text: "Help them develop other connections.", consequence: "{childName} has friends." },
        teach: { text: "Discuss that they can share some but not all.", consequence: "They navigate well." },
        boundary: { text: "Privacy doesn't mean isolation.", consequence: "They're connected." },
        avoid: { text: "Make them completely isolated.", consequence: "{childName} becomes lonely." },
        harm: { text: "Tell them they can't trust anyone.", consequence: "{childName} becomes paranoid." }
      }
    },
    10: {
      title: "Awareness Growing: Understanding Parent's Celebrity",
      topic: "Realizing the scale",
      scene: "{childName} is 10. Increasingly aware of parent's fame.",
      choices: {
        connect: { text: "Explain parent's fame without pressure.", consequence: "{childName} understands." },
        teach: { text: "Discuss why parent keeps it secret.", consequence: "They grasp reasons." },
        boundary: { text: "Parent's fame doesn't affect them.", consequence: "They're secure." },
        avoid: { text: "Make fame seem like burden.", consequence: "{childName} resents parent." },
        harm: { text: "Tell them they could profit from fame.", consequence: "{childName} becomes exploitative." }
      }
    },
    11: {
      title: "Adolescence: The Secret Becomes Heavy",
      topic: "Burden increasing",
      scene: "{childName} is 11. Secret knowledge feels like weight.",
      choices: {
        connect: { text: "Acknowledge burden without asking them to bear it.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss that secrets affect relationships.", consequence: "They understand." },
        boundary: { text: "They're allowed to feel burdened.", consequence: "Their voice matters." },
        avoid: { text: "Expect them to keep perfect silence.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them they're shameful for knowing.", consequence: "{childName} internalizes guilt." }
      }
    },
    12: {
      title: "Dating & Relationships: Can't Explain Family",
      topic: "Romantic isolation",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Help them navigate dating with privacy constraints.", consequence: "{childName} can date." },
        teach: { text: "Discuss what they can share.", consequence: "They navigate." },
        boundary: { text: "Privacy doesn't prevent relationships.", consequence: "They're not isolated." },
        avoid: { text: "Tell them they can't date.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them to deceive partners.", consequence: "{childName} internalizes deception." }
      }
    },
    13: {
      title: "Social Media & Internet: Risk of Exposure",
      topic: "Modern exposure threat",
      scene: "{childName} is 13. Internet makes privacy harder.",
      choices: {
        connect: { text: "Discuss internet safety without causing fear.", consequence: "{childName} is careful." },
        teach: { text: "Explain why privacy matters online.", consequence: "They understand." },
        boundary: { text: "They're responsible for their own discretion.", consequence: "They're careful." },
        avoid: { text: "Make them terrified of internet.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them anything they post will expose parent.", consequence: "{childName} becomes paranoid." }
      }
    },
    14: {
      title: "Friend Group Expanding: Who To Trust?",
      topic: "Trust and disclosure",
      scene: "{childName} is 14. New friends enter their life.",
      choices: {
        connect: { text: "Help them decide what to share.", consequence: "{childName} trusts wisely." },
        teach: { text: "Discuss healthy discretion.", consequence: "They develop judgment." },
        boundary: { text: "They control what they share.", consequence: "Agency is theirs." },
        avoid: { text: "Tell them they can't trust anyone.", consequence: "{childName} becomes paranoid." },
        harm: { text: "Blame them if someone finds out.", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "College Planning: Freedom or Exposure?",
      topic: "Future independence",
      scene: "{childName} is 15. College could mean freedom from secrecy.",
      choices: {
        connect: { text: "Support their autonomy at college.", consequence: "{childName} feels free." },
        teach: { text: "Discuss what they might disclose.", consequence: "They plan wisely." },
        boundary: { text: "College is chance for new start.", consequence: "They're excited." },
        avoid: { text: "Make college about proving secrecy.", consequence: "{childName} feels burdened." },
        harm: { text: "Tell them they can never escape secrecy.", consequence: "{childName} loses hope." }
      }
    },
    16: {
      title: "Internet Fame: What If Parent Is Outed?",
      topic: "Exposure scenario",
      scene: "{childName} is 16. Internet could expose parent anytime.",
      choices: {
        connect: { text: "Prepare them for possibility.", consequence: "{childName} feels ready." },
        teach: { text: "Discuss how they'd handle exposure.", consequence: "They're prepared." },
        boundary: { text: "Exposure wouldn't be their fault.", consequence: "They're blameless." },
        avoid: { text: "Leave them unprepared.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them exposure would ruin family.", consequence: "{childName} becomes paranoid." }
      }
    },
    17: {
      title: "Understanding Parent's Secrecy: Why Hide?",
      topic: "Parental motivations",
      scene: "{childName} is 17. Can they understand why parent stays private?",
      choices: {
        connect: { text: "Share parent's reasons honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss privacy and boundaries.", consequence: "Nuance develops." },
        boundary: { text: "Parent's choice makes sense.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is ashamed.", consequence: "{childName} internalizes shame." }
      }
    },
    18: {
      title: "Adult Life: Their Own Secret or Public Identity?",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own relationship with fame.",
      choices: {
        connect: { text: "Support whatever identity they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about privacy and boundaries.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward parent's path.", consequence: "{childName} might rebel." },
        harm: { text: "Tell them they must keep parent's secret forever.", consequence: "{childName} internalizes burden." }
      }
    }
  }
};