import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import TEXTS from '@/components/data/textToneMatchBank';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function pickScenarios(context) {
  const pool = context ? TEXTS.filter(s => s.context === context) : TEXTS;
  const arr = [...pool];
  // shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

function ratingFromConn(connSum) {
  if (connSum >= 3) return 'Heart-to-Heart';
  if (connSum >= 1) return 'Good Vibes';
  if (connSum >= 0) return 'Awkward';
  return 'Argument';
}

function effectsFromConn(connSum) {
  if (connSum >= 3) return { empathy: 2, love: 2 };
  if (connSum >= 1) return { empathy: 1, love: 1 };
  if (connSum === 0) return { empathy: 0, love: 0 };
  return { empathy: 0, love: 0 };
}

export default function TextToneMatchMiniGame({ open, context, onClose, onSkip, onComplete }) {
  const [round, setRound] = React.useState(0); // 0..2
  const [conn, setConn] = React.useState(0);
  const [scenarios, setScenarios] = React.useState([]);
  const [feedback, setFeedback] = React.useState('');
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setScenarios(pickScenarios(context));
      setRound(0);
      setConn(0);
      setFeedback('');
      setLocked(false);
    }
  }, [open, context]);

  if (!open) return null;
  const s = scenarios[round];

  const handleChoice = (opt) => {
    if (locked || !s) return;
    setLocked(true);
    const next = conn + (opt.conn || 0);
    setFeedback(opt.feedback || '');
    setTimeout(() => {
      setConn(next);
      if (round >= 2) {
        const rating = ratingFromConn(next);
        const effects = effectsFromConn(next);
        const connectionDelta = clamp(next, -2, 2);
        onComplete?.({ connectionDelta, rating, effects });
      } else {
        setRound(r => r + 1);
        setFeedback('');
        setLocked(false);
      }
    }, 500);
  };

  const pct = ((conn + 3) / 6) * 100; // map -3..+3 to 0..100

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/60 z-[160]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-[161] flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <div>
                  <div className="text-lg font-bold text-slate-800">Text Tone Match</div>
                  <div className="text-xs text-slate-500">Round {round+1} of 3</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { onSkip?.(); onClose?.(); }} className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Skip</button>
                  <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-500"/></button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Connection meter */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1"><span>Connection</span><span>{conn >= 0 ? `+${conn}` : conn}</span></div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Message */}
                {s ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800">{s.message}</div>
                ) : (
                  <div className="text-center text-slate-500">Loading…</div>
                )}

                {/* Options */}
                <div className="space-y-2">
                  {s?.options?.map((opt, idx) => (
                    <button key={idx} disabled={locked} onClick={() => handleChoice(opt)} className={`w-full text-left p-3 rounded-xl border-2 ${locked ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' : 'border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50 active:scale-[0.99]'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">{opt.tone}</span>
                        <span className="flex-1">{opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className="text-[11px] text-slate-500">{feedback}</div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}