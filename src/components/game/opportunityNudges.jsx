// Opportunity Nudges System
// Injects lightweight "check this hub" moments every ~3 years

import { createSeededRng } from './GameStateContext';

export function shouldInjectOpportunityNudge(gameState) {
  const age = Number(gameState.currentYear ?? 0);
  const lastOpp = gameState.lastOpportunityYear;
  
  if (lastOpp === null && age < 3) return false; // Too early
  if (lastOpp !== null && age - lastOpp < 3) return false; // Too soon
  
  return true;
}

export function pickOpportunityHub(gameState) {
  const lastVisits = gameState.lastHubVisitYear || { career: null, housing: null, politics: null, business: null };
  
  // Find oldest/never-visited hub
  const hubs = [
    { id: 'career', lastVisit: lastVisits.career },
    { id: 'housing', lastVisit: lastVisits.housing },
    { id: 'politics', lastVisit: lastVisits.politics },
    { id: 'business', lastVisit: lastVisits.business }
  ];
  
  // Sort by age (null first, then oldest)
  hubs.sort((a, b) => {
    if (a.lastVisit === null && b.lastVisit === null) return 0;
    if (a.lastVisit === null) return -1;
    if (b.lastVisit === null) return 1;
    return a.lastVisit - b.lastVisit;
  });
  
  return hubs[0].id;
}

export function buildOpportunityMoment({ hubId, age, runSeed, childName }) {
  const moments = {
    career: {
      title: "🎯 A Work Conversation",
      hook: "Your boss calls you into a brief meeting.",
      checkoutText: "Check Career Hub",
      ignoreText: "Not now"
    },
    housing: {
      title: "🏠 A Housing Opportunity",
      hook: "You hear about a property auction coming up.",
      checkoutText: "Check Real Estate Hub",
      ignoreText: "Pass"
    },
    politics: {
      title: "🗳️ A Political Invitation",
      hook: "A friend suggests you run for local office.",
      checkoutText: "Check Politics Hub",
      ignoreText: "Decline"
    },
    business: {
      title: "💼 A Side Opportunity",
      hook: "An opportunity for extra income lands in your inbox.",
      checkoutText: "Check Business Hub",
      ignoreText: "Ignore"
    }
  };
  
  const moment = moments[hubId] || moments.career;
  
  return {
    id: `opportunity_${hubId}_${age}`,
    title: moment.title,
    scenarioText: moment.hook,
    hookText: moment.hook,
    choices: [
      {
        id: 'checkout',
        letter: 'A',
        emoji: '👀',
        text: moment.checkoutText,
        consequence: `You navigate to the ${hubId} hub.`,
        deltas: {},
        loveDelta: 0,
        stressDelta: 0,
        meta: { hubId }
      },
      {
        id: 'ignore',
        letter: 'B',
        emoji: '🙅',
        text: moment.ignoreText,
        consequence: "You pass on this opportunity for now.",
        deltas: {},
        loveDelta: 0,
        stressDelta: -1,
        meta: {}
      }
    ],
    meta: {
      packId: 'opportunity_nudges',
      category: 'opportunity',
      hubId,
      noFocusCostForA: true
    }
  };
}