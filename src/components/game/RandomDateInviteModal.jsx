import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, X as XIcon } from 'lucide-react';

export default function RandomDateInviteModal({ open, invite, onAccept, onReject }) {
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

  if (!invite) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[110]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-rose-50 to-amber-50 px-6 py-5 border-b border-rose-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">💌 A surprise invite</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Once a year, life sometimes gets… mildly cinematic.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-3xl">
                    {invite.avatar}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-lg">✨</div>
                    <div className="font-semibold text-slate-800">{invite.name} asks you out.</div>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-medium">You meet</span> at <span className="font-medium">{invite.where}</span>.
                    <div className="mt-2 italic text-slate-600">{invite.approach}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  This is just flavor — say yes, say no, life keeps moving.
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 space-y-3">
                <Button
                  onClick={onAccept}
                  className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Accept the date
                </Button>

                <Button
                  onClick={onReject}
                  variant="outline"
                  className="w-full h-12 border-2"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Politely decline
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}