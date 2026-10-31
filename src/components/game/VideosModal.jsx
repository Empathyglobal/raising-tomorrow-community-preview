import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatSmallDelta, getActionBeneficiary } from "@/components/game/GameStateContext.jsx";
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { toast } from 'sonner';

const LEARNING_VIDEOS_PARENT_LESSONS = [
  {id:"mc_01", title:"Calm is contagious", text:"When emotions spike, slow your voice and body first. Your child borrows your nervous system before they build their own."},
  {id:"mc_02", title:"Name it to tame it", text:"Label the feeling out loud (\"That's frustration.\"). Naming emotions reduces panic and makes choices easier."},
  {id:"mc_03", title:"Two good choices", text:"Offer two options you can live with. Kids cooperate faster when they get a small, safe sense of control."},
  {id:"mc_04", title:"Short sentences in storms", text:"During a meltdown, explanations don't land. Use 1–2 calm lines: safety + empathy + next step."},
  {id:"mc_05", title:"Repair beats perfection", text:"If you snap, come back and repair. A real apology teaches safety more than pretending nothing happened."},
  {id:"mc_06", title:"Praise the process", text:"Call out effort and strategy, not \"being smart.\" Confidence grows from tries, not trophies."},
  {id:"mc_07", title:"Boundaries with warmth", text:"Hold the limit without turning cold. The lesson is: 'No' can still be loving."},
  {id:"mc_08", title:"Transitions need warnings", text:"Give countdowns before switching activities. Most blow-ups happen between 'now' and 'next.'"},
  {id:"mc_09", title:"Teach the replacement skill", text:"Stopping a behavior isn't enough—teach what to do instead. Practice it when everyone is calm."},
  {id:"mc_10", title:"Curiosity before correction", text:"Ask what happened first. Kids tell the truth more when they feel understood before judged."},
  {id:"mc_11", title:"Co-regulate first", text:"If they're dysregulated, connection comes before consequences. Calm first, then solve."},
  {id:"mc_12", title:"Describe, don't label", text:"Talk about the situation (\"Milk spilled\") not the identity (\"You're careless\"). Labels stick to kids."},
  {id:"mc_13", title:"Routines reduce fights", text:"Simple routines turn constant negotiation into muscle memory. Predictability is a kind of kindness."},
  {id:"mc_14", title:"Make space for 'why'", text:"A child's 'why' is often a request for safety or meaning. Answering it builds trust."},
  {id:"mc_15", title:"Limit screens without shame", text:"Treat screen limits like health, not morality. The goal is balance, not guilt."},
  {id:"mc_16", title:"Let feelings be weather", text:"You don't have to fix every tear. Feelings rise and fall—your job is to stay steady."},
  {id:"mc_17", title:"Catch tiny wins", text:"Notice the small good moments immediately. Attention is fuel—use it on what you want to grow."},
  {id:"mc_18", title:"Lead with empathy, then structure", text:"Empathy opens the door; structure keeps the house standing. Kids need both."},
  {id:"mc_19", title:"One clear request", text:"Swap lectures for one clear instruction. Clarity lowers stress for both of you."},
  {id:"mc_20", title:"Protect sleep like a superpower", text:"Sleep protects learning, mood, and impulse control. Treat bedtime as brain-care."},
  {id:"mc_21", title:"Play is persuasion", text:"Turn cooperation into a game sometimes. Play lowers resistance and increases connection."},
  {id:"mc_22", title:"Hold the line, drop the power struggle", text:"You can be firm without escalating. The limit stays; the battle doesn't."},
  {id:"mc_23", title:"Ask for their idea", text:"Invite problem-solving: 'What should we do next time?' Ownership makes skills stick."},
  {id:"mc_24", title:"Be the adult you needed", text:"Notice what your younger self didn't get, and practice giving it now—steady, simple, repeatable."}
];

export default function VideosModal({ open, onClose }) {
  const { gameState, updateState, applyStress, applyDeltas, applyLove, spendFocus, addLog, recordTimelineEntry, emitActionResult, awardStudyPoints } = useGameState();
  const [lessonPopupOpen, setLessonPopupOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [trackSelectionOpen, setTrackSelectionOpen] = useState(false);
  
  const benef = getActionBeneficiary(gameState);
  
  const videoState = gameState.video || { 
    usedThisYear: { netflix: false, hbo: false, prime: false, apple: false, masterclass: false },
    masterclassLessonHistory: [],
    masterclassTracks: { boundaries: 0, sleep: 0, emotional: 0 },
    lastMasterclassTrack: null
  };
  
  const handleBinge = (platform) => {
    const platformNames = {
      netflix: "Netflix",
      hbo: "HBO",
      prime: "Prime",
      apple: "Apple TV+"
    };
    
    const platformName = platformNames[platform];
    
    // Mark as used
    updateState({
      video: {
        ...videoState,
        usedThisYear: {
          ...videoState.usedThisYear,
          [platform]: true
        }
      }
    });
    
    // Apply stress
    applyStress(1, `Binged ${platformName}`);
    
    // Add log
    addLog(`📺 You binged another season on ${platformName}. Should you feel better? …because you feel worse.`);
    
    // Record timeline
    recordTimelineEntry({
      kind: "system",
      title: `📺 Binge Mode: ${platformName}`,
      detail: "You binged another season. Should you feel better? Somehow… you feel worse.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 1
    });
    
    // Show toast
    /* toast removed in favor of result sheet */
    
    const popup = pickMissingActionPopup("videos", "binge");
    if (popup) {
      emitActionResult({
        actionId: "videos",
        title: popup.title,
        body: interpolatePopupText(popup.body, { platformName }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 1,
        tags: popup.tags,
        meta: { 
          emoji: popup.emoji,
          backfireNote: "A screen binge is a quick band‑aid—then stress comes back with interest. Rest helps; numbing doesn’t."
        }
      });
    }
    
    onClose();
  };
  
  const handleMasterclassTrackChoice = (track) => {
    const trackKey = track === 'boundaries' ? 'boundaries' : track === 'sleep' ? 'sleep' : 'emotional';
    const trackLabel = track === 'boundaries' ? 'Boundaries & Discipline' : track === 'sleep' ? 'Routines & Sleep' : 'Emotional Coaching';
    const trackEmoji = track === 'boundaries' ? '🧱' : track === 'sleep' ? '🌙' : '💛';

    if (!spendFocus(1, "Learning Videos")) {
      toast.error("Not enough focus for Learning Videos.");
      return;
    }
    
    awardStudyPoints(1, "Learning Videos");

    const prevCount = Number(videoState.masterclassTracks[trackKey] || 0);
    const BASE = 0.1;
    const CAP = 0.8;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    // Base effects
    const baseDiscipline = 1;
    const baseConfidence = 1;
    const baseStress = -2;

    // Track-specific mastery bonuses
    let childDeltas = { discipline: baseDiscipline, confidence: baseConfidence };
    if (track === 'boundaries') {
      childDeltas.discipline += roundedBonus;
    } else if (track === 'sleep') {
      childDeltas.discipline += roundedBonus;
      const anxReduction = -Math.min(0.6, roundedBonus);
      childDeltas.anxiety = anxReduction;
    } else if (track === 'emotional') {
      childDeltas.empathy = roundedBonus;
    }

    applyStress(baseStress, "Learning Videos");
    applyDeltas(childDeltas, `Learning Videos: ${trackLabel}`);

    // Update state
    const newBoundaries = track === 'boundaries' ? prevCount + 1 : videoState.masterclassTracks.boundaries || 0;
    const newSleep = track === 'sleep' ? prevCount + 1 : videoState.masterclassTracks.sleep || 0;
    const newEmotional = track === 'emotional' ? prevCount + 1 : videoState.masterclassTracks.emotional || 0;

    const maxCount = Math.max(newBoundaries, newSleep, newEmotional);
    const toolkitUnlocked = maxCount >= 3;

    updateState(prev => ({
      video: {
        ...(prev.video || {}),
        usedThisYear: {
          ...(prev.video?.usedThisYear || {}),
          masterclass: true
        },
        masterclassTracks: {
          boundaries: newBoundaries,
          sleep: newSleep,
          emotional: newEmotional
        },
        lastMasterclassTrack: trackKey
      }
    }));

    // Trophy at 5
    if (prevCount + 1 === 5) {
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked['masterclass_track_master_5']) {
        updateState({
          trophies: {
            unlocked: {
              ...(trophies.unlocked || {}),
              masterclass_track_master_5: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: `5 masterclasses in ${trackLabel} track`
              }
            }
          }
        });
        addLog('🏆 Trophy unlocked: Certified Parent Coach');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Certified Parent Coach',
          detail: `Completed 5 learning videos in ${trackLabel} track.`
        });
      }
    }

    addLog(`${trackEmoji} Learning Videos: ${trackLabel}. Track count: ${prevCount + 1}`);

    const masteryText = track === 'boundaries'
      ? `DISCIPLINE ${formatSmallDelta(baseDiscipline + roundedBonus)}`
      : track === 'sleep'
        ? `DISCIPLINE ${formatSmallDelta(baseDiscipline + roundedBonus)} • ANXIETY ${formatSmallDelta(childDeltas.anxiety)}`
        : `EMPATHY ${formatSmallDelta(roundedBonus)}`;

    const bodyText = `You complete a ${trackLabel} learning video. Real parenting tools from real experts.\n\nStress -2\n${benef.label}: ${masteryText} • CONFIDENCE +${baseConfidence}\n\n${trackLabel} count: ${prevCount + 1}${toolkitUnlocked && maxCount === 3 ? '\n\n✨ UNLOCKED: Parent Coach Toolkit' : ''}`;

    emitActionResult({
      title: `${trackEmoji} Learning Videos: ${trackLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta: baseStress,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["study", "masterclass"],
      meta: { emoji: trackEmoji }
    });

    recordTimelineEntry({
      kind: 'study',
      title: `${trackEmoji} Learning Videos: ${trackLabel}`,
      detail: `Track count: ${prevCount + 1}. Parenting skills deepening.`,
      deltas: childDeltas,
      stressDelta: baseStress,
      loveDelta: 0,
      moneyDelta: 0,
      meta: { track: trackKey, trackCount: prevCount + 1 }
    });

    setTrackSelectionOpen(false);
    onClose();
  };

  const computeNextMasteryBonus = (trackKey) => {
    const prevCount = Number(videoState.masterclassTracks[trackKey] || 0);
    const BASE = 0.1;
    const CAP = 0.8;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
  };
  
  const platforms = [
    { id: 'netflix', name: 'Netflix', emoji: '📺' },
    { id: 'hbo', name: 'HBO', emoji: '📺' },
    { id: 'prime', name: 'Prime', emoji: '📺' },
    { id: 'apple', name: 'Apple TV+', emoji: '📺' }
  ];
  
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              📺 Videos
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-sm text-slate-600 mb-4">
            Sometimes you need a break. Sometimes the break needs a break.
          </p>
          
          <div className="space-y-3">
            {/* Binge options */}
            {platforms.map(platform => {
              const used = videoState.usedThisYear[platform.id];
              
              return (
                <button
                  key={platform.id}
                  onClick={() => !used && handleBinge(platform.id)}
                  disabled={used}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    used
                      ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{platform.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        {platform.name} (Binge)
                      </div>
                      {used ? (
                        <div className="text-xs text-slate-500 mt-1">
                          Already binged {platform.name} this year.
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 mt-1">
                          Free • +1 Stress • Once per year
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            
            {/* Learning Videos option */}
            <button
              onClick={() => !videoState.usedThisYear.masterclass && gameState.actionPoints >= 1 && setTrackSelectionOpen(true)}
              disabled={videoState.usedThisYear.masterclass || gameState.actionPoints < 1}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                videoState.usedThisYear.masterclass || gameState.actionPoints < 1
                  ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 hover:from-amber-100 hover:to-orange-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎓</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">
                    Learning Videos (Learn)
                  </div>
                  {videoState.usedThisYear.masterclass ? (
                    <div className="text-xs text-slate-500 mt-1">
                      Already watched Learning Videos this year.
                    </div>
                  ) : gameState.actionPoints < 1 ? (
                    <div className="text-xs text-red-600 mt-1">
                      No Focus left this year.
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 mt-1">
                      1 Focus • STRESS -2 • Pick specialization track • Once per year
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Learning Videos Track Selection */}
      <Dialog open={trackSelectionOpen} onOpenChange={setTrackSelectionOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>🎓 Choose Your Learning Videos Track</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
              <div className="font-semibold text-slate-700">Track Progress</div>
              <div className="text-slate-600">
                Boundaries: {videoState.masterclassTracks.boundaries} | Routines: {videoState.masterclassTracks.sleep} | Emotional: {videoState.masterclassTracks.emotional}
              </div>
            </div>

            <button
              onClick={() => handleMasterclassTrackChoice('boundaries')}
              className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">🧱</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 mb-1">Boundaries & Discipline</div>
                  <div className="text-xs text-slate-600 mb-2">
                    Base: STRESS -2 • {benef.short} DIS +1 • CON +1
                  </div>
                  <div className="text-xs text-slate-500">
                    Next mastery bonus: DISCIPLINE {formatSmallDelta(computeNextMasteryBonus('boundaries'))}
                  </div>
                  <div className="text-xs text-slate-500">
                    Count: {videoState.masterclassTracks.boundaries}
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMasterclassTrackChoice('sleep')}
              className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">🌙</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 mb-1">Routines & Sleep</div>
                  <div className="text-xs text-slate-600 mb-2">
                    Base: STRESS -2 • {benef.short} DIS +1 • CON +1
                  </div>
                  <div className="text-xs text-slate-500">
                    Next mastery bonus: DISCIPLINE {formatSmallDelta(computeNextMasteryBonus('sleep'))} • ANXIETY {formatSmallDelta(-Math.min(0.6, computeNextMasteryBonus('sleep')))}
                  </div>
                  <div className="text-xs text-slate-500">
                    Count: {videoState.masterclassTracks.sleep}
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMasterclassTrackChoice('emotional')}
              className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 transition-all text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">💛</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 mb-1">Emotional Coaching</div>
                  <div className="text-xs text-slate-600 mb-2">
                    Base: STRESS -2 • {benef.short} DIS +1 • CON +1
                  </div>
                  <div className="text-xs text-slate-500">
                    Next mastery bonus: EMPATHY {formatSmallDelta(computeNextMasteryBonus('emotional'))}
                  </div>
                  <div className="text-xs text-slate-500">
                    Count: {videoState.masterclassTracks.emotional}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}