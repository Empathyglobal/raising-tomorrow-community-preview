import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Mic, Disc, Guitar, Radio } from 'lucide-react';
import { useGameState, formatMoney, toRealBool } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const STAGES = {
  unknown: { label: 'Unknown', emoji: '🎵', minFame: 0 },
  local: { label: 'Local', emoji: '🎤', minFame: 10 },
  regional: { label: 'Regional', emoji: '📻', minFame: 50 },
  national: { label: 'National', emoji: '🎸', minFame: 200 },
  global: { label: 'Global', emoji: '🌟', minFame: 500 }
};

export default function MusicModal({ open, onClose }) {
  const { gameState, updateState, spendFocus, applyMoneyDelta, applyStress, applyFameDelta, applyReputationDelta, emitActionResult, recordTimelineEntry, formatBaseToLocal, getFameTier } = useGameState();
  
  const scenarioPending = toRealBool(gameState.pendingScenario ?? gameState.scenarioPending);
  
  // Initialize music career state
  const musicCareer = gameState.musicCareer || {
    active: false,
    stage: 'unknown',
    fame: 0,
    fanbase: 0,
    catalog: { singles: 0, albums: 0 },
    lastActionAgeByKey: {},
    lastProcessedAge: null
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Initialize if needed
      if (!gameState.musicCareer) {
        updateState({ musicCareer: { ...musicCareer, active: true } });
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const currentAge = gameState.currentYear || 0;
  const canAct = gameState.actionPoints >= 1;

  // Determine stage based on fame
  const getCurrentStage = (fame) => {
    if (fame >= STAGES.global.minFame) return 'global';
    if (fame >= STAGES.national.minFame) return 'national';
    if (fame >= STAGES.regional.minFame) return 'regional';
    if (fame >= STAGES.local.minFame) return 'local';
    return 'unknown';
  };

  const currentStage = getCurrentStage(musicCareer.fame);
  const stageInfo = STAGES[currentStage];

  // Check if action was used this age
  const wasUsedThisAge = (actionKey) => {
    return musicCareer.lastActionAgeByKey?.[actionKey] === currentAge;
  };

  // Mark action as used this age
  const markActionUsed = (actionKey) => {
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        lastActionAgeByKey: {
          ...(prev.musicCareer?.lastActionAgeByKey || {}),
          [actionKey]: currentAge
        }
      }
    }));
  };

  // Actions
  const handleWriteSongs = () => {
    if (!spendFocus(1, 'Write Songs')) return;
    
    const gain = 3;
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        catalog: {
          ...prev.musicCareer.catalog,
          singles: (prev.musicCareer.catalog?.singles || 0) + gain
        }
      }
    }));

    emitActionResult({
      actionId: 'music',
      title: '🎸 Write Songs',
      body: `You write ${gain} new songs. Your catalog grows.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['music', 'creative'],
      meta: { emoji: '🎸' }
    });

    recordTimelineEntry({
      kind: 'music',
      title: 'Wrote Songs',
      detail: `Added ${gain} songs to your catalog.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
  };

  const handleStudioSession = () => {
    if (!spendFocus(1, 'Studio Session')) return;
    if (wasUsedThisAge('studio')) {
      toast('Already used this action this year.', { icon: '🎙️' });
      return;
    }

    markActionUsed('studio');
    applyStress(0.5, 'Studio Session');

    emitActionResult({
      actionId: 'music',
      title: '🎙️ Studio Session',
      body: 'You polish your tracks. Your next release will land better.',
      deltas: {},
      loveDelta: 0,
      stressDelta: 0.5,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['music', 'work'],
      meta: { emoji: '🎙️' }
    });

    recordTimelineEntry({
      kind: 'music',
      title: 'Studio Session',
      detail: 'Improved track quality.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0.5
    });
  };

  const handleBookGig = () => {
    if (!spendFocus(1, 'Book Gig')) return;
    if (wasUsedThisAge('gig')) {
      toast('Already played a gig this year.', { icon: '🎤' });
      return;
    }

    markActionUsed('gig');

    const baseGig = 200;
    const stageMultiplier = { unknown: 0.5, local: 1, regional: 1.5, national: 2.5, global: 4 }[currentStage] || 1;
    const money = Math.round(baseGig * stageMultiplier * (0.8 + Math.random() * 0.4));
    const fameGain = Math.max(1, Math.round(2 * stageMultiplier));
    const fanbaseGain = Math.max(5, Math.round(10 * stageMultiplier));

    applyMoneyDelta(money, 'Gig Payment');
    
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        fame: (prev.musicCareer?.fame || 0) + fameGain,
        fanbase: (prev.musicCareer?.fanbase || 0) + fanbaseGain
      }
    }));

    emitActionResult({
      actionId: 'music',
      title: '🎤 Played a Gig',
      body: `The crowd loved it.\n\nMoney: +$${formatBaseToLocal(money)}\nMusic Fame: +${fameGain}\nFanbase: +${fanbaseGain}`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: money,
      focusDelta: -1,
      tags: ['music', 'income'],
      meta: { emoji: '🎤' }
    });

    recordTimelineEntry({
      kind: 'music',
      title: 'Played a Gig',
      detail: `Earned $${formatBaseToLocal(money)}, gained ${fameGain} music fame.`,
      deltas: null,
      moneyDelta: money,
      loveDelta: 0,
      stressDelta: 0
    });
  };

  const handleReleaseSingle = () => {
    if (!spendFocus(1, 'Release Single')) return;
    if (wasUsedThisAge('single')) {
      toast('Already released a single this year.', { icon: '💿' });
      return;
    }
    if (musicCareer.catalog.singles < 1) {
      toast('You need to write songs first.', { icon: '🎸' });
      return;
    }

    markActionUsed('single');

    // Consume 1 song from catalog
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        catalog: {
          ...prev.musicCareer.catalog,
          singles: Math.max(0, (prev.musicCareer.catalog?.singles || 0) - 1)
        }
      }
    }));

    // Outcome: flop (30%), moderate (50%), hit (20%)
    const roll = Math.random();
    let outcome, fameGain, fanbaseGain, moneyGain;
    
    if (roll < 0.3) {
      outcome = 'flop';
      fameGain = Math.max(1, Math.round(2 * (1 + currentStage.length * 0.1)));
      fanbaseGain = Math.max(5, Math.round(20 * (1 + currentStage.length * 0.1)));
      moneyGain = 0;
    } else if (roll < 0.8) {
      outcome = 'moderate';
      fameGain = Math.max(3, Math.round(5 * (1 + currentStage.length * 0.2)));
      fanbaseGain = Math.max(20, Math.round(50 * (1 + currentStage.length * 0.2)));
      moneyGain = Math.round(300 * (1 + currentStage.length * 0.3));
    } else {
      outcome = 'hit';
      fameGain = Math.max(8, Math.round(15 * (1 + currentStage.length * 0.3)));
      fanbaseGain = Math.max(100, Math.round(200 * (1 + currentStage.length * 0.3)));
      moneyGain = Math.round(1000 * (1 + currentStage.length * 0.5));
    }

    if (moneyGain > 0) applyMoneyDelta(moneyGain, 'Single Sales');
    
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        fame: (prev.musicCareer?.fame || 0) + fameGain,
        fanbase: (prev.musicCareer?.fanbase || 0) + fanbaseGain
      }
    }));

    const outcomeLabels = {
      flop: '💿 Single Released (Flop)',
      moderate: '💿 Single Released (Moderate Success)',
      hit: '💿 Single Released (Hit!)'
    };

    emitActionResult({
      actionId: 'music',
      title: outcomeLabels[outcome],
      body: `Your single drops.\n\nOutcome: ${outcome}\n${moneyGain > 0 ? `Money: +$${formatBaseToLocal(moneyGain)}\n` : ''}Music Fame: +${fameGain}\nFanbase: +${fanbaseGain}`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: moneyGain,
      focusDelta: -1,
      tags: ['music', outcome === 'hit' ? 'success' : 'release'],
      meta: { emoji: '💿' }
    });

    recordTimelineEntry({
      kind: 'music',
      title: `Released Single (${outcome})`,
      detail: `Gained ${fameGain} music fame, ${fanbaseGain} fans${moneyGain > 0 ? `, $${formatBaseToLocal(moneyGain)}` : ''}.`,
      deltas: null,
      moneyDelta: moneyGain,
      loveDelta: 0,
      stressDelta: 0
    });
  };

  const handleReleaseAlbum = () => {
    if (gameState.actionPoints < 2) {
      toast('Not enough Focus (need 2).', { icon: '⚡' });
      return;
    }
    if (wasUsedThisAge('album')) {
      toast('Already released an album this year.', { icon: '📀' });
      return;
    }
    if (musicCareer.catalog.singles < 5) {
      toast('You need at least 5 songs to release an album.', { icon: '🎸' });
      return;
    }

    if (!spendFocus(2, 'Release Album')) return;
    markActionUsed('album');

    // Consume 5 songs
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        catalog: {
          ...prev.musicCareer.catalog,
          singles: Math.max(0, (prev.musicCareer.catalog?.singles || 0) - 5),
          albums: (prev.musicCareer.catalog?.albums || 0) + 1
        }
      }
    }));

    // Bigger swings: flop (25%), moderate (45%), hit (20%), breakout (10%)
    const roll = Math.random();
    let outcome, fameGain, fanbaseGain, moneyGain, stressGain;
    
    if (roll < 0.25) {
      outcome = 'flop';
      fameGain = Math.max(2, Math.round(5 * (1 + currentStage.length * 0.1)));
      fanbaseGain = Math.max(10, Math.round(50 * (1 + currentStage.length * 0.1)));
      moneyGain = -500; // Lost money on production
      stressGain = 2;
    } else if (roll < 0.70) {
      outcome = 'moderate';
      fameGain = Math.max(8, Math.round(15 * (1 + currentStage.length * 0.2)));
      fanbaseGain = Math.max(100, Math.round(200 * (1 + currentStage.length * 0.2)));
      moneyGain = Math.round(2000 * (1 + currentStage.length * 0.3));
      stressGain = 1;
    } else if (roll < 0.90) {
      outcome = 'hit';
      fameGain = Math.max(20, Math.round(40 * (1 + currentStage.length * 0.3)));
      fanbaseGain = Math.max(500, Math.round(1000 * (1 + currentStage.length * 0.3)));
      moneyGain = Math.round(8000 * (1 + currentStage.length * 0.5));
      stressGain = 1;
    } else {
      outcome = 'breakout';
      fameGain = Math.max(50, Math.round(100 * (1 + currentStage.length * 0.4)));
      fanbaseGain = Math.max(2000, Math.round(5000 * (1 + currentStage.length * 0.4)));
      moneyGain = Math.round(25000 * (1 + currentStage.length * 0.6));
      stressGain = 0.5;
      applyFameDelta(10, 'Album Breakout'); // Also boost global fame
    }

    applyMoneyDelta(moneyGain, outcome === 'flop' ? 'Album Loss' : 'Album Sales');
    applyStress(stressGain, 'Album Release');
    
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        fame: (prev.musicCareer?.fame || 0) + fameGain,
        fanbase: (prev.musicCareer?.fanbase || 0) + fanbaseGain
      }
    }));

    const outcomeLabels = {
      flop: '📀 Album Released (Flopped)',
      moderate: '📀 Album Released (Moderate Success)',
      hit: '📀 Album Released (Hit!)',
      breakout: '📀 Album Released (BREAKOUT HIT!)'
    };

    emitActionResult({
      actionId: 'music',
      title: outcomeLabels[outcome],
      body: `Your album drops.\n\nOutcome: ${outcome}\nMoney: ${moneyGain >= 0 ? '+' : ''}$${formatBaseToLocal(moneyGain)}\nMusic Fame: +${fameGain}\nFanbase: +${fanbaseGain}\nStress: +${stressGain}`,
      deltas: {},
      loveDelta: 0,
      stressDelta: stressGain,
      moneyDelta: moneyGain,
      focusDelta: -2,
      tags: ['music', outcome === 'breakout' ? 'legendary' : outcome === 'hit' ? 'success' : 'release'],
      meta: { emoji: '📀' }
    });

    recordTimelineEntry({
      kind: 'music',
      title: `Released Album (${outcome})`,
      detail: `Gained ${fameGain} music fame, ${fanbaseGain} fans, ${moneyGain >= 0 ? '+' : ''}$${formatBaseToLocal(moneyGain)}.`,
      deltas: null,
      moneyDelta: moneyGain,
      loveDelta: 0,
      stressDelta: stressGain
    });
  };

  const handleGoOnTour = () => {
    if (gameState.actionPoints < 2) {
      toast('Not enough Focus (need 2).', { icon: '⚡' });
      return;
    }
    if (wasUsedThisAge('tour')) {
      toast('Already toured this year.', { icon: '🚌' });
      return;
    }
    if (musicCareer.fanbase < 100) {
      toast('You need at least 100 fans to go on tour.', { icon: '🎸' });
      return;
    }

    if (!spendFocus(2, 'Go On Tour')) return;
    markActionUsed('tour');

    const stageMultiplier = { unknown: 0.5, local: 1, regional: 1.5, national: 2.5, global: 4 }[currentStage] || 1;
    const baseIncome = Math.round(musicCareer.fanbase * 5 * stageMultiplier);
    const money = Math.round(baseIncome * (0.8 + Math.random() * 0.4));
    const fameGain = Math.max(5, Math.round(10 * stageMultiplier));
    const fanbaseGain = Math.max(50, Math.round(100 * stageMultiplier));
    const stressGain = 3;

    applyMoneyDelta(money, 'Tour Revenue');
    applyStress(stressGain, 'Tour Exhaustion');
    
    updateState(prev => ({
      musicCareer: {
        ...prev.musicCareer,
        fame: (prev.musicCareer?.fame || 0) + fameGain,
        fanbase: (prev.musicCareer?.fanbase || 0) + fanbaseGain
      }
    }));

    emitActionResult({
      actionId: 'music',
      title: '🚌 Went On Tour',
      body: `The road takes its toll, but the crowd was electric.\n\nMoney: +$${formatBaseToLocal(money)}\nMusic Fame: +${fameGain}\nFanbase: +${fanbaseGain}\nStress: +${stressGain}`,
      deltas: {},
      loveDelta: 0,
      stressDelta: stressGain,
      moneyDelta: money,
      focusDelta: -2,
      tags: ['music', 'income', 'tour'],
      meta: { emoji: '🚌' }
    });

    recordTimelineEntry({
      kind: 'music',
      title: 'Went On Tour',
      detail: `Earned $${formatBaseToLocal(money)}, gained ${fameGain} music fame, ${fanbaseGain} fans.`,
      deltas: null,
      moneyDelta: money,
      loveDelta: 0,
      stressDelta: stressGain
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🎵 Music Career</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Build your catalog, perform, and grow your fanbase.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Stats Header */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{stageInfo.emoji}</span>
                    <div>
                      <div className="font-bold text-slate-800">{stageInfo.label} Artist</div>
                      <div className="text-xs text-slate-500">Music Career Stage</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <div className="font-bold text-purple-900">{musicCareer.fame}</div>
                      <div className="text-xs text-slate-500">Music Fame</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <div className="font-bold text-purple-900">{musicCareer.fanbase.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Fans</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 text-center">
                      <div className="font-bold text-purple-900">{musicCareer.catalog.singles}</div>
                      <div className="text-xs text-slate-500">Songs</div>
                    </div>
                  </div>

                  {musicCareer.catalog.albums > 0 && (
                    <div className="mt-2 text-xs text-purple-700 text-center">
                      🎵 Albums Released: {musicCareer.catalog.albums}
                    </div>
                  )}
                </div>

                {!canAct && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                    ⚡ Not enough Focus.
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  {/* Write Songs */}
                  <button
                    onClick={handleWriteSongs}
                    disabled={!canAct}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      !canAct
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl"><Guitar className="w-8 h-8 text-purple-600" /></span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Write Songs</div>
                        <div className="text-xs text-slate-600 mb-2">
                          Add 3 songs to your catalog. No cooldown.
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Cost: 1 Focus
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Studio Session */}
                  <button
                    onClick={handleStudioSession}
                    disabled={!canAct || wasUsedThisAge('studio')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      (!canAct || wasUsedThisAge('studio'))
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl"><Mic className="w-8 h-8 text-purple-600" /></span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Studio Session</div>
                        <div className="text-xs text-slate-600 mb-2">
                          Polish your tracks. Boosts next release. (Once per year)
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Cost: 1 Focus • Stress: +0.5
                        </div>
                        {wasUsedThisAge('studio') && (
                          <div className="text-xs text-amber-700 mt-1">✅ Already used this year</div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Book Gig */}
                  <button
                    onClick={handleBookGig}
                    disabled={!canAct || wasUsedThisAge('gig')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      (!canAct || wasUsedThisAge('gig'))
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🎤</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Book Gig</div>
                        <div className="text-xs text-slate-600 mb-2">
                          Perform live. Earn money, fame, and fans. (Once per year)
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Cost: 1 Focus
                        </div>
                        {wasUsedThisAge('gig') && (
                          <div className="text-xs text-amber-700 mt-1">✅ Already played this year</div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Release Single */}
                  <button
                    onClick={handleReleaseSingle}
                    disabled={!canAct || wasUsedThisAge('single') || musicCareer.catalog.singles < 1}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      (!canAct || wasUsedThisAge('single') || musicCareer.catalog.singles < 1)
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl"><Disc className="w-8 h-8 text-purple-600" /></span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Release Single</div>
                        <div className="text-xs text-slate-600 mb-2">
                          Drop a single. Risk/reward outcome. (Once per year, requires 1 song)
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Cost: 1 Focus • Uses: 1 song
                        </div>
                        {wasUsedThisAge('single') && (
                          <div className="text-xs text-amber-700 mt-1">✅ Already released this year</div>
                        )}
                        {musicCareer.catalog.singles < 1 && (
                          <div className="text-xs text-rose-600 mt-1">Need to write songs first</div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Release Album */}
                  <button
                    onClick={handleReleaseAlbum}
                    disabled={!canAct || wasUsedThisAge('album') || musicCareer.catalog.singles < 5 || gameState.actionPoints < 2}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      (!canAct || wasUsedThisAge('album') || musicCareer.catalog.singles < 5 || gameState.actionPoints < 2)
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📀</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Release Album</div>
                        <div className="text-xs text-slate-600 mb-2">
                          Big release. Bigger swings. (Once per year, requires 5 songs)
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Cost: 2 Focus • Uses: 5 songs
                        </div>
                        {wasUsedThisAge('album') && (
                          <div className="text-xs text-amber-700 mt-1">✅ Already released this year</div>
                        )}
                        {musicCareer.catalog.singles < 5 && (
                          <div className="text-xs text-rose-600 mt-1">Need at least 5 songs</div>
                        )}
                        {gameState.actionPoints < 2 && (
                          <div className="text-xs text-rose-600 mt-1">Need 2 Focus</div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Go On Tour */}
                  <button
                    onClick={handleGoOnTour}
                    disabled={!canAct || wasUsedThisAge('tour') || musicCareer.fanbase < 100 || gameState.actionPoints < 2}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      (!canAct || wasUsedThisAge('tour') || musicCareer.fanbase < 100 || gameState.actionPoints < 2)
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🚌</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Go On Tour</div>
                        <div className="text-xs text-slate-600 mb-2">
                          Hit the road. Big money, big stress. (Once per year, requires 100 fans)
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Cost: 2 Focus • Stress: +3
                        </div>
                        {wasUsedThisAge('tour') && (
                          <div className="text-xs text-amber-700 mt-1">✅ Already toured this year</div>
                        )}
                        {musicCareer.fanbase < 100 && (
                          <div className="text-xs text-rose-600 mt-1">Need at least 100 fans</div>
                        )}
                        {gameState.actionPoints < 2 && (
                          <div className="text-xs text-rose-600 mt-1">Need 2 Focus</div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                  💡 Your music career is independent of your regular job. Build your catalog, release tracks, and grow your fanbase over time.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}