import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { getPassionTracksForPrimary } from './passionTracks';
import { formatPrimaryInterest } from './childProfileLabels';
import { getClubInviteForTrack } from './schoolClubCatalog';

export default function PubertyPassionModal({ open, onComplete }) {
  const { gameState, updateState, addLog, recordTimelineEntry, applyDeltas } = useGameState();

  const childName = gameState.childName || 'Your child';
  const primary = gameState.childProfile?.primaryInterest || null;
  const primaryLabel = primary ? formatPrimaryInterest(primary) : 'their interests';
  const tracks = getPassionTracksForPrimary(primary);

  const handlePick = (track) => {
    // Persist
    updateState({
      childProfile: {
        ...(gameState.childProfile || {}),
        pubertyPassion: track.id,
        passionChosenAtAge: 12
      }
    });

    // Gentle nudge (kept intentionally small; outcomes will use the choice more strongly)
    if (track?.deltas) {
      applyDeltas(track.deltas, { source: 'puberty_passion' });
    }

    // Log + timeline
    addLog(`Age 12: ${childName} chose a passion focus — ${track.emoji} ${track.label}.`);
    recordTimelineEntry({
      age: 12,
      kind: 'milestone',
      title: '🌱 Puberty: Passion Focus',
      detail: `${childName}'s age‑6 interest in ${primaryLabel} specialized into ${track.emoji} ${track.label}.`
    });

    // Check for club invite eligibility
    const toyTheme = gameState.childProfile?.stuffedAnimal?.theme;
    const primaryInterest = gameState.childProfile?.primaryInterest;
    const trackId = track.id;
    const trackTheme = trackId.split('_')[0];
    const activeClub = gameState.education?.schoolClubs?.activeClub;
    const deniedClubIds = gameState.education?.schoolClubs?.deniedClubIds || [];

    const shouldQueueInvite = 
      toyTheme && 
      primaryInterest && 
      toyTheme === primaryInterest && 
      trackTheme === primaryInterest && 
      !activeClub;

    if (shouldQueueInvite) {
      const club = getClubInviteForTrack(trackId);
      
      if (club && !deniedClubIds.includes(club.clubId)) {
        const toyEmoji = gameState.childProfile.stuffedAnimal.emoji;
        const toyName = gameState.childProfile.stuffedAnimal.name;
        
        const introText =
          `${childName} comes home with a permission slip and zero hesitation.\n\n` +
          `"I signed up for ${club.name}." They say it like it's the most obvious thing in the world.\n\n` +
          `You think about that old ${toyEmoji} ${toyName} from when they were two… and how some threads just keep tugging.`;
        
        updateState(prev => ({
          education: {
            ...prev.education,
            schoolClubs: {
              ...prev.education?.schoolClubs,
              pendingInvite: {
                ...club,
                trackId,
                introText
              }
            }
          }
        }));
      }
    }

    onComplete?.();
  };

  const handleOpenChange = (nextOpen) => {
    // Don't allow dismiss without choosing — age-up gating will enforce.
    // If you *do* want to allow dismiss later, remove this guard.
    if (!nextOpen) return;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Puberty (Age 12): Choose a Passion Focus</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-slate-600">
          At 12, interests start to branch into something sharper. Since age 6, they've leaned toward <span className="font-semibold text-slate-800">{primaryLabel}</span>.
          <div className="mt-2">What does that become?</div>
        </div>

        <div className="mt-4 space-y-2">
          {tracks.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.2, idx * 0.03) }}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-3 rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => handlePick(t)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl leading-none mt-0.5">{t.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{t.label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{t.description}</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 text-[11px] text-slate-500">
          This choice will strongly shape education & career outcomes later — especially alongside intelligence growth.
        </div>
      </DialogContent>
    </Dialog>
  );
}