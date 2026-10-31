import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { Button } from '@/components/ui/button';

export default function TutorModal({ open, onClose }) {
  const { gameState, updateState, addLog, recordTimelineEntry, emitActionResult, getLocalAmount } = useGameState();
  const { tutorActive, tutorType, money, currentYear, finished } = gameState;

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

  const tutorOptions = [
    {
      id: 'int',
      icon: '📚',
      title: 'Homework Help Tutor',
      subtitle: 'Supports academic work',
      stat: 'Intelligence',
      deltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 }
    },
    {
      id: 'emp',
      icon: '💛',
      title: 'Empathy Mentor',
      subtitle: 'Teaches emotional skills',
      stat: 'Empathy',
      deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 }
    },
    {
      id: 'dis',
      icon: '🧭',
      title: 'Study Habits Coach',
      subtitle: 'Builds organization',
      stat: 'Discipline',
      deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 }
    },
    {
      id: 'con',
      icon: '🗣️',
      title: 'Confidence Coach',
      subtitle: 'Encourages self-esteem',
      stat: 'Confidence',
      deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 }
    }
  ];

  const handleHire = (option) => {
    updateState({
      tutorActive: true,
      tutorType: option.id
    });

    const cost = getLocalAmount(1800);
    addLog(`📚 You hire a ${option.title} ($${formatMoney(cost)}/year while active).`);

    recordTimelineEntry({
      kind: "tutor",
      title: `Hired ${option.title}`,
      detail: `Annual support: +1 ${option.stat} per year. Cost: $${formatMoney(cost)}/year.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const hireSubId = `hire_${option.id}`;
    const popup = pickMissingActionPopup("tutor", hireSubId);
    
    const coachNotes = {
      int: "A neutral adult lowers the parent‑kid power struggle. Consistency turns “I can’t” into “I’m getting it.”",
      emp: "Feelings get named before they explode. Practicing scripts in calm moments makes empathy usable later.",
      dis: "Tiny systems beat willpower. Routines reduce daily fights and free up brain space.",
      con: "Small brave reps build a kinder inner voice. Confidence grows from tries, not hype."
    };

    if (popup) {
      emitActionResult({
        actionId: "tutor",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: option.deltas,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { 
          emoji: popup.emoji,
          coachNote: coachNotes[option.id]
        }
      });
    }

    onClose();
  };

  const handleCancel = () => {
    const tutorNames = {
      int: "Homework Help Tutor",
      emp: "Empathy Mentor",
      dis: "Study Habits Coach",
      con: "Confidence Coach"
    };
    const tutorName = tutorNames[tutorType] || "Tutor";

    updateState({
      tutorActive: false,
      tutorType: "none"
    });

    addLog(`📚 You cancel the ${tutorName}.`);

    recordTimelineEntry({
      kind: "tutor",
      title: `Cancelled ${tutorName}`,
      detail: "Tutor support ends.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("tutor", "cancel");
    if (popup) {
      emitActionResult({
        actionId: "tutor",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { 
          emoji: popup.emoji,
          coachNote: "Pausing support doesn’t erase progress—keep the best routines, drop what wasn’t working, reassess later."
        }
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[102]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[103] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">📚 Tutor</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    ${formatMoney(getLocalAmount(1800))}/year • +1 chosen stat per year
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Current Status */}
                {tutorActive && tutorType !== "none" && (
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-200">
                    <p className="text-sm text-emerald-800 font-medium mb-2">
                      Active: {tutorOptions.find(o => o.id === tutorType)?.title}
                    </p>
                    <p className="text-xs text-emerald-700">
                      Charged ${formatMoney(getLocalAmount(1800))} at the start of each age.
                    </p>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="mt-3 w-full text-xs"
                    >
                      Cancel Tutor
                    </Button>
                  </div>
                )}

                {/* Tutor Options */}
                {(!tutorActive || tutorType === "none") && (
                  <div className="space-y-2">
                    {tutorOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleHire(option)}
                        disabled={finished}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          finished
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{option.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 mb-0.5">{option.title}</div>
                            <div className="text-xs text-slate-600 mb-2">{option.subtitle}</div>
                            <div className="text-xs text-indigo-600 font-medium">
                              +1 {option.stat} per year
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}