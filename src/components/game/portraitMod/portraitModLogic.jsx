// Portrait Mod: style drift logic and lifecycle management

import { TEEN_STYLE_KEYS } from './portraitModCatalog';
import { TEEN_STYLE_DRIFT } from './portraitModConfig';
import { resolvePortraitModSheetUrl } from './portraitMod';

/**
 * Check if a teen style sheet is available (can be loaded).
 * Returns true if the image exists, false otherwise.
 */
async function isTeenStyleAvailable({ genderKey, setKey, manifest }) {
  if (!setKey || setKey === 'teen_base') return true; // base is always available
  
  const url = resolvePortraitModSheetUrl({ genderKey, setKey, manifest });
  if (!url) return false;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout fallback
    setTimeout(() => resolve(false), 3000);
  });
}

/**
 * Process teen style drift for the current year.
 * Only runs when Portrait Mod is enabled and child is in teen age range (13-17).
 * 
 * @param {object} params
 * @param {object} params.gameState
 * @param {object} params.manifest
 * @param {function} params.rng - Seeded RNG function (returns 0-1)
 * @returns {Promise<object>} { changed: boolean, fromKey, toKey, reason: "revert"|"switch"|"adopt"|null }
 */
export async function maybeDriftTeenStyle({ gameState, manifest, rng }) {
  const age = Number(gameState.currentYear ?? 0);
  
  // Age gate: teen only
  if (age < 13 || age > 17) {
    return { changed: false, fromKey: null, toKey: null, reason: null };
  }
  
  const currentKey = gameState.portraitModState?.childTeenStyleKey || 'teen_base';
  const isBase = currentKey === 'teen_base';
  const childGender = gameState.childAvatarGender === 'girl' ? 'female' : 'male';
  
  // Determine if drift happens
  const driftChance = isBase 
    ? TEEN_STYLE_DRIFT.spontaneousAdoptChancePerYear 
    : TEEN_STYLE_DRIFT.driftChancePerYear;
  
  if (rng() > driftChance) {
    return { changed: false, fromKey: currentKey, toKey: currentKey, reason: null };
  }
  
  // Drift triggered!
  if (isBase) {
    // Spontaneous adopt: pick a random available style
    const available = [];
    for (const key of TEEN_STYLE_KEYS) {
      const ok = await isTeenStyleAvailable({ genderKey: childGender, setKey: key, manifest });
      if (ok) available.push(key);
    }
    
    if (available.length === 0) {
      return { changed: false, fromKey: currentKey, toKey: currentKey, reason: null };
    }
    
    const picked = available[Math.floor(rng() * available.length)];
    return { changed: true, fromKey: currentKey, toKey: picked, reason: 'adopt' };
  } else {
    // Drift from styled: revert or switch
    const rollRevert = rng() < TEEN_STYLE_DRIFT.revertShare;
    
    if (rollRevert) {
      // Revert to base
      return { changed: true, fromKey: currentKey, toKey: 'teen_base', reason: 'revert' };
    } else {
      // Switch to another style
      const otherKeys = TEEN_STYLE_KEYS.filter(k => k !== currentKey);
      const available = [];
      for (const key of otherKeys) {
        const ok = await isTeenStyleAvailable({ genderKey: childGender, setKey: key, manifest });
        if (ok) available.push(key);
      }
      
      if (available.length === 0) {
        // No other styles available; revert to base
        return { changed: true, fromKey: currentKey, toKey: 'teen_base', reason: 'revert' };
      }
      
      const picked = available[Math.floor(rng() * available.length)];
      return { changed: true, fromKey: currentKey, toKey: picked, reason: 'switch' };
    }
  }
}

/**
 * Check if teen style should reset to base on becoming adult.
 * Returns { shouldReset: boolean, fromKey }
 */
export function shouldResetTeenStyleOnAdulthood({ gameState, prevAge, newAge }) {
  // Trigger on teen -> adult transition
  if (prevAge < 18 && newAge >= 18) {
    const currentKey = gameState.portraitModState?.childTeenStyleKey || 'teen_base';
    if (currentKey !== 'teen_base') {
      return { shouldReset: true, fromKey: currentKey };
    }
  }
  
  return { shouldReset: false, fromKey: null };
}