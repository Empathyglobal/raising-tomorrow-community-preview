import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney, localizeAmount, PRICING, getCountryScale, hasMinorChild } from '@/components/game/GameStateContext';
import { SHOP_CATEGORIES, SHOP_ITEMS, SHOP_ITEM_BY_ID, getInventoryItems, hasShopItem, getOwnedItemByUniqueGroup, isShopItemAvailable, getUseSpecForItem } from './shopCatalog';
import { getHomeMarketValueBase } from './homeEconomy';
import { audioManager } from './AudioManager';
import { useConfirm } from '@/components/game/ConfirmProvider';
import { toast } from 'sonner';

export default function ShopModal({ open, onClose, initialView, filterMode, onOpenRoomDecor = null }) {
  const { gameState, applyMoneyDelta, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry, updateState, emitActionResult, spendFocus, applyFameDelta } = useGameState();
  const confirm = useConfirm();
  const scale = getCountryScale(gameState.countryIso3 || "USA");
  const { currentYear, toyBonusAge, specialStartId } = gameState;
  
  const minorChildPresent = hasMinorChild(gameState);
  
  // Determine visible categories and default for special starts
  const isReliefMode = specialStartId === 'war_zone' || specialStartId === 'refugee_camp';
  const isApocalypseMode = specialStartId === 'zombie_apocalypse' || specialStartId === 'alien_invasion' || specialStartId === 'apocalypse_bunker_stream';
  const isKimMode = specialStartId === 'kim_jong_un';
  
  const visibleCategories = React.useMemo(() => {
    if (isReliefMode) {
      return SHOP_CATEGORIES.filter(cat => ['toy', 'book', 'gear'].includes(cat.id));
    }
    if (isApocalypseMode) {
      return SHOP_CATEGORIES.filter(cat => ['defense', 'gear', 'food', 'electronics', 'book'].includes(cat.id));
    }
    if (isKimMode) {
      return SHOP_CATEGORIES.filter(cat => !['nightlife', 'absurd'].includes(cat.id));
    }
    return SHOP_CATEGORIES;
  }, [isReliefMode, isApocalypseMode, isKimMode]);
  
  const defaultCategory = isApocalypseMode ? 'defense' : isReliefMode ? 'toy' : isKimMode ? 'luxury' : 'vehicle';
  const [activeCategory, setActiveCategory] = React.useState(defaultCategory);
  const [shopView, setShopView] = React.useState('shop');
  
  // Apply initialView and filterMode when modal opens
  React.useEffect(() => {
    if (!open) return;
    
    // Set view first
    if (initialView === 'stuff') {
      setShopView('stuff');
      return;
    }
    
    setShopView('shop');
    
    // Then apply filter mode to category
    if (filterMode === 'vehicles') {
      setActiveCategory('vehicle');
    } else if (filterMode === 'mall') {
      // Set to first non-vehicle category
      const firstNonVehicle = visibleCategories.find(c => c.id !== 'vehicle');
      setActiveCategory(firstNonVehicle?.id || 'toy');
    }
  }, [open, initialView, filterMode, visibleCategories]);
  
  // Ensure activeCategory is valid for special start modes
  React.useEffect(() => {
    if (!visibleCategories.find(c => c.id === activeCategory)) {
      setActiveCategory(defaultCategory);
    }
  }, [visibleCategories, activeCategory, defaultCategory]);
  
  // Apply filter mode if provided
  const filteredCategoriesForShop = React.useMemo(() => {
    if (shopView !== 'shop' || !filterMode) return visibleCategories;
    
    if (filterMode === 'vehicles') {
      return visibleCategories.filter(c => c.id === 'vehicle');
    }
    if (filterMode === 'mall') {
      // Mall excludes homes (gear category has homes) AND vehicles
      return visibleCategories.filter(c => c.id !== 'vehicle');
    }
    return visibleCategories;
  }, [visibleCategories, shopView, filterMode]);

  // Block body scroll when modal is open
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

  const handlePurchase = (item) => {
    const owned = hasShopItem(gameState, item.id);
    
    // Check requiresOwnedItemIds
    if (item.requiresOwnedItemIds && Array.isArray(item.requiresOwnedItemIds)) {
      const missing = item.requiresOwnedItemIds.filter(reqId => !hasShopItem(gameState, reqId));
      if (missing.length > 0) {
        const names = missing.map(id => SHOP_ITEM_BY_ID[id]?.name || id).join(', ');
        toast.error(`You need: ${names}`);
        return;
      }
    }
    
    // Check requiresOwnedUniqueGroup
    if (item.requiresOwnedUniqueGroup) {
      const owned = getOwnedItemByUniqueGroup(gameState, item.requiresOwnedUniqueGroup);
      if (!owned) {
        toast.error(item.requiresOwnedUniqueGroup === 'home'
          ? 'You need to own a home property first.'
          : `You need an owned item in group: ${item.requiresOwnedUniqueGroup}`
        );
        return;
      }
    }
    
    audioManager.playSfx('success');
    
    // If unique group, handle trade-in
    let tradeInValue = 0;
    if (item.uniqueGroup) {
      const existing = getOwnedItemByUniqueGroup(gameState, item.uniqueGroup);
      if (existing) {
        // Special logic for homes: use appreciated market value
        if (item.uniqueGroup === 'home') {
          const marketBase = getHomeMarketValueBase(existing, currentYear);
          // Trade-in is fully localized appreciated value (since purchase price is also local)
          // Actually, prices in Shop are BASE. So we need Local Trade In vs Local Cost.
          // Wait, shop items cost is localized at render time? 
          // Checking ShopModal render: `${formatMoney(item.cost)}` -> formatMoney just formats.
          // Shop prices are usually BASE in catalog, but should be localized in UI.
          // The prompt for Prompt 1 says: "update all displayed prices...".
          // If I haven't updated ShopModal to localize prices, I should do that too.
          // But focusing on trade-in: 
          // getHomeMarketValueBase returns BASE.
          // We need local trade-in value to subtract from local cost.
          // Let's assume we work in LOCAL currency for the transaction.
          
          // However, if Shop logic currently uses `item.cost` directly, it might be using BASE cost as LOCAL cost (if scale=1).
          // If Prompt 1 was applied, prices should be localized.
          // I see `applyMoneyDelta(-finalCost)`. 
          // If `item.cost` is 150000 (Starter Home) and I am in a 0.5 scale country, cost should be 75000.
          
          // Let's fix the cost to be localized first.
          
          const marketBaseValue = getHomeMarketValueBase(existing, currentYear);
          // Trade-in value is the full market value (you sell it to buy new one)
          const localMarketValue = localizeAmount(marketBaseValue, scale, PRICING.LOCAL);
          tradeInValue = localMarketValue;
        } else {
          // Standard trade-in logic
          const existingDef = SHOP_ITEM_BY_ID[existing.id];
          if (existingDef) {
            // localize the base cost first, then apply rate? 
            // Or rate on base then localize? Same result.
            const baseCost = existingDef.cost;
            const localCost = localizeAmount(baseCost, scale, PRICING.LOCAL);
            tradeInValue = Math.round(localCost * (existingDef.tradeInRate || 0));
          }
        }
        
        // Remove existing item from inventory
        updateState(prev => {
          const items = getInventoryItems(prev);
          return {
            inventory: {
              ...prev.inventory,
              items: items.filter(it => it.id !== existing.id)
            }
          };
        });
      }
    }
    
    // Apply costs (localize item cost first)
    const itemPricing = item.pricing || PRICING.LOCAL;
    const localItemCost = localizeAmount(item.cost, scale, itemPricing);
    const finalCost = localItemCost - tradeInValue;
    applyMoneyDelta(-finalCost, `Purchase: ${item.name}`);
    
    // Apply immediate effects (with child-benefit gating)
    let childBenefitsSkipped = false;
    if (item.immediate) {
      // Check if benefits require minor child
      if (item.benefitsRequireMinorChild && !minorChildPresent) {
        childBenefitsSkipped = true;
        // Still apply stress changes (parent benefit)
        if (item.immediate.stressDelta) {
          applyStress(item.immediate.stressDelta, item.name);
        }
      } else {
        // Apply normally
        if (item.immediate.deltas) {
          applyDeltas(item.immediate.deltas, `Purchase: ${item.name}`);
        }
        if (item.immediate.loveDelta) {
          applyLove(item.immediate.loveDelta, item.name);
        }
        if (item.immediate.stressDelta) {
          applyStress(item.immediate.stressDelta, item.name);
        }
      }
      
      // Fame delta (independent of child benefits)
      if (item.immediate.fameDelta) {
        applyFameDelta(item.immediate.fameDelta, `Purchase: ${item.name}`);
      }
      
      // Partner meter delta (if applicable)
      if (item.immediate.partnerMeterDelta && gameState.householdType === 'two') {
        updateState(prev => ({
          partnerMeter: Math.max(0, Math.min(100, (prev.partnerMeter || 50) + item.immediate.partnerMeterDelta))
        }));
      }
    }
    
    // Toy bonus rule: first toy per age gives a tiny bonus
    let toyBonusGranted = false;
    if (item.category === 'toy' && toyBonusAge !== currentYear) {
      applyDeltas({ confidence: 0.2, empathy: 0, discipline: 0, intelligence: 0 }, 'First toy bonus');
      applyLove(0.2, 'First toy bonus');
      applyStress(-0.1, 'First toy bonus');
      updateState({ toyBonusAge: currentYear });
      toyBonusGranted = true;
    }
    
    // Add to inventory
    updateState(prev => {
      const items = getInventoryItems(prev);
      return {
        inventory: {
          ...prev.inventory,
          items: [...items, {
            id: item.id,
            name: item.name,
            category: item.category,
            emoji: item.emoji,
            purchasedAge: currentYear,
            cost: item.cost, // Store BASE cost for appreciation calc
            uniqueGroup: item.uniqueGroup || null,
            stored: false
          }]
        }
      };
    });
    
    // Build result message
    let bodyParts = [`You bought **${item.name}** for $${formatMoney(localItemCost)}.`];
    
    if (tradeInValue > 0) {
      bodyParts.push(`Trade-in: +$${formatMoney(tradeInValue)}.`);
      bodyParts.push(`Net cost: $${formatMoney(finalCost)}.`);
    }
    
    if (item.immediate?.stressDelta) {
      bodyParts.push(`Stress ${item.immediate.stressDelta > 0 ? '+' : ''}${item.immediate.stressDelta}.`);
    }
    if (item.immediate?.loveDelta) {
      bodyParts.push(`Love ${item.immediate.loveDelta > 0 ? '+' : ''}${item.immediate.loveDelta}.`);
    }
    if (item.immediate?.fameDelta) {
      bodyParts.push(`Fame +${item.immediate.fameDelta}.`);
    }
    if (item.passivePerAge) {
      const parts = [];
      if (item.passivePerAge.moneyDelta) {
        parts.push(`$${item.passivePerAge.moneyDelta}/year`);
      }
      if (item.passivePerAge.stressDelta) {
        parts.push(`Stress ${item.passivePerAge.stressDelta > 0 ? '+' : ''}${item.passivePerAge.stressDelta}/year`);
      }
      if (parts.length) {
        bodyParts.push(`\nOngoing: ${parts.join(' • ')}`);
      }
    }
    if (item.modifiers?.taekwondoDiscount) {
      bodyParts.push(`\nSaves $${item.modifiers.taekwondoDiscount}/year on Taekwondo.`);
    }
    if (toyBonusGranted) {
      bodyParts.push(`\n✨ First toy this year: CON +0.2 • LOVE +0.2 • STRESS -0.1`);
    } else if (item.category === 'toy' && !toyBonusGranted) {
      bodyParts.push(`\n(No extra child bonus — already got one toy this age.)`);
    }
    
    if (childBenefitsSkipped) {
      bodyParts.push(`\n(No child-related benefit applied.)`);
    }
    
    const body = bodyParts.join(' ');
    
    emitActionResult({
      actionId: 'shopping',
      title: `Bought ${item.name}`,
      body,
      deltas: item.immediate?.deltas || {},
      loveDelta: (item.immediate?.loveDelta || 0) + (toyBonusGranted ? 0.2 : 0),
      stressDelta: (item.immediate?.stressDelta || 0) + (toyBonusGranted ? -0.1 : 0),
      moneyDelta: -finalCost,
      focusDelta: 0,
      tags: ['shopping', 'purchase'],
      meta: { emoji: item.emoji, itemId: item.id }
    });
    
    onClose();
  };

  const toggleStorage = async (itemIndex) => {
    updateState(prev => {
      const items = (prev.inventory?.items || []).map((it, idx) => {
        if (idx !== itemIndex) return it;
        return { ...it, stored: !(it?.stored === true) };
      });
      return { ...prev, inventory: { ...prev.inventory, items } };
    });
  };

  const removeItem = async (itemIndex, mode) => {
    const inv = getInventoryItems(gameState);
    const item = inv[itemIndex];
    if (!item) return;

    const def = SHOP_ITEM_BY_ID[item.id];
    const itemName = def?.name || item.name || 'item';

    const ok = await confirm({
      title: mode === 'donate' ? `Donate ${itemName}?` : `Throw away ${itemName}?`,
      description: "This will permanently remove it from your stuff.",
      confirmText: mode === 'donate' ? 'Donate' : 'Throw away',
      cancelText: 'Cancel',
      destructive: true
    });

    if (!ok) return;

    let donationBonusGranted = false;

    if (mode === 'donate') {
      const already = Number(gameState.donationBonusAge) === Number(gameState.currentYear);
      if (minorChildPresent && !already) {
        applyDeltas({ empathy: 0.1 }, 'Donation');
        updateState({ donationBonusAge: gameState.currentYear });
        donationBonusGranted = true;
      }
    }

    updateState(prev => {
      const items = (prev.inventory?.items || []).filter((_, idx) => idx !== itemIndex);
      return { ...prev, inventory: { ...prev.inventory, items } };
    });

    emitActionResult({
      actionId: 'shopping',
      title: mode === 'donate' ? '🎁 Donated' : '🗑️ Thrown Away',
      body:
        mode === 'donate'
          ? `You donated **${itemName}**.${donationBonusGranted ? "\n\n✨ Your child learns generosity: Empathy +0.1 (once per year)." : ""}`
          : `You threw away **${itemName}**.`,
      deltas: donationBonusGranted ? { empathy: 0.1 } : {},
      stressDelta: 0,
      moneyDelta: 0,
      loveDelta: 0,
      focusDelta: 0,
      tags: ['inventory', mode],
      meta: { itemId: item?.id, skipTimelineRecord: true }
    });
  };

  const handleUseItem = (itemInstance, itemIndex) => {
    const itemDef = SHOP_ITEM_BY_ID[itemInstance.id];
    if (!itemDef) return;
    
    const spec = getUseSpecForItem(gameState, itemDef);
    if (!spec) return;
    
    // Check focus cost
    if (spec.focusCost > 0) {
      const success = spendFocus(spec.focusCost, spec.label);
      if (!success) return; // Toast already shown
    }
    
    // Apply effects
    if (spec.deltas) {
      applyDeltas(spec.deltas, spec.label);
    }
    if (spec.loveDelta) {
      applyLove(spec.loveDelta, spec.label);
    }
    if (spec.stressDelta) {
      applyStress(spec.stressDelta, spec.label);
    }
    if (spec.moneyDelta) {
      applyMoneyDelta(spec.moneyDelta, spec.label);
    }
    if (spec.fameDelta) {
      const applyFameDelta = (delta, reason) => {
        updateState(prev => ({
          famePoints: Math.max(0, Math.min(1000, (prev.famePoints || 0) + delta))
        }));
      };
      applyFameDelta(spec.fameDelta, spec.label);
    }
    
    // Relationship companion bumps
    let companionName = null;
    if (spec.partnerMeterDelta && gameState.householdType === 'two') {
      const partner = gameState.relationships?.byId?.partner;
      if (partner && !partner.isDeceased && partner.alive !== false) {
        companionName = partner.name || 'Partner';
        const delta = Number(spec.partnerMeterDelta);
        updateState(prev => {
          const newMeter = Math.max(0, Math.min(100, (prev.partnerMeter || 50) + delta));
          const rel = prev.relationships || { roster: [], byId: {} };
          const p = { ...(rel.byId.partner || {}), meter: newMeter };
          const newById = { ...rel.byId, partner: p };
          const newRoster = rel.roster.map(r => r.id === 'partner' ? p : r);
          return {
            partnerMeter: newMeter,
            relationships: { ...rel, byId: newById, roster: newRoster }
          };
        });
      }
    }
    
    if (spec.friendMeterDelta && !companionName) {
      const friend = gameState.relationships?.byId?.my_best_friend;
      if (friend && !friend.isDeceased && friend.alive !== false) {
        companionName = friend.name || 'Best Friend';
        const delta = Number(spec.friendMeterDelta);
        updateState(prev => {
          const rel = prev.relationships || { roster: [], byId: {} };
          const f = { ...(rel.byId.my_best_friend || {}), meter: Math.max(0, Math.min(100, (rel.byId.my_best_friend?.meter || 50) + delta)) };
          const newById = { ...rel.byId, my_best_friend: f };
          const newRoster = rel.roster.map(r => r.id === 'my_best_friend' ? f : r);
          return {
            relationships: { ...rel, byId: newById, roster: newRoster }
          };
        });
      }
    }
    
    // Scenario deltas
    if (spec.zombieTrainingDelta) {
      updateState(prev => ({
        zombieTraining: Math.max(0, Math.min(100, (prev.zombieTraining || 0) + spec.zombieTrainingDelta))
      }));
    }
    if (spec.alienThreatDelta) {
      updateState(prev => ({
        alienThreat: Math.max(0, (prev.alienThreat || 0) + spec.alienThreatDelta)
      }));
    }
    
    // Build body text (include companion if present)
    let body = spec.body || `You use ${itemDef.name}.`;
    if (companionName && (spec.partnerMeterDelta || spec.friendMeterDelta)) {
      body += `\n\n${companionName} joins you. Connection +${Math.abs(spec.partnerMeterDelta || spec.friendMeterDelta)}.`;
    }
    
    // Remove consumable from inventory after use
    if (itemDef.consumable && typeof itemIndex === 'number') {
      updateState(prev => {
        const items = (prev.inventory?.items || []).filter((_, idx) => idx !== itemIndex);
        return {
          inventory: {
            ...prev.inventory,
            items
          }
        };
      });
    }

    // Emit popup
    emitActionResult({
      actionId: 'shopping',
      title: spec.title || `${itemDef.emoji} ${itemDef.name}`,
      body,
      deltas: spec.deltas || {},
      stressDelta: spec.stressDelta || 0,
      moneyDelta: spec.moneyDelta || 0,
      loveDelta: spec.loveDelta || 0,
      focusDelta: -(spec.focusCost || 0),
      tags: ['inventory', 'shopping'],
      meta: { itemId: itemDef.id, skipTimelineRecord: Boolean(spec.skipTimeline) }
    });
  };

  // Show Kids Room Decor in mall view
  const showKidsRoomDecor = (filterMode === 'mall' || shopView === 'shop') && (hasMinorChild(gameState) || ((gameState.room?.items || []).length > 0));

  // Filter items by availability and relief mode
  let categoryItems = SHOP_ITEMS.filter(it => it.category === activeCategory && isShopItemAvailable(gameState, it));
  if ((isReliefMode || filterMode === 'mall') && activeCategory === 'gear') {
    categoryItems = categoryItems.filter(it => it.uniqueGroup !== 'home');
  }
  
  // Filter items that require other owned items
  categoryItems = categoryItems.filter(item => {
    if (!item.requiresOwnedItemIds || !Array.isArray(item.requiresOwnedItemIds)) return true;
    return item.requiresOwnedItemIds.every(reqId => hasShopItem(gameState, reqId));
  });
  
  // Filter items that require unique group ownership
  categoryItems = categoryItems.filter(item => {
    if (!item.requiresOwnedUniqueGroup) return true;
    return Boolean(getOwnedItemByUniqueGroup(gameState, item.requiresOwnedUniqueGroup));
  });

  // Sort vehicles by local displayed cost (cheap -> expensive)
  if (shopView === 'shop' && activeCategory === 'vehicle') {
    const getLocalCost = (it) => {
      const pricing = it.pricing || PRICING.LOCAL;
      return localizeAmount(it.cost, scale, pricing);
    };
    categoryItems = [...categoryItems].sort((a, b) => getLocalCost(a) - getLocalCost(b));
  }
  
  const ownedItems = getInventoryItems(gameState);
  
  // Determine which categories to show based on filter mode
  const categoriesToDisplay = shopView === 'shop' ? filteredCategoriesForShop : visibleCategories;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl lg:max-w-4xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">
                  {specialStartId === 'war_zone' ? '🧺 Relief & Supplies' : 
                   specialStartId === 'refugee_camp' ? '📦 Aid & Supplies' : 
                   '🛍️ Shopping Center'}
                </h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* View Toggle */}
              <div className="px-6 lg:px-8 py-3 border-b border-slate-200 flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShopView('shop')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      shopView === 'shop'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🛍️ Shop
                  </button>
                  <button
                    onClick={() => setShopView('stuff')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      shopView === 'stuff'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🎒 My Stuff
                  </button>
                </div>
              </div>

              {/* Category Tabs (only when in Shop view) */}
              {shopView === 'shop' && (
                <div className="px-6 lg:px-8 py-3 border-b border-slate-200 overflow-x-auto no-scrollbar flex-shrink-0">
                  <div className="flex gap-2">
                    {categoriesToDisplay.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                          activeCategory === cat.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.emoji} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Items List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-4 lg:py-6 pb-8">
                {shopView === 'shop' && filterMode === 'mall' && showKidsRoomDecor && (
                  <button
                    onClick={() => { onOpenRoomDecor?.(); onClose(); }}
                    className="w-full mb-4 p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🛏️</span>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">Kids Room Decor</div>
                        <div className="text-xs text-slate-500 mt-1">Posters, comfort, learning nooks, theme items</div>
                      </div>
                    </div>
                  </button>
                )}
                {shopView === 'shop' ? (
                  categoryItems.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p className="text-sm">No items in this category yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {categoryItems.map((item) => {
                      const owned = hasShopItem(gameState, item.id);
                      const ownedGroupItem = item.uniqueGroup ? getOwnedItemByUniqueGroup(gameState, item.uniqueGroup) : null;
                      const isUpgrade = ownedGroupItem && ownedGroupItem.id !== item.id;
                      
                      let tradeInValue = 0;
                      if (isUpgrade) {
                        if (ownedGroupItem.uniqueGroup === 'home') {
                          const marketBase = getHomeMarketValueBase(ownedGroupItem, currentYear);
                          tradeInValue = localizeAmount(marketBase, scale, PRICING.LOCAL);
                        } else {
                          const existingDef = SHOP_ITEM_BY_ID[ownedGroupItem.id];
                          if (existingDef) {
                            const localCost = localizeAmount(existingDef.cost, scale, PRICING.LOCAL);
                            tradeInValue = Math.round(localCost * (existingDef.tradeInRate || 0));
                          }
                        }
                      }
                      
                      const itemPricing = item.pricing || PRICING.LOCAL;
                      const localItemCost = localizeAmount(item.cost, scale, itemPricing);
                      const finalCost = localItemCost - tradeInValue;
                      const canAfford = gameState.money >= finalCost;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handlePurchase(item)}
                          disabled={owned && !isUpgrade}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            owned && !isUpgrade
                              ? 'border-emerald-200 bg-emerald-50 cursor-default'
                              : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="font-semibold text-slate-800 text-sm truncate">
                                  {item.name}
                                </div>
                                {owned && !isUpgrade && (
                                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full flex-shrink-0">
                                    <Check className="w-3 h-3" />
                                    Owned
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-slate-600 leading-snug mb-1">
                                {item.description}
                              </div>
                              {item.lifespanYears != null && (
                                <div className="text-[10px] text-slate-500">
                                  Lifespan: {item.lifespanYears} years
                                </div>
                              )}
                              {item.lifespanYears === null && (
                                <div className="text-[10px] text-emerald-600 font-semibold">
                                  Permanent
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {isUpgrade ? (
                              <>
                                <div className={`px-2.5 py-1 ${canAfford ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-red-700 border border-red-100'} text-xs font-semibold rounded-full`}>
                                  Upgrade: ${formatMoney(finalCost)}
                                </div>
                                <div className="text-xs text-slate-500">
                                  (Trade-in: +${formatMoney(tradeInValue)})
                                </div>
                              </>
                            ) : owned ? null : (
                              <div className={`px-2.5 py-1 ${canAfford ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-red-700 border border-red-100'} text-xs font-semibold rounded-full`}>
                                ${formatMoney(localItemCost)}
                              </div>
                            )}
                            {!canAfford && !owned && (
                              <div className="text-[10px] text-red-600 font-medium">Debt</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  )
                ) : (
                  // My Stuff view
                  ownedItems.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p className="text-sm">You don't own anything yet.</p>
                      <p className="text-xs mt-2">Check out the Shop tab!</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {ownedItems.map((itemInstance, itemIndex) => {
                        const itemDef = SHOP_ITEM_BY_ID[itemInstance.id];
                        if (!itemDef) return null;
                        
                        const useSpec = getUseSpecForItem(gameState, itemDef);
                        const isStored = itemInstance?.stored === true;
                        const canUse = !isStored && useSpec && (useSpec.focusCost === 0 || gameState.actionPoints >= useSpec.focusCost);
                        
                        return (
                          <div
                            key={`${itemInstance.id}-${itemIndex}`}
                            className="p-4 rounded-xl border-2 border-slate-200 bg-white"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-2xl flex-shrink-0">{itemDef.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-800 text-sm truncate mb-0.5">
                                  {itemDef.name}
                                </div>
                                <div className="text-xs text-slate-600 leading-snug">
                                  {itemDef.description}
                                </div>
                                {itemDef.consumable && (
                                  <div className="text-[10px] text-amber-600 font-semibold mt-1">
                                    Consumable (Single Use)
                                  </div>
                                )}
                                {isStored && (
                                  <div className="text-[10px] text-slate-600 font-semibold mt-1">
                                    📦 In Storage
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {useSpec && (
                              <button
                                onClick={() => handleUseItem(itemInstance, itemIndex)}
                                disabled={!canUse}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  canUse
                                    ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                {isStored ? 'Stored (Take out to use)' : (useSpec.label || 'Use')}
                                {!isStored && useSpec.focusCost > 0 && ` (${useSpec.focusCost} Focus)`}
                              </button>
                            )}
                            
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => toggleStorage(itemIndex)}
                                className="flex-1 px-2 py-2 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50"
                              >
                                {isStored ? '📦 Unstore' : '📦 Store'}
                              </button>
                              <button
                                onClick={() => removeItem(itemIndex, 'donate')}
                                className="flex-1 px-2 py-2 rounded-lg text-xs font-semibold border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              >
                                🎁 Donate
                              </button>
                              <button
                                onClick={() => removeItem(itemIndex, 'trash')}
                                className="flex-1 px-2 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-700 hover:bg-red-50"
                              >
                                🗑️ Trash
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}