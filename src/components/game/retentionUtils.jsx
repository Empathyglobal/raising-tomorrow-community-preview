// Utilities for the 5 retention systems
// - State helpers, migrations, and capping functions
// - Used by GameStateContext and retention modals

/**
 * Ensure metaProgress exists with safe defaults
 */
export function ensureMetaProgressState(state) {
  const s = state || {};
  const mp = s.metaProgress || {};
  const c = mp.collections || {};
  
  return {
    ...s,
    metaProgress: {
      collections: {
        kidQuotes: capArray(c.kidQuotes, 200),
        stickers: capArray(c.stickers, 200),
        photos: capArray(c.photos, 200),
        goldenMoments: capArray(c.goldenMoments, 100)
      },
      personalBests: mp.personalBests || {}
    }
  };
}

/**
 * Ensure daily state exists with safe defaults
 */
export function ensureDailyState(state) {
  const s = state || {};
  const d = s.daily || {};
  const di = d.dilemma || {};
  
  return {
    ...s,
    daily: {
      dilemma: {
        lastCompletedDate: di.lastCompletedDate || null,
        streakCount: typeof di.streakCount === 'number' ? di.streakCount : 0,
        paused: Boolean(di.paused),
        lastShownDate: di.lastShownDate || null
      }
    }
  };
}

/**
 * Ensure yearLog exists with safe defaults
 */
export function ensureYearLogState(state) {
  const s = state || {};
  const yl = s.yearLog || {};
  
  return {
    ...s,
    yearLog: {
      events: capArray(yl.events, 50),
      lastYearHighlights: yl.lastYearHighlights || null
    }
  };
}

/**
 * Cap array to max length (keep most recent)
 */
function capArray(arr, max) {
  const a = Array.isArray(arr) ? arr : [];
  if (a.length <= max) return a;
  return a.slice(-max);
}

/**
 * Add a year event to yearLog.events (capped to 50)
 */
export function addYearEvent(state, event) {
  const s = ensureYearLogState(state);
  const events = [...s.yearLog.events, event];
  return {
    ...s,
    yearLog: {
      ...s.yearLog,
      events: capArray(events, 50)
    }
  };
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayDateString() {
  try {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return null;
  }
}

/**
 * Check if date1 is yesterday compared to date2
 */
export function isYesterday(date1Str, date2Str) {
  try {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff === 1;
  } catch {
    return false;
  }
}

/**
 * Add a collectible to metaProgress.collections
 */
export function addCollectible(state, type, item) {
  const s = ensureMetaProgressState(state);
  const col = s.metaProgress.collections;
  
  const updated = {
    ...col,
    [type]: capArray([...(col[type] || []), item], type === 'goldenMoments' ? 100 : 200)
  };
  
  return {
    ...s,
    metaProgress: {
      ...s.metaProgress,
      collections: updated
    }
  };
}