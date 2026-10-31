import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export function buildTrampolineMoment({ childName = 'your child', visitNumber = 1, gain = 1.0 }) {
  const n = Number(visitNumber || 1);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const STAGES = {
    1: {
      badge: 'Brave Steps',
      narrative: [
        `${childName} clutches your hand at first… then tries a tiny bounce.`,
        `${childName} starts cautious—one bounce, then another—eyes wide but curious.`,
        `${childName} watches other kids, then commits to a small jump like it’s a heroic quest.`
      ],
      trick: [
        'New move: The Careful Bounce™.',
        "Unlocked: ‘Two-Foot Hop’ (Level 1).",
        "Achievement: ‘Didn’t immediately sit down.’"
      ],
      payoff: [
        'They laugh like they surprised themselves.',
        'Confidence rises the moment their feet leave the mat.'
      ],
      milestone: false
    },
    2: {
      badge: 'Air Time',
      narrative: [
        `${childName} runs in without hesitating this time.`,
        `${childName} asks, ‘Can I go higher?’ and then… goes higher.`,
        `${childName} bounces like they own the place for a full ten seconds.`
      ],
      trick: [
        'New move: Knee Bounce.',
        "Unlocked: ‘Star Jump’.",
        "Achievement: ‘Higher Than Yesterday.’"
      ],
      payoff: [
        'They land steadier, grinning.',
        'It’s the kind of brave you can see.'
      ],
      milestone: false
    },
    3: {
      badge: 'Skill Loading…',
      narrative: [
        `${childName} starts experimenting—timing, balance, little hops with style.`,
        `${childName} watches a kid do a trick and says, ‘I can do that.’ (ominous, but hopeful)`,
        `${childName} builds a rhythm: bounce-bounce-BOUNCE.`
      ],
      trick: [
        'New move: Seat Drop (with dramatic flair).',
        "Unlocked: ‘Half-Twist’ attempt.",
        "Achievement: ‘Landing Without Wobble.’"
      ],
      payoff: [
        'They’re not just bouncing now. They’re practicing.'
      ],
      milestone: false
    },
    4: {
      badge: 'Flip Era',
      narrative: [
        `${childName} asks for ‘the flip lesson’ like they’ve been waiting all week.`,
        `${childName} spends the whole time coaching themselves: ‘Tuck… tuck… TUCK!’`,
        `${childName} commits to learning one real trick today.`
      ],
      trick: [
        'Milestone: First Front Flip attempt.',
        "Unlocked: ‘Front Flip (Almost).’",
        "Achievement: ‘Feet Over Head’ (briefly)."
      ],
      payoff: [
        'They land, pop up, and immediately demand a replay.'
      ],
      milestone: true
    },
    5: {
      badge: 'Certified Flipper',
      narrative: [
        `${childName} lands a front flip so clean they look around for applause.`,
        `${childName} starts teaching YOU the rules: ‘Watch this. No, like THIS.’`,
        `${childName} strings together jumps like a mini routine.`
      ],
      trick: [
        'Unlocked: Clean Front Flip.',
        "New combo: ‘Front Flip + Stuck Landing.’",
        "Achievement: ‘I Meant To Do That.’"
      ],
      payoff: [
        'They’re proud in a way that sticks.'
      ],
      milestone: false
    },
    6: {
      badge: 'Backflip Moment',
      narrative: [
        `${childName} announces: ‘Today is backflip day.’ Like it’s a holiday.`,
        `${childName} takes a deep breath and goes for it—no hesitation.`,
        `${childName} bounces higher than usual, eyes focused, fearless.`
      ],
      trick: [
        'Milestone: First Backflip!',
        "Unlocked: ‘Backflip (YES!).’",
        "Achievement: ‘Gravity Respectfully Declined.’"
      ],
      payoff: [
        'They land it and look ten feet taller.'
      ],
      milestone: true
    },
    7: {
      badge: 'Trampoline Legend',
      narrative: [
        `${childName} is officially That Kid at the trampoline park. Everyone watches.`,
        `${childName} warms up with flips like it’s normal now.`,
        `${childName} bounces, focuses, and the whole place goes quiet for a second.`
      ],
      trick: [
        'LEGENDARY: Double Backflip!',
        "Unlocked: ‘Double Backflip’ (and a lifelong obsession).",
        "Achievement: ‘Airborn Myth.’"
      ],
      payoff: [
        'They stick the landing and laugh like they just discovered flight.'
      ],
      legendLine: "Something clicks. This isn’t a phase—this is who they are now.",
      milestone: true
    }
  };

  const ADVANCED = {
    badge: 'Still Improving',
    narrative: [
      `${childName} starts inventing combos like a tiny gymnast director.`,
      `${childName} practices until the flips look effortless.`,
      `${childName} coaches another kid for a minute—patient, confident, kind.`
    ],
    trick: [
      'New combo: Double Backflip (cleaner).',
      "Unlocked: ‘No-Hand Spin’ (attempt).",
      "Achievement: ‘Makes It Look Easy.’"
    ],
    payoff: [
      'They leave sweaty, happy, and visibly more sure of themselves.'
    ],
    milestone: false
  };

  const stage = STAGES[n] || ADVANCED;

  return {
    badge: stage.badge,
    header: '🤸 Trampoline Park! ',
    narrative: pick(stage.narrative),
    trick: pick(stage.trick),
    payoff: pick(stage.payoff),
    legendLine: stage.legendLine || null,
    showDiminish: n >= 2,
    gain: Number(gain || 0).toFixed(1),
    visitNumber: n,
    childName,
    milestone: Boolean(stage.milestone)
  };
}

export default function TrampolineMomentModal({ open, onClose, payload }) {
  useEffect(() => {
    if (!open || !payload?.milestone) return;
    try {
      const burst = () => confetti({ particleCount: 80, spread: 65, origin: { y: 0.3 } });
      burst();
      setTimeout(burst, 200);
    } catch {}
  }, [open, payload?.milestone]);

  const copyText = () => {
    const lines = [
      `${payload?.header || '🤸 Trampoline Park!'}`,
      `[${payload?.badge}] Visit #${payload?.visitNumber}`,
      payload?.narrative,
      payload?.trick,
      payload?.payoff,
      payload?.legendLine,
      `Focus: -1 | Confidence +${payload?.gain}`
    ].filter(Boolean).join('\n');
    try { navigator.clipboard?.writeText(lines); } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-md pointer-events-auto"
          >
            <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="text-lg font-bold text-slate-900">{payload?.header || '🤸 Trampoline Park!'}</div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">{payload?.badge}</span>
              </div>
              <div className="px-5 py-4 space-y-2 text-slate-800">
                <div>{payload?.narrative}</div>
                <div className="font-medium">{payload?.trick}</div>
                <div className="text-slate-600">{payload?.payoff}</div>
                {payload?.legendLine && (
                  <div className="text-rose-600 text-sm mt-1">{payload.legendLine}</div>
                )}

                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span>Focus: <span className="font-semibold text-slate-900">-1</span></span>
                      <span>{payload?.childName || 'Your child'}: Confidence <span className="font-semibold text-emerald-700">+{payload?.gain}</span></span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={copyText}>Copy</Button>
                      <Button onClick={onClose}>Close</Button>
                    </div>
                  </div>
                  {payload?.showDiminish && (
                    <div className="text-[10px] text-slate-500 mt-2">(diminishing returns: +{payload?.gain} this time)</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}