import React from 'react';
import { X, MessageCircle, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

export default function MovieEasterEggPopupModal({ open, popup, onOk, onScold, onTalk }) {
  useLockBodyScroll(open);

  if (!open) return null;

  const icon = popup?.icon || '🎬';
  const age = popup?.age;
  const title = popup?.title || 'A story moment';
  const body = popup?.body || '';
  const hint = popup?.hint || '';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => {
              // This popup is meant to be acknowledged, not dismissed.
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4"
            onClick={() => {
              // Prevent close-on-outside-click (intentional).
            }}
          >
            <div
              className="rt-modal-glass bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-amber-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    <span>Story Moment</span>
                  </h2>
                  {Number.isFinite(age) && (
                    <p className="text-xs text-slate-500 mt-0.5">Age {age}</p>
                  )}
                </div>

                <button
                  onClick={() => onOk?.()}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Continue"
                  title="Continue"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-white/60 rounded-xl p-5 border border-slate-200/50">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">{title}</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{body}</p>
                  {hint ? (
                    <p className="mt-4 text-sm text-slate-600 italic">🎬 {hint}</p>
                  ) : null}
                </div>

                <div className="bg-white/50 rounded-xl p-4 border border-slate-200/50">
                  <p className="text-xs text-slate-600">
                    You can just acknowledge it… or turn it into a quick parenting moment.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-white/60 backdrop-blur-sm">
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={onOk} variant="outline" className="h-12 justify-between">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Okay (it happened)
                    </span>
                    <span className="text-xs text-slate-500">No changes</span>
                  </Button>

                  <Button onClick={onScold} variant="outline" className="h-12 justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Scold
                    </span>
                    <span className="text-xs text-slate-500">DIS +1 • STRESS +1</span>
                  </Button>

                  <Button
                    onClick={onTalk}
                    className="h-12 justify-between bg-slate-800 hover:bg-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Sit down & talk
                    </span>
                    <span className="text-xs text-white/80">DIS +1 • STRESS +1</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}