import React, { useState } from 'react';
import { X, Lock, Briefcase, GraduationCap, Dumbbell, Heart, AlertTriangle, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameState } from './GameStateContext';
import { ensurePrisonState } from './prisonSystem';
import { toast } from 'sonner';

const PRISON_JOBS = [
  { id: 'kitchen', name: '🍳 Kitchen', pay: 50, respectGain: 1, behaviorGain: 2 },
  { id: 'laundry', name: '🧺 Laundry', pay: 30, respectGain: 0, behaviorGain: 3 },
  { id: 'library', name: '📚 Library', pay: 40, respectGain: 2, behaviorGain: 2 },
  { id: 'workshop', name: '🔧 Workshop', pay: 60, respectGain: 2, behaviorGain: 1 }
];

const PRISON_PROGRAMS = [
  { id: 'ged', name: '📖 GED Program', behaviorBonus: 3, paroleBonus: 2 },
  { id: 'trade', name: '🔨 Trade Skills', behaviorBonus: 2, paroleBonus: 3 },
  { id: 'parenting_class', name: '👶 Parenting Class', behaviorBonus: 2, paroleBonus: 2 },
  { id: 'anger_management', name: '😤 Anger Management', behaviorBonus: 4, paroleBonus: 3 }
];

export default function PrisonHubModal({ open, onClose }) {
  const { gameState, doPrisonAction, updateState, consumeAction, spendFocus } = useGameState();
  const [selectingJob, setSelectingJob] = useState(false);
  const [selectingProgram, setSelectingProgram] = useState(false);

  const prison = ensurePrisonState(gameState.prison);
  const focus = Number(gameState.actionPoints || 0);
  const actionLimit = 3;
  const actionsUsed = Number(prison.actionsUsedThisAge || 0);
  const actionsRemaining = Math.max(0, actionLimit - actionsUsed);
  const canAct = focus >= 1 && actionsRemaining > 0;

  // Block body scroll when modal is open
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

  const handleAction = (actionId, choice = {}) => {
    if (!consumeAction('prison')) {
      toast.error("Not enough Focus");
      return;
    }

    // Check action limit
    if (actionsUsed >= actionLimit) {
      toast.error("Activity limit reached for this year");
      return;
    }

    doPrisonAction(actionId, choice);
  };

  const handleJobSelect = (jobId) => {
    if (!consumeAction('prison')) {
      toast.error("Not enough Focus");
      return;
    }

    if (actionsUsed >= actionLimit) {
      toast.error("Activity limit reached for this year");
      return;
    }

    doPrisonAction('work_set_job', jobId);
    setSelectingJob(false);
  };

  const handleProgramSelect = (programId) => {
    if (!consumeAction('prison')) {
      toast.error("Not enough Focus");
      return;
    }

    if (actionsUsed >= actionLimit) {
      toast.error("Activity limit reached for this year");
      return;
    }

    doPrisonAction('study_set_program', programId);
    setSelectingProgram(false);
  };

  const currentJob = prison.jobId ? PRISON_JOBS.find(j => j.id === prison.jobId) : null;
  const currentProgram = prison.programId ? PRISON_PROGRAMS.find(p => p.id === prison.programId) : null;

  const paroleEligible = 
    Number(gameState.currentYear || 0) >= Number(prison.paroleEligibleAge || 999) &&
    Number(prison.yearsRemaining || 0) > 0;

  const securityLabel = 
    prison.securityLevel === 'max' ? '🔴 Maximum' :
    prison.securityLevel === 'medium' ? '🟡 Medium' : '🟢 Minimum';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[calc(100dvh-32px)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    Prison
                  </h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {prison.yearsRemaining} {prison.yearsRemaining === 1 ? 'year' : 'years'} remaining • {securityLabel}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Warning Banner */}
              <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-start gap-3 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>You are incarcerated.</strong> Most life actions are disabled until release.
                </div>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-600 mb-1">Respect</div>
                    <div className="text-xl font-bold text-slate-800">{Math.round(prison.respect || 0)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-600 mb-1">Behavior</div>
                    <div className="text-xl font-bold text-slate-800">{Math.round(prison.behavior || 0)}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-600 mb-1">Guard Heat</div>
                    <div className="text-xl font-bold text-slate-800">{Math.round(prison.guardHeat || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Action Limit Warning */}
              {actionsRemaining <= 0 && (
                <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex-shrink-0">
                  <p className="text-sm text-amber-800">
                    ⚠️ You've used all {actionLimit} prison actions this year. Age up to continue.
                  </p>
                </div>
              )}

              {/* Focus Warning */}
              {focus < 1 && actionsRemaining > 0 && (
                <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex-shrink-0">
                  <p className="text-sm text-amber-800">
                    ⚠️ You need at least 1 Focus to take prison actions.
                  </p>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  
                  {/* Job Selection */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-5 h-5 text-slate-600" />
                      <h4 className="font-semibold text-slate-800">Prison Job</h4>
                    </div>
                    
                    {currentJob ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Current: {currentJob.name}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectingJob(true)}
                          >
                            Change
                          </Button>
                        </div>
                        <Button
                          onClick={() => handleAction('work')}
                          disabled={!canAct}
                          className="w-full"
                        >
                          Work Shift (1 Focus)
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectingJob(true)}
                        variant="outline"
                        className="w-full"
                      >
                        Choose a Job
                      </Button>
                    )}

                    {/* Job Selection UI */}
                    {selectingJob && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-slate-600 mb-2">Select a job (costs 1 Focus):</p>
                        {PRISON_JOBS.map(job => (
                          <button
                            key={job.id}
                            onClick={() => handleJobSelect(job.id)}
                            disabled={!canAct}
                            className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="font-semibold text-slate-800 text-sm">{job.name}</div>
                            <div className="text-xs text-slate-600">
                              Pay: ${job.pay}/yr • Respect +{job.respectGain} • Behavior +{job.behaviorGain}
                            </div>
                          </button>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectingJob(false)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Education Program */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-slate-600" />
                      <h4 className="font-semibold text-slate-800">Education</h4>
                    </div>
                    
                    {currentProgram ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Current: {currentProgram.name}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectingProgram(true)}
                          >
                            Change
                          </Button>
                        </div>
                        <Button
                          onClick={() => handleAction('study')}
                          disabled={!canAct}
                          className="w-full"
                        >
                          Attend Program (1 Focus)
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectingProgram(true)}
                        variant="outline"
                        className="w-full"
                      >
                        Enroll in Program
                      </Button>
                    )}

                    {/* Program Selection UI */}
                    {selectingProgram && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-slate-600 mb-2">Select a program (costs 1 Focus):</p>
                        {PRISON_PROGRAMS.map(prog => (
                          <button
                            key={prog.id}
                            onClick={() => handleProgramSelect(prog.id)}
                            disabled={!canAct}
                            className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="font-semibold text-slate-800 text-sm">{prog.name}</div>
                            <div className="text-xs text-slate-600">
                              Behavior +{prog.behaviorBonus} • Parole odds +{prog.paroleBonus}%
                            </div>
                          </button>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectingProgram(false)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Self-Care Actions */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-slate-600" />
                      <h4 className="font-semibold text-slate-800">Self-Care</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleAction('cry')}
                        disabled={!canAct}
                        variant="outline"
                        className="w-full"
                      >
                        😢 Cry
                      </Button>
                      <Button
                        onClick={() => handleAction('workout')}
                        disabled={!canAct}
                        variant="outline"
                        className="w-full"
                      >
                        <Dumbbell className="w-4 h-4 mr-1" />
                        Workout
                      </Button>
                      <Button
                        onClick={() => handleAction('meditate')}
                        disabled={!canAct}
                        variant="outline"
                        className="w-full col-span-2"
                      >
                        🧘 Meditate
                      </Button>
                    </div>
                  </div>

                  {/* Risky Actions */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">Risky Actions</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleAction('smuggle')}
                        disabled={!canAct}
                        variant="destructive"
                        className="w-full"
                      >
                        📦 Smuggle
                      </Button>
                      <Button
                        onClick={() => handleAction('fight')}
                        disabled={!canAct}
                        variant="destructive"
                        className="w-full"
                      >
                        👊 Fight
                      </Button>
                    </div>
                    <p className="text-xs text-red-700 mt-2">
                      Warning: Risky actions can extend your sentence or increase security level.
                    </p>
                  </div>

                  {/* Parole Application */}
                  {paroleEligible && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Scale className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Parole Hearing</h4>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        You're eligible for parole. Your behavior and program completion affect approval odds.
                      </p>
                      <Button
                        onClick={() => handleAction('parole')}
                        disabled={!canAct}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Apply for Parole (1 Focus)
                      </Button>
                    </div>
                  )}

                  {/* Activity Counter */}
                  <div className="text-center text-xs text-slate-500">
                    Actions this year: {actionsUsed} / {actionLimit}
                    {actionsRemaining > 0 && focus >= 1 && (
                      <span className="text-slate-600 font-medium"> • {actionsRemaining} remaining</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-slate-200 flex-shrink-0">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}