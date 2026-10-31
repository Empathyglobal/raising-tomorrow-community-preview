import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useGameState } from "@/components/game/GameStateContext";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TECHNIQUE_INFO = {
  nvc: {
    name: "Nonviolent Communication",
    emoji: "🕊️",
    practice: "Feeling → Need → Request"
  },
  boundaries: {
    name: "Kind Boundaries",
    emoji: "🧱",
    practice: "Calm limit + consistent follow-through"
  },
  coreg: {
    name: "Co-Regulation",
    emoji: "🌊",
    practice: "Calm first, then teach"
  },
  pospsych: {
    name: "Positive Psychology",
    emoji: "🌟",
    practice: "Notice effort, reinforce growth"
  }
};

export default function Toolbox() {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const techniquesUnlocked = (gameState && gameState.techniquesUnlocked) ? gameState.techniquesUnlocked : {};
  const studyHistory = Array.isArray(gameState?.studyHistory) ? gameState.studyHistory : [];

  const unlockedTechniques = Object.entries(techniquesUnlocked)
    .filter(([_, unlocked]) => unlocked)
    .map(([id]) => id);

  const getStudiedAge = (techId) => {
    const entry = studyHistory.find(h => h.techniqueId === techId);
    return entry ? entry.age : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Button
              onClick={() => navigate(createPageUrl('Game'))}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-800">Toolbox</h1>
          </div>
          <p className="text-xs text-slate-500 ml-11">
            Parenting tools you've studied ({unlockedTechniques.length})
          </p>
        </motion.div>

        {unlockedTechniques.length === 0 ? (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-slate-500 italic">No tools studied yet</p>
            <p className="text-xs text-slate-400 mt-2">Visit Study Hub to learn new techniques</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {unlockedTechniques.map((techId, idx) => {
              const info = TECHNIQUE_INFO[techId] || { name: techId, emoji: '🧰', practice: '' };
              const studiedAge = getStudiedAge(techId);

              return (
                <motion.div 
                  key={techId}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{info.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{info.name}</h3>
                      {studiedAge != null && (
                        <p className="text-xs text-slate-500 mb-2">Studied at age {studiedAge}</p>
                      )}
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs text-slate-600 font-medium mb-1">In practice:</p>
                        <p className="text-sm text-slate-800">{info.practice}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}