// Portrait Mod: manifest-based opt-in system
// When disabled (default), no UI or gameplay effects are active.

export const PORTRAIT_MOD_ID = "portrait_mod";

// Embedded manifest (since we can't use public/ folder)
const EMBEDDED_MANIFEST = {
  enabled: false,
  version: 1,
  assetBaseUrl: "/demo-art.svg",
  assets: {
    male_teen_phase_allergy: "/demo-art.svg",
    female_teen_phase_braces: "/demo-art.svg",
    male_teen_phase_acne: "/demo-art.svg",
    female_teen_phase_chapped_lips: "/demo-art.svg",
    female_teen_phase_acne: "/demo-art.svg",
    female_teen_phase_allergy: "/demo-art.svg",
    female_teen_phase_glasses: "/demo-art.svg",
    female_teen_phase_sunburn: "/demo-art.svg",
    male_teen_phase_glasses: "/demo-art.svg",
    male_teen_phase_braces: "/demo-art.svg",
    male_teen_phase_chapped_lips: "/demo-art.svg",
    male_teen_phase_sunburn: "/demo-art.svg"
  }
};

/**
 * Loads the portrait mod manifest.
 * Returns { enabled: boolean, manifest: object | null }
 * Safe: never throws. Uses embedded manifest (disabled by default).
 */
export async function loadPortraitModManifest() {
  try {
    // Use embedded manifest (always available, disabled by default)
    const enabled = EMBEDDED_MANIFEST?.enabled === true;
    return { enabled, manifest: EMBEDDED_MANIFEST };
  } catch (e) {
    console.warn('[Portrait Mod] Manifest load failed (treating as disabled):', e);
    return { enabled: false, manifest: null };
  }
}

/**
 * Resolves a portrait mod sheet URL from manifest.
 * Returns URL string or null if not available.
 * 
 * @param {object} params
 * @param {string} params.genderKey - 'male' | 'female'
 * @param {string} params.setKey - style/portrait key (e.g., 'teen_style_punk', 'kid_injury_bruised')
 * @param {object} params.manifest - loaded manifest object
 * @returns {string | null}
 */
export function resolvePortraitModSheetUrl({ genderKey, setKey, manifest }) {
  if (!manifest || !setKey) return null;
  
  const gender = (genderKey === 'female' || genderKey === 'male') ? genderKey : 'male';
  
  // Check explicit asset mapping first
  const assets = manifest?.assets || {};
  const fullKey = `${gender}_${setKey}`;
  if (assets[fullKey]) return assets[fullKey];
  
  // Construct from base URL if available
  const baseUrl = manifest?.assetBaseUrl;
  if (baseUrl && typeof baseUrl === 'string') {
    return `${baseUrl}/${fullKey}.png`;
  }
  
  return null;
}