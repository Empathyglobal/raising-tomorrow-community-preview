// Compute data for Y1_YEARLY_CHECKIN modal
export function computeYearlyCheckinData(gameState) {
  const year = Number(gameState.currentYear || 0);
  const snapshot = gameState.yearStartSnapshot;
  
  // Fallback if no snapshot
  if (!snapshot || snapshot.age !== year) {
    return {
      year,
      focusStart: 0,
      focusEnd: Number(gameState.maxFocusTokens || 0),
      focusDelta: 0,
      focusReason: 'Focus tends to drop when Stress is high or when you choose many high-effort actions.',
      stressStart: 0,
      stressEnd: Number(gameState.stress || 0),
      stressDelta: 0,
      stressReason: 'Stress increases with financial pressure and difficult events, and decreases with support and recovery actions.',
      childTraitChanges: [],
      tip: Number(gameState.stress || 0) >= 70 
        ? 'Stress is rising — consider a recovery action next year to protect Focus.'
        : 'Keep experimenting — small choices compound over time.'
    };
  }
  
  // Compute Focus change (approximate: compare max tokens)
  const focusStart = Number(snapshot.maxFocusTokens || snapshot.actionPoints || 5);
  const focusEnd = Number(gameState.maxFocusTokens || 5);
  const focusDelta = focusEnd - focusStart;
  
  // Compute Stress change
  const stressStart = Number(snapshot.stress || 0);
  const stressEnd = Number(gameState.stress || 0);
  const stressDelta = Math.round((stressEnd - stressStart) * 10) / 10;
  
  // Generate Focus reason (best-effort heuristic)
  let focusReason = 'Focus tends to drop when Stress is high or when you choose many high-effort actions.';
  if (focusDelta > 0) {
    focusReason = 'Your living situation or stress reduction improved your available Focus.';
  } else if (focusDelta < 0 && stressEnd >= 60) {
    focusReason = 'High stress reduced available focus.';
  }
  
  // Generate Stress reason (best-effort heuristic)
  let stressReason = 'Stress increases with financial pressure and difficult events, and decreases with support and recovery actions.';
  if (stressDelta > 0) {
    if (stressDelta >= 10) {
      stressReason = 'Major events or accumulated pressure increased stress significantly.';
    } else {
      stressReason = 'Budget pressure and difficult moments added stress this year.';
    }
  } else if (stressDelta < 0) {
    stressReason = 'Recovery actions and support helped reduce stress.';
  }
  
  // Child trait changes: compute top 2-3 by delta
  const childTraitChanges = [];
  const stats = gameState.stats || {};
  const snapshotStats = snapshot.stats || {};
  
  for (const [trait, endValue] of Object.entries(stats)) {
    const startValue = Number(snapshotStats[trait] || 0);
    const delta = Math.round((Number(endValue || 0) - startValue) * 10) / 10;
    
    if (delta !== 0) {
      // Generate reason (generic)
      let reason = 'Your choices this year affected this trait.';
      if (delta > 0) {
        reason = `You spent time on activities that built ${trait.toLowerCase()}.`;
      } else {
        reason = `This trait didn't get much attention this year.`;
      }
      
      childTraitChanges.push({
        trait: trait.charAt(0).toUpperCase() + trait.slice(1),
        delta,
        reason
      });
    }
  }
  
  // Sort by absolute delta and take top 3
  childTraitChanges.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const topChanges = childTraitChanges.slice(0, 3);
  
  // Generate tip
  let tip = 'Keep experimenting — small choices compound over time.';
  if (stressEnd >= 70) {
    tip = 'Stress is rising — consider a recovery action next year to protect Focus.';
  } else if (focusEnd <= 2) {
    tip = 'Focus is tight — prioritize what matters most this year.';
  } else if (Number(gameState.love || 0) <= 30) {
    tip = 'Bond is low — connection-focused actions can help rebuild trust.';
  }
  
  return {
    year,
    focusStart,
    focusEnd,
    focusDelta,
    focusReason,
    stressStart,
    stressEnd,
    stressDelta,
    stressReason,
    childTraitChanges: topChanges,
    tip
  };
}