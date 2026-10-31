import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Award, TrendingUp, Beaker } from 'lucide-react';

const SCI_FAIR_LEVELS = [
  { id: "LOCAL", label: "Local Science Fair" },
  { id: "REGIONAL", label: "Regional Science Fair" },
  { id: "STATE", label: "State Science Fair" },
  { id: "NATIONAL", label: "National Science Fair" }
];

const SCI_FAIR_PROJECTS = [
  { id: "rocket-nozzle", name: "Model Rocket Nozzle Test", tags: ["SPACE", "BUILDING"] },
  { id: "mars-soil", name: "Mars Soil Simulation (Safe Chemistry)", tags: ["SPACE"] },
  { id: "plant-light", name: "Plants & Light: Growth Experiment", tags: ["ANIMALS"] },
  { id: "bridge-strength", name: "Bridge Strength Challenge", tags: ["BUILDING"] },
  { id: "clean-water", name: "Simple Clean Water Filter Prototype", tags: ["PEOPLE", "BUILDING"] },
  { id: "sound-waves", name: "Sound Waves & Vibration Art", tags: ["ART"] },
  { id: "robot-sensor", name: "Tiny Robot Sensor Maze", tags: ["SPACE", "BUILDING"] },
  { id: "empathy-study", name: "Kindness Experiment (Consent + Surveys)", tags: ["PEOPLE"] }
];

const SCI_FAIR_SUPPORT = [
  { 
    id: "mentor", 
    label: "🧠 Co-build & mentor patiently", 
    bonus: 3, 
    delta: { intelligence: 0.4, discipline: 0.2, confidence: 0.2, empathy: 0.2, love: 0.3, stress: 0.1 },
    coachNote: "You supported without stealing the steering wheel. Ownership keeps curiosity alive (and reduces 11pm meltdown odds)."
  },
  { 
    id: "present", 
    label: "🎤 Practice the presentation together", 
    bonus: 2, 
    delta: { confidence: 0.5, empathy: 0.2, discipline: 0.1, intelligence: 0.2, love: 0.2, stress: 0.1 },
    coachNote: "Reps make scary things familiar. Practice turns nerves into “I’ve done this before.”"
  },
  { 
    id: "coach", 
    label: "💼 Hire a science coach (money)", 
    bonus: 4, 
    costs: { money: 600 }, 
    delta: { intelligence: 0.5, discipline: 0.2, confidence: 0.1, empathy: 0.0, love: 0.1, stress: 0.0 },
    coachNote: "Outside expertise boosts skills without making you the bad cop. More structure, less drama."
  },
  { 
    id: "lead", 
    label: "🧩 Let them lead; you supervise lightly", 
    bonus: 1, 
    delta: { discipline: 0.2, confidence: 0.2, intelligence: 0.2, empathy: 0.1, love: 0.1, stress: 0.0 },
    coachNote: "When it’s their project, they persist longer. Light supervision = safety + autonomy."
  },
  { 
    id: "pressure", 
    label: "😡 Pressure them to 'win' and micromanage", 
    bonus: -3, 
    delta: { empathy: -0.6, confidence: -0.4, discipline: -0.2, intelligence: 0.0, love: -0.6, stress: 0.5 },
    backfireNote: "When winning becomes the point, curiosity dies. Micromanaging says “I don’t trust you,” so stress spikes and motivation leaks out."
  }
];

const SCI_FAIR_FLAVOR = [
  "They take the project absurdly seriously… including a lab coat made from an old t-shirt.",
  "They name the project like it's a superhero: 'Operation: Extremely Scientific.'",
  "They practice explaining it to a stuffed animal and demand applause after every slide.",
  "They ask, very sincerely, if their volcano can get a LinkedIn profile.",
  "They insist the tri-fold board needs a 'dramatic reveal.'"
];

function ScienceFairModal({ open, onClose }) {
  const { gameState, updateState, applyDeltas, applyLove, applyStress, spendFocus, applyMoneyDelta, addLog, recordTimelineEntry } = useGameState();
  
  const [step, setStep] = useState('main'); // main | select-project | select-support | results
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [resultData, setResultData] = useState(null);

  const scienceFair = gameState.education?.scienceFair || { levelIndex: 0, history: [], submittedByAge: {}, wonNational: false };
  const currentLevel = SCI_FAIR_LEVELS[scienceFair.levelIndex];
  const submittedThisAge = scienceFair.submittedByAge[gameState.currentYear] || false;
  const lastEntry = scienceFair.history[scienceFair.history.length - 1];
  
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

  const handleStartFair = () => {
    setStep('select-project');
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setStep('select-support');
  };

  const handleSupportSelect = (support) => {
    setSelectedSupport(support);
    setStep('submit');
  };

  const handleSubmit = () => {
    // Deduct focus + money
    if (gameState.actionPoints < 1) {
      addLog("⏳ Not enough focus for Science Fair.");
      return;
    }
    
    spendFocus(1, "Science Fair");
    applyMoneyDelta(-150, "Science Fair materials");
    
    // Deduct coach cost if applicable
    if (selectedSupport.costs?.money) {
      applyMoneyDelta(-selectedSupport.costs.money, "Science coach");
    }
    
    // Calculate score
    const stats = gameState.stats;
    const base = 
      0.50 * stats.intelligence +
      0.20 * stats.discipline +
      0.20 * stats.confidence +
      0.10 * stats.empathy;
    
    const supportBonus = selectedSupport.bonus;
    
    const primaryInterest = gameState.childProfile?.primaryInterest;
    const fitBonus = selectedProject.tags.includes(primaryInterest) ? 2 : 0;
    
    const rngSeed = gameState.runSeed + gameState.currentYear * 1000 + selectedProject.id.length * 100;
    const rng = createRng(rngSeed);
    const rngJitter = rng.intBetween(-2, 2);
    
    const score = base + supportBonus + fitBonus + rngJitter;
    
    // Determine thresholds
    const thresholds = [
      { level: "LOCAL", place: 22, win: 26 },
      { level: "REGIONAL", place: 28, win: 32 },
      { level: "STATE", place: 34, win: 38 },
      { level: "NATIONAL", place: 40, win: 44 }
    ];
    
    const threshold = thresholds[scienceFair.levelIndex];
    let resultId = "NO_PLACE";
    if (score >= threshold.win) resultId = "WIN";
    else if (score >= threshold.place) resultId = "PLACE";
    
    // Update level if win
    let newLevelIndex = scienceFair.levelIndex;
    let wonNational = scienceFair.wonNational;
    
    if (resultId === "WIN") {
      if (scienceFair.levelIndex < 3) {
        newLevelIndex = scienceFair.levelIndex + 1;
      }
      if (scienceFair.levelIndex === 3) {
        wonNational = true;
      }
    }
    
    // Record history
    const historyEntry = {
      age: gameState.currentYear,
      levelId: currentLevel.id,
      projectId: selectedProject.id,
      supportId: selectedSupport.id,
      score: Math.round(score),
      resultId,
      won: resultId === "WIN"
    };
    
    // Apply support deltas
    applyDeltas(selectedSupport.delta, "Science Fair");
    if (selectedSupport.delta.love) applyLove(selectedSupport.delta.love, "Science Fair");
    if (selectedSupport.delta.stress) applyStress(selectedSupport.delta.stress, "Science Fair");
    
    // Apply result deltas
    const resultDeltas = {
      NO_PLACE: { confidence: 0.1, discipline: 0.1, intelligence: 0, empathy: 0 },
      PLACE: { confidence: 0.3, intelligence: 0.2, discipline: 0, empathy: 0 },
      WIN: { confidence: 0.6, intelligence: 0.4, discipline: 0.2, empathy: 0.1 }
    };
    
    applyDeltas(resultDeltas[resultId], "Science Fair result");
    
    // Update science fair state
    updateState({
      education: {
        ...gameState.education,
        scienceFair: {
          levelIndex: newLevelIndex,
          history: [...scienceFair.history, historyEntry],
          submittedByAge: { ...scienceFair.submittedByAge, [gameState.currentYear]: true },
          wonNational,
          bestResultId: resultId === "WIN" ? (scienceFair.levelIndex === 3 ? "NATIONAL_CHAMPION" : "WIN") : scienceFair.bestResultId
        }
      }
    });
    
    // Record timeline entries
    recordTimelineEntry({
      age: gameState.currentYear,
      kind: "SCI_FAIR",
      title: `🧪 Science Fair: ${currentLevel.label}`,
      detail: `Project: ${selectedProject.name} • Support: ${selectedSupport.label.replace(/^[^\s]+\s/, '')}`,
      deltas: null,
      moneyDelta: -150 - (selectedSupport.costs?.money || 0),
      loveDelta: 0,
      stressDelta: 0,
      meta: { age: gameState.currentYear, levelId: currentLevel.id, projectId: selectedProject.id, supportId: selectedSupport.id, score: Math.round(score), resultId }
    });
    
    const resultTitles = {
      NO_PLACE: "🧪 Science Fair Result: No Prize",
      PLACE: "🧪 Science Fair Result: Placed",
      WIN: "🏆 Science Fair Result: Winner"
    };
    
    const resultDetails = {
      NO_PLACE: "They didn't place—but they finished and learned.",
      PLACE: "They placed. Confidence rises.",
      WIN: newLevelIndex === 4 ? "National Champion. The whole room notices." : "They won and advance to the next level."
    };
    
    recordTimelineEntry({
      age: gameState.currentYear,
      kind: "SCI_FAIR_RESULT",
      title: resultTitles[resultId],
      detail: resultDetails[resultId],
      deltas: resultDeltas[resultId],
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { age: gameState.currentYear, levelId: currentLevel.id, resultId, wonNational }
    });
    
    // Unlock trophy if National Champion
    if (wonNational && resultId === "WIN") {
      const trophies = gameState.trophies || { unlocked: {} };
      if (!trophies.unlocked.science_fair_champion) {
        updateState({
          trophies: {
            unlocked: {
              ...trophies.unlocked,
              science_fair_champion: {
                unlockedAtAge: gameState.currentYear,
                unlockedAtYear: gameState.currentYear,
                note: "National Science Fair Champion"
              }
            }
          }
        });
        
        addLog("🏆 Trophy Unlocked: Science Fair Champion");
        
        recordTimelineEntry({
          age: gameState.currentYear,
          kind: "system",
          title: "🏆 Trophy Unlocked: Science Fair Champion",
          detail: "Your child won the National Science Fair.",
          deltas: null,
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 0
        });
      }
    }
    
    // Pick flavor text
    const flavorIndex = rng.intBetween(0, SCI_FAIR_FLAVOR.length - 1);
    const flavorText = SCI_FAIR_FLAVOR[flavorIndex];
    
    // Show results
    setResultData({
      levelLabel: currentLevel.label,
      projectName: selectedProject.name,
      resultId,
      resultText: resultDetails[resultId],
      flavorText,
      wonNational
    });
    
    setStep('results');
  };

  const handleResultsClose = () => {
    setStep('main');
    setSelectedProject(null);
    setSelectedSupport(null);
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
                  <Beaker className="w-5 h-5 text-blue-500" />
                  Science Fair
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-700">Current Level</span>
                  </div>
                  <div className="text-lg font-bold text-indigo-700">{currentLevel.label}</div>
                  {scienceFair.wonNational && (
                    <div className="mt-2 text-sm text-amber-700 font-semibold">
                      ⭐ National Champion
                    </div>
                  )}
                </div>

                {submittedThisAge ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                    <div className="text-sm text-green-800 font-medium mb-2">✅ Already submitted this year</div>
                    {lastEntry && (
                      <div className="text-xs text-green-700 space-y-1">
                        <div>Level: {SCI_FAIR_LEVELS.find(l => l.id === lastEntry.levelId)?.label}</div>
                        <div>Project: {SCI_FAIR_PROJECTS.find(p => p.id === lastEntry.projectId)?.name}</div>
                        <div>Result: {lastEntry.resultId === "WIN" ? "Winner" : lastEntry.resultId === "PLACE" ? "Placed" : "No Prize"}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-amber-800">
                      <div className="font-medium mb-1">Cost</div>
                      <div>1 Focus + $150 materials</div>
                    </div>
                    
                    <Button 
                      onClick={handleStartFair}
                      disabled={gameState.actionPoints < 1}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      <Beaker className="w-4 h-4 mr-2" />
                      Enter this year's fair
                    </Button>
                    
                    {gameState.actionPoints < 1 && (
                      <div className="text-xs text-center text-red-600">Need 1 Focus</div>
                    )}
                  </>
                )}
                
                {scienceFair.history.length > 0 && (
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      History
                    </div>
                    <div className="space-y-2">
                      {scienceFair.history.map((entry, idx) => (
                        <div key={idx} className="text-xs bg-slate-50 p-2 rounded-lg">
                          <div className="font-medium">Age {entry.age} • {SCI_FAIR_LEVELS.find(l => l.id === entry.levelId)?.label}</div>
                          <div className="text-slate-600">{entry.resultId === "WIN" ? "🏆 Winner" : entry.resultId === "PLACE" ? "🥈 Placed" : "📝 No Prize"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'select-project' && (
            <motion.div
              key="project"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>Choose Your Project</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-2">
                {SCI_FAIR_PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    className="w-full p-3 text-left rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="font-medium text-slate-800">{project.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {project.tags.includes(gameState.childProfile?.primaryInterest) && (
                        <span className="text-blue-600 font-semibold">✓ Fits interest</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'select-support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>Choose Support Style</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-2">
                {SCI_FAIR_SUPPORT.map((support) => (
                  <button
                    key={support.id}
                    onClick={() => handleSupportSelect(support)}
                    className="w-full p-3 text-left rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="font-medium text-slate-800">{support.label}</div>
                    {support.costs?.money && (
                      <div className="text-xs text-amber-600 mt-1">+${support.costs.money}</div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'submit' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Ready to Submit?</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                  <div><span className="font-medium">Level:</span> {currentLevel.label}</div>
                  <div><span className="font-medium">Project:</span> {selectedProject.name}</div>
                  <div><span className="font-medium">Support:</span> {selectedSupport.label.replace(/^[^\s]+\s/, '')}</div>
                  <div className="pt-2 border-t border-slate-200 text-amber-700 font-medium">
                    Total Cost: 1 Focus + ${150 + (selectedSupport.costs?.money || 0)}
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">
                  Submit Project
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
                  🧪 Science Fair — Results
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl space-y-3">
                  <div className="text-sm text-slate-600">Level: <span className="font-semibold">{resultData.levelLabel}</span></div>
                  <div className="text-sm text-slate-600">Project: <span className="font-semibold">{resultData.projectName}</span></div>
                  <div className="text-lg font-bold text-indigo-700 mt-3">
                    {resultData.resultId === "WIN" ? "🏆 Winner!" : resultData.resultId === "PLACE" ? "🥈 Placed!" : "📝 No Prize"}
                  </div>
                  <div className="text-sm text-slate-700">{resultData.resultText}</div>
                  {resultData.wonNational && (
                    <div className="text-base font-bold text-amber-700 mt-3">
                      ⭐ National Champion
                    </div>
                  )}
                  <div className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-200">
                    {resultData.flavorText}
                  </div>
                </div>

                {/* Explainer Notes */}
                {(selectedSupport.coachNote || selectedSupport.backfireNote) && (
                  <div className="space-y-2">
                    {selectedSupport.coachNote && (
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <p className="text-xs font-semibold text-purple-800 mb-1">💡 Why this worked</p>
                        <p className="text-xs text-purple-700 leading-relaxed">{selectedSupport.coachNote}</p>
                      </div>
                    )}
                    {selectedSupport.backfireNote && (
                      <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                        <p className="text-xs font-semibold text-rose-800 mb-1">⚠️ Why this backfired</p>
                        <p className="text-xs text-rose-700 leading-relaxed">{selectedSupport.backfireNote}</p>
                      </div>
                    )}
                  </div>
                )}

                <Button onClick={handleResultsClose} className="w-full">Nice</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export default ScienceFairModal;