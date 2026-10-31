
// Library catalog: Reorganized into 3 sections (Parenting, Self-Help, Fiction)

const PARENTING_BOOKS = [
  {
    id: "what-to-expect-first-year",
    rank: 1,
    title: "What to Expect the First Year",
    author: "Heidi Murkoff & Sharon Mazel",
    amazonUrl: "#demo-disabled",
    effects: { intelligence: 0.3, discipline: 0.2 },
    tags: ["newborn", "sleep & feeding", "health & safety"],
    blurb:
      "A month-by-month reference for the first 12 months. It focuses on what's typical, what varies, and when a question is worth bringing to a clinician.",
    whatYouLearn: [
      "How feeding, sleep, and development commonly change across the first year.",
      "How to set up safe routines without rigid schedules.",
      "Common symptoms and practical decision points for when to call the doctor.",
      "Ways to track growth and milestones without overreacting to normal variation.",
      "Checklists for safety, travel, and basic babyproofing."
    ]
  },
  {
    id: "happiest-baby-on-the-block",
    rank: 2,
    title: "The Happiest Baby on the Block",
    author: "Harvey Karp, M.D.",
    amazonUrl: "#demo-disabled",
    effects: { confidence: 0.3, empathy: 0.2 },
    tags: ["newborn soothing", "sleep", "crying"],
    blurb:
      "A practical guide for calming newborns and building early sleep habits. The core idea is that many babies need strong, consistent soothing cues during the fourth trimester.",
    whatYouLearn: [
      "Why newborns often cry and what patterns are common vs. concerning.",
      "A step-by-step soothing sequence (swaddling, shushing/white noise, rhythmic motion, sucking, etc.).",
      "How to calm first and then work on longer sleep stretches.",
      "How to avoid common soothing mistakes (overstimulation, inconsistent cues).",
      "Basic safety notes for soothing and sleep setups."
    ]
  },
  {
    id: "whole-brain-child",
    rank: 3,
    title: "The Whole-Brain Child",
    author: "Daniel J. Siegel, M.D. & Tina Payne Bryson, Ph.D.",
    amazonUrl: "#demo-disabled",
    effects: { intelligence: 0.3, empathy: 0.3 },
    tags: ["brain development", "emotional regulation", "connection"],
    blurb:
      "A neuroscience-informed approach to everyday parenting problems. It links common behaviors to how a child's brain develops, and offers concrete ways to respond that build regulation over time.",
    whatYouLearn: [
      "How big feelings can overwhelm a child's ability to think clearly.",
      "Ways to connect first (co-regulate) and then guide behavior once calm.",
      "Simple tools for helping kids reflect, make sense of events, and recover from conflict.",
      "How to build skills like flexibility, frustration tolerance, and perspective-taking.",
      "Age-appropriate scripts and mini-exercises you can use in the moment."
    ]
  },
  {
    id: "how-to-talk-kids-will-listen",
    rank: 4,
    title: "How to Talk So Kids Will Listen & Listen So Kids Will Talk",
    author: "Adele Faber & Elaine Mazlish",
    amazonUrl:
      "#demo-disabled",
    effects: { empathy: 0.4, confidence: 0.2 },
    tags: ["communication", "cooperation", "conflict"],
    blurb:
      "A practical communication toolkit for getting cooperation without constant arguing. It focuses on how to acknowledge feelings, set limits, and problem-solve in ways kids can hear.",
    whatYouLearn: [
      "Language that lowers defensiveness by naming feelings without giving in.",
      "How to ask for cooperation with choices and clear expectations.",
      "How to set limits without lectures, threats, or long negotiations.",
      "How to handle recurring problems with structured problem-solving.",
      "How to praise effort and responsibility without overdoing rewards."
    ]
  },
  {
    id: "no-drama-discipline",
    rank: 5,
    title: "No-Drama Discipline",
    author: "Daniel J. Siegel, M.D. & Tina Payne Bryson, Ph.D.",
    amazonUrl: "#demo-disabled",
    effects: { discipline: 0.4, empathy: 0.2 },
    tags: ["discipline", "boundaries", "tantrums"],
    blurb:
      "A discipline framework that treats misbehavior as a teaching moment. It emphasizes staying calm, keeping connection, and using consequences that build skills (not shame).",
    whatYouLearn: [
      "How to respond to misbehavior without escalating the nervous system (yours or theirs).",
      "How to separate 'stop the behavior' from 'teach the skill.'",
      "Ways to set firm boundaries while still validating emotions.",
      "Repair steps after conflict so discipline doesn't damage trust.",
      "Strategies for common flashpoints like tantrums, defiance, and sibling fights."
    ]
  },
  {
    id: "positive-discipline",
    rank: 6,
    title: "Positive Discipline",
    author: "Jane Nelsen, Ed.D.",
    amazonUrl: "#demo-disabled",
    effects: { discipline: 0.3, empathy: 0.3 },
    tags: ["firm & kind", "routines", "responsibility"],
    blurb:
      "A non-punitive discipline approach focused on long-term skills: responsibility, problem-solving, and respectful relationships. It's heavy on practical tools you can use consistently.",
    whatYouLearn: [
      "How to be both kind and firm (without permissiveness or harshness).",
      "How to use natural and logical consequences responsibly.",
      "How to run family routines/meetings to prevent repeat issues.",
      "How to reduce power struggles and improve cooperation.",
      "How to teach skills like accountability and repair after mistakes."
    ]
  },
  {
    id: "parenting-with-love-and-logic",
    rank: 7,
    title: "Parenting with Love and Logic",
    author: "Foster Cline, M.D. & Jim Fay",
    amazonUrl: "#demo-disabled",
    effects: { discipline: 0.4, confidence: 0.2 },
    tags: ["choices", "consequences", "responsibility"],
    blurb:
      "A strategy-focused book about setting limits while preserving connection. The emphasis is on giving choices within boundaries and letting consequences do more of the teaching.",
    whatYouLearn: [
      "How to offer choices that keep you out of power struggles.",
      "How to use enforceable statements instead of arguments or lectures.",
      "How to allow safe, proportional consequences so kids learn from outcomes.",
      "How to stay empathetic while still holding a boundary.",
      "How to build motivation and responsibility without constant nagging."
    ]
  },
  {
    id: "123-magic",
    rank: 8,
    title: "1-2-3 Magic: Effective Discipline for Children 2–12",
    author: "Thomas W. Phelan, Ph.D.",
    amazonUrl: "#demo-disabled",
    effects: { discipline: 0.5, confidence: 0.1 },
    tags: ["behavior", "consistency", "stop talking"],
    blurb:
      "A structured behavior-management method designed for consistency. It focuses on fewer words, predictable follow-through, and separating 'stop' behaviors from 'start' behaviors.",
    whatYouLearn: [
      "A simple counting-and-consequence routine for common misbehavior.",
      "How to reduce arguing by cutting down on warnings and lectures.",
      "How to set up consistent consequences without anger.",
      "How to teach positive behaviors separately (routines, chores, cooperation).",
      "How to adapt the method for different ages and temperaments."
    ]
  },
  {
    id: "explosive-child",
    rank: 9,
    title: "The Explosive Child",
    author: "Ross W. Greene, Ph.D.",
    amazonUrl: "#demo-disabled",
    effects: { empathy: 0.4, intelligence: 0.1, discipline: 0.1 },
    tags: ["challenging behavior", "problem solving", "flexibility"],
    blurb:
      "A collaborative approach for kids who melt down, get stuck, or seem chronically frustrated. The model treats explosions as a signal of lagging skills and unsolved problems, not 'bad attitude.'",
    whatYouLearn: [
      "How to identify the specific situations that trigger blow-ups (unsolved problems).",
      "How to separate skill gaps (flexibility, frustration tolerance) from willful defiance.",
      "A structured conversation to solve problems collaboratively and proactively.",
      "How to make expectations realistic and build skills over time.",
      "How to reduce punishments that don't address the root cause."
    ]
  },
  {
    id: "five-love-languages-children",
    rank: 10,
    title: "The 5 Love Languages of Children",
    author: "Gary Chapman, Ph.D. & Ross Campbell, M.D.",
    amazonUrl: "#demo-disabled",
    effects: { empathy: 0.3, confidence: 0.3 },
    tags: ["connection", "relationships", "attention"],
    blurb:
      "A framework for noticing how different kids best receive care and attention. The point isn't to label a child, but to diversify how you show support so it lands for them.",
    whatYouLearn: [
      "Common ways kids interpret connection (attention, words, touch, gifts, help).",
      "How to observe which signals matter most to your child in daily life.",
      "How to adjust your habits so discipline is paired with connection.",
      "How to avoid 'mismatched' support (doing what you prefer vs. what they feel).",
      "Simple daily practices to strengthen closeness without overindulging."
    ]
  }
];

const SELF_HELP_BOOKS = [
  {
    id: "let-them-theory",
    rank: 1,
    title: "The Let Them Theory",
    author: "Mel Robbins",
    amazonUrl: "#demo-disabled",
    effects: { confidence: 0.3, happiness: 0.2, anxiety: -0.1 },
    tags: ["boundaries", "stress relief", "confidence"],
    blurb: "A practical mindset shift: stop managing other people's reactions and focus on what you control.",
    whatYouLearn: [
      "How to stop chasing approval and reduce emotional reactivity.",
      "How to set boundaries without guilt spirals.",
      "How to redirect energy toward actions you actually control."
    ]
  },
  {
    id: "atomic-habits",
    rank: 2,
    title: "Atomic Habits",
    author: "James Clear",
    amazonUrl: "#demo-disabled",
    effects: { discipline: 0.4, intelligence: 0.2 },
    tags: ["habits", "systems", "consistency"],
    blurb: "A framework for building better habits through small changes that compound over time.",
    whatYouLearn: [
      "How to design habits using cues, cravings, response, and reward.",
      "How to make good habits easier and bad habits harder.",
      "Why identity-based habits stick longer than motivation."
    ]
  },
  {
    id: "subtle-art-not-giving",
    rank: 3,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    amazonUrl: "#demo-disabled",
    effects: { confidence: 0.3, anxiety: -0.2 },
    tags: ["priorities", "mindset", "stress relief"],
    blurb: "A blunt guide to choosing what matters and letting go of everything else.",
    whatYouLearn: [
      "How to stop over-caring about things you can't control.",
      "How values shape better decisions than vibes.",
      "How to accept discomfort without self-sabotage."
    ]
  },
  {
    id: "seven-habits",
    rank: 4,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    amazonUrl: "#demo-disabled",
    effects: { responsibility: 0.3, discipline: 0.2, intelligence: 0.1 },
    tags: ["principles", "leadership", "planning"],
    blurb: "A principle-based system for taking initiative and improving effectiveness over time.",
    whatYouLearn: [
      "How to be proactive instead of reactive.",
      "How to plan with the end in mind.",
      "How to prioritize what truly moves your life forward."
    ]
  },
  {
    id: "win-friends",
    rank: 5,
    title: "How to Win Friends & Influence People",
    author: "Dale Carnegie",
    amazonUrl: "#demo-disabled",
    effects: { social: 0.3, empathy: 0.2, confidence: 0.1 },
    tags: ["social skills", "communication", "relationships"],
    blurb: "Timeless relationship tactics for being more persuasive without being manipulative.",
    whatYouLearn: [
      "How to make people feel heard and valued.",
      "How to reduce conflict without surrendering your goals.",
      "How to persuade using curiosity instead of force."
    ]
  },
  {
    id: "four-agreements",
    rank: 6,
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    amazonUrl: "#demo-disabled",
    effects: { anxiety: -0.2, happiness: 0.2, empathy: 0.1 },
    tags: ["mindset", "peace", "self-talk"],
    blurb: "A simple set of agreements designed to reduce drama and improve inner peace.",
    whatYouLearn: [
      "How words shape your reality (and your stress).",
      "How to stop taking everything personally.",
      "How to reduce suffering by lowering assumptions."
    ]
  },
  {
    id: "cant-hurt-me",
    rank: 7,
    title: "Can't Hurt Me",
    author: "David Goggins",
    amazonUrl: "#demo-disabled't+Hurt+Me+David+Goggins",
    effects: { discipline: 0.3, fitness: 0.2, confidence: 0.1 },
    tags: ["grit", "discipline", "resilience"],
    blurb: "An extreme accountability approach to building mental toughness and discipline.",
    whatYouLearn: [
      "How to build grit through repeated discomfort.",
      "How to stop negotiating with your excuses.",
      "How to use discipline as a daily system."
    ]
  },
  {
    id: "think-like-a-monk",
    rank: 8,
    title: "Think Like a Monk",
    author: "Jay Shetty",
    amazonUrl: "#demo-disabled",
    effects: { happiness: 0.2, anxiety: -0.1, responsibility: 0.1 },
    tags: ["clarity", "purpose", "calm"],
    blurb: "A structured approach to reducing noise, increasing clarity, and living with purpose.",
    whatYouLearn: [
      "How to identify what's draining your attention.",
      "How to practice gratitude and reduce negativity loops.",
      "How to build routines that protect your peace."
    ]
  },
  {
    id: "power-of-now",
    rank: 9,
    title: "The Power of Now",
    author: "Eckhart Tolle",
    amazonUrl: "#demo-disabled",
    effects: { anxiety: -0.2, happiness: 0.1 },
    tags: ["presence", "mindfulness", "stress relief"],
    blurb: "A philosophy-forward guide to being present and reducing suffering caused by mental spirals.",
    whatYouLearn: [
      "How to notice thought loops without becoming them.",
      "How to practice presence during stress.",
      "How to reduce rumination and overthinking."
    ]
  },
  {
    id: "mindset",
    rank: 10,
    title: "Mindset",
    author: "Carol S. Dweck",
    amazonUrl: "#demo-disabled",
    effects: { intelligence: 0.2, confidence: 0.2, curiosity: 0.1 },
    tags: ["growth mindset", "learning", "motivation"],
    blurb: "A research-backed concept: believing you can grow changes how you learn and persist.",
    whatYouLearn: [
      "How fixed mindset blocks progress.",
      "How to reframe failure as feedback.",
      "How to build persistence through better self-talk."
    ]
  }
];

const FICTION_BOOKS = [
  {
    id: "little-prince",
    rank: 1,
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    amazonUrl: "#demo-disabled",
    stressDelta: -3,
    childEffects: { curiosity: 0.2 },
    tags: ["classic", "philosophy", "wonder"],
    blurb: "A poetic fable about seeing what matters. It's short, beautiful, and timeless.",
    whatYouLearn: [
      "What is essential is invisible to the eye.",
      "Adults forget how to see wonder.",
      "Love makes ordinary things extraordinary."
    ],
    whatYouTellChild: [
      "Sometimes grown-ups forget what's important.",
      "The best things aren't things—they're people you care about."
    ]
  },
  {
    id: "fahrenheit-451",
    rank: 2,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    amazonUrl: "#demo-disabled",
    stressDelta: -2,
    childEffects: { curiosity: 0.2, intelligence: 0.1 },
    tags: ["dystopia", "censorship", "thought"],
    blurb: "A future where books are banned and critical thinking is dangerous.",
    whatYouLearn: [
      "Passive consumption kills curiosity.",
      "Real conversation requires discomfort.",
      "A society that avoids hard questions becomes fragile."
    ],
    whatYouTellChild: [
      "Books help us think for ourselves.",
      "It's okay to ask hard questions—that's how we grow."
    ]
  },
  {
    id: "to-kill-mockingbird",
    rank: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    amazonUrl: "#demo-disabled",
    stressDelta: -3,
    childEffects: { empathy: 0.2, curiosity: 0.1 },
    tags: ["justice", "empathy", "courage"],
    blurb: "A story about moral courage in an unjust world, told through a child's eyes.",
    whatYouLearn: [
      "Courage is doing what's right when it's hard.",
      "You can't understand someone until you've walked in their shoes.",
      "Integrity matters more than popularity."
    ],
    whatYouTellChild: [
      "Fairness isn't always easy, but it's always worth it.",
      "Stand up for people even when others don't."
    ]
  },
  {
    id: "giver",
    rank: 4,
    title: "The Giver",
    author: "Lois Lowry",
    amazonUrl: "#demo-disabled",
    stressDelta: -3,
    childEffects: { curiosity: 0.3, intelligence: 0.1 },
    tags: ["dystopia", "memory", "choice"],
    blurb: "A 'perfect' society without pain, choice, or color. One boy learns the cost of comfort.",
    whatYouLearn: [
      "Safety without choice is a cage.",
      "Memory and pain are part of being human.",
      "Emotions—even hard ones—are worth feeling."
    ],
    whatYouTellChild: [
      "Life is richer when you can feel all the feelings.",
      "Being safe isn't the same as being free."
    ]
  },
  {
    id: "hatchet",
    rank: 5,
    title: "Hatchet",
    author: "Gary Paulsen",
    amazonUrl: "#demo-disabled",
    stressDelta: -3,
    childEffects: { confidence: 0.2, curiosity: 0.1 },
    tags: ["survival", "resilience", "nature"],
    blurb: "A boy survives alone in the wilderness with only a hatchet. Grit beats luck.",
    whatYouLearn: [
      "You're stronger than you think.",
      "Small wins stack into survival.",
      "Panic is natural—staying focused is a skill."
    ],
    whatYouTellChild: [
      "You can do hard things, even when you're scared.",
      "Mistakes teach you what works."
    ]
  },
  {
    id: "number-stars",
    rank: 6,
    title: "Number the Stars",
    author: "Lois Lowry",
    amazonUrl: "#demo-disabled",
    stressDelta: -3,
    childEffects: { empathy: 0.2, courage: 0.1 },
    tags: ["courage", "friendship", "history"],
    blurb: "A girl helps her Jewish friend escape the Nazis. Quiet bravery in terrifying times.",
    whatYouLearn: [
      "Courage isn't the absence of fear—it's acting despite it.",
      "Small acts of kindness can save lives.",
      "History matters. Remembering prevents repeating."
    ],
    whatYouTellChild: [
      "Being brave means doing what's right even when it's scary.",
      "Friendship is a kind of courage."
    ]
  },
  {
    id: "holes",
    rank: 7,
    title: "Holes",
    author: "Louis Sachar",
    amazonUrl: "#demo-disabled",
    stressDelta: -3,
    childEffects: { curiosity: 0.2, responsibility: 0.1 },
    tags: ["justice", "mystery", "persistence"],
    blurb: "A boy is sent to a brutal detention camp. Digging holes reveals buried secrets and justice.",
    whatYouLearn: [
      "Justice may be delayed, but patterns eventually close.",
      "Persistence pays off—even when the payoff is hidden.",
      "Systems can be cruel, but people can break them."
    ],
    whatYouTellChild: [
      "Keep going even when things feel unfair.",
      "The truth has a way of coming out."
    ]
  },
  {
    id: "bridge-terabithia",
    rank: 8,
    title: "Bridge to Terabithia",
    author: "Katherine Paterson",
    amazonUrl: "#demo-disabled",
    stressDelta: -4,
    childEffects: { empathy: 0.3, creativity: 0.1 },
    tags: ["friendship", "loss", "imagination"],
    blurb: "Two kids build an imaginary kingdom. Then tragedy forces one to grow up fast.",
    whatYouLearn: [
      "Grief doesn't have a script.",
      "Imagination is powerful—but it doesn't protect you from reality.",
      "Love and loss are inseparable parts of connection."
    ],
    whatYouTellChild: [
      "It's okay to be sad when someone you love is gone.",
      "The people we love stay with us in the stories we remember."
    ]
  },
  {
    id: "wrinkle-in-time",
    rank: 9,
    title: "A Wrinkle in Time",
    author: "Madeleine L'Engle",
    amazonUrl: "#demo-disabled'Engle",
    stressDelta: -3,
    childEffects: { curiosity: 0.3, confidence: 0.1 },
    tags: ["adventure", "science", "courage"],
    blurb: "A girl travels through space and time to save her father. Love is the ultimate weapon.",
    whatYouLearn: [
      "Being different is a strength, not a flaw.",
      "Logic and love both matter.",
      "You don't have to be perfect to be brave."
    ],
    whatYouTellChild: [
      "Your quirks make you powerful.",
      "Love is stronger than fear."
    ]
  },
  {
    id: "where-red-fern-grows",
    rank: 10,
    title: "Where the Red Fern Grows",
    author: "Wilson Rawls",
    amazonUrl: "#demo-disabled",
    stressDelta: -4,
    childEffects: { empathy: 0.3, responsibility: 0.1 },
    tags: ["loyalty", "loss", "love"],
    blurb: "A boy and his two dogs. Deep loyalty, hard work, and devastating loss.",
    whatYouLearn: [
      "Love means showing up, even when it's hard.",
      "Loss is part of loving anything deeply.",
      "Loyalty is a quiet kind of strength."
    ],
    whatYouTellChild: [
      "When you love something, you take care of it.",
      "It's okay to cry when something you love is gone."
    ]
  }
];

export const LIBRARY_SECTIONS = [
  {
    id: "parenting",
    label: "Parenting",
    emoji: "👶",
    description: "Evidence-based parenting strategies. Each book grants a one-time stat bonus.",
    mode: "oneTime",
    books: PARENTING_BOOKS
  },
  {
    id: "selfHelp",
    label: "Self-Help",
    emoji: "🧠",
    description: "Personal growth and mental resilience. Each book grants a one-time stat bonus.",
    mode: "oneTime",
    books: SELF_HELP_BOOKS
  },
  {
    id: "fiction",
    label: "Fiction",
    emoji: "📖",
    description: "Classic stories you can read again and again. Each read reduces stress and sparks curiosity.",
    mode: "repeatable",
    books: FICTION_BOOKS
  }
];

export const LIBRARY_CATALOG = LIBRARY_SECTIONS.flatMap(section =>
  section.books.map(book => ({
    ...book,
    sectionId: section.id,
    sectionLabel: section.label,
    sectionMode: section.mode
  }))
);
