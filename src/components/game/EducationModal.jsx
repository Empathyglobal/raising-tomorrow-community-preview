import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Book } from 'lucide-react';
import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import { EDUCATION_PROGRAMS, MAJORS, getMajorById, getProgramById } from './educationSystem';
import { EDUCATION_RANK } from './jobSystem';

export default function EducationModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, addLog, recordTimelineEntry, emitActionResult } = useGameState();
  const [enrollModal, setEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);

  const parentEducation = gameState.parentEducation || {
    lastProcessedAge: -1,
    highest: { levelId: 'high_school', majorId: null, completedAtAge: null },
    enrollment: null
  };

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

  const eligiblePrograms = EDUCATION_PROGRAMS.filter(program => {
    const currentRank = EDUCATION_RANK[parentEducation.highest.levelId] || 0;
    const requiredRank = EDUCATION_RANK[program.requires.levelId] || 0;
    const targetRank = EDUCATION_RANK[program.levelId] || 0;
    return currentRank >= requiredRank && currentRank < targetRank;
  });

  const handleStartEnrollment = (program) => {
    setSelectedProgram(program);
    if (!program.requiresMajor) {
      // Professional schools don't require major selection
      handleConfirmEnroll(program, null);
    }
  };

  const handleConfirmEnroll = (program, majorId) => {
    const major = majorId ? getMajorById(majorId) : null;
    
    updateState({
      parentEducation: {
        ...parentEducation,
        enrollment: {
          programId: program.programId,
          levelId: program.levelId,
          majorId: majorId,
          startedAge: gameState.currentYear,
          yearsTotal: program.years,
          yearsCompleted: 0,
          tuitionPerYear: program.tuition,
          focusTaxPerYear: program.focusTax,
          stressPerYear: program.stress,
          scholarshipPct: 0,
          lastActionAge: null
        }
      }
    });
    
    addLog(`🎓 Enrolled in ${program.label}${major ? ` (${major.label})` : ''}`);
    
    emitActionResult({
      actionId: 'education',
      title: `🎓 Enrolled!`,
      body: `Started ${program.label}${major ? ` majoring in ${major.label}` : ''}. ${program.years} years, $${formatMoney(program.tuition)}/year.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: 0,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['education'],
      meta: { emoji: '🎓', program: program.label }
    });
    
    recordTimelineEntry({
      kind: 'education',
      title: `🎓 Enrolled: ${program.label}`,
      detail: major ? `Major: ${major.label}` : '',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
    
    setEnrollModal(false);
    setSelectedProgram(null);
    setSelectedMajor(null);
  };

  const handleDropOut = () => {
    if (!parentEducation.enrollment) return;
    
    const program = getProgramById(parentEducation.enrollment.programId);
    
    updateState({
      parentEducation: {
        ...parentEducation,
        enrollment: null
      }
    });
    
    addLog(`🚪 Dropped out of ${program?.label || 'program'}`);
    
    recordTimelineEntry({
      kind: 'education',
      title: `🚪 Dropped Out`,
      detail: program?.label || 'education program',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -1
    });
    
    emitActionResult({
      actionId: 'education',
      title: '🚪 Dropped Out',
      body: `You left ${program?.label || 'the program'}. Sometimes that's the right call.`,
      deltas: {},
      loveDelta: 0,
      stressDelta: -1,
      moneyDelta: 0,
      focusDelta: 0,
      tags: ['education'],
      meta: { emoji: '🚪' }
    });
  };

  const currentEnrollment = parentEducation.enrollment;
  const currentProgram = currentEnrollment ? getProgramById(currentEnrollment.programId) : null;
  const currentMajor = currentEnrollment?.majorId ? getMajorById(currentEnrollment.majorId) : null;
  const highestMajor = parentEducation.highest.majorId ? getMajorById(parentEducation.highest.majorId) : null;

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
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🎓 Higher Education</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Your academic journey</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
                {/* Highest Completed */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-800">Highest Education</span>
                  </div>
                  <div className="text-sm text-slate-700">
                    {parentEducation.highest.levelId === 'high_school' ? 'High School' : 
                     parentEducation.highest.levelId === 'associate' ? 'Associate Degree' :
                     parentEducation.highest.levelId === 'bachelors' || parentEducation.highest.levelId === 'college' ? "Bachelor's Degree" :
                     parentEducation.highest.levelId === 'masters' ? "Master's Degree" :
                     parentEducation.highest.levelId === 'phd' ? 'PhD' :
                     parentEducation.highest.levelId === 'jd' ? 'JD (Law)' :
                     parentEducation.highest.levelId === 'md' ? 'MD (Medicine)' :
                     parentEducation.highest.levelId === 'dds' ? 'DDS (Dental)' :
                     parentEducation.highest.levelId === 'dvm' ? 'DVM (Veterinary)' :
                     parentEducation.highest.levelId === 'mba' ? 'MBA' : 'High School'}
                    {highestMajor && ` • ${highestMajor.label}`}
                  </div>
                </div>

                {/* Current Enrollment */}
                {currentEnrollment && currentProgram ? (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Book className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-slate-800">Currently Enrolled</span>
                      </div>
                      <button
                        onClick={handleDropOut}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Drop Out
                      </button>
                    </div>
                    <div className="text-sm text-slate-700 mb-2">
                      {currentProgram.label}
                      {currentMajor && ` • ${currentMajor.label}`}
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Year {currentEnrollment.yearsCompleted} of {currentEnrollment.yearsTotal}</div>
                      <div>Tuition: ${formatMoney(currentEnrollment.tuitionPerYear)}/year{currentEnrollment.scholarshipPct > 0 ? ` (${Math.round(currentEnrollment.scholarshipPct * 100)}% scholarship)` : ''}</div>
                      <div>Focus tax: -{currentEnrollment.focusTaxPerYear} at age start</div>
                      <div>Stress: +{currentEnrollment.stressPerYear}/year</div>
                    </div>
                    <div className="mt-2 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(currentEnrollment.yearsCompleted / currentEnrollment.yearsTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Enroll Button */}
                {!currentEnrollment && eligiblePrograms.length > 0 && (
                  <button
                    onClick={() => setEnrollModal(true)}
                    className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
                  >
                    📚 Enroll in Program
                  </button>
                )}

                {/* Eligible Programs List */}
                {!currentEnrollment && eligiblePrograms.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="text-sm">You've completed all available education paths!</p>
                  </div>
                )}

                {/* Enroll Modal */}
                {enrollModal && (
                  <div className="fixed inset-0 bg-black/40 z-[102] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h4 className="text-lg font-bold text-slate-800">Choose Program</h4>
                        <button
                          onClick={() => {
                            setEnrollModal(false);
                            setSelectedProgram(null);
                            setSelectedMajor(null);
                          }}
                          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                      <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] space-y-3">
                        {selectedProgram && selectedProgram.requiresMajor ? (
                          <>
                            <div className="mb-4">
                              <button
                                onClick={() => {
                                  setSelectedProgram(null);
                                  setSelectedMajor(null);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                ← Back to programs
                              </button>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">Choose your major:</p>
                            {MAJORS.map(major => (
                              <button
                                key={major.id}
                                onClick={() => handleConfirmEnroll(selectedProgram, major.id)}
                                className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{major.emoji}</span>
                                  <span className="font-semibold text-slate-800">{major.label}</span>
                                </div>
                              </button>
                            ))}
                          </>
                        ) : (
                          eligiblePrograms.map(program => (
                            <button
                              key={program.programId}
                              onClick={() => handleStartEnrollment(program)}
                              className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{program.emoji}</span>
                                    <span className="font-semibold text-slate-800">{program.label}</span>
                                  </div>
                                  <div className="text-xs text-slate-600 space-y-0.5">
                                    <div>{program.years} years • ${formatMoney(program.tuition)}/year</div>
                                    <div>Focus tax: -{program.focusTax} • Stress: +{program.stress}/year</div>
                                    {program.recommendedMajors && (
                                      <div className="text-[10px] text-slate-500 mt-1">
                                        Recommended: {program.recommendedMajors.map(id => getMajorById(id)?.label || id).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}