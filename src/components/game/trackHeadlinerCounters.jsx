// Helper functions to track headliner counters
// Call these when actions are performed to increment year counters

export function trackBondAction(gameState, updateState) {
  const yearFlags = gameState.yearFlags || {};
  if (!yearFlags.didBond) {
    updateState(prev => ({
      ...prev,
      yearFlags: { ...prev.yearFlags, didBond: true },
      counters: {
        ...prev.counters,
        bondYears: (prev.counters.bondYears || 0) + 1
      }
    }));
  }
}

export function trackPlayAction(gameState, updateState) {
  const yearFlags = gameState.yearFlags || {};
  if (!yearFlags.didPlay) {
    updateState(prev => ({
      ...prev,
      yearFlags: { ...prev.yearFlags, didPlay: true },
      counters: {
        ...prev.counters,
        playYears: (prev.counters.playYears || 0) + 1
      }
    }));
  }
}

export function trackStudyAction(gameState, updateState) {
  const yearFlags = gameState.yearFlags || {};
  if (!yearFlags.didStudy) {
    updateState(prev => ({
      ...prev,
      yearFlags: { ...prev.yearFlags, didStudy: true },
      counters: {
        ...prev.counters,
        studyYears: (prev.counters.studyYears || 0) + 1
      }
    }));
  }
}

export function trackRepairAction(gameState, updateState) {
  const yearFlags = gameState.yearFlags || {};
  if (!yearFlags.didRepair) {
    updateState(prev => ({
      ...prev,
      yearFlags: { ...prev.yearFlags, didRepair: true },
      counters: {
        ...prev.counters,
        repairYears: (prev.counters.repairYears || 0) + 1
      }
    }));
  }
}

export function trackSleepAction(gameState, updateState) {
  const yearFlags = gameState.yearFlags || {};
  if (!yearFlags.didSleep) {
    updateState(prev => ({
      ...prev,
      yearFlags: { ...prev.yearFlags, didSleep: true },
      counters: {
        ...prev.counters,
        sleepYears: (prev.counters.sleepYears || 0) + 1
      }
    }));
  }
}

export function trackRoutineAction(gameState, updateState) {
  const yearFlags = gameState.yearFlags || {};
  if (!yearFlags.didRoutine) {
    updateState(prev => ({
      ...prev,
      yearFlags: { ...prev.yearFlags, didRoutine: true },
      counters: {
        ...prev.counters,
        routineYears: (prev.counters.routineYears || 0) + 1
      }
    }));
  }
}

export function trackHarshChoice(updateState) {
  updateState(prev => ({
    ...prev,
    counters: {
      ...prev.counters,
      harshChoiceCount: (prev.counters.harshChoiceCount || 0) + 1
    }
  }));
}