export const PTA_RANKS = {
  OBSERVER: { id: 'observer', label: 'Observer', tier: 1, reqInfluence: 0 },
  PAGE: { id: 'page', label: 'Page', tier: 2, reqInfluence: 20 },
  SQUIRE: { id: 'squire', label: 'Squire', tier: 3, reqInfluence: 40 },
  KNIGHT: { id: 'knight', label: 'Knight', tier: 4, reqInfluence: 60 },
  WARDEN: { id: 'warden', label: 'Warden', tier: 5, reqInfluence: 80 },
  GRAND_CONVENER: { id: 'grand_convener', label: 'Grand Convener', tier: 6, reqInfluence: 95 }
};

export const PTA_NPCS = [
  { id: 'samira', name: 'Samira Patel', role: 'PTA President', secretRole: 'Warden', alignment: 'Safety Hawk', baseRel: 40 },
  { id: 'elaine', name: 'Elaine Holbrook', role: 'Treasurer', alignment: 'Numbers Hawk', baseRel: 30 },
  { id: 'coach', name: 'Coach Ramirez', role: 'Booster Titan', alignment: 'Sports Booster', baseRel: 30 },
  { id: 'kwon', name: 'Dr. Kwon', role: 'Principal', alignment: 'Stability', baseRel: 50 },
  { id: 'deleon', name: 'Ms. DeLeon', role: 'Teacher Rep', alignment: 'Dignity/Workload', baseRel: 40 },
  { id: 'jordan', name: 'Jordan Wu', role: 'Social Media Parent', alignment: 'Optics Controller', baseRel: 20 },
  { id: 'gwen', name: 'Gwen Price', role: 'Rival Parent', alignment: 'Status/Control', baseRel: 10 },
  { id: 'archivist', name: 'The Archivist', role: 'Anonymous Note-taker', alignment: 'Unknown', baseRel: 50 }
];

export const WEEKLY_CHARGES = [
  { id: 'stabilize', label: 'Stabilize the meeting', type: 'order' },
  { id: 'protect_teachers', label: 'Protect the teachers', type: 'integrity' },
  { id: 'secure_grant', label: 'Secure the grant partner', type: 'finance' },
  { id: 'neutralize_rumor', label: 'Neutralize a rumor', type: 'optics' },
  { id: 'recruit', label: 'Recruit fresh hands', type: 'growth' },
  { id: 'reduce_heat', label: 'Reduce Heat without losing Influence', type: 'subtle' }
];

export const REMOVAL_ACTIONS = [
  { id: 'committee_shuffle', label: 'Committee Shuffle', type: 'ethical', heatDelta: 0, integrityDelta: 0, reqRank: 'page', desc: 'Rotate rival out via bylaws.' },
  { id: 'courtesy_chair', label: 'Courtesy Chair', type: 'sidelining', heatDelta: 5, integrityDelta: -2, reqRank: 'page', desc: 'Give a prestigious but powerless role.' },
  { id: 'motion_censure', label: 'Motion of Censure', type: 'warning', heatDelta: 10, integrityDelta: -5, reqRank: 'squire', desc: 'Public warning for conduct violation.' },
  { id: 'vote_no_confidence', label: 'Vote of No Confidence', type: 'major', heatDelta: 20, integrityDelta: -10, reqRank: 'knight', desc: 'Remove from office.' },
  { id: 'soft_landing', label: 'Soft Landing Offer', type: 'repair', heatDelta: -5, integrityDelta: 5, reqRank: 'page', desc: 'Offer face-saving exit.' },
  { id: 'network_freeze', label: 'Network Freeze', type: 'ruthless', heatDelta: 15, integrityDelta: -15, reqRank: 'knight', desc: 'Cut off from side chats.' },
  { id: 'trial_conduct', label: 'Trial of Conduct', type: 'discipline', heatDelta: 25, integrityDelta: 0, reqRank: 'warden', desc: 'Formal discipline proceeding.' }
];

export const PROCEDURAL_MOVES = [
  { id: 'motion', label: 'Motion', cost: 1, effect: 'Propose action' },
  { id: 'second', label: 'Second', cost: 0, effect: 'Support motion' },
  { id: 'amend', label: 'Amend', cost: 2, effect: 'Change details' },
  { id: 'table', label: 'Table', cost: 2, effect: 'Delay topic' },
  { id: 'call_question', label: 'Call Question', cost: 3, effect: 'Force vote' },
  { id: 'point_order', label: 'Point of Order', cost: 1, effect: 'Pause/Correct' }
];