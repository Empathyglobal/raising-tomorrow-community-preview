import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, Heart, Ban, AlertCircle } from 'lucide-react';
import { useGameState } from './GameStateContext';
import { MATCH_BASE_CHANCES } from './CelebrityDatingData';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function CelebrityProfileModal({ open, profile, onClose, onMatchAttempt }) {
  const { gameState } = useGameState();

  if (!open || !profile) return null;

  const handleAttempt = () => {
    // Calculate chance
    const baseChance = MATCH_BASE_CHANCES[profile.fameTier] || 0.15;
    
    // Modifiers
    // Note: Assuming player stats exist or defaults. 
    // looksNormalized etc are not standard in the provided GameStateContext but prompt says "skip missing stats".
    // We'll use the stats object which has 0-20 range usually. Normalize to 0-1.
    const stats = gameState.stats || {};
    const looks = 0.5; // Default if not tracked
    const confidence = (stats.confidence || 5) / 20;
    const moneyFactor = Math.max(0, Math.min(1, (gameState.money || 0) / 50000000));
    const fame = 0; // Not tracked in base game usually
    const stress = (gameState.stress || 0) / 100;

    const modLooks = looks * 0.20;
    const modConf = confidence * 0.10;
    const modMoney = moneyFactor * 0.08;
    const modFame = fame * 0.18;
    const modStress = stress * 0.08; // negative

    const celebStandards = profile.stats.standardsNormalized * 0.22;
    const celebPrivacy = profile.stats.privacyNormalized * 0.10;

    let chance = baseChance + modLooks + modConf + modMoney + modFame - modStress - celebStandards - celebPrivacy;
    
    // Clamp
    chance = Math.max(0.01, Math.min(0.65, chance));

    // FUN BALANCE: Celebrity dating was too punishing — double the final odds.
    chance = Math.max(0.02, Math.min(0.95, chance * 2));

    const roll = Math.random();
    const success = roll < chance;

    onMatchAttempt(success, profile);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-[9102] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          {/* Header Image Area */}
          <div className="h-64 bg-slate-200 relative group">
            <div className="absolute inset-0 flex items-center justify-center text-8xl">
              {profile.avatar}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                {profile.name} 
                {profile.isCuratedFictional && <div className="bg-blue-500 rounded-full p-1"><Star className="w-3 h-3 text-white fill-white" /></div>}
              </h2>
              <div className="text-white/80 font-medium flex items-center gap-2">
                {profile.category} • Tier {profile.fameTier}
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-1">Bio</div>
              <div className="text-slate-800 text-lg font-medium leading-relaxed">
                "{profile.bioLine}"
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="font-bold text-slate-700 text-sm mb-0.5">{Math.round(profile.stats.standardsNormalized * 100)}%</div>
                Standards
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="font-bold text-slate-700 text-sm mb-0.5">{Math.round(profile.stats.privacyNormalized * 100)}%</div>
                Privacy
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="font-bold text-slate-700 text-sm mb-0.5">{Math.round(profile.stats.dramaNormalized * 100)}%</div>
                Drama
              </div>
            </div>

            <div className="text-xs text-center text-slate-400 px-4">
              Tip: Attempting a match is not free emotionally. Rejection may sting.
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-white pb-8">
            <Button 
              onClick={handleAttempt}
              className="w-full h-14 text-lg bg-black hover:bg-slate-800 text-white rounded-xl shadow-xl shadow-black/10"
            >
              Attempt Match
            </Button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}