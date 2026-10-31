import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';

const kindIcons = {
  major: '🎭',
  bond: '❤️',
  play: '🎮',
  study: '📘',
  tutor: '👨‍🏫',
  routine: '🕒',
  strategy: '🌿',
  tool: '🧰',
  micro: '🌦️',
  memory: '📝',
  system: '🗓️',
  golden: '✨',
  pet: '🐾',
  travel: '✈️',
  stress: '😮‍💨',
  scenario: '✨',
  tinyCute: '✨',
  kidWisdom: '💡',
  job: '💼',
  easterEgg: '🎬',
  kidLogic: '🤪',
  chaos: '🌪️'
};

export default function FullTimelineModal({ open, onClose }) {
  const { gameState } = useGameState();
  const { timelineEntries } = gameState;

  // Group entries by age
  const groupedByAge = {};
  timelineEntries.forEach(entry => {
    if (!groupedByAge[entry.age]) {
      groupedByAge[entry.age] = [];
    }
    groupedByAge[entry.age].push(entry);
  });
  const ages = Object.keys(groupedByAge).sort((a, b) => b - a);

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
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">Just What Happened</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Timeline Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {timelineEntries.length === 0 ? (
                  <p className="text-center text-slate-500 italic py-8">
                    No events yet. Your story begins...
                  </p>
                ) : (
                  <div className="space-y-6">
                    {ages.map(age => (
                      <div key={age}>
                        <div className="text-sm font-bold text-slate-700 mb-3 sticky top-0 bg-white/95 py-2 border-b border-slate-200">
                          Age {age}
                        </div>
                        <div className="space-y-3 pl-3">
                          {groupedByAge[age].reverse().map(entry => {
                            // Special highlight strip for tiny cute moments
                            if (entry.kind === 'tinyCute') {
                              return (
                                <div 
                                  key={entry.id} 
                                  className="text-xs py-2 px-3 leading-snug rounded-lg"
                                  style={{
                                    background: '#FFF4B8',
                                    borderLeft: '4px solid #FF4FA3'
                                  }}
                                >
                                  ✨ {entry.title}
                                </div>
                              );
                            }

                            // Special highlight strip for kid wisdom
                            if (entry.kind === 'kidWisdom') {
                              return (
                                <div 
                                  key={entry.id} 
                                  className="text-xs py-2 px-3 leading-snug rounded-lg italic"
                                  style={{
                                    background: '#E8F4FF',
                                    borderLeft: '4px solid #7C3AED'
                                  }}
                                >
                                  {entry.title}
                                </div>
                              );
                            }
                            
                            return (
                              <div key={entry.id} className="flex gap-3">
                                <span className="flex-shrink-0 text-xl">{kindIcons[entry.kind] || '•'}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-slate-800">{entry.title}</div>
                                  {entry.detail && (
                                    <div className="text-sm text-slate-600 mt-1">{entry.detail}</div>
                                  )}
                                  {entry.effectsLine && (
                                    <div className="text-sm text-slate-500 italic mt-2">{entry.effectsLine}</div>
                                  )}
                                  {/* Show deltas/love/stress if present */}
                                  {(entry.moneyDelta !== 0 || entry.loveDelta !== 0 || entry.stressDelta !== 0) && (
                                    <div className="flex gap-3 text-xs text-slate-500 mt-2">
                                      {entry.moneyDelta !== 0 && (
                                        <span>💰 {entry.moneyDelta > 0 ? '+' : ''}{entry.moneyDelta}</span>
                                      )}
                                      {entry.loveDelta !== 0 && (
                                        <span>❤️ {entry.loveDelta > 0 ? '+' : ''}{entry.loveDelta}</span>
                                      )}
                                      {entry.stressDelta !== 0 && (
                                        <span>😮‍💨 {entry.stressDelta > 0 ? '+' : ''}{entry.stressDelta}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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