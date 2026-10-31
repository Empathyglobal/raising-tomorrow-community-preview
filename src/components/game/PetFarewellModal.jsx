import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';

export default function PetFarewellModal({ open, onComplete }) {
  const { gameState, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry, updateState } = useGameState();
  const { petName, petType, currentYear } = gameState;

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

  const farewellChoices = [
    {
      emoji: '🕯️',
      title: 'Hold a small memorial together',
      detail: 'You name the feelings and let it be sad.',
      deltas: { empathy: 1, confidence: 1, intelligence: 0, discipline: 0 },
      loveDelta: 1,
      stressDelta: -1
    },
    {
      emoji: '🌱',
      title: 'Plant something in their honor',
      detail: 'A living reminder. Simple, steady.',
      deltas: { empathy: 2, intelligence: 0, discipline: 0, confidence: 0 },
      loveDelta: 1,
      stressDelta: 0
    },
    {
      emoji: '🎁',
      title: 'Donate supplies / do a kind act',
      detail: 'You turn grief into care.',
      deltas: { empathy: 2, discipline: 1, intelligence: 0, confidence: 0 },
      loveDelta: 0,
      stressDelta: -1
    },
    {
      emoji: '😶',
      title: 'Keep it brief and practical',
      detail: 'You move fast. They follow… quietly.',
      deltas: { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 },
      loveDelta: -1,
      stressDelta: 0
    },
    {
      emoji: '🙈',
      title: 'Avoid talking about it',
      detail: 'The silence teaches something too.',
      deltas: { empathy: -2, confidence: -1, intelligence: 0, discipline: 0 },
      loveDelta: -1,
      stressDelta: 1
    }
  ];

  const handleChoice = (choice) => {
    // Apply effects
    applyDeltas(choice.deltas, `Farewell: ${petName}`);
    applyLove(choice.loveDelta, `Farewell: ${petName}`);
    applyStress(choice.stressDelta, `Farewell: ${petName}`);

    // Log
    addLog(`🐾 Farewell: ${choice.detail}`);

    // Record timeline
    recordTimelineEntry({
      kind: "pet",
      title: `Farewell: ${petName}`,
      detail: choice.detail,
      deltas: choice.deltas,
      moneyDelta: 0,
      loveDelta: choice.loveDelta,
      stressDelta: choice.stressDelta
    });

    // Clear pet
    updateState({
      petType: "none",
      petName: "",
      petAnnualCost: 0,
      petAgeYears: 0,
      petLifespanYears: 0,
      petDeathPending: false
    });

    // Complete and continue
    onComplete();
  };

  const petEmojis = {
    dog: '🐶',
    cat: '🐱',
    rabbit: '🐰',
    hamster: '🐹',
    fish: '🐟'
  };

  const petEmoji = petEmojis[petType] || '🐾';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="rt-modal-glass bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-center p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex-shrink-0">
              <div className="text-center">
                <div className="text-4xl mb-2">{petEmoji}</div>
                <h2 className="text-xl font-bold text-slate-800">🐾 Farewell</h2>
                <p className="text-sm text-slate-600 mt-2">
                  {petName} the {petType} has died. Your child looks to you for what this means.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-8">
              <div className="space-y-2.5">
                {farewellChoices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="w-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl p-4 transition-all text-left"
                  >
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <div className="text-2xl flex-shrink-0 leading-none pt-1">{choice.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm mb-1">
                          {choice.title}
                        </p>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {choice.detail}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}