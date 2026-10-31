import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DailyDilemmaModal({ open, dilemma, streak, paused, onChoose, onClose }) {
  if (!dilemma) return null;
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-3xl mb-2">🌅</div>
            <div className="text-xl">Daily Parenting Dilemma</div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Streak indicator */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
              <span className="text-sm font-semibold text-amber-900">
                🔥 Streak: {streak || 0}
                {paused && <span className="text-xs text-amber-600 ml-1">(paused)</span>}
              </span>
            </div>
          </div>
          
          {/* Prompt */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-slate-800 leading-relaxed">{dilemma.prompt}</p>
          </div>
          
          {/* Choices */}
          <div className="space-y-2">
            {(dilemma.choices || []).map((choice, idx) => (
              <motion.button
                key={choice.id}
                onClick={() => onChoose(choice.id)}
                className="w-full text-left p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="font-medium text-slate-800 mb-1">{choice.label}</div>
                <div className="text-xs text-slate-500">{choice.effectsHint}</div>
              </motion.button>
            ))}
          </div>
          
          <div className="text-xs text-center text-slate-400">
            Complete daily for collectibles & rare diamond bonuses
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}