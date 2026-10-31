import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { audioManager } from './AudioManager';
import { traumaFromPetFarewellChoice } from './childTraumaSystem';

export default function PetFarewellScenarioModal({ open, onComplete }) {
  const { gameState, applyDeltas, applyLove, applyStress, addLog, updateState, recordTimelineEntry, captureRewindSnapshot, recordChildTraumaEvent } = useGameState();
  const { pet } = gameState;
  const [processing, setProcessing] = React.useState(false);

  // Block body scroll
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
      letter: 'A',
      emoji: '🕯️',
      text: "Hold a small goodbye ritual and let them talk about feelings.",
      deltas: { empathy: 1, confidence: 0.5, intelligence: 0, discipline: 0 },
      loveDelta: 0.3,
      stressDelta: -0.2,
      consequence: "They feel heard. Grief becomes safer to name."
    },
    {
      letter: 'B',
      emoji: '📸',
      text: "Make a tiny memory: photo, paw print, and one story.",
      deltas: { empathy: 0.7, confidence: 0.4, intelligence: 0, discipline: 0 },
      loveDelta: 0.4,
      stressDelta: 0,
      consequence: "They keep the memory close. Loss doesn't erase love."
    },
    {
      letter: 'C',
      emoji: '🧹',
      text: "Keep it practical: explain gently, then return to routine.",
      deltas: { discipline: 0.5, empathy: 0.2, intelligence: 0, confidence: 0 },
      loveDelta: -0.1,
      stressDelta: 0,
      consequence: "They learn to move forward. Warmth feels a little thinner."
    },
    {
      letter: 'D',
      emoji: '🤝',
      text: "Ask a friend/relative to help you both process it.",
      deltas: { empathy: 0.6, intelligence: 0, discipline: 0, confidence: 0 },
      loveDelta: 0.1,
      stressDelta: -0.4,
      consequence: "Support lightens the weight. You both feel less alone."
    },
    {
      letter: 'E',
      emoji: '😬',
      text: "Tell them to 'get over it' and throw the pet stuff away immediately.",
      deltas: { empathy: -2, confidence: -2, intelligence: 0, discipline: 0 },
      loveDelta: -2,
      stressDelta: 0.5,
      consequence: "Damage accumulates. They learn grief is shameful."
    }
  ];

  const handleChoice = (choice) => {
    if (processing || !pet) return;
    
    setProcessing(true);
    
    // Capture rewind snapshot
    captureRewindSnapshot();
    
    // Play audio
    if (choice.letter === 'E') {
      audioManager.playSfx('bad');
    } else {
      audioManager.playSfx('success');
    }
    
    // Apply deltas
    applyDeltas(choice.deltas, `Pet Farewell: ${choice.letter}`);
    
    if (choice.loveDelta !== 0) {
      applyLove(choice.loveDelta, "Pet Farewell");
    }
    
    if (choice.stressDelta !== 0) {
      applyStress(choice.stressDelta, "Pet Farewell");
    }
    
    // Log
    addLog(`🐾 ${pet.name} passed away.`);
    addLog(choice.consequence);
    
    // Mark pet as deceased
    updateState({
      pet: {
        ...pet,
        alive: false
      },
      petDeathPending: false
    });
    
    // Timeline entry
    recordTimelineEntry({
      kind: "pet",
      title: `🐾 Goodbye, ${pet.name}`,
      detail: `You chose ${choice.letter}: ${choice.text}`,
      deltas: choice.deltas,
      moneyDelta: 0,
      loveDelta: choice.loveDelta,
      stressDelta: choice.stressDelta,
      meta: {
        choiceLetter: choice.letter,
        petName: pet.name,
        petSpecies: pet.speciesLabel
      }
    });

    // If the farewell was handled harshly, it can leave an emotional scar.
    const trauma = traumaFromPetFarewellChoice({
      choiceLetter: choice.letter,
      age: gameState.currentYear,
      petName: pet.name
    });
    if (trauma) {
      recordChildTraumaEvent(trauma, { log: true });
    }
    
    // Complete callback
    setTimeout(() => {
      setProcessing(false);
      if (onComplete) onComplete();
    }, 300);
  };

  if (!pet) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[1100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[1101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">🐾 Goodbye, {pet.name}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your pet's time has come. Your child looks to you for how to say goodbye.
                </p>
              </div>

              {/* Choices */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                {farewellChoices.map((choice) => (
                  <button
                    key={choice.letter}
                    onClick={() => handleChoice(choice)}
                    disabled={processing}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      choice.letter === 'E'
                        ? 'border-red-300 bg-red-50/50 hover:border-red-500 hover:bg-red-100/50'
                        : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50'
                    } ${processing ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        {choice.letter}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{choice.emoji}</span>
                          <span className="font-semibold text-slate-800">{choice.text}</span>
                        </div>
                        <div className="text-xs text-slate-500 italic">
                          {choice.consequence}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}