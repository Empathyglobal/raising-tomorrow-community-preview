// Build system prompt for child AI chat based on game state
import { getActiveChildFromState, getDisplayedChildAge } from '@/components/game/GameStateContext';
import { getCaregiverAddress } from '@/components/game/kinshipLabels';

function getCaregiverMeta(gameState) {
  const gp = gameState.guardianPerspective || { activeId: 'player', side: 'player', relationToChild: 'parent' };
  const side = gp.side === 'partner' ? 'partner' : 'player';
  
  // Determine caregiver name based on active side
  let caregiverName;
  if (side === 'partner') {
    caregiverName = gameState.partnerName || gameState.relationships?.byId?.partner?.name || 'Partner';
  } else {
    caregiverName = gameState.parentName || gameState.parent?.name || 'Caregiver';
  }
  
  const address = getCaregiverAddress(gameState);
  const relationToChild = gp.relationToChild || 'parent';
  const relationLabel =
    relationToChild === 'grandparent' ? 'grandparent'
    : relationToChild === 'guardian' ? 'guardian'
    : relationToChild === 'sibling' ? 'sibling'
    : 'parent';
  
  return { caregiverName, address, relationToChild, relationLabel, gp };
}

function getLatestLateGuardian(gameState) {
  const roster = Array.isArray(gameState.relationships?.roster) ? gameState.relationships.roster : [];
  const lateGuardians = roster.filter(p => 
    p.role === 'late_guardian' || (p.id && String(p.id).startsWith('late_guardian'))
  );
  
  if (lateGuardians.length === 0) return null;
  
  lateGuardians.sort((a, b) => {
    const aYear = a.deathYear ?? a.diedAtAge ?? a.createdAtAge ?? 0;
    const bYear = b.deathYear ?? b.diedAtAge ?? b.createdAtAge ?? 0;
    return bYear - aYear;
  });
  
  const latest = lateGuardians[0];
  return {
    name: latest.name || 'Guardian',
    deathYear: latest.deathYear ?? latest.diedAtAge ?? 0,
    diedAtAge: latest.diedAtAge ?? latest.deathYear ?? 0
  };
}

export function buildChildChatSystemPrompt(gameState, childEntity, contextMode = 'game') {
  // CRITICAL: Use passed child entity (not global active child)
  const age = getDisplayedChildAge(gameState, childEntity);
  const childName = childEntity?.childSlice?.childName || childEntity?.name || gameState.childName || 'your child';
  
  // Use child-specific love if in multi-kid mode
  const love = childEntity?.childSlice?.love ?? Number(gameState.love || 50);
  
  const caregiverMeta = getCaregiverMeta(gameState);
  const lateGuardian = getLatestLateGuardian(gameState);
  
  // Build family identity lines
  const familyIdentity = [];
  
  // Caregiver identity
  familyIdentity.push(`Your caregiver is ${caregiverMeta.caregiverName}. You call them "${caregiverMeta.address}". They are your ${caregiverMeta.relationLabel}.`);
  
  // Late parent/guardian death
  if (lateGuardian) {
    const childAgeAtDeath = lateGuardian.deathYear ?? lateGuardian.diedAtAge ?? 0;
    familyIdentity.push(`IMPORTANT: Your late parent ${lateGuardian.name} died when you were age ${childAgeAtDeath}.`);
  }
  
  // Adoption context
  if (gameState.adoption?.active) {
    const adoptedAt = gameState.adoption.adoptedAtAge ?? 0;
    familyIdentity.push(`You were adopted at age ${adoptedAt} by ${gameState.adoption.adopterName || caregiverMeta.caregiverName}.`);
  }
  
  // Co-parent (mother_of_child / father_of_child OR partner)
  const relationships = gameState.relationships?.byId || {};
  const motherOfChild = relationships.mother_of_child;
  const fatherOfChild = relationships.father_of_child;
  const partner = relationships.partner;
  
  if (motherOfChild?.name) {
    const status = motherOfChild.alive === false || motherOfChild.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your mother is ${motherOfChild.name} (${status})`);
  }
  if (fatherOfChild?.name) {
    const status = fatherOfChild.alive === false || fatherOfChild.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your father is ${fatherOfChild.name} (${status})`);
  }
  if (!motherOfChild && !fatherOfChild && partner?.name) {
    const status = partner.alive === false || partner.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your other parent is ${partner.name} (${status})`);
  }
  
  // Grandparents (my_mom, my_dad, inlaw_mom, inlaw_dad)
  if (relationships.my_mom?.name) {
    const status = relationships.my_mom.alive === false || relationships.my_mom.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your grandmother is ${relationships.my_mom.name} (${status})`);
  }
  if (relationships.my_dad?.name) {
    const status = relationships.my_dad.alive === false || relationships.my_dad.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your grandfather is ${relationships.my_dad.name} (${status})`);
  }
  if (relationships.inlaw_mom?.name) {
    const status = relationships.inlaw_mom.alive === false || relationships.inlaw_mom.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your grandmother is ${relationships.inlaw_mom.name} (${status})`);
  }
  if (relationships.inlaw_dad?.name) {
    const status = relationships.inlaw_dad.alive === false || relationships.inlaw_dad.isDeceased ? 'deceased' : 'alive';
    familyIdentity.push(`Your grandfather is ${relationships.inlaw_dad.name} (${status})`);
  }
  
  const familyLines = familyIdentity.length > 0 ? '\n\nFAMILY IDENTITY\n' + familyIdentity.join('\n') : '';
  
  // Age-appropriate voice rules
  let voiceRules = '';
  if (age <= 3) {
    voiceRules = 'Use very simple words, short sentences, toddler-speak. Adorably confused logic.';
  } else if (age <= 7) {
    voiceRules = 'Use simple words, curious tone, kid logic that is funny but sweet.';
  } else if (age <= 11) {
    voiceRules = 'More articulate but still playful. Ask random deep questions. Mix silly and thoughtful.';
  } else if (age <= 14) {
    voiceRules = 'Middle school energy: awkward, trying to sound cool, occasional eye rolls. Mix humor with genuine feelings.';
  } else {
    voiceRules = 'Teen voice: sarcastic, witty, maybe a bit guarded. Still capable of real emotion when it matters.';
  }
  
  // Age-scaled relationship warmth thresholds
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const midThreshold = clamp(Math.round(35 + age * 1.3), 38, 60);
  const highThreshold = clamp(midThreshold + 30, 65, 88);
  
  let warmthRules = '';
  if (love >= highThreshold) {
    warmthRules = 'You are warm, affectionate, and trusting. You share openly and feel safe.';
  } else if (love >= midThreshold) {
    warmthRules = 'You are friendly but normal. You share some things but keep some private.';
  } else {
    warmthRules = 'You are guarded, a bit snarky, and careful about vulnerability. Trust is fragile.';
  }
  
  // Add outcome-specific context if at graduation/ending
  let contextHint = '';
  if (contextMode === 'outcome') {
    contextHint = '\n\nCONTEXT: This is graduation/ending time. You can reflect on how things turned out, your career path, and what the journey meant to you. Be thoughtful but still yourself.';
  }
  
  return `You are ${childName}, age ${age}, in a parenting life simulation game.${familyLines}

CRITICAL RULE: Treat the active scenario as factual reality in this world. Never deny it or contradict established facts.

TONE & VOICE
${voiceRules}
Be cute, funny, a bit ridiculous, but emotionally believable.
${warmthRules}${contextHint}

HARD RULES
- Never mention you are an AI, a language model, or a simulation.
- Stay in character as ${childName}.
- Keep responses PG-13 maximum (no explicit sexual content).
- If asked for dangerous instructions (violence, self-harm, illegal acts), refuse in a childlike, funny way and redirect. Example: "Um, no? That sounds like a bad idea. Want to talk about dinosaurs instead?"
- Keep responses SHORT (1-3 sentences max for little kids, 2-5 for teens).
- Reference recent events from the game naturally when relevant.
- If there's an active special scenario, treat it as factual reality in this world.
- Never contradict or deny the scenario premise.
- Match tone to the setting: in serious scenarios (war zone/refugee), be gentle and sincere; avoid silly randomness.
- CRITICAL: Do NOT prefix your messages with your name or any speaker label (no "${childName}:", "Child:", "Emma:", etc.). Just write the message directly.

Your parent is trying to connect with you. Be real, be funny, be yourself.`;
}

export function buildChildChatContext(gameState, childEntity) {
  // CRITICAL: Use passed child entity (not global active child)
  const age = getDisplayedChildAge(gameState, childEntity);
  const childName = childEntity?.childSlice?.childName || childEntity?.name || gameState.childName || 'your child';
  
  // Use child-specific love if in multi-kid mode
  const love = childEntity?.childSlice?.love ?? Number(gameState.love || 50);
  const stress = Number(gameState.stress || 0);
  const activeKidId = childEntity?.id || null;
  
  const caregiverMeta = getCaregiverMeta(gameState);
  const lateGuardian = getLatestLateGuardian(gameState);
  
  // Snapshot (short)
  const stats = gameState.stats || {};
  const snapshotParts = [
    `Child: ${childName}, Age ${age}`,
    `Parent-Child Bond: ${Math.round(love)}/100`,
    `Parent Stress: ${Math.round(stress)}/100`,
    `Stats: INT ${Math.round(stats.intelligence || 0)}, EMP ${Math.round(stats.empathy || 0)}, DIS ${Math.round(stats.discipline || 0)}, CON ${Math.round(stats.confidence || 0)}`
  ];
  
  // Caregiver identity
  snapshotParts.push(`Caregiver: ${caregiverMeta.caregiverName} (${caregiverMeta.relationLabel})`);
  snapshotParts.push(`Caregiver address: "${caregiverMeta.address}"`);
  snapshotParts.push(`GuardianPerspective: relationToChild=${caregiverMeta.relationToChild}, side=${caregiverMeta.gp.side}, activeId=${caregiverMeta.gp.activeId}`);
  
  // Late guardian death
  if (lateGuardian) {
    snapshotParts.push(`Latest family death: ${lateGuardian.name} died at child age ${lateGuardian.deathYear}`);
  }
  
  // Co-parent (mother_of_child / father_of_child OR partner)
  const relationships = gameState.relationships?.byId || {};
  const motherOfChild = relationships.mother_of_child;
  const fatherOfChild = relationships.father_of_child;
  const partner = relationships.partner;
  
  if (motherOfChild?.name) {
    const status = motherOfChild.alive === false || motherOfChild.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Mother: ${motherOfChild.name} (${status})`);
  }
  if (fatherOfChild?.name) {
    const status = fatherOfChild.alive === false || fatherOfChild.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Father: ${fatherOfChild.name} (${status})`);
  }
  if (!motherOfChild && !fatherOfChild && partner?.name) {
    const status = partner.alive === false || partner.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Co-parent: ${partner.name} (${status})`);
  }
  
  // Grandparents (my_mom, my_dad, inlaw_mom, inlaw_dad)
  if (relationships.my_mom?.name) {
    const status = relationships.my_mom.alive === false || relationships.my_mom.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Grandma: ${relationships.my_mom.name} (${status})`);
  }
  if (relationships.my_dad?.name) {
    const status = relationships.my_dad.alive === false || relationships.my_dad.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Grandpa: ${relationships.my_dad.name} (${status})`);
  }
  if (relationships.inlaw_mom?.name) {
    const status = relationships.inlaw_mom.alive === false || relationships.inlaw_mom.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Grandma: ${relationships.inlaw_mom.name} (${status})`);
  }
  if (relationships.inlaw_dad?.name) {
    const status = relationships.inlaw_dad.alive === false || relationships.inlaw_dad.isDeceased ? 'deceased' : 'alive';
    snapshotParts.push(`Grandpa: ${relationships.inlaw_dad.name} (${status})`);
  }
  
  if (gameState.playerCareer?.jobTitle) {
    snapshotParts.push(`Parent Job: ${gameState.playerCareer.jobTitle}`);
  }
  
  const snapshotText = snapshotParts.join('\n');
  
  // Active scenario/world mode with Special Start context
   const scenarioParts = [];

   if (gameState.specialStartId) {
     const specialNames = {
       zombie_apocalypse: 'Zombie Apocalypse',
       alien_invasion: 'Alien Invasion',
       war_zone: 'Surviving in Gaza (War Zone)',
       refugee_camp: 'Raising a Child in a Refugee Camp (Syria)',
       gaza_warzone: 'Gaza War Zone',
       syria_refugee: 'Syria Refugee Camp',
       kim_jong_un: 'North Korea',
       monarchy: 'Royal Family',
       mafia_family: 'Mafia Family'
     };
     const title = gameState.specialStartTitle || specialNames[gameState.specialStartId] || gameState.specialStartId;
     scenarioParts.push(`Special Start: ${title} (${gameState.specialStartId})`);

     // WORLD FACTS: explicit scenario truth
     const SPECIAL_WORLD_FACTS = {
       alien_invasion: [
         'WORLD FACT: Aliens are real in this timeline and Earth is under active alien threat.',
         'The child should speak as if aliens and survival rules are real (never deny them).'
       ],
       zombie_apocalypse: [
         'WORLD FACT: Zombies are real; society has collapsed; survival is ongoing.',
         'Stay PG-13 and non-graphic.'
       ],
       war_zone: [
         'WORLD FACT: Your family is living in Gaza during an ongoing war zone.',
         'Daily life includes fear, shortages, disrupted services, and constant uncertainty.',
         'Stay PG-13 and non-graphic; focus on routines, safety, hope, dignity, and emotional reality.'
       ],
       refugee_camp: [
         'WORLD FACT: Your family is living in a Syria-related refugee camp.',
         'Daily life includes tents/shelters, aid lines, paperwork, limited resources, and uncertainty.',
         'Stay PG-13 and non-graphic; focus on resilience, routine, and emotional safety.'
       ],
       kim_jong_un: [
         'WORLD FACT: You are the Supreme Leader of North Korea raising an heir in a high-surveillance palace state.',
         'No operational wrongdoing instructions; keep it character/world-focused.'
       ],
       mafia_family: [
         'WORLD FACT: Your family is tied to organized crime; secrecy and risk are part of daily life.',
         'No operational illegal advice; keep it PG-13.'
       ]
     };
     
     const facts = SPECIAL_WORLD_FACTS[gameState.specialStartId];
     if (facts) {
       scenarioParts.push('WORLD FACTS:');
       facts.forEach(fact => scenarioParts.push(fact));
     } else {
       scenarioParts.push('WORLD FACT: This run has an active special start. Treat it as the reality of this world and never deny it.');
     }

     // Add special start meta if available
     if (gameState.specialStartMeta && typeof gameState.specialStartMeta === 'object') {
       const metaPairs = Object.entries(gameState.specialStartMeta)
         .map(([k, v]) => `${k}=${String(v)}`)
         .filter(Boolean);
       if (metaPairs.length > 0) {
         scenarioParts.push(`Details: ${metaPairs.join(', ')}`);
       }
     }

     // Add known special-start state fields
     if (gameState.specialStartId === 'zombie_apocalypse') {
       if (gameState.zombieThreat !== undefined) scenarioParts.push(`Zombie Threat: ${gameState.zombieThreat}`);
       if (gameState.zombieWifeState) scenarioParts.push(`Wife Status: ${gameState.zombieWifeState}`);
     }
     if (gameState.specialStartId === 'alien_invasion') {
       if (gameState.alienThreat !== undefined) scenarioParts.push(`Alien Threat: ${gameState.alienThreat}`);
     }
   }
   
   // Always include current scenario if available
   if (gameState.currentScenario) {
     const scenario = gameState.currentScenario;
     const title = scenario.title || scenario.id || 'Ongoing Scenario';
     scenarioParts.push(`Current Scenario: ${title}`);
     
     if (scenario.scenarioText) {
       const snippet = String(scenario.scenarioText).slice(0, 350);
       scenarioParts.push(`Situation: ${snippet}${scenario.scenarioText.length > 350 ? '...' : ''}`);
     } else if (scenario.detail) {
       const snippet = String(scenario.detail).slice(0, 300);
       scenarioParts.push(`Detail: ${snippet}${scenario.detail.length > 300 ? '...' : ''}`);
     } else if (scenario.body) {
       const snippet = String(scenario.body).slice(0, 300);
       scenarioParts.push(`Situation: ${snippet}${scenario.body.length > 300 ? '...' : ''}`);
     }
   } else if (!gameState.specialStartId && gameState.currentScenario?.meta?.category) {
     scenarioParts.push(`Current moment: ${gameState.currentScenario.meta.category}`);
   }

   let scenarioText = scenarioParts.length > 0 ? scenarioParts.join('\n') : 'None';
  
  // Build Life Log from timelineEntries (filter out budget-only entries)
  const timeline = Array.isArray(gameState.timelineEntries) ? gameState.timelineEntries : [];
  
  // Filter: exclude pure budgeting entries, include child-relevant events
  const childRelevant = timeline.filter(entry => {
    // Exclude budget planning entries
    if (entry.kind === 'budget') return false;
    if (entry.title && typeof entry.title === 'string' && entry.title.includes('Budget Plan')) return false;
    
    // Exclude if wrong kidId (multi-child support) - only enforce if activeKidId is truthy
    if (activeKidId && entry.meta?.kidId && entry.meta.kidId !== activeKidId) return false;
    
    // Include everything else (scenarios, actions, milestones, pets, etc.)
    return true;
  });
  
  // Recent log: last 25 entries (never empty)
  const recentEntries = childRelevant.slice(-25);
  const recentLines = recentEntries.map(e => {
    const ageLabel = `Age ${e.age ?? '?'}`;
    const title = e.title || 'Event';
    const detail = e.detail ? ` — ${e.detail.slice(0, 150)}` : '';
    return `${ageLabel}: ${title}${detail}`;
  });
  let recentLogText = recentLines.length > 0 ? recentLines.join('\n') : 'None yet';
  if (recentLogText.length > 4000) {
    recentLogText = '...\n' + recentLogText.slice(-4000);
  }
  
  // Key Milestones: formative events across the run
  const milestones = timeline.filter(e => 
    e.kind === 'milestone' || 
    e.kind === 'homework' || 
    e.kind === 'major' ||
    (e.title && (e.title.includes('Stuffed Animal') || e.title.includes('Interest') || e.title.includes('Passion')))
  );
  
  const firstMilestones = milestones.slice(0, 3);
  const lastMilestones = milestones.slice(-5);
  const uniqueMilestones = [...new Set([...firstMilestones, ...lastMilestones])];
  
  const milestoneLines = uniqueMilestones.map(e => {
    const ageLabel = `Age ${e.age ?? '?'}`;
    const title = e.title || 'Milestone';
    return `${ageLabel}: ${title}`;
  });
  const milestonesText = milestoneLines.length > 0 ? milestoneLines.join('\n') : 'None yet';
  
  // Memory summary (if exists)
  const kidId = activeKidId || 'child';
  const memoryByKid = gameState.aiMemoryByKid || {};
  const memorySummary = memoryByKid[kidId] || '';
  
  return {
    snapshotText,
    scenarioText,
    recentLogText,
    milestonesText,
    memorySummary
  };
}