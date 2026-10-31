import { CHILD_SLICE_KEYS, createKid, makeKidId } from "./kidModel";

/** Defensive "hasOwn" */
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** Shallow clone helpers (keeps reducers predictable without assuming Immer) */
function clone(obj) {
  return { ...obj };
}
function cloneArr(arr) {
  return Array.isArray(arr) ? [...arr] : [];
}

/**
 * Ensures expansions.siblingRivalry exists (OFF by default).
 */
function ensureExpansionsContainer(state) {
  let s = state;
  if (!s.expansions || typeof s.expansions !== "object") {
    s = { ...s, expansions: {} };
  }
  if (typeof s.expansions.siblingRivalry !== "boolean") {
    s = { ...s, expansions: { ...s.expansions, siblingRivalry: false } };
  }
  return s;
}

/**
 * Extracts the active child slice from top-level state fields.
 * Only includes keys that exist on state.
 */
export function extractChildSlice(state) {
  const slice = {};
  for (const k of CHILD_SLICE_KEYS) {
    if (hasOwn(state, k)) slice[k] = state[k];
  }
  return slice;
}

/**
 * Applies a kid's childSlice into top-level state fields.
 * Only applies keys present in kid.childSlice (undefined values are skipped).
 */
export function applyChildSliceToState(state, kid) {
  let s = state;
  for (const [k, v] of Object.entries(kid.childSlice || {})) {
    if (v !== undefined) {
      // only apply if this key exists in our intended slice list OR already exists on state
      if (CHILD_SLICE_KEYS.includes(k) || hasOwn(state, k)) {
        if (s === state) s = { ...state };
        s[k] = v;
      }
    }
  }
  return s;
}

/**
 * Migrates a single-child save into kids[] container if missing.
 * Keeps top-level fields unchanged (so existing UI still works).
 */
export function ensureKidsContainer(state) {
  let s = state;
  
  // Create kids array if missing
  if (!Array.isArray(s.kids)) {
    s = { ...s, kids: [] };
  }
  
  // Create activeKidId field if missing
  if (s.activeKidId === undefined || s.activeKidId === null) {
    s = { ...s, activeKidId: null };
  }
  
  // Childless mode guard: DO NOT auto-create a kid
  const noChildMode = (s.childless === true) || (s.hasChild === false);
  if (noChildMode) {
    // Only ensure containers exist; do NOT create a kid.
    return s;
  }
  
  // If kids array is empty, create primary kid from top-level fields
  if (s.kids.length === 0) {
    const primarySlice = extractChildSlice(s);
    const primaryKid = createKid({
      id: makeKidId(),
      createdAtYear: 0, // Primary child is born at household Year 0 (age derives from currentYear - createdAtYear)
      childSlice: primarySlice,
    });

    s = { ...s, kids: [primaryKid], activeKidId: primaryKid.id };
    return s;
  }

  // --- Migration safety: normalize kid timestamps + remove any stale per-kid `childSlice.currentYear`
  // Age for each kid is derived from: (state.currentYear - kid.createdAtYear).
  // A previous bug accidentally set primaryKid.createdAtYear = state.currentYear, which made the
  // original child appear age 0 and broke year-based popups. Fix that here.
  try {
    const cy = Number.isFinite(Number(s.currentYear)) ? Number(s.currentYear) : 0;
    let anyChanged = false;

    const nextKids = s.kids.map((kid, idx) => {
      if (!kid || typeof kid !== 'object') return kid;

      const slice = (kid.childSlice && typeof kid.childSlice === 'object') ? kid.childSlice : {};
      const sliceYearRaw = slice.currentYear;
      const sliceYear = Number.isFinite(Number(sliceYearRaw)) ? Number(sliceYearRaw) : null;

      let createdAtYear = kid.createdAtYear;
      let changed = false;

      // Fix primary child: createdAtYear should always be 0 (household timeline starts at their birth)
      if (idx === 0 && (kid.relation == null || kid.relation === 'child') && createdAtYear !== 0) {
        createdAtYear = 0;
        changed = true;
      }

      // If createdAtYear missing/invalid, infer from sliceYear if present, otherwise clamp to current year
      if (!Number.isFinite(Number(createdAtYear))) {
        if (sliceYear != null) {
          createdAtYear = Math.max(0, cy - sliceYear);
        } else {
          createdAtYear = (idx === 0) ? 0 : cy;
        }
        changed = true;
      } else {
        const clamped = Math.max(0, Math.min(cy, Number(createdAtYear)));
        if (clamped !== createdAtYear) {
          createdAtYear = clamped;
          changed = true;
        }
      }

      // Remove stale per-kid currentYear (age is computed from createdAtYear)
      let nextSlice = slice;
      if (Object.prototype.hasOwnProperty.call(slice, 'currentYear')) {
        const { currentYear: _drop, ...rest } = slice;
        nextSlice = rest;
        changed = true;
      }

      if (!changed) return kid;
      anyChanged = true;
      return { ...kid, createdAtYear, childSlice: nextSlice };
    });

    if (anyChanged) {
      s = { ...s, kids: nextKids };
    }
  } catch {}

  // Ensure activeKidId is valid
  if (!s.activeKidId || typeof s.activeKidId !== "string") {
    s = { ...s, activeKidId: s.kids[0].id };
  }

  // Ensure active kid exists
  const exists = s.kids.some((k) => k.id === s.activeKidId);
  if (!exists) {
    s = { ...s, activeKidId: s.kids[0].id };
  }

  return s;
}

/**
 * Writes current top-level slice into the active kid record.
 * Safe no-op if kids array is missing or activeKidId is invalid.
 */
export function persistActiveChildIntoKids(state) {
  if (!Array.isArray(state.kids) || state.kids.length === 0) return state;
  if (!state.activeKidId) return state;
  
  const activeId = state.activeKidId;
  const idx = state.kids.findIndex((k) => k.id === activeId);
  if (idx < 0) return state;

  const currentSlice = extractChildSlice(state);
  const existingKid = state.kids[idx];
  
  // Simple shallow compare to avoid unnecessary rewrites
  const existingSlice = existingKid.childSlice || {};
  let changed = false;
  for (const k of CHILD_SLICE_KEYS) {
    if (currentSlice[k] !== existingSlice[k]) {
      changed = true;
      break;
    }
  }
  
  if (!changed) return state;

  const nextKids = cloneArr(state.kids);
  nextKids[idx] = { ...existingKid, childSlice: currentSlice };

  return { ...state, kids: nextKids };
}

/**
 * Master ensure: expansions + kids container.
 * Enforces: if expansion disabled, activeKidId forced to primary and slice applied.
 */
export function ensureSiblingRivalryState(state) {
  let s = ensureExpansionsContainer(state);
  s = ensureKidsContainer(s);
  // IMPORTANT: keep the active kid slice synced with the canonical top-level child fields.
  // Without this, save/load can revert the run to stale kid.childSlice values.
  s = persistActiveChildIntoKids(s);

  const enabled = !!s.expansions?.siblingRivalry;

  // If expansion is OFF, force single-child mode
  // EXCEPTION: allow a grandchild to be the active dependent even when sibling rivalry is off
  if (!enabled && s.kids?.length > 0) {
    const primaryId = s.kids[0].id;
    const activeKid = s.kids.find(k => k.id === s.activeKidId) || null;
    const allowGrandchildActive = !!(activeKid && activeKid.relation === 'grandchild');

    if (!allowGrandchildActive) {
      if (s.activeKidId !== primaryId) {
        s = { ...s, activeKidId: primaryId };
      }
      // Always apply primary kid slice to ensure top-level state is synced
      s = applyChildSliceToState(s, s.kids[0]);
    } else {
      // Apply the grandchild slice to top-level state so the player can interact with them
      s = applyChildSliceToState(s, activeKid);
    }
  } else if (enabled && s.kids?.length > 0) {
    // Expansion is ON: ensure activeKidId is valid
    const activeExists = s.kids.some((k) => k.id === s.activeKidId);
    if (!activeExists) {
      s = { ...s, activeKidId: s.kids[0].id };
      s = applyChildSliceToState(s, s.kids[0]);
    } else {
      // Apply current active kid slice to top-level
      const activeKid = s.kids.find((k) => k.id === s.activeKidId);
      if (activeKid) {
        s = applyChildSliceToState(s, activeKid);
      }
    }
  }

  return s;
}

/* -----------------------------
   Reducer-style helpers
   ----------------------------- */

/**
 * @param {any} state
 * @param {{ name?: string; temperamentId?: string; gender?: string; toneIndex?: number }} payload
 */
export function addChildReducer(state, payload) {
  let s = ensureSiblingRivalryState(state);
  
  // If expansion is OFF, do nothing
  const enabled = !!s.expansions?.siblingRivalry;
  if (!enabled) return s;
  
  // Persist current active child before adding new one
  s = persistActiveChildIntoKids(s);

  // No max cap - unlimited kids
  
  // Build a new child slice using primary kid as baseline
  const primary = s.kids[0];
  const baseSlice = { ...(primary.childSlice || {}) };

  // Override identity fields from payload
  const name = (payload.name && String(payload.name).trim()) || `Child ${s.kids.length + 1}`;
  const temperamentId = payload.temperamentId || payload.temperament;
  
  if ("childName" in baseSlice) baseSlice["childName"] = name;
  if ("childGender" in baseSlice && payload.gender) baseSlice["childGender"] = payload.gender;
  if ("childAvatarGender" in baseSlice && payload.gender) baseSlice["childAvatarGender"] = payload.gender;
  if ("childAvatarToneIndex" in baseSlice && typeof payload.toneIndex === "number") {
    baseSlice["childAvatarToneIndex"] = payload.toneIndex;
  }
  if ("childTemperamentId" in baseSlice && temperamentId) {
    baseSlice["childTemperamentId"] = temperamentId;
  }
  if ("temperamentId" in baseSlice && temperamentId) {
    baseSlice["temperamentId"] = temperamentId;
  }
  if ("temperament" in baseSlice && temperamentId) {
    baseSlice["temperament"] = temperamentId;
  }

  // Reset per-child fields if present
  if ("teacherName" in baseSlice) baseSlice["teacherName"] = "";
  if ("bestFriendName" in baseSlice) baseSlice["bestFriendName"] = "";

  // Compute createdAtYear from ageYears if provided
  const baseYear = Number.isFinite(Number(s.currentYear)) ? Number(s.currentYear) : 0;
  let createdAtYear;
  if (Number.isFinite(Number(payload.createdAtYear))) {
    createdAtYear = Number(payload.createdAtYear);
  } else if (Number.isFinite(Number(payload.ageYears))) {
    createdAtYear = baseYear - Math.floor(Number(payload.ageYears));
  } else {
    createdAtYear = baseYear;
  }

  const newKid = createKid({
    id: makeKidId(),
    createdAtYear,
    childSlice: baseSlice,
  });

  return { ...s, kids: [...s.kids, newKid] };
}

/**
 * @param {any} state
 * @param {string} kidId
 */
export function removeChildReducer(state, kidId) {
  let s = ensureSiblingRivalryState(state);
  
  // If expansion is OFF, cannot remove
  const enabled = !!s.expansions?.siblingRivalry;
  if (!enabled) return s;
  
  s = persistActiveChildIntoKids(s);

  if (!Array.isArray(s.kids) || s.kids.length <= 1) return s;
  const primaryId = s.kids[0].id;
  if (kidId === primaryId) return s; // cannot remove primary

  const nextKids = s.kids.filter((k) => k.id !== kidId);
  if (nextKids.length === s.kids.length) return s; // nothing removed

  s = { ...s, kids: nextKids };

  // If active kid was removed, switch to primary
  const activeExists = s.kids.some((k) => k.id === s.activeKidId);
  if (!activeExists) {
    s = { ...s, activeKidId: s.kids[0].id };
    s = applyChildSliceToState(s, s.kids[0]);
  }

  return s;
}

/**
 * @param {any} state
 * @param {boolean} enabled
 */
export function setSiblingRivalryEnabledReducer(state, enabled) {
  let s = ensureSiblingRivalryState(state);
  s = persistActiveChildIntoKids(s);

  // Write to expansions.siblingRivalry
  s = {
    ...s,
    expansions: {
      ...(s.expansions || {}),
      siblingRivalry: !!enabled
    }
  };

  // If disabling, force single-child mode and clear any sibling-rivalry popup state
  if (!enabled) {
    if (s.kids?.length > 0) {
      s = { ...s, activeKidId: s.kids[0].id };
      s = applyChildSliceToState(s, s.kids[0]);
    }
    s = {
      ...s,
      siblingRivalryPopupQueue: [],
      yearFlags: { ...(s.yearFlags || {}), siblingRivalryPopupsShown: 0 }
    };
  }

  return s;
}

/**
 * Switch active kid.
 * Caller should enforce UI locks if needed; reducer is conservative:
 * - no-op if expansion is off
 * - no-op if target not found
 * @param {any} state
 * @param {string} kidId
 */
export function setActiveKidReducer(state, kidId) {
  let s = ensureSiblingRivalryState(state);

  const enabled = !!s.expansions?.siblingRivalry;
  const target = s.kids?.find((k) => k.id === kidId);

  // If expansion is OFF: allow switching ONLY to grandchild dependents
  if (!enabled) {
    if (!target || target.relation !== 'grandchild') return s;

    s = persistActiveChildIntoKids(s);
    s = { ...s, activeKidId: kidId };
    s = applyChildSliceToState(s, target);
    return s;
  }

  if (!target) {
    // Fallback to primary if target not found
    const primaryId = s.kids?.[0]?.id;
    if (primaryId && s.activeKidId !== primaryId) {
      s = { ...s, activeKidId: primaryId };
      s = applyChildSliceToState(s, s.kids[0]);
    }
    return s;
  }

  // Persist current active child slice, then switch, then apply new slice
  s = persistActiveChildIntoKids(s);
  s = { ...s, activeKidId: kidId };
  s = applyChildSliceToState(s, target);
  return s;
}