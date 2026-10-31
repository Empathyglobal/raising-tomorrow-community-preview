import React, { useState } from 'react';
import GameModalShell from '@/components/game/GameModalShell';
import { useGameState } from '@/components/game/GameStateContext';
import { WISDOM_LENSES, getWisdomTier, getTierInfo } from '@/components/game/wisdomLensesCatalog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const LensCard = ({ lens, xp, onEquip, isEquipped, isOtherSlotEquipped }) => {
  const tierInfo = getTierInfo(lens.id, { [lens.id]: xp });
  const nextTier = lens.tiers.find(t => t.tier > tierInfo.tier);
  
  const progress = nextTier ? ((xp - (tierInfo.xp || 0)) / (nextTier.xp - (tierInfo.xp || 0))) * 100 : 100;

  return (
    <div className="bg-slate-100/50 p-4 rounded-lg border">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{lens.emoji}</div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800">{lens.name}</h3>
          <p className="text-xs text-slate-500">{lens.short}</p>
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
              <span>{tierInfo.label}</span>
              {nextTier && <span>Next: {nextTier.xp} XP</span>}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="mt-3 flex gap-2">
            {!isEquipped && (
              <>
                <Button size="sm" variant="outline" onClick={() => onEquip(lens.id, 0)} disabled={isOtherSlotEquipped(0, lens.id)}>Equip Slot 1</Button>
                <Button size="sm" variant="outline" onClick={() => onEquip(lens.id, 1)} disabled={isOtherSlotEquipped(1, lens.id)}>Equip Slot 2</Button>
              </>
            )}
            {isEquipped && <span className="text-xs font-semibold text-green-600">Equipped</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WisdomLensesModal({ open, onClose }) {
  const { gameState, updateState, awardWisdomXP, spendFocus, applyStress, applyLove, applyDeltas, applyMoneyDelta, emitActionResult } = useGameState();
  const { wisdom, pendingScenario, finished } = gameState;
  const canPractice = !pendingScenario && !finished;

  const handleEquip = (lensId, slot) => {
    updateState(prev => {
        const newEquipped = [...prev.wisdom.equipped];
        
        // if same lens is in other slot, clear other slot
        const otherSlot = slot === 0 ? 1 : 0;
        if(newEquipped[otherSlot] === lensId) {
            newEquipped[otherSlot] = null;
        }

        // if this slot has a lens, and it's being replaced, fine
        // if this slot has the same lens, unequip it
        if (newEquipped[slot] === lensId) {
            newEquipped[slot] = null;
        } else {
            newEquipped[slot] = lensId;
        }

        return { ...prev, wisdom: { ...prev.wisdom, equipped: newEquipped }};
    });
    toast.success(`${WISDOM_LENSES.find(l => l.id === lensId).name} updated.`);
  };

  const isOtherSlotEquipped = (slot, lensId) => {
      const otherSlot = slot === 0 ? 1 : 0;
      return wisdom.equipped[otherSlot] === lensId;
  }

  const handlePractice = (type) => {
    if (!canPractice) return;
    if (!spendFocus(1, "Wisdom Practice")) return;

    if (type === 'meditate') {
      applyStress(-2);
      awardWisdomXP("mindfulness", 2, "Practice: Meditate");
      emitActionResult({ title: "🧘 Meditate", body: "You practiced mindfulness for 10 minutes. Stress -2.", deltas: {}, stressDelta: -2, focusDelta: -1 });
    } else if (type === 'compassion') {
      applyLove(1);
      applyStress(-1);
      awardWisdomXP("compassion", 2, "Practice: Compassion");
      emitActionResult({ title: "💛 Compassion", body: "You practiced compassion. Love +1, Stress -1.", deltas: {}, loveDelta: 1, stressDelta: -1, focusDelta: -1 });
    } else if (type === 'letgo') {
      applyStress(-2);
      awardWisdomXP("impermanence", 2, "Practice: Let Go");
      emitActionResult({ title: "🌊 Let Go", body: "You practiced letting go of an expectation. Stress -2.", deltas: {}, stressDelta: -2, focusDelta: -1 });
    }
    onClose();
  };

  const handleVipassana = () => {
    if (!canPractice) return;
    if (gameState.money < 250) {
      toast.error("Not enough money for the retreat ($250).");
      return;
    }
    if (!spendFocus(2, "Vipassana Retreat")) return;

    applyMoneyDelta(-250, {source: "Vipassana Retreat"});
    applyStress(-6);
    applyDeltas({ empathy: 0.5, discipline: 0.5 }, "Vipassana Retreat");
    awardWisdomXP("mindfulness", 5, "Vipassana Retreat");
    emitActionResult({ title: "🏕️ Vipassana Retreat", body: "You spent the weekend on a silent retreat. It was hard, but clarifying. Stress -6, Empathy +0.5, Discipline +0.5", deltas: {empathy: 0.5, discipline: 0.5}, moneyDelta: -250, stressDelta: -6, focusDelta: -2 });
    onClose();
  };

  const mindfulnessTier = getWisdomTier('mindfulness', wisdom.xp);

  return (
    <GameModalShell open={open} onClose={onClose} title="Wisdom Lenses" subtitle="Practice mindsets to unlock new options.">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Equipped Lenses</h3>
          <div className="flex gap-4">
              <div className="flex-1 p-3 bg-slate-100 rounded-lg text-center">
                  <span className="text-xs text-slate-500">Slot 1</span>
                  <p className="font-bold">{wisdom.equipped[0] ? WISDOM_LENSES.find(l=>l.id === wisdom.equipped[0])?.name : 'Empty'}</p>
              </div>
              <div className="flex-1 p-3 bg-slate-100 rounded-lg text-center">
                  <span className="text-xs text-slate-500">Slot 2</span>
                  <p className="font-bold">{wisdom.equipped[1] ? WISDOM_LENSES.find(l=>l.id === wisdom.equipped[1])?.name : 'Empty'}</p>
              </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Lenses</h3>
          <div className="space-y-3">
            {WISDOM_LENSES.map(lens => (
              <LensCard
                key={lens.id}
                lens={lens}
                xp={wisdom.xp[lens.id] || 0}
                onEquip={handleEquip}
                isEquipped={wisdom.equipped.includes(lens.id)}
                isOtherSlotEquipped={isOtherSlotEquipped}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Practice</h3>
          <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => handlePractice('meditate')} disabled={!canPractice}>🧘 Meditate (10 minutes) - Focus 1</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handlePractice('compassion')} disabled={!canPractice}>💛 Compassion practice - Focus 1</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handlePractice('letgo')} disabled={!canPractice}>🌊 Let go - Focus 1</Button>
              {mindfulnessTier >= 2 && (
                 <Button variant="destructive" className="w-full justify-start" onClick={handleVipassana} disabled={!canPractice}>🏕️ Vipassana Retreat (weekend) - Focus 2, $250</Button>
              )}
          </div>
        </div>
      </div>
    </GameModalShell>
  );
}