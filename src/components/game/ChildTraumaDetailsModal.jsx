import React from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import { Button } from '@/components/ui/button';

export default function ChildTraumaDetailsModal({ open, trauma, childName = 'your child', onClose }) {
  if (!open || !trauma) return null;

  const desc = trauma.description || '';
  const becauseRaw = trauma.because || 'A moment stuck and shaped their nervous system.';
  const because = String(becauseRaw).replace(/^Because:\s*/i, '');
  const helps = trauma.whatHelps || 'Repair + routines help over time.';
  const hint = trauma.effectsHint || 'Some moments may feel stickier; repair actions matter more.';

  return (
    <GameModalShell open={open} closeOnBackdrop={false} className="max-w-lg bg-white opacity-100">
      <div className="p-6 md:p-7 bg-white opacity-100">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">🩹 {trauma.label}</h3>
          <p className="text-slate-600 text-sm">How this shows up for {childName}</p>
        </div>

        <div className="space-y-5 text-sm">
          {/* What it is */}
          <section>
            <h4 className="font-semibold text-slate-800 mb-1">What it is</h4>
            <p className="text-slate-700 leading-relaxed">{desc}</p>
          </section>

          {/* Why it formed */}
          <section>
            <h4 className="font-semibold text-slate-800 mb-1">Why it formed</h4>
            <p className="text-slate-700 leading-relaxed">{because}</p>
          </section>

          {/* What helps */}
          <section>
            <h4 className="font-semibold text-slate-800 mb-1">What helps</h4>
            <p className="text-slate-700 leading-relaxed">{helps}</p>
          </section>

          {/* In Raising Tomorrow */}
          <section>
            <h4 className="font-semibold text-slate-800 mb-1">In Raising Tomorrow</h4>
            <p className="text-slate-700 leading-relaxed">{hint}</p>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onClose && onClose()}>Close</Button>
        </div>
      </div>
    </GameModalShell>
  );
}