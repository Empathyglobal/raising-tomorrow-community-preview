import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameState, formatMoney } from './GameStateContext';
import { PET_CATALOG } from './petCatalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function PetsModal({ open, onClose }) {
  const { gameState, adoptPet, usePetAction: consumePetAction, rehomePet, setActivePet, updateState, applyMoneyDelta, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const { pets = [], pet: activePet, money = 0, actionPoints = 0 } = gameState;
  const petsCount = pets.length;

  const [tab, setTab] = useState(petsCount > 0 ? 'myPets' : 'adopt');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [confirmRehome, setConfirmRehome] = useState(false);
  const [adoptConfirmOpen, setAdoptConfirmOpen] = useState(false);
  const [pendingSpecies, setPendingSpecies] = useState(null);
  const [petNameDraft, setPetNameDraft] = useState('');
  const [petNameSuggestions, setPetNameSuggestions] = useState([]);

  const totalUpkeep = pets.reduce((sum, p) => sum + (Number(p.yearlyUpkeep) || 0), 0);

  const getSpeciesEmoji = (key) => ({
    dog:'🐶', cat:'🐱', rabbit:'🐰', fish:'🐠', bird:'🦜', snake:'🐍', turtle:'🐢', hamster:'🐹', goat:'🐐', horse:'🐴', lizard:'🦎', chickens:'🐔', unicorn:'🦄', dragon:'🐉'
  }[key] || '🐾');

  const speciesByKey = (key) => PET_CATALOG.find(s => s.speciesKey === key);

  // Simple local shuffle (no external libs)
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };



  const handleAction = (p, action) => {
    const canAffordFocus = actionPoints >= (action.focusCost || 0);
    const canAffordMoney = money >= (action.moneyCost || 0);
    if (!canAffordFocus) { toast.error('Not enough Focus.'); return; }
    if (!canAffordMoney) { toast.error('Not enough money.'); return; }

    // Dragon-specific fallback: Fire Insurance must always do something
    if (action.id === 'fire_insurance') {
      const already = Boolean(p?.flags?.fireInsurancePurchased);
      if (already) {
        toast.info('Already covered.');
        return;
      }
      // Deduct cost and set flag
      const cost = Number(action.moneyCost || 0);
      if (cost > 0) applyMoneyDelta(-cost, 'Dragon Fire Insurance');
      updateState((prev) => {
        const pets = (prev.pets || []).map((pet) => {
          if (pet.id !== p.id) return pet;
          const flags = { ...(pet.flags || {}), fireInsurancePurchased: true, fireInsurancePurchasedAtAge: prev.currentYear };
          return { ...pet, flags };
        });
        return { pets };
      });
      addLog('🧯 Dragon fire insurance purchased.');
      recordTimelineEntry({
        kind: 'pet',
        title: '🧯 Fireproof Insurance',
        detail: `${p.name} is now covered against… inevitable incidents.`,
        deltas: null,
        moneyDelta: -(action.moneyCost || 0),
        loveDelta: 0,
        stressDelta: -2
      });

      const fireInsuranceLines = [
        "Insurance renewed. {name} looks offended you'd even suggest they might set something on fire.",
        "Paperwork complete. The dragon is covered. The furniture sighs in relief.",
        "Fire insurance renewed. Your home is now officially 'less doomed.'"
      ];
      const bodyLine = fireInsuranceLines[Math.floor(Math.random() * fireInsuranceLines.length)].replaceAll('{name}', p.name);
      
      emitActionResult({
        actionId: 'pet:fire_insurance',
        title: `${action.emoji || '🧯'} ${action.name}`,
        body: bodyLine,
        deltas: null,
        moneyDelta: -Number(action.moneyCost || 0),
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: -2,
        tags: ['pet'],
        meta: { emoji: action.emoji || '🧯', skipTimelineRecord: true }
      });
      toast.success('Fire insurance purchased!');
      return;
    }

    const ok = consumePetAction(p.id, action);
    if (!ok) {
      toast.error("That didn’t work. Please try again.");
    }
  };

  const handleOpenAdoptConfirm = (species) => {
    if (!species) return;
    const minCost = species.upfrontCostRange?.[0] || 0;
    if (money < minCost) {
      toast.error(`Not enough money (need $${formatMoney(minCost)})`);
      return;
    }
    
    setPendingSpecies(species);
    setPetNameDraft('');
    const names = Array.isArray(species.names) ? species.names : [];
    setPetNameSuggestions(shuffleArray(names).slice(0, 6));
    setAdoptConfirmOpen(true);
  };

  const handleConfirmAdopt = () => {
    if (!pendingSpecies) return;
    const minCost = pendingSpecies.upfrontCostRange?.[0] || 0;
    if (money < minCost) return;
    
    const name = petNameDraft.trim();
    if (!name) {
      toast.error('Please enter a name for your pet.');
      return;
    }
    
    adoptPet(pendingSpecies.speciesKey, name);
    
    toast.success(`Adopted ${name}!`);
    
    setAdoptConfirmOpen(false);
    setPendingSpecies(null);
    setPetNameDraft('');
    setPetNameSuggestions([]);
    setSelectedSpecies(null);
    setTab('myPets');
  };

  const handleRehomeActive = () => {
    if (!activePet) return;
    const willHaveNone = petsCount <= 1;
    rehomePet(activePet.id);
    toast.success('Rehomed pet.');
    setConfirmRehome(false);
    if (willHaveNone) setTab('adopt');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 w-screen h-[100dvh] z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-[420px] sm:max-w-lg md:max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[calc(100dvh-32px)] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-800">🐾 Pets</h2>
                  <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Pets: {petsCount} • Money: ${formatMoney(money)} • Focus: {actionPoints}
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 py-3 border-b border-slate-100 bg-white">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTab('myPets')}
                    className={`text-xs px-3 py-1.5 rounded-md transition-colors flex items-center ${tab==='myPets' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    My Pets
                    <span className="ml-2 text-[10px] bg-white/20 rounded px-1.5 py-0.5">{petsCount}</span>
                  </button>
                  <button
                    onClick={() => setTab('adopt')}
                    className={`text-xs px-3 py-1.5 rounded-md transition-colors ${tab==='adopt' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    Adopt
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                {tab === 'myPets' ? (
                  petsCount === 0 ? (
                    <div className="border border-slate-200 rounded-xl p-8 text-center bg-slate-50">
                      <div className="text-5xl mb-2">🐾</div>
                      <div className="font-semibold text-slate-800">No pets yet.</div>
                      <div className="text-xs text-slate-600 mt-1">Adopt a companion for small, steady SEL growth (and small, steady bills).</div>
                      <div className="mt-4">
                        <button onClick={() => setTab('adopt')} className="text-xs px-3 py-1.5 rounded-md bg-slate-900 text-white">
                          Browse Adoption
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-[280px_1fr] gap-4">
                      {/* Left: Your Pets list */}
                      <div>
                        <div className="border border-slate-200 rounded-xl p-3 mb-2 bg-white">
                          <div className="text-xs text-slate-600">Total yearly upkeep:</div>
                          <div className="text-sm font-semibold text-slate-800">${formatMoney(totalUpkeep)}/yr</div>
                          <div className="text-[10px] text-slate-500">Upkeep is charged yearly per pet.</div>
                        </div>
                        <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
                          {pets.map((p) => {
                            const species = speciesByKey(p.speciesKey);
                            const isActive = activePet?.id === p.id;
                            return (
                              <button
                                key={p.id}
                                onClick={() => setActivePet(p.id)}
                                className={`w-full text-left p-3 rounded-lg border flex items-center justify-between ${isActive ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">{getSpeciesEmoji(p.speciesKey)}</div>
                                  <div>
                                    <div className="font-semibold text-slate-800">{p.name}</div>
                                    <div className="text-xs text-slate-600">{species?.displayName} • Age {p.petAgeYears}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-slate-600">${formatMoney(p.yearlyUpkeep)}/yr</div>
                                  {isActive && (
                                    <div className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3">
                          <button onClick={() => setTab('adopt')} className="text-xs w-full border border-slate-200 rounded-md py-2 hover:bg-slate-50">Adopt another pet</button>
                        </div>
                      </div>

                      {/* Right: Active pet detail */}
                      <div>
                        {activePet ? (
                          !confirmRehome ? (
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                              <div className="text-6xl mb-4">{getSpeciesEmoji(activePet.speciesKey)}</div>
                              <h3 className="text-2xl font-bold text-slate-800 mb-1">{activePet.name}</h3>
                              <p className="text-slate-500 font-medium uppercase tracking-wide text-xs mb-4">
                                {speciesByKey(activePet.speciesKey)?.displayName} • Age {activePet.petAgeYears}
                              </p>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-6">
                                <div className="bg-white px-3 py-1 rounded-lg border border-slate-200">Upkeep: ${formatMoney(activePet.yearlyUpkeep)}/yr</div>
                                <div className="bg-white px-3 py-1 rounded-lg border border-slate-200">Theme: {speciesByKey(activePet.speciesKey)?.selTheme}</div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                {(speciesByKey(activePet.speciesKey)?.actions || []).map((action) => {
                                  const canAffordFocus = actionPoints >= (action.focusCost || 0);
                                  const canAffordMoney = money >= (action.moneyCost || 0);
                                  const isCovered = action.id === 'fire_insurance' && Boolean(activePet?.flags?.fireInsurancePurchased);
                                  const isAffordable = canAffordFocus && canAffordMoney && !isCovered;
                                  return (
                                    <button
                                      key={action.id}
                                      onClick={() => handleAction(activePet, action)}
                                      disabled={!isAffordable}
                                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${isAffordable ? 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95' : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'}`}
                                    >
                                      <div className="text-3xl mb-2">{action.emoji}</div>
                                      <div className="font-bold text-slate-700 text-sm mb-1">{action.name}</div>
                                      <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                                        {isCovered ? 'Covered' : (
                                          <>
                                            {action.moneyCost > 0 && `$${formatMoney(action.moneyCost)}`}
                                            {action.moneyCost > 0 && action.focusCost > 0 && ' • '}
                                            {action.focusCost > 0 && `${action.focusCost} Focus`}
                                            {action.moneyCost === 0 && action.focusCost === 0 && 'Free'}
                                          </>
                                        )}
                                      </div>
                                      {!isAffordable && !isCovered && !canAffordMoney && action.moneyCost > 0 && (
                                        <div className="mt-1 text-[11px] text-red-600">
                                          Need ${formatMoney(Math.max(0, (action.moneyCost || 0) - money))} more
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="flex justify-center">
                                <Button variant="ghost" onClick={() => setConfirmRehome(true)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">Rehome this pet</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-4 border border-slate-200 rounded-xl p-6 bg-white">
                              <h3 className="text-xl font-bold text-slate-800">Rehome {activePet.name}?</h3>
                              <p className="text-slate-600">Sometimes the kindest choice is finding a home that can give consistent care. It still hurts.</p>
                              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-500">
                                Effects: Stress +1, Confidence -0.2, Empathy +0.1
                                {money >= 50 && <div>Admin Fee: $50</div>}
                              </div>
                              <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setConfirmRehome(false)} className="flex-1">Cancel</Button>
                                <Button onClick={handleRehomeActive} className="flex-1 bg-red-500 hover:bg-red-600 text-white">Rehome</Button>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="border border-slate-200 rounded-xl p-6 text-center bg-white">
                            <div className="text-sm text-slate-600">Select a pet from the list.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  // Adopt view
                  <div className="grid md:grid-cols-[1fr_340px] gap-4">
                    {/* Left: Species list */}
                    <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
                      {PET_CATALOG.map(species => {
                        const isSelected = selectedSpecies?.speciesKey === species.speciesKey;
                        return (
                          <button
                            key={species.speciesKey}
                            onClick={() => setSelectedSpecies(species)}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left group w-full ${isSelected ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
                          >
                            <div className="text-3xl bg-slate-100 w-12 h-12 flex items-center justify-center rounded-full group-hover:bg-white transition-colors">
                              {getSpeciesEmoji(species.speciesKey)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-slate-800">{species.displayName}</h4>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  ${formatMoney(species.upfrontCostRange[0])}-{formatMoney(species.upfrontCostRange[1])}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mb-1">{species.selTheme}</p>
                              <p className="text-xs text-slate-400 italic line-clamp-1">{species.vibeLine}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right: Info panel */}
                    <div>
                      {!selectedSpecies ? (
                        <div className="border border-slate-200 rounded-xl p-5 bg-white">
                          <div className="font-semibold text-slate-800 mb-1">You can own multiple pets.</div>
                          <div className="text-xs text-slate-600">Upfront cost is paid now. Yearly upkeep is charged per pet.</div>
                          {petsCount > 0 && (
                            <div className="mt-3 text-xs text-slate-600">
                              Current total upkeep: <span className="font-semibold">${formatMoney(totalUpkeep)}/yr</span>
                              <div className="text-[10px] text-slate-500">Tip: more pets = more upkeep.</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4 border border-slate-200 rounded-xl p-6 bg-white">
                          <div className="text-center">
                            <div className="text-6xl mb-4">{getSpeciesEmoji(selectedSpecies.speciesKey)}</div>
                            <h3 className="text-2xl font-bold text-slate-800">{selectedSpecies.displayName}</h3>
                            <p className="text-slate-500 mt-2">{selectedSpecies.vibeLine}</p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm border border-slate-100">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Upfront Cost:</span>
                              <span className="font-medium">${formatMoney(selectedSpecies.upfrontCostRange[0])} - ${formatMoney(selectedSpecies.upfrontCostRange[1])}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Yearly Upkeep:</span>
                              <span className="font-medium">${formatMoney(selectedSpecies.yearlyUpkeepRange[0])} - ${formatMoney(selectedSpecies.yearlyUpkeepRange[1])}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Lifespan:</span>
                              <span className="font-medium">{selectedSpecies.lifespanRangeYears[0]} - {selectedSpecies.lifespanRangeYears[1]} years</span>
                            </div>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-amber-800">
                            Click Adopt to name and confirm.
                          </div>
                          {money < (selectedSpecies.upfrontCostRange?.[0] || 0) && (
                            <div className="text-xs text-red-600">
                              Need ${formatMoney(Math.max(0, (selectedSpecies.upfrontCostRange?.[0] || 0) - money))} more to adopt (min ${formatMoney(selectedSpecies.upfrontCostRange[0])}).
                            </div>
                          )}
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setSelectedSpecies(null)} className="flex-1">Back</Button>
                            <Button 
                              onClick={() => handleOpenAdoptConfirm(selectedSpecies)} 
                              disabled={money < (selectedSpecies.upfrontCostRange?.[0] || 0)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Adopt
                            </Button>
                          </div>
                          <div className="text-[11px] text-slate-500 text-center">
                            or <button className="underline" onClick={() => setTab('myPets')}>Go to My Pets</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Adoption Confirmation Modal */}
          {adoptConfirmOpen && pendingSpecies && (
            <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAdoptConfirmOpen(false)}>
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b flex items-center justify-between">
                  <div className="font-semibold text-slate-900">Adopt a {pendingSpecies.displayName}</div>
                  <button className="text-slate-500 hover:text-slate-800" onClick={() => setAdoptConfirmOpen(false)}>✕</button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Preview */}
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{getSpeciesEmoji(pendingSpecies.speciesKey)}</div>
                    <div className="text-sm text-slate-600">
                      <div>Cost: ${formatMoney(pendingSpecies.upfrontCostRange[0])}-${formatMoney(pendingSpecies.upfrontCostRange[1])}</div>
                      <div>Lifespan: ~{pendingSpecies.lifespanRangeYears[0]}-{pendingSpecies.lifespanRangeYears[1]} years</div>
                    </div>
                  </div>

                  {/* Name input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Pet name</label>
                    <Input
                      className="w-full"
                      placeholder="e.g., Goober"
                      value={petNameDraft}
                      onChange={(e) => setPetNameDraft(e.target.value)}
                      autoFocus
                    />
                    <div className="flex flex-wrap gap-2">
                      {petNameSuggestions.map(s => (
                        <button 
                          key={s} 
                          className="text-xs px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                          onClick={() => setPetNameDraft(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t bg-white flex gap-3 justify-end pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
                  <button 
                    className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50" 
                    onClick={() => setAdoptConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                    disabled={!petNameDraft.trim()}
                    onClick={handleConfirmAdopt}
                  >
                    Confirm Adopt
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}