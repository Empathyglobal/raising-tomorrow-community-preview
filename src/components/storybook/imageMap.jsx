// Storybook Image Mapping (filenames only)
// This file provides an internal mapping from logical app concepts to uploaded Storybook image filenames.
// IMPORTANT:
// - Reference images ONLY by filename (no folders/paths). Base44 resolves them internally.
// - Storybook-only: Consumers should use this only when html[data-ui-theme="storybook"] is active.
// - Safety: Getters return null if no filename is defined so callers can show a neutral paper panel.

const storybookImageMap = Object.freeze({
  SECTION_COVERS: Object.freeze({
    school: "backpack_school",
    play: "playdate_1",
    home: "living_room2",
    self_care: "bathhub_1",
    work: "office_desk_2",
    relationships: "bedroom_table",
  }),

  CHAPTER_IMAGES: Object.freeze({
    birth: "sleeping_baby",
    kindergarten: "school_bus",
    middle_school: "backpack_school",
    high_school: "office_desk_1",
    graduation: "birthday_cake",
    first_job: "office_desk_2",
    moving_out: "living_room",
  }),

  POSTCARD_POOL: Object.freeze([
    "living_room",
    "living_room2",
    "bedroom_night",
    "kitchen",
    "kitchen_cookies",
    "set_table",
    "laundry_room",
    "basket_veggies",
    "garden",
    "outdoor_park",
    "outdoor_1",
    "outdoor_camping",
    "beach_sunset",
    "beach_sunset2",
    "rainboots",
    "office_desk_1",
    "office_desk_2",
    "birthday_cake",
  ]),

  // Optional moment headers for future popups (not used yet)
  MOMENT_HEADERS: Object.freeze({
    bedtime: "bedroom_night",
    birthday: "birthday_cake",
    rainy_day: "rainboots",
    chores: "laundry_room",
    cooking: "kitchen_cookies",
    grocery: "basket_veggies",
    beach_trip: "beach_sunset",
    camping: "outdoor_camping",
    playdate: "playdate_1",
    school_day: "backpack_school",
  }),
});

// Helpers: return filename or null (never throw, never log)
export function getSectionCoverFilename(sectionId) {
  return storybookImageMap.SECTION_COVERS[sectionId] || null;
}

export function getChapterImageFilename(chapterId) {
  return storybookImageMap.CHAPTER_IMAGES[chapterId] || null;
}

export function getPostcardPool() {
  return storybookImageMap.POSTCARD_POOL;
}

export function getMomentHeaderFilename(momentKey) {
  return storybookImageMap.MOMENT_HEADERS[momentKey] || null;
}

// Optional: light gate for Storybook consumers
export function isStorybookActive() {
  try {
    if (typeof document === 'undefined') return false;
    return document.documentElement?.dataset?.uiTheme === 'storybook';
  } catch (_) {
    return false;
  }
}

export default storybookImageMap;