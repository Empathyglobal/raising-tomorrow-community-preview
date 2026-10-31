import React, { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/components/game/GameStateContext';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import HomeschoolSetupModal from './HomeschoolSetupModal';

export default function SchoolModal({ open, onClose }) {
  const { gameState, updateState, spendMoney, addLog, recordTimelineEntry, emitActionResult, SCHOOL_START_AGE, getAvailability, getLocalAmount, formatBaseToLocal } = useGameState();
  const { currentYear, schoolType, baliActive, privateSchoolActive, money, finished } = gameState;
  const [homeschoolSetupOpen, setHomeschoolSetupOpen] = useState(false);
  const [baliModalOpen, setBaliModalOpen] = useState(false);

  // Block body scroll when modal is open
  React.useEffect(() => {
    if (open || homeschoolSetupOpen || baliModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, homeschoolSetupOpen, baliModalOpen]);
  
  // Get availability for all school options
  const publicAvail = getAvailability({ type: 'school', id: 'public' });
  const privateAvail = getAvailability({ type: 'school', id: 'private' });
  const homeschoolAvail = getAvailability({ type: 'school', id: 'homeschool' });
  const empathyAvail = getAvailability({ type: 'school', id: 'empathy' });
  const religiousAvail = getAvailability({ type: 'school', id: 'religious' });

  // Hard age check
  if (currentYear < SCHOOL_START_AGE) {
    return null;
  }

  // Lock everything if in Juvenile Hall
  const isJuvenileHall = schoolType === 'juvenile_hall';
  if (isJuvenileHall) {
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
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">🏛️ Juvenile Hall</h3>
                <p className="text-slate-600 mb-4">
                  Standard schooling is replaced by the juvenile justice education program. 
                  School options are locked until release.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-medium text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Current school type display
  let currentSchoolLabel = "Public School";
  if (schoolType === "juvenile_hall") currentSchoolLabel = "Juvenile Hall (Mandatory)";
  else if (schoolType === "homeschool") currentSchoolLabel = "Homeschool";
  else if (baliActive) currentSchoolLabel = "Empathy School (Bali)";
  else if (schoolType === "religious") currentSchoolLabel = "Religious School";
  else if (privateSchoolActive) currentSchoolLabel = "Private School";

  const isPublicSelected = (schoolType === "public" && !privateSchoolActive && !baliActive && !isJuvenileHall);

  const handleSelectPublic = () => {
    if (isPublicSelected) {
      toast("You’re already in Public School.");
      return;
    }
    updateState({ 
      schoolType: "public",
      privateSchoolActive: false,
      privateSchoolScholarship: false
    });
    
    addLog("🏫 Switched to public school. (Takes effect next age.)");

    recordTimelineEntry({
      kind: "system",
      title: "🎒 School plan updated: Public",
      detail: "Returning to public school next age.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("school", "public");
    if (popup) {
      emitActionResult({
        actionId: "school",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    toast("Public School selected.");
    onClose();
  };

  const handleSelectPrivate = () => {
    // NEVER check money - debt is allowed
    updateState({ 
      schoolType: "private",
      privateSchoolActive: true,
      privateSchoolScholarship: false,
      privateSchoolStartAge: currentYear
    });
    
    addLog("🏛️ Switched to private school. (Takes effect next age.)");
    
    recordTimelineEntry({
      kind: "system",
      title: "🎒 School plan updated: Private",
      detail: `Starting next age. ${formatBaseToLocal(500)}/year tuition.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("school", "private");
    if (popup) {
      emitActionResult({
        actionId: "school",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }
    
    onClose();
  };

  const handleMoveToBali = () => {
    updateState({ 
      baliActive: true, 
      baliStartAge: gameState.currentYear 
    });
    addLog(`🏝️ You move to Bali for Empathy School. The perks start next age. (${formatBaseToLocal(500)}/age)`);

    recordTimelineEntry({
      kind: "tool",
      title: "Moved to Bali",
      detail: `Enrolled in Empathy School. Yearly cost: ${formatBaseToLocal(500)}. Bonuses begin next age.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("school", "bali");
    if (popup) {
      emitActionResult({
        actionId: "school",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }

    setBaliModalOpen(false);
    onClose();
  };

  const handleSelectReligious = () => {
    updateState({ 
      schoolType: "religious",
      religiousSchoolStartAge: currentYear,
      privateSchoolActive: false,
      privateSchoolScholarship: false
    });
    
    addLog("🙏 Switched to Religious School. (Takes effect next age.)");
    
    recordTimelineEntry({
      kind: "system",
      title: "🎒 School plan updated: Religious School",
      detail: `Starting next age. ${formatBaseToLocal(600)}/year tuition. Faith reinforcement begins next age.`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    const popup = pickMissingActionPopup("school", "religious");
    if (popup) {
      emitActionResult({
        actionId: "school",
        title: popup.title,
        body: interpolatePopupText(popup.body, { childName: gameState.childName || "your kid" }),
        deltas: null,
        moneyDelta: 0,
        focusDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        tags: popup.tags,
        meta: { emoji: popup.emoji }
      });
    }
    
    onClose();
  };

  const handleSelectHomeschool = () => {
    setHomeschoolSetupOpen(true);
  };

  const handleHomeschoolSetupComplete = () => {
    setHomeschoolSetupOpen(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {open && !homeschoolSetupOpen && (
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
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-200">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">🎒 School</h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Choose your approach
                      </p>
                      {gameState.currentYear < SCHOOL_START_AGE && (
                        <div className="mt-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800">
                            School starts at age {SCHOOL_START_AGE}. For now, it's daycare/preschool — you're just planning ahead.
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {/* Current Status */}
                  <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <p className="text-sm text-slate-600 mb-1">Current:</p>
                    <div className="text-base font-bold text-slate-800">{currentSchoolLabel}</div>
                  </div>

                  <div className="space-y-3">
                    {/* Public School */}
                    <div>
                      <button
                        onClick={handleSelectPublic}
                        disabled={!publicAvail.enabled}
                        className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                          !publicAvail.enabled
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : isPublicSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏫</div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-800 text-base">Public School</div>
                          {isPublicSelected && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Selected ✓</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mb-2">Free • Standard curriculum</div>
                        <div className="text-xs text-slate-500">INT +1 • DIS +1 • EMP -1 • CON -2</div>
                      </button>
                      {!publicAvail.enabled && publicAvail.reasonText && (
                        <div className="text-xs text-red-500 mt-1 ml-3">
                          Locked: {publicAvail.reasonText}
                        </div>
                      )}
                    </div>

                    {/* Private School */}
                    <div>
                      <button
                        onClick={handleSelectPrivate}
                        disabled={!privateAvail.enabled || schoolType === "private" || baliActive}
                        className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                          !privateAvail.enabled || schoolType === "private" || baliActive
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏛️</div>
                        <div className="font-bold text-slate-800 text-base mb-1">Private School</div>
                        <div className="text-sm text-slate-600 mb-2">
                          {gameState.specialStartId === 'kim_jong_un' ? `${formatBaseToLocal(15000)}/year • Elite institution` : `${formatBaseToLocal(500)}/year • Better academics`}
                        </div>
                        <div className="text-xs text-slate-500">INT +2 • DIS +2 • EMP -1 • CON -1</div>
                      </button>
                      {!privateAvail.enabled && privateAvail.reasonText && (
                        <div className="text-xs text-red-500 mt-1 ml-3">
                          Locked: {privateAvail.reasonText}
                        </div>
                      )}
                    </div>

                    {/* Empathy School (Hide for kim_jong_un) */}
                    {gameState.specialStartId !== 'kim_jong_un' && (
                      <div>
                        <button
                          onClick={() => {
                            if (empathyAvail.enabled) {
                              // Already in Bali - just close
                              onClose();
                            } else if (empathyAvail.reasonCode === 'prereq') {
                              // Open Bali move modal
                              setBaliModalOpen(true);
                            }
                          }}
                          disabled={!empathyAvail.enabled && empathyAvail.reasonCode !== 'prereq'}
                          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                            (!empathyAvail.enabled && empathyAvail.reasonCode !== 'prereq')
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="text-2xl mb-2">💛</div>
                          <div className="font-bold text-slate-800 text-base mb-1">Empathy School (Bali)</div>
                          <div className="text-sm text-slate-600 mb-2">
                            {baliActive ? 'Currently Active' : `Move to Bali required • ${formatBaseToLocal(500)}/year`}
                          </div>
                          <div className="text-xs text-slate-500">INT +1 • DIS +1 • EMP +1 • CON +1</div>
                        </button>
                        {!empathyAvail.enabled && empathyAvail.reasonText && (
                          <div className="text-xs text-red-500 mt-1 ml-3 flex items-center gap-2">
                            <span>Locked: {empathyAvail.reasonText}</span>
                            {empathyAvail.reasonCode === 'prereq' && (
                              <button
                                onClick={() => setBaliModalOpen(true)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 underline"
                              >
                                Go to Bali
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Religious School */}
                    <div>
                      <button
                        onClick={handleSelectReligious}
                        disabled={!religiousAvail.enabled || schoolType === "religious" || baliActive}
                        className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                          !religiousAvail.enabled || schoolType === "religious" || baliActive
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">🙏</div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-slate-800 text-base">Religious School</div>
                          {schoolType === "religious" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">Selected ✓</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{formatBaseToLocal(600)}/year • Reinforces faith community</div>
                        <div className="text-xs text-slate-500">Faith exposure & devotion maintained</div>
                      </button>
                      {!religiousAvail.enabled && religiousAvail.reasonText && (
                        <div className="text-xs text-red-500 mt-1 ml-3">
                          Locked: {religiousAvail.reasonText}
                        </div>
                      )}
                    </div>

                    {/* Homeschool */}
                    <div>
                      <button
                        onClick={handleSelectHomeschool}
                        disabled={!homeschoolAvail.enabled || schoolType === "homeschool"}
                        className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                          !homeschoolAvail.enabled || schoolType === "homeschool"
                            ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-green-400 hover:bg-green-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏠</div>
                        <div className="font-bold text-slate-800 text-base mb-1">Homeschool</div>
                        <div className="text-sm text-slate-600 mb-2">Customizable • Requires setup</div>
                        <div className="text-xs text-slate-500">Choose curriculum + support plan</div>
                      </button>
                      {!homeschoolAvail.enabled && homeschoolAvail.reasonText && (
                        <div className="text-xs text-red-500 mt-1 ml-3">
                          Locked: {homeschoolAvail.reasonText}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Homeschool Setup Modal */}
      <HomeschoolSetupModal
        open={homeschoolSetupOpen}
        onClose={() => setHomeschoolSetupOpen(false)}
        onComplete={handleHomeschoolSetupComplete}
      />

      {/* Bali Move Modal */}
      <AnimatePresence>
        {baliModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[300]"
              onClick={() => setBaliModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[301] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
                <div className="text-center mb-4">
                  <span className="text-5xl">🏝️</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2">Move to Bali</h3>
                  <p className="text-sm text-slate-600 mt-1">Enroll in Empathy School</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-amber-900">
                    Costs {formatBaseToLocal(500)} each age while active. Each age: INT +1, EMP +1, CON +1.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setBaliModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 transition-colors font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMoveToBali}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition-colors"
                  >
                    Move to Bali
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}