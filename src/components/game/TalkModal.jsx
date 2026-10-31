import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { getTalkTopics } from './relationshipData';
import { Button } from '@/components/ui/button';
import TextToneMatchMiniGame from '@/components/game/minigames/TextToneMatchMiniGame';

export default function TalkModal({ open, person, onClose }) {
  const { gameState, applyDeltas, applyLove, applyStress, addLog, spendFocus, emitActionResult, updateState, recordTimelineEntry } = useGameState();
  const { currentYear } = gameState;
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [toneOpen, setToneOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setSelectedTopic(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleConfirm = () => {
    if (!selectedTopic || !person) return;
    if (!spendFocus(1, "Talk")) return;
    setToneOpen(true);
  };

  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

  const getContextForPerson = () => {
    if (!person) return 'friendship';
    if (person.role === 'child' || person.role === 'my_mom' || person.role === 'my_dad' || person.role === 'sibling') return 'parenting';
    if (person.role === 'partner') return 'partner';
    if (person.role === 'teacher') return 'school';
    return 'friendship';
  };

  const applyOldTalkFlow = () => {
    // Old behavior
    if (person.role === "child") {
      applyLove(0.2, "Talk with child");
      applyDeltas({ empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }, "Talk with child");
      applyStress(-0.05, "Talk with child");
    } else {
      const newMeter = clamp((person.meter || 50) + 6, 0, 100);
      updateState({
        relationships: {
          ...gameState.relationships,
          roster: gameState.relationships.roster.map(p => p.id === person.id ? { ...p, meter: newMeter } : p)
        }
      });
      applyStress(-0.05, "Talk");
      if (person.role === "teacher") {
        applyDeltas({ discipline: 0.1, intelligence: 0, empathy: 0, confidence: 0 }, "Talk with teacher");
      } else if (person.role === "best_friend") {
        applyDeltas({ empathy: 0.1, intelligence: 0, discipline: 0, confidence: 0 }, "Talk with best friend");
      }
    }

    const updatedInteractionsByAge = {
      ...person.interactionsByAge,
      [currentYear]: { didConnect: true, type: 'talk', detail: selectedTopic }
    };
    updateState({
      relationships: {
        ...gameState.relationships,
        roster: gameState.relationships.roster.map(p => p.id === person.id ? { ...p, interactionsByAge: updatedInteractionsByAge } : p)
      }
    });

    addLog(`💬 You talked with ${person.name}: "${selectedTopic}"`);
    emitActionResult({ actionId: 'relationshipTalk', title: `💬 Talked with ${person.name}`, body: `"${selectedTopic}"`, deltas: {}, loveDelta: person.role === 'child' ? 0.2 : 0, stressDelta: -0.05, moneyDelta: 0, focusDelta: -1, tags: ['relationship','talk'] });
    onClose();
  };

  const handleToneComplete = ({ connectionDelta, rating, effects }) => {
    const loveGain = Math.max(0, effects?.love || 0);
    const empathyGain = Math.max(0, effects?.empathy || 0);

    if (person.role === 'child') {
      if (loveGain) applyLove(loveGain, `Talk: ${rating}`);
      if (empathyGain) applyDeltas({ empathy: empathyGain }, `Talk: ${rating}`);
      applyStress(-0.05, 'Talk');
    } else {
      const meterDelta = (connectionDelta || 0) * 3; // small, scaled
      const newMeter = clamp((person.meter || 50) + meterDelta, 0, 100);
      updateState({
        relationships: {
          ...gameState.relationships,
          roster: gameState.relationships.roster.map(p => p.id === person.id ? { ...p, meter: newMeter } : p)
        }
      });
      if (empathyGain) applyDeltas({ empathy: empathyGain }, `Talk: ${rating}`);
      applyStress(-0.05, 'Talk');
    }

    // interactions mark
    const updatedInteractionsByAge = {
      ...person.interactionsByAge,
      [currentYear]: { didConnect: true, type: 'talk', detail: selectedTopic }
    };
    updateState({
      relationships: {
        ...gameState.relationships,
        roster: gameState.relationships.roster.map(p => p.id === person.id ? { ...p, interactionsByAge: updatedInteractionsByAge } : p)
      }
    });

    addLog(`💬 Conversation with ${person.name}: ${rating}${loveGain ? ` (+${loveGain} Love)` : ''}`);

    recordTimelineEntry({
      kind: 'relationship',
      title: `Conversation: ${rating}${loveGain ? ` (+${loveGain} Love)` : ''}`,
      detail: `Topic: ${selectedTopic}`,
      deltas: loveGain ? { love: loveGain } : null,
      moneyDelta: 0,
      loveDelta: loveGain || 0,
      stressDelta: -0.05,
    });

    emitActionResult({
      actionId: 'relationshipTalk',
      title: `💬 ${rating}`,
      body: `${person.name}: ${selectedTopic}`,
      deltas: empathyGain ? { empathy: empathyGain } : {},
      loveDelta: loveGain,
      stressDelta: -0.05,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['relationship','talk','tone_match']
    });

    setToneOpen(false);
    onClose();
  };

  const handleToneSkip = () => {
    setToneOpen(false);
    applyOldTalkFlow();
  };

  if (!person) return null;

  const topics = getTalkTopics(person, currentYear);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[110]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  💬 Talk with {person.name}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Choose a topic:</p>
                
                <div className="space-y-2">
                  {topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTopic === topic
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-800">{topic}</span>
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedTopic}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    Talk
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <TextToneMatchMiniGame
           open={toneOpen}
           context={getContextForPerson()}
           onClose={handleToneSkip}
           onSkip={handleToneSkip}
           onComplete={handleToneComplete}
          />
          </>
          )}
          </AnimatePresence>
          );
          }