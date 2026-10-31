import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, ECONOMY_PRICES, formatMoney } from './GameStateContext';
import { MUSIC_MILESTONES, VOICE_MILESTONES } from './activityProgress';
import MartialArtsModal from './MartialArtsModal';
import { EASTER_EGG_RAISINGSIM_LINES } from './easterEggText';
import { hasShopItem } from './shopCatalog';

export default function MindBodyModal({ open, onClose }) {
  const { gameState, consumeAction, spendMoney, applyDeltas, applyStress, addLog, recordTimelineEntry, updateState, emitActionResult, getLocalAmount, awardWisdomXP } = useGameState();
  const { pendingScenario, finished, actionPoints, didMusicThisAge, didVoiceThisAge, didMindfulnessThisAge, inventory, yearFlags } = gameState;
  const [martialArtsModalOpen, setMartialArtsModalOpen] = useState(false);
  const [easterEggModalOpen, setEasterEggModalOpen] = useState(false);
  const [easterEggText, setEasterEggText] = useState("");

  // Block body scroll when modal is open
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

  const handleMusic = () => {
    consumeAction('mindBody');
    const cost = getLocalAmount(ECONOMY_PRICES.musicLessonsYear);
    spendMoney(cost);
    
    const hasPiano = hasShopItem(gameState, 'piano');
    const hasOtherInstruments = hasShopItem(gameState, 'guitar') || hasShopItem(gameState, 'ukulele') || hasShopItem(gameState, 'violin') || hasShopItem(gameState, 'drumPad');
    
    let baseDeltas = { discipline: 2, confidence: 2, intelligence: 1, empathy: 0 };
    
    if (hasPiano) {
      baseDeltas.intelligence += 1;
    } else if (hasOtherInstruments) {
      baseDeltas.confidence += 0.5;
      baseDeltas.discipline += 0.5;
    }
    
    applyDeltas(baseDeltas, "Music Lessons (Year)");
    
    // Update activity progress
    const currentProgress = gameState.activityProgress?.music || { level: 0, startedAge: gameState.currentYear };
    const newLevel = Math.min(currentProgress.level + 1, MUSIC_MILESTONES.length - 1);
    const milestone = MUSIC_MILESTONES[newLevel];
    
    // Pick one feedback observation
    const feedbackPool = [
      "You notice rhythm is becoming part of how they think.",
      "You notice their patience improving during practice.",
      "You notice music is giving them a language for feelings."
    ];
    const feedback = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
    
    const newYears = gameState.musicYears + 1;
    updateState({ 
      didMusicThisAge: true,
      musicYears: newYears,
      activityProgress: {
        ...gameState.activityProgress,
        music: {
          level: newLevel,
          startedAge: currentProgress.startedAge
        }
      }
    });

    emitActionResult({
      actionId: 'mindBody',
      title: 'Music Lessons Year',
      body: `Now at: ${milestone}. ${feedback}`,
      deltas: baseDeltas,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['activity', 'mindBody'],
      meta: { emoji: '🎹', milestone }
    });

    onClose();
  };

  const handleVoice = () => {
    consumeAction('mindBody');
    const cost = getLocalAmount(ECONOMY_PRICES.voiceLessonsYear);
    spendMoney(cost);
    
    const deltas = { confidence: 3, empathy: 1, discipline: 1, intelligence: 0 };
    applyDeltas(deltas, "Voice Lessons (Year)");
    
    // Update activity progress
    const currentProgress = gameState.activityProgress?.voice || { level: 0, startedAge: gameState.currentYear };
    const newLevel = Math.min(currentProgress.level + 1, VOICE_MILESTONES.length - 1);
    const milestone = VOICE_MILESTONES[newLevel];
    
    // Pick one feedback observation
    const feedbackPool = [
      "You notice them projecting more in daily life.",
      "You notice confidence bleeding into how they speak.",
      "You notice them singing in the shower (badly, but proudly)."
    ];
    const feedback = feedbackPool[Math.floor(Math.random() * feedbackPool.length)];
    
    const newYears = gameState.voiceYears + 1;
    updateState({ 
      didVoiceThisAge: true,
      voiceYears: newYears,
      activityProgress: {
        ...gameState.activityProgress,
        voice: {
          level: newLevel,
          startedAge: currentProgress.startedAge
        }
      }
    });

    emitActionResult({
      actionId: 'mindBody',
      title: 'Voice Lessons Year',
      body: `Now at: ${milestone}. ${feedback}`,
      deltas: deltas,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['activity', 'mindBody'],
      meta: { emoji: '🎤', milestone }
    });

    onClose();
  };

  const handleMindfulness = () => {
    consumeAction('mindBody');
    
    const deltas = { empathy: 1, confidence: 1, intelligence: 0, discipline: 0 };
    applyDeltas(deltas, "Mindfulness (Year)");
    applyStress(-2, "Mindfulness habit");
    updateState({ didMindfulnessThisAge: true });
    if (awardWisdomXP) awardWisdomXP("mindfulness", 1, "Mind & Body: Mindfulness class");

    emitActionResult({
      actionId: 'mindBody',
      title: 'Mindfulness Habit',
      body: "A small daily habit changes the whole vibe.",
      deltas: deltas,
      loveDelta: 0,
      stressDelta: -2,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['activity', 'mindBody'],
      meta: { emoji: '🧘' }
    });

    onClose();
  };

  const handlePlayRaisingTomorrow = () => {
    // Check if already played this year
    const flags = yearFlags || {};
    if (flags.playedRaisingTomorrow === true) {
      // Show already-played message
      emitActionResult({
        actionId: 'easterEgg',
        title: 'Already Played This Year',
        body: "You already did your tiny parenting‑sim reset this year. Your thumbs deserve a break.",
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['easterEgg'],
        meta: { emoji: '🎮' }
      });
      onClose();
      return;
    }
    
    // Mark as played
    updateState({
      yearFlags: {
        ...flags,
        playedRaisingTomorrow: true
      }
    });
    
    // Apply stress reduction
    applyStress(-1, "Play Raising Tomorrow");
    
    // Add timeline entry
    recordTimelineEntry({
      kind: "system",
      title: "🎮 Play Raising Tomorrow",
      detail: "You took a break and played Raising Tomorrow. Somehow… parenting felt a little clearer.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -1
    });
    
    // Pick random feedback text
    const feedbackText = EASTER_EGG_RAISINGSIM_LINES[Math.floor(Math.random() * EASTER_EGG_RAISINGSIM_LINES.length)];
    
    // Show popup
    setEasterEggText(feedbackText);
    setEasterEggModalOpen(true);
  };

  const canUse = !pendingScenario && !finished && actionPoints >= 1;
  
  const classes = [
    {
      emoji: '🥋',
      title: 'Martial Arts',
      subtitle: 'Choose your style. Belts progress with consistency.',
      cost: 0,
      onClick: () => setMartialArtsModalOpen(true),
      disabled: false
    },
    {
      emoji: '🎹',
      title: 'Music Lessons (Year)',
      subtitle: `$${formatMoney(getLocalAmount(ECONOMY_PRICES.musicLessonsYear))} • Focus 1 • DIS +2 • CON +2 • INT +1`,
      cost: getLocalAmount(ECONOMY_PRICES.musicLessonsYear),
      onClick: handleMusic,
      disabled: didMusicThisAge
    },
    {
      emoji: '🎤',
      title: 'Voice Lessons (Year)',
      subtitle: `$${formatMoney(getLocalAmount(ECONOMY_PRICES.voiceLessonsYear))} • Focus 1 • CON +3 • EMP +1 • DIS +1`,
      cost: getLocalAmount(ECONOMY_PRICES.voiceLessonsYear),
      onClick: handleVoice,
      disabled: didVoiceThisAge
    },
    {
      emoji: '🧘',
      title: 'Mindfulness Habit (Year)',
      subtitle: '$0 • Focus 1 • EMP +1 • CON +1 • Stress -2',
      cost: 0,
      onClick: handleMindfulness,
      disabled: didMindfulnessThisAge
    },
    {
      emoji: '🎮',
      title: 'Play Raising Tomorrow',
      subtitle: 'Free • 1x/year • Stress relief',
      cost: 0,
      onClick: handlePlayRaisingTomorrow,
      disabled: false,
      alwaysEnabled: true
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">Mind & Body</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                <div className="space-y-3">
                  {classes.map((classOption, idx) => (
                    <button
                      key={idx}
                      onClick={classOption.onClick}
                      disabled={classOption.alwaysEnabled ? false : (!canUse || classOption.disabled)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        classOption.alwaysEnabled 
                          ? 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 active:scale-[0.98]'
                          : (!canUse || classOption.disabled
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 active:scale-[0.98]')
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">{classOption.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">
                            {classOption.title}
                            {classOption.disabled && (
                              <span className="ml-2 text-xs text-slate-400">(Already done this year)</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed">
                            {classOption.subtitle}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
      
      <MartialArtsModal
        open={martialArtsModalOpen}
        onClose={() => setMartialArtsModalOpen(false)}
      />
      
      {/* Easter Egg Feedback Modal */}
      {easterEggModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={() => setEasterEggModalOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎮</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Tiny Break, Big Reset</h3>
                <p className="text-slate-600 leading-relaxed">{easterEggText}</p>
              </div>
              
              <div className="text-center text-sm text-emerald-600 font-medium mb-4">
                Stress −1
              </div>
              
              <button
                onClick={() => {
                  setEasterEggModalOpen(false);
                  onClose();
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
              >
                Back
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}