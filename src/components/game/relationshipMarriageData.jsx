// Engagement rings and wedding options

export const ENGAGEMENT_RINGS = [
  { 
    id: 'simple', 
    emoji: '💍', 
    label: 'Simple Ring', 
    cost: 250, 
    acceptanceBonus: 0,
    description: 'A simple, heartfelt ring.'
  },
  { 
    id: 'nice', 
    emoji: '💎', 
    label: 'Nice Ring', 
    cost: 1200, 
    acceptanceBonus: 8,
    description: 'A beautiful ring with good craftsmanship.'
  },
  { 
    id: 'luxury', 
    emoji: '👑', 
    label: 'Luxury Ring', 
    cost: 5000, 
    acceptanceBonus: 15,
    description: 'A stunning ring that makes a statement.'
  },
];

export const WEDDING_OPTIONS = [
  { 
    id: 'courthouse', 
    emoji: '🏛️', 
    label: 'Courthouse Wedding', 
    cost: 300, 
    stressDelta: 0, 
    partnerMeterDelta: 2,
    description: 'Simple, legal, done.'
  },
  { 
    id: 'backyard', 
    emoji: '🌿', 
    label: 'Backyard Wedding', 
    cost: 1500, 
    stressDelta: 1, 
    partnerMeterDelta: 5,
    description: 'Intimate gathering with close friends.'
  },
  { 
    id: 'venue', 
    emoji: '💐', 
    label: 'Venue Wedding', 
    cost: 7000, 
    stressDelta: 2, 
    partnerMeterDelta: 8,
    description: 'Traditional celebration with all the trimmings.'
  },
  { 
    id: 'destination', 
    emoji: '✈️', 
    label: 'Destination Wedding', 
    cost: 12000, 
    stressDelta: 3, 
    partnerMeterDelta: 10,
    description: 'Get married somewhere unforgettable.'
  },
];

export function computeNetWorthBreakdown(gameState) {
  const cash = Math.max(0, Number(gameState.money) || 0);
  const retirement = Math.max(0, Number(gameState.retirementSavings) || 0);
  const emergency = Math.max(0, Number(gameState.emergencyFund) || 0);

  const properties = Array.isArray(gameState.realEstate) ? gameState.realEstate : [];
  const realEstateEquity = properties.reduce((sum, p) => {
    const value = Math.max(0, Number(p.value) || 0);
    const mortgage = Math.max(0, Number(p.mortgage) || 0);
    return sum + Math.max(0, value - mortgage);
  }, 0);

  const breakdown = { cash, retirement, emergency, realEstateEquity };
  const total = cash + retirement + emergency + realEstateEquity;

  return { total, breakdown };
}

export function computeDivorceSettlement(gameState) {
  const { total, breakdown } = computeNetWorthBreakdown(gameState);

  const pr = gameState?.partnerRelationship || {};
  const prenupSigned = Boolean(pr?.prenup?.signed);
  const mf = pr?.marriageFinance || {};

  // Prenup logic: each keeps what they brought in, split only marital gains.
  if (
    prenupSigned &&
    Number.isFinite(mf.playerNetWorthAtMarriage) &&
    Number.isFinite(mf.partnerWealthAtMarriage)
  ) {
    const baselineCombined =
      (Number(mf.playerNetWorthAtMarriage) || 0) + (Number(mf.partnerWealthAtMarriage) || 0);

    const maritalGains = Math.max(0, total - baselineCombined);
    const spouseGetsBack = Math.max(0, Number(mf.partnerWealthAtMarriage) || 0);

    let settlement = Math.floor(spouseGetsBack + maritalGains * 0.5);
    settlement = Math.max(0, settlement);
    settlement = Math.min(settlement, Math.floor(total)); // never exceed total net worth

    return {
      settlement,
      breakdown,
      mode: 'prenup',
      prenupSigned: true,
      baselineCombined,
      maritalGains,
      spouseGetsBack
    };
  }

  // No prenup (default BitLife-ish): 50% of total net worth
  const settlement = Math.floor(total * 0.5);

  return {
    settlement,
    breakdown,
    mode: 'standard',
    prenupSigned: false
  };
}