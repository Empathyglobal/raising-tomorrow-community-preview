import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, SUPPORT_OPTIONS, formatMoney, formatSmallDelta, getActionBeneficiary } from './GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';

export default function SupportNetworkModal({ open, onClose }) {
  const { gameState, applyDeltas, applyLove, applyStress, addLog, updateState, recordTimelineEntry, emitActionResult, applyMoneyDelta } = useGameState();
  const { money, finished } = gameState;
  const [subView, setSubView] = React.useState('main');
  
  const benef = getActionBeneficiary(gameState);

  // Block body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setSubView('main');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSelectOption = (option) => {
    // Special handling for Family Counseling
    if (option.id === 'therapy') {
      setSubView('therapy');
      return;
    }

    // Update money
    applyMoneyDelta(-option.cost, `Support: ${option.title}`, { category: "support" });

    // Apply deltas if present
    if (option.deltas) {
      const hasNonZero = Object.values(option.deltas).some(v => v !== 0);
      if (hasNonZero) {
        applyDeltas(option.deltas, `Support: ${option.title}`);
      }
    }

    // Apply love if present
    if (option.loveDelta !== 0) {
      applyLove(option.loveDelta, "Support");
    }

    // Apply stress if present
    if (option.stressDelta !== 0) {
      applyStress(option.stressDelta, "Support");
    }

    // Add log
    addLog(option.logLine);

    // Record timeline entry
    recordTimelineEntry({
      kind: "support",
      title: `Support: ${option.title}`,
      detail: option.subtitle,
      deltas: option.deltas,
      moneyDelta: -option.cost,
      loveDelta: option.loveDelta,
      stressDelta: option.stressDelta,
      meta: null
    });

    const popup = pickMissingActionPopup("support", option.id);
    if (popup) {
      emitActionResult({
        actionId: "support",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: option.deltas,
        moneyDelta: -option.cost,
        focusDelta: 0,
        loveDelta: option.loveDelta,
        stressDelta: option.stressDelta,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    // Close modal
    onClose();
  };

  const performTherapySession = (sessionType) => {
    const therapy = gameState.supportProgress?.therapy || { total: 0, byType: { coaching: 0, couples: 0, family: 0 }, lastType: null, streak: 0 };
    const typeKey = sessionType === 'coaching' ? 'coaching' : sessionType === 'couples' ? 'couples' : 'family';
    const typeLabel = sessionType === 'coaching' ? 'Parent Coaching' : sessionType === 'couples' ? 'Couples Session' : 'Family Session';
    const typeEmoji = sessionType === 'coaching' ? '🧠' : sessionType === 'couples' ? '💬' : '🧸';

    applyMoneyDelta(-250, `Therapy: ${typeLabel}`, { category: "support" });

    const prevCount = Number(therapy.byType[typeKey] || 0);
    const BASE = 0.1;
    const CAP = 0.6;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    let childDeltas = {};
    let loveDelta = 0;
    let stressDelta = 0;

    if (sessionType === 'coaching') {
      stressDelta = -3;
      childDeltas = { discipline: 0.6 + roundedBonus };
    } else if (sessionType === 'couples') {
      stressDelta = -2;
      loveDelta = 1 + Math.min(1, roundedBonus);
    } else {
      stressDelta = -3;
      childDeltas = { empathy: 0.8 + roundedBonus };
    }

    if (stressDelta) applyStress(stressDelta, typeLabel);
    if (loveDelta) applyLove(loveDelta, typeLabel);
    if (Object.keys(childDeltas).length > 0) applyDeltas(childDeltas, typeLabel);

    const newTotal = therapy.total + 1;
    const newCoaching = sessionType === 'coaching' ? prevCount + 1 : therapy.byType.coaching;
    const newCouples = sessionType === 'couples' ? prevCount + 1 : therapy.byType.couples;
    const newFamily = sessionType === 'family' ? prevCount + 1 : therapy.byType.family;
    const newStreak = (therapy.lastType === typeKey) ? therapy.streak + 1 : 1;
    const newLastType = typeKey;

    updateState(prev => ({
      supportProgress: {
        ...(prev.supportProgress || {}),
        therapy: {
          total: newTotal,
          byType: { coaching: newCoaching, couples: newCouples, family: newFamily },
          lastType: newLastType,
          streak: newStreak
        }
      }
    }));

    if (newStreak === 5) {
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked['therapy_streak_5']) {
        updateState({
          trophies: {
            unlocked: {
              ...(trophies.unlocked || {}),
              therapy_streak_5: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: `5 ${typeLabel} sessions in a row`
              }
            }
          }
        });
        addLog('🏆 Trophy unlocked: Therapy Regular');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Therapy Regular',
          detail: `Completed 5 ${typeLabel} sessions consecutively.`
        });
      }
    }

    addLog(`${typeEmoji} ${typeLabel} complete. Session #${newTotal}.`);

    const masteryText = sessionType === 'coaching'
      ? `DISCIPLINE +${(0.6 + roundedBonus).toFixed(2)}`
      : sessionType === 'couples'
        ? `LOVE +${loveDelta.toFixed(2)}`
        : `EMPATHY +${(0.8 + roundedBonus).toFixed(2)}`;

    const subjectLine = sessionType === 'couples' ? masteryText : `${benef.label}: ${masteryText}`;

    const bodyText = `You complete a ${typeLabel.toLowerCase()} session. Professional support when you need it.\n\nMoney: -$250\nStress ${stressDelta}\n${subjectLine}\n\n${typeLabel} count: ${prevCount + 1}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta,
      stressDelta,
      moneyDelta: -250,
      focusDelta: 0,
      tags: ['support', 'therapy'],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'support',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Therapy session #${newTotal}. ${typeLabel}.`,
      deltas: childDeltas,
      stressDelta,
      loveDelta,
      moneyDelta: -250,
      meta: { sessionType, therapyTotal: newTotal }
    });

    setSubView('main');
    onClose();
  };

  const computeNextTherapyBonus = (typeKey) => {
    const therapy = gameState.supportProgress?.therapy || { total: 0, byType: { coaching: 0, couples: 0, family: 0 }, lastType: null, streak: 0 };
    const prevCount = Number(therapy.byType[typeKey] || 0);
    const BASE = 0.1;
    const CAP = 0.6;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
  };

  if (subView === 'therapy') {
    const therapy = gameState.supportProgress?.therapy || { total: 0, byType: { coaching: 0, couples: 0, family: 0 }, lastType: null, streak: 0 };
    const coachingBonus = computeNextTherapyBonus('coaching');
    const couplesBonus = computeNextTherapyBonus('couples');
    const familyBonus = computeNextTherapyBonus('family');

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
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">🛋️ Family Counseling</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick your session type ($250 each)</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress</div>
                    <div className="text-slate-600">Coaching: {therapy.byType.coaching} | Couples: {therapy.byType.couples} | Family: {therapy.byType.family}</div>
                    {therapy.streak > 0 && therapy.lastType && (
                      <div className="text-indigo-600">
                        Current streak: {therapy.streak}× {therapy.lastType === 'coaching' ? 'Coaching 🧠' : therapy.lastType === 'couples' ? 'Couples 💬' : 'Family 🧸'} in a row
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => performTherapySession('coaching')}
                    disabled={finished}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🧠</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Parent Coaching</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -3 • {benef.short} DIS +{(0.6 + coachingBonus).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Count: {therapy.byType.coaching} • Streak: {therapy.lastType === 'coaching' ? therapy.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performTherapySession('couples')}
                    disabled={finished}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">💬</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Couples Session</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • LOVE +{(1 + Math.min(1, couplesBonus)).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Count: {therapy.byType.couples} • Streak: {therapy.lastType === 'couples' ? therapy.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performTherapySession('family')}
                    disabled={finished}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🧸</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Family Session</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -3 • {benef.short} EMP +{(0.8 + familyBonus).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Count: {therapy.byType.family} • Streak: {therapy.lastType === 'family' ? therapy.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSubView('main')}
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
                  >
                    Back
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

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
            <div className="rt-modal-surface w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🤝 Support Network</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Money: ${formatMoney(money)}</p>
                </div>
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
                  {SUPPORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      disabled={finished}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        finished
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">{option.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">{option.title}</div>
                          <div className="text-sm text-slate-600 leading-relaxed">{option.subtitle}</div>
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
    </AnimatePresence>
  );
}