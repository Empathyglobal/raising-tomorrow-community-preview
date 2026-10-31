/**
 * Apocalypse Victory Conditions
 * 
 * Computes whether the player has achieved a winning condition at age 18
 * for Zombie or Alien apocalypse special starts.
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Compute victory state for zombie_apocalypse
 * Multiple paths: cure (science), military (strength), unity (empathy)
 */
function computeZombieVictory(stats, zombieThreat, zombieTraining) {
  const INT = clamp(stats.intelligence || 0, 0, 20);
  const DIS = clamp(stats.discipline || 0, 0, 20);
  const EMP = clamp(stats.empathy || 0, 0, 20);
  const CON = clamp(stats.confidence || 0, 0, 20);
  
  const training = clamp(zombieTraining || 0, 0, 100);
  const threat = clamp(zombieThreat || 20, 0, 100);

  // Path 1: Cure (Science + discipline)
  if (INT >= 18 && DIS >= 14 && training >= 50 && threat <= 35) {
    return {
      achieved: true,
      path: 'cure',
      trophyId: 'zombie_world_saved',
      summaryLines: [
        '🧪 You synthesized a cure from your deep scientific knowledge.',
        '🧟 Vaccination campaigns reduced the threat to manageable levels.',
        '🌍 Humanity begins rebuilding from the ashes.'
      ]
    };
  }

  // Path 2: Military (Discipline + confidence)
  if (DIS >= 18 && CON >= 16 && training >= 70 && threat <= 55) {
    return {
      achieved: true,
      path: 'military',
      trophyId: 'zombie_world_saved',
      summaryLines: [
        '⚔️ Your leadership and tactical brilliance turned the tide.',
        '🧟 Fortified safe zones expanded. The infected were contained.',
        '🌍 Humanity reclaimed key territories and stabilized supplies.'
      ]
    };
  }

  // Path 3: Unity (Empathy + confidence)
  if (EMP >= 18 && CON >= 14 && threat <= 35) {
    return {
      achieved: true,
      path: 'unity',
      trophyId: 'zombie_world_saved',
      summaryLines: [
        '❤️ Your compassion unified scattered survivors.',
        '🧟 Communities formed. Trust replaced fear.',
        '🌍 Together, humanity built a fragile but real civilization.'
      ]
    };
  }

  return {
    achieved: false,
    path: null,
    trophyId: null,
    summaryLines: [
      '🧟 The apocalypse rages on.',
      'The threat remains, the world still broken.',
      'But there is hope—if the next generation can do better.'
    ]
  };
}

/**
 * Compute victory state for alien_invasion
 * Multiple paths: tech (science), resistance (strength), unity (empathy)
 */
function computeAlienVictory(stats, alienThreat) {
  const INT = clamp(stats.intelligence || 0, 0, 20);
  const DIS = clamp(stats.discipline || 0, 0, 20);
  const EMP = clamp(stats.empathy || 0, 0, 20);
  const CON = clamp(stats.confidence || 0, 0, 20);
  
  const threat = clamp(alienThreat || 10, 0, 100);

  // Path 1: Tech (Science + discipline)
  if (INT >= 18 && DIS >= 14 && threat <= 35) {
    return {
      achieved: true,
      path: 'tech',
      trophyId: 'alien_world_saved',
      summaryLines: [
        '🛸 You engineered a weapon that disrupted their communications.',
        '👽 The alien forces fractured and retreated.',
        '🌍 Humanity claimed the skies again.'
      ]
    };
  }

  // Path 2: Resistance (Discipline + confidence)
  if (DIS >= 18 && CON >= 16 && threat <= 55) {
    return {
      achieved: true,
      path: 'resistance',
      trophyId: 'alien_world_saved',
      summaryLines: [
        '⚔️ Your strategic genius turned the tide against the invaders.',
        '👽 Human resistance cells coordinated a final stand.',
        '🌍 Against the odds, Earth pushed back the occupation.'
      ]
    };
  }

  // Path 3: Unity (Empathy + confidence)
  if (EMP >= 18 && CON >= 14 && threat <= 35) {
    return {
      achieved: true,
      path: 'unity',
      trophyId: 'alien_world_saved',
      summaryLines: [
        '❤️ Your empathy opened a dialogue—even with the aliens.',
        '👽 A fragile coexistence took root.',
        '🌍 Two species learned to share one world.'
      ]
    };
  }

  return {
    achieved: false,
    path: null,
    trophyId: null,
    summaryLines: [
      '👽 The invasion continues.',
      'Humanity fights on, but the outcome remains uncertain.',
      'Perhaps the next generation will find a way to victory.'
    ]
  };
}

/**
 * Main export: compute apocalypse victory given specialStartId and gameState
 */
export function computeApocalypseVictory(gameState) {
  const { specialStartId, stats, zombieThreat, zombieTraining, alienThreat } = gameState;

  if (specialStartId === 'zombie_apocalypse') {
    return computeZombieVictory(stats, zombieThreat, zombieTraining);
  }

  if (specialStartId === 'alien_invasion') {
    return computeAlienVictory(stats, alienThreat);
  }

  // Not an apocalypse scenario
  return {
    achieved: false,
    path: null,
    trophyId: null,
    summaryLines: []
  };
}