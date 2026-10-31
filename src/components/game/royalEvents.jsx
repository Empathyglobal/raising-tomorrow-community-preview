// Data-driven Royal Events
// Safe, fictional tabloid-style events for heirs and monarchs

export const ROYAL_EVENTS = [
  {
    id: 'heir_garden_party',
    phase: 'heir',
    weight: 3,
    headlineTemplates: [
      "{title} {name} Spotted Sneaking Extra Scones at Garden Party",
      "Seconds? Tabloids Count {title} {name}'s Scone Score"
    ],
    bodyTemplates: [
      "At a low-key palace garden party in {country}, {title} {name} found the dessert table irresistible.",
      "Courtiers pretend not to notice; cameras never blink."
    ],
    choices: [
      { label: "Laugh it off — they're good scones", effects: { moneyDelta: 0, reputationDelta: +3 }, followupHeadline: "Public Charms to Snack Honesty" },
      { label: "Issue a stern denial (about scones)", effects: { moneyDelta: 0, reputationDelta: -4 }, followupHeadline: "Denial Over Pastries Backfires" },
      { label: "Donate pastries to local shelter", effects: { moneyDelta: -200, reputationDelta: +6 } }
    ]
  },
  {
    id: 'heir_bus_ride',
    phase: 'heir',
    weight: 2,
    headlineTemplates: [
      "Royal On a Bus?! {title} {name} Rides Public Transit",
      "Commuter Crowns: {title} {name} Taps Card on Line 7"
    ],
    bodyTemplates: [
      "A surprise appearance on public transit in {country} has social media applauding.",
      "One rider says, 'They stood, they swayed, they smiled. Iconic.'"
    ],
    choices: [
      { label: "Pose for selfies", effects: { moneyDelta: 0, reputationDelta: +5 } },
      { label: "Keep low profile", effects: { moneyDelta: 0, reputationDelta: +1 } },
      { label: "Pay everyone's fare", effects: { moneyDelta: -500, reputationDelta: +7 }, followupHeadline: "Royal Tap Pays It Forward" }
    ]
  },
  {
    id: 'heir_school_visit',
    phase: 'heir',
    weight: 2,
    headlineTemplates: [
      "{title} {name} Reads to First Graders, Adorable Chaos Ensues",
      "Small Chairs, Big Crown Energy at {country} School"
    ],
    bodyTemplates: [
      "Story time revealed: crowns and crayons mix beautifully.",
      "A new favorite word learned: 'abdicate' (yikes)."
    ],
    choices: [
      { label: "Donate books", effects: { moneyDelta: -800, reputationDelta: +6 } },
      { label: "Send thank-you notes", effects: { moneyDelta: 0, reputationDelta: +2 } }
    ]
  },
  {
    id: 'heir_puppy_parade',
    phase: 'heir',
    weight: 2,
    headlineTemplates: [
      "Puppy Parade! {title} {name} Leads Wagging Procession",
      "Royal Treats Cause Sit/Stay Frenzy"
    ],
    bodyTemplates: [
      "Puppies adore {title} {name}. So do cameras.",
      "The palace carpets, however, are filing a complaint."
    ],
    choices: [
      { label: "Adopt one more pup", effects: { moneyDelta: -300, reputationDelta: +4 } },
      { label: "Sponsor vet day", effects: { moneyDelta: -1200, reputationDelta: +7 } },
      { label: "Smile and wave", effects: { moneyDelta: 0, reputationDelta: +1 } }
    ]
  },
  {
    id: 'heir_jogging',
    phase: 'heir',
    weight: 1,
    headlineTemplates: [
      "{title} {name} Jogging: Palace Guards Get Cardio Too",
      "Sneakers with Suits? Royal Athleisure Debate"
    ],
    bodyTemplates: [
      "A brisk run near the palace sparks a fashion thread.",
      "Courtiers add 'hydration czar' to their titles."
    ],
    choices: [
      { label: "Post training tips", effects: { moneyDelta: 0, reputationDelta: +3 } },
      { label: "Private routine", effects: { moneyDelta: 0, reputationDelta: +0 } }
    ]
  },
  // Monarch events
  {
    id: 'monarch_balcony_wave',
    phase: 'monarch',
    weight: 3,
    headlineTemplates: [
      "{title} {name} Delivers Legendary Balcony Wave",
      "Crowd Swoons as {title} {name} Masters the Wrist"
    ],
    bodyTemplates: [
      "In {country}, the balcony wave meets its golden age.",
      "Critics call it 'majestic minimalism.'"
    ],
    choices: [
      { label: "Longer balcony time", effects: { moneyDelta: 0, reputationDelta: +4 } },
      { label: "Quick appearance", effects: { moneyDelta: 0, reputationDelta: +1 } }
    ]
  },
  {
    id: 'monarch_market_visit',
    phase: 'monarch',
    weight: 2,
    headlineTemplates: [
      "Monarch Haggles: {title} {name} Negotiates Mango Price",
      "Royal Bargain? Market Laughs with {title} {name}"
    ],
    bodyTemplates: [
      "A cheerful stop at {country}'s street market charms vendors.",
      "The mangoes win; diplomacy also wins."
    ],
    choices: [
      { label: "Buy a round of fruit", effects: { moneyDelta: -250, reputationDelta: +5 } },
      { label: "Pose with vendors", effects: { moneyDelta: 0, reputationDelta: +3 } }
    ]
  },
  {
    id: 'monarch_stadium',
    phase: 'monarch',
    weight: 2,
    headlineTemplates: [
      "Stadium Roars for {title} {name}; Mascot Bows",
      "Royal Coin Toss Goes Viral"
    ],
    bodyTemplates: [
      "Home team blessed; rivals slightly nervous.",
      "Mascot requests a tiny tiara; approved."
    ],
    choices: [
      { label: "Charity halftime", effects: { moneyDelta: -1500, reputationDelta: +7 } },
      { label: "Meet youth team", effects: { moneyDelta: 0, reputationDelta: +4 } },
      { label: "Private box", effects: { moneyDelta: -400, reputationDelta: +1 } }
    ]
  },
  {
    id: 'monarch_rain_walk',
    phase: 'monarch',
    weight: 1,
    headlineTemplates: [
      "Umbrella Diplomacy: {title} {name} Shares Cover",
      "Rainy Day, Sunny Reputation"
    ],
    bodyTemplates: [
      "A soaked stroll in {country} becomes a kindness montage.",
      "The umbrella salutes the crown."
    ],
    choices: [
      { label: "Give umbrella to stranger", effects: { moneyDelta: -30, reputationDelta: +6 } },
      { label: "Royal rain boots", effects: { moneyDelta: -120, reputationDelta: +2 } }
    ]
  },
  {
    id: 'monarch_library',
    phase: 'monarch',
    weight: 1,
    headlineTemplates: [
      "{title} {name} Declares: 'Story Time Is Statecraft'",
      "Palace Library See Busiest Day"
    ],
    bodyTemplates: [
      "Books and crowns pair surprisingly well.",
      "Librarians knighted (in spirit)."
    ],
    choices: [
      { label: "Fund reading hour", effects: { moneyDelta: -800, reputationDelta: +6 } },
      { label: "Quiet visit", effects: { moneyDelta: 0, reputationDelta: +1 } }
    ]
  }
];