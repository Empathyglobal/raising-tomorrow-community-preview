import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function buildAnxietyMoment({ seed }) {
  // Deterministic RNG (mulberry32)
  function mulberry32(a) {
    let t = 0;
    for (let i = 0; i < String(a).length; i++) {
      t = Math.imul(31, t) + String(a).charCodeAt(i) | 0;
    }
    return function() {
      let x = t += 0x6D2B79F5;
      x = Math.imul(x ^ x >>> 15, 1 | x);
      x ^= x + Math.imul(x ^ x >>> 7, 61 | x);
      return ((x ^ x >>> 14) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(seed || 'seed');

  const TAGS = [
    'Rumination Session',
    'Catastrophe Forecast',
    'Overthinking Olympics',
    'Worst-Case Speedrun',
    'Anxiety Speedrun Any%',
    'Doom Loop Activated'
  ];

  const FINISHERS = [
    'You feel worse, but at least you were thorough.',
    'No solutions were discovered.',
    'You did a lot of thinking and zero fixing.',
    'You managed to spend Focus on nothing.',
    'You close the loop by opening another loop.',
    'You’ve achieved maximum effort with minimum progress.'
  ];

  const BODY_SENSATIONS = [
    'Your stomach drops for no reason.',
    'You re-read a conversation that isn’t even happening.',
    'Your brain opens 19 tabs and none of them are helpful.',
    'You feel busy, but nothing gets done.',
    'You sigh like it’s a full-time job.'
  ];

  const SCENARIOS = [
    { id: 1, category: 'partner', t: 'You remember a tiny tone shift from your partner earlier.', s: 'You decide it means they’re secretly disappointed in your entire personality.', p: 'You consider communicating… then you just stress instead.' },
    { id: 2, category: 'partner', t: 'Your partner says ‘We should talk later.’', s: 'You draft five breakup speeches in your head.', p: 'Later turns out to be about groceries. Too late—you already spiraled.' },
    { id: 3, category: 'partner', t: 'They take a little longer to text back.', s: 'You assume they joined a group chat called ‘Reasons You’re Annoying.’', p: 'You refresh your phone like it’s a life support machine.' },
    { id: 4, category: 'mother', t: 'A memory pops up: something your mom said years ago.', s: 'You relive it and add a director’s cut with extra guilt.', p: 'Congrats. You time-traveled just to lose.' },
    { id: 5, category: 'mother', t: 'You think about calling your mom.', s: 'You rehearse the entire call and still feel judged.', p: 'You don’t call. You just marinate in dread.' },
    { id: 6, category: 'mother', t: 'You hear her voice in your head: ‘Are you sure that’s wise?’', s: 'You start defending your choices to an imaginary courtroom.', p: 'The judge is also you. The verdict is: stress.' },
    { id: 7, category: 'work', t: 'You remember one email you sent with a typo.', s: 'You’re convinced this is how careers end.', p: 'Nobody noticed. Except your anxiety, who wrote a sequel.' },
    { id: 8, category: 'work', t: 'A meeting gets scheduled with no agenda.', s: 'You assume it’s about your ‘performance’ and not… scheduling.', p: 'You spend an hour panicking and zero minutes preparing.' },
    { id: 9, category: 'work', t: 'You see someone typing ‘…’ and then they stop.', s: 'You assume they typed ‘We need to talk’ and deleted it for drama.', p: 'You stare at the dots like they’re an oracle.' },
    { id: 10, category: 'money', t: 'You check your balance.', s: 'You calculate how many months you have until ‘financial collapse.’', p: 'You close the app and decide denial counts as budgeting.' },
    { id: 11, category: 'money', t: 'You remember you subscribed to something you don’t use.', s: 'You spiral into ‘I’m irresponsible with everything.’', p: 'You still don’t cancel it. You just feel worse.' },
    { id: 12, category: 'money', t: 'You think about an unexpected expense.', s: 'You mentally spend money you don’t have, twice.', p: 'Your brain: ‘We’re doomed.’ Your wallet: ‘We’re fine-ish.’' },
    { id: 13, category: 'parenting', t: 'Your child makes a normal child noise.', s: 'You interpret it as proof you’re ‘ruining them permanently.’', p: 'You invent a future autobiography titled: ‘Because My Parent Blinked Wrong.’' },
    { id: 14, category: 'parenting', t: 'You remember something you said impatiently.', s: 'You’re sure this moment will be referenced in therapy.', p: 'You apologize in your head. To everyone. Forever.' },
    { id: 15, category: 'parenting', t: 'You compare yourself to another parent for 0.7 seconds.', s: 'You decide they’re better at everything, including breathing.', p: 'You forget they also have laundry. You don’t calm down.' },
    { id: 16, category: 'politics', t: 'You remember politics exist.', s: 'You run a full disaster simulation featuring you personally failing to fix society.', p: 'You do nothing, but with intensity.' },
    { id: 17, category: 'politics', t: 'You see a headline and don’t even click it.', s: 'You feel guilty AND terrified, efficiently.', p: 'You manage to be informed enough to panic and uninformed enough to panic.' },
    { id: 18, category: 'politics', t: 'You imagine explaining your beliefs out loud.', s: 'You lose the imaginary debate and feel real shame.', p: 'You get roasted by a person who isn’t even here.' },
    { id: 19, category: 'health', t: 'You notice a random ache that will be gone tomorrow.', s: 'You diagnose yourself with something called ‘Definitely Terrible.’', p: 'You decide to worry first and research later (never).' },
    { id: 20, category: 'health', t: 'You think about aging.', s: 'You act like time is a personal insult.', p: 'You stress about stress, which is very efficient.' },
    { id: 21, category: 'health', t: 'You remember you drank water, but not ‘enough water.’', s: 'You feel like hydration is a moral failing.', p: 'You drink nothing and panic harder out of spite.' },
    { id: 22, category: 'social', t: 'You remember a joke you told that didn’t land.', s: 'You replay it like a crime documentary.', p: 'The only witness is your brain, and it hates you.' },
    { id: 23, category: 'social', t: 'Someone says ‘Let’s hang soon!’', s: 'You assume it was a lie to end the conversation.', p: 'You overthink friendship until it becomes a full-time job.' },
    { id: 24, category: 'social', t: 'You see people laughing nearby.', s: 'You’re sure it’s about you, somehow.', p: 'It’s not about you. But you make it about you anyway.' },
    { id: 25, category: 'time', t: 'You look at the clock.', s: 'You panic about all the things you didn’t do… including resting.', p: 'You speedrun guilt and call it productivity.' },
    { id: 26, category: 'time', t: 'You make a to-do list.', s: 'The list becomes an accusation.', p: 'You stare at it until it feels personal.' },
    { id: 27, category: 'home', t: 'You notice a mess.', s: 'You decide your home reflects your entire worth.', p: 'You don’t clean. You judge yourself for not cleaning.' },
    { id: 28, category: 'home', t: 'A weird noise happens in the house.', s: 'You imagine 14 expensive repairs and a raccoon union.', p: 'It’s just the fridge. You still feel doomed.' },
    { id: 29, category: 'self-image', t: 'You see a photo of yourself.', s: 'You zoom in like you’re investigating a scandal.', p: 'You become your own hater with shocking dedication.' },
    { id: 30, category: 'self-image', t: 'You remember a confident version of you existed once.', s: 'You assume they died.', p: 'They’re alive. You just locked them out for stress reasons.' },
    { id: 31, category: 'future', t: 'You think about next year.', s: 'You map out a future where everything goes wrong in alphabetical order.', p: 'You treat ‘maybe’ like ‘definitely’ and suffer accordingly.' },
    { id: 32, category: 'future', t: 'You imagine success.', s: 'You immediately imagine losing it.', p: 'You can’t even daydream without anxiety showing up with paperwork.' },
    { id: 33, category: 'past', t: 'You remember something embarrassing from years ago.', s: 'You’re sure people still discuss it at annual meetings.', p: 'No one remembers. But you do, in 4K.' },
    { id: 34, category: 'past', t: 'You remember a mistake you already fixed.', s: 'You decide fixing it doesn’t count because it happened.', p: 'You punish yourself for growth. Nice.' },
    { id: 35, category: 'work-life balance', t: 'You try to relax.', s: 'You feel guilty for resting and stressed for working.', p: 'You invent a third option: suffering.' },
    { id: 36, category: 'relationships', t: 'You reread a text thread.', s: 'You interpret punctuation like it’s emotional Morse code.', p: 'You fear a period more than a problem.' },
    { id: 37, category: 'identity', t: 'You ask yourself, ‘Am I doing enough?’', s: 'You answer with a PowerPoint titled ‘No.’', p: 'You present it to yourself. Standing ovation. Still stressed.' },
    { id: 38, category: 'internet', t: 'You open social media for ‘one minute.’', s: 'You absorb everyone’s highlights and compare them to your Tuesday.', p: 'You close the app feeling behind at being alive.' },
    { id: 39, category: 'purpose', t: 'You wonder if you’re on the right path.', s: 'You decide there is one correct path and you missed it in 2014.', p: 'You spiral about the past instead of taking a step now.' },
    { id: 40, category: 'misc', t: 'Nothing happens.', s: 'Your brain: ‘Time to invent a problem!’', p: 'You succeed. Congratulations. Stress achieved.' },
  ];

  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  const scenario = pick(SCENARIOS);
  const tag = pick(TAGS);
  const finisher = pick(FINISHERS);
  const addSensation = rng() < 0.3 ? pick(BODY_SENSATIONS) : null;

  return {
    tag,
    trigger: scenario.t,
    spiral: scenario.s,
    punchline: scenario.p,
    finisher,
    sensation: addSensation
  };
}

export default function AnxietyMomentModal({ open, onClose, payload }) {
  const copyText = () => {
    const lines = [
      `${payload?.tag || 'Rumination Session'}`,
      payload?.trigger,
      payload?.spiral,
      payload?.punchline,
      payload?.finisher,
      'Focus: -1 • Stress: +5'
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
                <div className="text-lg font-bold text-slate-900">🌀 Be Anxious</div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-rose-100 text-rose-700 font-semibold">{payload?.tag}</span>
              </div>
              <div className="px-5 py-4 space-y-2 text-slate-800">
                {payload?.sensation && (
                  <div className="text-xs text-slate-500">{payload.sensation}</div>
                )}
                <div>• {payload?.trigger}</div>
                <div>• {payload?.spiral}</div>
                <div>• {payload?.punchline}</div>
                <div className="text-slate-500 text-sm mt-1">{payload?.finisher}</div>

                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span>Focus: <span className="font-semibold text-slate-900">-1</span></span>
                    <span>Stress: <span className="font-semibold text-rose-700">+5</span></span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyText}>Copy</Button>
                    <Button onClick={onClose}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}