import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, tierIcon } from '@/components/game/GameStateContext';
import { getStatDisplayName } from '@/components/game/statLabels';
import { ChevronRight } from 'lucide-react';

export default function DevelopmentSnapshot() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { stats, lastChangeText } = gameState;
  
  return (
    <div 
      onClick={() => navigate(createPageUrl('DevelopmentDetails'))}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Development</h3>
        <button className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
          Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm">
          <span className="mr-1">{tierIcon(stats.intelligence)}</span>
          <span className="font-medium text-slate-700">{getStatDisplayName('intelligence').toUpperCase()} {stats.intelligence}</span>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm">
          <span className="mr-1">{tierIcon(stats.empathy)}</span>
          <span className="font-medium text-slate-700">EMP {stats.empathy}</span>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm">
          <span className="mr-1">{tierIcon(stats.discipline)}</span>
          <span className="font-medium text-slate-700">DIS {stats.discipline}</span>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm">
          <span className="mr-1">{tierIcon(stats.confidence)}</span>
          <span className="font-medium text-slate-700">CON {stats.confidence}</span>
        </div>
      </div>
      
      {lastChangeText && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-600">Δ {lastChangeText}</p>
        </div>
      )}
    </div>
  );
}