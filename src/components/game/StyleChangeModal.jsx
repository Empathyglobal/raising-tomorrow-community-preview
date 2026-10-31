import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState } from './GameStateContext';
import PlayerSpriteAvatar from './PlayerSpriteAvatar';
import { getAvatarSheetUrl } from './avatarImages';
import { toast } from 'sonner';

export default function StyleChangeModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, addLog, getLocalAmount } = useGameState();
  const currentAge = Number(gameState.currentYear || 0);
  const childGenderKey = gameState.childAvatarGender === 'girl' ? 'female' : 'male';
  const childSpriteIndex = Number(gameState.childAvatarSpriteIndex || 0);
  const money = Number(gameState.money || 0);
  const styles = gameState.childAvatarStyleByStage || {};

  const cost = typeof getLocalAmount === 'function' ? getLocalAmount(500) : 500;

  // Determine stage and available styles
  const stage = currentAge >= 18 ? 'adult' : currentAge >= 13 ? 'teen' : null;
  const currentStyle = stage ? (styles[stage] || (stage === 'teen' ? 'base' : 'base1')) : null;

  const styleOptions = stage === 'teen'
    ? [
        { id: 'base', label: 'Base Look', emoji: '😊' },
        { id: 'punk', label: 'Punk Rocker', emoji: '🎸' }
      ]
    : stage === 'adult'
    ? [
        { id: 'base1', label: 'Style 1', emoji: '👔' },
        { id: 'base2', label: 'Style 2', emoji: '👕' },
        { id: 'base3', label: 'Style 3', emoji: '🧥' },
        { id: 'base4', label: 'Style 4', emoji: '🎽' }
      ]
    : [];

  const handleStyleSelect = (styleId) => {
    if (money < cost) {
      toast.error('Not enough money for style change');
      return;
    }

    if (styleId === currentStyle) {
      toast.info('Already using this style');
      return;
    }

    applyMoneyDelta(-cost, 'Style Change');
    
    updateState(prev => ({
      childAvatarStyleByStage: {
        ...(prev.childAvatarStyleByStage || {}),
        [stage]: styleId
      }
    }));

    addLog?.(`Changed style to ${styleOptions.find(s => s.id === styleId)?.label || styleId}`);
    toast.success(`Style changed!`);
    onClose();
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
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">💇 Change Your Style</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="px-6 py-6">
                {!stage ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600">Style changes unlock at age 13.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-600 mb-4 text-center">
                      Choose a style. Cost: ${cost}
                    </p>

                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                      {styleOptions.map((style) => {
                        const isSelected = style.id === currentStyle;
                        const sheetUrl = getAvatarSheetUrl({
                          age: currentAge,
                          genderKey: childGenderKey,
                          styleId: style.id
                        });

                        return (
                          <button
                            key={style.id}
                            onClick={() => handleStyleSelect(style.id)}
                            className={`flex-shrink-0 w-32 p-3 rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'ring-2 ring-amber-400 border-amber-300 shadow'
                                : 'border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                                <PlayerSpriteAvatar
                                  genderKey={childGenderKey}
                                  ageNumber={currentAge}
                                  index={childSpriteIndex}
                                  size={80}
                                  sheetUrlOverride={sheetUrl}
                                />
                              </div>
                              <div className="text-xs font-medium text-slate-700">{style.emoji} {style.label}</div>
                              {isSelected && (
                                <div className="text-[10px] text-amber-600 font-semibold">Current</div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 pb-6">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}