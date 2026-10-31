import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameModalShell from './GameModalShell';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney, getCountryScale, localizeAmount } from './GameStateContext';
import { getHousingChoicesForUi, getCommuteChoicesForUi, DEFAULT_LIVING_SETUP, resolveHousingForState, resolveCommuteForState, FOOD_STRATEGIES, getFoodStrategyById, FOOD_COSTS_BASE } from './livingConfig';
import { QOL_SUBSCRIPTIONS, QOL_TIER_DEFS, getTierOption, isSubscriptionValidForAge } from './qualityOfLifeConfig';
import RoomModal from './RoomModal';
import HomeStuffModal from './HomeStuffModal';

export default function QualityOfLifeModal({ open, onClose, initialTab = 'home' }) {
  const { gameState, updateState } = useGameState();
  const [draftHousingId, setDraftHousingId] = useState(null);
  const [draftCommuteId, setDraftCommuteId] = useState(null);
  const [draftFoodStrategyId, setDraftFoodStrategyId] = useState('standard');
  const [draftCommitments, setDraftCommitments] = useState({});
  const [draftQol, setDraftQol] = useState({ internetTier: 'basic', homeOfficeTier: 'none', clothingTier: 'mall' });
  const [myHomeOpen, setMyHomeOpen] = useState(false);
  const [myStuffOpen, setMyStuffOpen] = useState(false);

  const activeSection = initialTab || 'home';

  // Initialize drafts when modal opens
  useEffect(() => {
    if (open) {
      const setup = gameState.livingSetup || DEFAULT_LIVING_SETUP;
      setDraftHousingId(setup.housingId || DEFAULT_LIVING_SETUP.housingId);
      setDraftCommuteId(setup.commuteId || DEFAULT_LIVING_SETUP.commuteId);
      setDraftFoodStrategyId(setup.foodStrategyId || DEFAULT_LIVING_SETUP.foodStrategyId);
      setDraftCommitments({ ...(gameState.commitments || {}) });
      setDraftQol({ ...(gameState.qol || { internetTier: 'basic', homeOfficeTier: 'none', clothingTier: 'mall' }) });
    }
  }, [open, gameState.livingSetup, gameState.commitments, gameState.qol, initialTab]);

  if (!open) return null;

  const scale = getCountryScale(gameState.countryIso3 || 'USA');
  const nextAge = (gameState.currentYear || 0) + 1;
  const housingChoices = getHousingChoicesForUi(gameState);
  const commuteChoices = getCommuteChoicesForUi(gameState);

  const handleSave = () => {
    const extras = draftHousingId === 'owned_home' ? { ftueSetOwnedHousing: true } : {};
    
    updateState(prev => ({
      ...prev,
      livingSetup: {
        ...(prev.livingSetup || {}),
        housingId: draftHousingId,
        commuteId: draftCommuteId,
        foodStrategyId: draftFoodStrategyId
      },
      commitments: draftCommitments,
      qol: draftQol,
      ...extras
    }));
    onClose?.();
  };

  // Helper: compute yearly cost for a selection
  const computeYearlyCostForSelection = (selection, state) => {
    let total = 0;
    
    // Food
    const foodStrat = getFoodStrategyById(selection.foodStrategyId || 'standard');
    const adultCount = (state.householdType === 'two') ? 2 : 1;
    const kidsArr = Array.isArray(state.kids) ? state.kids : [];
    const kidCount = Math.max(1, kidsArr.length || 1);
    let infantCount = 0;
    if (kidsArr.length > 0) {
      infantCount = kidsArr.filter(k => {
        const kidAge = nextAge - (k.createdAtYear ?? 0);
        return kidAge >= 0 && kidAge <= 2;
      }).length;
    } else {
      infantCount = (nextAge <= 2) ? 1 : 0;
    }
    const foodBaseRaw = adultCount * FOOD_COSTS_BASE.adult + kidCount * FOOD_COSTS_BASE.child + infantCount * FOOD_COSTS_BASE.infantAddon;
    const foodBase = Math.round(foodBaseRaw * (Number(foodStrat.costMult) || 1));
    total += localizeAmount(foodBase, scale);
    
    // Housing
    const housingResolved = resolveHousingForState(state, selection.housingId);
    if (housingResolved?.yearlyCostBase !== undefined) {
      total += localizeAmount(housingResolved.yearlyCostBase, scale);
    }
    
    // Commute
    const commuteResolved = resolveCommuteForState(state, selection.commuteId);
    if (commuteResolved?.yearlyCostBase !== undefined) {
      total += localizeAmount(commuteResolved.yearlyCostBase, scale);
    }
    
    // Subscriptions
    for (const [id, enabled] of Object.entries(selection.commitments || {})) {
      if (!enabled) continue;
      const def = QOL_SUBSCRIPTIONS[id];
      if (!def) continue;
      if (!isSubscriptionValidForAge(def, nextAge, state)) continue;
      total += localizeAmount(def.cost, scale);
    }
    
    // Tiers
    const internetTier = getTierOption(QOL_TIER_DEFS.internet, selection.qol?.internetTier || 'basic');
    const homeOfficeTier = getTierOption(QOL_TIER_DEFS.homeOffice, selection.qol?.homeOfficeTier || 'none');
    const clothingTier = getTierOption(QOL_TIER_DEFS.clothing, selection.qol?.clothingTier || 'mall');
    total += localizeAmount(internetTier.yearlyCostBase, scale);
    total += localizeAmount(homeOfficeTier.yearlyCostBase, scale);
    total += localizeAmount(clothingTier.yearlyCostBase, scale);
    
    return total;
  };
  
  // Compute cost delta (can be negative)
  const computeCostDelta = () => {
    const currentSelection = {
      housingId: gameState.livingSetup?.housingId || DEFAULT_LIVING_SETUP.housingId,
      commuteId: gameState.livingSetup?.commuteId || DEFAULT_LIVING_SETUP.commuteId,
      foodStrategyId: gameState.livingSetup?.foodStrategyId || DEFAULT_LIVING_SETUP.foodStrategyId,
      commitments: gameState.commitments || {},
      qol: gameState.qol || { internetTier: 'basic', homeOfficeTier: 'none' }
    };
    
    const draftSelection = {
      housingId: draftHousingId,
      commuteId: draftCommuteId,
      foodStrategyId: draftFoodStrategyId,
      commitments: draftCommitments,
      qol: draftQol
    };
    
    const currentCost = computeYearlyCostForSelection(currentSelection, gameState);
    const draftCost = computeYearlyCostForSelection(draftSelection, gameState);
    
    return draftCost - currentCost;
  };

  const costDelta = computeCostDelta();

  const sectionTitles = {
    home: '🏠 Housing',
    transport: '🚗 Transportation',
    food: '🍽️ Food Strategy',
    internet: '📶 Internet',
    homeoffice: '💻 Home Office',
    subscriptions: '✨ Subscriptions'
  };

  const modalTitle = sectionTitles[activeSection] || '✨ Quality of Life';
  
  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title={modalTitle}
      className="max-w-3xl"
      bodyClassName="p-0 overflow-hidden"
    >
      <div className="w-full flex flex-col h-full min-h-0">
        {/* Scrollable Content */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-6 space-y-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            💡 Changes affect next age's Focus and living costs.
          </div>

          {/* Housing Section */}
          {activeSection === 'home' && (
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">🏠 Housing</h3>
            
            {/* Quick Links */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMyHomeOpen(true)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
              >
                🏡 My Home
              </button>
              <button
                onClick={() => setMyStuffOpen(true)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
              >
                📦 My Stuff
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {housingChoices.map((option) => {
                   const costLocal = localizeAmount(option.yearlyCostBase, scale);
                   const focusText = option.focusMod > 0 ? `+${option.focusMod}` : option.focusMod < 0 ? `${option.focusMod}` : '0';
                   const isSelected = draftHousingId === option.id;
                   const isLocked = !!option.locked;

                   return (
                     <motion.button
                       key={option.id}
                       type="button"
                       data-tour={option.id === 'owned_home' ? 'qol-housing-owned-home' : undefined}
                       whileHover={!isLocked ? { scale: 1.02 } : {}}
                       whileTap={!isLocked ? { scale: 0.98 } : {}}
                       onClick={() => {
                         if (isLocked) return;
                         setDraftHousingId(option.id);
                       }}
                       disabled={isLocked}
                       className={`text-left p-4 rounded-xl border-2 transition-all ${
                         isLocked
                           ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                           : isSelected
                             ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300'
                             : 'border-slate-200 bg-white hover:border-indigo-300'
                       }`}
                     >
                       <div className="flex items-center gap-3 mb-2">
                         <span className="text-3xl">{option.emoji}</span>
                         <div className="font-bold text-slate-800 text-sm">{option.label}</div>
                       </div>
                       <div className="text-xs text-slate-600 space-y-1">
                         <div>Cost/year: {isLocked ? 'Locked' : `$${formatMoney(costLocal)}`}</div>
                         <div>Focus: {focusText}</div>
                         {option.stressDrift && (
                           <div>Stress: {option.stressDrift > 0 ? '+' : ''}{option.stressDrift}/yr</div>
                         )}
                         <div className="text-slate-500 italic mt-1">{option.note}</div>
                         {isLocked && option.lockedReason && (
                           <div className="text-rose-600 text-xs mt-2">{option.lockedReason}</div>
                         )}
                       </div>
                     </motion.button>
                   );
                 })}
            </div>
          </div>
          )}

          {/* Transportation Section */}
          {activeSection === 'transport' && (
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">🚗 Transportation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {commuteChoices.map((option) => {
                   const costLocal = localizeAmount(option.yearlyCostBase, scale);
                   const focusText = option.focusMod > 0 ? `+${option.focusMod}` : option.focusMod < 0 ? `${option.focusMod}` : '0';
                   const isSelected = draftCommuteId === option.id;
                   const isLocked = !!option.locked;
                   const isMountOrVehicle = ['horse_mount', 'unicorn_mount', 'dragon_mount', 'car', 'motorcycle'].includes(option.id);

                   return (
                     <motion.button
                       key={option.id}
                       type="button"
                       whileHover={!isLocked ? { scale: 1.02 } : {}}
                       whileTap={!isLocked ? { scale: 0.98 } : {}}
                       onClick={() => {
                         if (isLocked) return;
                         setDraftCommuteId(option.id);
                       }}
                       disabled={isLocked}
                       className={`text-left p-4 rounded-xl border-2 transition-all ${
                         isLocked
                           ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                           : isSelected
                             ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300'
                             : 'border-slate-200 bg-white hover:border-indigo-300'
                       } ${isMountOrVehicle && !isLocked ? 'bg-gradient-to-br from-amber-50 to-yellow-50' : ''}`}
                     >
                       <div className="flex items-center gap-3 mb-2">
                         <span className="text-3xl">{option.emoji}</span>
                         <div className="font-bold text-slate-800 text-sm">{option.label}</div>
                       </div>
                       <div className="text-xs text-slate-600 space-y-1">
                         <div>Cost/year: {isLocked ? 'Locked' : `$${formatMoney(costLocal)}`}</div>
                         <div>Focus: {focusText}</div>
                         {option.fameDeltaPerAge && option.fameDeltaPerAge > 0 && (
                           <div className="text-amber-700 font-semibold">
                             ⭐ Fame: +{option.fameDeltaPerAge}/year
                           </div>
                         )}
                         {option.playerHealthDrift && (
                           <div>Health: {option.playerHealthDrift > 0 ? '+' : ''}{option.playerHealthDrift}/yr</div>
                         )}
                         <div className="text-slate-500 italic mt-1">{option.note}</div>
                         {isLocked && option.lockedReason && (
                           <div className="text-rose-600 text-xs mt-2">{option.lockedReason}</div>
                         )}
                       </div>
                     </motion.button>
                   );
                 })}
            </div>
          </div>
          )}

          {/* Food Section */}
          {activeSection === 'food' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-lg text-slate-800">🍽️ Food Strategy</h3>
              {(gameState.currentYear || 0) === 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  Optional
                </span>
              )}
            </div>
            {(gameState.currentYear || 0) === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 text-xs text-blue-800">
                ℹ️ You can adjust this later; default is Standard.
              </div>
            )}
            
            {/* Warning callout for extreme options */}
            {(draftFoodStrategyId === 'food_bank_heavy' || draftFoodStrategyId === 'survival_mode_food') && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-900">
                ⚠️ This saves a lot of money but may reduce Health and Happiness over time.
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOOD_STRATEGIES.map((option) => {
                  const isSelected = draftFoodStrategyId === option.id;
                  const costMultPct = Math.round(option.costMult * 100);
                  const focusText = option.focusMod > 0 ? `+${option.focusMod}` : option.focusMod < 0 ? `${option.focusMod}` : '0';
                  
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDraftFoodStrategyId(option.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{option.emoji}</span>
                        <div className="font-bold text-slate-800 text-sm">{option.label}</div>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>Food cost: {costMultPct}% of baseline</div>
                        {option.focusMod !== 0 && <div>Focus: {focusText}</div>}
                        {option.stressDrift !== 0 && <div>Stress: {option.stressDrift > 0 ? '+' : ''}{option.stressDrift}/yr</div>}
                        {option.playerHealthDrift !== 0 && <div>Health: {option.playerHealthDrift > 0 ? '+' : ''}{option.playerHealthDrift}/yr</div>}
                        <div className="text-slate-500 italic mt-1">{option.note}</div>
                      </div>
                    </motion.button>
                  );
                })}
            </div>
          </div>
          )}

          {/* Internet Tier */}
          {activeSection === 'internet' && (
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">🌐 Internet</h3>
            <div className="grid grid-cols-1 gap-3">
                  {QOL_TIER_DEFS.internet.options.map((option) => {
                    const costLocal = localizeAmount(option.yearlyCostBase, scale);
                    const isSelected = draftQol.internetTier === option.id;
                    
                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setDraftQol(prev => ({ ...prev, internetTier: option.id }))}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <div className="flex-1">
                            <div className="font-bold text-slate-800 text-sm mb-1">{option.label}</div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div>Cost/year: ${formatMoney(costLocal)}</div>
                              {option.focusMod !== 0 && <div>Focus: {option.focusMod > 0 ? '+' : ''}{option.focusMod} next age</div>}
                              {option.stressDrift !== 0 && <div>Stress: {option.stressDrift > 0 ? '+' : ''}{option.stressDrift}/yr</div>}
                              {option.fameDeltaPerAge > 0 && <div className="text-amber-700 font-semibold">⭐ Fame: +{option.fameDeltaPerAge}/yr</div>}
                              <div className="text-slate-500 italic mt-1">{option.note}</div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
              })}
            </div>
          </div>
          )}

          {/* Home Office Tier */}
          {activeSection === 'homeoffice' && (
          <div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">💻 Home Office</h3>
            <div className="grid grid-cols-1 gap-3">
                  {QOL_TIER_DEFS.homeOffice.options.map((option) => {
                    const costLocal = localizeAmount(option.yearlyCostBase, scale);
                    const isSelected = draftQol.homeOfficeTier === option.id;
                    
                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setDraftQol(prev => ({ ...prev, homeOfficeTier: option.id }))}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{option.emoji}</span>
                          <div className="flex-1">
                            <div className="font-bold text-slate-800 text-sm mb-1">{option.label}</div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <div>Cost/year: ${formatMoney(costLocal)}</div>
                              {option.focusMod !== 0 && <div>Focus: {option.focusMod > 0 ? '+' : ''}{option.focusMod} next age</div>}
                              {option.stressDrift !== 0 && <div>Stress: {option.stressDrift > 0 ? '+' : ''}{option.stressDrift}/yr</div>}
                              <div className="text-slate-500 italic mt-1">{option.note}</div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
              })}
            </div>
          </div>
          )}

          {/* Subscriptions Section */}
          {activeSection === 'subscriptions' && (
          <div>
            {/* Subscriptions grouped by category */}
            {[
                { key: 'childcare', label: 'Childcare', items: ['nanny', 'afterSchoolCare'] },
                { key: 'home', label: 'Home Services', items: ['cleaningHelp', 'laundryService', 'homeSecurity'] },
                { key: 'homeHealth', label: 'Home Health', items: ['plasticFreeHome', 'nonToxicKitchen', 'waterFilter', 'airPurifiers', 'fragranceFree'] },
                { key: 'food', label: 'Food Convenience', items: ['mealKits', 'groceryDelivery'] },
                { key: 'health', label: 'Mind & Body', items: ['therapyMembership', 'gymMembership'] },
                { key: 'fun', label: 'Fun', items: ['streamingBundle'] }
              ].map(group => {
                const defs = group.items.map(id => QOL_SUBSCRIPTIONS[id]).filter(Boolean);
                if (defs.length === 0) return null;

                return (
                  <div key={group.key}>
                    <h3 className="font-bold text-lg text-slate-800 mb-3">{group.label}</h3>
                    <div className="space-y-3">
                      {defs.map(def => {
                        const isEnabled = !!draftCommitments[def.id];
                        const isValidNextAge = isSubscriptionValidForAge(def, nextAge, gameState);
                        const costLocal = localizeAmount(def.cost, scale);
                        
                        let disabledReason = null;
                        if (!isValidNextAge) {
                          if (typeof def.minChildAge === 'number' && nextAge < def.minChildAge) {
                            disabledReason = `Available ages ${def.minChildAge}+ • Next age: ${nextAge}`;
                          } else if (typeof def.maxChildAge === 'number' && nextAge > def.maxChildAge) {
                            disabledReason = `Available ages ${def.minChildAge || 0}–${def.maxChildAge} • Next age: ${nextAge}`;
                          }
                        }

                        return (
                          <motion.button
                            key={def.id}
                            type="button"
                            whileHover={!disabledReason ? { scale: 1.01 } : {}}
                            whileTap={!disabledReason ? { scale: 0.99 } : {}}
                            onClick={() => {
                              if (disabledReason) return;
                              setDraftCommitments(prev => ({ ...prev, [def.id]: !prev[def.id] }));
                            }}
                            disabled={!!disabledReason}
                            className={`text-left p-4 rounded-xl border-2 transition-all w-full ${
                              disabledReason
                                ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                                : isEnabled
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{def.emoji}</span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-bold text-slate-800 text-sm">{def.label}</div>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    isEnabled ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                                  }`}>
                                    {isEnabled && <span className="text-white text-xs">✓</span>}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-600 space-y-1">
                                  <div className="font-semibold">Cost/year: ${formatMoney(costLocal)}</div>
                                  {def.focusMod !== 0 && <div>Focus: {def.focusMod > 0 ? '+' : ''}{def.focusMod} next age</div>}
                                  {def.stressDrift && <div>Stress: {def.stressDrift > 0 ? '+' : ''}{def.stressDrift}/yr</div>}
                                  {def.playerHealthDrift && <div>Health: {def.playerHealthDrift > 0 ? '+' : ''}{def.playerHealthDrift}/yr</div>}
                                  {def.loveDelta && <div>Love: {def.loveDelta > 0 ? '+' : ''}{def.loveDelta}/yr</div>}
                                  {def.fameDeltaPerAge > 0 && <div className="text-amber-700">⭐ Fame: +{def.fameDeltaPerAge}/yr</div>}
                                  <div className="text-slate-500 italic mt-1">{def.detail}</div>
                                  {disabledReason && (
                                    <div className="text-rose-600 text-xs mt-2">{disabledReason}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm flex-1">
              <div className="font-semibold text-slate-800">Projected total recurring cost next age</div>
              <div className={`text-lg font-bold ${
                costDelta > 0 ? 'text-rose-600' : costDelta < 0 ? 'text-emerald-600' : 'text-slate-600'
              }`}>
                ${formatMoney(computeYearlyCostForSelection({
                  housingId: draftHousingId,
                  commuteId: draftCommuteId,
                  foodStrategyId: draftFoodStrategyId,
                  commitments: draftCommitments,
                  qol: draftQol
                }, gameState))} / year
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Change: {costDelta > 0 ? '+' : costDelta < 0 ? '-' : ''}${formatMoney(Math.abs(costDelta))}
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} type="button" className="flex-1 sm:flex-initial">
                Cancel
              </Button>
              <Button data-tour="qol-save" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 flex-1 sm:flex-initial" type="button">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Children */}
      <RoomModal open={myHomeOpen} onClose={() => setMyHomeOpen(false)} />
      <HomeStuffModal open={myStuffOpen} onClose={() => setMyStuffOpen(false)} />
    </GameModalShell>
  );
}