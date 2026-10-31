import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, combineDeltas } from './GameStateContext';
import SupportNetworkModal from './SupportNetworkModal';
import RoutinePickerModal from './RoutinePickerModal';

export default function ToolsMenuModal({ open, onClose, onOpenTimeline }) {
  const navigate = useNavigate();
  const { gameState, addLog, applyDeltas, applyLove, applyStress, useAction, updateState, applyTechniqueBonusesForAction, recordTimelineEntry } = useGameState();
  const { money, actionPoints, maxFocusTokens, pendingScenario, finished, baliActive, baliStartAge, baliYearsPaid, currentYear } = gameState;
  const [supportModalOpen, setSupportModalOpen] = React.useState(false);
  const [routinePickerOpen, setRoutinePickerOpen] = React.useState(false);

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

  const handleRoutine = () => {
    setRoutinePickerOpen(true);
  };

  const handleHireTutor = () => {
    updateState({ tutoringDefaultTab: 'paid' });
    navigate(createPageUrl('Tutoring'));
    onClose();
  };

  const handleParentTutoring = () => {
    updateState({ tutoringDefaultTab: 'parent' });
    navigate(createPageUrl('Tutoring'));
    onClose();
  };

  const handleNavigate = (pageName) => {
    navigate(createPageUrl(pageName));
    onClose();
  };

  const handleMoveToBali = () => {
    updateState({ 
      baliActive: true, 
      baliStartAge: currentYear 
    });
    addLog("🏝️ You move to Bali for Empathy School. The perks start next age. ($500/age)");

    recordTimelineEntry({
      kind: "tool",
      title: "Moved to Bali",
      detail: "Enrolled in Empathy School. Yearly cost: $500. Bonuses begin next age.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    onClose();
  };

  const handleLeaveBali = () => {
    updateState({ baliActive: false });
    addLog("🌧️ You leave Bali. They're furious you took paradise away.");
    applyLove(-2, "Left Bali");

    recordTimelineEntry({
      kind: "tool",
      title: "Left Bali",
      detail: "You leave Bali. They wanted to stay.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: -2,
      stressDelta: 0
    });

    onClose();
  };

  const quickActions = [
    {
      icon: '🕒',
      title: 'Set a Routine',
      subtitle: 'Structure for the year.',
      disabled: pendingScenario || finished || actionPoints < 1,
      onClick: handleRoutine
    },
    {
      icon: '🧠',
      title: 'Hire a Tutor',
      subtitle: 'Pay $350 • choose what they work on.',
      disabled: pendingScenario || finished,
      onClick: handleHireTutor
    },
    {
      icon: '👨‍🏫',
      title: 'Parent Tutoring',
      subtitle: 'Spend time instead of money.',
      disabled: pendingScenario || finished || actionPoints < 1,
      onClick: handleParentTutoring
    },
    {
      icon: '🌿',
      title: 'Strategies',
      subtitle: 'Intentional moves that cost Focus.',
      disabled: pendingScenario || finished,
      onClick: () => handleNavigate('Strategies')
    },
    {
      icon: '🏝️',
      title: baliActive ? 'Living in Bali (Empathy School)' : 'Move to Bali (Empathy School)',
      subtitle: baliActive 
        ? `Active. $500/age at age start. Years paid: ${baliYearsPaid}.`
        : 'Costs $500 each age while active. Each age: INT +1, EMP +1, CON +1.',
      buttonText: baliActive ? 'Leave Bali' : 'Move to Bali',
      disabled: finished,
      onClick: baliActive ? handleLeaveBali : handleMoveToBali
    }
  ];

  const toolsUnlocked = Object.values(gameState.techniquesUnlocked || {}).filter(v => v === true).length;

  const learnReview = [
    {
      icon: '🤝',
      title: 'Support Network',
      subtitle: 'Get help when you can.',
      disabled: finished,
      onClick: () => {
        onClose();
        setSupportModalOpen(true);
      }
    },
    {
      icon: '🗂️',
      title: 'Collections',
      subtitle: `Books ${gameState.bookshelf.length} • Stamps ${gameState.passportStamps.length} • Games ${gameState.gameShelf.length}`,
      disabled: finished,
      onClick: () => handleNavigate('Collections')
    },
    {
      icon: '🧠',
      title: 'Toolbox',
      subtitle: `Tools ${toolsUnlocked}`,
      disabled: finished,
      onClick: () => handleNavigate('Toolbox')
    },
    {
      icon: '📘',
      title: 'Study Hub',
      subtitle: 'Unlock better options.',
      disabled: finished,
      onClick: () => handleNavigate('StudyHub')
    },
    {
      icon: '🕰️',
      title: 'Study History',
      subtitle: 'What you studied and when.',
      disabled: finished,
      onClick: () => handleNavigate('StudyHistory')
    },
    {
      icon: '📓',
      title: 'Just What Happened',
      subtitle: 'Year-by-year timeline.',
      disabled: finished,
      onClick: onOpenTimeline
    },
    {
      icon: '📊',
      title: 'Development Details',
      subtitle: 'Full stats, tiers, PB.',
      disabled: finished,
      onClick: () => handleNavigate('DevelopmentDetails')
    },
    {
      icon: '📵',
      title: 'Phone',
      subtitle: 'Give or take away the phone.',
      disabled: finished,
      onClick: () => handleNavigate('ParentTools')
    },
    {
      icon: '🏆',
      title: 'Trophy Case',
      subtitle: 'Your unlocked achievements.',
      disabled: finished,
      onClick: () => handleNavigate('TrophyCase')
    },
    {
      icon: 'ℹ️',
      title: 'About',
      subtitle: 'Who made this.',
      disabled: finished,
      onClick: () => handleNavigate('About')
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
            <div className="rt-modal-surface w-full max-w-lg rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh] bg-white">
              {/* Header */}
              <div className="flex-shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Tools</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Money: ${money} • Focus: {actionPoints}/{maxFocusTokens}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Section 1: Quick Actions */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          action.disabled
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{action.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 mb-0.5">{action.title}</div>
                            <div className="text-xs text-slate-600 mb-2">{action.subtitle}</div>
                            {action.buttonText && (
                              <div className="text-xs font-medium text-amber-600">
                                → {action.buttonText}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Learn & Review */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Learn & Review
                  </h4>
                  <div className="space-y-2">
                    {learnReview.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          action.disabled
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{action.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 mb-0.5">{action.title}</div>
                            <div className="text-xs text-slate-600">{action.subtitle}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                    </div>
                    </div>
                    </div>
                    </div>
                    </motion.div>

                    <SupportNetworkModal
                    open={supportModalOpen}
                    onClose={() => setSupportModalOpen(false)}
                    />

                    <RoutinePickerModal
                    open={routinePickerOpen}
                    onClose={() => {
                      setRoutinePickerOpen(false);
                      onClose();
                    }}
                    />
                    </>
                    )}
                    </AnimatePresence>
                    );
                    }