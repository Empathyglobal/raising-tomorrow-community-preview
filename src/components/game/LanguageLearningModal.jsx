import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, User, Baby } from 'lucide-react';
import { useGameState, formatMoney } from "@/components/game/GameStateContext.jsx";
import { getLanguageForCountry, getAllLanguagesWithProgress, getFluentLanguages, getLanguageStudyLine } from './languageData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LanguageLearningModal({ open, onClose }) {
  const { gameState, updateState, applyDeltas, applyStress, spendMoney, addLog, recordTimelineEntry, spendFocus, emitActionResult } = useGameState();
  const [tab, setTab] = useState('parent'); // 'parent' or 'child'
  const [processing, setProcessing] = useState(false);

  const currentCountryLanguage = getLanguageForCountry(gameState.countryIso3);
  const parentLanguages = getAllLanguagesWithProgress(gameState, 'parent');
  const childLanguages = getAllLanguagesWithProgress(gameState, 'child');
  const parentFluentList = getFluentLanguages(gameState, 'parent');
  const childFluentList = getFluentLanguages(gameState, 'child');

  const handleStudy = (language, who) => {
    if (processing) return;
    setProcessing(true);

    // Get current progress
    const known = gameState.languages?.known || { parent: {}, child: {} };
    const personLangs = known[who] || {};
    const currentProgress = personLangs[language]?.progress || 0;
    const newProgress = currentProgress + 1;
    const nowFluent = newProgress >= 5;

    if (who === 'parent') {
      // 1) Check & Spend focus
      if (gameState.actionPoints < 1) {
        setProcessing(false);
        return;
      }
      spendFocus(1, `Study ${language}`);

      // 2) Effects
      const stressDelta = nowFluent ? -2 : -1;
      applyStress(stressDelta, `Studying ${language}`);
      applyDeltas({ intelligence: 1, confidence: 1 }, `Studying ${language}`);

      // 3) Update Parent State
      updateState(prev => ({
        languages: {
          ...prev.languages,
          known: {
            ...(prev.languages?.known || {}),
            parent: {
              ...(prev.languages?.known?.parent || {}),
              [language]: {
                progress: newProgress,
                fluent: nowFluent
              }
            }
          }
        }
      }));

      // 4) Popup + Timeline Entry
      const gainLine = getLanguageStudyLine(language, newProgress, gameState.runSeed);

      emitActionResult?.({
        title: `🗣️ Learned ${language}`,
        body: gainLine,
        tags: ["skill", "language"],
        deltas: {
          intelligence: 1,
          confidence: 1
        },
        loveDelta: 0,
        stressDelta: stressDelta,
        moneyDelta: 0,
        meta: { source: "languageLearning" }
      });

      // 4) Enforce child auto-learning on parent fluency
      if (nowFluent) {
        const childKnown = gameState.languages?.known?.child || {};
        const childProgress = Number(childKnown?.[language]?.progress || 0);

        if (childProgress < 5) {
          const newChildProgress = Math.min(5, childProgress + 1);
          const childNowFluent = newChildProgress >= 5;

          updateState(prev => ({
            languages: {
              ...prev.languages,
              known: {
                ...(prev.languages?.known || {}),
                child: {
                  ...(prev.languages?.known?.child || {}),
                  [language]: {
                    progress: newChildProgress,
                    fluent: childNowFluent
                  }
                }
              }
            }
          }));

          // Apply standard child benefits
          applyDeltas({ intelligence: 2 }, `Auto-learned ${language}`);
          applyStress(1, `Auto-learned ${language}`);

          toast(
            `${gameState.childName} picked up some ${language} from you.`,
            { icon: '📚', duration: 3500 }
          );

          if (childNowFluent) {
            toast(
              `${gameState.childName} became fluent in ${language}!`,
              { icon: '✨', duration: 3500 }
            );
          }
        }
      }
    } else {
      // Child logic
      spendMoney(500);
      applyDeltas({ intelligence: 2, empathy: 0, discipline: 0, confidence: 0 }, `Study ${language}`);
      applyStress(1, `Study ${language}`);

      updateState(prev => ({
        languages: {
          ...prev.languages,
          known: {
            ...(prev.languages?.known || {}),
            child: {
              ...(prev.languages?.known?.child || {}),
              [language]: {
                progress: newProgress,
                fluent: nowFluent
              }
            }
          }
        }
      }));
      
      addLog?.(`📚 ${gameState.childName} studied ${language} (Progress ${newProgress}/5).`);
      
      if (nowFluent) {
        addLog?.(`📚 ${gameState.childName} is now fluent in ${language}!`);
        toast(`${gameState.childName} became fluent in ${language}!`, { icon: '✨', duration: 3500 });
      }
    }

    setTimeout(() => {
      setProcessing(false);
    }, 300);
  };

  const languages = tab === 'parent' ? parentLanguages : childLanguages;
  const fluentList = tab === 'parent' ? parentFluentList : childFluentList;

  // Block body scroll
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
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">📚 Language Learning</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    5 sessions to fluency • Cannot study {currentCountryLanguage} (default language)
                  </p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Tab switcher */}
              <div className="flex border-b border-slate-200 flex-shrink-0">
                <button
                  onClick={() => setTab('parent')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    tab === 'parent'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Parent Study
                  {parentFluentList.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {parentFluentList.length} fluent
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTab('child')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    tab === 'child'
                      ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                  Child Study
                  {childFluentList.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {childFluentList.length} fluent
                    </span>
                  )}
                </button>
              </div>

              {/* Costs info */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex-shrink-0">
                {tab === 'parent' ? (
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Per session:</span> 1 Focus • Stress -2
                  </p>
                ) : (
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Per session:</span> $500 • Intelligence +2 • Stress +1
                  </p>
                )}
              </div>

              {/* Language list */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  {languages.map(({ language, progress, fluent, isDefault, canStudy }) => {
                    const sessionsRemaining = 5 - progress;
                    const totalCost = tab === 'child' ? sessionsRemaining * 500 : sessionsRemaining;
                    
                    let disabledReason = null;
                    if (isDefault) disabledReason = `Cannot study ${currentCountryLanguage} (default language)`;
                    else if (fluent) disabledReason = 'Already fluent';
                    else if (tab === 'parent' && gameState.actionPoints < 1) disabledReason = 'Need 1 Focus';
                    
                    const disabled = !!disabledReason || processing;

                    return (
                      <div
                        key={language}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          fluent
                            ? 'border-green-300 bg-green-50'
                            : isDefault
                            ? 'border-slate-200 bg-slate-50 opacity-50'
                            : canStudy
                            ? 'border-slate-200 bg-white hover:border-blue-400'
                            : 'border-slate-200 bg-slate-50 opacity-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-slate-800">{language}</div>
                              {fluent && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-200 text-green-800 font-semibold">
                                  Fluent
                                </span>
                              )}
                              {isDefault && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                  Default language
                                </span>
                              )}
                            </div>
                            
                            {!fluent && !isDefault && (
                              <>
                                <div className="text-sm text-slate-600 mb-2">
                                  Progress: {progress}/5 sessions
                                </div>
                                
                                {/* Progress bar */}
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                  <div 
                                    className="h-full bg-blue-500 transition-all"
                                    style={{ width: `${(progress / 5) * 100}%` }}
                                  />
                                </div>
                                
                                <div className="text-xs text-slate-500">
                                  {sessionsRemaining} more session{sessionsRemaining === 1 ? '' : 's'} needed
                                  {tab === 'child' && (
                                    <span> • Total: ${formatMoney(totalCost)}</span>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {disabledReason && (
                              <div className="text-xs text-amber-700 mt-1">
                                {disabledReason}
                              </div>
                            )}
                          </div>

                          {!fluent && !isDefault && (
                            <Button
                              onClick={() => handleStudy(language, tab)}
                              disabled={disabled}
                              className="px-4 py-2 rounded-xl text-sm"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Study
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}