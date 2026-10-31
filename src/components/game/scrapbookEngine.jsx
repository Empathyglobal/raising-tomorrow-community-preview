// SCRAPBOOK ENGINE
// Curates memorable moments from timeline for later display

export function getScrapbookEntries(state) {
  const { timelineEntries } = state;
  
  const keepsakeKinds = new Set([
    "travel",
    "pet",
    "study",
    "milestone",
    "school",
    "golden",
    "tinyCute",
    "kidWisdom"
  ]);
  
  const entries = timelineEntries
    .filter(entry => {
      // Include entries with keepsake kinds
      if (keepsakeKinds.has(entry.kind)) return true;
      
      // Include major choices with positive outcomes
      if (entry.kind === "major" && entry.meta?.choiceRole !== "harm") return true;
      
      // Include special memories
      if (entry.kind === "memory") return true;
      
      return false;
    })
    .map(entry => ({
      id: entry.id,
      age: entry.age,
      kind: entry.kind,
      title: entry.title,
      detail: entry.detail,
      emoji: getEmojiForKind(entry.kind),
      description: formatScrapbookDescription(entry)
    }));
  
  return entries;
}

function getEmojiForKind(kind) {
  const emojiMap = {
    travel: "✈️",
    pet: "🐾",
    study: "📚",
    milestone: "🎓",
    school: "🏫",
    golden: "✨",
    tinyCute: "💛",
    kidWisdom: "💡",
    memory: "📝",
    major: "✨"
  };
  
  return emojiMap[kind] || "•";
}

function formatScrapbookDescription(entry) {
  if (entry.detail && entry.detail.length > 0) {
    return entry.detail.substring(0, 120) + (entry.detail.length > 120 ? "..." : "");
  }
  
  if (entry.title) {
    return entry.title.substring(0, 120) + (entry.title.length > 120 ? "..." : "");
  }
  
  return "A special moment.";
}

// Filter scrapbook by age range
export function getScrapbookByAgeRange(state, minAge, maxAge) {
  const allEntries = getScrapbookEntries(state);
  return allEntries.filter(entry => entry.age >= minAge && entry.age <= maxAge);
}

// Get scrapbook summary stats
export function getScrapbookStats(state) {
  const entries = getScrapbookEntries(state);
  
  const stats = {
    total: entries.length,
    byKind: {},
    ageSpan: entries.length > 0 ? {
      min: Math.min(...entries.map(e => e.age)),
      max: Math.max(...entries.map(e => e.age))
    } : null
  };
  
  entries.forEach(entry => {
    if (!stats.byKind[entry.kind]) {
      stats.byKind[entry.kind] = 0;
    }
    stats.byKind[entry.kind]++;
  });
  
  return stats;
}