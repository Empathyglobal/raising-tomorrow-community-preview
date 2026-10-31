import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from '../components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Users, Shield, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Strategies() {
  const navigate = useNavigate();
  const { gameState, applyLove, applyStress, applyDeltas, addLog, adjustedLoveGain, updateState, recordTimelineEntry } = useGameState();
  const { money, actionPoints, maxFocusTokens, pendingScenario, love, stress } = gameState;

  const consumeFocus = () => {
    updateState({ actionPoints: actionPoints - 1 });
  };

  const kid = gameState.childName || "your child";
  const currentAge = Number(gameState.currentYear ?? 0);
  const schoolPackEnabled = (gameState.enabledScenarioPackIds || []).includes('pack_school_confidence_v1');
  const showSchoolToolkit = schoolPackEnabled && currentAge >= 3;

  const handleReconnect = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(2);
    applyLove(loveGain, "Strategy");
    applyStress(-1, "Strategy");
    applyDeltas({ empathy: 1 }, "Strategy");
    addLog("You reconnect with intention. It's not magical—just real.");

    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Reconnect Conversation",
      detail: "You reconnect with intention. It's not magical—just real.",
      deltas: { empathy: 1 },
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -1
    });
  };

  const handleOneOnOne = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(2);
    applyLove(loveGain, "Strategy");
    applyStress(-1, "Strategy");
    applyDeltas({ confidence: 1 }, "Strategy");
    addLog("You spend time without multitasking. They soften.");

    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: One-on-One Time",
      detail: "You spend time without multitasking. They soften.",
      deltas: { confidence: 1 },
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -1
    });
  };

  const handleCalmLimit = () => {
    consumeFocus();
    applyLove(-1, "Strategy");
    applyStress(1, "Strategy");
    applyDeltas({ discipline: 1 }, "Strategy");
    addLog("You set a calm limit and hold it. They hate it. The future-you thanks you.");

    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Calm Limit",
      detail: "You set a calm limit and hold it. They hate it. The future-you thanks you.",
      deltas: { discipline: 1 },
      moneyDelta: 0,
      loveDelta: -1,
      stressDelta: 1
    });
  };

  const handleParentReset = () => {
    consumeFocus();
    applyStress(-2, "Strategy");
    addLog("You reset yourself before you try to manage them. It's a skill, not a vibe.");

    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Parent Reset",
      detail: "You reset yourself before you try to manage them. It's a skill, not a vibe.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -2
    });
  };

  // ----------------------------
  // School Calm Toolkit (Pack)
  // Each action: LOVE +1, STRESS -3, Focus 1
  // ----------------------------

  const handleDeepBreathingTogether = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Strategy");
    applyStress(-3, "Strategy");
    addLog(`🌬️ You and ${kid} do deep breathing together. The panic wave passes.`);
    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Deep Breathing Together",
      detail: `You co-regulate with slow breathing. ${kid} learns their body can settle.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -3
    });
  };

  const handleMeditateTogether = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Strategy");
    applyStress(-3, "Strategy");
    addLog(`🧘 You sit with ${kid} for a short meditation. Quiet becomes contagious.`);
    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Mini Meditation Together",
      detail: `You practice a tiny meditation together. It doesn't erase stress—it lowers the volume.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -3
    });
  };

  const handleGroundingGame = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Strategy");
    applyStress(-3, "Strategy");
    addLog(`🖐️ You play a grounding game with ${kid}: name what you see, hear, feel. Their body returns.`);
    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Grounding Game (5-4-3-2-1)",
      detail: "You anchor in the present moment. Anxiety loosens its grip.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -3
    });
  };

  const handleWorryDumpReframe = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Strategy");
    applyStress(-3, "Strategy");
    addLog(`📝 You help ${kid} do a quick 'worry dump' and reframe one thought. It feels lighter.`);
    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Worry Dump + Reframe",
      detail: "You get the worries out of their head and onto paper, then soften one story.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -3
    });
  };

  const handleGuidedCalmAudio = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Strategy");
    applyStress(-3, "Strategy");
    addLog(`🎧 You and ${kid} listen to a short guided calm audio. Their shoulders drop.`);
    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Guided Calm Audio",
      detail: "A tiny guided reset helps their nervous system settle.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -3
    });
  };

  const handleDecompressionWalk = () => {
    consumeFocus();
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Strategy");
    applyStress(-3, "Strategy");
    addLog(`🚶 You take a decompression walk with ${kid}. Movement turns the worry into something manageable.`);
    recordTimelineEntry({
      kind: "strategy",
      title: "Strategy: Decompression Walk",
      detail: "You walk and talk lightly—enough connection to regulate without pressure.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: -3
    });
  };

  const canUseStrategy = !pendingScenario && actionPoints >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(createPageUrl('Game'))}
            className="text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Strategies</h1>
        </motion.div>

        {/* Resources */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-slate-600">
            Money: <span className="font-semibold text-emerald-600">${money}</span> • 
            Focus: <span className="font-semibold text-amber-600">{actionPoints}/{maxFocusTokens}</span> • 
            ❤️ Love: <span className="font-semibold text-rose-600">{love}</span> • 
            😮‍💨 Stress: <span className="font-semibold text-orange-600">{stress}</span>
          </p>
        </motion.div>

        {/* Note */}
        <motion.div
          className="bg-amber-50/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-amber-800">
            Each strategy costs 1 Focus. Choose what you can carry this year.
          </p>
        </motion.div>

        {/* Strategy Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Reconnect Conversation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">🫶 Reconnect Conversation</h3>
                <p className="text-sm text-slate-600 mb-2">
                  EMP +1 • LOVE +2 • STRESS -1
                </p>
                <p className="text-xs text-slate-500 italic">
                  You reconnect with intention. It's not magical—just real.
                </p>
              </div>
            </div>
            <Button
              onClick={handleReconnect}
              disabled={!canUseStrategy}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
            >
              Use Strategy (1 Focus)
            </Button>
          </div>

          {/* One-on-One Time */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">🌿 One-on-One Time</h3>
                <p className="text-sm text-slate-600 mb-2">
                  CON +1 • LOVE +2 • STRESS -1
                </p>
                <p className="text-xs text-slate-500 italic">
                  You spend time without multitasking. They soften.
                </p>
              </div>
            </div>
            <Button
              onClick={handleOneOnOne}
              disabled={!canUseStrategy}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
            >
              Use Strategy (1 Focus)
            </Button>
          </div>

          {/* Calm Limit */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">🧱 Calm Limit</h3>
                <p className="text-sm text-slate-600 mb-2">
                  DIS +1 • LOVE -1 • STRESS +1
                </p>
                <p className="text-xs text-slate-500 italic">
                  You set a calm limit and hold it. They hate it. The future-you thanks you.
                </p>
              </div>
            </div>
            <Button
              onClick={handleCalmLimit}
              disabled={!canUseStrategy}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
            >
              Use Strategy (1 Focus)
            </Button>
          </div>

          {/* Parent Reset */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Waves className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">🫧 Parent Reset</h3>
                <p className="text-sm text-slate-600 mb-2">
                  STRESS -2
                </p>
                <p className="text-xs text-slate-500 italic">
                  You reset yourself before you try to manage them. It's a skill, not a vibe.
                </p>
              </div>
            </div>
            <Button
              onClick={handleParentReset}
              disabled={!canUseStrategy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Use Strategy (1 Focus)
            </Button>
          </div>

          {/* School Calm Toolkit Section */}
          {schoolPackEnabled && (
            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-700 mb-2">🎒 School Calm Toolkit</div>
              <div className="text-xs text-slate-500 mb-3">
                Unlocked by the School Confidence & Anxiety Pack. Co-regulation tools you do together.
              </div>

              {!showSchoolToolkit && (
                <div className="mb-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                  Unlocks at age 3.
                </div>
              )}
            </div>
          )}

          {showSchoolToolkit && (
            <>
              {/* Deep Breathing Together */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">🌬️ Deep Breathing Together</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      LOVE +1 • STRESS -3
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      Slow breathing turns panic into something you can carry.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDeepBreathingTogether}
                  disabled={!canUseStrategy}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
                >
                  Use Strategy (1 Focus)
                </Button>
              </div>

              {/* Mini Meditation Together */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">🧘 Mini Meditation Together</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      LOVE +1 • STRESS -3
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      Quiet practice trains the nervous system to settle.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleMeditateTogether}
                  disabled={!canUseStrategy}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  Use Strategy (1 Focus)
                </Button>
              </div>

              {/* Grounding Game */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">🖐️ Grounding Game (5-4-3-2-1)</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      LOVE +1 • STRESS -3
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      Bring attention back to the present: see, hear, feel.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleGroundingGame}
                  disabled={!canUseStrategy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  Use Strategy (1 Focus)
                </Button>
              </div>

              {/* Worry Dump + Reframe */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">📝 Worry Dump + Reframe</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      LOVE +1 • STRESS -3
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      Get the worries out of their head, then soften one story.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleWorryDumpReframe}
                  disabled={!canUseStrategy}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                >
                  Use Strategy (1 Focus)
                </Button>
              </div>

              {/* Guided Calm Audio */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">🎧 Guided Calm Audio</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      LOVE +1 • STRESS -3
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      A short guided reset helps their body settle fast.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleGuidedCalmAudio}
                  disabled={!canUseStrategy}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  Use Strategy (1 Focus)
                </Button>
              </div>

              {/* Decompression Walk */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">🚶 Decompression Walk</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      LOVE +1 • STRESS -3
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      Movement + low-pressure connection helps anxiety unwind.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDecompressionWalk}
                  disabled={!canUseStrategy}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white disabled:opacity-50"
                >
                  Use Strategy (1 Focus)
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}