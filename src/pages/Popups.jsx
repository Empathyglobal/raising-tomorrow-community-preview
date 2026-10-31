import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useGameState } from '../components/game/GameStateContext';
import { audioManager } from '../components/game/AudioManager';
import { useConfirm } from '../components/game/ConfirmProvider';
import { toast } from 'sonner';
import { maybeTraumaFromScenario } from '../components/game/childTraumaSystem';
import { TEEN_COMING_OUT_SCENARIO_ID, applyTeenComingOutChoice } from '../components/game/teenComingOutScenario';
import { isTeenOneOffScenario, applyTeenOneOffChoice } from '../components/game/teenOneOffsPack';
import { isMiddleSchoolOneOffScenario, applyMiddleSchoolOneOffChoice } from '../components/game/middleSchoolOneOffsPack';
import { track } from '../components/lib/rtAnalytics';
import FaithDecisionModal from '../components/game/FaithDecisionModal';
import AdultLifePopupModal from '@/components/game/AdultLifePopupModal';

// Modals
import ScenarioModal from '../components/game/ScenarioModal';
import HomeworkPopupModal from '../components/game/HomeworkPopupModal';
import KidLogicPopupModal from '../components/game/KidLogicPopupModal';
import MovieEasterEggPopupModal from '../components/game/MovieEasterEggPopupModal';
import ChaosModeModal from '../components/game/ChaosModeModal';
import BaliCalmPopupModal from '../components/game/BaliCalmPopupModal';
import BaliActivityPopupModal from '../components/game/BaliActivityPopupModal';
import InheritanceModal from '../components/game/InheritanceModal';
import CuriosityPackModal from '../components/game/CuriosityPackModal';
import ChildTraumaPopupModal from '../components/game/ChildTraumaPopupModal';
import SiblingRivalryPopupModal from '../components/game/siblingRivalry/SiblingRivalryPopupModal';
import RandomDateInviteModal from '../components/game/RandomDateInviteModal';
import ScenarioPackYearlyCheckinsModal from '../components/game/ScenarioPackYearlyCheckinsModal';
import ReflectiveMomentModal from '../components/game/ReflectiveMomentModal';
import RoyalTabloidModal from '../components/game/RoyalTabloidModal';
import ActionResultSheet from '../components/game/ActionResultSheet';

// Background helper
function getPopupsBackgroundKey(gameState) {
  const age = Number(gameState?.currentYear || 0);
  if (age <= 2) return 'baby';
  if (age <= 5) return 'toddler';
  if (age <= 12) return 'kid';
  if (age <= 17) return 'teen';
  return 'adult';
}

function derivePopupsBackgroundContext(gameState) {
  const ageGroup = getPopupsBackgroundKey(gameState);
  const tags = [];
  return { ageGroup, tags };
}

const POPUPS_BG_GRADIENTS = {
  baby: 'from-blue-100 via-pink-100 to-purple-100',
  toddler: 'from-yellow-100 via-orange-100 to-amber-100',
  kid: 'from-green-100 via-teal-100 to-cyan-100',
  teen: 'from-indigo-100 via-purple-100 to-fuchsia-100',
  adult: 'from-slate-100 via-gray-100 to-zinc-100',
  default: 'from-amber-100 via-rose-100 to-orange-100'
};

function clamp(n, min, max) { return Math.max(min, Math.min(max, Number(n))); }

export default function Popups() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const processingChoiceRef = useRef(false);
  const scenarioResolvingRef = useRef(false);
  
  const { 
    gameState, 
    updateState,
    applyDeltas,
    applyLove,
    applyStress,
    spendMoney,
    loveDeltaFromChoice,
    stressDeltaFromChoice,
    addLog,
    addHistory,
    incrementCounter,
    getActiveChoice,
    recordTimelineEntry,
    recordChildTraumaEvent,
    resolveChildTraumaPopup,
    resolveMissedMilestone,
    emitActionResult,
    captureRewindSnapshot,
    resolveKidLogicPopup,
    resolveHomeworkPopup,
    resolveChaosPopup,
    resolveBaliCalmPopup,
    resolveBaliActivityPopup,
    resolveCuriosityChoice,
    closeCuriosityModal,
    getWisdomTier,
    isLensEquipped,
    resolveSiblingRivalryPopup,
    runMicroEventForAge,
    determineMemoryTone,
    generateMemoryText,
    tryGoldenMoment,
    applyTeacherTrust,
    applyPeerCircle,
    applyMoneyDelta,
    resolveFaithPopup,
    maybeQueueFaithPopup,
    resolveAdultLifeMomentPopup
  } = useGameState();

  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [processingChoice, setProcessingChoice] = useState(false);
  const [kidLogicPopupOpen, setKidLogicPopupOpen] = useState(false);
  const [homeworkPopupOpen, setHomeworkPopupOpen] = useState(false);
  const [moviePopupOpen, setMoviePopupOpen] = useState(false);
  const [chaosPopupOpen, setChaosPopupOpen] = useState(false);
  const [baliCalmOpen, setBaliCalmOpen] = useState(false);
  const [baliActivityOpen, setBaliActivityOpen] = useState(false);
  const [inheritanceOpen, setInheritanceOpen] = useState(false);
  const [curiosityOpen, setCuriosityOpen] = useState(false);
  const [childTraumaPopupOpen, setChildTraumaPopupOpen] = useState(false);
  const [siblingRivalryPopupOpen, setSiblingRivalryPopupOpen] = useState(false);
  const [dateInviteOpen, setDateInviteOpen] = useState(false);
  const [packCheckinsOpen, setPackCheckinsOpen] = useState(false);
  const [reflectiveMomentOpen, setReflectiveMomentOpen] = useState(false);
  const [kidLogicProcessing, setKidLogicProcessing] = useState(false);
  const [faithDecisionOpen, setFaithDecisionOpen] = useState(false);
  const [adultLifeMomentOpen, setAdultLifeMomentOpen] = useState(false);

  const backgroundContext = derivePopupsBackgroundContext(gameState);
  const bgGradient = POPUPS_BG_GRADIENTS[backgroundContext.ageGroup] || POPUPS_BG_GRADIENTS.default;

  // === MODAL SAFETY SYSTEM: Derive active payloads ===
  const activeTrauma = Array.isArray(gameState.childTraumaPopupQueue) ? gameState.childTraumaPopupQueue[0] : null;
  const activeMissedMilestone = gameState.milestoneMissedPending || (
    Array.isArray(gameState.missedMilestoneQueue) ? gameState.missedMilestoneQueue[0] : null
  );
  const activeScenario = gameState.scenarioPending && gameState.currentScenario ? gameState.currentScenario : null;
  const activeEmergency = gameState.emergency?.pending || null;
  
  const royalTabloidPending = Boolean(gameState.royalPopupPending);
  const currentYear = gameState.currentYear || 0;

  // Global modal close helper
  const closeAllModals = React.useCallback(() => {
    setChildTraumaPopupOpen(false);
    setScenarioModalOpen(false);
    setHomeworkPopupOpen(false);
    setKidLogicPopupOpen(false);
    setMoviePopupOpen(false);
    setChaosPopupOpen(false);
    setBaliCalmOpen(false);
    setBaliActivityOpen(false);
    setCuriosityOpen(false);
    setSiblingRivalryPopupOpen(false);
    setDateInviteOpen(false);
    setFaithDecisionOpen(false);
  }, []);

  // === AUTO-RECOVERY: Close modals when payload goes missing ===
  useEffect(() => {
    if (childTraumaPopupOpen && !activeTrauma) {
      console.warn('[Safety] childTraumaPopupOpen but no trauma, auto-closing');
      setChildTraumaPopupOpen(false);
      resolveChildTraumaPopup();
    }
    if (scenarioModalOpen && !activeScenario) {
      console.warn('[Safety] scenarioModalOpen but no scenario, auto-closing');
      setScenarioModalOpen(false);
    }
  }, [childTraumaPopupOpen, activeTrauma, scenarioModalOpen, activeScenario, resolveChildTraumaPopup]);

  // === WATCHDOG: Force-close all modals if open flag exists but no valid payload ===
  const anyBlockingModalShouldBeVisible =
    (childTraumaPopupOpen && !!activeTrauma) ||
    (scenarioModalOpen && !!activeScenario);

  useEffect(() => {
    const anyOpenFlag = childTraumaPopupOpen || scenarioModalOpen;

    if (anyOpenFlag && !anyBlockingModalShouldBeVisible) {
      console.warn('[Watchdog] Deadlock detected: open flag without payload. Force-closing.');
      closeAllModals();
      resolveChildTraumaPopup();
      updateState(prev => ({
        scenarioPending: prev.scenarioCompletedThisAge ? false : prev.scenarioPending
      }));
    }
  }, [childTraumaPopupOpen, scenarioModalOpen, anyBlockingModalShouldBeVisible, closeAllModals, resolveChildTraumaPopup, updateState]);

  // Auto-navigate back when all popups are cleared
  useEffect(() => {
    const hasAnyPopup = Boolean(
      gameState.scenarioPending ||
      gameState.homeworkPopupPending ||
      gameState.kidLogicPopupPending ||
      gameState.moviePopupPending ||
      gameState.chaosPopupPending ||
      gameState.baliCalmPopupPending ||
      gameState.baliActivityPopupPending ||
      gameState.inheritancePopupPending ||
      gameState.curiosity?.pending ||
      gameState.dateInvitePending ||
      gameState.faithPopupPending ||
      (Array.isArray(gameState.childTraumaPopupQueue) && gameState.childTraumaPopupQueue.length > 0) ||
      (gameState.expansions?.siblingRivalry && Array.isArray(gameState.siblingRivalryPopupQueue) && gameState.siblingRivalryPopupQueue.length > 0) ||
      gameState.royalPopupPending ||
      gameState.actionResultPending ||
      gameState.adultLifeMomentPopupPending
    );

    if (!hasAnyPopup) {
      const timer = setTimeout(() => {
        const returnView = gameState.ui?.popupsReturnView || 'Game';
        navigate(createPageUrl(returnView));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    gameState.scenarioPending,
    gameState.homeworkPopupPending,
    gameState.kidLogicPopupPending,
    gameState.moviePopupPending,
    gameState.chaosPopupPending,
    gameState.baliCalmPopupPending,
    gameState.baliActivityPopupPending,
    gameState.inheritancePopupPending,
    gameState.curiosity?.pending,
    gameState.dateInvitePending,
    gameState.childTraumaPopupQueue,
    gameState.siblingRivalryPopupQueue,
    gameState.royalPopupPending,
    gameState.actionResultPending,
    gameState.faithPopupPending,
    gameState.adultLifeMomentPopupPending,
    navigate
  ]);

  // Auto-open modals based on pending state
  useEffect(() => {
    if (gameState.scenarioPending && !scenarioModalOpen && !processingChoice) {
      setScenarioModalOpen(true);
    }
  }, [gameState.scenarioPending, scenarioModalOpen, processingChoice]);

  useEffect(() => {
    if (gameState.homeworkPopupPending && !homeworkPopupOpen) setHomeworkPopupOpen(true);
  }, [gameState.homeworkPopupPending, homeworkPopupOpen]);

  useEffect(() => {
    if (gameState.kidLogicPopupPending && !kidLogicPopupOpen) setKidLogicPopupOpen(true);
  }, [gameState.kidLogicPopupPending, kidLogicPopupOpen]);

  useEffect(() => {
    if (gameState.moviePopupPending && !moviePopupOpen) setMoviePopupOpen(true);
  }, [gameState.moviePopupPending, moviePopupOpen]);

  useEffect(() => {
    if (gameState.chaosPopupPending && !chaosPopupOpen) setChaosPopupOpen(true);
  }, [gameState.chaosPopupPending, chaosPopupOpen]);

  useEffect(() => {
    if (gameState.baliCalmPopupPending && !baliCalmOpen) setBaliCalmOpen(true);
  }, [gameState.baliCalmPopupPending, baliCalmOpen]);

  useEffect(() => {
    if (gameState.baliActivityPopupPending && !baliActivityOpen) setBaliActivityOpen(true);
  }, [gameState.baliActivityPopupPending, baliActivityOpen]);

  useEffect(() => {
    if (gameState.inheritancePopupPending && !inheritanceOpen) setInheritanceOpen(true);
  }, [gameState.inheritancePopupPending, inheritanceOpen]);

  useEffect(() => {
    if (gameState.curiosity?.pending && !curiosityOpen) setCuriosityOpen(true);
  }, [gameState.curiosity?.pending, curiosityOpen]);

  useEffect(() => {
    if (activeTrauma && !childTraumaPopupOpen) setChildTraumaPopupOpen(true);
  }, [activeTrauma, childTraumaPopupOpen]);

  useEffect(() => {
    const siblingEnabled = !!gameState.expansions?.siblingRivalry;
    const siblingHasQueued =
      siblingEnabled &&
      Array.isArray(gameState.siblingRivalryPopupQueue) &&
      gameState.siblingRivalryPopupQueue.length > 0;

    if (siblingHasQueued && !siblingRivalryPopupOpen) setSiblingRivalryPopupOpen(true);
    if (!siblingHasQueued && siblingRivalryPopupOpen) setSiblingRivalryPopupOpen(false);
  }, [gameState.expansions?.siblingRivalry, gameState.siblingRivalryPopupQueue, siblingRivalryPopupOpen]);

  useEffect(() => {
    if (gameState.dateInvitePending && !dateInviteOpen) setDateInviteOpen(true);
  }, [gameState.dateInvitePending, dateInviteOpen]);
  
  useEffect(() => {
    if (gameState.faithPopupPending && !faithDecisionOpen) setFaithDecisionOpen(true);
  }, [gameState.faithPopupPending, faithDecisionOpen]);

  useEffect(() => {
    if (gameState.adultLifeMomentPopupPending && !adultLifeMomentOpen) {
      setAdultLifeMomentOpen(true);
    }
  }, [gameState.adultLifeMomentPopupPending, adultLifeMomentOpen]);

  // Scenario choice handler
  const handleChoice = useCallback((choice) => {
    const active = getActiveChoice(choice);
    scenarioResolvingRef.current = true;
    setScenarioModalOpen(false);

    if (active.role === 'harm') {
      audioManager.playSfx('bad');
    } else {
      audioManager.playSfx('success');
    }

    finalizeScenarioChoice(choice);
  }, [getActiveChoice]);

  const finalizeScenarioChoice = async (choice) => {
    if (processingChoiceRef.current) return;
    processingChoiceRef.current = true;
    track("rt_choice_made");
    setProcessingChoice(true);

    try {
      const active = getActiveChoice(choice);
      const currentScenario = gameState.currentScenario;

      updateState(prev => ({
        ...prev,
        scenarioPending: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        currentScenarioResolvedChoice: active.letter,
        currentScenarioHookId: null
      }));

      captureRewindSnapshot();

      if (currentScenario?.id === TEEN_COMING_OUT_SCENARIO_ID) {
        updateState(prev => {
          const nextState = { ...prev };
          applyTeenComingOutChoice(nextState, currentScenario, choice);
          return nextState;
        });
      } else if (isTeenOneOffScenario(currentScenario)) {
        updateState(prev => {
          const nextState = { ...prev };
          applyTeenOneOffChoice(nextState, currentScenario, active.letter);
          return nextState;
        });
      } else if (isMiddleSchoolOneOffScenario(currentScenario)) {
        updateState(prev => {
          const nextState = { ...prev };
          applyMiddleSchoolOneOffChoice(nextState, currentScenario, active.id);
          return nextState;
        });
      }

      applyDeltas(active.deltas, `Age ${currentYear} Choice ${active.letter}`);

      const loveDelta = loveDeltaFromChoice(active);
      const stressDelta = stressDeltaFromChoice(active);

      if (loveDelta !== 0) {
        applyLove(loveDelta, "Yearly Choice");
        addLog(`❤️ Bond shifts: ${loveDelta > 0 ? '+' : ''}${loveDelta}.`);
      }

      if (stressDelta !== 0) {
        applyStress(stressDelta, "Yearly Choice");
        addLog(`😮‍💨 Stress shifts: ${stressDelta > 0 ? '+' : ''}${stressDelta}.`);
      }

      addLog(active.consequence);

      if (active.role === 'harm') {
        incrementCounter('harmCount');
      } else if (active.role === 'connect') {
        incrementCounter('supportiveCount');
      } else if (active.role === 'boundary') {
        incrementCounter('strictCount');
      } else if (active.role === 'teach') {
        incrementCounter('permissiveCount');
      }

      addHistory({
        age: currentYear,
        baseLetter: active.letter,
        usedTechniqueId: active.techId,
        shownText: active.text,
        deltas: active.deltas
      });

      if (gameState.settings?.showScenarioResultSheet ?? true) {
        const hookSummary = currentScenario?.hookText || "A moment arrives";
        emitActionResult({
          title: "✨ Outcome",
          body: `${hookSummary}\n\nYou chose: ${active.letter}`,
          deltas: active.deltas,
          loveDelta,
          stressDelta,
          moneyDelta: 0,
          focusDelta: 0,
          tags: ["major"],
          meta: { emoji: "✨", skipTimelineRecord: true }
        });
      }

      recordTimelineEntry({
        kind: "major",
        title: `✨ A Moment Arrives`,
        detail: `${currentScenario?.hookText || ""} (You chose ${active.letter}.)`,
        deltas: active.deltas,
        moneyDelta: 0,
        loveDelta,
        stressDelta,
        meta: { choiceRole: active.role, choiceLetter: active.letter }
      });

      try {
        const projectedState = {
          ...gameState,
          love: clamp(loveDelta + (gameState.love || 50), 0, 100),
          stress: clamp(stressDelta + (gameState.stress || 10), 0, 100),
        };
        const trauma = maybeTraumaFromScenario({
          scenario: currentScenario,
          activeChoice: active,
          gameState: projectedState,
          age: currentYear
        });
        if (trauma) {
          recordChildTraumaEvent(trauma, { log: true, toast: true, timeline: true });
        }
      } catch (e) {
        console.warn('Trauma check failed:', e);
      }

      setScenarioModalOpen(false);

      runMicroEventForAge(currentYear);

      setTimeout(() => {
        try {
          const tone = determineMemoryTone(active);
          const memText = generateMemoryText(currentYear, tone, active, active.techId);
          updateState(prev => ({ 
            memories: [...(Array.isArray(prev.memories) ? prev.memories : []), { age: currentYear, tone, text: memText }] 
          }));
          addLog(`📝 Memory formed: "${memText}"`);

          setTimeout(() => {
            try {
              tryGoldenMoment(currentYear);
            } catch (e) {
              console.warn('[Popups] tryGoldenMoment failed:', e);
            }
          }, 100);
        } catch (e) {
          console.error('[Popups] Memory creation failed:', e);
        }
      }, 150);
      
      // Queue faith decision popup at milestone ages
      maybeQueueFaithPopup(currentYear);

    } catch (err) {
      console.error('[Popups finalizeScenarioChoice] Error:', err);
      try { setScenarioModalOpen(false); } catch (e) {}
    } finally {
      setTimeout(() => {
        try { setProcessingChoice(false); } catch (e) {}
        try { if (processingChoiceRef?.current) processingChoiceRef.current = false; } catch (e) {}
        try { scenarioResolvingRef.current = false; } catch (e) {}
      }, 150);
    }
  };

  const handleKidLogicChoice = (choiceKey) => {
    if (kidLogicProcessing) return;
    setKidLogicProcessing(true);
    resolveKidLogicPopup(choiceKey);
    setKidLogicPopupOpen(false);
    setTimeout(() => setKidLogicProcessing(false), 250);
  };

  const resolveMoviePopup = (choiceId) => {
    const popup = gameState.moviePopupPending;
    if (!popup) {
      setMoviePopupOpen(false);
      return;
    }

    audioManager.playSfx('click');
    setMoviePopupOpen(false);
    updateState({ moviePopupPending: null });

    let deltas = null;
    let stressDelta = 0;
    let loveDelta = 0;

    if (choiceId === 'scold') {
      deltas = { discipline: 1 };
      stressDelta = 1;
      loveDelta = -0.2;
    } else if (choiceId === 'talk') {
      deltas = { discipline: 1 };
      stressDelta = 1;
      loveDelta = 0.2;
    }

    if (deltas) applyDeltas(deltas, 'Story Moment');
    if (stressDelta) applyStress(stressDelta, 'Story Moment');
    if (loveDelta) applyLove(loveDelta, 'Story Moment');

    addLog(`${popup.icon || '🎬'} ${popup.title || 'Story Moment'}`);
    recordTimelineEntry({
      age: currentYear,
      kind: 'easterEgg',
      title: `${popup.icon || '🎬'} ${popup.title || 'Story Moment'}`,
      detail: popup.body || '',
      deltas,
      moneyDelta: 0,
      loveDelta,
      stressDelta
    });
  };

  const handleDateInviteAccept = () => {
    const invite = gameState.dateInvitePending;
    if (!invite) return;

    updateState({ dateInvitePending: null, partnerMeter: Math.min(100, (gameState.partnerMeter || 50) + 10) });
    addLog(`💕 You said yes to ${invite.name}.`);
    recordTimelineEntry({
      kind: "system",
      title: "💌 Surprise invite",
      detail: `You met ${invite.name}.`,
      meta: { type: "dateInvite", accepted: true }
    });
    setDateInviteOpen(false);
  };

  const handleDateInviteReject = () => {
    const invite = gameState.dateInvitePending;
    updateState({ dateInvitePending: null, partnerMeter: Math.max(0, (gameState.partnerMeter || 50) - 5) });
    addLog(`📱 You declined ${invite?.name || 'them'}.`);
    setDateInviteOpen(false);
  };

  // Background rendering with image
  const SLEEPING_BABY_IMAGE = "/demo-art.svg";
  
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${SLEEPING_BABY_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/25 z-0" />
      
      {/* Popup modals render here (above overlay) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
      {scenarioModalOpen && activeScenario && (
        <ScenarioModal
          open={true}
          scenario={activeScenario}
          onClose={() => { try { toast.info('Choose an option to continue.'); } catch {} }}
          onChoose={handleChoice}
          disabled={processingChoice}
        />
      )}

      <HomeworkPopupModal
        open={homeworkPopupOpen}
        popup={gameState.homeworkPopupPending}
        onChoose={(choiceId) => {
          resolveHomeworkPopup(choiceId);
          setHomeworkPopupOpen(false);
        }}
      />

      <KidLogicPopupModal
        open={kidLogicPopupOpen}
        popup={gameState.kidLogicPopupPending}
        childName={gameState.childName}
        disabled={kidLogicProcessing}
        onChoose={handleKidLogicChoice}
      />

      <MovieEasterEggPopupModal
        open={moviePopupOpen}
        popup={gameState.moviePopupPending}
        onOk={() => resolveMoviePopup('ok')}
        onScold={() => resolveMoviePopup('scold')}
        onTalk={() => resolveMoviePopup('talk')}
      />

      <ChaosModeModal 
        open={chaosPopupOpen}
        event={gameState.chaosPopupPending}
        onChoose={(choiceId) => {
          resolveChaosPopup(choiceId);
          setChaosPopupOpen(false);
        }}
      />

      <BaliCalmPopupModal
        open={baliCalmOpen}
        popup={gameState.baliCalmPopupPending}
        onContinue={() => { 
          resolveBaliCalmPopup(); 
          setBaliCalmOpen(false); 
        }}
      />

      <BaliActivityPopupModal
        open={baliActivityOpen}
        popup={gameState.baliActivityPopupPending}
        childName={gameState.childName}
        onChoose={(choiceId) => { 
          resolveBaliActivityPopup(choiceId); 
          setBaliActivityOpen(false); 
        }}
      />

      <InheritanceModal
        open={inheritanceOpen}
        onClose={() => setInheritanceOpen(false)}
      />

      <CuriosityPackModal
        open={curiosityOpen}
        questionId={gameState.curiosity?.questionId}
        age={gameState.curiosity?.agePending ?? currentYear}
        childName={gameState.childName}
        parentRole={gameState.parentRole}
        parentName={gameState.parentName}
        phase={gameState.curiosity?.phase}
        lastResult={gameState.curiosity?.lastResult}
        runSeed={gameState.runSeed}
        onPickAnswer={(pickedCorrect) => resolveCuriosityChoice(pickedCorrect ? 'pick_correct' : 'pick_incorrect')}
        onIgnore={() => resolveCuriosityChoice('ignore')}
        onScold={() => resolveCuriosityChoice('scold')}
        onContinue={() => {
          setCuriosityOpen(false);
          closeCuriosityModal();
        }}
      />

      {childTraumaPopupOpen && activeTrauma && (
        <ChildTraumaPopupModal
          open={true}
          trauma={activeTrauma}
          childName={gameState.childName}
          onClose={() => {
            closeAllModals();
            resolveChildTraumaPopup();
          }}
        />
      )}

      <SiblingRivalryPopupModal
        open={siblingRivalryPopupOpen}
        payload={Array.isArray(gameState.siblingRivalryPopupQueue) && gameState.siblingRivalryPopupQueue.length > 0 
          ? gameState.siblingRivalryPopupQueue[0] 
          : null}
        onChoose={(choiceKey) => {
          resolveSiblingRivalryPopup(choiceKey);
          setSiblingRivalryPopupOpen(false);
        }}
        onClose={() => setSiblingRivalryPopupOpen(false)}
      />

      <RandomDateInviteModal
        open={dateInviteOpen}
        invite={gameState.dateInvitePending}
        onAccept={handleDateInviteAccept}
        onReject={handleDateInviteReject}
      />

      {royalTabloidPending && <RoyalTabloidModal />}

      <ActionResultSheet
        open={!!gameState.actionResultPending}
        onClose={() => updateState({ actionResultPending: null })}
        result={gameState.actionResultPending}
      />
      
      <FaithDecisionModal
        open={faithDecisionOpen}
        popup={gameState.faithPopupPending}
        onContinue={() => {
          resolveFaithPopup();
          setFaithDecisionOpen(false);
        }}
      />

      <AdultLifePopupModal
        open={adultLifeMomentOpen && !!gameState.adultLifeMomentPopupPending}
        popup={gameState.adultLifeMomentPopupPending}
        onChoose={(choiceId) => {
          resolveAdultLifeMomentPopup(choiceId);
          setAdultLifeMomentOpen(false);
        }}
      />
      </div>
    </div>
  );
}