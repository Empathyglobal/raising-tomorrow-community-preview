import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

function clamp01to3(n) {
  const v = Number(n || 0);
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(3, v));
}

function dots(severity) {
  const s = clamp01to3(severity);
  const filled = '●'.repeat(s);
  const empty = '○'.repeat(3 - s);
  return `${filled}${empty}`;
}

export default function FamilyPatternDetailsModal({
  open,
  pattern,
  severity = 0,
  resolved = false,
  parentDisplayName = 'You',
  childName = 'your child',
  totalUnresolvedLoad = 0,
  onClose
}) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!pattern) return null;

  const safeParentName = (parentDisplayName || 'You').trim() || 'You';
  const safeChildName = (childName || 'your child').trim() || 'your child';

  const sev = clamp01to3(severity);
  const isResolved = Boolean(resolved) || sev === 0;

  const totalLoad = Math.max(0, Number(totalUnresolvedLoad || 0));
  const totalStressLoad = Math.min(1.2, 0.15 * totalLoad);
  const thisStressEstimate = isResolved ? 0 : (0.15 * sev);

  const labelLower = (pattern.label || 'this pattern').toLowerCase();

  const happenedText = `When ${safeParentName} was growing up, ${labelLower} was part of the household. ${pattern.short}`;

  const psychParagraph = `Growing up around ${labelLower} can shape the nervous system in really understandable ways. Kids adapt to stay safe: they learn what to notice, what to hide, and how to keep connection. For ${safeParentName}, this can show up as ${pattern.learn?.whatItCanFeelLike || 'protective habits under stress'} — not because something is "wrong," but because those strategies helped back then. As an adult, those same strategies can accidentally make calm moments feel unfamiliar, and big feelings (yours or ${safeChildName}'s) can trigger "fix it fast" mode, shutdown, or a rush to regain control.`;

  const parentingParagraph = `In parenting, this pattern often gets louder during stress. ${pattern.learn?.howItCanShowUp || 'Under pressure, you may lean into control or distance instead of connection.'} ${pattern.childRipple || ''}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[910]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[911] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0 gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-800 truncate">
                    🧬 {pattern.label}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500">
                      Intensity: <span className="font-mono">{dots(sev)}</span>
                    </span>
                    {isResolved && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✅ Resolved
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center flex-shrink-0"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">Game system, not a diagnosis.</p>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">What happened</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {happenedText}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">How it can affect you</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {psychParagraph}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">How it can affect parenting</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {parentingParagraph}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">In Raising Tomorrow (game effects)</h4>
                    <ul className="text-sm text-slate-700 space-y-1.5">
                      <li>
                        <span className="font-medium">Start-of-age stress load:</span>{' '}
                        Unresolved pattern intensity adds stress each year: <span className="font-mono">min(1.2, 0.15 × totalIntensity)</span>.
                      </li>
                      <li>
                        <span className="font-medium">This run:</span>{' '}
                        total unresolved intensity <span className="font-mono">{totalLoad}</span> → about <span className="font-mono">+{totalStressLoad.toFixed(2)}</span> Stress at the start of each age (cap +1.20).
                      </li>
                      <li>
                        <span className="font-medium">This pattern:</span>{' '}
                        {isResolved ? (
                          <>currently resolved (adds <span className="font-mono">+0.00</span>).</>
                        ) : (
                          <>at intensity <span className="font-mono">{sev}</span> contributes about <span className="font-mono">+{thisStressEstimate.toFixed(2)}</span> before the cap.</>
                        )}
                      </li>
                      <li>
                        <span className="font-medium">High-stress penalties:</span>{' '}
                        Stress <span className="font-mono">≥ 7</span> can trigger a "Burnout Tax" (Focus -1 at the start of the year). Stress <span className="font-mono">≥ 8</span> reduces Love gains by 1.
                      </li>
                      <li>
                        <span className="font-medium">Counselor sessions:</span>{' '}
                        Work on this pattern for 1 Focus and $250 → Stress -0.5, Love +0.1, and intensity -1 (resolved at 0).
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                <Button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700">
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}