import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { splitScenarioText } from './scenarioTextUtils';

const choiceLabels = ['A', 'B', 'C', 'D', 'E'];

function ChoiceButton({ choice, onSelect, isValid }) {
  const { getActiveChoice } = useGameState();
  const active = getActiveChoice(choice);
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [active.text]);

  const handleChoose = () => {
    setShowModal(false);
    onSelect(choice);
  };

  return (
    <>
      <button
        onClick={() => isTruncated ? setShowModal(true) : onSelect(choice)}
        disabled={!isValid}
        className="w-full bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 rounded-xl p-3.5 transition-all text-left disabled:opacity-50"
      >
        <div className="flex items-start gap-2.5 w-full min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-slate-500">{active.letter}</span>
          </div>
          <div className="text-lg flex-shrink-0 leading-none pt-0.5">{active.emoji}</div>
          <div className="flex-1 min-w-0">
            <p
              ref={textRef}
              className="text-slate-700 text-sm leading-relaxed whitespace-normal break-words overflow-wrap-anywhere line-clamp-3"
            >
              {active.text}
            </p>
            {isTruncated && (
              <span className="text-xs text-amber-600 font-medium mt-1 inline-block">More…</span>
            )}
          </div>
        </div>
      </button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{active.emoji}</span>
              <span>Choice {active.letter}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700 leading-relaxed">{active.text}</p>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleChoose} className="flex-1 bg-amber-500 hover:bg-amber-600">
              Choose this
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ChoicesCard() {
  const { 
    gameState, 
    applyDeltas, 
    addLog, 
    addHistory, 
    incrementCounter, 
    updateState,
    getActiveChoice,
    seededPick,
    completeYearScenario
  } = useGameState();
  
  const { pendingScenario, currentScenario, currentYear, endAge, actionPoints } = gameState;
  
  // Split scenario text from prompt
  const { body, prompt } = splitScenarioText(currentScenario?.scenarioText);
  
  // Vary prompt heading
  const fallbackPrompts = [
    "Your move.",
    "How do you respond?",
    "What happens next?",
    "Choose your response.",
    "How do you handle it?",
    "What do you say?"
  ];
  const promptHeading = prompt || seededPick(fallbackPrompts, `choicesCardPrompt|${currentScenario?.id}`, gameState.runSeed);

  if (!pendingScenario || !currentScenario?.choices) {
    return null;
  }

  // Validate scenario structure
  const isValid = 
    currentScenario.choices?.length === 5 &&
    currentScenario.choices.every((choice, idx) => choice.letter === choiceLabels[idx]);

  const handleChoice = (choice) => {
    // Get active choice (variant if technique unlocked)
    const active = getActiveChoice(choice);
    
    // Apply stat deltas
    applyDeltas(active.deltas, `Age ${currentYear} Choice ${active.letter}`);
    
    // Add consequence to log
    addLog(active.consequence);
    
    // Harmful Option E framework
    if (active.letter === 'E') {
      incrementCounter('harmCount');
      incrementCounter('avoidantCount');
      addLog("Something in the room goes emotionally colder.");
      // Reduce action points by 1 (minimum 0)
      updateState({ actionPoints: Math.max(0, actionPoints - 1) });
    }
    
    // Parenting style counters
    if (active.letter === 'A') incrementCounter('supportiveCount');
    if (active.letter === 'B') incrementCounter('strictCount');
    if (active.letter === 'C') incrementCounter('permissiveCount');
    if (active.letter === 'D') incrementCounter('supportiveCount');
    
    // Add to history
    addHistory({
      age: currentYear,
      baseLetter: active.letter,
      usedTechniqueId: active.techId,
      shownText: active.text,
      deltas: active.deltas
    });
    
    // Mark scenario completed and clear pending
    completeYearScenario();
    
    // NEW: Do not auto-end on the final year's scenario choice.
    // The run ends when the player presses Age Up at endAge (18).
    if (currentYear === endAge) {
      addLog(`Age ${currentYear}: Final year moment resolved. When you're ready, press Age Up to see where life lands.`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        {promptHeading}
      </h3>
      <div className="space-y-2">
        {!isValid ? (
          <div className="text-sm text-red-600 text-center py-4">
            (Scenario data error. Please restart.)
          </div>
        ) : (
          currentScenario.choices.map((choice, index) => (
            <ChoiceButton
              key={index}
              choice={choice}
              onSelect={handleChoice}
              isValid={isValid}
            />
          ))
        )}
      </div>
    </div>
  );
}