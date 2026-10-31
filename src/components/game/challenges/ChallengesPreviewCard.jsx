import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/components/game/GameStateContext';
import { CHALLENGE_CATALOG } from './challengeCatalog';
import { getChallengeProgress } from './challengeEngine';

function ProgressBar({ pct }) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p}%` }} />
    </div>
  );
}

export default function ChallengesPreviewCard() {
  const navigate = useNavigate();
  const { gameState } = useGameState();

  const meta = gameState?.challengeMeta || { activeIds: [], completedIds: [], rewardedIds: [] };
  const activeIds = Array.isArray(meta.activeIds) ? meta.activeIds : [];
  const completedIds = Array.isArray(meta.completedIds) ? meta.completedIds : [];

  const active = CHALLENGE_CATALOG.filter(c => activeIds.includes(c.id));
  const activeTop = active.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Challenges</h3>
          <p className="text-sm text-slate-600 mt-1">Earn 💎 20 per challenge (activate up to 3).</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('Challenges'))}>
          Open
        </Button>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Active: {active.length}/3 • Completed: {completedIds.length}/{CHALLENGE_CATALOG.length}
      </div>

      {activeTop.length === 0 ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-sm text-slate-700">No active challenges yet.</div>
          <div className="text-xs text-slate-500 mt-1">Tap Open to activate one.</div>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {activeTop.map(c => {
            const p = getChallengeProgress(gameState, c);
            return (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-800 text-sm">{c.title}</div>
                  <div className="text-xs text-slate-500 tabular-nums">{p.pct}%</div>
                </div>
                <div className="mt-2">
                  <ProgressBar pct={p.pct} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}