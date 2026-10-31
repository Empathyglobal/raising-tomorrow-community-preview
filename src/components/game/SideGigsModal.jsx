import React from 'react';
import { toast } from 'sonner';
import GameModalShell from '@/components/game/GameModalShell';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import FocusSprintMiniGame from '@/components/game/minigames/FocusSprintMiniGame';

const SIDE_GIGS = [
  {
    id: 'microtasks',
    emoji: '🧩',
    title: 'Microtask Blitz',
    focusCost: 1,
    payMin: 180,
    payMax: 320,
    stressDelta: 1,
    desc: 'Small online tasks. Brain goes brrr.'
  },
  {
    id: 'delivery',
    emoji: '🛵',
    title: 'Delivery Run',
    focusCost: 1,
    payMin: 220,
    payMax: 420,
    stressDelta: 1,
    desc: 'You learn every shortcut in town.'
  },
  {
    id: 'tutoring',
    emoji: '📚',
    title: 'Tutoring Session',
    focusCost: 1,
    payMin: 260,
    payMax: 520,
    stressDelta: 0,
    desc: 'Explaining fractions to someone else is character development.'
  },
  {
    id: 'weekendCrunch',
    emoji: '💻',
    title: 'Weekend Crunch',
    focusCost: 2,
    payMin: 500,
    payMax: 900,
    stressDelta: 2,
    desc: 'High pay, high sigh.'
  }
];

// NOTE: If the player closes the modal while a gig is active, we auto-resolve as a Skip (normal payout)
// to ensure Focus is never consumed without payout. This keeps UX simple and consistent.

function randInt(min, max) {
  const a = Number(min || 0);
  const b = Number(max || 0);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default function SideGigsModal({ open, onClose = () => {} }) {
  const {
    gameState,
    spendFocus,
    applyMoneyDelta,
    applyStress,
    addLog,
    recordTimelineEntry
  } = useGameState();

  const actionPoints = Number(gameState?.actionPoints ?? 0);
  const currentYear = Number(gameState?.currentYear ?? 0);

  const [activeGig, setActiveGig] = React.useState(null);

  // Random outcome resolver (used for Skip and when closing mid‑run)
  const resolveGigRandom = (gig) => {
    const cost = Number(gig.focusCost || 1);
    if (!Number.isFinite(actionPoints) || actionPoints < cost) {
      toast('Not enough Focus');
      return;
    }
    const payout = randInt(gig.payMin, gig.payMax);
    const stressDelta = Number(gig.stressDelta || 0);
    spendFocus?.(cost, 'sideGigs');
    applyMoneyDelta?.(payout);
    if (stressDelta) applyStress?.(stressDelta);
    const title = `${gig.emoji} Side Gig: ${gig.title}`;
    const detail = `You earned $${formatMoney(payout)}. ${stressDelta ? `Stress ${stressDelta > 0 ? '+' : ''}${stressDelta}.` : ''}`.trim();
    addLog?.(detail);
    recordTimelineEntry?.({ kind: 'money', age: currentYear, title, detail, moneyDelta: payout, stressDelta });
    toast(`Earned $${formatMoney(payout)}`);
  };

  const handleDoGig = (gig) => {
    if (!gig) return;
    const cost = Number(gig.focusCost || 1);
    if (!Number.isFinite(actionPoints) || actionPoints < cost) {
      toast('Not enough Focus');
      return;
    }
    setActiveGig(gig);
  };

  const difficultyForGig = (gigId) => {
    if (gigId === 'microtasks') return 'easy';
    if (gigId === 'delivery') return 'medium';
    if (gigId === 'tutoring') return 'medium';
    if (gigId === 'weekendCrunch') return 'hard';
    return 'medium';
  };

  const handleMiniGameComplete = (gig, result) => {
    const cost = Number(gig.focusCost || 1);
    if (!Number.isFinite(actionPoints) || actionPoints < cost) {
      toast('Not enough Focus');
      setActiveGig(null);
      return;
    }
    // payoutBase = round(payMin + (payMax - payMin) * averageAccuracy)
    const avg = Number(result?.averageAccuracy || 0);
    const mult = Number(result?.multiplier || 1);
    const base = Math.round(Number(gig.payMin) + (Number(gig.payMax) - Number(gig.payMin)) * avg);
    let payout = Math.round(base * mult);
    const minClamp = Math.round(Number(gig.payMin) * 0.9);
    const maxClamp = Math.round(Number(gig.payMax) * 1.25);
    payout = Math.max(minClamp, Math.min(maxClamp, payout));

    // Stress calculation
    let stressDelta = Number(gig.stressDelta || 0);
    if (result?.rating === 'Laser Focus') {
      stressDelta = Math.max(0, stressDelta - 1);
    }

    // Spend focus once
    spendFocus?.(cost, 'sideGigs');
    applyMoneyDelta?.(payout);
    if (stressDelta) applyStress?.(stressDelta);

    const title = `${gig.emoji} Side Gig: ${gig.title}`;
    const detail = `You earned $${formatMoney(payout)} (${result?.rating}). ${stressDelta ? `Stress ${stressDelta > 0 ? '+' : ''}${stressDelta}.` : ''}`.trim();
    addLog?.(detail);
    recordTimelineEntry?.({ kind: 'money', age: currentYear, title, detail, moneyDelta: payout, stressDelta });
    toast(`Earned $${formatMoney(payout)} — ${result?.rating}`);

    // Return to list
    setActiveGig(null);
  };

  const handleMiniGameSkip = (gig) => {
    resolveGigRandom(gig);
    setActiveGig(null);
  };

  const handleClose = () => {
    // If closing while playing, auto-resolve as Skip (normal outcome) to avoid consuming focus with no payout
    if (activeGig) {
      resolveGigRandom(activeGig);
      setActiveGig(null);
    }
    onClose?.();
  };

  return (
    <GameModalShell
      open={open}
      onClose={handleClose}
      title="Side Gigs"
      subtitle="Quick ways to earn money (costs Focus)"
      closeOnBackdrop={true}
      footer={
        <div className="flex justify-end">
          <Button variant="secondary" onClick={handleClose}>
            {activeGig ? 'Finish & Close' : 'Close'}
          </Button>
        </div>
      }
    >
      {!activeGig ? (
        <div className="space-y-3">
          <div className="text-sm opacity-80">
            Focus available: {Number.isFinite(actionPoints) ? actionPoints : 0}
          </div>

          <div className="grid gap-2">
            {SIDE_GIGS.map((gig) => {
              const cost = Number(gig.focusCost || 1);
              const disabled = !Number.isFinite(actionPoints) || actionPoints < cost;

              return (
                <button
                  key={gig.id}
                  onClick={() => handleDoGig(gig)}
                  disabled={disabled}
                  className={`w-full text-left rounded-xl border px-3 py-3 transition ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">
                        <span className="mr-2">{gig.emoji}</span>
                        {gig.title}
                      </div>
                      <div className="text-sm opacity-80">{gig.desc}</div>
                      <div className="text-xs opacity-70 mt-1">
                        Pays ${formatMoney(gig.payMin)}–${formatMoney(gig.payMax)} • Cost {cost} Focus
                        {gig.stressDelta ? ` • Stress +${gig.stressDelta}` : ''}
                      </div>
                    </div>
                    <div className="pt-1">
                      <Button size="sm" disabled={disabled} onClick={(e) => { e.stopPropagation(); handleDoGig(gig); }}>
                        Do it
                      </Button>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <FocusSprintMiniGame
            title={`${activeGig.emoji} ${activeGig.title}`}
            subtitle="3 quick hits — stop in the green to boost pay"
            difficulty={difficultyForGig(activeGig.id)}
            hits={3}
            seed={`${gameState.runSeed || 'seed'}|sidegig|${activeGig.id}|age:${currentYear}`}
            onBack={() => setActiveGig(null)}
            onSkip={() => handleMiniGameSkip(activeGig)}
            onComplete={(res) => handleMiniGameComplete(activeGig, res)}
          />
        </div>
      )}
    </GameModalShell>
  );
}