import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGameState, ECONOMY_PRICES, formatMoney, hasAnyChild, getActiveChildFromState, getDisplayedChildAge } from './GameStateContext';
import { appendHumor } from './humorUtils';

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

export default function SexualHealthClinicModal({ open, onClose }) {
  const {
    gameState,
    spendFocus,
    applyMoneyDelta,
    applyStress,
    updateState,
    emitActionResult,
    recordTimelineEntry,
    addLog,
    getLocalAmount
  } = useGameState();

  const currentYear = Number(gameState.currentYear ?? 0);
  const householdType = gameState.householdType;
  
  const TEEN_MIN_AGE = 13;
  const hasChild = hasAnyChild(gameState);
  const activeKid = getActiveChildFromState(gameState);
  const childAge = activeKid ? getDisplayedChildAge(gameState, activeKid) : Number(gameState.childAge ?? currentYear ?? 0);
  const childName =
    activeKid?.childSlice?.childName ||
    activeKid?.name ||
    gameState.childName ||
    'your kid';

  // Block body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sexualHealth = isObj(gameState.sexualHealth) ? gameState.sexualHealth : {};
  const normalize = (p) => {
    const b = isObj(p) ? p : {};
    return {
      status: b.status || 'clear', // clear | treatable | chronic
      infectionId: b.infectionId ?? null,
      label: b.label ?? null,
      diagnosedAtAge: b.diagnosedAtAge ?? null,
      treatedAtAge: b.treatedAtAge ?? null,
      lastClinicAge: b.lastClinicAge ?? null,
      managed: !!b.managed,
      lastMedsAge: b.lastMedsAge ?? null,
    };
  };

  const player = normalize(sexualHealth.player);
  const partner = normalize(sexualHealth.partner);
  const child = normalize(sexualHealth.child);

  const hasPartner = householdType === 'two' && !!(gameState.partnerRelationship?.status === 'married' || gameState.partnerRelationship?.status === 'partnered');
  const partnerName =
    gameState.partnerName ||
    gameState.relationships?.byId?.partner?.name ||
    gameState.relationships?.roster?.find?.(p => p.id === 'partner')?.name ||
    'your partner';

  const canDoFor = (p) => {
    // Prevent "free" spam: limit routine checkups to once per year.
    if (p.status === 'clear' && Number(p.lastClinicAge) === currentYear) return { ok: false, reason: 'Already did a checkup this year.' };
    // Prevent "free" spam: meds are once per year.
    if (p.status === 'chronic' && Number(p.lastMedsAge) === currentYear) return { ok: false, reason: 'Meds already handled this year.' };
    // Treatable only needs one treatment (becomes clear afterwards).
    return { ok: true, reason: '' };
  };

  const doClinicVisit = (targetKey) => {
    if (targetKey === 'child') {
      if (!hasChild) {
        toast('No child in household.', { icon: 'ℹ️' });
        return;
      }
      if (childAge < TEEN_MIN_AGE) {
        toast(`Unavailable until age ${TEEN_MIN_AGE}.`, { icon: '🔒' });
        return;
      }
    }
    
    const ap = Number(gameState.actionPoints ?? 0);
    if (ap < 1) {
      toast('Not enough focus.', { icon: '⚠️' });
      return;
    }

    const p0 = normalize(sexualHealth[targetKey]);
    const gate = canDoFor(p0);
    if (!gate.ok) {
      toast(gate.reason, { icon: 'ℹ️' });
      return;
    }

    // Spend focus first
    if (!spendFocus(1, 'Sexual Health Clinic')) return;

    const isTreatable = p0.status === 'treatable';
    const isChronic = p0.status === 'chronic';

    const costRaw = isChronic ? ECONOMY_PRICES.sexualHealthMeds : ECONOMY_PRICES.sexualHealthClinic;
    const cost = getLocalAmount(costRaw, { category: 'medical' });
    applyMoneyDelta(-cost, { allowCreditMessage: true });

    // Keep it non-rewarding: mild reassurance only, costs time/money.
    const stressDelta = isTreatable ? -0.4 : isChronic ? -0.2 : -0.2;
    applyStress(stressDelta, 'Clinic visit');

    const who =
      targetKey === 'player' ? 'You' :
      targetKey === 'partner' ? partnerName :
      childName;

    const baseBody = (() => {
      if (isTreatable) {
        return `${who} get(s) treated. It's awkward, professional, and completely non-dramatic — the way health care should be.`;
      }
      if (isChronic) {
        return `${who} keep(s) up with ongoing care. It's not fun, but it's responsible — and it keeps life stable.`;
      }
      return `${who} do(es) a routine checkup. Reassurance: acquired. Waiting room chairs: still weirdly sticky.`;
    })();

    const body = appendHumor(baseBody, 'doctorVisit', { childName }, '😄 ');

    // Patch sexualHealth state
    updateState(prev => {
      const sh = isObj(prev.sexualHealth) ? prev.sexualHealth : {};
      const cur = normalize(sh[targetKey]);
      let patch = {};

      if (cur.status === 'treatable') {
        patch = {
          status: 'clear',
          infectionId: null,
          label: null,
          treatedAtAge: prev.currentYear,
          lastClinicAge: prev.currentYear,
          managed: false,
          lastMedsAge: null,
        };
      } else if (cur.status === 'chronic') {
        patch = {
          status: 'chronic',
          treatedAtAge: cur.treatedAtAge ?? prev.currentYear,
          managed: true,
          lastClinicAge: prev.currentYear,
          lastMedsAge: prev.currentYear,
        };
      } else {
        patch = { lastClinicAge: prev.currentYear };
      }

      return {
        ...prev,
        sexualHealth: {
          ...sh,
          [targetKey]: { ...(sh[targetKey] || {}), ...patch }
        }
      };
    });

    const title = isTreatable ? '🧪 Treatment' : isChronic ? '🩺 Medication refill' : '🧪 Checkup';
    addLog(`🧪 Sexual Health Clinic: ${title} (${who})`);

    emitActionResult({
      actionId: 'sexualHealthClinic',
      title: `🧪 Sexual Health Clinic`,
      body: `${body}\n\n(PG-13: no explicit content. This is a health + responsibility system.)`,
      deltas: {},
      loveDelta: 0,
      stressDelta,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['health', 'care'],
      meta: { emoji: '🧪' }
    });

    recordTimelineEntry({
      kind: 'health',
      title: `🧪 Sexual Health Clinic — ${title}`,
      detail: `${who}: ${body}`,
      moneyDelta: -cost,
      stressDelta
    });

    onClose?.();
  };

  const Card = ({ title, subtitle, emoji, targetKey, p, show }) => {
    if (!show) return null;
    const gate = canDoFor(p);
    const disabled = !gate.ok;

    const statusLine = (() => {
      if (p.status === 'clear') return 'Status: clear';
      if (p.status === 'treatable') return `Status: needs treatment (${p.label || 'treatable'})`;
      return `Status: ongoing care (${p.label || 'chronic'})`;
    })();

    const actionLabel = (() => {
      if (p.status === 'treatable') return 'Get treated';
      if (p.status === 'chronic') return 'Refill meds + check-in';
      return 'Routine checkup';
    })();

    const costRaw = (p.status === 'chronic') ? ECONOMY_PRICES.sexualHealthMeds : ECONOMY_PRICES.sexualHealthClinic;
    const cost = getLocalAmount(costRaw, { category: 'medical' });

    return (
      <button
        onClick={() => doClinicVisit(targetKey)}
        disabled={disabled}
        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
          disabled
            ? 'border-slate-100 bg-slate-50 opacity-45 cursor-not-allowed'
            : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 active:scale-[0.98]'
        }`}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl flex-shrink-0">{emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 mb-1 text-base">{title}</div>
            <div className="text-sm text-slate-600 leading-relaxed mb-2">
              {subtitle}
            </div>
            <div className="text-xs text-slate-500 mb-2">
              {statusLine}
              {disabled && gate.reason ? <span className="ml-2 text-slate-400">• {gate.reason}</span> : null}
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                Cost: ${formatMoney(cost)}
              </div>
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                Focus: 1
              </div>
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                {actionLabel}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[121] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Sexual Health Clinic</h3>
                  <p className="text-xs text-slate-500 mt-0.5 italic">Game system (PG‑13), not medical advice.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 pb-8">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 leading-relaxed">
                  This is a <span className="font-semibold">responsibility</span> mechanic:
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Treatable issues can be treated and cleared.</li>
                    <li>Chronic issues are manageable, but require yearly follow-up.</li>
                    <li>No explicit content. No shame. Just consequences + care.</li>
                  </ul>
                </div>

                <div className="mt-4 space-y-3">
                  <Card
                    show={true}
                    title="You"
                    subtitle="Confidential checkup, treatment, or medication refill."
                    emoji="🧍"
                    targetKey="player"
                    p={player}
                  />

                  <Card
                    show={hasPartner}
                    title={partnerName}
                    subtitle="Support your partner's health and reduce future fallout."
                    emoji="🧑‍🤝‍🧑"
                    targetKey="partner"
                    p={partner}
                  />

                  <Card
                    show={hasChild && childAge >= TEEN_MIN_AGE}
                    title={childName}
                    subtitle="Teen health support lives here (still PG‑13)."
                    emoji="🧒"
                    targetKey="child"
                    p={child}
                  />
                  
                  {hasChild && childAge < TEEN_MIN_AGE ? (
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      🔒 Teen health support unlocks at age {TEEN_MIN_AGE}.
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 text-[11px] text-slate-500">
                  Fun fact: the waiting room magazine is always from a year nobody asked for.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}