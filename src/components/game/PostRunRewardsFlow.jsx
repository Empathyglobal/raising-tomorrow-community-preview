import React from 'react';
import { base44 } from '@/api/base44Client';
import { useGameState } from '@/components/game/GameStateContext';
import GameModalShell from '@/components/game/GameModalShell';
import IconForKey from '@/components/metaBadges/IconForKey';

function buildRunSnapshot(state) {
  const checkpoints = Array.isArray(state.yearCheckpoints) ? state.yearCheckpoints : [];
  const years = checkpoints
    .filter(cp => cp?.kind === 'yearStart')
    .sort((a, b) => (a.age || 0) - (b.age || 0))
    .map(cp => ({ love: Number(cp?.snapshot?.love ?? 0), stress: Number(cp?.snapshot?.stress ?? 0) }));

  const timeline = (Array.isArray(state.timelineEntries) ? state.timelineEntries : []).map(e => ({
    intensity: Number(e?.meta?.intensity ?? 0),
    tags: Array.isArray(e?.meta?.tags) ? e.meta.tags : [],
  }));

  const endStats = state?.stats || {};
  const endRelationships = { teacherTrust: Number(state?.teacherTrust || 0), peerCircle: Number(state?.peerCircle || 0) };

  const exp = state?.expansions || {};
  const lvl = Number.isFinite(Number(exp.chaosModeLevel)) ? Number(exp.chaosModeLevel) : (exp.chaosMode ? 2 : 0);

  return {
    runId: String(state.runSeed || `run_${Date.now()}`),
    completedAge: Number(state.currentYear || 0),
    years,
    timeline,
    endStats: {
      confidence: Number(endStats.confidence || 0),
      discipline: Number(endStats.discipline || 0),
      money: Number(state.money || 0),
    },
    endRelationships,
    flags: { chaosMode: lvl > 0, chaosModeLevel: lvl },
    specialStartId: state?.specialStartId || null,
  };
}

function WhyText({ def, tier, metrics }) {
  // Render a compact explanation based on the first criterion in the achieved tier
  try {
    const t = (def.tiers || []).find(x => x.tier === tier);
    const grp = t?.criteria || null;
    const items = Array.isArray(grp?.items) ? grp.items : [];
    const first = items[0] || null;
    if (!first) return <span className="text-xs text-slate-500">Nice balance this run.</span>;

    const fmtPct = (x) => `${Math.round(Number(x || 0) * 100)}%`;
    const pick = (k) => metrics?.[k];

    if (first.type === 'metricCompare') {
      const val = pick(first.metricKey);
      return <span className="text-xs text-slate-500">{first.metricKey} {Math.round(Number(val || 0))}</span>;
    }
    if (first.type === 'ratioCompare') {
      const num = Number(metrics?.[first.numeratorKey] || 0);
      const den = Number(metrics?.[first.denominatorKey] || 0);
      const ratio = den > 0 ? num / den : 0;
      return <span className="text-xs text-slate-500">{first.numeratorKey}/{first.denominatorKey} {fmtPct(ratio)}</span>;
    }
    if (first.type === 'minCount' || first.type === 'maxCount') {
      const val = pick(first.metricKey);
      return <span className="text-xs text-slate-500">{first.metricKey} {Math.round(Number(val || 0))}</span>;
    }
    if (first.type === 'booleanIs') {
      return <span className="text-xs text-slate-500">{first.metricKey}: {String(first.value)}</span>;
    }
    return <span className="text-xs text-slate-500">Great run!</span>;
  } catch {
    return <span className="text-xs text-slate-500">Great run!</span>;
  }
}

export default function PostRunRewardsFlow() {
  const { gameState } = useGameState();
  const [step, setStep] = React.useState(null); // 'badges' | 'unlocks' | null
  const [awarded, setAwarded] = React.useState([]); // [{def, tier, status}]
  const [metrics, setMetrics] = React.useState(null);
  const [unlocks, setUnlocks] = React.useState([]); // array of specialStartId strings

  React.useEffect(() => {
    const finished = !!gameState?.finished;
    const ts = Number(gameState?.lastRunSummary?.ts || 0);
    if (!finished || ts <= 0) return;

    // Run once per finished summary
    const key = `rt_badges_awarded_for_ts_${ts}`;
    try { if (localStorage.getItem(key) === '1') return; } catch {}

    // Kick off award flow
    (async () => {
      try {
        const runSnapshot = buildRunSnapshot(gameState);
        setMetrics({
          avgLove: (runSnapshot.years || []).reduce((a, y) => a + (y.love || 0), 0) / Math.max(1, (runSnapshot.years || []).length),
          avgStress: (runSnapshot.years || []).reduce((a, y) => a + (y.stress || 0), 0) / Math.max(1, (runSnapshot.years || []).length),
          endConfidence: runSnapshot.endStats?.confidence || 0,
          endDiscipline: runSnapshot.endStats?.discipline || 0,
          endMoney: runSnapshot.endStats?.money || 0,
        });
        const { data } = await base44.functions.invoke('metaBadges', { runSnapshot });
        const awardedArr = Array.isArray(data?.awarded) ? data.awarded : [];
        if (awardedArr.length === 0) {
          setAwarded([]);
          setUnlocks([]);
          setStep('badges');
          try { if (!localStorage.getItem('rt_onboarding_unlocks_shown')) setShowUnlockFTUE(true); } catch {}
          try { localStorage.setItem(key, '1'); } catch {}
          return;
        }
        // Load badge defs for names/icons and unlocks
        const defs = await base44.entities.BadgeDefinition.list().catch(() => []);
        const map = {}; (defs || []).forEach(d => { map[d.id] = d; });

        const decorated = awardedArr.map(item => ({ ...item, def: map[item.badgeId] })).filter(x => x.def);
        setAwarded(decorated);
        try { if (!localStorage.getItem('rt_onboarding_unlocks_shown')) setShowUnlockFTUE(true); } catch {}

        const unlocked = [];
        for (const it of decorated) {
          const tierDef = (it.def.tiers || []).find(t => t.tier === it.tier);
          const arr = Array.isArray(tierDef?.rewardUnlocks) ? tierDef.rewardUnlocks : [];
          arr.forEach(u => { if (!unlocked.includes(u)) unlocked.push(u); });
        }
        setUnlocks(unlocked);
        setStep('badges');
        try { localStorage.setItem(key, '1'); } catch {}
      } catch (e) {
        // Fail silently; do not block gameplay
        setStep(null);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.finished, gameState?.lastRunSummary?.ts]);

  const closeAll = () => setStep(null);

  // Badges Earned modal
  const showBadges = step === 'badges';
  const [showUnlockFTUE, setShowUnlockFTUE] = React.useState(false);
  const hasAwards = (awarded || []).length > 0;

  // Unlocks modal
  const showUnlocks = step === 'unlocks';

  return (
    <>
      <GameModalShell
        open={showBadges}
        onClose={closeAll}
        title={hasAwards ? 'Badges Earned' : 'Badges'}
        subtitle={hasAwards ? 'Nice run!' : ''}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button className="SBButton SBButton--secondary px-4 py-2" onClick={closeAll}>Done</button>
            <button className="SBButton SBButton--primary px-4 py-2" onClick={() => setStep('unlocks')}>Continue</button>
          </div>
        }
      >
        {showUnlockFTUE && (
          <div className="rounded-xl p-4 border bg-amber-50/80 mb-3 text-slate-800">
            <div className="text-sm font-semibold mb-1">Badges unlock Special Starts</div>
            <div className="text-xs">Tap a locked Start to see exactly how to unlock it. Pin one as your goal.</div>
            <div className="mt-2 flex justify-end">
              <button className="SBButton SBButton--primary px-3 py-1.5 text-xs" onClick={() => { try { localStorage.setItem('rt_onboarding_unlocks_shown','1'); } catch {} setShowUnlockFTUE(false); }}>Got it</button>
            </div>
          </div>
        )}
        {hasAwards ? (
          <div className="space-y-3">
            {awarded.map((a) => (
              <div key={`${a.badgeId}_${a.tier}`} className="rounded-xl p-4 border bg-white/80">
                <div className="flex items-start gap-3">
                  <IconForKey iconKey={a.def.iconKey} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-slate-800">{a.def.name}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">{a.tier}</span>
                      {a.status === 'upgraded' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Upgraded</span>
                      )}
                    </div>
                    <div className="mt-1">
                      <WhyText def={a.def} tier={a.tier} metrics={metrics || {}} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-4 border bg-white/80">
            <div className="text-sm text-slate-700">No new badges this run — check Badge Goals to target your next unlock.</div>
          </div>
        )}
      </GameModalShell>

      <GameModalShell
        open={showUnlocks}
        onClose={closeAll}
        title="Unlocked Special Starts"
        subtitle="Lifetime rewards from your badges"
        footer={
          <div className="flex items-center justify-end">
            <button className="SBButton SBButton--primary px-4 py-2" onClick={closeAll}>Continue</button>
          </div>
        }
      >
        {(unlocks || []).length > 0 ? (
          <ul className="list-disc list-inside text-sm text-slate-700">
            {unlocks.map(u => (<li key={u}>{u}</li>))}
          </ul>
        ) : (
          <div className="rounded-xl p-4 border bg-white/80">
            <div className="text-sm text-slate-700">No new Special Starts this run—keep pushing, you're close.</div>
          </div>
        )}
      </GameModalShell>
    </>
  );
}