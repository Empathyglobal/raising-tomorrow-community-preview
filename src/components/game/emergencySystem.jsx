// Emergency Pop-up System
// Yearly 1% chance for serious emergencies (ages 1-18)

import { getDeathRelationPhrase } from './kinshipLabels';

export function shouldRollEmergency(state) {
  const childAge = Number(state?.currentYear || 0);
  // Only ages 1-18
  if (childAge < 1 || childAge > 18) return false;
  
  // Check if already processed this year
  const lastProcessed = state?.emergency?.lastProcessedYear;
  if (lastProcessed === childAge) return false;
  
  return true;
}

export function rollEmergency(state, rng) {
  // 1% chance
  if (rng.nextFloat() > 0.01) return null;
  
  const childAge = Number(state?.currentYear || 0);
  
  // Choose emergency type
  const typeRoll = rng.nextFloat();
  const isHome = typeRoll < 0.45;
  
  if (isHome) {
    return buildHomeDisaster(state, rng, childAge);
  } else {
    return buildAccident(state, rng, childAge);
  }
}

function buildHomeDisaster(state, rng, childAge) {
  const subtypes = ['fire', 'flood', 'storm'];
  const subtype = subtypes[Math.floor(rng.nextFloat() * subtypes.length)];
  
  // Calculate cost
  const cash = Math.max(0, Number(state?.money || 0));
  const annualIncome = Number(state?.playerCareer?.yearlyIncome || 0);
  const homeValue = (() => {
    const ownedHome = (state?.inventory?.items || []).find(i => i?.uniqueGroup === 'home');
    return ownedHome ? Number(ownedHome.cost || 0) : 0;
  })();
  
  const baseline = Math.max(cash, annualIncome, homeValue * 0.15);
  const costMult = 0.25 + rng.nextFloat() * 0.35; // 0.25..0.60
  const baseCost = Math.max(800, Math.min(60000, Math.round(baseline * costMult)));
  
  const baseStress = Math.round(15 + rng.nextFloat() * 15); // 15..30
  
  const titles = {
    fire: '🔥 House Fire',
    flood: '🌊 Flooding',
    storm: '🌪️ Storm Damage'
  };
  
  const descriptions = {
    fire: 'A fire breaks out. Everyone gets out safely—but the damage is serious. Repairs are expensive and the timeline is unclear.',
    flood: 'Heavy rain floods your home. The water is gone, but furniture, walls, and belongings took a hit. Cleanup and repairs are expensive.',
    storm: 'A storm damages your roof, windows, and part of the structure. No one is hurt, but the repair costs are high.'
  };
  
  return {
    id: `home_${subtype}_age_${childAge}`,
    year: childAge,
    childAge,
    type: 'home',
    subtype,
    title: titles[subtype] || '🏠 Home Emergency',
    description: descriptions[subtype] || 'Your home suffered serious damage.',
    victimRole: null,
    fatal: false,
    baseCost,
    baseStress,
    options: [
      {
        id: 'pay_now',
        label: 'Pay repairs now',
        costMult: 1.0,
        stressMult: 0.9,
        addsDebt: false
      },
      {
        id: 'payment_plan',
        label: 'Payment plan',
        costMult: 0.6,
        stressMult: 1.15,
        addsDebt: true
      },
      {
        id: 'community_help',
        label: 'Ask for help',
        costMult: 0.35,
        stressMult: 1.0,
        addsDebt: false
      }
    ]
  };
}

function buildAccident(state, rng, childAge) {
  const hasChild = state?.hasChild !== false && state?.childless !== true;

  // Build victim pool
  const victims = [
    { role: 'self', weight: 40 },
    { role: 'partner', weight: 30 },
  ];

  if (hasChild) {
    victims.push({ role: 'child', weight: 30 });
  }
  
  // Mother
  if (state?.relationships?.byId?.my_mom?.alive || state?.relationships?.byId?.mother?.alive) {
    victims.push({ role: 'mother', weight: 15 });
  }
  
  // Father
  if (state?.relationships?.byId?.my_dad?.alive || state?.relationships?.byId?.father?.alive) {
    victims.push({ role: 'father', weight: 15 });
  }
  
  // Weighted selection
  const totalWeight = victims.reduce((sum, v) => sum + v.weight, 0);
  const roll = rng.nextFloat() * totalWeight;
  let acc = 0;
  let victimRole = 'self';
  for (const v of victims) {
    acc += v.weight;
    if (roll < acc) {
      victimRole = v.role;
      break;
    }
  }
  
  // Determine fatality
  let fatal = false;
  if (victimRole === 'mother' || victimRole === 'father') {
    fatal = true; // Always fatal for parents
  } else if (victimRole === 'partner') {
    fatal = rng.nextFloat() < 0.40; // 40% fatal chance
  }
  // self/child never fatal
  
  // Calculate cost based on sticker prices
  let grossBill;
  if (fatal) {
    grossBill = 60000 + Math.floor(rng.nextFloat() * 160000); // 60k-220k
  } else if (victimRole === 'self' || victimRole === 'child') {
    grossBill = 15000 + Math.floor(rng.nextFloat() * 75000); // 15k-90k
  } else {
    grossBill = 20000 + Math.floor(rng.nextFloat() * 90000); // 20k-110k
  }
  
  // Apply out-of-pocket rate
  const iso3 = state?.countryIso3 || 'USA';
  const upper = String(iso3).toUpperCase();
  let oopRate;
  if (upper === 'DEU') oopRate = 0.0;
  else if (upper === 'USA') oopRate = 1.0;
  else {
    const level = state?.countries?.find(c => c.iso3 === iso3)?.level || 3;
    const rateByLevel = { 1: 0.85, 2: 0.70, 3: 0.55, 4: 0.40, 5: 0.25, 6: 0.15 };
    oopRate = rateByLevel[level] || 0.55;
  }
  
  const baseCost = Math.round(grossBill * oopRate);
  
  // Calculate stress
  let baseStress;
  if (fatal && (victimRole === 'mother' || victimRole === 'father')) {
    baseStress = Math.round(25 + rng.nextFloat() * 20); // 25..45
  } else if (fatal && victimRole === 'partner') {
    baseStress = Math.round(30 + rng.nextFloat() * 25); // 30..55
  } else if (victimRole === 'self' || victimRole === 'child') {
    baseStress = Math.round(18 + rng.nextFloat() * 17); // 18..35
  } else {
    baseStress = Math.round(15 + rng.nextFloat() * 15); // 15..30
  }
  
  const victimLabels = {
    self: 'You',
    child: state?.childName || 'Your child',
    partner: state?.partnerName || 'Your partner',
    mother: state?.relationships?.byId?.my_mom?.name || state?.relationships?.byId?.mother?.name || 'Your mother',
    father: state?.relationships?.byId?.my_dad?.name || state?.relationships?.byId?.father?.name || 'Your father'
  };
  
  const victimName = victimLabels[victimRole] || 'Someone';
  
  // Build relationship phrase for clarity
  let victimRelation = '';
  let victimLabel = victimName;
  
  if (victimRole === 'mother') {
    const person = state?.relationships?.byId?.my_mom || state?.relationships?.byId?.mother;
    victimRelation = getDeathRelationPhrase(person, state);
    victimLabel = `${victimName} (${victimRelation})`;
  } else if (victimRole === 'father') {
    const person = state?.relationships?.byId?.my_dad || state?.relationships?.byId?.father;
    victimRelation = getDeathRelationPhrase(person, state);
    victimLabel = `${victimName} (${victimRelation})`;
  } else if (victimRole === 'partner') {
    const person = state?.relationships?.byId?.partner;
    victimRelation = getDeathRelationPhrase(person, state);
    victimLabel = `${victimName} (${victimRelation})`;
  } else if (victimRole === 'child') {
    const person = state?.relationships?.byId?.child;
    victimRelation = getDeathRelationPhrase(person, state);
    victimLabel = `${victimName} (${victimRelation})`;
  } else if (victimRole === 'self') {
    victimRelation = 'you';
    victimLabel = 'You';
  }
  
  const title = fatal 
    ? `💔 Fatal Accident: ${victimLabel}`
    : `🚑 Serious Accident: ${victimLabel}`;
  
  const description = fatal
    ? `${victimLabel} ${victimRole === 'self' ? 'were' : 'was'} in a serious accident. The injuries ${victimRole === 'self' ? 'were' : 'was'} too severe. ${victimRole === 'self' ? 'You did' : 'They did'} not survive.\n\nMedical costs, memorial arrangements, and grief counseling are needed.`
    : `${victimLabel} ${victimRole === 'self' ? 'were' : 'was'} in a serious accident. ${victimRole === 'self' ? 'You are' : 'They are'} hospitalized but will recover.\n\nMedical bills, recovery time, and stress pile up fast.`;
  
  return {
    id: `accident_${victimRole}_age_${childAge}`,
    year: childAge,
    childAge,
    type: 'accident',
    subtype: 'accident',
    victimRole,
    victimName,
    victimRelation,
    victimLabel,
    fatal,
    title,
    description,
    baseCost,
    baseStress,
    options: [
      {
        id: 'pay_now',
        label: fatal ? 'Handle it now' : 'Pay medical bills now',
        costMult: 1.0,
        stressMult: 0.85,
        addsDebt: false
      },
      {
        id: 'payment_plan',
        label: 'Payment plan',
        costMult: 0.5,
        stressMult: 1.2,
        addsDebt: true
      },
      {
        id: 'community_help',
        label: 'Ask for help',
        costMult: 0.3,
        stressMult: 1.0,
        addsDebt: false
      }
    ]
  };
}

export function applyEmergencyChoice(state, payload, choiceId, rng) {
  if (!payload) return state;
  
  const option = (payload.options || []).find(o => o.id === choiceId);
  if (!option) return state;
  
  const finalCost = Math.round(payload.baseCost * option.costMult);
  const finalStress = Math.round(payload.baseStress * option.stressMult);
  
  let next = { ...state };
  
  // Apply money cost (allow debt)
  const currentMoney = Number(next.money || 0);
  next.money = currentMoney - finalCost;
  
  // Track debt if money goes negative
  if (next.money < 0) {
    next.debt = Math.max(0, -next.money);
  }
  
  // Apply stress
  next.stress = Math.max(0, Math.min(100, (next.stress || 0) + finalStress));
  
  // Apply injury/death effects
  if (payload.type === 'accident') {
    if (payload.fatal) {
      // Mark person as dead
      if (payload.victimRole === 'mother' || payload.victimRole === 'father') {
        const rel = next.relationships || { roster: [], byId: {} };
        // Prefer canonical IDs (my_mom/my_dad) but fallback to legacy (mother/father)
        const canonicalKey = payload.victimRole === 'mother' ? 'my_mom' : 'my_dad';
        const legacyKey = payload.victimRole;
        const person = rel.byId?.[canonicalKey] || rel.byId?.[legacyKey];
        if (person) {
          const key = person.id; // Use actual key from person object
          const updated = {
            ...person,
            alive: false,
            isDeceased: true,
            deathYear: payload.childAge,
            causeOfDeath: 'accident'
          };
          next.relationships = {
            ...rel,
            roster: rel.roster.map(p => p.id === key ? updated : p),
            byId: { ...rel.byId, [key]: updated }
          };
        }
      } else if (payload.victimRole === 'partner') {
        // Partner dies
        next.householdType = 'single';
        next.partnerName = null;
        next.partnerEmoji = null;
        next.partnerMeter = 0;
        next.partnerCareer = null;
        next.partnerRelationship = { ...(next.partnerRelationship || {}), status: 'deceased' };
        
        // Mark in relationships
        const rel = next.relationships || { roster: [], byId: {} };
        const partner = rel.byId?.partner;
        if (partner) {
          const updated = {
            ...partner,
            alive: false,
            isDeceased: true,
            deathYear: payload.childAge,
            causeOfDeath: 'accident'
          };
          next.relationships = {
            ...rel,
            roster: rel.roster.map(p => p.id === 'partner' ? updated : p),
            byId: { ...rel.byId, partner: updated }
          };
        }
      }
    } else {
      // Hospitalized (not fatal) - set correct sick flag based on victim
      if (payload.victimRole === 'child') {
        next.childSickThisAge = true;
        next.childSickNote = `${payload.victimLabel || payload.victimName} is recovering from an accident.`;
      } else if (payload.victimRole === 'self') {
        next.playerSickThisAge = true;
        next.playerSickNote = `You are recovering from an accident.`;
      } else if (payload.victimRole === 'partner') {
        next.partnerSickThisAge = true;
        next.partnerSickNote = `Your partner is recovering from an accident.`;
      }
    }
  }
  
  return next;
}