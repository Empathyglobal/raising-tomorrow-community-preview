import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, X as XIcon, Sparkles } from 'lucide-react';
import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';
import { getQualityPill } from './datingDateNightData';
import { formatSmallDelta } from './GameStateContext';

export default function DatingRevealModal({
  open,
  profile,
  dateResult,     // optional: { ideaEmoji, ideaLabel, quality, summary, story, stressDelta, loveDelta, meterDelta, moneyCost }
  chemistry,      // optional number (0-100) for singles
  onClose,
  onKeepDating,
  onEndIt,
  onMakeOfficial
}) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !profile) return null;

  // Compute predicted impact (existing logic)
  const patternIds = profile.patternIds || [];
  const patternSev = profile.patternSev || {};

  const patterns = patternIds.map(id => {
    const catalog = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
    return { id, ...catalog, severity: patternSev[id] || 2 };
  });

  const load = patterns.reduce((sum, p) => sum + p.severity, 0);
  const stressPerYear = Math.min(0.8, 0.10 * load);
  const spill = Math.min(0.25, 0.03 * load);

  const pressures = { threat: 0, shame: 0, chaos: 0, role: 0 };
  patterns.forEach(p => {
    if (p.pressures) {
      pressures.threat += p.pressures.threat || 0;
      pressures.shame += p.pressures.shame || 0;
      pressures.chaos += p.pressures.chaos || 0;
      pressures.role += p.pressures.role || 0;
    }
  });

  const dominant = Object.entries(pressures).sort((a, b) => b[1] - a[1])[0]?.[0] || 'threat';

  let statA, statB, statALabel, statBLabel;
  if (dominant === 'threat') {
    statA = 'confidence'; statB = 'discipline';
    statALabel = 'Confidence'; statBLabel = 'Discipline';
  } else if (dominant === 'shame') {
    statA = 'confidence'; statB = 'empathy';
    statALabel = 'Confidence'; statBLabel = 'Empathy';
  } else if (dominant === 'chaos') {
    statA = 'discipline'; statB = 'intelligence';
    statALabel = 'Discipline'; statBLabel = 'Intelligence';
  } else {
    statA = 'empathy'; statB = 'discipline';
    statALabel = 'Empathy'; statBLabel = 'Discipline';
  }

  const pill = dateResult?.quality ? getQualityPill(dateResult.quality) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[9100]"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="fixed inset-0 z-[9101] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 px-6 py-5 border-b border-pink-200 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5 text-slate-600" />
            </button>

            <h3 className="text-2xl font-bold text-slate-800 mb-1">💘 One Month Later…</h3>
            <p className="text-sm text-slate-600">
              You learn {profile.name} carries these family patterns:
            </p>
          </div>

          {/* Date recap */}
          {dateResult && (
            <div className="px-6 pt-5 space-y-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-xl">{dateResult.ideaEmoji || "🍷"}</span>
                      <span>Last date: {dateResult.ideaLabel || "Date Night"}</span>
                    </div>
                    {pill && (
                      <div className={`inline-flex mt-2 px-2 py-1 text-xs font-semibold rounded-full border ${pill.className}`}>
                        {pill.text} date
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">
                  {dateResult.summary || "A date happened."}
                </div>

                {(typeof chemistry === 'number') && (
                  <div className="mt-4">
                    <div className="text-xs text-slate-500 mb-1">Chemistry</div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
                        style={{ width: `${Math.max(0, Math.min(100, chemistry))}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600">
                      {Math.round(chemistry)}/100
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patterns List */}
          <div className="px-6 py-5 space-y-3">
            {patterns.map(pattern => (
              <div key={pattern.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                  <span>🧬</span>
                  <span>{pattern.label}</span>
                </div>
                <div className="text-xs text-slate-600 mb-2">{pattern.short}</div>
                <div className="text-xs text-slate-500 italic">
                  Kid ripple: {pattern.childRipple}
                </div>
              </div>
            ))}
          </div>

          {/* Predicted Impact */}
          <div className="px-6 pb-5">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Likely household weather (game estimate)
              </h4>
              <div className="text-xs text-slate-700 space-y-1">
                <p>• If you eventually co‑parent together, this could add: <span className="font-semibold">{formatSmallDelta(stressPerYear)} Stress/year</span>.</p>
                <p>• And gently tug: <span className="font-semibold">{formatSmallDelta(-spill/2)} {statALabel}/year</span>, <span className="font-semibold">{formatSmallDelta(-spill/2)} {statBLabel}/year</span>.</p>
                <p className="text-amber-700 font-medium mt-2">Not destiny—support + skills can buffer it.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 space-y-3">
            <Button
              onClick={onKeepDating}
              className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Heart className="w-5 h-5 mr-2" />
              Keep Dating
            </Button>

            <Button
              onClick={onEndIt}
              variant="outline"
              className="w-full h-12 border-2"
            >
              <XIcon className="w-4 h-4 mr-2" />
              End It
            </Button>

            <Button
              onClick={onMakeOfficial}
              className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
            >
              💍 Make It Official
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}