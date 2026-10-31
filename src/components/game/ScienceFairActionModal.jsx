import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/components/game/GameStateContext.jsx";
import { motion, AnimatePresence } from 'framer-motion';

const TINY_DETAILS = [
  "The poster board survived… barely.",
  "There was glitter. There is still glitter.",
  "The baking-soda volcano achieved 'minor legend' status.",
  "Your child explained it like a TED Talk with snacks.",
  "Someone's project caught fire. Not yours. Progress."
];

export default function ScienceFairActionModal({ open, onClose }) {
  const { gameState, consumeAction, applyDeltas, applyMoneyDelta, addLog, recordTimelineEntry, updateState } = useGameState();
  const [step, setStep] = useState('intro'); // 'intro' | 'result'
  const [result, setResult] = useState(null);
  
  const handleStart = () => {
    // Deduct resources
    consumeAction('scienceFair');
    applyMoneyDelta(-120, "Science Fair supplies");
    
    // Increment attempts
    const milestones = gameState.milestones || {};
    const newAttempts = (milestones.scienceFairAttempts || 0) + 1;
    
    // Calculate result using stats + seeded randomness
    const stats = gameState.stats || {};
    const I = stats.intelligence || 0;
    const D = stats.discipline || 0;
    const C = stats.confidence || 0;
    
    // Seeded random jitter (-3 to +3)
    const seed = `${gameState.runSeed || 'default'}_sciencefair_${newAttempts}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    const rng = Math.abs(hash % 7) - 3; // -3 to +3
    
    const score = I * 0.55 + D * 0.35 + C * 0.15 + rng;
    
    let resultType, ribbon, statGains, detailLine;
    const detailIndex = Math.abs(hash % TINY_DETAILS.length);
    detailLine = TINY_DETAILS[detailIndex];
    
    if (score >= 32) {
      resultType = "Champion";
      ribbon = 3;
      statGains = { intelligence: 0.3, empathy: 0, discipline: 0, confidence: 0.2 };
      
      updateState({
        milestones: {
          ...milestones,
          scienceFairAttempts: newAttempts,
          scienceFairChampion: true,
          scienceFairRibbon: Math.max(milestones.scienceFairRibbon || 0, 3)
        }
      });
    } else if (score >= 26) {
      resultType = "Winner";
      ribbon = 2;
      statGains = { intelligence: 0.2, empathy: 0, discipline: 0, confidence: 0.1 };
      
      updateState({
        milestones: {
          ...milestones,
          scienceFairAttempts: newAttempts,
          scienceFairRibbon: Math.max(milestones.scienceFairRibbon || 0, 2)
        }
      });
    } else if (score >= 20) {
      resultType = "Finalist";
      ribbon = 1;
      statGains = { intelligence: 0.1, empathy: 0, discipline: 0, confidence: 0 };
      
      updateState({
        milestones: {
          ...milestones,
          scienceFairAttempts: newAttempts,
          scienceFairRibbon: Math.max(milestones.scienceFairRibbon || 0, 1)
        }
      });
    } else {
      resultType = "Participation";
      ribbon = 0;
      statGains = { intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0 };
      
      updateState({
        milestones: {
          ...milestones,
          scienceFairAttempts: newAttempts
        }
      });
    }
    
    // Apply stat gains
    applyDeltas(statGains, "Science Fair");
    
    // Add timeline entry
    recordTimelineEntry({
      kind: 'education',
      title: `🔬 Science Fair: ${resultType}`,
      detail: detailLine,
      deltas: statGains,
      moneyDelta: -120,
      loveDelta: 0,
      stressDelta: 0,
      meta: { result: resultType, ribbon, attempts: newAttempts }
    });
    
    // Add log
    addLog(`🔬 Science Fair: Your child completed a science fair project and placed as ${resultType}. ${detailLine}`);
    
    setResult({ type: resultType, ribbon, gains: statGains, detail: detailLine });
    setStep('result');
  };
  
  const handleClose = () => {
    setStep('intro');
    setResult(null);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">🔬 Science Fair Season</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  Your child wants to build something and present it. It's messy, exciting, and very glue‑based.
                </p>
                
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Cost:</span>
                    <span className="font-semibold text-slate-800">$120 (supplies) + 1 Focus</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Result based on:</span>
                    <span className="font-semibold text-slate-800">Intelligence, Discipline, Confidence</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleStart}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base"
                >
                  Start the Project
                </Button>
              </div>
            </motion.div>
          )}
          
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">🔬 Science Fair Result</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="text-center py-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                  <div className="text-5xl mb-2">
                    {result.type === 'Champion' && '🏆'}
                    {result.type === 'Winner' && '🥇'}
                    {result.type === 'Finalist' && '🎖️'}
                    {result.type === 'Participation' && '📝'}
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{result.type}</div>
                  {result.type === 'Champion' && (
                    <div className="text-sm text-purple-600 font-semibold mt-1">National Champion! 🎉</div>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 italic text-center">
                  "{result.detail}"
                </p>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Stat Changes</div>
                  <div className="space-y-1 text-sm">
                    {result.gains.intelligence !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Intelligence</span>
                        <span className="font-semibold text-blue-600">+{result.gains.intelligence.toFixed(1)}</span>
                      </div>
                    )}
                    {result.gains.confidence !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Confidence</span>
                        <span className="font-semibold text-amber-600">+{result.gains.confidence.toFixed(1)}</span>
                      </div>
                    )}
                    {result.gains.discipline !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Discipline</span>
                        <span className="font-semibold text-green-600">+{result.gains.discipline.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={handleClose}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white h-12 text-base"
                >
                  Back
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}