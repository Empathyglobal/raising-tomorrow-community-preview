import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Users } from 'lucide-react';
import { useGameState } from '../GameStateContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TITLES_CATALOG, TITLE_ACTIONS, PRK_ACTIONS, MILITARY_ACTIONS, SURVIVOR_ACTIONS, UNDERWORLD_ACTIONS, getTitleInfo, getNextPeerageId, getNextPrkDynastyId, getNextMilitaryId, getNextSurvivorId, getNextUnderworldId, courtesyForChild } from './titleData';
import { PressModal } from './index';
import { toast } from 'sonner';
import { isMonarchyCountry } from '@/components/game/monarchyCountries';

export default function TitlesHubModal({ open, onClose }) {
  const { gameState, updateState, applyDeltas, applyLove, spendMoney, spendFocus, applyReputationDelta, applyMoneyDelta, recordTimelineEntry } = useGameState();
  const { primaryTitle, secondaryHonors = [], titleMeter = 0, influencePoints = 0, scandalHeat = 0, obligations = { requiredPerYear: 0, completedThisYear: 0 }, house = null } = gameState.titles || {};

  const titleInfo = primaryTitle ? getTitleInfo(primaryTitle) : null;
  const monarchyEnabled = isMonarchyCountry(gameState.countryIso3);
  const prkDynastyEnabled = String(gameState.countryIso3 || '').toUpperCase() === 'PRK';
  const special = gameState.specialStartId;
  const militaryEnabled = special === 'military_relocation_cycle' || special === 'military_relocation' || Boolean(gameState.playerCareer?.jobId === 'active_duty_military' || gameState.playerCareer?.jobId === 'military_service');
  const survivorEnabled = special === 'alien_invasion';
  const underworldEnabled = special === 'mafia_family';
  const titlesEnabled = monarchyEnabled || prkDynastyEnabled || militaryEnabled || survivorEnabled || underworldEnabled;

  const mode = prkDynastyEnabled ? 'prk_dynasty'
    : (underworldEnabled ? 'underworld_rank'
      : (survivorEnabled ? 'survivor_rank'
        : (militaryEnabled ? 'military_rank'
          : (monarchyEnabled ? 'peerage_or_royal' : null))));

  React.useEffect(() => {
    if (!open) return;
    updateState(prev => {
      const cur = prev.titles || {};
      if (prkDynastyEnabled) {
        if (!cur.primaryTitle || !TITLES_CATALOG[cur.primaryTitle]) {
          return { ...prev, titles: { ...cur, primaryTitle: 'prk_inner_circle', titleMeter: cur.titleMeter ?? 40, influencePoints: cur.influencePoints ?? 10 } };
        }
        return prev;
      }
      if (mode === 'military_rank') {
        if (!cur.primaryTitle || !TITLES_CATALOG[cur.primaryTitle] || TITLES_CATALOG[cur.primaryTitle].group !== 'military_rank') {
          return { ...prev, titles: { ...cur, primaryTitle: 'mil_private', titleMeter: cur.titleMeter ?? 35, influencePoints: cur.influencePoints ?? 10 } };
        }
      }
      if (mode === 'survivor_rank') {
        if (!cur.primaryTitle || !TITLES_CATALOG[cur.primaryTitle] || TITLES_CATALOG[cur.primaryTitle].group !== 'survivor_rank') {
          return { ...prev, titles: { ...cur, primaryTitle: 'surv_scavenger', titleMeter: cur.titleMeter ?? 35, influencePoints: cur.influencePoints ?? 8 } };
        }
      }
      if (mode === 'underworld_rank') {
        if (!cur.primaryTitle || !TITLES_CATALOG[cur.primaryTitle] || TITLES_CATALOG[cur.primaryTitle].group !== 'underworld_rank') {
          return { ...prev, titles: { ...cur, primaryTitle: 'uw_associate', titleMeter: cur.titleMeter ?? 40, influencePoints: cur.influencePoints ?? 12 } };
        }
      }
      return prev;
    });
  }, [open, prkDynastyEnabled, mode, updateState]);

  const handleAction = (action) => {
    const clamp0to100 = (n) => Math.max(0, Math.min(100, Number(n || 0)));
    const focusCost = action.cost.focus || 0;
    const influenceCost = action.cost.influence || 0;
    const moneyCost = action.cost.money || 0;

    if (gameState.actionPoints < focusCost) { toast.error('Not enough Focus'); return; }
    if (gameState.money < moneyCost) { toast.error('Not enough money'); return; }
    if (influenceCost > 0 && influencePoints < influenceCost) { toast.error('Not enough Influence'); return; }

    if (!spendFocus(focusCost, `Titles: ${action.label}`)) return;
    if (moneyCost > 0) {
      spendMoney(moneyCost, `Titles: ${action.label}`);
    }
    if (action.moneyGain) {
      // income from certain actions
      applyMoneyDelta(action.moneyGain, `Titles: ${action.label}`, { category: 'income' });
    }

    // Apply generic effects
    const effects = action.effects || {};
    const childDeltas = {};
    if (effects.child_discipline) childDeltas.discipline = (childDeltas.discipline || 0) + effects.child_discipline;
    if (effects.child_empathy) childDeltas.empathy = (childDeltas.empathy || 0) + effects.child_empathy;
    if (effects.child_confidence) childDeltas.confidence = (childDeltas.confidence || 0) + effects.child_confidence;
    if (effects.child_intelligence) childDeltas.intelligence = (childDeltas.intelligence || 0) + effects.child_intelligence;

    if (Object.keys(childDeltas).length > 0) applyDeltas(childDeltas, `Titles: ${action.label}`);
    if (effects.child_love) applyLove(effects.child_love, `Titles: ${action.label}`);
    if (effects.reputation) applyReputationDelta(effects.reputation, `Titles: ${action.label}`);

    // Special effects: promote tier, create allied house
    let promoted = false;
    let createdAlly = false;

    updateState(prev => {
      const cur = prev.titles || {};
      let nextPrimary = cur.primaryTitle;
      let nextMeter = clamp0to100((cur.titleMeter || 0) + (effects.meter || 0));
      let nextInfluence = (cur.influencePoints || 0) - (action.cost.influence || 0);

      // Scenario-specific meters (compute next values)
      let nextAlienThreat = prev.alienThreat;
      let nextMafiaHeat = prev.mafiaHeat;
      if (typeof effects.alienThreatDelta === 'number') {
        nextAlienThreat = clamp0to100((prev.alienThreat || 0) + effects.alienThreatDelta);
      }
      if (typeof effects.mafiaHeatDelta === 'number') {
        nextMafiaHeat = clamp0to100((prev.mafiaHeat || 0) + effects.mafiaHeatDelta);
      }

      // Promotion: peerage / PRK / special tracks
      if (effects.promote_tier && nextPrimary) {
        const info = getTitleInfo(nextPrimary);
        if (info?.group === 'peerage') {
          const nxt = getNextPeerageId(nextPrimary);
          if (nxt) {
            nextPrimary = nxt;
            promoted = true;
            nextMeter = Math.max(0, nextMeter - 10);
            recordTimelineEntry({ kind: 'system', title: 'Peerage Elevation', detail: `You were elevated to ${getTitleInfo(nxt)?.label}.`, moneyDelta: 0 });
          } else {
            toast('Already at the top of the peerage.');
          }
        } else if (info?.group === 'prk_dynasty') {
          const nxt = getNextPrkDynastyId(nextPrimary);
          if (nxt) {
            nextPrimary = nxt;
            promoted = true;
            nextMeter = Math.max(0, nextMeter - 8);
            recordTimelineEntry({ kind: 'system', title: 'Dynastic Promotion', detail: `You advanced to ${getTitleInfo(nxt)?.label}.`, moneyDelta: 0 });
          } else {
            toast('Already at the top of the ladder.');
          }
        } else if (info?.group === 'military_rank') {
          const nxt = getNextMilitaryId(nextPrimary);
          if (nxt) {
            nextPrimary = nxt;
            promoted = true;
            nextMeter = Math.max(0, nextMeter - 8);
            recordTimelineEntry({ kind: 'system', title: 'Military Promotion', detail: `Promoted to ${getTitleInfo(nxt)?.label}.`, moneyDelta: 0 });
          } else {
            toast('Already at top rank.');
          }
        } else if (info?.group === 'survivor_rank') {
          const nxt = getNextSurvivorId(nextPrimary);
          if (nxt) {
            nextPrimary = nxt;
            promoted = true;
            nextMeter = Math.max(0, nextMeter - 8);
            recordTimelineEntry({ kind: 'system', title: 'Survivor Rank Up', detail: `You rose to ${getTitleInfo(nxt)?.label}.`, moneyDelta: 0 });
          } else {
            toast('Already at top rank.');
          }
        } else if (info?.group === 'underworld_rank') {
          const nxt = getNextUnderworldId(nextPrimary);
          if (nxt) {
            nextPrimary = nxt;
            promoted = true;
            nextMeter = Math.max(0, nextMeter - 12);
            recordTimelineEntry({ kind: 'system', title: 'Underworld Promotion', detail: `You rose to ${getTitleInfo(nxt)?.label}.`, moneyDelta: 0 });
          } else {
            toast('Already at top rank.');
          }
        }
      }

      // Grant minor title -> create allied house NPC
      if (effects.create_allied_house) {
        try {
          const id = `house_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
          const name = `House of ${String(prev.parentName || 'Rose').slice(0, 12)}`;
          const rel = prev.relationships || { roster: [], byId: {} };
          const roster = Array.isArray(rel.roster) ? [...rel.roster] : [];
          const byId = { ...(rel.byId || {}) };
          const npc = { id, role: 'ally_house', name, emoji: '🏰', createdAtAge: prev.currentYear || 0, meter: 60 };
          roster.push(npc); byId[id] = npc;
          createdAlly = true;
          // write relationships + titles below in return
          return {
            ...prev,
            titles: { ...cur, primaryTitle: nextPrimary, titleMeter: nextMeter, influencePoints: nextInfluence },
            relationships: { roster, byId },
            alienThreat: typeof nextAlienThreat === 'number' ? nextAlienThreat : prev.alienThreat,
            mafiaHeat: typeof nextMafiaHeat === 'number' ? nextMafiaHeat : prev.mafiaHeat
          };
        } catch {}
      }

      const nextHeat = Math.max(0, Math.min(100, (cur.scandalHeat || 0) + (effects.scandalHeat || 0)));
      return {
        ...prev,
        titles: { ...cur, primaryTitle: nextPrimary, titleMeter: nextMeter, standing: nextMeter, influencePoints: nextInfluence, influence: nextInfluence, scandalHeat: nextHeat, prkChildDesignated: effects.prk_designate_child ? true : cur.prkChildDesignated },
        alienThreat: typeof nextAlienThreat === 'number' ? nextAlienThreat : prev.alienThreat,
        mafiaHeat: typeof nextMafiaHeat === 'number' ? nextMafiaHeat : prev.mafiaHeat
      };
    });

    if (createdAlly) {
      recordTimelineEntry({ kind: 'system', title: 'New Allied House', detail: 'A loyal household was recognized with a minor title.', moneyDelta: 0 });
    }
    if (effects.prk_designate_child) {
      recordTimelineEntry({ kind: 'system', title: 'Succession Spotlight', detail: 'Child designated as the Designated Successor.', moneyDelta: 0 });
    }

    if (promoted) toast.success('Elevated in the peerage!');
    else toast.success(action.label);
  };

  if (!open) return null;

  const courtesy = primaryTitle ? courtesyForChild(primaryTitle, gameState.childAvatarGender) : null;
  const prkChildDesignated = Boolean(gameState.titles?.prkChildDesignated);
  let actions = TITLE_ACTIONS;
  if (mode === 'prk_dynasty') actions = PRK_ACTIONS;
  if (mode === 'military_rank') actions = MILITARY_ACTIONS;
  if (mode === 'survivor_rank') actions = SURVIVOR_ACTIONS;
  if (mode === 'underworld_rank') actions = UNDERWORLD_ACTIONS;

  return (
    <AnimatePresence>
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100]" onClick={onClose} />

     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 w-screen h-[100dvh] z-[101] flex items-center justify-center p-4">
       <PressModal open={Boolean(gameState.titles?.pressModalOpen)} onClose={() => updateState(prev => ({ titles: { ...(prev.titles||{}), pressModalOpen: false } }))} />
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[calc(100dvh-32px)] flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Crown className="w-6 h-6 text-amber-500" /> Titles Hub</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
          </div>

          <div className="p-6 overflow-y-auto">
            {!titlesEnabled && (
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-semibold">Not available here</p>
                <p className="text-sm text-slate-500 mt-1">Titles are only available in monarchies or dynastic regimes.</p>
              </div>
            )}

            {titlesEnabled && !titleInfo && (
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-semibold">You hold no significant titles.</p>
                <p className="text-sm text-slate-500 mt-1">Titles are gained by birthright, marriage, or rare elevation.</p>
              </div>
            )}

            {titlesEnabled && titleInfo && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">{titleInfo.label}</h3>
                  <p className="text-xs text-slate-500">Rank {titleInfo.rank} • {titleInfo.group === 'royal' ? 'Royal' : titleInfo.group === 'prk_dynasty' ? 'Dynastic Regime' : titleInfo.group === 'military_rank' ? 'Military' : titleInfo.group === 'survivor_rank' ? 'Survivor' : titleInfo.group === 'underworld_rank' ? 'Underworld' : 'Peerage'}</p>
                  {courtesy && !prkDynastyEnabled && (
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                      <Users className="w-4 h-4" /> Child Courtesy Title: <span className="font-semibold">{courtesy}</span>
                    </div>
                  )}
                  {prkDynastyEnabled && prkChildDesignated && (
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-slate-600">
                      <Users className="w-4 h-4" /> Child Title: <span className="font-semibold">Designated Successor</span>
                    </div>
                  )}
                </div>

                <div className="mb-6 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      {(() => {
                        const meterLabel = mode === 'prk_dynasty' ? 'Control' : mode === 'military_rank' ? 'Readiness' : mode === 'survivor_rank' ? 'Shelter Trust' : mode === 'underworld_rank' ? 'Respect' : 'Title Meter';
                        return <span className="font-medium text-slate-600">{meterLabel}</span>;
                      })()}
                      <span className="font-bold text-slate-800">{Math.round(titleMeter)} / 100</span>
                    </div>
                    <Progress value={titleMeter} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="font-medium text-slate-600">Influence Points</span>
                      <span className="font-bold text-slate-800">{influencePoints}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="font-medium text-slate-600">Scandal Heat</span>
                      <span className="font-bold text-slate-800">{Math.round(scandalHeat)} / 100</span>
                    </div>
                    <Progress value={scandalHeat} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="font-medium text-slate-600">Obligations</span>
                      <span className="font-bold text-slate-800">{obligations.completedThisYear || 0} / {obligations.requiredPerYear || 0}</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mb-3">Actions</h4>
                <div className="space-y-2">
                  {actions.map(action => {
                    const canAfford = (gameState.actionPoints >= (action.cost.focus || 0)) &&
                                      (influencePoints >= (action.cost.influence || 0)) &&
                                      (gameState.money >= (action.cost.money || 0));
                    return (
                      <div key={action.id} className={`p-3 border rounded-lg ${canAfford ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{action.label}</p>
                            <p className="text-xs text-slate-500">{action.description}</p>
                            <div className="text-xs text-slate-500 mt-1">Cost: {action.cost.focus || 0} Focus • {action.cost.influence || 0} Influence • ${action.cost.money || 0}</div>
                          </div>
                          <Button size="sm" onClick={() => handleAction(action)} disabled={!canAfford}>Act</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => updateState(prev => ({ titles: { ...(prev.titles||{}), pressModalOpen: true } }))}>Open Press</Button>
                  <Button variant="outline" onClick={() => {
                    // Quick obligation filler (validate costs first)
                    const focusCost = 1;
                    if (gameState.actionPoints < focusCost) { toast.error('Not enough Focus'); return; }
                    if (!spendFocus(focusCost, 'Fulfill Obligation')) return;
                    updateState(prev => {
                      const t = prev.titles || {};
                      const ob = t.obligations || { requiredPerYear: 0, completedThisYear: 0, yearTag: prev.currentYear };
                      const done = Number(ob.completedThisYear || 0) + 1;
                      const standing = Math.max(0, Math.min(100, Number(t.standing || 0) + 1));
                      const heat = Math.max(0, Math.min(100, Number(t.scandalHeat || 0) + 1));
                      return { ...prev, titles: { ...t, standing, scandalHeat: heat, obligations: { ...ob, completedThisYear: done, yearTag: prev.currentYear } } };
                    });
                    toast.success('Obligation fulfilled');
                  }}>Fulfill Obligation (Quick)</Button>
                </div>

                {secondaryHonors?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Secondary Honors</h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {secondaryHonors.map((h, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}