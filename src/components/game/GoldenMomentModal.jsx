import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function GoldenMomentModal({ open, moment, onClose }) {
  if (!moment) return null;
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="max-w-md">
        <motion.div
          className="text-center space-y-6 py-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sparkle animation */}
          <motion.div
            className="text-7xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          >
            ✨
          </motion.div>
          
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              Golden Moment
            </h2>
            <h3 className="text-xl font-semibold text-slate-800">
              {moment.title}
            </h3>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <p className="text-slate-800 leading-relaxed italic">
              {moment.text}
            </p>
          </div>
          
          <div className="text-sm text-slate-600">
            This moment has been added to your Collections.
          </div>
          
          <Button
            onClick={onClose}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
          >
            Continue
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}