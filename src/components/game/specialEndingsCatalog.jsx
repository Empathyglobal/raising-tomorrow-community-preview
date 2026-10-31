// Special Endings Catalog - For Test Mode Explorer
// Maps ending IDs to display metadata and deterministic forcing logic

export const SPECIAL_ENDINGS_CATALOG = [
  // Main special/legendary endings (forceTopBadge)
  {
    id: 'MARS_PIONEER',
    title: '🏆 Legendary: First Human on Mars',
    category: 'Legendary',
    topBadge: '🏆 Legendary: First Human on Mars',
    trophyId: 'mars_pioneer',
    emoji: '🏆',
    description: 'Become the first human to set foot on Mars',
    forceMethod: 'topBadge'
  },
  {
    id: 'HERO_PRESIDENT',
    title: '🗳️ Legendary: The President (Listener)',
    category: 'Legendary',
    topBadge: '🗳️ Legendary: The President (Listener)',
    trophyId: 'hero_president',
    emoji: '🗳️',
    description: 'Win the presidency with Listen-First leadership',
    forceMethod: 'topBadge'
  },
  {
    id: 'ASTEROID_TYCOON',
    title: '☄️ Legendary: Asteroid Tycoon',
    category: 'Legendary',
    topBadge: '☄️ Legendary: Asteroid Tycoon',
    trophyId: 'asteroid_tycoon',
    emoji: '☄️',
    description: 'Mine asteroids and achieve absurd wealth',
    forceMethod: 'topBadge'
  },
  {
    id: 'TIME_TRAVELER',
    title: '⏳ Legendary: Time Traveler',
    category: 'Legendary',
    topBadge: '⏳ Legendary: Time Traveler',
    trophyId: 'time_traveler',
    emoji: '⏳',
    description: 'Vanish into time with reckless genius',
    forceMethod: 'topBadge'
  },
  {
    id: 'SUPERVILLAIN_ARC',
    title: '🧨 Legendary: Supervillain Arc',
    category: 'Legendary',
    topBadge: '🧨 Legendary: Supervillain Arc',
    trophyId: 'supervillain_arc',
    emoji: '🧨',
    description: 'Build a megalaser and embrace the villain role',
    forceMethod: 'topBadge'
  },
  {
    id: 'BLOCKCRAFT_2',
    title: '🧱 Special: Blockcraft 2',
    category: 'Special',
    topBadge: '🧱 Special: Blockcraft 2',
    trophyId: 'blockcraft_2',
    emoji: '🧱',
    description: 'Create the wildly successful game sequel',
    forceMethod: 'topBadge'
  },
  {
    id: 'HUMAN_RESISTANCE',
    title: '🤖 Secret: Human Resistance',
    category: 'Secret',
    topBadge: '🤖 Secret: Human Resistance',
    trophyId: 'human_resistance',
    emoji: '🤖',
    description: 'Lead the resistance after AI apocalypse',
    forceMethod: 'flag',
    flagKey: 'launchCodesSold'
  },
  {
    id: 'WORLD_DESTROYER',
    title: '🧟 Secret: World Destroyer',
    category: 'Secret',
    topBadge: '🧟 Secret: World Destroyer',
    trophyId: 'world_destroyer',
    emoji: '🧟',
    description: 'Nearly unleash a fictional zombie plague (stopped before harm)',
    forceMethod: 'topBadge'
  },
  {
    id: 'NOBEL_TIER',
    title: '🏆 Legendary: Nobel‑Tier Scientist',
    category: 'Legendary',
    topBadge: '🏆 Legendary: Nobel‑Tier Scientist',
    trophyId: 'nobel_tier_scientist',
    emoji: '🧠',
    description: 'Turn curiosity into Nobel-level discoveries',
    forceMethod: 'topBadge'
  },
  {
    id: 'OLYMPIC_MEDALIST',
    title: '🏆 Legendary: Olympic Medalist',
    category: 'Legendary',
    topBadge: '🏆 Legendary: Olympic Medalist',
    trophyId: 'olympic_medalist',
    emoji: '🏅',
    description: 'Stand on the podium with gold',
    forceMethod: 'topBadge'
  },
  {
    id: 'PEACEMAKER',
    title: '🏆 Legendary: Peacemaker',
    category: 'Legendary',
    topBadge: '🏆 Legendary: Peacemaker',
    trophyId: 'peacemaker',
    emoji: '🕊️',
    description: 'End conflicts through empathy and skill',
    forceMethod: 'topBadge'
  },
  {
    id: 'MEDIA_MOGUL',
    title: '🏆 Legendary: Media Mogul',
    category: 'Legendary',
    topBadge: '🏆 Legendary: Media Mogul',
    trophyId: 'media_mogul',
    emoji: '📺',
    description: 'Build a media empire from attention + storytelling',
    forceMethod: 'topBadge'
  },
  {
    id: 'KINGMAKER',
    title: '🏆 Legendary: Kingmaker',
    category: 'Legendary',
    topBadge: '🏆 Legendary: Kingmaker',
    trophyId: 'kingmaker',
    emoji: '🗳️',
    description: 'Wield power without needing the throne',
    forceMethod: 'topBadge'
  },
  {
    id: 'MEME_ICON',
    title: '✨ Special: Meme Icon',
    category: 'Special',
    topBadge: '✨ Special: Meme Icon',
    trophyId: 'meme_icon',
    emoji: '🤡',
    description: 'Become permanently viral (and learn to live with it)',
    forceMethod: 'topBadge'
  },
  {
    id: 'DYNASTY_BUILDER',
    title: '🏆 Legendary: Dynasty Builder',
    category: 'Legendary',
    topBadge: '🏆 Legendary: Dynasty Builder',
    trophyId: 'dynasty_builder',
    emoji: '🏰',
    description: 'Build generational wealth + legacy',
    forceMethod: 'topBadge'
  },
  
  // Special Start endings (force via specialStartId + stats)
  {
    id: 'WAR_ZONE_TRAGIC',
    title: '💔 Special Start: War Zone (Tragic)',
    category: 'Special Start',
    endingCode: 'RT-GZ-TRAGIC',
    topBadge: '💔 Special Start: War Zone',
    emoji: '💔',
    description: 'War Zone start - tragic outcome',
    forceMethod: 'specialStart',
    specialStartId: 'war_zone',
    branch: 'tragic'
  },
  {
    id: 'WAR_ZONE_HOPE',
    title: '🕊️ Special Start: War Zone (Hope)',
    category: 'Special Start',
    endingCode: 'RT-GZ-HOPE',
    topBadge: '🕊️ Special Start: War Zone',
    emoji: '🕊️',
    description: 'War Zone start - hopeful outcome',
    forceMethod: 'specialStart',
    specialStartId: 'war_zone',
    branch: 'hope'
  },
  {
    id: 'REFUGEE_TRAGIC',
    title: '💔 Special Start: Refugee Camp (Tragic)',
    category: 'Special Start',
    endingCode: 'RT-SY-TRAGIC',
    topBadge: '💔 Special Start: Refugee Camp',
    emoji: '💔',
    description: 'Refugee Camp start - tragic outcome',
    forceMethod: 'specialStart',
    specialStartId: 'refugee_camp',
    branch: 'tragic'
  },
  {
    id: 'REFUGEE_HOPE',
    title: '🕊️ Special Start: Refugee Camp (Hope)',
    category: 'Special Start',
    endingCode: 'RT-SY-HOPE',
    topBadge: '🕊️ Special Start: Refugee Camp',
    emoji: '🕊️',
    description: 'Refugee Camp start - hopeful outcome',
    forceMethod: 'specialStart',
    specialStartId: 'refugee_camp',
    branch: 'hope'
  },
  {
    id: 'PRK_001_DYNASTY',
    title: '🟥 Insane Start: Dynasty Maintained',
    category: 'Special Start',
    endingCode: 'RT-PRK-001',
    topBadge: '🟥 Insane Start: Dynasty Maintained',
    emoji: '🟥',
    description: 'Kim start - maintain the dynasty',
    forceMethod: 'specialStart',
    specialStartId: 'kim_jong_un',
    branch: 'dynasty'
  },
  {
    id: 'PRK_002_OVERTHROWN',
    title: '🟦 Insane Start: Overthrown',
    category: 'Special Start',
    endingCode: 'RT-PRK-002',
    topBadge: '🟦 Insane Start: Overthrown',
    emoji: '🟦',
    description: 'Kim start - regime overthrown',
    forceMethod: 'specialStart',
    specialStartId: 'kim_jong_un',
    branch: 'overthrown'
  },
  {
    id: 'PRK_003_UNIFIER',
    title: '🟩 Insane Start: Elections & Unification',
    category: 'Special Start',
    endingCode: 'RT-PRK-003',
    topBadge: '🟩 Insane Start: Elections & Unification',
    emoji: '🟩',
    description: 'Kim start - democratic unification',
    forceMethod: 'specialStart',
    specialStartId: 'kim_jong_un',
    branch: 'unifier'
  }
];

export const CATEGORIES = ['All', 'Legendary', 'Special', 'Secret', 'Special Start'];
export const SORT_OPTIONS = [
  { value: 'az', label: 'A → Z' },
  { value: 'category', label: 'Category' }
];