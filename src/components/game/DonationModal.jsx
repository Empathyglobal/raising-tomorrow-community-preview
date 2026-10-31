import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatSmallDelta, getActionBeneficiary } from '@/components/game/GameStateContext';
import { appendHumor } from './humorUtils';
import { toast } from 'sonner';

export default function DonationModal({ open, onClose }) {
  const { gameState, consumeAction, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry, updateState, emitActionResult, awardWisdomXP } = useGameState();
  const { pendingScenario, finished, actionPoints, currentYear } = gameState;
  
  const benef = getActionBeneficiary(gameState);

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

  const performDonationType = (donationType) => {
    const donation = gameState.donationProgress || { total: 0, byType: { blood: 0, plasma: 0 }, lastType: null, streak: 0, unlocks: { drive: false } };
    const typeKey = donationType === 'blood' ? 'blood' : 'plasma';
    const typeLabel = donationType === 'blood' ? 'Donate Blood' : 'Donate Plasma';
    const typeEmoji = donationType === 'blood' ? '🩸' : '💛';

    consumeAction('donation');

    const prevCount = Number(donation.byType[typeKey] || 0);
    const BASE = 0.1;
    const CAP = 0.6;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    let childDeltas = {};
    let loveDelta = 0;
    let stressDelta = 0;

    if (donationType === 'blood') {
      childDeltas = { empathy: 1 + roundedBonus };
      // Only apply Love if minor child exists (Love is child-parent bond)
      if (benef.isChild) loveDelta = 1;
    } else {
      childDeltas = { discipline: 1 + roundedBonus };
      stressDelta = -1;
    }

    if (loveDelta) applyLove(loveDelta, typeLabel);
    if (stressDelta) applyStress(stressDelta, typeLabel);
    applyDeltas(childDeltas, typeLabel);
    if (awardWisdomXP) {
      awardWisdomXP("compassion", 1, "Community: giving");
      awardWisdomXP("impermanence", 1, "Community: letting go");
    }

    const newTotal = donation.total + 1;
    const newBlood = donationType === 'blood' ? prevCount + 1 : donation.byType.blood;
    const newPlasma = donationType === 'plasma' ? prevCount + 1 : donation.byType.plasma;
    const newStreak = (donation.lastType === typeKey) ? donation.streak + 1 : 1;
    const newLastType = typeKey;

    const driveUnlocked = newTotal >= 5;

    updateState(prev => ({
      donationProgress: {
        total: newTotal,
        byType: { blood: newBlood, plasma: newPlasma },
        lastType: newLastType,
        streak: newStreak,
        unlocks: { drive: driveUnlocked }
      }
    }));

    // Streak trophies (at 5)
    if (newStreak === 5) {
      const trophyMap = { blood: 'donation_blood_streak_5', plasma: 'donation_plasma_streak_5' };
      const trophyNames = { blood: 'Blood Hero', plasma: 'Plasma Patron' };
      const trophyId = trophyMap[typeKey];
      const trophies = gameState.trophies || { unlocked: {} };
      if (trophyId && !trophies.unlocked[trophyId]) {
        updateState({
          trophies: {
            unlocked: {
              ...(trophies.unlocked || {}),
              [trophyId]: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: `5 ${typeLabel} sessions in a row`
              }
            }
          }
        });
        addLog(`🏆 Trophy unlocked: ${trophyNames[typeKey]}`);
        recordTimelineEntry({
          kind: 'system',
          title: `🏆 Trophy: ${trophyNames[typeKey]}`,
          detail: `Completed 5 ${typeLabel} sessions consecutively.`
        });
      }
    }

    // Total trophy (at 10)
    if (newTotal === 10) {
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked['donation_total_10']) {
        updateState({
          trophies: {
            unlocked: {
              ...(trophies.unlocked || {}),
              donation_total_10: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: '10 total donations'
              }
            }
          }
        });
        addLog('🏆 Trophy unlocked: Regular Donor');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Regular Donor',
          detail: 'Completed 10 total donations.'
        });
      }
    }

    addLog(`${typeEmoji} ${typeLabel} complete. Donation #${newTotal}.`);

    const masteryText = donationType === 'blood'
      ? `EMPATHY +${(1 + roundedBonus).toFixed(2)}`
      : `DISCIPLINE +${(1 + roundedBonus).toFixed(2)}`;

    const narrative = benef.isChild
      ? `You donate ${donationType}. ${benef.name} watches you choose discomfort for someone else.`
      : `You donate ${donationType}. It's uncomfortable, but you do it anyway.`;

    const loveLine = (donationType === 'blood' && benef.isChild) ? `Love +1\n` : '';
    const stressLine = (donationType !== 'blood') ? `Stress -1\n` : '';
    const subjectLine = `${benef.label}: ${masteryText}`;

    const bodyText = `${narrative}\n\n${loveLine}${stressLine}${subjectLine}\n\n${typeLabel} count: ${prevCount + 1}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['care', 'community'],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'care',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Donation #${newTotal}. ${typeLabel}.`,
      deltas: childDeltas,
      stressDelta,
      loveDelta,
      moneyDelta: 0,
      meta: { donationType, donationTotal: newTotal }
    });

    onClose();
  };

  const handleDrive = () => {
    const usedThisAge = gameState.yearFlags?.donationDriveUsedAtAge === gameState.currentYear;
    if (usedThisAge) {
      toast('Donation Drive already used this age.', { icon: '📣' });
      return;
    }

    consumeAction('donation');

    applyStress(-2);
    if (benef.isChild) applyLove(1);
    applyDeltas({ empathy: 2, social: 1 }, "Donation Drive");

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), donationDriveUsedAtAge: prev.currentYear }
    }));

    const narrative = benef.isChild
      ? `You organize a community donation drive. ${benef.name} helps set up, watches people show up, and learns what collective care looks like.`
      : `You organize a community donation drive. Neighbors show up, collective care happens.`;

    const loveLine = benef.isChild ? 'Love +1 • ' : '';

    addLog(`📣 Organized a Donation Drive. ${benef.isChild ? `${benef.name} sees community in action.` : 'Community in action.'}`);

    emitActionResult({
      title: "📣 Organize a Donation Drive",
      body: `${narrative}\n\nStress -2${benef.isChild ? ' • Love +1' : ''}\n${benef.label}: EMPATHY +2 • SOCIAL +1`,
      deltas: { empathy: 2, social: 1 },
      loveDelta: benef.isChild ? 1 : 0,
      stressDelta: -2,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['care', 'community', 'drive'],
      meta: { emoji: '📣' }
    });

    recordTimelineEntry({
      kind: 'care',
      title: '📣 Organized Donation Drive',
      detail: 'A community-wide effort. Your child learns collective care.',
      deltas: { empathy: 2, social: 1 },
      stressDelta: -2,
      loveDelta: 1,
      moneyDelta: 0
    });

    onClose();
  };

  const computeNextBonus = (typeKey) => {
    const donation = gameState.donationProgress || { total: 0, byType: { blood: 0, plasma: 0 }, lastType: null, streak: 0, unlocks: { drive: false } };
    const prevCount = Number(donation.byType[typeKey] || 0);
    const BASE = 0.1;
    const CAP = 0.6;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
  };

  const canUse = !pendingScenario && !finished && actionPoints >= 1;

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
                <h3 className="text-xl font-bold text-slate-800">Community</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {(() => {
                  const donation = gameState.donationProgress || { total: 0, byType: { blood: 0, plasma: 0 }, lastType: null, streak: 0, unlocks: { drive: false } };
                  const bloodBonus = computeNextBonus('blood');
                  const plasmaBonus = computeNextBonus('plasma');
                  const driveUsedThisAge = gameState.yearFlags?.donationDriveUsedAtAge === gameState.currentYear;

                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                        <div className="font-semibold text-slate-700">Progress</div>
                        <div className="text-slate-600">Blood: {donation.byType.blood} | Plasma: {donation.byType.plasma} | Total: {donation.total}</div>
                        {donation.streak > 0 && donation.lastType && (
                          <div className="text-red-600">
                            Current streak: {donation.streak}× {donation.lastType === 'blood' ? 'Blood 🩸' : 'Plasma 💛'} in a row
                          </div>
                        )}
                        {donation.unlocks.drive && (
                          <div className="text-amber-600 font-semibold">✅ Unlocked: Organize a Drive 📣</div>
                        )}
                      </div>

                      {/* Donate Blood */}
                      <button
                        onClick={() => performDonationType('blood')}
                        disabled={!canUse}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          !canUse
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">🩸</span>
                          <div className="flex-1">
                            <div className="font-bold text-slate-800 mb-1">Donate Blood</div>
                            <div className="text-xs text-slate-600 mb-2">
                              {benef.isChild ? 'LOVE +1 • ' : ''}{benef.short} EMP +{(1 + bloodBonus).toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Count: {donation.byType.blood} • Streak: {donation.lastType === 'blood' ? donation.streak : 0}/5
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Donate Plasma */}
                      <button
                        onClick={() => performDonationType('plasma')}
                        disabled={!canUse}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          !canUse
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">💛</span>
                          <div className="flex-1">
                            <div className="font-bold text-slate-800 mb-1">Donate Plasma</div>
                            <div className="text-xs text-slate-600 mb-2">
                              STRESS -1 • {benef.short} DIS +{(1 + plasmaBonus).toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Count: {donation.byType.plasma} • Streak: {donation.lastType === 'plasma' ? donation.streak : 0}/5
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Organize Drive (unlocked) */}
                      {donation.unlocks.drive && (
                        <button
                          onClick={handleDrive}
                          disabled={!canUse || driveUsedThisAge}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            driveUsedThisAge
                              ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                              : 'border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">📣</span>
                            <div className="flex-1">
                              <div className="font-bold text-slate-800 mb-1">Organize a Donation Drive (Unlocked)</div>
                              <div className="text-xs text-slate-600 mb-2">
                                STRESS -2{benef.isChild ? ' • LOVE +1' : ''} • Once per age
                              </div>
                              <div className="text-xs text-slate-600">
                                {benef.label}: EMPATHY +2 • SOCIAL +1
                              </div>
                              {driveUsedThisAge && (
                                <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                              )}
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}