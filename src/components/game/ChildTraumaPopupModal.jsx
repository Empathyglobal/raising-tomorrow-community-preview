import React from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import { Button } from '@/components/ui/button';
import ChildTraumaDetailsModal from '@/components/game/ChildTraumaDetailsModal';

export default function ChildTraumaPopupModal({ open, trauma, childName = 'your child', onClose }) {
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    if (!open) setShowDetails(false);
  }, [open]);

  // Defensive: never render without valid trauma payload (AFTER hooks)
  if (!trauma) return null;
  if (!open) return null;

  const sev = Math.max(1, Math.min(3, Number(trauma.severity || 1)));
  const dots = '●'.repeat(sev);

  return (
    <>
      <GameModalShell open={open} closeOnBackdrop={false} className="max-w-md bg-white opacity-100">
        <div className="p-6 md:p-7 flex flex-col gap-4 bg-white opacity-100">
          {/* Title - MUST match spec exactly */}
          <h3 className="text-lg md:text-xl font-bold text-slate-900">
            {`🩹 ${childName} has developed: ${trauma.label}`}
          </h3>

          {/* Severity dots */}
          <div className="text-rose-500 text-base font-semibold" aria-label={`Severity ${sev} of 3`}>
            {dots}
          </div>

          {/* Description */}
          {trauma.description && (
            <p className="text-slate-700 text-sm leading-relaxed">{trauma.description}</p>
          )}

          {/* Because line (optional) */}
          {trauma.because && (() => {
            const becauseText = String(trauma.because || '').replace(/^Because:\s*/i, '');
            return (
              <p className="text-slate-600 text-sm leading-relaxed"><span className="font-semibold">Because:</span> {becauseText}</p>
            );
          })()}

          {/* Buttons */}
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onClose && onClose()}>
              OK
            </Button>
            <Button onClick={() => setShowDetails(true)} className="bg-indigo-600 hover:bg-indigo-700">
              Explain it
            </Button>
          </div>
        </div>
      </GameModalShell>

      <ChildTraumaDetailsModal
        open={showDetails}
        trauma={trauma}
        childName={childName}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}