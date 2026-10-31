import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BaliCalmPopupModal({ open, popup, onContinue }) {
  const effectsLine = 'STRESS -3' + (popup?.deltas ? ' • +' + Object.keys(popup.deltas).join(' + ') : '');

  return (
    <AnimatePresence>
      {open && popup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[1150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-[1151] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-2xl font-bold mb-1">🏝️ Bali Calm Moment</div>
              <div className="text-sm text-slate-500 mb-4">A gentle reset while you're enrolled at Empathy School Bali.</div>

              <div className="text-lg font-semibold mb-2">{popup.title}</div>
              <div className="text-slate-700 leading-relaxed mb-4 whitespace-pre-line">{popup.body}</div>

              <div className="text-xs text-slate-600 italic mb-6">{effectsLine}</div>

              <button
                onClick={onContinue}
                className="w-full h-11 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                Breathe it in
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}