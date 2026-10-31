import React, { useState } from 'react';
import { Gavel, Users, Lock, Unlock } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { PROCEDURAL_MOVES } from './ptaData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CouncilTab() {
  const { gameState, updatePTA } = useGameState();
  const { pta } = gameState;
  const [sessionType, setSessionType] = useState('open'); // 'open' | 'closed'

  const handleProceduralMove = (move) => {
      // Logic for mini-game
      toast.success(`Used ${move.label}: ${move.effect}`);
      // Cost bandwidth, modify heat/influence
      updatePTA(prev => ({
          stats: {
              ...prev.stats,
              bandwidth: Math.max(0, prev.stats.bandwidth - move.cost),
              influence: prev.stats.influence + 1
          }
      }));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
          <button 
            onClick={() => setSessionType('open')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${sessionType === 'open' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
              <div className="flex items-center justify-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Open Session
              </div>
          </button>
          <button 
            onClick={() => setSessionType('closed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${sessionType === 'closed' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            disabled={pta.rank === 'observer' || pta.rank === 'page'}
          >
              <div className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Closed Session
              </div>
          </button>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
              {sessionType === 'open' ? 'Public PTA Meeting' : 'The Inner Circle'}
          </h3>
          <p className="text-sm text-slate-400 mb-6">
              {sessionType === 'open' 
                ? 'Standard agenda. Bake sales, budgets, and playground repairs.' 
                : 'Where the real decisions happen. High stakes, high secrecy.'}
          </p>
          
          <div className="flex-1 bg-slate-900 rounded-lg p-4 mb-4 border border-slate-800">
              <div className="text-center text-slate-500 italic mt-8">
                  Meeting in progress...
                  <br/>
                  <span className="text-xs">Select a procedural move to intervene.</span>
              </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
              {PROCEDURAL_MOVES.map(move => (
                  <Button 
                    key={move.id} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleProceduralMove(move)}
                    className="border-slate-600 hover:bg-slate-700 text-slate-300 text-xs h-auto py-2 flex flex-col items-center gap-1"
                    disabled={pta.stats.bandwidth < move.cost}
                  >
                      <span className="font-semibold">{move.label}</span>
                      <span className="text-[10px] opacity-70">{move.cost} BW</span>
                  </Button>
              ))}
          </div>
      </div>
    </div>
  );
}