import React from 'react';
import { useNavigate } from 'react-router-dom';
import SafeStorybookImage from '@/components/storybook/SafeStorybookImage';
import { getPostcardPool } from '@/components/storybook/imageMap';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState, describeStat, formatMoney } from '../components/game/GameStateContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { currentYear, stats, love, stress, money, actionPoints, maxFocusTokens } = gameState;

  const SHOW_DASHBOARD_GUIDANCE_CARDS = false; // RETIRED
  const isStorybook = (typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook') || gameState.settings?.uiTheme === 'storybook';
  const pool = getPostcardPool();
  const postcardIdx = pool.length ? (Math.abs(Number(currentYear) || 0) % pool.length) : -1;
  const postcardSrc = postcardIdx >= 0 ? pool[postcardIdx] : null;

  const sections = [
    {
      id: 'bond',
      emoji: '❤️',
      title: 'Bond',
      value: `${love.toFixed(1)}`,
      label: describeStat('love', love).label,
      route: 'Bond'
    },
    {
      id: 'wellbeing',
      emoji: '🌿',
      title: 'Wellbeing',
      value: `Stress: ${stress.toFixed(1)}`,
      label: describeStat('stress', stress).label,
      route: 'Wellbeing'
    },
    {
      id: 'mind',
      emoji: '🧠',
      title: 'Mind',
      value: `INT ${stats.intelligence.toFixed(1)}`,
      label: describeStat('intelligence', stats.intelligence).label,
      route: 'DevelopmentDetails'
    },
    {
      id: 'growth',
      emoji: '📈',
      title: 'Growth',
      value: `CON ${stats.confidence.toFixed(1)}`,
      label: describeStat('confidence', stats.confidence).label,
      route: 'Strategies'
    }
  ];

  return (
    <div className={isStorybook ? 'min-h-screen p-4' : 'min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/30 p-4'}>
      <div className="rt-container">
        <button
          onClick={() => navigate('/game')}
          className="mb-4 p-2 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Return to Game</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">🏠 Dashboard</h1>
        <p className="text-sm text-slate-600 mb-3">Overview of your journey</p>

        {isStorybook && postcardSrc && (
          <div className="mb-4 SBModalIllustration rounded-[18px] p-2" style={{ height: 140 }}>
            <div className="SBModalIllustrationFrame relative w-full h-full rounded-[14px] overflow-hidden">
              <SafeStorybookImage src={postcardSrc} alt="Postcard" className="w-full h-full" imgStyle={{ objectFit: 'cover' }} />
            </div>
          </div>
        )}

        {isStorybook && SHOW_DASHBOARD_GUIDANCE_CARDS && (
          <div className="SBPanel p-4 rounded-xl border border-slate-200 mb-4">
            <div className="SBHeaderTitle text-sm mb-2">Next Step</div>
            <p className="text-sm text-slate-600 mb-3">Head back to the game to pick your next action.</p>
            <Button onClick={() => navigate('/game')}>
              Open Game
            </Button>
          </div>
        )}

        {/* Age & Resources */}
        <div className={`bg-white rounded-xl border border-slate-200 p-5 mb-4 ${isStorybook ? 'SBPanel' : ''}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Age</div>
              <div className="text-2xl font-bold text-slate-800">{currentYear}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Focus</div>
              <div className="text-2xl font-bold text-indigo-600">{actionPoints}/{maxFocusTokens}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Money</div>
              <div className="text-lg font-bold text-emerald-600">${formatMoney(money)}</div>
            </div>
          </div>
        </div>

        {/* Section Summary Cards */}
        <div className="space-y-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(createPageUrl(section.route))}
              className={`w-full bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] transition-all p-4 text-left ${isStorybook ? 'SBPanel' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{section.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 mb-1">{section.title}</div>
                  <div className="text-sm text-slate-600">
                    {section.value} • {section.label}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {isStorybook && Array.isArray(gameState.timeline) && gameState.timeline.length > 0 && (
          <div className="SBPanel p-4 rounded-xl border border-slate-200 mt-4">
            <div className="SBHeaderTitle text-sm">Recent</div>
            <div className="h-px my-2" style={{ background: 'linear-gradient(90deg, var(--sb-ink), transparent 85%)', opacity: 0.25 }} />
            <ul className="space-y-2">
              {gameState.timeline.slice(-6).reverse().map((t, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sb-ink)' }} />
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">{t.title || t.kind}</span>
                    {t.detail ? <span className="text-slate-500"> — {t.detail}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}