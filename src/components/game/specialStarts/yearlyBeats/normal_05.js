export const SPECIAL_START_YEARLY_BEATS__NORMAL_05 = {
  teen_parent: {
    1: {
      title: "Born to Teen Parent",
      topic: "Young parenthood",
      scene: "{childName} is born to a parent who is still a teenager.",
      choices: {
        connect: { text: "Love them fully despite the circumstances.", consequence: "{childName} feels wanted." },
        teach: { text: "Show that young parents can love deeply.", consequence: "They understand." },
        boundary: { text: "They're not responsible for parent's youth.", consequence: "They're innocent." },
        avoid: { text: "Treat them as a burden.", consequence: "{childName} internalizes unwantedness." },
        harm: { text: "Tell them 'you ruined my life.'", consequence: "{childName} internalizes guilt." }
      }
    },
    2: {
      title: "Parent Still Growing Up",
      topic: "Parental immaturity",
      scene: "{childName} grows up with parent who is still developing.",
      choices: {
        connect: { text: "Support parent's growth alongside {childName}'s.", consequence: "{childName} feels secure." },
        teach: { text: "Help parent learn parenting.", consequence: "Growth happens." },
        boundary: { text: "{childName} isn't responsible for parent's growth.", consequence: "They're a child." },
        avoid: { text: "Expect parent to be fully mature.", consequence: "Tension builds." },
        harm: { text: "Blame {childName} for parent's mistakes.", consequence: "{childName} internalizes guilt." }
      }
    },
    3: {
      title: "Parental Immaturity: What Does That Look Like?",
      topic: "Developmental mismatch",
      scene: "{childName} is 3-4. Parent's immaturity affects caregiving.",
      choices: {
        connect: { text: "Fill gaps without blaming parent.", consequence: "{childName} is cared for." },
        teach: { text: "Help parent develop age-appropriate skills.", consequence: "Parent learns." },
        boundary: { text: "{childName} isn't responsible for parent.", consequence: "Childhood is protected." },
        avoid: { text: "Let parent's immaturity directly affect {childName}.", consequence: "{childName} loses childhood." },
        harm: { text: "Shame parent for being immature.", consequence: "Conflict increases." }
      }
    },
    4: {
      title: "Peers' Parents vs. {childName}'s Parent",
      topic: "Social awareness",
      scene: "{childName} is in school. Peers' parents look different from theirs.",
      choices: {
        connect: { text: "Help them understand that families are different.", consequence: "{childName} feels normal." },
        teach: { text: "Discuss that parent's youth is theirs to manage.", consequence: "They understand." },
        boundary: { text: "Their parent is still their parent.", consequence: "They're secure." },
        avoid: { text: "Make them ashamed of parent's age.", consequence: "{childName} internalizes shame." },
        harm: { text: "Allow bullying about parent's youth.", consequence: "{childName} internalizes rejection." }
      }
    },
    5: {
      title: "School: One Parent or Two?",
      topic: "Family structure",
      scene: "{childName} is in school. Is parent still with original partner?",
      choices: {
        connect: { text: "Support whatever family structure exists.", consequence: "{childName} is secure." },
        teach: { text: "Discuss family changes age-appropriately.", consequence: "They understand." },
        boundary: { text: "Structure doesn't determine worth.", consequence: "They're not ashamed." },
        avoid: { text: "Make family changes chaotic.", consequence: "{childName} feels unstable." },
        harm: { text: "Tell them 'teen parents always fail.'", consequence: "{childName} internalizes hopelessness." }
      }
    },
    6: {
      title: "Parent's Restrictions: Missing Childhood",
      topic: "Parent's lost youth",
      scene: "{childName} is 6. Parent sometimes acts bitter about lost youth.",
      choices: {
        connect: { text: "Acknowledge parent's feelings without burdening {childName}.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss that parent's choices matter.", consequence: "They understand." },
        boundary: { text: "{childName} isn't responsible for parent's sacrifice.", consequence: "They're innocent." },
        avoid: { text: "Make {childName} feel guilty for parent's restrictions.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them 'you owe me for what I sacrificed.'", consequence: "{childName} internalizes burden." }
      }
    },
    7: {
      title: "Parent Dating Again: New Family Dynamics",
      topic: "Changing family",
      scene: "{childName} is 7. Parent is dating or in new relationship.",
      choices: {
        connect: { text: "Support parent's relationship if healthy.", consequence: "{childName} adapts." },
        teach: { text: "Discuss that parent deserves happiness.", consequence: "They understand." },
        boundary: { text: "They're not responsible for parent's happiness.", consequence: "They're a child." },
        avoid: { text: "Make them responsible for managing relationships.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them 'you can't let parent date.'", consequence: "{childName} internalizes control." }
      }
    },
    8: {
      title: "Parental Vulnerability: Seeing Parent's Struggles",
      topic: "Emotional exposure",
      scene: "{childName} is 8. They see parent struggling financially or emotionally.",
      choices: {
        connect: { text: "Protect them from adult struggles.", consequence: "{childName} is a child." },
        teach: { text: "Age-appropriately acknowledge reality.", consequence: "They understand but aren't burdened." },
        boundary: { text: "They're not responsible for fixing parent.", consequence: "Childhood is protected." },
        avoid: { text: "Use them as emotional support.", consequence: "{childName} loses childhood." },
        harm: { text: "Make them feel they caused parent's problems.", consequence: "{childName} internalizes guilt." }
      }
    },
    9: {
      title: "Identity: Child of Teen Parent",
      topic: "Self-identity forming",
      scene: "{childName} is 9. This identity is becoming clear to them.",
      choices: {
        connect: { text: "Support this identity as just part of who they are.", consequence: "{childName} feels normal." },
        teach: { text: "Discuss that parent's age doesn't define {childName}.", consequence: "They differentiate." },
        boundary: { text: "This is one fact, not their identity.", consequence: "They're multifaceted." },
        avoid: { text: "Let this become their entire identity.", consequence: "{childName} over-identifies." },
        harm: { text: "Tell them 'you're marked by having a teen parent.'", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Parent's Peer Group: Are They Supportive?",
      topic: "Social support",
      scene: "{childName} is 10. Parent's friends/community affects {childName}.",
      choices: {
        connect: { text: "Ensure safe, supportive community.", consequence: "{childName} feels protected." },
        teach: { text: "Discuss why community matters.", consequence: "They understand support." },
        boundary: { text: "They're not responsible for parent's community.", consequence: "They're safe." },
        avoid: { text: "Expose them to parent's less-healthy friends.", consequence: "{childName} is at risk." },
        harm: { text: "Allow parent's friends to be poor influences.", consequence: "{childName} is negatively affected." }
      }
    },
    11: {
      title: "School: Homework & Parent Support",
      topic: "Academic support",
      scene: "{childName} is 11. Parent may lack skill to support homework.",
      choices: {
        connect: { text: "Ensure they get academic support somewhere.", consequence: "{childName} succeeds." },
        teach: { text: "Help them advocate for help.", consequence: "Self-advocacy develops." },
        boundary: { text: "They're not left without support.", consequence: "They can learn." },
        avoid: { text: "Expect parent to provide expert-level support.", consequence: "{childName} struggles." },
        harm: { text: "Blame them if parent can't help.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Dating & Relationships: Parent as Example",
      topic: "Learning from parent",
      scene: "{childName} is 12. What are they learning about relationships from parent?",
      choices: {
        connect: { text: "Discuss healthy relationship patterns.", consequence: "{childName} learns well." },
        teach: { text: "Share what healthy relationships look like.", consequence: "Values form." },
        boundary: { text: "Parent's choices are theirs; {childName}'s will be theirs.", consequence: "Autonomy is honored." },
        avoid: { text: "Let parent's unhealthy patterns model behavior.", consequence: "{childName} repeats patterns." },
        harm: { text: "Tell them 'you're doomed to repeat parent's mistakes.'", consequence: "{childName} internalizes hopelessness." }
      }
    },
    13: {
      title: "Teen Parent Now in Adulthood: Growing Together",
      topic: "Mutual maturation",
      scene: "{childName} is 13. Parent is now a young adult.",
      choices: {
        connect: { text: "Support both as they mature.", consequence: "Both develop." },
        teach: { text: "Discuss that growing up is ongoing.", consequence: "They understand." },
        boundary: { text: "They're not responsible for parent's growth.", consequence: "They're a teen." },
        avoid: { text: "Expect parent to suddenly be fully mature.", consequence: "Disappointment builds." },
        harm: { text: "Tell them parent will always be immature.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    14: {
      title: "Financial Struggles: Parent's Reality",
      topic: "Economic awareness",
      scene: "{childName} is 14. Parent's financial struggles are visible.",
      choices: {
        connect: { text: "Manage reality without burdening them.", consequence: "{childName} understands but isn't burdened." },
        teach: { text: "Discuss financial reality age-appropriately.", consequence: "They understand." },
        boundary: { text: "They're not responsible for finances.", consequence: "Childhood is protected." },
        avoid: { text: "Make them financially responsible.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them 'you're why parent struggled.'", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "College & Future: Parent as Model or Warning",
      topic: "Life planning",
      scene: "{childName} is 15. Planning college while parent may have limited education.",
      choices: {
        connect: { text: "Support their path regardless of parent's.", consequence: "{childName} plans confidently." },
        teach: { text: "Discuss that their path is theirs.", consequence: "Autonomy is clear." },
        boundary: { text: "Parent's choices don't limit theirs.", consequence: "Options feel real." },
        avoid: { text: "Expect them to parent their parent.", consequence: "{childName} is burdened." },
        harm: { text: "Tell them 'you have to succeed for parent.'", consequence: "{childName} internalizes pressure." }
      }
    },
    16: {
      title: "First Job or Commitment: Choosing Own Path",
      topic: "Independence milestone",
      scene: "{childName} is 16. Their own commitments starting.",
      choices: {
        connect: { text: "Support their choices.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss that their life is theirs.", consequence: "Autonomy develops." },
        boundary: { text: "They can choose differently than parent.", consequence: "Freedom is real." },
        avoid: { text: "Push them to \"make it\" for parent.", consequence: "{childName} feels burdened." },
        harm: { text: "Tell them they have to succeed where parent failed.", consequence: "{childName} internalizes pressure." }
      }
    },
    17: {
      title: "Understanding Parent's Journey: Why They Became Parent Young",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand parent's circumstances?",
      choices: {
        connect: { text: "Share parent's story authentically.", consequence: "{childName} understands." },
        teach: { text: "Discuss factors that led to early parenthood.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss parent's journey.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame them for parent's situation.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Life: Breaking or Continuing Cycles",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own life and choices.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about intentional choices.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward your expectations.", consequence: "{childName} might resent it." },
        harm: { text: "Tell them they have to fix parent's mistakes.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  caregiver_grandparent_home: {
    1: {
      title: "Raised by Grandparent",
      topic: "Intergenerational parenting",
      scene: "{childName} is raised by grandparent(s) instead of birth parents.",
      choices: {
        connect: { text: "Love them fully in this family structure.", consequence: "{childName} feels wanted." },
        teach: { text: "Explain family structure simply.", consequence: "They understand." },
        boundary: { text: "Grandparent's love is real love.", consequence: "They're secure." },
        avoid: { text: "Treat them as \"less than\" because of structure.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'your parents didn't want you.'", consequence: "{childName} internalizes rejection." }
      }
    },
    2: {
      title: "Grandparent as Primary Caregiver",
      topic: "Age gap parenting",
      scene: "{childName} is 2-3. Grandparent is in primary parent role.",
      choices: {
        connect: { text: "Support secure attachment with grandparent.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand intergenerational family.", consequence: "They adapt well." },
        boundary: { text: "Grandparent's presence is enough.", consequence: "They're safe." },
        avoid: { text: "Treat grandparent as lesser caregiver.", consequence: "{childName} questions attachment." },
        harm: { text: "Undermine grandparent's authority.", consequence: "{childName} becomes confused." }
      }
    },
    3: {
      title: "Age Difference & Energy: Grandparent's Limitations",
      topic: "Physical reality",
      scene: "{childName} is 3-4. Grandparent has different energy than younger parent.",
      choices: {
        connect: { text: "Accept grandparent's pace and adapt.", consequence: "{childName} adjusts well." },
        teach: { text: "Help them understand aging.", consequence: "They're compassionate." },
        boundary: { text: "Different pace doesn't mean less love.", consequence: "They're secure." },
        avoid: { text: "Push grandparent beyond capacity.", consequence: "{childName} feels unsafe." },
        harm: { text: "Tell them 'grandparent is too old to care.'", consequence: "{childName} internalizes ageism." }
      }
    },
    4: {
      title: "School: Explaining Grandparent Custody",
      topic: "Social identity",
      scene: "{childName} is in school. Explaining why grandparent is raising them.",
      choices: {
        connect: { text: "Help them explain proudly or simply.", consequence: "{childName} is confident." },
        teach: { text: "Normalize different family structures.", consequence: "They see diversity." },
        boundary: { text: "Their family is valid.", consequence: "They're not ashamed." },
        avoid: { text: "Make them hide their family structure.", consequence: "{childName} internalizes shame." },
        harm: { text: "Allow bullying about grandparent custody.", consequence: "{childName} internalizes rejection." }
      }
    },
    5: {
      title: "Contact With Birth Parents: Do They See Them?",
      topic: "Relationship maintenance",
      scene: "{childName} is 5. Do they spend time with birth parents?",
      choices: {
        connect: { text: "Support whatever relationship exists.", consequence: "{childName} has access." },
        teach: { text: "Help them understand different relationships.", consequence: "They navigate well." },
        boundary: { text: "Both relationships are allowed.", consequence: "They're not choosing." },
        avoid: { text: "Keep them from birth parents.", consequence: "{childName} feels loss." },
        harm: { text: "Use birth parents as reward/punishment.", consequence: "{childName} feels torn." }
      }
    },
    6: {
      title: "Grandparent's Health: Understanding Aging",
      topic: "Mortality awareness",
      scene: "{childName} is 6. Grandparent's health becomes a factor.",
      choices: {
        connect: { text: "Explain aging honestly and gently.", consequence: "{childName} understands." },
        teach: { text: "Discuss that aging is normal.", consequence: "They process it." },
        boundary: { text: "They're not responsible for health.", consequence: "They're a child." },
        avoid: { text: "Hide health issues.", consequence: "{childName} is confused." },
        harm: { text: "Tell them 'grandparent will die soon.'", consequence: "{childName} internalizes loss." }
      }
    },
    7: {
      title: "Caregiving Role: Are They Helping?",
      topic: "Responsibility boundary",
      scene: "{childName} is 7. Sometimes helping grandparent with tasks.",
      choices: {
        connect: { text: "Use their help without burdening.", consequence: "{childName} feels capable." },
        teach: { text: "Discuss helping vs. responsibility.", consequence: "Boundaries form." },
        boundary: { text: "They're not the primary caregiver.", consequence: "Childhood is protected." },
        avoid: { text: "Make them responsible for grandparent.", consequence: "{childName} loses childhood." },
        harm: { text: "Guilt-trip them for not helping enough.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Identity: Grandparent-Raised Kid",
      topic: "Self-understanding",
      scene: "{childName} is 8. Understanding that their family is different.",
      choices: {
        connect: { text: "Support this identity as normal.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss that different is okay.", consequence: "Confidence develops." },
        boundary: { text: "This identity doesn't make them less.", consequence: "Self-worth is stable." },
        avoid: { text: "Act like their structure is deficient.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'you're not lucky like normal kids.'", consequence: "{childName} internalizes loss." }
      }
    },
    9: {
      title: "Missing Birth Parents: Processing the Why",
      topic: "Loss and grief",
      scene: "{childName} is 9. Beginning to understand why birth parents aren't raising them.",
      choices: {
        connect: { text: "Explain honestly and compassionately.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that it's not their fault.", consequence: "Guilt is relieved." },
        boundary: { text: "Their situation is not their responsibility.", consequence: "They're innocent." },
        avoid: { text: "Avoid discussing why.", consequence: "{childName} is confused." },
        harm: { text: "Tell them 'parents abandoned you.'", consequence: "{childName} internalizes rejection." }
      }
    },
    10: {
      title: "School: Academic Support From Grandparent",
      topic: "Educational help",
      scene: "{childName} is 10. Grandparent supporting school needs.",
      choices: {
        connect: { text: "Ensure they get academic support.", consequence: "{childName} succeeds." },
        teach: { text: "Help grandparent help with homework.", consequence: "Support is strong." },
        boundary: { text: "Both are doing their best.", consequence: "They succeed." },
        avoid: { text: "Expect grandparent to be expert tutor.", consequence: "{childName} struggles." },
        harm: { text: "Blame grandparent for academic gaps.", consequence: "Conflict increases." }
      }
    },
    11: {
      title: "Adolescence Beginning: Needing Both Grandparent & Peer Connection",
      topic: "Developmental needs",
      scene: "{childName} is 11. Adolescence requires different support.",
      choices: {
        connect: { text: "Support adolescence while maintaining relationship.", consequence: "{childName} develops well." },
        teach: { text: "Discuss changing needs.", consequence: "They understand." },
        boundary: { text: "Grandparent's love remains constant.", consequence: "They're secure." },
        avoid: { text: "Treat adolescence as rejection.", consequence: "Conflict builds." },
        harm: { text: "Tell them they're ungrateful.", consequence: "{childName} internalizes guilt." }
      }
    },
    12: {
      title: "Dating & Relationships: Grandparent as Guide",
      topic: "Romantic development",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Let grandparent guide them.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss healthy relationships.", consequence: "Values form." },
        boundary: { text: "They're allowed to develop romantically.", consequence: "Development is normal." },
        avoid: { text: "Shame them for developing interest.", consequence: "{childName} hides." },
        harm: { text: "Tell them 'you're too young.'", consequence: "{childName} resents guidance." }
      }
    },
    13: {
      title: "Grandparent's Aging: Becoming Aware",
      topic: "Mortality increasing",
      scene: "{childName} is 13. Grandparent's mortality becomes real.",
      choices: {
        connect: { text: "Process feelings together.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that death comes to everyone.", consequence: "They understand." },
        boundary: { text: "They're not responsible for reversing aging.", consequence: "They're a teen." },
        avoid: { text: "Ignore grandparent's aging.", consequence: "{childName} is unprepared." },
        harm: { text: "Make them feel they caused aging.", consequence: "{childName} internalizes guilt." }
      }
    },
    14: {
      title: "Future Anxiety: What If Grandparent Dies?",
      topic: "Loss anticipation",
      scene: "{childName} is 14. Worrying about losing their primary parent figure.",
      choices: {
        connect: { text: "Address fears without dismissing them.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss contingency plans.", consequence: "Security increases." },
        boundary: { text: "They're not responsible for grandparent's mortality.", consequence: "They're protected." },
        avoid: { text: "Ignore their fears.", consequence: "{childName} becomes anxious." },
        harm: { text: "Use fears as control tool.", consequence: "{childName} becomes manipulated." }
      }
    },
    15: {
      title: "Grandparent's Final Phase: End-of-Life Reality",
      topic: "Witnessing mortality",
      scene: "{childName} is 15. Grandparent's health is failing significantly.",
      choices: {
        connect: { text: "Include them in appropriate ways.", consequence: "{childName} can say goodbye." },
        teach: { text: "Discuss dying process honestly.", consequence: "They understand." },
        boundary: { text: "They're included but not burdened as caregiver.", consequence: "They're a teen." },
        avoid: { text: "Hide the dying process.", consequence: "{childName} is confused." },
        harm: { text: "Make them primary caregiver.", consequence: "{childName} loses teen years." }
      }
    },
    16: {
      title: "Loss: Processing Grandparent's Death",
      topic: "Bereavement",
      scene: "{childName} is 16. Grandparent has passed.",
      choices: {
        connect: { text: "Grieve together and support their grief.", consequence: "{childName} can heal." },
        teach: { text: "Discuss that grief evolves.", consequence: "They understand process." },
        boundary: { text: "Their grief is valued.", consequence: "They're supported." },
        avoid: { text: "Dismiss their grief.", consequence: "{childName} internalizes loss." },
        harm: { text: "Tell them they should have done more.", consequence: "{childName} develops guilt." }
      }
    },
    17: {
      title: "Understanding Grandparent's Sacrifice: Why They Raised Them",
      topic: "Gratitude and values",
      scene: "{childName} is 17. Can they understand what grandparent gave?",
      choices: {
        connect: { text: "Share grandparent's story and love.", consequence: "{childName} understands deeply." },
        teach: { text: "Discuss family responsibility and love.", consequence: "Values clarify." },
        boundary: { text: "Grandparent's choice was about love.", consequence: "Relationship is honored." },
        avoid: { text: "Refuse to discuss grandparent's sacrifice.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them they owe grandparent everything.", consequence: "{childName} internalizes burden." }
      }
    },
    18: {
      title: "Adult Life: Honoring Grandparent's Legacy",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own life.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about meaningful living.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward your expectations.", consequence: "{childName} might resent it." },
        harm: { text: "Guilt-trip them about grandparent's sacrifice.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  military_relocation_cycle: {
    1: {
      title: "Born Into Military Family",
      topic: "Service-connected childhood",
      scene: "{childName} is born into active-duty military family.",
      choices: {
        connect: { text: "Create stability within the military lifestyle.", consequence: "{childName} feels secure." },
        teach: { text: "Explain military service simply.", consequence: "They understand." },
        boundary: { text: "Home is where family is.", consequence: "They're grounded." },
        avoid: { text: "Make service life chaotic and stressful.", consequence: "{childName} internalizes anxiety." },
        harm: { text: "Tell them military life is burden.", consequence: "{childName} internalizes resentment." }
      }
    },
    2: {
      title: "First Permanent Change of Station",
      topic: "Relocation beginning",
      scene: "{childName} is 2-3. First major move to new posting.",
      choices: {
        connect: { text: "Make transition warm and predictable.", consequence: "{childName} adapts well." },
        teach: { text: "Help them understand moving.", consequence: "They normalize it." },
        boundary: { text: "Routine continues despite location change.", consequence: "They're secure." },
        avoid: { text: "Make move disruptive and chaotic.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them they have to leave everything.", consequence: "{childName} internalizes loss." }
      }
    },
    3: {
      title: "New Post: New Home, New Rules",
      topic: "Adaptation cycle",
      scene: "{childName} is 3-4. Settling into new military community.",
      choices: {
        connect: { text: "Build community warmth in new location.", consequence: "{childName} feels welcomed." },
        teach: { text: "Explain new rules and expectations.", consequence: "They understand." },
        boundary: { text: "New place becomes home too.", consequence: "They're grounded." },
        avoid: { text: "Keep them isolated from community.", consequence: "{childName} feels alone." },
        harm: { text: "Tell them nowhere is home.", consequence: "{childName} internalizes rootlessness." }
      }
    },
    4: {
      title: "School: Entering Mid-Year or New School",
      topic: "Educational transitions",
      scene: "{childName} starts school at new posting.",
      choices: {
        connect: { text: "Help them adjust to new school.", consequence: "{childName} makes friends." },
        teach: { text: "Discuss that school changes are temporary.", consequence: "They adapt." },
        boundary: { text: "They're not responsible for parent's posting.", consequence: "They're a child." },
        avoid: { text: "Ignore transition struggles.", consequence: "{childName} falls behind socially." },
        harm: { text: "Blame them for adjustment struggles.", consequence: "{childName} internalizes shame." }
      }
    },
    5: {
      title: "Making Friends Then Losing Them",
      topic: "Grief and relationships",
      scene: "{childName} is 5-6. Beginning to understand goodbye cycle.",
      choices: {
        connect: { text: "Acknowledge friendship loss with compassion.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that long-distance friendships are possible.", consequence: "They feel hopeful." },
        boundary: { text: "Friendships matter even if temporary.", consequence: "They're valued." },
        avoid: { text: "Tell them not to get attached to friends.", consequence: "{childName} becomes isolated." },
        harm: { text: "Dismiss their friendship grief.", consequence: "{childName} internalizes that goodbyes don't matter." }
      }
    },
    6: {
      title: "Identity: Military Kid",
      topic: "Self-understanding",
      scene: "{childName} is 6. Understanding they're a military kid.",
      choices: {
        connect: { text: "Support military kid identity as special.", consequence: "{childName} feels proud." },
        teach: { text: "Discuss military kid strengths.", consequence: "They see value." },
        boundary: { text: "This identity is one part of who they are.", consequence: "They're multifaceted." },
        avoid: { text: "Act like military kid identity is burden.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them military kids have it harder.", consequence: "{childName} internalizes victimhood." }
      }
    },
    7: {
      title: "Another Move Happens",
      topic: "Cyclical transitions",
      scene: "{childName} is 7-8. Another posting change occurs.",
      choices: {
        connect: { text: "Normalize the move while honoring emotions.", consequence: "{childName} adapts well." },
        teach: { text: "Discuss moving as family pattern.", consequence: "They understand context." },
        boundary: { text: "Each move brings new possibilities.", consequence: "They're optimistic." },
        avoid: { text: "Make each move feel like loss.", consequence: "{childName} dreads moves." },
        harm: { text: "Tell them they should resent parent for moves.", consequence: "{childName} internalizes anger." }
      }
    },
    8: {
      title: "Separation: Parent Deployed",
      topic: "Parental absence",
      scene: "{childName} is 8-9. Service member parent is deployed.",
      choices: {
        connect: { text: "Maintain connection with deployed parent.", consequence: "{childName} feels close." },
        teach: { text: "Explain deployment age-appropriately.", consequence: "They understand." },
        boundary: { text: "Deployment is temporary.", consequence: "They're not abandoned." },
        avoid: { text: "Let deployment disrupt home stability.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them parent left because of them.", consequence: "{childName} internalizes guilt." }
      }
    },
    9: {
      title: "School Stability Despite Instability",
      topic: "Constancy amid change",
      scene: "{childName} is 9. School becomes anchor despite moves.",
      choices: {
        connect: { text: "Support school as source of stability.", consequence: "{childName} thrives academically." },
        teach: { text: "Discuss that some things stay constant.", consequence: "They feel grounded." },
        boundary: { text: "School is their consistent space.", consequence: "They're secure." },
        avoid: { text: "Neglect education due to moves.", consequence: "{childName} falls behind." },
        harm: { text: "Tell them school doesn't matter because they move.", consequence: "{childName} loses motivation." }
      }
    },
    10: {
      title: "Another New Post: The Pattern Is Clear",
      topic: "Cyclical awareness",
      scene: "{childName} is 10. Another move or pending move.",
      choices: {
        connect: { text: "Acknowledge pattern while managing emotions.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss military life as family choice.", consequence: "They see choice, not victimhood." },
        boundary: { text: "Transitions are challenging but manageable.", consequence: "Resilience builds." },
        avoid: { text: "Make them feel powerless.", consequence: "{childName} becomes helpless." },
        harm: { text: "Tell them military life is mistake.", consequence: "{childName} resents family." }
      }
    },
    11: {
      title: "Extended Family Far Away: Missing Grandparents, Cousins",
      topic: "Separation from relatives",
      scene: "{childName} is 11. Distance from extended family increases.",
      choices: {
        connect: { text: "Maintain connections with extended family.", consequence: "{childName} feels close." },
        teach: { text: "Discuss that long-distance relationships are real.", consequence: "They value distance connections." },
        boundary: { text: "Visits matter even if infrequent.", consequence: "They're cherished." },
        avoid: { text: "Let distance isolate them from relatives.", consequence: "{childName} feels alone." },
        harm: { text: "Tell them to accept permanent separation.", consequence: "{childName} internalizes loss." }
      }
    },
    12: {
      title: "Adolescence Begins: Stability Matters More",
      topic: "Developmental needs",
      scene: "{childName} is 12. Adolescence needs stability.",
      choices: {
        connect: { text: "Provide emotional stability amid moves.", consequence: "{childName} develops securely." },
        teach: { text: "Discuss adolescence and military life together.", consequence: "They see both as manageable." },
        boundary: { text: "Adolescent needs are valid despite moves.", consequence: "They're prioritized." },
        avoid: { text: "Ignore adolescent needs due to military life.", consequence: "{childName} struggles." },
        harm: { text: "Tell them adolescence is secondary to military duty.", consequence: "{childName} internalizes rejection." }
      }
    },
    13: {
      title: "Another Posting: High School Mid-Stream",
      topic: "Educational disruption",
      scene: "{childName} is 13-14. Move happens during high school years.",
      choices: {
        connect: { text: "Support transition with understanding.", consequence: "{childName} manages well." },
        teach: { text: "Discuss high school changes and moves.", consequence: "They see both can happen." },
        boundary: { text: "They're not responsible for posting decisions.", consequence: "They're a teen." },
        avoid: { text: "Ignore social-emotional impact of move.", consequence: "{childName} struggles." },
        harm: { text: "Tell them they should resent parent.", consequence: "{childName} internalizes anger." }
      }
    },
    14: {
      title: "Dating & Relationships: Knowing Goodbye Is Coming",
      topic: "Temporary connections",
      scene: "{childName} is 14. Dating with knowledge that goodbye might come.",
      choices: {
        connect: { text: "Allow them to develop relationships fully.", consequence: "{childName} dates healthily." },
        teach: { text: "Discuss temporary relationships matter.", consequence: "They value experiences." },
        boundary: { text: "Romantic development is allowed.", consequence: "They grow emotionally." },
        avoid: { text: "Discourage dating due to future moves.", consequence: "{childName} doesn't develop." },
        harm: { text: "Tell them relationships are pointless.", consequence: "{childName} becomes cynical." }
      }
    },
    15: {
      title: "Career Path Awareness: Parent's Service Impacts Them",
      topic: "Future planning",
      scene: "{childName} is 15. Beginning to think about their own future.",
      choices: {
        connect: { text: "Support whatever path they choose.", consequence: "{childName} feels empowered." },
        teach: { text: "Discuss military life as one option, not destiny.", consequence: "They see choices." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Expect them to follow parent's military path.", consequence: "{childName} might rebel." },
        harm: { text: "Tell them they must serve like parent.", consequence: "{childName} feels trapped." }
      }
    },
    16: {
      title: "College & Separation: What Happens Next?",
      topic: "Future transitions",
      scene: "{childName} is 16. Planning college while parent serves.",
      choices: {
        connect: { text: "Support their college transition.", consequence: "{childName} plans confidently." },
        teach: { text: "Discuss new kind of separation.", consequence: "They understand." },
        boundary: { text: "College is their next move.", consequence: "They control it." },
        avoid: { text: "Make college a military follow-up.", consequence: "{childName} loses autonomy." },
        harm: { text: "Tell them they can't leave military community.", consequence: "{childName} feels trapped." }
      }
    },
    17: {
      title: "Understanding Parent's Service: Why They Do It",
      topic: "Values and sacrifice",
      scene: "{childName} is 17. Can they understand parent's commitment?",
      choices: {
        connect: { text: "Share parent's motivations honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss service and family sacrifice.", consequence: "Empathy develops." },
        boundary: { text: "Parent's choice makes sense to them.", consequence: "Relationship is understood." },
        avoid: { text: "Refuse to discuss parent's service.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame parent for childhood instability.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Life: Own Path, Military or Not",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own relationship with stability.",
      choices: {
        connect: { text: "Support whatever life path they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about building stability.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward military.", consequence: "{childName} might resent it." },
        harm: { text: "Tell them they must follow parent's path.", consequence: "{childName} internalizes burden." }
      }
    }
  },

  taboo_polycule_household: {
    1: {
      title: "Born Into Non-Traditional Family",
      topic: "Polyamorous household",
      scene: "{childName} is born into consensual polyamorous household.",
      choices: {
        connect: { text: "Love them fully in their family structure.", consequence: "{childName} feels wanted." },
        teach: { text: "Explain family structure age-appropriately.", consequence: "They understand." },
        boundary: { text: "Their family is valid.", consequence: "They're secure." },
        avoid: { text: "Treat their family as wrong.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'this family isn't real.'", consequence: "{childName} internalizes rejection." }
      }
    },
    2: {
      title: "Multiple Attachment Figures",
      topic: "Secure attachments",
      scene: "{childName} is 2-3. Growing up with multiple parental figures.",
      choices: {
        connect: { text: "Support secure attachments to all caregivers.", consequence: "{childName} is secure." },
        teach: { text: "Help them understand multiple parents.", consequence: "They adapt well." },
        boundary: { text: "Multiple loves aren't confusing.", consequence: "They're grounded." },
        avoid: { text: "Treat other adults as intrusive.", consequence: "{childName} becomes confused." },
        harm: { text: "Tell them 'you can only have one real parent.'", consequence: "{childName} internalizes loss." }
      }
    },
    3: {
      title: "Household: Multiple Adults, Different Roles",
      topic: "Family dynamics",
      scene: "{childName} is 3-4. Understanding different adult roles.",
      choices: {
        connect: { text: "Create clear, consistent caregiving.", consequence: "{childName} feels secure." },
        teach: { text: "Explain different adult roles.", consequence: "They understand structure." },
        boundary: { text: "Multiple adults doesn't mean chaos.", consequence: "They're safe." },
        avoid: { text: "Let household be unclear or unstable.", consequence: "{childName} internalizes anxiety." },
        harm: { text: "Tell them the household is wrong.", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "School: Can They Explain Their Family?",
      topic: "Social identity",
      scene: "{childName} is in school. How do they talk about their family?",
      choices: {
        connect: { text: "Help them explain comfortably.", consequence: "{childName} is confident." },
        teach: { text: "Normalize different family structures.", consequence: "They see diversity." },
        boundary: { text: "Their family is theirs to explain.", consequence: "They have agency." },
        avoid: { text: "Make them hide their family.", consequence: "{childName} internalizes shame." },
        harm: { text: "Allow bullying about their family.", consequence: "{childName} internalizes rejection." }
      }
    },
    5: {
      title: "Peer Confusion: Why Do You Have Multiple Parents?",
      topic: "Peer questions",
      scene: "{childName} is 5-6. Peers ask about their unusual family.",
      choices: {
        connect: { text: "Help them answer with confidence.", consequence: "{childName} is secure." },
        teach: { text: "Discuss how to explain their family.", consequence: "They develop answers." },
        boundary: { text: "Their family is valid even if unusual.", consequence: "They're not ashamed." },
        avoid: { text: "Make them uncertain about explanation.", consequence: "{childName} becomes secretive." },
        harm: { text: "Tell them their family is too weird.", consequence: "{childName} internalizes shame." }
      }
    },
    6: {
      title: "Adults' Relationships: Can They See Affection?",
      topic: "Modeling love",
      scene: "{childName} is 6. Witnessing affection between multiple adults.",
      choices: {
        connect: { text: "Normalize affection between consenting adults.", consequence: "{childName} sees healthy love." },
        teach: { text: "Discuss different kinds of love.", consequence: "They understand complexity." },
        boundary: { text: "Affection is age-appropriate.", consequence: "They're not exposed improperly." },
        avoid: { text: "Hide all affection.", consequence: "{childName} learns shame." },
        harm: { text: "Be inappropriate with affection.", consequence: "{childName} is damaged." }
      }
    },
    7: {
      title: "Identifying as Polycule Kid: That's Who They Are",
      topic: "Identity forming",
      scene: "{childName} is 7. Understanding they're a polyamorous family kid.",
      choices: {
        connect: { text: "Support this identity as normal for them.", consequence: "{childName} feels secure." },
        teach: { text: "Discuss polyamory as valid relationship structure.", consequence: "They understand." },
        boundary: { text: "This identity is just one part.", consequence: "They're multifaceted." },
        avoid: { text: "Make this their entire identity.", consequence: "{childName} over-identifies." },
        harm: { text: "Tell them 'your family is broken.'", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "External Judgment: Family Isn't Always Accepted",
      topic: "Social pressure",
      scene: "{childName} is 8. Experiencing judgment about their family.",
      choices: {
        connect: { text: "Protect them from judgment while validating family.", consequence: "{childName} is secure." },
        teach: { text: "Discuss that people have different values.", consequence: "They understand difference." },
        boundary: { text: "Others' judgments don't define their family.", consequence: "They're confident." },
        avoid: { text: "Expect them to hide their family.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them 'people are right to judge.'", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "Managing Feelings: Multiple Adults' Emotions",
      topic: "Emotional complexity",
      scene: "{childName} is 9. Multiple adults means multiple emotional states.",
      choices: {
        connect: { text: "Help them not be responsible for adult emotions.", consequence: "{childName} is a child." },
        teach: { text: "Discuss that adults manage emotions.", consequence: "Boundaries form." },
        boundary: { text: "They're not emotional support for adults.", consequence: "Childhood is protected." },
        avoid: { text: "Make them manage adult emotions.", consequence: "{childName} loses childhood." },
        harm: { text: "Guilt-trip them for adults' feelings.", consequence: "{childName} internalizes responsibility." }
      }
    },
    10: {
      title: "Relationship Changes: What If Adults Leave?",
      topic: "Family restructuring",
      scene: "{childName} is 10. One polyamorous relationship ends or changes.",
      choices: {
        connect: { text: "Support them through change.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that relationships change.", consequence: "They understand fluidity." },
        boundary: { text: "They're not responsible for adult choices.", consequence: "They're innocent." },
        avoid: { text: "Make them feel abandoned.", consequence: "{childName} internalizes loss." },
        harm: { text: "Blame them for relationship changes.", consequence: "{childName} internalizes guilt." }
      }
    },
    11: {
      title: "Adolescence: Needing Privacy From Multiple Adults",
      topic: "Developmental autonomy",
      scene: "{childName} is 11. Adolescence needs privacy from multiple caregivers.",
      choices: {
        connect: { text: "Establish privacy boundaries.", consequence: "{childName} has space." },
        teach: { text: "Discuss adolescence boundaries.", consequence: "They're respected." },
        boundary: { text: "Multiple adults means clear privacy rules.", consequence: "They're protected." },
        avoid: { text: "Let multiple adults intrude on privacy.", consequence: "{childName} loses autonomy." },
        harm: { text: "Tell them privacy is selfish.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Dating & Relationships: What Model Do They See?",
      topic: "Romantic learning",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support them developing own relationship style.", consequence: "{childName} dates healthily." },
        teach: { text: "Discuss that they choose their own path.", consequence: "Autonomy is clear." },
        boundary: { text: "Their relationships are theirs to define.", consequence: "They're free." },
        avoid: { text: "Expect them to replicate polycule model.", consequence: "{childName} might feel pressured." },
        harm: { text: "Tell them all relationships are like theirs.", consequence: "{childName} is confused." }
      }
    },
    13: {
      title: "Teen Years: Navigating Complexity",
      topic: "Adolescent development",
      scene: "{childName} is 13. Teenage hormones + household complexity.",
      choices: {
        connect: { text: "Support adolescence amid household complexity.", consequence: "{childName} develops well." },
        teach: { text: "Discuss that adolescence is hard for everyone.", consequence: "They feel understood." },
        boundary: { text: "Their needs are prioritized.", consequence: "They're secure." },
        avoid: { text: "Let household drama consume their teen years.", consequence: "{childName} struggles." },
        harm: { text: "Tell them to manage adult conflicts.", consequence: "{childName} loses teen years." }
      }
    },
    14: {
      title: "Serious Relationships: One Adult Leaves the Household",
      topic: "Family restructuring",
      scene: "{childName} is 14. A significant adult leaves the polycule.",
      choices: {
        connect: { text: "Support them through loss.", consequence: "{childName} can grieve." },
        teach: { text: "Discuss that relationships end.", consequence: "They understand." },
        boundary: { text: "They're not responsible for adult choices.", consequence: "They're innocent." },
        avoid: { text: "Make them feel abandoned.", consequence: "{childName} internalizes loss." },
        harm: { text: "Blame them for the departure.", consequence: "{childName} internalizes guilt." }
      }
    },
    15: {
      title: "College Planning: Different Than Other Families",
      topic: "Future independence",
      scene: "{childName} is 15. Planning college while managing household identity.",
      choices: {
        connect: { text: "Support their independence fully.", consequence: "{childName} leaves confidently." },
        teach: { text: "Discuss that college is next chapter.", consequence: "They feel ready." },
        boundary: { text: "Their path is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Make college about proving family valid.", consequence: "{childName} feels burdened." },
        harm: { text: "Tell them they have to explain family at college.", consequence: "{childName} feels burdened." }
      }
    },
    16: {
      title: "Dating Others: Will They Accept Their Family?",
      topic: "Romantic complications",
      scene: "{childName} is 16 and dating. Explaining family to partners.",
      choices: {
        connect: { text: "Help them navigate partner reactions.", consequence: "{childName} dates openly." },
        teach: { text: "Discuss what real acceptance looks like.", consequence: "Standards are high." },
        boundary: { text: "Their family shouldn't be hidden.", consequence: "They're proud." },
        avoid: { text: "Tell them to hide their family.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them no one will accept their family.", consequence: "{childName} becomes cynical." }
      }
    },
    17: {
      title: "Understanding Adults' Choices: Why Polycule?",
      topic: "Family values",
      scene: "{childName} is 17. Can they understand adults' relationship choices?",
      choices: {
        connect: { text: "Share adults' motivations honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss different relationship values.", consequence: "Understanding develops." },
        boundary: { text: "Complexity is allowed.", consequence: "Relationship is honest." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame them for family structure.", consequence: "{childName} internalizes guilt." }
      }
    },
    18: {
      title: "Adult Life: Their Own Relationship Choices",
      topic: "Self-determination",
      scene: "{childName} is 18. Building their own approach to love.",
      choices: {
        connect: { text: "Support whatever relationship model they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about healthy relationships.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Push them toward polycule model.", consequence: "{childName} might resent it." },
        harm: { text: "Tell them they must replicate your family.", consequence: "{childName} internalizes pressure." }
      }
    }
  }
};