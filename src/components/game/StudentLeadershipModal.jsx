import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Award, TrendingUp, Users } from 'lucide-react';

const LEADERSHIP_ROLES = [
  { id: "CLASS_PRESIDENT", label: "Class President" }
];

const LEADERSHIP_PLATFORMS = [
  {
    id: "listen_first",
    label: "🫶 Listen‑First Campaign",
    desc: "A calm platform: kindness, fairness, and actually hearing people.",
    bonus: 4,
    delta: { empathy: 0.4, confidence: 0.3, discipline: 0.1, intelligence: 0.1, love: 0.2, stress: 0.1 }
  },
  {
    id: "policy_nerd",
    label: "📋 Policy Nerd Platform",
    desc: "Detailed plans, good organization, fewer jokes.",
    bonus: 3,
    delta: { intelligence: 0.3, discipline: 0.3, confidence: 0.1, empathy: 0.0, love: 0.1, stress: 0.1 }
  },
  {
    id: "charisma",
    label: "🎤 Charisma & Speeches",
    desc: "Energy, confidence, and big 'we can do this' vibes.",
    bonus: 3,
    delta: { confidence: 0.5, empathy: 0.1, discipline: 0.0, intelligence: 0.0, love: 0.1, stress: 0.1 }
  },
  {
    id: "online_hype",
    label: "📱 Online Hype Campaign",
    desc: "Flashy posts, quick slogans, attention‑grabbing.",
    bonus: 1,
    delta: { confidence: 0.3, intelligence: 0.1, discipline: -0.2, empathy: -0.1, love: 0.0, stress: 0.2 }
  },
  {
    id: "smear",
    label: "🧨 Smear Campaign",
    desc: "Rumors, dunking, 'win at all costs.' (Damaging.)",
    bonus: -4,
    delta: { empathy: -0.8, confidence: 0.1, discipline: -0.3, intelligence: 0.0, love: -0.6, stress: 0.4 }
  }
];

const LEADERSHIP_FLAVOR = [
  "They practice speeches in the mirror like it's a movie trailer.",
  "They hand you a 'campaign badge' made from a sticky note.",
  "They take polls at dinner. You are not allowed to abstain.",
  "They insist debates require a 'microphone' (a banana).",
  "They rewrite their slogan seven times and call it 'strategy.'"
];

export default function StudentLeadershipModal({ open, onClose }) {
  const { gameState, updateState, applyDeltas, applyLove, applyStress, spendFocus, applyMoneyDelta, addLog, recordTimelineEntry } = useGameState();
  
  const [step, setStep] = useState('main');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [resultData, setResultData] = useState(null);

  const leadership = gameState.education?.studentLeadership || { ranByAge: {}, history: [], wonClassPresident: false, wonWithListenFirst: false, bestResultId: null };
  const ranThisAge = leadership.ranByAge[gameState.currentYear] || false;
  const lastEntry = leadership.history[leadership.history.length - 1];
  
  // Create seeded RNG
  const createRng = (seed) => {
    let state = seed;
    return {
      intBetween: (min, max) => {
        state |= 0;
        state = state + 0x6D2B79F5 | 0;
        let t = Math.imul(state ^ state >>> 15, 1 | state);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        const random = ((t ^ t >>> 14) >>> 0) / 4294967296;
        return Math.floor(random * (max - min + 1)) + min;
      }
    };
  };

  const handleStartCampaign = () => {
    setStep('select-platform');
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setStep('confirm');
  };

  const handleSubmit = () => {
    // Deduct focus + money
    if (gameState.actionPoints < 1) {
      addLog("⏳ Not enough focus for Student Leadership.");
      return;
    }
    
    spendFocus(1, "Student Leadership");
    applyMoneyDelta(-120, "Campaign supplies");
    
    // Calculate score
    const stats = gameState.stats;
    const base = 
      0.35 * stats.confidence +
      0.30 * stats.empathy +
      0.20 * stats.intelligence +
      0.15 * stats.discipline;
    
    const platformBonus = selectedPlatform.bonus;
    const primaryInterest = gameState.childProfile?.primaryInterest;
    const fitBonus = primaryInterest === 'PEOPLE' ? 2 : 0;
    
    const rngSeed = gameState.runSeed + gameState.currentYear * 1000 + selectedPlatform.id.length * 100;
    const rng = createRng(rngSeed);
    const rngJitter = rng.intBetween(-2, 2);
    
    const score = base + platformBonus + fitBonus + rngJitter;
    
    // Determine result
    let resultId = "NO_PLACE";
    if (score >= 46) resultId = "WIN";
    else if (score >= 42) resultId = "PLACE";
    
    // Update state
    let wonClassPresident = leadership.wonClassPresident;
    let wonWithListenFirst = leadership.wonWithListenFirst;
    
    if (resultId === "WIN") {
      wonClassPresident = true;
      if (selectedPlatform.id === "listen_first") {
        wonWithListenFirst = true;
      }
    }
    
    // Record history
    const historyEntry = {
      age: gameState.currentYear,
      roleId: "CLASS_PRESIDENT",
      platformId: selectedPlatform.id,
      score: Math.round(score),
      resultId,
      won: resultId === "WIN"
    };
    
    // Apply platform deltas
    applyDeltas(selectedPlatform.delta, "Student Leadership");
    if (selectedPlatform.delta.love) applyLove(selectedPlatform.delta.love, "Student Leadership");
    if (selectedPlatform.delta.stress) applyStress(selectedPlatform.delta.stress, "Student Leadership");
    
    // Apply result deltas
    const resultDeltas = {
      NO_PLACE: { confidence: 0.1, discipline: 0.1, intelligence: 0, empathy: 0 },
      PLACE: { confidence: 0.3, empathy: 0.2, discipline: 0, intelligence: 0 },
      WIN: { confidence: 0.6, empathy: 0.3, discipline: 0.2, intelligence: 0.2 }
    };
    
    applyDeltas(resultDeltas[resultId], "Election result");
    
    // Additional love for WIN
    if (resultId === "WIN") {
      applyLove(0.2, "Election result");
    }
    
    // Update leadership state
    updateState({
      education: {
        ...gameState.education,
        studentLeadership: {
          ranByAge: { ...leadership.ranByAge, [gameState.currentYear]: true },
          history: [...leadership.history, historyEntry],
          wonClassPresident,
          wonWithListenFirst,
          bestResultId: resultId === "WIN" ? "WIN" : leadership.bestResultId
        }
      }
    });
    
    // Record timeline entries
    recordTimelineEntry({
      age: gameState.currentYear,
      kind: "LEADERSHIP",
      title: "🗳️ Ran for Class President",
      detail: `Platform: ${selectedPlatform.label}`,
      deltas: null,
      moneyDelta: -120,
      loveDelta: 0,
      stressDelta: 0,
      meta: { age: gameState.currentYear, roleId: "CLASS_PRESIDENT", platformId: selectedPlatform.id, score: Math.round(score) }
    });
    
    const resultTitles = {
      NO_PLACE: "🗳️ Election Result: Not Elected",
      PLACE: "🗳️ Election Result: Placed",
      WIN: "🏆 Election Result: Class President"
    };
    
    const resultDetails = {
      NO_PLACE: "They didn't win, but they showed courage by trying.",
      PLACE: "They didn't win, but people noticed.",
      WIN: "They won. Responsibility begins."
    };
    
    recordTimelineEntry({
      age: gameState.currentYear,
      kind: "LEADERSHIP_RESULT",
      title: resultTitles[resultId],
      detail: resultDetails[resultId],
      deltas: resultDeltas[resultId],
      moneyDelta: 0,
      loveDelta: resultId === "WIN" ? 0.2 : 0,
      stressDelta: 0,
      meta: { age: gameState.currentYear, resultId, won: resultId === "WIN" }
    });
    
    // Pick flavor text
    const flavorIndex = rng.intBetween(0, LEADERSHIP_FLAVOR.length - 1);
    const flavorText = LEADERSHIP_FLAVOR[flavorIndex];
    
    // Show results
    setResultData({
      resultId,
      resultText: resultDetails[resultId],
      flavorText
    });
    
    setStep('results');
  };

  const handleResultsClose = () => {
    setStep('main');
    setSelectedPlatform(null);
    setResultData(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Student Leadership
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-600 mb-2">
                    Elections are practice—confidence, empathy, and choices under pressure.
                  </div>
                  {leadership.wonClassPresident && (
                    <div className="mt-2 text-sm text-emerald-700 font-semibold">
                      ⭐ Won Class President
                    </div>
                  )}
                </div>

                {ranThisAge ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                    <div className="text-sm text-green-800 font-medium mb-2">✅ Already ran this year</div>
                    {lastEntry && (
                      <div className="text-xs text-green-700 space-y-1">
                        <div>Role: Class President</div>
                        <div>Platform: {LEADERSHIP_PLATFORMS.find(p => p.id === lastEntry.platformId)?.label}</div>
                        <div>Result: {lastEntry.resultId === "WIN" ? "Winner" : lastEntry.resultId === "PLACE" ? "Placed" : "Not Elected"}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-amber-800">
                      <div className="font-medium mb-1">Cost</div>
                      <div>1 Focus + $120 (posters, snacks, supplies)</div>
                    </div>
                    
                    <Button 
                      onClick={handleStartCampaign}
                      disabled={gameState.actionPoints < 1}
                      className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Run for Class President
                    </Button>
                    
                    {gameState.actionPoints < 1 && (
                      <div className="text-xs text-center text-red-600">Need 1 Focus</div>
                    )}
                  </>
                )}
                
                {leadership.history.length > 0 && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      History
                    </div>
                    <div className="space-y-2">
                      {leadership.history.map((entry, idx) => (
                        <div key={idx} className="text-xs bg-slate-50 p-2 rounded-lg">
                          <div className="font-medium">Age {entry.age} • Class President</div>
                          <div className="text-slate-600">{entry.resultId === "WIN" ? "🏆 Winner" : entry.resultId === "PLACE" ? "🗳️ Placed" : "📝 Not Elected"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'select-platform' && (
            <motion.div
              key="platform"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>Choose Your Platform</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-2">
                {LEADERSHIP_PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform)}
                    className={`w-full p-3 text-left rounded-xl border-2 transition-all ${
                      platform.id === 'smear' 
                        ? 'border-red-300 hover:border-red-500 hover:bg-red-50' 
                        : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="font-medium text-slate-800">{platform.label}</div>
                    <div className="text-xs text-slate-600 mt-1">{platform.desc}</div>
                    {platform.id === 'smear' && (
                      <div className="text-xs text-red-600 font-semibold mt-1">⚠️ Harmful choice</div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Ready to Campaign?</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                  <div><span className="font-medium">Role:</span> Class President</div>
                  <div><span className="font-medium">Platform:</span> {selectedPlatform.label}</div>
                  <div className="pt-2 border-t border-slate-200 text-amber-700 font-medium">
                    Total Cost: 1 Focus + $120
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-indigo-500 to-violet-500">
                  Start Campaign
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'results' && resultData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  🗳️ Election Results
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-xl space-y-3">
                  <div className="text-sm text-slate-600">Role: <span className="font-semibold">Class President</span></div>
                  <div className="text-lg font-bold text-indigo-700 mt-3">
                    {resultData.resultId === "WIN" ? "🏆 Winner!" : resultData.resultId === "PLACE" ? "🗳️ Placed!" : "📝 Not elected"}
                  </div>
                  <div className="text-sm text-slate-700">{resultData.resultText}</div>
                  <div className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-200">
                    {resultData.flavorText}
                  </div>
                </div>
                <Button onClick={handleResultsClose} className="w-full">Nice</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}