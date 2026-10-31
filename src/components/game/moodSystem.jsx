// Child Mood System
// Computes mood once per year based on stress, love, and patterns
// Returns: 'happy' | 'neutral' | 'fragile' | 'irritable'

import { createSeededRng } from './GameStateContext';

export function computeMoodForYear({ stress, love, temperament, patterns, runSeed, year }) {
  const s = Number(stress ?? 0);
  const l = Number(love ?? 0);
  
  // Deterministic tie-breaking
  const rng = createSeededRng(`${runSeed}|mood|${year}`);
  const roll = rng.nextFloat();
  
  // Primary rules (stress-dominant)
  if (s >= 60) {
    return roll < 0.55 ? 'irritable' : 'fragile';
  }
  
  if (s >= 35) {
    if (l < 40) return 'fragile';
    return roll < 0.40 ? 'fragile' : 'neutral';
  }
  
  // Low stress paths
  if (l >= 70 && s < 35) {
    return 'happy';
  }
  
  if (l >= 50) {
    return roll < 0.65 ? 'neutral' : 'happy';
  }
  
  // Default
  return 'neutral';
}

// Precompute which Play activity IDs are disabled this year based on mood
export function computeMoodDisabledPlayIds({ mood, playActivityPack, runSeed, year }) {
  try {
    if (mood === 'happy' || mood === 'neutral') {
      return [];
    }
    
    // Ensure pack is valid
    const pack = Array.isArray(playActivityPack) ? playActivityPack : [];
    if (pack.length === 0) return [];
    
    // fragile or irritable: disable 2-4 items
    const rng = createSeededRng(`${runSeed}|moodDisabled|${year}`);
    
    // Determine mood-specific groups to target
    const matchByGroup = mood === 'fragile' 
      ? ['Performance', 'Social']
      : mood === 'irritable' 
        ? ['Movement', 'Performance']
        : [];
    
    // Filter by group (substring match to handle "Movement & Music" etc.)
    const groupMatches = matchByGroup.length
      ? pack.filter(p => {
          if (!p.group) return false;
          const pg = String(p.group).toLowerCase();
          return matchByGroup.some(g => pg.includes(String(g).toLowerCase()));
        })
      : [];
    
    // Fallback: prefer high-intensity items
    const highIntensity = pack.filter(a => 
      a.tags?.includes('high_intensity') || 
      a.group === 'Performance' ||
      a.moneyCost > 20
    );
    
    const lowIntensity = pack.filter(a => 
      !highIntensity.find(h => h.id === a.id)
    );
    
    // Pool to disable from
    const pool = groupMatches.length >= 2
      ? groupMatches
      : (highIntensity.length >= 6 ? highIntensity : [...highIntensity, ...lowIntensity]);
    
    if (pool.length === 0) {
      // Last resort: shuffle entire pack
      const fallbackPool = rng.shuffle(pack);
      const disableCount = Math.min(3, Math.max(1, Math.floor(pack.length * 0.2)));
      return fallbackPool.slice(0, disableCount).map(p => p.id).filter(Boolean);
    }
    
    // Shuffle and pick 2-4
    const shuffled = rng.shuffle(pool);
    const count = Math.floor(rng.nextFloat() * 3) + 2; // 2-4
    const candidates = shuffled.slice(0, count).map(a => a.id).filter(Boolean);
    
    // Safety: never disable ALL options
    const safeMin = Math.min(6, Math.floor(pack.length * 0.3));
    const disableCount = Math.min(candidates.length, Math.max(0, pack.length - safeMin));
    
    return candidates.slice(0, disableCount);
  } catch (e) {
    console.error('[computeMoodDisabledPlayIds] failed:', e);
    return [];
  }
}