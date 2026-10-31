import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

import { useGameState, formatMoney, createSeededRng } from '@/components/game/GameStateContext';
import { getJobById, ensureNoTrailingZero, educationRank, EDUCATION_LEVELS } from '@/components/game/jobSystem';
import { getMajorById } from '@/components/game/educationSystem';
import { normalizePlayerCareer } from '@/components/game/careerSystem';

const APPLY_FOCUS_COST = 1;

const SYSTEMS = [
  { id: 'music', title: 'Music', emoji: '🎵', blurb: 'Become a musician through the existing Music system.' },
  { id: 'socialMedia', title: 'Social Media', emoji: '📱', blurb: 'Build a following using the existing Social Media system.' },
  { id: 'politics', title: 'Politics', emoji: '🏛️', blurb: 'Run for office via the existing Politics system.' },
  { id: 'business', title: 'Small Business', emoji: '🏢', blurb: 'Start businesses through the existing Small Business system.' },
  { id: 'crime', title: 'Crime', emoji: '🕵️', blurb: 'High risk, high reward via the existing Crime system.' }
];

const TRACKS = [
  { id: 'aerospace', title: 'Aerospace Program', emoji: '🚀', jobId: 'aerospace_program', blurb: 'Launches, simulations, missions.' },
  { id: 'space_contractor', title: 'Private Space Contractor', emoji: '🛰️', jobId: 'space_contractor', blurb: 'Commercial launches, investor calls, and high-stakes missions.' },
  { id: 'tech', title: 'Tech Innovator', emoji: '🧲', jobId: 'tech_innovator', blurb: 'Prototypes, patents, moonshots.' },
  { id: 'culinary', title: 'Culinary Track', emoji: '🍽️', jobId: 'chef', blurb: 'Kitchen grind → awards → restaurant dreams.' },
  { id: 'police', title: 'Police Track', emoji: '🚓', jobId: 'police_officer', blurb: 'Serve, investigate, survive the hard years.' },
  { id: 'bounty', title: 'Bounty Hunter', emoji: '🎯', jobId: 'bounty_hunter', blurb: 'Track targets and make big decisions.' },
  { id: 'acting', title: 'Acting', emoji: '🎬', jobId: 'actor', blurb: 'Auditions, gigs, and climbing the ladder.' }
];

// Funny text packs (success/fail) for each track
const FLAVOR = {
  aerospace: {
    success: [
      "They hand you a badge and a checklist. It's 90% checklist. Somehow it still feels heroic.",
      "You say \"I love rockets.\" They say \"Great. You'll love spreadsheets.\" Congratulations: you're hired.",
      "Your interview goes well. Then they ask if you're okay with \"occasional explosions.\" You nod like it's a normal question."
    ],
    fail: [
      "They say \"We'll circle back.\" The only circling happens in orbit.",
      "Your application makes it to the final round… and then gets lost in a black hole labeled \"Internal Review.\"",
      "They love your passion, but they need someone with \"3+ years of launch experience.\" Cool. Cool cool cool."
    ]
  },

  space_contractor: {
    success: [
      "A recruiter says \"We move fast.\" Five minutes later you're hired and already in a meeting you didn't agree to.",
      "A VC nods once and says \"Scale it.\" Nobody explains what \"it\" is. You're hired anyway.",
      "They ask if you're comfortable with high risk. You say yes. They say \"Great.\" Then they slide over a liability waiver the size of a novel."
    ],
    fail: [
      "They ask if you can work weekends. You ask \"Which planet?\" They stop replying immediately.",
      "They say you're a great fit, then hire someone's cousin. The cousin's resume is a napkin.",
      "Your application is \"under consideration,\" which is corporate for \"no, but politely.\""
    ]
  },

  tech: {
    success: [
      "Your prototype works the exact moment someone asks \"Does it work?\" That timing alone gets you hired.",
      "They ask you to explain your idea. You finish. Someone whispers \"That's either genius or illegal.\" They hire you to find out.",
      "You bring a demo. It doesn't explode. They seem genuinely impressed. You're hired."
    ],
    fail: [
      "Your demo crashes right when you say \"It never crashes.\" The universe remains undefeated.",
      "They say \"We're looking for someone more… senior.\" You consider adding \"Senior\" to your name legally.",
      "The interviewer nods a lot, then hits you with: \"We'll keep your file.\" You can feel the dust forming already."
    ]
  },

  culinary: {
    success: [
      "The head chef nods once. That's basically a love letter. You're in.",
      "They taste your dish, go quiet, then say: \"Do that again tomorrow.\" You're hired.",
      "You survive the trial shift. Your feet are gone, but your career is alive. Congratulations."
    ],
    fail: [
      "They call your dish \"bold.\" In chef-language, that means \"No.\"",
      "They say your plating has \"character.\" That's code for \"Please leave.\"",
      "You burn one thing. Just one. Somehow the kitchen treats it like a war crime."
    ]
  },

  police: {
    success: [
      "You pass the academy screening. Someone immediately hands you paperwork. The real boss battle begins.",
      "They say \"Welcome aboard.\" Your sleep schedule leaves the chat.",
      "You finish the interview and realize the chair was uncomfortable on purpose. Congrats: you can tolerate discomfort. You're hired."
    ],
    fail: [
      "They reject you because your paperwork is missing page 7. You don't remember page 7 existing. Page 7 wins anyway.",
      "They say you're not a fit \"at this time.\" The time was never right. The time is a liar.",
      "They ask if you're okay with stress. You laugh. They don't. Application denied."
    ]
  },

  bounty: {
    success: [
      "A grizzled agent slides you a folder and says: \"Don't die.\" That's the whole orientation. You're hired.",
      "They hand you handcuffs and a liability waiver. Romantic. You got the job.",
      "They ask if you can run in uncomfortable boots. You say yes. They hire you based purely on that."
    ],
    fail: [
      "They ask for references. You list three people who actively dislike you. The honesty does not help.",
      "They say \"We'll call you.\" Your phone immediately develops trust issues.",
      "Your application gets stapled to a wanted poster. Probably a coincidence. Probably."
    ]
  },

  acting: {
    success: [
      "Casting says \"We love your look.\" You do not know what that means. You pretend you do. You're hired.",
      "You book the role. You receive two things: a script and a free bottle of water. Stardom begins.",
      "They say \"You've got presence.\" You nod like you knew that already. You got it."
    ],
    fail: [
      "They say \"We'll keep you in mind.\" They immediately forget you exist in this timeline.",
      "You give a perfect performance. They hire the director's friend's roommate's dog instead.",
      "They say you were \"too interesting.\" That's acting-speak for \"No, but we enjoyed the show.\""
    ]
  },

  default: {
    success: ["You're hired. Nobody explains why, but you're not asking questions."],
    fail: ["Rejected. The universe remains chaotic and unhelpful."]
  }
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const clamp01 = (x) => clamp(Number(x || 0), 0, 1);

function getEduLabel(levelId) {
  const meta = EDUCATION_LEVELS.find(e => e.id === levelId);
  if (!meta) return String(levelId || 'high_school');
  return `${meta.emoji} ${meta.label}`;
}

export default function SpecialCareersHubModal({ open, onClose, onOpenSystem }) {
  const { gameState, updateState, addLog, spendFocus } = useGameState();

  const [resultOpen, setResultOpen] = React.useState(false);
  const [resultData, setResultData] = React.useState(null);

  const playerCareer = normalizePlayerCareer(gameState.playerCareer, gameState);
  const currentJobId = playerCareer?.jobId || null;
  const currentYear = gameState.currentYear ?? 0;

  React.useEffect(() => {
    // If the hub closes, also close any pending result popup
    if (!open) {
      setResultOpen(false);
      setResultData(null);
    }
  }, [open]);

  const showResult = (title, body) => {
    setResultData({ title: String(title || 'Result'), body: String(body || '') });
    setResultOpen(true);
  };

  const applyToSpecialCareer = (track) => {
    const job = getJobById(track.jobId);
    if (!job) {
      toast.error('Missing job definition.');
      showResult('⚠️ Missing Job Definition', `This special career is missing its job data.\n\n(jobId: ${track.jobId})`);
      return;
    }

    const isCurrent = Boolean(playerCareer?.employed && currentJobId === track.jobId);
    if (isCurrent) {
      showResult(`${track.emoji} Already Employed`, `You already work as a ${job.title}.\n\nNo need to apply again—go do something reckless and career-related instead.`);
      return;
    }

    // Education gate (hard requirement)
    const eduLevelId = gameState.parentEducation?.highest?.levelId || 'high_school';
    const currentRank = educationRank(eduLevelId);
    const requiredRank = educationRank(job.minEducation);

    if (currentRank < requiredRank) {
      const joke = [
        "They check your qualifications and quietly slide the form into the shredder.",
        "Your application makes a brave attempt… and then runs face-first into the education requirement.",
        "They love your confidence. The requirement does not."
      ];
      const rng0 = createSeededRng(`${gameState.runSeed || 'seed'}|scEduBlock|age:${currentYear}|job:${job.id}`);
      showResult(
        `${track.emoji} Application Blocked`,
        `${rng0.pick(joke)}\n\nRequirement: ${getEduLabel(job.minEducation)}\nYour education: ${getEduLabel(eduLevelId)}\n\nGo level up your education, then apply again.`
      );
      return;
    }

    // Focus cost (and ALWAYS show a popup if it fails)
    const ok = spendFocus?.(APPLY_FOCUS_COST, `Apply: ${track.title}`);
    if (!ok) {
      showResult(
        '🧠 Not Enough Focus',
        `You try to apply… but your brain is buffering.\n\nApplying costs ${APPLY_FOCUS_COST} Focus. Get some Focus and try again.`
      );
      return;
    }

    // Deterministic RNG (IMPORTANT: createSeededRng returns { nextFloat, pick })
    const attempt = Number(gameState.counters?.specialCareerApplyCountThisAge || 0);
    const rng = createSeededRng(`${gameState.runSeed || 'seed'}|scApply|age:${currentYear}|job:${job.id}|attempt:${attempt}`);

    // Optional major/field match influence
    const majorId = gameState.parentEducation?.highest?.majorId || null;
    const major = majorId ? getMajorById(majorId) : null;
    const playerField = major?.field || null;

    let fieldMatch = null;
    if (playerField && Array.isArray(job.fields) && job.fields.length > 0) {
      fieldMatch = job.fields.includes(playerField);
    }

    // Base chance (special careers are harder)
    let chance = 0.45;

    // Difficulty by track
    if (track.id === 'aerospace' || track.id === 'space_contractor' || track.id === 'tech') chance -= 0.10;
    if (track.id === 'acting') chance -= 0.08;
    if (track.id === 'police') chance -= 0.04;

    // Easier ones
    if (track.id === 'bounty') chance += 0.05;
    if (track.id === 'culinary') chance += 0.03;

    // Bonuses
    if (currentRank > requiredRank) chance += 0.06;
    if (fieldMatch === true) chance += 0.06;
    if (fieldMatch === false) chance -= 0.04;
    if (!playerCareer?.employed) chance += 0.04;

    chance = clamp(chance, 0.08, 0.85);
    chance = clamp01(chance);

    const roll = rng.nextFloat();
    const hired = roll < chance;

    // Starting level boost from education
    let startIndex = 0;
    if (track.id === 'aerospace' || track.id === 'space_contractor' || track.id === 'tech') {
      startIndex = currentRank >= 3 ? 2 : currentRank >= 2 ? 1 : 0;
    } else if (track.id === 'bounty' || track.id === 'acting') {
      startIndex = currentRank >= 2 ? 1 : 0;
    }
    startIndex = Math.min(startIndex, (job.levels?.length || 1) - 1);

    const incomeMult = job.levels?.[startIndex]?.incomeMult || 1;
    const base = job.baseYearlyIncome || 0;
    const income = ensureNoTrailingZero(Math.round(base * incomeMult), Date.now());

    // Pick funny line
    const pack = FLAVOR[track.id] || FLAVOR.default;
    const funnyLine = hired ? rng.pick(pack.success) : rng.pick(pack.fail);

    // Persist attempt counter + (optionally) job on success
    updateState(prev => {
      const nextCounters = {
        ...(prev.counters || {}),
        specialCareerApplyCountThisAge: (prev.counters?.specialCareerApplyCountThisAge || 0) + 1
      };

      const pc0 = normalizePlayerCareer(prev.playerCareer, prev);
      const y = prev.currentYear ?? 0;
      const flagsByAge = { ...(pc0.flagsByAge || {}) };
      flagsByAge[y] = { ...(flagsByAge[y] || {}), interacted: true };

      if (!hired) {
        flagsByAge[y] = { ...(flagsByAge[y] || {}), specialCareerRejected: job.id };
        return { counters: nextCounters, playerCareer: { ...pc0, flagsByAge } };
      }

      flagsByAge[y] = { ...(flagsByAge[y] || {}), specialCareerHired: job.id };

      const nextCareer = {
        ...pc0,
        flagsByAge,
        employed: true,
        jobId: job.id,
        jobLevelIndex: startIndex,
        yearsInJob: 0,
        performance: 55,
        careerRep: Math.max(45, pc0.careerRep || 55),
        yearlyIncome: income,
        jobTitle: job.levels?.[startIndex]?.title || job.title,
        companyName: job.title
      };

      return { counters: nextCounters, playerCareer: nextCareer };
    });

    addLog?.(`${track.emoji} Applied: ${track.title} — ${hired ? 'Accepted' : 'Rejected'}`);

    if (hired) {
      toast.success('Hired!', { icon: track.emoji });
      showResult(
        `${track.emoji} Accepted — ${track.title}`,
        `${funnyLine}\n\n✅ You got the job.\nRole: ${job.levels?.[startIndex]?.title || job.title}\nSalary: $${formatMoney(income)}/yr\n\n(Each application costs ${APPLY_FOCUS_COST} Focus.)`
      );
    } else {
      toast('Rejected.', { icon: '📭' });
      const extra =
        fieldMatch === false
          ? `\n\nTip: Your major doesn't match this field. A matching major helps.`
          : `\n\nTip: Higher education and a strong major match improve your chances.`;

      showResult(
        `${track.emoji} Rejected — ${track.title}`,
        `${funnyLine}\n\n❌ Not hired this time.${extra}\n\n(Each application costs ${APPLY_FOCUS_COST} Focus.)`
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => (!v ? onClose?.() : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🧭 Special Careers</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[70vh] pr-2">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Systems</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEMS.map(sys => (
                    <div key={sys.id} className="border rounded-xl p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{sys.emoji} {sys.title}</div>
                        <Button size="sm" variant="secondary" onClick={() => { onClose?.(); onOpenSystem?.(sys.id); }}>
                          Open
                        </Button>
                      </div>
                      <div className="text-xs text-slate-600 mt-2">{sys.blurb}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Special Career Jobs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRACKS.map(track => {
                    const job = getJobById(track.jobId);
                    const isCurrent = Boolean(playerCareer?.employed && currentJobId === track.jobId);
                    const req = job?.minEducation ? getEduLabel(job.minEducation) : '—';
                    return (
                      <div key={track.id} className="border rounded-xl p-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{track.emoji} {track.title}</div>
                          <Button size="sm" disabled={isCurrent} onClick={() => applyToSpecialCareer(track)}>
                            {isCurrent ? 'Current' : 'Apply'}
                          </Button>
                        </div>

                        <div className="text-xs text-slate-600 mt-2">{track.blurb}</div>

                        <div className="text-[11px] text-slate-500 mt-2">
                          Requires: {req} • Apply costs: {APPLY_FOCUS_COST} Focus
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-slate-500">
                If you don't see a pop-up after applying, that's a bug. This file fixes it by using an AlertDialog above the hub.
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Result Pop-up (always visible above the hub) */}
      <AlertDialog open={resultOpen} onOpenChange={setResultOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>{resultData?.title || 'Result'}</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line text-slate-700">
              {resultData?.body || ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}