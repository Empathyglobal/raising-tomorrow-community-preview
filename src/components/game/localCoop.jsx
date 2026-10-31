// Local Co-Op helpers (pure module, no React, no circular deps)
// Used by GameStateContext + UI to manage two-player household Focus splitting

// Internal helpers
function clampInt(n, min, max) {
  const val = Math.floor(Number(n) || 0);
  return Math.max(min, Math.min(max, val));
}

function safeNum(n, fallback = 0) {
  const val = Number(n);
  return Number.isFinite(val) ? val : fallback;
}

function toBool(v) {
  return v === true || v === 1 || v === '1' || v === 'true';
}

// Default state shape
export const DEFAULT_LOCAL_COOP_STATE = {
  enabled: false,
  activeSide: 'player', // 'player' | 'partner'
  focus: {
    householdMax: 0,
    householdRemaining: 0,
    playerMax: 0,
    partnerMax: 0,
    playerRemaining: 0,
    partnerRemaining: 0
  },
  tookTurnThisAge: { player: false, partner: false },
  lastSwitchAtAge: null
};

// Get opposite side
export function getOtherSide(side) {
  return (side === 'player') ? 'partner' : 'player';
}

// Split household max focus into player + partner pools
export function splitHouseholdMax(householdMax) {
  const total = clampInt(householdMax, 0, 999);
  const playerMax = Math.ceil(total / 2);
  const partnerMax = total - playerMax;
  return { householdMax: total, playerMax, partnerMax };
}

// Split household remaining focus into player + partner pools
export function splitHouseholdRemaining(householdRemaining) {
  const remaining = clampInt(householdRemaining, 0, 999);
  const playerRemaining = Math.ceil(remaining / 2);
  const partnerRemaining = remaining - playerRemaining;
  return { householdRemaining: remaining, playerRemaining, partnerRemaining };
}

// Build complete focus object with safe clamping
export function buildCoopFocus({ householdMax, householdRemaining }) {
  // Normalize inputs
  const max = clampInt(householdMax, 0, 999);
  const rem = clampInt(householdRemaining, 0, 999);
  
  // Clamp remaining <= max
  const safeRemaining = Math.min(rem, max);
  
  // Split max and remaining
  const splitMax = splitHouseholdMax(max);
  const splitRem = splitHouseholdRemaining(safeRemaining);
  
  // Ensure individual pools don't exceed their max
  const playerRemaining = Math.min(splitRem.playerRemaining, splitMax.playerMax);
  const partnerRemaining = Math.min(splitRem.partnerRemaining, splitMax.partnerMax);
  
  // Recompute household remaining post-clamp
  const finalHouseholdRemaining = playerRemaining + partnerRemaining;
  
  return {
    householdMax: splitMax.householdMax,
    householdRemaining: finalHouseholdRemaining,
    playerMax: splitMax.playerMax,
    partnerMax: splitMax.partnerMax,
    playerRemaining,
    partnerRemaining
  };
}

// Ensure coop state is safe and normalized
export function ensureLocalCoopState(coop) {
  if (!coop || typeof coop !== 'object') {
    return { ...DEFAULT_LOCAL_COOP_STATE };
  }
  
  // Normalize activeSide
  const rawSide = String(coop.activeSide || '').toLowerCase();
  const activeSide = (rawSide === 'partner') ? 'partner' : 'player';
  
  // Normalize focus (preserve per-parent pools)
  const rawFocus = (coop.focus && typeof coop.focus === 'object') ? coop.focus : {};

  const rawPlayerMax = safeNum(rawFocus.playerMax, NaN);
  const rawPartnerMax = safeNum(rawFocus.partnerMax, NaN);
  const hasSplitMax = Number.isFinite(rawPlayerMax) && Number.isFinite(rawPartnerMax);

  let playerMax;
  let partnerMax;
  let householdMax;

  if (hasSplitMax) {
    playerMax = clampInt(rawPlayerMax, 0, 999);
    partnerMax = clampInt(rawPartnerMax, 0, 999);
    householdMax = clampInt(playerMax + partnerMax, 0, 999);
  } else {
    const hMax = clampInt(safeNum(rawFocus.householdMax, 0), 0, 999);
    const split = splitHouseholdMax(hMax);
    householdMax = split.householdMax;
    playerMax = split.playerMax;
    partnerMax = split.partnerMax;
  }

  const rawPlayerRem = safeNum(rawFocus.playerRemaining, NaN);
  const rawPartnerRem = safeNum(rawFocus.partnerRemaining, NaN);
  const hasSplitRem = Number.isFinite(rawPlayerRem) && Number.isFinite(rawPartnerRem);

  let playerRemaining;
  let partnerRemaining;

  if (hasSplitRem) {
    playerRemaining = clampInt(rawPlayerRem, 0, playerMax);
    partnerRemaining = clampInt(rawPartnerRem, 0, partnerMax);
  } else {
    const hRemInput = Number.isFinite(Number(rawFocus.householdRemaining))
      ? clampInt(rawFocus.householdRemaining, 0, householdMax)
      : householdMax;

    const splitRem = splitHouseholdRemaining(hRemInput);
    playerRemaining = Math.min(splitRem.playerRemaining, playerMax);
    partnerRemaining = Math.min(splitRem.partnerRemaining, partnerMax);

    // If clamping reduced the total below desired householdRemaining, fill remaining capacity
    let desired = hRemInput;
    let sum = playerRemaining + partnerRemaining;
    let leftover = Math.max(0, desired - sum);

    if (leftover > 0) {
      const roomP = playerMax - playerRemaining;
      const addP = Math.min(roomP, leftover);
      playerRemaining += addP;
      leftover -= addP;
    }
    if (leftover > 0) {
      const roomQ = partnerMax - partnerRemaining;
      const addQ = Math.min(roomQ, leftover);
      partnerRemaining += addQ;
      leftover -= addQ;
    }
  }

  const householdRemaining = clampInt(playerRemaining + partnerRemaining, 0, householdMax);

  const focus = {
    householdMax,
    householdRemaining,
    playerMax,
    partnerMax,
    playerRemaining,
    partnerRemaining
  };
  
  // Normalize tookTurnThisAge
  const rawTook = (coop.tookTurnThisAge && typeof coop.tookTurnThisAge === 'object') ? coop.tookTurnThisAge : {};
  const tookTurnThisAge = {
    player: toBool(rawTook.player),
    partner: toBool(rawTook.partner)
  };
  
  // Normalize lastSwitchAtAge
  const rawSwitch = safeNum(coop.lastSwitchAtAge, null);
  const lastSwitchAtAge = Number.isFinite(rawSwitch) ? Math.floor(rawSwitch) : null;
  
  return {
    enabled: toBool(coop.enabled),
    activeSide,
    focus,
    tookTurnThisAge,
    lastSwitchAtAge
  };
}

// Check if local coop is enabled
export function isLocalCoopEnabled(gameState) {
  if (!gameState || typeof gameState !== 'object') return false;
  const coop = gameState.coop;
  if (!coop || typeof coop !== 'object') return false;
  return toBool(coop.enabled);
}

// Check if local coop is eligible (household requirements)
export function isLocalCoopEligible(gameState) {
  if (!gameState || typeof gameState !== 'object') return false;
  
  // Must be two-parent household
  if (gameState.householdType !== 'two') return false;
  
  // Must have a partner identity
  const partnerName = String(gameState.partnerName || '').trim();
  const partnerRel = gameState.relationships?.byId?.partner;
  const hasPartner = (partnerName.length > 0) || (partnerRel && typeof partnerRel === 'object');
  if (!hasPartner) return false;
  
  // Must NOT be in prison
  const prison = gameState.prison;
  if (prison && typeof prison === 'object' && toBool(prison.active)) return false;
  
  return true;
}

// Check if the active side can pass their turn to the other side
export function canPassLocalCoopTurn(gameState) {
  if (!gameState || typeof gameState !== 'object') return false;

  // Must be enabled and eligible
  if (!isLocalCoopEnabled(gameState)) return false;
  if (!isLocalCoopEligible(gameState)) return false;

  const coop = ensureLocalCoopState(gameState.coop);

  // Allow exactly ONE pass per age, in either direction.
  // Start of age: tookTurnThisAge.player=false AND tookTurnThisAge.partner=false.
  // When the active side passes, we mark that side as true and flip activeSide.
  // That makes this function return false for the rest of the age.
  const activeSide = coop.activeSide === 'partner' ? 'partner' : 'player';
  const otherSide = getOtherSide(activeSide);
  const took = coop.tookTurnThisAge || { player: false, partner: false };

  return !toBool(took[activeSide]) && !toBool(took[otherSide]);
}

// Derive partner role from parent role
export function derivePartnerRole(parentRole) {
  const role = String(parentRole || '').toLowerCase();
  if (role === 'mom') return 'dad';
  if (role === 'dad') return 'mom';
  return parentRole; // fallback
}

// Get display name for a side
export function getCoopSideDisplayName(gameState, side) {
  if (!gameState || typeof gameState !== 'object') {
    return (side === 'player') ? 'You' : 'Partner';
  }
  
  if (side === 'player') {
    const name = String(gameState.parentName || '').trim();
    if (name) return name;
    
    const playerRel = gameState.relationships?.byId?.player;
    if (playerRel && playerRel.name) return String(playerRel.name).trim();
    
    return 'You';
  }
  
  // side === 'partner'
  const name = String(gameState.partnerName || '').trim();
  if (name) return name;
  
  const partnerRel = gameState.relationships?.byId?.partner;
  if (partnerRel && partnerRel.name) return String(partnerRel.name).trim();
  
  return 'Partner';
}

// Get role for a side
export function getCoopSideRole(gameState, side) {
  if (!gameState || typeof gameState !== 'object') {
    return (side === 'player') ? 'parent' : 'parent';
  }
  
  if (side === 'player') {
    return gameState.parentRole || 'parent';
  }
  
  // side === 'partner'
  return derivePartnerRole(gameState.parentRole || 'parent');
}

// Get current age for a side
export function getCoopSideAge(gameState, side) {
  if (!gameState || typeof gameState !== 'object') return 28;
  
  const currentYear = safeNum(gameState.currentYear, 0);
  
  if (side === 'player') {
    const base = safeNum(gameState.parentAgeAtBirth, 28);
    return Math.floor(base + currentYear);
  }
  
  // side === 'partner'
  const base = safeNum(gameState.partnerAgeAtBirth, 28);
  return Math.floor(base + currentYear);
}

// Get avatar metadata for a side
export function getCoopSideAvatarMeta(gameState, side) {
  if (!gameState || typeof gameState !== 'object') {
    return { emoji: '🙂', genderKey: 'neutral', spriteIndex: null };
  }
  
  if (side === 'player') {
    const emoji = gameState.parentAvatar || '🙂';
    
    let genderKey = gameState.parentAvatarGender;
    if (!genderKey) {
      const role = String(gameState.parentRole || '').toLowerCase();
      genderKey = (role === 'dad') ? 'male' : (role === 'mom') ? 'female' : 'neutral';
    }
    
    const rawIndex = Number(gameState.parentAvatarSpriteIndex);
    const spriteIndex = Number.isFinite(rawIndex) ? Math.floor(rawIndex) : null;
    
    return { emoji, genderKey, spriteIndex };
  }
  
  // side === 'partner'
  const emoji = gameState.partnerEmoji || '🙂';
  
  let genderKey = gameState.partnerAvatarGender;
  if (!genderKey) {
    const parentRole = String(gameState.parentRole || '').toLowerCase();
    const partnerRole = derivePartnerRole(parentRole);
    genderKey = (partnerRole === 'dad') ? 'male' : (partnerRole === 'mom') ? 'female' : 'neutral';
  }
  
  const rawIndex = Number(gameState.partnerAvatarSpriteIndex);
  const spriteIndex = Number.isFinite(rawIndex) ? Math.floor(rawIndex) : null;
  
  return { emoji, genderKey, spriteIndex };
}

// Get household focus metadata (display helper)
export function getCoopHouseholdFocusMeta(gameState) {
  if (!isLocalCoopEnabled(gameState)) return null;
  
  const coop = ensureLocalCoopState(gameState?.coop);
  const focus = coop.focus || buildCoopFocus({ householdMax: 0, householdRemaining: 0 });
  
  const activeSide = coop.activeSide;
  const activeMax = (activeSide === 'player') ? focus.playerMax : focus.partnerMax;
  const activeRemaining = (activeSide === 'player') ? focus.playerRemaining : focus.partnerRemaining;
  
  return {
    activeSide,
    householdMax: focus.householdMax,
    householdRemaining: focus.householdRemaining,
    playerMax: focus.playerMax,
    partnerMax: focus.partnerMax,
    playerRemaining: focus.playerRemaining,
    partnerRemaining: focus.partnerRemaining,
    activeMax,
    activeRemaining
  };
}