import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney, createSeededRng } from './GameStateContext';
import { applyEmergencyChoice } from './emergencySystem';

export default function EmergencyModal({ open, onClose }) {
  const { gameState, updateState, addLog, recordTimelineEntry, applyMoneyDelta, applyStress } = useGameState();
  
  const payload = gameState?.emergency?.pending;
  
  const handleChoice = (optionId) => {
    const option = (payload.options || []).find(o => o.id === optionId);
    if (!option) return;
    
    // Build deterministic RNG for choice application
    const seed = `${gameState.runSeed}|emergencyChoice|year:${gameState.currentYear}|id:${payload.id}|choice:${optionId}`;
    const rng = createSeededRng(seed);
    
    // Apply effects
    const finalCost = Math.round(payload.baseCost * option.costMult);
    const finalStress = Math.round(payload.baseStress * option.stressMult);
    
    // Update state atomically
    updateState(prev => {
      const next = applyEmergencyChoice(prev, payload, optionId, rng);
      return {
        ...next,
        emergency: {
          ...(next.emergency || {}),
          pending: null
        }
      };
    });
    
    // Build outcome message
    const displayName = payload.victimLabel || payload.victimName;
    let outcomeText = '';
    if (payload.type === 'home') {
      outcomeText = `You chose: ${option.label}.\n\nCost: $${formatMoney(finalCost)} • Stress +${finalStress}`;
    } else if (payload.type === 'accident') {
      if (payload.fatal) {
        outcomeText = `${displayName} is gone.\n\nCost: $${formatMoney(finalCost)} • Stress +${finalStress}`;
      } else {
        outcomeText = `${displayName} will recover, but it's a long road.\n\nCost: $${formatMoney(finalCost)} • Stress +${finalStress}`;
      }
    }
    
    // Log
    addLog(`🚨 Emergency: ${payload.title}`);
    
    // Timeline entry
    recordTimelineEntry({
      kind: 'emergency',
      title: payload.title,
      detail: `${payload.description}\n\n${outcomeText}`,
      deltas: null,
      moneyDelta: -finalCost,
      loveDelta: 0,
      stressDelta: finalStress,
      meta: { emergencyType: payload.type, victimRole: payload.victimRole, fatal: payload.fatal }
    });
    
    // Close
    onClose?.();
  };
  
  // Defensive: never render without valid payload (AFTER hooks)
  if (!payload) return null;
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
          <div className="text-3xl mb-2">🚨</div>
          <h2 className="text-2xl font-bold mb-1">Emergency</h2>
          <p className="text-white/90 text-sm">Year {payload.year}</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="text-xl font-bold text-slate-800 mb-2">{payload.title}</div>
            <p className="text-sm text-slate-700 leading-relaxed">{payload.description}</p>
          </div>
          
          {/* Impact preview */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-red-800 mb-2">Impact Preview</div>
            <div className="space-y-1 text-xs text-red-900">
              <div>Base cost: ${formatMoney(payload.baseCost)}</div>
              <div>Base stress: +{payload.baseStress}</div>
              {payload.fatal && (
                <div className="text-red-700 font-semibold mt-2">This is fatal. {payload.victimLabel || payload.victimName} will not survive.</div>
              )}
            </div>
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {(payload.options || []).map(opt => {
              const finalCost = Math.round(payload.baseCost * opt.costMult);
              const finalStress = Math.round(payload.baseStress * opt.stressMult);
              
              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-red-400 hover:bg-red-50 transition-all"
                >
                  <div className="font-semibold text-slate-800 mb-2">{opt.label}</div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Cost: ${formatMoney(finalCost)}</div>
                    <div>Stress: +{finalStress}</div>
                    {opt.addsDebt && (
                      <div className="text-amber-700 font-medium">Spreads cost over time (may add debt)</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}