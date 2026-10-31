export const CHAOS_MODE_LEVELS = [
  {
    level: 0,
    label: 'Off',
    short: 'No extra disasters.',
    details: 'Chaos Mode is disabled.'
  },
  {
    level: 1,
    label: 'Stressful',
    short: 'Every year brings a stressful, realistic problem.',
    details:
      'Triggers EVERY year. Breakdowns, fees, cancellations, surprise bills, and painful tradeoffs — usually survivable.'
  },
  {
    level: 2,
    label: 'Brutal',
    short: 'Hard mode: expensive, disruptive chaos every year.',
    details:
      'Triggers EVERY year. This matches the current Chaos baseline — bigger costs, uglier tradeoffs, frequent setbacks.'
  },
  {
    level: 3,
    label: 'Catastrophic',
    short: 'Worst-case disasters — every year, often with a second shock.',
    details:
      'Triggers EVERY year. Major emergencies, huge financial hits, life-derailing problems. Often chains into a second catastrophe.'
  }
];

export function clampChaosLevel(level) {
  const n = Number(level);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(3, Math.round(n)));
}

export function getChaosLevelFromExpansions(expansions = {}) {
  const raw = expansions?.chaosModeLevel;
  const enabled = !!expansions?.chaosMode;
  if (!enabled) return 0;
  return clampChaosLevel(raw ?? 2);
}

export function withChaosLevel(expansions = {}, level) {
  const clamped = clampChaosLevel(level);
  if (clamped <= 0) {
    const { chaosMode, chaosModeLevel, ...rest } = expansions || {};
    return { ...rest, chaosMode: false, chaosModeLevel: 0 };
  }
  return { ...(expansions || {}), chaosMode: true, chaosModeLevel: clamped };
}