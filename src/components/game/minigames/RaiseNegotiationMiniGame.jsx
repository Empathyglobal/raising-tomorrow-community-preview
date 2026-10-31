import React from 'react';

// Raise Negotiation Mini-Game
// - 3 rounds
// - Each round pick: Anchor High / Reasonable Ask / Soft Ask
// - Shows Manager Mood (0-100)
// - Skip triggers onSkip (use old auto-resolve)
// - On complete, returns: { success, rating, moodFinal, raisePct, multiplier }

const MOVES = [
  {
    id: 'anchor_high',
    title: 'Anchor High',
    sub: 'High reward, high risk',
    emoji: '📈',
    // mood delta range and multiplier effect
    mood: { min: -18, max: 10 },
    mult: { min: 1.05, max: 1.25 },
  },
  {
    id: 'reasonable',
    title: 'Reasonable Ask',
    sub: 'Balanced',
    emoji: '🤝',
    mood: { min: -6, max: 9 },
    mult: { min: 0.98, max: 1.10 },
  },
  {
    id: 'soft',
    title: 'Soft Ask',
    sub: 'Low risk, low reward',
    emoji: '🌿',
    mood: { min: -3, max: 6 },
    mult: { min: 0.95, max: 1.04 },
  },
];

function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function randRange(min, max) { return min + Math.random() * (max - min); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function RaiseNegotiationMiniGame({ open, onClose, onComplete, onSkip, baseRaiseRange }) {
  const [round, setRound] = React.useState(1);
  const [mood, setMood] = React.useState(55);
  const [locked, setLocked] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      // Initialize mood slightly variable
      const start = 50 + Math.floor(Math.random() * 11) - 5; // 45..55
      setMood(start);
      setRound(1);
      setLocked(false);
      setHistory([]);
    }
  }, [open]);

  if (!open) return null;

  const baseMin = Math.max(1, Number(baseRaiseRange?.minPct ?? 5));
  const baseMax = Math.max(baseMin, Number(baseRaiseRange?.maxPct ?? 12));

  const managerReactions = [
    'They lean back, considering…',
    'A slow nod. They take notes…',
    'Eyebrow raise. A measured pause…',
    'They check a spreadsheet…',
    'A polite smile. Poker face.',
  ];

  const handleMove = (move) => {
    if (locked) return;
    setLocked(true);

    // Compute mood delta and reaction
    const dMood = Math.round(randRange(move.mood.min, move.mood.max));
    const newMood = Math.max(0, Math.min(100, mood + dMood));
    const note = `${move.emoji} ${move.title}: ${dMood >= 0 ? '+' : ''}${dMood} mood`;
    const reaction = pick(managerReactions);

    setHistory((h) => [...h, { round, move: move.id, dMood, reaction, note }]);

    // Advance after short delay (simulate thinking)
    setTimeout(() => {
      setMood(newMood);
      setLocked(false);
      if (round >= 3) {
        // Finish
        const aggMult = (() => {
          const mults = history
            .concat([{ move: move.id }])
            .map((step) => {
              const def = MOVES.find((m) => m.id === step.move) || MOVES[1];
              return randRange(def.mult.min, def.mult.max);
            });
          // average but clamp to reasonable
          const avg = mults.reduce((a, b) => a + b, 0) / mults.length;
          return Math.max(0.9, Math.min(1.25, avg));
        })();

        const moodFinal = newMood;
        // Rating bands
        let rating = 'Denied';
        if (moodFinal >= 75) rating = 'Smooth Talker';
        else if (moodFinal >= 60) rating = 'Solid Pitch';
        else if (moodFinal >= 45) rating = 'Awkward Ask';

        const success = moodFinal >= 50; // threshold for success
        let raisePct = 0;
        if (success) {
          // Scale base range by mood and multiplier
          const base = randRange(baseMin, baseMax);
          const moodFactor = 0.7 + 0.6 * clamp01((moodFinal - 50) / 50); // 0.7..1.3
          raisePct = Math.max(1, Math.round(base * moodFactor * aggMult));
        }

        onComplete?.({ success, rating, moodFinal, raisePct, multiplier: aggMult });
      } else {
        setRound((r) => r + 1);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <div className="text-lg font-bold text-slate-800">💬 Raise Negotiation</div>
            <div className="text-xs text-slate-500">Round {round} of 3</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onSkip} className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Skip</button>
            <button onClick={onClose} className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Close</button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Mood Meter */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span>Manager Mood</span>
              <span>{mood}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${mood}%` }} />
            </div>
          </div>

          {/* Reaction line */}
          {history.length > 0 && (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2">
              {history[history.length - 1].reaction}
            </div>
          )}

          {/* Choices */}
          <div className="grid grid-cols-1 gap-2">
            {MOVES.map((m) => (
              <button
                key={m.id}
                disabled={locked}
                onClick={() => handleMove(m)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  locked
                    ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                    : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{m.title}</div>
                    <div className="text-xs text-slate-500">{m.sub}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="text-[11px] text-slate-500 border-t pt-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>Round {h.round}: {h.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}