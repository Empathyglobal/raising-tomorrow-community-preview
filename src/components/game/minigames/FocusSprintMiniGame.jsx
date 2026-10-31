import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DIFFICULTY_PRESETS, makeSeededRng, scoreAt, ratingFromAverage } from './focusSprintUtils';

// FocusSprintMiniGame
// Reusable skill-check: 3 hits, stop the moving dot inside the green target.
// Props:
// - title, subtitle
// - difficulty: 'easy' | 'medium' | 'hard' | {targetWidth, speed}
// - hits (default 3)
// - seed (optional, deterministic placement)
// - onComplete({ averageAccuracy, rating, multiplier })
// - onSkip()
// - onBack() (optional)
// Notes:
// - Designed to render inside an existing modal (Side Gigs, etc.)
// - Mobile-friendly (large STOP button)

export default function FocusSprintMiniGame({
  title = 'Focus Sprint',
  subtitle = 'Stop in the green zone',
  difficulty = 'medium',
  hits = 3,
  seed,
  onComplete,
  onSkip,
  onBack
}) {
  const preset = typeof difficulty === 'string' ? (DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.medium) : { ...DIFFICULTY_PRESETS.medium, ...(difficulty || {}) };
  const targetWidth = preset.targetWidth;
  const speed = preset.speed; // normalized units / second

  const rng = React.useMemo(() => makeSeededRng(seed || `focus_sprint_${Date.now()}`), [seed]);

  // Per-hit randomized target center and starting phase
  const [hitIndex, setHitIndex] = React.useState(0);
  const [scores, setScores] = React.useState([]);
  const [phase, setPhase] = React.useState('play'); // 'play' | 'feedback' | 'results'

  // Movement state
  const [pos, setPos] = React.useState(rng()); // 0..1
  const [dir, setDir] = React.useState(rng() < 0.5 ? 1 : -1); // 1 or -1
  const targetCentersRef = React.useRef([]);

  // Initialize targets list deterministically
  React.useEffect(() => {
    const arr = [];
    for (let i = 0; i < hits; i++) {
      const c = targetWidth/2 + (1 - targetWidth) * rng(); // ensure zone fully inside bar
      arr.push(c);
    }
    targetCentersRef.current = arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hits, targetWidth]);

  // Animation loop
  React.useEffect(() => {
    if (phase !== 'play') return; // pause during feedback/results
    let raf = null;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); // cap dt for stability
      last = now;
      setPos((prev) => {
        let next = prev + dir * speed * dt;
        let nextDir = dir;
        if (next > 1) { next = 1 - (next - 1); nextDir = -1; }
        if (next < 0) { next = -next; nextDir = 1; }
        // commit dir if flipped
        if (nextDir !== dir) setDir(nextDir);
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [phase, dir, speed]);

  const [lockInput, setLockInput] = React.useState(false);
  const currentCenter = targetCentersRef.current[hitIndex] ?? 0.5;

  const handleStop = () => {
    if (phase !== 'play' || lockInput) return;
    setLockInput(true);
    const s = scoreAt(pos, currentCenter, targetWidth);
    const nextScores = [...scores, s];
    setScores(nextScores);
    setPhase('feedback');

    // After feedback, go next hit or results
    setTimeout(() => {
      const nextHit = hitIndex + 1;
      if (nextHit >= hits) {
        setPhase('results');
      } else {
        // reset motion seed for variety
        setPos(rng());
        setDir(rng() < 0.5 ? 1 : -1);
        setHitIndex(nextHit);
        setPhase('play');
        setLockInput(false);
      }
    }, 700);
  };

  const average = scores.length ? scores.reduce((a,b)=>a+b,0) / scores.length : 0;
  const { rating, multiplier } = ratingFromAverage(average);

  const feedback = (() => {
    const val = scores[scores.length - 1] ?? 0;
    if (val >= 0.95) return { label: 'Perfect', color: 'text-emerald-600' };
    if (val > 0) return { label: 'Nice', color: 'text-indigo-600' };
    return { label: 'Miss', color: 'text-rose-600' };
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-800">{title}</div>
          <div className="text-xs text-slate-500">{subtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>Back</Button>
          )}
          <Button variant="outline" size="sm" onClick={onSkip}>Skip</Button>
        </div>
      </div>

      {/* Progress */}
      <div className="text-xs text-slate-500">Hit {Math.min(hitIndex+1, hits)} of {hits}</div>

      {/* Bar */}
      <div className="relative h-10 rounded-xl overflow-hidden border bg-gradient-to-b from-slate-50 to-slate-100">
        {/* target zone */}
        <div
          className="absolute inset-y-0 bg-emerald-200/50 border border-emerald-300/70"
          style={{
            left: `${(currentCenter - targetWidth/2) * 100}%`,
            width: `${targetWidth * 100}%`
          }}
        />
        {/* marker */}
        <motion.div
          key={`${hitIndex}_${phase}`} // force small animation when hit changes
          className="absolute w-5 h-5 rounded-full bg-indigo-600 shadow"
          animate={{ 
            scale: phase === 'feedback' && feedback.label === 'Perfect' ? 1.2 : 1 
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ 
            left: `${pos * 100}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {phase === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center text-sm font-semibold ${feedback.color}`}
          >
            {feedback.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls or Results */}
      {phase !== 'results' ? (
        <div className="flex items-center justify-center pt-2">
          <Button
            className="w-full py-6 text-base"
            onClick={handleStop}
            disabled={lockInput}
          >
            STOP
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border p-4 bg-white">
            <div className="text-sm text-slate-600">Average Accuracy</div>
            <div className="text-2xl font-bold text-slate-800">{(average*100).toFixed(0)}%</div>
            <div className="text-sm mt-1">Rating: <span className="font-semibold">{rating}</span></div>
            <div className="text-xs text-slate-500">Suggested multiplier: x{multiplier.toFixed(2)}</div>
          </div>
          <Button className="w-full" onClick={() => onComplete?.({ averageAccuracy: average, rating, multiplier })}>Continue</Button>
        </div>
      )}

      {/* Small note for reuse */}
      <div className="text-[11px] text-slate-400 text-center">Reusable skill check — can power training, interviews, chores, driving test, etc.</div>
    </div>
  );
}