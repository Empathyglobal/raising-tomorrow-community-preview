import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameState, formatMoney } from './GameStateContext';

function hazardGradient(hazardKey) {
  const k = String(hazardKey || '').toLowerCase();
  if (k.includes('fire') || k.includes('wildfire') || k.includes('volcano')) return 'from-orange-600 to-red-600';
  if (k.includes('flood') || k.includes('tsunami') || k.includes('hurricane')) return 'from-sky-600 to-blue-700';
  if (k.includes('blizzard')) return 'from-indigo-600 to-slate-700';
  if (k.includes('heat') || k.includes('drought')) return 'from-amber-500 to-orange-600';
  if (k.includes('earthquake') || k.includes('landslide')) return 'from-emerald-600 to-teal-700';
  if (k.includes('tornado') || k.includes('storm')) return 'from-violet-600 to-fuchsia-700';
  return 'from-slate-700 to-slate-900';
}

function pickDeltaBadges(deltas) {
  const d = (deltas && typeof deltas === 'object') ? deltas : {};
  const entries = Object.entries(d)
    .filter(([_, v]) => Number(v) !== 0)
    .sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1])));

  return entries.slice(0, 3).map(([k, v]) => {
    const n = Number(v);
    const sign = n > 0 ? '+' : '';
    const name = k.charAt(0).toUpperCase() + k.slice(1);
    return `${name} ${sign}${n}`;
  });
}

export default function NaturalDisasterModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, applyStress, applyLove, applyDeltas, addLog, recordTimelineEntry } = useGameState();
  const payload = gameState?.naturalDisaster?.pending;

  // B) Prevent body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const handleChoice = (optionId) => {
    const opt = (payload?.options || []).find(o => o.id === optionId);
    if (!opt) return;

    const finalCost = Math.round((payload.baseCost || 0) * (opt.costMult ?? 1));
    const finalStress = Math.round((payload.baseStress || 0) * (opt.stressMult ?? 1));
    const loveDelta = Number(opt.loveDelta || 0);
    const deltas = (opt.deltas && typeof opt.deltas === 'object') ? opt.deltas : null;

    // Clear pending first (prevents double-apply on fast clicks)
    updateState(prev => ({
      ...prev,
      naturalDisaster: { ...(prev.naturalDisaster || {}), pending: null }
    }));

    // Apply effects
    if (finalCost) {
      applyMoneyDelta(-finalCost, `Natural Disaster: ${payload.title}`, {
        category: 'housing',
        ageOverride: payload.year
      });
    }
    if (finalStress) applyStress(finalStress, `Natural disaster: ${payload.title}`);
    if (loveDelta) applyLove(loveDelta, `Natural disaster: ${payload.title}`);
    if (deltas) applyDeltas(deltas, `Natural disaster: ${payload.title}`);

    // Log + timeline
    try { addLog?.(`🌪️ Natural disaster: ${payload.title}`); } catch {}

    const outcomeText = [
      `You chose: ${opt.label}.`,
      `Cost: $${formatMoney(finalCost)} • Stress +${finalStress}${loveDelta ? ` • Love ${loveDelta > 0 ? '+' : ''}${loveDelta}` : ''}`
    ].join('\n\n');

    recordTimelineEntry({
      kind: 'natural_disaster',
      title: payload.title,
      age: payload.year,
      detail: `${payload.description}\n\n${outcomeText}`,
      deltas: deltas,
      moneyDelta: -finalCost,
      loveDelta: loveDelta,
      stressDelta: finalStress,
      meta: {
        hazardKey: payload.hazardKey,
        severity: payload.severity,
        choiceId: optionId,
        countryIso3: payload.countryIso3
      }
    });

    onClose?.();
  };

  // Defensive: never render without valid payload (AFTER hooks)
  if (!open) return null;
  if (!payload) return null;

  const grad = hazardGradient(payload.hazardKey);
  const headerIcon = String(payload.title || '🌪️').split(' ')[0] || '🌪️';

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70"
      />

      {/* Modal - B) Scrollable on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header - stays fixed */}
        <div className={`bg-gradient-to-r ${grad} p-6 text-white flex-shrink-0`}>
          <div className="text-3xl mb-2">{headerIcon}</div>
          <h2 className="text-2xl font-bold mb-1">Natural Disaster</h2>
          <p className="text-white/90 text-sm">
            Year {payload.year} • {payload.severityLabel || 'Severe'}
          </p>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <div className="text-xl font-bold text-slate-800 mb-2">{payload.title}</div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{payload.description}</p>
          </div>

          {/* Impact preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-slate-800 mb-2">Impact Preview</div>
            <div className="space-y-1 text-xs text-slate-700">
              <div>Cost: ${formatMoney(payload.baseCost)}</div>
              <div>Stress: +{payload.baseStress}</div>
              {payload.mitigation?.badges?.length > 0 && (
                <div className="text-emerald-700 font-semibold mt-2">
                  Preparedness bonus: {payload.mitigation.badges.join(', ')}
                </div>
              )}
              <div className="text-slate-600 mt-2">Pick a response below — the right move can turn fear into skills.</div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(payload.options || []).map(opt => {
              const finalCost = Math.round((payload.baseCost || 0) * (opt.costMult ?? 1));
              const finalStress = Math.round((payload.baseStress || 0) * (opt.stressMult ?? 1));
              const badges = pickDeltaBadges(opt.deltas);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all"
                >
                  <div className="font-semibold text-slate-800 mb-1">{opt.label}</div>
                  {opt.note && <div className="text-xs text-slate-600 mb-2">{opt.note}</div>}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Cost: ${formatMoney(finalCost)}</div>
                    <div>Stress: +{finalStress}{opt.loveDelta ? ` • Love ${Number(opt.loveDelta) > 0 ? '+' : ''}${opt.loveDelta}` : ''}</div>
                    {badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {badges.map((b, i) => (
                          <span key={i} className="px-2 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-700">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}