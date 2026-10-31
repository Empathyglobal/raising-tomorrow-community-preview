import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, combineDeltas, formatMoney } from './GameStateContext';
import { SELF_CARE_SERVICES } from './salonSpaData';

import { appendHumor } from './humorUtils';

export default function SalonSpaModal({ open, onClose }) {
  const { gameState, applyDeltas, applyLove, applyStress, applyMoneyDelta, addLog, recordTimelineEntry, spendFocus, applyPeerCircle, applyTeacherTrust, updateState, emitActionResult, getLocalAmount } = useGameState();
  const { actionPoints, currentYear, stress } = gameState;

  const services = React.useMemo(() => {
    return [...SELF_CARE_SERVICES].sort((a, b) => {
      const aAge = Number(a?.minAge || 0);
      const bAge = Number(b?.minAge || 0);
      if (aAge !== bAge) return aAge - bAge;
      return Number(a?.cost || 0) - Number(b?.cost || 0);
    });
  }, []);

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

  const handleService = (service) => {
    const ok = spendFocus(1, `Self-Care: ${service.title}`);
    if (!ok) return;

    const baseCost = Number(service.cost || 0);
    const cost = getLocalAmount(baseCost);
    if (cost !== 0) {
      applyMoneyDelta(-cost, `Self-Care: ${service.title}`, { allowCreditMessage: true });
    }

    // Apply base effects
    const baseEffects = service.effects || {};
    const baseStatDeltas = baseEffects.deltas || {};
    const baseLoveDelta = Number(baseEffects.loveDelta || 0);
    const baseStressDelta = Number(baseEffects.stressDelta || 0);
    const basePeerCircleDelta = Number(baseEffects.peerCircleDelta || 0);
    const baseTeacherTrustDelta = Number(baseEffects.teacherTrustDelta || 0);

    // Roll for outcome
    const outcomes = service.outcomes || [];
    let selectedOutcome = null;
    if (outcomes.length > 0) {
      const totalWeight = outcomes.reduce((sum, o) => sum + Number(o.weight || 0), 0);
      let roll = Math.random() * totalWeight;
      for (const outcome of outcomes) {
        roll -= Number(outcome.weight || 0);
        if (roll <= 0) {
          selectedOutcome = outcome;
          break;
        }
      }
      if (!selectedOutcome) {
        selectedOutcome = outcomes[outcomes.length - 1];
      }
    }

    // Combine base effects with outcome effects
    const outcomeEffects = selectedOutcome?.effects || {};
    const outcomeStatDeltas = outcomeEffects.deltas || {};
    const outcomeLoveDelta = Number(outcomeEffects.loveDelta || 0);
    const outcomeStressDelta = Number(outcomeEffects.stressDelta || 0);
    const outcomePeerCircleDelta = Number(outcomeEffects.peerCircleDelta || 0);
    const outcomeTeacherTrustDelta = Number(outcomeEffects.teacherTrustDelta || 0);

    const statDeltas = combineDeltas(baseStatDeltas, outcomeStatDeltas);
    const loveDelta = baseLoveDelta + outcomeLoveDelta;
    const stressDelta = baseStressDelta + outcomeStressDelta;
    const peerCircleDelta = basePeerCircleDelta + outcomePeerCircleDelta;
    const teacherTrustDelta = baseTeacherTrustDelta + outcomeTeacherTrustDelta;

    // Apply effects
    const hasStatDelta = Object.values(statDeltas).some(v => v !== 0);
    if (hasStatDelta) applyDeltas(statDeltas, `Self-Care: ${service.title}`);
    if (loveDelta) applyLove(loveDelta, `Self-Care: ${service.title}`);
    if (stressDelta) applyStress(stressDelta, `Self-Care: ${service.title}`);
    if (peerCircleDelta) applyPeerCircle(peerCircleDelta, `Self-Care: ${service.title}`);
    if (teacherTrustDelta) applyTeacherTrust(teacherTrustDelta, `Self-Care: ${service.title}`);

    // Log
    const logParts = [`🫧 ${service.title}`, selectedOutcome?.text || service.subtitle];
    addLog(logParts.join(' • '));

    // Timeline entry
    recordTimelineEntry({
      kind: 'care',
      title: `🫧 Self-Care: ${service.title}`,
      detail: selectedOutcome?.text || service.subtitle,
      deltas: hasStatDelta ? statDeltas : null,
      moneyDelta: cost ? -cost : 0,
      loveDelta,
      stressDelta,
      meta: {
        serviceId: service.id,
        outcomeId: selectedOutcome?.id || null,
        negative: selectedOutcome?.tag === 'negative'
      }
    });

    // Format deltas for display
    const displayDeltas = { ...statDeltas };

    const baseBody = selectedOutcome?.text || 'You take the time. It helps.';
    const body = appendHumor(baseBody, 'salonSpa', { serviceTitle: service.title });

    emitActionResult({
      actionId: 'salonSpa',
      title: `Self-Care: ${service.title}`,
      body,
      deltas: displayDeltas,
      loveDelta,
      stressDelta,
      moneyDelta: cost ? -cost : 0,
      focusDelta: -1,
      tags: ['care', 'selfcare'],
      meta: {
        emoji: service.emoji || '💇',
        serviceId: service.id,
        outcomeId: selectedOutcome?.id || null
      }
    });

    onClose();
  };

  const canUse = (actionPoints ?? 0) >= 1;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Self-Care</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Small resets, big feelings. (Uses 1 Focus.)
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                <div className="space-y-3">
                  {services.map((service) => {
                    const lockedByAge = currentYear < Number(service.minAge || 0);
                    const disabled = !canUse || lockedByAge;
                    
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleService(service)}
                        disabled={disabled}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          disabled
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl flex-shrink-0">{service.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 mb-1 text-base">
                              {service.title}
                              {lockedByAge && (
                                <span className="ml-2 text-xs text-slate-400">(Age {service.minAge}+)</span>
                              )}
                            </div>
                            <div className="text-sm text-slate-600 leading-relaxed mb-2">
                              {service.subtitle}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              {service.cost > 0 && (
                                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                  Cost: ${formatMoney(getLocalAmount(service.cost))}
                                </div>
                              )}
                              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                                Focus: 1
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}