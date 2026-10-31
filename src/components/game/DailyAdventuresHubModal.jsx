import React from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState, hasMinorChild } from '@/components/game/GameStateContext';
import { PARENTING_ADVENTURES, ADULT_ADVENTURES } from '@/components/game/dailyAdventuresBitlifeCatalog';

const RISK_BASE = { low: 0.52, medium: 0.38, high: 0.24 };

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function hashDayToIndex(len) {
  const d = new Date();
  const key = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h) % Math.max(1, len);
}

function computeChance({ choice, category, gameState, runVars }) {
  const base = RISK_BASE[choice.riskTier] ?? 0.3;
  let chance = base;

  const childStats = gameState?.stats || {};
  const parent = {
    playerHealth: Number(gameState?.playerHealth ?? 70),
    stress: Number(gameState?.stress ?? 40),
    money: Number(gameState?.money ?? 0),
    love: Number(gameState?.love ?? 50),
  };

  const sWeights = (choice.check?.stats) || {};
  const pWeights = (choice.check?.parent) || {};
  const rWeights = (choice.check?.run) || {};

  // Stats: treat missing as baseline 5
  Object.entries(sWeights).forEach(([k, w]) => {
    const v = Number(childStats[k]);
    const val = Number.isFinite(v) ? v : 5;
    chance += (val - 5) * Number(w || 0);
  });

  // Parent: normalize typical ranges roughly around 5
  Object.entries(pWeights).forEach(([k, w]) => {
    let v = Number(parent[k]);
    if (!Number.isFinite(v)) v = 5;
    if (k === 'money') v = clamp(v / 1000, -5, 10) + 5; // map money to ~0..10 baseline 5
    if (k === 'playerHealth') v = clamp((v / 10), 0, 10); // 0..10
    if (k === 'stress' || k === 'love') v = clamp(v / 10, 0, 10);
    chance += (v - 5) * Number(w || 0);
  });

  // Run vars
  Object.entries(rWeights).forEach(([k, w]) => {
    const val = Number(runVars[k] || 0);
    chance += val * Number(w || 0);
  });

  // Stress modifier (parent stress)
  const stress = parent.stress;
  if (stress >= 70) chance -= 0.06; else if (stress <= 25) chance += 0.04;

  return clamp(chance, 0.05, 0.85);
}

function useSessionCounters() {
  const [attempts, setAttempts] = React.useState(0);
  const [wins, setWins] = React.useState(0);
  return {
    attempts, wins,
    incAttempt: () => setAttempts(a => a + 1),
    incWin: () => setWins(w => w + 1),
    reset: () => { setAttempts(0); setWins(0); }
  };
}

export default function DailyAdventuresHubModal({ open, onClose }) {
  const { gameState, addDiamonds, applyStress, applyLove, applyMoneyDelta, applyDeltas, emitActionResult, recordTimelineEntry } = useGameState();
  const { attempts, wins, incAttempt, incWin } = useSessionCounters();
  const minorChildPresent = hasMinorChild(gameState);

  const parentingIdx = hashDayToIndex(PARENTING_ADVENTURES.length);
  const adultIdx = hashDayToIndex(ADULT_ADVENTURES.length);
  const featuredParenting = PARENTING_ADVENTURES[parentingIdx];
  const featuredAdult = ADULT_ADVENTURES[adultIdx];

  const [view, setView] = React.useState('hub'); // hub | player
  const [adventure, setAdventure] = React.useState(null);
  const [runVars, setRunVars] = React.useState({ composure: 0, chaos: 0, cred: 0 });
  const [nodeId, setNodeId] = React.useState(null);
  const [stepNum, setStepNum] = React.useState(1);
  const [pendingOutcome, setPendingOutcome] = React.useState(null); // {success, text}
  const [finished, setFinished] = React.useState(null); // { outcome: 'win'|'fail', reward }

  const startAdventure = (adv) => {
    setAdventure(adv);
    setRunVars({ composure: 0, chaos: 0, cred: 0 });
    setNodeId(adv.startNodeId);
    setStepNum(1);
    setPendingOutcome(null);
    setFinished(null);
    setView('player');
  };

  const currentNode = adventure && adventure.nodes[nodeId];

  const applyEffects = (fx, category) => {
    if (!fx) return;
    if (typeof fx.stress === 'number') applyStress(fx.stress);
    if (typeof fx.love === 'number') applyLove(fx.love);
    if (typeof fx.money === 'number') applyMoneyDelta(fx.money);
    const childStats = fx.childStats || null;
    if (childStats) applyDeltas(childStats, 'Daily Adventure');
  };

  const choose = (choice) => {
    incAttempt();
    // Update run vars from choice
    const delta = choice.runDelta || {};
    setRunVars(prev => ({
      composure: (prev.composure || 0) + (delta.composure || 0),
      chaos: (prev.chaos || 0) + (delta.chaos || 0),
      cred: (prev.cred || 0) + (delta.cred || 0),
    }));

    const chance = computeChance({ choice, category: adventure.category, gameState, runVars: { ...runVars, ...delta } });
    const roll = Math.random();
    const success = roll < chance;
    const branch = success ? choice.onSuccess : choice.onFail;

    applyEffects(branch.effects, adventure.category);

    setPendingOutcome({ success, text: branch.text });

    const next = branch.next;
    if (next === 'WIN' || next === 'FAIL') {
      // Finish after user clicks continue
    } else {
      // Advance to next node after they continue
    }
  };

  const continueAfterOutcome = () => {
    if (!pendingOutcome || !adventure) return;
    const branchText = pendingOutcome.text;
    const lastChoiceSuccess = pendingOutcome.success;
    const choice = null; // not needed now

    const next = (() => {
      // Find which choice outcome we just showed to know the next
      const node = currentNode;
      if (!node) return 'FAIL';
      // This is tricky without keeping the chosen choice reference; store it on pendingOutcome next time
      return pendingOutcome.next || 'FAIL';
    })();
  };

  // Keep the chosen outcome's next in state
  const onSelect = (choice) => {
    const delta = choice.runDelta || {};
    const chance = computeChance({ choice, category: adventure.category, gameState, runVars: { ...runVars, ...delta } });
    const roll = Math.random();
    const success = roll < chance;
    const branch = success ? choice.onSuccess : choice.onFail;

    setRunVars(prev => ({ composure: (prev.composure||0)+(delta.composure||0), chaos: (prev.chaos||0)+(delta.chaos||0), cred: (prev.cred||0)+(delta.cred||0) }));

    applyEffects(branch.effects, adventure.category);

    setPendingOutcome({ success, text: branch.text, next: branch.next });
  };

  const onContinue = () => {
    if (!pendingOutcome) return;
    const { next, success } = pendingOutcome;
    setPendingOutcome(null);

    if (next === 'WIN' || next === 'FAIL') {
      const won = next === 'WIN';
      if (won) {
        // reward
        const diff = Number(adventure.difficulty || 1);
        const base = Math.ceil(diff / 2);
        const bonus = Math.random() < 0.15 ? 1 : 0;
        const reward = clamp(base + bonus, 1, 4);
        addDiamonds(reward, 'daily_adventure');
        incWin();
        emitActionResult({
          title: `✅ WIN — ${adventure.title}`,
          body: `${adventure.winText}`,
          deltas: {}, loveDelta: 0, stressDelta: 0, moneyDelta: 0,
          tags: ['daily_adventure'],
        });
        recordTimelineEntry({ kind: 'daily_adventure', title: adventure.title, detail: 'Win', deltas: null, moneyDelta: 0, loveDelta: 0, stressDelta: 0, meta: { category: adventure.category, adventureId: adventure.id, outcome: 'win', difficulty: adventure.difficulty, diamondsEarned: reward } });
        setFinished({ outcome: 'win', reward });
      } else {
        emitActionResult({
          title: `💥 FAIL — ${adventure.title}`,
          body: `${adventure.failText}`,
          deltas: {}, loveDelta: 0, stressDelta: 0, moneyDelta: 0,
          tags: ['daily_adventure'],
        });
        recordTimelineEntry({ kind: 'daily_adventure', title: adventure.title, detail: 'Fail', deltas: null, moneyDelta: 0, loveDelta: 0, stressDelta: 0, meta: { category: adventure.category, adventureId: adventure.id, outcome: 'fail', difficulty: adventure.difficulty, diamondsEarned: 0 } });
        setFinished({ outcome: 'fail', reward: 0 });
      }
    } else {
      setNodeId(next);
      setStepNum(s => s + 1);
    }
  };

  const resetToHub = () => {
    setView('hub');
    setAdventure(null);
    setNodeId(null);
    setPendingOutcome(null);
    setFinished(null);
  };

  const renderChoice = (c) => (
    <button
      key={c.id}
      onClick={() => onSelect(c)}
      className="w-full text-left p-3 rounded-lg border transition-all border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-800">{c.text}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Risk: {c.riskTier}</div>
        </div>
      </div>
    </button>
  );

  const hub = (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Featured Today</h3>
        <div className="space-y-3">
          {minorChildPresent && (
            <div className="p-3 rounded-xl border bg-white border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-slate-800 font-semibold">Parenting Adventure of the Day</div>
                  <div className="text-xs text-slate-500">{featuredParenting.title} • Diff {featuredParenting.difficulty} • {featuredParenting.rewardHint}</div>
                </div>
                <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs" onClick={() => startAdventure(featuredParenting)}>Start</button>
              </div>
              <button className="text-xs text-indigo-700 underline" onClick={() => startAdventure(PARENTING_ADVENTURES[Math.floor(Math.random()*PARENTING_ADVENTURES.length)])}>Try a different parenting adventure</button>
            </div>
          )}
          <div className="p-3 rounded-xl border bg-white border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-slate-800 font-semibold">Adult Adventure of the Day</div>
                <div className="text-xs text-slate-500">{featuredAdult.title} • Diff {featuredAdult.difficulty} • {featuredAdult.rewardHint}</div>
              </div>
              <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs" onClick={() => startAdventure(featuredAdult)}>Start</button>
            </div>
            <button className="text-xs text-indigo-700 underline" onClick={() => startAdventure(ADULT_ADVENTURES[Math.floor(Math.random()*ADULT_ADVENTURES.length)])}>Try a different adult adventure</button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Practice Mode</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {minorChildPresent && (
            <button className="p-3 rounded-lg border bg-white text-left border-slate-200 hover:border-amber-400 hover:bg-amber-50/50" onClick={() => startAdventure(PARENTING_ADVENTURES[Math.floor(Math.random()*PARENTING_ADVENTURES.length)])}>Random Parenting Adventure</button>
          )}
          <button className="p-3 rounded-lg border bg-white text-left border-slate-200 hover:border-amber-400 hover:bg-amber-50/50" onClick={() => startAdventure(ADULT_ADVENTURES[Math.floor(Math.random()*ADULT_ADVENTURES.length)])}>Random Adult Adventure</button>
          <button className="p-3 rounded-lg border bg-white text-left border-slate-200 hover:border-amber-400 hover:bg-amber-50/50" onClick={() => {
            const pools = minorChildPresent && Math.random() < 0.5 ? PARENTING_ADVENTURES : ADULT_ADVENTURES;
            startAdventure(pools[Math.floor(Math.random()*pools.length)]);
          }}>Surprise Me</button>
        </div>
      </section>

      <div className="text-xs text-slate-500">Attempts this session: {attempts} • Wins this session: {wins}</div>
    </div>
  );

  const player = adventure && currentNode && (
    <div className="space-y-4">
      {!finished && (
        <div className="text-xs text-slate-500">Step {stepNum} of {Math.min(4, Object.keys(adventure.nodes).length)}</div>
      )}
      <div className="SBPanel p-3 rounded-lg">
        <div className="text-slate-800 font-semibold mb-1">{adventure.title}</div>
        {!pendingOutcome ? (
          <>
            <p className="text-sm text-slate-700">{(currentNode.text || '').replaceAll('{childName}', gameState.childName || 'your child')}</p>
            <p className="text-sm text-slate-600 mt-2">{currentNode.prompt}</p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-700">…and then:</p>
            <p className="text-sm text-slate-800 mt-1">{(pendingOutcome.text || '').replaceAll('{childName}', gameState.childName || 'your child')}</p>
          </>
        )}
      </div>

      {!pendingOutcome && !finished && (
        <div className="space-y-2">
          {currentNode.choices.map(renderChoice)}
        </div>
      )}

      {pendingOutcome && (
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm" onClick={onContinue}>Continue</button>
        </div>
      )}

      {finished && (
        <div className="SBPanel p-3 rounded-lg">
          <div className="text-slate-800 font-semibold mb-1">{finished.outcome === 'win' ? '✅ WIN' : '💥 FAIL'}</div>
          <p className="text-sm text-slate-700">{(finished.outcome === 'win' ? adventure.winText : adventure.failText).replaceAll('{childName}', gameState.childName || 'your child')}</p>
          <div className="mt-3 flex gap-2">
            <button className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 text-sm" onClick={() => startAdventure(adventure)}>Replay</button>
            <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm" onClick={resetToHub}>Back to Hub</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title="Daily Adventures"
      subtitle="2 featured today (Parenting + Adult). Practice mode = unlimited."
      headerImageKey={view === 'hub' ? 'play' : (adventure?.category === 'parenting' ? 'family' : 'work')}
    >
      {view === 'hub' ? hub : player}
    </GameModalShell>
  );
}