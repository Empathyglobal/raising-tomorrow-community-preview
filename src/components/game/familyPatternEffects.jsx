// Family Pattern Effects Framework
// Maps pattern IDs to gameplay modifiers (focus capacity, stress drift, outcome tilt)

const PATTERN_MODS = {
  // High Conflict / Chaos
  'HIGH_CONFLICT_HOME': { maxFocusMod: -1, annualStressDrift: 2, playOutcomeTilt: -0.05 },
  'UNPREDICTABLE_CARE': { maxFocusMod: -1, annualStressDrift: 2, playOutcomeTilt: -0.04 },
  'DOMESTIC_VIOLENCE': { maxFocusMod: -1, annualStressDrift: 3, playOutcomeTilt: -0.08 },
  
  // Shame / Pressure
  'PERFECTIONISM_PRESSURE': { maxFocusMod: -1, annualStressDrift: 1, playOutcomeTilt: -0.03 },
  'SHAME_BASED_DISCIPLINE': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.05 },
  'CONDITIONAL_LOVE': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.04 },
  'SIBLING_COMPARISON': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.03 },
  
  // Neglect / Distance
  'EMOTIONAL_NEGLECT': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.04 },
  'EMOTIONAL_INVALIDATION': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.03 },
  'DEVELOPMENTAL_NEGLECT': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.03 },
  
  // Instability / Stress
  'FINANCIAL_INSTABILITY': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.02 },
  'RELOCATION_INSTABILITY': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  'FOOD_INSECURITY': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.03 },
  
  // Control / Enmeshment
  'RIGID_CONTROL': { maxFocusMod: -1, annualStressDrift: 1, playOutcomeTilt: -0.04 },
  'EMOTIONAL_ENMESHMENT': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  'PARENTIFICATION': { maxFocusMod: -1, annualStressDrift: 2, playOutcomeTilt: -0.03 },
  
  // Loss / Grief
  'LOSS_GRIEF_UNPROCESSED': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  'ABANDONMENT': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.05 },
  'CAREGIVER_ILLNESS': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  
  // Boundary / Privacy
  'OVERSHARING_BOUNDARIES': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  'ISOLATION': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.03 },
  
  // Identity / Cultural
  'CULTURAL_IDENTITY_STRESS': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  'RELIGIOUS_TRAUMA': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.04 },
  'HIGH_CONTROL_RELIGION': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.04 },
  
  // Scapegoating / Blame
  'SCAPEGOATING': { maxFocusMod: 0, annualStressDrift: 2, playOutcomeTilt: -0.06 },
  'EMOTIONAL_INCEST': { maxFocusMod: -1, annualStressDrift: 2, playOutcomeTilt: -0.05 },
  
  // Other Trauma
  'MEDICAL_TRAUMA': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.02 },
  'SUBSTANCE_USE': { maxFocusMod: -1, annualStressDrift: 2, playOutcomeTilt: -0.05 },
  'MENTAL_ILLNESS': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.03 },
  'DIVORCE_LOYALTY_CONFLICT': { maxFocusMod: 0, annualStressDrift: 1, playOutcomeTilt: -0.03 },
};

export function getFamilyPatternMods(patternIds) {
  if (!Array.isArray(patternIds) || patternIds.length === 0) {
    return { maxFocusMod: 0, annualStressDrift: 0, playOutcomeTilt: 0 };
  }

  let maxFocusMod = 0;
  let annualStressDrift = 0;
  let playOutcomeTilt = 0;

  for (const id of patternIds) {
    const mods = PATTERN_MODS[id];
    if (!mods) continue; // Unknown pattern → treat as zero

    maxFocusMod += mods.maxFocusMod || 0;
    annualStressDrift += mods.annualStressDrift || 0;
    playOutcomeTilt += mods.playOutcomeTilt || 0;
  }

  // Clamp totals to safe ranges
  maxFocusMod = Math.max(-2, Math.min(2, maxFocusMod));
  annualStressDrift = Math.max(0, Math.min(8, annualStressDrift));
  playOutcomeTilt = Math.max(-0.15, Math.min(0.15, playOutcomeTilt));

  return { maxFocusMod, annualStressDrift, playOutcomeTilt };
}