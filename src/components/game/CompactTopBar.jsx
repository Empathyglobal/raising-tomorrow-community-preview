import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function CompactTopBar({ onOpenSettings }) {
  const { gameState } = useGameState();
  const { childName, currentYear, money, actionPoints, maxFocusTokens, love, stress } = gameState;

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2 shadow-md">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white font-bold text-lg">{childName} • Age {currentYear}</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onOpenSettings}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-9 w-9 p-0"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center flex-wrap gap-x-1 gap-y-1 text-[11px] sm:text-xs divide-x divide-slate-400/50">
          <span className="flex items-center gap-1 px-2 text-slate-300">
            <span className="tabular-nums">${Math.round(money)}</span>
          </span>
          <span className="flex items-center gap-1 px-2 text-slate-300">
            <span>Focus</span>
            <span className="tabular-nums">{Math.round(actionPoints)}/{Math.round(maxFocusTokens)}</span>
          </span>
          <span className="flex items-center gap-1 px-2">
            <span className="text-sm sm:text-base">❤️</span>
            <span className="text-rose-400 font-semibold tabular-nums">{Math.round(love)}</span>
          </span>
          <span className="flex items-center gap-1 px-2">
            <span className="text-sm sm:text-base">😮‍💨</span>
            <span className="text-amber-400 font-semibold tabular-nums">{Math.round(stress)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}