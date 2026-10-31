import React from 'react';
import { Building, BookOpen, AlertTriangle, Coffee } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { PTA_RANKS, WEEKLY_CHARGES } from './ptaData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LodgeTab() {
  const { gameState, updatePTA, updateState, applyStress, applyDeltas } = useGameState();
  const { pta } = gameState;
  
  const rankInfo = PTA_RANKS[pta.rank?.toUpperCase()] || PTA_RANKS.OBSERVER;
  const nextRank = Object.values(PTA_RANKS).find(r => r.tier === rankInfo.tier + 1);

  const handleCharge = () => {
    // Placeholder: Assign a random charge if none exists
    if (!pta.weeklyCharge) {
      const charge = WEEKLY_CHARGES[Math.floor(Math.random() * WEEKLY_CHARGES.length)];
      updatePTA({ weeklyCharge: charge });
      toast.success(`New Weekly Charge: ${charge.label}`);
    } else {
        toast.info("You already have an active charge.");
    }
  };

  const completeCharge = () => {
      if (!pta.weeklyCharge) return;
      
      // Reward
      updatePTA(prev => ({
          stats: { ...prev.stats, influence: prev.stats.influence + 5, heat: Math.max(0, prev.stats.heat - 5) },
          weeklyCharge: null
      }));
      applyDeltas({ discipline: 1 }, "PTA Charge");
      toast.success("Charge Completed! Influence +5, Heat -5");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-500" />
            Current Standing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Rank</div>
                <div className="text-xl font-bold text-amber-400">{rankInfo.label}</div>
                {nextRank && (
                    <div className="text-xs text-slate-500 mt-2">
                        Next: {nextRank.label} (Req: {nextRank.reqInfluence} Inf)
                    </div>
                )}
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Oath Path</div>
                <div className="text-sm text-slate-300 italic">"I serve the whole school, but mostly my kid."</div>
            </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Weekly Charge
        </h3>
        {pta.weeklyCharge ? (
            <div className="bg-slate-900 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <div className="font-medium text-slate-200">{pta.weeklyCharge.label}</div>
                    <div className="text-xs text-slate-400 capitalize">Type: {pta.weeklyCharge.type}</div>
                </div>
                <Button onClick={completeCharge} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Complete
                </Button>
            </div>
        ) : (
            <div className="text-center py-8 text-slate-400">
                <p className="mb-4">No active charge for this week.</p>
                <Button onClick={handleCharge} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Receive Charge
                </Button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" className="bg-slate-800 hover:bg-slate-700 h-24 flex flex-col gap-2">
              <Coffee className="w-6 h-6 text-amber-300" />
              <span>Ask the Archivist</span>
              <span className="text-xs font-normal text-slate-400 opacity-70">Get a hint (Cost: 1 Favor)</span>
          </Button>
          <Button variant="secondary" className="bg-slate-800 hover:bg-slate-700 h-24 flex flex-col gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span>Take a Hiatus</span>
              <span className="text-xs font-normal text-slate-400 opacity-70">Reduces Heat, pauses progress</span>
          </Button>
      </div>
    </div>
  );
}