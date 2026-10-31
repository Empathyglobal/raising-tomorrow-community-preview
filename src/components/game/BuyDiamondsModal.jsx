import React from 'react';
import { toast } from 'sonner';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState } from '@/components/game/GameStateContext';
import { UI_EMOJI } from '@/components/game/uiEmojis';
import { showRewardedAd } from '@/components/services/ads';

const WATCH_REWARD = 4;

const DIAMOND_PACKS = [
  { price: 0.99, label: '$0.99', diamonds: 20 },
  { price: 4.99, label: '$4.99', diamonds: 120, badge: 'Most Popular' },
  { price: 9.99, label: '$9.99', diamonds: 260 },
  { price: 15.99, label: '$15.99', diamonds: 450 },
  { price: 25.99, label: '$25.99', diamonds: 800, badge: 'Best Value' },
];

const COST_MONEY = 4;
const COST_FOCUS = 4;
const COST_REWIND_PER_YEAR = 4;
const COST_TRAUMA = 20;
const COST_CALM_MIND = 10;
const COST_HEAL_INJURY = 15;

export default function BuyDiamondsModal({ open, onClose, onOpenTraumaRehab }) {
  const { gameState, addDiamonds, spendDiamonds, applyMoneyDelta, updateState, addLog, applyStress, applyPlayerHealth } = useGameState();
  const diamonds = Math.max(0, Math.floor(Number(gameState.diamonds || 0)));

  const [rewindYears, setRewindYears] = React.useState(1);
  const getDiamondsRef = React.useRef(null);

  React.useEffect(() => {
    if (open) setRewindYears(1);
  }, [open]);

  const scrollToGetDiamonds = () => {
    try { getDiamondsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
  };

  const ensureSpend = (cost, reason) => {
    const ok = spendDiamonds(cost, reason);
    if (!ok) scrollToGetDiamonds();
    return ok;
  };

  const handleWatch = async () => {
    const res = await showRewardedAd('earn_diamonds');
    if (res?.success) addDiamonds(WATCH_REWARD, 'rewarded_stub');
  };

  const handleMoney = () => {
    if (!ensureSpend(COST_MONEY, 'god_money')) return;
    applyMoneyDelta(1000000);
    try { addLog?.('God Mode: +$1,000,000', 'system'); } catch {}
    toast('God Mode: +$1,000,000', { icon: UI_EMOJI.moneyTxn || '💸' });
  };

  const handleFocus = () => {
    if (!ensureSpend(COST_FOCUS, 'god_focus')) return;
    updateState(prev => ({ ...prev, actionPoints: (prev.actionPoints || 0) + 1 }));
    try { addLog?.('God Mode: +1 Focus', 'system'); } catch {}
    toast('God Mode: +1 Focus', { icon: '⚡' });
  };

  const handleRewind = () => {
    const currentAge = Number(gameState.currentYear || 0);
    
    // Clamp rewind years to current age
    const yearsRaw = Math.max(1, Math.min(10, Math.floor(Number(rewindYears || 1))));
    const years = Math.min(yearsRaw, currentAge);
    
    // Block if age 0
    if (currentAge === 0) {
      toast('Cannot rewind from age 0.', { icon: '⏪' });
      return;
    }
    
    // Charge based on clamped value
    const cost = years * COST_REWIND_PER_YEAR;

    // Precheck: avoid charging if no checkpoint exists
    const cps0 = Array.isArray(gameState.yearCheckpoints) ? gameState.yearCheckpoints : [];
    const targetAge0 = Math.max(0, currentAge - years);
    const match0 =
      cps0.find(c => c?.kind === 'yearStart' && c?.age === targetAge0) ||
      cps0.find(c => c?.kind === 'yearStart' && c?.age === currentAge) ||
      cps0[cps0.length - 1];

    if (!match0?.snapshot) {
      toast('No rewind checkpoint available yet.', { icon: '⏪' });
      return;
    }

    if (!ensureSpend(cost, 'god_rewind')) return;

    updateState(prev => {
      const currentAge = Number(prev.currentYear || 0);
      const targetAge = Math.max(0, currentAge - years);
      const cps = Array.isArray(prev.yearCheckpoints) ? prev.yearCheckpoints : [];
      const match =
        cps.find(c => c?.kind === 'yearStart' && c?.age === targetAge) ||
        cps.find(c => c?.kind === 'yearStart' && c?.age === currentAge) ||
        cps[cps.length - 1];

      if (!match?.snapshot) return prev;

      // Do NOT refund diamonds via rewind
      const keepDiamonds = Number(prev.diamonds || 0);
      return { ...match.snapshot, yearCheckpoints: cps, currentYear: targetAge, diamonds: keepDiamonds };
    });

    try { addLog?.(`God Mode: Rewound ${years} year(s)`, 'system'); } catch {}
    toast(`God Mode: Rewound ${years} year(s)`, { icon: '⏪' });
    onClose?.();
  };

  const handleCalmMind = () => {
    if (Number(gameState.stress || 0) <= 0) {
      toast('Stress is already at 0.', { icon: '🧘' });
      return;
    }
    if (!ensureSpend(COST_CALM_MIND, 'god_calm_mind')) return;
    applyStress(-10);
    try { addLog?.('God Mode: Calm Mind (Stress -10)', 'system'); } catch {}
    toast('God Mode: Stress -10', { icon: '🧘' });
  };

  const handleHealInjury = () => {
    if (!gameState.childSickThisAge) {
      toast('No injury to heal this year.', { icon: '🩺' });
      return;
    }
    if (!ensureSpend(COST_HEAL_INJURY, 'god_heal_injury')) return;
    updateState({ childSickThisAge: false, childSickNote: null });
    try { addLog?.('God Mode: Healed injury (cleared sick status)', 'system'); } catch {}
    toast('God Mode: Injury healed', { icon: '🩺' });
  };

  const handleTrauma = () => {
    if (diamonds < COST_TRAUMA) {
      toast('Not enough diamonds', { icon: UI_EMOJI.diamonds || '💎' });
      scrollToGetDiamonds();
      return;
    }
    // Actual diamond charge happens when a method is chosen in TraumaRehabModal
    onClose?.();
    onOpenTraumaRehab?.();
  };

  const baseRate = DIAMOND_PACKS[0].diamonds / DIAMOND_PACKS[0].price;
  const valuePct = (pack) => {
    const packRate = pack.diamonds / pack.price;
    const bonus = Math.round(((packRate / baseRate) - 1) * 100);
    return Math.max(0, bonus);
  };

  return (
    <GameModalShell
      viewportModal
      open={open}
      onClose={onClose}
      title="💎 God Mode"
      subtitle="Spend earned diamonds on powerful boosts. Purchases are unavailable."
      headerRight={
        <div className="px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-slate-800 whitespace-nowrap">
          💎 {diamonds}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Use Diamonds */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Use Diamonds</h4>
            <div className="text-[11px] text-slate-400">Instant actions</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleMoney}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-95 text-left"
            >
              <div className="text-2xl mb-1">💸</div>
              <div className="text-xs font-bold text-slate-800">+$1,000,000</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Cost: 💎{COST_MONEY}</div>
            </button>

            <button
              onClick={handleFocus}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-95 text-left"
            >
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-bold text-slate-800">+1 Focus</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Cost: 💎{COST_FOCUS}</div>
            </button>

            <button
              onClick={handleCalmMind}
              disabled={Number(gameState.stress || 0) <= 0}
              className={`p-3 rounded-xl border bg-white text-left ${
                Number(gameState.stress || 0) > 0
                  ? 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 active:scale-95'
                  : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-1">🧘</div>
              <div className="text-xs font-bold text-slate-800">Calm Mind (Stress -10)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Cost: 💎{COST_CALM_MIND}</div>
            </button>

            <button
              onClick={handleHealInjury}
              disabled={!gameState.childSickThisAge}
              className={`p-3 rounded-xl border bg-white text-left ${
                gameState.childSickThisAge
                  ? 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 active:scale-95'
                  : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-1">🩺</div>
              <div className="text-xs font-bold text-slate-800">Heal Injury</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Cost: 💎{COST_HEAL_INJURY}</div>
            </button>

            <button
              onClick={handleTrauma}
              className="p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-95 text-left"
            >
              <div className="text-2xl mb-1">🩹</div>
              <div className="text-xs font-bold text-slate-800">Remove 1 Trauma</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Cost: 💎{COST_TRAUMA}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Charged when method is chosen</div>
            </button>

            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-2xl">⏪</div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rewindYears}
                  onChange={(e) => setRewindYears(e.target.value)}
                  className="w-14 text-xs border rounded-lg p-1 text-center"
                  disabled={Number(gameState.currentYear || 0) === 0}
                />
              </div>
              <button
                onClick={handleRewind}
                disabled={Number(gameState.currentYear || 0) === 0}
                className="mt-2 w-full text-xs font-bold text-slate-800 rounded-lg px-2 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rewind {(() => {
                  const currentAge = Number(gameState.currentYear || 0);
                  const yearsRaw = Math.max(1, Math.min(10, Math.floor(Number(rewindYears || 1))));
                  const years = Math.min(yearsRaw, currentAge);
                  return years;
                })()} yr (💎{(() => {
                  const currentAge = Number(gameState.currentYear || 0);
                  const yearsRaw = Math.max(1, Math.min(10, Math.floor(Number(rewindYears || 1))));
                  const years = Math.min(yearsRaw, currentAge);
                  return years * COST_REWIND_PER_YEAR;
                })()})
              </button>
              <div className="text-[10px] text-slate-400 mt-1">Costs 💎{COST_REWIND_PER_YEAR} per year</div>
            </div>
          </div>
        </div>

        {/* Get Diamonds */}
        <div ref={getDiamondsRef}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Get Diamonds</h4>

          <button
            onClick={handleWatch}
            className="w-full p-4 rounded-xl border-2 border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all text-left"
          >
            <div className="text-sm font-bold text-slate-800">▶️ Claim demo diamonds → +{WATCH_REWARD} 💎</div>
            <div className="text-xs text-slate-600 mt-1">Local demo reward only. No advertisement or payment.</div>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {DIAMOND_PACKS.map((pack) => (
              <button
                key={pack.label}
                disabled
                aria-label={`${pack.diamonds} gems for ${pack.label}; purchases unavailable`}
                className="p-4 rounded-xl border border-slate-200 bg-white opacity-60 cursor-not-allowed text-left relative overflow-hidden"
              >
                {pack.badge && (
                  <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pack.badge === 'Best Value'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {pack.badge}
                  </div>
                )}
                <div className="text-lg font-extrabold text-slate-800">💎 {pack.diamonds}</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">{pack.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {valuePct(pack) > 0 ? `+${valuePct(pack)}% value` : 'Base rate'}
                </div>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 mt-3">
            Gem purchases are currently unavailable. No payment will be taken.
          </div>
        </div>
      </div>
    </GameModalShell>
  );
}