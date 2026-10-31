// Titles and Peerage Catalog + helpers

export const PEERAGE_ORDER = [
  'baron',
  'viscount',
  'earl',
  'marquess',
  'duke',
];

export const ROYAL_ORDER = [
  'prince',
  'crown_prince',
  'king',
];

export const TITLES_CATALOG = {
  // Peerage (common European-inspired)
  baron: { id: 'baron', label: 'Baron/Baroness', rank: 1, group: 'peerage' },
  viscount: { id: 'viscount', label: 'Viscount/Viscountess', rank: 2, group: 'peerage' },
  earl: { id: 'earl', label: 'Earl/Countess', rank: 3, group: 'peerage' },
  marquess: { id: 'marquess', label: 'Marquess/Marchioness', rank: 4, group: 'peerage' },
  duke: { id: 'duke', label: 'Duke/Duchess', rank: 5, group: 'peerage' },

  // Royal
  prince: { id: 'prince', label: 'Prince/Princess', rank: 6, group: 'royal' },
  crown_prince: { id: 'crown_prince', label: 'Crown Prince/Princess', rank: 7, group: 'royal' },
  king: { id: 'king', label: 'King/Queen', rank: 8, group: 'royal' },

  // PRK Dynasty (party-state)
  prk_inner_circle: { id: 'prk_inner_circle', label: 'Inner Circle', rank: 1, group: 'prk_dynasty' },
  prk_dynasty_family: { id: 'prk_dynasty_family', label: 'Dynasty Family', rank: 2, group: 'prk_dynasty' },
  prk_designated_successor: { id: 'prk_designated_successor', label: 'Designated Successor', rank: 3, group: 'prk_dynasty' },
  prk_supreme_leader: { id: 'prk_supreme_leader', label: 'Supreme Leader', rank: 4, group: 'prk_dynasty' },
};

export function getTitleInfo(id) {
  return TITLES_CATALOG[id] || null;
}

export function isRoyalTitle(id) {
  return getTitleInfo(id)?.group === 'royal';
}

export function getNextPeerageId(id) {
  const idx = PEERAGE_ORDER.indexOf(id);
  if (idx === -1) return null;
  if (idx >= PEERAGE_ORDER.length - 1) return null;
  return PEERAGE_ORDER[idx + 1];
}

export function courtesyForChild(parentTitleId, childAvatarGender = 'boy') {
  const info = getTitleInfo(parentTitleId);
  if (!info) return null;
  const isGirl = String(childAvatarGender || 'boy') === 'girl';
  if (info.group === 'royal') {
    return isGirl ? 'Princess' : 'Prince';
  }
  // Peerage courtesy (simplified)
  return isGirl ? 'Lady' : 'Lord';
}

// Monarchy/Dynastic actions (focus cost + optional influence/money)
export const TITLE_ACTIONS = [
  {
    id: 'public_engagement',
    label: 'Public Engagement',
    cost: { focus: 1, influence: 5 },
    effects: { meter: 4, reputation: 2 },
    description: 'Attend a ceremony and meet the public. Safe, polite, and visible.'
  },
  {
    id: 'charity_gala',
    label: 'Charity Gala',
    cost: { focus: 1, money: 800, influence: 5 },
    effects: { meter: 6, reputation: 4, child_empathy: 0.1 },
    description: 'Host a fundraiser for a good cause. Improves public standing.'
  },
  {
    id: 'state_function',
    label: 'Attend State Function',
    cost: { focus: 1, money: 500 },
    effects: { meter: 3, reputation: 1 },
    description: 'Formal event attendance. Slight boost to standing; opens doors.'
  },
  {
    id: 'etiquette_training_child',
    label: 'Etiquette Training (Child)',
    cost: { focus: 1, money: 300 },
    effects: { meter: 2, child_confidence: 0.2, child_discipline: 0.2 },
    description: 'Grace under pressure starts early. Small boosts to confidence and discipline.'
  },
  {
    id: 'arrange_marriage',
    label: 'Seek Marriage Alliance',
    cost: { focus: 1, influence: 20 },
    effects: { meter: 3, reputation: 2 },
    description: 'Discreet conversations about alliances. No promises, just tea and titles.'
  },
  {
    id: 'grant_minor_title',
    label: 'Grant a Minor Title',
    cost: { focus: 1, influence: 25 },
    effects: { meter: 5, create_allied_house: true },
    description: 'Reward loyal service by elevating a household. Builds a friendly ally.'
  },
  {
    id: 'petition_elevation',
    label: 'Petition for Elevation',
    cost: { focus: 1, influence: 100 },
    effects: { promote_tier: true, meter: -10, reputation: 3 },
    description: 'Spend hard-earned influence to be elevated one step in the peerage.'
  },

];

export const PRK_DYNASTY_ORDER = [
  'prk_inner_circle',
  'prk_dynasty_family',
  'prk_designated_successor',
  'prk_supreme_leader',
];

export function getNextPrkDynastyId(id) {
  const idx = PRK_DYNASTY_ORDER.indexOf(id);
  if (idx === -1 || idx >= PRK_DYNASTY_ORDER.length - 1) return null;
  return PRK_DYNASTY_ORDER[idx + 1];
}

export const PRK_ACTIONS = [
  {
    id: 'unity_tour',
    label: 'Unity Tour',
    cost: { focus: 1, influence: 5 },
    effects: { meter: 6, reputation: 2 },
    description: 'Regional visits to project stability and cohesion.'
  },
  {
    id: 'promote_loyalist',
    label: 'Promote Loyalist',
    cost: { focus: 1, influence: 15 },
    effects: { meter: 5, reputation: 1 },
    description: 'Elevate a trusted cadre to tighten inner-circle loyalty.'
  },
  {
    id: 'succession_spotlight_child',
    label: 'Succession Spotlight (Child)',
    cost: { focus: 1, influence: 25 },
    effects: { meter: 8, child_confidence: 0.3, prk_designate_child: true },
    description: 'Carefully curated appearance positioning the child as successor.'
  },
  {
    id: 'economic_showcase',
    label: 'Economic Showcase Project',
    cost: { focus: 1, money: 1200, influence: 10 },
    effects: { meter: 7, reputation: 3 },
    description: 'Highlight a model district or factory to signal progress.'
  },
  {
    id: 'public_statement',
    label: 'Public Statement',
    cost: { focus: 1 },
    effects: { meter: 3, reputation: 1 },
    description: 'Scripted address emphasizing unity and continuity.'
  },
];

// ===== Special Start Title Tracks =====
// Military Ranks
export const MILITARY_ORDER = [
  'mil_private',
  'mil_corporal',
  'mil_sergeant',
  'mil_lieutenant',
  'mil_captain',
  'mil_major',
  'mil_colonel',
  'mil_general'
];

// Survivor Ranks (Alien Invasion)
export const SURVIVOR_ORDER = [
  'surv_scavenger',
  'surv_shelter_keeper',
  'surv_resistance_runner',
  'surv_bunker_warden',
  'surv_last_legend'
];

// Underworld Ranks (Mafia)
export const UNDERWORLD_ORDER = [
  'uw_associate',
  'uw_soldier',
  'uw_capo',
  'uw_underboss',
  'uw_boss'
];

// Extend TITLES_CATALOG with scenario groups
Object.assign(TITLES_CATALOG, {
  // Military
  mil_private:    { id: 'mil_private', label: 'Private', rank: 10, group: 'military_rank' },
  mil_corporal:   { id: 'mil_corporal', label: 'Corporal', rank: 11, group: 'military_rank' },
  mil_sergeant:   { id: 'mil_sergeant', label: 'Sergeant', rank: 12, group: 'military_rank' },
  mil_lieutenant: { id: 'mil_lieutenant', label: 'Lieutenant', rank: 13, group: 'military_rank' },
  mil_captain:    { id: 'mil_captain', label: 'Captain', rank: 14, group: 'military_rank' },
  mil_major:      { id: 'mil_major', label: 'Major', rank: 15, group: 'military_rank' },
  mil_colonel:    { id: 'mil_colonel', label: 'Colonel', rank: 16, group: 'military_rank' },
  mil_general:    { id: 'mil_general', label: 'General', rank: 17, group: 'military_rank' },

  // Survivor
  surv_scavenger:         { id: 'surv_scavenger', label: 'Scavenger', rank: 20, group: 'survivor_rank' },
  surv_shelter_keeper:    { id: 'surv_shelter_keeper', label: 'Shelter Keeper', rank: 21, group: 'survivor_rank' },
  surv_resistance_runner: { id: 'surv_resistance_runner', label: 'Resistance Runner', rank: 22, group: 'survivor_rank' },
  surv_bunker_warden:     { id: 'surv_bunker_warden', label: 'Bunker Warden', rank: 23, group: 'survivor_rank' },
  surv_last_legend:       { id: 'surv_last_legend', label: 'Last Legend', rank: 24, group: 'survivor_rank' },

  // Underworld
  uw_associate:  { id: 'uw_associate', label: 'Associate', rank: 30, group: 'underworld_rank' },
  uw_soldier:    { id: 'uw_soldier', label: 'Soldier', rank: 31, group: 'underworld_rank' },
  uw_capo:       { id: 'uw_capo', label: 'Capo', rank: 32, group: 'underworld_rank' },
  uw_underboss:  { id: 'uw_underboss', label: 'Underboss', rank: 33, group: 'underworld_rank' },
  uw_boss:       { id: 'uw_boss', label: 'Boss', rank: 34, group: 'underworld_rank' },
});

export function getNextMilitaryId(id) {
  const i = MILITARY_ORDER.indexOf(id);
  return i >= 0 && i < MILITARY_ORDER.length - 1 ? MILITARY_ORDER[i + 1] : null;
}
export function getNextSurvivorId(id) {
  const i = SURVIVOR_ORDER.indexOf(id);
  return i >= 0 && i < SURVIVOR_ORDER.length - 1 ? SURVIVOR_ORDER[i + 1] : null;
}
export function getNextUnderworldId(id) {
  const i = UNDERWORLD_ORDER.indexOf(id);
  return i >= 0 && i < UNDERWORLD_ORDER.length - 1 ? UNDERWORLD_ORDER[i + 1] : null;
}

// Scenario-specific action sets
export const MILITARY_ACTIONS = [
  {
    id: 'drill_routines',
    label: 'Drill Routines (Home)',
    cost: { focus: 1 },
    effects: { meter: 4, reputation: 1, child_discipline: 0.2, child_confidence: 0.1 },
    description: 'Turn chaos into routine. Not glamorous, extremely effective.'
  },
  {
    id: 'base_community',
    label: 'Base Community Day',
    cost: { focus: 1, money: 150 },
    effects: { meter: 3, reputation: 2, child_social: 0.2, child_empathy: 0.1 },
    description: 'Make friends fast. The base runs on relationships.'
  },
  {
    id: 'promotion_packet',
    label: 'Promotion Packet',
    cost: { focus: 1, influence: 25 },
    effects: { promote_tier: true, meter: -8, reputation: 2 },
    description: 'Paperwork, performance, and a little luck.'
  },
  {
    id: 'language_sprint_child',
    label: 'Language Sprint (Child)',
    cost: { focus: 1, money: 120 },
    effects: { meter: 2, child_intelligence: 0.2, child_confidence: 0.2 },
    description: 'Fast adaptation for the next move.'
  },
];

export const SURVIVOR_ACTIONS = [
  {
    id: 'fortify_shelter',
    label: 'Fortify Shelter',
    cost: { focus: 1, money: 200 },
    effects: { meter: 5, alienThreatDelta: -8, reputation: 1 },
    awardHonor: '🏅 Bunker Architect',
    description: 'Boring upgrades. The kind that keeps you alive.'
  },
  {
    id: 'quiet_drills',
    label: 'Quiet Drills (Child)',
    cost: { focus: 1 },
    effects: { meter: 3, alienThreatDelta: -5, child_discipline: 0.2, child_confidence: 0.1 },
    awardHonor: '🏅 Silence Champion',
    description: 'Practice “silent mode” without turning life into fear.'
  },
  {
    id: 'scavenge_run',
    label: 'Scavenge Run',
    cost: { focus: 1 },
    effects: { meter: 4, alienThreatDelta: 3, reputation: 1 },
    moneyGain: 500,
    description: 'You come back with supplies. Also stress.'
  },
  {
    id: 'radio_watch',
    label: 'Radio Watch',
    cost: { focus: 1 },
    effects: { meter: 2, alienThreatDelta: -2, reputation: 1 },
    awardHonor: '🏅 Radio Whisperer',
    description: 'Information is the only luxury left.'
  },
  {
    id: 'rank_up',
    label: 'Claim Survivor Rank',
    cost: { focus: 1, influence: 30 },
    effects: { promote_tier: true, meter: -10, reputation: 2 },
    description: 'Others trust you more. That’s power now.'
  },
];

export const UNDERWORLD_ACTIONS = [
  {
    id: 'lay_low',
    label: 'Lay Low',
    cost: { focus: 1 },
    effects: { meter: 3, mafiaHeatDelta: -8, reputation: 1 },
    description: 'Less money. Less attention. More sleep.'
  },
  {
    id: 'community_donation',
    label: 'Community Donation',
    cost: { focus: 1, money: 800 },
    effects: { meter: 4, mafiaHeatDelta: -3, reputation: 3, child_empathy: 0.1 },
    description: 'Good optics and a real benefit—if it’s sincere.'
  },
  {
    id: 'lawyer_pr',
    label: 'Lawyer & PR',
    cost: { focus: 1, money: 2500 },
    effects: { meter: 2, mafiaHeatDelta: -10, reputation: 1 },
    description: 'You pay for distance from consequences.'
  },
  {
    id: 'big_score',
    label: 'Big ‘Business’ Month',
    cost: { focus: 1 },
    moneyGain: 9000,
    effects: { meter: 5, mafiaHeatDelta: 12, reputation: 1, child_confidence: 0.1 },
    description: 'Money arrives fast. So does attention.'
  },
  {
    id: 'promotion',
    label: 'Move Up the Ladder',
    cost: { focus: 1, influence: 40 },
    effects: { promote_tier: true, meter: -12, reputation: 2 },
    description: 'Respect increases. So does the weight.'
  },
];