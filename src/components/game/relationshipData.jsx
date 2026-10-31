import { COMEDY_TALK_TOPICS, COMEDY_COMPLIMENTS } from './relationshipComedyPack';
// Relationship System Data - Names, Notes, Topics, Compliments

export const PARTNER_NAMES = [
  "Alex", "Jordan", "Casey", "Morgan", "Taylor", "Riley", "Quinn", "Jamie",
  "Avery", "Skyler", "Dakota", "Sage", "Cameron", "Drew", "Finley", "Rowan",
  "Reese", "Blake", "Parker", "Phoenix", "River", "Kai", "Hayden", "Emerson"
];

// Adult friends (your own relationships)
export const ADULT_FRIEND_NAMES = [
  "Riley", "Harper", "Cameron", "Ari", "Jules", "Noah", "Maya", "Elijah",
  "Sienna", "Logan", "Chloe", "Ethan", "Nora", "Owen", "Ivy", "Miles",
  "Lena", "Theo", "Zara", "Caleb", "Sofia", "Mateo", "Aisha", "Priya"
];

export const MOM_NAMES = [
  "Linda", "Maria", "Susan", "Patricia", "Nancy", "Jennifer", "Barbara", "Karen",
  "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Dorothy", "Donna", "Carol",
  "Ruth", "Sharon", "Michelle", "Laura", "Angela", "Deborah", "Brenda", "Amy"
];

export const DAD_NAMES = [
  "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
  "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew",
  "Joshua", "Kenneth", "Kevin", "Brian", "George", "Edward", "Ronald", "Timothy"
];

export const SIBLING_NAMES = [
  "Chris", "Sam", "Pat", "Terry", "Lee", "Drew", "Max", "Lou",
  "Jesse", "Frankie", "Robbie", "Stevie", "Charlie", "Billie", "Ash", "Kai",
  "River", "Quinn", "Blake", "Sage", "Morgan", "Riley", "Jordan", "Casey",
  "Taylor", "Avery", "Parker", "Skyler", "Dakota", "Finley", "Rowan", "Phoenix"
];

export const ADULT_EMOJI_POOL = [
  "👨", "👩", "🧑", "👨‍🦰", "👩‍🦰", "🧑‍🦰", "👨‍🦱", "👩‍🦱", "🧑‍🦱",
  "👨‍🦳", "👩‍🦳", "🧑‍🦳", "👨‍🦲", "👩‍🦲", "🧑‍🦲"
];

export const CHILD_NOTES_POOL = [
  "Your whole heart, walking around",
  "Tiny human, huge feelings",
  "Still learning everything",
  "Chaos with a face",
  "Your favorite disaster",
  "Trying their best (mostly)",
  "Your legacy in motion",
  "Growing faster than you're ready for",
  "Pure unfiltered personality",
  "Your teacher disguised as a student",
  "One day calm, next day storm",
  "Learning trust by testing it",
  "Your mirror (terrifying)",
  "Built different (literally)",
  "Your second chance at childhood"
];

export const PARTNER_NOTES_POOL = [
  "Your co-pilot in chaos",
  "The one who stays",
  "Different stress language, same team",
  "Your calm when you're not",
  "The other adult in the room",
  "Still figuring it out together",
  "Your favorite debate partner",
  "Holds the other end of everything",
  "Loves you through the mess",
  "Your chosen teammate",
  "Different parenting styles, shared kid",
  "The one who gets it",
  "Your anchor when you drift",
  "Still learning each other",
  "The partnership that holds it all"
];

export const FAMILY_NOTES_POOL = [
  "History you didn't choose",
  "Complicated, like all families",
  "Distance doesn't erase DNA",
  "Your original home base",
  "The people who knew you first",
  "Supportive in their own way",
  "Love with conditions (sometimes)",
  "They tried with what they had",
  "Your first teachers of everything",
  "Patterns start here",
  "The roots you can't fully escape",
  "Warmth mixed with old wounds",
  "They show up when it counts",
  "Still teaching you things",
  "Your first relationship practice",
  "The baseline you measure against",
  "Love is assumed, not always shown",
  "They did better than their parents",
  "Generational echoes",
  "Your safety net (with holes)"
];

export const FRIEND_NOTES_POOL = [
  "Knows your whole backstory and still likes you",
  "The one who sends memes as medical care",
  "Will hype you up, then tell you the truth",
  "Low-drama, high-loyalty",
  "Shows up with snacks when things get hard",
  "You can go months without talking and it's still real",
  "The \"call me if you need anything\" who actually means it",
  "Has seen you spiral and said: \"Okay, drink water first\"",
  "Makes boring errands feel like a field trip",
  "Keeps your secrets like they're their own"
];

// Talk topics by role and age
export const TALK_TOPICS = {
  child: {
    "0_2": [
      "Narrate the world",
      "Sing & soothe",
      "Mirror their feeling",
      "Quiet cuddle"
    ],
    "3_8": [
      "Ask about feelings",
      "Story time",
      "Listen (no fixing)",
      "Do a tiny check-in"
    ],
    "9_13": [
      "Check in on their day",
      "Ask (don't interrogate)",
      "Listen to their playlist",
      "Share a memory"
    ],
    "14_18": [
      "Ask about their world",
      "Listen without fixing",
      "Share your own struggle",
      "Respect their space, stay close"
    ]
  },
  partner: [
    "Check-in",
    "Express gratitude",
    "Plan something small together",
    "Hard talk, gentle tone"
  ],
  family: [ // my_mom, my_dad, sibling
    "Call to vent",
    "Share a kid photo",
    "Ask advice",
    "Just say hi"
  ],
  friends: [
    "Catch up on life stuff",
    "Vent (responsibly)",
    "Share a win you're proud of",
    "Ask for real advice",
    "Laugh about something dumb",
    "Talk about parenting chaos",
    "Plan a low-key hangout",
    "Send memes back and forth"
  ],
  community: [ // teacher, best_friend
    "Check-in about progress",
    "Share appreciation",
    "Ask for insight",
    "Build the bridge"
  ]
};

// Compliments by role
export const COMPLIMENTS = {
  child: [
    "I saw you try.",
    "You're learning.",
    "I'm proud of your effort.",
    "I love being your parent."
  ],
  partner: [
    "Thank you for showing up.",
    "I notice what you carry.",
    "You matter to me.",
    "We're a team."
  ],
  family: [
    "I appreciate you.",
    "Thanks for being in my corner.",
    "You taught me something.",
    "I'm glad you're family."
  ],
  friends: [
    "You make life feel lighter.",
    "I'm really grateful you're in my corner.",
    "You show up in ways that matter.",
    "You're solid. Seriously.",
    "You're the kind of friend I want to keep.",
    "Thanks for being patient with me lately.",
    "You always know how to make me laugh."
  ],
  community: [
    "Thank you for caring.",
    "You make a difference.",
    "I see your effort.",
    "We're grateful for you."
  ]
};

// Get talk topics for person
export function getTalkTopics(person, childAge) {
  // Keep child age brackets exactly the same
  if (person.role === "child") {
    if (childAge <= 2) return TALK_TOPICS.child["0_2"];
    if (childAge <= 8) return TALK_TOPICS.child["3_8"];
    if (childAge <= 13) return TALK_TOPICS.child["9_13"];
    return TALK_TOPICS.child["14_18"];
  }
  // For ALL non-child roles, use the comedy pack
  return COMEDY_TALK_TOPICS;
}

// Get compliments for person
export function getCompliments(person) {
  // Keep child compliments as-is
  if (person.role === "child") return COMPLIMENTS.child;
  // For ALL non-child roles, use the comedy pack
  return COMEDY_COMPLIMENTS;
}