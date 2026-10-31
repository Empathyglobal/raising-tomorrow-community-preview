/* src/components/game/ExtremeSportsModal.jsx */

import React from 'react';
import GameModalShell from './GameModalShell';
import { EXTREME_SPORTS } from './extremeSportsData';
import { useGameState, formatMoney } from './GameStateContext';

const pickOne = (list) => {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
};

// Deterministic-ish chance so the same run feels consistent.
// Uses a small FNV-1a style hash → 0..1 float.
const seededChance = (seedStr, probability) => {
  const p = Math.max(0, Math.min(1, Number(probability || 0)));
  let h = 2166136261;
  const s = String(seedStr || '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = (h >>> 0) / 4294967296;
  return n < p;
};

const SUCCESS_OPENERS = [
  "This year, you say yes to a little adrenaline—safely.",
  "You decide to turn courage into a family hobby.",
  "You lean into a 'brave but smart' kind of fun.",
  "You pick something that makes their eyes go wide in the best way.",
  "You make a deal: helmets, rules, and then… send it."
];

const SAFETY_LINES = [
  "You do the safety talk, tighten straps, and make 'stop' a respected word.",
  "You model calm, check the gear twice, and let them go at their pace.",
  "You keep it playful, but you also keep it safe—no shortcuts.",
  "You make it clear: skill first, ego last."
];

const SUCCESS_CLOSERS = [
  "They walk a little taller afterward.",
  "They can't stop retelling the best part like it's a movie scene.",
  "You catch them practicing in tiny ways on ordinary days.",
  "Even when it's hard, they keep showing up. That’s growth."
];

const INJURY_CLOSERS = [
  "The rest of the year becomes a mix of healing, frustration, and tiny comebacks.",
  "It’s a tough reminder: brave doesn’t mean invincible.",
  "You focus on recovery—and on helping them not turn one bad moment into a fear story."
];

const formatDeltaBadge = (label, value) => {
  if (!value || value === 0) return null;
  const sign = value > 0 ? '+' : '';
  return `${label} ${sign}${value}`;
};

export default function ExtremeSportsModal({ open, onClose }) {
  const {
    gameState,
    consumeAction,
    spendMoney,
    applyDeltas,
    applyLove,
    applyStress,
    updateState,
    emitActionResult,
    getLocalAmount
  } = useGameState();

  const age = Number(gameState.currentYear || 0);
  const childName = gameState.childName || 'your child';
  const money = Number(gameState.money || 0);

  const eligible = EXTREME_SPORTS.filter(s => age >= Number(s.minAge || 0));

  const handleChoose = (sport) => {
    // Spend focus
    if (!consumeAction('extremeSports')) return;

    // Spend money (allow negative like other actions do)
    const baseCost = Math.max(0, Number(sport.moneyCost || 0));
    const cost = getLocalAmount(baseCost);
    let moneyDelta = 0;
    if (cost > 0) {
      spendMoney(cost);
      moneyDelta = -cost;
    }

    // Injury roll (deterministic-ish per run + age + sport)
    const seed = `${gameState.runSeed}|extremeSports|age:${age}|${sport.id}`;
    const injured = seededChance(seed, sport.injuryChance);

    const sessions = Math.floor(Math.random() * 7) + 4; // 4..10 times this year

    if (!injured) {
      const deltas = sport.deltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
      const loveDelta = Number(sport.loveDelta || 0);
      const stressDelta = Number(sport.stressDelta || 0);

      applyDeltas(deltas, `Extream Sports: ${sport.title}`);
      if (loveDelta !== 0) applyLove(loveDelta, `Extream Sports: ${sport.title}`);
      if (stressDelta !== 0) applyStress(stressDelta, `Extream Sports: ${sport.title}`);

      const bodyParts = [
        pickOne(SUCCESS_OPENERS),
        `You take ${childName} to ${sport.title}.`,
        pickOne(sport.successMemories),
        `Over the year, you end up doing it about ${sessions} times.`,
        pickOne(SAFETY_LINES),
        pickOne(SUCCESS_CLOSERS)
      ];

      const body = bodyParts.filter(Boolean).join('\n\n');

      emitActionResult({
        actionId: 'extremeSports',
        title: `${sport.emoji} ${sport.title}`,
        body,
        deltas,
        loveDelta,
        stressDelta,
        moneyDelta,
        focusDelta: -1,
        tags: ['grow', 'thrills', 'confidence'],
        meta: {
          emoji: sport.emoji,
          sportId: sport.id,
          coachNote: sport.coachNote
        }
      });

      onClose?.();
      return;
    }

    // Injured outcome
    updateState({
      childSickThisAge: true,
      childSickNote: sport.injuryNote
    });

    const deltas = sport.injuryDeltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
    const loveDelta = Number(sport.injuryLoveDelta || 0);
    const stressDelta = Number(sport.injuryStressDelta || 0);

    applyDeltas(deltas, `Extream Sports: ${sport.title} (injury)`);
    if (loveDelta !== 0) applyLove(loveDelta, `Extream Sports: ${sport.title} (injury)`);
    if (stressDelta !== 0) applyStress(stressDelta, `Extream Sports: ${sport.title} (injury)`);

    const bodyParts = [
      `You and ${childName} go all-in on ${sport.title} this year.`,
      pickOne(sport.successMemories),
      `Then a rough moment hits: ${pickOne(sport.injuryIncidents)}`,
      `Result: ${sport.injuryNote}.`,
      pickOne(sport.injuryAftercare),
      pickOne(INJURY_CLOSERS),
      "🚑 Injury week is now active. Visit Health (Doctor) to clear it and unlock physical actions again."
    ];

    const body = bodyParts.filter(Boolean).join('\n\n');

    emitActionResult({
      actionId: 'extremeSports',
      title: `🩹 ${sport.title}`,
      body,
      deltas,
      loveDelta,
      stressDelta,
      moneyDelta,
      focusDelta: -1,
      tags: ['grow', 'thrills', 'injury'],
      meta: {
        emoji: '🩹',
        sportId: sport.id,
        injured: true,
        coachNote: sport.coachNote
      }
    });

    onClose?.();
  };

  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title="🤘 Extream Sports"
      subtitle="Take your child on a high-thrill activity for growth… with a risk."
      maxWidth="max-w-xl"
    >
      <div className="text-xs text-slate-600 mb-4 space-y-2">
        <p>Game flavor, not real-life advice. In real life, follow age rules + safety training.</p>
        <p><span className="font-semibold">Injury consequence:</span> if an injury happens, your child becomes “injured this year” and physical actions are locked until you visit <span className="font-semibold">Health (Doctor)</span>.</p>
      </div>

      {eligible.length === 0 && (
        <div className="text-sm text-slate-600">No options available at this age.</div>
      )}

      <div className="space-y-3">
        {eligible.map((sport) => {
          const deltas = sport.deltas || {};
          const badges = [
            formatDeltaBadge('INT', deltas.intelligence),
            formatDeltaBadge('EMP', deltas.empathy),
            formatDeltaBadge('DIS', deltas.discipline),
            formatDeltaBadge('CON', deltas.confidence)
          ].filter(Boolean);

          const cost = getLocalAmount(Math.max(0, Number(sport.moneyCost || 0)));
          const injuryPct = Math.round((Number(sport.injuryChance || 0) * 100));

          return (
            <button
              key={sport.id}
              onClick={() => handleChoose(sport)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.99] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl leading-none">{sport.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800">{sport.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{sport.tagline}</div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {badges.length > 0 && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {badges.join(' • ')}
                      </span>
                    )}

                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      Risk: {sport.riskLabel} • Injury: {injuryPct}%
                    </span>

                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Cost: ${formatMoney(cost)}
                    </span>

                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Focus: 1
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </GameModalShell>
  );
}