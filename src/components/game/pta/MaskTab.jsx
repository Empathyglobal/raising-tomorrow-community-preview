import React from 'react';
import { Eye, ShieldAlert, MessageSquare } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MaskTab() {
  const { gameState, updatePTA } = useGameState();
  const { pta } = gameState;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Public Narrative
        </h3>
        <p className="text-sm text-slate-400 mb-4">
            Control what the school thinks you are doing.
        </p>
        
        <div className="grid grid-cols-1 gap-2">
            <button className="bg-slate-900 p-3 rounded-lg border border-amber-500/50 text-left">
                <div className="font-bold text-amber-500 text-sm">"Just trying to help"</div>
                <div className="text-xs text-slate-500">Lowers expectations. Reduces Heat slowly.</div>
            </button>
            <button className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-left hover:border-slate-500 opacity-60">
                <div className="font-bold text-slate-300 text-sm">"The Efficiency Expert"</div>
                <div className="text-xs text-slate-500">Increases Influence gain, higher Heat risk.</div>
            </button>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Leak Control
        </h3>
        
        <div className="space-y-3">
             <div className="bg-slate-900 p-3 rounded-lg flex items-center justify-between">
                <div className="text-sm text-slate-300">Respond to Rumors</div>
                <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                    <MessageSquare className="w-4 h-4 mr-1" /> Group Chat
                </Button>
             </div>
             <Button className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50">
                 Resign Quietly (Emergency Exit)
             </Button>
        </div>
      </div>
    </div>
  );
}