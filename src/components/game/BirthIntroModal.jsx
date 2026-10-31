import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameModalShell from './GameModalShell';
import PlayerSpriteAvatar from './PlayerSpriteAvatar';
import { Button } from '@/components/ui/button';
import { useGameState, formatMoney, getCountryScale, localizeAmount } from './GameStateContext';
import { HOUSING_OPTIONS, COMMUTE_OPTIONS, DEFAULT_LIVING_SETUP, autoSelectLivingSetup } from './livingConfig';
import GuidanceModal from './GuidanceModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Theme overrides for special starts
const HOUSING_THEME_OVERRIDES = {
  kim_jong_un: {
    tent: { name: 'Underground Bunker', emoji: '🕳️', note: 'Paranoid, safe, and windowless.' },
    shared_room: { name: 'Palace Annex', emoji: '🏛️', note: 'Close to power… and palace drama.' },
    apartment_basic: { name: 'Pyongyang Mansion', emoji: '🏰', note: 'Marble floors. Too many portraits.' },
    family_home_rent: { name: 'Seaside Compound', emoji: '🏝️', note: 'Ocean breeze, guards, and gold faucets.' }
  },
  zombie_apocalypse: {
    tent: { name: 'Forest Tent', emoji: '⛺', note: 'Cheap, cold, and suspiciously damp.' },
    shared_room: { name: 'Crowded Safehouse', emoji: '🧟', note: 'Elbows everywhere. Nobody sleeps.' },
    apartment_basic: { name: 'Boarded-Up Apartment', emoji: '🪵', note: 'You own 14 planks and 1 dream.' },
    family_home_rent: { name: 'Fortified Farmhouse', emoji: '🧱', note: 'Fences, traps, and a prayer.' }
  },
  alien_invasion: {
    tent: { name: 'Camouflage Tarp Camp', emoji: '🥷', note: 'If it looks like trash, aliens ignore it.' },
    shared_room: { name: 'Basement Hideout', emoji: '🕯️', note: 'Cozy. Terrifying. Cozy.' },
    apartment_basic: { name: 'Blackout Apartment', emoji: '🌑', note: 'No lights. No noise. So much whispering.' },
    family_home_rent: { name: 'Rural Bunker Cabin', emoji: '🏚️', note: 'Far from cities. Close to paranoia.' }
  },
  refugee_camp: {
    tent: { name: 'Aid Tent', emoji: '⛺', note: 'Canvas, wind, and resilience.' },
    shared_room: { name: 'Crowded Family Tent', emoji: '🫂', note: 'No privacy. A lot of love.' },
    apartment_basic: { name: 'Temporary Container', emoji: '📦', note: 'Better walls. Still temporary.' },
    family_home_rent: { name: 'Clinic Corner Space', emoji: '🏥', note: 'Safer… but never quiet.' }
  },
  war_zone: {
    tent: { name: 'Rubble Shelter', emoji: '🧱', note: 'You make a home from what\'s left.' },
    shared_room: { name: 'Basement Room', emoji: '🕯️', note: 'Quieter. Safer. Still tense.' },
    apartment_basic: { name: 'Small Apartment', emoji: '🏢', note: 'Windows taped. Bags packed.' },
    family_home_rent: { name: 'Relatives\' Place', emoji: '🏠', note: 'More people. More protection.' }
  }
};

const COMMUTE_THEME_OVERRIDES = {
  kim_jong_un: {
    walk: { name: 'Parade Walk', emoji: '🥁', note: 'Wave for the cameras. Smile like you mean it.' },
    bike: { name: 'Motorcade Drill', emoji: '🏍️', note: 'Practice the convoy route. Again.' },
    bus: { name: 'Private Train Ride', emoji: '🚆', note: 'Luxury… but you still can\'t relax.' },
    rideshare: { name: 'Armored Limo', emoji: '🚘', note: 'Bulletproof comfort.' }
  },
  zombie_apocalypse: {
    walk: { name: 'Sneak On Foot', emoji: '👟', note: 'Quiet is life.' },
    bike: { name: 'Bike Run', emoji: '🚲', note: 'Fast, silent, exhausting.' },
    bus: { name: 'Noisy Van', emoji: '🚐', note: 'Loud… but carries supplies.' },
    rideshare: { name: 'Armored Truck', emoji: '🚚', note: 'Safer… and VERY noticeable.' }
  },
  alien_invasion: {
    walk: { name: 'Sewer Routes', emoji: '🕳️', note: 'Disgusting. Effective.' },
    bike: { name: 'Alley Bike', emoji: '🚲', note: 'Fast and quiet—if you don\'t crash.' },
    bus: { name: 'Crowd Shuttle', emoji: '🚌', note: 'Safety in numbers… maybe.' },
    rideshare: { name: 'Smuggler Ride', emoji: '🚗', note: 'Expensive, sketchy, useful.' }
  },
  refugee_camp: {
    walk: { name: 'On Foot', emoji: '👣', note: 'Most days, it\'s just your feet.' },
    bike: { name: 'Borrowed Bike', emoji: '🚲', note: 'Rare, helpful, risky.' },
    bus: { name: 'Aid Truck Ride', emoji: '🚛', note: 'If there\'s room.' },
    rideshare: { name: 'Shared Minibus', emoji: '🚐', note: 'Crowded, but faster.' }
  },
  war_zone: {
    walk: { name: 'Walk Carefully', emoji: '👟', note: 'Eyes up. Routes changed.' },
    bike: { name: 'Quick Bike Route', emoji: '🚲', note: 'Faster, if roads cooperate.' },
    bus: { name: 'Shared Taxi/Bus', emoji: '🚌', note: 'When it\'s running.' },
    rideshare: { name: 'Trusted Driver', emoji: '🚗', note: 'Costs more. Feels safer.' }
  }
};

export default function BirthIntroModal({ 
  open, 
  childName, 
  childAvatarEmoji, 
  childAvatarGender, 
  childAvatarSpriteIndex, 
  partnerName, 
  partnerEmoji, 
  partnerCareer, 
  parentName, 
  onComplete 
}) {
  const { gameState, updateState } = useGameState();
  const [step, setStep] = useState(1); // 1=style, 2=housing, 3=commute
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedHousing, setSelectedHousing] = useState(gameState.livingSetup?.housingId || DEFAULT_LIVING_SETUP.housingId);
  const [selectedCommute, setSelectedCommute] = useState(gameState.livingSetup?.commuteId || DEFAULT_LIVING_SETUP.commuteId);
  
  // Guidance system
  const [guidanceStepId, setGuidanceStepId] = useState(null);
  
  const guidanceEnabled = gameState?.guidanceEnabled === true;
  const guidanceDismissed = gameState?.guidanceDismissedForever === true;
  const stepSeen = gameState?.guidanceStepSeen || {};
  
  const specialStartId = gameState?.specialStartId || null;
  const isThemeLinkedLiving = !!specialStartId && (
    HOUSING_THEME_OVERRIDES[specialStartId] || 
    COMMUTE_THEME_OVERRIDES[specialStartId]
  );

  useEffect(() => {
    if (!open) return;
    if (!isThemeLinkedLiving) {
      const auto = autoSelectLivingSetup(gameState);
      setSelectedHousing(auto.housingId);
      setSelectedCommute(auto.commuteId);
    }
  }, [open, isThemeLinkedLiving, gameState]);

  // G1: Show before parenting style selection (step 1, once) - AFTER G0 acknowledged
  useEffect(() => {
    if (!open || !guidanceEnabled || guidanceDismissed) return;
    if (step !== 1 || stepSeen.G1_PARENTING_STYLE_PRE) return;
    if (!stepSeen.G0_WELCOME) return; // Wait for G0 first
    setGuidanceStepId('G1_PARENTING_STYLE_PRE');
  }, [open, step, guidanceEnabled, guidanceDismissed, stepSeen]);

  const handleGuidanceContinue = () => {
    const stepId = guidanceStepId;
    setGuidanceStepId(null);
    
    if (stepId) {
      updateState(prev => ({
        guidanceStepSeen: { ...(prev.guidanceStepSeen || {}), [stepId]: true }
      }));
    }

    // G3: After G2, show finances-pre when housing screen appears
    if (stepId === 'G2_PARENTING_STYLE_POST' && step === 2 && !stepSeen.G3_FINANCES_PRE) {
      setTimeout(() => setGuidanceStepId('G3_FINANCES_PRE'), 300);
    }
  };

  const handleGuidanceCloseForever = () => {
    setGuidanceStepId(null);
    updateState({
      guidanceDismissedForever: true,
      guidanceEnabled: false
    });
  };

  if (!open) return null;

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    
    if (isThemeLinkedLiving) {
      setStep(2);
      
      // G2: Show immediately after style selection
      if (guidanceEnabled && !guidanceDismissed && !stepSeen.G2_PARENTING_STYLE_POST) {
        setTimeout(() => {
          setGuidanceStepId('G2_PARENTING_STYLE_POST');
        }, 200);
      }
    } else {
      // Normal run: Auto-select housing/commute and finish
      if (onComplete) {
        const auto = autoSelectLivingSetup(gameState);
        onComplete({
          parentingStyleId: styleId || 'unsure',
          housingId: auto.housingId,
          commuteId: auto.commuteId
        });
      }
    }
  };

  const handleHousingSelect = (housingId) => {
    setSelectedHousing(housingId);
    setStep(3);
  };

  const handleCommuteSelect = (commuteId) => {
    setSelectedCommute(commuteId);
    
    // G4: Show immediately after finances confirmed
    if (guidanceEnabled && !guidanceDismissed && !stepSeen.G4_FINANCES_POST) {
      setGuidanceStepId('G4_FINANCES_POST');
      // Don't call onComplete yet - wait for modal to close
      return;
    }
    
    if (onComplete) {
      onComplete({
        parentingStyleId: selectedStyle || 'unsure',
        housingId: selectedHousing,
        commuteId
      });
    }
  };

  const scale = getCountryScale(gameState.countryIso3 || 'USA');

  const STYLE_THEME = {
    unsure:        { border: "border-slate-200",   ring: "hover:ring-slate-300 data-[selected=true]:ring-slate-400",   bar: "bg-slate-400/50" },
    permissive:    { border: "border-pink-200",    ring: "hover:ring-pink-300 data-[selected=true]:ring-pink-400",     bar: "bg-pink-400/70" },
    authoritarian: { border: "border-red-200",     ring: "hover:ring-red-300 data-[selected=true]:ring-red-400",       bar: "bg-red-400/70" },
    authoritative: { border: "border-emerald-200", ring: "hover:ring-emerald-300 data-[selected=true]:ring-emerald-400", bar: "bg-emerald-400/70" },
    anxious:       { border: "border-amber-200",   ring: "hover:ring-amber-300 data-[selected=true]:ring-amber-400",   bar: "bg-amber-400/70" }
  };

  const PARENTING_STYLES = [
    {
      id: 'unsure',
      label: "A bit of everything",
      emoji: '🎲',
      hint: "Keep the default system for now.",
      color: 'from-slate-50 to-white text-slate-800',
      tooltipTitle: 'Unsure',
      tooltipBody: "You're figuring it out.\nPros: flexible.\nCons: inconsistent outcomes."
    },
    {
      id: 'permissive',
      label: 'Permissive',
      emoji: '🪁',
      hint: 'Rules are vibes. Bedtime is a suggestion.',
      color: 'from-pink-100 to-rose-50 text-pink-800',
      tooltipTitle: 'Permissive',
      tooltipBody: 'Warm, low rules.\nPros: creativity, closeness.\nCons: can reduce discipline and follow-through.'
    },
    {
      id: 'authoritarian',
      label: 'Authoritarian',
      emoji: '🧱',
      hint: 'Because I said so… and also because I panic.',
      color: 'from-red-100 to-rose-50 text-red-800',
      tooltipTitle: 'Authoritarian',
      tooltipBody: 'Strict rules and high expectations.\nPros: discipline, structure.\nCons: can raise stress and reduce warmth.'
    },
    {
      id: 'authoritative',
      label: 'Authoritative',
      emoji: '🌿',
      hint: 'Warm, firm, and somehow always carrying snacks.',
      color: 'from-emerald-100 to-green-50 text-emerald-800',
      tooltipTitle: 'Authoritative',
      tooltipBody: 'Firm but warm.\nPros: confidence + long-term trust.\nCons: takes consistency and patience.'
    },
    {
      id: 'anxious',
      label: 'Anxious',
      emoji: '🚁',
      hint: "I'm not hovering. I'm… strategically airborne.",
      color: 'from-amber-100 to-orange-50 text-amber-800',
      tooltipTitle: 'Anxious',
      tooltipBody: 'High worry, high involvement.\nPros: protection.\nCons: can increase stress and limit independence.'
    }
  ];

  return (
    <>
      <GameModalShell
        open={open}
        title={step === 1 ? '🍼 Welcome' : step === 2 ? '🏠 Choose Housing' : '🚗 Choose Commute'}
        closeOnBackdrop={false}
        showCloseButton={false}
        className="max-w-2xl flex flex-col max-h-[90vh]"
      >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">

        {/* Step 1: Parenting Style */}
        {step === 1 && (
          <>
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
              Congratulations!
            </h2>

            {/* Big Avatar */}
            <div className="flex justify-center">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 ring-4 ring-amber-100/70 flex items-center justify-center">
                {Number.isFinite(Number(childAvatarSpriteIndex)) && Number(childAvatarSpriteIndex) >= 0 && Number(childAvatarSpriteIndex) <= 15 ? (
                  <PlayerSpriteAvatar
                    ageNumber={0}
                    index={Number(childAvatarSpriteIndex)}
                    genderKey={childAvatarGender === 'girl' ? 'female' : 'male'}
                    size={160}
                    fallbackEmoji={childAvatarEmoji}
                    className="bg-white"
                  />
                ) : (
                  <span className="text-8xl md:text-9xl leading-none select-none">
                    {childAvatarEmoji}
                  </span>
                )}
              </div>
            </div>

            {/* Intro Text */}
            <div className="space-y-4 max-w-lg mx-auto text-center">
              <p className="text-lg text-slate-700 leading-relaxed">
                {(() => {
                  const role = gameState?.parentRole;
                  const nameEl = (<span className="font-bold text-slate-900">{childName}</span>);
                  if (role === 'dad') return <>You're now the proud father of {nameEl}.</>;
                  if (role === 'mom') return <>You gave birth to {nameEl}.</>;
                  return <>You welcomed {nameEl} into your family.</>;
                })()}
                {' '}The first days are a blur of love, laundry, and tiny noises that somehow feel like a full conversation.
              </p>

              {partnerName && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 text-sm">
                  <p>
                    You're not doing this alone. <span className="text-xl">{partnerEmoji}</span> <strong>{partnerName}</strong> is here too.
                    {partnerCareer?.jobTitle && (
                      <span className="block mt-1 text-slate-500">
                        They work as a {partnerCareer.jobTitle}.
                      </span>
                    )}
                  </p>
                </div>
              )}

              {!isThemeLinkedLiving && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 text-center">
                  🏠 Housing and 🚗 commute will be auto-selected from your income tier. You can change them later in Life → Quality of Life.
                </div>
              )}
            </div>

            {/* Parenting Style Selection */}
            <div className="w-full pt-4 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
                What kind of parent do you want to be?
              </h3>

              <TooltipProvider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {PARENTING_STYLES.map((style) => (
                    <motion.button
                      key={style.id}
                      type="button"
                      data-tour={`birth-parenting-style-${style.id}`}
                      data-selected={selectedStyle === style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStyleSelect(style.id)}
                      className={`group relative flex items-start gap-3 p-6 rounded-2xl border-2 transition-all hover:shadow-md bg-gradient-to-br cursor-pointer ring-2 ring-transparent ${style.color} ${STYLE_THEME[style.id]?.border} ${STYLE_THEME[style.id]?.ring}`}
                    >
                      <div className={`h-10 w-1 rounded-full flex-shrink-0 ${STYLE_THEME[style.id]?.bar}`} />
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {style.emoji}
                        </div>
                        <div className="font-bold text-lg mb-2">
                          {style.label}
                        </div>
                        <div className="text-xs opacity-80 font-medium px-2 text-center">
                          {style.hint}
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            data-tour={`birth-parenting-style-${style.id}-info`}
                            onClick={(e) => { e.stopPropagation(); }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-white border border-slate-300 flex items-center justify-center transition-colors"
                          >
                            <Info className="w-3 h-3 text-slate-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="font-semibold mb-1">{style.tooltipTitle}</div>
                          <div className="text-xs whitespace-pre-line">{style.tooltipBody}</div>
                        </TooltipContent>
                      </Tooltip>
                    </motion.button>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </>
        )}

        {/* Step 2: Housing */}
        {step === 2 && (
          <>
            <h3 className="font-bold text-xl text-slate-800 text-center">Where Will You Live?</h3>
            <p className="text-sm text-slate-600 text-center max-w-md mx-auto">
              Your housing affects stress, focus, and your child's development.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOUSING_OPTIONS.map((option) => {
                const override = specialStartId && HOUSING_THEME_OVERRIDES[specialStartId]?.[option.id];
                const display = override ? { ...option, ...override } : option;
                const costLocal = localizeAmount(option.yearlyCostBase, scale);
                const focusText = option.focusMod > 0 ? `+${option.focusMod}` : option.focusMod < 0 ? `${option.focusMod}` : '0';

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    data-tour={`birth-housing-${option.id}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHousingSelect(option.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedHousing === option.id
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{display.emoji}</span>
                      <div className="font-bold text-slate-800 text-sm">{display.label}</div>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Cost/year: ${formatMoney(costLocal)}</div>
                      <div>Focus: {focusText}</div>
                      <div className="text-slate-500 italic mt-1">{display.note}</div>
                      {!override && <div className="text-slate-400 text-[10px]">Renting (you can buy later)</div>}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {/* Step 3: Commute */}
        {step === 3 && (
          <>
            <h3 className="font-bold text-xl text-slate-800 text-center">How Will You Get to Work?</h3>
            <p className="text-sm text-slate-600 text-center max-w-md mx-auto">
              Your commute affects time, energy, and health.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMUTE_OPTIONS.map((option) => {
                const override = specialStartId && COMMUTE_THEME_OVERRIDES[specialStartId]?.[option.id];
                const display = override ? { ...option, ...override } : option;
                const costLocal = localizeAmount(option.yearlyCostBase, scale);
                const focusText = option.focusMod > 0 ? `+${option.focusMod}` : option.focusMod < 0 ? `${option.focusMod}` : '0';
                const healthText = option.playerHealthDrift ? `Health: ${option.playerHealthDrift > 0 ? '+' : ''}${option.playerHealthDrift}/yr` : null;

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    data-tour={`birth-commute-${option.id}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCommuteSelect(option.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedCommute === option.id
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{display.emoji}</span>
                      <div className="font-bold text-slate-800 text-sm">{display.label}</div>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Cost/year: ${formatMoney(costLocal)}</div>
                      <div>Focus: {focusText}</div>
                      {healthText && <div>{healthText}</div>}
                      <div className="text-slate-500 italic mt-1">{display.note}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sticky Footer (only on steps 2 & 3) */}
      {step > 1 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 flex gap-2">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="flex-1"
          >
            Back
          </Button>

          {/* Continue/Finish Button */}
          {step === 2 && (
            <Button
              onClick={() => handleHousingSelect(selectedHousing)}
              disabled={!selectedHousing}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={() => handleCommuteSelect(selectedCommute)}
              disabled={!selectedCommute}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish
            </Button>
          )}
        </div>
      )}
      </GameModalShell>
      
      <GuidanceModal
        open={!!guidanceStepId}
        stepId={guidanceStepId}
        onContinue={() => {
          const currentStepId = guidanceStepId;
          handleGuidanceContinue();
          
          // G4: After finances post, complete birth intro
          if (currentStepId === 'G4_FINANCES_POST' && onComplete) {
            setTimeout(() => {
              onComplete({
                parentingStyleId: selectedStyle,
                housingId: selectedHousing,
                commuteId: selectedCommute
              });
            }, 100);
          }
        }}
        onCloseForever={handleGuidanceCloseForever}
        data={{
          styleName: selectedStyle ? (PARENTING_STYLES.find(s => s.id === selectedStyle)?.label || selectedStyle) : 'Your Choice'
        }}
      />
    </>
  );
}