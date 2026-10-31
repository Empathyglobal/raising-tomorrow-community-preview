export function hapticTap(pattern = 25) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // fail silently
  }
}