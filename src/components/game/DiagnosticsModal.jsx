import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, ACTION_REGISTRY } from '@/components/game/GameStateContext';

export default function DiagnosticsModal({ open, onClose }) {
  const { gameState, getAvailability, SCHOOL_START_AGE } = useGameState();

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

  // Compute focus values
  const focusTotal = gameState.maxFocusTokens || 0;
  const focusSpent = Object.values(gameState.actionsUsed || {}).filter(v => v).length;
  const focusRemaining = Math.max(0, focusTotal - focusSpent);

  // School option IDs
  const schoolOptions = ['public', 'private', 'homeschool', 'empathy'];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[200]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[201] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">🧪 Diagnostics</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Action availability debug panel
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Game State Overview */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Game State</h4>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <div>Age: <span className="font-bold">{gameState.currentYear}</span></div>
                    <div>Money: <span className="font-bold">${gameState.money}</span></div>
                    <div>Debt: <span className="font-bold">${Math.max(0, -gameState.money)}</span></div>
                    <div>Focus Total: <span className="font-bold">{focusTotal}</span></div>
                    <div>Focus Spent: <span className="font-bold">{focusSpent}</span></div>
                    <div>Focus Remaining: <span className="font-bold">{focusRemaining}</span></div>
                    <div>Scenario Pending: <span className="font-bold">{String(gameState.scenarioPending)}</span></div>
                    <div>Scenario Completed: <span className="font-bold">{String(gameState.scenarioCompletedThisAge)}</span></div>
                    <div>School Type: <span className="font-bold">{gameState.schoolType || 'none'}</span></div>
                    <div>Bali Active: <span className="font-bold">{String(gameState.baliActive || false)}</span></div>
                    <div>Finished: <span className="font-bold">{String(gameState.finished || false)}</span></div>
                  </div>
                </div>

                {/* School Options Availability */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">School Options</h4>
                  <div className="space-y-2">
                    {schoolOptions.map(optionId => {
                      const avail = getAvailability({ type: 'school', id: optionId });
                      const labels = {
                        public: 'Public School',
                        private: 'Private School',
                        homeschool: 'Homeschool',
                        empathy: 'Empathy School (Bali)'
                      };
                      
                      return (
                        <div key={optionId} className={`p-3 rounded-lg border-2 ${avail.enabled ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{labels[optionId]}</span>
                            <span className={`text-xs font-bold ${avail.enabled ? 'text-green-700' : 'text-red-700'}`}>
                              {avail.enabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </div>
                          {!avail.enabled && avail.reasonText && (
                            <div className="text-xs text-red-600 mt-1">
                              Code: <span className="font-mono">{avail.reasonCode}</span> • {avail.reasonText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Availability */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">All Actions</h4>
                  <div className="space-y-2">
                    {ACTION_REGISTRY.map(action => {
                      const avail = getAvailability(action.id);
                      
                      return (
                        <div key={action.id} className={`p-3 rounded-lg border-2 ${avail.enabled ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{action.emoji}</span>
                              <span className="font-medium text-sm">{action.label}</span>
                            </div>
                            <span className={`text-xs font-bold ${avail.enabled ? 'text-green-700' : 'text-red-700'}`}>
                              {avail.enabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1">
                            ID: <span className="font-mono">{action.id}</span> • Focus Cost: {action.focusCost} • Min Age: {action.minAge}
                          </div>
                          {!avail.enabled && avail.reasonText && (
                            <div className="text-xs text-red-600 mt-1">
                              Code: <span className="font-mono">{avail.reasonCode}</span> • {avail.reasonText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Parent Strategies Availability */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Parent Strategies</h4>
                  <div className="space-y-2">
                    {['reset', 'miniBreak', 'reflect', 'protectSleep'].map(stratId => {
                      const avail = getAvailability({ type: 'parentStrategy', id: stratId });
                      const labels = {
                        reset: 'Parent Reset',
                        miniBreak: 'Mini Break',
                        reflect: 'Reflect & Repair',
                        protectSleep: 'Protect Sleep'
                      };
                      
                      return (
                        <div key={stratId} className={`p-3 rounded-lg border-2 ${avail.enabled ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{labels[stratId]}</span>
                            <span className={`text-xs font-bold ${avail.enabled ? 'text-green-700' : 'text-red-700'}`}>
                              {avail.enabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </div>
                          {!avail.enabled && avail.reasonText && (
                            <div className="text-xs text-red-600 mt-1">
                              Code: <span className="font-mono">{avail.reasonCode}</span> • {avail.reasonText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}