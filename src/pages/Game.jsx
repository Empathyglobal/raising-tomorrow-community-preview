import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTutorial } from '@/components/tutorial/TutorialContext';
import YearRecapModal from '@/components/game/YearRecapModal';
import { RARE_MOMENTS } from '@/components/content/rareMoments';
import { evaluateRareMomentUnlocks } from '@/components/game/rareMomentEngine';
import BugReportModal from '@/components/bug/BugReportModal';
import { createPageUrl } from '@/utils';
import { childNameify } from '../components/game/childNameifyUtil';
import { useGameState, hasAnyChild, getDisplayedChildAge, createSeededRng } from "@/components/game/GameStateContext";
import { pickAutoChoiceByParentingStyle } from '@/components/game/scenarioAutoChoose';
import { audioManager } from '../components/game/AudioManager';
import { getHousingById, getCommuteById, DEFAULT_LIVING_SETUP } from '@/components/game/livingConfig';
import AdultLifeModal from '@/components/game/adultLife/AdultLifeModal';
import AdultLifePopupModal from '@/components/game/AdultLifePopupModal';
import { KID_WISDOM_LINES } from '../components/game/kidWisdomLines';
import GameShell from '@/components/game/GameShell';
import HomeTab from '@/components/game/tabs/HomeTab';
import ActionsTab from '@/components/game/tabs/ActionsTab';
import StoryTab from '@/components/game/tabs/StoryTab';
import RelationshipsTab from '@/components/game/tabs/RelationshipsTab';
import ProfileTab from '@/components/game/tabs/ProfileTab';
import ScenarioModal from '@/components/game/ScenarioModal';
import HomeworkPopupModal from '@/components/game/HomeworkPopupModal';
import ActionModal from '@/components/game/ActionModal';
import SettingsModal from '@/components/game/SettingsModal';
import LifeHubModal from '@/components/game/LifeHubModal';
import FullTimelineModal from '@/components/game/FullTimelineModal';
import PetFarewellModal from '@/components/game/PetFarewellModal';
import InterestDiscoveryModal from '@/components/game/InterestDiscoveryModal';
import PetFarewellScenarioModal from '@/components/game/PetFarewellScenarioModal';
import PrimaryInterestModal from '@/components/game/PrimaryInterestModal';
import PubertyPassionModal from '@/components/game/PubertyPassionModal';
import ScienceFairModal from '@/components/game/ScienceFairModal';
import ActionResultSheet from '@/components/game/ActionResultSheet';
import BriefcaseChainModal from '@/components/game/BriefcaseChainModal';
import RandomDateInviteModal from '@/components/game/RandomDateInviteModal';
import { maybeTraumaFromScenario, maybeTraumaFromClimate, deriveChildAttachment, computeChildTraumaYearlyDrift, maybeTraumaFromPartnerSpill, maybeTraumaFromSingleParentLoad, getChildTraumaCatalogEntry } from '../components/game/childTraumaSystem';
import { TEEN_COMING_OUT_SCENARIO_ID, applyTeenComingOutChoice } from '@/components/game/teenComingOutScenario';
import { ensurePrisonState } from '@/components/game/prisonSystem';
import { isTeenOneOffScenario, applyTeenOneOffChoice } from '@/components/game/teenOneOffsPack';
import { isMiddleSchoolOneOffScenario, applyMiddleSchoolOneOffChoice } from '@/components/game/middleSchoolOneOffsPack';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { finalizePartnerSeparation } from '@/components/game/relationshipUtils';
import ReflectiveMomentModal from '@/components/game/ReflectiveMomentModal';
import { getReflectiveMoment } from '@/components/game/familyPatternsNarrative';
import ScenarioPackYearlyCheckinsModal from '@/components/game/ScenarioPackYearlyCheckinsModal';
import KidLogicPopupModal from '@/components/game/KidLogicPopupModal';
import MovieEasterEggPopupModal from '@/components/game/MovieEasterEggPopupModal';
import ChildTraumaPopupModal from '@/components/game/ChildTraumaPopupModal';
import ChaosModeModal from '@/components/game/ChaosModeModal';
import BaliCalmPopupModal from '@/components/game/BaliCalmPopupModal';
import BaliActivityPopupModal from '@/components/game/BaliActivityPopupModal';
import InheritanceModal from '@/components/game/InheritanceModal';
import { maybeTriggerInheritanceEvent } from '@/components/game/inheritanceSystem';
import RoyalTabloidModal from '@/components/game/RoyalTabloidModal';
import { getJJSystemEventText } from '@/components/game/jjSystemMessageBank';
import FamilyBackgroundModal from '@/components/game/FamilyBackgroundModal';
import CuriosityPackModal from '@/components/game/CuriosityPackModal';
import MilestonesInfoModal from '@/components/game/MilestonesInfoModal';
import GoldenMomentModal from '@/components/game/GoldenMomentModal';
import YearHighlightsModal from '@/components/game/YearHighlightsModal';
import CollectionsModal from '@/components/game/CollectionsModal';
import { CHALLENGE_BY_ID } from '@/components/game/challenges/challengeCatalog';
import { getChallengeProgress } from '@/components/game/challenges/challengeEngine';
import { getEligibleCheckinsForAge } from '@/components/game/packYearlyCheckins';
import { simulateAnnualRealEstateTick } from "@/components/game/realEstateData";
import { runRelationshipsAnnualTick } from '@/components/game/relationshipsAnnualTick';
import ChapterBeatModal from '@/components/game/ChapterBeatModal';
import StuffedAnimalModal from '@/components/game/StuffedAnimalModal';
import SchoolClubInviteModal from '@/components/game/SchoolClubInviteModal';
import SchoolExtracurricularModal from '@/components/game/SchoolExtracurricularModal';
import OutdoorAdventuresModal from '@/components/game/OutdoorAdventuresModal';
import { DEATH_SCENARIOS } from '@/components/game/DeathScenarios';
import GoalSetupModal from '@/components/game/GoalSetupModal';
import PetsModal from '@/components/game/PetsModal';
import PetEventModal from '@/components/game/PetEventModal';
import PTAHubModal from '@/components/game/pta/PTAHubModal';
import TitlesHubModal from '@/components/game/titles/TitlesHubModal';
import BirthIntroModal from '@/components/game/BirthIntroModal';
import LifeGoalsSetupModal from '@/components/game/LifeGoalsSetupModal';
import LifeGoalMomentModal from '@/components/game/LifeGoalMomentModal';
import { getAvatarEmojiForAge } from '@/components/game/avatars';
import { pickMilestoneQuests } from '@/components/content/milestonesPack';
import { canPassLocalCoopTurn } from '@/components/game/localCoop';
import { MOVIE_EASTER_EGG_EVENTS } from "@/components/game/movieEasterEggPopups";
import { useConfirm } from '@/components/game/ConfirmProvider';
import { processAdultCrimeYearEnd } from '@/components/game/adultCrimeEngine';
import { track } from "@/components/lib/rtAnalytics";
import BudgetSnapMiniGame from '@/components/game/minigames/BudgetSnapMiniGame';
import SiblingRivalryPopupModal from '@/components/game/siblingRivalry/SiblingRivalryPopupModal';
import EmergencyModal from '@/components/game/EmergencyModal';
import { shouldRollEmergency, rollEmergency } from '@/components/game/emergencySystem';
import NaturalDisasterModal from '@/components/game/NaturalDisasterModal';
import { shouldRollNaturalDisaster, rollNaturalDisaster } from '@/components/game/naturalDisasterSystem';
import GuidanceModal from '@/components/game/GuidanceModal';
import { computeYearlyCheckinData } from '@/components/game/guidanceHelpers';
import FaithDecisionModal from '@/components/game/FaithDecisionModal';
import PrisonVisitModal from '@/components/game/PrisonVisitModal';
import PrisonHubModal from '@/components/game/PrisonHubModal';
import LocalCoopTurnModal from '@/components/game/LocalCoopTurnModal';


export default function Game() {
  // Safe wrapper: do not crash if processAdultCrimeYearEnd is missing
  const applyAdultCrimeYearEnd = (s) => (typeof processAdultCrimeYearEnd === "function" ? processAdultCrimeYearEnd(s) : s);
  const prevPendingScenarioRef = React.useRef(null);
  const ageUpLockRef = React.useRef(false);
  const scenarioLoadInFlightRef = React.useRef(false);
  const processingChoiceRef = React.useRef(false);
  const scenarioResolvingRef = React.useRef(false);
  const scenarioRecoveryRef = React.useRef({ age: null, attempts: 0 });
  const latestStateRef = React.useRef(null);
  const { 
    gameState, 
    applyDeltas,
    applyLove,
    applyStress,
    spendMoney,
    spendFocus,
    switchLocalCoopTurn,
    loveDeltaFromChoice,
    stressDeltaFromChoice,
    addLog, 
    addHistory, 
    incrementCounter, 
    updateState,
    safeGenerateFinalOutcome,
    getActiveChoice,
    runMicroEventForAge,
    determineMemoryTone,
    generateMemoryText,
    recordTimelineEntry,
    recordChildTraumaEvent,
    resolveChildTraumaPopup,
    resolveMissedMilestone,
    pickTinyCuteForAge,
    shouldShowTinyCute,
    getKidWisdomBand,
    shouldShowKidWisdom,
    pickUniqueKidWisdom,
    tryGoldenMoment,
    recordFunMomentToLifeLog,
    markTinyCuteShownThisAge,
    markKidWisdomShownThisAge,
    applyTeacherTrust,
    applyPeerCircle,
    addMicroMoments,
    loadScenarioForAge,
    processPetYearEnd,
    resetYearActions,
    applyStartOfAgeResources,
    runSchoolMilestone,
    dismissActionResult,
    emitActionResult,
    captureRewindSnapshot,
    captureYearCheckpoint,
    maybeQueueKidLogicPopup,
    resolveKidLogicPopup,
    maybeQueueHomeworkPopup,
    resolveHomeworkPopup,
    maybeQueueChaosPopup,
    resolveChaosPopup,
    processChildTraumaYearStartTick,
    maybeQueueLifeGoalMoment,
    resolveGoalMoment,
    processPlayerHealthYearEndTick,
    maybeQueueFaithPopup,
    resolveFaithPopup,
    processFaithExposureDecay,
    // Bali
    processBaliYearStart,
    maybeQueueBaliPopups,
    resolveBaliCalmPopup,
    resolveBaliActivityPopup,
    applyMoneyDelta,
    processSocialMediaYearEnd,
    // Curiosity
    resolveCuriosityChoice,
    closeCuriosityModal,
    getWisdomTier,
    isLensEquipped,
    maybeQueueSiblingRivalryPopups,
    resolveSiblingRivalryPopup,
    // Cost of Living
    grantInitialYear0CashIfNeeded,
    applyLivingCostsForAge,
    // Adult Life (child-free mode)
    tickBabyPressureForNewYear,
    maybeQueueAdultLifeMomentPopup,
    resolveAdultLifeMomentPopup,
    
    // Adult Child Continuation (post-18)
    maybeQueueAdultChildPopup,
    resolveAdultChildPopup,
    processCareerYearEndTick,
    processTitlesYearEndTick,
    processUrnCryptoYearEndTick,
    } = useGameState();
  
  const { scenarioPending, scenarioCompletedThisAge, currentScenario, currentYear, endAge, lastMilestoneText, actionResultPending } = gameState;
  const confirm = useConfirm();
  
  const hasChild = hasAnyChild(gameState);

  // Prison state computation
  const prison = ensurePrisonState(gameState.prison);
  const inPrison = prison.active === true;

  // Prison Hub UI button visibility
  const showPrisonButton = inPrison && (gameState.prison?.yearsRemaining ?? 0) > 0;

  // Year-end prompts returned by annual systems (e.g., relationship drama).
  // Uses the existing ConfirmProvider (PG-13, consequence-driven; no "stealth" rewards).
  const runAnnualPrompts = async (promptList) => {
    const list = Array.isArray(promptList) ? promptList : [];
    if (!list.length) return;

    const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
    const deepMerge = (base, patch) => {
      if (!isPlainObject(patch)) return patch;
      const out = isPlainObject(base) ? { ...base } : {};
      for (const [k, v] of Object.entries(patch)) {
        if (isPlainObject(v) && isPlainObject(out[k])) out[k] = deepMerge(out[k], v);
        else out[k] = v;
      }
      return out;
    };
    const clamp0to100 = (n) => Math.max(0, Math.min(100, Number(n || 0)));

    for (const p of list) {
      if (!p || typeof p !== 'object') continue;

      const ok = await confirm({
        title: p.title || 'Decision',
        description: p.description || '',
        confirmText: p.confirmText || 'OK',
        cancelText: p.cancelText || 'Cancel',
        destructive: Boolean(p.destructive),
      });

      const outcome = ok ? (p.onConfirm || {}) : (p.onCancel || {});

      // Logs / timeline
      (Array.isArray(outcome.logs) ? outcome.logs : []).filter(Boolean).forEach((line) => addLog(String(line)));
      (Array.isArray(outcome.timelineEntries) ? outcome.timelineEntries : []).filter(Boolean).forEach((entry) => recordTimelineEntry(entry));

      // Scalar deltas
      if (Number.isFinite(Number(outcome.stressDelta)) && Number(outcome.stressDelta) !== 0) {
        applyStress(Number(outcome.stressDelta), `Relationship: ${p.title || 'Annual event'}`);
      }
      if (Number.isFinite(Number(outcome.loveDelta)) && Number(outcome.loveDelta) !== 0) {
        applyLove(Number(outcome.loveDelta), `Relationship: ${p.title || 'Annual event'}`);
      }
      if (Number.isFinite(Number(outcome.moneyDelta)) && Number(outcome.moneyDelta) !== 0) {
        applyMoneyDelta(Number(outcome.moneyDelta), p.title || 'Annual event');
      }

      // Focus cost (optional)
      if (Number.isFinite(Number(outcome.focusCost)) && Number(outcome.focusCost) > 0) {
        spendFocus(Number(outcome.focusCost), p.title || 'Annual event');
      }

      // State patches + partner meter delta
      const hasPartnerDelta = Number.isFinite(Number(outcome.partnerMeterDelta)) && Number(outcome.partnerMeterDelta) !== 0;
      const hasDramaPatch = isPlainObject(outcome.relationshipDramaPatch);
      const hasSexPatch = isPlainObject(outcome.sexualHealthPatch);
      const hasPartnerRelPatch = isPlainObject(outcome.partnerRelationshipPatch);

      if (hasPartnerDelta || hasDramaPatch || hasSexPatch || hasPartnerRelPatch) {
        updateState((prev) => {
          const next = { ...prev };

          if (hasPartnerDelta) {
            const rel = prev.relationships || { roster: [], byId: {} };
            const byId = { ...(rel.byId || {}) };
            const roster = Array.isArray(rel.roster) ? [...rel.roster] : [];
            const current = Number.isFinite(Number(prev.partnerMeter)) ? Number(prev.partnerMeter) : (Number(byId?.partner?.meter) || 50);
            const nextMeter = clamp0to100(current + Number(outcome.partnerMeterDelta));

            if (byId.partner) byId.partner = { ...byId.partner, meter: nextMeter };
            const idx = roster.findIndex((x) => x.id === 'partner');
            if (idx >= 0) roster[idx] = { ...roster[idx], meter: nextMeter };

            next.partnerMeter = nextMeter;
            next.relationships = { ...rel, byId, roster };
          }

          if (hasPartnerRelPatch) next.partnerRelationship = deepMerge(prev.partnerRelationship || {}, outcome.partnerRelationshipPatch);
          if (hasDramaPatch) next.relationshipDrama = deepMerge(prev.relationshipDrama || {}, outcome.relationshipDramaPatch);
          if (hasSexPatch) next.sexualHealth = deepMerge(prev.sexualHealth || {}, outcome.sexualHealthPatch);

          return next;
        });
      }
    }
  };

  const location = useLocation();

  // Check if we're on Popups page (don't render popups here if so)
  const onPopupsPage = location.pathname.toLowerCase() === createPageUrl('Popups').toLowerCase();

  const [activeTab, setActiveTab] = useState('home');

  // Deep-link tab from URL (?tab=relationships, etc.)
  useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    const tab = (params.get('tab') || '').toLowerCase();

    if (!tab) return;

    if (tab === 'home') setActiveTab('home');
    else if (tab === 'actions') setActiveTab('actions');
    else if (tab === 'relationships') setActiveTab('relationships');
    else if (tab === 'profile') setActiveTab('profile');
    else if (tab === 'story') setActiveTab('story');
  }, [location.search]);

  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalType, setActionModalType] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [lifeHubModalOpen, setLifeHubModalOpen] = useState(false);
  const [fullTimelineOpen, setFullTimelineOpen] = useState(false);
  const [processingChoice, setProcessingChoice] = useState(false);
  const [petFarewellOpen, setPetFarewellOpen] = useState(false);
  const [petFarewellScenarioOpen, setPetFarewellScenarioOpen] = useState(false);
  const [interestDiscoveryOpen, setInterestDiscoveryOpen] = useState(false);
  const [primaryInterestOpen, setPrimaryInterestOpen] = useState(false);
  const [pubertyPassionOpen, setPubertyPassionOpen] = useState(false);
  const [scienceFairOpen, setScienceFairOpen] = useState(false);
  const [briefcaseChainOpen, setBriefcaseChainOpen] = useState(false);
  const [dateInviteOpen, setDateInviteOpen] = useState(false);
  const [reflectiveMomentOpen, setReflectiveMomentOpen] = useState(false);
  const [kidLogicPopupOpen, setKidLogicPopupOpen] = useState(false);
  const [reflectiveMomentContent, setReflectiveMomentContent] = useState(null);
  const [packCheckinsOpen, setPackCheckinsOpen] = useState(false);
  const [packCheckinPackIds, setPackCheckinPackIds] = useState([]);
  const [chapterBeatOpen, setChapterBeatOpen] = useState(false);
  const [chapterBeatContent, setChapterBeatContent] = useState(null);
  const [moviePopupOpen, setMoviePopupOpen] = useState(false);
  const [childTraumaPopupOpen, setChildTraumaPopupOpen] = useState(false);
  const modalBlockRef = React.useRef(false);
  const [kidLogicProcessing, setKidLogicProcessing] = useState(false);
  const [stuffedAnimalOpen, setStuffedAnimalOpen] = useState(false);
  const [clubInviteOpen, setClubInviteOpen] = useState(false);
  const [schoolEventOpenId, setSchoolEventOpenId] = useState(null);
  const [goalSetupOpen, setGoalSetupOpen] = useState(false);
  const [outdoorAdventuresOpen, setOutdoorAdventuresOpen] = useState(false);
  const [petsModalOpen, setPetsModalOpen] = useState(false);
  const [ptaModalOpen, setPtaModalOpen] = useState(false);
  const [titlesHubOpen, setTitlesHubOpen] = useState(false);
  const [homeworkPopupOpen, setHomeworkPopupOpen] = useState(false);
  const [actionsTabCategory, setActionsTabCategory] = useState(null);
  const [birthIntroOpen, setBirthIntroOpen] = useState(false);
  const [chaosPopupOpen, setChaosPopupOpen] = useState(false);
  const [curiosityOpen, setCuriosityOpen] = useState(false);
  const [familyBackgroundOpen, setFamilyBackgroundOpen] = useState(false);
  const [baliCalmOpen, setBaliCalmOpen] = useState(false);
  const [baliActivityOpen, setBaliActivityOpen] = useState(false);
  const [inheritanceOpen, setInheritanceOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [yearRecapOpen, setYearRecapOpen] = useState(false);
  const [yearRecapData, setYearRecapData] = useState(null);
  const [budgetSnapOpen, setBudgetSnapOpen] = useState(false);
  const budgetSnapResolvedRef = useRef(false);
  const budgetSnapContextRef = useRef('manual'); // 'ageUp' | 'manual'
  const [siblingRivalryPopupOpen, setSiblingRivalryPopupOpen] = useState(false);
  const [isAgingUp, setIsAgingUp] = useState(false);
  const [agingUpTargetYear, setAgingUpTargetYear] = useState(null);
  const [zombieIntroOpen, setZombieIntroOpen] = useState(false);
  const [goalMomentOpen, setGoalMomentOpen] = useState(false);
  const [goldenMomentOpen, setGoldenMomentOpen] = useState(false);
  const [yearHighlightsOpen, setYearHighlightsOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [naturalDisasterOpen, setNaturalDisasterOpen] = useState(false);
  const [faithDecisionOpen, setFaithDecisionOpen] = useState(false);
  const [prisonVisitOpen, setPrisonVisitOpen] = useState(false);
  const [prisonHubOpen, setPrisonHubOpen] = useState(false);
  const [adultLifeModalOpen, setAdultLifeModalOpen] = useState(false);
  const [adultLifePopupOpen, setAdultLifePopupOpen] = useState(false);
  
  // Guidance system
  const [guidanceStepId, setGuidanceStepId] = useState(null);
  const [guidanceYearlyData, setGuidanceYearlyData] = useState(null);
  const guidanceShownRef = useRef({});

  // Tutorial events
  const { emit, startTour, active, tourId, completed } = useTutorial();
  useEffect(() => { if (scenarioModalOpen) emit('scenarioOpened'); }, [scenarioModalOpen, emit]);
  useEffect(() => { if (!!actionResultPending) emit('actionResultOpened'); }, [actionResultPending, emit]);
  
  // Auto-start FTUE tour when ftueTourId is set
  const ftueStartedRef = useRef(false);
  useEffect(() => {
    if (gameState.ftueTourId && !active && !ftueStartedRef.current) {
      startTour(gameState.ftueTourId, { force: true });
      ftueStartedRef.current = true;
    }
  }, [gameState.ftueTourId, active, startTour]);
  
  // Finalize FTUE flags when tour completes
  useEffect(() => {
    if (gameState.ftueTourId && completed[gameState.ftueTourId] && !gameState.ftueCoreComplete) {
      updateState({
        ftueCoreComplete: true,
        ftueTourId: null
      });
    }
  }, [gameState.ftueTourId, completed, gameState.ftueCoreComplete, updateState]);

  // Derived UI flags (MUST be declared before any usage)
  const kidLogicPopupPending = Boolean(gameState.kidLogicPopupPending);
  const homeworkPopupPending = Boolean(gameState.homeworkPopupPending);
  const petEventPending = Boolean(gameState.petEventPending);
  const goalMomentPending = Boolean(gameState.goalMomentPending);
  const clubInvite = gameState.education?.schoolClubs?.pendingInvite;
  const royalTabloidPending = Boolean(gameState.royalPopupPending);
  const emergencyPending = Boolean(gameState.emergency?.pending);
  const naturalDisasterPending = Boolean(gameState.naturalDisaster?.pending);
  const faithPopupPending = Boolean(gameState.faithPopupPending);
  const prisonVisitPending = inPrison && Boolean(gameState.prison?.visitPendingThisAge);

  // === MODAL SAFETY SYSTEM: Derive active payloads (NEVER render modal without data) ===
  // IMPORTANT: must be declared BEFORE anyModalOpenBase / visibleModalId to avoid TDZ ReferenceError.
  const activeTrauma = Array.isArray(gameState.childTraumaPopupQueue)
    ? gameState.childTraumaPopupQueue[0]
    : null;

  const activeMissedMilestone = gameState.milestoneMissedPending || (
    Array.isArray(gameState.missedMilestoneQueue) ? gameState.missedMilestoneQueue[0] : null
  );

  const activeScenario = gameState.scenarioPending && gameState.currentScenario ? gameState.currentScenario : null;
  const activeEmergency = gameState.emergency?.pending || null;
  const activeNaturalDisaster = gameState.naturalDisaster?.pending || null;
  
  // Kid logic popup is visible ONLY if pending AND no higher priority modals are open
  const kidLogicPopupVisible =
    kidLogicPopupPending &&
    !royalTabloidPending &&
    !emergencyPending &&
    !gameState.birthIntroPending && // Birth intro priority
    !gameState.lifeGoals?.setupPending && // Life Goals priority
    !gameState.lifeGoals?.uiOpen &&
    !gameState.chaosPopupPending && // Chaos higher priority
    !homeworkPopupPending && // Homework higher priority
    !petEventPending && 
    !scenarioModalOpen &&
    !reflectiveMomentOpen &&
    !packCheckinsOpen &&
    !chapterBeatOpen &&
    !moviePopupOpen &&
    !petFarewellScenarioOpen &&
    !interestDiscoveryOpen &&
    !primaryInterestOpen &&
    !pubertyPassionOpen &&
    !dateInviteOpen &&
    !scienceFairOpen &&
    !briefcaseChainOpen &&
    !settingsModalOpen &&
    !lifeHubModalOpen &&
    !fullTimelineOpen &&
    !actionModalOpen &&
    !actionResultPending &&
    !stuffedAnimalOpen &&
    !clubInviteOpen &&
    !goalSetupOpen &&
    !schoolEventOpenId &&
    !petsModalOpen &&
    !faithDecisionOpen;
  
  // anyModalOpen represents ACTUALLY VISIBLE modals (not just pending)
  const [localCoopTurnOpen, setLocalCoopTurnOpen] = useState(false);
  const [localCoopTurnToSide, setLocalCoopTurnToSide] = useState('partner');
  
  const anyModalOpenBase = 
    scenarioModalOpen ||
    actionModalOpen ||
    settingsModalOpen ||
    lifeHubModalOpen ||
    fullTimelineOpen ||
    localCoopTurnOpen ||
    petFarewellOpen ||
    petFarewellScenarioOpen ||
    interestDiscoveryOpen ||
    primaryInterestOpen ||
    pubertyPassionOpen ||
    scienceFairOpen ||
    briefcaseChainOpen ||
    dateInviteOpen ||
    reflectiveMomentOpen ||
    kidLogicPopupOpen ||
    packCheckinsOpen ||
    chapterBeatOpen ||
    moviePopupOpen ||
    chaosPopupOpen ||
    curiosityOpen ||
    familyBackgroundOpen ||
    baliCalmOpen ||
    baliActivityOpen ||
    inheritanceOpen ||
    (gameState.milestones?.ui?.infoOpen) ||
    siblingRivalryPopupOpen ||
    stuffedAnimalOpen ||
    homeworkPopupOpen ||
    faithDecisionOpen ||
    collectionsOpen ||
    goldenMomentOpen ||
    yearHighlightsOpen ||
    yearRecapOpen ||
    budgetSnapOpen ||
    ptaModalOpen ||
    titlesHubOpen ||
    bugOpen ||
    (!!guidanceStepId && !onPopupsPage) ||
    petEventPending ||
    birthIntroOpen ||
    (gameState.lifeGoals?.setupPending || gameState.lifeGoals?.uiOpen) ||
    !!actionResultPending ||
    clubInviteOpen ||
    goalSetupOpen ||
    outdoorAdventuresOpen ||
    petsModalOpen ||
    !!schoolEventOpenId ||
    emergencyOpen ||
    goalMomentOpen ||
    prisonVisitOpen ||
    adultLifePopupOpen ||
    adultLifeModalOpen ||
    prisonHubOpen;
  const royalTabloidOpen = royalTabloidPending && !anyModalOpenBase;
  const anyModalOpen = anyModalOpenBase || royalTabloidOpen;

  // ======================================================
  // SINGLE VISIBLE MODAL FAILSAFE
  // Even if multiple modals accidentally become "open" at once,
  // only ONE is allowed to render open/visible.
  //
  // KEEP THIS ORDER IN SYNC WITH THE MODAL RENDER ORDER BELOW.
  // "Last open in this list wins" (topmost).
  // ======================================================
  const visibleModalId = (() => {
    let top = null;

    // NOTE: We include derived "open" booleans exactly as used in render below.
    const ordered = [
      ['scenario', scenarioModalOpen],
      ['actionModal', actionModalOpen],
      ['settings', settingsModalOpen],
      ['bug', bugOpen],
      ['lifeHub', lifeHubModalOpen],
      ['fullTimeline', fullTimelineOpen],
      ['petFarewellScenario', petFarewellScenarioOpen],
      ['interestDiscovery', interestDiscoveryOpen],
      ['primaryInterest', primaryInterestOpen],
      ['pubertyPassion', pubertyPassionOpen],
      ['scienceFair', scienceFairOpen],
      ['actionResult', !!actionResultPending],
      ['royalTabloid', royalTabloidOpen],
      ['briefcaseChain', briefcaseChainOpen],
      ['dateInvite', dateInviteOpen],
      ['packCheckins', packCheckinsOpen],
      ['reflectiveMoment', reflectiveMomentOpen],
      ['chapterBeat', chapterBeatOpen],
      ['kidLogic', kidLogicPopupOpen],
      ['moviePopup', moviePopupOpen],
      ['chaos', chaosPopupOpen],
      ['baliCalm', baliCalmOpen],
      ['baliActivity', baliActivityOpen],
      ['inheritance', inheritanceOpen],
      ['curiosity', curiosityOpen],
      ['milestonesInfo', Boolean(gameState.milestones?.ui?.infoOpen)],
      ['familyBackground', familyBackgroundOpen],
      ['budgetSnap', budgetSnapOpen],
      ['yearRecap', yearRecapOpen],
      ['homework', homeworkPopupOpen],
      ['childTrauma', Boolean(childTraumaPopupOpen && activeTrauma)],
      ['stuffedAnimal', stuffedAnimalOpen],
      ['clubInvite', clubInviteOpen],
      ['schoolEvent', !!schoolEventOpenId],
      ['goalSetup', goalSetupOpen],
      ['outdoorAdventures', outdoorAdventuresOpen],
      ['pets', petsModalOpen],
      ['pta', ptaModalOpen],
      ['petEvent', petEventPending],
      ['titlesHub', titlesHubOpen],
      ['siblingRivalry', siblingRivalryPopupOpen],
      ['goldenMoment', goldenMomentOpen],
      ['yearHighlights', yearHighlightsOpen],
      ['collections', collectionsOpen],
      ['emergency', Boolean(emergencyOpen && activeEmergency)],
      ['naturalDisaster', Boolean(naturalDisasterOpen && activeNaturalDisaster)],
      ['faithDecision', faithDecisionOpen],
      ['prisonVisit', prisonVisitOpen],
      ['prisonHub', prisonHubOpen],
      ['adultLife', adultLifeModalOpen],
      ['goalMoment', goalMomentOpen],
      ['lifeGoalsSetup', Boolean(gameState.lifeGoals?.setupPending || gameState.lifeGoals?.uiOpen)],
      ['birthIntro', birthIntroOpen],
      ['zombieIntro', zombieIntroOpen],
      ['guidance', Boolean(!!guidanceStepId && !onPopupsPage)]
    ];

    for (const [id, isOpen] of ordered) {
      if (isOpen) top = id;
    }
    return top;
  })();

  const showModal = (id) => visibleModalId === id;

  // Show emergency modal when pending
  useEffect(() => {
    if (emergencyPending && !emergencyOpen && !anyModalOpenBase) {
      setEmergencyOpen(true);
    }
  }, [emergencyPending, emergencyOpen, anyModalOpenBase]);

  // Show natural disaster modal when pending (keeps Emergency higher priority)
  useEffect(() => {
    if (naturalDisasterPending && !naturalDisasterOpen && !anyModalOpenBase && !emergencyPending) {
      setNaturalDisasterOpen(true);
    }
  }, [naturalDisasterPending, naturalDisasterOpen, anyModalOpenBase, emergencyPending]);
  
  // Show faith decision modal when pending
  useEffect(() => {
    if (faithPopupPending && !faithDecisionOpen && !anyModalOpenBase) {
      setFaithDecisionOpen(true);
    }
  }, [faithPopupPending, faithDecisionOpen, anyModalOpenBase]);

  // Show year highlights modal after age-up completes (only if enabled)
  useEffect(() => {
    const enabled = gameState.settings?.showYearHighlights ?? false;
    if (enabled && gameState.yearHighlightsPending && !yearHighlightsOpen && !anyModalOpenBase) {
      setYearHighlightsOpen(true);
    }
  }, [gameState.yearHighlightsPending, yearHighlightsOpen, anyModalOpenBase, gameState.settings?.showYearHighlights]);

  // Clear stale year highlights when feature is disabled
  useEffect(() => {
    const enabled = gameState.settings?.showYearHighlights ?? false;
    if (!enabled && (gameState.yearHighlightsPending || yearHighlightsOpen)) {
      setYearHighlightsOpen(false);
      updateState({ yearHighlightsPending: null });
    }
  }, [gameState.settings?.showYearHighlights, gameState.yearHighlightsPending, yearHighlightsOpen, updateState]);

  // G0_WELCOME: Show on first game entry (once)
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G0_WELCOME) return;
    if (currentYear !== 0 || !gameState.birthIntroPending) return;
    if (guidanceShownRef.current.G0_WELCOME) return;
    
    guidanceShownRef.current.G0_WELCOME = true;
    setGuidanceStepId('G0_WELCOME');
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, currentYear, gameState.birthIntroPending]);

  // G5_CORE_LOOP: Show when first entering main game (year 1, after birth intro completed)
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G5_CORE_LOOP) return;
    if (currentYear !== 1 || anyModalOpen) return;
    if (guidanceShownRef.current.G5_CORE_LOOP) return;
    
    guidanceShownRef.current.G5_CORE_LOOP = true;
    setTimeout(() => setGuidanceStepId('G5_CORE_LOOP'), 500);
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, currentYear, anyModalOpen]);

  // G5A_UI_MAP: Show after G5_CORE_LOOP is seen
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G5A_UI_MAP) return;
    if (!gameState.guidanceStepSeen?.G5_CORE_LOOP) return; // must see core loop first
    if (currentYear !== 1 || anyModalOpen) return;
    if (guidanceShownRef.current.G5A_UI_MAP) return;
    
    guidanceShownRef.current.G5A_UI_MAP = true;
    setTimeout(() => setGuidanceStepId('G5A_UI_MAP'), 500);
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, currentYear, anyModalOpen]);

  // G5B_ACTIONS_TAB: Show when user first opens Actions tab (My First Play only)
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G5B_ACTIONS_TAB) return;
    if (activeTab !== 'actions') return;
    if (anyModalOpen) return;
    if (guidanceShownRef.current.G5B_ACTIONS_TAB) return;
    
    guidanceShownRef.current.G5B_ACTIONS_TAB = true;
    setTimeout(() => setGuidanceStepId('G5B_ACTIONS_TAB'), 300);
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, activeTab, anyModalOpen]);

  // G5C_PROFILE_TOOLS: Show when user first opens Profile tab (My First Play only)
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G5C_PROFILE_TOOLS) return;
    if (activeTab !== 'profile') return;
    if (anyModalOpen) return;
    if (guidanceShownRef.current.G5C_PROFILE_TOOLS) return;
    
    guidanceShownRef.current.G5C_PROFILE_TOOLS = true;
    setTimeout(() => setGuidanceStepId('G5C_PROFILE_TOOLS'), 300);
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, activeTab, anyModalOpen]);

  // G5D_RELATIONSHIPS_TAB: Show when user first opens Relationships tab (My First Play only)
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G5D_RELATIONSHIPS_TAB) return;
    if (activeTab !== 'relationships') return;
    if (anyModalOpen) return;
    if (guidanceShownRef.current.G5D_RELATIONSHIPS_TAB) return;
    
    guidanceShownRef.current.G5D_RELATIONSHIPS_TAB = true;
    setTimeout(() => setGuidanceStepId('G5D_RELATIONSHIPS_TAB'), 300);
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, activeTab, anyModalOpen]);

  // G6_NO_SINGLE_RIGHT_WAY: Show when first scenario modal opens
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (gameState.guidanceStepSeen?.G6_NO_SINGLE_RIGHT_WAY) return;
    if (!scenarioModalOpen || guidanceShownRef.current.G6_NO_SINGLE_RIGHT_WAY) return;
    
    guidanceShownRef.current.G6_NO_SINGLE_RIGHT_WAY = true;
    setGuidanceStepId('G6_NO_SINGLE_RIGHT_WAY');
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, scenarioModalOpen]);

  // Y1_YEARLY_CHECKIN: Show after year recap closes (every year)
  useEffect(() => {
    if (!gameState.guidanceEnabled || gameState.guidanceDismissedForever) return;
    if (currentYear <= 1 || anyModalOpen) return;
    
    const yearKey = `Y1_YEARLY_${currentYear}`;
    if (gameState.guidanceStepSeen?.[yearKey] || guidanceShownRef.current[yearKey]) return;
    
    // Wait for recap to finish and UI to clear
    if (!gameState.yearStartSnapshot || gameState.yearStartSnapshot.age !== currentYear) return;
    if (!gameState.askedRecapAges?.[currentYear]) return;
    
    guidanceShownRef.current[yearKey] = true;
    const data = computeYearlyCheckinData(gameState);
    setGuidanceYearlyData(data);
    setTimeout(() => setGuidanceStepId('Y1_YEARLY_CHECKIN'), 800);
  }, [gameState.guidanceEnabled, gameState.guidanceDismissedForever, gameState.guidanceStepSeen, currentYear, anyModalOpen, gameState.yearStartSnapshot, gameState.askedRecapAges]);

  useEffect(() => { track("rt_game_open"); }, []);

  // Keep latestStateRef in sync with gameState
  useEffect(() => {
    latestStateRef.current = gameState;
  }, [gameState]); 

  // === MODAL SAFETY SYSTEM ===
  // (Derived active payloads are declared above, before modal ordering logic.)
  
  // Global modal close helper (ensures only ONE modal visible at a time)
  const closeAllModals = React.useCallback(() => {
    setChildTraumaPopupOpen(false);
    setScenarioModalOpen(false);
    setEmergencyOpen(false);
    setNaturalDisasterOpen(false);
    setYearRecapOpen(false);
    setHomeworkPopupOpen(false);
    setKidLogicPopupOpen(false);
    setChaosPopupOpen(false);
    setCuriosityOpen(false);
    setBaliCalmOpen(false);
    setBaliActivityOpen(false);
    setSiblingRivalryPopupOpen(false);
    setDateInviteOpen(false);
    setFaithDecisionOpen(false);
    setMoviePopupOpen(false);
  }, []);

  // === AUTO-RECOVERY: Close modals when payload goes missing ===
  useEffect(() => {
    if (childTraumaPopupOpen && !activeTrauma) {
      console.warn('[Safety] Auto-recover: childTraumaPopupOpen but no trauma, closing');
      setChildTraumaPopupOpen(false);
      resolveChildTraumaPopup();
    }
    if (emergencyOpen && !activeEmergency) {
      console.warn('[Safety] Auto-recover: emergencyOpen but no emergency, closing');
      setEmergencyOpen(false);
      updateState(prev => ({ emergency: { ...(prev.emergency || {}), pending: null } }));
    }
    if (naturalDisasterOpen && !activeNaturalDisaster) {
      console.warn('[Safety] Auto-recover: naturalDisasterOpen but no disaster, closing');
      setNaturalDisasterOpen(false);
      updateState(prev => ({ naturalDisaster: { ...(prev.naturalDisaster || {}), pending: null } }));
    }
  }, [childTraumaPopupOpen, activeTrauma, emergencyOpen, activeEmergency, naturalDisasterOpen, activeNaturalDisaster, resolveChildTraumaPopup, updateState]);

  // === WATCHDOG: Force-close all modals if any open flag is true but no valid payload exists ===
  const anyBlockingModalShouldBeVisible =
    (childTraumaPopupOpen && !!activeTrauma) ||
    (emergencyOpen && !!activeEmergency) ||
    (naturalDisasterOpen && !!activeNaturalDisaster) ||
    (scenarioModalOpen && !!activeScenario);

  useEffect(() => {
    const anyOpenFlag =
      childTraumaPopupOpen || emergencyOpen || naturalDisasterOpen || scenarioModalOpen;

    if (anyOpenFlag && !anyBlockingModalShouldBeVisible) {
      console.warn('[Watchdog] Gray-screen deadlock detected: open flag without payload. Force-closing all modals.');
      closeAllModals();
      // Clear pending payloads defensively
      resolveChildTraumaPopup();
      updateState(prev => ({
        emergency: { ...(prev.emergency || {}), pending: null },
        naturalDisaster: { ...(prev.naturalDisaster || {}), pending: null },
        scenarioPending: prev.scenarioCompletedThisAge ? false : prev.scenarioPending
      }));
    }
  }, [childTraumaPopupOpen, emergencyOpen, naturalDisasterOpen, scenarioModalOpen, anyBlockingModalShouldBeVisible, closeAllModals, resolveChildTraumaPopup, updateState]);

  // Compute and open Year Recap when UI is idle and not shown yet for this age
  // Ensure recap opens only after state updates/render for this age completed
  React.useEffect(() => {
    if (gameState.finished) return;
    if (anyModalOpen) return; // wait until UI is clear

    const age = Number(gameState.currentYear || 0);
    if (age <= 0) return; // never show a recap on Year 0
    const asked = gameState.askedRecapAges && gameState.askedRecapAges[age];
    const ys = gameState.yearStartSnapshot;
    if (!ys || ys.age !== age) return; // need start snapshot for this age

    // Guard: ensure no pending year-start processors are still running by waiting a microtask
    // (effectively ensures all previous state updates flushed)
    // Note: use a flagless synchronous path since we re-check conditions below.
    if (asked) return; // already shown this age

    // Build deltas
    const moneyStart = Number(ys.money || 0);
    const moneyEnd = Number(gameState.money || 0);
    const moneyDelta = moneyEnd - moneyStart;
    
    // Child stat deltas
    const statKeys = Object.keys(ys.stats || {});
    const childStatDeltas = {};
    statKeys.forEach(k => {
      const d = Math.round((Number(gameState.stats?.[k] || 0) - Number(ys.stats?.[k] || 0)) * 10) / 10;
      if (d !== 0) childStatDeltas[k] = d;
    });
    
    // Adult stat deltas
    const adultStatDeltas = {};
    const loveDelta = Math.round((Number(gameState.love || 0) - Number(ys.love || 0)) * 10) / 10;
    const stressDelta = Math.round((Number(gameState.stress || 0) - Number(ys.stress || 0)) * 10) / 10;
    const playerHealthDelta = Math.round((Number(gameState.playerHealth ?? 75) - Number(ys.playerHealth ?? 75)) * 10) / 10;
    const focusDelta = Math.round((Number(gameState.actionPoints || 0) - Number(ys.actionPoints || 0)) * 10) / 10;
    const maxFocusDelta = Math.round((Number(gameState.maxFocusTokens || 0) - Number(ys.maxFocusTokens || 0)) * 10) / 10;
    if (loveDelta !== 0) adultStatDeltas['love'] = loveDelta;
    if (stressDelta !== 0) adultStatDeltas['stress'] = stressDelta;
    if (playerHealthDelta !== 0) adultStatDeltas['health'] = playerHealthDelta;
    if (focusDelta !== 0) adultStatDeltas['focus'] = focusDelta;
    if (maxFocusDelta !== 0) adultStatDeltas['maxFocus'] = maxFocusDelta;
    
    // Relationship deltas
    const relationshipDeltas = {};
    const tt = Math.round((Number(gameState.teacherTrust || 0) - Number(ys.teacherTrust || 0)) * 10) / 10;
    const pc = Math.round((Number(gameState.peerCircle || 0) - Number(ys.peerCircle || 0)) * 10) / 10;
    if (tt !== 0) relationshipDeltas['Teacher'] = tt;
    if (pc !== 0) relationshipDeltas['Peers'] = pc;

    // Money audit (dev log) using transaction ledger
    try {
      const txs = (Array.isArray(gameState.moneyTransactions) ? gameState.moneyTransactions : []).filter(t => Number(t.age) === age);
      const totalIncomeApplied = txs.filter(t => Number(t.amount || 0) > 0).reduce((s, t) => s + Number(t.amount || 0), 0);
      const totalExpensesApplied = txs.filter(t => Number(t.amount || 0) < 0).reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
      const netTx = totalIncomeApplied - totalExpensesApplied;
      const oneOffEvents = moneyEnd - moneyStart - netTx;
      console.log('YEAR END MONEY AUDIT', { age, moneyStart, totalIncomeApplied, totalExpensesApplied, oneOffEvents, moneyEnd, moneyDelta });
    } catch (e) { try { console.warn('Money audit failed', e); } catch {} }

    // Compute income and expenses breakdown from transactions
    const txs = (Array.isArray(gameState.moneyTransactions) ? gameState.moneyTransactions : []).filter(t => Number(t.age) === age);
    const incomeYou = txs.filter(t => Number(t.amount || 0) > 0 && t.category === 'salary').reduce((s, t) => s + Number(t.amount || 0), 0);
    const incomePartner = 0; // Could be derived from note/source if tracked separately
    const expenseTxs = txs.filter(t => Number(t.amount || 0) < 0);
    const expensesTotal = expenseTxs.reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
    
    // Group expenses by category
    const expensesByCategory = {};
    expenseTxs.forEach(t => {
      const cat = t.category || 'uncategorized';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Math.abs(Number(t.amount || 0));
    });
    const expenseCategories = Object.entries(expensesByCategory)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    // Focus tracking (if focus ledger exists)
    const focusSpentTotal = 0; // Would need focus transaction ledger to compute
    const focusSpentByAction = [];
    
    // Biggest moment: pick last significant entry for this age
    const ageEntries = (Array.isArray(gameState.timelineEntries) ? gameState.timelineEntries : []).filter(e => Number(e.age) === age);
    const byPriority = ['major','scenario','easterEgg','kidLogic','tinyCute','social','career','politics'];
    let biggest = null;
    for (const kind of byPriority) {
      const found = [...ageEntries].reverse().find(e => e.kind === kind);
      if (found) { biggest = { id: found.id, title: found.title }; break; }
    }
    if (!biggest && ageEntries.length) biggest = { id: ageEntries[ageEntries.length-1].id, title: ageEntries[ageEntries.length-1].title };

    // Funny headline generator (very light)
    const funny = biggest?.title || (moneyDelta >= 0 ? 'A strangely stable year' : 'We learned some expensive lessons');

    // Evaluate rare unlocks
    const yearDelta = { moneyDelta, statDeltas: childStatDeltas, loveDelta: 0, stressDelta: 0 };
    const unlockIds = evaluateRareMomentUnlocks({ gameState, age, yearDelta }) || [];
    const shareEligible = unlockIds.length > 0 || (funny && funny.length >= 20);

    // Persist rare unlocks
    if (unlockIds.length) {
      const now = Date.now();
      const nextMap = { ...(gameState.unlockedRareMoments || {}) };
      unlockIds.forEach(id => {
        if (!nextMap[id]) nextMap[id] = { unlockedAtAge: age, unlockedAtTs: now };
      });
      updateState({ unlockedRareMoments: nextMap });
    }

    // Urn Crypto Recap
    const marketRecap = gameState.urnCrypto?.lastMarketRecap;
    const cryptoRecap =
      marketRecap &&
      Number(marketRecap.age) === (age - 1)
        ? {
            age: marketRecap.age,
            headline: marketRecap.headline,
            portfolioBefore: marketRecap.portfolioBefore,
            portfolioAfter: marketRecap.portfolioAfter,
            delta: marketRecap.delta,
            changes: marketRecap.changes || []
          }
        : null;

    const streakYears = Math.max(1, age + 1);
    const recap = { 
      age, 
      headline: funny, 
      biggestMoment: biggest, 
      cashEnd: moneyEnd, 
      moneyDelta, 
      incomeYou,
      incomePartner,
      expenses: { total: expensesTotal, byCategory: expenseCategories },
      focusSpent: focusSpentTotal > 0 ? { total: focusSpentTotal, byAction: focusSpentByAction } : null,
      childStatDeltas, 
      adultStatDeltas, 
      relationshipDeltas, 
      streakYears, 
      shareEligible,
      cryptoRecap
    };

    // Save recap (source-of-truth values only) then open
    updateState(prev => ({
      lastYearRecap: recap,
      askedRecapAges: { ...(prev.askedRecapAges || {}), [age]: true }
    }));

    // Open after state commit on next tick to avoid any stale reads
    const showRecap = (gameState.settings?.showYearRecapPopup ?? true);
    setTimeout(() => {
      setYearRecapData(recap);
      if (showRecap) setYearRecapOpen(true);
    }, 0);
  }, [anyModalOpen, gameState.finished, gameState.currentYear, gameState.timelineEntries, gameState.stats, gameState.money, gameState.teacherTrust, gameState.peerCircle]);

  const handleKidLogicChoice = (choiceKey) => {
    if (kidLogicProcessing) return;
    setKidLogicProcessing(true);
    resolveKidLogicPopup(choiceKey);
    setKidLogicPopupOpen(false);
    setTimeout(() => setKidLogicProcessing(false), 250);
  };

  const safeLoadScenarioForAgeOnce = React.useCallback(async (age, reason = "auto") => {
    // ANY active special start forces yearly scenario (unified system)
    const forcedYearlySpecialStart = Boolean(gameState.specialStartId);

    // Childless: skip parenting scenarios UNLESS special start forces it
    if (!hasChild && !forcedYearlySpecialStart) {
      updateState({
        scenarioPending: false,
        pendingScenario: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioHookId: null,
        currentScenarioResolvedChoice: null
      });
      return;
    }

    // Parenting scenarios only exist for ages 0-18. After 18 we switch to adult-child continuation.
    if (hasChild && Number(age) > 18 && !forcedYearlySpecialStart) {
      updateState({
        scenarioPending: false,
        pendingScenario: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
      });
      return;
    }

    // Multi-kid sibling mode: skip yearly scenario moment entirely UNLESS special start forces it
    const siblingOn = gameState.expansions?.siblingRivalry === true;
    const kidsCount = Array.isArray(gameState.kids) ? gameState.kids.length : 0;
    const multiKidSiblingMode = siblingOn && kidsCount >= 2;

    if (multiKidSiblingMode && !forcedYearlySpecialStart) {
      updateState({
        scenarioPending: false,
        pendingScenario: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioHookId: null,
        currentScenarioResolvedChoice: null
      });
      return;
    }

    if (scenarioLoadInFlightRef.current) return;

    scenarioLoadInFlightRef.current = true;
    try {
      await loadScenarioForAge(age);
    } catch (err) {
      console.error("[safeLoadScenarioForAgeOnce] Unexpected scenario load failure:", err);
      updateState({
        scenarioPending: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioHookId: null
      });
      toast("Scenario failed to load. We skipped a stuck moment so you can keep playing.", {
        duration: 4000,
        position: "top-center"
      });
    } finally {
      scenarioLoadInFlightRef.current = false;
    }
  }, [loadScenarioForAge, updateState, gameState.expansions?.siblingRivalry, gameState.kids?.length]);

  const recoverScenario = React.useCallback(async (reason = "auto") => {
    if (ageUpLockRef.current) return;

    const age = currentYear;
    if (scenarioRecoveryRef.current.age !== age) {
      scenarioRecoveryRef.current = { age, attempts: 0 };
    }

    if (scenarioLoadInFlightRef.current) return;

    scenarioRecoveryRef.current.attempts += 1;

    if (scenarioRecoveryRef.current.attempts > 2) {
      updateState({
        scenarioPending: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioHookId: null
      });
      toast("Recovered. We skipped a stuck moment so you can continue.", {
        duration: 4000,
        position: "top-center"
      });
      return;
    }

    toast("Recovering... Reloading this year's moment.", {
      duration: 4000,
      position: "top-center"
    });

    await safeLoadScenarioForAgeOnce(age, `recover:${reason}`);
  }, [currentYear, safeLoadScenarioForAgeOnce, updateState]);

  const maybeQueueMovieEasterEggPopup = (age) => {
    try {
      // Don’t stack if one already pending
      if (gameState.moviePopupPending) return false;

      // Cooldown: at most once every 6 years
      const last = gameState.lastMoviePopupAge;
      if (typeof last === "number" && age - last < 6) return false;

      const eligible = (Array.isArray(MOVIE_EASTER_EGG_EVENTS) ? MOVIE_EASTER_EGG_EVENTS : []).filter(ev => {
        const min = typeof ev.minAge === "number" ? ev.minAge : 0;
        const max = typeof ev.maxAge === "number" ? ev.maxAge : 99;
        return age >= min && age <= max;
      });
      if (!eligible.length) return false;

      // Rare chance (~8%), deterministic per runSeed+age
      const rng = mulberry32(hashString(`${gameState.runSeed || "seed"}|moviePopup|age:${age}`));
      if (rng() > 0.08) return false;

      const picked = eligible[Math.floor(rng() * eligible.length)];
      if (!picked) return false;

      const childName = gameState.childName || "your child";
      const tmpl = (s) => String(s || "").split("{childName}").join(childName);

      updateState({
        moviePopupPending: {
          ...picked,
          age,
          title: tmpl(picked.title),
          body: tmpl(picked.body),
          hint: tmpl(picked.hint)
        },
        lastMoviePopupAge: age
      });

      return true;
    } catch (e) {
      console.warn("[moviePopup] failed to queue:", e);
      return false;
    }
  };

  const resolveMoviePopup = (choiceId) => {
    const popup = gameState.moviePopupPending;

    if (!popup) {
      setMoviePopupOpen(false);
      return;
    }

    audioManager.playSfx('click');

    // Close modal + clear pending state first (unblocks scenario modal)
    setMoviePopupOpen(false);
    updateState({ moviePopupPending: null });

    let deltas = null;
    let stressDelta = 0;
    let loveDelta = 0;

    if (choiceId === 'scold') {
      deltas = { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 };
      stressDelta = 1;
      loveDelta = -0.2;
    } else if (choiceId === 'talk') {
      deltas = { discipline: 1, intelligence: 0, empathy: 0, confidence: 0 };
      stressDelta = 1;
      loveDelta = 0.2;
    }

    if (deltas) applyDeltas(deltas, 'Story Moment');
    if (stressDelta) applyStress(stressDelta, 'Story Moment');
    if (loveDelta) applyLove(loveDelta, 'Story Moment');

    const afterLine = popup.after?.[choiceId] || '';
    const detail = `${popup.body || ''}${popup.hint ? `\n\n🎬 ${popup.hint}` : ''}${afterLine ? `\n\n${afterLine}` : ''}`;

    addLog(`${popup.icon || '🎬'} ${popup.title || 'Story Moment'}`);

    recordTimelineEntry({
      age: Number.isFinite(popup.age) ? popup.age : currentYear,
      kind: 'easterEgg',
      title: `${popup.icon || '🎬'} ${popup.title || 'Story Moment'}`,
      detail,
      deltas,
      moneyDelta: 0,
      retirementDelta: 0,
      loveDelta,
      stressDelta,
      meta: { popupId: popup.id, choice: choiceId }
    });
  };
  
  // === DEBUG: Popup tracker ===
  // Tracks when any top-level modal/sheet opens (false -> true) and logs it with age.
  // This is useful for verifying "how many popups per year" and catching any scenario-bypass bugs.
  const popupPrevRef = React.useRef({});
  const [popupLog, setPopupLog] = useState([]); // { age, type, auto, ts }
  const popupSpecs = React.useMemo(() => ([
    // Auto popups
    { type: 'ScenarioModal', open: scenarioModalOpen, auto: true },
    { type: 'PetFarewellScenarioModal', open: petFarewellScenarioOpen, auto: true },
    { type: 'InterestDiscoveryModal', open: interestDiscoveryOpen, auto: true },
    { type: 'PrimaryInterestModal', open: primaryInterestOpen, auto: true },
    { type: 'PubertyPassionModal', open: pubertyPassionOpen, auto: true },
    { type: 'RandomDateInviteModal', open: dateInviteOpen, auto: true },
    { type: 'ReflectiveMomentModal', open: reflectiveMomentOpen, auto: true },
    { type: 'ScenarioPackYearlyCheckinsModal', open: packCheckinsOpen, auto: true },
    { type: 'ChaosModeModal', open: chaosPopupOpen, auto: true },
    { type: 'ActionResultSheet', open: !!actionResultPending, auto: true },

    // User-initiated / menu popups
    { type: 'ActionModal', open: actionModalOpen, auto: false },
    { type: 'ScienceFairModal', open: scienceFairOpen, auto: false },
    { type: 'BriefcaseChainModal', open: briefcaseChainOpen, auto: false },
    { type: 'SettingsModal', open: settingsModalOpen, auto: false },
    { type: 'LifeHubModal', open: lifeHubModalOpen, auto: false },
    { type: 'FullTimelineModal', open: fullTimelineOpen, auto: false }
  ]), [
    scenarioModalOpen,
    petFarewellScenarioOpen,
    interestDiscoveryOpen,
    primaryInterestOpen,
    pubertyPassionOpen,
    dateInviteOpen,
    reflectiveMomentOpen,
    packCheckinsOpen,
    actionResultPending,
    actionModalOpen,
    scienceFairOpen,
    briefcaseChainOpen,
    settingsModalOpen,
    lifeHubModalOpen,
    fullTimelineOpen
  ]);

  useEffect(() => {
    // Track open transitions for each popup.
    // We keep the log bounded to avoid runaway memory usage.
    popupSpecs.forEach((spec) => {
      const prevOpen = !!popupPrevRef.current[spec.type];
      const nextOpen = !!spec.open;
      if (!prevOpen && nextOpen) {
        setPopupLog((prevLog) => {
          const next = [...prevLog, { age: currentYear, type: spec.type, auto: spec.auto, ts: Date.now() }];
          return next.slice(-400);
        });
      }
      popupPrevRef.current[spec.type] = nextOpen;
    });
  }, [popupSpecs, currentYear]);

  const popupSummary = React.useMemo(() => {
    const byAge = new Map();
    for (const ev of popupLog) {
      const ageKey = Number(ev.age);
      if (!byAge.has(ageKey)) {
        byAge.set(ageKey, { total: 0, auto: 0, user: 0, byType: {} });
      }
      const bucket = byAge.get(ageKey);
      bucket.total += 1;
      if (ev.auto) bucket.auto += 1;
      else bucket.user += 1;
      bucket.byType[ev.type] = (bucket.byType[ev.type] || 0) + 1;
    }
    return byAge;
  }, [popupLog]);

  const thisAgePopupStats = popupSummary.get(Number(currentYear)) || { total: 0, auto: 0, user: 0, byType: {} };
  const navigate = useNavigate();

  // Contact pings toast (non-blocking)
  useEffect(() => {
    const q = Array.isArray(gameState.adultLifePingsQueue) ? gameState.adultLifePingsQueue : [];
    if (!q.length) return;

    q.forEach((msg) => toast(msg));
    updateState(prev => ({ ...prev, adultLifePingsQueue: [] }));
  }, [gameState.adultLifePingsQueue, updateState]);

  // Navigate to Death page if run finished with a death event
  useEffect(() => {
    if (gameState.finished && (gameState.deathEvent || gameState.zombieGameOver || gameState.alienGameOver)) {
      navigate(createPageUrl('Death'));
    }
  }, [gameState.finished, gameState.deathEvent, gameState.zombieGameOver, gameState.alienGameOver]);

  // Recovery guard: if no run started but a bootLoadError exists, send user to Start to recover
  useEffect(() => {
    const started = Boolean(gameState.childAvatarPicked) || Boolean(gameState.childAvatarGender) || Boolean(gameState.birthIntroPending) || Boolean(gameState.birthIntroCompleted) || Number(gameState.currentYear || 0) > 0 || Boolean(gameState.finished);
    if (!started && gameState.bootLoadError) {
      navigate(createPageUrl('Start'));
    }
  }, [gameState.bootLoadError]);

  // Ensure we always have a start-of-age checkpoint for the current age (needed for Second Chance)
  useEffect(() => {
    captureYearCheckpoint({ kind: "yearStart", replaceExisting: false });
    
    // Patch PTA state if missing (for existing saves)
    if (!gameState.pta) {
      updateState(prev => ({
        ...prev,
        pta: {
          unlocked: true,
          rank: 'observer',
          stats: {
            influence: 10,
            heat: 0,
            integrity: 50,
            standing: 50,
            bandwidth: 100,
            childTrust: 50
          },
          favors: 5,
          npcRelations: {
            samira: 40,
            elaine: 30,
            coach: 30,
            kwon: 50,
            deleon: 40,
            jordan: 20,
            gwen: 10,
            archivist: 50
          },
          dossiers: {},
          weeklyCharge: null,
          activeAgendas: [],
          meetingsPending: { open: true, closed: false },
          feed: []
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize audio on first user interaction (MOBILE SAFE)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!gameState.audioHasUserGesture) {
        // Load preferences from localStorage
        const musicEnabled = localStorage.getItem('rt_music_enabled');
        const sfxEnabled = localStorage.getItem('rt_sfx_enabled');
        const musicVolume = localStorage.getItem('rt_music_volume');
        const sfxVolume = localStorage.getItem('rt_sfx_volume');
        
        if (musicEnabled !== null) {
          const enabled = musicEnabled === 'true';
          updateState({ audioMusicEnabled: enabled });
          audioManager.setMusicEnabled(enabled);
        }
        if (sfxEnabled !== null) {
          const enabled = sfxEnabled === 'true';
          updateState({ audioSfxEnabled: enabled });
          audioManager.setSfxEnabled(enabled);
        }
        if (musicVolume !== null) {
          const volume = parseFloat(musicVolume);
          if (Number.isFinite(volume)) {
            updateState({ audioMusicVolume: volume });
            audioManager.setMusicVolume(volume);
          }
        }
        if (sfxVolume !== null) {
          const volume = parseFloat(sfxVolume);
          if (Number.isFinite(volume)) {
            updateState({ audioSfxVolume: volume });
            audioManager.setSfxVolume(volume);
          }
        }
        const themeOverride = localStorage.getItem('rt_music_theme_override');
        if (themeOverride !== null) {
          const v = String(themeOverride);
          updateState({ audioMusicThemeOverride: v });
          audioManager.setMusicThemeOverride(v === 'auto' ? null : v);
        }
        
        // Strong unlock for mobile
        audioManager.audioUnlockOnce();
        updateState({ audioHasUserGesture: true });
      }
    };

    document.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('click', handleFirstInteraction, { once: true });
    
    return () => {
      document.removeEventListener('pointerdown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [gameState.audioHasUserGesture, updateState]);

  // Keep procedural background music in the correct "era" based on the child's age.
  // (0–5, 6–12, 13–18). This is safe to call even if audio is not enabled.
  useEffect(() => {
    audioManager.setChildAge(Number(gameState.currentYear ?? 0));
  }, [gameState.currentYear]);

  // Milestone toast disabled per user request

  // Show golden moment modal when triggered
  useEffect(() => {
    if (gameState.goldenMomentPending && !goldenMomentOpen && !anyModalOpen) {
      setGoldenMomentOpen(true);
    }
  }, [gameState.goldenMomentPending, goldenMomentOpen, anyModalOpen]);

  // Opportunity Nudges: auto-open queued hub when UI is idle
  useEffect(() => {
    const queuedHubId = gameState.ui?.queuedHubOpen;
    if (!queuedHubId) return;
    if (anyModalOpen) return;

    // Whitelist valid hubs
    const validHubs = ['career', 'housing', 'politics', 'business', 'education'];
    if (!validHubs.includes(queuedHubId)) {
      updateState(prev => ({
        ui: { ...(prev.ui || {}), queuedHubOpen: null }
      }));
      return;
    }
    
    // Open the Life Hub modal with target
    updateState(prev => ({
      pendingModalToOpen: queuedHubId,
      ui: { ...(prev.ui || {}), queuedHubOpen: null }
    }));
    setLifeHubModalOpen(true);
  }, [gameState.ui?.queuedHubOpen, anyModalOpen, updateState]);

  const handleGoldenMomentClose = () => {
    setGoldenMomentOpen(false);
    updateState({ goldenMomentPending: null });
  };

  // Show school milestone toast
  useEffect(() => {
    const SCHOOL_MILESTONES = [
      { age: 5, title: "School Begins" },
      { age: 11, title: "Middle School" },
      { age: 14, title: "High School" },
      { age: 18, title: "They Turn 18" }
    ];
    
    const milestone = SCHOOL_MILESTONES.find(m => m.age === currentYear);
    if (milestone) {
      const lastEntry = gameState.timelineEntries[gameState.timelineEntries.length - 1];
      if (lastEntry && lastEntry.title === milestone.title && lastEntry.age === currentYear) {
        toast(milestone.title, {
          icon: '🎓',
          duration: 4000,
          position: 'top-center'
        });
      }
    }
  }, [gameState.timelineEntries, currentYear]);

  // === REQUIRED BLOCKER CONDITIONS (Single Source of Truth) ===
  const scenarioMandatory = gameState.scenarioPending && !gameState.scenarioCompletedThisAge;
  const scenarioReady =
    !!gameState.currentScenario &&
    !!(gameState.currentScenario.scenarioText || gameState.currentScenario.hookText || gameState.currentScenario.title);

  const needsStuffedAnimal = hasChild && currentYear === 2 && !gameState.childProfile?.stuffedAnimal;
  const needsInterestDiscovery = hasChild && currentYear === 6 && gameState.schoolStage === 'primary' && gameState.childInterestId === 'none';
  const needsPrimaryInterest = hasChild && currentYear === 6 && !gameState.childProfile?.primaryInterest;
  const needsPubertyPassion = hasChild && currentYear === 12 && !gameState.childProfile?.pubertyPassion;

  const eligibleCheckinsNow = React.useMemo(() => 
    scenarioMandatory ? getEligibleCheckinsForAge(currentYear, gameState) : [],
    [scenarioMandatory, currentYear, gameState]
  );
  const needsPackCheckins = hasChild && scenarioMandatory && eligibleCheckinsNow.length > 0 && !gameState.yearFlags?.packCheckinsShown;
  const needsBirthIntro = hasChild && currentYear === 0 && gameState.birthIntroPending && !gameState.birthIntroCompleted;

  const getNextBlockingModal = React.useCallback(() => {
    if (needsBirthIntro) return { id:'birthIntro', title:'Welcome', reason:'Begin your story.', ctaLabel:'Choose' };

    // Prison visit (highest priority after birth)
    if (prisonVisitPending) return { id:'prisonVisit', title:'Prison Visit', reason:'Your child is here to see you.', ctaLabel:'Visit' };

    if (needsStuffedAnimal) return { id:'stuffedAnimal', title:'Pick a comfort item', reason:'Choose a stuffed animal to comfort your child.', ctaLabel:'Choose' };
    if (needsInterestDiscovery) return { id:'interestDiscovery', title:'Interest discovery', reason:'Discover your child\'s interest before continuing.', ctaLabel:'Discover' };
    if (needsPrimaryInterest) return { id:'primaryInterest', title:'Primary interest', reason:'Choose your child\'s primary interest to continue.', ctaLabel:'Choose' };
    if (needsPubertyPassion) return { id:'pubertyPassion', title:'Puberty passion', reason:'Choose a puberty passion to continue.', ctaLabel:'Choose' };

    if (needsPackCheckins && !inPrison) return { id:'packCheckins', title:'Yearly check-ins', reason:'Complete your scenario pack check-ins.', ctaLabel:'Continue' };

    // Child-free adult life moments (before-baby chapter)
    if (!hasChild && gameState.adultLifeMomentPopupPending && !inPrison) {
      return { id: 'adultLifeMoment', title: 'Adult Life', reason: 'A moment in your adult life.', ctaLabel: 'Continue' };
    }

    // Adult-child continuation popups (post-18 parenting)
    if (hasChild && gameState.adultChildPopupPending && !inPrison) {
      return { id: 'adultChildLife', title: 'Adult Child', reason: 'Your adult child needs you.', ctaLabel: 'Respond' };
    }

    if (gameState.dateInvitePending && !inPrison) return { id:'dateInvite', title:'Invitation pending', reason:'Respond to the invite.', ctaLabel:'Respond' };
    if (clubInvite && !inPrison) return { id:'clubInvite', title:'Club invite', reason:'Respond to the club invite.', ctaLabel:'Respond' };
    if (gameState.moviePopupPending && !inPrison) return { id:'moviePopup', title:'Story Moment', reason:'Make a choice to continue.', ctaLabel:'Continue' };

    // Goal Moments (only when scenario is not mandatory)
    if (!scenarioMandatory && !inPrison && goalMomentPending) return { id:'goalMoment', title:'Goal Moment', reason:'A small moment aligns with your goal.', ctaLabel:'Open' };

    // Bali popups (only when scenario is not mandatory)
    if (!scenarioMandatory && !inPrison && gameState.baliCalmPopupPending) return { id:'baliCalm', title:'Bali Calm', reason:'A calm moment invites you.', ctaLabel:'Continue' };
    if (!scenarioMandatory && !inPrison && gameState.baliActivityPopupPending) return { id:'baliActivity', title:'Bali Activity', reason:'Choose your Bali day.', ctaLabel:'Choose' };
    if (!scenarioMandatory && !inPrison && gameState.inheritancePopupPending) return { id:'inheritance', title:'Inheritance Chaos', reason:'A family inheritance needs attention.', ctaLabel:'Open' };
    if (homeworkPopupPending && !inPrison) return { id:'homeworkPopup', title:'Homework Moment', reason:'Make a choice to continue.', ctaLabel:'Continue' };

    // Sibling Rivalry Popups (shows when queue not empty)
    if (!inPrison && gameState.expansions?.siblingRivalry && Array.isArray(gameState.siblingRivalryPopupQueue) && gameState.siblingRivalryPopupQueue.length > 0) {
      return { id:'siblingRivalry', title:'Sibling Conflict', reason:'Two kids need your attention.', ctaLabel:'Respond' };
    }

    if (!scenarioMandatory && !inPrison && gameState.curiosity?.pending) {
      return { id:'curiosity', title:'Curiosity Pack', reason:'Your kid asked a question.', ctaLabel:'Answer' };
    }

    if (scenarioMandatory && !scenarioReady && !inPrison) return { id:'scenarioMissing', title:'Moment loading...', reason:"Tap to retry loading this year\'s moment.", ctaLabel:'Retry' };
    if (scenarioMandatory && !inPrison && gameState.petDeathPending) return { id:'petFarewellScenario', title:'A hard moment', reason:'Say goodbye and continue.', ctaLabel:'Continue' };
    if (scenarioMandatory && !inPrison) return { id:'scenario', title:'A moment awaits', reason:"Resolve this year\'s moment to continue.", ctaLabel:'Open moment' };

    if (gameState.chaosPopupPending && !inPrison) return { id:'chaosMode', title:'Chaos Mode', reason:'Something ridiculous just happened.', ctaLabel:'Respond' };

    if (kidLogicPopupPending && !inPrison) return { id:'kidLogic', title:'Kid logic moment', reason:'Make a choice to continue.', ctaLabel:'Continue' };

    return null;
  }, [
    needsBirthIntro,
    needsStuffedAnimal,
    needsInterestDiscovery,
    needsPrimaryInterest,
    needsPubertyPassion,
    needsPackCheckins,
    gameState.dateInvitePending,
    clubInvite,
    gameState.moviePopupPending,
    gameState.baliCalmPopupPending,
    gameState.baliActivityPopupPending,
    homeworkPopupPending,
    scenarioMandatory,
    scenarioReady,
    gameState.petDeathPending,
    kidLogicPopupPending,
    gameState.curiosity?.pending,
    gameState.chaosPopupPending,
    eligibleCheckinsNow,
    gameState.yearFlags?.packCheckinsShown
  ]);

  const openBlockingModal = React.useCallback((id) => {
    switch (id) {
      case 'birthIntro': setBirthIntroOpen(true); return;
      case 'prisonVisit': setPrisonVisitOpen(true); return;
      case 'stuffedAnimal': setStuffedAnimalOpen(true); return;
      case 'interestDiscovery': setInterestDiscoveryOpen(true); return;
      case 'primaryInterest': setPrimaryInterestOpen(true); return;
      case 'pubertyPassion': setPubertyPassionOpen(true); return;

      case 'packCheckins':
        setPackCheckinPackIds(eligibleCheckinsNow);
        setPackCheckinsOpen(true);
        modalBlockRef.current = true;
        return;

      case 'dateInvite': setDateInviteOpen(true); return;
      case 'clubInvite': setClubInviteOpen(true); return;
      case 'moviePopup': setMoviePopupOpen(true); return;
      case 'goalMoment': setGoalMomentOpen(true); return;
      case 'baliCalm': setBaliCalmOpen(true); return;
      case 'baliActivity': setBaliActivityOpen(true); return;
      case 'inheritance': setInheritanceOpen(true); return;
      
      // Homework
      case 'homeworkPopup': 
        // No local state needed for this since it relies on homeworkPopupPending being truthy?
        // Wait, other modals like MoviePopup use a local state bool 'moviePopupOpen'.
        // But the homework modal is purely state-driven in this implementation plan?
        // Let's stick to the pattern: use a local state to control the specific modal visibility if needed, 
        // OR just render it if pending. 
        // Actually, for consistency with 'blocking modal system', we often use a state toggle to 'open' it in UI.
        // Let's add homeworkPopupOpen state.
        setHomeworkPopupOpen(true); 
        return;

      case 'petFarewellScenario':
        setActiveTab('home');
        setPetFarewellScenarioOpen(true);
        return;

      case 'scenario':
        setActiveTab('home');
        setScenarioModalOpen(true);
        return;

      case 'scenarioMissing':
        void recoverScenario('auto');
        return;

      case 'chaosMode':
        setChaosPopupOpen(true);
        return;

      case 'kidLogic':
        setKidLogicPopupOpen(true);
        return;
      case 'curiosity':
        setCuriosityOpen(true);
        return;

      case 'siblingRivalry':
        setSiblingRivalryPopupOpen(true);
        return;
      
      case 'adultLifeMoment':
        setAdultLifePopupOpen(true);
        return;
      
      case 'adultChildLife':
        setAdultLifeModalOpen(true);
        return;

      default:
        return;
    }
  }, [eligibleCheckinsNow, recoverScenario, setActiveTab]);

  // Determine ageUp disabled state (single source of truth)

  
  // Determine ageUp disabled state (single source of truth)
  const canPass = canPassLocalCoopTurn(gameState) && !anyModalOpen;
  const centerLabel = canPass ? "Pass" : "Age Up";
  const centerEmoji = canPass ? "🎮" : "🎂";
  
  const scenarioMandatoryForAgeUp = (gameState.scenarioPending && !gameState.scenarioCompletedThisAge) && !inPrison;

  // IMPORTANT: compute blocker first; it must NOT reference ageUpDisabled anywhere
  const uiBlocker = React.useMemo(() => getNextBlockingModal(), [getNextBlockingModal]);

  const ageUpDisabled = anyModalOpen || (!canPass && scenarioMandatoryForAgeUp && !inPrison);
  

  const showBlockerBar = !anyModalOpen && ageUpDisabled && !!uiBlocker;

  // Reflective moment helpers
  const checkReflectiveMoment = (type) => {
    // Only trigger if family patterns were selected
    if (!gameState.familyPatterns?.selectedIds || gameState.familyPatterns.selectedIds.length === 0) return false;
    
    // Probability: 20% chance at major moments
    const rng = mulberry32(hashString(gameState.runSeed + currentYear + type));
    if (rng() > 0.20) return false;
    
    const content = getReflectiveMoment(type);
    setReflectiveMomentContent(content);
    
    // Wait until UI is clear to avoid stacking
    const waitForClear = () => {
      const scenarioMandatory = gameState.scenarioPending && !gameState.scenarioCompletedThisAge;
      if (
        modalBlockRef.current ||
        packCheckinsOpen ||
        !!gameState.dateInvitePending ||
        dateInviteOpen ||
        scenarioMandatory ||
        scenarioModalOpen ||
        actionResultPending
      ) {
        setTimeout(waitForClear, 300);
        return;
      }
      setReflectiveMomentOpen(true);
    };
    
    setTimeout(waitForClear, 500);
    return true;
  };
  
  function clamp(n, min, max) { return Math.max(min, Math.min(max, Number(n))); }
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  function mulberry32(seed) {
    return function() {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Chapter beat helper
  const showChapterBeat = (age) => {
    const beats = {
      // 0: Removed (Replaced by Birth Intro)
      6: {
        title: "School & Identity",
        body: "They're stepping into the world beyond home. Friends, teachers, and a sense of self begin to form.",
        unlocks: ["Primary interests unlock", "School relationships matter more"]
      },
      12: {
        title: "Puberty & Independence",
        body: "The child you knew is becoming someone new. Emotions run deep, boundaries shift, and your role evolves.",
        unlocks: ["Passion specializations unlock", "Peer pressure ramps up", "Privacy matters more"]
      },
      14: {
        title: "High School",
        body: "The stakes feel higher now. Identity, choices, and the future loom larger every year.",
        unlocks: ["Advanced academic options", "Dating may begin", "Career paths start taking shape"]
      },
      18: {
        title: "Graduation / Launch",
        body: "This is it. The last year before they step fully into their own life.",
        unlocks: ["Final year decisions shape their future", "Relationship patterns crystallize"]
      }
    };
    
    const beat = beats[age];
    if (!beat) return;
    
    setChapterBeatContent(beat);
    setChapterBeatOpen(true);
  };

  const isSchoolMilestoneAge = (age) => {
    // "starting new school level or finishing school"
    // Tuneable list: elementary start, middle school, high school, graduation
    return [6, 11, 14, 18].includes(Number(age));
  };

  const playYearUpAndMaybeMilestone = (nextAge, forceMilestone = false) => {
    // Year up is always a soft UI pop
    audioManager.playSfx('click');

    const milestone = forceMilestone || isSchoolMilestoneAge(nextAge);
    if (milestone) {
      // small delay so it feels like "click -> celebration"
      setTimeout(() => audioManager.playSfx('ageup'), 120);
    }
  };

  // Handle Age Up
  const handleAgeUp = async () => {
    const moneyAtStart = Number(gameState.money || 0);
    if (ageUpLockRef.current) return;
    if (gameState.finished) return;
    if (anyModalOpen) return;
    
    // Local Co-Op: if can pass, switch turn instead of aging up
    if (canPass) {
      const curSide = (gameState?.coop?.activeSide === 'partner') ? 'partner' : 'player';
      const nextSide = (curSide === 'partner') ? 'player' : 'partner';
      const ok = switchLocalCoopTurn();
      if (ok) {
        setLocalCoopTurnToSide(nextSide);
        setLocalCoopTurnOpen(true);
      }
      return;
    }
    
    if (scenarioMandatoryForAgeUp) return;
    track("rt_age_up_clicked");
    
    const targetYear = Number(currentYear || 0) + 1;
    setAgingUpTargetYear(targetYear);
    setIsAgingUp(true);

    // PRISON: Serve one year if incarcerated
    const prison = ensurePrisonState(gameState.prison);
    const inPrison = prison.active === true;

    if (inPrison) {
      ageUpLockRef.current = true;

      const newAge = (gameState.currentYear || 0) + 1;
      playYearUpAndMaybeMilestone(newAge);
      const nextRemaining = Math.max(0, (prison.yearsRemaining || 0) - 1);

      // Move year, reset basic per-year flags, set prison visit pending
      updateState(prev => ({
        ...prev,
        currentYear: newAge,
        yearFlags: {},
        aiUsedThisAge: false,
        maxFocusTokens: 2,
        actionPoints: 2,
        prison: ensurePrisonState({
          ...(prev.prison||{}),
          yearsRemaining: nextRemaining,
          actionsUsedThisAge: 0,
          visitUsedThisAge: false,
          visitPendingThisAge: hasAnyChild(prev) ? true : false
        }),
        scenarioPending: false,
        pendingScenario: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioHookId: null
      }));

      // Urn Crypto year-end tick (prison path)
      try {
        if (typeof processUrnCryptoYearEndTick === 'function') {
          processUrnCryptoYearEndTick(newAge);
        }
      } catch (e) {
        console.warn('[UrnCrypto] year-end tick failed (prison)', e);
      }

      // Release handling
      if (nextRemaining === 0) {
        updateState(prev => {
          const prevPrison = ensurePrisonState(prev.prison);
          const releasedPrison = ensurePrisonState({
            ...prevPrison,
            active: false,
            yearsRemaining: 0
          });
          return {
            ...prev,
            prison: releasedPrison,
            maxFocusTokens: releasedPrison.prePrisonMaxFocusTokens ?? 3,
            actionPoints: releasedPrison.prePrisonActionPoints ?? 3
          };
        });
        
        emitActionResult({
          actionId: "prison",
          title: "🚪 Released",
          body: "You are released from prison. Re-entry won't be easy, but you're free.",
          tags: ["prison","life"],
          moneyDelta: 0,
          stressDelta: 0,
          focusDelta: 0,
          meta: { emoji: "🚪" }
        });
        recordTimelineEntry({ kind:"system", title:"🚪 Released from Prison", detail:`Released at age ${newAge}.`, age:newAge });
      }

      setTimeout(() => { ageUpLockRef.current = false; setIsAgingUp(false); setAgingUpTargetYear(null); }, 200);
      return;
    }

    // Removed forced end/death at age 18 - game now continues normally

    ageUpLockRef.current = true;

    const newAge = currentYear + 1;
    playYearUpAndMaybeMilestone(newAge);

    // NEW: Make Focus → Health change explicit (rest vs overwork)
    try {
      const maxFocus = Math.max(0, Math.floor(Number(gameState.maxFocusTokens ?? 0)));
      const remaining = Math.max(0, Math.min(maxFocus, Math.floor(Number(gameState.actionPoints ?? 0))));
      const focusHealthDelta = (maxFocus > 0) ? (remaining > 0 ? remaining : -1) : 0;

      if (focusHealthDelta !== 0) {
        recordTimelineEntry({
          kind: "health",
          title: remaining > 0 ? "😌 Rested Up" : "😵 Overworked",
          detail: remaining > 0
            ? `You ended the year with ${remaining}/${maxFocus} Focus unused.\nHealth +${remaining} from rest.\n\n(Your Stress + Age also affect yearly health drift.)`
            : `You used ALL your Focus (${maxFocus}/${maxFocus}).\nHealth -1 from overwork.\n\n(Your Stress + Age also affect yearly health drift.)`,
          age: newAge - 1,
          moneyDelta: 0,
          stressDelta: 0,
          loveDelta: 0
        });
      }
    } catch {}

    processPlayerHealthYearEndTick(newAge);
    updateState({ currentYear: newAge, yearFlags: {}, aiUsedThisAge: false });
    const moneyStartForAudit = moneyAtStart;

    // === BUDGET SNAP (Year-End Budget Plan) ===
    // Auto-open ONLY after Year 1. Later years: user can open via "Quick Budget" in Year Recap.
    const lastBudgetSnapAge = gameState.lastBudgetSnapAge || -1;
    const shouldAutoBudgetSnap = (newAge === 1) && (lastBudgetSnapAge !== newAge);
    
    // Skip budget planning during apocalypse-style special starts
    const skipBudgetSnapForApocalypse =
      gameState.specialStartId === "zombie_apocalypse" ||
      gameState.specialStartId === "alien_invasion";
    
    if (shouldAutoBudgetSnap && skipBudgetSnapForApocalypse) {
      updateState({ lastBudgetSnapAge: newAge });
    } else if (shouldAutoBudgetSnap) {
      budgetSnapResolvedRef.current = false;
      budgetSnapContextRef.current = 'ageUp';
      setBudgetSnapOpen(true);
      setTimeout(() => { ageUpLockRef.current = false; }, 200);
      return; // Wait for Budget Snap to resolve before continuing year-end
    }

    // Break into async chunks to prevent UI freeze
    await new Promise(r => setTimeout(r, 0));
    resetYearActions();
    
    await new Promise(r => setTimeout(r, 0));
    processCareerYearEndTick(newAge);
    
    await new Promise(r => setTimeout(r, 0));
    processTitlesYearEndTick(newAge);
    
    await new Promise(r => setTimeout(r, 0));
    processFaithExposureDecay();
    
    await new Promise(r => setTimeout(r, 0));
    updateState(prev => applyAdultCrimeYearEnd(prev));
    
    await new Promise(r => setTimeout(r, 0));
    applyStartOfAgeResources(newAge);
    updateState(prev => ({ partnerCounselingBuffer: Math.max(0, (prev.partnerCounselingBuffer || 0) - 1) }));

    await new Promise(r => setTimeout(r, 0));
    processBaliYearStart(newAge);
    maybeQueueBaliPopups(newAge);
    processPetYearEnd();
    processSocialMediaYearEnd(newAge);

    await new Promise(r => setTimeout(r, 0));
    try {
      const relTick = runRelationshipsAnnualTick(gameState, newAge);
      if (relTick?.updates) updateState(prev => ({ ...prev, ...relTick.updates }));
      (relTick?.logs || []).forEach(line => addLog(line));
      (relTick?.timelineEntries || []).forEach(entry => recordTimelineEntry(entry));
      await runAnnualPrompts(relTick?.prompts);
    } catch (e) {
      console.error('Relationship annual tick failed:', e);
    }

    // === Player Death Roll (Succession Mode) ===
    try {
      const guardianAgeNow = Number((gameState.parentAgeAtBirth ?? 28)) + Number(newAge);
      const guardianSex = (gameState.parentRole === 'mom') ? 'female' : 'male';

      const yearlyDeathChance = (sex, age) => {
        const a = Number(age || 0);
        const f = [
          { lt: 30, p: 0.0008 },
          { lt: 40, p: 0.0010 },
          { lt: 50, p: 0.0018 },
          { lt: 60, p: 0.0045 },
          { lt: 70, p: 0.0120 },
          { lt: 80, p: 0.0320 },
          { lt: 90, p: 0.0950 },
          { lt: 100, p: 0.2200 },
          { lt: Infinity, p: 0.4000 },
        ];
        const m = [
          { lt: 30, p: 0.0010 },
          { lt: 40, p: 0.0013 },
          { lt: 50, p: 0.0025 },
          { lt: 60, p: 0.0060 },
          { lt: 70, p: 0.0160 },
          { lt: 80, p: 0.0420 },
          { lt: 90, p: 0.1200 },
          { lt: 100, p: 0.2600 },
          { lt: Infinity, p: 0.4500 },
        ];
        const table = (String(sex) === 'female') ? f : m;
        for (const row of table) { if (a < row.lt) return row.p; }
        return table[table.length - 1].p;
      };

      const seed = `${gameState.runSeed || 'seed'}|playerDeath|age:${newAge}|guardianAge:${guardianAgeNow}|role:${gameState.parentRole}|name:${gameState.parentName}`;
      const roll = mulberry32(hashString(seed))();
      const p = yearlyDeathChance(guardianSex, guardianAgeNow);

      // Special-career risk modifiers (Police/Bounty)
      const jobIdNow = gameState.playerCareer?.jobId || null;
      const endedAge = Number(gameState.currentYear || 0);
      const endYearFlags = (gameState.playerCareer?.flagsByAge?.[endedAge] || {});
      let pAdj = p;

      // Baseline job danger (higher than normal life tables)
      if (jobIdNow === 'police_officer') pAdj *= 6.0;
      if (jobIdNow === 'bounty_hunter') pAdj *= 4.0;

      // High-risk actions taken this year increase risk further
      if (endYearFlags.sc_police_high_risk) pAdj += 0.015; // +1.5%
      if (endYearFlags.sc_bounty_high_risk) pAdj += 0.012; // +1.2%

      // Clamp so it never becomes absurd
      pAdj = Math.min(0.50, Math.max(0, pAdj));

      if (roll < pAdj) {
        const pickRng = mulberry32(hashString(seed + '|pick'));
        const pickById = (id) => DEATH_SCENARIOS.find(s => s.id === id);
        const forced =
          (jobIdNow === 'police_officer' && endYearFlags.sc_police_high_risk) ? pickById('line_of_duty')
          : (jobIdNow === 'bounty_hunter' && endYearFlags.sc_bounty_high_risk) ? pickById('bounty_crossfire')
          : null;

        const picked = forced || (DEATH_SCENARIOS[Math.floor(pickRng() * DEATH_SCENARIOS.length)] || DEATH_SCENARIOS[0]);

        // Build memorial entry for the deceased guardian
        const memorial = (prev => {
          const id = `late_guardian_${newAge}_${Date.now()}`;
          return {
            id,
            role: 'late_guardian',
            name: prev.parentName || 'Guardian',
            emoji: '🕯️',
            alive: false,
            isDeceased: true,
            baseAge: Number(prev.parentAgeAtBirth ?? 28),
            diedAtAge: guardianAgeNow,
            deathYear: newAge,
            createdAtAge: 0,
            meter: 0,
            interactionsByAge: {}
          };
        });

        updateState(prev => {
          const rel = prev.relationships || { roster: [], byId: {} };
          const mem = memorial(prev);
          const nextRoster = [...(rel.roster || []), mem];
          const nextById = { ...(rel.byId || {}), [mem.id]: mem };
          return {
            ...prev,
            deathEvent: { ...(picked || {}), diedAtAge: newAge, ts: Date.now() },
            deathContext: {
              mode: 'succession',
              childAge: newAge,
              deceased: {
                id: prev.guardianPerspective?.activeId || 'player',
                side: prev.guardianPerspective?.side || 'player',
                name: prev.parentName,
                role: prev.parentRole,
                parentAgeAtBirth: prev.parentAgeAtBirth ?? 28,
                avatarGender: prev.parentAvatarGender ?? (prev.parentRole === 'mom' ? 'female' : 'male'),
                avatarSpriteIndex: prev.parentAvatarSpriteIndex ?? 0
              }
            },
            relationships: { roster: nextRoster, byId: nextById },
            scenarioPending: false,
            pendingScenario: false,
            scenarioCompletedThisAge: true,
            currentScenario: null,
            currentScenarioHookId: null,
            currentScenarioResolvedChoice: null
          };
        });

        try {
          const def = getChildTraumaCatalogEntry('loss_grief');
          if (def) {
            recordChildTraumaEvent({
              id: `event:${def.id}`,
              kind: 'event',
              typeId: def.id,
              label: def.label,
              description: def.description,
              whatHelps: def.whatHelps,
              effectsHint: def.effectsHint,
              age: newAge,
              severity: 3,
              source: { type: 'guardian_death', who: 'guardian' },
              because: 'Because: a parent died this year.'
            }, { log: true, toast: false, timeline: true });
          }
        } catch {}

        recordTimelineEntry({
          kind: 'family',
          title: `🕯️ ${gameState.parentName} died`,
          detail: `Custody will transfer to a new guardian.`,
          age: newAge,
          moneyDelta: 0, loveDelta: 0, stressDelta: 0
        });

        track("rt_run_finished_death");
        navigate(createPageUrl('Death'));
        setTimeout(() => { ageUpLockRef.current = false; setIsAgingUp(false); setAgingUpTargetYear(null); }, 200);
        return; // Early exit: succession flow
      }
    } catch (e) {
      console.warn('[succession-death] roll failed', e);
    }

    // Real Estate yearly tick (runs at age start)
    try {
      const reTick = simulateAnnualRealEstateTick({
        realEstate: gameState.realEstate,
        age: newAge,
        runSeed: gameState.runSeed,
        landlordLegacyOn: !!gameState.expansions?.empireEstatesLandlordLegacy
      });

      if (reTick?.nextRealEstate) {
        updateState({
          realEstate: reTick.nextRealEstate
        });
        if (Number(reTick.moneyDelta || 0) !== 0) {
          applyMoneyDelta(Number(reTick.moneyDelta || 0), "Real Estate", { category: "housing", ageOverride: newAge });
        }
      }

      if (reTick?.stressDelta) {
        applyStress(Number(reTick.stressDelta) || 0, 'Real Estate');
      }

      if (Array.isArray(reTick?.summaryLines) && reTick.summaryLines.length > 0) {
        toast(reTick.summaryLines.join(' • '), { icon: '🏠' });
      }
    } catch (e) {
      console.error('Real estate tick failed:', e);
    }

    // Only queue child-specific popups when playing as parent (hasChild=true)
    if (hasChild) {
      runSchoolMilestone(newAge);
      maybeQueueHomeworkPopup(newAge);
    }

    // Child-free mode: tick baby pressure and queue adult life moment
    if (!hasChild) {
      tickBabyPressureForNewYear(newAge);
      maybeQueueAdultLifeMomentPopup(newAge);
    }

    // Goal Moments
    const scenarioMandatoryForGoalMoments = gameState.scenarioPending && !gameState.scenarioCompletedThisAge;
    maybeQueueLifeGoalMoment(newAge, { scenarioMandatory: scenarioMandatoryForGoalMoments });

    // Chaos Mode Tick
    maybeQueueChaosPopup(newAge);

    // Sibling Rivalry Popups (HARD CAP: 2 per year)
    maybeQueueSiblingRivalryPopups(newAge);

    // Adult Child Continuation (post-18 adult child system)
    maybeQueueAdultChildPopup(newAge);

    // Urn Crypto Settlement (year-end tick)
    try {
      if (typeof processUrnCryptoYearEndTick === 'function') {
        processUrnCryptoYearEndTick(newAge);
      }
    } catch (e) {
      console.warn('[UrnCrypto] year-end tick failed', e);
    }

    // === NATURAL DISASTERS: Roll once per year (rare; scales with Chaos Mode) ===
    try {
      const ndSeed = `${gameState.runSeed}|naturalDisaster|age:${newAge}|year:${newAge}`;
      const ndRng = createSeededRng(ndSeed);

      if (shouldRollNaturalDisaster({ ...gameState, currentYear: newAge })) {
        const ndPayload = rollNaturalDisaster({ ...gameState, currentYear: newAge }, ndRng);

        // Mark processed for this age regardless of trigger (prevents repeat processing)
        updateState(prev => ({
          naturalDisaster: {
            ...(prev.naturalDisaster || {}),
            pending: ndPayload || null,
            lastProcessedYear: newAge
          }
        }));
      }
    } catch (e) {
      console.error('[NaturalDisaster] Roll failed:', e);
    }

    // === EMERGENCY SYSTEM: Roll for emergency (1% chance, ages 1-18) ===
    try {
      const emergencySeed = `${gameState.runSeed}|emergency|childAge:${newAge}|year:${newAge}`;
      const emergencyRng = createSeededRng(emergencySeed);
      
      if (shouldRollEmergency({ ...gameState, currentYear: newAge })) {
        const emergencyPayload = rollEmergency({ ...gameState, currentYear: newAge }, emergencyRng);
        
        if (emergencyPayload) {
          updateState(prev => ({
            emergency: {
              pending: emergencyPayload,
              lastProcessedYear: newAge
            }
          }));
        } else {
          // No emergency - mark as processed
          updateState(prev => ({
            emergency: {
              ...(prev.emergency || {}),
              lastProcessedYear: newAge
            }
          }));
        }
      }
    } catch (e) {
      console.error('[Emergency] Roll failed:', e);
    }

    // Juvenile Justice Yearly Tick
    updateState(prev => {
      const jj = prev.juvenileJustice || {};
      let nextJJ = { ...jj };
      let nextSchoolType = prev.schoolType;

      // Hall Tick
      if (nextJJ.hall?.active && prev.currentYear >= nextJJ.hall.startAge) {
         nextJJ.hall = { ...nextJJ.hall, yearsRemaining: nextJJ.hall.yearsRemaining - 1 };
         if (nextJJ.hall.yearsRemaining <= 0) {
           nextJJ.hall.active = false;
           // Start Probation
           nextJJ.probation = {
             active: true,
             yearsRemaining: (nextJJ.hall.level >= 3 || nextJJ.record >= 3) ? 2 : 1,
             startAge: newAge
           };
           // Restore School
           nextSchoolType = nextJJ.hall.prevSchoolType || 'standard';
           // Log release
           const jjEvt = getJJSystemEventText({ eventType: 'hall_release', runSeed: prev.runSeed || 'seed', age: newAge, childName: prev.childName || 'your child' });
           if (jjEvt.toastLine) toast(jjEvt.toastLine);
         }
      } 
      // Diversion Tick
      else if (nextJJ.diversion?.active && prev.currentYear >= nextJJ.diversion.startAge) {
         nextJJ.diversion = { ...nextJJ.diversion, yearsRemaining: nextJJ.diversion.yearsRemaining - 1 };
         if (nextJJ.diversion.yearsRemaining <= 0) {
           nextJJ.diversion.active = false;
           // Start Probation (shorter)
           nextJJ.probation = {
             active: true,
             yearsRemaining: 1,
             startAge: newAge
           };
           const jjEvt2 = getJJSystemEventText({ eventType: 'diversion_complete', runSeed: prev.runSeed || 'seed', age: newAge, childName: prev.childName || 'your child' });
           if (jjEvt2.toastLine) toast(jjEvt2.toastLine);
         }
      }
      // Probation Tick
      else if (nextJJ.probation?.active && prev.currentYear >= nextJJ.probation.startAge) {
         nextJJ.probation = { ...nextJJ.probation, yearsRemaining: nextJJ.probation.yearsRemaining - 1 };
         if (nextJJ.probation.yearsRemaining <= 0) {
           nextJJ.probation.active = false;
           const jjEvt3 = getJJSystemEventText({ eventType: 'probation_end', runSeed: prev.runSeed || 'seed', age: newAge, childName: prev.childName || 'your child' });
           if (jjEvt3.toastLine) toast(jjEvt3.toastLine);
         }
      }

      return { juvenileJustice: nextJJ, schoolType: nextSchoolType };
    });
    
    // Show chapter beat for key ages (if enabled)
    if ([0, 6, 12, 14, 18].includes(newAge) && (gameState.settings?.showChapterBeats ?? true)) {
      showChapterBeat(newAge);
    }

    // Check for pack yearly check-ins BEFORE loading scenario
    const previewForCheckins = { ...gameState, currentYear: newAge, yearFlags: {} };
    const eligibleCheckins = getEligibleCheckinsForAge(newAge, previewForCheckins);
    if (eligibleCheckins.length > 0) {
      setPackCheckinPackIds(eligibleCheckins);
      setPackCheckinsOpen(true);
      modalBlockRef.current = true;

      setTimeout(() => {
        ageUpLockRef.current = false;
        setIsAgingUp(false);
        setAgingUpTargetYear(null);
      }, 500);

      // Don't load scenario yet - wait for check-ins to complete
      return;
    }

    // Portrait Mod: Teen style drift (before scenario loads)
    try {
      const { mods } = latestStateRef.current || {};
      if (mods?.portrait?.enabled && newAge >= 13 && newAge <= 17) {
        const { maybeDriftTeenStyle } = await import('@/components/game/portraitMod/portraitModLogic');
        const { buildStyleRevertVignette, buildStyleSwitchVignette, buildStyleAdoptVignette } = await import('@/components/game/portraitMod/portraitModScenarios');
        
        const rng = createSeededRng(`${gameState.runSeed}|teenStyleDrift|age:${newAge}`);
        const drift = await maybeDriftTeenStyle({
          gameState: latestStateRef.current,
          manifest: mods.portrait.manifest,
          rng: () => rng.nextFloat()
        });
        
        if (drift.changed) {
          updateState(prev => ({
            portraitModState: {
              ...(prev.portraitModState || {}),
              childTeenStyleKey: drift.toKey
            }
          }));
          
          // Enqueue drift vignette
          const childName = gameState.childName || 'your child';
          let vignette;
          if (drift.reason === 'revert') {
            vignette = buildStyleRevertVignette({ childName, fromStyleKey: drift.fromKey });
          } else if (drift.reason === 'switch') {
            vignette = buildStyleSwitchVignette({ childName, toStyleKey: drift.toKey });
          } else if (drift.reason === 'adopt') {
            vignette = buildStyleAdoptVignette({ childName, toStyleKey: drift.toKey });
          }
          
          if (vignette) {
            updateState({
              currentScenario: vignette,
              scenarioPending: true,
              pendingScenario: true,
              scenarioCompletedThisAge: false,
              currentScenarioHookId: vignette.id
            });
            return; // Skip normal scenario load
          }
        }
      }
    } catch (e) {
      console.warn('[Portrait Mod] Teen style drift failed:', e);
    }
    
    // Portrait Mod: Adult reset (on turning 18)
    try {
      const { mods } = latestStateRef.current || {};
      if (mods?.portrait?.enabled && newAge === 18) {
        const { shouldResetTeenStyleOnAdulthood } = await import('@/components/game/portraitMod/portraitModLogic');
        const { buildAdultResetVignette } = await import('@/components/game/portraitMod/portraitModScenarios');
        
        const reset = shouldResetTeenStyleOnAdulthood({
          gameState: latestStateRef.current,
          prevAge: newAge - 1,
          newAge
        });
        
        if (reset.shouldReset) {
          updateState(prev => ({
            portraitModState: {
              ...(prev.portraitModState || {}),
              childTeenStyleKey: 'teen_base'
            }
          }));
          
          const childName = gameState.childName || 'your child';
          const vignette = buildAdultResetVignette({ childName });
          
          updateState({
            currentScenario: vignette,
            scenarioPending: true,
            pendingScenario: true,
            scenarioCompletedThisAge: false,
            currentScenarioHookId: vignette.id
          });
          return; // Skip normal scenario load
        }
      }
    } catch (e) {
      console.warn('[Portrait Mod] Adult reset failed:', e);
    }

    await new Promise(r => setTimeout(r, 0));
    await safeLoadScenarioForAgeOnce(newAge, 'ageUp');

    await new Promise(r => setTimeout(r, 0));
    processChildTraumaYearStartTick(newAge);

    // Extra trauma rolls (at most one per age)
    if (!(gameState.yearFlags && gameState.yearFlags.childExtraTraumaAdded)) {
      const latest = { ...gameState, currentYear: newAge };
      const evtPartner = maybeTraumaFromPartnerSpill({ gameState: latest, age: newAge });
      if (evtPartner) {
        recordChildTraumaEvent(evtPartner, { log: true, toast: false, timeline: true });
        updateState(prev => ({ yearFlags: { ...(prev.yearFlags || {}), childExtraTraumaAdded: true } }));
      } else {
        const evtSingle = maybeTraumaFromSingleParentLoad({ gameState: latest, age: newAge });
        if (evtSingle) {
          recordChildTraumaEvent(evtSingle, { log: true, toast: false, timeline: true });
          updateState(prev => ({ yearFlags: { ...(prev.yearFlags || {}), childExtraTraumaAdded: true } }));
        }
      }
    }

    processChildTraumaYearStartTick(newAge);

    // Optional: family inheritance hook (safe, 18+ only, rare chance)
    maybeTriggerInheritanceEvent(gameState, updateState, newAge, newAge);

    // Capture a clean "start of age" checkpoint for Second Chance rewinds
    captureYearCheckpoint({ age: newAge, kind: "yearStart", replaceExisting: true });

    // Capture a compact year start snapshot for recap comparisons AFTER all year-start updates applied
    setTimeout(() => {
      updateState(prev => ({
        ...prev,
        yearStartSnapshot: {
          age: newAge,
          money: prev.money,
          stats: { ...(prev.stats || {}) },
          teacherTrust: prev.teacherTrust,
          peerCircle: prev.peerCircle,
          love: prev.love,
          stress: prev.stress,
          playerHealth: prev.playerHealth,
          actionPoints: prev.actionPoints,
          maxFocusTokens: prev.maxFocusTokens
        }
      }));
    }, 0);

    // Optional: trigger a rare inheritance event (18+)
    maybeTriggerInheritanceEvent(gameState, updateState, newAge, newAge);

    setTimeout(() => {
      ageUpLockRef.current = false;
      setIsAgingUp(false);
    }, 500);

    // Check for reflective moment at transition
    checkReflectiveMoment('transition');

    // Generate year highlights (only if enabled)
    setTimeout(() => {
      try {
        const enabled = latestStateRef.current.settings?.showYearHighlights ?? false;
        if (!enabled) return;
        
        const yl = latestStateRef.current.yearLog || { events: [], lastYearHighlights: null };
        const events = Array.isArray(yl.events) ? yl.events : [];
        const eventsThisYear = events.filter(e => e && e.year === newAge - 1);
        
        // Pick top 3 by priority
        const sorted = [...eventsThisYear].sort((a, b) => (b.priority || 1) - (a.priority || 1));
        const top3 = sorted.slice(0, 3);
        
        // Find near-miss challenges
        let nearMiss = null;
        const activeChallenges = Array.isArray(latestStateRef.current.challengeMeta?.activeIds) 
          ? latestStateRef.current.challengeMeta.activeIds 
          : [];
        for (const challengeId of activeChallenges) {
          const def = CHALLENGE_BY_ID[challengeId];
          if (!def) continue;
          
          const progress = getChallengeProgress(latestStateRef.current, def);
          const total = progress.objectives.length;
          const completed = progress.objectives.filter(o => o.done).length;
          
          if (total - completed === 1) {
            nearMiss = `You were 1 step away from "${def.title}".`;
            break;
          }
        }
        
        // Check for unlocks (storybook, achievements, etc.)
        const unlocked = [];
        
        // Populate unlocks from timeline entries
        const timelineEntries = Array.isArray(latestStateRef.current.timelineEntries) 
          ? latestStateRef.current.timelineEntries 
          : [];
        const unlockEntries = timelineEntries
          .filter(e => e.age === newAge - 1 && (e.kind === 'golden' || e.kind === 'achievement' || e.kind === 'trophy'))
          .slice(0, 3)
          .map(e => ({
            emoji: e.kind === 'golden' ? '✨' : '🏆',
            title: e.title,
            detail: e.detail
          }));
        unlocked.push(...unlockEntries);
        
        const highlights = {
          year: newAge - 1,
          topEvents: top3.map(e => ({
            emoji: e.type === 'golden' ? '✨' : '📌',
            title: e.title,
            summary: e.title
          })),
          unlocked,
          nearMiss
        };
        
        updateState(prev => ({
          yearLog: {
            ...prev.yearLog,
            lastYearHighlights: highlights
          },
          yearHighlightsPending: highlights
        }));
      } catch (e) {
        console.error('[YearHighlights] Generation failed:', e);
      }
    }, 100);

    // Navigate to Popups page if any year-end popups are queued
    // Use a flag to check state on next render, avoiding stale closure
    updateState(prev => ({
      ui: { ...(prev.ui || {}), yearEndPopupsCheckRequested: true, popupsReturnView: 'Game' }
    }));
  };

  // Check for year-end popups when gameState updates and flag is set
  useEffect(() => {
    if (!gameState.ui?.yearEndPopupsCheckRequested) return;
    if (ageUpLockRef.current) return;

    // Parenting-only popups that should be excluded when childless
    const parentingOnlyFlags = hasChild ? (
      gameState.birthIntroPending ||
      gameState.scenarioPending ||
      gameState.homeworkPopupPending ||
      gameState.kidLogicPopupPending ||
      gameState.baliCalmPopupPending ||
      gameState.baliActivityPopupPending ||
      (Array.isArray(gameState.childTraumaPopupQueue) && gameState.childTraumaPopupQueue.length > 0) ||
      gameState.moviePopupPending ||
      gameState.curiosity?.pending ||
      (gameState.expansions?.siblingRivalry && Array.isArray(gameState.siblingRivalryPopupQueue) && gameState.siblingRivalryPopupQueue.length > 0)
    ) : false;

    const hasYearEndPopups = 
      parentingOnlyFlags ||
      gameState.emergency?.pending ||
      gameState.chaosPopupPending ||
      gameState.dateInvitePending ||
      gameState.royalPopupPending ||
      gameState.actionResultPending ||
      gameState.adultLifeMomentPopupPending ||
      gameState.adultChildPopupPending;

    if (hasYearEndPopups) {
      navigate(createPageUrl('Popups'));
    }

    // Clear the flag
    updateState(prev => ({
      ui: { ...(prev.ui || {}), yearEndPopupsCheckRequested: false }
    }));
  }, [gameState.ui?.yearEndPopupsCheckRequested, hasChild, gameState.birthIntroPending, gameState.emergency?.pending, gameState.scenarioPending, gameState.homeworkPopupPending, gameState.chaosPopupPending, gameState.expansions?.siblingRivalry, gameState.siblingRivalryPopupQueue, gameState.kidLogicPopupPending, gameState.baliCalmPopupPending, gameState.baliActivityPopupPending, gameState.childTraumaPopupQueue, gameState.dateInvitePending, gameState.moviePopupPending, gameState.curiosity?.pending, gameState.royalPopupPending, gameState.actionResultPending, gameState.adultLifeMomentPopupPending, navigate, updateState]);

  // Keep open-state booleans in sync when pending data clears
  useEffect(() => {
        if (!gameState.dateInvitePending && dateInviteOpen) setDateInviteOpen(false);
        if (!clubInvite && clubInviteOpen) setClubInviteOpen(false);
        if (!gameState.moviePopupPending && moviePopupOpen) setMoviePopupOpen(false);
        if (!homeworkPopupPending && homeworkPopupOpen) setHomeworkPopupOpen(false);
        if (!kidLogicPopupPending && kidLogicPopupOpen) setKidLogicPopupOpen(false);
        if (!gameState.chaosPopupPending && chaosPopupOpen) setChaosPopupOpen(false);
        if (!gameState.curiosity?.pending && curiosityOpen) setCuriosityOpen(false);
        if (!gameState.baliCalmPopupPending && baliCalmOpen) setBaliCalmOpen(false);
        if (!gameState.baliActivityPopupPending && baliActivityOpen) setBaliActivityOpen(false);
        if (!gameState.familyBackgroundPending && familyBackgroundOpen) setFamilyBackgroundOpen(false);

        const siblingEnabled = !!gameState.expansions?.siblingRivalry;
        const siblingHasQueued = siblingEnabled && Array.isArray(gameState.siblingRivalryPopupQueue) && gameState.siblingRivalryPopupQueue.length > 0;
        if (!siblingHasQueued && siblingRivalryPopupOpen) setSiblingRivalryPopupOpen(false);
      }, [gameState.dateInvitePending, dateInviteOpen, clubInvite, clubInviteOpen, gameState.moviePopupPending, moviePopupOpen, kidLogicPopupPending, kidLogicPopupOpen, homeworkPopupPending, homeworkPopupOpen, gameState.chaosPopupPending, chaosPopupOpen, gameState.curiosity?.pending, curiosityOpen, gameState.baliCalmPopupPending, baliCalmOpen, gameState.baliActivityPopupPending, baliActivityOpen, gameState.expansions?.siblingRivalry, gameState.siblingRivalryPopupQueue, siblingRivalryPopupOpen]);

    // Open Family Background when UI is idle
    useEffect(() => {
      if (gameState.finished) return;
      if (anyModalOpen) return;
      if (gameState.familyBackgroundPending && !familyBackgroundOpen) {
        setFamilyBackgroundOpen(true);
      }
    }, [anyModalOpen, gameState.familyBackgroundPending, familyBackgroundOpen, gameState.finished]);

    // Single-source-of-truth queue: open next required modal when nothing else is open
    useEffect(() => {
              if (
                scenarioResolvingRef.current ||
                processingChoiceRef.current ||
                processingChoice
              ) return;
              if (gameState.finished) return;
              if (anyModalOpen || childTraumaPopupOpen) return;

              const next = getNextBlockingModal();
              if (!next) return;

              openBlockingModal(next.id);
              }, [gameState.finished, anyModalOpen, getNextBlockingModal, openBlockingModal]);

    // Close scenario modal once completed (unless debug UI)
    useEffect(() => {
    if (scenarioModalOpen && gameState.scenarioCompletedThisAge && !gameState.debugUI) {
    setScenarioModalOpen(false);
    }
    }, [scenarioModalOpen, gameState.scenarioCompletedThisAge, gameState.debugUI]);

  // Mandatory scenario watchdog: force-open scenario modal if mandatory but invisible
  useEffect(() => {
            // Guard: do not reopen while choice is resolving or processing
            if (
              scenarioResolvingRef.current ||
              processingChoiceRef.current ||
              processingChoice
            ) return;
            const scenarioMandatory = gameState.scenarioPending && !gameState.scenarioCompletedThisAge;

            if (!scenarioMandatory) return;

            // If scenario is mandatory but missing, reload it once
            if (!gameState.currentScenario) {
              // Defensive: do not reload or reopen if the scenario object is missing
              return;
            }

            // If nothing visible is open, check auto-choose first
            if (!anyModalOpen && !scenarioModalOpen) {
              const autoEnabled = Boolean(gameState.settings?.autoChooseYearlyMomentsByStyle);
              
              if (autoEnabled) {
                const picked = pickAutoChoiceByParentingStyle({ gameState, scenario: gameState.currentScenario });
                
                if (picked) {
                  scenarioResolvingRef.current = true;
                  setScenarioModalOpen(false);
                  
                  const isBlackBeltScenario = gameState.currentScenario?.id?.startsWith('bb_bully_');
                  addLog(`🤖 Auto-chose Option ${picked.choice?.letter}. ${picked.explanation}`);
                  
                  finalizeScenarioChoice(picked.choice, isBlackBeltScenario, true);
                  return;
                }
              }
              
              // Auto disabled or no valid choice: open modal
              setScenarioModalOpen(true);
              setActiveTab('home');
            }
          }, [
            gameState.scenarioPending,
            gameState.scenarioCompletedThisAge,
            gameState.currentScenario,
            gameState.currentYear,
            anyModalOpen,
            scenarioModalOpen,
            loadScenarioForAge,
            setActiveTab,
            processingChoice,
            gameState.settings?.autoChooseYearlyMomentsByStyle,
            gameState.parentingStyle
          ]);

  // Watchdog reset: processingChoice lock safety
  useEffect(() => {
    if (!scenarioModalOpen) return;
    if (!processingChoice) return;

    const t = setTimeout(() => {
      console.warn('[processingChoice] Watchdog reset: lock was stuck; resetting to false.');
      setProcessingChoice(false);
    }, 2000);

    return () => clearTimeout(t);
  }, [scenarioModalOpen, processingChoice]);

  // Safety: If auto-mode enabled and modal somehow opened while scenario is mandatory, auto-resolve immediately
  useEffect(() => {
    if (!scenarioModalOpen) return;
    const scenarioMandatory = gameState.scenarioPending && !gameState.scenarioCompletedThisAge;
    if (!scenarioMandatory) return;
    
    const autoEnabled = Boolean(gameState.settings?.autoChooseYearlyMomentsByStyle);
    if (!autoEnabled) return;
    
    if (scenarioResolvingRef.current || processingChoiceRef.current || processingChoice) return;
    if (!gameState.currentScenario) return;
    
    const picked = pickAutoChoiceByParentingStyle({ gameState, scenario: gameState.currentScenario });
    if (!picked) return;
    
    console.log('[Auto-choose safety] Modal opened despite auto-mode; auto-resolving now');
    scenarioResolvingRef.current = true;
    setScenarioModalOpen(false);
    
    const isBlackBeltScenario = gameState.currentScenario?.id?.startsWith('bb_bully_');
    addLog(`🤖 Auto-chose Option ${picked.choice?.letter}. ${picked.explanation}`);
    
    finalizeScenarioChoice(picked.choice, isBlackBeltScenario, true);
  }, [scenarioModalOpen, gameState.scenarioPending, gameState.scenarioCompletedThisAge, gameState.settings?.autoChooseYearlyMomentsByStyle, gameState.currentScenario, processingChoice]);

  // Single source of truth for finalizing any choice (A-E)
  const finalizeScenarioChoice = async (choice, isBlackBeltScenario = false, isAutoChosen = false) => {

    console.log('[finalizeScenarioChoice] Starting with choice:', choice);
    if (processingChoiceRef.current) {
      console.log('[finalizeScenarioChoice] processing locked (ref)');
      return;
    }
    processingChoiceRef.current = true;
    track("rt_choice_made");
    setProcessingChoice(true);
    
    if (processingChoice) {
      console.log('[finalizeScenarioChoice] Already processing, aborting');
      return;
    }
    
    setProcessingChoice(true);
    console.log('[finalizeScenarioChoice] Processing lock acquired');

    try {
      const active = getActiveChoice(choice);
      console.log('[finalizeScenarioChoice] Active choice deltas:', active.deltas);

      // Secondary Honors: allow any scenario choice to award an honor
      try {
        const honorId = choice.awardHonor || active.awardHonor || null;
        if (honorId) {
          updateState(prev => {
            const t = prev.titles || {};
            const honors = Array.isArray(t.secondaryHonors) ? t.secondaryHonors : [];
            if (honors.includes(honorId)) return prev;
            return { ...prev, titles: { ...t, secondaryHonors: [...honors, honorId] } };
          });
          recordTimelineEntry({ kind: 'system', title: '🏅 Honor Unlocked', detail: String(honorId), deltas: null, moneyDelta: 0 });
        }
      } catch {}

      // ATOMIC scenario completion — prevent reopen of the same moment
      updateState(prev => ({
        ...prev,
        scenarioPending: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioResolvedChoice: active.letter,
        currentScenarioHookId: null,
        lastScenarioResolvedAge: prev.currentYear,
        lastScenarioResolvedId: prev.currentScenario?.id || prev.currentScenario?.hookId || null
      }));
      
      // Capture rewind snapshot before committing (if enabled)
      captureRewindSnapshot();

      // Special handling for teen coming out scenario
      if (currentScenario?.id === TEEN_COMING_OUT_SCENARIO_ID) {
        updateState(prev => {
          const nextState = { ...prev };
          applyTeenComingOutChoice(nextState, currentScenario, choice);
          return nextState;
        });

        // Mark scenario as completed
        updateState({ 
          scenarioCompletedThisAge: true,
          scenarioPending: false,
          currentScenarioResolvedChoice: active.letter,
          currentScenarioHookId: null
        });

        // Get deltas from choice (teen coming out has custom loveDelta/confidenceDelta fields)
        const loveDelta = choice.loveDelta || 0;
        const stressDelta = choice.stressDelta || 0;
        const confidenceDelta = choice.confidenceDelta || 0;

        // Emit result sheet
        if (gameState.settings?.showScenarioResultSheet ?? true) {
          emitActionResult({
            title: "✨ A Moment Arrives",
            body: `${active.consequence}`,
            deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: confidenceDelta },
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            moneyDelta: 0,
            focusDelta: 0,
            tags: ["major"],
            meta: {
              emoji: "✨",
              skipTimelineRecord: false,
              coachNote: gameState.settings?.showCoachNotes ? active.coachNote : null,
              backfireNote: null
            }
          });
        } else {
          // Record timeline if result sheet disabled
          recordTimelineEntry({
            kind: "major",
            title: "✨ A Moment Arrives",
            detail: `${currentScenario?.hookText || "Your child needed to tell you something important."} (You chose ${active.letter}.)`,
            deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: confidenceDelta },
            moneyDelta: 0,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            meta: {
              choiceRole: active.role,
              choiceLetter: active.letter,
              category: "identity",
              teenComingOut: true
            }
          });
        }

        // Close modal and cleanup
        setScenarioModalOpen(false);
        addLog(active.consequence);
        return;
      }

      // Portrait Mod: Apply teen style change from choice
      try {
        if (choice?.meta?.setTeenStyle || active?.meta?.setTeenStyle) {
          const styleKey = choice.meta.setTeenStyle || active.meta.setTeenStyle;
          if (styleKey) {
            updateState(prev => ({
              portraitModState: {
                ...(prev.portraitModState || {}),
                childTeenStyleKey: styleKey,
                shownPunkScenario: styleKey === 'teen_style_punk' ? true : prev.portraitModState?.shownPunkScenario
              }
            }));
          }
        }
      } catch (e) {
        console.warn('[Portrait Mod] Teen style apply failed:', e);
      }

      // Special handling for teen one-off scenarios
      if (isTeenOneOffScenario(currentScenario)) {
        updateState(prev => {
          const nextState = { ...prev };
          applyTeenOneOffChoice(nextState, currentScenario, active.letter);
          return nextState;
        });

        // Mark scenario as completed
        updateState({ 
          scenarioCompletedThisAge: true,
          scenarioPending: false,
          currentScenarioResolvedChoice: active.letter,
          currentScenarioHookId: null
        });

        // Get deltas from choice
        const loveDelta = choice.loveDelta || 0;
        const stressDelta = choice.stressDelta || 0;
        const deltas = choice.deltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };

        // Emit result sheet
        if (gameState.settings?.showScenarioResultSheet ?? true) {
          emitActionResult({
            title: currentScenario.meta?.topic || "A Teen Moment",
            body: `${choice.consequence}`,
            deltas: deltas,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            moneyDelta: 0,
            focusDelta: 0,
            tags: ["major"],
            meta: {
              emoji: choice.emoji || "✨",
              skipTimelineRecord: false,
              coachNote: null
            }
          });
        } else {
          // Record timeline if result sheet disabled
          recordTimelineEntry({
            kind: "scenario",
            title: currentScenario.meta?.topic || "A Teen Moment",
            detail: `${currentScenario?.hookText || ""}\n\n(You chose ${active.letter}.)`,
            deltas: deltas,
            moneyDelta: 0,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            meta: {
              choiceRole: active.role,
              choiceLetter: active.letter,
              category: "teen_oneoff",
              teenOneOff: true,
              eventKey: currentScenario.meta?.eventKey
            }
          });
        }

        // Close modal and cleanup
        setScenarioModalOpen(false);
        addLog(choice.consequence);
        return;
      }

      // Special handling for middle school one-off scenarios
      if (isMiddleSchoolOneOffScenario(currentScenario)) {
        updateState(prev => {
          const nextState = { ...prev };
          applyMiddleSchoolOneOffChoice(nextState, currentScenario, active.id);
          return nextState;
        });

        // Mark scenario as completed
        updateState({ 
          scenarioCompletedThisAge: true,
          scenarioPending: false,
          currentScenarioResolvedChoice: active.letter,
          currentScenarioHookId: null
        });

        // Apply deltas via helpers (love, stress, all stats)
        const raw = active.deltas || {};
        const loveDelta = Number(raw.love || 0);
        const stressDelta = Number(raw.stress || 0);
        const statDeltas = { ...raw };
        delete statDeltas.love; delete statDeltas.stress;
        if (loveDelta) applyLove(loveDelta, "Middle school one-off");
        if (stressDelta) applyStress(stressDelta, "Middle school one-off");
        if (Object.keys(statDeltas).length) applyDeltas(statDeltas, "Middle school one-off");

        // Emit result sheet
        if (gameState.settings?.showScenarioResultSheet ?? true) {
          emitActionResult({
            title: currentScenario.meta?.topic || "A Middle School Moment",
            body: `${active.consequence}`,
            deltas: statDeltas,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            moneyDelta: 0,
            focusDelta: 0,
            tags: ["major"],
            meta: {
              emoji: choice.emoji || "😬",
              skipTimelineRecord: false,
              coachNote: null
            }
          });
        } else {
          // Record timeline if result sheet disabled
          recordTimelineEntry({
            kind: "scenario",
            title: currentScenario.meta?.topic || "A Middle School Moment",
            detail: `${currentScenario?.hookText || ""}\n\n(You chose ${active.letter}.)`,
            deltas: statDeltas,
            moneyDelta: 0,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            meta: {
              choiceRole: active.role,
              choiceLetter: active.letter,
              category: currentScenario?.meta?.category || "puberty",
              middleSchoolOneOff: true,
              eventKey: currentScenario.meta?.msOneOffKey
            }
          });
        }

        // Close modal and cleanup
        setScenarioModalOpen(false);
        addLog(choice.consequence);
        return;
      }

      // --- CO-PARENTING PACK CONSEQUENCES ---
      if (currentScenario?.meta?.packId === 'pack_coparenting_v1') {
        const householdType = gameState.householdType;
        const role = active.role; 
        let meterDelta = 0;

        if (role === 'connect') meterDelta = 5;
        if (role === 'teach') meterDelta = 3;
        if (role === 'boundary') meterDelta = 0;
        if (role === 'avoid') meterDelta = -2;
        if (role === 'harm') meterDelta = -10;

        if (householdType === 'two') {
           const currentMeter = gameState.partnerMeter || 50;
           const newMeter = Math.max(0, Math.min(100, currentMeter + meterDelta));
           
           updateState({ partnerMeter: newMeter });
           
           if (meterDelta !== 0) {
             addLog(`${gameState.partnerName || 'Partner'} meter: ${meterDelta > 0 ? '+' : ''}${meterDelta} (${newMeter})`);
           }

           if (newMeter <= 20 && gameState.partnerRelationship?.status === 'married') {
             const keepTrying = await confirm({
               title: 'Relationship Crisis',
               description: `${gameState.partnerName || 'Partner'} says: "I can't do this anymore. We're broken."\n\nDo you want to fight for the marriage (Counseling -$500) or let go?`,
               confirmText: 'Counseling ($500)',
               cancelText: 'Divorce',
               destructive: false
             });

             if (keepTrying) {
               if (gameState.money >= 500) {
                 spendMoney(500);
                 updateState({ partnerMeter: 40 });
                 addLog("Counseling bought you some time. Meter restored to 40.");
               } else {
                 addLog("You couldn't afford counseling. The distance remains.");
               }
             } else {
               updateState(prev => finalizePartnerSeparation(prev, { mode: 'divorce' }));
               addLog("You are now divorced. Household is Single.");
               recordTimelineEntry({ kind: "major", title: "💔 Divorce", detail: "The marriage ended. You are now co-parenting.", deltas: null, moneyDelta: 0 });
             }
           }
        } else if (householdType === 'single' && gameState.coparentProfile) {
           const currentMeter = gameState.coparentProfile.meter || 50;
           const newMeter = Math.max(0, Math.min(100, currentMeter + meterDelta));
           
           updateState(prev => ({
             coparentProfile: { ...prev.coparentProfile, meter: newMeter }
           }));

           if (meterDelta !== 0) {
             addLog(`${gameState.coparentProfile.name} meter: ${meterDelta > 0 ? '+' : ''}${meterDelta} (${newMeter})`);
           }

           if (newMeter >= 85) {
             const reconcile = await confirm({
               title: 'Second Chance?',
               description: `${gameState.coparentProfile.name} asks: "We're good at this. Should we try being a family again?"`,
               confirmText: 'Yes, reunite',
               cancelText: 'No, stay co-parents'
             });

             if (reconcile) {
               updateState(prev => {
                 const rel = prev.relationships || { roster: [], byId: {} };
                 const roster0 = Array.isArray(rel.roster) ? [...rel.roster] : [];
                 const byId0 = { ...(rel.byId || {}) };

                 const cp = prev.coparentProfile || {};
                 const candidates = ['father_of_child', 'mother_of_child'].filter(id => !!byId0[id]);
                 const pickId =
                   candidates.find(id => byId0[id]?.name && cp.name && byId0[id].name === cp.name) ||
                   candidates[0] ||
                   null;

                 const otherParent = pickId ? byId0[pickId] : null;

                 const partnerPerson = {
                   ...(otherParent || {}),
                   id: 'partner',
                   role: 'partner',
                   name: cp.name || otherParent?.name || prev.partnerName || 'Partner',
                   emoji: cp.emoji || otherParent?.emoji || '🧑',
                   meter: Math.max(0, Math.min(100, Number(cp.meter ?? otherParent?.meter ?? 85))),
                   createdAtAge: otherParent?.createdAtAge ?? (prev.currentYear || 0),
                   baseAge: otherParent?.baseAge ?? (prev.partnerAgeAtBirth ?? 28),
                   age: otherParent?.age ?? ((otherParent?.baseAge ?? prev.partnerAgeAtBirth ?? 28) + (prev.currentYear || 0)),
                 };

                 const roster1 = roster0.filter(p => p?.id !== 'partner' && p?.id !== pickId);
                 roster1.push(partnerPerson);

                 delete byId0.partner;
                 if (pickId) delete byId0[pickId];
                 byId0.partner = partnerPerson;

                 return {
                   householdType: 'two',
                   partnerName: partnerPerson.name,
                   partnerEmoji: partnerPerson.emoji,
                   partnerMeter: partnerPerson.meter,
                   partnerAgeAtBirth: partnerPerson.baseAge,
                   partnerAvatarGender: partnerPerson.avatarGenderKey || partnerPerson.genderKey || null,
                   partnerAvatarSpriteIndex: partnerPerson.avatarSpriteIndex ?? null,
                   partnerRelationship: { status: 'partnered', marriedAtAge: null },
                   coparentProfile: null,
                   relationships: { roster: roster1, byId: byId0 }
                 };
               });
               addLog("You got back together! Household is Two Parents.");
               recordTimelineEntry({ kind: "major", title: "❤️ Reunited", detail: "You and your co-parent decided to try again.", deltas: null, moneyDelta: 0 });
             }
           }
        }
      }

      applyDeltas(active.deltas, `Age ${currentYear} Choice ${active.letter}`);

      // Per-choice Focus Cost
      const focusCost = Number(
        active?.focusCost ??
        choice?.focusCost ??
        (
          (!currentScenario?.meta?.noFocusCostForA &&
           String(active?.letter || '').toUpperCase() === 'A')
            ? 1
            : 0
        )
      );

      if (focusCost > 0) {
        if ((gameState.actionPoints || 0) >= focusCost) {
          spendFocus(focusCost, `Year-end Moment: Option ${active.letter}`);
        } else {
          // Safety: should not happen due to UI lock, but avoid negatives/crashes.
          console.warn("[focusCost] Not enough focus to charge:", focusCost);
        }
      }

      // Optional per-choice state patch (custom scenarios)
      try {
        const patch = active.statePatch || choice.statePatch;
        if (patch) {
          if (typeof patch === 'function') updateState(prev => patch(prev));
          else updateState(patch);
        }
      } catch {}

      // Death routing: if a choice finished the run with a deathEvent, navigate
      setTimeout(() => {
        const s = window.__rt_lastGameState || null; // best-effort; fallback handled by outer effect
      }, 0);

      console.log('[finalizeScenarioChoice] Deltas applied');

      // --- JUVENILE JUSTICE SYSTEM LOGIC ---
      let jjSystemEvent = null;
      if (currentScenario?.meta?.system === 'juvenileJustice') {
        const { jj } = currentScenario.meta;
        const choiceLetter = active.letter; // A, B, C, D
        const severityTier = jj.severityTier || 0;
        const caughtStatus = jj.caughtStatus;
        // Delta logic for JJ stats
        let spreeDelta = 0;
        let heatDelta = 0;
        let recordDelta = 0;
        let remorseDelta = 0;
        let crimeIdentityDelta = 0;
        let crewDelta = 0;
        let loveDeltaOverride = 0;

        // Choice specific logic
        if (choiceLetter === 'A') { // Talk
          spreeDelta = -6;
          heatDelta = -2;
          remorseDelta = 5;
          crimeIdentityDelta = -3;
          loveDeltaOverride = 0.3;
        } else if (choiceLetter === 'B') { // Discipline
          spreeDelta = -10;
          heatDelta = -1;
          remorseDelta = 3;
          loveDeltaOverride = -0.2;
        } else if (choiceLetter === 'C') { // Turn them in / Teach
          if (currentYear < 14) {
            // Learning moment
            spreeDelta = -18;
            heatDelta = -4;
            remorseDelta = 8;
            crimeIdentityDelta = -5;
            loveDeltaOverride = -0.3;
          } else {
            // Serious intervention
            spreeDelta = -20;
            heatDelta = -10;
            remorseDelta = 10;
            crimeIdentityDelta = -10;
            loveDeltaOverride = -0.4;
            // Self-report record increase (only for INCIDENT, 14+, not caught)
            if (jj.kind === 'incident' && currentYear >= 14 && caughtStatus === 'not_caught') {
              recordDelta += 0.5;
            }
          }
        } else if (choiceLetter === 'D') { // Do nothing
          spreeDelta = 18;
          heatDelta = 6;
          remorseDelta = -5;
          crimeIdentityDelta = 5;
          crewDelta = 5;
          loveDeltaOverride = -0.2;
          if (caughtStatus === 'caught') {
            recordDelta += 1;
          }
        }

        // Base record increase if caught
        if (caughtStatus === 'caught') {
          recordDelta = Math.max(recordDelta, 1);
        }

        // Apply JJ state updates
        updateState(prev => {
          const prevJJ = prev.juvenileJustice || {};
          const newRecord = (prevJJ.record || 0) + recordDelta;
          
          let hallUpdate = {};
          let diversionUpdate = {};
          let schoolTypeUpdate = prev.schoolType;

          // Hall Trigger Logic
          // Conditions: Age 14+, Severity 3+, Caught OR (Turned In + Age 14+)
          const hallPossible = currentYear >= 14 && jj.kind === 'incident' && (severityTier >= 3) && (caughtStatus === 'caught' || (choiceLetter === 'C' && caughtStatus === 'not_caught'));
          
          if (hallPossible && !prevJJ.hall?.ever) {
            const sentenceYears = Math.min(4, Math.max(1, 1 + Math.floor(severityTier/2) + Math.floor(newRecord/2) + (choiceLetter === 'D' ? 1 : 0)));

            hallUpdate = {
              hall: {
                ...prevJJ.hall,
                active: true,
                yearsRemaining: sentenceYears,
                startAge: currentYear + 1, // Hall starts NEXT year
                ever: true,
                visits: (prevJJ.hall?.visits || 0) + 1,
                reason: jj.offense,
                level: severityTier,
                prevSchoolType: prev.schoolType || 'standard'
              },
              spree: 0, 
              heat: 0
            };
            schoolTypeUpdate = 'juvenile_hall';
            jjSystemEvent = getJJSystemEventText({
              eventType: 'hall_sentence',
              runSeed: prev.runSeed || 'seed',
              age: currentYear,
              childName: prev.childName || 'your child',
              years: sentenceYears,
              offenseId: jj.offense,
              severityTier,
              record: newRecord
            });
          }
          
          // Diversion Trigger Logic
          // Conditions: Age 14+, Severity 2+, Not Hall, AND (Caught OR Self-Reported)
          const diversionPossible =
            currentYear >= 14 &&
            jj.kind === 'incident' &&
            severityTier >= 2 &&
            !hallPossible &&
            (caughtStatus === 'caught' || (choiceLetter === 'C' && caughtStatus === 'not_caught'));
          
          if (diversionPossible && !hallUpdate.hall) {
             const diversionYears = (severityTier >= 3) ? 2 : 1;
             diversionUpdate = {
               diversion: {
                 ...prevJJ.diversion,
                 active: true,
                 yearsRemaining: diversionYears,
                 startAge: currentYear + 1,
                 reason: jj.offense,
                 level: severityTier
               },
               spree: Math.max(0, (prevJJ.spree || 0) + spreeDelta - 10), // Reduction on entry
               heat: Math.max(0, (prevJJ.heat || 0) + heatDelta - 5)
             };
             jjSystemEvent = getJJSystemEventText({
               eventType: 'diversion_start',
               runSeed: prev.runSeed || 'seed',
               age: currentYear,
               childName: prev.childName || 'your child',
               years: diversionYears,
               offenseId: jj.offense,
               severityTier,
               record: newRecord
             });
          }

          const clamp = (n) => Math.max(0, Math.min(100, n));

          // If triggered, use the reset/reduced stats, otherwise use standard deltas
          const finalSpree = hallUpdate.hall ? 0 : (diversionUpdate.diversion ? diversionUpdate.spree : clamp((prevJJ.spree || 0) + spreeDelta));
          const finalHeat = hallUpdate.hall ? 0 : (diversionUpdate.diversion ? diversionUpdate.heat : clamp((prevJJ.heat || 0) + heatDelta));

          return {
            juvenileJustice: {
              ...prevJJ,
              spree: finalSpree,
              heat: finalHeat,
              remorse: clamp((prevJJ.remorse || 50) + remorseDelta),
              crimeIdentity: clamp((prevJJ.crimeIdentity || 0) + crimeIdentityDelta),
              crew: clamp((prevJJ.crew || 0) + crewDelta),
              record: newRecord,
              lastCheckAge: currentYear,
              lastChoice: choiceLetter,
              ...hallUpdate,
              ...diversionUpdate
            },
            schoolType: schoolTypeUpdate
          };
        });

        if (loveDeltaOverride !== 0) {
          applyLove(loveDeltaOverride, "Response Choice");
        }
      }
      // If a system escalation was triggered, surface it
      if (jjSystemEvent) {
        addLog(jjSystemEvent.logLine);
        if (jjSystemEvent.toastLine) {
          toast(jjSystemEvent.toastLine, { duration: 3500, position: 'top-center' });
        }
        recordTimelineEntry({ kind: 'system', title: jjSystemEvent.timelineTitle, detail: jjSystemEvent.timelineDetail, deltas: null, moneyDelta: 0 });
      }
      // --- END JUVENILE JUSTICE SYSTEM LOGIC ---

      // CRITICAL: Mark scenario as completed (atomic, prevents replay)
      updateState(prev => {
        const updates = { 
          scenarioCompletedThisAge: true,
          scenarioPending: false,
          currentScenarioResolvedChoice: active.letter,
          currentScenarioHookId: null
        };
        
        // Opportunity Nudges: queue hub open if choice has meta.hubId
        if (currentScenario?.meta?.packId === 'opportunity_nudges' && active?.meta?.hubId) {
          const hubId = String(active.meta.hubId);
          updates.ui = { ...(prev.ui || {}), queuedHubOpen: hubId };
          
          // Update last visit year for this hub
          const lastHubVisitYear = { ...(prev.lastHubVisitYear || {}) };
          lastHubVisitYear[hubId] = prev.currentYear;
          updates.lastHubVisitYear = lastHubVisitYear;
        }
        
        return updates;
      });
      console.log('[finalizeScenarioChoice] Scenario marked as completed');
      
      // Apply love and stress from choice data directly (for black belt scenarios)
      let loveDelta, stressDelta;
      
      if (isBlackBeltScenario && choice.loveDelta !== undefined) {
        loveDelta = choice.loveDelta;
        stressDelta = choice.stressDelta || 0;
      } else {
        loveDelta = loveDeltaFromChoice(active);
        stressDelta = stressDeltaFromChoice(active);
      }

      if (active.role === 'connect' && isLensEquipped('compassion')) {
        const compassionTier = getWisdomTier('compassion');
        if (compassionTier >= 3) {
          loveDelta = Math.min(loveDelta + 2, loveDelta > 0 ? loveDelta + 2 : 2);
        } else if (compassionTier >= 1) {
          loveDelta = Math.min(loveDelta + 1, loveDelta > 0 ? loveDelta + 1 : 1);
        }
      }
      
      if (loveDelta !== 0) {
        applyLove(loveDelta, "Yearly Choice");
        const loveText = loveDelta > 0 ? `LOVE +${loveDelta}` : `LOVE ${loveDelta}`;
        addLog(`❤️ Bond shifts: ${loveText}.`);
      }

      if (stressDelta !== 0) {
        applyStress(stressDelta, "Yearly Choice");
        const stressText = stressDelta > 0 ? `STRESS +${stressDelta}` : `STRESS ${stressDelta}`;
        addLog(`😮‍💨 Stress shifts: ${stressText}.`);
      }

      addLog(active.consequence);

      // Stress realism effect for high-effort choices
      const HIGH_EFFORT_ROLES = ["connect", "teach"];
      const isHighEffort = HIGH_EFFORT_ROLES.includes(active.role) || HIGH_EFFORT_ROLES.includes(choice.meta?.choiceRole);

      if (isHighEffort) {
        if (gameState.stress >= gameState.stressHighEffortThreshold && !gameState.regulatedThisAge) {
          applyStress(2, "Parenting while fried");
          applyLove(-1, "Parenting while fried");
          addLog("😮‍💨 You try the calm path while fried. You did it… but it takes extra out of you.");
          
          recordTimelineEntry({
            kind: "stress",
            title: "😮‍💨 Parenting Under Stress",
            detail: "You choose the higher road, but it costs extra energy.",
            deltas: null,
            moneyDelta: 0,
            retirementDelta: 0,
            loveDelta: -1,
            stressDelta: 2
          });
        } else if (gameState.regulatedThisAge) {
          applyStress(-1, "Regulated follow-through");
          addLog("🧘 The reset helps. You stay steadier than you expected.");
          
          recordTimelineEntry({
            kind: "stress",
            title: "🧘 Regulated Follow‑Through",
            detail: "You show up calmer, and it's easier to stay consistent.",
            deltas: null,
            moneyDelta: 0,
            retirementDelta: 0,
            loveDelta: 0,
            stressDelta: -1
          });
        }
      }

      if (active.role === 'harm') {
        incrementCounter('harmCount');
        incrementCounter('avoidantCount');
        updateState(prev => ({
          ...prev,
          actionPoints: Math.max(0, prev.actionPoints - 1),
          counters: {
            ...prev.counters,
            harshChoiceCount: (prev.counters.harshChoiceCount || 0) + 1
          }
        }));
        addLog("Something in the room goes emotionally colder.");
      }

      if (active.role === 'connect') incrementCounter('supportiveCount');
      if (active.role === 'boundary') incrementCounter('strictCount');
      if (active.role === 'teach') incrementCounter('permissiveCount');
      if (active.role === 'avoid') incrementCounter('supportiveCount');

      addHistory({
        age: currentYear,
        baseLetter: active.letter,
        usedTechniqueId: active.techId,
        shownText: active.text,
        deltas: active.deltas
      });

      // Track used scenario hook (no repeats)
      const hookId = currentScenario?.hookId || currentScenario?.id;
      const usedHooks = Array.isArray(gameState.usedScenarioHookIds) ? gameState.usedScenarioHookIds : [];
      if (hookId && !usedHooks.includes(hookId)) {
        updateState(prev => ({ 
          usedScenarioHookIds: [...(Array.isArray(prev.usedScenarioHookIds) ? prev.usedScenarioHookIds : []), hookId] 
        }));
      }

      // Zombie Apocalypse special handling
      if (gameState.specialStartId === "zombie_apocalypse") {
        const { createSeededRng } = await import('@/components/game/GameStateContext');
        
        // Apply money delta if present
        const moneyDelta = Number(active?.moneyDelta || active?.meta?.zombieMoneyDelta || 0);
        if (moneyDelta !== 0) {
          applyMoneyDelta(moneyDelta, 'Zombie scenario');
        }
        
        // A) Apply threat delta
        const threatDelta = Number(active?.meta?.zombieThreatDelta || 0);
        const nextThreat = clamp((gameState.zombieThreat || 20) + threatDelta, 0, 100);
        updateState({ zombieThreat: nextThreat });
        
        // B) Apply wife-state transition
        const nextWife = active?.meta?.zombieWifeNextState;
        if (nextWife) {
          const updates = { zombieWifeState: nextWife };
          
          if (nextWife === "missing" || nextWife === "dead") {
            updates.householdType = "single";
            updates.partnerCareer = null;
          } else if (nextWife === "zombie_kept") {
            updates.householdType = "two";
            updates.partnerCareer = { jobId: "zombie", jobTitle: "Zombie", yearlyIncome: 0, educationLevelId: "high_school", jobLevelIndex: 0, yearsInJob: 0, performance: 0 };
          } else if (nextWife === "cured") {
            updates.householdType = "two";
            updates.partnerCareer = { jobId: "survivor", jobTitle: "Survivor", yearlyIncome: 1000, educationLevelId: "high_school", jobLevelIndex: 0, yearsInJob: 0, performance: 55 };
          }
          
          if (active.meta.zombieWifeReturnUsed === true) {
            updates.zombieWifeReturnUsed = true;
          }
          
          updateState(updates);
          
          // Record timeline for wife state changes
          const stateLabels = { zombie_kept: "kept as zombie", missing: "disappeared", dead: "ended", cured: "cured" };
          recordTimelineEntry({
            kind: "major",
            title: `🧟 Wife: ${stateLabels[nextWife] || nextWife}`,
            detail: active.consequence || `You made a choice about your wife.`,
            moneyDelta: Number(active?.meta?.zombieMoneyDelta || 0)
          });
        }
        
        // C) Instant-death choice
        if (active.meta?.zombieInstantDeath === true) {
          const endZombieRun = (cause, choiceId) => {
            const childAge = gameState.currentYear;
            const t = Number(gameState.zombieTraining || 0);
            let fate;
            
            if (gameState.householdType === "two" && (gameState.zombieWifeState === "human" || gameState.zombieWifeState === "cured")) {
              fate = { title: "Raised by Mom", body: "Your wife keeps them alive and finishes raising them in the apocalypse." };
            } else {
              const rng = createSeededRng(`${gameState.runSeed}|zombie|childfate|age:${childAge}|choice:${choiceId}`);
              const roll = rng.nextFloat();
              
              if (childAge < 12) {
                const adoptChance = clamp(0.30 + t * 0.002, 0.30, 0.60);
                if (roll < adoptChance) {
                  fate = { title: "Adopted", body: "A survivor group took them in. They made it." };
                } else {
                  fate = { title: "Lost", body: "They didn't make it. The apocalypse won." };
                }
              } else {
                const surviveChance = clamp(0.30 + t * 0.003, 0.30, 0.75);
                if (roll < surviveChance) {
                  fate = { title: "Survivor", body: "They survived alone. Tough, scarred, but alive." };
                } else {
                  fate = { title: "Lost", body: "They didn't make it. The apocalypse won." };
                }
              }
            }
            
            updateState({
              zombieGameOver: true,
              zombieDeathCause: cause,
              zombieChildFate: fate,
              finished: true,
              deathEvent: {
                title: "🧟 Zombie Apocalypse",
                body: `${cause}\n\nChild outcome — ${fate.title}: ${fate.body}`
              }
            });
          };
          
          endZombieRun("You were bitten.", active.id);
          return;
        }
        
        // D) Environmental bite roll (reduced by training)
        const training = Number(gameState.zombieTraining || 0);
        const reduceFactor = clamp(1 - training * 0.002, 0.75, 1.0);
        const envRng = createSeededRng(`${gameState.runSeed}|zombie|bite|age:${gameState.currentYear}|choice:${active.id}|thr:${nextThreat}`);
        const biteChance = (nextThreat / 100) * reduceFactor;
        if (envRng.nextFloat() < biteChance) {
          const endZombieRun = (cause, choiceId) => {
            const childAge = gameState.currentYear;
            let fate;
            
            if (gameState.householdType === "two" && (gameState.zombieWifeState === "human" || gameState.zombieWifeState === "cured")) {
              fate = { title: "Raised by Mom", body: "Your wife keeps them alive and finishes raising them in the apocalypse." };
            } else {
              const rng = createSeededRng(`${gameState.runSeed}|zombie|childfate|age:${childAge}|choice:${choiceId}`);
              const roll = rng.nextFloat();
              
              if (childAge < 12) {
                if (roll < 0.30) {
                  fate = { title: "Adopted", body: "A survivor group took them in. They made it." };
                } else {
                  fate = { title: "Lost", body: "They didn't make it. The apocalypse won." };
                }
              } else {
                if (roll < 0.30) {
                  fate = { title: "Survivor", body: "They survived alone. Tough, scarred, but alive." };
                } else {
                  fate = { title: "Lost", body: "They didn't make it. The apocalypse won." };
                }
              }
            }
            
            updateState({
              zombieGameOver: true,
              zombieDeathCause: cause,
              zombieChildFate: fate,
              finished: true,
              deathEvent: {
                title: "🧟 Zombie Apocalypse",
                body: `${cause}\n\nChild outcome — ${fate.title}: ${fate.body}`
              }
            });
          };
          
          endZombieRun("You were bitten.", active.id);
          return;
        }
        
        // E) Wife bite roll (25% if zombie_kept, ages 4-15, reduced by training)
        if (gameState.zombieWifeState === "zombie_kept" && gameState.currentYear >= 4 && gameState.currentYear <= 15) {
          const wifeReduceFactor = clamp(1 - training * 0.002, 0.70, 1.0);
          const wifeRng = createSeededRng(`${gameState.runSeed}|zombie|wifeBite|age:${gameState.currentYear}|choice:${active.id}`);
          if (wifeRng.nextFloat() < (0.25 * wifeReduceFactor)) {
            const endZombieRun = (cause, choiceId) => {
              const childAge = gameState.currentYear;
              const t = Number(gameState.zombieTraining || 0);
              let fate;
              
              if (gameState.householdType === "two" && (gameState.zombieWifeState === "human" || gameState.zombieWifeState === "cured")) {
                fate = { title: "Raised by Mom", body: "Your wife keeps them alive and finishes raising them in the apocalypse." };
              } else {
                const rng = createSeededRng(`${gameState.runSeed}|zombie|childfate|age:${childAge}|choice:${choiceId}`);
                const roll = rng.nextFloat();
                
                if (childAge < 12) {
                  const adoptChance = clamp(0.30 + t * 0.002, 0.30, 0.60);
                  if (roll < adoptChance) {
                    fate = { title: "Adopted", body: "A survivor group took them in. They made it." };
                  } else {
                    fate = { title: "Lost", body: "They didn't make it. The apocalypse won." };
                  }
                } else {
                  const surviveChance = clamp(0.30 + t * 0.003, 0.30, 0.75);
                  if (roll < surviveChance) {
                    fate = { title: "Survivor", body: "They survived alone. Tough, scarred, but alive." };
                  } else {
                    fate = { title: "Lost", body: "They didn't make it. The apocalypse won." };
                  }
                }
              }
              
              updateState({
                zombieGameOver: true,
                zombieDeathCause: cause,
                zombieChildFate: fate,
                finished: true,
                deathEvent: {
                  title: "🧟 Zombie Apocalypse",
                  body: `${cause}\n\nChild outcome — ${fate.title}: ${fate.body}`
                }
              });
            };
            
            endZombieRun("Your zombie wife bit you.", active.id);
            return;
          }
        }
        
        // Queue training popup after survival scenario (if not already shown this age)
        const scenarioKind = currentScenario?.meta?.kind;
        if (scenarioKind === "zombie_survival") {
          const age = Number(gameState.currentYear || 0);
          const already = !!(gameState.zombieTrainingShownAges && gameState.zombieTrainingShownAges[age]);
          if (!already) {
            const { buildZombieTrainingScenario } = await import('@/components/game/specialStarts/zombieApocalypseSpecialStart.jsx');
            const trainingScenario = buildZombieTrainingScenario({ state: gameState, age, rerollNonce: 0 });
            updateState(prev => ({
              ...prev,
              zombieTrainingShownAges: { ...(prev.zombieTrainingShownAges || {}), [age]: true },
              scenarioPending: true,
              pendingScenario: true,
              scenarioCompletedThisAge: false,
              currentScenario: trainingScenario,
              currentScenarioHookId: trainingScenario.meta?.hookId || trainingScenario.id
            }));
            return;
          }
        }
      }

      // Check for trauma BEFORE emitting result, so we can add a note.
      let traumaNote = null;
      try {
        const projectedState = {
          ...gameState,
          love: clamp(loveDeltaFromChoice(active) + (gameState.love || 50), 0, 100),
          stress: clamp(stressDeltaFromChoice(active) + (gameState.stress || 10), 0, 100),
        };
        const trauma = maybeTraumaFromScenario({
          scenario: currentScenario,
          activeChoice: active,
          gameState: projectedState,
          age: currentYear
        });

        if (trauma) {
          recordChildTraumaEvent(trauma, { log: true, toast: true, timeline: true });
          traumaNote = `🩹 Wound: ${trauma.label}\n${trauma.because}\nWhat helps: ${trauma.whatHelps}`;
        }
      } catch (e) {
        console.warn('Child trauma event derivation failed:', e);
      }
      
      // Emit result sheet for immediate feedback (if enabled)
      if (gameState.settings?.showScenarioResultSheet ?? true) {
        const hookSummary = currentScenario?.hookText || currentScenario?.scenarioText?.split('\n')[0] || "A moment arrives";
        if (currentScenario?.meta?.system === 'juvenileJustice') {
          const baseBody = `${active.resultText || active.consequence || hookSummary}`;
          const bodyWithSystem = jjSystemEvent?.resultBody ? `${baseBody}\n\n—\n\n⚖️ System update:\n${jjSystemEvent.resultBody}` : baseBody;
          emitActionResult({
            title: "⚖️ Juvenile Justice Outcome",
            body: bodyWithSystem,
            deltas: active.deltas,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            moneyDelta: 0,
            focusDelta: 0,
            tags: ["major"],
            meta: {
              emoji: "⚖️",
              skipTimelineRecord: true,
              coachNote: gameState.settings?.showCoachNotes ? active.coachNote : null
            }
          });
        } else {
          emitActionResult({
            title: "✨ Outcome",
            body: `${hookSummary}\n\nYou chose: ${active.letter}`,
            deltas: active.deltas,
            loveDelta: loveDelta,
            stressDelta: stressDelta,
            moneyDelta: 0,
            focusDelta: 0,
            tags: ["major"],
            meta: {
              emoji: "✨",
              skipTimelineRecord: true,
              coachNote: gameState.settings?.showCoachNotes ? active.coachNote : null
            }
          });
        }
      }
      // Always record timeline
      if (true) {
        const hookSummary = currentScenario?.hookText || currentScenario?.scenarioText?.split('\n')[0] || "A moment arrives";
        const isBlackBeltBullyingScenario = currentScenario?.id?.startsWith('bb_bully_');
        
        recordTimelineEntry({
          kind: isBlackBeltBullyingScenario ? "scenario" : "major",
          title: isBlackBeltBullyingScenario ? "🏫 Principal meeting: bullying + self‑defense" : `✨ A Moment Arrives`,
          detail: isBlackBeltBullyingScenario 
            ? `You chose: ${active.letter} • The school addressed the incident.${isAutoChosen ? ' (Auto-chosen)' : ''}` 
            : `${hookSummary} (You chose ${active.letter}.)${isAutoChosen ? ' (Auto-chosen)' : ''}`,
          deltas: active.deltas,
          moneyDelta: 0,
          loveDelta: loveDelta,
          stressDelta: stressDelta,
          meta: {
            choiceRole: active.role,
            choiceLetter: active.letter,
            category: currentScenario?.meta?.category,
            band: currentScenario?.meta?.band,
            hookId: currentScenario?.hookId,
            blackBelt: isBlackBeltBullyingScenario
          }
        });
      }

      // Handled outside emit now
      

      // Tiny Cute moment
      if (shouldShowTinyCute()) {
        const m = pickTinyCuteForAge(currentYear);
        if (m) {
          recordFunMomentToLifeLog({
            kind: 'tinyCute',
            title: m.title || 'Tiny Cute Moment',
            detail: m.text || m.detail || '',
            loveDelta: Number(m.loveDelta || 0),
            stressDelta: Number(m.stressDelta || 0)
          });
          markTinyCuteShownThisAge();
        }
      }

      // Kid Philosophy moment
      if (shouldShowKidWisdom()) {
        const w = pickUniqueKidWisdom();
        if (w) {
          recordFunMomentToLifeLog({
            kind: 'kidWisdom',
            title: w.title || 'Kid Philosophy',
            detail: w.text || w.line || w.detail || '',
            loveDelta: Number(w.loveDelta || 0),
            stressDelta: Number(w.stressDelta || 0)
          });
          markKidWisdomShownThisAge();
        }
      }

      // Add micro-moments (end of age)
      addMicroMoments("end", currentYear);

      // Update relationships based on scenario category and choice role
      const category = currentScenario?.meta?.category;
      const prevTeacherTrust = gameState.teacherTrust;
      const prevPeerCircle = gameState.peerCircle;
      const role = active.role;

      if (category && ["school", "authority", "values"].includes(category)) {
        let trustDelta = 0;
        if (role === "connect") trustDelta += 1;
        if (role === "boundary") trustDelta += 1;
        if (role === "teach") trustDelta += 1;
        if (role === "harm") trustDelta -= 2;

        if (trustDelta !== 0) {
          applyTeacherTrust(trustDelta, "Scenario choice");
        }
      }

      if (category && ["peer_pressure", "digital", "social", "relationships"].includes(category)) {
        let peerDelta = 0;
        if (role === "connect") peerDelta += 1;
        if (role === "boundary" && active.deltas?.empathy >= 0) peerDelta += 1;
        if (role === "teach") peerDelta += 1;
        if (role === "avoid") peerDelta -= 1;
        if (role === "harm") peerDelta -= 2;

        if (peerDelta !== 0) {
          applyPeerCircle(peerDelta, "Scenario choice");
        }
      }

      // Log if significant relationship change
      const trustChanged = Math.abs(gameState.teacherTrust - prevTeacherTrust) >= 2;
      const peerChanged = Math.abs(gameState.peerCircle - prevPeerCircle) >= 2;
      if (trustChanged || peerChanged) {
        addLog(`🧩 Relationships shift: Teacher Trust ${gameState.teacherTrust}, Peer Circle ${gameState.peerCircle}.`);
      }

      // Close modal ALWAYS (including E choice)
      console.log('[finalizeScenarioChoice] Closing scenario modal');
      setScenarioModalOpen(false);

      // Do NOT end the run here. The run ends only when the player presses Age Up at age {endAge}.
      if (currentYear === endAge) {
        addLog(`🎓 Final year moment resolved. When you're ready, press Age Up to see where life lands.`);
      }

      // Trigger micro-event after scenario choice
      runMicroEventForAge(currentYear);

      // Create memory after micro-event (small delay to ensure micro-event completes)
      setTimeout(() => {
        try {
          const tone = determineMemoryTone(active);
          const memText = generateMemoryText(currentYear, tone, active, active.techId);
          updateState(prev => ({ 
            memories: [...(Array.isArray(prev.memories) ? prev.memories : []), { age: currentYear, tone, text: memText }] 
          }));
          addLog(`📝 Memory formed: "${memText}"`);

          // Record memory timeline entry
          try {
            recordTimelineEntry({
              kind: "memory",
              title: `Age ${currentYear}: Memory`,
              detail: `"${memText}"`,
              deltas: null,
              moneyDelta: 0,
              loveDelta: 0,
              stressDelta: 0
            });
          } catch (e) {
            console.warn('[Game] recordTimelineEntry failed for memory:', e);
          }

          // Try golden moment after memory (additional delay)
          // REMOVED: tryGoldenMoment is now called with actionId, not year
        } catch (e) {
          console.error('[Game] Memory creation failed:', e);
        }
      }, 150);

      // Check for reflective moment after scenario choice
      const reflectiveTriggered = checkReflectiveMoment('conflict');
      if (!reflectiveTriggered) {
        // Try Movie popup first (rare). If it doesn't queue, try Kid Logic (younger ages).
        const movieQueued = maybeQueueMovieEasterEggPopup(currentYear);
        if (!movieQueued && currentYear >= 2 && currentYear <= 10) {
          // This call passes an AGE NUMBER; GameStateContext now correctly picks a real Kid Logic popup.
          maybeQueueKidLogicPopup(currentYear);
        }
      }
      
      // Queue faith decision popup at milestone ages
      maybeQueueFaithPopup(currentYear);
    } catch (err) {
      console.error('[finalizeScenarioChoice] Error:', err);

      // SAFETY: close the modal so the game isn't stuck
      try { setScenarioModalOpen(false); } catch (e) {}

      // SAFETY: show the player something happened
      try { addLog('⚠️ Something glitched while applying that choice. The game kept going.'); } catch (e) {}
    } finally {
      // ALWAYS release locks and ensure the modal can't get stuck open
      setTimeout(() => {
        console.log('[finalizeScenarioChoice] Processing lock released (finally)');
        try { setProcessingChoice(false); } catch (e) {}
        try { if (typeof processingChoiceRef !== 'undefined' && processingChoiceRef?.current) { processingChoiceRef.current = false; } } catch (e) {}
        try { scenarioResolvingRef.current = false; } catch (e) {}
      }, 150);
      try { if (scenarioModalOpen) setScenarioModalOpen(false); } catch (e) {}
    }
  };

  // Handle date invite accept
  const handleDateInviteAccept = () => {
    const invite = gameState.dateInvitePending;
    if (!invite) return;

    updateState({
      dateInvitePending: null,
      partnerMeter: Math.min(100, (gameState.partnerMeter || 50) + 10)
    });

    const where = invite.where || 'somewhere unexpectedly charming';
    addLog(`💕 You said yes to ${invite.name} at ${where}.`);
    if (invite.acceptLine) addLog(`✨ ${invite.acceptLine}`);

    // Timeline record so it shows up in the Life Log
    recordTimelineEntry({
      kind: "system",
      title: "💌 Surprise invite",
      detail: `You met ${invite.name} at ${where}. ${invite.acceptLine || ''}`.trim(),
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { type: "dateInvite", inviteId: invite.id, accepted: true }
    });

    setDateInviteOpen(false);
  };

  // Handle date invite reject
  const handleDateInviteReject = () => {
    const invite = gameState.dateInvitePending;

    updateState({
      dateInvitePending: null,
      partnerMeter: Math.max(0, (gameState.partnerMeter || 50) - 5)
    });

    const where = invite?.where || 'somewhere unexpectedly charming';
    const name = invite?.name || 'them';
    addLog(`📱 You declined ${name}'s invite.`);
    if (invite?.rejectLine) addLog(`✨ ${invite.rejectLine}`);

    // Timeline record so it shows up in the Life Log
    recordTimelineEntry({
      kind: "system",
      title: "💌 Surprise invite",
      detail: `You declined ${name} at ${where}. ${invite?.rejectLine || ''}`.trim(),
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { type: "dateInvite", inviteId: invite?.id, accepted: false }
    });

    setDateInviteOpen(false);
  };

  // Handle initial choice click - execute immediately (no confirmation)
  const handleChoice = (choice) => {
    console.log('[handleChoice] Called with choice:', choice);

    const autoFlag = Boolean(choice && typeof choice === 'object' && choice.__autoChosen);
    const cleanChoice = autoFlag ? (() => { const c = { ...choice }; delete c.__autoChosen; return c; })() : choice;

    const active = getActiveChoice(cleanChoice);
    const isBlackBeltScenario = currentScenario?.id?.startsWith('bb_bully_');
    console.log('[handleChoice] Active choice:', active, 'isBlackBeltScenario:', isBlackBeltScenario, 'autoFlag:', autoFlag);

    // Close immediately and mark resolving to prevent watchdog reopen
    scenarioResolvingRef.current = true;
    setScenarioModalOpen(false);

    // Play appropriate sound
    if (active.role === 'harm') {
      audioManager.playSfx('bad');
    } else {
      audioManager.playSfx('success');
    }

    finalizeScenarioChoice(cleanChoice, isBlackBeltScenario, autoFlag);
  };

  // Manual escape hatch: open next blocker when user taps banner
  const handleOpenMoment = () => {
    if (anyModalOpen) return;
    const next = getNextBlockingModal();
    if (!next) return;
    openBlockingModal(next.id);
  };

  // QA helper: ?forcePopup=movie|kidLogic|homework and ?forceScenario=teen_coming_out
  const forceOnceRef = React.useRef(false);
  useEffect(() => {
    if (forceOnceRef.current) return;
    const params = new URLSearchParams(window.location.search || '');
    const force = params.get('forcePopup');
    if (!force) return;
    if (anyModalOpen) return; // wait until clear

    const age = Number(currentYear || 0);

    if (force === 'movie') {
      const eligible = (Array.isArray(MOVIE_EASTER_EGG_EVENTS) ? MOVIE_EASTER_EGG_EVENTS : []).filter(ev => {
        const min = typeof ev.minAge === 'number' ? ev.minAge : 0;
        const max = typeof ev.maxAge === 'number' ? ev.maxAge : 99;
        return age >= min && age <= max;
      });
      const picked = eligible[0] || MOVIE_EASTER_EGG_EVENTS[0];
      const childName = gameState.childName || 'your child';
      const tmpl = (s) => String(s || '').split('{childName}').join(childName);
      updateState({
        moviePopupPending: {
          ...picked,
          age,
          title: tmpl(picked.title),
          body: tmpl(picked.body),
          hint: tmpl(picked.hint)
        },
        lastMoviePopupAge: age
      });
      setMoviePopupOpen(true);
      forceOnceRef.current = true;
      return;
    }

    if (force === 'kidLogic') {
      const forced = {
        id: 'force_kid_logic',
        kid: 'I cannot put on socks because they are spicy.',
        options: {
          empathize: '“Spicy socks are tough. Want to pick a softer pair together?”',
          ignore: 'You ignore the sock discourse and keep moving.',
          boundary: '“We leave once socks are on. I can help, and then we go.”'
        }
      };
      maybeQueueKidLogicPopup(forced);
      setKidLogicPopupOpen(true);
      forceOnceRef.current = true;
      return;
    }

    if (force === 'homework') {
      const forced = {
        id: 'force_homework',
        title: 'Math Meltdown?',
        body: 'Homework time derailed. How do you respond?',
        choices: [
          { id: 'A', letter: 'A', emoji: '❤️', text: 'Empathize first, then one small step.', deltas: { empathy: 0.5 }, loveDelta: 1, stressDelta: -0.5 },
          { id: 'B', letter: 'B', emoji: '🧠', text: 'Teach a tiny strategy and practice once.', deltas: { intelligence: 0.5 } },
          { id: 'C', letter: 'C', emoji: '🧱', text: 'Set a calm boundary and follow through.', deltas: { discipline: 0.5 } }
        ]
      };
      updateState({ homeworkPopupPending: forced });
      setHomeworkPopupOpen(true);
      forceOnceRef.current = true;
      return;
    }
  }, [anyModalOpen, currentYear, gameState.childName, updateState]);





  const handleGuidanceContinue = () => {
    const stepId = guidanceStepId;
    setGuidanceStepId(null);
    
    if (stepId) {
      if (stepId === 'Y1_YEARLY_CHECKIN') {
        // Mark this year's checkin as seen
        const yearKey = `Y1_YEARLY_${currentYear}`;
        updateState(prev => ({
          guidanceStepSeen: { ...(prev.guidanceStepSeen || {}), [yearKey]: true }
        }));
      } else {
        updateState(prev => ({
          guidanceStepSeen: { ...(prev.guidanceStepSeen || {}), [stepId]: true }
        }));
      }
    }

    // Auto-advance guidance steps in the tutorial flow
    if (stepId === 'G5_CORE_LOOP' && !gameState.guidanceStepSeen?.G5A_UI_MAP) {
      setTimeout(() => setGuidanceStepId('G5A_UI_MAP'), 300);
    } else if (stepId === 'G6_NO_SINGLE_RIGHT_WAY' && !gameState.guidanceStepSeen?.G7_YEARLY_CHECKINS_CHOICE) {
      setTimeout(() => setGuidanceStepId('G7_YEARLY_CHECKINS_CHOICE'), 300);
    }
  };

  const handleGuidanceCloseForever = () => {
    setGuidanceStepId(null);
    setGuidanceYearlyData(null);
    updateState({
      guidanceDismissedForever: true,
      guidanceEnabled: false
    });
  };

  return (
    <>
      <GameShell
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAgeUp={handleAgeUp}
        ageUpDisabled={ageUpDisabled}
        centerActionLabel={centerLabel}
        centerActionEmoji={centerEmoji}
        centerActionDisabledReason={canPass ? null : (scenarioMandatoryForAgeUp ? 'Complete the scenario first' : null)}
        blocker={uiBlocker}
        showBlockerBar={showBlockerBar}
        onOpenBlocker={handleOpenMoment}
        onOpenSettings={() => {}} // GameShell now manages settings internally
        onOpenBugs={() => setBugOpen(true)}
        onSwitchCoopPlayer={() => {
          const curSide = (gameState?.coop?.activeSide === 'partner') ? 'partner' : 'player';
          const nextSide = (curSide === 'partner') ? 'player' : 'partner';
          const ok = switchLocalCoopTurn();
          if (ok) {
            setLocalCoopTurnToSide(nextSide);
            setLocalCoopTurnOpen(true);
          }
        }}
      >
        {showPrisonButton && (
          <div className="fixed top-3 right-3 z-50">
            <button
              className="px-3 py-2 rounded-lg bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
              onClick={() => setPrisonHubOpen(true)}
            >
              ⛓ Prison ({gameState.prison?.yearsRemaining ?? 0}y left)
            </button>
          </div>
        )}
        {activeTab === 'home' && (
          <HomeTab 
            onAgeUp={handleAgeUp} 
            ageUpDisabled={ageUpDisabled}
            uiBlocker={uiBlocker}
            onSwitchToActionsTab={(category) => {
              setActiveTab('actions');
              if (category) setActionsTabCategory(category);
            }}
            onOpenTimeline={() => setFullTimelineOpen(true)}
            onOpenMoment={handleOpenMoment}
            onOpenLifeHub={(target) => {
              if (target === 'goalSetup') {
                setGoalSetupOpen(true);
              } else if (target === 'pets') {
                setPetsModalOpen(true);
              } else {
                updateState({ pendingModalToOpen: target || null });
                setLifeHubModalOpen(true);
              }
            }}
            onOpenPTA={() => setPtaModalOpen(true)}
          />
        )}
        {activeTab === 'actions' && (
          <ActionsTab
            initialCategory={actionsTabCategory}
            onOpenActionModal={(type) => {
              if (inPrison && type === 'prison') {
                setPrisonHubOpen(true);
              } else {
                setActionModalType(type);
                setActionModalOpen(true);
              }
            }}
            onOpenLifeHub={(target) => {
              if (target === 'pets') {
                setPetsModalOpen(true);
              } else {
                // Deep-link into a specific Life Hub modal (support, outings, etc.)
                updateState({ pendingModalToOpen: target || null });
                setLifeHubModalOpen(true);
              }
            }}
            onOpenScienceFair={() => setScienceFairOpen(true)}
            onOpenSchoolEvent={(id) => {
              const allowed = new Set(['artsShowcase','ecoChallenge','makerChallenge','debateForum']);
              if (!allowed.has(id)) {
                try { toast("That activity isn’t available right now.", { icon: '⚠️' }); } catch {}
                try { console.error('[SchoolEvent] Unknown id:', id); } catch {}
                return;
              }
              setSchoolEventOpenId(id);
            }}
            onOpenOutdoorAdventures={() => setOutdoorAdventuresOpen(true)}
            onOpenPTA={() => setPtaModalOpen(true)}
            onOpenTitles={() => setTitlesHubOpen(true)}
          />
        )}
        {activeTab === 'story' && <StoryTab />}
        {activeTab === 'relationships' && <RelationshipsTab />}
{activeTab === 'profile' && <ProfileTab />}
      </GameShell>

      {/* Modals - Only render if NOT on Popups page */}
      {!onPopupsPage && (
        <>
      <div style={{ zIndex: anyModalOpen ? 1100 : 'auto' }}>
        <ScenarioModal
          open={scenarioModalOpen && showModal('scenario')}
          scenario={currentScenario}
          onClose={() => {
            try { toast.info('Choose an option to continue.'); } catch {}
          }} 
          onChoose={handleChoice}
          disabled={processingChoice}
        />
      </div>

      <ActionModal
        open={actionModalOpen && showModal('actionModal')}
        actionType={actionModalType}
        onClose={() => setActionModalOpen(false)}
        onBriefcaseTriggered={() => {
          setActionModalOpen(false);
          setBriefcaseChainOpen(true);
        }}
      />



      <BugReportModal
        open={bugOpen && showModal('bug')}
        onClose={() => setBugOpen(false)}
        sourcePage="Game"
        runSeed={gameState?.runSeed || null}
        currentYear={gameState?.currentYear || null}
        contextData={{
          activeTab,
          stats: gameState?.stats,
          love: gameState?.love,
          stress: gameState?.stress,
          money: gameState?.money,
          runSeed: gameState?.runSeed,
          currentYear: gameState?.currentYear,
          scenarioPending: gameState?.scenarioPending,
          currentScenario: gameState?.currentScenario,
          actionsUsed: gameState?.actionsUsed,
          timelineEntries: Array.isArray(gameState?.timelineEntries) ? gameState.timelineEntries.slice(-50) : [],
          historyLog: Array.isArray(gameState?.historyLog) ? gameState.historyLog.slice(-80) : []
        }}
      />

      <LifeHubModal
        open={lifeHubModalOpen && showModal('lifeHub')}
        onClose={() => setLifeHubModalOpen(false)}
        onOpenTimeline={() => {
          setLifeHubModalOpen(false);
          setFullTimelineOpen(true);
        }}
        targetModal={gameState.pendingModalToOpen}
        onNavigateToTab={setActiveTab}
      />

      <FullTimelineModal
        open={fullTimelineOpen && showModal('fullTimeline')}
        onClose={() => setFullTimelineOpen(false)}
      />

      <PetFarewellScenarioModal
        open={petFarewellScenarioOpen && showModal('petFarewellScenario')}
        onComplete={() => {
          setPetFarewellScenarioOpen(false);
          setScenarioModalOpen(true);
        }}
      />

      <InterestDiscoveryModal
        open={interestDiscoveryOpen && showModal('interestDiscovery')}
        onComplete={() => setInterestDiscoveryOpen(false)}
      />

      <PrimaryInterestModal
        open={primaryInterestOpen && showModal('primaryInterest')}
        onComplete={() => setPrimaryInterestOpen(false)}
      />

      <PubertyPassionModal
        open={pubertyPassionOpen && showModal('pubertyPassion')}
        onComplete={() => setPubertyPassionOpen(false)}
      />

      <ScienceFairModal
        open={scienceFairOpen && showModal('scienceFair')}
        onClose={() => setScienceFairOpen(false)}
      />

      <ActionResultSheet
        open={!!actionResultPending && showModal('actionResult')}
        onClose={dismissActionResult}
        result={actionResultPending}
      />


      {royalTabloidOpen && showModal('royalTabloid') && <RoyalTabloidModal />}

      <BriefcaseChainModal
        open={briefcaseChainOpen && showModal('briefcaseChain')}
        onComplete={() => setBriefcaseChainOpen(false)}
      />

      <RandomDateInviteModal
        open={dateInviteOpen && showModal('dateInvite')}
        invite={gameState.dateInvitePending}
        onAccept={handleDateInviteAccept}
        onReject={handleDateInviteReject}
      />

      <ScenarioPackYearlyCheckinsModal
        open={packCheckinsOpen && showModal('packCheckins')}
        checkins={packCheckinPackIds}
        onComplete={async () => {
          setPackCheckinsOpen(false);
          modalBlockRef.current = false;

          // Mark check-ins as shown for this year
          updateState(prev => ({
            yearFlags: {
              ...prev.yearFlags,
              packCheckinsShown: true
            }
          }));

          // Now load the yearly scenario
          await safeLoadScenarioForAgeOnce(currentYear, 'packCheckins');

          // Capture checkpoint after check-ins complete
          captureYearCheckpoint({ kind: "yearStart", replaceExisting: true });
          }}
      />

      <ReflectiveMomentModal
        open={reflectiveMomentOpen && showModal('reflectiveMoment')}
        onClose={() => setReflectiveMomentOpen(false)}
        setup={reflectiveMomentContent?.setup}
        observation={reflectiveMomentContent?.observation}
      />

      <ChapterBeatModal
        open={chapterBeatOpen && showModal('chapterBeat')}
        onClose={() => setChapterBeatOpen(false)}
        title={chapterBeatContent?.title}
        body={chapterBeatContent?.body}
        unlocks={chapterBeatContent?.unlocks || []}
      />

      <KidLogicPopupModal
        open={kidLogicPopupOpen && showModal('kidLogic')}
        popup={gameState.kidLogicPopupPending}
        childName={gameState.childName}
        disabled={kidLogicProcessing}
        onChoose={handleKidLogicChoice}
      />

      <MovieEasterEggPopupModal
        open={moviePopupOpen && showModal('moviePopup')}
        popup={gameState.moviePopupPending}
        onOk={() => resolveMoviePopup('ok')}
        onScold={() => resolveMoviePopup('scold')}
        onTalk={() => resolveMoviePopup('talk')}
      />

      <ChaosModeModal 
        open={chaosPopupOpen && showModal('chaos')}
        event={gameState.chaosPopupPending}
        onChoose={(choiceId) => {
          resolveChaosPopup(choiceId);
          setChaosPopupOpen(false);
        }}
      />

      <BaliCalmPopupModal
        open={baliCalmOpen && showModal('baliCalm')}
        popup={gameState.baliCalmPopupPending}
        onContinue={() => { resolveBaliCalmPopup(); setBaliCalmOpen(false); }}
      />

      <BaliActivityPopupModal
        open={baliActivityOpen && showModal('baliActivity')}
        popup={gameState.baliActivityPopupPending}
        childName={gameState.childName}
        onChoose={(choiceId) => { resolveBaliActivityPopup(choiceId); setBaliActivityOpen(false); }}
      />

      <InheritanceModal
        open={inheritanceOpen && showModal('inheritance')}
        onClose={() => setInheritanceOpen(false)}
      />

      <CuriosityPackModal
        open={curiosityOpen && showModal('curiosity')}
        questionId={gameState.curiosity?.questionId}
        age={gameState.curiosity?.agePending ?? gameState.currentYear}
        childName={gameState.childName}
        parentRole={gameState.parentRole}
        parentName={gameState.parentName}
        phase={gameState.curiosity?.phase}
        lastResult={gameState.curiosity?.lastResult}
        runSeed={gameState.runSeed}
        onPickAnswer={(pickedCorrect) => resolveCuriosityChoice(pickedCorrect ? 'pick_correct' : 'pick_incorrect')}
        onIgnore={() => resolveCuriosityChoice('ignore')}
        onScold={() => resolveCuriosityChoice('scold')}
        onPlayfulGuessEveryYear={() => {
          updateState(prev => ({
            settings: { ...(prev.settings || {}), curiosityAutoGuess: true }
          }));
          addLog('🧸 Curiosity questions will be auto-handled (no popups).');
          setCuriosityOpen(false);
          closeCuriosityModal();
        }}
        onContinue={() => {
          setCuriosityOpen(false);
          closeCuriosityModal();
        }}
      />

      <MilestonesInfoModal
        open={Boolean(gameState.milestones?.ui?.infoOpen) && showModal('milestonesInfo')}
        onClose={() => updateState(prev => ({ milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: false } } }))}
      />

      <FamilyBackgroundModal
        open={familyBackgroundOpen && showModal('familyBackground')}
        siblings={gameState.startingFamily?.siblings || []}
        niecesNephews={gameState.startingFamily?.niecesNephews || []}
        onClose={() => {
          setFamilyBackgroundOpen(false);
          updateState({ familyBackgroundPending: false, familyBackgroundShown: true });
        }}
      />

      <BudgetSnapMiniGame
        open={budgetSnapOpen && showModal('budgetSnap')}
        onComplete={(result) => {
          if (budgetSnapResolvedRef.current) return;
          budgetSnapResolvedRef.current = true;

          // Mark budget as done and close modal (effects already applied in BudgetSnapMiniGame)
          updateState(prev => ({
            lastBudgetSnapAge: prev.currentYear
          }));

          setBudgetSnapOpen(false);

          const ctx = budgetSnapContextRef.current;
          budgetSnapContextRef.current = 'manual';
          if (ctx !== 'ageUp') {
            return; // Opened from UI (Year Recap). Do NOT run age-up continuation chain.
          }

          // Continue year-end processing (with yields to prevent UI freeze)
          setTimeout(async () => {
            const currentState = gameState;
            const newAge = currentState.currentYear;
            
            resetYearActions();
            await new Promise(r => setTimeout(r, 0));
            
            processCareerYearEndTick(newAge);
            await new Promise(r => setTimeout(r, 0));
            
            processTitlesYearEndTick(newAge);
            updateState(prev => applyAdultCrimeYearEnd(prev));
            await new Promise(r => setTimeout(r, 0));
            
            applyStartOfAgeResources(newAge);
            updateState(prev => ({ partnerCounselingBuffer: Math.max(0, (prev.partnerCounselingBuffer || 0) - 1) }));
            await new Promise(r => setTimeout(r, 0));
            
            processBaliYearStart(newAge);
            maybeQueueBaliPopups(newAge);
            processPetYearEnd();
            processSocialMediaYearEnd(newAge);
            await new Promise(r => setTimeout(r, 0));

            try {
              const relTick = runRelationshipsAnnualTick(currentState, newAge);
              if (relTick?.updates) updateState(prev => ({ ...prev, ...relTick.updates }));
              (relTick?.logs || []).forEach(line => addLog(line));
              (relTick?.timelineEntries || []).forEach(entry => recordTimelineEntry(entry));
              await runAnnualPrompts(relTick?.prompts);
            } catch (e) {
              console.error('Relationship annual tick failed:', e);
            }
            await new Promise(r => setTimeout(r, 0));

            runSchoolMilestone(newAge);
            maybeQueueHomeworkPopup(newAge);
            maybeQueueChaosPopup(newAge);

            if ([0, 6, 12, 14, 18].includes(newAge) && (currentState.settings?.showChapterBeats ?? true)) {
              showChapterBeat(newAge);
            }

            const previewForCheckins = { ...currentState, currentYear: newAge, yearFlags: {} };
            const eligibleCheckins = getEligibleCheckinsForAge(newAge, previewForCheckins);
            if (eligibleCheckins.length > 0) {
              setPackCheckinPackIds(eligibleCheckins);
              setPackCheckinsOpen(true);
              modalBlockRef.current = true;
              setTimeout(() => { ageUpLockRef.current = false; setIsAgingUp(false); }, 500);
              return;
            }

            await safeLoadScenarioForAgeOnce(newAge, 'budgetSnap-continue');
            await new Promise(r => setTimeout(r, 0));
            
            processChildTraumaYearStartTick(newAge);
            maybeTriggerInheritanceEvent(currentState, updateState, newAge, newAge);
            captureYearCheckpoint({ age: newAge, kind: "yearStart", replaceExisting: true });

            setTimeout(() => {
              updateState(prev => ({
                ...prev,
                yearStartSnapshot: {
                  age: newAge,
                  money: prev.money,
                  stats: { ...(prev.stats || {}) },
                  teacherTrust: prev.teacherTrust,
                  peerCircle: prev.peerCircle,
                  love: prev.love,
                  stress: prev.stress,
                  actionPoints: prev.actionPoints,
                  maxFocusTokens: prev.maxFocusTokens
                }
              }));
            }, 0);

            setTimeout(() => { ageUpLockRef.current = false; setIsAgingUp(false); }, 500);
            checkReflectiveMoment('transition');
          }, 100);
        }}
      />

      <YearRecapModal
        open={yearRecapOpen && showModal('yearRecap')}
        recap={yearRecapData}
        onClose={() => setYearRecapOpen(false)}
        onHideForever={() => {
          updateState(prev => ({
            settings: { ...(prev.settings || {}), showYearRecapPopup: false }
          }));
          addLog('📉 Year Recap popups disabled (you can re-enable in Settings).');
          setYearRecapOpen(false);
        }}
        onViewAlbum={() => { setYearRecapOpen(false); navigate(createPageUrl('RareMomentsAlbum')); }}
        onShare={async () => {
          const text = `${yearRecapData?.headline || ''}\nMoney: ${Math.round(yearRecapData?.moneyDelta||0) >= 0 ? '+' : ''}${Math.round(yearRecapData?.moneyDelta||0)}\n#RaisingTomorrow`;
          try {
            if (navigator?.share) {
              await navigator.share({ text });
            } else if (navigator?.clipboard?.writeText) {
              await navigator.clipboard.writeText(text);
              try { toast.success('Copied recap to clipboard', { icon: '📋' }); } catch {}
            } else {
              toast.error('Sharing is not supported on this device.');
              return;
            }
          } catch (e) {
            console.warn('Share failed', e);
            toast.error('Share failed. Please try again.');
          }
        }}
        onQuickBudget={() => {
          // Close recap first (z-index / modal stacking safety)
          setYearRecapOpen(false);

          // Open budget planner in MANUAL mode (must NOT trigger age-up continuation)
          budgetSnapResolvedRef.current = false;
          budgetSnapContextRef.current = 'manual';
          setTimeout(() => setBudgetSnapOpen(true), 0);
        }}
      />

      <HomeworkPopupModal
        open={homeworkPopupOpen && showModal('homework')}
        popup={gameState.homeworkPopupPending}
        onChoose={resolveHomeworkPopup}
      />

      {childTraumaPopupOpen && activeTrauma && showModal('childTrauma') && (
        <ChildTraumaPopupModal
          open={true}
          trauma={activeTrauma}
          childName={gameState.childName}
          onClose={() => {
            closeAllModals(); // Close everything first
            resolveChildTraumaPopup(); // Then clear data
          }}
        />
      )}

      <StuffedAnimalModal
        open={stuffedAnimalOpen && showModal('stuffedAnimal')}
        onComplete={() => setStuffedAnimalOpen(false)}
      />

      <SchoolClubInviteModal
        open={clubInviteOpen && showModal('clubInvite')}
        invite={clubInvite}
        onClose={() => setClubInviteOpen(false)}
      />

      <SchoolExtracurricularModal
        open={!!schoolEventOpenId && showModal('schoolEvent')}
        eventId={schoolEventOpenId}
        onClose={() => setSchoolEventOpenId(null)}
      />

      <GoalSetupModal
        open={goalSetupOpen && showModal('goalSetup')}
        onClose={() => setGoalSetupOpen(false)}
        currentGoal={gameState.financialGoal}
        onSave={(goal) => {
          updateState({ financialGoal: goal, financialGoalDismissed: false });
        }}
      />

      <OutdoorAdventuresModal
        open={outdoorAdventuresOpen && showModal('outdoorAdventures')}
        onClose={() => setOutdoorAdventuresOpen(false)}
      />

      <PetsModal 
        open={petsModalOpen && showModal('pets')}
        onClose={() => setPetsModalOpen(false)}
      />

      <PTAHubModal 
        open={ptaModalOpen && showModal('pta')}
        onClose={() => setPtaModalOpen(false)}
      />

      {showModal('petEvent') && <PetEventModal />}
      <TitlesHubModal open={titlesHubOpen && showModal('titlesHub')} onClose={() => setTitlesHubOpen(false)} />

      <SiblingRivalryPopupModal
        open={siblingRivalryPopupOpen && showModal('siblingRivalry')}
        payload={Array.isArray(gameState.siblingRivalryPopupQueue) && gameState.siblingRivalryPopupQueue.length > 0 
          ? gameState.siblingRivalryPopupQueue[0] 
          : null}
        onChoose={(choiceKey) => {
          resolveSiblingRivalryPopup(choiceKey);
          setSiblingRivalryPopupOpen(false);
        }}
        onClose={() => setSiblingRivalryPopupOpen(false)}
      />

      <GoldenMomentModal
        open={goldenMomentOpen && showModal('goldenMoment')}
        moment={gameState.goldenMomentPending}
        onClose={handleGoldenMomentClose}
      />

      <YearHighlightsModal
        open={yearHighlightsOpen && showModal('yearHighlights')}
        highlights={gameState.yearHighlightsPending}
        onClose={() => {
          setYearHighlightsOpen(false);
          updateState({ yearHighlightsPending: null });
        }}
      />

      <CollectionsModal
        open={collectionsOpen && showModal('collections')}
        onClose={() => setCollectionsOpen(false)}
      />

      {emergencyOpen && activeEmergency && showModal('emergency') && (
        <EmergencyModal
          open={true}
          onClose={() => {
            closeAllModals();
            updateState(prev => ({ emergency: { ...(prev.emergency || {}), pending: null } }));
          }}
        />
      )}

      {naturalDisasterOpen && activeNaturalDisaster && (
        <NaturalDisasterModal
          open={true}
          onClose={() => {
            closeAllModals();
            updateState(prev => ({ naturalDisaster: { ...(prev.naturalDisaster || {}), pending: null } }));
          }}
        />
      )}
      
      <FaithDecisionModal
        open={faithDecisionOpen && showModal('faithDecision')}
        popup={gameState.faithPopupPending}
        onContinue={() => {
          resolveFaithPopup();
          setFaithDecisionOpen(false);
        }}
      />

      <PrisonVisitModal
        open={prisonVisitOpen && showModal('prisonVisit')}
        onClose={() => setPrisonVisitOpen(false)}
      />

      <PrisonHubModal
        open={prisonHubOpen && showModal('prisonHub')}
        onClose={() => setPrisonHubOpen(false)}
      />

      <AdultLifePopupModal
        open={adultLifePopupOpen && showModal('adultLife')}
        onOpenChange={(v) => setAdultLifePopupOpen(v)}
        popup={gameState.adultLifeMomentPopupPending}
        onChoose={(choiceId) => {
          resolveAdultLifeMomentPopup(choiceId);
          setAdultLifePopupOpen(false);
        }}
      />

      <AdultLifeModal
        open={adultLifeModalOpen && showModal('adultLife')}
        onOpenChange={setAdultLifeModalOpen}
        popup={gameState.adultChildPopupPending}
        onChoose={(choiceId) => {
          const res = resolveAdultChildPopup(choiceId);
          if (!res?.keepOpen) setAdultLifeModalOpen(false);
        }}
      />

      <LifeGoalMomentModal
        open={goalMomentOpen && showModal('goalMoment')}
        moment={gameState.goalMomentPending}
        onChoose={(choiceId) => {
          resolveGoalMoment(choiceId);
          setGoalMomentOpen(false);
        }}
      />

      <LifeGoalsSetupModal
        open={!!(gameState.lifeGoals?.setupPending || gameState.lifeGoals?.uiOpen) && showModal('lifeGoalsSetup')}
        initialSelectedIds={gameState.lifeGoals?.selectedIds || []}
        onClose={() => {
          updateState(prev => {
            const next = { ...prev };
            const lg0 = next.lifeGoals || {};
            next.lifeGoals = {
              ...lg0,
              selectedIds: [],
              setupPending: false,
              setupCompleted: true,
              uiOpen: false
            };

            // Assign age-0 milestones NOW (after goals closed)
            const packsOn = next.packs?.milestonesEnabled ?? true;
            const ms0 = next.milestones || {};
            const shown = { ...(ms0.milestoneShownAges || {}) };

            if (packsOn && !shown['0'] && !ms0.kidQuestActive && !ms0.adultQuestActive) {
              const picked = pickMilestoneQuests(next, 0);
              const baseline = {
                money: Number(next.money || 0),
                yearlyIncome: Number(next.playerCareer?.yearlyIncome || 0),
                jobLevelIndex: Number(next.playerCareer?.jobLevelIndex || 0),
                love: Number(next.love || 0),
                stress: Number(next.stress || 0),
                stats: { ...(next.stats || {}) }
              };
              next.milestones = {
                ...(ms0 || {}),
                kidQuestActive: picked.kid ? { ...picked.kid, baseline } : null,
                adultQuestActive: picked.adult ? { ...picked.adult, baseline } : null,
                baselines: baseline,
                pendingAssign: Boolean(picked.kid || picked.adult),
                milestoneShownAges: { ...shown, ['0']: true }
              };
            }

            return next;
          });
        }}
        onSave={(selectedIds) => {
          updateState(prev => {
            const next = { ...prev };
            const lg0 = next.lifeGoals || {};
            next.lifeGoals = {
              ...lg0,
              selectedIds: Array.isArray(selectedIds) ? selectedIds : [],
              setupPending: false,
              setupCompleted: true,
              uiOpen: false,
              progressById: lg0.progressById || {},
              completedIds: Array.isArray(lg0.completedIds) ? lg0.completedIds : []
            };

            // Unlock achievement for setting at least one goal
            if ((next.lifeGoals.selectedIds || []).length > 0) {
              const ids = Array.isArray(next.unlockedAchievementIds) ? next.unlockedAchievementIds : [];
              if (!ids.includes('goal_setter')) next.unlockedAchievementIds = [...ids, 'goal_setter'];
            }

            // Assign age-0 milestones NOW (after goals saved)
            const packsOn = next.packs?.milestonesEnabled ?? true;
            const ms0 = next.milestones || {};
            const shown = { ...(ms0.milestoneShownAges || {}) };

            if (packsOn && !shown['0'] && !ms0.kidQuestActive && !ms0.adultQuestActive) {
              const picked = pickMilestoneQuests(next, 0);
              const baseline = {
                money: Number(next.money || 0),
                yearlyIncome: Number(next.playerCareer?.yearlyIncome || 0),
                jobLevelIndex: Number(next.playerCareer?.jobLevelIndex || 0),
                love: Number(next.love || 0),
                stress: Number(next.stress || 0),
                stats: { ...(next.stats || {}) }
              };
              next.milestones = {
                ...(ms0 || {}),
                kidQuestActive: picked.kid ? { ...picked.kid, baseline } : null,
                adultQuestActive: picked.adult ? { ...picked.adult, baseline } : null,
                baselines: baseline,
                pendingAssign: Boolean(picked.kid || picked.adult),
                milestoneShownAges: { ...shown, ['0']: true }
              };
            }

            return next;
          });
        }}
      />

      <BirthIntroModal
        open={birthIntroOpen && showModal('birthIntro')}
        childName={gameState.childName}
        childAvatarEmoji={getAvatarEmojiForAge(0, gameState.childAvatarGender || 'boy', gameState.childAvatarToneIndex || 2)}
        childAvatarGender={gameState.childAvatarGender}
        childAvatarSpriteIndex={gameState.childAvatarSpriteIndex}
        partnerName={gameState.partnerName || null}
        partnerEmoji={gameState.partnerEmoji || null}
        partnerCareer={gameState.partnerCareer || null}
        parentName={gameState.parentName || null}
        onComplete={({ parentingStyleId, housingId, commuteId }) => {
          // CRASH-PROOF: Normalize and define STYLE_META at top scope (accessible in try AND catch)
          const safeHousingId = housingId || DEFAULT_LIVING_SETUP.housingId;
          const safeCommuteId = commuteId || DEFAULT_LIVING_SETUP.commuteId;
          const safeStyleId = String(parentingStyleId || 'unsure');
          const foodStrategyId = DEFAULT_LIVING_SETUP.foodStrategyId;
          
          const STYLE_META = {
            permissive: {
              label: "Permissive", emoji: "🪁",
              loveDelta: 4, stressDelta: -1,
              childDeltas: { confidence: 0.6, empathy: 0.2, discipline: -0.4, intelligence: 0.1 }
            },
            authoritarian: {
              label: "Authoritarian", emoji: "🧱",
              loveDelta: -1, stressDelta: 1,
              childDeltas: { discipline: 0.8, intelligence: 0.2, confidence: -0.5, empathy: -0.2 }
            },
            authoritative: {
              label: "Authoritative", emoji: "🌿",
              loveDelta: 3, stressDelta: 0,
              childDeltas: { discipline: 0.4, confidence: 0.4, empathy: 0.3, intelligence: 0.2 }
            },
            anxious: {
              label: "Anxious", emoji: "🚁",
              loveDelta: 2, stressDelta: 2,
              childDeltas: { intelligence: 0.5, discipline: 0.2, confidence: -0.3, empathy: 0.1 }
            },
            unsure: {
              label: "A bit of everything", emoji: "🎲",
              loveDelta: 0, stressDelta: 0,
              childDeltas: {}
            }
          };
          
          const meta = STYLE_META[safeStyleId] || STYLE_META.unsure;

          try {
            track("rt_onboarding_complete");

            // Apply effects ONLY when non-zero/non-empty
            if (meta.loveDelta) {
              applyLove(meta.loveDelta, "Parenting Style");
            }
            if (meta.stressDelta) {
              applyStress(meta.stressDelta, "Parenting Style");
            }
            if (meta.childDeltas && Object.keys(meta.childDeltas).length) {
              applyDeltas(meta.childDeltas, "Parenting Style");
            }

            // Record Timeline Entry
            const timelineDetail = safeStyleId === 'unsure'
              ? "You kept the default parenting system. No style modifiers applied."
              : `You chose to be a ${meta.label} parent. This shapes your early relationship and initial stats.`;

            recordTimelineEntry({
              kind: "system",
              title: `🍼 Parenting Style: ${meta.label}`,
              detail: timelineDetail,
              deltas: meta.childDeltas,
              loveDelta: meta.loveDelta,
              stressDelta: meta.stressDelta,
              moneyDelta: 0
            });

            // Update State + save living setup + trigger Life Goals setup
            updateState(prev => {
              // Compute living focus mod for immediate application at age 0
              const housing = getHousingById(safeHousingId);
              const commute = getCommuteById(safeCommuteId);
              const livingFocusMod = (housing?.focusMod || 0) + (commute?.focusMod || 0);
              
              // Apply living focus to age 0 max/action points
              const currentMax = Number(prev.maxFocusTokens || 5);
              const newMax = Math.max(1, currentMax + livingFocusMod);
              
              return { 
                ...prev, 
                birthIntroPending: false, 
                birthIntroCompleted: true, 
                parentingStyle: { id: safeStyleId, label: meta.label, emoji: meta.emoji },
                livingSetup: { housingId: safeHousingId, commuteId: safeCommuteId, foodStrategyId },
                maxFocusTokens: newMax,
                actionPoints: newMax,
                lifeGoals: { ...(prev.lifeGoals || {}), setupPending: true, setupCompleted: false, uiOpen: false }
              };
            });

            // Grant year-0 income + savings FIRST (wrapped in try/catch)
            setTimeout(() => {
              try {
                grantInitialYear0CashIfNeeded({ housingId: safeHousingId, commuteId: safeCommuteId });
              } catch (e) {
                console.error("[BirthIntro] Year-0 cash grant failed:", e);
              }
            }, 0);
            
            // THEN apply age-0 living costs (wrapped in try/catch)
            setTimeout(() => {
              try {
                applyLivingCostsForAge(0, { housingId: safeHousingId, commuteId: safeCommuteId });
              } catch (e) {
                console.error("[BirthIntro] Year-0 living costs failed:", e);
              }
            }, 50);

            // Close
            setBirthIntroOpen(false);
            
            // Zombie/Alien Apocalypse: Show Day 0 intro (wrapped in try/catch)
            setTimeout(() => {
              try {
                if ((gameState.specialStartId === 'zombie_apocalypse' || gameState.specialStartId === 'alien_invasion') && !gameState.apocalypseCampaign?.introShown) {
                  setZombieIntroOpen(true);
                }
              } catch (e) {
                console.error("[BirthIntro] Zombie intro trigger failed:", e);
              }
            }, 300);
          } catch (err) {
            // CRITICAL SAFETY: If anything fails, still mark birth intro as completed
            console.error("[BirthIntro onComplete] crashed:", err);

            updateState(prev => ({
              ...prev,
              birthIntroPending: false,
              birthIntroCompleted: true,
              parentingStyle: { id: safeStyleId, label: meta.label, emoji: meta.emoji },
              livingSetup: { housingId: safeHousingId, commuteId: safeCommuteId, foodStrategyId: DEFAULT_LIVING_SETUP.foodStrategyId },
              maxFocusTokens: Math.max(1, Number(prev.maxFocusTokens || 5)),
              actionPoints: Math.max(1, Number(prev.actionPoints || prev.maxFocusTokens || 5))
            }));

            setBirthIntroOpen(false);
          }
        }}
      />
      
      {/* Zombie Apocalypse Year-0 Intro */}
      <ChapterBeatModal
        open={zombieIntroOpen && showModal('zombieIntro')}
        onClose={() => {
          setZombieIntroOpen(false);
          updateState(prev => ({
            apocalypseCampaign: {
              ...(prev.apocalypseCampaign || {}),
              introShown: true
            }
          }));
          
          // Build escaped group list
          const escaped = [];
          if (gameState.householdType === 'two' && gameState.partnerName) {
            escaped.push(gameState.partnerName);
          }
          if (gameState.relationships?.byId?.my_mom?.alive) {
            escaped.push(gameState.relationships.byId.my_mom.name || 'your mom');
          }
          if (gameState.relationships?.byId?.my_dad?.alive) {
            escaped.push(gameState.relationships.byId.my_dad.name || 'your dad');
          }
          if (gameState.relationships?.byId?.my_best_friend?.alive) {
            escaped.push(gameState.relationships.byId.my_best_friend.name || 'your best friend');
          }
          
          const escapeGroup = escaped.length === 0 
            ? 'you escaped alone' 
            : escaped.length === 1 
              ? escaped[0] 
              : `${escaped.slice(0, -1).join(', ')}, and ${escaped[escaped.length - 1]}`;
          
          const childName = gameState.childName || 'your child';
          const intro = `Sirens. Then silence. Then the first screams.\n\nThe outbreak spreads faster than anyone admits. You bundle ${childName} close, grab what fits in one bag, and run.\nYou manage to escape with ${escapeGroup}.\n\nBy nightfall, the rules are simple: stay quiet, stay close, keep moving.\nSomewhere in the distance, a radio repeats the same message on a loop: 'If you can hear this, you are not alone.'`;
          
          recordTimelineEntry({
            kind: 'lore',
            title: '🧟 Year 0 — Day Zero',
            detail: intro,
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            age: 0
          });
        }}
        title="Year 0 — Day Zero"
        body={(() => {
          const escaped = [];
          if (gameState.householdType === 'two' && gameState.partnerName) {
            escaped.push(gameState.partnerName);
          }
          if (gameState.relationships?.byId?.my_mom?.alive) {
            escaped.push(gameState.relationships.byId.my_mom.name || 'your mom');
          }
          if (gameState.relationships?.byId?.my_dad?.alive) {
            escaped.push(gameState.relationships.byId.my_dad.name || 'your dad');
          }
          if (gameState.relationships?.byId?.my_best_friend?.alive) {
            escaped.push(gameState.relationships.byId.my_best_friend.name || 'your best friend');
          }
          
          const escapeGroup = escaped.length === 0 
            ? 'you escaped alone' 
            : escaped.length === 1 
              ? escaped[0] 
              : `${escaped.slice(0, -1).join(', ')}, and ${escaped[escaped.length - 1]}`;
          
          const childName = gameState.childName || 'your child';
          return `Sirens. Then silence. Then the first screams.\n\nThe outbreak spreads faster than anyone admits. You bundle ${childName} close, grab what fits in one bag, and run.\nYou manage to escape with ${escapeGroup}.\n\nBy nightfall, the rules are simple: stay quiet, stay close, keep moving.\nSomewhere in the distance, a radio repeats the same message on a loop: 'If you can hear this, you are not alone.'`;
        })()}
        unlocks={[]}
      />
      
      {/* Guidance Modal */}
      <GuidanceModal
        open={!!guidanceStepId && !onPopupsPage && showModal('guidance')}
        stepId={guidanceStepId}
        onContinue={handleGuidanceContinue}
        onCloseForever={handleGuidanceCloseForever}
        data={guidanceStepId === 'Y1_YEARLY_CHECKIN' ? guidanceYearlyData : {}}
      />
      
      <LocalCoopTurnModal
        open={localCoopTurnOpen}
        onClose={() => setLocalCoopTurnOpen(false)}
        toSide={localCoopTurnToSide}
        gameState={gameState}
      />
        </>
      )}

      {/* Loading overlay during Age Up */}
      {isAgingUp && !budgetSnapOpen && (
        <div className="fixed inset-0 bg-black/70 z-[150] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <div className="text-xl font-bold text-slate-800 mb-2">
              Advancing to Year {agingUpTargetYear ?? ((currentYear || 0) + 1)}...
            </div>
            <div className="text-sm text-slate-500">Processing year-end updates</div>
          </div>
        </div>
      )}

      {/* Debug overlay: popup frequency tracker */}
      {gameState.debugUI && (
        <div className="fixed top-24 right-3 z-[12000] w-72 pointer-events-auto">
          <div className="bg-slate-900/90 text-white rounded-xl shadow-xl border border-white/10 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold">🪟 Popup Tracker</div>
              <button
                onClick={() => setPopupLog([])}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="leading-relaxed">
              <div>
                <span className="font-semibold">Age {currentYear}</span>{' '}
                <span className="text-white/60">•</span>{' '}
                This age: <span className="font-semibold">{thisAgePopupStats.total}</span>{' '}
                <span className="text-white/60">(auto {thisAgePopupStats.auto}, user {thisAgePopupStats.user})</span>
              </div>
              <div className="text-white/70">
                Total tracked: <span className="font-semibold text-white">{popupLog.length}</span>
              </div>
            </div>

            <div className="text-[11px] text-white/75 leading-relaxed">
              Scenario flags: pending <span className="font-semibold text-white">{String(scenarioPending)}</span>, completedThisAge{' '}
              <span className="font-semibold text-white">{String(scenarioCompletedThisAge)}</span>, modalOpen{' '}
              <span className="font-semibold text-white">{String(scenarioModalOpen)}</span>
              {currentScenario?.id ? (
                <div className="mt-1">
                  Scenario: <span className="font-mono text-[10px]">{currentScenario.id}</span>
                </div>
              ) : (
                <div className="mt-1 text-amber-200">Scenario: (none loaded)</div>
              )}
            </div>

            <div className="border-t border-white/10 pt-2">
              <div className="text-white/70 text-[10px] uppercase tracking-wide mb-1">This age breakdown</div>
              {Object.keys(thisAgePopupStats.byType).length === 0 ? (
                <div className="text-white/60">No popups tracked yet for this age.</div>
              ) : (
                <div className="space-y-1">
                  {Object.entries(thisAgePopupStats.byType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-white/80">{type}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-2 text-[11px] text-white/70 leading-relaxed">
              Expectation check: by default the game shows <span className="font-semibold text-white">1 major Scenario</span> popup per age.
              Extra auto popups can occur at age 6 (interests) and sometimes via reflective moments.
            </div>
          </div>
        </div>
      )}
      </>
      );
      }