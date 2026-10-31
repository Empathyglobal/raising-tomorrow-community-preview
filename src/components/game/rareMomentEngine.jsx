import { RARE_MOMENTS } from "@/components/content/rareMoments";

export function evaluateRareMomentUnlocks({ gameState, age, yearDelta }) {
  try {
    const unlocks = [];
    const stats = gameState?.stats || {};
    const moneyDelta = Number(yearDelta?.moneyDelta || 0);

    // Crowned Too Soon
    const royalStatus = gameState?.playerCareer?.royalty?.status;
    if (royalStatus === 'monarch' && age <= 25) unlocks.push('royal_crowned_early');

    // Tabloid Magnet (very rough heuristic): 3+ royal events in timeline
    const royalHits = (gameState.timelineEntries || []).filter(e => String(e.title||'').includes('👑') || String(e.title||'').toLowerCase().includes('tabloid')).length;
    if (royalHits >= 3) unlocks.push('royal_tab_magnet');

    // Genius Toddler
    if (age <= 5 && Number(stats.intelligence || 0) >= 15) unlocks.push('genius_toddler');

    // Confidence swings
    const cDelta = Number(yearDelta?.statDeltas?.confidence || 0);
    if (cDelta >= 3) unlocks.push('confidence_rocket');
    if (cDelta <= -3) unlocks.push('confidence_crash');

    // Money swings
    if (moneyDelta >= 100000) unlocks.push('money_printer');
    if (moneyDelta <= -50000) unlocks.push('oops_era');

    // Kid wisdom / tiny cute (if recorded this age)
    const ageEvents = (gameState.timelineEntries || []).filter(e => e.age === age);
    if (ageEvents.some(e => e.kind === 'kidWisdom')) unlocks.push('kid_philosopher');
    if (ageEvents.some(e => e.kind === 'tinyCute')) unlocks.push('tiny_cute');

    // Repair chapter (look for stress/love favorable shift)
    const loveDelta = Number(yearDelta?.loveDelta || 0) || 0;
    const stressDelta = Number(yearDelta?.stressDelta || 0) || 0;
    if (loveDelta > 0 && stressDelta < 0) unlocks.push('repair_chapter');

    // First home
    if ((gameState.realEstate?.properties?.length || 0) > 0 && ageEvents.some(e => String(e.title||'').includes('Bought'))) {
      unlocks.push('first_home');
    }

    // Return unique ids
    return Array.from(new Set(unlocks));
  } catch (e) {
    console.error('[rareMomentEngine] evaluate failed', e);
    return [];
  }
}