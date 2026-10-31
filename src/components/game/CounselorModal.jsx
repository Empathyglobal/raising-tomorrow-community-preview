import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/components/game/GameStateContext';
import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';
import { PATTERN_INSIGHTS } from './patternInsights';
import PatternLearnModal from './PatternLearnModal';

export default function CounselorModal({ open, onClose }) {
  const { gameState, spendFocus, applyMoneyDelta, applyStress, applyLove, updateState, emitActionResult, addLog, recordTimelineEntry, getLocalAmount, formatBaseToLocal, grantPartnerCounselingBuffer } = useGameState();
  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [activeTab, setActiveTab] = useState('self');

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

  const { familyPatterns, partnerPatterns, currentYear, partnerName } = gameState;
  const hasPartner = gameState.householdType === 'two';
  
  // Player patterns
  const selectedIds = familyPatterns?.selectedIds || [];
  const severityById = familyPatterns?.severityById || {};
  const resolvedById = familyPatterns?.resolvedById || {};
  const resolvedAtAgeById = familyPatterns?.resolvedAtAgeById || {};
  const counselorByAge = familyPatterns?.counselorByAge || {};
  const alreadyUsedThisYear = counselorByAge[currentYear]?.used || false;
  
  // Partner patterns
  const partnerSelectedIds = partnerPatterns?.selectedIds || [];
  const partnerSeverityById = partnerPatterns?.severityById || {};
  const partnerResolvedById = partnerPatterns?.resolvedById || {};
  const partnerResolvedAtAgeById = partnerPatterns?.resolvedAtAgeById || {};

  const activePatterns = selectedIds
    .filter(id => (severityById[id] || 0) > 0 && !resolvedById[id])
    .map(id => {
      const catalogEntry = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
      return {
        id,
        ...catalogEntry,
        severity: severityById[id] || 0
      };
    });

  const resolvedPatterns = selectedIds
    .filter(id => (severityById[id] || 0) === 0 || resolvedById[id])
    .map(id => {
      const catalogEntry = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
      return {
        id,
        ...catalogEntry,
        resolvedAtAge: resolvedAtAgeById[id]
      };
    });

  const handleLearn = (pattern) => {
    setSelectedPattern(pattern);
    setLearnModalOpen(true);
  };

  const handleWorkOn = (pattern) => {
    // Spend focus
    if (!spendFocus(1, "Counselor")) return;

    // Spend money
    const cost = getLocalAmount(250);
    applyMoneyDelta(-cost, "Counselor", { allowCreditMessage: true });

    // Apply effects
    applyStress(-0.5, "Counselor");
    applyLove(0.1, "Counselor");

    // Reduce severity
    const currentSeverity = severityById[pattern.id] || 0;
    const newSeverity = Math.max(0, currentSeverity - 1);
    const nowResolved = newSeverity === 0;

    const newSeverityById = { ...severityById, [pattern.id]: newSeverity };
    const newResolvedById = { ...resolvedById };
    const newResolvedAtAgeById = { ...resolvedAtAgeById };

    if (nowResolved) {
      newResolvedById[pattern.id] = true;
      newResolvedAtAgeById[pattern.id] = currentYear;
    }

    // Mark counselor used this year
    const newCounselorByAge = {
      ...counselorByAge,
      [currentYear]: { used: true, target: 'self', workedOnId: pattern.id }
    };

    updateState({
      familyPatterns: {
        ...familyPatterns,
        severityById: newSeverityById,
        resolvedById: newResolvedById,
        resolvedAtAgeById: newResolvedAtAgeById,
        counselorByAge: newCounselorByAge
      }
    });

    // Pick insight
    const insights = PATTERN_INSIGHTS[pattern.id] || ["You practiced a new way of showing up."];
    const insight = insights[Math.floor(Math.random() * insights.length)];

    // Log
    addLog(`🧠 Counselor — Worked on ${pattern.label}. Intensity eased.`);

    // Timeline
    recordTimelineEntry({
      kind: 'counselor',
      title: `🧠 Counselor — ${pattern.label}`,
      detail: `Worked on ${pattern.label}. Intensity eased.`,
      deltas: null,
      moneyDelta: -cost,
      loveDelta: 0.1,
      stressDelta: -0.5,
      meta: { patternId: pattern.id, nowResolved }
    });

    // Emit action result with insight
    const bodyText = nowResolved
      ? `Worked on: ${pattern.label}\n\n✅ Resolved\n\nInsight: ${insight}`
      : `Worked on: ${pattern.label}\n\nInsight: ${insight}`;

    emitActionResult({
      actionId: 'counselor',
      title: '🧠 Counselor Session',
      body: bodyText,
      deltas: null,
      loveDelta: 0.1,
      stressDelta: -0.5,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['counselor', 'care'],
      meta: { 
        emoji: '🧠', 
        pattern: pattern.label, 
        nowResolved,
        insight 
      }
    });

    // Close modal
    onClose();
  };

  const handleGeneralTool = () => {
    // Spend focus
    if (!spendFocus(1, "Counselor")) return;

    // Spend money
    const cost = getLocalAmount(250);
    applyMoneyDelta(-cost, "Counselor", { allowCreditMessage: true });

    // Apply stress reduction only
    applyStress(-0.5, "Counselor");

    // Mark counselor used this year
    const newCounselorByAge = {
      ...counselorByAge,
      [currentYear]: { used: true, target: 'self', workedOnId: null }
    };

    updateState({
      familyPatterns: {
        ...familyPatterns,
        counselorByAge: newCounselorByAge
      }
    });

    // Log
    addLog(`🧠 Counselor — Learned a general calming routine.`);

    // Timeline
    recordTimelineEntry({
      kind: 'counselor',
      title: `🧠 Counselor — General Session`,
      detail: 'You learned a calming routine and practiced it once.',
      deltas: null,
      moneyDelta: -cost,
      loveDelta: 0,
      stressDelta: -0.5,
      meta: null
    });

    // Emit action result
    emitActionResult({
      actionId: 'counselor',
      title: '🧠 Counselor Session',
      body: 'You learned a calming routine and practiced it once.',
      deltas: null,
      loveDelta: 0,
      stressDelta: -0.5,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['counselor', 'care'],
      meta: { emoji: '🧠' }
    });

    // Close modal
    onClose();
  };

  const handleWorkOnPartner = (pattern) => {
    // Spend focus
    if (!spendFocus(1, "Counselor")) return;

    // Spend money
    const cost = getLocalAmount(250);
    applyMoneyDelta(-cost, "Counselor", { allowCreditMessage: true });

    // Apply effects
    applyStress(-0.5, "Counselor");

    // Improve partner relationship (+4)
    const relationships = gameState.relationships || { roster: [], byId: {} };
    const partnerRel = relationships.roster.find(r => r.name === partnerName);
    if (partnerRel) {
      const newMeter = Math.min(100, (partnerRel.meter || 80) + 4);
      const updatedRoster = relationships.roster.map(r => 
        r.name === partnerName ? { ...r, meter: newMeter } : r
      );
      updateState({
        relationships: {
          ...relationships,
          roster: updatedRoster,
          byId: {
            ...relationships.byId,
            [partnerRel.id]: { ...relationships.byId[partnerRel.id], meter: newMeter }
          }
        }
      });
    }

    // Reduce severity
    const currentSeverity = partnerSeverityById[pattern.id] || 0;
    const newSeverity = Math.max(0, currentSeverity - 1);
    const nowResolved = newSeverity === 0;

    const newSeverityById = { ...partnerSeverityById, [pattern.id]: newSeverity };
    const newResolvedById = { ...partnerResolvedById };
    const newResolvedAtAgeById = { ...partnerResolvedAtAgeById };

    if (nowResolved) {
      newResolvedById[pattern.id] = true;
      newResolvedAtAgeById[pattern.id] = currentYear;
    }

    // Mark counselor used this year
    const newCounselorByAge = {
      ...counselorByAge,
      [currentYear]: { used: true, target: 'partner', workedOnId: pattern.id }
    };

    updateState({
      partnerPatterns: {
        ...partnerPatterns,
        severityById: newSeverityById,
        resolvedById: newResolvedById,
        resolvedAtAgeById: newResolvedAtAgeById
      },
      familyPatterns: {
        ...familyPatterns,
        counselorByAge: newCounselorByAge
      }
    });

    // Grant spillover buffer for 1–2 years
    grantPartnerCounselingBuffer(2);

    // Log
    addLog(`🧠 Counselor — You supported ${partnerName} on ${pattern.label}. Intensity eased.`);

    // Timeline
    recordTimelineEntry({
      kind: 'counselor',
      title: `🧠 Counselor — Supported ${partnerName}`,
      detail: `You supported ${partnerName} on ${pattern.label}. Intensity eased.`,
      deltas: null,
      moneyDelta: -cost,
      loveDelta: 0,
      stressDelta: -0.5,
      meta: { patternId: pattern.id, target: 'partner', nowResolved }
    });

    // Emit action result
    const resolvedLine = nowResolved ? '\n\nResolved ✅' : '';
    const bodyText = `You supported ${partnerName} with: ${pattern.label}\n\nIt takes teamwork to break cycles.${resolvedLine}`;

    emitActionResult({
      actionId: 'counselor',
      title: '🧠 Counselor Session',
      body: bodyText,
      deltas: null,
      loveDelta: 0,
      stressDelta: -0.5,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['counselor', 'care', 'partner'],
      meta: { 
        emoji: '🧠', 
        pattern: pattern.label,
        target: 'partner',
        nowResolved 
      }
    });

    // Close modal
    onClose();
  };

  const partnerActivePatterns = partnerSelectedIds
    .filter(id => (partnerSeverityById[id] || 0) > 0 && !partnerResolvedById[id])
    .map(id => {
      const catalogEntry = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
      return {
        id,
        ...catalogEntry,
        severity: partnerSeverityById[id] || 0
      };
    });

  const partnerResolvedPatterns = partnerSelectedIds
    .filter(id => (partnerSeverityById[id] || 0) === 0 || partnerResolvedById[id])
    .map(id => {
      const catalogEntry = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
      return {
        id,
        ...catalogEntry,
        resolvedAtAge: partnerResolvedAtAgeById[id]
      };
    });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[110]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🧠 Counselor</h3>
                  <p className="text-sm text-slate-500">A guided check-in (game system).</p>
                  <p className="text-xs text-slate-400 mt-0.5">Not medical advice.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Tab Toggle (only if partner exists) */}
              {hasPartner && (
                <div className="px-6 pt-4 pb-2 flex-shrink-0">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => setActiveTab('self')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'self'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      You
                    </button>
                    <button
                      onClick={() => setActiveTab('partner')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'partner'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {partnerName || 'Partner'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Self Tab Content */}
                {activeTab === 'self' && (
                  <>
                    {/* No patterns selected */}
                    {selectedIds.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-slate-600 mb-6">No patterns selected this run.</p>
                        <Button
                          onClick={handleGeneralTool}
                          disabled={alreadyUsedThisYear}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          Learn a general tool
                        </Button>
                        {alreadyUsedThisYear && (
                          <p className="text-xs text-slate-400 mt-2">Already did a session this year.</p>
                        )}
                        <p className="text-xs text-slate-500 mt-3">
                          Cost: 1 Focus • {formatBaseToLocal(250)} • Stress -0.5
                        </p>
                      </div>
                    )}

                    {/* Active Patterns */}
                    {activePatterns.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Active Patterns
                    </h4>
                    <div className="space-y-3">
                      {activePatterns.map(pattern => (
                        <div key={pattern.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <div className="mb-2">
                            <div className="font-semibold text-slate-800 mb-1">{pattern.label}</div>
                            <div className="text-xs text-slate-600 mb-2">{pattern.short}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Intensity:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3].map(level => (
                                  <div
                                    key={level}
                                    className={`w-2 h-2 rounded-full ${
                                      level <= pattern.severity ? 'bg-amber-500' : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleLearn(pattern)}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Learn
                            </Button>
                            <Button
                              onClick={() => handleWorkOn(pattern)}
                              disabled={alreadyUsedThisYear}
                              size="sm"
                              className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                            >
                              Work on this
                            </Button>
                          </div>
                          {alreadyUsedThisYear && (
                            <p className="text-[10px] text-slate-400 mt-2">Session limit: once per year</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Work on this: 1 Focus • {formatBaseToLocal(250)} • Stress -0.5 • Love +0.1
                    </p>
                  </div>
                )}

                    {/* Resolved Patterns */}
                    {resolvedPatterns.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Resolved Patterns
                        </h4>
                        <div className="space-y-2">
                          {resolvedPatterns.map(pattern => (
                            <div key={pattern.id} className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-600">✅</span>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-slate-800">{pattern.label}</div>
                                  {pattern.resolvedAtAge && (
                                    <div className="text-xs text-slate-500">Resolved at Age {pattern.resolvedAtAge}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Partner Tab Content */}
                {activeTab === 'partner' && (
                  <>
                    {/* Active Partner Patterns */}
                    {partnerActivePatterns.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          {partnerName || 'Partner'}'s Active Patterns
                        </h4>
                        <div className="space-y-3">
                          {partnerActivePatterns.map(pattern => (
                            <div key={pattern.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                              <div className="mb-2">
                                <div className="font-semibold text-slate-800 mb-1">{pattern.label}</div>
                                <div className="text-xs text-slate-600 mb-2">{pattern.short}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Intensity:</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3].map(level => (
                                      <div
                                        key={level}
                                        className={`w-2 h-2 rounded-full ${
                                          level <= pattern.severity ? 'bg-amber-500' : 'bg-slate-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleLearn(pattern)}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  Learn
                                </Button>
                                <Button
                                  onClick={() => handleWorkOnPartner(pattern)}
                                  disabled={alreadyUsedThisYear}
                                  size="sm"
                                  className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                                >
                                  Work on this
                                </Button>
                              </div>
                              {alreadyUsedThisYear && (
                                <p className="text-[10px] text-slate-400 mt-2">Session limit: once per year</p>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                          Work on this: 1 Focus • {formatBaseToLocal(250)} • Stress -0.5 • Partner +4
                        </p>
                      </div>
                    )}

                    {/* Resolved Partner Patterns */}
                    {partnerResolvedPatterns.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          Resolved Patterns
                        </h4>
                        <div className="space-y-2">
                          {partnerResolvedPatterns.map(pattern => (
                            <div key={pattern.id} className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-600">✅</span>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-slate-800">{pattern.label}</div>
                                  {pattern.resolvedAtAge && (
                                    <div className="text-xs text-slate-500">Resolved at Age {pattern.resolvedAtAge}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <PatternLearnModal
            open={learnModalOpen}
            pattern={selectedPattern}
            onClose={() => {
              setLearnModalOpen(false);
              setSelectedPattern(null);
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}