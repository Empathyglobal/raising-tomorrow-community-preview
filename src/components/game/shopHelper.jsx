import { SHOP_CATALOG } from '@/components/game/shopCatalog';

export const getAffordableUnlocks = (money, ownedItems = {}) => {
  if (!SHOP_CATALOG) return [];
  const allItems = Object.values(SHOP_CATALOG).flat();
  return allItems.filter(item => 
    !ownedItems[item.id] && 
    item.cost <= money &&
    (!item.cond || item.cond(ownedItems))
  );
};