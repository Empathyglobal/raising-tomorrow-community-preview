import React, { useState } from 'react';
import { Users, Handshake, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useGameState } from '@/components/game/GameStateContext';
import { PTA_NPCS, REMOVAL_ACTIONS } from './ptaData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CompetitorRemovalModal from './CompetitorRemovalModal';

export default function NetworkTab() {
  const { gameState, updatePTA } = useGameState();
  const { pta } = gameState;
  const [removalTarget, setRemovalTarget] = useState(null);

  const handleAction = (npcId, actionType) => {
    toast.info(`Action ${actionType} on ${npcId} coming soon.`);
  };

  const getRelationship = (npcId) => pta.npcRelations?.[npcId] || 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {PTA_NPCS.map(npc => {
            const rel = getRelationship(npc.id);
            return (
                <div key={npc.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${rel > 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                            {npc.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-200">{npc.name}</div>
                            <div className="text-xs text-slate-400">{npc.role} • <span className="text-amber-500/80">{npc.alignment}</span></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-slate-500">Rel</div>
                            <div className={`font-mono font-bold ${rel > 50 ? 'text-emerald-400' : 'text-slate-300'}`}>{rel}%</div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-900 border-slate-700 text-slate-200">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleAction(npc.id, 'request_favor')}>
                                    <Handshake className="w-4 h-4 mr-2" /> Request Favor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction(npc.id, 'offer_favor')}>
                                    <Handshake className="w-4 h-4 mr-2" /> Offer Favor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction(npc.id, 'side_chat')}>
                                    <MessageCircle className="w-4 h-4 mr-2" /> Side Chat
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-700" />
                                <DropdownMenuItem 
                                    onClick={() => setRemovalTarget(npc)}
                                    className="text-red-400 focus:text-red-400"
                                >
                                    Target / Remove...
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            );
        })}
      </div>

      <CompetitorRemovalModal 
        target={removalTarget} 
        onClose={() => setRemovalTarget(null)} 
      />
    </div>
  );
}