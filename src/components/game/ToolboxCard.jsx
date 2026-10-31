import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { BookMarked } from 'lucide-react';

export default function ToolboxCard() {
  const { gameState } = useGameState();
  const techniquesUnlocked = gameState?.techniquesUnlocked || {};

  const techniques = [
    { id: 'nvc', emoji: '🕊️', name: 'Nonviolent Communication' },
    { id: 'pospsych', emoji: '🌞', name: 'Positive Psychology' },
    { id: 'boundaries', emoji: '🧱', name: 'Consistent Boundaries' },
    { id: 'coreg', emoji: '🧘', name: 'Co-regulation Basics' }
  ];

  const unlocked = techniques.filter(t => techniquesUnlocked[t.id]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <BookMarked className="w-4 h-4 text-slate-500" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          What You've Studied
        </h3>
      </div>
      {unlocked.length === 0 ? (
        <p className="text-sm text-slate-500">
          Nothing yet. Studying unlocks better options in tough moments.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {unlocked.map(t => (
            <div 
              key={t.id}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-sm"
            >
              <span>{t.emoji}</span>
              <span className="text-slate-700">{t.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}