import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useGameState, COMMITMENT_DEFS, formatMoney } from '@/components/game/GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';

export default function CommitmentsModal({ open, onClose }) {
  const { gameState, updateState, getLocalAmount, emitActionResult } = useGameState();
  const { commitments = {}, money } = gameState;

  const handleToggle = (commitmentId) => {
    const nextState = !commitments[commitmentId];
    
    updateState({
      commitments: {
        ...commitments,
        [commitmentId]: nextState
      }
    });

    const subId = `${commitmentId}_${nextState ? 'on' : 'off'}`;
    const popup = pickMissingActionPopup("commitments", subId);
    if (popup) {
      emitActionResult({
        actionId: "commitments",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }
  };

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

  const commitmentsList = [
    COMMITMENT_DEFS.afterSchoolCare,
    COMMITMENT_DEFS.cleaningHelp,
    COMMITMENT_DEFS.mealKits
  ];

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
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0 bg-white sticky top-0 z-10">
                <h3 className="text-xl font-bold text-slate-800">🧾 Commitments</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-600">
                  <p className="mb-2">Annual subscriptions that renew each year automatically.</p>
                  <p>Toggle on/off anytime — changes apply starting next age.</p>
                </div>

                <div className="space-y-4">
                  {commitmentsList.map((commitment) => {
                    const isActive = commitments[commitment.id];
                    
                    return (
                      <div
                        key={commitment.id}
                        className={`border-2 rounded-xl p-4 transition-all ${
                          isActive 
                            ? 'border-emerald-300 bg-emerald-50/50' 
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{commitment.emoji}</span>
                              <h4 className="font-semibold text-slate-800">{commitment.label}</h4>
                            </div>
                            <div className="text-sm text-slate-600 mb-2">
                              ${formatMoney(getLocalAmount(commitment.cost))}/year
                            </div>
                            <div className="text-xs text-slate-500">
                              {commitment.detail}
                            </div>
                          </div>
                          <Switch
                            checked={isActive}
                            onCheckedChange={() => handleToggle(commitment.id)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 bg-amber-50 rounded-lg p-4 text-xs text-amber-800">
                  <div className="font-semibold mb-1">Money management:</div>
                  <p>
                    Commitments charge yearly even if money goes negative.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}