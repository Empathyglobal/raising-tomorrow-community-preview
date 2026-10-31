import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameState, ECONOMY_PRICES, formatMoney } from '@/components/game/GameStateContext';
import { TRAVEL_DESTINATIONS } from './travelDestinations';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';

export default function TravelDestinationModal({ open, onClose, onSelectDestination }) {
  const { updateState } = useGameState();
  
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

  const handleClose = () => {
    updateState({ travelPending: false, pendingTravelContext: null });
    onClose();
  };

  const isStorybook = typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[102]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[103] flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-md my-8 flex flex-col max-h-[85vh] ${isStorybook ? 'rt-modal-surface rt-popup--storybook rt-paper-elev' : 'bg-white rounded-2xl shadow-2xl overflow-hidden'}`}>
              {/* Header */}
              {isStorybook ? (
                <div className="relative w-full h-[160px] flex-shrink-0">
                  <div className="SBModalIllustrationFrame absolute inset-3 rounded-[14px] overflow-hidden">
                    <SafeStorybookImage src={null} alt="" className="SBImageEl w-full h-full object-cover pointer-events-none select-none" fallbackVariant="banner" />
                  </div>
                  <div className="absolute left-4 right-4 bottom-4 pointer-events-none">
                    <div className="SBPanel px-3 py-2 rounded-md">
                      <div className="SBHeaderTitle">✈️ Choose a Landmark Destination</div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">✈️ Choose a Landmark Destination</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Cost varies by destination. Focus: 1
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Each trip stamps your passport with the country flag + the landmark emoji.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              )}

              {/* Destination List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {TRAVEL_DESTINATIONS.map((destination) => (
                  <button
                    key={destination.code}
                    onClick={() => onSelectDestination(destination)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl flex-shrink-0">{destination.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-slate-800 text-base truncate">{destination.name}</div>
                          <span className="text-xl flex-shrink-0" aria-label="Country flag">
                            {destination.flagEmoji}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{destination.vibe}</div>
                        <div className="text-xs font-semibold text-amber-700 mt-1">Cost: ${formatMoney(destination.baseCost)}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}