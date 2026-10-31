import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { DOMESTIC_DESTINATIONS, TRAVEL_DESTINATIONS } from './travelDestinations';
import {
  TRAVEL_CONFIG,
  TRAVEL_LENGTHS,
  TRAVEL_STYLES,
  TRAVEL_COMPANIONS,
  TRAVEL_PREP_OPTIONS
} from './travelV2Assets';

export default function TravelPlannerModal({ open, onClose, onConfirm, source }) {
  const { gameState } = useGameState();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState({
    source: source || 'bond',
    tripType: null,
    destination: null,
    lengthId: null,
    styleId: null,
    companionId: null,
    prepId: null
  });

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setPlan({
        source: source || 'bond',
        tripType: null,
        destination: null,
        lengthId: null,
        styleId: null,
        companionId: null,
        prepId: null
      });
    }
  }, [open, source]);

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

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSelectTripType = (type) => {
    setPlan({ ...plan, tripType: type });
    setStep(2);
  };

  const handleSelectDestination = (dest) => {
    // Check if locked
    if (dest.unlock) {
      const stampCount = gameState.passportStamps?.length || 0;
      if (stampCount < dest.unlock.minStamps) {
        return; // Can't select locked destination
      }
    }
    setPlan({ ...plan, destination: dest });
    setStep(3);
  };

  const handleSelectLength = (lengthId) => {
    setPlan({ ...plan, lengthId });
    setStep(4);
  };

  const handleSelectStyle = (styleId) => {
    setPlan({ ...plan, styleId });
    setStep(5);
  };

  const handleSelectCompanion = (companionId) => {
    setPlan({ ...plan, companionId });
    setStep(6);
  };

  const handleSelectPrep = (prepId) => {
    setPlan({ ...plan, prepId });
    setStep(7);
  };

  const handleConfirm = () => {
    onConfirm(plan);
  };

  // Calculate cost and risk for confirm screen
  const calculateCost = () => {
    if (!plan.destination || !plan.lengthId || !plan.styleId || !plan.companionId) return 0;
    
    const baseCost = plan.tripType === 'domestic' 
      ? TRAVEL_CONFIG.baseCost.domestic 
      : TRAVEL_CONFIG.baseCost.international;
    
    const lengthMult = TRAVEL_CONFIG.lengthMultipliers[plan.lengthId] || 1;
    const styleMult = TRAVEL_CONFIG.styleMultipliers[plan.styleId] || 1;
    const companionMult = TRAVEL_CONFIG.companionMultipliers[plan.companionId] || 1;
    
    return Math.round(baseCost * lengthMult * styleMult * companionMult);
  };

  const calculateRisk = () => {
    if (!plan.lengthId || !plan.styleId || !plan.prepId) return { label: 'Low', prob: 0.1 };
    
    const baseRisk = plan.tripType === 'domestic' 
      ? TRAVEL_CONFIG.baseRisk.domestic 
      : TRAVEL_CONFIG.baseRisk.international;
    
    const lengthAdd = TRAVEL_CONFIG.riskAdds.length[plan.lengthId] || 0;
    const styleAdd = TRAVEL_CONFIG.riskAdds.style[plan.styleId] || 0;
    const prepAdd = TRAVEL_CONFIG.riskAdds.prep[plan.prepId] || 0;
    
    const totalRisk = baseRisk + lengthAdd + styleAdd + prepAdd;
    
    if (totalRisk < 0.15) return { label: 'Low', prob: totalRisk, color: 'text-green-600' };
    if (totalRisk < 0.25) return { label: 'Medium', prob: totalRisk, color: 'text-yellow-600' };
    return { label: 'High', prob: totalRisk, color: 'text-red-600' };
  };

  const focusCost = plan.lengthId ? TRAVEL_LENGTHS[plan.lengthId].focusCost : 1;
  const totalCost = calculateCost();
  const risk = calculateRisk();
  const stampCount = gameState.passportStamps?.length || 0;

  const allDestinations = plan.tripType === 'domestic' ? DOMESTIC_DESTINATIONS : TRAVEL_DESTINATIONS;
  const availableCompanions = Object.values(TRAVEL_COMPANIONS).filter(c => c.available(gameState));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[121] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl lg:max-w-3xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <button onClick={handleBack} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                      <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">✈️ Plan a Trip</h3>
                    <p className="text-sm text-slate-500">Step {step} of 7</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 lg:py-8">
                {step === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Choose trip type</h4>
                    <button
                      onClick={() => handleSelectTripType('domestic')}
                      className="w-full text-left p-6 rounded-xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">🚗</span>
                        <div>
                          <div className="font-semibold text-slate-800 text-lg mb-1">Domestic Trip</div>
                          <div className="text-sm text-slate-600">Road trips, national parks, nearby cities</div>
                          <div className="text-xs text-slate-500 mt-2">Base cost: ${formatMoney(TRAVEL_CONFIG.baseCost.domestic)}</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectTripType('international')}
                      className="w-full text-left p-6 rounded-xl border-2 border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">✈️</span>
                        <div>
                          <div className="font-semibold text-slate-800 text-lg mb-1">International Trip</div>
                          <div className="text-sm text-slate-600">Passport stamps, global adventures, cultural immersion</div>
                          <div className="text-xs text-slate-500 mt-2">Base cost varies by location</div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Pick a destination</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {allDestinations.map(dest => {
                        const locked = dest.unlock && stampCount < dest.unlock.minStamps;
                        return (
                          <button
                            key={dest.code}
                            onClick={() => !locked && handleSelectDestination(dest)}
                            disabled={locked}
                            className={`text-left p-4 rounded-xl border-2 transition-colors ${
                              locked 
                                ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{dest.flagEmoji}</span>
                              <span className="text-2xl">{dest.emoji}</span>
                              {locked && <Lock className="w-4 h-4 text-slate-400 ml-auto" />}
                            </div>
                            <div className="font-semibold text-slate-800 text-sm mb-1">{dest.name}</div>
                            <div className="text-xs text-slate-600 italic">{dest.vibe}</div>
                            {locked && (
                              <div className="text-xs text-red-600 mt-2">Requires {dest.unlock.minStamps} stamps</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">How long?</h4>
                    {Object.values(TRAVEL_LENGTHS).map(length => (
                      <button
                        key={length.id}
                        onClick={() => handleSelectLength(length.id)}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{length.emoji}</span>
                            <div>
                              <div className="font-semibold text-slate-800">{length.label}</div>
                              <div className="text-xs text-slate-600">{length.tooltip}</div>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">Focus: {length.focusCost}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Travel style</h4>
                    {Object.values(TRAVEL_STYLES).map(style => (
                      <button
                        key={style.id}
                        onClick={() => handleSelectStyle(style.id)}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{style.emoji}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800 mb-1">{style.label}</div>
                            <div className="text-xs text-slate-600">{style.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Who's coming?</h4>
                    {availableCompanions.map(companion => (
                      <button
                        key={companion.id}
                        onClick={() => handleSelectCompanion(companion.id)}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-green-400 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{companion.emoji}</span>
                          <div>
                            <div className="font-semibold text-slate-800 mb-1">{companion.label}</div>
                            <div className="text-xs text-slate-600">{companion.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">How do you prep?</h4>
                    {Object.values(TRAVEL_PREP_OPTIONS).map(prep => (
                      <button
                        key={prep.id}
                        onClick={() => handleSelectPrep(prep.id)}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{prep.emoji}</span>
                          <div>
                            <div className="font-semibold text-slate-800 mb-1">{prep.label}</div>
                            <div className="text-xs text-slate-600">{prep.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-slate-800">Confirm your trip</h4>
                    
                    {/* Trip Summary */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{plan.destination?.emoji}</span>
                        <div>
                          <div className="font-bold text-slate-800">{plan.destination?.name}</div>
                          <div className="text-xs text-slate-600 italic">{plan.destination?.vibe}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{TRAVEL_LENGTHS[plan.lengthId]?.emoji}</span>
                          <span className="text-slate-700">{TRAVEL_LENGTHS[plan.lengthId]?.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{TRAVEL_STYLES[plan.styleId]?.emoji}</span>
                          <span className="text-slate-700">{TRAVEL_STYLES[plan.styleId]?.label} style</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{TRAVEL_COMPANIONS[plan.companionId]?.emoji}</span>
                          <span className="text-slate-700">{TRAVEL_COMPANIONS[plan.companionId]?.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{TRAVEL_PREP_OPTIONS[plan.prepId]?.emoji}</span>
                          <span className="text-slate-700">{TRAVEL_PREP_OPTIONS[plan.prepId]?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost & Risk */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Total Cost</span>
                        <span className="text-lg font-bold text-slate-800">${formatMoney(totalCost)}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Focus Cost</span>
                        <span className="text-lg font-bold text-slate-800">{focusCost}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Trip Risk</span>
                        <span className={`text-lg font-bold ${risk.color}`}>{risk.label}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 italic">
                      💡 You can go into debt — the trip will still happen
                    </div>

                    <button
                      onClick={handleConfirm}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      Confirm Trip
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}