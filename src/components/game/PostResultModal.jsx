import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { formatFollowersShort } from '@/components/game/socialMediaSystem';

export default function PostResultModal({ open, onClose, outcome, platform, niche }) {
  React.useEffect(() => {
    if (!open || !outcome) return;
    if (outcome.tier === 'VIRAL' || outcome.tier === 'LEGENDARY') {
      setTimeout(() => {
        confetti({ particleCount: outcome.tier === 'LEGENDARY' ? 200 : 120, spread: 70, origin: { y: 0.3 } });
      }, 100);
    }
  }, [open, outcome]);

  if (!open || !outcome) return null;

  const { tier, content, metrics } = outcome;
  const badgeMap = {
    FLOP: { label: 'the algorithm looked away', color: 'bg-slate-200 text-slate-700' },
    OK: { label: 'solid post', color: 'bg-slate-800 text-slate-100' },
    BANGER: { label: "you're cooking", color: 'bg-purple-600 text-white' },
    VIRAL: { label: 'Trending!', color: 'bg-rose-600 text-white' },
    LEGENDARY: { label: 'front-page energy', color: 'bg-amber-500 text-white' },
  };
  const badge = badgeMap[tier] || badgeMap.OK;

  const metricPairs = Object.entries(metrics || {}).filter(([k,v]) => typeof v === 'number' && v > 0);

  const wowLines = [
    'A brand slid into your DMs 👀',
    'Someone made a remix of your clip 💀',
    'Your comment section is feral (in a good way)',
    'Algorithm Blessing received ✨',
    'Clip Went Crazy \'\u2728\''
  ];
  const extra = wowLines[Math.floor(Math.random()*wowLines.length)];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{platform?.emoji || '📣'}</span>
                <div>
                  <div className="font-bold text-slate-900">{platform?.label || 'Post Result'}</div>
                  {niche && <div className="text-xs text-slate-500">{niche.emoji} {niche.label}</div>}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>{tier} · {badge.label}</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Post example */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                {content?.title && <div className="text-slate-800 font-semibold mb-1">{content.title}</div>}
                <div className="text-slate-700 text-sm">{content?.caption}</div>
                <div className="text-amber-600 text-sm mt-2">{content?.hook}</div>
                {content?.hashtags?.length > 0 && (
                  <div className="mt-2 text-xs text-slate-500 truncate">{content.hashtags.join(' ')}</div>
                )}
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {metricPairs.map(([key, val]) => (
                  <div key={key} className="p-3 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">{key}</div>
                    <div className="text-lg font-extrabold text-slate-900">{formatFollowersShort(val)}</div>
                  </div>
                ))}
              </div>

              {/* Comments */}
              {content?.comments?.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Top comments</div>
                  <div className="space-y-2">
                    {content.comments.slice(0,5).map((c, i) => (
                      <div key={i} className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">“{c}”</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 italic">{extra}</div>

              <div className="flex justify-end gap-2 pt-1">
                <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm bg-slate-100 hover:bg-slate-200">Close</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}