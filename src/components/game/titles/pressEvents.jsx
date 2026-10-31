import { getTitleInfo } from './titleData';

// Press events for monarchy/nobility
// Minimal engine: filter by triggers, then pick first that matches; caller can randomize externally if desired.
export const PRESS_EVENTS = [
  // Gossip
  { id: 'gossip_whispered_hand', category: 'gossip', minRankTier: 1, title: 'Whispered Hand-Hold', headline: 'Did They Hold Hands Too Long?', body: 'A blurry photo looks affectionate during a formal line. Protocol watchers debate decorum.', triggers: { heatMin: 10 }, choices: [
    { label: 'Issue a calm statement', effects: { standingDelta: +1, heatDelta: -6 } },
    { label: 'Ignore it', effects: { standingDelta: 0, heatDelta: +2 } },
    { label: 'Blame the photographer', effects: { standingDelta: -2, heatDelta: +4 } }
  ]},
  { id: 'gossip_party_late', category: 'gossip', minRankTier: 2, title: 'Late Night Exit', headline: 'Carriage at 2am?', body: 'Guests say you left a private supper rather late. Nothing confirmed, but chatter grows.', triggers: { heatMin: 15 }, choices: [
    { label: 'Lay low a week', effects: { standingDelta: -1, heatDelta: -8 } },
    { label: 'Post a wholesome family photo', effects: { standingDelta: +1, heatDelta: -4 } }
  ]},
  { id: 'gossip_staff_friend', category: 'gossip', minRankTier: 2, title: 'Too Friendly With Staff?', headline: 'Overfamiliar?', body: 'A clip shows playful banter with a footman. Some call it charming, others improper.', triggers: { heatMin: 8 }, choices: [
    { label: 'Laugh it off publicly', effects: { standingDelta: 0, heatDelta: -3 } },
    { label: 'Apologize for tone', effects: { standingDelta: +1, heatDelta: -5 } }
  ]},

  // Charity praise
  { id: 'charity_hospital_visit', category: 'charity', minRankTier: 1, title: 'Quiet Hospital Visit', headline: 'Kindness Behind the Scenes', body: 'You toured a children’s ward without press. A nurse’s post goes viral.', triggers: { heatMax: 60 }, choices: [
    { label: 'Acknowledge staff in a note', effects: { standingDelta: +4, heatDelta: -2 } },
    { label: 'Do nothing', effects: { standingDelta: +2, heatDelta: 0 } }
  ]},
  { id: 'charity_food_drive', category: 'charity', minRankTier: 1, title: 'Food Drive Lift', headline: 'Record Donations After Your Visit', body: 'The pantry says your appearance doubled gifts this week.', triggers: { heatMax: 70 }, choices: [
    { label: 'Thank volunteers publicly', effects: { standingDelta: +3, heatDelta: -2 } },
    { label: 'Invite press to next shift', effects: { standingDelta: +2, heatDelta: +2 } }
  ]},

  // Rival smear
  { id: 'rival_smear_whisper', category: 'rival', minRankTier: 2, title: 'Rival House Rumor', headline: 'Anonymous Tip Targets Your Schedule', body: 'A “source” says you skipped a village ceremony for leisure. Thin evidence, loud echo.', triggers: { houseRivalry: true }, choices: [
    { label: 'Counter with receipts', effects: { standingDelta: +2, heatDelta: -4, influenceDelta: -2 } },
    { label: 'Ignore; trust allies', effects: { standingDelta: 0, heatDelta: -1 } },
    { label: 'Hit back harder', effects: { standingDelta: -2, heatDelta: +6 } }
  ]},
  { id: 'rival_overreach', category: 'rival', minRankTier: 3, title: 'Rival Overplays Hand', headline: 'Clumsy Leak Backfires', body: 'Their “scoop” contradicts public records. Small victory for your office.', triggers: { heatMax: 85 }, choices: [
    { label: 'Gracious correction', effects: { standingDelta: +3, heatDelta: -6 } },
    { label: 'Mock them', effects: { standingDelta: -1, heatDelta: +2 } }
  ]},

  // Wardrobe/etiquette
  { id: 'wardrobe_repeat', category: 'etiquette', minRankTier: 1, title: 'Rewearing Outfit', headline: 'Same Dress? Same Suit?', body: 'Some call it thrifty. Some call it careless. Mostly, the internet argues.', triggers: {}, choices: [
    { label: 'Lean into sustainability', effects: { standingDelta: +2, heatDelta: -3 } },
    { label: 'Ignore', effects: { standingDelta: 0, heatDelta: 0 } }
  ]},
  { id: 'protocol_bow', category: 'etiquette', minRankTier: 2, title: 'Shallow Bow', headline: 'Was That Bow Too Casual?', body: 'A clip shows a greeting that looks informal. Protocol accounts weigh in.', triggers: { heatMin: 5 }, choices: [
    { label: 'Note learning and respect', effects: { standingDelta: +1, heatDelta: -4 } },
    { label: 'Blame jet lag', effects: { standingDelta: -1, heatDelta: -2 } }
  ]},

  // Estate staff drama
  { id: 'estate_staff_quit', category: 'estate', minRankTier: 2, title: 'Head Butler Resigns', headline: 'Change in the Household', body: 'A long‑serving butler steps down; tabloids fish for a scandal.', triggers: { heatMin: 10 }, choices: [
    { label: 'Warm farewell statement', effects: { standingDelta: +2, heatDelta: -4 } },
    { label: 'Replace quietly', effects: { standingDelta: 0, heatDelta: -2 } }
  ]},
  { id: 'estate_budget_cut', category: 'estate', minRankTier: 2, title: 'Shrinking Staff', headline: 'Budget Friction at the Estate', body: 'A leaked memo says hours are cut. Are you out of touch—or prudent?', triggers: { heatMin: 15 }, choices: [
    { label: 'Explain stewardship', effects: { standingDelta: +1, heatDelta: -3 } },
    { label: 'Host listening session', effects: { standingDelta: +2, heatDelta: -2, moneyDelta: -200 } }
  ]},

  // Child spotlight pressure
  { id: 'child_piano_moment', category: 'child', minRankTier: 1, title: 'Child Plays at Gala', headline: 'Is It Pressure—or Pride?', body: 'A clip of your child’s recital divides viewers. Cute to some; ambitious to others.', triggers: {}, choices: [
    { label: 'Praise child’s effort, not status', effects: { standingDelta: +2, heatDelta: -2 } },
    { label: 'Ignore debate', effects: { standingDelta: 0, heatDelta: 0 } }
  ]},
  { id: 'child_school_photo', category: 'child', minRankTier: 1, title: 'Uniform Debate', headline: 'Too Fancy for School?', body: 'The morning photo looks a tad couture. Comments explode.', triggers: { heatMin: 5 }, choices: [
    { label: 'Credit the tailor quietly', effects: { standingDelta: +1, heatDelta: -3 } },
    { label: 'Post a messy real-life pic', effects: { standingDelta: 0, heatDelta: -2 } }
  ]},

  // Duty/obligations specific
  { id: 'missed_obligation_press', category: 'duty', minRankTier: 1, title: 'Missed a Key Engagement', headline: 'Where Were You?', body: 'Civic leaders hint you skipped a promised appearance. Questions mount.', triggers: { obligationMissed: true }, choices: [
    { label: 'Apologize and reschedule', effects: { standingDelta: +2, heatDelta: -10 } },
    { label: 'Blame logistics', effects: { standingDelta: -2, heatDelta: +6 } }
  ]},
  { id: 'duty_overbooked', category: 'duty', minRankTier: 2, title: 'Overbooked Calendar', headline: 'Too Many Ribbon Cuttings?', body: 'Commentators ask whether quantity beats quality in your schedule.', triggers: { heatMin: 20 }, choices: [
    { label: 'Curate fewer, deeper events', effects: { standingDelta: +2, heatDelta: -6 } },
    { label: 'Double down on volume', effects: { standingDelta: -1, heatDelta: +5 } }
  ]},

  // Neutral / general
  { id: 'garden_photo', category: 'general', minRankTier: 1, title: 'Garden Photo Day', headline: 'A Gentle Image Cuts Through Noise', body: 'You were photographed planting a tree. Press likes the symbolism.', triggers: { heatMax: 80 }, choices: [
    { label: 'Credit local gardeners', effects: { standingDelta: +2, heatDelta: -2 } },
    { label: 'Post without caption', effects: { standingDelta: +1, heatDelta: -1 } }
  ]},
  { id: 'horse_show', category: 'general', minRankTier: 2, title: 'Riding Exhibition', headline: 'Skill on Display', body: 'Clips from a charity riding event gain traction.', triggers: {}, choices: [
    { label: 'Share training tips', effects: { standingDelta: +1, heatDelta: -2 } },
    { label: 'Say nothing', effects: { standingDelta: 0, heatDelta: 0 } }
  ]},
  { id: 'library_endowment', category: 'charity', minRankTier: 2, title: 'Library Endowment', headline: 'Quiet Funds, Big Impact', body: 'A librarian thread thanks your office for stable support.', triggers: { heatMax: 70 }, choices: [
    { label: 'Invite kids to story hour', effects: { standingDelta: +2, heatDelta: -3 } },
    { label: 'Let it be anonymous', effects: { standingDelta: +1, heatDelta: -1 } }
  ]},
  { id: 'rival_allies_split', category: 'rival', minRankTier: 3, title: 'Rival’s Ally Wavers', headline: 'A Crack Appears', body: 'A comment suggests their coalition strains. Subtext: keep poise.', triggers: {}, choices: [
    { label: 'Stay dignified', effects: { standingDelta: +2, heatDelta: -2 } },
    { label: 'Gloat', effects: { standingDelta: -2, heatDelta: +3 } }
  ]},
  { id: 'wardrobe_local_designer', category: 'etiquette', minRankTier: 1, title: 'Local Designer Spotlight', headline: 'Hometown Couture', body: 'Wearing a local maker turns into a small win.', triggers: { heatMax: 80 }, choices: [
    { label: 'Signal-boost their shop', effects: { standingDelta: +2, heatDelta: -2 } },
    { label: 'Keep it minimal', effects: { standingDelta: +1, heatDelta: -1 } }
  ]},
  { id: 'child_boundaries', category: 'child', minRankTier: 1, title: 'Child Boundaries Praised', headline: 'Refusing Photos Politely', body: 'A clip shows you shielding your child from paparazzi. Applause follows.', triggers: {}, choices: [
    { label: 'Thank supporters', effects: { standingDelta: +2, heatDelta: -3 } },
    { label: 'Say nothing', effects: { standingDelta: +1, heatDelta: -1 } }
  ]},
  { id: 'ally_request_help', category: 'ally', minRankTier: 2, title: 'Ally House Requests Support', headline: 'A Joint Appearance?', body: 'They ask for a shared event to steady their standing.', triggers: {}, choices: [
    { label: 'Support their event', effects: { standingDelta: +2, heatDelta: -2, influenceDelta: -3 } },
    { label: 'Decline politely', effects: { standingDelta: 0, heatDelta: +1 } }
  ]},
  { id: 'advisor_warning', category: 'advisor', minRankTier: 1, title: 'Advisor Raises Flag', headline: 'Storm Brewing Quietly', body: 'Your advisor suggests a proactive statement before rumors build.', triggers: { heatMin: 25 }, choices: [
    { label: 'Follow advice', effects: { standingDelta: +1, heatDelta: -7 } },
    { label: 'Ignore', effects: { standingDelta: -1, heatDelta: +5 } }
  ]},
];

function passesTriggers(evt, { standing = 50, heat = 0, obligationMissed = false, house = null, rankTier = 1 }) {
  const t = evt.triggers || {};
  if (evt.minRankTier && rankTier < evt.minRankTier) return false;
  if (typeof t.standingMin === 'number' && standing < t.standingMin) return false;
  if (typeof t.heatMin === 'number' && heat < t.heatMin) return false;
  if (typeof t.heatMax === 'number' && heat > t.heatMax) return false;
  if (t.obligationMissed && !obligationMissed) return false;
  if (t.houseRivalry) {
    const hostility = Number(house?.rivalHouse?.hostility || 0);
    if (hostility < 50) return false;
  }
  return true;
}

export function pickPressEvent(gameState, { forceNegative = false } = {}) {
  const t = gameState.titles || {};
  const titleId = t.primaryTitle;
  const info = titleId ? getTitleInfo(titleId) : null;
  const rankTier = Number(info?.rank || 1);
  const standing = Number(t.standing || 50);
  const heat = Number(t.scandalHeat || 0);
  const house = t.house || null;

  const pool = PRESS_EVENTS.filter(e => passesTriggers(e, { standing, heat, obligationMissed: forceNegative, house, rankTier }));
  if (pool.length === 0) return null;
  // Basic pick: weight slightly by heat
  const idx = Math.floor(Math.min(pool.length - 1, Math.max(0, Math.round((heat / 100) * (pool.length - 1)))));
  return pool[idx];
}