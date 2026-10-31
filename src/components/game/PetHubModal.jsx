import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from './GameStateContext';
import { PET_SPECIES, PET_NAME_SUGGESTIONS } from './petQuirks';
import AdoptPetModal from './AdoptPetModal';
import FeedPetModal from './FeedPetModal';
import BathePetModal from './BathePetModal';
import PlayWithPetModal from './PlayWithPetModal';
import TrainPetModal from './TrainPetModal';
import VetCheckModal from './VetCheckModal';
import { Button } from '@/components/ui/button';

export default function PetHubModal({ open, onClose }) {
  const { gameState, getAvailability, getLocalAmount } = useGameState();
  const { pet, currentYear } = gameState;
  
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [batheModalOpen, setBatheModalOpen] = useState(false);
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [trainModalOpen, setTrainModalOpen] = useState(false);
  const [vetModalOpen, setVetModalOpen] = useState(false);

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

  const handleAdoptClick = (species) => {
    setSelectedSpecies(species);
    setAdoptModalOpen(true);
  };

  // Check if care action already done this age
  const isCareActionDone = (actionType) => {
    if (!pet || !pet.careByAge) return false;
    const ageData = pet.careByAge[currentYear];
    return ageData && ageData[actionType];
  };

  const getCareActionAvailability = (actionType, focusCost = 0) => {
    // Check if already done
    if (isCareActionDone(actionType)) {
      return { enabled: false, reasonCode: 'cooldown', reasonText: 'Already done this year' };
    }
    
    // Check scenario block and focus
    return getAvailability({
      type: 'action',
      id: `pet_${actionType}`,
      focusCost,
      alwaysAvailable: false
    });
  };

  const speciesList = Object.values(PET_SPECIES);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">🐾 Pets</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {!pet ? (
                  // No pet - show adoption options
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 mb-4">
                      A pet adds warmth… and bills.
                    </p>
                    
                    {speciesList.map((species) => (
                      <button
                        key={species.id}
                        onClick={() => handleAdoptClick(species)}
                        className="w-full text-left p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl flex-shrink-0">{species.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 mb-1 text-base">{species.label}</div>
                            <div className="text-sm text-slate-600 leading-relaxed mb-2">
                              Adoption: ${formatMoney(getLocalAmount(species.adoptionFee))} • Yearly: ${formatMoney(getLocalAmount(species.yearlyUpkeep))}
                            </div>
                            <div className="text-xs text-slate-500">
                              Lifespan: {species.lifespanMin}–{species.lifespanMax} years
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Pet exists - show profile and care actions
                  <div className="space-y-6">
                    {/* Pet Profile Card */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                      <div className="text-center mb-4">
                        <span className="text-6xl">{pet.emoji}</span>
                        <h4 className="text-xl font-bold text-slate-800 mt-3">
                          {pet.name}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{pet.speciesLabel}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Bond:</span>
                          <span className="font-semibold text-amber-800">{pet.bond.toFixed(1)}/10</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">With you since:</span>
                          <span className="font-semibold text-slate-800">Age {pet.adoptedAtAge}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Pet Age:</span>
                          <span className="font-semibold text-slate-800">{pet.ageYears} years</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <p className="text-xs text-slate-600 italic">
                          "{pet.quirk}"
                        </p>
                      </div>
                    </div>
                    
                    {/* Care Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                        Pet Care (Once per year)
                      </h4>
                      
                      <div className="space-y-2">
                        {/* Feed */}
                        {(() => {
                          const avail = getCareActionAvailability('fed', 0);
                          return (
                            <button
                              onClick={() => setFeedModalOpen(true)}
                              disabled={!avail.enabled}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                !avail.enabled
                                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                  : 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100 active:scale-[0.98]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🍽️</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800 text-sm">Feed {pet.name}</div>
                                  <div className="text-xs text-slate-600">
                                    {avail.enabled ? `Cost: $${formatMoney(getLocalAmount(25))}` : avail.reasonText}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                        
                        {/* Bathe */}
                        {(() => {
                          const avail = getCareActionAvailability('bathed', 0);
                          return (
                            <button
                              onClick={() => setBatheModalOpen(true)}
                              disabled={!avail.enabled}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                !avail.enabled
                                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                  : 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 active:scale-[0.98]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🛁</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800 text-sm">Bathe {pet.name}</div>
                                  <div className="text-xs text-slate-600">
                                    {avail.enabled ? `Cost: $${formatMoney(getLocalAmount(20))}` : avail.reasonText}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                        
                        {/* Play */}
                        {(() => {
                          const avail = getCareActionAvailability('played', 1);
                          return (
                            <button
                              onClick={() => setPlayModalOpen(true)}
                              disabled={!avail.enabled}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                !avail.enabled
                                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                  : 'border-pink-200 bg-pink-50 hover:border-pink-400 hover:bg-pink-100 active:scale-[0.98]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🎾</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800 text-sm">Play with {pet.name}</div>
                                  <div className="text-xs text-slate-600">
                                    {avail.enabled ? 'Focus: 1' : avail.reasonText}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                        
                        {/* Train */}
                        {(() => {
                          const avail = getCareActionAvailability('trained', 1);
                          return (
                            <button
                              onClick={() => setTrainModalOpen(true)}
                              disabled={!avail.enabled}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                !avail.enabled
                                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                  : 'border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 active:scale-[0.98]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🎓</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800 text-sm">Train {pet.name}</div>
                                  <div className="text-xs text-slate-600">
                                    {avail.enabled ? 'Focus: 1' : avail.reasonText}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                        
                        {/* Vet Check */}
                        {(() => {
                          const avail = getCareActionAvailability('vet', 1);
                          return (
                            <button
                              onClick={() => setVetModalOpen(true)}
                              disabled={!avail.enabled}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                !avail.enabled
                                  ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                  : 'border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100 active:scale-[0.98]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🩺</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800 text-sm">Vet Check for {pet.name}</div>
                                  <div className="text-xs text-slate-600">
                                    {avail.enabled ? `Cost: $${formatMoney(getLocalAmount(150))} • Focus: 1` : avail.reasonText}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sub-modals */}
          <AdoptPetModal
            open={adoptModalOpen}
            species={selectedSpecies}
            onClose={() => {
              setAdoptModalOpen(false);
              setSelectedSpecies(null);
            }}
            onAdopted={() => {
              setAdoptModalOpen(false);
              setSelectedSpecies(null);
              // Don't close parent modal - let player see their new pet
            }}
          />
          
          <FeedPetModal
            open={feedModalOpen}
            onClose={() => setFeedModalOpen(false)}
          />
          
          <BathePetModal
            open={batheModalOpen}
            onClose={() => setBatheModalOpen(false)}
          />
          
          <PlayWithPetModal
            open={playModalOpen}
            onClose={() => setPlayModalOpen(false)}
          />
          
          <TrainPetModal
            open={trainModalOpen}
            onClose={() => setTrainModalOpen(false)}
          />
          
          <VetCheckModal
            open={vetModalOpen}
            onClose={() => setVetModalOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}