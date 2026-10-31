import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatDeltas } from '@/components/game/GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { Button } from '@/components/ui/button';

const HOMESCHOOL_SUPPORT_ACTIONS = [
  {
    id: "academic_block",
    emoji: "📚",
    label: "Academic Block",
    subtitle: "You built real learning time.",
    deltas: { intelligence: 1, discipline: 0, empathy: 0, confidence: 0 },
    timelineTitle: "📚 Homeschool: Academics",
    timelineDetail: "You built real learning time.",
    coachNote: "Short, consistent practice wires learning better than marathon days. Repetition is the magic."
  },
  {
    id: "structure_habits",
    emoji: "🧱",
    label: "Structure & Habits",
    subtitle: "Routines did their quiet magic.",
    deltas: { intelligence: 0, discipline: 1, empathy: 0, confidence: 0 },
    timelineTitle: "🧱 Homeschool: Structure",
    timelineDetail: "Routines did their quiet magic.",
    coachNote: "Routines turn arguments into autopilot. Predictability is a kindness (for both of you)."
  },
  {
    id: "social_emotional",
    emoji: "💛",
    label: "Social‑Emotional Skills",
    subtitle: "Feelings got named, not punished.",
    deltas: { intelligence: 0, discipline: 0, empathy: 1, confidence: 0 },
    timelineTitle: "💛 Homeschool: Empathy",
    timelineDetail: "Feelings got named, not punished.",
    coachNote: "When feelings get named, they shrink. You’re teaching regulation, not obedience."
  },
  {
    id: "confidence_coaching",
    emoji: "🌟",
    label: "Confidence Coaching",
    subtitle: "Brave got practiced in small steps.",
    deltas: { intelligence: 0, discipline: 0, empathy: 0, confidence: 1 },
    timelineTitle: "🌟 Homeschool: Confidence",
    timelineDetail: "Brave got practiced in small steps.",
    coachNote: "Brave gets built in small reps. Safe encouragement turns “maybe” into “I’ll try.”"
  }
];

export default function HomeschoolSupportModal({ open, onClose }) {
  const { gameState, applyDeltas, spendFocus, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const { actionPoints, finished } = gameState;

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

  const handleSupportAction = (action) => {
    if (actionPoints < 1) {
      addLog("⏳ Not enough focus for homeschool support.");
      return;
    }

    const success = spendFocus(1, action.label);
    if (!success) return;

    applyDeltas(action.deltas, action.label);
    addLog(`${action.emoji} ${action.subtitle}`);

    recordTimelineEntry({
      kind: "system",
      title: action.timelineTitle,
      detail: action.timelineDetail,
      deltas: action.deltas,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("homeschoolSupport", action.id);
    if (popup) {
      emitActionResult({
        actionId: "homeschoolSupport",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: action.deltas,
        moneyDelta: 0,
        focusDelta: -1,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { 
          emoji: popup.emoji,
          coachNote: action.coachNote 
        }
      });
    }
  };

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
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🏠 Homeschool Support</h3>
                  <p className="text-sm text-slate-500">Each costs 1 Focus • Builds one stat</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Focus Reminder */}
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-sm text-amber-800">
                    Focus remaining: <span className="font-bold">{actionPoints}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {HOMESCHOOL_SUPPORT_ACTIONS.map((action) => {
                    const canUse = actionPoints >= 1 && !finished;
                    
                    return (
                      <div
                        key={action.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          !canUse
                            ? 'border-slate-100 bg-slate-50 opacity-50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <span className="text-2xl">{action.emoji}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-800">{action.label}</div>
                            <div className="text-sm text-slate-600">{action.subtitle}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {formatDeltas(action.deltas)}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSupportAction(action)}
                          disabled={!canUse}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          Use (1 Focus)
                        </Button>
                        {!canUse && actionPoints < 1 && (
                          <div className="text-xs text-slate-400 mt-2 text-center">
                            Need 1 Focus
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}