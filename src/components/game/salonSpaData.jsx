// Self-Care activities (grooming, relaxation, and small confidence boosts).
// Each option costs 1 Focus + money, and may produce a funny backfire.

export const SELF_CARE_SERVICES = [
  {
    id: "quick_trim",
    emoji: "💇",
    title: "Hair Refresh",
    subtitle: "A simple trim. Less chaos. Slightly more swagger.",
    minAge: 0,
    cost: 35,
    effects: {
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
      loveDelta: 0,
      stressDelta: 0,
      peerCircleDelta: 0,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "fresh",
        weight: 70,
        text: "They keep checking their reflection like they're on a magazine cover.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 0,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "wiggles",
        weight: 20,
        text: "They squirm the whole time. You leave with a refresh and a workout.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "oops",
        weight: 10,
        tag: "negative",
        text: "It is… not the vision. Hats become a lifestyle for a week.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: -1 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: -1,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "massage_parent",
    emoji: "💆",
    title: "Unplug & Reset (You)",
    subtitle: "You unplug for an hour. Your shoulders file a complaint—and then resign.",
    minAge: 0,
    cost: 120,
    effects: {
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
      loveDelta: 0,
      stressDelta: -3,
      peerCircleDelta: 0,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "nap",
        weight: 85,
        text: "You fall asleep instantly. The therapist pretends not to notice. It's the kindest lie.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: -1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "phone_buzz",
        weight: 15,
        tag: "negative",
        text: "Your phone buzzes the whole time. Your body relaxes, your brain absolutely does not.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "braids",
    emoji: "🧵",
    title: "Hair Care Session",
    subtitle: "A longer appointment, but they leave feeling put-together.",
    minAge: 2,
    cost: 60,
    effects: {
      deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 1 },
      loveDelta: 0,
      stressDelta: 0,
      peerCircleDelta: 0,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "proud",
        weight: 80,
        text: "They sit still like a champ and walk out glowing with pride.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 1,
          stressDelta: 0,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "too_tight",
        weight: 20,
        tag: "negative",
        text: "Halfway through, they decide the chair is lava and the style is oppression.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: -1, confidence: -1 },
          loveDelta: 0,
          stressDelta: 2,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "spa_day_together",
    emoji: "🫧",
    title: "Cozy Care Day Together",
    subtitle: "Kid-friendly self-care: masks, cucumber slices, and giggling.",
    minAge: 3,
    cost: 90,
    effects: {
      deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
      loveDelta: 1,
      stressDelta: -2,
      peerCircleDelta: 0,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "silly_selfcare",
        weight: 80,
        text: "They giggle through the whole thing and tell you, very seriously, that self-care is important.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: -1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "slippery",
        weight: 20,
        tag: "negative",
        text: "A cucumber slice hits the floor and the world becomes an ice rink for exactly one terrifying second.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "style_refresh",
    emoji: "✨",
    title: "Confidence Boost Style",
    subtitle: "A more intentional look. Think: fresh start energy.",
    minAge: 11,
    cost: 95,
    effects: {
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 2 },
      loveDelta: 0,
      stressDelta: -1,
      peerCircleDelta: 1,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "wow",
        weight: 70,
        text: "They step out like they have a theme song.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 0,
          peerCircleDelta: 1,
          teacherTrustDelta: 0
        }
      },
      {
        id: "teacher_comment",
        weight: 20,
        text: "A teacher raises an eyebrow, but your kid doesn't flinch.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 0,
          peerCircleDelta: 0,
          teacherTrustDelta: -1
        }
      },
      {
        id: "regret",
        weight: 10,
        tag: "negative",
        text: "By dinner they decide it is too much and ask if hair can be returned.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: -1 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: -1,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "nails",
    emoji: "💅",
    title: "Nail Care",
    subtitle: "A small luxury that somehow becomes a whole personality.",
    minAge: 12,
    cost: 55,
    effects: {
      deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 },
      loveDelta: 0,
      stressDelta: 0,
      peerCircleDelta: 1,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "compliments",
        weight: 75,
        text: "They spend the rest of the day giving everyone compliments to match the energy.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: -1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "smudge",
        weight: 25,
        tag: "negative",
        text: "They smudge one nail immediately and take it personally.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: -1, confidence: 0 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "facial",
    emoji: "🧖",
    title: "Skin Care Reset",
    subtitle: "A calm hour and a little glow (plus new vocabulary like exfoliate).",
    minAge: 13,
    cost: 80,
    effects: {
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
      loveDelta: 0,
      stressDelta: -1,
      peerCircleDelta: 0,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "calm",
        weight: 80,
        text: "They leave quieter than they arrived, like their brain got a soft reset too.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: -1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      },
      {
        id: "breakout",
        weight: 20,
        tag: "negative",
        text: "The next day, a tiny breakout appears and becomes a dramatic saga.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: -1 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: 0,
          teacherTrustDelta: 0
        }
      }
    ]
  },

  {
    id: "bold_color",
    emoji: "🟣",
    title: "Bold Change",
    subtitle: "A big look. Big confidence. Big opinions from strangers.",
    minAge: 15,
    cost: 150,
    effects: {
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 3 },
      loveDelta: 0,
      stressDelta: 0,
      peerCircleDelta: 1,
      teacherTrustDelta: 0
    },
    outcomes: [
      {
        id: "iconic",
        weight: 60,
        text: "It's iconic. Their friends treat it like a historical event.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 0,
          peerCircleDelta: 2,
          teacherTrustDelta: 0
        }
      },
      {
        id: "dress_code",
        weight: 25,
        text: "School has thoughts. You get a polite email with the energy of a threat.",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: 0,
          teacherTrustDelta: -2
        }
      },
      {
        id: "regret_48hrs",
        weight: 15,
        tag: "negative",
        text: "48 hours later: I think I want to go back. (You do not have a time machine.)",
        effects: {
          deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: -2 },
          loveDelta: 0,
          stressDelta: 1,
          peerCircleDelta: -1,
          teacherTrustDelta: 0
        }
      }
    ]
  }
];