import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, statTier, tierIcon, statBarPercent, getTierColor, loveTier, loveBarPercent, stressTier, warmthLabel, structureLabel, parentingStyleTitle2, formatMoney, getDisplayedChildAge, hasAnyChild } from "@/components/game/GameStateContext";
import { toast } from 'sonner';
import { getStatLabel, formatStatNumber } from '@/components/game/ageAwareStatLabels';
import { getActiveStyleName, getBeltLabel, hasAnyBlackBelt } from '@/components/game/martialArtsData';
import { formatTemperament, formatInterest, formatPrimaryInterest, formatPubertyPassion } from '@/components/game/childProfileLabels';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Target, Zap, DollarSign } from 'lucide-react';
import { getStatDisplayName, getStatDisplayNameTitle } from '@/components/game/statLabels';
import { motion } from 'framer-motion';
import { getDependentNoun, getDependentTitlePrefix, getDependentPossessive } from '@/components/game/familyLabelUtils';

const statConfigs = [
  { key: 'intelligence', label: getStatDisplayNameTitle('intelligence'), icon: Brain, gradient: 'from-blue-500 to-indigo-500', abbr: 'CURIOSITY' },
  { key: 'empathy', label: 'Empathy', icon: Heart, gradient: 'from-rose-500 to-pink-500', abbr: 'EMP' },
  { key: 'discipline', label: 'Discipline', icon: Target, gradient: 'from-amber-500 to-orange-500', abbr: 'DIS' },
  { key: 'confidence', label: 'Confidence', icon: Zap, gradient: 'from-violet-500 to-purple-500', abbr: 'CON' }
];

function StatRow({ stat, value, pb, baseline, age }) {
  const Icon = stat.icon;
  const statLabelData = getStatLabel(stat.key, value, age);
  const formattedValue = formatStatNumber(value);
  const formattedPB = formatStatNumber(pb);
  const formattedBaseline = formatStatNumber(baseline);
  
  // Determine color based on tone
  const getToneColor = (tone) => {
    if (tone === 'extreme') return 'bg-purple-100 text-purple-700 border border-purple-200';
    if (tone === 'high') return 'bg-green-100 text-green-700 border border-green-200';
    if (tone === 'mid') return 'bg-blue-100 text-blue-700 border border-blue-200';
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  };
  
  const barPercent = statBarPercent(value);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">{stat.label}: {formattedValue}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getToneColor(statLabelData.tone)}`}>
                {statLabelData.label}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              PB: {formattedPB} • Start: {formattedBaseline}
            </div>
            {statLabelData.shortHint && (
              <div className="text-[10px] text-slate-400 italic mt-0.5">
                {statLabelData.shortHint}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            statLabelData.tone === 'extreme' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
            statLabelData.tone === 'high' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
            statLabelData.tone === 'mid' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
            'bg-gradient-to-r from-amber-400 to-orange-500'
          }`}
          style={{ width: `${barPercent}%` }}
        />
      </div>
    </div>
  );
}

export default function DevelopmentDetails() {
  const navigate = useNavigate();
  const { gameState, setActiveKid, spendFocus, applyMoneyDelta, applyStress, applyLoveToKidId, addLog } = useGameState();

  // Child-free placeholder
  const hasChild = gameState ? hasAnyChild(gameState) : false;
  
  // BLOCK: Adult children (age >= 18, relation='child') redirect to Relationships
  const allKids = gameState && Array.isArray(gameState.kids) ? gameState.kids : [];
  const currentActiveKid = gameState ? (allKids.find(k => k.id === gameState.activeKidId) || allKids[0] || null) : null;
  const currentDisplayedAge = currentActiveKid && gameState ? getDisplayedChildAge(gameState, currentActiveKid) : (gameState?.currentYear || 0);
  
  useEffect(() => {
    if (currentActiveKid?.relation === 'child' && currentDisplayedAge >= 18) {
      toast.info('Adult children are managed in Relationships.');
      navigate(createPageUrl('Game') + '?tab=relationships');
    }
  }, [currentActiveKid, currentDisplayedAge, navigate]);

  if (!gameState) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Development</h2>
        <p className="text-sm opacity-80">Loading your game data…</p>
      </div>
    );
  }
  
  if (currentActiveKid?.relation === 'child' && currentDisplayedAge >= 18) {
    return null;
  }
  
  if (!hasChild) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 border">
          <div className="text-xs uppercase tracking-widest text-slate-500">Development</div>
          <h1 className="text-2xl font-bold mt-1">No child yet 🧃</h1>
          <p className="text-slate-600 mt-3">
            You're playing child-free right now, so child development is paused.
            (You can still build your life, manage stress, and survive group chats.)
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => navigate(createPageUrl('Game'))}>
              Home
            </Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl('Game') + '?tab=relationships')}>
              Relationships
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Safe defaults helper
  const safeNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // Safe object extraction
  const safeStats = gameState.stats || {};
  const safeBaseline = gameState.baselineStats || {};
  const safeHighWater = gameState.highWaterStats || {};

  const {
    childName,
    childTemperamentId,
    childInterestId,
    childProfile,
    currentYear,
    lastChangeText,
    lastMilestoneText,
    lastEventSource,
    warmthPoints = 0,
    structurePoints = 0,
    teacherName,
    teacherTrust = 0,
    bestFriendName,
    peerCircle = 0,
    money = 0,
    retirementSavings = 0,
    juvenileJustice
  } = gameState;

  // Safe values for top-level metrics
  const love = safeNumber(gameState.love, 50);
  const baselineLove = safeNumber(gameState.baselineLove, 50);
  const highWaterLove = safeNumber(gameState.highWaterLove, 50);
  const stress = safeNumber(gameState.stress, 0);
  const baselineStress = safeNumber(gameState.baselineStress, 0);
  const highWaterStress = safeNumber(gameState.highWaterStress, 0);

  const temperamentLabel = formatTemperament(childTemperamentId, gameState.temperament);
  const interestLabel = formatInterest(childInterestId);
  const primaryInterestLabel = childProfile?.primaryInterest ? formatPrimaryInterest(childProfile.primaryInterest) : '';
  const pubertyPassionLabel = childProfile?.pubertyPassion ? formatPubertyPassion(childProfile.pubertyPassion) : '';
  
  // Sibling Rivalry: Show kid switcher
  const siblingOn = !!gameState.expansions?.siblingRivalry;
  const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
  const showKidSwitcher = siblingOn && kids.length > 1;
  
  // Active child and age for adult actions
  const activeKid = kids.find(k => k.id === gameState.activeKidId) || null;
  const displayedAge = activeKid ? getDisplayedChildAge(gameState, activeKid) : currentYear;
  const adultLife = activeKid?.adultLife || null;
  const kidId = activeKid?.id || gameState.activeKidId;

  const roleTitle = getDependentTitlePrefix(activeKid);
  const rolePossessive = getDependentPossessive(activeKid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6 pb-24">
      <div className="rt-container">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{roleTitle} Development</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(createPageUrl('Game'))}
                >
                  Home
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(createPageUrl('Game') + '?tab=relationships')}
                  >
                    Relationships
                  </Button>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">
              Start: CURIOSITY {formatStatNumber(safeNumber(safeBaseline.intelligence, 10))} • EMP {formatStatNumber(safeNumber(safeBaseline.empathy, 10))} • DIS {formatStatNumber(safeNumber(safeBaseline.discipline, 10))} • CON {formatStatNumber(safeNumber(safeBaseline.confidence, 10))}
            </p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-slate-400" />
                <span className="text-slate-500">Money: ${formatMoney(money)}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <span>🏦</span>
                <span>Retirement: ${formatMoney(retirementSavings)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kid Switcher for Sibling Rivalry */}
        {showKidSwitcher && (
          <motion.div
            className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {kids.map((kid, idx) => {
              const kidName = kid?.childSlice?.childName || `Child ${idx + 1}`;
              const isActive = kid.id === gameState.activeKidId;
              return (
                <button
                  key={kid.id}
                  onClick={() => setActiveKid(kid.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {kidName}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* About Child/Grandchild */}
        <motion.div
          className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-5 border border-amber-200 shadow-sm mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h3 className="text-sm font-semibold text-slate-600 mb-3">About {childName} ({getDependentNoun(activeKid)})</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Temperament</span>
              <span className="font-semibold text-slate-800">{temperamentLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Interest</span>
              <span className="font-semibold text-slate-800">{interestLabel}</span>
            </div>
            {primaryInterestLabel && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Primary interest</span>
                <span className="font-semibold text-slate-800">{primaryInterestLabel}</span>
              </div>
            )}
            {pubertyPassionLabel && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Passion focus (puberty)</span>
                <span className="font-semibold text-slate-800">{pubertyPassionLabel}</span>
              </div>
            )}
            {gameState.childProfile?.stuffedAnimal && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Comfort Toy (Age 2)</span>
                <span className="font-semibold text-slate-800">
                  {gameState.childProfile.stuffedAnimal.emoji} {gameState.childProfile.stuffedAnimal.name} ({gameState.childProfile.stuffedAnimal.theme})
                </span>
              </div>
            )}
            {gameState.education?.schoolClubs?.activeClub && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">School Club</span>
                <span className="font-semibold text-slate-800">
                  {gameState.education.schoolClubs.activeClub.emoji} {gameState.education.schoolClubs.activeClub.name}
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            These are gentle "flavor" traits that can nudge a few events — not a label for the child.
          </p>
        </motion.div>

        {/* Last Change */}
        {lastChangeText && (
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-sm text-blue-800">
              <span className="font-medium">Last change ({lastEventSource}):</span> {lastChangeText}
            </p>
          </motion.div>
        )}

        {/* Milestone */}
        {lastMilestoneText && (
          <motion.div 
            className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-sm text-amber-800 font-medium">{lastMilestoneText}</p>
          </motion.div>
        )}

        {/* School Status */}
        {gameState.inSchool && (
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-sm text-blue-800">
              School: {gameState.schoolType === "empathy" ? "Empathy School (Bali)" : gameState.schoolType === "standard" ? "Standard School" : "Not in school"}
            </p>
          </motion.div>
        )}

        {/* Juvenile Justice Card */}
        {(gameState.enabledScenarioPackIds?.includes('pack_juvenile_justice_v1') || juvenileJustice?.hall?.active || juvenileJustice?.diversion?.active || juvenileJustice?.probation?.active) && (
          <motion.div 
            className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Juvenile Justice Status</h3>
            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
              <div>
                <div className="text-slate-400">Momentum</div>
                <div className="font-mono text-emerald-400">{juvenileJustice?.spree || 0}/100</div>
              </div>
              <div>
                <div className="text-slate-400">Attention</div>
                <div className="font-mono text-amber-400">{juvenileJustice?.heat || 0}/100</div>
              </div>
              <div>
                <div className="text-slate-400">Record</div>
                <div className="font-mono text-rose-400">{(juvenileJustice?.record || 0).toFixed(1)}</div>
              </div>
              <div>
                <div className="text-slate-400">Identity</div>
                <div className="font-mono text-purple-400">{juvenileJustice?.crimeIdentity || 0}/100</div>
              </div>
              <div>
                <div className="text-slate-400">Remorse</div>
                <div className="font-mono text-blue-400">{juvenileJustice?.remorse || 50}/100</div>
              </div>
              <div>
                <div className="text-slate-400">Crew</div>
                <div className="font-mono text-orange-400">{juvenileJustice?.crew || 0}/100</div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-700 text-xs">
              <span className="text-slate-400">Status: </span>
              <span className="font-bold text-white">
                {juvenileJustice?.hall?.active ? `Juvenile Hall (${juvenileJustice.hall.yearsRemaining} yr)` :
                 juvenileJustice?.diversion?.active ? `Diversion Program (${juvenileJustice.diversion.yearsRemaining} yr)` :
                 juvenileJustice?.probation?.active ? `Probation (${juvenileJustice.probation.yearsRemaining} yr)` :
                 "Normal"}
              </span>
            </div>
          </motion.div>
        )}

        {/* Full Stats Display */}
        <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        >
        {statConfigs.map((config) => (
          <StatRow
            key={config.key}
            stat={config}
            value={safeNumber(safeStats[config.key], 10)}
            pb={safeNumber(safeHighWater[config.key], 10)}
            baseline={safeNumber(safeBaseline[config.key], 10)}
            age={currentYear || 0}
          />
        ))}
        </motion.div>

        {/* Bond Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Bond</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">Love: {formatStatNumber(love)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {loveTier(love)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    PB: {formatStatNumber(highWaterLove)} • Start: {formatStatNumber(baselineLove)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-400 to-pink-400 transition-all duration-500"
                style={{ width: `${loveBarPercent(love)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Relationships Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Relationships</h3>
          <div className="space-y-0 divide-y divide-slate-100">
            {/* Teacher Row */}
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧑‍🏫</span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">Teacher</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    teacherName 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    {teacherName || "Not yet"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Trust</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all"
                      style={{ width: `${(teacherTrust / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-700 w-8 text-right">{teacherTrust}/10</span>
                </div>
              </div>
            </div>

            {/* Best Friend Row */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧑‍🤝‍🧑</span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">Best Friend</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    bestFriendName 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    {bestFriendName || "Not yet"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Peer Circle</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all"
                      style={{ width: `${(peerCircle / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-700 w-8 text-right">{peerCircle}/10</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Parent State Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-slate-600 mb-3">Parent State</h3>
          <div className="space-y-3">
            {/* Stress Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">😮‍💨</span>
                <span className="text-sm font-medium text-slate-700">Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-800">{formatStatNumber(stress)}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                  {stressTier(stress)}
                </span>
              </div>
            </div>

            {/* Mini Stress Meter */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                style={{ width: `${Math.min(100, (stress / 30) * 100)}%` }}
              />
            </div>

            {/* Start/Now/Peak Chips */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                Start {formatStatNumber(baselineStress)}
              </span>
              <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                Now {formatStatNumber(stress)}
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                Peak {formatStatNumber(highWaterStress)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Martial Arts Belt Status */}
        {(() => {
          const activeStyleName = getActiveStyleName(gameState);
          const activeBeltLabel = activeStyleName ? getBeltLabel(gameState, gameState.mindBody?.martialArts?.activeStyleId) : null;
          const hasBlackBelt = hasAnyBlackBelt(gameState);
          
          if (!activeStyleName) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 mt-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🥋</span>
                <h3 className="text-sm font-bold text-slate-700">Martial Arts</h3>
              </div>
              <div className="text-sm text-slate-700 space-y-1">
                <p>{activeStyleName} • {activeBeltLabel}</p>
                {hasBlackBelt && (
                  <p className="font-semibold text-amber-700">⭐ Black Belt achieved</p>
                )}
              </div>
            </motion.div>
          );
        })()}

        {/* Parenting Style Card */}
        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-sm mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <span className="text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Parenting Style</h3>
              <p className="text-xs text-purple-700 font-medium">
                {(() => {
                  const majorCount = gameState.timelineEntries.filter(e => e.kind === "major").length;
                  const warmthAvg = warmthPoints / Math.max(1, majorCount);
                  const structureAvg = structurePoints / Math.max(1, majorCount);
                  const harmCount = gameState.timelineEntries.filter(e => e.kind === "major" && e.meta?.choiceRole === "harm").length;
                  return parentingStyleTitle2(warmthAvg, structureAvg, love, harmCount, stress);
                })()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Warmth</span>
              <span className="font-semibold text-slate-800">
                {(() => {
                  const majorCount = gameState.timelineEntries.filter(e => e.kind === "major").length;
                  const warmthAvg = warmthPoints / Math.max(1, majorCount);
                  const harmCount = gameState.timelineEntries.filter(e => e.kind === "major" && e.meta?.choiceRole === "harm").length;
                  return warmthLabel(warmthAvg, love, harmCount);
                })()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Warmth Points</span>
              <span className="text-slate-500">
                {warmthPoints} (avg {(warmthPoints / Math.max(1, gameState.timelineEntries.filter(e => e.kind === "major").length)).toFixed(1)}/year)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Structure</span>
              <span className="font-semibold text-slate-800">
                {(() => {
                  const majorCount = gameState.timelineEntries.filter(e => e.kind === "major").length;
                  const structureAvg = structurePoints / Math.max(1, majorCount);
                  return structureLabel(structureAvg, stress);
                })()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Structure Points</span>
              <span className="text-slate-500">
                {structurePoints} (avg {(structurePoints / Math.max(1, gameState.timelineEntries.filter(e => e.kind === "major").length)).toFixed(1)}/year)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Adult Life Actions (age >= 18 only) */}
        {displayedAge >= 18 && (
          <motion.div
            className="bg-gradient-to-br from-indigo-50 to-violet-50 backdrop-blur-sm rounded-2xl p-5 border border-indigo-200 shadow-sm mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <span className="text-2xl">🧑‍🎓</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Adult Life</h3>
                <p className="text-xs text-indigo-700">Stay connected with your adult child</p>
              </div>
            </div>

            {adultLife ? (
              <div className="text-sm text-slate-700 mb-4 space-y-1 bg-white/60 p-3 rounded-lg border border-indigo-100">
                <div><span className="font-medium">Status:</span> {adultLife.education?.track || 'unknown'} / {adultLife.career?.status || 'unknown'}</div>
                <div><span className="font-medium">Relationship:</span> {adultLife.relationship?.status || 'single'}{adultLife.relationship?.partnerName ? ` (${adultLife.relationship.partnerName})` : ''}</div>
                <div><span className="font-medium">Grandkids:</span> {adultLife.kids?.length || 0}</div>
                <div><span className="font-medium">Living:</span> {adultLife.distance || 'unknown'}</div>
              </div>
            ) : (
              <div className="text-sm text-slate-600 mb-4 bg-white/60 p-3 rounded-lg border border-indigo-100">
                Adult-life tracking begins when you continue past 18 from the Outcome page.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  if (!kidId) { toast.error('No active child'); return; }
                  if (!spendFocus(1, 'Call Adult Child')) return;
                  applyStress(-1, 'Call');
                  applyLoveToKidId(kidId, 2, 'Call');
                  addLog(`📞 Called ${childName}`);
                  toast.success(`Called ${childName}`, { icon: '📞' });
                }}
                className="justify-start"
              >
                📞 Call
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  if (!kidId) { toast.error('No active child'); return; }
                  if (!spendFocus(2, 'Visit Adult Child')) return;
                  const travelCost = adultLife?.distance === 'far' ? 450 : adultLife?.distance === 'near' ? 120 : 40;
                  applyMoneyDelta(-travelCost, 'Visit travel', { category: 'leisure' });
                  applyStress(2, 'Visit');
                  applyLoveToKidId(kidId, 3, 'Visit');
                  addLog(`🚗 Visited ${childName} (travel cost: $${travelCost})`);
                  toast.success(`Visited ${childName}`, { icon: '🚗' });
                }}
                className="justify-start"
              >
                🚗 Visit
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  if (!kidId) { toast.error('No active child'); return; }
                  if (!spendFocus(1, 'Advice')) return;
                  applyStress(1, 'Advice');
                  applyLoveToKidId(kidId, 1, 'Advice');
                  addLog(`🧠 Gave advice to ${childName}`);
                  toast.success(`Gave advice to ${childName}`, { icon: '🧠' });
                }}
                className="justify-start"
              >
                🧠 Give Advice
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  if (!kidId) { toast.error('No active child'); return; }
                  if (!spendFocus(1, 'Send Help')) return;
                  applyMoneyDelta(-250, 'Financial help for adult child', { category: 'family' });
                  applyLoveToKidId(kidId, 2, 'Send Help');
                  applyStress(1, 'Send Help');
                  addLog(`💸 Sent $250 to ${childName}`);
                  toast.success(`Sent $250 to ${childName}`, { icon: '💸' });
                }}
                className="justify-start"
              >
                💸 Send $250
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}