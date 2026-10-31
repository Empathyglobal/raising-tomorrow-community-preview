import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Plane, Home, Building } from 'lucide-react';
import { useGameState, getCountryByIso3, pickTenCountries, getCountryScale } from './GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { Button } from '@/components/ui/button';

export default function ImmigrationModal({ open, onClose, onNavigateToLifeHub }) {
  const { gameState, immigrateToCountry, updateAvailableCountries, emitActionResult } = useGameState();
  const { countryIso3, availableCountryIso3s, inventory, realEstate } = gameState;
  
  const [selectedDestIso3, setSelectedDestIso3] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  // Validation
  const ownedHome = inventory?.items?.some(i => i.uniqueGroup === "home");
  const hasProperties = realEstate?.properties?.length > 0;
  const isBlocked = ownedHome || hasProperties;

  const currentCountry = getCountryByIso3(countryIso3);
  const availableList = (availableCountryIso3s || [])
    .filter(iso => iso !== countryIso3)
    .map(iso => getCountryByIso3(iso))
    .filter(Boolean);

  const handleShuffle = () => {
    const seed = Date.now();
    const newIso3s = pickTenCountries(seed, countryIso3);
    updateAvailableCountries(newIso3s);
    setSelectedDestIso3(null); // Reset selection
  };

  const handleSelect = (iso3) => {
    if (isBlocked) return;
    setSelectedDestIso3(iso3);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedDestIso3) return;
    
    const fromCountry = getCountryByIso3(countryIso3)?.name;
    const toCountry = getCountryByIso3(selectedDestIso3)?.name;

    const result = immigrateToCountry(selectedDestIso3);
    
    if (result.ok) {
      const popup = pickMissingActionPopup("moveAbroad", "success");
      if (popup) {
        emitActionResult({
          actionId: "moveAbroad",
          title: popup.title,
          body: interpolatePopupText(popup.body, { 
            childName: gameState.childName || "your kid",
            fromCountry,
            toCountry
          }),
          deltas: null,
          moneyDelta: 0,
          focusDelta: 0,
          loveDelta: 0,
          stressDelta: 0,
          tags: popup.tags,
          meta: { emoji: popup.emoji }
        });
      }
      setConfirmOpen(false);
      onClose();
    } else {
      if (result.reason === "MUST_SELL_HOME") {
        const popup = pickMissingActionPopup("moveAbroad", "blocked");
        if (popup) {
          emitActionResult({
            actionId: "moveAbroad",
            title: popup.title,
            body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
            deltas: null,
            moneyDelta: 0,
            focusDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            tags: popup.tags,
            meta: { emoji: popup.emoji }
          });
        } else {
          alert("You must sell your home first.");
        }
      } else if (result.reason === "LANGUAGE_REQUIRED") {
        const popup = pickMissingActionPopup("moveAbroad", "blocked_language");
        if (popup) {
          emitActionResult({
            actionId: "moveAbroad",
            title: popup.title,
            body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid", toCountry, language: result.language }),
            deltas: null,
            moneyDelta: 0,
            focusDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            tags: popup.tags,
            meta: { emoji: popup.emoji }
          });
        } else {
          alert(`You can’t move to ${toCountry} yet — you must be fluent in ${result.language}.`);
        }
      } else {
        alert("Cannot move.");
      }
    }
  };

  // Reset state on open
  useEffect(() => {
    if (open) {
      setSelectedDestIso3(null);
      setConfirmOpen(false);
    }
  }, [open]);

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
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Move Abroad</h3>
                  <p className="text-sm text-slate-500">
                    Current: {currentCountry.name} (Level {currentCountry.level})
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                
                {/* Blocker Warning */}
                {isBlocked && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <h4 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4" /> Move Blocked
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      You must sell your primary home and any real estate properties before moving abroad.
                    </p>
                    <div className="flex gap-2">
                      {ownedHome && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => { onClose(); onNavigateToLifeHub?.('homeStuff'); }}
                          className="bg-white hover:bg-red-50 text-red-700 border-red-200"
                        >
                          Open Home & Stuff
                        </Button>
                      )}
                      {hasProperties && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => { onClose(); onNavigateToLifeHub?.('realEstate'); }}
                          className="bg-white hover:bg-red-50 text-red-700 border-red-200"
                        >
                          Open Real Estate
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Available Destinations
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShuffle}
                    className="text-slate-500 hover:text-indigo-600"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Shuffle
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {availableList.map((country) => {
                    const scale = getCountryScale(country.iso3);
                    const currentScale = getCountryScale(gameState.countryIso3 || "USA");
                    // Compare cost of living loosely
                    const diff = scale > currentScale ? 'Higher cost' : scale < currentScale ? 'Lower cost' : 'Similar cost';
                    
                    return (
                      <button
                        key={country.iso3}
                        onClick={() => handleSelect(country.iso3)}
                        disabled={isBlocked}
                        className={`text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                          isBlocked 
                            ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span>{country.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                              Lvl {country.level}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {diff} of living
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isBlocked ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white'
                        }`}>
                          <Plane className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Confirm Dialog */}
          {confirmOpen && selectedDestIso3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-black/60"
            >
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Move to {getCountryByIso3(selectedDestIso3)?.name}?
                </h3>
                
                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✅</span>
                    <span className="text-slate-700">
                      <strong>You keep:</strong> Family, pets, money (converted), savings, and collections.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">❌</span>
                    <span className="text-slate-700">
                      <strong>You lose:</strong> All physical items in inventory (furniture, vehicles, etc).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">⚠️</span>
                    <span className="text-slate-700">
                      <strong>Costs:</strong> Your income and expenses will adjust to the local economy immediately.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setConfirmOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Confirm Move
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}