import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, formatMoney, hasAnyChild, getDisplayedChildAge, getActiveChildFromState } from './GameStateContext';
import { ADULT_DOCTORS, CHILD_DOCTORS, getStarsForQuality, runPrimaryCareVisit } from './doctorCareEngine';
import { toast } from 'sonner';
import CounselorModal from './CounselorModal';
import TraumaRehabModal from './TraumaRehabModal';
import PlasticSurgeryModal from './PlasticSurgeryModal';
import SexualHealthClinicModal from './SexualHealthClinicModal';

export default function DoctorModal({ open, onClose }) {
  const {
    gameState,
    spendFocus,
    applyMoneyDelta,
    applyStress,
    applyPlayerHealth,
    applyDeltas,
    applyLove,
    updateState,
    addLog,
    recordTimelineEntry,
    emitActionResult,
    getLocalAmount,
    getAvailability
  } = useGameState();

  const {
    childSickThisAge,
    playerSickThisAge,
    partnerSickThisAge,
    currentYear,
    familyPatterns,
    actionPoints,
    householdType,
    primaryCare
  } = gameState;

  const [selectedPatient, setSelectedPatient] = useState('child');
  const [counselorModalOpen, setCounselorModalOpen] = useState(false);
  const [rehabModalOpen, setRehabModalOpen] = useState(false);
  const [plasticSurgeryOpen, setPlasticSurgeryOpen] = useState(false);
  const [sexualHealthClinicOpen, setSexualHealthClinicOpen] = useState(false);

  const hasChild = hasAnyChild(gameState);
  const hasPartner = householdType === 'two';

  // Default to "You" if no child
  React.useEffect(() => {
    if (!hasChild && selectedPatient === 'child') {
      setSelectedPatient('self');
    }
  }, [hasChild, selectedPatient]);

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

  const sh = gameState.sexualHealth || {};
  const followUpNeeded =
    (sh?.player?.status === 'treatable' && (sh?.player?.treatedAtAge == null)) ||
    (sh?.player?.status === 'chronic' && Number(sh?.player?.lastMedsAge) !== Number(currentYear)) ||
    (sh?.partner?.status === 'treatable' && (sh?.partner?.treatedAtAge == null)) ||
    (sh?.partner?.status === 'chronic' && Number(sh?.partner?.lastMedsAge) !== Number(currentYear));

  // Check counselor availability
  const counselorByAge = familyPatterns?.counselorByAge || {};
  const alreadyUsedCounselor = counselorByAge[currentYear]?.used || false;
  const counselorAvail = getAvailability('counselor');
  const counselorDisabled = alreadyUsedCounselor || !counselorAvail.enabled;

  // Check Trauma Rehab availability
  const rehabByAge = familyPatterns?.rehabByAge || {};
  const alreadyUsedRehab = rehabByAge[currentYear]?.used || false;
  const rehabAvail = getAvailability('traumaRehab');
  const rehabDisabled = alreadyUsedRehab || !rehabAvail.enabled;

  const handleDoctorVisit = (doc) => {
    const result = runPrimaryCareVisit({
      state: gameState,
      patientKey: selectedPatient,
      doc,
      getLocalAmount,
      applyMoneyDelta,
      spendFocus,
      applyStress,
      applyPlayerHealth,
      applyDeltas,
      applyLove,
      updateState,
      addLog,
      recordTimelineEntry,
      emitActionResult,
      formatMoney
    });

    if (result.success) {
      onClose();
    } else {
      toast.error(result.reason || 'Failed to complete doctor visit.');
    }
  };

  // Determine doctors list for selected patient
  const doctors = selectedPatient === 'child' ? CHILD_DOCTORS : ADULT_DOCTORS;

  // Checkup gating
  const lastCheckupAge = primaryCare?.lastCheckupAge?.[selectedPatient];
  const isSick = selectedPatient === 'child' ? childSickThisAge : selectedPatient === 'self' ? playerSickThisAge : partnerSickThisAge;
  const alreadyDidCheckup = !isSick && lastCheckupAge === currentYear;

  // Patient display name
  const patientDisplayName = selectedPatient === 'child'
    ? (gameState.childName || 'Your child')
    : selectedPatient === 'self'
      ? 'You'
      : 'Partner';

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
            <div className="w-full max-w-lg lg:max-w-2xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">🩺 Health (Doctor)</h3>
                  {followUpNeeded && (
                    <p className="text-xs text-emerald-700 mt-0.5">🧪 Confidential follow-up available</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-4 lg:py-6 pb-8">
                <p className="text-xs text-slate-500 mb-4 italic">
                  This is game flavor, not medical advice.
                </p>

                {/* SECTION 1: Primary Care */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Primary Care</h4>

                  {/* Patient Selector */}
                  <div className="flex gap-2 mb-4">
                    {hasChild && (
                      <button
                        onClick={() => setSelectedPatient('child')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedPatient === 'child'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {gameState.childName || 'Child'}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPatient('self')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPatient === 'self'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      You
                    </button>
                    {hasPartner && (
                      <button
                        onClick={() => setSelectedPatient('partner')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedPatient === 'partner'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Partner
                      </button>
                    )}
                  </div>

                  {alreadyDidCheckup && (
                    <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      ℹ️ Already did a checkup this year for {patientDisplayName}. (Treatment visits still allowed if sick/injured.)
                    </div>
                  )}

                  {/* Doctor Cards */}
                  <div className="space-y-3">
                    {doctors.map(doc => {
                      const cost = getLocalAmount(doc.baseCost, { category: 'medical' });
                      const stars = '★'.repeat(getStarsForQuality(doc.quality)) + '☆'.repeat(5 - getStarsForQuality(doc.quality));
                      const canAfford = gameState.money >= cost || gameState.money >= 0; // Allow debt
                      const hasEnoughFocus = actionPoints >= doc.focusCost;
                      const disabled = !canAfford || !hasEnoughFocus || alreadyDidCheckup;

                      return (
                        <button
                          key={doc.id}
                          onClick={() => handleDoctorVisit(doc)}
                          disabled={disabled}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                            disabled
                              ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-3xl flex-shrink-0">{doc.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 text-base mb-1">{doc.name}</div>
                              <div className="text-xs text-slate-500 italic mb-2">{doc.tagline}</div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-amber-500 text-sm">{stars}</span>
                                <span className="text-xs text-slate-500">Quality: {doc.quality}/100</span>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                  ${formatMoney(cost)}
                                </div>
                                <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                                  {doc.focusCost} Focus
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-2">
                                {doc.quality >= 85 ? 'Excellent care, detailed recommendations.' : doc.quality >= 70 ? 'Solid care, good bedside manner.' : 'Basic care, less detail.'}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: Other Services */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Other Services</h4>
                  <div className="space-y-3">
                    {/* Sexual Health Clinic */}
                    <button
                      onClick={() => setSexualHealthClinicOpen(true)}
                      className="w-full text-left p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">🧪</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">Sexual Health Clinic</div>
                          <div className="text-sm text-slate-600 leading-relaxed mb-2">
                            Confidential checkup, treatment, or yearly medication refill.
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Cost: ${formatMoney(getLocalAmount(200, { category: 'medical' }))}
                            </div>
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                              Focus: 1
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Plastic Surgery */}
                    <button
                      onClick={() => setPlasticSurgeryOpen(true)}
                      className="w-full text-left p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-pink-400 hover:bg-pink-50/50 active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">✨</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">Plastic Surgery</div>
                          <div className="text-sm text-slate-600 leading-relaxed mb-2">
                            Purely cosmetic. No gameplay benefits.
                          </div>
                          <div className="flex gap-2">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              From: ${formatMoney(getLocalAmount(20000, { category: 'medical', coverage: 'none' }))}
                            </div>
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                              Focus: 1
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Trauma Rehab */}
                    <button
                      onClick={() => setRehabModalOpen(true)}
                      disabled={rehabDisabled}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        rehabDisabled
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">🏥</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">Trauma Rehab</div>
                          <div className="text-sm text-slate-600 leading-relaxed mb-2">
                            Intensive techniques (hypnotherapy, EMDR, group work, etc.) to soften a chosen pattern.
                            Results vary by method + fit.
                          </div>
                          <div className="flex gap-2">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Cost: varies
                            </div>
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                              Focus: 2
                            </div>
                          </div>
                          {alreadyUsedRehab && (
                            <p className="text-xs text-slate-400 mt-2">Already did Trauma Rehab this year.</p>
                          )}
                          {!alreadyUsedRehab && rehabDisabled && rehabAvail.reasonText && (
                            <p className="text-xs text-slate-400 mt-2">{rehabAvail.reasonText}</p>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Counselor */}
                    <button
                      onClick={() => setCounselorModalOpen(true)}
                      disabled={counselorDisabled}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        counselorDisabled
                          ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">🧠</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 mb-1 text-base">Counselor</div>
                          <div className="text-sm text-slate-600 leading-relaxed mb-2">
                            Guided check-in. Learn about patterns or work on reducing them. STRESS -0.5.
                          </div>
                          <div className="flex gap-2">
                            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Cost: ${formatMoney(getLocalAmount(250, { category: 'medical' }))}
                            </div>
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                              Focus: 1
                            </div>
                          </div>
                          {alreadyUsedCounselor && (
                            <p className="text-xs text-slate-400 mt-2">Already did a session this year.</p>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <CounselorModal
            open={counselorModalOpen}
            onClose={() => {
              setCounselorModalOpen(false);
              onClose();
            }}
          />

          <TraumaRehabModal
            open={rehabModalOpen}
            onClose={() => {
              setRehabModalOpen(false);
              onClose();
            }}
          />

          <PlasticSurgeryModal
            open={plasticSurgeryOpen}
            onClose={() => {
              setPlasticSurgeryOpen(false);
              onClose();
            }}
          />

          <SexualHealthClinicModal
            open={sexualHealthClinicOpen}
            onClose={() => {
              setSexualHealthClinicOpen(false);
              onClose();
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}