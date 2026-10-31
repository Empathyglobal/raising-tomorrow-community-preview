import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { PTA_NPCS } from '@/components/game/pta/ptaData.jsx';
import { useGameState, combineDeltas, formatSmallDelta } from './GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { safeCall } from '@/components/utils/safeCall';
import { Button } from '@/components/ui/button';
import GameModalShell from './GameModalShell';

export default function ParentStrategiesModal({ open, onClose = () => {} }) {
  const { gameState, spendFocus, applyDeltas, applyLove, applyStress, applyPlayerHealth, addLog, updateState, recordTimelineEntry, emitActionResult, applyTechniqueBonusesForAction, getAvailability, awardWisdomXP, applyMoneyDelta } = useGameState();
  const { actionPoints, maxFocusTokens, pendingScenario, finished } = gameState;
  const [subView, setSubView] = React.useState('main');

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

  const handleReset = () => {
    // Check if stress is already very low
    if (gameState.stress <= 2) {
      const success = spendFocus(1, "Parent Reset");
      if (!success) return;

      applyStress(-1, "Parent Reset");
      addLog("🧘 You reset anyway. Nothing dramatic changes, but you feel steadier.");
      
      recordTimelineEntry({
        kind: "strategy",
        title: "🧘 Strategy: Reset",
        detail: "You reset even though stress is low. Calm becomes your baseline.",
        deltas: null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: -1
      });

      safeCall(onClose);
      return;
    }

    if (!spendFocus(1, "Parent Reset")) return;

    updateState({ regulatedThisAge: true });
    applyStress(-4, "Reset");
    addLog("🧘 You reset. Not perfect — just steadier.");

    recordTimelineEntry({
      kind: "strategy",
      title: "🧘 Strategy: Reset",
      detail: "You regulate yourself before responding.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -4
    });

    const popup = pickMissingActionPopup("parentStrategies", "reset");
    if (popup) {
      emitActionResult({
        actionId: "parentStrategies",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: -1,
        loveDelta: 0,
        stressDelta: -4,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    safeCall(onClose);
  };

  const performMiniBreakType = (breakType) => {
    const miniBreak = gameState.parentStrategyProgress?.miniBreak || { total: 0, byType: { walk: 0, breath: 0, call: 0 }, lastType: null, streak: 0, unlocks: { microRetreat: false } };
    const typeKey = breakType === 'walk' ? 'walk' : breakType === 'breath' ? 'breath' : 'call';
    const typeLabel = breakType === 'walk' ? 'Walk Outside' : breakType === 'breath' ? 'Breathwork' : 'Call a Friend';
    const typeEmoji = breakType === 'walk' ? '🚶' : breakType === 'breath' ? '🫁' : '☎️';
    const childStatKey = breakType === 'walk' ? 'confidence' : breakType === 'breath' ? 'empathy' : 'social';
    const childStatLabel = breakType === 'walk' ? 'CONFIDENCE' : breakType === 'breath' ? 'EMPATHY' : 'SOCIAL';

    if (!spendFocus(1, `Mini Break: ${typeLabel}`)) return;

    const prevCount = Number(miniBreak.byType[typeKey] || 0);
    const BASE = 0.05;
    const CAP = 0.4;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    const stressHigh = gameState.stress > 2;
    const stressDelta = breakType === 'breath' ? (stressHigh ? -3 : 0) : (stressHigh ? -2 : 0);
    const loveDelta = breakType === 'breath' ? 0 : (stressHigh ? 1 : 0);

    const childDeltas = { [childStatKey]: roundedBonus };
    
    // Breathwork also reduces anxiety
    if (breakType === 'breath') {
      const anxReduction = -Math.min(0.4, roundedBonus);
      childDeltas.anxiety = anxReduction;
    }

    if (stressDelta !== 0) applyStress(stressDelta);
    if (loveDelta !== 0) applyLove(loveDelta);
    applyDeltas(childDeltas, `Mini Break: ${typeLabel}`);

    const newTotal = miniBreak.total + 1;
    const newWalk = breakType === 'walk' ? prevCount + 1 : miniBreak.byType.walk;
    const newBreath = breakType === 'breath' ? prevCount + 1 : miniBreak.byType.breath;
    const newCall = breakType === 'call' ? prevCount + 1 : miniBreak.byType.call;
    const newStreak = (miniBreak.lastType === typeKey) ? miniBreak.streak + 1 : 1;
    const newLastType = typeKey;

    const microRetreatUnlocked = newBreath >= 5;

    updateState(prev => ({
      parentStrategyProgress: {
        ...(prev.parentStrategyProgress || {}),
        miniBreak: {
          total: newTotal,
          byType: { walk: newWalk, breath: newBreath, call: newCall },
          lastType: newLastType,
          streak: newStreak,
          unlocks: { microRetreat: microRetreatUnlocked }
        }
      }
    }));

    if (newStreak === 5 && breakType === 'breath') {
      const trophyId = 'minibreak_breath_streak_5';
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked[trophyId]) {
        updateState({
          trophies: {
            unlocked: {
              ...(trophies.unlocked || {}),
              [trophyId]: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: '5 Breathwork sessions in a row'
              }
            }
          }
        });
        addLog('🏆 Trophy unlocked: Calm Operator');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Calm Operator',
          detail: 'Completed 5 Breathwork sessions consecutively.'
        });
      }
    }

    addLog(`${typeEmoji} ${typeLabel} complete. ${childStatLabel} +${roundedBonus.toFixed(2)}`);

    const statusText = stressHigh ? '' : '\n(Prevention — stress already low)';
    const bodyText = `You take a ${typeLabel.toLowerCase()}. ${stressHigh ? 'A tiny pause shifts the whole vibe.' : 'Prevention counts.'}\n\n${stressHigh ? `Stress ${stressDelta} • Love ${loveDelta > 0 ? `+${loveDelta}` : '0'}` : 'No stress/love change (already calm)'}${statusText}\nChild: ${childStatLabel} ${formatSmallDelta(roundedBonus)}${breakType === 'breath' && childDeltas.anxiety ? ` • ANXIETY ${formatSmallDelta(childDeltas.anxiety)}` : ''}\n\n${typeLabel} count: ${prevCount + 1}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "miniBreak"],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Mini break #${newTotal}. ${stressHigh ? 'Stress reset.' : 'Prevention counts.'}`,
      deltas: childDeltas,
      stressDelta,
      loveDelta,
      moneyDelta: 0,
      meta: { breakType, breakTotal: newTotal }
    });

    setSubView('main');
    onClose();
  };

  const handleMicroRetreat = () => {
    const usedThisAge = gameState.yearFlags?.miniRetreatUsedAtAge === gameState.currentYear;
    if (usedThisAge) {
      toast('Micro Retreat already used this age.', { icon: '🧘' });
      return;
    }

    if (!spendFocus(1, "Micro Retreat")) return;

    applyStress(-6);
    applyLove(1);
    applyDeltas({ empathy: 0.6, confidence: 0.6, anxiety: -0.6 }, "Micro Retreat");

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), miniRetreatUsedAtAge: prev.currentYear }
    }));

    addLog("🧘 Micro Retreat. Deep reset. You and your child both regulate.");

    emitActionResult({
      title: "🧘 Micro Retreat (Guided Reset)",
      body: "You step fully away and do a guided reset practice. 10 minutes of intentional breathing and body awareness.\n\nStress -6 • Love +1\nChild: EMPATHY +0.6 • CONFIDENCE +0.6 • ANXIETY -0.6",
      deltas: { empathy: 0.6, confidence: 0.6, anxiety: -0.6 },
      loveDelta: 1,
      stressDelta: -6,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "miniBreak", "retreat"],
      meta: { emoji: "🧘" }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: '🧘 Micro Retreat',
      detail: 'A guided reset practice. Deep regulation for both of you.',
      deltas: { empathy: 0.6, confidence: 0.6, anxiety: -0.6 },
      stressDelta: -6,
      loveDelta: 1,
      moneyDelta: 0
    });

    setSubView('main');
    onClose();
  };

  const handleReflect = () => {
    // Allow even if love is high
    if (gameState.love >= 10) {
      const success = spendFocus(1, "Reflect");
      if (!success) return;
      if (awardWisdomXP) awardWisdomXP("mindfulness", 1, "Health Strategies: reflect");

      addLog("📓 You reflect anyway. Nothing dramatic changes, but you feel steadier.");
      
      recordTimelineEntry({
        kind: "strategy",
        title: "📓 Strategy: Reflect",
        detail: "You reflect even when things are good. Prevention counts.",
        deltas: null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 0
      });

      safeCall(onClose);
      return;
    }

    if (!spendFocus(1, "Reflect")) return;
    if (awardWisdomXP) awardWisdomXP("mindfulness", 1, "Health Strategies: reflect");

    const deltas = { empathy: 1, intelligence: 0, discipline: 0, confidence: 0 };
    applyDeltas(deltas, "Reflect");
    applyStress(-1, "Reflect");
    addLog("📓 You reflect on what's working (and what isn't). Empathy deepens.");

    recordTimelineEntry({
      kind: "strategy",
      title: "📓 Strategy: Reflect",
      detail: "You think through the week. It counts.",
      deltas: deltas,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -1
    });

    const popup = pickMissingActionPopup("parentStrategies", "reflect");
    if (popup) {
      emitActionResult({
        actionId: "parentStrategies",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: deltas,
        moneyDelta: 0,
        focusDelta: -1,
        loveDelta: 0,
        stressDelta: -1,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    safeCall(onClose);
  };

  const performSleepType = (sleepType) => {
    const sleep = gameState.parentStrategyProgress?.sleep || { total: 0, byType: { screenFree: 0, routine: 0, early: 0 }, lastType: null, streak: 0, unlocks: { sleepReset: false } };
    const typeKey = sleepType === 'screenFree' ? 'screenFree' : sleepType === 'routine' ? 'routine' : 'early';
    const typeLabel = sleepType === 'screenFree' ? 'Screen-Free Evening' : sleepType === 'routine' ? 'Bedtime Routine' : 'Earlier Bedtime';
    const typeEmoji = sleepType === 'screenFree' ? '📵' : sleepType === 'routine' ? '📚' : '⏰';
    const childMasteryStatKey = sleepType === 'screenFree' ? 'discipline' : sleepType === 'routine' ? 'responsibility' : 'health';
    const childMasteryStatLabel = sleepType === 'screenFree' ? 'DISCIPLINE' : sleepType === 'routine' ? 'RESPONSIBILITY' : 'HEALTH';

    if (!spendFocus(1, `Sleep: ${typeLabel}`)) return;

    const prevCount = Number(sleep.byType[typeKey] || 0);
    const BASE = sleepType === 'screenFree' ? 0.1 : 0.05;
    const CAP = sleepType === 'screenFree' ? 1.0 : 0.5;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    const stressHigh = gameState.stress > 2;
    const stressDelta = sleepType === 'screenFree' ? (stressHigh ? -3 : 0) : (stressHigh ? -2 : 0);

    const baseDiscipline = 1;
    const childDeltas = { discipline: baseDiscipline, [childMasteryStatKey]: roundedBonus };

    // Screen-Free also reduces anxiety
    if (sleepType === 'screenFree') {
      const anxReduction = -Math.min(0.5, roundedBonus);
      childDeltas.anxiety = anxReduction;
    }

    if (stressDelta !== 0) applyStress(stressDelta);
    applyDeltas(childDeltas, `Sleep: ${typeLabel}`);

    const newTotal = sleep.total + 1;
    const newScreenFree = sleepType === 'screenFree' ? prevCount + 1 : sleep.byType.screenFree;
    const newRoutine = sleepType === 'routine' ? prevCount + 1 : sleep.byType.routine;
    const newEarly = sleepType === 'early' ? prevCount + 1 : sleep.byType.early;
    const newStreak = (sleep.lastType === typeKey) ? sleep.streak + 1 : 1;
    const newLastType = typeKey;

    const sleepResetUnlocked = newScreenFree >= 5;

    updateState(prev => ({
      parentStrategyProgress: {
        ...(prev.parentStrategyProgress || {}),
        sleep: {
          total: newTotal,
          byType: { screenFree: newScreenFree, routine: newRoutine, early: newEarly },
          lastType: newLastType,
          streak: newStreak,
          unlocks: { sleepReset: sleepResetUnlocked }
        }
      }
    }));

    if (newStreak === 5) {
      const trophyMap = { screenFree: 'sleep_screenfree_streak_5', routine: 'sleep_routine_streak_5', early: 'sleep_early_streak_5' };
      const trophyNames = { screenFree: 'Screen-Free Legend', routine: 'Bedtime Boss', early: 'Early Bird' };
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

    addLog(`${typeEmoji} ${typeLabel} complete. ${childMasteryStatLabel} ${formatSmallDelta(roundedBonus)}`);

    const statusText = stressHigh ? '' : '\n(Prevention — stress already low)';
    const bodyText = `You protect sleep via ${typeLabel.toLowerCase()}. ${stressHigh ? 'Structure improves.' : 'Prevention counts.'}\n\n${stressHigh ? `Stress ${stressDelta}` : 'No stress change (already calm)'}${statusText}\nChild: DISCIPLINE ${formatSmallDelta(baseDiscipline)} • ${childMasteryStatLabel} ${formatSmallDelta(roundedBonus)}${sleepType === 'screenFree' && childDeltas.anxiety ? ` • ANXIETY ${formatSmallDelta(childDeltas.anxiety)}` : ''}\n\n${typeLabel} count: ${prevCount + 1}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "sleep"],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Sleep protection #${newTotal}. Bedtime becomes non-negotiable.`,
      deltas: childDeltas,
      stressDelta,
      loveDelta: 0,
      moneyDelta: 0,
      meta: { sleepType, sleepTotal: newTotal }
    });

    setSubView('main');
    onClose();
  };

  const handleSleepReset = () => {
    const usedThisAge = gameState.yearFlags?.sleepResetUsedAtAge === gameState.currentYear;
    if (usedThisAge) {
      toast('Sleep Reset Weekend already used this age.', { icon: '🛌' });
      return;
    }

    if (!spendFocus(1, "Sleep Reset Weekend")) return;

    applyStress(-7);
    applyLove(1);
    applyDeltas({ discipline: 1, anxiety: -1, health: 1 }, "Sleep Reset Weekend");

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), sleepResetUsedAtAge: prev.currentYear }
    }));

    addLog("🛌 Sleep Reset Weekend. Deep rest for the whole family.");

    emitActionResult({
      title: "🛌 Sleep Reset Weekend",
      body: "You protect a full weekend of early bedtimes and slow mornings. Everyone catches up on rest.\n\nStress -7 • Love +1\nChild: DISCIPLINE +1 • ANXIETY -1 • HEALTH +1",
      deltas: { discipline: 1, anxiety: -1, health: 1 },
      loveDelta: 1,
      stressDelta: -7,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "sleep", "reset"],
      meta: { emoji: "🛌" }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: '🛌 Sleep Reset Weekend',
      detail: 'A weekend of deep rest. Everyone recovers.',
      deltas: { discipline: 1, anxiety: -1, health: 1 },
      stressDelta: -7,
      loveDelta: 1,
      moneyDelta: 0
    });

    setSubView('main');
    onClose();
  };

  const handlePhoneGames = () => {
    const used = Number(gameState.phoneGamesThisAge ?? 0);
    if (used >= 5) {
      addLog("📱 You’ve already used your phone 5 times this year.");
      return;
    }
    if (!spendFocus(1, "Phone games")) return;

    applyStress(-1, "Phone games");

    updateState(prev => ({
      phoneGamesThisAge: Number(prev.phoneGamesThisAge ?? 0) + 1,
      phoneGamesTotal: Number(prev.phoneGamesTotal ?? 0) + 1,
      phoneGamesConfidenceDebt: Number(prev.phoneGamesConfidenceDebt ?? 0) + 1
    }));

    addLog("📱 You play games on your phone. Stress -1.");

    const popup = pickMissingActionPopup("parentStrategies", "phoneGames");
    if (popup) {
      emitActionResult({
        actionId: "parentStrategies",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: -1,
        loveDelta: 0,
        stressDelta: -1,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    safeCall(onClose);
  };

  const buildGratitudeCandidates = () => {
    const cands = [];
    try {
      const roster = Array.isArray(gameState.relationships?.roster) ? gameState.relationships.roster : [];
      roster.forEach(p => {
        if (!p?.name) return;
        cands.push({ key: `rel:${p.id || p.role || p.name}`, name: p.name, role: p.role || 'friend' });
      });
      if (gameState.coparentProfile?.name) {
        cands.push({ key: `cop:${gameState.coparentProfile.name}`, name: gameState.coparentProfile.name, role: 'coparent' });
      }
      const pets = Array.isArray(gameState.pets) ? gameState.pets : [];
      pets.forEach(p => cands.push({ key: `pet:${p.id || p.name}`, name: p.name || 'Pet', role: 'pet' }));
      const ptaOk = Boolean(gameState.expansions?.ptaIlluminati) && Boolean(gameState.pta?.unlocked);
      if (ptaOk) {
        PTA_NPCS.forEach(n => cands.push({ key: `pta:${n.id}`, name: n.name, role: 'pta' }));
      }
    } catch {}
    return cands;
  };

  const pickThreeWithRotation = (cands) => {
    const used = Array.isArray(gameState.gratitudeUsedNpcKeys) ? gameState.gratitudeUsedNpcKeys : [];
    const fresh = cands.filter(c => !used.includes(c.key));
    const chosen = [];
    const poolA = fresh.length ? fresh : cands;
    for (let i = 0; i < 3; i++) {
      if (poolA.length === 0) break;
      const idx = Math.floor(Math.random() * poolA.length);
      chosen.push(poolA.splice(idx,1)[0]);
    }
    while (chosen.length < 3) {
      chosen.push({ key: `gen:${chosen.length}`, name: 'small mercies', role: 'generic' });
    }
    // Update rotation list
    const nextUsed = [...used, ...chosen.map(c => c.key)].slice(-50);
    updateState({ gratitudeUsedNpcKeys: nextUsed });
    return chosen.slice(0,3);
  };

  const bulletFor = (npc) => {
    const childName = gameState.childName || 'your child';
    switch ((npc.role || '').toLowerCase()) {
      case 'child':
        return `• 🧒 ${npc.name} — the way they keep trying, even when it’s messy.`;
      case 'partner':
        return `• 💞 ${npc.name} — small acts of teamwork that keep the week from tipping over.`;
      case 'coparent':
        return `• 🤝 ${npc.name} — for the moments of cooperation that protect ${childName}.`;
      case 'mother':
      case 'mom':
        return `• 👩 ${npc.name} — showing up in ways that steady the family.`;
      case 'father':
      case 'dad':
        return `• 👨 ${npc.name} — the quiet help that makes hard days workable.`;
      case 'teacher':
      case 'mentor':
        return `• 🍎 ${npc.name} — for seeing strengths in ${childName} that you might miss on hard days.`;
      case 'best_friend':
      case 'friend':
        return `• 🫶 ${npc.name} — for showing up without requiring you to be “fine.”`;
      case 'sibling':
        return `• 👨‍👩‍👧 ${npc.name} — shared chaos that still feels like home.`;
      case 'pet':
        return `• 🐾 ${npc.name} — unconditional joy in a chaotic house.`;
      case 'pta':
        return `• 🍪 ${npc.name} — for caring about the community, even when it gets intense.`;
      default:
        return `• ✨ ${npc.name} — a small kindness that mattered.`;
    }
  };

  const handleGratitudePractice = () => {
    if (!spendFocus(1, 'Gratitude Practice')) return;
    applyStress(-5, 'Gratitude Practice');
    applyDeltas({ empathy: 0.5 }, 'Gratitude Practice');

    const cands = buildGratitudeCandidates();
    const picks = pickThreeWithRotation(cands);
    const bullets = picks.map(bulletFor);

    const body = `You pause and name three specifics that felt steady today.\n\n${bullets.join('\n')}`;

    emitActionResult({
      actionId: 'parentStrategies:gratitude',
      title: '🙏 Gratitude Practice',
      body,
      deltas: { empathy: 0.5 },
      moneyDelta: 0,
      focusDelta: -1,
      loveDelta: 0,
      stressDelta: -5,
      tags: ['wellbeing','mindfulness'],
      meta: { emoji: '🙏' }
    });

    recordTimelineEntry({ kind: 'strategy', title: '🙏 Strategy: Gratitude Practice', detail: bullets.join('\n'), deltas: { empathy: 0.5 }, moneyDelta: 0, loveDelta: 0, stressDelta: -5 });
    safeCall(onClose);
  };

  const performGymWorkout = (gymType) => {
    const gym = gameState.parentStrategyProgress?.gym || { totalSessions: 0, cardio: 0, upper: 0, legs: 0, lastType: null, streak: 0, marathonUnlocked: false };
    const typeKey = gymType === 'cardio' ? 'cardio' : gymType === 'upper' ? 'upper' : 'legs';
    const typeLabel = gymType === 'cardio' ? 'Cardio Day' : gymType === 'upper' ? 'Upper Body Day' : 'Leg Day';
    const typeEmoji = gymType === 'cardio' ? '🏃' : gymType === 'upper' ? '💪' : '🦵';
    
    if (!spendFocus(1, `Gym: ${typeLabel}`)) return;

    const prevTotal = Number(gym.totalSessions || 0);
    const prevCardio = Number(gym.cardio || 0);
    const prevUpper = Number(gym.upper || 0);
    const prevLegs = Number(gym.legs || 0);
    const prevLast = gym.lastType || null;
    const prevStreak = Number(gym.streak || 0);

    const newTotal = prevTotal + 1;
    const newCardio = gymType === 'cardio' ? prevCardio + 1 : prevCardio;
    const newUpper = gymType === 'upper' ? prevUpper + 1 : prevUpper;
    const newLegs = gymType === 'legs' ? prevLegs + 1 : prevLegs;
    const newStreak = (prevLast === typeKey) ? prevStreak + 1 : 1;
    const newLastType = typeKey;

    const rawDisc = 0.1 * Math.pow(2, newTotal - 1);
    const disciplineDelta = Math.round(Math.min(1.0, rawDisc) * 10) / 10;
    
    const childDeltas = { discipline: disciplineDelta };

    applyStress(-2);
    applyPlayerHealth(1.5);
    applyDeltas(childDeltas, `Gym: ${typeLabel}`);

    updateState(prev => ({
      parentStrategyProgress: {
        ...(prev.parentStrategyProgress || {}),
        gym: {
          ...(prev.parentStrategyProgress?.gym || {}),
          totalSessions: newTotal,
          cardio: newCardio,
          upper: newUpper,
          legs: newLegs,
          lastType: newLastType,
          streak: newStreak,
          marathonUnlocked: (prev.parentStrategyProgress?.gym?.marathonUnlocked === true) || (newCardio >= 5),
          marathonsCompleted: Number(prev.parentStrategyProgress?.gym?.marathonsCompleted || 0)
        }
      }
    }));

    if (newStreak === 5) {
      const trophyId = `gym_${typeKey}_machine`;
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked[trophyId]) {
        const trophyNames = { cardio: 'Cardio Machine', upper: 'Upper Body Beast', legs: 'Leg Day Legend' };
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

    addLog(`${typeEmoji} ${typeLabel} complete. Gym habit: ${newTotal} sessions total.`);
    
    const bodyText = `You lift heavy things, put them down, and temporarily forget about bedtime negotiations.\n\nParent Health +1.5 • Stress -2\nChild: DISCIPLINE +${disciplineDelta.toFixed(1)}\n\nGym habit: ${newTotal} sessions total\nCardio: ${newCardio}/5 (Marathon unlock)`;
    
    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta: -2,
      moneyDelta: 0,
      focusDelta: -1,
      healthDelta: 1.5,
      tags: ["strategy", "gym"],
      meta: { emoji: typeEmoji }
    });
    
    recordTimelineEntry({
      kind: 'strategy',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Gym session #${newTotal}. Your child learns discipline from watching you show up.`,
      deltas: childDeltas,
      stressDelta: -2,
      moneyDelta: 0,
      loveDelta: 0,
      meta: { workoutType: gymType, gymTotal: newTotal }
    });
    
    setSubView('main');
    onClose();
  };

  const handleMarathon = () => {
    if (!spendFocus(1, "Run a Marathon")) return;

    const gym = gameState.parentStrategyProgress?.gym || {};
    const marathonsCompleted = Number(gym.marathonsCompleted || 0);

    applyStress(-4);
    applyPlayerHealth(3);
    applyDeltas({ discipline: 1.0, fitness: 0.5 }, "Marathon");

    updateState(prev => ({
      parentStrategyProgress: {
        ...(prev.parentStrategyProgress || {}),
        gym: {
          ...(prev.parentStrategyProgress?.gym || {}),
          marathonsCompleted: marathonsCompleted + 1
        }
      }
    }));

    const trophies = gameState.trophies || { unlocked: {} };
    if (!trophies.unlocked['marathon_finisher']) {
      updateState({
        trophies: {
          unlocked: {
            ...(trophies.unlocked || {}),
            marathon_finisher: {
              unlockedAtAge: gameState.currentYear,
              unlockedAtYear: gameState.currentYear,
              note: "Completed your first marathon"
            }
          }
        }
      });
      addLog(`🏆 Trophy unlocked: Marathon Finisher`);
      recordTimelineEntry({
        kind: 'system',
        title: `🏆 Trophy: Marathon Finisher`,
        detail: `You ran 26.2 miles. Your child watched you finish.`
      });
    }

    addLog("🏅 Marathon complete. 26.2 miles of clarity.");
    
    emitActionResult({
      title: "🏅 Run a Marathon",
      body: "You run 26.2 miles. Your legs scream. Your brain goes quiet. You cross the finish line and remember why you started.\n\nParent Health +3 • Stress -4\nChild: DISCIPLINE +1.0 • FITNESS +0.5",
      deltas: { discipline: 1.0, fitness: 0.5 },
      loveDelta: 0,
      stressDelta: -4,
      moneyDelta: 0,
      focusDelta: -1,
      healthDelta: 3.0,
      tags: ["strategy", "gym", "marathon"],
      meta: { 
        emoji: "🏅",
        coachNote: "You showed your child what finishing looks like—even when it's hard."
      }
    });
    
    recordTimelineEntry({
      kind: 'strategy',
      title: '🏅 Marathon',
      detail: `You ran 26.2 miles. Your child saw you finish something hard.`,
      deltas: { discipline: 1.0, fitness: 0.5 },
      stressDelta: -4,
      moneyDelta: 0,
      loveDelta: 0
    });
    
    onClose();
  };

  const performGardeningType = (gardenType) => {
    const typeKey = gardenType === 'veg' ? 'veg' : gardenType === 'flower' ? 'flower' : 'bonsai';
    const typeLabel = gardenType === 'veg' ? 'Vegetable Patch' : gardenType === 'flower' ? 'Flowers' : 'Bonsai / Indoor Plants';
    const typeEmoji = gardenType === 'veg' ? '🥕' : gardenType === 'flower' ? '🌸' : '🌿';

    if (!spendFocus(1, `Gardening: ${typeLabel}`)) return;

    const counterKey = `garden_${typeKey}`;
    const prevCount = Number(gameState.counters?.[counterKey] || 0);
    const newCount = prevCount + 1;

    // Mastery: min(1, 0.1 * 2^(count-1))
    const mastery = Math.min(1, 0.1 * Math.pow(2, newCount - 1));

    let playerHealthDelta, stressDelta, childDeltas = {};

    if (gardenType === 'veg') {
      playerHealthDelta = 1.0 + mastery * 0.5;
      stressDelta = -1.0 - mastery * 0.5;
      childDeltas = { discipline: Math.round(mastery * 0.8 * 100) / 100 };
    } else if (gardenType === 'flower') {
      playerHealthDelta = 0.8 + mastery * 0.4;
      stressDelta = -1.2 - mastery * 0.6;
      childDeltas = { empathy: Math.round(mastery * 0.8 * 100) / 100 };
    } else {
      playerHealthDelta = 0.9 + mastery * 0.4;
      stressDelta = -1.0 - mastery * 0.7;
      childDeltas = {
        discipline: Math.round(mastery * 0.5 * 100) / 100,
        confidence: Math.round(mastery * 0.3 * 100) / 100
      };
    }

    applyStress(stressDelta);
    applyPlayerHealth(playerHealthDelta);
    applyDeltas(childDeltas, `Gardening: ${typeLabel}`);

    // Update counter
    updateState(prev => ({
      counters: { ...(prev.counters || {}), [counterKey]: newCount }
    }));

    // Check for Harvest Dinner unlock (veg >= 5 OR total >= 10)
    const vegCount = gameState.counters?.garden_veg || 0;
    const flowerCount = gameState.counters?.garden_flower || 0;
    const bonsaiCount = gameState.counters?.garden_bonsai || 0;
    const totalGarden = vegCount + flowerCount + bonsaiCount + 1;
    const unlockHarvest = (gardenType === 'veg' && newCount >= 5) || totalGarden >= 10;

    // Check for "Green Thumb" trophy (2+ of 3 counters at 5+)
    let countersAt5OrMore = 0;
    if (vegCount >= 5) countersAt5OrMore++;
    if (flowerCount >= 5) countersAt5OrMore++;
    if (bonsaiCount >= 5) countersAt5OrMore++;
    if (gardenType === 'veg' && newCount >= 5) countersAt5OrMore = Math.max(countersAt5OrMore, (vegCount >= 5 ? 1 : 0) + (flowerCount >= 5 ? 1 : 0) + (bonsaiCount >= 5 ? 1 : 0) + 1);

    if (countersAt5OrMore >= 2) {
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked?.green_thumb) {
        updateState(prev => ({
          trophies: {
            unlocked: {
              ...(prev.trophies?.unlocked || {}),
              green_thumb: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: 'Mastered multiple gardening styles'
              }
            }
          }
        }));
        addLog('🏆 Trophy unlocked: Green Thumb');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Green Thumb',
          detail: 'You turned dirt into a coping mechanism.'
        });
      }
    }

    addLog(`${typeEmoji} ${typeLabel} complete. Mastery: ${(mastery * 100).toFixed(0)}%.`);

    const bodyText = `You tend your ${typeLabel.toLowerCase()}. Slow, grounding work.\n\nParent Health ${formatSmallDelta(playerHealthDelta)} • Stress ${formatSmallDelta(stressDelta)}\nChild: ${Object.entries(childDeltas).map(([k, v]) => `${k.toUpperCase()} ${formatSmallDelta(v)}`).join(' • ')}\n\n${typeLabel} count: ${newCount}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      healthDelta: playerHealthDelta,
      tags: ["strategy", "gardening"],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Gardening session. Mastery: ${(mastery * 100).toFixed(0)}%.`,
      deltas: childDeltas,
      stressDelta,
      moneyDelta: 0,
      loveDelta: 0,
      meta: { gardenType, mastery }
    });

    setSubView('main');
    onClose();
  };

  const handleHarvestDinner = () => {
    if (!spendFocus(1, "Harvest Dinner")) return;

    const childDeltas = { empathy: 0.3, discipline: 0.3 };

    applyStress(-1.0);
    applyPlayerHealth(1.0);
    applyLove(1.0);
    applyDeltas(childDeltas, "Harvest Dinner");

    addLog("🍲 Harvest Dinner. You cook something from your own effort. Everyone eats better.");

    emitActionResult({
      title: "🍲 Harvest Dinner",
      body: "You cook a meal from what you grew. Fresh food, shared labor, a table that feels alive.\n\nParent Health +1.0 • Stress -1.0 • Love +1.0\nChild: EMPATHY +0.3 • DISCIPLINE +0.3",
      deltas: childDeltas,
      loveDelta: 1.0,
      stressDelta: -1.0,
      moneyDelta: 0,
      focusDelta: -1,
      healthDelta: 1.0,
      tags: ["strategy", "gardening", "family"],
      meta: { emoji: "🍲" }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: '🍲 Harvest Dinner',
      detail: 'A meal from the garden. Real food, real connection.',
      deltas: childDeltas,
      stressDelta: -1.0,
      loveDelta: 1.0,
      moneyDelta: 0
    });

    setSubView('main');
    onClose();
  };

  const handleGossip = () => {
    if (!(gameState.inSchool || gameState.parentEducation?.enrollment)) {
      addLog("🗣️ Gossip isn’t really available until school social circles exist.");
      return;
    }
    if (!spendFocus(1, "Gossip")) return;

    applyStress(-1, "Gossip");

    const newRep = Number(gameState.peerReputation ?? 0) - 1;
    updateState({ peerReputation: newRep });

    addLog("🗣️ You gossip. Stress -1. Peer reputation -1.");

    if (newRep <= -5 && !gameState.gossipPenaltyMinus5Applied) {
      applyDeltas({ confidence: -1 }, "Gossip fallout");
      updateState({
        gossipPenaltyMinus5Applied: true,
        playdatesDisabledByGossip: true
      });
      addLog("🚫 Gossip backfires. Your reputation tanks. Playdates are no longer possible.");
    }

    if (newRep <= -10 && !gameState.gossipPenaltyMinus10Applied) {
      applyDeltas({ confidence: -2 }, "Severe gossip fallout");
      updateState({ gossipPenaltyMinus10Applied: true });
      addLog("💔 The damage becomes lasting. Confidence -2.");
    }

    const popup = pickMissingActionPopup("parentStrategies", "gossip");
    if (popup) {
      emitActionResult({
        actionId: "parentStrategies",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: newRep <= -10 ? { confidence: -2 } : (newRep <= -5 ? { confidence: -1 } : null),
        moneyDelta: 0,
        focusDelta: -1,
        loveDelta: 0,
        stressDelta: -1,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    safeCall(onClose);
  };

  // Safety wrapper
  const safeGetAvailability = (key) => {
    return typeof getAvailability === 'function' 
      ? getAvailability(key) 
      : { enabled: true }; // Default to true if missing to prevent lockouts
  };

  // Get availability for all strategies
  const resetAvail = safeGetAvailability({ type: 'parentStrategy', id: 'reset' });
  const miniBreakAvail = safeGetAvailability({ type: 'parentStrategy', id: 'miniBreak' });
  const reflectAvail = safeGetAvailability({ type: 'parentStrategy', id: 'reflect' });
  const sleepAvail = safeGetAvailability({ type: 'parentStrategy', id: 'protectSleep' });
  const phoneAvail = safeGetAvailability({ type: 'parentStrategy', id: 'phoneGames' });
  const gossipAvail = safeGetAvailability({ type: 'parentStrategy', id: 'gossip' });
  const gymAvail = safeGetAvailability({ type: 'parentStrategy', id: 'gym' });
  const gardeningAvail = safeGetAvailability({ type: 'parentStrategy', id: 'gardening' });
  const gratitudeAvail = { enabled: (gameState.actionPoints || 0) >= 1 };
  
  const gymProg = gameState.parentStrategyProgress?.gym || { totalSessions: 0, cardio: 0, upper: 0, legs: 0, lastType: null, streak: 0, marathonUnlocked: false };
  const canUse = !finished && actionPoints >= 1;

  const videoProg = gameState.video || { masterclassTracks: { boundaries: 0, sleep: 0, emotional: 0 } };
  const maxTrackCount = Math.max(
    videoProg.masterclassTracks?.boundaries || 0,
    videoProg.masterclassTracks?.sleep || 0,
    videoProg.masterclassTracks?.emotional || 0
  );
  const toolkitUnlocked = maxTrackCount >= 3;

  const handleToolkitTwoChoices = () => {
    const usedThisAge = gameState.yearFlags?.toolkitTwoChoicesUsedAtAge === gameState.currentYear;
    if (usedThisAge) {
      toast('Two Good Choices already used this age.', { icon: '🧰' });
      return;
    }

    if (!spendFocus(1, "Two Good Choices")) return;

    applyStress(-2);
    applyDeltas({ confidence: 0.6, discipline: 0.4 }, "Two Good Choices");

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), toolkitTwoChoicesUsedAtAge: prev.currentYear }
    }));

    addLog("🧰 Two Good Choices. You offer options. Your child cooperates.");

    emitActionResult({
      title: "🧰 Two Good Choices",
      body: "You offer two options you can live with. Your child feels control without a power struggle.\n\nStress -2\nChild: CONFIDENCE +0.6 • DISCIPLINE +0.4",
      deltas: { confidence: 0.6, discipline: 0.4 },
      loveDelta: 0,
      stressDelta: -2,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "toolkit"],
      meta: { emoji: "🧰" }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: '🧰 Two Good Choices',
      detail: 'A coaching tool from the toolkit. Structure + autonomy = cooperation.',
      deltas: { confidence: 0.6, discipline: 0.4 },
      stressDelta: -2,
      loveDelta: 0,
      moneyDelta: 0
    });

    setSubView('main');
    onClose();
  };

  const performPhoneType = (phoneType) => {
    const phone = gameState.parentStrategyProgress?.phone || { total: 0, byType: { doomscroll: 0, puzzle: 0, learning: 0 }, lastType: null, streak: 0, unlocks: { appLimits: false } };
    const typeKey = phoneType;
    const typeLabel = phoneType === 'doomscroll' ? 'Doomscroll' : phoneType === 'puzzle' ? 'Puzzle Game' : 'Learning App';
    const typeEmoji = phoneType === 'doomscroll' ? '🌀' : phoneType === 'puzzle' ? '🧩' : '📖';

    if (!spendFocus(1, `Phone: ${typeLabel}`)) return;

    const prevCount = Number(phone.byType[typeKey] || 0);
    const BASE = 0.05;
    const CAP = 0.4;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    let stressDelta = 0;
    let childDeltas = {};
    let debtDelta = 0;

    if (phoneType === 'doomscroll') {
      stressDelta = -2;
      childDeltas = { anxiety: 0.2 };
      debtDelta = 2;
    } else if (phoneType === 'puzzle') {
      stressDelta = -1;
      childDeltas = { intelligence: roundedBonus };
      debtDelta = 1;
    } else {
      stressDelta = -1;
      childDeltas = { curiosity: roundedBonus };
      const currentDebt = gameState.phoneGamesConfidenceDebt || 0;
      debtDelta = currentDebt > 0 ? -1 : 0;
    }

    applyStress(stressDelta);
    applyDeltas(childDeltas, `Phone: ${typeLabel}`);

    const newTotal = phone.total + 1;
    const newDoomscroll = phoneType === 'doomscroll' ? prevCount + 1 : phone.byType.doomscroll;
    const newPuzzle = phoneType === 'puzzle' ? prevCount + 1 : phone.byType.puzzle;
    const newLearning = phoneType === 'learning' ? prevCount + 1 : phone.byType.learning;
    const newStreak = (phone.lastType === typeKey) ? phone.streak + 1 : 1;
    const newLastType = typeKey;

    const appLimitsUnlocked = newPuzzle >= 5;

    updateState(prev => ({
      phoneGamesThisAge: Number(prev.phoneGamesThisAge ?? 0) + 1,
      phoneGamesTotal: Number(prev.phoneGamesTotal ?? 0) + 1,
      phoneGamesConfidenceDebt: Math.max(0, Number(prev.phoneGamesConfidenceDebt ?? 0) + debtDelta),
      parentStrategyProgress: {
        ...(prev.parentStrategyProgress || {}),
        phone: {
          total: newTotal,
          byType: { doomscroll: newDoomscroll, puzzle: newPuzzle, learning: newLearning },
          lastType: newLastType,
          streak: newStreak,
          unlocks: { appLimits: appLimitsUnlocked }
        }
      }
    }));

    if (newStreak === 5 && phoneType === 'puzzle') {
      const trophyId = 'phone_puzzle_streak_5';
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked[trophyId]) {
        updateState({
          trophies: {
            unlocked: {
              ...(trophies.unlocked || {}),
              [trophyId]: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: '5 Puzzle Game sessions in a row'
              }
            }
          }
        });
        addLog('🏆 Trophy unlocked: Digital Minimalist');
        recordTimelineEntry({
          kind: 'system',
          title: '🏆 Trophy: Digital Minimalist',
          detail: 'Completed 5 Puzzle Game sessions consecutively.'
        });
      }
    }

    addLog(`${typeEmoji} ${typeLabel} complete.`);

    const bodyText = phoneType === 'doomscroll'
      ? `You doomscroll. Short-term relief, long-term modeling.\n\nStress -2\nChild: ANXIETY ${formatSmallDelta(0.2)}\nConfidence debt +2`
      : phoneType === 'puzzle'
        ? `You play a puzzle game. Better than doomscrolling.\n\nStress -1\nChild: INT ${formatSmallDelta(roundedBonus)}\nConfidence debt +1\n\n${typeLabel} count: ${prevCount + 1}`
        : `You use a learning app. Models healthy screen time.\n\nStress -1\nChild: CUR ${formatSmallDelta(roundedBonus)}\nConfidence debt ${debtDelta < 0 ? '-1' : '+0'}\n\n${typeLabel} count: ${prevCount + 1}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "phone"],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Phone session #${newTotal}. ${phoneType === 'doomscroll' ? 'Mindless scrolling.' : phoneType === 'puzzle' ? 'Brain teaser.' : 'Learning app.'}`,
      deltas: childDeltas,
      stressDelta,
      loveDelta: 0,
      moneyDelta: 0,
      meta: { phoneType, phoneTotal: newTotal }
    });

    setSubView('main');
    onClose();
  };

  const handleAppLimits = () => {
    if (!spendFocus(1, "Set App Limits")) return;

    applyStress(-1);
    applyDeltas({ discipline: 0.6, anxiety: -0.6 }, "Set App Limits");

    const currentDebt = gameState.phoneGamesConfidenceDebt || 0;
    const debtReduction = Math.min(2, currentDebt);

    updateState(prev => ({
      phoneGamesConfidenceDebt: Math.max(0, currentDebt - debtReduction),
      yearFlags: { ...(prev.yearFlags || {}), appLimitsUsedAtAge: prev.currentYear }
    }));

    addLog("🔒 App Limits set. Structure protects attention.");

    emitActionResult({
      title: "🔒 Set App Limits",
      body: "You set app limits on your phone. Screen time becomes intentional.\n\nStress -1\nChild: DISCIPLINE +0.6 • ANXIETY -0.6\nConfidence debt -2",
      deltas: { discipline: 0.6, anxiety: -0.6 },
      loveDelta: 0,
      stressDelta: -1,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "phone"],
      meta: { emoji: "🔒" }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: '🔒 Set App Limits',
      detail: 'You set healthy boundaries on screen time.',
      deltas: { discipline: 0.6, anxiety: -0.6 },
      stressDelta: -1,
      loveDelta: 0,
      moneyDelta: 0
    });

    setSubView('main');
    onClose();
  };

  const handleToolkitRepair = () => {
    const usedThisAge = gameState.yearFlags?.toolkitRepairUsedAtAge === gameState.currentYear;
    if (usedThisAge) {
      toast('Repair Attempt already used this age.', { icon: '🧰' });
      return;
    }

    if (!spendFocus(1, "Repair Attempt")) return;

    applyStress(-1);
    applyLove(2);
    applyDeltas({ empathy: 0.6 }, "Repair Attempt");

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), toolkitRepairUsedAtAge: prev.currentYear }
    }));

    addLog("🧰 Repair Attempt. You came back. That matters.");

    emitActionResult({
      title: "🧰 Repair Attempt",
      body: "You go back and repair after a rupture. You model: mistakes happen, but we come back.\n\nStress -1 • Love +2\nChild: EMPATHY +0.6",
      deltas: { empathy: 0.6 },
      loveDelta: 2,
      stressDelta: -1,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "toolkit"],
      meta: { emoji: "🧰" }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: '🧰 Repair Attempt',
      detail: 'You came back after a rupture. Repair builds safety.',
      deltas: { empathy: 0.6 },
      stressDelta: -1,
      loveDelta: 2,
      moneyDelta: 0
    });

    setSubView('main');
    onClose();
  };

  const strategies = [
    {
      icon: '🙏',
      title: 'Gratitude Practice',
      subtitle: 'STRESS -5 • EMP +0.5',
      avail: gratitudeAvail,
      onClick: handleGratitudePractice
    },
    {
      icon: '🏋️',
      title: 'Gym Session',
      subtitle: 'STRESS -2 • HEALTH +1.5 • Scaling child DISC bonus',
      avail: { enabled: canUse },
      onClick: () => setSubView('gym')
    },
    {
      icon: '🏅',
      title: 'Run a Marathon',
      subtitle: 'STRESS -4 • HEALTH +3 • Kid DISC +1.0 • Kid FITNESS +0.5',
      avail: gymProg.marathonUnlocked 
        ? { enabled: canUse }
        : { enabled: false, reasonText: `Do Cardio Day 5 times (${Math.min(gymProg.cardio || 0, 5)}/5)` },
      onClick: handleMarathon
    },
    {
      icon: '🌱',
      title: 'Gardening',
      subtitle: 'STRESS -1 • HEALTH +1.0 • Scaling child bonuses',
      avail: gardeningAvail,
      onClick: () => setSubView('gardening')
    },
    {
      icon: '🧘',
      title: 'Reset',
      subtitle: 'STRESS -4 • Mark yourself as regulated.',
      avail: resetAvail,
      onClick: handleReset
    },
    {
      icon: '🚶',
      title: 'Mini Break',
      subtitle: 'STRESS -2 • LOVE +1 • Scaling child bonuses',
      avail: miniBreakAvail,
      onClick: () => setSubView('miniBreak')
    },
    {
      icon: '📓',
      title: 'Reflect',
      subtitle: 'STRESS -1 • EMP +1',
      avail: reflectAvail,
      onClick: handleReflect
    },
    {
      icon: '🛌',
      title: 'Protect Sleep',
      subtitle: 'STRESS -3 • DIS +1 • Scaling child bonuses',
      avail: sleepAvail,
      onClick: () => setSubView('sleep')
    },
    {
      icon: '📱',
      title: 'Phone games',
      subtitle: 'STRESS -1 • Confidence debt (5x max/age)',
      avail: phoneAvail,
      onClick: () => setSubView('phoneGames')
    },
    {
      icon: '🗣️',
      title: 'Gossip',
      subtitle: 'STRESS -1 to -2 • Reputation varies by choice',
      avail: gossipAvail,
      onClick: () => setSubView('gossip')
    },
    {
      icon: '🧰',
      title: 'Parent Coach Toolkit',
      subtitle: 'Advanced parenting tools (unlock by masterclass track >= 3)',
      avail: toolkitUnlocked
        ? { enabled: canUse }
        : { enabled: false, reasonText: `Complete 3 masterclasses in any track (max: ${maxTrackCount}/3)` },
      onClick: () => setSubView('toolkit')
    }
  ];

  const miniBreakProg = gameState.parentStrategyProgress?.miniBreak || { total: 0, byType: { walk: 0, breath: 0, call: 0 }, lastType: null, streak: 0, unlocks: { microRetreat: false } };
  const sleepProg = gameState.parentStrategyProgress?.sleep || { total: 0, byType: { screenFree: 0, routine: 0, early: 0 }, lastType: null, streak: 0, unlocks: { sleepReset: false } };
  const phoneProg = gameState.parentStrategyProgress?.phone || { total: 0, byType: { doomscroll: 0, puzzle: 0, learning: 0 }, lastType: null, streak: 0, unlocks: { appLimits: false } };
  const gossipProg = gameState.parentStrategyProgress?.gossip || { total: 0, byType: { vent: 0, rumor: 0, listen: 0 }, lastType: null, streak: 0 };

  const vegCount = gameState.counters?.garden_veg || 0;
  const flowerCount = gameState.counters?.garden_flower || 0;
  const bonsaiCount = gameState.counters?.garden_bonsai || 0;
  const totalGarden = vegCount + flowerCount + bonsaiCount;
  const harvestDinnerUnlocked = vegCount >= 5 || totalGarden >= 10;

  const computeNextMiniBreakBonus = (typeKey) => {
    const prevCount = Number(miniBreakProg.byType[typeKey] || 0);
    const BASE = 0.05;
    const CAP = 0.4;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
  };

  const computeNextSleepBonus = (typeKey) => {
    const prevCount = Number(sleepProg.byType[typeKey] || 0);
    const BASE = typeKey === 'screenFree' ? 0.1 : 0.05;
    const CAP = typeKey === 'screenFree' ? 1.0 : 0.5;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
  };

  const computeNextPhoneBonus = (typeKey) => {
    const prevCount = Number(phoneProg.byType[typeKey] || 0);
    const BASE = 0.05;
    const CAP = 0.4;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
  };

  if (subView === 'phoneGames') {
    const phoneUsed = gameState.phoneGamesThisAge || 0;
    const phoneRemaining = Math.max(0, 5 - phoneUsed);
    const puzzleBonus = computeNextPhoneBonus('puzzle');
    const learningBonus = computeNextPhoneBonus('learning');
    const appLimitsUsedThisAge = gameState.yearFlags?.appLimitsUsedAtAge === gameState.currentYear;
    const currentDebt = gameState.phoneGamesConfidenceDebt || 0;

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">📱 Phone Games</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick your escape (max 5/age)</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress</div>
                    <div className="text-slate-600">Doomscroll: {phoneProg.byType.doomscroll} | Puzzle: {phoneProg.byType.puzzle} | Learning: {phoneProg.byType.learning}</div>
                    <div className={`font-semibold ${phoneRemaining > 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                      Phone uses this age: {phoneUsed}/5 ({phoneRemaining} remaining)
                    </div>
                    <div className="text-amber-600">Confidence debt: {currentDebt}</div>
                    {phoneProg.streak > 0 && phoneProg.lastType && (
                      <div className="text-indigo-600">
                        Current streak: {phoneProg.streak}× {phoneProg.lastType === 'doomscroll' ? 'Doomscroll 🌀' : phoneProg.lastType === 'puzzle' ? 'Puzzle 🧩' : 'Learning 📖'} in a row
                      </div>
                    )}
                    {phoneProg.unlocks.appLimits && (
                      <div className="text-amber-600 font-semibold">✅ Unlocked: Set App Limits 🔒</div>
                    )}
                  </div>

                  {phoneRemaining <= 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      You've already used your phone 5 times this year.
                    </div>
                  )}

                  <button
                    onClick={() => performPhoneType('doomscroll')}
                    disabled={!canUse || phoneRemaining <= 0}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-red-400 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌀</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Doomscroll</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Kid ANXIETY +0.2 • Confidence debt +2
                        </div>
                        <div className="text-xs text-slate-500">
                          Doomscroll count: {phoneProg.byType.doomscroll}
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performPhoneType('puzzle')}
                    disabled={!canUse || phoneRemaining <= 0}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🧩</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Puzzle Game</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -1 • Kid INT {formatSmallDelta(puzzleBonus)} • Confidence debt +1
                        </div>
                        <div className="text-xs text-slate-500">
                          Puzzle count: {phoneProg.byType.puzzle} • Streak: {phoneProg.lastType === 'puzzle' ? phoneProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performPhoneType('learning')}
                    disabled={!canUse || phoneRemaining <= 0}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📖</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Learning App</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -1 • Kid CUR {formatSmallDelta(learningBonus)} • Confidence debt {currentDebt > 0 ? '-1' : '+0'}
                        </div>
                        <div className="text-xs text-slate-500">
                          Learning count: {phoneProg.byType.learning}
                        </div>
                      </div>
                    </div>
                  </button>

                  {phoneProg.unlocks.appLimits && (
                    <button
                      onClick={handleAppLimits}
                      disabled={!canUse || appLimitsUsedThisAge}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        appLimitsUsedThisAge
                          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                          : 'border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🔒</span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 mb-1">Set App Limits (Unlocked)</div>
                          <div className="text-xs text-slate-600 mb-2">
                            STRESS -1 • Once per age
                          </div>
                          <div className="text-xs text-slate-600">
                            Kid: DISCIPLINE +0.6 • ANXIETY -0.6 • Confidence debt -2
                          </div>
                          {appLimitsUsedThisAge && (
                            <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                          )}
                        </div>
                      </div>
                    </button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (subView === 'sleep') {
    const screenFreeBonus = computeNextSleepBonus('screenFree');
    const routineBonus = computeNextSleepBonus('routine');
    const earlyBonus = computeNextSleepBonus('early');
    const sleepResetUsedThisAge = gameState.yearFlags?.sleepResetUsedAtAge === gameState.currentYear;

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">🛌 Protect Sleep</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick your sleep protection style</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress</div>
                    <div className="text-slate-600">Screen-Free: {sleepProg.byType.screenFree} | Routine: {sleepProg.byType.routine} | Early: {sleepProg.byType.early}</div>
                    {sleepProg.streak > 0 && sleepProg.lastType && (
                      <div className="text-indigo-600">
                        Current streak: {sleepProg.streak}× {sleepProg.lastType === 'screenFree' ? 'Screen-Free 📵' : sleepProg.lastType === 'routine' ? 'Routine 📚' : 'Early ⏰'} in a row
                      </div>
                    )}
                    {sleepProg.unlocks.sleepReset && (
                      <div className="text-amber-600 font-semibold">✅ Unlocked: Sleep Reset Weekend 🛌</div>
                    )}
                  </div>

                  <button
                    onClick={() => performSleepType('screenFree')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📵</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Screen-Free Evening</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {gameState.stress > 2 ? 'STRESS -3' : 'Prevention mode'} • Kid DIS +1 {formatSmallDelta(screenFreeBonus)} • ANX {formatSmallDelta(-Math.min(0.5, screenFreeBonus))}
                        </div>
                        <div className="text-xs text-slate-500">
                          Count: {sleepProg.byType.screenFree} • Streak: {sleepProg.lastType === 'screenFree' ? sleepProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performSleepType('routine')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">📚</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Bedtime Routine</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {gameState.stress > 2 ? 'STRESS -2' : 'Prevention mode'} • Kid DIS +1 • RESPONSIBILITY {formatSmallDelta(routineBonus)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Count: {sleepProg.byType.routine} • Streak: {sleepProg.lastType === 'routine' ? sleepProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performSleepType('early')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">⏰</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Earlier Bedtime</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {gameState.stress > 2 ? 'STRESS -2' : 'Prevention mode'} • Kid DIS +1 • HEALTH {formatSmallDelta(earlyBonus)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Count: {sleepProg.byType.early}
                        </div>
                      </div>
                    </div>
                  </button>

                  {sleepProg.unlocks.sleepReset && (
                    <button
                      onClick={handleSleepReset}
                      disabled={!canUse || sleepResetUsedThisAge}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        sleepResetUsedThisAge
                          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                          : 'border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🛌</span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 mb-1">Sleep Reset Weekend (Unlocked)</div>
                          <div className="text-xs text-slate-600 mb-2">
                            STRESS -7 • LOVE +1 • Once per age
                          </div>
                          <div className="text-xs text-slate-600">
                            Kid: DISCIPLINE +1 • ANXIETY -1 • HEALTH +1
                          </div>
                          {sleepResetUsedThisAge && (
                            <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                          )}
                        </div>
                      </div>
                    </button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (subView === 'miniBreak') {
    const walkBonus = computeNextMiniBreakBonus('walk');
    const breathBonus = computeNextMiniBreakBonus('breath');
    const callBonus = computeNextMiniBreakBonus('call');
    const microRetreatUsedThisAge = gameState.yearFlags?.miniRetreatUsedAtAge === gameState.currentYear;

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">🚶 Mini Break</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick your reset type</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress</div>
                    <div className="text-slate-600">Walk: {miniBreakProg.byType.walk} | Breathwork: {miniBreakProg.byType.breath} | Call: {miniBreakProg.byType.call}</div>
                    {miniBreakProg.streak > 0 && miniBreakProg.lastType && (
                      <div className="text-indigo-600">
                        Current streak: {miniBreakProg.streak}× {miniBreakProg.lastType === 'walk' ? 'Walk 🚶' : miniBreakProg.lastType === 'breath' ? 'Breathwork 🫁' : 'Call ☎️'} in a row
                      </div>
                    )}
                    {miniBreakProg.unlocks.microRetreat && (
                      <div className="text-amber-600 font-semibold">✅ Unlocked: Micro Retreat 🧘</div>
                    )}
                  </div>

                  <button
                    onClick={() => performMiniBreakType('walk')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🚶</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Walk Outside</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {gameState.stress > 2 ? 'STRESS -2 • LOVE +1' : 'Prevention mode'} • Kid CONFIDENCE {formatSmallDelta(walkBonus)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Walk count: {miniBreakProg.byType.walk} • Streak: {miniBreakProg.lastType === 'walk' ? miniBreakProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performMiniBreakType('breath')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🫁</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Breathwork (2-5 min)</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {gameState.stress > 2 ? 'STRESS -3' : 'Prevention mode'} • Kid EMPATHY {formatSmallDelta(breathBonus)} • ANX {formatSmallDelta(-Math.min(0.4, breathBonus))}
                        </div>
                        <div className="text-xs text-slate-500">
                          Breath count: {miniBreakProg.byType.breath} • Streak: {miniBreakProg.lastType === 'breath' ? miniBreakProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performMiniBreakType('call')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">☎️</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Call a Friend</div>
                        <div className="text-xs text-slate-600 mb-2">
                          {gameState.stress > 2 ? 'STRESS -2 • LOVE +1' : 'Prevention mode'} • Kid SOCIAL {formatSmallDelta(callBonus)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Call count: {miniBreakProg.byType.call}
                        </div>
                      </div>
                    </div>
                  </button>

                  {miniBreakProg.unlocks.microRetreat && (
                    <button
                      onClick={handleMicroRetreat}
                      disabled={!canUse || microRetreatUsedThisAge}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        microRetreatUsedThisAge
                          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                          : 'border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🧘</span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 mb-1">Micro Retreat (Unlocked)</div>
                          <div className="text-xs text-slate-600 mb-2">
                            STRESS -6 • LOVE +1 • Once per age
                          </div>
                          <div className="text-xs text-slate-600">
                            Kid: EMPATHY +0.6 • CONFIDENCE +0.6 • ANXIETY -0.6
                          </div>
                          {microRetreatUsedThisAge && (
                            <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                          )}
                        </div>
                      </div>
                    </button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (subView === 'gardening') {
    const computeMastery = (count) => Math.min(1, 0.1 * Math.pow(2, count - 1));
    const vegMastery = computeMastery(vegCount);
    const flowerMastery = computeMastery(flowerCount);
    const bonsaiMastery = computeMastery(bonsaiCount);

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">🌱 Gardening</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick your gardening session</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress & Mastery</div>
                    <div className="text-slate-600">Veg: {vegCount} ({(vegMastery*100).toFixed(0)}%) • Flowers: {flowerCount} ({(flowerMastery*100).toFixed(0)}%) • Bonsai: {bonsaiCount} ({(bonsaiMastery*100).toFixed(0)}%)</div>
                    <div className="text-slate-600">Total: {totalGarden}</div>
                    {harvestDinnerUnlocked && (
                      <div className="text-amber-600 font-semibold">✅ Unlocked: Harvest Dinner 🍲</div>
                    )}
                  </div>

                  <button
                    onClick={() => performGardeningType('veg')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🥕</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Vegetable Patch</div>
                        <div className="text-xs text-slate-600 mb-1">
                          Health {formatSmallDelta(1.0 + vegMastery*0.5)} • Stress {formatSmallDelta(-(1.0 + vegMastery*0.5))} • Kid DIS {formatSmallDelta(vegMastery*0.8)}
                        </div>
                        <div className="text-xs text-slate-500">Count: {vegCount} • Mastery: {(vegMastery*100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performGardeningType('flower')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-pink-400 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌸</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Flowers</div>
                        <div className="text-xs text-slate-600 mb-1">
                          Health {formatSmallDelta(0.8 + flowerMastery*0.4)} • Stress {formatSmallDelta(-(1.2 + flowerMastery*0.6))} • Kid EMP {formatSmallDelta(flowerMastery*0.8)}
                        </div>
                        <div className="text-xs text-slate-500">Count: {flowerCount} • Mastery: {(flowerMastery*100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performGardeningType('bonsai')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-teal-400 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌿</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Bonsai / Indoor Plants</div>
                        <div className="text-xs text-slate-600 mb-1">
                          Health {formatSmallDelta(0.9 + bonsaiMastery*0.4)} • Stress {formatSmallDelta(-(1.0 + bonsaiMastery*0.7))} • Kid DIS {formatSmallDelta(bonsaiMastery*0.5)} CON {formatSmallDelta(bonsaiMastery*0.3)}
                        </div>
                        <div className="text-xs text-slate-500">Count: {bonsaiCount} • Mastery: {(bonsaiMastery*100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </button>

                  {harvestDinnerUnlocked && (
                    <button
                      onClick={handleHarvestDinner}
                      disabled={!canUse}
                      className="w-full p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 transition-all text-left hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🍲</span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 mb-1">Harvest Dinner (Unlocked)</div>
                          <div className="text-xs text-slate-600 mb-1">
                            STRESS -1.0 • HEALTH +1.0 • LOVE +1.0
                          </div>
                          <div className="text-xs text-slate-600">
                            Kid: EMPATHY +0.3 • DISCIPLINE +0.3
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (subView === 'toolkit') {
    const twoChoicesUsedThisAge = gameState.yearFlags?.toolkitTwoChoicesUsedAtAge === gameState.currentYear;
    const repairUsedThisAge = gameState.yearFlags?.toolkitRepairUsedAtAge === gameState.currentYear;

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">🧰 Parent Coach Toolkit</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Advanced tools (once per age each)</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800">
                    These tools were unlocked by completing masterclass tracks. Use them wisely.
                  </div>

                  <button
                    onClick={handleToolkitTwoChoices}
                    disabled={!canUse || twoChoicesUsedThisAge}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      twoChoicesUsedThisAge
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-blue-300 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🔀</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Two Good Choices</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Once per age
                        </div>
                        <div className="text-xs text-slate-600">
                          Kid: CONFIDENCE +0.6 • DISCIPLINE +0.4
                        </div>
                        {twoChoicesUsedThisAge && (
                          <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleToolkitRepair}
                    disabled={!canUse || repairUsedThisAge}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      repairUsedThisAge
                        ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'border-purple-300 bg-purple-50/50 hover:border-purple-400 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🔄</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Repair Attempt</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -1 • LOVE +2 • Once per age
                        </div>
                        <div className="text-xs text-slate-600">
                          Kid: EMPATHY +0.6
                        </div>
                        {repairUsedThisAge && (
                          <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                        )}
                      </div>
                    </div>
                  </button>

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  const performGossipType = (gossipType) => {
    const gossip = gameState.parentStrategyProgress?.gossip || { total: 0, byType: { vent: 0, rumor: 0, listen: 0 }, lastType: null, streak: 0 };
    const typeKey = gossipType;
    const typeLabel = gossipType === 'vent' ? 'Vent Privately' : gossipType === 'rumor' ? 'Spread a Rumor' : 'Listen + Nod';
    const typeEmoji = gossipType === 'vent' ? '😮‍💨' : gossipType === 'rumor' ? '🧨' : '👂';

    if (!spendFocus(1, `Gossip: ${typeLabel}`)) return;

    const prevCount = Number(gossip.byType[typeKey] || 0);
    
    let stressDelta = 0;
    let childDeltas = {};
    let repDelta = 0;

    if (gossipType === 'vent') {
      stressDelta = -2;
      childDeltas = { empathy: 0.2 };
      repDelta = 0;
    } else if (gossipType === 'rumor') {
      stressDelta = -2;
      childDeltas = { confidence: -0.2 };
      repDelta = -2;
    } else {
      stressDelta = -1;
      childDeltas = { empathy: 0.1 };
      repDelta = -1;
    }

    applyStress(stressDelta);
    applyDeltas(childDeltas, `Gossip: ${typeLabel}`);

    const newRep = Number(gameState.peerReputation ?? 0) + repDelta;
    updateState({ peerReputation: newRep });

    const newTotal = gossip.total + 1;
    const newVent = gossipType === 'vent' ? prevCount + 1 : gossip.byType.vent;
    const newRumor = gossipType === 'rumor' ? prevCount + 1 : gossip.byType.rumor;
    const newListen = gossipType === 'listen' ? prevCount + 1 : gossip.byType.listen;
    const newStreak = (gossip.lastType === typeKey) ? gossip.streak + 1 : 1;
    const newLastType = typeKey;

    updateState(prev => ({
      parentStrategyProgress: {
        ...(prev.parentStrategyProgress || {}),
        gossip: {
          total: newTotal,
          byType: { vent: newVent, rumor: newRumor, listen: newListen },
          lastType: newLastType,
          streak: newStreak
        }
      },
      rumorCount: gossipType === 'rumor' ? (Number(prev.rumorCount || 0) + 1) : prev.rumorCount
    }));

    // Check for gossip fallout
    if (newRep <= -5 && !gameState.gossipPenaltyMinus5Applied) {
      applyDeltas({ confidence: -1 }, "Gossip fallout");
      updateState({
        gossipPenaltyMinus5Applied: true,
        playdatesDisabledByGossip: true
      });
      addLog("🚫 Gossip backfires. Your reputation tanks. Playdates are no longer possible.");
    }

    if (newRep <= -10 && !gameState.gossipPenaltyMinus10Applied) {
      applyDeltas({ confidence: -2 }, "Severe gossip fallout");
      updateState({ gossipPenaltyMinus10Applied: true });
      addLog("💔 The damage becomes lasting. Confidence -2.");
    }

    addLog(`${typeEmoji} ${typeLabel} complete.`);

    const bodyText = gossipType === 'vent'
      ? `You vent privately to a safe friend. Release without damage.\n\nStress -2\nChild: EMPATHY +0.2\nReputation: no change`
      : gossipType === 'rumor'
        ? `You spread a rumor. Short-term relief, long-term damage.\n\nStress -2\nChild: CONFIDENCE -0.2\nReputation -2 (now: ${newRep})`
        : `You listen and nod without fueling drama.\n\nStress -1\nChild: EMPATHY +0.1\nReputation -1 (now: ${newRep})`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ["strategy", "gossip"],
      meta: { emoji: typeEmoji }
    });

    recordTimelineEntry({
      kind: 'strategy',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Gossip session #${newTotal}. Reputation: ${newRep}`,
      deltas: childDeltas,
      stressDelta,
      loveDelta: 0,
      moneyDelta: 0,
      meta: { gossipType, gossipTotal: newTotal, reputation: newRep }
    });

    setSubView('main');
    onClose();
  };

  if (subView === 'gossip') {
    const currentRep = Number(gameState.peerReputation ?? 0);
    const rumorCount = Number(gameState.rumorCount || 0);

    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[100]"
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">🗣️ Gossip</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick your approach</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress</div>
                    <div className="text-slate-600">Vent: {gossipProg.byType.vent} | Rumor: {gossipProg.byType.rumor} | Listen: {gossipProg.byType.listen}</div>
                    <div className={`font-semibold ${currentRep >= 0 ? 'text-green-600' : currentRep > -5 ? 'text-amber-600' : 'text-red-600'}`}>
                      Peer reputation: {currentRep}
                    </div>
                    {rumorCount > 0 && (
                      <div className="text-red-600">Rumor count: {rumorCount}</div>
                    )}
                    {gossipProg.streak > 0 && gossipProg.lastType && (
                      <div className="text-indigo-600">
                        Current streak: {gossipProg.streak}× {gossipProg.lastType === 'vent' ? 'Vent 😮‍💨' : gossipProg.lastType === 'rumor' ? 'Rumor 🧨' : 'Listen 👂'} in a row
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => performGossipType('vent')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">😮‍💨</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Vent Privately</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Reputation 0 (no change) • Kid EMP +0.2
                        </div>
                        <div className="text-xs text-slate-500">
                          Vent count: {gossipProg.byType.vent} • Streak: {gossipProg.lastType === 'vent' ? gossipProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performGossipType('rumor')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-red-400 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🧨</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Spread a Rumor</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Reputation -2 • Kid CONF -0.2
                        </div>
                        <div className="text-xs text-red-600 mb-1 font-semibold">
                          ⚠️ Risk: Playdates disable at reputation ≤ -5 (current: {currentRep})
                        </div>
                        <div className="text-xs text-slate-500">
                          Rumor count: {gossipProg.byType.rumor}
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performGossipType('listen')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">👂</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Listen + Nod</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -1 • Reputation -1 • Kid EMP +0.1
                        </div>
                        <div className="text-xs text-slate-500">
                          Listen count: {gossipProg.byType.listen}
                        </div>
                      </div>
                    </div>
                  </button>

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (subView === 'gym') {
    const nextTotal = gymProg.totalSessions + 1;
    const computeNextDisc = () => {
      const raw = 0.1 * Math.pow(2, nextTotal - 1);
      return Math.round(Math.min(1.0, raw) * 10) / 10;
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
              onClick={() => safeCall(onClose)}
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
                    <h3 className="text-xl font-bold text-slate-800">🏋️ Gym Session</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pick today's workout</p>
                  </div>
                  <button
                    onClick={() => safeCall(onClose)}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="font-semibold text-slate-700">Progress</div>
                    <div className="text-slate-600">Total gym sessions: {gymProg.totalSessions}</div>
                    <div className="text-slate-600">Next discipline bonus: +{computeNextDisc().toFixed(1)}</div>
                    {gymProg.streak > 0 && gymProg.lastType && (
                      <div className="text-indigo-600">
                        Current streak: {gymProg.streak}× {gymProg.lastType === 'cardio' ? 'Cardio 🏃' : gymProg.lastType === 'upper' ? 'Upper Body 💪' : 'Leg Day 🦵'} in a row
                      </div>
                    )}
                    <div className="text-slate-600">Marathon unlock: {gymProg.cardio}/5 cardio</div>
                  </div>

                  <button
                    onClick={() => performGymWorkout('cardio')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🏃</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Cardio Day</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Health +1.5 • Kid DISC +{computeNextDisc().toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Cardio: {Math.min(gymProg.cardio || 0, 5)}/5 • Streak: {gymProg.lastType === 'cardio' ? gymProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performGymWorkout('upper')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">💪</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Upper Body Day</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Health +1.5 • Kid DISC +{computeNextDisc().toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Upper: {Math.min(gymProg.upper || 0, 5)}/5 • Streak: {gymProg.lastType === 'upper' ? gymProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => performGymWorkout('legs')}
                    disabled={!canUse}
                    className="w-full p-4 rounded-xl border-2 transition-all text-left hover:border-green-400 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed border-slate-200 bg-white"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🦵</span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">Leg Day</div>
                        <div className="text-xs text-slate-600 mb-2">
                          STRESS -2 • Health +1.5 • Kid DISC +{computeNextDisc().toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Legs: {Math.min(gymProg.legs || 0, 5)}/5 • Streak: {gymProg.lastType === 'legs' ? gymProg.streak : 0}/5
                        </div>
                      </div>
                    </div>
                  </button>

                  <Button
                    variant="outline"
                    onClick={() => setSubView('main')}
                    className="w-full"
                  >
                    Back
                  </Button>
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
            onClick={() => safeCall(onClose)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🧘 Health Strategies</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Focus: {actionPoints}/{maxFocusTokens}
                  </p>
                </div>
                <button
                  onClick={() => safeCall(onClose)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-3">
                <p className="text-sm text-slate-600 mb-4">
                  Intentional moves that cost 1 Focus. Use before parenting gets messy.
                </p>

                {strategies.map((strategy, idx) => (
                  <div key={idx}>
                    <button
                      onClick={strategy.onClick}
                      disabled={!strategy.avail.enabled}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        !strategy.avail.enabled
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{strategy.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-0.5">{strategy.title}</div>
                          <div className="text-xs text-slate-600">{strategy.subtitle}</div>
                        </div>
                      </div>
                    </button>
                    {!strategy.avail.enabled && strategy.avail.reasonText && (
                      <div className="text-xs text-red-500 mt-1 ml-11">
                        Locked: {strategy.avail.reasonText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}