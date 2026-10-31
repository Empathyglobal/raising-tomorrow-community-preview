import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';

export default function ChapterBeatModal({ open, onClose, title, body, unlocks = [] }) {
  const { recordTimelineEntry, gameState } = useGameState();
  // Block body scroll when open
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[1101] flex items-center justify-center p-4"
          >
            <div className="rt-modal-glass w-full max-w-md bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 rounded-2xl shadow-2xl p-6 border border-amber-200">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-slate-800 text-center mb-3">
                {title}
              </h2>

              {/* Body */}
              <p className="text-base text-slate-700 leading-relaxed text-center mb-4">
                {body}
              </p>

              {/* Unlocks (optional) */}
              {unlocks.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-2">What's New:</p>
                  <ul className="space-y-1">
                    {unlocks.map((unlock, idx) => (
                      <li key={idx} className="text-xs text-blue-800 flex items-start gap-2">
                        <span className="flex-shrink-0">•</span>
                        <span>{unlock}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={() => {
                  recordTimelineEntry({
                    year: gameState.currentYear,
                    kind: "chapter_beat",
                    title: title,
                    detail: body,
                    deltas: null
                  });
                  onClose();
                }}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}