import React from 'react';
import { Button } from '@/components/ui/button';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState } from '@/components/game/GameStateContext';
import { statToPoints } from '@/components/content/milestonesPack';
import { LIFE_GOALS_BY_ID, getAlignedGoalIdsForQuest } from '@/components/content/lifeGoalsPack';

export default function MilestonesAssignModal() {
  const { gameState, updateState } = useGameState();
  const packs = gameState.packs || {};
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

  const open = Boolean(packs.milestonesEnabled && ms.pendingAssign && !otherOpen);

  const kid = ms.kidQuestActive;
  const adult = ms.adultQuestActive;

  const goalIds = Array.isArray(gameState.lifeGoals?.selectedIds) ? gameState.lifeGoals.selectedIds : [];
  
  const kidAligned = Array.isArray(kid?.alignedGoalIds) ? kid.alignedGoalIds : getAlignedGoalIdsForQuest(kid, goalIds, 'kid');
  const adultAligned = Array.isArray(adult?.alignedGoalIds) ? adult.alignedGoalIds : getAlignedGoalIdsForQuest(adult, goalIds, 'adult');

  const onClose = () => updateState(prev => ({ milestones: { ...(prev.milestones||{}), pendingAssign: false } }));
  const onDisable = () => updateState(prev => ({ packs: { ...(prev.packs||{}), milestonesEnabled: false }, milestones: { ...(prev.milestones||{}), pendingAssign: false, kidQuestActive: null, adultQuestActive: null } }));
  const onEditGoals = () => updateState(prev => ({
    milestones: { ...(prev.milestones||{}), pendingAssign: false },
    lifeGoals: { ...(prev.lifeGoals||{}), uiOpen: true }
  }));

  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title="🎯 Milestones Unlocked"
      subtitle="Funny, viral goals to explore the world"
      footer={(
        <div className="pb-[calc(12px+env(safe-area-inset-bottom))]">
          <Button className="w-full" onClick={onClose}>OK / Start</Button>
          <button className="mt-2 w-full text-[11px] text-slate-500 underline" onClick={onDisable}>Turn off Milestones</button>
        </div>
      )}
      maxWidth="max-w-md"
    >
      {goalIds.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-slate-600">Goals selected</span>
          <button
            onClick={onEditGoals}
            className="text-xs text-indigo-600 underline hover:text-indigo-700"
          >
            Edit Life Goals
          </button>
        </div>
      )}
      <div className="space-y-3">
        {kid && (
          <div className="p-3 rounded-xl border bg-white border-slate-200">
            <div className="text-[11px] uppercase tracking-wide text-amber-600 font-semibold mb-1">Kid Quest</div>
            <div className="font-semibold text-sm">{kid.title}</div>
            <div className="text-xs text-slate-600 mt-1">{kid.body}</div>
            {kid.metric?.type === 'stat_threshold' && (
              <div className="text-xs text-slate-700 mt-2">Goal: {kid.metric.statKey} ≥ {statToPoints(kid.targetValue)} points by age {kid.deadlineChildAge}</div>
            )}
            {kid.metric?.type === 'stat_increase' && (
              <div className="text-xs text-slate-700 mt-2">Goal: +{kid.metric.increaseBy} {kid.metric.statKey} by age {kid.deadlineChildAge}</div>
            )}
            {goalIds.length > 0 && (
              <div className="mt-2">
                {kidAligned.length > 0 ? (
                  <div>
                    <div className="text-[11px] text-slate-600 mb-1">Aligned with your goals:</div>
                    <div className="flex flex-wrap gap-1">
                      {kidAligned.map(gid => {
                        const goal = LIFE_GOALS_BY_ID[gid];
                        return goal ? (
                          <span key={gid} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {goal.emoji} {goal.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic">Not aligned with your current goals.</div>
                )}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-2">Reward: {kid?.reward?.money?`$${(kid.reward.money).toLocaleString()} `:''}{typeof kid?.reward?.love==='number'?`• Love ${kid.reward.love>0?'+':''}${kid.reward.love} `:''}{typeof kid?.reward?.stress==='number'?`• Stress ${kid.reward.stress} `:''}{kid?.reward?.stats?`• Stats ${Object.keys(kid.reward.stats).join(', ')}`:''}</div>
          </div>
        )}
        {adult && (
          <div className="p-3 rounded-xl border bg-white border-slate-200">
            <div className="text-[11px] uppercase tracking-wide text-indigo-600 font-semibold mb-1">Adult Quest</div>
            <div className="font-semibold text-sm">{adult.title}</div>
            <div className="text-xs text-slate-600 mt-1">{adult.body}</div>
            <div className="text-xs text-slate-700 mt-2">Deadline: by age {adult.deadlineAdultAge}</div>
            {goalIds.length > 0 && (
              <div className="mt-2">
                {adultAligned.length > 0 ? (
                  <div>
                    <div className="text-[11px] text-slate-600 mb-1">Aligned with your goals:</div>
                    <div className="flex flex-wrap gap-1">
                      {adultAligned.map(gid => {
                        const goal = LIFE_GOALS_BY_ID[gid];
                        return goal ? (
                          <span key={gid} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {goal.emoji} {goal.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 italic">Not aligned with your current goals.</div>
                )}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-2">Reward: {adult?.reward?.money?`$${(adult.reward.money).toLocaleString()} `:''}{typeof adult?.reward?.love==='number'?`• Love ${adult.reward.love>0?'+':''}${adult.reward.love} `:''}{typeof adult?.reward?.stress==='number'?`• Stress ${adult.reward.stress} `:''}{adult?.reward?.stats?`• Stats ${Object.keys(adult.reward.stats).join(', ')}`:''}</div>
          </div>
        )}
      </div>
    </GameModalShell>
  );
}