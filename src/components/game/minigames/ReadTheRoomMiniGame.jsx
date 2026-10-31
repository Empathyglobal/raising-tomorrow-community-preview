import React from 'react';


const ADJ = {
  confident: ['assertive', 'direct', 'funny'],
  assertive: ['confident', 'direct'],
  direct: ['assertive', 'confident'],
  humble: ['empathetic'],
  empathetic: ['humble'],
  funny: ['confident'],
};

const prompts = [
  {
    contextTag: 'interview',
    prompt: "The interviewer says: “Tell me about a time you handled pressure.”",
    choices: [
      { text: "I stayed calm, broke it into steps, and delivered. Here’s what I learned.", tone: 'confident' },
      { text: "Honestly, I panicked—then I asked for help and improved my system.", tone: 'humble' },
      { text: "Pressure? I call it ‘Tuesday.’ But yes—here’s how I handled it.", tone: 'funny' },
      { text: "I prioritized, executed, and communicated.", tone: 'direct' },
    ],
  },
  {
    contextTag: 'interview',
    prompt: "They ask: “Why should we hire you?”",
    choices: [
      { text: "Because I reliably turn ambiguity into outcomes.", tone: 'assertive' },
      { text: "I learn fast and I’m dependable under real constraints.", tone: 'humble' },
      { text: "Because your problems look lonely and I’m here to adopt them.", tone: 'funny' },
      { text: "I match what you need and can contribute immediately.", tone: 'direct' },
    ],
  },
  {
    contextTag: 'interview',
    prompt: "They say: “We move fast here. Can you keep up?”",
    choices: [
      { text: "Yes. I make good decisions with imperfect info.", tone: 'confident' },
      { text: "Yes—if we’re honest about tradeoffs and iterate.", tone: 'humble' },
      { text: "Fast is fine. Just don’t ask me to be psychic too.", tone: 'funny' },
      { text: "Yes. Give me priorities and I execute.", tone: 'direct' },
    ],
  },
  {
    contextTag: 'conflict',
    prompt: "Someone snaps: “You always make this about you!”",
    choices: [
      { text: "That’s not my intent. I’m listening—what did I miss?", tone: 'empathetic' },
      { text: "You’re right—I got defensive. I’m sorry. Let’s restart calmly.", tone: 'humble' },
      { text: "I’m flattered you think I’m that powerful… but okay, I hear you.", tone: 'funny' },
      { text: "I won’t argue like this. We can talk when we’re calm.", tone: 'direct' },
    ],
  },
  {
    contextTag: 'jobNegotiation',
    prompt: "They say: “This is our standard band.” (Offer is low.)",
    choices: [
      { text: "If we can move to X, I’m ready to commit.", tone: 'assertive' },
      { text: "Is there flexibility via bonus, title, or review timing?", tone: 'humble' },
      { text: "I love standards. I’m hoping we can upgrade mine too.", tone: 'funny' },
      { text: "I can’t accept that number. Here’s my workable range.", tone: 'direct' },
    ],
  },
];

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

export default function ReadTheRoomMiniGame({ open, contextTag = 'interview', onComplete, onSkip, onClose }) {
  const [round, setRound] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [sessionPrompts, setSessionPrompts] = React.useState([]);
  const [targetTone, setTargetTone] = React.useState('confident');
  const [lastReaction, setLastReaction] = React.useState('');

  React.useEffect(() => {
    if (open) {
      const pool = prompts.filter(p => p.contextTag === contextTag);
      const usablePool = pool.length ? pool : prompts;
      const shuffled = [...usablePool].sort(() => Math.random() - 0.5).slice(0, 3);
      setSessionPrompts(shuffled);
      setRound(1);
      setScore( clamp(45 + Math.floor(Math.random()*11) - 5, 0, 100) ); // 40..50 baseline
      setLocked(false);
      const tones = ['confident','humble','funny','direct','empathetic','assertive'];
      setTargetTone(pick(tones));
      setLastReaction('');
    }
  }, [open, contextTag]);

  if (!open) return null;

  const current = sessionPrompts[round-1] || null;

  const handleChoice = (choice) => {
    if (!current || locked) return;
    setLocked(true);

    const tone = choice.tone;
    let delta = 0;
    if (tone === targetTone) delta = 34;
    else if ((ADJ[targetTone]||[]).includes(tone)) delta = 22;
    else delta = 10;

    const newScore = clamp(score + delta, 0, 100);
    setLastReaction(['They lean in…','A thoughtful nod…','They scribble a note…','Polite smile…','Curious eyebrow…'][Math.floor(Math.random()*5)]);

    setTimeout(() => {
      setScore(newScore);
      setLocked(false);
      if (round >= 3) {
        // Finish
        let rating = 'Trainwreck';
        if (newScore >= 80) rating = 'Perfect Fit';
        else if (newScore >= 60) rating = 'Good Impression';
        else if (newScore >= 40) rating = 'Mixed Signals';

        let multiplier = 1.0;
        if (rating === 'Perfect Fit') multiplier = 1.15;
        else if (rating === 'Good Impression') multiplier = 1.08;
        else if (rating === 'Mixed Signals') multiplier = 1.0;
        else multiplier = 0.9;

        onComplete?.({ score: newScore, rating, multiplier });
      } else {
        setRound(r => r + 1);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <div className="text-lg font-bold text-slate-800">🧭 Read The Room</div>
            <div className="text-xs text-slate-500">Round {round} of 3</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onSkip} className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Skip</button>
            <button onClick={onClose} className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Close</button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Vibe Match meter */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1"><span>Vibe Match</span><span>{score}/100</span></div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${score}%` }} />
            </div>
          </div>

          {/* Prompt */}
          {current && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800">{current.prompt}</div>
          )}

          {/* Choices */}
          <div className="space-y-2">
            {current?.choices?.map((c, idx) => (
              <button
                key={idx}
                disabled={locked}
                onClick={() => handleChoice(c)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${locked ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{String.fromCharCode(65+idx)}</span>
                  <span className="text-sm text-slate-800">{c.text}</span>
                </div>
              </button>
            ))}
          </div>

          {lastReaction && (
            <div className="text-[11px] text-slate-500">{lastReaction}</div>
          )}
        </div>
      </div>
    </div>
  );
}