import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import {
  useGameState,
  formatMoney,
  createSeededRng,
  hasAnyChild
} from '@/components/game/GameStateContext';

import { isPersonDead } from '@/components/game/relationshipUtils';
import { ensureAdultCrimeState } from '@/components/game/adultCrimeEngine';
import { setSiblingRivalryEnabledReducer, addChildReducer } from '@/components/game/siblingRivalry/kidHelpers.jsx';
import { pickCulturalFirstName } from '@/components/game/culturalNamePicker';

const BASE = { rename: 250, will: 500, adoption: 2000, expunge: 2500 };

function sanitizeName(v) {
  return String(v || '')
    .replace(/[\n\r\t{}\[\]]/g, '')
    .trim()
    .slice(0, 20);
}

export default function LegalHubModal({ open, onClose }) {
  const { gameState, updateState, applyMoneyDelta, applyStress, recordTimelineEntry, getLocalAmount } = useGameState();

  const [step, setStep] = React.useState('menu');
  const [draftName, setDraftName] = React.useState('');
  const [adoptChoices, setAdoptChoices] = React.useState([]);

  const adultCrime = ensureAdultCrimeState(gameState.adultCrime);
  const hasChild = hasAnyChild(gameState);

  const costRename = getLocalAmount(BASE.rename);
  const costWill = getLocalAmount(BASE.will);
  const costAdopt = getLocalAmount(BASE.adoption);
  const costExpunge = getLocalAmount(BASE.expunge);

  const canAfford = (amt) => Number(gameState.money || 0) >= Number(amt || 0);

  React.useEffect(() => {
    if (!open) {
      setStep('menu');
      setDraftName('');
      setAdoptChoices([]);
    }
  }, [open]);

  const buildGuardianOptions = React.useMemo(() => {
    const rel = gameState.relationships || { byId: {}, roster: [] };
    const byId = rel.byId || {};
    const partner = byId.partner;
    const mom = byId.my_mom;
    const dad = byId.my_dad;
    const motherOfChild = byId.mother_of_child;
    const fatherOfChild = byId.father_of_child;

    const isAlive = (p) => p && !isPersonDead(p);

    const partnerAlive = isAlive(partner);
    const momAlive = isAlive(mom);
    const dadAlive = isAlive(dad);

    const prStatus = String(gameState.partnerRelationship?.status || '').toLowerCase();
    const partnerEligible =
      partnerAlive &&
      gameState.householdType === 'two' &&
      prStatus !== 'divorced' &&
      prStatus !== 'single';

    const expectedCoparentId =
      gameState.parentRole === 'mom' ? 'father_of_child'
      : gameState.parentRole === 'dad' ? 'mother_of_child'
      : null;

    const coparentPerson = expectedCoparentId ? byId[expectedCoparentId] : (fatherOfChild || motherOfChild);
    const coparentEligible =
      hasChild &&
      isAlive(coparentPerson) &&
      (coparentPerson?.id === 'father_of_child' || coparentPerson?.id === 'mother_of_child');

    const opts = [];
    if (partnerEligible) opts.push({ id: 'partner', name: gameState.partnerName || partner?.name || 'Partner', label: 'Partner' });
    if (coparentEligible) opts.push({ id: coparentPerson.id, name: coparentPerson?.name || 'Co-parent', label: 'Co-parent' });
    if (momAlive) opts.push({ id: 'my_mom', name: mom?.name || 'Mother', label: 'Mother' });
    if (dadAlive) opts.push({ id: 'my_dad', name: dad?.name || 'Father', label: 'Father' });
    return opts;
  }, [gameState, hasChild]);

  const handleRename = () => {
    const newName = sanitizeName(draftName);
    if (!newName || newName.length < 1) {
      toast.error('Please enter a valid name');
      return;
    }
    if (!canAfford(costRename)) {
      toast.error('Not enough money');
      return;
    }

    applyMoneyDelta(-costRename, 'Name change');
    updateState(prev => ({
      ...prev,
      parentName: newName,
      playerName: newName,
      parent: prev.parent ? { ...prev.parent, name: newName } : prev.parent
    }));
    recordTimelineEntry({
      kind: 'system',
      title: 'Name change',
      detail: `You changed your name to ${newName}.`,
      age: gameState.currentYear,
      moneyDelta: -costRename
    });
    toast.success(`Your name is now ${newName}`);
    setStep('menu');
    setDraftName('');
  };

  const handleRenameChild = () => {
    const newName = sanitizeName(draftName);
    if (!newName || newName.length < 1) {
      toast.error('Please enter a valid name');
      return;
    }
    if (!canAfford(costRename)) {
      toast.error('Not enough money');
      return;
    }

    applyMoneyDelta(-costRename, 'Child name change');
    updateState(prev => {
      const activeKidId = prev.activeKidId || 'child';
      const kids = Array.isArray(prev.kids) ? [...prev.kids] : [];
      const kidIndex = kids.findIndex(k => k?.id === activeKidId);
      
      let updated = { ...prev, childName: newName };
      
      if (kidIndex >= 0) {
        kids[kidIndex] = {
          ...kids[kidIndex],
          childSlice: { ...(kids[kidIndex].childSlice || {}), childName: newName }
        };
        updated.kids = kids;
      }

      if (prev.relationships?.byId?.child) {
        updated.relationships = {
          ...prev.relationships,
          byId: {
            ...prev.relationships.byId,
            child: { ...prev.relationships.byId.child, name: newName }
          }
        };
      }

      return updated;
    });
    recordTimelineEntry({
      kind: 'system',
      title: 'Child name change',
      detail: `You changed your child's name to ${newName}.`,
      age: gameState.currentYear,
      moneyDelta: -costRename
    });
    toast.success(`Child's name is now ${newName}`);
    setStep('menu');
    setDraftName('');
  };

  const handleDraftWill = (guardian) => {
    if (!canAfford(costWill)) {
      toast.error('Not enough money');
      return;
    }

    applyMoneyDelta(-costWill, 'Will drafted');
    applyStress(-2);
    updateState(prev => ({
      ...prev,
      legal: {
        ...prev.legal,
        will: { guardianId: guardian.id, draftedAtAge: prev.currentYear }
      }
    }));
    recordTimelineEntry({
      kind: 'finance',
      title: 'Will drafted',
      detail: `You drafted a will and named ${guardian.label} as guardian.`,
      age: gameState.currentYear,
      moneyDelta: -costWill,
      stressDelta: -2
    });
    toast.success(`Will drafted. Guardian: ${guardian.label}`);
    setStep('menu');
  };

  const handleStartAdoption = () => {
    if (!canAfford(costAdopt)) {
      toast.error('Not enough money');
      return;
    }

    const rng = createSeededRng(`${gameState.runSeed}|adoption|age:${gameState.currentYear}`);
    const culture = gameState.culture || 'american_us';
    const choices = [];
    const usedNames = [gameState.childName, gameState.parentName];

    for (let i = 0; i < 3; i++) {
      const gender = rng.pick(['boy', 'girl']);
      const genderKey = gender === 'boy' ? 'male' : 'female';
      const name = pickCulturalFirstName(culture, genderKey, rng.nextInt(), usedNames);
      usedNames.push(name);
      choices.push({
        name,
        gender,
        toneIndex: rng.nextInt() % 16,
        emoji: gender === 'boy' ? '👦' : '👧'
      });
    }

    setAdoptChoices(choices);
    setStep('adoption_pick');
  };

  const handleConfirmAdoption = (picked) => {
    applyMoneyDelta(-costAdopt, 'Adoption');
    applyStress(5);

    updateState(prev => {
      let s = setSiblingRivalryEnabledReducer(prev, true);
      s = addChildReducer(s, {
        name: picked.name,
        gender: picked.gender,
        toneIndex: picked.toneIndex,
        temperamentId: 'balanced',
        ageYears: prev.currentYear
      });

      const kids = Array.isArray(s.kids) ? [...s.kids] : [];
      const newKid = kids[kids.length - 1];
      if (newKid) {
        kids[kids.length - 1] = {
          ...newKid,
          childSlice: { ...(newKid.childSlice || {}), love: 5 }
        };
        s = { ...s, kids };
      }
      return s;
    });

    recordTimelineEntry({
      kind: 'system',
      title: 'Adoption',
      detail: `You adopted ${picked.name}.`,
      age: gameState.currentYear,
      moneyDelta: -costAdopt,
      stressDelta: 5
    });
    toast.success(`You adopted ${picked.name}`);
    setStep('menu');
    setAdoptChoices([]);
  };

  const handleExpunge = () => {
    if (!canAfford(costExpunge)) {
      toast.error('Not enough money');
      return;
    }

    applyMoneyDelta(-costExpunge, 'Record expunged');
    updateState(prev => ({
      ...prev,
      adultCrime: { ...ensureAdultCrimeState(prev.adultCrime), record: 0 }
    }));
    recordTimelineEntry({
      kind: 'finance',
      title: 'Record expunged',
      detail: 'You expunged your criminal record.',
      age: gameState.currentYear,
      moneyDelta: -costExpunge
    });
    toast.success('Criminal record expunged');
    setStep('menu');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>⚖️ Legal</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {step === 'menu' && (
            <div className="space-y-3">
              <Button
                onClick={() => { setStep('rename'); setDraftName(gameState.parentName || ''); }}
                disabled={!canAfford(costRename)}
                className="w-full justify-between"
                variant="outline"
              >
                <span>Change your name</span>
                <span className="text-sm text-muted-foreground">{formatMoney(costRename)}</span>
              </Button>

              <Button
                onClick={() => { setStep('rename_child'); setDraftName(gameState.childName || ''); }}
                disabled={!hasChild || !canAfford(costRename)}
                className="w-full justify-between"
                variant="outline"
              >
                <span>Change your child's name</span>
                <span className="text-sm text-muted-foreground">{formatMoney(costRename)}</span>
              </Button>

              <Button
                onClick={() => setStep('will')}
                disabled={!hasChild || !canAfford(costWill)}
                className="w-full justify-between"
                variant="outline"
              >
                <span>Draft your will</span>
                <span className="text-sm text-muted-foreground">{formatMoney(costWill)}</span>
              </Button>

              <Button
                onClick={handleStartAdoption}
                disabled={!hasChild || !canAfford(costAdopt)}
                className="w-full justify-between"
                variant="outline"
              >
                <span>Adopt a child</span>
                <span className="text-sm text-muted-foreground">{formatMoney(costAdopt)}</span>
              </Button>

              {adultCrime.record > 0 && (
                <Button
                  onClick={handleExpunge}
                  disabled={!canAfford(costExpunge)}
                  className="w-full justify-between"
                  variant="outline"
                >
                  <span>Expunge your record</span>
                  <span className="text-sm text-muted-foreground">{formatMoney(costExpunge)}</span>
                </Button>
              )}

              {!canAfford(costRename) && (
                <p className="text-xs text-muted-foreground mt-2">Not enough money for these actions</p>
              )}
            </div>
          )}

          {step === 'rename' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">New name</label>
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Enter your new name"
                  maxLength={20}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Cost: {formatMoney(costRename)}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep('menu')} variant="outline" className="flex-1">Cancel</Button>
                <Button onClick={handleRename} className="flex-1">Confirm</Button>
              </div>
            </div>
          )}

          {step === 'rename_child' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Child's new name</label>
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Enter child's new name"
                  maxLength={20}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Cost: {formatMoney(costRename)}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setStep('menu')} variant="outline" className="flex-1">Cancel</Button>
                <Button onClick={handleRenameChild} className="flex-1">Confirm</Button>
              </div>
            </div>
          )}

          {step === 'will' && (
            <div className="space-y-4">
              <p className="text-sm">Choose a guardian for your child:</p>
              <div className="space-y-2">
                {buildGuardianOptions.map(g => (
                  <Button
                    key={g.id}
                    onClick={() => handleDraftWill(g)}
                    variant="outline"
                    className="w-full"
                  >
                    {g.label} ({g.name})
                  </Button>
                ))}
              </div>
              {buildGuardianOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">No eligible guardians available</p>
              )}
              <Button onClick={() => setStep('menu')} variant="outline" className="w-full">Cancel</Button>
            </div>
          )}

          {step === 'adoption_pick' && (
            <div className="space-y-4">
              <p className="text-sm">Choose a child to adopt:</p>
              <div className="space-y-2">
                {adoptChoices.map((c, i) => (
                  <Button
                    key={i}
                    onClick={() => handleConfirmAdoption(c)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{c.emoji}</span>
                    <span>{c.name}</span>
                  </Button>
                ))}
              </div>
              <Button onClick={() => setStep('menu')} variant="outline" className="w-full">Cancel</Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}