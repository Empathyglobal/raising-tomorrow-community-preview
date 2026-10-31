import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import STUDY_BLITZ_QUESTIONS from '@/components/data/studyBlitzQuestions';

function pick(arr, n) {
  const a = [...arr];
  const out = [];
  while (a.length && out.length < n) {
    out.push(a.splice(Math.floor(Math.random()*a.length), 1)[0]);
  }
  return out;
}

function buildQuestionSet() {
  // Aim for mix of types, max 5
  const byType = {
    mc: STUDY_BLITZ_QUESTIONS.filter(q => q.type === 'mc'),
    pattern: STUDY_BLITZ_QUESTIONS.filter(q => q.type === 'pattern'),
    tf: STUDY_BLITZ_QUESTIONS.filter(q => q.type === 'tf'),
  };
  const set = [];
  // ensure at least one of each if possible
  ['mc','pattern','tf'].forEach(t => { if (byType[t].length) set.push(byType[t][Math.floor(Math.random()*byType[t].length)]); });
  // fill remainder up to 5
  const restPool = [...STUDY_BLITZ_QUESTIONS];
  while (set.length < 5) {
    const q = restPool[Math.floor(Math.random()*restPool.length)];
    if (!set.find(x => x.id === q.id)) set.push(q);
  }
  return set.slice(0,5);
}

function ratingFromScore(correct, total) {
  if (correct === 5) return 'Brain On Fire';
  if (correct === 4) return 'Sharp';
  if (correct >= 2) return 'Learning';
  return 'Zoned Out';
}

function effectsFromScore(correct) {
  // Baseline +1 smarts for playing
  // Extra +1 if high score (4 or 5)
  // Stress -1 if 4 or 5
  const smarts = 1 + (correct >= 4 ? 1 : 0);
  const stress = correct >= 4 ? -1 : 0;
  return { smarts, stress };
}

export default function StudyBlitzMiniGame({ open, onClose, onSkip, onComplete }) {
  const [questions, setQuestions] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(20);
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setQuestions(buildQuestionSet());
      setIndex(0);
      setCorrect(0);
      setLocked(false);
      setTimeLeft(20);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    if (timeLeft <= 0) {
      const total = questions.length || 5;
      const rating = ratingFromScore(correct, total);
      const effects = effectsFromScore(correct);
      onComplete?.({ correct, total, rating, effects });
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, open]);

  if (!open) return null;

  const q = questions[index];

  const handleAnswer = (choiceIdx) => {
    if (locked) return;
    setLocked(true);
    const isCorrect = (() => {
      if (!q) return false;
      if (q.type === 'tf') {
        return (choiceIdx === 1) === Boolean(q.answer); // idx 0=>False, 1=>True
      }
      return choiceIdx === q.answer;
    })();
    if (isCorrect) setCorrect(c => c + 1);

    setTimeout(() => {
      const next = index + 1;
      if (next >= questions.length || next >= 5) {
        const total = Math.min(questions.length, 5) || 5;
        const rating = ratingFromScore(isCorrect ? correct + 1 : correct, total);
        const effects = effectsFromScore(isCorrect ? correct + 1 : correct);
        onComplete?.({ correct: isCorrect ? correct + 1 : correct, total, rating, effects });
      } else {
        setIndex(next);
        setLocked(false);
      }
    }, 200);
  };

  const renderChoices = () => {
    if (!q) return null;
    if (q.type === 'tf') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <button disabled={locked} onClick={() => handleAnswer(0)} className={`p-3 rounded-xl border-2 ${locked? 'border-slate-100 bg-slate-50 opacity-60':'border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50'}`}>False</button>
          <button disabled={locked} onClick={() => handleAnswer(1)} className={`p-3 rounded-xl border-2 ${locked? 'border-slate-100 bg-slate-50 opacity-60':'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50'}`}>True</button>
        </div>
      );
    }
    const labels = ['A','B','C'];
    return (
      <div className="space-y-2">
        {q.choices.map((c, i) => (
          <button key={i} disabled={locked} onClick={() => handleAnswer(i)} className={`w-full text-left p-3 rounded-xl border-2 ${locked? 'border-slate-100 bg-slate-50 opacity-60':'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50'}`}>
            <div className="flex items-center gap-2"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{labels[i]}</span><span>{c}</span></div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[130]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[131] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <div>
                  <div className="text-lg font-bold text-slate-800">Study Blitz</div>
                  <div className="text-xs text-slate-500">{Math.max(0,timeLeft)}s • Q{Math.min(index+1,5)}/5</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { onSkip?.(); onClose?.(); }} className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Skip</button>
                  <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-500"/></button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {q ? (
                  <>
                    <div className="text-sm text-slate-800 min-h-[40px]">{q.prompt}</div>
                    {renderChoices()}
                  </>
                ) : (
                  <div className="text-center text-slate-500">Preparing…</div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}