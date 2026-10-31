import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { ROOM_DECOR_CATALOG } from './roomDecorCatalog';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ChoreShuffleMiniGame from '@/components/game/minigames/ChoreShuffleMiniGame';

export default function RoomModal({ open, onClose, initialTab = 'decorate' }) {
  const { gameState, applyDeltas, applyMoneyDelta, addLog, recordTimelineEntry, updateState, applyStress, emitActionResult } = useGameState();
  const [activeTab, setActiveTab] = useState('decorate');
  const [choreOpen, setChoreOpen] = useState(false);

  const handleChoreDone = (res) => {
    const rating = res?.rating || 'Mostly Fine';
    const accuracy = Math.round((res?.accuracy || 0) * 100);
    const effects = res?.effects || { discipline: 0, stress: 0 };
    if (effects.discipline) applyDeltas({ discipline: effects.discipline }, 'Chore Shuffle');
    if (typeof effects.stress === 'number') applyStress(effects.stress, 'Chore Shuffle');
    const bonusText = (effects.discipline === 1 && effects.stress === -1) ? ' (+1 Discipline, -1 Stress)' : '';
    recordTimelineEntry({
      kind: 'home',
      title: `Chores done: ${rating}${bonusText}`,
      detail: `Chore Shuffle (${accuracy}%)`,
      deltas: effects.discipline ? { discipline: effects.discipline } : null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: effects.stress || 0,
    });
    setChoreOpen(false);
  };

  // Block body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setActiveTab(initialTab);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open, initialTab]);

  // Initialize room state if not present
  useEffect(() => {
    if (!gameState.room) {
      updateState({
        room: {
          items: [],
          seeds: {},
          lastViewedAtAge: null
        }
      });
    }
  }, []);

  const room = gameState.room || { items: [], seeds: {}, lastViewedAtAge: null };
  const currentAge = gameState.currentYear || 0;

  // Filter catalog by age
  const availableItems = ROOM_DECOR_CATALOG.filter(item => {
    if (item.minAge > currentAge) return false;
    if (item.maxAge !== null && item.maxAge < currentAge) return false;
    return true;
  });

  // Check if item is owned
  const isOwned = (itemId) => {
    return room.items.some(i => i.id === itemId);
  };

  // Handle purchase
  const handleBuy = (item) => {
    // Check if one-time and already owned
    if (item.oneTime && isOwned(item.id)) {
      toast.error('You already own this item.');
      return;
    }

    // Deduct money (allows negative)
    const wasPositive = gameState.money >= 0;
    applyMoneyDelta(-item.cost, { allowCreditMessage: true });
    const nowNegative = gameState.money - item.cost < 0;

    // Add item to room
    const newItem = {
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      category: item.category,
      cost: item.cost,
      purchasedAtAge: currentAge,
      tags: item.tags,
      seedAdds: item.seedAdds,
      statAdds: item.statAdds
    };

    // Merge seeds
    const newSeeds = { ...room.seeds };
    Object.entries(item.seedAdds || {}).forEach(([key, value]) => {
      newSeeds[key] = (newSeeds[key] || 0) + value;
    });

    // Calculate trophy unlock conditions
    const totalItems = room.items.length + 1;
    const topThemeValue = Math.max(...Object.values(newSeeds), 0);
    const trophyUnlocked = totalItems >= 8 && topThemeValue >= 10;
    const trophies = gameState.trophies || { unlocked: {} };
    const alreadyUnlocked = trophies.unlocked?.room_designer;

    updateState(prev => ({
      room: {
        ...room,
        items: [...room.items, newItem],
        seeds: newSeeds
      },
      ...(trophyUnlocked && !alreadyUnlocked && {
        trophies: {
          unlocked: {
            ...(prev.trophies?.unlocked || {}),
            room_designer: {
              unlockedAtAge: currentAge,
              unlockedAtYear: currentAge,
              note: 'Decor theme completed'
            }
          }
        }
      })
    }));

    // Apply stat deltas
    if (item.statAdds) {
      const statDeltas = {
        intelligence: item.statAdds.intelligence || 0,
        empathy: item.statAdds.empathy || 0,
        discipline: item.statAdds.discipline || 0,
        confidence: item.statAdds.confidence || 0
      };
      applyDeltas(statDeltas, `Room: ${item.name}`);
    }

    // Apply love/stress if present
    if (item.statAdds?.love) {
      updateState({ love: gameState.love + item.statAdds.love });
    }
    if (item.statAdds?.stress) {
      updateState({ stress: gameState.stress + item.statAdds.stress });
    }

    // Timeline entry
    recordTimelineEntry({
      kind: 'system',
      title: `🏠 Room: You added ${item.emoji} ${item.name}.`,
      detail: `Purchased at age ${currentAge} for $${formatMoney(item.cost)}.`,
      deltas: item.statAdds,
      moneyDelta: -item.cost,
      loveDelta: item.statAdds?.love || 0,
      stressDelta: item.statAdds?.stress || 0
    });

    addLog(`🏠 You add ${item.emoji} ${item.name}. The room feels a little more like ${gameState.childName}.`);

    if (trophyUnlocked && !alreadyUnlocked) {
      addLog('🏆 Trophy unlocked: Room Designer');
      recordTimelineEntry({
        kind: 'system',
        title: '🏆 Trophy: Room Designer',
        detail: `Decorated the room with ${totalItems} items and achieved a strong theme (${topThemeValue} theme strength).`
      });
    }

    const popup = pickMissingActionPopup("room", "default");
    if (popup) {
      emitActionResult({
        actionId: "room",
        title: popup.title,
        body: interpolatePopupText(popup.body, { 
          childName: gameState.childName || "your kid",
          itemName: item.name,
          itemEmoji: item.emoji
        }),
        deltas: item.statAdds,
        moneyDelta: -item.cost,
        focusDelta: 0,
        loveDelta: item.statAdds?.love || 0,
        stressDelta: item.statAdds?.stress || 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    // Show stat changes if any
    const statChanges = [];
    if (item.statAdds) {
      Object.entries(item.statAdds).forEach(([stat, value]) => {
        if (value !== 0) {
          const label = stat.toUpperCase().slice(0, 3);
          const sign = value > 0 ? '+' : '';
          statChanges.push(`${label} ${sign}${value.toFixed(1)}`);
        }
      });
    }

    if (statChanges.length > 0) {
      toast.success(`Added ${item.name}! ${statChanges.join(', ')}`, { duration: 4000 });
    } else {
      toast.success(`Added ${item.name}!`, { duration: 3000 });
    }
  };

  // Group items by category for collection view
  const groupedItems = {};
  room.items.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  // Sort each category by purchasedAtAge desc (newest first)
  Object.keys(groupedItems).forEach(cat => {
    groupedItems[cat].sort((a, b) => b.purchasedAtAge - a.purchasedAtAge);
  });

  // Get top 3 room themes
  const topThemes = Object.entries(room.seeds)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
    .join(', ');

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">🏠 {gameState.childName}'s Room</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="decorate">Decorate</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="decorate" className="flex-1 overflow-y-auto mt-4 space-y-3">
            <div className="flex justify-end mb-2">
              <Button size="sm" variant="outline" onClick={() => setChoreOpen(true)}>
                Tidy Up (Mini-Game)
              </Button>
            </div>
            {availableItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No items available for this age yet.</p>
            ) : (
              availableItems.map(item => {
                const owned = isOwned(item.id);
                const disabled = item.oneTime && owned;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      disabled ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.category}</div>
                        <div className="text-sm text-slate-600 mt-1">${formatMoney(item.cost)}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={disabled}
                      className={disabled ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}
                    >
                      {disabled ? 'Owned' : 'Buy'}
                    </Button>
                  </div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="collection" className="flex-1 overflow-y-auto mt-4 space-y-4">
            {room.items.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No items yet. Start decorating!</p>
            ) : (
              <>
                {/* Room Themes */}
                {topThemes && (
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                    <div className="font-semibold text-indigo-900 mb-1">Room Themes</div>
                    <div className="text-sm text-indigo-700">{topThemes}</div>
                  </div>
                )}

                {/* Items by category */}
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-slate-700 mb-2">{category}</h4>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-2xl">{item.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-500">Added at age {item.purchasedAtAge}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
    
    <ChoreShuffleMiniGame
      open={choreOpen}
      onClose={() => setChoreOpen(false)}
      onSkip={() => setChoreOpen(false)}
      onComplete={handleChoreDone}
    />
    </>
  );
}