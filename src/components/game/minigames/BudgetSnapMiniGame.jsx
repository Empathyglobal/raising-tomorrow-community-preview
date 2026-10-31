import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useGameState, formatMoney, hasAnyChild } from '@/components/game/GameStateContext';
import { toast } from 'sonner';

const BUDGET_BUCKETS = [
  {
    id: 'retirement',
    emoji: '🧓',
    name: 'Retirement',
    subtitle: 'Long-term security',
  },
  {
    id: 'savings',
    emoji: '🐷',
    name: 'Emergency Fund',
    subtitle: 'Safety net for surprises',
  },
  {
    id: 'fun',
    emoji: '🎉',
    name: 'Quality of Life',
    subtitle: 'Treats, breaks, joy',
  },
  {
    id: 'childcare',
    emoji: '🧸',
    name: 'Family / Childcare',
    subtitle: 'Activities, gear, support',
  }
];

const PRESETS = {
  balanced: { retirement: 0.25, savings: 0.25, fun: 0.25, childcare: 0.25 },
  saver: { retirement: 0.35, savings: 0.45, fun: 0.10, childcare: 0.10 },
  kidFirst: { retirement: 0.15, savings: 0.15, fun: 0.20, childcare: 0.50 },
  treatYourself: { retirement: 0.10, savings: 0.10, fun: 0.60, childcare: 0.20 }
};

export default function BudgetSnapMiniGame({ open, onComplete, onClose: onCloseFromParent }) {
  const { gameState, applyDeltas, applyStress, applyLove, recordTimelineEntry, applyMoneyDelta, updateState, applyBabyPressure } = useGameState();
  
  const hasChild = hasAnyChild(gameState);
  
  // Compute current money
  const currentMoney = Math.max(0, Math.round(Number(gameState.money || 0)));
  
  // Freeze allocatable amount when modal opens (snapshot to prevent reset loop)
  const [allocatableAtOpen, setAllocatableAtOpen] = useState(0);
  const prevOpenRef = useRef(false);
  
  // Compute dynamic step size based on frozen allocatable
  const step = Math.max(25, Math.min(250, Math.round(allocatableAtOpen / 50)));
  
  // Local allocation state (dollars)
  const [allocation, setAllocation] = useState({
    retirement: 0,
    savings: 0,
    fun: 0,
    childcare: 0
  });
  
  const [showResult, setShowResult] = useState(false);
  const resolvedRef = useRef(false);

  // Reset state ONLY when modal opens (not when money changes)
  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      setAllocatableAtOpen(currentMoney);
      setShowResult(false);
      setAllocation({
        retirement: 0,
        savings: 0,
        fun: 0,
        childcare: 0
      });
      resolvedRef.current = false;
    }
    prevOpenRef.current = open;
  }, [open, currentMoney]);

  // Calculate total allocated
  const totalAllocated = allocation.retirement + allocation.savings + allocation.fun + allocation.childcare;
  const remaining = allocatableAtOpen - totalAllocated;
  
  // Adjust allocation with clamping
  const adjustBucket = (bucketId, newAmount) => {
    const clamped = Math.max(0, Math.min(allocatableAtOpen - (totalAllocated - allocation[bucketId]), Math.round(newAmount)));
    setAllocation(prev => ({ ...prev, [bucketId]: clamped }));
  };
  
  // Preset handlers
  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    
    const roundToStep = (val) => Math.round(val / step) * step;
    
    setAllocation({
      retirement: roundToStep(allocatableAtOpen * preset.retirement),
      savings: roundToStep(allocatableAtOpen * preset.savings),
      fun: roundToStep(allocatableAtOpen * preset.fun),
      childcare: roundToStep(allocatableAtOpen * preset.childcare)
    });
  };
  
  // Adapt bucket labels when child-free
  const buckets = hasChild
    ? BUDGET_BUCKETS
    : BUDGET_BUCKETS.map(b =>
        b.id === 'childcare'
          ? { ...b, emoji: '🍼', name: 'Family Planning', subtitle: 'Talks, tests, therapy, options' }
          : b
      );

  // Compute tiers and effects
  const threshold = Math.max(200, allocatableAtOpen * 0.15);
  const tierSavings = Math.min(3, Math.floor(allocation.savings / threshold));
  const tierRetire = Math.min(3, Math.floor(allocation.retirement / threshold));
  const tierFun = Math.min(3, Math.floor(allocation.fun / threshold));
  const tierChild = Math.min(3, Math.floor(allocation.childcare / threshold));
  
  // Immediate effects
  const stressDelta = -Math.min(3, tierFun + Math.floor(tierSavings / 2));
  const loveDelta = hasChild ? Math.min(2, tierChild) : 0;
  const disciplineDelta = Math.min(2, tierSavings);
  const babyPressureDelta = hasChild ? 0 : -Math.min(10, tierChild * 3);
  
  // Next-year buffs
  const buffs = {
    safetyNet: tierSavings,
    retirementBoost: tierRetire,
    relationshipBoost: tierFun,
    childcareBoost: tierChild
  };
  
  // Plan style rating
  const getPlanStyle = () => {
    if (totalAllocated === 0) return 'Cash Hoarder';
    if (tierSavings >= 2 && tierRetire >= 2) return 'Future Planner';
    if (tierChild >= 2) return hasChild ? 'Kid-First Parent' : 'Future Plans';
    if (tierFun >= 2) return 'Quality of Life';
    return 'Balanced';
  };
  
  const handleConfirm = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    
    // Subtract allocated money from cash
    applyMoneyDelta(-totalAllocated, { source: 'Year-End Budget Plan', category: 'savings' });
    
    // Track retirement and savings funds (using correct state keys)
    updateState(prev => ({
      retirementSavings: (prev.retirementSavings || 0) + allocation.retirement,
      emergencyFund: (prev.emergencyFund || 0) + allocation.savings,
      yearBudgetBuffs: buffs
    }));
    
    // Apply immediate effects
    if (stressDelta !== 0) applyStress(stressDelta, "Budget Planning");
    if (loveDelta !== 0) applyLove(loveDelta, "Budget Planning");
    if (disciplineDelta !== 0) applyDeltas({ discipline: disciplineDelta }, "Budget Planning");
    if (!hasChild && babyPressureDelta) {
      applyBabyPressure(babyPressureDelta, 'Budget: Family Planning');
    }
    
    // Timeline entry
    const lines = [];
    if (allocation.savings > 0) lines.push(`Savings: $${formatMoney(allocation.savings)}`);
    if (allocation.retirement > 0) lines.push(`Retirement: $${formatMoney(allocation.retirement)}`);
    if (allocation.fun > 0) lines.push(`Fun: $${formatMoney(allocation.fun)}`);
    if (allocation.childcare > 0) {
      lines.push(hasChild ? `Childcare: $${formatMoney(allocation.childcare)}` : `Family Planning: $${formatMoney(allocation.childcare)}`);
    }
    if (remaining > 0) lines.push(`Carryover: $${formatMoney(remaining)}`);
    
    const effectLines = [];
    if (stressDelta !== 0) effectLines.push(`Stress ${stressDelta}`);
    if (loveDelta !== 0) effectLines.push(`Love +${loveDelta}`);
    if (disciplineDelta !== 0) effectLines.push(`Discipline +${disciplineDelta}`);
    if (tierSavings > 0) effectLines.push(`Safety Net +${tierSavings}`);
    if (!hasChild && babyPressureDelta) effectLines.push(`Baby Pressure ${babyPressureDelta}`);
    
    recordTimelineEntry({
      kind: 'budget',
      title: '📊 Year-End Budget Plan',
      detail: `${lines.join(' • ')}\n\n${effectLines.join(' • ')}`,
      deltas: disciplineDelta > 0 ? { discipline: disciplineDelta } : null,
      stressDelta,
      loveDelta,
      moneyDelta: 0
    });
    
    toast.success('Budget plan saved!', { icon: '📊' });
    
    // Immediately complete and close (1-step flow)
    onComplete?.({ 
      allocation, 
      totalAllocated,
      remaining,
      effects: { stressDelta, loveDelta, disciplineDelta },
      buffs
    });
  };

  const handleSkip = () => {
    if (resolvedRef.current) return;
    
    // Auto-plan (balanced preset) - compute allocation first
    const preset = PRESETS['balanced'];
    const roundToStep = (val) => Math.round(val / step) * step;
    
    const presetAllocation = {
      retirement: roundToStep(allocatableAtOpen * preset.retirement),
      savings: roundToStep(allocatableAtOpen * preset.savings),
      fun: roundToStep(allocatableAtOpen * preset.fun),
      childcare: roundToStep(allocatableAtOpen * preset.childcare)
    };
    
    setAllocation(presetAllocation);
    
    // Wait for state to update, then confirm
    setTimeout(() => handleConfirm(), 50);
  };
  
  const handleKeepCash = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    
    toast('Kept all cash', { icon: '💵' });
    onComplete?.({ skipped: true, keptCash: true });
  };
  
  const handleResultContinue = () => {
    // Callback with results (parent handles closing/advancing)
    onComplete?.({ 
      allocation, 
      totalAllocated,
      remaining,
      effects: { stressDelta, loveDelta, disciplineDelta },
      buffs
    });
  };
  
  const handleClose = () => {
    if (resolvedRef.current) return;
    handleKeepCash();
  };

  if (!open) return null;
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <>
                {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">📊 Year-End Budget Plan</h3>
                      <p className="text-sm text-slate-500">You finished the year with <span className="font-bold text-emerald-600">${formatMoney(allocatableAtOpen)}</span> available.</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-6 py-4 space-y-4">
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
                      Allocate money into buckets. Any unallocated money stays as cash.
                    </div>

                    {/* Quick presets */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                       { key: 'balanced', label: 'Balanced', icon: '⚖️' },
                       { key: 'saver', label: 'Saver', icon: '🐷' },
                       { key: 'kidFirst', label: hasChild ? 'Kid-First' : 'Future Plans', icon: hasChild ? '🧸' : '🍼' },
                       { key: 'treatYourself', label: 'Treat Yourself', icon: '🎉' }
                      ].map(p => (
                        <button
                          key={p.key}
                          onClick={() => applyPreset(p.key)}
                          className="h-10 rounded-lg border-2 border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Total tracker */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-semibold text-slate-700">Allocated</span>
                        <span className="font-bold text-slate-800">${formatMoney(totalAllocated)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-slate-700">Remaining (Carryover)</span>
                        <span className="font-bold text-emerald-600">${formatMoney(remaining)}</span>
                      </div>
                    </div>

                    {/* Budget buckets */}
                    {buckets.map(bucket => {
                      const value = allocation[bucket.id] || 0;
                      
                      return (
                        <div key={bucket.id} className="bg-white border-2 border-slate-200 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{bucket.emoji}</span>
                              <div>
                                <div className="font-bold text-slate-800">{bucket.name}</div>
                                <div className="text-xs text-slate-500">{bucket.subtitle}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-slate-800">${formatMoney(value)}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => adjustBucket(bucket.id, value - step)}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-slate-600" />
                            </button>
                            
                            <Slider
                              value={[value]}
                              onValueChange={([newValue]) => adjustBucket(bucket.id, newValue)}
                              max={allocatableAtOpen}
                              step={step}
                              className="flex-1"
                            />
                            
                            <button
                              onClick={() => adjustBucket(bucket.id, value + step)}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Projected benefits */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                      <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        Projected Benefits
                      </div>
                      <div className="space-y-1 text-sm">
                        {stressDelta !== 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Stress change:</span>
                            <span className="font-medium text-slate-800">{stressDelta}</span>
                          </div>
                        )}
                        {loveDelta > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Love boost:</span>
                            <span className="font-medium text-slate-800">+{loveDelta}</span>
                          </div>
                        )}
                        {disciplineDelta > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Discipline boost:</span>
                            <span className="font-medium text-slate-800">+{disciplineDelta}</span>
                          </div>
                        )}
                        {tierSavings > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Safety Net (next year):</span>
                            <span className="font-medium text-slate-800">+{tierSavings}</span>
                          </div>
                        )}
                        {tierRetire > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Future Wealth Growth:</span>
                            <span className="font-medium text-slate-800">+{tierRetire}</span>
                          </div>
                        )}
                        {tierFun > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Relationship Buffer:</span>
                            <span className="font-medium text-slate-800">+{tierFun}</span>
                          </div>
                        )}
                        {hasChild && tierChild > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Childcare Support:</span>
                            <span className="font-medium text-slate-800">+{tierChild}</span>
                          </div>
                        )}
                        {!hasChild && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Baby Pressure (current):</span>
                              <span className="font-medium text-slate-800">{Math.round(gameState.babyPressure || 0)}/100</span>
                            </div>
                            {babyPressureDelta && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Baby Pressure Relief:</span>
                                <span className="font-medium text-emerald-600">{babyPressureDelta}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        onClick={handleConfirm}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                      >
                        Confirm Plan
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={handleSkip}
                          variant="outline"
                          className="h-10 text-sm"
                        >
                          Auto-plan
                        </Button>
                        <Button
                          onClick={handleKeepCash}
                          variant="outline"
                          className="h-10 text-sm"
                        >
                          Keep Cash
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}