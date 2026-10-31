// Auto-choose yearly moments based on Parenting Style
// Returns { choice, explanation, debug } or null

import { EARLY_PARENTING_STYLE_RULES } from './earlyParentingStyleV1';
import { WISDOM_LENSES, getWisdomTier as getWisdomTierFromCatalog } from './wisdomLensesCatalog';

/**
 * Pick the best A-E choice for the player's parenting style.
 * 
 * @param {Object} params
 * @param {Object} params.gameState - Current game state
 * @param {Object} params.scenario - Current scenario with choices[]
 * @returns {{ choice: Object, explanation: string, debug: Object }} or null
 */
export function pickAutoChoiceByParentingStyle({ gameState, scenario }) {
  if (!gameState || !scenario) return null;
  
  const choices = scenario?.choices || [];
  if (!choices.length) return null;
  
  // Parenting style preference mapping
  const styleId = String(gameState.parentingStyle?.id || 'unsure');
  const styleRules = EARLY_PARENTING_STYLE_RULES[styleId] || null;
  const styleLabel = gameState.parentingStyle?.label || 'Unsure';
  
  // Default preference order
  const defaultPreferred = ['connect', 'teach', 'boundary', 'avoid'];
  const preferredRoles = styleRules?.preferredRoles || defaultPreferred;
  
  // Compute eligible choices (same lock logic as ScenarioModal ChoiceButton)
  const eligible = choices.filter(c => {
    const role = c.role || 'default';
    const letter = c.letter || '?';
    const focusCost = Number(c.focusCost ?? ((String(letter).toUpperCase() === 'A' && !scenario?.meta?.noFocusCostForA) ? 1 : 0));
    const focus = Number(gameState.actionPoints ?? 0);
    const stress = Number(gameState.stress ?? 0);
    const currentAge = Number(gameState.currentYear ?? 0);
    
    // Focus lock
    if (focusCost > 0 && focus < focusCost) return false;
    
    // Study lock (for teach)
    if (role === 'teach') {
      let requiredStudy = 0;
      if (currentAge >= 6 && currentAge <= 9) requiredStudy = 1;
      else if (currentAge >= 10 && currentAge <= 12) requiredStudy = 2;
      else if (currentAge >= 13 && currentAge <= 15) requiredStudy = 4;
      else if (currentAge >= 16) requiredStudy = 6;
      
      const wisdomXp = gameState?.wisdom?.xp || {};
      const equippedLenses = gameState?.wisdom?.equipped || [];
      const mindfulnessActive = equippedLenses.includes('mindfulness');
      const mindfulnessTier = mindfulnessActive ? Number(getWisdomTierFromCatalog('mindfulness', wisdomXp) || 0) : 0;
      
      const studyPoints = Number(gameState.studyPoints ?? 0);
      if (studyPoints < requiredStudy) return false;
    }
    
    // Stress locks (with mindfulness softening)
    const wisdomXp = gameState?.wisdom?.xp || {};
    const equippedLenses = gameState?.wisdom?.equipped || [];
    const mindfulnessActive = equippedLenses.includes('mindfulness');
    const mindfulnessTier = mindfulnessActive ? Number(getWisdomTierFromCatalog('mindfulness', wisdomXp) || 0) : 0;
    
    const connectStressCap = 40 + (mindfulnessTier * 5);
    const teachStressCap = 65 + (mindfulnessTier * 5);
    
    if (role === 'connect' && stress > connectStressCap) return false;
    if (role === 'teach' && stress > teachStressCap) return false;
    if (role === 'boundary' && stress >= 100) return false;
    
    return true;
  });
  
  if (!eligible.length) return null;
  
  // First pass: try preferred roles in order
  for (const preferredRole of preferredRoles) {
    const match = eligible.find(c => c.role === preferredRole);
    if (match) {
      const explanation = `Will auto‑choose Option ${match.letter} because your parenting style (${styleLabel}) prioritizes '${preferredRole}' responses in moments like this.`;
      return {
        choice: match,
        explanation,
        debug: {
          styleId,
          styleLabel,
          preferredRoles,
          chosenRole: preferredRole
        }
      };
    }
  }
  
  // Fallback: pick first eligible non-harm
  const nonHarm = eligible.filter(c => c.role !== 'harm');
  if (nonHarm.length) {
    const fallback = nonHarm[0];
    const explanation = `Will auto‑choose Option ${fallback.letter} because your preferred '${preferredRoles[0]}' options are locked (stress/study/focus). Falling back to '${fallback.role}'.`;
    return {
      choice: fallback,
      explanation,
      debug: {
        styleId,
        styleLabel,
        preferredRoles,
        chosenRole: fallback.role,
        fallbackUsed: true
      }
    };
  }
  
  // Last resort: first eligible (even if harm)
  if (eligible.length) {
    const lastResort = eligible[0];
    const explanation = `Will auto‑choose Option ${lastResort.letter} (only eligible option right now).`;
    return {
      choice: lastResort,
      explanation,
      debug: {
        styleId,
        styleLabel,
        preferredRoles,
        chosenRole: lastResort.role,
        lastResort: true
      }
    };
  }
  
  return null;
}