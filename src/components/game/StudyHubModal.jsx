import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import LessonPopup from './LessonPopup';
import { POSITIVE_PARENTING_LESSONS } from './positiveParentingLessons';
import StudyBlitzMiniGame from '@/components/game/minigames/StudyBlitzMiniGame';
import { NONVIOLENT_COMMUNICATION_LESSONS } from './nonviolentCommunicationLessons';
import { EMOTION_COACHING_LESSONS } from './emotionCoachingLessons';
import { CBT_SKILLS_LESSONS } from './cbtSkillsLessons';
import { HABIT_BUILDING_LESSONS } from './habitBuildingLessons';
import { BOUNDARIES_ASSERTIVENESS_LESSONS } from './boundariesAssertivenessLessons';
import { POLYVAGAL_BASICS_LESSONS } from './polyvagalBasicsLessons';
import { JUVENILE_HALL_PROGRAMS } from '@/components/game/packJuvenileJustice';

export default function StudyHubModal({ open, onClose }) {
  const { gameState, getAvailability, spendFocus, applyDeltas, applyLove, applyStress, updateState, emitActionResult, addLog, recordTimelineEntry, awardStudyPoints } = useGameState();
  const { currentYear, studyProgress } = gameState;
  const [lessonPopupOpen, setLessonPopupOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isReview, setIsReview] = useState(false);
  const [currentModuleConfig, setCurrentModuleConfig] = useState(null);
  const [blitzOpen, setBlitzOpen] = useState(false);

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

  const ppProgress = studyProgress?.positiveParenting || { completedCount: 0, nextIndex: 0, seenIndexes: [] };
  const isCompleted = ppProgress.completedCount >= 20;
  
  const nvcProgress = studyProgress?.nvc || { completedCount: 0, seenIndexes: [] };
  const emotionCoachingProgress = studyProgress?.emotionCoaching || { completedCount: 0, seenIndexes: [] };
  const cbtSkillsProgress = studyProgress?.cbtSkills || { completedCount: 0, seenIndexes: [] };
  const habitBuildingProgress = studyProgress?.habitBuilding || { completedCount: 0, seenIndexes: [] };
  const boundariesProgress = studyProgress?.boundariesAssertiveness || { completedCount: 0, seenIndexes: [] };
  const polyvagalProgress = studyProgress?.polyvagalBasics || { completedCount: 0, seenIndexes: [] };

  const handleStudy = () => {
    // Check availability
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) {
      console.log('Study blocked:', avail.reasonText);
      return;
    }

    // Check if completed
    if (isCompleted) {
      // Review mode - no cost, no gain
      handleReview();
      return;
    }

    // Spend focus
    if (!spendFocus(1, "Study: Positive Parenting")) return;
    awardStudyPoints(1, "Study: Positive Parenting");

    // Get lesson
    const lessonIndex = Math.min(ppProgress.nextIndex, POSITIVE_PARENTING_LESSONS.length - 1);
    const lesson = POSITIVE_PARENTING_LESSONS[lessonIndex];
    const newCount = ppProgress.completedCount + 1;
    const newNextIndex = Math.min(ppProgress.nextIndex + 1, POSITIVE_PARENTING_LESSONS.length - 1);

    // Update progress
    updateState({
      studyProgress: {
        ...studyProgress,
        positiveParenting: {
          completedCount: newCount,
          nextIndex: newNextIndex,
          seenIndexes: [...ppProgress.seenIndexes, lessonIndex]
        }
      }
    });

    // Apply confidence boost
    applyDeltas({ confidence: 0.1, intelligence: 0, empathy: 0, discipline: 0 }, "Study: Positive Parenting");

    // Log
    addLog(`🌱 Studied Positive Parenting (${newCount}/20): ${lesson.title}`);

    // Record timeline
    recordTimelineEntry({
      kind: 'study',
      title: `🌱 Studied Positive Parenting (${newCount}/20)`,
      detail: lesson.title,
      deltas: { confidence: 0.1, intelligence: 0, empathy: 0, discipline: 0 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { module: 'positiveParenting', lessonIndex, lessonTitle: lesson.title }
    });

    // Emit action result
    emitActionResult({
      actionId: 'study',
      title: '🌱 Positive Parenting',
      body: `Lesson ${newCount}/20: ${lesson.title}`,
      deltas: { confidence: 0.1, intelligence: 0, empathy: 0, discipline: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'positive_parenting'],
      meta: { emoji: '🌱', lesson: lesson.title }
    });

    // Show lesson popup
    setCurrentLesson({ ...lesson, count: newCount });
    setCurrentModuleConfig({
      emoji: "🌱",
      title: "Positive Parenting",
      progressText: `Lesson ${newCount}/20`,
      benefitsText: "Δ Confidence +0.1 • Focus -1"
    });
    setIsReview(false);
    setLessonPopupOpen(true);
  };

  const handleReview = () => {
    // Pick a random lesson
    let lessonIndex = Math.floor(Math.random() * POSITIVE_PARENTING_LESSONS.length);
    const lesson = POSITIVE_PARENTING_LESSONS[lessonIndex];

    // Show lesson popup (review mode)
    setCurrentLesson({ ...lesson, count: 20 });
    setCurrentModuleConfig({
      emoji: "🌱",
      title: "Positive Parenting",
      progressText: `Lesson ${20}/20`,
      benefitsText: "Δ Confidence +0.1 • Focus -1"
    });
    setIsReview(true);
    setLessonPopupOpen(true);
  };

  // Study Blitz quick action
  const handleStartStudyBlitz = () => {
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) return;
    if (!spendFocus(1, 'Study Blitz')) return;
    awardStudyPoints(1, 'Study Blitz');
    setBlitzOpen(true);
  };

  const handleBlitzComplete = ({ correct, total, rating, effects }) => {
    // Map smarts -> intelligence
    const smarts = effects?.smarts ?? 1;
    const stress = effects?.stress ?? 0;
    if (smarts) applyDeltas({ intelligence: smarts }, 'Study Blitz');
    if (stress) applyStress(stress, 'Study Blitz');

    addLog(`📘 Study session: ${rating} (+${smarts} Smarts)`);
    recordTimelineEntry({
      kind: 'study',
      title: `📘 Study session: ${rating} (+${smarts} Smarts)`,
      detail: `Study Blitz ${correct}/${total}`,
      deltas: { intelligence: smarts },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: stress,
      meta: { mode: 'study_blitz', correct, total }
    });

    emitActionResult({
      actionId: 'study',
      title: '📘 Study Blitz',
      body: `${rating}: ${correct}/${total} correct`,
      deltas: { intelligence: smarts },
      loveDelta: 0,
      stressDelta: stress,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study','study_blitz']
    });

    setBlitzOpen(false);
  };

  const handleBlitzSkip = () => {
    // Original auto-resolve: small smart gain
    applyDeltas({ intelligence: 1 }, 'Study Blitz (Auto)');
    addLog('📘 Study session: Auto-resolve (+1 Smarts)');
    recordTimelineEntry({ kind: 'study', title: '📘 Study session: Auto-resolve (+1 Smarts)', detail: 'Skipped mini-game', deltas: { intelligence: 1 }, moneyDelta: 0, loveDelta: 0, stressDelta: 0 });
    emitActionResult({ actionId: 'study', title: '📘 Study Blitz (Auto)', body: 'Skipped mini-game', deltas: { intelligence: 1 }, loveDelta: 0, stressDelta: 0, moneyDelta: 0, focusDelta: -1, tags: ['study','auto'] });
    setBlitzOpen(false);
  };

  const handlePracticeNVC = () => {
    // Check availability
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) {
      console.log('Study blocked:', avail.reasonText);
      return;
    }

    // Spend focus
    if (!spendFocus(1, "Study: Nonviolent Communication")) return;
    awardStudyPoints(1, "Study: Nonviolent Communication");

    // Pick a lesson using no-repeat-until-exhausted approach
    let availableIndexes = [];
    for (let i = 0; i < NONVIOLENT_COMMUNICATION_LESSONS.length; i++) {
      if (!nvcProgress.seenIndexes.includes(i)) {
        availableIndexes.push(i);
      }
    }

    // If all seen, reset pool
    if (availableIndexes.length === 0) {
      availableIndexes = Array.from({ length: NONVIOLENT_COMMUNICATION_LESSONS.length }, (_, i) => i);
    }

    // Pick random from available
    const lessonIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    const lesson = NONVIOLENT_COMMUNICATION_LESSONS[lessonIndex];
    const newCount = nvcProgress.completedCount + 1;

    // Update progress
    const newSeenIndexes = availableIndexes.length === NONVIOLENT_COMMUNICATION_LESSONS.length 
      ? [lessonIndex] // Reset case: start fresh with just this one
      : [...nvcProgress.seenIndexes, lessonIndex];

    updateState({
      studyProgress: {
        ...studyProgress,
        nvc: {
          completedCount: newCount,
          seenIndexes: newSeenIndexes
        }
      }
    });

    // Apply deltas (infinitely repeatable)
    applyDeltas({ empathy: 0.1, confidence: 0.1, intelligence: 0, discipline: 0 }, "Study: Nonviolent Communication");

    // Log
    addLog(`🕊️ Practiced NVC (Session ${newCount}): ${lesson.title}`);

    // Record timeline
    recordTimelineEntry({
      kind: 'study',
      title: `🕊️ Studied — Nonviolent Communication (Session ${newCount})`,
      detail: lesson.title,
      deltas: { empathy: 0.1, confidence: 0.1, intelligence: 0, discipline: 0 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { module: 'nvc', lessonIndex, lessonTitle: lesson.title }
    });

    // Emit action result
    emitActionResult({
      actionId: 'study',
      title: '🕊️ Nonviolent Communication',
      body: `Session ${newCount}: ${lesson.title}`,
      deltas: { empathy: 0.1, confidence: 0.1, intelligence: 0, discipline: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'nvc'],
      meta: { emoji: '🕊️', lesson: lesson.title }
    });

    // Show lesson popup
    setCurrentLesson({ ...lesson, count: newCount });
    setCurrentModuleConfig({
      emoji: "🕊️",
      title: "Nonviolent Communication",
      progressText: `Session ${newCount} (repeatable)`,
      benefitsText: "Δ Empathy +0.1 • Δ Confidence +0.1 • Focus -1"
    });
    setIsReview(false);
    setLessonPopupOpen(true);
  };

  const handleEmotionCoachingPractice = () => {
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) return;

    if (!spendFocus(1, "Emotion Coaching")) return;
    awardStudyPoints(1, "Emotion Coaching");

    const moduleKey = 'emotionCoaching';
    const currentProgress = emotionCoachingProgress;

    const availableIndexes = EMOTION_COACHING_LESSONS.map((_, i) => i).filter(i => !currentProgress.seenIndexes.includes(i));
    const pool = availableIndexes.length > 0 ? availableIndexes : EMOTION_COACHING_LESSONS.map((_, i) => i);
    const chosenIndex = pool[Math.floor(Math.random() * pool.length)];
    const lesson = EMOTION_COACHING_LESSONS[chosenIndex];

    const newSeenIndexes = availableIndexes.length > 0 ? [...currentProgress.seenIndexes, chosenIndex] : [chosenIndex];
    const newCompletedCount = currentProgress.completedCount + 1;

    updateState({
      studyProgress: {
        ...studyProgress,
        [moduleKey]: {
          completedCount: newCompletedCount,
          seenIndexes: newSeenIndexes
        }
      }
    });

    applyDeltas({ intelligence: 0, empathy: 0.1, discipline: 0.1, confidence: 0 }, "Emotion Coaching");

    addLog(`🫶 Emotion Coaching: Session ${newCompletedCount} • "${lesson.title}"`);

    recordTimelineEntry({
      kind: "study",
      title: "🫶 Emotion Coaching",
      detail: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0, empathy: 0.1, discipline: 0.1, confidence: 0 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { stressAtTime: gameState.stress }
    });

    setCurrentLesson(lesson);
    setCurrentModuleConfig({
      emoji: "🫶",
      title: "Emotion Coaching",
      progressText: `Session ${newCompletedCount} (repeatable)`,
      benefitsText: "Δ Empathy +0.1 • Δ Discipline +0.1 • Focus -1"
    });
    setLessonPopupOpen(true);

    emitActionResult({
      actionId: 'study',
      title: '🫶 Emotion Coaching',
      body: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0, empathy: 0.1, discipline: 0.1, confidence: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'emotion_coaching'],
      meta: { emoji: '🫶' }
    });
  };

  const handleCBTPractice = () => {
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) return;

    if (!spendFocus(1, "CBT Skills")) return;
    awardStudyPoints(1, "CBT Skills");

    const moduleKey = 'cbtSkills';
    const currentProgress = cbtSkillsProgress;

    const availableIndexes = CBT_SKILLS_LESSONS.map((_, i) => i).filter(i => !currentProgress.seenIndexes.includes(i));
    const pool = availableIndexes.length > 0 ? availableIndexes : CBT_SKILLS_LESSONS.map((_, i) => i);
    const chosenIndex = pool[Math.floor(Math.random() * pool.length)];
    const lesson = CBT_SKILLS_LESSONS[chosenIndex];

    const newSeenIndexes = availableIndexes.length > 0 ? [...currentProgress.seenIndexes, chosenIndex] : [chosenIndex];
    const newCompletedCount = currentProgress.completedCount + 1;

    updateState({
      studyProgress: {
        ...studyProgress,
        [moduleKey]: {
          completedCount: newCompletedCount,
          seenIndexes: newSeenIndexes
        }
      }
    });

    applyDeltas({ intelligence: 0.1, empathy: 0, discipline: 0, confidence: 0.1 }, "CBT Skills");

    addLog(`🧠 CBT Skills: Session ${newCompletedCount} • "${lesson.title}"`);

    recordTimelineEntry({
      kind: "study",
      title: "🧠 CBT Skills",
      detail: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0.1, empathy: 0, discipline: 0, confidence: 0.1 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { stressAtTime: gameState.stress }
    });

    setCurrentLesson(lesson);
    setCurrentModuleConfig({
      emoji: "🧠",
      title: "CBT Skills",
      progressText: `Session ${newCompletedCount} (repeatable)`,
      benefitsText: "Δ Intelligence +0.1 • Δ Confidence +0.1 • Focus -1"
    });
    setLessonPopupOpen(true);

    emitActionResult({
      actionId: 'study',
      title: '🧠 CBT Skills',
      body: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0.1, empathy: 0, discipline: 0, confidence: 0.1 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'cbt'],
      meta: { emoji: '🧠' }
    });
  };

  const handleHabitBuildingPractice = () => {
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) return;

    if (!spendFocus(1, "Habit Building & Routines")) return;
    awardStudyPoints(1, "Habit Building & Routines");

    const moduleKey = 'habitBuilding';
    const currentProgress = habitBuildingProgress;

    const availableIndexes = HABIT_BUILDING_LESSONS.map((_, i) => i).filter(i => !currentProgress.seenIndexes.includes(i));
    const pool = availableIndexes.length > 0 ? availableIndexes : HABIT_BUILDING_LESSONS.map((_, i) => i);
    const chosenIndex = pool[Math.floor(Math.random() * pool.length)];
    const lesson = HABIT_BUILDING_LESSONS[chosenIndex];

    const newSeenIndexes = availableIndexes.length > 0 ? [...currentProgress.seenIndexes, chosenIndex] : [chosenIndex];
    const newCompletedCount = currentProgress.completedCount + 1;

    updateState({
      studyProgress: {
        ...studyProgress,
        [moduleKey]: {
          completedCount: newCompletedCount,
          seenIndexes: newSeenIndexes
        }
      }
    });

    applyDeltas({ intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0.1 }, "Habit Building & Routines");

    addLog(`🗓️ Habit Building & Routines: Session ${newCompletedCount} • "${lesson.title}"`);

    recordTimelineEntry({
      kind: "study",
      title: "🗓️ Habit Building & Routines",
      detail: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0.1 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { stressAtTime: gameState.stress }
    });

    setCurrentLesson(lesson);
    setCurrentModuleConfig({
      emoji: "🗓️",
      title: "Habit Building & Routines",
      progressText: `Session ${newCompletedCount} (repeatable)`,
      benefitsText: "Δ Discipline +0.1 • Δ Confidence +0.1 • Focus -1"
    });
    setLessonPopupOpen(true);

    emitActionResult({
      actionId: 'study',
      title: '🗓️ Habit Building & Routines',
      body: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0.1 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'habits'],
      meta: { emoji: '🗓️' }
    });
  };

  const handleBoundariesPractice = () => {
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) return;

    if (!spendFocus(1, "Boundaries & Assertiveness")) return;
    awardStudyPoints(1, "Boundaries & Assertiveness");

    const moduleKey = 'boundariesAssertiveness';
    const currentProgress = boundariesProgress;

    const availableIndexes = BOUNDARIES_ASSERTIVENESS_LESSONS.map((_, i) => i).filter(i => !currentProgress.seenIndexes.includes(i));
    const pool = availableIndexes.length > 0 ? availableIndexes : BOUNDARIES_ASSERTIVENESS_LESSONS.map((_, i) => i);
    const chosenIndex = pool[Math.floor(Math.random() * pool.length)];
    const lesson = BOUNDARIES_ASSERTIVENESS_LESSONS[chosenIndex];

    const newSeenIndexes = availableIndexes.length > 0 ? [...currentProgress.seenIndexes, chosenIndex] : [chosenIndex];
    const newCompletedCount = currentProgress.completedCount + 1;

    updateState({
      studyProgress: {
        ...studyProgress,
        [moduleKey]: {
          completedCount: newCompletedCount,
          seenIndexes: newSeenIndexes
        }
      }
    });

    applyDeltas({ intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0.1 }, "Boundaries & Assertiveness");

    addLog(`🛡️ Boundaries & Assertiveness: Session ${newCompletedCount} • "${lesson.title}"`);

    recordTimelineEntry({
      kind: "study",
      title: "🛡️ Boundaries & Assertiveness",
      detail: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0.1 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { stressAtTime: gameState.stress }
    });

    setCurrentLesson(lesson);
    setCurrentModuleConfig({
      emoji: "🛡️",
      title: "Boundaries & Assertiveness",
      progressText: `Session ${newCompletedCount} (repeatable)`,
      benefitsText: "Δ Confidence +0.1 • Δ Discipline +0.1 • Focus -1"
    });
    setLessonPopupOpen(true);

    emitActionResult({
      actionId: 'study',
      title: '🛡️ Boundaries & Assertiveness',
      body: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0, empathy: 0, discipline: 0.1, confidence: 0.1 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'boundaries'],
      meta: { emoji: '🛡️' }
    });
  };

  const handlePolyvagalPractice = () => {
    const avail = getAvailability({ type: 'action', id: 'study', focusCost: 1 });
    if (!avail.enabled) return;

    if (!spendFocus(1, "Polyvagal Basics")) return;
    awardStudyPoints(1, "Polyvagal Basics");

    const moduleKey = 'polyvagalBasics';
    const currentProgress = polyvagalProgress;

    const availableIndexes = POLYVAGAL_BASICS_LESSONS.map((_, i) => i).filter(i => !currentProgress.seenIndexes.includes(i));
    const pool = availableIndexes.length > 0 ? availableIndexes : POLYVAGAL_BASICS_LESSONS.map((_, i) => i);
    const chosenIndex = pool[Math.floor(Math.random() * pool.length)];
    const lesson = POLYVAGAL_BASICS_LESSONS[chosenIndex];

    const newSeenIndexes = availableIndexes.length > 0 ? [...currentProgress.seenIndexes, chosenIndex] : [chosenIndex];
    const newCompletedCount = currentProgress.completedCount + 1;

    updateState({
      studyProgress: {
        ...studyProgress,
        [moduleKey]: {
          completedCount: newCompletedCount,
          seenIndexes: newSeenIndexes
        }
      }
    });

    applyDeltas({ intelligence: 0.1, empathy: 0.1, discipline: 0, confidence: 0 }, "Polyvagal Basics");

    addLog(`🫧 Polyvagal Basics: Session ${newCompletedCount} • "${lesson.title}"`);

    recordTimelineEntry({
      kind: "study",
      title: "🫧 Polyvagal Basics",
      detail: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0.1, empathy: 0.1, discipline: 0, confidence: 0 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      meta: { stressAtTime: gameState.stress }
    });

    setCurrentLesson(lesson);
    setCurrentModuleConfig({
      emoji: "🫧",
      title: "Polyvagal Basics",
      progressText: `Session ${newCompletedCount} (repeatable)`,
      benefitsText: "Δ Empathy +0.1 • Δ Intelligence +0.1 • Focus -1"
    });
    setLessonPopupOpen(true);

    emitActionResult({
      actionId: 'study',
      title: '🫧 Polyvagal Basics',
      body: `Session ${newCompletedCount}: ${lesson.title}`,
      deltas: { intelligence: 0.1, empathy: 0.1, discipline: 0, confidence: 0 },
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: -1,
      tags: ['study', 'polyvagal'],
      meta: { emoji: '🫧' }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">📚 Study</h3>
                  <p className="text-sm text-slate-500">Learn tools that unlock better choices.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Study Blitz Quick Action */}
                <div className="mb-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">⚡</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Study Blitz</div>
                      <div className="text-sm text-slate-600">5 quick questions • ~20 seconds • boosts Smarts</div>
                    </div>
                  </div>
                  <button onClick={handleStartStudyBlitz} disabled={gameState.actionPoints < 1} className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:bg-slate-300">Start (1 Focus)</button>
                </div>
                {/* Positive Parenting Module */}
                <div className="bg-white rounded-xl border-2 border-emerald-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🌱</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Positive Parenting</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Build your child's confidence through connection-based parenting.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                          {ppProgress.completedCount}/20
                        </span>
                        {!isCompleted && (
                          <span>1 Focus per lesson</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleStudy}
                    className={`w-full ${isCompleted ? 'bg-slate-500 hover:bg-slate-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                  >
                    {isCompleted ? '📖 Review' : '📚 Study'}
                  </Button>
                </div>

                {/* Nonviolent Communication Module */}
                <div className="mt-4 bg-white rounded-xl border-2 border-blue-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🕊️</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Nonviolent Communication</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Practice calm language that reduces conflict and increases cooperation.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          Sessions: {nvcProgress.completedCount}
                        </span>
                        <span>1 Focus per session</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePracticeNVC}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    🕊️ Practice (1 Focus)
                  </Button>
                </div>

                {/* Emotion Coaching Module */}
                <div className="mt-4 bg-white rounded-xl border-2 border-rose-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🫶</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Emotion Coaching</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Help kids name feelings, calm down faster, and learn from hard moments.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full font-semibold">
                          Sessions: {emotionCoachingProgress.completedCount}
                        </span>
                        <span>1 Focus per session</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleEmotionCoachingPractice}
                    disabled={gameState.actionPoints < 1}
                    className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300"
                  >
                    Practice (1 Focus)
                  </Button>
                </div>

                {/* CBT Skills Module */}
                <div className="mt-4 bg-white rounded-xl border-2 border-purple-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🧠</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">CBT Skills</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Train your mind to spot thought traps and respond with steadier choices.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                          Sessions: {cbtSkillsProgress.completedCount}
                        </span>
                        <span>1 Focus per session</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCBTPractice}
                    disabled={gameState.actionPoints < 1}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300"
                  >
                    Practice (1 Focus)
                  </Button>
                </div>

                {/* Habit Building & Routines Module */}
                <div className="mt-4 bg-white rounded-xl border-2 border-amber-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🗓️</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Habit Building & Routines</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Build routines that stick, even when life gets messy.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">
                          Sessions: {habitBuildingProgress.completedCount}
                        </span>
                        <span>1 Focus per session</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleHabitBuildingPractice}
                    disabled={gameState.actionPoints < 1}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300"
                  >
                    Practice (1 Focus)
                  </Button>
                </div>

                {/* Boundaries & Assertiveness Module */}
                <div className="mt-4 bg-white rounded-xl border-2 border-orange-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🛡️</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Boundaries & Assertiveness</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Hold loving limits without yelling, lecturing, or collapsing.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                          Sessions: {boundariesProgress.completedCount}
                        </span>
                        <span>1 Focus per session</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBoundariesPractice}
                    disabled={gameState.actionPoints < 1}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300"
                  >
                    Practice (1 Focus)
                  </Button>
                </div>

                {/* Polyvagal Basics Module */}
                <div className="mt-4 bg-white rounded-xl border-2 border-teal-200 p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">🫧</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-lg mb-1">Polyvagal Basics</div>
                      <div className="text-sm text-slate-600 mb-2">
                        Understand nervous system states so you can choose calm more often.
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full font-semibold">
                          Sessions: {polyvagalProgress.completedCount}
                        </span>
                        <span>1 Focus per session</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePolyvagalPractice}
                    disabled={gameState.actionPoints < 1}
                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300"
                  >
                    Practice (1 Focus)
                  </Button>
                </div>

                {/* JUVENILE HALL PROGRAMS (Visible Only in Hall) */}
                {gameState.juvenileJustice?.hall?.active && (
                  <div className="mt-6 bg-slate-100 rounded-xl border-2 border-slate-300 p-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <span>🏛️</span> Juvenile Hall Programs
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Rehabilitation and skill-building while serving time. Costs 1 Focus.
                    </p>
                    
                    <div className="space-y-3">
                      {JUVENILE_HALL_PROGRAMS.map(program => (
                        <div key={program.id} className="bg-white p-3 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold text-slate-800 text-sm">{program.title}</div>
                              <div className="text-xs text-slate-500">{program.desc}</div>
                            </div>
                            <Button
                              size="sm"
                              disabled={gameState.actionPoints < 1}
                              onClick={() => {
                                if (!spendFocus(1, program.title)) return;
                                
                                // Apply deltas
                                applyDeltas(program.deltas, `JH: ${program.title}`);
                                if (program.loveDelta) applyLove(program.loveDelta, `JH: ${program.title}`);
                                if (program.stressDelta) applyStress(program.stressDelta, `JH: ${program.title}`);
                                
                                // Update JJ stats
                                updateState(prev => {
                                  const jj = prev.juvenileJustice || {};
                                  const clamp = (n) => Math.max(0, Math.min(100, n));
                                  
                                  return {
                                    juvenileJustice: {
                                      ...jj,
                                      spree: clamp((jj.spree || 0) + (program.jj.spree || 0)),
                                      heat: clamp((jj.heat || 0) + (program.jj.heat || 0)),
                                      remorse: clamp((jj.remorse || 0) + (program.jj.remorse || 0)),
                                      crimeIdentity: clamp((jj.crimeIdentity || 0) + (program.jj.crimeIdentity || 0)),
                                      crew: clamp((jj.crew || 0) + (program.jj.crew || 0)),
                                      record: Math.max(0, (jj.record || 0) + (program.jj.record || 0))
                                    }
                                  };
                                });
                                
                                addLog(`🏛️ Completed: ${program.title}`);
                                recordTimelineEntry({
                                  kind: 'study',
                                  title: `🏛️ JH Program: ${program.title}`,
                                  detail: program.desc,
                                  deltas: program.deltas,
                                  moneyDelta: 0,
                                  loveDelta: 0,
                                  stressDelta: 0
                                });
                              }}
                              className="h-8 text-xs"
                            >
                              Start
                            </Button>
                          </div>
                          <div className="flex gap-2 text-[10px] text-slate-400">
                            {Object.entries(program.deltas || {}).map(([k, v]) => (
                              <span key={k}>{k.substr(0,3).toUpperCase()} +{v}</span>
                            ))}
                            {program.jj?.spree && <span className="text-emerald-600">Spree {program.jj.spree}</span>}
                            {program.jj.heat && <span className="text-emerald-600">Heat {program.jj.heat}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <LessonPopup
            open={lessonPopupOpen}
            lesson={currentLesson}
            isReview={isReview}
            onClose={() => setLessonPopupOpen(false)}
            moduleEmoji={currentModuleConfig?.emoji}
            moduleTitle={currentModuleConfig?.title}
            progressText={currentModuleConfig?.progressText}
            benefitsText={currentModuleConfig?.benefitsText}
          />

          <StudyBlitzMiniGame
            open={blitzOpen}
            onClose={handleBlitzSkip}
            onSkip={handleBlitzSkip}
            onComplete={handleBlitzComplete}
          />
        </>
      )}
    </AnimatePresence>
  );
}