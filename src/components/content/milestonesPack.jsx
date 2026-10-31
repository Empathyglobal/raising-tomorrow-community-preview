// Milestones Pack v2 - Deterministic large pools + new metrics
// Exports: MILESTONE_AGES, statToPoints, getAdultAge, pickMilestoneQuests, checkQuestProgress

import {
  isKidQuestAlignedWithGoals,
  isAdultQuestAlignedWithGoals,
  getAlignedGoalIdsForQuest
} from "@/components/content/lifeGoalsPack";

export const MILESTONE_AGES = [0, 3, 6, 11, 14];

// Display formatter only (no weird scaling)
export function statToPoints(x) {
  const v = Number(x) || 0;
  return Math.round(v * 10) / 10;
}

export function getAdultAge(state) {
  return (Number(state.parentAgeAtBirth ?? 28) + Number(state.currentYear ?? 0)) || 28;
}

// Local deterministic RNG (no imports from GameStateContext to avoid cycles)
function hashString(str) {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seedStr) {
  const rng = mulberry32(hashString(seedStr || 'seed'));
  return {
    next: () => rng(),
    pick: (arr) => (Array.isArray(arr) && arr.length ? arr[Math.floor(rng() * arr.length)] : null),
    shuffle: (arr) => {
      const a = Array.isArray(arr) ? [...arr] : [];
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
  };
}

// Helpers used by progress evaluators
function ownHome(state) {
  try {
    if (Array.isArray(state?.inventory?.items) && state.inventory.items.some(i => i.uniqueGroup === 'home')) return true;
    if (Array.isArray(state?.realEstate?.properties) && state.realEstate.properties.length > 0) return true;
  } catch {}
  return false;
}
function hasRenting(state) {
  try {
    const props = state?.realEstate?.properties || [];
    return props.some(p => p?.rented || p?.tenant || (Number(p?.rent) > 0));
  } catch {}
  return false;
}
function totalFollowers(state) {
  try {
    const accs = state?.socialMedia?.accounts || {};
    return Object.values(accs).reduce((s, a) => s + (Number(a?.followers) || 0), 0);
  } catch { return 0; }
}

// Progress evaluators
export function checkQuestProgress(quest, state, baseline) {
  if (!quest) return { done: false, value: 0, target: 0 };
  const gs = state || {};
  const stats = gs?.stats || {};
  const money = Number(gs?.money || 0);
  const love = Number(gs?.love || 0);
  const stress = Number(gs?.stress || 0);
  const adultAge = getAdultAge(gs);

  const base = baseline || {};
  const baseStats = base.stats || {};

  // Existing helpers kept working
  switch (quest.metric?.type) {
    case 'stat_threshold': {
      const v = Number(stats[quest.metric.statKey] || 0);
      return { done: v >= Number(quest.targetValue || 0), value: v, target: Number(quest.targetValue || 0) };
    }
    case 'money_increase': {
      const baseMoney = Number(base.money || 0);
      const inc = money - baseMoney;
      return { done: inc >= Number(quest.metric.increaseBy || 0), value: inc, target: Number(quest.metric.increaseBy || 0) };
    }
    case 'money_total': {
      return { done: money >= Number(quest.metric.targetAmount || 0), value: money, target: Number(quest.metric.targetAmount || 0) };
    }
    case 'career_progress': {
      const baseIncome = Number(base.yearlyIncome || 0);
      const nowIncome = Number(gs?.playerCareer?.yearlyIncome || 0);
      const levelUp = (Number(gs?.playerCareer?.jobLevelIndex || 0) > Number(base.jobLevelIndex || 0));
      const incomeOk = (nowIncome - baseIncome) >= Number(quest.metric.incomeIncrease || 0);
      const ok = quest.metric.levelUp ? (incomeOk || levelUp) : incomeOk;
      return { done: ok, value: nowIncome - baseIncome, target: Number(quest.metric.incomeIncrease || 0) };
    }
    case 'buy_and_rent_house': {
      const ok = ownHome(gs) && hasRenting(gs);
      if (!ok && quest.fallbackMetric) {
        // Evaluate fallback too
        const fm = quest.fallbackMetric;
        if (fm.type === 'money_total') {
          const ok2 = money >= Number(fm.targetAmount || 0);
          return { done: ok2, value: money, target: Number(fm.targetAmount || 0) };
        }
      }
      return { done: ok, value: ok ? 1 : 0, target: 1 };
    }
    case 'own_house_and_cash': {
      const ok = ownHome(gs) && money >= Number(quest.metric.cashAmount || 0);
      if (!ok && !ownHome(gs)) {
        const fallbackOk = money >= Math.max(150000, Number(quest.metric.cashAmount || 0));
        return { done: fallbackOk, value: money, target: Math.max(150000, Number(quest.metric.cashAmount || 0)) };
      }
      return { done: ok, value: money, target: Number(quest.metric.cashAmount || 0) };
    }

    // NEW KID
    case 'stat_increase': {
      const key = quest.metric.statKey;
      const v = Number(stats[key] || 0);
      const baseV = Number(baseStats[key] || 0);
      const delta = v - baseV;
      const inc = Number(quest.metric.increaseBy || 0);
      return { done: delta >= inc, value: delta, target: inc };
    }
    case 'stat_below': {
      const key = quest.metric.statKey;
      const v = Number(stats[key] || 0);
      const thr = Number(quest.metric.threshold || 0);
      return { done: v <= thr, value: v, target: thr };
    }

    // NEW ADULT
    case 'love_increase': {
      const baseLove = Number(base.love ?? love);
      const delta = love - baseLove;
      const inc = Number(quest.metric.increaseBy || 0);
      return { done: delta >= inc, value: delta, target: inc };
    }
    case 'stress_below': {
      const thr = Number(quest.metric.threshold || 0);
      return { done: stress <= thr, value: stress, target: thr };
    }
    case 'social_followers_total': {
      const total = totalFollowers(gs);
      const tgt = Number(quest.metric.targetFollowers || 0);
      return { done: total >= tgt, value: total, target: tgt };
    }
    case 'passport_stamps_count': {
      const cnt = (gs.passportStamps?.length || 0);
      const tgt = Number(quest.metric.count || 0);
      return { done: cnt >= tgt, value: cnt, target: tgt };
    }
    case 'pets_count': {
      const cnt = (gs.pets?.length || 0);
      const tgt = Number(quest.metric.count || 0);
      return { done: cnt >= tgt, value: cnt, target: tgt };
    }
    case 'bookshelf_count': {
      const cnt = (gs.bookshelf?.length || 0);
      const tgt = Number(quest.metric.count || 0);
      return { done: cnt >= tgt, value: cnt, target: tgt };
    }

    // NEW METRIC TYPES
    case 'business_started': {
      const started = Boolean(gs.businessAttempted);
      return { done: started, value: started ? 1 : 0, target: 1 };
    }
    case 'business_income_per_year': {
      const income = Number(gs.businessIncomePerYear || 0);
      const tgt = Number(quest.metric.targetIncome || 0);
      return { done: income >= tgt, value: income, target: tgt };
    }
    case 'politics_office_held': {
      const held = Boolean(gs.politics?.currentOfficeId);
      return { done: held, value: held ? 1 : 0, target: 1 };
    }
    case 'politics_approval_threshold': {
      const approval = Number(gs.politics?.approval || 0);
      const thr = Number(quest.metric.threshold || 0);
      return { done: approval >= thr, value: approval, target: thr };
    }
    case 'politics_warchest_total': {
      const chest = Number(gs.politics?.warChest || 0);
      const tgt = Number(quest.metric.targetAmount || 0);
      return { done: chest >= tgt, value: chest, target: tgt };
    }
    case 'donations_total': {
      const total = Number(gs.donationProgress?.total || 0);
      const tgt = Number(quest.metric.count || 0);
      return { done: total >= tgt, value: total, target: tgt };
    }
    case 'study_points_total': {
      const points = Number(gs.studyPoints || 0);
      const tgt = Number(quest.metric.points || 0);
      return { done: points >= tgt, value: points, target: tgt };
    }
    case 'adult_crime_record_below': {
      const record = Number(gs.adultCrime?.record || 0);
      const thr = Number(quest.metric.threshold || 0);
      return { done: record <= thr, value: record, target: thr };
    }
    case 'adult_crime_heat_below': {
      const heat = Number(gs.adultCrime?.heat || 0);
      const thr = Number(quest.metric.threshold || 0);
      return { done: heat <= thr, value: heat, target: thr };
    }
    case 'adult_crime_skill_threshold': {
      const skill = Number(gs.adultCrime?.skill || 0);
      const thr = Number(quest.metric.threshold || 0);
      return { done: skill >= thr, value: skill, target: thr };
    }
    case 'adult_crime_crew_threshold': {
      const crew = Number(gs.adultCrime?.crew || 0);
      const thr = Number(quest.metric.threshold || 0);
      return { done: crew >= thr, value: crew, target: thr };
    }
    case 'game_shelf_count': {
      const cnt = (Array.isArray(gs.gameShelf) ? gs.gameShelf.length : 0);
      const tgt = Number(quest.metric.count || 0);
      return { done: cnt >= tgt, value: cnt, target: tgt };
    }

    default:
      return { done: false, value: 0, target: 0 };
  }
}

// Pools
const STAT_KEYS = [
  'confidence','intelligence','empathy','discipline','happiness','creativity','curiosity','responsibility','knowledge','health','social','fitness'
];
const STAT_TITLES = {
  confidence: '⭐ Confidence Arc Activated',
  intelligence: '🧠 Brain Bootloader',
  empathy: '💞 Empathy Upgrade',
  discipline: '🧱 Self-Control Quest',
  happiness: '😊 Joy Engine Online',
  creativity: '🎨 Messy Genius Mode',
  curiosity: '🔍 Curiosity is a Superpower',
  responsibility: '🧹 Responsible-ish',
  knowledge: '📚 Fact Collector',
  health: '🍎 Health Powerup',
  social: '🗣️ Social XP',
  fitness: '🏃 Movement Matters'
};
function statBody(statKey, deadlineAge) {
  const A = deadlineAge;
  const lines = {
    confidence: `By age ${A}, they should walk into rooms like they pay rent (figuratively).`,
    intelligence: `By age ${A}, those neurons should be doing cartwheels.`,
    empathy: `By age ${A}, they should notice feelings without a neon sign.`,
    discipline: `By age ${A}, impulse control should exist outside mythology.`,
    happiness: `By age ${A}, joy should show up more days than not.`,
    creativity: `By age ${A}, sensible chaos should live in their art drawer.`,
    curiosity: `By age ${A}, questions should outnumber answers by a lot.`,
    responsibility: `By age ${A}, chores shouldn’t require a TED Talk.`,
    knowledge: `By age ${A}, trivia night fear should be lower.`,
    health: `By age ${A}, sleep and greens win sometimes.`,
    social: `By age ${A}, they should have a friend or two that’s not a lizard.`,
    fitness: `By age ${A}, moving their body shouldn’t feel like a plot twist.`
  };
  return lines[statKey] || `Grow ${statKey} by age ${A}.`;
}

function buildKidPool(milestoneAge) {
  const map = {
    0: { inc: 3, deadline: 3 },
    3: { inc: 3, deadline: 6 },
    6: { inc: 4, deadline: 11 },
    11: { inc: 3, deadline: 14 },
    14: { inc: 4, deadline: 18 }
  };
  const conf = map[milestoneAge] || { inc: 3, deadline: milestoneAge + 3 };
  
  // 30 Kid Quests
  return [
    { id: 'kid_confidence_arc', track: 'kid', title: '⭐ Confidence Arc', body: `By age ${conf.deadline}, they walk into rooms like they pay rent.`, metric: { type: 'stat_increase', statKey: 'confidence', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { confidence: 1 } }, shareLine: 'They now walk into rooms like they pay rent.' },
    { id: 'kid_brain_boot', track: 'kid', title: '🧠 Brain Bootloader', body: `By age ${conf.deadline}, neurons should be doing cartwheels.`, metric: { type: 'stat_increase', statKey: 'intelligence', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { intelligence: 1 } }, shareLine: 'Facts stick like velcro now.' },
    { id: 'kid_empathy_up', track: 'kid', title: '💞 Empathy Upgrade', body: `By age ${conf.deadline}, they notice feelings without a neon sign.`, metric: { type: 'stat_increase', statKey: 'empathy', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { empathy: 1 } }, shareLine: 'They noticed someone else was sad—unprompted.' },
    { id: 'kid_discipline_quest', track: 'kid', title: '🧱 Self-Control Quest', body: `By age ${conf.deadline}, impulse control exists outside mythology.`, metric: { type: 'stat_increase', statKey: 'discipline', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { discipline: 1 } }, shareLine: 'They waited their turn without a meltdown.' },
    { id: 'kid_joy_engine', track: 'kid', title: '😊 Joy Engine Online', body: `By age ${conf.deadline}, joy shows up more days than not.`, metric: { type: 'stat_increase', statKey: 'happiness', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { happiness: 1 } }, shareLine: 'They giggled at breakfast for no reason. You loved it.' },
    { id: 'kid_messy_genius', track: 'kid', title: '🎨 Messy Genius Mode', body: `By age ${conf.deadline}, creative chaos lives in their art drawer.`, metric: { type: 'stat_increase', statKey: 'creativity', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { creativity: 1 } }, shareLine: 'Their ideas are weird—and wonderful.' },
    { id: 'kid_curiosity_power', track: 'kid', title: '🔍 Curiosity is a Superpower', body: `By age ${conf.deadline}, questions outnumber answers by a lot.`, metric: { type: 'stat_increase', statKey: 'curiosity', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { curiosity: 1 } }, shareLine: 'They asked 47 questions today. You answered 46.' },
    { id: 'kid_responsible_ish', track: 'kid', title: '🧹 Responsible-ish', body: `By age ${conf.deadline}, chores don't require a TED Talk.`, metric: { type: 'stat_increase', statKey: 'responsibility', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { responsibility: 1 } }, shareLine: 'They cleared their plate without being asked.' },
    { id: 'kid_fact_collector', track: 'kid', title: '📚 Fact Collector', body: `By age ${conf.deadline}, trivia night fear is lower.`, metric: { type: 'stat_increase', statKey: 'knowledge', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { knowledge: 1 } }, shareLine: 'They schooled you on space facts.' },
    { id: 'kid_health_power', track: 'kid', title: '🍎 Health Powerup', body: `By age ${conf.deadline}, sleep and greens win sometimes.`, metric: { type: 'stat_increase', statKey: 'health', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { health: 1 } }, shareLine: 'They chose fruit over candy. Voluntarily.' },
    { id: 'kid_social_xp', track: 'kid', title: '🗣️ Social XP', body: `By age ${conf.deadline}, they have a friend that's not a lizard.`, metric: { type: 'stat_increase', statKey: 'social', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { social: 1 } }, shareLine: 'They made a friend—and kept them.' },
    { id: 'kid_movement_matters', track: 'kid', title: '🏃 Movement Matters', body: `By age ${conf.deadline}, moving their body isn't a plot twist.`, metric: { type: 'stat_increase', statKey: 'fitness', increaseBy: conf.inc }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { fitness: 1 } }, shareLine: 'They ran around outside and loved it.' },
    
    // Anxiety reversal
    { id: 'kid_anxiety_low', track: 'kid', title: '🌊 Calm Seas', body: `By age ${conf.deadline}, anxiety stays below 8 points.`, metric: { type: 'stat_below', statKey: 'anxiety', threshold: 8 }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 3, stats: { confidence: 1 } }, shareLine: 'They feel calmer and it shows.' },
    
    // Multi-stat combos
    { id: 'kid_brave_kind', track: 'kid', title: '💪 Brave & Kind Combo', body: `By age ${conf.deadline}, boost confidence AND empathy.`, metric: { type: 'stat_increase', statKey: 'confidence', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { confidence: 1, empathy: 1 } }, shareLine: 'Brave and kind—rare combo unlocked.' },
    { id: 'kid_smart_happy', track: 'kid', title: '🧠😊 Smart & Happy Arc', body: `By age ${conf.deadline}, intelligence grows but joy stays.`, metric: { type: 'stat_increase', statKey: 'intelligence', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { intelligence: 1, happiness: 1 } }, shareLine: 'Smart and still smiling—rare win.' },
    { id: 'kid_creative_disciplined', track: 'kid', title: '🎨🧱 Creative Discipline', body: `By age ${conf.deadline}, creativity meets follow-through.`, metric: { type: 'stat_increase', statKey: 'creativity', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { creativity: 1, discipline: 1 } }, shareLine: 'Wild ideas—and the patience to finish them.' },
    { id: 'kid_fit_social', track: 'kid', title: '🏃🗣️ Active Friend', body: `By age ${conf.deadline}, movement and friendship both grow.`, metric: { type: 'stat_increase', statKey: 'fitness', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { fitness: 1, social: 1 } }, shareLine: 'They made friends on the playground.' },
    { id: 'kid_curious_knowledge', track: 'kid', title: '🔍📚 Curiosity Leads Knowledge', body: `By age ${conf.deadline}, questions turn into facts.`, metric: { type: 'stat_increase', statKey: 'curiosity', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { curiosity: 1, knowledge: 1 } }, shareLine: 'They looked it up themselves.' },
    
    // Behavioral milestones
    { id: 'kid_first_sleepover', track: 'kid', title: '🛏️ First Sleepover Success', body: `By age ${conf.deadline}, boost social by hosting or attending.`, metric: { type: 'stat_increase', statKey: 'social', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { social: 1, confidence: 1 } }, shareLine: 'Sleepover success—no midnight panic calls.' },
    { id: 'kid_independence_wins', track: 'kid', title: '🎒 Independence Wins', body: `By age ${conf.deadline}, boost responsibility by letting go.`, metric: { type: 'stat_increase', statKey: 'responsibility', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { responsibility: 1, confidence: 1 } }, shareLine: 'They handled it—without you hovering.' },
    { id: 'kid_homework_flow', track: 'kid', title: '📝 Homework Flow State', body: `By age ${conf.deadline}, discipline grows without daily battles.`, metric: { type: 'stat_increase', statKey: 'discipline', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { discipline: 1, intelligence: 1 } }, shareLine: 'Homework happened without a war.' },
    { id: 'kid_kindness_streak', track: 'kid', title: '💝 Kindness Streak', body: `By age ${conf.deadline}, empathy becomes visible action.`, metric: { type: 'stat_increase', statKey: 'empathy', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 3, stats: { empathy: 1 } }, shareLine: 'They shared without being asked.' },
    { id: 'kid_brave_moment', track: 'kid', title: '🦁 Brave Moment Unlocked', body: `By age ${conf.deadline}, confidence defeats one fear.`, metric: { type: 'stat_increase', statKey: 'confidence', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 3, stats: { confidence: 1 } }, shareLine: 'They did the scary thing—and survived.' },
    { id: 'kid_creative_explosion', track: 'kid', title: '💥 Creative Explosion', body: `By age ${conf.deadline}, messy art becomes real expression.`, metric: { type: 'stat_increase', statKey: 'creativity', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { creativity: 1, happiness: 1 } }, shareLine: 'Art happened everywhere—and it was beautiful.' },
    { id: 'kid_nature_connection', track: 'kid', title: '🌳 Nature Connection', body: `By age ${conf.deadline}, outdoor time becomes healing.`, metric: { type: 'stat_increase', statKey: 'health', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { health: 1, happiness: 1 } }, shareLine: 'They asked to go outside.' },
    { id: 'kid_reading_wins', track: 'kid', title: '📖 Reading Wins', body: `By age ${conf.deadline}, books become a choice—not a chore.`, metric: { type: 'stat_increase', statKey: 'knowledge', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { knowledge: 1, curiosity: 1 } }, shareLine: 'They picked a book for fun.' },
    { id: 'kid_teamwork_unlock', track: 'kid', title: '🤝 Teamwork Unlocked', body: `By age ${conf.deadline}, social skills turn into actual friendships.`, metric: { type: 'stat_increase', statKey: 'social', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { social: 1, empathy: 1 } }, shareLine: "Group projects didn't end in chaos." },
    { id: 'kid_morning_routine', track: 'kid', title: '⏰ Morning Routine Hero', body: `By age ${conf.deadline}, mornings happen with less crying.`, metric: { type: 'stat_increase', statKey: 'discipline', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { discipline: 1, responsibility: 1 } }, shareLine: 'They got ready without seventeen reminders.' },
    { id: 'kid_sleep_champion', track: 'kid', title: '😴 Sleep Champion', body: `By age ${conf.deadline}, bedtime doesn't require negotiation.`, metric: { type: 'stat_increase', statKey: 'health', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { health: 1 } }, shareLine: "They slept through the night—peacefully." },
    { id: 'kid_explorer_mode', track: 'kid', title: '🗺️ Explorer Mode', body: `By age ${conf.deadline}, curiosity turns into adventure.`, metric: { type: 'stat_increase', statKey: 'curiosity', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { curiosity: 1, fitness: 1 } }, shareLine: 'They wanted to explore—and you let them.' },
    { id: 'kid_problem_solver', track: 'kid', title: '🧩 Problem Solver Arc', body: `By age ${conf.deadline}, intelligence helps them figure stuff out.`, metric: { type: 'stat_increase', statKey: 'intelligence', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 2, stats: { intelligence: 1, confidence: 1 } }, shareLine: 'They solved it without asking for help first.' },
    { id: 'kid_emotion_coach', track: 'kid', title: '🎭 Emotion Coach', body: `By age ${conf.deadline}, they name what they feel.`, metric: { type: 'stat_increase', statKey: 'empathy', increaseBy: Math.max(2, conf.inc - 1) }, startChildAge: milestoneAge, deadlineChildAge: conf.deadline, reward: { love: 3, stats: { empathy: 1 } }, shareLine: 'They said "I feel frustrated" instead of screaming.' }
  ];
}

function buildAdultPool(state, milestoneAge) {
  const gs = state || {};
  const mAge = Number(milestoneAge ?? 0);
  const adultAge = getAdultAge(gs);
  const deadlineByAge = {
    0: Math.max(40, adultAge + 10),
    3: adultAge + 7,
    6: adultAge + 7,
    11: adultAge + 6,
    14: adultAge + 4
  };
  const deadlineAdultAge = deadlineByAge[mAge] || (adultAge + 5);

  // 30 Adult Quests
  return [
    { id: 'adult_career_glow', track: 'adult', title: '📈 Glow-Up Season', body: 'A quiet plan, a louder paycheck.', metric: { type: 'career_progress', incomeIncrease: 15000, levelUp: true }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -1, money: 2000 }, shareLine: 'Promotion landed—and it felt earned.' },
    { id: 'adult_find_margin', track: 'adult', title: '💵 Find the Margin', body: 'Small levers, boring wins.', metric: { type: 'money_increase', increaseBy: 10000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -1 }, shareLine: 'Money grew without drama.' },
    { id: 'adult_freedom_fund', track: 'adult', title: '🧾 Freedom Fund', body: 'Not an emergency fund. A better-choices fund.', metric: { type: 'money_total', targetAmount: Math.max(50000, Number(gs.playerCareer?.yearlyIncome||0)) }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 2 }, shareLine: 'The safety net is real now.' },
    { id: 'adult_landlord_arc', track: 'adult', title: '🏠 Landlord Arc', body: 'Passive income, except for the phone calls.', metric: { type: 'buy_and_rent_house' }, fallbackMetric: { type: 'money_total', targetAmount: 100000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { money: 5000, stress: -2 }, shareLine: 'Rent checks arrive monthly.' },
    { id: 'adult_legacy_liquidity', track: 'adult', title: '🏡 Legacy + Liquidity', body: 'Own a place and stack some cash.', metric: { type: 'own_house_and_cash', cashAmount: 100000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { money: 10000 }, shareLine: 'Home + cash = actual security.' },
    { id: 'adult_accidental_influencer', track: 'adult', title: '📱 Accidental Influencer', body: 'Oops, people are watching.', metric: { type: 'social_followers_total', targetFollowers: 5000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 1 }, shareLine: 'The follower count is real.' },
    { id: 'adult_passport_stamps', track: 'adult', title: '✈️ Passport Stamp Addiction', body: 'Memories > things.', metric: { type: 'passport_stamps_count', count: 2 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -1 }, shareLine: 'Travel became a habit.' },
    { id: 'adult_pet_parent', track: 'adult', title: '🐾 Pet Parent Mode', body: 'Unconditional love. Conditional on snacks.', metric: { type: 'pets_count', count: 1 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 3, stress: -1 }, shareLine: 'The pet chose you too.' },
    { id: 'adult_bookstack', track: 'adult', title: '📚 Book Pile', body: 'The shelf is an art installation now.', metric: { type: 'bookshelf_count', count: 5 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stats: { knowledge: 1 } }, shareLine: 'Books piled up—and you read them.' },
    { id: 'adult_love_maxed', track: 'adult', title: '❤️ Love Meter Maxed', body: 'Consistency is romantic.', metric: { type: 'love_increase', increaseBy: 10 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -2 }, shareLine: 'The bond deepened quietly.' },
    { id: 'adult_zen_mode', track: 'adult', title: '🧘 Zen Mode Activated', body: 'Boundaries with your calendar.', metric: { type: 'stress_below', threshold: 25 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 2 }, shareLine: 'Stress stayed low—without forcing it.' },
    
    // Career variations
    { id: 'adult_double_income', track: 'adult', title: '💰 Double Down', body: 'Your income doubled—or close to it.', metric: { type: 'career_progress', incomeIncrease: 25000, levelUp: false }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -1, money: 3000 }, shareLine: 'Paychecks doubled. Life got easier.' },
    { id: 'adult_side_hustle_win', track: 'adult', title: '🛠️ Side Hustle Win', body: 'Extra income from something you built.', metric: { type: 'money_increase', increaseBy: 15000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -1, money: 1000 }, shareLine: 'The side gig paid off.' },
    { id: 'adult_emergency_ready', track: 'adult', title: '🚨 Emergency Ready', body: 'Six months of expenses—saved.', metric: { type: 'money_total', targetAmount: 30000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -2 }, shareLine: 'The safety net exists.' },
    { id: 'adult_investor_vibes', track: 'adult', title: '📊 Investor Vibes', body: 'Net worth crossed six figures.', metric: { type: 'money_total', targetAmount: 100000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 1, money: 5000 }, shareLine: 'Six figures—unlocked.' },
    
    // Love & Stress combos
    { id: 'adult_love_stress_balance', track: 'adult', title: '⚖️ Balance Unlocked', body: 'Love up, stress down—at the same time.', metric: { type: 'love_increase', increaseBy: 8 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -2, love: 2 }, shareLine: 'Love and calm—both present.' },
    { id: 'adult_stress_ceiling', track: 'adult', title: '🧊 Stress Ceiling', body: 'Keep stress under 30 points—consistently.', metric: { type: 'stress_below', threshold: 30 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 2, stress: -1 }, shareLine: 'Calm became the baseline.' },
    { id: 'adult_love_climb', track: 'adult', title: '💝 Love Climb', body: 'Build love by +15 points.', metric: { type: 'love_increase', increaseBy: 15 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -2, love: 3 }, shareLine: 'The relationship leveled up.' },
    
    // Collections & Lifestyle
    { id: 'adult_library_legend', track: 'adult', title: '📚 Library Legend', body: 'Ten books on the shelf—all studied.', metric: { type: 'bookshelf_count', count: 10 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stats: { knowledge: 2 } }, shareLine: 'Knowledge stacked quietly.' },
    { id: 'adult_travel_junkie', track: 'adult', title: '🌍 Travel Junkie', body: 'Five stamps—five memories.', metric: { type: 'passport_stamps_count', count: 5 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -2 }, shareLine: 'Wanderlust became a lifestyle.' },
    { id: 'adult_pet_squad', track: 'adult', title: '🐾 Pet Squad Goals', body: 'Two pets—double the chaos, double the love.', metric: { type: 'pets_count', count: 2 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 4, stress: -1 }, shareLine: 'The house feels fuller now.' },
    { id: 'adult_influencer_verified', track: 'adult', title: '✅ Influencer: Verified', body: '10K followers—blue checkmark energy.', metric: { type: 'social_followers_total', targetFollowers: 10000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 2, money: 2000 }, shareLine: 'You got verified—and it mattered.' },
    { id: 'adult_micro_famous', track: 'adult', title: '🎤 Micro-Famous Arc', body: 'People recognize you now.', metric: { type: 'social_followers_total', targetFollowers: 25000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 1, money: 5000 }, shareLine: 'Strangers know your name.' },
    
    // Real Estate variations
    { id: 'adult_property_empire', track: 'adult', title: '🏙️ Property Empire Started', body: 'Own and rent—passive income unlocked.', metric: { type: 'buy_and_rent_house' }, fallbackMetric: { type: 'money_total', targetAmount: 150000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { money: 8000, stress: -2 }, shareLine: 'Real estate became real income.' },
    { id: 'adult_homeowner_plus_cash', track: 'adult', title: '🏡 Homeowner + Cash Reserves', body: 'Own a home AND have $50K liquid.', metric: { type: 'own_house_and_cash', cashAmount: 50000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { money: 5000, stress: -1 }, shareLine: 'Stability feels real.' },
    { id: 'adult_mansion_flex', track: 'adult', title: '🏰 Mansion Flex', body: 'Own a home + $200K in reserves.', metric: { type: 'own_house_and_cash', cashAmount: 200000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { money: 15000 }, shareLine: 'Wealth became visible.' },
    
    // Wellness & Self
    { id: 'adult_self_care_streak', track: 'adult', title: '💆 Self-Care Streak', body: 'Keep stress under 20—you matter too.', metric: { type: 'stress_below', threshold: 20 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 3, stress: -1 }, shareLine: 'You protected your own peace.' },
    { id: 'adult_reset_master', track: 'adult', title: '🧘 Reset Master', body: 'Stress never crossed 35 points.', metric: { type: 'stress_below', threshold: 35 }, startAdultAge: adultAge, deadlineAdultAge, reward: { love: 2, stress: -2 }, shareLine: 'Calm was a choice—and you chose it.' },
    { id: 'adult_relationship_builder', track: 'adult', title: '💞 Relationship Builder', body: 'Love increased by +20 points.', metric: { type: 'love_increase', increaseBy: 20 }, startAdultAge: adultAge, deadlineAdultAge, reward: { stress: -3, love: 5 }, shareLine: 'The bond is unshakable now.' },
    { id: 'adult_wealth_runway', track: 'adult', title: '💎 Wealth Runway', body: 'Stack $250K and breathe easier.', metric: { type: 'money_total', targetAmount: 250000 }, startAdultAge: adultAge, deadlineAdultAge, reward: { money: 20000, stress: -2 }, shareLine: 'Financial stress is optional now.' },

    // Business
    { id: 'a_business_launch', track: 'adult', title: '🏗️ Launch a Business', body: 'Start a small business (even messy is fine). The point is: begin.', metric: { type: 'business_started' }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 6, reward: { money: 1500, stress: -1 }, shareLine: 'Your first business is live.' },
    { id: 'a_business_growth_5k', track: 'adult', title: '📦 Grow Your Business', body: 'Get your business to at least $5,000/year in income.', metric: { type: 'business_income_per_year', targetIncome: 5000 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 8, reward: { money: 2500, stress: -1 }, shareLine: 'Your business is turning real income.' },

    // Politics
    { id: 'a_politics_win_any', track: 'adult', title: '🗳️ Win an Election', body: 'Hold any political office (even small).', metric: { type: 'politics_office_held' }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 10, reward: { money: 2000, love: 2 }, shareLine: 'You hold office now.' },
    { id: 'a_politics_approval_65', track: 'adult', title: '📊 Keep Approval High', body: 'Maintain approval of 65 or higher.', metric: { type: 'politics_approval_threshold', threshold: 65 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 10, reward: { stress: -2, love: 1 }, shareLine: 'Your approval stayed strong.' },

    // Community / Donation
    { id: 'a_community_giver_5', track: 'adult', title: '🩸 Show Up for Others', body: 'Complete 5 total donations (blood/plasma).', metric: { type: 'donations_total', count: 5 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 8, reward: { stress: -2, love: 2 }, shareLine: 'You gave back five times.' },

    // Lifelong learner
    { id: 'a_lifelong_learner_10', track: 'adult', title: '📚 Keep Learning', body: 'Earn 10 study points by investing in your parenting skills.', metric: { type: 'study_points_total', points: 10 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 8, reward: { stress: -1, love: 1 }, shareLine: 'You invested in growing.' },

    // Crime arcs (both directions)
    { id: 'a_clean_record', track: 'adult', title: '🧾 Stay Clean', body: 'Keep your record spotless (record 0).', metric: { type: 'adult_crime_record_below', threshold: 0 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 8, reward: { stress: -1, love: 1 }, shareLine: 'Your record stayed clean.' },
    { id: 'a_underworld_skill_25', track: 'adult', title: '🕶️ Underworld Competence', body: 'Raise your crime skill to 25+ (if you\'re doing it, don\'t be sloppy).', metric: { type: 'adult_crime_skill_threshold', threshold: 25 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 8, reward: { money: 1500, stress: 1 }, shareLine: 'Your underworld reputation is solid.' },

    // Hobby: games
    { id: 'a_game_shelf_6', track: 'adult', title: '🎮 Build a Game Shelf', body: 'Collect 6 games (video games or board games) to make game night a real thing.', metric: { type: 'game_shelf_count', count: 6 }, startAdultAge: adultAge, deadlineAdultAge: adultAge + 10, reward: { stress: -2, love: 1 }, shareLine: 'Your game shelf is epic.' }
  ];
}

export function pickMilestoneQuests(state, milestoneAge) {
  const runSeed = state?.runSeed || 'seed';
  const rngKid = makeRng(`${runSeed}|milestones|${milestoneAge}|kid`);
  const rngAdult = makeRng(`${runSeed}|milestones|${milestoneAge}|adult`);

  const usedKid = new Set(((state?.milestones?.kidQuestHistory)||[]).map(q => q.id).concat(state?.milestones?.kidQuestActive?.id || []));
  const usedAdult = new Set(((state?.milestones?.adultQuestHistory)||[]).map(q => q.id).concat(state?.milestones?.adultQuestActive?.id || []));

  const kidPool = buildKidPool(milestoneAge);
  const adultPool = buildAdultPool(state, milestoneAge);

  const kidChoices = rngKid.shuffle(kidPool).filter(q => !usedKid.has(q.id));
  const adultChoices = rngAdult.shuffle(adultPool).filter(q => !usedAdult.has(q.id));

  // Life Goals integration: pick randomly among aligned quests
  const goalIds = Array.isArray(state?.lifeGoals?.selectedIds) ? state.lifeGoals.selectedIds : [];
  
  const kidAligned = goalIds.length ? kidChoices.filter(q => isKidQuestAlignedWithGoals(q, goalIds)) : [];
  const adultAligned = goalIds.length ? adultChoices.filter(q => isAdultQuestAlignedWithGoals(q, goalIds)) : [];

  const kid = kidAligned.length ? rngKid.pick(kidAligned) : (kidChoices[0] || rngKid.pick(kidPool) || null);
  const adult = adultAligned.length ? rngAdult.pick(adultAligned) : (adultChoices[0] || rngAdult.pick(adultPool) || null);

  // Attach aligned goal IDs for UI display/feedback
  if (kid && goalIds.length) {
    kid.alignedGoalIds = getAlignedGoalIdsForQuest(kid, goalIds, 'kid');
  }
  if (adult && goalIds.length) {
    adult.alignedGoalIds = getAlignedGoalIdsForQuest(adult, goalIds, 'adult');
  }

  return { kid, adult };
}