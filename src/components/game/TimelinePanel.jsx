import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import PullToRefresh from '@/components/utils/PullToRefresh';

const kindIcons = {
  major: '🎭',
  bond: '❤️',
  play: '🎮',
  study: '📘',
  tutor: '👨‍🏫',
  routine: '🕒',
  strategy: '🌿',
  tool: '🧰',
  micro: '🌦️',
  memory: '📝',
  system: '🗓️',
  job: '💼'
};

export default function TimelinePanel({ onOpenFullTimeline }) {
  const { gameState, updateState } = useGameState();
  const { timelineEntries, timelineExpanded } = gameState;

  const toggleExpanded = () => {
    updateState({ timelineExpanded: !timelineExpanded });
  };

  // Get last 4 entries for collapsed view
  const recentEntries = [...timelineEntries].reverse().slice(0, 4);

  // Group entries by age for expanded view
  const groupedByAge = {};
  timelineEntries.forEach(entry => {
    if (!groupedByAge[entry.age]) {
      groupedByAge[entry.age] = [];
    }
    groupedByAge[entry.age].push(entry);
  });
  const ages = Object.keys(groupedByAge).sort((a, b) => b - a);

  const trimDetail = (text, maxLen = 80) => {
    if (!text || text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
  };

  const handleRefresh = async () => {
    // Refresh timeline data (in this case, trigger a re-render by toggling a state)
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-200 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBPanel SBPanel--scroll' : ''} flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <h3 className={`font-semibold text-slate-800 ${typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' ? 'SBHeaderTitle' : ''}`}>Just Happened</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenFullTimeline}
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            Full Timeline
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="flex items-center gap-1"
          >
            {timelineExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="text-xs">Expand</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {timelineEntries.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No events yet. Your story begins...</p>
      ) : (
        <>
          {/* Collapsed View */}
          {!timelineExpanded && (
            <div className="space-y-2">
              {recentEntries.map(entry => (
                <div key={entry.id} className="text-sm">
                  <div className="font-medium text-slate-700">
                    Age {entry.age} • {entry.title}
                  </div>
                  {entry.detail && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {trimDetail(entry.detail, 80)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Expanded View */}
          {timelineExpanded && (
            <PullToRefresh onRefresh={handleRefresh} enabled={true}>
              <div className="space-y-4 pb-4">
                {ages.map(age => (
                  <div key={age}>
                    <div className="text-xs font-bold text-slate-600 mb-2 sticky top-0 bg-white py-1">
                      Age {age}
                    </div>
                    <div className="space-y-2 pl-2">
                      {groupedByAge[age].reverse().map(entry => (
                        <div key={entry.id} className="flex gap-2 text-sm">
                          <span className="flex-shrink-0">{kindIcons[entry.kind] || '•'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-700">{entry.title}</div>
                            {entry.detail && (
                              <div className="text-xs text-slate-600 mt-0.5">{entry.detail}</div>
                            )}
                            {entry.effectsLine && (
                              <div className="text-xs text-slate-500 italic mt-1">{entry.effectsLine}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PullToRefresh>
          )}
        </>
      )}
    </div>
  );
}