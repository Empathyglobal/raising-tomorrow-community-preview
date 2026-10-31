import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import GameModalShell from './GameModalShell';
import { useGameState, formatDeltas, hasMinorChild } from './GameStateContext';
import { NATURE_PLAY_ACTIVITIES, buildNatureScenario } from './naturePlayData';
import { pickHumor } from './humorUtils';

const NATURE_COACH_NOTES = {
  play_in_nature: "Nature play is the free DLC: movement + imagination = regulation. You followed their lead, so confidence grew quietly.",
  bird_watch: "Curiosity sticks when it's attached to a real moment. Observation + snacks = learning that doesn't feel like homework.",
  rock_leaf_museum: "Sorting \"treasures\" is early science. Naming, comparing, and noticing builds focus without a lecture.",
  cloud_detective: "Wonder + prediction is science thinking. Being wrong sometimes is part of learning—and you made that feel safe.",
  map_quest: "Low‑stakes navigation builds real competence. Letting them be the guide boosts confidence fast.",
  seed_to_sprout: "Caring for something teaches patience and responsibility in tiny daily reps (the only kind that actually works).",
  night_sounds_safari: "Facing the dark together builds bravery. Listening slows bodies down and settles nervous systems.",
  trail_cleanup_mission: "Helping together builds empathy and agency: \"we can make things better.\""
};

function formatEffects(choice) {
  const parts = [];
  const d = formatDeltas(choice?.deltas);
  if (d) parts.push(d);

  const love = Number(choice?.loveDelta || 0);
  const stress = Number(choice?.stressDelta || 0);

  if (love !== 0) parts.push(`LOVE ${love > 0 ? '+' : ''}${love}`);
  if (stress !== 0) parts.push(`STRESS ${stress > 0 ? '+' : ''}${stress}`);

  return parts.join(' • ');
}

const ADULT_NATURE_RECHARGE = [
  { id:'sunrise_walk', emoji:'🌅', title:'Sunrise Walk', tagline:'Quiet steps, loud clarity.', deltas:{ confidence:0.2 }, stressDelta:-1 },
  { id:'forest_breathing', emoji:'🌲', title:'Forest Breathing', tagline:'Regulate your nervous system.', deltas:{ empathy:0.2 }, stressDelta:-1.2 },
  { id:'trail_journal', emoji:'📓', title:'Trail Journal', tagline:'Process life on paper.', deltas:{ intelligence:0.2 }, stressDelta:-0.8 },
  { id:'lake_reset', emoji:'🏞️', title:'Lake Reset', tagline:'Still water, calmer mind.', deltas:{ confidence:0.2 }, stressDelta:-1 },
];

export default function NaturePlayModal({ open, onClose }) {
  const {
    gameState,
    updateState,
    applyDeltas,
    applyLove,
    applyStress,
    addLog,
    recordTimelineEntry
  } = useGameState();

  const age = Number(gameState.currentYear ?? 0);
  const childName = gameState.childName || 'your child';
  const countryIso3 = gameState.countryIso3 || 'USA';
  const minorChildPresent = hasMinorChild(gameState);
  
  // Adult companion setup
  const roster = Array.isArray(gameState.relationships?.roster) ? gameState.relationships.roster : [];
  const bestFriend = roster.find(p => p.id === 'my_best_friend') || null;
  const hasPartner = gameState.householdType === 'two' && !!gameState.partnerName;
  
  const companionOptions = [
    { key: 'solo', label: 'Solo' },
    ...(hasPartner ? [{ key: 'partner', label: gameState.partnerName || 'Partner' }] : []),
    ...(bestFriend ? [{ key: 'friend', label: bestFriend.name || 'Best Friend' }] : []),
  ];
  
  const [companionKey, setCompanionKey] = React.useState(companionOptions[0]?.key || 'solo');
  
  const getCompanionName = () => {
    if (companionKey === 'partner') return gameState.partnerName || 'your partner';
    if (companionKey === 'friend') return bestFriend?.name || 'your best friend';
    return null;
  };
  
  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
  
  const bumpCompanionMeter = (delta) => {
    if (companionKey === 'partner' && hasPartner) {
      updateState(prev => ({ ...prev, partnerMeter: clamp(Number(prev.partnerMeter || 50) + delta) }));
    }
    if (companionKey === 'friend' && bestFriend) {
      updateState(prev => ({
        ...prev,
        relationships: {
          ...prev.relationships,
          roster: prev.relationships.roster.map(p => p.id === bestFriend.id ? { ...p, meter: clamp((p.meter || 50) + delta) } : p),
          byId: {
            ...prev.relationships.byId,
            my_best_friend: { ...(prev.relationships.byId.my_best_friend || bestFriend), meter: clamp(((prev.relationships.byId.my_best_friend || bestFriend).meter || 50) + delta) }
          }
        }
      }));
    }
  };

  // Back-compat: some older components used `pendingScenario`
  const scenarioPending = Boolean(gameState.scenarioPending ?? gameState.pendingScenario);
  const scenarioCompletedThisAge = Boolean(gameState.scenarioCompletedThisAge);
  const scenarioBlocked = scenarioPending && !scenarioCompletedThisAge;

  const focus = Number(gameState.actionPoints ?? 0);
  const finished = Boolean(gameState.finished);

  const canUse = !finished && !scenarioBlocked && focus >= 1;

  const [step, setStep] = useState('pick'); // pick | question | result
  const [scenario, setScenario] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!open) {
      setStep('pick');
      setScenario(null);
      setResult(null);
      return;
    }
    setStep('pick');
    setScenario(null);
    setResult(null);
  }, [open]);

  const availableActivities = useMemo(() => {
    if (minorChildPresent) {
      return NATURE_PLAY_ACTIVITIES.filter(a => age >= a.minAge && age <= a.maxAge);
    } else {
      return ADULT_NATURE_RECHARGE;
    }
  }, [age, minorChildPresent]);

  const startActivity = (activityId) => {
    if (!canUse) return;
    
    if (minorChildPresent) {
      // Child version
      const built = buildNatureScenario(activityId, {
        age,
        childName,
        countryIso3
      });
      setScenario(built);
      setStep('question');
    } else {
      // Adult version - use simplified structure
      const activity = ADULT_NATURE_RECHARGE.find(a => a.id === activityId);
      if (!activity) return;
      
      setScenario({
        activityId: activity.id,
        id: activity.id,
        emoji: activity.emoji,
        title: activity.title,
        tagline: activity.tagline,
        setup: activity.tagline,
        question: 'Ready?',
        choices: [
          {
            id: 'go',
            emoji: activity.emoji,
            label: 'Go',
            deltas: activity.deltas || {},
            stressDelta: activity.stressDelta || 0,
            loveDelta: 0
          }
        ]
      });
      setStep('question');
    }
  };

  const handleChoice = (choice) => {
    if (!canUse) return;
    if (!scenario || !choice) return;

    // Spend exactly 1 focus
    updateState(prev => ({
      actionPoints: Math.max(0, Number(prev.actionPoints ?? 0) - 1)
    }));

    if (minorChildPresent) {
      // Child version - keep existing behavior
      if (choice.deltas) applyDeltas(choice.deltas, `Nature Play: ${scenario.title}`);
      if (choice.loveDelta) applyLove(choice.loveDelta, `Nature Play: ${scenario.title}`);
      if (choice.stressDelta) applyStress(choice.stressDelta, `Nature Play: ${scenario.title}`);

      const logLine = choice.logLine || null;
      if (logLine) addLog(logLine);

      recordTimelineEntry({
        kind: "outing",
        title: `${scenario.emoji} ${scenario.title}`,
        detail: logLine || scenario.setup,
        deltas: choice.deltas || null,
        moneyDelta: 0,
        loveDelta: choice.loveDelta || 0,
        stressDelta: choice.stressDelta || 0,
        meta: { activityId: scenario.activityId, choiceId: choice.id, countryIso3 }
      });

      const stinger = pickHumor('naturePlay', { childName });
      setResult({
        title: scenario.title,
        emoji: scenario.emoji,
        text: (logLine || "You have a meaningful moment outdoors.") + "\n\n😄 " + stinger,
        effects: formatEffects(choice),
        coachNote: NATURE_COACH_NOTES[scenario.activityId]
      });
    } else {
      // Adult version
      if (choice.deltas) applyDeltas(choice.deltas, `Nature Recharge: ${scenario.title}`);
      if (choice.stressDelta) applyStress(choice.stressDelta, `Nature Recharge: ${scenario.title}`);
      bumpCompanionMeter(2);

      const companionName = getCompanionName();
      const logBody = companionName 
        ? `${scenario.emoji} ${scenario.title}: You and ${companionName} spend time in nature. ${scenario.tagline}`
        : `${scenario.emoji} ${scenario.title}: You spend time in nature. ${scenario.tagline}`;
      
      addLog(logBody);

      recordTimelineEntry({
        kind: "outing",
        title: `${scenario.emoji} ${scenario.title}`,
        detail: logBody,
        deltas: choice.deltas || null,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: choice.stressDelta || 0,
        meta: { activityId: scenario.id, companionKey }
      });

      setResult({
        title: scenario.title,
        emoji: scenario.emoji,
        text: logBody,
        effects: formatEffects(choice),
        coachNote: null
      });
    }

    setStep('result');
  };

  const headerSubtitle = scenarioBlocked
    ? "Finish the mandatory scenario first, then come back for nature fun."
    : minorChildPresent
      ? "Costs 1 Focus • Big benefits • Always boosts INT"
      : "Costs 1 Focus • Nature recharge for adults";

  return (
    <GameModalShell
      open={open}
      onClose={onClose}
      title="🐸 Nature Play"
      subtitle={headerSubtitle}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Focus: <span className="font-semibold text-slate-800">{focus}</span>
            {!canUse && (
              <span className="ml-2 text-slate-500">
                {finished ? "Run finished." : scenarioBlocked ? "Scenario pending." : "Not enough focus."}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {step !== 'pick' && (
              <Button variant="outline" onClick={() => { setStep('pick'); setScenario(null); setResult(null); }}>
                Back to activities
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      {step === 'pick' && (
        <div className="space-y-3">
          {!minorChildPresent && companionOptions.length > 1 && (
            <div className="bg-white/70 border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-500 mb-2">Go with:</div>
              <div className="flex gap-2">
                {companionOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setCompanionKey(opt.key)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      companionKey === opt.key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white/70 border border-slate-200 rounded-xl p-4">
            <div className="font-semibold text-slate-800">
              {minorChildPresent ? 'Pick an activity' : 'Nature Recharge'}
            </div>
            <div className="text-sm text-slate-700 mt-1">
              {minorChildPresent 
                ? 'Each activity costs 1 focus and leads to a quick question. Expect science, bonding, and at least one "why is this sticky?" moment.'
                : 'Each activity costs 1 focus. Take a break in nature and reset.'
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableActivities.map(act => (
              <button
                key={act.id}
                disabled={!canUse}
                onClick={() => startActivity(act.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  canUse
                    ? "bg-white hover:bg-amber-50/50 border-slate-200 hover:border-amber-400"
                    : "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{act.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800">{act.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{act.tagline}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      {minorChildPresent ? 'Costs 1 Focus • Boosts INT' : 'Costs 1 Focus'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {!canUse && (
            <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
              {finished && "This run is finished — start a new run to keep playing."}
              {!finished && scenarioBlocked && "You have a mandatory scenario waiting. Complete it, then come back for Nature Play."}
              {!finished && !scenarioBlocked && focus < 1 && "You're out of focus for the year. Age up to refresh focus."}
            </div>
          )}
        </div>
      )}

      {step === 'question' && scenario && (
        <div className="space-y-4">
          <div className="bg-white/70 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{scenario.emoji}</div>
              <div className="font-semibold text-slate-800">{scenario.title}</div>
            </div>
            <div className="text-sm text-slate-700 mt-2 leading-relaxed">{scenario.setup}</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="font-semibold text-slate-800">{scenario.question}</div>
          </div>

          <div className="space-y-2">
            {scenario.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                disabled={!canUse}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  canUse
                    ? "bg-white hover:bg-amber-50/50 border-slate-200 hover:border-amber-400"
                    : "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{choice.emoji || "✨"}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800">{choice.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{formatEffects(choice)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="space-y-4">
          <div className="bg-white/70 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2">
              <div className="text-3xl">{result.emoji}</div>
              <div className="font-bold text-slate-800 text-lg">{result.title}</div>
            </div>
            <div className="text-sm text-slate-700 mt-3 leading-relaxed">{result.text}</div>
            {result.effects && (
              <div className="text-xs text-slate-500 mt-3">
                Effects: <span className="font-semibold text-slate-700">{result.effects}</span>
              </div>
            )}
          </div>

          {result.coachNote && (
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <p className="text-xs font-semibold text-purple-800 mb-1">💡 Why this worked</p>
              <p className="text-xs text-purple-700 leading-relaxed">{result.coachNote}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setStep('pick');
                setScenario(null);
                setResult(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Do another activity
            </Button>
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>

          {minorChildPresent && (
            <div className="text-xs text-slate-500">
              Pro tip: Nature Play is basically "parenting DLC" — it boosts brains *and* bonding.
            </div>
          )}
        </div>
      )}
    </GameModalShell>
  );
}