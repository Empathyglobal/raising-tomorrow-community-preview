// Martial Arts Belt System + Styles

export const MARTIAL_BELTS = [
  { id: "WHITE", label: "White Belt" },
  { id: "YELLOW", label: "Yellow Belt" },
  { id: "ORANGE", label: "Orange Belt" },
  { id: "GREEN", label: "Green Belt" },
  { id: "BLUE", label: "Blue Belt" },
  { id: "BROWN", label: "Brown Belt" },
  { id: "BLACK", label: "Black Belt" }
];

export const MARTIAL_STYLES = [
  { id: "taekwondo", name: "Taekwondo" },
  { id: "karate", name: "Karate" },
  { id: "judo", name: "Judo" },
  { id: "bjj", name: "Brazilian Jiu‑Jitsu" }
];

export const BELT_FLAVOR = [
  "They practice in the hallway like it's a runway.",
  "They bow with dramatic seriousness, even to the toaster.",
  "They ask if belts come in 'sparkle edition.'",
  "They insist on teaching you a 'respect stance' at dinner.",
  "They treat warmups like a personal hero montage."
];

// Helper functions (accept either gameState or martialArts object)
export function getBeltIndex(input, styleId) {
  // Support both gameState and martialArts object
  const martialArts = input?.mindBody?.martialArts || input;
  const beltIndexByStyle = martialArts?.beltIndexByStyle || {};
  return beltIndexByStyle[styleId] || 0;
}

export function getBeltLabel(input, styleId) {
  const index = getBeltIndex(input, styleId);
  return MARTIAL_BELTS[index]?.label || "White Belt";
}

export function isBlackBelt(input, styleId) {
  return getBeltIndex(input, styleId) >= (MARTIAL_BELTS.length - 1);
}

export function hasAnyBlackBelt(input) {
  // Support both gameState and martialArts object
  const martialArts = input?.mindBody?.martialArts || input;
  const beltIndexByStyle = martialArts?.beltIndexByStyle || {};
  return Object.values(beltIndexByStyle).some(index => index >= (MARTIAL_BELTS.length - 1));
}

export function getYearsTrained(input, styleId) {
  // Support both gameState and martialArts object
  const martialArts = input?.mindBody?.martialArts || input;
  const yearsTrainedByStyle = martialArts?.yearsTrainedByStyle || {};
  return yearsTrainedByStyle[styleId] || 0;
}

export function getActiveStyleId(input) {
  // Support both gameState and martialArts object
  const martialArts = input?.mindBody?.martialArts || input;
  return martialArts?.activeStyleId || null;
}

export function getActiveStyleName(input) {
  const activeId = getActiveStyleId(input);
  if (!activeId) return null;
  const style = MARTIAL_STYLES.find(s => s.id === activeId);
  return style ? style.name : null;
}