import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState, hasAnyChild } from '@/components/game/GameStateContext';
import { ChevronRight } from 'lucide-react';

export default function CompactStatusBar() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  
  const hasChild = hasAnyChild(gameState);
  if (!hasChild) return null;
  const { stats, love, stress, actionPoints, maxFocusTokens, statBuffer, playerHealth } = gameState;
  const displayStat = (key) => {
    const base = Number(stats?.[key] ?? 0);
    const buf = Number((statBuffer ?? {})[key] ?? 0);
    if (Math.abs(buf) >= 0.05) return (base + buf).toFixed(1);
    return Math.round(base);
  };

  const isStorybook = typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook';
  return (
    <button
      onClick={() => navigate(createPageUrl('DevelopmentDetails'))}
      className={`w-full transition-colors ${isStorybook ? '' : 'bg-white border-b border-slate-200 hover:bg-slate-50 active:bg-slate-100'}`}
    >
      <div className="rt-container py-2.5">
         <div className="flex items-center gap-1 min-w-0">
           {/* Stats Strip - Single line, no wrap */}
           <div className="flex flex-nowrap items-center gap-1 whitespace-nowrap overflow-x-auto min-w-0 no-scrollbar font-mono text-[11px] sm:text-sm">
            {/* Child Stats */}
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 border-r border-slate-200 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">🧠</span>
              <span className="font-semibold text-slate-700 tabular-nums text-[11px]">{displayStat('intelligence')}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 border-r border-slate-200 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">💚</span>
              <span className="font-semibold text-slate-700 tabular-nums text-[11px]">{displayStat('empathy')}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 border-r border-slate-200 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">🛡️</span>
              <span className="font-semibold text-slate-700 tabular-nums text-[11px]">{displayStat('discipline')}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 border-r border-slate-200 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">⭐</span>
              <span className="font-semibold text-slate-700 tabular-nums text-[11px]">{displayStat('confidence')}</span>
            </span>

            {/* Parent Stats */}
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 border-r border-slate-200 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">❤️</span>
              <span className="font-semibold text-rose-600 tabular-nums text-[11px]">{Math.round(love)}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 border-r border-slate-200 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">😮‍💨</span>
              <span className="font-semibold text-amber-600 tabular-nums text-[11px]">{Math.round(stress)}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2 flex-shrink-0 ${isStorybook ? 'bg-[#faf5eb] border border-[#2b2118] rounded-full shadow-sm' : ''}`} style={isStorybook ? { borderColor: 'rgb(43 33 24 / 0.18)' } : {}}>
              <span className="text-[12px] sm:text-sm">🫀</span>
              <span className={`font-semibold tabular-nums text-[11px] ${playerHealth <= 20 ? 'text-rose-700 animate-pulse' : playerHealth <= 35 ? 'text-rose-600' : 'text-slate-700'}`}>{Math.round(playerHealth || 0)}</span>
            </span>

          </div>

          {/* Chevron hint */}
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
        </div>
      </div>
    </button>
  );
}