import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState } from './GameStateContext';
import { isStorybookPopupsActive } from "@/components/lib/uiTheme";

export default function HomeworkPopupModal({ open, popup, onChoose }) {
  const { gameState } = useGameState();
  const isStorybook = isStorybookPopupsActive(gameState);
  if (!open || !popup) return null;

  if (isStorybook) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 rt-popup--storybook">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative w-full max-w-lg">
          <div className="rt-paper-note -mb-6 relative z-10 text-center">
            <h3 className="text-xl font-bold" style={{color:'var(--ink)'}}>📚 Homework Moment</h3>
            <p className="mt-2" style={{color:'var(--ink)'}}>{popup.body}</p>
          </div>
          <div className="rt-paper-panel pt-8">
            {popup.choices.map((choice) => (
              <button key={choice.id} onClick={() => onChoose(choice.id)} className={`rt-paper-choice rt-paper-choice--blue`}>
                <div className="rt-choice-title">Option {choice.letter}</div>
                <div className="rt-choice-sub">{choice.text.replace(/^[A-Z]: /,'')}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[1150] flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-200"
        >
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-center">
            <h3 className="text-white font-bold text-lg flex items-center justify-center gap-2">
              <span className="text-2xl">📚</span> Homework Moment
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-slate-900 leading-tight text-center">
                {popup.title}
              </h4>
              <p className="text-slate-600 leading-relaxed text-center">
                {popup.body}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {popup.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoose(choice.id)}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {choice.emoji}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800 text-sm mb-0.5">
                        Option {choice.letter}
                      </div>
                      <div className="text-slate-600 text-sm leading-snug font-medium">
                        {choice.text.replace(/^[A-Z]: /, '')}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}