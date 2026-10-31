import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, DollarSign, Zap } from 'lucide-react';
import CoverHeader from '@/components/game/CoverHeader';

import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import ParentStrategiesModal from '@/components/game/ParentStrategiesModal';
import DoctorModal from '@/components/game/DoctorModal';
import MindBodyModal from '@/components/game/MindBodyModal';
import SalonSpaModal from '@/components/game/SalonSpaModal';
import VideosModal from '@/components/game/VideosModal';
import FaithModal from '@/components/game/FaithModal';
import WisdomLensesModal from '@/components/game/WisdomLensesModal';

const toSafeAvail = (avail) => {
  if (!avail) return { enabled: true, reasonText: '' };
  return {
    enabled: !!avail.enabled,
    reasonText: avail.reasonText || avail.reason || ''
  };
};

function HubButton({ emoji, label, description, onClick, disabled, disabledReason }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        `w-full text-left bg-white border border-slate-200 rounded-xl p-4 ` +
        `transition-all active:scale-[0.98] ` +
        (disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:border-blue-400 hover:bg-blue-50/50')
      }
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">{emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800">{label}</div>
          {description && <div className="text-xs text-slate-600 mt-0.5">{description}</div>}
          {disabled && disabledReason && (
            <div className="text-xs text-slate-500 mt-2">{disabledReason}</div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function Wellbeing() {
  const navigate = useNavigate();
  const { gameState, getActionAvailability } = useGameState();
  const {
    money,
    actionPoints,
    maxFocusTokens,
    scenarioPending,
    scenarioCompletedThisAge,
    finished,
    childSickThisAge
  } = gameState;

  const scenarioMandatory = scenarioPending && !scenarioCompletedThisAge;

  const [parentStrategiesOpen, setParentStrategiesOpen] = React.useState(false);
  const [doctorOpen, setDoctorOpen] = React.useState(false);
  const [mindBodyOpen, setMindBodyOpen] = React.useState(false);
  const [salonSpaOpen, setSalonSpaOpen] = React.useState(false);
  const [videosOpen, setVideosOpen] = React.useState(false);
  const [faithOpen, setFaithOpen] = React.useState(false);
  const [wisdomOpen, setWisdomOpen] = React.useState(false);

  const parentStrategiesAvail = toSafeAvail(getActionAvailability('parentStrategies'));
  const doctorAvail = toSafeAvail(getActionAvailability('doctor'));
  const mindBodyAvail = toSafeAvail(getActionAvailability('mindBody'));
  const salonSpaAvail = toSafeAvail(getActionAvailability('salonSpa'));
  const faithAvail = toSafeAvail(getActionAvailability('faith'));

  // Videos availability via central gate (so special starts can disable it)
  const videosAvail = toSafeAvail(getActionAvailability('videos'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">🧘 Wellbeing</h1>
        <p className="text-sm text-slate-600 mb-4">Body, mind, and energy management.</p>
        {typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' && (
          <CoverHeader cover={{ id: 'self_care', title: 'Self-Care' }} />
        )}

        <div className="flex items-center gap-4 text-xs text-slate-600 mb-6">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>Money: ${formatMoney(money)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>Focus: {actionPoints}/{maxFocusTokens}</span>
          </div>
        </div>

        {scenarioMandatory && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            A scenario is waiting. Finish it to unlock actions.
          </div>
        )}

        {childSickThisAge && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
            🤒 Sick week active — visit the Doctor for care options.
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Parent Wellbeing</h2>
            <div className="space-y-2">
              <HubButton
                emoji="🧘"
                label="Parent Strategies"
                description="Reset, mini break, reflect, protect sleep"
                onClick={() => setParentStrategiesOpen(true)}
                disabled={!parentStrategiesAvail.enabled}
                disabledReason={parentStrategiesAvail.reasonText}
              />
              <HubButton
                emoji="💆"
                label="Self-Care (Salon/Spa)"
                description="Reduce stress, recharge"
                onClick={() => setSalonSpaOpen(true)}
                disabled={!salonSpaAvail.enabled}
                disabledReason={salonSpaAvail.reasonText}
              />
              <HubButton
                emoji="📺"
                label="Videos (Netflix/Learning Videos)"
                description="Binge or learn"
                onClick={() => setVideosOpen(true)}
                disabled={!videosAvail.enabled}
                disabledReason={videosAvail.reasonText}
              />
              <HubButton
                emoji="🧩"
                label="Wisdom Lenses"
                description="Mindfulness, impermanence, compassion — unlock new options"
                onClick={() => setWisdomOpen(true)}
                disabled={scenarioMandatory || finished}
                disabledReason={scenarioMandatory ? "Finish the scenario first." : ""}
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Child Health & Activities</h2>
            <div className="space-y-2">
              <HubButton
                emoji="🩺"
                label="Health (Doctor)"
                description={childSickThisAge ? "🤒 Sick week — get care" : "Check-ups and care"}
                onClick={() => setDoctorOpen(true)}
                disabled={!doctorAvail.enabled}
                disabledReason={doctorAvail.reasonText}
              />
              <HubButton
                emoji="🧠"
                label="Mind & Body Classes"
                description="Martial arts, music, voice, mindfulness"
                onClick={() => setMindBodyOpen(true)}
                disabled={!mindBodyAvail.enabled}
                disabledReason={mindBodyAvail.reasonText}
              />
              <HubButton
                emoji="🙏"
                label="Faith & Community"
                description="Choose tradition, attend service"
                onClick={() => setFaithOpen(true)}
                disabled={!faithAvail.enabled}
                disabledReason={faithAvail.reasonText}
              />
            </div>
          </div>
        </div>
      </div>

      <ParentStrategiesModal
        open={parentStrategiesOpen}
        onClose={() => setParentStrategiesOpen(false)}
      />

      <DoctorModal
        open={doctorOpen}
        onClose={() => setDoctorOpen(false)}
      />

      <MindBodyModal
        open={mindBodyOpen}
        onClose={() => setMindBodyOpen(false)}
      />

      <SalonSpaModal
        open={salonSpaOpen}
        onClose={() => setSalonSpaOpen(false)}
      />

      <VideosModal
        open={videosOpen}
        onClose={() => setVideosOpen(false)}
      />

      <FaithModal
        open={faithOpen}
        onClose={() => setFaithOpen(false)}
      />

      <WisdomLensesModal
        open={wisdomOpen}
        onClose={() => setWisdomOpen(false)}
      />
    </div>
  );
}