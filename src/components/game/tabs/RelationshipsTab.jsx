import React, { useState } from 'react';
import { useGameState, hasAnyChild, getDisplayedChildAge } from '@/components/game/GameStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPageUrl } from '@/utils';
import { isPersonDead } from '@/components/game/relationshipUtils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import RelationshipProfileModal from '@/components/game/RelationshipProfileModal';
import PetsModal from '@/components/game/PetsModal';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';
import AdultChildProfileModal from '@/components/game/AdultChildProfileModal';

import { getSpriteMetaForPerson, computePersonAgeNumber } from '@/components/game/relationshipSpriteUtils';
import { getRoleLabel } from '@/components/game/kinshipLabels';
import { getDependentNoun } from '@/components/game/familyLabelUtils';

import { Separator } from '@/components/ui/separator';
import CoverHeader from '@/components/game/CoverHeader';
import { motion } from 'framer-motion';

export default function RelationshipsTab() {
  const { gameState, addLog, recordTimelineEntry, applyStress, spendFocus, emitActionResult, setActivePet, setActiveKid, applyMoneyDelta, applyLoveToKidId } = useGameState();
  const navigate = useNavigate();
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [petsModalOpen, setPetsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [adultKidModalOpen, setAdultKidModalOpen] = useState(false);
  const [adultKidId, setAdultKidId] = useState(null);

  const { relationships, pets = [], currentYear, childName, kids = [] } = gameState;
  const hasChild = hasAnyChild(gameState);
  
  // Build display roster with all kids in sibling rivalry mode
  const siblingOn = !!gameState.expansions?.siblingRivalry;
  const baseRoster = (relationships?.roster || []);
  const rosterNoSingleChild =
    (!hasChild || kids.length > 0)
      ? baseRoster.filter(p => p.id !== 'child')
      : baseRoster;

  const kidPeople = (kids.length > 0)
    ? kids.map((kid, idx) => {
        const slice = kid?.childSlice || {};
        const name = String(slice.childName || slice.name || kid.name || `Child ${idx + 1}`).trim();
        const avatarGender = slice.childAvatarGender || slice.childGender || gameState.childAvatarGender || 'boy';
        const genderKey = (avatarGender === 'girl') ? 'female' : 'male';
        const toneIndex = Number.isFinite(Number(slice.childAvatarToneIndex))
          ? Number(slice.childAvatarToneIndex)
          : Number(gameState.childAvatarToneIndex || 0);
        const avatarSpriteIndex = Number.isFinite(Number(slice.childAvatarSpriteIndex))
          ? Number(slice.childAvatarSpriteIndex)
          : (toneIndex % 4);
        
        // Per-child age and love
        const kidAge = getDisplayedChildAge(gameState, kid);
        const meterVal = Number.isFinite(Number(kid?.childSlice?.love)) ? Number(kid.childSlice.love) : 50;
        const relation = kid.relation || 'child';
        const isAdultChild = kidAge >= 18 && relation === 'child';
        const isDeceased = isAdultChild && kid.adultLife?.alive === false;
        const isGrandchild = relation === 'grandchild';
        const ageText = isAdultChild ? `Adult (${kidAge})` : isGrandchild ? `Grandchild (${kidAge})` : `${kidAge}`;

        return {
          id: `kid:${kid.id}`,
          kidId: kid.id,
          kid,
          role: relation,
          name,
          emoji: slice.childAvatarEmoji || '👶',
          avatarGenderKey: genderKey,
          avatarSpriteIndex,
          createdAtAge: 0,
          baseAge: 0,
          alive: !isDeceased,
          meter: meterVal,
          meterVal,
          ageText,
          kidAge,
          isAdultChild,
          isDeceased,
          isChild: true,
          displayedAge: kidAge,
          interactionsByAge: {}
        };
      })
    : [];

  // Split into sections
  const dependents = kidPeople.filter(p => p.displayedAge < 18 && (p.role === 'child' || p.role === 'grandchild'));
  const adultChildren = kidPeople.filter(p => p.role === 'child' && p.displayedAge >= 18 && !p.isDeceased);
  const deceasedChildren = kidPeople.filter(p => p.isDeceased);

  // Legacy Snapshot (for adult children)
  const totalChildren = kidPeople.filter(p => p.role === 'child').length;
  const aliveAdultCount = adultChildren.length;
  const deceasedCount = deceasedChildren.length;
  const degreesCount = adultChildren.filter(p => p.kid?.adultLife?.education?.status === 'graduated').length;
  const marriedCount = adultChildren.filter(p => p.kid?.adultLife?.relationship?.status === 'married').length;
  const grandkidsCount = adultChildren.reduce((sum, p) => sum + (p.kid?.adultLife?.grandkidIds?.length || 0), 0);
  const avgLoveAdults = aliveAdultCount > 0 
    ? Math.round(adultChildren.reduce((sum, p) => sum + p.meter, 0) / aliveAdultCount) 
    : 0;

  const showLegacySnapshot = totalChildren > 0 && (aliveAdultCount > 0 || deceasedCount > 0);

  const prideLine = (() => {
    if (!showLegacySnapshot) return '';
    const highScore = degreesCount + marriedCount + grandkidsCount + (avgLoveAdults >= 70 ? 1 : 0);
    if (highScore >= 3 && avgLoveAdults >= 60) {
      return 'They built lives. And they still reach back to you.';
    }
    if (avgLoveAdults < 40 && aliveAdultCount > 0) {
      return 'They grew up… but not all of them stayed close. There\'s still time to repair, one year at a time.';
    }
    return 'The years shaped them in their own ways.';
  })();

  // Combine roster (exclude kids already in kidPeople)
  const roster = [...rosterNoSingleChild];

  // Search + categorization
  const q = (query || '').toLowerCase().trim();
  const filterByQuery = (p) => {
    if (!q) return true;
    const name = (p.name || '').toLowerCase();
    const role = (p.role || '').toLowerCase();
    return name.includes(q) || role.includes(q);
  };

  const isMet = (p) => ((p?.createdAtAge ?? 0) <= (currentYear ?? 0));
  const isAlive = (p) => (p?.alive !== false && !isPersonDead(p));

  // Filter out child-dependent roles if no child
  const CHILD_DEPENDENT_ROLES = new Set(['child', 'teacher', 'best_friend', 'father_of_child', 'mother_of_child']);
  const filteredRoster = hasChild ? roster : roster.filter(p => !CHILD_DEPENDENT_ROLES.has(p.role));

  const memorial = filteredRoster.filter(p => p.alive === false).filter(filterByQuery);
  const notMet = filteredRoster.filter(p => isAlive(p) && !isMet(p)).filter(filterByQuery);
  const active = filteredRoster.filter(p => isAlive(p) && isMet(p)).filter(filterByQuery);

  const isHousehold = (p) =>
    p.id === 'child' ||
    p.role === 'partner' ||
    p.role === 'wife' ||
    p.role === 'husband' ||
    p.role === 'child';
  const isFamilyRole = (p) => ['my_mom','my_dad','sibling','inlaw_mom','inlaw_dad'].includes(p.role);
  const isChildParentRole = (p) => ['mother_of_child','father_of_child'].includes(p.role);
  const isFriendsRole = (p) => ['my_best_friend','friend'].includes(p.role);
  const isSchoolRole = (p) => p.role === 'teacher';
  const isTheirWorldRole = (p) => ['teacher','best_friend'].includes(p.role);

  const household = active.filter(isHousehold);
  const family = active.filter(isFamilyRole);
  const childParents = active.filter(isChildParentRole);
  const friends = active.filter(isFriendsRole);
  const theirWorld = active.filter(isTheirWorldRole);
  const others = active.filter(p => !isHousehold(p) && !isFamilyRole(p) && !isChildParentRole(p) && !isFriendsRole(p) && !isTheirWorldRole(p));

  const handlePersonClick = (person) => {
    if (person.role === 'child' || person.role === 'grandchild') {
      // Check if adult child or deceased
      if (person.isAdultChild || person.isDeceased) {
        setAdultKidId(person.kidId);
        setAdultKidModalOpen(true);
        return;
      }
      
      if (person.kidId && typeof setActiveKid === 'function') setActiveKid(person.kidId);
      navigate(createPageUrl('DevelopmentDetails'));
      return;
    }
    // Allow opening even if deceased (modal shows memorial view)
    setSelectedPersonId(person.id);
  };

  const handleMourn = (e, person) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isPersonDead(person)) {
      toast?.('You can only mourn someone who has died.');
      return;
    }

    const ok = spendFocus(1, `Mourn ${person.name}`);
    if (!ok) return;

    applyStress(-3, 'Mourning');
    addLog(`🪦 You mourn ${person.name}.`);

    recordTimelineEntry({
      kind: 'relationship',
      title: `🪦 Mourned ${person.name}`,
      detail: `You took a quiet moment to remember ${person.name}.`,
      deltas: { focus: -1, stress: -3 },
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -3,
    });

    emitActionResult({
      title: '🪦 Mourn',
      subtitle: person.name,
      body: `You took a quiet moment to remember ${person.name}.`,
      deltas: { focus: -1, stress: -3 },
      stressDelta: -3,
      meta: { skipTimelineRecord: true },
    });
  };

    const hasWives = active.some(p => p.role === 'wife');
    const hasHusbands = active.some(p => p.role === 'husband');

    const roleLabelForList = (p) => {
    if (!p) return '';
    if (p.role === 'wife') return 'Wife';
    if (p.role === 'husband') return 'Husband';
    if (p.role === 'partner') {
      if (hasWives) return 'First Wife';
      if (hasHusbands) return 'First Husband';
      return 'Partner';
    }
    return getRoleLabel(p, gameState, { short: true });
  };

  const renderPersonRow = (person) => {
    const isChild = person.role === 'child' || person.role === 'grandchild' || person.id === 'child';
    const isDead = isPersonDead(person) || person.isDeceased;
    const hasInteractionBar = !isDead;
    
    // Gender display (from character data)
    let genderText = '';
    if (person.avatarGenderKey) {
      genderText = person.avatarGenderKey === 'female' ? 'Female' : 'Male';
    } else if (person.genderKey) {
      genderText = person.genderKey === 'female' ? 'Female' : 'Male';
    } else if (person.role === 'partner' || person.role === 'wife' || person.role === 'husband') {
      const pGender = gameState.partnerAvatarGender || person.partnerAvatarGender;
      genderText = pGender === 'female' ? 'Female' : pGender === 'male' ? 'Male' : '';
    }
    
    // Meter calculation
    let meterVal = 0;
    if (isChild) {
      // Use per-child love if available (from kidPeople mapping)
      meterVal = Number.isFinite(Number(person.meterVal)) 
        ? Number(person.meterVal) 
        : Math.max(0, Math.min(100, (gameState.love || 0)));
    } else {
      meterVal = Math.max(0, Math.min(100, person.meter || 0));
    }

    // Display role
    const displayRole = roleLabelForList(person);

    // Age display
    let ageText = '';
    if (isDead) {
      const hasBase = Number.isFinite(Number(person.baseAge));
      const hasYear = Number.isFinite(Number(person.deathYear));
      if (hasYear && hasBase) {
        ageText = `Died in Year ${person.deathYear} • Age ${Number(person.baseAge) + Number(person.deathYear)}`;
      } else if (hasYear) {
        ageText = `Died in Year ${person.deathYear}`;
      } else {
        ageText = 'Deceased';
      }
    } else if (person.ageText) {
      // Use pre-computed age text from kidPeople mapping
      ageText = `Age ${person.ageText}`;
    } else {
      const ageNow = computePersonAgeNumber(person, gameState);
      if (Number.isFinite(Number(ageNow))) ageText = `Age ${ageNow}`;
    }

    return (
      <div 
        key={person.id}
        data-tour={isChild ? "relationship-child-card" : undefined}
        onClick={() => handlePersonClick(person)}
        className={`flex items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm ${hasInteractionBar ? 'cursor-pointer active:scale-[0.98] transition-transform' : 'cursor-pointer opacity-70'}`}
      >
        {/* Avatar: use sprites for all human relationships */}
        <div className="mr-3">
          {(() => {
            const meta = getSpriteMetaForPerson(person, gameState);
            return (
              <PlayerSpriteAvatar
                genderKey={meta.genderKey}
                ageNumber={meta.ageNumber}
                index={meta.index}
                size={48}
                fallbackEmoji={person.emoji}
                className="rounded-xl bg-slate-50 border border-slate-100 shadow-sm"
              />
            );
          })()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-800 truncate">{person.name}</div>
            </div>

            <div className="flex items-center text-xs text-slate-500 mb-1">
            <span className="mr-2">{displayRole}</span>
            {ageText && <span>• {ageText}</span>}
            {genderText && <span>• {genderText}</span>}
          </div>

          {/* Meter Bar */}
          {!isDead && (
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${isChild ? 'bg-rose-400' : 'bg-indigo-400'}`}
                style={{ width: `${meterVal}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="RelationshipsPage h-full bg-slate-50 flex flex-col">
      <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Relationships</h1>
            <p className="text-sm text-slate-500">Family, friends, and pets</p>
          </div>
          {/* Focus indicator */}
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="text-xs font-semibold text-indigo-900">
              ⚡ Focus: {gameState.actionPoints || 0}/{gameState.maxFocusTokens || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Storybook-only cover header */}
      {typeof document !== 'undefined' && document.documentElement?.dataset?.uiTheme === 'storybook' && (
        <div className="px-4 pt-3">
          <CoverHeader cover={{ id: 'relationships', title: 'Relationships' }} />
        </div>
      )}

      <div className="flex-1">
        <div className="p-4 space-y-6 pb-24">
          {/* Search */}
          <div className="mb-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people..."
              className="h-9"
            />
          </div>

          {/* Dependents Section */}
          {dependents.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1 bg-slate-100 px-3 py-2 rounded-lg">Dependents</h3>
              <div className="space-y-2">
                {dependents.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Adult Children Section */}
          {adultChildren.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 ml-1 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">Adult Children</h3>
              <div className="space-y-2">
                {adultChildren.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Deceased Section */}
          {deceasedChildren.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 ml-1 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">Deceased</h3>
              <div className="space-y-2">
                {deceasedChildren.map(p => renderPersonRow({...p, emoji: '🕯️'}))}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Memorial */}
          {memorial.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Memorial</h3>
              <div className="space-y-2">
                {memorial.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Household */}
          {household.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Household</h3>
              <div className="space-y-2">
                {household.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Family */}
          {family.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Your Family</h3>
              <div className="space-y-2">
                {family.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Child's Parents */}
          {childParents.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Child's Parents</h3>
              <div className="space-y-2">
                {childParents.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Friends */}
          {friends.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Friends</h3>
              <div className="space-y-2">
                {friends.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Child's World (only show if has child) */}
          {hasChild && theirWorld.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">{childName ? `${childName}'s World` : 'Their World'}</h3>
              <div className="space-y-2">
                {theirWorld.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Others */}
          {others.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Other</h3>
              <div className="space-y-2">
                {others.map(renderPersonRow)}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Pets */}
          {Array.isArray(pets) && pets.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Pets</h3>
              <div className="space-y-2">
                {pets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { setActivePet(p.id); setPetsModalOpen(true); }}
                    className="flex items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <div className="text-3xl mr-3">
                      {(() => {
                        const map = { dog:'🐶', cat:'🐱', rabbit:'🐰', fish:'🐠', bird:'🦜', snake:'🐍', turtle:'🐢', hamster:'🐹', goat:'🐐', horse:'🐴', lizard:'🦎', chickens:'🐔', unicorn:'🦄', dragon:'🐉' };
                        return map[p.speciesKey] || p.emoji || '🐾';
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 truncate">{p.name}</div>
                      <div className="flex items-center text-xs text-slate-500 mb-1">
                        <span className="capitalize mr-2">Pet</span>
                        <span>• Age {(p.petAgeYears ?? p.ageYears ?? 0)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, (p.bond || 5) * 10)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </section>
          )}

          {/* Legacy Snapshot */}
          {showLegacySnapshot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-sm"
            >
              <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                🏆 Legacy Snapshot
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Adult children alive:</span>
                  <span className="font-semibold">{aliveAdultCount} {deceasedCount > 0 ? `(deceased: ${deceasedCount})` : ''}</span>
                </div>
                {degreesCount > 0 && (
                  <div className="flex justify-between">
                    <span>Degrees / certifications:</span>
                    <span className="font-semibold">{degreesCount}</span>
                  </div>
                )}
                {marriedCount > 0 && (
                  <div className="flex justify-between">
                    <span>Marriages:</span>
                    <span className="font-semibold">{marriedCount}</span>
                  </div>
                )}
                {grandkidsCount > 0 && (
                  <div className="flex justify-between">
                    <span>Grandkids:</span>
                    <span className="font-semibold">{grandkidsCount}</span>
                  </div>
                )}
                {aliveAdultCount > 0 && (
                  <div className="flex justify-between">
                    <span>Average closeness:</span>
                    <span className="font-semibold">{avgLoveAdults}/100</span>
                  </div>
                )}
              </div>
              {prideLine && (
                <p className="mt-3 text-xs italic text-purple-800 leading-relaxed">
                  {prideLine}
                </p>
              )}
            </motion.div>
          )}

          {!household.length && !family.length && !friends.length && !others.length && dependents.length === 0 && adultChildren.length === 0 && deceasedChildren.length === 0 && (!pets || pets.length === 0) && (
            <div className="text-center text-slate-400 py-10">
              No relationships yet.
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <RelationshipProfileModal
        open={!!selectedPersonId}
        personId={selectedPersonId}
        onClose={() => setSelectedPersonId(null)}
      />

      <PetsModal
        open={petsModalOpen}
        onClose={() => setPetsModalOpen(false)}
      />

      <AdultChildProfileModal
        open={adultKidModalOpen}
        onOpenChange={(open) => {
          setAdultKidModalOpen(open);
          if (!open) setAdultKidId(null);
        }}
        kid={kids.find(k => k.id === adultKidId)}
        displayedAge={(() => {
          const k = kids.find(k => k.id === adultKidId);
          return k ? getDisplayedChildAge(gameState, k) : 18;
        })()}
        onCall={() => {
          const k = kids.find(k => k.id === adultKidId);
          if (!k) return;
          if (!spendFocus(1, 'Call Adult Child')) return;
          applyStress(-1, 'Call');
          applyLoveToKidId(k.id, 2, 'Call');
          addLog(`📞 Called ${k.childSlice?.childName || 'adult child'}`);
          toast.success(`Called ${k.childSlice?.childName || 'adult child'}`, { icon: '📞' });
        }}
        onVisit={() => {
          const k = kids.find(k => k.id === adultKidId);
          if (!k) return;
          if (!spendFocus(2, 'Visit Adult Child')) return;
          const travelCost = k.adultLife?.distance === 'far' ? 450 : k.adultLife?.distance === 'near' ? 120 : 40;
          applyMoneyDelta(-travelCost, 'Visit travel', { category: 'leisure' });
          applyStress(2, 'Visit');
          applyLoveToKidId(k.id, 3, 'Visit');
          addLog(`🚗 Visited ${k.childSlice?.childName || 'adult child'} (travel cost: $${travelCost})`);
          toast.success(`Visited ${k.childSlice?.childName || 'adult child'}`, { icon: '🚗' });
        }}
        onAdvice={() => {
          const k = kids.find(k => k.id === adultKidId);
          if (!k) return;
          if (!spendFocus(1, 'Advice')) return;
          applyStress(1, 'Advice');
          applyLoveToKidId(k.id, 1, 'Advice');
          addLog(`🧠 Gave advice to ${k.childSlice?.childName || 'adult child'}`);
          toast.success(`Gave advice to ${k.childSlice?.childName || 'adult child'}`, { icon: '🧠' });
        }}
        onSendMoney={() => {
          const k = kids.find(k => k.id === adultKidId);
          if (!k) return;
          if (!spendFocus(1, 'Send Help')) return;
          applyMoneyDelta(-250, 'Financial help for adult child', { category: 'family' });
          applyLoveToKidId(k.id, 2, 'Send Help');
          applyStress(1, 'Send Help');
          addLog(`💸 Sent $250 to ${k.childSlice?.childName || 'adult child'}`);
          toast.success(`Sent $250 to ${k.childSlice?.childName || 'adult child'}`, { icon: '💸' });
        }}
        onOpenGrandkid={(gid) => {
          setActiveKid(gid);
          navigate(createPageUrl('DevelopmentDetails'));
          setAdultKidModalOpen(false);
        }}
      />
    </div>
  );
}