import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EMOTION_MATCH_SCENARIOS from '@/components/data/emotionMatchScenarios';
import { EMOTION_POOL, createSeededRng, shuffleArray, EMOTION_EMOJI_MAP } from './emotionMatchUtils';

/*
EmotionMatchMiniGame
- Drop‑in mini‑game modal. Reuse later by passing onComplete to grant different effects.
- Props:
  - open: boolean
  - onClose: () => void   // Early close counts as skipped; we apply baseline effect in integrator code
  - onComplete: (result) => void
  - rounds?: number (default 3)
  - seed?: number (optional deterministic)
*/

export default function EmotionMatchMiniGame({ open, onClose, onComplete, rounds = 3, seed }) {
  const rng = React.useMemo(() => createSeededRng(seed ?? Date.now()), [seed]);

  const [roundIndex, setRoundIndex] = React.useState(0);
  const [pickedScenarios, setPickedScenarios] = React.useState([]);
  const [choicesByRound, setChoicesByRound] = React.useState([]); // [{options: string[], correct: string}]
  const [locked, setLocked] = React.useState(false);
  const [selection, setSelection] = React.useState(null); // string | null
  const [correctCount, setCorrectCount] = React.useState(0);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(10);

  // Prepare scenarios on open
  React.useEffect(() => {
    if (!open) return;
    const all = [...EMOTION_MATCH_SCENARIOS];
    const pool = shuffleArray(all, rng).slice(0, Math.max(1, rounds));

    const built = pool.map((sc) => {
      const distractors = shuffleArray(
        EMOTION_POOL.filter(e => e !== sc.correctEmotion),
        rng
      ).slice(0, 5);
      const options = shuffleArray([sc.correctEmotion, ...distractors], rng);
      return { sc, options };
    });

    setPickedScenarios(built.map(b => b.sc));
    setChoicesByRound(built.map(b => ({ options: b.options, correct: b.sc.correctEmotion })));
    setRoundIndex(0);
    setLocked(false);
    setSelection(null);
    setCorrectCount(0);
    setShowFeedback(false);
    setTimeLeft(10);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Timer per round
  React.useEffect(() => {
    if (!open || showFeedback) return;
    if (timeLeft <= 0) {
      // Auto mark incorrect
      handlePick(null, true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [open, timeLeft, showFeedback]);

  const handlePick = (value, fromTimeout = false) => {
    if (locked || showFeedback) return;
    setLocked(true);
    const correct = choicesByRound[roundIndex]?.correct;
    const chosen = value;
    setSelection(chosen);
    const isCorrect = chosen && chosen === correct;
    if (isCorrect) setCorrectCount(c => c + 1);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (roundIndex + 1 >= rounds) {
      const rating = correctCount === 3 ? 'Empathy Master' : correctCount === 2 ? 'Good Listener' : correctCount === 1 ? 'Getting There' : 'Try Again';
      const multiplier = correctCount === 3 ? 1.25 : correctCount === 2 ? 1.15 : correctCount === 0 ? 0.95 : 1.0;
      const effects = {
        empathy: 1 + (correctCount >= 2 ? (correctCount === 3 ? 2 : 1) : 0),
        stress: correctCount === 3 ? -2 : correctCount === 2 ? -1 : 0,
      };
      onComplete?.({ correct: correctCount, total: rounds, rating, multiplier, effects });
      return;
    }
    setRoundIndex(i => i + 1);
    setLocked(false);
    setSelection(null);
    setShowFeedback(false);
    setTimeLeft(10);
  };

  const current = pickedScenarios[roundIndex];
  const options = choicesByRound[roundIndex]?.options || [];
  const correct = choicesByRound[roundIndex]?.correct;

  const closeButton = (
    <button aria-label="Close" className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/60" onClick={onClose}>
      <X className="w-5 h-5 text-slate-600" />
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
          >
            {closeButton}

            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="text-xs text-slate-500">Round {roundIndex + 1} / {rounds}</div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Emotion Match</h3>
                <div className="text-sm font-semibold text-slate-700">⏱️ {timeLeft}s</div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              {current && (
                <>
                  <p className="text-slate-800 text-base mb-4">{current.text}</p>

                  <div className="grid grid-cols-2 gap-2">
                    {options.map((opt) => {
                      const picked = selection === opt;
                      const isCorrect = showFeedback && opt === correct;
                      const isWrong = showFeedback && picked && opt !== correct;
                      return (
                        <motion.button
                          key={opt}
                          whileTap={{ scale: locked ? 1 : 0.97 }}
                          onClick={() => handlePick(opt)}
                          disabled={locked}
                          className={[
                            'h-12 rounded-xl border px-3 text-sm font-semibold flex items-center justify-center gap-2',
                            locked ? 'opacity-80' : 'active:scale-95',
                            isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                          ].join(' ')}
                        >
                          {EMOTION_EMOJI_MAP[opt]} {opt}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mt-4 p-3 rounded-xl border bg-slate-50 text-sm"
                      >
                        {selection === correct ? (
                          <div className="text-green-700 font-semibold">Correct!</div>
                        ) : (
                          <div className="text-red-700 font-semibold">{selection ? 'Not quite' : "Time's up"}</div>
                        )}
                        <div className="text-slate-700 mt-1">{current.explanation}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" onClick={handleNext} disabled={!showFeedback}>Next</Button>
                  </div>
                </>
              )}

              {!current && (
                <div className="py-12 text-center text-slate-600">Loading…</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}