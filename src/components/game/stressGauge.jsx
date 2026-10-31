// src/components/game/stressGauge.js

/**
 * Returns a stress gauge model for UI.
 * Safe default ranges: 0..100
 */
export function getStressGauge(stressValue) {
  const stress = Number(stressValue ?? 0);
  const clamped = Number.isFinite(stress) ? Math.max(0, Math.min(100, stress)) : 0;

  // Simple bands. Adjust later if needed.
  let label = "Calm";
  if (clamped >= 80) label = "Overwhelmed";
  else if (clamped >= 65) label = "Stressed";
  else if (clamped >= 40) label = "Tense";

  return {
    value: clamped,
    label,
    // Useful thresholds for UI logic
    thresholds: { tense: 40, stressed: 65, overwhelmed: 80 }
  };
}