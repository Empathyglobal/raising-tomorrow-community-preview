import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

const VET_NOTES = [
  { id: "annual", label: "Annual checkup", emoji: "📋" },
  { id: "itchy", label: "Itchy skin", emoji: "🐾" },
  { id: "cough", label: "Weird cough", emoji: "🤧" },
  { id: "limp", label: "Limp scare", emoji: "🦴" },
  { id: "reassurance", label: "Just reassurance", emoji: "💭" }
];

export default function VetCheckModal({ open, onClose }) {
  const { gameState, applyMoneyDelta, applyDeltas, applyStress, addLog, updateState, spendFocus, emitActionResult } = useGameState();
  const { pet, currentYear } = gameState;
  const [selectedNote, setSelectedNote] = useState(null);

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
    if (!selectedNote || !pet) return;

    if (!spendFocus(1, "Vet Check")) return;

    applyMoneyDelta(-150, "Vet Check");
    applyDeltas({ empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }, "Vet Check");
    applyStress(-0.3, "Vet Check");

    const newBond = Math.min(10, pet.bond + 0.1);
    
    const updatedCareByAge = {
      ...pet.careByAge,
      [currentYear]: {
        ...pet.careByAge[currentYear],
        vet: { note: selectedNote.label }
      }
    };

    updateState({
      pet: {
        ...pet,
        bond: newBond,
        careByAge: updatedCareByAge
      }
    });

    const logText = `🩺 Vet check for ${pet.name}: ${selectedNote.label}. Everything seems okay.`;
    addLog(logText);

    emitActionResult({
      actionId: 'petVet',
      title: `🩺 Vet Check`,
      body: logText,
      deltas: { empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 },
      loveDelta: 0,
      stressDelta: -0.3,
      moneyDelta: -150,
      focusDelta: -1,
      tags: ['pet', 'health'],
      meta: { emoji: '🩺', petName: pet.name, note: selectedNote.label }
    });

    onClose();
    setSelectedNote(null);
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
                  🩺 Vet Check
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Reason for visit:</p>
                
                <div className="space-y-2">
                  {VET_NOTES.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedNote?.id === note.id
                          ? 'border-red-400 bg-red-50'
                          : 'border-slate-200 bg-white hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{note.emoji}</span>
                        <span className="font-medium text-slate-800">{note.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-slate-600">
                  Cost: $150 • Focus: 1
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedNote}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    Book Vet Visit
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