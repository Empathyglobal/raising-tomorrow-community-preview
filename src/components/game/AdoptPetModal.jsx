import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { PET_NAME_SUGGESTIONS, pickQuirk } from './petQuirks';
import { Button } from '@/components/ui/button';

import { appendHumor } from './humorUtils';

export default function AdoptPetModal({ open, species, onClose, onAdopted }) {
  const { gameState, applyMoneyDelta, applyDeltas, applyLove, addLog, recordTimelineEntry, updateState, emitActionResult } = useGameState();
  const [petName, setPetName] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (open && species) {
      // Generate 3 random name suggestions
      const pool = PET_NAME_SUGGESTIONS[species.id] || ['Buddy', 'Friend', 'Pal'];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      setSuggestions(shuffled.slice(0, 3));
      setPetName(''); // Clear name on open
    }
  }, [open, species]);

  // Block body scroll
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

  const handleConfirmAdopt = () => {
    if (!petName.trim() || !species) return;

    // Generate lifespan (seeded random)
    const seed = gameState.runSeed + species.id.charCodeAt(0) + gameState.currentYear;
    let state = seed;
    state |= 0;
    state = state + 0x6D2B79F5 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    const random = ((t ^ t >>> 14) >>> 0) / 4294967296;
    const lifespanYears = Math.floor(random * (species.lifespanMax - species.lifespanMin + 1)) + species.lifespanMin;

    // Generate quirk
    const quirk = pickQuirk([]);

    // Create pet object (compatible with multi-pet system)
    const newPet = {
      id: `pet_${Date.now()}`,
      speciesId: species.id,
      speciesKey: species.id,
      speciesLabel: species.label,
      emoji: species.emoji,
      name: petName.trim(),
      adoptedAtAge: gameState.currentYear,
      ageYears: 0,
      petAgeYears: 0,
      lifespanYears,
      yearlyUpkeep: species.yearlyUpkeep,
      bond: 5,
      quirk,
      alive: true,
      careByAge: {},
      flags: {}
    };

    // Apply adoption fee (allow debt)
    applyMoneyDelta(-species.adoptionFee, "Pet Adoption", { allowCreditMessage: true });

    // Small empathy/love boost
    applyDeltas({ empathy: 0.2, intelligence: 0, discipline: 0, confidence: 0 }, "Pet Adoption");
    applyLove(0.2, "Pet Adoption");

    // Update state: set as active and append to array; keep legacy `pet` for back-compat
    updateState((prev) => ({
      pet: newPet,
      pets: [ ...(prev.pets || []), newPet ],
      activePetId: newPet.id
    }));

    // Log
    addLog(`🐾 You adopt ${petName.trim()}. Promises of responsibility fill the air.`);

    // Timeline entry
    recordTimelineEntry({
      kind: "pet",
      title: `🐾 Adopted ${newPet.name} the ${species.label}`,
      detail: `Quirk: "${quirk}"`,
      deltas: { empathy: 0.2, intelligence: 0, discipline: 0, confidence: 0 },
      moneyDelta: -species.adoptionFee,
      loveDelta: 0.2,
      stressDelta: 0
    });

    // Emit action result
    emitActionResult({
      actionId: 'petAdopt',
      title: "🐾 Pet Adopted",
      body: `You brought home ${petName.trim()}. Your kid instantly assigns it a job.`,
      deltas: { empathy: 0.2, intelligence: 0, discipline: 0, confidence: 0 },
      loveDelta: 0.2,
      stressDelta: 0,
      moneyDelta: -species.adoptionFee,
      focusDelta: 0,
      tags: ['pet', 'adoption'],
      meta: { emoji: species.emoji, petName: petName.trim() }
    });

    // Notify parent
    if (onAdopted) onAdopted();
  };

  if (!species) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[110]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Adopt a {species.label}
                </h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <span className="text-6xl">{species.emoji}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name your {species.label}
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g., Kevin"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none text-base"
                    autoFocus
                  />
                </div>
                
                {/* Quick Suggestions */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Quick picks:</p>
                  <div className="flex gap-2 flex-wrap">
                    {suggestions.map((name) => (
                      <button
                        key={name}
                        onClick={() => setPetName(name)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 text-sm rounded-lg transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Cost Summary */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Adoption fee:</span>
                      <span className="font-semibold">${formatMoney(species.adoptionFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yearly upkeep:</span>
                      <span className="font-semibold">${formatMoney(species.yearlyUpkeep)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected lifespan:</span>
                      <span className="font-semibold">{species.lifespanMin}–{species.lifespanMax} years</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmAdopt}
                    disabled={!petName.trim()}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    Adopt {species.label}
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