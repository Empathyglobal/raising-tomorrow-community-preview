import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';

export function generateFamilyPatternsForMatch() {
  // Pick 1-3 random patterns
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...FAMILY_PATTERN_CATALOG].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  const patternIds = selected.map(p => p.id);
  const patternSev = {};
  
  selected.forEach(p => {
    // Severity 1-3
    patternSev[p.id] = Math.floor(Math.random() * 3) + 1;
  });
  
  return { patternIds, patternSev };
}