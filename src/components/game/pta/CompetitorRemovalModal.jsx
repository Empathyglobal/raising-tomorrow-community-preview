import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { REMOVAL_ACTIONS } from './ptaData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGameState } from '@/components/game/GameStateContext';

export default function CompetitorRemovalModal({ target, onClose }) {
  const { gameState, updatePTA } = useGameState();
  const { pta } = gameState;

  if (!target) return null;

  const handleExecute = (action) => {
      // Check prereqs (rank, etc)
      // Apply costs (Heat, Integrity)
      // Apply outcome
      toast.success(`Executed ${action.label} on ${target.name}`);
      
      updatePTA(prev => ({
          stats: {
              ...prev.stats,
              heat: prev.stats.heat + action.heatDelta,
              integrity: prev.stats.integrity + action.integrityDelta
          }
      }));
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-slate-950 text-slate-100 rounded-xl border border-red-900/50 shadow-2xl overflow-hidden"
      >
        <div className="bg-red-950/30 p-4 border-b border-red-900/30 flex justify-between items-center">
            <h3 className="font-bold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Target: {target.name}
            </h3>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-slate-400 mb-4">
                Choose a strategy to reduce this competitor's influence. 
                <br/>
                <span className="text-xs italic opacity-70">Warning: Actions carry risk of Heat and Integrity loss.</span>
            </p>

            <div className="space-y-3">
                {REMOVAL_ACTIONS.map(action => (
                    <button
                        key={action.id}
                        onClick={() => handleExecute(action)}
                        className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-3 rounded-lg transition-all group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-200 group-hover:text-white">{action.label}</span>
                            <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                                action.type === 'ethical' ? 'bg-emerald-900/50 text-emerald-400' :
                                action.type === 'ruthless' ? 'bg-red-900/50 text-red-400' :
                                'bg-slate-800 text-slate-400'
                            }`}>{action.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{action.desc}</p>
                        <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                            <span className={action.heatDelta > 0 ? 'text-red-400' : 'text-emerald-400'}>
                                Heat {action.heatDelta > 0 ? '+' : ''}{action.heatDelta}
                            </span>
                            <span className={action.integrityDelta < 0 ? 'text-red-400' : 'text-emerald-400'}>
                                Integrity {action.integrityDelta > 0 ? '+' : ''}{action.integrityDelta}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
}