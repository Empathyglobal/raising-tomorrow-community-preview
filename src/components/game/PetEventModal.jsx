import React from 'react';
import { motion } from 'framer-motion';
import { useGameState } from './GameStateContext';
import { Button } from '@/components/ui/button';

export default function PetEventModal() {
  const { gameState, resolvePetEvent } = useGameState();
  const { petEventPending } = gameState;

  if (!petEventPending) return null;

  const isDeath = petEventPending.type === 'petDeath';

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className={`h-2 ${isDeath ? 'bg-slate-800' : 'bg-emerald-500'}`} />
        
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">
            {isDeath ? '🕯️' : '🐾'}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {petEventPending.title}
          </h2>
          
          <p className="text-slate-600 leading-relaxed mb-8">
            {petEventPending.body}
          </p>

          <div className="space-y-3">
            {Array.isArray(petEventPending.choices) && petEventPending.choices.length > 0 ? (
              petEventPending.choices.map((choice, idx) => (
                <Button
                  key={idx}
                  onClick={() => resolvePetEvent(petEventPending, idx)}
                  className={`w-full py-6 text-lg ${
                    isDeath ? 'bg-slate-800 hover:bg-slate-900' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {choice?.text || "OK"}
                </Button>
              ))
            ) : (
              <Button
                onClick={() => resolvePetEvent(petEventPending, 0)}
                className={`w-full py-6 text-lg ${
                  isDeath ? 'bg-slate-800 hover:bg-slate-900' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}