import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, DollarSign } from "lucide-react";
import { formatMoney } from './GameStateContext';

const GOAL_OPTIONS = [
  { id: 'masters', label: 'Masters Degree', amount: 40000, emoji: '🎓', desc: 'Advanced degree. Opens new career paths.' },
  { id: 'phd', label: 'PhD', amount: 80000, emoji: '📜', desc: 'The highest academic honor.' },
  { id: 'house', label: 'House', amount: 60000, emoji: '🏡', desc: 'Down payment for a family home.' },
  { id: 'business', label: 'Start a Business', amount: 25000, emoji: '💼', desc: 'Capital to launch your own venture.' },
  { id: 'retirement', label: 'Retire Early', amount: 500000, emoji: '🏖️', desc: 'Financial independence.' },
  { id: 'travel', label: 'World Tour', amount: 20000, emoji: '🌍', desc: 'See the world with your family.' }
];

export default function GoalSetupModal({ open, onClose, onSave, currentGoal }) {
  const [selectedId, setSelectedId] = useState(currentGoal?.id || null);

  const handleSave = () => {
    if (!selectedId) return;
    const option = GOAL_OPTIONS.find(o => o.id === selectedId);
    if (option) {
      onSave({
        id: option.id,
        label: option.label,
        amount: option.amount,
        emoji: option.emoji
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set a Financial Goal</DialogTitle>
          <DialogDescription>
            What are you saving for? Setting a target helps you track progress.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3 py-2">
            {GOAL_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <div 
                  key={option.id}
                  onClick={() => setSelectedId(option.id)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' 
                      : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                      {option.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800">{option.label}</h4>
                        <div className="flex items-center text-emerald-700 font-mono text-sm bg-emerald-100 px-2 py-0.5 rounded">
                          <DollarSign className="w-3 h-3 mr-0.5" />
                          {formatMoney(option.amount)}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 leading-snug">
                        {option.desc}
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-[-8px] right-[-8px] bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedId}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Set Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}