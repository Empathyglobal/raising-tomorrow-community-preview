import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { STUDY_LIBRARY } from '@/components/game/studyLibrary';
import StudyLearnedModal from '@/components/game/StudyLearnedModal';

export default function StudyHub() {
  const navigate = useNavigate();
  const { gameState, addLog, applyDeltas, updateState, spendMoney, useAction, addStudyHistory, recordTimelineEntry, pickStudyLesson, spendFocus, awardStudyPoints, applyMoneyDelta } = useGameState();
  const { money, actionPoints, techniquesUnlocked, finished } = gameState;
  const [techniques, setTechniques] = useState([]);
  const [learnedModalOpen, setLearnedModalOpen] = useState(false);
  const [learnedLesson, setLearnedLesson] = useState(null);
  const [learnedModuleLabel, setLearnedModuleLabel] = useState("");

  useEffect(() => {
    const loadTechniques = async () => {
      const data = await base44.entities.Techniques.list();
      setTechniques(data);
    };
    loadTechniques();
  }, []);

  const handleBuy = (technique) => {
    // Check if already unlocked to prevent duplicate history entries
    if (techniquesUnlocked[technique.id]) {
      return;
    }

    if (!spendFocus(1, `Study: ${technique.name}`)) {
      addLog("No focus tokens left this year. You close the tab and feel judged by your own ambition.");
      return;
    }

    awardStudyPoints(1, `Study: ${technique.name}`);

    applyMoneyDelta(-technique.cost, `Study: ${technique.name}`, { category: "education" });
    
    updateState(prev => ({ 
      techniquesUnlocked: {
        ...prev.techniquesUnlocked,
        [technique.id]: true
      }
    }));
    applyDeltas(technique.instantDeltas, `Study: ${technique.name}`);
    addLog(`${technique.unlockLog} (You spend $${technique.cost}.)`);
    
    // Add to study history
    addStudyHistory({
      techId: technique.id,
      techName: technique.name,
      techEmoji: technique.emoji,
      cost: technique.cost,
      studiedAtAge: gameState.currentYear
    });

    // Find matching study module and pick a rotating lesson
    const studyModule = STUDY_LIBRARY.find(m => m.id === technique.id) || STUDY_LIBRARY[0];
    const lesson = pickStudyLesson(technique.id);

    // Add to studiedItems with lesson details
    updateState({
      studiedItems: [...gameState.studiedItems, {
        id: technique.id,
        label: studyModule.label,
        tag: studyModule.tag,
        age: gameState.currentYear,
        lessonHeadline: lesson.headline,
        lessonExample: lesson.example
      }]
    });

    // Record timeline entry with lesson headline (keep it short)
    recordTimelineEntry({
      kind: "study",
      title: `📚 Studied — ${studyModule.label}`,
      detail: `${studyModule.tag} • ${lesson.headline}`,
      deltas: technique.instantDeltas,
      moneyDelta: -technique.cost,
      loveDelta: 0,
      stressDelta: 0,
      meta: { stressAtTime: gameState.stress }
    });
    
    // Show the "You Learned" popup
    setLearnedLesson(lesson);
    setLearnedModuleLabel(studyModule.label);
    setLearnedModalOpen(true);
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Study</h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>Money: ${money}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Focus tokens left: {actionPoints}</span>
            </div>
          </div>
        </motion.div>

        {/* Techniques List */}
        {techniques.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
            <p className="text-slate-600 mb-2">Study modules didn't load properly.</p>
            <p className="text-xs text-slate-400">Ref: study_empty</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {techniques.map((tech, idx) => {
            const isUnlocked = techniquesUnlocked[tech.id];
            const canBuy = !finished && actionPoints > 0 && !isUnlocked;

            return (
              <motion.div
                key={tech.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{tech.emoji}</span>
                      <h3 className="font-semibold text-slate-800">{tech.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{tech.description}</p>
                    <p className="text-xs text-slate-500">Cost: ${tech.cost}</p>
                  </div>
                  <div>
                    {isUnlocked ? (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        Unlocked
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleBuy(tech)}
                        disabled={!canBuy}
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Study (-${tech.cost})
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
            })}
          </div>
        )}

        {/* Back Button */}
        <Button
          onClick={() => navigate(createPageUrl('Game'))}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Game
        </Button>
      </div>

      {/* Study Learned Modal */}
      <StudyLearnedModal
        open={learnedModalOpen}
        moduleLabel={learnedModuleLabel}
        lesson={learnedLesson}
        onClose={() => {
          setLearnedModalOpen(false);
          navigate(createPageUrl('Game'));
        }}
      />
    </div>
  );
}