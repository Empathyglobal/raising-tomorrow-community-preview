import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, ECONOMY_PRICES, formatMoney, toRealBool } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, DollarSign, BookOpen, Calendar, Mountain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Tutoring() {
  const navigate = useNavigate();
  const { gameState, updateState, applyDeltas, applyLove, applyStress, adjustedLoveGain, addLog, consumeAction, recordTimelineEntry, spendMoney } = useGameState();
  const { money, actionPoints, maxFocusTokens, tutoringDefaultTab, didPaidTutorThisAge } = gameState;
  
  const scenarioPending = toRealBool(gameState.pendingScenario ?? gameState.scenarioPending);
  const parentRef = React.useRef(null);
  const paidRef = React.useRef(null);

  React.useEffect(() => {
    if (tutoringDefaultTab === 'parent' && parentRef.current) {
      parentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateState({ tutoringDefaultTab: '' });
    } else if (tutoringDefaultTab === 'paid' && paidRef.current) {
      paidRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateState({ tutoringDefaultTab: '' });
    }
  }, [tutoringDefaultTab, updateState]);

  const handleParentTutor = (stat, label, emoji) => {
    if (!consumeAction('tutor')) return;
    
    applyDeltas({ [stat]: 1 }, "Parent Tutor");
    addLog(`You tutor them: ${label}. Slow progress, real progress.`);
    
    const loveGain = adjustedLoveGain(1);
    applyLove(loveGain, "Parent Tutoring");
    addLog(`❤️ Time together counts, even when it's homework. (LOVE +${loveGain})`);
    
    applyStress(1, "Parent Tutoring");
    addLog(`😮‍💨 Teaching takes energy. (STRESS +1)`);

    recordTimelineEntry({
      kind: "tutor",
      title: `Parent Tutoring: ${label}`,
      detail: "You sit with them and practice. Slow progress, real progress.",
      deltas: { [stat]: 1 },
      moneyDelta: 0,
      loveDelta: loveGain,
      stressDelta: 1,
      meta: null
    });
  };

  const handlePaidTutor = () => {
    spendMoney(ECONOMY_PRICES.paidTutorYear);
    applyDeltas({ intelligence: 3 }, "Tutor Plan (Year)");
    updateState({ didPaidTutorThisAge: true });
    addLog("👨‍🏫 Tutoring plan for the year. Homework becomes… less dramatic.");

    recordTimelineEntry({
      kind: "tutor",
      title: "Tutor Plan (Year)",
      detail: "A year of steady support. (No focus cost — money only.)",
      deltas: { intelligence: 3 },
      moneyDelta: -ECONOMY_PRICES.paidTutorYear,
      loveDelta: 0,
      stressDelta: 0,
      meta: null
    });
  };

  const parentDisabled = actionPoints < 1;
  const paidDisabled = didPaidTutorThisAge || money < ECONOMY_PRICES.paidTutorYear;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-slate-800">Tutoring</h1>
            <Button
              onClick={() => navigate(createPageUrl('ParentTools'))}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>Money: ${formatMoney(money)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Focus: {actionPoints}/{maxFocusTokens}</span>
            </div>
          </div>
        </motion.div>

        {/* Parent Tutoring Card */}
        <motion.div
          ref={parentRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-slate-800 mb-1">Parent Tutoring (costs 1 Focus)</h3>
          <p className="text-sm text-slate-600 mb-4">
            Unlimited as long as you have Focus.
          </p>
          {parentDisabled && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
              ⚡ Not enough Focus.
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleParentTutor('intelligence', 'Homework Help', '📚')}
              disabled={parentDisabled}
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-medium">Homework Help</span>
              <span className="text-xs opacity-80">(+1 INT)</span>
            </Button>

            <Button
              onClick={() => handleParentTutor('discipline', 'Study Habits', '🗓️')}
              disabled={parentDisabled}
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs font-medium">Study Habits</span>
              <span className="text-xs opacity-80">(+1 DIS)</span>
            </Button>

            <Button
              onClick={() => handleParentTutor('confidence', 'Confidence Coaching', '🧗')}
              disabled={parentDisabled}
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 bg-violet-500 hover:bg-violet-600 text-white"
            >
              <Mountain className="w-5 h-5" />
              <span className="text-xs font-medium">Confidence</span>
              <span className="text-xs opacity-80">(+1 CON)</span>
            </Button>

            <Button
              onClick={() => handleParentTutor('empathy', 'Empathy Talk', '🫶')}
              disabled={parentDisabled}
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3 bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs font-medium">Empathy Talk</span>
              <span className="text-xs opacity-80">(+1 EMP)</span>
            </Button>
          </div>
        </motion.div>

        {/* Paid Tutor Card */}
        <motion.div
          ref={paidRef}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-slate-800 mb-1">
            Hire a Tutor (Whole Year)
            {didPaidTutorThisAge && (
              <span className="ml-2 text-xs text-slate-400">(Already hired this year)</span>
            )}
          </h3>
          <p className="text-sm text-slate-600 mb-1">
            $1,800/year • INT +3 • Money-only
          </p>
          <p className="text-xs text-slate-500 mb-4">
            A year of steady academic support. No focus cost.
          </p>
          {paidDisabled && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
              {didPaidTutorThisAge ? '✅ Already hired this year.' : '💰 Not enough money.'}
            </div>
          )}
          <Button
            onClick={handlePaidTutor}
            disabled={paidDisabled}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Hire Tutor for the Year
          </Button>
        </motion.div>
      </div>
    </div>
  );
}