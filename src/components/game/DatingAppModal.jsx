import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { X, ChevronLeft, Shuffle, Sparkles, UserPlus } from 'lucide-react';

import { useGameState, formatMoney, toRealBool } from './GameStateContext';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import SideDatingModal from './SideDatingModal';
import { getSpriteMetaForPerson, getSpriteMetaForDatingProfile } from '@/components/game/relationshipSpriteUtils';
import DatingRevealModal from './DatingRevealModal';
import DatingProfileModal from './DatingProfileModal';
import { DATING_ABOUT_LINES } from './datingAboutLines';
import { computeRandomPartnerCareer } from './jobSystem';
import { generateFamilyPatternsForMatch } from './familyPatterns';
import { ENGAGEMENT_RINGS } from './relationshipMarriageData';
import { DATE_IDEAS, rollDateOutcome, clampMeter } from './datingDateNightData';
import CelebritySignupModal from './CelebritySignupModal';
import CelebrityDatingHub from './CelebrityDatingHub';
import { getFunnyRejectionLine } from './rejectionLinesData';
import { DATING_AGE_RANGES, DATING_ROSTER_SIZE, DATING_REFRESH_COST, generateDatingRoster } from './DatingV2Data';
import { generatePartnerWealth } from './relationshipWealthData';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

function baseChanceForMeter(meter) {
  if (meter >= 80) return 90;
  if (meter >= 70) return 75;
  if (meter >= 60) return 60;
  return 35;
}

export default function DatingAppModal({ open, onClose }) {
  const {
    gameState,
    updateState,
    addLog,
    applyLove,
    applyStress,
    applyMoneyDelta,
    spendFocus,
    recordTimelineEntry,
    emitActionResult,
    getLocalAmount,
  } = useGameState();

  const {
    householdType,
    datingPreference,
    currentMatch,
    childName,
    currentYear,
    actionPoints,
    finished,
    partnerName,
    partnerEmoji,
    partnerMeter,
    partnerRelationship,
    datingAgeRangeId,
    datingRoster = [],
    datingRosterMeta = {},
    datingSeenSignatures = [],
    datingMessageMeta = {}
  } = gameState;

  const canUse = !finished && Number(actionPoints ?? 0) >= 1;

  const [view, setView] = useState('main'); // main | ideas | propose
  const [selectedProfile, setSelectedProfile] = useState(null); // V2: Profile modal selection
  const [revealProfile, setRevealProfile] = useState(null);
  const [revealOpen, setRevealOpen] = useState(false);
  const [lastDateResult, setLastDateResult] = useState(null);
  
  const [celebritySignupOpen, setCelebritySignupOpen] = useState(false);
  const [celebrityHubOpen, setCelebrityHubOpen] = useState(false);
  const [sideDatingOpen, setSideDatingOpen] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Reset internal view when opening
  useEffect(() => {
    if (!open) return;
    setView('main');
    setRevealOpen(false);
    setRevealProfile(null);
    setLastDateResult(null);
    setCelebritySignupOpen(false);
    setCelebrityHubOpen(false);
    setSelectedProfile(null);
    setSideDatingOpen(false);
  }, [open]);

  // Normalize Roster Meta (reset counts yearly)
  const normalizeRosterMeta = () => {
    const meta = { ...datingRosterMeta };
    if (meta.refreshCountAge !== currentYear) {
      meta.refreshCountThisAge = 0;
      meta.refreshCountAge = currentYear;
      meta.hiddenSignaturesThisAge = [];
    }
    return meta;
  };

  // Ensure Roster Exists (V2)
  const ensureDatingRoster = (pref, ageRangeId) => {
    if (householdType !== 'single') return;
    if (!pref) return;

    const meta = normalizeRosterMeta();
    
    // Check if stable
    const isStable = meta.generatedAtAge === currentYear &&
                     meta.preference === pref &&
                     meta.ageRangeId === ageRangeId &&
                     datingRoster && datingRoster.length > 0;

    if (isStable) {
      // Just ensure meta is updated if we normalized it
      if (meta.refreshCountAge !== datingRosterMeta.refreshCountAge) {
        updateState({ datingRosterMeta: meta });
      }
      return;
    }

    // Generate new roster
    const newRoster = generateDatingRoster({
      gameState,
      preference: pref,
      ageRangeId,
      excludeSignatures: meta.hiddenSignaturesThisAge || [],
      seenSignatures: datingSeenSignatures,
      size: DATING_ROSTER_SIZE
    });

    const nextMeta = {
      ...meta,
      generatedAtAge: currentYear,
      preference: pref,
      ageRangeId
    };

    const nextSeen = [...datingSeenSignatures, ...newRoster.map(p => p.signature)].slice(-50);

    updateState({
      datingRoster: newRoster,
      datingRosterMeta: nextMeta,
      datingSeenSignatures: nextSeen
    });
  };

  // Auto-generate roster when single + preference chosen + roster empty/stale
  useEffect(() => {
    if (!open) return;
    if (householdType !== 'single') return;
    if (!datingPreference) return;
    ensureDatingRoster(datingPreference, datingAgeRangeId || 'any_18_99');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, householdType, datingPreference, datingAgeRangeId]);

  const handleSetPreference = (preference) => {
    // Clear current selection and roster
    updateState({ datingPreference: preference, datingRoster: [] });
    ensureDatingRoster(preference, datingAgeRangeId || 'any_18_99');
  };

  const handleSetAgeRange = (rangeId) => {
    updateState({ datingAgeRangeId: rangeId, datingRoster: [] });
    ensureDatingRoster(datingPreference, rangeId);
  };

  const refreshRosterClicked = () => {
    const meta = normalizeRosterMeta();
    const count = meta.refreshCountThisAge || 0;
    const cost = count >= 1 ? DATING_REFRESH_COST : 0;

    if (cost > 0 && (gameState.money || 0) < cost) {
      toast.error("Not enough money to refresh your roster.");
      return;
    }

    if (cost > 0) {
      applyMoneyDelta(-cost, 'Dating roster refresh');
    }

    // Generate fresh
    const newRoster = generateDatingRoster({
      gameState,
      preference: datingPreference,
      ageRangeId: datingAgeRangeId,
      excludeSignatures: meta.hiddenSignaturesThisAge || [],
      seenSignatures: datingSeenSignatures,
      size: DATING_ROSTER_SIZE
    });

    const nextMeta = {
      ...meta,
      refreshCountThisAge: count + 1,
      refreshCountAge: currentYear,
      generatedAtAge: currentYear // mark as fresh for this year
    };

    const nextSeen = [...datingSeenSignatures, ...newRoster.map(p => p.signature)].slice(-50);

    updateState({
      datingRoster: newRoster,
      datingRosterMeta: nextMeta,
      datingSeenSignatures: nextSeen
    });

    addLog('🔄 Refreshed dating roster.');
  };

  const hideProfile = (profile) => {
    if (!profile) return;
    
    // Remove from roster
    const nextRoster = datingRoster.filter(p => p.id !== profile.id);
    
    // Add to hidden list
    const meta = normalizeRosterMeta();
    const nextHidden = [...(meta.hiddenSignaturesThisAge || []), profile.signature];
    
    // Top up roster (1 replacement)
    const replacement = generateDatingRoster({
      gameState,
      preference: datingPreference,
      ageRangeId: datingAgeRangeId,
      excludeSignatures: nextHidden,
      seenSignatures: datingSeenSignatures,
      size: 1
    })[0];

    if (replacement) {
      nextRoster.push(replacement);
    }

    updateState({
      datingRoster: nextRoster,
      datingRosterMeta: { ...meta, hiddenSignaturesThisAge: nextHidden }
    });

    // Close modal if open
    setSelectedProfile(null);
    
    toast.info(`You hid ${profile.name}.`);
    recordTimelineEntry?.({
      kind: 'relationship',
      title: `👋 Hid ${profile.name}`,
      detail: `You decided not to pursue this match.`
    });
  };

  const ensureChemistry = (profileId, initialStrength) => {
    const map = { ...(gameState.dating?.chemistryByProfileId || {}) };
    if (map[profileId] === undefined) {
      let val = 50;
      if (initialStrength === 'Strong match') val = 55;
      else if (initialStrength === 'Decent chance') val = 50;
      else val = 45;
      
      map[profileId] = val;
      updateState(prev => ({
        dating: { ...(prev.dating || {}), chemistryByProfileId: map }
      }));
      return val;
    }
    return map[profileId];
  };

  const updateChemistry = (profileId, delta) => {
    updateState(prev => {
      const prevDating = prev.dating || { status: 'single' };
      const map = { ...(prevDating.chemistryByProfileId || {}) };
      const cur = Number(map[profileId] ?? 50);
      map[profileId] = clamp(cur + delta, 0, 100);
      return { dating: { ...prevDating, chemistryByProfileId: map } };
    });
  };

  const onMessageProfile = (profile) => {
    const lastAge = datingMessageMeta?.lastMessagedAgeByProfileId?.[profile.id];
    if (lastAge === currentYear) {
      toast.info("You already messaged them this year.");
      return;
    }

    // Roll outcome
    const roll = Math.random();
    let body = "";
    let chemDelta = 0;
    let stressDelta = 0;

    if (roll < 0.45) {
      chemDelta = 4;
      stressDelta = -0.2;
      body = `${profile.name} replies fast.\n\nIt feels easy. You keep chatting longer than you planned.`;
    } else if (roll < 0.70) {
      chemDelta = 1;
      stressDelta = 0;
      body = `${profile.name} replies with something polite and short.\n\nNot bad. Not fireworks either.`;
    } else if (roll < 0.90) {
      chemDelta = -2;
      stressDelta = 0.3;
      body = getFunnyRejectionLine({
        mode: 'regular',
        type: 'ghost',
        name: profile.name
      });
    } else {
      chemDelta = 2;
      stressDelta = 0;
      body = `${profile.name} replies with a meme that is either hilarious or deeply confusing.\n\nYou laugh anyway.`;
    }

    // Ensure initial chemistry exists before modifying
    ensureChemistry(profile.id, profile.matchStrength);
    updateChemistry(profile.id, chemDelta);
    if (stressDelta !== 0) applyStress(stressDelta, 'Dating message');

    // Update cooldown
    updateState(prev => ({
      datingMessageMeta: {
        ...(prev.datingMessageMeta || {}),
        lastMessagedAgeByProfileId: {
          ...(prev.datingMessageMeta?.lastMessagedAgeByProfileId || {}),
          [profile.id]: prev.currentYear
        }
      }
    }));

    emitActionResult({
      title: "💬 Message",
      body,
      meta: { emoji: "💬" }
    });
  };

  const partnerDisplayName = partnerName || 'Your Partner';
  const partnerDisplayEmoji = partnerEmoji || '❤️';
  const relationshipStatus = partnerRelationship?.status || 'partnered';
  const canPropose = householdType === 'two' && relationshipStatus === 'partnered';

  const groupedDateIdeas = useMemo(() => {
    const groups = {};
    for (const idea of DATE_IDEAS) {
      const key = idea.category || 'Date Ideas';
      if (!groups[key]) groups[key] = [];
      groups[key].push(idea);
    }
    return Object.entries(groups);
  }, []);

  const openCelebrityDatingGate = () => {
    if (gameState.celebrityDatingUnlocked) {
      setCelebrityHubOpen(true);
    } else {
      setCelebritySignupOpen(true);
    }
  };

  const updatePartnerMeter = (delta) => {
    updateState(prev => {
      const current = Number(prev.partnerMeter ?? prev.relationships?.byId?.partner?.meter ?? 70);
      const nextMeter = clamp(current + delta, 0, 100);

      const next = { partnerMeter: nextMeter };

      // If relationships exists, keep it in sync (safe)
      if (prev.relationships?.roster && prev.relationships?.byId) {
        next.relationships = {
          ...prev.relationships,
          roster: prev.relationships.roster.map(p => p.id === 'partner' ? { ...p, meter: nextMeter } : p),
          byId: {
            ...prev.relationships.byId,
            partner: prev.relationships.byId.partner ? { ...prev.relationships.byId.partner, meter: nextMeter } : prev.relationships.byId.partner
          }
        };
      }

      return next;
    });
  };

  const runDate = (idea) => {
    if (!idea) return;

    if (!canUse) {
      toast('You can\'t go on a date right now (need 1 focus).', { icon: '⚠️' });
      return;
    }

    const ok = spendFocus?.(1, `Date Night: ${idea.label}`);
    if (ok === false) {
      toast('Not enough focus.', { icon: '⚠️' });
      return;
    }

    const targetName = householdType === 'two'
      ? partnerDisplayName
      : (currentMatch?.name || 'Your Match');

    const mode = householdType === 'two' ? 'partner' : 'single';

    const outcome = rollDateOutcome({
      ideaId: idea.id,
      context: {
        name: targetName,
        childName: childName || 'your kid'
      },
      mode
    });

    const localCost = getLocalAmount ? getLocalAmount(outcome.moneyCost) : outcome.moneyCost;

    // Apply deltas
    if (localCost > 0) applyMoneyDelta?.(-localCost, `Date: ${idea.label}`);
    if (outcome.stressDelta) applyStress?.(outcome.stressDelta, 'Date Night');
    if (outcome.loveDelta) applyLove?.(outcome.loveDelta, 'Date Night');

    if (householdType === 'two') {
      updatePartnerMeter(outcome.meterDelta);
    } else if (currentMatch?.id) {
      // V2 Compatibility Bonus logic
      let adjustedDelta = outcome.meterDelta;
      if (currentMatch.compatibilityScore >= 75) adjustedDelta += 2;
      else if (currentMatch.compatibilityScore <= 40) adjustedDelta -= 2;
      
      // Clamp reasonable range
      adjustedDelta = Math.max(-12, Math.min(12, adjustedDelta));
      
      updateChemistry(currentMatch.id, adjustedDelta);
    }

    // Log + timeline + action result
    addLog?.(`${idea.emoji} ${outcome.summary}`);

    recordTimelineEntry?.({
      kind: 'relationship',
      title: `${idea.emoji} Date: ${idea.label} with ${targetName}`,
      detail: outcome.story,
      deltas: null,
      moneyDelta: -localCost,
      loveDelta: outcome.loveDelta || 0,
      stressDelta: outcome.stressDelta || 0
    });

    emitActionResult?.({
      actionId: 'date',
      title: `${idea.emoji} ${idea.label} with ${targetName}`,
      body: outcome.story,
      deltas: {},
      loveDelta: outcome.loveDelta || 0,
      stressDelta: outcome.stressDelta || 0,
      moneyDelta: -localCost,
      focusDelta: -1,
      tags: outcome.tags,
      meta: { emoji: idea.emoji, quality: outcome.quality, ideaId: idea.id }
    });

    // Store recap for reveal modal (singles)
    setLastDateResult({
      ...outcome,
      ideaEmoji: idea.emoji,
      ideaLabel: idea.label
    });

    setView('main');

    if (householdType === 'single' && currentMatch) {
      setRevealProfile(currentMatch);
      setRevealOpen(true);
    } else {
      onClose?.();
    }
  };

  const doPropose = (ring) => {
    if (!ring) return;

    const meter = Number(partnerMeter ?? gameState.relationships?.byId?.partner?.meter ?? 70);
    const baseChance = baseChanceForMeter(meter);
    const totalChance = Math.min(95, baseChance + (ring.acceptanceBonus || 0));
    const roll = Math.random() * 100;
    const accepted = roll < totalChance;

    const ringCost = getLocalAmount ? getLocalAmount(ring.cost) : ring.cost;

    applyMoneyDelta?.(-ringCost, `Engagement ring: ${ring.label}`);

    if (accepted) {
      const nextMeter = clamp(meter + 5, 0, 100);

      updateState(prev => ({
        partnerRelationship: {
          ...(prev.partnerRelationship || { status: 'partnered' }),
          status: 'engaged',
          ring,
          engagedAtAge: prev.currentYear
        },
        partnerMeter: nextMeter,
        relationships: prev.relationships?.roster && prev.relationships?.byId ? {
          ...prev.relationships,
          roster: prev.relationships.roster.map(p => p.id === 'partner' ? { ...p, meter: nextMeter } : p),
          byId: {
            ...prev.relationships.byId,
            partner: prev.relationships.byId.partner ? { ...prev.relationships.byId.partner, meter: nextMeter } : prev.relationships.byId.partner
          }
        } : prev.relationships
      }));

      addLog?.(`💍 ${partnerDisplayName} said yes!`);

      emitActionResult?.({
        actionId: 'relationship',
        title: '💍 Engaged!',
        body: `${partnerDisplayName} said yes! You’re engaged.\n\nRing: ${ring.label}`,
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        moneyDelta: -ringCost,
        focusDelta: 0,
        tags: ['relationship', 'engagement'],
        meta: { emoji: '💍', ring: ring.label }
      });

      recordTimelineEntry?.({
        kind: 'relationship',
        title: `💍 Engaged to ${partnerDisplayName}`,
        detail: `Ring: ${ring.label} ($${formatMoney(ringCost)})`,
        deltas: null,
        moneyDelta: -ringCost,
        loveDelta: 0,
        stressDelta: -1
      });
    } else {
      const nextMeter = clamp(meter - 10, 0, 100);

      updatePartnerMeter(-10);
      applyStress?.(1, 'Proposal declined');
      addLog?.(`💔 ${partnerDisplayName} said “not yet.”`);

      emitActionResult?.({
        actionId: 'relationship',
        title: '💔 Proposal Declined',
        body: `${partnerDisplayName} said “not yet.”\n\nIt stings.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: -ringCost,
        focusDelta: 0,
        tags: ['relationship'],
        meta: { emoji: '💔', ring: ring.label }
      });

      recordTimelineEntry?.({
        kind: 'relationship',
        title: `💔 Proposal declined`,
        detail: `${partnerDisplayName} wasn't ready.`,
        deltas: null,
        moneyDelta: -ringCost,
        loveDelta: 0,
        stressDelta: 1
      });
    }

    setView('main');
  };

  // Decisions after pattern reveal (single)
  const handleKeepDating = () => {
    if (!revealProfile) return;
    updateState(prev => ({
      dating: {
        ...(prev.dating || {}),
        status: 'dating',
        currentProfileId: revealProfile.id,
        startedAtAge: (prev.dating?.startedAtAge ?? prev.currentYear)
      }
    }));
    addLog?.(`💌 You and ${revealProfile.name} keep dating.`);
    setRevealOpen(false);
    setRevealProfile(null);
  };

  const handleEndIt = () => {
    if (!revealProfile) return;

    // Use hide logic to remove from roster and clear current match
    hideProfile(revealProfile);
    updateState({ currentMatch: null });

    setRevealOpen(false);
    setRevealProfile(null);
    setLastDateResult(null);
    
    toast.info("Back on the apps.");
  };

  const handleMakeOfficial = () => {
    if (!revealProfile) return;

    const inferred = revealProfile.patternIds || [];
    const chemistryNow = gameState.dating?.chemistryByProfileId?.[revealProfile.id] ?? 50;

    // Start partner meter based on chemistry (BitLife-ish “relationship bar” feeling)
    const startingPartnerMeter = clamp(Math.round(55 + (chemistryNow - 50) * 0.8), 20, 95);

    const careerSeed = `${gameState.runSeed || 0}|partnerCareer|${revealProfile.signature || revealProfile.id || revealProfile.name}`;
    const partnerCareer = computeRandomPartnerCareer({
      seed: careerSeed,
      ageAtBirth: gameState.parentCareer?.ageAtBirth || 30
    });

    // Sprite meta for partner (stable with roster)
    const spriteMeta = getSpriteMetaForDatingProfile(revealProfile, gameState);

    const wealthFromProfile = (() => {
      if (Number.isFinite(revealProfile?.wealthAmount)) {
        return {
          amount: revealProfile.wealthAmount,
          tierId: revealProfile.wealthTierId,
          label: revealProfile.wealthLabel,
          emoji: revealProfile.wealthEmoji
        };
      }
      const w = generatePartnerWealth({
        seed: `${gameState.runSeed || 0}|partnerWealth|${revealProfile.signature || revealProfile.id || revealProfile.name}`,
        age: revealProfile.age,
        estimatedIncome: partnerCareer.yearlyIncome
      });
      return { amount: w.amount, tierId: w.tierId, label: w.label, emoji: w.emoji };
    })();

    // Ensure relationships structure exists, then add partner
    updateState(prev => {
      const roster = Array.isArray(prev.relationships?.roster) ? prev.relationships.roster : [];
      const byId = prev.relationships?.byId || Object.fromEntries(roster.map(p => [p.id, p]));

      const createdAtAge = prev.currentYear;
      const ageAtMeet = Number(revealProfile.age) || 28;
      const baseAge = ageAtMeet - createdAtAge;

      const partnerPerson = {
        id: 'partner',
        role: 'partner',
        name: revealProfile.name,
        emoji: revealProfile.avatar,
        createdAtAge,
        baseAge,
        meter: startingPartnerMeter,
        notes: '',
        flags: [],
        // New V2 metadata
        age: revealProfile.age,
        jobVibe: revealProfile.jobVibe,
        intent: revealProfile.intent,
        kidVibe: revealProfile.kidVibe
      };

      const nextRoster = [
        ...roster.filter(p => p.id !== 'partner'),
        partnerPerson
      ];

      return {
        householdType: 'two',
        partnerName: revealProfile.name,
        partnerEmoji: revealProfile.avatar,
        partnerMeter: startingPartnerMeter,
        partnerAgeAtBirth: baseAge,
        partnerAvatarGender: spriteMeta.genderKey,
        partnerAvatarSpriteIndex: spriteMeta.index,
        partnerPatterns: inferred,
        partnerCareer,
        partnerRelationship: {
                  status: 'partnered',
                  metAtAge: prev.currentYear,
                  engagedAtAge: null,
                  marriedAtAge: null,
                  ring: null,
                  wedding: null,

                  wealth: {
                    ...wealthFromProfile,
                    knownTier: true,
                    knownAmount: false
                  },
                  prenup: {
                    decided: false,
                    asked: false,
                    signed: false,
                    refused: false,
                    decidedAtAge: null
                  },
                  marriageFinance: {
                    playerNetWorthAtMarriage: null,
                    partnerWealthAtMarriage: null,
                    mergedWealthAtAge: null
                  }
                  },
        birthControl: { ...(prev.birthControl || { playerOn: false, partnerOn: false }), partnerOn: false },
        dating: {
          ...(prev.dating || {}),
          status: 'official',
          currentProfileId: revealProfile.id,
          startedAtAge: prev.dating?.startedAtAge ?? prev.currentYear
        },
        relationships: {
          roster: nextRoster,
          byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
        }
      };
    });

    addLog?.(`💞 You and ${revealProfile.name} made it official!`);
    addLog?.(`💼 ${revealProfile.name} works as a ${partnerCareer.jobTitle} (+$${formatMoney(partnerCareer.yearlyIncome)}/year).`);
    addLog?.(`💰 Wealth vibe: ${wealthFromProfile.emoji} ${wealthFromProfile.label} (exact number stays hidden until marriage—like an emotional loot box).`);

    recordTimelineEntry?.({
      kind: 'relationship',
      title: `💞 Partnered with ${revealProfile.name}`,
      detail: `You made it official. Starting relationship: ${startingPartnerMeter}/100.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -0.2
    });

    setRevealOpen(false);
    setRevealProfile(null);
    onClose?.();
  };

  if (!open) return null;

  // UI helpers
  const renderMeterBar = (value, label) => (
    <div className="mt-3">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
          style={{ width: `${clampMeter(value)}%` }}
        />
      </div>
      <div className="mt-1 text-[11px] text-slate-600">{Math.round(clampMeter(value))}/100</div>
    </div>
  );

  const refreshCount = normalizeRosterMeta().refreshCountThisAge || 0;
  const refreshLabel = refreshCount >= 1 ? `Refresh Roster ($${DATING_REFRESH_COST})` : "Refresh Roster";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[9000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[9001] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
          >
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold">
              {householdType === 'two' ? 'Date Night' : 'Dating'}
            </h2>
            <p className="text-white/80 text-sm">
              Pick a date idea → get a story → sometimes it’s messy (like real life).
            </p>
            {householdType === 'single' && (
              <p className="text-white/60 text-xs mt-1">
                Browse a roster, message, then plan a date.
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto grow">
            {/* VIEW: MAIN */}
            {view === 'main' && (
              <>
                {/* Single: preference selector */}
                {householdType === 'single' && !datingPreference && (
                  <div className="space-y-4">
                    <div className="text-slate-800 font-semibold">Who are you interested in dating?</div>
                    
                    {/* Age Range Dropdown (Show even before preference) */}
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1 block">Age range</label>
                      <Select 
                        value={datingAgeRangeId || 'any_18_99'} 
                        onValueChange={handleSetAgeRange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          {DATING_AGE_RANGES.map(r => (
                            <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <Button onClick={() => handleSetPreference('women')} className="h-14 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200">👩 Women</Button>
                      <Button onClick={() => handleSetPreference('men')} className="h-14 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">👨 Men</Button>
                      <Button onClick={() => handleSetPreference('anyone')} className="h-14 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">👥 Anyone</Button>
                    </div>
                    <div className="text-xs text-slate-500">
                      You can change this later. The game keeps it PG and parent‑friendly.
                    </div>
                  </div>
                )}

                {/* Single: ROSTER V2 */}
                {householdType === 'single' && datingPreference && (
                  <div className="space-y-4">
                    
                    {/* Filters Row */}
                    <div className="flex gap-2 mb-2">
                      <Select 
                        value={datingAgeRangeId || 'any_18_99'} 
                        onValueChange={handleSetAgeRange}
                      >
                        <SelectTrigger className="flex-1 h-9 text-xs">
                          <SelectValue placeholder="Age" />
                        </SelectTrigger>
                        <SelectContent>
                          {DATING_AGE_RANGES.map(r => (
                            <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex bg-slate-100 p-1 rounded-md shrink-0">
                        <button 
                          onClick={() => handleSetPreference('women')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${datingPreference === 'women' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        >👩</button>
                        <button 
                          onClick={() => handleSetPreference('men')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${datingPreference === 'men' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        >👨</button>
                        <button 
                          onClick={() => handleSetPreference('anyone')}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${datingPreference === 'anyone' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                        >👥</button>
                      </div>
                    </div>

                    {/* Roster Grid */}
                    <div className="grid grid-cols-2 gap-3 min-h-[300px]">
                      {datingRoster.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => {
                            // Ensure chemistry is init on select if needed
                            ensureChemistry(profile.id, profile.matchStrength);
                            setSelectedProfile(profile);
                          }}
                          className="bg-white border border-slate-200 rounded-xl p-3 text-left hover:border-pink-300 hover:shadow-md transition-all flex flex-col gap-2 relative group"
                        >
                          <div className="flex justify-between items-start">
                            {(() => {
                              const meta = getSpriteMetaForDatingProfile(profile, gameState);
                              return (
                                <PlayerSpriteAvatar
                                  genderKey={meta.genderKey}
                                  ageNumber={meta.ageNumber}
                                  index={meta.index}
                                  size={40}
                                  fallbackEmoji={profile.avatar}
                                  className="rounded-xl bg-slate-50 border border-slate-100 shadow-sm"
                                />
                              );
                            })()}
                            <div className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${
                              profile.matchStrength === 'Strong match' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              profile.matchStrength === 'Decent chance' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              'bg-slate-50 text-slate-600 border-slate-100'
                            }`}>
                              {profile.matchStrength === 'Strong match' ? 'Strong' : profile.matchStrength === 'Decent chance' ? 'Decent' : 'Long shot'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-bold text-slate-800 text-sm truncate">{profile.name}, {profile.age}</div>
                            <div className="text-xs text-slate-500 truncate">{profile.jobVibe}</div>
                          </div>

                          <div className="mt-auto pt-2 text-[10px] text-slate-400 font-medium truncate">
                            Vibe: {profile.vibeHint}
                          </div>
                        </button>
                      ))}
                      
                      {datingRoster.length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                          <UserPlus className="w-8 h-8 mb-2 opacity-50" />
                          <p>No matches found.</p>
                          <Button variant="link" onClick={refreshRosterClicked} className="text-pink-600">Try refreshing</Button>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-dashed text-slate-500 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      onClick={refreshRosterClicked}
                    >
                      <Shuffle className="w-3 h-3 mr-2" />
                      {refreshLabel}
                    </Button>

                    <Button 
                      onClick={openCelebrityDatingGate} 
                      className="w-full h-12 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold"
                    >
                      <span className="mr-2">⭐</span> Celebraty Dating
                    </Button>

                    {!canUse && (
                      <div className="text-xs text-slate-500 text-center">
                        Not enough focus.
                      </div>
                    )}
                  </div>
                )}

                {/* Partner: partner card (unchanged) */}
                {householdType === 'two' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-start gap-3">
                        {(() => {
                          const partnerPerson = gameState.relationships?.byId?.partner || { id:'partner', role:'partner', name: partnerDisplayName, avatarGenderKey: gameState.partnerAvatarGender, avatarSpriteIndex: gameState.partnerAvatarSpriteIndex };
                          const meta = getSpriteMetaForPerson(partnerPerson, gameState);
                          return (
                            <PlayerSpriteAvatar
                              genderKey={meta.genderKey}
                              ageNumber={meta.ageNumber}
                              index={meta.index}
                              size={56}
                              fallbackEmoji={partnerDisplayEmoji}
                              className="rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
                            />
                          );
                        })()}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 text-lg truncate">{partnerDisplayName}</div>
                          <div className="text-sm text-slate-600 mt-1">
                            Status: <span className="font-semibold">{relationshipStatus}</span>
                          </div>
                          {renderMeterBar(partnerMeter ?? 70, 'Relationship')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => {
                          if (!canUse) {
                            toast('You need at least 1 focus to go on a date.', { icon: '⚠️' });
                          }
                          setView('ideas');
                        }}
                        className="col-span-2 h-12 bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        🍷 Plan a Date
                      </Button>

                      <Button
                        onClick={() => setView('propose')}
                        variant="secondary"
                        className="h-12"
                        disabled={!canPropose}
                        title={!canPropose ? 'Propose is available when you are partnered (not engaged/married).' : ''}
                      >
                        💍 Propose
                      </Button>
                    </div>

                    {partnerName && (
                      <>
                        <Button
                          onClick={() => setSideDatingOpen(true)}
                          variant="outline"
                          className={`w-full h-11 ${
                            (partnerRelationship?.openRelationship?.active)
                              ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                              : 'border-amber-300 text-amber-800 hover:bg-amber-50'
                          }`}
                        >
                          {(partnerRelationship?.openRelationship?.active)
                            ? '🔓 Date someone new (open relationship)'
                            : '🕶️ Date someone else (cheating)'}
                        </Button>

                        <div className="text-[11px] text-slate-500">
                          {(partnerRelationship?.openRelationship?.active)
                            ? 'Consent does not remove health risk.'
                            : 'This is not "free." It can damage your relationship.'}
                        </div>
                      </>
                    )}

                    {!canUse && (
                      <div className="text-xs text-slate-500">
                        You need at least 1 focus to go on a date right now.
                      </div>
                    )}

                    {!canPropose && (
                      <div className="text-xs text-slate-500">
                        💡 If you’re already engaged or married, proposing isn’t shown here. (You can still do date nights!)
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* VIEW: DATE IDEAS (Shared) */}
            {view === 'ideas' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setView('main')} className="h-10">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <div className="font-semibold text-slate-800">Choose a date idea</div>
                </div>

                {!canUse && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <div className="font-semibold">⚠️ You can browse ideas, but you can't go on a date right now.</div>
                    <div className="text-amber-800/80">
                      You need at least <b>1 focus</b>.
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => runDate(DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)])}
                  className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Surprise me
                </Button>

                <div className="space-y-5">
                  {groupedDateIdeas.map(([category, ideas]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-2">
                        {category}
                      </div>

                      <div className="space-y-2">
                        {ideas.map((idea) => (
                          <button
                            key={idea.id}
                            onClick={() => runDate(idea)}
                            className="w-full text-left rounded-xl p-4 border transition-colors bg-white border-slate-200 hover:bg-slate-50"
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">{idea.emoji}</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-800">{idea.label}</div>
                                <div className="text-xs text-slate-600 mt-1">{idea.blurb}</div>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                                  <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                                    💸 ~${formatMoney(getLocalAmount ? getLocalAmount(idea.baseCost) : idea.baseCost)}
                                  </span>
                                  <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                                    🎯 Focus: 1
                                  </span>
                                  <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                                    🎭 Risk: {idea.risk || 'medium'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: PROPOSE (Shared) */}
            {view === 'propose' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setView('main')} className="h-10">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <div className="font-semibold text-slate-800">Propose to {partnerDisplayName}</div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-slate-700">
                  Pick a ring. Chance depends on your relationship meter + ring bonus.
                  <div className="mt-2 text-xs text-slate-600">
                    Current relationship: <span className="font-semibold">{Math.round(partnerMeter ?? 70)}/100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {ENGAGEMENT_RINGS.map((ring) => {
                    const meter = Number(partnerMeter ?? 70);
                    const chance = Math.min(95, baseChanceForMeter(meter) + (ring.acceptanceBonus || 0));
                    return (
                      <button
                        key={ring.id}
                        onClick={() => doPropose(ring)}
                        className="w-full text-left bg-white rounded-xl p-4 border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-800">{ring.label}</div>
                            <div className="text-xs text-slate-600 mt-1">{ring.description}</div>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                              <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                                💸 ${formatMoney(getLocalAmount ? getLocalAmount(ring.cost) : ring.cost)}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                                ➕ Bonus: +{ring.acceptanceBonus}%
                              </span>
                              <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                                🎯 Est. yes chance: {Math.round(chance)}%
                              </span>
                            </div>
                          </div>
                          <div className="text-2xl">💍</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details Modal (V2) */}
        <DatingProfileModal 
          open={!!selectedProfile}
          profile={selectedProfile}
          chemistry={selectedProfile ? (gameState.dating?.chemistryByProfileId?.[selectedProfile.id] ?? 50) : 50}
          canUseFocus={canUse}
          onClose={() => setSelectedProfile(null)}
          onMessage={onMessageProfile}
          onPlanDate={(p) => {
            updateState({ currentMatch: p }); // set active match context for date flow
            setSelectedProfile(null);
            setView('ideas');
          }}
          onHide={hideProfile}
        />

        {/* Reveal Modal (Singles only) */}
        <DatingRevealModal
          open={revealOpen}
          profile={revealProfile}
          dateResult={lastDateResult}
          chemistry={revealProfile ? (gameState.dating?.chemistryByProfileId?.[revealProfile.id] ?? 50) : 50}
          onClose={() => {
            setRevealOpen(false);
            setRevealProfile(null);
          }}
          onKeepDating={handleKeepDating}
          onEndIt={handleEndIt}
          onMakeOfficial={handleMakeOfficial}
        />

        <CelebritySignupModal 
          open={celebritySignupOpen} 
          onClose={() => setCelebritySignupOpen(false)}
          onUnlock={() => {
            setCelebritySignupOpen(false);
            updateState({ celebrityDatingUnlocked: true });
            emitActionResult({
              title: "✅ Membership Activated",
              body: "You’ve been accepted into the Celebrity Dating Network.\n\nYour profile has been professionally retouched, emotionally filtered, and mildly exaggerated.\n\nSomeone famous might notice you… eventually.",
              meta: { emoji: "✅" }
            });
            setTimeout(() => setCelebrityHubOpen(true), 500);
          }}
        />

        <CelebrityDatingHub 
          open={celebrityHubOpen}
          onClose={() => setCelebrityHubOpen(false)}
        />

        <SideDatingModal
          open={sideDatingOpen}
          onClose={() => setSideDatingOpen(false)}
        />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}