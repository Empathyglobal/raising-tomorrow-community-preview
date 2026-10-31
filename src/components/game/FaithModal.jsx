import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatSmallDelta, toRealBool, createSeededRng, getActionBeneficiary } from "@/components/game/GameStateContext.jsx";
import { toast } from 'sonner';
import ValuesConversationModal from './ValuesConversationModal';
import { FAMILY_VALUES_CATALOG } from './faithValuesCatalog';

export default function FaithModal({ open, onClose }) {
  const { gameState, consumeAction, applyDeltas, applyStress, applyLove, addLog, recordTimelineEntry, updateState, emitActionResult, awardWisdomXP } = useGameState();
  const { finished, actionPoints, currentYear, runSeed, childName } = gameState;
  
  const benef = getActionBeneficiary(gameState);
  
  const [showSelector, setShowSelector] = React.useState(false);
  const [customInput, setCustomInput] = React.useState('');
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [valuesModalOpen, setValuesModalOpen] = React.useState(false);
  
  const scenarioPending = toRealBool(gameState.pendingScenario ?? gameState.scenarioPending);
  
  // Normalize faith object (migration from old 'religion' field)
  const faith = React.useMemo(() => {
    const f = gameState.faith || {};
    const defaultFaith = {
      tradition: f.tradition || gameState.religion || null,
      isCustom: Boolean(f.isCustom),
      status: f.status || (f.tradition || gameState.religion ? 'questioning' : 'none'),
      exposure: Number(f.exposure || 0),
      devotion: Number(f.devotion || 0),
      lastDecisionAge: f.lastDecisionAge ?? gameState.religionChosenAge ?? null,
      history: Array.isArray(f.history) ? f.history : []
    };
    return defaultFaith;
  }, [gameState.faith, gameState.religion, gameState.religionChosenAge]);

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

  const canUse = !finished && actionPoints >= 1;

  const religions = [
    { name: 'Christianity', emoji: '✝️' },
    { name: 'Islam', emoji: '☪️' },
    { name: 'Judaism', emoji: '✡️' },
    { name: 'Hinduism', emoji: '🕉️' },
    { name: 'Buddhism', emoji: '☸️' },
    { name: 'Sikhism', emoji: '☬' },
    { name: 'Spiritual (non-denominational)', emoji: '🌟' },
    { name: 'Secular mindfulness', emoji: '🧘' },
    { name: 'Other (Custom)', emoji: '✨' }
  ];

  const handleChooseFaith = (religionName) => {
    if (religionName === 'Other (Custom)') {
      setShowCustomInput(true);
      return;
    }
    
    const hadPrior = faith.tradition != null;
    const priorTradition = faith.tradition;
    
    updateState(prev => {
      const historyEntry = {
        age: currentYear,
        from: priorTradition,
        to: religionName,
        by: 'parent'
      };
      
      return {
        faith: {
          tradition: religionName,
          isCustom: false,
          status: 'questioning',
          exposure: prev.faith?.exposure || 0,
          devotion: prev.faith?.devotion || 0,
          lastDecisionAge: currentYear,
          refusedFromTradition: null,
          history: [...(prev.faith?.history || []), historyEntry]
        }
      };
    });

    addLog(`🙏 Faith chosen: ${religionName}`);
    
    recordTimelineEntry({
      kind: "faith",
      title: hadPrior ? "Faith Changed" : "Faith Chosen",
      detail: hadPrior ? `Changed from ${priorTradition} to ${religionName}` : `Chosen: ${religionName}`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
    
    setShowSelector(false);
    setShowCustomInput(false);
  };
  
  const handleCustomFaith = () => {
    const trimmed = customInput.trim();
    if (!trimmed || trimmed.length > 32) {
      toast.error('Please enter a faith name (max 32 characters)');
      return;
    }
    
    const hadPrior = faith.tradition != null;
    const priorTradition = faith.tradition;
    
    updateState(prev => {
      const historyEntry = {
        age: currentYear,
        from: priorTradition,
        to: trimmed,
        by: 'parent'
      };
      
      return {
        faith: {
          tradition: trimmed,
          isCustom: true,
          status: 'questioning',
          exposure: prev.faith?.exposure || 0,
          devotion: prev.faith?.devotion || 0,
          lastDecisionAge: currentYear,
          refusedFromTradition: null,
          history: [...(prev.faith?.history || []), historyEntry]
        }
      };
    });
    
    addLog(`🙏 Faith chosen: ${trimmed}`);
    
    recordTimelineEntry({
      kind: "faith",
      title: hadPrior ? "Faith Changed" : "Faith Chosen",
      detail: hadPrior ? `Changed from ${priorTradition} to ${trimmed}` : `Chosen: ${trimmed}`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
    
    setCustomInput('');
    setShowSelector(false);
    setShowCustomInput(false);
  };
  
  const handleChangeFaith = () => {
    if (faith.tradition) {
      const ok = window.confirm(`Change from ${faith.tradition}? This will replace your current faith.`);
      if (!ok) return;
    }
    setShowSelector(true);
  };
  
  const handleRemoveFaith = () => {
    const confirmText = benef.isChild
      ? `Remove ${faith.tradition}? Your child will be raised without a specific faith.`
      : `Remove ${faith.tradition}? You will no longer practice this faith.`;
    const ok = window.confirm(confirmText);
    if (!ok) return;
    
    const priorTradition = faith.tradition;
    
    updateState(prev => {
      const historyEntry = {
        age: currentYear,
        from: priorTradition,
        to: null,
        by: 'parent',
        note: 'Removed'
      };
      
      return {
        faith: {
          tradition: null,
          isCustom: false,
          status: 'none',
          exposure: prev.faith?.exposure || 0,
          devotion: prev.faith?.devotion || 0,
          lastDecisionAge: currentYear,
          history: [...(prev.faith?.history || []), historyEntry]
        }
      };
    });
    
    addLog(`🙏 Faith removed: ${priorTradition}`);
    
    recordTimelineEntry({
      kind: "faith",
      title: "Faith Removed",
      detail: `Removed: ${priorTradition}`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
  };

  const performFaithType = (faithType) => {
    const faithProg = gameState.faithProgress || { total: 0, byType: { service: 0, volunteer: 0, study: 0 }, lastType: null, streak: 0, unlocks: { retreat: false } };
    const typeKey = faithType === 'service' ? 'service' : faithType === 'volunteer' ? 'volunteer' : 'study';
    const typeLabel = faithType === 'service' ? 'Attend Service' : faithType === 'volunteer' ? 'Volunteer Through Community' : 'Study / Reflection';
    const typeEmoji = faithType === 'service' ? '🙏' : faithType === 'volunteer' ? '🤝' : '📖';

    const ok = consumeAction('faith');
    if (!ok) {
      toast('Not enough Focus.', { icon: '⚡' });
      return;
    }

    const prevCount = Number(faithProg.byType[typeKey] || 0);
    const BASE = faithType === 'service' ? 0.1 : 0.05;
    const CAP = faithType === 'service' ? 1.0 : 0.5;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    const roundedBonus = Math.round(bonus * 100) / 100;

    let childDeltas = {};
    let stressDelta = 0;

    if (faithType === 'service') {
      stressDelta = -3;
      childDeltas = { discipline: 1 + roundedBonus };
    } else if (faithType === 'volunteer') {
      stressDelta = -2;
      childDeltas = { empathy: 0.4 + roundedBonus, responsibility: 0.4 + roundedBonus };
    } else {
      stressDelta = -2;
      childDeltas = { intelligence: 0.4 + roundedBonus, empathy: 0.2 };
    }

    applyStress(stressDelta);
    applyDeltas(childDeltas, `Faith: ${typeLabel}`);
    if (awardWisdomXP) awardWisdomXP("compassion", 1, `Faith: ${typeLabel}`);
    
    // Update exposure/devotion
    const exposureDelta = faithType === 'service' ? 8 : faithType === 'volunteer' ? 10 : 6;
    const devotionDelta = faithType === 'service' ? 3 : faithType === 'volunteer' ? 4 : 5;
    
    updateState(prev => {
      const f = prev.faith || {};
      const newExposure = Math.max(0, Math.min(100, (f.exposure || 0) + exposureDelta));
      const newDevotion = Math.max(0, Math.min(100, (f.devotion || 0) + devotionDelta));
      
      return {
        faith: {
          ...f,
          exposure: newExposure,
          devotion: newDevotion
        }
      };
    });

    const newTotal = faithProg.total + 1;
    const newService = faithType === 'service' ? prevCount + 1 : faithProg.byType.service;
    const newVolunteer = faithType === 'volunteer' ? prevCount + 1 : faithProg.byType.volunteer;
    const newStudy = faithType === 'study' ? prevCount + 1 : faithProg.byType.study;
    const newStreak = (faithProg.lastType === typeKey) ? faithProg.streak + 1 : 1;
    const newLastType = typeKey;

    const retreatUnlocked = newStudy >= 5;

    updateState(prev => ({
      faithProgress: {
        total: newTotal,
        byType: { service: newService, volunteer: newVolunteer, study: newStudy },
        lastType: newLastType,
        streak: newStreak,
        unlocks: { retreat: retreatUnlocked }
      }
    }));

    if (newStreak === 5) {
      const trophyMap = { service: 'faith_service_streak_5', volunteer: 'faith_volunteer_streak_5', study: 'faith_study_streak_5' };
      const trophyNames = { service: 'Faithful', volunteer: 'Servant Heart', study: 'Quiet Scholar' };
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

    addLog(`${typeEmoji} ${typeLabel} complete. Faith practice #${newTotal}.`);

    const masteryText = faithType === 'service'
      ? `DISCIPLINE ${formatSmallDelta(1 + roundedBonus)}`
      : faithType === 'volunteer'
        ? `EMPATHY ${formatSmallDelta(0.4 + roundedBonus)} • RESPONSIBILITY ${formatSmallDelta(0.4 + roundedBonus)}`
        : `INTELLIGENCE ${formatSmallDelta(0.4 + roundedBonus)} • EMPATHY ${formatSmallDelta(0.2)}`;

    const bodyText = `You practice your faith through ${typeLabel.toLowerCase()}.\n\nStress ${stressDelta}\n${benef.label}: ${masteryText}\n\n${typeLabel} count: ${prevCount + 1}`;

    emitActionResult({
      title: `${typeEmoji} ${typeLabel}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: 0,
      stressDelta,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['care', 'faith'],
      meta: { emoji: typeEmoji, tradition: faith.tradition }
    });

    recordTimelineEntry({
      kind: 'faith',
      title: `${typeEmoji} ${typeLabel}`,
      detail: `Faith practice #${newTotal}. ${typeLabel}.`,
      deltas: childDeltas,
      stressDelta,
      loveDelta: 0,
      moneyDelta: 0,
      meta: { faithType, faithTotal: newTotal }
    });

    onClose();
  };

  const handleRetreat = () => {
    const usedThisAge = gameState.yearFlags?.faithRetreatUsedAtAge === gameState.currentYear;
    if (usedThisAge) {
      toast('Weekend Retreat already used this age.', { icon: '🕯️' });
      return;
    }

    const ok = consumeAction('faith');
    if (!ok) {
      toast('Not enough Focus.', { icon: '⚡' });
      return;
    }

    applyStress(-6);
    applyLove(1);
    applyDeltas({ empathy: 1, discipline: 1, anxiety: -0.8 }, "Weekend Retreat");

    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), faithRetreatUsedAtAge: prev.currentYear }
    }));

    const narrative = benef.isChild
      ? `You step away for a weekend retreat. Guided silence, slow mornings, space to breathe. ${benef.name} comes too.`
      : `You step away for a weekend retreat. Guided silence, slow mornings, space to breathe.`;

    const loveLine = benef.isChild ? 'Love +1 • ' : '';

    addLog(`🕯️ Weekend Retreat. Deep reset.${benef.isChild ? ` You and ${benef.name} both find stillness.` : ' You find stillness.'}`);

    emitActionResult({
      title: "🕯️ Weekend Retreat",
      body: `${narrative}\n\nStress -6${benef.isChild ? ' • Love +1' : ''}\n${benef.label}: EMPATHY +1 • DISCIPLINE +1 • ANXIETY -0.8`,
      deltas: { empathy: 1, discipline: 1, anxiety: -0.8 },
      loveDelta: benef.isChild ? 1 : 0,
      stressDelta: -6,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['care', 'faith', 'retreat'],
      meta: { emoji: '🕯️', tradition: faith.tradition }
    });

    recordTimelineEntry({
      kind: 'faith',
      title: '🕯️ Weekend Retreat',
      detail: 'A weekend of intentional stillness. Deep regulation for both of you.',
      deltas: { empathy: 1, discipline: 1, anxiety: -0.8 },
      stressDelta: -6,
      loveDelta: 1,
      moneyDelta: 0
    });

    onClose();
  };
  
  const handleValuesConversation = () => {
    const valConvo = gameState.faith?.valuesConversations || {};
    if (valConvo.usedThisYear) {
      toast('Values Conversation already used this year.', { icon: '💬' });
      return;
    }
    setValuesModalOpen(true);
  };
  
  const handleValuesConfirm = ({ values, tone }) => {
    const ok = consumeAction('faith');
    if (!ok) {
      toast('Not enough Focus.', { icon: '⚡' });
      return;
    }
    
    const valConvo = gameState.faith?.valuesConversations || { usedThisYear: false, totalCount: 0, lastAge: null };
    const totalCount = (valConvo.totalCount || 0) + 1;
    
    // Deterministic benefits with diminishing returns
    const rng = createSeededRng(`${runSeed}|values|${currentYear}|${values.join(',')}`);
    
    let empathyGain = 0.5 + rng.nextFloat() * 1.0;
    let loveGain = rng.nextFloat() < 0.5 ? (0.2 + rng.nextFloat() * 0.6) : 0;
    let disciplineGain = (values.includes('RESPONSIBILITY') || values.includes('RESPECT')) 
      ? (rng.nextFloat() < 0.4 ? (0.2 + rng.nextFloat() * 0.8) : 0) 
      : 0;
    let stressGain = (values.includes('GRATITUDE') || values.includes('PATIENCE'))
      ? (rng.nextFloat() < 0.4 ? -(0.2 + rng.nextFloat() * 0.8) : 0)
      : 0;
    
    // Diminishing returns (FIXED: correct order)
    if (totalCount > 16) {
      empathyGain *= 0.25;
      loveGain *= 0.25;
      disciplineGain *= 0.25;
      stressGain *= 0.25;
    } else if (totalCount > 8) {
      empathyGain *= 0.5;
      loveGain *= 0.5;
      disciplineGain *= 0.5;
      stressGain *= 0.5;
    }
    
    // Apply effects
    const childDeltas = { empathy: Math.round(empathyGain * 10) / 10 };
    if (disciplineGain > 0) childDeltas.discipline = Math.round(disciplineGain * 10) / 10;
    
    applyDeltas(childDeltas, 'Values Conversation');
    if (loveGain > 0) applyLove(loveGain, 'Values Conversation');
    if (stressGain !== 0) applyStress(stressGain, 'Values Conversation');
    
    const v1 = values[0];
    const v2 = values[1];
    const v1Label = FAMILY_VALUES_CATALOG.find(v => v.key === v1)?.label || v1;
    const v2Label = FAMILY_VALUES_CATALOG.find(v => v.key === v2)?.label || v2;
    
    const flavorBank = {
      warm: {
        '0-5': [
          `You tell a small story about ${v1Label} and ${v2Label}. ${childName} listens… mostly. Halfway through, they ask if the 'moral of the story' comes with snacks.`,
          `You weave ${v1Label} and ${v2Label} into a bedtime tale. ${childName} nods along, then asks if the hero can have a pet dragon.`,
          `You share a moment about ${v1Label} and ${v2Label}. ${childName} interrupts with a question about dinosaurs. You gently steer back. It sticks—kind of.`
        ],
        '6-10': [
          `You tell a story connecting ${v1Label} and ${v2Label} to real life. ${childName} listens, then shares their own example from school. It lands.`,
          `You frame ${v1Label} and ${v2Label} through a character they admire. ${childName} lights up—relatability is magic.`,
          `You talk about ${v1Label} and ${v2Label} while cooking together. The values stick better when hands are busy.`
        ],
        '11-14': [
          `You share a story about ${v1Label} and ${v2Label}. ${childName} rolls their eyes… but brings it up two days later unprompted.`,
          `You connect ${v1Label} and ${v2Label} to something they care about. ${childName} pretends not to be impressed. They totally are.`,
          `You tell a short story. ${childName} listens with skeptical respect. Later, you catch them using the same logic with a friend.`
        ],
        '15-18': [
          `You share a story about ${v1Label} and ${v2Label}. ${childName} debates you—thoughtfully. The conversation becomes real.`,
          `You talk through ${v1Label} and ${v2Label} like adults. ${childName} challenges some parts, agrees with others. Growth is messy.`,
          `You offer a story. ${childName} counters with their own take on ${v1Label} and ${v2Label}. You realize they're building their own philosophy.`
        ]
      },
      direct: {
        '0-5': [
          `You keep it simple: in this family, ${v1Label} and ${v2Label} aren't optional. ${childName} nods like a tiny manager approving policy updates.`,
          `You state it plainly: "${v1Label} and ${v2Label} matter here." ${childName} repeats it back, mispronouncing half the words. Still counts.`,
          `You say what you mean: we care about ${v1Label} and ${v2Label}. ${childName} asks 'why?' seventeen times. You answer sixteen.`
        ],
        '6-10': [
          `You lay it out: ${v1Label} and ${v2Label} are non-negotiable in this house. ${childName} nods seriously, like they're signing a contract.`,
          `You explain ${v1Label} and ${v2Label} without drama. ${childName} asks clarifying questions. You realize they're actually listening.`,
          `You keep it short: "${v1Label} and ${v2Label}—that's what we do here." ${childName} nods. The simplicity helps it stick.`
        ],
        '11-14': [
          `You state it plainly: ${v1Label} and ${v2Label} aren't optional. ${childName} sighs but doesn't argue. Progress.`,
          `You keep it direct: "${v1Label} and ${v2Label} are baseline expectations." ${childName} grumbles but complies.`,
          `You skip the sermon and just name it: ${v1Label} and ${v2Label} matter here. ${childName} hears you—even if they don't show it.`
        ],
        '15-18': [
          `You keep it real: ${v1Label} and ${v2Label} are the foundation. ${childName} challenges it—respectfully. You realize they're testing, not rejecting.`,
          `You lay out ${v1Label} and ${v2Label} as non-negotiables. ${childName} debates the definitions. The conversation is actually good.`,
          `You state it plainly. ${childName} debates you. You both learn something. That's the goal.`
        ]
      },
      example: {
        '0-5': [
          `Instead of lecturing, you model ${v1Label} and ${v2Label} in a small moment. ${childName} notices. They pretend they didn't. They totally did.`,
          `You show ${v1Label} and ${v2Label} instead of saying them. ${childName} copies you two days later. Modeling wins.`,
          `You practice ${v1Label} and ${v2Label} in real time. ${childName} watches closely. Seeds planted.`
        ],
        '6-10': [
          `You model ${v1Label} and ${v2Label} in a quiet moment. ${childName} watches, then tries it themselves later. Example beats lecture.`,
          `You demonstrate ${v1Label} and ${v2Label} without announcing it. ${childName} mirrors you within the week. Magic.`,
          `You live ${v1Label} and ${v2Label} out loud. ${childName} absorbs it like osmosis—no speech needed.`
        ],
        '11-14': [
          `You model ${v1Label} and ${v2Label} instead of preaching. ${childName} notices… and copies you in a surprising way.`,
          `You show ${v1Label} and ${v2Label} through action. ${childName} pretends not to care. Then they do exactly what you did.`,
          `You practice ${v1Label} and ${v2Label} in front of them. ${childName} learns by watching—even when they act like they're not.`
        ],
        '15-18': [
          `You model ${v1Label} and ${v2Label} in a real situation. ${childName} respects it more than any sermon you could give.`,
          `You live ${v1Label} and ${v2Label} out loud. ${childName} notices—and brings it up later as proof you actually mean it.`,
          `You demonstrate ${v1Label} and ${v2Label} through a choice you make. ${childName} sees it. Actions matter more than words now.`
        ]
      }
    };
    
    const childAgeBracket = currentYear <= 5 ? '0-5' : currentYear <= 10 ? '6-10' : currentYear <= 14 ? '11-14' : '15-18';
    const pool = flavorBank[tone][childAgeBracket] || flavorBank.warm['6-10'];
    const flavorText = rng.pick(pool);
    
    // Update state
    updateState(prev => ({
      faith: {
        ...(prev.faith || {}),
        values,
        valuesConversations: {
          usedThisYear: true,
          totalCount,
          lastAge: currentYear
        }
      }
    }));
    
    const valuesText = `${v1Label} + ${v2Label}`;
    
    addLog(`💬 Values Conversation: ${valuesText}`);
    
    const deltaText = Object.entries(childDeltas).map(([k, v]) => `${k.toUpperCase().slice(0,3)} ${formatSmallDelta(v)}`).join(' • ');
    const bodyText = `${flavorText}\n\n${deltaText}${loveGain > 0 ? ` • LOVE ${formatSmallDelta(loveGain)}` : ''}${stressGain !== 0 ? ` • STRESS ${formatSmallDelta(stressGain)}` : ''}\n\nConversation #${totalCount}`;
    
    emitActionResult({
      title: `💬 Values: ${valuesText}`,
      body: bodyText,
      deltas: childDeltas,
      loveDelta: loveGain,
      stressDelta: stressGain,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['care', 'faith', 'values'],
      meta: { emoji: '💬', values, tone, tradition: faith.tradition }
    });
    
    recordTimelineEntry({
      kind: 'faith',
      title: `💬 Values Conversation: ${valuesText}`,
      detail: flavorText,
      deltas: childDeltas,
      stressDelta: stressGain,
      loveDelta: loveGain,
      moneyDelta: 0,
      meta: { values, tone, count: totalCount }
    });
    
    setValuesModalOpen(false);
    onClose();
  };

  const computeNextBonus = (typeKey) => {
    const faithProg = gameState.faithProgress || { total: 0, byType: { service: 0, volunteer: 0, study: 0 }, lastType: null, streak: 0, unlocks: { retreat: false } };
    const prevCount = Number(faithProg.byType[typeKey] || 0);
    const BASE = typeKey === 'service' ? 0.1 : 0.05;
    const CAP = typeKey === 'service' ? 1.0 : 0.5;
    const bonus = Math.min(CAP, BASE * Math.pow(2, prevCount));
    return Math.round(bonus * 100) / 100;
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
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">Faith</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {!faith.tradition || showSelector ? (
                  // Faith selection
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 mb-4">
                      {faith.tradition ? 'Choose a new tradition:' : 'Choose a tradition (for role-play):'}
                    </p>
                    
                    {showCustomInput ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50">
                          <label className="text-sm font-semibold text-slate-800 mb-2 block">Enter your faith tradition:</label>
                          <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="e.g., Pastafarianism, Jedi, etc."
                            maxLength={32}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            autoFocus
                          />
                          <div className="text-xs text-slate-500 mt-2">{customInput.length}/32 characters</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowCustomInput(false);
                              setCustomInput('');
                            }}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleCustomFaith}
                            disabled={!customInput.trim()}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {religions.map((rel) => (
                          <button
                            key={rel.name}
                            onClick={() => handleChooseFaith(rel.name)}
                            className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all active:scale-[0.98]"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rel.emoji}</span>
                              <div className="font-semibold text-slate-800">{rel.name}</div>
                            </div>
                          </button>
                        ))}
                        
                        {faith.tradition && (
                          <button
                            onClick={() => setShowSelector(false)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  // Faith practices
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Your tradition:</p>
                          <div className="text-lg font-bold text-slate-800">{faith.tradition}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              faith.status === 'committed' ? 'bg-emerald-100 text-emerald-700' :
                              faith.status === 'questioning' ? 'bg-amber-100 text-amber-700' :
                              faith.status === 'not_practicing' ? 'bg-slate-100 text-slate-600' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {faith.status === 'committed' ? 'Committed' :
                               faith.status === 'questioning' ? 'Questioning' :
                               faith.status === 'not_practicing' ? 'Not Practicing' :
                               'Refused'}
                            </span>
                            {faith.isCustom && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Custom</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleChangeFaith}
                          className="flex-1 px-3 py-1.5 bg-white border border-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-50"
                        >
                          Change Faith
                        </button>
                        <button
                          onClick={handleRemoveFaith}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50"
                        >
                          Remove Faith
                        </button>
                      </div>
                    </div>
                    
                    {!canUse && (
                      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        {finished ? '✅ Year already completed.' : '⚡ Not enough Focus.'}
                      </div>
                    )}

                    {(() => {
                     const faithProg = gameState.faithProgress || { total: 0, byType: { service: 0, volunteer: 0, study: 0 }, lastType: null, streak: 0, unlocks: { retreat: false } };
                     const serviceBonus = computeNextBonus('service');
                     const volunteerBonus = computeNextBonus('volunteer');
                     const studyBonus = computeNextBonus('study');
                     const retreatUsedThisAge = gameState.yearFlags?.faithRetreatUsedAtAge === gameState.currentYear;

                      return (
                        <>
                          <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                            <div className="font-semibold text-slate-700">Progress</div>
                            <div className="text-slate-600">Service: {faithProg.byType.service} | Volunteer: {faithProg.byType.volunteer} | Study: {faithProg.byType.study}</div>
                            {faithProg.streak > 0 && faithProg.lastType && (
                              <div className="text-indigo-600">
                                Current streak: {faithProg.streak}× {faithProg.lastType === 'service' ? 'Service 🙏' : faithProg.lastType === 'volunteer' ? 'Volunteer 🤝' : 'Study 📖'} in a row
                              </div>
                            )}
                            {faithProg.unlocks.retreat && (
                              <div className="text-amber-600 font-semibold">✅ Unlocked: Weekend Retreat 🕯️</div>
                            )}

                            <div className="mt-2 pt-2 border-t border-slate-200 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Exposure</span>
                                <span className="font-mono text-slate-800">{Math.round(faith.exposure || 0)}/100</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Devotion</span>
                                <span className="font-mono text-slate-800">{Math.round(faith.devotion || 0)}/100</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => performFaithType('service')}
                            disabled={!canUse}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              !canUse
                                ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">🙏</span>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 mb-1">Attend Service</div>
                                <div className="text-xs text-slate-600 mb-2">
                                  STRESS -3 • {benef.short} DIS {formatSmallDelta(1 + serviceBonus)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Count: {faithProg.byType.service} • Streak: {faithProg.lastType === 'service' ? faithProg.streak : 0}/5
                                </div>
                                <div className="text-xs text-indigo-600 mt-1">
                                  +8 Exposure, +3 Devotion
                                </div>
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => performFaithType('volunteer')}
                            disabled={!canUse}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              !canUse
                                ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-green-400 hover:bg-green-50 active:scale-[0.98]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">🤝</span>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 mb-1">Volunteer Through Community</div>
                                <div className="text-xs text-slate-600 mb-2">
                                  STRESS -2 • {benef.short} EMP {formatSmallDelta(0.4 + volunteerBonus)} • RESPONSIBILITY {formatSmallDelta(0.4 + volunteerBonus)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Count: {faithProg.byType.volunteer} • Streak: {faithProg.lastType === 'volunteer' ? faithProg.streak : 0}/5
                                </div>
                                <div className="text-xs text-indigo-600 mt-1">
                                  +10 Exposure, +4 Devotion
                                </div>
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => performFaithType('study')}
                            disabled={!canUse}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              !canUse
                                ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50 active:scale-[0.98]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-3xl">📖</span>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 mb-1">Study / Reflection</div>
                                <div className="text-xs text-slate-600 mb-2">
                                  STRESS -2 • {benef.short} INT {formatSmallDelta(0.4 + studyBonus)} • EMP {formatSmallDelta(0.2)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Count: {faithProg.byType.study} • Streak: {faithProg.lastType === 'study' ? faithProg.streak : 0}/5
                                </div>
                                <div className="text-xs text-indigo-600 mt-1">
                                  +6 Exposure, +5 Devotion
                                </div>
                              </div>
                            </div>
                          </button>

                          {faithProg.unlocks.retreat && (
                            <button
                              onClick={handleRetreat}
                              disabled={!canUse || retreatUsedThisAge}
                              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                retreatUsedThisAge
                                  ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                                  : 'border-amber-300 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-3xl">🕯️</span>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-800 mb-1">Weekend Retreat (Unlocked)</div>
                                  <div className="text-xs text-slate-600 mb-2">
                                    STRESS -6{benef.isChild ? ' • LOVE +1' : ''} • Once per age
                                  </div>
                                  <div className="text-xs text-slate-600">
                                    {benef.label}: EMPATHY +1 • DISCIPLINE +1 • ANXIETY -0.8
                                  </div>
                                  {retreatUsedThisAge && (
                                    <div className="text-xs text-amber-700 mt-1 font-semibold">Used this age</div>
                                  )}
                                </div>
                              </div>
                            </button>
                          )}

                          <button
                           onClick={handleValuesConversation}
                           disabled={!canUse || (gameState.faith?.valuesConversations?.usedThisYear)}
                           className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                             !canUse || (gameState.faith?.valuesConversations?.usedThisYear)
                               ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                               : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98]'
                           }`}
                          >
                           <div className="flex items-start gap-3">
                             <span className="text-3xl">💬</span>
                             <div className="flex-1">
                               <div className="font-bold text-slate-800 mb-1">Values Conversation</div>
                               <div className="text-xs text-slate-600 mb-2">
                                 Talk about what matters most in your family.
                               </div>
                               <div className="text-xs text-slate-500">
                                 Once per year • Focus: 1
                               </div>
                               {gameState.faith?.valuesConversations?.usedThisYear && (
                                 <div className="text-xs text-amber-700 mt-1 font-semibold">Used this year</div>
                               )}
                               {gameState.faith?.values?.length === 2 && (
                                 <div className="text-xs text-indigo-600 mt-1">
                                   Current: {gameState.faith.values.map(k => FAMILY_VALUES_CATALOG.find(v => v.key === k)?.label || k).join(', ')}
                                 </div>
                               )}
                             </div>
                           </div>
                          </button>
                          </>
                          );
                          })()}
                          </div>
                          )}
                          </div>
                          </div>
                          </motion.div>

                          <ValuesConversationModal
                          open={valuesModalOpen}
                          onClose={() => setValuesModalOpen(false)}
                          onConfirm={handleValuesConfirm}
                          childName={childName || 'your child'}
                          runSeed={runSeed}
                          currentYear={currentYear}
                          />
                          </>
                          )}
                          </AnimatePresence>
                          );
                          }