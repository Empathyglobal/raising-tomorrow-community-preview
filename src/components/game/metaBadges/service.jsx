import { base44 } from '@/api/base44Client';
import { computeRunMetrics } from './evaluator';

// awardBadgesForRun: convenience wrapper to call backend function
// Accepts either { runSnapshot } or { runMetrics }
export async function awardBadgesForRun(payload) {
  let body = {};
  if (payload?.runSnapshot) {
    body.runSnapshot = payload.runSnapshot;
  } else if (payload?.runMetrics) {
    body.runMetrics = payload.runMetrics;
  } else if (payload?.run) {
    body.runSnapshot = payload.run;
  } else {
    throw new Error('awardBadgesForRun requires runSnapshot or runMetrics');
  }
  const { data } = await base44.functions.invoke('metaBadges', body);
  return data;
}

// Helper to compute metrics then award in one call
export async function computeAndAward(runSnapshot) {
  const metrics = computeRunMetrics(runSnapshot);
  const { data } = await base44.functions.invoke('metaBadges', { runSnapshot });
  return { metrics, result: data };
}