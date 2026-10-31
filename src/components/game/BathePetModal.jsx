import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

export default function BathePetModal({ open, onClose }) {
  const { gameState, applyMoneyDelta, applyDeltas, addLog, updateState, emitActionResult } = useGameState();
  const { pet, currentYear } = gameState;
  const [product, setProduct] = useState('');

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
    if (!product.trim() || !pet) return;

    applyMoneyDelta(-20, "Bathe Pet");
    applyDeltas({ empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }, "Bathe Pet");

    const newBond = Math.min(10, pet.bond + 0.2);
    
    const updatedCareByAge = {
      ...pet.careByAge,
      [currentYear]: {
        ...pet.careByAge[currentYear],
        bathed: { product: product.trim() }
      }
    };

    updateState({
      pet: {
        ...pet,
        bond: newBond,
        careByAge: updatedCareByAge
      }
    });

    const logText = `🛁 Bathed ${pet.name} with ${product.trim()}. (${pet.name} is… offended.)`;
    addLog(logText);

    emitActionResult({
      actionId: 'petBathe',
      title: `🛁 Bathed ${pet.name}`,
      body: logText,
      deltas: { empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -20,
      focusDelta: 0,
      tags: ['pet', 'care'],
      meta: { emoji: '🛁', petName: pet.name, product: product.trim() }
    });

    onClose();
    setProduct('');
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
                  🛁 Bathe {pet.name}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    What did you use?
                  </label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="oatmeal shampoo"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!product.trim()}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    Bathe {pet.name}
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