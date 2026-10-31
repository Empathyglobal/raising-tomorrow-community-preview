const STORAGE_KEY = 'rt_character_presets_v1';
const MAX_PRESETS = 25;

export function loadCharacterPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCharacterPreset(preset) {
  try {
    let presets = loadCharacterPresets();
    
    const existing = presets.findIndex(p => p.id === preset.id);
    const now = Date.now();
    
    const savedPreset = {
      ...preset,
      updatedAt: now,
      createdAt: preset.createdAt || now
    };
    
    if (existing >= 0) {
      presets[existing] = savedPreset;
    } else {
      presets.push(savedPreset);
    }
    
    // Keep max 25 presets, drop oldest by updatedAt
    if (presets.length > MAX_PRESETS) {
      presets.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      presets = presets.slice(0, MAX_PRESETS);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    return savedPreset;
  } catch (err) {
    console.error('Failed to save character preset:', err);
    return preset;
  }
}

export function deleteCharacterPreset(id) {
  try {
    let presets = loadCharacterPresets();
    presets = presets.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.error('Failed to delete character preset:', err);
  }
}

export function makeNewPresetId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}