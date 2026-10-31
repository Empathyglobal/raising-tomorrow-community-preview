import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Star } from 'lucide-react';
import { useGameState, formatMoney } from './GameStateContext';
import { generateRoster } from './CelebrityDatingData';
import CelebrityProfileModal from './CelebrityProfileModal';
import { getFunnyRejectionLine } from './rejectionLinesData';

export default function CelebrityDatingHub({ open, onClose }) {
  const { gameState, updateState, spendMoney, addLog, applyStress, emitActionResult, recordTimelineEntry } = useGameState();
  const [roster, setRoster] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Load or gen roster
  useEffect(() => {
    if (!open) return;
    
    // Check if we have a persisted roster for this "session" or year
    // For now, let's generate if empty or old? 
    // Prompt: "Every time the hub opens (or refreshes), generate a roster... wait, prompts says 'Every time the hub opens...'"
    // Actually, usually games persist this for a bit. Let's persist in local state here for now, or move to context if needed.
    // The prompt says "Refresh rule: Free refresh: 1 per in-game year". This implies persistence.
    // I'll check gameState for a roster, if not found, generate.
    
    if (gameState.celebrityRoster && gameState.celebrityRoster.length > 0) {
      setRoster(gameState.celebrityRoster);
    } else {
      const newRoster = generateRoster();
      setRoster(newRoster);
      updateState({ celebrityRoster: newRoster });
    }
  }, [open, gameState.celebrityRoster, updateState]);

  if (!open) return null;

  const handleRefresh = () => {
    const cost = refreshCount >= 1 ? 25000 : 0;
    
    if (cost > 0 && gameState.money < cost) {
      // Toast/alert
      alert("Even celebrities can’t date you for free.");
      return;
    }

    if (cost > 0) spendMoney(cost);
    
    const newRoster = generateRoster();
    setRoster(newRoster);
    updateState({ celebrityRoster: newRoster });
    setRefreshCount(prev => prev + 1);
  };

  const onMatchAttempt = (success, profile) => {
    setSelectedProfile(null);
    onClose(); // Close hub to show result popup? Or show result popup on top?
    // Prompt implies immediate popup.
    
    if (success) {
      // Match Success
      // Create relationship
      // "Once matched, treat as a relationship entity similar to existing dating relationships."
      
      // Add to relationships
      updateState(prev => {
        const roster = Array.isArray(prev.relationships?.roster) ? prev.relationships.roster : [];
        // Check if already exists (unlikely given roster gen, but safety)
        const existing = roster.find(r => r.id === profile.id);
        if (existing) return prev;

        const newRel = {
          id: profile.id,
          role: 'dating', // or partner? dating usually
          name: profile.name,
          emoji: profile.avatar,
          createdAtAge: prev.currentYear,
          meter: 50,
          isCelebrity: true,
          fameTier: profile.fameTier,
          bioLine: profile.bioLine,
          stats: profile.stats
        };

        const nextRoster = [...roster, newRel];
        return {
          relationships: {
            roster: nextRoster,
            byId: Object.fromEntries(nextRoster.map(p => [p.id, p]))
          },
          // Also set as current match if single?
          // "treat as a relationship entity" -> in "Relationship screen"
          // If single, maybe set as current dating partner?
          dating: prev.householdType === 'single' ? {
            ...(prev.dating || {}),
            status: 'dating',
            currentProfileId: profile.id,
            startedAtAge: prev.currentYear
          } : prev.dating
        };
      });

      // Show Popup
      emitActionResult({
        title: "💫 Celebrity Match!",
        body: `You’ve matched with ${profile.name}.\n\nTheir profile photo looks professionally effortless.\n\nTheir bio simply says: “Busy, but curious.”\n\nThis could be incredible… or extremely short-lived.`,
        tags: ['relationship', 'celebrity'],
        meta: { emoji: '💫' }
      });

      addLog(`💫 Matched with ${profile.name}!`);

    } else {
      // Fail
      const body = getFunnyRejectionLine({
        mode: 'celebrity',
        type: 'no_match',
        name: profile.name
      });

      emitActionResult({
        title: "❌ No Match",
        body,
        tags: ['rejection'],
        meta: { emoji: '❌' }
      });
      
      // Cooldown
      // "cooldown for that profile: 1 in-game month" 
      // We can store this in a `celebrityCooldowns` map in gameState: { [id]: age_year }
      // Since time is yearly, cooldown of "1 month" is basically "this year/turn".
      updateState(prev => ({
        celebrityCooldowns: {
          ...(prev.celebrityCooldowns || {}),
          [profile.id]: prev.currentYear
        }
      }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-[9100] flex flex-col"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 rounded-full p-1">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-none">Celebrity Dating</h2>
              <div className="text-zinc-500 text-xs">Network</div>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-3 text-center shadow-lg relative z-10 shrink-0">
          <p className="text-white font-medium text-sm tracking-wide">
            “Where fame meets questionable decisions.”
          </p>
        </div>

        {/* Roster Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-950">
          <div className="grid grid-cols-2 gap-3 pb-24">
            {roster.map((celeb) => {
              const isCooldown = gameState.celebrityCooldowns?.[celeb.id] === gameState.currentYear;
              
              return (
                <button
                  key={celeb.id}
                  onClick={() => setSelectedProfile(celeb)}
                  disabled={isCooldown}
                  className={`relative group overflow-hidden rounded-xl aspect-[3/4] bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 transition-all ${isCooldown ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                    {celeb.avatar}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-3 left-3 text-left">
                    <div className="text-white font-bold text-sm leading-tight flex items-center gap-1">
                      {celeb.name}
                      {celeb.fameTier === 'A' && <span className="text-[10px] bg-amber-500 text-black px-1 rounded font-black">A</span>}
                    </div>
                    <div className="text-zinc-400 text-xs mt-0.5">{celeb.category}</div>
                  </div>

                  {isCooldown && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-white text-sm">
                      Cooldown
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0 grid gap-3">
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            className="w-full h-12 bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Roster {refreshCount > 0 && `($${formatMoney(25000)})`}
          </Button>
          <Button onClick={onClose} variant="ghost" className="text-zinc-500 hover:text-zinc-300">
            Back
          </Button>
        </div>

        {/* Modals */}
        <CelebrityProfileModal 
          open={!!selectedProfile} 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)}
          onMatchAttempt={onMatchAttempt}
        />

      </motion.div>
    </AnimatePresence>
  );
}