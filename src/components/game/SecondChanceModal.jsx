import React from 'react';
import { X, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { useGameState, isFeatureEnabled as isFeatureEnabledUtil } from '@/components/game/GameStateContext';

// "BitLife-like" year rewind, but with an original name.
// Lets the player roll the game state back to the start of a prior age.
export default function SecondChanceModal({ open, onClose }) {
  const { gameState, rewindYears } = useGameState();
  const { currentYear } = gameState;

  const enabled = isFeatureEnabledUtil('rewind', gameState);
  const remaining = Number.isFinite(Number(gameState.rewind?.remaining)) ? Number(gameState.rewind.remaining) : 0;
  const checkpoints = Array.isArray(gameState.rewind?.checkpoints) ? gameState.rewind.checkpoints : [];

  const oldestAge = checkpoints.length > 0
    ? checkpoints.reduce((min, cp) => {
        const a = Number(cp.age);
        return Number.isFinite(a) ? Math.min(min, a) : min;
      }, currentYear)
    : currentYear;
  const maxBackFromHistory = Math.max(0, currentYear - oldestAge);

  // UX rule: keep the picker simple (1–4 years), but never exceed what is possible.
  const maxSelectable = Math.max(0, Math.min(4, maxBackFromHistory, remaining));

  const [yearsBack, setYearsBack] = React.useState(1);
  const [confirming, setConfirming] = React.useState(false);

  // Keep slider value in range when modal opens / constraints change.
  React.useEffect(() => {
    if (!open) return;
    setConfirming(false);
    if (maxSelectable <= 0) {
      setYearsBack(1);
      return;
    }
    setYearsBack(prev => Math.min(Math.max(1, prev), maxSelectable));
  }, [open, maxSelectable]);

  // Block body scroll while open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const targetAge = Math.max(0, currentYear - yearsBack);
  const canUse = enabled && currentYear > 0 && maxSelectable >= 1 && yearsBack >= 1 && yearsBack <= maxSelectable;

  const handleRequestConfirm = () => {
    if (!enabled) {
      toast.error('Second Chance is currently disabled.');
      return;
    }
    if (currentYear <= 0) {
      toast.error("You can't rewind before Age 0.");
      return;
    }
    if (remaining <= 0) {
      toast.error('No Second Chances remaining.');
      return;
    }
    if (maxBackFromHistory <= 0) {
      toast.error('No rewind checkpoints found yet.');
      return;
    }
    if (!canUse) {
      toast.error('That rewind amount isn\'t available.');
      return;
    }
    setConfirming(true);
  };

  const handleConfirm = () => {
    if (!canUse) {
      toast.error('Unable to rewind (not available).');
      return;
    }
    rewindYears(yearsBack);
    toast.success(`Second Chance used: back ${yearsBack} year${yearsBack === 1 ? '' : 's'}.`);
    setConfirming(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={() => {
              if (!confirming) onClose();
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[121] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Undo2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-800">Second Chance</h3>
                </div>
                <button
                  onClick={() => {
                    if (!confirming) onClose();
                  }}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-slate-600">
                  Rewind time and replay from an earlier age. Everything after that point is erased.
                </p>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">Available</span>
                    <span className="text-xs text-slate-600">
                      {enabled ? '✅ Enabled' : '🔒 Disabled'} • {remaining} left
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    You are currently <span className="font-semibold">Age {currentYear}</span>.
                  </div>

                  {maxSelectable <= 0 ? (
                    <div className="text-xs text-slate-500 italic">
                      No rewinds available right now.
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-slate-700">
                        Go back: <span className="font-semibold">{yearsBack}</span> year{yearsBack === 1 ? '' : 's'}
                      </div>
                      <Slider
                        value={[yearsBack]}
                        onValueChange={(v) => setYearsBack(v[0])}
                        min={1}
                        max={maxSelectable}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-slate-600">
                        You will return to <span className="font-semibold">Age {targetAge}</span> and erase Ages{' '}
                        <span className="font-semibold">{targetAge + 1}</span>–<span className="font-semibold">{currentYear}</span>.
                      </div>
                    </>
                  )}
                </div>

                {!confirming ? (
                  <button
                    onClick={handleRequestConfirm}
                    disabled={!canUse}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                      canUse
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Use Second Chance
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border-2 border-red-400 bg-red-50">
                    <div className="text-sm text-red-800 font-medium mb-3">
                      Confirm rewind {yearsBack} year{yearsBack === 1 ? '' : 's'}?
                    </div>
                    <div className="text-xs text-red-700 mb-4">
                      This deletes everything from Ages {targetAge + 1}–{currentYear}.
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirming(false)}
                        className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                      >
                        Rewind
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-500">
                  Tip: If you just unlocked this feature mid-run, you can only rewind to ages that have checkpoints.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}