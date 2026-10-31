// Portrait Mod: runtime config and tuning

export const TEEN_STYLE_DRIFT = {
  // If teen currently has a non-base style:
  driftChancePerYear: 0.35,          // 35% chance each year
  revertShare: 0.60,                 // 60% of drift events revert to base
  switchShare: 0.40,                 // 40% switch to another style
  
  // If teen is base:
  spontaneousAdoptChancePerYear: 0.08 // 8% chance they randomly try a style
};

export const ADULT_STYLE_CHANGE_COST = 500;