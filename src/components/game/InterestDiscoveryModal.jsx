import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';

const INTEREST_OPTIONS = [
  { id: 'space', emoji: '🚀', label: 'Space' },
  { id: 'animals', emoji: '🐾', label: 'Animals' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'sports', emoji: '🏀', label: 'Sports' },
  { id: 'art', emoji: '🎨', label: 'Art' },
  { id: 'building', emoji: '🧩', label: 'Building & Engineering' },
  { id: 'helping', emoji: '💛', label: 'Helping Others' },
  { id: 'none', emoji: '🎲', label: 'Still discovering' }
];

export default function InterestDiscoveryModal({ open, onComplete }) {
  const { updateState, recordTimelineEntry, addLog } = useGameState();

  const handleSelectInterest = (interestId, interestLabel) => {
    // Set interest in game state
    updateState({ childInterestId: interestId });

    // Add timeline entry
    recordTimelineEntry({
      kind: "milestone",
      title: "✨ Interest spark",
      detail: `They keep gravitating toward: ${interestLabel}.`,
      deltas: null,
      moneyDelta: 0,
      retirementDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    // Add log
    addLog(`✨ Interest spark: They keep gravitating toward ${interestLabel}.`);

    // Close modal
    onComplete();
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
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800 text-center mb-1">
                  🏫 School begins
                </h3>
                <p className="text-sm text-slate-600 text-center">
                  Looking back, what has drawn them the most so far?
                </p>
              </div>

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleSelectInterest(interest.id, interest.label)}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] flex items-center gap-3"
                    >
                      <span className="text-2xl">{interest.emoji}</span>
                      <span className="font-semibold text-slate-800">{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}