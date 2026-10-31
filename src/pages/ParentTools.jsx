import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Smartphone, Zap, DollarSign, GraduationCap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import DatingAppModal from '@/components/game/DatingAppModal';

export default function ParentTools() {
  const navigate = useNavigate();
  const { gameState, updateState, addLog, applyLove, computePhoneActive, recordTimelineEntry } = useGameState();
  const { money, actionPoints, maxFocusTokens, phoneOwned, phoneGivenAge, currentYear, pendingScenario, householdType } = gameState;
  const [datingModalOpen, setDatingModalOpen] = React.useState(false);

  const handleGivePhone = () => {
    updateState({
      phoneOwned: true,
      phoneGivenAge: currentYear,
      phoneEffectsStartAge: currentYear + 1 // Effects start NEXT age
    });
    addLog("You hand down your old phone. They look thrilled. Effects start next age.");

    recordTimelineEntry({
      kind: "tool",
      title: "Gave Phone",
      detail: "Hand-me-down phone delivered. Effects start next age.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: null
    });
  };

  const handleTakeAwayPhone = () => {
    updateState({
      phoneOwned: false,
      phoneGivenAge: null,
      phoneEffectsStartAge: null, // Disable effects/content
      phoneActiveThisAge: false
    });
    addLog("You take the phone. They are furious. You become the villain of the week.");
    applyLove(-2, "Phone Removed");

    recordTimelineEntry({
      kind: "tool",
      title: "Took Phone Away",
      detail: "They are furious. You become the villain of the week.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: -2,
      stressDelta: 0,
      meta: null
    });
  };

  const phoneActive = computePhoneActive(currentYear, gameState);
  const phoneButtonsDisabled = pendingScenario;

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
            <h1 className="text-3xl font-bold text-slate-800">Parent Tools</h1>
            <Button
              onClick={() => navigate(createPageUrl('Game'))}
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
              <span>Money: ${money}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Focus: {actionPoints}/{maxFocusTokens}</span>
            </div>
          </div>
        </motion.div>

        {/* Phone Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
              {!phoneOwned ? (
                <>
                  <p className="text-sm text-slate-600 mb-2">
                    Give a hand-me-down phone.
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    Starts NEXT age. Each age active: +1 Focus, Stress -2, INT +1, EMP -1, DIS -1, CON -1.
                  </p>
                  <Button
                    onClick={handleGivePhone}
                    disabled={phoneButtonsDisabled}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Give Phone
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-600 mb-1">
                    Phone is owned.
                  </p>
                  {phoneActive && (
                    <p className="text-xs text-green-600 font-semibold mb-2">
                      Active this age.
                    </p>
                  )}
                  <Button
                    onClick={handleTakeAwayPhone}
                    disabled={phoneButtonsDisabled}
                    size="sm"
                    variant="destructive"
                  >
                    Take Away Phone
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tutoring Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Tutoring</h3>
              <p className="text-sm text-slate-600 mb-3">
                Boost specific stats with parent tutoring or paid help.
              </p>
              <Button
                onClick={() => navigate(createPageUrl('Tutoring'))}
                size="sm"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Open Tutoring
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Strategies Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Strategies</h3>
              <p className="text-sm text-slate-600 mb-3">
                Optional moments that deepen connection.
              </p>
              <Button
                onClick={() => navigate(createPageUrl('Strategies'))}
                disabled={pendingScenario}
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
              >
                Open Strategies
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dating App (Single Parent Only) */}
        {householdType === 'single' && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Dating App</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Swipe, match, date. Real connection takes time.
                </p>
                <Button
                  onClick={() => setDatingModalOpen(true)}
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Open Dating App
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <DatingAppModal
        open={datingModalOpen}
        onClose={() => setDatingModalOpen(false)}
      />
    </div>
  );
}