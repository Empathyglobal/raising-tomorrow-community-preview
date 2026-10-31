import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, HOMESCHOOL_CURRICULUM, HOMESCHOOL_SUPPORT, formatDeltas } from './GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { Button } from '@/components/ui/button';

export default function HomeschoolSetupModal({ open, onClose, onComplete }) {
  const { gameState, updateState, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const [selectedCurriculum, setSelectedCurriculum] = useState(gameState.homeschoolCurriculumId || 'project');
  const [selectedSupport, setSelectedSupport] = useState(gameState.homeschoolSupportPlanId || 'diy');

  // Block body scroll when modal is open
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

  const handleStartHomeschooling = () => {
    const curriculum = HOMESCHOOL_CURRICULUM[selectedCurriculum];
    const support = HOMESCHOOL_SUPPORT[selectedSupport];

    updateState({
      schoolType: "homeschool",
      homeschoolCurriculumId: selectedCurriculum,
      homeschoolSupportPlanId: selectedSupport,
      privateSchoolActive: false,
      privateSchoolScholarship: false
    });

    addLog(`🏠 Homeschooling started: ${curriculum.label} + ${support.label}. (Takes effect next age.)`);

    recordTimelineEntry({
      kind: "system",
      title: "🏠 Homeschooling started",
      detail: `${curriculum.label} + ${support.label}`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("school", "homeschool");
    if (popup) {
      emitActionResult({
        actionId: "school",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    onComplete();
  };

  const totalCost = 
    (HOMESCHOOL_CURRICULUM[selectedCurriculum]?.cost || 0) + 
    (HOMESCHOOL_SUPPORT[selectedSupport]?.cost || 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[110]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[111] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">🏠 Homeschool Plan</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Curriculum Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">1. Choose Curriculum</h4>
                  <div className="space-y-2">
                    {Object.entries(HOMESCHOOL_CURRICULUM).map(([id, config]) => (
                      <label
                        key={id}
                        className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedCurriculum === id
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="curriculum"
                          value={id}
                          checked={selectedCurriculum === id}
                          onChange={(e) => setSelectedCurriculum(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-slate-800">{config.label}</div>
                          <div className="text-sm text-slate-600">${config.cost}/yr</div>
                        </div>
                        <div className="text-xs text-slate-500">
                          Yearly: {formatDeltas(config.deltas)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Support Plan Section */}
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">2. Choose Support Plan</h4>
                  <div className="space-y-2">
                    {Object.entries(HOMESCHOOL_SUPPORT).map(([id, config]) => (
                      <label
                        key={id}
                        className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedSupport === id
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 bg-white hover:border-green-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="support"
                          value={id}
                          checked={selectedSupport === id}
                          onChange={(e) => setSelectedSupport(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-slate-800">{config.label}</div>
                          <div className="text-sm text-slate-600">${config.cost}/yr</div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {config.cost > 0 && formatDeltas(config.deltas) && `Yearly: ${formatDeltas(config.deltas)} • `}
                          {config.stressDelta !== 0 && `STRESS ${config.stressDelta > 0 ? '+' : ''}${config.stressDelta}`}
                          {config.cost === 0 && config.stressDelta > 0 && 'Yearly: STRESS +1'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Total Annual Cost:</span>
                    <span className="text-lg font-bold text-slate-800">${totalCost}/yr</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Charged at the start of each age</div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 space-y-2">
                <Button
                  onClick={handleStartHomeschooling}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  Start Homeschooling
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}