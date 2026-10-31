import React from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { statToPoints } from '@/components/content/milestonesPack';
import { LIFE_GOALS_BY_ID } from '@/components/content/lifeGoalsPack';

export default function MilestonesInfoModal({ open, onClose }) {
  const { gameState, updateState } = useGameState();
  const ms = gameState.milestones || {};
  const packs = gameState.packs || {};
  const ui = ms.ui || { dashboardDismissed: false, infoOpen: false };

  const kid = ms.kidQuestActive;
  const adult = ms.adultQuestActive;

  const close = () => {
    if (onClose) onClose();
    else updateState(prev => ({ milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: false } } }));
  };

  const showOnDashboard = () => {
    updateState(prev => ({ milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), dashboardDismissed: false } } }));
  };

  const turnOffPack = () => {
    updateState(prev => ({
      packs: { ...(prev.packs||{}), milestonesEnabled: false },
      milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: false, dashboardDismissed: true } }
    }));
  };

  const rewardLine = (r) => {
    if (!r) return '—';
    const parts = [];
    if (typeof r.money === 'number') parts.push(`Money +$${formatMoney(r.money)}`);
    if (typeof r.love === 'number') parts.push(`Love ${r.love > 0 ? '+' : ''}${r.love}`);
    if (typeof r.stress === 'number') parts.push(`Stress ${r.stress > 0 ? '+' : ''}${r.stress}`);
    if (r.stats && Object.keys(r.stats).length) parts.push(`Stats ${Object.keys(r.stats).join(', ')}`);
    return parts.join(' • ') || '—';
  };

  return (
    <GameModalShell
      open={!!open}
      onClose={close}
      title="🎯 Milestones"
      subtitle={null}
      footer={(
        <div className="space-y-2 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <button
            onClick={close}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
          >
            Close
          </button>
          {ui.dashboardDismissed && (
            <button
              onClick={showOnDashboard}
              className="w-full px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-sm font-medium rounded-lg"
            >
              Show on Dashboard
            </button>
          )}
          <button
            onClick={turnOffPack}
            className="w-full px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg"
          >
            Turn Off Pack
          </button>
        </div>
      )}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-sm text-slate-700">
        <ul className="list-disc pl-5 space-y-1">
          <li>Milestones are optional quests for you and your child.</li>
          <li>They appear at key child ages (0, 3, 6, 11, 14) and give you goals before age 18.</li>
          <li>Complete before the deadline to earn rewards.</li>
          <li>Missing a milestone has no penalty (for now).</li>
          <li>You can turn the pack off anytime in Settings → Packs.</li>
        </ul>
        <div>
          <div className="font-semibold text-slate-800 mb-1">Rewards</div>
          <div className="text-sm">Rewards can include: Money bonus, Stat boosts (Confidence/Intelligence/etc.), Love changes, Stress changes (if your game uses these).</div>
        </div>

        {/* Life Goals Section */}
        <div className="space-y-3 p-3 rounded-xl border bg-blue-50 border-blue-200">
          <div className="font-semibold text-slate-800">🎯 Life Goals</div>
          {(() => {
            const lg = gameState.lifeGoals || {};
            const selected = Array.isArray(lg.selectedIds) ? lg.selectedIds : [];
            const progressById = lg.progressById || {};
            const completedIds = new Set(Array.isArray(lg.completedIds) ? lg.completedIds : []);

            if (selected.length === 0) {
              return (
                <div>
                  <div className="text-slate-600 mb-3">No life goals selected.</div>
                  <button
                    onClick={() => updateState(prev => ({
                      milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: false } },
                      lifeGoals: { ...(prev.lifeGoals||{}), uiOpen: true }
                    }))}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                  >
                    Set Life Goals
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {selected.map(goalId => {
                  const def = LIFE_GOALS_BY_ID[goalId];
                  if (!def) return null;

                  const progress = progressById[goalId] || { current: 0, target: 1 };
                  const isCompleted = completedIds.has(goalId);
                  const pct = Math.min(100, Math.round((progress.current / Math.max(1, progress.target)) * 100));

                  return (
                    <div key={goalId} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{def.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800 text-sm">{def.title}</div>
                          <div className="text-xs text-slate-600">
                            {progress.current} / {progress.target}
                          </div>
                        </div>
                        {isCompleted && <span className="text-xs font-semibold text-green-600">✓ Completed</span>}
                      </div>
                      <div className="w-full bg-slate-300 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 space-y-2 border-t border-blue-200">
                  <button
                    onClick={() => updateState(prev => ({
                      milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: false } },
                      lifeGoals: { ...(prev.lifeGoals||{}), uiOpen: true }
                    }))}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                  >
                    Edit Life Goals
                  </button>
                  <button
                    onClick={() => updateState(prev => ({
                      lifeGoals: {
                        ...(prev.lifeGoals||{}),
                        selectedIds: [],
                        progressById: {},
                        completedIds: []
                      }
                    }))}
                    className="w-full px-3 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg"
                  >
                    Clear Goals
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="space-y-3">
          <div className="font-semibold text-slate-800">Current Active Quests</div>
          {!kid && !adult && (
            <div className="text-slate-600">No active milestones right now.</div>
          )}

          {kid && (
            <div className="p-3 rounded-xl border bg-white border-amber-200">
              <div className="text-[11px] uppercase tracking-wide text-amber-600 font-semibold mb-1">Kid Quest</div>
              <div className="font-semibold text-sm">{kid.title}</div>
              <div className="text-xs text-slate-600 mt-1">{kid.body}</div>
              {kid.metric?.type === 'stat_threshold' && (
                <div className="text-xs text-slate-700 mt-2">Goal: {kid.metric.statKey} ≥ {statToPoints(kid.targetValue)} points by age {kid.deadlineChildAge}</div>
              )}
              {kid.metric?.type === 'stat_increase' && (
                <div className="text-xs text-slate-700 mt-2">Goal: +{kid.metric.increaseBy} {kid.metric.statKey} by age {kid.deadlineChildAge}</div>
              )}
              <div className="text-[11px] text-slate-500 mt-2">Reward: {rewardLine(kid.reward)}</div>
            </div>
          )}

          {adult && (
            <div className="p-3 rounded-xl border bg-white border-indigo-200">
              <div className="text-[11px] uppercase tracking-wide text-indigo-600 font-semibold mb-1">Adult Quest</div>
              <div className="font-semibold text-sm">{adult.title}</div>
              <div className="text-xs text-slate-600 mt-1">{adult.body}</div>
              {/* Goal summary */}
              {adult.metric?.type === 'money_total' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Reach ${formatMoney(adult.metric.targetAmount)} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'money_increase' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Increase money by ${formatMoney(adult.metric.increaseBy)} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'career_progress' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Career progress (+${formatMoney(adult.metric.incomeIncrease)} or level up) by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'social_followers_total' && (
                <div className="text-xs text-slate-700 mt-2">Goal: {adult.metric.targetFollowers.toLocaleString()} followers by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'passport_stamps_count' && (
                <div className="text-xs text-slate-700 mt-2">Goal: {adult.metric.count} passport stamps by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'pets_count' && (
                <div className="text-xs text-slate-700 mt-2">Goal: {adult.metric.count} pets by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'bookshelf_count' && (
                <div className="text-xs text-slate-700 mt-2">Goal: {adult.metric.count} books on the shelf by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'love_increase' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Increase Love by +{adult.metric.increaseBy} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'stress_below' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Keep Stress ≤ {adult.metric.threshold} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'business_started' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Start a business by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'business_income_per_year' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Business income of ${formatMoney(adult.metric.targetIncome)}/year by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'politics_office_held' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Hold political office by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'politics_approval_threshold' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Approval ≥ {adult.metric.threshold} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'politics_warchest_total' && (
                <div className="text-xs text-slate-700 mt-2">Goal: War chest of ${formatMoney(adult.metric.targetAmount)} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'donations_total' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Complete {adult.metric.count} donations by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'study_points_total' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Earn {adult.metric.points} study points by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'adult_crime_record_below' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Keep record ≤ {adult.metric.threshold} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'adult_crime_heat_below' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Keep heat ≤ {adult.metric.threshold} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'adult_crime_skill_threshold' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Crime skill ≥ {adult.metric.threshold} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'adult_crime_crew_threshold' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Crew ≥ {adult.metric.threshold} by age {adult.deadlineAdultAge}</div>
              )}
              {adult.metric?.type === 'game_shelf_count' && (
                <div className="text-xs text-slate-700 mt-2">Goal: Collect {adult.metric.count} games by age {adult.deadlineAdultAge}</div>
              )}
              <div className="text-xs text-slate-700 mt-2">Deadline: by age {adult.deadlineAdultAge}</div>
              <div className="text-[11px] text-slate-500 mt-2">Reward: {rewardLine(adult.reward)}</div>
              </div>
              )}
              </div>
              </div>
              </GameModalShell>
              );
              }