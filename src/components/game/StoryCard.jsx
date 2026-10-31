import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Sparkles, CloudSun } from 'lucide-react';

export default function StoryCard() {
  const { gameState } = useGameState();
  const { pendingScenario, finished, actionPoints } = gameState;
  
  // Don't render if scenario is pending (handled by modal)
  if (pendingScenario) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-100/50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md flex-shrink-0">
          <CloudSun className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">
            Daily Life
          </h3>
          <div>
            <p className="text-slate-700 leading-relaxed">
              A quiet year. What do you focus on before they grow?
            </p>
            {!finished && (
              <p className="text-xs text-slate-500 mt-2 italic">
                You have {actionPoints} focus token{actionPoints !== 1 ? 's' : ''} before the next Age Up.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}