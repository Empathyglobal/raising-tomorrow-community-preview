import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PLAN_ACTION_DEFS } from '@/components/game/recommendedPlanSystem';
import { UI_EMOJI } from '@/components/game/uiEmojis';
import { toast } from 'sonner';

export default function RecommendedPlanPreviewModal({ open, plan, actionPoints, onClose, onConfirm }) {
  if (!plan) return null;
  
  const handleConfirm = () => {
    // Validate plan and focus
    if (!plan || !plan.actions || plan.actions.length === 0) {
      toast.error('No plan available');
      return;
    }
    
    if (actionPoints < plan.totalFocusCost) {
      toast.error('Not enough Focus for this plan');
      return;
    }
    
    onConfirm?.();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-xl">Recommended Child Plan</div>
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)] pr-1">
          <div className="space-y-4">
            {/* Reason */}
            <div className="text-sm text-slate-600 text-center">
              {plan.reasonLine}
            </div>
            
            {/* Actions list */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Plan Actions
              </div>
              {plan.actions.map((actionId, idx) => {
                const def = PLAN_ACTION_DEFS[actionId];
                if (!def) return null;
                
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                  >
                    <div className="font-medium text-slate-800">
                      {def.emoji} {def.title}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Cost summary */}
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <div className="text-sm font-semibold text-indigo-900 mb-1">
                Total Cost
              </div>
              <div className="text-sm text-indigo-700">
                {UI_EMOJI.focus} {plan.totalFocusCost} Focus • {plan.actions.length} actions
              </div>
              <div className="text-xs text-indigo-600 mt-1">
                You have: {UI_EMOJI.focus} {actionPoints} Focus
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={actionPoints < plan.totalFocusCost}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold"
          >
            Run Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}