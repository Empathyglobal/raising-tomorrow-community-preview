import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, SCHOOL_EFFECTS } from './GameStateContext';
import { appendHumor } from './humorUtils';

export default function SchoolOptionsModal({ open, onClose }) {
  const { gameState, updateState, spendMoney, addLog, recordTimelineEntry, applyDeltas, applyStress } = useGameState();
  const { 
    currentYear, 
    baliActive, 
    privateSchoolActive, 
    privateSchoolScholarship,
    difficultyId,
    money,
    finished,
    schoolAppliedTypeThisAge
  } = gameState;

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

  const inSchool = currentYear >= 5;
  const eligibleForPrivate = currentYear >= 6 && inSchool && !baliActive && !privateSchoolActive && !finished;

  // Current status text
  let statusText = "";
  if (currentYear < 5) {
    statusText = "Not in school yet.";
  } else if (baliActive) {
    statusText = "Current: Empathy School (Bali). Private school unavailable while in Bali.";
  } else if (privateSchoolActive) {
    statusText = privateSchoolScholarship 
      ? "Current: Private School (Scholarship active)" 
      : "Current: Private School";
  } else {
    statusText = "Current: Public School";
  }

  const handleStartPrivateSchool = () => {
    spendMoney(500);
    
    updateState({
      privateSchoolActive: true,
      privateSchoolScholarship: false,
      privateSchoolStartAge: currentYear
    });

    addLog("🏫 You enroll them in private school. It starts immediately.");

    recordTimelineEntry({
      kind: "system",
      title: "Started Private School",
      detail: "You pay $500. The change starts now.",
      deltas: null,
      moneyDelta: -500,
      loveDelta: 0,
      stressDelta: 0
    });

    // Apply immediate adjustment
    const alreadyApplied = SCHOOL_EFFECTS[schoolAppliedTypeThisAge]?.deltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
    const target = SCHOOL_EFFECTS.private.deltas;
    
    const diff = {
      intelligence: target.intelligence - alreadyApplied.intelligence,
      empathy: target.empathy - alreadyApplied.empathy,
      discipline: target.discipline - alreadyApplied.discipline,
      confidence: target.confidence - alreadyApplied.confidence
    };

    if (Object.values(diff).some(v => v !== 0)) {
      applyDeltas(diff, "Private School (Adjustment)");
      recordTimelineEntry({
        kind: "system",
        title: "Private School Adjustment",
        detail: "You notice the shift this year too.",
        deltas: diff,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 0
      });
    }

    updateState({ schoolAppliedTypeThisAge: "private" });
    onClose();
  };

  const handleScholarshipAttempt = () => {
    const roll = Math.floor(Math.random() * 100);
    
    if (roll < 5) {
      // Scholarship granted!
      updateState({
        privateSchoolActive: true,
        privateSchoolScholarship: true,
        privateSchoolStartAge: currentYear
      });

      addLog("🎓 Scholarship granted! Private school starts immediately.");

      recordTimelineEntry({
        kind: "system",
        title: "Scholarship Granted",
        detail: "Private school begins with tuition waived.",
        deltas: null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: -1
      });

      applyStress(-1, "Scholarship granted");

      // Apply immediate adjustment
      const alreadyApplied = SCHOOL_EFFECTS[schoolAppliedTypeThisAge]?.deltas || { intelligence: 0, empathy: 0, discipline: 0, confidence: 0 };
      const target = SCHOOL_EFFECTS.private.deltas;
      
      const diff = {
        intelligence: target.intelligence - alreadyApplied.intelligence,
        empathy: target.empathy - alreadyApplied.empathy,
        discipline: target.discipline - alreadyApplied.discipline,
        confidence: target.confidence - alreadyApplied.confidence
      };

      if (Object.values(diff).some(v => v !== 0)) {
        applyDeltas(diff, "Private School (Adjustment)");
        recordTimelineEntry({
          kind: "system",
          title: "Private School Adjustment",
          detail: "The change starts now.",
          deltas: diff,
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 0
        });
      }

      updateState({ schoolAppliedTypeThisAge: "private" });
      onClose();
    } else {
      // Scholarship denied
      const childName = gameState.childName || "your kid";
      addLog(appendHumor("📄 Scholarship denied.", "scholarshipDenied", { childName }, "😄 "));
      const childName2 = gameState.childName || "your kid";
      recordTimelineEntry({
        kind: "system",
        title: "Scholarship Denied",
        detail: appendHumor("Not approved this time.", "scholarshipDenied", { childName: childName2 }, "😄 "),
        deltas: null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 1
      });
      applyStress(1, "Scholarship denied");
    }
  };

  const handleLeavePrivateSchool = () => {
    updateState({
      privateSchoolActive: false,
      privateSchoolScholarship: false,
      privateSchoolStartAge: null
    });

    addLog("🏫 You switch back to public school. (Next age will reflect it.)");

    recordTimelineEntry({
      kind: "system",
      title: "Left Private School",
      detail: "Returning to public school next age.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-800">School Options</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Current Status */}
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-slate-600 mb-1">Current Status:</p>
                  <div className="text-base font-bold text-slate-800">{statusText}</div>
                </div>

                {/* Start Private School */}
                {eligibleForPrivate && (
                  <div className="mb-4 p-5 rounded-xl border-2 border-slate-200 bg-white">
                    <div className="mb-3">
                      <div className="font-semibold text-slate-800 text-base mb-1">🏫 Start Private School</div>
                      <div className="text-sm text-slate-600 mb-2">
                        $500 per age • Starts immediately
                      </div>
                      <div className="text-xs text-slate-500">
                        Effects: INT +2 • DIS +2 • EMP -1 • CON -1
                      </div>
                    </div>

                    {money >= 500 ? (
                      <button
                        onClick={handleStartPrivateSchool}
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Pay $500 and Start Now
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {difficultyId === "single" ? (
                          <button
                            onClick={handleScholarshipAttempt}
                            className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            Apply for Scholarship (5% chance)
                          </button>
                        ) : (
                          <div className="text-center py-3 text-sm text-slate-500 italic">
                            Scholarship unavailable: income too high.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Leave Private School */}
                {privateSchoolActive && !baliActive && (
                  <div className="p-5 rounded-xl border-2 border-slate-200 bg-white">
                    <div className="mb-3">
                      <div className="font-semibold text-slate-800 text-base mb-1">Return to Public School</div>
                      <div className="text-sm text-slate-600">
                        Takes effect next age.
                      </div>
                    </div>
                    <button
                      onClick={handleLeavePrivateSchool}
                      className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Switch to Public School (Next Age)
                    </button>
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