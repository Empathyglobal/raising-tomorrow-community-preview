import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/components/game/GameStateContext";
import { Lightbulb } from "lucide-react";

export default function FunFactModal({ open, onClose, fact, earnedBonus }) {
  const { gameState } = useGameState();
  const childName = gameState?.childName || 'Your child';
  if (!fact) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose?.(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg text-slate-800">{fact.title}</DialogTitle>
          <DialogDescription className="text-slate-500">
            A little science/comedy moment for the family.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Lightbulb className="w-4 h-4" />
            Fun Fact
          </div>
          <div className="text-sm leading-relaxed text-slate-700 space-y-3">
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-600">You</div>
              <p>{fact.adult}</p>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-600">{childName}</div>
              <p>{fact.kid}</p>
            </div>
            {fact.adult2 && (
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600">You</div>
                <p>{fact.adult2}</p>
              </div>
            )}
            <div className="text-[11px] text-slate-500 pt-1">
              {earnedBonus ? "+0.1 Intelligence (Yearly Fun Fact bonus)" : "No bonus — already earned this year."}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}