import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext";
import { ACHIEVEMENTS, FINANCE_COLLECTIBLES } from '@/components/game/achievements';
import { CAREER_COLLECTIBLES } from '@/components/game/careerCollectibles';
import { TROPHY_DEFS } from '@/components/game/trophyDefinitions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import BadgeCard from '@/components/metaBadges/BadgeCard';
import BadgeDetailModal from '@/components/metaBadges/BadgeDetailModal';

export default function TrophyCase() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { unlockedAchievementIds, trophies, financeCollectionUnlocked, careerCollectionUnlocked = {} } = gameState;

  // Tabs + Badges data
  const [tab, setTab] = React.useState('trophies');
  const [badgeDefs, setBadgeDefs] = React.useState([]);
  const [badgeEarnedMap, setBadgeEarnedMap] = React.useState({});
  const [selectedBadge, setSelectedBadge] = React.useState(null);
  const [meId, setMeId] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await base44.auth.me();
        if (mounted) setMeId(me?.id || null);
      } catch {}
      try {
        const defs = await base44.entities.BadgeDefinition.list();
        if (mounted) setBadgeDefs(defs || []);
      } catch {
        if (mounted) setBadgeDefs([]);
      }
      try {
        if (!meId) {
          const me = await base44.auth.me().catch(()=>null);
          if (mounted) setMeId(me?.id || null);
        }
        if (meId) {
          const earnedArr = await base44.entities.BadgeEarned.filter({ userId: meId }).catch(()=>[]);
          const map = {};
          (earnedArr || []).forEach(e => { map[e.badgeId] = e; });
          if (mounted) setBadgeEarnedMap(map);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, [meId]);

  const unlockedTrophies = trophies?.unlocked || {};
  const unlockedFinance = financeCollectionUnlocked || {};
  const unlockedAchievementsCount = unlockedAchievementIds.length;
  const unlockedTrophiesCount = Object.keys(unlockedTrophies).length;
  const unlockedFinanceCount = Object.keys(unlockedFinance).length;
  const totalAchievementsCount = ACHIEVEMENTS.length;
  const totalTrophiesCount = TROPHY_DEFS.length;
  const totalFinanceCount = FINANCE_COLLECTIBLES.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Button
              onClick={() => navigate(createPageUrl('Game'))}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">🏆 Trophy Case</h1>
              <p className="text-sm text-slate-500">
                {unlockedAchievementsCount + unlockedTrophiesCount + unlockedFinanceCount + Object.keys(careerCollectionUnlocked||{}).length} / {totalAchievementsCount + totalTrophiesCount + totalFinanceCount + CAREER_COLLECTIBLES.length} unlocked
              </p>
            </div>
          </div>
        </motion.div>

        {tab === 'trophies' && (<>
        {/* Legendary Trophies Section */}
        {TROPHY_DEFS.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span className="text-xl">🌟</span>
              Legendary Trophies
            </h2>
            <div className="grid gap-3">
              {TROPHY_DEFS.map((trophy, idx) => {
                const isUnlocked = unlockedTrophies[trophy.id];
                
                return (
                  <motion.div
                    key={trophy.id}
                    className={`rounded-2xl p-5 border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg'
                        : 'bg-white/60 border-slate-200 opacity-60'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                        isUnlocked ? 'bg-purple-100' : 'bg-slate-100'
                      }`}>
                        {isUnlocked ? trophy.icon : <Lock className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            isUnlocked ? 'text-slate-800' : 'text-slate-500'
                          }`}>
                            {isUnlocked ? trophy.name : (trophy.secret ? trophy.lockedName : trophy.name)}
                          </h3>
                          {isUnlocked && (
                            <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                              Legendary
                            </span>
                          )}
                        </div>
                        <p className={`text-sm leading-relaxed ${
                          isUnlocked ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {isUnlocked ? trophy.desc : (trophy.secret ? trophy.lockedDesc : trophy.desc)}
                        </p>
                        {isUnlocked && unlockedTrophies[trophy.id].note && (
                          <p className="text-xs text-purple-600 mt-2 italic">
                            {unlockedTrophies[trophy.id].note}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Finance Collection Section */}
        {FINANCE_COLLECTIBLES.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span className="text-xl">💼</span>
              Finance Collection
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {FINANCE_COLLECTIBLES.map((collectible, idx) => {
                const isUnlocked = unlockedFinance[collectible.id];
                
                return (
                  <motion.div
                    key={collectible.id}
                    className={`rounded-xl p-4 border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-sm'
                        : 'bg-white/60 border-slate-200 opacity-50'
                    }`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-2xl mb-2 ${
                        isUnlocked ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        {isUnlocked ? collectible.emoji : <Lock className="w-4 h-4 text-slate-400" />}
                      </div>
                      <h3 className={`text-xs font-semibold mb-1 ${
                        isUnlocked ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {collectible.title}
                      </h3>
                      <p className={`text-[10px] leading-relaxed ${
                        isUnlocked ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {collectible.description}
                      </p>
                      {isUnlocked && unlockedFinance[collectible.id].note && (
                        <p className="text-[9px] text-emerald-700 mt-1 italic">
                          {unlockedFinance[collectible.id].note}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Career Collection Section */}
        {CAREER_COLLECTIBLES.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span className="text-xl">💼</span>
              Career Collection
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CAREER_COLLECTIBLES.map((c, idx) => {
                const isUnlocked = (careerCollectionUnlocked||{})[c.id];
                return (
                  <motion.div
                    key={c.id}
                    className={`rounded-xl p-4 border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-300 shadow-sm'
                        : 'bg-white/60 border-slate-200 opacity-50'
                    }`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-2xl mb-2 ${
                        isUnlocked ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                        {isUnlocked ? c.emoji : <Lock className="w-4 h-4 text-slate-400" />}
                      </div>
                      <h3 className={`text-xs font-semibold mb-1 ${
                        isUnlocked ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {c.title}
                      </h3>
                      <p className={`text-[10px] leading-relaxed ${
                        isUnlocked ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {c.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Achievements Section */}
        <div>
          <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span className="text-xl">🏅</span>
            Achievements
          </h2>
          <div className="grid gap-3">
            {ACHIEVEMENTS.map((achievement, idx) => {
              const isUnlocked = unlockedAchievementIds.includes(achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm'
                    : 'bg-white/60 border-slate-200 opacity-60'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    isUnlocked ? 'bg-amber-100' : 'bg-slate-100'
                  }`}>
                    {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        isUnlocked ? 'text-slate-800' : 'text-slate-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      {isUnlocked && (
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isUnlocked ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>

        {/* Footer Hint */}
        <motion.p 
          className="text-center text-xs text-slate-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Achievements reward healthy effort and learning, not perfection. Legendary trophies are rare secrets.
        </motion.p>
        </>)}

        {tab === 'badges' && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span className="text-xl">🎖️</span>
              Meta Badges
            </h2>
            {badgeDefs.length === 0 ? (
              <div className="text-sm text-slate-500">No badges defined yet.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {badgeDefs.map((def) => {
                  const earned = badgeEarnedMap[def.id];
                  const latestRunTs = Number(gameState?.lastRunSummary?.ts || 0);
                  const updatedAt = new Date(earned?.lastUpgradedAt || earned?.firstEarnedAt || 0).getTime();
                  const isNew = !!earned && latestRunTs > 0 && updatedAt >= latestRunTs;
                  return (
                    <BadgeCard
                      key={def.id}
                      def={def}
                      earned={earned}
                      isNew={isNew}
                      onClick={() => setSelectedBadge({ def, earned })}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        <BadgeDetailModal
          open={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
          def={selectedBadge?.def}
          earned={selectedBadge?.earned}
        />
      </div>
    </div>
  );
}