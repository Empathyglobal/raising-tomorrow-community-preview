import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function FaithDecisionModal({ open, popup, onContinue }) {
  if (!open || !popup) return null;

  const tradition = popup.tradition || 'Faith';
  const title = popup.title || 'A Moment';
  const body = (popup.body || '').replace(/{faithName}/g, tradition);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
              {body}
            </p>
            
            <Button
              onClick={onContinue}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}