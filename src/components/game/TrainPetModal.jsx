import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatSmallDelta, getActionBeneficiary } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

const TRAINING_FOCUS = [
  { id: "sit", label: "Sit/Stay", emoji: "🪑" },
  { id: "leash", label: "Leash manners", emoji: "🦮" },
  { id: "gentle", label: "Gentle hands", emoji: "🤲" },
  { id: "routine", label: "Routine", emoji: "🕒" },
  { id: "recall", label: "Recall", emoji: "📣" }
];

const getCounterKey = (focusId) => `pet_train_${focusId}`;

export default function TrainPetModal({ open, onClose }) {
  const { gameState, applyDeltas, addLog, updateState, spendFocus, emitActionResult } = useGameState();
  const { pet, currentYear } = gameState;
  const [selectedFocus, setSelectedFocus] = useState(null);
  
  const benef = getActionBeneficiary(gameState);

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
    if (!selectedFocus || !pet) return;

    if (!spendFocus(1, "Train Pet")) return;

    // Increment counter and compute mastery
    const counterKey = getCounterKey(selectedFocus.id);
    const prevCount = Number(gameState.counters?.[counterKey] || 0);
    const newCount = prevCount + 1;
    const mastery = Math.min(1, 0.1 * Math.pow(2, newCount - 1));

    // Scale deltas based on mastery
    const disciplineDelta = 0.2 + mastery * 0.2;
    const empathyDelta = 0.1 + mastery * 0.1;
    const childDeltas = { discipline: disciplineDelta, empathy: empathyDelta, intelligence: 0, confidence: 0 };

    // Scale bond gain
    const bondGain = 0.3 + mastery * 0.15;
    const newBond = Math.min(10, pet.bond + bondGain);
    
    const updatedCareByAge = {
      ...pet.careByAge,
      [currentYear]: {
        ...pet.careByAge[currentYear],
        trained: { focus: selectedFocus.label }
      }
    };

    applyDeltas(childDeltas, "Train Pet");

    // Check if showcase should be unlocked (any focus >= 5)
    const sitCount = gameState.counters?.pet_train_sit || 0;
    const leashCount = gameState.counters?.pet_train_leash || 0;
    const gentleCount = gameState.counters?.pet_train_gentle || 0;
    const routineCount = gameState.counters?.pet_train_routine || 0;
    const recallCount = gameState.counters?.pet_train_recall || 0;
    const showcaseUnlocked = Math.max(sitCount, leashCount, gentleCount, routineCount, recallCount) >= 5;

    // Check for Pet Whisperer trophy (total trainings >= 10)
    const totalTrainings = (selectedFocus.id === 'sit' ? newCount : sitCount) + 
                           (selectedFocus.id === 'leash' ? newCount : leashCount) + 
                           (selectedFocus.id === 'gentle' ? newCount : gentleCount) + 
                           (selectedFocus.id === 'routine' ? newCount : routineCount) + 
                           (selectedFocus.id === 'recall' ? newCount : recallCount);

    const trophies = gameState.trophies || { unlocked: {} };
    const trophyUnlocked = totalTrainings >= 10 && !trophies.unlocked?.pet_whisperer;

    updateState(prev => ({
      counters: { ...(prev.counters || {}), [counterKey]: newCount },
      pet: {
        ...pet,
        bond: newBond,
        careByAge: updatedCareByAge
      },
      ...(trophyUnlocked && {
        trophies: {
          unlocked: {
            ...(prev.trophies?.unlocked || {}),
            pet_whisperer: {
              unlockedAtAge: currentYear,
              unlockedAtYear: currentYear,
              note: 'You and your pet became a tiny team'
            }
          }
        }
      })
    }));

    const logText = `🎓 Trained ${pet.name}: ${selectedFocus.label}. Mastery: ${(mastery * 100).toFixed(0)}%.`;
    addLog(logText);

    if (trophyUnlocked) {
      addLog('🏆 Trophy unlocked: Pet Whisperer');
    }

    emitActionResult({
      actionId: 'petTrain',
      title: `🎓 Trained ${pet.name}`,
      body: `${logText}\n\n${benef.label}: DISCIPLINE ${formatSmallDelta(disciplineDelta)} • EMPATHY ${formatSmallDelta(empathyDelta)}\nPet Bond ${formatSmallDelta(bondGain)}`,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['pet', 'training'],
      meta: { emoji: '🎓', petName: pet.name, focus: selectedFocus.label, mastery: (mastery * 100).toFixed(0) }
    });

    onClose();
    setSelectedFocus(null);
  };

  if (!pet) return null;

  // Check for showcase unlock
  const sitCount = gameState.counters?.pet_train_sit || 0;
  const leashCount = gameState.counters?.pet_train_leash || 0;
  const gentleCount = gameState.counters?.pet_train_gentle || 0;
  const routineCount = gameState.counters?.pet_train_routine || 0;
  const recallCount = gameState.counters?.pet_train_recall || 0;
  const showcaseUnlocked = Math.max(sitCount, leashCount, gentleCount, routineCount, recallCount) >= 5;

  const availableFocuses = [...TRAINING_FOCUS];
  if (showcaseUnlocked) {
    availableFocuses.push({ id: "showcase", label: "Trick Showcase", emoji: "🎪" });
  }

  const handleShowcase = () => {
    if (!pet) return;

    if (!spendFocus(2, "Pet Showcase")) return;

    const childDeltas = { confidence: 0.6, discipline: 0.3, empathy: 0.2 };
    applyDeltas(childDeltas, "Pet Showcase");

    const newBond = Math.min(10, pet.bond + 0.6);

    const updatedCareByAge = {
      ...pet.careByAge,
      [currentYear]: {
        ...pet.careByAge[currentYear],
        trained: { focus: "Trick Showcase" }
      }
    };

    updateState({
      pet: {
        ...pet,
        bond: newBond,
        careByAge: updatedCareByAge
      }
    });

    addLog(`🎪 ${pet.name} put on an amazing trick showcase!`);

    emitActionResult({
      actionId: 'petShowcase',
      title: `🎪 Trick Showcase`,
      body: `${pet.name} performs an amazing trick showcase.\n\n${benef.label}: CONFIDENCE +0.6 • DISCIPLINE +0.3 • EMPATHY +0.2\nPet Bond +0.6`,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -2,
      tags: ['pet', 'training', 'showcase'],
      meta: { emoji: '🎪', petName: pet.name }
    });

    onClose();
    setSelectedFocus(null);
  };

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
                  🎓 Train {pet.name}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Choose a training focus:</p>
                
                <div className="space-y-2">
                  {availableFocuses.map((focus) => (
                    <button
                      key={focus.id}
                      onClick={() => focus.id === 'showcase' ? handleShowcase() : setSelectedFocus(focus)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        focus.id === 'showcase'
                          ? 'border-amber-300 bg-amber-50/50 hover:border-amber-400'
                          : selectedFocus?.id === focus.id
                            ? 'border-purple-400 bg-purple-50'
                            : 'border-slate-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{focus.emoji}</span>
                          <span className="font-medium text-slate-800">{focus.label}</span>
                        </div>
                        {focus.id === 'showcase' && (
                          <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded">2 Focus</span>
                        )}
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
                    disabled={!selectedFocus}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                  >
                    Train
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