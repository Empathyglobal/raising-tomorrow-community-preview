import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState } from './GameStateContext';
import { storybookSurfaceClass } from '@/components/ui/storybookSurfaceClass';

export default function LifeGoalMomentModal({ open, moment, onChoose }) {
  const { gameState } = useGameState();

  if (!open || !moment) return null;

  const surfaceClass = storybookSurfaceClass('dialog');
  const isStorybook = Boolean(surfaceClass);

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative w-full max-w-md ${surfaceClass} p-6 space-y-4`}
      >
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">
            🎯 {moment.title}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {moment.body}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          {(moment.choices || []).map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoose(choice.id)}
              className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all ${isStorybook ? 'rt-paper-choice' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{choice.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm">
                    {choice.text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}