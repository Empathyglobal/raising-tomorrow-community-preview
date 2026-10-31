import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { getCompliments } from './relationshipData';
import { Button } from '@/components/ui/button';

export default function ComplimentModal({ open, person, onClose }) {
  const { gameState, applyDeltas, applyLove, applyStress, addLog, spendFocus, emitActionResult, updateState } = useGameState();
  const { currentYear } = gameState;
  const [selectedCompliment, setSelectedCompliment] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setSelectedCompliment(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleConfirm = () => {
    if (!selectedCompliment || !person) return;

    if (!spendFocus(1, "Compliment")) return;

    if (person.role === "child") {
      applyLove(0.2, "Compliment child");
      applyDeltas({ confidence: 0.2, intelligence: 0, empathy: 0, discipline: 0 }, "Compliment child");
      applyStress(-0.05, "Compliment child");
    } else {
      const newMeter = Math.max(0, Math.min(100, person.meter + 8));
      updateState({
        relationships: {
          ...gameState.relationships,
          roster: gameState.relationships.roster.map(p =>
            p.id === person.id ? { ...p, meter: newMeter } : p
          )
        }
      });
      
      applyStress(-0.05, "Compliment");
      
      if (person.role === "teacher") {
        applyDeltas({ discipline: 0.1, intelligence: 0, empathy: 0, confidence: 0 }, "Compliment teacher");
      } else if (person.role === "best_friend") {
        applyDeltas({ empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }, "Compliment best friend");
      }
      
      // Partner bonus at high meter
      if (person.role === "partner" && newMeter >= 80) {
        const alreadyBonused = person.interactionsByAge?.[currentYear]?.partnerBonusApplied;
        if (!alreadyBonused) {
          applyStress(-0.10, "Strong partnership");
        }
      }
    }

    const updatedInteractionsByAge = {
      ...person.interactionsByAge,
      [currentYear]: {
        didConnect: true,
        type: "compliment",
        detail: selectedCompliment,
        partnerBonusApplied: person.role === "partner" && person.meter >= 80
      }
    };

    updateState({
      relationships: {
        ...gameState.relationships,
        roster: gameState.relationships.roster.map(p =>
          p.id === person.id ? { ...p, interactionsByAge: updatedInteractionsByAge } : p
        )
      }
    });

    addLog(`🌟 You complimented ${person.name}: "${selectedCompliment}"`);

    const deltaObj = person.role === "child" 
      ? { confidence: 0.2, intelligence: 0, empathy: 0, discipline: 0 }
      : person.role === "teacher"
        ? { discipline: 0.1, intelligence: 0, empathy: 0, confidence: 0 }
        : person.role === "best_friend"
          ? { empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }
          : {};

    emitActionResult({
      actionId: 'relationshipCompliment',
      title: `🌟 Complimented ${person.name}`,
      body: `"${selectedCompliment}"`,
      deltas: deltaObj,
      loveDelta: person.role === "child" ? 0.2 : 0,
      stressDelta: -0.05,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['relationship', 'compliment'],
      meta: { 
        emoji: '🌟', 
        personName: person.name, 
        compliment: selectedCompliment,
        coachNote: person.role === "child" ? "Specific, process‑focused praise builds durable confidence because it points to what they can do again." : undefined
      }
    });

    onClose();
  };

  if (!person) return null;

  const compliments = getCompliments(person);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[110]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  🌟 Compliment {person.name}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Choose what to say:</p>
                
                <div className="space-y-2">
                  {compliments.map((compliment, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCompliment(compliment)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCompliment === compliment
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-slate-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">{compliment}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedCompliment}
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                  >
                    Say It
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}