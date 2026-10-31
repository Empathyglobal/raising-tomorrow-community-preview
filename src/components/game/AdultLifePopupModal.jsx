/* components/game/AdultLifePopupModal.jsx */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState } from './GameStateContext';
import { isStorybookPopupsActive } from '@/components/lib/uiTheme';
import { getStatDisplayName } from '@/components/game/statLabels';

function fmtSigned(n) {
  const v = Number(n || 0);
  if (!v) return '';
  return v > 0 ? `+${v}` : `${v}`;
}

function summarizeChoice(choice) {
  if (!choice) return '';
  const parts = [];

  if (choice.stressDelta) parts.push(`Stress ${fmtSigned(choice.stressDelta)}`);
  if (choice.loveDelta) parts.push(`Love ${fmtSigned(choice.loveDelta)}`);
  if (choice.moneyDelta) parts.push(`Money ${fmtSigned(choice.moneyDelta)}`);
  if (choice.babyPressureDelta) parts.push(`Baby Pressure ${fmtSigned(choice.babyPressureDelta)}`);

  const deltas = choice.deltas || {};
  for (const [k, v] of Object.entries(deltas)) {
    if (!v) continue;
    parts.push(`${getStatDisplayName(k)} ${fmtSigned(v)}`);
  }

  return parts.join(' • ');
}

export default function AdultLifePopupModal({ open, popup, disabled = false, onChoose }) {
  const { gameState } = useGameState();
  const storybook = isStorybookPopupsActive(gameState);

  if (!popup) return null;

  const content = (
    <>
      <div className="text-center mb-3">
        <div className="text-xs uppercase tracking-widest text-slate-500">Adult Life Moment</div>
        <div className="text-lg font-bold text-slate-800 mt-1">{popup.title}</div>
      </div>

      <div className="text-sm text-slate-700 whitespace-pre-line mb-4 leading-relaxed">
        {popup.body}
      </div>

      <div className="space-y-2">
        {popup.choices?.map((c, idx) => {
          const summary = summarizeChoice(c);
          return (
            <Button
              key={c.id || idx}
              disabled={disabled}
              onClick={() => onChoose?.(c.id)}
              className="w-full justify-start h-auto py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800"
              variant="outline"
            >
              <div className="flex flex-col text-left w-full">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{c.emoji || '✨'}</span>
                  <span className="font-semibold">{c.text}</span>
                </div>
                {summary ? (
                  <div className="text-xs text-slate-500 mt-1">{summary}</div>
                ) : null}
              </div>
            </Button>
          );
        })}
      </div>
    </>
  );

  // Storybook variant
  if (storybook) {
    return (
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-[#f8f2e6] border-2 border-[#d9c7a5] shadow-xl p-5"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="rounded-xl bg-white/70 p-4">
                {content}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  // Normal variant
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl p-5"
            initial={{ scale: 0.98, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 10 }}
          >
            {content}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}