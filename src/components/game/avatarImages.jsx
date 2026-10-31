// Avatar sprite sheet mapping by gender and life stage (4 columns x 4 rows, 16 frames).
// Grid layout: 4x4 (16 avatars), 256x256 cells, padding=16px, spacing=8px.

const BASE_PREFIX = '/demo-art.svg';

export const AVATAR_SHEETS = {
  male: {
    baby: "/demo-art.svg",
    child: "/demo-art.svg",
    teen: "/demo-art.svg",
    adult: "/demo-art.svg",
    middle: "/demo-art.svg",
    retire: "/demo-art.svg",
    senior: "/demo-art.svg",
  },
  female: {
    baby: "/demo-art.svg",
    child: "/demo-art.svg",
    teen: "/demo-art.svg",
    adult: "/demo-art.svg",
    middle: "/demo-art.svg",
    retire: "/demo-art.svg",
    senior: "/demo-art.svg",
  }
};

// Variant sheets: portraits, styles, special states
export const VARIANT_SHEETS = {
  male: {
    kid_bruised: "/demo-art.svg",
    kid_happy: "/demo-art.svg",
    teen_punk: "/demo-art.svg",
    teen_preppy: "/demo-art.svg",
    teen_punkrock: "/demo-art.svg",
    teen_emo: "/demo-art.svg",
    teen_skater: "/demo-art.svg",
    teen_streetwear: "/demo-art.svg",
    teen_base: "/demo-art.svg",
    adult_base1: "/demo-art.svg",
    adult_base2: "/demo-art.svg",
    adult_base3: "/demo-art.svg",
    adult_base4: "/demo-art.svg",
    adult_base5: "/demo-art.svg",
    adult_pompadour: "/demo-art.svg",
    adult_curtains: "/demo-art.svg",
    adult_frenchcourt: "/demo-art.svg",
    adult_minimalist: "/demo-art.svg",
    adult_comfort_first: "/demo-art.svg",
    adult_corporate: "/demo-art.svg",
    adult_streetwear: "/demo-art.svg",
    adult_punk: "/demo-art.svg",
    adult_startup_casual: "/demo-art.svg",
    adult_undercut: "/demo-art.svg",
  },
  female: {
    kid_bruised: "/demo-art.svg",
    kid_happy: "/demo-art.svg",
    teen_punk: "/demo-art.svg",
    teen_preppy: "/demo-art.svg",
    teen_punkrock: "/demo-art.svg",
    teen_emo: "/demo-art.svg",
    teen_base: "/demo-art.svg",
    adult_base1: "/demo-art.svg",
    adult_base2: "/demo-art.svg",
    adult_base3: "/demo-art.svg",
    adult_base4: "/demo-art.svg",
    adult_comfort_first: "/demo-art.svg",
    teen_streetwear: "/demo-art.svg",
    teen_emo: "/demo-art.svg",
  }
};

// Special-start specific female adult sheet overrides (scoped only to those runs)
export const SPECIAL_START_AVATAR_SHEETS = {
  war_zone: {
    female: {
      adult:   "/demo-art.svg",
      middle:  "/demo-art.svg",
      retire:  "/demo-art.svg",
      senior:  "/demo-art.svg",
      fallback_hijabnormal: "/demo-art.svg"
    }
  },
  refugee_camp: {
    female: {
      adult:   "/demo-art.svg",
      middle:  "/demo-art.svg",
      retire:  "/demo-art.svg",
      senior:  "/demo-art.svg",
      fallback_hijabnormal: "/demo-art.svg"
    }
  }
};

// Helper to pick an avatar sheet URL based on numeric age (years) and gender key
// genderKey: 'male' | 'female' (defaults to 'male' when missing/unknown)
export function getAvatarSheetForAge(age, genderKey = 'male') {
  const g = (genderKey === 'female' || genderKey === 'male') ? genderKey : 'male';
  const sets = AVATAR_SHEETS[g] || AVATAR_SHEETS.male;
  const a = Number(age) || 0;
  if (a <= 2) return sets.baby;
  if (a <= 9) return sets.child;
  if (a <= 17) return sets.teen;
  if (a <= 35) return sets.adult;
  if (a <= 55) return sets.middle;
  if (a <= 70) return sets.retire;
  return sets.senior;
}

// Advanced sheet resolver supporting variants and styles
export function getAvatarSheetUrl({ age, genderKey = 'male', variantId = null, styleId = null }) {
  const g = (genderKey === 'female' || genderKey === 'male') ? genderKey : 'male';
  const a = Number(age) || 0;
  
  // Stage detection
  const stage = 
    (a <= 2) ? 'baby'
    : (a <= 9) ? 'child'
    : (a <= 17) ? 'teen'
    : (a <= 35) ? 'adult'
    : (a <= 55) ? 'middle'
    : (a <= 70) ? 'retire'
    : 'senior';

  // Variant/portrait override
  if (variantId) {
    const variant = VARIANT_SHEETS[g]?.[variantId];
    if (variant) return variant;
  }

  // Style override for specific stages
  if (styleId) {
    if (stage === 'teen') {
      const key = styleId === 'punk' ? 'teen_punk' : 'teen_base';
      const variant = VARIANT_SHEETS[g]?.[key];
      if (variant) return variant;
    }
    if (stage === 'adult') {
      const key = `adult_${styleId}`;
      const variant = VARIANT_SHEETS[g]?.[key];
      if (variant) return variant;
    }
  }

  // Default base sheet
  return getAvatarSheetForAge(age, genderKey);
}

// Portrait resolver for scenario portraits
export function getPortraitSheetUrl(portraitKey, genderKey = 'male') {
  const g = (genderKey === 'female' || genderKey === 'male') ? genderKey : 'male';
  return VARIANT_SHEETS[g]?.[portraitKey] || null;
}