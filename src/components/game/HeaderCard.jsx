import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Baby, Cake, BookOpen, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeaderCard() {
  const { gameState, countUnlockedTechniques, studiedGlowActive } = useGameState();
  const { childName, currentYear, temperament, money, phoneOwned, love, stress } = gameState;

  const unlockedCount = countUnlockedTechniques();
  const hasStudied = studiedGlowActive();

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 shadow-lg text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
            <Baby className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight flex items-center gap-1.5">
              {childName}
              {phoneOwned && <span className="text-base">📱</span>}
            </h2>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Cake className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Age {currentYear}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Temperament: {temperament}</p>
            <p className="text-xs text-emerald-300 mt-0.5">Money: ${money} • ❤️ Love: {love} • 😮‍💨 Stress: {stress}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("ParentTools")}>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <Wrench className="w-4 h-4 mr-1" />
              Tools
            </Button>
          </Link>
          <Link to={createPageUrl("StudyHistory")}>
            <Button 
              variant={hasStudied ? "default" : "ghost"}
              size="sm"
              className={hasStudied ? "bg-amber-500 hover:bg-amber-600 text-white relative" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Study
              {hasStudied && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unlockedCount}
                </span>
              )}
            </Button>
          </Link>
          <Link to={createPageUrl("Start")}>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}