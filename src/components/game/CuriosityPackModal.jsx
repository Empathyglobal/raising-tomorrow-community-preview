import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CURIOSITY_QUESTIONS } from '@/components/content/curiosityPackQuestions';

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getParentAddress(parentRole, parentName) {
  const role = String(parentRole || '').toLowerCase();
  if (role === 'dad') return 'Daddy';
  if (role === 'mom') return 'Mommy';
  if (parentName) return parentName;
  // Default to "Daddy" because the pack is “kid voice” and needs an address.
  return 'Daddy';
}

export default function CuriosityPackModal({
  open,
  questionId,
  age,
  childName,
  parentRole,
  parentName,
  phase = 'question',
  lastResult = null,
  runSeed = '',
  onPickAnswer, // (isCorrect:boolean) => void
  onIgnore,
  onScold,
  onContinue,
  onPlayfulGuessEveryYear
}) {
  // Stable shuffle per runSeed+questionId so it doesn't flip on rerenders
  const flip = React.useMemo(() => {
    if (!questionId) return false;
    const seed = hashString(`${runSeed}:${questionId}`);
    const rng = mulberry32(seed);
    return rng() < 0.5;
  }, [runSeed, questionId]);

  const q = React.useMemo(() => 
    CURIOSITY_QUESTIONS.find((x) => x.id === questionId) || null, 
    [questionId]
  );

  const answerOptions = React.useMemo(() => {
    if (!q) return [];
    const a = { letter: 'A', text: flip ? q.correct : q.incorrect, isCorrect: flip };
    const b = { letter: 'B', text: flip ? q.incorrect : q.correct, isCorrect: !flip };
    return [a, b];
  }, [flip, q]);

  if (!open || !questionId || !q) return null;

  const kidName = childName || 'Your kid';
  const parentAddress = getParentAddress(parentRole, parentName);
  const kidLine = `${parentAddress}, ${q.question}`;

  const choiceKey = lastResult?.choiceKey || '';
  const isPickedCorrect = choiceKey === 'correct' || choiceKey === 'pick_correct';
  const isPickedIncorrect = choiceKey === 'incorrect' || choiceKey === 'pick_incorrect';
  const pickedText = isPickedCorrect ? q.correct : isPickedIncorrect ? q.incorrect : '';

  const outcomeTitle = lastResult?.outcomeTitle ||
    (choiceKey === 'ignore'
      ? 'You pretended not to hear.'
      : choiceKey === 'scold'
        ? 'Oof. That one stung.'
        : isPickedCorrect
          ? '✅ Nailed it.'
          : isPickedIncorrect
            ? '❌ Not quite.'
            : 'Result');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1150] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)', paddingTop: 'calc(env(safe-area-inset-top))' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-[92vw] sm:w-full sm:max-w-md max-h-[calc(100dvh-2rem)] rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (match Homework style: simple, solid, clean) */}
            <div className="bg-amber-600 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-2xl">🧸</span>
                  <span>{kidName} asks</span>
                </h3>
                {Number.isFinite(age) ? (
                  <span className="text-xs text-white/90 bg-white/15 px-2 py-1 rounded-full">
                    Age {age}
                  </span>
                ) : null}
              </div>
              <p className="text-white/90 text-xs mt-1">
                Your kid is curious. Pick what you say back.
              </p>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100dvh-2rem-96px)]">
              {/* Kid asks bubble */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Kid
                </div>
                <div className="text-slate-900 text-lg font-semibold leading-snug">
                  “{kidLine}”
                </div>
              </div>

              {phase === 'question' ? (
                <>
                  <div className="text-sm text-slate-600 text-center">
                    What do you tell them?
                  </div>

                  {/* Answers (remove ugly “Option A” duplication) */}
                  <div className="space-y-3">
                    {answerOptions.map((opt) => (
                      <button
                        key={opt.letter}
                        onClick={() => onPickAnswer?.(opt.isCorrect)}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold shrink-0">
                            {opt.letter}
                          </div>
                          <div className="text-slate-800 text-sm leading-relaxed font-medium">
                            {opt.text}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Footer actions (clean on mobile, no truncation) */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Button onClick={onIgnore} variant="outline" className="w-full h-12">
                        Ignore it
                      </Button>

                      <Button onClick={onScold} variant="destructive" className="w-full h-12">
                        Scold: never ask me again
                      </Button>

                      <Button onClick={onPlayfulGuessEveryYear} variant="outline" className="w-full h-12 border-amber-300 hover:bg-amber-50">
                        Playful guess every year (hide these)
                      </Button>
                    </div>

                    <p className="text-xs text-slate-500 text-center">
                      Ignore: INT ↓ • CONF ↓ &nbsp;•&nbsp; Scold: CONF ↓↓ &nbsp;•&nbsp; Playful guess: no penalties
                    </p>
                    <p className="text-[10px] text-slate-400 text-center">
                      You can turn this back on in Settings.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Reveal */}
                  <div className="text-center space-y-1">
                    <div className="text-xl font-extrabold text-slate-900">{outcomeTitle}</div>
                    {lastResult?.note ? (
                      <div className="text-sm text-slate-600">{lastResult.note}</div>
                    ) : null}
                  </div>

                  {pickedText ? (
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                        You said
                      </div>
                      <div className="text-slate-800 text-sm leading-relaxed font-medium">
                        “{pickedText}”
                      </div>
                    </div>
                  ) : null}

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="text-xs uppercase font-extrabold text-emerald-800 mb-1">
                      ✅ Actually true
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed">{q.correct}</p>
                  </div>

                  <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                    <div className="text-xs uppercase font-extrabold text-rose-800 mb-1">
                      ❌ Sounds right… but nope
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed">{q.incorrect}</p>
                  </div>

                  <Button onClick={onContinue} className="w-full h-12 text-base font-semibold bg-amber-600 hover:bg-amber-700">
                    Continue
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}