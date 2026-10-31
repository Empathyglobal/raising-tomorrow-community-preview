import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BaliActivityPopupModal({ open, popup, onChoose, childName }) {
  const tmpl = (s) => String(s || '').split('{childName}').join(childName || 'your child');
  const choices = Array.isArray(popup?.choices) ? popup.choices : [];

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
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
              <div className="text-2xl font-bold mb-1">🏝️ Bali Activity</div>
              <div className="text-sm text-slate-500 mb-4">Pick a Bali-themed day while youre enrolled.</div>

              <div className="text-lg font-semibold mb-2">{popup.title}</div>
              <div className="text-slate-700 leading-relaxed mb-5 whitespace-pre-line">{tmpl(popup.body)}</div>

              <div className="grid gap-3">
                {choices.map((c) => (
                  <button
                    key={c.id || c.letter}
                    onClick={() => onChoose(c.id || c.letter)}
                    className="w-full text-left rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="text-xl">{c.emoji || '✨'}</span>
                      <span>{c.letter}. {c.text}</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{tmpl(c.consequence)}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}