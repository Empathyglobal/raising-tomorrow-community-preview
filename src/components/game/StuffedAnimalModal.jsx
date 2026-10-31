import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';

const PLUSH_CATALOG = [
  {
    id: "plush_rocket_bear",
    theme: "SPACE",
    name: "Rocket Bear",
    emoji: "🧸🚀",
    price: 35,
    blurb: "A tiny bear with a stitched-on helmet. Somehow it feels… important.",
    seedAdds: { space: 1, science: 1 },
    statDeltas: { intelligence: 0.2, confidence: 0.1 },
    loveDelta: 0.6,
    stressDelta: -0.2,
    logLine: "You bring home Rocket Bear. From that moment on, the bear is promoted to 'Co-Parent.'"
  },
  {
    id: "plush_otter_pal",
    theme: "ANIMALS",
    name: "Otter Pal",
    emoji: "🧸🦦",
    price: 30,
    blurb: "Soft, friendly, and immediately given a name you're not allowed to change.",
    seedAdds: { nature: 2 },
    statDeltas: { empathy: 0.2, discipline: 0.1 },
    loveDelta: 0.6,
    stressDelta: -0.2,
    logLine: "Otter Pal becomes the official bedtime negotiator. It wins every argument."
  },
  {
    id: "plush_paint_bunny",
    theme: "ART",
    name: "Paint Bunny",
    emoji: "🧸🎨",
    price: 30,
    blurb: "A bunny with a little paint-splatter belly. It practically hums with imagination.",
    seedAdds: { art: 2, performance: 1 },
    statDeltas: { confidence: 0.2, intelligence: 0.1 },
    loveDelta: 0.6,
    stressDelta: -0.2,
    logLine: "Paint Bunny 'helps' with everything. Including art. Including snacks. Including your sanity."
  },
  {
    id: "plush_builder_bot",
    theme: "BUILDING",
    name: "Builder Bot",
    emoji: "🧸🤖",
    price: 40,
    blurb: "A friendly robot plush with embroidered gears. It looks like it wants to solve problems.",
    seedAdds: { engineering: 2, tech: 1 },
    statDeltas: { discipline: 0.2, intelligence: 0.2 },
    loveDelta: 0.6,
    stressDelta: -0.2,
    logLine: "Builder Bot arrives. Suddenly every cardboard box is a 'project.'"
  },
  {
    id: "plush_helper_heart",
    theme: "PEOPLE",
    name: "Helper Heart",
    emoji: "🧸🤝",
    price: 30,
    blurb: "A plush with big gentle eyes and a tiny stitched handshake. Comfort, but make it brave.",
    seedAdds: { hero: 1, leadership: 1 },
    statDeltas: { empathy: 0.2, confidence: 0.1 },
    loveDelta: 0.6,
    stressDelta: -0.2,
    logLine: "Helper Heart is hugged whenever feelings get big. Which is… often. Because: two."
  }
];

export default function StuffedAnimalModal({ open, onComplete }) {
  const { gameState, updateState, applyDeltas, applyLove, applyStress, applyMoneyDelta, addLog, recordTimelineEntry, unlockMetaAchievement, loadMetaAchievements } = useGameState();
  const [processing, setProcessing] = React.useState(false);

  const handleChoosePlush = (plush) => {
    if (processing) return;
    setProcessing(true);

    try {
      // Apply money cost
      applyMoneyDelta(-plush.price, `Stuffed animal: ${plush.name}`);

      // Apply stat deltas
      applyDeltas(plush.statDeltas, "Stuffed animal");
      applyLove(plush.loveDelta, "Stuffed animal");
      applyStress(plush.stressDelta, "Stuffed animal");

      // Add to room inventory
      const roomItem = {
        id: `plush_${plush.id}_${Date.now()}`,
        category: "Plushies",
        name: plush.name,
        emoji: plush.emoji,
        cost: plush.price,
        purchasedAtAge: gameState.currentYear,
        tags: [plush.theme]
      };

      // Add room seeds
      const newSeeds = { ...(gameState.room?.seeds || {}) };
      Object.keys(plush.seedAdds).forEach(key => {
        newSeeds[key] = (newSeeds[key] || 0) + plush.seedAdds[key];
      });

      // Update state
      updateState(prev => ({
        childProfile: {
          ...prev.childProfile,
          stuffedAnimal: {
            id: plush.id,
            theme: plush.theme,
            name: plush.name,
            emoji: plush.emoji,
            price: plush.price,
            chosenAtAge: prev.currentYear
          }
        },
        room: {
          ...prev.room,
          items: [...(prev.room?.items || []), roomItem],
          seeds: newSeeds
        }
      }));

      // Add log
      addLog(plush.logLine);

      // Record timeline
      recordTimelineEntry({
        kind: "milestone",
        title: "Age 2: A Comfort Toy",
        detail: `You bought ${gameState.childName} ${plush.name}. ${plush.blurb}`,
        deltas: plush.statDeltas,
        moneyDelta: -plush.price,
        loveDelta: plush.loveDelta,
        stressDelta: plush.stressDelta,
        meta: { stuffedAnimalTheme: plush.theme, stuffedAnimalId: plush.id }
      });

      // Unlock meta-achievement for this plush theme
      const achievementId = `plush_${plush.theme.toLowerCase()}`;
      unlockMetaAchievement(achievementId);

      // Check if all 5 plush achievements are now unlocked
      if (loadMetaAchievements) {
        const meta = loadMetaAchievements();
        const allPlushThemes = ['plush_space', 'plush_animals', 'plush_art', 'plush_building', 'plush_people'];
        const allUnlocked = allPlushThemes.every(id => meta[id]);
        
        if (allUnlocked) {
          unlockMetaAchievement('plush_full_set');
        }
      }

      // Close modal
      setTimeout(() => {
        setProcessing(false);
        if (onComplete) onComplete();
      }, 300);
    } catch (e) {
      console.error("Error choosing plush:", e);
      setProcessing(false);
    }
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[130]"
            style={{ pointerEvents: 'auto' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[131] flex items-center justify-center p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-pink-50 to-purple-50">
                <h3 className="text-xl font-bold text-slate-800">🧸 Age 2: Pick a Comfort Toy</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Every child needs something soft to hold onto. Choose one.
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-3">
                {PLUSH_CATALOG.map(plush => {
                  const canAfford = gameState.money >= plush.price;
                  return (
                    <button
                      key={plush.id}
                      onClick={() => handleChoosePlush(plush)}
                      disabled={processing}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors ${
                        processing
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 hover:border-pink-400 hover:bg-pink-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{plush.emoji}</span>
                          <span className="font-bold text-slate-800">{plush.name}</span>
                        </div>
                        <div className={`text-sm font-semibold ${!canAfford ? 'text-red-600' : 'text-slate-600'}`}>${formatMoney(plush.price)}</div>
                      </div>
                      <div className="text-sm text-slate-700 mb-2 italic">{plush.blurb}</div>
                      <div className="text-xs text-slate-500">
                        Theme: {plush.theme}
                      </div>
                      {!canAfford && (
                        <div className="mt-2 text-xs text-amber-600 font-medium">⚠️ Will put you in debt</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}