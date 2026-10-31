// src/components/game/availability.js

/**
 * Returns whether "Age Up" is allowed and why.
 * Must be safe even if state fields are missing.
 *
 * Shape:
 * { enabled: boolean, reason?: string }
 */
export function getAvailability(gameState, uiBlocker = null) {
  if (!gameState) return { enabled: false, reason: "Game state not ready." };

  if (gameState.finished) return { enabled: false, reason: "Run is finished." };

  // If there is a blocker (required modal), Age Up is not available.
  if (uiBlocker) {
    return { enabled: false, reason: uiBlocker.reason || "Complete the required step first." };
  }

  // If the game uses a scenario gating flag, honor it.
  if (gameState.scenarioPending && !gameState.scenarioCompletedThisAge) {
    return { enabled: false, reason: "Resolve this year's moment first." };
  }

  return { enabled: true };
}