import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

const PLAY_ACTIVITIES = [
  { id: "fetch", label: "Fetch", emoji: "🎾" },
  { id: "cuddle", label: "Cuddle pile", emoji: "🫂" },
  { id: "park", label: "Park run", emoji: "🏃" },
  { id: "tricks", label: "Trick show", emoji: "🎪" },
  { id: "obstacle", label: "Obstacle course", emoji: "🏁" }
];

import { appendHumor } from './humorUtils';

export default function PlayWithPetModal({ open, onClose }) {
  const { gameState, applyDeltas, applyLove, addLog, updateState, spendFocus, emitActionResult } = useGameState();
  const { pet, currentYear } = gameState;
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleConfirm = () => {
    if (!selectedActivity || !pet) return;

    // Spend focus
    if (!spendFocus(1, "Play with Pet")) return;

    applyDeltas({ empathy: 0.2, confidence: 0.1, intelligence: 0, discipline: 0 }, "Play with Pet");
    applyLove(0.3, "Play with Pet");

    const newBond = Math.min(10, pet.bond + 0.4);
    
    const updatedCareByAge = {
      ...pet.careByAge,
      [currentYear]: {
        ...pet.careByAge[currentYear],
        played: { activity: selectedActivity.label }
      }
    };

    const updatedPet = { ...pet, bond: newBond, careByAge: updatedCareByAge };
    updateState((prev) => ({
      pet: updatedPet,
      pets: Array.isArray(prev.pets) ? prev.pets.map((pp) => (pp.id === pet.id ? updatedPet : pp)) : prev.pets
    }));

    const logText = `🎾 Played with ${pet.name}: ${selectedActivity.label}.`;
    addLog(logText);

    emitActionResult({
      actionId: 'petPlay',
      title: `🎾 Played with ${pet.name}`,
      body: logText,
      deltas: { empathy: 0.2, confidence: 0.1, intelligence: 0, discipline: 0 },
      loveDelta: 0.3,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['pet', 'play'],
      meta: { emoji: '🎾', petName: pet.name, activity: selectedActivity.label }
    });

    onClose();
    setSelectedActivity(null);
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
                  🎾 Play with {pet.name}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Choose an activity:</p>
                
                <div className="space-y-2">
                  {PLAY_ACTIVITIES.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedActivity?.id === activity.id
                          ? 'border-pink-400 bg-pink-50'
                          : 'border-slate-200 bg-white hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{activity.emoji}</span>
                        <span className="font-medium text-slate-800">{activity.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedActivity}
                    className="flex-1 bg-pink-500 hover:bg-pink-600"
                  >
                    Play
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