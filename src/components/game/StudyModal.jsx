import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, combineDeltas } from '@/components/game/GameStateContext';
import { base44 } from '@/api/base44Client';
import StudyLearnedModal from './StudyLearnedModal';

export default function StudyModal({ open, onClose }) {
  const { gameState, applyDeltas, applyMoney, consumeAction, addLog, updateState, recordTimelineEntry, applyTechniqueBonusesForAction, emitActionResult } = useGameState();
  const [learnedModalOpen, setLearnedModalOpen] = React.useState(false);
  const [learnedContent, setLearnedContent] = React.useState(null);

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

  const [techniques, setTechniques] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadTechniques = async () => {
      setIsLoading(true);
      try {
        const data = await base44.entities.Techniques.list();
        if (!cancelled) setTechniques(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load techniques', err);
        if (!cancelled) setTechniques([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadTechniques();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleStudy = async (technique) => {
    if (gameState.money < technique.cost) return;
    if (gameState.actionPoints < 1) return;
    if (gameState.unlockedTechniques.includes(technique.id)) return;

    // Apply costs
    applyMoney(-technique.cost, 'Study');
    consumeAction('study');

    // Apply immediate deltas with technique bonuses
    const baseDeltas = technique.instantDeltas || {};
    const bonusDeltas = applyTechniqueBonusesForAction('study');
    const combined = combineDeltas(baseDeltas, bonusDeltas);
    applyDeltas(combined, 'Study');

    // Update game state
    updateState({
      unlockedTechniques: [...gameState.unlockedTechniques, technique.id],
      studiedItems: [...(gameState.studiedItems || []), {
        age: gameState.currentYear,
        title: technique.name,
        cost: technique.cost
      }]
    });

    addLog(technique.unlockLog);

    emitActionResult({
      actionId: 'study',
      deltas: combined,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -technique.cost,
      focusDelta: -1,
      tags: ['study', 'growth'],
      meta: { emoji: technique.emoji, technique: technique.name }
    });

    // Show learned modal
    setLearnedContent({
      title: technique.name,
      emoji: technique.emoji,
      description: technique.description
    });
    setLearnedModalOpen(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[110]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[111] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">📘 Study</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Money: ${gameState.money} • Focus: {gameState.actionPoints}/{gameState.maxFocusTokens}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {isLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading modules...</div>
                ) : techniques.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No modules available</div>
                ) : (
                  <div className="space-y-3">
                    {techniques.map(tech => {
                      const isUnlocked = gameState.unlockedTechniques.includes(tech.id);
                      const canAfford = gameState.money >= tech.cost;
                      const hasFocus = gameState.actionPoints >= 1;
                      const canStudy = !isUnlocked && canAfford && hasFocus;

                      return (
                        <button
                          key={tech.id}
                          onClick={() => canStudy && handleStudy(tech)}
                          disabled={!canStudy}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            isUnlocked
                              ? 'border-green-300 bg-green-50 cursor-default'
                              : !canStudy
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl flex-shrink-0">{tech.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-semibold text-slate-800">{tech.name}</div>
                                {isUnlocked ? (
                                  <span className="text-xs font-medium text-green-600 px-2 py-0.5 bg-green-100 rounded">
                                    ✓ Learned
                                  </span>
                                ) : (
                                  <span className="text-sm font-medium text-slate-600">${tech.cost}</span>
                                )}
                              </div>
                              <div className="text-sm text-slate-600 mb-2">{tech.description}</div>
                              {!isUnlocked && (
                                <div className="text-xs text-slate-500">
                                  {!canAfford && 'Not enough money • '}
                                  {!hasFocus && 'No focus left • '}
                                  Costs 1 Focus
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <StudyLearnedModal
            open={learnedModalOpen}
            onClose={() => {
              setLearnedModalOpen(false);
              onClose();
            }}
            content={learnedContent}
          />
        </>
      )}
    </AnimatePresence>
  );
}