import React, { useState } from 'react';
import { X, Sparkles, Map, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OUTDOOR_ADVENTURES } from './outdoorAdventuresData';
import { RV_TRIPS } from './rvTripsData';
import { useGameState, combineDeltas, formatMoney, hasMinorChild } from "@/components/game/GameStateContext";
import { hasShopItem } from './shopCatalog';
import TravelPlannerModal from './TravelPlannerModal';
import { appendHumor } from './humorUtils';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { TRAVEL_CONFIG, TRAVEL_EVENT_POOLS } from './travelV2Assets';

const pickOne = (list) => {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
};

const formatDeltaBadge = (label, value) => {
  if (!value || value === 0) return null;
  const sign = value > 0 ? '+' : '';
  return `${label} ${sign}${value}`;
};

function computeContextBonus(adventure, gameState) {
  const interest = gameState.childProfile?.primaryInterest;
  const temperament = gameState.temperament;
  const childName = gameState.childName || 'your child';

  const bonus = {
    deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
    loveDelta: 0,
    stressDelta: 0,
    lines: []
  };

  // Interest bonuses
  if (interest === 'ANIMALS') {
    bonus.deltas.empathy += 1;
    bonus.lines.push(`🐾 ${childName} keeps spotting animals like they're celebrity sightings.`);
  } else if (interest === 'SPORTS') {
    bonus.deltas.confidence += 1;
    bonus.lines.push(`🏀 They treat the whole thing like practice and surprise you with stamina.`);
  } else if (interest === 'SPACE' && adventure.id === 'stargazing') {
    bonus.deltas.intelligence += 1;
    bonus.lines.push(`🚀 They ask galaxy‑level questions and you love watching their brain light up.`);
  } else if (interest === 'BUILDING') {
    bonus.deltas.intelligence += 1;
    bonus.lines.push(`🧩 They start planning routes, rules, and little systems all by themselves.`);
  } else if (interest === 'ART') {
    bonus.deltas.empathy += 1;
    bonus.lines.push(`🎨 They narrate the scenery like they're painting with words.`);
  } else if (interest === 'PEOPLE' && adventure.id === 'trail_cleanup') {
    bonus.loveDelta += 1;
    bonus.lines.push(`💛 They glow with pride when you thank them for helping.`);
  }

  // Temperament bonuses
  const tempLower = String(temperament || '').toLowerCase();
  
  const safeIncludes = (str, s) => String(str || '').includes(s);

  if (safeIncludes(tempLower, 'bold') || safeIncludes(tempLower, 'intense')) {
    bonus.deltas.confidence += 1;
    bonus.lines.push(`⚡ Bold energy: they lean into the adventure with zero hesitation.`);
  } else if (safeIncludes(tempLower, 'sensitive')) {
    bonus.deltas.empathy += 1;
    bonus.stressDelta -= 1;
    bonus.lines.push(`🌙 A gentle pace helps them stay regulated—and you feel calmer too.`);
  } else if (safeIncludes(tempLower, 'stubborn') || safeIncludes(tempLower, 'curious')) {
    bonus.deltas.discipline += 1;
    bonus.lines.push(`🧱 A simple plan (snacks, water, 'what happens next') helps them thrive.`);
  } else if (safeIncludes(tempLower, 'easygoing')) {
    bonus.loveDelta += 1;
    bonus.lines.push(`🫂 They want to tell you everything they're thinking the whole way.`);
  }

  return bonus;
}

function computeRandomTwist(adventure, gameState) {
  const childName = gameState.childName || 'your child';

  const twist = {
    deltas: { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 },
    loveDelta: 0,
    stressDelta: 0,
    line: null
  };

  const r = Math.random();

  // Lower chaos for calmer adventures
  const canMishap = !['stargazing'].includes(adventure.id);

  if (canMishap && r < 0.12 && gameState.currentYear >= 3) {
    // Minor mishap: still mostly fun.
    twist.deltas.discipline += 1;
    twist.stressDelta += 1;
    twist.line = `🩹 A small wobble happens (mud, a scraped knee, a lost hat) — but ${childName} bounces back laughing.`;
    return twist;
  }

  if (r < 0.35) {
    // Learning moment
    twist.deltas.intelligence += 1;
    twist.line = `💡 They ask "why" about everything and you end up learning too.`;
    return twist;
  }

  if (r > 0.88) {
    // Extra sweet bonding moment
    twist.loveDelta += 1;
    twist.line = `❤️ On the way home, they lean on you and say they want to do this again.`;
    return twist;
  }

  return twist;
}

export default function OutdoorAdventuresModal({ open, onClose }) {
  const navigate = useNavigate();
  const {
    gameState,
    consumeAction,
    spendMoney,
    applyDeltas,
    applyLove,
    applyStress,
    adjustedLoveGain,
    applyTechniqueBonusesForAction,
    emitActionResult,
    addLog,
    getLocalAmount,
    recordTimelineEntry,
    spendFocus,
    updateState,
    OUTDOOR_ACTIVITY_PACK,
    performActivity
  } = useGameState();

  const { finished, actionPoints, currentYear } = gameState;
  const canUse = actionPoints >= 1;
  
  const [travelPlannerOpen, setTravelPlannerOpen] = useState(false);

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

  const eligibleAdventures = OUTDOOR_ADVENTURES.filter(a => (currentYear ?? 0) >= (a.minAge ?? 0));

  // Merge new pack and filter by requiresItems
  const allAdventures = [
    ...eligibleAdventures, 
    ...OUTDOOR_ACTIVITY_PACK
      .filter(a => (currentYear ?? 0) >= (a.minAge ?? 0))
      .filter(a => {
        if (!a.requiresItems || !Array.isArray(a.requiresItems)) return true;
        return a.requiresItems.every(itemId => hasShopItem(gameState, itemId));
      })
  ];

  // Detect RV ownership + tier
  const items = gameState?.inventory?.items || [];
  const ownedRv = items.find(i => i.uniqueGroup === 'rv') || null;
  const rvTier = ownedRv?.id === 'vehicle_grand_rv' ? 3
            : ownedRv?.id === 'vehicle_rv' ? 2
            : ownedRv?.id === 'vehicle_camper_van' ? 1
            : 0;

  // Detect if player has minor child
  const hasMinor = hasMinorChild(gameState);

  const handleRvTrip = (trip, localCost) => {
    if (!consumeAction('outdoorAdventures')) return;

    let moneyDelta = 0;
    if (localCost > 0) {
      spendMoney(localCost);
      moneyDelta -= localCost;
    }

    // Optional breakdown chance (more likely on cheaper rigs)
    const breakdownChance = rvTier === 1 ? 0.18 : rvTier === 2 ? 0.10 : 0.05;
    let twistLine = '';
    let twistStress = 0;
    if (Math.random() < breakdownChance) {
      const extraBase = rvTier === 1 ? 220 : rvTier === 2 ? 180 : 140;
      const extra = getLocalAmount(extraBase);
      spendMoney(extra);
      moneyDelta -= extra;
      twistStress = 1;
      twistLine = `🔧 Halfway there, something makes a noise you swear is personal. You pay a "quick fix" fee and pretend this was always the plan.`;
    }

    const eff = hasMinor ? (trip.withKid || {}) : (trip.solo || {});
    const deltas = eff.deltas || {};
    const stressDelta = Number(eff.stressDelta || 0) + twistStress;
    const loveDeltaRaw = Number(eff.loveDelta || 0);
    const loveDelta = (loveDeltaRaw > 0 && hasMinor) ? adjustedLoveGain(loveDeltaRaw) : 0;

    if (Object.keys(deltas).length) applyDeltas(deltas, `RV Trip: ${trip.title}`);
    if (stressDelta) applyStress(stressDelta, trip.title);
    if (loveDelta) applyLove(loveDelta, trip.title);

    const who = hasMinor ? (gameState.childName || 'your child') : 'yourself';
    const body = [
      `You take the ${ownedRv?.name || 'RV'} out for **${trip.title}** with ${who}.`,
      `Fuel, fees, and snacks cost **$${formatMoney(localCost)}**.`,
      twistLine,
      hasMinor
        ? `Somewhere between the drive and the campfire, you feel your bond strengthen.`
        : `Your nervous system finally stops arguing with itself. You sleep like a person in a commercial.`
    ].filter(Boolean).join(' ');

    emitActionResult({
      actionId: 'outdoorAdventures',
      title: `${trip.emoji} ${trip.title}`,
      body,
      deltas,
      loveDelta,
      stressDelta,
      moneyDelta,
      focusDelta: -1,
      tags: ['outdoor', 'travel', 'rv'],
      meta: { emoji: trip.emoji, tripId: trip.id, rvId: ownedRv?.id }
    });

    recordTimelineEntry({
      kind: 'travel',
      title: `${trip.emoji} ${trip.title}`,
      detail: body,
      deltas,
      loveDelta,
      stressDelta,
      moneyDelta
    });

    onClose();
  };

  const handleAdventure = (adventure) => {
    // If it's from the new pack (has 'effects'), use performActivity
    if (adventure.effects) {
      if (performActivity(adventure)) {
        onClose();
      }
      return;
    }
    // 1) Spend focus
    if (!consumeAction('outdoorAdventures')) return;

    // 2) Money cost
    const baseCost = Math.max(0, Number(adventure.moneyCost || 0));
    const moneyCost = getLocalAmount(baseCost);
    let moneyDelta = 0;
    if (moneyCost > 0) {
      spendMoney(moneyCost);
      moneyDelta = -moneyCost;
      addLog(`💸 You spend $${formatMoney(moneyCost)} on gas, snacks, and "just one more thing."`);
    }

    // 3) Compute deltas
    const baseDeltas = adventure.deltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
    const techniqueBonuses = applyTechniqueBonusesForAction('play');
    const contextBonus = computeContextBonus(adventure, gameState);
    const twist = computeRandomTwist(adventure, gameState);

    let combined = combineDeltas(baseDeltas, techniqueBonuses);
    combined = combineDeltas(combined, contextBonus.deltas);
    combined = combineDeltas(combined, twist.deltas);

    // 4) Love + stress
    let loveDelta = Number(adventure.loveDelta || 0) + Number(contextBonus.loveDelta || 0) + Number(twist.loveDelta || 0);
    let stressDelta = Number(adventure.stressDelta || 0) + Number(contextBonus.stressDelta || 0) + Number(twist.stressDelta || 0);

    const finalLoveDelta = loveDelta > 0 ? adjustedLoveGain(loveDelta) : loveDelta;

    // 5) Apply changes
    applyDeltas(combined, `Outdoor Adventure: ${adventure.title}`);
    if (finalLoveDelta !== 0) applyLove(finalLoveDelta, adventure.title);
    if (stressDelta !== 0) applyStress(stressDelta, adventure.title);

    // 6) Narrative
    const childName = gameState.childName || 'your child';
    const memory = pickOne(adventure.memories) || 'They have a lot of fun.';
    const extraLines = [
      ...contextBonus.lines,
      twist.line
    ].filter(Boolean);

    const funCloser = pickOne([
      `They come home tired‑happy and proud.`,
      `They keep talking about it for the rest of the day.`,
      `They fall asleep with the kind of smile that says it mattered.`
    ]);

    const outingsCount = Math.floor(Math.random() * (9 - 4 + 1)) + 4;

    const bodyParts = [
      `You take ${childName} on an outdoor adventure: **${adventure.title}**.`,
      memory,
      `Over the year, you end up doing it about ${outingsCount} times.`,
      `They have an absolute blast.`,
      ...extraLines,
      funCloser
    ];

    const body = bodyParts.filter(Boolean).join(' ');
    const bodyWithHumor = appendHumor(body, 'outdoorAdventures', { childName });
    addLog(bodyWithHumor);

    // 7) Result sheet
    emitActionResult({
      actionId: 'outdoorAdventures',
      title: adventure.title,
      body: bodyWithHumor,
      deltas: combined,
      loveDelta: finalLoveDelta,
      stressDelta,
      moneyDelta,
      focusDelta: -1,
      tags: ['play', 'outdoor'],
      meta: {
        emoji: adventure.emoji,
        adventureId: adventure.id,
        coachNote: adventure.coachNote
      }
    });

    // Record Life Log entry
    recordTimelineEntry({
      kind: 'play',
      title: `${adventure.emoji} ${adventure.title}`,
      detail: bodyWithHumor,
      deltas: combined,
      loveDelta: finalLoveDelta,
      stressDelta: stressDelta,
      moneyDelta: moneyDelta
    });

    onClose();
  };

  const handleTravelConfirm = (plan) => {
    // Basic implementation of travel confirmation
    const { destination, lengthId, styleId, companionId, tripType } = plan;
    
    // Calculate cost (simplified reuse from planner)
    const baseCost = tripType === 'domestic' 
      ? TRAVEL_CONFIG.baseCost.domestic 
      : TRAVEL_CONFIG.baseCost.international;
    
    const lengthMult = TRAVEL_CONFIG.lengthMultipliers[lengthId] || 1;
    const styleMult = TRAVEL_CONFIG.styleMultipliers[styleId] || 1;
    const companionMult = TRAVEL_CONFIG.companionMultipliers[companionId] || 1;
    
    const totalCost = Math.round(baseCost * lengthMult * styleMult * companionMult);
    const localCost = getLocalAmount(totalCost);
    
    // Deduct
    spendMoney(localCost);
    spendFocus(1, "Travel");
    
    // Passport Stamp
    if (tripType === 'international') {
      updateState(prev => ({
        passportStamps: [...(prev.passportStamps || []), { 
          id: `stamp_${Date.now()}`,
          destCode: destination.code,
          name: destination.name,
          date: Date.now()
        }]
      }));
    }

    // Story Generation
    const pool = TRAVEL_EVENT_POOLS[destination.code] || TRAVEL_EVENT_POOLS.D1; // Fallback
    const kidLine = pickOne(pool.kid) || "They are amazed by everything.";
    const cultureLine = pickOne(pool.culture) || "The culture is vibrant and new.";
    const compLine = pickOne(pool.complication) || "A small hiccup, but you handle it.";
    
    const story = `You travel to ${destination.name}! ${kidLine} ${cultureLine} ${compLine}`;
    
    addLog(`✈️ Travel: ${destination.name}`);
    
    // Record
    recordTimelineEntry({
      kind: 'travel',
      title: `✈️ Trip to ${destination.name}`,
      detail: story,
      deltas: { intelligence: 1, empathy: 1, confidence: 1 }, // Simplified
      moneyDelta: -localCost,
      loveDelta: 2,
      stressDelta: -1
    });
    
    emitActionResult({
      actionId: 'travel',
      title: `Trip to ${destination.name}`,
      body: story,
      deltas: { intelligence: 1, empathy: 1, confidence: 1 },
      loveDelta: 2,
      stressDelta: -1,
      moneyDelta: -localCost,
      focusDelta: -1,
      tags: ['travel', tripType],
      meta: { emoji: '✈️' }
    });

    setTravelPlannerOpen(false);
    onClose();
  };

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
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🏕️ Outdoor & Travel</h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Adventures build confidence and empathy.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {!canUse && (
                  <div className="p-4 mb-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
                    You need at least <span className="font-semibold">1 Focus</span> to go.
                  </div>
                )}

                {/* RV Trips Section */}
                {ownedRv && rvTier > 0 && (
                  <div className="mb-4 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">🚐 RV Trips (Unlocked)</h4>

                    {RV_TRIPS.filter(t => rvTier >= (t.minTier || 1)).map((trip) => {
                      const baseCost = Number(trip.baseCost || 0);
                      const tierMult = rvTier === 3 ? 1.25 : rvTier === 2 ? 1.0 : 0.85;
                      const cost = getLocalAmount(Math.round(baseCost * tierMult));

                      return (
                        <button
                          key={trip.id}
                          onClick={() => handleRvTrip(trip, cost)}
                          disabled={!canUse}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                            !canUse
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-3xl flex-shrink-0">{trip.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 text-base">{trip.title}</div>
                              <div className="text-sm text-slate-600 mt-1 leading-relaxed">{trip.tagline}</div>
                              <div className="mt-2 text-xs font-medium text-indigo-700 bg-indigo-100 inline-block px-2 py-1 rounded-full">
                                Cost: ${formatMoney(cost)} • 1 Focus
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Special Travel Section */}
                <div className="mb-4 space-y-3">
                   <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Travel & World</h4>
                  
                  <button
                    onClick={() => setTravelPlannerOpen(true)}
                    disabled={!canUse}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      !canUse
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : 'border-purple-200 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">✈️</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 text-base">Plan International Trip</div>
                        <div className="text-sm text-slate-600 mt-1">
                          Explore the world, collect stamps, and broaden horizons.
                        </div>
                        <div className="mt-2 text-xs font-medium text-purple-700 bg-purple-100 inline-block px-2 py-1 rounded-full">
                          Cost varies • 1 Focus
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate(createPageUrl('Passport'))}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">🛂</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 text-base">Check Your Passport</div>
                        <div className="text-sm text-slate-600 mt-1">
                          View your stamps and travel milestones.
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Local Adventures</h4>

                <div className="space-y-3">
                  {allAdventures.map((adventure) => {
                    const baseCost = Number(adventure.moneyCost || 0);
                    const cost = getLocalAmount(baseCost);
                    
                    const badges = [
                      adventure.focusCost ? `Focus: ${adventure.focusCost}` : `Focus: 1`,
                      cost > 0 ? `Cost: $${formatMoney(cost)}` : `Cost: $0`
                    ];

                    let deltaBadges = [];
                    if (adventure.effects) {
                       // New pack structure
                       const e = adventure.effects;
                       if (e.child) {
                         Object.entries(e.child).forEach(([k, v]) => {
                           if (v !== 0) deltaBadges.push(formatDeltaBadge(k.substring(0,3).toUpperCase(), v));
                         });
                       }
                       if (e.bond) deltaBadges.push(formatDeltaBadge('BOND', e.bond));
                       if (e.player?.stress) deltaBadges.push(formatDeltaBadge('STRESS', e.player.stress));
                    } else {
                       // Old structure
                       deltaBadges = [
                        formatDeltaBadge('INT', adventure.deltas?.intelligence),
                        formatDeltaBadge('EMP', adventure.deltas?.empathy),
                        formatDeltaBadge('DIS', adventure.deltas?.discipline),
                        formatDeltaBadge('CON', adventure.deltas?.confidence),
                        formatDeltaBadge('LOVE', adventure.loveDelta),
                        formatDeltaBadge('STRESS', adventure.stressDelta)
                      ];
                    }
                    deltaBadges = deltaBadges.filter(Boolean);

                    return (
                      <button
                        key={adventure.id}
                        onClick={() => handleAdventure(adventure)}
                        disabled={!canUse}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          !canUse
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl flex-shrink-0">{adventure.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-base">{adventure.title}</div>
                            <div className="text-sm text-slate-600 mt-1 leading-relaxed">{adventure.tagline || adventure.subtitle}</div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {badges.map((b) => (
                                <span
                                  key={b}
                                  className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>

                            {deltaBadges.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {deltaBadges.map((b) => (
                                  <span
                                    key={b}
                                    className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 text-xs text-slate-500">
                  Tip: Outdoor adventures tend to be a high‑value Focus spend because they build confidence, empathy, and warm memories.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Travel Planner */}
          <TravelPlannerModal
            open={travelPlannerOpen}
            onClose={() => setTravelPlannerOpen(false)}
            onConfirm={handleTravelConfirm}
            source="adventure"
          />
        </>
      )}
    </AnimatePresence>
  );
}