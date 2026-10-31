import React from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import IconForKey from './IconForKey';
import { evaluateBadge } from '@/components/game/metaBadges/evaluator';
import { base44 } from '@/api/base44Client';

const TierRow = ({ tier, displayText, achieved }) => (
  <div className={`rounded-lg p-3 border ${achieved ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${achieved ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>{tier}</span>
      <span className="text-sm text-slate-700">{displayText}</span>
    </div>
  </div>
);

export default function BadgeDetailModal({ open, onClose, def, earned }) {
  const [specialStarts, setSpecialStarts] = React.useState([]);
  React.useEffect(() => {
    if (!open) return;
    (async () => {
      const list = await base44.entities.SpecialStartDefinition.list();
      setSpecialStarts(Array.isArray(list) ? list : []);
    })();
  }, [open]);

  if (!def) return null;

  const best = earned?.bestTierEarned || null;
  const metrics = earned?.bestMetricsSnapshot || null;
  const evalRes = metrics ? evaluateBadge(def, metrics) : null;

  const rank = { Bronze: 1, Silver: 2, Gold: 3 };
  const bestRank = rank[best] || 0;
  const nextTier = bestRank < 3 ? (bestRank === 2 ? 'Gold' : bestRank === 1 ? 'Silver' : 'Bronze') : null;

  const nextProgress = metrics && evalRes ? (evalRes.progressByTier?.[nextTier] || []) : [];

  const tierToRank = (t) => ({ Bronze: 1, Silver: 2, Gold: 3 }[t] || 0);
  const unlockedStarts = bestRank > 0 ? specialStarts.filter((s) => {
    const u = s?.unlock;
    if (!u || !Array.isArray(u.anyOf)) return false;
    return u.anyOf.some((group) => {
      const all = Array.isArray(group?.allOf) ? group.allOf : [];
      return all.some((c) => c?.type === 'badgeTier' && c.badgeId === def.id && tierToRank(c.minTier || 'Bronze') <= bestRank);
    });
  }) : [];

  const unlocksForTier = (tierId) => {
    const t = (def.tiers || []).find(t => t.tier === tierId);
    const arr = Array.isArray(t?.rewardUnlocks) ? t.rewardUnlocks : [];
    return arr;
  };

  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title={def.name}
      subtitle={best ? `${best} Tier` : 'Locked'}
      illustration={false}
      footer={
        <div className="flex items-center justify-end">
          <button onClick={onClose} className="SBButton SBButton--secondary px-4 py-2">Close</button>
        </div>
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <IconForKey iconKey={def.iconKey} />
        <p className="text-slate-700 text-sm">{def.description}</p>
      </div>

      <div className="space-y-2 mb-4">
        {(def.tiers || []).map(t => (
          <TierRow key={t.tier} tier={t.tier} displayText={t.displayText} achieved={(rank[t.tier] || 0) <= bestRank && bestRank > 0} />
        ))}
      </div>

      {nextTier && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Progress toward {nextTier}</h4>
          {!metrics && (
            <p className="text-xs text-slate-500">Complete a run to start tracking progress.</p>
          )}
          {metrics && nextProgress && nextProgress.length > 0 && (
            <div className="space-y-2">
              {nextProgress.map((p, idx) => (
                <div key={idx} className="w-full">
                  <div className="h-2 w-full rounded bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${Math.round(p * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">Unlocks</h4>
        {bestRank === 0 && (
          <p className="text-xs text-slate-500">No special starts for this badge yet.</p>
        )}
        {bestRank > 0 && unlockedStarts.length === 0 && (
          <p className="text-xs text-slate-500">No special starts for your current tier.</p>
        )}
        {bestRank > 0 && unlockedStarts.length > 0 && (
          <ul className="list-disc list-inside text-sm text-slate-700">
            {unlockedStarts.map((s) => (
              <li key={s.id}>{s.name || s.id}</li>
            ))}
          </ul>
        )}
      </div>
    </GameModalShell>
  );
}