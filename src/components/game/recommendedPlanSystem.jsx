// Recommended Child Plan System
// - Computes a multi-action bundle based on kid goals/milestones
// - Deterministic and milestone/goal-aware
// - Only available when minor child (<18) is present

import { createSeededRng, hasMinorChild, getActiveChildFromState, getDisplayedChildAge } from './GameStateContext';
import { LIFE_GOALS_BY_ID } from '@/components/content/lifeGoalsPack';

/**
 * Shared action definitions for plan execution
 * Includes effects that can be applied when plan is executed
 */
export const PLAN_ACTION_DEFS = {
  bond: { cost: 1, emoji: '❤️', title: 'Bond', tags: ['empathy', 'love'], love: 2, stress: 0, deltas: { empathy: 0.6, confidence: 0.2 } },
  play: { cost: 1, emoji: '🎮', title: 'Play', tags: ['confidence', 'happiness', 'love'], love: 1, stress: -0.4, deltas: { confidence: 0.4, happiness: 0.4 } },
  study: { cost: 1, emoji: '📚', title: 'Study', tags: ['intelligence', 'knowledge', 'discipline'], love: 0, stress: 0, deltas: { intelligence: 0.6, knowledge: 0.4, discipline: 0.2 } },
  library: { cost: 1, emoji: '🏛️', title: 'Library', tags: ['knowledge', 'intelligence'], love: 0, stress: 0, deltas: { knowledge: 0.6, intelligence: 0.2 } },
  bookstore: { cost: 1, emoji: '📖', title: 'Bookstore', tags: ['knowledge', 'curiosity'], love: 0, stress: 0, deltas: { knowledge: 0.4, curiosity: 0.3 } },
  empathyCards: { cost: 1, emoji: '🫶', title: 'Empathy Cards', tags: ['empathy', 'love'], love: 1, stress: 0, deltas: { empathy: 0.7 } },
  routine: { cost: 1, emoji: '🧱', title: 'Routine', tags: ['discipline', 'responsibility'], love: 0, stress: -0.1, deltas: { discipline: 0.6, responsibility: 0.3 } },
  parentStrategies: { cost: 1, emoji: '🧠', title: 'Parent Strategies', tags: ['discipline', 'empathy', 'responsibility'], love: 0.5, stress: -0.1, deltas: { discipline: 0.3, empathy: 0.2, responsibility: 0.2 } },
  playdates: { cost: 1, emoji: '🧑‍🤝‍🧑', title: 'Playdates', tags: ['social', 'confidence'], love: 0.5, stress: 0, deltas: { social: 0.7, confidence: 0.2 } },
  outings: { cost: 1, emoji: '🚗', title: 'Outings', tags: ['happiness', 'social', 'love'], love: 0.5, stress: -0.3, deltas: { happiness: 0.5, social: 0.3 } },
  outdoorAdventures: { cost: 1, emoji: '🏕️', title: 'Outdoor Adventures', tags: ['curiosity', 'fitness', 'confidence'], love: 0.2, stress: -0.3, deltas: { curiosity: 0.5, fitness: 0.4, confidence: 0.2 } },
  naturePlay: { cost: 1, emoji: '🌿', title: 'Nature Play', tags: ['health', 'happiness', 'fitness'], love: 0.2, stress: -0.4, deltas: { health: 0.4, happiness: 0.2, fitness: 0.2 } },
  funFact: { cost: 1, emoji: '🤓', title: 'Fun Fact', tags: ['knowledge', 'curiosity'], love: 0, stress: 0, deltas: { knowledge: 0.2, curiosity: 0.3 } },
  teachCulture: { cost: 1, emoji: '🌍', title: 'Teach Culture', tags: ['empathy', 'curiosity', 'social'], love: 0.3, stress: 0, deltas: { empathy: 0.3, curiosity: 0.4, social: 0.2 } },
  mindBody: { cost: 1, emoji: '🧘', title: 'Mind & Body', tags: ['health', 'discipline'], love: 0, stress: -1.0, deltas: { health: 0.3, discipline: 0.2 } },
  coping: { cost: 1, emoji: '🫧', title: 'Coping', tags: ['health'], love: 0, stress: -0.8, deltas: { health: 0.2 } },
  parentReset: { cost: 1, emoji: '🧘‍♂️', title: 'Parent Reset', tags: ['health'], love: -0.2, stress: -2.0, deltas: {} }
};

/**
 * Map kid life goal IDs to target tags for weighting
 */
const KID_GOAL_TO_TAGS = {
  kid_scholar: ['intelligence', 'knowledge'],
  kid_confident: ['confidence'],
  kid_kind: ['empathy'],
  kid_disciplined: ['discipline', 'responsibility'],
  kid_happy: ['happiness'],
  kid_creative: ['creativity', 'curiosity'],
  kid_athlete: ['fitness'],
  kid_healthy_habits: ['health'],
  kid_social_butterfly: ['social'],
  kid_resilient: ['health', 'confidence', 'discipline', 'happiness'],
  kid_leader: ['confidence', 'responsibility', 'social'],
  kid_explorer: ['curiosity', 'fitness'],
  kid_helper: ['responsibility', 'empathy'],
  kid_maker: ['creativity', 'discipline']
};

/**
 * Compute a recommended child plan (2-3 actions) based on kid goals/milestones
 * Returns null if no minor child or no valid plan can be constructed
 */
export function computeRecommendedPlan(gameState, getActionAvailability) {
  // Only available with minor child
  if (!hasMinorChild(gameState)) {
    return null;
  }

  const focusAvailable = Number(gameState.actionPoints || 0);
  const kid = getActiveChildFromState(gameState);
  const childAge = kid ? getDisplayedChildAge(gameState, kid) : Number(gameState.currentYear || 0);

  // Get active milestone quest (if any)
  const quest = gameState.milestones?.kidQuestActive || null;

  // Determine target tag weights
  let weights = {};

  // (a) Quest-driven weighting
  if (quest && quest.metric) {
    const metricType = quest.metric.type;
    let relevantTag = null;

    // Map quest metric to a tag
    if (metricType === 'stat_threshold' || metricType === 'stat_increase' || metricType === 'stat_below') {
      const statKey = quest.metric.statKey;
      // Map stat keys to tags
      if (statKey === 'intelligence') relevantTag = 'intelligence';
      else if (statKey === 'empathy') relevantTag = 'empathy';
      else if (statKey === 'discipline') relevantTag = 'discipline';
      else if (statKey === 'confidence') relevantTag = 'confidence';
      else if (statKey === 'happiness') relevantTag = 'happiness';
      else if (statKey === 'social') relevantTag = 'social';
      else if (statKey === 'health') relevantTag = 'health';
      else if (statKey === 'fitness') relevantTag = 'fitness';
      else if (statKey === 'knowledge') relevantTag = 'knowledge';
      else if (statKey === 'curiosity') relevantTag = 'curiosity';

      if (relevantTag) {
        weights[relevantTag] = (weights[relevantTag] || 0) + 4;

        // Urgency bonus if deadline is approaching
        if (quest.deadlineChildAge && (quest.deadlineChildAge - childAge) <= 2) {
          weights[relevantTag] += 2;
        }
      }
    }
  }

  // (b) Life goal-driven weighting
  let primaryGoalId = null;
  const selected = Array.isArray(gameState.lifeGoals?.selectedIds) ? gameState.lifeGoals.selectedIds : [];
  const kidGoals = selected.filter(id => LIFE_GOALS_BY_ID[id]?.track === 'kid');

  if (kidGoals.length > 0) {
    // Pick primary goal deterministically with seeded RNG
    const rng = createSeededRng(`${gameState.runSeed || 'seed'}|rcp|age:${gameState.currentYear}|v1`);
    primaryGoalId = kidGoals[Math.floor(rng.nextFloat() * kidGoals.length)];

    // Apply weights to goal tags
    for (const goalId of kidGoals) {
      const tags = KID_GOAL_TO_TAGS[goalId] || [];
      const weight = goalId === primaryGoalId ? 3 : 1;
      for (const tag of tags) {
        weights[tag] = (weights[tag] || 0) + weight;
      }
    }
  }

  // (c) Fallback: weight lowest child stats
  if (Object.keys(weights).length === 0) {
    const statKeys = ['intelligence', 'empathy', 'discipline', 'confidence', 'happiness', 'social', 'health', 'fitness', 'curiosity', 'knowledge'];
    const stats = statKeys.map(key => ({
      key,
      value: Number(gameState.stats?.[key] || 0)
    }));
    stats.sort((a, b) => a.value - b.value);

    // Weight the 1-2 lowest stats
    for (let i = 0; i < Math.min(2, stats.length); i++) {
      weights[stats[i].key] = (weights[stats[i].key] || 0) + 2;
    }
  }

  // Build candidate action list
  const candidates = Object.entries(PLAN_ACTION_DEFS)
    .filter(([actionId]) => {
      const avail = getActionAvailability(actionId);
      return avail && avail.enabled === true;
    })
    .map(([actionId, def]) => {
      // Calculate score
      let score = 0;
      for (const tag of def.tags) {
        score += weights[tag] || 0;
      }
      // Add small deterministic jitter
      const rng = createSeededRng(`${gameState.runSeed || 'seed'}|score|${actionId}|age:${gameState.currentYear}`);
      score += rng.nextFloat() * 0.25;

      return { actionId, def, score };
    });

  // Sort by score (highest first)
  candidates.sort((a, b) => b.score - a.score);

  // Greedy selection: pick actions until focus runs out
  const selectedActions = [];
  let totalCost = 0;
  const usedTagSets = new Set();

  for (const candidate of candidates) {
    const { actionId, def, score } = candidate;

    // Check cost
    if (totalCost + def.cost > focusAvailable || totalCost + def.cost > 3) {
      continue;
    }

    // Avoid duplicate tag sets (unless no alternatives)
    const tagSetKey = def.tags.sort().join('|');
    if (usedTagSets.has(tagSetKey) && selectedActions.length > 0) {
      continue;
    }

    selectedActions.push(actionId);
    usedTagSets.add(tagSetKey);
    totalCost += def.cost;

    if (selectedActions.length >= 3) break;
  }

  // Return null if no actions selected
  if (selectedActions.length === 0) {
    return null;
  }

  // Build reason line
  let reasonLine = '';
  if (quest && quest.title) {
    reasonLine = `Milestone: ${quest.title} (due by age ${quest.deadlineChildAge})`;
  } else if (primaryGoalId && LIFE_GOALS_BY_ID[primaryGoalId]) {
    reasonLine = `Goal: ${LIFE_GOALS_BY_ID[primaryGoalId].title}`;
  } else {
    reasonLine = 'Build core strengths';
  }

  return {
    actions: selectedActions,
    totalFocusCost: totalCost,
    title: 'Recommended Child Plan',
    reasonLine,
    meta: { primaryGoalId, questId: quest?.id || null }
  };
}