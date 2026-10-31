import { FAMILY_PATTERN_CATALOG, DEFAULT_PATTERN_SEVERITY } from './familyPatternCatalog';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function computeFamilyTraumaLoad(gameState) {
  const familyPatterns = gameState?.familyPatterns || {};
  const selectedIds = Array.isArray(familyPatterns.selectedIds) ? familyPatterns.selectedIds : [];
  const severityById = familyPatterns.severityById || {};
  const resolvedById = familyPatterns.resolvedById || {};

  if (selectedIds.length === 0) {
    const zeroTags = { shame: 0, threat: 0, chaos: 0, role: 0 };
    return {
      loadScore: 0,
      totalScore: 0,
      unresolvedCount: 0,
      resolvedCount: 0,
      topPatternIds: [],
      tags: zeroTags,
      tagCounts: zeroTags
    };
  }

  let rawLoad = 0;
  let unresolvedCount = 0;
  let resolvedCount = 0;
  const tags = { shame: 0, threat: 0, chaos: 0, role: 0 };
  const weightedPatterns = [];

  for (const patternId of selectedIds) {
    const pattern = FAMILY_PATTERN_CATALOG.find(p => p.id === patternId);
    if (!pattern) continue;

    const severity = severityById[patternId] ?? DEFAULT_PATTERN_SEVERITY;
    const isResolved = !!resolvedById[patternId];

    if (isResolved) {
      resolvedCount++;
      // Resolved patterns still count but at 25% weight
      const weight = severity * 0.25;
      rawLoad += weight;
      weightedPatterns.push({ id: patternId, weight });

      // Tags at 25%
      tags.shame += (pattern.pressures.shame || 0) * severity * 0.25;
      tags.threat += (pattern.pressures.threat || 0) * severity * 0.25;
      tags.chaos += (pattern.pressures.chaos || 0) * severity * 0.25;
      tags.role += (pattern.pressures.role || 0) * severity * 0.25;
    } else {
      unresolvedCount++;
      const weight = severity;
      rawLoad += weight;
      weightedPatterns.push({ id: patternId, weight });

      tags.shame += (pattern.pressures.shame || 0) * severity;
      tags.threat += (pattern.pressures.threat || 0) * severity;
      tags.chaos += (pattern.pressures.chaos || 0) * severity;
      tags.role += (pattern.pressures.role || 0) * severity;
    }
  }

  // Normalize loadScore to 0..10
  const loadScore = clamp(rawLoad, 0, 10);

  // Normalize tags to 0..10
  const maxPressure = 10;
  tags.shame = clamp(tags.shame, 0, maxPressure);
  tags.threat = clamp(tags.threat, 0, maxPressure);
  tags.chaos = clamp(tags.chaos, 0, maxPressure);
  tags.role = clamp(tags.role, 0, maxPressure);

  // Top 3 most severe (by weight)
  const topPatternIds = weightedPatterns
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(p => p.id);

  return {
    loadScore,
    unresolvedCount,
    resolvedCount,
    topPatternIds,
    tags,
    tagCounts: tags,
    totalScore: loadScore
  };
}