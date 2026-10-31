// Meta-progression: achievements unlocked once persist across all lives.
// Safe in SSR; never throws if localStorage is unavailable.

export const META_ACHIEVEMENTS_STORAGE_KEY = "rt_meta_achievements_v1";

function hasLocalStorage() {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  } catch {
    return false;
  }
}

export function loadMetaAchievements() {
  if (!hasLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(META_ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    // Back-compat: allow ["id1","id2"]
    if (Array.isArray(parsed)) {
      const out = {};
      for (const id of parsed) {
        if (typeof id === "string" && id.trim()) {
          out[id] = { unlockedAt: null };
        }
      }
      return out;
    }

    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

export function saveMetaAchievements(meta) {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(
      META_ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify(meta || {})
    );
  } catch {
    // ignore quota / privacy mode
  }
}

export function unlockMetaAchievement(id, unlockedAt = Date.now()) {
  if (!id || typeof id !== "string") return loadMetaAchievements();
  const meta = loadMetaAchievements();
  if (!meta[id]) {
    meta[id] = { unlockedAt };
    saveMetaAchievements(meta);
  }
  return meta;
}

// Merge meta unlocked into current unlocked representation (array or object).
export function mergeMetaIntoUnlocked(currentUnlocked) {
  const meta = loadMetaAchievements();

  // Array of ids
  if (Array.isArray(currentUnlocked)) {
    const set = new Set(currentUnlocked.filter(Boolean));
    for (const id of Object.keys(meta)) set.add(id);
    return Array.from(set);
  }

  // Object map (id -> payload)
  if (currentUnlocked && typeof currentUnlocked === "object") {
    const merged = { ...currentUnlocked };
    for (const [id, payload] of Object.entries(meta)) {
      if (!merged[id]) merged[id] = payload || { unlockedAt: null };
    }
    return merged;
  }

  // Unknown shape: return meta as map
  return { ...meta };
}