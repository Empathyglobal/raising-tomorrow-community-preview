import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { RotateCcw, Briefcase, Heart, Home, Smile, Users, Clock, Sparkles, TrendingUp, Baby } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { setActiveKidReducer } from '@/components/game/siblingRivalry/kidHelpers';
import { useGameState, statTier, tierIcon, loveTier, describeStat } from '../components/game/GameStateContext';
import { getAvatarEmojiForAge } from '@/components/game/avatars';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { getStatLabel, formatStatNumber } from '@/components/game/ageAwareStatLabels';
import { OUTCOME_SECTION_ORDER, generateOutcomeV3 } from '@/components/game/outcomesEngine';
import { FAMILY_PATTERN_CATALOG } from '@/components/game/familyPatternCatalog';
import { getOutcomeHeadliners } from '@/components/game/outcomeHeadliners';
import { getEpilogueEcho } from '@/components/game/familyPatternsNarrative';
import { createOutcomeTestPayload } from '@/components/game/outcomeTestHarness';
import OutcomeShareCard from "@/components/game/OutcomeShareCard";
import ChildTraumaDetailsModal from "@/components/game/ChildTraumaDetailsModal";
import OutcomeStatsSummary from "@/components/game/OutcomeStatsSummary";
import ChildChatModal from "@/components/game/ChildChatModal";
import { MessageCircle } from 'lucide-react';
import SpecialEndingsExplorer from '@/components/game/SpecialEndingsExplorer';

const kindIcons = {
  major: '🎭',
  bond: '❤️',
  play: '🎮',
  study: '📘',
  tutor: '👨‍🏫',
  routine: '🕒',
  strategy: '🌿',
  tool: '🧰',
  micro: '🌦️',
  memory: '📝',
  system: '🗓️',
  golden: '✨',
  pet: '🐾',
  finance: '💰',
  care: '🤝',
  stress: '😮‍💨',
  milestone: '🎂',
  tinyCute: '💛',
  kidWisdom: '💡'
};

const OUTCOME_OUTLINE_BTN = "border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white";

// ===== Outcome Receipts (UI-only, safe, deterministic) =====
function clamp(n, min, max) {
  const x = Number.isFinite(n) ? n : 0;
  return Math.max(min, Math.min(max, x));
}

function comma(n) {
  const s = String(Math.round(Math.abs(Number(n) || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmtUSD(n) {
  const num = Number(n || 0);
  const sign = num < 0 ? "-" : "";
  return `${sign}$${comma(num)}`;
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFromKey(key) {
  return mulberry32(hashSeed(String(key)));
}

function pick(rng, arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(rng() * arr.length)] || "";
}

function pickNUnique(rng, arr, n) {
  const copy = (arr || []).filter(Boolean);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy.slice(0, Math.max(0, n));
}

function formatTpl(tpl, vars) {
  if (!tpl) return "";
  return tpl.replace(/\{(\w+)\}/g, (_, k) => {
    const v = vars && Object.prototype.hasOwnProperty.call(vars, k) ? vars[k] : "";
    return (v === null || v === undefined) ? "" : String(v);
  });
}

const RECEIPT_LABELS = [
  "RECEIPTS",
  "THE RECEIPTS",
  "NUMBERS",
  "AUDIT TRAIL",
  "PROOF",
  "STATS (UNFLATTERED)",
  "EVIDENCE",
  "CONFIRMED DATA"
];

const RECEIPTS_BANK = {
  letter: [
    "Love {love} • Stress {stress}",
    "Parent money: {moneyFmt}",
    "Retirement: {retirementFmt}",
    "Best stat: {bestStatName} {bestStatValue}",
    "Harm events: {harmCount}"
  ],
  careerWealth: [
    "Wealth tier: {wealthTier}",
    "Money: {moneyFmt}",
    "Debt: {debtFmt}",
    "Retirement: {retirementFmt} ({retirementTier})",
    "Career: {careerTitle}",
    "Stress tax: {stress}",
    "Big purchase vibe: {purchaseVibe}"
  ],
  relationships: [
    "Relationship status: {relationshipStatus}",
    "Love {love} • Stress {stress}",
    "Empathy: {emp}",
    "Confidence: {con}",
    "Longest peace streak: {peaceStreak} days",
    "Drama muted: {dramaMuted}%",
    "Texting energy: {textsPerWeek}/week"
  ],
  family: [
    "Children (reported): {numChildren}",
    "Household: {householdType}",
    "Love {love} • Stress {stress}",
    "Warmth index: {warmthIndex}/10",
    "Structure index: {structureIndex}/10",
    "Holiday survival odds: {holidayOdds}%"
  ],
  visits: [
    "Calls/year: {callsPerYear}",
    "Texts/week: {textsPerWeek}",
    "Visits vibe: {visitsVibe}",
    "Love {love} • Stress {stress}",
    "Boundaries: {boundariesMode}",
    "Distance: {distanceMode}"
  ],
  forgiveness: [
    "Repair speed: {forgivenessDays} business days",
    "Harm events: {harmCount}",
    "Apology style: {apologyStyle}",
    "Stress {stress} • Love {love}",
    "Grudge storage: {grudgeStorage}% full",
    "Peace treaty count: {peaceTreaties}"
  ],
  happiness: [
    "Inner weather: {innerWeather}",
    "Doomscroll: {doomscrollMins} mins/day",
    "Naps: {napsPerWeek}/week",
    "Stress {stress} • Love {love}",
    "Joy budget: {joyBudget}%",
    "Head space: {headSpace}"
  ],
  retirement: [
    "Retirement tier: {retirementTier}",
    "Retirement: {retirementFmt}",
    "Money: {moneyFmt}",
    "Plan: {retirePlan}",
    "Sleep quality: {sleepQuality}/10",
    "Future cushion: {cushionWord}"
  ],
  parentingStyle: [
    "Warmth index: {warmthIndex}/10",
    "Structure index: {structureIndex}/10",
    "Bedtime consistency: {bedtimeScore}/10",
    "Snack diplomacy: {snackScore}/10",
    "Stress {stress} • Love {love}"
  ],
  epilogue: [
    "Best stat: {bestStatName} {bestStatValue}",
    "Growth edge: {worstStatName} {worstStatValue}",
    "Love {love} • Stress {stress}",
    "Money {moneyFmt} • Retirement {retirementFmt}",
    "Overall vibe: {overallVibe}"
  ],
  howTheyGrew: [
    "INT {int} • EMP {emp} • DIS {dis} • CON {con}",
    "Best stat: {bestStatName} {bestStatValue}",
    "Worst stat: {worstStatName} {worstStatValue}",
    "Harm events: {harmCount}",
    "Techniques unlocked: {techCount}"
  ]
};

export default function Outcome() {
  // ISSUE C FIX: Hooks at top level, stable order
  const navigate = useNavigate();
  const location = useLocation();
  
  // Compute test mode BEFORE calling useGameState
  const isTestMode = new URLSearchParams(location.search).get('test') === '1';
  const [testPayload, setTestPayload] = React.useState(() => location.state?.testOutcomePayload || null);
  
  // ALL hooks must be called unconditionally
  const { 
    gameState: ctxGameState, 
    resetGame, 
    safeGenerateFinalOutcome, 
    updateState, 
    resetYearActions, 
    applyStartOfAgeResources, 
    captureYearCheckpoint, 
    enableAdultContinuation 
  } = useGameState();
  
  const [viewMode, setViewMode] = React.useState("story");
  const [showReceipts, setShowReceipts] = React.useState(false);
  const [sectionRerolls, setSectionRerolls] = React.useState({});
  const [shareToast, setShareToast] = React.useState("");
  const [openTrauma, setOpenTrauma] = React.useState(null);
  const [autoGenAttemptedAt, setAutoGenAttemptedAt] = React.useState(null);
  const [outcomeGenError, setOutcomeGenError] = React.useState(false);
  const [childChatOpen, setChildChatOpen] = React.useState(false);
  const [childChooserOpen, setChildChooserOpen] = React.useState(false);
  
  // Derived values (AFTER all hooks)
  const gameState = (isTestMode && testPayload?.gameState) ? testPayload.gameState : ctxGameState;
  const { childName, childAvatarGender, childAvatarToneIndex, currentYear, finalOutcome, stats, timelineEntries, counters, lastRunSummary, familyPatterns } = gameState;
  const debugOutcome = new URLSearchParams(location.search).get('debugOutcome') === '1';
  const showShareToast = (msg) => { setShareToast(msg); setTimeout(() => setShareToast(""), 1200); };

  // Auto-regenerate once if outcome is missing (avoid infinite loop)
  React.useEffect(() => {
    if (isTestMode) return;
    if (gameState.finalOutcome) return;
    if (autoGenAttemptedAt) return;

    setOutcomeGenError(false);
    setAutoGenAttemptedAt(Date.now());
    safeGenerateFinalOutcome();
  }, [isTestMode, gameState.finalOutcome, autoGenAttemptedAt, safeGenerateFinalOutcome]);

  React.useEffect(() => {
    if (!isTestMode) return;
    if (testPayload) return;
    setTestPayload(createOutcomeTestPayload(Date.now()));
  }, [isTestMode, testPayload]);

  // Reset rerolls when entering Outcome or run changes
  React.useEffect(() => {
    setSectionRerolls({});
  }, [isTestMode, gameState?.runSeed]);

  // Flip into error UI if generation doesn't resolve quickly
  React.useEffect(() => {
    // In test mode, if we have a payload but no outcome, it's an immediate error (generation is synchronous)
    if (isTestMode && testPayload && !testPayload.gameState?.finalOutcome) {
      setOutcomeGenError(true);
      return;
    }

    if (!isTestMode && !autoGenAttemptedAt) return;
    
    if (gameState.finalOutcome) {
      setOutcomeGenError(false);
      return;
    }
    const timeoutId = setTimeout(() => {
      setOutcomeGenError(true);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [isTestMode, autoGenAttemptedAt, gameState.finalOutcome, testPayload]);

  const avatarEmoji = getAvatarEmojiForAge(currentYear, childAvatarGender, childAvatarToneIndex);
  const spriteIndex = Number.isFinite(Number(gameState.childAvatarSpriteIndex))
    ? Number(gameState.childAvatarSpriteIndex)
    : (Number(gameState.childAvatarToneIndex || 0) % 4);
  const genderKey = (childAvatarGender === 'girl') ? 'female' : 'male';

  // Display outcome allows local rerolls without mutating saved finalOutcome
  const baseOutcome = finalOutcome;
  let displayOutcome = baseOutcome;
  if (baseOutcome && Object.keys(sectionRerolls).length > 0) {
    const merged = { ...baseOutcome, sections: { ...(baseOutcome.sections || {}) } };
    for (const key of Object.keys(sectionRerolls)) {
      let next = null;
      try {
        next = generateOutcomeV3({ ...gameState, outcomeRerolls: { [key]: sectionRerolls[key] }, finalOutcome: baseOutcome });
      } catch (e) {
        console.error("[Outcome] reroll generation failed", e);
        next = null;
      }
      if (next?.sections?.[key] !== undefined) {
        merged.sections[key] = next.sections[key];
      }
    }
    displayOutcome = merged;
  }

  // Handle v3-noai (structured), v3, v2, and v1 formats for display
  const isV3NoAI = displayOutcome?.version === "v3-noai";
  const isV3 = displayOutcome?.version === "v3";
  const isV2 = displayOutcome?.version === "v2";
  const isV4 = displayOutcome?.version === "v4";
  const sections = (isV4 || isV3NoAI || isV3 || isV2) ? displayOutcome?.sections : displayOutcome;
  const sharePack = React.useMemo(() => {
    try {
      return baseOutcome?.sharePack || null;
    } catch (e) {
      console.error("[sharePack] build failed", e);
      return null;
    }
  }, [baseOutcome]);
  const endingTitle = finalOutcome?.endingTitle || sharePack?.endingTitle || "Unknown Ending";
  const rarity = finalOutcome?.rarity || sharePack?.rarity || "Unclassified";
  const code = finalOutcome?.endingCode || sharePack?.code || "RT-????";
  // Derive best stat from current gameState stats (INT/EMP/DIS/CON)
  const statPairs = [
    { key: 'intelligence', label: 'INT', value: Number(stats?.intelligence || 0) },
    { key: 'empathy', label: 'EMP', value: Number(stats?.empathy || 0) },
    { key: 'discipline', label: 'DIS', value: Number(stats?.discipline || 0) },
    { key: 'confidence', label: 'CON', value: Number(stats?.confidence || 0) }
  ].sort((a, b) => b.value - a.value);
  const bestBuild = statPairs[0] || { label: 'INT', value: 0 };
  const buildLine = `Build: Best ${bestBuild.label} ${Math.round(bestBuild.value)}`;
  // Build Share Card Pack (UI-only) using receipts + first sentence of epilogue
  const sectionForOneLiner = sections?.epilogue || sections?.happiness || sections?.careerWealth || null;
  const paragraphText = typeof sectionForOneLiner === 'string' ? sectionForOneLiner : (sectionForOneLiner?.paragraph || sectionForOneLiner?.headline || '');
  const oneLiner = String(paragraphText).split(/[.!?]/)[0].trim() || endingTitle;
  const receiptPackForShare = getReceiptPack('epilogue') || getReceiptPack('careerWealth') || { lines: [] };
  const shareReceipts = (receiptPackForShare?.lines || []).slice(0, 3);
  const captionParagraph = String((sections?.epilogue && (typeof sections.epilogue === 'string' ? sections.epilogue : sections.epilogue.paragraph)) || (sections?.happiness && (typeof sections.happiness === 'string' ? sections.happiness : sections.happiness.paragraph)) || endingTitle || '').trim();
  const receiptsText = (shareReceipts || []).map(l => `• ${l}`).join('\n');
  const captionText = [captionParagraph, receiptsText].filter(Boolean).join('\n\n');
  const shareCardPack = { endingTitle, rarity, oneLiner, receipts: shareReceipts, code };

  // Story Arc Summary (UI-only, based on early love/stress, harm/repair, and ending title)
  const arcEarlyEntries = (timelineEntries || []).filter(e => Number(e.age) <= 4);
  const arcEarlyLoveScore = arcEarlyEntries.reduce((a, e) => a + (Number(e.loveDelta) || 0), 0);
  const arcEarlyStressScore = arcEarlyEntries.reduce((a, e) => a + (Number(e.stressDelta) || 0), 0);
  let arcOrigin = "They started mixed—some calm, some chaos.";
  if (arcEarlyLoveScore - arcEarlyStressScore >= 3) {
    arcOrigin = "They started steadier, held by warmth.";
  } else if (arcEarlyStressScore - arcEarlyLoveScore >= 3) {
    arcOrigin = "They started on hard mode, learning to breathe under pressure.";
  }

  const arcHarmCount = Number(counters?.harmCount || 0);
  const arcHadRepair = (timelineEntries || []).some(e => {
    const t = String(e?.title || '') + ' ' + String(e?.detail || '');
    return /repair|apolog|counsel|therapy|regulated/i.test(t);
  });
  let arcTurning = "Small adjustments added up to momentum.";
  if (arcHarmCount >= 2 && !arcHadRepair) arcTurning = "A breaking point forced distance and new boundaries.";
  else if (arcHarmCount >= 1 && arcHadRepair) arcTurning = "A rupture became practice for repair.";
  else if (arcHadRepair) arcTurning = "Repair showed up early and changed the tone.";

  const arcFinal = `They grew into “${endingTitle}”.`;

  const handleStartNewLife = () => {
    const ok = resetGame();
    if (!ok) return;
    navigate(createPageUrl('Start'));
  };
  


  const handleContinueToSeeGrow = () => {
    const newAge = gameState.currentYear + 1; // should be 19
    
    updateState({
      finished: false,
      bonusYearActive: true,
      deathEvent: null,
      currentYear: newAge,
      // IMPORTANT: allow currentYear=19 to persist through migrateRunLength
      endAge: Math.max(gameState.endAge, newAge),   // sets endAge=19 for this save
      yearFlags: {},
      // prevent scenario gating at age 19
      scenarioPending: false,
      pendingScenario: false,
      scenarioCompletedThisAge: true,
      currentScenario: null,
      currentScenarioHookId: null,
      currentScenarioResolvedChoice: null
    });

    // Start of age setup (no scenario load)
    setTimeout(() => {
      resetYearActions();
      applyStartOfAgeResources(newAge);
      captureYearCheckpoint({ age: newAge, kind: "yearStart", replaceExisting: true });
    }, 50);

    toast.success(`You continue into age ${newAge}…`, {
      duration: 3000,
      position: 'top-center'
    });

    navigate(createPageUrl('Game'));
  };

  const handleContinueParentingPast18 = () => {
    enableAdultContinuation();
    toast.success('Continuing into adulthood…');
    navigate(createPageUrl('Game'));
  };

  // Shared legacy param builder
  const buildLegacyParamsFromState = (state) => {
    // Robust fallbacks if lastRunSummary is missing
    const summary = state.lastRunSummary || {};
    const finalOutcome = state.finalOutcome || {};
    const ctx = finalOutcome.ctx || {};

    const parentName = summary.childName || state.childName || "Parent";
    const childGender = summary.childGender || state.childAvatarGender || "boy";
    const parentRole = childGender === "girl" ? "mom" : "dad";

    // Inheritance logic
    const currentMoney = Number(state.money || 0);
    const cash = Math.max(0, currentMoney);
    const debt = Math.max(0, -currentMoney);
    const retirementBuffer = Number(summary.outcome?.retirementBuffer ?? ctx.retirementBuffer ?? state.retirementSavings ?? 0);
    const net = cash - debt;
    const inheritance = Math.max(0, Math.round(net - retirementBuffer));

    // Household logic
    const relStatus = summary.outcome?.relationshipStatus || ctx.relationshipStatus || "Single";
    const householdType = (relStatus === "Married" || relStatus === "Long-term partner") ? "two" : "single";

    // Income Tier logic
    const wealthTier = summary.outcome?.wealthTier || ctx.wealthTier || "Stable";
    let incomeTier = "medium";
    if (wealthTier === "Wealthy" || inheritance >= 50000) {
      incomeTier = "high";
    } else if (wealthTier === "Comfortable" || inheritance >= 15000) {
      incomeTier = "medium";
    } else {
      incomeTier = "low";
    }

    return { parentName, parentRole, householdType, incomeTier, inheritance };
  };

  const handlePlayAsChild = () => {
    // No early return - always allow play
    const { parentName, parentRole, householdType, incomeTier, inheritance } = buildLegacyParamsFromState(gameState);
    
    // Store legacy payload for next run
    try {
      const legacy = {
        enabled: true,
        sourceRunId: gameState.runSeed || null,
        sourceChildName: gameState.childName || 'Child',
        childTraumaEvents: Array.isArray(gameState.childTraumaEvents) ? gameState.childTraumaEvents : [],
        childAttachment: gameState.childAttachment || null
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('rt_legacy', JSON.stringify(legacy));
      }
    } catch {}
    
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

    // Navigate to Start with legacy flag.
    navigate(createPageUrl('Start') + `?legacy=true&entry=playAsChild&parent=${encodeURIComponent(parentName)}&role=${parentRole}&household=${householdType}&income=${incomeTier}&money=${inheritance}`);
  };

  // Show generating message if outcome not ready (with failure fallback)
  if (!finalOutcome) {
    if (outcomeGenError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 text-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl text-slate-200 font-semibold">Outcome generation failed</p>
            <p className="text-sm text-slate-400 mt-2">
              {isTestMode ? "Test mode generation returned null." : "This usually happens when a template change introduced an error. You won’t be stuck here anymore."}
            </p>

            <div className="mt-5 flex flex-col gap-2 items-center">
              <Button
                className="h-10 w-56"
                onClick={() => {
                  setOutcomeGenError(false);
                  if (isTestMode) {
                    setTestPayload(createOutcomeTestPayload(Date.now()));
                  } else {
                    setAutoGenAttemptedAt(Date.now());
                    safeGenerateFinalOutcome();
                  }
                }}
              >
                {isTestMode ? "Regenerate Test" : "Try Again"}
              </Button>

              <Button
                variant="outline"
                className={cn("h-10 w-56", OUTCOME_OUTLINE_BTN)}
                onClick={() => navigate(createPageUrl('Start'))}
              >
                Back to Start
              </Button>

              <Button
                variant="outline"
                className={cn("h-10 w-56", OUTCOME_OUTLINE_BTN)}
                onClick={() => {
                  resetGame();
                  navigate(createPageUrl('Start'));
                }}
              >
                Reset Run
              </Button>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Tip: check browser console for the exact error stack trace.
            </p>
          </div>
        </div>
      );
    }

    // Normal generating UI
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-slate-300">Generating your outcome...</p>
          <p className="text-sm text-slate-500 mt-2">This may take a moment...</p>
        </div>
      </div>
    );
  }





  // Build deterministic UI-only receipts for each section
  function getReceiptPack(sectionKey) {
    try {
      const seedBase = `${gameState.runSeed || "seed"}|receipts|${sectionKey}|${childName || "Child"}`;
      const rng = rngFromKey(seedBase);

      const statsObj = gameState.stats || {};
      const int = Number(statsObj.intelligence || 0);
      const emp = Number(statsObj.empathy || 0);
      const dis = Number(statsObj.discipline || 0);
      const con = Number(statsObj.confidence || 0);

      const loveVal = Number(gameState.love || 0);
      const stressVal = Number(gameState.stress || 0);
      const moneyVal = Number(gameState.money || 0);
      const retirementVal = Number(gameState.retirementSavings || 0);
      const debtVal = Math.max(0, -moneyVal);

      const wealthTier =
        finalOutcome?.ctx?.wealthTier ||
        (moneyVal >= 50000 ? "Wealthy" : moneyVal >= 10000 ? "Comfortable" : moneyVal >= 0 ? "Stable" : "Precarious");

      const retirementTier =
        finalOutcome?.ctx?.retirementTier ||
        (retirementVal >= 50000 ? "Secure" : retirementVal >= 20000 ? "Comfortable" : retirementVal >= 8000 ? "Modest" : retirementVal >= 2000 ? "BareBones" : "Precarious");

      const relationshipStatus = finalOutcome?.ctx?.relationshipStatus || "Single";
      const numChildren = Number(finalOutcome?.ctx?.numChildren ?? 0);

      const harmCount = Number(gameState?.counters?.harmCount || 0);

      const techCount = Object.values(gameState.techniquesUnlocked || {}).filter(Boolean).length;

      const statList = [
        { name: "Intelligence", value: int },
        { name: "Empathy", value: emp },
        { name: "Discipline", value: dis },
        { name: "Confidence", value: con }
      ].sort((a,b) => b.value - a.value);

      const bestStatName = statList[0]?.name || "Unknown";
      const bestStatValue = Number(statList[0]?.value || 0).toFixed(1);
      const worstStatName = statList[statList.length - 1]?.name || "Unknown";
      const worstStatValue = Number(statList[statList.length - 1]?.value || 0).toFixed(1);

      const callsPerYear = clamp(Math.round((loveVal * 6) + (emp * 1.5) + (rng() * 60 - 15)), 0, 365);
      const textsPerWeek = clamp(Math.round((loveVal * 2) + (emp * 0.6) + (rng() * 24 - 6)), 0, 250);

      const forgivenessDaysBase =
        harmCount === 0 ? clamp(Math.round(1 + rng()*14), 1, 21) :
        harmCount === 1 ? clamp(Math.round(14 + rng()*90), 14, 180) :
        clamp(Math.round(60 + rng()*600), 60, 999);

      const doomscrollMins = clamp(Math.round((stressVal * 10) + (rng()*40 - 10)), 5, 240);
      const napsPerWeek = clamp(Math.round((stressVal / 10) * 7 + (rng()*4 - 1)), 0, 14);

      const warmthIndex = clamp(Math.round(((Number(gameState.warmthPoints || 0) / Math.max(1, (gameState.timelineEntries || []).filter(e => e.kind === "major").length)) + 2) * 2.5), 0, 10);
      const structureIndex = clamp(Math.round(((Number(gameState.structurePoints || 0) / Math.max(1, (gameState.timelineEntries || []).filter(e => e.kind === "major").length)) + 2) * 2.5), 0, 10);

      const purchaseVibe = pick(rng, ["responsible", "impulsive", "weirdly practical", "emotionally motivated", "surprisingly wholesome"]);
      const peaceStreak = clamp(Math.round(10 + rng()* (stressVal <= 4 ? 400 : 120)), 10, 500);
      const dramaMuted = clamp(Math.round(20 + rng()*70), 10, 95);
      const visitsVibe = pick(rng, ["consistent", "seasonal", "chaotic-good", "random but heartfelt", "mostly digital"]);
      const boundariesMode = pick(rng, ["soft", "firm", "legendary", "in beta", "weaponized (politely)"]);
      const distanceMode = pick(rng, ["nearby", "different city", "different state", "different country", "mysteriously always traveling"]);
      const apologyStyle = pick(rng, ["short + sincere", "long + detailed", "awkward but real", "text message then follow-up", "apology + snack peace offering"]);
      const grudgeStorage = clamp(Math.round(rng()*100), 0, 100);
      const peaceTreaties = clamp(Math.round(1 + rng()*12), 1, 20);
      const innerWeather = pick(rng, ["sunny-ish", "cloudy but stable", "stormy then calm", "chaotic-neutral", "surprisingly peaceful"]);
      const joyBudget = clamp(Math.round(10 + rng()*80), 5, 95);
      const headSpace = pick(rng, ["quiet", "busy", "overbooked", "calm", "a little loud but manageable"]);
      const retirePlan = pick(rng, ["early-ish", "on time", "late but proud", "never (emotionally retired first)", "surprise retirement arc"]);
      const sleepQuality = clamp(Math.round(3 + rng()*7), 1, 10);
      const cushionWord = pick(rng, ["thin", "decent", "plush", "legendary", "questionable"]);

      const overallVibe = pick(rng, ["wholesome", "messy-growth", "chaotic", "surprisingly stable", "hard mode but funny"]);

      const vars = {
        childName,
        love: loveVal,
        stress: stressVal,
        moneyFmt: fmtUSD(moneyVal),
        debtFmt: fmtUSD(debtVal),
        retirementFmt: fmtUSD(retirementVal),
        wealthTier,
        retirementTier,
        relationshipStatus,
        numChildren,
        householdType: gameState.householdType || "single",
        int: int.toFixed(1),
        emp: emp.toFixed(1),
        dis: dis.toFixed(1),
        con: con.toFixed(1),
        harmCount,
        techCount,
        bestStatName,
        bestStatValue,
        worstStatName,
        worstStatValue,
        callsPerYear,
        textsPerWeek,
        forgivenessDays: forgivenessDaysBase,
        doomscrollMins,
        napsPerWeek,
        warmthIndex,
        structureIndex,
        bedtimeScore: clamp(Math.round(2 + rng()*8), 0, 10),
        snackScore: clamp(Math.round(2 + rng()*8), 0, 10),
        purchaseVibe,
        peaceStreak,
        dramaMuted,
        visitsVibe,
        boundariesMode,
        distanceMode,
        apologyStyle,
        grudgeStorage,
        peaceTreaties,
        innerWeather,
        joyBudget,
        headSpace,
        retirePlan,
        sleepQuality,
        cushionWord,
        holidayOdds: clamp(Math.round(30 + rng()*65), 10, 98),
        overallVibe,
        careerTitle: finalOutcome?.careerTitle || "Unknown"
      };

      const label = pick(rng, RECEIPT_LABELS) || "RECEIPTS";
      const tpls = RECEIPTS_BANK[sectionKey] || [];
      const lines = pickNUnique(rng, tpls, 3).map(t => formatTpl(t, vars)).filter(Boolean);

      return { label, lines };
    } catch (e) {
      console.error("[Receipts] failed for section:", sectionKey, e);
      return null;
    }
  }
  const debugMeta = sections?.__debug || null;

  // Helpers to filter out repeated global meta bullets (safe)
  function normalizeBulletText(b) {
    if (typeof b === 'string') return b.replace(/\s+/g, ' ').trim();
    if (typeof b === 'number') return String(b);
    return '';
  }
  function isGlobalMetaBullet(b) {
    const s = normalizeBulletText(b);
    if (!s) return false;
    const lower = s.toLowerCase();
    const hasSep = /[•·]/.test(s);
    const isBuild = lower.startsWith('build:') && lower.includes('growth edge') && hasSep;
    const isLove = lower.startsWith('love') && lower.includes('stress') && lower.includes('harm') && hasSep;
    const isMoney = lower.startsWith('money') && lower.includes('retirement') && hasSep && /[$\d]/.test(s);
    return isBuild || isLove || isMoney;
  }

  // Render helper for structured sections (v3-noai)
  const renderSection = (sectionKey, icon, iconColor, title) => {
    const section = sections?.[sectionKey];
    
    // Fallback for old versions or missing sections
    if (!section) {
      console.warn(`[Outcome] Missing section: ${sectionKey}`);
      return null;
    }

    if (typeof section === 'string') {
      const receiptPack = showReceipts ? getReceiptPack(sectionKey) : null;
      return (
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-slate-200">{title}</h3>
              <button
                className="ml-2 px-2 py-0.5 border border-white/20 rounded text-[10px] text-slate-200 hover:bg-white/10"
                onClick={() => setSectionRerolls(prev => ({ ...prev, [sectionKey]: (prev[sectionKey] || 0) + 1 }))}
              >
                Reroll
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{section}</p>
            {showReceipts && receiptPack?.lines?.length ? (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-[10px] tracking-wider font-semibold text-slate-400 mb-2">
                  {receiptPack.label}
                </div>
                <div className="space-y-1 font-mono text-xs text-slate-300">
                  {receiptPack.lines.map((l, i) => (
                    <div key={i}>• {l}</div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    
    // SKIP EMPTY SECTIONS
    // If structured object but basically empty
    if (typeof section === 'object') {
      const hasHeadline = !!(section.headline || title);
      const hasPara = !!(section.paragraph && section.paragraph.trim());
      const hasBullets = Array.isArray(section.bullets) && section.bullets.length > 0;
      const hasTiny = !!(section.tinyTruth && section.tinyTruth.trim());
      
      // If it has NO content (no paragraph, no bullets, no tinyTruth), skip it.
      // We ignore headline presence because a headline alone isn't worth a card.
      if (!hasPara && !hasBullets && !hasTiny) {
        return null;
      }
    } else if (typeof section === 'string') {
      if (!section.trim()) return null;
    }

    // Render structured section (v3-noai)
    return (
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-lg text-slate-200">{section.headline || title}</h3>
            <button
              className="ml-2 px-2 py-0.5 border border-white/20 rounded text-[10px] text-slate-200 hover:bg-white/10"
              onClick={() => setSectionRerolls(prev => ({ ...prev, [sectionKey]: (prev[sectionKey] || 0) + 1 }))}
            >
              Reroll
            </button>
          </div>
          {(() => {
            const rawBullets = Array.isArray(section?.bullets) ? section.bullets : [];
            const filteredBullets = rawBullets.filter(b => !isGlobalMetaBullet(b));
            const bulletsToRender = (filteredBullets.length === 0 && rawBullets.length > 0 && !section.paragraph && !section.tinyTruth) ? rawBullets : filteredBullets;
            if (bulletsToRender.length === 0) return null;
            return (
              <div className="space-y-1.5 mb-3">
                {bulletsToRender.map((bullet, idx) => {
                  const txt = (typeof bullet === 'string' || typeof bullet === 'number') ? String(bullet) : '';
                  if (!txt.trim()) return null;
                  return (
                    <div key={idx} className="text-sm text-slate-300 italic pl-3 border-l-2 border-white/20">
                      {txt}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          {section.paragraph && (
            <p className="text-slate-300 leading-relaxed mb-2 whitespace-pre-line">{section.paragraph}</p>
          )}
          {section.tinyTruth && (
            <p className="text-xs text-slate-400 italic mt-2">{section.tinyTruth}</p>
          )}
          {(() => {
            const receiptPack = showReceipts ? getReceiptPack(sectionKey) : null;
            return (showReceipts && receiptPack?.lines?.length) ? (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-[10px] tracking-wider font-semibold text-slate-400 mb-2">
                  {receiptPack.label}
                </div>
                <div className="space-y-1 font-mono text-xs text-slate-300">
                  {receiptPack.lines.map((l, i) => (
                    <div key={i}>• {l}</div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    );
  };
  
  // Extract family patterns data
  const selectedPatternIds = familyPatterns?.selectedIds || [];
  const severityById = familyPatterns?.severityById || {};
  const resolvedById = familyPatterns?.resolvedById || {};
  const resolvedAtAgeById = familyPatterns?.resolvedAtAgeById || {};
  const childPatterns = finalOutcome?.childPatterns || [];
  const childTraumaEvents = finalOutcome?.childTraumaEvents || gameState.childTraumaEvents || [];

  // Epilogue echo (1-2 lines max if patterns were selected)
  const hasPatterns = selectedPatternIds.length > 0;
  const epilogueEcho = hasPatterns ? getEpilogueEcho(gameState.runSeed + '_epilogue') : null;
  
  const parentPatterns = selectedPatternIds.map(id => {
    const catalog = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
    return {
      id,
      label: catalog?.label || id,
      severity: severityById[id] || 0,
      resolved: resolvedById[id] || false,
      resolvedAtAge: resolvedAtAgeById[id]
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 pb-24 text-white">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <PlayerSpriteAvatar
                ageNumber={currentYear}
                index={spriteIndex}
                genderKey={genderKey}
                size={72}
                fallbackEmoji={avatarEmoji}
                className="rounded-2xl"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Years Later…</h1>
          <p className="text-slate-400 text-lg">{childName} • Age {currentYear}</p>
          {finalOutcome?.topBadge && (
            <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl px-4 py-2 inline-block">
              <p className="text-amber-300 font-bold text-sm">{finalOutcome.topBadge}</p>
            </div>
          )}
          {finalOutcome?.careerTitle && (
            <p className="text-slate-300 text-base mt-3">
              Career: <span className="font-semibold">{finalOutcome.careerTitle}</span>
            </p>
          )}
          {!finalOutcome?.careerTitle && (
            <p className="text-slate-400 text-base mt-3">Career: (unknown)</p>
          )}

          <div className="mt-4 flex justify-center gap-2">
            <Button
               variant="outline"
               className={cn("h-9", OUTCOME_OUTLINE_BTN)}
               onClick={() => setShowReceipts(v => !v)}
             >
              {showReceipts ? "Hide Receipts" : "Show Receipts"}
            </Button>
            {Object.keys(sectionRerolls).length > 0 && (
              <Button variant="outline" className={cn("h-9", OUTCOME_OUTLINE_BTN)} onClick={() => setSectionRerolls({})}>
                Reset Rerolls
              </Button>
            )}
          </div>

          {isV2 && finalOutcome?.patternLine && (
            <p className="text-amber-300/80 text-sm mt-3 italic">{finalOutcome.patternLine}</p>
          )}
        </motion.div>

        {/* Global Outcome Stats (single render) */}
        <OutcomeStatsSummary gameState={gameState} stats={stats} />

        {/* Story Arc Summary */}
        <div className="mb-4 border border-white/10 rounded-xl p-4 bg-white/5">
          <div className="text-sm text-slate-300 space-y-1">
            <p>- Origin: {arcOrigin}</p>
            <p>- Turning point: {arcTurning}</p>
            <p>- Final form: {arcFinal}</p>
          </div>
        </div>

        {isTestMode && testPayload && (
          <div className="space-y-2 mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-emerald-300">🧪 Outcome Test Mode</div>
              <div className="text-xs text-slate-400">seed: {String(testPayload.seed)}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300">
              <div>Love: {testPayload.metrics.love}</div>
              <div>Stress: {testPayload.metrics.stress}</div>
              <div>Money: ${String(testPayload.metrics.money).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div>Retirement: ${String(testPayload.metrics.retirementSavings).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div>Harm: {testPayload.metrics.harmCount}</div>
              <div>Stats: INT {testPayload.metrics.stats.intelligence}, EMP {testPayload.metrics.stats.empathy}, DIS {testPayload.metrics.stats.discipline}, CON {testPayload.metrics.stats.confidence}</div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className={cn("h-9", OUTCOME_OUTLINE_BTN)} onClick={() => setTestPayload(createOutcomeTestPayload(Date.now()))}>
                Generate Another
              </Button>
              <Button variant="outline" className={cn("h-9", OUTCOME_OUTLINE_BTN)} onClick={() => navigate(createPageUrl('Start'))}>
                Back to Start
              </Button>
            </div>
          </div>
        )}

        {/* Special Endings Explorer (Test Mode Only) */}
        {isTestMode && (
          <div className="mt-6">
            <SpecialEndingsExplorer
              onLoadEnding={(endingId) => {
                setTestPayload(createOutcomeTestPayload({ seed: Date.now(), forcedEndingId: endingId }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToRandom={() => {
                setTestPayload(createOutcomeTestPayload(Date.now()));
              }}
            />
          </div>
        )}

        {sharePack && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className={OUTCOME_OUTLINE_BTN}
                onClick={async () => { try { if (oneLiner) { await navigator.clipboard?.writeText(oneLiner); showShareToast('Copied!'); } } catch { showShareToast('Copy failed'); } }}
              >
                Copy one-liner
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={OUTCOME_OUTLINE_BTN}
                onClick={async () => { try { if (captionText) { await navigator.clipboard?.writeText(captionText); showShareToast('Copied!'); } } catch { showShareToast('Copy failed'); } }}
              >
                Copy caption
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={OUTCOME_OUTLINE_BTN}
                onClick={async () => { try { if (!code) return; await navigator.clipboard?.writeText(code); showShareToast('Copied!'); } catch { showShareToast('Copy failed'); } }}
              >
                Copy code
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={OUTCOME_OUTLINE_BTN}
                onClick={async () => { try { if (!captionText) return; if (navigator?.share) { await navigator.share({ text: captionText }); showShareToast('Shared'); } else { showShareToast('Share not supported'); } } catch { showShareToast('Share failed'); } }}
              >
                Web Share
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {shareToast && <span className="text-xs text-emerald-300">{shareToast}</span>}
              <button className="px-3 py-1.5 border border-white/20 rounded-md text-sm text-slate-200 hover:bg-white/10" onClick={() => setViewMode(v => v === 'story' ? 'share' : 'story')}>
                {viewMode === 'story' ? 'Share Card' : 'Back to Story'}
              </button>
            </div>
          </div>
        )}
        {viewMode === 'share' && (
          <div className="mb-6">
            <OutcomeShareCard sharePack={shareCardPack} />
          </div>
        )}
        {/* SINGLE-RENDER SECTIONS (No Duplicates) */}
        {viewMode !== 'share' && (
        <div className="space-y-4 mb-6">
          {/* Ending Header */}
          {(
            <div className="border border-white/10 rounded-xl p-4 mb-4">
              <div className="text-2xl font-bold">{endingTitle}</div>
              <div className="mt-2 flex gap-2 items-center">
                <span className="px-3 py-1 text-xs font-semibold border border-white/20 rounded-full">{rarity}</span>
                <span className="ml-auto font-mono text-xs opacity-70">{code}</span>
              </div>
            </div>
          )}
          {/* Letter */}
          <motion.div 
            className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-rose-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {renderSection('letter', '💌', 'bg-rose-500/20', 'A Letter From Your Adult Child')}
          </motion.div>

          {/* Headliner - What stuck with them */}
          <motion.div 
            className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.105 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-amber-300 mb-3">What stuck with them</h3>
                <div className="space-y-3">
                  {(() => {
                    try {
                      const headliners = getOutcomeHeadliners(gameState);
                      return headliners.map((line, idx) => (
                        <p key={idx} className="text-slate-200 leading-relaxed text-sm">
                          {line}
                        </p>
                      ));
                    } catch (error) {
                      console.error('[Headliner] Error:', error);
                      return (
                        <p className="text-slate-300 leading-relaxed text-sm">
                          Time passed. Patterns stuck.
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* What Your Household Carried */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <h3 className="font-semibold text-xl text-purple-300 mb-4">🧬 What Your Household Carried</h3>
            
            {/* You */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-purple-200 mb-2">You</h4>
              {selectedPatternIds.length === 0 ? (
                <p className="text-slate-400 text-xs">None selected in this run.</p>
              ) : (
                <div className="space-y-2">
                  {parentPatterns.map(pattern => (
                    <div key={pattern.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="flex-shrink-0 text-lg">
                        {pattern.resolved ? '✅' : '🔄'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-200 mb-0.5">{pattern.label}</div>
                        <div className="text-xs text-slate-400">
                          {pattern.resolved 
                            ? `Resolved${pattern.resolvedAtAge ? ` at Age ${pattern.resolvedAtAge}` : ''}`
                            : 'Still healing'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Partner (if partnered) */}
            {gameState.householdType === 'two' && familyPatterns?.selectedIds && (
              <div>
                <h4 className="text-sm font-semibold text-purple-200 mb-2">{gameState.partnerName || 'Partner'}</h4>
                {(() => {
                  const partnerPatterns = gameState.partnerPatterns;
                  if (!partnerPatterns || !partnerPatterns.selectedIds || partnerPatterns.selectedIds.length === 0) {
                    return <p className="text-slate-400 text-xs">No patterns generated.</p>;
                  }
                  
                  const partnerData = partnerPatterns.selectedIds.map(id => {
                    const catalog = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
                    return {
                      id,
                      label: catalog?.label || id,
                      severity: partnerPatterns.severityById?.[id] || 0,
                      resolved: partnerPatterns.resolvedById?.[id] || false,
                      resolvedAtAge: partnerPatterns.resolvedAtAgeById?.[id]
                    };
                  });
                  
                  return (
                    <div className="space-y-2">
                      {partnerData.map(pattern => (
                        <div key={pattern.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="flex-shrink-0 text-lg">
                            {pattern.resolved ? '✅' : '🔄'}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-slate-200 mb-0.5">{pattern.label}</div>
                            <div className="text-xs text-slate-400">
                              {pattern.resolved 
                                ? `Resolved${pattern.resolvedAtAge ? ` at Age ${pattern.resolvedAtAge}` : ''}`
                                : 'Still healing'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>

          {/* What Your Child May Carry */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <h3 className="font-semibold text-xl text-indigo-300 mb-4">🧒 What Your Child May Carry</h3>
            {childPatterns.length === 0 ? (
              <p className="text-slate-300 text-sm leading-relaxed">
                This run looks buffered: no major family patterns flagged.
              </p>
            ) : (
              <div className="space-y-3">
                {childPatterns.map(id => {
                  const catalog = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
                  return (
                    <div key={id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="font-medium text-slate-200 mb-1">{catalog?.label || id}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        {catalog?.childRipple || "A pattern that may need attention."}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* New Traumas Acquired During Gameplay */}
          <motion.div 
            className="bg-gradient-to-br from-rose-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-6 border border-rose-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17 }}
          >
            <h3 className="font-semibold text-xl text-rose-200 mb-2">🩹 Wounds & Worries</h3>
            
            {gameState.childAttachment && (
              <div className="mb-4 bg-white/5 border border-white/10 p-3 rounded-lg">
                  <div className="font-semibold text-slate-200">{gameState.childAttachment.style} — <span className="font-normal text-slate-300">{gameState.childAttachment.explanationLine}</span></div>
                  <p className="text-xs text-slate-400 mt-1">
                    Derived from home climate + moments that stuck. Not a diagnosis.
                  </p>
              </div>
            )}

            <p className="text-xs text-slate-300 mb-1">
              These came from events and choices during the run (separate from inherited family patterns).
            </p>
            <p className="text-[11px] text-slate-400 mb-4">Tap a wound to explain it.</p>

            {!childTraumaEvents || childTraumaEvents.length === 0 ? (
              <p className="text-slate-300 text-sm leading-relaxed">
                No major event scars were tracked in this life.
              </p>
            ) : (
              <div className="space-y-3">
                {childTraumaEvents.map(t => {
                  const sev = Number(t.severity || 1);
                  const dots = "●".repeat(sev) + "○".repeat(3-sev);
                  const firstAge = t.firstAge !== undefined ? t.firstAge : t.age;
                  const lastAge = t.lastAge !== undefined ? t.lastAge : firstAge;
                  const ageText = firstAge === lastAge ? `(age ${firstAge})` : `(ages ${firstAge}–${lastAge})`;
                  return (
                    <button
                      type="button"
                      key={t.id || t.typeId}
                      onClick={() => setOpenTrauma(t)}
                      className="w-full p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 text-left text-xs transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-semibold text-slate-200">{t.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{dots}</div>
                      </div>
                      {t.description && (
                        <div className="text-slate-300 mt-1">{t.description}</div>
                      )}
                      {t.because && (
                         <div className="text-slate-400 mt-2"><span className="font-semibold">Because:</span> {t.because}</div>
                      )}
                       {t.whatHelps && (
                         <div className="text-slate-400 mt-1"><span className="font-semibold">What helps:</span> {t.whatHelps}</div>
                      )}
                      <div className="text-[10px] text-slate-500 mt-2">
                        {ageText}{t.count > 1 ? ` • ${t.count} times` : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          <ChildTraumaDetailsModal
            open={!!openTrauma}
            trauma={openTrauma}
            childName={childName}
            onClose={() => setOpenTrauma(null)}
          />

          {/* Career & Wealth */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {renderSection('careerWealth', <Briefcase className="w-5 h-5 text-blue-400" />, 'bg-blue-500/20', 'Career & Wealth')}
          </motion.div>

          {/* Relationships */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            {renderSection('relationships', <Heart className="w-5 h-5 text-rose-400" />, 'bg-rose-500/20', 'Relationships')}
          </motion.div>

          {/* Family */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {renderSection('family', <Home className="w-5 h-5 text-amber-400" />, 'bg-amber-500/20', 'Family')}
          </motion.div>

          {/* Visits */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            {renderSection('visits', <Users className="w-5 h-5 text-pink-400" />, 'bg-pink-500/20', 'Visits')}
          </motion.div>

          {/* Forgiveness & Repair */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38 }}
          >
            <div className="mb-2 text-xs text-slate-400 italic">
              Forgiveness isn't owed. It's personal—and sometimes it stays complicated.
            </div>
            {renderSection('forgiveness', <span className="text-xl">🤝</span>, 'bg-teal-500/20', 'Forgiveness & Repair')}
          </motion.div>

          {/* Happiness */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {renderSection('happiness', <Smile className="w-5 h-5 text-violet-400" />, 'bg-violet-500/20', 'Happiness')}
          </motion.div>

          {/* Retirement */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            {renderSection('retirement', <span className="text-2xl">🏦</span>, 'bg-emerald-500/20', 'Retirement')}
          </motion.div>

          {/* Parenting Style */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {renderSection('parentingStyle', <span className="text-2xl">🎭</span>, 'bg-purple-500/20', 'Parenting Style')}
          </motion.div>

          {/* Epilogue */}
          <motion.div 
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {renderSection('epilogue', <Sparkles className="w-5 h-5 text-amber-400" />, 'bg-amber-500/20', 'Epilogue')}

          {sections?.successionTwist && renderSection(
            'successionTwist',
            <span className="text-2xl">🎂</span>,
            'bg-red-500/20',
            '18th Birthday: The Assassination'
          )}

{sections?.successionTwist && renderSection(
  'successionTwist',
  <span className="text-2xl">🎂</span>,
  'bg-red-500/20',
  '18th Birthday: The Assassination'
)}

            {(() => {
              try {
                const flips = (gameState?.relationships?.byId?.child?.flags?.trampolineFlipsForever === true);
                if (!flips) return null;
                const lines = [
                  'They never outgrew the trampoline park. Flips stayed in their life—backflips, double backflips, all of it. Years later, they’re teaching their grandkids the same fearless tuck-and-commit that started on those springy mats.',
                  'That trampoline park became a lifelong thread. They kept flipping, kept flying, and eventually became the kind of grown-up who teaches their grandkids to trust their body and go for it.',
                  'What started as nervous little bounces turned into a lifetime love of movement. They kept doing flips for fun, for confidence, for joy—and one day they taught their grandkids the same tricks with the same bright grin.'
                ];
                const idx = Math.abs(String(gameState?.runSeed || 'seed').length + Number(gameState?.currentYear || 0)) % lines.length;
                return (
                  <div className="mt-3">
                    <p className="text-slate-200 leading-relaxed">{lines[idx]}</p>
                  </div>
                );
              } catch { return null; }
            })()}

            {epilogueEcho && (
              <div className="mt-4 pt-4 border-t border-amber-300/30">
                <p className="text-sm text-amber-700 italic leading-relaxed">
                  {epilogueEcho}
                </p>
              </div>
            )}
          </motion.div>

          {/* How They Grew */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {renderSection('howTheyGrew', <TrendingUp className="w-5 h-5 text-emerald-400" />, 'bg-emerald-500/20', 'How They Grew')}
          </motion.div>

          {/* Their Room, Their Clues */}
          {gameState.room?.items && gameState.room.items.length > 0 && (
            <motion.div 
              className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-5 border border-violet-400/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏠</span>
                <h3 className="font-semibold text-xl text-violet-300">Their Room, Their Clues</h3>
              </div>
              <div className="space-y-2 mb-4">
                {gameState.room.items.slice(-5).reverse().map(item => (
                  <div key={item.id} className="text-sm text-slate-300">
                    <span className="mr-2">{item.emoji}</span>
                    {item.name} <span className="text-slate-500 text-xs">(added at age {item.purchasedAtAge})</span>
                  </div>
                ))}
              </div>
              {(() => {
                const seeds = gameState.room.seeds || {};
                const topThemes = Object.entries(seeds)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                  .join(', ');

                if (topThemes) {
                  return (
                    <p className="text-sm text-violet-200 italic">
                      Themes that shaped them: {topThemes}
                    </p>
                  );
                }
              })()}
            </motion.div>
          )}
          </div>
          )}

          {/* Final Snapshot */}
        <motion.div 
          className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/20 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold text-xl text-indigo-300">Final Snapshot</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Intelligence</span>
              <span className="text-base font-semibold text-slate-200">
                {Math.round(stats.intelligence)} <span className="text-xs text-slate-500">({getStatLabel('intelligence', stats.intelligence, currentYear).label})</span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Empathy</span>
              <span className="text-base font-semibold text-slate-200">
                {Math.round(stats.empathy)} <span className="text-xs text-slate-500">({getStatLabel('empathy', stats.empathy, currentYear).label})</span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Discipline</span>
              <span className="text-base font-semibold text-slate-200">
                {Math.round(stats.discipline)} <span className="text-xs text-slate-500">({getStatLabel('discipline', stats.discipline, currentYear).label})</span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Confidence</span>
              <span className="text-base font-semibold text-slate-200">
                {Math.round(stats.confidence)} <span className="text-xs text-slate-500">({getStatLabel('confidence', stats.confidence, currentYear).label})</span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Love</span>
              <span className="text-base font-semibold text-slate-200">
                {Math.round(gameState.love)} <span className="text-xs text-slate-500">({loveTier(gameState.love)})</span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Stress</span>
              <span className="text-base font-semibold text-slate-200">
                {Math.round(gameState.stress)} <span className="text-xs text-slate-500">({describeStat('stress', gameState.stress).label})</span>
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Money</span>
              <span className="text-base font-semibold text-slate-200">
                ${Math.floor(gameState.money).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-slate-400">Retirement</span>
              <span className="text-base font-semibold text-slate-200">
                ${Math.floor(gameState.retirementSavings).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {isTestMode ? (
            <>
              <Button 
                onClick={() => setTestPayload(createOutcomeTestPayload(Date.now()))}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl"
              >
                Generate Another Test Ending
              </Button>
              <Button 
                onClick={() => navigate(createPageUrl('Start'))}
                variant="outline"
                className={cn("w-full h-14 text-lg font-semibold", OUTCOME_OUTLINE_BTN)}
              >
                Back to Start
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleStartNewLife}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 rounded-xl"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Start a New Life
              </Button>

              <Button
                onClick={handleContinueParentingPast18}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/20 rounded-xl"
                variant="secondary"
              >
                <Baby className="w-5 h-5 mr-2" />
                Continue Parenting Past 18 (Adult Years)
              </Button>

              <Button
                onClick={handleContinueToSeeGrow}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Continue to See {childName} Grow
              </Button>

              <Button
                onClick={() => {
                  const hasMultipleKids = gameState.expansions?.siblingRivalry === true && Array.isArray(gameState.kids) && gameState.kids.length > 1;
                  if (hasMultipleKids) {
                    setChildChooserOpen(true);
                  } else {
                    updateState(prev => ({ ui: { ...(prev.ui || {}), childChat: { ...(prev.ui?.childChat || {}), isOpen: true } } }));
                    setChildChatOpen(true);
                  }
                }}
                variant="outline"
                className={cn("w-full h-14 text-lg font-semibold", OUTCOME_OUTLINE_BTN)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to your child
              </Button>

              <div>
                {(() => {
                  const isApocalypse = gameState.specialStartId === 'zombie_apocalypse' || gameState.specialStartId === 'alien_invasion';
                  const campaign = gameState.apocalypseCampaign || {};
                  const victoryAchieved = campaign.victory?.achieved === true;
                  
                  if (isApocalypse && victoryAchieved) {
                    return (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-center">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="text-sm font-semibold text-emerald-300 mb-1">World Saved — This Storyline Ends Here</div>
                        <div className="text-xs text-slate-400">You won. Start a new run for a new story.</div>
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      <Button 
                        onClick={handlePlayAsChild}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/20 rounded-xl"
                      >
                        <span className="mr-2">🧬</span>
                        Play As {childName} (changes destiny)
                      </Button>
                      <p className="text-xs text-slate-400 text-center mt-2">
                        {isApocalypse && !victoryAchieved
                          ? `The ${campaign.scenarioId === 'zombie_apocalypse' ? 'zombie apocalypse' : 'alien invasion'} continues. Try to save the world in the next generation.`
                          : 'Starts a new run with your child\'s gender fixed. Outcomes and inheritance will reshape the starting conditions.'}
                      </p>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </motion.div>

        {/* Timeline (LAST, EXPANDED BY DEFAULT) */}
        {timelineEntries && timelineEntries.length > 0 && (
          <motion.div 
            className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-xl text-amber-300">Timeline</h3>
            </div>
            <div className="space-y-4">
              {(() => {
                // Group by age
                const groupedByAge = {};
                timelineEntries.forEach(entry => {
                  if (!groupedByAge[entry.age]) {
                    groupedByAge[entry.age] = [];
                  }
                  groupedByAge[entry.age].push(entry);
                });
                const ages = Object.keys(groupedByAge).sort((a, b) => a - b);
                
                return ages.map(age => (
                  <div key={age}>
                    <div className="text-xs font-bold text-amber-400 mb-2">Age {age}</div>
                    <div className="space-y-2 pl-3">
                      {groupedByAge[age].map(entry => (
                        <div key={entry.id} className="flex gap-2 text-sm">
                          <span className="flex-shrink-0">{kindIcons[entry.kind] || '•'}</span>
                          <div className="flex-1">
                            <div className="text-slate-200">{entry.title}</div>
                            {entry.detail && (
                              <div className="text-xs text-slate-400 mt-0.5">{entry.detail}</div>
                            )}
                            {entry.effectsLine && (
                              <div className="text-xs text-slate-500 italic mt-1">{entry.effectsLine}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}

        {/* Debug Panel (only shows with ?debugOutcome=1) */}
        {debugOutcome && debugMeta && (
          <motion.div 
            className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <details>
              <summary className="cursor-pointer text-sm text-slate-300 hover:text-white transition-colors">
                🔍 Debug: Outcome tags & variation picks
              </summary>
              <div className="mt-3 space-y-3">
                <div className="text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Tags ({(debugMeta.tags || []).length}):</span>
                  <div className="mt-1 text-slate-400 whitespace-normal break-words">
                    {(debugMeta.tags || []).join(", ")}
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Picked Variations:</span>
                  <pre className="mt-1 text-xs text-slate-400 bg-black/30 rounded-lg p-3 overflow-auto">
{JSON.stringify(debugMeta.picks || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </motion.div>
        )}

        {/* MVP Notice */}
        <motion.p 
          className="text-center text-xs text-slate-500 mt-8 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          Alpha playthrough runs from age 0 to age {gameState.endAge}. You'll see the ending when you press Age Up at 18.
        </motion.p>
      </div>

      {/* Child Chooser Dialog */}
      <Dialog open={childChooserOpen} onOpenChange={setChildChooserOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Which child do you want to talk to?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {(gameState.kids || []).map(kid => (
              <button
                key={kid.id}
                onClick={() => {
                  updateState(prev => setActiveKidReducer(prev, kid.id));
                  setChildChooserOpen(false);
                  updateState(prev => ({ ui: { ...(prev.ui || {}), childChat: { ...(prev.ui?.childChat || {}), isOpen: true } } }));
                  setChildChatOpen(true);
                }}
                className="w-full p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left"
              >
                <div className="font-medium text-slate-800">{kid.childSlice?.childName || 'Child'}</div>
                <div className="text-xs text-slate-500">Age {currentYear || 0}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ChildChatModal
        open={childChatOpen}
        onClose={() => {
          setChildChatOpen(false);
          updateState(prev => ({ ui: { ...(prev.ui || {}), childChat: { ...(prev.ui?.childChat || {}), isOpen: false } } }));
        }}
        extraContext={(() => {
          const ctx = displayOutcome?.ctx || {};
          const lines = [
            `Ending: ${endingTitle} (${rarity})`,
            `Career: ${finalOutcome?.careerTitle || 'Unknown'}`,
            `Wealth: ${ctx.wealthTier || 'Unknown'}`,
            `Relationship: ${ctx.relationshipStatus || 'Unknown'}`,
            `Money: $${Math.floor(gameState.money || 0).toLocaleString()}`,
            `Retirement: $${Math.floor(gameState.retirementSavings || 0).toLocaleString()}`,
            `Emergency Fund: $${Math.floor(gameState.emergencyFund || 0).toLocaleString()}`,
          ];
          
          if (ctx.numChildren) lines.push(`Children: ${ctx.numChildren}`);
          
          if (childPatterns.length > 0) {
            const labels = childPatterns.map(id => {
              const c = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
              return c?.label || id;
            }).join(', ');
            lines.push(`Child patterns: ${labels}`);
          }
          
          if (childTraumaEvents.length > 0) {
            const summary = childTraumaEvents.map(t => `${t.label} (●${t.severity || 1})`).join(', ');
            lines.push(`Wounds: ${summary}`);
          }
          
          return lines.join('\n');
        })()}
        contextMode="outcome"
      />
    </div>
  );
}