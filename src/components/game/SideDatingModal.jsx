import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import { useGameState } from './GameStateContext';
import { useConfirm } from './ConfirmProvider';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { getSpriteMetaForDatingProfile } from '@/components/game/relationshipSpriteUtils';
import { DATING_AGE_RANGES, DATING_ROSTER_SIZE, generateDatingRoster } from './DatingV2Data';
import { DATE_IDEAS, rollDateOutcome } from './datingDateNightData';
import { generateLoveLanguageProfile } from './partnerLoveLanguagesData';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

// simple stable hash (FNV-1a)
function hash32(str) {
  let h = 2166136261;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function getPlayerGender(gameState) {
  const role = String(gameState?.parentRole || '').toLowerCase();
  const g = String(gameState?.parentAvatarGender || gameState?.playerGender || '').toLowerCase();
  if (role === 'mom' || g === 'female' || g === 'f') return 'female';
  if (role === 'dad' || g === 'male' || g === 'm') return 'male';
  return null;
}

function getProfileGender(profile) {
  const g = String(profile?.gender || '').toLowerCase();
  if (g === 'man' || g === 'male') return 'male';
  if (g === 'woman' || g === 'female') return 'female';
  return null;
}

export default function SideDatingModal({ open, onClose }) {
  const {
    gameState,
    updateState,
    addLog,
    applyStress,
    applyMoneyDelta,
    spendFocus,
    recordTimelineEntry,
    emitActionResult,
    getLocalAmount,
  } = useGameState();

  const confirm = useConfirm();

  const householdType = gameState.householdType;
  const currentYear = Number(gameState.currentYear ?? 0);
  const actionPoints = Number(gameState.actionPoints ?? 0);

  const openActive = !!(gameState.partnerRelationship?.openRelationship?.active);
  const scenarioBlocked = !!(gameState.scenarioPending && !gameState.scenarioCompletedThisAge);

  const [preference, setPreference] = useState(gameState.datingPreference || null);
  const [ageRangeId, setAgeRangeId] = useState(gameState.datingAgeRangeId || 'any_18_99');
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    if (!open) return;
    setPreference(gameState.datingPreference || null);
    setAgeRangeId(gameState.datingAgeRangeId || 'any_18_99');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (householdType !== 'two') return;
    if (!preference) return;

    const list = generateDatingRoster({
      gameState,
      preference,
      ageRangeId,
      size: DATING_ROSTER_SIZE || 8,
      excludeSignatures: [],
      seenSignatures: [],
    });

    setRoster(list);
  }, [open, householdType, preference, ageRangeId, currentYear, gameState.runSeed]);

  const header = useMemo(() => {
    if (openActive) {
      return {
        title: 'Date Someone New',
        subtitle: 'Open relationship mode: consent is on (risk still exists).',
        emoji: '🔓',
        gradient: 'from-emerald-600 to-teal-600',
      };
    }
    return {
      title: 'Side Date',
      subtitle: 'Cheating mode: secret choices create consequences.',
      emoji: '🕶️',
      gradient: 'from-slate-900 to-slate-700',
    };
  }, [openActive]);

  const setPref = (pref) => {
    setPreference(pref);
    updateState({ datingPreference: pref });
  };

  const setAge = (id) => {
    setAgeRangeId(id);
    updateState({ datingAgeRangeId: id });
  };

  const getSidePartnerId = (profile) => {
    const sig = profile?.signature || `${profile?.name || 'X'}|${profile?.age || 0}|${profile?.jobVibe || ''}`;
    const key = `${gameState.runSeed || 0}|sidePartner|${sig}`;
    return `side_${hash32(key).toString(16)}`;
  };

  const goOnDate = async (profile) => {
    if (householdType !== 'two') {
      toast('You need to have a partner for this menu.', { icon: '⚠️' });
      return;
    }
    if (scenarioBlocked) {
      toast('Finish the mandatory scenario first.', { icon: '⚠️' });
      return;
    }
    if (actionPoints < 1) {
      toast('Not enough focus.', { icon: '⚠️' });
      return;
    }

    const ok = await confirm({
      title: openActive ? 'Plan a date with someone new?' : 'Go on a side date?',
      description: openActive
        ? `This is consensual, but it still increases health risk.\n\nNo explicit details (PG-13).\n\nProceed?`
        : `This is cheating.\n\nIt can damage your relationship, create drama, and increase health risks.\n\nNo explicit details (PG-13).\n\nProceed anyway?`,
      confirmText: openActive ? 'Go on date' : 'Do it anyway',
      cancelText: 'Cancel',
      destructive: !openActive
    });

    if (!ok) return;

    const spent = spendFocus(1, openActive ? 'Open relationship date' : 'Side date');
    if (!spent) return;

    const idea = DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)];
    const outcome = rollDateOutcome({
      ideaId: idea.id,
      context: { name: profile.name, childName: gameState.childName || 'your kid' },
      mode: 'single'
    });

    const cost = Number(getLocalAmount ? getLocalAmount(outcome.moneyCost) : outcome.moneyCost) || 0;
    if (cost > 0) applyMoneyDelta(-cost, openActive ? 'Open relationship date' : 'Side date');

    // A tiny "mess tax" stress bump so this never feels like a free upgrade.
    const extraStress = openActive ? 0.05 : 0.2;
    const stressDelta = Number(outcome.stressDelta || 0) + extraStress;
    if (stressDelta) applyStress(stressDelta, openActive ? 'Open relationship date' : 'Side date');

    const sideId = getSidePartnerId(profile);

    // Update relationships + drama in one atomic update
    updateState(prev => {
      const rel = prev.relationships || { roster: [], byId: {} };
      const roster0 = Array.isArray(rel.roster) ? [...rel.roster] : [];
      const byId0 = { ...(rel.byId || {}) };

      const existing = byId0[sideId] || roster0.find(p => p.id === sideId) || null;
      const meta = getSpriteMetaForDatingProfile(profile, prev);

      const existingLL = existing?.loveLanguages;
      const loveLanguages =
        existingLL || generateLoveLanguageProfile({
          seed: `${prev.runSeed || 0}|loveLanguages|side|${sideId}|${profile.name}`
        });

      const basePerson = existing || {
        id: sideId,
        role: 'side_partner',
        name: profile.name,
        emoji: profile.avatar || '🕶️',
        meter: 55,
        age: Number(profile.age) || 25,
        createdAtAge: prev.currentYear,
        notes: openActive ? 'Open relationship' : 'Side partner',
        avatarGenderKey: meta.genderKey,
        avatarSpriteIndex: meta.index,
        datingSignature: profile.signature || null,
        loveLanguages
      };

      const meterDelta = clamp(Number(outcome.meterDelta || 0), -12, 12);
      const ageData = basePerson.interactionsByAge?.[prev.currentYear] || {};
      const updatedSide = {
        ...basePerson,
        loveLanguages,
        meter: clamp(Number(basePerson.meter ?? 55) + meterDelta, 0, 100),
        interactionsByAge: {
          ...(basePerson.interactionsByAge || {}),
          [prev.currentYear]: {
            ...ageData,
            didConnect: true,
            usedActions: { ...(ageData.usedActions || {}), sideDate: true },
            lastActionId: 'sideDate',
            lastText: outcome.story,
            type: 'sideDate',
            detail: outcome.story
          }
        }
      };

      let roster = roster0;
      if (existing) {
        roster = roster.map(p => (p.id === sideId ? updatedSide : p));
      } else {
        roster = [...roster0, updatedSide];
      }

      let byId = { ...byId0, [sideId]: updatedSide };

      // Drama log for annual tick
      const drama = prev.relationshipDrama || {};
      const outside = drama.outsideEncountersByAge || {};
      const prevEntry = outside[prev.currentYear] || { count: 0, maleEncounters: 0, partnerIds: [] };

      const playerGender = getPlayerGender(prev);
      const profGender = getProfileGender(profile);
      const maleEncounter = playerGender === 'female' && profGender === 'male';

      const nextEntry = {
        ...prevEntry,
        count: Number(prevEntry.count || 0) + 1,
        maleEncounters: Number(prevEntry.maleEncounters || 0) + (maleEncounter ? 1 : 0),
        partnerIds: [...(prevEntry.partnerIds || []), sideId]
      };

      const nextDrama = {
        ...drama,
        outsideEncountersByAge: { ...outside, [prev.currentYear]: nextEntry }
      };

      // Small immediate partner hit if this was cheating (open relationship avoids this)
      let nextPartnerMeter = prev.partnerMeter;
      let nextRelRoster = roster;

      if (!openActive) {
        const currentPartnerMeter = Number(prev.partnerMeter ?? prev.relationships?.byId?.partner?.meter ?? 70);
        const newPM = clamp(currentPartnerMeter - 2, 0, 100);
        nextPartnerMeter = newPM;

        nextRelRoster = nextRelRoster.map(p => p.id === 'partner' ? { ...p, meter: newPM } : p);
        if (byId.partner) byId = { ...byId, partner: { ...byId.partner, meter: newPM } };
      }

      return {
        ...prev,
        relationships: { ...rel, roster: nextRelRoster, byId },
        relationshipDrama: nextDrama,
        ...(nextPartnerMeter !== prev.partnerMeter ? { partnerMeter: nextPartnerMeter } : {})
      };
    });

    const title = openActive ? '🔓 Date Someone New' : '🕶️ Side Date';
    const note = openActive
      ? 'Consent was clear. Still: more people = more health risk.'
      : 'This was a secret. Secrets have gravity.';

    addLog(`${openActive ? '🔓' : '🕶️'} ${idea.label} with ${profile.name} (${outcome.qualityLabel})`);

    emitActionResult({
      title,
      body: `${outcome.summary}\n\n${outcome.story}\n\n${note}`,
      moneyDelta: cost ? -cost : 0,
      stressDelta,
      focusDelta: -1,
      meta: { emoji: openActive ? '🔓' : '🕶️' }
    });

    recordTimelineEntry({
      kind: 'relationship',
      title: `${openActive ? '🔓' : '🕶️'} ${idea.emoji || '✨'} ${idea.label} with ${profile.name}`,
      detail: `${outcome.story}\n\n${note}`,
      moneyDelta: cost ? -cost : 0,
      stressDelta
    });

    onClose?.();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px] z-[9100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[9101] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-6 text-white bg-gradient-to-r ${header.gradient} shrink-0`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{header.emoji}</span>
                      <div className="text-xl font-bold truncate">{header.title}</div>
                    </div>
                    <div className="text-white/80 text-sm mt-1">{header.subtitle}</div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                {householdType !== 'two' ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    You can only use this menu if you currently have a partner.
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <div className="font-semibold mb-1">
                        {openActive ? 'Consent + responsibility' : 'Warning: messy choices'}
                      </div>
                      <div className="text-slate-600 text-xs leading-relaxed">
                        {openActive
                          ? 'Open relationship choices are consensual, but they still increase health risk. The game stays PG-13.'
                          : 'Cheating can trigger drama, breakups, and health consequences. The game stays PG-13.'}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="text-sm font-semibold text-slate-800">Who are you trying to date?</div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={preference === 'women' ? 'default' : 'outline'}
                          onClick={() => setPref('women')}
                          className="h-11"
                        >
                          Women
                        </Button>
                        <Button
                          variant={preference === 'men' ? 'default' : 'outline'}
                          onClick={() => setPref('men')}
                          className="h-11"
                        >
                          Men
                        </Button>
                        <Button
                          variant={preference === 'anyone' ? 'default' : 'outline'}
                          onClick={() => setPref('anyone')}
                          className="h-11"
                        >
                          Anyone
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-600">Age range</div>
                        <Select value={ageRangeId} onValueChange={setAge}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Choose age range" />
                          </SelectTrigger>
                          <SelectContent>
                            {DATING_AGE_RANGES.map(r => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-800">Potential matches</div>
                        <Button
                          variant="outline"
                          className="h-9"
                          onClick={() => {
                            const list = generateDatingRoster({
                              gameState,
                              preference: preference || 'anyone',
                              ageRangeId,
                              size: DATING_ROSTER_SIZE || 8,
                              excludeSignatures: [],
                              seenSignatures: [],
                            });
                            setRoster(list);
                            toast('Roster refreshed.', { icon: '🔁' });
                          }}
                          disabled={!preference}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      </div>

                      {!preference ? (
                        <div className="mt-3 text-xs text-slate-500">
                          Pick a preference to generate profiles.
                        </div>
                      ) : roster.length === 0 ? (
                        <div className="mt-3 text-xs text-slate-500">
                          No matches loaded yet. Tap Refresh.
                        </div>
                      ) : (
                        <div className="mt-3 space-y-2">
                          {roster.map(profile => {
                            const meta = getSpriteMetaForDatingProfile(profile, gameState);
                            return (
                              <div
                                key={profile.id}
                                className="rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-3"
                              >
                                <PlayerSpriteAvatar
                                  genderKey={meta.genderKey}
                                  ageNumber={meta.ageNumber}
                                  index={meta.index}
                                  size={52}
                                  fallbackEmoji={profile.avatar}
                                  className="rounded-2xl bg-slate-50 border border-slate-100 shadow-sm shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-slate-800 truncate">
                                    {profile.name}, {profile.age}
                                  </div>
                                  <div className="text-xs text-slate-500 truncate">
                                    {profile.jobVibe} • {profile.intent}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-1">
                                    Compatibility: <span className="font-semibold text-slate-600">{profile.compatibilityScore}%</span> • {profile.matchStrength}
                                  </div>
                                </div>

                                <Button
                                  onClick={() => goOnDate(profile)}
                                  className="h-10 px-4 bg-pink-500 hover:bg-pink-600 text-white"
                                >
                                  Date
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-[11px] text-slate-500">
                      Typical date cost varies. (This game does not show explicit content.)
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}