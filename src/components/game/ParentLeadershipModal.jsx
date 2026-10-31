import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatDeltas, PARENT_CIVIC_ROLE_DEFS } from '@/components/game/GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';

const DEFAULT_PARENT_CIVIC = {
  activeRoleId: null,
  roleStartAge: null,
  experienceByRoleId: {},
  lastAppliedAge: null
};

function getYears(state, roleId) {
  return Number(state?.experienceByRoleId?.[roleId] || 0);
}

function getEligibility(gameState, civic, roleDef) {
  // Only one role at a time
  if (civic?.activeRoleId) {
    return { enabled: false, reason: 'Abandon your current role first' };
  }

  // Age gate
  if (roleDef.minAge && gameState.currentYear < roleDef.minAge) {
    return { enabled: false, reason: `Available at age ${roleDef.minAge}` };
  }

  // School requirement (PTA + school events)
  if (roleDef.requiresSchool) {
    const inSchool = !!gameState.inSchool;
    const homeschool = gameState.schoolType === 'homeschool';
    if (!inSchool || homeschool) {
      return { enabled: false, reason: 'Requires being in school (not homeschool)' };
    }
  }

  // RequiresYears (AND)
  if (roleDef.requiresYears) {
    for (const [reqRoleId, reqYears] of Object.entries(roleDef.requiresYears)) {
      const years = getYears(civic, reqRoleId);
      if (years < reqYears) {
        const reqLabel = PARENT_CIVIC_ROLE_DEFS[reqRoleId]?.label || reqRoleId;
        return { enabled: false, reason: `Requires ${reqYears} year(s) as ${reqLabel}` };
      }
    }
  }

  // RequiresAnyOfYears (OR)
  if (roleDef.requiresAnyOfYears && Array.isArray(roleDef.requiresAnyOfYears)) {
    const ok = roleDef.requiresAnyOfYears.some(r => getYears(civic, r.roleId) >= r.years);
    if (!ok) {
      const pretty = roleDef.requiresAnyOfYears
        .map(r => `${r.years}y ${PARENT_CIVIC_ROLE_DEFS[r.roleId]?.label || r.roleId}`)
        .join(' OR ');
      return { enabled: false, reason: `Requires: ${pretty}` };
    }
  }

  return { enabled: true, reason: null };
}

function RoleCard({ roleDef, disabled, reason, onStart }) {
  const deltas = roleDef.yearlyDeltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
  const effectsLine = `${formatDeltas(deltas)} • STRESS +${roleDef.yearlyStressDelta} • Focus -${roleDef.focusCostPerYear}/age`;

  return (
    <div className={`p-4 rounded-xl border ${disabled ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{roleDef.emoji}</div>
        <div className="flex-1">
          <div className="font-semibold text-slate-800">{roleDef.label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{roleDef.desc}</div>
          <div className="text-[11px] text-slate-600 mt-2">Per age (cumulative): {effectsLine}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Starts applying next age. Only one role can be active at a time.
          </div>
          {disabled && reason && (
            <div className="text-[10px] text-slate-400 mt-2">{reason}</div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={onStart}
          disabled={disabled}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
            disabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99]'
          }`}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default function ParentLeadershipModal({ open, onClose }) {
  const { gameState, updateState, addLog, recordTimelineEntry, emitActionResult } = useGameState();

  const civic = gameState.parentCivic || DEFAULT_PARENT_CIVIC;
  const activeRoleDef = civic.activeRoleId ? PARENT_CIVIC_ROLE_DEFS[civic.activeRoleId] : null;
  const activeYears = civic.activeRoleId ? getYears(civic, civic.activeRoleId) : 0;

  const ptaRoles = Object.values(PARENT_CIVIC_ROLE_DEFS).filter(r => r.group === 'pta');
  const volunteerRoles = Object.values(PARENT_CIVIC_ROLE_DEFS).filter(r => r.group === 'volunteer');

  const startRole = (roleId) => {
    const def = PARENT_CIVIC_ROLE_DEFS[roleId];
    if (!def) return;

    updateState({
      parentCivic: {
        ...(civic || DEFAULT_PARENT_CIVIC),
        activeRoleId: roleId,
        roleStartAge: gameState.currentYear
      }
    });

    addLog(`📣 You sign up for: ${def.label}. Perks start next age (Focus -${def.focusCostPerYear}/age).`);
    recordTimelineEntry({
      kind: 'tool',
      title: `📣 Started: ${def.label}`,
      detail: `You took on a parent role. Perks start next age and cost ${def.focusCostPerYear} Focus/age while active.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { roleId }
    });

    const popup = pickMissingActionPopup("parentLeadership", "start");
    if (popup) {
      emitActionResult({
        actionId: "parentLeadership",
        title: popup.title,
        body: interpolatePopupText(popup.body, { 
          childName: gameState.childName || "your kid",
          roleLabel: def.label 
        }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    onClose();
  };

  const abandonRole = () => {
    if (!civic.activeRoleId) return;
    const def = PARENT_CIVIC_ROLE_DEFS[civic.activeRoleId];

    updateState({
      parentCivic: {
        ...(civic || DEFAULT_PARENT_CIVIC),
        activeRoleId: null,
        roleStartAge: null
      }
    });

    addLog(`📣 You step down from: ${def?.label || 'your role'}.`);
    recordTimelineEntry({
      kind: 'tool',
      title: `📣 Stepped down`,
      detail: def?.label ? `You stepped down from ${def.label}.` : 'You stepped down from your role.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { roleId: civic.activeRoleId }
    });

    const popup = pickMissingActionPopup("parentLeadership", "abandon");
    if (popup) {
      emitActionResult({
        actionId: "parentLeadership",
        title: popup.title,
        body: interpolatePopupText(popup.body, { 
          childName: gameState.childName || "your kid",
          roleLabel: def?.label || "your role"
        }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    onClose();
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="fixed inset-0 z-[121] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              <div className="flex-shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">📣 Parent Leadership</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      One active role at a time • Costs 1 Focus/age • Small cumulative bonuses
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8 space-y-6">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-sm font-semibold text-amber-900">How it works</div>
                  <ul className="mt-2 text-xs text-amber-800 space-y-1 list-disc pl-4">
                    <li>Pick one parent role (PTA leadership or volunteering).</li>
                    <li>While active, it automatically consumes <b>1 Focus each age</b> at the start of the year.</li>
                    <li>You get <b>tiny stat boosts</b> (INT/EMP/DIS/CON) each year and a little extra stress.</li>
                    <li>Benefits are <b>cumulative</b> and start applying <b>next age</b>.</li>
                    <li>You can abandon your role at any time to pick a different one.</li>
                  </ul>
                </div>

                {activeRoleDef ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl leading-none">{activeRoleDef.emoji}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">Active: {activeRoleDef.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{activeRoleDef.desc}</div>
                        <div className="text-[11px] text-slate-600 mt-2">
                          Years credited: {activeYears} • Started at age {civic.roleStartAge ?? '—'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={abandonRole}
                      className="w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Abandon role
                    </button>

                    <div className="text-[10px] text-slate-500 mt-2">
                      To start another role, abandon this one first.
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2">🏫 PTA track</h4>
                      <div className="space-y-3">
                        {ptaRoles.map(roleDef => {
                          const elig = getEligibility(gameState, civic, roleDef);
                          return (
                            <RoleCard
                              key={roleDef.id}
                              roleDef={roleDef}
                              disabled={!elig.enabled}
                              reason={elig.reason}
                              onStart={() => startRole(roleDef.id)}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2">🤝 Volunteer options</h4>
                      <div className="space-y-3">
                        {volunteerRoles.map(roleDef => {
                          const elig = getEligibility(gameState, civic, roleDef);
                          return (
                            <RoleCard
                              key={roleDef.id}
                              roleDef={roleDef}
                              disabled={!elig.enabled}
                              reason={elig.reason}
                              onStart={() => startRole(roleDef.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}