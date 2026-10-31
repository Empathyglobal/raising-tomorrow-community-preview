export const RV_TRIPS = [
  {
    id: 'rv_weekend_reset',
    emoji: '🏕️',
    title: 'Weekend Campground Reset',
    tagline: 'Two nights. Zero emails. Maximum snacks.',
    minTier: 1,
    baseCost: 250,
    withKid: { deltas: { happiness: 4, confidence: 2, curiosity: 2 }, loveDelta: 3, stressDelta: -3 },
    solo: { deltas: { happiness: 3, confidence: 2, discipline: 1 }, loveDelta: 0, stressDelta: -4 }
  },
  {
    id: 'rv_national_park_loop',
    emoji: '🏞️',
    title: 'National Park Loop',
    tagline: 'Big views. Small problems.',
    minTier: 1,
    baseCost: 500,
    withKid: { deltas: { curiosity: 4, knowledge: 3, fitness: 2, empathy: 1 }, loveDelta: 4, stressDelta: -4 },
    solo: { deltas: { curiosity: 3, knowledge: 2, fitness: 2 }, loveDelta: 0, stressDelta: -5 }
  },
  {
    id: 'rv_starry_desert_night',
    emoji: '🌌',
    title: 'Starry Desert Night',
    tagline: 'The sky does emotional healing for free.',
    minTier: 2,
    baseCost: 450,
    withKid: { deltas: { intelligence: 2, curiosity: 4, knowledge: 2, confidence: 2 }, loveDelta: 3, stressDelta: -4 },
    solo: { deltas: { intelligence: 2, curiosity: 3, confidence: 2 }, loveDelta: 0, stressDelta: -5 }
  },
  {
    id: 'rv_coastal_cruise',
    emoji: '🌊',
    title: 'Coastal Cruise',
    tagline: 'Ocean air, playlist therapy.',
    minTier: 2,
    baseCost: 700,
    withKid: { deltas: { happiness: 4, fitness: 2, social: 2, confidence: 2 }, loveDelta: 4, stressDelta: -4 },
    solo: { deltas: { happiness: 4, fitness: 2, social: 2 }, loveDelta: 0, stressDelta: -5 }
  },
  {
    id: 'rv_grand_tour',
    emoji: '🗺️',
    title: 'The Grand Tour',
    tagline: 'A legendary road trip arc. Main character energy.',
    minTier: 3,
    baseCost: 1800,
    withKid: { deltas: { happiness: 6, confidence: 4, curiosity: 4, discipline: 2, knowledge: 3 }, loveDelta: 5, stressDelta: -6 },
    solo: { deltas: { happiness: 5, confidence: 4, curiosity: 3, discipline: 2 }, loveDelta: 0, stressDelta: -7 }
  }
];