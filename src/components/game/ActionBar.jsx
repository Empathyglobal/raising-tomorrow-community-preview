import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, FALLBACK_HOOK_GENERIC } from '@/components/game/GameStateContext';
import { audioManager } from './AudioManager';
import { Button } from '@/components/ui/button';
import { ArrowUp, Heart, Compass, Gamepad2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '@/components/game/ConfirmProvider';

// HARD LOCK to prevent fast-tap double age-ups (synchronous, not state-based)
let ageUpLockRef = false;

export default function ActionBar({ onOpenActionModal, onOpenLifeHub, scenarioModalOpen, setScenarioModalOpen }) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { gameState, applyStartOfAgeResources, loadScenarioForAge, updateState } = useGameState();
  const { actionPoints, actionsUsed, scenarioPending, scenarioCompletedThisAge, currentScenarioHookId, finished, currentYear, endAge } = gameState;

  // Determine if a popup that blocks Age Up is open
  const isBlockingPopupOpen = 
    scenarioModalOpen ||
    Boolean(gameState.kidLogicPopupPending) ||
    Boolean(gameState.moviePopupPending) ||
    Boolean(gameState.dateInvitePending) ||
    Boolean(gameState.curiosity?.pending) ||
    // Check if phone decision is pending (Age 1 or Age 5/8/11 re-ask) - handled via confirm but maybe state flag?
    // Actually confirming via useConfirm is async and blocks UI via overlay, so it's fine.
    // We just need to check the state flags that render OTHER modals.
    // If a modal is open, we disable Age Up.
    Boolean(gameState.activeTravelQuirkTag); // Maybe? No that's state.

  const handleAgeUp = async () => {
    // GATE 1: Game finished
    if (finished) return;
    
    // GATE 2: Modal already open
    if (isBlockingPopupOpen) return;
    
    // GATE 3: Fast-tap lock
    if (ageUpLockRef) return;
    
    // SET LOCK
    ageUpLockRef = true;
    
    // GATE 4: Must complete current scenario before advancing
    if (scenarioPending && !scenarioCompletedThisAge) {
      audioManager.playSfx('click');
      
      // Ensure hook is selected
      if (!currentScenarioHookId) {
        await loadScenarioForAge(currentYear);
      }
      
      // Safety: If still no hook after load, force fallback
      if (!gameState.currentScenarioHookId && !gameState.currentScenario) {
        updateState({ 
          currentScenarioHookId: FALLBACK_HOOK_GENERIC.id 
        });
      }
      
      // Open scenario modal
      setScenarioModalOpen(true);
      
      // Unlock after modal render
      setTimeout(() => { ageUpLockRef = false; }, 50);
      return;
    }
    
    // ADVANCE TO NEXT AGE
    audioManager.playSfx('click');
    const newAge = currentYear + 1;
    
    // Check end condition
    if (newAge > endAge) {
      updateState({ finished: true });
      ageUpLockRef = false;
      navigate(createPageUrl('Outcome'));
      return;
    }

    // --- Phone Policy Gates ---
    let phoneOwned = gameState.phoneOwned;
    let phoneGivenAge = gameState.phoneGivenAge;
    let phoneEffectsStartAge = gameState.phoneEffectsStartAge;
    let phonePolicyChosen = gameState.phonePolicyChosen;
    let phoneLastAskAge = gameState.phoneLastAskAge;

    // A) Age 1 Decision
    if (newAge === 1 && !phonePolicyChosen) {
      const givePhone = await confirm({
        title: "Phone access?",
        description: `Do you give ${gameState.childName || 'your child'} a phone? It adds time for you, reduces stress, but changes development and enables Screen Time & Boundaries moments.`,
        confirmText: "Give the phone",
        cancelText: "Screen‑free",
      });

      phonePolicyChosen = true;
      phoneLastAskAge = newAge;

      if (givePhone) {
        phoneOwned = true;
        phoneGivenAge = newAge;
        phoneEffectsStartAge = newAge;
      } else {
        phoneOwned = false;
        phoneGivenAge = null;
        phoneEffectsStartAge = null;
      }
      
      // Update state immediately so applyStartOfAgeResources sees it
      updateState({ phoneOwned, phoneGivenAge, phoneEffectsStartAge, phonePolicyChosen, phoneLastAskAge });
    }
    // B) Ask Again Gates (5, 8, 11)
    else if (!phoneOwned && phonePolicyChosen && [5, 8, 11].includes(newAge) && phoneLastAskAge !== newAge) {
      const givePhone = await confirm({
        title: "They ask again",
        description: `${gameState.childName || 'Child'} asks for a phone again. Say yes to enable Screen Time & Boundaries moments.`,
        confirmText: "Give the phone",
        cancelText: "Not yet",
      });

      phoneLastAskAge = newAge;

      if (givePhone) {
        phoneOwned = true;
        phoneGivenAge = newAge;
        phoneEffectsStartAge = newAge;
        
        // Update state immediately
        updateState({ phoneOwned, phoneGivenAge, phoneEffectsStartAge, phoneLastAskAge });
      } else {
        updateState({ phoneLastAskAge });
      }
    }
    
    // Update age
    updateState({ 
      currentYear: newAge,
      lastChangeText: "",
      lastMilestoneText: "",
      lastEventSource: ""
    });
    
    // Apply resources and load scenario
    await applyStartOfAgeResources(newAge);
    await loadScenarioForAge(newAge);
    
    // Safety: If no scenario was loaded, force fallback
    if (!gameState.currentScenarioHookId && !gameState.currentScenario) {
      updateState({ 
        currentScenarioHookId: FALLBACK_HOOK_GENERIC.id 
      });
    }
    
    // Open scenario modal immediately
    setScenarioModalOpen(true);
    
    // Unlock after modal render
    setTimeout(() => { ageUpLockRef = false; }, 50);
  };

  const handleBond = () => {
    audioManager.playSfx('click');
    const child = gameState.relationships?.byId?.child;
    const met = child && ((child.createdAtAge ?? 0) <= (gameState.currentYear ?? 0));
    if (!met) {
      toast?.('Bonding unlocks after your child is born.');
      return;
    }
    onOpenActionModal('bond');
  };

  const handlePlay = () => {
    audioManager.playSfx('click');
    onOpenActionModal('play');
  };

  const handleLife = () => {
    audioManager.playSfx('click');
    onOpenLifeHub();
  };

  // Age Up is always enabled unless game is finished or a modal is blocking it.
  const canAgeUp = !finished && currentYear < endAge && !isBlockingPopupOpen;
  
  const canUseActions = !finished && !scenarioModalOpen && actionPoints > 0;
  const canStudy = !finished;

  // Hide completely when game is finished
  if (finished) {
    return null;
  }

  const handleStudy = () => {
    audioManager.playSfx('click');
    navigate(createPageUrl('StudyHub'));
  };

  return (
    <div 
      className="bg-white border-t border-slate-200 p-2"
      style={{ 
        paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 1rem))'
      }}
    >
      <div className="max-w-md mx-auto space-y-2">
        {/* Row 1: 4 Small Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!canStudy}
            onClick={handleStudy}
            className="flex-1 flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 border text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 disabled:opacity-40"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-medium">Study</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!canUseActions || actionsUsed.bond}
            onClick={handleBond}
            className={`flex-1 flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 border ${
              actionsUsed.bond ? 'opacity-40' : 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[10px] font-medium">Bond</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!canUseActions || actionsUsed.play}
            onClick={handlePlay}
            className={`flex-1 flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 border ${
              actionsUsed.play ? 'opacity-40' : 'text-violet-600 bg-violet-50 border-violet-200 hover:bg-violet-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[10px] font-medium">Play</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!canUseActions}
            onClick={handleLife}
            className="flex-1 flex flex-col items-center gap-0.5 h-auto py-1.5 px-2 border text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100 disabled:opacity-40"
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px] font-medium">Life</span>
          </Button>
        </div>

        {/* Row 2: Age Up Button */}
        <Button 
          data-tour="age-up"
          disabled={!canAgeUp}
          onClick={handleAgeUp}
          className="w-full h-auto py-2.5 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 disabled:opacity-50"
        >
          <ArrowUp className="w-5 h-5 mr-1" />
          Age Up
        </Button>
      </div>
    </div>
  );
}