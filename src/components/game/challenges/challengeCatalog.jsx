// Challenge catalog for Raising Tomorrow.
//
// Design goals:
// - 30 toggleable challenges
// - Auto-complete when objectives are met
// - Each completion awards 20 diamonds (handled by GameStateContext)
//
// NOTE: Keep objectives limited to data that already exists in gameState to avoid hard-blocks.

export const CHALLENGE_REWARD_DIAMONDS = 20;

/**
 * Objective Types supported by challengeEngine.js
 *
 * - ACTION_COUNT_AT_LEAST: { actionId, target }
 * - STAT_AT_LEAST: { stat, target }
 * - LOVE_AT_LEAST: { target }
 * - STRESS_AT_MOST: { target }
 * - PLAYER_HEALTH_AT_LEAST: { target }
 * - TEACHER_TRUST_AT_LEAST: { target }
 * - PEER_CIRCLE_AT_LEAST: { target }
 * - PASSPORT_STAMPS_AT_LEAST: { target }
 * - MODULES_STUDIED_AT_LEAST: { target }
 * - INVENTORY_ITEMS_AT_LEAST: { target }
 * - MONEY_AT_LEAST: { target }
 * - RETIREMENT_AT_LEAST: { target }
 * - PETS_AT_LEAST: { target }
 * - PET_BOND_AT_LEAST: { target }
 * - CULTURE_PLAN_SET: {}
 * - CULTURE_POINTS_AT_LEAST: { target }
 * - CULTURE_STREAK_WEEKS_AT_LEAST: { target }
 * - WISDOM_XP_AT_LEAST: { lensId, target }
 * - WISDOM_CLARITY_AT_LEAST: { target }
 * - SOCIAL_POSTS_AT_LEAST: { target }
 * - SOCIAL_FOLLOWERS_AT_LEAST: { target }
 * - SOCIAL_VERIFIED_ANY: {}
 * - SOCIAL_MONETIZED_ANY: {}
 * - CAREER_LEVEL_AT_LEAST: { target }
 * - CAREER_INCOME_AT_LEAST: { target }
 * - CAREER_NETWORKING_AT_LEAST: { target }
 * - REACH_AGE_AT_LEAST: { target }
 * - FLAG_TRUE: { path }
 */

export const CHALLENGE_CATALOG = [
  {
    id: 'bond_3',
    title: 'Heart-to-Heart Starter',
    description: 'Bond with your child 3 times.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Bond',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'bond', target: 3 }
    ]
  },
  {
    id: 'play_3',
    title: 'Playtime Regular',
    description: 'Play with your child 3 times.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Bond',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'play', target: 3 }
    ]
  },
  {
    id: 'bond_and_play',
    title: 'Connection Combo',
    description: 'Bond 2 times and Play 2 times.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Bond',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'bond', target: 2 },
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'play', target: 2 }
    ]
  },
  {
    id: 'routine_5',
    title: 'Routine Builder',
    description: 'Do 5 “Routine” actions (the boring stuff that builds stability).',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Wellbeing',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'routine', target: 5 }
    ]
  },
  {
    id: 'mindbody_4',
    title: 'Mind-Body Momentum',
    description: 'Do Mind/Body 4 times.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Wellbeing',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'mindBody', target: 4 }
    ]
  },
  {
    id: 'outings_3',
    title: 'Out and About',
    description: 'Take 3 Outings.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Life',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'outings', target: 3 }
    ]
  },
  {
    id: 'playdates_2',
    title: 'Playdate Planner',
    description: 'Set up 2 Playdates.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Social',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'playdates', target: 2 }
    ]
  },
  {
    id: 'study_5',
    title: 'Study Streak',
    description: 'Study 5 times.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Learning',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'study', target: 5 }
    ]
  },
  {
    id: 'passport_3',
    title: 'Little Explorer',
    description: 'Collect 3 Passport stamps.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Life',
    objectives: [
      { type: 'PASSPORT_STAMPS_AT_LEAST', target: 3 }
    ]
  },
  {
    id: 'modules_4',
    title: 'Bookshelf Starter',
    description: 'Study 4 modules (fills your Bookshelf).',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Learning',
    objectives: [
      { type: 'MODULES_STUDIED_AT_LEAST', target: 4 }
    ]
  },
  {
    id: 'inventory_10',
    title: 'Little Collector',
    description: 'Own 10 inventory items.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Collection',
    objectives: [
      { type: 'INVENTORY_ITEMS_AT_LEAST', target: 10 }
    ]
  },
  {
    id: 'stress_20',
    title: 'Keep It Chill',
    description: 'Get Stress down to 20 or less.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Wellbeing',
    objectives: [
      { type: 'STRESS_AT_MOST', target: 20 }
    ]
  },
  {
    id: 'love_80',
    title: 'Love Overflow',
    description: 'Reach Love 80 or higher.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Bond',
    objectives: [
      { type: 'LOVE_AT_LEAST', target: 80 }
    ]
  },
  {
    id: 'parent_health_85',
    title: 'Healthy Parent, Healthy Home',
    description: 'Reach Parent Health 85 or higher.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Wellbeing',
    objectives: [
      { type: 'PLAYER_HEALTH_AT_LEAST', target: 85 }
    ]
  },
  {
    id: 'teacher_trust_75',
    title: 'Teacher’s Pet',
    description: 'Raise Teacher Trust to 75 or higher.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'School',
    objectives: [
      { type: 'TEACHER_TRUST_AT_LEAST', target: 75 }
    ]
  },
  {
    id: 'peer_circle_75',
    title: 'Social Butterfly',
    description: 'Raise Peer Circle to 75 or higher.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'School',
    objectives: [
      { type: 'PEER_CIRCLE_AT_LEAST', target: 75 }
    ]
  },
  {
    id: 'pet_1',
    title: 'Pet Parent',
    description: 'Adopt at least 1 pet.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Life',
    objectives: [
      { type: 'PETS_AT_LEAST', target: 1 }
    ]
  },
  {
    id: 'pet_bond_40',
    title: 'Pet Whisperer',
    description: 'Get any pet bond to 40 or higher.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Life',
    objectives: [
      { type: 'PET_BOND_AT_LEAST', target: 40 }
    ]
  },
  {
    id: 'culture_plan',
    title: 'Roots & Rituals',
    description: 'Create a Culture & Heritage plan.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Culture',
    objectives: [
      { type: 'CULTURE_PLAN_SET' }
    ]
  },
  {
    id: 'culture_points_200',
    title: 'Culture Builder',
    description: 'Earn 200 total Culture points.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Culture',
    objectives: [
      { type: 'CULTURE_POINTS_AT_LEAST', target: 200 }
    ]
  },
  {
    id: 'wisdom_mindfulness_50',
    title: 'Mindfulness Practice',
    description: 'Reach 50 Mindfulness XP.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Wisdom',
    objectives: [
      { type: 'WISDOM_XP_AT_LEAST', lensId: 'mindfulness', target: 50 }
    ]
  },
  {
    id: 'wisdom_compassion_50',
    title: 'Compassion Practice',
    description: 'Reach 50 Compassion XP.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Wisdom',
    objectives: [
      { type: 'WISDOM_XP_AT_LEAST', lensId: 'compassion', target: 50 }
    ]
  },
  {
    id: 'clarity_10',
    title: 'Clarity Saver',
    description: 'Accumulate 10 Clarity.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Wisdom',
    objectives: [
      { type: 'WISDOM_CLARITY_AT_LEAST', target: 10 }
    ]
  },
  {
    id: 'social_posts_5',
    title: 'Posting Rhythm',
    description: 'Make 5 social media posts total.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Social',
    objectives: [
      { type: 'SOCIAL_POSTS_AT_LEAST', target: 5 }
    ]
  },
  {
    id: 'social_followers_2000',
    title: 'Small Audience, Real People',
    description: 'Reach 2,000 total followers across platforms.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Social',
    objectives: [
      { type: 'SOCIAL_FOLLOWERS_AT_LEAST', target: 2000 }
    ]
  },
  {
    id: 'social_monetize_any',
    title: 'Monetize a Platform',
    description: 'Turn on monetization on any social platform.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'hard',
    category: 'Social',
    objectives: [
      { type: 'SOCIAL_MONETIZED_ANY' }
    ]
  },
  {
    id: 'career_income_6000',
    title: 'Bigger Paycheck',
    description: 'Reach $6,000/year income in your career.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'medium',
    category: 'Career',
    objectives: [
      { type: 'CAREER_INCOME_AT_LEAST', target: 6000 }
    ]
  },
  {
    id: 'career_level_2',
    title: 'Career Climber',
    description: 'Reach career level 2 (two promotions up the ladder).',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'hard',
    category: 'Career',
    objectives: [
      { type: 'CAREER_LEVEL_AT_LEAST', target: 2 }
    ]
  },
  {
    id: 'donation_3',
    title: 'Generous Heart',
    description: 'Make 3 donations.',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'easy',
    category: 'Values',
    objectives: [
      { type: 'ACTION_COUNT_AT_LEAST', actionId: 'donation', target: 3 }
    ]
  },
  {
    id: 'briefcase_chain',
    title: 'The Briefcase Mystery',
    description: 'Complete the briefcase chain (rare).',
    rewardDiamonds: CHALLENGE_REWARD_DIAMONDS,
    difficulty: 'epic',
    category: 'Mystery',
    objectives: [
      { type: 'FLAG_TRUE', path: 'flags.briefcaseChainComplete' }
    ]
  }
];

export const CHALLENGE_BY_ID = Object.fromEntries(
  CHALLENGE_CATALOG.map(c => [c.id, c])
);