import { rollDeathThisYear, pickCauseOfDeath } from '@/components/game/mortality';
import { runRelationshipDramaAnnualTick } from '@/components/game/relationshipDramaAnnualTick';
import { getDeathRelationPhrase } from '@/components/game/kinshipLabels';

export function runRelationshipsAnnualTick(gameState, age) {
  const updates = {};
  const logs = [];
  const timelineEntries = [];
  const prompts = [];

  const rel = gameState.relationships || { roster: [], byId: {} };
  const byId = { ...(rel.byId || {}) };
  const roster = Array.isArray(rel.roster) ? [...rel.roster] : [];
  const runSeed = gameState.runSeed || 'seed';

  const getPerson = (id) => byId?.[id] || null;

  // Canonical parent IDs are my_mom / my_dad.
  // Keep legacy fallback for older saves.
  const mom = getPerson('my_mom') || getPerson('mother');
  const dad = getPerson('my_dad') || getPerson('father');
  const inlawMom = getPerson('inlaw_mom');
  const inlawDad = getPerson('inlaw_dad');
  const people = [mom, dad, inlawMom, inlawDad, getPerson('partner')].filter(Boolean);

  function computeAgeNow(p) {
    const base = Number(p.baseAge);
    const createdAtAge = Number(p.createdAtAge ?? 0);
    const childAge = Number(age ?? 0);
    if (Number.isFinite(base)) return base + childAge;
    if (Number.isFinite(Number(p.age))) return Number(p.age) + Math.max(0, childAge - createdAtAge);
    return null;
  }

  const setRosterEntry = (updated) => {
    byId[updated.id] = updated;
    const idx = roster.findIndex((x) => x.id === updated.id);
    if (idx >= 0) roster[idx] = updated;
    else roster.push(updated);
  };

  const diedThisYear = [];

  for (const person of people) {
    if (!person) continue;
    const alreadyDead = person.isDeceased === true || person.alive === false || typeof person.deathYear === 'number';
    if (alreadyDead) continue;

    const ageNow = computeAgeNow(person);
    if (!Number.isFinite(Number(ageNow))) continue;

    const role = person.role || person.id;
    const isMom = role === 'my_mom' || role === 'mother';
    const isDad = role === 'my_dad' || role === 'father';

    const genderKey =
      person.genderKey ||
      person.avatarGenderKey ||
      (isMom ? 'female' : isDad ? 'male' : (gameState.partnerAvatarGender || 'unknown'));
    const mortalityMultiplier = Number.isFinite(Number(person.mortalityMultiplier)) ? Number(person.mortalityMultiplier) : 1.0;

    const died = rollDeathThisYear({
      runSeed,
      personId: person.id,
      currentYear: age,
      age: Number(ageNow),
      genderKey,
      mortalityMultiplier,
    });

    if (died) {
      const cause = pickCauseOfDeath(Number(ageNow), genderKey, `${runSeed}|deathCause|${person.id}|${age}`);
      const updated = {
        ...person,
        isDeceased: true,
        alive: false,
        deathYear: age,
        causeOfDeath: cause,
        lastMournedYear: null,
      };
      setRosterEntry(updated);
      diedThisYear.push({ person: updated, ageNow: Number(ageNow), cause });

      const relation = getDeathRelationPhrase(updated, gameState);
      const title = `🕯️ ${updated.name || 'Family member'} (${relation}) passed away`;
      const detail = `Cause: ${cause || 'unknown'} • Age ${Number(ageNow)}`;
      timelineEntries.push({ kind: 'family', title, detail, age, deltas: null, moneyDelta: 0, loveDelta: 0, stressDelta: 2 });
    }
  }

  if (diedThisYear.length > 0) {
    let result;
    if (diedThisYear.length === 1) {
      const d = diedThisYear[0];
      const relation = getDeathRelationPhrase(d.person, gameState);
      const deathKind = (d.person.role === 'child' || d.person.id === 'child') ? 'child' : 'family';
      result = {
        actionId: 'familyDeath',
        title: `🕯️ ${d.person.name}, ${relation}, passed away`,
        body: `Cause: ${d.cause}\nThey died at age ${d.ageNow}.`,
        deltas: null,
        loveDelta: 0,
        stressDelta: 2,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['family', 'memorial'],
        meta: { 
          personId: d.person.id,
          death: {
            kind: deathKind,
            deceased: { ...d.person, ageAtDeath: d.ageNow, cause: d.cause }
          }
        },
      };
    } else {
      const lines = diedThisYear.map((d) => {
        const relation = getDeathRelationPhrase(d.person, gameState);
        return `• ${d.person.name} (${relation}): ${d.cause} • Age ${d.ageNow}`;
      }).join('\n');
      result = {
        actionId: 'familyDeath',
        title: '🕯️ Family loss',
        body: lines,
        deltas: null,
        loveDelta: 0,
        stressDelta: 3,
        moneyDelta: 0,
        focusDelta: 0,
        tags: ['family', 'memorial'],
        meta: { 
          count: diedThisYear.length,
          death: {
            kind: 'family',
            deceased: diedThisYear.map(d => ({ ...d.person, ageAtDeath: d.ageNow, cause: d.cause }))
          }
        },
      };
    }
    updates.actionResultPending = result;
    updates.relationships = { byId, roster };
  }

  // Relationship drama (cheating/open relationship/sexual health/the talk)
  try {
    const stateForDrama = updates.relationships ? { ...gameState, relationships: updates.relationships } : gameState;
    const drama = runRelationshipDramaAnnualTick(stateForDrama, age);
    if (drama?.updates) Object.assign(updates, drama.updates);
    if (drama?.logs?.length) logs.push(...drama.logs);
    if (drama?.timelineEntries?.length) timelineEntries.push(...drama.timelineEntries);
    if (drama?.prompts?.length) prompts.push(...drama.prompts);
  } catch (e) {
    console.error('Relationship drama annual tick failed:', e);
  }

  return { updates, logs, timelineEntries, prompts };
}