import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, AlertTriangle } from 'lucide-react';
import { useGameState, formatMoney, getCountryByIso3, createSeededRng } from '@/components/game/GameStateContext';
import { OFFICES, getOfficeById, computeElectionChance, pickRumor, generateOpponent } from '@/components/game/politicsSystem';
import { ensurePoliticsCorruptionState, previewCorruptionAction, applyCorruptionAction, getOfficeTier as getOfficeTierFromEngine, INVEST_STAGE } from '@/components/game/politicsCorruptionEngine';
import { pickHumor, appendHumor } from './humorUtils';
import { Button } from '@/components/ui/button';
import { getPartyOptionsForCountry, getDefaultPartyIdForCountry, isIndependentParty } from '@/components/game/politicsParties';
import { PLATFORM_TAGS } from '@/components/game/politicsPlatforms';

const BASE_EMBEZZLE_AMOUNTS = [25000, 75000, 200000, 600000];
const BASE_CATCH_CHANCE     = [0.22,   0.16,   0.10,    0.06];

function getOfficeTier(officeId) { return getOfficeTierFromEngine(officeId); }

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function PoliticsModal({ open, onClose }) {
    const { gameState, updateState, spendFocus, applyMoneyDelta, applyStress, applyFameDelta, applyReputationDelta, emitActionResult, recordTimelineEntry, formatBaseToLocal, getFameTier, addLog } = useGameState();
  const { famePoints, politics, stats, pta, socialMedia } = gameState;
  
  const [selectedOfficeId, setSelectedOfficeId] = useState(null);
  const [campaignStep, setCampaignStep] = useState(null); // 'strategy' | 'rumor' | 'confirm'
  const [pendingCampaign, setPendingCampaign] = useState(null); // { office, strategy, partyId }
  const [activeRumor, setActiveRumor] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [pollingPct, setPollingPct] = useState(null);
  const [campaignSpend, setCampaignSpend] = useState(0);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Ensure default party for country
      const parties = getPartyOptionsForCountry(gameState.countryIso3);
      const validIds = new Set(parties.map(p => p.id));
      if (!politics.partyId || !validIds.has(politics.partyId)) {
        const def = getDefaultPartyIdForCountry(gameState.countryIso3);
        updateState(prev => ({ politics: { ...prev.politics, partyId: def } }));
      }
    } else {
      document.body.style.overflow = '';
      setCampaignStep(null);
      setPendingCampaign(null);
      setActiveRumor(null);
      setOpponent(null);
      setPollingPct(null);
      setSelectedOfficeId(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Adjust party if country changes
  React.useEffect(() => {
    const parties = getPartyOptionsForCountry(gameState.countryIso3);
    const validIds = new Set(parties.map(p => p.id));
    if (!politics.partyId || !validIds.has(politics.partyId)) {
      const def = getDefaultPartyIdForCountry(gameState.countryIso3);
      updateState(prev => ({ politics: { ...prev.politics, partyId: def } }));
    }
  }, [gameState.countryIso3]);

  const fameTier = getFameTier(famePoints);
  const totalFollowers = Object.values(socialMedia?.accounts || {}).reduce((sum, acc) => sum + (acc.active ? acc.followers : 0), 0);
  
  const formatFollowersCompact = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const currentOffice = politics.currentOfficeId ? getOfficeById(politics.currentOfficeId) : null;
  const countryName = getCountryByIso3(gameState.countryIso3)?.name || "your country";

  const getOfficeLabel = (office) => {
    if (!office) return '';
    return office.id === 'president' ? `President of ${countryName}` : office.label;
  };

  const handleRunClick = (officeId) => {
    setSelectedOfficeId(officeId);
    const office = getOfficeById(officeId);
    const available = Number(gameState.money || 0) + Number(politics.warChest || 0);
    const suggested = Math.round(office.campaignSpendMax * 0.25 / 500) * 500;
    setCampaignSpend(Math.min(suggested, available));
    setCampaignStep('strategy');
  };

  const computeSpendChanceMod = (spend, office) => {
    const minMod = -10, maxMod = 30;
    const t = office.campaignSpendMax <= 0 ? 0 : (spend / office.campaignSpendMax);
    return Math.round(minMod + t * (maxMod - minMod));
  };

  const computeSpendStressMod = (spend, office) => {
    const t = office.campaignSpendMax <= 0 ? 0 : (spend / office.campaignSpendMax);
    return Math.round(t * 10) / 10;
  };

  const warChest = Number(politics.warChest || 0);
  const corrState = ensurePoliticsCorruptionState(politics.corruption);
  const platformTags = Array.isArray(politics.platformTags) ? politics.platformTags : [];

  const togglePlatformTag = (id) => {
    const has = platformTags.includes(id);
    let next = platformTags;
    if (has) next = platformTags.filter(x => x !== id);
    else next = [...platformTags, id].slice(0, 2);
    updateState(prev => ({ politics: { ...prev.politics, platformTags: next } }));
  };

  const handlePartyChange = (e) => {
    const pid = e.target.value;
    updateState(prev => ({ politics: { ...prev.politics, partyId: pid } }));
  };

  const handleCampaignContinue = () => {
    const office = getOfficeById(selectedOfficeId);
    const spend = clamp(campaignSpend, office.campaignSpendMin, office.campaignSpendMax);
    const chanceMod = computeSpendChanceMod(spend, office);
    const stressMod = computeSpendStressMod(spend, office);

    const strategy = {
      label: `Campaign Spend: $${formatBaseToLocal(spend)}`,
      spend,
      chanceMod,
      stressMod
    };

    const isReelection = (politics.currentOfficeId === office.id) && (politics.termEndsAtAge != null) && (gameState.currentYear >= politics.termEndsAtAge);
    const partyIdForRun = politics.partyId;
    setPendingCampaign({ office, strategy, partyId: partyIdForRun });

    // Pre-generate opponent and polling for confirm step (deterministic)
    const parties = getPartyOptionsForCountry(gameState.countryIso3);
    const opp = generateOpponent({ rngSeed: gameState.runSeed + '|' + gameState.currentYear + '|' + office.id, countryIso3: gameState.countryIso3, playerPartyId: partyIdForRun, parties });

    // Compute base chance (without rumor yet)
    const partySupport = (parties.find(p => p.id === partyIdForRun)?.machineStrength || 0);
    const platformBonus = (platformTags.length === 2 ? 2 : 0);
    const ch = computeElectionChance({
      office,
      stats,
      fameBonus: getFameTier(famePoints).electionBonus,
      totalFollowers,
      campaignChanceMod: strategy.chanceMod,
      incumbencyBonus: isReelection ? 7 : 0,
      scandalPenalty: Math.min(25, (politics.activeScandals || []).reduce((s, x) => s + x.lingeringPenalty, 0)),
      ptaInfluence: pta?.stats?.influence || 0,
      platformBonus,
      partySupport,
      approval: politics.approval || 55,
      opponentStrength: opp.strength,
    });

    // polling with small deterministic noise
    const seedStr = gameState.runSeed + '|poll|' + office.id + '|' + gameState.currentYear;
    let hh = 0; for (let i = 0; i < seedStr.length; i++) hh = ((hh << 5) - hh) + seedStr.charCodeAt(i) | 0;
    const noise = ((Math.abs(hh) % 7) - 3); // -3..+3
    const poll = Math.max(5, Math.min(95, ch - Math.floor(opp.strength / 2) + noise));

    setOpponent(opp);
    setPollingPct(poll);
    setCampaignStep('confirm');
  };

  const handleRumorResponse = (choiceLabel) => {
    const { template, isTrue } = activeRumor;
    const sev = template.severity;
    let chanceDelta = 0;
    let fameDelta = 0;
    let stressDelta = 0;
    let lingeringPenalty = 0;

    if (choiceLabel === 'Deny it.') {
      if (!isTrue) {
        chanceDelta = +8; fameDelta = +3; stressDelta = +0.5; lingeringPenalty = 0;
      } else {
        chanceDelta = -12; fameDelta = -10; stressDelta = +1.5; lingeringPenalty = 8 + sev * 2;
      }
    } else if (choiceLabel === 'Apologize.') {
      if (isTrue) {
        chanceDelta = +4; fameDelta = -2; stressDelta = +1; lingeringPenalty = 3 + sev;
      } else {
        chanceDelta = -4; fameDelta = -3; stressDelta = +0.5; lingeringPenalty = 2 + sev;
      }
    } else if (choiceLabel === 'Attack the accuser.') {
      if (stats.confidence >= 10) {
        chanceDelta = +5; fameDelta = +2; stressDelta = +1; lingeringPenalty = 2 + sev;
      } else {
        chanceDelta = -6; fameDelta = -4; stressDelta = +1.5; lingeringPenalty = 6 + sev * 2;
      }
    } else if (choiceLabel === 'Ignore it.') {
      chanceDelta = -2; fameDelta = -1; stressDelta = +0.5; lingeringPenalty = 4 + sev;
    }

    applyFameDelta(fameDelta, 'Scandal response');
    applyStress(stressDelta, 'Scandal stress');

    if (lingeringPenalty > 0) {
      const newScandal = {
        id: `scandal_${gameState.currentYear}_${template.id}`,
        title: template.title,
        severity: sev,
        isTrue,
        createdAtAge: gameState.currentYear,
        lingeringPenalty
      };
      updateState(prev => ({
        politics: {
          ...prev.politics,
          activeScandals: [...(prev.politics.activeScandals || []), newScandal]
        }
      }));
    }

    emitActionResult({
      actionId: 'runForOffice',
      title: `🗞️ Rumor: ${template.title}`,
      body: `${template.body}\n\nYou chose: ${choiceLabel}\n\nThe story ${isTrue ? 'had truth to it.' : 'was exaggerated.'}`,
      deltas: {},
      loveDelta: 0,
      stressDelta,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['politics', 'rumor'],
      meta: { emoji: '🗞️', skipTimelineRecord: true }
    });

    resolveElection({ office: pendingCampaign.office, strategy: pendingCampaign.strategy, partyId: pendingCampaign.partyId, rumorChanceDelta: chanceDelta });
  };

  const resolveElection = ({ office, strategy, partyId, rumorChanceDelta }) => {
    const isReelection = (politics.currentOfficeId === office.id) && (politics.termEndsAtAge != null) && (gameState.currentYear >= politics.termEndsAtAge);
    const scandalPenalty = Math.min(25, (politics.activeScandals || []).reduce((sum, s) => sum + s.lingeringPenalty, 0));

    const runPartyId = partyId || politics.partyId;
    const parties = getPartyOptionsForCountry(gameState.countryIso3);
    const partySupport = (parties.find(p => p.id === runPartyId)?.machineStrength || 0);
    const platformBonus = (platformTags.length === 2 ? 2 : 0);

    const opp = opponent || generateOpponent({ rngSeed: gameState.runSeed + '|' + gameState.currentYear + '|' + office.id, countryIso3: gameState.countryIso3, playerPartyId: runPartyId, parties });

    const chance = computeElectionChance({
      office,
      stats,
      fameBonus: fameTier.electionBonus,
      totalFollowers,
      campaignChanceMod: strategy.chanceMod + (rumorChanceDelta || 0),
      incumbencyBonus: isReelection ? 7 : 0,
      scandalPenalty,
      ptaInfluence: pta?.stats?.influence || 0,
      platformBonus,
      partySupport,
      approval: politics.approval || 55,
      opponentStrength: opp.strength,
    });

    const campaignCost = strategy.spend || Math.round(office.baseCampaignCost * (isReelection ? 0.85 : 1));

    // Pay from war chest first
    const payFromWarChest = (amount) => {
      let remaining = amount;
      let taken = 0;
      const wc = Number(politics.warChest || 0);
      const use = Math.min(wc, remaining);
      if (use > 0) {
        updateState(prev => ({ politics: { ...prev.politics, warChest: Math.max(0, (prev.politics.warChest || 0) - use) } }));
        taken += use; remaining -= use;
      }
      if (remaining > 0) applyMoneyDelta(-remaining);
      return amount; // for logging only
    };

    // Independent always lose rule
    const forcedLose = isIndependentParty(runPartyId);

    const seedStr = gameState.runSeed + '|elect|' + office.id + '|' + gameState.currentYear;
    let hh = 0; for (let i = 0; i < seedStr.length; i++) hh = ((hh << 5) - hh) + seedStr.charCodeAt(i) | 0;
    const r01 = (Math.abs(hh) % 100) / 100;
    const win = (!forcedLose) && (r01 * 100 < chance);


    if (win) {
      const approval = Math.max(35, Math.min(80, 55 + (stats.empathy - 5) * 2 + (stats.confidence - 5) * 2));
      
      const newPlayerCareer = {
        jobId: `politics_${office.id}`,
        jobTitle: getOfficeLabel(office),
        yearlyIncome: office.salaryYearlyIncome,
        educationLevelId: gameState.playerCareer?.educationLevelId || gameState.parentCareer?.educationLevelId || 'high_school',
        yearsInJob: 0
      };

      const newParentCareer = {
        jobId: `politics_${office.id}`,
        jobLevelIndex: 0,
        performance: 65,
        yearsInJob: 0,
        employed: true,
        yearlyIncome: office.salaryYearlyIncome,
        lastWorkedHardAge: -1,
        lastAskedRaiseAge: -1,
        lastProcessedAge: -1
      };

      updateState(prev => ({
        politics: {
          ...prev.politics,
          currentOfficeId: office.id,
          approval,
          termEndsAtAge: prev.currentYear + office.termYears,
          incumbentStreak: (prev.politics.incumbentStreak || 0) + (isReelection ? 1 : 0),
          lastCampaignAge: prev.currentYear,
          careerBeforeOfficeSnapshot: {
            playerCareer: prev.playerCareer || null,
            partnerCareer: prev.partnerCareer || null,
            parentCareer: prev.parentCareer || null,
            incomeTier: prev.incomeTier || 'medium',
          }
        },
        playerCareer: newPlayerCareer,
        parentCareer: newParentCareer
      }));

      applyFameDelta(office.fameGainOnWin, `Elected ${office.label}`);

      let marginText = "a shock upset";
      if (chance >= 70) marginText = "a landslide";
      else if (chance >= 55) marginText = "a comfortable margin";
      else if (chance >= 45) marginText = "a squeaker";

      // Why breakdown
      const approvalBonus = Math.max(-5, Math.min(8, Math.floor(((politics.approval || 55) - 55) / 5)));
      const partySupport2 = (getPartyOptionsForCountry(gameState.countryIso3).find(p => p.id === runPartyId)?.machineStrength || 0);
      const partyName = parties.find(p => p.id === runPartyId)?.label || 'Independent';
      const platformBonus2 = (platformTags.length === 2 ? 2 : 0);
      const incumbency2 = isReelection ? 7 : 0;
      const oppPenalty2 = Math.max(0, Math.floor(opp.strength / 2));
      const lines2 = [];
      const pushIf2 = (label, n) => { if (n) lines2.push(`• ${label}: ${n>0?'+':''}${n}`); };
      lines2.push(`• Party: ${partyName}`);
      lines2.push(`• Win chance: ${chance}%`);
      lines2.push(`• Roll: ${Math.round(r01*100)}`);
      pushIf2('Fame', getFameTier(famePoints).electionBonus);
      pushIf2('Approval', approvalBonus);
      if (scandalPenalty) lines2.push(`• Scandals: -${scandalPenalty}`);
      pushIf2('Party Support', partySupport2);
      if (platformBonus2) lines2.push(`• Platform: +${platformBonus2}`);
      if (incumbency2) lines2.push(`• Incumbency: +${incumbency2}`);
      lines2.push(`• Opponent Strength: -${oppPenalty2}`);
      const why2 = ['Why it happened:', ...lines2.slice(0,10)].join('\n');

      emitActionResult({
        actionId: 'runForOffice',
        title: `✅ Election Win`,
        body: `You win the election and take office.\n\nYour old job ends, and your income is replaced by your new salary.\n\n${why2}`, 
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['politics', 'career'],
        meta: { emoji: office.emoji }
      });

      // Headline + why breakdown
      const winHeads = [
        `Local news: 'A new face takes the ${getOfficeLabel(office)} seat.'`,
        `Breaking: 'You win the ${getOfficeLabel(office)} race.'`,
        `Headline: 'Voters choose you for ${getOfficeLabel(office)}.'`
      ];
      const hi = Math.abs(hh) % winHeads.length;
      recordTimelineEntry({
        kind: 'politics',
        title: `📰 HEADLINE`,
        detail: `${winHeads[hi]}\nOpponent: ${opponent?.name || 'Opponent'}`,
        deltas: null,
        moneyDelta: -campaignCost,
        loveDelta: 0,
        stressDelta: strategy.stressMod
      });

    } else {
      applyStress(1, 'Election loss');
      // If losing while in office during reelection, restore previous job
      if (isReelection && politics.currentOfficeId === office.id) {
        updateState(prev => {
          const snap = prev.politics.careerBeforeOfficeSnapshot;
          const next = { ...prev, politics: { ...prev.politics, currentOfficeId: null, termEndsAtAge: null } };
          if (snap) {
            next.playerCareer = snap.playerCareer || null;
            next.partnerCareer = snap.partnerCareer || null;
            next.parentCareer = snap.parentCareer || null;
            next.incomeTier = snap.incomeTier || prev.incomeTier;
          } else {
            next.playerCareer = null;
          }
          return next;
        });
      }
      const fameLoss = office.id === 'president' ? -8 : -3;
      applyFameDelta(fameLoss, 'Election loss');

      const title = forcedLose ? '🗳️ Independent Run' : '❌ Election Loss';
      const baseBody = `You lose the race.\n\nYou pay the price in money, stress, and ego — but you learn what voters react to.\n\nYou can run again next year.`;
      const childName = gameState.childName || 'your kid';
      const selectedParty = parties.find(p => p.id === runPartyId);
      const partyName = selectedParty?.label || 'Independent';
      const body = appendHumor(baseBody, 'politicsLoss', { childName, partyName, officeTitle: getOfficeLabel(office) });
      const funnyReason = pickHumor('politicsLoss', { officeTitle: getOfficeLabel(office), partyName, childName });
      // Why breakdown
      const approvalBonus = Math.max(-5, Math.min(8, Math.floor(((politics.approval || 55) - 55) / 5)));
      const partySupport2 = (parties.find(p => p.id === runPartyId)?.machineStrength || 0);
      const platformBonus = (platformTags.length === 2 ? 2 : 0);
      const incumbency = isReelection ? 7 : 0;
      const oppPenalty = Math.max(0, Math.floor(opp.strength / 2));
      const lines = [];
      const pushIf = (label, n, sign = 1) => { if (n) lines.push(`• ${label}: ${n>0?'+':''}${n}`); };
      lines.push(`• Party: ${partyName}`);
      lines.push(`• Win chance: ${chance}%`);
      lines.push(`• Roll: ${Math.round(r01*100)}`);
      pushIf('Fame', getFameTier(famePoints).electionBonus);
      pushIf('Approval', approvalBonus);
      if (scandalPenalty) lines.push(`• Scandals: -${scandalPenalty}`);
      pushIf('Party Support', partySupport2);
      if (platformBonus) lines.push(`• Platform: +${platformBonus}`);
      if (incumbency) lines.push(`• Incumbency: +${incumbency}`);
      lines.push(`• Opponent Strength: -${oppPenalty}`);
      const why = ['Why it happened:', ...lines.slice(0,10)].join('\n');

      emitActionResult({
        actionId: 'runForOffice',
        title,
        body: `${body}\n\n${why}`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 1,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['politics'],
        meta: { emoji: '❌' }
      });

      const loseHeads = [
        `Local news: 'Tough loss in the ${getOfficeLabel(office)} race.'`,
        `Headline: 'Opponent wins the ${getOfficeLabel(office)} seat.'`,
        `Breaking: 'You fall short in the ${getOfficeLabel(office)} race.'`
      ];
      const li = Math.abs(hh) % loseHeads.length;
      recordTimelineEntry({
        kind: 'politics',
        title: `📰 HEADLINE`,
        detail: `${loseHeads[li]}\nOpponent: ${opponent?.name || 'Opponent'}\nFunny reason: ${funnyReason}`,
        deltas: null,
        moneyDelta: -campaignCost,
        loveDelta: 0,
        stressDelta: 1 + strategy.stressMod
      });
    }

    // Pay now (war chest first)
    payFromWarChest(campaignCost);
    onClose();
  };

  // In-Office actions helpers
  const canGovern = !!currentOffice;

  const spendFocusSafe = (n, label) => {
    if (gameState.actionPoints < n) return false;
    return spendFocus(n, label);
  };

  // Single scandal helper (used by Fundraise/Sue and embezzlement outcomes)
  const addScandal = (id, title, severity, basePenalty, timelineText) => {
    updateState(prev => ({
      politics: {
        ...prev.politics,
        activeScandals: [
          ...(prev.politics.activeScandals || []),
          { id, title, severity, lingeringPenalty: basePenalty, createdAtAge: prev.currentYear }
        ]
      }
    }));
    recordTimelineEntry({ kind: 'politics', title: '🗞️ Rumor', detail: timelineText });
  };

  const applyApproval = (delta) => {
    updateState(prev => ({ politics: { ...prev.politics, approval: Math.max(0, Math.min(100, (prev.politics.approval || 55) + delta)) } }));
  };

  const fameTierIndex = ['unknown','local','regional','national','global'].indexOf(getFameTier(famePoints).tierId);

  const handleFundraise = () => {
    if (!canGovern) return;
    if (!spendFocusSafe(1, 'Fundraise')) return;
    const seed = gameState.runSeed + '|fund|' + gameState.currentYear;
    let h = 0; for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i) | 0;
    const r01 = (Math.abs(h) % 1000) / 1000; // 0..1
    const variance = 0.85 + (r01 * 0.30); // 0.85..1.15
    const base = 1200;
    const fbonus = Math.max(0, (fameTierIndex >= 0 ? fameTierIndex : 0)) * 400;
    const repBonus = Math.floor((gameState.reputation || 55) / 10) * 50;
    const gain = Math.round((base + fbonus + repBonus) * variance);
    updateState(prev => ({ politics: { ...prev.politics, warChest: (prev.politics.warChest || 0) + gain } }));
    emitActionResult({ title: '💰 Fundraiser Night', body: `You work the room, shake hands, and ask for support.\nYour campaign war chest grows by $${formatBaseToLocal(gain)}.`, tags: ['politics'] });
    // Scandal roll 18%
    const sSeed = seed + '|scandal'; let s = 0; for (let i = 0; i < sSeed.length; i++) s = ((s << 5) - s) + s.charCodeAt(i) | 0; const p = (Math.abs(s) % 100) / 100;
    if (p < 0.18) addScandal('questionable_donation', 'Questionable Donation', 2, 8, 'Rumor: A questionable donor is linked to your campaign.');
  };

  // Counter-Scandal tools
  const totalPenalty = (politics.activeScandals || []).reduce((sum, sc) => sum + (sc.lingeringPenalty || 0), 0);
  const reducePenalty = (amount) => {
    let rem = amount;
    updateState(prev => {
      const list = [...(prev.politics.activeScandals || [])];
      for (let i = 0; i < list.length && rem > 0; i++) {
        const cur = list[i];
        const take = Math.min(rem, cur.lingeringPenalty || 0);
        cur.lingeringPenalty = Math.max(0, (cur.lingeringPenalty || 0) - take);
        rem -= take;
      }
      return { politics: { ...prev.politics, activeScandals: list } };
    });
  };

  const handleReleaseReceipts = () => {
    if (gameState.money < 250) return;
    applyMoneyDelta(-250);
    reducePenalty(6);
    applyReputationDelta(1, 'Release Receipts');
    emitActionResult({ title: '🧾 Release Receipts', body: 'You publish receipts and screenshots.\nThe story cools down.' });
  };
  const handlePressConference = () => {
    if (!spendFocusSafe(1, 'Press Conference')) return;
    reducePenalty(4);
    applyFameDelta(1, 'Press Conference');
    applyStress(1, 'Press Conference');
    emitActionResult({ title: '📣 Press Conference', body: 'You face questions head‑on.\nThe public mood shifts.' });
  };

  const handleEmbezzle = () => {
    if (!currentOffice) return;
    if (!spendFocusSafe(1, 'Embezzle')) return;

    const tier = getOfficeTier(currentOffice.id);
    if (tier === -1) return;

    // 1. Payout
    const amount = Math.round(BASE_EMBEZZLE_AMOUNTS[tier] * (0.85 + Math.random() * 0.4));
    
    // 2. Catch chance
    let catchChance = BASE_CATCH_CHANCE[tier];
    // Discipline modifier (stat is 0-20, we map to a -0.05 to +0.05 modifier)
    catchChance += clamp((10 - (stats.discipline || 10)) / 200, -0.05, 0.05);
    // Stress modifier
    catchChance += clamp((gameState.stress - 40) / 500, 0, 0.10);
    // Scandal modifier
    catchChance += clamp((politics.activeScandals || []).length * 0.02, 0, 0.10);
    
    const finalCatchChance = clamp(catchChance, 0.01, 0.60);
    const caught = Math.random() < finalCatchChance;

    if (caught) {
      const legalCost = Math.round(BASE_EMBEZZLE_AMOUNTS[tier] * (0.15 + Math.random() * 0.20));
      applyMoneyDelta(-legalCost, 'Legal Fees');
      applyReputationDelta(-1 * (8 + Math.round(Math.random() * 12)), 'Embezzlement Scandal');
      applyFameDelta(-1 * (2 + Math.round(Math.random() * 6)), 'Embezzlement Scandal');
      addScandal('embezzlement', 'Embezzlement Investigation', 3, 15, 'Caught embezzling funds from public office.');

      const forcedOutChance = clamp(0.15 + tier * 0.10 + (politics.activeScandals || []).length * 0.05, 0, 0.75);
      if (Math.random() < forcedOutChance) {
        updateState(prev => {
          const snap = prev.politics.careerBeforeOfficeSnapshot;
          const next = { ...prev, politics: { ...prev.politics, currentOfficeId: null, termEndsAtAge: null }};
          if(snap) {
            next.playerCareer = snap.playerCareer || null;
            next.partnerCareer = snap.partnerCareer || null;
            next.parentCareer = snap.parentCareer || null;
            next.incomeTier = snap.incomeTier || prev.incomeTier;
          } else {
            next.playerCareer = null;
          }
          return next;
        });
        emitActionResult({ title: '🚨 Caught Embezzling!', body: `You were caught and forced to resign. An investigation is underway.`, tags: ['politics', 'crime'] });
        recordTimelineEntry({ kind: 'politics', title: 'Forced to Resign', detail: 'Caught in embezzlement scandal.' });

      } else {
        emitActionResult({ title: '🚨 Caught Embezzling!', body: `An investigation is launched. Your reputation takes a massive hit, and you face hefty legal fees.`, tags: ['politics', 'crime'] });
      }

    } else {
      applyMoneyDelta(amount, 'Embezzlement');
      updateState(prev => ({ politics: { ...prev.politics, approval: Math.max(0, (prev.politics.approval || 55) - 1) } }));
      emitActionResult({ title: '💰 Successful Embezzlement', body: `You quietly diverted $${formatBaseToLocal(amount)}.`, tags: ['politics', 'crime']});
    }
  };


  const handleSue = () => {
    if (gameState.money < 2000) return;
    applyMoneyDelta(-2000);
    // 55% remove lowest severity scandal; else add Streisand
    const seed = gameState.runSeed + '|sue|' + gameState.currentYear; let h = 0; for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i) | 0; const r = (Math.abs(h) % 100) / 100;
    if (r < 0.55) {
      updateState(prev => {
        const list = [...(prev.politics.activeScandals || [])];
        if (list.length > 0) {
          list.sort((a,b) => (a.severity||0) - (b.severity||0));
          list.shift();
        }
        return { politics: { ...prev.politics, activeScandals: list } };
      });
      applyReputationDelta(2, 'Defamation Suit');
    } else {
      addScandal('streisand', 'Streisand Effect', 2, 6, 'Rumor: The lawsuit backfires.');
      applyReputationDelta(-2, 'Streisand Effect');
    }
    emitActionResult({ title: '⚖️ Sue for Defamation', body: 'Your lawyers file suit.\nThe rumor either collapses or explodes.' });
  };
  const handleScapegoat = () => {
    // cost reputation 2
    applyReputationDelta(-2, 'Scapegoat');
    reducePenalty(8);
    applyFameDelta(1, 'Scapegoat');
    emitActionResult({ title: '🧑‍💼 Scapegoat', body: 'You pin it on a staffer.\nThe heat drops—but it looks ugly.' });
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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🗳️ Politics</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Campaign, face rumors, and climb the ladder.</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                
                {/* Section A: Public Profile */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{fameTier.emoji}</span>
                    <div>
                      <div className="font-bold text-slate-800">{fameTier.label}</div>
                      <div className="text-xs text-slate-500">Fame Tier</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Fame: {famePoints}/1000</span>
                    <span>Total Followers: {formatFollowersCompact(totalFollowers)}</span>
                  </div>
                </div>

                {/* Section B: Current Office */}
                <div className="mb-6 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                  {currentOffice ? (
                    <>
                      <div className="font-bold text-indigo-900 text-lg mb-1">
                        Current Office: {currentOffice.emoji} {getOfficeLabel(currentOffice)}
                      </div>
                      <div className="text-sm text-indigo-700 space-y-0.5">
                        <div>Approval: {politics.approval}/100</div>
                        <div>Salary: ${formatBaseToLocal(currentOffice.salaryYearlyIncome)}/yr</div>
                        <div>Term: {currentOffice.termYears} years (informational)</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-slate-700 mb-1">Current Office: None</div>
                      <div className="text-xs text-slate-500">Win an election to replace your job with a public salary.</div>
                    </>
                  )}

                  {currentOffice && (
                    <div className="mt-4">
                      <h4 className="font-bold text-slate-800 text-lg mb-2">In-Office Actions</h4>

                      {/* Corruption (abstract) */}
                      {(() => {
                        const corr = ensurePoliticsCorruptionState(politics.corruption);
                        const heat = Math.max(0, Math.min(100, Number(corr.heat || 0)));
                        const heatLabel = heat >= 75 ? 'Critical' : heat >= 50 ? 'High' : heat >= 25 ? 'Medium' : 'Low';
                        const heatColor = heat >= 75 ? 'bg-rose-500' : heat >= 50 ? 'bg-amber-500' : heat >= 25 ? 'bg-yellow-400' : 'bg-emerald-500';
                        const leads = corr.leads || [];
                        const invs = corr.investigations || [];
                        const recent = (corr.recentActions || []).slice(-5).reverse();

                        const actions = [
                          { id: 'accept_bribe', label: 'Accept Bribe', focus: 1, disabled: !currentOffice },
                          { id: 'kickbacks', label: 'Kickbacks / Steering Contracts', focus: 1, disabled: !currentOffice },
                          { id: 'patronage_hire', label: 'Patronage Hire', focus: 1, disabled: !currentOffice },
                          { id: 'pressure_donor', label: 'Pressure Donor', focus: 1, disabled: !currentOffice },
                          { id: 'launder_funds', label: 'Launder Funds', focus: 1, disabled: Number(corr.dirtyMoney||0) <= 0 },
                          { id: 'cover_up', label: 'Cover-Up', focus: 1, disabled: (heat <= 0 && leads.length===0 && invs.length===0) },
                          { id: 'transparency_push', label: 'Transparency Push', focus: 1, disabled: false },
                        ];

                        const handleCorruptAct = (act) => {
                          updateState(prev => {
                            if (prev.actionPoints < 1) return prev;
                            
                            const age = Number(prev.currentYear || 0);
                            const seed = `${prev.runSeed || 'seed'}|corrupt|age:${age}|${act}|ac:${prev.politics?.corruption?.actionCount || 0}`;
                            const rng = createSeededRng(seed).nextFloat;
                            const { nextState, result } = applyCorruptionAction(prev, act, rng);
                            
                            // Atomically deduct focus
                            nextState.actionPoints = prev.actionPoints - 1;
                            
                            // Show result
                            setTimeout(() => {
                              const title = `⚖️ ${act.replace(/_/g,' ')}`;
                              emitActionResult({ title, body: result.success ? 'It went quietly (for now).' : 'It got messy fast.', deltas: null, moneyDelta: 0, loveDelta: 0, stressDelta: 0, focusDelta: -1, tags: ['politics','corruption'], meta: { emoji: '⚖️' } });
                            }, 0);
                            
                            return nextState;
                          });
                        };

                        const stageLabel = (st) => st===INVEST_STAGE.RUMOR?'Rumor': st===INVEST_STAGE.INQUIRY?'Inquiry': st===INVEST_STAGE.INVESTIGATION?'Investigation': st===INVEST_STAGE.CHARGES?'Charges':'Resolution';

                        return (
                          <div className="rounded-xl border border-rose-200 p-4 mb-4 bg-rose-50/40">
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-bold text-rose-900">Corruption</div>
                              <div className="text-xs text-rose-700">Focus actions cost 1</div>
                            </div>

                            {/* Heat meter */}
                            <div className="mb-3">
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Heat</span>
                                <span>{heatLabel} ({heat}/100)</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded overflow-hidden">
                                <div className={`${heatColor} h-2`} style={{ width: `${heat}%` }} />
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-3">
                              <div className="p-2 rounded border bg-white">Dirty Funds: ${formatBaseToLocal(corr.dirtyMoney||0)}</div>
                              <div className="p-2 rounded border bg-white">Favors: {corr.favors||0}</div>
                              <div className="p-2 rounded border bg-white">Cash: ${formatBaseToLocal(gameState.money||0)}</div>
                              <div className="p-2 rounded border bg-white">War Chest: ${formatBaseToLocal(politics.warChest||0)}</div>
                            </div>

                            {/* Investigations */}
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-slate-600 mb-1">Active Investigations ({invs.length})</div>
                              {invs.length === 0 ? (
                                <div className="text-xs text-slate-500">None.</div>
                              ) : (
                                <div className="space-y-1">
                                  {invs.map(inv => (
                                    <div key={inv.id} className="p-2 rounded border bg-white text-xs flex items-center justify-between">
                                      <div>Stage: {stageLabel(inv.stage)} • Sev {inv.severity} • {inv.public ? 'Public' : 'Quiet'}</div>
                                      <div className="w-24 h-1.5 bg-slate-200 rounded overflow-hidden ml-2"><div className="bg-indigo-500 h-1.5" style={{ width: `${Math.min(100, inv.progress||0)}%` }} /></div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Recent actions */}
                            {recent.length > 0 && (
                              <div className="mb-3">
                                <div className="text-xs font-semibold text-slate-600 mb-1">Recent</div>
                                <ul className="text-xs text-slate-600 list-disc pl-5 space-y-0.5">
                                  {recent.map((line, idx) => (<li key={idx}>{line}</li>))}
                                </ul>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-1 gap-2">
                              {actions.map(a => {
                                const prev = previewCorruptionAction(gameState, a.id);
                                const disabled = a.disabled || gameState.actionPoints < 1;
                                const reason = a.disabled ? (a.id==='launder_funds'?'Requires dirty funds':'Not holding office / conditions not met') : (gameState.actionPoints<1?'Not enough Focus':'');
                                return (
                                  <div key={a.id} className={`rounded-xl border p-3 ${disabled?'opacity-60 bg-slate-50 border-slate-200':'bg-white border-slate-200'}`}>
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="font-medium text-slate-800 text-sm">{a.label}</div>
                                        <div className="text-[11px] text-slate-500">Focus {a.focus} • Heat ~{prev.estimatedHeatDelta >= 0 ? '+' : ''}{prev.estimatedHeatDelta} • Favors ~{prev.estimatedFavorsDelta} • Exposure ~{Math.round((prev.exposureChance||0)*100)}%</div>
                                        {reason && <div className="text-[10px] text-rose-600 mt-1">{reason}</div>}
                                      </div>
                                      <Button size="sm" onClick={() => handleCorruptAct(a.id)} disabled={disabled}>Act (1)</Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="space-y-2">
                        {/* Embezzle Action */}
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-bold text-slate-800">💰 Embezzle</div>
                              <div className="text-xs text-slate-500">Divert public funds to your personal account. Risky.</div>
                            </div>
                            <Button size="sm" onClick={handleEmbezzle} disabled={!canGovern || gameState.actionPoints < 1}>
                              Act (1 Focus)
                            </Button>
                          </div>
                          {(() => {
                            const tier = getOfficeTier(currentOffice.id);
                            if (tier === -1) return null;
                            
                            const amount = BASE_EMBEZZLE_AMOUNTS[tier];
                            let catchChance = BASE_CATCH_CHANCE[tier];
                            catchChance += clamp((10 - (stats.discipline || 10)) / 200, -0.05, 0.05);
                            catchChance += clamp((gameState.stress - 40) / 500, 0, 0.10);
                            catchChance += clamp((politics.activeScandals || []).length * 0.02, 0, 0.10);
                            const finalCatchChance = clamp(catchChance, 0.01, 0.60);

                            return (
                              <div className="text-xs text-slate-600 mt-2 space-y-1">
                                <div>Take: ~${formatBaseToLocal(amount)} (varies)</div>
                                <div>Risk of getting caught: ~{Math.round(finalCatchChance * 100)}%</div>
                              </div>
                            );
                          })()}
                        </div>
                        {/* Fundraise Action */}
                        <div className="rounded-xl border border-slate-200 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-bold text-slate-800">🤝 Fundraise</div>
                              <div className="text-xs text-slate-500">Work the room, shake hands, and ask for support.</div>
                            </div>
                            <Button size="sm" onClick={handleFundraise} disabled={!canGovern || gameState.actionPoints < 1}>Act (1 Focus)</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentOffice && politics.termEndsAtAge != null && gameState.currentYear >= politics.termEndsAtAge && (
                   <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="font-semibold text-amber-900">⏳ Term Complete</div>
                      <div className="text-xs text-amber-800 mb-2">Your term is over. You must run for re‑election or step down.</div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { 
                          const office = getOfficeById(currentOffice.id);
                          const available = Number(gameState.money || 0) + Number(politics.warChest || 0);
                          const suggested = Math.round(office.campaignSpendMax * 0.25 / 500) * 500;
                          setCampaignSpend(Math.min(suggested, available));
                          setSelectedOfficeId(currentOffice.id); 
                          setCampaignStep('strategy'); 
                        }}>Run for re‑election</Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          // Step down
                          updateState(prev => {
                            const snap = prev.politics.careerBeforeOfficeSnapshot;
                            const next = { ...prev, politics: { ...prev.politics, currentOfficeId: null, termEndsAtAge: null, approval: Math.max(0, (prev.politics.approval||55) - 5) } };
                            if (snap) {
                              next.playerCareer = snap.playerCareer || null;
                              next.partnerCareer = snap.partnerCareer || null;
                              next.parentCareer = snap.parentCareer || null;
                              next.incomeTier = snap.incomeTier || prev.incomeTier;
                            } else {
                              next.playerCareer = null;
                            }
                            return next;
                          });
                          recordTimelineEntry({ kind: 'politics', title: 'You resigned from office.', detail: '' });
                        }}>Step down</Button>
                      </div>
                    </div>
                  )}

                  {currentOffice && (
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={() => {
                        // Resign confirm
                        const ok = window.confirm('Are you sure you want to resign? You will lose your title and return to your previous job.');
                        if (!ok) return;
                        updateState(prev => {
                          const snap = prev.politics.careerBeforeOfficeSnapshot;
                          const next = { ...prev, politics: { ...prev.politics, currentOfficeId: null, termEndsAtAge: null, approval: Math.max(0, (prev.politics.approval||55) - 5) } };
                          if (snap) {
                            next.playerCareer = snap.playerCareer || null;
                            next.partnerCareer = snap.partnerCareer || null;
                            next.parentCareer = snap.parentCareer || null;
                            next.incomeTier = snap.incomeTier || prev.incomeTier;
                          } else {
                            next.playerCareer = null;
                          }
                          return next;
                        });
                        recordTimelineEntry({ kind: 'politics', title: 'You resigned from office.', detail: '' });
                      }}>Resign from Office</Button>
                    </div>
                  )}
                </div>

                {/* Party + Platform + War Chest */}
                {!campaignStep && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="font-bold text-slate-800 mb-2">🏳️ Party Affiliation</div>
                      <div className="text-sm text-slate-600 mb-2">Choose a party for your campaign.</div>
                      <select value={politics.partyId || ''} onChange={handlePartyChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white">
                        {getPartyOptionsForCountry(gameState.countryIso3).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.id === 'independent' ? 'Independent (No Party) — guaranteed loss' : `${p.label}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="font-bold text-slate-800 mb-2">🧭 Your Platform</div>
                      <div className="text-sm text-slate-600 mb-2">Pick exactly 2 issues to stand for. (This affects events and elections.)</div>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORM_TAGS.map(tag => {
                          const selected = platformTags.includes(tag.id);
                          return (
                            <button key={tag.id} onClick={() => togglePlatformTag(tag.id)} className={`px-3 py-1 rounded-full text-sm border ${selected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
                              <span className="mr-1">{tag.emoji}</span>{tag.label}
                            </button>
                          );
                        })}
                      </div>
                      {platformTags.length !== 2 && (
                        <div className="text-xs text-rose-600 mt-2 font-semibold">Pick 2 platform issues before you run.</div>
                      )}
                    </div>

                    <div className="text-sm text-slate-700">Campaign War Chest: ${formatBaseToLocal(warChest)}</div>
                    {OFFICES.map(office => {
                      const baseCost = Math.round(office.baseCampaignCost * 0.75); // Min cost for shoestring
                      const canAfford = gameState.money >= baseCost;
                      const hasFame = famePoints >= office.requiredFame;
                      const hasFocus = gameState.actionPoints >= 1;
                      const alreadyHolds = politics.currentOfficeId === office.id;
                      
                      let reason = "";
                      if (alreadyHolds) reason = "You already hold this office.";
                      else if (!hasFame) reason = "Not famous enough yet.";
                      else if (!canAfford) reason = "Not enough money to campaign.";
                      else if (!hasFocus) reason = "Not enough Focus.";

                      const needsPlatform = platformTags.length !== 2;
                      const disabled = alreadyHolds || !hasFame || !canAfford || !hasFocus || needsPlatform;

                      return (
                        <div key={office.id} className={`border rounded-xl p-4 ${disabled ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{office.emoji}</span>
                              <span className="font-bold text-slate-800">{getOfficeLabel(office)}</span>
                            </div>
                            <Button 
                              size="sm" 
                              disabled={disabled}
                              onClick={() => handleRunClick(office.id)}
                              className={disabled ? 'opacity-50' : 'bg-indigo-600 hover:bg-indigo-700'}
                            >
                              Run
                            </Button>
                          </div>
                          <div className="text-xs text-slate-600 space-y-1">
                            <div>Requires Fame: {office.requiredFame}+</div>
                            <div>Campaign Cost: ${formatBaseToLocal(office.baseCampaignCost)}</div>
                            <div>Salary: ${formatBaseToLocal(office.salaryYearlyIncome)}/yr</div>
                          </div>
                          {disabled && (<div className="text-xs text-rose-500 mt-2 font-medium">{reason || (platformTags.length !== 2 ? 'Pick 2 platform issues first.' : '')}</div>)}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Campaign Strategy Step */}
                {campaignStep === 'strategy' && (() => {
                  const office = getOfficeById(selectedOfficeId);
                  const available = Number(gameState.money || 0) + Number(politics.warChest || 0);
                  const spend = clamp(campaignSpend, office.campaignSpendMin, office.campaignSpendMax);
                  const chanceMod = computeSpendChanceMod(spend, office);
                  const canAfford = spend <= available;
                  const step = office.campaignSpendMax <= 50000 ? 500 : 1000;

                  return (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-lg">Campaign Spend</h4>
                      
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-700">Spend Amount</span>
                            <span className="text-xl font-bold text-indigo-900">${formatBaseToLocal(spend)}</span>
                          </div>
                          <input 
                            type="range" 
                            min={office.campaignSpendMin} 
                            max={office.campaignSpendMax} 
                            step={step}
                            value={campaignSpend}
                            onChange={(e) => setCampaignSpend(Number(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>${formatBaseToLocal(office.campaignSpendMin)}</span>
                            <span>${formatBaseToLocal(office.campaignSpendMax)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Chance impact:</span>
                            <span className={`font-semibold ${chanceMod >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                              {chanceMod >= 0 ? '+' : ''}{chanceMod}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Available funds:</span>
                            <span className="font-medium text-slate-800">${formatBaseToLocal(available)}</span>
                          </div>
                        </div>

                        {!canAfford && (
                          <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 font-medium">
                            Not enough funds (war chest + cash).
                          </div>
                        )}

                        <div className="mt-3 text-xs text-slate-500 italic">
                          Higher spend increases visibility and odds.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          className="w-full bg-indigo-600 hover:bg-indigo-700" 
                          onClick={handleCampaignContinue}
                          disabled={!canAfford}
                        >
                          Continue
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setCampaignStep(null)}>Back</Button>
                        <Button variant="ghost" className="w-full text-rose-600" onClick={() => { setCampaignStep(null); setPendingCampaign(null); setActiveRumor(null); }}>
                          I changed my mind — I don't want to run.
                        </Button>
                      </div>
                    </div>
                  );
                })()}

                {/* Confirm Step */}
                {campaignStep === 'confirm' && pendingCampaign && opponent && (() => {
                  const parties = getPartyOptionsForCountry(gameState.countryIso3);
                  const partyName = parties.find(p => p.id === pendingCampaign.partyId)?.label || 'Independent';
                  
                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="font-bold text-slate-800 mb-2">Campaign Summary</div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Office:</span>
                            <span className="font-medium">{getOfficeLabel(pendingCampaign.office)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Party:</span>
                            <span className="font-medium">{partyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Spend:</span>
                            <span className="font-medium">${formatBaseToLocal(pendingCampaign.strategy.spend)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Chance impact:</span>
                            <span className={`font-semibold ${pendingCampaign.strategy.chanceMod >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                              {pendingCampaign.strategy.chanceMod >= 0 ? '+' : ''}{pendingCampaign.strategy.chanceMod}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="font-bold text-slate-800 mb-1">Opponent: {opponent.name} ({opponent.archetype})</div>
                        <div className="text-sm text-slate-600 mb-2">{opponent.attackLine}</div>
                        <div className="text-xs text-slate-500">Polling: {pollingPct}%</div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          onClick={() => {
                            // After confirm, optionally a rumor pre-run using deterministic pick
                            const rumorChance = Math.max(15, Math.min(65, 20 + fameTier.rumorAttractionBonus + pendingCampaign.office.difficultyPenalty * 0.5));
                            const seedStr = gameState.runSeed + '|rumorChance|' + pendingCampaign.office.id + '|' + gameState.currentYear;
                            let h2 = 0; for (let i = 0; i < seedStr.length; i++) h2 = ((h2 << 5) - h2) + seedStr.charCodeAt(i) | 0;
                            const r01 = (Math.abs(h2) % 100) / 100;
                            if (r01 * 100 < rumorChance) {
                              const rumor = pickRumor(fameTier, stats.discipline, gameState.runSeed, gameState.currentYear);
                              setActiveRumor(rumor);
                              setCampaignStep('rumor');
                            } else {
                              resolveElection({ office: pendingCampaign.office, strategy: pendingCampaign.strategy, partyId: pendingCampaign.partyId, rumorChanceDelta: 0 });
                            }
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          Run
                        </Button>
                        <Button variant="ghost" className="w-full text-rose-600" onClick={() => { setCampaignStep(null); setPendingCampaign(null); setOpponent(null); setPollingPct(null); }}>I changed my mind — I don't want to run.</Button>
                      </div>
                    </div>
                  );
                })()}

                {/* Rumor Step */}
                {campaignStep === 'rumor' && activeRumor && (
                  <div className="space-y-4">
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                      <h4 className="font-bold text-rose-900 text-lg mb-2">🗞️ Campaign Rumor</h4>
                      <div className="text-sm text-slate-800 mb-3">
                        <strong>{activeRumor.template.title}</strong>
                      </div>
                      <div className="text-sm text-slate-700">{activeRumor.template.body}</div>
                    </div>

                    <div className="space-y-2">
                      {['Deny it.', 'Apologize.', 'Attack the accuser.', 'Ignore it.'].map((choice, idx) => (
                        <Button key={idx} variant="outline" className="w-full text-left justify-start" onClick={() => handleRumorResponse(choice)}>
                          {choice}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Counter-Scandal Tools (if scandals exist) */}
                {!campaignStep && totalPenalty > 0 && (
                  <div className="mt-6 rounded-xl border border-amber-200 p-4 bg-amber-50/30">
                    <h4 className="font-bold text-amber-900 mb-2">🛡️ Counter-Scandal Tools</h4>
                    <div className="text-xs text-slate-600 mb-3">Current Scandal Penalty: -{totalPenalty}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <div className="font-medium text-sm">🧾 Release Receipts</div>
                          <div className="text-xs text-slate-500">Cost: $250 • Reduces penalty by 6</div>
                        </div>
                        <Button size="sm" onClick={handleReleaseReceipts} disabled={gameState.money < 250}>Act</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <div className="font-medium text-sm">📣 Press Conference</div>
                          <div className="text-xs text-slate-500">Cost: 1 Focus • Reduces penalty by 4</div>
                        </div>
                        <Button size="sm" onClick={handlePressConference} disabled={gameState.actionPoints < 1}>Act</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <div className="font-medium text-sm">🧑‍💼 Scapegoat</div>
                          <div className="text-xs text-slate-500">Costs reputation • Reduces penalty by 8</div>
                        </div>
                        <Button size="sm" onClick={handleScapegoat}>Act</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <div className="font-medium text-sm">⚖️ Sue for Defamation</div>
                          <div className="text-xs text-slate-500">Cost: $2,000 • 55% remove scandal</div>
                        </div>
                        <Button size="sm" onClick={handleSue} disabled={gameState.money < 2000}>Act</Button>
                      </div>
                    </div>
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