import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';
import { PATTERN_INSIGHTS } from './patternInsights';
import {
  TRAUMA_REHAB_FOCUS_COST,
  TRAUMA_REHAB_METHODS,
  PRESSURE_ICONS,
  PRESSURE_LABELS
} from './traumaRehabCatalog';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const pressureSum = (pressures) => {
  const p = pressures || {};
  return (p.threat || 0) + (p.shame || 0) + (p.chaos || 0) + (p.role || 0);
};

const computeFitNorm = (methodFit, pressures) => {
  const p = pressures || {};
  const f = methodFit || {};
  const sum = pressureSum(p);
  if (sum <= 0) return 0.5;

  const dot =
    (p.threat || 0) * (f.threat || 0) +
    (p.shame || 0) * (f.shame || 0) +
    (p.chaos || 0) * (f.chaos || 0) +
    (p.role || 0) * (f.role || 0);

  // Normalize by the maximum weight (3) and the target's pressure sum.
  return clamp(dot / (sum * 3), 0, 1);
};

const computeChance = ({ method, patternPressures, severity }) => {
  const base = Number(method?.baseChance ?? 0.25);
  const fitNorm = computeFitNorm(method?.fit, patternPressures);

  // Fit bonus/penalty: centered around ~0.45 (neutral), scaled gently.
  const fitBonus = (fitNorm - 0.45) * 0.25; // ~[-0.11, +0.14]

  // Higher intensity is harder to shift.
  const sev = Number(severity ?? 0);
  const severityPenalty = Math.max(0, (sev - 1)) * 0.04;

  const minChance = Number(method?.minChance ?? 0.08);
  const maxChance = Number(method?.maxChance ?? 0.75);

  return clamp(base + fitBonus - severityPenalty, minChance, maxChance);
};

const fitLabel = (fitNorm) => {
  if (fitNorm >= 0.7) return { text: 'Great fit', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (fitNorm >= 0.55) return { text: 'Good fit', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (fitNorm >= 0.4) return { text: 'Okay fit', tone: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { text: 'Low fit', tone: 'bg-slate-50 text-slate-600 border-slate-200' };
};

const pickOne = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

const pressureBadges = (pressures) => {
  const p = pressures || {};
  const entries = [
    ['threat', p.threat || 0],
    ['shame', p.shame || 0],
    ['chaos', p.chaos || 0],
    ['role', p.role || 0]
  ].filter(([, v]) => v > 0);

  return entries;
};

export default function TraumaRehabModal({ open, onClose, isFree = false, onConsumeDiamonds = null }) {
  const {
    gameState,
    spendFocus,
    applyMoneyDelta,
    applyStress,
    applyLove,
    updateState,
    emitActionResult,
    getAvailability,
    getLocalAmount
  } = useGameState();

  const { familyPatterns, currentYear } = gameState;

  const selectedIds = familyPatterns?.selectedIds || [];
  const severityById = familyPatterns?.severityById || {};
  const resolvedById = familyPatterns?.resolvedById || {};
  const resolvedAtAgeById = familyPatterns?.resolvedAtAgeById || {};
  const rehabByAge = familyPatterns?.rehabByAge || {};

  const alreadyUsedThisYear = Boolean(rehabByAge?.[currentYear]?.used);

  const activePatterns = useMemo(() => {
    return selectedIds
      .filter(id => (severityById[id] || 0) > 0 && !resolvedById[id])
      .map(id => {
        const entry = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
        return {
          id,
          ...entry,
          severity: severityById[id] || 0
        };
      });
  }, [selectedIds, severityById, resolvedById]);

  const [selectedPatternId, setSelectedPatternId] = useState(null);

  // Default selection when opened
  React.useEffect(() => {
    if (open) {
      setSelectedPatternId(activePatterns[0]?.id || null);
    }
  }, [open, activePatterns]);

  // Block body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const rehabAvail = getAvailability('traumaRehab');
  const globallyDisabled = !isFree && (alreadyUsedThisYear || !rehabAvail.enabled);

  const selectedPattern = activePatterns.find(p => p.id === selectedPatternId) || null;
  const selectedSeverity = selectedPattern ? (severityById[selectedPattern.id] || 0) : 0;

  const handleMethod = (method) => {
    if (!selectedPattern) return;
    if (globallyDisabled) return;

    let chance = 0;
    let chancePct = 0;
    let localCost = 0;
    let success = false;
    let stressDelta = 0;
    let loveDelta = 0;

    if (isFree) {
      // Charge diamonds only when method is actually chosen
      if (typeof onConsumeDiamonds === 'function') {
        const ok = onConsumeDiamonds();
        if (!ok) return; // not enough or user canceled
      }
      chance = 1;
      chancePct = 100;
      localCost = 0;
      success = true;
      stressDelta = -5; // Relief
      loveDelta = 2; // Healing
    } else {
      chance = computeChance({
        method,
        patternPressures: selectedPattern.pressures,
        severity: selectedSeverity
      });
      chancePct = Math.round(chance * 100);

      const ok = spendFocus(TRAUMA_REHAB_FOCUS_COST, 'Trauma Rehab');
      if (!ok) return;

      localCost = getLocalAmount(method.cost);
      applyMoneyDelta(-localCost, 'Trauma Rehab', { allowCreditMessage: true });

      const roll = Math.random();
      success = roll < chance;

      // Apply emotional cost/benefit
      stressDelta = success ? (method.effects?.stressSuccess ?? 0) : (method.effects?.stressFail ?? 0);
      loveDelta = success ? (method.effects?.loveSuccess ?? 0) : (method.effects?.loveFail ?? 0);
    }

    if (stressDelta) applyStress(stressDelta, 'Trauma Rehab');
    if (loveDelta) applyLove(loveDelta, 'Trauma Rehab');

    // Update pattern severity/resolution
    const currentSeverity = severityById[selectedPattern.id] || 0;
    
    // In free/God Mode, we resolve it instantly regardless of severity
    const newSeverity = isFree ? 0 : Math.max(0, currentSeverity - (success ? 1 : 0));
    const nowResolved = success && newSeverity === 0;

    const newSeverityById = { ...severityById, [selectedPattern.id]: newSeverity };
    const newResolvedById = { ...resolvedById };
    const newResolvedAtAgeById = { ...resolvedAtAgeById };

    if (nowResolved) {
      newResolvedById[selectedPattern.id] = true;
      newResolvedAtAgeById[selectedPattern.id] = currentYear;
    }

    // Only record 'usage' if not free (to not block regular usage if we want)
    // Or maybe we record it anyway. Let's record it.
    const newRehabByAge = {
      ...rehabByAge,
      [currentYear]: {
        used: true,
        workedOnId: selectedPattern.id,
        methodId: method.id,
        success
      }
    };

    updateState({
      familyPatterns: {
        ...familyPatterns,
        severityById: newSeverityById,
        resolvedById: newResolvedById,
        resolvedAtAgeById: newResolvedAtAgeById,
        rehabByAge: newRehabByAge
      }
    });

    const insight = pickOne(PATTERN_INSIGHTS?.[selectedPattern.id]) ||
      "Healing isn't linear. Showing up still matters.";

    const flavorLine = success
      ? (isFree ? "A miracle happens. The weight lifts instantly." : pickOne(method.flavor?.success))
      : pickOne(method.flavor?.fail);

    const progressLine = success
      ? (nowResolved
          ? 'Resolved ✅'
          : `Intensity eased: ${currentSeverity} → ${newSeverity}.`)
      : `No intensity change (still ${currentSeverity}).`;

    const outcomeLine = success
      ? 'Breakthrough — some weight shifted.'
      : 'No breakthrough today — still, you learned something.';

    const body =
      `Target: ${selectedPattern.label}. ` +
      `Method: ${method.name}. ` +
      `Success chance: ${chancePct}%. ` +
      `${outcomeLine} ${progressLine} ` +
      `${flavorLine ? flavorLine + ' ' : ''}` +
      `Insight: ${insight}`;

    emitActionResult({
      actionId: 'doctor',
      title: isFree ? `✨ God Mode Rehab — ${method.name}` : `Trauma Rehab — ${method.name}`,
      body,
      deltas: null,
      loveDelta,
      stressDelta,
      moneyDelta: -localCost,
      focusDelta: isFree ? 0 : -TRAUMA_REHAB_FOCUS_COST,
      tags: ['rehab', 'care'],
      meta: {
        emoji: method.emoji,
        methodId: method.id,
        patternId: selectedPattern.id,
        nowResolved,
        success,
        chancePct
      }
    });

    onClose();
  };

  const renderIntensityDots = (severity) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map(level => (
          <div
            key={level}
            className={`w-2 h-2 rounded-full ${
              level <= severity ? 'bg-amber-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const bestForList = (fit) => {
    const entries = Object.entries(fit || {})
      .filter(([, v]) => v > 0)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, 2)
      .map(([k]) => k);
    return entries;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[112]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[113] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isFree ? 'bg-gradient-to-r from-amber-100 to-yellow-50 border-amber-200' : 'border-slate-200'}`}>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{isFree ? '✨ God Mode Rehab' : '🏥 Trauma Rehab'}</h3>
                  <p className="text-sm text-slate-500">
                    {isFree ? 'Miraculously heal a wound. Instant. Free.' : 'Choose a pattern to target. Pick a method. Results vary.'}
                  </p>
                  {!isFree && <p className="text-xs text-slate-400 mt-0.5">Not medical advice.</p>}
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {!isFree && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold">Heads up:</span> Counselor sessions are the only guaranteed progress.
                      Rehab is a faster-but-uncertain gamble.
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Cost: varies • Focus: {TRAUMA_REHAB_FOCUS_COST} • Limit: once per year
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {activePatterns.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-2">🧬</div>
                    <p className="text-slate-700 font-semibold">No active patterns to work on.</p>
                    <p className="text-sm text-slate-500 mt-1">
                      If you selected patterns, they may already be resolved.
                    </p>
                  </div>
                )}

                {activePatterns.length > 0 && (
                  <>
                    {/* Pattern picker */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        1) Choose a pattern
                      </h4>
                      <div className="space-y-2">
                        {activePatterns.map(pattern => {
                          const isSelected = pattern.id === selectedPatternId;
                          const pBadges = pressureBadges(pattern.pressures);
                          return (
                            <button
                              key={pattern.id}
                              onClick={() => setSelectedPatternId(pattern.id)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'border-indigo-400 bg-indigo-50'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-slate-800 mb-1">{pattern.label}</div>
                                  <div className="text-xs text-slate-600 mb-2">{pattern.short}</div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Intensity:</span>
                                    {renderIntensityDots(pattern.severity)}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {pBadges.length > 0 && (
                                    <div className="flex flex-wrap gap-1 justify-end">
                                      {pBadges.map(([k, v]) => (
                                        <span
                                          key={k}
                                          className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-full"
                                          title={PRESSURE_LABELS[k]}
                                        >
                                          {PRESSURE_ICONS[k]} {v}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Method list */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        2) Choose a method
                      </h4>

                      {/* Disabled reason */}
                      {globallyDisabled && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                          <div className="text-sm text-amber-900 font-semibold">Unavailable right now</div>
                          <div className="text-xs text-amber-800 mt-1">
                            {alreadyUsedThisYear
                              ? 'Already did Trauma Rehab this year.'
                              : (rehabAvail.reasonText || 'Not available.')}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {isFree ? (
                          <button
                            onClick={() => handleMethod({
                              id: 'god_mode_healing',
                              name: 'Divine Healing',
                              emoji: '✨',
                              subtitle: 'Instant removal. Zero cost.',
                              cost: 0,
                              effects: { stressSuccess: -5, loveSuccess: 2 },
                              flavor: { success: ["A weight lifts instantly."] }
                            })}
                            className="w-full text-left p-4 rounded-xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400 transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-3xl flex-shrink-0">✨</div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800">Instant Removal</div>
                                <div className="text-xs text-slate-600">Miraculously clear this pattern.</div>
                              </div>
                              <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                Free
                              </div>
                            </div>
                          </button>
                        ) : (
                          TRAUMA_REHAB_METHODS.map(method => {
                            const fitNorm = selectedPattern
                              ? computeFitNorm(method.fit, selectedPattern.pressures)
                              : 0.45;
                            const chance = selectedPattern
                              ? computeChance({ method, patternPressures: selectedPattern.pressures, severity: selectedSeverity })
                              : method.baseChance;
                            const chancePct = Math.round(chance * 100);
                            const fit = fitLabel(fitNorm);
                            const bestFor = bestForList(method.fit);

                            const disabled = globallyDisabled || !selectedPattern;

                            return (
                              <button
                                key={method.id}
                                onClick={() => !disabled && handleMethod(method)}
                                disabled={disabled}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                  disabled
                                    ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <div className="text-3xl flex-shrink-0">{method.emoji}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="font-semibold text-slate-800">{method.name}</div>
                                        <div className="text-xs text-slate-600 mt-0.5">{method.subtitle}</div>
                                      </div>
                                      <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full border ${fit.tone} flex-shrink-0`}
                                        title="How well this method matches the pattern profile"
                                      >
                                        {fit.text}
                                      </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                        ${formatMoney(getLocalAmount(method.cost))}
                                      </span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                                        Focus {TRAUMA_REHAB_FOCUS_COST}
                                      </span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        Success {chancePct}%
                                      </span>
                                    </div>

                                    {bestFor.length > 0 && (
                                      <div className="text-[11px] text-slate-500 mt-2">
                                        Best for:{' '}
                                        {bestFor.map((k, idx) => (
                                          <span key={k}>
                                            {idx > 0 ? ' · ' : ''}
                                            {PRESSURE_ICONS[k]} {PRESSURE_LABELS[k]}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}