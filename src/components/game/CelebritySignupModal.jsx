import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney } from './GameStateContext';
import { Crown, Star, X } from 'lucide-react';

export default function CelebritySignupModal({ open, onClose, onUnlock }) {
  const { gameState, spendMoney } = useGameState();
  const cost = 1000000;

  if (!open) return null;

  const handleJoin = () => {
    if ((gameState.money || 0) < cost) {
      // Toast/alert handled by parent or here? Prompt says "Show toast/alert"
      // We can use a simple alert or toast if available.
      // Since I don't have toast imported here, I'll use window.alert or just pass failure back.
      // Better to use toast from sonner if I can, but let's stick to the prompt's exact text requirement.
      // "You stare at your bank balance and quietly close the app."
      // I'll simulate this with a state change in the modal or just a return.
      alert("You stare at your bank balance and quietly close the app.");
      return;
    }

    spendMoney(cost);
    onUnlock();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-[9100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900 border border-amber-500/30 text-amber-50 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                Celebrity Dating Network
              </h2>
              <p className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">
                Exclusive Access
              </p>
            </div>

            <div className="text-zinc-300 text-sm leading-relaxed space-y-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
              <p>Welcome to the most exclusive dating network on the planet.</p>
              <p>This app is for people who are confident, interesting, and financially prepared for chaos.</p>
              <p>Paparazzi, tabloids, and extremely strange family dinners may occur.</p>
            </div>

            <div className="space-y-3">
              <div className="text-xl font-bold text-amber-400">
                Membership Fee: {formatMoney(cost)}
              </div>
              <div className="text-xs text-zinc-500">
                (One-time payment. No refunds. No guarantees.)
              </div>
            </div>

            <div className="grid gap-3 pt-2">
              <Button 
                onClick={handleJoin}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-base border-none"
              >
                Join for {formatMoney(cost)}
              </Button>
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}