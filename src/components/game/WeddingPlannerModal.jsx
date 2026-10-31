import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { WEDDING_OPTIONS } from './relationshipMarriageData';

export default function WeddingPlannerModal({ open, onClose, onConfirm }) {
  const { gameState } = useGameState();

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[121] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">💒 Plan Your Wedding</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Choose a celebration style</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-3">
                {WEDDING_OPTIONS.map(wedding => {
                  const canAfford = gameState.money >= wedding.cost;
                  return (
                    <button
                      key={wedding.id}
                      onClick={() => canAfford && onConfirm(wedding)}
                      disabled={!canAfford}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                        !canAfford
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 hover:border-pink-400 hover:bg-pink-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{wedding.emoji}</span>
                          <span className="font-semibold text-slate-800">{wedding.label}</span>
                        </div>
                        <div className="text-sm text-slate-600">-${formatMoney(wedding.cost)}</div>
                      </div>
                      <div className="text-xs text-slate-600 mb-1">{wedding.description}</div>
                      <div className="text-xs text-slate-500">
                        Relationship +{wedding.partnerMeterDelta} • Stress +{wedding.stressDelta}
                      </div>
                      {!canAfford && (
                        <div className="mt-2 text-xs text-red-600">Not enough money</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}