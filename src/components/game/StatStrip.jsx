import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, describeStat, hasAnyChild } from '@/components/game/GameStateContext';
import { getStatDisplayName } from '@/components/game/statLabels';

export default function StatStrip() {
  const { gameState } = useGameState();
  const hasChild = hasAnyChild(gameState);
  const stats = (gameState?.stats && typeof gameState.stats === "object")
    ? gameState.stats
    : { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
  const { love, stress, actionPoints, maxFocusTokens } = gameState;
  const safeMaxFocus = Math.max(1, Number(maxFocusTokens ?? 3));
  const navigate = useNavigate();

  const getToneColor = (tone) => {
    if (tone === 'bad') return 'bg-red-500';
    if (tone === 'mid') return 'bg-yellow-500';
    if (tone === 'good') return 'bg-emerald-500';
    if (tone === 'extreme') return 'bg-purple-500';
    return 'bg-gray-400';
  };

  const getStatPercent = (value) => {
    return Math.min(100, Math.max(0, ((value + 5) / 55) * 100));
  };

  if (!hasChild) {
    // Child-free adult strip
    const babyPressure = Number(gameState.babyPressure ?? 0);
    
    const adultStats = [
      { icon: '❤️', label: 'LOVE', value: love, key: 'love' },
      { icon: '😮‍💨', label: 'STRESS', value: stress, key: 'stress' },
      { icon: '🍼', label: 'PRESS', value: babyPressure, key: 'babyPressure' },
      { icon: '⏳', label: 'FOCUS', value: actionPoints, max: safeMaxFocus, key: 'focus' }
    ];

    return (
      <button
        onClick={() => navigate(createPageUrl('Wellbeing'))}
        className="w-full bg-white border-b border-slate-200 p-3 hover:bg-amber-50 transition-colors active:scale-[0.99]"
      >
        <div className="grid grid-cols-4 gap-2">
          {adultStats.map((stat) => {
            if (stat.key === 'focus') {
              return (
                <div key={stat.key} className="relative">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                    <div className="text-lg leading-none">{stat.icon}</div>
                    <div className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {Math.round(stat.value)}/{Math.round(stat.max)}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-b-lg overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(stat.value / stat.max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            }

            const desc = stat.key === 'babyPressure'
              ? { tone: stat.value >= 90 ? 'bad' : stat.value >= 75 ? 'bad' : stat.value >= 50 ? 'mid' : 'good' }
              : describeStat(stat.key, stat.value);
            const percent = stat.key === 'babyPressure' ? stat.value : Math.min(100, Math.max(0, ((stat.value + 5) / 55) * 100));
            const colorClass = getToneColor(desc.tone);

            return (
              <div key={stat.key} className="relative">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                  <div className="text-lg leading-none">{stat.icon}</div>
                  <div className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {Math.round(stat.value)}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-b-lg overflow-hidden">
                  <div
                    className={`h-full ${colorClass} transition-all`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-400 text-center mt-2">
          Tap to view wellbeing
        </div>
      </button>
    );
  }

  const childStats = [
    { icon: '🧠', label: 'CUR', value: stats.intelligence, key: 'intelligence' },
    { icon: '💚', label: 'EMP', value: stats.empathy, key: 'empathy' },
    { icon: '🛡️', label: 'DIS', value: stats.discipline, key: 'discipline' },
    { icon: '⭐', label: 'CON', value: stats.confidence, key: 'confidence' }
  ];

  const parentStats = [
    { icon: '❤️', label: 'LOVE', value: love, key: 'love' },
    { icon: '😮‍💨', label: 'STRESS', value: stress, key: 'stress' }
  ];

  return (
    <button
      onClick={() => navigate(createPageUrl('DevelopmentDetails'))}
      className="w-full bg-white border-b border-slate-200 p-3 hover:bg-amber-50 transition-colors active:scale-[0.99]"
    >
      {/* Row 1: Child Stats */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        {childStats.map((stat) => {
          const desc = describeStat(stat.key, stat.value);
          const percent = getStatPercent(stat.value);
          const colorClass = getToneColor(desc.tone);

          return (
            <div key={stat.key} className="relative">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                <div className="text-lg leading-none">{stat.icon}</div>
                <div className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-sm font-bold text-slate-800">{Math.round(stat.value)}</div>
              </div>
              {/* Micro bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-b-lg overflow-hidden">
                <div
                  className={`h-full ${colorClass} transition-all`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Parent Stats + Focus */}
      <div className="grid grid-cols-3 gap-2">
        {parentStats.map((stat) => {
          const desc = describeStat(stat.key, stat.value);
          const percent = getStatPercent(stat.value);
          const colorClass = getToneColor(desc.tone);

          return (
            <div key={stat.key} className="relative">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
                <div className="text-lg leading-none">{stat.icon}</div>
                <div className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-sm font-bold text-slate-800">{Math.round(stat.value)}</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-b-lg overflow-hidden">
                <div
                  className={`h-full ${colorClass} transition-all`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Focus */}
        <div className="relative">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50">
            <div className="text-lg leading-none">⏳</div>
            <div className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
              FOCUS
            </div>
            <div className="text-sm font-bold text-slate-800">
              {Math.round(actionPoints)}/{Math.round(safeMaxFocus)}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(actionPoints / safeMaxFocus) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center mt-2">
        Tap to view full stats
      </div>
    </button>
  );
}