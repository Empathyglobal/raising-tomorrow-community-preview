import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X, ChevronRight } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';

export default function ScenarioPackYearlyCheckinsModal({ open, checkins, onComplete }) {
  const { gameState, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry, applyMoneyDelta, updateState } = useGameState();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!checkins || checkins.length === 0) return null;

  const current = checkins[currentIndex];
  const isLast = currentIndex >= checkins.length - 1;
  const progress = ((currentIndex + 1) / checkins.length) * 100;

  const handleChoice = (choice) => {
    if (choice.id === 'skip') {
      // Skip - no effects
      proceedNext();
      return;
    }

    // Apply effects
    if (typeof choice.apply === 'function') {
      const ctx = { gameState, applyDeltas, applyLove, applyStress, applyMoneyDelta, updateState, addLog, recordTimelineEntry };
      choice.apply(ctx);
      proceedNext();
      return;
    }

    if (choice.deltas && Object.values(choice.deltas).some(v => v !== 0)) {
      applyDeltas(choice.deltas, `Pack check-in: ${current.packName}`);
    }
    if (choice.loveDelta && choice.loveDelta !== 0) {
      applyLove(choice.loveDelta, `Pack check-in: ${current.packName}`);
    }
    if (choice.stressDelta && choice.stressDelta !== 0) {
      applyStress(choice.stressDelta, `Pack check-in: ${current.packName}`);
    }
    if (choice.moneyDelta) {
      applyMoneyDelta(choice.moneyDelta);
    }
    if (choice.statePatch) {
      updateState(choice.statePatch);
    }

    // Honor unlocks (secondary honors)
    if (choice.awardHonor) {
      const honorId = String(choice.awardHonor);
      updateState(prev => {
        const t = prev.titles || {};
        const honors = Array.isArray(t.secondaryHonors) ? t.secondaryHonors : [];
        if (honors.includes(honorId)) return prev;
        return { ...prev, titles: { ...t, secondaryHonors: [...honors, honorId] } };
      });
      try { toast.success(`Honor unlocked: ${choice.awardHonor}`, { icon: '🏅' }); } catch {}
      recordTimelineEntry({ kind: 'system', title: '🏅 Honor Unlocked', detail: String(choice.awardHonor), deltas: null, moneyDelta: 0 });
    }

    // Log if logLine exists or fallback
    const logText = choice.logLine || "A small but meaningful moment passed this year.";
    if (choice.logLine) addLog(choice.logLine);
      
    // Always add timeline entry
    recordTimelineEntry({
      kind: "scenario_checkin",
      title: `${current.emoji} ${current.packName} check-in`,
      detail: logText,
      deltas: choice.deltas || null,
      moneyDelta: choice.moneyDelta || 0,
      loveDelta: choice.loveDelta || 0,
      stressDelta: choice.stressDelta || 0,
      meta: { packId: current.packId, choiceId: choice.id }
    });

    proceedNext();
  };

  const proceedNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSkipAll = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[105]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed inset-0 z-[106] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Header */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
                      Yearly Check-In ({currentIndex + 1}/{checkins.length})
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-2xl">{current.emoji}</span>
                      {current.packName}
                    </h3>
                  </div>
                  <button
                    onClick={handleSkipAll}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="font-semibold text-slate-800 mb-2">{current.title}</div>
                  <div className="text-sm text-slate-700 leading-relaxed">{current.body}</div>
                </div>

                <div className="text-xs text-slate-500">
                  Optional flavor—choose your approach or skip.
                </div>
              </div>

              {/* Choices */}
              <div className="px-6 pb-6 space-y-2">
                {current.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    variant={choice.id === 'skip' ? 'outline' : 'default'}
                    className={`w-full h-12 justify-between ${
                      choice.id === 'practice' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' 
                        : choice.id === 'simple'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : ''
                    }`}
                  >
                    <span>{choice.label}</span>
                    {choice.id !== 'skip' && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                ))}
              </div>

              {/* Skip All */}
              {checkins.length > 1 && (
                <div className="px-6 pb-4">
                  <button
                    onClick={handleSkipAll}
                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                  >
                    Skip all check-ins for this year
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}