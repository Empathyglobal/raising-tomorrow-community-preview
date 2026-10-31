import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function StudyLearnedModal({ open, moduleLabel, lesson, onClose }) {
  // Block body scroll when modal is open
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

  if (!lesson) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - not clickable */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[200]"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white">📚 You studied: {moduleLabel}</h3>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-slate-700 mb-2">
                    Today you learned:
                  </div>
                  <div className="text-base font-bold text-slate-900 mb-3">
                    • {lesson.headline}
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span className="font-semibold">Example:</span> {lesson.example}
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  OK
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}