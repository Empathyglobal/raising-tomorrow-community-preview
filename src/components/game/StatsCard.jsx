import React from 'react';
import { useGameState, statTier, tierIcon, statBarPercent, getTierColor } from '@/components/game/GameStateContext';
import { Brain, Heart, Shield, Star, Crown } from 'lucide-react';
import { getStatDisplayNameTitle } from '@/components/game/statLabels';

const statConfig = {
  intelligence: { label: getStatDisplayNameTitle('intelligence'), icon: Brain, color: "from-blue-400 to-blue-600", abbr: "CURIOSITY" },
  empathy: { label: "Empathy", icon: Heart, color: "from-rose-400 to-rose-600", abbr: "EMP" },
  discipline: { label: "Discipline", icon: Shield, color: "from-amber-400 to-amber-600", abbr: "DIS" },
  confidence: { label: "Confidence", icon: Star, color: "from-violet-400 to-violet-600", abbr: "CON" }
};

function StatRow({ statKey, value, pb }) {
  const config = statConfig[statKey];
  const Icon = config.icon;
  const tier = statTier(statKey, value);
  const icon = tierIcon(value);
  const percent = statBarPercent(value);
  const tierColor = getTierColor(tier);

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center shadow-sm`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{config.label}: {Math.round(value)}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">{icon} {tier}</span>
            <span className="text-xs text-slate-400">PB: {Math.round(pb)}</span>
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function StatsCard() {
  const { gameState } = useGameState();
  const stats = (gameState?.stats && typeof gameState.stats === "object")
    ? gameState.stats
    : { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
  const { highWaterStats, lastChangeText, lastEventSource, lastMilestoneText } = gameState;

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Development</h3>
          <p className="text-xs text-slate-400 italic">A little nature, a lot of nurture.</p>
        </div>
        <div className="space-y-1">
          {Object.entries(stats || {}).map(([key, value]) => (
            <StatRow key={key} statKey={key} value={value} pb={highWaterStats?.[key] || 0} />
          ))}
        </div>
      </div>
      
      {gameState?.playerCareer?.royalty?.active && typeof gameState.royalReputation === 'number' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 mt-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Royal Reputation</span>
                <span className="text-xs text-slate-500">{Math.round(gameState.royalReputation)}/100</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${Math.min(100, Math.max(0, gameState.royalReputation))}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {lastChangeText && (
        <div className="bg-blue-50 rounded-xl px-3 py-2 border border-blue-100 -mt-2">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Last change{lastEventSource ? ` (${lastEventSource})` : ''}:</span> {lastChangeText}
          </p>
        </div>
      )}
      
      {lastMilestoneText && (
        <div className="bg-amber-50 rounded-xl px-3 py-2 border border-amber-200 -mt-2">
          <p className="text-xs text-amber-800 font-semibold">
            {lastMilestoneText}
          </p>
        </div>
      )}
    </>
  );
}