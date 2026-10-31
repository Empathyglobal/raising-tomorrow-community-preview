import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PatternLearnModal({ open, pattern, onClose }) {
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

  if (!pattern) return null;

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
                  🧬 {pattern.label}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">What it can feel like</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pattern.learn.whatItCanFeelLike}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">How it can show up</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pattern.learn.howItCanShowUp}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Why it matters</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {pattern.childRipple}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                <Button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}