import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import { getSpriteMetaForDatingProfile } from '@/components/game/relationshipSpriteUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Wine, EyeOff, ChevronLeft } from 'lucide-react';
import { formatMoney } from './GameStateContext'; // Reuse format helper if needed, though not strictly required here
import { getWealthVibeHint } from './relationshipWealthData';
import { toast } from 'sonner';

// Consistent with other modals
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

export default function DatingProfileModal({
  open,
  profile,
  chemistry = 50,
  canUseFocus,
  onClose,
  onMessage,
  onPlanDate,
  onHide
}) {
  const { gameState } = useGameState();
  if (!profile) return null;

  const strengthColor = 
    profile.matchStrength === 'Strong match' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
    profile.matchStrength === 'Decent chance' ? 'bg-blue-100 text-blue-800 border-blue-200' :
    'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Avatar Area */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 text-center border-b border-slate-100 relative">
              <button 
                onClick={onClose}
                className="absolute left-4 top-4 p-2 bg-white/80 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>

              {(() => {
                const meta = getSpriteMetaForDatingProfile(profile, gameState);
                return (
                  <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border border-slate-200 shadow-lg flex items-center justify-center bg-white">
                    <PlayerSpriteAvatar
                      genderKey={meta.genderKey}
                      ageNumber={meta.ageNumber}
                      index={meta.index}
                      size={96}
                      fallbackEmoji={profile.avatar}
                      className="rounded-2xl bg-slate-50 border border-slate-200"
                    />
                  </div>
                );
              })()}
              
              <h2 className="text-2xl font-bold text-slate-900">
                {profile.name}, {profile.age}
              </h2>
              
              <div className="flex justify-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${strengthColor}`}>
                  {profile.matchStrength}
                </span>
              </div>
              
              <div className="text-xs text-slate-500 font-medium mt-2">
                Vibe: {profile.vibeHint}
              </div>
            </div>

            {/* Scrollable Details */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Pills Row */}
              <div className="flex flex-wrap justify-center gap-2">
                {[profile.jobVibe, profile.intent, profile.quirk, profile.kidVibe].filter(Boolean).map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Wealth vibe (tier only — exact amount stays hidden until marriage) */}
              {(profile?.wealthLabel || profile?.wealthTierId) ? (
                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                  <div className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-1">Wealth Vibe</div>
                  <div className="text-sm text-slate-800 font-semibold">
                    {profile?.wealthEmoji || '💰'} {profile?.wealthLabel || 'Mystery Money'}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 italic">
                    {getWealthVibeHint(profile?.wealthTierId)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Exact amount stays hidden until marriage. (Love is blind. The wallet is shy.)
                  </div>
                </div>
              ) : null}

               {/* Bio Quote */}
              <div className="relative bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <span className="absolute top-2 left-2 text-2xl text-amber-200 font-serif leading-none">“</span>
                <p className="text-center text-slate-700 italic text-sm relative z-10 px-2">
                  {profile.about}
                </p>
                <span className="absolute bottom-[-8px] right-2 text-2xl text-amber-200 font-serif leading-none">”</span>
              </div>

              {/* Chemistry Meter */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                  <span>Chemistry</span>
                  <span>{chemistry}/100</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${chemistry}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Tags (Legacy but useful) */}
              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 opacity-80">
                  {profile.tags.map((t, i) => (
                    <span key={i} className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                      {t.emoji} {t.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-3">
              <Button 
                onClick={() => {
                  if (!canUseFocus) {
                    toast('You need at least 1 focus.', { icon: '⚠️' });
                  }
                  onPlanDate(profile);
                }}
                className="col-span-2 h-12 bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-sm"
              >
                <Wine className="w-4 h-4 mr-2" />
                Plan a Date
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => onMessage(profile)}
                className="h-10 border-slate-200 hover:bg-white hover:text-indigo-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => onHide(profile)}
                className="h-10 text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}