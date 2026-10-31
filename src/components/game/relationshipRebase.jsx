// Centralized relationship rebasing after guardian change (succession/adoption)
// Ensures spouse mapping, friend reset, and label consistency

import { pickCulturalFirstName } from '@/components/game/culturalNamePicker';
import { createSeededRng } from '@/components/game/GameStateContext';

function isPersonDead(person) {
  if (!person) return true;
  if (person.isDeceased === true || person.alive === false) return true;
  return false;
}

function normalizeGenderKey(v, fallback = 'male') {
  const s = String(v || '').toLowerCase();
  if (s === 'female' || s === 'girl' || s === 'woman' || s === 'f') return 'female';
  if (s === 'male' || s === 'boy' || s === 'man' || s === 'm') return 'male';
  return fallback;
}

/**
 * Rebases relationships after guardian change to ensure:
 * 1. Grandparent spouse becomes partner (not labeled as parent)
 * 2. Old partner becomes child's other parent (father_of_child/mother_of_child)
 * 3. Adult friends reset for new caregiver
 * 4. Successor removed from relationships (no self-interaction)
 * 
 * @param {object} prevState - Current game state
 * @param {object} successor - Successor candidate { id, role, name, baseAge, ... }
 * @returns {object} State patch to merge
 */
export function rebaseRelationshipsAfterGuardianChange(prevState, successor) {
  const rel0 = prevState.relationships || { roster: [], byId: {} };
  const roster0 = Array.isArray(rel0.roster) ? [...rel0.roster] : [];
  const byId0 = { ...(rel0.byId || {}) };
  
  const patch = {};
  
  // ========== STEP 1: Handle surviving partner conversion ==========
  // When choosing a parent (my_mom/my_dad), the old partner becomes the child's other parent
  if (successor.id !== 'partner' && byId0.partner && !isPersonDead(byId0.partner)) {
    const deceased = prevState.deathContext?.deceased;
    const deceasedRole = deceased?.role || prevState.parentRole || 'mom';
    const newRole = (deceasedRole === 'mom') ? 'father_of_child' : 'mother_of_child';
    
    const convertedPartner = {
      ...byId0.partner,
      id: newRole,
      role: newRole
    };
    
    // Remove old partner
    delete byId0.partner;
    const partnerIdx = roster0.findIndex(p => p.id === 'partner');
    if (partnerIdx >= 0) roster0.splice(partnerIdx, 1);
    
    // Remove duplicate if exists
    const dupIdx = roster0.findIndex(p => p.id === newRole);
    if (dupIdx >= 0) {
      roster0.splice(dupIdx, 1);
      delete byId0[newRole];
    }
    
    // Add converted entry
    byId0[newRole] = convertedPartner;
    roster0.push(convertedPartner);
  }
  
  // ========== STEP 2: Grandparent spouse mapping ==========
  // When successor is my_mom or my_dad, map the other grandparent to partner
  if (successor.id === 'my_mom' || successor.id === 'my_dad') {
    const spouseId = successor.id === 'my_mom' ? 'my_dad' : 'my_mom';
    const spousePerson = byId0[spouseId];
    
    if (spousePerson) {
      const spouseAlive = !isPersonDead(spousePerson);
      
      // Remove any existing partner to prevent duplicates
      if (byId0.partner) {
        delete byId0.partner;
        const pIdx = roster0.findIndex(p => p.id === 'partner');
        if (pIdx >= 0) roster0.splice(pIdx, 1);
      }
      
      // Move/rename spouse to partner
      const partner = {
        ...spousePerson,
        id: 'partner',
        role: 'partner'
      };
      
      // Remove old grandparent entry
      delete byId0[spouseId];
      const oldIdx = roster0.findIndex(p => p.id === spouseId);
      if (oldIdx >= 0) roster0.splice(oldIdx, 1);
      
      // Add as partner
      byId0.partner = partner;
      roster0.push(partner);
      
      // Set top-level partner state (only if spouse is alive)
      if (spouseAlive) {
        patch.householdType = 'two';
        patch.partnerName = partner.name;
        patch.partnerEmoji = partner.emoji || '🧑';
        patch.partnerMeter = Number.isFinite(Number(partner.meter)) ? Number(partner.meter) : 75;
        patch.partnerAgeAtBirth = partner.baseAge;
        patch.partnerAvatarGender = normalizeGenderKey(
          partner.genderKey || partner.avatarGenderKey,
          spouseId === 'my_mom' ? 'female' : 'male'
        );
        patch.partnerAvatarSpriteIndex = Number.isFinite(Number(partner.avatarSpriteIndex)) 
          ? Number(partner.avatarSpriteIndex) 
          : 0;
        
        // Set married status
        patch.partnerRelationship = {
          status: 'married',
          marriedAtAge: 0,
          engagedAtAge: null,
          ring: null,
          wedding: null,
          openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
          crisis: null
        };
      } else {
        // Spouse deceased: stay single but keep renamed relationship entry
        patch.householdType = 'single';
        patch.partnerRelationship = {
          status: 'single',
          engagedAtAge: null,
          marriedAtAge: null,
          ring: null,
          wedding: null,
          openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
          crisis: null
        };
      }
    }
  } else {
    // Not grandparent succession: single guardian household
    patch.householdType = 'single';
    patch.partnerCareer = null;
    patch.partnerName = null;
    patch.partnerEmoji = null;
    patch.partnerMeter = null;
    patch.partnerAgeAtBirth = null;
    patch.partnerAvatarGender = null;
    patch.partnerAvatarSpriteIndex = null;
    patch.partnerPatterns = [];
    patch.partnerRelationship = {
      status: 'single',
      engagedAtAge: null,
      marriedAtAge: null,
      ring: null,
      wedding: null,
      wealth: null,
      prenup: null,
      marriageFinance: null
    };
  }
  
  // ========== STEP 2.5: Ensure the new caregiver has parents when taking over ==========
  // Generate inlaw_mom/inlaw_dad when successor is:
  // - 'partner'
  // - 'mother_of_child'
  // - 'father_of_child'
  // Kinship labels remap these to "Your Mom/Dad" when guardianPerspective.side === 'partner'
  if (successor.id === 'partner' || successor.id === 'mother_of_child' || successor.id === 'father_of_child') {
    const runSeed = prevState.runSeed || 'seed';
    const currentYear = prevState.currentYear || 0;
    const ts = prevState.deathEvent?.ts || Date.now();

    const culturesForPartner = (Array.isArray(successor.cultures) && successor.cultures.length)
      ? successor.cultures
      : (prevState.playerCultures || ['AMERICAN_US']);

    const usedNames = new Set((roster0 || []).map(p => p?.name).filter(Boolean).map(n => String(n)));

    const spawnInlawParent = (id, genderKey) => {
      const rng = createSeededRng(`${runSeed}|${id}|guardian:${successor.id}|year:${currentYear}|ts:${ts}`);
      const caregiverAgeAtBirth = Number.isFinite(Number(successor.baseAge))
        ? Number(successor.baseAge)
        : Number(prevState.partnerAgeAtBirth ?? prevState.parentAgeAtBirth ?? 28);

      const ageWhenHadCaregiver = 18 + Math.floor(rng.nextFloat() * 15); // 18..32
      const baseAge = caregiverAgeAtBirth + ageWhenHadCaregiver; // at year 0
      const ageNow = baseAge + currentYear;

      const pDead = 1 / (1 + Math.exp(-(ageNow - 88) / 6));
      const alive = rng.nextFloat() > pDead;

      const name = pickCulturalFirstName({
        cultures: culturesForPartner,
        gender: genderKey,
        seed: `${runSeed}|${id}|name|${ts}`,
        avoidNames: Array.from(usedNames),
      });
      usedNames.add(name);

      return {
        id,
        role: id,
        name,
        emoji: genderKey === 'female' ? '👩' : '👨',
        genderKey,
        baseAge,
        age: baseAge + currentYear,
        createdAtAge: currentYear,
        meter: 70,
        alive,
        isDeceased: !alive,
        deathYear: alive ? null : Math.max(0, currentYear - Math.floor(rng.nextFloat() * (currentYear + 1))),
        interactionsByAge: {}
      };
    };

    if (!byId0.inlaw_mom) {
      const mom = spawnInlawParent('inlaw_mom', 'female');
      byId0.inlaw_mom = mom;
      roster0.push(mom);
    }
    if (!byId0.inlaw_dad) {
      const dad = spawnInlawParent('inlaw_dad', 'male');
      byId0.inlaw_dad = dad;
      roster0.push(dad);
    }
  }

  // ========== STEP 3: Reset adult friends ==========
  // Remove old caregiver's friends
  delete byId0.my_best_friend;
  
  const filteredRoster = roster0.filter(r => {
    if (r.id === 'my_best_friend') return false;
    if (r.role === 'friend' && r.id !== 'best_friend') return false;
    return true;
  });
  
  // Generate new my_best_friend for the new caregiver
  const runSeed = prevState.runSeed || 'seed';
  const currentYear = prevState.currentYear || 0;
  const ts = prevState.deathEvent?.ts || Date.now();
  
  const rng = createSeededRng(`${runSeed}|my_best_friend|guardian:${successor.id}|year:${currentYear}|ts:${ts}`);
  const cultures = (Array.isArray(successor.cultures) && successor.cultures.length)
    ? successor.cultures
    : (prevState.playerCultures || ['AMERICAN_US']);
  const friendGender = rng.nextFloat() < 0.5 ? 'female' : 'male';
  const friendName = pickCulturalFirstName({
    cultures,
    gender: friendGender,
    seed: `${runSeed}|friend|${successor.id}|${ts}`
  });
  
  const caregiverAge = (successor.baseAge || prevState.parentAgeAtBirth || 28) + currentYear;
  const friendBaseAge = caregiverAge - 3 + Math.floor(rng.nextFloat() * 7);
  
  const newBestFriend = {
    id: 'my_best_friend',
    role: 'my_best_friend',
    name: friendName,
    genderKey: friendGender,
    baseAge: friendBaseAge,
    createdAtAge: currentYear,
    meter: 60 + Math.floor(rng.nextFloat() * 11),
    alive: true,
    isDeceased: false,
    interactionsByAge: {}
  };
  
  byId0.my_best_friend = newBestFriend;
  filteredRoster.push(newBestFriend);
  
  // ========== STEP 4: Remove successor from relationships ==========
  // Prevent self-interaction
  if (filteredRoster.some(p => p.id === successor.id)) {
    const finalRoster = filteredRoster.filter(p => p.id !== successor.id);
    delete byId0[successor.id];
    patch.relationships = { roster: finalRoster, byId: byId0 };
  } else {
    patch.relationships = { roster: filteredRoster, byId: byId0 };
  }
  
  return patch;
}