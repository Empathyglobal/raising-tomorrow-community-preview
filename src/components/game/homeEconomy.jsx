// Logic for home appreciation and market value
// Appreciation: 1% per year owned

/**
 * Calculate the appreciated market value of a home in BASE currency.
 * @param {object} homeItem - The inventory item object (must have .cost and .purchasedAge)
 * @param {number} currentAge - Current game age
 * @returns {number} Market value in BASE currency
 */
export const getHomeMarketValueBase = (homeItem, currentAge) => {
  if (!homeItem) return 0;
  
  const purchaseBase = homeItem.cost || 0;
  const purchasedAge = homeItem.purchasedAge !== undefined ? homeItem.purchasedAge : currentAge;
  const yearsOwned = Math.max(0, currentAge - purchasedAge);
  
  // 1% appreciation per year: value * (1.01 ^ years)
  const appreciationFactor = Math.pow(1.01, yearsOwned);
  const marketBase = purchaseBase * appreciationFactor;
  
  return marketBase;
};

/**
 * Get years owned for a home item
 * @param {object} homeItem 
 * @param {number} currentAge 
 * @returns {number}
 */
export const getHomeYearsOwned = (homeItem, currentAge) => {
  if (!homeItem) return 0;
  const purchasedAge = homeItem.purchasedAge !== undefined ? homeItem.purchasedAge : currentAge;
  return Math.max(0, currentAge - purchasedAge);
};