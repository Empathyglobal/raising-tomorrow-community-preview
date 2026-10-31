import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, ECONOMY_PRICES, formatMoney } from './GameStateContext';

const PLAYDATE_HIGHLIGHTS_BABY = [
  "They engage in 'parallel play,' which mostly involves chewing on similar blocks while ignoring each other.",
  "They trade sippy cups like illicit contraband.",
  "A fight breaks out over a piece of lint. You and the other parent negotiate a treaty.",
  "They stare at each other intensely for 4 minutes, then one of them falls over. It is a bonding experience.",
  "One screams. The other screams in solidarity. It’s a very loud friendship.",
  "They successfully pass a soggy cracker back and forth. Teamwork."
];

const PLAYDATE_HIGHLIGHTS_KID = [
  "They build a blanket fort with an HOA, a snack bar, and very serious rules.",
  "A craft project ends with glitter in a place you didn’t know glitter could reach.",
  "They whisper secrets like it’s a spy mission, then immediately announce them at full volume.",
  "They argue for two minutes, then become best friends again over a single gummy bear.",
  "They invent a game called 'Floor Is Lava: Deluxe Edition' and declare you the official referee.",
  "They start a 'club' with membership cards and surprisingly strict bylaws.",
  "You discover your child is actually great at sharing when they feel safe.",
  "They choreograph a dance that is mostly joy and physics."
];

import { appendHumor } from './humorUtils';

export default function PlaydatesModal({ open, onClose }) {
  const { gameState, consumeAction, applyMoneyDelta, applyDeltas, addLog, recordTimelineEntry, applyPeerCircle, getAvailability, emitActionResult, getLocalAmount, updateState, seededPick } = useGameState();
  const friendNames = Array.isArray(gameState.friendNames) ? gameState.friendNames : [];
  const yearFlags = (gameState.yearFlags && typeof gameState.yearFlags === 'object') ? gameState.yearFlags : {};
  
  // Random names for when you have no friends yet
  const RANDOM_PLAYDATE_NAMES = ["Alex", "Jordan", "Taylor", "Casey", "Riley", "Avery", "Parker", "Quinn", "Rowan", "Sage"];
  
  // Parent interaction snippets - strictly enforcing "Child's Parent" naming
  const PARENT_INTERACTIONS = [
    "The other parent waves. 'Hey, {childName}'s {parentRole}!' they call out. You realize they definitely don't know your real name. It’s fine. You don’t know theirs either.",
    "You save them in your phone as '{friendName}'s {parentRole} (Playdate).' It’s the only identity that matters right now.",
    "They introduce you to someone else: 'And this is {childName}'s {parentRole}.' You nod. That is your full legal title in this park.",
    "You spend two hours talking about sleep schedules with {friendName}'s parent. At the end, they say, 'See you next week, {childName}'s {parentRole}!' You are best friends who will never know each other's first names.",
    "A small child tugs your sleeve. 'Excuse me, {childName}'s {parentRole}?' You are no longer a person; you are a service provider.",
    "The other parent nods at you. '{friendName}'s dad,' he says, pointing to himself. '{childName}'s {parentRole}?' You nod. The alliance is formed."
  ];

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

  const avail = getAvailability('playdates');
  const playdatePackCount = yearFlags?.bundle_playdatePack || 0;
  const playdatePackMax = 3;
  
  const canUse = avail.enabled && playdatePackCount < playdatePackMax;

  const handlePlaydate = (friendName) => {
    if (playdatePackCount >= playdatePackMax) return;

    consumeAction('playdates');
    const cost = getLocalAmount(ECONOMY_PRICES.playdate);
    applyMoneyDelta(-cost);

    // Bump bundle count
    updateState({ 
      yearFlags: { 
        ...yearFlags, 
        bundle_playdatePack: playdatePackCount + 1 
      } 
    });

    const playdatesCount = Math.floor(Math.random() * (15 - 9 + 1)) + 9;
    
    // Select age-appropriate highlights
    const age = gameState.currentYear || 0;
    const pool = age < 3 ? PLAYDATE_HIGHLIGHTS_BABY : PLAYDATE_HIGHLIGHTS_KID;
    const highlight = pool[Math.floor(Math.random() * pool.length)];
    
    const childName = gameState.childName || "Child";
    const parentRole = gameState.parentRole === 'dad' ? 'Dad' : 'Mom'; // Capitalized for the title

    // Pick a parent interaction snippet
    const parentInteractionTemplate = PARENT_INTERACTIONS[Math.floor(Math.random() * PARENT_INTERACTIONS.length)];
    const parentInteraction = parentInteractionTemplate
      .replace(/{friendName}/g, friendName)
      .replace(/{childName}/g, childName)
      .replace(/{parentRole}/g, parentRole);

    applyDeltas({ empathy: 1, confidence: 1, intelligence: 0, discipline: 0 }, "Playdate");
    applyPeerCircle(1, "Playdate");

    const logBody = `👯 Playdate Pack: This year, ${childName} had ${playdatesCount} playdates with ${friendName}. ${highlight}\n\n${parentInteraction}`;

    emitActionResult({
      actionId: 'playdates',
      title: `Playdate Pack (${friendName})`,
      body: appendHumor(logBody, 'parkPositive', { childName }, '😄 '),
      deltas: { empathy: 1, confidence: 1, intelligence: 0, discipline: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: -cost,
      focusDelta: -1,
      tags: ['relationship', 'social'],
      meta: { 
        emoji: '🤝', 
        friendName,
        coachNote: `Playdates are social-skill reps: sharing, repair, and confidence in low‑stakes chaos. Also, you survived as “${childName}’s ${parentRole}” — character growth for everyone.`
      }
    });

    // Record timeline entry (was missing)
    recordTimelineEntry({
      kind: "outing",
      title: "Playdate Pack",
      detail: appendHumor(logBody, 'parkPositive', { childName }, '😄 '),
      deltas: { empathy: 1, confidence: 1, intelligence: 0, discipline: 0 },
      moneyDelta: -cost,
      loveDelta: 0,
      stressDelta: 0
    });

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
                <h3 className="text-xl font-bold text-slate-800">Playdates</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {friendNames.length === 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-500 mb-2">
                      {gameState.currentYear < 3 
                        ? "You don't need 'friends' yet—you just need another parent who is also awake." 
                        : "No school friends yet? No problem. The park is full of potential playdates."}
                    </div>
                    {/* Park Playdate Option */}
                    <button
                      onClick={() => handlePlaydate(seededPick(RANDOM_PLAYDATE_NAMES, `park_friend_${gameState.currentYear}`, gameState.runSeed))}
                      disabled={!canUse}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        !canUse
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">🌳</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">
                            {gameState.currentYear < 3 ? "Find a 'Stroller Friend'" : "Find a Playdate at the Park"}
                          </div>
                          <div className="text-sm text-slate-600 leading-relaxed mb-2">
                            {gameState.currentYear < 3 
                              ? "Meet a random baby (and their exhausted parent). 9–15 meetups. You will bond over sleep deprivation." 
                              : "Meet a random kid. 9–15 playdates. EMP +1, CON +1. Requires zero prior social skills."}
                          </div>
                          <div className="flex gap-2 items-center flex-wrap">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Cost: ${formatMoney(getLocalAmount(ECONOMY_PRICES.playdate))}
                            </div>
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                              Focus: 1
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {friendNames.map((name, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePlaydate(name)}
                        disabled={!canUse}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                          !canUse
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl flex-shrink-0">🤝</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 mb-1 text-base">Playdate Pack with {name}</div>
                            <div className="text-sm text-slate-600 leading-relaxed mb-2">
                              9–15 playdates. EMP +1, CON +1, Peer Circle +1
                            </div>
                            <div className="flex gap-2 items-center flex-wrap">
                              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                Cost: ${formatMoney(getLocalAmount(ECONOMY_PRICES.playdate))}
                              </div>
                              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                                Focus: 1
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {!canUse && friendNames.length > 0 && (
                  <div className="text-xs text-slate-400 mt-3 text-center">
                    {playdatePackCount >= playdatePackMax 
                      ? `Playdate Packs used this year: ${playdatePackCount}/${playdatePackMax}`
                      : (avail.reason || "Unavailable right now")}
                  </div>
                )}
                {canUse && friendNames.length > 0 && (
                  <div className="text-xs text-slate-400 mt-3 text-center">
                    Pack purchases left this year: {Math.max(0, playdatePackMax - playdatePackCount)}
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