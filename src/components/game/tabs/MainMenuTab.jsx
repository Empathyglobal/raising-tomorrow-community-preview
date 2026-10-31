import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext.jsx";

const MAIN_TILES = [
  { id: 'dashboard', emoji: '🏠', label: 'Dashboard', route: '/dashboard' },
  { id: 'bond', emoji: '❤️', label: 'Bond', route: '/bond' },
  { id: 'wellbeing', emoji: '🌿', label: 'Wellbeing', route: '/wellbeing' },
  { id: 'mind', emoji: '🧠', label: 'Mind', route: '/mind' },
  { id: 'growth', emoji: '📈', label: 'Growth', route: '/growth' },
  { id: 'study', emoji: '🎓', label: 'Study', route: '/study-section' },
  { id: 'life', emoji: '🗓️', label: 'Life', route: '/life' },
  { id: 'journal', emoji: '🧾', label: 'Journal', route: '/journal' },
  { id: 'endgame', emoji: '🏁', label: 'Endgame', route: '/endgame' }
];

const QUICK_LINK_SECTIONS = [
  {
    id: 'collections',
    title: 'Collections',
    items: [
      { id: 'passport', emoji: '🛂', label: 'Passport', route: createPageUrl('Passport') },
      { id: 'bookshelf', emoji: '📚', label: 'Bookshelf', route: createPageUrl('Bookshelf') },
      { id: 'inventory', emoji: '🎒', label: 'Inventory', route: createPageUrl('Inventory') },
      { id: 'collections', emoji: '🗂️', label: 'Collections', route: createPageUrl('Collections') },
      { id: 'trophycase', emoji: '🏆', label: 'Trophy Case', route: createPageUrl('TrophyCase') },
      { id: 'toolbox', emoji: '🧠', label: 'Toolbox', route: createPageUrl('Toolbox') }
    ]
  },
  {
    id: 'tools_guides',
    title: 'Tools & Guides',
    items: [
      { id: 'parenttools', emoji: '🧰', label: 'Parent Tools', route: createPageUrl('ParentTools') },
      { id: 'strategies', emoji: '🧩', label: 'Strategies', route: createPageUrl('Strategies') },
      { id: 'tutoring', emoji: '👩‍🏫', label: 'Tutoring', route: createPageUrl('Tutoring') },
      { id: 'devdetails', emoji: '📊', label: 'Dev Details', route: createPageUrl('DevelopmentDetails') },
      { id: 'howtoplay', emoji: '🕹️', label: 'How To Play', route: createPageUrl('HowToPlay') }
    ]
  }
];

const BOTTOM_BARS = [
  { id: 'tools', emoji: '🎒', label: 'Tools', route: '/tools' },
  { id: 'sciencefair', emoji: '🔬', label: 'Science Fair', action: 'scienceFair' },
  { id: 'settings', emoji: '⚙️', label: 'Settings', action: 'settings' },
  { id: 'about', emoji: '❓', label: 'About', route: createPageUrl('About') }
];

export default function MainMenuTab({ onOpenSettings, onOpenScienceFair }) {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const [pinnedGoal, setPinnedGoal] = React.useState({ id: null, name: null });
  React.useEffect(() => {
    try {
      const id = localStorage.getItem('rt_pinned_goal_id');
      const name = localStorage.getItem('rt_pinned_goal_name');
      setPinnedGoal({ id, name });
    } catch {}
  }, []);

  const handleTileClick = (tile) => {
    if (tile.action === 'settings') {
      onOpenSettings?.();
    } else if (tile.action === 'scienceFair') {
      onOpenScienceFair?.();
    } else if (tile.route) {
      navigate(tile.route);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-24 pt-4">
      <div className="rt-container">
        <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Main Menu</h2>
          <p className="text-sm text-slate-500">Choose a category</p>
        </div>

        {pinnedGoal?.id ? (
          <div className="mb-4 p-3 rounded-xl border bg-white/80">
            <div className="text-xs text-slate-500">Next Unlock</div>
            <div className="font-semibold text-slate-800">{pinnedGoal.name || pinnedGoal.id}</div>
            <div className="mt-2">
              <button onClick={() => navigate(createPageUrl('Start') + '?entry=specialStarts')} className="SBButton SBButton--primary px-3 py-1.5 text-xs">View</button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate(createPageUrl('Start') + '?entry=specialStarts')} className="w-full mb-4 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-indigo-100">
            Choose a Goal
          </button>
        )}

            {/* 3×3 Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {MAIN_TILES.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className="aspect-square bg-white border-2 border-slate-200 rounded-2xl hover:border-amber-400 hover:bg-amber-50/50 active:scale-95 transition-all flex flex-col items-center justify-center p-4"
            >
              <span className="text-4xl mb-2">{tile.emoji}</span>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                {tile.label}
              </span>
            </button>
          ))}
        </div>

            {/* Quick Links */}
            <div className="space-y-5 mb-6">
          {QUICK_LINK_SECTIONS.map((section) => (
            <div key={section.id}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTileClick(item)}
                    className="w-full bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] transition-all p-3 flex items-center gap-2 text-left"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

            {/* Bottom Bars */}
            <div className="space-y-2">
          {BOTTOM_BARS.map((bar) => (
            <button
              key={bar.id}
              onClick={() => handleTileClick(bar)}
              className="w-full bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] transition-all p-4 flex items-center gap-3"
            >
              <span className="text-2xl">{bar.emoji}</span>
              <span className="text-sm font-semibold text-slate-700">{bar.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}