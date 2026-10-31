import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useGameState, formatMoney, createSeededRng } from './GameStateContext';
import { getTalkTopics, getCompliments } from './relationshipData';
import { COMEDY_SPEND_TIME_IDEAS, COMEDY_GIFTS } from './relationshipComedyPack';
import { ENGAGEMENT_RINGS, computeDivorceSettlement, computeNetWorthBreakdown } from './relationshipMarriageData';
import WeddingPlannerModal from './WeddingPlannerModal';
import SideDatingModal from './SideDatingModal';
import { useConfirm } from './ConfirmProvider';
import { generatePartnerWealth, getWealthVibeHint } from './relationshipWealthData';
import { getFamilyRelationshipModifier, rollFamilyTriggerMoment } from './traumaRelationshipEffects';
import { pickCulturalFirstName } from '@/components/game/culturalNamePicker';
import { 
  initializePersonStats,
  updatePersonStats,
  computeTrajectory,
  computeActiveScripts,
  FAMILY_SCRIPTS,
  TRAJECTORIES,
  checkSkillUnlocks,
  reduceScriptIntensity
} from './familyDynamics';
import { computeRandomPartnerCareer } from './jobSystem';
import { DATE_IDEAS, rollDateOutcome } from './datingDateNightData';
import { LOVE_LANGUAGES, generateLoveLanguageProfile, applyLoveLanguageToInteraction, getLoveLanguageClue } from './partnerLoveLanguagesData';
import { getRandomGrandkidStory } from './grandkidTimeData';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { shouldUseSpriteForRole, getSpriteMetaForPerson, computePersonAgeNumber } from '@/components/game/relationshipSpriteUtils';
import { getRoleLabel } from '@/components/game/kinshipLabels';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { isPersonDead, finalizePartnerSeparation } from '@/components/game/relationshipUtils';
import { createKid, makeKidId } from '@/components/game/siblingRivalry/kidModel';
import { ensureKidsContainer, persistActiveChildIntoKids } from '@/components/game/siblingRivalry/kidHelpers';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const GIFT_OPTIONS = [
  { id: 'small', label: 'Small Gift', emoji: '🎁', cost: 25, meterDelta: 4 },
  { id: 'medium', label: 'Medium Gift', emoji: '🎀', cost: 150, meterDelta: 10 },
  { id: 'expensive', label: 'Expensive Gift', emoji: '💎', cost: 500, meterDelta: 18 },
];

// A few lightweight "GPT-written" activity lines.
const ACTIVITY_LINES = {
  talk: [
    'You keep it real, but kind.',
    'You listen more than you speak, and it lands.',
    'You both laugh at something that probably isn\'t that funny.'
  ],
  spendTime: [
    'It\'s nothing fancy—just solid time together.',
    'Somehow, the day feels lighter afterward.',
    'You leave feeling more connected than before.'
  ],
  laugh: [
    'It starts as a dumb joke and turns into real belly-laughs.',
    'For ten minutes, the world is a little less heavy.',
    'You both remember you actually like each other.'
  ],
  coParentSync: [
    'You compare calendars, agree on one rule, and magically feel calmer.',
    'You make a plan that isn\'t perfect—just workable. That\'s a win.',
    'You divide the chaos into smaller pieces. It feels survivable.'
  ],
  affection: [
    'A long hug. A slower breath. The tension drops.',
    'You reconnect like it\'s a priority, not a leftover.',
    'You both soften, just a little—and it changes the whole night.'
  ],
  homeReset: [
    'You tackle one annoying task together and it weirdly feels romantic.',
    'The house isn\'t perfect, but it\'s less loud in your brain.',
    'You reset the space, then sit down like you earned it.'
  ],
  repair: [
    'You name what happened without making it a trial. You both unclench.',
    'You apologize without self-hating. They accept it without scoring points.',
    'You make a small agreement that actually sticks.'
  ],
  argue: [
    'Whether the dishwasher needs pre-rinsing.',
    'Which way the toilet paper should face.',
    'If socks belong balled or folded.',
    'Whether the fridge light truly turns off.',
    'If cereal is a soup.',
    'Whether pineapple belongs on pizza.',
    'If a hot dog is a sandwich.',
    'Whether to keep or toss the takeout soy sauce packets.',
    'If the thermostat should be touched by anyone but you.',
    'Whether the shower curtain should be open or closed after use.',
    'If the car should be backed into the driveway.',
    'Whether toothpaste should be squeezed from the middle or the end.',
    'If leftovers can be eaten past the mysterious smell threshold.',
    'Whether bedtime is a suggestion or a law.',
    'If weekend alarms are an act of war.',
    'Whether to clap when the plane lands.',
    'If the cutting board is for everything or just vegetables.',
    'Whether to rinse dishes before the dishwasher.',
    'If pillows are decorative or functional.',
    'Whether candles are for smell or vibe science.',
    'If sandals with socks are a crime.',
    'Whether the trash can counts as “basketball practice.”',
    'If the living room blanket is for humans or pets.',
    'Whether the laundry basket is a hamper or “pre-closet.”',
    'If the garage is actually storage or a parked car museum.',
    'Whether the junk drawer is curated chaos or nonsense.',
    'If charging cables can be “borrowed” forever.',
    'Whether the good scissors are for crafts or emergencies only.',
    'If expiration dates are law or guidance.',
    'Whether to measure pasta by feel or by math.',
    'If “five more minutes” means five real minutes.',
    'Whether the couch counts as a dining table during shows.',
    'If the spice rack is alphabetical or chaotic neutral.',
    'Whether to shake the ketchup bottle first.',
    'If the car’s low-fuel light is a challenge.',
    'Whether to preheat the oven for frozen pizza.',
    'If umbrellas are for rain or also for sun.',
    'Whether to double-knot shoelaces by default.',
    'If coffee is a food group.',
    'Whether the house shoes are indoor-only diplomacy.',
    'If the do-not-disturb sign is enforceable at home.',
    'Whether to scrape ice off the windshield or “let it vibe.”',
    'If the shopping list is a plan or a suggestion.',
    'Whether holiday decorations end at a reasonable hour.',
    'If leftovers should be labeled with dates.',
    'Whether to save glass jars “just in case.”',
    'If the door should be locked even when you are home.',
    'Whether to keep every manual for every appliance.',
    'If coasters are required for water glasses.',
    'Whether to keep the cardboard boxes “for returns.”',
    'If shoes belong by the door or in the closet immediately.',
    'Whether to do laundry on colors day or chaos mode.',
    'If the bed must be made every morning.',
    'Whether to refrigerate peanut butter.',
    'If the freezer is allowed to be a time capsule.',
    'Whether the vacuum lines on carpet are sacred.',
    'If dish towels are for hands or for plates only.',
    'Whether to keep a pen cup in every room.',
    'If the calendar lives on the fridge or on the cloud.',
    'Whether to use speakerphone in the kitchen.',
    'If bananas belong on the counter or in a hanger contraption.',
    'Whether to bring your own bags or collect a new mountain.',
    'If the broom vs vacuum debate is settled science.',
    'Whether to label leftovers or “live deliciously.”',
    'If water bottles may colonize the nightstand.',
    'Whether the porch light stays on all night.',
    'If the pantry should be organized by vibes or cuisine.',
    'Whether to run the dishwasher half-full.',
    'If you need three kinds of olive oil.',
    'Whether to set the table for tacos like a banquet.',
    'If the dog is allowed on the couch during movies.',
    'Whether to answer the door when no one is expected.',
    'If laundry should be folded immediately or “in shifts.”',
    'Whether to keep the ice maker on apocalypse mode.',
    'If the car trunk is storage or portable chaos.',
    'Whether to silence notifications after 9 pm.',
    'If the shower is for singing or for thinking only.',
    'Whether to keep the original TV box for “future moves.”',
    'If the mailbox must be checked daily.',
    'Whether to eat breakfast at the table on weekdays.',
    'If backpacks live on chairs or hooks.',
    'Whether to stack mail by category or height.',
    'If the family group chat needs strict rules.',
    'Whether to keep birthday cards forever.',
    'If kitchen timers are mandatory or “feel it with your soul.”',
    'Whether to scrape ice cream flat after scooping.',
    'If plants should have names.',
    'Whether to keep the AC at one sanctified number.',
    'If the bathroom fan should run exactly 12 minutes.',
    'Whether hoodies count as formal wear for errands.',
    'If the reusable straw cleaning brush is a myth.',
    'Whether to batch cook Sundays or wing it nightly.',
    'If the front-facing shampoo order matters.',
    'Whether the mat by the sink is decorative or a safety device.',
    'If the fruit bowl is art or a trap for gnats.',
    'Whether to stack Tupperware lids by size.',
    'If the doorbell camera is set to drama.',
    'Whether the good blanket must be folded with ceremony.',
    'If cereal goes first or milk goes first.',
    'Whether the garage remote belongs on the visor or in the cupholder.',
    'If the paper towels should tear precisely at the perforation.',
    'Whether to keep the good napkins hostage for guests.',
    'If bedtime reading lights need a treaty.',
    'Whether to keep the screen brightness at 100% or sanity.'
  ]
};

const pick = (list) => {
  // Ensure variety over time by rotating through options
  // Not persistent per person, but reduces immediate repeats within a session
  if (Array.isArray(list) && list.__lastIndex !== undefined) {
    const i = (list.__lastIndex + 1) % list.length;
    list.__lastIndex = i;
    return list[i];
  }

  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
};

export default function RelationshipProfileModal({ open, personId, onClose }) {
  const {
    gameState,
    spendFocus,
    applyMoneyDelta,
    applyStress,
    applyDeltas,
    updateState,
    addLog,
    emitActionResult,
    recordTimelineEntry,
  } = useGameState();

  const confirm = useConfirm();

  const { currentYear, love, childName } = gameState;

  const person = gameState.relationships?.byId?.[personId] || null;

  const [picker, setPicker] = useState(null); // 'dateNight' | 'gift' | 'propose' | 'wedding' | 'giveMoney' | null
  const [moneyGiftAmount, setMoneyGiftAmount] = useState(0);
  const [weddingPlannerOpen, setWeddingPlannerOpen] = useState(false);
  const [sideDatingOpen, setSideDatingOpen] = useState(false);
  const tryForBabyInFlightRef = useRef(false);
  const [tryForBabyBusy, setTryForBabyBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setPicker(null);
      setSideDatingOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (person?.role !== 'partner') return;

    const pr = gameState.partnerRelationship || {};
    const needsWealth = !pr.wealth || !Number.isFinite(pr.wealth.amount);
    const needsPrenup = !pr.prenup;
    const needsMF = !pr.marriageFinance;

    if (!needsWealth && !needsPrenup && !needsMF) return;

    const partnerAge = Number.isFinite(Number(person?.age)) ? Number(person.age) : (Number.isFinite(Number(person?.baseAge)) ? Number(person.baseAge) : 28);
    const income = Number(gameState.partnerCareer?.yearlyIncome) || 55000;

    const w = needsWealth
      ? generatePartnerWealth({
          seed: `${gameState.runSeed || 0}|partnerWealth|${person.name}|${partnerAge}`,
          age: partnerAge,
          estimatedIncome: income
        })
      : null;

    updateState({
      partnerRelationship: {
        ...pr,
        wealth: needsWealth
          ? {
              amount: w.amount,
              tierId: w.tierId,
              label: w.label,
              emoji: w.emoji,
              knownTier: true,
              knownAmount: pr.status === 'married'
            }
          : pr.wealth,
        prenup: needsPrenup
          ? { decided: false, asked: false, signed: false, refused: false, decidedAtAge: null }
          : pr.prenup,
        marriageFinance: needsMF
          ? { playerNetWorthAtMarriage: null, partnerWealthAtMarriage: null, mergedWealthAtAge: null }
          : pr.marriageFinance
      }
    });
  }, [open, person?.role, person?.name, person?.age, gameState.runSeed, gameState.partnerCareer?.yearlyIncome]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const scenarioBlocked = gameState.scenarioPending && !gameState.scenarioCompletedThisAge;

  const meter = useMemo(() => {
    if (!person) return 50;
    if (person.role === 'child') return clamp(Math.round((love ?? 0) * 10));
    return clamp(person.meter ?? 50);
  }, [person, love]);

  const groupedDateIdeas = useMemo(() => {
    const groups = {};
    for (const idea of DATE_IDEAS) {
      const key = idea.category || 'Date Ideas';
      if (!groups[key]) groups[key] = [];
      groups[key].push(idea);
    }
    return Object.entries(groups);
  }, []);

  const roleLabel = useMemo(() => {
    if (!person) return '';
    return getRoleLabel(person, gameState, { short: false });
  }, [person, gameState]);

  // Co-parent harmony bonus is checked at Age Up / age start.
  // Show it as a clear incentive while the player is on the Partner screen.
  const harmonyEligible = useMemo(() => {
    if (person?.role !== 'partner') return false;
    if (gameState.householdType !== 'two') return false;
    return meter >= 80;
  }, [person?.role, gameState.householdType, meter]);

  const baseAgeData = useMemo(() => {
    if (!person) return {};
    return person.interactionsByAge?.[currentYear] || {};
  }, [person, currentYear]);

  const usedActionsThisYear = useMemo(() => {
    // Back-compat: older saves might store `type` only (talk/compliment once per year).
    const legacy = baseAgeData?.type ? { [baseAgeData.type]: true } : {};
    return { ...legacy, ...(baseAgeData?.usedActions || {}) };
  }, [baseAgeData]);

  if (!open || !person) return null;

  // Guard: unknown identity parent - show info screen only
  const isUnknownIdentity = 
    person.identityStatus === 'unknown' || 
    person.identityStatus === 'sealed_until_18' ||
    (person.name && person.name.startsWith('Unknown'));

  if (isUnknownIdentity) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 z-[110]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">❓</div>
              <div className="text-xl font-bold text-slate-800 mb-2">{person.name}</div>
              <div className="text-sm text-slate-600 mb-4">{roleLabel}</div>
              <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                Identity is unknown. No interaction available at this time.
              </div>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const isDead = isPersonDead(person);

  const isMet = (person?.createdAtAge ?? 0) <= currentYear;

  const canUse = (actionId, focusCost = 1) => {
    if (scenarioBlocked) return { ok: false, reason: 'Finish the mandatory scenario first.' };
    if (!isMet) return { ok: false, reason: "You haven't met them yet." };
    if ((gameState.actionPoints ?? 0) < focusCost) return { ok: false, reason: 'Not enough focus.' };
    if (usedActionsThisYear?.[actionId]) return { ok: false, reason: 'Already did this this year.' };
    return { ok: true, reason: '' };
  };

  const updateRelationship = ({
    actionId,
    actionLabel,
    emoji,
    meterDelta = 0,
    stressDelta = 0,
    moneyDelta = 0,
    deltas = null,
    detail = '',
  }) => {
    const availability = canUse(actionId, 1);
    if (!availability.ok) return;

    const ok = spendFocus(1, `${actionLabel}: ${person.name}`);
    if (!ok) return;

    // Apply trauma modifiers for family members (including in-laws)
    let adjustedMeterDelta = meterDelta;
    let adjustedStressDelta = stressDelta;
    
    if (['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'].includes(person.role)) {
      const modifier = getFamilyRelationshipModifier(gameState, person.role);
      
      // Apply gain/loss multipliers
      if (meterDelta > 0) {
        adjustedMeterDelta = Math.max(1, Math.round(meterDelta * modifier.gainMult));
      } else if (meterDelta < 0) {
        adjustedMeterDelta = Math.round(meterDelta * modifier.lossMult);
      }
      
      // Add stress penalty
      adjustedStressDelta += modifier.stressAdd;
      
      // Roll for trigger moment
      const rngSeed = `${gameState.runSeed || 0}|famTrigger|${gameState.currentYear}|${person.id}|${actionId}`;
      const trigger = rollFamilyTriggerMoment({ gameState, person, actionId, rngSeed });
      
      if (trigger) {
        adjustedMeterDelta += trigger.meterDelta;
        adjustedStressDelta += trigger.stressDelta;
        
        // Store trigger in interaction data
        const ageData = person.interactionsByAge?.[currentYear] || {};
        person.interactionsByAge = {
          ...(person.interactionsByAge || {}),
          [currentYear]: {
            ...ageData,
            familyTrigger: { tag: trigger.tag, title: trigger.title }
          }
        };
      }
    }

    // Spouse love language system (partner-only, married-only)
    let adjustedMoneyDelta = moneyDelta;
    let adjustedDetail = detail;
    let partnerRelationshipPatch = null;
    let sidePartnerLoveLanguagesPatch = null;

    if (person.role === 'partner') {
      const pr2 = gameState.partnerRelationship || {};
      const ll = pr2.loveLanguages;

      if (pr2.status === 'married' && ll && ll.weights) {
        const llRes = applyLoveLanguageToInteraction({
          actionId,
          baseMeterDelta: adjustedMeterDelta,
          baseMoneyDelta: adjustedMoneyDelta,
          loveProfile: ll,
          partnerName: person.name
        });

        adjustedMeterDelta = llRes.meterDelta;
        adjustedMoneyDelta = llRes.moneyDelta;
        if (llRes.reactionLine) {
          adjustedDetail = `${detail}\n\n${llRes.reactionLine}`;
        }
        if (llRes.updatedProfile) {
          partnerRelationshipPatch = { ...pr2, loveLanguages: llRes.updatedProfile };
        }
      }
    } else if (person.role === 'side_partner') {
      const relEntry = gameState.relationships?.byId?.[person.id] || person;
      const ll = relEntry?.loveLanguages;

      if (ll && ll.weights) {
        const llRes = applyLoveLanguageToInteraction({
          actionId,
          baseMeterDelta: adjustedMeterDelta,
          baseMoneyDelta: adjustedMoneyDelta,
          loveProfile: ll,
          partnerName: person.name
        });

        adjustedMeterDelta = llRes.meterDelta;
        adjustedMoneyDelta = llRes.moneyDelta;
        if (llRes.reactionLine) adjustedDetail = `${detail}\n\n${llRes.reactionLine}`;
        if (llRes.updatedProfile) sidePartnerLoveLanguagesPatch = llRes.updatedProfile;
      }
    }

    if (adjustedMoneyDelta) {
      applyMoneyDelta(adjustedMoneyDelta, `${actionLabel} (${person.name})`);
    }
    if (adjustedStressDelta) {
      applyStress(adjustedStressDelta, `${actionLabel} (${person.name})`);
    }
    if (deltas) {
      applyDeltas(deltas, `${actionLabel} (${person.name})`);
    }

    const nextMeter = (person.role === 'child')
      ? meter
      : clamp((person.meter ?? 50) + adjustedMeterDelta);

    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      const ageData = p.interactionsByAge?.[currentYear] || {};
      const legacyUsed = ageData.type ? { [ageData.type]: true } : {};
      const usedActions = { ...legacyUsed, ...(ageData.usedActions || {}), [actionId]: true };

      const updatedPerson = {
        ...p,
        meter: p.role === 'child' ? p.meter : nextMeter,
        interactionsByAge: {
          ...(p.interactionsByAge || {}),
          [currentYear]: {
            ...ageData,
            didConnect: true,
            usedActions,
            lastActionId: actionId,
            lastText: adjustedDetail,
            type: actionId,
            detail: adjustedDetail,
          }
        }
      };

      if (sidePartnerLoveLanguagesPatch) {
        updatedPerson.loveLanguages = sidePartnerLoveLanguagesPatch;
      }

      return updatedPerson;
    });

    const nextById = Object.fromEntries(nextRoster.map(p => [p.id, p]));
    if (sidePartnerLoveLanguagesPatch) {
      nextById[person.id] = { ...nextById[person.id], loveLanguages: sidePartnerLoveLanguagesPatch };
    }

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: nextById
      },
      ...(person.id === 'partner' ? { partnerMeter: nextMeter } : {}),
      ...(partnerRelationshipPatch ? { partnerRelationship: partnerRelationshipPatch } : {})
    });

    const deltaSign = adjustedMeterDelta > 0 ? `+${adjustedMeterDelta}` : `${adjustedMeterDelta}`;
    const moneySpent = moneyDelta < 0 ? Math.abs(moneyDelta) : 0;
    const moneyLine = moneySpent ? ` • -$${moneySpent}` : '';
    const stressLine = adjustedStressDelta ? ` • Stress ${adjustedStressDelta > 0 ? '+' : ''}${adjustedStressDelta.toFixed(2)}` : '';

    addLog(
      `${emoji} ${actionLabel} with ${person.name} (${deltaSign} Relationship${moneyLine}${stressLine})`
    );

    recordTimelineEntry({
      kind: 'relationship',
      title: `${actionLabel}: ${person.name}`,
      detail: adjustedDetail || `${actionLabel} with ${person.name}.`,
      deltas: deltas || null,
      moneyDelta: moneyDelta || 0,
      stressDelta: adjustedStressDelta || 0,
    });

    // Check if trigger happened and build result body
    let resultBody = detail || `${actionLabel} with ${person.name}.`;
    if (['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'].includes(person.role)) {
      const modifier = getFamilyRelationshipModifier(gameState, person.role);
      const rngSeed = `${gameState.runSeed || 0}|famTrigger|${gameState.currentYear}|${person.id}|${actionId}`;
      const trigger = rollFamilyTriggerMoment({ gameState, person, actionId, rngSeed });
      
      if (trigger) {
        resultBody += `\n\n⚡ Trigger: ${trigger.title}\n${trigger.body}`;
        addLog(`⚡ ${trigger.title}: ${trigger.body}`);
      }
    }

    emitActionResult({
      title: `${emoji} ${actionLabel}`,
      subtitle: `${person.name} • ${roleLabel}`,
      body: adjustedDetail || resultBody,
      deltas: deltas || null,
      moneyDelta: moneyDelta || 0,
      stressDelta: adjustedStressDelta || 0,
      relationshipDelta: person.role === 'child' ? null : adjustedMeterDelta,
    });
  };

  const doTalk = () => {
    const topic = pick(getTalkTopics(person, currentYear)) || 'whatever is on your mind';
    const line = pick(ACTIVITY_LINES.talk) || 'You both feel heard.';
    const detail = `You talk about: "${topic}" ${line}`;

    // Small role flavor: teacher convos tilt discipline, kid's friend tilt empathy
    const deltas =
      person.role === 'teacher'
        ? { discipline: 0.1, intelligence: 0, empathy: 0, confidence: 0 }
        : person.role === 'best_friend'
          ? { empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }
          : null;

    updateRelationship({
      actionId: 'talk',
      actionLabel: 'Talk',
      emoji: '💬',
      meterDelta: 5,
      stressDelta: -0.05,
      deltas,
      detail,
    });
  };

  const doCompliment = () => {
    const compliment = pick(getCompliments(person)) || 'You really matter to me.';
    const detail = `You say: "${compliment}"`;

    const deltas =
      person.role === 'teacher'
        ? { discipline: 0.1, intelligence: 0, empathy: 0, confidence: 0 }
        : person.role === 'best_friend'
          ? { empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }
          : null;

    updateRelationship({
      actionId: 'compliment',
      actionLabel: 'Compliment',
      emoji: '🌟',
      meterDelta: 7,
      stressDelta: -0.05,
      deltas,
      detail,
    });
  };

  const doSpendTime = () => {
    const activity = pick(COMEDY_SPEND_TIME_IDEAS) || 'a weird little adventure';
    const detail = `You spend time together: ${activity}`;

    updateRelationship({
      actionId: 'spendTime',
      actionLabel: 'Spend Time',
      emoji: '⏳',
      meterDelta: 8,
      stressDelta: -0.1,
      detail,
    });
  };

  const doLaugh = () => {
    const line = pick(ACTIVITY_LINES.laugh) || 'You both laugh and feel closer.';
    const detail = `You laugh together—like, for real. ${line}`;

    updateRelationship({
      actionId: 'laugh',
      actionLabel: 'Laugh Together',
      emoji: '😂',
      meterDelta: 9,
      stressDelta: -0.2,
      detail,
    });
  };

  const doCoParentSync = () => {
    const line = pick(ACTIVITY_LINES.coParentSync) || 'You both feel more aligned.';
    const detail = `You do a co-parenting sync: schedules, rules, expectations. ${line}`;

    // Small, kid-facing benefit: aligned parents create steadier routines.
    const deltas = { discipline: 0.2, confidence: 0.1, intelligence: 0, empathy: 0 };

    updateRelationship({
      actionId: 'coParentSync',
      actionLabel: 'Co-parent Sync',
      emoji: '🗓️',
      meterDelta: 7,
      stressDelta: -0.05,
      deltas,
      detail,
    });
  };

  const doAffection = () => {
    const line = pick(ACTIVITY_LINES.affection) || 'You both feel steadier.';
    const detail = `You choose affection over autopilot. ${line}`;

    updateRelationship({
      actionId: 'affection',
      actionLabel: 'Affection',
      emoji: '💞',
      meterDelta: 11,
      stressDelta: -0.15,
      detail,
    });
  };

  const doHomeReset = () => {
    const line = pick(ACTIVITY_LINES.homeReset) || 'It feels a little calmer.';
    const detail = `You do a quick household reset together. ${line}`;

    // Tiny kid-facing benefit: calmer home = slightly easier routines.
    const deltas = { discipline: 0.1, confidence: 0.1, intelligence: 0, empathy: 0 };

    updateRelationship({
      actionId: 'homeReset',
      actionLabel: 'Household Reset',
      emoji: '🧺',
      meterDelta: 6,
      stressDelta: -0.1,
      deltas,
      detail,
    });
  };

  const doRepair = () => {
    const line = pick(ACTIVITY_LINES.repair) || 'You both feel repaired, not perfect.';
    const detail = `You repair the rupture instead of letting it rot. ${line}`;

    updateRelationship({
      actionId: 'repair',
      actionLabel: 'Repair',
      emoji: '🩹',
      meterDelta: 14,
      stressDelta: -0.1,
      detail,
    });
  };

  const doArgue = () => {
    const line = pick(ACTIVITY_LINES.argue) || "It's rough.";
    const detail = line;

    updateRelationship({
      actionId: 'argue',
      actionLabel: 'Argue',
      emoji: '🔥',
      meterDelta: -10,
      stressDelta: 0.15,
      detail,
    });
  };

  const doRepairTalk = () => {
    const detail = "You say the hard thing gently. It's awkward. It's also honest. You both feel heard.";
    
    // Family dynamics: update person stats
    const fd = gameState.familyDynamics || {};
    const personStats = updatePersonStats(gameState, person.id, { 
      trust: +5, 
      closeness: +8, 
      friction: -10 
    });
    
    // Reduce active script intensities
    const activeScripts = computeActiveScripts(gameState, person.role);
    activeScripts.scriptIds.forEach(scriptId => {
      reduceScriptIntensity(gameState, scriptId, 10);
    });
    
    // Check for skill unlock
    const unlocked = checkSkillUnlocks(gameState, 'repairTalk');
    if (unlocked.length > 0) {
      addLog(`🎓 New tool unlocked: ${unlocked[0].label}`);
    }

    updateRelationship({
      actionId: 'repairTalk',
      actionLabel: 'Repair Talk',
      emoji: '🧵',
      meterDelta: 6,
      stressDelta: 0.1,
      detail,
    });
    
    // Update person stats in relationships
    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      return { ...p, familyDynamicsStats: personStats };
    });

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
      },
      familyDynamics: {
        ...gameState.familyDynamics,
        perPerson: {
          ...(gameState.familyDynamics?.perPerson || {}),
          [person.id]: personStats
        }
      }
    });
  };
  
  const doSetBoundary = () => {
    const detail = "You hold your line without cruelty. They don't love it. You don't collapse.";
    
    const personStats = updatePersonStats(gameState, person.id, { 
      trust: 0, 
      closeness: -3, 
      friction: -15 
    });
    
    const unlocked = checkSkillUnlocks(gameState, 'setBoundary');
    if (unlocked.length > 0) {
      addLog(`🎓 New tool unlocked: ${unlocked[0].label}`);
    }

    updateRelationship({
      actionId: 'setBoundary',
      actionLabel: 'Set Boundary',
      emoji: '🧱',
      meterDelta: -4,
      stressDelta: 0.05,
      detail,
    });
    
    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      return { ...p, familyDynamicsStats: personStats };
    });

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
      },
      familyDynamics: {
        ...gameState.familyDynamics,
        perPerson: {
          ...(gameState.familyDynamics?.perPerson || {}),
          [person.id]: personStats
        }
      }
    });
  };
  
  const doAskForSupport = () => {
    const fd = gameState.familyDynamics || {};
    const attachmentStyle = fd.attachmentStyle || 'secure';
    
    // Outcome varies by attachment style
    let detail, meterDelta, stressDelta, success;
    if (attachmentStyle === 'anxious') {
      const roll = Math.random();
      if (roll < 0.4) {
        detail = "You ask for help. They show up big. You feel seen.";
        meterDelta = 15;
        stressDelta = -0.2;
        success = true;
      } else {
        detail = "You ask for help. It lands awkwardly. You spiral a bit.";
        meterDelta = -5;
        stressDelta = 0.15;
        success = false;
      }
    } else if (attachmentStyle === 'avoidant') {
      detail = "You ask for help (rare for you). It's clunky but brave.";
      meterDelta = 10;
      stressDelta = 0.1;
      success = true;
    } else if (attachmentStyle === 'disorganized') {
      const roll = Math.random();
      if (roll < 0.5) {
        detail = "You ask for help. They surprise you. It feels safe.";
        meterDelta = 18;
        stressDelta = -0.25;
        success = true;
      } else {
        detail = "You ask for help. Old fears show up. You shut down.";
        meterDelta = -8;
        stressDelta = 0.2;
        success = false;
      }
    } else {
      detail = "You ask for help. They help. It's... kind of normal?";
      meterDelta = 12;
      stressDelta = -0.1;
      success = true;
    }
    
    const personStats = updatePersonStats(gameState, person.id, { 
      trust: success ? +10 : -5, 
      closeness: success ? +10 : -3, 
      friction: success ? -5 : +5 
    });
    
    if (success) {
      const unlocked = checkSkillUnlocks(gameState, 'askSupport_success');
      if (unlocked.length > 0) {
        addLog(`🎓 New tool unlocked: ${unlocked[0].label}`);
      }
    }

    updateRelationship({
      actionId: 'askSupport',
      actionLabel: 'Ask for Support',
      emoji: '🤝',
      meterDelta,
      stressDelta,
      detail,
    });
    
    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      return { ...p, familyDynamicsStats: personStats };
    });

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
      },
      familyDynamics: {
        ...gameState.familyDynamics,
        perPerson: {
          ...(gameState.familyDynamics?.perPerson || {}),
          [person.id]: personStats
        }
      }
    });
  };
  
  const doMakeJoke = () => {
    const detail = "You lighten the room with humor. It works—but doesn't go deep.";
    
    const fd = gameState.familyDynamics || {};
    const activeScripts = computeActiveScripts(gameState, person.role);
    
    // If jokes as armor script is active, block deeper repair
    const hasJokesAsArmor = activeScripts.scriptIds.includes('jokesAsArmor');
    
    const personStats = updatePersonStats(gameState, person.id, { 
      trust: 0, 
      closeness: hasJokesAsArmor ? -2 : +3, 
      friction: -5 
    });
    
    const unlocked = checkSkillUnlocks(gameState, 'makeJoke');
    if (unlocked.length > 0) {
      addLog(`🎓 New tool unlocked: ${unlocked[0].label}`);
    }

    updateRelationship({
      actionId: 'makeJoke',
      actionLabel: 'Make a Joke',
      emoji: '🎭',
      meterDelta: hasJokesAsArmor ? 3 : 5,
      stressDelta: -0.15,
      detail: hasJokesAsArmor ? `${detail} (Humor as armor shows up.)` : detail,
    });
    
    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      return { ...p, familyDynamicsStats: personStats };
    });

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
      },
      familyDynamics: {
        ...gameState.familyDynamics,
        perPerson: {
          ...(gameState.familyDynamics?.perPerson || {}),
          [person.id]: personStats
        }
      }
    });
  };
  
  const doApologize = () => {
    const detail = "You apologize properly: own it, no defending, no BUT. It lands.";
    
    const personStats = updatePersonStats(gameState, person.id, { 
      trust: +15, 
      closeness: +10, 
      friction: -8 
    });
    
    const unlocked = checkSkillUnlocks(gameState, 'apologize');
    if (unlocked.length > 0) {
      addLog(`🎓 New tool unlocked: ${unlocked[0].label}`);
    }

    updateRelationship({
      actionId: 'apologize',
      actionLabel: 'Apologize Properly',
      emoji: '🧾',
      meterDelta: 12,
      stressDelta: 0.05,
      detail,
    });
    
    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      return { ...p, familyDynamicsStats: personStats };
    });

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
      },
      familyDynamics: {
        ...gameState.familyDynamics,
        perPerson: {
          ...(gameState.familyDynamics?.perPerson || {}),
          [person.id]: personStats
        }
      }
    });
  };
  
  const doLetItPass = () => {
    const detail = "You let it pass. No confrontation. No repair either.";
    
    const personStats = updatePersonStats(gameState, person.id, { 
      trust: -2, 
      closeness: -5, 
      friction: +3 
    });

    updateRelationship({
      actionId: 'doNothing',
      actionLabel: 'Do Nothing',
      emoji: '🫥',
      meterDelta: 0,
      stressDelta: -0.1,
      detail,
    });
    
    const nextRoster = (gameState.relationships?.roster || []).map(p => {
      if (p.id !== person.id) return p;
      return { ...p, familyDynamicsStats: personStats };
    });

    updateState({
      relationships: {
        ...(gameState.relationships || {}),
        roster: nextRoster,
        byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
      },
      familyDynamics: {
        ...gameState.familyDynamics,
        perPerson: {
          ...(gameState.familyDynamics?.perPerson || {}),
          [person.id]: personStats
        }
      }
    });
  };

  const doGrandkidTime = () => {
    const meterDelta = Math.floor(Math.random() * 5) + 8; // Random between 8 and 12
    const stressDelta = -(0.15 + Math.random() * 0.10); // Random between -0.15 and -0.25
    
    // Child stats: empathy +0.10, confidence +0.10, discipline +0.10, intelligence +0.10
    const deltas = { empathy: 0.1, confidence: 0.1, discipline: 0.1, intelligence: 0.1 };
    
    const story = getRandomGrandkidStory(gameState.childName, person.name);
    const benefitsBlock = `Benefits:
• ${gameState.childName} feels loved and secure (Confidence +0.1)
• Practices patience + kindness (Empathy +0.1)
• Builds small skills + routines (Discipline +0.1, Intelligence +0.1)
• You get a breather (Stress down)`;

    const detail = `${story}\n\n${benefitsBlock}`;

    updateRelationship({
      actionId: 'grandkidTime',
      actionLabel: 'Grandkid Time',
      emoji: '👵👴',
      meterDelta,
      stressDelta,
      deltas,
      detail
    });
  };

  const startGift = () => setPicker('gift');
  const startDateNight = () => setPicker('dateNight');
  const startPropose = () => setPicker('propose');
  const startWedding = () => {
    setPicker(null);
    setWeddingPlannerOpen(true);
  };

  const doPropose = (ring) => {
    applyMoneyDelta(-ring.cost, `Engagement ring: ${ring.label}`);
    
    const partnerRelationship = gameState.partnerRelationship || { status: 'partnered' };
    const partnerMeter = person.meter || 50;
    
    // Calculate acceptance chance
    let baseChance = 35;
    if (partnerMeter >= 80) baseChance = 90;
    else if (partnerMeter >= 70) baseChance = 75;
    else if (partnerMeter >= 60) baseChance = 60;
    
    const totalChance = Math.min(95, baseChance + ring.acceptanceBonus);
    const roll = Math.random() * 100;
    const accepted = roll < totalChance;
    
    if (accepted) {
      const nextMeter = clamp(partnerMeter + 5);
      
      updateState({
        partnerRelationship: {
          ...partnerRelationship,
          status: 'engaged',
          ring: ring,
          engagedAtAge: gameState.currentYear
        },
        partnerMeter: nextMeter,
        relationships: {
          ...gameState.relationships,
          roster: gameState.relationships.roster.map(p => 
            p.id === 'partner' ? { ...p, meter: nextMeter } : p
          ),
          byId: {
            ...gameState.relationships.byId,
            partner: { ...gameState.relationships.byId.partner, meter: nextMeter }
          }
        }
      });
      
      addLog(`💍 ${person.name} said yes!`);
      
      emitActionResult({
        actionId: 'relationship',
        title: '💍 Engaged!',
        body: `${person.name} said yes! You're engaged.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -ring.cost,
        focusDelta: 0,
        tags: ['relationship', 'engagement'],
        meta: { emoji: '💍', ring: ring.label }
      });
      
      recordTimelineEntry({
        kind: 'relationship',
        title: `💍 Engaged to ${person.name}`,
        detail: `Ring: ${ring.label} ($${formatMoney(ring.cost)})`,
        deltas: null,
        moneyDelta: -ring.cost,
        loveDelta: 0,
        stressDelta: -1
      });
    } else {
      const nextMeter = clamp(partnerMeter - 10);
      
      updateState({
        partnerMeter: nextMeter,
        relationships: {
          ...gameState.relationships,
          roster: gameState.relationships.roster.map(p => 
            p.id === 'partner' ? { ...p, meter: nextMeter } : p
          ),
          byId: {
            ...gameState.relationships.byId,
            partner: { ...gameState.relationships.byId.partner, meter: nextMeter }
          }
        }
      });
      
      applyStress(1, 'Proposal declined');
      
      addLog(`💔 ${person.name} said "not yet."`);
      
      emitActionResult({
        actionId: 'relationship',
        title: '💔 Proposal Declined',
        body: `${person.name} said "not yet." It hurts.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -ring.cost,
        focusDelta: 0,
        tags: ['relationship'],
        meta: { emoji: '💔', ring: ring.label }
      });
      
      recordTimelineEntry({
        kind: 'relationship',
        title: `💔 Proposal declined`,
        detail: `${person.name} wasn't ready`,
        deltas: null,
        moneyDelta: -ring.cost,
        loveDelta: 0,
        stressDelta: 1
      });
    }
    
    setPicker(null);
  };

  const doWedding = async (wedding) => {
    const partnerRelationship = gameState.partnerRelationship || { status: 'engaged' };
    const partnerMeter = person.meter || 50;
    const nextMeter = clamp(partnerMeter + wedding.partnerMeterDelta);

    // Ensure partnerCareer exists
    let partnerCareer = gameState.partnerCareer;
    let partnerUpdates = {};
    if (!partnerCareer) {
      partnerCareer = computeRandomPartnerCareer({
        seed: `${gameState.runSeed || 0}|partnerCareer|${person.name}`,
        ageAtBirth: gameState.parentCareer?.ageAtBirth || 30
      });
      partnerUpdates.partnerCareer = partnerCareer;
      addLog(`💼 ${person.name} works as a ${partnerCareer.jobTitle} (+$${formatMoney(partnerCareer.yearlyIncome)}/year).`);
    }

    // Ensure wealth exists
    const partnerAge = Number.isFinite(Number(person?.age)) ? Number(person.age) : (Number.isFinite(Number(person?.baseAge)) ? Number(person.baseAge) : 28);
    let wealth = partnerRelationship.wealth;
    if (!wealth || !Number.isFinite(wealth.amount)) {
      const w = generatePartnerWealth({
        seed: `${gameState.runSeed || 0}|partnerWealth|${person.name}|${partnerAge}`,
        age: partnerAge,
        estimatedIncome: partnerCareer?.yearlyIncome || 55000
      });
      wealth = { amount: w.amount, tierId: w.tierId, label: w.label, emoji: w.emoji, knownTier: true, knownAmount: false };
    }

    // Prenup decision (only once)
    let prenup = partnerRelationship.prenup || { decided: false, asked: false, signed: false, refused: false, decidedAtAge: null };
    let prenupNarration = '';

    if (!prenup.decided) {
      const wantsPrenup = await confirm({
        title: '📜 Prenup Talk',
        description: `Before you get married, do you want to ask ${person.name} to sign a prenup?\n\n(Their money vibe: ${wealth.emoji} ${wealth.label}. Exact numbers stay hidden until marriage.)\n\nAsking can be awkward.\nNot asking can be… expensive.`,
        confirmText: 'Ask for prenup',
        cancelText: 'Skip prenup'
      });

      prenup = {
        decided: true,
        asked: Boolean(wantsPrenup),
        signed: false,
        refused: false,
        decidedAtAge: gameState.currentYear
      };

      if (wantsPrenup) {
        const yourNetWorth = computeNetWorthBreakdown(gameState).total;
        const tierId = wealth?.tierId;

        // Acceptance chance
        let chance = 0.55;

        if (partnerMeter >= 85) chance += 0.22;
        else if (partnerMeter >= 70) chance += 0.12;
        else if (partnerMeter >= 55) chance += 0.04;
        else chance -= 0.20;

        if (['wealthy', 'rich', 'very_rich'].includes(tierId)) chance += 0.18;
        else if (tierId === 'comfortable') chance += 0.08;
        else if (tierId === 'stable') chance += 0.02;
        else chance -= 0.12;

        if ((wealth?.amount || 0) > (yourNetWorth || 0) * 1.5) chance += 0.10;

        chance = Math.max(0.05, Math.min(0.95, chance));
        const accepted = Math.random() < chance;

        if (accepted) {
          prenup.signed = true;
          prenupNarration = `📜 Prenup signed. Future-you just exhaled.`;
        } else {
          prenup.refused = true;
          prenupNarration = `📜 Prenup refused. ${person.name} said, “Love should be enough,” while your bank account whispered, “we are in danger.”`;

          const proceed = await confirm({
            title: '😬 Prenup Refused',
            description: `${person.name} won’t sign.\n\nProceed with the wedding anyway?\n\nProceed = romantic.\nCall it off = dramatic.\nEither way = story content.`,
            confirmText: 'Proceed anyway',
            cancelText: 'Call off wedding'
          });

          if (!proceed) {
            const penalty = 15;
            const dropped = clamp(partnerMeter - penalty);

            applyStress(1, 'Prenup fight');

            updateState({
              ...partnerUpdates,
              partnerMeter: dropped,
              partnerRelationship: {
                ...partnerRelationship,
                prenup
              },
              relationships: {
                ...gameState.relationships,
                roster: gameState.relationships.roster.map(p => (p.id === 'partner' ? { ...p, meter: dropped } : p)),
                byId: {
                  ...gameState.relationships.byId,
                  partner: { ...gameState.relationships.byId.partner, meter: dropped }
                }
              }
            });

            emitActionResult({
              actionId: 'relationship',
              title: '💔 Wedding Called Off (For Now)',
              body: `You hit the brakes.\n\n${person.name}: “So you *don’t* trust me?”\nYou: “I trust you. I just don’t trust future-me.”\n\nRelationship -${penalty}. Stress +1.\n\nYou can try again another year… if you survive the vibes.`,
              deltas: {},
              loveDelta: 0,
              stressDelta: 1,
              moneyDelta: 0,
              focusDelta: 0,
              tags: ['relationship'],
              meta: { emoji: '💔' }
            });

            setWeddingPlannerOpen(false);
            return;
          }
        }
      } else {
        prenupNarration = `📜 No prenup. Romantic? Yes. Financially brave? Also yes.`;
      }
    } else {
      prenupNarration = prenup.signed ? '📜 Prenup signed.' : '📜 No prenup.';
    }

    // Snapshot net worth BEFORE merging partner wealth
    const yourNetWorthAtMarriage = computeNetWorthBreakdown(gameState).total;
    const partnerWealthAtMarriage = wealth.amount || 0;

    // Wedding costs + stress
    applyMoneyDelta(-wedding.cost, `Wedding: ${wedding.label}`);
    applyStress(wedding.stressDelta, 'Wedding planning');

    // Merge finances (only once)
    if (!partnerRelationship?.marriageFinance?.mergedWealthAtAge) {
      applyMoneyDelta(partnerWealthAtMarriage, `${person.name}'s savings join the family pot`);
    }

    updateState({
      ...partnerUpdates,
      partnerRelationship: {
        ...partnerRelationship,
        status: 'married',
        wedding,
        marriedAtAge: gameState.currentYear,
        wealth: {
          ...wealth,
          knownTier: true,
          knownAmount: true
        },
        prenup,
        marriageFinance: {
          playerNetWorthAtMarriage: yourNetWorthAtMarriage,
          partnerWealthAtMarriage,
          mergedWealthAtAge: gameState.currentYear
        }
      },
      partnerMeter: nextMeter,
      relationships: {
        ...gameState.relationships,
        roster: gameState.relationships.roster.map(p => (p.id === 'partner' ? { ...p, meter: nextMeter } : p)),
        byId: {
          ...gameState.relationships.byId,
          partner: { ...gameState.relationships.byId.partner, meter: nextMeter }
        }
      }
    });

    addLog(`💒 Married ${person.name}!`);
    addLog(`💰 Joint finances: +$${formatMoney(partnerWealthAtMarriage)} (yes, really).`);

    emitActionResult({
      actionId: 'relationship',
      title: '💒 Married!',
      body: `You and ${person.name} are now married.\n\nWedding: ${wedding.label}\n${prenupNarration}\n\n💰 Their money joins yours: +$${formatMoney(partnerWealthAtMarriage)}\nWealth vibe: ${wealth.emoji} ${wealth.label}\n\nYou now share a household… and a suspiciously loud opinion about throw pillows.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: wedding.stressDelta,
      moneyDelta: -wedding.cost + partnerWealthAtMarriage,
      focusDelta: 0,
      tags: ['relationship', 'wedding'],
      meta: { emoji: '💒', wedding: wedding.label }
    });

    recordTimelineEntry({
      kind: 'relationship',
      title: `💒 Married ${person.name}`,
      detail: `Wedding: ${wedding.label} ($${formatMoney(wedding.cost)}). ${prenupNarration} Partner wealth merged: +$${formatMoney(partnerWealthAtMarriage)}.`,
      deltas: null,
      moneyDelta: -wedding.cost + partnerWealthAtMarriage,
      loveDelta: 0,
      stressDelta: wedding.stressDelta
    });

    setWeddingPlannerOpen(false);
  };

  const doTryForBaby = async () => {
    if (tryForBabyInFlightRef.current) return;
    tryForBabyInFlightRef.current = true;
    setTryForBabyBusy(true);

    try {
      const wantsToTry = await confirm({
        title: 'Try for a Baby?',
        description: `Try having a child with ${person.name}?`,
        confirmText: 'Try',
        cancelText: 'Cancel'
      });

      if (!wantsToTry) return;

      // Check expansion
      const srEnabled = !!gameState.expansions?.siblingRivalry;
      const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
      const hasExistingChild = kids.length > 0;

      if (hasExistingChild && !srEnabled) {
        const enableExpansion = await confirm({
          title: 'Sibling Rivalry Expansion',
          description: 'To have another child, you need the Sibling Rivalry expansion. Enable it now?',
          confirmText: 'Enable & Continue',
          cancelText: 'Not now'
        });

        if (!enableExpansion) return;

        // Check focus FIRST before enabling expansion
        const ok = spendFocus(1, 'Try for a Baby');
        if (!ok) return;

        // Enable expansion + force success
        updateState(prev => ({
          expansions: { ...(prev.expansions || {}), siblingRivalry: true }
        }));

        // Prompt for name BEFORE creating baby
        const babyGender = Math.random() < 0.5 ? 'boy' : 'girl';
        const babyNumber = kids.length + 1;
        const rng = createSeededRng(`${gameState.runSeed}|newBabyName|year:${gameState.currentYear}|count:${babyNumber}|gender:${babyGender}`);
        const defaultName = pickCulturalFirstName({
          cultures: gameState.playerCultures || ['AMERICAN_US'],
          gender: babyGender === 'boy' ? 'male' : 'female',
          seed: rng
        }) || "Newborn";

        const typed = window.prompt("Name your baby:", defaultName);
        if (typed === null) return;
        const chosenName = String(typed).trim();
        if (!chosenName) return;

        createBaby({ forceSuccess: true, babyGender, babyName: chosenName });
        return;
      }

      // Expansion already enabled or first child: use fertility algorithm
      const ok = spendFocus(1, 'Try for a Baby');
      if (!ok) return;

    // Calculate chance
    let chance = 0.35;

    // Health factor (both parents)
    const playerHealth = Number(gameState.playerHealth ?? 75);
    const partnerHealth = 75; // Default if not tracked
    const healthFactor = (playerHealth + partnerHealth) / 200;
    chance += (healthFactor - 0.5) * 0.20;

    // Age factor (female partner) - use current person's gender
    const playerGenderIsFemale = (String(gameState.parentRole || '').toLowerCase() === 'mom') || (String(gameState.parentAvatarGender || '') === 'female');
    
    // Determine current person's gender based on role
    let personGenderKey = null;
    if (person.role === 'wife') {
      personGenderKey = 'female';
    } else if (person.role === 'husband') {
      personGenderKey = 'male';
    } else if (person.role === 'partner') {
      personGenderKey = String(gameState.partnerAvatarGender || '') === 'female' ? 'female' : 'male';
    }

    let femaleAge = null;
    if (playerGenderIsFemale) {
      femaleAge = (Number(gameState.parentAgeAtBirth ?? 28)) + Number(gameState.currentYear ?? 0);
    } else if (personGenderKey === 'female' && person.baseAge) {
      femaleAge = Number(person.baseAge) + Number(gameState.currentYear ?? 0);
    }

    if (femaleAge !== null) {
      if (femaleAge <= 29) chance *= 1.0;
      else if (femaleAge <= 34) chance *= 0.85;
      else if (femaleAge <= 39) chance *= 0.60;
      else chance *= 0.25;
    }

    // Stress penalty
    const stress = Number(gameState.stress ?? 0);
    if (stress > 60) chance -= 0.08;
    if (stress > 80) chance -= 0.10;

    chance = Math.max(0.05, Math.min(0.80, chance));

    // Deterministic roll
    const childrenCount = kids.length;
    const seed = `${gameState.runSeed}|tryForBaby|year:${gameState.currentYear}|partner:${person.id}|count:${childrenCount}`;
    const rng = { nextFloat: () => {
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i);
      let state = (h >>> 0) || 1;
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    }};

    const success = rng.nextFloat() < chance;

    if (success) {
      // Prompt for name BEFORE creating baby
      const babyGender = Math.random() < 0.5 ? 'boy' : 'girl';
      const babyNumber = kids.length + 1;
      const nameRng = createSeededRng(`${gameState.runSeed}|newBabyName|year:${gameState.currentYear}|count:${babyNumber}|gender:${babyGender}`);
      const defaultName = pickCulturalFirstName({
        cultures: gameState.playerCultures || ['AMERICAN_US'],
        gender: babyGender === 'boy' ? 'male' : 'female',
        seed: nameRng
      }) || "Newborn";

      const typed = window.prompt("Name your baby:", defaultName);
      if (typed === null) return;
      const chosenName = String(typed).trim();
      if (!chosenName) return;

      createBaby({ forceSuccess: false, babyGender, babyName: chosenName });
    } else {
      applyStress(2, 'Try for a Baby');
      emitActionResult({
        title: '👶 Not This Time',
        body: "You tried for a baby, but it didn't happen this time.",
        deltas: {},
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['relationship'],
        meta: { emoji: '👶' }
      });
    }
    } finally {
      setTryForBabyBusy(false);
      tryForBabyInFlightRef.current = false;
    }
  };

  const createBaby = ({ forceSuccess, babyGender, babyName }) => {
    updateState(prev => {
      // Detect childless mode conversion
      const wasChildless = (prev.hasChild === false) || (prev.childless === true);
      
      let s = ensureKidsContainer(prev);
      s = persistActiveChildIntoKids(s);

      const existingKids = Array.isArray(s.kids) ? s.kids : [];

      const toneIndex = Number.isFinite(Number(s.childAvatarToneIndex)) ? Number(s.childAvatarToneIndex) : 2;

      // Use the primary kid as a baseline for stats only
      const baseSlice = existingKids[0]?.childSlice ? { ...existingKids[0].childSlice } : {};
      const baseStats = { ...(s.baselineStats || s.stats || {}) };

      const babySlice = {
        ...baseSlice,
        childName: babyName,
        childGender: babyGender,
        childAvatarGender: babyGender,
        childAvatarToneIndex: toneIndex,
        stats: { ...baseStats },
        baselineStats: { ...baseStats },
        highWaterStats: { ...baseStats },
        love: 10,
        baselineLove: 10,
        highWaterLove: 10,
        teacherName: '',
        bestFriendName: '',
        bestFriendCrushName: '',
        grade: null,
        schoolStage: null,
        pubertyUnlocked: false
      };

      const newKid = createKid({
        id: makeKidId(),
        createdAtYear: wasChildless ? 0 : s.currentYear,
        childSlice: babySlice
      });

      const nextKids = [...existingKids, newKid];
      const nextActiveKidId = s.activeKidId || existingKids[0]?.id || newKid.id;

      // Childless to parenting conversion
      if (wasChildless) {
        const parentAgeNow = (s.parentAgeAtBirth ?? 28) + (s.currentYear ?? 0);
        
        return { 
          ...s, 
          kids: nextKids, 
          activeKidId: nextActiveKidId,
          // Convert to parenting mode
          hasChild: true,
          childless: false,
          lifeStage: 'parenting',
          birthIntroPending: true,
          birthIntroCompleted: false,
          // Reset child age timeline
          parentAgeAtBirth: parentAgeNow,
          currentYear: 0,
          // Clear scenario flags
          scenarioPending: false,
          pendingScenario: false,
          currentScenario: null,
          // Set top-level legacy child fields
          childName: babyName,
          childAvatarGender: babyGender,
          childGender: babyGender,
          childAvatarToneIndex: toneIndex,
          childAvatarSpriteIndex: (toneIndex % 4),
          childAvatarPicked: true
        };
      }

      return { ...s, kids: nextKids, activeKidId: nextActiveKidId };
    });

    addLog(`👶 New baby! You and ${person.name} welcomed ${babyName}.`);
    
    recordTimelineEntry({
      kind: 'family',
      title: '👶 New Baby',
      detail: `You and ${person.name} welcomed ${babyName}.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    emitActionResult({
      title: '🎉 New Baby!',
      body: `You and ${person.name} welcomed ${babyName}.\n\nYour family just grew. (Use Sibling Rivalry features to manage multiple kids.)`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['relationship', 'family'],
      meta: { emoji: '👶' }
    });
  };

  const doBreakUp = () => {
    updateState(prev => {
      const result = finalizePartnerSeparation(prev, { mode: 'breakup' });
      return {
        ...result,
        birthControl: { ...(prev.birthControl || { playerOn: false, partnerOn: false }), partnerOn: false }
      };
    });
    
    addLog(`💔 Broke up with ${person.name}`);
    
    recordTimelineEntry({
      kind: 'relationship',
      title: `💔 Broke up with ${person.name}`,
      detail: 'Household is now single-parent',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 1
    });
    
    onClose();
  };

  const doDivorce = () => {
    const { settlement, breakdown, mode, baselineCombined, maritalGains, spouseGetsBack } = computeDivorceSettlement(gameState);
    
    applyMoneyDelta(-settlement, 'Divorce settlement');
    
    updateState(prev => {
      const result = finalizePartnerSeparation(prev, { mode: 'divorce' });
      return {
        ...result,
        birthControl: { ...(prev.birthControl || { playerOn: false, partnerOn: false }), partnerOn: false }
      };
    });
    
    const netWorthLine =
      `cash $${formatMoney(breakdown.cash)} + retirement $${formatMoney(breakdown.retirement)} + emergency fund $${formatMoney(breakdown.emergency)} + real estate equity $${formatMoney(breakdown.realEstateEquity)}`;

    let detailText;

    if (mode === 'prenup') {
      detailText =
        `📜 Prenup applies.\n\n` +
        `Baseline (you + them at marriage): $${formatMoney(baselineCombined)}\n` +
        `Marital gains: $${formatMoney(maritalGains)}\n` +
        `They reclaim: $${formatMoney(spouseGetsBack)} + 50% of gains\n\n` +
        `Settlement paid: $${formatMoney(settlement)}\n\n` +
        `(Net worth snapshot: ${netWorthLine})\n\n` +
        `Your lawyer calls it “protected assets.” Your wallet calls it “mildly survivable.”`;
    } else {
      detailText =
        `No prenup (or none on file).\n\n` +
        `Settlement: $${formatMoney(settlement)} (50% of net worth: ${netWorthLine}).\n\n` +
        `Your lawyer calls it “standard.” Your bank account calls it “character development.”`;
    }
    
    addLog(`💔 Divorced ${person.name}. Settlement: $${formatMoney(settlement)}`);
    
    emitActionResult({
      actionId: 'relationship',
      title: '💔 Divorce Settlement',
      body: detailText,
      deltas: {},
      loveDelta: 0,
      stressDelta: 2,
      moneyDelta: -settlement,
      focusDelta: 0,
      tags: ['relationship', 'divorce'],
      meta: { emoji: '💔', settlement }
    });
    
    recordTimelineEntry({
      kind: 'relationship',
      title: `💔 Divorce: ${person.name}`,
      detail: detailText,
      deltas: null,
      moneyDelta: -settlement,
      loveDelta: 0,
      stressDelta: 2
    });
    
    onClose();
  };

  const doGift = (opt) => {
    const giftText = pick(COMEDY_GIFTS[opt.id]) || 'a mysterious but heartfelt gift';
    const detail = `You give ${person.name}: ${giftText}`;
    updateRelationship({
      actionId: 'gift',
      actionLabel: 'Gift',
      emoji: opt.emoji || '🎁',
      meterDelta: opt.meterDelta,
      stressDelta: -0.05,
      moneyDelta: -opt.cost,
      detail,
    });
    setPicker(null);
  };

  // Give Money helpers
  const startGiveMoney = () => {
    const max = Math.max(0, Math.floor(Number(gameState.money) || 0));
    setMoneyGiftAmount(Math.min(max, 20000));
    setPicker('giveMoney');
  };

  function rollGiftPreference() {
    const r = Math.random();
    if (r < 0.20) return 'reject_angry';
    if (r < 0.40) return 'reject_neutral';
    return 'accept';
  }

  function ensureGiftPreferenceForPerson(person, gameState, updateState) {
    if (person.role === 'partner' && gameState.partnerRelationship?.status === 'married') {
      const pr = gameState.partnerRelationship || {};
      let ll = pr.loveLanguages;
      if (!ll || !ll.weights) {
        ll = generateLoveLanguageProfile({ seed: `${gameState.runSeed || 0}|loveLanguages|${person.name}` });
        updateState({ partnerRelationship: { ...pr, loveLanguages: ll } });
      }
      const w = Number(ll?.weights?.gifts ?? 0);
      if (w <= 0) return 'reject_angry';
      if (w < 0.5) return 'reject_neutral';
      return 'accept';
    }
    if (['accept','reject_neutral','reject_angry'].includes(person.giftPreference)) {
      return person.giftPreference;
    }
    const pref = rollGiftPreference();
    updateState(prev => {
      const rel = prev.relationships || { roster: [], byId: {} };
      const roster = (rel.roster || []).map(p => p.id === person.id ? { ...p, giftPreference: pref } : p);
      const byId = { ...(rel.byId || {}), [person.id]: { ...(rel.byId?.[person.id] || person), giftPreference: pref } };
      return { ...prev, relationships: { ...rel, roster, byId } };
    });
    return pref;
  }

  const doGiveMoney = () => {
    const availability = canUse('giveMoney', 1);
    if (!availability.ok) return;
    const max = Math.max(0, Math.floor(Number(gameState.money) || 0));
    const amt = Math.max(0, Math.min(max, Math.floor(Number(moneyGiftAmount) || 0)));
    if (amt <= 0 || amt > max) return;

    const pref = ensureGiftPreferenceForPerson(person, gameState, updateState);

    const positiveDelta = Math.min(25, Math.max(5, Math.round(4 + Math.log10(amt + 1) * 3)));

    if (pref === 'accept') {
      const detail = `${person.name} accepts the money and looks genuinely grateful.\n\nYou gave $${formatMoney(amt)}.`;
      updateRelationship({
        actionId: 'giveMoney',
        actionLabel: 'Give Money',
        emoji: '💵',
        meterDelta: positiveDelta,
        stressDelta: -0.05,
        moneyDelta: -amt,
        detail
      });
    } else if (pref === 'reject_neutral') {
      const detail = `${person.name} politely declines.\n\n“I can’t accept that.”`;
      updateRelationship({
        actionId: 'giveMoney',
        actionLabel: 'Give Money',
        emoji: '💵',
        meterDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        detail
      });
    } else {
      const negativeDelta = -Math.min(15, Math.max(6, Math.round(6 + Math.log10(amt + 1) * 1.5)));
      const detail = `${person.name} rejects it — and seems offended you offered.\n\nMoney-as-a-gift is NOT their love language.`;
      updateRelationship({
        actionId: 'giveMoney',
        actionLabel: 'Give Money',
        emoji: '💵',
        meterDelta: negativeDelta,
        stressDelta: 0.05,
        moneyDelta: 0,
        detail
      });
    }

    setPicker(null);
  };

  const doLoveLanguageTalk = () => {
    if (person.role === 'partner') {
      const pr = gameState.partnerRelationship || {};
      if (pr.status !== 'married') return;

      const existing = pr.loveLanguages || generateLoveLanguageProfile({ seed: `${gameState.runSeed || 0}|loveLanguages|${person.name}` });

      const { clueText, updatedProfile } = getLoveLanguageClue({
        loveProfile: existing,
        currentYear: gameState.currentYear,
        partnerName: person.name
      });

      updateState({
        partnerRelationship: {
          ...pr,
          loveLanguages: updatedProfile
        }
      });

      updateRelationship({
        actionId: 'loveLanguageTalk',
        actionLabel: 'Love Language Talk',
        emoji: '🧠',
        meterDelta: 3,
        stressDelta: -0.05,
        moneyDelta: 0,
        detail: clueText
      });
      return;
    }

    if (person.role === 'side_partner') {
      const relEntry = gameState.relationships?.byId?.[person.id] || person;
      const existing = relEntry.loveLanguages || generateLoveLanguageProfile({ seed: `${gameState.runSeed || 0}|loveLanguages|side|${person.id}|${person.name}` });

      const { clueText, updatedProfile } = getLoveLanguageClue({
        loveProfile: existing,
        currentYear: gameState.currentYear,
        partnerName: person.name
      });

      updateState(prev => {
        const rel = prev.relationships || { roster: [], byId: {} };
        const roster = (rel.roster || []).map(p => p.id === person.id ? { ...p, loveLanguages: updatedProfile } : p);
        const byId = { ...(rel.byId || {}), [person.id]: { ...(rel.byId?.[person.id] || relEntry), loveLanguages: updatedProfile } };
        return { ...prev, relationships: { ...rel, roster, byId } };
      });

      updateRelationship({
        actionId: 'loveLanguageTalk',
        actionLabel: 'Love Language Talk',
        emoji: '🧠',
        meterDelta: 3,
        stressDelta: -0.05,
        moneyDelta: 0,
        detail: clueText
      });
    }
  };

  const maybeAffairNearMiss = () => {
    const married = gameState.partnerRelationship?.status === 'married';
    const openActive = !!(gameState.partnerRelationship?.openRelationship?.active);
    const isSide = person?.role === 'side_partner';

    // Only applies to cheating, not consensual open relationship
    if (!married || openActive || !isSide) return null;

    const lieDebt = Number(gameState.relationshipDrama?.lieDebt || 0);

    // Keep it small + simple, slightly higher if lieDebt is already high
    let p = 0.10; // 10% base
    if (lieDebt >= 6) p += 0.04;
    if (lieDebt >= 12) p += 0.04;
    p = Math.min(0.20, p); // cap at 20%

    if (Math.random() > p) return null;

    return {
      stressDelta: 0.6,
      lieDebtDelta: 2,
      line: "😰 Almost got caught: someone recognized you and you spent the week covering your tracks."
    };
  };

  const doDateNight = (idea) => {
    // Roll a rich outcome using the shared engine
    const outcome = rollDateOutcome({
      ideaId: idea.id,
      context: {
        name: person.name,
        childName: gameState.childName || 'your kid'
      },
      mode: person.role === 'side_partner' ? 'single' : 'partner'
    });

    const nearMiss = maybeAffairNearMiss();

    let stressDelta = outcome.stressDelta;
    let detail = `${outcome.summary}\n\n${outcome.story}`;

    if (nearMiss) {
      stressDelta += nearMiss.stressDelta;
      detail += `\n\n${nearMiss.line}`;

      // Patch lieDebt (existing system)
      updateState(prev => ({
        ...prev,
        relationshipDrama: {
          ...(prev.relationshipDrama || {}),
          lieDebt: Math.max(0, Number(prev.relationshipDrama?.lieDebt || 0) + nearMiss.lieDebtDelta)
        }
      }));

      addLog("😰 Close call: your affair almost got exposed.");
    }

    updateRelationship({
      actionId: 'dateNight',
      actionLabel: `${outcome.qualityLabel} Date Night: ${idea.label}`,
      emoji: idea.emoji || '💞',
      meterDelta: outcome.meterDelta,
      stressDelta,
      moneyDelta: -outcome.moneyCost,
      detail
    });

    setPicker(null);
  };

  const getOpenRelState = () => {
    const pr = gameState.partnerRelationship || {};
    const openRel = pr.openRelationship || { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null };
    return { pr, openRel, openActive: openRel.active === true };
  };

  const computeOpenRelationshipYesChance = () => {
    const { pr } = getOpenRelState();

    // Ensure love language profile exists (hidden is fine)
    const ll = pr.loveLanguages || generateLoveLanguageProfile({ seed: `${gameState.runSeed || 0}|loveLanguages|${person.name}` });
    const touchWeight = Number(ll?.weights?.touch ?? 0.5);

    // Stable trait that makes some partners more/less open
    const traitRng = createSeededRng(`${gameState.runSeed || 0}|openRelTrait|${person.name}`);
    const trait = (traitRng.nextFloat() - 0.5) * 0.08; // -0.04..+0.04

    let chance = 0.03; // baseline: generally "no"
    if (meter >= 85) chance += 0.05;
    else if (meter >= 70) chance += 0.03;
    else if (meter >= 60) chance += 0.015;
    else if (meter < 45) chance -= 0.015;

    if (pr.status === 'married') chance += 0.02;
    else if (pr.status === 'engaged') chance += 0.01;

    // Love language (touch) boost — per design request
    if (touchWeight >= 0.85) chance += 0.12;
    else if (touchWeight >= 0.65) chance += 0.07;
    else if (touchWeight <= 0.2) chance -= 0.02;

    chance += trait;

    // Clamp to keep it rare
    chance = Math.max(0.01, Math.min(0.25, chance));
    return { chance, ll };
  };

  const doAskOpenRelationship = async () => {
    const availability = canUse('openRelTalk', 1);
    if (!availability.ok) return;

    const ok = await confirm({
      title: "Ask for an open relationship?",
      description:
        `This is a big conversation.\n\n` +
        `✅ If they say YES, the game treats it as consensual (not cheating).\n` +
        `⚠️ It still increases health risk and can add strain.\n\n` +
        `No explicit details (PG-13).\n\nProceed?`,
      confirmText: "Ask",
      cancelText: "Cancel",
      destructive: false
    });

    if (!ok) return;

    const { pr, openRel } = getOpenRelState();
    const { chance, ll } = computeOpenRelationshipYesChance();

    const rollRng = createSeededRng(
      `${gameState.runSeed || 0}|openRelAsk|${gameState.currentYear}|${person.name}|${Math.round(meter)}|${openRel.askedAtAge ?? 'na'}`
    );
    const accepted = rollRng.nextFloat() < chance;

    const detailAccepted =
      `${person.name} listens carefully.\n\n` +
      `They say: "Okay. If we do this, it has to be honest, respectful, and we keep communicating."\n\n` +
      `You both agree on boundaries (PG-13 version: "clear expectations").\n\n` +
      `⚠️ More partners = more health risk. Choose responsibly.`;

    const detailRejected =
      `${person.name} listens… then shakes their head.\n\n` +
      `They say: "No. I'm not comfortable with that."\n\n` +
      `You can recommit — or keep making choices that turn into consequences.`;

    updateRelationship({
      actionId: 'openRelTalk',
      actionLabel: accepted ? 'Open Relationship: Yes' : 'Open Relationship: No',
      emoji: accepted ? '🔓' : '🔒',
      meterDelta: accepted ? -1 : -6,
      stressDelta: accepted ? 0.15 : 0.25,
      detail: accepted ? detailAccepted : detailRejected
    });

    const nextOpenRel = {
      ...(openRel || {}),
      askedAtAge: gameState.currentYear,
      active: accepted ? true : false,
      openedAtAge: accepted ? (openRel?.openedAtAge ?? gameState.currentYear) : (openRel?.openedAtAge ?? null),
      closedAtAge: accepted ? null : (openRel?.closedAtAge ?? null),
      lastAnswer: accepted ? 'yes' : 'no'
    };

    updateState({
      partnerRelationship: {
        ...(pr || {}),
        loveLanguages: pr.loveLanguages || ll,
        openRelationship: nextOpenRel
      }
    });
  };

  const doCloseOpenRelationship = async () => {
    const availability = canUse('closeOpenRel', 1);
    if (!availability.ok) return;

    const ok = await confirm({
      title: "Close the open relationship?",
      description:
        `This switches you back to a closed relationship.\n\n` +
        `Any future "date someone else" choices will count as cheating again.\n\nProceed?`,
      confirmText: "Close it",
      cancelText: "Cancel",
      destructive: false
    });

    if (!ok) return;

    const pr = gameState.partnerRelationship || {};
    const openRel = pr.openRelationship || {};

    updateRelationship({
      actionId: 'closeOpenRel',
      actionLabel: 'Close Open Relationship',
      emoji: '🔒',
      meterDelta: 0,
      stressDelta: -0.05,
      detail:
        `You and ${person.name} talk it through and agree to close the relationship.\n\n` +
        `Less complexity. More clarity.\n\n` +
        `✅ Still PG-13. Still real-life vibes.`
    });

    updateState({
      partnerRelationship: {
        ...pr,
        openRelationship: {
          ...(openRel || {}),
          active: false,
          closedAtAge: gameState.currentYear
        }
      }
    });
  };

  const doElope = async () => {
    if (person.role !== 'side_partner') return;

    const yesAsk = await confirm({
      title: '💍 Elope?',
      description: `Ask ${person.name} to elope.\n\nIf they say yes, you can choose to divorce your current partner and marry ${person.name} instead.`,
      confirmText: 'Ask to elope',
      cancelText: 'Cancel'
    });
    if (!yesAsk) return;

    const meter = Number(person.meter ?? 50);
    let baseChance = 25;
    if (meter >= 85) baseChance = 90;
    else if (meter >= 75) baseChance = 75;
    else if (meter >= 65) baseChance = 60;
    else if (meter >= 55) baseChance = 45;

    const roll = Math.random() * 100;
    const accepted = roll < Math.min(95, baseChance);

    if (!accepted) {
      updateRelationship({
        actionId: 'elopeRejected',
        actionLabel: 'Elope (Rejected)',
        emoji: '💔',
        meterDelta: -12,
        stressDelta: 0.6,
        moneyDelta: 0,
        detail: `${person.name} says no. "This is… too much."`
      });
      return;
    }

    const yesProceed = await confirm({
      title: '✅ They said yes',
      description: `Elope with ${person.name} now?\n\nThis will end your current relationship and make ${person.name} your spouse.`,
      confirmText: 'Elope now',
      cancelText: 'Not yet'
    });
    if (!yesProceed) {
      updateRelationship({
        actionId: 'elopeDeferred',
        actionLabel: 'Elope (Later)',
        emoji: '⏳',
        meterDelta: 2,
        stressDelta: 0,
        moneyDelta: 0,
        detail: `You both agree to wait.`
      });
      return;
    }

    // Perform divorce/breakup + promote side partner to partner
    updateState(prev => {
      let state = prev;

      const hadPartner = !!(prev.partnerName || prev.relationships?.byId?.partner);
      const wasMarried = prev.partnerRelationship?.status === 'married';

      if (hadPartner) {
        const mode = wasMarried ? 'divorce' : 'breakup';
        state = finalizePartnerSeparation(state, { mode });
      }

      const rel = state.relationships || { roster: [], byId: {} };
      const oldSide = rel.byId?.[person.id] || person;

      const createdAtAge = Number(oldSide.createdAtAge ?? state.currentYear);
      const ageAtMeet = Number(oldSide.age ?? 28);
      const baseAge = ageAtMeet - createdAtAge;

      const partnerMeter = clamp(Number(oldSide.meter ?? 60) + 6);
      const partnerPerson = {
        ...oldSide,
        id: 'partner',
        role: 'partner',
        baseAge,
        meter: partnerMeter,
        notes: 'Partner (formerly side partner)'
      };

      const rosterWithoutSide = (rel.roster || []).filter(p => p.id !== person.id && p.id !== 'partner');
      const byId = { ...(rel.byId || {}) };
      delete byId[person.id];
      delete byId['partner'];

      const partnerCareer =
        state.partnerCareer ||
        computeRandomPartnerCareer({
          seed: `${state.runSeed || 0}|partnerCareer|${partnerPerson.name}`,
          ageAtBirth: state.parentCareer?.ageAtBirth || 30
        });

      const partnerAge = Number.isFinite(Number(partnerPerson.age)) ? Number(partnerPerson.age) : (Number.isFinite(Number(partnerPerson.baseAge)) ? Number(partnerPerson.baseAge) : 28);
      const wealth = generatePartnerWealth({
        seed: `${state.runSeed || 0}|partnerWealth|${partnerPerson.name}|${partnerAge}`,
        age: partnerAge,
        countryIso3: state.countryIso3 || 'USA'
      });

      const yourNetWorthAtMarriage = computeNetWorthBreakdown(state).total;
      const partnerWealthAtMarriage = wealth.amount || 0;

      const loveLanguages = partnerPerson.loveLanguages || null;

      return {
        ...state,
        householdType: 'two',
        partnerName: partnerPerson.name,
        partnerEmoji: partnerPerson.emoji,
        partnerMeter,
        partnerAgeAtBirth: baseAge,
        partnerAvatarGender: partnerPerson.avatarGenderKey || state.partnerAvatarGender,
        partnerAvatarSpriteIndex: partnerPerson.avatarSpriteIndex ?? state.partnerAvatarSpriteIndex,
        partnerCareer,
        partnerRelationship: {
          status: 'married',
          metAtAge: partnerPerson.createdAtAge ?? state.currentYear,
          engagedAtAge: null,
          marriedAtAge: state.currentYear,
          ring: null,
          wedding: { id: 'elope', label: 'Elope', cost: 0, partnerMeterDelta: 6 },
          wealth: { ...wealth, knownTier: true, knownAmount: true },
          prenup: { decided: true, asked: false, signed: false, refused: false, decidedAtAge: state.currentYear },
          marriageFinance: {
            playerNetWorthAtMarriage: yourNetWorthAtMarriage,
            partnerWealthAtMarriage,
            mergedWealthAtAge: state.currentYear
          },
          ...(loveLanguages ? { loveLanguages } : {})
        },
        relationships: {
          ...rel,
          roster: [...rosterWithoutSide, partnerPerson],
          byId: { ...byId, partner: partnerPerson }
        },
        birthControl: { ...(state.birthControl || { playerOn: false, partnerOn: false }), partnerOn: false }
      };
    });

    if (gameState.partnerRelationship?.status === 'married') {
      const { settlement } = computeDivorceSettlement(gameState);
      if (settlement > 0) applyMoneyDelta(-settlement, 'Divorce settlement');
    }

    addLog(`💍 You eloped with ${person.name}.`);
    recordTimelineEntry({
      kind: 'relationship',
      title: `💍 Eloped with ${person.name}`,
      detail: 'Your spouse has changed.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 1
    });

    onClose();
  };

  // Build actions each render so onClick closures always use the latest person + state.
  const actions = (() => {
    if (isDead) {
      return [{ id: 'mourn', label: 'Mourn', emoji: '🪦', onClick: () => {
        if (person.lastMournedYear === currentYear) return;
        updateState(prev => {
          const newRoster = prev.relationships.roster.map(p => p.id === personId ? { ...p, lastMournedYear: currentYear } : p);
          return {
            ...prev,
            relationships: {
              ...prev.relationships,
              roster: newRoster,
              byId: { ...prev.relationships.byId, [personId]: { ...person, lastMournedYear: currentYear } }
            }
          };
        });
        applyStress(1);
        addLog(`You mourned ${person.name}.`);
      }, focusCost: 1 }];
    }

    if (person.identityStatus === 'sealed_until_18') {
      const canReveal = currentYear >= 18;
      return [{ id: 'requestIdentity', label: 'Request Donor Identity', emoji: '📜', onClick: () => {
        if (!canReveal) return;
        // Reveal logic placeholder
      }, disabled: !canReveal, noFocusCost: true }];
    }

    if (person.identityStatus === 'unknown') {
      return [{ id: 'investigate', label: 'Investigate', emoji: '🔍', onClick: () => {
        // Investigation placeholder
      }, noFocusCost: true }];
    }

    const isFamilyRole = ['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'].includes(person.role);
    const familyActions = isFamilyRole ? [
      { id: 'repairTalk', label: 'Repair Talk', emoji: '🧵', onClick: doRepairTalk },
      { id: 'setBoundary', label: 'Set Boundary', emoji: '🧱', onClick: doSetBoundary },
      { id: 'askSupport', label: 'Ask for Support', emoji: '🤝', onClick: doAskForSupport },
      { id: 'makeJoke', label: 'Make a Joke', emoji: '🎭', onClick: doMakeJoke },
      { id: 'apologize', label: 'Apologize Properly', emoji: '🫶', onClick: doApologize },
      { id: 'doNothing', label: 'Let It Pass', emoji: '🪶', onClick: doLetItPass, focusCost: 0 },
    ] : [];

    const base = [
      ...((person.role === 'my_mom' || person.role === 'my_dad') ? [{ id: 'grandkidTime', label: 'Grandkid Time', emoji: '👵👴', onClick: doGrandkidTime }] : []),
      { id: 'talk', label: 'Talk', emoji: '💬', onClick: doTalk },
      { id: 'compliment', label: 'Compliment', emoji: '🌟', onClick: doCompliment },
      { id: 'spendTime', label: 'Spend Time', emoji: '⏳', onClick: doSpendTime },
      { id: 'gift', label: 'Gift', emoji: '🎁', onClick: startGift },
      ...((person.role !== 'child' && person.role !== 'teacher') ? [{ id: 'giveMoney', label: 'Give Money', emoji: '💵', onClick: startGiveMoney }] : []),
      ...familyActions,
    ];

    if (person.role !== 'child') {
      base.push({ id: 'argue', label: 'Argue', emoji: '🔥', onClick: doArgue });
    }

    // Determine player and spouse genders
    const playerGender = (() => {
      const role = String(gameState.parentRole || '').toLowerCase();
      const gender = String(gameState.parentAvatarGender || gameState.playerGender || '').toLowerCase();
      if (role === 'mom' || gender === 'female' || gender === 'f') return 'female';
      if (role === 'dad' || gender === 'male' || gender === 'm') return 'male';
      return null;
    })();

    if (person.role === 'partner') {
      const partnerRelationship = gameState.partnerRelationship || { status: 'partnered' };
      const status = partnerRelationship.status;
      const relationshipActions = [];
      if (status === 'partnered') {
        relationshipActions.push({ id: 'propose', label: '💍 Propose', emoji: '💍', onClick: startPropose, noFocusCost: true });
        relationshipActions.push({ id: 'breakUp', label: '💔 Break Up', emoji: '💔', onClick: doBreakUp, noFocusCost: true });
      }
      if (status === 'engaged') {
        relationshipActions.push({ id: 'planWedding', label: '💒 Plan Wedding', emoji: '💒', onClick: startWedding, noFocusCost: true });
        relationshipActions.push({ id: 'breakUp', label: '💔 Break Up', emoji: '💔', onClick: doBreakUp, noFocusCost: true });
      }
      if (status === 'married') {
        relationshipActions.push({ id: 'loveLanguageTalk', label: '🫀 Love Language Talk', emoji: '🫀', onClick: doLoveLanguageTalk });
        relationshipActions.push({ id: 'divorce', label: '💔 Divorce', emoji: '💔', onClick: doDivorce, noFocusCost: true });
      }
      
      const partnerGender = (() => {
        const gender = String(gameState.partnerAvatarGender || gameState.partnerGender || '').toLowerCase();
        if (gender === 'female' || gender === 'f') return 'female';
        if (gender === 'male' || gender === 'm') return 'male';
        return null;
      })();
      
      const isMaleFemaleCouple = playerGender && partnerGender && playerGender !== partnerGender;

      return [
        ...(isMaleFemaleCouple ? [{ id: 'tryForBaby', label: 'Try for a Baby', emoji: '👶', onClick: doTryForBaby, disabled: tryForBabyBusy }] : []),
        { id: 'dateNight', label: 'Date Night', emoji: '💞', onClick: startDateNight },
        {
          id: (gameState.partnerRelationship?.openRelationship?.active ? 'closeOpenRel' : 'openRelTalk'),
          label: (gameState.partnerRelationship?.openRelationship?.active ? 'Close Open Relationship' : 'Ask for an Open Relationship'),
          emoji: (gameState.partnerRelationship?.openRelationship?.active ? '🔒' : '🔓'),
          onClick: (gameState.partnerRelationship?.openRelationship?.active ? doCloseOpenRelationship : doAskOpenRelationship)
        },
        { id: 'laugh', label: 'Laugh Together', emoji: '😂', onClick: doLaugh },
        { id: 'coParentSync', label: 'Co-parent Sync', emoji: '🗓️', onClick: doCoParentSync },
        { id: 'affection', label: 'Affection', emoji: '💞', onClick: doAffection },
        { id: 'homeReset', label: 'Household Reset', emoji: '🧼', onClick: doHomeReset },
        { id: 'repair', label: 'Repair', emoji: '🪛', onClick: doRepair, requires: 'argue' },
        ...relationshipActions,
        ...base,
      ];
    }

    if (person.role === 'side_partner') {
      base.unshift({ id: 'dateNight', label: 'Go on a Date', emoji: '💞', onClick: startDateNight });
      base.push({ id: 'loveLanguageTalk', label: 'Love Language Talk', emoji: '🫀', onClick: doLoveLanguageTalk });
      base.push({ id: 'elope', label: 'Elope', emoji: '💍', onClick: doElope, noFocusCost: true, focusCost: 0 });
    }

    // Show "Try for a Baby" for wife/husband roles too
    if (person.role === 'wife' || person.role === 'husband') {
      const spouseGender = person.role === 'wife' ? 'female' : 'male';
      const isMaleFemaleCouple = playerGender && playerGender !== spouseGender;
      
      if (isMaleFemaleCouple) {
        return [
          { id: 'tryForBaby', label: 'Try for a Baby', emoji: '👶', onClick: doTryForBaby, disabled: tryForBabyBusy },
          ...base
        ];
      }
    }

    return base;
  })();

  const renderActionButton = (a) => {
    // Optional per-action requirement: must have done another action this year.
    if (a.requires && !usedActionsThisYear?.[a.requires]) {
      return (
        <button
          key={a.id}
          disabled
          className="w-full rounded-xl border p-3 text-left bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{a.emoji}</span>
              <span className="font-semibold">{a.label}</span>
            </div>
            <span className="text-xs text-slate-500">{a.focusCost || 1} focus</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Do "{a.requires === 'argue' ? 'Argue' : a.requires}" first (this year).</div>
        </button>
      );
    }

    // Special actions that don't cost focus
    if (a.noFocusCost || a.focusCost === 0) {
      return (
        <button
          key={a.id}
          onClick={a.onClick}
          className="w-full rounded-xl border-2 p-3 text-left transition-colors bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{a.emoji}</span>
              <span className="font-semibold">{a.label}</span>
            </div>
            {a.focusCost === 0 && <span className="text-xs text-slate-500">Free</span>}
          </div>
        </button>
      );
    }

    const availability = canUse(a.id, a.focusCost || 1);
    const disabled = Boolean(a.disabled) || !availability.ok;
    return (
      <button
        key={a.id}
        onClick={a.onClick}
        disabled={disabled}
        className={`w-full rounded-xl border p-3 text-left transition-colors ${
          disabled
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : 'bg-white hover:bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{a.emoji}</span>
            <span className="font-semibold">{a.label}</span>
          </div>
          <span className="text-xs text-slate-500">{a.focusCost || 1} focus</span>
        </div>
        {disabled && (a.disabled ? (
          <div className="mt-1 text-xs text-slate-500">In progress...</div>
        ) : availability.reason ? (
          <div className="mt-1 text-xs text-slate-500">{availability.reason}</div>
        ) : null)}
      </button>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[110]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col min-h-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white shrink-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {(() => {
                      const meta = getSpriteMetaForPerson(person, gameState);
                      return (
                        <PlayerSpriteAvatar
                          genderKey={meta.genderKey}
                          ageNumber={meta.ageNumber}
                          index={meta.index}
                          size={64}
                          fallbackEmoji={person.emoji}
                          className="rounded-2xl bg-white/10 border border-white/20 shadow-sm"
                        />
                      );
                    })()}
                    <div className="min-w-0">
                      <div className="text-xl font-bold truncate">{person.name}</div>
                      <div className="text-white/70 text-sm">{(() => { const ageNow = computePersonAgeNumber(person, gameState); const dead = isPersonDead(person); return `${roleLabel}${(!dead && Number.isFinite(Number(ageNow)) ? ` • Age ${ageNow}` : '')}`; })()}</div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4">
                  {isDead ? (
                    <div className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-sm text-white/90">
                      <div className="flex items-center gap-2">
                        <span>🪦</span>
                        <span>Deceased — died in Year {person.deathYear} at age {Number(person.baseAge) + Number(person.deathYear)} ({person.causeOfDeath})</span>
                      </div>
                      <Button
                        onClick={() => {
                          if (person.lastMournedYear === currentYear) return;
                          updateState(prev => {
                            const newRoster = prev.relationships.roster.map(p => p.id === personId ? { ...p, lastMournedYear: currentYear } : p);
                            return {
                              ...prev,
                              relationships: {
                                ...prev.relationships,
                                roster: newRoster,
                                byId: { ...prev.relationships.byId, [personId]: { ...person, lastMournedYear: currentYear } }
                              }
                            };
                          });
                          applyStress(1);
                          addLog(`You mourned ${person.name}.`);
                        }}
                        disabled={person.lastMournedYear === currentYear}
                        className="mt-2 w-full"
                      >
                        Mourn
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500" style={{ width: `${meter}%` }} />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-white/80">
                        <span>Relationship</span>
                        <span className="font-semibold">{meter}/100</span>
                      </div>
                    </>
                  )}
                  
                  {person.role === 'partner' && (() => {
                    const openRel = (gameState.partnerRelationship?.openRelationship || {});
                    if (!openRel?.active) return null;
                    return (
                      <div className="mt-2 inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-200/30 text-emerald-50">
                        <span>🔓</span>
                        <span className="font-semibold">Open relationship</span>
                        {Number.isFinite(Number(openRel.openedAtAge)) ? (
                          <span className="text-emerald-100/80">since Year {openRel.openedAtAge}</span>
                        ) : null}
                      </div>
                    );
                  })()}
                  
                  {/* Family Dynamics Stats (family roles only) */}
                  {!isDead && ['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'].includes(person.role) && (() => {
                    const fd = gameState.familyDynamics || {};
                    const personStats = fd.perPerson?.[person.id] || initializePersonStats(gameState, person.id);
                    const trajectory = computeTrajectory(personStats);
                    const trajectoryData = TRAJECTORIES[trajectory] || TRAJECTORIES.cordial;
                    const activeScripts = computeActiveScripts(gameState, person.role);
                    
                    return (
                      <div className="mt-3 space-y-2">
                        {/* Three-bar stats */}
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div>
                            <div className="text-white/60 mb-0.5">Trust</div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-400" 
                                style={{ width: `${personStats.trust}%` }}
                              />
                            </div>
                            <div className="text-white/80 mt-0.5">{personStats.trust}</div>
                          </div>
                          <div>
                            <div className="text-white/60 mb-0.5">Closeness</div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-400" 
                                style={{ width: `${personStats.closeness}%` }}
                              />
                            </div>
                            <div className="text-white/80 mt-0.5">{personStats.closeness}</div>
                          </div>
                          <div>
                            <div className="text-white/60 mb-0.5">Friction</div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-400" 
                                style={{ width: `${personStats.friction}%` }}
                              />
                            </div>
                            <div className="text-white/80 mt-0.5">{personStats.friction}</div>
                          </div>
                        </div>
                        
                        {/* Trajectory */}
                        <div className="text-[11px] text-white/90">
                          <span className="text-white/60">Trajectory:</span> {trajectoryData.emoji} {trajectoryData.label} — {trajectoryData.description}
                        </div>
                        
                        {/* Active Scripts */}
                        {activeScripts.scriptIds.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {activeScripts.scriptIds.slice(0, 3).map(scriptId => {
                              const script = FAMILY_SCRIPTS[scriptId];
                              const intensity = activeScripts.intensityMap[scriptId] || 0;
                              return (
                                <div 
                                  key={scriptId}
                                  className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white/90 flex items-center gap-1"
                                  title={`${script.description} (Intensity: ${intensity})`}
                                >
                                  <span>{script.emoji}</span>
                                  <span>{script.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {person.role === 'partner' ? (() => {
                    const pr = gameState.partnerRelationship || {};
                    const w = pr.wealth;
                    const pn = pr.prenup;

                    return (
                      <div className="mt-2 space-y-1 text-[11px] text-white/80">
                        {w ? (
                          <>
                            <div>
                              💰 Wealth vibe: {w.emoji} {w.label}
                              {(pr.status === 'married' || w.knownAmount) ? ` • $${formatMoney(w.amount)}` : ''}
                            </div>
                            <div className="text-white/70 italic">
                              {getWealthVibeHint(w.tierId)}
                            </div>
                          </>
                        ) : null}

                        {pr.status === 'married' ? (
                          <div>
                            📜 Prenup: {pn?.signed ? 'Signed ✅ (future-you thanks you)' : (pn?.decided ? 'None ❌ (YOLO 💸)' : 'Not discussed')}
                          </div>
                        ) : null}

                        <div>
                          <span className={harmonyEligible ? 'font-semibold text-white' : ''}>
                            Co-parent harmony bonus:
                          </span>{' '}
                          +1 to all kid stats and -1 Stress at Age Up when Relationship is 80+.
                          {harmonyEligible ? ' (Active)' : ''}
                        </div>
                      </div>
                    );
                  })() : null}
                </div>
              </div>

              {/* Content */}
              <div
                className="flex-1 min-h-0 overflow-y-auto p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {person.notes ? (
                  <div className="mb-4 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    {person.notes}
                  </div>
                ) : null}

                {['my_mom', 'my_dad', 'sibling', 'inlaw_mom', 'inlaw_dad'].includes(person.role) ? (
                  <div className="mb-4 text-xs text-slate-500 bg-amber-50/50 border border-amber-200/50 rounded-xl p-3">
                    Family is complicated. Old patterns can make connection harder—repair helps.
                  </div>
                ) : null}

                {person.role === 'child' ? (
                  <div className="text-sm text-slate-600">
                    Your relationship with {person.name} is shaped by your daily choices.
                    Use the main Actions tab to bond, play, guide, and show up.
                  </div>
                ) : (
                  <>
                    {scenarioBlocked ? (
                      <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        A mandatory scenario is waiting. Finish it before doing relationship actions.
                      </div>
                    ) : null}

                    {person.role === 'partner' && gameState.partnerRelationship?.status === 'married' ? (
                      <div className="mb-4 bg-pink-50 border border-pink-200 rounded-xl p-3">
                        <div className="font-semibold text-slate-800 mb-1">💗 Love Language Radar</div>
                        <div className="text-xs text-slate-600 mb-2">
                          One of these is a guaranteed 0% dead zone. Figure it out by trying actions… or by talking.
                        </div>

                        <div className="grid grid-cols-1 gap-1 text-xs">
                          {LOVE_LANGUAGES.map(ll => {
                            const state = gameState.partnerRelationship?.loveLanguages?.discovered?.[ll.id] || 'unknown';
                            const badge =
                              state === 'primary' ? '✅' :
                              state === 'liked' ? '🙂' :
                              state === 'meh' ? '😐' :
                              state === 'dead' ? '🚫' :
                              '❓';
                            const label =
                              state === 'primary' ? 'They LOVE this' :
                              state === 'liked' ? 'They like this' :
                              state === 'meh' ? 'Neutral' :
                              state === 'dead' ? '0% dead zone' :
                              'Unknown';

                            return (
                              <div key={ll.id} className="flex items-center justify-between bg-white/60 border border-pink-100 rounded-lg px-2 py-1">
                                <div className="flex items-center gap-2">
                                  <span>{ll.emoji}</span>
                                  <span className="font-medium text-slate-700">{ll.label}</span>
                                </div>
                                <div className="text-slate-600">
                                  <span className="mr-1">{badge}</span>{label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {person.role === 'side_partner' && picker === null ? (() => {
                      const sideLL = gameState.relationships?.byId?.[person.id]?.loveLanguages || person.loveLanguages;
                      if (sideLL && sideLL.weights) {
                        return (
                          <div className="mb-4 bg-pink-50 border border-pink-200 rounded-xl p-3">
                            <div className="font-semibold text-slate-800 mb-1">💗 Love Language Radar</div>
                            <div className="text-xs text-slate-600 mb-2">
                              One of these is a guaranteed 0% dead zone. Figure it out by trying actions… or by talking.
                            </div>

                            <div className="grid grid-cols-1 gap-1 text-xs">
                              {LOVE_LANGUAGES.map(ll => {
                                const discoveredState = sideLL.discovered?.[ll.id] || 'unknown';
                                const badge =
                                  discoveredState === 'primary' ? '✅' :
                                  discoveredState === 'liked' ? '🙂' :
                                  discoveredState === 'meh' ? '😐' :
                                  discoveredState === 'dead' ? '🚫' :
                                  '❓';
                                const label =
                                  discoveredState === 'primary' ? 'They LOVE this' :
                                  discoveredState === 'liked' ? 'They like this' :
                                  discoveredState === 'meh' ? 'Neutral' :
                                  discoveredState === 'dead' ? '0% dead zone' :
                                  'Unknown';

                                return (
                                  <div key={ll.id} className="flex items-center justify-between bg-white/60 border border-pink-100 rounded-lg px-2 py-1">
                                    <div className="flex items-center gap-2">
                                      <span>{ll.emoji}</span>
                                      <span className="font-medium text-slate-700">{ll.label}</span>
                                    </div>
                                    <div className="text-slate-600">
                                      <span className="mr-1">{badge}</span>{label}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })() : null}

                    {picker === null ? (
                       <div className="grid grid-cols-1 gap-3">
                         {actions.map(renderActionButton)}
                       </div>
                     ) : null}

                    {picker === 'gift' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-800">Pick a gift</div>
                          <button
                            className="text-sm text-slate-500 hover:text-slate-700"
                            onClick={() => setPicker(null)}
                          >
                            Cancel
                          </button>
                        </div>
                        {GIFT_OPTIONS.map(opt => {
                          const availability = canUse('gift', 1);
                          const disabled = !availability.ok;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => doGift(opt)}
                              disabled={disabled}
                              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                disabled
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-white hover:bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{opt.emoji}</span>
                                  <span className="font-semibold">{opt.label}</span>
                                </div>
                                <div className="text-xs text-slate-500">-${opt.cost}</div>
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                Relationship +{opt.meterDelta}
                              </div>
                              {disabled && availability.reason ? (
                                <div className="mt-1 text-xs text-slate-500">{availability.reason}</div>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {picker === 'giveMoney' ? (
                      (() => {
                        const max = Math.max(0, Math.floor(Number(gameState.money) || 0));
                        const availability = canUse('giveMoney', 1);
                        const disabled = !availability.ok || (Number(moneyGiftAmount) || 0) <= 0 || (Number(moneyGiftAmount) || 0) > max || max <= 0;
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-slate-800">Offer money</div>
                              <button className="text-sm text-slate-500 hover:text-slate-700" onClick={() => setPicker(null)}>Cancel</button>
                            </div>
                            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
                              Your money: ${formatMoney(max)}
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={moneyGiftAmount}
                                  onChange={(e) => {
                                    const v = Math.floor(Number(e.target.value) || 0);
                                    const clamped = Math.max(0, Math.min(max, v));
                                    setMoneyGiftAmount(clamped);
                                  }}
                                  className="w-40"
                                />
                                <button
                                  onClick={() => setMoneyGiftAmount(max)}
                                  className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                                >
                                  Max
                                </button>
                              </div>
                              <div className="px-1">
                                <Slider
                                  value={[Math.max(0, Math.min(max, Number(moneyGiftAmount) || 0))]}
                                  min={0}
                                  max={max}
                                  step={1}
                                  onValueChange={(vals) => {
                                    const v = Math.floor(Number(vals?.[0]) || 0);
                                    const clamped = Math.max(0, Math.min(max, v));
                                    setMoneyGiftAmount(clamped);
                                  }}
                                />
                              </div>
                            </div>
                            {max <= 0 ? (
                              <div className="text-xs text-slate-500">You don’t have money to give.</div>
                            ) : null}
                            <button
                              onClick={doGiveMoney}
                              disabled={disabled}
                              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                disabled ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">💵</span>
                                  <span className="font-semibold">Offer</span>
                                </div>
                                <span className="text-xs text-slate-500">{availability.ok ? '1 focus' : availability.reason}</span>
                              </div>
                            </button>
                          </div>
                        );
                      })()
                    ) : null}

                    {picker === 'dateNight' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-800">
                            Plan a date night with {person.name}
                          </div>
                          <button
                            className="text-sm text-slate-500 hover:text-slate-700"
                            onClick={() => setPicker(null)}
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
                          Dates are usually a net positive, but not always. Outcomes can be <span className="font-semibold">Great / Good / Meh / Bad</span>.
                          Bad dates can raise stress — real life vibes.
                        </div>

                        {(() => {
                          const openActive = !!(gameState.partnerRelationship?.openRelationship?.active);
                          return (
                            <button
                              onClick={() => setSideDatingOpen(true)}
                              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                openActive
                                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400'
                                  : 'bg-gradient-to-br from-amber-50 to-slate-50 border-amber-200 hover:border-amber-400'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{openActive ? '🔓' : '🕶️'}</span>
                                  <span className="font-semibold">
                                    {openActive ? 'Date someone new (open relationship)' : 'Find someone else to date (on the side)'}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500">1 focus</span>
                              </div>
                              <div className="mt-1 text-xs text-slate-600">
                                {openActive
                                  ? 'Consent is on. Still: more people = more health risk.'
                                  : 'This is cheating. It can blow up your relationship and create health consequences.'}
                              </div>
                            </button>
                          );
                        })()}

                        {(() => {
                          const availability = canUse('dateNight', 1);
                          const disabled = !availability.ok;

                          return (
                            <>
                              <button
                                onClick={() => doDateNight(DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)])}
                                disabled={disabled}
                                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                  disabled
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-semibold">Surprise me</span>
                                  </div>
                                  <span className="text-xs text-slate-500">1 focus</span>
                                </div>
                                {disabled && availability.reason ? (
                                  <div className="mt-1 text-xs text-slate-500">{availability.reason}</div>
                                ) : (
                                  <div className="mt-1 text-xs text-slate-600">
                                    Random date idea → random outcome → story.
                                  </div>
                                )}
                              </button>

                              <div className="space-y-5">
                                {groupedDateIdeas.map(([category, ideas]) => (
                                  <div key={category}>
                                    <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase mb-2">
                                      {category}
                                    </div>

                                    <div className="space-y-2">
                                      {ideas.map((idea) => {
                                        const availability2 = canUse('dateNight', 1);
                                        const disabled2 = !availability2.ok;

                                        return (
                                          <button
                                            key={idea.id}
                                            onClick={() => doDateNight(idea)}
                                            disabled={disabled2}
                                            className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                              disabled2
                                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                                : 'bg-white hover:bg-slate-50 border-slate-200'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <span className="text-lg">{idea.emoji}</span>
                                                <span className="font-semibold">{idea.label}</span>
                                              </div>
                                              <div className="text-xs text-slate-500">
                                                ~${formatMoney(idea.baseCost || 0)}
                                              </div>
                                            </div>

                                            <div className="mt-1 text-xs text-slate-600">
                                              {idea.blurb}
                                            </div>

                                            <div className="mt-2 text-[11px] text-slate-500">
                                              Risk: {idea.risk || 'medium'} • Focus: 1
                                            </div>

                                            {disabled2 && availability2.reason ? (
                                              <div className="mt-1 text-xs text-slate-500">{availability2.reason}</div>
                                            ) : null}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : null}

                    {picker === 'propose' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-800">Choose a ring</div>
                          <button
                            className="text-sm text-slate-500 hover:text-slate-700"
                            onClick={() => setPicker(null)}
                          >
                            Cancel
                          </button>
                        </div>
                        {ENGAGEMENT_RINGS.map(ring => {
                          const canAfford = gameState.money >= ring.cost;
                          return (
                            <button
                              key={ring.id}
                              onClick={() => canAfford && doPropose(ring)}
                              disabled={!canAfford}
                              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                !canAfford
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-white hover:bg-pink-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{ring.emoji}</span>
                                  <span className="font-semibold">{ring.label}</span>
                                </div>
                                <div className="text-xs text-slate-500">-${formatMoney(ring.cost)}</div>
                              </div>
                              <div className="mt-1 text-xs text-slate-600">{ring.description}</div>
                              <div className="mt-1 text-xs text-slate-500">
                                Acceptance bonus: +{ring.acceptanceBonus}%
                              </div>
                              {!canAfford && (
                                <div className="mt-1 text-xs text-red-600">Not enough money</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </motion.div>
          
          <WeddingPlannerModal
            open={weddingPlannerOpen}
            onClose={() => setWeddingPlannerOpen(false)}
            onConfirm={doWedding}
          />

          <SideDatingModal
            open={sideDatingOpen}
            onClose={() => setSideDatingOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}