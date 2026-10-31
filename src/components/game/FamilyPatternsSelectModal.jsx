import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Dices, Infinity, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FAMILY_PATTERN_CATALOG, DEFAULT_PATTERN_SEVERITY } from './familyPatternCatalog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PRESSURE_ICONS = {
  threat: '🛡️',
  shame: '🫥',
  chaos: '🌪️',
  role: '🔄'
};

// PATTERN TOOLTIPS (Neutral, Normalizing, Non-Clinical)
const PATTERN_TOOLTIPS = {
  emotional_neglect: "Sometimes caregivers were present, but emotionally unavailable. Many people grow up adapting to this without realizing it.",
  emotional_invalidation: "When feelings were dismissed or minimized repeatedly, children often learned to hide or doubt their emotions.",
  high_conflict_home: "Frequent tension or arguments can shape how we respond to stress and disagreement later in life.",
  domestic_violence: "Exposure to violence—physical, emotional, or verbal—can create lasting patterns in how we feel safety.",
  substance_use: "Substance use can affect family stability in many different ways, often without anyone intending harm.",
  mental_illness: "When mental illness was present, children often learned to adapt in ways they didn't name at the time.",
  unpredictable_care: "When care was inconsistent, children often learned to stay alert or self-reliant earlier than needed.",
  parentification: "Some children were asked to be caregivers before they had the tools. It's common and often unspoken.",
  perfectionism_pressure: "High expectations for achievement can create patterns of never feeling 'enough,' even when doing well.",
  emotional_enmeshment: "When boundaries between parent and child were blurry, autonomy could feel like betrayal.",
  financial_instability: "Money stress can shape emotional patterns—vigilance, scarcity mindsets, and safety-seeking behaviors.",
  rigid_control: "When control was extreme, children often learned compliance, rebellion, or a mix of both.",
  conditional_love: "When love felt tied to performance or behavior, worthiness could become a moving target.",
  shame_based_discipline: "Discipline rooted in shame can create patterns of hiding, people-pleasing, or self-criticism.",
  loss_grief_unprocessed: "When loss happened without space to grieve, children often learned to carry sadness quietly.",
  abandonment: "Actual or feared abandonment can create patterns around trust, attachment, and closeness.",
  scapegoating: "Being blamed for family problems can create patterns of self-blame or hyper-responsibility.",
  emotional_incest: "When a parent leaned on a child for emotional support like a partner, boundaries could get confusing.",
  cultural_identity_stress: "Navigating conflicting cultural expectations can create identity pressure that lasts into adulthood.",
  religious_trauma: "When religion felt controlling, shaming, or unsafe, it can shape beliefs about worthiness and fear.",
  developmental_neglect: "When developmental needs were overlooked, children often learned to downplay their own needs.",
  isolation: "Growing up isolated from peers or community can shape social comfort and connection patterns.",
  oversharing_boundaries: "When privacy wasn't respected, children often learned either to hide or to normalize boundary violations.",
  sibling_comparison: "Being constantly compared to siblings can create patterns around worth, jealousy, or proving oneself.",
  medical_trauma: "Scary or painful medical experiences without proper support can create patterns around health and safety.",
  relocation_instability: "Frequent moves can create patterns around attachment, belonging, and fear of loss.",
  food_insecurity: "When food was uncertain, children often developed patterns around safety, scarcity, and control.",
  caregiver_illness: "When a caregiver was chronically ill, children often learned to minimize their own needs or become hyper-responsible.",
  divorce_loyalty_conflict: "Being caught between parents can create patterns around loyalty, guilt, and people-pleasing."
};

// REASSURANCE LINES (Randomized)
const REASSURANCE_LINES = [
  "Many players pause here. That's completely normal.",
  "You're not alone — these experiences are more common than people realize.",
  "Nothing here means something is 'wrong' with you.",
  "This step exists because real families are complex.",
  "You're allowed to take this at your own pace."
];

export default function FamilyPatternsSelectModal({ open, onComplete, runSeed, requiredCount }) {
  const [step, setStep] = useState('mode'); // start with mode selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [randomRevealed, setRandomRevealed] = useState(false);
  
  const exactRequired = Number.isFinite(requiredCount) && requiredCount > 0;
  
  // Pick a random reassurance line on mount/open
  const reassuranceLine = useMemo(() => {
    return REASSURANCE_LINES[Math.floor(Math.random() * REASSURANCE_LINES.length)];
  }, [open]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Reset to mode screen on open
      setStep('mode');
      setSelectedIds([]);
      setSearchQuery('');
      setRandomRevealed(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleToggle = (patternId) => {
    if (selectedIds.includes(patternId)) {
      setSelectedIds(selectedIds.filter(id => id !== patternId));
    } else {
      // If exactRequired and already at limit, replace the last one
      if (exactRequired && selectedIds.length >= requiredCount) {
        const updated = [...selectedIds.slice(0, requiredCount - 1), patternId];
        setSelectedIds(updated);
      } else {
        setSelectedIds([...selectedIds, patternId]);
      }
    }
  };

  const handleModeNone = () => {
    onComplete([]);
  };
  
  const handleModeSkip = () => {
    setStep('skip_confirm');
  };
  
  const handleSkipConfirmBack = () => {
    setStep('mode');
  };
  
  const handleSkipConfirmContinue = () => {
    onComplete([]);
  };

  const handleModeRandom = () => {
    // Seeded RNG
    const seedString = `${runSeed}|family_patterns_random3`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
      hash = hash & hash;
    }
    
    let rngState = Math.abs(hash);
    const seededRng = () => {
      rngState |= 0;
      rngState = rngState + 0x6D2B79F5 | 0;
      let t = Math.imul(rngState ^ rngState >>> 15, 1 | rngState);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const shuffled = [...FAMILY_PATTERN_CATALOG].sort(() => seededRng() - 0.5);
    const picked = shuffled.slice(0, 3).map(p => p.id);
    setSelectedIds(picked);
    setStep('random_results');
  };

  const handleModeChooseYours = () => {
    setStep('picker');
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handlePickerCancel = () => {
    setStep('picker');
    setSelectedIds([]);
    setSearchQuery('');
  };

  const handlePickerContinue = () => {
    onComplete(selectedIds);
  };

  const handleRandomContinue = () => {
    onComplete(selectedIds);
  };

  const filteredPatterns = FAMILY_PATTERN_CATALOG.filter(pattern => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return pattern.label.toLowerCase().includes(query) || 
           pattern.short.toLowerCase().includes(query);
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y'
            }}
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] overflow-hidden min-h-0">
              
              <AnimatePresence mode="wait">
                {/* MODE SELECTION */}
                {step === 'mode' && (
                  <motion.div
                    key="mode"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full min-h-0"
                  >
                    <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Family Traumas</h3>
                      <p className="text-sm text-slate-600">
                        Choose how you want to set your family traumas for this run. Most players pick Random 3.
                      </p>
                    </div>
                    
                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-8"
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain',
                        touchAction: 'pan-y'
                      }}
                    >
                    <div className="space-y-4 max-w-md mx-auto">
                      <button
                        onClick={handleModeRandom}
                        className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">🎲</span>
                          <div>
                            <div className="text-lg font-bold text-slate-800 mb-1">Random 3 (Recommended)</div>
                            <div className="text-sm text-slate-600">Let the game pick 3 traumas for you.</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleModeChooseYours}
                        className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">🧬</span>
                          <div>
                            <div className="text-lg font-bold text-slate-800 mb-1">Choose from the list</div>
                            <div className="text-sm text-slate-600">Select any number of traumas manually.</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={handleModeNone}
                        className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">✨</span>
                          <div>
                            <div className="text-lg font-bold text-slate-800 mb-1">No family traumas (Cheat Mode)</div>
                            <div className="text-sm text-slate-600">Start with no family traumas.</div>
                          </div>
                        </div>
                      </button>
                    </div>
                    </div>
                    
                    <div className="px-6 pb-4 flex flex-col gap-3">
                      <p className="text-xs text-slate-500 italic text-center">
                        These are story ingredients — not diagnoses.
                      </p>
                      <p className="text-xs text-slate-400 text-center">
                        {reassuranceLine}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PICKER (Choose Yours) */}
                {step === 'picker' && (
                  <motion.div
                    key="picker"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full min-h-0"
                  >
                    <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Choose your family traumas</h3>
                        <p className="text-sm text-slate-600">
                          {exactRequired ? `Select exactly ${requiredCount} traumas.` : 'Search and select any number. You can also pick Random 3 instead.'}
                        </p>
                      </div>
                      <div className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
                        exactRequired && selectedIds.length === requiredCount 
                          ? 'bg-green-100 text-green-700' 
                          : exactRequired && selectedIds.length !== requiredCount
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {exactRequired ? `${selectedIds.length} / ${requiredCount}` : `Selected: ${selectedIds.length}`}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {exactRequired ? 'Required for this special start.' : 'Optional. This is a game mechanic, not a diagnosis.'}
                    </p>
                    </div>

                    <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search patterns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="mt-2 flex gap-2 items-center flex-wrap">
                      <button
                        onClick={() => {
                          // Seeded randomize (use requiredCount if set, else 3)
                          const count = exactRequired ? requiredCount : 3;
                          const seedString = `${runSeed}|family_patterns_random${count}`;
                          let hash = 0;
                          for (let i = 0; i < seedString.length; i++) {
                            hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
                            hash = hash & hash;
                          }
                          let rngState = Math.abs(hash);
                          const seededRng = () => {
                            rngState |= 0;
                            rngState = rngState + 0x6D2B79F5 | 0;
                            let t = Math.imul(rngState ^ rngState >>> 15, 1 | rngState);
                            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                            return ((t ^ t >>> 14) >>> 0) / 4294967296;
                          };
                          const shuffled = [...FAMILY_PATTERN_CATALOG].sort(() => seededRng() - 0.5);
                          setSelectedIds(shuffled.slice(0, count).map(p => p.id));
                        }}
                        className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Surprise me
                      </button>
                      {selectedIds.length > 0 && (
                        <button
                          onClick={() => {
                            // Re-roll selection
                            const count = exactRequired ? requiredCount : 3;
                            const seedString = `${runSeed}|family_patterns_reroll_${Date.now()}`;
                            let hash = 0;
                            for (let i = 0; i < seedString.length; i++) {
                              hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
                              hash = hash & hash;
                            }
                            let rngState = Math.abs(hash);
                            const seededRng = () => {
                              rngState |= 0;
                              rngState = rngState + 0x6D2B79F5 | 0;
                              let t = Math.imul(rngState ^ rngState >>> 15, 1 | rngState);
                              t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                              return ((t ^ t >>> 14) >>> 0) / 4294967296;
                            };
                            const shuffled = [...FAMILY_PATTERN_CATALOG].sort(() => seededRng() - 0.5);
                            setSelectedIds(shuffled.slice(0, count).map(p => p.id));
                          }}
                          className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Dices className="w-3 h-3" /> Reroll
                        </button>
                      )}
                      <button
                        onClick={() => {
                          // Seeded randomize 3 (old button for backwards compat)
                          const seedString = `${runSeed}|family_patterns_random3`;
                          let hash = 0;
                          for (let i = 0; i < seedString.length; i++) {
                            hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
                            hash = hash & hash;
                          }
                          let rngState = Math.abs(hash);
                          const seededRng = () => {
                            rngState |= 0;
                            rngState = rngState + 0x6D2B79F5 | 0;
                            let t = Math.imul(rngState ^ rngState >>> 15, 1 | rngState);
                            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                            return ((t ^ t >>> 14) >>> 0) / 4294967296;
                          };
                          const shuffled = [...FAMILY_PATTERN_CATALOG].sort(() => seededRng() - 0.5);
                          setSelectedIds(shuffled.slice(0, 3).map(p => p.id));
                        }}
                        className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Dices className="w-3 h-3" /> Random 3
                      </button>
                      {!exactRequired && (
                        <button
                          onClick={() => onComplete([])}
                          className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                        >
                          Skip
                        </button>
                      )}
                      {selectedIds.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4"
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain',
                        touchAction: 'pan-y',
                        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
                      }}
                    >
                      <div className="space-y-2">
                        {filteredPatterns.map(pattern => {
                           const isSelected = selectedIds.includes(pattern.id);

                           return (
                             <TooltipProvider key={pattern.id} delayDuration={200}>
                               <button
                                 onClick={() => handleToggle(pattern.id)}
                                 className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                                   isSelected
                                     ? 'border-indigo-400 bg-indigo-50'
                                     : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                 }`}
                               >
                                 <div className="flex items-start gap-2">
                                   <div className="flex-shrink-0 mt-0.5">
                                     <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                       isSelected
                                         ? 'border-indigo-500 bg-indigo-500'
                                         : 'border-slate-300 bg-white'
                                     }`}>
                                       {isSelected && (
                                         <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                         </svg>
                                       )}
                                     </div>
                                   </div>
                                   <div className="flex-1 min-w-0">
                                     <div className="flex items-center gap-1.5 mb-0.5">
                                       <div className="font-semibold text-slate-800 text-sm">
                                         {pattern.label}
                                       </div>
                                       <Tooltip>
                                         <TooltipTrigger asChild>
                                           <button
                                             onClick={(e) => {
                                               e.stopPropagation();
                                             }}
                                             className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                                             aria-label={`About ${pattern.label}`}
                                           >
                                             <Info className="w-3.5 h-3.5" />
                                           </button>
                                         </TooltipTrigger>
                                         <TooltipContent side="top" className="max-w-xs bg-slate-800 text-white text-xs p-2 z-[9999]">
                                           <p className="leading-tight">{PATTERN_TOOLTIPS[pattern.id] || "A common family pattern that many people navigate."}</p>
                                         </TooltipContent>
                                       </Tooltip>
                                     </div>
                                     <div className="text-xs text-slate-600">
                                       {pattern.short}
                                     </div>
                                   </div>
                                 </div>
                               </button>
                             </TooltipProvider>
                           );
                         })}
                      </div>
                      <div className="h-4" />
                    </div>

                    <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                      <p className="text-xs text-slate-500 italic text-center mb-3">
                        {reassuranceLine}
                      </p>
                      <div className="flex gap-3">
                         <Button
                           onClick={() => setStep('mode')}
                           variant="outline"
                           className="flex-1"
                         >
                           Back
                         </Button>
                         <Button
                           onClick={handlePickerContinue}
                           disabled={exactRequired && selectedIds.length !== requiredCount}
                           className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Continue
                         </Button>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SKIP CONFIRMATION */}
                {step === 'skip_confirm' && (
                  <motion.div
                    key="skip_confirm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full min-h-0"
                  >
                    <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Skip This Step?</h3>
                      <p className="text-sm text-slate-600">
                        You can skip if you're not ready.
                      </p>
                    </div>
                    
                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-8"
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain',
                        touchAction: 'pan-y'
                      }}
                    >
                      <div className="max-w-md mx-auto space-y-4">
                        <p className="text-slate-700 leading-relaxed">
                          If you do, the game will assume a neutral past.
                        </p>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-amber-900 mb-2">This means:</p>
                          <ul className="text-sm text-amber-800 space-y-1.5 pl-4">
                            <li>• Fewer emotionally specific moments</li>
                            <li>• Slower relationship depth</li>
                            <li>• A more general story arc</li>
                          </ul>
                        </div>
                        
                        <p className="text-sm text-slate-600 leading-relaxed">
                          You'll still be able to play fully — but the story may feel less personal.
                        </p>
                        
                        <p className="text-xs text-slate-500 italic">
                          You can explore these patterns later if you choose.
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 flex gap-3">
                      <Button
                        onClick={handleSkipConfirmBack}
                        variant="outline"
                        className="flex-1"
                      >
                        Go back
                      </Button>
                      <Button
                        onClick={handleSkipConfirmContinue}
                        className="flex-1 bg-slate-600 hover:bg-slate-700"
                      >
                        Continue without patterns
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: RANDOM RESULTS */}
                {step === 'random_results' && (
                  <motion.div
                    key="random_results"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full min-h-0"
                  >
                    <div className="px-6 py-5 border-b border-slate-200 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Your 3 family traumas</h3>
                    <p className="text-sm text-slate-600">
                      You can keep these, or go back and choose manually.
                    </p>
                    </div>
                    
                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-8"
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain',
                        touchAction: 'pan-y'
                      }}
                    >
                    <div className="max-w-md mx-auto text-center space-y-6">
                      {!randomRevealed ? (
                        <>
                          <div className="text-6xl mb-4">🎲</div>
                          <p className="text-slate-600 text-base">
                            Your patterns have been selected, but not revealed.
                          </p>
                          <Button
                            onClick={() => setRandomRevealed(true)}
                            variant="outline"
                            className="mt-4"
                          >
                            Reveal what I got
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-3">
                          {selectedIds.map(id => {
                            const pattern = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
                            if (!pattern) return null;
                            
                            return (
                              <div key={id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
                                <div className="font-semibold text-slate-800 mb-1">{pattern.label}</div>
                                <div className="text-sm text-slate-600">{pattern.short}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
                      <p className="text-xs text-slate-500 italic text-center mb-3">
                        {reassuranceLine}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setStep('mode')}
                          variant="outline"
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleRandomContinue}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}