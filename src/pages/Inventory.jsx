import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext";
import { getInventoryItems } from '../components/game/shopCatalog';
import { DEFAULT_LIVING_SETUP, getOwnedCarItem, getOwnedHomeItem, getOwnedMotorcycleItem, resolveCommuteForState, resolveHousingForState } from '@/components/game/livingConfig';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const CATEGORY_ICONS = {
  vehicle: '🚗',
  property: '🏠',
  toy: '🧸',
  instrument: '🎵',
  gear: '🥋',
  jewelry: '💍',
  tech: '💻',
  other: '🧰'
};

export default function Inventory() {
   const navigate = useNavigate();
   const { gameState, updateState } = useGameState();

   const inventoryItems = getInventoryItems(gameState);
   const ownedHome = getOwnedHomeItem(gameState);
   const ownedCar = getOwnedCarItem(gameState);
   const ownedMotorcycle = getOwnedMotorcycleItem(gameState);

   const currentSetup = gameState.livingSetup || DEFAULT_LIVING_SETUP;
   const currentHousing = resolveHousingForState(gameState, currentSetup.housingId || DEFAULT_LIVING_SETUP.housingId);
   const currentCommute = resolveCommuteForState(gameState, currentSetup.commuteId || DEFAULT_LIVING_SETUP.commuteId);

  // Sort by age (newest first)
  const sortedItems = [...inventoryItems].sort((a, b) => (b.purchasedAge || 0) - (a.purchasedAge || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl('Game'))}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">🎒 Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">Items owned: {inventoryItems.length}</p>
          </div>
        </div>

        {/* Home + Car quick actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">🏠 Housing & 🚗 Transportation</h2>
              <p className="text-xs text-slate-600 mt-1">
                If you bought a home or car, you can stop renting and use your owned assets here.
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Current: {currentHousing?.emoji} {currentHousing?.label} • {currentCommute?.emoji} {currentCommute?.label}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={!ownedHome}
              onClick={() => {
                if (!ownedHome) return;
                updateState(prev => ({
                  ...prev,
                  livingSetup: {
                    ...(prev.livingSetup || DEFAULT_LIVING_SETUP),
                    housingId: 'owned_home'
                  }
                }));
                toast.success('Now using your owned home.');
              }}
              className="justify-start"
            >
              {ownedHome ? `Use Home: ${ownedHome?.name || 'Owned'}` : 'Use your owned home (locked)'}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={!ownedCar && !ownedMotorcycle}
              onClick={() => {
                if (ownedCar) {
                  updateState(prev => ({
                    ...prev,
                    livingSetup: {
                      ...(prev.livingSetup || DEFAULT_LIVING_SETUP),
                      commuteId: 'car'
                    }
                  }));
                  toast.success('Now using your owned car.');
                  return;
                }
                if (ownedMotorcycle) {
                  updateState(prev => ({
                    ...prev,
                    livingSetup: {
                      ...(prev.livingSetup || DEFAULT_LIVING_SETUP),
                      commuteId: 'motorcycle'
                    }
                  }));
                  toast.success('Now using your motorcycle.');
                }
              }}
              className="justify-start"
            >
              {ownedCar
                ? `Use Car: ${ownedCar?.name || 'Owned'}`
                : ownedMotorcycle
                  ? `Use Motorcycle: ${ownedMotorcycle?.name || 'Owned'}`
                  : 'Use your owned car (locked)'}
            </Button>
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Tip: You can also manage this in <span className="font-semibold">Actions (⚡) → Quality of Life</span>.
          </p>
        </div>

        {/* Items List */}
        {sortedItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-200">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-slate-600 text-lg">No items yet.</p>
            <p className="text-slate-500 text-sm mt-2">Visit the Shop in the Life menu to buy items!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">
                    {item.emoji || CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Bought at age {item.purchasedAge ?? '?'} 
                      {item.cost ? ` • $${item.cost.toLocaleString()}` : ''}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded capitalize">
                        {CATEGORY_ICONS[item.category] || ''} {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}