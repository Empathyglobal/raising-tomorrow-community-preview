import React, { useState } from 'react';
import { useGameState } from "@/components/game/GameStateContext.jsx";
import DesktopRightRail from '@/components/game/DesktopRightRail';
import { UI_EMOJI } from "@/components/game/uiEmojis";
import { Separator } from "@/components/ui/separator";
import { getUiThemeFromDom } from '@/components/lib/uiTheme';
import StorybookChapterHeader from '@/components/storybook/StorybookChapterHeader';

export default function StoryTab() {
  const { gameState } = useGameState();
  const isStorybook = getUiThemeFromDom() === 'storybook';
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'major', label: 'Moments' },
    { id: 'bond', label: 'Actions' },
    { id: 'finance', label: 'Money' },
    { id: 'travel', label: 'Travel' },
    { id: 'study', label: 'Study' }
  ];

  const filteredEntries = gameState.timelineEntries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'bond') return ['bond', 'play', 'routine', 'strategy'].includes(entry.kind);
    return entry.kind === filter;
  });

  const kindIcons = {
    major: '🎭', bond: '❤️', play: '🎮', study: '📘', tutor: '👨‍🏫',
    routine: '🕒', strategy: '🌿', tool: '🧰', micro: '🌦️',
    memory: '📝', system: '🗓️', golden: '✨', pet: UI_EMOJI.pets, travel: UI_EMOJI.travel, 
    stress: UI_EMOJI.stress, scenario: '✨', tinyCute: '✨', kidWisdom: '💡',
    finance: UI_EMOJI.moneyTotal, job: '💼'
  };

  // Helper to render a single entry (preserves existing rendering)
  const renderEntry = (entry) => {
    const icon = kindIcons[entry.kind] || '•';

    if (entry.kind === 'micro') {
      return (
        <div key={entry.id} className="text-xs text-slate-600 py-1 leading-relaxed">
          {entry.title}
        </div>
      );
    }

    if (entry.kind === 'tinyCute') {
      return (
        <div 
          key={entry.id} 
          className="text-xs py-2 px-3 leading-snug rounded-lg"
          style={{ background: '#FFF4B8', borderLeft: '4px solid #FF4FA3' }}
        >
          ✨ {entry.title}
        </div>
      );
    }

    if (entry.kind === 'kidWisdom') {
      return (
        <div 
          key={entry.id} 
          className="text-xs py-2 px-3 leading-snug rounded-lg italic"
          style={{ background: '#E8F4FF', borderLeft: '4px solid #7C3AED' }}
        >
          {entry.title}
        </div>
      );
    }

    return (
      <div
        key={entry.id}
        className={isStorybook ? "rt-paper-panel rt-torn-all rt-paper-elev p-4" : "bg-white rounded-xl p-4 border border-slate-200"}
      >
        <div className="flex gap-3">
          <span className="flex-shrink-0 text-lg">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-slate-700 font-medium text-sm mb-1">{entry.title}</div>
            {entry.detail && (
              <div className="text-xs text-slate-500 leading-relaxed">{entry.detail}</div>
            )}
            {entry.deltas && Object.values(entry.deltas).some(v => v !== 0) && (
              <div className="text-xs text-slate-400 mt-2">
                {Object.entries(entry.deltas)
                  .filter(([_, v]) => v !== 0)
                  .map(([k, v]) => `${k.toUpperCase().slice(0, 3)} ${v > 0 ? '+' : ''}${v}`)
                  .join(' • ')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Build reversed and grouped entries by age
  const reversedEntries = [...filteredEntries].reverse();
  const groups = new Map();
  reversedEntries.forEach((e) => {
    const ageNum = Number.isFinite(e.age) ? Number(e.age) : null;
    const key = ageNum === null ? 'unknown' : ageNum;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  });
  const sortedAgeKeys = Array.from(groups.keys()).sort((a, b) => {
    const toNum = (x) => (typeof x === 'number' ? x : -Infinity);
    return toNum(b) - toNum(a);
  });

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4">
      <div className="rt-container">
        {isStorybook ? (
          <>
            <StorybookChapterHeader currentYear={gameState.currentYear} />
            <div className="SBDoodleDivider mb-3" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Story</h2>
            <p className="text-sm text-slate-500 mb-4">What happened so far</p>
          </>
        )}

        {/* Filter Chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === opt.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Timeline Feed */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-8">Nothing here yet</p>
          ) : (
            sortedAgeKeys.map((ageKey) => (
              <div key={`age-${ageKey}`}>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Age {ageKey === 'unknown' ? '—' : ageKey}
                </div>
                <Separator className="mb-2" />
                <div className="space-y-3">
                  {(groups.get(ageKey) || []).map((entry) => renderEntry(entry))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}