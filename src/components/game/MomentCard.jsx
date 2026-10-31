import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { splitScenarioText } from './scenarioTextUtils';

export default function MomentCard({ onOpenScenario }) {
  const navigate = useNavigate();
  const { gameState, countUnlockedTechniques, rerollTip } = useGameState();
  const { scenarioPending, scenarioCompletedThisAge, currentScenario, currentScenarioResolvedChoice, lastChangeText, tipText, debugUI } = gameState;
  const unlockedCount = countUnlockedTechniques();

  // Safety: Fallback if tipText is missing
  const displayTip = tipText || "Tip: You're doing your best.";

  // Show pending scenario (modal will auto-open)
  if (scenarioPending && currentScenario) {
    const { body } = splitScenarioText(currentScenario.scenarioText);
    const preview = body.slice(0, 100) + (body.length > 100 ? '...' : '');
    
    return (
      <motion.div 
        className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl p-6 shadow-lg border-2 border-orange-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl font-bold text-orange-900 mb-3">A Moment Arrives</h2>
        <p className="text-slate-700 text-sm mb-4 leading-relaxed">{preview}</p>
        <div className="bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
          <p className="text-xs text-orange-800 font-medium text-center">
            The scenario will open automatically...
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-orange-200 mt-3">
          <p className="text-xs text-slate-600 italic flex-1">{displayTip}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              rerollTip();
            }}
            className="px-2 py-1 bg-orange-100 hover:bg-orange-200 rounded text-xs text-orange-700 font-medium transition-colors flex-shrink-0"
            title="Get a different tip"
          >
            🔄 New tip
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-300"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {lastChangeText && (
        <div className="bg-amber-50 rounded-lg px-3 py-2 mb-3 border border-amber-200">
          <p className="text-xs text-amber-800 font-medium">Δ {lastChangeText}</p>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-600 italic flex-1">{displayTip}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            rerollTip();
          }}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700 font-medium transition-colors flex-shrink-0"
          title="Get a different tip"
        >
          🔄 New tip
        </button>
      </div>
    </motion.div>
  );
}