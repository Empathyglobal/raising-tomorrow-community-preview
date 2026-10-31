import React from 'react';
import { ChevronRight, RotateCw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameState, describeStat, formatMoney } from '../GameStateContext';
import { statToPoints } from '@/components/content/milestonesPack';
import CoverHeader from '@/components/game/CoverHeader';
import { getUiThemeFromDom } from '@/components/lib/uiTheme';

export default function HomeTab({ onAgeUp, ageUpDisabled, uiBlocker, onSwitchToActionsTab, onOpenTimeline, onOpenMoment, onOpenLifeHub, onOpenTitles, onOpenPTA }) {
  const { gameState, rerollTip, computeSuggestion, getActionAvailability, updateState, computeMoneyGoal } = useGameState();
  const isStorybook = getUiThemeFromDom() === 'storybook';
  const ms = gameState.milestones || {};
  const { stats, love, stress, money, currentYear, endAge, tipText, scenarioPending, scenarioCompletedThisAge, actionPoints, isLegacyRun, legacyParentName, legacyBannerDismissed, marketModifier, nextStepDismissed, updateDismissed } = gameState;
  const moneyGoal = computeMoneyGoal();

  const SHOW_DASHBOARD_GUIDANCE_CARDS = false; // RETIRED: do not show Next Step or Tips on dashboard
  const [stepRotation, setStepRotation] = React.useState(0);

  const handleDismissNextStep = (e) => {
    e.stopPropagation();
    updateState({ nextStepDismissed: true });
  };

  const handleDismissUpdate = (e) => {
    e.stopPropagation();
    updateState({ updateDismissed: true });
  };

  const handleDismissMoneyGoal = (e) => {
    e.stopPropagation();
    updateState({ financialGoalDismissed: true });
  };

  const handleAgeUp = () => {
    const newRotation = Math.floor(Math.random() * 360);
    setStepRotation(prev => (prev === newRotation ? newRotation + 1 : newRotation));
    if (onAgeUp) onAgeUp();
  };

  // Compute suggestion
  const suggestion = SHOW_DASHBOARD_GUIDANCE_CARDS ? computeSuggestion() : null;
  
  const [legacyBannerVisible, setLegacyBannerVisible] = React.useState(isLegacyRun && !legacyBannerDismissed && currentYear === 0);
  
  const handleDismissLegacyBanner = () => {
    setLegacyBannerVisible(false);
    updateState({ legacyBannerDismissed: true });
  };

  return (
    <div className="h-full pb-24 pt-4">
      <div className="rt-container min-h-full flex flex-col">
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {isStorybook && (
            <>
              <CoverHeader cover={{ id: 'home', title: 'Home' }} />
              <div className="SBDoodleDivider mb-3" />
            </>
          )}
          
          {/* Storybook-only dashboard postcard strip is on Dashboard page; HomeTab remains unchanged */}
          
          {/* Legacy Run Banner */}
          {legacyBannerVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-4 border-2 border-violet-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-bold text-violet-900 text-sm mb-1">🧬 Legacy Run</div>
                  <div className="text-xs text-violet-800">
                    You're playing as {legacyParentName}. Starting with ${Math.floor(money).toLocaleString()} inheritance.
                  </div>
                </div>
                <button 
                  onClick={handleDismissLegacyBanner}
                  className="text-violet-400 hover:text-violet-600 flex-shrink-0 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Blocker Banner */}
          {uiBlocker && (
            <motion.button
              type="button"
              onClick={() => onOpenMoment?.()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-left bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-2 border-amber-300 hover:from-amber-200 hover:to-orange-200 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900 text-sm mb-1">✨ {uiBlocker.title}</div>
                  <div className="text-xs text-amber-800">{uiBlocker.reason}</div>
                  <div className="text-[11px] text-amber-700/90 mt-1">Tap to {uiBlocker.ctaLabel.toLowerCase()}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-600" />
              </div>
            </motion.button>
          )}

          {/* Money Goal Card */}
          {moneyGoal && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-sm border border-emerald-200 relative group cursor-pointer hover:bg-emerald-50/80 transition-colors"
              onClick={() => {
                if (moneyGoal.ctaAction === 'setup') {
                  if (onOpenLifeHub) onOpenLifeHub('goalSetup');
                } else {
                  if (onOpenLifeHub) onOpenLifeHub('goalSetup');
                }
              }}
            >
              <button
                onClick={handleDismissMoneyGoal}
                className="absolute top-2 right-2 p-1 text-emerald-700/50 hover:text-emerald-800 hover:bg-emerald-600/10 rounded-full transition-colors z-10"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{moneyGoal.emoji || '💰'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 mb-0.5">{moneyGoal.title}</h3>
                  <p className="text-xs text-slate-600 mb-2">{moneyGoal.why}</p>

                  {moneyGoal.cost > 0 && (
                    <div className="bg-white/60 rounded-lg p-2 mb-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>${formatMoney(moneyGoal.progress)} / ${formatMoney(moneyGoal.cost)}</span>
                        <span>${formatMoney(moneyGoal.remaining)} away</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${Math.min(100, (moneyGoal.progress / moneyGoal.cost) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (moneyGoal.ctaAction === 'setup') {
                        if (onOpenLifeHub) onOpenLifeHub('goalSetup');
                      } else if (moneyGoal.ctaAction === 'earn') {
                        if (onSwitchToActionsTab) onSwitchToActionsTab('earn');
                      }
                    }}
                    className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors relative z-10"
                  >
                    {moneyGoal.ctaLabel}
                  </button>

                  {marketModifier && (
                    <div className="mt-2 text-[10px] text-slate-500">
                      This year: {marketModifier.emoji} {marketModifier.title}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Milestones Card */}
          {(gameState.packs?.milestonesEnabled ?? true) && !Boolean(ms.ui?.dashboardDismissed) && (ms.kidQuestActive || ms.adultQuestActive) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm border border-amber-200 relative cursor-pointer hover:bg-amber-50/80 transition-colors"
              onClick={() => updateState(prev => ({ milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), infoOpen: true } } }))}
            >
              <button
                title="Hide"
                onClick={(e) => { e.stopPropagation(); updateState(prev => ({ milestones: { ...(prev.milestones||{}), ui: { ...(prev.milestones?.ui||{}), dashboardDismissed: true } } })); }}
                className="absolute top-2 right-2 p-1 text-amber-700/60 hover:text-amber-800 hover:bg-amber-600/10 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0"><span className="text-xl">🎯</span></div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 mb-0.5">Milestones</h3>
                  {ms.kidQuestActive && (
                    <div className="text-xs text-slate-700 mb-1">
                      Kid: {ms.kidQuestActive.title}
                      {ms.kidQuestActive.metric?.type === 'stat_threshold' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Progress: {statToPoints(gameState.stats?.[ms.kidQuestActive.metric.statKey] || 0)} / {statToPoints(ms.kidQuestActive.targetValue)} • Deadline age {ms.kidQuestActive.deadlineChildAge}
                          </span>
                        </>
                      )}
                      {ms.kidQuestActive.metric?.type === 'stat_increase' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Progress: +{Math.max(0, (Number(gameState.stats?.[ms.kidQuestActive.metric.statKey]||0) - Number(ms.kidQuestActive?.baseline?.stats?.[ms.kidQuestActive.metric.statKey]||0)))} / +{ms.kidQuestActive.metric.increaseBy} ({ms.kidQuestActive.metric.statKey}) • Deadline age {ms.kidQuestActive.deadlineChildAge}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  {ms.adultQuestActive && (
                    <div className="text-xs text-slate-700">
                      Adult: {ms.adultQuestActive.title}
                      {ms.adultQuestActive.metric?.type === 'money_total' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Money: ${formatMoney(gameState.money)} / ${formatMoney(ms.adultQuestActive.metric.targetAmount)} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'money_increase' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Increase: ${formatMoney(Math.max(0, Number(gameState.money||0) - Number(ms.adultQuestActive?.baseline?.money || 0)))} / ${formatMoney(ms.adultQuestActive.metric.increaseBy)} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'social_followers_total' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Followers: {(Object.values(gameState.socialMedia?.accounts||{}).reduce((s,a)=>s+(a.followers||0),0)).toLocaleString()} / {ms.adultQuestActive.metric.targetFollowers.toLocaleString()} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'passport_stamps_count' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Stamps: {(gameState.passportStamps?.length||0)} / {ms.adultQuestActive.metric.count} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'pets_count' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Pets: {(gameState.pets?.length||0)} / {ms.adultQuestActive.metric.count} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'bookshelf_count' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Books: {(gameState.bookshelf?.length||0)} / {ms.adultQuestActive.metric.count} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'love_increase' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Love: +{Math.max(0, Number(gameState.love||0) - Number(ms.adultQuestActive?.baseline?.love||0))} / +{ms.adultQuestActive.metric.increaseBy} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'stress_below' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Stress: {Math.round(Number(gameState.stress||0))} ≤ {ms.adultQuestActive.metric.threshold} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'business_started' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Started: {Boolean(gameState.businessAttempted) ? '✓ Yes' : '—'} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'business_income_per_year' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Income: ${formatMoney(Number(gameState.businessIncomePerYear||0))} / ${formatMoney(ms.adultQuestActive.metric.targetIncome)} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'politics_office_held' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Office: {Boolean(gameState.politics?.currentOfficeId) ? '✓ Held' : '—'} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'politics_approval_threshold' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Approval: {Math.round(Number(gameState.politics?.approval||0))} / {ms.adultQuestActive.metric.threshold} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'politics_warchest_total' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            War Chest: ${formatMoney(Number(gameState.politics?.warChest||0))} / ${formatMoney(ms.adultQuestActive.metric.targetAmount)} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'donations_total' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Donations: {Number(gameState.donationProgress?.total||0)} / {ms.adultQuestActive.metric.count} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'study_points_total' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Study Points: {Number(gameState.studyPoints||0)} / {ms.adultQuestActive.metric.points} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'adult_crime_record_below' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Record: {Number(gameState.adultCrime?.record||0)} ≤ {ms.adultQuestActive.metric.threshold} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'adult_crime_heat_below' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Heat: {Number(gameState.adultCrime?.heat||0)} ≤ {ms.adultQuestActive.metric.threshold} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'adult_crime_skill_threshold' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Crime Skill: {Number(gameState.adultCrime?.skill||0)} / {ms.adultQuestActive.metric.threshold} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'adult_crime_crew_threshold' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Crew: {Number(gameState.adultCrime?.crew||0)} / {ms.adultQuestActive.metric.threshold} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      {ms.adultQuestActive.metric?.type === 'game_shelf_count' && (
                        <>
                          <br />
                          <span className="text-[11px] text-slate-600">
                            Games: {(Array.isArray(gameState.gameShelf) ? gameState.gameShelf.length : 0)} / {ms.adultQuestActive.metric.count} • By age {ms.adultQuestActive.deadlineAdultAge}
                          </span>
                        </>
                      )}
                      </div>
                      )}
                      </div>
                      </div>
                      </motion.div>
                      )}

          {/* Next Step Card (RETIRED — keep code but never render) */}
          {SHOW_DASHBOARD_GUIDANCE_CARDS && !nextStepDismissed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-200 relative group"
            >
              <button
                onClick={handleDismissNextStep}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-black/5 rounded-full transition-colors"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-start gap-3 pr-4">
                <div 
                  className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0"
                  style={{ transform: `rotate(${stepRotation}deg)`, transition: "transform 300ms ease" }}
                >
                  <span className="text-xl">🎯</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Next Step</h3>
                  {uiBlocker ? (
                    <div>
                      <p className="text-sm text-slate-700 mb-2">{uiBlocker.reason}</p>
                      <button
                        onClick={() => onOpenMoment?.()}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        {uiBlocker.ctaLabel || "Open"}
                      </button>
                    </div>
                  ) : actionPoints > 0 ? (
                    <div>
                      <p className="text-sm text-slate-700 mb-2">
                        {suggestion?.text || "Use your action points to bond, play, or study."}
                      </p>
                      <button
                        onClick={onSwitchToActionsTab}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        View Actions
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-700 mb-2">✅ You're ready to Age Up</p>
                      <button
                        onClick={handleAgeUp}
                        disabled={ageUpDisabled}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Age Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tip Card (Update) (RETIRED — keep code but never render) */}
          {SHOW_DASHBOARD_GUIDANCE_CARDS && !updateDismissed && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 relative group">
              <button
                onClick={handleDismissUpdate}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-black/5 rounded-full transition-colors"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <div className="flex-1 text-sm text-slate-700 leading-relaxed">
                  {tipText}
                </div>
                <button
                  onClick={rerollTip}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/50 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <RotateCw className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}

          {/* Life Log Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Life Log</h3>
                <p className="text-xs text-slate-500 mt-0.5">What happened so far</p>
              </div>
              {onOpenTimeline && (
                <button
                  onClick={onOpenTimeline}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Full Timeline →
                </button>
              )}
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto">
              {gameState.timelineEntries.length === 0 ? (
                <div className="h-full px-4 py-8 flex items-center justify-center text-center text-sm text-slate-400">
                  Nothing yet. Your story starts with small moments.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {[...gameState.timelineEntries].reverse().map((entry) => {
                    const entryId = entry.id || `${entry.age}-${entry.kind}-${Math.random()}`;
                    const isTinyCute = entry.kind === 'tinyCute';
                    const isKidWisdom = entry.kind === 'kidWisdom';

                    const icon = isTinyCute
                      ? '✨'
                      : isKidWisdom
                      ? '💡'
                      : entry.title?.match(/^[\p{Emoji}]/u)?.[0] || '•';

                    const rowClass = isTinyCute
                      ? 'px-4 py-3 transition-colors bg-[#FFF4B8] border-l-4 border-[#FF4FA3]'
                      : isKidWisdom
                      ? 'px-4 py-3 transition-colors bg-[#E8F4FF] border-l-4 border-[#7C3AED]'
                      : 'px-4 py-3 hover:bg-slate-50 transition-colors';

                    const titleClass = `text-sm font-medium mb-0.5 ${
                      isTinyCute ? 'text-pink-900' : isKidWisdom ? 'text-violet-900 italic' : 'text-slate-800'
                    }`;

                    const detailClass = `text-xs line-clamp-2 ${
                      isTinyCute ? 'text-pink-800' : isKidWisdom ? 'text-violet-800' : 'text-slate-600'
                    }`;

                    return (
                      <div key={entryId} className={rowClass}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 text-xl leading-none">{icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className={titleClass}>
                              Age {entry.age}: {entry.title?.replace(/^[\p{Emoji}\s]+/u, '')}
                            </div>
                            {entry.detail && (
                              <div className={detailClass}>
                                {entry.detail}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}