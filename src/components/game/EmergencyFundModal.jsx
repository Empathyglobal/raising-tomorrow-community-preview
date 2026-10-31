import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney } from "@/components/game/GameStateContext.jsx";

export default function EmergencyFundModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, addLog, recordTimelineEntry } = useGameState();
  const { emergencyFund, money } = gameState;

  const handleDeposit = (amount) => {
    updateState({ emergencyFund: emergencyFund + amount });
    applyMoneyDelta(-amount, "Emergency Fund deposit", { allowCreditMessage: true });
    addLog(`🧯 You deposited $${amount} into your Emergency Fund.`);
    
    recordTimelineEntry({
      kind: "system",
      title: "🧯 Emergency Fund deposit",
      detail: `+$${amount}`,
      deltas: null,
      moneyDelta: -amount,
      loveDelta: 0,
      stressDelta: 0
    });
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
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">🧯 Emergency Fund</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 mb-6">
                  <div className="text-sm text-emerald-700 mb-1">Current Emergency Fund</div>
                  <div className="text-3xl font-bold text-emerald-800">${formatMoney(emergencyFund)}</div>
                  <div className="text-xs text-emerald-600 mt-2">
                    Protected savings that cover costs before debt
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-slate-600 mb-3">Deposit amount:</div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleDeposit(100)}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                    >
                      + $100
                    </Button>
                    <Button
                      onClick={() => handleDeposit(500)}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                    >
                      + $500
                    </Button>
                    <Button
                      onClick={() => handleDeposit(1000)}
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                    >
                      + $1,000
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600 mb-4">
                  <div className="font-semibold mb-1">How it works:</div>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Emergency Fund covers costs before you go into debt</li>
                    <li>Auto-pays debt at start of each year</li>
                    <li>Deposits may push your money negative (allowed)</li>
                  </ul>
                </div>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full h-12"
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}