import React from 'react';
import { getStatDisplayNameTitle } from '@/components/game/statLabels';

function comma(n) {
  const s = String(Math.round(Math.abs(Number(n) || 0)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function OutcomeStatsSummary({ gameState, stats }) {
  if (!gameState || !stats) return null;

  const pairs = [
    { key: 'intelligence', label: 'CURIOSITY', value: Number(stats.intelligence || 0), labelLong: getStatDisplayNameTitle('intelligence') },
    { key: 'empathy', label: 'EMP', value: Number(stats.empathy || 0), labelLong: 'Empathy' },
    { key: 'discipline', label: 'DIS', value: Number(stats.discipline || 0), labelLong: 'Discipline' },
    { key: 'confidence', label: 'CON', value: Number(stats.confidence || 0), labelLong: 'Confidence' },
  ].sort((a,b) => b.value - a.value);

  const best = pairs[0] || { labelLong: 'Stat', value: 0 };
  const worst = pairs[pairs.length - 1] || { labelLong: 'Stat', value: 0 };

  const love = Math.round(Number(gameState.love || 0));
  const stress = Math.round(Number(gameState.stress || 0));
  const harm = Number(gameState?.counters?.harmCount || 0);
  const money = Math.floor(Number(gameState.money || 0));
  const retirement = Math.floor(Number(gameState.retirementSavings || 0));

  return (
    <div className="mb-4 border border-white/10 rounded-xl p-4 bg-white/5 text-center">
      <div className="text-sm text-slate-300">
        <div className="font-medium text-slate-100">
          Build: Best {best.labelLong} {Math.round(best.value)} • Growth edge: {worst.labelLong} {Math.round(worst.value)}
        </div>
        <div className="mt-1 text-slate-400">
          Love {love} • Stress {stress} • Harm {harm}
        </div>
        <div className="mt-1 text-slate-400">
          Money ${comma(money)} • Retirement ${comma(retirement)}
        </div>
      </div>
    </div>
  );
}