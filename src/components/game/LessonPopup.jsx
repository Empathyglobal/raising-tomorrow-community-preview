import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function LessonPopup({ open, lesson, isReview, onClose, moduleEmoji = '🌱', moduleTitle = 'Positive Parenting', progressText, benefitsText }) {
  useEffect(() => {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[120]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[121] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-lg font-bold text-slate-800">
                  {moduleEmoji} {moduleTitle} {isReview ? '(Review)' : ''}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-1">
                    {progressText || `Lesson ${lesson.count || 1}/20`}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">
                    {lesson.title}
                  </h4>
                </div>

                {/* Benefits Line */}
                {!isReview && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                    <div className="text-sm font-semibold text-emerald-800">
                      {benefitsText || 'Δ Confidence +0.1 • Focus -1'}
                    </div>
                  </div>
                )}

                {isReview && (
                  <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 mb-4">
                    <div className="text-sm font-semibold text-slate-600">
                      Course completed — no additional stat gain.
                    </div>
                  </div>
                )}

                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {lesson.body}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                <Button onClick={onClose} className="w-full bg-emerald-500 hover:bg-emerald-600">
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}