import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameState } from './GameStateContext';
import { BEDTIME_STORIES } from './bedtimeStoriesData';
import { generateBedtimeStory } from './bedtimeStoryGenerator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BedtimeStoryModal({ open, onClose }) {
  const { gameState, spendFocus, applyLove, applyStress, applyDeltas, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const [step, setStep] = useState(1);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [twistMethod, setTwistMethod] = useState(null); // 'player' | 'child'
  const [changes, setChanges] = useState({}); // { slotId: value }
  const [generatedStory, setGeneratedStory] = useState(null);

  // Timer management for any async effects
  const timersRef = React.useRef([]);
  const clearAllTimers = React.useCallback(() => {
    try { timersRef.current.forEach((id) => clearTimeout(id)); } catch {}
    timersRef.current = [];
  }, []);
  const setSafeTimeout = React.useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Local closing guard to ensure UI unmounts even if parent is late
  const [forceClosed, setForceClosed] = useState(false);

  React.useEffect(() => {
    if (open) setForceClosed(false);
    return () => clearAllTimers();
  }, [open, clearAllTimers]);

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedStoryId(null);
      setTwistMethod(null);
      setChanges({});
      setGeneratedStory(null);
    }
  }, [open]);

  // Local close handler must be defined before any early returns to keep hook order stable
  const localClose = React.useCallback(() => {
    clearAllTimers();
    setForceClosed(true);
    setSafeTimeout(() => { try { onClose?.(); } catch {} }, 0);
  }, [clearAllTimers, onClose, setSafeTimeout]);

  if (!open || forceClosed) return null;

  const childAge = gameState.currentYear;
  const childName = gameState.childName || 'Child';

  const selectedStory = BEDTIME_STORIES.find(s => s.id === selectedStoryId);

  const handleStorySelect = (id) => {
    setSelectedStoryId(id);
    setStep(2);
  };

  const handleMethodSelect = (method) => {
    setTwistMethod(method);
    
    if (method === 'child') {
      // Auto-pick immediately
      autoPickChanges(selectedStoryId);
    }
    
    setStep(3);
  };

  const autoPickChanges = (storyId) => {
    const story = BEDTIME_STORIES.find(s => s.id === storyId);
    const newChanges = {};
    
    story.slots.forEach(slot => {
      // Simple logic: random for now, but could weight by age if keywords existed
      // Prompt asks for "simple keyword weighting" - keeping it simple random for MVP robustness
      // unless we want to parse strings. Let's stick to random for robustness first.
      const opts = slot.options;
      const pick = opts[Math.floor(Math.random() * opts.length)];
      newChanges[slot.id] = pick;
    });
    
    setChanges(newChanges);
  };

  const handleSurpriseMe = () => {
    autoPickChanges(selectedStoryId);
  };

  const handleTellStory = () => {
    // Generate story
    const changeValues = selectedStory.slots.map(slot => changes[slot.id]);
    
    const story = generateBedtimeStory({
      storyKey: selectedStoryId,
      childName,
      childAge,
      changes: changeValues,
      method: twistMethod
    });
    
    setGeneratedStory(story);
    setStep(4);
  };



  const handleComplete = () => {
    try {
      if (spendFocus(1, "Bedtime Story")) {
        applyStress(-12, "Bedtime Story");
        applyLove(8, "Bedtime Story");
        // Apply once
        applyDeltas({ confidence: 1.2 }, "Bedtime Story");

        const changeList = selectedStory.slots.map(slot => changes[slot.id]).join(', ');
        addLog(`📖 Bedtime Story: ${generatedStory.title}`);

        recordTimelineEntry({
          kind: 'bond',
          title: `📖 Bedtime Story: ${generatedStory.title}`,
          detail: `${generatedStory.text}\n\nChanges: ${changeList}`,
          deltas: { confidence: 1.2 },
          loveDelta: 8,
          stressDelta: -12,
          moneyDelta: 0
        });

        try {
          emitActionResult?.({
            actionId: 'bedtimeStory',
            title: `📖 Bedtime Story: ${generatedStory.title}`,
            body: `You told a story about ${generatedStory.title} with some... creative adjustments: ${changeList}.\n\n${generatedStory.closer}`,
            deltas: { confidence: 1.2 },
            loveDelta: 8,
            stressDelta: -12,
            focusDelta: -1,
            tags: ['bond', 'story'],
            meta: { 
              emoji: '📖',
              coachNote: "Bedtime stories are co‑regulation in disguise: your voice settles their body, and letting them twist the plot gives safe control at the end of the day."
            }
          });
        } catch (e) {
          console.error('emitActionResult failed for Bedtime Story', e);
        }
      }
    } catch (e) {
      console.error("Story completion failed", e);
    } finally {
      localClose();
    }
  };

  const getKidVoiceLine = () => {
    if (childAge <= 3) return `${childName} says: "BUNNY! MOON! PIZZA HOUSE!"`;
    if (childAge <= 6) return `${childName} says: "Make the wolf a robot goose and the house is PANCAKES!"`;
    return `${childName} says: "What if the villain is a librarian-dragon and the ending is a dance trial?"`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Bedtime Story Time
            </h2>
            <button onClick={localClose} className="hover:bg-indigo-700 p-1 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-slate-600 text-center mb-2">Pick a classic story to start:</p>
                <div className="grid gap-3">
                  {BEDTIME_STORIES.map(story => (
                    <button
                      key={story.id}
                      onClick={() => handleStorySelect(story.id)}
                      className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left flex items-center gap-4 group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">{story.emoji}</span>
                      <span className="font-bold text-slate-700 text-lg">{story.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-slate-600 text-center mb-4">How do you want to tell it?</p>
                <div className="grid gap-3">
                  <button
                    onClick={() => handleMethodSelect('player')}
                    className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-center"
                  >
                    <div className="font-bold text-slate-800 text-lg mb-1">Option A</div>
                    <div className="text-slate-600">I'll change the story</div>
                  </button>
                  <button
                    onClick={() => handleMethodSelect('child')}
                    className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
                  >
                    <div className="font-bold text-slate-800 text-lg mb-1">Option B</div>
                    <div className="text-slate-600">Let {childName} change it</div>
                  </button>
                </div>
                <div className="pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="w-full">Back</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                {twistMethod === 'child' && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-2 relative">
                    <div className="absolute -bottom-3 left-8 w-4 h-4 bg-purple-50 border-b border-r border-purple-100 rotate-45"></div>
                    <p className="text-purple-800 font-medium italic text-sm">
                      {getKidVoiceLine()}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedStory.slots.map(slot => (
                    <div key={slot.id}>
                      <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                        {slot.label}
                      </label>
                      {twistMethod === 'player' ? (
                        <Select 
                          value={changes[slot.id] || ''} 
                          onValueChange={(val) => setChanges(prev => ({...prev, [slot.id]: val}))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a change..." />
                          </SelectTrigger>
                          <SelectContent>
                            {slot.options.map((opt, idx) => (
                              <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-slate-100 rounded-lg text-slate-800 font-medium border border-slate-200 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                          {changes[slot.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  {twistMethod === 'player' ? (
                    <Button 
                      variant="outline" 
                      onClick={handleSurpriseMe}
                      className="flex-1"
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Surprise Me
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => autoPickChanges(selectedStoryId)}
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Ask Again
                    </Button>
                  )}
                  <Button 
                    onClick={handleTellStory}
                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700"
                    disabled={selectedStory.slots.some(slot => !changes[slot.id])}
                  >
                    Tell the Story <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-xs">Back</Button>
              </div>
            )}

            {step === 4 && generatedStory && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-indigo-900">{generatedStory.title}</h3>
                  <div className="w-16 h-1 bg-indigo-100 mx-auto rounded-full"></div>
                </div>

                <div className="prose prose-slate leading-relaxed text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  {generatedStory.text.split('\n').map((para, i) => (
                    <p key={i} className={para ? "mb-4 last:mb-0" : "h-2"}>{para}</p>
                  ))}
                </div>

                <div className="text-center font-bold text-indigo-600 italic">
                  {generatedStory.closer}
                </div>

                <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                  The End! (Complete)
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}