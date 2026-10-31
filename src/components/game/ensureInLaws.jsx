// Utility to ensure in-laws exist when partner is present
// This runs in GameStateContext normalization effect

import { pickCulturalFirstName } from '@/components/game/culturalNamePicker';
import { createSeededRng } from '@/components/game/GameStateContext';
import { isPersonDead } from '@/components/game/relationshipUtils';

export function ensureInLawsExist(gameState) {
  const relationships = gameState.relationships || { roster: [], byId: {} };
  const byId = { ...(relationships.byId || {}) };
  const roster = Array.isArray(relationships.roster) ? [...relationships.roster] : [];
  
  // Check if partner exists and is alive
  const partner = byId.partner;
  const hasPartner = partner && !isPersonDead(partner);
  
  if (!hasPartner) {
    // No partner = no in-laws
    return { roster, byId };
  }
  
  // Check if in-laws already exist
  const hasInlawMom = !!byId.inlaw_mom;
  const hasInlawDad = !!byId.inlaw_dad;
  
  if (hasInlawMom && hasInlawDad) {
    // Already exist
    return { roster, byId };
  }
  
  // Generate in-laws
  const runSeed = gameState.runSeed || 'seed';
  const partnerName = partner.name || 'Partner';
  const cultures = gameState.playerCultures || ['AMERICAN_US'];
  const currentYear = gameState.currentYear || 0;
  const partnerBaseAge = partner.baseAge || gameState.partnerAgeAtBirth || 28;
  const partnerAgeNow = partnerBaseAge + currentYear;
  
  // Collect used names to avoid duplicates
  const usedNames = new Set(roster.map(p => p.name).filter(Boolean));
  
  // In-law Mom
  if (!hasInlawMom) {
    const rng = createSeededRng(`${runSeed}|inlaw_mom|${partnerName}`);
    const ageWhenTheyHadPartner = Math.floor(rng.nextFloat() * 15) + 18; // 18..32
    const baseAge = partnerBaseAge + ageWhenTheyHadPartner;
    
    const pDead = 1 / (1 + Math.exp(-(baseAge + currentYear - 88) / 6));
    const alive = rng.nextFloat() > pDead;
    
    const name = pickCulturalFirstName({
      cultures,
      gender: 'female',
      seed: `${runSeed}|inlaw_mom|name|${partnerName}`,
      avoidNames: Array.from(usedNames)
    });
    usedNames.add(name);
    
    const inlawMom = {
      id: 'inlaw_mom',
      role: 'inlaw_mom',
      name,
      emoji: '👩',
      genderKey: 'female',
      avatarGenderKey: 'female',
      baseAge,
      alive,
      isDeceased: !alive,
      deathYear: alive ? null : Math.max(0, currentYear - Math.floor(rng.nextFloat() * 5)),
      createdAtAge: 0,
      meter: 60,
      interactionsByAge: {},
      familySide: 'partner'
    };
    
    byId.inlaw_mom = inlawMom;
    roster.push(inlawMom);
  }
  
  // In-law Dad
  if (!hasInlawDad) {
    const rng = createSeededRng(`${runSeed}|inlaw_dad|${partnerName}`);
    const momAge = byId.inlaw_mom?.baseAge || (partnerBaseAge + 25);
    const ageWhenTheyHadPartner = (momAge - partnerBaseAge) + Math.floor(rng.nextFloat() * 7) - 2; // close to mom's age
    const baseAge = partnerBaseAge + ageWhenTheyHadPartner;
    
    const pDead = 1 / (1 + Math.exp(-(baseAge + currentYear - 88) / 6));
    const alive = rng.nextFloat() > pDead;
    
    const name = pickCulturalFirstName({
      cultures,
      gender: 'male',
      seed: `${runSeed}|inlaw_dad|name|${partnerName}`,
      avoidNames: Array.from(usedNames)
    });
    usedNames.add(name);
    
    const inlawDad = {
      id: 'inlaw_dad',
      role: 'inlaw_dad',
      name,
      emoji: '👨',
      genderKey: 'male',
      avatarGenderKey: 'male',
      baseAge,
      alive,
      isDeceased: !alive,
      deathYear: alive ? null : Math.max(0, currentYear - Math.floor(rng.nextFloat() * 5)),
      createdAtAge: 0,
      meter: 60,
      interactionsByAge: {},
      familySide: 'partner'
    };
    
    byId.inlaw_dad = inlawDad;
    roster.push(inlawDad);
  }
  
  // Optional: 1-2 partner siblings (40% chance for at least one)
  const hasSiblings = roster.some(p => p.role === 'sibling' && p.familySide === 'partner');
  if (!hasSiblings) {
    const rng = createSeededRng(`${runSeed}|inlaw_siblings|${partnerName}`);
    const shouldAdd = rng.nextFloat() < 0.4;
    
    if (shouldAdd) {
      const numSiblings = rng.nextFloat() < 0.6 ? 1 : 2;
      
      for (let i = 0; i < numSiblings; i++) {
        const genderKey = rng.nextFloat() < 0.5 ? 'female' : 'male';
        const ageOffset = Math.floor(rng.nextFloat() * 10) - 5; // -5..+4 years from partner
        const baseAge = partnerBaseAge + ageOffset;
        
        const pDead = 1 / (1 + Math.exp(-(baseAge + currentYear - 88) / 6));
        const alive = rng.nextFloat() > pDead;
        
        const name = pickCulturalFirstName({
          cultures,
          gender: genderKey,
          seed: `${runSeed}|inlaw_sibling_${i + 1}|name|${partnerName}`,
          avoidNames: Array.from(usedNames)
        });
        usedNames.add(name);
        
        const sibling = {
          id: `inlaw_sibling_${i + 1}`,
          role: 'sibling',
          name,
          emoji: genderKey === 'female' ? '👩' : '👨',
          genderKey,
          avatarGenderKey: genderKey,
          baseAge,
          alive,
          isDeceased: !alive,
          deathYear: alive ? null : Math.max(0, currentYear - Math.floor(rng.nextFloat() * 5)),
          createdAtAge: 0,
          meter: 55,
          interactionsByAge: {},
          familySide: 'partner'
        };
        
        byId[sibling.id] = sibling;
        roster.push(sibling);
      }
    }
  }
  
  return { roster, byId };
}