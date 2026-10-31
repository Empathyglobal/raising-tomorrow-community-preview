import React from 'react';
import { FileText, EyeOff, Flame } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { PTA_NPCS } from './ptaData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DossierTab() {
  const { gameState, updatePTA } = useGameState();
  const { pta } = gameState;

  // Placeholder logic for known info
  const getKnownInfo = (npcId) => {
      // In real implementation, check pta.dossiers[npcId].known array
      return ["Role: " + PTA_NPCS.find(n => n.id === npcId).role];
  };

  const updateDossier = (npcId) => {
      toast.success("Observing... (Placeholder)");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PTA_NPCS.map(npc => (
          <div key={npc.id} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="xs" variant="destructive" className="h-6 text-[10px]" onClick={() => toast.success("Burned dossier!")}>
                      <Flame className="w-3 h-3 mr-1" /> Burn
                  </Button>
              </div>
              
              <div className="flex items-start justify-between mb-3">
                  <div>
                      <h4 className="font-bold text-slate-200">{npc.name}</h4>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">CONFIDENTIAL</p>
                  </div>
                  <FileText className="w-5 h-5 text-slate-600" />
              </div>

              <div className="space-y-2 mb-4">
                  <div className="bg-slate-900/50 p-2 rounded text-xs text-slate-300 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase">Alignment</span>
                      {npc.alignment}
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded text-xs text-slate-300 border border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase">Leverage</span>
                      Unknown
                  </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-slate-600 text-slate-400 hover:bg-slate-700"
                onClick={() => updateDossier(npc.id)}
              >
                  <EyeOff className="w-3 h-3 mr-2" />
                  Update Intel
              </Button>
          </div>
      ))}
    </div>
  );
}