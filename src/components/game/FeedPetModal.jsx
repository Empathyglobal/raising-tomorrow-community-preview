import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

const FOOD_OPTIONS = [
  "kibble", "chicken treats", "salmon bits", "carrots", 
  "shrimp", "pellets", "fresh veggies", "grain-free blend"
];

export default function FeedPetModal({ open, onClose }) {
  const { gameState, applyMoneyDelta, applyDeltas, addLog, updateState, emitActionResult } = useGameState();
  const { pet, currentYear } = gameState;
  const [food, setFood] = useState('');
  const [quickPicks] = useState(() => {
    const shuffled = [...FOOD_OPTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const handleConfirm = () => {
    if (!food.trim() || !pet) return;

    // Apply effects
    applyMoneyDelta(-25, "Feed Pet");
    applyDeltas({ empathy: 0.1, discipline: 0.1, intelligence: 0, confidence: 0 }, "Feed Pet");

    // Update pet bond
    const newBond = Math.min(10, pet.bond + 0.2);
    
    // Mark action as done
    const updatedCareByAge = {
      ...pet.careByAge,
      [currentYear]: {
        ...pet.careByAge[currentYear],
        fed: { food: food.trim() }
      }
    };

    const updatedPet = { ...pet, bond: newBond, careByAge: updatedCareByAge };
    updateState((prev) => ({
      pet: updatedPet,
      pets: Array.isArray(prev.pets) ? prev.pets.map((pp) => (pp.id === pet.id ? updatedPet : pp)) : prev.pets
    }));

    // Log
    const logText = `🍽️ Fed ${pet.name} ${food.trim()}.`;
    addLog(logText);

    // Emit result
    emitActionResult({
      actionId: 'petFeed',
      title: `🍽️ Fed ${pet.name}`,
      body: logText,
      deltas: { empathy: 0.1, discipline: 0.1, intelligence: 0, confidence: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -25,
      focusDelta: 0,
      tags: ['pet', 'care'],
      meta: { emoji: '🍽️', petName: pet.name, food: food.trim() }
    });

    onClose();
    setFood('');
  };

  if (!pet) return null;

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
                  🍽️ Feed {pet.name}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What did you feed {pet.name}?
                  </label>
                  <input
                    type="text"
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    placeholder="e.g., kibble"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 mb-2">Quick picks:</p>
                  <div className="flex gap-2 flex-wrap">
                    {quickPicks.map((option) => (
                      <button
                        key={option}
                        onClick={() => setFood(option)}
                        className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-slate-700 text-sm rounded-lg transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!food.trim()}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Feed {pet.name}
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