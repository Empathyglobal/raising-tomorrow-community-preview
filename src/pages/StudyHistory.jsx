import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameState } from "@/components/game/GameStateContext";

const techniqueInfo = [
  { id: 'nvc', emoji: '🕊️', name: 'NVC' },
  { id: 'pospsych', emoji: '🌞', name: 'Positive Psychology' },
  { id: 'boundaries', emoji: '🧱', name: 'Consistent Boundaries' },
  { id: 'coreg', emoji: '🧘', name: 'Co-regulation' },
  { id: 'empathy_kids', emoji: '🧡', name: 'Empathy Kids' }
];

export default function StudyHistory() {
  const navigate = useNavigate();
  const { gameState, countUnlockedTechniques } = useGameState();
  const { money, techniquesUnlocked, studyHistory } = gameState;

  const unlockedCount = countUnlockedTechniques();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-800">Study History</h1>
            <Button
              onClick={() => navigate(createPageUrl('Game'))}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          <div className="text-sm text-slate-600">
            Unlocked: <span className="font-semibold">{unlockedCount}</span> • Money: <span className="font-semibold">${money}</span>
          </div>
        </motion.div>

        {/* Technique Chips Grid */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Techniques
          </h3>
          <div className="flex flex-wrap gap-2">
            {techniqueInfo.map(tech => {
              const isUnlocked = techniquesUnlocked[tech.id];
              return (
                <div
                  key={tech.id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isUnlocked
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <span className="mr-1">{tech.emoji}</span>
                  {tech.name}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline List */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Timeline
          </h3>
          {studyHistory.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-600 mb-4">You haven't studied anything yet.</p>
              <Button
                onClick={() => navigate(createPageUrl('StudyHub'))}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Go to Study Hub
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...studyHistory].reverse().map((entry, idx) => (
                <motion.div
                  key={idx}
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-slate-800">
                      <span className="mr-2">{entry.techEmoji}</span>
                      {entry.techName}
                    </div>
                    {entry.techId === 'empathy_kids' && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600">
                    Studied at age {entry.studiedAtAge}
                  </div>
                  <div className="text-xs text-slate-600">
                    Cost: ${entry.cost}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}