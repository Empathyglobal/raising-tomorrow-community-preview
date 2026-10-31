import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { formatTenth } from '@/components/lib/numberPrecision';

export default function RecommendedPlanResultModal({ open, results, onClose }) {
  if (!results || !Array.isArray(results.actions)) return null;
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-xl">Plan Complete</div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(80vh-140px)] pr-1">
        <div className="space-y-4">
          {/* Individual results */}
          <div className="space-y-2">
            {results.actions.map((actionResult, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="font-medium text-slate-800 mb-1">
                  {actionResult.emoji} {actionResult.title}
                </div>
                <div className="text-sm text-slate-600">
                  {actionResult.summary}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
            <div className="text-sm font-semibold text-emerald-900 mb-2">
              Total Impact
            </div>
            <div className="space-y-1 text-sm text-slate-700">
              {results.totals.love !== 0 && (
                <div>Love: {formatTenth(results.totals.love, { sign: true })}</div>
              )}
              {results.totals.stress !== 0 && (
                <div>Stress: {formatTenth(results.totals.stress, { sign: true })}</div>
              )}
              {Object.entries(results.totals.stats || {}).map(([stat, val]) => (
                val !== 0 && <div key={stat}>{stat}: {formatTenth(val, { sign: true })}</div>
              ))}
              {results.totals.money !== 0 && (
                <div>Money: {formatTenth(results.totals.money, { sign: true, money: true })}</div>
              )}
              <div className="text-emerald-700 font-semibold mt-2">
                Focus spent: -{results.totals.focus}
              </div>
            </div>
          </div>
          
          {/* Collectibles */}
          {results.collectibles && results.collectibles.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <div className="text-sm font-semibold text-amber-900 mb-1">
                Unlocked:
              </div>
              {results.collectibles.map((col, idx) => (
                <div key={idx} className="text-sm text-amber-800">
                  {col}
                </div>
              ))}
            </div>
          )}
          
          <Button
            onClick={onClose}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold"
          >
            Done
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}