import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import GameModalShell from '@/components/game/GameModalShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LIFE_GOALS } from '@/components/content/lifeGoalsPack';
import { TROPHY_DEFS } from '@/components/game/trophyDefinitions';
import { useGameState } from '@/components/game/GameStateContext';

const MAX_GOALS = 3;

export default function LifeGoalsSetupModal({ open, initialSelectedIds = [], onSave, onClose }) {
  const { gameState } = useGameState();
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds || []);
  const [tab, setTab] = useState('kid');
  const [query, setQuery] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoGoal, setInfoGoal] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedIds(initialSelectedIds || []);
      setQuery('');
    }
  }, [open, initialSelectedIds]);

  const { kidGoals, adultGoals } = useMemo(() => ({
    kidGoals: LIFE_GOALS.filter(g => g.track === 'kid'),
    adultGoals: LIFE_GOALS.filter(g => g.track === 'adult')
  }), []);

  const filteredAndGroupedGoals = useMemo(() => {
    const activeGoals = tab === 'kid' ? kidGoals : adultGoals;
    
    const filtered = query.trim()
      ? activeGoals.filter(g => {
          const q = query.toLowerCase();
          return g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
        })
      : activeGoals;

    // Separate Ending Paths from other goals
    const endingPaths = filtered.filter(g => g.isEndingPath || g.category === 'Ending Paths');
    const otherGoals = filtered.filter(g => !g.isEndingPath && g.category !== 'Ending Paths');

    const grouped = {};

    // Group other goals by category (alphabetically)
    const categoryMap = {};
    otherGoals.forEach(goal => {
      const cat = goal.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(goal);
    });

    // Add categories in order
    Object.keys(categoryMap).sort().forEach(cat => {
      grouped[cat] = categoryMap[cat];
    });

    // Add Ending Paths LAST if they exist
    if (endingPaths.length > 0) {
      grouped['Ending Paths'] = endingPaths;
    }

    return grouped;
  }, [tab, query, kidGoals, adultGoals]);

  const handleToggleGoal = (goalId) => {
    setSelectedIds(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      }
      if (prev.length < MAX_GOALS) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  const handleSave = () => {
    onSave(selectedIds);
  };

  const handleNoGoals = () => {
    onSave([]);
  };

  const isContinueDisabled = selectedIds === null;

  return (
    <>
      <GameModalShell open={open} onClose={onClose} maxWidth="md">
        <div className="rt-modal-surface flex flex-col h-full min-h-0">
        {/* Fixed Header with Tabs & Search */}
        <div className="shrink-0 p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🌱 Life Goals</h2>
              <p className="text-sm text-gray-600 mt-1">Pick up to 3. These will steer your Milestones.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTab('kid')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                tab === 'kid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Child Goals
            </button>
            <button
              onClick={() => setTab('adult')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                tab === 'adult'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Your Life
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search goals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Goals List (ONLY scrollable area) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pt-4 pb-[calc(180px+env(safe-area-inset-bottom,0px))]" style={{ WebkitOverflowScrolling: 'touch' }}>
          {Object.entries(filteredAndGroupedGoals).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No goals found. Try a different search.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filteredAndGroupedGoals).map(([category, goals]) => (
                <div key={category}>
                  {category === 'Ending Paths' ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-amber-600">✨ Ending Paths (Quest Goals)</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        Pick one if you want a guided route to a special ending + trophy.
                      </p>
                    </div>
                  ) : (
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      {category}
                    </h3>
                  )}
                  <div className="space-y-3">
                    {goals.map(goal => {
                      const isSelected = selectedIds.includes(goal.id);
                      const isDisabled = !isSelected && selectedIds.length >= MAX_GOALS;
                      const isEndingPath = goal.isEndingPath || goal.category === 'Ending Paths';
                      const isSpecialEnding = goal.isEndingPath || !!goal.trophyId || !!goal.endingTopBadge;

                      const trophyDef = goal.trophyId ? TROPHY_DEFS.find(t => t.id === goal.trophyId) : null;
                      const trophies = gameState?.trophies?.unlocked || {};
                      const isTrophyUnlocked = trophyDef ? !!trophies[trophyDef.id] : false;
                      const isSecret = trophyDef?.secret && !isTrophyUnlocked;

                      const statHintsUp = goal.statHintsUp || [];
                      const statHintsDown = goal.statHintsDown || [];

                      // Build tooltip text for desktop hover
                      const tooltipParts = [];
                      if (goal.description) tooltipParts.push(goal.description);
                      if (goal.hintText) tooltipParts.push(`💡 ${goal.hintText}`);
                      if (statHintsUp.length > 0 || statHintsDown.length > 0) {
                        const statText = [
                          ...statHintsUp.map(s => `⬆️ ${s}`),
                          ...statHintsDown.map(s => `⬇️ ${s}`)
                        ].join(' • ');
                        tooltipParts.push(`Needs: ${statText}`);
                      }
                      if (trophyDef) {
                        tooltipParts.push(`Trophy: ${trophyDef.icon} ${isSecret ? trophyDef.lockedName : trophyDef.name}`);
                      }
                      const tooltipText = tooltipParts.join('\n\n');

                      return (
                        <motion.button
                          key={goal.id}
                          onClick={() => handleToggleGoal(goal.id)}
                          disabled={isDisabled}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          title={tooltipText}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? isEndingPath
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-blue-500 bg-blue-50'
                              : isDisabled
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                : isEndingPath
                                  ? 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-xl flex-shrink-0">{goal.emoji || '🎯'}</div>
                            <div className="flex-1 min-w-0 font-medium text-gray-900">{goal.title}</div>
                            {isSpecialEnding && (
                              <span
                                className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800"
                                title="Special ending path"
                                aria-label="Special ending path"
                              >
                                ✨
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInfoGoal(goal);
                                setInfoOpen(true);
                              }}
                              className="flex-shrink-0 w-6 h-6 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <span className="text-sm font-bold">ⓘ</span>
                            </button>
                            {isSelected && (
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer with Safe Area Padding */}
        <div className="shrink-0 border-t bg-white/95 backdrop-blur px-6 py-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))] sticky bottom-0">
          <div className="text-sm text-gray-600 text-center mb-4">
            {selectedIds.length} of {MAX_GOALS} selected
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleNoGoals}
              className="flex-1"
            >
              No Goals
            </Button>
            <Button
              onClick={handleSave}
              disabled={isContinueDisabled}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </GameModalShell>

    {/* Goal Info Modal */}
    {infoOpen && infoGoal && (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50" onClick={() => setInfoOpen(false)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{infoGoal.emoji || '🎯'}</span>
              <h3 className="font-bold text-gray-900">{infoGoal.title}</h3>
            </div>
            <button
              onClick={() => setInfoOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {infoGoal.description && (
              <p className="text-sm text-gray-700 leading-relaxed">{infoGoal.description}</p>
            )}

            {infoGoal.hintText && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs font-medium text-amber-900 mb-1">💡 Hint</div>
                <p className="text-xs text-amber-800 italic">{infoGoal.hintText}</p>
              </div>
            )}

            {((infoGoal.statHintsUp || []).length > 0 || (infoGoal.statHintsDown || []).length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs font-medium text-blue-900 mb-2">Stat Requirements</div>
                <div className="text-xs text-blue-800 space-y-1">
                  {(infoGoal.statHintsUp || []).map(stat => (
                    <div key={stat}>⬆️ {stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                  ))}
                  {(infoGoal.statHintsDown || []).map(stat => (
                    <div key={stat}>⬇️ {stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                  ))}
                </div>
              </div>
            )}

            {infoGoal.trophyId && (() => {
              const trophyDef = TROPHY_DEFS.find(t => t.id === infoGoal.trophyId);
              const trophies = gameState?.trophies?.unlocked || {};
              const isTrophyUnlocked = trophyDef ? !!trophies[trophyDef.id] : false;
              const isSecret = trophyDef?.secret && !isTrophyUnlocked;
              
              return (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-purple-900 mb-1">Trophy Unlock</div>
                  {trophyDef ? (
                    <>
                      <div className="text-sm text-purple-800">
                        {trophyDef.icon} {isSecret ? trophyDef.lockedName : trophyDef.name}
                      </div>
                      {isSecret && trophyDef.lockedDesc && (
                        <div className="text-xs text-purple-700 mt-1">{trophyDef.lockedDesc}</div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-purple-700">Unlocks a special trophy</div>
                  )}
                </div>
              );
            })()}

            <Button
              onClick={() => setInfoOpen(false)}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </>
  );
}