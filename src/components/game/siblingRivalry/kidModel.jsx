/**
 * Sibling Rivalry — Kid Model
 * This is intentionally "thin": it stores a childSlice object, which mirrors the existing
 * single-child top-level state fields. Switching kids swaps the slice into/out of top-level.
 */



/**
 * IMPORTANT:
 * CHILD_SLICE_KEYS should include *only* keys that are child-specific in your current game state.
 * It is safe to include a superset; extraction only picks keys that exist on state.
 *
 * Start with this list and adjust only if necessary after you locate the real state fields.
 */
export const CHILD_SLICE_KEYS = [
  // Identity / avatar
  "childName",
  "childGender",
  "childAvatarGender",
  "childAvatarToneIndex",
  "childAvatarPicked",
  "childAvatarId",
  "childAvatar",
  "childAvatarEmoji",

  // Traits
  "childTemperamentId",
  "temperamentId",
  "temperament",
  "childInterestId",
  "interestId",
  "childProfile",

  // Core child stats & bond (rename to match your repo if needed)
  "stats",
  "childStats",
  "baselineStats",
  "highWaterStats",
  "love",
  "childLove",
  "baselineLove",
  "highWaterLove",

  // School / social (only if these are currently per-child)
  "teacherName",
  "teacherTrust",
  "bestFriendName",
  "peerCircle",
  "friendNames",
  "friendSeeded",
  "schoolStage",
  "inSchool",
  
  // Hobbies & Clubs
  "childHobbies"
];

/**
 * @typedef {string} KidId
 */

/**
 * @typedef {Object} Kid
 * @property {KidId} id
 * @property {number} [createdAtYear]
 * @property {Record<string, any>} childSlice - Stores the child-specific fields
 */

/** Small ID helper with a safe fallback */
export function makeKidId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return (
    "kid_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10)
  );
}

/**
 * @param {Object} params
 * @param {Record<string, any>} params.childSlice
 * @param {number} [params.createdAtYear]
 * @param {KidId} [params.id]
 * @returns {Kid}
 */
export function createKid(params) {
  return {
    id: params.id ?? makeKidId(),
    createdAtYear: params.createdAtYear,
    childSlice: params.childSlice ?? {},
  };
}