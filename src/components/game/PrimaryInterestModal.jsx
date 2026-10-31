import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';

const INTERESTS = [
  { id: "SPACE", emoji: "🚀", label: "Space & rockets", deltas: { intelligence: 0.2, empathy: 0, discipline: 0, confidence: 0 } },
  { id: "ANIMALS", emoji: "🦋", label: "Animals & nature", deltas: { intelligence: 0, empathy: 0.2, discipline: 0, confidence: 0 } },
  { id: "ART", emoji: "🎨", label: "Art & stories", deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0.2 } },
  { id: "BUILDING", emoji: "🔧", label: "Building & machines", deltas: { intelligence: 0, empathy: 0, discipline: 0.2, confidence: 0 } },
  { id: "PEOPLE", emoji: "🧑‍🤝‍🧑", label: "People & helping", deltas: { intelligence: 0, empathy: 0.1, discipline: 0, confidence: 0.1 } }
];

export default function PrimaryInterestModal({ open, onComplete }) {
  const { gameState, updateState, applyDeltas, addLog, recordTimelineEntry } = useGameState();
  const [selected, setSelected] = useState(null);

  const handleSelect = (interest) => {
    setSelected(interest);
    
    // Set primary interest
    updateState({
      childProfile: {
        ...gameState.childProfile,
        primaryInterest: interest.id,
        interestChosenAtAge: 6
      }
    });
    
    // Apply stat nudge
    applyDeltas(interest.deltas, "Primary Interest");
    
    // Add log
    addLog(`🎒 Primary interest: ${interest.label}`);
    
    // Record timeline entry
    recordTimelineEntry({
      age: 6,
      kind: "milestone",
      title: "🎒 Started school (Age 6)",
      detail: `Primary interest: ${interest.label}`,
      deltas: interest.deltas,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { age: 6, primaryInterest: interest.id }
    });
    
    // Close modal after 800ms
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-0" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎒</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">School Begins</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your child is about to start school.<br/>
              Before the schedules, the backpacks, and the 'how was your day?'…<br/>
              What do you notice they're drawn to most?
            </p>
          </div>

          <div className="space-y-3">
            {INTERESTS.map((interest) => (
              <motion.button
                key={interest.id}
                onClick={() => handleSelect(interest)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selected?.id === interest.id
                    ? 'border-indigo-500 bg-indigo-100 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                }`}
                whileTap={{ scale: 0.98 }}
                disabled={!!selected}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{interest.emoji}</div>
                  <div>
                    <div className="font-semibold text-slate-800">{interest.label}</div>
                    {selected?.id === interest.id && (
                      <div className="text-xs text-indigo-600 mt-1">Selected ✓</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}