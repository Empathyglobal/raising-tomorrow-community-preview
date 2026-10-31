import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatDeltas } from '@/components/game/GameStateContext';
import { isStorybookPopupsActive } from "@/components/lib/uiTheme";

export default function ChaosModeModal({ open, event, onChoose }) {
  const { gameState } = useGameState();

  if (!event) return null;
  const isStorybook = isStorybookPopupsActive(gameState);

  if (isStorybook && open) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 rt-popup--storybook">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative w-full max-w-lg">
          <div className="rt-paper-note -mb-6 relative z-10">
            <h2 className="text-xl font-bold" style={{color:'var(--ink)'}}>🌪 Chaos Mode</h2>
            <p className="mt-2 whitespace-pre-line" style={{color:'var(--ink)'}}>{event.body}</p>
          </div>
          <div className="rt-paper-panel pt-8">
            {event.choices.map((choice) => (
              <button key={choice.id} onClick={() => onChoose(choice.id)} className={`rt-paper-choice rt-paper-choice--navy`}>
                <div className="rt-choice-title">Option {choice.letter}</div>
                <div className="rt-choice-sub">{choice.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-800"
          >
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🌪️</span>
              <h2 className="text-xl font-bold text-white tracking-wide uppercase">Chaos Mode</h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {event.title}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {event.body}
                </p>
              </div>

              {/* Choices */}
              <div className="space-y-3">
                {event.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => onChoose(choice.id)}
                    className="w-full text-left group relative p-4 rounded-xl border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {choice.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">Option {choice.letter}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                            {choice.text}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {choice.deltas && Object.keys(choice.deltas).length > 0 && (
                            <span>{formatDeltas(choice.deltas)}</span>
                          )}
                          {choice.loveDelta !== 0 && (
                            <span className={choice.loveDelta > 0 ? "text-rose-500" : "text-slate-500"}>
                              {choice.loveDelta > 0 ? "+" : ""}{choice.loveDelta} Love
                            </span>
                          )}
                          {choice.stressDelta !== 0 && (
                            <span className={choice.stressDelta > 0 ? "text-amber-600" : "text-emerald-600"}>
                              {choice.stressDelta > 0 ? "+" : ""}{choice.stressDelta} Stress
                            </span>
                          )}
                          {choice.moneyDelta !== 0 && (
                            <span className={choice.moneyDelta > 0 ? "text-green-600" : "text-red-600"}>
                              {choice.moneyDelta > 0 ? "+" : ""}${Math.abs(choice.moneyDelta)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}