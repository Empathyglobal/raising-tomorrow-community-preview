import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { pickJoke } from './jokeBookData';
import { Button } from '@/components/ui/button';

export default function JokeBookModal({ open, onClose }) {
  const { gameState, applyDeltas, addLog, updateState, emitActionResult } = useGameState();
  const { currentYear, childName, jokeBookByAge } = gameState;
  
  const [currentJokeIndex, setCurrentJokeIndex] = useState(-1);
  const [currentJoke, setCurrentJoke] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      
      // Pick initial joke
      const yearData = jokeBookByAge?.[currentYear];
      const lastIndex = yearData?.lastJokeIndex ?? -1;
      const { index, joke } = pickJoke(lastIndex);
      setCurrentJokeIndex(index);
      setCurrentJoke(joke);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, currentYear, jokeBookByAge]);

  const handleNextJoke = () => {
    const { index, joke } = pickJoke(currentJokeIndex);
    setCurrentJokeIndex(index);
    setCurrentJoke(joke);
  };

  const handleReadToChild = () => {
    if (!currentJoke) return;

    // Initialize age data if needed
    const yearData = jokeBookByAge?.[currentYear] || {
      boostApplied: false,
      reads: 0,
      lastJokeIndex: -1
    };

    const isFirstRead = !yearData.boostApplied;
    const newReads = yearData.reads + 1;

    // Update state - using callback to ensure proper state updates
    updateState((prev) => {
      const updatedJokeBookByAge = {
        ...(prev.jokeBookByAge || {}),
        [currentYear]: {
          boostApplied: true,
          reads: newReads,
          lastJokeIndex: currentJokeIndex
        }
      };

      return { jokeBookByAge: updatedJokeBookByAge };
    });

    // Apply confidence boost only on first read
    if (isFirstRead) {
      applyDeltas({ confidence: 0.1, intelligence: 0, empathy: 0, discipline: 0 }, "Joke Book");
    }

    // Build result body
    let body = `"${currentJoke}"`;
    if (isFirstRead) {
      body += "\n\nThey laugh—and look a tiny bit bolder.";
    } else {
      body += "\n\nNo extra confidence boost this year, but the giggles still count.";
    }

    // Emit action result popup
    emitActionResult({
      actionId: 'joke_book',
      title: '🤣 Joke Book',
      body: body,
      deltas: isFirstRead ? { confidence: 0.1, intelligence: 0, empathy: 0, discipline: 0 } : {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['connect', 'joke'],
      meta: { 
        emoji: '🤣', 
        joke: currentJoke, 
        isFirstRead,
        coachNote: "Shared laughter lowers stress and makes connection easy. Humor is basically teamwork for your nervous systems."
      }
    });

    // Handle timeline - update using setTimeout to avoid state race
    setTimeout(() => {
      updateState((prev) => {
        const entries = [...prev.timelineEntries];
        const existingIndex = entries.findIndex(
          e => e.meta?.type === 'joke_book' && e.age === currentYear
        );

        if (existingIndex >= 0) {
          // Update existing entry
          entries[existingIndex] = {
            ...entries[existingIndex],
            detail: `You read jokes to ${childName || "your child"}. (Reads this year: ${newReads})`,
            meta: {
              ...entries[existingIndex].meta,
              reads: newReads
            }
          };
          
          return { timelineEntries: entries };
        } else {
          // Create new entry (first read this year)
          const newCounter = prev.timelineCounter + 1;
          const id = `t${newCounter}_a${currentYear}`;
          
          entries.push({
            id,
            age: currentYear,
            kind: 'connect',
            title: '🤣 Joke Book',
            detail: `You read a joke to ${childName || "your child"}: "${currentJoke}"`,
            deltas: isFirstRead ? { confidence: 0.1, intelligence: 0, empathy: 0, discipline: 0 } : null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            meta: { type: 'joke_book', reads: 1 }
          });

          return {
            timelineCounter: newCounter,
            timelineEntries: entries
          };
        }
      });
    }, 100);

    // Add log only on first read
    if (isFirstRead) {
      addLog(`🤣 Joke Book: "${currentJoke}" — They giggle. Confidence grows a little.`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[110]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  🤣 Joke Book
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                Read a joke to {childName || "your child"}.
              </p>

              {/* Joke Card */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-6 min-h-[120px] flex items-center justify-center">
                <p className="text-slate-800 text-center whitespace-pre-wrap leading-relaxed">
                  {currentJoke}
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleReadToChild}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base font-semibold"
                >
                  Read this to {childName || "them"}
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleNextJoke}
                    variant="outline"
                    className="flex-1"
                  >
                    Next Joke
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}