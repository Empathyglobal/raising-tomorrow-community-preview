import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';

const SCHOOL_EVENTS = {
  artsShowcase: {
    title: "Arts Showcase",
    emoji: "🎭",
    stateKey: "artsShowcase",
    levels: [
      { label: "School Talent Show", entryCost: 40, blurb: "Cafeteria stage. Brave hearts. Questionable microphone squeal." },
      { label: "District Performing Arts Night", entryCost: 90, blurb: "Real lights. Real judges. Real butterflies." },
      { label: "State Youth Arts Festival", entryCost: 160, blurb: "Workshops, rehearsals, and kids who casually do miracles." },
      { label: "National Spotlight Showcase", entryCost: 260, blurb: "Clipboards everywhere. Somehow still adorable." },
    ],
    statWeights: { confidence: 0.45, discipline: 0.25, empathy: 0.20, intelligence: 0.10 },
    entries: [
      { id: "original_song", label: "Original Song", emoji: "🎵", tags: ["ART", "ART_MUSIC"], seedReward: { music: 1, performance: 1 } },
      { id: "dance_routine", label: "Dance Routine", emoji: "💃", tags: ["ART", "ART_MUSIC"], seedReward: { performance: 2 } },
      { id: "poetry_slam", label: "Poetry Slam", emoji: "🎤", tags: ["ART", "ART_WRITING"], seedReward: { art: 2 } },
      { id: "short_film", label: "Short Film", emoji: "🎞️", tags: ["ART", "ART_ANIMATION"], seedReward: { art: 1, performance: 1 } },
      { id: "live_illustration", label: "Live Illustration", emoji: "🎨", tags: ["ART", "ART_ILLUSTRATION"], seedReward: { art: 2 } },
      { id: "mini_game_booth", label: "Playable Mini-Game Booth", emoji: "🕹️", tags: ["ART", "ART_GAMEDESIGN"], seedReward: { art: 1, tech: 1 } },
    ],
    supports: [
      { id: "practice_buddy", label: "Practice Buddy", emoji: "🫶", cost: 0, bonus: 2, deltas: { discipline: 0.3 }, loveDelta: 0.2, stressDelta: 0.1,
        blurb: "You rehearse with them kindly, even when it's the 47th time.",
        coachNote: "You gave reps *and* warmth. Skills grow faster when shame isn’t in the room." },
      { id: "stagecraft", label: "Stagecraft Upgrade", emoji: "👗", cost: 120, bonus: 3, deltas: { confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "Props, costume, and a little extra sparkle.",
        coachNote: "A little support removes friction so they can shine. Confidence likes good lighting." },
      { id: "hire_coach", label: "Hire a Coach", emoji: "🎬", cost: 400, bonus: 4, deltas: { confidence: 0.4, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "A professional helps them level up—without crushing the joy.",
        coachNote: "A pro helps them level up without turning it into a parent‑kid power struggle." },
      { id: "let_them_lead", label: "Let Them Lead", emoji: "🌱", cost: 0, bonus: 1, deltas: { confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.0,
        blurb: "You give them ownership. You stay nearby. It works.",
        coachNote: "Ownership turns effort into pride. You stayed close without taking over, so they felt capable." },
      { id: "pressure_perfect", label: "Pressure Perfection", emoji: "😬", cost: 0, bonus: -3, deltas: { confidence: -0.4, empathy: -0.2 }, loveDelta: -0.5, stressDelta: 0.6,
        blurb: "You push too hard. The performance is tighter… and so are their shoulders.",
        backfireNote: "Pressure makes the goal “don’t disappoint.” That tightens everything—joy, confidence, connection—until the kid just wants it to be over." },
    ],
    resultText: {
      win: "They win. Not just the trophy—*the moment.* Their face says: 'I did that.'",
      place: "They place! Real applause. Real recognition. The kind that sticks.",
      noplace: "No placement, but they finish with their chin up. That's a kind of win too."
    }
  },

  ecoChallenge: {
    title: "Eco Challenge",
    emoji: "🌿",
    stateKey: "ecoChallenge",
    levels: [
      { label: "School Eco Fair", entryCost: 30, blurb: "Poster boards, plant facts, and a suspicious amount of glitter." },
      { label: "District Conservation Challenge", entryCost: 80, blurb: "Bigger stakes, bigger questions, bigger recycled tri-folds." },
      { label: "State Youth Biology Summit", entryCost: 140, blurb: "They meet kids who treat ecosystems like puzzle boxes." },
      { label: "National Earth Prize", entryCost: 220, blurb: "The kind of event that makes adults whisper, 'That kid is going places.'" },
    ],
    statWeights: { empathy: 0.40, intelligence: 0.30, discipline: 0.20, confidence: 0.10 },
    entries: [
      { id: "vet_care_demo", label: "Vet Care Demo", emoji: "🩺🐾", tags: ["ANIMALS", "ANIMALS_VETERINARY"], seedReward: { nature: 1 } },
      { id: "habitat_plan", label: "Habitat Restoration Plan", emoji: "🌱", tags: ["ANIMALS", "ANIMALS_ECOLOGY"], seedReward: { nature: 2 } },
      { id: "marine_project", label: "Marine Life Project", emoji: "🐋", tags: ["ANIMALS", "ANIMALS_MARINE"], seedReward: { nature: 2 } },
      { id: "behavior_journal", label: "Behavior Study Journal", emoji: "🧠🐾", tags: ["ANIMALS", "ANIMALS_BEHAVIOR"], seedReward: { nature: 1 } },
      { id: "wildlife_fieldwork", label: "Wildlife Fieldwork Poster", emoji: "🦌", tags: ["ANIMALS", "ANIMALS_WILDLIFE"], seedReward: { nature: 2 } },
    ],
    supports: [
      { id: "volunteer_together", label: "Volunteer Together", emoji: "🧤", cost: 0, bonus: 2, deltas: { empathy: 0.3 }, loveDelta: 0.2, stressDelta: 0.1,
        blurb: "You show up with them. Quietly. Consistently.",
        coachNote: "You showed up—quietly, consistently. That teaches: “I matter,” and “we do hard things together.”" },
      { id: "donate_supplies", label: "Donate Supplies", emoji: "📦", cost: 120, bonus: 3, deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "A small donation turns the project from 'idea' into 'impact'.",
        coachNote: "Removing the resource bottleneck lets their ideas actually happen. Tools don’t replace effort—they let effort work." },
      { id: "hire_mentor", label: "Hire a Nature Mentor", emoji: "🧑‍🔬", cost: 350, bonus: 4, deltas: { intelligence: 0.3, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "A mentor helps them think bigger—and stay grounded.",
        coachNote: "A pro helps them level up without turning it into a parent‑kid power struggle." },
      { id: "let_them_lead", label: "Let Them Lead", emoji: "🌱", cost: 0, bonus: 1, deltas: { confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.0,
        blurb: "You don't steer. You support.",
        coachNote: "Ownership turns effort into pride. You stayed close without taking over, so they felt capable." },
      { id: "guilt_trip", label: "Guilt & Pressure", emoji: "😞", cost: 0, bonus: -3, deltas: { empathy: -0.2, confidence: -0.2 }, loveDelta: -0.5, stressDelta: 0.6,
        blurb: "They do the work, but joy leaks out of it.",
        backfireNote: "Guilt gets compliance, not growth. It teaches them your love is tied to performance, and that’s a heavy backpack." },
    ],
    resultText: {
      win: "They win—and it feels like the room gets a little greener.",
      place: "They place! People ask questions. They answer like they belong here.",
      noplace: "No ribbon this time. But they learn what real stewardship looks like: keep going."
    }
  },

  makerChallenge: {
    title: "Maker Challenge",
    emoji: "🤖",
    stateKey: "makerChallenge",
    levels: [
      { label: "School Maker Challenge", entryCost: 50, blurb: "Tape, cardboard, and the smell of ambition." },
      { label: "Regional Robotics Qualifier", entryCost: 120, blurb: "Teams. Timers. Big 'we can fix it' energy." },
      { label: "State Engineering Expo", entryCost: 200, blurb: "They see inventions that make you rethink your whole career." },
      { label: "National Maker Championship", entryCost: 350, blurb: "A stadium of nerd joy. The best kind." },
    ],
    statWeights: { intelligence: 0.50, discipline: 0.30, confidence: 0.20 },
    entries: [
      { id: "line_robot", label: "Line-Following Robot", emoji: "🤖", tags: ["BUILDING", "BUILDING_ROBOTICS"], seedReward: { engineering: 2, tech: 1 } },
      { id: "app_prototype", label: "App Prototype", emoji: "📱", tags: ["BUILDING", "BUILDING_SOFTWARE"], seedReward: { tech: 2 } },
      { id: "architecture_model", label: "Architecture Model", emoji: "🏗️", tags: ["BUILDING", "BUILDING_ARCHITECTURE"], seedReward: { engineering: 2 } },
      { id: "circuit_puzzle", label: "Circuit Puzzle", emoji: "🔌", tags: ["BUILDING", "BUILDING_ELECTRONICS"], seedReward: { tech: 1, engineering: 1 } },
      { id: "mechanical_contraption", label: "Mechanical Contraption", emoji: "⚙️", tags: ["BUILDING", "BUILDING_MECHANICAL"], seedReward: { engineering: 2 } },
    ],
    supports: [
      { id: "co_build", label: "Co-Build & Debug", emoji: "🧰", cost: 0, bonus: 3, deltas: { intelligence: 0.3, discipline: 0.2 }, loveDelta: 0.2, stressDelta: 0.1,
        blurb: "You don't take over—you pair-program life with them.",
        coachNote: "You paired, not commandeered. Co-building teaches problem‑solving and connection at the same time." },
      { id: "buy_parts", label: "Buy Better Parts", emoji: "🧩", cost: 250, bonus: 3, deltas: { discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "Better sensors. Better motors. Better odds.",
        coachNote: "Better parts reduce frustration loops, so they can focus on learning instead of fighting the materials." },
      { id: "hire_mentor", label: "Hire a Mentor", emoji: "🧑‍🏭", cost: 600, bonus: 4, deltas: { intelligence: 0.4, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "A mentor helps them iterate without spiraling.",
        coachNote: "A pro helps them level up without turning it into a parent‑kid power struggle." },
      { id: "let_them_solve", label: "Let Them Solve", emoji: "🧠", cost: 0, bonus: 1, deltas: { confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.0,
        blurb: "You watch them wrestle problems into submission.",
        coachNote: "Ownership turns effort into pride. You stayed close without taking over, so they felt capable." },
      { id: "micromanage", label: "Micromanage Everything", emoji: "😤", cost: 0, bonus: -3, deltas: { confidence: -0.4, discipline: -0.1 }, loveDelta: -0.5, stressDelta: 0.6,
        blurb: "The project works… but they don't feel like it's theirs anymore.",
        backfireNote: "When you run the whole show, the kid stops feeling like it’s theirs. Confidence drops because autonomy disappears." },
    ],
    resultText: {
      win: "They win. Their machine works when it matters. They look unstoppable.",
      place: "They place! The judges nod with respect. You try not to cry about it.",
      noplace: "No podium. But they learned the real maker rule: iterate, iterate, iterate."
    }
  },

  debateForum: {
    title: "Debate Forum",
    emoji: "⚖️",
    stateKey: "debateForum",
    levels: [
      { label: "Classroom Debate Day", entryCost: 20, blurb: "Low stakes, high opinions." },
      { label: "Regional Debate Tournament", entryCost: 70, blurb: "Timers, note cards, and a lot of water bottles." },
      { label: "State Mock Trial", entryCost: 150, blurb: "They learn what 'objection' really feels like." },
      { label: "National Youth Congress", entryCost: 260, blurb: "Big rooms. Big voices. Big growth." },
    ],
    statWeights: { confidence: 0.40, empathy: 0.25, intelligence: 0.25, discipline: 0.10 },
    entries: [
      { id: "psych_talk", label: "Psychology Presentation", emoji: "🧠", tags: ["PEOPLE", "PEOPLE_PSYCHOLOGY"], seedReward: { leadership: 1 } },
      { id: "health_talk", label: "Health & First Aid Talk", emoji: "🩺", tags: ["PEOPLE", "PEOPLE_MEDICINE"], seedReward: { hero: 1 } },
      { id: "tutoring_pitch", label: "Peer Tutoring Pitch", emoji: "📚", tags: ["PEOPLE", "PEOPLE_EDUCATION"], seedReward: { leadership: 1 } },
      { id: "mock_trial", label: "Mock Trial Case", emoji: "⚖️", tags: ["PEOPLE", "PEOPLE_LAW"], seedReward: { leadership: 1, hero: 1 } },
      { id: "service_speech", label: "Service Campaign Speech", emoji: "🏛️", tags: ["PEOPLE", "PEOPLE_PUBLIC_SERVICE"], seedReward: { hero: 1, leadership: 1 } },
    ],
    supports: [
      { id: "practice_kindly", label: "Practice Kindly", emoji: "🫶", cost: 0, bonus: 2, deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1,
        blurb: "You run speeches together with encouragement, not judgment.",
        coachNote: "Warm rehearsal builds confidence and empathy. Feeling safe makes their voice stronger." },
      { id: "workshop", label: "Enroll in Workshop", emoji: "🗣️", cost: 250, bonus: 3, deltas: { confidence: 0.3 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "They learn structure, pacing, and how to breathe mid-argument.",
        coachNote: "Structure + practice gives them something solid to stand on when nerves hit." },
      { id: "hire_coach", label: "Hire a Coach", emoji: "👔", cost: 450, bonus: 4, deltas: { confidence: 0.4, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.1,
        blurb: "A coach helps them sharpen without becoming sharp.",
        coachNote: "A pro helps them level up without turning it into a parent‑kid power struggle." },
      { id: "let_them_improvise", label: "Let Them Improvise", emoji: "✨", cost: 0, bonus: 1, deltas: { confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.0,
        blurb: "You let them find their voice in real time.",
        coachNote: "Ownership turns effort into pride. You stayed close without taking over, so they felt capable." },
      { id: "pressure_win", label: "Pressure to Win", emoji: "😬", cost: 0, bonus: -3, deltas: { empathy: -0.2, confidence: -0.2 }, loveDelta: -0.5, stressDelta: 0.6,
        blurb: "They speak well… but it feels like they're speaking *for you*.",
        backfireNote: "Turning it into a win-or-else moment swaps curiosity for fear. They might perform, but they won’t feel safe." },
    ],
    resultText: {
      win: "They win. Their voice fills the room like it belongs there.",
      place: "They place! People listen. Really listen.",
      noplace: "No trophy today. But they learn something rarer: how to stand up anyway."
    }
  }
};

const THRESHOLDS = [
  { levelIndex: 0, place: 22, win: 26 },
  { levelIndex: 1, place: 28, win: 32 },
  { levelIndex: 2, place: 34, win: 38 },
  { levelIndex: 3, place: 40, win: 44 }
];

export default function SchoolExtracurricularModal({ open, eventId, onClose }) {
  const { gameState, spendFocus, applyMoneyDelta, applyDeltas, applyLove, applyStress, addLog, recordTimelineEntry, updateState } = useGameState();
  const [step, setStep] = React.useState(1);
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [selectedSupport, setSelectedSupport] = React.useState(null);
  const [result, setResult] = React.useState(null);

  // Prevent body scroll
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

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedEntry(null);
      setSelectedSupport(null);
      setResult(null);
    }
  }, [open, eventId]);

  const event = eventId ? SCHOOL_EVENTS[eventId] : null;
  if (!open) return null;
  if (!event) {
    // Friendly fail: unknown or misconfigured id
    try { console.error('[SchoolExtracurricularModal] Unknown event id:', eventId); } catch {}
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[120]" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[121] flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Activity unavailable</h3>
                <p className="text-sm text-slate-600 mb-4">That school activity isn’t available right now.</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  const stateData = gameState.education?.[event.stateKey] || { levelIndex: 0, history: [], enteredByAge: {}, wonNational: false };
  const hasWonNational = !!stateData.wonNational;
  const currentLevel = event.levels[stateData.levelIndex] || event.levels[0];
  const isLastLevel = stateData.levelIndex >= event.levels.length - 1;
  const alreadyEntered = stateData.enteredByAge[gameState.currentYear];

  const handleNext = () => {
    if (step === 1 && alreadyEntered) {
      // Show "already entered" and don't proceed
      return;
    }
    
    if (step === 1) setStep(2);
    else if (step === 2 && selectedEntry) setStep(3);
    else if (step === 3 && selectedSupport) {
      // Calculate result
      const weights = event.statWeights;
      const stats = gameState.stats || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
      
      let baseScore = 
        (weights.intelligence || 0) * stats.intelligence +
        (weights.empathy || 0) * stats.empathy +
        (weights.discipline || 0) * stats.discipline +
        (weights.confidence || 0) * stats.confidence;
      
      // Fit bonuses
      let fitBonus = 0;
      const primaryInterest = gameState.childProfile?.primaryInterest;
      const pubertyPassion = gameState.childProfile?.pubertyPassion;
      
      if (primaryInterest && selectedEntry.tags.includes(primaryInterest)) fitBonus += 1;
      if (pubertyPassion && selectedEntry.tags.includes(pubertyPassion)) fitBonus += 1;
      
      // RNG jitter
      const rngJitter = (Math.random() * 4) - 2;
      
      const score = baseScore + selectedSupport.bonus + fitBonus + rngJitter;
      
      // Determine result
      const threshold = THRESHOLDS[stateData.levelIndex] || THRESHOLDS[0];
      let resultType = 'noplace';
      if (score >= threshold.win) resultType = 'win';
      else if (score >= threshold.place) resultType = 'place';
      
      // Apply costs
      const totalCost = currentLevel.entryCost + selectedSupport.cost;
      spendFocus(1, event.title);
      applyMoneyDelta(-totalCost, event.title);
      
      // Apply support effects
      const supportDeltas = {
        intelligence: selectedSupport.deltas.intelligence || 0,
        empathy: selectedSupport.deltas.empathy || 0,
        discipline: selectedSupport.deltas.discipline || 0,
        confidence: selectedSupport.deltas.confidence || 0
      };
      applyDeltas(supportDeltas, event.title);
      applyLove(selectedSupport.loveDelta || 0, event.title);
      applyStress(selectedSupport.stressDelta || 0, event.title);
      
      // Update state
      let newLevelIndex = stateData.levelIndex;
      let wonNational = stateData.wonNational;
      
      if (resultType === 'win') {
        if (isLastLevel) {
          wonNational = true;
        } else {
          newLevelIndex++;
        }
      }
      
      // Apply seed rewards on place/win
      if (resultType !== 'noplace') {
        const newSeeds = { ...(gameState.room?.seeds || {}) };
        Object.keys(selectedEntry.seedReward).forEach(key => {
          newSeeds[key] = (newSeeds[key] || 0) + selectedEntry.seedReward[key];
        });
        
        updateState({
          room: {
            ...gameState.room,
            seeds: newSeeds
          }
        });
      }
      
      // Save history
      const historyEntry = {
        age: gameState.currentYear,
        levelIndex: stateData.levelIndex,
        entryId: selectedEntry.id,
        supportId: selectedSupport.id,
        score: Math.round(score * 10) / 10,
        result: resultType,
        fitBonus,
        cost: totalCost
      };
      
      const newHistory = [...stateData.history, historyEntry];
      const newEnteredByAge = { ...stateData.enteredByAge, [gameState.currentYear]: true };
      
      updateState({
        education: {
          ...gameState.education,
          [event.stateKey]: {
            levelIndex: newLevelIndex,
            history: newHistory,
            enteredByAge: newEnteredByAge,
            wonNational
          }
        }
      });
      
      // Log and timeline
      addLog(`${event.emoji} ${event.title}: ${resultType === 'win' ? 'WIN' : resultType === 'place' ? 'PLACE' : 'NO PLACE'}`);
      
      recordTimelineEntry({
        kind: 'school',
        title: `Age ${gameState.currentYear}: ${event.title}`,
        detail: `${selectedEntry.label} • ${selectedSupport.label} • ${event.resultText[resultType]}`,
        deltas: supportDeltas,
        moneyDelta: -totalCost,
        loveDelta: selectedSupport.loveDelta || 0,
        stressDelta: selectedSupport.stressDelta || 0,
        meta: { 
          eventId, 
          entryId: selectedEntry.id, 
          supportId: selectedSupport.id, 
          result: resultType,
          wonNational
        }
      });
      
      setResult({ type: resultType, score, text: event.resultText[resultType] });
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[120]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[121] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <span>{event.emoji}</span>
                      <span>{event.title}</span>
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{currentLevel.label}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                {alreadyEntered && step === 1 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-lg font-semibold text-slate-700 mb-2">Already entered this year</p>
                    <p className="text-sm text-slate-500">You can only enter once per age.</p>
                  </div>
                ) : step === 1 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-slate-700 italic">{currentLevel.blurb}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-600">
                        <span className="font-semibold">Entry Cost:</span> ${formatMoney(currentLevel.entryCost)} + 1 Focus
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-semibold">Level:</span> {stateData.levelIndex + 1}/{event.levels.length}
                        {hasWonNational && ' (🏆 National Champion!)'}
                      </div>
                    </div>
                  </div>
                ) : step === 2 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Choose your entry:</h4>
                    {event.entries.map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedEntry?.id === entry.id
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{entry.emoji}</span>
                          <span className="font-medium text-slate-800">{entry.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : step === 3 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">How will you support them?</h4>
                    {event.supports.map(support => {
                      const canAfford = gameState.money >= support.cost;
                      return (
                        <button
                          key={support.id}
                          onClick={() => canAfford && setSelectedSupport(support)}
                          disabled={!canAfford}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            !canAfford
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : selectedSupport?.id === support.id
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{support.emoji}</span>
                              <span className="font-semibold text-slate-800">{support.label}</span>
                            </div>
                            <span className="text-sm text-slate-600">{support.cost > 0 ? `$${formatMoney(support.cost)}` : 'Free'}</span>
                          </div>
                          <p className="text-sm text-slate-600 italic mb-2">{support.blurb}</p>
                          <div className="text-xs text-slate-500">
                            Score bonus: {support.bonus > 0 ? `+${support.bonus}` : support.bonus}
                          </div>
                          {!canAfford && (
                            <div className="mt-2 text-xs text-red-600">Not enough money</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : step === 4 ? (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div className="text-6xl mb-4">
                        {result.type === 'win' ? '🏆' : result.type === 'place' ? '🥈' : '📝'}
                      </div>
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">
                        {result.type === 'win' ? 'Win!' : result.type === 'place' ? 'Place!' : 'No Placement'}
                      </h4>
                      <p className="text-base text-slate-700 mb-4">{result.text}</p>
                      <div className="text-sm text-slate-500">Score: {result.score.toFixed(1)}</div>
                    </div>
                    
                    {result.type === 'win' && isLastLevel && (
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                        <p className="text-sm font-semibold text-amber-800 text-center">
                          🏆 National Champion!
                        </p>
                      </div>
                    )}
                    {result.type === 'win' && !isLastLevel && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          ✨ Advanced to next level: {event.levels[stateData.levelIndex + 1]?.label}
                        </p>
                      </div>
                    )}

                    {/* Explainer Notes */}
                    {(selectedSupport.coachNote || selectedSupport.backfireNote) && (
                      <div className="space-y-2 mt-4">
                        {selectedSupport.coachNote && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-left">
                            <p className="text-xs font-semibold text-purple-800 mb-1">💡 Why this worked</p>
                            <p className="text-xs text-purple-700 leading-relaxed">{selectedSupport.coachNote}</p>
                          </div>
                        )}
                        {selectedSupport.backfireNote && (
                          <div className="bg-rose-50 p-3 rounded-lg border border-rose-100 text-left">
                            <p className="text-xs font-semibold text-rose-800 mb-1">⚠️ Why this backfired</p>
                            <p className="text-xs text-rose-700 leading-relaxed">{selectedSupport.backfireNote}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                {step > 1 && step < 4 && (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                  >
                    ← Back
                  </button>
                )}
                {step < 4 && !alreadyEntered ? (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (step === 1 && alreadyEntered) ||
                      (step === 2 && !selectedEntry) ||
                      (step === 3 && !selectedSupport)
                    }
                    className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {step === 1 ? 'Enter' : step === 2 ? 'Choose' : 'Go!'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : step === 4 ? (
                  <Button onClick={handleClose} className="ml-auto">
                    Done
                  </Button>
                ) : alreadyEntered ? (
                  <Button onClick={handleClose} className="ml-auto">
                    Close
                  </Button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}