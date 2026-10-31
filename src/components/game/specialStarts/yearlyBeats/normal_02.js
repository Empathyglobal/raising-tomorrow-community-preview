
export const SPECIAL_START_YEARLY_BEATS__NORMAL_02 = {
  child_adhd: {
    1: {
      title: "Noticing Differences Early",
      topic: "Early signs",
      scene: "{childName} is high-energy, impulsive, and intense from infancy. Parenting feels overwhelming.",
      choices: {
        connect: { text: "Validate that their energy is real.", consequence: "{childName} feels accepted." },
        teach: { text: "Learn about ADHD without diagnosing yet.", consequence: "You gain understanding." },
        boundary: { text: "Establish routines that work for them.", consequence: "Structure helps." },
        avoid: { text: "Ignore the struggles.", consequence: "{childName} is unsupported." },
        harm: { text: "Shame them for being 'difficult.'", consequence: "{childName} internalizes shame." }
      }
    },
    2: {
      title: "Constant Supervision Needed",
      topic: "Safety and attention",
      scene: "{childName} needs constant watch. They dash away. They touch everything. Danger is real.",
      choices: {
        connect: { text: "Stay alert without burning out.", consequence: "{childName} is safe." },
        teach: { text: "Child-proof thoroughly.", consequence: "Danger is minimized." },
        boundary: { text: "Your needs matter too; get help.", consequence: "You don't burn out." },
        avoid: { text: "Leave them unsupervised.", consequence: "{childName} is at risk." },
        harm: { text: "Shame them for being impulsive.", consequence: "{childName} internalizes danger." }
      }
    },
    3: {
      title: "Sleep Issues: Hyperactivity at Bedtime",
      topic: "Rest & regulation",
      scene: "{childName} won't sleep. Bedtime is a battle. Their brain won't turn off.",
      choices: {
        connect: { text: "Create calming bedtime routines.", consequence: "{childName} sleeps better." },
        teach: { text: "Understand ADHD and sleep connection.", consequence: "You learn the why." },
        boundary: { text: "Sleep is non-negotiable for everyone.", consequence: "Health is protected." },
        avoid: { text: "Ignore sleep issues.", consequence: "{childName} is exhausted and dysregulated." },
        harm: { text: "Punish them for not sleeping.", consequence: "{childName} fears bedtime." }
      }
    },
    4: {
      title: "Preschool: Behavior Reports Begin",
      topic: "School feedback",
      scene: "Teachers report {childName} won't sit still, interrupts, struggles with rules.",
      choices: {
        connect: { text: "Listen without defensiveness.", consequence: "You understand the full picture." },
        teach: { text: "Work with school to support {childName}.", consequence: "Partnership forms." },
        boundary: { text: "ADHD traits are real; support is needed.", consequence: "They're not 'bad.'" },
        avoid: { text: "Blame the school.", consequence: "Partnership breaks." },
        harm: { text: "Shame {childName} for behavior reports.", consequence: "{childName} feels broken." }
      }
    },
    5: {
      title: "Medication Consideration or Rejection",
      topic: "Treatment options",
      scene: "Doctor suggests ADHD evaluation or medication. Decision time.",
      choices: {
        connect: { text: "Research thoroughly; decide together.", consequence: "{childName} feels part of solution." },
        teach: { text: "Understand medication pros/cons.", consequence: "Decision is informed." },
        boundary: { text: "Whatever path, it's about their wellbeing.", consequence: "They're not labeled." },
        avoid: { text: "Dismiss medication without exploring.", consequence: "You miss support option." },
        harm: { text: "Medicate without consent/explanation.", consequence: "{childName} trusts you less." }
      }
    },
    6: {
      title: "Formal ADHD Diagnosis",
      topic: "Label and clarity",
      scene: "{childName} receives ADHD diagnosis. Relief and grief mix.",
      choices: {
        connect: { text: "Frame diagnosis as understanding, not label.", consequence: "{childName} feels relief." },
        teach: { text: "Explain what ADHD means for them.", consequence: "They understand themselves." },
        boundary: { text: "Diagnosis explains behavior, doesn't excuse harm.", consequence: "Accountability remains." },
        avoid: { text: "Use diagnosis to lower expectations.", consequence: "{childName} doesn't grow." },
        harm: { text: "Act like diagnosis is tragedy.", consequence: "{childName} internalizes shame." }
      }
    },
    7: {
      title: "Impulse Control Still Developing",
      topic: "Behavioral challenges",
      scene: "{childName} acts before thinking. Outbursts, regret, shame cycle repeats.",
      choices: {
        connect: { text: "Help them process without judgment.", consequence: "{childName} feels understood." },
        teach: { text: "Teach strategies to pause and think.", consequence: "Skills develop." },
        boundary: { text: "Consequences exist, but paired with support.", consequence: "Learning happens." },
        avoid: { text: "Ignore impulse control challenges.", consequence: "{childName} never develops skills." },
        harm: { text: "Punish harshly for impulses.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Academic Struggles Begin",
      topic: "Attention in learning",
      scene: "{childName} can't focus in class. Despite being smart, grades suffer.",
      choices: {
        connect: { text: "Get academic support immediately.", consequence: "{childName} can learn." },
        teach: { text: "Help them understand ADHD-learning connection.", consequence: "They see the why." },
        boundary: { text: "Support strategies are put in place.", consequence: "Education is protected." },
        avoid: { text: "Blame them for grades.", consequence: "{childName} feels stupid." },
        harm: { text: "Say 'you're lazy or dumb.'", consequence: "{childName} internalizes shame." }
      }
    },
    9: {
      title: "Social Struggles: Impulsivity Hurts Friendships",
      topic: "Relationship impact",
      scene: "{childName} interrupts, dominates, or says things that hurt peers. Friendships struggle.",
      choices: {
        connect: { text: "Help them understand social impact.", consequence: "{childName} learns." },
        teach: { text: "Teach social skills explicitly.", consequence: "Skills develop." },
        boundary: { text: "Support healthy friendships.", consequence: "They have connection." },
        avoid: { text: "Ignore social struggles.", consequence: "{childName} becomes isolated." },
        harm: { text: "Shame them for being 'annoying.'", consequence: "{childName} withdraws." }
      }
    },
    10: {
      title: "Peer Bullying: Seen as Annoying or Weird",
      topic: "Social pain",
      scene: "Peers mock {childName}'s hyperactivity, interruptions, or 'weirdness.'",
      choices: {
        connect: { text: "Validate their experience.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss ADHD as difference, not flaw.", consequence: "Pride develops." },
        boundary: { text: "No tolerance for bullying.", consequence: "They're protected." },
        avoid: { text: "Ignore peer struggles.", consequence: "{childName} internalizes rejection." },
        harm: { text: "Say 'if you were normal, they'd like you.'", consequence: "{childName} hates themselves." }
      }
    },
    11: {
      title: "Discovering ADHD Strengths: Hyperfocus",
      topic: "Positive reframe",
      scene: "{childName} discovers hyperfocus. They can spend hours on interests. Strength emerges.",
      choices: {
        connect: { text: "Celebrate hyperfocus as gift.", consequence: "{childName} sees strengths." },
        teach: { text: "Help them channel hyperfocus productively.", consequence: "Skills develop." },
        boundary: { text: "Balance hyperfocus with responsibilities.", consequence: "Health is maintained." },
        avoid: { text: "Ignore their strengths.", consequence: "{childName} only sees deficits." },
        harm: { text: "Push hyperfocus too hard.", consequence: "{childName} burns out." }
      }
    },
    12: {
      title: "Medication Adjustment or Change",
      topic: "Ongoing treatment",
      scene: "Current medication isn't working. Adjustment or change needed.",
      choices: {
        connect: { text: "Support the process together.", consequence: "{childName} feels secure." },
        teach: { text: "Explain medication changes.", consequence: "They understand the process." },
        boundary: { text: "Their input matters in decisions.", consequence: "Autonomy is respected." },
        avoid: { text: "Change medication without explaining.", consequence: "{childName} is confused." },
        harm: { text: "Use medication as threat or punishment.", consequence: "{childName} resists treatment." }
      }
    },
    13: {
      title: "Time Management Struggles Worsen",
      topic: "Executive function",
      scene: "{childName} loses track of time, forgets assignments, can't organize.",
      choices: {
        connect: { text: "Help create systems together.", consequence: "{childName} learns tools." },
        teach: { text: "Teach executive function strategies.", consequence: "Skills develop." },
        boundary: { text: "Support doesn't mean you do it for them.", consequence: "They build independence." },
        avoid: { text: "Leave them to struggle.", consequence: "{childName} falls behind." },
        harm: { text: "Shame them for disorganization.", consequence: "{childName} gives up." }
      }
    },
    14: {
      title: "Emotional Dysregulation Appears",
      topic: "Emotional intensity",
      scene: "{childName} has big emotional reactions. Small things feel huge. Overwhelm is frequent.",
      choices: {
        connect: { text: "Validate their emotional experience.", consequence: "{childName} feels understood." },
        teach: { text: "Teach emotional regulation skills.", consequence: "They learn to manage." },
        boundary: { text: "Big feelings don't excuse harm.", consequence: "Accountability remains." },
        avoid: { text: "Dismiss their emotions.", consequence: "{childName} hides feelings." },
        harm: { text: "Shame them for emotional reactions.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "Relationship Question: What's ADHD vs. What's Them?",
      topic: "Identity integration",
      scene: "{childName} wonders: Is this me or my ADHD? Who am I without it?",
      choices: {
        connect: { text: "Discuss ADHD as part of them, not all of them.", consequence: "{childName} integrates identity." },
        teach: { text: "Help them own their ADHD positively.", consequence: "Pride develops." },
        boundary: { text: "ADHD explains, doesn't excuse everything.", consequence: "Accountability is balanced." },
        avoid: { text: "Act like ADHD is all they are.", consequence: "{childName} has no other identity." },
        harm: { text: "Treat ADHD as tragedy.", consequence: "{childName} hates themselves." }
      }
    },
    16: {
      title: "College & Career: ADHD in Adult World",
      topic: "Future planning",
      scene: "{childName} is 16. College requires executive function. Career needs focus.",
      choices: {
        connect: { text: "Explore college options that support ADHD.", consequence: "{childName} feels enabled." },
        teach: { text: "Discuss careers that work with ADHD.", consequence: "Opportunities feel real." },
        boundary: { text: "Their future exists with or without traditional path.", consequence: "Options feel open." },
        avoid: { text: "Say 'you can't go to college.'", consequence: "{childName} gives up." },
        harm: { text: "Push traditional path without support.", consequence: "{childName} burns out." }
      }
    },
    17: {
      title: "Autonomy & Self-Advocacy Emerging",
      topic: "Taking ownership",
      scene: "{childName} is 17. They're learning to advocate for themselves and manage their own needs.",
      choices: {
        connect: { text: "Support their self-advocacy.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them explain ADHD to others.", consequence: "They communicate clearly." },
        boundary: { text: "They take increasing responsibility.", consequence: "Independence develops." },
        avoid: { text: "Control their management.", consequence: "{childName} doesn't learn autonomy." },
        harm: { text: "Abandon support without preparation.", consequence: "{childName} struggles." }
      }
    },
    18: {
      title: "Adult ADHD: Their Path Forward",
      topic: "Adult identity",
      scene: "{childName} is 18. ADHD is lifelong. How do they build their adult life with it?",
      choices: {
        connect: { text: "Support their authentic path.", consequence: "{childName} feels truly backed." },
        teach: { text: "Share hard-won wisdom about ADHD.", consequence: "They learn from you." },
        boundary: { text: "Their future is not defined by ADHD.", consequence: "They see possibilities." },
        avoid: { text: "Act like their future is limited.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Say 'you'll never be normal.'", consequence: "{childName} internalizes shame." }
      }
    }
  },

  sugar_baby: {
    1: {
      title: "Born Into a Complex Arrangement",
      topic: "Unconventional family",
      scene: "{childName} is born to a parent in a 'sugar' relationship: financial support for companionship.",
      choices: {
        connect: { text: "Create love and safety regardless of arrangement.", consequence: "{childName} feels secure." },
        teach: { text: "Age-appropriately explain family structure.", consequence: "They understand." },
        boundary: { text: "Their needs are met consistently.", consequence: "Stability is provided." },
        avoid: { text: "Neglect them due to arrangement.", consequence: "{childName} feels unwanted." },
        harm: { text: "Expose them to the arrangement inappropriately.", consequence: "{childName} is confused." }
      }
    },
    2: {
      title: "Financial Inconsistency or Changes",
      topic: "Instability",
      scene: "The sugar arrangement is unstable. Money flows and dries up unpredictably.",
      choices: {
        connect: { text: "Reassure them about basic needs.", consequence: "{childName} feels secure." },
        teach: { text: "Help them understand finances age-appropriately.", consequence: "They understand reality." },
        boundary: { text: "Their basic needs are always met.", consequence: "Health is protected." },
        avoid: { text: "Leave them uncertain about basics.", consequence: "{childName} develops anxiety." },
        harm: { text: "Burden them with financial worry.", consequence: "{childName} becomes anxious." }
      }
    },
    3: {
      title: "Different Living Situations",
      topic: "Instability and transitions",
      scene: "{childName} moves between parent's place, sugar partner's place, or another caregiver.",
      choices: {
        connect: { text: "Create stability and love in all settings.", consequence: "{childName} feels secure." },
        teach: { text: "Help them transition between places.", consequence: "Coping skills develop." },
        boundary: { text: "Each place is safe and consistent.", consequence: "They feel grounded." },
        avoid: { text: "Ignore transition difficulties.", consequence: "{childName} feels unmoored." },
        harm: { text: "Use moves as punishment.", consequence: "{childName} is traumatized." }
      }
    },
    4: {
      title: "Peers Don't Understand Family Structure",
      topic: "Social difference",
      scene: "{childName} has difficulty explaining their family. Peers are confused or judgmental.",
      choices: {
        connect: { text: "Validate that their family is real and valid.", consequence: "{childName} feels proud." },
        teach: { text: "Help them decide what/how to share.", consequence: "They set boundaries." },
        boundary: { text: "Their family structure isn't shameful.", consequence: "Pride is maintained." },
        avoid: { text: "Ignore their social struggle.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'our family is embarrassing.'", consequence: "{childName} hides their truth." }
      }
    },
    5: {
      title: "Material Abundance & Instability Mix",
      topic: "Confusing mix",
      scene: "{childName} has nice things sometimes (gifts, expensive trips) but basic needs feel uncertain.",
      choices: {
        connect: { text: "Help them understand different love languages.", consequence: "{childName} feels loved." },
        teach: { text: "Discuss that love isn't bought.", consequence: "They value connection." },
        boundary: { text: "Basic needs are consistent; treats are bonus.", consequence: "Values are clear." },
        avoid: { text: "Use gifts to substitute for presence.", consequence: "{childName} equates love with things." },
        harm: { text: "Withdraw gifts as punishment.", consequence: "{childName} connects gifts with shame." }
      }
    },
    6: {
      title: "Sugar Partner Involvement: Safe or Unsafe?",
      topic: "Safety boundaries",
      scene: "{childName} is around the sugar partner. Is this person safe? Do they have authority?",
      choices: {
        connect: { text: "Protect {childName} from any boundary violations.", consequence: "{childName} is safe." },
        teach: { text: "Teach appropriate vs. inappropriate adult behavior.", consequence: "They know boundaries." },
        boundary: { text: "You maintain authority and protection.", consequence: "They're protected." },
        avoid: { text: "Leave them alone with unsafe partner.", consequence: "{childName} is at risk." },
        harm: { text: "Expose them to inappropriate behavior.", consequence: "{childName} is traumatized." }
      }
    },
    7: {
      title: "Relationship Conflict or Breakup",
      topic: "Instability peaks",
      scene: "The sugar arrangement ends. Stability changes. Loss is real.",
      choices: {
        connect: { text: "Grieve the loss together.", consequence: "{childName} processes with you." },
        teach: { text: "Help them understand relationships change.", consequence: "They understand impermanence." },
        boundary: { text: "Their security is maintained through change.", consequence: "They feel safe." },
        avoid: { text: "Ignore their grief.", consequence: "{childName} internalizes loss." },
        harm: { text: "Use the breakup to blame {childName}.", consequence: "{childName} feels guilty." }
      }
    },
    8: {
      title: "New Arrangement or New Partner",
      topic: "Adaptation",
      scene: "{childName} adjusts to a new sugar arrangement (or new partner).",
      choices: {
        connect: { text: "Help them transition with care.", consequence: "{childName} adapts well." },
        teach: { text: "Discuss what's consistent about family.", consequence: "They understand core remains." },
        boundary: { text: "Their relationship with you is stable.", consequence: "That's the constant." },
        avoid: { text: "Leave them to adjust alone.", consequence: "{childName} feels unmoored." },
        harm: { text: "Act like they should accept anything.", consequence: "{childName} has no boundaries." }
      }
    },
    9: {
      title: "School: Hiding or Revealing Family Situation",
      topic: "Privacy and shame",
      scene: "{childName} must decide: tell school about living situation or hide it?",
      choices: {
        connect: { text: "Support whatever choice they make.", consequence: "{childName} feels safe." },
        teach: { text: "Discuss privacy and self-protection.", consequence: "They set boundaries." },
        boundary: { text: "School has what they need to help.", consequence: "Support is available." },
        avoid: { text: "Force them to hide or reveal.", consequence: "{childName} feels unsupported." },
        harm: { text: "Shame them for the situation.", consequence: "{childName} internalizes shame." }
      }
    },
    10: {
      title: "Comparing Self to 'Normal' Families",
      topic: "Grief and isolation",
      scene: "{childName} sees traditional families and feels their difference acutely.",
      choices: {
        connect: { text: "Validate their feelings without shame.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss that all families are complex.", consequence: "Perspective develops." },
        boundary: { text: "Their family is valid even if different.", consequence: "Pride is maintained." },
        avoid: { text: "Ignore their grief.", consequence: "{childName} internalizes loss." },
        harm: { text: "Say 'we have nothing like normal families.'", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Starting to Understand the Arrangement",
      topic: "Growing awareness",
      scene: "{childName} begins to understand what 'sugar relationship' actually means.",
      choices: {
        connect: { text: "Answer questions honestly but age-appropriately.", consequence: "{childName} understands." },
        teach: { text: "Discuss that adults make complex choices.", consequence: "They understand nuance." },
        boundary: { text: "Judge them not; focus on their safety.", consequence: "They stay connected." },
        avoid: { text: "Deny or dodge their questions.", consequence: "{childName} is confused." },
        harm: { text: "Blame or shame yourself or the partner.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Judgment From Others (Teachers, Friends, Family)",
      topic: "External stigma",
      scene: "Others judge their family structure. Teachers, relatives, or friends say things.",
      choices: {
        connect: { text: "Protect them from judgment.", consequence: "{childName} feels defended." },
        teach: { text: "Discuss that others' judgment isn't their burden.", consequence: "They build resilience." },
        boundary: { text: "They don't internalize others' shame.", consequence: "Pride is protected." },
        avoid: { text: "Ignore the judgment impact.", consequence: "{childName} internalizes it." },
        harm: { text: "Agree with the judgment.", consequence: "{childName} hates their family." }
      }
    },
    13: {
      title: "Exploring Their Own Identity & Values",
      topic: "Growing independence",
      scene: "{childName} questions: What do I value? What kind of relationships do I want?",
      choices: {
        connect: { text: "Support their value exploration.", consequence: "{childName} develops values." },
        teach: { text: "Discuss different relationship models.", consequence: "They see options." },
        boundary: { text: "Their choices are theirs to make.", consequence: "Autonomy is respected." },
        avoid: { text: "Pressure them toward your path.", consequence: "{childName} rebels." },
        harm: { text: "Say 'you'll end up like me.'", consequence: "{childName} internalizes fear." }
      }
    },
    14: {
      title: "Romantic Relationships: What They Seek",
      topic: "Love and security",
      scene: "{childName} falls for someone. What kind of relationship do they want?",
      choices: {
        connect: { text: "Support their relationship regardless of type.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss healthy vs. unhealthy patterns.", consequence: "They make conscious choices." },
        boundary: { text: "They're not defined by their parent's choices.", consequence: "Autonomy is real." },
        avoid: { text: "Ignore their romantic life.", consequence: "{childName} feels unsupported." },
        harm: { text: "Say 'you'll make the same mistakes I did.'", consequence: "{childName} internalizes fear." }
      }
    },
    15: {
      title: "Financial Independence: Building Their Own Stability",
      topic: "Self-reliance",
      scene: "{childName} is 15. Can they build financial stability independent of arrangements?",
      choices: {
        connect: { text: "Support their independence goals.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them build financial literacy.", consequence: "Skills develop." },
        boundary: { text: "Their path is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward sugar relationships.", consequence: "{childName} resents you." },
        harm: { text: "Say 'you need to find a sugar partner.'", consequence: "{childName} feels used." }
      }
    },
    16: {
      title: "College & Independence Options",
      topic: "Real choices",
      scene: "{childName} is 16. College? Career? Relationship choices? Future is becoming real.",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss all options without judgment.", consequence: "They choose wisely." },
        boundary: { text: "Their future is theirs to build.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward your path.", consequence: "{childName} might resent it." },
        harm: { text: "Disown them for their choice.", consequence: "{childName} is devastated." }
      }
    },
    17: {
      title: "Understanding Their Parent's Choices",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand why their parent made these choices?",
      choices: {
        connect: { text: "Share your journey authentically.", consequence: "{childName} understands you." },
        teach: { text: "Discuss how circumstances shape choices.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to explain or discuss.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame {childName} for your choices.", consequence: "{childName} feels guilty." }
      }
    },
    18: {
      title: "Adult Relationship: Rebuilding From Truth",
      topic: "New foundation",
      scene: "{childName} is 18. Can you relate as adults? Build understanding?",
      choices: {
        connect: { text: "Meet them as an adult, with honesty.", consequence: "Real relationship forms." },
        teach: { text: "Share wisdom without expectations.", consequence: "Connection deepens." },
        boundary: { text: "Respect their autonomy fully.", consequence: "Relationship is peer-level." },
        avoid: { text: "Keep them dependent on arrangements.", consequence: "Relationship stays unhealthy." },
        harm: { text: "Expect them to validate your choices.", consequence: "Relationship breaks." }
      }
    }
  },

  child_autism: {
    1: {
      title: "Different Sensory Experience From Birth",
      topic: "Neurodivergent wiring",
      scene: "{childName} responds differently to sensory input: textures, sounds, lights are overwhelming.",
      choices: {
        connect: { text: "Learn what sensory input they enjoy/hate.", consequence: "{childName} feels understood." },
        teach: { text: "Modify environment to meet their sensory needs.", consequence: "They're more comfortable." },
        boundary: { text: "Sensory needs are real and valid.", consequence: "You respect them." },
        avoid: { text: "Ignore their sensory distress.", consequence: "{childName} is constantly overwhelmed." },
        harm: { text: "Force sensory experiences that hurt.", consequence: "{childName} is traumatized." }
      }
    },
    2: {
      title: "Repetitive Movements or Behaviors (Stimming)",
      topic: "Self-soothing",
      scene: "{childName} has repetitive movements: lining up toys, spinning, hand flapping.",
      choices: {
        connect: { text: "Accept stimming as self-regulation.", consequence: "{childName} feels accepted." },
        teach: { text: "Understand stimming as self-soothing.", consequence: "You see the function." },
        boundary: { text: "Stimming is allowed and safe.", consequence: "They feel secure." },
        avoid: { text: "Suppress or punish stimming.", consequence: "{childName} loses coping mechanism." },
        harm: { text: "Mock them for stimming.", consequence: "{childName} hides their need." }
      }
    },
    3: {
      title: "Communication Differences Emerge",
      topic: "Language and connection",
      scene: "{childName} has communication differences: delayed speech, echolalia, literal interpretation.",
      choices: {
        connect: { text: "Communicate in ways they understand.", consequence: "{childName} feels heard." },
        teach: { text: "Work with speech therapist if needed.", consequence: "Communication improves." },
        boundary: { text: "Their communication style is valid.", consequence: "They don't feel broken." },
        avoid: { text: "Ignore communication differences.", consequence: "{childName} feels unheard." },
        harm: { text: "Shame them for speech differences.", consequence: "{childName} stops trying." }
      }
    },
    4: {
      title: "Special Interests Intensify",
      topic: "Deep focus and passion",
      scene: "{childName} has intense, consuming interest: dinosaurs, trains, numbers, patterns.",
      choices: {
        connect: { text: "Share their passion.", consequence: "{childName} feels connected to you." },
        teach: { text: "Help them learn deeply about interest.", consequence: "They develop expertise." },
        boundary: { text: "Balance special interest with other activities.", consequence: "They're well-rounded." },
        avoid: { text: "Dismiss their interest.", consequence: "{childName} feels unseen." },
        harm: { text: "Forbid their special interest.", consequence: "{childName} loses coping mechanism." }
      }
    },
    5: {
      title: "Social Difficulties: Peers Don't Understand",
      topic: "Social isolation",
      scene: "{childName} struggles with social interaction. They're interested in peers but confused by social rules.",
      choices: {
        connect: { text: "Validate their social struggles.", consequence: "{childName} feels understood." },
        teach: { text: "Teach social skills explicitly.", consequence: "They learn what's unspoken." },
        boundary: { text: "Social differences are real, not failures.", consequence: "They see themselves positively." },
        avoid: { text: "Ignore social difficulties.", consequence: "{childName} is very lonely." },
        harm: { text: "Shame them for social awkwardness.", consequence: "{childName} withdraws." }
      }
    },
    6: {
      title: "Formal Autism Diagnosis",
      topic: "Label and identity",
      scene: "{childName} receives autism diagnosis. Relief and questions mix.",
      choices: {
        connect: { text: "Frame diagnosis as understanding, not limitation.", consequence: "{childName} feels relief." },
        teach: { text: "Explain what autism means for them.", consequence: "They understand themselves." },
        boundary: { text: "Autism is part of their identity, not all of it.", consequence: "They integrate it." },
        avoid: { text: "Treat diagnosis as tragedy.", consequence: "{childName} internalizes shame." },
        harm: { text: "Use diagnosis to lower expectations.", consequence: "{childName} doesn't grow." }
      }
    },
    7: {
      title: "Masking: Hiding Autism to Fit In",
      topic: "Social exhaustion",
      scene: "{childName} learns to 'mask' at school or in social situations. Exhaustion is real.",
      choices: {
        connect: { text: "Create safe spaces where they don't mask.", consequence: "{childName} has refuge." },
        teach: { text: "Discuss costs of masking.", consequence: "They understand the tradeoff." },
        boundary: { text: "Unmasking at home is safe.", consequence: "They can be themselves." },
        avoid: { text: "Expect masking all the time.", consequence: "{childName} burns out." },
        harm: { text: "Punish them for unmasking at home.", consequence: "{childName} can't be themselves." }
      }
    },
    8: {
      title: "Peer Bullying: 'Weird' or 'Different'",
      topic: "Social pain",
      scene: "Peers mock {childName} for differences in behavior, interests, or communication.",
      choices: {
        connect: { text: "Validate their experience.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss that different isn't wrong.", consequence: "They see their value." },
        boundary: { text: "Zero tolerance for bullying.", consequence: "They're protected." },
        avoid: { text: "Ignore peer bullying.", consequence: "{childName} internalizes pain." },
        harm: { text: "Say 'if you acted normal, they'd like you.'", consequence: "{childName} hates themselves." }
      }
    },
    9: {
      title: "School: Support Services & IEP",
      topic: "Educational accommodations",
      scene: "{childName} needs school accommodations. IEP or 504 plan created.",
      choices: {
        connect: { text: "Advocate fiercely for their needs.", consequence: "{childName} gets support." },
        teach: { text: "Help them understand accommodations help them learn.", consequence: "They accept support." },
        boundary: { text: "Accommodations don't lower standards.", consequence: "They still grow." },
        avoid: { text: "Leave them without support.", consequence: "{childName} falls behind." },
        harm: { text: "Feel shame about accommodations.", consequence: "{childName} feels broken." }
      }
    },
    10: {
      title: "Executive Function Challenges",
      topic: "Organization and planning",
      scene: "{childName} struggles with organization, time management, planning.",
      choices: {
        connect: { text: "Create systems that work for them.", consequence: "{childName} can manage." },
        teach: { text: "Teach executive function strategies.", consequence: "Skills develop." },
        boundary: { text: "Support develops independence gradually.", consequence: "They build skills." },
        avoid: { text: "Leave them to struggle.", consequence: "{childName} falls behind." },
        harm: { text: "Shame them for disorganization.", consequence: "{childName} gives up." }
      }
    },
    11: {
      title: "Meltdowns: Overwhelm and Recovery",
      topic: "Emotional regulation",
      scene: "{childName} has meltdowns when overwhelmed. Recovery is slow. Understanding is needed.",
      choices: {
        connect: { text: "Create safe space during and after meltdowns.", consequence: "{childName} recovers safely." },
        teach: { text: "Help them identify meltdown triggers.", consequence: "They can prevent some." },
        boundary: { text: "Meltdowns aren't defiance or manipulation.", consequence: "You respond with compassion." },
        avoid: { text: "Ignore meltdowns or expect them to stop immediately.", consequence: "{childName} struggles." },
        harm: { text: "Punish them for meltdowns.", consequence: "{childName} internalizes shame." }
      }
    },
    12: {
      title: "Sensory Processing Therapy or Support",
      topic: "Managing sensory load",
      scene: "{childName} gets occupational therapy or sensory strategies to manage overwhelming input.",
      choices: {
        connect: { text: "Support the therapy process together.", consequence: "{childName} feels backed." },
        teach: { text: "Help them practice strategies at home.", consequence: "Skills generalize." },
        boundary: { text: "Therapy helps them; you're not their therapist.", consequence: "Relationship stays healthy." },
        avoid: { text: "Neglect sensory needs.", consequence: "{childName} is constantly overwhelmed." },
        harm: { text: "Force exposure as 'toughening up.'", consequence: "{childName} is traumatized." }
      }
    },
    13: {
      title: "Discovering Autism Strengths",
      topic: "Positive reframe",
      scene: "{childName} discovers abilities: detailed focus, pattern recognition, honesty, loyalty.",
      choices: {
        connect: { text: "Celebrate their strengths.", consequence: "{childName} sees value in themselves." },
        teach: { text: "Help them channel strengths productively.", consequence: "Skills develop." },
        boundary: { text: "Strengths don't erase challenges.", consequence: "Realistic view forms." },
        avoid: { text: "Ignore their strengths.", consequence: "{childName} only sees deficits." },
        harm: { text: "Push strengths without supporting challenges.", consequence: "{childName} struggles." }
      }
    },
    14: {
      title: "Identity Question: Autistic Pride Emerging",
      topic: "Self-acceptance",
      scene: "{childName} begins to explore autism positively. Autistic pride and community connection.",
      choices: {
        connect: { text: "Support their positive identity.", consequence: "{childName} feels proud." },
        teach: { text: "Connect them with autistic community.", consequence: "They're not alone." },
        boundary: { text: "Autism is difference, not deficit (usually).", consequence: "Pride is maintained." },
        avoid: { text: "Treat autism as tragedy.", consequence: "{childName} internalizes shame." },
        harm: { text: "Say 'you should want to be normal.'", consequence: "{childName} hates themselves." }
      }
    },
    15: {
      title: "Romantic Interests & Relationships",
      topic: "Love and connection",
      scene: "{childName} is 15 and interested in romance. Relationship navigation is complex.",
      choices: {
        connect: { text: "Support their romantic interests.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss relationships and consent.", consequence: "They understand healthy dynamics." },
        boundary: { text: "Their autonomy in relationships is real.", consequence: "They make choices." },
        avoid: { text: "Ignore their romantic interests.", consequence: "{childName} feels unsupported." },
        harm: { text: "Say 'no one will want to date you.'", consequence: "{childName} internalizes rejection." }
      }
    },
    16: {
      title: "College & Career: Supports and Strengths",
      topic: "Future planning",
      scene: "{childName} is 16. College or career paths exist with right supports.",
      choices: {
        connect: { text: "Help them find paths aligned with strengths.", consequence: "{childName} feels enabled." },
        teach: { text: "Discuss accommodations in college/work.", consequence: "They know what to expect." },
        boundary: { text: "Their future is open and possible.", consequence: "Hope is realistic." },
        avoid: { text: "Say 'you can't go to college.'", consequence: "{childName} gives up." },
        harm: { text: "Push neurotypical path without support.", consequence: "{childName} struggles." }
      }
    },
    17: {
      title: "Autonomy & Self-Advocacy",
      topic: "Taking ownership",
      scene: "{childName} is 17. They're learning to self-advocate and manage their own needs.",
      choices: {
        connect: { text: "Support their self-advocacy.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them explain autism to others.", consequence: "They communicate clearly." },
        boundary: { text: "They take increasing responsibility.", consequence: "Independence develops." },
        avoid: { text: "Control their self-advocacy.", consequence: "{childName} doesn't learn autonomy." },
        harm: { text: "Abandon support without preparation.", consequence: "{childName} struggles." }
      }
    },
    18: {
      title: "Adult Autistic Life: Their Path Forward",
      topic: "Adult identity",
      scene: "{childName} is 18. Autism is lifelong. How do they build their adult life?",
      choices: {
        connect: { text: "Support their authentic path.", consequence: "{childName} feels truly backed." },
        teach: { text: "Share wisdom about navigating autism.", consequence: "They learn from you." },
        boundary: { text: "Their future is not limited by autism.", consequence: "They see possibilities." },
        avoid: { text: "Act like their future is limited.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Say 'you'll never be independent.'", consequence: "{childName} internalizes shame." }
      }
    }
  },

  child_down_syndrome: {
    1: {
      title: "Born With Down Syndrome: Early Acceptance",
      topic: "Identity from birth",
      scene: "{childName} is born with Down syndrome. Love and extra support are immediate.",
      choices: {
        connect: { text: "Celebrate {childName} fully despite extra needs.", consequence: "{childName} feels loved." },
        teach: { text: "Learn about Down syndrome support early.", consequence: "You get ahead of needs." },
        boundary: { text: "They're a full child with full potential.", consequence: "Expectations are real." },
        avoid: { text: "Treat them with pity.", consequence: "{childName} internalizes pity." },
        harm: { text: "Grieve their diagnosis instead of celebrating.", consequence: "{childName} feels unwanted." }
      }
    },
    2: {
      title: "Medical Needs & Monitoring",
      topic: "Health care",
      scene: "{childName} needs extra medical monitoring and early intervention services.",
      choices: {
        connect: { text: "Manage health with love and consistency.", consequence: "{childName} feels cared for." },
        teach: { text: "Understand their medical needs.", consequence: "You're informed." },
        boundary: { text: "Health care is routine, not tragic.", consequence: "Medical needs are normal." },
        avoid: { text: "Neglect medical needs.", consequence: "{childName} suffers." },
        harm: { text: "Use medical needs to limit them.", consequence: "{childName} doesn't develop." }
      }
    },
    3: {
      title: "Early Intervention: Speech, Physical, Occupational Therapy",
      topic: "Development support",
      scene: "{childName} participates in early intervention services. Development is supported.",
      choices: {
        connect: { text: "Be actively involved in therapy.", consequence: "{childName} learns with your support." },
        teach: { text: "Understand what each therapy builds.", consequence: "You see progress." },
        boundary: { text: "Therapy supports, doesn't define them.", consequence: "They're whole persons." },
        avoid: { text: "Ignore therapy recommendations.", consequence: "{childName} misses support." },
        harm: { text: "Make therapy feel like punishment.", consequence: "{childName} resists it." }
      }
    },
    4: {
      title: "Developmental Timeline Is Different",
      topic: "Different but valid path",
      scene: "{childName} develops on their own timeline. Milestones come slower.",
      choices: {
        connect: { text: "Celebrate milestones whenever they come.", consequence: "{childName} feels celebrated." },
        teach: { text: "Understand their developmental pace.", consequence: "Expectations are realistic." },
        boundary: { text: "Slower development isn't failure.", consequence: "Progress is honored." },
        avoid: { text: "Resent the different timeline.", consequence: "{childName} feels your frustration." },
        harm: { text: "Push them beyond their capacity.", consequence: "{childName} is stressed." }
      }
    },
    5: {
      title: "School Inclusion or Separate Education",
      topic: "Educational path",
      scene: "{childName} starts school. Decisions about inclusion, accommodations, or separate setting.",
      choices: {
        connect: { text: "Advocate for their best educational setting.", consequence: "{childName} learns well." },
        teach: { text: "Understand their learning style.", consequence: "Education is tailored." },
        boundary: { text: "Inclusion doesn't mean unsupported mainstreaming.", consequence: "Right supports are in place." },
        avoid: { text: "Accept inadequate services.", consequence: "{childName} falls behind." },
        harm: { text: "Isolate them from typical peers.", consequence: "{childName} is socially stunted." }
      }
    },
    6: {
      title: "Peer Reactions: Kindness, Curiosity, or Unkindness",
      topic: "Social integration",
      scene: "Peers have varied reactions to {childName}. Some kind, some curious, some unkind.",
      choices: {
        connect: { text: "Facilitate positive peer connections.", consequence: "{childName} has friends." },
        teach: { text: "Teach peers about Down syndrome.", consequence: "Understanding develops." },
        boundary: { text: "Protect {childName} from unkindness.", consequence: "They're safe." },
        avoid: { text: "Ignore peer rejection.", consequence: "{childName} is isolated." },
        harm: { text: "Make {childName} 'perform' for peers.", consequence: "{childName} feels used." }
      }
    },
    7: {
      title: "Self-Care Skills Developing",
      topic: "Independence building",
      scene: "{childName} learns self-care: toileting, grooming, eating with utensils.",
      choices: {
        connect: { text: "Celebrate skill development joyfully.", consequence: "{childName} is motivated." },
        teach: { text: "Practice skills with patience and encouragement.", consequence: "Skills develop." },
        boundary: { text: "They learn as much as possible.", consequence: "Independence grows." },
        avoid: { text: "Do everything for them.", consequence: "{childName} doesn't develop skills." },
        harm: { text: "Shame them for needing help.", consequence: "{childName} internalizes shame." }
      }
    },
    8: {
      title: "Communication Development: Spoken or Alternative",
      topic: "Finding their voice",
      scene: "{childName} develops communication in their way: speech, sign, AAC device.",
      choices: {
        connect: { text: "Celebrate however they communicate.", consequence: "{childName} feels heard." },
        teach: { text: "Support their preferred communication method.", consequence: "They communicate effectively." },
        boundary: { text: "All communication methods are valid.", consequence: "They're not 'broken.'" },
        avoid: { text: "Push only speech.", consequence: "{childName} struggles to communicate." },
        harm: { text: "Dismiss their communication method.", consequence: "{childName} feels unheard." }
      }
    },
    9: {
      title: "Health Concerns: Thyroid, Heart, Hearing",
      topic: "Health monitoring",
      scene: "{childName} needs extra monitoring for common Down syndrome-related health issues.",
      choices: {
        connect: { text: "Manage health monitoring with care.", consequence: "{childName} is healthy." },
        teach: { text: "Understand what monitoring catches early.", consequence: "You're proactive." },
        boundary: { text: "Health needs are managed, not obsessed over.", consequence: "Life continues normally." },
        avoid: { text: "Neglect monitoring.", consequence: "{childName} develops undetected issues." },
        harm: { text: "Use health as excuse for isolation.", consequence: "{childName} is isolated." }
      }
    },
    10: {
      title: "Peer Awareness of Difference",
      topic: "Social understanding",
      scene: "{childName} becomes aware they're different from peers. Questions and feelings emerge.",
      choices: {
        connect: { text: "Be honest and affirming about difference.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss Down syndrome positively.", consequence: "They see their identity." },
        boundary: { text: "Different is okay and valid.", consequence: "Pride is maintained." },
        avoid: { text: "Hide or minimize the difference.", consequence: "{childName} is confused." },
        harm: { text: "Make them feel bad about being different.", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Academic Learning: Special Education Path",
      topic: "Education tailored to their needs",
      scene: "{childName} follows special education curriculum. Different doesn't mean no learning.",
      choices: {
        connect: { text: "Support their learning actively.", consequence: "{childName} learns and progresses." },
        teach: { text: "Help them learn functional and academic skills.", consequence: "Education is meaningful." },
        boundary: { text: "Their education prepares them for adult life.", consequence: "Future is real." },
        avoid: { text: "Accept inadequate education.", consequence: "{childName} falls behind." },
        harm: { text: "Assume they can't learn.", consequence: "{childName} doesn't develop." }
      }
    },
    12: {
      title: "Independence Expanding: Interests & Preferences",
      topic: "Growing self-awareness",
      scene: "{childName} develops clear preferences and interests. They're becoming their own person.",
      choices: {
        connect: { text: "Honor their preferences and interests.", consequence: "{childName} feels seen." },
        teach: { text: "Help them pursue their interests.", consequence: "They develop identity." },
        boundary: { text: "Their choices matter; you support them.", consequence: "Autonomy grows." },
        avoid: { text: "Ignore their emerging preferences.", consequence: "{childName} feels invisible." },
        harm: { text: "Control all their choices.", consequence: "{childName} doesn't develop autonomy." }
      }
    },
    13: {
      title: "Transition Planning Begins",
      topic: "Moving toward adulthood",
      scene: "{childName} (and school) begin planning for transition to adulthood.",
      choices: {
        connect: { text: "Be actively involved in planning.", consequence: "{childName} has solid plan." },
        teach: { text: "Understand what transition means for them.", consequence: "Future is realistic." },
        boundary: { text: "Plan for maximum independence.", consequence: "They develop skills." },
        avoid: { text: "Avoid transition planning.", consequence: "{childName} isn't prepared." },
        harm: { text: "Plan for complete dependence.", consequence: "{childName} doesn't develop." }
      }
    },
    14: {
      title: "Sexual Health & Relationship Education",
      topic: "Growing sexuality",
      scene: "{childName} reaches adolescence. Sexual health education and relationship understanding needed.",
      choices: {
        connect: { text: "Provide age-appropriate, honest education.", consequence: "{childName} is informed." },
        teach: { text: "Discuss safety, consent, healthy relationships.", consequence: "They understand boundaries." },
        boundary: { text: "Their sexuality and rights are real.", consequence: "They're not asexual by default." },
        avoid: { text: "Ignore sexual development.", consequence: "{childName} is vulnerable." },
        harm: { text: "Shame them for sexuality.", consequence: "{childName} internalizes shame." }
      }
    },
    15: {
      title: "Identity & Self-Advocacy Emerging",
      topic: "Growing voice",
      scene: "{childName} is 15. They have preferences, opinions, and developing self-advocacy.",
      choices: {
        connect: { text: "Listen to their voice seriously.", consequence: "{childName} feels heard." },
        teach: { text: "Support their self-advocacy skills.", consequence: "They learn to advocate." },
        boundary: { text: "Their voice matters in decisions.", consequence: "Autonomy is real." },
        avoid: { text: "Speak for them always.", consequence: "{childName} doesn't develop voice." },
        harm: { text: "Dismiss their opinions.", consequence: "{childName} becomes silent." }
      }
    },
    16: {
      title: "Work Experience & Skills Building",
      topic: "Building toward independence",
      scene: "{childName} is 16. Work training or volunteering is helping them develop skills.",
      choices: {
        connect: { text: "Support their work experience actively.", consequence: "{childName} builds confidence." },
        teach: { text: "Help them learn work skills and social expectations.", consequence: "Skills develop." },
        boundary: { text: "Work is meaningful, not exploitative.", consequence: "They're treated fairly." },
        avoid: { text: "Keep them from work experience.", consequence: "{childName} doesn't develop work skills." },
        harm: { text: "Exploit their labor.", consequence: "{childName} is mistreated." }
      }
    },
    17: {
      title: "Adult Services & Support Planning",
      topic: "Future independence",
      scene: "{childName} is 17. Transition to adult services, legal planning, future living arrangements.",
      choices: {
        connect: { text: "Plan for maximum independence.", consequence: "{childName} has options." },
        teach: { text: "Help them understand adult responsibilities.", consequence: "They're prepared." },
        boundary: { text: "Their input is valued in planning.", consequence: "They have agency." },
        avoid: { text: "Plan for total dependence.", consequence: "{childName} has no autonomy." },
        harm: { text: "Ignore legal planning.", consequence: "{childName} is unprotected." }
      }
    },
    18: {
      title: "Adult Life: Supported Independence",
      topic: "Your new role",
      scene: "{childName} is 18. Legally adult. You shift to supported independence rather than full care.",
      choices: {
        connect: { text: "Support their adult life with pride.", consequence: "{childName} feels validated." },
        teach: { text: "Help them navigate adult world.", consequence: "They learn gradually." },
        boundary: { text: "Their autonomy is real within their capacity.", consequence: "They're treated as adult." },
        avoid: { text: "Treat them as forever child.", consequence: "{childName} doesn't develop." },
        harm: { text: "Abandon support without preparation.", consequence: "{childName} struggles." }
      }
    }
  },

  child_dyslexia: {
    1: {
      title: "Early Literacy Struggles Begin",
      topic: "Language processing",
      scene: "{childName} learns to speak but has language-processing differences.",
      choices: {
        connect: { text: "Learn about their communication style.", consequence: "{childName} feels understood." },
        teach: { text: "Understand early dyslexia signs.", consequence: "You catch issues early." },
        boundary: { text: "Language differences are real, not laziness.", consequence: "They're supported." },
        avoid: { text: "Ignore language struggles.", consequence: "{childName} falls behind." },
        harm: { text: "Shame them for speech delays.", consequence: "{childName} hides struggles." }
      }
    },
    2: {
      title: "Letter Recognition: Reversals & Confusion",
      topic: "Visual processing",
      scene: "{childName} struggles with letter recognition, reversals (b/d), or sequence confusion.",
      choices: {
        connect: { text: "Work with them patiently on letter learning.", consequence: "{childName} learns gradually." },
        teach: { text: "Use multisensory methods for letter learning.", consequence: "They learn differently." },
        boundary: { text: "Letter reversals are developmental, not deficiency.", consequence: "No shame." },
        avoid: { text: "Pressure intensive letter drilling.", consequence: "{childName} resists." },
        harm: { text: "Shame them for reversals.", consequence: "{childName} avoids letters." }
      }
    },
    3: {
      title: "First Dyslexia Suspicions",
      topic: "Early identification",
      scene: "Teachers or you start suspecting dyslexia. {childName} is struggling with reading.",
      choices: {
        connect: { text: "Pursue evaluation calmly.", consequence: "You get answers." },
        teach: { text: "Learn about dyslexia from experts.", consequence: "Understanding grows." },
        boundary: { text: "Early evaluation helps, doesn't label forever.", consequence: "Support begins." },
        avoid: { text: "Ignore suspicions.", consequence: "{childName} falls further behind." },
        harm: { text: "Tell {childName} they're 'stupid.'", consequence: "{childName} internalizes shame." }
      }
    },
    4: {
      title: "Formal Dyslexia Testing & Diagnosis",
      topic: "Label and clarity",
      scene: "{childName} is formally evaluated and diagnosed with dyslexia.",
      choices: {
        connect: { text: "Frame diagnosis as understanding, not limitation.", consequence: "{childName} feels relief." },
        teach: { text: "Explain dyslexia positively.", consequence: "They understand their brain." },
        boundary: { text: "Diagnosis opens doors to support.", consequence: "Help becomes available." },
        avoid: { text: "Treat diagnosis as tragedy.", consequence: "{childName} internalizes shame." },
        harm: { text: "Use diagnosis to lower expectations.", consequence: "{childName} doesn't grow." }
      }
    },
    5: {
      title: "Interventions Begin: Structured Literacy",
      topic: "Evidence-based support",
      scene: "{childName} starts receiving structured literacy instruction (Orton-Gillingham, etc.).",
      choices: {
        connect: { text: "Support the intervention process actively.", consequence: "{childName} learns with you." },
        teach: { text: "Practice intervention strategies at home.", consequence: "Learning generalizes." },
        boundary: { text: "Intervention shows results; progress is real.", consequence: "Hope is maintained." },
        avoid: { text: "Neglect intervention.", consequence: "{childName} falls further behind." },
        harm: { text: "Force intensive tutoring without breaks.", consequence: "{childName} burns out." }
      }
    },
    6: {
      title: "School Struggles: Reading Gaps Widen",
      topic: "Academic challenge",
      scene: "{childName}'s reading level falls further behind peers. Frustration grows.",
      choices: {
        connect: { text: "Validate their frustration and effort.", consequence: "{childName} feels understood." },
        teach: { text: "Help them see progress, however small.", consequence: "Hope remains." },
        boundary: { text: "Reading gaps can close with right support.", consequence: "They believe in possibility." },
        avoid: { text: "Ignore the growing gap.", consequence: "{childName} gives up." },
        harm: { text: "Shame them for being behind.", consequence: "{childName} hates school." }
      }
    },
    7: {
      title: "Accommodations in School: Extra Time, Audiobooks, etc.",
      topic: "Leveling the playing field",
      scene: "{childName} gets school accommodations. Different path to learning.",
      choices: {
        connect: { text: "Advocate for appropriate accommodations.", consequence: "{childName} gets support." },
        teach: { text: "Explain accommodations help them learn, not cheat.", consequence: "They accept help." },
        boundary: { text: "Accommodations don't lower learning standards.", consequence: "They still grow." },
        avoid: { text: "Reject accommodations out of shame.", consequence: "{childName} suffers." },
        harm: { text: "Make them feel bad about accommodations.", consequence: "{childName} hides struggles." }
      }
    },
    8: {
      title: "Peer Bullying or Teasing About Reading",
      topic: "Social pain",
      scene: "Peers tease {childName} about slow reading or needing accommodations.",
      choices: {
        connect: { text: "Validate their experience and protect them.", consequence: "{childName} feels supported." },
        teach: { text: "Discuss dyslexia as difference, not flaw.", consequence: "They see value in themselves." },
        boundary: { text: "Zero tolerance for bullying.", consequence: "They're protected." },
        avoid: { text: "Ignore peer bullying.", consequence: "{childName} internalizes pain." },
        harm: { text: "Say 'they're right, you should read better.'", consequence: "{childName} hates themselves." }
      }
    },
    9: {
      title: "Discovering Alternative Strengths",
      topic: "Positive reframe",
      scene: "{childName} discovers they have strengths: creativity, problem-solving, spatial reasoning.",
      choices: {
        connect: { text: "Celebrate their strengths enthusiastically.", consequence: "{childName} sees their value." },
        teach: { text: "Help them pursue their strengths.", consequence: "Confidence grows." },
        boundary: { text: "Strengths don't erase reading challenges.", consequence: "Realistic view forms." },
        avoid: { text: "Ignore their strengths.", consequence: "{childName} only sees deficits." },
        harm: { text: "Say 'your other talents don't matter.'", consequence: "{childName} loses confidence." }
      }
    },
    10: {
      title: "Understanding Dyslexia: Not Intelligence",
      topic: "Misconception correction",
      scene: "{childName} is 10. Understanding emerges: dyslexia ≠ stupidity.",
      choices: {
        connect: { text: "Celebrate their intelligence in all forms.", consequence: "{childName} believes in self." },
        teach: { text: "Explain dyslexia is neurological, not IQ.", consequence: "They understand the difference." },
        boundary: { text: "Intelligence is multifaceted.", consequence: "They see their value." },
        avoid: { text: "Conflate reading struggles with intelligence.", consequence: "{childName} thinks they're stupid." },
        harm: { text: "Say 'dyslexic people can't be smart.'", consequence: "{childName} internalizes shame." }
      }
    },
    11: {
      title: "Text-to-Speech & Technology Aids",
      topic: "Technology as equalizer",
      scene: "{childName} uses audiobooks, text-to-speech, or other tech to access content.",
      choices: {
        connect: { text: "Support technology use enthusiastically.", consequence: "{childName} can learn." },
        teach: { text: "Help them master the technology.", consequence: "They use it independently." },
        boundary: { text: "Technology is a tool, not a crutch.", consequence: "Learning is equalized." },
        avoid: { text: "Forbid technology use.", consequence: "{childName} can't access content." },
        harm: { text: "Make them feel bad about using tech.", consequence: "{childName} refuses help." }
      }
    },
    12: {
      title: "Academic Performance: Different Path, Real Progress",
      topic: "Redefining success",
      scene: "{childName}'s academic path is different. Their GPA or test scores may not show effort.",
      choices: {
        connect: { text: "Measure success by effort and growth, not grades alone.", consequence: "{childName} feels validated." },
        teach: { text: "Discuss different ways of being smart.", consequence: "They see broader intelligence." },
        boundary: { text: "Their effort is the measure of success.", consequence: "They're not defined by grades." },
        avoid: { text: "Judge them by traditional grades alone.", consequence: "{childName} internalizes failure." },
        harm: { text: "Punish them for grades despite effort.", consequence: "{childName} gives up." }
      }
    },
    13: {
      title: "Self-Advocacy Skills Developing",
      topic: "Speaking up for themselves",
      scene: "{childName} is 13. Learning to ask for accommodations and explain their needs.",
      choices: {
        connect: { text: "Support their self-advocacy.", consequence: "{childName} feels empowered." },
        teach: { text: "Help them explain dyslexia to others.", consequence: "They communicate clearly." },
        boundary: { text: "They take ownership of their accommodations.", consequence: "Independence grows." },
        avoid: { text: "Always speak for them.", consequence: "{childName} doesn't develop voice." },
        harm: { text: "Punish them for asking for help.", consequence: "{childName} stops advocating." }
      }
    },
    14: {
      title: "College Planning: Finding Supportive Schools",
      topic: "Future path",
      scene: "{childName} is 14. Dyslexia-friendly colleges exist. Research begins.",
      choices: {
        connect: { text: "Explore college options together.", consequence: "{childName} feels guided." },
        teach: { text: "Discuss how colleges support dyslexia.", consequence: "They see possibilities." },
        boundary: { text: "College is possible with right fit.", consequence: "Future feels real." },
        avoid: { text: "Say 'college isn't for dyslexic people.'", consequence: "{childName} gives up." },
        harm: { text: "Push colleges without support.", consequence: "{childName} struggles alone." }
      }
    },
    15: {
      title: "Discovering Dyslexic Strength: Big-Picture Thinking",
      topic: "Neurological advantage",
      scene: "{childName} notices they see patterns, big-picture, creative solutions others miss.",
      choices: {
        connect: { text: "Celebrate these cognitive strengths.", consequence: "{childName} sees value." },
        teach: { text: "Help them channel these strengths.", consequence: "They develop them." },
        boundary: { text: "Dyslexic thinking has real advantages.", consequence: "They're proud." },
        avoid: { text: "Ignore these strengths.", consequence: "{childName} only sees deficits." },
        harm: { text: "Say 'those don't matter.'", consequence: "{childName} gives up on strengths." }
      }
    },
    16: {
      title: "Career Exploration: Finding Fit",
      topic: "Working with dyslexia",
      scene: "{childName} is 16. Careers where reading is less critical or tech can help.",
      choices: {
        connect: { text: "Support career exploration broadly.", consequence: "{childName} sees many options." },
        teach: { text: "Discuss how dyslexia fits different careers.", consequence: "They make informed choices." },
        boundary: { text: "Many careers work well with dyslexia.", consequence: "Possibilities feel real." },
        avoid: { text: "Limit career options.", consequence: "{childName} feels trapped." },
        harm: { text: "Push reading-heavy careers without support.", consequence: "{childName} struggles." }
      }
    },
    17: {
      title: "College Decision: With Right Support?",
      topic: "Adult path",
      scene: "{childName} is 17. College with accommodations? Trade school? Gap year?",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss all options honestly.", consequence: "They choose wisely." },
        boundary: { text: "Dyslexia doesn't determine their path.", consequence: "They have agency." },
        avoid: { text: "Push one path without exploration.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you have to work twice as hard.'", consequence: "{childName} feels burdened." }
      }
    },
    18: {
      title: "Adult Dyslexia: Their Path Forward",
      topic: "Long-term strategy",
      scene: "{childName} is 18. Dyslexia is lifelong. How do they build their adult life?",
      choices: {
        connect: { text: "Support their authentic path.", consequence: "{childName} feels truly backed." },
        teach: { text: "Share wisdom about managing dyslexia.", consequence: "They learn from you." },
        boundary: { text: "Dyslexia doesn't limit their future.", consequence: "They see possibilities." },
        avoid: { text: "Act like their future is limited.", consequence: "{childName} internalizes limitation." },
        harm: { text: "Say 'you'll always struggle.'", consequence: "{childName} internalizes shame." }
      }
    }
  }
};
