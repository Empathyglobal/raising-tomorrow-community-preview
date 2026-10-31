import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/components/game/GameStateContext';
import FamilyPatternDetailsModal from '@/components/game/FamilyPatternDetailsModal';
import { FAMILY_PATTERN_CATALOG } from '@/components/game/familyPatternCatalog';

export default function FamilyPatternsOverviewModal({ open, onClose }) {
  const { gameState } = useGameState();
  const fp = gameState.familyPatterns || { selectedIds: [], severityById: {}, resolvedById: {} };
  const selected = Array.isArray(fp.selectedIds) ? fp.selectedIds : [];

  const [activeId, setActiveId] = React.useState(null);
  const pattern = FAMILY_PATTERN_CATALOG.find(p => p.id === activeId) || null;
  const totalUnresolvedLoad = selected.reduce((sum, id) => sum + (fp.resolvedById?.[id] ? 0 : (fp.severityById?.[id] || 0)), 0);

  React.useEffect(() => {
    if (!open) setActiveId(null);
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[900]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-[901] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Family Traumas</h3>
                  <p className="text-xs text-slate-500">Depth info for this run</p>
                </div>
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </div>

              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {selected.length === 0 ? (
                  <div className="text-sm text-slate-600">
                    No traumas selected at start. You can still play fully; story will be more general.
                  </div>
                ) : (
                  selected.map((id) => {
                    const p = FAMILY_PATTERN_CATALOG.find(x => x.id === id);
                    const sev = fp.severityById?.[id] || 0;
                    const resolved = !!fp.resolvedById?.[id];
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveId(id)}
                        className="w-full text-left p-3 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition"
                      >
                        <div className="font-semibold text-slate-800">{p?.label || id}</div>
                        <div className="text-xs text-slate-600">Intensity {sev}/3 {resolved ? '• Resolved' : ''}</div>
                      </button>
                    );
                  })
                )}

                {selected.length > 0 && (
                  <div className="text-[11px] text-slate-500 italic">
                    Unresolved total load: {totalUnresolvedLoad}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <FamilyPatternDetailsModal
            open={!!activeId}
            pattern={pattern}
            severity={fp.severityById?.[activeId] || 0}
            resolved={!!fp.resolvedById?.[activeId]}
            parentDisplayName={gameState.parentName || 'You'}
            childName={gameState.childName || 'your child'}
            totalUnresolvedLoad={totalUnresolvedLoad}
            onClose={() => setActiveId(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}