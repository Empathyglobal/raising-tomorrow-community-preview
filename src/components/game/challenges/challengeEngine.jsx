import { normalizeSocialMediaState } from '@/components/game/socialMediaSystem';
import { normalizePlayerCareer } from '@/components/game/careerSystem';

function safeNum(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function getByPath(obj, path) {
  if (!obj || !path) return undefined;
  const parts = String(path).split('.').filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

export function countTotalSocialPosts(gameState) {
  const sm = normalizeSocialMediaState(gameState?.socialMedia);
  let count = 0;
  for (const acc of Object.values(sm.accounts || {})) {
    const hist = Array.isArray(acc?.history) ? acc.history : [];
    count += hist.filter(h => h && h.type === 'post').length;
  }
  return count;
}

export function countTotalFollowers(gameState) {
  const sm = normalizeSocialMediaState(gameState?.socialMedia);
  let total = 0;
  for (const acc of Object.values(sm.accounts || {})) {
    total += safeNum(acc?.followers, 0);
  }
  return total;
}

export function hasAnyMonetizedAccount(gameState) {
  const sm = normalizeSocialMediaState(gameState?.socialMedia);
  return Object.values(sm.accounts || {}).some(acc => Boolean(acc?.active) && Boolean(acc?.monetized));
}

export function hasAnyVerifiedAccount(gameState) {
  const sm = normalizeSocialMediaState(gameState?.socialMedia);
  return Object.values(sm.accounts || {}).some(acc => Boolean(acc?.active) && Boolean(acc?.verified));
}

export function getMaxPetBond(gameState) {
  const pets = Array.isArray(gameState?.pets) ? gameState.pets : [];
  let max = 0;
  for (const p of pets) {
    max = Math.max(max, safeNum(p?.bond, 0));
  }
  return max;
}

export function getObjectiveProgress(gameState, obj) {
  const gs = gameState || {};
  const type = obj?.type;

  const done = (current, target, comparator = '>=') => {
    if (comparator === '<=') return safeNum(current) <= safeNum(target);
    return safeNum(current) >= safeNum(target);
  };

  switch (type) {
    case 'ACTION_COUNT_AT_LEAST': {
      const actionId = String(obj?.actionId || '');
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.actionUsageCounts?.[actionId], 0);
      return { type, label: `${actionId}`, current: cur, target, done: done(cur, target) };
    }

    case 'STAT_AT_LEAST': {
      const stat = String(obj?.stat || '');
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.stats?.[stat], 0);
      return { type, label: stat, current: cur, target, done: done(cur, target) };
    }

    case 'LOVE_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.love, 0);
      return { type, label: 'Love', current: cur, target, done: done(cur, target) };
    }

    case 'STRESS_AT_MOST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.stress, 0);
      return { type, label: 'Stress', current: cur, target, done: done(cur, target, '<=') };
    }

    case 'PLAYER_HEALTH_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.playerHealth, 0);
      return { type, label: 'Parent Health', current: cur, target, done: done(cur, target) };
    }

    case 'TEACHER_TRUST_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.teacherTrust, 0);
      return { type, label: 'Teacher Trust', current: cur, target, done: done(cur, target) };
    }

    case 'PEER_CIRCLE_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.peerCircle, 0);
      return { type, label: 'Peer Circle', current: cur, target, done: done(cur, target) };
    }

    case 'PASSPORT_STAMPS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = Array.isArray(gs?.passportStamps) ? gs.passportStamps.length : 0;
      return { type, label: 'Passport stamps', current: cur, target, done: done(cur, target) };
    }

    case 'MODULES_STUDIED_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = Array.isArray(gs?.studiedItems) ? gs.studiedItems.length : 0;
      return { type, label: 'Modules studied', current: cur, target, done: done(cur, target) };
    }

    case 'INVENTORY_ITEMS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = Array.isArray(gs?.inventory?.items) ? gs.inventory.items.length : 0;
      return { type, label: 'Inventory items', current: cur, target, done: done(cur, target) };
    }

    case 'MONEY_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.money, 0);
      return { type, label: 'Cash', current: cur, target, done: done(cur, target) };
    }

    case 'RETIREMENT_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.retirementSavings, 0);
      return { type, label: 'Retirement', current: cur, target, done: done(cur, target) };
    }

    case 'PETS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = Array.isArray(gs?.pets) ? gs.pets.length : 0;
      return { type, label: 'Pets', current: cur, target, done: done(cur, target) };
    }

    case 'PET_BOND_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = getMaxPetBond(gs);
      return { type, label: 'Best pet bond', current: cur, target, done: done(cur, target) };
    }

    case 'CULTURE_PLAN_SET': {
      const cur = Boolean(gs?.culturePlan);
      return { type, label: 'Culture plan', current: cur ? 1 : 0, target: 1, done: cur };
    }

    case 'CULTURE_POINTS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.cultureStats?.pointsTotal, 0);
      return { type, label: 'Culture points', current: cur, target, done: done(cur, target) };
    }

    case 'CULTURE_STREAK_WEEKS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.cultureStats?.streakWeeks, 0);
      return { type, label: 'Culture streak (weeks)', current: cur, target, done: done(cur, target) };
    }

    case 'WISDOM_XP_AT_LEAST': {
      const lensId = String(obj?.lensId || '');
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.wisdom?.xp?.[lensId], 0);
      return { type, label: `${lensId} XP`, current: cur, target, done: done(cur, target) };
    }

    case 'WISDOM_CLARITY_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.wisdom?.clarity, 0);
      return { type, label: 'Clarity', current: cur, target, done: done(cur, target) };
    }

    case 'SOCIAL_POSTS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = countTotalSocialPosts(gs);
      return { type, label: 'Social posts', current: cur, target, done: done(cur, target) };
    }

    case 'SOCIAL_FOLLOWERS_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = countTotalFollowers(gs);
      return { type, label: 'Followers', current: cur, target, done: done(cur, target) };
    }

    case 'SOCIAL_VERIFIED_ANY': {
      const cur = hasAnyVerifiedAccount(gs);
      return { type, label: 'Verified account', current: cur ? 1 : 0, target: 1, done: cur };
    }

    case 'SOCIAL_MONETIZED_ANY': {
      const cur = hasAnyMonetizedAccount(gs);
      return { type, label: 'Monetized account', current: cur ? 1 : 0, target: 1, done: cur };
    }

    case 'CAREER_LEVEL_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const career = normalizePlayerCareer(gs?.playerCareer, gs);
      const cur = safeNum(career?.jobLevelIndex, 0);
      return { type, label: 'Career level', current: cur, target, done: done(cur, target) };
    }

    case 'CAREER_INCOME_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const career = normalizePlayerCareer(gs?.playerCareer, gs);
      const cur = safeNum(career?.yearlyIncome, 0);
      return { type, label: 'Yearly income', current: cur, target, done: done(cur, target) };
    }

    case 'CAREER_NETWORKING_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const career = normalizePlayerCareer(gs?.playerCareer, gs);
      const cur = safeNum(career?.networking, 0);
      return { type, label: 'Networking', current: cur, target, done: done(cur, target) };
    }

    case 'REACH_AGE_AT_LEAST': {
      const target = safeNum(obj?.target, 0);
      const cur = safeNum(gs?.currentYear, 0);
      return { type, label: 'Child age', current: cur, target, done: done(cur, target) };
    }

    case 'FLAG_TRUE': {
      const path = String(obj?.path || '');
      const cur = Boolean(getByPath(gs, path));
      return { type, label: path || 'flag', current: cur ? 1 : 0, target: 1, done: cur };
    }

    default:
      return { type: type || 'UNKNOWN', label: 'Unknown objective', current: 0, target: 1, done: false };
  }
}

export function getChallengeProgress(gameState, challengeDef) {
  const objectives = (challengeDef?.objectives || []).map(obj => getObjectiveProgress(gameState, obj));
  const done = objectives.length > 0 && objectives.every(o => Boolean(o.done));
  const total = objectives.length || 1;
  const completed = objectives.filter(o => o.done).length;
  const pct = Math.round((completed / total) * 100);
  return { done, pct, objectives };
}

export function isChallengeComplete(gameState, challengeDef) {
  return Boolean(getChallengeProgress(gameState, challengeDef).done);
}