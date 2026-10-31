import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trophy, X, Zap } from 'lucide-react';
import { CHALLENGE_CATALOG } from './challengeCatalog';
import { getChallengeProgress } from './challengeEngine';

function clampPct(n) {
  const x = Number(n) || 0;
  return Math.max(0, Math.min(100, x));
}

function ProgressBar({ pct }) {
  const p = clampPct(pct);
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p}%` }} />
    </div>
  );
}

function ObjectiveLine({ obj }) {
  const cur = Number(obj.current ?? 0);
  const tgt = Number(obj.target ?? 0);
  const done = Boolean(obj.done);
  return (
    <div className="flex items-center justify-between text-xs text-slate-600">
      <div className="flex items-center gap-2">
        {done ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 rounded-full border border-slate-300" />}
        <span className={done ? 'line-through text-slate-400' : ''}>{obj.label}</span>
      </div>
      <span className="tabular-nums">{cur}/{tgt}</span>
    </div>
  );
}

function ChallengeCard({ challenge, state, onActivate, onDeactivate, variant = 'full', disabledActivate = false }) {
  const { done, pct, objectives } = state;
  const compact = variant === 'compact';

  return (
    <div className={`rounded-xl border ${done ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800 leading-tight">{challenge.title}</h4>
            {done && <Trophy className="w-4 h-4 text-amber-600" />}
          </div>
          {!compact && <p className="text-sm text-slate-600 mt-1">{challenge.description}</p>}
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3" /> Reward: 💎 {challenge.rewardDiamonds}</span>
            <span>•</span>
            <span className="capitalize">{challenge.difficulty}</span>
            {challenge.category ? (<><span>•</span><span>{challenge.category}</span></>) : null}
          </div>
        </div>

        <div className="flex gap-2">
          {onDeactivate ? (
            <Button variant="outline" size="sm" onClick={() => onDeactivate(challenge.id)}>
              <X className="w-4 h-4 mr-1" /> Deactivate
            </Button>
          ) : null}
          {onActivate ? (
            <Button size="sm" onClick={() => onActivate(challenge.id)} disabled={disabledActivate}>
              Activate
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <ProgressBar pct={pct} />
        <div className="space-y-1">
          {(compact ? objectives.slice(0, 2) : objectives).map((o, idx) => (
            <ObjectiveLine key={`${challenge.id}_obj_${idx}`} obj={o} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChallengesPanel({ variant = 'full' }) {
  const { gameState, activateChallenge, deactivateChallenge } = useGameState();

  const meta = gameState?.challengeMeta || { activeIds: [], completedIds: [], rewardedIds: [] };
  const activeIds = Array.isArray(meta.activeIds) ? meta.activeIds : [];
  const completedIds = Array.isArray(meta.completedIds) ? meta.completedIds : [];

  const active = CHALLENGE_CATALOG.filter(c => activeIds.includes(c.id));
  const completed = CHALLENGE_CATALOG.filter(c => completedIds.includes(c.id));
  const available = CHALLENGE_CATALOG.filter(c => !activeIds.includes(c.id) && !completedIds.includes(c.id));

  const maxActive = 3;
  const canActivateMore = active.length < maxActive;

  const compute = (c) => getChallengeProgress(gameState, c);

  const compact = variant === 'compact';
  const showAvailable = !compact;
  const showCompleted = !compact;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Challenges</h2>
          <p className="text-sm text-slate-600 mt-1">
            Activate up to {maxActive} at a time. Complete them to earn 💎 20 each.
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Active: {active.length}/{maxActive}</div>
          <div>Completed: {completed.length}/{CHALLENGE_CATALOG.length}</div>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active</h3>
        {active.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">No active challenges. Activate one below to start a hunt.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {active.map(c => (
              <ChallengeCard key={c.id} challenge={c} state={compute(c)} onDeactivate={deactivateChallenge} variant={variant} />
            ))}
          </div>
        )}
      </section>

      {showAvailable && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available</h3>
          <div className="grid gap-3">
            {available.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                state={compute(c)}
                onActivate={activateChallenge}
                disabledActivate={!canActivateMore}
                variant={variant}
              />
            ))}
          </div>
          {!canActivateMore ? <p className="text-xs text-slate-500">Deactivate a challenge to activate another.</p> : null}
        </section>
      )}

      {showCompleted && (
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</h3>
          {completed.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">No completed challenges yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {completed.map(c => (
                <ChallengeCard key={c.id} challenge={c} state={compute(c)} variant={variant} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}