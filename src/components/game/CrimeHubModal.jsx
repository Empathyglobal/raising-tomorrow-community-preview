import React from 'react';
import { useGameState } from '@/components/game/GameStateContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ADULT_CRIMES, validateAdultCrimeData } from '@/components/game/adultCrimeData';
import { attemptAdultCrime, resolveAdultCourt, ensureAdultCrimeState } from '@/components/game/adultCrimeEngine';

export default function CrimeHubModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, emitActionResult, recordTimelineEntry, resetYearActions, applyStartOfAgeResources, captureYearCheckpoint, consumeAction, startPrisonFromCourt } = useGameState();
  const adultCrime = ensureAdultCrimeState(gameState.adultCrime);
  
  const [step, setStep] = React.useState('list');
  const [pickedCrime, setPickedCrime] = React.useState(null);
  const [attemptRes, setAttemptRes] = React.useState(null);
  const [courtRes, setCourtRes] = React.useState(null);

  React.useEffect(() => {
    if (!open) {
      setStep('list');
      setPickedCrime(null);
      setAttemptRes(null);
      setCourtRes(null);
    }
  }, [open]);

  const crimes = React.useMemo(() => {
    let list = ADULT_CRIMES;
    if (import.meta?.env?.DEV) {
      const v = validateAdultCrimeData();
      if (!v.ok) {
        toast.error('Some crime entries are invalid. Filtering them.');
      }
      list = v.crimes;
    }
    return list;
  }, []);

  const grouped = React.useMemo(() => {
    const map = {};
    for (const c of crimes) {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    }
    return map;
  }, [crimes]);

  // NK Special Start: disable crime modal
  if (gameState.disableCrime && open) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🚫 Crime Disabled</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-slate-600 mb-4">Crime options are not available in this Special Start.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const approaches = [
    { id: 'careful', label: 'Careful', desc: 'Lower risk, modest reward', caughtMod: -0.08, successMod: -0.03, payoutMult: 1.0, heatMult: 0.8 },
    { id: 'bold', label: 'Bold', desc: 'Higher chance, higher heat', caughtMod: +0.05, successMod: +0.08, payoutMult: 1.15, heatMult: 1.15 },
    { id: 'crew', label: 'With Crew', desc: adultCrime.crew >= 35 ? 'Stronger odds' : 'Need Crew 35+', caughtMod: +0.02, successMod: +0.10, payoutMult: 1.25, heatMult: 1.2, disabled: adultCrime.crew < 35 },
    { id: 'desperation', label: 'Desperation', desc: 'Very risky, bigger upside', caughtMod: +0.12, successMod: -0.02, payoutMult: 1.4, heatMult: 1.5 },
  ];

  const doAttempt = async (approach) => {
    // spend focus via existing system if available
    if (typeof consumeAction === 'function') {
      const ok = consumeAction('crime');
      if (!ok) { toast.error('Not enough Focus.'); return; }
    }
    try {
      const res = attemptAdultCrime({ state: gameState, crime: pickedCrime, approach });
      setAttemptRes(res);
      // Apply state patch + money
      updateState(prev => ({ adultCrime: ensureAdultCrimeState({ ...(prev.adultCrime||{}), ...(res.nextPatch||{}) }) }));
      if (res.moneyDelta) applyMoneyDelta(res.moneyDelta, { source: 'Adult Crime' });
      // Court if caught
      if (res.type === 'caught') {
        setStep('court');
      } else {
         // emit result and close
         const setup = `${pickedCrime.blurb} ${randPick(pickedCrime?.text?.intros) || ''}`.trim();
         const why = approachWhyLine({ approachId: approach.id, outcomeType: res.type });
         emitActionResult({
          actionId: 'crime',
          title: res.result?.headline || 'Crime Result',
          body: [setup, why, res.result?.body, res.result?.viral].filter(Boolean).join('\n\n'),
          deltas: {},
          loveDelta: 0,
          stressDelta: 0,
          moneyDelta: res.moneyDelta || 0,
          focusDelta: -1,
          tags: ['money','crime'],
          meta: { emoji: pickedCrime?.emoji || '🕶️', quote: res.result?.quote || null }
        });
        onClose?.();
      }
    } catch (e) {
      console.error('[Crime] attempt failed', e);
      toast.error('That fizzled. Try another approach.');
    }
  };

  const doCourt = async (choice) => {
    try {
      const res = resolveAdultCourt({ state: gameState, crime: pickedCrime, courtChoice: choice, evidenceTags: attemptRes?.evidenceTags||[] });
      setCourtRes(res);
      updateState(prev => ({ adultCrime: ensureAdultCrimeState({ ...(prev.adultCrime||{}), ...(res.nextPatch||{}) }) }));
      if (res.moneyDelta) applyMoneyDelta(res.moneyDelta, { source: 'Court' });

      // Start prison system if convicted
      if (res.prisonYears > 0) {
        startPrisonFromCourt({
          prisonYears: res.prisonYears,
          offenseId: pickedCrime?.id || "unknown",
          offenseLabel: pickedCrime?.title || "Crime",
          severity: Number(pickedCrime?.severity)||1
        });
      }

      let bodyText = res.result?.body || 'Case resolved.';
      if (res.prisonYears > 0) {
        bodyText += `\n\nSentence: ${res.prisonYears} year(s) in prison.`;
      }

      emitActionResult({
        actionId: 'crime',
        title: res.result?.headline || 'Court Result',
        body: bodyText,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        moneyDelta: res.moneyDelta || 0,
        focusDelta: 0,
        tags: ['crime','court'],
        meta: { emoji: '⚖️' }
      });

      onClose?.();
    } catch (e) {
      console.error('[Crime] court failed', e);
      toast.error('Court had a paperwork moment. Try later.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v)=>{ if(!v) onClose?.(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crime (Adult) — Play At Your Own Peril</DialogTitle>
        </DialogHeader>

        {step === 'list' && (
          <div className="space-y-4">
            <StatsBar adultCrime={adultCrime} />
            <ScrollArea className="h-[48vh] pr-2">
              <div className="space-y-5">
                {Object.entries(grouped).map(([cat, list]) => (
                  <div key={cat}>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-2">{cat}</div>
                    <div className="space-y-2">
                      {list.map(cr => (
                        <button key={cr.id} onClick={()=>{ setPickedCrime(cr); setStep('approach'); }} className="w-full p-3 border bg-white rounded-lg hover:bg-amber-50 border-slate-200 text-left">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{cr.emoji}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-800">{cr.title}</div>
                              <div className="text-xs text-slate-500">Severity {cr.severity} • Base Success {Math.round(cr.baseSuccess*100)}% • Heat +{cr.heatGain}</div>
                              <div className="text-xs text-slate-600 mt-0.5">{cr.blurb}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {step === 'approach' && pickedCrime && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-2xl">{pickedCrime.emoji}</div>
              <div>
                <div className="font-semibold">{pickedCrime.title}</div>
                <div className="text-xs text-slate-600">{pickedCrime.blurb}</div>
                <div className="text-xs text-slate-500 mt-0.5">Pick an approach</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {approaches.map(a => (
                <button key={a.id} disabled={a.disabled} onClick={()=>doAttempt(a)} className={`p-3 rounded-lg border text-left ${a.disabled? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50':'border-slate-200 bg-white hover:bg-amber-50'}`}>
                  <div className="font-medium">{a.label}</div>
                  <div className="text-xs text-slate-500">{a.desc}</div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between mt-2">
              <Button variant="outline" size="sm" onClick={()=>setStep('list')}>Back</Button>
              <div />
            </div>
          </div>
        )}

        {step === 'court' && pickedCrime && attemptRes && (
          <div className="space-y-3">
            <div className="font-semibold">Caught — Court Options</div>
                          <div className="p-3 rounded-lg border bg-slate-50 text-sm text-slate-700">
                            <div className="font-semibold mb-1">{pickedCrime.title}</div>
                            <div className="text-slate-700">{pickedCrime.blurb}</div>
                            <div className="text-slate-600 mt-2">{attemptRes.result.body}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={()=>doCourt('plea')}>Plea</Button>
              <Button variant="outline" onClick={()=>doCourt('fight')}>Fight</Button>
              <Button variant="outline" onClick={()=>doCourt('lawyer')}>Hire Lawyer</Button>
              <Button variant="outline" onClick={()=>doCourt('charm')}>Charm</Button>
            </div>
            <div className="text-xs text-slate-500">Evidence tags: {(attemptRes.evidenceTags||[]).join(', ') || 'none'}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatsBar({ adultCrime }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Stat label="Heat" value={adultCrime.heat} suffix="" />
      <Stat label="Record" value={adultCrime.record} suffix="" />
      <Stat label="Skill" value={adultCrime.skill} suffix="" />
      <Stat label="Probation" value={adultCrime.probationYears} suffix=" yr" />
    </div>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div className="p-3 rounded-lg border bg-white border-slate-200">
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{label}</div>
      <div className="text-slate-800 font-bold">{Math.round(value)}{suffix}</div>
    </div>
  );
}

function randPick(arr) {
  const a = Array.isArray(arr) ? arr.filter(Boolean) : [];
  if (!a.length) return null;
  return a[Math.floor(Math.random()*a.length)] || null;
}

function approachWhyLine({ approachId, outcomeType }) {
  const why = {
    success: {
      careful: "Why it worked: you kept it boring, and boring is the best camouflage.",
      bold: "Why it worked: confidence bought you just enough reality to get away with it.",
      crew: "Why it worked: more hands made it smoother… and somehow it didn’t get louder. This time.",
      desperation: "Why it worked: you moved fast and reality blinked first."
    },
    fail: {
      careful: "Why it failed: you tried to be subtle, but one detail refused to cooperate.",
      bold: "Why it failed: you pushed too hard and attention showed up before success did.",
      crew: "Why it failed: more people means more chaos—someone added an unnecessary detail.",
      desperation: "Why it failed: you rushed it. The plan collapsed under its own panic."
    }
  };
  const bucket = outcomeType === 'success' ? 'success' : 'fail';
  return why[bucket]?.[approachId] || (bucket === 'success'
    ? "Why it worked: somehow, chaos aligned."
    : "Why it failed: chaos did not align.");
}