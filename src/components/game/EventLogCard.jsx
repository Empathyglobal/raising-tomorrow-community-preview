import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { ScrollText } from 'lucide-react';

export default function EventLogCard() {
  const { gameState } = useGameState();
  const { log } = gameState;

  const recentLogs = log.slice(0, 8);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <ScrollText className="w-4 h-4 text-slate-400" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Journal</h3>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {recentLogs.map((entry, index) => (
          <div 
            key={index}
            className={`text-sm py-1.5 px-3 rounded-lg transition-opacity ${
              index === 0 
                ? 'bg-amber-50 text-slate-700 border-l-2 border-amber-400' 
                : 'text-slate-500'
            }`}
            style={{ opacity: 1 - (index * 0.1) }}
          >
            {entry}
          </div>
        ))}
        {recentLogs.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center py-4">
            The story begins...
          </p>
        )}
      </div>
    </div>
  );
}