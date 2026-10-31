// Age-aware stat labels (never shaming for young kids)

export function getAgeBand(age) {
  if (age <= 2) return "0_2";
  if (age <= 5) return "3_5";
  if (age <= 10) return "6_10";
  if (age <= 13) return "11_13";
  return "14_18";
}

export function getTier(value) {
  if (value <= 0) return 1;
  if (value <= 9) return 2;
  if (value <= 19) return 3;
  if (value <= 39) return 4;
  return 5;
}

export const AGE_AWARE_LABELS = {
  intelligence: {
    "0_2": {
      1: "Exploring", 2: "Curious", 3: "Quick Learner", 4: "Very Sharp", 5: "Exceptionally Bright"
    },
    "3_5": {
      1: "Learning", 2: "Curious", 3: "Quick Thinker", 4: "Very Sharp", 5: "Exceptionally Bright"
    },
    "6_10": {
      1: "Developing", 2: "Average", 3: "Quick Learner", 4: "Sharp", 5: "Brilliant"
    },
    "11_13": {
      1: "Struggling", 2: "Average", 3: "Sharp", 4: "Very Sharp", 5: "Brilliant"
    },
    "14_18": {
      1: "Behind", 2: "Average", 3: "Sharp", 4: "Brilliant", 5: "Genius"
    }
  },
  empathy: {
    "0_2": {
      1: "Self-Focused", 2: "Noticing", 3: "Caring", 4: "Very Caring", 5: "Deeply Caring"
    },
    "3_5": {
      1: "Self-Focused", 2: "Learning Kindness", 3: "Caring", 4: "Very Caring", 5: "Deeply Caring"
    },
    "6_10": {
      1: "Self-Protective", 2: "Learning", 3: "Considerate", 4: "Empathic", 5: "Deeply Caring"
    },
    "11_13": {
      1: "Guarded", 2: "Learning", 3: "Considerate", 4: "Empathic", 5: "Heart-Forward"
    },
    "14_18": {
      1: "Disconnected", 2: "Cautious", 3: "Empathic", 4: "Deeply Caring", 5: "Heart-Forward"
    }
  },
  discipline: {
    "0_2": {
      1: "Exploring Freely", 2: "Active", 3: "Learning Limits", 4: "Cooperative", 5: "Very Cooperative"
    },
    "3_5": {
      1: "Wild Energy", 2: "Active", 3: "Learning Structure", 4: "Cooperative", 5: "Very Structured"
    },
    "6_10": {
      1: "Unstructured", 2: "Loose", 3: "Steady", 4: "Consistent", 5: "Highly Disciplined"
    },
    "11_13": {
      1: "Chaotic", 2: "Loose", 3: "Steady", 4: "Consistent", 5: "Highly Disciplined"
    },
    "14_18": {
      1: "Chaotic", 2: "Unstructured", 3: "Steady", 4: "Disciplined", 5: "Highly Disciplined"
    }
  },
  confidence: {
    "0_2": {
      1: "Cautious", 2: "Exploring", 3: "Brave", 4: "Very Brave", 5: "Fearless"
    },
    "3_5": {
      1: "Shy", 2: "Careful", 3: "Brave", 4: "Confident", 5: "Bold"
    },
    "6_10": {
      1: "Withdrawn", 2: "Cautious", 3: "Steady", 4: "Confident", 5: "Bold"
    },
    "11_13": {
      1: "Very Shy", 2: "Cautious", 3: "Steady", 4: "Confident", 5: "Bold"
    },
    "14_18": {
      1: "Withdrawn", 2: "Unsure", 3: "Steady", 4: "Confident", 5: "Magnetic"
    }
  }
};

export function getStatLabel(statKey, value, age) {
  const band = getAgeBand(age);
  const tier = getTier(value);
  
  const labels = AGE_AWARE_LABELS[statKey];
  if (!labels || !labels[band]) return "Unknown";
  
  return labels[band][tier] || "Unknown";
}

// Display-name mapping for stat keys (single source of truth)
export const STAT_DISPLAY_NAME = {
  intelligence: 'Curiosity',
  empathy: 'Empathy',
  discipline: 'Discipline',
  confidence: 'Confidence'
};

export function getStatDisplayName(key) {
  if (!key) return '';
  return STAT_DISPLAY_NAME[key] || key;
}

export function getStatDisplayNameTitle(key) {
  const name = getStatDisplayName(key);
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Uppercase label for chip/delta contexts
export function getStatUpperLabel(key) {
  if (!key) return '';
  if (key === 'intelligence') return 'CURIOSITY';
  const name = getStatDisplayName(key);
  return String(name || key).toUpperCase();
}

// Stat abbreviations (single source of truth)
export const STAT_ABBR = {
  intelligence: 'CUR',
  empathy: 'EMP',
  discipline: 'DIS',
  confidence: 'CON'
};

export function getStatAbbr(key) {
  if (!key) return '';
  return STAT_ABBR[key] || String(key).slice(0,3).toUpperCase();
}