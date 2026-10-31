import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, combineDeltas } from './GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { Button } from '@/components/ui/button';

export default function RoutinePickerModal({ open, onClose }) {
  const { gameState, addLog, applyDeltas, applyLove, applyStress, consumeAction, updateState, applyTechniqueBonusesForAction, recordTimelineEntry, emitActionResult } = useGameState();

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

  const performRoutine = (routineType) => {
    // Check focus
    if (!consumeAction('routine')) return;

    // Get counter and increment it
    const counterKey = `routine_${routineType}`;
    const prevCount = Number(gameState.counters?.[counterKey] || 0);
    const newCount = prevCount + 1;

    // Mastery scaling: min(1, 0.1 * 2^(count-1))
    const mastery = Math.min(1, 0.1 * Math.pow(2, newCount - 1));

    // Base deltas
    const baseDeltas = { discipline: 1, intelligence: 1, empathy: -1, confidence: 0 };

    // Flavor bonuses based on routine type
    const flavorBonus = {
      bedtime: { empathy: 0.2 },
      morning: { confidence: 0.2 },
      homework: { intelligence: 0.2 }
    };

    // Apply technique bonuses
    const bonusDeltas = applyTechniqueBonusesForAction('routine');

    // Combine base + technique bonuses + flavor
    let combined = combineDeltas(baseDeltas, bonusDeltas);
    combined = combineDeltas(combined, flavorBonus[routineType] || {});

    // Apply base deltas (discipline, intelligence, empathy, confidence)
    applyDeltas(combined, `Routine: ${routineType}`);

    // Mastery adjustments to love and stress
    const loveDeltaFinal = -1 + (mastery * 0.8); // caps at -0.2
    const stressDeltaFinal = 1 - (mastery * 1.0); // caps at 0
    const disciplineMastery = mastery * 0.5; // up to +0.5

    // Apply mastery adjustments
    applyLove(loveDeltaFinal, `Routine: ${routineType} (mastery)`);
    applyStress(stressDeltaFinal, `Routine: ${routineType} (mastery)`);
    applyDeltas({ discipline: disciplineMastery }, `Routine: ${routineType} mastery bonus`);

    // Update counter
    updateState(prev => ({
      counters: {
        ...(prev.counters || {}),
        [counterKey]: newCount
      }
    }));

    // Log
    const routineLabel = routineType === 'bedtime' ? 'Bedtime Routine' : routineType === 'morning' ? 'Morning Routine' : 'Homework Routine';
    addLog(`You practice ${routineLabel.toLowerCase()}. Count: ${newCount}. Mastery: ${(mastery * 100).toFixed(0)}%.`);

    // Check for "Routine Autopilot" unlock (any counter >= 5)
    const bedtimeCount = gameState.counters?.routine_bedtime || 0;
    const morningCount = gameState.counters?.routine_morning || 0;
    const homeworkCount = gameState.counters?.routine_homework || 0;
    const maxCount = Math.max(bedtimeCount, morningCount, homeworkCount, newCount); // include new count

    if (maxCount >= 5) {
      updateState(prev => ({
        routineAutopilotUnlocked: true
      }));
    }

    // Check for "Routine Wizard" trophy (any counter >= 10)
    if (maxCount >= 10) {
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked?.routine_wizard) {
        updateState(prev => ({
          trophies: {
            unlocked: {
              ...(prev.trophies?.unlocked || {}),
              routine_wizard: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: 'Mastered routines until they run on autopilot'
              }
            }
          }
        }));
        addLog('🏆 Trophy unlocked: Routine Wizard');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Routine Wizard',
          detail: 'Mastered routines until they run on autopilot.'
        });
      }
    }

    // Timeline entry
    recordTimelineEntry({
      kind: 'routine',
      title: `🛏️ ${routineLabel}`,
      detail: `Mastery: ${(mastery * 100).toFixed(0)}%. Structure counts.`,
      deltas: combined,
      moneyDelta: 0,
      loveDelta: loveDeltaFinal,
      stressDelta: stressDeltaFinal
    });

    // Action result
    const popup = pickMissingActionPopup('routine', routineType);
    if (popup) {
      emitActionResult({
        actionId: 'routine',
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || 'your kid' }),
        deltas: combined,
        moneyDelta: 0,
        focusDelta: -1,
        loveDelta: loveDeltaFinal,
        stressDelta: stressDeltaFinal,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    onClose();
  };

  const performAutopilot = () => {
    const usedThisAge = gameState.yearFlags?.routineAutopilotUsedThisAge === gameState.currentYear;
    if (usedThisAge) {
      addLog('⚡ Routine Autopilot already used this age.');
      return;
    }

    if (!consumeAction('routine')) return;

    // Autopilot: same base deltas, NO love penalty, stress -0.5
    const baseDeltas = { discipline: 1, intelligence: 1, empathy: -1, confidence: 0 };
    const bonusDeltas = applyTechniqueBonusesForAction('routine');
    const combined = combineDeltas(baseDeltas, bonusDeltas);

    applyDeltas(combined, 'Routine Autopilot');
    applyStress(-0.5, 'Routine Autopilot');

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), routineAutopilotUsedThisAge: prev.currentYear }
    }));

    addLog('⚡ Routines run on autopilot. Everything flows.');

    recordTimelineEntry({
      kind: 'routine',
      title: '⚡ Routine Autopilot',
      detail: 'Routines run on autopilot. Everything flows.',
      deltas: combined,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -0.5
    });

    emitActionResult({
      actionId: 'routine',
      title: '⚡ Routine Autopilot',
      body: 'Your routines have become so embedded they run on their own.\n\nStress -0.5\nChild: DISCIPLINE +1 • INTELLIGENCE +1 • EMPATHY -1',
      deltas: combined,
      moneyDelta: 0,
      focusDelta: -1,
      loveDelta: 0,
      stressDelta: -0.5,
      tags: ['routine', 'autopilot'],
      meta: { emoji: '⚡' }
    });

    onClose();
  };

  const bedtimeCount = gameState.counters?.routine_bedtime || 0;
  const morningCount = gameState.counters?.routine_morning || 0;
  const homeworkCount = gameState.counters?.routine_homework || 0;
  const autopilotUnlocked = gameState.routineAutopilotUnlocked || Math.max(bedtimeCount, morningCount, homeworkCount) >= 5;
  const autopilotUsedThisAge = gameState.yearFlags?.routineAutopilotUsedThisAge === gameState.currentYear;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🛏️ Choose a Routine</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Build mastery through repetition</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-3">
                {/* Bedtime Routine */}
                <button
                  onClick={() => performRoutine('bedtime')}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🛏️</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 mb-1">Bedtime Routine</div>
                      <div className="text-xs text-slate-600 mb-1">
                        DISCIPLINE +1 • INT +1 • EMP -1 • LOVE -0.2 to +0.8 • STRESS +0 to +1
                      </div>
                      <div className="text-xs text-slate-500">
                        Count: {bedtimeCount} • Flavor: +0.2 EMP
                      </div>
                    </div>
                  </div>
                </button>

                {/* Morning Routine */}
                <button
                  onClick={() => performRoutine('morning')}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌅</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 mb-1">Morning Routine</div>
                      <div className="text-xs text-slate-600 mb-1">
                        DISCIPLINE +1 • INT +1 • EMP -1 • LOVE -0.2 to +0.8 • STRESS +0 to +1
                      </div>
                      <div className="text-xs text-slate-500">
                        Count: {morningCount} • Flavor: +0.2 CON
                      </div>
                    </div>
                  </div>
                </button>

                {/* Homework Routine */}
                <button
                  onClick={() => performRoutine('homework')}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-green-400 hover:bg-green-50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📚</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 mb-1">Homework Routine</div>
                      <div className="text-xs text-slate-600 mb-1">
                        DISCIPLINE +1 • INT +1 • EMP -1 • LOVE -0.2 to +0.8 • STRESS +0 to +1
                      </div>
                      <div className="text-xs text-slate-500">
                        Count: {homeworkCount} • Flavor: +0.2 INT
                      </div>
                    </div>
                  </div>
                </button>

                {/* Autopilot (if unlocked) */}
                {autopilotUnlocked && (
                  <button
                    onClick={performAutopilot}
                    disabled={autopilotUsedThisAge}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      autopilotUsedThisAge
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 mb-1">
                          ⚡ Routine Autopilot (Unlocked)
                        </div>
                        <div className="text-xs text-slate-600 mb-1">
                          STRESS -0.5 • Once per age
                        </div>
                        <div className="text-xs text-slate-600">
                          Child: DISCIPLINE +1 • INT +1 • EMP -1
                        </div>
                        {autopilotUsedThisAge && (
                          <div className="text-xs text-purple-700 mt-1 font-semibold">Used this age</div>
                        )}
                      </div>
                    </div>
                  </button>
                )}

                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}