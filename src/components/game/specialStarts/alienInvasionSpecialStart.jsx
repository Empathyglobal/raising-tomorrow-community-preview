import { createSeededRng } from '@/components/game/GameStateContext';

// Deterministic yearly scenario for Alien Invasion
// Returns a scenario object consumable by ScenarioModal
export function buildAlienInvasionYearScenario({ state, age, rerollNonce = 0 }) {
  const runSeed = state?.runSeed || 'seed';
  const childName = state?.childName || 'your child';
  const threat = Math.max(0, Math.min(100, Number(state?.alienThreat || 0)));

  const rng = createSeededRng(`${runSeed}|alien|age:${age}|nonce:${rerollNonce}`);

  const flavorOps = [
    'sirens in the distance',
    'drone shadows over rooftops',
    'rations running thin',
    'a flicker on the radio',
    'footsteps in the stairwell',
  ];
  const flavor = rng.pick(flavorOps) || 'the world too quiet';

  const id = `alien_${age}_${rerollNonce}`;
  const opener = `Another year under occupation. You and ${childName} keep moving, keep listening. Threat Level: ${threat}/100.`;
  const scenarioText = `${opener}\n\nYou hear ${flavor}. What do you do?`;

  // Helper for state patches
  const clamp0to100 = (n) => Math.max(0, Math.min(100, Number(n || 0)));
  const patchThreat = (delta) => (prev) => ({ ...prev, alienThreat: clamp0to100((prev.alienThreat || 0) + delta) });
  const instantDeath = (reason) => (prev) => {
    const parentAgeAtBirth = Number.isFinite(Number(prev.parentAgeAtBirth)) ? Number(prev.parentAgeAtBirth) : 28;
    const genderKey = prev.parentRole === 'mom' ? 'female' : prev.parentRole === 'dad' ? 'male' : 'male';
    const spriteIndex = Number.isFinite(Number(prev.parentAvatarSpriteIndex)) ? Number(prev.parentAvatarSpriteIndex) : 0;
    
    return {
      ...prev,
      finished: true,
      deathEvent: {
        id: `alien_${Date.now()}`,
        icon: '🛸',
        title: 'They found you',
        body: reason || 'The patrol cut off your exit. You did what you could. No gore—just an ending.\n\nSome stories are brief. Yours mattered.' ,
        diedAtAge: prev.currentYear || age,
        ts: Date.now(),
      },
      deathContext: {
        mode: 'succession',
        reason: 'alien_caught',
        childAge: prev.currentYear || age,
        deceased: {
          name: prev.parentName || 'Guardian',
          role: prev.parentRole || 'player',
          parentAgeAtBirth,
          avatarGender: genderKey,
          avatarSpriteIndex: spriteIndex
        }
      },
      alienDeathCause: 'caught',
      scenarioPending: false,
      pendingScenario: false,
      scenarioCompletedThisAge: true,
      currentScenario: null,
      currentScenarioHookId: null,
      currentScenarioResolvedChoice: 'X'
    };
  };

  // Four choices: one instant death, two raise threat, one best lowers threat
  const choices = [
    {
      id: 'instant',
      letter: 'A',
      emoji: '⚠️',
      text: 'Run across the open street.',
      consequence: 'You sprint—too exposed, too loud.',
      deltas: { confidence: -1, empathy: -0.2 },
      stressDelta: 2,
      loveDelta: -1,
      statePatch: instantDeath('Open ground, floodlights, no cover. A patrol catches you between alleys.')
    },
    {
      id: 'risky_hide',
      letter: 'B',
      emoji: '🫥',
      text: 'Hide in a basement with flickering lights.',
      consequence: 'Dust and fear. You wait too long; neighbors start whispering.',
      deltas: { intelligence: 0.2, confidence: -0.3 },
      stressDelta: 1,
      loveDelta: 0,
      statePatch: patchThreat(+30)
    },
    {
      id: 'barter',
      letter: 'C',
      emoji: '🤝',
      text: 'Barter loudly for food at a crowded corner.',
      consequence: 'You get a little food—but noise travels.',
      deltas: { empathy: 0.3 },
      stressDelta: 0.5,
      loveDelta: 0.5,
      statePatch: patchThreat(+20)
    },
    {
      id: 'best_route',
      letter: 'D',
      emoji: '🧭',
      text: 'Take the quiet route, change paths twice, share a joke.',
      consequence: `${childName} laughs once—small and real. You make it to a safe door.`,
      deltas: { confidence: 0.6 },
      stressDelta: -1,
      loveDelta: 1,
      statePatch: patchThreat(-12)
    }
  ];

  return {
    id,
    title: 'Alien Invasion: Another Year',
    age,
    topic: 'survival',
    hookText: opener,
    scenarioText,
    choices,
    meta: { packId: 'special_alien', choicePack: 'alien', category: 'survival', intensity: 3, hookId: id }
  };
}