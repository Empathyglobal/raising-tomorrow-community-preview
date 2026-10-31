import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGameState, hasAnyChild } from '@/components/game/GameStateContext';
import { ensurePrisonState } from '@/components/game/prisonSystem';
import { audioManager } from '@/components/game/AudioManager';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PrisonVisitModal({ open, onClose }) {
  const { gameState, updateState, applyLove, applyStress, applyDeltas, addLog, recordTimelineEntry } = useGameState();
  
  const prison = ensurePrisonState(gameState.prison);
  const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
  const hasMultiple = gameState.expansions?.siblingRivalry === true && kids.length > 1;
  
  const [selectedKidId, setSelectedKidId] = React.useState(
    gameState.activeKidId || kids[0]?.id || null
  );
  const [choiceStep, setChoiceStep] = React.useState(hasMultiple ? 'selectChild' : 'makeChoice');
  
  // Get selected child
  const selectedChild = kids.find(k => k.id === selectedKidId) || kids[0];
  const childName = selectedChild?.childSlice?.childName || gameState.childName || 'your child';
  const childAge = selectedChild?.childSlice?.currentYear ?? gameState.currentYear ?? 0;
  
  // Visit choices
  const choices = [
    {
      id: 'encourage',
      emoji: '💪',
      title: 'Encourage them',
      description: 'Tell them you\'re proud. They can get through this.',
      loveDelta: 2,
      stressDelta: -0.4,
      statDeltas: {}
    },
    {
      id: 'apologize',
      emoji: '🫂',
      title: 'Apologize / Connect',
      description: 'You tell them you\'re sorry. You want to be better.',
      loveDelta: 3,
      stressDelta: 0.2,
      statDeltas: {}
    },
    {
      id: 'light',
      emoji: '😊',
      title: 'Keep it light / Joke',
      description: 'You crack a joke. Make them smile. Keep it simple.',
      loveDelta: 1,
      stressDelta: 0,
      statDeltas: { confidence: 1 }
    }
  ];
  
  const handleChoice = (choice) => {
    audioManager.playSfx('success');
    
    // Apply deltas
    if (choice.loveDelta) applyLove(choice.loveDelta, 'Prison Visit');
    if (choice.stressDelta) applyStress(choice.stressDelta, 'Prison Visit');
    if (choice.statDeltas && Object.keys(choice.statDeltas).length > 0) {
      applyDeltas(choice.statDeltas, 'Prison Visit');
    }
    
    // Update prison state
    updateState(prev => ({
      prison: ensurePrisonState({
        ...(prev.prison || {}),
        visitPendingThisAge: false,
        visitUsedThisAge: true
      })
    }));
    
    // Log
    addLog(`🏛️ Prison Visit: ${childName} visited. You chose: ${choice.title}`);
    
    // Timeline
    recordTimelineEntry({
      kind: 'family',
      title: `🏛️ Prison Visit: ${childName}`,
      detail: choice.description,
      deltas: choice.statDeltas,
      moneyDelta: 0,
      loveDelta: choice.loveDelta,
      stressDelta: choice.stressDelta,
      age: gameState.currentYear
    });
    
    onClose();
  };
  
  if (!open || !prison.visitPendingThisAge) return null;
  
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
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-800">🏛️ Prison Visit</h2>
              <p className="text-sm text-slate-600 mt-1">
                {choiceStep === 'selectChild' 
                  ? 'Choose which child visits this year' 
                  : `Annual visit with ${childName} (Age ${childAge})`}
              </p>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-6">
            {choiceStep === 'selectChild' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 mb-4">
                  You can only have one visit per year. Pick which child visits.
                </p>
                {kids.map(kid => {
                  const kidName = kid.childSlice?.childName || kid.name || 'Child';
                  const kidAge = kid.childSlice?.currentYear ?? Math.max(0, (gameState.currentYear || 0) - (kid.createdAtYear || 0));
                  const isSelected = kid.id === selectedKidId;
                  
                  return (
                    <button
                      key={kid.id}
                      onClick={() => setSelectedKidId(kid.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-800">{kidName}</div>
                      <div className="text-sm text-slate-600">Age {kidAge}</div>
                    </button>
                  );
                })}
                
                <Button
                  onClick={() => setChoiceStep('makeChoice')}
                  className="w-full mt-4"
                  disabled={!selectedKidId}
                >
                  Continue
                </Button>
              </div>
            )}
            
            {choiceStep === 'makeChoice' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 mb-4">
                  {childName} sits across from you in the visiting room. The guard watches.
                  You have 15 minutes. What do you say?
                </p>
                
                {choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{choice.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 mb-1">{choice.title}</div>
                        <div className="text-sm text-slate-600">{choice.description}</div>
                        <div className="flex gap-3 mt-2 text-xs text-slate-500">
                          {choice.loveDelta !== 0 && (
                            <span>Bond {choice.loveDelta > 0 ? '+' : ''}{choice.loveDelta}</span>
                          )}
                          {choice.stressDelta !== 0 && (
                            <span>Stress {choice.stressDelta > 0 ? '+' : ''}{choice.stressDelta}</span>
                          )}
                          {Object.entries(choice.statDeltas).map(([stat, delta]) => (
                            <span key={stat}>{stat} +{delta}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                
                {hasMultiple && (
                  <button
                    onClick={() => setChoiceStep('selectChild')}
                    className="w-full mt-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 underline"
                  >
                    ← Choose a different child
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}