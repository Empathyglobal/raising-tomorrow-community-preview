import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney, localizeAmount, PRICING, getCountryScale, hasMinorChild } from '@/components/game/GameStateContext';
import { getInventoryItems, getOwnedItemByUniqueGroup, SHOP_ITEM_BY_ID, hasShopItem } from './shopCatalog';
import { getHomeMarketValueBase, getHomeYearsOwned } from './homeEconomy';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/game/ConfirmProvider';

export default function HomeStuffModal({ open, onClose, onOpenHousing }) {
  const { gameState, applyMoneyDelta, applyDeltas, updateState, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const confirm = useConfirm();
  const { currentYear, countryIso3 } = gameState;
  const scale = getCountryScale(countryIso3 || "USA");

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

  const items = getInventoryItems(gameState);
  
  // Major assets
  const primaryHome = getOwnedItemByUniqueGroup(gameState, 'home');
  const car = getOwnedItemByUniqueGroup(gameState, 'car');
  const motorcycle = getOwnedItemByUniqueGroup(gameState, 'motorcycle');
  
  // Key gear
  const keyGear = [
    hasShopItem(gameState, 'taekwondoUniform') ? { id: 'taekwondoUniform', name: 'Taekwondo Uniform', emoji: '🥋', benefit: 'Saves $100/year on Taekwondo fees' } : null,
    hasShopItem(gameState, 'musicStand') ? { id: 'musicStand', name: 'Music Stand', emoji: '📜', benefit: 'Supports music practice' } : null,
    hasShopItem(gameState, 'artApron') ? { id: 'artApron', name: 'Art Apron', emoji: '🎨', benefit: 'Tiny stress reduction on art activities' } : null
  ].filter(Boolean);
  
  // Key instruments
  const keyInstruments = [
    hasShopItem(gameState, 'piano') ? { id: 'piano', name: 'Piano', emoji: '🎹' } : null,
    hasShopItem(gameState, 'guitar') ? { id: 'guitar', name: 'Guitar', emoji: '🎸' } : null,
    hasShopItem(gameState, 'ukulele') ? { id: 'ukulele', name: 'Ukulele', emoji: '🎶' } : null,
    hasShopItem(gameState, 'violin') ? { id: 'violin', name: 'Violin', emoji: '🎻' } : null,
    hasShopItem(gameState, 'drumPad') ? { id: 'drumPad', name: 'Drum Pad', emoji: '🥁' } : null
  ].filter(Boolean);

  const hasAnyMajorAssets = primaryHome || car || motorcycle || keyGear.length > 0 || keyInstruments.length > 0;

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
      description:
        mode === 'donate'
          ? "This will permanently remove it from your stuff."
          : "This will permanently remove it from your stuff.",
      confirmText: mode === 'donate' ? 'Donate' : 'Throw away',
      cancelText: 'Cancel',
      destructive: true
    });

    if (!ok) return;

    let donationBonusGranted = false;

    if (mode === 'donate') {
      const minorChildPresent = hasMinorChild(gameState);
      const already = Number(gameState.donationBonusAge) === Number(gameState.currentYear);

      if (minorChildPresent && !already) {
        // 0.1 empathy once per year
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

  const handleSellHome = () => {
    if (!primaryHome) return;
    
    const marketBase = getHomeMarketValueBase(primaryHome, currentYear);
    const saleLocal = localizeAmount(marketBase, scale, PRICING.LOCAL);
    const yearsOwned = getHomeYearsOwned(primaryHome, currentYear);
    
    // Remove from inventory
    updateState(prev => ({
      inventory: {
        ...prev.inventory,
        items: prev.inventory.items.filter(i => i.id !== primaryHome.id)
      }
    }));
    
    // Give money
    applyMoneyDelta(saleLocal, "Sold Home");
    
    // Log
    addLog(`🏠 Sold Home for $${formatMoney(saleLocal)} after ${yearsOwned} years.`);
    recordTimelineEntry({
      kind: 'financial',
      title: 'Sold Home',
      detail: `Sold ${primaryHome.name} for $${formatMoney(saleLocal)} (Market Value). Owned for ${yearsOwned} years.`,
      moneyDelta: saleLocal,
      age: currentYear
    });
  };

  const AssetCard = ({ emoji, name, benefit, ongoing, sellable, onSell, marketValueBase, yearsOwned }) => (
    <div className="p-4 rounded-xl border-2 border-slate-200 bg-white">
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-base mb-1">{name}</div>
          {benefit && (
            <div className="text-xs text-slate-600 mb-1">• {benefit}</div>
          )}
          {ongoing && (
            <div className="text-xs text-emerald-700 font-medium mb-1">
              Ongoing: {ongoing}
            </div>
          )}
          {sellable && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-slate-500">
                  <div>Owned: {yearsOwned} yr{yearsOwned !== 1 ? 's' : ''}</div>
                  <div>Value: <span className="font-medium text-emerald-600">${formatMoney(localizeAmount(marketValueBase || 0, scale, PRICING.LOCAL))}</span></div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onSell}
                  className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Sell
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">🎒 Home & Stuff</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {!hasAnyMajorAssets ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-slate-600">No major assets yet.</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Visit <strong>Life → Shopping</strong> to buy vehicles, homes, and gear.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Primary Home */}
                    {primaryHome && (() => {
                      const def = SHOP_ITEM_BY_ID[primaryHome.id];
                      const ongoing = def?.passivePerAge 
                        ? `${def.passivePerAge.moneyDelta ? `$${def.passivePerAge.moneyDelta}/year` : ''} ${def.passivePerAge.stressDelta ? `Stress ${def.passivePerAge.stressDelta}/year` : ''}`.trim()
                        : null;
                      
                      const marketBase = getHomeMarketValueBase(primaryHome, currentYear);
                      const yearsOwned = getHomeYearsOwned(primaryHome, currentYear);
                      
                      return (
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Primary Home
                          </h4>
                          <div className="p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50/30">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl flex-shrink-0">{primaryHome.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-800 text-base mb-1">{primaryHome.name}</div>
                                <div className="text-xs text-slate-600 mb-1">• Provides comfort and stability</div>
                                {ongoing && (
                                  <div className="text-xs text-emerald-700 font-medium mb-1">
                                    Ongoing: {ongoing}
                                  </div>
                                )}
                                
                                <div className="mt-3 pt-3 border-t border-emerald-100/50">
                                  <div className="flex justify-between items-center">
                                    <div className="text-xs text-slate-500">
                                      <div>Owned: {yearsOwned} yr{yearsOwned !== 1 ? 's' : ''}</div>
                                      <div>Value: <span className="font-bold text-emerald-700">${formatMoney(localizeAmount(marketBase, scale, PRICING.LOCAL))}</span></div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      onClick={handleSellHome}
                                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                      Sell Home
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Vehicles */}
                    {(car || motorcycle) && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Vehicles
                        </h4>
                        <div className="space-y-2">
                          {car && (() => {
                            const def = SHOP_ITEM_BY_ID[car.id];
                            const ongoing = def?.passivePerAge 
                              ? `${def.passivePerAge.moneyDelta ? `$${def.passivePerAge.moneyDelta}/year` : ''} ${def.passivePerAge.stressDelta ? `Stress ${def.passivePerAge.stressDelta}/year` : ''}`.trim()
                              : null;
                            return (
                              <AssetCard
                                emoji={car.emoji}
                                name={car.name}
                                benefit="Freedom, logistics, stress relief"
                                ongoing={ongoing}
                              />
                            );
                          })()}
                          {motorcycle && (() => {
                            const def = SHOP_ITEM_BY_ID[motorcycle.id];
                            const ongoing = def?.passivePerAge 
                              ? `${def.passivePerAge.moneyDelta ? `$${def.passivePerAge.moneyDelta}/year` : ''} ${def.passivePerAge.stressDelta ? `Stress ${def.passivePerAge.stressDelta}/year` : ''}`.trim()
                              : null;
                            return (
                              <AssetCard
                                emoji={motorcycle.emoji}
                                name={motorcycle.name}
                                benefit="Impractical thrill, small stress relief"
                                ongoing={ongoing}
                              />
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Gear */}
                    {keyGear.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Key Gear
                        </h4>
                        <div className="space-y-2">
                          {keyGear.map(g => (
                            <AssetCard
                              key={g.id}
                              emoji={g.emoji}
                              name={g.name}
                              benefit={g.benefit}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Instruments */}
                    {keyInstruments.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Instruments
                        </h4>
                        <div className="space-y-2">
                          {keyInstruments.map(inst => (
                            <AssetCard
                              key={inst.id}
                              emoji={inst.emoji}
                              name={inst.name}
                              benefit="Unlocks play options and music class bonuses"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Inventory Items */}
                    {items.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          All Items
                        </h4>
                        <div className="grid gap-3 md:grid-cols-2">
                          {items.map((itemInstance, itemIndex) => {
                            const itemDef = SHOP_ITEM_BY_ID[itemInstance.id];
                            if (!itemDef) return null;

                            const isStored = itemInstance?.stored === true;

                            return (
                              <div
                                key={`${itemInstance.id}-${itemIndex}`}
                                className="p-3 rounded-xl border-2 border-slate-200 bg-white"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <span className="text-xl flex-shrink-0">{itemDef.emoji}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-slate-800 text-sm truncate mb-0.5 flex items-center gap-2">
                                      {itemDef.name}
                                      {isStored && (
                                        <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full whitespace-nowrap">
                                          📦 In Storage
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {itemDef.description}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-1.5 mt-2">
                                  <button
                                    onClick={() => toggleStorage(itemIndex)}
                                    className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                  >
                                    {isStored ? '📦 Take Out' : '📦 Store'}
                                  </button>
                                  <button
                                    onClick={() => removeItem(itemIndex, 'donate')}
                                    className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                  >
                                    🎁 Donate
                                  </button>
                                  <button
                                    onClick={() => removeItem(itemIndex, 'trash')}
                                    className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                  >
                                    🗑️ Trash
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Real Estate Properties */}
                    {(() => {
                      const properties = gameState?.realEstate?.properties || [];
                      const primaryId = gameState?.realEstate?.primaryResidencePropertyId;
                      
                      if (properties.length === 0) return null;
                      
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              Properties
                            </h4>
                            {onOpenHousing && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenHousing();
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                              >
                                Manage →
                              </button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {properties.map(prop => {
                              const isPrimary = prop.id === primaryId;
                              const value = Number(prop.currentValue ?? prop.purchasePrice) || 0;
                              const rent = Number(prop.rentPerYear) || 0;
                              const status = isPrimary ? 'Primary Home' : prop.renting ? 'Rented' : 'Not rented';
                              
                              return (
                                <div key={prop.id} className={`p-3 rounded-xl border-2 ${
                                  isPrimary ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200 bg-white'
                                }`}>
                                  <div className="flex items-start gap-2">
                                    <span className="text-xl flex-shrink-0">{prop.emoji || '🏠'}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                        {prop.name}
                                        {isPrimary && (
                                          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">
                                            🏡 Living here
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 mt-1">
                                        {status} • Value: ${formatMoney(value)} • Rent: ${formatMoney(rent)}/yr
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Footer hint */}
                    <div className="mt-6 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                      💡 Go to <strong>Life → Shopping</strong> to buy more items.
                    </div>
                    </div>
                    )}
                    </div>
                    </div>
                    </motion.div>
                    </>
                    )}
                    </AnimatePresence>
                    );
                    }