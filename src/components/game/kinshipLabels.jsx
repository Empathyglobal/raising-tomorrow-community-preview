// Kinship Labels - Centralized relationship label system
// Handles dynamic role labels based on guardian perspective

import { getCoopSideRole } from '@/components/game/localCoop';

export function getGuardianPerspective(gameState) {
  return gameState.guardianPerspective || {
    activeId: 'player',
    side: 'player',
    relationToChild: 'parent'
  };
}

export function getChildRoleLabel(gameState, opts = {}) {
  const gp = getGuardianPerspective(gameState);
  const short = opts.short ?? false;
  
  if (gp.relationToChild === 'grandparent') {
    return short ? 'Grandchild' : 'Your Grandchild';
  }
  if (gp.relationToChild === 'guardian') {
    return short ? 'Ward' : 'Your Ward';
  }
  if (gp.relationToChild === 'sibling') {
    return short ? 'Sibling' : 'Your Sibling';
  }
  return short ? 'Child' : 'Your Child';
}

export function getOtherParentLabel(gameState, role, opts = {}) {
  const gp = getGuardianPerspective(gameState);
  const short = opts.short ?? false;
  
  const isMother = role === 'mother_of_child';
  const baseLabel = isMother ? 'Mother' : 'Father';
  
  if (gp.relationToChild === 'grandparent') {
    return short ? `Grandchild's ${baseLabel}` : `Grandchild's ${baseLabel}`;
  }
  return short ? `Child's ${baseLabel}` : `Child's ${baseLabel}`;
}

/**
 * Get the caregiver's address from the child's perspective
 * (e.g., "Mom", "Grandma", "Guardian")
 */
export function getCaregiverAddress(gameState) {
  const gp = getGuardianPerspective(gameState);
  const side = gp.side === 'partner' ? 'partner' : 'player';
  
  // Check for caregiver meta title override (multiplayer/custom kinship)
  const caregiverMeta = gameState.caregiverMeta || {};
  const sideMeta = caregiverMeta[side];
  const customTitle = sideMeta?.title;
  if (customTitle && String(customTitle).trim()) {
    return String(customTitle).trim();
  }
  
  // Derive genderKey from appropriate source (NOT role)
  let genderKey;
  if (side === 'partner') {
    genderKey = gameState.partnerAvatarGender 
      || gameState.relationships?.byId?.partner?.genderKey 
      || gameState.relationships?.byId?.partner?.avatarGenderKey;
  } else {
    genderKey = gameState.parentAvatarGender 
      || gameState.relationships?.byId?.player?.genderKey 
      || gameState.relationships?.byId?.player?.avatarGenderKey;
  }
  
  const relationToChild = gp.relationToChild || 'parent';
  
  if (relationToChild === 'grandparent') {
    if (genderKey === 'female') return 'Grandma';
    if (genderKey === 'male') return 'Grandpa';
    return 'Grandparent';
  }
  
  if (relationToChild === 'guardian') {
    return 'Guardian';
  }
  
  if (relationToChild === 'sibling') {
    if (genderKey === 'female') return 'Big Sis';
    if (genderKey === 'male') return 'Big Bro';
    return 'Older Sibling';
  }
  
  // Default parent (fallback to role for backward compat)
  const role = gameState.parentRole || gameState.parent?.role || 'mom';
  if (genderKey === 'female') return 'Mom';
  if (genderKey === 'male') return 'Dad';
  return role === 'mom' ? 'Mom' : 'Dad';
}

export function getRoleLabel(person, gameState, opts = {}) {
  if (!person) return '';
  
  const short = opts.short ?? false;
  const gp = getGuardianPerspective(gameState);
  const childName = gameState.childName;
  
  // Child
  if (person.id === 'child' || person.role === 'child') {
    return getChildRoleLabel(gameState, opts);
  }
  
  // Partner (spouse when married, else use bond labels)
  if (person.role === 'partner') {
    const married = gameState.partnerRelationship?.status === 'married';
    if (married) {
      const genderKey = person.genderKey || person.avatarGenderKey;
      if (genderKey === 'female') return short ? 'Wife' : 'Your Wife';
      if (genderKey === 'male') return short ? 'Husband' : 'Your Husband';
      return short ? 'Spouse' : 'Your Spouse';
    }
    
    // Caregiver bond labels
    const bond = gameState.caregiverMeta?.bond;
    if (bond === 'coparents') return short ? 'Co-parent' : 'Your Co-parent';
    if (bond === 'coguardians') return short ? 'Co-guardian' : 'Your Co-guardian';
    if (bond === 'family') return short ? 'Co-caregiver' : 'Your Co-caregiver';
    
    return short ? 'Partner' : 'Your Partner';
  }
  
  // Wife/Husband
  if (person.role === 'wife') return 'Wife';
  if (person.role === 'husband') return 'Husband';
  
  // Mother/Father of child (not current partner)
  if (person.role === 'mother_of_child') {
    return getOtherParentLabel(gameState, 'mother_of_child', opts);
  }
  if (person.role === 'father_of_child') {
    return getOtherParentLabel(gameState, 'father_of_child', opts);
  }
  
  // My parents (become in-laws when viewing as partner)
  if (person.role === 'my_mom') {
    if (gp.side === 'partner') {
      return short ? 'Mother-in-law' : 'Mother-in-law';
    }
    return short ? 'Mom' : 'Your Mom';
  }
  
  if (person.role === 'my_dad') {
    if (gp.side === 'partner') {
      return short ? 'Father-in-law' : 'Father-in-law';
    }
    return short ? 'Dad' : 'Your Dad';
  }
  
  // In-laws (become parents when viewing as partner)
  if (person.role === 'inlaw_mom') {
    if (gp.side === 'partner') {
      return short ? 'Mom' : 'Your Mom';
    }
    return 'Mother-in-law';
  }
  
  if (person.role === 'inlaw_dad') {
    if (gp.side === 'partner') {
      return short ? 'Dad' : 'Your Dad';
    }
    return 'Father-in-law';
  }
  
  // Siblings (check familySide)
  if (person.role === 'sibling') {
    const personSide = person.familySide || 'player';
    const gpSide = gp.side || 'player';
    
    // Determine gender
    const genderKey = person.genderKey || person.avatarGenderKey;
    const isFemale = genderKey === 'female';
    const isMale = genderKey === 'male';
    
    if (personSide !== gpSide) {
      // In-law sibling
      if (isFemale) return short ? 'Sister-in-law' : 'Sister-in-law';
      if (isMale) return short ? 'Brother-in-law' : 'Brother-in-law';
      return short ? 'Sibling-in-law' : 'Sibling-in-law';
    }
    
    // Regular sibling
    if (isFemale) return short ? 'Sister' : 'Your Sister';
    if (isMale) return short ? 'Brother' : 'Your Brother';
    return 'Sibling';
  }
  
  // Teacher
  if (person.role === 'teacher') {
    if (gp.relationToChild === 'grandparent') {
      return childName ? `${childName}'s Teacher` : "Grandchild's Teacher";
    }
    return childName ? `${childName}'s Teacher` : "Child's Teacher";
  }
  
  // Best friend (child's friend)
  if (person.role === 'best_friend') {
    if (gp.relationToChild === 'grandparent') {
      return childName ? `${childName}'s Friend` : "Grandchild's Friend";
    }
    return childName ? `${childName}'s Friend` : "Child's Friend";
  }
  
  // My best friend
  if (person.role === 'my_best_friend') {
    return short ? 'Best Friend' : 'Your Best Friend';
  }
  
  // Friend
  if (person.role === 'friend') {
    return 'Friend';
  }
  
  // Late guardian
  if (person.role === 'late_guardian') {
    return 'Late Guardian';
  }
  
  // Side partner
  if (person.role === 'side_partner') {
    return 'Side Partner';
  }
  
  // Fallback
  return String(person.role || '').replaceAll('_', ' ');
}

/**
 * Get death-friendly relationship phrase for timeline/popup titles.
 * Returns lowercase sentence-friendly phrases like "your mother", "your partner", etc.
 */
export function getDeathRelationPhrase(person, gameState) {
  if (!person) return 'family member';
  
  const role = person.role || person.id;
  const gp = getGuardianPerspective(gameState);
  
  // Legacy support
  if (role === 'mother' || role === 'my_mom') {
    return 'your mother';
  }
  if (role === 'father' || role === 'my_dad') {
    return 'your father';
  }
  
  // Partner (check if married)
  if (role === 'partner') {
    const married = gameState.partnerRelationship?.status === 'married';
    if (married) {
      const genderKey = person.genderKey || person.avatarGenderKey;
      if (genderKey === 'female') return 'your wife';
      if (genderKey === 'male') return 'your husband';
      return 'your spouse';
    }
    return 'your partner';
  }
  
  // In-laws
  if (role === 'inlaw_mom') return 'your mother-in-law';
  if (role === 'inlaw_dad') return 'your father-in-law';
  
  // Child (respect guardian perspective)
  if (role === 'child') {
    if (gp.relationToChild === 'grandparent') return 'your grandchild';
    if (gp.relationToChild === 'guardian') return 'your ward';
    return 'your child';
  }
  
  // Friends
  if (role === 'my_best_friend') return 'your best friend';
  if (role === 'friend') return 'your friend';
  
  // Fallback
  return 'family member';
}