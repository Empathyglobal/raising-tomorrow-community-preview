import React, { useState } from 'react';

import { base44 } from "@/api/base44Client";
import { quantizeTenth } from '@/components/lib/numberPrecision';
import FunFactModal from "@/components/game/FunFactModal";

import { UI_EMOJI } from '@/components/game/uiEmojis';
import BuyDiamondsModal from '@/components/game/BuyDiamondsModal.jsx';
import FUN_FACT_SEED, { FUN_FACT_SEED as FUN_FACT_SEED_NAMED } from "@/components/game/funFactsSeed";
import { useGameState, ACTION_REGISTRY, SCHOOL_START_AGE, hasMinorChild } from "@/components/game/GameStateContext.jsx";
import { ensurePrisonState } from '@/components/game/prisonSystem';
import { isPersonDead } from '@/components/game/relationshipUtils';
import { safeFixed } from "@/components/utils/numberFormat";
import { audioManager } from '@/components/game/AudioManager';
import { pickHumor, appendHumor } from '@/components/game/humorUtils';
import CommitmentsModal from '@/components/game/CommitmentsModal';
import SchoolModal from '@/components/game/SchoolModal';
import DatingAppModal from '@/components/game/DatingAppModal';
import JokeBookModal from '@/components/game/JokeBookModal';
import StudyHubModal from '@/components/game/StudyHubModal';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import CollectionsModal from '@/components/game/CollectionsModal';
import ChildChatModal from '@/components/game/ChildChatModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { setActiveKidReducer } from '@/components/game/siblingRivalry/kidHelpers';
import DailyDilemmaModal from '@/components/game/DailyDilemmaModal';
import RecommendedPlanResultModal from '@/components/game/RecommendedPlanResultModal';
import { getTodayDateString, isYesterday, addCollectible, addYearEvent } from '@/components/game/retentionUtils';
import { getDailyDilemma, applyDailyDilemmaChoice } from '@/components/game/dailyDilemmaSystem';
import { computeRecommendedPlan, PLAN_ACTION_DEFS } from '@/components/game/recommendedPlanSystem';
import { createSeededRng } from '@/components/game/GameStateContext';
import { CHALLENGE_BY_ID } from '@/components/game/challenges/challengeCatalog';
import { getChallengeProgress } from '@/components/game/challenges/challengeEngine';

import BookstoreModal from '@/components/game/BookstoreModal';
import LibraryModal from '@/components/game/LibraryModal';
import { BOOKSTORE_CATALOG, BOOK_PURCHASE_FLAVOR } from '@/components/game/bookstoreData';
import { getBookLearningToastCopy, renderBookLearningToastDescription, formatBookBonusLine } from '@/components/game/bookLearningToasts';
import RoomModal from '@/components/game/RoomModal';
import VideosModal from '@/components/game/VideosModal';
import SideGigsModal from '@/components/game/SideGigsModal';
import CrimeHubModal from '@/components/game/CrimeHubModal';
import SalonSpaModal from '@/components/game/SalonSpaModal';
import LanguageLearningModal from '@/components/game/LanguageLearningModal';
import ImmigrationModal from '@/components/game/ImmigrationModal';
import AIActionModal from '@/components/game/AIActionModal';
import NaturePlayModal from '@/components/game/NaturePlayModal';
import PetsModal from '@/components/game/PetsModal';
import TeachCultureModal from '@/components/game/TeachCultureModal';
import BedtimeStoryModal from '@/components/game/BedtimeStoryModal';
import CopingModal from '@/components/game/CopingModal';
import CultureHeritageModal from '@/components/game/CultureHeritageModal';
import ParticipateModal from '@/components/game/ParticipateModal';
import FamilyPatternsOverviewModal from '@/components/game/FamilyPatternsOverviewModal';
import PhoneGameMomentModal, { buildPhoneGameMoment } from '@/components/game/PhoneGameMomentModal.jsx';
import AnxietyMomentModal, { buildAnxietyMoment } from '../AnxietyMomentModal.jsx';
import TrampolineMomentModal, { buildTrampolineMoment } from '../TrampolineMomentModal.jsx';
import EmotionMatchMiniGame from '@/components/minigames/EmotionMatchMiniGame';
import TraumaRehabModal from '@/components/game/TraumaRehabModal';
import ExtremeSportsModal from '@/components/game/ExtremeSportsModal';
import PoliticsModal from '@/components/game/PoliticsModal';
import TitlesHubModal from '@/components/game/titles/TitlesHubModal';
import CoverHeader from '@/components/game/CoverHeader';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';
import { STORYBOOK_ACTION_THUMBS } from '@/components/storybook/storybookAssets';
import { getUiThemeFromDom } from '@/components/lib/uiTheme';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DailyAdventuresHubModal from '@/components/game/DailyAdventuresHubModal.jsx';
import QualityOfLifeModal from '@/components/game/QualityOfLifeModal.jsx';
import QualityOfLifeHubDrawer from '@/components/game/QualityOfLifeHubDrawer.jsx';
import MusicModal from '@/components/game/MusicModal.jsx';
import LifeHubModal from '@/components/game/LifeHubModal';
import ShoppingHubModal from '@/components/game/ShoppingHubModal';
import ShopModal from '@/components/game/ShopModal';
import LegalHubModal from '@/components/game/LegalHubModal';
import HomeStuffModal from '@/components/game/HomeStuffModal';
import SpecialCareersHubModal from '@/components/game/SpecialCareersHubModal';
import ClubModal from '@/components/game/ClubModal';
import StyleChangeModal from '@/components/game/StyleChangeModal';

import { toast } from 'sonner';
import RecommendedPlanPreviewModal from '@/components/game/RecommendedPlanPreviewModal';

// Type badge component
function TypeBadge({ type, focusCost }) {
  const configs = {
    picker: { label: 'Picker', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    hub: { label: 'Hub', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    action: { label: 'Action', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    free: { label: 'Free', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' }
  };
  
  const config = configs[type] || configs.action;
  const showFocus = focusCost > 0;
  
  return (
    <div className="flex items-center gap-1">
      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
      {showFocus && (
        <span className="text-[10px] text-slate-400">
          {UI_EMOJI.focus} {focusCost}
        </span>
      )}
    </div>
  );
}

// Helper to determine action type
function getActionType(actionId) {
  const PICKER_IDS = new Set(['bond', 'play']);
  const HUB_IDS = new Set([
    'politics', 'commitments', 'familyPatterns', 'outings', 'career', 'lookForJob', 'education', 
    'business', 'crime', 'school', 'study', 'phone', 'doctor', 'support', 'faith',
    'parentStrategies', 'relationships', 'parentLeadership', 'pets', 'tutor', 
    'mindBody', 'homeschoolSupport', 'shopping', 'retirement', 'realEstate',
    'playdates', 'library', 'bookstore', 'room', 'studentLeadership', 'ptaIlluminati',
    'videos', 'socialMedia', 'languageLearning', 'moveAbroad', 'life', 'teachCulture',
    'participate', 'outdoorAdventures', 'naturePlay', 'extremeSports', 'date',
    'joke_book', 'salonSpa', 'aiLearn', 'aiGrow', 'titles', 'tell_bedtime_story',
    'culture_heritage', 'sideGigs', 'runForOffice', 'music', 'qualityOfLife', 'specialCareers'
  ]);
  const FREE_IDS = new Set(['funFact', 'phone_play']);
  
  if (PICKER_IDS.has(actionId)) return 'picker';
  if (HUB_IDS.has(actionId)) return 'hub';
  if (FREE_IDS.has(actionId)) return 'free';
  return 'action';
}

const EMPATHY_CARDS_TEXTS = [
  "You play the empathy cards together. You notice your child naming feelings with more confidence, and you understand them a little better too.",
  "You shuffle, draw, and talk. By the end, your child seems lighter—like they learned something important about themselves.",
  "A simple question from the cards opens a real conversation. You feel closer, and your child feels more understood.",
  "You laugh at a silly prompt, then pause at a deep one. The game turns into a moment of genuine self-reflection.",
  "The cards guide you both to slow down and listen. You walk away feeling more connected than before.",
  "Your child surprises you with insight. You realize how much is going on inside them—and they do too.",
  "You play a round, then another. Somewhere in the middle, the stress fades and curiosity takes over.",
  "The empathy cards make feelings feel safe to talk about. Your child practices naming emotions without judgment.",
  "You follow the cards into a thoughtful chat. You understand your child better, and they understand themselves better.",
  "A small game turns into a big moment. You feel proud of how your child can reflect and express what's inside."
];

export default function ActionsTab({ onOpenActionModal, onOpenLifeHub, onOpenScienceFair, onOpenSchoolEvent, onOpenOutdoorAdventures, initialCategory, onOpenPTA, onOpenTitles }) {
  const { gameState, getActionAvailability, consumeAction, applyStress, applyLove, applyDeltas, addLog, recordTimelineEntry, emitActionResult, updateState, applyMoneyDelta, seededPick, spendDiamonds, addDiamonds, getLocalAmount, hasAnyChild } = useGameState();
  const { actionPoints, maxFocusTokens, money, currentYear } = gameState;
  
  const hasChild = hasAnyChild(gameState);
  const minorChildPresent = hasMinorChild(gameState);

  const HIDE_IF_CHILDLESS = new Set([
    'bond',
    'play',
    'playdates',
    'outdoorAdventures',
    'outings',
    'tell_bedtime_story',
    'tutor',
    'school',
    'homeschoolSupport',
    'scienceFair',
    'teachCulture',
    'participate',
    'studentLeadership',
    'ptaIlluminati',
    'trampoline_park',
    'parentReset',
    'joke_book',
    'naturePlay',
    'pets',
    'homeschoolAcademic',
    'homeschoolStructure',
    'homeschoolEmpathy',
    'homeschoolConfidence',
    'empathyCards',
    'artsShowcase',
    'ecoChallenge',
    'makerChallenge',
    'debateForum',
    'parentLeadership',
    'study',
    'library',
    'bookstore',
    'room',
    'videos',
    'aiLearn',
    'aiGrow',
    'culture_heritage'
  ]);
  const navigate = useNavigate();
  const [commitmentsModalOpen, setCommitmentsModalOpen] = React.useState(false);
  const [schoolModalOpen, setSchoolModalOpen] = React.useState(false);
  const [cultureModalOpen, setCultureModalOpen] = React.useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  // God Mode State
  const [godPromptOpen, setGodPromptOpen] = React.useState(false);
  const [godPrompt, setGodPrompt] = React.useState({ type: null, years: 1 });
  const [rewindYearsChoice, setRewindYearsChoice] = React.useState(1);

  const getGodCost = (type, years = 1) => {
    const y = Math.max(1, Number(years || 1));
    if (type === 'rewind') return 20 * y;
    if (type === 'stress') return 10;
    if (type === 'heal') return 15;
    return 20; // money/focus default
  };

   const openGodPrompt = (type, years = 1) => {
     if (type === 'stress' && Number(gameState.stress || 0) <= 0) {
       toast('Stress is already at 0.', { icon: '🧘' });
       return;
     }
     if (type === 'heal' && !gameState.childSickThisAge) {
       toast('No injury to heal this year.', { icon: '🩺' });
       return;
     }
      const diamonds = Number(gameState.diamonds || 0);
      const cost = getGodCost(type, years);
    if (diamonds < cost) {
      toast('Not enough diamonds', { icon: '💎' });
      setBuyDiamondsOpen(true);
      return;
    }
    setGodPrompt({ type, years });
    setGodPromptOpen(true);
  };

  const applyGodReward = async () => {
     const type = godPrompt.type;
     const years = Math.max(1, Number(godPrompt.years || 1));
     const cost = getGodCost(type, years);

     if (type === 'stress' && Number(gameState.stress || 0) <= 0) {
       toast('Stress is already at 0.', { icon: '🧘' });
       setGodPromptOpen(false);
       return;
     }
     if (type === 'heal' && !gameState.childSickThisAge) {
       toast('No injury to heal this year.', { icon: '🩺' });
       setGodPromptOpen(false);
       return;
     }

     if (!spendDiamonds(cost, `god_mode_${type}`)) {
      setBuyDiamondsOpen(true);
      return;
    }

    if (type === 'money') {
      applyMoneyDelta(1000000);
      addLog?.(`God Mode: +$1,000,000`, 'system');
      toast("God Mode: +$1,000,000", { icon: UI_EMOJI.moneyTxn });
      setGodPromptOpen(false);
      return;
    }

    if (type === 'focus') {
       updateState(prev => ({
         ...prev,
         actionPoints: (prev.actionPoints || 0) + 1
       }));
       addLog?.(`God Mode: +1 Focus`, 'system');
       toast("God Mode: +1 Focus", { icon: UI_EMOJI.focus });
       setGodPromptOpen(false);
       return;
     }

     if (type === 'stress') {
       applyStress(-10);
       addLog?.('God Mode: Calm Mind (Stress -10)', 'system');
       toast('God Mode: Stress -10', { icon: '🧘' });
       setGodPromptOpen(false);
       return;
     }

     if (type === 'heal') {
       updateState({ childSickThisAge: false, childSickNote: null });
       addLog?.('God Mode: Healed injury (cleared sick status)', 'system');
       toast('God Mode: Injury healed', { icon: '🩺' });
       setGodPromptOpen(false);
       return;
     }

     if (type === 'trauma') {
      // handled directly without dialog in button; keep here as safety
      setGodPromptOpen(false);
      return;
    }

    if (type === 'rewind') {
      const years = Math.max(1, Number(godPrompt.years || 1));

      // Use yearCheckpoints if possible. Find checkpoint for target age.
      updateState(prev => {
        const currentAge = prev.currentYear || 0;
        const targetAge = Math.max(0, currentAge - years);
        const cps = prev.yearCheckpoints || [];
        const match = cps.find(c => c.kind === 'yearStart' && c.age === targetAge) || cps.find(c => c.kind === 'yearStart' && c.age === currentAge) || cps[cps.length - 1];
        if (!match?.snapshot) return prev;

        // Restore snapshot but keep checkpoints array so future rewinds still possible.
        const keepDiamonds = Number(prev.diamonds || 0);
        const restored = { ...match.snapshot, yearCheckpoints: cps, currentYear: targetAge, diamonds: keepDiamonds };
        return restored;
      });

      addLog?.(`God Mode: Rewound ${years} year(s)`, 'system');
      toast(`God Mode: Rewound ${years} year(s)`, { icon: "⏪" });
      setGodPromptOpen(false);
      return;
    }

    setGodPromptOpen(false);
  };
  const [dateModalOpen, setDateModalOpen] = React.useState(false);
  const [jokeBookModalOpen, setJokeBookModalOpen] = React.useState(false);
  const [studyHubModalOpen, setStudyHubModalOpen] = React.useState(false);
  const [bookstoreModalOpen, setBookstoreModalOpen] = React.useState(false);
  const [libraryModalOpen, setLibraryModalOpen] = React.useState(false);
  const [roomModalOpen, setRoomModalOpen] = React.useState(false);
  const [videosModalOpen, setVideosModalOpen] = React.useState(false);
  const [sideGigsModalOpen, setSideGigsModalOpen] = React.useState(false);
  const [salonSpaModalOpen, setSalonSpaModalOpen] = React.useState(false);
  const [languageLearningModalOpen, setLanguageLearningModalOpen] = React.useState(false);
  const [crimeModalOpen, setCrimeModalOpen] = React.useState(false);
  const [moveAbroadModalOpen, setMoveAbroadModalOpen] = React.useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = React.useState(initialCategory || null);
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [aiMode, setAiMode] = React.useState('learn');
  const [naturePlayOpen, setNaturePlayOpen] = React.useState(false);
  const [petsModalOpen, setPetsModalOpen] = React.useState(false);
  const [teachCultureModalOpen, setTeachCultureModalOpen] = React.useState(false);
  const [bedtimeStoryModalOpen, setBedtimeStoryModalOpen] = React.useState(false);
  const [copingModalOpen, setCopingModalOpen] = React.useState(false);
  const [traumaRehabModalOpen, setTraumaRehabModalOpen] = React.useState(false);
  const [buyDiamondsOpen, setBuyDiamondsOpen] = React.useState(false);
  const [traumaRehabMode, setTraumaRehabMode] = React.useState('normal');
  const [extremeSportsOpen, setExtremeSportsOpen] = React.useState(false);
  const [participateModalOpen, setParticipateModalOpen] = React.useState(false);
  const [politicsModalOpen, setPoliticsModalOpen] = React.useState(false);
  const [funFactModalOpen, setFunFactModalOpen] = React.useState(false);
  const [titlesModalOpen, setTitlesModalOpen] = React.useState(false);
  const [funFactSelected, setFunFactSelected] = React.useState(null);
  const [phoneModalOpen, setPhoneModalOpen] = React.useState(false);
  const [phoneMoment, setPhoneMoment] = React.useState(null);
  const [anxiousModalOpen, setAnxiousModalOpen] = React.useState(false);
  const [anxiousMoment, setAnxiousMoment] = React.useState(null);
  const [trampolineModalOpen, setTrampolineModalOpen] = React.useState(false);
  const [trampolineMoment, setTrampolineMoment] = React.useState(null);
  const [emotionMatchOpen, setEmotionMatchOpen] = React.useState(false);
  const [dailyAdventuresOpen, setDailyAdventuresOpen] = React.useState(false);
  const [childChooserOpen, setChildChooserOpen] = React.useState(false);
  const [dailyDilemmaOpen, setDailyDilemmaOpen] = React.useState(false);
  const [dailyDilemmaData, setDailyDilemmaData] = React.useState(null);
  const [planResultOpen, setPlanResultOpen] = React.useState(false);
  const [planResultData, setPlanResultData] = React.useState(null);
  const [planPreviewOpen, setPlanPreviewOpen] = React.useState(false);
  const [qualityOfLifeOpen, setQualityOfLifeOpen] = React.useState(false);
  const [qualityOfLifeInitialTab, setQualityOfLifeInitialTab] = React.useState('home');
  const [qualityOfLifeHubOpen, setQualityOfLifeHubOpen] = React.useState(false);
  const [pendingAfterDrawerActionId, setPendingAfterDrawerActionId] = React.useState(null);
  const [musicModalOpen, setMusicModalOpen] = React.useState(false);
  const [localLifeHubOpen, setLocalLifeHubOpen] = React.useState(false);
  const [localLifeHubTarget, setLocalLifeHubTarget] = React.useState(null);
  const [shoppingHubOpen, setShoppingHubOpen] = React.useState(false);
  const [shopModalState, setShopModalState] = React.useState({ open: false, initialView: 'shop', filterMode: null });
  const [realEstateOpen, setRealEstateOpen] = React.useState(false);
  const [specialCareersOpen, setSpecialCareersOpen] = React.useState(false);
  const [clubModalOpen, setClubModalOpen] = React.useState(false);
  const [homeStuffModalOpen, setHomeStuffModalOpen] = React.useState(false);
  const [drawerLaunchCtx, setDrawerLaunchCtx] = React.useState(null);
  const [portraitModStyleModalOpen, setPortraitModStyleModalOpen] = React.useState(false);

  // Helper: compute child age accounting for multi-child
  const getKidAge = (gs, kid) => {
    const cy = Number(gs?.currentYear ?? 0);
    const born = Number(kid?.createdAtYear ?? 0);
    return Math.max(0, cy - born);
  };

  // Helper: is a kid deceased?
  // Adult years death uses: kid.adultLife.alive=false + deathYear. Legacy/single-child death may live in relationships.byId.child.
  const isKidDeceased = (gs, kid) => {
    // If we don't have a kid entity (older saves), fall back to relationship child entry.
    if (!kid) return isPersonDead(gs?.relationships?.byId?.child);

    // Adult-life death flag (post-18 system)
    const life = kid.adultLife || {};
    if (life.alive === false) return true;
    if (Number.isFinite(Number(life.deathYear))) return true;

    // Generic death flags (defensive)
    if (kid.alive === false || kid.isDeceased === true) return true;
    if (Number.isFinite(Number(kid.deathYear))) return true;

    return false;
  };

  // Check if daily dilemma is available
  const todayStr = getTodayDateString();
  const dailyState = gameState.daily?.dilemma || {};
  const dailyAvailable = todayStr && dailyState.lastCompletedDate !== todayStr;

  // Compute recommended plan (only if minor child present)
  const recommendedPlan = React.useMemo(() => {
    if (!minorChildPresent) return null;
    try {
      return computeRecommendedPlan(gameState, getActionAvailability);
    } catch {
      return null;
    }
  }, [minorChildPresent, gameState, getActionAvailability]);

  React.useEffect(() => {
    // Reset per-age counter when age changes
    // Keep a per-age count for determinism variety as requested
    // Clear when the age changes compared to last tracked age
    const age = gameState.currentYear;
    if (gameState.lastPhonePlayAge !== age) {
      updateState(prev => ({ 
        ...prev, 
        counters: { ...(prev.counters || {}), phonePlayCountThisAge: 0, anxiousCountThisAge: 0, specialCareerApplyCountThisAge: 0 }, 
        lastPhonePlayAge: age,
        lastAnxiousAge: age
      }));
    }
  }, [gameState.currentYear]);

  React.useEffect(() => {
    if (!categoryDrawerOpen && pendingAfterDrawerActionId) {
      const id = pendingAfterDrawerActionId;
      setPendingAfterDrawerActionId(null);
      // allow Drawer overlay to fully disappear before opening ActionModal
      setTimeout(() => handleAction(id), 80);
    }
  }, [categoryDrawerOpen, pendingAfterDrawerActionId]);
  const [funFactEarned, setFunFactEarned] = React.useState(false);
  const [familyPatternsOpen, setFamilyPatternsOpen] = React.useState(false);

  // Safe LifeHub opener - fallback if prop is undefined
  const safeOpenLifeHub = (target) => {
    if (typeof onOpenLifeHub === 'function') {
      onOpenLifeHub(target);
      return;
    }
    setLocalLifeHubTarget(target);
    setLocalLifeHubOpen(true);
  };

  const maybeReturnToDrawer = (sourceActionId) => {
    if (!drawerLaunchCtx) return;
    if (drawerLaunchCtx.actionId !== sourceActionId) return;

    const cat = drawerLaunchCtx.categoryKey;
    setDrawerLaunchCtx(null);

    setTimeout(() => setCategoryDrawerOpen(cat), 50);
  };

  // Effect to handle prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setCategoryDrawerOpen(initialCategory);
    }
  }, [initialCategory]);

  const handleAction = (actionId) => {
    // FORCE ROUTING: planDate must open the dating modal FIRST (before any hub logic)
    if (actionId === 'planDate') {
      setDateModalOpen(true);
      return;
    }
    
    // Check availability first
    const avail = getActionAvailability(actionId);
    if (!avail.enabled) {
      toast(avail.reason || 'Not available yet.');
      return;
    }

    // Log for debugging silent failures
    console.log('[ActionsTab] handleAction called:', actionId);

    if (actionId === 'tell_bedtime_story') {
      setBedtimeStoryModalOpen(true);
      return;
    }

    if (actionId === 'culture_heritage') {
      setCultureModalOpen(true);
      return;
    }

    if (actionId === 'aiLearn') {
      setAiMode('learn');
      setAiModalOpen(true);
      return;
    }
    if (actionId === 'aiGrow') {
      setAiMode('grow');
      setAiModalOpen(true);
      return;
    }

    if (actionId === 'naturePlay') {
      setNaturePlayOpen(true);
      return;
    }

    if (actionId === 'funFact') {
      const seed = Array.isArray(FUN_FACT_SEED_NAMED) ? FUN_FACT_SEED_NAMED : FUN_FACT_SEED;
      const lastId = gameState.lastFunFactId || null;
      let fact = seed[Math.floor(Math.random() * seed.length)];
      if (seed.length > 1 && lastId && fact.id === lastId) {
        const idx = seed.findIndex(f => f.id === lastId);
        fact = seed[(idx + 1) % seed.length];
      }

      let earned = false;
      updateState(prev => {
        const year = Number(prev.currentYear || 0);
        const award = prev.lastFunFactBonusYear !== year;
        const nextStats = { ...(prev.stats || {}) };
        if (award) {
          nextStats.intelligence = (Number(nextStats.intelligence) || 0) + 0.1;
        }
        earned = award;
        return {
          ...prev,
          stats: nextStats,
          lastFunFactBonusYear: award ? year : prev.lastFunFactBonusYear,
          lastFunFactId: fact.id
        };
      });

      setFunFactSelected(fact);
      setFunFactEarned(earned);
      setFunFactModalOpen(true);
      toast(earned ? '+0.1 Intelligence (Yearly Fun Fact bonus)' : 'No bonus — already earned this year.', { icon: '💡' });
      return;
    }

    if (actionId === 'extremeSports') {
      setExtremeSportsOpen(true);
      return;
    }

    // Handle homeschool support actions
    if (actionId === 'empathyCards') {
      if (!consumeAction('empathyCards')) return;
      setEmotionMatchOpen(true);
      return;
    }
    else if (actionId === 'homeschoolAcademic') {
      if (!consumeAction('homeschoolAcademic')) return;
      applyDeltas({ intelligence: 1, empathy: 0, discipline: 0, confidence: 0 }, 'Homeschool: Academic Block');

      emitActionResult({
        actionId: 'study',
        title: 'Homeschool: Academics',
        body: 'You built real learning time.',
        deltas: { intelligence: 1, empathy: 0, discipline: 0, confidence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['study', 'homeschool'],
        meta: { emoji: '📚' }
      });
      return;
    }
    else if (actionId === 'homeschoolStructure') {
      if (!consumeAction('homeschoolStructure')) return;
      applyDeltas({ intelligence: 0, empathy: 0, discipline: 1, confidence: 0 }, 'Homeschool: Structure');

      emitActionResult({
        actionId: 'routine',
        title: 'Homeschool: Structure',
        body: 'Routines did their quiet magic.',
        deltas: { intelligence: 0, empathy: 0, discipline: 1, confidence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['study', 'homeschool'],
        meta: { emoji: '🧱' }
      });
      return;
    }
    else if (actionId === 'homeschoolEmpathy') {
      if (!consumeAction('homeschoolEmpathy')) return;
      applyDeltas({ intelligence: 0, empathy: 1, discipline: 0, confidence: 0 }, 'Homeschool: Social-Emotional');

      emitActionResult({
        actionId: 'study',
        title: 'Homeschool: Empathy',
        body: 'Feelings got named, not punished.',
        deltas: { intelligence: 0, empathy: 1, discipline: 0, confidence: 0 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['study', 'homeschool'],
        meta: { emoji: '💛' }
      });
      return;
    }
    else if (actionId === 'homeschoolConfidence') {
      if (!consumeAction('homeschoolConfidence')) return;
      applyDeltas({ intelligence: 0, empathy: 0, discipline: 0, confidence: 1 }, 'Homeschool: Confidence');

      emitActionResult({
        actionId: 'study',
        title: 'Homeschool: Confidence',
        body: 'Brave got practiced in small steps.',
        deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 1 },
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['study', 'homeschool'],
        meta: { emoji: '🌟' }
      });
      return;
    }
    
    if (actionId === 'routine') {
      safeOpenLifeHub('routine');
      return;
    }
    else if (actionId === 'coping') {
      setCopingModalOpen(true);
      return;
    }
    else if (actionId === 'parentReset') {
      // Apply Parent Reset effects immediately
      if (!consumeAction('parentReset')) return;
      applyStress(-3, "Parent Reset");
      applyLove(-0.2, "Parent Reset");

      emitActionResult({
        actionId: 'parentStrategy',
        title: 'Parent Reset',
        body: 'You take a breath and reset your nervous system. It helps.',
        deltas: {},
        loveDelta: -0.2,
        stressDelta: -3,
        moneyDelta: 0,
        focusDelta: -1,
        tags: ['care', 'strategy'],
        meta: { emoji: '🧘' }
      });
      return;
    }
    else if (actionId === 'commitments') {
      setQualityOfLifeOpen(true);
      setQualityOfLifeInitialTab('subscriptions');
      return;
    }
    else if (actionId === 'sideGigs') {
      setSideGigsModalOpen(true);
      return;
    }
    else if (actionId === 'crypto') {
      setCategoryDrawerOpen(null);
      navigate('/crypto');
      return;
    }
    else if (actionId === 'scienceFair') {
      if (onOpenScienceFair) onOpenScienceFair();
      return;
    }
    else if (['artsShowcase', 'ecoChallenge', 'makerChallenge', 'debateForum'].includes(actionId)) {
      if (onOpenSchoolEvent) onOpenSchoolEvent(actionId);
      return;
    }
    
    if (actionId === 'bond') onOpenActionModal('bond');
    else if (actionId === 'play') onOpenActionModal('play');
    else if (actionId === 'joke_book') setJokeBookModalOpen(true);
    else if (actionId === 'study') setStudyHubModalOpen(true);
    else if (actionId === 'date') {
      setCategoryDrawerOpen(null);
      setTimeout(() => setDateModalOpen(true), 0);
    }
    else if (actionId === 'parentStrategies') safeOpenLifeHub('parentStrategies');
    else if (actionId === 'salonSpa') setSalonSpaModalOpen(true);
    else if (actionId === 'support') safeOpenLifeHub('support');
    else if (actionId === 'outings') safeOpenLifeHub('outings');
    else if (actionId === 'relationships') {
      setCategoryDrawerOpen(null);
      navigate(createPageUrl('Game') + '?tab=relationships');
      return;
    }
    else if (actionId === 'parentLeadership') safeOpenLifeHub('parentLeadership');
    else if (actionId === 'pets') setPetsModalOpen(true);
    else if (actionId === 'tutor') safeOpenLifeHub('tutor');
    else if (actionId === 'mindBody') safeOpenLifeHub('mindBody');
    else if (actionId === 'homeschoolSupport') safeOpenLifeHub('homeschoolSupport');
    else if (actionId === 'doctor') safeOpenLifeHub('doctor');
    else if (actionId === 'crime') { setCrimeModalOpen(true); return; }
    else if (actionId === 'donation') safeOpenLifeHub('donation');
    else if (actionId === 'faith') safeOpenLifeHub('faith');
    else if (actionId === 'titles') { if (!consumeAction('titles')) return; if (onOpenTitles) onOpenTitles(); return; }
    else if (actionId === 'school') {
      audioManager.playSfx('success');
      setSchoolModalOpen(true);
    }
    else if (actionId === 'phone') safeOpenLifeHub('parentTools');
    else if (actionId === 'shopping') {
      setShoppingHubOpen(true);
      return;
    }
    else if (actionId === 'retirement') safeOpenLifeHub('retirement');
    else if (actionId === 'realEstate') { updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), housing: prev.currentYear } })); safeOpenLifeHub('realEstate'); }
    else if (actionId === 'business') { updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), business: prev.currentYear } })); safeOpenLifeHub('smallBusiness'); }
    else if (actionId === 'playdates') safeOpenLifeHub('playdates');
    else if (actionId === 'outdoorAdventures') {
      if (onOpenOutdoorAdventures) onOpenOutdoorAdventures();
      else safeOpenLifeHub('outdoorAdventures'); // Fallback
    }
    else if (actionId === 'library') setLibraryModalOpen(true);
    else if (actionId === 'bookstore') setBookstoreModalOpen(true);
    else if (actionId === 'room') setRoomModalOpen(true);
    else if (actionId === 'studentLeadership') safeOpenLifeHub('studentLeadership');
    else if (actionId === 'ptaIlluminati') { if (onOpenPTA) onOpenPTA(); return; }
    else if (actionId === 'videos') setVideosModalOpen(true);
    else if (actionId === 'phone_play') {
      // Self-Care: Play my phone (tiny stress relief, tiny discipline drop)
      const childName = gameState.childName || 'your child';
      const timesUsed = Number(gameState.counters?.phonePlayCountThisAge || 0);
      const seed = `${gameState.currentYear}:phone:${timesUsed}`;

      const moment = buildPhoneGameMoment({ seed, childName });
      setPhoneMoment({ childName, ...moment });
      setPhoneModalOpen(true);

      // Apply effects immediately
      applyStress(-0.1, 'Play my phone');
      applyDeltas({ discipline: -0.1 }, 'Play my phone');
      
      // Increment counter for determinism variety
      updateState(prev => ({
        counters: { ...(prev.counters || {}), phonePlayCountThisAge: (prev.counters?.phonePlayCountThisAge || 0) + 1 }
      }));

      // Timeline logging
      recordTimelineEntry({
        kind: 'care',
        title: 'Played on your phone',
        detail: `Stress -0.1. ${childName} Discipline -0.1.`,
        deltas: { discipline: -0.1 },
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: -0.1
      });

      // Also add one-line game result detail
      recordTimelineEntry({ kind: 'care', title: 'Phone Game Result', detail: moment.gameLine, deltas: null, moneyDelta: 0, loveDelta: 0, stressDelta: 0 });
      return;
    }
    else if (actionId === 'be_anxious') {
      // Self-Care: Be Anxious (purely wasteful)
      if (!consumeAction('be_anxious')) return;
      const timesUsed = Number(gameState.counters?.anxiousCountThisAge || 0);
      const seed = `${gameState.currentYear}:anxiety:${timesUsed}`;
      const moment = buildAnxietyMoment({ seed });
      setAnxiousMoment(moment);
      setAnxiousModalOpen(true);
      applyStress(5, 'Be Anxious');
      updateState(prev => ({
        counters: { ...(prev.counters || {}), anxiousCountThisAge: (prev.counters?.anxiousCountThisAge || 0) + 1 }
      }));
      recordTimelineEntry({
        kind: 'care',
        title: 'Spiraled in anxiety',
        detail: `${moment.trigger} Stress +5. Focus -1.`,
        deltas: null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 5
      });
      return;
    }
    else if (actionId === 'trampoline_park') {
      if (!consumeAction('trampoline_park')) return;
      const childName = gameState.childName || 'your child';
      const prevVisits = Number(gameState.relationships?.byId?.child?.trampolineParkVisits || 0);
      const n = prevVisits + 1;
      const round1 = (x) => Math.round(x * 10) / 10;
      const gain = Math.max(0.1, round1(1.0 - 0.1 * (n - 1)));

      applyDeltas({ confidence: gain }, 'Trampoline Park');

      updateState(prev => {
        const rel = prev.relationships || { roster: [], byId: {} };
        const byId = { ...(rel.byId || {}) };
        const child = { ...(byId.child || { id: 'child', name: childName }) };
        const visits = Number(child.trampolineParkVisits || 0) + 1;
        child.trampolineParkVisits = visits;
        child.flags = { ...(child.flags || {}) };
        if (visits >= 7) child.flags.trampolineFlipsForever = true;
        const roster = Array.isArray(rel.roster) ? [...rel.roster] : [];
        const idx = roster.findIndex(x => x.id === 'child');
        if (idx >= 0) roster[idx] = child; else roster.unshift(child);
        byId.child = child;
        return { ...prev, relationships: { ...rel, byId, roster } };
      });

      const moment = buildTrampolineMoment({ childName, n, gain: parseFloat(safeFixed(gain, 1)) });
      setTrampolineMoment(moment);
      setTrampolineModalOpen(true);

      recordTimelineEntry({
        kind: 'care',
        title: 'Trampoline Park',
        detail: `${childName} Confidence +${safeFixed(gain, 1)}. Focus -1. Visit #${n}. ${moment.trickLine || ''}`,
        deltas: { confidence: gain },
        moneyDelta: 0, loveDelta: 0, stressDelta: 0,
        meta: { trampoline: true, visit: n }
      });
      return;
    }
    else if (actionId === 'socialMedia') safeOpenLifeHub('socialMedia');
    else if (actionId === 'career') { updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), career: prev.currentYear } })); safeOpenLifeHub('career'); }
    else if (actionId === 'lookForJob') {
      updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), career: prev.currentYear } }));
      safeOpenLifeHub('lookForJob');
      return;
    }
    else if (actionId === 'music') { setMusicModalOpen(true); }
    else if (actionId === 'education') safeOpenLifeHub('education');
    else if (actionId === 'languageLearning') setLanguageLearningModalOpen(true);
    else if (actionId === 'moveAbroad') setMoveAbroadModalOpen(true);
    else if (actionId === 'life') safeOpenLifeHub(null);
    else if (actionId === 'teachCulture') setTeachCultureModalOpen(true);
    else if (actionId === 'participate') setParticipateModalOpen(true);
    else if (actionId === 'familyPatterns') setFamilyPatternsOpen(true);
    else if (actionId === 'runForOffice') {
      console.log('[ActionsTab] Opening Politics modal');
      updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), politics: prev.currentYear } }));
      setPoliticsModalOpen(true);
      return;
    }
    else if (actionId === 'qualityOfLife') {
      setQualityOfLifeHubOpen(true);
      return;
    }
    else if (actionId === 'specialCareers') {
      setSpecialCareersOpen(true);
      return;
    }
    else if (actionId === 'club') {
      setClubModalOpen(true);
      return;
    }
    else if (actionId === 'shop_housing') {
      updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), housing: prev.currentYear } }));
      safeOpenLifeHub('realEstate');
      return;
    }
    else if (actionId === 'shop_cars') {
      setShopModalState({ open: true, initialView: 'shop', filterMode: 'vehicles' });
      return;
    }
    else if (actionId === 'shop_mall') {
      setShopModalState({ open: true, initialView: 'shop', filterMode: 'mall' });
      return;
    }
    else if (actionId === 'shop_myStuff') {
      setHomeStuffModalOpen(true);
      return;
    }
    else { 
      console.error('[ActionsTab] No handler for action:', actionId);
      toast?.('Action not available', { icon: '⚠️' }); 
    }
    };

  
  const handleBookPurchase = (book) => {
    // Check if already owned
    const ownedBooks = gameState.inventory?.ownedBooks || {};
    if (ownedBooks[book.id]) {
      // Already owned - show toast
      toast(`✅ Already owned`, {
        icon: '✅',
        duration: 2500,
        position: 'top-center',
        description: `You already own "${book.title}".`
      });
      return;
    }

    // Execute purchase
    const cost = (typeof getLocalAmount === 'function') ? getLocalAmount(book.price) : book.price;
    applyMoneyDelta(-cost, "Book Purchase");

    // Apply effects
    const effects = book.effects || {};
    const statDeltas = {
      empathy: Number(effects.empathy || 0),
      intelligence: Number(effects.intelligence || 0),
      discipline: Number(effects.discipline || 0),
      confidence: Number(effects.confidence || 0),
    };

    applyDeltas(statDeltas, `📖 Read: "${book.title}"`);
    if (Number(effects.stress || 0) !== 0) {
      applyStress(Number(effects.stress || 0), `📖 Read: "${book.title}"`);
    }

    // Mark ownership
    const updatedOwnedBooks = {
      ...(gameState.inventory?.ownedBooks || {}),
      [book.id]: { purchasedAtAge: currentYear }
    };

    updateState({
      inventory: {
        ...gameState.inventory,
        ownedBooks: updatedOwnedBooks
      }
    });

    // Add timeline entry
    recordTimelineEntry({
      kind: 'finance',
      title: `Bought: ${book.title}`,
      detail: `${book.author} • ${formatBookBonusLine(effects)}`,
      deltas: statDeltas,
      moneyDelta: -cost,
      stressDelta: Number(effects.stress || 0),
      meta: { 
        bookId: book.id,
        title: book.title,
        author: book.author,
        priceBase: book.price,
        priceLocal: cost
      }
    });

    // Show result
    const copy = getBookLearningToastCopy(book.id, book.title, book);
    const bonusLine = `Bonus banked: ${formatBookBonusLine(effects)} • Cost: -$${cost}`;

    toast(`📖 ${book.title}`, {
      icon: copy.icon || '📖',
      duration: 7000,
      position: 'top-center',
      description: renderBookLearningToastDescription(copy, {
        childName: gameState?.childName || '',
        hasChild,
        bonusLine,
        sourceLine: '📖 Bookstore • One-time book bonus'
      })
    });

    addLog?.(`📖 Read: "${book.title}" — ${formatBookBonusLine(effects)}.`);
  };



  // Category buttons → Drawer (popup) lists.
  const actionCategories = [
    {
      key: 'care',
      label: 'Care',
      emoji: '🧡',
      description: 'Recover & Set Boundaries',
      groups: [
        { key: 'recovery', label: 'Stress & Recovery', actionIds: ['parentReset', 'coping', 'mindBody', 'salonSpa', 'videos', 'phone_play', 'be_anxious', 'club'] },
        { key: 'health', label: 'Health & Support', actionIds: ['doctor', 'support', 'faith', 'donation'] },
        { key: 'tools', label: 'Boundaries & Tools', actionIds: ['phone', 'parentStrategies', 'routine'] }
      ]
    },
    {
      key: 'qualityOfLife',
      label: 'Quality of Life',
      emoji: '✨',
      description: 'Housing, transport & subscriptions.',
      groups: []
    },
    {
      key: 'connect',
      label: 'Connect',
      emoji: '🤝',
      description: 'Kid time, romance, and community.',
      groups: [
        { key: 'kid_time', label: 'Kid Time', actionIds: ['bond', 'play', 'tell_bedtime_story', 'joke_book', 'empathyCards', 'trampoline_park'] },
        { key: 'romance', label: 'Dating', actionIds: ['date'] },
        { key: 'family_patterns', label: 'Family Patterns', actionIds: ['familyPatterns'] },
        { key: 'friends', label: 'Friends & Community', actionIds: ['playdates'] },
        { key: 'pets', label: 'Pets', actionIds: ['pets'] }
      ]
    },
    {
      key: 'school',
      label: 'School',
      emoji: '🏫',
      description: 'Academics, leadership, and school life.',
      disabled: (() => {
        if ((currentYear || 0) < SCHOOL_START_AGE) return true;
        const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
        const kidAges = kids.map(k => (currentYear || 0) - (k.createdAtYear || 0)).filter(a => Number.isFinite(a));
        const hasMinor = kidAges.length > 0 && kidAges.some(a => a < 18);
        return !hasMinor;
      })(),
      disabledReason: (() => {
        if ((currentYear || 0) < SCHOOL_START_AGE) return "School begins when your child is older.";
        return "Your children are adults now (18+).";
      })(),
      groups: [
        {
          key: 'school_activities',
          label: 'School & Activities',
          actionIds: [
            'school',
            'scienceFair',
            'artsShowcase',
            'ecoChallenge',
            'makerChallenge',
            'debateForum',
            'studentLeadership',
            'ptaIlluminati',
            'parentLeadership'
          ]
        },
        {
          key: 'homeschool',
          label: 'Homeschool',
          actionIds: [
            'homeschoolSupport',
            'homeschoolAcademic',
            'homeschoolStructure',
            'homeschoolEmpathy',
            'homeschoolConfidence'
          ]
        }
      ]
    },
    {
      key: 'learn',
      label: 'Learn',
      emoji: '📘',
      description: 'Build Skills & Knowledge',
      groups: [
        { key: 'study', label: 'Study & Skills', actionIds: ['aiLearn', 'aiGrow', 'study', 'tutor', 'education', 'languageLearning', 'life'] },
        { key: 'books', label: 'Books', actionIds: ['library', 'bookstore'] }
      ]
    },
    {
      key: 'grow',
      label: 'Grow',
      emoji: '🌱',
      description: 'Skills and personal growth.',
      groups: [
        { key: 'skills', label: 'Skills & Connection', actionIds: ['funFact', 'titles'] },
        { key: 'thrills', label: 'Courage & Thrills', actionIds: ['extremeSports'] },
        { key: 'culture', label: 'Roots & Identity', actionIds: ['culture_heritage', 'participate', 'teachCulture'] }
      ]
    },
    {
      key: 'earn',
      label: 'Earn',
      emoji: '💰',
      description: 'Income, career, and money planning.',
      groups: [
        { key: 'creator_income', label: 'Creator Income', actionIds: ['socialMedia'] },
        { key: 'quick_money', label: 'Quick Money', actionIds: ['sideGigs', 'crime', 'crypto'] },
        { key: 'employment', label: 'Employment', actionIds: ['career', 'lookForJob'] },
        { key: 'special_careers', label: 'Special Careers', actionIds: ['specialCareers'] },
        { key: 'assets_planning', label: 'Assets & Planning', actionIds: ['realEstate', 'retirement'] }
      ]
    },
    {
      key: 'shopping',
      label: 'Shopping',
      emoji: '🛍️',
      description: 'Housing, cars, the mall, and your stuff.',
      groups: [
        { key: 'departments', label: 'Departments', actionIds: ['shop_housing', 'shop_cars', 'shop_mall', 'shop_myStuff'] }
      ]
    },
    {
      key: 'adventure',
      label: 'Adventure',
      emoji: '🧭',
      description: 'Outdoors, trips, and big moves.',
      groups: [
        { key: 'outdoor', label: 'Outdoor', actionIds: ['naturePlay', 'outdoorAdventures'] },
        { key: 'trips', label: 'Trips & Outings', actionIds: ['outings'] },
        { key: 'move', label: 'Travel & Move', actionIds: ['moveAbroad'] }
      ]
    },
  ];

  // Completeness audit (dev only)
  if (import.meta?.env?.DEV) {
    const registryIds = new Set(ACTION_REGISTRY.map(a => a.id));
    const menuIds = new Set([
      ...actionCategories.flatMap(c => (c.groups || []).flatMap(g => (g.actionIds || [])))
    ]);

    const SPECIAL_MENULESS = new Set(['qualityOfLife', 'commitments', 'music', 'runForOffice', 'business', 'room', 'relationships']);
    const missing = [...registryIds].filter(id => !menuIds.has(id) && !SPECIAL_MENULESS.has(id));
    const unknown = [...menuIds].filter(id => !registryIds.has(id));

    if (missing.length) console.warn('[ActionsTab] Missing ACTION_REGISTRY ids in menu:', missing);
    if (unknown.length) console.warn('[ActionsTab] Menu references unknown action ids:', unknown);
  }

  const selectedCategory = actionCategories.find(c => c.key === categoryDrawerOpen) || null;

const isStorybook = getUiThemeFromDom() === 'storybook';
const COVER_ID_MAP = {
  school: 'school',
  care: 'self_care',
  grow: 'play',
  learn: 'play',
  earn: 'work',
  connect: 'relationships',
  adventure: 'play'
};
const coverId = COVER_ID_MAP[selectedCategory?.key] || null;
const coverConfig = coverId ? ({ id: coverId, title: selectedCategory?.label }) : null;

  const groupsForSelectedCategory = (selectedCategory?.groups || [])
    .map(group => {
      const actions = (group.actionIds || [])
        .map((id) => {
          const action = ACTION_REGISTRY.find(a => a.id === id);
          const avail = getActionAvailability(id);
          if (!action) return null;
          return { ...action, avail };
        })
        .filter(Boolean)
        .filter(a => {
          if (hasChild) return true;

          // Explicit hide list
          if (HIDE_IF_CHILDLESS.has(a.id)) return false;

          // Also hide anything disabled ONLY because it requires a child
          const reason = String(a.avail?.reason || '');
          if (!a.avail?.enabled && reason.toLowerCase().includes('requires a child')) return false;

          return true;
        });

      return { ...group, actions };
    })
    .filter(g => (g.actions || []).length > 0);

  const handleDailyDilemmaChoice = React.useCallback((choiceId) => {
    if (!dailyDilemmaData) return;
    
    const rng = createSeededRng(`${gameState.runSeed}|dailyReward|${todayStr}`);
    const { nextState, result } = applyDailyDilemmaChoice(gameState, dailyDilemmaData.id, choiceId, rng);
    
    // Apply effects
    const { love, stress, ...stats } = result.effect;
    if (Object.keys(stats).length) applyDeltas(stats, 'Daily Dilemma');
    if (love) applyLove(love, 'Daily Dilemma');
    if (stress) applyStress(stress, 'Daily Dilemma');
    
    // Add collectible
    if (result.collectible) {
      updateState(prev => addCollectible(prev, result.collectible.type, result.collectible.item));
      toast(`Earned: ${result.collectible.item.name || result.collectible.item.text}`, { icon: '🎁' });
    }
    
    // Diamond bonus
    if (result.diamondBonus) {
      addDiamonds(result.diamondBonus, 'daily_dilemma');
    }
    
    // Update streak
    updateState(prev => {
      const d = prev.daily?.dilemma || {};
      const lastDate = d.lastCompletedDate;
      const wasYesterday = lastDate ? isYesterday(lastDate, todayStr) : false;
      const wasPaused = d.paused;
      
      let nextStreak = d.streakCount || 0;
      let nextPaused = false;
      
      if (wasYesterday || lastDate === todayStr) {
        // Continue streak
        if (lastDate !== todayStr) nextStreak += 1;
      } else if (!lastDate || wasPaused) {
        // Resume from pause or start new
        nextStreak += 1;
        nextPaused = false;
      } else {
        // Gap detected - pause (don't reset)
        nextPaused = true;
      }
      
      return {
        ...prev,
        daily: {
          ...prev.daily,
          dilemma: {
            lastCompletedDate: todayStr,
            streakCount: nextStreak,
            paused: nextPaused,
            lastShownDate: todayStr
          }
        }
      };
    });
    
    setDailyDilemmaOpen(false);
    setDailyDilemmaData(null);
  }, [dailyDilemmaData, gameState, todayStr, applyDeltas, applyLove, applyStress, updateState, addDiamonds]);

  const handleExecuteRecommendedPlan = React.useCallback(() => {
    if (!recommendedPlan) return;
    
    // Validate focus
    if (actionPoints < recommendedPlan.totalFocusCost) {
      toast.error('Not enough Focus for this plan');
      return;
    }
    
    // Note: Recommended Plan stub - currently uses hardcoded effects.
    // TODO: Wire to real action execution pipeline once action infrastructure is modular.
    // This is tracked as technical debt and will be addressed in a future refactor.
    
    updateState(prev => {
      if (prev.actionPoints < recommendedPlan.totalFocusCost) return prev;
      
      let next = { ...prev };
      const results = [];
      const totals = { love: 0, stress: 0, stats: {}, money: 0, focus: recommendedPlan.totalFocusCost };
      const collectibles = [];
      
      // Execute each action
      for (const actionId of recommendedPlan.actions) {
        const actionResult = executeActionInternal(next, actionId);
        if (actionResult) {
          next = actionResult.state;
          results.push(actionResult.summary);
          
          // Accumulate totals with quantization
          totals.love = quantizeTenth(totals.love + (actionResult.summary.loveDelta || 0));
          totals.stress = quantizeTenth(totals.stress + (actionResult.summary.stressDelta || 0));
          totals.money = quantizeTenth(totals.money + (actionResult.summary.moneyDelta || 0));
          
          Object.entries(actionResult.summary.deltas || {}).forEach(([k, v]) => {
            if (typeof v === "number" && Number.isFinite(v)) {
              totals.stats[k] = quantizeTenth((totals.stats[k] || 0) + v);
            }
          });
        }
        
        // Try golden moment for eligible actions
        const eligible = ['bond', 'play', 'tell_bedtime_story', 'outings', 'study', 'outdoorAdventures', 'naturePlay'];
        if (eligible.includes(actionId)) {
          import('@/components/game/goldenMomentsSystem').then(({ tryTriggerGoldenMoment }) => {
            const golden = tryTriggerGoldenMoment(next, actionId);
            if (golden) {
              updateState(prev2 => {
                const mp = prev2.metaProgress || { collections: {}, personalBests: {} };
                const col = mp.collections || {};
                return {
                  ...prev2,
                  metaProgress: {
                    ...mp,
                    collections: {
                      ...col,
                      goldenMoments: [...(col.goldenMoments || []), golden].slice(-100)
                    }
                  }
                };
              });
            }
          }).catch(() => {});
        }
      }
      
      // Deduct focus once
      next.actionPoints = Math.max(0, prev.actionPoints - recommendedPlan.totalFocusCost);
      
      // Show combined results
      setPlanResultData({ actions: results, totals, collectibles });
      setPlanResultOpen(true);
      
      return next;
    });
  }, [recommendedPlan, actionPoints, updateState]);

  // Helper to execute a single action and return state + summary
  const executeActionInternal = (state, actionId) => {
    const def = PLAN_ACTION_DEFS[actionId];
    if (!def) return null;

    const emoji = def.emoji;
    const title = def.title;
    const love = def.love || 0;
    const stress = def.stress || 0;
    const rawStats = def.deltas || {};
    
    // Filter to numeric only and quantize
    const numericDeltas = {};
    Object.entries(rawStats).forEach(([k, v]) => {
      if (typeof v === "number" && Number.isFinite(v)) {
        numericDeltas[k] = quantizeTenth(v);
      }
    });
    
    // Apply to state
    let next = { ...state };
    if (love) next.love = Math.max(0, Math.min(100, quantizeTenth((next.love || 0) + quantizeTenth(love))));
    if (stress) next.stress = Math.max(0, Math.min(100, quantizeTenth((next.stress || 0) + quantizeTenth(stress))));
    
    Object.entries(numericDeltas).forEach(([k, v]) => {
      if (next.stats?.[k] !== undefined) {
        next.stats[k] = Math.max(0, quantizeTenth((next.stats[k] || 0) + v));
      }
    });
    
    return {
      state: next,
      summary: {
        emoji: emoji,
        title: title,
        summary: `Applied ${title} effects`,
        loveDelta: quantizeTenth(love),
        stressDelta: quantizeTenth(stress),
        moneyDelta: 0,
        deltas: numericDeltas
      }
    };
  };

  return (
    <div className="h-full pb-24 pt-4">
      <div className="rt-container">
        <div className="space-y-4">
        {/* Header with Focus and Diamonds */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Actions</h2>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${actionPoints === 0 ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-700'}`}>
              {UI_EMOJI.focus} {actionPoints}/{maxFocusTokens}
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              💎 {Number(gameState.diamonds || 0)}
            </div>
          </div>
        </div>

        {/* Talk to Child (TOP POSITION) */}
         <div className="mb-6">
           {(() => {
             const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
             const isMulti = gameState.expansions?.siblingRivalry === true && kids.length > 1;
             const currentAge = Number(gameState.currentYear ?? 0);

             const livingKids = isMulti ? kids.filter(k => !isKidDeceased(gameState, k)) : kids;

             const eligibleKids = isMulti
               ? livingKids.filter(k => getKidAge(gameState, k) >= 3)
               : [];

             const primaryDead = !isMulti && isKidDeceased(gameState, kids[0]);
             const canTalk = isMulti ? eligibleKids.length > 0 : (currentAge >= 3 && !primaryDead);

             const disabledReason = (() => {
               if (isMulti) {
                 if (livingKids.length === 0) return "Your child has passed away.";
                 return "Your child is still learning how to talk. Unlocks at age 3.";
               }
               if (primaryDead) return "Your child has passed away.";
               return "Your child is still learning how to talk. Unlocks at age 3.";
             })();

             return (
               <button
                disabled={!canTalk}
                onClick={() => {
                  if (!canTalk) return;

                  // Prison check: block normal chat
                  const inPrison = ensurePrisonState(gameState.prison).active;
                  if (inPrison) {
                    toast.error("You can only see your child during the annual prison visit.");
                    return;
                  }

                  // Show daily dilemma first if available
                  if (dailyAvailable && todayStr) {
                    const dilemma = getDailyDilemma(todayStr, gameState.runSeed);
                    setDailyDilemmaData(dilemma);
                    setDailyDilemmaOpen(true);
                    return;
                  }

                  // Otherwise proceed to chat
                  if (isMulti && eligibleKids.length > 1) {
                    setChildChooserOpen(true);
                  } else if (isMulti && eligibleKids.length === 1) {
                    updateState(prev => setActiveKidReducer(prev, eligibleKids[0].id));
                    setChatOpen(true);
                  } else {
                    setChatOpen(true);
                  }
                }}
                 className={`w-full p-4 rounded-xl border transition-all relative ${
                   canTalk
                     ? 'border-slate-200 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg active:scale-[0.99]'
                     : 'border-slate-200 bg-slate-200 text-slate-500 cursor-not-allowed'
                 }`}
               >
                 {canTalk && dailyAvailable && (
                   <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                 )}
                 <div className="flex items-center justify-center gap-3">
                   <span className="text-2xl">💬</span>
                   <div className="font-semibold text-lg">
                     Talk to your child
                     {canTalk && dailyAvailable && <span className="text-xs ml-2 opacity-90">• New!</span>}
                   </div>
                 </div>
                 {!canTalk && <div className="mt-1 text-xs text-slate-500">{disabledReason}</div>}
               </button>
             );
           })()}
         </div>

        {/* Category buttons */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2">
            {/* Recommended Child Plan Tile */}
            {(() => {
              const canExecute = minorChildPresent && recommendedPlan && recommendedPlan.actions.length > 0;
              const hasEnoughFocus = recommendedPlan && actionPoints >= recommendedPlan.totalFocusCost;
              const isDisabled = !canExecute || (canExecute && !hasEnoughFocus);
              
              return (
                <button
                  onClick={() => {
                    if (!canExecute) return;
                    setPlanPreviewOpen(true);
                  }}
                  disabled={isDisabled}
                  className={`p-3 rounded-xl border transition-all ${
                    isDisabled
                      ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                      : canExecute && hasEnoughFocus
                        ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 hover:border-emerald-400 hover:shadow-md active:scale-[0.99]'
                        : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                  } ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none">✅</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-slate-800 text-sm">Recommended Child Plan</div>
                      <div className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-1">
                        {!minorChildPresent ? 'Requires a child under 18.' : !recommendedPlan ? 'No plan available right now.' : recommendedPlan.reasonLine}
                      </div>
                      {canExecute && (
                        <div className="text-[10px] text-slate-400 mt-1">
                          Costs: {UI_EMOJI.focus} {recommendedPlan.totalFocusCost} • {recommendedPlan.actions.length} actions
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })()}
            
            {actionCategories.map((cat) => {
              const allIds = (cat.groups || []).flatMap(g => g.actionIds || []);
              const visibleCount = allIds
                .map((id) => ACTION_REGISTRY.find(a => a.id === id))
                .filter(Boolean).length;

              // Special case: Quality of Life shows section count, not action count
              const displayCount = cat.key === 'qualityOfLife' ? '6 areas' : `${visibleCount} options`;

              return (
                <button
                  key={cat.key}
                  data-tour={`actions-category-${cat.key}`}
                  onClick={() => {
                    if (cat.disabled) {
                      toast(cat.disabledReason || "Not available yet.");
                      return;
                    }
                    if (cat.key === 'qualityOfLife') {
                      setQualityOfLifeHubOpen(true);
                      return;
                    }
                    setCategoryDrawerOpen(cat.key);
                  }}
                  className={`p-3 rounded-xl border transition-all ${
                    cat.disabled 
                      ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' 
                      : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.99]'} ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none">{cat.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-slate-800 text-sm">{cat.label}</div>
                      <div className="text-xs text-slate-500 leading-snug mt-0.5">{cat.description}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{displayCount}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* More to do */}
        <div className="mb-6">
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${getUiThemeFromDom() === 'storybook' ? 'SBHeaderTitle' : 'text-slate-400'}`}>More to do</h3>

          {/* Active challenges progress (inline, 2-3 max) */}
          {(() => {
            const activeChallenges = (gameState.challengeMeta?.activeIds || []).slice(0, 3);
            return activeChallenges.length > 0 && (
              <div className="mb-3 space-y-2">
                {activeChallenges.map(challengeId => {
                  const def = CHALLENGE_BY_ID[challengeId];
                  if (!def) return null;

                  const progress = getChallengeProgress(gameState, def);
                  const objectives = def.objectives || [];
                  const total = objectives.length;
                  const completed = progress.objectives.filter(o => o.done).length;

                  return (
                    <div key={challengeId} className="bg-indigo-50 rounded-lg p-2 border border-indigo-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-indigo-900">
                          {def.emoji} {def.title}
                        </div>
                        <div className="text-xs font-bold text-indigo-700">
                          {completed}/{total}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all"
                          style={{ width: `${progress.pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(createPageUrl('Challenges'))}
              className={`p-3 rounded-xl border transition-all border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.99] ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏁</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-slate-800 text-sm">Challenges</div>
                  <div className="text-xs text-slate-500 leading-snug mt-0.5">Activate quests and earn diamonds</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDailyAdventuresOpen(true)}
              className={`p-3 rounded-xl border transition-all border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.99] ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧭</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-slate-800 text-sm">Daily Adventures</div>
                  <div className="text-xs text-slate-500 leading-snug mt-0.5">Featured challenges + practice mode</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Collections */}
        <div className="mb-6">
          <button
            onClick={() => {
              updateState({ collectionsModalOpen: true });
            }}
            className={`w-full p-4 rounded-xl border transition-all border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.99] ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-800">Collections</div>
                <div className="text-xs text-slate-500">Kid quotes, stickers, and golden moments.</div>
              </div>
            </div>
          </button>
        </div>

        {/* God Mode (LAST POSITION) */}
        <div className="mb-6">
          <button
            onClick={() => setBuyDiamondsOpen(true)}
            className={`w-full p-4 rounded-xl border transition-all border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.99] ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">💎</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-800">God Mode</div>
                <div className="text-xs text-slate-500">Buy diamonds & spend them on boosts, rewinds, and healing.</div>
              </div>
            </div>
          </button>
        </div>
      </div>
      </div>

      {/* Drawer popup with actions */}
      <Drawer
        open={!!categoryDrawerOpen}
        onOpenChange={(open) => {
          if (!open) setCategoryDrawerOpen(null);
        }}
      >
        <DrawerContent className={`h-[85vh] overflow-hidden ${isStorybook ? 'rt-modal-sheet rt-popup--storybook rt-paper-elev' : ''}`}>
          <div className="px-0 sm:px-0 flex flex-col h-full overflow-hidden">
            {/* Header (fixed) */}
            <div className="shrink-0 px-4 pt-4">
              {isStorybook && selectedCategory && (
                <div className="px-1">
                  <CoverHeader cover={{ id: coverId, title: selectedCategory?.label }} heightClass="h-[150px] md:h-[180px]" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3 mt-3">
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span className="text-2xl">{selectedCategory?.emoji}</span>
                    <span>{selectedCategory?.label || 'Actions'}</span>
                  </div>
                  {selectedCategory?.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setCategoryDrawerOpen(null)}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Body (scroll) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', touchAction: 'pan-y' }}>
              <div className="space-y-2">
                {groupsForSelectedCategory.map((group) => {
                  const actions = group.actions || [];
                  if (actions.length === 0) return null;

                  return (
                    <div key={group.key} className="mb-4">
                      <div className={`text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2 ${getUiThemeFromDom() === 'storybook' ? 'SBSeparator' : ''}`}>
                        {group.label}
                      </div>

                      <div className="space-y-2">
                        {actions.map((action) => {
                          // Label overrides
                          let labelOverride = action.label;
                          if (action.id === 'videos') labelOverride = 'Videos (Binge / Learning Videos)';
                          if (action.id === 'education') labelOverride = 'Earn a Degree';
                          if (action.id === 'extremeSports') labelOverride = 'Extreme Sports';
                          if (action.id === 'phone_play') labelOverride = 'Phone Break';
                          if (action.id === 'be_anxious') labelOverride = 'Spiral';
                          if (action.id === 'runForOffice') labelOverride = 'Politics Hub';
                          if (action.id === 'commitments') labelOverride = 'Commitments Hub';
                          if (action.id === 'familyPatterns') labelOverride = 'Family Patterns Hub';
                          if (action.id === 'life') labelOverride = 'Life Hub';

                          const actionType = getActionType(action.id);

                          return (
                            <div key={action.id}>
                              <button
                                data-tour={`action-${action.id}`}
                                onClick={() => {
                                  if (!action?.id) {
                                    toast?.(`Action is missing ID`, { icon: '⚠️' });
                                    return;
                                  }

                                  setDrawerLaunchCtx({ categoryKey: categoryDrawerOpen, actionId: action.id });
                                  setPendingAfterDrawerActionId(action.id);
                                  setCategoryDrawerOpen(null);
                                }}
                                disabled={action.avail && action.avail.enabled === false}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  (action.avail && action.avail.enabled === false)
                                    ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                                    : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                                } ${getUiThemeFromDom() === 'storybook' ? 'SBPanel' : ''}`}
                              >
                                <div className="flex items-start gap-3">
                                  {isStorybook && STORYBOOK_ACTION_THUMBS[action.id] ? (
                                    <div className="w-[64px] h-[64px] shrink-0 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--sb-border)' }}>
                                      <SafeStorybookImage
                                        src={STORYBOOK_ACTION_THUMBS[action.id].src}
                                        alt=""
                                        className="w-full h-full"
                                        imgStyle={{ objectFit: 'cover', objectPosition: STORYBOOK_ACTION_THUMBS[action.id].objectPosition || 'center' }}
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-2xl">{action.emoji}</span>
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="font-medium text-slate-800 text-sm">{labelOverride}</div>
                                      {action.id === 'be_anxious' && (
                                        <div className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">Self-sabotage</div>
                                      )}
                                    </div>
                                    
                                    <TypeBadge type={actionType} focusCost={action.focusCost} />
                                    
                                    {/* Custom subtitles for specific actions */}
                                    {action.id === 'phone_play' && (
                                      <div className="text-xs text-slate-500 mt-1">A tiny stress break… that teaches your kid the worst lesson.</div>
                                    )}
                                    {action.id === 'be_anxious' && (
                                      <div className="text-xs text-slate-500 mt-1">A full-focus spiral. No solutions included.</div>
                                    )}
                                    {action.id === 'trampoline_park' && (
                                      <div className="text-xs text-slate-500 mt-1">One Focus. Big smiles. Small (but real) confidence gains over time.</div>
                                    )}
                                    {action.id === 'funFact' && (
                                      <div className="text-xs text-slate-500 mt-1">Get a laugh. +0.1 Intelligence once per year.</div>
                                    )}
                                  </div>
                                </div>
                              </button>

                              {!action.avail.enabled && (
                                <div className="text-[10px] text-slate-400 mt-1 ml-11">
                                  {action.avail.reason || "Unavailable right now"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {groupsForSelectedCategory.reduce((sum, g) => sum + (g.actions?.length || 0), 0) === 0 && (
                  <div className="text-sm text-slate-500 py-8 text-center">
                    No actions in this category.
                  </div>
                )}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

            <BuyDiamondsModal
        open={buyDiamondsOpen}
        onClose={() => setBuyDiamondsOpen(false)}
        onOpenTraumaRehab={() => { setTraumaRehabMode('god'); setTraumaRehabModalOpen(true); }}
      />

      <CommitmentsModal
        open={commitmentsModalOpen}
        onClose={() => setCommitmentsModalOpen(false)}
      />
      
      <SideGigsModal
        open={sideGigsModalOpen}
        onClose={() => setSideGigsModalOpen(false)}
      />
      
      <SchoolModal
        open={schoolModalOpen}
        onClose={() => setSchoolModalOpen(false)}
      />
      
      <DatingAppModal
        open={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
      />

      <SalonSpaModal
        open={salonSpaModalOpen}
        onClose={() => setSalonSpaModalOpen(false)}
      />

      <JokeBookModal
        open={jokeBookModalOpen}
        onClose={() => setJokeBookModalOpen(false)}
      />

      <FunFactModal
        open={funFactModalOpen}
        onClose={() => setFunFactModalOpen(false)}
        fact={funFactSelected}
        earnedBonus={funFactEarned}
      />

      <StudyHubModal
        open={studyHubModalOpen}
        onClose={() => setStudyHubModalOpen(false)}
      />

      <BookstoreModal
        open={bookstoreModalOpen}
        onClose={() => { setBookstoreModalOpen(false); maybeReturnToDrawer('bookstore'); }}
        onPurchase={handleBookPurchase}
        ownedBooks={gameState.inventory?.ownedBooks || {}}
        money={money}
      />

      <LibraryModal open={libraryModalOpen} onClose={() => { setLibraryModalOpen(false); maybeReturnToDrawer('library'); }} />
      
      <RoomModal
        open={roomModalOpen}
        onClose={() => { setRoomModalOpen(false); maybeReturnToDrawer('room'); }}
      />
      
      <VideosModal
        open={videosModalOpen}
        onClose={() => setVideosModalOpen(false)}
      />
      
      <LanguageLearningModal
        open={languageLearningModalOpen}
        onClose={() => setLanguageLearningModalOpen(false)}
      />
      
      <ImmigrationModal
        open={moveAbroadModalOpen}
        onClose={() => setMoveAbroadModalOpen(false)}
        onNavigateToLifeHub={onOpenLifeHub}
      />
      
      <AIActionModal
        open={aiModalOpen}
        mode={aiMode}
        onClose={() => setAiModalOpen(false)}
      />
      
      <NaturePlayModal
        open={naturePlayOpen}
        onClose={() => setNaturePlayOpen(false)}
      />

      <PetsModal 
        open={petsModalOpen}
        onClose={() => setPetsModalOpen(false)}
      />

      <TeachCultureModal
        open={teachCultureModalOpen}
        onClose={() => setTeachCultureModalOpen(false)}
      />
      
      <BedtimeStoryModal
        open={bedtimeStoryModalOpen}
        onClose={() => setBedtimeStoryModalOpen(false)}
      />
      
      <CopingModal
        open={copingModalOpen}
        onClose={() => setCopingModalOpen(false)}
      />

      <CultureHeritageModal
        open={cultureModalOpen}
        onClose={() => setCultureModalOpen(false)}
      />

      <ParticipateModal
        open={participateModalOpen}
        onClose={() => setParticipateModalOpen(false)}
      />

      <CrimeHubModal open={crimeModalOpen} onClose={() => setCrimeModalOpen(false)} />

      {/* Phone Game Moment Modal */}
      <PhoneGameMomentModal
        open={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        payload={phoneMoment}
      />

      {/* Anxiety Moment Modal */}
      <AnxietyMomentModal
        open={anxiousModalOpen}
        onClose={() => setAnxiousModalOpen(false)}
        payload={anxiousMoment}
      />

      {/* Trampoline Moment Modal */}
      <TrampolineMomentModal
        open={trampolineModalOpen}
        onClose={() => setTrampolineModalOpen(false)}
        payload={trampolineMoment}
      />

      <FamilyPatternsOverviewModal
        open={familyPatternsOpen}
        onClose={() => setFamilyPatternsOpen(false)}
      />

      <TraumaRehabModal
        open={traumaRehabModalOpen}
        onClose={() => setTraumaRehabModalOpen(false)}
        isFree={traumaRehabMode === 'god'}
        onConsumeDiamonds={() => spendDiamonds(20, 'god_mode_remove_trauma')}
      />

      <ExtremeSportsModal
        open={extremeSportsOpen}
        onClose={() => setExtremeSportsOpen(false)}
      />

      <PoliticsModal open={politicsModalOpen} onClose={() => setPoliticsModalOpen(false)} />

      <TitlesHubModal open={titlesModalOpen} onClose={() => setTitlesModalOpen(false)} />

      <DailyAdventuresHubModal open={dailyAdventuresOpen} onClose={() => setDailyAdventuresOpen(false)} />

      <QualityOfLifeHubDrawer
        open={qualityOfLifeHubOpen}
        onClose={() => setQualityOfLifeHubOpen(false)}
        onOpenSection={(section) => {
          setQualityOfLifeInitialTab(section);
          setQualityOfLifeOpen(true);
        }}
      />

      <QualityOfLifeModal 
        open={qualityOfLifeOpen} 
        onClose={() => {
          setQualityOfLifeOpen(false);
          setQualityOfLifeInitialTab('home');
        }} 
        initialTab={qualityOfLifeInitialTab}
      />

      <DailyDilemmaModal
        open={dailyDilemmaOpen}
        dilemma={dailyDilemmaData}
        streak={dailyState.streakCount || 0}
        paused={dailyState.paused}
        onChoose={handleDailyDilemmaChoice}
        onClose={() => {
          setDailyDilemmaOpen(false);
          setDailyDilemmaData(null);

          // After closing, proceed to chat
          const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
          const isMulti = gameState.expansions?.siblingRivalry === true && kids.length > 1;
          const currentAge = Number(gameState.currentYear ?? 0);
          const eligibleKids = isMulti ? kids.filter(k => getKidAge(gameState, k) >= 3 && !isKidDeceased(gameState, k)) : [];
          const primaryDead = !isMulti && isKidDeceased(gameState, kids[0]);

          if (isMulti && eligibleKids.length > 1) {
            setChildChooserOpen(true);
          } else if (isMulti && eligibleKids.length === 1) {
            updateState(prev => setActiveKidReducer(prev, eligibleKids[0].id));
            setChatOpen(true);
          } else if (currentAge >= 3 && !primaryDead) {
            setChatOpen(true);
          } else if (!isMulti && primaryDead) {
            toast.error("Your child has passed away.");
          }
        }}
      />

      <RecommendedPlanResultModal
        open={planResultOpen}
        results={planResultData}
        onClose={() => {
          setPlanResultOpen(false);
          setPlanResultData(null);
        }}
      />

      <CollectionsModal
        open={gameState.collectionsModalOpen}
        onClose={() => updateState({ collectionsModalOpen: false })}
      />

      <ChildChatModal open={chatOpen} onClose={() => setChatOpen(false)} />

      <MusicModal open={musicModalOpen} onClose={() => setMusicModalOpen(false)} />

      {/* Child Chooser Dialog */}
      <Dialog open={childChooserOpen} onOpenChange={setChildChooserOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Which child do you want to talk to?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {(gameState.kids || []).map(kid => {
              const kidAge = getKidAge(gameState, kid);
              const isDead = isKidDeceased(gameState, kid);
              const isEligible = kidAge >= 3 && !isDead;
              return (
                <button
                  key={kid.id}
                  disabled={!isEligible}
                  onClick={() => {
                    if (!isEligible) return;
                    updateState(prev => setActiveKidReducer(prev, kid.id));
                    setChildChooserOpen(false);
                    setChatOpen(true);
                  }}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    isEligible
                      ? 'border-slate-200 bg-white hover:bg-slate-50'
                      : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="font-medium text-slate-800">{kid.childSlice?.childName || 'Child'}</div>
                  <div className="text-xs text-slate-500">Age {kidAge}</div>
                  {isDead && <div className="text-xs text-rose-500 mt-1">Deceased</div>}
                  {!isDead && !isEligible && <div className="text-xs text-slate-400 mt-1">Too young to talk (unlocks at age 3)</div>}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Emotion Match Mini-game Modal */}
      <EmotionMatchMiniGame
        open={emotionMatchOpen}
        onClose={() => {
          setEmotionMatchOpen(false);
          // Auto-resolve as skipped
          applyDeltas({ empathy: 1 }, 'Emotion Match (Skipped)');
          emitActionResult({
            actionId: 'empathyCards',
            title: '🃏 Emotion Match (Skipped)',
            body: 'You practiced sorting through feelings.',
            deltas: { empathy: 1 },
            loveDelta: 0,
            stressDelta: 0,
            moneyDelta: 0,
            focusDelta: -1,
            tags: ['connection', 'sel', 'empathy'],
            meta: { emoji: '🃏', skipped: true }
          });
          toast('Emotion Match auto-resolved: +1 Empathy', { icon: '🃏' });
        }}
        onComplete={(result) => {
          const emp = Number(result?.effects?.empathy || 0);
          const str = Number(result?.effects?.stress || 0);
          if (emp) applyDeltas({ empathy: emp, intelligence: 0, discipline: 0, confidence: 0 }, 'Emotion Match');
          if (str) applyStress(str, 'Emotion Match');
          const body = `${result.rating} • Correct ${result.correct}/${result.total}\nEmpathy ${emp > 0 ? `+${emp}` : '+0'}${str ? ` • Stress ${str}` : ''}`;
          emitActionResult({
            actionId: 'empathyCards',
            title: '🃏 Emotion Match',
            body,
            deltas: { empathy: emp, intelligence: 0, discipline: 0, confidence: 0 },
            loveDelta: 0,
            stressDelta: str,
            moneyDelta: 0,
            focusDelta: -1,
            tags: ['connection', 'sel', 'empathy'],
            meta: { emoji: '🃏', rating: result.rating, correct: result.correct, total: result.total }
          });
          toast(`Empathy Cards complete: +${emp} Empathy${str ? `, ${str} Stress` : ''}`, { icon: '🃏' });
          setEmotionMatchOpen(false);
        }}
        rounds={3}
      />

      <LifeHubModal
        open={localLifeHubOpen}
        onClose={() => setLocalLifeHubOpen(false)}
        onOpenTimeline={() => {}}
        targetModal={localLifeHubTarget}
        onNavigateToTab={() => {}}
      />

      <ShoppingHubModal
        open={shoppingHubOpen}
        onClose={() => { setShoppingHubOpen(false); maybeReturnToDrawer('shopping'); }}
        onOpenShop={({ mode, filterMode }) => {
          if (mode === 'stuff') {
            setHomeStuffModalOpen(true);
            setShoppingHubOpen(false);
            return;
          }
          setShopModalState({ open: true, initialView: mode, filterMode });
          setShoppingHubOpen(false);
        }}
        onOpenHousing={() => {
          setShoppingHubOpen(false);
          safeOpenLifeHub('realEstate');
        }}
        onOpenMyHouse={() => {
          setShoppingHubOpen(false);
          setRoomModalOpen(true);
        }}
        onOpenStyleChange={() => {
          setPortraitModStyleModalOpen(true);
          setShoppingHubOpen(false);
        }}
      />

      <ShopModal
        open={shopModalState.open}
        onClose={() => setShopModalState({ open: false, initialView: 'shop', filterMode: null })}
        initialView={shopModalState.initialView}
        filterMode={shopModalState.filterMode}
        onOpenRoomDecor={() => setRoomModalOpen(true)}
      />

      <HomeStuffModal
        open={homeStuffModalOpen}
        onClose={() => setHomeStuffModalOpen(false)}
        onOpenRoom={() => { setHomeStuffModalOpen(false); setRoomModalOpen(true); }}
        onOpenHousing={() => { setHomeStuffModalOpen(false); safeOpenLifeHub('realEstate'); }}
      />
      
      {/* Real Estate Modal (for shop_housing action) */}
      {/* IMPORTANT: Ensure RealEstateModal is imported at top of file */}
      {/* For now, we assume LifeHub handles it via safeOpenLifeHub */}

      <SpecialCareersHubModal
        open={specialCareersOpen}
        onClose={() => setSpecialCareersOpen(false)}
        onOpenSystem={(systemId) => {
          if (systemId === 'socialMedia') { onOpenLifeHub('socialMedia'); return; }
          if (systemId === 'politics') { updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), politics: prev.currentYear } })); setPoliticsModalOpen(true); return; }
          if (systemId === 'crime') { setCrimeModalOpen(true); return; }
          if (systemId === 'music') { setMusicModalOpen(true); return; }
          if (systemId === 'business') {
            updateState(prev => ({ lastHubVisitYear: { ...(prev.lastHubVisitYear || {}), business: prev.currentYear } }));
            safeOpenLifeHub('smallBusiness');
            return;
          }
        }}
      />

      <ClubModal open={clubModalOpen} onClose={() => setClubModalOpen(false)} />

      {/* Portrait Mod Style Change Modal */}
      {(() => {
        const PortraitModStyleChangeModal = React.lazy(() => import('@/components/game/portraitMod/PortraitModStyleChangeModal'));
        return (
          <React.Suspense fallback={null}>
            <PortraitModStyleChangeModal 
              open={portraitModStyleModalOpen} 
              onClose={() => setPortraitModStyleModalOpen(false)} 
            />
          </React.Suspense>
        );
      })()}

      <RecommendedPlanPreviewModal
        open={planPreviewOpen}
        plan={recommendedPlan}
        actionPoints={actionPoints}
        onClose={() => setPlanPreviewOpen(false)}
        onConfirm={() => {
          setPlanPreviewOpen(false);
          handleExecuteRecommendedPlan();
        }}
      />

    </div>
  );
}