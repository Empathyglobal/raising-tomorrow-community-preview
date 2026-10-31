import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, ECONOMY_PRICES, formatMoney } from './GameStateContext';

const PROCEDURES = [
  { id: 'botox', emoji: '💉', label: 'Botox', multiplier: 0.6, desc: 'Freeze a few worries. The worries remain.' },
  { id: 'rhinoplasty', emoji: '👃', label: 'Rhinoplasty', multiplier: 1.0, desc: 'A new nose. Same opinions.' },
  { id: 'lipo', emoji: '🧊', label: 'Liposuction', multiplier: 1.2, desc: 'Remove something… mostly money.' },
  { id: 'facelift', emoji: '🙂', label: 'Facelift', multiplier: 1.5, desc: 'Time travel, but only for your skin.' },
  { id: 'tummy', emoji: '🧵', label: 'Tummy Tuck', multiplier: 1.4, desc: 'A tighter package deal.' },
  { id: 'bbl', emoji: '🍑', label: 'BBL', multiplier: 1.8, desc: 'Confidence sold separately.' },
  { id: 'veneers', emoji: '😁', label: 'Veneers', multiplier: 1.1, desc: 'Your smile now has a credit score.' },
  { id: 'hair', emoji: '🧑‍🦱', label: 'Hair Transplant', multiplier: 1.3, desc: 'Follicles: reintroduced to society.' }
];

const CLINICS = ["Luxury Aesthetic Institute", "Budget Beauty Clinic", "Influencer Surgery Suite", "Board-Certified Center", "Mall Kiosk Adjacent Wellness"];
const SURGEONS = ["Dr. Mirage", "Dr. Halcyon", "Dr. Voss", "Dr. Chen", "Dr. Patel", "Dr. Rivera"];

const OUTCOMES = {
  success: [
    "The surgeon calls it “subtle.” Your bank account calls it “violent.”",
    "It looks great. You immediately act like you always looked like this.",
    "You heal beautifully. You also develop a hobby: checking mirrors."
  ],
  meh: [
    "It’s… fine. You nod like this was the plan all along.",
    "You can’t tell if it changed you or just changed the lighting.",
    "You expected a transformation. You got a slightly updated version."
  ],
  botched: [
    "It is not subtle. It is not what you wanted. You schedule a “follow-up” and pretend it’s normal.",
    "You look in the mirror and whisper, “We’ll fix this.” The mirror does not answer.",
    "Somewhere, a before-photo is laughing."
  ]
};

export default function PlasticSurgeryModal({ open, onClose }) {
  const { spendFocus, applyMoneyDelta, emitActionResult, addLog, getLocalAmount } = useGameState();

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

  const handleProcedure = (procedure) => {
    // a) Spend focus FIRST
    if (!spendFocus(1, `Plastic Surgery — ${procedure.label}`)) return;

    // b) Compute cost
    const base = ECONOMY_PRICES.plasticSurgery;
    const cost = Math.round(getLocalAmount(base * procedure.multiplier));

    // c) Spend money allowing debt
    applyMoneyDelta(-cost, `Plastic Surgery (${procedure.label})`, { allowCreditMessage: true });

    // d) Determine a BitLife-style outcome message
    const roll = Math.random();
    let outcomeKey = 'success';
    let outcomeLabel = '✅ Successful';
    if (roll > 0.95) {
      outcomeKey = 'botched';
      outcomeLabel = '❌ Botched';
    } else if (roll > 0.80) {
      outcomeKey = 'meh';
      outcomeLabel = '😐 Meh';
    }

    const clinic = CLINICS[Math.floor(Math.random() * CLINICS.length)];
    const surgeon = SURGEONS[Math.floor(Math.random() * SURGEONS.length)];
    const punchline = OUTCOMES[outcomeKey][Math.floor(Math.random() * OUTCOMES[outcomeKey].length)];

    const body = `Procedure: ${procedure.label}\nClinic: ${clinic}\nSurgeon: ${surgeon}\n\nResult: ${outcomeLabel}\n\n${punchline}`;

    // e) Log + popup
    addLog(`✨ Plastic Surgery — ${procedure.label} (${outcomeLabel}). Spent $${formatMoney(cost)}.`);
    
    emitActionResult({
      actionId: 'plasticSurgery',
      title: `✨ Plastic Surgery — ${procedure.label}`,
      body,
      deltas: null,
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['health', 'doctor', 'cosmetic', 'money-sink'],
      meta: { emoji: '✨' }
    });

    // f) Close the modal
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[114]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[115] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Plastic Surgery</h3>

                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8 space-y-3">
                {PROCEDURES.map((proc) => {
                  const base = ECONOMY_PRICES.plasticSurgery;
                  const cost = Math.round(getLocalAmount(base * proc.multiplier));
                  
                  return (
                    <button
                      key={proc.id}
                      onClick={() => handleProcedure(proc)}
                      className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-pink-400 hover:bg-pink-50/30 transition-all flex items-start gap-4 active:scale-[0.98]"
                    >
                      <span className="text-3xl flex-shrink-0">{proc.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-semibold text-slate-800">{proc.label}</div>
                          <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                            ${formatMoney(cost)}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {proc.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}