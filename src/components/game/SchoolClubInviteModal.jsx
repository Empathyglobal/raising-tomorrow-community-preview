import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

export default function SchoolClubInviteModal({ open, invite, onClose }) {
  const { gameState, updateState, applyMoneyDelta, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry } = useGameState();
  const [processing, setProcessing] = React.useState(false);

  const handleAllow = () => {
    if (processing || !invite) return;
    setProcessing(true);

    // Pay dues
    applyMoneyDelta(-invite.dues, invite.name);

    // Apply stat deltas
    applyDeltas(invite.joinDeltas, invite.name);

    // Add room seeds
    const newSeeds = { ...(gameState.room?.seeds || {}) };
    Object.keys(invite.seedAdds).forEach(key => {
      newSeeds[key] = (newSeeds[key] || 0) + invite.seedAdds[key];
    });

    // Update state
    updateState(prev => ({
      room: {
        ...prev.room,
        seeds: newSeeds
      },
      education: {
        ...prev.education,
        schoolClubs: {
          ...prev.education?.schoolClubs,
          activeClub: {
            clubId: invite.clubId,
            trackId: invite.trackId,
            name: invite.name,
            emoji: invite.emoji,
            joinedAtAge: prev.currentYear,
            theme: invite.theme
          },
          pendingInvite: null
        }
      }
    }));

    // Add log
    const childName = gameState.childName || 'Your child';
    addLog(`${invite.emoji} ${childName} joins ${invite.name}. They start talking about it at dinner like it's a second language.`);

    // Record timeline
    recordTimelineEntry({
      kind: 'school',
      title: `Age ${gameState.currentYear}: Joined ${invite.name}`,
      detail: `You allowed them to join. They look taller somehow.`,
      deltas: invite.joinDeltas,
      moneyDelta: -invite.dues,
      loveDelta: 0,
      stressDelta: 0,
      meta: { clubId: invite.clubId, trackId: invite.trackId }
    });

    setTimeout(() => {
      setProcessing(false);
      onClose();
    }, 200);
  };

  const handleDeny = () => {
    if (processing || !invite) return;
    setProcessing(true);

    // Harsh penalty
    applyLove(-10, 'Club denied');
    applyStress(1.5, 'Club denied');
    applyDeltas({ confidence: -2, discipline: -1, empathy: -1, intelligence: 0 }, 'Club denied');

    // Update state
    updateState(prev => {
      const deniedClubIds = prev.education?.schoolClubs?.deniedClubIds || [];
      const updated = deniedClubIds.includes(invite.clubId) ? deniedClubIds : [...deniedClubIds, invite.clubId];
      
      return {
        education: {
          ...prev.education,
          schoolClubs: {
            ...prev.education?.schoolClubs,
            pendingInvite: null,
            deniedClubIds: updated
          }
        }
      };
    });

    // Add log
    const childName = gameState.childName || 'Your child';
    addLog(`${childName} doesn't argue. That's the part that hurts. (${invite.name} never comes up again.)`);

    // Record timeline
    recordTimelineEntry({
      kind: 'relationship',
      title: `Age ${gameState.currentYear}: Club Denied`,
      detail: `You forbade ${invite.name}. Love took a serious hit.`,
      deltas: { confidence: -2, discipline: -1, empathy: -1, intelligence: 0 },
      moneyDelta: 0,
      loveDelta: -10,
      stressDelta: 1.5,
      meta: { clubId: invite.clubId, denied: true }
    });

    setTimeout(() => {
      setProcessing(false);
      onClose();
    }, 200);
  };

  // Prevent body scroll
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

  if (!invite) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[125]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[126] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>{invite.emoji}</span>
                  <span>Middle School Club</span>
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {invite.introText}
                </div>

                <div className="bg-amber-50 rounded-lg px-4 py-3 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800">Club dues: ${formatMoney(invite.dues)}</p>
                </div>

                <div className="space-y-3 mt-6">
                  <Button
                    onClick={handleAllow}
                    disabled={processing}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
                  >
                    Let them join
                  </Button>

                  <Button
                    onClick={handleDeny}
                    disabled={processing}
                    variant="outline"
                    className="w-full h-12 border-red-200 text-red-700 hover:bg-red-50"
                  >
                    No. Not allowed.
                  </Button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Denying has serious emotional consequences.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}