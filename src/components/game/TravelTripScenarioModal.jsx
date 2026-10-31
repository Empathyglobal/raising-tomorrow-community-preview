import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';

export default function TravelTripScenarioModal({ open, destination, moment, onChoose, disabled }) {
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

  if (!moment) return null;

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
            className="fixed inset-0 bg-black/80 z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-2xl ${isStorybook ? 'rt-modal-surface rt-popup--storybook rt-paper-elev' : 'bg-white rounded-2xl shadow-2xl overflow-hidden'} max-h-[85vh] flex flex-col`}>
              {/* Header */}
              {isStorybook ? (
                <div className="relative w-full h-[160px] flex-shrink-0">
                  <div className="SBModalIllustrationFrame absolute inset-3 rounded-[14px] overflow-hidden">
                    <SafeStorybookImage src={null} alt="" className="SBImageEl w-full h-full object-cover pointer-events-none select-none" fallbackVariant="banner" />
                  </div>
                  <div className="absolute left-4 right-4 bottom-4 pointer-events-none">
                    <div className="SBPanel px-3 py-2 rounded-md">
                      <div className="SBHeaderTitle">Trip Moment: {destination?.name} {destination?.flagEmoji} {destination?.emoji}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✈️</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">Trip Moment: {destination?.name}</h3>
                      <p className="text-amber-50 text-sm">{destination?.flagEmoji} {destination?.emoji}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                {/* Moment Text */}
                <div className={`${isStorybook ? 'rt-paper-outcome rt-torn-bottom' : 'bg-amber-50 rounded-xl border-2 border-amber-200'} p-5 mb-6`}>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                    {moment.text}
                  </p>
                </div>

                {/* Reaction Choices */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-600 mb-3">How do you react?</p>
                  {moment.reactions.map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => onChoose(reaction)}
                      disabled={disabled}
                      className={`${isStorybook ? 'rt-paper-choice rt-paper-choice--navy' : 'w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{reaction.emoji}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 mb-1">{reaction.label}</div>
                          <div className="text-sm text-slate-600">{reaction.consequence}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}