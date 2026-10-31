import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, createSeededRng } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getToneColFromGameState, pickSpriteIndexForPerson } from '@/components/game/relationshipSpriteUtils';
import { isPersonDead } from '@/components/game/relationshipUtils';
import { rebaseRelationshipsAfterGuardianChange } from '@/components/game/relationshipRebase';
import { pickCulturalFirstName } from '@/components/game/culturalNamePicker';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';

export default function Death() {
  const navigate = useNavigate();
  const { gameState, resetGame, updateState } = useGameState();
  const { deathEvent, childName } = gameState;

  const childAge = Number(gameState.deathContext?.childAge ?? gameState.currentYear ?? 0);
  const childIsAdult = childAge >= 18;

  const runSeed = String(gameState.runSeed || 'seed');
  const toneCol = getToneColFromGameState(gameState);

  if (!deathEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <motion.div className="max-w-md w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center">
            <p className="text-slate-400 mb-6">No death event found. Returning to outcome...</p>
            <Button onClick={() => navigate(createPageUrl('Outcome'))} className="w-full">
              Back to Outcome
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleStartOver = () => {
    const ok = resetGame();
    if (!ok) return;
    navigate(createPageUrl('Start'));
  };

  // === Avatar Data for Deceased ===
  const normalizeGenderForAvatar = (v, fallback = 'male') => {
    const s = String(v || '').toLowerCase();
    if (s === 'female' || s === 'girl' || s === 'woman' || s === 'f') return 'female';
    if (s === 'male' || s === 'boy' || s === 'man' || s === 'm') return 'male';
    return fallback;
  };

  const deceasedData = (() => {
    const deceased = gameState.deathContext?.deceased;
    
    if (deceased) {
      return {
        name: deceased.name || 'Guardian',
        genderKey: normalizeGenderForAvatar(deceased.avatarGender || deceased.avatarGenderKey),
        spriteIndex: Number.isFinite(Number(deceased.avatarSpriteIndex)) ? Number(deceased.avatarSpriteIndex) : 0,
        parentAgeAtBirth: Number.isFinite(Number(deceased.parentAgeAtBirth)) ? Number(deceased.parentAgeAtBirth) : 28
      };
    }
    
    // Fallback to current player state
    const genderFromRole = gameState.parentRole === 'mom' ? 'female' : gameState.parentRole === 'dad' ? 'male' : 'male';
    return {
      name: gameState.parentName || 'Guardian',
      genderKey: normalizeGenderForAvatar(gameState.parentAvatarGender, genderFromRole),
      spriteIndex: Number.isFinite(Number(gameState.parentAvatarSpriteIndex)) ? Number(gameState.parentAvatarSpriteIndex) : 0,
      parentAgeAtBirth: Number.isFinite(Number(gameState.parentAgeAtBirth)) ? Number(gameState.parentAgeAtBirth) : 28
    };
  })();

  const deceasedAgeNow = Math.max(0, Math.min(120, deceasedData.parentAgeAtBirth + childAge));

  const handleBecomeChild = () => {
    if (!childIsAdult) return;

    // Shared legacy param builder logic (duplicated for robustness/autonomy in this file)
    const summary = gameState.lastRunSummary || {};
    const finalOutcome = gameState.finalOutcome || {};
    const ctx = finalOutcome.ctx || {};

    const parentName = summary.childName || gameState.childName || "Parent";
    const childGender = summary.childGender || gameState.childAvatarGender || "boy";
    const parentRole = childGender === "girl" ? "mom" : "dad";

    // Inheritance
    const currentMoney = Number(gameState.money || 0);
    const cash = Math.max(0, currentMoney);
    const debt = Math.max(0, -currentMoney);
    const retirementBuffer = Number(summary.outcome?.retirementBuffer ?? ctx.retirementBuffer ?? gameState.retirementSavings ?? 0);
    const net = cash - debt;
    const inheritance = Math.max(0, Math.round(net - retirementBuffer));

    // Household
    const relStatus = summary.outcome?.relationshipStatus || ctx.relationshipStatus || "Single";
    const householdType = (relStatus === "Married" || relStatus === "Long-term partner") ? "two" : "single";

    // Income
    const wealthTier = summary.outcome?.wealthTier || ctx.wealthTier || "Stable";
    let incomeTier = "medium";
    if (wealthTier === "Wealthy" || inheritance >= 50000) {
      incomeTier = "high";
    } else if (wealthTier === "Comfortable" || inheritance >= 15000) {
      incomeTier = "medium";
    } else {
      incomeTier = "low";
    }
    
    // Apocalypse Campaign: carry forward if active and not won
    const isApocalypse = gameState.specialStartId === 'zombie_apocalypse' || gameState.specialStartId === 'alien_invasion';
    const campaign = gameState.apocalypseCampaign || {};
    const victoryAchieved = campaign.victory?.achieved === true;
    
    if (isApocalypse && campaign.active && !victoryAchieved) {
      try {
        const apocalypsePayload = {
          enabled: true,
          campaign: {
            ...campaign,
            introShown: true,
            generationsCompleted: (campaign.generationsCompleted || 0) + 1,
            totalYearsSurvived: (campaign.totalYearsSurvived || 0) + (gameState.currentYear || 0)
          },
          scenarioId: gameState.specialStartId,
          scenarioTitle: gameState.specialStartTitle,
          zombieThreat: gameState.zombieThreat,
          zombieTraining: gameState.zombieTraining,
          alienThreat: gameState.alienThreat
        };
        
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('rt_apocalypse_campaign', JSON.stringify(apocalypsePayload));
        }
      } catch {}
    }

    const legacyUrl =
      createPageUrl('Start') +
      `?legacy=true&entry=playAsChild&parent=${encodeURIComponent(parentName)}&role=${parentRole}&household=${householdType}&income=${incomeTier}&money=${inheritance}`;

    navigate(legacyUrl);
  };

  // === Succession Mode Helpers ===
  const rel = gameState.relationships || { roster: [], byId: {} };
  const byId = rel.byId || {};
  const roster = Array.isArray(rel.roster) ? rel.roster : [];

  const getPerson = (id) => byId[id] || roster.find(p => p.id === id) || null;
  const isAlive = (p) => p && !isPersonDead(p);

  const partnerPerson = getPerson('partner');
  const momPerson = getPerson('my_mom');
  const dadPerson = getPerson('my_dad');
  const motherOfChildPerson = getPerson('mother_of_child');
  const fatherOfChildPerson = getPerson('father_of_child');

  const hasChild =
    gameState.childless !== true &&
    gameState.hasChild !== false &&
    (!!gameState.childName || !!byId.child);

  const deceasedRoleNow = String(gameState.deathContext?.deceased?.role || gameState.parentRole || '').toLowerCase();
  const expectedCoparentId =
    deceasedRoleNow === 'mom' ? 'father_of_child'
    : deceasedRoleNow === 'dad' ? 'mother_of_child'
    : null;

  const coparentPerson = expectedCoparentId
    ? getPerson(expectedCoparentId)
    : (fatherOfChildPerson || motherOfChildPerson);

  const partnerAlive = isAlive(partnerPerson);
  const momAlive = isAlive(momPerson);
  const dadAlive = isAlive(dadPerson);
  const coparentAlive = isAlive(coparentPerson);

  const prStatus = String(gameState.partnerRelationship?.status || '').toLowerCase();
  const partnerEligible =
    partnerAlive &&
    gameState.householdType === 'two' &&
    prStatus !== 'divorced' &&
    prStatus !== 'single';

  const coparentEligible =
    hasChild &&
    coparentAlive &&
    (coparentPerson?.id === 'father_of_child' || coparentPerson?.id === 'mother_of_child');

  const normalizeGenderKey = (v, fallback = 'male') => {
    const s = String(v || '').toLowerCase();
    if (s === 'female' || s === 'girl' || s === 'woman' || s === 'f') return 'female';
    if (s === 'male' || s === 'boy' || s === 'man' || s === 'm') return 'male';
    return fallback;
  };

  const buildPartnerCandidate = () => {
    const genderKey = normalizeGenderKey(
      gameState.partnerAvatarGender || partnerPerson?.avatarGenderKey || partnerPerson?.genderKey,
      'male'
    );

    const spriteIndex = Number.isFinite(Number(gameState.partnerAvatarSpriteIndex))
      ? Number(gameState.partnerAvatarSpriteIndex)
      : Number.isFinite(Number(partnerPerson?.avatarSpriteIndex))
        ? Number(partnerPerson.avatarSpriteIndex)
        : pickSpriteIndexForPerson({ seed: `${runSeed}|partner|idx`, toneCol, role: 'partner' });

    const baseAge = Number.isFinite(Number(partnerPerson?.baseAge))
      ? Number(partnerPerson.baseAge)
      : Number.isFinite(Number(gameState.partnerAgeAtBirth))
        ? Number(gameState.partnerAgeAtBirth)
        : Number(gameState.parentAgeAtBirth ?? 28);

    return {
      id: 'partner',
      role: 'partner',
      label: 'Partner',
      name: partnerPerson?.name || gameState.partnerName || 'Partner',
      baseAge,
      avatarGenderKey: genderKey,
      avatarSpriteIndex: spriteIndex
    };
  };

  const buildCoparentCandidate = () => {
    const p = coparentPerson;

    const fallbackGender = (p?.role === 'mother_of_child') ? 'female' : 'male';
    const genderKey = normalizeGenderKey(
      p?.avatarGenderKey || p?.genderKey || gameState.coparentProfile?.gender,
      fallbackGender
    );

    const spriteIndex = Number.isFinite(Number(p?.avatarSpriteIndex))
      ? Number(p.avatarSpriteIndex)
      : pickSpriteIndexForPerson({ seed: `${runSeed}|${p?.id || 'coparent'}|idx`, toneCol, role: p?.role || 'coparent' });

    const baseAge = Number.isFinite(Number(p?.baseAge))
      ? Number(p.baseAge)
      : Number.isFinite(Number(gameState.partnerAgeAtBirth))
        ? Number(gameState.partnerAgeAtBirth)
        : Number(gameState.parentAgeAtBirth ?? 28);

    const label = p?.role === 'father_of_child'
      ? "Child's Father"
      : p?.role === 'mother_of_child'
        ? "Child's Mother"
        : 'Co-parent';

    return {
      id: p?.id || 'father_of_child',
      role: p?.role || 'coparent',
      label,
      name: p?.name || gameState.coparentProfile?.name || 'Co-parent',
      baseAge,
      avatarGenderKey: genderKey,
      avatarSpriteIndex: spriteIndex,
      cultures: p?.cultures
    };
  };

  const buildParentCandidate = (person, label) => {
    const genderKey = normalizeGenderKey(
      person?.avatarGenderKey || person?.genderKey,
      label === 'Mother' ? 'female' : 'male'
    );

    const spriteIndex = Number.isFinite(Number(person?.avatarSpriteIndex))
      ? Number(person.avatarSpriteIndex)
      : pickSpriteIndexForPerson({ seed: `${runSeed}|${person?.id || label}|idx`, toneCol, role: person?.role || 'family' });

    const baseAge = Number.isFinite(Number(person?.baseAge)) ? Number(person.baseAge) : (label === 'Mother' ? 55 : 57);

    return {
      id: person.id,
      role: person.role,
      label,
      name: person.name || label,
      baseAge,
      avatarGenderKey: genderKey,
      avatarSpriteIndex: spriteIndex
    };
  };

  const buildAdopterCandidate = () => {
    const rng = createSeededRng(`${runSeed}|adopter|childAge:${childAge}|ts:${deathEvent?.ts || 0}`);
    const genderKey = rng.nextFloat() < 0.5 ? 'female' : 'male';

    const namesF = ['Avery','Maya','Nadia','Rina','Sofia','Tessa','Zara','Keira','Lina','Wren'];
    const namesM = ['Aiden','Kai','Noah','Ethan','Rafi','Sam','Theo','Dylan','Omar','Jules'];
    const name = rng.pick(genderKey === 'female' ? namesF : namesM) || 'Guardian';

    // We need baseAge = age at child age 0 (to keep the game's age math consistent).
    // Choose a plausible guardian CURRENT age, then convert to baseAge.
    const desiredNow = 26 + Math.floor(rng.nextFloat() * 32); // 26..57
    const baseAge = Math.max(18, Math.min(75, desiredNow - childAge));

    const spriteIndex = pickSpriteIndexForPerson({
      seed: `${runSeed}|adopter|idx|${name}|${genderKey}|${childAge}`,
      toneCol,
      role: 'guardian'
    });

    return {
      id: 'adopter_guardian',
      role: 'adopter_guardian',
      label: 'Adoptive Guardian',
      name,
      baseAge,
      avatarGenderKey: genderKey,
      avatarSpriteIndex: spriteIndex
    };
  };

  // Rule logic: Show ALL living adult guardians
  let guardianOptions = [];
  if (partnerEligible) guardianOptions.push(buildPartnerCandidate());
  if (coparentEligible) guardianOptions.push(buildCoparentCandidate());
  if (momAlive) guardianOptions.push(buildParentCandidate(momPerson, 'Mother'));
  if (dadAlive) guardianOptions.push(buildParentCandidate(dadPerson, 'Father'));

  const needsAdopter = guardianOptions.length === 0 && !childIsAdult;
  const adopterCandidate = needsAdopter ? buildAdopterCandidate() : null;

  // Prioritize will guardian if chosen
  const willGuardianId = gameState?.legal?.will?.guardianId || null;
  if (willGuardianId && guardianOptions.length > 1) {
    guardianOptions = guardianOptions.map(opt =>
      opt.id === willGuardianId
        ? { ...opt, label: opt.label ? `${opt.label} (Will)` : 'Guardian (Will)' }
        : opt
    );

    guardianOptions.sort((a, b) => {
      const aPref = a.id === willGuardianId ? 1 : 0;
      const bPref = b.id === willGuardianId ? 1 : 0;
      return bPref - aPref;
    });
  }

  const applySuccession = (succ) => {
    if (!succ) return;

    updateState(prev => {
      const next = { ...prev };

      const genderKey = normalizeGenderKey(
        succ.avatarGenderKey || succ.genderKey,
        succ.label === 'Mother' ? 'female' : 'male'
      );
      const parentRole = (genderKey === 'female') ? 'mom' : 'dad';
      const spriteIndex = Number.isFinite(Number(succ.avatarSpriteIndex)) ? Number(succ.avatarSpriteIndex) : 0;

      // New guardian identity
      next.parentName = succ.name;
      next.parentRole = parentRole;
      next.parentAvatarGender = genderKey;
      next.parentAvatarSpriteIndex = spriteIndex;
      next.parentAvatar = parentRole === 'dad' ? '👨' : '👩';
      next.parent = { role: parentRole, name: succ.name };

      // Age math (IMPORTANT): baseAge = guardian age at child age 0
      next.parentAgeAtBirth = Number.isFinite(Number(succ.baseAge))
        ? Number(succ.baseAge)
        : Number(prev.parentAgeAtBirth ?? 28);

      // Clear death flags and continue run
      next.deathEvent = null;
      next.deathContext = null;
      next.finished = false;

      // Set guardian perspective
      if (succ.id === 'partner') {
        next.guardianPerspective = { activeId: 'partner', side: 'partner', relationToChild: 'parent' };
      } else if (succ.id === 'father_of_child' || succ.id === 'mother_of_child') {
        next.guardianPerspective = { activeId: succ.id, side: 'partner', relationToChild: 'parent' };
      } else if (succ.id === 'my_mom' || succ.id === 'my_dad') {
        next.guardianPerspective = { activeId: succ.id, side: 'player', relationToChild: 'grandparent' };
      } else if (succ.id === 'adopter_guardian') {
        next.guardianPerspective = { activeId: 'adopter_guardian', side: 'adoptive', relationToChild: 'guardian' };
      }

      // If successor is the surviving partner, inherit their career
      if (succ.id === 'partner') {
        next.playerCareer = prev.partnerCareer || prev.playerCareer || null;
      }

      // Remove successor from relationships roster/byId before rebasing
      const rel = next.relationships || { roster: [], byId: {} };
      if (rel.byId[succ.id]) {
        delete rel.byId[succ.id];
      }
      rel.roster = rel.roster.filter(p => p.id !== succ.id);

      // Handle grandparent succession: move spouse into partner slot
      if (succ.id === 'my_mom' || succ.id === 'my_dad') {
        const spouseId = succ.id === 'my_mom' ? 'my_dad' : 'my_mom';
        const spousePerson = rel.byId[spouseId];
        
        if (spousePerson) {
          // Move spouse to partner slot
          delete rel.byId[spouseId];
          rel.roster = rel.roster.filter(p => p.id !== spouseId);
          
          const partnerPerson = {
            ...spousePerson,
            id: 'partner',
            role: 'partner'
          };
          
          rel.byId.partner = partnerPerson;
          if (!rel.roster.find(p => p.id === 'partner')) {
            rel.roster.push(partnerPerson);
          }
          
          // Set household status
          if (spousePerson.alive) {
            next.householdType = 'two';
            next.partnerName = spousePerson.name;
            next.partnerRelationship = { status: 'married', marriedAtAge: 0 };
          } else {
            next.householdType = 'single';
          }
        } else {
          // No spouse, go single
          next.householdType = 'single';
          if (rel.byId.partner) {
            delete rel.byId.partner;
            rel.roster = rel.roster.filter(p => p.id !== 'partner');
          }
        }
      }

      // If new caregiver was the old deceased's spouse, convert child's other parent
      if (succ.id === 'partner' && prev.deathContext?.deceased?.id === 'partner') {
        const deadRole = prev.deathContext.deceased.role;
        let otherParentId = null;
        
        if (deadRole === 'mom') {
          // Deceased was mom, so surviving partner becomes father_of_child
          otherParentId = 'father_of_child';
        } else if (deadRole === 'dad') {
          // Deceased was dad, so surviving partner becomes mother_of_child
          otherParentId = 'mother_of_child';
        }
        
        if (otherParentId && rel.byId.partner) {
          const otherParent = rel.byId.partner;
          delete rel.byId.partner;
          rel.roster = rel.roster.filter(p => p.id !== 'partner');
          
          // Create new other-parent entry
          const newOtherParent = {
            ...otherParent,
            id: otherParentId,
            role: otherParentId
          };
          rel.byId[otherParentId] = newOtherParent;
          if (!rel.roster.find(p => p.id === otherParentId)) {
            rel.roster.push(newOtherParent);
          }
        }
      }

      // Reset adult friends on caregiver switch
      rel.roster = rel.roster.filter(p => p.role !== 'my_best_friend' && p.role !== 'friend');
      delete rel.byId.my_best_friend;
      
      // Generate new best friend for new caregiver
      const playerGender = parentRole === 'dad' ? 'male' : parentRole === 'mom' ? 'female' : 'neutral';
      const cultures = next.playerCultures || ['AMERICAN_US'];
      const rng = createSeededRng(`${next.runSeed}|best_friend|${succ.id}`);
      
      const newBestFriend = {
        id: 'my_best_friend',
        role: 'my_best_friend',
        name: pickCulturalFirstName({
          cultures,
          gender: playerGender,
          seed: `${next.runSeed}|best_friend|name|${succ.id}`
        }),
        emoji: playerGender === 'male' ? '👨' : playerGender === 'female' ? '👩' : '🧑',
        baseAge: next.parentAgeAtBirth || 28,
        alive: true,
        createdAtAge: 0,
        meter: 65,
        interactionsByAge: {}
      };
      
      rel.byId.my_best_friend = newBestFriend;
      rel.roster.push(newBestFriend);
      
      next.relationships = rel;

      // Apply centralized relationship rebasing
      const rebasePatch = rebaseRelationshipsAfterGuardianChange(prev, succ);
      Object.assign(next, rebasePatch)

      // Timeline entry
      const tId = `t_custody_${Date.now()}`;
      const title = succ.id === 'adopter_guardian' ? '🧾 Adoption' : '🧾 Custody transferred';
      const detail = succ.id === 'adopter_guardian'
        ? `${succ.name} becomes the new guardian and adopts ${prev.childName || 'your child'}.`
        : `${succ.name} is now the guardian.`;

      next.timelineEntries = [
        ...(prev.timelineEntries || []),
        { id: tId, age: prev.currentYear, kind: 'family', title, detail, moneyDelta: 0, loveDelta: 0, stressDelta: 0 }
      ];

      // Adoption flavor + record (only for adopter quick start)
      if (succ.id === 'adopter_guardian') {
        const kid = prev.childName || 'your child';
        const ageNow = Number(prev.currentYear || 0);

        // Save a small record for future flavor hooks
        next.adoption = {
          active: true,
          adoptedAtAge: ageNow,
          adopterName: succ.name,
          adoptedChildName: kid,
          adoptedChildAge: ageNow,
          reason: 'orphaned'
        };

        // Immediate flavor popup (no explicit content; respectful tone)
        next.actionResultPending = {
          actionId: 'adoption',
          title: '🧾 Adoption paperwork speedrun',
          body:
            `A social worker walks you through the process.\n\n` +
            `You sign so many forms your signature briefly becomes modern art.\n\n` +
            `${succ.name} officially becomes ${kid}'s guardian.\n\n` +
            `It's not a reset. It's a new chapter.`,
          deltas: null,
          moneyDelta: 0,
          focusDelta: 0,
          loveDelta: 0,
          stressDelta: 0,
          healthDelta: 0,
          tags: ['family', 'adoption'],
          meta: { emoji: '🧾' }
        };
      }

      return next;
    });

    navigate(createPageUrl('Game'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background accent */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-slate-700/10 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
          {/* Avatar Card */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-slate-700/50 rounded-2xl overflow-hidden border-2 border-slate-600/50 shadow-xl flex items-center justify-center mb-3">
              <PlayerSpriteAvatar
                genderKey={deceasedData.genderKey}
                ageNumber={deceasedAgeNow}
                index={deceasedData.spriteIndex}
                size={112}
                fallbackEmoji={deathEvent?.emoji || "🕯️"}
                align="center"
                className="w-full h-full"
              />
            </div>
            <p className="text-sm text-slate-400 italic">
              In memory of {deceasedData.name}
            </p>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100 mb-6 leading-tight">
            {deathEvent.title}
          </h1>

          {/* Body */}
          <div className="space-y-4 mb-10">
            <p className="text-lg text-slate-300 leading-relaxed text-center">
              {deathEvent.body}
            </p>
            <p className="text-base text-slate-400 italic text-center">
              {childName} carries you forward.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-8" />

          <p className="text-sm text-slate-400 text-center mb-8">
            What happens next?
          </p>

          {/* Buttons */}
          {gameState?.deathContext?.mode === 'succession' ? (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-slate-300 text-sm mb-3">Custody Transfer</div>

                <div className="space-y-3">
                  {/* Partner OR Parents depending on rule */}
                  {guardianOptions.map(opt => (
                    <Button
                      key={opt.id}
                      onClick={() => applySuccession(opt)}
                      className="w-full h-auto min-h-[56px] bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 px-4 py-3"
                    >
                      <div className="flex flex-col items-start w-full gap-0 leading-tight">
                        <div className="text-sm font-semibold truncate w-full">{opt.name}</div>
                        <div className="text-xs text-white/80 font-normal">{opt.label || 'Guardian'}</div>
                      </div>
                    </Button>
                  ))}

                  {/* Adoption fallback */}
                  {needsAdopter && adopterCandidate && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => applySuccession(adopterCandidate)}
                        className="w-full h-14 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-lg shadow-sky-500/30"
                      >
                        Quick Start: {adopterCandidate.name} adopts {childName}
                      </Button>
                      <p className="text-xs text-slate-400 text-center">
                        No living adult guardian was found. This creates a new guardian and continues the current run.
                      </p>
                    </div>
                  )}

                  {/* Play as child (always visible; disabled <18) */}
                  <div>
                    <Button
                      onClick={handleBecomeChild}
                      disabled={!childIsAdult}
                      className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-500 disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-70 text-white font-semibold text-lg rounded-xl shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5 mr-2" /> Play as {childName}
                    </Button>
                    {!childIsAdult && (
                      <p className="text-xs text-slate-400 text-center mt-2">Child isn't old enough (18+)</p>
                    )}
                  </div>

                  {/* Start over */}
                  <Button
                    onClick={handleStartOver}
                    variant="outline"
                    className="w-full h-14 border-slate-600 text-slate-200 hover:bg-slate-700/50 font-semibold text-lg rounded-xl"
                  >
                    Start Over
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleBecomeChild}
                  disabled={!childIsAdult}
                  className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-70 text-white font-semibold text-lg rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Play as {childName}
                </Button>
              </motion.div>

              {!childIsAdult && (
                <p className="text-xs text-slate-400 text-center">Child isn't old enough (18+)</p>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  className="w-full h-14 border-slate-600 text-slate-200 hover:bg-slate-700/50 font-semibold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Start Over
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center mt-8">
            Custody Transfer continues this run. "Play as child" starts a new legacy run (18+ only).
          </p>
        </div>
      </motion.div>
    </div>
  );
}