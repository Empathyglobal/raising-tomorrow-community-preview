import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/components/game/GameStateContext';
import { 
  MARTIAL_STYLES, 
  MARTIAL_BELTS, 
  BELT_FLAVOR,
  getBeltIndex, 
  getBeltLabel, 
  getYearsTrained 
} from './martialArtsData';
import { hasShopItem } from './shopCatalog';

export default function MartialArtsModal({ open, onClose }) {
  const { gameState, updateState, applyDeltas, applyMoneyDelta, recordTimelineEntry, consumeAction, emitActionResult } = useGameState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const handleEnroll = (style) => {
    // Get current belt info
    const oldBeltIndex = getBeltIndex(gameState, style.id);
    const oldBeltLabel = MARTIAL_BELTS[oldBeltIndex].label;
    const newBeltIndex = Math.min(oldBeltIndex + 1, MARTIAL_BELTS.length - 1);
    const newBeltLabel = MARTIAL_BELTS[newBeltIndex].label;
    const yearsTrainedCurrent = getYearsTrained(gameState, style.id);

    // Use action (consumes focus)
    consumeAction('mindBody');

    // Apply EXISTING martial arts stat effects (same as Taekwondo)
    const statDeltas = { intelligence: 0, empathy: 1, discipline: 2, confidence: 1 };
    applyDeltas(statDeltas, `Martial Arts: ${style.name}`);

    // Apply cost with uniform discount
    let annualCost = 1800;
    let uniformDiscount = 0;
    if (style.id === 'taekwondo' && hasShopItem(gameState, 'taekwondoUniform')) {
      uniformDiscount = 100;
      annualCost -= uniformDiscount;
    }
    
    applyMoneyDelta(-annualCost, `Martial Arts: ${style.name}`);

    // Update belt progression
    const updatedMindBody = {
      ...gameState.mindBody,
      martialArts: {
        activeStyleId: style.id,
        beltIndexByStyle: {
          ...(gameState.mindBody?.martialArts?.beltIndexByStyle || {}),
          [style.id]: newBeltIndex
        },
        yearsTrainedByStyle: {
          ...(gameState.mindBody?.martialArts?.yearsTrainedByStyle || {}),
          [style.id]: yearsTrainedCurrent + 1
        }
      }
    };

    updateState({ mindBody: updatedMindBody });

    // Timeline entry 1: Year enrollment
    const detailText = uniformDiscount > 0 
      ? `Stayed consistent all year. Belt progress tracked. -$${annualCost} (uniform saved $${uniformDiscount})`
      : `Stayed consistent all year. Belt progress tracked. -$${annualCost}`;
    
    recordTimelineEntry({
      kind: 'mindBody',
      title: `🥋 Martial Arts: ${style.name} (year)`,
      detail: detailText,
      deltas: statDeltas,
      moneyDelta: -annualCost,
      loveDelta: 0,
      stressDelta: 0,
      meta: { styleId: style.id, styleName: style.name }
    });

    // Timeline entry 2: Belt promotion
    recordTimelineEntry({
      kind: 'belt',
      title: `🥋 ${style.name}: Promoted to ${newBeltLabel}`,
      detail: `Belt level increased from ${oldBeltLabel} → ${newBeltLabel}.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { 
        styleId: style.id, 
        oldBeltLabel, 
        newBeltLabel, 
        newBeltIndex 
      }
    });

    // Pick random flavor line
    const flavorLine = BELT_FLAVOR[Math.floor(Math.random() * BELT_FLAVOR.length)];

    // Show confirmation
    setConfirmationData({
      styleName: style.name,
      newBeltLabel,
      flavorLine
    });
    setShowConfirmation(true);

    // Emit action result
    const bodyParts = [
      `Your child trained consistently all year.`,
      `\nBelt earned: ${newBeltLabel}`,
      `\n${flavorLine}`
    ];
    if (uniformDiscount > 0) {
      bodyParts.push(`\n💰 Uniform owned: saved $${uniformDiscount} this year.`);
    }
    
    emitActionResult({
      actionId: 'mindBody',
      title: `🥋 ${style.name} Year Complete`,
      body: bodyParts.join(''),
      deltas: statDeltas,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -annualCost,
      focusDelta: -1,
      tags: ['mindBody', 'martial'],
      meta: { 
        emoji: '🥋', 
        styleId: style.id,
        coachNote: "Belts are just reps made visible. Clear rules + consistent practice build discipline and confidence without you lecturing."
      }
    });
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold mb-1">🥋 Martial Arts</h2>
                  <p className="text-orange-100 text-sm">Year-long training. Belts progress with consistency.</p>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                  <div className="space-y-4">
                    {MARTIAL_STYLES.map((style) => {
                      const currentBeltLabel = getBeltLabel(gameState, style.id);
                      const yearsTrained = getYearsTrained(gameState, style.id);
                      const beltIndex = getBeltIndex(gameState, style.id);
                      const isMaxBelt = beltIndex >= (MARTIAL_BELTS.length - 1);
                      
                      return (
                        <div
                          key={style.id}
                          className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                {style.name}
                              </h3>
                              <div className="space-y-1 text-sm text-slate-600">
                                <p>Belt: <span className="font-semibold">{currentBeltLabel}</span></p>
                                <p>Years trained: <span className="font-semibold">{yearsTrained}</span></p>
                                {isMaxBelt && (
                                  <p className="text-amber-600 font-semibold">⭐ Black Belt achieved!</p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {(() => {
                                const baseCost = 1800;
                                const uniformDiscount = style.id === 'taekwondo' && hasShopItem(gameState, 'taekwondoUniform') ? 100 : 0;
                                const finalCost = baseCost - uniformDiscount;
                                
                                return (
                                  <>
                                    <Button
                                      onClick={() => handleEnroll(style)}
                                      disabled={gameState.actionPoints < 1}
                                      className="min-w-[140px] bg-orange-600 hover:bg-orange-700"
                                    >
                                      Enroll (${finalCost.toLocaleString()})
                                    </Button>
                                    {uniformDiscount > 0 && (
                                      <p className="text-xs text-emerald-600 font-semibold text-center">
                                        Uniform: saves ${uniformDiscount}
                                      </p>
                                    )}
                                    <p className="text-xs text-slate-500 text-center">
                                      Costs 1 Focus
                                    </p>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
                    <p className="font-semibold mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Each year of training advances one belt level</li>
                      <li>Same stat effects as before: EMP +1, DIS +2, CON +1</li>
                      <li>Cost: $1,800/year • 1 Focus</li>
                      <li>Progress is tracked per style</li>
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                  <Button onClick={onClose} variant="outline" className="w-full">
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Popup */}
      <AnimatePresence>
        {showConfirmation && confirmationData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setShowConfirmation(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                🥋 Belt Progress
              </h3>
              <div className="space-y-2 text-sm text-slate-700 mb-4">
                <p>
                  After a year of <strong>{confirmationData.styleName}</strong>, your child earned <strong>{confirmationData.newBeltLabel}</strong>.
                </p>
                <p className="italic text-slate-600 mt-3">
                  {confirmationData.flavorLine}
                </p>
              </div>
              <Button
                onClick={() => setShowConfirmation(false)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Nice
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}