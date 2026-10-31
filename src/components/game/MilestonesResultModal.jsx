import React from 'react';
import { Button } from '@/components/ui/button';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState } from '@/components/game/GameStateContext';
import { statToPoints } from '@/components/content/milestonesPack';

export default function MilestonesResultModal() {
  const { gameState, updateState } = useGameState();
  const ms = gameState.milestones || {};

  const otherOpen = Boolean(
    gameState.birthIntroPending ||
    (gameState.scenarioPending && !gameState.scenarioCompletedThisAge) ||
    gameState.actionResultPending ||
    gameState.royalPopupPending ||
    gameState.curiosity?.pending ||
    gameState.petEventPending ||
    gameState.homeworkPopupPending ||
    gameState.kidLogicPopupPending ||
    gameState.chaosPopupPending
  );

  // Defensive: derive active payload (never render modal without data)
  const activePayload = (ms.pendingResult && ms.pendingResultPayload) ? ms.pendingResultPayload : null;

  const open = Boolean((gameState.packs?.milestonesEnabled ?? true) && ms.pendingResult && activePayload && !otherOpen);

  const title = activePayload?.success ? '✅ Milestone Complete!' : '🫠 Milestone Missed';
  const msg = activePayload?.message || (activePayload?.success ? "They now walk into rooms like they pay rent." : "Not a failure. Just character-building DLC.");

  const onClose = () => {
    // Close immediately (prevents backdrop deadlock)
    updateState(prev => ({ milestones: { ...(prev.milestones||{}), pendingResult: false, pendingResultPayload: null } }));
  };

  // Safety: auto-recover if flag is true but payload is missing
  React.useEffect(() => {
    if (ms.pendingResult && !activePayload && !otherOpen) {
      console.warn('[MilestonesResult] Auto-recover: pendingResult=true but no payload, clearing');
      updateState(prev => ({ milestones: { ...(prev.milestones||{}), pendingResult: false, pendingResultPayload: null } }));
    }
  }, [ms.pendingResult, activePayload, otherOpen, updateState]);

  // Defensive early return (prevents backdrop-only render)
  if (!activePayload) return null;

  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title={title}
      subtitle={null}
      footer={(
        <div className="pb-[calc(12px+env(safe-area-inset-bottom))]">
          <Button className="w-full" onClick={onClose}>OK</Button>
        </div>
      )}
      maxWidth="max-w-md"
    >
      {activePayload && (
        <div className="text-xs text-slate-700 whitespace-pre-wrap">
          {msg}
        </div>
      )}
    </GameModalShell>
  );
}