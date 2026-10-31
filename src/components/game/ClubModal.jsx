import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from './GameStateContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ClubModal({ open, onClose }) {
  const { gameState, spendFocus, applyStress, applyLove, applyMoneyDelta, applyFameDelta, addLog, recordTimelineEntry, emitActionResult } = useGameState();

  const handleDanceSip = () => {
    // Check focus
    if (!spendFocus(1, 'Go to Club')) return;

    // Apply effects
    applyStress(-5, 'Club Night');
    applyLove(-1, 'Club Night');
    applyMoneyDelta(-120, 'Club cover + drinks', { category: 'leisure' });

    // Optional: Fame boost
    const applyFameDeltaLocal = (delta, reason) => {
      if (typeof applyFameDelta === 'function') {
        applyFameDelta(delta, reason);
      }
    };
    applyFameDeltaLocal(5, 'Club Night');

    // Log
    addLog('🪩 Club Night: Stress -5, Love -1.');

    // Timeline
    recordTimelineEntry({
      kind: 'care',
      title: '🪩 Club Night',
      detail: 'You went to the club. The music was loud. The stress was not.',
      deltas: null,
      moneyDelta: -120,
      loveDelta: -1,
      stressDelta: -5,
      meta: { fame: 5 }
    });

    // Emit action result
    emitActionResult({
      actionId: 'club',
      title: '🪩 Club Night',
      body: "The music is loud enough to exfoliate your thoughts. The bass vibrates your ribs. You dance badly. Nobody cares.\n\nYou sip something expensive and regrettable. For a moment, your problems can't find you in the crowd.\n\nYou Uber home and immediately forget why you thought staying out past 11pm was a good idea. Tomorrow: consequences. Tonight: free.",
      deltas: null,
      loveDelta: -1,
      stressDelta: -5,
      moneyDelta: -120,
      focusDelta: -1,
      tags: ['care', 'nightlife'],
      meta: { emoji: '🪩', skipTimelineRecord: true }
    });

    toast.success('Club night complete', { icon: '🪩' });
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">🪩 Go to Club</h2>
                    <p className="text-white/80 text-sm">Let the bass handle your problems</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Loud music. Expensive drinks. Questionable decisions. A temporary escape from reality.
                </p>

                <Button
                  onClick={handleDanceSip}
                  disabled={gameState.actionPoints < 1}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg rounded-xl disabled:opacity-50"
                >
                  🪩 Dance & Sip (1 Focus)
                </Button>

                <div className="mt-4 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                  <div className="font-semibold text-slate-700 mb-1">Effects:</div>
                  <ul className="space-y-0.5">
                    <li>• Stress -5</li>
                    <li>• Love -1 (less available at home)</li>
                    <li>• Money -$120 (cover + drinks)</li>
                    <li>• Fame +5 (optional)</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}