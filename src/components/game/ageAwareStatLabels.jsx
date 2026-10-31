// Age-aware stat labels that adapt as children grow
// Non-shaming language for ages 0-2, more descriptive for older ages

export function formatStatNumber(value) {
  // Clean up floating point errors
  return Math.round(value * 10) / 10;
}

export function getAgeBand(age) {
  if (age <= 2) return 'band0'; // Infant/Toddler
  if (age <= 7) return 'band1'; // Early Childhood
  if (age <= 12) return 'band2'; // Child/Tween
  return 'band3'; // Teen
}

export function getStatLabel(statKey, value, age) {
  const band = getAgeBand(age);
  const v = value; // Use raw value for comparisons
  
  // INTELLIGENCE
  if (statKey === 'intelligence') {
    if (band === 'band0') { // Ages 0-2
      if (v <= 0) return { label: "Still waking up", tone: "low", shortHint: "Give it time" };
      if (v <= 2) return { label: "Growing", tone: "mid" };
      if (v <= 4) return { label: "Bright spark", tone: "mid" };
      if (v <= 6) return { label: "Ahead of the curve", tone: "high" };
      if (v <= 9) return { label: "Remarkably curious", tone: "high" };
      return { label: "Tiny genius energy", tone: "extreme" };
    }
    if (band === 'band1') { // Ages 3-7
      if (v <= 0) return { label: "Needs extra support", tone: "low" };
      if (v <= 4) return { label: "Developing", tone: "low" };
      if (v <= 8) return { label: "Solid", tone: "mid" };
      if (v <= 12) return { label: "Strong learner", tone: "high" };
      if (v <= 18) return { label: "Exceptional", tone: "high" };
      return { label: "Genius-level", tone: "extreme" };
    }
    if (band === 'band2') { // Ages 8-12
      if (v <= 0) return { label: "Struggling", tone: "low" };
      if (v <= 12) return { label: "Below average", tone: "low" };
      if (v <= 28) return { label: "Average", tone: "mid" };
      if (v <= 44) return { label: "Above average", tone: "high" };
      if (v <= 60) return { label: "Exceptional", tone: "high" };
      return { label: "Genius", tone: "extreme" };
    }
    // band3: Ages 13-18
    if (v <= 0) return { label: "Struggling", tone: "low" };
    if (v <= 43) return { label: "Below average", tone: "low" };
    if (v <= 65) return { label: "Average", tone: "mid" };
    if (v <= 88) return { label: "Sharp", tone: "high" };
    if (v <= 110) return { label: "Exceptional", tone: "high" };
    return { label: "Genius", tone: "extreme" };
  }
  
  // EMPATHY
  if (statKey === 'empathy') {
    if (band === 'band0') { // Ages 0-2
      if (v <= 0) return { label: "Learning signals", tone: "low", shortHint: "Building awareness" };
      if (v <= 2) return { label: "Attuning", tone: "mid" };
      if (v <= 4) return { label: "Warm", tone: "mid" };
      if (v <= 6) return { label: "Caring", tone: "high" };
      if (v <= 9) return { label: "Deeply attuned", tone: "high" };
      return { label: "Heart-forward", tone: "extreme" };
    }
    if (band === 'band1') { // Ages 3-7
      if (v <= 0) return { label: "Disconnected", tone: "low" };
      if (v <= 4) return { label: "Learning kindness", tone: "low" };
      if (v <= 8) return { label: "Warm", tone: "mid" };
      if (v <= 12) return { label: "Considerate", tone: "high" };
      if (v <= 18) return { label: "Empathic", tone: "high" };
      return { label: "Remarkably compassionate", tone: "extreme" };
    }
    if (band === 'band2') { // Ages 8-12
      if (v <= 0) return { label: "Self-focused", tone: "low" };
      if (v <= 6) return { label: "Inconsistent", tone: "low" };
      if (v <= 14) return { label: "Caring", tone: "mid" };
      if (v <= 22) return { label: "Considerate", tone: "high" };
      if (v <= 30) return { label: "Empathic leader", tone: "high" };
      return { label: "Deeply empathic", tone: "extreme" };
    }
    // band3: Ages 13-18
    if (v <= 0) return { label: "Detached", tone: "low" };
    if (v <= 8) return { label: "Low empathy", tone: "low" };
    if (v <= 18) return { label: "Average", tone: "mid" };
    if (v <= 28) return { label: "Considerate", tone: "high" };
    if (v <= 40) return { label: "Empathic", tone: "high" };
    return { label: "Deeply compassionate", tone: "extreme" };
  }
  
  // DISCIPLINE
  if (statKey === 'discipline') {
    if (band === 'band0') { // Ages 0-2
      if (v <= 0) return { label: "No routines yet", tone: "low", shortHint: "Normal for babies" };
      if (v <= 2) return { label: "Routine forming", tone: "mid" };
      if (v <= 4) return { label: "Settling", tone: "mid" };
      if (v <= 6) return { label: "Steady rhythms", tone: "high" };
      if (v <= 9) return { label: "Very structured", tone: "high" };
      return { label: "Rigid rhythms", tone: "extreme", shortHint: "May need flexibility" };
    }
    if (band === 'band1') { // Ages 3-7
      if (v <= 0) return { label: "Wild", tone: "low" };
      if (v <= 4) return { label: "Loose", tone: "low" };
      if (v <= 8) return { label: "Learning habits", tone: "mid" };
      if (v <= 12) return { label: "Steady", tone: "high" };
      if (v <= 18) return { label: "Highly disciplined", tone: "high" };
      return { label: "Rigid / overcontrolled", tone: "extreme" };
    }
    if (band === 'band2') { // Ages 8-12
      if (v <= 0) return { label: "Chaotic", tone: "low" };
      if (v <= 6) return { label: "Loose", tone: "low" };
      if (v <= 14) return { label: "Free spirit", tone: "mid" };
      if (v <= 22) return { label: "Disciplined", tone: "high" };
      if (v <= 30) return { label: "Highly disciplined", tone: "high" };
      return { label: "Rigid", tone: "extreme" };
    }
    // band3: Ages 13-18
    if (v <= 0) return { label: "Chaotic", tone: "low" };
    if (v <= 8) return { label: "Loose", tone: "low" };
    if (v <= 18) return { label: "Moderate", tone: "mid" };
    if (v <= 28) return { label: "Disciplined", tone: "high" };
    if (v <= 40) return { label: "Highly disciplined", tone: "high" };
    return { label: "Overcontrolled", tone: "extreme" };
  }
  
  // CONFIDENCE
  if (statKey === 'confidence') {
    if (band === 'band0') { // Ages 0-2
      if (v <= 0) return { label: "Very cautious", tone: "low", shortHint: "Building security" };
      if (v <= 2) return { label: "Warming up", tone: "mid" };
      if (v <= 4) return { label: "Exploring", tone: "mid" };
      if (v <= 6) return { label: "Bold explorer", tone: "high" };
      if (v <= 9) return { label: "Fearless streak", tone: "high" };
      return { label: "Daredevil energy", tone: "extreme", shortHint: "Watch for safety" };
    }
    if (band === 'band1') { // Ages 3-7
      if (v <= 0) return { label: "Shut down", tone: "low" };
      if (v <= 4) return { label: "Very shy", tone: "low" };
      if (v <= 8) return { label: "Cautiously brave", tone: "mid" };
      if (v <= 12) return { label: "Steady", tone: "high" };
      if (v <= 18) return { label: "Confident", tone: "high" };
      return { label: "Unshakeable", tone: "extreme" };
    }
    if (band === 'band2') { // Ages 8-12
      if (v <= 0) return { label: "Withdrawn", tone: "low" };
      if (v <= 6) return { label: "Insecure", tone: "low" };
      if (v <= 14) return { label: "Steady", tone: "mid" };
      if (v <= 22) return { label: "Confident", tone: "high" };
      if (v <= 30) return { label: "Bold", tone: "high" };
      return { label: "Risk-taker", tone: "extreme" };
    }
    // band3: Ages 13-18
    if (v <= 0) return { label: "Shut down", tone: "low" };
    if (v <= 8) return { label: "Very insecure", tone: "low" };
    if (v <= 18) return { label: "Steady", tone: "mid" };
    if (v <= 28) return { label: "Confident", tone: "high" };
    if (v <= 40) return { label: "Bold", tone: "high" };
    return { label: "Daredevil", tone: "extreme" };
  }
  
  return { label: "Unknown", tone: "mid" };
}