import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameState } from '@/components/game/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BriefcaseChainModal({ open, onComplete }) {
  const { gameState, applyDeltas, applyMoneyDelta, addLog, recordTimelineEntry, updateState } = useGameState();
  const [step, setStep] = useState('briefcase'); // 'briefcase' | 'number' | 'email' | 'confirmation'
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Block body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handlePolice = () => {
    updateState({
      flags: {
        ...gameState.flags,
        briefcaseFound: true,
        briefcaseChainComplete: true
      }
    });

    applyDeltas({ intelligence: 0, empathy: 0.1, discipline: 0, confidence: 0 }, "Briefcase → Police");

    recordTimelineEntry({
      kind: 'system',
      title: 'At the park, you found a briefcase.',
      detail: 'You turned it in to the police.',
      deltas: { intelligence: 0, empathy: 0.1, discipline: 0, confidence: 0 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    addLog("🧳 At the park, you found a briefcase. You turned it in to the police. Your child watches closely.");

    setConfirmationMessage("You did the boring right thing. Your child watches closely.");
    setStep('confirmation');
  };

  const handleOpen = () => {
    updateState({
      flags: {
        ...gameState.flags,
        briefcaseFound: true
      }
    });
    setStep('number');
  };

  const handleThrowAway = () => {
    updateState({
      flags: {
        ...gameState.flags,
        briefcaseNumberKept: false,
        briefcaseChainComplete: true
      }
    });

    recordTimelineEntry({
      kind: 'system',
      title: 'You opened the briefcase. Inside was only a number.',
      detail: 'You threw it away.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    addLog("🧳 You opened the briefcase. Inside was only a number. You threw it away.");

    setConfirmationMessage("Probably nothing. Probably.");
    setStep('confirmation');
  };

  const handleKeep = () => {
    updateState({
      flags: {
        ...gameState.flags,
        briefcaseNumberKept: true
      }
    });

    recordTimelineEntry({
      kind: 'system',
      title: 'You opened the briefcase. Inside was only a number.',
      detail: 'You kept the number.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    addLog("🧳 You opened the briefcase. Inside was only a number. You kept it.");

    setStep('email');
  };

  const handleDelete = () => {
    updateState({
      flags: {
        ...gameState.flags,
        briefcaseChainComplete: true
      }
    });

    recordTimelineEntry({
      kind: 'system',
      title: 'A strange email offered $1,000,000 for "launch codes."',
      detail: 'You deleted it.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    addLog('📧 A strange email offered $1,000,000 for "launch codes." You deleted it.');

    setConfirmationMessage("You chose peace over chaos.");
    setStep('confirmation');
  };

  const handleSend = () => {
    const currentAge = gameState.currentYear || gameState.childAge || 0;

    updateState({
      flags: {
        ...gameState.flags,
        launchCodesSold: true,
        launchCodesSoldAge: currentAge,
        briefcaseChainComplete: true
      }
    });

    // Add +$1,000,000 to money
    applyMoneyDelta(1000000, "Launch codes bribe");

    recordTimelineEntry({
      kind: 'system',
      title: 'A strange email offered $1,000,000 for "launch codes."',
      detail: 'You took the deal. $1,000,000 arrived instantly.',
      deltas: null,
      moneyDelta: 1000000,
      loveDelta: 0,
      stressDelta: 0,
      meta: { secretEnding: true }
    });

    recordTimelineEntry({
      kind: 'system',
      title: 'You try not to think about what "launch codes" means.',
      detail: '',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    addLog('🧳💰 You sent the codes. $1,000,000 arrived instantly. You try not to think about what "launch codes" means.');

    setConfirmationMessage("Money can be loud. Consequences can be louder.");
    setStep('confirmation');
  };

  const handleConfirmationClose = () => {
    setStep('briefcase');
    setConfirmationMessage('');
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {step === 'briefcase' && (
            <motion.div
              key="briefcase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">You find a briefcase in the grass.</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  While your child runs around, you spot a briefcase half-hidden near a bench. It looks… intentionally placed.
                </p>

                <div className="space-y-2">
                  <Button
                    onClick={handlePolice}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  >
                    Hand it to the police
                  </Button>
                  <Button
                    onClick={handleOpen}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white h-12"
                  >
                    Open it
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'number' && (
            <motion.div
              key="number"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">Inside: a single number.</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  No cash. No ID. Just a slip of paper with a number written neatly.
                </p>

                <div className="space-y-2">
                  <Button
                    onClick={handleThrowAway}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white h-12"
                  >
                    Throw it away
                  </Button>
                  <Button
                    onClick={handleKeep}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12"
                  >
                    Keep the number
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">📧 Email Received</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">From: Unknown Sender</div>
                  <div className="text-xs text-slate-500 mb-3">Subject: One simple trade.</div>
                  <p className="text-slate-800 font-medium">
                    I will give you $1,000,000 if you give me the launch codes.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleDelete}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white h-12"
                  >
                    Delete the email
                  </Button>
                  <Button
                    onClick={handleSend}
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                  >
                    Send the codes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl">·</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <p className="text-slate-700 leading-relaxed text-center py-6">
                  {confirmationMessage}
                </p>

                <Button
                  onClick={handleConfirmationClose}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white h-12"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}