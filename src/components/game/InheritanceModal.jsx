import React from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState } from '@/components/game/GameStateContext';
import { getTwistById, buildTwistChoices } from '@/components/game/inheritanceSystem';

function fmtMoney(n){
  const v = Math.round(Number(n||0));
  const sign = v < 0 ? '-' : '';
  return sign + '$' + Math.abs(v).toLocaleString();
}

export default function InheritanceModal({ open, onClose }) {
  const { gameState, updateState, addLog, applyStress, applyLove, applyMoneyDelta, recordTimelineEntry } = useGameState();
  const pending = gameState.inheritancePopupPending;
  const cases = gameState.inheritance?.cases || [];
  const activeCase = pending ? cases.find(c => c.id === pending.caseId) : null;

  if (!activeCase) return null;

  const { decedentType, decedentName, willStatus, estate, siblingActors, step, twist } = activeCase;
  const relation = decedentType === 'parent' ? 'Parent' : 'Grandparent';

  const siblingLine = (Array.isArray(siblingActors) && siblingActors.length > 0)
    ? 'Siblings eye each other like this will be a group project.'
    : null;

  const summary = [
    `Will: ${willStatus}`,
    `Estate: ${fmtMoney(estate.cash)} cash${estate.debt ? `, ${fmtMoney(estate.debt)} debt` : ''}`,
    estate.propertyShare ? `Property: ${estate.propertyShare.description} (${fmtMoney(estate.propertyShare.estimatedValue)})` : null,
    estate.heirloom ? `Heirloom: ${estate.heirloom.name}` : null
  ].filter(Boolean).join(' • ');

  const logChoice = (label) => {
    updateState(prev => ({
      inheritance: {
        ...(prev.inheritance || { cases: [] }),
        cases: (prev.inheritance?.cases || []).map(c => c.id === activeCase.id
          ? { ...c, playerChoiceHistory: [...(c.playerChoiceHistory||[]), `${prev.currentYear}: ${label}`], twist: c.twist ? { ...c.twist, history: [ ...(c.twist.history||[]), `${prev.currentYear}: ${label}` ] } : c.twist }
          : c)
      }
    }));
  };

  const resolveCase = (deltaCash = 0, extra = {}) => {
    // Apply final deltas and resolve
    if (deltaCash !== 0) applyMoneyDelta(deltaCash, 'Inheritance');
    updateState(prev => ({
      inheritance: {
        ...(prev.inheritance || { cases: [] }),
        cases: (prev.inheritance?.cases || []).map(c => c.id === activeCase.id
          ? { ...c, status: 'resolved', resolvedYear: prev.currentYear, ...extra }
          : c)
      },
      inheritancePopupPending: null
    }));

    recordTimelineEntry({
      kind: 'system',
      title: '🧾 Inheritance Resolved',
      detail: `${relation} ${decedentName} • ${summary}`,
      deltas: null,
      moneyDelta: deltaCash,
      loveDelta: 0,
      stressDelta: 0
    });

    onClose();
  };

  const keepOpenAdvance = (extra = {}) => {
    // Keep case open but advance step (max 2 follow-ups => steps 0,1,2)
    updateState(prev => ({
      inheritance: {
        ...(prev.inheritance || { cases: [] }),
        cases: (prev.inheritance?.cases || []).map(c => c.id === activeCase.id
          ? { ...c, step: Math.min((c.step||0) + 1, 2) , lastShownYear: prev.currentYear, ...extra }
          : c)
      },
      inheritancePopupPending: null
    }));
    onClose();
  };

  let choices = [];

  if (twist) {
    const ctx = { gameState, activeCase, caseId: activeCase.id, updateState, applyStress, applyLove, applyMoneyDelta, resolveCase, keepOpenAdvance, onClose };
    choices = buildTwistChoices(twist.id, twist.step||0, ctx);
  } else {
    // 1) Accept and move on: small stress relief, resolve with net estate (cash - debt)
    choices.push({
      label: 'Accept and move on',
      onClick: () => {
        logChoice('Accept and move on');
        applyStress(-0.05, 'Inheritance');
        const net = Math.round(Number(estate.cash||0) - Number(estate.debt||0)) || 0;
        resolveCase(net);
      }
    });
  }

  if (!twist) {
    // 2) Contest the will: medium stress, uncertain outcome. Keep open once.
    choices.push({
      label: 'Contest the will',
      onClick: () => {
        logChoice('Contest the will');
        applyStress(0.12, 'Inheritance');
        // 50/50 drift of estate cash by +/-10%
        const up = Math.random() < 0.5;
        const drift = up ? +0.1 : -0.1;
        const newCash = Math.max(0, Math.round((estate.cash||0) * (1 + drift)));
        keepOpenAdvance({ estate: { ...estate, cash: newCash } });
      }
    });
  }

  if (!twist) {
    // 3) Call a family meeting: small love/stress change, conflict can drift towards resolution
    choices.push({
      label: 'Call a family meeting',
      onClick: () => {
        logChoice('Call a family meeting');
        applyLove(0.05, 'Inheritance');
        const resolveNow = Math.random() < 0.35;
        if (resolveNow || step >= 2) {
          const net = Math.round(Number(estate.cash||0) - Number(estate.debt||0)) || 0;
          resolveCase(net);
        } else {
          // small debt reduction as someone steps up
          const newDebt = Math.max(0, Math.round((estate.debt||0) * 0.9));
          keepOpenAdvance({ estate: { ...estate, debt: newDebt } });
        }
      }
    });
  }

  if (!twist) {
    // 4) Hire a lawyer: costs money, faster resolution likely
    choices.push({
      label: 'Hire a lawyer',
      onClick: () => {
        logChoice('Hire a lawyer');
        const tier = estimateWealthTier(estate);
        const fee = lawyerFeeForTier(tier);
        applyMoneyDelta(-fee, 'Inheritance - Lawyer');
        applyStress(0.06, 'Inheritance');
        const win = Math.random() < 0.55;
        const cash = Math.round((estate.cash||0) * (win ? 1.15 : 0.9));
        const final = Math.round(cash - (estate.debt||0));
        resolveCase(final);
      }
    });
  }

  if (!twist && Array.isArray(siblingActors) && siblingActors.length > 0) {
    // 5) Let sibling handle it (if exists): high variance
    choices.push({
      label: 'Let your sibling handle it',
      onClick: () => {
        logChoice('Let sibling handle it');
        const good = Math.random() < 0.5;
        if (good) {
          applyStress(-0.05, 'Inheritance');
          const net = Math.round(Number(estate.cash||0) - Number(estate.debt||0)) + Math.round((estate.cash||0) * 0.05);
          resolveCase(net);
        } else {
          applyStress(0.1, 'Inheritance');
          // Lose some value due to fees/mistakes
          const net = Math.round((Number(estate.cash||0) - Number(estate.debt||0)) * 0.8);
          resolveCase(net);
        }
      }
    });
  }

  return (
    <GameModalShell
      open={open}
      onClose={() => {
        // Prevent closing without acting: take first available choice
        choices[0]?.onClick();
      }}
      title="Inheritance Chaos"
      subtitle={`${relation}: ${decedentName}`}
      footer={null}
      maxWidth="max-w-lg"
    >
      <div className="space-y-3 text-sm text-slate-700">
        <div className="text-slate-600">{summary}</div>
        {siblingLine && (
          <div className="text-xs text-slate-500">{siblingLine}</div>
        )}
        {twist && (
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="text-sm font-semibold">🧨 Twist</div>
            <div className="text-slate-800 font-medium">{twist.title}</div>
            <div className="text-slate-700 text-sm">{twist.reveal}</div>
          </div>
        )}
        <div className="pt-1 grid gap-2">
          {choices.map((c, idx) => (
            <button
              key={idx}
              onClick={c.onClick}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-left font-medium"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </GameModalShell>
  );
}

function estimateWealthTier(estate) {
  const cash = Number(estate?.cash||0);
  if (cash >= 40000) return 'high';
  if (cash >= 8000) return 'middle';
  return 'low';
}

function lawyerFeeForTier(tier) {
  if (tier === 'high') return 8000 + Math.round(Math.random() * 17000);
  if (tier === 'middle') return 1000 + Math.round(Math.random() * 4000);
  return 200 + Math.round(Math.random() * 600);
}