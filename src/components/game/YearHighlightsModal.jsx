import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { LIFE_GOALS_BY_ID } from '@/components/content/lifeGoalsPack';

export default function YearHighlightsModal({ open, highlights, onClose }) {
  const { gameState, updateState } = useGameState();
  
  if (!highlights) return null;
  
  const { year, topEvents, unlocked, nearMiss } = highlights;
  
  // Life Goals events for this year
  const events = Array.isArray(gameState.lifeGoals?.recentEvents) ? gameState.lifeGoals.recentEvents : [];
  const age = gameState.currentYear;
  const yearEvents = events.filter(e => e && e.atAge === age);
  
  const renderUnlockedItem = (item) => {
    if (!item) return null;
    if (typeof item === 'string' || typeof item === 'number') {
      return `• ${item}`;
    }
    if (typeof item === 'object') {
      const emoji = item.emoji || '';
      const title = item.title || 'Unlock';
      return (
        <div>
          <div>• {emoji} {title}</div>
          {item.detail && (
            <div className="ml-4 text-xs text-purple-700 mt-0.5">{item.detail}</div>
          )}
        </div>
      );
    }
    return null;
  };
  
  const handleClose = () => {
    // Clear this year's events before closing
    updateState(prev => {
      const lg = prev.lifeGoals || {};
      const ev = Array.isArray(lg.recentEvents) ? lg.recentEvents : [];
      return {
        lifeGoals: { ...lg, recentEvents: ev.filter(e => e.atAge !== prev.currentYear) }
      };
    });
    onClose?.();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-3xl mb-2">📼</div>
            <div className="text-2xl">Year {year} Highlights</div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Life Goals Section */}
          {yearEvents.length > 0 && (
            <motion.div
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm font-semibold text-emerald-900 mb-3">
                🌱 Life Goals
              </div>
              <div className="space-y-2">
                {yearEvents.map((evt, idx) => {
                  const def = LIFE_GOALS_BY_ID[evt.goalId];
                  if (!def) return null;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm text-emerald-800">
                      <span>{def.emoji} {def.title} +1</span>
                      {evt.completed && (
                        <span className="ml-auto text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          ✅ Completed!
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {/* Top 3 events */}
          {topEvents && topEvents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Memorable Moments
              </h3>
              <div className="space-y-3">
                {topEvents.map((evt, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <div className="font-semibold text-slate-800 mb-1">
                      {evt.emoji} {evt.title}
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed">
                      {evt.summary}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Unlocked items */}
          {unlocked && unlocked.length > 0 && (
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm font-semibold text-purple-900 mb-2">
                🎁 Unlocked This Year
              </div>
              <div className="space-y-1">
                {unlocked.map((item, idx) => (
                  <div key={idx} className="text-sm text-purple-800">
                    {renderUnlockedItem(item)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Near-miss message */}
          {nearMiss && (
            <motion.div
              className="bg-amber-50 rounded-xl p-4 border border-amber-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-sm text-amber-900">
                <span className="font-semibold">So close!</span> {nearMiss}
              </div>
            </motion.div>
          )}
          
          <Button
            onClick={handleClose}
            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}