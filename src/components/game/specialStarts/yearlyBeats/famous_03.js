export const SPECIAL_START_YEARLY_BEATS__FAMOUS_03 = {
  spotlight_spy: {
    1: {
      title: "Born Into Secrecy",
      topic: "Hidden identity",
      scene: "{childName} is born to a parent in intelligence work. Truth is compartmentalized.",
      choices: {
        connect: { text: "Love them without needing to know everything.", consequence: "{childName} feels safe." },
        teach: { text: "Explain some secrets are to keep people safe.", consequence: "They understand complexity." },
        boundary: { text: "Your relationship is honest within appropriate limits.", consequence: "Trust forms." },
        avoid: { text: "Treat them as part of operations.", consequence: "{childName} is confused about trust." },
        harm: { text: "Use secrecy to manipulate them.", consequence: "{childName} internalizes distrust." }
      }
    },
    2: {
      title: "Inconsistent Presence: Sudden Absences",
      topic: "Unpredictable parenting",
      scene: "{childName} doesn't understand why you disappear. Your work is classified.",
      choices: {
        connect: { text: "Create rituals that anchor them despite absences.", consequence: "{childName} feels connected." },
        teach: { text: "Explain absences age-appropriately.", consequence: "They understand the why." },
        boundary: { text: "Time with them is fully present when you're there.", consequence: "Quality compensates." },
        avoid: { text: "Leave them without explanation.", consequence: "{childName} feels abandoned." },
        harm: { text: "Use absences as punishment.", consequence: "{childName} develops abandonment trauma." }
      }
    },
    3: {
      title: "Stranger Danger: Too Much Awareness",
      topic: "Safety obsession",
      scene: "{childName} learns to be hypervigilant about strangers and danger early.",
      choices: {
        connect: { text: "Balance awareness with age-appropriate safety.", consequence: "{childName} is appropriately cautious." },
        teach: { text: "Teach discernment, not paranoia.", consequence: "They learn good judgment." },
        boundary: { text: "Trust in the world is still possible.", consequence: "They don't become paranoid." },
        avoid: { text: "Let hypervigilance develop unchecked.", consequence: "{childName} becomes anxious." },
        harm: { text: "Instill fear of everyone.", consequence: "{childName} becomes isolated." }
      }
    },
    4: {
      title: "Frequent Moves: Instability as Normal",
      topic: "Rootlessness",
      scene: "{childName} moves frequently. Home is wherever you are, not a place.",
      choices: {
        connect: { text: "Create portable rituals and constants.", consequence: "{childName} feels grounded." },
        teach: { text: "Help them see adaptability as strength.", consequence: "They value flexibility." },
        boundary: { text: "Each place gets time to feel like home.", consequence: "They build connections." },
        avoid: { text: "Treat moves as purely logistical.", consequence: "{childName} feels unmoored." },
        harm: { text: "Ignore their attachment to places.", consequence: "{childName} can't form attachments." }
      }
    },
    5: {
      title: "Lying as Survival Skill",
      topic: "Truth becomes flexible",
      scene: "{childName} learns to lie about family situation, where you work, why you're gone.",
      choices: {
        connect: { text: "Help them distinguish between necessary and harmful lies.", consequence: "{childName} has moral compass." },
        teach: { text: "Discuss when honesty matters despite consequences.", consequence: "Ethics develop." },
        boundary: { text: "Lying is survival, not character.", consequence: "They don't internalize shame." },
        avoid: { text: "Shame them for lying.", consequence: "{childName} lies more." },
        harm: { text: "Encourage deception in all areas.", consequence: "{childName} loses capacity for honesty." }
      }
    },
    6: {
      title: "Peer Questions They Can't Answer",
      topic: "Social isolation",
      scene: "Peers ask where your work is or why you're gone. {childName} has to lie or stay silent.",
      choices: {
        connect: { text: "Help them develop age-appropriate responses.", consequence: "{childName} handles questions." },
        teach: { text: "Discuss what information is safe to share.", consequence: "They learn discretion." },
        boundary: { text: "Secrets don't make them feel ashamed.", consequence: "Shame is separated from secrecy." },
        avoid: { text: "Leave them unprepared for questions.", consequence: "{childName} becomes anxious." },
        harm: { text: "Tell them to cut off friendships.", consequence: "{childName} becomes isolated." }
      }
    },
    7: {
      title: "Trust Issues Developing",
      topic: "Relationship difficulty",
      scene: "{childName} begins to question: who can I trust? Is everyone keeping secrets?",
      choices: {
        connect: { text: "Be transparent about your own values and integrity.", consequence: "{childName} learns what trustworthiness is." },
        teach: { text: "Discuss that not everyone is like your situation.", consequence: "They see world more clearly." },
        boundary: { text: "Trust can exist even in secret-keeping.", consequence: "They find peace." },
        avoid: { text: "Reinforce distrust of everyone.", consequence: "{childName} becomes paranoid." },
        harm: { text: "Use distrust to control them.", consequence: "{childName} internalizes control." }
      }
    },
    8: {
      title: "School: The Disappearing Parent",
      topic: "Embarrassment and confusion",
      scene: "{childName} can't explain absences to teachers or for assignments. Embarrassment builds.",
      choices: {
        connect: { text: "Work with school to support {childName} without disclosing.", consequence: "{childName} gets help." },
        teach: { text: "Help them narrate a safe version of events.", consequence: "They manage socially." },
        boundary: { text: "School partners with you on appropriate accommodations.", consequence: "Their needs are met." },
        avoid: { text: "Leave them to handle it alone.", consequence: "{childName} falls behind academically." },
        harm: { text: "Punish them for school problems.", consequence: "{childName} struggles more." }
      }
    },
    9: {
      title: "Compartmentalization: Living Double Life",
      topic: "Identity fragmentation",
      scene: "{childName} learns to compartmentalize: home self, school self, public self.",
      choices: {
        connect: { text: "Help them integrate identities as much as safely possible.", consequence: "{childName} feels whole." },
        teach: { text: "Discuss healthy vs. unhealthy compartmentalization.", consequence: "They understand nuance." },
        boundary: { text: "One core self exists beneath the compartments.", consequence: "Identity is stable." },
        avoid: { text: "Enforce complete separation.", consequence: "{childName} becomes fragmented." },
        harm: { text: "Let fragmentation become unhealthy.", consequence: "{childName} loses sense of self." }
      }
    },
    10: {
      title: "Awareness of Danger: Parent's Risk",
      topic: "Existential fear",
      scene: "{childName} becomes aware that your work is dangerous. You might not come home.",
      choices: {
        connect: { text: "Acknowledge danger without dramatizing.", consequence: "{childName} feels your realness." },
        teach: { text: "Discuss precautions and risk management.", consequence: "They feel less helpless." },
        boundary: { text: "Danger is real; safety protocols matter.", consequence: "Fear is grounded in reality." },
        avoid: { text: "Dismiss their fear.", consequence: "{childName} internalizes terror." },
        harm: { text: "Use danger to control them.", consequence: "{childName} becomes anxious." }
      }
    },
    11: {
      title: "Peer Pressure & Isolation",
      topic: "Social vulnerability",
      scene: "{childName} can't participate fully in peer relationships due to restrictions and secrecy.",
      choices: {
        connect: { text: "Help them find genuine peers who understand.", consequence: "{childName} has real friendships." },
        teach: { text: "Discuss social strategy and discernment.", consequence: "They navigate well." },
        boundary: { text: "Friendships are possible with boundaries.", consequence: "They're not completely isolated." },
        avoid: { text: "Isolate them completely.", consequence: "{childName} becomes very lonely." },
        harm: { text: "Spy on their friendships.", consequence: "{childName} loses all trust." }
      }
    },
    12: {
      title: "First Real Danger Encounter",
      topic: "Trauma exposure",
      scene: "{childName} experiences or witnesses a real danger event related to your work.",
      choices: {
        connect: { text: "Process the event together with full presence.", consequence: "{childName} heals with you." },
        teach: { text: "Help them understand what happened.", consequence: "Meaning-making occurs." },
        boundary: { text: "Trauma is processed, not buried.", consequence: "Healing can happen." },
        avoid: { text: "Ignore or minimize the event.", consequence: "{childName} carries trauma silently." },
        harm: { text: "Blame them for the danger.", consequence: "{childName} internalizes guilt." }
      }
    },
    13: {
      title: "Questions About Your Work: The Real Questions",
      topic: "Adolescent curiosity",
      scene: "{childName} is 13. They ask directly: What exactly do you do? Who do you work for?",
      choices: {
        connect: { text: "Answer truthfully within security limits.", consequence: "{childName} feels respected." },
        teach: { text: "Explain what you can and why you can't explain more.", consequence: "They understand constraints." },
        boundary: { text: "Honesty is honored within necessary secrecy.", consequence: "Trust grows." },
        avoid: { text: "Dodge completely.", consequence: "{childName} doubts you." },
        harm: { text: "Lie about your work.", consequence: "{childName} loses trust." }
      }
    },
    14: {
      title: "Considering Following Your Path",
      topic: "Career attraction",
      scene: "{childName} is 14. Your work seems thrilling, important, secret. Are they interested?",
      choices: {
        connect: { text: "Support their exploration without pressure.", consequence: "{childName} chooses freely." },
        teach: { text: "Discuss what this work really costs.", consequence: "They make informed choices." },
        boundary: { text: "Their path is theirs, not an extension of yours.", consequence: "Autonomy is real." },
        avoid: { text: "Pressure them toward intelligence work.", consequence: "{childName} resents you." },
        harm: { text: "Recruit them into operations.", consequence: "{childName} is harmed." }
      }
    },
    15: {
      title: "Romantic Relationships: Secrecy's Impact",
      topic: "Love and honesty",
      scene: "{childName} is 15 and falling for someone. How much truth can they share?",
      choices: {
        connect: { text: "Help them navigate honesty with partners.", consequence: "{childName} builds real relationships." },
        teach: { text: "Discuss healthy boundaries around family secrets.", consequence: "They find balance." },
        boundary: { text: "Romantic partners can know appropriate truths.", consequence: "Love is possible." },
        avoid: { text: "Forbid them to share anything.", consequence: "{childName}'s relationships stay shallow." },
        harm: { text: "Use partner relationships for intelligence.", consequence: "{childName}'s relationship is violated." }
      }
    },
    16: {
      title: "College & Independence: Escaping or Inheriting?",
      topic: "Future divergence",
      scene: "{childName} is 16. College away could mean escape from secrecy or recruitment.",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss implications of both paths.", consequence: "They choose wisely." },
        boundary: { text: "Their career is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward intelligence work.", consequence: "{childName} might resent it." },
        harm: { text: "Threaten them if they don't follow you.", consequence: "{childName} is devastated." }
      }
    },
    17: {
      title: "Understanding Your Sacrifices",
      topic: "Empathy and complexity",
      scene: "{childName} is 17. Can they understand why you chose secrecy over transparency?",
      choices: {
        connect: { text: "Share your journey authentically.", consequence: "{childName} understands you." },
        teach: { text: "Discuss how circumstances shape choices.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to explain.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame {childName} for your choices.", consequence: "{childName} feels guilty." }
      }
    },
    18: {
      title: "Adult Relationship: Rebuilding From Secrecy",
      topic: "New foundation",
      scene: "{childName} is 18. Can you build honest adult relationship despite past secrecy?",
      choices: {
        connect: { text: "Meet them as adult with more transparency.", consequence: "Real relationship forms." },
        teach: { text: "Share wisdom without demands.", consequence: "Connection deepens." },
        boundary: { text: "Respect their autonomy fully.", consequence: "Relationship is peer-level." },
        avoid: { text: "Continue treating them as child to control.", consequence: "Relationship stays unhealthy." },
        harm: { text: "Recruit them into operations.", consequence: "Relationship breaks." }
      }
    }
  },

  spotlight_olympian: {
    1: {
      title: "Born Into Athletic Lineage",
      topic: "High expectations",
      scene: "{childName} is born to parent(s) who were/are Olympic athletes.",
      choices: {
        connect: { text: "Love them for who they are, not what they might achieve.", consequence: "{childName} feels accepted." },
        teach: { text: "Share your athletic passion without pressure.", consequence: "They see your love for sport." },
        boundary: { text: "Their path is their own.", consequence: "Expectations are light." },
        avoid: { text: "Immediately see them as future champion.", consequence: "{childName} feels burdened." },
        harm: { text: "Treat them as extension of your legacy.", consequence: "{childName} internalizes pressure." }
      }
    },
    2: {
      title: "Athletic Environment From Early Childhood",
      topic: "Sport is normal",
      scene: "{childName} grows up around training facilities, gyms, athlete conversations.",
      choices: {
        connect: { text: "Let them explore freely without pressure.", consequence: "{childName} enjoys movement." },
        teach: { text: "Teach love of physical activity, not winning.", consequence: "Healthy relationship with sport." },
        boundary: { text: "Play is play; training is later.", consequence: "Childhood is protected." },
        avoid: { text: "Start structured training too early.", consequence: "{childName} burns out." },
        harm: { text: "Push competitive sport before age 6.", consequence: "{childName} resents activity." }
      }
    },
    3: {
      title: "Comparison to Parent: Can They Be Like You?",
      topic: "Pressure emerges",
      scene: "{childName} shows athletic interest. Peers and adults compare them to you.",
      choices: {
        connect: { text: "Celebrate their unique athletic path.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss that they're their own athlete.", consequence: "Identity is separate." },
        boundary: { text: "Comparisons are gently redirected.", consequence: "Pressure eases." },
        avoid: { text: "Allow constant comparison.", consequence: "{childName} internalizes inadequacy." },
        harm: { text: "Say 'you'll never be as good as me.'", consequence: "{childName} gives up." }
      }
    },
    4: {
      title: "First Competitive Sport Choice",
      topic: "Path begins",
      scene: "{childName} chooses their first sport or activity. Is it your sport or theirs?",
      choices: {
        connect: { text: "Support whatever they choose.", consequence: "{childName} pursues authentically." },
        teach: { text: "Help them try different sports.", consequence: "They find their fit." },
        boundary: { text: "Their choice matters, not your preference.", consequence: "Autonomy is respected." },
        avoid: { text: "Push them toward your sport.", consequence: "{childName} resents it." },
        harm: { text: "Say 'my sport is the best.'", consequence: "{childName} feels judged." }
      }
    },
    5: {
      title: "Early Success: Talent Emerges",
      topic: "Recognition begins",
      scene: "{childName} shows real talent. Coaches and people start seeing potential.",
      choices: {
        connect: { text: "Celebrate without inflating expectations.", consequence: "{childName} is proud but grounded." },
        teach: { text: "Discuss that talent is potential, not destiny.", consequence: "They stay humble." },
        boundary: { text: "Early success is one step, not the whole journey.", consequence: "Pressure is managed." },
        avoid: { text: "Treat early success as guaranteed future.", consequence: "{childName} feels pressure." },
        harm: { text: "Tell everyone 'my kid is going to the Olympics.'", consequence: "{childName} feels burdened." }
      }
    },
    6: {
      title: "Training Intensity Increases",
      topic: "Commitment deepens",
      scene: "{childName}'s training hours increase. Time commitment grows. Life narrows.",
      choices: {
        connect: { text: "Ensure training doesn't eliminate childhood.", consequence: "{childName} stays a kid." },
        teach: { text: "Help them balance sport with other life areas.", consequence: "Well-rounded development." },
        boundary: { text: "Education and friends matter as much as sport.", consequence: "Life is balanced." },
        avoid: { text: "Let sport consume all their time.", consequence: "{childName} has no other identity." },
        harm: { text: "Sacrifice {childName}'s education for sport.", consequence: "{childName} has no backup." }
      }
    },
    7: {
      title: "Injuries: First Real Setback",
      topic: "Vulnerability and resilience",
      scene: "{childName} gets injured. Physical and emotional pain are real.",
      choices: {
        connect: { text: "Support them through injury fully.", consequence: "{childName} heals with you." },
        teach: { text: "Discuss injury as part of athletic life.", consequence: "They develop resilience." },
        boundary: { text: "Recovery is prioritized over returning too fast.", consequence: "Health is protected." },
        avoid: { text: "Push them to return before healed.", consequence: "{childName} re-injures or resents you." },
        harm: { text: "Shame them for getting injured.", consequence: "{childName} hides future injuries." }
      }
    },
    8: {
      title: "Coaching & Authority Figures",
      topic: "Power dynamics",
      scene: "{childName}'s coach has authority and power over their athletic future.",
      choices: {
        connect: { text: "Maintain your parenting role alongside coaching.", consequence: "{childName} has you as safe person." },
        teach: { text: "Discuss healthy coach relationships.", consequence: "They know good boundaries." },
        boundary: { text: "You're still their parent, not just athlete's parent.", consequence: "Relationship is primary." },
        avoid: { text: "Defer all parenting to coach.", consequence: "{childName} loses you." },
        harm: { text: "Allow coach to have inappropriate authority.", consequence: "{childName} is at risk." }
      }
    },
    9: {
      title: "Peer Life: Sacrifice for Sport",
      topic: "Social isolation",
      scene: "{childName} misses parties, events, social time for training. Friends move on.",
      choices: {
        connect: { text: "Help them maintain meaningful friendships.", consequence: "{childName} has social life." },
        teach: { text: "Discuss sacrifice in sport realistically.", consequence: "They understand costs." },
        boundary: { text: "Some social life is non-negotiable.", consequence: "Balance is maintained." },
        avoid: { text: "Treat social life as less important than sport.", consequence: "{childName} becomes isolated." },
        harm: { text: "Punish social time.", consequence: "{childName} resents sport." }
      }
    },
    10: {
      title: "School & Sport Balance",
      topic: "Education matters too",
      scene: "{childName} is juggling serious training with schoolwork.",
      choices: {
        connect: { text: "Support both education and sport equally.", consequence: "{childName} succeeds in both." },
        teach: { text: "Help them develop time management.", consequence: "They balance well." },
        boundary: { text: "Education is never sacrificed for sport.", consequence: "Future is protected." },
        avoid: { text: "Let schoolwork slide for sport.", consequence: "{childName} falls behind academically." },
        harm: { text: "Say 'school doesn't matter if you make it.'", consequence: "{childName} has no backup." }
      }
    },
    11: {
      title: "Identifying as Athlete: That's Who They Are",
      topic: "Identity narrowing",
      scene: "{childName} is 11. Their identity is increasingly tied to being an athlete.",
      choices: {
        connect: { text: "Support athlete identity while building other selves.", consequence: "{childName} is multifaceted." },
        teach: { text: "Discuss identity beyond athletics.", consequence: "They develop full self." },
        boundary: { text: "Athletics is important part, not all of identity.", consequence: "Resilience is built." },
        avoid: { text: "Let athlete identity consume all other identities.", consequence: "{childName} has no backup self." },
        harm: { text: "Say 'you are only good at this sport.'", consequence: "{childName} has fragile self-worth." }
      }
    },
    12: {
      title: "Serious Competition & Pressure",
      topic: "Stakes increase",
      scene: "{childName} is competing seriously now. Winning and losing matter deeply.",
      choices: {
        connect: { text: "Love them the same regardless of results.", consequence: "{childName} feels unconditional love." },
        teach: { text: "Discuss winning, losing, and character.", consequence: "They develop healthy perspective." },
        boundary: { text: "Results don't define their worth.", consequence: "Pressure is managed." },
        avoid: { text: "Let results dominate your relationship.", consequence: "{childName} feels conditional love." },
        harm: { text: "Say 'I'm only proud if you win.'", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Considering Olympic Path: Realistic or Fantasy?",
      topic: "Diverging from parent's path",
      scene: "{childName} is 13. Will they pursue elite sport? Follow your path or find their own?",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss realistic Olympic pathway.", consequence: "They make informed choices." },
        boundary: { text: "Their path is theirs, not yours.", consequence: "Autonomy is real." },
        avoid: { text: "Pressure them toward Olympic path.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you have to be an Olympian.'", consequence: "{childName} feels burdened." }
      }
    },
    14: {
      title: "Relationship & Time: Dating While Elite Athlete",
      topic: "Life balance",
      scene: "{childName} is 14. Romantic interest conflicts with training time.",
      choices: {
        connect: { text: "Support relationships alongside sport.", consequence: "{childName} develops normally." },
        teach: { text: "Discuss balancing sport and relationships.", consequence: "They learn integration." },
        boundary: { text: "Relationships are allowed.", consequence: "They're not asexual for sport." },
        avoid: { text: "Say 'no dating until after Olympics.'", consequence: "{childName} resents you." },
        harm: { text: "Use relationships as leverage for training.", consequence: "{childName} is manipulated." }
      }
    },
    15: {
      title: "Elite Training: Full-Time Commitment",
      topic: "Point of no return",
      scene: "{childName} is 15. Full-time elite training is possible but costs everything else.",
      choices: {
        connect: { text: "Support whatever choice they make.", consequence: "{childName} feels free." },
        teach: { text: "Discuss costs and benefits honestly.", consequence: "They choose wisely." },
        boundary: { text: "Their choice; your support either way.", consequence: "Love is unconditional." },
        avoid: { text: "Pressure toward elite path.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'this is your only option.'", consequence: "{childName} feels trapped." }
      }
    },
    16: {
      title: "International Competition & Travel",
      topic: "Growing stakes",
      scene: "{childName} is 16. International competition and travel for serious athletes.",
      choices: {
        connect: { text: "Maintain your presence even with travel.", consequence: "{childName} stays connected to you." },
        teach: { text: "Help them navigate international experience.", consequence: "They grow as person." },
        boundary: { text: "You're still their parent, not just manager.", consequence: "Relationship is primary." },
        avoid: { text: "Become mostly manager, not parent.", consequence: "{childName} loses you." },
        harm: { text: "Use their success for your own ego.", consequence: "{childName} feels used." }
      }
    },
    17: {
      title: "Olympic Pathway or Divergence",
      topic: "Final path choice",
      scene: "{childName} is 17. Olympic path is real but so is divergence.",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Share wisdom about elite athletics.", consequence: "They choose wisely." },
        boundary: { text: "Their future is theirs, not yours.", consequence: "Autonomy is honored." },
        avoid: { text: "Pressure them toward Olympics.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you owe this to me.'", consequence: "{childName} is devastated." }
      }
    },
    18: {
      title: "Adult Athlete: Their Legacy, Not Yours",
      topic: "Separate identity",
      scene: "{childName} is 18. Whether Olympic or not, they're building their own athletic legacy.",
      choices: {
        connect: { text: "Support their path fully.", consequence: "{childName} feels truly backed." },
        teach: { text: "Share wisdom without controlling.", consequence: "They learn from you." },
        boundary: { text: "Their athletic legacy is theirs.", consequence: "Autonomy is honored." },
        avoid: { text: "Try to make them replicate your legacy.", consequence: "{childName} resents you." },
        harm: { text: "Say 'you didn't live up to my legacy.'", consequence: "{childName} internalizes shame." }
      }
    }
  },

  spotlight_nobel_scientist: {
    1: {
      title: "Born Into Academic Excellence",
      topic: "High intellectual expectations",
      scene: "{childName} is born to parent(s) in elite research/science.",
      choices: {
        connect: { text: "Love them for curiosity, not achievement.", consequence: "{childName} feels accepted." },
        teach: { text: "Share passion for discovery without pressure.", consequence: "They see your love for science." },
        boundary: { text: "Their intellectual path is theirs.", consequence: "Expectations are light." },
        avoid: { text: "Immediately see them as future Nobel laureate.", consequence: "{childName} feels burdened." },
        harm: { text: "Treat them as extension of your research.", consequence: "{childName} internalizes pressure." }
      }
    },
    2: {
      title: "Intellectual Stimulation From Early Childhood",
      topic: "Curiosity encouraged",
      scene: "{childName} grows up with scientific thinking, questions, and wonder.",
      choices: {
        connect: { text: "Nurture curiosity without forcing academics.", consequence: "{childName} loves learning." },
        teach: { text: "Model scientific thinking naturally.", consequence: "They develop inquiry mind." },
        boundary: { text: "Play and learning are intertwined.", consequence: "Childhood is protected." },
        avoid: { text: "Force academic learning before age 6.", consequence: "{childName} resists learning." },
        harm: { text: "Mock their questions or curiosity.", consequence: "{childName} stops asking." }
      }
    },
    3: {
      title: "Different Development: Intellectual Acceleration",
      topic: "Gifted child concerns",
      scene: "{childName} shows advanced intellectual abilities. Acceleration is possible.",
      choices: {
        connect: { text: "Support their acceleration while protecting childhood.", consequence: "{childName} learns at right pace." },
        teach: { text: "Help them find intellectual peers.", consequence: "They're appropriately challenged." },
        boundary: { text: "Acceleration doesn't mean loss of play.", consequence: "Childhood is maintained." },
        avoid: { text: "Skip grades excessively.", consequence: "{childName} is socially isolated." },
        harm: { text: "Push acceleration too fast.", consequence: "{childName} burns out." }
      }
    },
    4: {
      title: "School Boredom or Too-Fast Learning",
      topic: "Pacing challenge",
      scene: "{childName} is bored in regular classroom. School pace is too slow.",
      choices: {
        connect: { text: "Advocate for appropriate challenge.", consequence: "{childName} stays engaged." },
        teach: { text: "Help them develop independent learning.", consequence: "Self-directed learning emerges." },
        boundary: { text: "School supports their pace, not limits it.", consequence: "They thrive." },
        avoid: { text: "Leave them understimulated.", consequence: "{childName} develops behavior problems." },
        harm: { text: "Say 'slow down, you're showing off.'", consequence: "{childName} hides their ability." }
      }
    },
    5: {
      title: "First Research Interest: Deep Dive",
      topic: "Focused passion",
      scene: "{childName} becomes obsessed with a scientific topic. They want to understand deeply.",
      choices: {
        connect: { text: "Support their research interest fully.", consequence: "{childName} loves inquiry." },
        teach: { text: "Help them pursue their interest appropriately.", consequence: "They learn research methods." },
        boundary: { text: "Interest is supported without pressure.", consequence: "Passion is preserved." },
        avoid: { text: "Dismiss their interest.", consequence: "{childName} hides curiosity." },
        harm: { text: "Push them toward your research instead.", consequence: "{childName} resents science." }
      }
    },
    6: {
      title: "Comparison to Parent: Can They Be Like You?",
      topic: "Pressure emerges",
      scene: "Peers and adults compare {childName} to you. They're already expected to be brilliant.",
      choices: {
        connect: { text: "Celebrate their unique scientific path.", consequence: "{childName} feels accepted." },
        teach: { text: "Discuss that they're their own scientist.", consequence: "Identity is separate." },
        boundary: { text: "Comparisons are gently redirected.", consequence: "Pressure eases." },
        avoid: { text: "Allow constant comparison.", consequence: "{childName} internalizes inadequacy." },
        harm: { text: "Say 'you'll never be as good a scientist as me.'", consequence: "{childName} gives up." }
      }
    },
    7: {
      title: "Peer Isolation: Being 'Too Smart'",
      topic: "Social difficulty",
      scene: "{childName} is advanced intellectually but socially isolated. Peers think they're weird.",
      choices: {
        connect: { text: "Help them find intellectual peers.", consequence: "{childName} has friends who understand." },
        teach: { text: "Discuss how to relate to peers at different levels.", consequence: "Social skills develop." },
        boundary: { text: "Being smart isn't shameful.", consequence: "They own their intelligence." },
        avoid: { text: "Ignore their social isolation.", consequence: "{childName} becomes very lonely." },
        harm: { text: "Tell them to hide their intelligence.", consequence: "{childName} suppresses their ability." }
      }
    },
    8: {
      title: "Advanced Coursework & Acceleration Decisions",
      topic: "Educational pace",
      scene: "{childName} is advanced for age. Skip grades? Dual enrollment? AP classes?",
      choices: {
        connect: { text: "Make decisions based on their whole development.", consequence: "{childName} is happy and challenged." },
        teach: { text: "Discuss academic options honestly.", consequence: "They understand implications." },
        boundary: { text: "Acceleration is supported with social support.", consequence: "They integrate well." },
        avoid: { text: "Accelerate too much.", consequence: "{childName} is socially lost." },
        harm: { text: "Push acceleration against their will.", consequence: "{childName} resents school." }
      }
    },
    9: {
      title: "First Real Scientific Contribution: Small Discovery",
      topic: "Real learning",
      scene: "{childName} discovers something novel (for them). Excitement and pride are real.",
      choices: {
        connect: { text: "Celebrate their discovery genuinely.", consequence: "{childName} feels pride." },
        teach: { text: "Help them understand what they learned.", consequence: "Understanding deepens." },
        boundary: { text: "Small discoveries are valued.", consequence: "They keep exploring." },
        avoid: { text: "Dismiss small discovery as unimportant.", consequence: "{childName} loses interest." },
        harm: { text: "Say 'that's not really a discovery.'", consequence: "{childName} gives up." }
      }
    },
    10: {
      title: "Identifying as 'The Scientist': Identity Narrowing",
      topic: "Self-concept crystallizing",
      scene: "{childName} is 10. Identity increasingly tied to being brilliant/scientific.",
      choices: {
        connect: { text: "Support scientist identity while building other selves.", consequence: "{childName} is multifaceted." },
        teach: { text: "Discuss identity beyond academics.", consequence: "They develop full self." },
        boundary: { text: "Science is important part, not all of identity.", consequence: "Resilience is built." },
        avoid: { text: "Let scientist identity consume all other identities.", consequence: "{childName} has no backup self." },
        harm: { text: "Say 'you are only good at science.'", consequence: "{childName} has fragile self-worth." }
      }
    },
    11: {
      title: "Research Project: Independent or Guided?",
      topic: "Autonomy in learning",
      scene: "{childName} is 11. Independent research project is possible. Freedom or guidance?",
      choices: {
        connect: { text: "Guide without controlling their inquiry.", consequence: "{childName} develops independence." },
        teach: { text: "Help them learn research methods.", consequence: "Skills develop." },
        boundary: { text: "Their project, their questions, their answers.", consequence: "Autonomy is real." },
        avoid: { text: "Control their research completely.", consequence: "{childName} doesn't learn independence." },
        harm: { text: "Use their project for your publication.", consequence: "{childName} feels used." }
      }
    },
    12: {
      title: "Competition & Academia Pressure",
      topic: "Expectations intensify",
      scene: "{childName} is 12. Science competitions, scholarships, prestige matter.",
      choices: {
        connect: { text: "Support competition without making it define them.", consequence: "{childName} stays motivated." },
        teach: { text: "Discuss competition and collaboration.", consequence: "Healthy perspective develops." },
        boundary: { text: "Loss doesn't diminish their worth.", consequence: "Resilience is built." },
        avoid: { text: "Make outcomes dominate the relationship.", consequence: "{childName} feels conditional love." },
        harm: { text: "Say 'you have to win to be good.'", consequence: "{childName} internalizes shame." }
      }
    },
    13: {
      title: "Considering Science Path: Different Fields or Your Field?",
      topic: "Career divergence",
      scene: "{childName} is 13. Will they pursue science? Same field as yours or different?",
      choices: {
        connect: { text: "Support whatever scientific path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss different scientific fields.", consequence: "Options feel real." },
        boundary: { text: "Their field is theirs, not yours.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward your field.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'my field is the only important one.'", consequence: "{childName} feels judged." }
      }
    },
    14: {
      title: "Relationship & Time: Dating While Scientist-Track",
      topic: "Life balance",
      scene: "{childName} is 14. Romantic interest conflicts with academic focus.",
      choices: {
        connect: { text: "Support relationships alongside science.", consequence: "{childName} develops normally." },
        teach: { text: "Discuss balancing science and relationships.", consequence: "They learn integration." },
        boundary: { text: "Relationships are allowed.", consequence: "They're not asexual for science." },
        avoid: { text: "Discourage relationships.", consequence: "{childName} feels isolated." },
        harm: { text: "Use relationships as leverage for study.", consequence: "{childName} is manipulated." }
      }
    },
    15: {
      title: "Advanced Research: Contributing to Real Science",
      topic: "Crossing into real contribution",
      scene: "{childName} is 15. Real research contribution is possible.",
      choices: {
        connect: { text: "Support their research with appropriate guidance.", consequence: "{childName} grows as scientist." },
        teach: { text: "Teach research ethics and integrity.", consequence: "They develop as person." },
        boundary: { text: "Their work is credited as theirs.", consequence: "Integrity is maintained." },
        avoid: { text: "Use their work for your research.", consequence: "{childName} is exploited." },
        harm: { text: "Take credit for their work.", consequence: "{childName} feels violated." }
      }
    },
    16: {
      title: "College & Science Pathway: Reality Check",
      topic: "Future planning",
      scene: "{childName} is 16. College and career planning for science field.",
      choices: {
        connect: { text: "Explore options that fit their interests.", consequence: "{childName} finds right fit." },
        teach: { text: "Discuss realities of science careers.", consequence: "They make informed choices." },
        boundary: { text: "Their career is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward your career path.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you have to do what I do.'", consequence: "{childName} feels trapped." }
      }
    },
    17: {
      title: "Understanding Your Sacrifice: Academic Path",
      topic: "Empathy for your journey",
      scene: "{childName} is 17. Can they understand why you chose science over other paths?",
      choices: {
        connect: { text: "Share your journey authentically.", consequence: "{childName} understands you." },
        teach: { text: "Discuss how passion shapes choices.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to discuss your choices.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame {childName} for your sacrifices.", consequence: "{childName} feels guilty." }
      }
    },
    18: {
      title: "Adult Scientist: Their Legacy, Not Yours",
      topic: "Separate scientific identity",
      scene: "{childName} is 18. Building their own scientific legacy, whatever it looks like.",
      choices: {
        connect: { text: "Support their path fully.", consequence: "{childName} feels truly backed." },
        teach: { text: "Share wisdom without controlling.", consequence: "They learn from you." },
        boundary: { text: "Their scientific legacy is theirs.", consequence: "Autonomy is honored." },
        avoid: { text: "Try to make them replicate your legacy.", consequence: "{childName} resents you." },
        harm: { text: "Say 'you're not a real scientist.'", consequence: "{childName} internalizes shame." }
      }
    }
  },

  spotlight_humanitarian_doctor: {
    1: {
      title: "Born Into Mission-Driven Medicine",
      topic: "Helping as value",
      scene: "{childName} is born to parent(s) in humanitarian medicine or global health.",
      choices: {
        connect: { text: "Love them for their own choices, not your mission.", consequence: "{childName} feels accepted." },
        teach: { text: "Share passion for helping without expectation.", consequence: "They see your values." },
        boundary: { text: "Their path is theirs.", consequence: "Expectations are light." },
        avoid: { text: "Immediately see them as future doctor.", consequence: "{childName} feels burdened." },
        harm: { text: "Treat them as extension of your mission.", consequence: "{childName} internalizes pressure." }
      }
    },
    2: {
      title: "Exposure to Need: Global Suffering Early",
      topic: "Awareness of suffering",
      scene: "{childName} grows up seeing need, suffering, illness. Reality isn't sanitized.",
      choices: {
        connect: { text: "Help them process what they see with compassion.", consequence: "{childName} develops empathy." },
        teach: { text: "Discuss helping and impact age-appropriately.", consequence: "Values develop." },
        boundary: { text: "Exposure is contextualized, not traumatizing.", consequence: "Growth is healthy." },
        avoid: { text: "Expose them to trauma without support.", consequence: "{childName} becomes traumatized." },
        harm: { text: "Use suffering to guilt them.", consequence: "{childName} internalizes burden." }
      }
    },
    3: {
      title: "Frequent Travel & Instability: Following Your Work",
      topic: "Rootlessness",
      scene: "{childName} moves frequently following your humanitarian work.",
      choices: {
        connect: { text: "Create portable rituals and constants.", consequence: "{childName} feels grounded." },
        teach: { text: "Help them understand why you do this work.", consequence: "They see your values." },
        boundary: { text: "Home is where they feel safe.", consequence: "Stability is provided." },
        avoid: { text: "Treat moves as purely logistical.", consequence: "{childName} feels unmoored." },
        harm: { text: "Ignore their attachment to places.", consequence: "{childName} can't form attachments." }
      }
    },
    4: {
      title: "Privilege Awareness: Having More Than Others",
      topic: "Guilt and inequality",
      scene: "{childName} becomes aware they have more than communities you serve.",
      choices: {
        connect: { text: "Help them process privilege without shame.", consequence: "{childName} understands nuance." },
        teach: { text: "Discuss responsibility that comes with privilege.", consequence: "Values develop." },
        boundary: { text: "Privilege isn't shameful; how to use it matters.", consequence: "They're not paralyzed." },
        avoid: { text: "Ignore their privilege awareness.", consequence: "{childName} internalizes guilt." },
        harm: { text: "Guilt them for having more.", consequence: "{childName} develops shame." }
      }
    },
    5: {
      title: "Helping as Normal: Serving Others",
      topic: "Values embodied",
      scene: "{childName} learns that helping, serving, contributing is normal and valued.",
      choices: {
        connect: { text: "Model service without self-sacrifice.", consequence: "{childName} develops healthy values." },
        teach: { text: "Discuss healthy helping and boundaries.", consequence: "They learn balance." },
        boundary: { text: "Service is valued; self is still important.", consequence: "Values are balanced." },
        avoid: { text: "Model self-sacrifice.", consequence: "{childName} internalizes burn-out." },
        harm: { text: "Tell them 'your needs don't matter.'", consequence: "{childName} loses self." }
      }
    },
    6: {
      title: "Witnessing Your Limitations: You Can't Help Everyone",
      topic: "Frustration and realism",
      scene: "{childName} sees that despite your efforts, suffering continues. Limitations are real.",
      choices: {
        connect: { text: "Process frustration together.", consequence: "{childName} feels understood." },
        teach: { text: "Discuss impact within limitations.", consequence: "They develop realistic hope." },
        boundary: { text: "Doing good doesn't mean fixing everything.", consequence: "They stay motivated." },
        avoid: { text: "Ignore their observations.", consequence: "{childName} internalizes hopelessness." },
        harm: { text: "Use limitations to make them feel helpless.", consequence: "{childName} gives up." }
      }
    },
    7: {
      title: "School: Different Background Than Peers",
      topic: "Feeling out of place",
      scene: "{childName} goes to school but their background is different. Peers have different life.",
      choices: {
        connect: { text: "Help them navigate peer relationships.", consequence: "{childName} makes friends." },
        teach: { text: "Discuss diverse ways of living.", consequence: "They see breadth of human experience." },
        boundary: { text: "Different background isn't shameful.", consequence: "They're proud." },
        avoid: { text: "Ignore their different experience.", consequence: "{childName} feels isolated." },
        harm: { text: "Tell them they're better than peers.", consequence: "{childName} becomes arrogant." }
      }
    },
    8: {
      title: "Medical Reality: Illness, Death, Suffering",
      topic: "Exposure to human fragility",
      scene: "{childName} is exposed to medical realities. Illness and death aren't abstract.",
      choices: {
        connect: { text: "Process experiences together.", consequence: "{childName} develops compassion." },
        teach: { text: "Help them understand mortality age-appropriately.", consequence: "They grow emotionally." },
        boundary: { text: "Exposure is managed, not traumatizing.", consequence: "Growth is healthy." },
        avoid: { text: "Expose them without support.", consequence: "{childName} is traumatized." },
        harm: { text: "Mock their reactions.", consequence: "{childName} hides feelings." }
      }
    },
    9: {
      title: "Pressure to Follow Your Path: Becoming a Doctor",
      topic: "Expected legacy",
      scene: "{childName} is 9. Everyone assumes they'll become a doctor like you.",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss medicine as one option among many.", consequence: "Options feel open." },
        boundary: { text: "Their career is theirs.", consequence: "Autonomy is real." },
        avoid: { text: "Let pressure build unchecked.", consequence: "{childName} feels trapped." },
        harm: { text: "Say 'you have to be a doctor.'", consequence: "{childName} feels burdened." }
      }
    },
    10: {
      title: "Questions About Justice & Inequality",
      topic: "Ethical awareness",
      scene: "{childName} is 10. Why is some healthcare available and some not? Why this inequality?",
      choices: {
        connect: { text: "Engage their questions seriously.", consequence: "{childName} feels heard." },
        teach: { text: "Discuss systems and justice.", consequence: "Critical thinking develops." },
        boundary: { text: "Questions are honored, not dismissed.", consequence: "They become thinkers." },
        avoid: { text: "Tell them 'don't worry about it.'", consequence: "{childName} stops questioning." },
        harm: { text: "Use injustice to guilt them.", consequence: "{childName} internalizes burden." }
      }
    },
    11: {
      title: "Identifying as Helper/Healer: Identity Formation",
      topic: "Self-concept developing",
      scene: "{childName} is 11. Identity increasingly tied to being helpful or potentially healing.",
      choices: {
        connect: { text: "Support helper identity while building other selves.", consequence: "{childName} is multifaceted." },
        teach: { text: "Discuss identity beyond helping.", consequence: "They develop full self." },
        boundary: { text: "Helping is important part, not all of identity.", consequence: "Resilience is built." },
        avoid: { text: "Let helper identity consume all other identities.", consequence: "{childName} has no backup self." },
        harm: { text: "Say 'you're only valuable when helping.'", consequence: "{childName} has fragile self-worth." }
      }
    },
    12: {
      title: "Medical School Talk Begins",
      topic: "Career path consideration",
      scene: "{childName} is 12. Medical school path is discussed or expected.",
      choices: {
        connect: { text: "Explore their actual interests.", consequence: "{childName} makes own choice." },
        teach: { text: "Discuss medicine honestly (challenges, rewards).", consequence: "They make informed choice." },
        boundary: { text: "Medicine is option, not requirement.", consequence: "Autonomy is real." },
        avoid: { text: "Push toward medical school.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'medical school is your only option.'", consequence: "{childName} feels trapped." }
      }
    },
    13: {
      title: "Considering Medicine or Other Paths: Real Choice",
      topic: "Career divergence",
      scene: "{childName} is 13. Medicine is one option; other helping fields or completely different paths.",
      choices: {
        connect: { text: "Support whatever authentic path they choose.", consequence: "{childName} feels free." },
        teach: { text: "Discuss different ways to help in the world.", consequence: "Options feel real." },
        boundary: { text: "Their path is theirs, not yours.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward medicine.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'medicine is the only real helping.'", consequence: "{childName} feels judged." }
      }
    },
    14: {
      title: "Relationship & Time: Dating While Helping Others",
      topic: "Life balance",
      scene: "{childName} is 14. Romantic interest conflicts with helping mindset or your schedule.",
      choices: {
        connect: { text: "Support relationships alongside helping.", consequence: "{childName} develops normally." },
        teach: { text: "Discuss balance between self-care and service.", consequence: "They learn integration." },
        boundary: { text: "Relationships are allowed.", consequence: "They're not asexual for helping." },
        avoid: { text: "Discourage relationships.", consequence: "{childName} feels isolated." },
        harm: { text: "Say 'relationships take away from helping.'", consequence: "{childName} feels guilty for loving." }
      }
    },
    15: {
      title: "Service or Volunteerism: Testing Their Values",
      topic: "Authenticity check",
      scene: "{childName} is 15. Volunteering or service work is possible. Do they want to?",
      choices: {
        connect: { text: "Support authentic service if they want it.", consequence: "{childName} serves with genuine passion." },
        teach: { text: "Help them understand their values.", consequence: "Authenticity develops." },
        boundary: { text: "Service is their choice, not your agenda.", consequence: "Values are real." },
        avoid: { text: "Force them to volunteer.", consequence: "{childName} resents helping." },
        harm: { text: "Use volunteering to guilt them.", consequence: "{childName} feels manipulated." }
      }
    },
    16: {
      title: "College & Career: Medicine or Different Path",
      topic: "Future planning",
      scene: "{childName} is 16. College options are opening. Medical school track or divergence?",
      choices: {
        connect: { text: "Explore options that fit their interests.", consequence: "{childName} finds right fit." },
        teach: { text: "Discuss different helping professions.", consequence: "Options are clear." },
        boundary: { text: "Their career is theirs to choose.", consequence: "Autonomy is real." },
        avoid: { text: "Push them toward medical school.", consequence: "{childName} might resent it." },
        harm: { text: "Say 'you have to be a doctor like me.'", consequence: "{childName} feels trapped." }
      }
    },
    17: {
      title: "Understanding Your Sacrifice: Calling vs. Burden",
      topic: "Empathy for your journey",
      scene: "{childName} is 17. Can they understand why you chose medicine despite its burdens?",
      choices: {
        connect: { text: "Share your journey authentically.", consequence: "{childName} understands you." },
        teach: { text: "Discuss how calling shaped your choices.", consequence: "Empathy develops." },
        boundary: { text: "Complexity is allowed; accountability too.", consequence: "Relationship is real." },
        avoid: { text: "Refuse to discuss your journey.", consequence: "{childName} feels unsupported." },
        harm: { text: "Blame {childName} for your sacrifices.", consequence: "{childName} feels guilty." }
      }
    },
    18: {
      title: "Adult Path: Helping in Their Own Way",
      topic: "Their unique contribution",
      scene: "{childName} is 18. Whatever path, they're finding their way to contribute.",
      choices: {
        connect: { text: "Support their authentic path.", consequence: "{childName} feels truly backed." },
        teach: { text: "Share wisdom about sustainable helping.", consequence: "They learn from you." },
        boundary: { text: "Their contribution is valid in any form.", consequence: "They're honored." },
        avoid: { text: "Dismiss non-medical helping.", consequence: "{childName} feels judged." },
        harm: { text: "Say 'you're not really helping.'", consequence: "{childName} internalizes shame." }
      }
    }
  }
};