import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGameState } from '@/components/game/GameStateContext.jsx';

const FIRST_TIME_QUOTE =
  '“Every moment each human being is doing the best we know at that moment to meet our needs.” — Marshall Rosenberg';

function buildBody({ kind, firstTime }) {
  if (kind === 'smoke') {
    // Fun + meaningful + acknowledges “strategy not ideal”
    return [
      "You step outside for a smoke. For a minute, the world gets quieter.",
      "It’s not a great long‑term plan… but it *is* a plan. Your nervous system takes the first exit it can find.",
      firstTime ? `\n${FIRST_TIME_QUOTE}` : null,
      "\nYou make a note to try a cheaper coping tool next time—before you pay $500 for a pause."
    ].filter(Boolean).join('\n\n');
  }

  // drink
  return [
    "You pour a drink. The edge softens. Your shoulders drop.",
    "It helps in the short term. In the long term… it makes you a little less available.",
    firstTime ? `\n${FIRST_TIME_QUOTE}` : null,
    "\nRelief: ✅  Connection: ⚠️  You tell yourself: next time, try a reset that doesn’t charge interest."
  ].filter(Boolean).join('\n\n');
}

export default function CopingModal({ open, onClose }) {
  const {
    gameState,
    spendFocus,
    applyStress,
    applyLove,
    applyMoneyDelta,
    recordTimelineEntry,
    emitActionResult,
    updateState
  } = useGameState();

  const { actionPoints, copingSmokeQuoteShown, copingDrinkQuoteShown } = gameState;

  // Optional: lock body scroll like other modals
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const canUse = (actionPoints ?? 0) >= 1;

  const handlePick = (kind) => {
    if (!canUse) {
      toast('You need at least 1 Focus.', { icon: '⏳' });
      return;
    }

    const label = kind === 'smoke' ? 'Smoking' : 'Drinking';
    const ok = spendFocus(1, `Coping: ${label}`);
    if (!ok) {
      toast('Not enough Focus.', { icon: '⏳' });
      return;
    }

    // Effects (exact numbers requested)
    const stressDelta = -5;
    const moneyDelta = kind === 'smoke' ? -500 : 0;
    const loveDelta = kind === 'drink' ? -1 : 0;

    applyStress(stressDelta, `Coping: ${label}`);
    if (moneyDelta) applyMoneyDelta(moneyDelta);
    if (loveDelta) applyLove(loveDelta, `Coping: ${label}`);

    // First-time quote flags (separate)
    const firstTime =
      kind === 'smoke' ? !Boolean(copingSmokeQuoteShown) : !Boolean(copingDrinkQuoteShown);

    if (firstTime) {
      updateState(kind === 'smoke'
        ? { copingSmokeQuoteShown: true }
        : { copingDrinkQuoteShown: true }
      );
    }

    const emoji = kind === 'smoke' ? '🚬' : '🍺';
    const title = `${emoji} Coping: ${label}`;
    const body = buildBody({ kind, firstTime });

    // Timeline entry (Life Log)
    recordTimelineEntry({
      kind: 'care',
      title,
      detail: kind === 'smoke'
        ? 'A quick pause (expensive). Short-term relief, long-term tradeoffs.'
        : 'A quick pause (connection cost). Short-term relief, long-term tradeoffs.',
      deltas: null,
      moneyDelta,
      loveDelta,
      stressDelta,
      meta: { type: 'coping', option: kind, firstTime }
    });

    // Popup result
    emitActionResult({
      actionId: 'coping',
      title,
      body,
      deltas: {},
      loveDelta,
      stressDelta,
      moneyDelta,
      focusDelta: -1,
      tags: ['care', 'coping'],
      meta: { emoji, option: kind, firstTime }
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">🫠 Coping</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-600">
          Sometimes you reach for the fastest relief you know. It works… and it costs something. (Uses 1 Focus.)
        </p>

        <div className="mt-4 grid gap-3">
          <Button
            onClick={() => handlePick('smoke')}
            disabled={!canUse}
            variant="outline"
            className="justify-start gap-3 py-6"
          >
            <span className="text-2xl">🚬</span>
            <span className="text-left">
              <div className="font-semibold">Smoke</div>
              <div className="text-xs text-slate-500">Stress -5 • Money -$500</div>
            </span>
          </Button>

          <Button
            onClick={() => handlePick('drink')}
            disabled={!canUse}
            variant="outline"
            className="justify-start gap-3 py-6"
          >
            <span className="text-2xl">🍺</span>
            <span className="text-left">
              <div className="font-semibold">Drink</div>
              <div className="text-xs text-slate-500">Stress -5 • Love -1</div>
            </span>
          </Button>
        </div>


      </DialogContent>
    </Dialog>
  );
}