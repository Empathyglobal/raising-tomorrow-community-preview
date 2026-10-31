import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, ClipboardCopy } from 'lucide-react';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { toast } from 'sonner';

export default function RoyalTabloidModal() {
  const { gameState, updateState, applyMoneyDelta, recordTimelineEntry } = useGameState();
  const pending = gameState.royalPopupPending;
  const [step, setStep] = React.useState('choices'); // 'choices' | 'card'
  const [chosen, setChosen] = React.useState(null);

  React.useEffect(() => {
    if (pending) {
      setStep('choices');
      setChosen(null);
    }
  }, [pending]);

  if (!pending) return null;

  const onChoose = (opt) => {
    // Apply effects
    if (opt?.effects?.moneyDelta) {
      applyMoneyDelta(opt.effects.moneyDelta, { source: 'Royal Tabloid' });
    }
    if (typeof opt?.effects?.reputationDelta === 'number') {
      updateState(prev => {
        const cur = Number(prev.royalReputation || 0);
        const next = Math.max(0, Math.min(100, cur + opt.effects.reputationDelta));
        return { ...prev, royalReputation: next };
      });
    }
    setChosen(opt);
    setStep('card');

    // Timeline entry
    recordTimelineEntry({
      kind: 'royal',
      title: `👑 TABLOID: ${pending.headline}`,
      detail: '',
      moneyDelta: opt?.effects?.moneyDelta || 0,
      stressDelta: 0,
      loveDelta: 0
    });
  };

  const headline = chosen?.followupHeadline || pending.headline;
  const repDelta = chosen?.effects?.reputationDelta || 0;
  const repLine = repDelta === 0 ? 'Reputation ±0' : `Reputation ${repDelta > 0 ? '+' : ''}${repDelta}`;

  const shareText = `👑 ${headline} — ${pending.name}, Age ${pending.age} in ${pending.country}. #RaisingTomorrow`;

  const doShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Royal Tabloid', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Copied caption');
      }
    } catch (e) {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied caption');
    }
  };

  const copyCaption = async () => {
    await navigator.clipboard.writeText(shareText);
    toast.success('Copied caption');
  };

  const onClose = () => {
    updateState({ royalPopupPending: null });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120]"
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-4 md:p-6 pb-[calc(16px+env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-500">Royal Tabloid</h3>
            <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {step === 'choices' && (
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2">{pending.headline}</h2>
              <p className="text-slate-600 mb-4">{pending.body}</p>

              <div className="grid gap-2">
                {pending.choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => onChoose(c)}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-[0.98] transition"
                  >
                    <div className="font-semibold text-slate-800">{c.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {typeof c.effects?.reputationDelta === 'number' && (
                        <span className={c.effects.reputationDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          Reputation {c.effects.reputationDelta >= 0 ? '+' : ''}{c.effects.reputationDelta}
                        </span>
                      )}
                      {typeof c.effects?.moneyDelta === 'number' && (
                        <span className="ml-2 text-slate-600">Money {c.effects.moneyDelta >= 0 ? '+' : ''}${formatMoney(Math.abs(c.effects.moneyDelta))}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'card' && (
            <div className="text-center">
              <div className="mx-auto w-full max-w-sm rounded-2xl border-2 border-slate-200 p-4 bg-gradient-to-b from-amber-50 to-white">
                <div className="text-4xl mb-2">👑</div>
                <h2 className="text-2xl font-extrabold leading-snug mb-1">{headline}</h2>
                <p className="text-sm text-slate-600 mb-3">{repLine}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button onClick={doShare} className="px-3 py-2 rounded-lg bg-indigo-600 text-white flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={copyCaption} className="px-3 py-2 rounded-lg bg-slate-900 text-white flex items-center justify-center gap-2">
                  <ClipboardCopy className="w-4 h-4" /> Copy
                </button>
                <button onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-200 text-slate-800">Continue</button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}