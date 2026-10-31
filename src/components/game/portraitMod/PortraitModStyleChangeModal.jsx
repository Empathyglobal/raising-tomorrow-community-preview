import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/components/game/GameStateContext';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { ADULT_STYLE_KEYS, STYLE_LABELS } from './portraitModCatalog';
import { resolvePortraitModSheetUrl } from './portraitMod';
import { toast } from 'sonner';

export default function PortraitModStyleChangeModal({ open, onClose }) {
  const { gameState, mods, updateState, applyMoneyDelta } = useGameState();
  const [selectedKey, setSelectedKey] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  
  const cost = 500;
  const canAfford = gameState.money >= cost;
  
  const parentAge = Number(gameState.parentAgeAtBirth ?? 28) + Number(gameState.currentYear ?? 0);
  const parentGender = gameState.parentAvatarGender || 'male';
  const parentIndex = Number.isFinite(Number(gameState.parentAvatarSpriteIndex))
    ? Number(gameState.parentAvatarSpriteIndex)
    : 0;
  
  const currentStyleKey = gameState.portraitModState?.parentAdultStyleKey || 'adult_base1';
  
  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedKey(currentStyleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, currentStyleKey]);
  
  // Preload images when modal opens
  useEffect(() => {
    if (!open || !mods?.portrait?.enabled) return;
    
    ADULT_STYLE_KEYS.forEach(key => {
      if (loadedImages[key] !== undefined) return;
      if (loadingStates[key]) return;
      
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      
      const url = resolvePortraitModSheetUrl({
        genderKey: parentGender,
        setKey: key,
        manifest: mods.portrait.manifest
      });
      
      if (!url) {
        setLoadedImages(prev => ({ ...prev, [key]: 'missing' }));
        setLoadingStates(prev => ({ ...prev, [key]: false }));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [key]: 'loaded' }));
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      };
      img.onerror = () => {
        setLoadedImages(prev => ({ ...prev, [key]: 'missing' }));
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      };
      img.src = url;
    });
  }, [open, mods?.portrait?.enabled, parentGender, loadedImages, loadingStates]);
  
  const handlePurchase = () => {
    if (!canAfford) {
      toast.error('Not enough money');
      return;
    }
    
    if (selectedKey === currentStyleKey) {
      toast('Already using this style');
      return;
    }
    
    const label = STYLE_LABELS[selectedKey];
    if (!label) return;
    
    // Check if image is loaded
    const imageState = loadedImages[selectedKey];
    if (imageState === 'missing') {
      toast.error('This style is not available yet');
      return;
    }
    
    // Apply cost
    applyMoneyDelta(-cost, `Portrait Mod: ${label.label}`, { category: 'shopping' });
    
    // Update style
    updateState(prev => ({
      portraitModState: {
        ...(prev.portraitModState || {}),
        parentAdultStyleKey: selectedKey
      }
    }));
    
    toast.success(`Style changed to ${label.label}`);
    onClose();
  };
  
  if (!mods?.portrait?.enabled) {
    return null;
  }
  
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
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">💇 Change Your Style</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-700 mb-4">Choose a style:</div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ADULT_STYLE_KEYS.map(key => {
                      const label = STYLE_LABELS[key];
                      if (!label) return null;
                      
                      const isSelected = selectedKey === key;
                      const isCurrent = currentStyleKey === key;
                      const imageState = loadedImages[key];
                      const isLoading = loadingStates[key];
                      const isMissing = imageState === 'missing';
                      
                      const url = resolvePortraitModSheetUrl({
                        genderKey: parentGender,
                        setKey: key,
                        manifest: mods.portrait.manifest
                      });
                      
                      return (
                        <button
                          key={key}
                          onClick={() => !isMissing && setSelectedKey(key)}
                          disabled={isMissing}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'ring-2 ring-amber-400 shadow border-amber-300'
                              : isMissing
                                ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                : 'border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                              {isLoading ? (
                                <div className="text-2xl">⏳</div>
                              ) : (
                                <PlayerSpriteAvatar
                                  genderKey={parentGender}
                                  ageNumber={parentAge}
                                  index={parentIndex}
                                  size={80}
                                  sheetUrlOverride={url}
                                />
                              )}
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-slate-800 text-sm">
                                {label.emoji} {label.label}
                              </div>
                              <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {label.description}
                              </div>
                              {isCurrent && (
                                <div className="text-xs text-amber-600 mt-1">Current</div>
                              )}
                              {isMissing && (
                                <div className="text-xs text-slate-400 mt-1">Coming soon</div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={!canAfford || selectedKey === currentStyleKey || loadedImages[selectedKey] === 'missing'}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedKey === currentStyleKey ? 'Current Style' : `Purchase ($${cost})`}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}