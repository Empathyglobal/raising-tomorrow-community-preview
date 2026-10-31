import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

import { useGameState } from '@/components/game/GameStateContext';

export default function ReflectiveMomentModal({ open, onClose, setup, observation }) {
  const { recordTimelineEntry, gameState } = useGameState();
  useLockBodyScroll(open);

  if (!open) return null;

  const handleContinue = () => {
    recordTimelineEntry({
      year: gameState.currentYear,
      kind: "reflection",
      title: "A Quiet Moment",
      detail: `${setup}\n\n${observation}`,
      deltas: null
    });
    onClose();
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div 
              className="rt-modal-glass bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-amber-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm flex-shrink-0">
                <h2 className="text-lg font-semibold text-slate-800">A quiet moment presents itself</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="bg-white/60 rounded-xl p-5 border border-slate-200/50">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {setup}
                  </p>
                  
                  <div className="border-l-2 border-amber-400 pl-4">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {observation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-white/60 backdrop-blur-sm">
                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}