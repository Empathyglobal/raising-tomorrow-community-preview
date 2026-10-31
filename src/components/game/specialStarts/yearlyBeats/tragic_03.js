
export const SPECIAL_START_YEARLY_BEATS__TRAGIC_03 = {
  dv_escape: {
    1: {
      title: "Born Into Violence",
      topic: "Domestic trauma exposure",
      scene: "{childName} is born into home with domestic violence.",
      choices: {
        connect: { text: "Love them fully despite chaos.", consequence: "{childName} feels wanted." },
        teach: { text: "Create safe spaces within home.", consequence: "They find security." },
        boundary: { text: "Violence isn't their fault.", consequence: "They're innocent." },
        avoid: { text: "Let them witness violence.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them violence is normal.", consequence: "{childName} internalizes that abuse = normal." }
      }
    },
    2: {
      title: "Living in Fear: When Will Fighting Start?",
      topic: "Hypervigilance",
      scene: "{childName} is 2-3. Learning to predict violence.",
      choices: {
        connect: { text: "Create safety rituals.", consequence: "{childName} feels partially protected." },
        teach: { text: "Help them recognize danger signs.", consequence: "They develop awareness." },
        boundary: { text: "Fear is understandable.", consequence: "They're protected." },
        avoid: { text: "Normalize the violence.", consequence: "{childName} internalizes hypervigilance." },
        harm: { text: "Tell them violence is their fault.", consequence: "{childName} internalizes guilt." }
      }
    },
    3: {
      title: "Abuse Escalation: Worse Than Before",
      topic: "Increasing violence",
      scene: "{childName} is 3-4. Violence intensifies.",
      choices: {
        connect: { text: "Protect them from worst.", consequence: "{childName} feels loved." },
        teach: { text: "Help them understand they're not safe.", consequence: "They grasp reality." },
        boundary: { text: "Violence is unacceptable.", consequence: "They're protected." },
        avoid: { text: "Expose them fully to abuse.", consequence: "{childName} becomes traumatized." },
        harm: { text: "Tell them they caused it.", consequence: "{childName} internalizes guilt." }
      }
    },
    4: {
      title: "School: Hiding Injuries and Fear",
      topic: "Social concealment",
      scene: "{childName} is in school. Teachers may notice.",
      choices: {
        connect: { text: "Let them speak to safe adults.", consequence: "{childName} gets help." },
        teach: { text: "Help them navigate disclosure.", consequence: "They're empowered." },
        boundary: { text: "Abuse isn't secret shame.", consequence: "They can get help." },
        avoid: { text: "Force them to keep secrets.", consequence: "{childName} becomes isolated." },
        harm: { text: "Tell them they'll be separated if they tell.", consequence: "{childName} internalizes fear of getting help." }
      }
    },
    5: {
      title: "Decision: Stay or Leave?",
      topic: "Escape planning begins",
      scene: "{childName} is 5-6. Parent might leave abuser.",
      choices: {
        connect: { text: "Support escape planning.", consequence: "{childName} has hope." },
        teach: { text: "Help them understand safety planning.", consequence: "They're grounded." },
        boundary: { text: "Escape is possible.", consequence: "They're secure." },
        avoid: { text: "Keep them in abuse.", consequence: "{childName} internalizes that escape is impossible." },
        harm: { text: "Tell them leaving means breaking family.", consequence: "{childName} internalizes guilt about escape." }
      }
    },
    6: {
      title: "Identity: Child of Abuse",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that abuse isn't their fault.", consequence: "They understand." },
        boundary: { text: "They're worthy.", consequence: "They're secure." },
        avoid: { text: "Make abuse their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're broken.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "The Escape: Leaving Abuser",
      topic: "Crisis flight",
      scene: "{childName} is 7. Family flees domestic violence home.",
      choices: {
        connect: { text: "Support them through escape.", consequence: "{childName} is safe." },
        teach: { text: "Help them understand they're safe now.", consequence: "They begin healing." },
        boundary: { text: "Escape is brave.", consequence: "They're secure." },
        avoid: { text: "Make escape traumatic.", consequence: "{childName} internalizes crisis." },
        harm: { text: "Tell them escape was selfish.", consequence: "{childName} internalizes guilt." }
      }
    },
    8: {
      title: "Emergency Shelter: Starting Over",
      topic: "Immediate aftermath",
      scene: "{childName} is 8. In shelter or safe housing.",
      choices: {
        connect: { text: "Create stability.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand new life.", consequence: "They adapt." },
        boundary: { text: "Safety is real.", consequence: "They're secure." },
        avoid: { text: "Let them feel permanent uncertainty.", consequence: "{childName} internalizes homelessness." },
        harm: { text: "Tell them abuser will find them.", consequence: "{childName} internalizes terror." }
      }
    },
    9: {
      title: "Fear of Contact: Abuser Trying to Reach",
      topic: "Ongoing threat",
      scene: "{childName} is 9. Abuser contacts or tries to.",
      choices: {
        connect: { text: "Protect them from contact.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand protection.", consequence: "They're grounded." },
        boundary: { text: "Protection is possible.", consequence: "They're secure." },
        avoid: { text: "Force contact with abuser.", consequence: "{childName} becomes traumatized." },
        harm: { text: "Tell them abuser will always be threat.", consequence: "{childName} internalizes permanent fear." }
      }
    },
    10: {
      title: "Healing: First Moments of Safety",
      topic: "Trauma processing begins",
      scene: "{childName} is 10. Beginning to feel safe.",
      choices: {
        connect: { text: "Support their healing.", consequence: "{childName} heals." },
        teach: { text: "Help them process trauma.", consequence: "They develop resilience." },
        boundary: { text: "Healing is possible.", consequence: "They're secure." },
        avoid: { text: "Tell them to move on quickly.", consequence: "{childName} suppresses trauma." },
        harm: { text: "Tell them they'll always be damaged.", consequence: "{childName} internalizes self-hatred." }
      }
    },
    11: {
      title: "Adolescence: Understanding What Happened",
      topic: "Trauma integration",
      scene: "{childName} is 11. Old enough to understand.",
      choices: {
        connect: { text: "Support their understanding.", consequence: "{childName} processes trauma." },
        teach: { text: "Help them make sense of it.", consequence: "They develop perspective." },
        boundary: { text: "Understanding is healing.", consequence: "They're secure." },
        avoid: { text: "Deny what happened.", consequence: "{childName} internalizes confusion." },
        harm: { text: "Tell them they should have prevented it.", consequence: "{childName} internalizes blame." }
      }
    },
    12: {
      title: "Dating & Relationships: Trust Issues",
      topic: "Romantic fear",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them develop healthy relationship model.", consequence: "They learn." },
        boundary: { text: "Healthy relationships are possible.", consequence: "They're worthy." },
        avoid: { text: "Tell them not to date.", consequence: "{childName} internalizes avoidance." },
        harm: { text: "Tell them they'll replicate abuse.", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Abuser Tries to Reestablish Contact",
      topic: "Ongoing manipulation",
      scene: "{childName} is 13. Abuser sends message or visits.",
      choices: {
        connect: { text: "Protect them from manipulation.", consequence: "{childName} is safe." },
        teach: { text: "Help them recognize manipulation.", consequence: "{childName} is informed." },
        boundary: { text: "They don't owe abuser anything.", consequence: "{childName} is secure." },
        avoid: { text: "Force reconciliation.", consequence: "{childName} becomes re-traumatized." },
        harm: { text: "Tell them they're ungrateful.", consequence: "{childName} internalizes guilt." }
      }
    },
    14: {
      title: "Processing Feelings: Anger and Grief",
      topic: "Complex emotions",
      scene: "{childName} is 14. Processing anger and loss.",
      choices: {
        connect: { text: "Validate all their feelings.", consequence: "{childName} heals." },
        teach: { text: "Help them process emotions.", consequence: "They develop healthy expression." },
        boundary: { text: "All feelings are valid.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them to be grateful for survival.", consequence: "{childName} suppresses feelings." },
        harm: { text: "Tell them their anger is wrong.", consequence: "{childName} internalizes shame about feelings." }
      }
    },
    15: {
      title: "College Planning: Building Independent Future",
      topic: "Forward momentum",
      scene: "{childName} is 15. Planning education.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Help them plan independence.", consequence: "They're strategic." },
        boundary: { text: "Their future is bright.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them they can't succeed.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them abuse defined them.", consequence: "{childName} suppresses ambition." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Trust",
      topic: "Love amid healing",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them communicate needs.", consequence: "They're honest." },
        boundary: { text: "Healthy love is possible.", consequence: "{childName} is worthy." },
        avoid: { text: "Make them paranoid.", consequence: "{childName} internalizes distrust." },
        harm: { text: "Tell them they'll repeat abuse.", consequence: "{childName} internalizes shame." }
      }
    },
    17: {
      title: "Understanding Parent: Why Didn't They Leave Sooner?",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share parent's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss abuse dynamics.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding doesn't mean blame.", consequence: "{childName} is secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent was coward.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Building Healthy Life",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about breaking cycles.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they must stay close.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they're damaged goods.", consequence: "{childName} internalizes shame." }
      }
    }
  },

  addiction_recovery_home: {
    1: {
      title: "Born Into Recovery Home",
      topic: "Parental addiction aftermath",
      scene: "{childName} is born. Parent/guardian recovering from addiction.",
      choices: {
        connect: { text: "Love them fully despite recovery journey.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them feel safe.", consequence: "They're secure." },
        boundary: { text: "They're not responsible for parent's recovery.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent might relapse.", consequence: "{childName} internalizes fear." }
      }
    },
    2: {
      title: "Unpredictable Parent: Still Early Recovery",
      topic: "Emotional volatility",
      scene: "{childName} is 2-3. Parent's mood unstable during recovery.",
      choices: {
        connect: { text: "Provide consistent love.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand parent's journey.", consequence: "They're grounded." },
        boundary: { text: "Parent's emotions aren't their responsibility.", consequence: "They're protected." },
        avoid: { text: "Make them emotional support for parent.", consequence: "{childName} internalizes parentification." },
        harm: { text: "Tell them parent might use again.", consequence: "{childName} internalizes fear." }
      }
    },
    3: {
      title: "Recovery Milestones: Parent's Progress",
      topic: "Positive change",
      scene: "{childName} is 3-4. Parent celebrates sobriety milestones.",
      choices: {
        connect: { text: "Celebrate progress together.", consequence: "{childName} feels hopeful." },
        teach: { text: "Help them understand recovery is real.", consequence: "They believe in change." },
        boundary: { text: "Recovery is possible.", consequence: "{childName} is secure." },
        avoid: { text: "Minimize parent's progress.", consequence: "{childName} internalizes doubt." },
        harm: { text: "Tell them progress won't last.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    4: {
      title: "School: Parent Becoming More Present",
      topic: "Rebuilding relationship",
      scene: "{childName} is in school. Parent more involved now.",
      choices: {
        connect: { text: "Encourage healthy bonding.", consequence: "{childName} reconnects with parent." },
        teach: { text: "Help them rebuild trust gradually.", consequence: "They're cautious but open." },
        boundary: { text: "Trust takes time.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them to fully trust parent.", consequence: "{childName} becomes vulnerable too quickly." },
        harm: { text: "Tell them parent will abandon them.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    5: {
      title: "Trauma History: Understanding What Happened",
      topic: "Age-appropriate explanation",
      scene: "{childName} is 5-6. Learning what addiction was.",
      choices: {
        connect: { text: "Explain age-appropriately with love.", consequence: "{childName} understands." },
        teach: { text: "Help them understand parent was sick.", consequence: "They develop compassion." },
        boundary: { text: "Addiction wasn't their fault.", consequence: "{childName} is protected." },
        avoid: { text: "Make them feel responsible.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent was monster.", consequence: "{childName} internalizes parent shame." }
      }
    },
    6: {
      title: "Identity: Child of Recovering Parent",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that they're not defined by parent's history.", consequence: "They understand." },
        boundary: { text: "They're more than parent's addiction.", consequence: "{childName} is secure." },
        avoid: { text: "Make addiction their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're predestined for addiction.", consequence: "{childName} internalizes fatalism." }
      }
    },
    7: {
      title: "Support Meetings: Parent's Ongoing Recovery",
      topic: "Visible commitment",
      scene: "{childName} is 7. Seeing parent attend meetings.",
      choices: {
        connect: { text: "Normalize parent's recovery work.", consequence: "{childName} respects it." },
        teach: { text: "Help them understand recovery is ongoing.", consequence: "They're grounded." },
        boundary: { text: "Recovery is a positive choice.", consequence: "{childName} is secure." },
        avoid: { text: "Make them feel abandoned by meetings.", consequence: "{childName} internalizes resentment." },
        harm: { text: "Tell them parent is weak for needing meetings.", consequence: "{childName} internalizes shame about recovery." }
      }
    },
    8: {
      title: "Peer Relationships: Keeping Parent's History Secret",
      topic: "Social concealment",
      scene: "{childName} is 8. Deciding what to share about family.",
      choices: {
        connect: { text: "Let them share selectively.", consequence: "{childName} is authentic." },
        teach: { text: "Help them choose who to trust.", consequence: "They navigate wisely." },
        boundary: { text: "Parent's history is not shame.", consequence: "{childName} is secure." },
        avoid: { text: "Force them to hide.", consequence: "{childName} internalizes isolation." },
        harm: { text: "Tell them peers will reject them.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Relapse Fear: Parent Has a Close Call",
      topic: "Recovery fragility",
      scene: "{childName} is 9. Parent struggles briefly.",
      choices: {
        connect: { text: "Support them through fear.", consequence: "{childName} feels held." },
        teach: { text: "Help them understand recovery setbacks.", consequence: "They're grounded." },
        boundary: { text: "Parent is fighting for sobriety.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them relapse is coming.", consequence: "{childName} internalizes dread." },
        harm: { text: "Tell them they should expect failure.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    10: {
      title: "Stable Period: Parent's Sustained Recovery",
      topic: "Consistent healing",
      scene: "{childName} is 10. Parent stable for years.",
      choices: {
        connect: { text: "Celebrate stability.", consequence: "{childName} feels secure." },
        teach: { text: "Help them trust the progress.", consequence: "They believe in recovery." },
        boundary: { text: "Stability is real.", consequence: "{childName} is secure." },
        avoid: { text: "Wait for disaster.", consequence: "{childName} internalizes fear." },
        harm: { text: "Tell them disaster is coming.", consequence: "{childName} internalizes hypervigilance." }
      }
    },
    11: {
      title: "Adolescence: Understanding Addiction Fully",
      topic: "Complex comprehension",
      scene: "{childName} is 11. Old enough to understand fully.",
      choices: {
        connect: { text: "Share parent's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss addiction as disease.", consequence: "They grasp complexity." },
        boundary: { text: "Understanding doesn't mean blame.", consequence: "{childName} is secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent caused family damage.", consequence: "{childName} internalizes resentment." }
      }
    },
    12: {
      title: "Dating & Relationships: Trust and Vulnerability",
      topic: "Romantic fear",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them develop healthy relationship model.", consequence: "They learn." },
        boundary: { text: "Healthy relationships are possible.", consequence: "{childName} is worthy." },
        avoid: { text: "Tell them not to trust.", consequence: "{childName} internalizes avoidance." },
        harm: { text: "Tell them they'll attract addicts.", consequence: "{childName} internalizes fear." }
      }
    },
    13: {
      title: "Parent Celebrates Long Sobriety",
      topic: "Major milestone",
      scene: "{childName} is 13. Parent celebrates significant sobriety.",
      choices: {
        connect: { text: "Celebrate together.", consequence: "{childName} feels proud." },
        teach: { text: "Help them understand parent's strength.", consequence: "They're inspired." },
        boundary: { text: "Recovery is powerful.", consequence: "{childName} is secure." },
        avoid: { text: "Minimize achievement.", consequence: "{childName} internalizes doubt." },
        harm: { text: "Tell them it won't last.", consequence: "{childName} internalizes pessimism." }
      }
    },
    14: {
      title: "Repairing Damage: Parent Makes Amends",
      topic: "Healing relationships",
      scene: "{childName} is 14. Parent works to repair past harms.",
      choices: {
        connect: { text: "Support reconciliation.", consequence: "{childName} heals." },
        teach: { text: "Help them forgive gradually.", consequence: "They develop compassion." },
        boundary: { text: "Forgiveness is their choice.", consequence: "{childName} is empowered." },
        avoid: { text: "Force forgiveness.", consequence: "{childName} feels pressured." },
        harm: { text: "Tell them parent doesn't deserve forgiveness.", consequence: "{childName} internalizes resentment." }
      }
    },
    15: {
      title: "College Planning: Strong Family Support",
      topic: "Educational possibility",
      scene: "{childName} is 15. Planning education.",
      choices: {
        connect: { text: "Support their goals.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss paths forward.", consequence: "They're informed." },
        boundary: { text: "Their future is theirs.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them family history limits them.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're predestined for addiction.", consequence: "{childName} suppresses ambition." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Family Health",
      topic: "Love with healthy family",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them enjoy healthy family.", consequence: "They're present." },
        boundary: { text: "Healthy family is possible.", consequence: "{childName} is worthy." },
        avoid: { text: "Make partner uncomfortable.", consequence: "{childName} loses love." },
        harm: { text: "Tell them partner will abandon them.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Parent: Journey from Addiction to Recovery",
      topic: "Parental story",
      scene: "{childName} is 17. Ready to understand fully.",
      choices: {
        connect: { text: "Share parent's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss recovery and redemption.", consequence: "They grasp complexity." },
        boundary: { text: "Recovery is powerful.", consequence: "{childName} is secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent will never recover.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    18: {
      title: "Adult Choice: Building Life With New Model",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about recovery and redemption.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they owe parent.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they'll repeat parent's path.", consequence: "{childName} internalizes fatalism." }
      }
    }
  },

  child_chronic_illness: {
    1: {
      title: "Born With Chronic Condition",
      topic: "Lifelong health challenge",
      scene: "{childName} is born with chronic illness.",
      choices: {
        connect: { text: "Love them fully despite illness.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand their condition.", consequence: "They're grounded." },
        boundary: { text: "They're a child first.", consequence: "They're innocent." },
        avoid: { text: "Make illness their whole identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're burden.", consequence: "{childName} internalizes guilt." }
      }
    },
    2: {
      title: "Medical Appointments: Endless Hospital Visits",
      topic: "Medical necessity",
      scene: "{childName} is 2-3. Frequent medical care.",
      choices: {
        connect: { text: "Make visits feel safe.", consequence: "{childName} cooperates." },
        teach: { text: "Help them understand care is helping.", consequence: "They grasp it." },
        boundary: { text: "Medical care is necessary.", consequence: "{childName} is secure." },
        avoid: { text: "Traumatize them with procedures.", consequence: "{childName} internalizes medical fear." },
        harm: { text: "Tell them hospitals are punishment.", consequence: "{childName} internalizes fear." }
      }
    },
    3: {
      title: "Physical Limitations: Can't Do What Peers Do",
      topic: "Developmental difference",
      scene: "{childName} is 3-4. Noticing physical restrictions.",
      choices: {
        connect: { text: "Help them do what they can.", consequence: "{childName} is capable." },
        teach: { text: "Discuss that different abilities are valid.", consequence: "They're grounded." },
        boundary: { text: "Limitations don't define worth.", consequence: "{childName} is secure." },
        avoid: { text: "Make them feel broken.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them they're less than peers.", consequence: "{childName} internalizes inadequacy." }
      }
    },
    4: {
      title: "School: Explaining Illness to Peers",
      topic: "Social explanation",
      scene: "{childName} is in school. Peers ask about condition.",
      choices: {
        connect: { text: "Help them explain with confidence.", consequence: "{childName} is secure." },
        teach: { text: "Develop honest explanation together.", consequence: "They navigate." },
        boundary: { text: "Their condition is theirs to explain.", consequence: "{childName} is empowered." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will mock them.", consequence: "{childName} becomes isolated." }
      }
    },
    5: {
      title: "Pain and Suffering: Bad Days",
      topic: "Chronic symptoms",
      scene: "{childName} is 5-6. Learning to manage symptoms.",
      choices: {
        connect: { text: "Comfort them on hard days.", consequence: "{childName} feels loved." },
        teach: { text: "Help them develop coping strategies.", consequence: "They're capable." },
        boundary: { text: "Pain is real and manageable.", consequence: "{childName} is secure." },
        avoid: { text: "Dismiss their pain.", consequence: "{childName} internalizes that needs don't matter." },
        harm: { text: "Tell them they're just seeking attention.", consequence: "{childName} internalizes shame." }
      }
    },
    6: {
      title: "Identity: Sick Child",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value beyond illness.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that illness is one part.", consequence: "They develop complex identity." },
        boundary: { text: "They're more than their illness.", consequence: "{childName} is secure." },
        avoid: { text: "Make illness their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're defined by sickness.", consequence: "{childName} internalizes that worthiness = health." }
      }
    },
    7: {
      title: "School Absences: Missing Time With Friends",
      topic: "Social isolation",
      scene: "{childName} is 7. Illness keeps them home.",
      choices: {
        connect: { text: "Help them stay connected to peers.", consequence: "{childName} has friends." },
        teach: { text: "Discuss that friendships can be maintained.", consequence: "They believe it." },
        boundary: { text: "Isolation is temporary.", consequence: "{childName} is secure." },
        avoid: { text: "Let them become isolated.", consequence: "{childName} internalizes loneliness." },
        harm: { text: "Tell them they'll never have real friends.", consequence: "{childName} internalizes permanent isolation." }
      }
    },
    8: {
      title: "Peer Relationships: Explaining Why They're Different",
      topic: "Social navigation",
      scene: "{childName} is 8. Peers notice their limitations.",
      choices: {
        connect: { text: "Help them navigate with dignity.", consequence: "{childName} is confident." },
        teach: { text: "Discuss that different is okay.", consequence: "They're grounded." },
        boundary: { text: "Their worth isn't their health.", consequence: "{childName} is secure." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will reject them.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "Future Uncertainty: Will They Get Better?",
      topic: "Prognosis fear",
      scene: "{childName} is 9. Wondering about their future.",
      choices: {
        connect: { text: "Be honest about possibilities.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss hope and realism.", consequence: "They're informed." },
        boundary: { text: "Future is uncertain but possible.", consequence: "{childName} is secure." },
        avoid: { text: "Give false hope.", consequence: "{childName} becomes unprepared." },
        harm: { text: "Tell them they'll always be sick.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    10: {
      title: "Increasing Independence: Managing Own Care",
      topic: "Self-advocacy emerging",
      scene: "{childName} is 10. Taking some responsibility for health.",
      choices: {
        connect: { text: "Support their growing independence.", consequence: "{childName} is empowered." },
        teach: { text: "Help them manage their care.", consequence: "They're capable." },
        boundary: { text: "They're growing up.", consequence: "{childName} is secure." },
        avoid: { text: "Make them fully responsible too young.", consequence: "{childName} internalizes unfair burden." },
        harm: { text: "Tell them they're responsible if they get worse.", consequence: "{childName} internalizes guilt." }
      }
    },
    11: {
      title: "Adolescence: New Complications or Stability",
      topic: "Teenage changes",
      scene: "{childName} is 11. Puberty changes their condition.",
      choices: {
        connect: { text: "Support them through changes.", consequence: "{childName} is resilient." },
        teach: { text: "Help them adapt to new symptoms.", consequence: "They're grounded." },
        boundary: { text: "Adaptation is possible.", consequence: "{childName} is secure." },
        avoid: { text: "Let changes overwhelm them.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them things will only get worse.", consequence: "{childName} internalizes hopelessness." }
      }
    },
    12: {
      title: "Dating & Relationships: Will Anyone Accept Them?",
      topic: "Romantic fear",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them navigate disclosing illness.", consequence: "They navigate." },
        boundary: { text: "They're worthy of love.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them no one will want them.", consequence: "{childName} internalizes unworthiness." },
        harm: { text: "Tell them they'll burden partners.", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "School Pressure: Balancing Illness and Education",
      topic: "Academic access",
      scene: "{childName} is 13. School demands conflict with health needs.",
      choices: {
        connect: { text: "Advocate for their needs.", consequence: "{childName} is supported." },
        teach: { text: "Help them balance health and academics.", consequence: "They're strategic." },
        boundary: { text: "Their health comes first.", consequence: "{childName} is protected." },
        avoid: { text: "Force academic performance at health cost.", consequence: "{childName} internalizes that achievement = suffering." },
        harm: { text: "Tell them they should just push through.", consequence: "{childName} harms themselves trying to perform." }
      }
    },
    14: {
      title: "Medical Team: Learning to Advocate",
      topic: "Healthcare navigation",
      scene: "{childName} is 14. Becoming active in own healthcare.",
      choices: {
        connect: { text: "Support their advocacy.", consequence: "{childName} is empowered." },
        teach: { text: "Help them ask questions and seek answers.", consequence: "They're informed." },
        boundary: { text: "Their body, their voice.", consequence: "{childName} is secure." },
        avoid: { text: "Make them passive patients.", consequence: "{childName} internalizes powerlessness." },
        harm: { text: "Tell them doctors know better than they do.", consequence: "{childName} internalizes that their experience doesn't matter." }
      }
    },
    15: {
      title: "College Planning: Can They Manage?",
      topic: "Future independence",
      scene: "{childName} is 15. Planning education despite illness.",
      choices: {
        connect: { text: "Support their educational goals.", consequence: "{childName} is empowered." },
        teach: { text: "Discuss accommodations and support.", consequence: "They're informed." },
        boundary: { text: "College is possible.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them illness prevents college.", consequence: "{childName} limits dreams." },
        harm: { text: "Tell them they should give up on independence.", consequence: "{childName} internalizes helplessness." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Full Disclosure",
      topic: "Love with health reality",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them communicate their needs.", consequence: "They're honest." },
        boundary: { text: "Their relationship is valid.", consequence: "{childName} is worthy." },
        avoid: { text: "Make partner feel burdened.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them partner will leave when they find out.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Their Journey: What They've Endured",
      topic: "Self-recognition",
      scene: "{childName} is 17. Reflecting on their resilience.",
      choices: {
        connect: { text: "Celebrate their strength.", consequence: "{childName} is proud." },
        teach: { text: "Help them recognize their resilience.", consequence: "They're confident." },
        boundary: { text: "They've survived much.", consequence: "{childName} is secure." },
        avoid: { text: "Refuse to acknowledge their journey.", consequence: "{childName} feels unseen." },
        harm: { text: "Tell them they should be grateful to suffer.", consequence: "{childName} internalizes that suffering = grateful." }
      }
    },
    18: {
      title: "Adult Choice: Living Life on Their Terms",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about living fully with illness.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them illness defines their life.", consequence: "{childName} might resent." },
        harm: { text: "Tell them they should have lower expectations.", consequence: "{childName} internalizes limitation." }
      }
    }
  },

  parent_chronic_illness: {
    1: {
      title: "Born to Ill Parent",
      topic: "Parental health crisis",
      scene: "{childName} is born. Parent has chronic illness.",
      choices: {
        connect: { text: "Love them fully despite parent's illness.", consequence: "{childName} feels wanted." },
        teach: { text: "Help them understand parent's condition.", consequence: "They're grounded." },
        boundary: { text: "They're not responsible for parent.", consequence: "They're innocent." },
        avoid: { text: "Make them feel like burden.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Tell them parent is dying.", consequence: "{childName} internalizes fear." }
      }
    },
    2: {
      title: "Parent's Bad Days: Unpredictable Mood",
      topic: "Parental inconsistency",
      scene: "{childName} is 2-3. Parent sometimes can't be present.",
      choices: {
        connect: { text: "Provide consistent love.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand parent's limitations.", consequence: "They're grounded." },
        boundary: { text: "Parent's illness isn't their fault.", consequence: "They're protected." },
        avoid: { text: "Make them responsible for parent's mood.", consequence: "{childName} internalizes emotional labor." },
        harm: { text: "Tell them parent doesn't love them.", consequence: "{childName} internalizes abandonment." }
      }
    },
    3: {
      title: "Hospital Visits: Parent's Health Crisis",
      topic: "Acute episodes",
      scene: "{childName} is 3-4. Parent has serious health event.",
      choices: {
        connect: { text: "Protect them from worst fear.", consequence: "{childName} feels safe." },
        teach: { text: "Help them understand parent will be okay.", consequence: "They're grounded." },
        boundary: { text: "Parent's care isn't their job.", consequence: "They're protected." },
        avoid: { text: "Make them witness crisis.", consequence: "{childName} internalizes trauma." },
        harm: { text: "Tell them parent might die.", consequence: "{childName} internalizes terror." }
      }
    },
    4: {
      title: "School: Worried About Parent at Home",
      topic: "Parental preoccupation",
      scene: "{childName} is in school. Worrying about parent.",
      choices: {
        connect: { text: "Reassure them parent is safe.", consequence: "{childName} can focus." },
        teach: { text: "Help them understand worry is normal.", consequence: "They're grounded." },
        boundary: { text: "They're not responsible for parent's health.", consequence: "{childName} is protected." },
        avoid: { text: "Tell them to check on parent constantly.", consequence: "{childName} internalizes caregiver burden." },
        harm: { text: "Tell them parent's health is their fault.", consequence: "{childName} internalizes guilt." }
      }
    },
    5: {
      title: "Taking Care of Parent: Early Caregiving",
      topic: "Parentification beginning",
      scene: "{childName} is 5-6. Doing small tasks for parent.",
      choices: {
        connect: { text: "Limit caregiving to age-appropriate.", consequence: "{childName} helps without burden." },
        teach: { text: "Discuss that parent is grateful.", consequence: "They feel valued." },
        boundary: { text: "They're still a child.", consequence: "They're protected." },
        avoid: { text: "Overload them with adult care.", consequence: "{childName} internalizes parentification." },
        harm: { text: "Tell them parent depends on them.", consequence: "{childName} internalizes responsibility." }
      }
    },
    6: {
      title: "Identity: Child of Ill Parent",
      topic: "Self-understanding",
      scene: "{childName} is 6. Who are they?",
      choices: {
        connect: { text: "Affirm their value.", consequence: "{childName} is grounded." },
        teach: { text: "Discuss that parent's illness isn't theirs.", consequence: "They understand." },
        boundary: { text: "They're not defined by parent's illness.", consequence: "{childName} is secure." },
        avoid: { text: "Make illness their identity.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Tell them they're caretaker.", consequence: "{childName} internalizes premature adulthood." }
      }
    },
    7: {
      title: "Family Role Change: More Responsibility",
      topic: "Increasing burden",
      scene: "{childName} is 7. Taking on household responsibilities.",
      choices: {
        connect: { text: "Keep responsibilities age-appropriate.", consequence: "{childName} helps healthily." },
        teach: { text: "Balance work with childhood.", consequence: "They develop normally." },
        boundary: { text: "Childhood is protected.", consequence: "{childName} is secure." },
        avoid: { text: "Overload them with adult tasks.", consequence: "{childName} loses childhood." },
        harm: { text: "Tell them family depends on them.", consequence: "{childName} internalizes burden." }
      }
    },
    8: {
      title: "Peer Relationships: Explaining Parent's Illness",
      topic: "Social explanation",
      scene: "{childName} is 8. Peers ask why parent is limited.",
      choices: {
        connect: { text: "Help them explain with confidence.", consequence: "{childName} is secure." },
        teach: { text: "Develop honest explanation.", consequence: "They navigate." },
        boundary: { text: "Parent's condition is not shame.", consequence: "They're protected." },
        avoid: { text: "Make them feel ashamed.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will reject them.", consequence: "{childName} becomes isolated." }
      }
    },
    9: {
      title: "New Medications or Treatments: Trying to Help",
      topic: "Hopeful intervention",
      scene: "{childName} is 9. Parent tries new treatments.",
      choices: {
        connect: { text: "Support hope for improvement.", consequence: "{childName} is hopeful." },
        teach: { text: "Discuss realistic expectations.", consequence: "They're grounded." },
        boundary: { text: "Improvement is possible.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them treatment will fail.", consequence: "{childName} internalizes despair." },
        harm: { text: "Tell them parent is getting worse.", consequence: "{childName} internalizes fear." }
      }
    },
    10: {
      title: "Coping Strategies: Learning to Manage Stress",
      topic: "Emotional resilience",
      scene: "{childName} is 10. Developing coping skills.",
      choices: {
        connect: { text: "Help them develop healthy coping.", consequence: "{childName} is resilient." },
        teach: { text: "Support their emotional processing.", consequence: "They're grounded." },
        boundary: { text: "Their feelings matter.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them to suppress feelings.", consequence: "{childName} internalizes emotional suppression." },
        harm: { text: "Tell them to be strong for parent.", consequence: "{childName} internalizes that feelings are burden." }
      }
    },
    11: {
      title: "Adolescence: Understanding Parent's Mortality",
      topic: "Death awareness",
      scene: "{childName} is 11. Thinking about parent's future.",
      choices: {
        connect: { text: "Support their awareness.", consequence: "{childName} is grounded." },
        teach: { text: "Help them process realistic outcomes.", consequence: "They're informed." },
        boundary: { text: "Death is part of life.", consequence: "{childName} is secure." },
        avoid: { text: "Deny parent's mortality.", consequence: "{childName} becomes unprepared." },
        harm: { text: "Tell them parent will soon die.", consequence: "{childName} internalizes despair." }
      }
    },
    12: {
      title: "Dating & Relationships: Explaining Parent's Situation",
      topic: "Romantic shame",
      scene: "{childName} is 12 and interested in dating.",
      choices: {
        connect: { text: "Support age-appropriate relationships.", consequence: "{childName} develops." },
        teach: { text: "Help them decide about disclosure.", consequence: "They navigate." },
        boundary: { text: "Their relationships are valid.", consequence: "{childName} is worthy." },
        avoid: { text: "Tell them no one will date them.", consequence: "{childName} internalizes shame." },
        harm: { text: "Tell them peers will judge them.", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "School Pressure: Grades Suffering From Stress",
      topic: "Academic impact",
      scene: "{childName} is 13. School performance affected by stress.",
      choices: {
        connect: { text: "Advocate for them at school.", consequence: "{childName} is supported." },
        teach: { text: "Help them manage school stress.", consequence: "They're strategic." },
        boundary: { text: "Stress is real and manageable.", consequence: "{childName} is protected." },
        avoid: { text: "Add academic pressure.", consequence: "{childName} internalizes crushing burden." },
        harm: { text: "Tell them parent doesn't matter.", consequence: "{childName} internalizes that care is shameful." }
      }
    },
    14: {
      title: "Accepting Parent's Limitations: New Normal",
      topic: "Adaptation",
      scene: "{childName} is 14. Learning parent's condition is permanent.",
      choices: {
        connect: { text: "Support acceptance.", consequence: "{childName} adapts." },
        teach: { text: "Help them understand adjustment.", consequence: "They're grounded." },
        boundary: { text: "Adaptation is healthy.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them to deny reality.", consequence: "{childName} internalizes denial." },
        harm: { text: "Tell them to give up on parent.", consequence: "{childName} internalizes abandonment." }
      }
    },
    15: {
      title: "College Planning: Balancing Future With Caregiving",
      topic: "Independence vs. duty",
      scene: "{childName} is 15. Planning education and independence.",
      choices: {
        connect: { text: "Support their independence.", consequence: "{childName} is empowered." },
        teach: { text: "Help them find balance.", consequence: "They're strategic." },
        boundary: { text: "They deserve their own future.", consequence: "{childName} is secure." },
        avoid: { text: "Tell them they must stay home.", consequence: "{childName} feels trapped." },
        harm: { text: "Tell them leaving is betrayal.", consequence: "{childName} internalizes guilt." }
      }
    },
    16: {
      title: "Dating: Serious Relationship & Parent Reality",
      topic: "Love amid caregiving",
      scene: "{childName} is 16 and serious with someone.",
      choices: {
        connect: { text: "Support their relationship.", consequence: "{childName} loves freely." },
        teach: { text: "Help them navigate both.", consequence: "They communicate." },
        boundary: { text: "Their relationship is valid.", consequence: "{childName} is free." },
        avoid: { text: "Make parent jealous of partner.", consequence: "{childName} loses love." },
        harm: { text: "Tell them partner will leave.", consequence: "{childName} internalizes abandonment fear." }
      }
    },
    17: {
      title: "Understanding Parent: Their Strength and Struggle",
      topic: "Parental perspective",
      scene: "{childName} is 17. Ready to understand.",
      choices: {
        connect: { text: "Share parent's journey honestly.", consequence: "{childName} understands." },
        teach: { text: "Discuss parent's resilience.", consequence: "They're inspired." },
        boundary: { text: "Understanding brings connection.", consequence: "{childName} is secure." },
        avoid: { text: "Refuse to discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Tell them parent is burden.", consequence: "{childName} internalizes resentment." }
      }
    },
    18: {
      title: "Adult Choice: Own Future vs. Caregiving Duty",
      topic: "Self-determination",
      scene: "{childName} is 18. Choosing their path.",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} feels truly free." },
        teach: { text: "Share wisdom about balance.", consequence: "They build wisely." },
        boundary: { text: "Their life is theirs to design.", consequence: "Autonomy is absolute." },
        avoid: { text: "Tell them they owe parent.", consequence: "{childName} might resent." },
        harm: { text: "Tell them parent is burden they must carry.", consequence: "{childName} internalizes lifelong guilt." }
      }
    }
  }
};
