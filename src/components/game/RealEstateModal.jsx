import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfirm } from './ConfirmProvider';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';
import {
  DEFAULT_REAL_ESTATE_STATE,
  DEFAULT_MANAGER,
  DEFAULT_INSURANCE,
  DEFAULT_TENANT,
  DEFAULT_MORTGAGE_TERMS,
  SELLING_FEE_PCT,
  generateMarketListings,
  generateForeclosureAuctionListings,
  resolveForeclosurePurchaseOutcome,
  calcMortgagePayment,
  getRealEstateTemplate,
  computeConditionMultiplier,
  estimateAnnualCosts,
  INSURANCE_PLANS,
  getInsurancePlan,
  getTenantArchetype
} from './realEstateData';

const pct = (n) => `${Math.round((Number(n) || 0) * 100)}%`;
const MAX_PROPERTIES = 6;

export default function RealEstateModal({ open, onClose }) {
  const confirm = useConfirm();
  const { gameState, updateState, applyMoneyDelta, emitActionResult, getLocalAmount, addLog } = useGameState();
  const { money, currentYear, runSeed } = gameState;

  const realEstate = gameState.realEstate && typeof gameState.realEstate === 'object'
    ? gameState.realEstate
    : DEFAULT_REAL_ESTATE_STATE;

  const properties = Array.isArray(realEstate.properties) ? realEstate.properties : [];
  const primaryResidencePropertyId = realEstate.primaryResidencePropertyId || null;
  const purchasedByAge = realEstate.market?.purchasedListingIdsByAge || {};
  const purchasedThisAge = new Set(purchasedByAge?.[currentYear] || []);
  const purchasedAuctionByAge = realEstate.market?.purchasedAuctionIdsByAge || {};
  const auctionPurchasedThisAge = new Set(purchasedAuctionByAge?.[currentYear] || []);
  const hasBoughtAuctionThisAge = auctionPurchasedThisAge.size > 0;

  const [tab, setTab] = React.useState('market');

  const empireEnabled = !!gameState.expansions?.empireEstatesLandlordLegacy;
  const landlordLegacyOn = empireEnabled;
  const hasProperties = properties.length > 0;

  React.useEffect(() => {
    if (open) {
      // If disabled but owns properties, force portfolio tab
      if (!empireEnabled && hasProperties) {
        setTab('portfolio');
      } else {
        setTab('market');
      }
    }
  }, [open, empireEnabled, hasProperties]);

  useLockBodyScroll(open);

  const listings = React.useMemo(() => {
    return generateMarketListings({ age: currentYear, runSeed, count: 6 });
  }, [currentYear, runSeed]);

  const auctionListings = React.useMemo(() => {
    const generated = generateForeclosureAuctionListings({ age: currentYear, runSeed, count: 4 });
    
    // FTUE: prepend featured starter listing at age 0
    if (gameState.ftueTourId === 'ftue_doctor_house_v1' && currentYear === 0 && !gameState.ftueBoughtHouse) {
      const featured = {
        auctionId: 'ftue_starter_home',
        templateId: 'starter_condo',
        emoji: '🏠',
        label: 'Starter Condo (Tutorial Pick)',
        name: 'Starter Condo (Tutorial Pick)',
        neighborhood: 'Quiet Block',
        price: 85000,
        riskTag: 'Low Risk',
        exteriorHint: 'Fresh paint. Solid bones.',
        conditionBand: 'good'
      };
      return [featured, ...generated];
    }
    
    return generated;
  }, [currentYear, runSeed, gameState.ftueTourId, gameState.ftueBoughtHouse]);

  if (!empireEnabled && !hasProperties && open) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">🏙️ Empire Estates: Landlord Legacy</h3>
            <p className="text-sm text-slate-600 mb-4">
              This expansion is currently disabled. Enable it in Settings → Expansions.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const setRealEstateState = (next) => {
    updateState({
      realEstate: {
        ...DEFAULT_REAL_ESTATE_STATE,
        ...realEstate,
        ...next
      }
    });
  };

  const updateProperty = (propId, patch) => {
    const nextProps = properties.map(p => (p.id === propId ? { ...p, ...patch } : p));
    setRealEstateState({ properties: nextProps });
  };

  const removeProperty = (propId) => {
    const nextProps = properties.filter(p => p.id !== propId);
    setRealEstateState({ properties: nextProps });
  };

  const handleBuy = (listing, financing) => {
    const t = getRealEstateTemplate(listing.templateId);
    const now = Date.now();
    const propId = `prop_${currentYear}_${listing.templateId}_${now}`;

    if (properties.length >= MAX_PROPERTIES) {
      emitActionResult({
        actionId: 'realEstate',
        title: 'Property limit reached',
        body: `You can own up to ${MAX_PROPERTIES} properties at a time.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['finance'],
        meta: { emoji: '🏚️' }
      });
      return;
    }

    const basePrice = Number(listing.price) || 0;
    const price = getLocalAmount(basePrice);

    // Financing
    const useMortgage = financing === 'mortgage';
    const downPayment = useMortgage ? Math.round(price * DEFAULT_MORTGAGE_TERMS.downPaymentPct) : price;
    const principal = useMortgage ? Math.max(0, price - downPayment) : 0;

    // Debt Allowed
    // if (downPayment > money) { ... }

    const mortgagePayment = useMortgage
      ? calcMortgagePayment(principal, DEFAULT_MORTGAGE_TERMS.annualRate, DEFAULT_MORTGAGE_TERMS.termYears)
      : 0;

    const newProperty = {
      id: propId,
      templateId: listing.templateId,
      name: listing.name,
      emoji: listing.emoji,
      purchasedAge: currentYear,
      purchasePrice: price,
      currentValue: price,
      condition: Number(listing.condition) || 75,
      rentPerYear: Number(listing.estRent) || (t?.baseRent || 0),
      renting: false,
      manager: { ...DEFAULT_MANAGER },
      insurance: { ...DEFAULT_INSURANCE },
      tenant: { ...DEFAULT_TENANT },
      renovation: { level: 0, totalSpent: 0 },
      mortgage: useMortgage ? {
        active: true,
        balance: principal,
        annualRate: DEFAULT_MORTGAGE_TERMS.annualRate,
        paymentPerYear: mortgagePayment,
        yearsRemaining: DEFAULT_MORTGAGE_TERMS.termYears
      } : {
        active: false,
        balance: 0,
        annualRate: DEFAULT_MORTGAGE_TERMS.annualRate,
        paymentPerYear: 0,
        yearsRemaining: 0
      }
    };

    // Pay now
    applyMoneyDelta(-downPayment, 'Real Estate Purchase');

    // Store (single state update to avoid stale merges)
    const nextPurchasedByAge = { ...(purchasedByAge || {}) };
    const existingPurchased = Array.isArray(nextPurchasedByAge[currentYear]) ? nextPurchasedByAge[currentYear] : [];
    if (!existingPurchased.includes(listing.listingId)) {
      nextPurchasedByAge[currentYear] = [...existingPurchased, listing.listingId];
    }

    updateState({
      realEstate: {
        ...DEFAULT_REAL_ESTATE_STATE,
        ...realEstate,
        properties: [...properties, newProperty],
        market: {
          ...(realEstate.market || {}),
          purchasedListingIdsByAge: nextPurchasedByAge
        }
      }
    });

    // Result
    const bodyLines = [
      `You bought **${listing.name}** in the ${listing.neighborhood}.`,
      '',
      useMortgage
        ? `Down payment: $${formatMoney(downPayment)} • Mortgage: $${formatMoney(mortgagePayment)}/year for ${DEFAULT_MORTGAGE_TERMS.termYears} years at ${pct(DEFAULT_MORTGAGE_TERMS.annualRate)} (balance: $${formatMoney(principal)}).`
        : `You paid $${formatMoney(price)} in cash.`,
      '',
      `Estimated rent: $${formatMoney(newProperty.rentPerYear)}/year (when rented).`
    ];

    emitActionResult({
      actionId: 'realEstate',
      title: `Bought: ${listing.name}`,
      body: bodyLines.join('\n'),
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -downPayment,
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: '🏠', propertyId: propId }
    });
  };

  const handleToggleRent = (prop) => {
    if (!empireEnabled) return;
    
    // Prevent renting primary residence
    if (prop.id === primaryResidencePropertyId) {
      emitActionResult({
        actionId: 'realEstate',
        title: 'Cannot rent primary residence',
        body: 'You cannot rent out a property you are living in. Move out first if you want to rent it.',
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['finance'],
        meta: { emoji: '🚫' }
      });
      return;
    }
    
    const nextRenting = !prop.renting;

    const nextTenant = { ...DEFAULT_TENANT };

    updateProperty(prop.id, {
      renting: nextRenting,
      tenant: nextTenant
    });

    emitActionResult({
      actionId: 'realEstate',
      title: nextRenting ? `Listed for rent: ${prop.name}` : `Stopped renting: ${prop.name}`,
      body: nextRenting
        ? 'You put the property on the rental market. Rent and tenant events are applied at the start of each new age.'
        : 'You took the property off the rental market.',
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: nextRenting ? '🔑' : '🧾', propertyId: prop.id }
    });
  };

  const RENOVATION_OPTIONS = [
    { key: 'refresh', label: 'Refresh', cost: 500, conditionAdd: 12, valueBoost: 0.06, rentBoost: 0.05, levelAdd: 1, emoji: '🧽' },
    { key: 'upgrade', label: 'Upgrade', cost: 1800, conditionAdd: 28, valueBoost: 0.12, rentBoost: 0.10, levelAdd: 1, emoji: '🔧' },
    { key: 'full', label: 'Full Renovation', cost: 4500, conditionSet: 100, valueBoost: 0.22, rentBoost: 0.16, levelAdd: 2, emoji: '🛠️' }
  ];

  const handleRenovate = (prop, opt) => {
    if (!empireEnabled) return;
    const cost = getLocalAmount(opt.cost);
    // Debt Allowed
    // if (cost > money) { ... }

    const valueBefore = Number(prop.currentValue ?? prop.purchasePrice) || 0;
    const rentBefore = Number(prop.rentPerYear) || 0;

    const nextCondition =
      opt.conditionSet !== undefined
        ? opt.conditionSet
        : Math.min(100, (Number(prop.condition) || 0) + (opt.conditionAdd || 0));

    const nextValue = Math.round(valueBefore * (1 + opt.valueBoost));
    const nextRent = Math.round(rentBefore * (1 + opt.rentBoost));

    const nextReno = {
      level: Math.min(5, Number(prop.renovation?.level || 0) + (opt.levelAdd || 0)),
      totalSpent: Number(prop.renovation?.totalSpent || 0) + cost
    };

    applyMoneyDelta(-cost, 'Renovation');

    updateProperty(prop.id, {
      condition: nextCondition,
      currentValue: nextValue,
      rentPerYear: nextRent,
      renovation: nextReno
    });

    emitActionResult({
      actionId: 'realEstate',
      title: `${opt.emoji} Renovated: ${prop.name}`,
      body: [
        `You chose **${opt.label}**.`,
        '',
        `Cost: $${formatMoney(cost)}`,
        `Condition: ${Math.round(Number(prop.condition) || 0)} → ${nextCondition}`,
        `Value: $${formatMoney(valueBefore)} → $${formatMoney(nextValue)}`,
        `Rent potential: $${formatMoney(rentBefore)}/yr → $${formatMoney(nextRent)}/yr`
      ].join('\n'),
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -opt.cost,
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: '🛠️', propertyId: prop.id }
    });
  };

  const handleTenantAction = (prop, action) => {
    if (!empireEnabled) return;
    const tenant = { ...prop.tenant };
    
    if (action === "warning") {
      updateProperty(prop.id, { tenant: { ...tenant, warningSentAge: currentYear } });
      emitActionResult({
        title: "⚠️ Warning Sent",
        body: "You warned the tenant. It may reduce squatting risk next year.",
        stressDelta: 0
      });
    }
    
    if (action === "eviction") {
      const evictionCost = Math.max(400, Math.min(15000, Math.round(prop.currentValue * 0.0025) + 250));
      if (money < evictionCost) {
        // Simple toast or alert would be better but we rely on result sheet
        // We'll simulate error via result sheet for consistency or just return
        return; 
      }
      applyMoneyDelta(-evictionCost, "Eviction Filing");
      updateProperty(prop.id, { tenant: { ...tenant, status: "eviction_notice", evictionStartedAge: currentYear } });
      emitActionResult({
        title: "📄 Eviction Filed",
        body: `You filed for eviction ($${formatMoney(evictionCost)}). The sheriff will attempt to remove them next year.`,
        moneyDelta: -evictionCost
      });
    }

    if (action === "cashKeys") {
      const estRent = (prop.rentPerYear) || (prop.currentValue * 0.08); 
      const cost = Math.max(300, Math.min(25000, Math.round(estRent * 0.25)));
      
      if (money < cost) return;
      
      applyMoneyDelta(-cost, "Cash for Keys");
      
      // Clear tenant
      updateProperty(prop.id, {
        tenant: {
          status: 'vacant',
          quality: null,
          startedAge: null,
          strikes: 0,
          owed: 0,
          warningSentAge: null,
          evictionStartedAge: null,
          legalStartedAge: null
        }
      });
      
      emitActionResult({
        title: "🗝️ Cash for Keys",
        body: `You paid them $${formatMoney(cost)} to leave. The property is vacant.`,
        moneyDelta: -cost
      });
    }

    if (action === "legal") {
      const upfront = Math.max(1500, Math.min(75000, Math.round(prop.currentValue * 0.015)));
      if (money < upfront) return;
      
      applyMoneyDelta(-upfront, "Legal Services");
      updateProperty(prop.id, { 
        tenant: { ...tenant, status: "legal_case", legalStartedAge: currentYear } 
      });
      
      emitActionResult({
        title: "⚖️ Legal Services Hired",
        body: `You hired a lawyer ($${formatMoney(upfront)}). A yearly retainer will apply while the case is active. Resolution takes at least 1 year.`,
        moneyDelta: -upfront
      });
    }
  };

  const handleMoveIn = async (prop) => {
    const ok = await confirm({
      title: `Move into ${prop.name}?`,
      description: 'Moving in will stop renting and clear any tenant. This will become your primary residence (replaces any existing primary).',
      confirmText: 'Move In'
    });
    if (!ok) return;

    // Update property: stop renting, clear tenant
    updateProperty(prop.id, {
      renting: false,
      tenant: { ...DEFAULT_TENANT }
    });

    // Set primary residence and switch housing
    updateState(prev => ({
      realEstate: {
        ...DEFAULT_REAL_ESTATE_STATE,
        ...(prev.realEstate || {}),
        primaryResidencePropertyId: prop.id
      },
      livingSetup: {
        ...(prev.livingSetup || {}),
        housingId: 'owned_home'
      },
      ftueMovedIn: true
    }));

    emitActionResult({
      actionId: 'realEstate',
      title: `Moved into ${prop.name}`,
      body: 'This is now your primary residence. Rental costs removed; expenses handled in Real Estate.',
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: '🏡', propertyId: prop.id }
    });
  };

  const handleMoveOut = async (prop) => {
    const ok = await confirm({
      title: `Move out of ${prop.name}?`,
      description: 'You will no longer live here. If you have no other home, housing will default to apartment rental.',
      confirmText: 'Move Out'
    });
    if (!ok) return;

    // Clear primary residence
    const hasInventoryHome = !!(gameState?.inventory?.items || []).find(i => i.uniqueGroup === 'home');

    updateState(prev => ({
      realEstate: {
        ...DEFAULT_REAL_ESTATE_STATE,
        ...(prev.realEstate || {}),
        primaryResidencePropertyId: null
      },
      livingSetup: {
        ...(prev.livingSetup || {}),
        housingId: (prev.livingSetup?.housingId === 'owned_home' && !hasInventoryHome) 
          ? 'apartment_basic' 
          : prev.livingSetup?.housingId
      }
    }));

    emitActionResult({
      actionId: 'realEstate',
      title: `Moved out of ${prop.name}`,
      body: hasInventoryHome 
        ? 'You can now rent out this property.' 
        : 'You can now rent out this property. Your housing defaulted to apartment rental.',
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: '📦', propertyId: prop.id }
    });
  };

  const handleSell = async (prop) => {
    const ok = await confirm({
      title: `Sell ${prop.name}?`,
      description: 'You\'ll pay selling fees and mortgage balance (if any).\n\nProceeds will be deposited immediately.',
      confirmText: 'Sell Property'
    });
    if (!ok) return;

    const value = Number(prop.currentValue ?? prop.purchasePrice) || 0;
    const conditionMult = computeConditionMultiplier(prop.condition);
    const gross = Math.round(value * conditionMult);
    const fee = Math.round(gross * SELLING_FEE_PCT);
    const netBeforeDebt = gross - fee;

    const mortgageBal = prop.mortgage?.active ? Math.round(Number(prop.mortgage.balance || 0)) : 0;
    const proceeds = netBeforeDebt - mortgageBal;

    // Money comes in now (or you pay to get out if underwater)
    applyMoneyDelta(proceeds, 'Property Sale');

    // Check if selling primary residence
    const wasPrimary = prop.id === primaryResidencePropertyId;
    const hasInventoryHome = !!(gameState?.inventory?.items || []).find(i => i.uniqueGroup === 'home');

    removeProperty(prop.id);

    // Clear primary + housing fallback if needed
    if (wasPrimary) {
      updateState(prev => ({
        realEstate: {
          ...DEFAULT_REAL_ESTATE_STATE,
          ...(prev.realEstate || {}),
          primaryResidencePropertyId: null
        },
        livingSetup: {
          ...(prev.livingSetup || {}),
          housingId: (prev.livingSetup?.housingId === 'owned_home' && !hasInventoryHome) 
            ? 'apartment_basic' 
            : prev.livingSetup?.housingId
        }
      }));
    }

    const body = [
      `You sold **${prop.name}**.`,
      '',
      `Sale price (condition-adjusted): $${formatMoney(gross)}`,
      `Selling fees (${Math.round(SELLING_FEE_PCT * 100)}%): -$${formatMoney(fee)}`,
      mortgageBal > 0 ? `Mortgage payoff: -$${formatMoney(mortgageBal)}` : 'Mortgage payoff: $0',
      '',
      `Net proceeds: ${proceeds >= 0 ? '+' : '-'}$${formatMoney(Math.abs(proceeds))}`
    ].join('\n');

    emitActionResult({
      actionId: 'realEstate',
      title: `Sold: ${prop.name}`,
      body,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: proceeds,
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: '💰', propertyId: prop.id }
    });
  };

  const handleAuctionBuy = (listing) => {
    if (properties.length >= MAX_PROPERTIES) {
      emitActionResult({
        actionId: 'realEstate',
        title: 'Property limit reached',
        body: `You can own up to ${MAX_PROPERTIES} properties at a time.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['finance'],
        meta: { emoji: '🏚️' }
      });
      return;
    }

    if (hasBoughtAuctionThisAge) {
      emitActionResult({
        actionId: 'realEstate',
        title: 'Auction limit reached',
        body: 'You can only buy one foreclosure per year. (Auction houses know this trick.)',
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['finance'],
        meta: { emoji: '🏚️' }
      });
      return;
    }

    const basePrice = Number(listing.price) || 0;
    const price = getLocalAmount(basePrice);

    // FTUE tutorial listing: mark as bought
    const isFtueListing = listing.auctionId === 'ftue_starter_home';
    if (isFtueListing) {
      updateState({ ftueBoughtHouse: true });
    }

    // Debt Allowed
    // if (price > money) { ... }

    // Pay purchase price
    applyMoneyDelta(-price, 'Foreclosure Auction Purchase');

    // Resolve outcome (FTUE listing gets safe outcome)
    const outcome = isFtueListing
      ? {
          revealedCondition: 85,
          surpriseCost: 0,
          rentPerYear: listing.price * 0.08,
          surpriseLabel: 'No nasty surprises',
          storyLines: ['Clean title. No liens. Smooth transaction.']
        }
      : resolveForeclosurePurchaseOutcome({ listing, age: currentYear, runSeed });
    
    const surpriseCostLocal = getLocalAmount(outcome.surpriseCost);

    // Apply surprise cost
    if (surpriseCostLocal > 0) {
      applyMoneyDelta(-surpriseCostLocal, 'Foreclosure Surprise Costs');
    }

    // Create property
    const t = getRealEstateTemplate(listing.templateId);
    const now = Date.now();
    const propId = `prop_auc_${currentYear}_${listing.templateId}_${now}`;

    const hasSquatters = outcome.surpriseLabel && outcome.surpriseLabel.toLowerCase().includes("squatters");

    const newProperty = {
      id: propId,
      templateId: listing.templateId,
      name: listing.name,
      emoji: listing.emoji,
      purchasedAge: currentYear,
      purchasedAt: Date.now(),
      purchasePrice: price,
      currentValue: Math.round(price * (0.95 + outcome.revealedCondition / 200)),
      condition: outcome.revealedCondition,
      rentPerYear: getLocalAmount(outcome.rentPerYear),
      renting: false,
      manager: { ...DEFAULT_MANAGER },
      insurance: { ...DEFAULT_INSURANCE },
      tenant: {
        ...DEFAULT_TENANT,
        status: hasSquatters ? 'squatting' : 'vacant',
        quality: hasSquatters ? 'rough' : null,
        startedAge: hasSquatters ? currentYear : null,
        strikes: hasSquatters ? 2 : 0
      },
      renovation: { level: 0, totalSpent: 0 },
      mortgage: { active: false, balance: 0, annualRate: DEFAULT_MORTGAGE_TERMS.annualRate, paymentPerYear: 0, yearsRemaining: 0 },
      meta: {
        source: 'auction',
        riskTag: listing.riskTag,
        exteriorHint: listing.exteriorHint,
        surpriseLabel: outcome.surpriseLabel
      }
    };

    // Update state
    const nextPurchasedAuctionByAge = { ...(purchasedAuctionByAge || {}) };
    const existingAuction = Array.isArray(nextPurchasedAuctionByAge[currentYear]) ? nextPurchasedAuctionByAge[currentYear] : [];
    nextPurchasedAuctionByAge[currentYear] = [...existingAuction, listing.auctionId];

    updateState({
      realEstate: {
        ...DEFAULT_REAL_ESTATE_STATE,
        ...realEstate,
        properties: [...properties, newProperty],
        market: {
          ...(realEstate.market || {}),
          purchasedListingIdsByAge: purchasedByAge,
          purchasedAuctionIdsByAge: nextPurchasedAuctionByAge
        }
      }
    });

    // Condition interpretation
    let conditionDesc = 'shockingly fine';
    if (outcome.revealedCondition < 75) conditionDesc = 'livable but needs love';
    if (outcome.revealedCondition < 55) conditionDesc = 'fixer';
    if (outcome.revealedCondition < 35) conditionDesc = 'disaster';
    if (outcome.revealedCondition < 15) conditionDesc = 'post-apocalyptic';

    // FTUE: friendly log message
    if (isFtueListing) {
      addLog('🏠 Tutorial win: You grabbed a starter condo at auction. No nasty surprises this time.');
    }

    // Build result
    const bodyLines = [
      `You bought **${listing.name}** in ${listing.neighborhood}.`,
      '',
      `**REVEAL:**`,
      `Condition: ${outcome.revealedCondition}/100 (${conditionDesc})`,
      `Surprise: ${outcome.surpriseLabel} — $${formatMoney(surpriseCostLocal)}`,
      '',
      `Total cost: $${formatMoney(price + surpriseCostLocal)}`,
      `Potential rent: $${formatMoney(getLocalAmount(outcome.rentPerYear))}/year (if rented)`,
      '',
      ...outcome.storyLines
      ];

      emitActionResult({
      actionId: 'realEstate',
      title: `${t?.emoji || '🏚️'} Foreclosure Reveal`,
      body: bodyLines.join('\n'),
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -(price + surpriseCostLocal),
      focusDelta: 0,
      tags: ['finance'],
      meta: { emoji: '🔨', propertyId: propId }
    });
  };

  const renderMarket = () => {
    return (
      <div className="space-y-3">
        {listings.map((listing) => {
          const t = getRealEstateTemplate(listing.templateId);
          const isPurchased = purchasedThisAge.has(listing.listingId);

          const localPrice = getLocalAmount(listing.price);
          const localEstRent = getLocalAmount(listing.estRent);

          const down = Math.round(localPrice * DEFAULT_MORTGAGE_TERMS.downPaymentPct);
          const principal = Math.max(0, localPrice - down);
          const payment = calcMortgagePayment(principal, DEFAULT_MORTGAGE_TERMS.annualRate, DEFAULT_MORTGAGE_TERMS.termYears);

          const canCash = true; // money >= localPrice;
          const canMortgage = true; // money >= down;

          return (
            <div key={listing.listingId} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{listing.emoji}</div>
                  <div>
                    <div className="font-semibold text-slate-800 leading-tight">{listing.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{listing.neighborhood} • {listing.tag}</div>
                    <div className="text-xs text-slate-600 mt-2">
                      {t?.blurb || 'A property listing.'}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-slate-800">${formatMoney(localPrice)}</div>
                  <div className="text-[10px] text-slate-500">Condition: {listing.condition}/100</div>
                  <div className="text-[10px] text-slate-500">Est. rent: ${formatMoney(localEstRent)}/yr</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  disabled={isPurchased || properties.length >= MAX_PROPERTIES}
                  onClick={() => handleBuy(listing, 'cash')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    (isPurchased || properties.length >= MAX_PROPERTIES)
                      ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                  }`}
                >
                  {isPurchased ? 'Sold' : `Buy Cash ($${formatMoney(localPrice)})`}
                </button>

                <button
                  disabled={isPurchased || properties.length >= MAX_PROPERTIES}
                  onClick={() => handleBuy(listing, 'mortgage')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    (isPurchased || properties.length >= MAX_PROPERTIES)
                      ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                      : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                  }`}
                >
                  {isPurchased
                    ? 'Sold'
                    : `Mortgage ($${formatMoney(down)} down)`}
                </button>
              </div>

              {!isPurchased && (
                <div className="mt-2 text-[10px] text-slate-500">
                  Mortgage terms: {pct(DEFAULT_MORTGAGE_TERMS.annualRate)} for {DEFAULT_MORTGAGE_TERMS.termYears} years • Est. payment: ${formatMoney(payment)}/yr
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPortfolio = () => {
    if (properties.length === 0) {
      return (
        <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
          You don't own any properties yet. Browse the market to buy one.
        </div>
      );
    }

    // Sort properties newest first (for FTUE targeting)
    const sortedProperties = [...properties].sort((a, b) => {
      const aTime = a.purchasedAt || a.purchasedAge || 0;
      const bTime = b.purchasedAt || b.purchasedAge || 0;
      return bTime - aTime;
    });

    const policy = realEstate.landlordPolicy || 'balanced';
    const rentingCount = properties.filter(p => !!p.renting).length;
    const occupiedCount = properties.filter(p => { if (!p.renting) return false; const st = String(p.tenant?.status || 'vacant'); return st !== 'vacant'; }).length;
    const occupancyPct = rentingCount > 0 ? Math.round((occupiedCount / rentingCount) * 100) : 0;
    const lastYearNet = properties.reduce((s, p) => s + (Number(p.lastYear?.net) || 0), 0);
    const alertsCount = properties.filter(p => ['delinquent','eviction_notice','squatting','legal_case'].includes(String(p.tenant?.status || ''))).length;

    return (
      <div className="space-y-3">
        {landlordLegacyOn && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs">
                <div className="text-slate-500">Properties</div>
                <div className="text-lg font-bold text-slate-800">{properties.length}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs">
                <div className="text-slate-500">Occupancy</div>
                <div className="text-lg font-bold text-slate-800">{occupancyPct}%</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs">
                <div className="text-slate-500">Last Year Net</div>
                <div className={`text-lg font-bold ${lastYearNet>=0?'text-emerald-700':'text-rose-700'}`}>{lastYearNet>=0?'+':''}${formatMoney(Math.abs(lastYearNet))}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs">
                <div className="text-slate-500">Alerts</div>
                <div className={`text-lg font-bold ${alertsCount>0?'text-amber-700':'text-slate-800'}`}>{alertsCount}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 text-xs">
              <div className="flex items-center justify-between px-2 py-1">
                <div className="font-semibold text-slate-800">Landlord Policy</div>
                <div className="flex gap-1">
                  {['strict','balanced','compassionate'].map(k => (
                    <button key={k} onClick={() => setRealEstateState({ landlordPolicy: k })} className={`px-2 py-1 rounded-md border text-[11px] ${policy===k?'bg-slate-800 text-white border-slate-800':'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{k.charAt(0).toUpperCase()+k.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div className="px-2 pb-2 text-[10px] text-slate-500">Policy affects tenant satisfaction, hardship outcomes, and rent reliability.</div>
            </div>
          </div>
        )}
        {sortedProperties.map((prop, index) => {
          const isNewestProperty = index === 0;
          const t = getRealEstateTemplate(prop.templateId);
          const value = Number(prop.currentValue ?? prop.purchasePrice) || 0;
          const rent = Number(prop.rentPerYear) || (t?.baseRent || 0);
          const costs = estimateAnnualCosts(prop);
          const mortgagePay = prop.mortgage?.active ? Math.round(Number(prop.mortgage.paymentPerYear || 0)) : 0;

          const estNet = (prop.renting ? rent : 0) - costs.maintenance - costs.tax - mortgagePay;

          const cond = Math.round(Number(prop.condition) || 0);

          return (
            <div key={prop.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{prop.emoji || t?.emoji || '🏠'}</div>
                  <div>
                    <div className="font-semibold text-slate-800 leading-tight">{prop.name || t?.label || 'Property'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Bought age {prop.purchasedAge} • Value: ${formatMoney(value)}
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      Condition: <span className="font-medium">{cond}/100</span> • {prop.renting ? 'Rented' : 'Not rented'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Est. net/year: {estNet >= 0 ? '+' : '-'}${formatMoney(Math.abs(estNet))}
                    </div>

                    {landlordLegacyOn && (
                      <div className="mt-2 h-2 bg-slate-200 rounded overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${cond}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-slate-700">${formatMoney(rent)}/yr rent</div>
                  <div className="text-[10px] text-slate-500">Maint.: -${formatMoney(costs.maintenance)}/yr</div>
                  <div className="text-[10px] text-slate-500">Tax: -${formatMoney(costs.tax)}/yr</div>
                  {prop.mortgage?.active && (
                    <div className="text-[10px] text-slate-500">
                      Mortgage: -${formatMoney(mortgagePay)}/yr (bal ${formatMoney(Math.round(Number(prop.mortgage.balance || 0)))})
                    </div>
                  )}
                </div>
              </div>

              {/* last year summary */}
              {prop.lastYear && prop.lastYear.age === currentYear && (
                <div className="mt-3 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="font-semibold text-slate-700 mb-1">This age start results</div>
                  <div>
                    Rent: ${formatMoney(prop.lastYear.rentCollected)} • Expenses: ${formatMoney(prop.lastYear.expenses)} • Net: {prop.lastYear.net >= 0 ? '+' : '-'}${formatMoney(Math.abs(prop.lastYear.net))}
                  </div>
                </div>
              )}

              {/* Tenant / Landlord Panel */}
              {empireEnabled && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  {landlordLegacyOn && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="text-lg">
                        {getTenantArchetype(prop.tenant?.archetypeId)?.emoji || '🧑'}
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-700 font-semibold">{getTenantArchetype(prop.tenant?.archetypeId)?.label || 'No tenant'}</div>
                        {prop.tenant?.status !== 'vacant' && (
                          <div className="mt-1 h-1.5 bg-slate-200 rounded">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.max(0, Math.min(100, prop.tenant?.satisfaction||0))}%` }} />
                          </div>
                        )}
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        prop.tenant?.status==='occupied'?'bg-emerald-100 text-emerald-700':
                        prop.tenant?.status==='vacant'?'bg-slate-100 text-slate-500':'bg-amber-100 text-amber-700'
                      }`}>
                        {String(prop.tenant?.status||'vacant').toUpperCase().replace('_',' ')}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-slate-700">Tenant Status</div>
                      <div className={`text-sm ${
                        prop.tenant?.status === 'vacant' ? 'text-slate-400' :
                        prop.tenant?.status === 'occupied' ? 'text-emerald-600' :
                        'text-amber-600 font-bold'
                      }`}>
                        {prop.tenant?.status ? prop.tenant.status.toUpperCase().replace('_', ' ') : 'VACANT'}
                      </div>
                    </div>
                    {prop.tenant?.status === 'occupied' && (
                      <div className="text-right">
                        <div className="font-semibold text-slate-700">Quality</div>
                        <div>{prop.tenant?.quality?.toUpperCase() || 'Unknown'}</div>
                      </div>
                    )}
                    {(prop.tenant?.owed > 0 || prop.tenant?.strikes > 0) && (
                      <div className="text-right">
                        <div className="text-rose-600 font-bold">Owed: ${formatMoney(prop.tenant.owed)}</div>
                        <div className="text-slate-500">Strikes: {prop.tenant.strikes}</div>
                      </div>
                    )}
                  </div>

                  {/* Landlord Actions */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prop.tenant?.status === 'delinquent' && (
                      <>
                        <button className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs" onClick={() => handleTenantAction(prop, 'warning')}>Send Warning</button>
                        <button className="px-2 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded text-xs" onClick={() => handleTenantAction(prop, 'eviction')}>Start Eviction</button>
                      </>
                    )}
                    {prop.tenant?.status === 'squatting' && (
                      <div className="w-full">
                        <div className="mb-2 p-2 bg-rose-100 text-rose-800 rounded flex items-center gap-2">
                          <span>🚫</span> Squatters are occupying this property.
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50" onClick={() => handleTenantAction(prop, 'cashKeys')}>Cash for Keys</button>
                          <button className="flex-1 px-2 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded text-xs" onClick={() => handleTenantAction(prop, 'legal')}>Hire Legal Services</button>
                        </div>
                      </div>
                    )}
                    {prop.tenant?.status === 'legal_case' && (
                      <div className="w-full p-2 bg-indigo-50 text-indigo-800 rounded flex items-center gap-2">
                        <span>⚖️</span> Legal case active (resolves on future age).
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2">
                {prop.id === primaryResidencePropertyId ? (
                  <button
                    onClick={() => handleMoveOut(prop)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-[0.98]"
                  >
                    🏡 Move Out
                  </button>
                ) : (
                  <button
                    data-tour={isNewestProperty ? 'realestate-portfolio-move-in-newest' : undefined}
                    onClick={() => handleMoveIn(prop)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-[0.98]"
                  >
                    🏡 Move In
                  </button>
                )}
                <button
                  onClick={() => handleSell(prop)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50/50 active:scale-[0.98]"
                >
                  Sell
                </button>
              </div>
              
              <div className="mt-2">
                <button
                  onClick={() => handleToggleRent(prop)}
                  disabled={!empireEnabled || prop.id === primaryResidencePropertyId || (prop.tenant?.status !== 'vacant' && prop.tenant?.status !== 'occupied' && prop.tenant?.status !== 'delinquent')}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] ${
                    (!empireEnabled || prop.id === primaryResidencePropertyId || (prop.tenant?.status !== 'vacant' && prop.tenant?.status !== 'occupied' && prop.tenant?.status !== 'delinquent')) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {prop.id === primaryResidencePropertyId ? '🚫 Primary Residence (Cannot Rent)' : prop.renting ? 'Stop Renting' : 'Rent Out'}
                </button>
              </div>

              {landlordLegacyOn && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {/* Manager controls */}
                  <div className="rounded-lg border border-slate-200 p-2">
                    <div className="text-[11px] text-slate-700 font-semibold mb-1">Manager</div>
                    {prop.manager?.enabled ? (
                      <button onClick={() => updateProperty(prop.id, { manager: { ...prop.manager, enabled:false } })} className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[11px] hover:bg-slate-50">Fire Manager</button>
                    ) : (
                      <button onClick={() => {
                        const fee = Math.max(250, Math.min(25000, Math.round((prop.currentValue||0) * 0.002)));
                        applyMoneyDelta(-fee, 'Hire Property Manager');
                        updateProperty(prop.id, { manager: { ...prop.manager, enabled:true, hiredAge: currentYear } });
                      }} className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[11px] hover:bg-slate-50">Hire Manager (fee)</button>
                    )}
                  </div>

                  {/* Insurance controls */}
                  <div className="rounded-lg border border-slate-200 p-2">
                    <div className="text-[11px] text-slate-700 font-semibold mb-1">Insurance</div>
                    <select
                      className="w-full border border-slate-300 rounded px-2 py-1 text-[11px] bg-white"
                      value={prop.insurance?.planId || 'none'}
                      onChange={(e) => updateProperty(prop.id, { insurance: { ...(prop.insurance||{}), planId: e.target.value } })}
                    >
                      {Object.values(INSURANCE_PLANS).map(pl => (
                        <option key={pl.id} value={pl.id}>{pl.emoji} {pl.label}</option>
                      ))}
                    </select>
                    <div className="mt-1 text-[10px] text-slate-500">
                      Premium ~ ${formatMoney(Math.max(120, Math.min(50000, Math.round((prop.currentValue||0) * (getInsurancePlan(prop.insurance?.planId).premiumRate||0)))))}/yr • Coverage: Disaster {Math.round(getInsurancePlan(prop.insurance?.planId).disasterCoverage*100)}%, Tenant {Math.round(getInsurancePlan(prop.insurance?.planId).tenantDamageCoverage*100)}%
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 grid grid-cols-3 gap-2">
                {RENOVATION_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => handleRenovate(prop, opt)}
                    disabled={!empireEnabled || prop.condition >= 100}
                    className={`px-2 py-2 rounded-lg text-[10px] font-semibold border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98] ${
                      (!empireEnabled || prop.condition >= 100) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {opt.emoji} {opt.label}<br />
                    <span className="text-slate-500 font-medium">-${formatMoney(getLocalAmount(opt.cost))}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAuction = () => {
    return (
      <div className="space-y-3">
        {/* Warning card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-amber-800 mb-1">⚠️ Foreclosure Auctions</div>
          <div className="text-xs text-amber-700 leading-relaxed">
            Distressed properties. Condition is hidden until after purchase. Surprise costs (liens, repairs, squatters) are revealed post-sale. Cash only. High risk, high reward (sometimes).
          </div>
        </div>

        {hasBoughtAuctionThisAge && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            🔒 Auction limit: 1 per year. Come back next age.
          </div>
        )}

        {auctionListings.map((listing, index) => {
          const t = getRealEstateTemplate(listing.templateId);
          const canBuy = !hasBoughtAuctionThisAge && properties.length < MAX_PROPERTIES; // money check removed
          const isFeatured = listing.auctionId === 'ftue_starter_home';

          return (
            <div 
              key={listing.auctionId} 
              data-tour={isFeatured ? 'realestate-auction-featured' : undefined}
              className="rounded-xl border border-slate-300 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{listing.emoji}</div>
                  <div>
                    <div className="font-semibold text-slate-800 leading-tight">{listing.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{listing.neighborhood} • Foreclosed</div>
                    <div className="text-xs text-slate-600 mt-2">
                      {t?.blurb || 'A distressed property.'}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <div className={`inline-block px-2 py-1 rounded text-[10px] font-semibold ${
                        listing.riskTag === 'Low Risk' ? 'bg-green-100 text-green-800' :
                        listing.riskTag === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                        listing.riskTag === 'High Risk' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {listing.riskTag}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 italic">
                      "{listing.exteriorHint}"
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-slate-800">${formatMoney(getLocalAmount(listing.price))}</div>
                  <div className="text-[10px] text-slate-500">Cash only</div>
                  <div className="text-[10px] text-amber-600 font-medium mt-1">Condition: ???</div>
                </div>
              </div>

              <div className="mt-3">
                <button
                  data-tour={isFeatured ? 'realestate-auction-buy-featured' : undefined}
                  disabled={!canBuy}
                  onClick={() => handleAuctionBuy(listing)}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    !canBuy
                      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'border-slate-300 bg-white hover:border-amber-500 hover:bg-amber-50/50 active:scale-[0.98]'
                  }`}
                >
                  {hasBoughtAuctionThisAge ? 'Auction closed for the year' : `Bid $${formatMoney(getLocalAmount(listing.price))} (Cash)`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[51] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="rt-modal-glass w-full max-w-lg bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl shadow-2xl border border-amber-200/50 my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex-shrink-0 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">🏠 Real Estate</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Money: ${formatMoney(money)} • Properties: {properties.length}
                    </p>
                  </div>
                  <button
                    data-tour="realestate-close"
                    onClick={onClose}
                    className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Tabs */}
                {empireEnabled ? (
                  <div className="px-6 pb-3">
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 rounded-xl p-1">
                      <button
                        onClick={() => setTab('market')}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          tab === 'market' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Market
                      </button>
                      <button
                        data-tour="realestate-tab-auction"
                        onClick={() => setTab('auction')}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                          tab === 'auction' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <div>Auction</div>
                        <div className="text-[9px] text-slate-400">(1/year)</div>
                      </button>
                      <button
                        data-tour="realestate-tab-portfolio"
                        onClick={() => setTab('portfolio')}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          tab === 'portfolio' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Portfolio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pb-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-center">
                      Empire Estates is disabled. You can sell existing properties, but landlord systems are paused.
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {tab === 'market' ? renderMarket() : tab === 'auction' ? renderAuction() : renderPortfolio()}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-slate-200/50 px-6 py-4 bg-white/60 backdrop-blur-sm rounded-b-2xl">
                <div className="text-[11px] text-slate-500 leading-snug">
                  Notes: Rent, maintenance, taxes, mortgage payments, and tenant events apply automatically at the start of each new age.
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}