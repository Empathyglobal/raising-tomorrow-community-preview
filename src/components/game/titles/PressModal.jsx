import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/components/game/GameStateContext';

export default function PressModal({ open, onClose }) {
  const { gameState, resolvePressEventChoice } = useGameState();
  const feed = gameState.titles?.pressFeed || [];
  const pending = gameState.titles?.pressPending || null;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[121] p-4 w-full h-[100dvh] flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[calc(100dvh-32px)]">
          <div className="px-5 py-3 border-b bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold">Press</h3>
            <button className="p-2 rounded hover:bg-slate-200" onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 overflow-y-auto">
            {pending && (
              <div className="mb-4 p-3 rounded-lg border bg-amber-50 border-amber-200">
                <div className="text-xs text-amber-700 font-semibold mb-1">New</div>
                <h4 className="font-semibold">{pending.headline}</h4>
                <p className="text-sm text-slate-600 mt-1">{pending.body}</p>
                <div className="mt-3 flex flex-col gap-2">
                  {(pending.choices || []).map((c, idx) => (
                    <Button key={idx} variant="outline" className="justify-start" onClick={() => resolvePressEventChoice(idx)}>
                      {c.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-slate-500 mb-2">Recent coverage</div>
            {feed.length === 0 && <div className="text-sm text-slate-500">No press yet.</div>}
            <div className="space-y-3">
              {feed.slice().reverse().map((it, i) => (
                <div key={i} className="p-3 border rounded-lg bg-white">
                  <div className="text-sm font-semibold">{it.headline}</div>
                  <div className="text-xs text-slate-500">Age {it.age}</div>
                  <p className="text-sm text-slate-600 mt-1">{it.body}</p>
                  {it.outcome && (
                    <div className="mt-2 text-xs text-slate-600">
                      Outcome: {it.outcome}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}