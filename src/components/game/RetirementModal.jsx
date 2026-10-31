import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

export default function RetirementModal({ open, onClose }) {
  const { gameState, updateState, spendMoney, applyStress, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const { retirementSavings, money, pendingScenario, finished } = gameState;

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

  const canUse = !pendingScenario && !finished;

  const handleSave = (amount) => {
    spendMoney(amount);
    const newMoney = money - amount;
    const newRetirementSavings = retirementSavings + amount;
    
    updateState({ retirementSavings: newRetirementSavings });
    
    const stressDelta = newMoney < 0 ? 1 : 0;
    if (stressDelta > 0) {
      applyStress(1, "Retirement Savings");
    }

    emitActionResult({
      actionId: 'retirement',
      deltas: {},
      loveDelta: 0,
      stressDelta: stressDelta,
      moneyDelta: -amount,
      focusDelta: 0,
      tags: ['finance', 'retirement'],
      meta: { emoji: '🏦', amount }
    });

    onClose();
  };

  const savingOptions = [
    { amount: 250, label: "$250" },
    { amount: 500, label: "$500" },
    { amount: 1000, label: "$1,000" },
    { amount: 2000, label: "$2,000" }
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
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">🏦 Savings</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Balance Display */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border-2 border-green-200">
                  <div className="text-sm text-slate-600 mb-1">Savings Balance</div>
                  <div className="text-3xl font-bold text-green-700">${formatMoney(retirementSavings)}</div>
                  <div className="text-xs text-slate-500 mt-2">Savings for University or my Retirement.</div>
                </div>

                {/* Current Money Display */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-slate-600">Current Disposable Money</div>
                  <div className="text-xl font-bold text-slate-800">${formatMoney(money)}</div>
                </div>

                {/* Saving Options */}
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">
                    Choose an amount to save. Your disposable money will decrease, but your savings will grow.
                  </p>
                  {savingOptions.map((option) => (
                    <button
                      key={option.amount}
                      onClick={() => handleSave(option.amount)}
                      disabled={!canUse}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Save {option.label}
                    </button>
                  ))}
                </div>

                {money < 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      ⚠️ Saving while in debt will increase stress by +1
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}