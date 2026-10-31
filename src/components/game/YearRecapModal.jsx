import React from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function YearRecapModal({ open, recap, onClose, onViewAlbum, onShare, onQuickBudget, onHideForever }) {
  const [unlockHint, setUnlockHint] = React.useState(null);
  const [hideHint, setHideHint] = React.useState(false);

  React.useEffect(() => {
    if (!open || !recap) return;
    (async () => {
      try {
        const id = localStorage.getItem('rt_pinned_goal_id');
        if (!id) { setUnlockHint(null); return; }
        const starts = await base44.entities.SpecialStartDefinition.list().catch(() => []);
        const s = (starts || []).find(x => x.id === id);
        if (!s) { setUnlockHint(null); return; }
        const user = await base44.auth.me().catch(() => null);
        const earned = user ? await base44.entities.BadgeEarned.filter({ userId: user.id }).catch(() => []) : [];
        const defs = await base44.entities.BadgeDefinition.list().catch(() => []);
        const nameFor = (bid) => (defs.find(d => d.id === bid)?.name || bid);
        const rank = (t) => (t === 'Gold' ? 3 : t === 'Silver' ? 2 : t === 'Bronze' ? 1 : 0);
        const current = {}; (earned || []).forEach(e => { current[e.badgeId] = e.bestTierEarned; });
        const groups = s?.unlock?.anyOf || [];
        let unmet = null;
        for (const g of groups) {
          const all = g?.allOf || [];
          const miss = all.find(c => c?.type === 'badgeTier' && rank(current[c.badgeId] || '') < rank(c.minTier || 'Bronze'));
          if (!miss) { unmet = null; break; }
          if (!unmet) unmet = miss;
        }
        if (unmet) {
          setUnlockHint(`To unlock ${s.name || s.id}: raise ${nameFor(unmet.badgeId)} to ${unmet.minTier}.`);
        } else {
          setUnlockHint(null);
        }
      } catch {
        setUnlockHint(null);
      }
    })();
  }, [open, recap?.age]);

  if (!open || !recap) return null;

  // Defensive: some UI lines reference `age`, so always define it.
  const age = Number.isFinite(Number(recap?.age)) ? Number(recap.age) : 0;
  const { headline, biggestMoment, cashEnd, moneyDelta, childStatDeltas, adultStatDeltas, relationshipDeltas, streakYears, shareEligible } = recap;

  const { incomeYou, incomePartner, expenses, focusSpent } = recap;
  
  const fmtMoney = (n) => {
    const num = Number(n || 0);
    const sign = num < 0 ? "-" : "+";
    return `${sign}$${Math.abs(Math.round(num)).toLocaleString()}`;
  };

  const formatStat = (n) => {
    const v = Math.round((Number(n) + Number.EPSILON) * 10) / 10;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-[12000] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md mx-auto rounded-t-2xl bg-white text-slate-900 shadow-xl overflow-hidden max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 pt-3 pb-2 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-slate-500">Year {age} Recap</div>
              <h3 className="text-lg font-bold mt-1 leading-snug break-words">{headline}</h3>
            </div>

            {onQuickBudget && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-7 px-3 text-xs rounded-full border-slate-300 bg-white hover:bg-slate-50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickBudget(); }}
              >
                Quick Budget
              </Button>
            )}
          </div>
        </div>

        <div className="px-4 py-3 text-sm overflow-y-auto">
          {biggestMoment?.title && (
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Biggest Moment</div>
              <div className="mt-0.5 font-medium text-slate-800">{biggestMoment.title}</div>
            </div>
          )}

          <div className="mb-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Finances</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Earned (You):</span>
                <span className="font-semibold text-emerald-700">+${Math.round(Number(incomeYou || 0)).toLocaleString()}</span>
              </div>
              {(incomePartner ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Earned (Partner):</span>
                  <span className="font-semibold text-emerald-700">+${Math.round(Number(incomePartner || 0)).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Spent (Total):</span>
                <span className="font-semibold text-rose-700">-${Math.round(Math.abs(Number(expenses?.total || 0))).toLocaleString()}</span>
              </div>
            </div>
            {expenses?.byCategory && expenses.byCategory.length > 0 && (
              <div className="mt-2 pl-3 space-y-0.5 text-[11px] text-slate-600">
                {expenses.byCategory.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>• {cat.name}:</span>
                    <span>-${Math.round(Math.abs(Number(cat.amount || 0))).toLocaleString()}</span>
                  </div>
                ))}
                {expenses.byCategory.length > 5 && (
                  <div className="text-slate-500">+ {expenses.byCategory.length - 5} more</div>
                )}
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between font-bold">
              <span>Cash Now:</span>
              <span className="text-slate-800">${Math.round(Number(cashEnd || 0)).toLocaleString()}</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${moneyDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              Change this year: {fmtMoney(moneyDelta)}
            </div>
          </div>

          {focusSpent && (focusSpent.total ?? 0) > 0 && (
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Focus Usage</div>
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Focus Spent:</span>
                  <span className="font-semibold text-indigo-700">-{focusSpent.total}</span>
                </div>
                {focusSpent.byAction && focusSpent.byAction.length > 0 && (
                  <div className="pl-3 space-y-0.5 text-[11px] text-slate-600">
                    {focusSpent.byAction.slice(0, 5).map((act, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {act.name}:</span>
                        <span>-{act.amount}</span>
                      </div>
                    ))}
                    {focusSpent.byAction.length > 5 && (
                      <div className="text-slate-500">+ {focusSpent.byAction.length - 5} more</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {childStatDeltas && Object.keys(childStatDeltas).length > 0 && (
            <div className="mb-2">
              <div className="text-xs uppercase tracking-wide text-slate-500">Child Stats</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {Object.entries(childStatDeltas).map(([k,v]) => (
                  <span key={k} className={`px-2 py-1 rounded-full text-xs border ${v>=0?'border-emerald-200 text-emerald-700 bg-emerald-50':'border-rose-200 text-rose-700 bg-rose-50'}`}>
                    {k.slice(0,3).toUpperCase()} {v>=0?'+':''}{formatStat(v)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {adultStatDeltas && Object.keys(adultStatDeltas).length > 0 && (
            <div className="mb-2">
              <div className="text-xs uppercase tracking-wide text-slate-500">Adult Stats</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {Object.entries(adultStatDeltas).map(([k,v]) => {
                  const label = k === 'love' ? 'LOVE' : k === 'stress' ? 'STRESS' : k === 'focus' ? 'FOCUS' : k === 'maxFocus' ? 'MAXFOCUS' : k.toUpperCase();
                  return (
                    <span key={k} className={`px-2 py-1 rounded-full text-xs border ${v>=0?'border-blue-200 text-blue-700 bg-blue-50':'border-rose-200 text-rose-700 bg-rose-50'}`}>
                      {label} {v>=0?'+':''}{formatStat(v)}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {relationshipDeltas && Object.keys(relationshipDeltas).length > 0 && (
            <div className="mb-1">
              <div className="text-xs uppercase tracking-wide text-slate-500">Relationships</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {Object.entries(relationshipDeltas).map(([k,v]) => (
                  <span key={k} className={`px-2 py-1 rounded-full text-xs border ${v>=0?'border-indigo-200 text-indigo-700 bg-indigo-50':'border-indigo-200 text-indigo-700 bg-indigo-50'}`}>
                    {k}: {v>=0?'+':''}{formatStat(v)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {unlockHint && !hideHint && (
            <div className="mt-2 text-[12px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg p-2 flex items-start justify-between gap-2">
              <span>Hint: {unlockHint}</span>
              <button className="text-[11px] underline" onClick={() => setHideHint(true)}>Dismiss</button>
            </div>
          )}

          {recap.cryptoRecap && (
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Urn Market</div>
              <div className="text-xs space-y-1">
                <div className="text-white/90 mb-2">{recap.cryptoRecap.headline}</div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Your bags:</span>
                  <span className="font-semibold">
                    ${Math.round(recap.cryptoRecap.portfolioBefore).toLocaleString()} → ${Math.round(recap.cryptoRecap.portfolioAfter).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Unrealized Δ:</span>
                  <span className={recap.cryptoRecap.delta >= 0 ? "text-emerald-600" : "text-rose-600"}>
                    {recap.cryptoRecap.delta >= 0 ? "+" : ""}${Math.round(Math.abs(recap.cryptoRecap.delta)).toLocaleString()}
                  </span>
                </div>
                {recap.cryptoRecap.changes && recap.cryptoRecap.changes.length > 0 && (
                  <div className="mt-2 space-y-0.5 text-[11px]">
                    {recap.cryptoRecap.changes.map((c) => (
                      <div key={c.id} className="flex justify-between">
                        <span className="text-slate-600">{c.emoji} {c.name}:</span>
                        <span className={c.pct >= 0 ? "text-emerald-600" : "text-rose-600"}>
                          {c.pct >= 0 ? '+' : ''}{c.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 text-[11px] text-slate-500">Streak: {streakYears} years</div>
        </div>

        <div className="sticky bottom-0 px-4 pb-4 pt-2 bg-white border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <Button className="flex-1 h-10" onClick={onClose}>OK</Button>
            <Button variant="outline" className="h-10" onClick={onViewAlbum}>View Album</Button>
            {shareEligible && (
              <Button variant="outline" className="h-10" onClick={onShare}>Share</Button>
            )}
          </div>
          {onHideForever && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onHideForever();
              }}
              className="w-full text-xs text-slate-500 hover:text-slate-700 underline transition-colors"
            >
              Don't show this again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}