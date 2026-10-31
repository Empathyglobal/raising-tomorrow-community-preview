import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, DollarSign, Zap } from 'lucide-react';

import { useGameState, formatMoney } from '@/components/game/GameStateContext';
import ActionModal from '@/components/game/ActionModal';
import ActionResultSheet from '@/components/game/ActionResultSheet';
import SupportNetworkModal from '@/components/game/SupportNetworkModal';
import OutingsModal from '@/components/game/OutingsModal';
import OutdoorAdventuresModal from '@/components/game/OutdoorAdventuresModal';
import PlaydatesModal from '@/components/game/PlaydatesModal';
import PetsModal from '@/components/game/PetsModal';
import RelationshipsModal from '@/components/game/RelationshipsModal';
import DatingAppModal from '@/components/game/DatingAppModal';
import RelationshipProfileModal from '@/components/game/RelationshipProfileModal';
import JokeBookModal from '@/components/game/JokeBookModal';

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
          : 'hover:border-rose-400 hover:bg-rose-50/50')
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

export default function Bond() {
  const navigate = useNavigate();
  const { gameState, getActionAvailability, updateState } = useGameState();
  const {
    money,
    actionPoints,
    maxFocusTokens,
    scenarioPending,
    scenarioCompletedThisAge,
    finished,
    relationships,
    householdType
  } = gameState;

  const scenarioMandatory = scenarioPending && !scenarioCompletedThisAge;
  const hasPartner = householdType === 'two' && !!relationships?.byId?.partner;

  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const [actionModalType, setActionModalType] = React.useState(null);
  const [supportOpen, setSupportOpen] = React.useState(false);
  const [outingsOpen, setOutingsOpen] = React.useState(false);
  const [outdoorOpen, setOutdoorOpen] = React.useState(false);
  const [playdatesOpen, setPlaydatesOpen] = React.useState(false);
  const [petsModalOpen, setPetsModalOpen] = React.useState(false);
  const [relationshipsOpen, setRelationshipsOpen] = React.useState(false);
  const [datingAppOpen, setDatingAppOpen] = React.useState(false);
  const [partnerProfileOpen, setPartnerProfileOpen] = React.useState(false);
  const [jokeBookOpen, setJokeBookOpen] = React.useState(false);

  const openActionModal = (type) => {
    setActionModalType(type);
    setActionModalOpen(true);
  };

  const handleDating = () => {
    if (hasPartner) {
      setPartnerProfileOpen(true);
    } else {
      setDatingAppOpen(true);
    }
  };

  const bondAvail = toSafeAvail(getActionAvailability('bond'));
  const playAvail = toSafeAvail(getActionAvailability('play'));
  const strategiesAvail = toSafeAvail(getActionAvailability('childStrategies'));
  const supportAvail = toSafeAvail(getActionAvailability('support'));
  const outingsAvail = toSafeAvail(getActionAvailability('outings'));
  const outdoorAvail = toSafeAvail(getActionAvailability('outdoorAdventures'));
  const playdatesAvail = toSafeAvail(getActionAvailability('playdates'));
  const petsAvail = toSafeAvail(getActionAvailability('pets'));
  const relationshipsAvail = toSafeAvail(getActionAvailability('relationships'));
  const jokeBookAvail = toSafeAvail(getActionAvailability('joke_book'));

  const datingBlocked = scenarioMandatory || finished;
  const datingBlockedReason = scenarioMandatory
    ? 'Complete the current scenario first.'
    : finished ? 'Game complete.' : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50/30 p-4 pb-24">
      <div className="rt-container">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">❤️ Bond</h1>
        <p className="text-sm text-slate-600 mb-4">Everything that strengthens connection.</p>

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

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-2">With your child</h2>
            <div className="space-y-2">
              <HubButton
                emoji="❤️"
                label="Bond"
                description="Lower stress, build love"
                onClick={() => openActionModal('bond')}
                disabled={!bondAvail.enabled}
                disabledReason={bondAvail.reasonText}
              />
              <HubButton
                emoji="🎮"
                label="Play"
                description="Joy, confidence, and ease"
                onClick={() => openActionModal('play')}
                disabled={!playAvail.enabled}
                disabledReason={playAvail.reasonText}
              />
              <HubButton
                emoji="🌿"
                label="Child Strategies"
                description="Intentional moves (costs Focus when used)"
                onClick={() => navigate(createPageUrl('Strategies'))}
                disabled={!strategiesAvail.enabled}
                disabledReason={strategiesAvail.reasonText}
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-2">People & Connection</h2>
            <div className="space-y-2">
              <HubButton
                emoji={hasPartner ? "💕" : "💘"}
                label={hasPartner ? "Date Your Partner" : "Find Partner (Dating)"}
                description={hasPartner ? "Keep the relationship strong" : "Try dating app to find a partner"}
                onClick={handleDating}
                disabled={datingBlocked}
                disabledReason={datingBlockedReason}
              />
              <HubButton
                emoji="🤝"
                label="Support Network"
                description="Get help when you need it"
                onClick={() => setSupportOpen(true)}
                disabled={!supportAvail.enabled}
                disabledReason={supportAvail.reasonText}
              />
              <HubButton
                emoji="🎬"
                label="Outings"
                description="Movies, road trips"
                onClick={() => setOutingsOpen(true)}
                disabled={!outingsAvail.enabled}
                disabledReason={outingsAvail.reasonText}
              />
              <HubButton
                emoji="🏕️"
                label="Outdoor Adventures"
                description="Hiking, camping, nature"
                onClick={() => setOutdoorOpen(true)}
                disabled={!outdoorAvail.enabled}
                disabledReason={outdoorAvail.reasonText}
              />
              <HubButton
                emoji="🤝"
                label="Playdates"
                description="Social time with friends"
                onClick={() => setPlaydatesOpen(true)}
                disabled={!playdatesAvail.enabled}
                disabledReason={playdatesAvail.reasonText}
              />
              <HubButton
                emoji="🐾"
                label={(gameState.pets?.length || 0) > 0 ? `Pets (${gameState.pets.length})` : "Adopt a Pet"}
                description="Care for your pets or adopt"
                onClick={() => setPetsModalOpen(true)}
                disabled={!petsAvail.enabled}
                disabledReason={petsAvail.reasonText}
              />
              <HubButton
                emoji="💞"
                label="Relationships Hub"
                description="All family & friends"
                onClick={() => setRelationshipsOpen(true)}
                disabled={!relationshipsAvail.enabled}
                disabledReason={relationshipsAvail.reasonText}
              />
              <HubButton
                emoji="🤣"
                label="Joke Book"
                description="Free mood lifter"
                onClick={() => setJokeBookOpen(true)}
                disabled={!jokeBookAvail.enabled}
                disabledReason={jokeBookAvail.reasonText}
              />
            </div>
          </div>
        </div>
      </div>

      <ActionModal
        open={actionModalOpen}
        actionType={actionModalType}
        onClose={() => setActionModalOpen(false)}
      />

      <SupportNetworkModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />

      <OutingsModal
        open={outingsOpen}
        onClose={() => setOutingsOpen(false)}
      />

      <OutdoorAdventuresModal
        open={outdoorOpen}
        onClose={() => setOutdoorOpen(false)}
      />

      <PlaydatesModal
        open={playdatesOpen}
        onClose={() => setPlaydatesOpen(false)}
      />

      <PetsModal
        open={petsModalOpen}
        onClose={() => setPetsModalOpen(false)}
      />

      <RelationshipsModal
        open={relationshipsOpen}
        onClose={() => setRelationshipsOpen(false)}
      />

      <DatingAppModal
        open={datingAppOpen}
        onClose={() => setDatingAppOpen(false)}
      />

      <RelationshipProfileModal
        open={partnerProfileOpen}
        personId="partner"
        onClose={() => setPartnerProfileOpen(false)}
      />

      <JokeBookModal
        open={jokeBookOpen}
        onClose={() => setJokeBookOpen(false)}
      />

      <ActionResultSheet
        open={!!gameState.actionResultPending}
        onClose={() => updateState({ actionResultPending: null })}
        result={gameState.actionResultPending}
      />
    </div>
  );
}