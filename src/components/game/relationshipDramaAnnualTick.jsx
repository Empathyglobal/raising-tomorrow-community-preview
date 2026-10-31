import { isPersonDead, finalizePartnerSeparation } from './relationshipUtils';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n || 0)));
const clamp01 = (n) => Math.max(0, Math.min(1, Number(n || 0)));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

// Deterministic RNG (mulberry32) from a stable string seed
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (t >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(runSeed, ...parts) {
  const seed = hashString([runSeed || 'seed', ...parts].join('|'));
  return mulberry32(seed);
}

function ensureDramaState(d) {
  const base = isObj(d) ? d : {};
  const sexEd = isObj(base.sexEd) ? base.sexEd : {};
  const teen = isObj(base.teen) ? base.teen : {};
  return {
    version: 1,
    outsideEncountersByAge: isObj(base.outsideEncountersByAge) ? base.outsideEncountersByAge : {},
    partnerOutsideEncountersByAge: isObj(base.partnerOutsideEncountersByAge) ? base.partnerOutsideEncountersByAge : {},
    lieDebt: Number.isFinite(Number(base.lieDebt)) ? Number(base.lieDebt) : 0,
    lastAffairDiscoveryAge: base.lastAffairDiscoveryAge ?? null,
    lastPregnancyScareAge: base.lastPregnancyScareAge ?? null,
    sexEd: {
      done: !!sexEd.done,
      doneAtAge: sexEd.doneAtAge ?? null,
      lastPromptAge: sexEd.lastPromptAge ?? null,
      quality: Number.isFinite(Number(sexEd.quality)) ? Number(sexEd.quality) : 0,
      style: sexEd.style ?? null,
    },
    teen: {
      sexuallyActive: !!teen.sexuallyActive,
      startedAtAge: teen.startedAtAge ?? null,
      lastHealthScareAge: teen.lastHealthScareAge ?? null,
    },
  };
}

function ensureSexualHealthState(sh) {
  const base = isObj(sh) ? sh : {};
  const normalizePerson = (p) => {
    const b = isObj(p) ? p : {};
    return {
      status: b.status || 'clear', // clear | treatable | chronic
      infectionId: b.infectionId ?? null,
      label: b.label ?? null,
      diagnosedAtAge: b.diagnosedAtAge ?? null,
      treatedAtAge: b.treatedAtAge ?? null,
      lastClinicAge: b.lastClinicAge ?? null,
      managed: !!b.managed,
      lastMedsAge: b.lastMedsAge ?? null,
    };
  };
  return {
    version: 1,
    player: normalizePerson(base.player),
    partner: normalizePerson(base.partner),
    child: normalizePerson(base.child),
  };
}

function patchPartnerMeter(prevState, nextMeter) {
  const relationships = prevState.relationships || { roster: [], byId: {} };
  const byId = { ...(relationships.byId || {}) };
  const roster = Array.isArray(relationships.roster) ? [...relationships.roster] : [];

  if (byId.partner) byId.partner = { ...byId.partner, meter: nextMeter };
  const idx = roster.findIndex((p) => p.id === 'partner');
  if (idx >= 0) roster[idx] = { ...roster[idx], meter: nextMeter };

  return { partnerMeter: nextMeter, relationships: { ...relationships, byId, roster } };
}

function makeTimelineEntry(title, detail, age, meta = {}) {
  return {
    kind: 'relationship',
    title,
    detail,
    age,
    deltas: null,
    moneyDelta: 0,
    loveDelta: 0,
    stressDelta: 0,
    meta,
  };
}

function computePartnerCheatChance(meter) {
  if (meter >= 80) return 0;
  if (meter >= 50) return 0.10;
  if (meter >= 35) return 0.18;
  if (meter >= 20) return 0.28;
  return 0.40;
}

// PG-13, non-shaming:
// - Most outcomes are treatable.
// - Some are chronic but manageable with ongoing care.
function pickInfection(rng) {
  const roll = rng();
  if (roll < 0.78) {
    return { kind: 'treatable', label: 'a treatable STI', emoji: '🧫', infectionId: 'treatable_generic' };
  }
  if (roll < 0.92) {
    return { kind: 'chronic', label: 'a lifelong infection (manageable)', emoji: '🧬', infectionId: 'herpes' };
  }
  return { kind: 'chronic', label: 'HIV (manageable with treatment)', emoji: '🧬', infectionId: 'hiv' };
}

function appendChildPrompts({ gameState, newAge, drama, sex, runSeed, prompts }) {
  const peerCircle = Number(gameState.peerCircle) || 0;
  const love = Number(gameState.love) || 0;

  const sexEd = drama.sexEd || {};
  const teen = drama.teen || {};
  const hasStiNow =
    (sex?.player?.status && sex.player.status !== 'clear') ||
    (sex?.partner?.status && sex.partner.status !== 'clear');

  // "The talk" (age 12–16), once per year until done
  if (newAge >= 12 && newAge <= 16 && !sexEd.done) {
    if (sexEd.lastPromptAge !== newAge) {
      prompts.push({
        id: `sex_ed_${newAge}`,
        kind: 'sex_ed',
        title: '🦜🐝 The Talk',
        description: hasStiNow
          ? `Your kid is old enough for "the talk."\nYou're also dealing with a health situation, so this is a chance to model honesty + responsibility without shame.`
          : `Your kid is old enough for "the talk."\nKeep it PG-13: respect, boundaries, consent, and health.`,
        confirmText: 'Have the talk',
        cancelText: 'Avoid it (for now)',
        onConfirm: {
          logs: [
            `🦜🐝 You have "the talk." It's awkward, sincere, and somehow ends with a question about whether pigeons have feelings.`,
            hasStiNow ? `🩺 You mention that health issues can happen — the responsible move is honesty + a doctor, not shame.` : null,
          ].filter(Boolean),
          timelineEntries: [
            makeTimelineEntry(
              'Had "the talk"',
              hasStiNow ? 'You framed health + responsibility without shame.' : 'You covered respect, boundaries, and health.',
              newAge
            ),
          ],
          relationshipDramaPatch: {
            sexEd: {
              done: true,
              doneAtAge: newAge,
              lastPromptAge: newAge,
              quality: hasStiNow ? 85 : 80,
              style: hasStiNow ? 'health_and_honesty' : 'basic_respect',
            },
          },
        },
        onCancel: {
          logs: [`😅 You dodge "the talk." The universe quietly schedules it again… with extra awkwardness.`],
          timelineEntries: [makeTimelineEntry('Avoided "the talk"', 'You postponed the conversation.', newAge)],
          relationshipDramaPatch: {
            sexEd: { done: false, lastPromptAge: newAge, quality: Number.isFinite(Number(sexEd.quality)) ? Number(sexEd.quality) : 0 },
          },
        },
      });
    }
  }

  // Rare teen health scare (age 15–18), gated by negative conditions
  if (newAge >= 15 && newAge <= 18) {
    if (teen.lastHealthScareAge !== newAge - 1) {
      const base = 0.01;
      const lowEd = !sexEd.done || (Number(sexEd.quality) || 0) < 50 ? 0.04 : 0;
      const peerBoost = peerCircle > 65 ? 0.03 : peerCircle > 50 ? 0.015 : 0;
      const lowLoveBoost = love < 45 ? 0.02 : 0;
      const risk = clamp01(base + lowEd + peerBoost + lowLoveBoost);

      const rng = makeRng(runSeed, 'teenHealthScare', newAge, Math.round(peerCircle), Math.round(Number(sexEd.quality) || 0));
      if (rng() < risk) {
        prompts.push({
          id: `teen_scare_${newAge}`,
          kind: 'teen_health_scare',
          title: '😰 Teen health scare',
          description: `Your teen comes to you scared about a possible health issue.\nThis is a chance to respond with support and get a doctor involved.`,
          confirmText: 'Be supportive',
          cancelText: 'Minimize it',
          onConfirm: {
            logs: [`🫶 You stay calm, supportive, and help them plan a doctor visit.`],
            timelineEntries: [makeTimelineEntry('Teen health scare', 'You responded with support and planned a doctor visit.', newAge)],
            relationshipDramaPatch: { teen: { ...teen, lastHealthScareAge: newAge - 1 } },
          },
          onCancel: {
            logs: [`🙃 You try to brush it off. They don't look reassured.`],
            timelineEntries: [makeTimelineEntry('Teen health scare', 'You minimized the concern.', newAge)],
            relationshipDramaPatch: { teen: { ...teen, lastHealthScareAge: newAge - 1 } },
          },
        });
      }
    }
  }
}

export function runRelationshipDramaAnnualTick(gameState, newAge) {
  const updates = {};
  const logs = [];
  const timelineEntries = [];
  const prompts = [];

  const prevAge = newAge - 1;
  const runSeed = gameState.runSeed || 'seed';

  let drama = ensureDramaState(gameState.relationshipDrama);
  let sex = ensureSexualHealthState(gameState.sexualHealth);

  let nextStress = Number(gameState.stress) || 0;
  let nextPlayerHealth = Number(gameState.playerHealth ?? 75);

  const partnerRel = isObj(gameState.partnerRelationship) ? gameState.partnerRelationship : null;
  const relStatus = partnerRel?.status;
  const hasActivePartner = gameState.householdType === 'two' && (relStatus === 'partnered' || relStatus === 'married');

  const relationships = gameState.relationships || { roster: [], byId: {} };
  const partnerPerson =
    relationships.byId?.partner ||
    (Array.isArray(relationships.roster) ? relationships.roster.find((p) => p.id === 'partner') : null);

  // Even if no partner, child prompts may still apply
  if (!hasActivePartner || !partnerPerson || isPersonDead(partnerPerson)) {
    appendChildPrompts({ gameState, newAge, drama, sex, runSeed, prompts });
    if (!isObj(gameState.relationshipDrama)) updates.relationshipDrama = drama;
    if (!isObj(gameState.sexualHealth)) updates.sexualHealth = sex;
    if (prompts.length > 2) prompts.splice(2);
    return { updates, logs, timelineEntries, prompts };
  }

  const partnerName = partnerPerson.name || gameState.partnerName || 'your partner';
  const partnerMeterRaw = Number.isFinite(Number(gameState.partnerMeter))
    ? Number(gameState.partnerMeter)
    : (Number(partnerPerson.meter) || 80);
  let nextPartnerMeter = clamp(partnerMeterRaw);

  const openActive = !!partnerRel?.openRelationship?.active;
  const crisis = partnerRel?.crisis ?? null;

  // Detect whether player interacted with partner last year (maintenance)
  const lastYearData = partnerPerson?.interactionsByAge?.[prevAge] || {};
  const usedActionsObj = isObj(lastYearData.usedActions) ? lastYearData.usedActions : {};
  const hadPartnerInteraction =
    !!lastYearData.didConnect || !!lastYearData.lastActionId || !!lastYearData.type || Object.keys(usedActionsObj).length > 0;

  if (!hadPartnerInteraction) {
    nextPartnerMeter = clamp(nextPartnerMeter - 5);
    logs.push(`📉 You didn't spend real time with ${partnerName} this year. (Relationship -5)`);
    timelineEntries.push(makeTimelineEntry('Relationship neglected', `You didn't meaningfully connect with ${partnerName}.`, prevAge));
  }

  // Divorce follow-through: warning last year + still low now
  if (crisis?.warnedAtAge === prevAge - 1 && nextPartnerMeter <= 22) {
    const sepState = finalizePartnerSeparation({ ...gameState, currentYear: newAge }, { mode: 'divorce' });
    Object.assign(updates, sepState);
    updates.householdType = 'single';
    updates.partnerRelationship = {
      ...(sepState.partnerRelationship || {}),
      openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
      crisis: null,
    };
    logs.push(`💔 ${partnerName} follows through. The relationship ends.`);
    timelineEntries.push(makeTimelineEntry('Divorce', `${partnerName} left after months of tension.`, newAge));

    prompts.push({
      id: `divorce_final_${newAge}`,
      kind: 'divorce_final',
      title: '💔 Divorce',
      description:
        `${partnerName} follows through and ends the relationship.\n\n` +
        `You are now single, and ${partnerName} has moved into your Relationships list as an ex.`,
      confirmText: 'OK',
      cancelText: 'Close',
      onConfirm: {},
      onCancel: {}
    });

    appendChildPrompts({ gameState, newAge, drama, sex, runSeed, prompts });
    if (prompts.length > 2) prompts.splice(2);
    return { updates, logs, timelineEntries, prompts };
  }

  // Player outside encounters (side dating system populates these)
  const outside = drama.outsideEncountersByAge?.[prevAge] || {};
  const outsideCount = Math.max(0, Number(outside.count) || 0);
  const maleEncounters = Math.max(0, Number(outside.maleEncounters) || 0);
  const isCheating = outsideCount > 0 && !openActive;

  // Pregnancy scare (PG-13): only if player is female + male encounters
  const isPlayerFemale = gameState.parentRole === 'mom' || gameState.parentAvatarGender === 'female';
  if (isPlayerFemale && maleEncounters > 0) {
    const onBC = !!gameState.birthControl?.playerOn;
    const per = onBC ? 0.01 : 0.03;
    const chance = clamp01(1 - Math.pow(1 - per, maleEncounters));
    const rng = makeRng(runSeed, 'pregScare', prevAge, maleEncounters, onBC ? 'bc' : 'nobc');
    if (rng() < Math.min(0.12, chance)) {
      drama = { ...drama, lastPregnancyScareAge: prevAge };
      nextStress = clamp(nextStress + 3);
      if (!openActive) nextPartnerMeter = clamp(nextPartnerMeter - 6);
      logs.push(`😳 A stressful "uh-oh" moment turns into a pregnancy scare. (Stress +3)`);
      timelineEntries.push(makeTimelineEntry('Pregnancy scare', 'A reminder that actions have consequences.', prevAge));
    }
  }

  // Affair discovery prompt (only if cheating)
  if (isCheating) {
    let chance = 0.06 + Math.min(0.25, outsideCount * 0.05);
    if (nextPartnerMeter < 60) chance += 0.07;
    chance += Math.min(0.12, (Number(drama.lieDebt) || 0) * 0.04);
    if (drama.lastPregnancyScareAge === prevAge) chance += 0.35;
    chance = clamp01(chance);

    const rng = makeRng(runSeed, 'affairDiscovery', prevAge, outsideCount, Math.round(nextPartnerMeter), Number(drama.lieDebt) || 0);
    if (rng() < chance) {
      prompts.push({
        id: `affair_discovered_${prevAge}`,
        kind: 'affair_discovered',
        title: '😬 Busted?',
        description: `${partnerName} found something that doesn't match your story.\nThey ask, very calmly, "Is there someone else?"\n\nPG-13 note: this is about trust + responsibility, not explicit content.`,
        confirmText: 'Tell the truth',
        cancelText: 'Lie',
        destructive: true,
        onConfirm: {
          partnerMeterDelta: -18,
          stressDelta: 3,
          logs: [`🧾 You tell the truth. The silence in the room becomes a full-time employee.`],
          timelineEntries: [makeTimelineEntry('Affair discovered (truth)', 'You admitted the truth. Trust took a big hit.', prevAge)],
          partnerRelationshipPatch: { crisis: { ...(crisis || {}), trustBreachAtAge: prevAge } },
          relationshipDramaPatch: {
            lastAffairDiscoveryAge: prevAge,
            lieDebt: Math.max(0, (Number(drama.lieDebt) || 0) - 1),
          },
        },
        onCancel: {
          partnerMeterDelta: -6,
          stressDelta: 2,
          logs: [`🤥 You lie. It buys time — and also creates a bigger problem later.`],
          timelineEntries: [makeTimelineEntry('Affair discovered (lie)', 'You denied it. Trust eroded anyway.', prevAge)],
          partnerRelationshipPatch: { crisis: { ...(crisis || {}), trustBreachAtAge: prevAge } },
          relationshipDramaPatch: {
            lastAffairDiscoveryAge: prevAge,
            lieDebt: (Number(drama.lieDebt) || 0) + 1,
          },
        },
      });
    }
  }

  // Partner cheating (if relationship is closed). If open, assume some outside dating for STI-risk only.
  let partnerOutsideCount = Math.max(0, Number(drama.partnerOutsideEncountersByAge?.[prevAge]?.count) || 0);

  if (!openActive) {
    let chance = computePartnerCheatChance(nextPartnerMeter);
    if (!hadPartnerInteraction) chance += 0.05;
    if ((Number(gameState.partnerCounselingBuffer) || 0) > 0) chance = Math.max(0, chance - 0.04);
    chance = Math.min(0.55, chance);

    const rng = makeRng(runSeed, 'partnerCheat', prevAge, Math.round(nextPartnerMeter), hadPartnerInteraction ? 'together' : 'apart');
    if (rng() < chance) {
      partnerOutsideCount = Math.max(1, partnerOutsideCount);
      nextPartnerMeter = clamp(nextPartnerMeter - 8);
      nextStress = clamp(nextStress + 2);

      const nextPartnerOutsideByAge = { ...(drama.partnerOutsideEncountersByAge || {}) };
      const prevEntry = nextPartnerOutsideByAge[prevAge] || {};
      nextPartnerOutsideByAge[prevAge] = { ...prevEntry, count: partnerOutsideCount };
      drama = { ...drama, partnerOutsideEncountersByAge: nextPartnerOutsideByAge };

      logs.push(`🕵️ You get a bad feeling. ${partnerName} might be seeing someone else. (Relationship -8)`);
      timelineEntries.push(makeTimelineEntry('Partner cheated', 'Trust took a hit.', prevAge));
    }
  } else {
    if (partnerOutsideCount === 0) {
      const rng = makeRng(runSeed, 'openPartnerOutside', prevAge);
      if (rng() < 0.35) partnerOutsideCount = rng() < 0.2 ? 2 : 1;
    }
  }

  // Divorce warning prompt: warning first, not instant
  if (prompts.length === 0 && nextPartnerMeter <= 30 && crisis?.warnedAtAge !== prevAge) {
    prompts.push({
      id: `divorce_warning_${prevAge}`,
      kind: 'divorce_warning',
      title: '⚠️ "We need to talk…"',
      description: `${partnerName} says they feel neglected and is thinking about leaving.\nThis is your warning shot — not an instant divorce.`,
      confirmText: 'Commit to fixing it',
      cancelText: 'Brush it off',
      destructive: true,
      onConfirm: {
        partnerMeterDelta: +2,
        logs: [`🧩 You commit to showing up more. ${partnerName} doesn't look fully convinced… but they're listening.`],
        timelineEntries: [makeTimelineEntry('Divorce warning', 'You committed to improving the relationship.', prevAge)],
        partnerRelationshipPatch: { crisis: { ...(crisis || {}), warnedAtAge: prevAge, planMadeAtAge: prevAge } },
      },
      onCancel: {
        partnerMeterDelta: -5,
        logs: [`😬 You dismiss the conversation. ${partnerName} looks like they just took a screenshot… emotionally.`],
        timelineEntries: [makeTimelineEntry('Divorce warning', 'You brushed off the warning.', prevAge)],
        partnerRelationshipPatch: { crisis: { ...(crisis || {}), warnedAtAge: prevAge, ignoredAtAge: prevAge } },
      },
    });
  }

  // STI risk: only if there was outside contact (cheating/open/partner cheating)
  const totalOutside = outsideCount + partnerOutsideCount;
  if (totalOutside > 0) {
    const baseRisk = openActive ? 0.045 : isCheating ? 0.07 : 0.06;
    const risk = Math.min(0.35, 1 - Math.pow(1 - baseRisk, totalOutside));
    const rng = makeRng(runSeed, 'stiRoll', prevAge, totalOutside, openActive ? 'open' : 'closed');

    if (rng() < risk) {
      const whoRng = makeRng(runSeed, 'stiWho', prevAge, outsideCount, partnerOutsideCount);
      const whoRoll = whoRng();
      let who = 'player';
      if (outsideCount > 0 && partnerOutsideCount === 0) who = whoRoll < 0.65 ? 'player' : 'partner';
      else if (outsideCount === 0 && partnerOutsideCount > 0) who = whoRoll < 0.65 ? 'partner' : 'player';
      else who = whoRoll < 0.5 ? 'player' : 'partner';

      const inf = pickInfection(makeRng(runSeed, 'stiType', prevAge, totalOutside));
      nextStress = clamp(nextStress + 2);

      const writeDiagnosis = (key, display) => {
        const cur = sex[key] || {};
        if (cur.status && cur.status !== 'clear') return; // already dealing with something
        sex = {
          ...sex,
          [key]: {
            ...cur,
            status: inf.kind === 'treatable' ? 'treatable' : 'chronic',
            infectionId: inf.infectionId,
            label: inf.label,
            diagnosedAtAge: newAge,
            treatedAtAge: null,
            lastClinicAge: null,
            managed: false,
            lastMedsAge: null,
          },
        };
        logs.push(`${inf.emoji} ${display} got a clinic message about ${inf.label}. (Health event)`);
        logs.push(`🧪 You can visit Health → Sexual Health Clinic to treat/manage it (PG‑13).`);
        timelineEntries.push(makeTimelineEntry('Sexual health update', `${display} is dealing with ${inf.label}.`, newAge));
      };

      if (who === 'player') writeDiagnosis('player', 'You');
      else writeDiagnosis('partner', partnerName);
    }
  }

  // Ongoing care: if treatable and ignored, it gets worse (health framing, not shame).
  const needsTreatableCare = (p) =>
    p?.status === 'treatable' &&
    p?.diagnosedAtAge !== null &&
    Number(p.diagnosedAtAge) <= prevAge &&
    (p?.treatedAtAge === null || p?.treatedAtAge === undefined);

  const needsChronicMeds = (p) =>
    p?.status === 'chronic' &&
    p?.diagnosedAtAge !== null &&
    Number(p.diagnosedAtAge) <= prevAge &&
    Number(p?.lastMedsAge) !== prevAge;

  if (needsTreatableCare(sex.player)) {
    nextStress = clamp(nextStress + 1);
    nextPlayerHealth = clamp(nextPlayerHealth - 1);
    logs.push(`🧾 You ignored a treatable health issue. It becomes… less ignorable. (Health -1, Stress +1)`);
    timelineEntries.push(makeTimelineEntry('Health follow-up missed', 'A treatable issue worsened because it was ignored.', prevAge));
  }

  if (needsChronicMeds(sex.player)) {
    nextStress = clamp(nextStress + 1);
    nextPlayerHealth = clamp(nextPlayerHealth - 2);
    logs.push(`🩺 You missed a treatment follow-up. Your body files a complaint. (Health -2, Stress +1)`);
    timelineEntries.push(makeTimelineEntry('Treatment follow-up missed', 'You fell behind on chronic treatment follow-ups.', prevAge));
  }

  // Partner/household strain (light): if partner has untreated issue, stress rises.
  if (needsTreatableCare(sex.partner) || needsChronicMeds(sex.partner)) {
    nextStress = clamp(nextStress + 0.6);
    logs.push(`🏠 Health stress shows up in the household vibe. (Stress +0.6)`);
  }

  // Commit scalar updates
  nextStress = clamp(nextStress);
  nextPlayerHealth = clamp(nextPlayerHealth);

  if (nextStress !== (Number(gameState.stress) || 0)) updates.stress = nextStress;
  if (nextPlayerHealth !== Number(gameState.playerHealth ?? 75)) updates.playerHealth = nextPlayerHealth;

  nextPartnerMeter = clamp(nextPartnerMeter);
  if (nextPartnerMeter !== partnerMeterRaw) Object.assign(updates, patchPartnerMeter(gameState, nextPartnerMeter));

  // Commit state objects if changed or missing
  if (!isObj(gameState.relationshipDrama) || JSON.stringify(drama) !== JSON.stringify(gameState.relationshipDrama || {})) {
    updates.relationshipDrama = drama;
  }
  if (!isObj(gameState.sexualHealth) || JSON.stringify(sex) !== JSON.stringify(gameState.sexualHealth || {})) {
    updates.sexualHealth = sex;
  }

  // Child prompts (talk + teen scare)
  appendChildPrompts({ gameState, newAge, drama, sex, runSeed, prompts });

  // Limit prompt spam
  if (prompts.length > 2) prompts.splice(2);

  return { updates, logs, timelineEntries, prompts };
}