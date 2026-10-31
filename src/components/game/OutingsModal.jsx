import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, ECONOMY_PRICES, formatMoney } from './GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import { hasShopItem } from './shopCatalog';
import { appendHumor } from './humorUtils';

const MOVIE_TITLES = [
  "Captain Comet and the Cookie Planet",
  "The Secret Library of Dragons",
  "Mango Ninja: The Fruit Strikes Back",
  "Robot Babysitter: Protocol Hug",
  "The Tiny Detective and the Lost Sandwich",
  "Moonlight Skate Squad",
  "The Great Stuffed‑Animal Rescue",
  "Pajama Pirates of Bubble Bay",
  "The Whispering Forest",
  "Snow Day Superstar",
  "The Mystery of Maple Street",
  "Starlight Soccer",
  "Volcano Camp",
  "Galaxy Bake‑Off",
  "The Time‑Traveling Tooth Fairy",
  "The Underwater Orchestra",
  "Cereal Bowl Champions",
  "The Haunted Playroom (Not Too Scary)",
  "Space Pals: Mission Marshmallow",
  "The Friendly Kraken",
  "Jungle Jamboree",
  "The Kite Festival",
  "The Paper Airplane League",
  "Teddy Bear Detective Agency",
  "The Robot Who Learned to Laugh",
  "Skateboard Wizards",
  "The Great Paint‑Splash",
  "Sunny Side Stories",
  "The Lost Key of Wonder",
  "The Day the Moon Sneezed"
];

const MOVIE_PACK_MEMORIES = [
  "Somehow the popcorn becomes a family tradition and a minor upholstery crisis.",
  "You both start quoting the funniest line in the grocery store like it’s a secret handshake.",
  "They practice the dramatic trailer voice all the way home—every single time.",
  "Halfway through the year, they start ranking movies on a sticky‑note chart on the fridge.",
  "By the last outing, even the ticket clerk recognizes you and smiles.",
  "The theme song becomes a bedtime hum for a week.",
  "They insist on sitting in the 'best seat'—which mysteriously changes every visit.",
  "You discover that previews are basically their favorite part of the experience."
];

const ROAD_TRIP_PLACES = [
  "a lakeside town with a tiny main street",
  "the mountains for fresh air and bad cell service",
  "a beach where sand appears in impossible places",
  "a quirky roadside attraction you’ll both reference forever",
  "a museum weekend that turns into a snack tour",
  "a state fair full of questionable fried foods",
  "a cabin with creaky floors and perfect night skies",
  "a big city day trip where everything feels shiny and loud"
];

const ROAD_TRIP_HIGHLIGHTS = [
  "You play twenty questions until the questions get weird and hilarious.",
  "You make a playlist together and pretend you’re on a world tour.",
  "You take the wrong exit and accidentally find the best pie shop of the year.",
  "You stop for photos, then stop again because the next view is somehow better.",
  "They fall asleep for ten minutes, wake up, and announce they feel 'refreshed' like a tiny CEO.",
  "You keep a running tally of 'road trip snacks' and nobody agrees on the rules."
];

export default function OutingsModal({ open, onClose }) {
  const { gameState, consumeAction, spendMoney, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry, emitActionResult, pickFlavor, getLocalAmount, updateState, OUTING_ACTIVITY_PACK, performActivity, hasMinorChild } = useGameState();
  const { pendingScenario, finished, actionPoints, currentYear, yearFlags, specialStartId } = gameState;
  
  const isReliefMode = specialStartId === 'war_zone' || specialStartId === 'refugee_camp';
  const minorChildPresent = hasMinorChild(gameState);
  
  // Adult companion setup
  const roster = Array.isArray(gameState.relationships?.roster) ? gameState.relationships.roster : [];
  const bestFriend = roster.find(p => p.id === 'my_best_friend') || null;
  const hasPartner = gameState.householdType === 'two' && !!gameState.partnerName;
  
  const companionOptions = [
    { key: 'solo', label: 'Solo' },
    ...(hasPartner ? [{ key: 'partner', label: gameState.partnerName || 'Partner' }] : []),
    ...(bestFriend ? [{ key: 'friend', label: bestFriend.name || 'Best Friend' }] : []),
  ];
  
  const [companionKey, setCompanionKey] = React.useState(companionOptions[0]?.key || 'solo');
  
  const getCompanionName = () => {
    if (companionKey === 'partner') return gameState.partnerName || 'your partner';
    if (companionKey === 'friend') return bestFriend?.name || 'your best friend';
    return null;
  };
  
  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
  
  const bumpCompanionMeter = (delta) => {
    if (companionKey === 'partner' && hasPartner) {
      updateState(prev => ({ ...prev, partnerMeter: clamp(Number(prev.partnerMeter || 50) + delta) }));
    }
    if (companionKey === 'friend' && bestFriend) {
      updateState(prev => ({
        ...prev,
        relationships: {
          ...prev.relationships,
          roster: prev.relationships.roster.map(p => p.id === bestFriend.id ? { ...p, meter: clamp((p.meter || 50) + delta) } : p),
          byId: {
            ...prev.relationships.byId,
            my_best_friend: { ...(prev.relationships.byId.my_best_friend || bestFriend), meter: clamp(((prev.relationships.byId.my_best_friend || bestFriend).meter || 50) + delta) }
          }
        }
      }));
    }
  };

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

  const canUse = !pendingScenario && !finished && actionPoints >= 1;
  const moviePackCount = yearFlags?.bundle_moviePack || 0;
  const moviePackMax = 3;
  const canBuyMoviePack = canUse && moviePackCount < moviePackMax;

  const handleMovieTheater = async () => {
    if (moviePackCount >= moviePackMax) return;

    consumeAction('outings');
    const cost = getLocalAmount(ECONOMY_PRICES.movieNight);
    spendMoney(cost);

    // Bump bundle count
    updateState({ 
      yearFlags: { 
        ...yearFlags, 
        bundle_moviePack: moviePackCount + 1 
      } 
    });

    const moviesCount = Math.floor(Math.random() * (15 - 9 + 1)) + 9;
    const favoriteTitle = MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)];
    const memoryLine = MOVIE_PACK_MEMORIES[Math.floor(Math.random() * MOVIE_PACK_MEMORIES.length)];
    const childName = gameState.childName || "Child";

    applyLove(1, "Movie night");
    applyStress(-1, "Movie night");
    
    const logBody = `🎬 Movie Nights Pack: This year, ${childName} went to the movies ${moviesCount} times. Their favorite was "${favoriteTitle}". ${memoryLine}`;
    const logBodyWithHumor = appendHumor(logBody, 'moviePack', { childName, favoriteTitle });
    addLog(logBodyWithHumor);

    recordTimelineEntry({
      kind: "outing",
      title: "🎬 Movie Nights Pack",
      detail: logBodyWithHumor,
      deltas: null,
      moneyDelta: -cost,
      loveDelta: 1,
      stressDelta: -1
    });

    const popup = pickMissingActionPopup("outings", "moviePack");
    if (popup) {
      emitActionResult({
        actionId: "outings",
        title: popup.title,
        body: interpolatePopupText(popup.body, { 
          childName, 
          moviesCount, 
          favoriteTitle 
        }),
        deltas: null,
        moneyDelta: -cost,
        focusDelta: -1,
        loveDelta: 1,
        stressDelta: -1,
        tags: popup.tags,
        meta: { 
          emoji: popup.emoji,
          coachNote: "Rituals are relationship glue: same seats, same snacks, shared stories. Repetition turns “a movie” into “our thing” (popcorn diplomacy included)."
        }
      });
    }

    onClose();
  };

  const handleRoadTrip = () => {
    consumeAction('outings');
    const cost = getLocalAmount(ECONOMY_PRICES.roadTrip);
    spendMoney(cost);

    if (minorChildPresent) {
      // Child-centric version
      const deltas = { intelligence: 0, empathy: 1, discipline: 0, confidence: 1 };
      applyDeltas(deltas, "Road trip");
      applyLove(2, "Road trip");
      applyStress(-1, "Road trip");
      
      const place = ROAD_TRIP_PLACES[Math.floor(Math.random() * ROAD_TRIP_PLACES.length)];
      const highlight = ROAD_TRIP_HIGHLIGHTS[Math.floor(Math.random() * ROAD_TRIP_HIGHLIGHTS.length)];
      const childName = gameState.childName || "Child";

      const logBody = `🚗 Road Trip: You pack snacks, a playlist, and a slightly unrealistic sense of optimism. Over a long weekend, you and ${childName} road‑trip to ${place}. ${highlight} You come home tired‑happy, with new inside jokes and a phone full of photos.`;
      const logBodyWithHumor = appendHumor(logBody, 'roadTrip', { childName });
      
      addLog(logBodyWithHumor);

      recordTimelineEntry({
        kind: "outing",
        title: "Outing: Road Trip",
        detail: logBodyWithHumor,
        deltas,
        moneyDelta: -cost,
        loveDelta: 2,
        stressDelta: -1
      });

      const popup = pickMissingActionPopup("outings", "roadTrip");
      if (popup) {
        emitActionResult({
          actionId: "outings",
          title: popup.title,
          body: appendHumor(interpolatePopupText(popup.body, { 
            childName, 
            place, 
            highlight 
          }), 'roadTrip', { childName }),
          deltas,
          moneyDelta: -cost,
          focusDelta: -1,
          loveDelta: 2,
          stressDelta: -1,
          tags: popup.tags,
          meta: { 
            emoji: popup.emoji,
            coachNote: "Side‑by‑side time (no eye contact required) + tiny adventures build trust fast. Snacks and playlists lower defenses; memories do the rest."
          }
        });
      }
    } else {
      // Adult variant
      const companionName = getCompanionName();
      const deltas = { empathy: 0.3, confidence: 0.3 };
      applyDeltas(deltas, "Road trip");
      applyStress(-1.2, "Road trip");
      bumpCompanionMeter(3);
      
      const place = ROAD_TRIP_PLACES[Math.floor(Math.random() * ROAD_TRIP_PLACES.length)];
      const highlight = ROAD_TRIP_HIGHLIGHTS[Math.floor(Math.random() * ROAD_TRIP_HIGHLIGHTS.length)];

      const logBody = companionName
        ? `🚗 Road Trip: You and ${companionName} road‑trip to ${place}. ${highlight} You come home tired‑happy.`
        : `🚗 Road Trip: You road‑trip to ${place}. ${highlight} You come home tired‑happy.`;
      
      addLog(logBody);

      recordTimelineEntry({
        kind: "outing",
        title: "🚗 Road Trip",
        detail: logBody,
        deltas,
        moneyDelta: -cost,
        loveDelta: 0,
        stressDelta: -1.2,
        meta: { companionKey }
      });

      emitActionResult({
        actionId: "outings",
        title: "🚗 Road Trip",
        body: logBody,
        deltas,
        moneyDelta: -cost,
        focusDelta: -1,
        loveDelta: 0,
        stressDelta: -1.2,
        tags: ['outing', 'adult'],
        meta: { emoji: '🚗', companionKey }
      });
    }

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
                <h3 className="text-xl font-bold text-slate-800">
                  {specialStartId === 'war_zone' ? 'Outings (Safe Moments)' :
                   specialStartId === 'refugee_camp' ? 'Outings (Small Joys)' :
                   'Outings'}
                </h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Options List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Adult companion selector (only when no minor child) */}
                {!minorChildPresent && !isReliefMode && companionOptions.length > 1 && (
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 mb-2">Go with:</div>
                    <div className="flex gap-2">
                      {companionOptions.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setCompanionKey(opt.key)}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            companionKey === opt.key
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {isReliefMode ? (
                  <div className="space-y-3">
                    {/* Relief-appropriate outings */}
                    <button
                      onClick={() => {
                        consumeAction('outings');
                        applyLove(1, 'Candlelight Storytime');
                        applyStress(-1, 'Candlelight Storytime');
                        applyDeltas({ empathy: 1 }, 'Candlelight Storytime');
                        addLog('🕯️ Candlelight Storytime: A quiet night of stories by candlelight.');
                        recordTimelineEntry({ kind: 'outing', title: '🕯️ Candlelight Storytime', detail: 'A quiet night of stories by candlelight.', deltas: { empathy: 1 }, loveDelta: 1, stressDelta: -1, moneyDelta: 0 });
                        onClose();
                      }}
                      disabled={!canUse}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-800 mb-1">🕯️ Candlelight Storytime</div>
                      <div className="text-sm text-slate-600">A quiet night of stories by candlelight.</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        consumeAction('outings');
                        applyDeltas({ discipline: 1, empathy: 1, responsibility: 1 }, 'Aid Line + Kindness');
                        addLog('🧺 Aid Line + Kindness: Waiting in line together, helping others.');
                        recordTimelineEntry({ kind: 'outing', title: '🧺 Aid Line + Kindness', detail: 'Waiting in line together, helping others.', deltas: { discipline: 1, empathy: 1, responsibility: 1 }, loveDelta: 0, stressDelta: 0, moneyDelta: 0 });
                        onClose();
                      }}
                      disabled={!canUse}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-800 mb-1">🧺 Aid Line + Kindness</div>
                      <div className="text-sm text-slate-600">Waiting in line together, helping others.</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        consumeAction('outings');
                        applyLove(1, 'Makeshift Soccer Game');
                        applyDeltas({ confidence: 1, fitness: 1 }, 'Makeshift Soccer Game');
                        addLog('⚽ Makeshift Soccer Game: Playing with whatever you can find.');
                        recordTimelineEntry({ kind: 'outing', title: '⚽ Makeshift Soccer Game', detail: 'Playing with whatever you can find.', deltas: { confidence: 1, fitness: 1 }, loveDelta: 1, stressDelta: 0, moneyDelta: 0 });
                        onClose();
                      }}
                      disabled={!canUse}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-800 mb-1">⚽ Makeshift Soccer Game</div>
                      <div className="text-sm text-slate-600">Playing with whatever you can find.</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        consumeAction('outings');
                        applyDeltas({ intelligence: 1, curiosity: 1 }, 'Borrowed Book Day');
                        addLog('📚 Borrowed Book Day: Reading together from borrowed books.');
                        recordTimelineEntry({ kind: 'outing', title: '📚 Borrowed Book Day', detail: 'Reading together from borrowed books.', deltas: { intelligence: 1, curiosity: 1 }, loveDelta: 0, stressDelta: 0, moneyDelta: 0 });
                        onClose();
                      }}
                      disabled={!canUse}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-800 mb-1">📚 Borrowed Book Day</div>
                      <div className="text-sm text-slate-600">Reading together from borrowed books.</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        consumeAction('outings');
                        applyStress(-1, 'Quiet Nature Walk');
                        applyDeltas({ health: 1 }, 'Quiet Nature Walk');
                        addLog('🌿 Quiet Nature Walk: A peaceful walk away from the noise.');
                        recordTimelineEntry({ kind: 'outing', title: '🌿 Quiet Nature Walk', detail: 'A peaceful walk away from the noise.', deltas: { health: 1 }, loveDelta: 0, stressDelta: -1, moneyDelta: 0 });
                        onClose();
                      }}
                      disabled={!canUse}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-800 mb-1">🌿 Quiet Nature Walk</div>
                      <div className="text-sm text-slate-600">A peaceful walk away from the noise.</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        consumeAction('outings');
                        applyLove(1, 'Tea & Talk in the Shelter');
                        applyDeltas({ empathy: 1 }, 'Tea & Talk in the Shelter');
                        addLog('🧃 Tea & Talk in the Shelter: Simple moments of connection.');
                        recordTimelineEntry({ kind: 'outing', title: '🧃 Tea & Talk in the Shelter', detail: 'Simple moments of connection.', deltas: { empathy: 1 }, loveDelta: 1, stressDelta: 0, moneyDelta: 0 });
                        onClose();
                      }}
                      disabled={!canUse}
                      className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <div className="font-semibold text-slate-800 mb-1">🧃 Tea & Talk in the Shelter</div>
                      <div className="text-sm text-slate-600">Simple moments of connection.</div>
                    </button>
                  </div>
                ) : Object.entries(OUTING_ACTIVITY_PACK
                  .filter(opt => {
                    if (!opt.requiresItems || !Array.isArray(opt.requiresItems)) return true;
                    return opt.requiresItems.every(itemId => hasShopItem(gameState, itemId));
                  })
                  .reduce((acc, opt) => {
                  const g = opt.group || 'General';
                  if (!acc[g]) acc[g] = [];
                  acc[g].push(opt);
                  return acc;
                }, {})).map(([group, groupOptions]) => (
                  <div key={group} className="mb-6">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">{group}</h4>
                    <div className="space-y-3">
                      {groupOptions.sort((a,b) => (a.rank||999) - (b.rank||999)).map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            if (performActivity(option)) {
                              onClose();
                            }
                          }}
                          className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div className="font-semibold text-slate-800 mb-1 text-base">{option.title}</div>
                                <div className="flex flex-col items-end gap-1">
                                  {option.moneyCost > 0 && (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                      ${formatMoney(option.moneyCost)}
                                    </span>
                                  )}
                                  {option.moneyGain > 0 && (
                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                      +${formatMoney(option.moneyGain)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-slate-600 leading-relaxed">{option.subtitle}</div>
                              
                              <div className="flex flex-wrap gap-2 mt-2">
                                {option.focusCost > 1 && (
                                  <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                    {option.focusCost} Focus
                                  </span>
                                )}
                                {option.minAge > 0 && (
                                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                    Age {option.minAge}+
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}