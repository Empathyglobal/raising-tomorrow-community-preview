import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { safeCall } from '@/components/utils/safeCall';

export default function SiblingRivalryPopupModal({
  open,
  payload,
  onChoose,
  onClose = () => {}
}) {
  if (!open || !payload) return null;

  const {
    title = 'Sibling Conflict',
    body = 'A conflict has arisen between your children.',
    choices = []
  } = payload;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200]"
            onClick={() => safeCall(onClose)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                <button
                  onClick={() => safeCall(onClose)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">{body}</p>
              </div>

              {/* Choices */}
              <div className="px-6 pb-6 space-y-2">
                {choices.map((choice) => {
                  const letter = String(choice.letter || choice.key || '').toUpperCase().slice(0, 1);
                  return (
                    <Button
                      key={choice.key}
                      onClick={() => {
                        onChoose(choice.key);
                        safeCall(onClose);
                      }}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-slate-100 border border-slate-300"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                          {letter}
                        </div>
                        <span className="text-sm font-medium text-slate-700 flex-1">
                          {choice.label}
                        </span>
                      </div>
                    </Button>
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