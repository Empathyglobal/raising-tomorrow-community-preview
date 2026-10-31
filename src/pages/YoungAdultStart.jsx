import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from '@/components/game/GameStateContext';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';

export default function YoungAdultStart() {
  const navigate = useNavigate();
  const { gameState, resetGame, updateState } = useGameState();
  const hasInitializedRef = useRef(false);
  const [snapshot, setSnapshot] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // One-time initialization on mount (convert finished parenting run into adult chapter)
  useEffect(() => {
    // Guard: only initialize once AND only when coming from a finished parenting run
    if (hasInitializedRef.current) return;
    if (gameState.lifeStage === 'youngAdult') {
      // Already converted, just show UI
      setIsReady(true);
      return;
    }
    if (gameState.finished !== true) {
      // Not a finished run, redirect to Start
      navigate(createPageUrl('Start'));
      return;
    }

    // Mark as initialized to prevent loops
    hasInitializedRef.current = true;

    // Take snapshot of graduating child
    const childSnap = {
      childName: gameState.childName || 'Alex',
      childAvatarGender: gameState.childAvatarGender || 'boy',
      childAvatarToneIndex: gameState.childAvatarToneIndex ?? 2,
      childAvatarSpriteIndex: gameState.childAvatarSpriteIndex ?? 0,
      stats: { ...(gameState.stats || {}) },
      finalOutcome: gameState.finalOutcome || null,
      lastRunSummary: gameState.lastRunSummary || null,
      countryIso3: gameState.countryIso3 || 'USA'
    };

    setSnapshot(childSnap);

    // Derive new player role from child gender
    const newParentRole = childSnap.childAvatarGender === 'girl' ? 'mom' : 'dad';
    const newParentAvatarGender = childSnap.childAvatarGender === 'girl' ? 'female' : 'male';
    const newParentAvatar = childSnap.childAvatarGender === 'girl' ? '👩' : '👨';

    // Reset game as adult (no child)
    const resetOk = resetGame(
      'placeholder', // childNameArg (ignored because hasChild will be false)
      null, // childProfile
      'single', // householdType
      'low', // incomeTier
      newParentRole,
      null, // legacyConfig
      null, // careerConfig
      null, // countryConfig
      {} // overrides
    );

    if (!resetOk) {
      console.error('[YoungAdultStart] resetGame failed');
      navigate(createPageUrl('Start'));
      return;
    }

    // Enforce adult chapter state
    setTimeout(() => {
      updateState(prev => ({
        lifeStage: 'youngAdult',
        hasChild: false,
        finished: false,
        currentYear: 18,
        endAge: 80,
        birthIntroPending: false,
        birthIntroCompleted: true,
        scenarioPending: false,
        pendingScenario: false,
        scenarioCompletedThisAge: true,
        currentScenario: null,
        parentName: childSnap.childName,
        parentAgeAtBirth: 0,
        stats: childSnap.stats,
        finalOutcome: childSnap.finalOutcome,
        lastRunSummary: childSnap.lastRunSummary,
        countryIso3: childSnap.countryIso3,
        parentAvatarGender: newParentAvatarGender,
        parentAvatarSpriteIndex: childSnap.childAvatarSpriteIndex,
        parentAvatar: newParentAvatar
      }));

      setIsReady(true);
    }, 100);
  }, [gameState.finished, gameState.lifeStage, navigate, resetGame, updateState]);

  const handleUniversity = () => {
    updateState(prev => ({ 
      ...prev, 
      ui: { ...(prev.ui || {}), queuedHubOpen: 'education' } 
    }));
    navigate(createPageUrl('Game'));
  };

  const handleJob = () => {
    updateState(prev => ({ 
      ...prev, 
      ui: { ...(prev.ui || {}), queuedHubOpen: 'career' } 
    }));
    navigate(createPageUrl('Game'));
  };

  const handleDecideLater = () => {
    navigate(createPageUrl('Game'));
  };

  if (!isReady || !snapshot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Starting your adult chapter...</p>
        </div>
      </div>
    );
  }

  // Normalize letter section (can be string OR object with headline/paragraphs/etc)
  const letterRaw = snapshot?.finalOutcome?.sections?.letter;
  let letter = '';
  
  if (typeof letterRaw === 'string') {
    letter = letterRaw;
  } else if (letterRaw && typeof letterRaw === 'object') {
    // Extract text from structured letter object
    const parts = [];
    if (letterRaw.headline) parts.push(letterRaw.headline);
    
    // paragraphs is an array of strings
    if (Array.isArray(letterRaw.paragraphs)) {
      parts.push(...letterRaw.paragraphs.filter(p => typeof p === 'string'));
    } else if (letterRaw.paragraph) {
      parts.push(letterRaw.paragraph);
    }
    
    // bullets is an array
    if (Array.isArray(letterRaw.bullets) && letterRaw.bullets.length > 0) {
      parts.push('\n' + letterRaw.bullets.map(b => `• ${b}`).join('\n'));
    }
    
    // tinyTruths is an array
    if (Array.isArray(letterRaw.tinyTruths) && letterRaw.tinyTruths.length > 0) {
      parts.push('\n' + letterRaw.tinyTruths.join('\n'));
    } else if (letterRaw.tinyTruth) {
      parts.push('\n' + letterRaw.tinyTruth);
    }
    
    letter = parts.filter(Boolean).join('\n\n');
  }
  
  // Fallback if still empty
  if (!letter) {
    letter = `Dear ${snapshot.childName},\n\nYou made it. Eighteen years of choices, struggles, and tiny victories. Whatever comes next is yours to shape.\n\nYou've got this.\n\n— Your former guardian`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to Adulthood
          </h1>
          <p className="text-slate-600">
            You are now {snapshot.childName}, age 18. The parenting chapter is over. This is your story now.
          </p>
        </div>

        {/* Final Letter */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 mb-8">
          <div className="text-sm font-medium text-amber-900 mb-2">A Letter From Your Guardian</div>
          <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {letter}
          </div>
        </div>

        {/* Path Choice */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">What's next?</h2>
          
          <button
            onClick={handleUniversity}
            className="w-full p-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold mb-1">Apply to University</div>
                <div className="text-sm text-blue-100">Pursue higher education and academic growth</div>
              </div>
              <GraduationCap className="w-10 h-10 text-blue-100" />
            </div>
          </button>

          <button
            onClick={handleJob}
            className="w-full p-6 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold mb-1">Get a Job</div>
                <div className="text-sm text-emerald-100">Start earning money and build your career</div>
              </div>
              <Briefcase className="w-10 h-10 text-emerald-100" />
            </div>
          </button>

          <div className="text-center pt-4">
            <button
              onClick={handleDecideLater}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Decide later
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}