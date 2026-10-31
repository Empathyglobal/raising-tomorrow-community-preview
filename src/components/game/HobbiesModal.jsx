import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, getActiveChildFromState, getDisplayedChildAge, formatDeltas } from '@/components/game/GameStateContext';
import { CHILD_HOBBIES, getHobbyMilestone, seededPickLine, HOBBY_FILTERS } from '@/components/game/childHobbiesCatalog';

export default function HobbiesModal({ open, onClose }) {
  const { gameState, consumeAction, applyDeltas, applyStress, updateState, emitActionResult } = useGameState();
  
  const kid = getActiveChildFromState(gameState);
  const age = kid ? getDisplayedChildAge(gameState, kid) : Number(gameState.currentYear || 0);
  const childName = kid?.childSlice?.childName || kid?.name || gameState.childName || "Child";
  
  const canUse = !gameState.pendingScenario && !gameState.finished && (gameState.actionPoints || 0) >= 1;
  
  const [filterId, setFilterId] = React.useState("all");
  
  // Reset filter when modal opens
  React.useEffect(() => {
    if (open) setFilterId("all");
  }, [open]);
  
  // Derived values
  const xpById = gameState.childHobbies?.xpById || {};
  const favoriteId = gameState.childHobbies?.favoriteId || null;
  
  // Compute top hobby with tie-breaking
  const topHobbyId = React.useMemo(() => {
    const withXp = CHILD_HOBBIES.map(h => ({
      ...h,
      xp: Number(xpById[h.id] || 0),
    }));
    const maxXp = withXp.reduce((m, x) => Math.max(m, x.xp), 0);
    if (!maxXp || maxXp <= 0) return null;

    const tied = withXp.filter(x => x.xp === maxXp);
    // If favorite is tied, choose it
    if (favoriteId && tied.some(t => t.id === favoriteId)) return favoriteId;

    // Otherwise minAge then alphabetical
    tied.sort((a, b) => {
      if (a.minAge !== b.minAge) return a.minAge - b.minAge;
      return a.name.localeCompare(b.name);
    });
    return tied[0]?.id || null;
  }, [xpById, favoriteId]);
  
  // Top hobby label for header
  const topHobbyLabel = React.useMemo(() => {
    if (!topHobbyId) return "—";
    const hobby = CHILD_HOBBIES.find(h => h.id === topHobbyId);
    if (!hobby) return "—";
    const xp = Number(xpById[topHobbyId] || 0);
    const milestone = getHobbyMilestone(xp);
    return `${hobby.emoji} ${hobby.name} (${milestone})`;
  }, [topHobbyId, xpById]);
  
  // Filter logic
  const selectedFilter = React.useMemo(
    () => HOBBY_FILTERS.find(f => f.id === filterId) || HOBBY_FILTERS[0],
    [filterId]
  );
  
  const visibleHobbies = React.useMemo(() => {
    if (!selectedFilter.group) return CHILD_HOBBIES;
    const group = new Set(selectedFilter.group);
    return CHILD_HOBBIES.filter(h => group.has(h.category));
  }, [selectedFilter]);
  
  const filterCounts = React.useMemo(() => {
    const counts = {};
    for (const f of HOBBY_FILTERS) {
      if (!f.group) {
        counts[f.id] = CHILD_HOBBIES.length;
      } else {
        const set = new Set(f.group);
        counts[f.id] = CHILD_HOBBIES.filter(h => set.has(h.category)).length;
      }
    }
    return counts;
  }, []);
  
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
  
  const handleHobbyClick = (hobby) => {
    // 1) Spend action
    const ok = consumeAction('hobbies');
    if (!ok) return;
    
    // 2) Apply deltas + stress
    applyDeltas(hobby.deltas, `Hobby: ${hobby.name}`);
    applyStress(hobby.stressDelta, `Hobby: ${hobby.name}`);
    
    // 3) Update childHobbies state
    const prevXp = gameState.childHobbies?.xpById?.[hobby.id] || 0;
    const nextXp = prevXp + 1;
    
    updateState(prev => {
      const ch = prev.childHobbies || { xpById: {}, lastDoneAgeById: {}, favoriteId: null, totalSessions: 0 };
      const nextXpById = { ...(ch.xpById || {}), [hobby.id]: nextXp };
      const nextLastDone = { ...(ch.lastDoneAgeById || {}), [hobby.id]: age };
      const nextTotal = (ch.totalSessions || 0) + 1;
      const nextFavorite = ch.favoriteId || hobby.id;
      
      return {
        childHobbies: {
          xpById: nextXpById,
          lastDoneAgeById: nextLastDone,
          favoriteId: nextFavorite,
          totalSessions: nextTotal
        }
      };
    });
    
    // 4) Compute milestone
    const milestone = getHobbyMilestone(nextXp);
    
    // 5) Pick line deterministically
    const line = seededPickLine(gameState.runSeed || "seed", hobby.id, age, nextXp, hobby.resultLines);
    
    // 6) Emit action result
    const isTopHobby = hobby.id === topHobbyId;
    const bodyText = isTopHobby 
      ? `${line}\n\nNow at: ${milestone}\n\n🏆 This is their current top hobby.`
      : `${line}\n\nNow at: ${milestone}`;
    
    emitActionResult({
      actionId: 'hobbies',
      title: `${hobby.emoji} ${hobby.name}`,
      body: bodyText,
      deltas: hobby.deltas,
      loveDelta: 0,
      stressDelta: hobby.stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['activity', 'hobbies', hobby.category],
      meta: { emoji: hobby.emoji, hobbyId: hobby.id, milestone }
    });
    
    // 7) Close modal
    onClose();
  };
  
  const getDisabledReason = (hobby) => {
    if (!canUse) {
      if (gameState.pendingScenario) return "Unavailable during an active scenario.";
      if (gameState.finished) return "Run finished.";
      if ((gameState.actionPoints || 0) < 1) return "Not enough Focus.";
    }
    
    if (age < hobby.minAge) return `Unlocks at age ${hobby.minAge}.`;
    
    const lastDone = gameState.childHobbies?.lastDoneAgeById?.[hobby.id];
    if (lastDone === age) return "Already did this hobby this year.";
    
    return null;
  };
  
  const abbreviations = {
    intelligence: 'INT',
    empathy: 'EMP',
    discipline: 'DIS',
    confidence: 'CON',
    happiness: 'HAP',
    creativity: 'CRE',
    curiosity: 'CUR',
    responsibility: 'RES',
    knowledge: 'KNW',
    health: 'HLT',
    social: 'SOC',
    fitness: 'FIT',
    anxiety: 'ANX'
  };
  
  const formatHobbyDeltas = (deltas) => {
    if (!deltas) return '';
    return Object.entries(deltas)
      .map(([k, v]) => {
        const abbr = abbreviations[k] || k.substr(0, 3).toUpperCase();
        const val = Number(v);
        return `${abbr} ${val > 0 ? '+' : ''}${val}`;
      })
      .join(' • ');
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
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex-shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800">Hobbies & Clubs</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      For {childName} • Age {age} • Focus 1 • Stress relief
                    </p>
                    <p className="text-xs text-indigo-600 font-medium mt-1">
                      Top Hobby: {topHobbyLabel}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                
                {/* Filter Pills */}
                <div className="px-6 pb-3 overflow-x-auto no-scrollbar">
                  <div className="flex gap-2">
                    {HOBBY_FILTERS.map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setFilterId(filter.id)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          filterId === filter.id
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                            : 'bg-white/60 text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {filter.label} {filterCounts[filter.id]}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Showing count */}
                <div className="px-6 pb-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Showing {visibleHobbies.length} of {CHILD_HOBBIES.length}
                  </p>
                </div>
              </div>
              
              {/* Hobby List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                <div className="space-y-3">
                  {visibleHobbies.map((hobby) => {
                    const xp = xpById[hobby.id] || 0;
                    const milestone = getHobbyMilestone(xp);
                    const disabledReason = getDisabledReason(hobby);
                    const disabled = Boolean(disabledReason);
                    const isTopHobby = hobby.id === topHobbyId;
                    const isFavorite = hobby.id === favoriteId;
                    
                    return (
                      <div key={hobby.id}>
                        <button
                          onClick={() => handleHobbyClick(hobby)}
                          disabled={disabled}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            disabled
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{hobby.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="font-semibold text-slate-800">{hobby.name}</div>
                                {isTopHobby && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-amber-600">
                                    🏆 Top Hobby
                                  </span>
                                )}
                                {isFavorite && !isTopHobby && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-indigo-600">
                                    ⭐ Favorite
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mb-1">
                                Age {hobby.minAge}+ • {formatHobbyDeltas(hobby.deltas)} • Stress {hobby.stressDelta}
                              </div>
                              {xp > 0 && (
                                <div className="text-[10px] font-medium text-indigo-600">
                                  XP: {xp} • {milestone}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                        {disabled && disabledReason && (
                          <div className="text-[10px] text-slate-400 mt-1 ml-14">
                            {disabledReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}