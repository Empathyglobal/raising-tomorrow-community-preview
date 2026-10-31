import { getCountryByIso3 } from '@/components/game/GameStateContext';

export const OFFICES = [
  {
    id: 'mayor',
    label: 'Town Mayor',
    emoji: '🏙️',
    requiredFame: 0,
    baseCampaignCost: 500,
    salaryYearlyIncome: 6500,
    termYears: 4,
    difficultyPenalty: 0,
    fameGainOnWin: 60
  },
  {
    id: 'state_rep',
    label: 'State Representative',
    emoji: '🏛️',
    requiredFame: 75,
    baseCampaignCost: 1200,
    salaryYearlyIncome: 9000,
    termYears: 2,
    difficultyPenalty: 10,
    fameGainOnWin: 90
  },
  {
    id: 'national_rep',
    label: 'National Representative',
    emoji: '🏛️',
    requiredFame: 200,
    baseCampaignCost: 2500,
    salaryYearlyIncome: 12500,
    termYears: 2,
    difficultyPenalty: 20,
    fameGainOnWin: 130
  },
  {
    id: 'president',
    label: 'President',
    emoji: '🦅',
    requiredFame: 450,
    baseCampaignCost: 6000,
    salaryYearlyIncome: 22000,
    termYears: 4,
    difficultyPenalty: 30,
    fameGainOnWin: 200
  }
];

export const RUMOR_TEMPLATES = [
  {
    id: 'hot_mic',
    title: 'Hot Mic Moment',
    body: 'A clip spreads where you mutter something rude when you think the mic is off.',
    severity: 2,
    baseTruthChance: 0.35
  },
  {
    id: 'old_post',
    title: 'Old Post Resurfaces',
    body: 'Someone dredges up an old post and claims it “reveals who you really are.”',
    severity: 2,
    baseTruthChance: 0.25
  },
  {
    id: 'nepotism',
    title: 'Nepotism Accusation',
    body: 'A rumor claims you’re promising favors and jobs to friends if you win.',
    severity: 3,
    baseTruthChance: 0.30
  },
  {
    id: 'donor_drama',
    title: 'Questionable Donation',
    body: 'A local outlet claims your campaign accepted money from a “shady” donor.',
    severity: 3,
    baseTruthChance: 0.30
  },
  {
    id: 'fake_degree',
    title: 'Degree Doubts',
    body: 'Your opponent says your credentials don’t add up and demands “proof.”',
    severity: 2,
    baseTruthChance: 0.20
  },
  {
    id: 'rude_to_staff',
    title: 'Rude to Volunteers',
    body: 'A volunteer claims you “treated people like props” on the campaign trail.',
    severity: 1,
    baseTruthChance: 0.25
  },
  {
    id: 'parenting_headline',
    title: 'Parenting Headline',
    body: 'A tabloid runs a story suggesting you’re “too distracted at home to lead.”',
    severity: 1,
    baseTruthChance: 0.20
  },
  {
    id: 'edited_video',
    title: 'Edited Video',
    body: 'A chopped-up video makes it look like you said something you didn’t.',
    severity: 2,
    baseTruthChance: 0.15
  },
  {
    id: 'out_of_touch',
    title: 'Out of Touch',
    body: 'A meme goes viral mocking you as “out of touch” with regular families.',
    severity: 1,
    baseTruthChance: 0.20
  },
  {
    id: 'mystery_meeting',
    title: 'Secret Meeting',
    body: 'A rumor claims you met privately with someone “to cut a backroom deal.”',
    severity: 3,
    baseTruthChance: 0.25
  }
];

export function getOfficeById(id) {
  return OFFICES.find(o => o.id === id);
}

export function getNextOfficeId(currentOfficeId) {
  if (!currentOfficeId) return 'mayor';
  const idx = OFFICES.findIndex(o => o.id === currentOfficeId);
  if (idx === -1 || idx === OFFICES.length - 1) return null;
  return OFFICES[idx + 1].id;
}

// Deterministic opponent generator
export function generateOpponent({ rngSeed, countryIso3, playerPartyId, parties }) {
  const seed = String(rngSeed || 'seed') + '|' + String(countryIso3 || 'USA') + '|opp|' + String(playerPartyId || '');
  // Simple mulberry32
  function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Hash to int
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rnd = mulberry32(h >>> 0);

  const NAMES = ['Alex Rivera','Jordan Park','Taylor Nguyen','Morgan Okoye','Casey Dubois','Riley Patel','Jamie Silva','Avery Chen','Samir Hassan','Drew Andersen','Emilia Santos','Noah Müller','Zoe Laurent','Kenji Tanaka','Anika Rao','Sofia Johansson','Lucas Pereira','Maya Singh','Hugo Martin','Priya Nair','Fatou Diop','Diego Torres','Hana Sato','Liam O’Connor','Nia Williams','Mateo Cruz','Leila Haddad','Arjun Mehta','Camila Costa','Ethan Brooks'];
  const ARCH = ['Populist','Technocrat','Celebrity','Hardliner','Reformer'];
  const ATTACK = {
    Populist:   'They call you out-of-touch.',
    Technocrat: 'They say you’re all talk, no plan.',
    Celebrity:  'They mock your experience.',
    Hardliner:  'They claim you’re too soft.',
    Reformer:   'They accuse you of being the status quo.',
  };

  const name = NAMES[Math.floor(rnd() * NAMES.length)];
  const archetype = ARCH[Math.floor(rnd() * ARCH.length)];
  const strength = Math.floor(rnd() * 21); // 0..20

  // Opponent party: pick any non-independent not equal to player's if possible
  const pool = (Array.isArray(parties) ? parties : []).filter(p => p.id !== 'independent');
  let oppParty = pool.find(p => p.id !== playerPartyId) || pool[0] || { label: 'Independent' };

  return {
    name,
    archetype,
    strength,
    partyLabel: oppParty.label,
    attackLine: ATTACK[archetype],
  };
}

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export function computeElectionChance({ office, stats, fameBonus, totalFollowers, campaignChanceMod, scandalPenalty, ptaInfluence, platformBonus = 0, partySupport = 0, incumbencyBonus = 0, approval = 55, opponentStrength = 0 }) {
  const base = 45;
  const statScore =
    (stats.confidence - 5) * 3 +
    (stats.empathy - 5) * 2 +
    (stats.intelligence - 5) * 2 +
    (stats.discipline - 5) * 1;

  const followersBonus = clamp(Math.floor(Math.log10(totalFollowers + 1) * 3), 0, 10);

  let ptaBonus = 0;
  if (office.id === 'mayor' || office.id === 'state_rep') {
    ptaBonus = clamp(Math.floor((ptaInfluence - 10) / 10), 0, 5);
  }

  // Small approval influence centered at 55
  const approvalBonus = clamp(Math.floor((approval - 55) / 5), -5, 8);

  let chance = base + statScore + fameBonus + followersBonus + ptaBonus + campaignChanceMod + platformBonus + partySupport + incumbencyBonus + approvalBonus;
  chance = chance - office.difficultyPenalty - scandalPenalty - Math.max(0, Math.floor(opponentStrength / 2));

  return clamp(chance, 5, 95);
}

export function pickRumor(fameTier, discipline, runSeed, year) {
    // Deterministic selection based on seed+year
  const seed = String(runSeed || 'seed') + '|rumor|' + String(year || 0);
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i) | 0;
  const idx = Math.abs(h) % RUMOR_TEMPLATES.length;
  const template = RUMOR_TEMPLATES[idx];

  const maxDisciplineBonus = Math.max(0, (7 - discipline)) * 0.03;
  const truthChance = clamp(template.baseTruthChance + maxDisciplineBonus, 0.05, 0.70);

  const truthSeed = seed + '|truth';
  let t = 0;
  for (let i = 0; i < truthSeed.length; i++) t = ((t << 5) - t) + truthSeed.charCodeAt(i) | 0;
  const r01 = (Math.abs(t) % 1000) / 1000;
  const isTrue = r01 < truthChance;

  return { template, isTrue };
}