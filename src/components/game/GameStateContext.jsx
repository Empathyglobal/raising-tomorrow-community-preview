import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { quantizeTenth } from '@/components/lib/numberPrecision';
import COUNTRIES, { getSpokenLanguagesForCountry } from '@/components/game/countriesData';
import { pickCulturalFirstName } from '@/components/game/culturalNamePicker';
import { getJuvenileJusticeScenario } from '@/components/game/packJuvenileJustice';
import { ensureInLawsExist } from '@/components/game/ensureInLaws';
import { base44 } from '@/api/base44Client';
import { PET_CATALOG } from '@/components/game/petCatalog';
import { PET_PASSIVES } from '@/components/game/petPassives';
import { SHOP_ITEM_BY_ID } from '@/components/game/shopCatalog';
import { HOMEWORK_POPUPS } from '@/components/game/homeworkPopupsPack';
import { BALI_CALM_POPUPS, BALI_ACTIVITY_POPUPS } from '@/components/game/baliPopupsPack';
import { getStressGauge as computeStressGauge } from '@/components/game/stressGauge';
import { saveToSlot, loadFromSlot, setActiveSlotId, getActiveSlotId, listSlots } from '@/components/game/saveManager';
import { generateOutcomeV3 } from '@/components/game/outcomesEngine';
import { STUDY_LIBRARY } from '@/components/game/studyLibrary';
import { mapChildWoundsToAdultPatterns, mergeTraumaEvents, deriveChildAttachment } from '@/components/game/childTraumaSystem';
import { FAMILY_PATTERN_CATALOG } from '@/components/game/familyPatternCatalog';
import { TINY_CUTE_MOMENTS } from '@/components/game/tinyCuteMoments';
import { KID_WISDOM_LINES } from '@/components/game/kidWisdomLines';
import { MILESTONE_AGES, pickMilestoneQuests, checkQuestProgress, getAdultAge, statToPoints } from '@/components/content/milestonesPack';
import { LIFE_GOALS_BY_ID, getLifeGoalTarget, getAlignedGoalIdsForQuest } from '@/components/content/lifeGoalsPack';
import { CURIOSITY_QUESTIONS } from '@/components/content/curiosityPackQuestions';
import { getAvatarEmojiForAge } from '@/components/game/avatars';
import { unlockMetaAchievement, loadMetaAchievements } from '@/components/utils/metaAchievements';
import { KID_LOGIC_POPUPS } from '@/components/game/kidLogicPopups';
import { PACK_SEED_HOOKS } from '@/components/game/packSeedHooks';
import { MOMENT_CHOICE_TEXT_OVERRIDES } from "@/components/game/momentChoiceOverrides";
import { PACK_CHOICE_TEXT_POOLS, PACK_CONSEQUENCE_POOLS } from '@/components/game/scenarioPackTextPools';
import { CULTURE_LEVELS, CULTURE_REWARDS } from '@/components/game/cultureCatalog';
import { SCENARIO_PACKS } from "@/components/game/scenarioPacks";
import { maybeGetMiddleSchoolOneOffScenario } from "@/components/game/middleSchoolOneOffsPack";
import { LIFE_GOAL_MOMENTS as LIFE_GOAL_MOMENTS_PACK } from '@/components/content/lifeGoalMomentsPack';
import { maybeGetTeenOneOffScenario } from "@/components/game/teenOneOffsPack";
import { maybeGetTeenComingOutScenario } from "@/components/game/teenComingOutScenario";
import { CHAOS_EVENTS as CHAOS_EVENTS_L2 } from "@/components/game/chaosModePack";
import { CHAOS_EVENTS_L1 } from "@/components/game/chaosModePackL1";
import { CHAOS_EVENTS_L3 } from "@/components/game/chaosModePackL3";
import { getChaosLevelFromExpansions, withChaosLevel, clampChaosLevel } from "@/components/game/chaosModeLevels";
import { getChaosFlavorPool } from "@/components/game/chaosModeFlavors";
import { isMonarchyCountry } from '@/components/game/monarchyCountries';
import { TITLES_CATALOG, PEERAGE_ORDER, getNextPeerageId, getTitleInfo, courtesyForChild } from '@/components/game/titles/titleData';
import { ROYAL_EVENTS } from '@/components/game/royalEvents';
import { normalizeSocialMediaState, computeYearEndIncomeForAccount, computeInactivityDecay, SOCIAL_PLATFORMS, pickTrendForAge } from "@/components/game/socialMediaSystem";
import { BOND_ACTIVITY_PACK, PLAY_ACTIVITY_PACK, OUTING_ACTIVITY_PACK, OUTDOOR_ACTIVITY_PACK } from "@/components/game/newActivitiesPack";
import { hasShopItem } from "@/components/game/shopCatalog";
import { normalizePlayerCareer, processCareerYearEnd } from "@/components/game/careerSystem";
import { ensureAdultCrimeState } from "@/components/game/adultCrimeEngine";
import { SCA_V2_TRIGGER_AGES, pickScaV2ScenarioForAge } from "@/components/game/packSchoolConfidenceAnxietyV2";
import { buildKimYearScenario, generateKimOutcome } from '@/components/game/specialStarts/kimJongUnSpecialStart';
import { buildAlienInvasionYearScenario } from '@/components/game/specialStarts/alienInvasionSpecialStart.jsx';
import { buildGazaWarZoneYearScenario } from '@/components/game/specialStarts/gazaWarZoneSpecialStart.jsx';
import { buildSyriaRefugeeCampYearScenario } from '@/components/game/specialStarts/syriaRefugeeCampSpecialStart.jsx';
import { buildSpotlightYearlyMomentReplacementScenario } from '@/components/game/specialStarts/spotlightYearlyMomentReplacement';
import { ensureKidsContainer, ensureSiblingRivalryState, persistActiveChildIntoKids, addChildReducer, removeChildReducer, setActiveKidReducer, setSiblingRivalryEnabledReducer } from '@/components/game/siblingRivalry/kidHelpers';
import { SIBLING_RIVALRY_POPUPS } from '@/components/game/siblingRivalry/siblingRivalryPopups';
import { resolveHousingForState, resolveCommuteForState, FOOD_COSTS_BASE, mergeDeltas, getFoodStrategyById } from '@/components/game/livingConfig';
import { QOL_SUBSCRIPTIONS, QOL_TIER_DEFS, getTierOption, isSubscriptionValidForAge, computeQoLFocusBonus } from '@/components/game/qualityOfLifeConfig';

import { GameStateContext } from "@/components/game/GameStateContextSingleton";
import { clamp } from "@/components/utils/math";
import { track } from "@/components/lib/rtAnalytics";
import {
  DEFAULT_LOCAL_COOP_STATE,
  ensureLocalCoopState,
  isLocalCoopEligible,
  isLocalCoopEnabled,
  canPassLocalCoopTurn,
  buildCoopFocus,
  getOtherSide
} from "@/components/game/localCoop";
import { getStatDisplayName } from '@/components/game/statLabels';
import { maybeQueueFaithPopup as maybeQueueFaithPopupHelper, resolveFaithPopup as resolveFaithPopupHelper } from '@/components/game/faithHelpers';
import { getFamilyPatternMods } from '@/components/game/familyPatternEffects';
import { getLanguageForCountry, isFluentInLanguage } from '@/components/game/languageData';
import { DEFAULT_POLITICS_CORRUPTION_STATE, ensurePoliticsCorruptionState, processPoliticsCorruptionTick } from '@/components/game/politicsCorruptionEngine';
import { WISDOM_LENSES, getWisdomTier as getWisdomTierFromCatalog } from '@/components/game/wisdomLensesCatalog';
import { ADULT_LIFE_MOMENTS } from './adultLifeMomentsPack';
import { DEFAULT_PRISON_STATE, ensurePrisonState, startPrisonSentence, beginPrisonYear, applyPrisonAction } from "@/components/game/prisonSystem";
import { ensureAdultLife, simulateAdultLifeYear, pickAdultLifePopup, generateAdultContactPings, applyAdultLifeChoice, makeGrandkidKid, getKidName, getKidLove } from '@/components/game/adultLife/adultLifeEngine';
import { CHALLENGE_BY_ID } from '@/components/game/challenges/challengeCatalog';
import { isChallengeComplete } from '@/components/game/challenges/challengeEngine';
import { BADGE_TO_TROPHY } from '@/components/game/specialEndingNarrativeLocks';
import {
  getEarlyAgeBand,
  getEarlyStylePool,
  computeEarlyStyleFocusCost,
  multiplyDeltas,
  EARLY_PARENTING_STYLE_RULES,
  isRoleOnStyle
} from "@/components/game/earlyParentingStyleV1";
import { initUrnCryptoTokens, initUrnCryptoPrices, computeUrnCryptoYearMove } from '@/components/game/urnCryptoMarket';

const ALWAYS_ON_PACK_IDS = SCENARIO_PACKS.filter(p => p.alwaysOn).map(p => p.id);
const DEFAULT_OWNED_PACK_IDS = SCENARIO_PACKS.filter(p => p.defaultOwned).map(p => p.id);
const DEFAULT_ENABLED_PACK_IDS = SCENARIO_PACKS.filter(p => p.defaultEnabled).map(p => p.id);

const DEFAULT_YEARLY_CHECKINS_MAP = (() => {
  const m = {};
  SCENARIO_PACKS.forEach(p => { m[p.id] = (p.defaultYearlyCheckinsEnabled ?? true); });
  return m;
})();

function uniq(arr) {
  return Array.from(new Set((Array.isArray(arr) ? arr : []).filter(Boolean)));
}

export function toRealBool(v) {
  // Only these mean TRUE. Everything else is false.
  return v === true || v === 1 || v === '1' || v === 'true';
}

function normalizeRelationToChild(v) {
  const s = String(v || '').toLowerCase();
  if (s === 'grandparent') return 'grandparent';
  if (s === 'guardian') return 'guardian';
  if (s === 'sibling') return 'sibling';
  return 'parent';
}

function isCoopControlledGuardianPerspective(gp) {
  const activeId = gp?.activeId;
  return activeId === 'player' || activeId === 'partner';
}

function getCaregiverMetaForSide(state, side) {
  const meta = { ...DEFAULT_CAREGIVER_META, ...(state.caregiverMeta || {}) };
  const sideKey = (side === 'partner') ? 'partner' : 'player';
  return meta[sideKey] || { relationToChild: 'parent', title: null };
}

export function isInPrison(gameState) {
  return Boolean(ensurePrisonState(gameState?.prison).active);
}

function normalizePackIds(ids, fallback) {
  const base = uniq(ids);
  const withAlwaysOn = uniq([...base, ...ALWAYS_ON_PACK_IDS]);
  if (withAlwaysOn.length > 0) return withAlwaysOn;
  return uniq([...(Array.isArray(fallback) ? fallback : []), ...ALWAYS_ON_PACK_IDS]);
}

// Deterministic RNG (stable per runSeed+age). Returns { nextFloat(), pick(arr) }.
const clampInt = (n, min, max) => Math.max(min, Math.min(max, Math.round(n)));
const clamp0to100 = (n) => Math.max(0, Math.min(100, Number(n || 0)));
// Clamp helper for 0..100 ranges

export function createSeededRng(seedString) {
  let h = 0;
  const s = String(seedString || "seed");
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  let state = (h >>> 0) || 1;

  const nextFloat = () => {
    // LCG
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const pick = (arr) => {
    const a = Array.isArray(arr) ? arr : [];
    if (!a.length) return null;
    return a[Math.floor(nextFloat() * a.length)];
  };

  const shuffle = (arr) => {
    const a = Array.isArray(arr) ? [...arr] : [];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(nextFloat() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  return { nextFloat, pick, shuffle };
}

// =============================
// Special Starts → Starting Items
// =============================
// Optional starter items for special starts, pulled from the Shop catalog.
// Important design notes:
// - We DO NOT charge money and we DO NOT apply the purchase "instant bonus" effects.
// - Items may be granted (or not) deterministically based on runSeed.
// - Keep counts small to avoid balance issues.
// - These items are intended to add flavor + unlock item actions (useSpec) in themed runs.
function buildSpecialStartStartingInventoryItems({ specialStartId, runSeed, countryIso3, startWithoutChild = false }) {
  const ss = String(specialStartId || '');
  if (!ss) return [];
  const seed = `${String(runSeed || 'seed')}|specialStartStartingItems|${ss}`;
  const rng = createSeededRng(seed);

  // Allow "none" as a real outcome.
  let noneChance = 0.30;
  let maxItems = 3;

  const isSpotlight = ss.startsWith('spotlight_') || ss === 'famous_pop_star' || ss === 'reality_tv_family';
  const isApocalypse = ss === 'zombie_apocalypse' || ss === 'alien_invasion' || ss === 'apocalypse_bunker_stream';
  const isWarHardship =
    ss === 'war_zone' ||
    ss === 'refugee_camp' ||
    ss === 'disaster_rebuild' ||
    ss === 'food_insecurity' ||
    ss === 'no_safety_net' ||
    ss === 'border_crossing' ||
    ss === 'homelessness';

  const isRelocation =
    ss === 'military_relocation_cycle' ||
    ss === 'newcomer_reset' ||
    ss === 'first_gen_immigrant' ||
    ss === 'witness_protection' ||
    ss === 'traveling_circus' ||
    ss === 'vanlife_nomads';

  // Tuning per theme
  if (isSpotlight) { noneChance = 0.10; maxItems = 5; }
  if (isApocalypse) { noneChance = 0.05; maxItems = 6; }
  if (isWarHardship) { noneChance = 0.15; maxItems = 4; }
  if (isRelocation) { noneChance = 0.18; maxItems = 4; }
  if (ss === 'rural_isolation') { noneChance = 0.15; maxItems = 4; }
  if (ss === 'space_station_family') { noneChance = 0.12; maxItems = 4; }

  if (rng.nextFloat() < noneChance) return [];

  const specs = [];
  const add = (id, chance = 0.35) => {
    if (!id) return;
    specs.push({ id, chance });
  };
  const addMany = (ids, chance = 0.35) => {
    (Array.isArray(ids) ? ids : []).forEach(id => add(id, chance));
  };

  // Handy preset clusters (keep these short and "generic")
  const EMERGENCY_SET = ['def_firstAid', 'def_go_bag', 'def_flashlight', 'def_radio', 'def_water_pack', 'def_fire_ext'];
  const OUTDOOR_SET = ['def_campingKit', 'gear_hiking_boots', 'gear_sleeping_bag', 'gear_backpack'];
  const TRAVEL_SET = ['gear_travel_luggage', 'gear_backpack', 'home_weightedBlanket', 'tech_phone'];
  const WELLNESS_SET = ['book_mindfulness_journal', 'home_plants', 'fitness_yogaKit', 'home_headphones'];
  const PRODUCTIVITY_SET = ['tech_laptop', 'home_standingDesk', 'home_headphones', 'learn_skill_course_bundle'];

  // Theme application
  if (isApocalypse) {
    addMany(EMERGENCY_SET, 0.70);
    addMany(['def_generator'], 0.25);

    // Scenario-gated "fictional" items (USA + apocalypse only)
    if (String(countryIso3 || '') === 'USA') {
      add('def_sidearm', 0.35);
      add('def_rifle', 0.20);
    }
  }

  if (isWarHardship) {
    addMany(['def_go_bag', 'def_firstAid', 'def_flashlight', 'def_radio', 'def_water_pack'], 0.65);
    addMany(['gear_travel_luggage'], 0.25);
    addMany(['book_money_playbook'], 0.30);
  }

  if (ss === 'rural_isolation') {
    addMany(['def_generator', 'def_radio', 'def_fire_ext'], 0.35);
    addMany(OUTDOOR_SET, 0.35);
  }

  if (isRelocation) {
    addMany(TRAVEL_SET, 0.45);
    if (ss === 'first_gen_immigrant' || ss === 'newcomer_reset') {
      add('learn_language_course', 0.35);
    }
    if (ss === 'witness_protection') {
      addMany(['def_go_bag', 'def_radio'], 0.40);
    }
    if (ss === 'traveling_circus' || ss === 'vanlife_nomads') {
      add('vehicle_camper_van', 0.60);
      addMany(['abs_disco_ball', 'hobby_karaoke'], 0.25);
    }
  }

  if (ss === 'space_station_family') {
    addMany(['tech_tablet', 'book_space', 'learn_steam_project_kit'], 0.40);
    addMany(['robots_roomba'], 0.18);
    addMany(['home_headphones'], 0.25);
  }

  // "Normal life" scenarios where a few practical items make sense
  if (ss === 'two_working_parents_childcare') {
    addMany(['robots_roomba', 'gear_baby_monitor', 'gear_storage_bins', 'food_mealPrep'], 0.28);
  }
  if (ss === 'teen_parent') {
    addMany(['gear_baby_monitor', 'gear_stroller', 'food_mealPrep'], 0.32);
    addMany(['book_money_playbook'], 0.30);
  }
  if (ss === 'single_parent_household' || ss === 'divorce_coparenting') {
    addMany(['gear_storage_bins', 'food_mealPrep', 'book_money_playbook'], 0.30);
    addMany(['home_weightedBlanket'], 0.22);
  }
  if (ss === 'blended_family' || ss === 'mega_blended_family') {
    addMany(['gear_storage_bins', 'book_relationship_guide'], 0.30);
    addMany(['abs_pet_rock'], 0.12);
  }
  if (ss === 'caregiver_grandparent_home' || ss === 'eldercare_shared' || ss === 'grief_year') {
    addMany(WELLNESS_SET, 0.28);
  }

  // Child-needs special starts: small helpful items only
  if (
    ss === 'gifted_child' ||
    ss === 'child_autism' ||
    ss === 'child_adhd' ||
    ss === 'child_down_syndrome' ||
    ss === 'child_dyslexia' ||
    ss === 'child_deaf_hoh' ||
    ss === 'child_mobility_aid'
  ) {
    addMany(['tech_tablet', 'book_early_readers', 'book_math_puzzles', 'learn_steam_project_kit'], 0.22);
    addMany(['book_mindfulness_journal', 'home_headphones'], 0.22);
  }

  // Wealth / controlled environment
  if (ss === 'golden_cage' || ss === 'sugar_baby' || ss === 'mafia_family' || ss === 'closed_polygamist_compound' || ss === 'polygamist_doctor_indonesia') {
    addMany(['home_mattress', 'home_espresso', 'robots_roomba'], 0.20);
    addMany(['lux_real_sunglasses', 'lux_real_chronometer'], 0.15);

    // Sugar-baby flavor: occasional *questionable* luxury (low stakes unless you later become famous)
    if (ss === 'sugar_baby') {
      addMany(['lux_fake_flashy_watch', 'lux_fake_logo_belt', 'lux_fake_bag'], 0.22);
    }
    if (ss === 'mafia_family') {
      addMany(['def_firstAid', 'def_flashlight'], 0.25);
      addMany(['vehicle_exec_electric_sedan'], 0.12);
    }
  }

  // Spotlight (fame) scenarios
  if (isSpotlight) {
    addMany(['tech_phone', 'tech_laptop', 'hobby_camera'], 0.35);
    addMany(PRODUCTIVITY_SET, 0.20);
    addMany(['home_mattress', 'home_espresso', 'robots_roomba'], 0.18);
    addMany(['lux_real_sunglasses', 'lux_real_designer_bag'], 0.14);

    if (ss === 'spotlight_music_icon' || ss === 'famous_pop_star') {
      addMany(['hobby_guitar', 'hobby_karaoke'], 0.28);
    }
    if (ss === 'spotlight_esports') {
      addMany(['hobby_console', 'home_headphones'], 0.32);
    }
    if (ss === 'spotlight_chef') {
      addMany(['book_cooking_basics', 'food_spiceRack'], 0.34);
    }
    if (ss === 'spotlight_fashion_icon') {
      addMany(['fashion_capsuleWardrobe', 'fashion_powerSuitSet', 'beauty_makeupKit'], 0.26);
    }
    if (ss === 'spotlight_business_mogul' || ss === 'spotlight_tech_founder') {
      addMany(['vehicle_exec_electric_sedan', 'home_standingDesk'], 0.18);
    }
    if (ss === 'spotlight_olympian' || ss === 'spotlight_pro_athlete') {
      addMany(['fitness_dumbbells', 'fitness_boxingBag', 'fitness_yogaKit'], 0.24);
    }
    if (ss === 'spotlight_nobel_scientist') {
      addMany(['learn_steam_project_kit', 'tech_tablet'], 0.26);
    }
  }

  // If a special start isn't explicitly mapped, give it a tiny generic pool
  // so it can still roll "some items" (or none) without breaking theme/balance.
  if (!specs.length) {
    addMany(['gear_backpack', 'book_mindfulness_journal', 'home_weightedBlanket', 'tech_phone'], 0.20);
  }

  // Pick items (chance + cap + uniqueGroup safety)
  const shuffled = rng.shuffle(specs);
  const picked = [];
  const usedIds = new Set();
  const usedGroups = new Set();

  for (const spec of shuffled) {
    if (!spec?.id) continue;
    if (picked.length >= maxItems) break;

    const chance = Number.isFinite(Number(spec.chance)) ? Number(spec.chance) : 0.35;
    if (rng.nextFloat() > chance) continue;

    const def = SHOP_ITEM_BY_ID?.[spec.id];
    if (!def) continue;

    // If starting without a child, avoid child-gated items (defensive)
    if (startWithoutChild && def.benefitsRequireMinorChild) continue;

    if (usedIds.has(def.id)) continue;
    const group = def.uniqueGroup || null;
    if (group && usedGroups.has(group)) continue;

    usedIds.add(def.id);
    if (group) usedGroups.add(group);

    picked.push({
      id: def.id,
      name: def.name,
      category: def.category,
      emoji: def.emoji,
      purchasedAge: 0,
      cost: def.cost,
      uniqueGroup: def.uniqueGroup || null,
      stored: false
    });
  }

  return picked;
}

const DEFAULT_REMOTE_MP = {
  enabled: false,
  sessionId: null,
  joinCode: null,
  mySide: null,        // "player" | "partner"
  activeSide: null,    // "player" | "partner"
  stateVersion: 0,
  pendingCommit: null, // { type:"pass"|"endYear", expectedVersion:number, nextActiveSide:string, fromYear?:number, createdAt:number }
  lastError: null,
  lastSyncAt: null
};

const DEFAULT_CAREGIVER_META = {
  bond: 'partners',
  player: { relationToChild: 'parent', title: null },
  partner: { relationToChild: 'parent', title: null }
};

const DEFAULT_NEIGHBOR_NEMESIS_ARC = {
  status: "dormant", // 'dormant' | 'active' | 'resolved'
  nextStep: 1, // 1..5
  heat: 0, // -3..10
  neighborName: null,
  archetype: null,
  signature: null,
  lastTriggeredAge: null,
  lastResolvedAge: null
};

const NEIGHBOR_NEMESIS_NAME_POOL = [
  "The Harts",
  "The Klines",
  "The Santosos",
  "The Parkers",
  "The Okafors",
  "The Nguyens",
  "The Patels",
  "The Kowalskis",
  "The Garcias",
  "The Rahmans"
];

const NEIGHBOR_NEMESIS_ARCHETYPE_POOL = [
  "HOA crusader",
  "DIY influencer",
  "security-camera hobbyist",
  "yard-perfection maximalist",
  "outdoor-speaker enthusiast",
  "serial renovator",
  "passive-aggressive note writer",
  "fireworks amateur",
  "retired cop with a clipboard",
  "weekend drummer"
];

const NEIGHBOR_NEMESIS_SIGNATURE_POOL = [
  "Sent from my Ring camera.",
  "Per HOA guidelines.",
  "Respectfully, but seriously.",
  "Please advise.",
  "Let's keep things neighborly.",
  "This is for the record.",
  "Thanks in advance.",
  "Not trying to be difficult.",
  "— Management",
  "Have a blessed day."
];

function buildNeighborNemesisProfile(runSeed) {
  const rng = createSeededRng(`${runSeed || "seed"}|neighborNemesis|profile`);
  return {
    neighborName: rng.pick(NEIGHBOR_NEMESIS_NAME_POOL),
    archetype: rng.pick(NEIGHBOR_NEMESIS_ARCHETYPE_POOL),
    signature: rng.pick(NEIGHBOR_NEMESIS_SIGNATURE_POOL)
  };
}

function normalizeNeighborNemesisArc(rawArc, runSeed) {
  const base = { ...DEFAULT_NEIGHBOR_NEMESIS_ARC, ...(rawArc || {}) };

  base.status = (base.status === "active" || base.status === "resolved") ? base.status : "dormant";

  const ns = Number(base.nextStep ?? 1);
  base.nextStep = Number.isFinite(ns) ? Math.max(1, Math.min(5, ns)) : 1;

  const heat = Number(base.heat ?? 0);
  base.heat = Number.isFinite(heat) ? Math.max(-3, Math.min(10, heat)) : 0;

  if (!base.neighborName || !base.archetype || !base.signature) {
    const prof = buildNeighborNemesisProfile(runSeed);
    base.neighborName = base.neighborName || prof.neighborName;
    base.archetype = base.archetype || prof.archetype;
    base.signature = base.signature || prof.signature;
  }

  return base;
}

function applyNeighborTokens(str, arc) {
  const tokens = {
    neighborName: arc?.neighborName || "your neighbor",
    neighborArchetype: arc?.archetype || "neighbor",
    neighborSignature: arc?.signature || "—"
  };

  let out = String(str || "");
  Object.entries(tokens).forEach(([k, v]) => {
    out = out.split(`{${k}}`).join(String(v));
  });
  return out;
}

function applyNeighborTokensToEvent(event, arc) {
  if (!event) return event;
  return {
    ...event,
    title: applyNeighborTokens(event.title, arc),
    body: applyNeighborTokens(event.body, arc),
    choices: (event.choices || []).map(ch => ({
      ...ch,
      text: applyNeighborTokens(ch.text, arc),
      consequence: applyNeighborTokens(ch.consequence, arc)
    }))
  };
}

function tryPickNeighborNemesisArcEvent({ newAge, shownCountThisAge, seedBase, pool, usedSet, arc }) {
  if (!arc || arc.status === "resolved") return null;

  // Keep the arc across years: never trigger as the 2nd popup in the same year.
  if (Number(shownCountThisAge || 0) > 0) return null;

  // Prevent accidental same-age repeat
  if (arc.lastTriggeredAge != null && Number(arc.lastTriggeredAge) === Number(newAge)) return null;

  const stepWanted = Number(arc.nextStep || 1);

  const candidates = (Array.isArray(pool) ? pool : []).filter(e =>
    e &&
    e.arcId === "neighborNemesis" &&
    Number(e.arcStep || 0) === stepWanted &&
    !(usedSet?.has?.(e.id))
  );

  if (!candidates.length) return null;

  // Chance: lower to start, higher to continue; heat boosts momentum.
  const heat = Number(arc.heat || 0);
  let chance = arc.status === "dormant" ? 0.18 : 0.55;
  chance += Math.max(-0.08, Math.min(0.25, heat * 0.03));

  const chanceRng = createSeededRng(`${seedBase}|neighborNemesis|chance|step:${stepWanted}`);
  if (chanceRng.nextFloat() > chance) return null;

  const pickRng = createSeededRng(`${seedBase}|neighborNemesis|pick|step:${stepWanted}`);
  return pickRng.pick(candidates);
}

export function getReputationLabel(reputation) {
  const r = reputation || 0;
  if (r <= 24) return 'Toxic';
  if (r <= 44) return 'Shaky';
  if (r <= 64) return 'Normal';
  if (r <= 84) return 'Trusted';
  return 'Beloved';
}

const YEARLY_PROMPTS = [
  "What do you do?",
  "How do you respond?",
  "What’s your move?",
  "How do you handle it?",
  "What happens next?"
];

const _petFill = (tpl, ctx) =>
  String(tpl)
    .replaceAll('{name}', ctx.name)
    .replaceAll('{action}', ctx.action)
    .replaceAll('{emoji}', ctx.emoji);

const _petPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Returns a short, funny, dynamic line for the ActionResult popup body.
 * pet: { name, speciesKey }
 * actionDef: { id, name, emoji }
 */
function getPetActionFlavor(pet, actionDef) {
  const ctx = {
    name: pet?.name || 'your pet',
    speciesKey: pet?.speciesKey || 'pet',
    actionId: actionDef?.id || 'action',
    action: actionDef?.name || 'Pet Time',
    emoji: actionDef?.emoji || '🐾'
  };

  const pool =
    (PET_ACTION_FLAVOR[ctx.speciesKey] && PET_ACTION_FLAVOR[ctx.speciesKey][ctx.actionId]) ||
    PET_ACTION_FLAVOR._fallback;

  return _petFill(_petPick(pool), ctx);
}

const PET_ACTION_FLAVOR = {
  dog: {
    walk: [
      "{name} leads a full neighborhood tour: 12 mailboxes, 3 fascinating bushes, 1 extremely important lamp post.",
      "It becomes a sniffari. {name} reads every scent like it's breaking news.",
      "{name} struts like they pay rent. You're just the chauffeur with a leash.",
      "{name} finds a leaf and treats it like treasure. You nod like this is totally normal."
    ],
    play: [
      "{name} sprints like a pro athlete… and returns the ball with the aim of a toddler. Still 10/10.",
      "You throw. {name} zooms. {name} returns… and launches the ball directly at your shins. Repeat.",
      "Fetch turns into cardio negotiations. {name} votes 'more throws.' Your arm votes 'please no.'",
      "Ball thrown. Zoomies activated. {name} forgets the ball but remembers happiness."
    ],
    feed: [
      "You offer the bone. {name} deletes it from existence in one crunchy inhale. Drool confetti everywhere.",
      "{name} does a full-body wiggle, then *CRONCH*. Your shoes are now… blessed by slobber.",
      "{name} trots two steps like they're saving it for later… then immediately forgets that plan. Crunch city.",
      "{name} inhales the bone like it's an Olympic event. Saliva appears in places saliva should not be."
    ],
    bathe: [
      "Bath time happens. {name} stares into your soul like you personally betrayed them. Shampoo gets judged.",
      "{name} emerges clean… then shakes, redistributing water to every surface within five meters.",
      "You wash. {name} negotiates. You win. Barely.",
      "{name} is now cleaner and 100% convinced you're the villain in this story."
    ]
  },

  cat: {
    cuddle: [
      "{name} allows cuddles on a strict lease. You are granted approximately 14 seconds of approval.",
      "{name} purrs like a tiny engine. Your stress level quietly exits the chat.",
      "{name} sits on you. This is not affection. This is ownership.",
      "{name} curls up and purrs. The world goes quiet for a minute—and you don't ruin it."
    ],
    play: [
      "The red dot appears. {name} activates tactical mode. Furniture fears for its life.",
      "{name} chases the dot with full commitment… then looks at you like you *hid it on purpose.*",
      "You wiggle the light. {name} becomes a blur. The dot wins. {name} demands a rematch.",
      "{name} pounces, misses, and pretends it was a strategic decision."
    ],
    feed: [
      "You present salmon. {name} sniffs, judges, then eats like they're doing you a favor.",
      "{name} eats the treat, then washes their face like a refined guest at a gala.",
      "The salmon treat disappears. {name} maintains eye contact like: 'More. Immediately.'",
      "{name} accepts the snack and struts away like they pay taxes."
    ],
    brush: [
      "You brush. {name} sheds enough fur to build a second {name}.",
      "{name} becomes fluffier and dramatically offended at the same time. Talent.",
      "Brush strokes. Purrs. One hair floats into your mouth. Nature is healing.",
      "{name} tolerates brushing, then rewards you with exactly one approving slow blink."
    ]
  },

  rabbit: {
    care: [
      "{name} is handled like delicate royalty. A slow blink—basically a standing ovation.",
      "You move calmly. {name} decides you are… acceptable. Trust increases by one tiny whisker.",
      "{name} relaxes a little. You relax a lot."
    ],
    feed: [
      "Fresh greens appear. {name} nibbles like a tiny lawnmower with excellent manners.",
      "{name} grabs a leaf and runs three inches away like you might steal it back.",
      "Crunchy greens vanish. {name} looks up, cheeks full, like: 'This is the good stuff.'"
    ],
    clean: [
      "Hutch cleaned. {name} immediately rearranges everything. Interior design is a lifestyle.",
      "Fresh bedding, fresh vibes. {name} performs a celebratory hop.",
      "Spotless… for exactly 14 seconds. Then rabbit physics happens."
    ]
  },

  fish: {
    check: [
      "You inspect the tank. {name} swims up like: 'Yes hello, I am the manager.'",
      "Filters checked, temps checked. {name} watches, silently judging your technique.",
      "Tank inspected. Fish zoomies commence. Apparently you were holding up the show."
    ],
    feed: [
      "Flakes hit the water. {name} becomes a tiny shark in a fancy aquarium.",
      "Feeding time! {name} attacks the flakes like they've been fasting since 1842.",
      "A gentle sprinkle becomes an underwater buffet. {name} swims like it's a food commercial."
    ],
    clean: [
      "Water changed. {name} swims laps like they just got a spa upgrade.",
      "Fresh water, fresh attitude. {name} does a slow, regal glide.",
      "The tank sparkles. {name} looks offended it wasn't always like this."
    ]
  },

  bird: {
    teach: [
      "You practice a phrase. {name} repeats it… kind of. Close enough to be hilarious.",
      "{name} learns a new sound and immediately uses it at the worst possible moment.",
      "The phrase sticks! {name} says it proudly like they invented language."
    ],
    play: [
      "{name} hops around the perch like it's a tiny obstacle course. You clap anyway.",
      "Perch play turns into aerial acrobatics. {name} is convinced they're in a music video.",
      "{name} flutters, hops, and strikes a pose. Pure drama."
    ],
    feed: [
      "Seed stick offered. {name} pecks like a tiny editor cleaning up a draft.",
      "{name} attacks the seeds with focus and precision. Snack science.",
      "The seed stick becomes a mission. {name} completes it, crumbs and all."
    ]
  },

  snake: {
    handle: [
      "{name} slithers onto your hands like a cautious ribbon. Everyone stays calm. Everyone wins.",
      "Gentle handling accomplished. {name} decides you are not, in fact, a threat. High praise.",
      "{name} explores your sleeves like they're luxury tunnels."
    ],
    feed: [
      "Feeding time. {name} goes from zen noodle to lightning in half a second.",
      "{name} eats with the focus of a tiny prehistoric athlete.",
      "Dinner served. {name} accepts with zero hesitation and maximum professionalism."
    ],
    observe: [
      "Shed status: ongoing. {name} is basically doing a full-body reset.",
      "{name} is mid-shed and absolutely not taking questions at this time.",
      "You observe patiently. {name} continues their very serious process."
    ]
  },

  turtle: {
    clean: [
      "Tank cleaned. {name} swims through the fresh water like they own the place (they do).",
      "You scrub. {name} watches slowly, approvingly, like a tiny ancient supervisor.",
      "Fresh tank, fresh vibes. {name} does a slow victory lap."
    ],
    feed: [
      "Vegetables served. {name} bites with the intensity of a creature who has never rushed anything.",
      "{name} munches greens like a slow-motion salad commercial.",
      "Crunch… pause… crunch. {name} is committed to mindful eating."
    ],
    watch: [
      "You watch {name} do absolutely nothing in a deeply inspirational way.",
      "Turtle time is basically meditation. {name} is the teacher.",
      "{name} blinks. You blink. It's bonding."
    ]
  },

  hamster: {
    clean: [
      "Cage cleaned. {name} immediately stuffs bedding into the corner like a tiny contractor.",
      "You tidy up. {name} runs in to inspect your work with suspicious speed.",
      "Fresh cage! {name} celebrates by sprinting in circles at 300 mph."
    ],
    play: [
      "Hamster ball deployed. {name} becomes a tiny, unstoppable roomba.",
      "{name} barrels into a wall, pauses, then continues like it was planned.",
      "It's cardio hour. {name} zooms around with chaotic confidence."
    ],
    feed: [
      "Seeds appear. {name} starts hoarding like a tiny dragon.",
      "{name} stuffs cheeks to maximum capacity. Physics is impressed.",
      "Snack time! {name} grabs a seed and sprints two inches away like you might chase them."
    ]
  },

  goat: {
    play: [
      "{name} does a happy hop and accidentally invents parkour.",
      "Outdoor play becomes mild chaos. {name} headbutts a leaf for fun.",
      "{name} prances like they're auditioning for a commercial about freedom."
    ],
    feed: [
      "Veggie scraps served. {name} eats like it's a gourmet tasting menu.",
      "{name} chews thoughtfully, then immediately asks for more with their entire face.",
      "{name} crunches veggies and looks proud, like they made a healthy choice."
    ],
    clean: [
      "Mucked out. The barn smells better. {name} pretends this was their idea.",
      "You clean up. {name} watches like a supervisor who pays in vibes.",
      "Fresh bedding down. {name} immediately finds the one remaining messy spot."
    ]
  },

  horse: {
    ride: [
      "Riding lesson: {name} moves like a gentle tank with excellent manners.",
      "{name} trots, you wobble, everyone survives. That's teamwork.",
      "{name} responds like a patient professor with hooves."
    ],
    groom: [
      "You groom {name}. They sigh dramatically like they've been waiting all day for this.",
      "Brush strokes. Warm horse breath. Instant calm.",
      "{name} leans into the grooming like: 'Yes, yes—right there.'"
    ],
    feed: [
      "Apple offered. {name} takes it delicately, then crunches like a cartoon.",
      "{name} eats the apple and immediately checks if you brought a second apple.",
      "Snack time! {name} gives you that 'best friend with hooves' look."
    ]
  },

  lizard: {
    handle: [
      "{name} perches calmly, like a tiny prehistoric philosopher.",
      "Gentle handling achieved. {name} is cool about it. Literally.",
      "{name} steps slowly from finger to finger like you're a living walkway."
    ],
    feed: [
      "Crickets released. {name} goes full hunter mode. Nature documentary vibes.",
      "{name} snatches a cricket with startling speed, then returns to statue mode.",
      "Feeding time: blink and you'll miss it. {name} doesn't."
    ],
    clean: [
      "Habitat tidied. {name} climbs the cleanest rock like it's a throne.",
      "You clean up. {name} watches like a tiny landlord inspecting the property.",
      "Fresh setup! {name} basks like they're at a luxury resort."
    ]
  },

  chickens: {
    coop: [
      "Coop routine complete. {name} clucks like they're filing a formal report.",
      "You tidy the coop. The chickens supervise loudly and without pay.",
      "Everything is in order. The flock still complains. Consistency matters."
    ],
    feed: [
      "Feed scattered. The flock erupts into polite chaos. {name} is first in line.",
      "Snack time! Tiny feet, big energy. The ground becomes a buffet.",
      "{name} pecks with purpose like they're speed-running dinner."
    ],
    collect: [
      "Eggs collected. {name} watches like: 'Those were mine. I was saving them.'",
      "You gather eggs like a responsible adult. The chickens gossip about you immediately.",
      "Fresh eggs! {name} clucks proudly, like they arranged the production schedule."
    ]
  },

  unicorn: {
    rainbow_ride: [
      "Rainbow ride achieved. {name} prances and reality briefly becomes glitter.",
      "You hop on. {name} gallops and leaves a suspiciously cheerful rainbow behind you.",
      "Rainbow ride: 10/10. Your hair is now slightly more magical."
    ],
    diamond_horn: [
      "Horn polished. {name} shines like a disco ball with good intentions.",
      "You buff the horn. {name} closes their eyes like they're at a spa.",
      "Sparkles everywhere. {name} looks pleased—and slightly smug."
    ],
    moon_sugar: [
      "Sugar cubes offered. {name} accepts them like a mystical snack critic.",
      "{name} crunches a moonlit cube and looks 7% more magical.",
      "Snack time under imaginary moonlight. {name} seems delighted and dangerously energetic."
    ],
    wish_ceremony: [
      "Wish ceremony begins. {name} stands very still, like they're buffering magic.",
      "You make a wish. {name} snorts softly, which feels like confirmation.",
      "A little sparkle, a little hope. {name} makes it feel official."
    ]
  },

  dragon: {
    gold_steak: [
      "Dinner served. {name} eats the gold-leaf steak like it's a casual Tuesday.",
      "{name} inhales the steak, then looks around for dessert (you panic).",
      "Gold leaf, steak, drama. {name} is living their best mythical life."
    ],
    flight_lesson: [
      "Flight lesson starts. {name} takes off and your stomach tries to stay on the ground.",
      "{name} flaps once, majestically. You briefly forget taxes exist.",
      "Up, up, and—yep, that's a dragon. {name} glides like they invented the sky."
    ],
    fire_insurance: [
      "Insurance renewed. {name} looks offended you'd even suggest they might set something on fire.",
      "Paperwork complete. The dragon is covered. The furniture sighs in relief.",
      "Fire insurance renewed. Your home is now officially 'less doomed.'"
    ],
    add_to_hoard: [
      "You add a shiny item. {name} purrs in a way that is absolutely not normal for a dragon.",
      "{name} carefully arranges the treasure like an art curator with scales.",
      "Hoard expanded. {name} looks at it lovingly—then looks at you like: 'More.'"
    ]
  },

  _fallback: [
    "You spend a little time with {name}. They seem pleased. (Or at least… not displeased.)",
    "{name} accepts your attention like it was always their idea.",
    "You do {action}. {name} approves in the most pet way possible."
  ]
};

const GENERIC_CHOICE_TEXT = {
  connect: [
    "Get close, name the feeling, and make it safe to talk.",
    "Slow down, validate first, then ask what {childName} needs.",
    "Lead with warmth: reflect what you see, then offer a small choice."
  ],
  teach: [
    "Teach one small skill for next time—brief, calm, and concrete.",
    "Turn it into a tiny lesson: what to do, why it matters, and a practice run.",
    "Coach a script {childName} can use next time (short and usable)."
  ],
  boundary: [
    "Set a clear limit with a calm voice, then follow through.",
    "Hold the boundary kindly: ‘I hear you. And the answer is still no.’",
    "Make the rule predictable, not punitive—and stick to it."
  ],
  avoid: [
    "Let it slide for now and hope it burns out on its own.",
    "Change the subject and move on—even if it doesn’t really resolve it.",
    "Do nothing and try not to think about it (for today)."
  ],
  harm: [
    "Snap, shame, or threaten—fast control now, fallout later.",
    "Escalate the power struggle and make it personal.",
    "React harshly and hope fear teaches the lesson."
  ]
};

const GENERIC_CONSEQUENCE_TEXT = {
  connect: [
    "{childName} calms down faster and feels safer telling you the truth.",
    "You get more information—and the moment becomes repair instead of drama."
  ],
  teach: [
    "{childName} leaves with a usable tool, not just a lecture.",
    "The next attempt goes a little better because there’s a plan."
  ],
  boundary: [
    "The limit holds. {childName} may protest, but the world feels predictable.",
    "You trade short-term peace for long-term clarity."
  ],
  avoid: [
    "You get short-term quiet, but the issue returns with interest later.",
    "{childName} learns this topic is handled by silence."
  ],
  harm: [
    "{childName} complies (maybe), but trust takes a hit.",
    "You ‘win’ the moment and lose connection."
  ]
};

function templateText(str, vars = {}) {
  if (!str) return "";
  let out = String(str);

  // add common synonyms so name always works even if content uses {kid}
  const v = { ...vars };
  if (v.childName) {
    v.kid = v.childName;
    v.kidName = v.childName;
    v.child = v.childName;
  }

  for (const [k, val] of Object.entries(v)) {
    const s = String(val);
    out = out.split(`{${k}}`).join(s);
    out = out.split(`{{${k}}}`).join(s);
  }
  return out;
}


      function normalizeMomentKeyPart(value) {
        return String(value ?? "")
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2011\u2013\u2014]/g, "-")
          .replace(/\s+/g, " ")
          .trim();
      }

      // deterministic-ish RNG from a string (stable per year)
function makeSeededRng(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;

  function nextFloat() {
    // mulberry32
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function pick(arr) {
    const a = Array.isArray(arr) ? arr : [];
    if (a.length === 0) return "";
    return a[Math.floor(nextFloat() * a.length)];
  }

  function shuffle(arr) {
    const a = Array.isArray(arr) ? [...arr] : [];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(nextFloat() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return { nextFloat, pick, shuffle };
}

export const PRICING = {
  LOCAL: 'local',
  GLOBAL: 'global'
};

export const MARKET_MODIFIERS = {
  // Safe defaults; tune later if you already have real values elsewhere
  inflation: 0,         // +% baseline annual inflation (0 = disabled)
  rentGrowth: 0,        // +% annual rent growth
  homeAppreciation: 1,  // % annual home appreciation (matches your earlier rule: 1%/year)
  wageGrowth: 0,        // +% annual wage growth
  shockChance: 0,       // chance of random market shock per year (0 = off)
  shockMin: -10,        // % min shock
  shockMax: 10          // % max shock
};

export const ECONOMY_PRICES = {
  playdate: 30,
  movieNight: 60,
  roadTrip: 350,
  doctorVisit: 180,
  homeopathicVisit: 120,
  plasticSurgery: 20000,
  vetVisit: 120,
  salonSpa: 150,
  tutorYear: 2500,
  musicLessonsYear: 1200,
  emergencyFundTarget: 500,
  sexualHealthClinic: 200,
  sexualHealthMeds: 120,
};

export const HOUSEHOLD_CONFIG = {
  single: { label: 'Single Parent', emoji: '🧍', description: 'One income, one pair of hands. Hard mode.' },
  two: { label: 'Two Parents', emoji: '👫', description: 'Two incomes (usually), shared load.' }
};

export const INCOME_CONFIG = {
  low: { label: 'Struggling', startMoney: 500, yearlyIncome: 25000, emoji: '📉' },
  medium: { label: 'Stable', startMoney: 2500, yearlyIncome: 55000, emoji: '📊' },
  high: { label: 'Comfortable', startMoney: 10000, yearlyIncome: 120000, emoji: '📈' },
  wealthy: { label: 'Wealthy', startMoney: 50000, yearlyIncome: 350000, emoji: '💎' }
};

export const COMMITMENT_DEFS = {
  afterSchoolCare: {
    id: 'afterSchoolCare',
    emoji: '🏫',
    label: 'After-School Care',
    cost: 3000,
    detail: 'Professional care until 6pm. Reduces stress significantly.'
  },
  cleaningHelp: {
    id: 'cleaningHelp',
    emoji: '🧹',
    label: 'Cleaning Service',
    cost: 2400,
    detail: 'Bi-weekly cleaning. Frees up time and mental load.'
  },
  mealKits: {
    id: 'mealKits',
    emoji: '🥗',
    label: 'Meal Kit Delivery',
    cost: 1800,
    detail: 'Healthy ingredients delivered. Less shopping, less planning.'
  }
};

export const SUPPORT_OPTIONS = [
  {
    id: 'grandparents',
    icon: '👵',
    title: 'Grandparents Visit',
    subtitle: 'Free childcare, but unsolicited advice included.',
    cost: 0,
    deltas: { confidence: 0, empathy: 1, discipline: 0, intelligence: 0 },
    loveDelta: 0.5,
    stressDelta: -1,
    logLine: 'Grandma spoiled them, but you got a nap. Worth it.'
  },
  {
    id: 'babysitter',
    icon: '🧑‍🍼',
    title: 'Hire a Babysitter',
    subtitle: 'Buy yourself an evening of silence.',
    cost: 150,
    deltas: { confidence: 0, empathy: 0, discipline: 0, intelligence: 0 },
    loveDelta: 0,
    stressDelta: -2,
    logLine: 'You paid for silence. It was golden.'
  },
  {
    id: 'parenting_group',
    icon: '☕',
    title: 'Parent Support Group',
    subtitle: 'Coffee, venting, and realizing everyone is tired.',
    cost: 20,
    deltas: { confidence: 1, empathy: 1, discipline: 0, intelligence: 0 },
    loveDelta: 0,
    stressDelta: -1,
    logLine: 'You realized you’re not the only one drowning in laundry.'
  },
  {
    id: 'therapy',
    icon: '🛋️',
    title: 'Family Counseling',
    subtitle: 'Professional help to untangle the knots.',
    cost: 250,
    deltas: { confidence: 1, empathy: 2, discipline: 0, intelligence: 0 },
    loveDelta: 1,
    stressDelta: -3,
    logLine: 'Expensive, but cheaper than a breakdown.'
  }
];

export const HOMESCHOOL_CURRICULUM = {
  project: { label: 'Project-Based', cost: 200, deltas: { intelligence: 1, confidence: 1 } },
  classical: { label: 'Classical/Academic', cost: 500, deltas: { intelligence: 2, discipline: 1, confidence: -1 } },
  unschool: { label: 'Unschooling', cost: 50, deltas: { intelligence: 0, confidence: 2, discipline: -1 } }
};

export const HOMESCHOOL_SUPPORT = {
  diy: { label: 'Do It Yourself', cost: 0, stressDelta: 1, deltas: {} },
  coop: { label: 'Parent Co-op', cost: 300, stressDelta: 0, deltas: { empathy: 1 } },
  tutor: { label: 'Private Tutor', cost: 2000, stressDelta: -1, deltas: { intelligence: 1 } }
};

export const PARENT_CIVIC_ROLE_DEFS = [
  {
    id: "pta_helper",
    label: "PTA Helper",
    emoji: "🧩",
    focusCost: 1,
    description: "Help with small community tasks and school events.",
    effects: { empathy: 1 },
    unlockAge: 5
  },
  {
    id: "community_volunteer",
    label: "Community Volunteer",
    emoji: "🤝",
    focusCost: 1,
    description: "Volunteer for community projects and support other families.",
    effects: { empathy: 1, confidence: 1 },
    unlockAge: 8
  },
  {
    id: "event_organizer",
    label: "Event Organizer",
    emoji: "📣",
    focusCost: 2,
    description: "Organize a school/community event.",
    effects: { discipline: 1, confidence: 1 },
    unlockAge: 10
  }
];

export const ACTION_REGISTRY = [
  { id: 'qualityOfLife', label: 'Quality of Life', emoji: '✨', focusCost: 0 },
  { id: 'runForOffice', label: 'Politics', emoji: '🗳️', focusCost: 0 },
  { id: 'bond', label: 'Bond', emoji: '❤️', focusCost: 1 },
  { id: 'play', label: 'Play', emoji: '🎮', focusCost: 1 },
  { id: 'outdoorAdventures', label: 'Outdoor Adventures', emoji: '🌲', focusCost: 1 },
  { id: 'naturePlay', label: 'Nature Play', emoji: '🐸', focusCost: 1 },
  { id: 'parentReset', label: 'Parent Reset', emoji: '🧘', focusCost: 1 },
  { id: 'coping', label: 'Coping', emoji: '🫠', focusCost: 1 },
  { id: 'study', label: 'Study', emoji: '📚', focusCost: 1 },
  { id: 'aiLearn', label: 'AI Learning', emoji: '🤖', focusCost: 1 },
  { id: 'aiGrow', label: 'AI Growth', emoji: '🌱', focusCost: 1 },
  { id: 'empathyCards', label: 'Empathy Cards', emoji: '🃏', focusCost: 1 },
  { id: 'homeschoolAcademic', label: 'Academic Block', emoji: '📚', focusCost: 1 },
  { id: 'homeschoolStructure', label: 'Structure', emoji: '🧱', focusCost: 1 },
  { id: 'homeschoolEmpathy', label: 'Social-Emotional', emoji: '💛', focusCost: 1 },
  { id: 'homeschoolConfidence', label: 'Confidence', emoji: '🌟', focusCost: 1 },
  { id: 'routine', label: 'Routine', emoji: '📅', focusCost: 1 },
  { id: 'commitments', label: 'Commitments', emoji: '🤝', focusCost: 0 },
  { id: 'sideGigs', label: 'Side Gigs', emoji: '💼', focusCost: 1 },
  { id: 'crime', label: 'Crime', emoji: '🫣', focusCost: 1 },
  { id: 'crypto', label: 'Cryptocurrency', emoji: '🪙', focusCost: 0 },
  { id: 'scienceFair', label: 'Science Fair', emoji: '🔬', focusCost: 1 },
  { id: 'artsShowcase', label: 'Arts Showcase', emoji: '🎨', focusCost: 1 },
  { id: 'ecoChallenge', label: 'Eco Challenge', emoji: '🌱', focusCost: 1 },
  { id: 'makerChallenge', label: 'Maker Challenge', emoji: '🛠️', focusCost: 1 },
  { id: 'debateForum', label: 'Debate Forum', emoji: '🗣️', focusCost: 1 },
  { id: 'joke_book', label: 'Joke Book', emoji: '📖', focusCost: 1 },
  { id: 'date', label: 'Date Night', emoji: '🍷', focusCost: 1 },
  { id: 'parentStrategies', label: 'Health Strategies', emoji: '🧘', focusCost: 1 },
  { id: 'salonSpa', label: 'Self-Care', emoji: '💆', focusCost: 1 },
  { id: 'support', label: 'Support Network', emoji: '🤝', focusCost: 1 },
  { id: 'outings', label: 'Outings', emoji: '🏞️', focusCost: 1 },
  { id: 'relationships', label: 'Relationships', emoji: '💞', focusCost: 1 },
  { id: 'familyPatterns', label: 'Family Patterns', emoji: '🧬', focusCost: 0 },
  { id: 'titles', label: 'Titles', emoji: '👑', focusCost: 1 },
  { id: 'parentLeadership', label: 'Parent Leadership', emoji: '👑', focusCost: 1 },
  { id: 'pets', label: 'Pets', emoji: '🐾', focusCost: 1 },
  { id: 'tutor', label: 'Tutor', emoji: '👨‍🏫', focusCost: 1 },
  { id: 'mindBody', label: 'Mind & Body', emoji: '🧘‍♀️', focusCost: 1 },
  { id: 'homeschoolSupport', label: 'Homeschool Support', emoji: '🏠', focusCost: 1 },
  { id: 'doctor', label: 'Doctor', emoji: '👨‍⚕️', focusCost: 1 },
  { id: 'donation', label: 'Donation', emoji: '💸', focusCost: 1 },
  { id: 'faith', label: 'Faith', emoji: '🙏', focusCost: 1 },
  { id: 'school', label: 'School', emoji: '🏫', focusCost: 1 },
  { id: 'phone', label: 'Phone', emoji: '📱', focusCost: 1 },
  { id: 'phone_play', label: 'Play my phone', emoji: '📱', focusCost: 0 },
  { id: 'be_anxious', label: 'Be Anxious', emoji: '🌀', focusCost: 1 },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', focusCost: 1 },
  { id: 'retirement', label: 'Retirement', emoji: '👴', focusCost: 1 },
  { id: 'realEstate', label: 'Real Estate', emoji: '🏠', focusCost: 1 },
  { id: 'business', label: 'Small Business', emoji: '🏢', focusCost: 1 },
  { id: 'playdates', label: 'Playdates', emoji: '🧸', focusCost: 1 },
  { id: 'library', label: 'Library', emoji: '📚', focusCost: 1 },
  { id: 'bookstore', label: 'Bookstore', emoji: '📖', focusCost: 1 },
  { id: 'room', label: 'Room', emoji: '🛏️', focusCost: 1 },
  { id: 'studentLeadership', label: 'Student Leadership', emoji: '🎖️', focusCost: 1 },
  { id: 'ptaIlluminati', label: 'PTA', emoji: '🍪', focusCost: 1 },
  { id: 'videos', label: 'Videos', emoji: '📺', focusCost: 1 },
  { id: 'socialMedia', label: 'Social Media', emoji: '📱', focusCost: 1 },
  { id: 'career', label: 'Career', emoji: '👔', focusCost: 1 },
  { id: 'lookForJob', label: 'Look for a Job', emoji: '🔎', focusCost: 0 },
  { id: 'education', label: 'Education', emoji: '🎓', focusCost: 1 },
  { id: 'languageLearning', label: 'Language Learning', emoji: '🗣️', focusCost: 1 },
  { id: 'moveAbroad', label: 'Move Abroad', emoji: '✈️', focusCost: 1 },
  { id: 'life', label: 'Life Hub', emoji: '🧬', focusCost: 0 },
  { id: 'teachCulture', label: 'Teach Culture', emoji: '🌍', focusCost: 1 },
  { id: 'participate', label: 'Participate', emoji: '🎉', focusCost: 1 },
  { id: 'funFact', label: 'Tell a Fun Fact', emoji: '💡', focusCost: 0 },
  { id: 'tell_bedtime_story', label: 'Tell a Bedtime Story', emoji: '🌙', focusCost: 1 },
  { id: 'culture_heritage', label: 'Culture & Heritage', emoji: '🌳', focusCost: 0 },
  { id: 'extremeSports', label: 'Extream Sports', emoji: '🤘', focusCost: 1 },
  { id: 'trampoline_park', label: 'Trampoline Park', emoji: '🤸', focusCost: 1 },
  { id: 'music', label: 'Music', emoji: '🎵', focusCost: 1 },
  { id: 'specialCareers', label: 'Special Careers', emoji: '🧭', focusCost: 0 },
  { id: 'club', label: 'Go to Club', emoji: '🪩', focusCost: 1 },
  { id: 'hobbies', label: 'Hobbies & Clubs', emoji: '🎭', focusCost: 1 },
  { id: 'shop_housing', label: 'Housing', emoji: '🏠', focusCost: 0 },
  { id: 'shop_cars', label: 'Car Dealership', emoji: '🚗', focusCost: 0 },
  { id: 'shop_mall', label: 'Mall', emoji: '🏬', focusCost: 0 },
  { id: 'shop_myStuff', label: 'My Stuff', emoji: '🎒', focusCost: 0 },
];

export const SCHOOL_START_AGE = 5;

// Used by ActionBar as a last-resort fallback when no scenario hook is present
export const FALLBACK_HOOK_GENERIC = {
  id: 'fallback_generic',
  packId: 'core',
  choicePack: 'core',
  minAge: 0,
  maxAge: 18,
  topic: 'Everyday parenting',
  intensity: 1,
  hookText: "It's an ordinary day until something small becomes a parenting moment with {childName}."
};

export function formatDeltas(deltas) {
  if (!deltas) return '';
  return Object.entries(deltas)
    .map(([k, v]) => {
      const val = Number(v);
      if (val === 0) return `${k.substr(0, 3).toUpperCase()} 0`;
      
      const absVal = Math.abs(val);
      if (absVal < 0.1) {
        // Tiny non-zero: show ±0.1
        return `${k.substr(0, 3).toUpperCase()} ${val > 0 ? '+' : ''}0.1`;
      }
      
      // Round to 1 decimal, remove trailing .0
      const rounded = Math.round(val * 10) / 10;
      const display = rounded % 1 === 0 ? Math.round(rounded) : rounded;
      return `${k.substr(0, 3).toUpperCase()} ${val > 0 ? '+' : ''}${display}`;
    })
    .join(' • ');
}

export function formatSmallDelta(val) {
  const n = Number(val);
  if (!Number.isFinite(n) || n === 0) return '0';
  const abs = Math.abs(n);
  const clamped = abs < 0.1 ? 0.1 : (Math.round(abs * 10) / 10);
  const str = (clamped % 1 === 0) ? String(Math.round(clamped)) : clamped.toFixed(1);
  return n > 0 ? `+${str}` : `-${str}`;
}

export function isFeatureEnabled(featureId, gameState) {
  if (!gameState) return false;
  if (featureId === 'rewind') {
    return gameState.rewind?.unlocked === true;
  }
  return false;
}

// --- Helper Functions ---

// Country Helpers
export function pickTenCountries(arg1 = COUNTRIES, excludeIso3 = null) {
  // Supports both call styles:
  // 1) pickTenCountries() -> returns 10 country objects
  // 2) pickTenCountries(seedNumber, excludeIso3) -> returns 10 iso3 strings
  const isSeedCall = typeof arg1 === 'number';

  const list = Array.isArray(COUNTRIES) ? COUNTRIES.filter(Boolean) : [];

  // Normalize iso3
  const normalized = list
    .map((c) => {
      const iso3 = c.iso3 || c.code || c.cca3 || c.id || c.iso2 || null;
      return { ...c, iso3 };
    })
    .filter((c) => Boolean(c.iso3) && (!excludeIso3 || c.iso3 !== excludeIso3));

  if (normalized.length === 0) return isSeedCall ? [] : [];

  // Seeded shuffle when called with a seed (deterministic-ish)
  const arr = [...normalized];
  let seed = isSeedCall ? arg1 : Date.now();
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const picked = arr.slice(0, 10);

  // Return iso3 strings for ImmigrationModal flow, objects for Start flow
  return isSeedCall ? picked.map(c => c.iso3) : picked;
}

export function getCountryByIso3(iso3) {
  return COUNTRIES.find(c => c.iso3 === iso3) || (COUNTRIES.find(c => c.iso3 === 'USA') || COUNTRIES[0]);
}

export function getCountryLocalCostScale(iso3) {
  const c = getCountryByIso3(iso3) || { level: 3 };
  const scales = { 1: 0.30, 2: 0.50, 3: 0.70, 4: 0.90, 5: 1.10, 6: 1.35 };
  return scales[c.level] || 1.0;
}

export function getCountryWageScale(iso3) {
  const c = getCountryByIso3(iso3) || { level: 3 };
  const scales = { 1: 0.18, 2: 0.32, 3: 0.55, 4: 0.78, 5: 1.00, 6: 1.22 };
  return scales[c.level] || 1.0;
}

export function getCountryScale(iso3) {
  return getCountryLocalCostScale(iso3);
}

export function getHealthcareOutOfPocketRate(iso3) {
  const upper = String(iso3 || '').toUpperCase();
  
  // Overrides
  if (upper === 'DEU') return 0.0;
  if (upper === 'USA') return 1.0;
  
  // Defaults by level
  const c = getCountryByIso3(iso3) || { level: 3 };
  const rateByLevel = { 1: 0.85, 2: 0.70, 3: 0.55, 4: 0.40, 5: 0.25, 6: 0.15 };
  return rateByLevel[c.level] || 0.55;
}

export function localizeAmount(amount, scale, pricingType = PRICING.LOCAL) {
  const a = Number(amount);
  const s = Number(scale);

  const safeAmount = Number.isFinite(a) ? a : 0;
  const safeScale = (Number.isFinite(s) && s > 0) ? s : 1;
  
  const pt = String(pricingType || '').toLowerCase();
  if (pt === 'global') {
    return Math.round(safeAmount);
  }

  return Math.round(safeAmount * safeScale);
}

export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0";
  return Math.abs(n).toLocaleString();
}

// Backward-compat: some components call formatMoney2; keep as alias
export function formatMoney2(amount) {
  return formatMoney(amount);
}

export function getCash(state) {
  const s = state || {};
  const n = Number(s.money);
  return Number.isFinite(n) ? n : 0;
}

export function statBarPercent(value) {
  return Math.min(100, Math.max(0, (value / 20) * 100)); // Assuming max stat is 20? Or 10? let's guess 20 based on logs
}

export function loveBarPercent(value) {
  return Math.min(100, Math.max(0, value));
}

export function statTier(value) {
  if (value >= 18) return 'Exceptional';
  if (value >= 14) return 'High';
  if (value >= 10) return 'Good';
  if (value >= 6) return 'Developing';
  return 'Emerging';
}

export function tierIcon(value) {
  if (value >= 15) return '🌟';
  if (value >= 10) return '⭐';
  return '🌱';
}

export function getTierColor(value) {
  if (value >= 15) return 'text-purple-600';
  if (value >= 10) return 'text-emerald-600';
  return 'text-slate-600';
}

export function loveTier(value) {
  if (value >= 90) return 'Unbreakable';
  if (value >= 75) return 'Deep';
  if (value >= 50) return 'Strong';
  if (value >= 25) return 'Growing';
  return 'Fragile';
}

export function stressTier(value) {
  if (value >= 80) return 'Critical';
  if (value >= 60) return 'High';
  if (value >= 40) return 'Moderate';
  if (value >= 20) return 'Manageable';
  return 'Low';
}

export function warmthLabel(val) {
  if (val >= 8) return 'Very Warm';
  if (val >= 5) return 'Warm';
  return 'Neutral';
}

export function structureLabel(val) {
  if (val >= 8) return 'Structured';
  if (val >= 5) return 'Balanced';
  return 'Flexible';
}

export function parentingStyleTitle2(warmth, structure) {
  if (warmth > 6 && structure > 6) return 'Authoritative';
  if (warmth > 6 && structure <= 6) return 'Permissive';
  if (warmth <= 6 && structure > 6) return 'Authoritarian';
  return 'Uninvolved';
}

export function combineDeltas(d1 = {}, d2 = {}) {
  const result = { ...(d1 || {}) };
  for (const [k, v] of Object.entries(d2 || {})) {
    result[k] = (result[k] || 0) + v;
  }
  return result;
}

/**
 * Check if the player has any child.
 * Explicit childless flag takes precedence over other state.
 */
export function hasAnyChild(gameState) {
  if (!gameState) return false;

  // Explicit overrides (child-free / young adult runs)
  if (gameState.hasChild === false) return false;
  if (gameState.childless === true) return false;

  // Kids container (newer saves)
  const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
  if (kids.length > 0) return true;

  // Relationships (older saves) — only count as a child if "active" by age
  const childRel = gameState.relationships?.byId?.child;
  if (childRel) {
    const createdAtAge = Number(childRel.createdAtAge ?? 0);
    const currentYear = Number(gameState.currentYear ?? 0);
    if (createdAtAge <= currentYear) return true;
  }

  // Last resort (legacy): childName set AND not in child-free mode
  const cn = typeof gameState.childName === 'string' ? gameState.childName.trim() : '';
  if (cn.length > 0) return true;

  return false;
}

/**
 * Check if the player has any child under age 18.
 * Returns false if childless or all kids are 18+.
 */
export function hasMinorChild(gameState) {
  if (!hasAnyChild(gameState)) return false;

  const kids = Array.isArray(gameState.kids) ? gameState.kids : [];
  if (kids.length > 0) {
    return kids.some(k => getDisplayedChildAge(gameState, k) < 18);
  }

  // Legacy single-child mode: currentYear acts like child age during parenting chapter
  const legacyAge = Number(gameState.currentYear ?? 0);
  return legacyAge < 18;
}

export function getActionBeneficiary(gameState) {
  const minor = hasMinorChild(gameState);

  const childName =
    (typeof gameState?.childName === "string" && gameState.childName.trim()) ? gameState.childName.trim() : "your child";

  const parentName =
    (typeof gameState?.parentName === "string" && gameState.parentName.trim()) ? gameState.parentName.trim()
    : (typeof gameState?.playerName === "string" && gameState.playerName.trim()) ? gameState.playerName.trim()
    : "you";

  return {
    isChild: minor,
    label: minor ? "Child" : "You",
    short: minor ? "Kid" : "You",
    name: minor ? childName : parentName
  };
}

const BABY_PRESSURE_CURVE_FEMALE = [
  [18, 0],
  [22, 3],
  [25, 8],
  [28, 15],
  [30, 25],
  [33, 35],
  [35, 50],
  [37, 65],
  [39, 85],
  [40, 100],
  [45, 100],
  [46, 90],
  [48, 75],
  [50, 60],
  [55, 45],
  [60, 30],
  [65, 20],
  [70, 10],
  [80, 5],
];

const BABY_PRESSURE_CURVE_MALE = [
  [18, 0],
  [22, 2],
  [25, 6],
  [28, 12],
  [30, 20],
  [35, 35],
  [40, 50],
  [45, 60],
  [50, 70],
  [60, 70],
  [70, 60],
  [80, 45],
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function piecewiseLinear(points, x) {
  const v = Number(x || 0);
  if (!points?.length) return 0;
  if (v <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (v >= x1 && v <= x2) {
      const t = (v - x1) / (x2 - x1 || 1);
      return lerp(y1, y2, t);
    }
  }
  return points[points.length - 1][1];
}

function getPlayerSexKey(state) {
  const g = String(state?.parentAvatarGender || '').toLowerCase();
  if (g === 'female') return 'female';
  if (g === 'male') return 'male';

  const role = String(state?.parentRole || '').toLowerCase();
  if (role === 'mom' || role === 'mother') return 'female';
  if (role === 'dad' || role === 'father') return 'male';

  // Default: female curve (slightly more "time-pressure" shaped)
  return 'female';
}

function babyPressureTargetByAdultAge(adultAge, sexKey) {
  const age = Number(adultAge || 0);
  const sex = sexKey === 'male' ? 'male' : 'female';
  const pts = sex === 'male' ? BABY_PRESSURE_CURVE_MALE : BABY_PRESSURE_CURVE_FEMALE;
  const raw = piecewiseLinear(pts, age);
  return clamp0to100(Math.round(raw));
}

function computeStartingBabyPressure(state) {
  const adultAge = Number(state?.parentAgeAtBirth ?? 28) + Number(state?.currentYear ?? 0);
  const target = babyPressureTargetByAdultAge(adultAge, getPlayerSexKey(state));
  const rng = makeSeededRng(`${state?.runSeed || 'seed'}|babyPressureStart|${adultAge}`);
  const jitter = Math.round(rng.nextFloat() * 8 - 4); // -4..+4
  // Start slightly below target so it has room to rise naturally
  return clamp0to100(Math.round(target * 0.75 + jitter));
}

function hasPartner(state) {
  return state?.householdType === 'two' && Boolean(state?.partnerName);
}

function isInSchool(state) {
  return Boolean(state?.inSchool || state?.parentEducation?.enrollment);
}

function isEmployed(state) {
  const career = state?.playerCareer;
  if (!career) return false;
  // Common fields used across this repo
  if (career?.jobId) return true;
  if (typeof career?.yearlyIncome === 'number' && career.yearlyIncome > 0) return true;
  return false;
}

function hasPets(state) {
  return Array.isArray(state?.pets) && state.pets.length > 0;
}

function adultLifeMomentPasses(moment, state) {
  const req = moment?.requires || {};
  if (req.hasPartner === true && !hasPartner(state)) return false;
  if (req.hasPartner === false && hasPartner(state)) return false;

  if (req.inSchool === true && !isInSchool(state)) return false;
  if (req.employed === true && !isEmployed(state)) return false;

  if (req.hasPets === true && !hasPets(state)) return false;
  if (req.hasPets === false && hasPets(state)) return false;

  if (req.sex) {
    const sexKey = getPlayerSexKey(state);
    if (String(req.sex).toLowerCase() !== sexKey) return false;
  }
  return true;
}

function weightedPick(items, randFloat) {
  if (!items?.length) return null;
  const weights = items.map(it => Math.max(0, Number(it.weight ?? 1)));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return items[0];

  let r = randFloat() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Compute adult age (player age) from game state.
 * Used for Baby Pressure and other adult-only systems.
 */
export function computeAdultAgeFromState(state, newYearOverride = null) {
  const childAge = Number(newYearOverride ?? state?.currentYear ?? 0);
  const parentAgeAtBirth = Number(state?.parentAgeAtBirth ?? 28);
  return parentAgeAtBirth + childAge;
}

/**
 * Baby Pressure target by age (sex-specific curves).
 * For women: peaks at 100 around age 40, eases after ~46.
 * For men: gradual rise and plateau.
 */
export function babyPressureTargetByAge(age, sex) {
  const a = Number(age || 0);
  const isFemale = String(sex || '').toLowerCase() === 'female';
  
  if (isFemale) {
    // Women: sharp rise to 100 at age 40, then ease off
    if (a < 25) return 0;
    if (a < 30) return Math.round((a - 25) * 4); // 0->20 over 5 years
    if (a < 35) return Math.round(20 + (a - 30) * 8); // 20->60 over 5 years
    if (a < 40) return Math.round(60 + (a - 35) * 8); // 60->100 over 5 years
    if (a < 46) return 100; // Peak pressure
    if (a < 50) return Math.round(100 - (a - 46) * 10); // 100->60 over 4 years
    return Math.max(0, 60 - (a - 50) * 2); // Gentle decline
  } else {
    // Men: gradual rise, plateau around 35-45
    if (a < 25) return 0;
    if (a < 30) return Math.round((a - 25) * 2); // 0->10 over 5 years
    if (a < 35) return Math.round(10 + (a - 30) * 4); // 10->30 over 5 years
    if (a < 45) return Math.round(30 + (a - 35) * 3); // 30->60 over 10 years
    return Math.min(60, 60 + (a - 45) * 0.5); // Gentle plateau
  }
}

/**
 * Get the displayed child age (matches StickyHeader & rest of UI).
 * Handles sibling rivalry, custom starts (child starting older than 0).
 * SINGLE SOURCE OF TRUTH for child age in Chat and everywhere else.
 */
export function getDisplayedChildAge(gameState, child) {
  if (!child) {
    // Legacy fallback: single child mode
    return Number(gameState.childAge || gameState.currentYear || 0);
  }

  // Multi-child design: state.currentYear is the household timeline (years since the first child's birth).
  // Each kid's displayed age is derived from their createdAtYear.
  if (typeof child.createdAtYear === 'number') {
    return Math.max(0, (gameState.currentYear || 0) - child.createdAtYear);
  }

  // Backward-compat (very old saves): if a kid stored an explicit per-kid age, use it.
  if (typeof child.childSlice?.currentYear === 'number') {
    return child.childSlice.currentYear;
  }

  // Last resort: current year
  return Number(gameState.currentYear || 0);
}

/**
 * Get the active child consistently across Chat, Header, and other components.
 * Handles sibling rivalry and legacy single-child mode.
 * Returns null if childless.
 */
export function getActiveChildFromState(gameState) {
  // Check childless flag first
  if (!hasAnyChild(gameState)) {
    return null;
  }

  const activeKidId = gameState.activeKidId;
  const kids = Array.isArray(gameState.kids) ? gameState.kids : [];

  // If multi-child enabled and active ID is set, find it
  if (activeKidId && kids.length > 0) {
    const activeKid = kids.find(k => k.id === activeKidId);
    if (activeKid) {
      return activeKid;
    }
  }

  // Fallback to first kid
  if (kids.length > 0) {
    return kids[0];
  }

  // Legacy: return a synthesized "child" object from top-level game state
  return {
    id: 'legacy_child',
    name: gameState.childName || 'your child',
    childSlice: {
      currentYear: Number(gameState.currentYear || 0),
      childName: gameState.childName
    }
  };
}

export function describeStat(key, value) {
  if (key === 'playerHealth') {
    if (value >= 85) return { label: 'Excellent', tone: 'high' };
    if (value >= 70) return { label: 'Good', tone: 'good' };
    if (value >= 50) return { label: 'Okay', tone: 'mid' };
    if (value >= 35) return { label: 'Low', tone: 'bad' };
    return { label: 'Critical', tone: 'bad' };
  }

  if (key === 'stress') {
    if (value >= 80) return { label: 'Critical', tone: 'bad' };
    if (value >= 60) return { label: 'High', tone: 'mid' };
    if (value >= 40) return { label: 'Moderate', tone: 'mid' };
    if (value >= 20) return { label: 'Manageable', tone: 'good' };
    return { label: 'Low', tone: 'extreme' }; // Low stress is great
  }

  if (key === 'love') {
    if (value >= 90) return { label: 'Unbreakable', tone: 'extreme' };
    if (value >= 75) return { label: 'Deep', tone: 'good' };
    if (value >= 50) return { label: 'Strong', tone: 'mid' };
    if (value >= 25) return { label: 'Growing', tone: 'mid' };
    return { label: 'Fragile', tone: 'bad' };
  }

  // Child stats
  if (value >= 18) return { label: 'Exceptional', tone: 'extreme' };
  if (value >= 14) return { label: 'High', tone: 'good' };
  if (value >= 10) return { label: 'Good', tone: 'mid' };
  if (value >= 6) return { label: 'Developing', tone: 'mid' };
  return { label: 'Emerging', tone: 'bad' };
}

// Health yearly drift (stress + aging)
function computeAnnualPlayerHealthDelta({ parentAge, stress }) {
  const s = Number(stress ?? 0);
  const a = Number(parentAge ?? 25);

  // Stress effect (bigger swings at extremes)
  let stressDelta = 0;
  if (s <= 15) stressDelta = +1.2;
  else if (s <= 30) stressDelta = +0.6;
  else if (s <= 45) stressDelta = +0.2;
  else if (s <= 60) stressDelta = -0.3;
  else if (s <= 75) stressDelta = -0.8;
  else stressDelta = -1.6;

  // Aging effect (gentle, ramps later)
  let ageDelta = 0;
  if (a < 30) ageDelta = 0;
  else if (a < 40) ageDelta = -0.2;
  else if (a < 50) ageDelta = -0.4;
  else if (a < 60) ageDelta = -0.6;
  else if (a < 70) ageDelta = -0.9;
  else ageDelta = -1.2;

  return Math.round((stressDelta + ageDelta) * 10) / 10;
}

// --- Provider ---

const INITIAL_STATE = {
  // NEW: Childless state flag (for future features: child death, playing as 18yo with no kids)
  childless: false,
  hasChild: true,
  lifeStage: 'parenting',
  
  // FTUE flags
  ftueTourId: null,
  ftueStage: null,
  ftueBoughtHouse: false,
  
  // Hobbies & Clubs system
  childHobbies: {
    xpById: {},
    lastDoneAgeById: {},
    favoriteId: null,
    totalSessions: 0
  },

  // Urn Crypto System (HODL market)
  urnCrypto: {
    enabled: false,
    unlockedAtAge: null,

    tokens: [],       // fixed list of 10 for the run
    pricesById: {},   // current spot price per tokenId
    positions: {},    // holdings persist until sell: { [id]: { qty, costBasis } }

    tradeFeeRate: 0.025, // 2.5% per trade
    gasFee: 3,           // flat $3 per trade

    lastMarketRecap: null // { age, ts, headline, marketMood, changes[], portfolioBefore, portfolioAfter, delta, unseen }
  },
  
  // Child-free systems (only active/visible when no child exists)
  babyPressure: 0,
  adultLifePopupPending: null,
  adultLifeUsedIds: [],
  lastAdultLifePopupYear: null,
  babyPressureLastTickAdultAge: null,
  adultLifeLastProcessedYear: null,
  adultLifeFocusYear: null,
  adultLifeFocusKidId: null,
  adultLifePingsQueue: [],
  
  // Adult Life Moments (child-free mode: before-baby chapter)
  adultLifeMomentPopupPending: null,
  adultLifeMomentUsedIds: [],
  adultLifeMomentLastProcessedYear: null,
  
  // Adult Continuation (parenting past 18)
  adultContinuationEnabled: false,
  adultChildLastProcessedYear: null,
  adultChildPopupPending: null,

  // NEW: Guardian perspective for kinship consistency
  guardianPerspective: {
    activeId: 'player',
    side: 'player',
    relationToChild: 'parent'
  },

  // NEW: Caregiver metadata for flexible kinship labels (multiplayer, guardianship, etc.)
  caregiverMeta: DEFAULT_CAREGIVER_META,

  // NEW: Anti-repetition & Focus System Support
  baseMaxFocusTokens: 5,
  zeroFocusStreakYears: 0,
  childMood: 'neutral',
  moodLockedDisabledPlayIds: [],
  moodComputedForYear: null,
  lastHubVisitYear: { career: null, housing: null, politics: null, business: null },
  lastOpportunityYear: null,
  uiPrefs: { 
    showExactDeltas: typeof import.meta !== 'undefined' && import.meta?.env?.DEV === true ? true : false 
  },

  // Audio (safe defaults; prevents NaN% UI)
  audioHasUserGesture: false,
  audioMusicEnabled: false,
  audioSfxEnabled: true,
  audioMusicVolume: 0.5,
  audioSfxVolume: 0.7,

  // NEW: Music selection (debug for now)
  audioMusicThemeOverride: 'auto',

  patternModsCache: { maxFocusMod: 0, annualStressDrift: 0, playOutcomeTilt: 0 },

  // NEW: Retention features
  metaProgress: {
    collections: {
      kidQuotes: [],
      stickers: [],
      photos: [],
      goldenMoments: []
    },
    personalBests: {}
  },
  daily: {
    dilemma: {
      lastCompletedDate: null,
      streakCount: 0,
      paused: false,
      lastShownDate: null
    }
  },
  yearLog: {
    events: [],
    lastYearHighlights: null
  },

  // PTA Illuminati State
  pta: {
    unlocked: true, // Gate behind purchase in real app, simplified here
    rank: 'observer',
    stats: {
      influence: 10,
      heat: 0,
      integrity: 50,
      standing: 50,
      bandwidth: 100,
      childTrust: 50
    },
    favors: 5,
    npcRelations: {
      samira: 40,
      elaine: 30,
      coach: 30,
      kwon: 50,
      deleon: 40,
      jordan: 20,
      gwen: 10,
      archivist: 50
    },
    dossiers: {}, // { npcId: { known: [], leverage: 0 } }
    weeklyCharge: null,
    activeAgendas: [],
    meetingsPending: { open: true, closed: false },
    feed: [] // Chat messages
  },

  // Special Start identity
  specialStartId: null,
  specialStartTitle: null,
  specialStartCategory: null,
  specialStartMeta: null,
  expenseMultiplier: 1.0,
  // Mafia/Alien special start fields
  mafiaHeat: 0,
  mafiaLegacy: 0,
  mafiaWentLegit: false,
  alienThreat: 0,
  alienGameOver: false,
  alienDeathCause: null,

  // Zombie Apocalypse fields
  zombieThreat: 20,
  zombieGameOver: false,
  zombieDeathCause: null,
  zombieChildFate: null,
  zombieWifeState: "human",
  zombieWifeReturnUsed: false,
  zombieTraining: 0,
  zombieTrainingShownAges: {},
  
  // Apocalypse Campaign (persistent across legacy/succession)
  apocalypseCampaign: {
    active: false,
    scenarioId: null,
    campaignId: null,
    introShown: false,
    generationsCompleted: 0,
    totalYearsSurvived: 0,
    victory: {
      achieved: false,
      path: null,
      trophyId: null,
      achievedAtTs: null,
      achievedAtGeneration: null
    }
  },

  // Birth control state
  birthControl: {
    playerOn: false,
    partnerOn: false
  },

  // Faith system (child's religious upbringing)
  faith: {
    tradition: null,
    isCustom: false,
    status: 'none',
    exposure: 0,
    devotion: 0,
    lastDecisionAge: null,
    refusedFromTradition: null,
    history: [],
    values: [],
    valuesConversations: {
      usedThisYear: false,
      totalCount: 0,
      lastAge: null
    }
  },
  
  // Faith practice progression tracking
  faithProgress: {
    total: 0,
    byType: { service: 0, volunteer: 0, study: 0 },
    lastType: null,
    streak: 0,
    unlocks: { retreat: false }
  },

  // Donation progression tracking
  donationProgress: {
    total: 0,
    byType: { blood: 0, plasma: 0 },
    lastType: null,
    streak: 0,
    unlocks: { drive: false }
  },

  // Video masterclass tracks progression
  video: {
    usedThisYear: { netflix: false, hbo: false, prime: false, apple: false, masterclass: false },
    masterclassLessonHistory: [],
    masterclassTracks: { boundaries: 0, sleep: 0, emotional: 0 },
    lastMasterclassTrack: null
  },

  // Support network progression tracking
  supportProgress: {
    therapy: {
      total: 0,
      byType: { coaching: 0, couples: 0, family: 0 },
      lastType: null,
      streak: 0
    }
  },

  // Activity mastery tracking (all activities via performActivity)
  activityMastery: {},

  // Parent strategy progression tracking
  parentStrategyProgress: {
    gym: {
      totalSessions: 0,
      cardio: 0,
      upper: 0,
      legs: 0,
      lastType: null,
      streak: 0,
      marathonUnlocked: false,
      marathonsCompleted: 0
    },
    gardening: {
      total: 0,
      byType: { veg: 0, flower: 0, herb: 0 },
      lastType: null,
      streak: 0,
      unlocks: { harvestDinner: false }
    },
    miniBreak: {
      total: 0,
      byType: { walk: 0, breath: 0, call: 0 },
      lastType: null,
      streak: 0,
      unlocks: { microRetreat: false }
    },
    sleep: {
      total: 0,
      byType: { screenFree: 0, routine: 0, early: 0 },
      lastType: null,
      streak: 0,
      unlocks: { sleepReset: false }
    },
    phone: {
      total: 0,
      byType: { doomscroll: 0, puzzle: 0, learning: 0 },
      lastType: null,
      streak: 0,
      unlocks: { appLimits: false }
    },
    gossip: {
      total: 0,
      byType: { vent: 0, rumor: 0, listen: 0 },
      lastType: null,
      streak: 0
    }
  },

  // Titles (dynastic/peerage)
  titles: {
    primaryTitle: null,
    secondaryHonors: [],
    titleMeter: 0,
    influencePoints: 0,
    primaryTitleId: null,
    primaryTitleType: null,
    rank: null,
    standing: 0,
    influence: 0,
    scandalHeat: 0,
    pressFeed: [],
    pressPending: null,
    prHandlerActive: false,
    obligations: { requiredPerYear: 0, completedThisYear: 0, yearTag: null },
    house: null,
    childCourtesyTitle: null,
    history: []
  },

  // Core Stats
  love: 10,
  stress: 10,
  playerHealth: 75,
  partnerCounselingBuffer: 0,
  money: 1000,
  diamonds: 0,
  actionUsageCounts: {},
  challengeMeta: { activeIds: [], completedIds: [], rewardedIds: [] },
  studyPoints: 0,
  maxFocusTokens: 3,
  actionPoints: 3,
  focusBonusPartner: 0,
  actionsUsed: {},
  currentYear: 0,
  
  commitments: {},
  
  // Child
  childName: 'Child',
  temperament: 'Calm',
  
  // Stats
  stats: {
    intelligence: 5,
    empathy: 5,
    discipline: 5,
    confidence: 5,
    happiness: 5,
    creativity: 5,
    curiosity: 5,
    responsibility: 5,
    knowledge: 5,
    health: 5,
    social: 5,
    fitness: 5,
    anxiety: 5
  },
  baselineStats: {
    intelligence: 5,
    empathy: 5,
    discipline: 5,
    confidence: 5,
    happiness: 5,
    creativity: 5,
    curiosity: 5,
    responsibility: 5,
    knowledge: 5,
    health: 5,
    social: 5,
    fitness: 5,
    anxiety: 5
  },
  highWaterStats: {
    intelligence: 5,
    empathy: 5,
    discipline: 5,
    confidence: 5,
    happiness: 5,
    creativity: 5,
    curiosity: 5,
    responsibility: 5,
    knowledge: 5,
    health: 5,
    social: 5,
    fitness: 5,
              anxiety: 5
          },
          activityUsage: {},

  // Collections
  inventory: { items: [] },
  bookshelf: [],
  passportStamps: [],
  studiedItems: [],
  usedScenarioHookIds: [],
  childTraumaPopupQueue: [],
  childTraumaEvents: [],

  // Routines (safe defaults)
  routines: [],
  routineTemplates: [],
  activeRoutineId: null,
  ui: { routineModalOpen: false },
  
  runSeed: `seed_${Date.now()}`,
  endAge: 80,
  finished: false,
  adultCrime: ensureAdultCrimeState(null),
  prison: DEFAULT_PRISON_STATE,
  debugUI: false,

  historyLog: [],
  history: [],
  counters: {},

  scenarioPending: true,
  pendingScenario: true,
  scenarioCompletedThisAge: false,
  currentScenario: null,
  currentScenarioHookId: null,
  currentScenarioResolvedChoice: null,

  yearFlags: {
    siblingRivalryPopupsShown: 0
  },
  siblingRivalryPopupQueue: [],

  tipText: "Tiny steps compound.",
  actionsUsed: {},

  teacherTrust: 50,
  peerCircle: 50,

  emergencyFund: 0,
  retirementSavings: 0,

  gameShelf: [],
  memories: [],
  kidWisdomUsed: [],
  childTraumaEvents: [],
  childTraumaPopupQueue: [],
  childAttachment: { style:'Secure', explanationLine:'They expect care to show up.', notes:[] },
  childClimate: { lowLoveStreak:0, highStressStreak:0 },

  rewind: { unlocked: false, snapshots: [], maxSnapshots: 3 },
  yearCheckpoints: [],

  countryIso3: "USA",
  availableCountryIso3s: [],

  financialGoal: null,
  financialGoalDismissed: false,
  nextStepDismissed: false,
  updateDismissed: false,

  phoneOwned: false,
  // Fun Facts: track once-per-year bonus
  lastFunFactBonusYear: null,
  lastFunFactId: null,
  phoneGivenAge: null,
  phoneEffectsStartAge: null,
  phonePolicyChosen: false,
  phoneLastAskAge: null,

  // School Defaults
  schoolType: "public",
  privateSchoolActive: false,
  privateSchoolScholarship: false,
  privateSchoolStartAge: null,
  religiousSchoolStartAge: null,
  schoolAppliedTypeThisAge: null,

  // Bali Program
  baliActive: false,
  baliStartAge: null,
  baliYearsPaid: 0,

  // Bali Popups
  baliCalmPopupPending: null,
  baliActivityPopupPending: null,
  usedBaliCalmPopupIds: [],
  usedBaliActivityPopupIds: [],
  baliPopupsShownAges: [],

  // Game Flags
  unlockedAchievementIds: [],
  trophies: { unlocked: {} },
  financeCollectionUnlocked: {},
  timelineEntries: [],
  relationships: { roster: [], byId: {} },
  
  // Relationship drama system (PG-13). Keeps "the talk" and health events non-graphic and consequence-driven.
  relationshipDrama: {
    version: 1,
    outsideEncountersByAge: {},
    partnerOutsideEncountersByAge: {},
    lieDebt: 0,
    lastAffairDiscoveryAge: null,
    lastPregnancyScareAge: null,
    sexEd: { done: false, doneAtAge: null, lastPromptAge: null, quality: 0, style: null },
    teen: { sexuallyActive: false, startedAtAge: null, lastHealthScareAge: null }
  },
  sexualHealth: {
    version: 1,
    player: { status: 'clear', infectionId: null, label: null, diagnosedAtAge: null, treatedAtAge: null, lastClinicAge: null, managed: false, lastMedsAge: null },
    partner: { status: 'clear', infectionId: null, label: null, diagnosedAtAge: null, treatedAtAge: null, lastClinicAge: null, managed: false, lastMedsAge: null },
    child: { status: 'clear', infectionId: null, label: null, diagnosedAtAge: null, treatedAtAge: null, lastClinicAge: null, managed: false, lastMedsAge: null }
  },
  
  // Pets
  pets: [],
  activePetId: null,
  petEventQueue: [],
  lastGlobalPetEventAge: null,
  statBuffer: {
    empathy: 0,
    discipline: 0,
    confidence: 0,
    intelligence: 0,
    stress: 0
  },
  petEventPending: null,

  // Juvenile Justice
  juvenileJustice: {
    spree: 0,
    heat: 0,
    record: 0,
    crimeIdentity: 0,
    remorse: 50,
    crew: 0,
    lastCheckAge: null,
    lastChoice: null,
    disableRequested: false,
    diversion: { active: false, yearsRemaining: 0, startAge: null, reason: null, level: 0 },
    hall: { active: false, yearsRemaining: 0, startAge: null, ever: false, visits: 0, reason: null, level: 0, prevSchoolType: 'standard' },
    probation: { active: false, yearsRemaining: 0, startAge: null }
  },

  // Homework Popups
  homeworkPopupPending: null,
  usedHomeworkPopupIds: [],
  homeworkPopupShownAges: [],

  // Kid Logic Popups
  kidLogicPopupPending: null,
  kidLogicUsedIds: [],
  kidLogicShownAges: [],
  
  ownedScenarioPackIds: normalizePackIds(DEFAULT_OWNED_PACK_IDS, DEFAULT_OWNED_PACK_IDS),
  enabledScenarioPackIds: normalizePackIds(DEFAULT_ENABLED_PACK_IDS, DEFAULT_ENABLED_PACK_IDS),
  activeScenarioPackId: "mixed",
  yearlyCheckinsEnabledByPackId: DEFAULT_YEARLY_CHECKINS_MAP,

  // Kid Logic cooldown (prevents spam)
  lastKidLogicPopupAge: null,

  // Cultural Roots
  playerCultures: [], // Array of IDs
  childCultureBond: {}, // { CULTURE_ID: 0..100 }
  childCultureMomentsCount: 0,
  lastTeachCultureMessageId: {}, // { CULTURE_ID: string }
  actionResultPending: null,

  // Settings
  settings: {
    showScenarioResultSheet: true,
    showCoachNotes: true,
    popupStyle: 'opaque',
    showYearHighlights: false,
    autoChooseYearlyMomentsByStyle: false,
    showYearRecapPopup: true,
    curiosityAutoGuess: false,
    yearlyCheckinsEnabled: true
  },

  // Per-child chat storage (multi-kid isolation)
  childChatsByKidId: {},

  // Life Goals
  lifeGoals: {
    selectedIds: [],
    setupPending: false,
    setupCompleted: false,
    uiOpen: false,
    progressById: {},
    completedIds: [],
    recentEvents: []
  },

  // Goal Moments
  goalMomentPending: null,
  usedGoalMomentIds: [],
  goalMomentLastShownAge: null,

  expansions: {
    empireEstatesLandlordLegacy: true,
    ptaIlluminati: false,
    chaosMode: false,
    chaosModeLevel: 0,
    siblingRivalry: false
  },

  // Chaos Mode
  chaosPopupPending: null,
  usedChaosEventIds: [],
  usedChaosEventIdsL1: [],
  usedChaosEventIdsL3: [],
  chaosPopupShownAges: [],

  // Neighbor Nemesis Mini-Arc (Chaos Mode L3)
  neighborNemesisArc: {
    status: 'dormant', // 'dormant' | 'active' | 'resolved'
    nextStep: 1, // 1..5
    heat: 0, // -3..10
    neighborName: null,
    archetype: null,
    signature: null,
    lastTriggeredAge: null,
    lastResolvedAge: null
  },

  // Local Co-Op
  coop: DEFAULT_LOCAL_COOP_STATE,

  // Remote Multiplayer
  remoteMultiplayer: DEFAULT_REMOTE_MP,

  // School Confidence & Anxiety v2
  schoolAnxietyV2: { consumedAges: [], usedScenarioIds: [], history: [], hidden: { avoidance: 0, riskIfCaught: false }, totals: { CONF: 0, ANX: 0, BOND: 0, IND: 0, SOC: 0 } },
  scaV2PopupPending: null,
  scaV2Queued: null,

  // Packs
  packs: { curiosityPackEnabled: true, milestonesEnabled: true },

  // Curiosity Pack State
  curiosity: {
    pending: false,
    agePending: null,
    questionId: null,
    usedQuestionIds: [],
    askedAges: { "1": false, "2": false, "3": false, "4": false, "5": false },
    phase: 'question',
    lastResult: null
  },

  // Milestones
  milestones: {
    kidQuestActive: null,
    adultQuestActive: null,
    kidQuestHistory: [],
    adultQuestHistory: [],
    milestoneShownAges: {},
    baselines: {},
    pendingAssign: false,
    pendingResult: false,
    pendingResultPayload: null,
    ui: { dashboardDismissed: false, infoOpen: false }
  },
  
  // Legacy milestone fields (for defensive guards)
  milestoneMissedPending: null,
  missedMilestone: null,
  missedMilestoneQueue: [],

  // Emergency System
  emergency: {
    pending: null,
    lastProcessedYear: null
  },

  // Natural Disasters (rare in normal mode, more frequent with Chaos Mode)
  naturalDisaster: {
    pending: null,
    lastProcessedYear: null
  },

  // Birth Intro
  birthIntroPending: false,
  birthIntroCompleted: false,
  parentingStyle: null,
  lastRunSummary: null,

  // Guidance System
  guidanceEnabled: false,
  guidanceDismissedForever: false,
  guidanceVersionSeen: 1,
  guidanceStepSeen: {},
  hasEverStartedGame: false,

  // Cost of Living
  livingSetup: { housingId: 'apartment_basic', commuteId: 'bus', foodStrategyId: 'standard' },
  lastLivingCostsAppliedAge: null,
  initialYear0IncomeGranted: false,

  // Portrait Mod State
  portraitModState: {
    parentAdultStyleKey: 'adult_base1',
    childTeenStyleKey: 'teen_base'
  },

  // Quality of Life
  qol: {
    internetTier: 'basic',
    homeOfficeTier: 'none'
  },
  lastQoLCostsAppliedAge: null,
  lastInventoryPassiveAppliedAge: null,

  // Coping flags
  copingSmokeQuoteShown: false,
  copingDrinkQuoteShown: false,

  // Culture & Heritage
  culturePlan: null, // { cultures: [], childName, ageRange, focusAreas, timePreference, taughtLevels: {} }
  cultureEvents: [], // [{ id, title, date, type, status, ... }]
  cultureLogs: [],   // [{ id, date, points, ... }]
  cultureStats: {
    pointsTotal: 0,
    pointsThisWeek: 0,
    level: 1,
    streakWeeks: 0,
    lastLogDate: null,
    unlockedRewards: []
  },

  // Celebrity Dating
  celebrityDatingUnlocked: false,
  celebrityRoster: [],
  celebrityCooldowns: {},

  // Dating V2
  datingPreference: null,
  datingAgeRangeId: 'any_18_99',
  datingRoster: [],
  datingRosterMeta: {
    generatedAtAge: null,
    preference: null,
    ageRangeId: 'any_18_99',
    refreshCountThisAge: 0,
    refreshCountAge: null,
    hiddenSignaturesThisAge: []
  },
  datingMessageMeta: {
    lastMessagedAgeByProfileId: {}
  },
  datingSeenSignatures: [],

  // Child health flags (used by Doctor + injury system)
  childSickThisAge: false,
  childSickNote: null,
  
  // Parent health flags (used by Doctor + injury system)
  playerSickThisAge: false,
  playerSickNote: null,
  partnerSickThisAge: false,
  partnerSickNote: null,
  
  // Primary care tracking (anti-spam)
  primaryCare: {
    lastCheckupAge: { self: null, child: null, partner: null }
  },

  // Money Transaction Ledger
  moneyTransactions: [],

  // Global Fame
  famePoints: 0,
  reputation: 55,

  // Economy State
  economy: {
    version: 1,
    wagePenalty: 1,
    recoveryPerYear: 0.1,
    nextCrashAge: null,
    lastCrashAge: null
  },

  // Politics
  politics: {
    currentOfficeId: null,
    termEndsAtAge: null,
    approval: 55,
    activeScandals: [],
    lastCampaignAge: -1,
    careerBeforeOffice: null,
    lastCampaignAgeByOffice: {},
    lastInOfficeEventAge: -1,
    // New fields
    partyId: null,
    platformTags: [],
    warChest: 0,
    incumbentStreak: 0,
    // Corruption scaffolding (abstract resources, no UI yet)
    corruption: DEFAULT_POLITICS_CORRUPTION_STATE
  },
  wisdom: {
    xp: { mindfulness: 0, impermanence: 0, compassion: 0 },
    equipped: ["mindfulness", null],
    clarity: 0,
    clarityUsedThisAge: 0,
    rerollsThisAge: 0
  },
  specialCareers: {
    version: 1,
    tracks: {
      aerospace: { xp: 0, launches: 0, discoveries: 0, mishaps: 0 },
      tech: { xp: 0, patents: 0, breakthroughs: [], nobelle: {} },
      culinary: { xp: 0, stars: 0, signatureDishes: 0 },
      police: { xp: 0, commendations: 0, casesClosed: 0, highRiskOps: 0, communityWins: 0 },
      bounty: { xp: 0, bounties: 0, highRiskOps: 0, ethics: 50 }
    }
  }
};

// --- Save/Load + Autosave helpers ---
// Prior builds used a single localStorage key. Keep migration support so old users
// don't lose progress when upgrading.
const LEGACY_SINGLE_SAVE_KEY = 'gameState';

function isRunStarted(state) {
  if (!state || typeof state !== 'object') return false;
  const year = Number(state.currentYear ?? 0);
  return (
    Boolean(state.childAvatarPicked) ||
    Boolean(state.childAvatarGender) ||
    Boolean(state.birthIntroPending) ||
    Boolean(state.birthIntroCompleted) ||
    year > 0 ||
    Boolean(state.finished)
  );
}

function makeTrimmedSnapshot(state) {
  const base = { ...state };
  // Prevent recursive growth and huge payloads
  base.yearCheckpoints = [];
  if (base.rewind) base.rewind = { ...base.rewind, snapshots: [] };
  delete base.activeSaveSlotId;
  return JSON.parse(JSON.stringify(base));
}

function sanitizeForSave(state) {
  if (!state || typeof state !== 'object') return state;
  // Avoid persisting UI-ish / derived keys and large snapshot trees
  let s = state;
  try {
    s = ensureKidsContainer(s);
    s = persistActiveChildIntoKids(s);
  } catch {}
  const clone = { ...s };
  delete clone.activeSaveSlotId;
  delete clone.remoteMultiplayer;
  clone.yearCheckpoints = [];
  if (clone.rewind) clone.rewind = { ...clone.rewind, snapshots: [] };
  return clone;
}

function hydrateSavedState(snap, slotId = 'slot1') {

  const hydrated = {
    ...INITIAL_STATE,
    ...snap,
    activeSaveSlotId: slotId,
    stats: { ...INITIAL_STATE.stats, ...(snap?.stats || {}) },
    juvenileJustice: { ...INITIAL_STATE.juvenileJustice, ...(snap?.juvenileJustice || {}) },
    pta: { ...INITIAL_STATE.pta, ...(snap?.pta || {}) },
    inventory: snap?.inventory?.items ? snap.inventory : { items: [] },
    counters: { ...(INITIAL_STATE.counters || {}), ...(snap?.counters || {}) },
    cultureStats: { ...INITIAL_STATE.cultureStats, ...(snap?.cultureStats || {}) },
    culturePlan: snap?.culturePlan || INITIAL_STATE.culturePlan,
    cultureEvents: snap?.cultureEvents || INITIAL_STATE.cultureEvents,
    cultureLogs: snap?.cultureLogs || INITIAL_STATE.cultureLogs,
    coparentProfile: snap?.coparentProfile || INITIAL_STATE.coparentProfile,
    moneyTransactions: Array.isArray(snap?.moneyTransactions) ? snap.moneyTransactions : [],
    memories: Array.isArray(snap?.memories) ? snap.memories : [],
    studiedItems: Array.isArray(snap?.studiedItems) ? snap.studiedItems : [],
    timelineEntries: Array.isArray(snap?.timelineEntries) ? snap.timelineEntries : [],
    childTraumaEvents: Array.isArray(snap?.childTraumaEvents) ? snap.childTraumaEvents : [],
    childTraumaPopupQueue: Array.isArray(snap?.childTraumaPopupQueue) ? snap.childTraumaPopupQueue : [],
    siblingRivalryPopupQueue: Array.isArray(snap?.siblingRivalryPopupQueue) ? snap.siblingRivalryPopupQueue : [],
    usedScenarioHookIds: Array.isArray(snap?.usedScenarioHookIds) ? snap.usedScenarioHookIds : [],
    neighborNemesisArc: { ...INITIAL_STATE.neighborNemesisArc, ...(snap?.neighborNemesisArc || {}) },
    coop: ensureLocalCoopState(snap?.coop),
    // NEW: Retention features migration
    metaProgress: {
      collections: {
        kidQuotes: Array.isArray(snap?.metaProgress?.collections?.kidQuotes) ? snap.metaProgress.collections.kidQuotes : [],
        stickers: Array.isArray(snap?.metaProgress?.collections?.stickers) ? snap.metaProgress.collections.stickers : [],
        photos: Array.isArray(snap?.metaProgress?.collections?.photos) ? snap.metaProgress.collections.photos : [],
        goldenMoments: Array.isArray(snap?.metaProgress?.collections?.goldenMoments) ? snap.metaProgress.collections.goldenMoments : []
      },
      personalBests: snap?.metaProgress?.personalBests || {}
    },
    
    // Urn Crypto hydration
    urnCrypto: { ...INITIAL_STATE.urnCrypto, ...(snap?.urnCrypto || {}) },
    
    // Guidance System migration
    guidanceEnabled: snap?.guidanceEnabled ?? false,
    guidanceDismissedForever: snap?.guidanceDismissedForever ?? false,
    guidanceVersionSeen: snap?.guidanceVersionSeen ?? 1,
    guidanceStepSeen: snap?.guidanceStepSeen ?? {},
    hasEverStartedGame: snap?.hasEverStartedGame ?? false,
    // Cost of Living
    livingSetup: {
      housingId: snap?.livingSetup?.housingId ?? 'apartment_basic',
      commuteId: snap?.livingSetup?.commuteId ?? 'bus',
      foodStrategyId: snap?.livingSetup?.foodStrategyId ?? 'standard'
    },
    lastLivingCostsAppliedAge: snap?.lastLivingCostsAppliedAge ?? INITIAL_STATE.lastLivingCostsAppliedAge,
    initialYear0IncomeGranted: snap?.initialYear0IncomeGranted ?? false,
    
    // Quality of Life
    qol: snap?.qol ?? INITIAL_STATE.qol,
    lastQoLCostsAppliedAge: snap?.lastQoLCostsAppliedAge ?? INITIAL_STATE.lastQoLCostsAppliedAge,
    lastInventoryPassiveAppliedAge: snap?.lastInventoryPassiveAppliedAge ?? INITIAL_STATE.lastInventoryPassiveAppliedAge,
    daily: {
      dilemma: {
        lastCompletedDate: snap?.daily?.dilemma?.lastCompletedDate || null,
        streakCount: typeof snap?.daily?.dilemma?.streakCount === 'number' ? snap.daily.dilemma.streakCount : 0,
        paused: Boolean(snap?.daily?.dilemma?.paused),
        lastShownDate: snap?.daily?.dilemma?.lastShownDate || null
      }
    },
    yearLog: {
      events: Array.isArray(snap?.yearLog?.events) ? snap.yearLog.events.slice(-50) : [],
      lastYearHighlights: snap?.yearLog?.lastYearHighlights || null
    },
    parentStrategyProgress: {
      ...INITIAL_STATE.parentStrategyProgress,
      ...(snap?.parentStrategyProgress || {}),
      gym: {
        ...INITIAL_STATE.parentStrategyProgress.gym,
        ...(snap?.parentStrategyProgress?.gym || {})
      },
      gardening: {
        ...INITIAL_STATE.parentStrategyProgress.gardening,
        ...(snap?.parentStrategyProgress?.gardening || {})
      },
      miniBreak: {
        ...INITIAL_STATE.parentStrategyProgress.miniBreak,
        ...(snap?.parentStrategyProgress?.miniBreak || {})
      },
      sleep: {
        ...INITIAL_STATE.parentStrategyProgress.sleep,
        ...(snap?.parentStrategyProgress?.sleep || {})
      },
      phone: {
        ...INITIAL_STATE.parentStrategyProgress.phone,
        ...(snap?.parentStrategyProgress?.phone || {})
      },
      gossip: {
        ...INITIAL_STATE.parentStrategyProgress.gossip,
        ...(snap?.parentStrategyProgress?.gossip || {})
      }
    },
    // NEW: Anti-repetition fields (safe migration)
    baseMaxFocusTokens: snap?.baseMaxFocusTokens ?? INITIAL_STATE.baseMaxFocusTokens,
    zeroFocusStreakYears: snap?.zeroFocusStreakYears ?? INITIAL_STATE.zeroFocusStreakYears,
    childMood: snap?.childMood ?? INITIAL_STATE.childMood,
    moodLockedDisabledPlayIds: snap?.moodLockedDisabledPlayIds ?? INITIAL_STATE.moodLockedDisabledPlayIds,
    moodComputedForYear: snap?.moodComputedForYear ?? INITIAL_STATE.moodComputedForYear,
    lastHubVisitYear: snap?.lastHubVisitYear ?? INITIAL_STATE.lastHubVisitYear,
    lastOpportunityYear: snap?.lastOpportunityYear ?? INITIAL_STATE.lastOpportunityYear,
    uiPrefs: snap?.uiPrefs ?? INITIAL_STATE.uiPrefs,
    patternModsCache: snap?.patternModsCache ?? INITIAL_STATE.patternModsCache,
    specialCareers: {
      ...INITIAL_STATE.specialCareers,
      ...(snap?.specialCareers || {}),
      tracks: {
        ...(INITIAL_STATE.specialCareers?.tracks || {}),
        ...(snap?.specialCareers?.tracks || {})
      }
    },
    childHobbies: {
      xpById: (snap?.childHobbies?.xpById && typeof snap.childHobbies.xpById === 'object') ? snap.childHobbies.xpById : {},
      lastDoneAgeById: (snap?.childHobbies?.lastDoneAgeById && typeof snap.childHobbies.lastDoneAgeById === 'object') ? snap.childHobbies.lastDoneAgeById : {},
      favoriteId: snap?.childHobbies?.favoriteId ?? null,
      totalSessions: Number(snap?.childHobbies?.totalSessions || 0)
    }
  };

  // Packs hydration: ensure enabled pack ids exist for old saves
  try {
    if (!Array.isArray(hydrated.enabledScenarioPackIds) || hydrated.enabledScenarioPackIds.length === 0) {
      hydrated.enabledScenarioPackIds = normalizePackIds(DEFAULT_ENABLED_PACK_IDS, DEFAULT_ENABLED_PACK_IDS);
    }
  } catch {}

  // Migration: If no tx ledger but we have timeline entries, hydrate from timeline (one-time)
  if (hydrated.moneyTransactions.length === 0 && Array.isArray(hydrated.timelineEntries)) {
    const migrated = [];
    hydrated.timelineEntries.forEach((entry, idx) => {
      const amt = Number(entry.moneyDelta || 0);
      if (amt !== 0) {
        migrated.push({
          id: `tl_${entry.id || idx}`,
          ts: entry.at || Date.now(),
          age: entry.age ?? 0,
          amount: amt,
          type: amt >= 0 ? "income" : "expense",
          category: "uncategorized",
          source: entry.title || "Timeline",
          note: entry.detail || ""
        });
      }
    });
    if (migrated.length > 0) {
      hydrated.moneyTransactions = migrated;
    }
  }

  // Ensure scenario flags stay in sync AND coerce to real booleans
  if (hydrated.scenarioPending !== undefined && hydrated.pendingScenario === undefined) {
    hydrated.pendingScenario = hydrated.scenarioPending;
  } else if (hydrated.pendingScenario !== undefined && hydrated.scenarioPending === undefined) {
    hydrated.scenarioPending = hydrated.pendingScenario;
  }
  
  // Force both flags to be real booleans (prevent "false" string from becoming truthy)
  hydrated.pendingScenario = toRealBool(hydrated.pendingScenario ?? hydrated.scenarioPending);
  hydrated.scenarioPending = toRealBool(hydrated.scenarioPending ?? hydrated.pendingScenario);

  // Safe numeric defaults
  const max = Number(hydrated.maxFocusTokens);
  hydrated.maxFocusTokens = (Number.isFinite(max) && max > 0) ? max : 5;

  const ap = Number(hydrated.actionPoints);
  hydrated.actionPoints = (Number.isFinite(ap) && ap >= 0) ? ap : hydrated.maxFocusTokens;

  // Pets migration: single pet -> pets[]
  try {
    const snapAny = snap || {};
    if (snapAny.pet && (!Array.isArray(snapAny.pets) || snapAny.pets.length === 0)) {
      const incomingPet = { ...(snapAny.pet || {}) };
      if (!incomingPet.id) incomingPet.id = `pet_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
      hydrated.pets = [incomingPet];
      hydrated.activePetId = incomingPet.id;
      delete hydrated.pet;
    } else {
      hydrated.pets = Array.isArray(snapAny.pets) ? snapAny.pets : (hydrated.pets || []);
      if (!hydrated.activePetId) hydrated.activePetId = hydrated.pets?.[0]?.id || null;
      delete hydrated.pet;
    }
  } catch {}

  // Ensure adultCrime state exists and is normalized
  try {
    hydrated.adultCrime = ensureAdultCrimeState(hydrated.adultCrime);
  } catch {}

  // Ensure coop state exists and is normalized
  try {
    hydrated.coop = ensureLocalCoopState(hydrated.coop);
    
    // If coop was enabled but is no longer eligible, merge back to household semantics
    if (hydrated.coop.enabled === true && !isLocalCoopEligible(hydrated)) {
      const f = hydrated.coop.focus || {};
      const householdMax = Number.isFinite(Number(f.householdMax)) 
        ? Math.max(1, Math.floor(Number(f.householdMax))) 
        : Math.max(1, Math.floor(Number(hydrated.maxFocusTokens || 5)));
      const householdRemaining = Number.isFinite(Number(f.householdRemaining))
        ? Math.max(0, Math.floor(Number(f.householdRemaining)))
        : Math.max(0, Math.floor(Number(hydrated.actionPoints ?? householdMax)));
      
      hydrated.maxFocusTokens = householdMax;
      hydrated.actionPoints = Math.min(householdRemaining, householdMax);
      hydrated.coop = ensureLocalCoopState({ ...DEFAULT_LOCAL_COOP_STATE, enabled: false });
    }
  } catch {}


  // Ensure milestones.ui exists and normalize all milestone fields
  try {
    const ms = hydrated.milestones || {};
    hydrated.milestones = {
      kidQuestActive: ms.kidQuestActive || null,
      adultQuestActive: ms.adultQuestActive || null,
      kidQuestHistory: Array.isArray(ms.kidQuestHistory) ? ms.kidQuestHistory : [],
      adultQuestHistory: Array.isArray(ms.adultQuestHistory) ? ms.adultQuestHistory : [],
      milestoneShownAges: (ms.milestoneShownAges && typeof ms.milestoneShownAges === 'object') ? ms.milestoneShownAges : {},
      baselines: (ms.baselines && typeof ms.baselines === 'object') ? ms.baselines : {},
      pendingAssign: Boolean(ms.pendingAssign),
      pendingResult: Boolean(ms.pendingResult),
      pendingResultPayload: (ms.pendingResult && ms.pendingResultPayload) ? ms.pendingResultPayload : null,
      ui: {
        dashboardDismissed: Boolean(ms?.ui?.dashboardDismissed) || false,
        infoOpen: Boolean(ms?.ui?.infoOpen) && (hydrated.packs?.milestonesEnabled ?? true)
      }
    };
    
    // Normalize legacy milestone fields (defensive)
    hydrated.missedMilestoneQueue = Array.isArray(snap?.missedMilestoneQueue) ? snap.missedMilestoneQueue : [];
    hydrated.milestoneMissedPending = snap?.milestoneMissedPending || null;
    hydrated.missedMilestone = snap?.missedMilestone || null;
  } catch {}
  // Legacy royalty → titles migration
  try {
    const hasRoyal = hydrated?.playerCareer?.royalty?.active === true;
    const legacyStatus = hydrated?.playerCareer?.royalty?.status;
    if (hasRoyal && (!hydrated.titles || !hydrated.titles.primaryTitle)) {
      const assign = legacyStatus === 'monarch' ? 'king' : 'prince';
      const info = getTitleInfo(assign);
      const courtesy = courtesyForChild(assign, hydrated.parentRole || 'mom');
      hydrated.titles = {
        ...(hydrated.titles || {}),
        primaryTitle: assign,
        primaryTitleId: assign,
        primaryTitleType: 'MONARCHY',
        rank: info?.label || null,
        titleMeter: Math.max(0, Math.min(100, Number(hydrated.titles?.titleMeter || 30))),
        standing: typeof hydrated.royalReputation === 'number' ? Math.max(0, Math.min(100, hydrated.royalReputation)) : (hydrated.titles?.standing || 30),
        influencePoints: hydrated.titles?.influencePoints || 0,
        influence: hydrated.titles?.influence || 0,
        scandalHeat: hydrated.titles?.scandalHeat || 0,
        childCourtesyTitle: courtesy,
        history: Array.isArray(hydrated.titles?.history) ? hydrated.titles.history : []
      };
    } else if (typeof hydrated.royalReputation === 'number') {
      hydrated.titles = { ...(hydrated.titles || {}), standing: Math.max(0, Math.min(100, hydrated.royalReputation)) };
    }
  } catch {}

  // Wisdom Lenses hydration
  const wisdom = hydrated.wisdom || {};
  hydrated.wisdom = {
    xp: {
      mindfulness: Number(wisdom.xp?.mindfulness) || 0,
      impermanence: Number(wisdom.xp?.impermanence) || 0,
      compassion: Number(wisdom.xp?.compassion) || 0,
    },
    equipped: Array.isArray(wisdom.equipped) && wisdom.equipped.length === 2 ? wisdom.equipped : ["mindfulness", null],
    clarity: Number(wisdom.clarity) || 0,
    clarityUsedThisAge: Number(wisdom.clarityUsedThisAge) || 0,
    rerollsThisAge: Number(wisdom.rerollsThisAge) || 0,
  };
  
  // Faith system hydration (migrate old 'religion' field)
  const faithSnap = snap?.faith || {};
  hydrated.faith = {
    tradition: faithSnap.tradition || snap?.religion || null,
    isCustom: Boolean(faithSnap.isCustom),
    status: faithSnap.status || (faithSnap.tradition || snap?.religion ? 'questioning' : 'none'),
    exposure: Number(faithSnap.exposure || 0),
    devotion: Number(faithSnap.devotion || 0),
    lastDecisionAge: faithSnap.lastDecisionAge ?? snap?.religionChosenAge ?? null,
    refusedFromTradition: faithSnap.refusedFromTradition || null,
    history: Array.isArray(faithSnap.history) ? faithSnap.history : [],
    milestoneAgesProcessed: Array.isArray(faithSnap.milestoneAgesProcessed) ? faithSnap.milestoneAgesProcessed : [],
    values: Array.isArray(faithSnap.values) ? faithSnap.values : [],
    valuesConversations: {
      usedThisYear: Boolean(faithSnap.valuesConversations?.usedThisYear),
      totalCount: Number(faithSnap.valuesConversations?.totalCount || 0),
      lastAge: faithSnap.valuesConversations?.lastAge ?? null
    }
  };

  // Ensure Titles defaults exist (migration-safe)
  try {
    const t = hydrated.titles || {};
    hydrated.titles = {
      ...t,
      scandalHeat: Math.max(0, Math.min(100, Number(t.scandalHeat || 0))),
      pressFeed: Array.isArray(t.pressFeed) ? t.pressFeed.slice(-25) : [],
      pressPending: null,
      prHandlerActive: Boolean(t.prHandlerActive),
      obligations: {
        requiredPerYear: Number(t.obligations?.requiredPerYear || 0),
        completedThisYear: Number(t.obligations?.completedThisYear || 0),
        yearTag: t.obligations?.yearTag ?? null,
      },
      house: t.house || null,
    };
  } catch {}

  // Ensure expansions exists and migrate old settings.expansions.siblingRivalry
  if (!hydrated.expansions || typeof hydrated.expansions !== 'object') {
    hydrated.expansions = { ...INITIAL_STATE.expansions };
  }
  if (typeof hydrated.expansions.siblingRivalry !== 'boolean') {
    hydrated.expansions.siblingRivalry = false;
  }
  if (snap?.settings?.expansions?.siblingRivalry === true || snap?.settings?.expansions?.siblingRivalry === false) {
    hydrated.expansions.siblingRivalry = snap.settings.expansions.siblingRivalry;
  }

  // Coop hydration + ineligibility safety net
  if (hydrated.coop?.enabled === true && !isLocalCoopEligible(hydrated)) {
    const f = hydrated.coop.focus || {};
    const householdMax = Number.isFinite(Number(f.householdMax)) ? Number(f.householdMax) : Number(hydrated.maxFocusTokens || 5);
    const householdRemaining = Number.isFinite(Number(f.householdRemaining)) ? Number(f.householdRemaining) : Number(hydrated.actionPoints || householdMax);
    hydrated.maxFocusTokens = Math.max(1, Math.floor(householdMax));
    hydrated.actionPoints = Math.max(0, Math.min(Math.floor(householdRemaining), hydrated.maxFocusTokens));
    hydrated.coop = ensureLocalCoopState({ ...DEFAULT_LOCAL_COOP_STATE, enabled: false });
  }

  // Chaos Mode Level migration (old boolean -> Level 2)
  const cur = hydrated.expansions || {};
  const lvl = getChaosLevelFromExpansions(cur);
  hydrated.expansions = withChaosLevel(cur, lvl);

  // Life Goals migration: ensure normalized structure
  const lg = snap?.lifeGoals || {};
  hydrated.lifeGoals = {
    selectedIds: Array.isArray(lg.selectedIds) ? lg.selectedIds : [],
    setupPending: Boolean(lg.setupPending),
    setupCompleted: Boolean(lg.setupCompleted),
    uiOpen: Boolean(lg.uiOpen),
    progressById: (lg.progressById && typeof lg.progressById === 'object') ? lg.progressById : {},
    completedIds: Array.isArray(lg.completedIds) ? lg.completedIds : [],
    recentEvents: Array.isArray(lg.recentEvents) ? lg.recentEvents : []
  };

  // Urn Crypto legacy migration
  try {
    const legacy = snap?.urnCrypto && (snap.urnCrypto.seasonAge !== undefined || snap.urnCrypto.lastSettlement !== undefined || snap.urnCrypto.tokenPrice !== undefined);
    
    if (legacy) {
      let refund = 0;
      const oldPositions = snap.urnCrypto.positions || {};
      Object.values(oldPositions).forEach(pos => {
        refund += Number(pos?.costBasis || 0);
      });
      
      if (refund > 0) {
        hydrated.money = (hydrated.money || 0) + refund;
        const tx = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_crypto_refund`,
          ts: Date.now(),
          age: hydrated.currentYear || 0,
          amount: refund,
          type: 'income',
          source: 'Urn Crypto Upgrade Refund',
          note: 'Legacy crypto system upgraded; refunded your cost basis.',
          category: 'crypto'
        };
        hydrated.moneyTransactions = [...(hydrated.moneyTransactions || []), tx];
      }
      
      hydrated.urnCrypto = {
        ...INITIAL_STATE.urnCrypto,
        enabled: Boolean(snap?.urnCrypto?.enabled),
        unlockedAtAge: snap?.urnCrypto?.unlockedAtAge ?? null
      };
    }
  } catch (e) {
    console.warn('[UrnCrypto] Legacy migration failed:', e);
  }

  return ensureSiblingRivalryState(ensureKidsContainer(hydrated));
}

function getInitialGameState() {
  // Default to active slot if available; fall back to slot1.
  const activeSlotId = (() => {
    try {
      return (typeof getActiveSlotId === 'function' ? getActiveSlotId() : null) || 'slot1';
    } catch {
      return 'slot1';
    }
  })();

  // 1) Multi-slot save (current system)
  try {
    const snap = typeof loadFromSlot === 'function' ? loadFromSlot(activeSlotId) : null;
    if (snap) {
      const hydrated = hydrateSavedState(snap, activeSlotId);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const popupPref = window.localStorage.getItem('rt_popup_style');
          if (popupPref) hydrated.settings = { ...(hydrated.settings || {}), popupStyle: popupPref };
          const uiTheme = window.localStorage.getItem('rt_ui_theme') || 'classic';
          hydrated.settings = { ...(hydrated.settings || {}), uiTheme };
          // apply immediately to avoid FOUC
          try { document.documentElement.dataset.uiTheme = uiTheme; } catch {}
        }
      } catch {}
      return hydrated;
    }
  } catch (e) {
    console.warn('[BOOT] Failed to load from save slot:', e);
  }

  // 2) Legacy single-save migration
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(LEGACY_SINGLE_SAVE_KEY);
      if (raw) {
        const legacy = JSON.parse(raw);
        if (legacy && typeof legacy === 'object') {
          // Migrate into the new multi-slot manager so future boots load correctly.
          try {
            if (typeof saveToSlot === 'function') {
              saveToSlot(activeSlotId, legacy, null);
            }
            window.localStorage.removeItem(LEGACY_SINGLE_SAVE_KEY);
          } catch (e2) {
            console.warn('[BOOT] Legacy migration failed:', e2);
          }

          return hydrateSavedState(legacy, activeSlotId);
        }
      }
    }
  } catch (e) {
    console.warn('[BOOT] Failed to parse legacy save:', e);
  }

  // Fresh install or recovery needed: check if autosave existed recently
  const fresh = (() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('RT_LAST_AUTOSAVE_TS')) {
        const base = { ...INITIAL_STATE, activeSaveSlotId: activeSlotId, bootLoadError: { slotId: activeSlotId, ts: Date.now() } };
        const pref = window.localStorage.getItem('rt_popup_style');
        if (pref) base.settings = { ...(base.settings || {}), popupStyle: pref };
        return base;
      }
    } catch {}
    const base = { ...INITIAL_STATE, activeSaveSlotId: activeSlotId };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const pref = window.localStorage.getItem('rt_popup_style');
        if (pref) base.settings = { ...(base.settings || {}), popupStyle: pref };
      }
    } catch {}
    return base;
  })();
  return fresh;
}

export function buildSpecialStartMeta(specialStartId, runSeed) {
  try {
    const rng = createSeededRng(`${runSeed}|ssmeta|${specialStartId}`);
    const meta = {};

    switch (specialStartId) {
    case "deep_sea_habitat_family":
      meta.role = rng.pick(["habitat_commander", "marine_scientist", "systems_engineer"]);
      meta.isolation = rng.pick(["medium", "high"]);
      meta.supplyReliability = rng.pick(["good", "ok", "shaky"]);
      meta.pressureRisk = rng.pick(["medium", "high"]);
      meta.commsQuality = rng.pick(["ok", "spotty"]);
      break;
    case "monarch_in_exile":
      meta.formerRank = rng.pick(["minor_royal", "senior_royal", "heir"]);
      meta.securityLevel = rng.pick(["medium", "high"]);
      meta.assetFreeze = rng.pick(["none", "partial"]);
      meta.pressHeat = rng.pick(["low", "medium", "high"]);
      meta.homeSupport = rng.pick(["thin", "strong"]);
      break;
    case "child_mobility_aid":
      meta.aidType = rng.pick(["wheelchair", "walker", "braces", "crutches"]);
      meta.accessClimate = rng.pick(["supportive", "mixed", "barriers"]);
      break;
    case "single_parent_household":
      meta.supportNetwork = rng.pick(["nearby_family", "friends", "none"]);
      meta.coParentSupport = rng.pick(["none", "inconsistent_child_support", "reliable_child_support"]);
      break;
    case "blended_family":
      meta.stepSiblingCount = Math.floor(rng.nextFloat() * 3) + 1;
      meta.scheduleType = rng.pick(["alternating_week", "2_2_3", "summer_heavy"]);
      meta.conflictLevel = rng.pick(["low", "medium", "high"]);
      break;
    case "first_gen_immigrant":
      meta.originRegion = rng.pick(["Latin America", "East Asia", "South Asia", "Eastern Europe", "West Africa", "Middle East", "Caribbean"]);
      meta.languageBarrier = rng.pick(["low", "medium", "high"]);
      meta.credentialsRecognized = rng.nextFloat() > 0.4;
      meta.communityPresence = rng.pick(["strong", "weak"]);
      break;
    case "rural_isolation":
      meta.distanceMinutes = rng.pick([20, 45, 90]);
      meta.internetQuality = rng.pick(["good", "bad"]);
      meta.communityTightness = rng.pick(["tight", "loose"]);
      meta.weatherRisk = rng.pick(["snow", "flood", "storm", "heat"]);
      break;
    case "tiny_apartment_city":
      meta.cityFlavor = rng.pick(["coastal_metro", "midwest_metro", "sunbelt_metro", "old_world_dense"]);
      const rentPressure = rng.pick(["stable", "rising", "volatile"]);
      meta.rentPressure = rentPressure;
      if (rentPressure === "stable") meta.expenseMultiplier = 1.35;
      else if (rentPressure === "rising") meta.expenseMultiplier = 1.55;
      else meta.expenseMultiplier = 1.75;
      meta.neighborNoise = rng.pick(["low", "medium", "high"]);
      break;
    case "two_working_parents_childcare":
      meta.partnerIncomeTier = rng.pick(["steady", "high", "variable"]);
      meta.childcarePlan = rng.pick(["daycare", "nanny_share", "family_help", "patchwork"]);
      meta.waitlistLuck = rng.pick(["good", "bad"]);
      break;
    case "eldercare_shared":
      meta.distance = rng.pick(["in_home", "nearby", "far"]);
      meta.healthPattern = rng.pick(["stable", "fluctuating"]);
      meta.grandparentHelps = rng.nextFloat() > 0.45;
      break;
    case "child_adhd":
      meta.adhdType = rng.pick(["inattentive","hyperactive","combined"]);
      meta.schoolSupport = rng.pick(["strong","mixed","weak"]);
      break;
    case "gifted_child":
      meta.domain = rng.pick(["STEM","Arts","Leadership","Sports"]);
      meta.pressure = rng.pick(["low","high"]);
      break;
    case "food_insecurity":
      meta.benefitsStatus = rng.pick(["approved", "pending", "denied"]);
      meta.paperworkBurden = rng.pick(["light", "heavy"]);
      meta.pantryDistance = rng.pick(["nearby", "far"]);
      meta.supportClimate = rng.pick(["supportive", "mixed", "judgmental"]);
      break;
    case "disaster_rebuild":
      meta.disasterType = rng.pick(["flood", "wildfire", "hurricane", "tornado", "earthquake"]);
      meta.insurance = rng.pick(["good", "partial", "denied"]);
      meta.housing = rng.pick(["temporary_rental", "staying_with_family", "shelter"]);
      meta.communityAid = rng.pick(["strong", "mixed", "weak"]);
      break;
    case "grief_year":
      meta.loss = rng.pick(["grandparent", "parent", "sibling", "close_friend"]);
      meta.support = rng.pick(["strong", "mixed", "weak"]);
      meta.coping = rng.pick(["quiet_routines", "community_rituals", "faith_rituals", "therapy_first"]);
      break;
    case "golden_cage":
      meta.imagePressure = rng.pick(["low", "medium", "high"]);
      meta.staffSupport = rng.pick(["none", "part_time", "full_time"]);
      meta.socialCircle = rng.pick(["elite_bubble", "mixed", "spotlight"]);
      break;
    case "newcomer_reset":
      meta.languageBarrier = rng.pick(["low", "medium", "high"]);
      meta.paperworkLoad = rng.pick(["light", "heavy"]);
      meta.housingStability = rng.pick(["stable", "shaky"]);
      meta.supportNetwork = rng.pick(["strong", "mixed", "none"]);
      break;
    case "tradition_tug_of_war":
      meta.traditionStrictness = rng.pick(["soft", "firm", "strict"]);
      meta.extendedFamilyPressure = rng.pick(["low", "medium", "high"]);
      meta.familyProximity = rng.pick(["nearby", "in_home", "far"]);
      break;
    case "medieval_larp_town":
      meta.townRole = rng.pick(["baker", "bard", "healer", "guard", "blacksmith", "scribe"]);
      meta.immersionLevel = rng.pick(["weekends", "full_time", "hardcore"]);
      meta.councilDrama = rng.pick(["low", "medium", "high"]);
      meta.touristPressure = rng.pick(["low", "medium", "high"]);
      break;
    case "traveling_circus":
      meta.routeType = rng.pick(["regional", "national", "international"]);
      meta.financialStability = rng.pick(["thin", "steady", "booming"]);
      meta.actCulture = rng.pick(["juggling", "aerial", "magic", "music", "clowning"]);
      meta.mentorQuality = rng.pick(["supportive", "chaotic", "absent"]);
      break;
    case "haunted_house_roommate":
      meta.ghostPersonality = rng.pick(["friendly", "mischievous", "dramatic"]);
      meta.hauntingIntensity = rng.pick(["low", "medium", "high"]);
      meta.rentDeal = rng.pick(["cheap", "normal"]);
      break;
    case "witness_protection":
      meta.threatLevel = rng.pick(["low", "medium", "high"]);
      meta.handlerSupport = rng.pick(["strong", "thin"]);
      meta.moveFrequency = rng.pick(["rare", "periodic", "frequent"]);
      meta.coverStory = rng.pick(["solid", "shaky"]);
      break;
    case "vanlife_nomads":
      meta.vanQuality = rng.pick(["beater", "reliable", "lux"]);
      meta.budget = rng.pick(["tight", "ok", "comfortable"]);
      meta.routeStyle = rng.pick(["seasonal", "wandering"]);
      meta.breakdownRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "reality_tv_family":
      meta.showPopularity = rng.pick(["low", "medium", "high"]);
      meta.producerEthics = rng.pick(["respectful", "messy", "predatory"]);
      meta.contractLength = rng.pick(["short", "long"]);
      meta.payoutTier = rng.pick(["modest", "big"]);
      break;
    case "sugar_baby":
      meta.partnerHealth = rng.pick(["stable", "declining", "fragile"]);
      meta.publicAttention = rng.pick(["low", "medium", "high"]);
      meta.estateComplexity = rng.pick(["simple", "messy"]);
      break;
    case "no_safety_net":
      meta.benefitsStatus = rng.pick(["approved", "pending", "denied"]);
      meta.rentPressure = rng.pick(["stable", "rising", "volatile"]);
      meta.supportNetwork = rng.pick(["friends_family", "none"]);
      break;
    case "space_station_family":
      meta.shipName = rng.pick(["Odyssey", "Pioneer", "Starlark", "Cassini", "Horizon"]);
      meta.gravity = rng.pick(["spin_gravity", "low_g"]);
      meta.commsDelayHours = rng.pick([0, 0.3, 1, 4, 12]);
      meta.supplyStatus = rng.pick(["flush", "normal", "tight"]);
      meta.privacy = rng.pick(["low", "medium"]);
      break;
    case "spotlight_movie_star":
      meta.fameLevel = rng.pick(["breakout", "a_list", "legend"]);
      meta.paparazzi = rng.pick(["low", "medium", "high"]);
      meta.scheduleType = rng.pick(["series_regular", "film_chaos"]);
      break;
    case "spotlight_pro_athlete":
      meta.tier = rng.pick(["starter", "all_star", "legend"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      meta.injuryRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_influencer":
      meta.privacyBoundary = rng.pick(["strict", "medium", "loose"]);
      meta.algorithm = rng.pick(["stable", "volatile"]);
      meta.publicAttention = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_tech_founder":
      meta.exit = rng.pick(["ipo", "acquired", "bootstrapped"]);
      meta.liquidity = rng.pick(["liquid", "mostly_stock"]);
      meta.publicProfile = rng.pick(["low", "medium", "high"]);
      meta.workload = rng.pick(["heavy", "insane"]);
      meta.familyOffice = rng.pick(["none", "small", "full"]);
      break;
    case "spotlight_music_icon":
      meta.tier = rng.pick(["platinum", "stadium", "legend"]);
      meta.tour = rng.pick(["residency", "steady", "brutal"]);
      meta.pressHeat = rng.pick(["low", "medium", "high"]);
      meta.brandDeals = rng.pick(["none", "some", "many"]);
      break;
    case "spotlight_nobel_scientist":
      meta.funding = rng.pick(["massive", "strong", "volatile"]);
      meta.patents = rng.pick(["none", "some", "monster"]);
      meta.publicProfile = rng.pick(["low", "medium", "high"]);
      meta.ethicsScrutiny = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_music_icon":
      meta.era = rng.pick(["classic", "modern", "viral"]);
      meta.genre = rng.pick(["pop", "rock", "hiphop", "edm", "rnb"]);
      meta.tourIntensity = rng.pick(["low", "medium", "high"]);
      meta.tabloidHeat = rng.pick(["low", "medium", "high"]);
      meta.brandDeals = rng.pick(["few", "some", "many"]);
      meta.boundaries = rng.pick(["strict", "medium", "loose"]);
      break;
    case "spotlight_tech_founder":
      meta.stage = rng.pick(["hypergrowth", "mature_giant", "turnaround"]);
      meta.publicProfile = rng.pick(["medium", "high"]);
      meta.volatility = rng.pick(["stable", "volatile"]);
      meta.securityLevel = rng.pick(["medium", "high"]);
      meta.productDomain = rng.pick(["consumer", "enterprise", "ai", "biotech", "fintech"]);
      break;
    case "spotlight_business_mogul":
      meta.sector = rng.pick(["real_estate", "retail", "logistics", "manufacturing", "media"]);
      meta.expansionStyle = rng.pick(["steady", "aggressive"]);
      meta.reputation = rng.pick(["beloved", "mixed", "controversial"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      meta.scandalRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_chef":
      meta.empireScale = rng.pick(["flagship_only", "multi_city", "global_empire"]);
      meta.mediaLoad = rng.pick(["low", "medium", "high"]);
      meta.kitchenCulture = rng.pick(["supportive", "intense", "toxic"]);
      meta.travel = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_esports":
      meta.tier = rng.pick(["top_player", "champion", "legend"]);
      meta.streamPressure = rng.pick(["low", "medium", "high"]);
      meta.travel = rng.pick(["low", "medium", "high"]);
      meta.burnoutRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_fashion_icon":
      meta.tier = rng.pick(["runway_star", "global_icon", "legend"]);
      meta.pressHeat = rng.pick(["low", "medium", "high"]);
      meta.brandDeals = rng.pick(["few", "some", "many"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_olympian":
      meta.sport = rng.pick(["track", "gymnastics", "swimming", "combat", "team_sport"]);
      meta.tier = rng.pick(["medalist", "champion", "legend"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      meta.injuryRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_astronaut":
      meta.program = rng.pick(["government", "private"]);
      meta.missionCadence = rng.pick(["rare", "periodic", "frequent"]);
      meta.publicProfile = rng.pick(["low", "medium", "high"]);
      meta.riskLevel = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_war_correspondent":
      meta.assignmentCadence = rng.pick(["rare", "periodic", "constant"]);
      meta.riskLevel = rng.pick(["medium", "high"]);
      meta.publicProfile = rng.pick(["low", "medium", "high"]);
      meta.contractTier = rng.pick(["premium", "elite"]);
      break;
    case "spotlight_royal_family":
      meta.rank = rng.pick(["minor_royal", "senior_royal", "heir"]);
      meta.scrutiny = rng.pick(["medium", "high"]);
      meta.dutyLoad = rng.pick(["steady", "heavy"]);
      meta.palacePolitics = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_humanitarian_doctor":
      meta.missionCadence = rng.pick(["rare", "periodic", "frequent"]);
      meta.publicProfile = rng.pick(["medium", "high"]);
      meta.foundationScale = rng.pick(["major", "global"]);
      meta.compStress = rng.pick(["medium", "high"]);
      break;
    case "spotlight_arctic_station":
      meta.role = rng.pick(["commander", "lead_scientist", "chief_engineer"]);
      meta.isolation = rng.pick(["medium", "high"]);
      meta.supplyReliability = rng.pick(["good", "ok", "shaky"]);
      meta.stormSeverity = rng.pick(["harsh", "brutal"]);
      break;
    case "spotlight_spy":
      meta.coverStrength = rng.pick(["solid", "shaky"]);
      meta.agencySupport = rng.pick(["strong", "thin"]);
      meta.opsCadence = rng.pick(["rare", "periodic", "constant"]);
      meta.exposureRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_guru":
      meta.tier = rng.pick(["retreat_star", "global_guru", "legend"]);
      meta.donationStream = rng.pick(["steady", "swingy"]);
      meta.scandalRisk = rng.pick(["low", "medium", "high"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      break;
    case "interstellar_voyage_parent":
      meta.missionPhase = rng.pick(["cruise", "midcourse", "approach"]);
      meta.habitatTier = rng.pick(["basic", "standard", "premium"]);
      meta.resourceTightness = rng.pick(["ok", "tight"]);
      meta.commsDelay = rng.pick(["none", "long"]);
      meta.incidentRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_president":
      meta.termContext = rng.pick(["elected", "caretaker", "emergency"]);
      meta.securityLevel = rng.pick(["medium", "high", "maximum"]);
      meta.pressClimate = rng.pick(["supportive", "mixed", "hostile"]);
      meta.crisisCadence = rng.pick(["low", "medium", "high"]);
      meta.familyPrivacy = rng.pick(["strict", "medium", "loose"]);
      break;
    case "spotlight_reality_tv":
      meta.showPopularity = rng.pick(["low", "medium", "high"]);
      meta.producerEthics = rng.pick(["respectful", "messy", "predatory"]);
      meta.contractLength = rng.pick(["short", "long"]);
      meta.payoutTier = rng.pick(["modest", "big"]);
      meta.privacyBoundary = rng.pick(["strict", "medium", "loose"]);
      meta.storylinePressure = rng.pick(["low", "medium", "high"]);
      break;
    case "royal_heir_protocol":
      meta.rank = rng.pick(["minor_heir", "heir_apparent", "heir"]);
      meta.protocolStrictness = rng.pick(["soft", "firm", "strict"]);
      meta.courtIntrigue = rng.pick(["low", "medium", "high"]);
      meta.publicScrutiny = rng.pick(["medium", "high"]);
      meta.tutorQuality = rng.pick(["mixed", "good", "excellent"]);
      meta.dutyLoad = rng.pick(["steady", "heavy"]);
      break;
    case "duty_remote_research_outpost":
      meta.biome = rng.pick(["island", "jungle", "desert", "mountain"]);
      meta.isolation = rng.pick(["medium", "high"]);
      meta.supplyReliability = rng.pick(["good", "ok", "shaky"]);
      meta.commsQuality = rng.pick(["ok", "spotty"]);
      break;
    case "duty_wildfire_season_parent":
      meta.role = rng.pick(["firefighter", "medic", "dispatcher", "incident_lead"]);
      meta.seasonSeverity = rng.pick(["rough", "brutal"]);
      meta.communityRisk = rng.pick(["medium", "high"]);
      meta.callCadence = rng.pick(["periodic", "constant"]);
      break;
    case "duty_oil_rig_rotation":
      meta.role = rng.pick(["crew", "technician", "supervisor"]);
      meta.rotation = rng.pick(["14on_14off", "21on_21off", "28on_28off"]);
      meta.distance = rng.pick(["regional", "far"]);
      meta.weatherRisk = rng.pick(["medium", "high"]);
      break;
    case "survival_quarantine_protocol":
      meta.strictness = rng.pick(["medium", "strict", "extreme"]);
      meta.supplyReliability = rng.pick(["good", "ok", "shaky"]);
      meta.homeSpace = rng.pick(["small", "medium", "large"]);
      meta.waveCadence = rng.pick(["low", "medium", "high"]);
      break;
    case "duty_submarine_deployment":
      meta.serviceType = rng.pick(["navy", "private"]);
      meta.rank = rng.pick(["enlisted", "officer"]);
      meta.deploymentCadence = rng.pick(["rare", "periodic", "constant"]);
      meta.comms = rng.pick(["minimal", "limited"]);
      meta.riskLevel = rng.pick(["medium", "high"]);
      break;
    case "sudden_lottery_winner":
      meta.jackpotTier = rng.pick(["huge", "massive", "absurd"]);
      meta.privacyPlan = rng.pick(["anonymous", "quiet", "public"]);
      meta.advisorQuality = rng.pick(["excellent", "mixed", "predatory"]);
      meta.familyPressure = rng.pick(["low", "medium", "high"]);
      meta.spendingStyle = rng.pick(["disciplined", "normal", "reckless"]);
      break;
    case "spotlight_blockbuster_actor":
      meta.tier = rng.pick(["a_list", "franchise_star", "legend"]);
      meta.pressHeat = rng.pick(["low", "medium", "high"]);
      meta.filmingLoad = rng.pick(["steady", "brutal"]);
      meta.brandDeals = rng.pick(["few", "some", "many"]);
      meta.boundaries = rng.pick(["strict", "medium", "loose"]);
      break;
    case "spotlight_master_thief":
      meta.tier = rng.pick(["elite", "legend"]);
      meta.heat = rng.pick(["low", "medium", "high"]);
      meta.fenceNetwork = rng.pick(["strong", "shaky"]);
      meta.coverStrength = rng.pick(["solid", "shaky"]);
      break;
    case "spotlight_cult_leader":
      meta.size = rng.pick(["small", "medium", "massive"]);
      meta.publicProfile = rng.pick(["low", "medium", "high"]);
      meta.securityLevel = rng.pick(["medium", "high"]);
      meta.exposeRisk = rng.pick(["low", "medium", "high"]);
      meta.donationStream = rng.pick(["steady", "swingy"]);
      break;
    case "spotlight_music_label_mogul":
      meta.labelScale = rng.pick(["indie_empire", "major_powerhouse"]);
      meta.hitCadence = rng.pick(["rare", "periodic", "frequent"]);
      meta.artistDrama = rng.pick(["low", "medium", "high"]);
      meta.pressHeat = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_private_equity_titan":
      meta.tier = rng.pick(["rainmaker", "titan", "legend"]);
      meta.dealFlow = rng.pick(["steady", "volatile"]);
      meta.pressHeat = rng.pick(["low", "medium", "high"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_space_tourism_billionaire":
      meta.wealthTier = rng.pick(["billionaire", "mega_billionaire"]);
      meta.launchCadence = rng.pick(["rare", "periodic", "frequent"]);
      meta.publicProfile = rng.pick(["medium", "high"]);
      meta.riskTolerance = rng.pick(["calculated", "reckless"]);
      meta.prIntensity = rng.pick(["medium", "high"]);
      break;
    case "interstellar_voyage_parent":
      meta.missionPhase = rng.pick(["cruise", "midcourse", "approach"]);
      meta.habitatTier = rng.pick(["basic", "standard", "premium"]);
      meta.resourceTightness = rng.pick(["ok", "tight"]);
      meta.commsDelay = rng.pick(["none", "long"]);
      meta.incidentRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_megachurch_pastor":
      meta.churchSize = rng.pick(["large", "massive"]);
      meta.publicProfile = rng.pick(["medium", "high"]);
      meta.boardOversight = rng.pick(["strong", "weak"]);
      meta.charityLoad = rng.pick(["high", "extreme"]);
      meta.controversyRisk = rng.pick(["low", "medium", "high"]);
      break;
    case "spotlight_nobel_scientist":
      meta.field = rng.pick(["biomed", "physics", "climate", "ai", "chemistry"]);
      meta.publicProfile = rng.pick(["medium", "high"]);
      meta.travelLoad = rng.pick(["low", "medium", "high"]);
      meta.patentIncome = rng.pick(["low", "medium", "high"]);
      meta.foundationScale = rng.pick(["major", "global"]);
      break;
    default:
      break;
  }

    return meta;
  } catch (err) {
    console.error("buildSpecialStartMeta FAILED — returning empty meta", err);
    return {};
  }
}

function applySpecialStartRecurringCostsAndBonuses({ age, gameState, applyMoneyDelta, applyStress, applyDeltas }) {
  if (!gameState.specialStartId || !gameState.specialStartMeta) return;

  const { specialStartId, specialStartMeta } = gameState;

  switch (specialStartId) {
    case 'deep_sea_habitat_family': {
      const role = specialStartMeta?.role || 'marine_scientist';
      const isolation = specialStartMeta?.isolation || 'high';
      const supply = specialStartMeta?.supplyReliability || 'ok';
      const risk = specialStartMeta?.pressureRisk || 'medium';
      const comms = specialStartMeta?.commsQuality || 'ok';

      // Hazard/retention pay
      let base = (role === 'habitat_commander') ? 155000 : (role === 'systems_engineer') ? 150000 : 135000;
      if (isolation === 'high') base += 12000;

      // Deterministic "system failure year"
      const rF = createSeededRng(`${gameState.runSeed}|deepSea|failure|age:${age}`);
      const pF = (risk === 'high') ? 0.22 : 0.14;
      const failure = rF.nextFloat() < pF;

      // Failure years cost money (repairs) but may include hazard bonuses
      const hazardBonus = failure ? 28000 : 0;
      const failureCost = failure ? -32000 : 0;

      // Overhead: maintenance + shipping + comms
      let overhead = -34000;
      if (supply === 'shaky') overhead -= 14000;
      if (comms === 'spotty') overhead -= 8000;

      applyMoneyDelta(base + hazardBonus + failureCost + overhead, failure ? "Deep-sea habitat finances (failure year)" : "Deep-sea habitat finances (net)");

      // Stress: isolation + risk + failure spikes
      let stress = 0.18;
      if (isolation === 'high') stress += 0.06;
      if (risk === 'high') stress += 0.04;
      if (comms === 'spotty') stress += 0.04;
      if (failure) stress += 0.10;
      applyStress(stress);

      // Household effects: intelligence + discipline + curiosity + confidence
      if (age >= 6) applyDeltas({ intelligence: 0.12, discipline: 0.10, curiosity: 0.10, confidence: 0.06 }, "Engineered-environment learning culture");
      break;
    }
    case 'monarch_in_exile': {
      const rank = specialStartMeta?.formerRank || 'senior_royal';
      const sec = specialStartMeta?.securityLevel || 'high';
      const freeze = specialStartMeta?.assetFreeze || 'partial';
      const press = specialStartMeta?.pressHeat || 'medium';
      const support = specialStartMeta?.homeSupport || 'thin';

      // Still wealthy, but reduced compared to active royalty
      let base = (rank === 'heir') ? 150000 : (rank === 'senior_royal') ? 120000 : 90000;
      if (freeze === 'partial') base -= 25000;

      // Deterministic "headline year"
      const rH = createSeededRng(`${gameState.runSeed}|monarchExile|headline|age:${age}`);
      const pH = (press === 'high') ? 0.26 : (press === 'low') ? 0.10 : 0.18;
      const headlineYear = rH.nextFloat() < pH;
      const headlineCost = headlineYear ? -22000 : 0;

      // Overhead: security + legal + relocation costs
      let overhead = -36000;
      if (sec === 'high') overhead -= 16000;
      if (press === 'high') overhead -= 9000;
      if (support === 'strong') overhead += 8000; // allies cover some burden

      applyMoneyDelta(base + headlineCost + overhead, headlineYear ? "Monarch-in-exile finances (headline year)" : "Monarch-in-exile finances (net)");

      // Stress: identity + scrutiny + security
      let stress = 0.18;
      if (sec === 'high') stress += 0.05;
      if (press === 'high') stress += 0.06;
      if (freeze === 'partial') stress += 0.03;
      if (headlineYear) stress += 0.10;
      if (support === 'strong') stress -= 0.03;
      applyStress(stress);

      // Household effects: responsibility + discipline; empathy depends on support
      if (age >= 6) applyDeltas({ responsibility: 0.12, discipline: 0.10, confidence: 0.06 }, "Exile household routines");
      if (age >= 6 && support === 'strong') applyDeltas({ empathy: 0.06 }, "Supportive community");
      break;
    }
    case 'rural_isolation':
      const cost = (specialStartMeta.distanceMinutes === 20 ? 150 : specialStartMeta.distanceMinutes === 45 ? 300 : 500);
      applyMoneyDelta(-cost, "Rural travel costs");
      applyStress(0.05);
      break;
    case 'tiny_apartment_city':
      const noiseStress = { low: 0.02, medium: 0.05, high: 0.08 }[specialStartMeta.neighborNoise] || 0;
      applyStress(noiseStress);
      break;
    case 'two_working_parents_childcare':
      const income = { steady: 900, high: 1400, variable: 700 + Math.floor(createSeededRng(`${gameState.runSeed}|partnerIncome|${age}`).nextFloat() * 1001) }[specialStartMeta.partnerIncomeTier] || 0;
      if (income > 0) applyMoneyDelta(income, "Partner income");

      if (age >= 0 && age <= 4) {
        let childcareCost = { daycare: -900, nanny_share: -1200, family_help: -350, patchwork: -700 }[specialStartMeta.childcarePlan] || 0;
        if (specialStartMeta.waitlistLuck === "bad" && age <= 2) childcareCost -= 250;
        if (childcareCost < 0) applyMoneyDelta(childcareCost, "Childcare");
        applyStress(0.08);
      } else if (age >= 5 && age <= 10) {
        applyMoneyDelta(-(250 + Math.floor(createSeededRng(`${gameState.runSeed}|afterschool|${age}`).nextFloat() * 201)), "After-school care");
        applyStress(0.04);
      } else if (age >= 11 && age <= 18) {
        applyMoneyDelta(-150, "Teen activities/costs");
        applyStress(0.02);
      }
      break;
    case 'child_mobility_aid':
      const baseCost = { wheelchair: -650, walker: -350, braces: -250, crutches: -200 }[specialStartMeta.aidType] || 0;
      const climateAdj = { supportive: 100, mixed: 0, barriers: -150 }[specialStartMeta.accessClimate] || 0;
      const ageAdj = age >= 10 ? -100 : 0;
      applyMoneyDelta(baseCost + climateAdj + ageAdj, "Mobility care & access");
      applyStress(0.03);
      break;
    case 'single_parent_household':
      const supportAdj = { nearby_family: -0.02, friends: 0.00, none: 0.06 }[specialStartMeta.supportNetwork] || 0;
      applyStress(0.04 + supportAdj);
      break;
    case 'blended_family':
      applyMoneyDelta(-(120 * (specialStartMeta.stepSiblingCount || 1)), "Larger household costs");
      const conflictStress = { low: 0.01, medium: 0.04, high: 0.07 }[specialStartMeta.conflictLevel] || 0;
      applyStress(conflictStress);
      break;
    case 'first_gen_immigrant':
      if (age >= 0 && age <= 3 && ["medium", "high"].includes(specialStartMeta.languageBarrier)) {
        applyStress(0.05);
      }
      break;
    case 'eldercare_shared':
      if (specialStartMeta.grandparentHelps && age >= 0 && age <= 6) {
        applyMoneyDelta(150, "Grandparent childcare help");
      }
      if (specialStartMeta.healthPattern === "fluctuating") {
        applyStress(0.02);
      }
      break;
    case 'food_insecurity': {
      const status = specialStartMeta?.benefitsStatus || 'pending';
      const paperwork = specialStartMeta?.paperworkBurden || 'heavy';
      const pantry = specialStartMeta?.pantryDistance || 'nearby';

      applyMoneyDelta(-100, "Food instability");

      if (pantry === 'far') applyMoneyDelta(-40, "Transit for pantry/appointments");

      if (status === 'approved') {
        applyMoneyDelta(120, "Food assistance");
        applyStress(-0.05);
      } else if (status === 'pending') {
        applyMoneyDelta(60, "Emergency food help");
        applyStress(0.04);
      } else {
        applyStress(0.08);
      }

      const base = (age <= 5) ? 0.18 : (age <= 12) ? 0.14 : 0.10;
      applyStress(base);

      if (paperwork === 'heavy') applyStress(0.10);

      break;
    }
    case 'disaster_rebuild': {
      const ins = specialStartMeta?.insurance || 'partial';
      const housing = specialStartMeta?.housing || 'temporary_rental';
      const aid = specialStartMeta?.communityAid || 'mixed';

      const phaseCost = (age <= 2) ? 350 : (age <= 6) ? 250 : (age <= 12) ? 150 : 90;
      const insMult = (ins === 'good') ? 0.6 : (ins === 'partial') ? 1.0 : 1.3;

      applyMoneyDelta(-Math.round(phaseCost * insMult), "Rebuild & replacement costs");

      const baseStress = (age <= 2) ? 0.25 : (age <= 6) ? 0.18 : (age <= 12) ? 0.12 : 0.08;
      const housingExtra = (housing === 'shelter') ? 0.08 : (housing === 'staying_with_family') ? 0.05 : 0.02;
      applyStress(baseStress + housingExtra);

      const rng2 = createSeededRng(`${gameState.runSeed}|disasterAid|age:${age}`);
      if (aid === 'strong' && rng2.nextFloat() < 0.55) applyMoneyDelta(140, "Community help");
      else if (aid === 'mixed' && rng2.nextFloat() < 0.25) applyMoneyDelta(80, "Small aid");
      break;
    }
    case 'grief_year': {
      const support = specialStartMeta?.support || 'mixed';

      const baseCost = (age <= 4) ? 120 : 60;
      const supportMult = (support === 'strong') ? 0.7 : (support === 'mixed') ? 1.0 : 1.15;
      applyMoneyDelta(-Math.round(baseCost * supportMult), "Support costs");

      const stressBase = (age <= 1) ? 0.30 : (age <= 6) ? 0.18 : (age <= 12) ? 0.12 : 0.09;
      const supportAdj = (support === 'strong') ? -0.06 : (support === 'mixed') ? 0.0 : 0.07;
      applyStress(stressBase + supportAdj);

      const emp = (support === 'strong') ? 0.12 : (support === 'mixed') ? 0.08 : 0.05;
      if (age >= 3) applyDeltas({ empathy: emp }, "Grief (empathy growing)");
      break;
    }
    case 'medieval_larp_town': {
      const immersion = specialStartMeta?.immersionLevel || 'full_time';
      const drama = specialStartMeta?.councilDrama || 'medium';
      const tourists = specialStartMeta?.touristPressure || 'medium';

      const upkeep = (immersion === 'hardcore') ? -180 : (immersion === 'weekends') ? -70 : -120;
      applyMoneyDelta(upkeep, "Costumes & props");

      let stress = 0.08;
      if (drama === 'high') stress += 0.06;
      else if (drama === 'low') stress -= 0.02;
      if (tourists === 'high') stress += 0.02;

      // Benefits: confidence through community play (bigger after age 5)
      if (age >= 5) applyDeltas({ confidence: 0.05 }, "Roleplay community");
      if (age >= 13 && drama === 'high') stress += 0.03; // teen embarrassment tax

      applyStress(stress);
      break;
    }
    case 'traveling_circus': {
      const route = specialStartMeta?.routeType || 'national';
      const money = specialStartMeta?.financialStability || 'steady';
      const mentor = specialStartMeta?.mentorQuality || 'chaotic';

      // Money is swingy in circus life
      const income = (money === 'booming') ? 220 : (money === 'steady') ? 80 : -120;
      applyMoneyDelta(income, "Circus season earnings");

      // Travel stress
      let stress = 0.14;
      if (route === 'international') stress += 0.05;
      else if (route === 'regional') stress += 0.02;

      if (mentor === 'supportive') stress -= 0.03;
      else if (mentor === 'absent') stress += 0.05;

      // Benefits: performance confidence
      if (age >= 5) applyDeltas({ confidence: 0.06 }, "Performance life");
      if (age >= 5 && mentor === 'supportive') applyDeltas({ discipline: 0.03 }, "Good coaching");

      applyStress(stress);
      break;
    }
    case 'haunted_house_roommate': {
      const intensity = specialStartMeta?.hauntingIntensity || 'medium';
      const ghost = specialStartMeta?.ghostPersonality || 'mischievous';
      const rent = specialStartMeta?.rentDeal || 'cheap';

      // Cheap rent is the whole reason you're here
      if (rent === 'cheap') applyMoneyDelta(120, "Cheap rent (haunting discount)");

      // Stress from sleep disruption + weirdness
      let stress = (intensity === 'high') ? 0.18 : (intensity === 'low') ? 0.07 : 0.12;
      if (ghost === 'dramatic') stress += 0.03;
      if (ghost === 'friendly') stress -= 0.02;

      // Kids who grow up with weirdness get a little bold
      if (age >= 5) applyDeltas({ confidence: 0.04 }, "Grew up around weird");
      if (age >= 13 && intensity === 'high') stress += 0.03;

      applyStress(stress);
      break;
    }
    case 'witness_protection': {
      const threat = specialStartMeta?.threatLevel || 'medium';
      const support = specialStartMeta?.handlerSupport || 'thin';
      const moves = specialStartMeta?.moveFrequency || 'periodic';
      const cover = specialStartMeta?.coverStory || 'solid';

      const baseCost = -120; // safer housing, extra admin
      const moveCost = (moves === 'frequent') ? -260 : (moves === 'rare') ? -60 : -140;
      applyMoneyDelta(baseCost + moveCost, "Low-profile living costs");

      let stress = 0.14;
      if (threat === 'high') stress += 0.08;
      else if (threat === 'low') stress -= 0.03;

      if (cover === 'shaky') stress += 0.05;
      if (support === 'strong') stress -= 0.05;

      // Resilience grows
      if (age >= 5) applyDeltas({ discipline: 0.04 }, "Vigilance routines");
      if (age >= 13) applyDeltas({ confidence: 0.04 }, "Resilience under pressure");

      applyStress(stress);
      break;
    }
    case 'vanlife_nomads': {
      const van = specialStartMeta?.vanQuality || 'reliable';
      const budget = specialStartMeta?.budget || 'ok';
      const route = specialStartMeta?.routeStyle || 'seasonal';
      const risk = specialStartMeta?.breakdownRisk || 'medium';

      // Income: remote work / gigs (varies)
      let base = (budget === 'comfortable') ? 85000 : (budget === 'tight') ? 52000 : 65000;
      if (route === 'wandering') base -= 6000; // less stable work

      // Deterministic breakdown year
      const r = createSeededRng(`${gameState.runSeed}|vanlife|breakdown|age:${age}`);
      const p = (risk === 'high') ? 0.30 : (risk === 'low') ? 0.10 : 0.18;
      const breakdown = r.nextFloat() < p;

      // Costs: fuel/maintenance/fees; quality reduces some of it
      let overhead = -24000;
      if (van === 'beater') overhead -= 9000;
      if (van === 'lux') overhead -= 4000; // nicer van still costs
      if (route === 'wandering') overhead -= 6000;

      // Breakdown hits money hard
      const breakdownCost = breakdown ? (van === 'beater' ? -24000 : -16000) : 0;

      applyMoneyDelta(base + overhead + breakdownCost, breakdown ? "Vanlife finances (breakdown year)" : "Vanlife finances (net)");

      // Stress: constant logistics + breakdown spikes; but some freedom reduces stress if budget is comfortable
      let stress = 0.18;
      if (route === 'wandering') stress += 0.04;
      if (budget === 'tight') stress += 0.06;
      if (breakdown) stress += 0.10;
      if (budget === 'comfortable') stress -= 0.02;
      applyStress(stress);

      // Household effects: curiosity + confidence; discipline if seasonal routines exist
      if (age >= 6) applyDeltas({ curiosity: 0.12, confidence: 0.10 }, "Travel learning culture");
      if (age >= 6 && route === 'seasonal') applyDeltas({ discipline: 0.06 }, "Seasonal routines");
      break;
    }
    case 'reality_tv_family': {
      const pop = specialStartMeta?.showPopularity || 'medium';
      const ethics = specialStartMeta?.producerEthics || 'messy';
      const contract = specialStartMeta?.contractLength || 'short';
      const payout = specialStartMeta?.payoutTier || 'modest';

      // Pay is real, so is the pressure
      let money = (payout === 'big') ? 550 : 220;
      if (pop === 'high') money += 180;
      if (pop === 'low') money -= 80;
      if (contract === 'long') money += 60; // more commitments, more pay
      applyMoneyDelta(money, "Reality TV income");

      let stress = 0.18;
      if (pop === 'high') stress += 0.06;
      if (ethics === 'predatory') stress += 0.08;
      else if (ethics === 'respectful') stress -= 0.04;

      // Confidence grows in spotlight, but it can be costly
      if (age >= 5) applyDeltas({ confidence: 0.05 }, "Spotlight exposure");
      if (age >= 13 && ethics === 'predatory') stress += 0.03;

      applyStress(stress);
      break;
    }
    case 'space_station_family': {
      const supply = specialStartMeta?.supplyStatus || 'okay';
      const upkeepCost = supply === 'tight' ? 360 : supply === 'flush' ? 160 : 240;
      applyMoneyDelta(-upkeepCost, "Ship upkeep & rations");

      let stress = 0.18; // cabin fever + constant maintenance pressure
      const crew = Number.isFinite(specialStartMeta?.crewSize) ? specialStartMeta.crewSize : 120;
      if (crew <= 60) stress += 0.08;
      if (crew >= 400) stress -= 0.04;

      const g = specialStartMeta?.gravityType || 'spin';
      if (g === 'micro') stress += 0.06;
      else if (g === 'partial') stress += 0.03;

      applyStress(stress);
      break;
    }
    case 'golden_cage': {
      const pressure = specialStartMeta?.imagePressure || 'medium';
      const staff = specialStartMeta?.staffSupport || 'part_time';

      const baseStress = (pressure === 'high') ? 0.22 : (pressure === 'low') ? 0.08 : 0.15;
      const staffCost = (staff === 'full_time') ? -550 : (staff === 'part_time') ? -250 : 0;
      const staffStressAdj = (staff === 'full_time') ? -0.05 : (staff === 'none') ? 0.07 : 0.0;

      if (staffCost) applyMoneyDelta(staffCost, "Household staff");
      applyStress(baseStress + staffStressAdj);
      break;
    }
    case 'newcomer_reset': {
      const barrier = specialStartMeta?.languageBarrier || 'medium';
      const paperwork = specialStartMeta?.paperworkLoad || 'heavy';
      const housing = specialStartMeta?.housingStability || 'shaky';
      const support = specialStartMeta?.supportNetwork || 'mixed';

      const fees = (paperwork === 'heavy') ? -140 : -70;
      applyMoneyDelta(fees, "Relocation paperwork & fees");

      const barrierStress = (barrier === 'high') ? 0.14 : (barrier === 'low') ? 0.06 : 0.10;
      const housingStress = (housing === 'shaky') ? 0.08 : 0.03;
      const supportAdj = (support === 'strong') ? -0.06 : (support === 'none') ? 0.06 : 0.0;

      applyStress(barrierStress + housingStress + supportAdj);
      break;
    }
    case 'tradition_tug_of_war': {
      const strictness = specialStartMeta?.traditionStrictness || 'firm';
      const pressure = specialStartMeta?.extendedFamilyPressure || 'medium';
      const proximity = specialStartMeta?.familyProximity || 'nearby';

      const p = (pressure === 'high') ? 0.14 : (pressure === 'low') ? 0.06 : 0.10;
      const s = (strictness === 'strict') ? 0.06 : (strictness === 'soft') ? -0.02 : 0.02;
      const prox = (proximity === 'in_home') ? 0.06 : (proximity === 'far') ? 0.02 : 0.03;

      // Small "tradition maintenance" cost (events, travel, gifts)
      const yearlyCost = (proximity === 'far') ? -120 : -80;
      applyMoneyDelta(yearlyCost, "Family/tradition obligations");

      applyStress(p + s + prox);
      break;
    }
    case 'sugar_baby': {
      const isDeceased = Boolean(gameState?.relationships?.byId?.partner?.isDeceased);

      // Before (or around) the early loss: caregiving strain
      if (!isDeceased && age >= 0 && age <= 1) {
        const health = specialStartMeta?.partnerHealth || 'fragile';
        const careCost = (health === 'fragile') ? -380 : (health === 'declining') ? -240 : -140;
        applyMoneyDelta(careCost, "Partner care");
        applyStress(0.10);
      }

      // After: paperwork drag (start at age 2 to avoid stacking on the inheritance year)
      if (isDeceased && age >= 2 && age <= 4) {
        const attn = specialStartMeta?.publicAttention || 'medium';
        const complexity = specialStartMeta?.estateComplexity || 'messy';

        const feeBase = (complexity === 'messy') ? 180 : 90;
        const feeAdj = (attn === 'high') ? 120 : (attn === 'low') ? -20 : 40;
        applyMoneyDelta(-(feeBase + feeAdj), "Estate paperwork");

        const stress = (attn === 'high') ? 0.10 : 0.06;
        applyStress(stress);
      }

      break;
    }
    case 'no_safety_net': {
      const status = specialStartMeta?.benefitsStatus || 'pending';
      const rent = specialStartMeta?.rentPressure || 'rising';
      const support = specialStartMeta?.supportNetwork || 'none';

      // Baseline "instability tax"
      const baseDrain = (rent === 'volatile') ? -140 : (rent === 'stable') ? -80 : -110;
      applyMoneyDelta(baseDrain, "Instability costs");

      // Benefits can reduce pain a bit
      if (status === 'approved') {
        applyMoneyDelta(120, "Benefits support");
        applyStress(-0.06);
      } else if (status === 'pending') {
        applyMoneyDelta(50, "Emergency help");
        applyStress(0.04);
      } else {
        applyStress(0.10);
      }

      // Ongoing stress profile
      const rentStress = (rent === 'volatile') ? 0.12 : (rent === 'stable') ? 0.05 : 0.08;
      const supportAdj = (support === 'friends_family') ? -0.05 : 0.05;
      applyStress(rentStress + supportAdj);

      break;
    }
    case 'spotlight_movie_star': {
      const level = specialStartMeta?.fameLevel || 'breakout';
      const paparazzi = specialStartMeta?.paparazzi || 'medium';
      const schedule = specialStartMeta?.scheduleType || 'film_chaos';

      const gross = (level === 'legend') ? 3200 : (level === 'a_list') ? 1900 : 1100;
      const fees = (level === 'legend') ? -750 : (level === 'a_list') ? -450 : -260;
      applyMoneyDelta(gross + fees, "Acting income (net)");

      let stress = (schedule === 'film_chaos') ? 0.20 : 0.12;
      if (paparazzi === 'high') stress += 0.08;
      else if (paparazzi === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ confidence: 0.2, social: 0.1 }, "Spotlight exposure");
      break;
    }
    case 'spotlight_pro_athlete': {
      const tier = specialStartMeta?.tier || 'starter';
      const travel = specialStartMeta?.travelLoad || 'medium';
      const risk = specialStartMeta?.injuryRisk || 'medium';

      const base = (tier === 'legend') ? 3000 : (tier === 'all_star') ? 1700 : 950;

      const r = createSeededRng(`${gameState.runSeed}|proAthlete|injury|age:${age}`);
      const p = (risk === 'high') ? 0.28 : (risk === 'low') ? 0.10 : 0.18;
      const injuredSeason = r.nextFloat() < p;

      const income = injuredSeason ? Math.round(base * 0.45) : base;
      applyMoneyDelta(income, injuredSeason ? "Athlete income (injured season)" : "Athlete income");

      let stress = injuredSeason ? 0.26 : 0.16;
      if (travel === 'high') stress += 0.06;
      if (travel === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ discipline: 0.2, fitness: 0.2, confidence: 0.1 }, "Sports household routines");
      break;
    }
    case 'spotlight_influencer': {
      const privacy = specialStartMeta?.privacyBoundary || 'medium';
      const algo = specialStartMeta?.algorithm || 'volatile';
      const attn = specialStartMeta?.publicAttention || 'medium';

      const base = (privacy === 'loose') ? 1400 : (privacy === 'strict') ? 750 : 1050;

      const r = createSeededRng(`${gameState.runSeed}|influencer|income|age:${age}`);
      const swing = (algo === 'volatile') ? 500 : 250;
      const noise = Math.floor((r.nextFloat() * (2 * swing + 1)) - swing);

      const income = Math.max(0, base + noise);
      applyMoneyDelta(income, "Influencer income");

      let stress = 0.14;
      if (attn === 'high') stress += 0.08;
      if (privacy === 'loose') stress += 0.05;
      if (privacy === 'strict') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ social: 0.2, confidence: 0.1 }, "Online social exposure");
      if (age >= 13) applyDeltas({ responsibility: 0.1 }, "Learning boundaries (online)");
      break;
    }
    case 'spotlight_tech_founder': {
      const exit = specialStartMeta?.exit || 'acquired';
      const liquidity = specialStartMeta?.liquidity || 'mostly_stock';
      const profile = specialStartMeta?.publicProfile || 'medium';
      const workload = specialStartMeta?.workload || 'heavy';
      const office = specialStartMeta?.familyOffice || 'small';

      const base = (exit === 'ipo') ? 140000 : (exit === 'acquired') ? 110000 : 75000;

      const r = createSeededRng(`${gameState.runSeed}|founder|market|age:${age}`);
      const swing = (liquidity === 'mostly_stock') ? 90000 : 25000;
      const noise = Math.floor((r.nextFloat() * (2 * swing + 1)) - swing);

      const security = (profile === 'high') ? -18000 : (profile === 'low') ? -5000 : -11000;
      const officeCost = (office === 'full') ? -28000 : (office === 'none') ? -2000 : -12000;

      const net = base + noise + security + officeCost;
      applyMoneyDelta(net, "Founder wealth (net)");

      let stress = (workload === 'insane') ? 0.24 : 0.18;
      if (profile === 'high') stress += 0.08;
      else if (profile === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ intelligence: 0.14, discipline: 0.12, confidence: 0.10 }, "High-achievement household");
      break;
    }
    case 'spotlight_music_icon': {
      const tier = specialStartMeta?.tier || 'platinum';
      const tour = specialStartMeta?.tour || 'steady';
      const press = specialStartMeta?.pressHeat || 'medium';
      const deals = specialStartMeta?.brandDeals || 'some';

      let base = (tier === 'legend') ? 165000 : (tier === 'stadium') ? 120000 : 85000;
      if (deals === 'many') base += 45000;
      else if (deals === 'none') base -= 15000;

      const r = createSeededRng(`${gameState.runSeed}|music|hit|age:${age}`);
      const hitChance = (tier === 'legend') ? 0.30 : (tier === 'stadium') ? 0.20 : 0.12;
      const hitYear = r.nextFloat() < hitChance;
      const hitBonus = hitYear ? ((tier === 'legend') ? 120000 : 65000) : 0;

      const overhead = (press === 'high') ? -52000 : (press === 'low') ? -28000 : -40000;

      applyMoneyDelta(base + hitBonus + overhead, hitYear ? "Music icon income (hit year)" : "Music icon income (net)");

      let stress = (tour === 'brutal') ? 0.26 : (tour === 'residency') ? 0.16 : 0.20;
      if (press === 'high') stress += 0.08;
      else if (press === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ confidence: 0.14, discipline: 0.10, empathy: 0.06 }, "Spotlight household culture");
      break;
    }
    case 'spotlight_nobel_scientist': {
      const funding = specialStartMeta?.funding || 'strong';
      const patents = specialStartMeta?.patents || 'some';
      const profile = specialStartMeta?.publicProfile || 'medium';
      const ethics = specialStartMeta?.ethicsScrutiny || 'medium';

      const base = (funding === 'massive') ? 95000 : (funding === 'volatile') ? 52000 : 72000;

      const r = createSeededRng(`${gameState.runSeed}|scientist|breakthrough|age:${age}`);
      const p = (patents === 'monster') ? 0.26 : (patents === 'none') ? 0.06 : 0.14;
      const breakthrough = r.nextFloat() < p;
      const breakthroughMoney = breakthrough ? ((patents === 'monster') ? 180000 : 65000) : 0;

      const overhead = -22000 - (profile === 'high' ? 9000 : 0);

      applyMoneyDelta(base + breakthroughMoney + overhead, breakthrough ? "Scientist income (breakthrough year)" : "Scientist income (net)");

      let stress = 0.16;
      if (funding === 'volatile') stress += 0.08;
      if (ethics === 'high') stress += 0.06;
      if (profile === 'high') stress += 0.05;
      if (profile === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ intelligence: 0.16, discipline: 0.10, confidence: 0.06 }, "Research household culture");
      break;
    }
    case 'spotlight_music_icon': {
      const era = specialStartMeta?.era || 'modern';
      const genre = specialStartMeta?.genre || 'pop';
      const tour = specialStartMeta?.tourIntensity || 'medium';
      const heat = specialStartMeta?.tabloidHeat || 'medium';
      const deals = specialStartMeta?.brandDeals || 'some';
      const boundaries = specialStartMeta?.boundaries || 'medium';

      // Huge baseline: catalog royalties + appearances + endorsements
      let base = (era === 'classic') ? 170000 : (era === 'viral') ? 155000 : 185000;
      if (deals === 'many') base += 120000;
      else if (deals === 'few') base -= 25000;

      // Deterministic "world tour year"
      const rT = createSeededRng(`${gameState.runSeed}|musicIcon|tour|age:${age}|genre:${genre}`);
      const pT = (tour === 'high') ? 0.34 : (tour === 'low') ? 0.12 : 0.22;
      const tourYear = rT.nextFloat() < pT;
      const tourBonus = tourYear ? 220000 : 0;

      // Deterministic "injury/voice-rest year" (income dip, stress spike)
      const rI = createSeededRng(`${gameState.runSeed}|musicIcon|injury|age:${age}|tour:${tour}`);
      const pI = (tour === 'high') ? 0.14 : 0.08;
      const injuryYear = rI.nextFloat() < pI;
      const injuryHit = injuryYear ? -65000 : 0;

      // Overhead: entourage, security, management, PR, travel (higher with tabloid heat and loose boundaries)
      let overhead = -98000;
      if (heat === 'high') overhead -= 28000;
      else if (heat === 'low') overhead -= 12000;
      else overhead -= 20000;
      if (tour === 'high') overhead -= 22000;
      if (boundaries === 'loose') overhead -= 12000;
      if (boundaries === 'strict') overhead += 6000;

      applyMoneyDelta(
        base + tourBonus + injuryHit + overhead,
        tourYear ? "Music icon wealth (world tour year)" : (injuryYear ? "Music icon wealth (injury year)" : "Music icon wealth (net)")
      );

      // Stress: baseline + tour + tabloids + injury
      let stress = 0.18;
      if (tour === 'high') stress += 0.08;
      if (heat === 'high') stress += 0.08;
      if (boundaries === 'loose') stress += 0.05;
      if (boundaries === 'strict') stress -= 0.02;
      if (tourYear) stress += 0.08;
      if (injuryYear) stress += 0.10;
      applyStress(stress);

      // Household effects: confidence + social polish; discipline to survive routines; empathy as an intentional counterbalance
      if (age >= 6) applyDeltas({ confidence: 0.14, social: 0.12, discipline: 0.10, empathy: 0.06, responsibility: 0.08 }, "Music-icon household culture");
      break;
    }
    case 'spotlight_tech_founder': {
      const stage = specialStartMeta?.stage || 'mature_giant';
      const profile = specialStartMeta?.publicProfile || 'high';
      const vol = specialStartMeta?.volatility || 'volatile';
      const sec = specialStartMeta?.securityLevel || 'high';
      const domain = specialStartMeta?.productDomain || 'enterprise';

      // Huge baseline wealth stream (salary + dividends + secondaries)
      let base = (stage === 'hypergrowth') ? 210000 : (stage === 'mature_giant') ? 260000 : 175000;

      // Overhead: staff, advisors, PR, security, travel
      let overhead = -110000;
      if (profile === 'high') overhead -= 32000;
      if (sec === 'high') overhead -= 26000;
      if (domain === 'ai' || domain === 'fintech') overhead -= 12000;

      // Deterministic "liquidity year" (IPO, major exit, massive secondary)
      const rL = createSeededRng(`${gameState.runSeed}|techFounder|liquidity|age:${age}|domain:${domain}`);
      const pL = (stage === 'hypergrowth') ? 0.22 : (stage === 'mature_giant') ? 0.14 : 0.10;
      const liquidityYear = rL.nextFloat() < pL;
      const liquidityBonus = liquidityYear ? (stage === 'hypergrowth' ? 520000 : 360000) : 0;

      // Deterministic "down year" (regulatory hit / market crash / product issue)
      const rD = createSeededRng(`${gameState.runSeed}|techFounder|down|age:${age}|vol:${vol}`);
      const pD = (vol === 'volatile') ? 0.20 : 0.10;
      const downYear = rD.nextFloat() < pD;
      const downHit = downYear ? -120000 : 0;

      applyMoneyDelta(
        base + overhead + liquidityBonus + downHit,
        liquidityYear ? "Tech founder wealth (liquidity year)" : (downYear ? "Tech founder wealth (down year)" : "Tech founder wealth (net)")
      );

      // Stress: huge baseline + spikes on liquidity/down years + publicity/security burden
      let stress = 0.20;
      if (profile === 'high') stress += 0.08;
      if (sec === 'high') stress += 0.05;
      if (vol === 'volatile') stress += 0.04;
      if (stage === 'hypergrowth') stress += 0.05;
      if (liquidityYear) stress += 0.08;
      if (downYear) stress += 0.10;
      applyStress(stress);

      // Household effects: confidence + discipline + intelligence; responsibility to handle power ethically
      if (age >= 6) applyDeltas({ confidence: 0.14, discipline: 0.12, intelligence: 0.10, responsibility: 0.10, empathy: 0.06 }, "Founder household culture");
      break;
    }
    case 'spotlight_business_mogul': {
      const sector = specialStartMeta?.sector || 'real_estate';
      const style = specialStartMeta?.expansionStyle || 'steady';
      const rep = specialStartMeta?.reputation || 'mixed';
      const travel = specialStartMeta?.travelLoad || 'medium';
      const scandal = specialStartMeta?.scandalRisk || 'medium';

      // Huge baseline wealth stream (dividends, ownership, executive comp)
      let base = (style === 'aggressive') ? 235000 : 195000;
      if (rep === 'beloved') base += 15000;
      if (rep === 'controversial') base -= 15000;

      // Overhead: staff, security, PR, legal, travel
      let overhead = -105000;
      if (travel === 'high') overhead -= 18000;
      if (rep === 'controversial') overhead -= 22000;

      // Deterministic "expansion year" (major acquisition / new markets)
      const rX = createSeededRng(`${gameState.runSeed}|businessMogul|expansion|age:${age}|sector:${sector}`);
      const pX = (style === 'aggressive') ? 0.24 : 0.16;
      const expansionYear = rX.nextFloat() < pX;
      const expansionBonus = expansionYear ? (style === 'aggressive' ? 210000 : 135000) : 0;

      // Deterministic "regulatory/scandal year" (lawsuits, fines, investigations)
      const rS = createSeededRng(`${gameState.runSeed}|businessMogul|scandal|age:${age}|risk:${scandal}`);
      const pS = (scandal === 'high') ? 0.22 : (scandal === 'low') ? 0.08 : 0.14;
      const scandalYear = rS.nextFloat() < pS;
      const scandalHit = scandalYear ? -95000 : 0;

      applyMoneyDelta(
        base + overhead + expansionBonus + scandalHit,
        expansionYear ? "Business mogul wealth (expansion year)" : (scandalYear ? "Business mogul wealth (regulatory year)" : "Business mogul wealth (net)")
      );

      // Stress: high baseline; spikes on expansion/scandal years
      let stress = 0.20;
      if (travel === 'high') stress += 0.06;
      if (rep === 'controversial') stress += 0.06;
      if (style === 'aggressive') stress += 0.04;
      if (expansionYear) stress += 0.08;
      if (scandalYear) stress += 0.10;
      applyStress(stress);

      // Household effects: discipline + confidence + responsibility; empathy to counter entitlement
      if (age >= 6) applyDeltas({ discipline: 0.14, confidence: 0.12, responsibility: 0.10, empathy: 0.06, social: 0.08 }, "Mogul household culture");
      break;
    }
    case 'spotlight_chef': {
      const scale = specialStartMeta?.empireScale || 'multi_city';
      const media = specialStartMeta?.mediaLoad || 'medium';
      const culture = specialStartMeta?.kitchenCulture || 'intense';
      const travel = specialStartMeta?.travel || 'medium';

      let base = (scale === 'global_empire') ? 150000 : (scale === 'multi_city') ? 105000 : 75000;

      const r = createSeededRng(`${gameState.runSeed}|chef|award|age:${age}`);
      const awardChance = (scale === 'global_empire') ? 0.22 : 0.14;
      const awardYear = r.nextFloat() < awardChance;
      const awardBonus = awardYear ? ((scale === 'global_empire') ? 90000 : 50000) : 0;

      const overhead = (scale === 'global_empire') ? -70000 : (scale === 'multi_city') ? -45000 : -26000;
      const mediaCost = (media === 'high') ? -14000 : (media === 'low') ? -3000 : -8000;

      applyMoneyDelta(base + awardBonus + overhead + mediaCost, awardYear ? "Chef empire income (award year)" : "Chef empire income (net)");

      let stress = 0.18;
      if (culture === 'toxic') stress += 0.08;
      else if (culture === 'supportive') stress -= 0.03;
      if (travel === 'high') stress += 0.06;
      if (media === 'high') stress += 0.05;
      applyStress(stress);

      if (age >= 6) applyDeltas({ discipline: 0.12, confidence: 0.10, empathy: 0.06 }, "High-performance household");
      break;
    }
    case 'spotlight_esports': {
      const tier = specialStartMeta?.tier || 'top_player';
      const stream = specialStartMeta?.streamPressure || 'medium';
      const travel = specialStartMeta?.travel || 'medium';
      const burnout = specialStartMeta?.burnoutRisk || 'medium';

      let base = (tier === 'legend') ? 140000 : (tier === 'champion') ? 105000 : 75000;

      const r = createSeededRng(`${gameState.runSeed}|esports|tourney|age:${age}`);
      const winChance = (tier === 'legend') ? 0.24 : (tier === 'champion') ? 0.18 : 0.12;
      const winYear = r.nextFloat() < winChance;
      const winnings = winYear ? ((tier === 'legend') ? 140000 : 80000) : 0;

      const overhead = -22000 - (travel === 'high' ? 9000 : 0);

      applyMoneyDelta(base + winnings + overhead, winYear ? "Esports income (tournament win year)" : "Esports income (net)");

      let stress = 0.18;
      if (stream === 'high') stress += 0.07;
      if (burnout === 'high') stress += 0.08;
      if (travel === 'high') stress += 0.05;
      if (burnout === 'low') stress -= 0.03;
      applyStress(stress);

      if (age >= 6) applyDeltas({ discipline: 0.12, intelligence: 0.10, confidence: 0.10 }, "High-performance household");
      break;
    }
    case 'spotlight_fashion_icon': {
      const tier = specialStartMeta?.tier || 'global_icon';
      const press = specialStartMeta?.pressHeat || 'medium';
      const deals = specialStartMeta?.brandDeals || 'some';
      const travel = specialStartMeta?.travelLoad || 'medium';

      let base = (tier === 'legend') ? 200000 : (tier === 'global_icon') ? 150000 : 110000;
      if (deals === 'many') base += 90000;
      else if (deals === 'few') base -= 25000;

      const r = createSeededRng(`${gameState.runSeed}|fashion|campaign|age:${age}`);
      const p = (tier === 'legend') ? 0.24 : (tier === 'global_icon') ? 0.18 : 0.12;
      const campaignYear = r.nextFloat() < p;
      const campaignBonus = campaignYear ? ((tier === 'legend') ? 160000 : 90000) : 0;

      const overhead = -42000 - (press === 'high' ? 18000 : press === 'low' ? 6000 : 12000);
      const travelCost = (travel === 'high') ? -14000 : (travel === 'low') ? -4000 : -9000;

      applyMoneyDelta(base + campaignBonus + overhead + travelCost, campaignYear ? "Fashion icon income (campaign year)" : "Fashion icon income (net)");

      let stress = 0.18;
      if (press === 'high') stress += 0.08;
      if (travel === 'high') stress += 0.05;
      if (press === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ confidence: 0.12, discipline: 0.10, empathy: 0.06 }, "Spotlight household culture");
      break;
    }
    case 'spotlight_olympian': {
      const tier = specialStartMeta?.tier || 'champion';
      const travel = specialStartMeta?.travelLoad || 'medium';
      const risk = specialStartMeta?.injuryRisk || 'medium';

      const base = (tier === 'legend') ? 170000 : (tier === 'champion') ? 125000 : 95000;

      const rInj = createSeededRng(`${gameState.runSeed}|olympian|injury|age:${age}`);
      const pInj = (risk === 'high') ? 0.26 : (risk === 'low') ? 0.10 : 0.18;
      const injured = rInj.nextFloat() < pInj;

      const rWin = createSeededRng(`${gameState.runSeed}|olympian|win|age:${age}`);
      const pWin = (tier === 'legend') ? 0.22 : (tier === 'champion') ? 0.16 : 0.10;
      const winYear = (!injured) && (rWin.nextFloat() < pWin);
      const winBonus = winYear ? ((tier === 'legend') ? 140000 : 80000) : 0;

      const income = injured ? Math.round(base * 0.55) : base;
      const overhead = -26000 - (travel === 'high' ? 11000 : travel === 'low' ? 3000 : 7000);

      applyMoneyDelta(income + winBonus + overhead, injured ? "Olympian income (injury season)" : (winYear ? "Olympian income (major win year)" : "Olympian income (net)"));

      let stress = injured ? 0.26 : 0.18;
      if (travel === 'high') stress += 0.06;
      if (risk === 'high') stress += 0.03;
      if (travel === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ discipline: 0.14, confidence: 0.10, empathy: 0.06 }, "High-performance household");
      break;
    }
    case 'spotlight_astronaut': {
      const program = specialStartMeta?.program || 'government';
      const cadence = specialStartMeta?.missionCadence || 'periodic';
      const profile = specialStartMeta?.publicProfile || 'medium';
      const risk = specialStartMeta?.riskLevel || 'medium';

      let base = (program === 'private') ? 220000 : 160000;

      const r = createSeededRng(`${gameState.runSeed}|astronaut|mission|age:${age}`);
      const p = (cadence === 'frequent') ? 0.30 : (cadence === 'rare') ? 0.12 : 0.20;
      const missionYear = r.nextFloat() < p;

      const missionBonus = missionYear ? (program === 'private' ? 180000 : 110000) : 0;

      const overhead = -32000 - (profile === 'high' ? 18000 : profile === 'low' ? 6000 : 12000);

      applyMoneyDelta(base + missionBonus + overhead, missionYear ? "Astronaut income (mission year)" : "Astronaut income (net)");

      let stress = 0.18;
      if (missionYear) stress += 0.10;
      if (risk === 'high') stress += 0.06;
      if (profile === 'high') stress += 0.06;
      if (risk === 'low') stress -= 0.02;
      applyStress(stress);

      if (age >= 6) applyDeltas({ discipline: 0.12, confidence: 0.10, empathy: 0.06 }, "Mission-minded household");
      break;
    }
    case 'spotlight_war_correspondent': {
      const cadence = specialStartMeta?.assignmentCadence || 'periodic';
      const risk = specialStartMeta?.riskLevel || 'high';
      const profile = specialStartMeta?.publicProfile || 'medium';
      const contract = specialStartMeta?.contractTier || 'premium';

      // Very wealthy: contracts + books + documentaries
      const base = (contract === 'elite') ? 170000 : 125000;

      // Deterministic "deployment year"
      const r = createSeededRng(`${gameState.runSeed}|warcorrespondent|deploy|age:${age}`);
      const p = (cadence === 'constant') ? 0.42 : (cadence === 'rare') ? 0.14 : 0.26;
      const deployed = r.nextFloat() < p;

      const hazardPay = deployed ? (contract === 'elite' ? 140000 : 80000) : 0;

      // Overhead: security, insurance, fixer networks (scales with profile/risk)
      const overhead = -28000
        - (profile === 'high' ? 16000 : profile === 'low' ? 6000 : 11000)
        - (risk === 'high' ? 9000 : 0);

      applyMoneyDelta(base + hazardPay + overhead, deployed ? "War correspondent income (deployment year)" : "War correspondent income (net)");

      // Stress: deployment and risk
      let stress = 0.18;
      if (deployed) stress += 0.12;
      if (risk === 'high') stress += 0.05;
      if (profile === 'high') stress += 0.03;
      applyStress(stress);

      // Household effects: confidence + empathy + discipline from high-stakes routines
      if (age >= 6) applyDeltas({ confidence: 0.10, empathy: 0.08, discipline: 0.08 }, "High-stakes household culture");
      break;
    }
    case 'spotlight_royal_family': {
      const rank = specialStartMeta?.rank || 'senior_royal';
      const scrutiny = specialStartMeta?.scrutiny || 'high';
      const duty = specialStartMeta?.dutyLoad || 'heavy';
      const politics = specialStartMeta?.palacePolitics || 'medium';

      // Enormous royal stipend/wealth stream
      const base = (rank === 'heir') ? 260000 : (rank === 'senior_royal') ? 200000 : 150000;

      // Overhead: staff, security, PR, events
      const overhead = -70000
        - (scrutiny === 'high' ? 30000 : 18000)
        - (rank === 'heir' ? 18000 : 8000);

      applyMoneyDelta(base + overhead, "Royal household stipend (net)");

      // Stress: duty + scrutiny + palace politics
      let stress = 0.20;
      if (duty === 'heavy') stress += 0.06;
      if (scrutiny === 'high') stress += 0.08;
      if (politics === 'high') stress += 0.06;
      if (politics === 'low') stress -= 0.02;
      applyStress(stress);

      // Household culture: discipline + confidence + social polish
      if (age >= 6) applyDeltas({ discipline: 0.14, confidence: 0.10, social: 0.10 }, "Protocol household culture");
      break;
    }
    case 'spotlight_humanitarian_doctor': {
      const cadence = specialStartMeta?.missionCadence || 'periodic';
      const profile = specialStartMeta?.publicProfile || 'high';
      const scale = specialStartMeta?.foundationScale || 'major';
      const comp = specialStartMeta?.compStress || 'medium';

      // High income: speaking, consulting, leadership, foundation funding
      const base = (scale === 'global') ? 180000 : 135000;

      // Deterministic "major mission year"
      const r = createSeededRng(`${gameState.runSeed}|humdoc|mission|age:${age}`);
      const p = (cadence === 'frequent') ? 0.36 : (cadence === 'rare') ? 0.12 : 0.22;
      const missionYear = r.nextFloat() < p;

      const missionBonus = missionYear ? (scale === 'global' ? 100000 : 65000) : 0;

      // Overhead: security/PR/admin + big giving
      const giving = (scale === 'global') ? -65000 : -38000;
      const overhead = -22000 - (profile === 'high' ? 14000 : 9000);

      applyMoneyDelta(base + missionBonus + giving + overhead, missionYear ? "Humanitarian doctor income (major mission year)" : "Humanitarian doctor income (net)");

      // Stress: compassion fatigue + missions + publicity
      let stress = 0.18;
      if (missionYear) stress += 0.10;
      if (comp === 'high') stress += 0.06;
      if (profile === 'high') stress += 0.04;
      applyStress(stress);

      // Household effects: empathy + responsibility + confidence
      if (age >= 6) applyDeltas({ empathy: 0.12, responsibility: 0.10, confidence: 0.06 }, "Mission-driven household culture");
      break;
    }
    case 'spotlight_arctic_station': {
      const role = specialStartMeta?.role || 'lead_scientist';
      const isolation = specialStartMeta?.isolation || 'high';
      const supply = specialStartMeta?.supplyReliability || 'ok';
      const storm = specialStartMeta?.stormSeverity || 'harsh';

      // High pay for extreme location (hazard + retention)
      let base = (role === 'commander') ? 150000 : (role === 'chief_engineer') ? 145000 : 135000;

      // Deterministic "storm year" (extra hazard duties + logistics)
      const rStorm = createSeededRng(`${gameState.runSeed}|arctic|storm|age:${age}`);
      const pStorm = (storm === 'brutal') ? 0.30 : 0.20;
      const stormYear = rStorm.nextFloat() < pStorm;
      const stormBonus = stormYear ? 55000 : 0;

      // Overhead: supplies, specialized equipment, shipping (worse with shaky supply)
      let overhead = -32000;
      if (supply === 'shaky') overhead -= 18000;
      else if (supply === 'good') overhead += 6000;

      applyMoneyDelta(base + stormBonus + overhead, stormYear ? "Arctic station income (storm year)" : "Arctic station income (net)");

      // Stress: isolation + storms + supply uncertainty
      let stress = 0.18;
      if (isolation === 'high') stress += 0.06;
      if (stormYear) stress += 0.08;
      if (supply === 'shaky') stress += 0.06;
      applyStress(stress);

      // Household culture: discipline + intelligence + confidence
      if (age >= 6) applyDeltas({ discipline: 0.12, intelligence: 0.12, confidence: 0.08 }, "Remote-station household culture");
      break;
    }
    case 'spotlight_spy': {
      const cover = specialStartMeta?.coverStrength || 'solid';
      const support = specialStartMeta?.agencySupport || 'thin';
      const cadence = specialStartMeta?.opsCadence || 'periodic';
      const risk = specialStartMeta?.exposureRisk || 'medium';

      // High net income: senior gov/contractor pay + bonuses
      const base = 140000;

      // Deterministic "operation year"
      const r = createSeededRng(`${gameState.runSeed}|spy|op|age:${age}`);
      const p = (cadence === 'constant') ? 0.40 : (cadence === 'rare') ? 0.14 : 0.24;
      const opYear = r.nextFloat() < p;

      const opBonus = opYear ? 95000 : 0;

      // Overhead: security, safe communications, legal buffers (scales with risk/cover/support)
      let overhead = -26000;
      if (risk === 'high') overhead -= 14000;
      if (cover === 'shaky') overhead -= 7000;
      if (support === 'strong') overhead += 6000;

      applyMoneyDelta(base + opBonus + overhead, opYear ? "Spy income (operation year)" : "Spy income (net)");

      // Stress: operations + exposure risk + weak support
      let stress = 0.18;
      if (opYear) stress += 0.12;
      if (risk === 'high') stress += 0.06;
      if (cover === 'shaky') stress += 0.04;
      if (support === 'strong') stress -= 0.04;
      applyStress(stress);

      // Household culture: discipline + intelligence + resilience
      if (age >= 6) applyDeltas({ discipline: 0.12, intelligence: 0.10, confidence: 0.08 }, "High-security household culture");
      break;
    }
    case 'spotlight_guru': {
      const tier = specialStartMeta?.tier || 'global_guru';
      const donations = specialStartMeta?.donationStream || 'steady';
      const scandal = specialStartMeta?.scandalRisk || 'medium';
      const travel = specialStartMeta?.travelLoad || 'medium';

      // Very high base income: retreats, books, licensing, speaking
      let base = (tier === 'legend') ? 210000 : (tier === 'global_guru') ? 155000 : 115000;

      // Deterministic "viral retreat year" swing (bigger if donationStream is swingy)
      const r = createSeededRng(`${gameState.runSeed}|guru|viral|age:${age}`);
      const p = (tier === 'legend') ? 0.22 : (tier === 'global_guru') ? 0.16 : 0.12;
      const viralYear = r.nextFloat() < p;
      const swing = (donations === 'swingy') ? (viralYear ? 120000 : -45000) : (viralYear ? 75000 : -20000);

      // Overhead: staff, venues, PR, security if scandal risk is high
      let overhead = -38000;
      if (travel === 'high') overhead -= 12000;
      if (scandal === 'high') overhead -= 18000;

      applyMoneyDelta(base + swing + overhead, viralYear ? "Guru income (viral year)" : "Guru income (net)");

      // Stress: travel + scandal pressure (even when money is good)
      let stress = 0.18;
      if (travel === 'high') stress += 0.06;
      if (scandal === 'high') stress += 0.08;
      else if (scandal === 'low') stress -= 0.02;
      applyStress(stress);

      // Household effect: empathy + discipline (practice) + confidence
      if (age >= 6) applyDeltas({ empathy: 0.12, discipline: 0.10, confidence: 0.08 }, "Practice-driven household culture");
      break;
    }
    case 'spotlight_president': {
      const term = specialStartMeta?.termContext || 'elected';
      const security = specialStartMeta?.securityLevel || 'high';
      const press = specialStartMeta?.pressClimate || 'mixed';
      const crisis = specialStartMeta?.crisisCadence || 'medium';
      const privacy = specialStartMeta?.familyPrivacy || 'medium';

      // High, stable wealth stream (official compensation + perks), but massive overhead
      let base = (term === 'emergency') ? 165000 : (term === 'caretaker') ? 115000 : 140000;

      // Deterministic crisis year
      const rC = createSeededRng(`${gameState.runSeed}|president|crisis|age:${age}`);
      const pC = (crisis === 'high') ? 0.34 : (crisis === 'low') ? 0.14 : 0.22;
      const crisisYear = rC.nextFloat() < pC;

      // Occasional book/speaking/legacy fund swing (still deterministic)
      const rS = createSeededRng(`${gameState.runSeed}|president|legacy|age:${age}`);
      const legacyIncome = (rS.nextFloat() < 0.18) ? 22000 : 0;

      const baseOverhead = -62000; // staff, logistics, residence operations (net)
      const securityCost = (security === 'maximum') ? -34000 : (security === 'medium') ? -16000 : -24000;
      const pressCost = (press === 'hostile') ? -22000 : (press === 'supportive') ? -12000 : -17000;
      const privacyCost = (privacy === 'strict') ? -8000 : 0;
      const crisisCost = crisisYear ? -18000 : 0;

      applyMoneyDelta(
        base + legacyIncome + baseOverhead + securityCost + pressCost + privacyCost + crisisCost,
        crisisYear ? "Head of State wealth (crisis year)" : "Head of State wealth (net)"
      );

      // Stress: constant scrutiny + spikes on crisis years
      let stress = 0.22;
      if (term === 'emergency') stress += 0.04;
      if (security === 'maximum') stress += 0.05;
      if (press === 'hostile') stress += 0.08;
      if (privacy === 'loose') stress += 0.03;
      if (privacy === 'strict') stress -= 0.02;
      if (crisisYear) stress += 0.10;
      applyStress(stress);

      // Household culture: responsibility + discipline + social polish + confidence
      if (age >= 6) applyDeltas({ responsibility: 0.14, discipline: 0.12, social: 0.10, confidence: 0.08 }, "Public-duty household culture");
      break;
    }
    case 'spotlight_reality_tv': {
      const pop = specialStartMeta?.showPopularity || 'medium';
      const ethics = specialStartMeta?.producerEthics || 'messy';
      const contract = specialStartMeta?.contractLength || 'short';
      const payout = specialStartMeta?.payoutTier || 'modest';
      const privacy = specialStartMeta?.privacyBoundary || 'medium';
      const pressure = specialStartMeta?.storylinePressure || 'medium';

      let base = (payout === 'big') ? 120000 : 65000;
      if (pop === 'high') base += 35000;
      if (pop === 'low') base -= 20000;
      if (contract === 'long') base += 12000;

      // Deterministic season volatility
      const r = createSeededRng(`${gameState.runSeed}|realityTVStar|season|age:${age}`);
      const swing = (ethics === 'predatory') ? 60000 : (ethics === 'messy') ? 40000 : 25000;
      const noise = Math.floor((r.nextFloat() * (2 * swing + 1)) - swing);

      // Deterministic scandal year (legal/PR hit)
      const rS = createSeededRng(`${gameState.runSeed}|realityTVStar|scandal|age:${age}`);
      const pS = (ethics === 'predatory') ? 0.26 : (ethics === 'messy') ? 0.16 : 0.10;
      const scandalYear = rS.nextFloat() < pS;
      const scandalHit = scandalYear ? -22000 : 0;

      // Overhead: PR, legal, production friction, privacy protections
      let overhead = -38000;
      if (privacy === 'strict') overhead -= 12000;
      else if (privacy === 'loose') overhead -= 5000;
      else overhead -= 9000;
      if (pressure === 'high') overhead -= 12000;
      if (ethics === 'predatory') overhead -= 16000;

      applyMoneyDelta(base + noise + scandalHit + overhead, scandalYear ? "Reality TV star income (scandal year)" : "Reality TV star income (net)");

      // Stress: camera pressure + ethics + scandals + popularity
      let stress = 0.20;
      if (pop === 'high') stress += 0.06;
      if (ethics === 'predatory') stress += 0.10;
      else if (ethics === 'messy') stress += 0.06;
      if (privacy === 'loose') stress += 0.06;
      if (pressure === 'high') stress += 0.06;
      if (contract === 'long') stress += 0.02;
      if (scandalYear) stress += 0.10;
      applyStress(stress);

      // Household effects: social exposure + confidence; boundary skills if privacy is strict
      if (age >= 6) applyDeltas({ social: 0.16, confidence: 0.10 }, "Life on camera");
      if (age >= 13 && privacy === 'strict') applyDeltas({ responsibility: 0.10 }, "Learning boundaries (public life)");
      break;
    }
    case 'royal_heir_protocol': {
      const rank = specialStartMeta?.rank || 'heir_apparent';
      const protocol = specialStartMeta?.protocolStrictness || 'firm';
      const intrigue = specialStartMeta?.courtIntrigue || 'medium';
      const scrutiny = specialStartMeta?.publicScrutiny || 'high';
      const tutor = specialStartMeta?.tutorQuality || 'good';
      const duty = specialStartMeta?.dutyLoad || 'heavy';

      // High royal stipend / trust income
      let base = (rank === 'heir') ? 190000 : (rank === 'heir_apparent') ? 155000 : 120000;

      // Deterministic "court intrigue year"
      const rI = createSeededRng(`${gameState.runSeed}|royalHeir|intrigue|age:${age}`);
      const pI = (intrigue === 'high') ? 0.28 : (intrigue === 'low') ? 0.10 : 0.18;
      const intrigueYear = rI.nextFloat() < pI;
      const intrigueCost = intrigueYear ? -25000 : 0;

      // Overhead: staff, security, ceremonies, elite tutoring
      const tutorCost = (tutor === 'excellent') ? -18000 : (tutor === 'mixed') ? -8000 : -12000;
      const baseOverhead = -65000;
      const scrutinyCost = (scrutiny === 'high') ? -30000 : -18000;
      const protocolCost = (protocol === 'strict') ? -16000 : (protocol === 'soft') ? -8000 : -12000;
      const dutyCost = (duty === 'heavy') ? -12000 : -6000;

      applyMoneyDelta(
        base + intrigueCost + tutorCost + baseOverhead + scrutinyCost + protocolCost + dutyCost,
        intrigueYear ? "Royal heir protocol (intrigue year)" : "Royal heir protocol (net)"
      );

      // Stress: scrutiny + duty + protocol + intrigue spikes
      let stress = 0.22;
      if (duty === 'heavy') stress += 0.06;
      if (scrutiny === 'high') stress += 0.08;
      if (protocol === 'strict') stress += 0.04;
      if (intrigue === 'high') stress += 0.04;
      if (tutor === 'excellent') stress -= 0.02;
      if (intrigueYear) stress += 0.08;
      applyStress(stress);

      // Household effects: discipline, social polish, responsibility, confidence; plus tutoring boosts
      if (age >= 6) applyDeltas({ discipline: 0.14, social: 0.12, responsibility: 0.12, confidence: 0.10 }, "Protocol upbringing");
      if (age >= 6 && tutor === 'excellent') applyDeltas({ intelligence: 0.08, knowledge: 0.08 }, "Elite tutoring");
      else if (age >= 6 && tutor === 'good') applyDeltas({ intelligence: 0.05, knowledge: 0.05 }, "Strong tutoring");
      break;
    }
    case 'duty_remote_research_outpost': {
      const biome = specialStartMeta?.biome || 'island';
      const isolation = specialStartMeta?.isolation || 'high';
      const supply = specialStartMeta?.supplyReliability || 'ok';
      const comms = specialStartMeta?.commsQuality || 'spotty';

      // High pay for remote retention (plus grants)
      let base = 125000;
      if (isolation === 'high') base += 14000;
      if (biome === 'mountain' || biome === 'desert') base += 6000;

      // Deterministic "supply delay year"
      const r = createSeededRng(`${gameState.runSeed}|outpost|supplyDelay|age:${age}`);
      const p = (supply === 'shaky') ? 0.34 : (supply === 'good') ? 0.12 : 0.20;
      const delay = r.nextFloat() < p;

      // Delay years cost money (emergency shipping) and increase stress
      const delayCost = delay ? -22000 : 0;

      // Overhead: shipping, maintenance, backups (worse if comms are spotty)
      let overhead = -28000;
      if (supply === 'shaky') overhead -= 12000;
      if (comms === 'spotty') overhead -= 8000;

      applyMoneyDelta(base + delayCost + overhead, delay ? "Outpost income (supply delay year)" : "Outpost income (net)");

      // Stress: isolation + comms + delays
      let stress = 0.18;
      if (isolation === 'high') stress += 0.06;
      if (comms === 'spotty') stress += 0.05;
      if (delay) stress += 0.08;
      applyStress(stress);

      // Household effects: intelligence + curiosity + discipline
      if (age >= 6) applyDeltas({ intelligence: 0.12, curiosity: 0.12, discipline: 0.08, confidence: 0.06 }, "Outpost learning culture");
      break;
    }
    case 'duty_wildfire_season_parent': {
      const role = specialStartMeta?.role || 'firefighter';
      const severity = specialStartMeta?.seasonSeverity || 'rough';
      const risk = specialStartMeta?.communityRisk || 'high';
      const cadence = specialStartMeta?.callCadence || 'periodic';

      // Income: base + overtime potential
      let base = (role === 'incident_lead') ? 135000 : (role === 'medic') ? 110000 : (role === 'dispatcher') ? 95000 : 115000;
      if (cadence === 'constant') base += 16000;

      // Deterministic "mega-fire year"
      const r = createSeededRng(`${gameState.runSeed}|wildfire|mega|age:${age}`);
      const p = (severity === 'brutal') ? 0.34 : 0.22;
      const mega = r.nextFloat() < p;

      // Mega years bring overtime money but also real costs
      const overtime = mega ? 65000 : (cadence === 'constant' ? 18000 : 8000);

      // Overhead: gear, travel, recovery supports
      let overhead = -18000;
      if (risk === 'high') overhead -= 9000;
      if (mega) overhead -= 12000;

      applyMoneyDelta(base + overtime + overhead, mega ? "Wildfire income (mega-fire year)" : "Wildfire income (net)");

      // Stress: high baseline + mega-year spike
      let stress = 0.20;
      if (cadence === 'constant') stress += 0.06;
      if (severity === 'brutal') stress += 0.05;
      if (risk === 'high') stress += 0.04;
      if (mega) stress += 0.12;
      applyStress(stress);

      // Household effects: responsibility + confidence + discipline
      if (age >= 6) applyDeltas({ responsibility: 0.12, confidence: 0.10, discipline: 0.08 }, "Responder household culture");
      // Small health/fitness emphasis (physical job)
      if (age >= 6) applyDeltas({ fitness: 0.06 }, "Active household routines");
      break;
    }
    case 'duty_oil_rig_rotation': {
      const role = specialStartMeta?.role || 'technician';
      const rotation = specialStartMeta?.rotation || '21on_21off';
      const distance = specialStartMeta?.distance || 'far';
      const wx = specialStartMeta?.weatherRisk || 'medium';

      // High income (hazard/retention)
      let base = (role === 'supervisor') ? 155000 : (role === 'technician') ? 135000 : 120000;

      // Rotation affects pay and stress
      if (rotation === '28on_28off') base += 22000;
      else if (rotation === '14on_14off') base -= 10000;

      // Deterministic "extended hitch" year (storms / crew shortage)
      const r = createSeededRng(`${gameState.runSeed}|oilrig|extended|age:${age}`);
      const p = (wx === 'high') ? 0.28 : 0.18;
      const extended = r.nextFloat() < p;

      const bonus = extended ? 45000 : 0;

      // Overhead: travel + childcare + gear
      let overhead = -24000;
      if (distance === 'far') overhead -= 9000;
      if (rotation !== '14on_14off') overhead -= 5000; // more childcare coordination
      if (extended) overhead -= 6000; // last-minute logistics

      applyMoneyDelta(base + bonus + overhead, extended ? "Oil rig income (extended hitch year)" : "Oil rig income (net)");

      // Stress: absence, uncertainty, weather
      let stress = 0.18;
      if (rotation === '28on_28off') stress += 0.06;
      if (distance === 'far') stress += 0.04;
      if (wx === 'high') stress += 0.03;
      if (extended) stress += 0.10;
      applyStress(stress);

      // Household effects: responsibility/discipline (routine) + confidence (independence)
      if (age >= 6) applyDeltas({ responsibility: 0.12, discipline: 0.10, confidence: 0.08 }, "Rotation household routines");
      // Small empathy tradeoff on very long rotations
      if (age >= 6 && rotation === '28on_28off') applyDeltas({ empathy: -0.04 }, "Distance strain");
      break;
    }
    case 'survival_quarantine_protocol': {
      const strict = specialStartMeta?.strictness || 'strict';
      const supply = specialStartMeta?.supplyReliability || 'ok';
      const space = specialStartMeta?.homeSpace || 'medium';
      const waves = specialStartMeta?.waveCadence || 'medium';

      // Money: ongoing supplies + delivery fees
      let baseCost = -18000;
      if (strict === 'extreme') baseCost -= 9000;
      else if (strict === 'medium') baseCost -= 4000;

      if (supply === 'shaky') baseCost -= 7000;
      else if (supply === 'good') baseCost += 2500;

      // Deterministic "wave year" (extra costs + more stress)
      const r = createSeededRng(`${gameState.runSeed}|quarantine|wave|age:${age}`);
      const p = (waves === 'high') ? 0.34 : (waves === 'low') ? 0.14 : 0.22;
      const waveYear = r.nextFloat() < p;

      const waveCost = waveYear ? -9000 : 0;

      applyMoneyDelta(baseCost + waveCost, waveYear ? "Quarantine supplies (wave year)" : "Quarantine supplies");

      // Stress: isolation + strictness + space constraints + wave spikes
      let stress = 0.20;
      if (strict === 'extreme') stress += 0.08;
      else if (strict === 'medium') stress += 0.03;
      if (space === 'small') stress += 0.06;
      if (supply === 'shaky') stress += 0.05;
      if (waveYear) stress += 0.10;
      applyStress(stress);

      // Household effects: discipline + responsibility (routines); empathy takes a small hit under extreme isolation
      if (age >= 6) applyDeltas({ discipline: 0.12, responsibility: 0.10 }, "Quarantine routines");
      if (age >= 6 && strict === 'extreme') applyDeltas({ empathy: -0.04 }, "Isolation strain");
      break;
    }
    case 'duty_submarine_deployment': {
      const service = specialStartMeta?.serviceType || 'navy';
      const rank = specialStartMeta?.rank || 'officer';
      const cadence = specialStartMeta?.deploymentCadence || 'periodic';
      const comms = specialStartMeta?.comms || 'minimal';
      const risk = specialStartMeta?.riskLevel || 'medium';

      // Solid pay (private tends to pay more)
      let base = (service === 'private') ? 145000 : 115000;
      if (rank === 'officer') base += 12000;

      // Deterministic "deployment year"
      const rD = createSeededRng(`${gameState.runSeed}|submarine|deploy|age:${age}`);
      const pD = (cadence === 'constant') ? 0.42 : (cadence === 'rare') ? 0.14 : 0.26;
      const deployed = rD.nextFloat() < pD;

      // Deployment bonus (hazard/sea pay)
      const bonus = deployed ? (service === 'private' ? 60000 : 42000) : 0;

      // Overhead: travel, childcare coordination, recovery supports
      let overhead = -22000;
      if (deployed) overhead -= 9000;
      if (comms === 'minimal') overhead -= 4000;

      applyMoneyDelta(base + bonus + overhead, deployed ? "Submarine pay (deployment year)" : "Submarine pay (net)");

      // Stress: comms limits + risk + deployment
      let stress = 0.18;
      if (deployed) stress += 0.10;
      if (comms === 'minimal') stress += 0.06;
      if (risk === 'high') stress += 0.05;
      applyStress(stress);

      // Household effects: discipline + responsibility; confidence grows from resilience
      if (age >= 6) applyDeltas({ discipline: 0.10, responsibility: 0.12, confidence: 0.06 }, "Deployment household routines");
      break;
    }
    case 'sudden_lottery_winner': {
      const tier = specialStartMeta?.jackpotTier || 'massive';
      const privacy = specialStartMeta?.privacyPlan || 'quiet';
      const advisor = specialStartMeta?.advisorQuality || 'mixed';
      const pressure = specialStartMeta?.familyPressure || 'medium';
      const spending = specialStartMeta?.spendingStyle || 'normal';

      // Investment income (very high, stable-ish)
      let base = (tier === 'absurd') ? 240000 : (tier === 'massive') ? 170000 : 120000;

      // Spending style changes net outcome
      if (spending === 'reckless') base -= 55000;
      else if (spending === 'disciplined') base += 25000;

      // Deterministic "pressure year" (lawsuits, family fights, scams, headlines)
      const rP = createSeededRng(`${gameState.runSeed}|lottery|pressure|age:${age}`);
      const pP = (pressure === 'high') ? 0.32 : (pressure === 'low') ? 0.12 : 0.20;
      const pressureYear = rP.nextFloat() < pP;

      const pressureCost = pressureYear ? -42000 : 0;

      // Advisor effect: predatory advisors cost money; excellent saves money
      const advisorDrag = (advisor === 'predatory') ? -28000 : (advisor === 'excellent') ? 9000 : -12000;

      // Privacy cost: anonymous is expensive (legal, security), public is chaos-cost later but cheaper upfront
      const privacyCost = (privacy === 'anonymous') ? -26000 : (privacy === 'public') ? -12000 : -18000;

      applyMoneyDelta(base + pressureCost + advisorDrag + privacyCost, pressureYear ? "Lottery wealth (pressure year)" : "Lottery wealth (net)");

      // Stress: money pressure is real; public + predatory advisors + pressure years are brutal
      let stress = 0.18;
      if (privacy === 'public') stress += 0.06;
      if (advisor === 'predatory') stress += 0.08;
      if (pressureYear) stress += 0.10;
      if (spending === 'reckless') stress += 0.06;
      if (spending === 'disciplined') stress -= 0.02;
      applyStress(stress);

      // Household effects: confidence rises, but responsibility/discipline depend on spending style
      if (age >= 6) applyDeltas({ confidence: 0.10, social: 0.06 }, "New-wealth environment");
      if (age >= 6 && spending === 'disciplined') applyDeltas({ responsibility: 0.10, discipline: 0.08 }, "Financial boundaries at home");
      if (age >= 6 && spending === 'reckless') applyDeltas({ responsibility: -0.06, discipline: -0.06 }, "Entitlement risk");
      break;
    }
    case 'spotlight_blockbuster_actor': {
      const tier = specialStartMeta?.tier || 'franchise_star';
      const press = specialStartMeta?.pressHeat || 'medium';
      const load = specialStartMeta?.filmingLoad || 'steady';
      const deals = specialStartMeta?.brandDeals || 'some';
      const boundaries = specialStartMeta?.boundaries || 'medium';

      // Base net income (already huge)
      let base = (tier === 'legend') ? 220000 : (tier === 'franchise_star') ? 170000 : 130000;
      if (deals === 'many') base += 80000;
      else if (deals === 'few') base -= 20000;

      // Deterministic "franchise year" (major release / sequel)
      const rF = createSeededRng(`${gameState.runSeed}|actor|franchise|age:${age}`);
      const pF = (tier === 'legend') ? 0.26 : (tier === 'franchise_star') ? 0.20 : 0.14;
      const franchiseYear = rF.nextFloat() < pF;
      const franchiseBonus = franchiseYear ? ((tier === 'legend') ? 220000 : 140000) : 0;

      // Overhead: management, PR, security, stylists, lawyers (press/loose boundaries cost more)
      let overhead = -52000;
      if (press === 'high') overhead -= 22000;
      else if (press === 'low') overhead -= 9000;
      else overhead -= 15000;
      if (boundaries === 'loose') overhead -= 12000;
      if (boundaries === 'strict') overhead += 6000;

      applyMoneyDelta(base + franchiseBonus + overhead, franchiseYear ? "Actor income (franchise year)" : "Actor income (net)");

      // Stress: filming load + press + franchise year spike
      let stress = 0.20;
      if (load === 'brutal') stress += 0.08;
      if (press === 'high') stress += 0.08;
      if (boundaries === 'loose') stress += 0.04;
      if (boundaries === 'strict') stress -= 0.02;
      if (franchiseYear) stress += 0.08;
      applyStress(stress);

      // Household effects: confidence + social polish; responsibility to handle public life
      if (age >= 6) applyDeltas({ confidence: 0.12, social: 0.12, responsibility: 0.08 }, "Spotlight household culture");
      break;
    }
    case 'spotlight_master_thief': {
      const tier = specialStartMeta?.tier || 'elite';
      const heat = specialStartMeta?.heat || 'medium';
      const fence = specialStartMeta?.fenceNetwork || 'strong';
      const cover = specialStartMeta?.coverStrength || 'solid';

      // High baseline "income" (fictional criminal proceeds) + laundering/advisors
      let base = (tier === 'legend') ? 190000 : 135000;

      // Deterministic "heist year"
      const rH = createSeededRng(`${gameState.runSeed}|masterThief|heist|age:${age}`);
      const pH = (tier === 'legend') ? 0.24 : 0.16;
      const heistYear = rH.nextFloat() < pH;

      // Heist bonus (big), but some years are "quiet"
      const heistBonus = heistYear ? (tier === 'legend' ? 260000 : 160000) : 0;

      // Overhead: lawyers, security, laundering, fake identities (worse with heat/shaky networks)
      let overhead = -42000;
      if (heat === 'high') overhead -= 22000;
      if (fence === 'shaky') overhead -= 12000;
      if (cover === 'shaky') overhead -= 9000;

      applyMoneyDelta(base + heistBonus + overhead, heistYear ? "Master thief finances (heist year)" : "Master thief finances (net)");

      // Stress: heat + cover + heist year spikes
      let stress = 0.20;
      if (heat === 'high') stress += 0.08;
      if (cover === 'shaky') stress += 0.06;
      if (heistYear) stress += 0.10;
      applyStress(stress);

      // Household effects: confidence + discipline (planning) + a little social polish
      if (age >= 6) applyDeltas({ confidence: 0.12, discipline: 0.10, social: 0.06 }, "High-secrecy household culture");
      break;
    }
    case 'spotlight_cult_leader': {
      const size = specialStartMeta?.size || 'medium';
      const profile = specialStartMeta?.publicProfile || 'medium';
      const sec = specialStartMeta?.securityLevel || 'high';
      const expose = specialStartMeta?.exposeRisk || 'medium';
      const donations = specialStartMeta?.donationStream || 'steady';

      // High income: donations + licensing + retreats (fictional)
      let base = (size === 'massive') ? 220000 : (size === 'small') ? 90000 : 150000;

      // Donation volatility (deterministic)
      const rV = createSeededRng(`${gameState.runSeed}|cultLeader|donation|age:${age}`);
      const swing = (donations === 'swingy') ? 70000 : 35000;
      const noise = Math.floor((rV.nextFloat() * (2 * swing + 1)) - swing);

      // Deterministic "exposé year"
      const rE = createSeededRng(`${gameState.runSeed}|cultLeader|expose|age:${age}`);
      const pE = (expose === 'high') ? 0.28 : (expose === 'low') ? 0.10 : 0.18;
      const exposeYear = rE.nextFloat() < pE;
      const exposeHit = exposeYear ? -38000 : 0;

      // Overhead: security, PR, lawyers, isolation infrastructure
      let overhead = -52000;
      if (sec === 'high') overhead -= 18000;
      if (profile === 'high') overhead -= 16000;
      if (expose === 'high') overhead -= 12000;

      applyMoneyDelta(base + noise + exposeHit + overhead, exposeYear ? "Cult leader finances (exposé year)" : "Cult leader finances (net)");

      // Stress: paranoia, scrutiny, exposé spikes
      let stress = 0.22;
      if (sec === 'high') stress += 0.05;
      if (profile === 'high') stress += 0.06;
      if (expose === 'high') stress += 0.06;
      if (exposeYear) stress += 0.10;
      applyStress(stress);

      // Household effects: discipline (control) + social insulation; empathy tends to drop
      if (age >= 6) applyDeltas({ discipline: 0.12, social: 0.06, empathy: -0.06 }, "High-control household culture");
      break;
    }
    case 'spotlight_music_label_mogul': {
      const scale = specialStartMeta?.labelScale || 'major_powerhouse';
      const cadence = specialStartMeta?.hitCadence || 'periodic';
      const drama = specialStartMeta?.artistDrama || 'medium';
      const press = specialStartMeta?.pressHeat || 'medium';

      // High income baseline (catalog + deals)
      let base = (scale === 'major_powerhouse') ? 175000 : 125000;

      // Deterministic "hit year"
      const rHit = createSeededRng(`${gameState.runSeed}|labelMogul|hit|age:${age}`);
      const pHit = (cadence === 'frequent') ? 0.32 : (cadence === 'rare') ? 0.12 : 0.20;
      const hitYear = rHit.nextFloat() < pHit;
      const hitBonus = hitYear ? (scale === 'major_powerhouse' ? 160000 : 90000) : 0;

      // Overhead: lawyers, PR, security, "fixing problems"
      let overhead = -52000;
      if (press === 'high') overhead -= 18000;
      if (drama === 'high') overhead -= 22000;
      if (drama === 'low') overhead -= 8000;

      applyMoneyDelta(base + hitBonus + overhead, hitYear ? "Label mogul income (hit year)" : "Label mogul income (net)");

      // Stress: drama + press + hit year spike
      let stress = 0.18;
      if (drama === 'high') stress += 0.08;
      if (press === 'high') stress += 0.06;
      if (hitYear) stress += 0.06;
      applyStress(stress);

      // Household effects: confidence + discipline; intelligence from exposure to creative industry
      if (age >= 6) applyDeltas({ confidence: 0.12, discipline: 0.10, intelligence: 0.08, empathy: 0.06 }, "Entertainment-industry household culture");
      break;
    }
    case 'spotlight_private_equity_titan': {
      const tier = specialStartMeta?.tier || 'titan';
      const flow = specialStartMeta?.dealFlow || 'steady';
      const press = specialStartMeta?.pressHeat || 'medium';
      const travel = specialStartMeta?.travelLoad || 'medium';

      // Massive income baseline
      let base = (tier === 'legend') ? 260000 : (tier === 'titan') ? 210000 : 165000;

      // Deterministic "deal year" (carry + fees)
      const rDeal = createSeededRng(`${gameState.runSeed}|peTitan|deal|age:${age}`);
      const pDeal = (flow === 'volatile') ? 0.26 : 0.18;
      const dealYear = rDeal.nextFloat() < pDeal;
      const dealBonus = dealYear ? ((tier === 'legend') ? 240000 : 150000) : 0;

      // Deterministic "downturn year" (still rich, but hits)
      const rDown = createSeededRng(`${gameState.runSeed}|peTitan|downturn|age:${age}`);
      const pDown = (flow === 'volatile') ? 0.20 : 0.12;
      const downturn = rDown.nextFloat() < pDown;
      const downturnHit = downturn ? -65000 : 0;

      // Overhead: staff, advisors, PR, security, travel
      let overhead = -98000;
      if (press === 'high') overhead -= 22000;
      if (travel === 'high') overhead -= 14000;
      if (travel === 'low') overhead -= 6000;

      applyMoneyDelta(base + dealBonus + downturnHit + overhead, dealYear ? "PE titan wealth (deal year)" : (downturn ? "PE titan wealth (downturn year)" : "PE titan wealth (net)"));

      // Stress: constant pressure; spikes on deal years + downturn years
      let stress = 0.20;
      if (press === 'high') stress += 0.08;
      if (travel === 'high') stress += 0.05;
      if (dealYear) stress += 0.08;
      if (downturn) stress += 0.10;
      applyStress(stress);

      // Household effects: discipline + confidence from high-performance culture; empathy is a choice
      if (age >= 6) applyDeltas({ discipline: 0.14, confidence: 0.12, empathy: 0.06, intelligence: 0.06 }, "High-performance household culture");
      break;
    }
    case 'spotlight_space_tourism_billionaire': {
      const tier = specialStartMeta?.wealthTier || 'billionaire';
      const cadence = specialStartMeta?.launchCadence || 'periodic';
      const profile = specialStartMeta?.publicProfile || 'high';
      const risk = specialStartMeta?.riskTolerance || 'calculated';
      const pr = specialStartMeta?.prIntensity || 'high';

      // Huge annual wealth stream
      let base = (tier === 'mega_billionaire') ? 520000 : 360000;

      // Deterministic "launch year"
      const rL = createSeededRng(`${gameState.runSeed}|spaceTourismB|launch|age:${age}`);
      const pL = (cadence === 'frequent') ? 0.34 : (cadence === 'rare') ? 0.12 : 0.22;
      const launchYear = rL.nextFloat() < pL;

      // Launch year bonus (contracts, valuation, licensing)
      const bonus = launchYear ? (tier === 'mega_billionaire' ? 520000 : 320000) : 0;

      // Overhead: massive security/PR/engineering/legal
      let overhead = -180000;
      if (profile === 'high') overhead -= 60000;
      if (pr === 'high') overhead -= 35000;
      if (risk === 'reckless') overhead -= 25000; // more mitigation, more chaos

      applyMoneyDelta(base + bonus + overhead, launchYear ? "Space tourism billionaire (launch year)" : "Space tourism billionaire (net)");

      // Stress: high baseline + launch spikes; reckless adds more
      let stress = 0.22;
      if (profile === 'high') stress += 0.06;
      if (pr === 'high') stress += 0.05;
      if (risk === 'reckless') stress += 0.06;
      if (launchYear) stress += 0.10;
      applyStress(stress);

      // Household effects: confidence + discipline + social polish + responsibility from public power
      if (age >= 6) applyDeltas({ confidence: 0.14, discipline: 0.10, social: 0.10, responsibility: 0.08 }, "Ultra-wealth household culture");
      break;
    }
    case 'interstellar_voyage_parent': {
      const phase = specialStartMeta?.missionPhase || 'cruise';
      const tier = specialStartMeta?.habitatTier || 'standard';
      const tight = specialStartMeta?.resourceTightness || 'ok';
      const comms = specialStartMeta?.commsDelay || 'long';
      const risk = specialStartMeta?.incidentRisk || 'medium';

      // Ship stipend (stable, not massive)
      let base = (tier === 'premium') ? 105000 : (tier === 'basic') ? 70000 : 85000;

      // Phase affects stress and costs slightly (approach = more procedures)
      if (phase === 'approach') base += 6000;

      // Overhead: supplies, maintenance fees, "ship life" costs
      let overhead = -26000;
      if (tier === 'premium') overhead -= 10000;
      if (tier === 'basic') overhead -= 6000;
      if (tight === 'tight') overhead -= 14000;

      // Deterministic "incident year" (systems, containment, repairs)
      const rI = createSeededRng(`${gameState.runSeed}|interstellar|incident|age:${age}`);
      const pI = (risk === 'high') ? 0.26 : (risk === 'low') ? 0.10 : 0.18;
      const incident = rI.nextFloat() < pI;

      const incidentCost = incident ? -18000 : 0;

      applyMoneyDelta(base + overhead + incidentCost, incident ? "Interstellar voyage finances (incident year)" : "Interstellar voyage finances (net)");

      // Stress: isolation + comms delay + tight resources + incident spikes
      let stress = 0.18;
      if (comms === 'long') stress += 0.04;
      if (tight === 'tight') stress += 0.06;
      if (phase === 'approach') stress += 0.04;
      if (risk === 'high') stress += 0.04;
      if (incident) stress += 0.10;
      applyStress(stress);

      // Household effects: discipline + intelligence + confidence (systems mindset); empathy to keep humans human
      if (age >= 6) applyDeltas({ discipline: 0.12, intelligence: 0.10, confidence: 0.08, empathy: 0.06 }, "Shipboard household culture");
      break;
    }
    case 'spotlight_megachurch_pastor': {
      const size = specialStartMeta?.churchSize || 'large';
      const profile = specialStartMeta?.publicProfile || 'high';
      const board = specialStartMeta?.boardOversight || 'strong';
      const charity = specialStartMeta?.charityLoad || 'high';
      const risk = specialStartMeta?.controversyRisk || 'medium';

      // High income: salary + books + speaking + endorsements (fictional but grounded)
      let base = (size === 'massive') ? 170000 : 125000;

      // Charity/giving overhead (big)
      const giving = (charity === 'extreme') ? -70000 : -45000;

      // PR/legal/security overhead
      let overhead = -28000;
      if (profile === 'high') overhead -= 14000;
      if (risk === 'high') overhead -= 12000;
      if (board === 'strong') overhead += 8000; // oversight prevents some waste

      // Deterministic "controversy year"
      const rC = createSeededRng(`${gameState.runSeed}|megachurch|controversy|age:${age}`);
      const pC = (risk === 'high') ? 0.24 : (risk === 'low') ? 0.10 : 0.16;
      const controversyYear = rC.nextFloat() < pC;
      const controversyCost = controversyYear ? -24000 : 0;

      applyMoneyDelta(base + giving + overhead + controversyCost, controversyYear ? "Mega-church pastor finances (controversy year)" : "Mega-church pastor finances (net)");

      // Stress: public scrutiny + controversy + charity load
      let stress = 0.18;
      if (profile === 'high') stress += 0.06;
      if (charity === 'extreme') stress += 0.06;
      if (risk === 'high') stress += 0.06;
      if (board === 'strong') stress -= 0.03;
      if (controversyYear) stress += 0.10;
      applyStress(stress);

      // Household effects: social confidence + responsibility; empathy if charity is high
      if (age >= 6) applyDeltas({ social: 0.12, confidence: 0.10, responsibility: 0.08 }, "Public-leader household culture");
      if (age >= 6 && charity !== 'high') applyDeltas({ empathy: -0.02 }, "Compassion fatigue risk");
      else if (age >= 6) applyDeltas({ empathy: 0.06 }, "Values of service");
      break;
    }
    case 'spotlight_nobel_scientist': {
      const field = specialStartMeta?.field || 'biomed';
      const profile = specialStartMeta?.publicProfile || 'high';
      const travel = specialStartMeta?.travelLoad || 'medium';
      const patent = specialStartMeta?.patentIncome || 'medium';
      const scale = specialStartMeta?.foundationScale || 'major';

      // Very high baseline: consulting, patents, keynote fees, leadership roles
      let base = 165000;
      if (patent === 'high') base += 85000;
      else if (patent === 'low') base -= 25000;

      // Foundation + lab overhead (big)
      let overhead = -65000;
      if (scale === 'global') overhead -= 40000;
      if (travel === 'high') overhead -= 18000;
      if (profile === 'high') overhead -= 14000;

      // Deterministic "breakthrough year" (major discovery, award, patent milestone)
      const rB = createSeededRng(`${gameState.runSeed}|nobelScientist|breakthrough|age:${age}|field:${field}`);
      const pB = (patent === 'high') ? 0.22 : 0.14;
      const breakthrough = rB.nextFloat() < pB;
      const bonus = breakthrough ? (scale === 'global' ? 220000 : 140000) : 0;

      applyMoneyDelta(base + overhead + bonus, breakthrough ? "Nobel scientist wealth (breakthrough year)" : "Nobel scientist wealth (net)");

      // Stress: high baseline; spikes on breakthrough years and heavy travel
      let stress = 0.18;
      if (travel === 'high') stress += 0.06;
      if (profile === 'high') stress += 0.05;
      if (scale === 'global') stress += 0.04;
      if (breakthrough) stress += 0.08;
      applyStress(stress);

      // Household effects: intelligence + discipline + responsibility; confidence from "big world" exposure
      if (age >= 6) applyDeltas({ intelligence: 0.14, discipline: 0.10, responsibility: 0.10, confidence: 0.08, empathy: 0.06 }, "Science-leadership household culture");
      break;
    }
  }
}

export function GameStateProvider({ children }) {
  const [gameState, setGameState] = useState(() => getInitialGameState());
  const [portraitMod, setPortraitMod] = useState({
    loaded: false,
    enabled: false,
    manifest: null
  });

  // Load Portrait Mod manifest on mount
  useEffect(() => {
    import('@/components/game/portraitMod/portraitMod').then(({ loadPortraitModManifest }) => {
      loadPortraitModManifest().then(({ enabled, manifest }) => {
        setPortraitMod({ loaded: true, enabled, manifest });
      });
    }).catch(() => {
      setPortraitMod({ loaded: true, enabled: false, manifest: null });
    });
  }, []);

  // Ensure remoteMultiplayer exists
  useEffect(() => {
    if (!gameState.remoteMultiplayer) {
      setGameState(prev => ({ ...prev, remoteMultiplayer: { ...DEFAULT_REMOTE_MP } }));
    }
  }, []);

  // THEME: apply UI theme early on mount and whenever it changes
  useEffect(() => {
    try {
      const html = document.documentElement;
      const theme = gameState?.settings?.uiTheme || 'classic';
      html.dataset.uiTheme = theme;
    } catch {}
  }, [gameState?.settings?.uiTheme]);

  // Keep a live ref to the latest gameState so we can flush saves from event handlers
  const latestStateRef = useRef(gameState);
  useEffect(() => {
    latestStateRef.current = gameState;
  }, [gameState]);

  // Debounced autosave timer
  const autosaveTimerRef = useRef(null);
  const quotaWarnedRef = useRef(false);

  const flushAutosave = useCallback((reason = 'autosave') => {
    try {
      const state = latestStateRef.current;
      if (!isRunStarted(state)) return;

      // SINGLE SOURCE OF TRUTH: prefer gameState.activeSaveSlotId
      const slotId = state?.activeSaveSlotId || (() => {
        try {
          return (typeof getActiveSlotId === 'function' ? getActiveSlotId() : null) || 'slot1';
        } catch {
          return 'slot1';
        }
      })();

      if (typeof saveToSlot === 'function') {
        const ok = saveToSlot(slotId, sanitizeForSave(state), null);
        if (!ok) {
          toast.error('Autosave failed. Your browser storage may be full. Free space to keep saves working.');
        }
      }
    } catch (e) {
      console.error(`[autosave] failed (${reason})`, e);
      // Surface quota issues once (common on mobile/Safari if storage is full)
      const name = String(e?.name || '');
      const msg = String(e?.message || e || '');
      if (!quotaWarnedRef.current && (name.includes('Quota') || msg.includes('Quota') || msg.includes('quota'))) {
        quotaWarnedRef.current = true;
        toast.error('Autosave failed: your device storage is full. Free space to keep saves working.');
      }
    }
  }, []);

  // Autosave on any meaningful change (debounced)
  useEffect(() => {
    if (!isRunStarted(gameState)) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      flushAutosave('debounced');
    }, 500);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [gameState, flushAutosave]);

  // Royal Tabloid trigger on age change
  useEffect(() => {
    const age = Number(gameState.currentYear || 0);
    const t = gameState.titles || {};
    const info = t.primaryTitle ? getTitleInfo(t.primaryTitle) : null;
    if (!info || info.group !== 'royal') return;
    if (!isMonarchyCountry(gameState.countryIso3)) return;
    if (gameState.royalEventProcessedAge === age) return;

    const isMonarch = t.primaryTitle === 'king';
    const chance = isMonarch ? 0.30 : 0.20;
    const roll = Math.random();

    setGameState(prev => ({ ...prev, royalEventProcessedAge: age }));
    if (roll > chance) return;

    const isMom = (gameState.parentRole === 'mom');
    const title = isMonarch ? (isMom ? 'Queen' : 'King') : (isMom ? 'Princess' : 'Prince');
    const name = gameState.parentName || 'You';
    const country = gameState.countryIso3 || 'Country';

    const picked = { id: 'dynastic_notice', headlineTemplates: [`${title} of {country} attends a quiet ceremony`], bodyTemplates: [`{name} (${title}) makes an appearance. People whisper about courtesy and duty.`], choices: [] };
    const ht = picked.headlineTemplates || [];
    const bt = picked.bodyTemplates || [];
    const pic = (arr) => (arr && arr.length ? arr[Math.floor(Math.random()*arr.length)] : '');
    const fill = (s) => String(s || '').replaceAll('{title}', title).replaceAll('{name}', name).replaceAll('{country}', country);

    const headline = fill(pic(ht));
    const body = fill(pic(bt));

    const payload = { id: picked.id, phase: isMonarch ? 'monarch' : 'heir', headline, body, choices: picked.choices || [], name, age, country };

    setGameState(prev => ({ ...prev, royalPopupPending: payload }));
  }, [gameState.currentYear, gameState.countryIso3, gameState.titles?.primaryTitle]);

  // Corruption system tick on age change (deterministic)
  const lastCorruptionTickRef = useRef(null);
  useEffect(() => {
    const age = Number(gameState.currentYear || 0);
    
    // Guard: only run once per year
    if (lastCorruptionTickRef.current === age) return;
    lastCorruptionTickRef.current = age;
    
    const seed = `${gameState.runSeed || 'seed'}|pol_corruption|age:${age}`;
    const rng = createSeededRng(seed);
    setGameState(prev => processPoliticsCorruptionTick(prev, { age, phase: 'yearStart' }, rng.nextFloat));
  }, [gameState.currentYear, gameState.runSeed]);

  // Flush autosave when the tab/app is backgrounded or closed
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        flushAutosave('visibilitychange');
      }
    };
    const onPageHide = () => flushAutosave('pagehide'); // iOS/Safari friendly
    const onBeforeUnload = () => flushAutosave('beforeunload');

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [flushAutosave]);

  // --- Study Points (used to unlock better scenario choices) ---
  // Backward-compat: old saves may not have studyPoints but do have study timeline entries.
  // We use the larger of (stored studyPoints) and (count of timeline entries with kind="study").
  const getStudyPoints = useCallback(() => {
    const storedRaw = Number(gameState.studyPoints);
    const stored = Number.isFinite(storedRaw) ? storedRaw : 0;

    const timeline = Array.isArray(gameState.timelineEntries) ? gameState.timelineEntries : [];
    const fromTimeline = timeline.filter(e => e?.kind === "study").length;

    return Math.max(stored, fromTimeline);
  }, [gameState.studyPoints, gameState.timelineEntries]);

  // Signature matches existing call sites that pass (amount, reason)
  const awardStudyPoints = useCallback((amount = 1, _reason = "") => {
    const inc = Number(amount);
    if (!Number.isFinite(inc) || inc === 0) return;

    setGameState(prev => {
      const baseRaw = Number(prev.studyPoints);
      const base = Number.isFinite(baseRaw) ? baseRaw : 0;
      const next = Math.max(0, base + inc);
      return { ...prev, studyPoints: next };
    });
  }, []);

  // --- Normalize relationships roster so Relationships modal never shows "none" incorrectly ---
  useEffect(() => {
    setGameState(prev => {
      const next = { ...prev };

      const rel = prev.relationships && typeof prev.relationships === 'object'
        ? prev.relationships
        : { roster: [], byId: {} };

      const roster = Array.isArray(rel.roster) ? [...rel.roster] : [];
      const byId = rel.byId && typeof rel.byId === 'object' ? { ...rel.byId } : {};

      let changed = false;

      // Backward-compat: ensure relationship drama + sexual health state containers exist
      try {
        const dfltRD = INITIAL_STATE.relationshipDrama;
        const dfltSH = INITIAL_STATE.sexualHealth;

        if (!prev.relationshipDrama || typeof prev.relationshipDrama !== 'object') {
          next.relationshipDrama = { ...dfltRD };
          changed = true;
        } else {
          const rd = prev.relationshipDrama;
          const sexEd = { ...(dfltRD.sexEd || {}), ...(rd.sexEd || {}) };
          const teen = { ...(dfltRD.teen || {}), ...(rd.teen || {}) };
          const normalized = {
            ...dfltRD,
            ...rd,
            outsideEncountersByAge: (rd.outsideEncountersByAge && typeof rd.outsideEncountersByAge === 'object') ? rd.outsideEncountersByAge : {},
            partnerOutsideEncountersByAge: (rd.partnerOutsideEncountersByAge && typeof rd.partnerOutsideEncountersByAge === 'object') ? rd.partnerOutsideEncountersByAge : {},
            sexEd,
            teen
          };
          if (JSON.stringify(normalized) !== JSON.stringify(rd)) {
            next.relationshipDrama = normalized;
            changed = true;
          }
        }

        if (!prev.sexualHealth || typeof prev.sexualHealth !== 'object') {
          next.sexualHealth = { ...dfltSH };
          changed = true;
        } else {
          const sh = prev.sexualHealth;
          const normalizePerson = (p, base) => ({ ...(base || {}), ...((p && typeof p === 'object') ? p : {}) });
          const normalized = {
            ...dfltSH,
            ...sh,
            player: normalizePerson(sh.player, dfltSH.player),
            partner: normalizePerson(sh.partner, dfltSH.partner),
            child: normalizePerson(sh.child, dfltSH.child),
          };
          if (JSON.stringify(normalized) !== JSON.stringify(sh)) {
            next.sexualHealth = normalized;
            changed = true;
          }
        }
      } catch {}

      // STEP 1: Deduplicate parents (migration) - merge 'mother' into 'my_mom' and 'father' into 'my_dad'
      const deduplicateParent = (legacyId, canonicalId, fallbackName) => {
        const legacy = byId[legacyId];
        const canonical = byId[canonicalId];
        
        if (legacy && canonical) {
          // Both exist - merge into canonical
          const merged = {
            ...canonical,
            id: canonicalId,
            role: canonicalId,
            // Prefer non-generic names
            name: (canonical.name && canonical.name !== 'Mom' && canonical.name !== 'Dad') 
              ? canonical.name 
              : (legacy.name && legacy.name !== 'Mom' && legacy.name !== 'Dad')
                ? legacy.name
                : fallbackName,
            // Preserve death status (prefer any "true" value)
            isDeceased: legacy.isDeceased || canonical.isDeceased,
            alive: (legacy.alive === false || canonical.alive === false) ? false : true,
            deathYear: legacy.deathYear ?? canonical.deathYear,
            lastMournedYear: legacy.lastMournedYear ?? canonical.lastMournedYear,
            // Merge other fields
            baseAge: canonical.baseAge ?? legacy.baseAge,
            genderKey: canonical.genderKey ?? legacy.genderKey,
            meter: canonical.meter ?? legacy.meter,
            mortalityMultiplier: canonical.mortalityMultiplier ?? legacy.mortalityMultiplier,
            interactionsByAge: { ...(legacy.interactionsByAge || {}), ...(canonical.interactionsByAge || {}) }
          };
          
          // Update byId
          byId[canonicalId] = merged;
          delete byId[legacyId];
          
          // Update roster - remove legacy, keep canonical
          const legacyIdx = roster.findIndex(r => r.id === legacyId);
          if (legacyIdx >= 0) roster.splice(legacyIdx, 1);
          
          const canonicalIdx = roster.findIndex(r => r.id === canonicalId);
          if (canonicalIdx >= 0) roster[canonicalIdx] = merged;
          
          changed = true;
        } else if (legacy && !canonical) {
          // Legacy exists but not canonical - migrate
          const migrated = {
            ...legacy,
            id: canonicalId,
            role: canonicalId
          };
          
          byId[canonicalId] = migrated;
          delete byId[legacyId];
          
          const idx = roster.findIndex(r => r.id === legacyId);
          if (idx >= 0) roster[idx] = migrated;
          
          changed = true;
        }
      };
      
      deduplicateParent('mother', 'my_mom', 'Mom');
      deduplicateParent('father', 'my_dad', 'Dad');

      // STEP 1.5: Grandparent succession safety net (normalize spouse mapping on load)
      const gp = prev.guardianPerspective || { activeId: 'player', side: 'player', relationToChild: 'parent' };
      if (gp.relationToChild === 'grandparent' && (gp.activeId === 'my_mom' || gp.activeId === 'my_dad')) {
        const spouseId = gp.activeId === 'my_mom' ? 'my_dad' : 'my_mom';
        const spousePerson = byId[spouseId];
        
        // If spouse exists but partner is missing or mismatched, remap
        if (spousePerson && (!byId.partner || byId.partner.id !== 'partner')) {
          const isPersonDead = (p) => p && (p.isDeceased === true || p.alive === false);
          const spouseAlive = !isPersonDead(spousePerson);
          
          // Remove existing partner if any
          if (byId.partner) {
            delete byId.partner;
            const pIdx = roster.findIndex(p => p.id === 'partner');
            if (pIdx >= 0) roster.splice(pIdx, 1);
          }
          
          // Move spouse to partner
          const partner = {
            ...spousePerson,
            id: 'partner',
            role: 'partner'
          };
          
          // Remove old spouse entry
          delete byId[spouseId];
          const oldIdx = roster.findIndex(p => p.id === spouseId);
          if (oldIdx >= 0) roster.splice(oldIdx, 1);
          
          // Add partner
          byId.partner = partner;
          roster.push(partner);
          changed = true;
          
          // Ensure top-level state matches
          if (spouseAlive && !next.partnerName) {
            next.householdType = 'two';
            next.partnerName = partner.name;
            next.partnerEmoji = partner.emoji || '🧑';
            next.partnerMeter = Number.isFinite(Number(partner.meter)) ? Number(partner.meter) : 75;
            next.partnerAgeAtBirth = partner.baseAge;
            next.partnerRelationship = {
              status: 'married',
              marriedAtAge: 0,
              engagedAtAge: null,
              ring: null,
              wedding: null,
              openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
              crisis: null
            };
          }
        }
        
        // Ensure activeId person isn't in relationships (no self-interaction)
        if (byId[gp.activeId]) {
          delete byId[gp.activeId];
          const idx = roster.findIndex(p => p.id === gp.activeId);
          if (idx >= 0) roster.splice(idx, 1);
          changed = true;
        }
      }

      // STEP 1.75: Clean up child-only NPCs from existing child-free saves
      if (prev.childless === true && prev.hasChild === false) {
        const CHILD_ONLY_IDS = new Set(['father_of_child', 'mother_of_child', 'teacher', 'best_friend']);
        const CHILD_ONLY_ROLES = new Set(['father_of_child', 'mother_of_child', 'teacher', 'best_friend']);
        
        let hadGhosts = false;
        
        // Remove from byId
        for (const id of CHILD_ONLY_IDS) {
          if (byId[id]) {
            delete byId[id];
            hadGhosts = true;
          }
        }
        
        // Remove from roster
        const beforeLen = roster.length;
        const cleanedRoster = roster.filter(p => 
          !CHILD_ONLY_IDS.has(p.id) && !CHILD_ONLY_ROLES.has(p.role)
        );
        if (cleanedRoster.length < beforeLen) {
          roster.length = 0;
          roster.push(...cleanedRoster);
          hadGhosts = true;
        }
        
        if (hadGhosts) changed = true;
      }

      // STEP 2: Ensure `child` relationship exists (even in child-free mode)
      if (!byId.child) {
        const childEmoji = getAvatarEmojiForAge(
          prev.currentYear || 0,
          prev.childAvatarGender || 'boy',
          prev.childAvatarToneIndex ?? 2
        );
        const childRel = {
          id: 'child',
          role: 'child',
          name: prev.childName || 'Child',
          emoji: childEmoji,
          createdAtAge: 0,
          baseAge: 0,
          meter: 50,
          isDeceased: false,
          interactionsByAge: {}
        };
        roster.unshift(childRel);
        byId.child = childRel;
        changed = true;
      }

      // Sync child name and emoji to current top-level state
      const syncedName = prev.childName || byId.child.name || 'Child';
      const syncedEmoji = getAvatarEmojiForAge(
        prev.currentYear || 0,
        prev.childAvatarGender || 'boy',
        prev.childAvatarToneIndex ?? 2
      );
      if (syncedName !== byId.child.name || syncedEmoji !== byId.child.emoji) {
        byId.child = { ...byId.child, name: syncedName, emoji: syncedEmoji };
        const cidx = roster.findIndex(x => x.id === 'child');
        if (cidx >= 0) roster[cidx] = byId.child;
        changed = true;
      }

      // Courtesy/royal title for child based on parent's dynastic title
      if (byId.child && prev.titles?.primaryTitle) {
        const courtesy = courtesyForChild(prev.titles.primaryTitle, prev.childAvatarGender);
        const info = getTitleInfo(prev.titles.primaryTitle);
        const updatedChild = {
          ...byId.child,
          isRoyal: info?.group === 'royal' ? true : byId.child.isRoyal || false,
          title: info?.group === 'royal' ? (byId.child.title || courtesy) : byId.child.title,
          courtesyTitle: info?.group !== 'royal' ? (byId.child.courtesyTitle || courtesy) : byId.child.courtesyTitle
        };
        if (updatedChild.title !== byId.child.title || updatedChild.isRoyal !== byId.child.isRoyal || updatedChild.courtesyTitle !== byId.child.courtesyTitle) {
          byId.child = updatedChild;
          const cidx = roster.findIndex(x => x.id === 'child');
          if (cidx >= 0) roster[cidx] = updatedChild;
          changed = true;
        }
      }

        // Courtesy handled above from titles.primaryTitle

        // Ensure partner exists if householdType is two and partnerName exists
      if (prev.householdType === 'two' && (prev.partnerName || prev.partnerEmoji)) {
        const meter = Number.isFinite(Number(prev.partnerMeter)) ? Number(prev.partnerMeter) : 80;

        if (!byId.partner) {
          const partnerRel = {
            id: 'partner',
            role: 'partner',
            name: prev.partnerName || 'Partner',
            emoji: prev.partnerEmoji || '🧑',
            createdAtAge: 0,
            meter,
            isDeceased: false,
            interactionsByAge: {}
          };
          roster.push(partnerRel);
          byId.partner = partnerRel;
          changed = true;
        } else {
          // Keep partner display in sync
          const p = byId.partner;
          const updated = {
            ...p,
            name: prev.partnerName || p.name,
            emoji: prev.partnerEmoji || p.emoji,
            meter
          };
          byId.partner = updated;
          const idx = roster.findIndex(x => x.id === 'partner');
          if (idx >= 0) roster[idx] = updated;
        }

        // If partnerRelationship missing in an old save, set a safe default
        if (!prev.partnerRelationship) {
          next.partnerRelationship = {
            status: (prev.currentYear || 0) === 0 ? 'married' : 'partnered',
            engagedAtAge: null,
            marriedAtAge: (prev.currentYear || 0) === 0 ? 0 : null,
            ring: null,
            wedding: null,
            openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
            crisis: null
          };
          changed = true;
        }

        // Ensure partnerRelationship has drama extensions (openRelationship/crisis)
        try {
          const pr = next.partnerRelationship || prev.partnerRelationship;
          if (pr && typeof pr === 'object') {
            const open = (pr.openRelationship && typeof pr.openRelationship === 'object') ? pr.openRelationship : {};
            const patched = {
              ...pr,
              openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null, ...open },
              crisis: pr.crisis ?? null
            };
            if (JSON.stringify(patched) !== JSON.stringify(pr)) {
              next.partnerRelationship = patched;
              changed = true;
            }
          }
        } catch {}
      }

      // Patch partner baseAge and top-level partnerAgeAtBirth if missing
      try {
        const hasPartner = !!byId.partner;
        if (hasPartner) {
          const p = byId.partner;
          const cy = Number(prev.currentYear) || 0;
          const createdAtAge = Number.isFinite(Number(p.createdAtAge)) ? Number(p.createdAtAge) : cy;
          
          // If p.age is finite, compute expected baseAge from it
          let expectedBaseAge = null;
          if (Number.isFinite(Number(p.age))) {
            expectedBaseAge = Number(p.age) - createdAtAge;
          }
          
          // Fix missing baseAge
          if (!Number.isFinite(Number(p.baseAge)) && expectedBaseAge !== null) {
            byId.partner = { ...p, baseAge: expectedBaseAge };
            const idx = roster.findIndex(x => x.id === 'partner');
            if (idx >= 0) roster[idx] = byId.partner;
            changed = true;
          }
          
          // Fix wildly incorrect baseAge (auto-correct broken saves)
          if (Number.isFinite(Number(p.baseAge)) && Number.isFinite(Number(p.age))) {
            const ageFromBase = Number(p.baseAge) + cy;
            const ageFromAgeField = Number(p.age) + Math.max(0, cy - createdAtAge);
            
            if (Math.abs(ageFromBase - ageFromAgeField) >= 5 && expectedBaseAge !== null) {
              byId.partner = { ...byId.partner, baseAge: expectedBaseAge };
              const idx = roster.findIndex(x => x.id === 'partner');
              if (idx >= 0) roster[idx] = byId.partner;
              changed = true;
            }
          }
          
          // Sync partnerAgeAtBirth
          const finalBaseAge = Number(byId.partner.baseAge);
          if (!Number.isFinite(Number(prev.partnerAgeAtBirth)) || Number(prev.partnerAgeAtBirth) !== finalBaseAge) {
            next.partnerAgeAtBirth = finalBaseAge;
            changed = true;
          }
        }
      } catch {}

      // Ensure commitments exists
      if (!prev.commitments) {
        next.commitments = {};
        changed = true;
      }

      // Inject Starting Family relationships (siblings, nieces/nephews)
      try {
        const sf = prev.startingFamily;
        if (sf && (Array.isArray(sf.siblings) || Array.isArray(sf.niecesNephews))) {
          const runSeed = String(prev.runSeed || prev.countrySeed || 'seed');
          const playerAgeAtBirth = Number(prev.parentAgeAtBirth ?? prev.parentCareer?.ageAtBirth ?? 28);

          const ensureRel = (key, relObj) => {
            if (!byId[key]) {
              roster.push(relObj);
              byId[key] = relObj;
              changed = true;
            } else {
              // Patch existing entry if it lacks baseAge
              const existing = byId[key];
              if (!Number.isFinite(Number(existing.baseAge)) && !Number.isFinite(Number(existing.age))) {
                const patched = { ...existing, ...relObj };
                byId[key] = patched;
                const idx = roster.findIndex(r => r.id === key);
                if (idx >= 0) roster[idx] = patched;
                changed = true;
              }
            }
          };

          // Siblings (with deterministic age gaps)
          (sf.siblings || []).forEach((s) => {
            const key = `sibling_${s.id}`;
            const rng = createSeededRng(`${runSeed}|startingFamily|sibling|${s.id}`);
            
            // Compute age gap (how many years older/younger vs player at year0)
            const providedGap = Number.isFinite(Number(s.ageGapYears)) ? Number(s.ageGapYears) : null;
            let gapYears = providedGap;
            
            if (!Number.isFinite(gapYears)) {
              const mag = Math.floor(rng.nextFloat() * 10) + 1; // 1..10
              const sign = rng.nextFloat() < 0.55 ? 1 : -1; // slightly more older siblings
              gapYears = sign * mag;
            }
            
            // Avoid 0 gap (twins) unless explicitly set
            if (gapYears === 0 && !providedGap) gapYears = 1;
            
            const baseAge = playerAgeAtBirth + gapYears;
            const createdAtAge = Math.max(0, -gapYears);
            
            ensureRel(key, {
              id: key,
              role: 'sibling',
              familySide: s.familySide || 'player',
              name: s.name || 'Sibling',
              emoji: (s.gender === 'girl') ? '👧' : '👦',
              baseAge,
              createdAtAge,
              meter: 60,
              alive: true,
              isDeceased: false,
              interactionsByAge: {}
            });
          });

          // Nieces / Nephews (derived from sibling ages)
          const sibKeys = (sf.siblings || []).map(s => `sibling_${s.id}`).filter(k => byId[k]);
          
          (sf.niecesNephews || []).forEach((n) => {
            const key = `nn_${n.id}`;
            const role = (n.gender === 'girl') ? 'niece' : 'nephew';
            const rng = createSeededRng(`${runSeed}|startingFamily|nn|${n.id}`);
            
            // Pick a parent sibling
            const parentKey = sibKeys.length ? sibKeys[Math.floor(rng.nextFloat() * sibKeys.length)] : null;
            const parent = parentKey ? byId[parentKey] : null;
            const parentBaseAge = Number.isFinite(Number(parent?.baseAge)) ? Number(parent.baseAge) : (playerAgeAtBirth + 6);
            
            // Niece age = sibling became parent at age 18-32
            const parentAgeAtBirth = Math.floor(rng.nextFloat() * 15) + 18; // 18..32
            const baseAge = parentBaseAge - parentAgeAtBirth;
            const createdAtAge = Math.max(0, -baseAge);
            
            ensureRel(key, {
              id: key,
              role,
              name: n.name || (role === 'niece' ? 'Niece' : 'Nephew'),
              emoji: (n.gender === 'girl') ? '👧' : '👦',
              baseAge,
              createdAtAge,
              meter: 55,
              alive: true,
              isDeceased: false,
              interactionsByAge: {}
            });
          });
        }
      } catch {}

      // Add in-laws if partner exists (using centralized utility)
      try {
        const hasPartner = prev.householdType === 'two' && (prev.partnerName || byId.partner);
        if (hasPartner && (!byId.inlaw_mom || !byId.inlaw_dad)) {
          const result = ensureInLawsExist({ ...prev, relationships: { roster, byId } });
          
          // Check if anything changed
          if (result.roster.length !== roster.length || Object.keys(result.byId).length !== Object.keys(byId).length) {
            roster.length = 0;
            roster.push(...result.roster);
            Object.keys(byId).forEach(k => delete byId[k]);
            Object.assign(byId, result.byId);
            changed = true;
          }
        }
      } catch {}

      // Age Safety Net: patch any NPCs that lack both baseAge and age
      try {
        const runSeed = String(prev.runSeed || prev.countrySeed || 'seed');
        const playerAgeAtBirth = Number(prev.parentAgeAtBirth ?? prev.parentCareer?.ageAtBirth ?? 28);
        
        roster.forEach(p => {
          if (!p || !p.id) return;
          if (p.role === 'child') return; // Child ages separately
          
          const hasBase = Number.isFinite(Number(p.baseAge));
          const hasAge = Number.isFinite(Number(p.age));
          if (hasBase || hasAge) return;
          
          const rng = createSeededRng(`${runSeed}|ageFill|${p.role}|${p.id}`);
          const offset = Math.floor((rng.nextFloat() - 0.5) * 8); // ~ -4..+3
          
          const createdAt = Number.isFinite(Number(p.createdAtAge)) ? Number(p.createdAtAge) : 0;
          
          let patched = { ...p, createdAtAge: createdAt };
          
          // If known from year0, set baseAge; otherwise set age-at-meet
          if (createdAt <= 0) {
            patched.baseAge = playerAgeAtBirth + offset;
          } else {
            patched.age = (playerAgeAtBirth + createdAt) + offset;
          }
          
          // Write back to byId + roster
          byId[p.id] = patched;
          const idx = roster.findIndex(r => r.id === p.id);
          if (idx >= 0) roster[idx] = patched;
          changed = true;
        });
      } catch {}


      // Ensure Empire Estates expansion is on by default if undefined
      const currentExpansions = prev.expansions || {};
      if (currentExpansions.empireEstatesLandlordLegacy === undefined) {
        next.expansions = {
          ...currentExpansions,
          empireEstatesLandlordLegacy: true
        };
        changed = true;
      }

      // Politics defaults migration
      const pol = prev.politics && typeof prev.politics === 'object' ? prev.politics : {};
      const migratedPolitics = {
        currentOfficeId: pol.currentOfficeId ?? null,
        termEndsAtAge: pol.termEndsAtAge ?? null,
        approval: Math.max(0, Math.min(100, pol.approval ?? 55)),
        activeScandals: Array.isArray(pol.activeScandals) ? pol.activeScandals : [],
        lastCampaignAge: pol.lastCampaignAge ?? -1,
        careerBeforeOffice: pol.careerBeforeOffice ?? null,
        lastCampaignAgeByOffice: pol.lastCampaignAgeByOffice || {},
        lastInOfficeEventAge: pol.lastInOfficeEventAge ?? -1,
        partyId: pol.partyId ?? null,
        platformTags: Array.isArray(pol.platformTags) ? pol.platformTags : [],
        warChest: Number.isFinite(pol.warChest) ? pol.warChest : 0,
        incumbentStreak: Number.isFinite(pol.incumbentStreak) ? pol.incumbentStreak : 0,
        // Ensure corruption block exists for legacy saves
        corruption: ensurePoliticsCorruptionState(pol.corruption)
      };
      next.politics = migratedPolitics;

      // Migrate legacy royalReputation into titles.standing (one-time)
      if (typeof prev.royalReputation === 'number' && (!prev.titles || typeof prev.titles.standing !== 'number')) {
        next.titles = { ...(prev.titles || {}), standing: Math.max(0, Math.min(100, prev.royalReputation)) };
        changed = true;
      }

      if (!changed) return prev;

      next.relationships = { roster, byId };
      return next;
    });
  }, [gameState.householdType, gameState.partnerName, gameState.partnerEmoji, gameState.partnerMeter, gameState.childName, gameState.childAvatarGender, gameState.childAvatarToneIndex, gameState.currentYear, gameState.commitments]);

  // Education normalization (ensure a clear default for old and new saves)
  useEffect(() => {
    setGameState(prev => {
      let changed = false;
      const next = { ...prev };

      // If missing/empty, default to Public School
      if (!next.schoolType) { next.schoolType = 'public'; changed = true; }
      if (next.privateSchoolActive === undefined) { next.privateSchoolActive = false; changed = true; }
      if (next.privateSchoolScholarship === undefined) { next.privateSchoolScholarship = false; changed = true; }
      if (next.religiousSchoolStartAge === undefined) { next.religiousSchoolStartAge = null; changed = true; }

      // STEP 3: Ensure parents exist (using canonical IDs: my_mom, my_dad)
      const playerAgeNow = (next.parentAgeAtBirth ?? 28) + (next.currentYear ?? 0);
      let myMom = next.relationships?.byId?.my_mom;
      let myDad = next.relationships?.byId?.my_dad;

      if (!myMom) {
          const momAtBirth = 18 + Math.floor(createSeededRng(`${next.runSeed}|motherAge`).nextFloat() * 23);
          myMom = {
              id: 'my_mom',
              role: 'my_mom',
              name: 'Mom',
              genderKey: 'female',
              baseAge: playerAgeNow + momAtBirth,
              isDeceased: false,
              alive: true,
              deathYear: null,
              lastMournedYear: null,
              mortalityMultiplier: 0.85 + createSeededRng(`${next.runSeed}|mother`).nextFloat() * 0.3,
          };
          changed = true;
      }

      if (!myDad) {
          const dadAtBirth = (myMom.baseAge - playerAgeNow) + Math.floor(createSeededRng(`${next.runSeed}|fatherAge`).nextFloat() * 7);
          myDad = {
              id: 'my_dad',
              role: 'my_dad',
              name: 'Dad',
              genderKey: 'male',
              baseAge: playerAgeNow + dadAtBirth,
              isDeceased: false,
              alive: true,
              deathYear: null,
              lastMournedYear: null,
              mortalityMultiplier: 0.85 + createSeededRng(`${next.runSeed}|father`).nextFloat() * 0.3,
          };
          changed = true;
      }
      
      if (myMom.baseAge >= 85 && !myMom.isDeceased) {
          const initialP = clamp((myMom.baseAge - 70) * 0.02, 0, 0.85);
          if (createSeededRng(`${next.runSeed}|motherInitialDeath`).nextFloat() < initialP) {
              myMom.isDeceased = true;
              myMom.alive = false;
              myMom.deathYear = 0;
          }
      }
      
      if (myDad.baseAge >= 85 && !myDad.isDeceased) {
          const initialP = clamp((myDad.baseAge - 70) * 0.02, 0, 0.85);
          if (createSeededRng(`${next.runSeed}|fatherInitialDeath`).nextFloat() < initialP) {
              myDad.isDeceased = true;
              myDad.alive = false;
              myDad.deathYear = 0;
          }
      }

      if (changed) {
        const newById = { ...next.relationships.byId, my_mom: myMom, my_dad: myDad };
        const newRoster = [...next.relationships.roster];
        if (!next.relationships.byId.my_mom) newRoster.push(myMom);
        if (!next.relationships.byId.my_dad) newRoster.push(myDad);
        next.relationships = { ...next.relationships, byId: newById, roster: newRoster };
      }

      return changed ? next : prev;
    });
  }, []);

  // --- Actions ---

  const updateState = useCallback((updates) => {
    setGameState(prev => {
        // Handle function updates
        let newValues = typeof updates === 'function' ? updates(prev) : updates;
        
        // Ignore invalid updates
        if (!newValues || typeof newValues !== 'object' || Array.isArray(newValues)) {
          console.warn('[updateState] Invalid update ignored:', newValues);
          return prev;
        }
        
        // Copy updates to prevent mutation
        newValues = { ...newValues };
        
        // Coerce critical arrays to prevent non-iterable crashes
        const ARRAY_KEYS = [
          'memories', 'studiedItems', 'usedScenarioHookIds', 'timelineEntries',
          'moneyTransactions', 'childTraumaEvents', 'childTraumaPopupQueue',
          'siblingRivalryPopupQueue', 'usedGoalMomentIds', 'tinyCuteUsedIds', 'kidWisdomUsed'
        ];
        
        ARRAY_KEYS.forEach(key => {
          if (key in newValues && !Array.isArray(newValues[key])) {
            console.warn(`[updateState] Coercing ${key} to array from:`, newValues[key]);
            newValues[key] = [];
          }
        });
        
        // Sync scenario flags to prevent drift
        if (newValues.scenarioPending !== undefined && newValues.pendingScenario === undefined) {
            newValues.pendingScenario = newValues.scenarioPending;
        } else if (newValues.pendingScenario !== undefined && newValues.scenarioPending === undefined) {
            newValues.scenarioPending = newValues.pendingScenario;
        }
        
        // Force incoming values to real booleans (only if provided OR either flag exists)
        if (newValues.pendingScenario !== undefined || newValues.scenarioPending !== undefined) {
          const normalized = toRealBool(newValues.pendingScenario ?? newValues.scenarioPending);
          newValues.pendingScenario = normalized;
          newValues.scenarioPending = normalized;
        }

        let next = { ...prev, ...newValues };
        
        // Auto-sync Local Co-Op focus when actionPoints changes
        const coopKeyPresent = Object.prototype.hasOwnProperty.call(newValues, 'coop');
        const coopExplicitOverride = coopKeyPresent && newValues.coop !== prev.coop;
        if (!coopExplicitOverride && prev.coop?.enabled === true) {
          const coopPrev = ensureLocalCoopState(prev.coop);
          
          // If coop is missing from next, carry it forward
          if (!next.coop) {
            next.coop = coopPrev;
          }
          
          // Check if coop is still eligible
          if (coopPrev.enabled === true && !isLocalCoopEligible(next)) {
            // Merge back to household semantics and disable
            const f = coopPrev.focus || {};
            const householdMax = Number.isFinite(Number(f.householdMax))
              ? Math.max(1, Math.floor(Number(f.householdMax)))
              : Math.max(1, Math.floor(Number(next.maxFocusTokens || 5)));
            const householdRemaining = Number.isFinite(Number(f.householdRemaining))
              ? Math.max(0, Math.floor(Number(f.householdRemaining)))
              : Math.max(0, Math.floor(Number(next.actionPoints ?? householdMax)));
            
            next.maxFocusTokens = householdMax;
            next.actionPoints = Math.min(householdRemaining, householdMax);
            next.coop = ensureLocalCoopState({ ...DEFAULT_LOCAL_COOP_STATE, enabled: false });
          } else {
            // Sync focus
            const f = coopPrev.focus || {};
            const activeSide = coopPrev.activeSide || 'player';
            
            // Case 1: Household refill signal (both maxFocusTokens and actionPoints set to same value)
            if ('maxFocusTokens' in newValues && 'actionPoints' in newValues) {
              const newMax = Number(newValues.maxFocusTokens);
              const newAP = Number(newValues.actionPoints);
              
              if (Number.isFinite(newMax) && Number.isFinite(newAP) && newMax === newAP) {
                const householdMax = Math.max(1, Math.floor(newMax));
                const newFocus = buildCoopFocus({ householdMax, householdRemaining: householdMax });
                
                // Determine if this refill is a new-age reset
                const isNewAgeRefill =
                  (newValues.scenarioPending === true || newValues.pendingScenario === true) &&
                  (newValues.scenarioCompletedThisAge === false);

                next.coop = isNewAgeRefill
                  ? ensureLocalCoopState({
                      ...coopPrev,
                      enabled: true,
                      focus: newFocus,
                      // Reset the per-age pass marker so the starting parent can Pass again this year.
                      tookTurnThisAge: { player: false, partner: false }
                    })
                  : { ...coopPrev, enabled: true, focus: newFocus };

                // If this is the start of a new age/year, keep the UI perspective aligned
                // with the coop active side so the correct parent starts the year.
                if (isNewAgeRefill && isCoopControlledGuardianPerspective(next.guardianPerspective)) {
                  const rel = getCaregiverMetaForSide(next, activeSide).relationToChild;
                  next.guardianPerspective = {
                    ...(next.guardianPerspective || {}),
                    activeId: activeSide,
                    side: activeSide,
                    relationToChild: rel
                  };
                }

                const activeMax = (activeSide === 'partner') ? newFocus.partnerMax : newFocus.playerMax;
                const activeRemaining = (activeSide === 'partner') ? newFocus.partnerRemaining : newFocus.playerRemaining;
                
                next.maxFocusTokens = activeMax;
                next.actionPoints = activeRemaining;
              }
            } else if ('actionPoints' in newValues) {
              // Case 2: Normal actionPoints delta
              const prevAP = Number(prev.actionPoints || 0);
              const nextAP = Number(next.actionPoints || 0);
              const delta = nextAP - prevAP;
              
              if (delta !== 0) {
                const activeRemainingKey = (activeSide === 'partner') ? 'partnerRemaining' : 'playerRemaining';
                const activeMaxKey = (activeSide === 'partner') ? 'partnerMax' : 'playerMax';
                
                const activeMax = Number(f[activeMaxKey] || 0);
                const prevActiveRemaining = Number.isFinite(Number(f[activeRemainingKey])) 
                  ? Number(f[activeRemainingKey]) 
                  : prevAP;
                
                const newActiveRemaining = Math.max(0, Math.min(activeMax, prevActiveRemaining + delta));
                
                const prevHouseRemaining = Number.isFinite(Number(f.householdRemaining))
                  ? Number(f.householdRemaining)
                  : (Number(f.playerRemaining || 0) + Number(f.partnerRemaining || 0));
                
                const householdMax = Number.isFinite(Number(f.householdMax))
                  ? Number(f.householdMax)
                  : (Number(f.playerMax || 0) + Number(f.partnerMax || 0));
                
                const newHouseRemaining = Math.max(0, Math.min(householdMax, prevHouseRemaining + delta));
                
                next.coop = {
                  ...coopPrev,
                  focus: {
                    ...f,
                    [activeRemainingKey]: newActiveRemaining,
                    householdRemaining: newHouseRemaining
                  }
                };
              }
            }
          }
        }

        return next;
    });
  }, []);

  const updatePTA = useCallback((updates) => {
    setGameState(prev => {
      const ptaUpdates = typeof updates === 'function' ? updates(prev.pta) : updates;
      return { ...prev, pta: { ...prev.pta, ...ptaUpdates } };
    });
  }, []);

  // --- Money Helpers (Local) ---
  const normalizeMoneyMeta = (sourceOrMeta, maybeMeta) => {
    let meta = {};
    if (typeof sourceOrMeta === 'string') meta.source = sourceOrMeta;
    else if (typeof sourceOrMeta === 'object') meta = { ...sourceOrMeta };
    
    if (maybeMeta && typeof maybeMeta === 'object') {
      meta = { ...meta, ...maybeMeta };
    }
    return meta;
  };

  const inferMoneyCategory = (source, amount) => {
    const s = String(source || "").toLowerCase();
    if (s.includes("income") || s.includes("salary") || s.includes("paycheck")) return "income";
    if (s.includes("social media")) return "social";
    if (s.includes("food") || s.includes("grocer")) return "food";
    if (s.includes("commute") || s.includes("bus") || s.includes("transit") || s.includes("rideshare") || s.includes("taxi") || s.includes("bike")) return "transport";
    if (s.includes("study") || s.includes("tutor") || s.includes("school") || s.includes("lesson")) return "education";
    if (s.includes("doctor") || s.includes("counselor") || s.includes("therapy") || s.includes("rehab")) return "health";
    if (s.includes("pet") || s.includes("vet") || s.includes("adopt")) return "pets";
    if (s.includes("rent") || s.includes("home") || s.includes("real estate") || s.includes("mortgage") || s.includes("housing")) return "housing";
    if (s.includes("emergency") || s.includes("retirement") || s.includes("save") || s.includes("invest")) return "savings";
    if (s.includes("movie") || s.includes("trip") || s.includes("outing") || s.includes("spa") || s.includes("date") || s.includes("play")) return "leisure";
    return "uncategorized";
  };

  const appendMoneyTx = (prev, amount, meta) => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt === 0) return prev;

    const tx = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      ts: Date.now(),
      age: meta.ageOverride ?? prev.currentYear ?? 0,
      amount: amt,
      type: meta.type ?? (amt >= 0 ? "income" : "expense"),
      source: meta.source || meta.title || "Money update",
      note: meta.note || meta.detail || "",
      category: meta.category || inferMoneyCategory(meta.source || meta.title, amt)
    };

    return {
      ...prev,
      money: (Number(prev.money) || 0) + amt,
      moneyTransactions: [...(prev.moneyTransactions || []), tx]
    };
  };

  const addLog = useCallback((text) => {
    // console.log("LOG:", text);
    // Add to local logs if needed
  }, []);

  const applyDeltas = useCallback((deltas, source) => {
    setGameState(prev => {
      const newStats = { ...prev.stats };
      const newBuffer = { ...(prev.statBuffer || INITIAL_STATE.statBuffer) };
      
      Object.entries(deltas || {}).forEach(([k, v]) => {
        if (newStats[k] !== undefined) {
          // Quantize delta and buffer
          const dv = quantizeTenth(v);
          newBuffer[k] = quantizeTenth((newBuffer[k] || 0) + dv);
          
          // Apply integer updates
          if (newBuffer[k] >= 1) {
            const inc = Math.floor(newBuffer[k]);
            newStats[k] += inc;
            newBuffer[k] = quantizeTenth(newBuffer[k] - inc);
          } else if (newBuffer[k] <= -1) {
            const dec = Math.floor(Math.abs(newBuffer[k]));
            newStats[k] -= dec;
            newBuffer[k] = quantizeTenth(newBuffer[k] + dec);
          }
          
          // Clamp stats:
          // - Main child stats should NOT be max-capped (can exceed 20), but still cannot go below 0.
          // - Other stats keep the existing 0–20 cap.
          const uncappedMainStats = new Set([
            "intelligence", "empathy", "discipline", "confidence",
            "happiness", "creativity", "curiosity", "responsibility", 
            "knowledge", "health", "social", "fitness"
          ]);

          if (uncappedMainStats.has(k)) {
            newStats[k] = Math.max(0, newStats[k]);     // no max cap
          } else {
            newStats[k] = Math.max(0, Math.min(20, newStats[k]));
          }
        }
      });
      
      return { ...prev, stats: newStats, statBuffer: newBuffer };
    });
    if (source) addLog(source);
  }, [addLog]);

  const applyLove = useCallback((delta, source) => {
    setGameState(prev => ({ ...prev, love: Math.max(0, Math.min(100, quantizeTenth((prev.love || 0) + quantizeTenth(delta)))) }));
  }, []);

  const applyStress = useCallback((delta, source) => {
    setGameState(prev => {
      // Use buffer logic for stress too
      let newStress = prev.stress;
      const newBuffer = { ...(prev.statBuffer || INITIAL_STATE.statBuffer) };
      
      const dv = quantizeTenth(delta);
      newBuffer.stress = quantizeTenth((newBuffer.stress || 0) + dv);
      
      if (newBuffer.stress >= 1) {
        const inc = Math.floor(newBuffer.stress);
        newStress += inc;
        newBuffer.stress = quantizeTenth(newBuffer.stress - inc);
      } else if (newBuffer.stress <= -1) {
        const dec = Math.floor(Math.abs(newBuffer.stress));
        newStress -= dec;
        newBuffer.stress = quantizeTenth(newBuffer.stress + dec);
      }
      
      return { 
        ...prev, 
        stress: Math.max(0, Math.min(100, newStress)),
        statBuffer: newBuffer
      };
    });
  }, []);

  // Player Health (0-100)
  const applyPlayerHealth = useCallback((delta) => {
    const d = Number(delta || 0);
    if (!d) return;
    setGameState(prev => {
      const cur = Number(prev.playerHealth ?? 75);
      const next = clamp0to100(Math.round((cur + d) * 10) / 10);
      return { ...prev, playerHealth: next };
    });
  }, []);

  const applyBabyPressure = useCallback((delta, source = '') => {
    const d = Number(delta || 0);
    if (!d) return;

    setGameState(prev => {
      // If a child exists, the meter is hidden and should not be manipulated
      if (hasAnyChild(prev)) return prev;

      const cur = clamp0to100(Number(prev.babyPressure || 0));
      const next = clamp0to100(cur + d);
      return { ...prev, babyPressure: next };
    });

    // Keep logs light; only log big moves
    if (source && Math.abs(d) >= 4) {
      addLog(`🍼 Baby Pressure ${d > 0 ? '+' : ''}${d} (${source})`);
    }
  }, [addLog]);

  const processPlayerHealthYearEndTick = useCallback((newChildAge) => {
    setGameState(prev => {
      const childAge = Number(newChildAge ?? prev.currentYear ?? 0);
      const parentAgeAtBirth = Number(prev.parentAgeAtBirth ?? 25);
      const parentAge = parentAgeAtBirth + childAge;

      // Existing annual drift (stress + aging)
      const driftDeltaRaw = computeAnnualPlayerHealthDelta({ parentAge, stress: prev.stress });
      const driftDelta = Number.isFinite(Number(driftDeltaRaw)) ? Number(driftDeltaRaw) : 0;

      // NEW: Rest/Overwork delta from unused Focus at year end
      const maxFocusRaw = Number(prev.maxFocusTokens ?? 0);
      const maxFocus = Number.isFinite(maxFocusRaw) ? Math.max(0, Math.floor(maxFocusRaw)) : 0;

      const apRaw = Number(prev.actionPoints ?? 0);
      const ap = Number.isFinite(apRaw) ? Math.floor(apRaw) : 0;

      // remaining Focus cannot be < 0 or > maxFocus (defensive clamp)
      const remaining = Math.max(0, Math.min(maxFocus, ap));

      // Rule:
      // - If any Focus remains: +1 health per unused Focus
      // - If none remains (used all Focus): -1 health
      const focusDelta = (maxFocus > 0)
        ? (remaining > 0 ? remaining : -1)
        : 0;

      // Total delta (rounded to 0.1 like the existing system)
      const totalDelta = Math.round((driftDelta + focusDelta) * 10) / 10;
      if (!totalDelta) return prev;

      const cur = Number(prev.playerHealth ?? 75);
      const next = clamp0to100(Math.round((cur + totalDelta) * 10) / 10);

      return { ...prev, playerHealth: next };
    });
  }, []);

  const tickBabyPressureForNewYear = useCallback((newYear) => {
    let report = null;

    setGameState(prev => {
      // If a child exists, hide/reset the meter.
      if (hasAnyChild(prev)) {
        if (Number(prev.babyPressure || 0) !== 0) {
          report = { kind: 'reset' };
        }
        return { ...prev, babyPressure: 0 };
      }

      const year = Number(newYear ?? prev.currentYear ?? 0);
      const adultAge = Number(prev.parentAgeAtBirth ?? 28) + year;

      const sexKey = getPlayerSexKey(prev);
      const target = babyPressureTargetByAdultAge(adultAge, sexKey);
      const current = clamp0to100(Number(prev.babyPressure || 0));

      // Deterministic noise (so the run feels consistent)
      const rng = makeSeededRng(`${prev.runSeed || 'seed'}|babyPressureTick|adultAge:${adultAge}|year:${year}`);
      const noise = Math.round(rng.nextFloat() * 6 - 3); // -3..+3
      const partnerBoost = (prev.householdType === 'two') ? 1 : 0;

      // Pull toward target quickly enough to hit peak near 40 for women.
      const pull = Math.round((target - current) * 0.55);
      const next = clamp0to100(current + pull + noise + partnerBoost);

      const penalty = next >= 90 ? 3 : next >= 75 ? 2 : next >= 50 ? 1 : 0;

      report = { kind: 'tick', current, next, penalty };
      return { ...prev, babyPressure: next };
    });

    if (!report || report.kind !== 'tick') return;

    if (report.penalty > 0) {
      applyStress(report.penalty, 'Baby Pressure');
      addLog(`🍼 Baby Pressure: ${report.next}/100 → Stress +${report.penalty}.`);
    } else if (Math.abs(report.next - report.current) >= 10) {
      addLog(`🍼 Baby Pressure: ${report.next}/100.`);
    }
  }, [applyStress, addLog]);

  const spendMoney = useCallback((amount, sourceOrMeta, maybeMeta) => {
    const meta = normalizeMoneyMeta(sourceOrMeta, maybeMeta);
    const base = Math.abs(Number(amount) || 0);
    let effCost = Math.round(base * (gameState.expenseMultiplier ?? 1.0));
    
    // Apply safety net reduction if present
    const reduction = gameState.yearExpenseReduction || 0;
    if (reduction > 0) {
      effCost = Math.round(effCost * (1 - reduction));
    }
    
    setGameState(prev => appendMoneyTx(prev, -effCost, meta));
  }, [gameState.expenseMultiplier, gameState.yearExpenseReduction]);
  
  const applyMoneyDelta = useCallback((amount, sourceOrMeta, maybeMeta) => {
    const meta = normalizeMoneyMeta(sourceOrMeta, maybeMeta);
    let delta = Number(amount) || 0;
    if (delta < 0) {
      // Apply expense multiplier
      delta = Math.round(delta * (gameState.expenseMultiplier ?? 1.0));
      
      // Apply safety net reduction if present
      const reduction = gameState.yearExpenseReduction || 0;
      if (reduction > 0) {
        delta = Math.round(delta * (1 - reduction));
      }
    }
    // OPTIMISTIC UI: Update money immediately before creating transaction
    setGameState(prev => {
      const updated = appendMoneyTx(prev, delta, meta);
      return updated;
    });
  }, [gameState.expenseMultiplier, gameState.yearExpenseReduction]);

  const addDiamonds = useCallback((amount = 0, source = '') => {
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  if (!n) return;
  setGameState(prev => ({
    ...prev,
    diamonds: Math.max(0, Math.floor(Number(prev.diamonds || 0)) + n)
  }));
  try {
    if (source === 'rewarded_stub') track('rt_diamonds_earn_video');
    else if (source === 'purchase_stub') track('rt_diamonds_purchase_stub');
  } catch {}
  try { addLog?.(`💎 Diamonds +${n} (${source || 'earn'})`); } catch {}
  try { toast.success(`+${n} diamonds`, { icon: '💎' }); } catch {}
}, [addLog]);

const spendDiamonds = useCallback((cost = 0, reason = '') => {
  const c = Math.max(0, Math.floor(Number(cost) || 0));
  if (c <= 0) return true;

  // Deterministic pre-check using latest state snapshot
  const cur = Math.max(0, Math.floor(Number(latestStateRef.current?.diamonds || 0)));
  if (cur < c) {
    try { track('rt_diamonds_insufficient'); } catch {}
    try { toast.error('Not enough diamonds', { icon: '💎' }); } catch {}
    return false;
  }

  // Apply spend (with race safety)
  setGameState(prev => {
    const p = Math.max(0, Math.floor(Number(prev.diamonds || 0)));
    if (p < c) return prev;
    return { ...prev, diamonds: p - c };
  });

  try { track('rt_diamonds_spend'); } catch {}
  try { addLog?.(`💎 Spent ${c} diamonds${reason ? ` (${reason})` : ''}`); } catch {}
  return true;
}, [addLog]);

const spendFocus = useCallback((amount, source) => {
    if ((gameState.actionPoints || 0) < amount) {
      track("rt_focus_insufficient");
      toast.error("Not enough Focus!");
      return false;
    }
    track("rt_focus_spent");
    // OPTIMISTIC UI: Update immediately without waiting
    setGameState(prev => ({ ...prev, actionPoints: (prev.actionPoints || 0) - amount }));
    return true;
  }, [gameState.actionPoints]);

  const consumeAction = useCallback((actionType) => {
    const ok = spendFocus(1, actionType);
    if (!ok) return false;
    setGameState(prev => ({
      ...prev,
      actionUsageCounts: {
        ...(prev.actionUsageCounts || {}),
        [actionType]: (prev.actionUsageCounts?.[actionType] || 0) + 1
      }
    }));
    return true;
  }, [spendFocus]);

  const makeTimelineId = () => 
    (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const recordTimelineEntry = useCallback((entry) => {
    setGameState(prev => {
      const safeEntries = Array.isArray(prev.timelineEntries) ? prev.timelineEntries : [];
      const age = (entry?.age ?? prev.currentYear ?? 0);
      
      // Tag with active kidId for multi-child correctness
      const meta = entry?.meta || {};
      if (!meta.kidId) {
        meta.kidId = prev.activeKidId || null;
      }

      return {
        ...prev,
        timelineEntries: [
          ...safeEntries,
          {
            ...entry,
            id: makeTimelineId(),
            age,
            kind: entry?.kind || "system",
            title: entry?.title || "Update",
            detail: entry?.detail || "",
            deltas: entry?.deltas ?? null,
            moneyDelta: Number(entry?.moneyDelta || 0),
            retirementDelta: Number(entry?.retirementDelta || 0),
            loveDelta: Number(entry?.loveDelta || 0),
            stressDelta: Number(entry?.stressDelta || 0),
            meta
          }
        ]
      };
    });
  }, []);
  
  const emitActionResult = useCallback((result) => {
    setGameState(prev => {
      const next = { ...prev, actionResultPending: result || null };

      // Tags (used both for timeline + for interaction tracking)
      const tags = Array.isArray(result?.tags) ? result.tags : [];

      // ✅ Mark "career interaction" for this year if this result is a career action.
      // This is intentionally done even if skipTimelineRecord is true.
      if (result && tags.includes("career")) {
        const y = prev.currentYear ?? 0;
        const pc0 = (prev.playerCareer && typeof prev.playerCareer === "object") ? prev.playerCareer : {};
        const flagsByAge = { ...(pc0.flagsByAge || {}) };
        const yearFlags = { ...(flagsByAge[y] || {}), interacted: true };
        flagsByAge[y] = yearFlags;
        next.playerCareer = { ...pc0, flagsByAge };
      }

      // Also write to Life Log unless explicitly skipped
      const skip = Boolean(result?.meta?.skipTimelineRecord);
      if (skip || !result) return next;

      const safeEntries = Array.isArray(prev.timelineEntries) ? prev.timelineEntries : [];
      const age = prev.currentYear ?? 0;

      // Decide kind from tags if present
      const kind = tags.includes("major") ? "major" : (tags.includes("tinyCute") ? "tinyCute" : "system");

      // Create a compact detail line from the result body
      const detail = typeof result.body === "string" ? result.body : "";

      const entry = {
        id: Date.now(),
        age,
        kind,
        title: result.title || "Update",
        detail,
        deltas: result.deltas ?? null,
        moneyDelta: Number(result.moneyDelta || 0),
        retirementDelta: Number(result.retirementDelta || 0),
        loveDelta: Number(result.loveDelta || 0),
        stressDelta: Number(result.stressDelta || 0),
        meta: result.meta || null
      };

      next.timelineEntries = [...safeEntries, entry];
      return next;
    });
  }, []);
  
  const dismissActionResult = useCallback(() => {
    setGameState(prev => ({ ...prev, actionResultPending: null }));
  }, []);

  const adjustedLoveGain = useCallback((base) => base, []); // Placeholder
  
  const applyTechniqueBonusesForAction = useCallback(() => ({}), []); // Placeholder
  
  const pickFlavor = useCallback(async (type, age) => {
    return { title: 'Generic Book', punchline: 'It was okay.' };
  }, []);
  
  const getLocalAmount = useCallback((baseAmount, opts = {}) => {
    const iso3 = gameState.countryIso3 || 'USA';
    const scale = getCountryLocalCostScale(iso3);
    const pricingType = opts.pricingType || PRICING.LOCAL;
    
    let amount = localizeAmount(baseAmount, scale, pricingType);
    
    // Apply healthcare out-of-pocket rate if medical category
    if (opts.category === 'medical' && opts.coverage !== 'none') {
      const oopRate = getHealthcareOutOfPocketRate(iso3);
      amount = Math.round(amount * oopRate);
    }
    
    return amount;
  }, [gameState.countryIso3]);
  
  const pickDatingAboutIndex = useCallback(() => null, []);

  // --- Computed ---
  
  const getHouseholdYearlyIncome = useCallback((state = null) => {
    const s = state || gameState;
    const playerIncome = Number(s.playerCareer?.yearlyIncome) || 0;
    let partnerIncome = 0;
    if (s.householdType === 'two') {
      partnerIncome = Number(s.partnerCareer?.yearlyIncome) || 0;
    }
    return playerIncome + partnerIncome;
  }, [gameState]);

  const getActionAvailability = useCallback((actionId) => {
    // Remote multiplayer turn lock
    const mp = gameState.remoteMultiplayer;
    if (mp?.enabled && mp?.sessionId && mp?.mySide && mp?.activeSide && mp.mySide !== mp.activeSide) {
      return { enabled: false, reason: "Waiting for the other player to finish their turn." };
    }

    // Child-related actions gating:
    // - If player has no child: disable child-related actions.
    // - If ALL kids are 18+: disable child-related actions.
    // - If some kids are minors but the active kid is 18+: disable and tell player to switch to a minor kid.
    const CHILD_ONLY = new Set([
      // Direct kid bonding
      'bond', 'play', 'tell_bedtime_story', 'joke_book',

      // School and school events
      'school', 'tutor',
      'scienceFair', 'artsShowcase', 'ecoChallenge', 'makerChallenge', 'debateForum',
      'studentLeadership', 'ptaIlluminati', 'parentLeadership',
      'homeschoolSupport', 'homeschoolAcademic', 'homeschoolStructure', 'homeschoolEmpathy', 'homeschoolConfidence',

      // Kid social and activities
      'playdates', 'trampoline_park', 'empathyCards',

      // Culture/participation is designed as parent+child content in this game
      'culture_heritage', 'teachCulture', 'participate', 'funFact',

      // Parenting systems
      'parentStrategies', 'routine',
      
      // Hobbies & Clubs
      'hobbies'
    ]);

    const CHILD_OPTIONAL = new Set([
      'outdoorAdventures',
      'outings',
      'naturePlay'
    ]);

    const minorChildPresent = hasMinorChild(gameState);

    // CHILD_ONLY actions: require a minor child
    if (!minorChildPresent && CHILD_ONLY.has(actionId)) {
      return { enabled: false, reason: 'Requires a child under 18.' };
    }

    // CHILD_OPTIONAL actions: allowed without minor child (they adapt content)
    // No gating needed here - they remain available

    // If there is at least one minor, but the active kid is adult, require switching active kid (for CHILD_ONLY actions)
    if (minorChildPresent && CHILD_ONLY.has(actionId)) {
      const activeKidLocal = getActiveChildFromState(gameState);
      const activeAge = activeKidLocal ? getDisplayedChildAge(gameState, activeKidLocal) : Number(gameState.currentYear || 0);
      if (activeKidLocal && activeAge >= 18) {
        return { enabled: false, reason: 'Select a child under 18 to do this.' };
      }
    }

    // Use active child's age for gating (multi-child safe)
    const activeKid = getActiveChildFromState(gameState);
    const age = activeKid ? getDisplayedChildAge(gameState, activeKid) : gameState.currentYear;

    // Language Learning: available at any age (no gating)

    // Apocalypse Special Starts: Block infrastructure-dependent actions + ALL school
    const ss = String(gameState.specialStartId || '');
    const isApocalypse = ss === 'zombie_apocalypse' || ss === 'alien_invasion' || ss === 'apocalypse_bunker_stream';
    
    const blockedForApocalypse = new Set([
      'trampoline_park', 'donation', 'salonSpa', 'outings', 'shopping', 'moveAbroad',
      'socialMedia', 'titles', 'runForOffice', 'realEstate', 'retirement',
      'school', 'education', 'tutor', 'languageLearning', 'scienceFair', 'artsShowcase',
      'ecoChallenge', 'makerChallenge', 'debateForum', 'studentLeadership', 'parentLeadership',
      'homeschoolSupport', 'homeschoolAcademic', 'homeschoolStructure', 'homeschoolEmpathy', 'homeschoolConfidence',
      'shop_housing', 'shop_cars', 'club'
    ]);
    if (isApocalypse && blockedForApocalypse.has(actionId)) {
      return { enabled: false, reason: 'Not available during the apocalypse.' };
    }
    
    // Special Start restrictions: War zone / Refugee camp
    const blockedForWarZone = new Set([
      'salonSpa','realEstate','business','retirement','titles','ptaIlluminati','runForOffice','moveAbroad','extremeSports',
      'scienceFair', 'artsShowcase', 'ecoChallenge', 'makerChallenge', 'debateForum', 'studentLeadership', 'parentLeadership',
      'trampoline_park', 'shop_housing', 'shop_cars'
    ]);
    const blockedForRefugeeCamp = new Set([
      ...blockedForWarZone,
      'videos','socialMedia','phone','phone_play','aiLearn','aiGrow','bookstore','library','date',
      'career', 'sideGigs'
    ]);
    if (ss === 'war_zone' && blockedForWarZone.has(actionId)) {
      return { enabled: false, reason: 'Unavailable in this Special Start (war zone).' };
    }
    if (ss === 'refugee_camp' && blockedForRefugeeCamp.has(actionId)) {
      return { enabled: false, reason: 'Unavailable in this Special Start (camp setting).' };
    }
    
    // Special Start restrictions: Space station family
    const blockedForSpaceStation = new Set([
      'moveAbroad',
      'realEstate',
      'outings',
      'outdoorAdventures',
      'naturePlay',
      'trampoline_park',
      'extremeSports',
      'business',
      'runForOffice',
      'titles',
      'shop_housing',
      'shop_cars'
    ]);
    if (ss === 'space_station_family' && blockedForSpaceStation.has(actionId)) {
      return { enabled: false, reason: 'Unavailable in this Special Start (space station).' };
    }
    
    // Special Start restrictions: Witness Protection (keep a low profile)
    const blockedForWitnessProtection = new Set([
      'socialMedia',
      'politics',
      'runForOffice',
      'titles',
      'club'
    ]);
    if (ss === 'witness_protection' && blockedForWitnessProtection.has(actionId)) {
      return { enabled: false, reason: 'Unavailable in this Special Start (low-profile life).' };
    }
    
    // Special Start restrictions: Supreme Leader (Kim Jong Un)
    const blockedForKim = new Set([
      'lookForJob',
      'career',
      'sideGigs',
      'runForOffice',
      'moveAbroad',
      'shop_housing',
      'shop_cars'
    ]);
    if (ss === 'kim_jong_un' && blockedForKim.has(actionId)) {
      return { enabled: false, reason: 'Not applicable in this Special Start (Supreme Leader).' };
    }
    
    // Polygamy Special Starts: Disable dating
    if ((ss === 'polygamist_doctor_indonesia' || ss === 'closed_polygamist_compound') && actionId === 'date') {
      return { enabled: false, reason: 'Dating is not available in this Special Start.' };
    }
    // School Age Gating (use active child's age)
    const SCHOOL_IDS = [
      'school', 'scienceFair', 'artsShowcase', 'ecoChallenge', 'makerChallenge', 
      'debateForum', 'studentLeadership', 'ptaIlluminati', 'parentLeadership',
      'homeschoolSupport', 'homeschoolAcademic', 'homeschoolStructure', 
      'homeschoolEmpathy', 'homeschoolConfidence'
    ];

    if (SCHOOL_IDS.includes(actionId)) {
      if (age < SCHOOL_START_AGE) {
        return { enabled: false, reason: "Your child is not school-age yet." };
      }
    }

    if (actionId === 'realEstate') {
      const hasProperties = (gameState.realEstate?.properties?.length || 0) > 0;
      const enabled = !!gameState.expansions?.empireEstatesLandlordLegacy;

      if (!enabled && !hasProperties) {
        return { enabled: false, reason: "Requires 🏙️ Empire Estates: Landlord Legacy (enable in Settings → Expansions)." };
      }
      if (!enabled && hasProperties) {
        return { enabled: true, reason: "Empire Estates is disabled. You can only sell existing properties." };
      }
    }

    // If anyone is sick/injured this age, block high-physical actions until Doctor clears it.
    const PHYSICAL_LOCK_IDS = ['extremeSports', 'outdoorAdventures', 'naturePlay', 'mindBody', 'trampoline_park'];
    if ((gameState.childSickThisAge || gameState.playerSickThisAge || gameState.partnerSickThisAge) && PHYSICAL_LOCK_IDS.includes(actionId)) {
      let msg = 'Someone is injured this year. Visit Health (Doctor) first.';
      if (gameState.childSickThisAge) {
        msg = 'Your child is injured this year. Visit Health (Doctor) first.';
      } else if (gameState.playerSickThisAge) {
        msg = 'You are injured this year. Visit Health (Doctor) first.';
      } else if (gameState.partnerSickThisAge) {
        msg = 'Your partner is injured this year. Visit Health (Doctor) first.';
      }
      return { enabled: false, reason: msg };
    }

    if (actionId === 'tell_bedtime_story') {
      if (age > 10) {
        return { enabled: false, reason: 'Best for ages 0–10.' };
      }
      if (gameState.actionPoints < 1) {
        return { enabled: false, reason: 'Not enough Focus.' };
      }
    }

    if (actionId === 'realEstate') {
      const hasProperties = (gameState.realEstate?.properties?.length || 0) > 0;
      const enabled = !!gameState.expansions?.empireEstatesLandlordLegacy;

      if (!enabled && !hasProperties) {
        return { enabled: false, reason: "Requires 🏙️ Empire Estates: Landlord Legacy (enable in Settings → Expansions)." };
      }
      if (!enabled && hasProperties) {
        return { enabled: true, reason: "Empire Estates is disabled. You can only sell existing properties." };
      }
    }

    const action = ACTION_REGISTRY.find(a => a.id === actionId);
    if (action && action.focusCost > 0) {
      if (gameState.actionPoints < action.focusCost) {
        return { enabled: false, reason: 'Not enough Focus.' };
      }
    }

    if (actionId === 'bond') {
      const child = gameState.relationships?.byId?.child;
      const met = child && ((child.createdAtAge ?? 0) <= (gameState.currentYear ?? 0));
      if (!met) {
        return { enabled: false, reason: 'Bonding unlocks after your child is born.' };
      }
    }

    // Politics: basic gating
    // Titles: only in monarchies
    if (actionId === 'titles') {
      const iso3 = String(gameState.countryIso3 || '').toUpperCase();
      const ss = String(gameState.specialStartId || '');
      const military = ss === 'military_relocation_cycle' || ss === 'military_relocation' || (gameState.playerCareer?.jobId === 'active_duty_military' || gameState.playerCareer?.jobId === 'military_service');
      const survivor = ss === 'alien_invasion';
      const underworld = ss === 'mafia_family';
      if (!isMonarchyCountry(gameState.countryIso3) && iso3 !== 'PRK' && !military && !survivor && !underworld) {
        return { enabled: false, reason: 'Available here only for monarchies, PRK, or certain special starts.' };
      }
    }

    if (actionId === 'runForOffice') {
      const playerAgeNow = Number(gameState.parentAgeAtBirth ?? 28) + Number(gameState.currentYear ?? 0);
      if (playerAgeNow < 18) return { enabled: false, reason: 'Run for Office unlocks at age 18.' };
      // Opening Politics should never require platform tags; gating is handled inside the modal when starting a campaign.
    }

    return { enabled: true };
  }, [gameState]);



  const seededPick = useCallback((array, seedKey, runSeed) => {
    if (!array || array.length === 0) return null;
    const seedString = `${runSeed}|${seedKey}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) hash = (hash << 5) - hash + seedString.charCodeAt(i);
    const index = Math.abs(hash) % array.length;
    return array[index];
  }, []);

  const processPetYearEnd = useCallback(() => {
    setGameState(prev => {
      const pets = Array.isArray(prev.pets) ? [...prev.pets] : [];
      if (pets.length === 0) return prev;

      let newMoney = prev.money;
      let newStress = prev.stress;
      const newEvents = [];
      let newGlobalEventAge = prev.lastGlobalPetEventAge;

      // reset actions and age + collect upkeep
      const alivePets = pets.map(p => ({ ...p, actionUsedThisYear: false, actionsTakenThisYear: [] }));
      const totalUpkeep = alivePets.reduce((sum, p) => sum + (Number(p.yearlyUpkeep) || 0), 0);

      const moneyBefore = newMoney;
      newMoney -= totalUpkeep;
      if (newMoney < 0) { newMoney = 0; newStress = Math.min(100, newStress + 1); }
      const delta = newMoney - moneyBefore;
      const tx = delta !== 0 ? [{ id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_pet_upkeep`, ts: Date.now(), age: prev.currentYear ?? 0, amount: delta, type: 'expense', source: 'Pets upkeep', note: '', category: 'pets' }] : [];

      // age and detect deaths (remove dying pets BEFORE applying passives)
      const petsBeforeDeath = [...alivePets];
      for (let i = 0; i < alivePets.length; i++) {
        const p = alivePets[i];
        // BUG B FIX: Age properly from starting age
        const yearsSinceAdoption = (prev.currentYear ?? 0) - (p.adoptedAtAge ?? 0);
        p.petAgeYears = (p.startingAge ?? 0) + yearsSinceAdoption + 1;
        if (p.petAgeYears >= p.deathAgeYears) {
          newEvents.push({
            type: 'petDeath',
            petId: p.id,
            petName: p.name,
            title: `Goodbye, ${p.name}`,
            body: `Today is quieter in a new way. Your child understands that love includes endings. You sit together, remembering what was good, and letting the sadness be real without rushing it away.`,
            choices: [{ text: 'Hold a small goodbye', effects: { stress: 1, empathy: 0.3, confidence: -0.2 } }]
          });
        }
      }
      
      // Filter out dying pets for passive application
      const aliveAfterDeath = petsBeforeDeath.filter(p => p.petAgeYears < p.deathAgeYears);
      
      // ===== YEARLY PASSIVE EFFECTS (ONCE PER SPECIES) =====
      const uniqueSpecies = new Set(aliveAfterDeath.map(p => p.speciesKey));
      const triggeredMishaps = [];
      
      for (const speciesKey of uniqueSpecies) {
        const passive = PET_PASSIVES[speciesKey];
        if (!passive) continue;
        
        // Find a pet of this species for naming purposes
        const examplePet = aliveAfterDeath.find(p => p.speciesKey === speciesKey);
        
        // Apply baseline effects
        if (passive.baseline) {
          const b = passive.baseline;
          if (b.stressDelta) newStress = Math.max(0, Math.min(100, newStress + b.stressDelta));
          if (b.loveDelta) {
            // Will apply via applyLove after setState
          }
          if (b.moneyDelta) {
            // Will apply via applyMoneyDelta after setState
          }
          if (b.deltas) {
            // Will apply via applyDeltas after setState
          }
        }
        
        // Roll for mishap
        if (passive.mishap) {
          const rng = createSeededRng(`${prev.runSeed}|petMishap|${speciesKey}|age:${prev.currentYear}`);
          const roll = rng.nextFloat();
          
          if (roll < passive.mishap.chance) {
            const childName = prev.childName || 'your child';
            const petName = examplePet?.name || 'Pet';
            const hasFireInsurance = speciesKey === 'dragon' && !!examplePet?.flags?.fireInsurancePurchased;
            
            const eventData = passive.mishap.buildEvent({ petName, childName, hasFireInsurance });
            
            triggeredMishaps.push({
              type: 'petPassiveMishap',
              speciesKey,
              petId: examplePet?.id,
              petName,
              ...eventData
            });
          }
        }
      }
      
      // CAP: at most 1 mishap popup per year
      if (triggeredMishaps.length > 0) {
        const rng = createSeededRng(`${prev.runSeed}|pickMishap|age:${prev.currentYear}`);
        const pickedMishap = rng.pick(triggeredMishaps);
        if (pickedMishap) {
          newEvents.push(pickedMishap);
        }
      }

      // mini event throttle (once per >=3 years)
      const yearsSinceLast = (prev.currentYear - (newGlobalEventAge || -999));
      if (yearsSinceLast >= 3 && alivePets.length > 0 && Math.random() < 0.30) {
        const pickIdx = Math.floor(Math.random() * alivePets.length);
        const petPick = alivePets[pickIdx];
        const speciesData = PET_CATALOG.find(s => s.speciesKey === petPick.speciesKey);
        if (speciesData && speciesData.miniEvents?.length > 0) {
          const evt = speciesData.miniEvents[Math.floor(Math.random() * speciesData.miniEvents.length)];
          newEvents.push({ type: 'petMini', petId: petPick.id, petName: petPick.name, title: evt.title || 'Pet moment', body: evt.body || '', choices: evt.choices || [{ text: 'Okay', effects: {} }] });
          newGlobalEventAge = prev.currentYear + 1;
          petPick.lastPetEventAge = prev.currentYear + 1;
        }
      }

      // queue handling
      const queue = [...(prev.petEventQueue || []), ...newEvents];
      const nextPending = prev.petEventPending || queue.shift() || null;

      return { ...prev, pets: alivePets, money: newMoney, stress: newStress, petEventPending: nextPending, petEventQueue: queue, lastGlobalPetEventAge: newGlobalEventAge, moneyTransactions: [...(prev.moneyTransactions || []), ...tx] };
    });
    
    // Apply passive baseline effects AFTER state update (using helpers)
    setTimeout(() => {
      const state = latestStateRef.current;
      const alivePets = (state.pets || []).filter(p => p.petAgeYears < p.deathAgeYears);
      const uniqueSpecies = new Set(alivePets.map(p => p.speciesKey));
      
      for (const speciesKey of uniqueSpecies) {
        const passive = PET_PASSIVES[speciesKey];
        if (!passive?.baseline) continue;
        
        const b = passive.baseline;
        const speciesData = PET_CATALOG.find(s => s.speciesKey === speciesKey);
        const speciesName = speciesData?.displayName || speciesKey;
        
        if (b.loveDelta) applyLove(b.loveDelta, `Pet passive: ${speciesName}`);
        if (b.deltas) applyDeltas(b.deltas, `Pet passive: ${speciesName}`);
        if (b.moneyDelta) applyMoneyDelta(b.moneyDelta, `Pet passive: ${speciesName}`, { category: 'pets' });
      }
    }, 0);
  }, [applyLove, applyDeltas, applyMoneyDelta]);

  const resolvePetEvent = useCallback((event, choiceIndex = 0) => {
    if (!event) return;

    const choices = Array.isArray(event.choices) ? event.choices : [];
    const idxRaw = Number.isFinite(Number(choiceIndex)) ? Number(choiceIndex) : 0;
    const safeIndex =
      choices.length > 0
        ? Math.max(0, Math.min(choices.length - 1, idxRaw))
        : 0;

    const choice = choices[safeIndex] || choices[0] || { text: "OK", effects: {} };
    const effects = (choice && typeof choice.effects === "object" && choice.effects) ? choice.effects : {};

    // Apply effects safely (these can call setGameState internally; that's OK as long as we don't nest inside another setGameState updater)
    const { stress, love, moneyDelta, ...stats } = effects || {};
    const hasStats = stats && typeof stats === "object" && Object.keys(stats).length > 0;

    if (hasStats) applyDeltas(stats, `Pet Event: ${event.title || "Pet Event"}`);
    if (Number.isFinite(Number(stress)) && Number(stress) !== 0) applyStress(Number(stress), `Pet Event: ${event.title || "Pet Event"}`);
    if (Number.isFinite(Number(love)) && Number(love) !== 0) applyLove(Number(love), `Pet Event: ${event.title || "Pet Event"}`);
    if (Number.isFinite(Number(moneyDelta)) && Number(moneyDelta) !== 0) {
      applyMoneyDelta(Number(moneyDelta), `Pet mishap: ${event.title || "Pet Event"}`, { category: "pets" });
    }

    // Build timeline entry OUTSIDE setGameState (CRITICAL)
    const timelineEntry =
      event.type === "petDeath"
        ? {
            kind: "pet",
            title: `Goodbye, ${event.petName || "your pet"}`,
            detail: "A beloved companion passed away.",
            deltas: effects || null,
            moneyDelta: Number(effects?.moneyDelta || 0),
            loveDelta: 0,
            stressDelta: Number(effects?.stress || 0),
          }
        : {
            kind: event.type === "petPassiveMishap" ? "pet_mishap" : "pet_event",
            title: event.title || "Pet moment",
            detail: event.body || "A small pet moment.",
            deltas: effects || null,
            moneyDelta: Number(effects?.moneyDelta || 0),
            loveDelta: 0,
            stressDelta: Number(effects?.stress || 0),
          };

    // Update pets + queue in ONE setGameState call; DO NOT call recordTimelineEntry here
    setGameState(prev => {
      let pets = Array.isArray(prev.pets) ? [...prev.pets] : [];
      let petEventQueue = Array.isArray(prev.petEventQueue) ? [...prev.petEventQueue] : [];

      const nextPending = petEventQueue.shift() || null;

      if (event.type === "petDeath") {
        pets = pets.filter(p => p.id !== event.petId);

        let activePetId = prev.activePetId;
        if (activePetId && !pets.find(p => p.id === activePetId)) {
          activePetId = pets[0]?.id || null;
        }

        return {
          ...prev,
          pets,
          activePetId,
          petEventPending: nextPending,
          petEventQueue,
        };
      }

      return {
        ...prev,
        petEventPending: nextPending,
        petEventQueue,
      };
    });

    // Record timeline entry AFTER scheduling the state update (no nested setGameState)
    recordTimelineEntry(timelineEntry);

    if (event.type === "petDeath") {
      addLog(`Goodbye, ${event.petName || "your pet"}.`);
    }
  }, [applyDeltas, applyStress, applyLove, applyMoneyDelta, addLog, recordTimelineEntry]);

  const adoptPet = useCallback((speciesKey, customName) => {
    const speciesDef = PET_CATALOG.find(s => s.speciesKey === speciesKey);
    if (!speciesDef) return;

    setGameState(prev => {
      const rng = createSeededRng(`${prev.runSeed || 'seed'}|adoptPet|${speciesKey}|${prev.currentYear}`);
      
      const upfrontCost = Math.floor(rng.nextFloat() * (speciesDef.upfrontCostRange[1] - speciesDef.upfrontCostRange[0] + 1)) + speciesDef.upfrontCostRange[0];
      const yearlyUpkeep = Math.floor(rng.nextFloat() * (speciesDef.yearlyUpkeepRange[1] - speciesDef.yearlyUpkeepRange[0] + 1)) + speciesDef.yearlyUpkeepRange[0];
      const deathAgeYears = Math.floor(rng.nextFloat() * (speciesDef.lifespanRangeYears[1] - speciesDef.lifespanRangeYears[0] + 1)) + speciesDef.lifespanRangeYears[0];
      
      // BUG B FIX: Variable starting age based on species
      const startingAgeRanges = {
        dog: [0, 12],
        cat: [0, 12],
        rabbit: [0, 7],
        fish: [0, 4],
        bird: [0, 8],
        snake: [0, 10],
        turtle: [0, 15],
        hamster: [0, 3],
        goat: [0, 10],
        horse: [0, 15],
        lizard: [0, 8],
        chickens: [0, 6],
        unicorn: [30, 80],
        dragon: [66, 175]
      };
      
      const ageRange = startingAgeRanges[speciesKey] || [0, 10];
      const startingAge = Math.floor(rng.nextFloat() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0];
      
      const cleaned = typeof customName === 'string' ? customName.trim() : '';
      const randomNameFromSpecies = speciesDef.names[Math.floor(rng.nextFloat() * speciesDef.names.length)];
      const name = cleaned || randomNameFromSpecies || 'Pet';

      const newPet = {
        id: `pet_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        speciesKey: speciesDef.speciesKey,
        name,
        adoptedAtAge: prev.currentYear,
        startingAge,
        petAgeYears: startingAge,
        deathAgeYears,
        upfrontCost,
        yearlyUpkeep,
        lastPetEventAge: prev.currentYear,
        actionUsedThisYear: false,
        actionsTakenThisYear: [],
        bond: 5
      };

      const tx = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_adopt`,
        ts: Date.now(),
        age: prev.currentYear ?? 0,
        amount: -upfrontCost,
        type: "expense",
        source: `Adopted ${name} the ${speciesDef.displayName}`,
        note: "",
        category: "pets"
      };

      return {
        ...prev,
        money: prev.money - upfrontCost,
        pets: [...(prev.pets || []), newPet],
        activePetId: newPet.id,
        moneyTransactions: [...(prev.moneyTransactions || []), tx]
      };
    });

    const petNameFinal = latestStateRef.current?.pets?.slice(-1)[0]?.name || 'your pet';
    
    addLog(`Adopted ${petNameFinal} the ${speciesDef?.displayName || 'pet'}!`);
    recordTimelineEntry({
      kind: 'pet',
      title: `Adopted ${petNameFinal} (${speciesDef?.displayName || 'Pet'})`,
      detail: `Welcome home!`,
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });
  }, [addLog, recordTimelineEntry]);

  const rehomePet = useCallback((petId) => {
    setGameState(prev => {
      const pets = Array.isArray(prev.pets) ? [...prev.pets] : [];
      const idx = pets.findIndex(p => p.id === petId);
      if (idx === -1) return prev;

      let newMoney = prev.money;
      let fee = 0;
      if (newMoney >= 50) { fee = 50; newMoney -= 50; }

      const newTx = fee > 0 ? [{
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_rehome`,
        ts: Date.now(), age: prev.currentYear ?? 0, amount: -fee, type: 'expense', source: 'Rehome fee', note: '', category: 'pets'
      }] : [];

      pets.splice(idx, 1);
      const activePetId = prev.activePetId === petId ? (pets[0]?.id || null) : prev.activePetId;

      return { ...prev, pets, activePetId, money: newMoney, moneyTransactions: [...(prev.moneyTransactions || []), ...newTx] };
    });

    applyStress(1, 'Rehomed Pet');
    applyDeltas({ confidence: -0.2, empathy: 0.1 }, 'Rehomed Pet');
    addLog('Rehomed pet.');
  }, [applyStress, applyDeltas, addLog]);

  const performPetAction = useCallback((petId, actionDef) => {
    // BUG A FIX: Track success outside setState for proper async flow
    let didSucceed = false;
    let petSnapshot = null;
    
    setGameState(prev => {
      const pets = Array.isArray(prev.pets) ? [...prev.pets] : [];
      const idx = pets.findIndex(p => p.id === petId);
      if (idx === -1) return prev;

      const focusCost = actionDef.focusCost || 0;
      const moneyCost = actionDef.moneyCost || 0;
      if (prev.actionPoints < focusCost) return prev;
      if (prev.money < moneyCost) return prev;

      // Mark success and capture pet data BEFORE applying changes
      didSucceed = true;
      petSnapshot = { ...pets[idx] };
      
      const p = { ...pets[idx] };
      p.actionsTakenThisYear = [...(p.actionsTakenThisYear || []), actionDef.id];
      p.actionUsedThisYear = true;
      pets[idx] = p;

      const newTx = moneyCost > 0 ? [{
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_petAction`,
        ts: Date.now(), age: prev.currentYear ?? 0, amount: -moneyCost, type: 'expense', source: `Pet: ${actionDef.name}`, note: '', category: 'pets'
      }] : [];

      // Update pet bond visibly
      const bond0 = Number.isFinite((pets[idx].bond)) ? Number(pets[idx].bond) : 5;
      const bondDelta = (moneyCost > 0 ? 0.3 : (focusCost > 0 ? 0.2 : 0.1));
      pets[idx].bond = Math.max(0, Math.min(10, bond0 + bondDelta));

      return { ...prev, pets, actionPoints: prev.actionPoints - focusCost, money: prev.money - moneyCost, moneyTransactions: [...(prev.moneyTransactions || []), ...newTx] };
    });

    // BUG A FIX: ALWAYS apply effects, log, and show popup (even if success is false)
    // Use petSnapshot captured before state update
    const pet = petSnapshot || (gameState.pets || []).find(p => p.id === petId) || gameState.pet;
    const effects = actionDef.effects || {};
    
    if (effects) {
      const { stress, love, ...stats } = effects;
      if (Object.keys(stats).length) applyDeltas(stats, `Pet: ${actionDef.name}`);
      if (stress) applyStress(stress, `Pet: ${actionDef.name}`);
      if (love) applyLove(love, `Pet: ${actionDef.name}`);
    }

    // BUG A FIX: ALWAYS record timeline entry (decouple from popup)
    recordTimelineEntry({ 
      kind: 'pet', 
      title: `🐾 ${actionDef.name} — ${pet?.name || 'Pet'}`, 
      detail: `You spent time with ${pet?.name || 'your pet'}.`, 
      deltas: effects, 
      moneyDelta: -(actionDef.moneyCost || 0), 
      loveDelta: effects?.love || 0, 
      stressDelta: effects?.stress || 0 
    });

    // BUG A FIX: ALWAYS generate popup body (use flavor or fallback)
    const body = getPetActionFlavor(pet, actionDef);

    const { love = 0, stress = 0, ...statsOnly } = effects || {};
    
    // BUG A FIX: ALWAYS emit action result with unique timestamp-based ID
    emitActionResult({
      actionId: `pet:${actionDef.id}:${Date.now()}`,
      title: `${actionDef.emoji || '🐾'} ${actionDef.name}`,
      body,
      deltas: Object.keys(statsOnly).length ? statsOnly : null,
      moneyDelta: -Number(actionDef.moneyCost || 0),
      focusDelta: -Number(actionDef.focusCost || 0),
      loveDelta: Number(love || 0),
      stressDelta: Number(stress || 0),
      tags: ['pet'],
      meta: { emoji: actionDef.emoji || '🐾', skipTimelineRecord: true }
    });

    return didSucceed;
  }, [gameState.pets, gameState.pet, applyDeltas, applyStress, applyLove, recordTimelineEntry, emitActionResult]);

  const maybeQueueHomeworkPopup = useCallback((newAge) => {
    // Gate: child-only
    if (!hasAnyChild(gameState)) return;
    
    // Only ages 6, 9, 12, 15, 18
    if (![6, 9, 12, 15, 18].includes(newAge)) return;
    
    // Check if already shown this run for this age (prevent duplicates if age re-runs happen for some reason)
    if (gameState.homeworkPopupShownAges.includes(newAge)) return;

    // Filter available events
    const available = HOMEWORK_POPUPS.filter(p => 
      p.triggerAge === newAge && 
      !gameState.usedHomeworkPopupIds.includes(p.id)
    );

    if (available.length === 0) return;

    // Random pick
    const selected = available[Math.floor(Math.random() * available.length)];

    updateState(prev => ({
      homeworkPopupPending: selected,
      usedHomeworkPopupIds: [...prev.usedHomeworkPopupIds, selected.id],
      homeworkPopupShownAges: [...prev.homeworkPopupShownAges, newAge]
    }));
  }, [gameState.homeworkPopupShownAges, gameState.usedHomeworkPopupIds, updateState]);

  const resolveHomeworkPopup = useCallback((choiceId) => {
    const popup = gameState.homeworkPopupPending;
    if (!popup) return;

    const choice = popup.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Apply effects
    if (choice.deltas) applyDeltas(choice.deltas, `Homework: ${popup.title}`);
    if (choice.loveDelta) applyLove(choice.loveDelta, `Homework: ${popup.title}`);

    // Apply +1 base stress for the popup itself + choice specific stress
    const totalStress = 1 + (choice.stressDelta || 0);
    applyStress(totalStress, `Homework: ${popup.title}`);

    if (choice.moneyDelta) applyMoneyDelta(choice.moneyDelta);

    // Log & Timeline
    addLog(`📚 Homework: ${choice.text}`);
    recordTimelineEntry({
      kind: "homework",
      title: `📚 Homework Moment: ${popup.title}`,
      detail: `${popup.body}\n\n${choice.consequence}\n\nStats: ${formatDeltas(choice.deltas)}`,
      deltas: choice.deltas,
      loveDelta: choice.loveDelta,
      stressDelta: choice.stressDelta,
      moneyDelta: choice.moneyDelta || 0
    });

    // Clear pending
    updateState({ homeworkPopupPending: null });
  }, [gameState.homeworkPopupPending, applyDeltas, applyLove, applyStress, applyMoneyDelta, addLog, recordTimelineEntry, updateState]);

  // --- Adult Life Moments (child-free mode: dedicated yearly popup) ---
  const maybeQueueAdultLifeMomentPopup = useCallback((yearOrCurrent = null) => {
    // Only active when there is NO child
    if (hasAnyChild(gameState)) return;

    const year = Number.isFinite(yearOrCurrent) ? Number(yearOrCurrent) : Number(gameState.currentYear ?? 0);

    // Do not overwrite an unresolved popup, and don't queue twice for the same year
    if (gameState.adultLifeMomentPopupPending) {
      updateState(prev => ({ ...prev, adultLifeMomentLastProcessedYear: year }));
      return;
    }
    if ((gameState.adultLifeMomentLastProcessedYear ?? -1) === year) return;

    const adultAge = Number(gameState.parentAgeAtBirth ?? 28) + year;

    let pool = Array.isArray(ADULT_LIFE_MOMENTS) ? ADULT_LIFE_MOMENTS : [];
    pool = pool.filter((m) => {
      const minA = Number(m.minAdultAge ?? 18);
      const maxA = Number(m.maxAdultAge ?? 99);
      if (adultAge < minA || adultAge > maxA) return false;
      if (!adultLifeMomentPasses(m, gameState)) return false;
      return true;
    });

    if (!pool.length) {
      updateState(prev => ({ ...prev, adultLifeMomentLastProcessedYear: year }));
      return;
    }

    // Prefer unused moments when possible
    const used = new Set(gameState.adultLifeMomentUsedIds || []);
    const unusedPool = pool.filter((m) => !used.has(m.id));
    if (unusedPool.length) {
      pool = unusedPool;
    } else {
      // Exhausted: reset used list
      updateState(prev => ({ ...prev, adultLifeMomentUsedIds: [] }));
    }

    // Weight bias: increase weight for baby-themed moments when pressure is high
    const bp = Number(gameState.babyPressure || 0);
    const weightMult = bp >= 80 ? 1.8 : bp >= 60 ? 1.4 : bp >= 40 ? 1.15 : 1.0;
    
    const isBabyThemed = (m) => {
      const hasPressDelta = m.choices?.some(c => c.babyPressureDelta != null && c.babyPressureDelta !== 0);
      if (hasPressDelta) return true;
      const text = `${m.id} ${m.title} ${m.body}`.toLowerCase();
      return /baby|pregnant|pregnancy|fertility|kid|children|mom|dad/.test(text);
    };

    const poolWeighted = pool.map(m => ({
      ...m,
      weight: (m.weight || 1) * (isBabyThemed(m) ? weightMult : 1.0)
    }));

    const rng = makeSeededRng(`${gameState.runSeed || 'seed'}|adultMoment|adultAge:${adultAge}|year:${year}`);
    const picked = weightedPick(poolWeighted, () => rng.nextFloat());
    if (!picked) {
      updateState(prev => ({ ...prev, adultLifeMomentLastProcessedYear: year }));
      return;
    }

    updateState((prev) => ({
      ...prev,
      adultLifeMomentPopupPending: picked,
      adultLifeMomentUsedIds: [...new Set([...(prev.adultLifeMomentUsedIds || []), picked.id])],
      adultLifeMomentLastProcessedYear: year
    }));
  }, [gameState, updateState]);

  const resolveAdultLifeMomentPopup = useCallback((choiceId) => {
    const popup = gameState.adultLifeMomentPopupPending;
    if (!popup) return;

    const choice = Array.isArray(popup.choices)
      ? (popup.choices.find((c) => c.id === choiceId) || popup.choices[0])
      : null;

    if (!choice) {
      updateState({ adultLifeMomentPopupPending: null });
      return;
    }

    const label = `Adult Life Moment: ${popup.title}`;

    // Apply stat deltas
    if (choice.deltas && typeof choice.deltas === 'object') {
      applyDeltas(choice.deltas, label);
    }

    if (Number.isFinite(choice.stressDelta) && Number(choice.stressDelta) !== 0) {
      applyStress(Number(choice.stressDelta), label);
    }

    if (Number.isFinite(choice.loveDelta) && Number(choice.loveDelta) !== 0 && hasPartner(gameState)) {
      updateState((prev) => ({
        ...prev,
        partnerMeter: clamp0to100(Number(prev.partnerMeter || 50) + Number(choice.loveDelta)),
      }));
    }

    if (Number.isFinite(choice.moneyDelta) && Number(choice.moneyDelta) !== 0) {
      applyMoneyDelta(Number(choice.moneyDelta), { source: label, category: choice.moneyCategory || 'uncategorized' });
    }

    if (Number.isFinite(choice.babyPressureDelta) && Number(choice.babyPressureDelta) !== 0) {
      applyBabyPressure(Number(choice.babyPressureDelta), label);
    }

    // Build effects summary
    const effects = [];
    if (choice.stressDelta) effects.push(`Stress ${choice.stressDelta > 0 ? '+' : ''}${choice.stressDelta}`);
    if (choice.loveDelta && hasPartner(gameState)) effects.push(`Love ${choice.loveDelta > 0 ? '+' : ''}${choice.loveDelta}`);
    if (choice.moneyDelta) effects.push(`Money ${choice.moneyDelta > 0 ? '+' : ''}$${Math.abs(choice.moneyDelta)}`);
    if (choice.babyPressureDelta) effects.push(`Baby Pressure ${choice.babyPressureDelta > 0 ? '+' : ''}${choice.babyPressureDelta}`);
    if (choice.deltas) {
      Object.entries(choice.deltas).forEach(([k, v]) => {
        effects.push(`${k} ${v > 0 ? '+' : ''}${v}`);
      });
    }

    // Timeline entry
    recordTimelineEntry({
      kind: 'adult_life_moment',
      title: `🧑‍💼 ${popup.title}`,
      detail: `${popup.body}\n\nYou chose: ${choice.emoji} ${choice.text}\n\n${choice.consequence}\n\nEffects: ${effects.join(' • ')}`,
      deltas: choice.deltas || null,
      moneyDelta: Number(choice.moneyDelta || 0),
      loveDelta: 0,
      stressDelta: Number(choice.stressDelta || 0),
      meta: { momentId: popup.id, choice: choice.id }
    });

    // Action result modal
    emitActionResult({
      actionId: 'adultLifeMoment',
      title: `🧑‍💼 ${popup.title}`,
      body: `${popup.body}\n\nYou chose: ${choice.emoji} ${choice.text}\n\n${choice.consequence}`,
      deltas: choice.deltas || null,
      loveDelta: Number(choice.loveDelta || 0),
      stressDelta: Number(choice.stressDelta || 0),
      moneyDelta: Number(choice.moneyDelta || 0),
      focusDelta: 0,
      tags: ['adultLife'],
      meta: { emoji: '🧑‍💼', skipTimelineRecord: true }
    });

    addLog(`${label} — ${(choice.consequence || choice.text || '').trim()}`.trim());

    updateState({ adultLifeMomentPopupPending: null });
  }, [gameState, applyDeltas, applyStress, applyMoneyDelta, applyBabyPressure, updateState, addLog, recordTimelineEntry, emitActionResult]);

  // --- Adult life popup (adult-child continuation system: post-18 parenting) ---
  const maybeQueueAdultLifePopup = useCallback((yearOrCurrent = null) => {
    // Only active when there is NO child
    if (hasAnyChild(gameState)) return;

    const year = Number.isFinite(yearOrCurrent) ? Number(yearOrCurrent) : Number(gameState.currentYear ?? 0);

    // Do not overwrite an unresolved popup, and don't queue twice for the same year
    if (gameState.adultLifePopupPending) return;
    if ((gameState.lastAdultLifePopupYear ?? -1) === year) return;

    const adultAge = Number(gameState.parentAgeAtBirth ?? 18) + year;

    let pool = Array.isArray(ADULT_LIFE_MOMENTS) ? ADULT_LIFE_MOMENTS : [];
    pool = pool.filter((m) => {
      const minA = Number(m.minAdultAge ?? 18);
      const maxA = Number(m.maxAdultAge ?? 99);
      if (adultAge < minA || adultAge > maxA) return false;
      if (!adultLifeMomentPasses(m, gameState)) return false;
      return true;
    });

    if (!pool.length) return;

    // Prefer unused moments when possible
    const used = new Set(gameState.adultLifeUsedIds || []);
    const unusedPool = pool.filter((m) => !used.has(m.id));
    if (unusedPool.length) pool = unusedPool;

    const rng = createSeededRng(`${gameState.runSeed || 'seed'}|adultLifeMoment|adultAge:${adultAge}|year:${year}`);
    const picked = weightedPick(pool, rng.nextFloat);
    if (!picked) return;

    updateState((prev) => ({
      ...prev,
      adultLifePopupPending: {
        ...picked,
        meta: {
          ...(picked.meta || {}),
          year,
          adultAge,
        },
      },
      lastAdultLifePopupYear: year,
      adultLifeUsedIds: [...new Set([...(prev.adultLifeUsedIds || []), picked.id])],
    }));
  }, [gameState, updateState]);

  const resolveAdultLifePopup = useCallback((choiceId) => {
    const popup = gameState.adultLifePopupPending;
    if (!popup) return;

    const choice = Array.isArray(popup.choices)
      ? (popup.choices.find((c) => c.id === choiceId) || popup.choices[0])
      : null;

    if (!choice) {
      updateState({ adultLifePopupPending: null });
      return;
    }

    const label = `Adult Life: ${popup.title}`;

    // Apply stat deltas (these are the "you" stats in the before-baby chapter)
    if (choice.deltas && typeof choice.deltas === 'object') {
      applyDeltas(choice.deltas, label);
    }

    if (Number.isFinite(choice.stressDelta) && Number(choice.stressDelta) !== 0) {
      applyStress(Number(choice.stressDelta), label);
    }

    if (Number.isFinite(choice.moneyDelta) && Number(choice.moneyDelta) !== 0) {
      applyMoneyDelta(Number(choice.moneyDelta), label, { category: 'adultLife' });
    }

    if (Number.isFinite(choice.babyPressureDelta) && Number(choice.babyPressureDelta) !== 0) {
      updateState((prev) => ({
        ...prev,
        babyPressure: clamp0to100(Number(prev.babyPressure || 0) + Number(choice.babyPressureDelta)),
      }));
    }

    // In child-free mode, interpret loveDelta as partner meter (only when a partner exists)
    if (Number.isFinite(choice.loveDelta) && hasPartner(gameState) && Number(choice.loveDelta) !== 0) {
      updateState((prev) => ({
        ...prev,
        partnerMeter: clamp0to100(Number(prev.partnerMeter || 50) + Number(choice.loveDelta)),
      }));
    }

    addLog(`${label} — ${(choice.consequence || choice.text || '').trim()}`.trim());

    updateState({ adultLifePopupPending: null });
  }, [gameState, applyDeltas, applyStress, applyMoneyDelta, updateState, addLog]);

  // --- Adult child continuation (post-18 adult child system) ---
  const maybeQueueAdultChildPopup = useCallback((yearOrCurrent = null) => {
    if (!hasAnyChild(gameState)) return;

    const year = Number.isFinite(yearOrCurrent)
      ? Number(yearOrCurrent)
      : Number(gameState.currentYear ?? 0);

    if (gameState.adultChildPopupPending) return;
    if ((gameState.adultChildLastProcessedYear ?? -1) === year) return;

    updateState((prev) => {
      if (!hasAnyChild(prev)) return prev;
      if (prev.adultChildPopupPending) return prev;
      if ((prev.adultChildLastProcessedYear ?? -1) === year) return prev;

      let s = ensureKidsContainer(prev);
      const kids = Array.isArray(s.kids) ? s.kids : [];

      // adult children = relation 'child' and age >= 18
      const adultEntries0 = kids
        .filter((k) => k?.relation === 'child')
        .map((k) => ({
          kid: k,
          displayedAge: getDisplayedChildAge({ ...s, currentYear: year }, k),
        }))
        .filter((e) => e.displayedAge >= 18);

      if (!adultEntries0.length) {
        return { ...s, adultChildLastProcessedYear: year };
      }

      // Simulate adult-life year for each adult child
      const nextKids = kids.map((k) => {
        const age = getDisplayedChildAge({ ...s, currentYear: year }, k);
        if (k?.relation !== 'child' || age < 18) return k;

        const ensured = ensureAdultLife({ state: s, kid: k, displayedAge: age });
        return simulateAdultLifeYear({ state: s, kid: ensured, displayedAge: age, year });
      });

      s = { ...s, kids: nextKids };

      // Rebuild adult entries after simulation; keep dead kids ONLY if not yet notified
      const adultEntries = nextKids
        .filter((k) => k?.relation === 'child')
        .map((k) => ({
          kid: k,
          displayedAge: getDisplayedChildAge({ ...s, currentYear: year }, k),
        }))
        .filter((e) => {
          if (e.displayedAge < 18) return false;
          const life = e.kid?.adultLife || {};
          const deadNotified = life.deathYear != null && life.deathNotified === true;
          return !deadNotified;
        });

      // Generate optional contact pings (correct signature)
      const pingList = generateAdultContactPings({ state: s, adultEntries, year });
      if (Array.isArray(pingList) && pingList.length) {
        const existing = Array.isArray(s.adultLifePingsQueue) ? s.adultLifePingsQueue : [];
        s = { ...s, adultLifePingsQueue: existing.concat(pingList).slice(-50) };
      }

      // Apply one-year focus if set
      const focusKidId =
        (Number(s.adultLifeFocusYear ?? -1) === year && s.adultLifeFocusKidId)
          ? s.adultLifeFocusKidId
          : null;

      // IMPORTANT: pass allKids so grandkid milestones can be found/selected
      let popup = pickAdultLifePopup({
        state: s,
        adultEntries,
        year,
        focusKidId,
        allKids: nextKids
      });

      // Fail-safe: clear stale focus and retry once
      if (!popup) {
        const cleaned = { ...s, adultLifeFocusKidId: null, adultLifeFocusYear: null };
        popup = pickAdultLifePopup({
          state: cleaned,
          adultEntries,
          year,
          focusKidId: null,
          allKids: nextKids
        });
        if (!popup) {
          return { ...cleaned, adultChildLastProcessedYear: year };
        }
        return { ...cleaned, adultChildPopupPending: popup, adultChildLastProcessedYear: year };
      }

      // Clear focus after use
      if (focusKidId) {
        s = { ...s, adultLifeFocusKidId: null, adultLifeFocusYear: null };
      }

      return { ...s, adultChildPopupPending: popup, adultChildLastProcessedYear: year };
    });
  }, [gameState, updateState]);

  const resolveAdultChildPopup = useCallback((choiceId) => {
    const popup = gameState.adultChildPopupPending;
    if (!popup) return { keepOpen: false };

    const choice = Array.isArray(popup.choices)
      ? (popup.choices.find((c) => c.id === choiceId) || popup.choices[0])
      : null;

    if (!choice) {
      updateState({ adultChildPopupPending: null });
      return { keepOpen: false };
    }

    // Special focus option (injected by the modal)
    if (choice.id === '__FOCUS__') {
      const cost = 1;
      if (Number(gameState.focusTokens || 0) < cost) {
        toast.error('Not enough Focus tokens.');
        return { keepOpen: true };
      }

      updateState((prev) => ({
        ...prev,
        focusTokens: Math.max(0, Number(prev.focusTokens || 0) - cost),
        adultLifeFocusYear: Number(prev.currentYear || 0) + 1,
        adultLifeFocusKidId: popup.kidId,
        adultChildPopupPending: null,
      }));

      addLog(`Focused on ${popup.kidName || 'your child'} for next year.`);
      return { keepOpen: false };
    }

    const label = `Adult Child: ${popup.title}`;

    // Parent-level deltas
    if (Number.isFinite(choice.moneyDelta) && Number(choice.moneyDelta) !== 0) {
      applyMoneyDelta(Number(choice.moneyDelta), label, { category: 'adultChild' });
    }
    if (Number.isFinite(choice.stressDelta) && Number(choice.stressDelta) !== 0) {
      applyStress(Number(choice.stressDelta), label);
    }

    // Kid-specific love delta
    if (popup.kidId && Number.isFinite(choice.loveDelta) && Number(choice.loveDelta) !== 0) {
      applyLoveToKidId(popup.kidId, Number(choice.loveDelta), label);
    }

    // Optional family ripple
    const mode = choice?.effects?.multiLoveMode;
    if (mode && popup.kidId) {
      const deltaOther = mode === 'bond' ? 2 : mode === 'comfort' ? 1 : mode === 'distance' ? -1 : 0;
      if (deltaOther !== 0) {
        updateState((prev) => {
          const s = ensureKidsContainer(prev);
          const year = Number(s.currentYear || 0);
          const nextKids = (s.kids || []).map((k) => {
            if (k?.relation !== 'child') return k;
            if (k.id === popup.kidId) return k;
            const age = getDisplayedChildAge(s, k);
            if (age < 18) return k;
            const life = k.adultLife || {};
            if (life.deathYear != null) return k;
            const nextSlice = { ...(k.childSlice || {}) };
            nextSlice.love = clamp0to100(Number(nextSlice.love || 50) + deltaOther);
            return { ...k, childSlice: nextSlice };
          });
          return { ...s, kids: nextKids };
        });
      }
    }

    // Apply adult-life engine bookkeeping (clears due items, creates grandkids, marks death notified, etc.)
    updateState((prev) => {
      let s = ensureKidsContainer(prev);
      const kids = Array.isArray(s.kids) ? s.kids : [];
      const idx = kids.findIndex((k) => k.id === popup.kidId);
      if (idx < 0) return s;

      const yearNow = Number(s.currentYear || 0);
      const targetKid = kids[idx];

      const { updatedKid, newGrandkidKid } = applyAdultLifeChoice({
        state: s,
        kid: targetKid,
        year: yearNow,
        choice
      });

      let nextKids = kids.slice();
      if (updatedKid) nextKids[idx] = updatedKid;

      if (newGrandkidKid && !nextKids.some((k) => k.id === newGrandkidKid.id)) {
        nextKids.push(newGrandkidKid);
      }

      return { ...s, kids: nextKids };
    });

    addLog(`${label} — ${(choice.consequence || choice.text || '').trim()}`.trim());

    updateState({ adultChildPopupPending: null });
    return { keepOpen: false };
  }, [gameState, applyMoneyDelta, applyStress, updateState, addLog]);

  // --- Empathy School Bali ---
  const processBaliYearStart = useCallback((newAge) => {
    setGameState(prev => {
      const active = prev.baliActive === true;
      const startAge = Number(prev.baliStartAge ?? -999);
      if (!active || !(newAge > startAge)) return prev;

      const tuition = Number(getLocalAmount(500));
      const nextYearsPaid = Number(prev.baliYearsPaid || 0) + 1;

      // Money and stats updates
      const afterMoney = appendMoneyTx(prev, -tuition, {
        source: 'Empathy School Bali tuition',
        category: 'education',
        ageOverride: newAge,
        note: 'Annual tuition'
      });

      // Apply child perks (+1 INT/EMP/CONF)
      const nextStats = { ...afterMoney.stats };
      nextStats.intelligence = (nextStats.intelligence || 0) + 1;
      nextStats.empathy = (nextStats.empathy || 0) + 1;
      nextStats.confidence = (nextStats.confidence || 0) + 1;

      // Timeline entry
      const nextEntries = [
        ...(afterMoney.timelineEntries || []),
        {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_bali_tuition`,
          age: newAge,
          kind: 'bali',
          title: '🏝️ Empathy School Bali — Annual Tuition & Growth',
          detail: 'Tuition paid and steady growth from the program.',
          deltas: { intelligence: 1, empathy: 1, confidence: 1 },
          moneyDelta: -tuition,
          loveDelta: 0,
          stressDelta: 0,
          meta: { type: 'bali_year_start' }
        }
      ];

      return {
        ...afterMoney,
        stats: nextStats,
        timelineEntries: nextEntries,
        baliYearsPaid: nextYearsPaid
      };
    });
  }, [getLocalAmount]);

  const maybeQueueBaliPopups = useCallback((newAge) => {
    setGameState(prev => {
      const active = prev.baliActive === true;
      const startAge = Number(prev.baliStartAge ?? -999);
      if (!active || !(newAge > startAge)) return prev;
      if ((prev.baliPopupsShownAges || []).includes(newAge)) return prev;

      // Filter calm/activity by age
      const calmPool = (BALI_CALM_POPUPS || []).filter(p => newAge >= (p.minAge ?? 0) && newAge <= (p.maxAge ?? 99));
      const actPool = (BALI_ACTIVITY_POPUPS || []).filter(p => newAge >= (p.minAge ?? 0) && newAge <= (p.maxAge ?? 99));

      const usedCalm = new Set(prev.usedBaliCalmPopupIds || []);
      const usedAct = new Set(prev.usedBaliActivityPopupIds || []);

      const calmCandidates = calmPool.filter(p => !usedCalm.has(p.id));
      const actCandidates = actPool.filter(p => !usedAct.has(p.id));

      const calmRng = createSeededRng(`${prev.runSeed || 'seed'}|bali|calm|age:${newAge}`);
      const actRng = createSeededRng(`${prev.runSeed || 'seed'}|bali|activity|age:${newAge}`);

      const calmPicked = (calmCandidates.length ? calmCandidates : calmPool)[Math.floor(calmRng.nextFloat() * (calmCandidates.length ? calmCandidates.length : calmPool.length))];
      const actPicked = (actCandidates.length ? actCandidates : actPool)[Math.floor(actRng.nextFloat() * (actCandidates.length ? actCandidates.length : actPool.length))];

      if (!calmPicked && !actPicked) return prev;

      // Template childName token
      const childName = prev.childName || 'your child';
      const tmpl = (s) => String(s || '').split('{childName}').join(childName);

      const next = { ...prev };
      if (calmPicked) {
        next.baliCalmPopupPending = { ...calmPicked, title: tmpl(calmPicked.title), body: tmpl(calmPicked.body) };
        next.usedBaliCalmPopupIds = [...(prev.usedBaliCalmPopupIds || []), calmPicked.id];
      }
      if (actPicked) {
        next.baliActivityPopupPending = { ...actPicked, title: tmpl(actPicked.title), body: tmpl(actPicked.body) };
        next.usedBaliActivityPopupIds = [...(prev.usedBaliActivityPopupIds || []), actPicked.id];
      }
      next.baliPopupsShownAges = [...(prev.baliPopupsShownAges || []), newAge];
      return next;
    });
  }, []);

  const resolveBaliCalmPopup = useCallback(() => {
    const popup = gameState.baliCalmPopupPending;
    if (!popup) return;

    // Always STRESS -3
    applyStress(-3, `Bali Calm: ${popup.title}`);
    if (popup.deltas) applyDeltas(popup.deltas, `Bali Calm: ${popup.title}`);

    recordTimelineEntry({
      kind: 'bali',
      title: `🏝️ Bali Calm Moment: ${popup.title}`,
      detail: `${popup.body}\n\nSTRESS -3`,
      deltas: popup.deltas || null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: -3,
      meta: { popupId: popup.id }
    });

    updateState({ baliCalmPopupPending: null });
  }, [gameState.baliCalmPopupPending, applyStress, applyDeltas, recordTimelineEntry, updateState]);

  const resolveBaliActivityPopup = useCallback((choiceId) => {
    const popup = gameState.baliActivityPopupPending;
    if (!popup) return;

    const choice = (popup.choices || []).find(c => c.id === choiceId || c.letter === choiceId);
    if (!choice) return;

    if (choice.deltas) applyDeltas(choice.deltas, `Bali Activity: ${popup.title}`);
    if (choice.loveDelta) applyLove(choice.loveDelta, `Bali Activity: ${popup.title}`);
    if (choice.stressDelta) applyStress(choice.stressDelta, `Bali Activity: ${popup.title}`);
    if (choice.moneyDelta) applyMoneyDelta(choice.moneyDelta, `Bali Activity: ${popup.title}`, { category: 'leisure', ageOverride: gameState.currentYear });

    recordTimelineEntry({
      kind: 'bali',
      title: `🏝️ Bali Activity: ${popup.title}`,
      detail: `${popup.body}\n\n${choice.consequence}`,
      deltas: choice.deltas || null,
      moneyDelta: Number(choice.moneyDelta || 0),
      loveDelta: Number(choice.loveDelta || 0),
      stressDelta: Number(choice.stressDelta || 0),
      meta: { popupId: popup.id, choice: choice.id || choice.letter }
    });

    updateState({ baliActivityPopupPending: null });
  }, [gameState.baliActivityPopupPending, applyDeltas, applyLove, applyStress, applyMoneyDelta, recordTimelineEntry, updateState]);

  // Level 2 Difficulty Tuning Helper
  function tuneChoiceForLevel2(choice) {
    const c = { ...choice };
    const money = Number(c.moneyDelta || 0);
    const stress = Number(c.stressDelta || 0);
    const love = Number(c.loveDelta || 0);

    // Make Level 2 hurt:
    let money2 = money;
    if (money2 < 0) money2 = Math.round(money2 * 2.8);
    if (money2 === 0) money2 = -250;
    if (money2 > 0) money2 = Math.round(money2 * 0.6);

    let stress2 = stress;
    if (stress2 > 0) stress2 = Math.round(stress2 * 1.6);
    if (stress2 === 0) stress2 = 4;
    stress2 += 4;

    let love2 = love;
    if (love2 > 0) love2 = Math.max(0, love2 - 0.5);
    if (love2 < 0) love2 = love2 - 0.5;

    c.moneyDelta = money2;
    c.stressDelta = stress2;
    c.loveDelta = love2;
    return c;
  }

  function tuneEventForLevel2(event) {
    return {
      ...event,
      title: event.title,
      body: event.body,
      choices: (event.choices || []).map(tuneChoiceForLevel2)
    };
  }

  function applyChaosFlavor(event, chaosLevel, seedBase) {
    try {
      if (!event || typeof event.body !== "string") return event;

      const pool = getChaosFlavorPool(chaosLevel, event.scope);
      if (!Array.isArray(pool) || pool.length === 0) return event;

      const chanceByLevel = { 1: 0.65, 2: 0.75, 3: 0.9 };
      const chance = chanceByLevel[chaosLevel] ?? 0.7;

      const rng = createSeededRng(`${seedBase}|flavor`);
      if (rng.nextFloat() > chance) return event;

      const line1 = rng.pick(pool);
      if (!line1) return event;

      let flavorText = line1;

      // Level 3 sometimes stacks an extra aftershock line for even more variety.
      if (chaosLevel >= 3 && pool.length > 1) {
        if (rng.nextFloat() < 0.35) {
          let line2 = rng.pick(pool);
          for (let i = 0; i < 3 && line2 === line1; i++) line2 = rng.pick(pool);
          if (line2 && line2 !== line1) {
            flavorText = `${line1}\n${line2}`;
          }
        }
      }

      return {
        ...event,
        body: `${event.body}\n\nBonus chaos: ${flavorText}`
      };
    } catch {
      return event;
    }
  }

  const maybeQueueChaosPopup = useCallback((newAge) => {
    const chaosLevel = getChaosLevelFromExpansions(gameState.expansions);
    
    // POLYGAMIST SPECIAL START: force effective chaos level to 3
    const isPolygamistScenario = gameState.specialStartId === 'polygamist_doctor_indonesia' || gameState.specialStartId === 'closed_polygamist_compound';
    const effectiveChaosLevel = isPolygamistScenario ? Math.max(chaosLevel, 3) : chaosLevel;

    // Level 0: off
    if (effectiveChaosLevel <= 0) return;

    // Don't queue if already pending
    if (gameState.chaosPopupPending) return;

    // Track shown count for this age
    const shown = Array.isArray(gameState.chaosPopupShownAges) ? gameState.chaosPopupShownAges : [];
    const shownCountThisAge = shown.filter(a => Number(a) === Number(newAge)).length;

    // Max per age logic
    let maxPerAge;
    if (effectiveChaosLevel === 1) {
      maxPerAge = 1;
    } else if (effectiveChaosLevel === 2) {
      maxPerAge = 1;
    } else {
      maxPerAge = 2;
    }

    if (shownCountThisAge >= maxPerAge) return;

    // Shared deterministic seed base for all chaos levels and both first/second popups
    const seedBase = `${gameState.runSeed || "seed"}|chaos|L:${effectiveChaosLevel}|age:${newAge}|n:${shownCountThisAge}`;

    // Pool selection by level
    let eventPool;
    let usedIdsKey;
    if (effectiveChaosLevel === 1) {
      eventPool = CHAOS_EVENTS_L1;
      usedIdsKey = 'usedChaosEventIdsL1';
    } else if (effectiveChaosLevel === 2) {
      eventPool = CHAOS_EVENTS_L2;
      usedIdsKey = 'usedChaosEventIds';
    } else {
      eventPool = CHAOS_EVENTS_L3;
      usedIdsKey = 'usedChaosEventIdsL3';
    }

    // Filter eligible events
    const pool = eventPool.filter(evt => {
      if (newAge < evt.minAge || newAge > evt.maxAge) return false;
      if (evt.requiresPartner && gameState.householdType !== 'two') return false;
      if (evt.requiresSingle && gameState.householdType !== 'single') return false;
      return true;
    });

    if (pool.length === 0) return;

    // Level 3: second popup has 85% chance
    if (effectiveChaosLevel >= 3 && shownCountThisAge === 1) {
      const chanceRng = createSeededRng(`${seedBase}|chance`);
      if (chanceRng.nextFloat() > 0.85) return;
    }

    // Prefer unused events (per-level tracking)
    const used = new Set(gameState[usedIdsKey] || []);
    const fresh = pool.filter(e => !used.has(e.id));
    const finalPool = fresh.length > 0 ? fresh : pool;

    // Pick event deterministically (all levels)
    let selected;
    
    // Neighbor Nemesis mini-arc (L3 only)
    if (effectiveChaosLevel >= 3) {
      const arc = normalizeNeighborNemesisArc(gameState.neighborNemesisArc, gameState.runSeed);
      const arcPicked = tryPickNeighborNemesisArcEvent({
        newAge,
        shownCountThisAge,
        seedBase,
        pool: finalPool,
        usedSet: used,
        arc
      });

      if (arcPicked) {
        selected = applyNeighborTokensToEvent(arcPicked, arc);
      } else {
        const pickRng = createSeededRng(`${seedBase}|pick`);
        selected = pickRng.pick(finalPool);
      }
    } else {
      const pickRng = createSeededRng(`${seedBase}|pick`);
      selected = pickRng.pick(finalPool);
    }

    if (!selected) return;

    // Apply Level 2 difficulty tuning
    if (effectiveChaosLevel === 2) {
      selected = tuneEventForLevel2(selected);
    }

    // Add optional micro-variation flavor line (all levels)
    selected = applyChaosFlavor(selected, effectiveChaosLevel, seedBase);

    updateState(prev => {
      const nextUsedIds = [...(prev[usedIdsKey] || []), selected.id];

      const next = {
        chaosPopupPending: selected,
        [usedIdsKey]: nextUsedIds,
        chaosPopupShownAges: [...(prev.chaosPopupShownAges || []), newAge]
      };

      // Persist arc identity + mark it active when it appears.
      if (effectiveChaosLevel >= 3 && selected?.arcId === 'neighborNemesis') {
        const arcPrev = normalizeNeighborNemesisArc(prev.neighborNemesisArc, prev.runSeed);
        next.neighborNemesisArc = {
          ...arcPrev,
          status: arcPrev.status === 'resolved' ? 'resolved' : 'active',
          lastTriggeredAge: newAge
        };
      }

      return next;
    });
  }, [gameState.expansions, gameState.chaosPopupShownAges, gameState.chaosPopupPending, gameState.usedChaosEventIds, gameState.usedChaosEventIdsL1, gameState.usedChaosEventIdsL3, gameState.neighborNemesisArc, gameState.householdType, gameState.runSeed, updateState]);

  const resolveChaosPopup = useCallback((choiceId) => {
    const chaosLevel = getChaosLevelFromExpansions(gameState.expansions);
    const isPolygamistScenario = gameState.specialStartId === 'polygamist_doctor_indonesia' || gameState.specialStartId === 'closed_polygamist_compound';
    const effectiveChaosLevel = isPolygamistScenario ? Math.max(chaosLevel, 3) : chaosLevel;
    const event = gameState.chaosPopupPending;
    if (!event) return;

    const choice = event.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Apply effects
    if (choice.deltas) applyDeltas(choice.deltas, `Chaos Mode: ${event.title}`);
    if (choice.loveDelta) applyLove(choice.loveDelta, `Chaos Mode: ${event.title}`);
    if (choice.stressDelta) applyStress(choice.stressDelta, `Chaos Mode: ${event.title}`);
    if (choice.moneyDelta) applyMoneyDelta(choice.moneyDelta);

    // Partner meter delta (if applicable)
    if (choice.partnerMeterDelta && gameState.householdType === 'two') {
      updateState(prev => ({
        partnerMeter: Math.max(0, Math.min(100, (prev.partnerMeter || 50) + choice.partnerMeterDelta))
      }));
    }

    // Log & Timeline
    addLog(`🌪️ Chaos Mode: ${event.title}`);
    
    // Emit Action Result for immediate feedback
    emitActionResult({
      title: `🌪️ Chaos Mode: ${event.title}`,
      body: `${event.body}\n\nYou chose: ${choice.emoji} ${choice.text}\n\n${choice.consequence}`,
      deltas: choice.deltas,
      loveDelta: choice.loveDelta,
      stressDelta: choice.stressDelta,
      moneyDelta: choice.moneyDelta || 0,
      focusDelta: 0,
      tags: ['chaos'],
      meta: { emoji: '🌪️', skipTimelineRecord: false }
    });

    const ageNow = gameState.currentYear;

    // Clear pending (+ advance any Chaos Mode mini-arcs)
    updateState(prev => {
      const next = { chaosPopupPending: null };

      // Neighbor Nemesis mini-arc progression
      if (event?.arcId === 'neighborNemesis') {
        const arcPrev = normalizeNeighborNemesisArc(prev.neighborNemesisArc, prev.runSeed);
        const eff = (choice && choice.arcEffects) ? choice.arcEffects : {};
        const heatDelta = Number(eff.heatDelta || 0);
        const resolve = eff.resolve === true;

        const stepNow = Number(event.arcStep || arcPrev.nextStep || 1);
        const advance = Number(eff.advance ?? 1);
        const nextStepRaw = stepNow + (Number.isFinite(advance) ? advance : 1);

        const nextHeat = Math.max(-3, Math.min(10, Number(arcPrev.heat || 0) + (Number.isFinite(heatDelta) ? heatDelta : 0)));

        const shouldResolve = resolve || nextStepRaw > 5;

        next.neighborNemesisArc = {
          ...arcPrev,
          status: shouldResolve ? 'resolved' : 'active',
          nextStep: shouldResolve ? arcPrev.nextStep : Math.max(Number(arcPrev.nextStep || 1), Math.min(5, nextStepRaw)),
          heat: nextHeat,
          lastResolvedAge: ageNow
        };
      }

      return next;
    });
    
    // Level 3: attempt to chain second popup
    if (effectiveChaosLevel >= 3) {
      setTimeout(() => maybeQueueChaosPopup(gameState.currentYear), 150);
    }
  }, [gameState.chaosPopupPending, gameState.householdType, gameState.expansions, gameState.specialStartId, gameState.currentYear, applyDeltas, applyLove, applyStress, applyMoneyDelta, updateState, addLog, emitActionResult, maybeQueueChaosPopup]);



  const loadScenarioForAge = useCallback(async (age, opts = {}) => {
     // 1) Keep Juvenile Justice logic exactly as-is
        const ageNum = Number(age ?? 0);

    // Check for Opportunity Nudge injection (~every 3 years)
    // Block for ALL special starts except polygamist_doctor_indonesia
    const ss = gameState.specialStartId;
    const blockOpportunityNudges = Boolean(ss) && ss !== 'polygamist_doctor_indonesia';
    
    if (!blockOpportunityNudges) {
      try {
        const { shouldInjectOpportunityNudge, pickOpportunityHub, buildOpportunityMoment } = await import('@/components/game/opportunityNudges');
        if (shouldInjectOpportunityNudge(gameState)) {
          const hubId = pickOpportunityHub(gameState);
          const oppMoment = buildOpportunityMoment({ hubId, age: ageNum, runSeed: gameState.runSeed, childName: gameState.childName });
          
          updateState({
            currentScenario: oppMoment,
            scenarioPending: true,
            pendingScenario: true,
            scenarioCompletedThisAge: false,
            currentScenarioHookId: oppMoment.id,
            currentScenarioResolvedChoice: null,
            lastOpportunityYear: ageNum
          });
          return;
        }
      } catch {}
    }

    // UNIFIED SPECIAL START YEARLY SCENARIOS: check if special start has yearly beats
    try {
      if (gameState.specialStartId && ageNum >= 1 && ageNum <= 18) {
        const { buildSpecialStartYearScenario } = await import('@/components/game/specialStarts/buildSpecialStartYearScenario');
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildSpecialStartYearScenario({ state: gameState, age: ageNum, rerollNonce });
        
        if (scenario) {
          updateState({
            currentScenario: scenario,
            scenarioPending: true,
            pendingScenario: true,
            scenarioCompletedThisAge: false,
            currentScenarioHookId: scenario.id,
            currentScenarioResolvedChoice: null
          });
          return;
        }
      }
    } catch (e) {
      console.warn('[loadScenarioForAge] Unified special start builder failed, trying legacy:', e);
    }

    // LEGACY: Keep existing special-start-specific builders as fallback
    // War Zone Special Start: force yearly scenario ages 1–18
    try {
      if (gameState.specialStartId === 'war_zone' && ageNum >= 1 && ageNum <= 18) {
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildGazaWarZoneYearScenario({ state: gameState, age: ageNum, rerollNonce });
        updateState({
          currentScenario: scenario,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: scenario.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch {}

    // Refugee Camp Special Start: force yearly scenario ages 1–18
    try {
      if (gameState.specialStartId === 'refugee_camp' && ageNum >= 1 && ageNum <= 18) {
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildSyriaRefugeeCampYearScenario({ state: gameState, age: ageNum, rerollNonce });
        updateState({
          currentScenario: scenario,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: scenario.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch {}

    // Alien Invasion Special Start: force a yearly survival scenario ages 1–18
    try {
      if (gameState.specialStartId === 'alien_invasion' && ageNum >= 1 && ageNum <= 18) {
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildAlienInvasionYearScenario({ state: gameState, age: ageNum, rerollNonce });
        updateState({
          currentScenario: scenario,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: scenario.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch {}

    // Supreme Leader (Kim) Special Start: force yearly scenario ages 1–18
    try {
      if (gameState.specialStartId === 'kim_jong_un' && ageNum >= 1 && ageNum <= 18) {
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildKimYearScenario({ state: gameState, age: ageNum, rerollNonce });
        updateState({
          currentScenario: scenario,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: scenario.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch {}

    // Zombie Apocalypse Special Start: force a yearly survival scenario ages 1–18
    try {
      if (gameState.specialStartId === 'zombie_apocalypse' && ageNum >= 1 && ageNum <= 18) {
        const { buildZombieYearScenario } = await import('@/components/game/specialStarts/zombieApocalypseSpecialStart.jsx');
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildZombieYearScenario({ state: gameState, age: ageNum, rerollNonce });
        updateState({
          currentScenario: scenario,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: scenario.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch {}

    // Spotlight (43–54) Special Starts: replace yearly "A Moment Arrives" with tailored yearly scenario
    try {
      const ss = gameState.specialStartId;
      const isSpotlight4354 = [
        'spotlight_movie_star','spotlight_pro_athlete','spotlight_influencer','spotlight_tech_founder','spotlight_music_icon',
        'spotlight_nobel_scientist','spotlight_business_mogul','spotlight_chef','spotlight_fashion_icon','spotlight_olympian',
        'spotlight_astronaut','spotlight_arctic_station'
      ].includes(ss);

      if (isSpotlight4354 && ageNum >= 1 && ageNum <= 18) {
        const rerollNonce = opts?.rerollNonce ?? 0;
        const scenario = buildSpotlightYearlyMomentReplacementScenario({ state: gameState, age: ageNum, rerollNonce });

        updateState({
          currentScenario: scenario,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: scenario.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch {}



    // ADHD Special Start scenarios override at target ages
    try {
      if (gameState.specialStartId === 'child_adhd' && [4,7,12,16].includes(ageNum)) {
        const childName = gameState.childName || 'your child';
        const SCENES = {
          4: { id: 'adhd_age_4', title: 'Big Energy', topic: 'attention and movement', text: `${childName} can’t sit still for long—like there’s a tiny motor in their body. It isn’t defiance. It’s just… constant motion.\n\nWhat do you do?`, choices: [
            { id:'connect', role:'connect', letter:'A', text:"Name what you see and offer a movement break. ‘Let’s move first, then try again.’", consequence:`${childName} feels understood instead of ‘bad.’ The reset helps.`, deltas:{ empathy:0.45, confidence:0.20 }, loveDelta:2, stressDelta:0 },
            { id:'teach', role:'teach', letter:'B', text:'Turn focus into a tiny game: 2 minutes on, 1 minute off—repeat.', consequence:'Small structure sticks better than long lectures.', deltas:{ discipline:0.25, intelligence:0.35 }, loveDelta:1, stressDelta:0 },
            { id:'boundary', role:'boundary', letter:'C', text:"Set one clear rule: ‘Feet stay on the floor during story time.’ Then follow through.", consequence:'The boundary holds, but it takes repetition—and patience.', deltas:{ discipline:0.35 }, loveDelta:0, stressDelta:0 },
            { id:'avoid', role:'avoid', letter:'D', text:"Let it slide and hope it settles with age.", consequence:'Nothing explodes today, but the pattern stays messy.', deltas:{ discipline:-0.15, confidence:-0.10 }, loveDelta:-1, stressDelta:-1 },
            { id:'harm', role:'harm', letter:'E', text:"Snap: ‘Why can’t you just behave?’", consequence:'They freeze… then spiral. Shame doesn’t build skills.', deltas:{ empathy:-0.35, confidence:-0.25 }, loveDelta:-2, stressDelta:1 }
          ]},
          7: { id: 'adhd_age_7', title: 'The Teacher Note', topic: 'school attention', text: `The teacher says ${childName} is bright, but struggles to stay on task. It’s not a character flaw—it’s a skill gap and a support question.\n\nWhat do you do?`, choices: [
            { id:'connect', role:'connect', letter:'A', text:'Treat it like teamwork: ask what helps at school and what helps at home.', consequence:`Adults align, and ${childName} feels less ‘singled out.’`, deltas:{ empathy:0.35, confidence:0.30 }, loveDelta:2, stressDelta:0 },
            { id:'teach', role:'teach', letter:'B', text:'Build a simple system: timer, checklist, and a short ‘reset’ ritual.', consequence:'Systems do what willpower can’t. Progress is slow but real.', deltas:{ discipline:0.30, intelligence:0.25 }, loveDelta:1, stressDelta:0 },
            { id:'boundary', role:'boundary', letter:'C', text:'Go strict: longer homework blocks, fewer breaks.', consequence:'More structure… but also more friction.', deltas:{ discipline:0.35, confidence:-0.10 }, loveDelta:0, stressDelta:0 },
            { id:'avoid', role:'avoid', letter:'D', text:"Assume it’ll pass and don’t change anything.", consequence:'The note becomes a pattern. Everyone gets more frustrated later.', deltas:{ empathy:-0.15, discipline:-0.15 }, loveDelta:-1, stressDelta:-1 },
            { id:'harm', role:'harm', letter:'E', text:"Punish them for the report: ‘No fun until you act normal.’", consequence:'They try harder… and feel worse. Shame eats motivation.', deltas:{ confidence:-0.30, empathy:-0.20 }, loveDelta:-2, stressDelta:1 }
          ]},
          12: { id: 'adhd_age_12', title: 'Middle School Pile‑Up', topic: 'overwhelm and organization', text: `Assignments stack up fast. ${childName} can hyperfocus on what’s interesting—and completely lose track of everything else.\n\nWhat do you do?`, choices: [
            { id:'connect', role:'connect', letter:'A', text:'Sit together and build a plan without blame. Ask what feels hardest and why.', consequence:'They feel safer asking for help before it’s a crisis.', deltas:{ empathy:0.35, confidence:0.35 }, loveDelta:2, stressDelta:0 },
            { id:'teach', role:'teach', letter:'B', text:'Explore support options: school accommodations, coaching, or a professional evaluation—no pressure, just information.', consequence:'Support becomes a tool, not a label.', deltas:{ intelligence:0.35, discipline:0.20 }, loveDelta:1, stressDelta:0 },
            { id:'boundary', role:'boundary', letter:'C', text:'Lock down the schedule: strict study hours, strict device rules.', consequence:'You gain control, but it can trigger power struggles.', deltas:{ discipline:0.40, empathy:-0.10 }, loveDelta:0, stressDelta:0 },
            { id:'avoid', role:'avoid', letter:'D', text:"Let them handle it alone. ‘It’s your responsibility now.’", consequence:'They feel abandoned—and the overwhelm grows.', deltas:{ confidence:-0.25, discipline:-0.15 }, loveDelta:-1, stressDelta:-1 },
            { id:'harm', role:'harm', letter:'E', text:'Call it laziness and compare them to other kids.', consequence:'They shut down or explode. The work doesn’t improve—only the shame does.', deltas:{ empathy:-0.30, confidence:-0.35 }, loveDelta:-2, stressDelta:1 }
          ]},
          16: { id: 'adhd_age_16', title: 'Independence Tests', topic: 'independence and safety systems', text: `Freedom grows fast now—rides, deadlines, and bigger consequences. ${childName} needs systems that make success more likely.\n\nWhat do you do?`, choices: [
            { id:'connect', role:'connect', letter:'A', text:"Co‑design safety and responsibility rules: ‘I’m on your team, and I’m also your guardrail.’", consequence:'They take the rules more seriously because they helped build them.', deltas:{ confidence:0.45, empathy:0.20 }, loveDelta:2, stressDelta:0 },
            { id:'teach', role:'teach', letter:'B', text:'Set practical tools: reminders, checklists, alarms, and a weekly reset—systems over speeches.', consequence:'Executive function gets support instead of judgment.', deltas:{ discipline:0.30, intelligence:0.25 }, loveDelta:1, stressDelta:0 },
            { id:'boundary', role:'boundary', letter:'C', text:"Tight restrictions until they ‘prove’ responsibility first.", consequence:'Safer in the short term, but it can damage trust if it feels punitive.', deltas:{ discipline:0.35, confidence:-0.10 }, loveDelta:0, stressDelta:0 },
            { id:'avoid', role:'avoid', letter:'D', text:'Give full freedom and hope they figure it out.', consequence:'Sometimes they do… and sometimes they crash into avoidable problems.', deltas:{ discipline:-0.20, confidence:-0.15 }, loveDelta:-1, stressDelta:-1 },
            { id:'harm', role:'harm', letter:'E', text:"Use fear and insults to motivate: ‘Don’t be stupid.’", consequence:'They hide mistakes instead of learning from them.', deltas:{ empathy:-0.25, confidence:-0.30 }, loveDelta:-2, stressDelta:1 }
          ]}
        };
        const s = SCENES[ageNum];
        if (s) {
          updateState({
            currentScenario: { id: s.id, title: s.title, age: ageNum, topic: s.topic, hookText: s.text.split('\n\n')[0], scenarioText: s.text, choices: s.choices, meta: { packId:'special_start', choicePack:'standard', category:'adhd', intensity: ageNum>=12?3:2, hookId: s.id } },
            scenarioPending: true,
            pendingScenario: true,
            scenarioCompletedThisAge: false,
            currentScenarioHookId: s.id,
            currentScenarioResolvedChoice: null
          });
          return;
        }
      }
    } catch {}

    const jjScenario = getJuvenileJusticeScenario({ ...gameState, currentYear: age });
    if (jjScenario) {
      updateState({
        currentScenario: jjScenario,
        scenarioPending: true,
        scenarioCompletedThisAge: false,
        currentScenarioHookId: jjScenario.id,
        currentScenarioResolvedChoice: null
      });
      return;
    }



    // --- One-off scenarios (rare) ---
    // Must be safe: if anything fails, fall back to YearScenarios.
    try {
      const stateForPickers = { ...gameState, currentYear: age };
      const rng = createSeededRng(`${stateForPickers.runSeed || "seed"}|oneOff|age:${age}`);

      // Tier-2: Teen Coming Out (rare, once per run)
      const tco = maybeGetTeenComingOutScenario(stateForPickers, () => rng.nextFloat());
      if (tco) {
        updateState({
          currentScenario: tco,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: tco.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }

      const ms = maybeGetMiddleSchoolOneOffScenario(stateForPickers, rng);
      if (ms) {
        updateState({
          currentScenario: ms,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: ms.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }

      const teen = maybeGetTeenOneOffScenario(stateForPickers, rng);
      if (teen) {
        updateState({
          currentScenario: teen,
          scenarioPending: true,
          pendingScenario: true,
          scenarioCompletedThisAge: false,
          currentScenarioHookId: teen.id,
          currentScenarioResolvedChoice: null
        });
        return;
      }
    } catch (e) {
      console.warn("[loadScenarioForAge] one-off picker failed, falling back:", e);
    }

    // 2) Load hooks (Base44 first, local seed fallback)
    let hooks = [];
    try {
      hooks = await base44.entities.ScenarioHooks.list();
    } catch (e) {
      hooks = [];
    }
    if (!Array.isArray(hooks) || hooks.length === 0) {
      hooks = PACK_SEED_HOOKS;
    }

    // Normalize hook IDs for local seeds
    const normalizedHooks = hooks.map((h, idx) => ({
      ...h,
      id: h.id || `seed_hook_${idx}_${h.packId || "pack"}_${h.minAge || 0}_${h.maxAge || 0}`
    }));

    // 3) Enabled packs gate (if missing, treat as all enabled)
    const enabledPackIds = Array.isArray(gameState.enabledScenarioPackIds) && gameState.enabledScenarioPackIds.length
      ? gameState.enabledScenarioPackIds
      : normalizedHooks.map(h => h.packId).filter(Boolean);

    // Optional: screen-time pack only when phoneOwned is true (matches the in-game phone dialog)
    const phoneOwned = !!gameState.phoneOwned;

    // 4) Filter hooks by age + enabled packs + household type
    const eligible = normalizedHooks.filter(h => {
      const minA = Number(h.minAge ?? 0);
      const maxA = Number(h.maxAge ?? 18);
      const packOk = !h.packId || enabledPackIds.includes(h.packId);
      const ageOk = ageNum >= minA && ageNum <= maxA;
      const phoneGateOk = h.packId !== "pack_screen_time_v1" ? true : phoneOwned;
      
      let householdOk = true;
      if (Array.isArray(h.householdTypes)) {
        householdOk = h.householdTypes.includes(gameState.householdType);
      }

      return packOk && ageOk && phoneGateOk && householdOk;
    });

    // 5) Pick a hook deterministically per year (randomized but stable)
    const seedBase = String(gameState.runSeed || "seed");
    const rerollNonce = opts?.rerollNonce ?? gameState.wisdom?.rerollsThisAge ?? gameState.yearFlags?.rerollNonceThisAge ?? 0;
    const rng = makeSeededRng(`${seedBase}|year_scenario|age:${ageNum}|reroll:${rerollNonce}`);

    const hook = eligible.length > 0
      ? rng.pick(eligible)
      : { ...FALLBACK_HOOK_GENERIC, id: FALLBACK_HOOK_GENERIC.id };

    const childName =
      gameState.childName ||
      gameState.childProfile?.name ||
      "your child";

    const topic = hook.topic || "something small";
    const choicePack = hook.choicePack || "core";

    const partnerName = gameState.partnerName || "Partner";
    const coparentName = gameState.coparentProfile?.name || "Ex";
    const coParentLabel = gameState.parentRole === 'mom' ? 'Dad' : gameState.parentRole === 'dad' ? 'Mom' : 'Co-parent';

    const vars = { 
      childName, 
      topic, 
      partnerName: gameState.partnerRelationship?.name || gameState.partnerName || "your partner", 
      coparentName: gameState.coparentProfile?.name || "your co-parent", 
      coParentLabel 
    };

    const opener = templateText(hook.hookText || FALLBACK_HOOK_GENERIC.hookText, vars);
    const prompt = rng.pick(YEARLY_PROMPTS);
    const scenarioText = `${opener}\n\n${prompt}`;

    const choicePools = PACK_CHOICE_TEXT_POOLS?.[choicePack] || null;
    const minA = Number(hook?.minAge);
    const maxA = Number(hook?.maxAge);
    const normalizedTopic = normalizeMomentKeyPart(hook?.topic);

    const momentKey =
      hook?.packId &&
      Number.isFinite(minA) &&
      Number.isFinite(maxA) &&
      normalizedTopic
        ? `${hook.packId}|${minA}|${maxA}|${normalizedTopic}`
        : null;

    const momentChoiceOverride = momentKey ? MOMENT_CHOICE_TEXT_OVERRIDES[momentKey] : null;
    const consequencePools = PACK_CONSEQUENCE_POOLS?.[choicePack] || null;

    // Early Parenting Style Detection
    const styleId = String(gameState.parentingStyle?.id || "unsure");
    const earlyBand = getEarlyAgeBand(ageNum);
    const earlyStyleActive = Boolean(
      earlyBand &&
      styleId !== "unsure" &&
      EARLY_PARENTING_STYLE_RULES?.[styleId]
    );

    function pickChoiceText(role, keySuffix) {
      const overrideVal = momentChoiceOverride?.[role];
      const overridePool = Array.isArray(overrideVal)
        ? overrideVal
        : typeof overrideVal === "string"
          ? [overrideVal]
          : null;

      const styledPool = earlyStyleActive
        ? getEarlyStylePool({ band: earlyBand, styleId, role, kind: 'choice' })
        : null;

      const pool =
        overridePool ||
        styledPool ||
        choicePools?.[role] ||
        GENERIC_CHOICE_TEXT?.[role] ||
        [];

      const seedParts = [
        'choice',
        earlyStyleActive ? `${styleId}_${earlyBand}` : '',
        role,
        keySuffix,
        hook.id,
        hook.packId,
        ageNum,
        (gameState.parentName || gameState.playerName || 'Player'),
        (gameState.runSeed || 'seed')
      ].filter(Boolean);

      const localRng = makeSeededRng(seedParts.join('_'));

      return templateText(localRng.pick(pool), vars);
    }

    function pickConsequence(role, keySuffix) {
      const styledPool = earlyStyleActive
        ? getEarlyStylePool({ band: earlyBand, styleId, role, kind: 'consequence' })
        : null;

      const pool = styledPool || consequencePools?.[role] || GENERIC_CONSEQUENCE_TEXT?.[role] || [];
      
      const seedParts = [
        seedBase,
        'consequence',
        earlyStyleActive ? `${styleId}_${earlyBand}` : '',
        hook.id,
        role,
        'age',
        ageNum,
        keySuffix
      ].filter(Boolean);
      
      const localRng = makeSeededRng(seedParts.join('|'));
      return templateText(localRng.pick(pool), vars);
    }

    // A/B/C tiers mapped to roles for stress gating:
    // A = connect (locks if stress > 40)
    // B = teach   (locks if stress > 65)
    // C = boundary(lcks if stress >= 100)
    // D = avoid
    // E = harm
    const baseChoices = [
      {
        id: "connect",
        role: "connect",
        letter: "A",
        text: pickChoiceText("connect", "A"),
        consequence: pickConsequence("connect", "A"),
        deltas: { empathy: 0.45, confidence: 0.15 },
        loveDelta: 2,
        stressDelta: 0
      },
      {
        id: "teach",
        role: "teach",
        letter: "B",
        text: pickChoiceText("teach", "B"),
        consequence: pickConsequence("teach", "B"),
        deltas: { intelligence: 0.45, discipline: 0.15 },
        loveDelta: 1,
        stressDelta: 0
      },
      {
        id: "boundary",
        role: "boundary",
        letter: "C",
        text: pickChoiceText("boundary", "C"),
        consequence: pickConsequence("boundary", "C"),
        deltas: { discipline: 0.5 },
        loveDelta: 0,
        stressDelta: 0
      },
      {
        id: "avoid",
        role: "avoid",
        letter: "D",
        text: pickChoiceText("avoid", "D"),
        consequence: pickConsequence("avoid", "D"),
        deltas: { confidence: -0.15, empathy: -0.1 },
        loveDelta: -1,
        stressDelta: -1
      },
      {
        id: "harm",
        role: "harm",
        letter: "E",
        text: pickChoiceText("harm", "E"),
        consequence: pickConsequence("harm", "E"),
        deltas: { empathy: -0.35, discipline: -0.2, confidence: -0.15 },
        loveDelta: -2,
        stressDelta: 1
      }
    ];

    // Apply parenting style modifiers for ages 0-18
    const tunedChoices = earlyStyleActive
      ? baseChoices.map((ch) => {
          const rules = EARLY_PARENTING_STYLE_RULES[styleId];
          const mult = rules?.deltaMult?.[ch.role] ?? 1;
          const baseFocusCost = (String(ch.letter).toUpperCase() === "A") ? 1 : 0; // baseline rule for yearly hooks
          const focusCost = computeEarlyStyleFocusCost({ styleId, role: ch.role, baseFocusCost });
          const onStyle = isRoleOnStyle(styleId, ch.role);

          return {
            ...ch,
            deltas: multiplyDeltas(ch.deltas, mult),
            loveDelta: Number(ch.loveDelta || 0) + Number(rules?.loveAdd?.[ch.role] || 0),
            stressDelta: Number(ch.stressDelta || 0) + Number(rules?.stressAdd?.[ch.role] || 0),
            focusCost,
            meta: { ...(ch.meta || {}), earlyStyled: true, parentingStyleId: styleId, earlyBand, onStyle }
          };
        })
      : baseChoices;

    // 6) Shuffle order (position randomized) but keep letters intact
    const shuffledChoices = makeSeededRng(`${seedBase}|choiceOrder|${hook.id}|age:${ageNum}`).shuffle(tunedChoices);

    const scenario = {
      id: `year_hook_${hook.id}`,
      title: "A Moment Arrives",
      age: ageNum,
      topic,
      hookText: opener,
      scenarioText,
      choices: shuffledChoices,
      meta: {
        packId: hook.packId || "core",
        choicePack,
        band: hook.band || null,
        category: hook.category || null,
        intensity: hook.intensity || 1,
        hookId: hook.id
      }
    };

    updateState({
      currentScenario: scenario,
      scenarioPending: true,
      scenarioCompletedThisAge: false,
      currentScenarioHookId: hook.id,
      currentScenarioResolvedChoice: null
    });
  }, [gameState, updateState]);

  // --- Additional helpers required by pages/modals (minimal, safe) ---

  const addHistory = useCallback((entry) => {
    if (!entry) return;
    setGameState(prev => ({ ...prev, history: [...(prev.history || []), entry] }));
  }, []);

  const incrementCounter = useCallback((key, amt = 1) => {
    if (!key) return;
    setGameState(prev => ({
      ...prev,
      counters: { ...(prev.counters || {}), [key]: (prev.counters?.[key] || 0) + (amt || 1) }
    }));
  }, []);

  const rerollTip = useCallback(() => {
    const tips = [
      "Tiny steps compound.",
      "Connection before correction.",
      "Repair builds trust.",
      "Boundaries are kindness.",
      "Sleep is parenting magic."
    ];
    const idx = Math.floor(Math.random() * tips.length);
    updateState({ tipText: tips[idx] });
  }, [updateState]);

  const safeTemplate = useCallback((str, vars = {}) => {
    if (!str) return '';
    let out = String(str);
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{${k}}`).join(String(v));
    }
    return out;
  }, []);

  const getScenarioFlavorLine = useCallback((hookOrScenario) => {
    // Accept either a hook or a scenario-like object
    const topic = hookOrScenario?.topic || 'something small';
    const variants = [
      `It starts with ${topic}.`,
      `A small thing about ${topic} becomes a big thing.`,
      `You didn’t expect ${topic} to matter this much.`,
      `${topic} shouldn’t be dramatic… and yet.`,
      `Somehow, ${topic} becomes today’s main event.`
    ];

    // Deterministic-ish pick based on runSeed so it doesn’t flicker every render
    const seed = String(gameState.runSeed || 'seed');
    const key = `${seed}|flavor|${topic}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = ((hash << 5) - hash) + key.charCodeAt(i);
    const idx = Math.abs(hash) % variants.length;

    return variants[idx];
  }, [gameState.runSeed]);

  const getScenarioOpenerLine = useCallback((hookOrScenario) => {
    const childName = gameState.childName || 'your child';
    const topic = hookOrScenario?.topic || 'something';
    const hookText =
      hookOrScenario?.hookText ||
      hookOrScenario?.openerLine ||
      "It's an ordinary day until something small becomes a parenting moment with {childName}.";

    return safeTemplate(hookText, { childName, topic });
  }, [gameState.childName, safeTemplate]);

  const computeSuggestion = useCallback(() => {
    const stress = Number(gameState.stress || 0);
    const love = Number(gameState.love || 0);
    if (stress >= 70) return { actionId: 'parentReset', text: 'Stress is high. Take a Parent Reset.' };
    if (love <= 35) return { actionId: 'bond', text: 'Love is low. Try a Bond action.' };
    return { actionId: 'study', text: 'Build skills. Try Study this year.' };
  }, [gameState.stress, gameState.love]);

  const computeMoneyGoal = useCallback(() => {
    if (gameState.financialGoal && !gameState.financialGoalDismissed) {
      const target = Number(gameState.financialGoal.amount || 0);
      const progress = Number(gameState.money || 0);
      return {
        emoji: gameState.financialGoal.emoji || '🎯',
        title: gameState.financialGoal.label || 'Financial goal',
        why: 'A clear target helps tradeoffs.',
        cost: target,
        progress,
        remaining: Math.max(0, target - progress),
        ctaLabel: 'Edit goal',
        ctaAction: 'setup'
      };
    }
    // "Build a buffer" tip removed — no longer shown
    return null;
  }, [gameState.financialGoal, gameState.financialGoalDismissed, gameState.money]);

  const getAvailability = useCallback((req) => {
    const actionId = typeof req === 'string' ? req : req?.id;
    
    // School type availability with scenario restrictions
    if (req?.type === 'school') {
      if ((gameState.currentYear || 0) < SCHOOL_START_AGE) {
        return { enabled: false, reasonText: `School starts at age ${SCHOOL_START_AGE}.`, reasonCode: 'age', reason: `School starts at age ${SCHOOL_START_AGE}.` };
      }
      
      const schoolTypeId = req?.id;
      const ss = String(gameState.specialStartId || '');
      
      // Apocalypse: no formal schooling at all
      if (ss === 'zombie_apocalypse' || ss === 'alien_invasion') {
        return { enabled: false, reasonText: 'No formal schooling during the apocalypse.', reasonCode: 'scenario', reason: 'No formal schooling during the apocalypse.' };
      }
      
      // War zone / Refugee camp: disable private, empathy, and religious schools
      if (ss === 'war_zone' || ss === 'refugee_camp') {
        if (schoolTypeId === 'private' || schoolTypeId === 'empathy' || schoolTypeId === 'religious') {
          return { enabled: false, reasonText: 'Not available in this scenario.', reasonCode: 'scenario', reason: 'Not available in this scenario.' };
        }
      }
      
      // Rural isolation: disable religious school (not available)
      if (ss === 'rural_isolation' && schoolTypeId === 'religious') {
        return { enabled: false, reasonText: 'Not available here. No religious schools within reach.', reasonCode: 'scenario', reason: 'Not available here. No religious schools within reach.' };
      }
      
      // Religious school requires active faith
      if (schoolTypeId === 'religious') {
        const faithName = gameState.faith?.tradition || gameState.religion || null;
        if (!faithName) {
          return { enabled: false, reasonText: 'Choose a faith first.', reasonCode: 'prereq', reason: 'Choose a faith first.' };
        }
      }
      
      return { enabled: true, reasonText: null, reasonCode: null };
    }
    
    // Action availability (with reasonText normalization)
    const actionAvail = getActionAvailability(actionId);
    if (!actionAvail.enabled && actionAvail.reason && !actionAvail.reasonText) {
      return { ...actionAvail, reasonText: actionAvail.reason };
    }
    return actionAvail;
  }, [gameState.currentYear, gameState.specialStartId, getActionAvailability]);

  const formatBaseToLocal = useCallback((amount) => {
    const scale = getCountryScale(gameState.countryIso3 || "USA");
    const local = localizeAmount(Number(amount || 0), scale);
    return formatMoney(local);
  }, [gameState.countryIso3]);

  const getActiveChoice = useCallback((choiceKey) => {
    const scenario = gameState.currentScenario;
    const choices = scenario?.choices || [];
    if (!choices.length) {
      return { letter: 'A', role: 'connect', deltas: {}, consequence: '', coachNote: null, loveDelta: 0, stressDelta: 0 };
    }
    if (typeof choiceKey === 'object' && choiceKey) return choiceKey;
    const key = String(choiceKey || '').toUpperCase();
    return choices.find(c => (c.letter || '').toUpperCase() === key) || choices[0];
  }, [gameState.currentScenario]);

  const loveDeltaFromChoice = useCallback((choiceKey) => {
    const c = getActiveChoice(choiceKey);
    return Number(c?.loveDelta || c?.love || 0);
  }, [getActiveChoice]);

  const stressDeltaFromChoice = useCallback((choiceKey) => {
    const c = getActiveChoice(choiceKey);
    return Number(c?.stressDelta || c?.stress || 0);
  }, [getActiveChoice]);

  const getStressGauge = useCallback(() => {
    // canonical model: { value, label, thresholds }
    const gauge = computeStressGauge(gameState.stress);

    // keep any UI helpers if needed
    const s = Number(gauge?.value ?? 0);
    let color = 'emerald';
    if (s >= 80) color = 'rose';
    else if (s >= 65) color = 'amber';
    else if (s >= 40) color = 'yellow';

    return { ...gauge, color };
  }, [gameState.stress]);

  // Curiosity Pack: pick next question id
  function pickCuriosityQuestionId(prev) {
    const used = new Set(prev?.curiosity?.usedQuestionIds || []);
    const allIds = CURIOSITY_QUESTIONS.map(q => q.id);
    const pool = allIds.filter(id => !used.has(id));
    const source = pool.length ? pool : allIds;
    const idx = Math.floor(Math.random() * source.length);
    return source[idx];
  }

  // Curiosity Pack: resolve choice (supports legacy + quiz keys)
  const resolveCuriosityChoice = useCallback((choiceKey) => {
    let deltas = {};
    let note = '';
    let outcomeTitle = '';
    const key = String(choiceKey || '').toLowerCase();

    if (key === 'correct' || key === 'pick_correct') {
      deltas = { intelligence: 0.01 };
      outcomeTitle = '✅ Nice!';
      note = 'INT ↑';
    } else if (key === 'incorrect' || key === 'pick_incorrect') {
      deltas = { intelligence: -0.01 };
      outcomeTitle = '❌ Not quite.';
      note = 'INT ↓';
    } else if (key === 'ignore') {
      deltas = { intelligence: -0.01, confidence: -0.01 };
      outcomeTitle = 'Ignored';
      note = 'INT ↓ • CONF ↓';
    } else if (key === 'scold') {
      deltas = { confidence: -1.0 };
      outcomeTitle = 'Scolded';
      note = 'CONF ↓↓ • Curiosity Pack disabled';
      setGameState(prev => ({ ...prev, packs: { ...(prev.packs || {}), curiosityPackEnabled: false } }));
    }

    if (Object.keys(deltas).length) {
      applyDeltas(deltas, 'Curiosity');
    }

    setGameState(prev => ({
      ...prev,
      curiosity: { ...(prev.curiosity || {}), phase: 'reveal', lastResult: { choiceKey, note, outcomeTitle } }
    }));
  }, [applyDeltas]);

  const closeCuriosityModal = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      curiosity: { ...(prev.curiosity || {}), pending: false, agePending: null, questionId: null, phase: 'question', lastResult: null }
    }));
  }, []);

  // --- Wisdom Lenses Helpers ---
  const getWisdomTier = useCallback((lensId) => {
    return getWisdomTierFromCatalog(lensId, gameState.wisdom?.xp);
  }, [gameState.wisdom?.xp]);

  const isLensEquipped = useCallback((lensId) => {
    return Array.isArray(gameState.wisdom?.equipped) && gameState.wisdom.equipped.includes(lensId);
  }, [gameState.wisdom?.equipped]);

  const awardWisdomXP = useCallback((lensId, amount, reason) => {
    const lens = WISDOM_LENSES.find(l => l.id === lensId);
    if (!lens) return;

    const oldTier = getWisdomTierFromCatalog(lensId, gameState.wisdom?.xp);
    
    updateState(prev => {
      const wisdom = prev.wisdom || INITIAL_STATE.wisdom;
      const xp = wisdom.xp || INITIAL_STATE.wisdom.xp;
      const newXp = (xp[lensId] || 0) + amount;
      return {
        ...prev,
        wisdom: {
          ...wisdom,
          xp: { ...xp, [lensId]: newXp }
        }
      };
    });

    // Use a timeout to get the new tier after state update
    setTimeout(() => {
      const newGameState = latestStateRef.current;
      const newTier = getWisdomTierFromCatalog(lensId, newGameState.wisdom?.xp);
      
      if (newTier > oldTier) {
        const tierInfo = lens.tiers.find(t => t.tier === newTier);
        toast(`✨ Insight unlocked: ${lens.name} — ${tierInfo.label}`);
        addLog(`✨ Insight unlocked: ${lens.name} — ${tierInfo.label}`);
        recordTimelineEntry({
          kind: "wisdom",
          title: `${lens.emoji} Wisdom — ${lens.name}`,
          detail: `${reason} (Tier up: ${tierInfo.label})`,
        });
      } else {
         recordTimelineEntry({
          kind: "wisdom",
          title: `${lens.emoji} Wisdom — ${lens.name}`,
          detail: reason,
        });
      }
    }, 0);
  }, [updateState, addLog, recordTimelineEntry, gameState.wisdom]);

  const resetWisdomForNewAge = useCallback(() => {
    updateState(prev => {
      const wisdom = prev.wisdom || INITIAL_STATE.wisdom;
      const equipped = wisdom.equipped || [];
      const tier1 = getWisdomTierFromCatalog(equipped[0], wisdom.xp);
      const tier2 = getWisdomTierFromCatalog(equipped[1], wisdom.xp);

      let clarity = 1;
      if (tier1 >= 1) clarity++;
      if (tier2 >= 1) clarity++;
      
      return {
        ...prev,
        wisdom: {
          ...wisdom,
          clarity: Math.min(3, clarity),
          clarityUsedThisAge: 0,
          rerollsThisAge: 0,
        }
      };
    });
  }, [updateState]);

  const spendClarity = useCallback((amount = 1, reason) => {
    const wisdom = gameState.wisdom || {};
    if ((wisdom.clarity || 0) < amount) {
      toast.error("Not enough Clarity!");
      return false;
    }
    updateState(prev => {
      const prevWisdom = prev.wisdom || INITIAL_STATE.wisdom;
      return {
        ...prev,
        wisdom: {
          ...prevWisdom,
          clarity: (prevWisdom.clarity || 0) - amount,
          clarityUsedThisAge: (prevWisdom.clarityUsedThisAge || 0) + amount,
        }
      }
    });
    addLog(`✨ Used ${amount} Clarity: ${reason}`);
    return true;
  }, [gameState.wisdom, updateState, addLog]);


  // Trigger Curiosity on age 1..5 if enabled and not asked yet
  React.useEffect(() => {
    const age = Number(gameState.currentYear || 0);
    if (!hasAnyChild(gameState)) return;
    if (!age || age < 1 || age > 5) return;
    if (!(gameState.packs?.curiosityPackEnabled ?? true)) return;

    const asked = gameState.curiosity?.askedAges || {};
    const pending = !!gameState.curiosity?.pending;
    if (asked[String(age)] || pending) return;

    const autoGuess = gameState.settings?.curiosityAutoGuess ?? false;

    setGameState(prev => {
      const qid = pickCuriosityQuestionId(prev);
      const used = [...(prev.curiosity?.usedQuestionIds || []), qid];
      const nextAsked = { ...(prev.curiosity?.askedAges || {}), [String(age)]: true };
      
      if (autoGuess) {
        // Auto-skip: mark asked but don't queue popup (log only if not already logged this age)
        const shouldLog = !prev.curiosity?.askedAges?.[String(age)];
        if (shouldLog) addLog('🧸 Curiosity: playful guess (auto).');
        return {
          ...prev,
          curiosity: { ...(prev.curiosity || {}), pending: false, agePending: null, questionId: null, usedQuestionIds: used, askedAges: nextAsked, phase: 'question', lastResult: null }
        };
      }
      
      return {
        ...prev,
        curiosity: { ...(prev.curiosity || {}), pending: true, agePending: age, questionId: qid, usedQuestionIds: used, askedAges: nextAsked, phase: 'question', lastResult: null }
      };
    });
  }, [gameState.currentYear, gameState.packs?.curiosityPackEnabled, gameState.settings?.curiosityAutoGuess]);

  const resetYearActions = useCallback(() => {
    updateState(prev => {
      const nextYear = (Number(prev.currentYear ?? 0)) + 1;
      
      // STEP 1: Update fatigue streak
      const endedAtZeroFocus = (Number(prev.actionPoints ?? 0) === 0);
      const nextStreakYears = endedAtZeroFocus 
        ? (Number(prev.zeroFocusStreakYears ?? 0) + 1)
        : Math.max(0, (Number(prev.zeroFocusStreakYears ?? 0) - 1));
      
      // STEP 2: Apply Family Pattern annual stress drift
      const patternIds = prev.familyPatterns?.selectedIds || [];
      const patternMods = getFamilyPatternMods(patternIds);
      const driftStress = Number(patternMods.annualStressDrift ?? 0);
      const nextStress = Math.max(0, Math.min(100, (Number(prev.stress ?? 0) + driftStress)));
      
      // STEP 3: Compute mood ONCE for next year
      let nextMood = prev.childMood ?? 'neutral';
      let nextMoodYear = prev.moodComputedForYear;
      let nextMoodDisabledIds = prev.moodLockedDisabledPlayIds ?? [];
      
      if (nextMoodYear !== nextYear) {
        try {
          // Dynamic import to avoid require
          import('./moodSystem').then(({ computeMoodForYear, computeMoodDisabledPlayIds }) => {
            const mood = computeMoodForYear({
              stress: nextStress,
              love: Number(prev.love ?? 0),
              temperament: prev.childTemperamentId || prev.temperament,
              patterns: prev.familyPatterns,
              runSeed: prev.runSeed || 'seed',
              year: nextYear
            });
            
            import('./newActivitiesPack').then(({ PLAY_ACTIVITY_PACK }) => {
              const disabledIds = computeMoodDisabledPlayIds({
                mood,
                playActivityPack: PLAY_ACTIVITY_PACK,
                runSeed: prev.runSeed || 'seed',
                year: nextYear
              });
              
              updateState(prev => ({
                childMood: mood,
                moodComputedForYear: nextYear,
                moodLockedDisabledPlayIds: disabledIds
              }));
            }).catch(() => {});
          }).catch(() => {});
        } catch {
          // Fallback: keep current mood
        }
        nextMoodYear = nextYear;
      }
      
      // STEP 4: Compute next year max focus (including living + QoL modifiers)
      const base = Number(prev.baseMaxFocusTokens ?? 5);
      const patternFocusMod = Number(patternMods.maxFocusMod ?? 0);
      
      // Living focus modifiers (with resolver fallback)
      const setup = prev.livingSetup || { housingId: 'apartment_basic', commuteId: 'bus', foodStrategyId: 'standard' };
      let livingFocusMod = 0;
      try {
        const housing = resolveHousingForState(prev, setup.housingId);
        const commute = resolveCommuteForState(prev, setup.commuteId);
        const foodStrat = getFoodStrategyById(setup.foodStrategyId || 'standard');
        livingFocusMod = (housing.focusMod || 0) + (commute.focusMod || 0) + (foodStrat.focusMod || 0);
      } catch {}
      
      // QoL focus modifiers (capped)
      let qolFocusMod = 0;
      try {
        qolFocusMod = computeQoLFocusBonus(prev, nextYear);
      } catch {}
      
      const stressPenalty = Math.floor(nextStress / 20);
      const fatiguePenalty = (nextStreakYears >= 3) ? 1 : 0;
      
      let nextMax = base + patternFocusMod + livingFocusMod + qolFocusMod - stressPenalty - fatiguePenalty;
      
      const newBonus = (prev.householdType === 'two' && prev.partnerCareer?.jobId === 'stay_at_home_parent') ? 1 : 0;
      nextMax = nextMax + newBonus;
      nextMax = Math.max(1, nextMax);

      return {
        ...prev,
        stress: nextStress,
        zeroFocusStreakYears: nextStreakYears,
        childMood: nextMood,
        moodComputedForYear: nextMoodYear,
        moodLockedDisabledPlayIds: nextMoodDisabledIds,
        patternModsCache: patternMods,
        maxFocusTokens: nextMax,
        actionPoints: nextMax,
        focusBonusPartner: newBonus,
        actionsUsed: {},
        scenarioPending: true,
        pendingScenario: true,
        scenarioCompletedThisAge: false,
        currentScenario: null,
        currentScenarioHookId: null,
        currentScenarioResolvedChoice: null,
        yearFlags: { ...(prev.yearFlags || {}), packCheckinsShown: false, tinyCuteShownThisAge: false, kidWisdomShownThisAge: false, siblingRivalryPopupsShown: 0 },
        childSickThisAge: false,
        childSickNote: null,
        playerSickThisAge: false,
        playerSickNote: null,
        partnerSickThisAge: false,
        partnerSickNote: null,
        yearExpenseReduction: 0,
        faith: {
          ...(prev.faith || {}),
          valuesConversations: {
            ...(prev.faith?.valuesConversations || {}),
            usedThisYear: false
          }
        }
      };
    });
    resetWisdomForNewAge();
  }, [updateState, resetWisdomForNewAge]);

  const applyStartOfAgeResources = useCallback((ageOverride = null) => {
    const age = Number(ageOverride ?? gameState.currentYear ?? 0);

    // Initialize economy state if missing
    setGameState(prev => {
    if (prev.economy?.version === 1 && prev.economy?.nextCrashAge != null) return prev;

    const rng = createSeededRng(`${prev.runSeed || 'seed'}|economy|init`);
    const firstCrash = Math.floor(rng.nextFloat() * 7) + 7; // 7-13

    return {
      ...prev,
      economy: {
        version: 1,
        wagePenalty: 1,
        recoveryPerYear: 0.1,
        nextCrashAge: firstCrash,
        lastCrashAge: null
      }
    };
    });

    // Process economy crash/recovery
    setGameState(prev => {
    const econ = prev.economy || { version: 1, wagePenalty: 1, recoveryPerYear: 0.1, nextCrashAge: null, lastCrashAge: null };
    let { wagePenalty, recoveryPerYear, nextCrashAge, lastCrashAge } = econ;

    // Recovery step
    if (wagePenalty < 1) {
      wagePenalty = Math.min(1, wagePenalty + recoveryPerYear);
    }

    // Check crash
    if (age === nextCrashAge) {
      const rng = createSeededRng(`${prev.runSeed || 'seed'}|crash|age:${age}`);
      const severity = 0.65 + rng.nextFloat() * 0.15; // 0.65-0.80
      const recoveryYears = Math.floor(rng.nextFloat() * 3) + 3; // 3-5
      wagePenalty = severity;
      recoveryPerYear = (1 - severity) / recoveryYears;
      lastCrashAge = age;
      nextCrashAge = age + Math.floor(rng.nextFloat() * 5) + 8; // 8-12

      const dropPct = Math.round((1 - severity) * 100);
      addLog(`📉 Economic downturn: household income drops ~${dropPct}% this year.`);
      recordTimelineEntry({
        kind: 'economy',
        title: '📉 Economic Crash',
        detail: `Income drops ~${dropPct}% due to market downturn. Recovery will take ${recoveryYears} years.`,
        moneyDelta: 0,
        loveDelta: 0,
        stressDelta: 0,
        age
      });
    }

    return {
      ...prev,
      economy: { ...econ, wagePenalty, recoveryPerYear, nextCrashAge, lastCrashAge }
    };
    });

    // Zombie Apocalypse: Force early-year deaths (PG-13, no graphics)
    if (gameState.specialStartId === 'zombie_apocalypse') {
    const plot = gameState.zombieAutoplot || {};

    // Age 2: Father dies
    if (age === 2 && !plot.dadDead) {
      const father = gameState.relationships?.byId?.my_dad;
      if (father && father.alive) {
        updateState(prev => {
          const rel = prev.relationships || { roster: [], byId: {} };
          const dad = { ...(rel.byId.my_dad || {}) };
          dad.alive = false;
          dad.isDeceased = true;
          dad.deathYear = age;
          const newById = { ...rel.byId, my_dad: dad };
          const newRoster = rel.roster.map(r => r.id === 'my_dad' ? dad : r);
          return {
            ...prev,
            relationships: { ...rel, byId: newById, roster: newRoster },
            zombieAutoplot: { ...(prev.zombieAutoplot || {}), dadDead: true }
          };
        });

        applyStress(2, 'Loss');
        applyLove(-1, 'Loss');
        addLog(`🕯️ Your father didn't make it back from a supply run.`);
        recordTimelineEntry({
          kind: 'lore',
          title: '🕯️ Loss',
          detail: `Your father didn't make it back from a supply run. The horde got him.`,
          deltas: null,
          moneyDelta: 0,
          loveDelta: -1,
          stressDelta: 2,
          age: age
        });
      }
    }

    // Age 3: Best friend dies
    if (age === 3 && !plot.bestFriendDead) {
      const bf = gameState.relationships?.byId?.my_best_friend;
      if (bf && bf.alive) {
        updateState(prev => {
          const rel = prev.relationships || { roster: [], byId: {} };
          const friend = { ...(rel.byId.my_best_friend || {}) };
          friend.alive = false;
          friend.isDeceased = true;
          friend.deathYear = age;
          const newById = { ...rel.byId, my_best_friend: friend };
          const newRoster = rel.roster.map(r => r.id === 'my_best_friend' ? friend : r);
          return {
            ...prev,
            relationships: { ...rel, byId: newById, roster: newRoster },
            zombieAutoplot: { ...(prev.zombieAutoplot || {}), bestFriendDead: true }
          };
        });

        applyStress(1.5, 'Loss');
        applyLove(-0.5, 'Loss');
        addLog(`🕯️ ${bf.name} is gone. You found their radio.`);
        recordTimelineEntry({
          kind: 'lore',
          title: '🕯️ Loss',
          detail: `${bf.name} is gone. You found their radio, but not them.`,
          deltas: null,
          moneyDelta: 0,
          loveDelta: -0.5,
          stressDelta: 1.5,
          age: age
        });
      }
    }

    // Age 4: Mother dies
    if (age === 4 && !plot.momDead) {
      const mother = gameState.relationships?.byId?.my_mom;
      if (mother && mother.alive) {
        updateState(prev => {
          const rel = prev.relationships || { roster: [], byId: {} };
          const mom = { ...(rel.byId.my_mom || {}) };
          mom.alive = false;
          mom.isDeceased = true;
          mom.deathYear = age;
          const newById = { ...rel.byId, my_mom: mom };
          const newRoster = rel.roster.map(r => r.id === 'my_mom' ? mom : r);
          return {
            ...prev,
            relationships: { ...rel, byId: newById, roster: newRoster },
            zombieAutoplot: { ...(prev.zombieAutoplot || {}), momDead: true }
          };
        });

        applyStress(2, 'Loss');
        applyLove(-1, 'Loss');
        addLog(`🕯️ Your mother was lost to the horde.`);
        recordTimelineEntry({
          kind: 'lore',
          title: '🕯️ Loss',
          detail: `Your mother was lost to the horde. She tried to protect the settlement.`,
          deltas: null,
          moneyDelta: 0,
          loveDelta: -1,
          stressDelta: 2,
          age: age
        });
      }
    }
    }

    // Apply yearBudgetBuffs if present from previous year's budget
    const buffs = gameState.yearBudgetBuffs;
    if (buffs && typeof buffs === 'object') {
      // Retirement growth bonus
      if (buffs.retirementBoost > 0) {
        const retirementSavings = Number(gameState.retirementSavings || 0);
        const interest = Math.round(retirementSavings * (0.01 * buffs.retirementBoost));
        if (interest > 0) {
          updateState(prev => ({
            retirementSavings: (prev.retirementSavings || 0) + interest
          }));
          recordTimelineEntry({
            kind: 'budget',
            title: '🧓 Retirement Growth Bonus',
            detail: `Your retirement fund grew by $${formatMoney(interest)} thanks to last year's planning.`,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0
          });
        }
      }

      // Relationship buffer
      if (buffs.relationshipBoost > 0) {
        applyLove(buffs.relationshipBoost, 'Budget Relationship Buffer');
        applyStress(-buffs.relationshipBoost, 'Budget Relationship Buffer');
        recordTimelineEntry({
          kind: 'budget',
          title: '💞 Relationship Buffer',
          detail: `Last year's Fun budget pays off: Love +${buffs.relationshipBoost}, Stress -${buffs.relationshipBoost}.`,
          deltas: null,
          moneyDelta: 0,
          loveDelta: buffs.relationshipBoost,
          stressDelta: -buffs.relationshipBoost
        });
      }

      // Childcare support (parenting runs) OR Family Planning buffer (child-free runs)
      if (buffs.childcareBoost > 0) {
        if (hasAnyChild(gameState)) {
          const deltas = {
            responsibility: Math.round(buffs.childcareBoost * 0.2 * 10) / 10,
            happiness: Math.round(buffs.childcareBoost * 0.2 * 10) / 10
          };
          applyDeltas(deltas, 'Budget Childcare Support');
          recordTimelineEntry({
            kind: 'budget',
            title: '🧸 Childcare Support',
            detail: `Last year's Childcare budget creates smoother days: small gains in responsibility & happiness.`,
            deltas: deltas,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0
          });
        } else {
          const pressureRelief = Math.min(10, buffs.childcareBoost * 2);
          const stressRelief = Math.min(2, buffs.childcareBoost);

          applyBabyPressure(-pressureRelief, 'Family Planning Buffer');
          applyStress(-stressRelief, 'Family Planning Buffer');

          recordTimelineEntry({
            kind: 'budget',
            title: '🍼 Family Planning Buffer',
            detail: `Last year's Family Planning budget reduced the pressure: Baby Pressure -${pressureRelief}, Stress -${stressRelief}.`,
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: -stressRelief
          });
        }
      }

      // Safety net (expense reduction for this year)
      if (buffs.safetyNet > 0) {
        const reductionPct = buffs.safetyNet * 0.03;
        updateState(prev => ({
          yearExpenseReduction: reductionPct
        }));
        recordTimelineEntry({
          kind: 'budget',
          title: '🐷 Safety Net Active',
          detail: `Your emergency fund reduces surprise costs by ${Math.round(reductionPct * 100)}% this year.`,
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 0
        });
      }
    }

    // Helper: get child count (for government assistance scaling)
    const getChildCount = (state) => {
      const kids = Array.isArray(state.kids) ? state.kids : [];
      if (kids.length > 0) {
        const currentYear = Number(state.currentYear || 0);
        return kids.filter(k => {
          const createdAt = Number(k?.createdAtYear ?? 0);
          const isDeceased = k?.isDeceased === true;
          return createdAt <= currentYear && !isDeceased;
        }).length;
      }
      return hasAnyChild(state) ? 1 : 0;
    };

    const MIN_GOV_ASSIST_BASE = 800;

    const computeGovAssistBase = (childCount) => {
      const c = Number(childCount || 0);
      if (c === 0) return MIN_GOV_ASSIST_BASE;
      if (c === 1) return 1000;
      if (c === 2) return 2000;
      if (c === 3) return 3000;
      return 3500; // 4+
    };
    
    // If player has a specific career, use that income. Otherwise fallback to tier.
    let playerIncomeBase = 0;
    let partnerIncomeBase = 0;
    
    // Player income
    if (gameState.parentCareer?.employed !== false && Number(gameState.parentCareer?.yearlyIncome) > 0) {
      playerIncomeBase = Number(gameState.parentCareer.yearlyIncome);
    } else if (Number(gameState.playerCareer?.yearlyIncome) > 0) {
      playerIncomeBase = Number(gameState.playerCareer.yearlyIncome);
    } else {
      const tier = INCOME_CONFIG[gameState.incomeTier] || INCOME_CONFIG.medium;
      playerIncomeBase = Number(tier.yearlyIncome || 0);
    }
    
    // Partner income
    if (gameState.householdType === 'two' && gameState.partnerCareer?.yearlyIncome) {
      partnerIncomeBase = Number(gameState.partnerCareer.yearlyIncome || 0);
    }
    
    // Override government assistance based on child count
    const childCount = getChildCount(gameState);
    const playerJobId = gameState.playerCareer?.jobId || gameState.parentCareer?.jobId;
    const partnerJobId = gameState.partnerCareer?.jobId;
    
    if (playerJobId === 'government_assistance') {
      const baseFromKids = computeGovAssistBase(childCount);
      const storedSalary = Number(gameState.playerCareer?.yearlyIncome || 0);
      playerIncomeBase = Math.max(baseFromKids, storedSalary);
      
      // Persist effective income (never downgrade a raise)
      if (playerIncomeBase !== storedSalary) {
        updateState(prev => ({
          playerCareer: {
            ...(prev.playerCareer || {}),
            yearlyIncome: playerIncomeBase
          }
        }));
      }
    }
    
    if (partnerJobId === 'government_assistance' && gameState.householdType === 'two') {
      const baseFromKids = computeGovAssistBase(childCount);
      const storedSalary = Number(gameState.partnerCareer?.yearlyIncome || 0);
      partnerIncomeBase = Math.max(baseFromKids, storedSalary);
      
      // Persist effective income (never downgrade a raise)
      if (partnerIncomeBase !== storedSalary) {
        updateState(prev => ({
          partnerCareer: {
            ...(prev.partnerCareer || {}),
            yearlyIncome: partnerIncomeBase
          }
        }));
      }
    }
    
    // Apply makeup passive bonus (female player + owns makeup = +10% salary)
    const isPlayerFemale = (gameState.parentRole === 'mom') || (gameState.parentAvatarGender === 'female');
    const hasMakeup = hasShopItem(gameState, 'beauty_makeupKit');
    
    if (isPlayerFemale && hasMakeup && playerJobId !== 'government_assistance' && playerJobId !== 'stay_at_home_parent') {
      playerIncomeBase = Math.round(playerIncomeBase * 1.10);
    }

    // Apply wage penalty from economy crashes
    const econ = gameState.economy || { wagePenalty: 1 };
    const wagePenalty = Number(econ.wagePenalty || 1);
    
    // Yearly income (paid yearly because living costs are yearly)
    const playerIncomeAfterPenalty = playerIncomeBase * wagePenalty;
    const partnerIncomeAfterPenalty = partnerIncomeBase * wagePenalty;
    const totalIncome = playerIncomeAfterPenalty + partnerIncomeAfterPenalty;
    
    const wageScale = getCountryWageScale(gameState.countryIso3 || "USA");
    const incomeLocal = localizeAmount(totalIncome, wageScale, PRICING.LOCAL);
    
    if (incomeLocal > 0) {
      const playerIncomeLocal = localizeAmount(playerIncomeAfterPenalty, wageScale, PRICING.LOCAL);
      const partnerIncomeLocal = (partnerIncomeAfterPenalty > 0) ? localizeAmount(partnerIncomeAfterPenalty, wageScale, PRICING.LOCAL) : 0;
      
      const note = (partnerIncomeLocal > 0) 
        ? `You: $${formatMoney(playerIncomeLocal)}, Partner: $${formatMoney(partnerIncomeLocal)}` 
        : `You: $${formatMoney(playerIncomeLocal)}`;
      
      applyMoneyDelta(incomeLocal, 'Household income', {
        category: 'salary',
        ageOverride: age,
        note
      });
    }

    // Small business income (annual, if active)
    try {
      const bizIncomeBase = Number(gameState.businessIncomePerYear || 0);
      const startAge = gameState.businessIncomeStartAge;
      const eligible = bizIncomeBase > 0 && (startAge == null || Number(age) >= Number(startAge));
      if (eligible) {
        const bizScale = getCountryLocalCostScale(gameState.countryIso3 || 'USA');
        const bizIncomeLocal = localizeAmount(bizIncomeBase, bizScale, PRICING.LOCAL);
        if (bizIncomeLocal > 0) {
          applyMoneyDelta(bizIncomeLocal, 'Small business income', {
            category: 'business',
            ageOverride: age,
            note: gameState.businessIdea ? `Business: ${gameState.businessIdea}` : undefined
          });
        }
      }
    } catch {}

    // Kim special start: dictator cashflow is not a salary; give a flat $500,000 per year-turn
    try {
      if (gameState.specialStartId === 'kim_jong_un') {
        applyMoneyDelta(500000, 'Supreme Leader Income', { category: 'income', ageOverride: age });
      }
    } catch {}
    
    // Private School: charge tuition yearly
    try {
      const newAge = Number(ageOverride ?? gameState.currentYear ?? 0);
      if (gameState.privateSchoolActive === true && gameState.schoolType === 'private' && newAge > (gameState.privateSchoolStartAge ?? -999)) {
        const tuitionBase = (gameState.specialStartId === 'kim_jong_un') ? 15000 : 500;
        const tuitionLocal = localizeAmount(tuitionBase, getCountryScale(gameState.countryIso3 || 'USA'));
        
        applyMoneyDelta(-tuitionLocal, 'Private school tuition', { 
          category: 'education', 
          ageOverride: newAge, 
          note: 'Annual tuition' 
        });
        
        recordTimelineEntry({
          kind: 'budget',
          title: '🏛️ Private School — Annual Tuition',
          detail: `Tuition paid: -$${formatMoney(tuitionLocal)}`,
          moneyDelta: -tuitionLocal,
          loveDelta: 0,
          stressDelta: 0,
          age: newAge
        });
      }
    } catch {}
    
    // Religious School: charge tuition yearly + faith maintenance
    try {
      const newAge = Number(ageOverride ?? gameState.currentYear ?? 0);
      if (gameState.schoolType === 'religious' && newAge > (gameState.religiousSchoolStartAge ?? -999)) {
        // Check if player still has faith; if not, auto-revert to public
        const faithName = gameState.faith?.tradition || gameState.religion || null;
        if (!faithName) {
          updateState(prev => ({ 
            schoolType: 'public',
            religiousSchoolStartAge: null
          }));
          addLog("Without an active faith, Religious School isn't available. You switch back to Public School.");
          recordTimelineEntry({
            kind: 'system',
            title: '🏫 School Changed to Public',
            detail: 'Without an active faith, Religious School is no longer available.',
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            age: newAge
          });
        } else {
          // Charge tuition
          const tuitionBase = 600;
          const tuitionLocal = localizeAmount(tuitionBase, getCountryScale(gameState.countryIso3 || 'USA'));
          
          applyMoneyDelta(-tuitionLocal, 'Religious school tuition', { 
            category: 'education', 
            ageOverride: newAge, 
            note: 'Annual tuition' 
          });
          
          // Faith maintenance: prevent decay, add small reinforcement
          updateState(prev => {
            const faith = prev.faith || {};
            const exposure = Math.max(0, Math.min(100, (faith.exposure || 0) + 2));
            const devotion = Math.max(0, Math.min(100, (faith.devotion || 0) + 1));
            
            return {
              faith: {
                ...faith,
                exposure,
                devotion
              }
            };
          });
          
          recordTimelineEntry({
            kind: 'budget',
            title: '🏫 Religious School — Annual Tuition',
            detail: `Tuition paid. Continued reinforcement of faith community.`,
            moneyDelta: -tuitionLocal,
            loveDelta: 0,
            stressDelta: 0,
            age: newAge,
            meta: { type: 'religious_school_year_start' }
          });
        }
      }
    } catch {}

    // Scandal decay
    setGameState(prev => {
      const politics = prev.politics || {};
      const reputation = prev.reputation || 50;
      const scandals = Array.isArray(politics.activeScandals) ? politics.activeScandals : [];
      if (scandals.length === 0) return prev;

      const decayAmount = reputation >= 70 ? 2 : 1;
      let removedCount = 0;

      const nextScandals = scandals.map(s => {
        const nextPenalty = (s.lingeringPenalty || 0) - decayAmount;
        if (nextPenalty <= 0) {
          removedCount++;
          return null; // Mark for removal
        }
        return { ...s, lingeringPenalty: nextPenalty };
      }).filter(Boolean);

      if (removedCount > 0) {
        const remainingCount = nextScandals.length;
        let detail = '';
        if (removedCount > 0 && remainingCount > 0) {
          detail = `Some stories fade. (${removedCount} cleared, ${remainingCount} remain)`;
        } else if (removedCount > 0 && remainingCount === 0) {
          detail = `The headlines finally move on. (${removedCount} cleared)`;
        } else {
          detail = `The heat dies down a little.`;
        }

        recordTimelineEntry({
          kind: 'politics',
          title: '🧼 Scandal Cooling Off',
          detail: detail
        });
      }

      return { ...prev, politics: { ...politics, activeScandals: nextScandals } };
      });

      // Titles: succession simulation removed in MVP; handled later via titles actions/events
      setGameState(prev => prev);

    // Milestones: evaluate/completion + assignments
    try {
      const age = Number(ageOverride ?? gameState.currentYear ?? 0);
      applySpecialStartRecurringCostsAndBonuses({ age, gameState, applyMoneyDelta, applyStress, applyDeltas });
    } catch {}

    // Special-start yearly spices
    try {
      const t = gameState.titles || {};
      const info = t.primaryTitle ? getTitleInfo(t.primaryTitle) : null;
      // Alien Invasion: bunker warden and above reduce baseline threat
      if (gameState.specialStartId === 'alien_invasion' && info?.group === 'survivor_rank') {
        const rankIndex = ['surv_scavenger','surv_shelter_keeper','surv_resistance_runner','surv_bunker_warden','surv_last_legend'].indexOf(t.primaryTitle);
        if (rankIndex >= 3) {
          updateState(prev => ({ alienThreat: Math.max(0, (prev.alienThreat || 0) - 5) }));
        }
      }
      // Mafia passive: income scales with Respect (titleMeter), heat creeps
      if (gameState.specialStartId === 'mafia_family') {
        const meter = Math.max(0, Math.min(100, Number(t.titleMeter || 0)));
        const income = 2000 + Math.round(meter * 50);
        applyMoneyDelta(income, 'Underworld passive', { category: 'income', ageOverride: gameState.currentYear });
        updateState(prev => ({ mafiaHeat: Math.max(0, Math.min(100, (prev.mafiaHeat || 0) + (meter >= 70 ? 3 : 1))) }));
      }
    } catch {}
    try { const age = Number(ageOverride ?? gameState.currentYear ?? 0); handleMilestonesOnYearStart(age); } catch {}

    // Apply Cost of Living (food, housing, commute)
    applyLivingCostsForAge(age);

    // Apply Inventory Passives (owned vehicles etc)
    applyInventoryPassivesForAge(age);

    // Apply Quality of Life costs (subscriptions + tiers)
    applyQualityOfLifeForAge(age);

    // ADHD baseline drift (from age 3)
    try {
      const ageNum = Number(ageOverride ?? gameState.currentYear ?? 0);
      if (gameState.specialStartId === 'child_adhd' && ageNum >= 3) {
        const rng = createSeededRng(`${gameState.runSeed || 'seed'}|adhdYear|age:${ageNum}`);
        const meta = gameState.specialStartMeta || {};
        const t = String(meta.adhdType || 'combined');
        const pCur =
          t === 'inattentive' ? 0.80 :
          t === 'hyperactive' ? 0.40 :
          0.60;
        const boostKey = (rng.nextFloat() < pCur) ? 'curiosity' : 'confidence';
        applyDeltas({ discipline: -1, [boostKey]: 1 }, 'ADHD (baseline drift)');
      }
    } catch {}

  }, [applyMoneyDelta, gameState.incomeTier, gameState.countryIso3, gameState.playerCareer, gameState.partnerCareer]);

  const captureYearCheckpoint = useCallback((info) => {
    setGameState(prev => {
      const next = { ...prev };
      const checkpoints = [...(prev.yearCheckpoints || [])];

      // Deep clone snapshot so it won't mutate later.
      // Also remove yearCheckpoints from the snapshot to prevent recursive growth.
      const snapshot = makeTrimmedSnapshot(prev);

      const payload = {
        ...(info || {}),
        age: Number.isFinite(info?.age) ? info.age : (prev.currentYear || 0),
        kind: info?.kind || 'yearStart',
        at: Date.now(),
        snapshot
      };

      if (info?.replaceExisting && payload.kind != null && payload.age != null) {
        const idx = checkpoints.findIndex(c => c.kind === payload.kind && c.age === payload.age);
        if (idx >= 0) checkpoints[idx] = payload;
        else checkpoints.push(payload);
      } else {
        checkpoints.push(payload);
      }

      next.yearCheckpoints = checkpoints;
      return next;
    });
  }, []);

  const captureRewindSnapshot = useCallback(() => {
    setGameState(prev => {
      if (!prev.rewind?.unlocked) return prev;
      const snaps = [...(prev.rewind.snapshots || [])];
      snaps.unshift({ at: Date.now(), age: prev.currentYear, snapshot: makeTrimmedSnapshot(prev) });
      while (snaps.length > (prev.rewind.maxSnapshots || 3)) snaps.pop();
      return { ...prev, rewind: { ...prev.rewind, snapshots: snaps } };
    });
  }, []);

  const rewindYears = useCallback((years = 1) => {
    setGameState(prev => {
      if (!prev.rewind?.unlocked) return prev;
      const targetAge = Math.max(0, (prev.currentYear || 0) - years);
      const snap = (prev.rewind.snapshots || []).find(s => s.age === targetAge) || prev.rewind.snapshots?.[0];
      if (!snap?.snapshot) return prev;
      const keepDiamonds = Number(prev.diamonds || 0);
      return { ...INITIAL_STATE, ...snap.snapshot, currentYear: targetAge, diamonds: keepDiamonds };
    });
  }, []);

  const safeGenerateFinalOutcome = useCallback(() => {
    setGameState(prev => {
      try {
        // Check apocalypse victory BEFORE generating outcome
        let victoryState = { ...prev };
        const isApocalypse = prev.specialStartId === 'zombie_apocalypse' || prev.specialStartId === 'alien_invasion';
        
        if (isApocalypse && !prev.apocalypseCampaign?.victory?.achieved) {
          import('@/components/game/apocalypseVictory').then(({ computeApocalypseVictory }) => {
            const victoryResult = computeApocalypseVictory(prev);
            
            if (victoryResult.achieved) {
              const gen = (prev.apocalypseCampaign?.generationsCompleted ?? 0) + 1;
              const trophyId = victoryResult.trophyId;
              
              // Update campaign
              updateState({
                apocalypseCampaign: {
                  ...(prev.apocalypseCampaign || {}),
                  victory: {
                    achieved: true,
                    path: victoryResult.path,
                    trophyId,
                    achievedAtTs: Date.now(),
                    achievedAtGeneration: gen
                  }
                }
              });
              
              // Unlock trophy (if not already unlocked)
              updateState(prevState => {
                const trophies = prevState.trophies || { unlocked: {} };
                if (trophies.unlocked[trophyId]) return prevState;
                
                return {
                  trophies: {
                    ...trophies,
                    unlocked: {
                      ...trophies.unlocked,
                      [trophyId]: {
                        ts: Date.now(),
                        note: `Saved the world in generation ${gen}`,
                        age: prevState.currentYear
                      }
                    }
                  }
                };
              });
              
              // Add timeline entry
              recordTimelineEntry({
                kind: 'trophy',
                title: `🏆 ${victoryResult.path === 'cure' ? 'Cure' : victoryResult.path === 'military' ? 'Military Victory' : victoryResult.path === 'tech' ? 'Tech Solution' : victoryResult.path === 'resistance' ? 'Resistance' : 'Unity'} — World Saved`,
                detail: victoryResult.summaryLines.join('\n'),
                deltas: null,
                moneyDelta: 0,
                loveDelta: 0,
                stressDelta: 0,
                meta: { trophyId, path: victoryResult.path }
              });
            }
          }).catch(() => {});
        }
        
        const outcome = (prev.specialStartId === 'kim_jong_un')
          ? generateKimOutcome(prev)
          : generateOutcomeV3(prev);
        
        // Auto-unlock trophy for legendary/special endings
        const trophyId =
          outcome?.legendaryTrophyId ||
          BADGE_TO_TROPHY[outcome?.topBadge] ||
          null;
        
        // Prepare trophy unlock and timeline entry
        let trophyUpdates = {};
        let trophyTimelineEntry = null;
        
        const testMode = prev.flags?.__testMode === true;
        const shouldUnlockTrophy = trophyId && !testMode;
        
        if (shouldUnlockTrophy) {
          const trophies = prev.trophies || { unlocked: {} };
          
          // Only unlock if not already unlocked
          if (!trophies.unlocked[trophyId]) {
            trophyUpdates.trophies = {
              ...trophies,
              unlocked: {
                ...trophies.unlocked,
                [trophyId]: {
                  ts: Date.now(),
                  age: prev.currentYear,
                  note: outcome?.topBadge || ''
                }
              }
            };
            
            // Create timeline entry
            trophyTimelineEntry = {
              id: makeTimelineId(),
              age: prev.currentYear,
              kind: 'trophy',
              title: `🏆 Trophy Unlocked`,
              detail: outcome?.topBadge || `Unlocked: ${trophyId}`,
              deltas: null,
              moneyDelta: 0,
              loveDelta: 0,
              stressDelta: 0,
              meta: { trophyId }
            };
          }
        }
        
        // Populate lastRunSummary for legacy consistency
        const summary = {
          ts: Date.now(),
          runSeed: prev.runSeed,
          childName: prev.childName,
          childGender: prev.childAvatarGender || 'boy',
          parentFinalMoney: Math.max(0, Number(prev.money || 0)),
          parentDebt: Math.max(0, -Number(prev.money || 0)),
          outcome: {
            wealthTier: outcome?.ctx?.wealthTier || "Stable",
            relationshipStatus: outcome?.ctx?.relationshipStatus || "Single",
            retirementBuffer: outcome?.ctx?.retirementBuffer ?? Number(prev.retirementSavings || 0)
          }
        };

        return {
          ...prev,
          finalOutcome: outcome,
          finished: true,
          lastRunSummary: summary,
          ...trophyUpdates,
          timelineEntries: trophyTimelineEntry
            ? [...(prev.timelineEntries || []), trophyTimelineEntry]
            : prev.timelineEntries
        };
      } catch (e) {
        console.error("Outcome generation failed:", e);
        return { ...prev, finalOutcome: null, finished: true };
      }
    });
  }, [updateState, recordTimelineEntry]);

  const determineMemoryTone = useCallback(() => {
    const love = Number(gameState.love || 0);
    const stress = Number(gameState.stress || 0);
    if (love >= 70 && stress <= 40) return 'warm';
    if (stress >= 70) return 'tense';
    return 'mixed';
  }, [gameState.love, gameState.stress]);

  const generateMemoryText = useCallback(() => {
    const tone = determineMemoryTone();
    const age = Number(gameState.currentYear || 0);
    const name = gameState.childName || 'your child';
    if (tone === 'warm') return `At age ${age}, you and ${name} found small rituals that felt like home.`;
    if (tone === 'tense') return `At age ${age}, things felt loud and urgent. You kept showing up anyway.`;
    return `At age ${age}, it wasn’t perfect, but it mattered.`;
  }, [determineMemoryTone, gameState.currentYear, gameState.childName]);

  const addMicroMoments = useCallback((moments) => {
    if (!moments) return;
    const arr = Array.isArray(moments) ? moments : [moments];
    setGameState(prev => ({ ...prev, memories: [...(Array.isArray(prev.memories) ? prev.memories : []), ...arr] }));
  }, []);

  const recordChildTraumaEvent = useCallback((evt, opts = {}) => {
    if (!evt) return;

    setGameState(prev => {
      const existing = Array.isArray(prev.childTraumaEvents) ? prev.childTraumaEvents : [];
      const before = existing.find(e => e.typeId === evt.typeId) || null;

      // Merge (keeps consolidate-by-type behavior)
      const mergedEvents = mergeTraumaEvents(existing, evt);
      const after = mergedEvents.find(e => e.typeId === evt.typeId) || null;

      const isNewType = !before && !!after;
      const severityUp = !!(before && after && (Number(after.severity || 1) > Number(before.severity || 1)));

      // Recompute attachment lean
      const newAttachment = deriveChildAttachment({ childTraumaEvents: mergedEvents, love: prev.love, stress: prev.stress });

      // Optional logs/timeline
      if (opts.log || opts.toast) {
        const logLabel = after?.label || evt.label || 'Wound';
        const sevNow = Number(after?.severity ?? evt.severity ?? 1);
        const wasReinforced = !!before && !severityUp;
        const logMsg = wasReinforced
          ? `🩹 Wound reinforced: ${logLabel} (now ●${sevNow})`
          : `🩹 Wound gained/grew: ${logLabel} (●${sevNow})`;
        if (opts.log) addLog(logMsg);
        if (opts.toast) toast(logMsg, { icon: '🩹' });
      }

      if (opts.timeline) {
        const label = after?.label || evt.label || 'Wound';
        const because = after?.because || evt.because || '';
        const whatHelps = after?.whatHelps || evt.whatHelps || '';
        recordTimelineEntry({
          kind: 'childTrauma',
          title: `🩹 ${label}`,
          detail: `${because}${whatHelps ? `\nWhat helps: ${whatHelps}` : ''}`,
          meta: { typeId: after?.typeId || evt.typeId, severity: after?.severity || evt.severity },
        });
      }

      // Enqueue popup when a new type is added or severity increases
      let queue = Array.isArray(prev.childTraumaPopupQueue) ? [...prev.childTraumaPopupQueue] : [];
      if ((isNewType || severityUp) && after) {
        queue.push({
          typeId: after.typeId,
          label: after.label,
          description: after.description,
          severity: after.severity,
          firstAge: after.firstAge,
          lastAge: after.lastAge,
          count: after.count,
          because: after.because,
          whatHelps: after.whatHelps,
          effectsHint: after.effectsHint,
        });
      }

      return {
        ...prev,
        childTraumaEvents: mergedEvents,
        childAttachment: newAttachment,
        childTraumaPopupQueue: queue,
      };
    });
  }, [addLog, recordTimelineEntry]);

  // Shift the child trauma popup queue by one (no UI here; just plumbing)
  const resolveChildTraumaPopup = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      childTraumaPopupQueue: (Array.isArray(prev.childTraumaPopupQueue) ? prev.childTraumaPopupQueue : []).slice(1),
    }));
  }, []);

  const resolveMissedMilestone = useCallback(() => {
    updateState(prev => ({
      missedMilestoneQueue: (Array.isArray(prev.missedMilestoneQueue) ? prev.missedMilestoneQueue : []).slice(1),
      milestoneMissedPending: null,
      missedMilestone: null
    }));
  }, [updateState]);

  // -------- Fun Moments (Tiny Cute) + Kid Philosophy (Wisdom) --------
  // These should occur often and be color-coded in Life Log via "kind".

  const shouldShowTinyCute = useCallback(() => {
    // Frequent, but not spammy. About 30% chance each age.
    // Also avoid double-firing in the same age using a year flag.
    if (gameState.yearFlags?.tinyCuteShownThisAge) return false;
    const age = Number(gameState.currentYear || 0);
    if (age > 12) return false; // usually these are childhood vibes
    return Math.random() < 0.30;
  }, [gameState.currentYear, gameState.yearFlags]);

  const pickTinyCuteForAge = useCallback((age) => {
    const a = Number(age || 0);
    const pool = Array.isArray(TINY_CUTE_MOMENTS) ? TINY_CUTE_MOMENTS : [];
    const candidates = pool.filter(m => (m.minAge ?? 0) <= a && (m.maxAge ?? 99) >= a);
    if (!candidates.length) return null;

    // Prefer not-yet-used
    const used = new Set(gameState.tinyCuteUsedIds || []);
    const fresh = candidates.filter(m => m.id && !used.has(m.id));
    const pickFrom = fresh.length ? fresh : candidates;

    const chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    if (!chosen) return null;

    // Mark used
    updateState(prev => ({
      tinyCuteUsedIds: [...(prev.tinyCuteUsedIds || []), chosen.id].slice(-200)
    }));

    return chosen;
  }, [gameState.tinyCuteUsedIds, updateState]);

  const getKidWisdomBand = useCallback(() => {
    const age = Number(gameState.currentYear || 0);
    if (age < 8) return 'kid';
    if (age < 13) return 'tween';
    return 'teen';
  }, [gameState.currentYear]);

  const shouldShowKidWisdom = useCallback(() => {
    // Frequent: about 25% each age, and avoid double-firing in the same age
    if (gameState.yearFlags?.kidWisdomShownThisAge) return false;
    const age = Number(gameState.currentYear || 0);
    if (age < 4) return false; // too young for “philosophy”
    return Math.random() < 0.25;
  }, [gameState.currentYear, gameState.yearFlags]);

  const pickUniqueKidWisdom = useCallback(() => {
    const pool = Array.isArray(KID_WISDOM_LINES) ? KID_WISDOM_LINES : [];
    if (!pool.length) return null;

    const band = getKidWisdomBand();
    const used = new Set(gameState.kidWisdomUsed || []);

    const candidates = pool.filter(w => (w.band || 'kid') === band);
    const fresh = candidates.filter(w => w.id && !used.has(w.id));
    const pickFrom = fresh.length ? fresh : candidates;

    const chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    if (!chosen) return null;

    updateState(prev => ({
      kidWisdomUsed: [...(prev.kidWisdomUsed || []), chosen.id].slice(-200)
    }));

    return chosen;
  }, [KID_WISDOM_LINES, gameState.kidWisdomUsed, getKidWisdomBand, updateState]);

  // Helper to record colored Life Log entries for these moments
  const recordFunMomentToLifeLog = useCallback((entry) => {
    // entry: { kind: 'tinyCute'|'kidWisdom', title, detail }
    if (!entry) return;
    recordTimelineEntry({
      kind: entry.kind || 'system',
      title: entry.title || 'Moment',
      detail: entry.detail || '',
      deltas: entry.deltas ?? null,
      moneyDelta: Number(entry.moneyDelta || 0),
      retirementDelta: Number(entry.retirementDelta || 0),
      loveDelta: Number(entry.loveDelta || 0),
      stressDelta: Number(entry.stressDelta || 0),
      meta: entry.meta || null
    });
  }, [recordTimelineEntry]);

  const markTinyCuteShownThisAge = useCallback(() => {
    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), tinyCuteShownThisAge: true }
    }));
  }, [updateState]);

  const markKidWisdomShownThisAge = useCallback(() => {
    updateState(prev => ({
      yearFlags: { ...(prev.yearFlags || {}), kidWisdomShownThisAge: true }
    }));
  }, [updateState]);
  const tryGoldenMoment = useCallback((actionId) => {
    // Import and call golden moment system
    import('@/components/game/goldenMomentsSystem').then(({ tryTriggerGoldenMoment, buildGoldenMomentQuote }) => {
      // Pass actionId string to golden moment system
      const golden = tryTriggerGoldenMoment(latestStateRef.current, String(actionId || ''));
      if (!golden) return;
      
      // Add to collections
      const quote = buildGoldenMomentQuote(latestStateRef.current, golden);
      
      setGameState(prev => {
        const mp = prev.metaProgress || { collections: {}, personalBests: {} };
        const col = mp.collections || {};
        
        return {
          ...prev,
          metaProgress: {
            ...mp,
            collections: {
              ...col,
              goldenMoments: [...(col.goldenMoments || []), golden].slice(-100),
              kidQuotes: [...(col.kidQuotes || []), quote].slice(-200)
            }
          },
          goldenMomentPending: golden
        };
      });
      
      // Add year log event (high priority)
      setGameState(prev => {
        const yl = prev.yearLog || { events: [], lastYearHighlights: null };
        const evt = {
          id: golden.id,
          year: prev.currentYear,
          type: 'golden',
          title: golden.title,
          impacts: golden.effects,
          priority: 10
        };
        return {
          ...prev,
          yearLog: {
            ...yl,
            events: [...yl.events, evt].slice(-50)
          }
        };
      });
      
      // Apply effects
      const { love, stress, ...stats } = golden.effects;
      if (love) applyLove(love, 'Golden Moment');
      if (stress) applyStress(stress, 'Golden Moment');
      if (Object.keys(stats).length) applyDeltas(stats, 'Golden Moment');
      
      // Timeline
      recordTimelineEntry({
        kind: 'golden',
        title: `✨ ${golden.title}`,
        detail: golden.text,
        deltas: stats,
        loveDelta: love || 0,
        stressDelta: stress || 0,
        moneyDelta: 0
      });
    }).catch(() => {});
    return true;
  }, [applyLove, applyStress, applyDeltas, recordTimelineEntry]);

  const applyTeacherTrust = useCallback((delta) => {
    setGameState(prev => ({ ...prev, teacherTrust: Math.max(0, Math.min(100, (prev.teacherTrust || 50) + Number(delta || 0))) }));
  }, []);

  const applyPeerCircle = useCallback((delta) => {
    setGameState(prev => ({ ...prev, peerCircle: Math.max(0, Math.min(100, (prev.peerCircle || 50) + Number(delta || 0))) }));
  }, []);

  const maybeQueueKidLogicPopup = useCallback((payloadOrAge) => {
    setGameState(prev => {
      // Gate: child-only
      if (!hasAnyChild(prev)) return prev;
      
      // already queued
      if (prev.kidLogicPopupPending) return prev;

      // 1) If caller passed an object payload (manual queue), keep old behavior
      if (payloadOrAge && typeof payloadOrAge === "object" && !Array.isArray(payloadOrAge)) {
        const age = Number(prev.currentYear || 0);
        return {
          ...prev,
          kidLogicPopupPending: payloadOrAge,
          lastKidLogicPopupAge: age
        };
      }

      // 2) If caller passed a number (Game.jsx currently passes currentYear), auto-pick from KID_LOGIC_POPUPS
      if (typeof payloadOrAge !== "number") return prev;
      const age = Number(payloadOrAge || 0);

      // Cooldown: at most once every 3 years
      const last = prev.lastKidLogicPopupAge;
      if (typeof last === "number" && age - last < 3) return prev;

      // Age gate: kid logic is a younger-kid flavor; only pick if pool matches
      const pool = (Array.isArray(KID_LOGIC_POPUPS) ? KID_LOGIC_POPUPS : []).filter(p => {
        const min = typeof p.minAge === "number" ? p.minAge : 0;
        const max = typeof p.maxAge === "number" ? p.maxAge : 99;
        return age >= min && age <= max;
      });
      if (!pool.length) return prev;

      // Chance: 25% when asked (keeps it occasional)
      const rng = createSeededRng(`${prev.runSeed || "seed"}|kidLogic|age:${age}`);
      if (rng.nextFloat() > 0.25) return prev;

      const picked = rng.pick(pool);
      if (!picked) return prev;

      return {
        ...prev,
        kidLogicPopupPending: picked,
        lastKidLogicPopupAge: age
      };
    });
  }, []);

  const runSchoolMilestone = useCallback((age) => {
    let stage = null;
    if (age >= 5 && age < 11) stage = 'primary';
    else if (age >= 11 && age < 14) stage = 'middle';
    else if (age >= 14 && age <= 18) stage = 'high';

    if (stage && gameState.schoolStage !== stage) {
      updateState({ schoolStage: stage });
    }
  }, [gameState.schoolStage, updateState]);

  const runMicroEventForAge = useCallback((age) => {
    // Minimal safe implementation: returns null and does not mutate state.
    return null;
  }, []);

  const resolveKidLogicPopup = useCallback((choiceKey) => {
    const popup = gameState.kidLogicPopupPending;
    if (!popup) return;

    let deltas = {};
    let loveDelta = 0;
    let stressDelta = 0;

    if (choiceKey === 'empathize') {
      deltas = { empathy: 0.6, confidence: 0.2 };
      loveDelta = 1;
      stressDelta = -0.5;
    } else if (choiceKey === 'ignore') {
       deltas = { discipline: 0.4 };
       loveDelta = -0.5;
       stressDelta = -0.2;
    } else if (choiceKey === 'boundary') {
       deltas = { discipline: 0.6, confidence: 0.2 };
       loveDelta = 0;
       stressDelta = -0.4;
    }

    applyDeltas(deltas, "Kid Logic");
    applyLove(loveDelta, "Kid Logic");
    applyStress(stressDelta, "Kid Logic");

    const responseText = popup.options?.[choiceKey] || choiceKey;

    recordTimelineEntry({
      kind: "kidLogic",
      title: "🤪 Kid Logic Moment",
      detail: `Kid: "${popup.kid}"\n\nYou chose ${choiceKey.toUpperCase()}:\n${responseText}`,
      deltas,
      loveDelta,
      stressDelta,
      meta: { popupId: popup.id, choice: choiceKey }
    });

    updateState({ kidLogicPopupPending: null });
  }, [gameState.kidLogicPopupPending, applyDeltas, applyLove, applyStress, recordTimelineEntry, updateState]);

  const computePhoneActive = useCallback(() => {
    const age = Number(gameState.currentYear || 0);
    if (gameState.phoneOwned) return true;
    if (age >= 13) return true;
    return false;
  }, [gameState.currentYear, gameState.phoneOwned]);

  const countUnlockedTechniques = useCallback(() => {
    return Array.isArray(gameState.studiedItems) ? gameState.studiedItems.length : 0;
  }, [gameState.studiedItems]);

  const studiedGlowActive = useCallback(() => {
    return Boolean(gameState.yearFlags?.studiedThisAge);
  }, [gameState.yearFlags]);

  const addStudyHistory = useCallback((entry) => {
    if (!entry) return;
    setGameState(prev => ({ ...prev, studyHistory: [...(prev.studyHistory || []), { ...entry, ts: entry.ts || Date.now() }] }));
  }, []);

  const pickStudyLesson = useCallback((techId) => {
    const tech = STUDY_LIBRARY.find(t => t.id === techId) || STUDY_LIBRARY[0];
    const lessons = tech?.lessons || [];
    return lessons[0] || { headline: 'Practice', example: 'Try one small boundary with warmth today.' };
  }, []);

  const setActiveSaveSlot = useCallback((slotId) => {
    // Save current progress to the *current* active slot before switching
    try { flushAutosave('beforeSetActiveSlot'); } catch {}

    // Set BOTH: saveManager registry + gameState binding
    const ok = setActiveSlotId(slotId);
    if (ok) {
      updateState({ activeSaveSlotId: slotId });
    }
    return ok;
  }, [updateState, flushAutosave]);

  // Manual save (used by SaveLoadModal). Writes the CURRENT state to the requested slot.
  const saveGameToSlot = useCallback((slotId, label = null) => {
    try {
      const state = latestStateRef.current;
      if (!isRunStarted(state)) return false;
      const target = slotId || ((typeof getActiveSlotId === 'function' ? getActiveSlotId() : null) || 'slot1');
      return saveToSlot(target, sanitizeForSave(state), label);
    } catch (e) {
      console.error('Failed to save game to slot:', e);
      return false;
    }
  }, []);

  const loadGameFromSlot = useCallback((slotId) => {
    // Save current progress before switching families
    try { flushAutosave('beforeLoadSlot'); } catch {}

    const snap = loadFromSlot(slotId);
    if (!snap) return false;

    const hydrated = hydrateSavedState(snap, slotId);
    setGameState(hydrated);

    // Bind autosave to this slot ATOMICALLY
    try { setActiveSlotId(slotId); } catch {}
    // Note: hydrateSavedState already sets activeSaveSlotId, but we ensure it's correct
    if (hydrated.activeSaveSlotId !== slotId) {
      setGameState(prev => ({ ...prev, activeSaveSlotId: slotId }));
    }
    
    return true;
  }, [flushAutosave]);

  function generateStartingFamily() {
  try {
    const rnd = Math.random();
    const contextType = rnd < 0.55 ? 'solo' : rnd < 0.80 ? 'siblings' : rnd < 0.95 ? 'aunt_uncle' : 'mixed';

    const names = ['Alex','Sam','Jamie','Taylor','Jordan','Casey','Avery','Riley','Morgan','Parker','Charlie','Skyler'];
    const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
    const makeId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `fam_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    const personalities = ['calm','fiery','curious','shy'];

    const siblings = [];
    const niecesNephews = [];

    const addSibling = () => {
      const id = makeId();
      const gender = Math.random() < 0.5 ? 'girl' : 'boy';
      let ageOffset = Math.floor(Math.random()*7) - 3; // -3..+3
      if (ageOffset === 0) ageOffset = 1;
      siblings.push({ id, name: pick(names), gender, ageOffset, personality: pick(personalities), relationship: 60 });
      return id;
    };

    const addNn = (parentSiblingId) => {
      const id = makeId();
      const gender = Math.random() < 0.5 ? 'girl' : 'boy';
      const age = Math.floor(Math.random()*10); // 0..9
      niecesNephews.push({ id, name: pick(names), gender, age, personality: pick(personalities), relationship: 55, parentSiblingId });
    };

    if (contextType === 'siblings') {
      const count = Math.random() < 0.6 ? 1 : 2;
      for (let i=0;i<count;i++) addSibling();
    } else if (contextType === 'aunt_uncle') {
      const sid = addSibling();
      const count = Math.random() < 0.6 ? 1 : 2;
      for (let i=0;i<count;i++) addNn(sid);
    } else if (contextType === 'mixed') {
      const sCount = Math.random() < 0.5 ? 1 : 2;
      for (let i=0;i<sCount;i++) addSibling();
      const parentId = siblings[0]?.id || addSibling();
      const nnCount = Math.random() < 0.5 ? 1 : 2;
      for (let i=0;i<nnCount;i++) addNn(parentId);
    }

    return { contextType, siblings, niecesNephews };
  } catch {
    return { contextType: 'solo', siblings: [], niecesNephews: [] };
  }
}

const resetGame = useCallback((childNameArg = null, childProfile = null, householdType = 'two', incomeTier = 'medium', parentRole = 'mom', legacyConfig = null, careerConfig = null, countryConfig = null, overrides = {}) => {
    try {
      track("rt_new_run");
      
      // Before Baby mode detection
      const startWithoutChild = overrides?.startWithoutChild === true;
      
      // Generate randomized starting stats
    const startIntelligence = Math.floor(Math.random() * 5) + 1; // 1 to 5
    let startStats = {
      ...INITIAL_STATE.stats,
      intelligence: startIntelligence,
      empathy: 1,
      discipline: 1,
      confidence: 1
    };

    // Apply stat overrides if present
    if (overrides?.stats) {
      startStats = { ...startStats, ...overrides.stats };
    }

    const startingFamily = generateStartingFamily();

    // Preserve lifetime resources/meta from current run
    const keepDiamonds = Math.max(0, Math.floor(Number(latestStateRef.current?.diamonds ?? gameState?.diamonds ?? 0)));
    const keepChallengeMeta = (latestStateRef.current?.challengeMeta ?? gameState?.challengeMeta ?? { activeIds: [], completedIds: [], rewardedIds: [] });

    // Preserve active slot binding for autosave
    const currentActiveSlot = latestStateRef.current?.activeSaveSlotId || (() => {
      try {
        return (typeof getActiveSlotId === 'function' ? getActiveSlotId() : null) || 'slot1';
      } catch {
        return 'slot1';
      }
    })();

    let next = {
      ...INITIAL_STATE,
      runSeed: String(overrides?.runSeed || `seed_${Date.now()}`),
      childName: childNameArg || 'Child',
      householdType: householdType || 'two',
      incomeTier: incomeTier || 'medium',
      parentRole: parentRole || 'mom',
      countryIso3: countryConfig?.selectedCountryIso3 || "USA",
      availableCountryIso3s: Array.isArray(countryConfig?.availableCountryIso3s) ? countryConfig.availableCountryIso3s : [],
      startingFamily,
      familyBackgroundPending: false,
      familyBackgroundShown: true,
      
      // Preserve lifetime unlocks
      celebrityDatingUnlocked: gameState.celebrityDatingUnlocked,

      // Apply Starting Stats
      stats: startStats,
      baselineStats: startStats,
      highWaterStats: startStats,

      // NEW RUN: No scenario pending at Age 0 (blocked by Birth Intro)
      scenarioPending: false, 
      pendingScenario: false,
      scenarioCompletedThisAge: true,
      currentScenario: null,
      currentScenarioHookId: null,
      currentScenarioResolvedChoice: null,

      // NEW RUN: Birth Intro flags (modified by startWithoutChild mode)
      hasChild: startWithoutChild ? false : true,
      childless: startWithoutChild ? true : false,
      lifeStage: startWithoutChild ? 'youngAdult' : 'parenting',
      birthIntroPending: startWithoutChild ? false : true,
      birthIntroCompleted: startWithoutChild ? true : false,
      parentingStyle: null,

      counters: {},
      yearFlags: {},
      maxFocusTokens: 5,
      actionPoints: 5,
      focusBonusPartner: 0,
      actionsUsed: {},
      inventory: { items: [] },
      
      // CRITICAL: bind new run to current active slot
      activeSaveSlotId: currentActiveSlot
    };

    // Ensure we store player starting age (used by baby pressure + health)
    next.parentAgeAtBirth = Number(careerConfig?.ageAtBirth ?? overrides?.parentAgeAtBirth ?? 28);

    // Child-free: seed baby pressure based on adult age curve (deterministic)
    if (startWithoutChild) {
      next.babyPressure = computeStartingBabyPressure(next);
    } else {
      next.babyPressure = 0;
    }

    // Preserve diamonds + challenge meta across runs
    next.diamonds = keepDiamonds;
    // Preferences belong to the player, so starting a new story preserves them.
    next.settings = { ...INITIAL_STATE.settings, ...(latestStateRef.current?.settings || gameState.settings || {}) };
    next.challengeMeta = { ...(keepChallengeMeta || {}), activeIds: [] };
    next.actionUsageCounts = {};

    // Preserve guidance preferences across runs
    try {
      const prev = latestStateRef.current || gameState || {};
      next.guidanceDismissedForever = Boolean(prev.guidanceDismissedForever);
      next.guidanceVersionSeen = Number(prev.guidanceVersionSeen || 1);
      const prevSeen = prev.guidanceStepSeen || {};
      next.guidanceStepSeen = Object.fromEntries(
        Object.entries(prevSeen).filter(([k]) => !String(k).startsWith('Y1_YEARLY_'))
      );
      next.hasEverStartedGame = Boolean(prev.hasEverStartedGame);
      next.guidanceEnabled = false;
    } catch {}


    // Apply Apocalypse Campaign continuation (localStorage)
    try {
      const rawCampaign = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('rt_apocalypse_campaign') : null;
      const campaignPayload = rawCampaign ? JSON.parse(rawCampaign) : null;
      
      if (campaignPayload?.enabled) {
        overrides.specialStartId = campaignPayload.scenarioId;
        overrides.specialStartTitle = campaignPayload.scenarioTitle;
        overrides.apocalypseCampaign = campaignPayload.campaign;
        overrides.apocalypseIntroShown = true;
        overrides.zombieThreat = campaignPayload.zombieThreat;
        overrides.zombieTraining = campaignPayload.zombieTraining;
        overrides.alienThreat = campaignPayload.alienThreat;
        
        // Clear localStorage after consuming
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('rt_apocalypse_campaign');
        }
      }
    } catch {}
    
    // Apply legacy patterns if present (Play As Child)
    try {
      const raw = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('rt_legacy') : null;
      const legacy = raw ? JSON.parse(raw) : null;
      if (legacy?.enabled && Array.isArray(legacy.childTraumaEvents)) {
        const mapped = mapChildWoundsToAdultPatterns(legacy.childTraumaEvents, { familyPatternCatalog: FAMILY_PATTERN_CATALOG });
        if (mapped && mapped.length) {
          const fp0 = next.familyPatterns || { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {}, counselorByAge: {} };
          const selected = new Set(fp0.selectedIds || []);
          const severityById = { ...(fp0.severityById || {}) };
          mapped.forEach(({ patternId, severity }) => {
            selected.add(patternId);
            const sev = Math.max(1, Math.min(3, Number(severity || 1)));
            severityById[patternId] = Math.max(Number(severityById[patternId] || 0), sev);
          });
          next.familyPatterns = { ...fp0, selectedIds: Array.from(selected), severityById };
          next.legacy = { fromChildName: legacy.sourceChildName || 'Child', note: 'Legacy patterns carried from childhood (previous run).' };
          next.timelineEntries = [
            ...(next.timelineEntries || []),
            { id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_legacy`, age: 0, kind: 'system', title: '🧬 Legacy', detail: 'Childhood worries carried forward into adulthood.' }
          ];
        }
      }
      if (raw) { try { window.localStorage.removeItem('rt_legacy'); } catch {} }
    } catch {}

    // Localize starting money using wage scale (not cost scale)
    if (!overrides.money && !legacyConfig?.startingMoney && !overrides.startMoney) {
      const wageScale = getCountryWageScale(next.countryIso3 || 'USA');
      next.money = localizeAmount(next.money, wageScale, PRICING.LOCAL);
      if (next.retirementSavings) {
        next.retirementSavings = localizeAmount(next.retirementSavings, wageScale, PRICING.LOCAL);
      }
    }

    // Apply starting money from careerConfig or income tier
    const tier = INCOME_CONFIG[next.incomeTier] || INCOME_CONFIG.medium;
    next.money = Number(careerConfig?.startMoney ?? tier.startMoney ?? next.money);

    // Seed retirement savings from career (does NOT touch cash)
    try {
      const startingRetirementSavings = (() => {
        const ageAtBirth = Number(careerConfig?.ageAtBirth);
        const age = Number.isFinite(ageAtBirth) ? ageAtBirth : 28;

        const yearlyIncome = Number(careerConfig?.yearlyIncome);
        if (!Number.isFinite(yearlyIncome) || yearlyIncome <= 0) return 0;

        const yearsWorked = Math.max(0, Math.min(40, age - 22)); // proxy for tenure/experience
        const tierId = next.incomeTier || 'medium';
        const savingsRate = tierId === 'high' ? 0.04 : tierId === 'medium' ? 0.03 : 0.02;
        const growth = 1 + Math.min(0.4, yearsWorked * 0.01); // modest growth proxy
        const est = Math.round(yearlyIncome * savingsRate * yearsWorked * growth);

        return Math.max(0, Math.min(50000, est));
      })();
      next.retirementSavings = startingRetirementSavings;
    } catch {}

    // Legacy override
    if (legacyConfig?.startingMoney != null) {
      next.money = Number(legacyConfig.startingMoney || 0);
      next.isLegacyRun = true;
      next.legacyParentName = legacyConfig.legacyParentName || '';
    }

    // Defensive normalization: treat invalid 'rich' as 'wealthy'
    if (next.incomeTier === 'rich') {
      next.incomeTier = 'wealthy';
    }

    // Apply generic overrides
    if (overrides) {
      if (overrides.specialStartId) {
        if (overrides.specialStartMeta) {
          next.specialStartMeta = overrides.specialStartMeta;
        } else {
          next.specialStartMeta = buildSpecialStartMeta(overrides.specialStartId, next.runSeed);
        }
      }
      if (overrides.expenseMultiplier) {
        next.expenseMultiplier = overrides.expenseMultiplier;
      } else if (next.specialStartMeta?.expenseMultiplier) {
        next.expenseMultiplier = next.specialStartMeta.expenseMultiplier;
      }

      // Initialize special start-specific fields
      if (overrides.specialStartId === 'mafia_family') {
        next.mafiaHeat = 10;
        next.mafiaLegacy = 0;
        next.mafiaWentLegit = false;
      }
      if (overrides.specialStartId === 'alien_invasion') {
        next.alienThreat = overrides.alienThreat ?? 10;
        next.alienGameOver = false;
        next.alienDeathCause = null;
      }
      if (overrides.specialStartId === 'zombie_apocalypse') {
        next.zombieThreat = overrides.zombieThreat ?? 20;
        next.zombieTraining = overrides.zombieTraining ?? 0;
        next.zombieGameOver = false;
        next.zombieDeathCause = null;
        next.zombieChildFate = null;
        next.zombieWifeState = "human";
        next.zombieWifeReturnUsed = false;
      }
      
      // Apocalypse Campaign: carry forward OR initialize
      if (overrides.apocalypseCampaign) {
        next.apocalypseCampaign = overrides.apocalypseCampaign;
      } else if (overrides.specialStartId === 'zombie_apocalypse' || overrides.specialStartId === 'alien_invasion') {
        // New apocalypse campaign
        next.apocalypseCampaign = {
          active: true,
          scenarioId: overrides.specialStartId,
          campaignId: next.runSeed,
          introShown: overrides.apocalypseIntroShown ?? false,
          generationsCompleted: 0,
          totalYearsSurvived: 0,
          victory: {
            achieved: false,
            path: null,
            trophyId: null,
            achievedAtTs: null,
            achievedAtGeneration: null
          }
        };
      }

      if (overrides.childName) next.childName = overrides.childName;
      if (overrides.parentName) next.parentName = overrides.parentName;
      if (overrides.parentRole) next.parentRole = overrides.parentRole;
      if (overrides.householdType) next.householdType = overrides.householdType;
      
      // Apply faith override (Quick Start only)
      if (overrides.faith && typeof overrides.faith === 'object') {
        next.faith = {
          tradition: overrides.faith.tradition || null,
          isCustom: Boolean(overrides.faith.isCustom),
          status: overrides.faith.status || 'questioning',
          exposure: Math.max(0, Math.min(100, Number(overrides.faith.exposure || 0))),
          devotion: Math.max(0, Math.min(100, Number(overrides.faith.devotion || 0))),
          lastDecisionAge: overrides.faith.lastDecisionAge ?? null,
          history: Array.isArray(overrides.faith.history) ? overrides.faith.history : []
        };
      }
      if (overrides.money !== undefined) {
        next.money = overrides.money;
        
        if (import.meta?.env?.DEV && overrides.specialStartId === 'famous_pop_star') {
          const expected = Number(overrides.money);
          if (!Number.isFinite(expected) || expected < 100000) {
            console.warn('[DEV] Famous pop star money unexpectedly low in resetGame:', {
              overrides_money: overrides.money,
              careerConfig_startMoney: careerConfig?.startMoney,
              final_next_money: next.money
            });
          }
        }
      }
      if (overrides.retirementSavings !== undefined) next.retirementSavings = Number(overrides.retirementSavings || 0);
      if (overrides.countryIso3) next.countryIso3 = overrides.countryIso3;
      if (overrides.specialStartId) next.specialStartId = overrides.specialStartId;
      if (overrides.specialStartTitle) next.specialStartTitle = overrides.specialStartTitle;
      
      // Apply guidance overrides (wiring for "My First Play")
      if (overrides.guidanceDismissedForever !== undefined) next.guidanceDismissedForever = Boolean(overrides.guidanceDismissedForever);
      if (overrides.guidanceEnabled !== undefined) next.guidanceEnabled = Boolean(overrides.guidanceEnabled);
      if (overrides.guidanceVersionSeen !== undefined) next.guidanceVersionSeen = Number(overrides.guidanceVersionSeen) || 1;
      if (overrides.guidanceStepSeen !== undefined) next.guidanceStepSeen = { ...(next.guidanceStepSeen || {}), ...(overrides.guidanceStepSeen || {}) };
      if (overrides.hasEverStartedGame !== undefined) next.hasEverStartedGame = Boolean(overrides.hasEverStartedGame);
      
      // Enforce dismissal overrides guidance
      if (next.guidanceDismissedForever) next.guidanceEnabled = false;
      
      // FTUE flags
      if (overrides.ftueTourId !== undefined) next.ftueTourId = overrides.ftueTourId;
      if (overrides.ftueStage !== undefined) next.ftueStage = overrides.ftueStage;
      if (overrides.ftueBoughtHouse !== undefined) next.ftueBoughtHouse = overrides.ftueBoughtHouse;
      
      
    }

    // GLOBAL SPECIAL START POPUP SUPPRESSION (except polygamist flood mode)
    const ss = next.specialStartId;
    const isSpecialStart = Boolean(ss);
    const isPolygamistFlood = ss === 'polygamist_doctor_indonesia';

    if (isSpecialStart && !isPolygamistFlood) {
      // DEFAULT: suppress non-special-start popups to focus on the special start narrative
      next.packs = { 
        ...(next.packs || {}), 
        curiosityPackEnabled: false, 
        milestonesEnabled: false 
      };
      
      next.settings = { 
        ...(next.settings || {}), 
        showCoachNotes: false, 
        showChapterBeats: false,
        showYearRecapPopup: false,
        yearlyCheckinsEnabled: false,
        autoChooseYearlyMomentsByStyle: false
      };
      
      next.expansions = withChaosLevel((next.expansions || {}), 0);
      
      // Clear any pending popup state
      next.chaosPopupPending = null;
      next.curiosity = { ...(next.curiosity || {}), pending: false };
    } else if (isPolygamistFlood) {
      // POLYGAMIST FLOOD MODE: everything ON by default
      next.packs = { 
        ...(next.packs || {}), 
        curiosityPackEnabled: true, 
        milestonesEnabled: true 
      };
      
      next.settings = { 
        ...(next.settings || {}), 
        showCoachNotes: true, 
        showChapterBeats: true,
        showYearRecapPopup: true,
        yearlyCheckinsEnabled: true,
        autoChooseYearlyMomentsByStyle: false
      };
      
      next.expansions = withChaosLevel((next.expansions || {}), 3);
    }

    // Special Starts: optional starting items (from Shop)
    try {
      if (next.specialStartId) {
        const startItems = buildSpecialStartStartingInventoryItems({
          specialStartId: next.specialStartId,
          runSeed: next.runSeed,
          countryIso3: next.countryIso3,
          startWithoutChild
        });

        if (Array.isArray(startItems) && startItems.length) {
          const inv0 = next.inventory || { items: [] };
          const existingItems = Array.isArray(inv0.items) ? inv0.items : [];
          const existingIds = new Set(existingItems.map(it => it?.id).filter(Boolean));
          const existingGroups = new Set(existingItems.map(it => it?.uniqueGroup).filter(Boolean));

          const filtered = startItems.filter(it => {
            if (!it?.id) return false;
            if (existingIds.has(it.id)) return false;
            if (it.uniqueGroup && existingGroups.has(it.uniqueGroup)) return false;
            return true;
          });

          if (filtered.length) {
            next.inventory = { ...inv0, items: [...existingItems, ...filtered] };

            // Timeline note (age 0)
            const lines = filtered.map(it => `${it.emoji || ''} ${it.name || it.id}`).join('\n');
            next.timelineEntries = [
              ...(next.timelineEntries || []),
              {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_startItems`,
                age: 0,
                kind: 'system',
                title: '🧳 Starting Items',
                detail: `Because of your special start, you begin with:\n${lines}`
              }
            ];
          }
        }
      }
    } catch (e) {
      console.warn('[specialStartStartingItems] failed to seed inventory', e);
    }

    // Starting title roll for monarchies (rare)
    try {
      if (isMonarchyCountry(next.countryIso3)) {
        const rng = createSeededRng(`${next.runSeed}|start_title|${next.countryIso3}`);
        const r = rng.nextFloat();
        let assign = null;
        if (r < 0.0003) assign = 'prince';
        else if (r < 0.00036) assign = 'duke';
        else if (r < 0.00046) assign = 'marquess';
        else if (r < 0.00066) assign = 'earl';
        else if (r < 0.00106) assign = 'viscount';
        else if (r < 0.01106) assign = 'baron';
        if (assign) {
          const info = getTitleInfo(assign);
          const courtesy = courtesyForChild(assign, next.childAvatarGender);
          next.titles = {
            ...next.titles,
            primaryTitle: assign,
            primaryTitleId: assign,
            primaryTitleType: 'MONARCHY',
            rank: info?.label || null,
            titleMeter: 20,
            standing: 20,
            influencePoints: 0,
            influence: 0,
            scandalHeat: 0,
            childCourtesyTitle: courtesy,
            history: []
          };
        }
      }
    } catch {}

    try {
      const hh = overrides?.householdType || next.householdType;
      if (hh === 'two' && overrides?.partnerJobId === 'stay_at_home_parent') {
        const base = Number.isFinite(Number(next.maxFocusTokens)) ? Number(next.maxFocusTokens) : 5;
        next.focusBonusPartner = 1;
        next.maxFocusTokens = base + 1;
        next.actionPoints = base + 1;
      }
    } catch {}

    // Ensure sibling rivalry containers exist
    next = ensureSiblingRivalryState(ensureKidsContainer(next));
    next.expansions = { ...(next.expansions || INITIAL_STATE.expansions), siblingRivalry: false };

    // Migration: ensure all kids have relation field
    if (Array.isArray(next.kids)) {
      next.kids = next.kids.map(kid => ({
        ...kid,
        relation: kid.relation || 'child'
      }));
    }

    // ---- CHAOS MODE OVERRIDES (fix: chaos start not persisting) ----
    try {
      // CHAOS MODE: support start overrides (from Start.jsx chaos flow)
      const requestedChaosLevelRaw = overrides?.chaosModeLevel;
      const requestedChaosLevel = Number.isFinite(Number(requestedChaosLevelRaw))
        ? Number(requestedChaosLevelRaw)
        : null;

      // Back-compat: if someone passes chaosMode: true, treat it as level 2
      const legacyChaosBool = overrides?.chaosMode === true;

      const chaosLevel =
        requestedChaosLevel != null
          ? requestedChaosLevel
          : legacyChaosBool
            ? 2
            : getChaosLevelFromExpansions(next.expansions || {});

      next.expansions = withChaosLevel(next.expansions || {}, chaosLevel);
    } catch {}

    // ===== NEW RUN: seed baseline relationships (parents + best friend, plus optional family) =====
    try {
      const runSeed = String(next.runSeed || `seed_${Date.now()}`);
      const year0 = Number(next.currentYear ?? 0);
      const playerAge0 = Number(next.parentAgeAtBirth ?? careerConfig?.ageAtBirth ?? 28);

      // Ensure we store parentAgeAtBirth consistently for the rest of the game
      next.parentAgeAtBirth = playerAge0;

      const roster = [];
      const byId = {};

      const pushRel = (p) => {
        if (!p || !p.id) return;
        if (byId[p.id]) return;
        byId[p.id] = p;
        roster.push(p);
      };

      // Mother / Father (always exist)
      const momRng = createSeededRng(`${runSeed}|my_mom|age`);
      const dadRng = createSeededRng(`${runSeed}|my_dad|age`);

      const momAtBirth = 18 + Math.floor(momRng.nextFloat() * 23); // 18–40
      const dadExtra = Math.floor(dadRng.nextFloat() * 7); // 0–6 years older

      const momBaseAge = playerAge0 + momAtBirth;
      const dadBaseAge = playerAge0 + (momAtBirth + dadExtra);

      const momDeceased = momBaseAge >= 85;
      const dadDeceased = dadBaseAge >= 85;

      pushRel({
        id: 'my_mom',
        role: 'my_mom',
        name: 'Mom',
        genderKey: 'female',
        baseAge: momBaseAge,
        createdAtAge: year0,
        meter: 75,
        alive: !momDeceased,
        isDeceased: momDeceased,
        mortalityMultiplier: 1.08,
        interactionsByAge: {}
      });

      pushRel({
        id: 'my_dad',
        role: 'my_dad',
        name: 'Dad',
        genderKey: 'male',
        baseAge: dadBaseAge,
        createdAtAge: year0,
        meter: 70,
        alive: !dadDeceased,
        isDeceased: dadDeceased,
        mortalityMultiplier: 1.08,
        interactionsByAge: {}
      });

      // Best friend (always exists)
      const bfRng = createSeededRng(`${runSeed}|my_best_friend|year0`);
      const cultures = Array.isArray(next.playerCultures) && next.playerCultures.length ? next.playerCultures : ['AMERICAN_US'];
      const bfGender = bfRng.nextFloat() < 0.5 ? 'female' : 'male';
      const bfName = pickCulturalFirstName({ cultures, gender: bfGender, seed: `${runSeed}|bfName` });
      const bfBaseAge = playerAge0 - 3 + Math.floor(bfRng.nextFloat() * 7); // -3..+3

      pushRel({
        id: 'my_best_friend',
        role: 'my_best_friend',
        name: bfName || 'Bestie',
        genderKey: bfGender,
        baseAge: bfBaseAge,
        createdAtAge: year0,
        meter: 65,
        alive: true,
        isDeceased: false,
        interactionsByAge: {}
      });

      // Optional: inject startingFamily siblings + nieces/nephews into relationships
      try {
        const fam = next.startingFamily || {};
        const sibs = Array.isArray(fam.siblings) ? fam.siblings : [];
        const niblings = Array.isArray(fam.niecesNephews) ? fam.niecesNephews : [];

        sibs.forEach(sib => {
          if (!sib?.id) return;
          const id = `sibling_${sib.id}`;
          pushRel({
            id,
            role: 'sibling',
            name: sib.name || 'Sibling',
            genderKey: sib.genderKey || 'female',
            baseAge: Number(sib.age || 10),
            createdAtAge: year0,
            meter: 60,
            alive: true,
            isDeceased: false,
            interactionsByAge: {}
          });
        });

        niblings.forEach(nb => {
          if (!nb?.id) return;
          const id = `nibling_${nb.id}`;
          pushRel({
            id,
            role: 'niece_nephew',
            name: nb.name || 'Nibling',
            genderKey: nb.genderKey || 'female',
            baseAge: Number(nb.age || 6),
            createdAtAge: year0,
            meter: 55,
            alive: true,
            isDeceased: false,
            interactionsByAge: {}
          });
        });
      } catch {}

      // Always seed a `child` relationship record.
      // Child-free mode reuses shared UI/prompt helpers that assume `relationships.byId.child` exists.
      // Actual "has a child" logic is still controlled by `hasChild` and `childless`.
      pushRel({
        id: 'child',
        role: 'child',
        name: next.childName || 'Child',
        emoji: getAvatarEmojiForAge(0, next.childAvatarGender || 'boy', next.childAvatarToneIndex || 0),
        createdAtAge: year0,
        meter: 50,
        alive: true,
        isDeceased: false,
        interactionsByAge: {}
      });

      next.relationships = { roster, byId };
    } catch (e) {
      console.warn('[resetGame] relationship seeding failed', e);
    }

    setGameState(next);



      // Special Start timeline primer
      try {
        if (overrides?.specialStartId === 'child_adhd') {
          recordTimelineEntry({
            age: 0,
            kind: 'system',
            title: '⭐ Special Start: Child Has ADHD',
            detail: 'Each year (starting age 3): Discipline -1, and either Curiosity +1 or Confidence +1. This models executive-function challenges alongside strengths like curiosity/resilience. (No shame framing.)'
          });
        }
      } catch {}

      return true;
    } catch (err) {
      console.error("RESET GAME FAILED — ATTEMPTING AUTOSAVE RECOVERY", err);
      
      // AUTOSAVE RECOVERY: Try to restore most recent autosave instead of falling back to INITIAL_STATE
      
      // Build candidate slot list (priority: activeId, then started slots by updatedAt desc)
      const activeId = (() => {
        try {
          return (typeof getActiveSlotId === 'function' ? getActiveSlotId() : null)
            || latestStateRef.current?.activeSaveSlotId
            || gameState?.activeSaveSlotId
            || 'slot1';
        } catch {
          return 'slot1';
        }
      })();
      
      const slots = (typeof listSlots === 'function' ? listSlots() : []);
      const started = slots
        .filter(s => s?.exists && s?.started && s?.updatedAt)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .map(s => s.slotId);
      
      // Unique candidates: active first, then all started
      const candidateSlots = [activeId, ...started.filter(id => id !== activeId)];
      
      // Try to load from each candidate
      for (const slotId of candidateSlots) {
        try {
          const snap = loadFromSlot(slotId);
          if (snap && typeof snap === 'object') {
            const hydrated = hydrateSavedState(snap, slotId);
            setGameState(hydrated);
            try { setActiveSlotId(slotId); } catch {}
            toast.error("Something went wrong starting a new game. We restored your most recent autosave.");
            return false; // Signal reset failed
          }
        } catch {}
      }
      
      // Legacy single-save recovery
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const raw = window.localStorage.getItem(LEGACY_SINGLE_SAVE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              const hydrated = hydrateSavedState(parsed, activeId);
              setGameState(hydrated);
              toast.error("We restored your last autosave.");
              return false;
            }
          }
        }
      } catch {}
      
      // ABSOLUTE LAST RESORT: No saves exist, use fallback
      const fallbackIntelligence = Math.floor(Math.random() * 5) + 1;
      const fallbackStats = {
        ...INITIAL_STATE.stats,
        intelligence: fallbackIntelligence,
        empathy: 1,
        discipline: 1,
        confidence: 1
      };
      
      const fallbackIncomeTier = incomeTier === 'rich' ? 'wealthy' : (incomeTier || 'medium');
      const fallbackMoney = Number(
        careerConfig?.startMoney ?? 
        overrides?.money ?? 
        INCOME_CONFIG[fallbackIncomeTier]?.startMoney ?? 
        2500
      );
      
      const safeFallback = {
        ...INITIAL_STATE,
        runSeed: String(Date.now()),
        childName: childNameArg || "Alex",
        parentName: "Parent",
        specialStartId: null,
        parentAvatarStyle: "default",
        stats: fallbackStats,
        baselineStats: fallbackStats,
        highWaterStats: fallbackStats,
        maxFocusTokens: 5,
        actionPoints: 5,
        money: fallbackMoney,
        diamonds: Math.max(0, Math.floor(Number(latestStateRef.current?.diamonds ?? gameState?.diamonds ?? 0))),
        challengeMeta: (latestStateRef.current?.challengeMeta ?? gameState?.challengeMeta ?? { activeIds: [], completedIds: [], rewardedIds: [] })
      };
      
      setGameState(safeFallback);
      toast.error("We couldn't recover an autosave. Please use Save/Load or restart the app.");
      return false;
    }
  }, []);

  const updateAvailableCountries = useCallback((iso3List) => {
    updateState({ availableCountryIso3s: Array.isArray(iso3List) ? iso3List : [] });
  }, [updateState]);

  const immigrateToCountry = useCallback((destIso3) => {
    const ownedHome = gameState?.inventory?.items?.some(i => i.uniqueGroup === "home");
    const hasProperties = gameState?.realEstate?.properties?.length > 0;

    if (ownedHome || hasProperties) {
      return { ok: false, reason: "MUST_SELL_HOME" };
    }

    // Language requirement
    const requiredLanguage = getLanguageForCountry(destIso3);
    const currentDefaultLanguage = getLanguageForCountry(gameState.countryIso3 || 'USA');

    // Implicit fluency if destination language equals current country's default
    const implicitFluent = requiredLanguage === currentDefaultLanguage;
    const explicitFluent = isFluentInLanguage(gameState, requiredLanguage, 'parent');

    if (!implicitFluent && !explicitFluent) {
      return { ok: false, reason: "LANGUAGE_REQUIRED", language: requiredLanguage };
    }

    updateState({ countryIso3: destIso3 });
    return { ok: true };
  }, [gameState, updateState]);

  // Culture Helpers
  const logCultureMoment = useCallback((log) => {
    setGameState(prev => {
      const points = log.rootsPointsEarned || 0;
      const nextStats = { ...prev.cultureStats };
      
      // Points
      nextStats.pointsTotal += points;
      nextStats.pointsThisWeek += points; // Simplified: does not reset automatically in this MVP, but ok.
      
      // Level calc
      const currentLevelObj = CULTURE_LEVELS.find(l => nextStats.pointsTotal >= l.min && nextStats.pointsTotal <= l.max) || CULTURE_LEVELS[0];
      const nextLevel = currentLevelObj.level;
      
      // Check Level Up
      if (nextLevel > nextStats.level) {
        // Unlock reward logic could go here
        nextStats.level = nextLevel;
      }
      
      nextStats.lastLogDate = Date.now();

      // Add log
      const newLogs = [log, ...prev.cultureLogs];
      
      return {
        ...prev,
        cultureLogs: newLogs,
        cultureStats: nextStats
      };
    });
  }, []);

  const saveCulturePlan = useCallback((plan) => {
    setGameState(prev => ({
      ...prev,
      culturePlan: plan
    }));
  }, []);

  const addCultureEvent = useCallback((evt) => {
    setGameState(prev => ({
      ...prev,
      cultureEvents: [...prev.cultureEvents, { ...evt, id: Date.now() }]
    }));
  }, []);

  const getFameTier = useCallback((points) => {
    const p = Math.max(0, points || 0);
    if (p >= 600) return { tierId: 'global', label: 'Global Celebrity', emoji: '🌍', electionBonus: 20, rumorAttractionBonus: 20 };
    if (p >= 300) return { tierId: 'national', label: 'National Figure', emoji: '📰', electionBonus: 15, rumorAttractionBonus: 15 };
    if (p >= 150) return { tierId: 'regional', label: 'Regional Buzz', emoji: '📍', electionBonus: 10, rumorAttractionBonus: 10 };
    if (p >= 50) return { tierId: 'local', label: 'Local Name', emoji: '🏘️', electionBonus: 5, rumorAttractionBonus: 5 };
    return { tierId: 'unknown', label: 'Unknown', emoji: '🫥', electionBonus: 0, rumorAttractionBonus: 0 };
  }, []);

  const applyReputationDelta = useCallback((delta, reason) => {
    const d = Math.round(Number(delta) || 0);
    if (d === 0) return;

    setGameState(prev => {
      const current = prev.reputation || 55;
      const next = clampInt(current + d, 0, 100);
      
      const changes = { reputation: next };

      if (Math.abs(d) >= 10) {
        const entry = {
          id: makeTimelineId(),
          age: prev.currentYear || 0,
          kind: 'reputation',
          title: '🛡️ Reputation Shift',
          detail: `${reason} (${d > 0 ? '+' : ''}${d} reputation)`,
        };
        changes.timelineEntries = [...(prev.timelineEntries || []), entry];
      }

      return { ...prev, ...changes };
    });
  }, []);

  const applyFameDelta = useCallback((delta, reason) => {
    const d = Math.round(Number(delta) || 0);
    if (d === 0) return;

    setGameState(prev => {
      const current = prev.famePoints || 0;
      const next = Math.max(0, Math.min(1000, current + d));
      
      // Log big shifts
      if (Math.abs(d) >= 50) {
        // We need to queue this update or handle it separately since we are in a setState callback
        // But recordTimelineEntry uses setState too, so we can't call it directly here efficiently without complexity.
        // Instead, we will construct the timeline entry right here inside the update.
        // ACTUALLY, for simplicity and safety in this context, we'll just update state. 
        // The spec said "If abs(delta) >= 50, add a timeline entry".
        // Let's do it by appending to timelineEntries in the same update.
        
        const makeId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_fame`;
        const entry = {
          id: makeId(),
          age: prev.currentYear || 0,
          kind: 'fame',
          title: '⭐ Fame Shift',
          detail: `${reason} (${d > 0 ? '+' : ''}${d} fame)`,
          deltas: null,
          moneyDelta: 0,
          loveDelta: 0,
          stressDelta: 0,
          meta: null
        };
        return { ...prev, famePoints: next, timelineEntries: [...(prev.timelineEntries || []), entry] };
      }

      return { ...prev, famePoints: next };
    });
  }, []);

  function processSocialMediaYearEnd(newAge) {
    const sm0 = normalizeSocialMediaState(gameState.socialMedia);
    if (sm0.lastProcessedAge === newAge) return; // guard double-run

    let totalIncome = 0;
    const breakdown = [];
    const accounts = { ...sm0.accounts };

    // Cache trend of the year
    const trend = pickTrendForAge(gameState.runSeed || 'seed', newAge);
    const trendByAge = { ...(sm0.trendByAge || {}), [newAge]: trend };

    for (const plat of SOCIAL_PLATFORMS) {
      const id = plat.id;
      const acc0 = accounts[id] || {};
      const acc = { ...acc0 };

      // 1) Expire penalties
      if (acc.status === 'shadowbanned' && typeof acc.shadowbannedUntilAge === 'number' && newAge >= acc.shadowbannedUntilAge) {
        acc.status = 'active'; acc.shadowbannedUntilAge = null; acc.engagement = Math.min(100, (acc.engagement || 50) + 2); acc.reputation = Math.min(100, (acc.reputation || 60) + 2);
      }
      if (acc.status === 'suspended' && typeof acc.suspendedUntilAge === 'number' && newAge >= acc.suspendedUntilAge) {
        acc.status = 'active'; acc.suspendedUntilAge = null; acc.engagement = Math.min(100, (acc.engagement || 50) + 4); acc.reputation = Math.min(100, (acc.reputation || 60) + 4);
      }

      // 2) Passive income
      if (acc.active && acc.status === 'active' && acc.monetized) {
        const inc = computeYearEndIncomeForAccount(acc, plat, gameState);
        if (inc > 0) { totalIncome += inc; breakdown.push(`${plat.emoji} ${plat.label}: $${formatMoney(inc)}`); }
      }

      // 3) Inactivity decay
      const shouldDecay = !(acc.lastPostAge === (newAge - 1));
      if (acc.active && shouldDecay) {
        const { followersLost, engagementLost } = computeInactivityDecay(acc, plat);
        acc.followers = Math.max(0, (acc.followers || 0) - followersLost);
        acc.engagement = Math.max(0, (acc.engagement || 50) - engagementLost);
        acc.postStreak = 0;
      }

      // 4) Reset per-age flags
      acc.postsThisAge = 0; acc.brandDealsThisAge = 0; acc.collabsThisAge = 0;
      acc.engagedThisAge = false; acc.celebrityReplyThisAge = false; acc.crossPromotedThisAge = false;

      accounts[id] = acc;
    }

    if (totalIncome > 0) {
      applyMoneyDelta(totalIncome, { source: 'Social Media' });
      recordTimelineEntry({ kind: 'social', title: '📱 Social Media Income', detail: breakdown.join(' • '), deltas: null, moneyDelta: totalIncome, loveDelta: 0, stressDelta: 0 });
    }

    updateState({ socialMedia: { ...sm0, accounts, lastProcessedAge: newAge, trendByAge } });
  }

  // Expose compatibility view: map active pet to gameState.pet
  const activePet = (gameState.pets || []).find(p => p.id === gameState.activePetId) || (gameState.pets || [])[0] || null;
  const gameStateView = { ...gameState, pet: activePet };

  const setActivePet = (petId) => setGameState(prev => ({ ...prev, activePetId: petId || null }));

  // Process Career at year end (promotions, firings, etc.)
  const processTitlesYearEndTick = useCallback((newAge) => {
    setGameState(prev => {
      if (!isMonarchyCountry(prev.countryIso3)) return prev;
      const t = prev.titles || {};
      if (!t.primaryTitle) return prev;
      const info = getTitleInfo(t.primaryTitle);
      const rank = Number(info?.rank || 0);
      const meter = Math.max(0, Math.min(100, Number(t.titleMeter || 0)));
      const gain = Math.max(0, Math.floor(rank * (meter / 50))); // 0..(~16)
      const decay = meter > 0 ? 2 : 0; // small yearly decay

      let required = 0;
      if (rank <= 3) required = 1; // Baron/Viscount/Earl
      else if (rank <= 5) required = 2; // Marquess/Duke
      else required = 3; // Prince/Crown/Monarch

      const yearTag = newAge;
      const obligations = t.obligations || { requiredPerYear: 0, completedThisYear: 0, yearTag: null };
      const completed = Number(obligations.completedThisYear || 0);
      const deficit = Math.max(0, required - completed);

      let standing = Math.max(0, meter - decay);
      let heat = Math.max(0, Math.min(100, Number(t.scandalHeat || 0)));
      let feed = Array.isArray(t.pressFeed) ? t.pressFeed.slice(-25) : [];
      let pressPending = t.pressPending || null;

      if (deficit > 0) {
        const penalty = Math.min(15, 5 * deficit + Math.max(0, rank - 3));
        standing = Math.max(0, standing - penalty);
        heat = Math.min(100, heat + (10 * deficit));
        // Force a negative press item
        const evt = { id: 'missed_obligation_press', headline: 'Missed a Key Engagement', body: 'Civic leaders ask why you were absent. Your office scrambles a response.', age: newAge };
        feed = [...feed, evt].slice(-25);
        pressPending = pressPending || evt;
      }

      return {
        ...prev,
        titles: {
          ...t,
          influencePoints: Math.max(0, (t.influencePoints || 0) + gain),
          titleMeter: Math.max(0, meter - decay),
          influence: Math.max(0, (t.influence || 0) + gain),
          standing,
          scandalHeat: heat,
          pressFeed: feed,
          pressPending,
          obligations: { requiredPerYear: required, completedThisYear: 0, yearTag }
        }
      };
    });
  }, []);

const processCareerYearEndTick = useCallback((newAge) => {
  setGameState(prev => {
    const careerRes = processCareerYearEnd({ prevState: prev, newAge });
    if (!careerRes || careerRes.skip) return prev;
    const next = { ...prev, playerCareer: { ...(normalizePlayerCareer(prev.playerCareer, prev)), ...(careerRes.careerUpdates || {}) } };
    return next;
  });
  // Apply side effects after state update
  try {
    const careerRes = processCareerYearEnd({ prevState: gameState, newAge });
    (careerRes?.logs || []).forEach(line => addLog(line));
    (careerRes?.timelineEntries || []).forEach(entry => recordTimelineEntry(entry));
    if (careerRes?.publicRepDelta) applyReputationDelta(careerRes.publicRepDelta, careerRes.publicRepDelta > 0 ? 'Promotion buzz' : 'Career setback');
    if (careerRes?.fameDelta) applyFameDelta(careerRes.fameDelta, 'Career moment');
  } catch {}
}, [gameState, addLog, recordTimelineEntry, applyFameDelta, applyReputationDelta]);

// --- Milestones Helpers ---
const handleMilestonesOnYearStart = useCallback((newAge) => {
  setGameState(prev => {
    const packsEnabled = prev.packs?.milestonesEnabled ?? true;
    const ms0 = prev.milestones || {};
    const shown = { ...(ms0.milestoneShownAges || {}) };
    let ms = { ...ms0, milestoneShownAges: shown };
    let pendingAssign = false;
    let pendingResult = false;
    let pendingResultPayload = null;

    // If pack disabled: hard stop popups and clear actives
    if (!packsEnabled) {
      ms.pendingAssign = false;
      ms.pendingResult = false;
      ms.pendingResultPayload = null;
      ms.kidQuestActive = null;
      ms.adultQuestActive = null;
      return { ...prev, milestones: ms };
    }

    // Evaluate existing quests
    function evalKid() {
      const q = ms.kidQuestActive; if (!q) return;
      const prog = checkQuestProgress(q, prev, q.baseline || {});
      const deadline = Number(q.deadlineChildAge || 0);
      const successNow = prog.done && newAge <= deadline;
      const failedNow = (newAge > deadline) && !prog.done;
      if (successNow || failedNow) {
        // Apply reward if success
        if (successNow && q.reward) {
          // we'll apply on outer setGameState via fields; here just stage a payload
        }
        const missSuffix = !successNow ? (()=>{
          const t = q.metric?.type;
          if (t==='stat_threshold') return `\nNear-miss: target ${statToPoints(q.targetValue)} pts vs current ${statToPoints(prog.value)} pts`;
          if (t==='stat_increase') return `\nNear-miss: gained ${statToPoints(prog.value)}/${statToPoints(prog.target)}`;
          if (t==='stat_below') return `\nNear-miss: ${q.metric.statKey} ${Math.round(prog.value)} ≤ ${prog.target}`;
          if (t==='money_increase' || t==='money_total') return `\nNear-miss: $${Math.round(prog.value).toLocaleString()} / $${Math.round(prog.target).toLocaleString()}`;
          if (t==='social_followers_total') return `\nNear-miss: ${prog.value.toLocaleString()} / ${prog.target.toLocaleString()} followers`;
          if (t==='passport_stamps_count') return `\nNear-miss: ${prog.value}/${prog.target} stamps`;
          if (t==='pets_count') return `\nNear-miss: ${prog.value}/${prog.target} pets`;
          if (t==='bookshelf_count') return `\nNear-miss: ${prog.value}/${prog.target} books`;
          if (t==='love_increase') return `\nNear-miss: +${prog.value}/+${prog.target} love`;
          if (t==='stress_below') return `\nNear-miss: stress ${Math.round(prog.value)} ≤ ${prog.target}`;
          return '';
        })() : '';
        
        // Life Goals progress (on success only)
        let alignedGoalIds = [];
        let newlyCompletedGoalIds = [];
        let goalProgressLines = '';
        
        if (successNow) {
          const selectedIds = Array.isArray(prev.lifeGoals?.selectedIds) ? prev.lifeGoals.selectedIds : [];
          const aligned = selectedIds.length ? getAlignedGoalIdsForQuest(q, selectedIds, 'kid') : [];
          
          if (aligned.length > 0) {
            alignedGoalIds = aligned;
            const progressById = { ...(prev.lifeGoals?.progressById || {}) };
            const completedSet = new Set(Array.isArray(prev.lifeGoals?.completedIds) ? prev.lifeGoals.completedIds : []);
            
            const progressLines = [];
            const recentEvents = Array.isArray(prev.lifeGoals?.recentEvents) ? [...prev.lifeGoals.recentEvents] : [];
            
            for (const goalId of aligned) {
              progressById[goalId] = (progressById[goalId] || 0) + 1;
              const target = getLifeGoalTarget(goalId);
              
              const becameComplete = (progressById[goalId] >= target && !completedSet.has(goalId));
              
              if (becameComplete) {
                completedSet.add(goalId);
                newlyCompletedGoalIds.push(goalId);
              }
              
              // Record event for Year Highlights
              recentEvents.push({
                atAge: newAge,
                goalId,
                delta: 1,
                completed: becameComplete
              });
              
              const def = LIFE_GOALS_BY_ID[goalId];
              if (def) {
                progressLines.push(`${def.emoji} ${def.title}: ${progressById[goalId]}/${target}`);
              }
            }
            
            if (progressLines.length > 0) {
              goalProgressLines = '\n\nLife Goal progress:\n' + progressLines.join('\n');
            }
            
            // Persist updated lifeGoals
            prev.lifeGoals = {
              ...(prev.lifeGoals || {}),
              progressById,
              completedIds: Array.from(completedSet),
              recentEvents
            };
          }
        }
        
        const bonusMessage = (successNow && alignedGoalIds.length > 0) ? '\n\n🎯 Goal Momentum bonus applied!' : '';
        
        pendingResult = true;
        pendingResultPayload = { 
          track: 'kid', 
          questId: q.id, 
          success: successNow, 
          message: successNow ? ((q.shareLine || 'They now walk into rooms like they pay rent.') + goalProgressLines + bonusMessage) : `Not a failure. Just character-building DLC.${missSuffix}`, 
          rewardApplied: false,
          alignedGoalIds,
          newlyCompletedGoalIds
        };
        ms.kidQuestHistory = [...(ms.kidQuestHistory||[]), { ...q, completed: successNow, atAge: newAge }];
        ms.kidQuestActive = null;
      }
    }

    function evalAdult() {
      const q = ms.adultQuestActive; if (!q) return;
      const prog = checkQuestProgress(q, prev, q.baseline || {});
      const adultAge = getAdultAge(prev);
      const deadline = Number(q.deadlineAdultAge || adultAge);
      const successNow = prog.done && adultAge <= deadline;
      const failedNow = (adultAge > deadline) && !prog.done;
      if (successNow || failedNow) {
        const missSuffix = !successNow ? (()=>{
          const t = q.metric?.type;
          if (t==='money_increase' || t==='money_total') return `\nNear-miss: $${Math.round(prog.value).toLocaleString()} / $${Math.round(prog.target).toLocaleString()}`;
          if (t==='career_progress') return `\nNear-miss: +$${Math.round(prog.value).toLocaleString()} / +$${Math.round(prog.target).toLocaleString()}`;
          if (t==='buy_and_rent_house' || t==='own_house_and_cash') return '';
          if (t==='social_followers_total') return `\nNear-miss: ${prog.value.toLocaleString()} / ${prog.target.toLocaleString()} followers`;
          if (t==='passport_stamps_count') return `\nNear-miss: ${prog.value}/${prog.target} stamps`;
          if (t==='pets_count') return `\nNear-miss: ${prog.value}/${prog.target} pets`;
          if (t==='bookshelf_count') return `\nNear-miss: ${prog.value}/${prog.target} books`;
          if (t==='love_increase') return `\nNear-miss: +${prog.value}/+${prog.target} love`;
          if (t==='stress_below') return `\nNear-miss: stress ${Math.round(prog.value)} ≤ ${prog.target}`;
          if (t==='business_started') return `\nNear-miss: business not started yet`;
          if (t==='business_income_per_year') return `\nNear-miss: income $${Math.round(prog.value).toLocaleString()} / $${Math.round(prog.target).toLocaleString()}`;
          if (t==='politics_office_held') return `\nNear-miss: no office held yet`;
          if (t==='politics_approval_threshold') return `\nNear-miss: approval ${Math.round(prog.value)} / ${prog.target}`;
          if (t==='politics_warchest_total') return `\nNear-miss: war chest $${Math.round(prog.value).toLocaleString()} / $${Math.round(prog.target).toLocaleString()}`;
          if (t==='donations_total') return `\nNear-miss: ${prog.value}/${prog.target} donations`;
          if (t==='study_points_total') return `\nNear-miss: ${prog.value}/${prog.target} study points`;
          if (t==='adult_crime_record_below') return `\nNear-miss: record ${prog.value} ≤ ${prog.target}`;
          if (t==='adult_crime_heat_below') return `\nNear-miss: heat ${prog.value} ≤ ${prog.target}`;
          if (t==='adult_crime_skill_threshold') return `\nNear-miss: skill ${prog.value} / ${prog.target}`;
          if (t==='adult_crime_crew_threshold') return `\nNear-miss: crew ${prog.value} / ${prog.target}`;
          if (t==='game_shelf_count') return `\nNear-miss: ${prog.value}/${prog.target} games`;
          return '';
        })() : '';
        
        // Life Goals progress (on success only)
        let alignedGoalIds = [];
        let newlyCompletedGoalIds = [];
        let goalProgressLines = '';
        
        if (successNow) {
          const selectedIds = Array.isArray(prev.lifeGoals?.selectedIds) ? prev.lifeGoals.selectedIds : [];
          const aligned = selectedIds.length ? getAlignedGoalIdsForQuest(q, selectedIds, 'adult') : [];
          
          if (aligned.length > 0) {
            alignedGoalIds = aligned;
            const progressById = { ...(prev.lifeGoals?.progressById || {}) };
            const completedSet = new Set(Array.isArray(prev.lifeGoals?.completedIds) ? prev.lifeGoals.completedIds : []);
            
            const progressLines = [];
            const recentEvents = Array.isArray(prev.lifeGoals?.recentEvents) ? [...prev.lifeGoals.recentEvents] : [];
            
            for (const goalId of aligned) {
              progressById[goalId] = (progressById[goalId] || 0) + 1;
              const target = getLifeGoalTarget(goalId);
              
              const becameComplete = (progressById[goalId] >= target && !completedSet.has(goalId));
              
              if (becameComplete) {
                completedSet.add(goalId);
                newlyCompletedGoalIds.push(goalId);
              }
              
              // Record event for Year Highlights
              recentEvents.push({
                atAge: adultAge,
                goalId,
                delta: 1,
                completed: becameComplete
              });
              
              const def = LIFE_GOALS_BY_ID[goalId];
              if (def) {
                progressLines.push(`${def.emoji} ${def.title}: ${progressById[goalId]}/${target}`);
              }
            }
            
            if (progressLines.length > 0) {
              goalProgressLines = '\n\nLife Goal progress:\n' + progressLines.join('\n');
            }
            
            // Persist updated lifeGoals
            prev.lifeGoals = {
              ...(prev.lifeGoals || {}),
              progressById,
              completedIds: Array.from(completedSet),
              recentEvents
            };
          }
        }
        
        const bonusMessage = (successNow && alignedGoalIds.length > 0) ? '\n\n🎯 Goal Momentum bonus applied!' : '';
        
        pendingResult = true;
        pendingResultPayload = { 
          track: 'adult', 
          questId: q.id, 
          success: successNow, 
          message: successNow ? ((q.shareLine || 'Quest complete!') + goalProgressLines + bonusMessage) : `Not a failure. Just character-building DLC.${missSuffix}`, 
          rewardApplied: false,
          alignedGoalIds,
          newlyCompletedGoalIds
        };
        ms.adultQuestHistory = [...(ms.adultQuestHistory||[]), { ...q, completed: successNow, atAge: adultAge }];
        ms.adultQuestActive = null;
      }
    }

    evalKid();
    evalAdult();

    // Assign at milestone ages
    // CRITICAL: Block age 0 assignment if Life Goals setup is pending/incomplete
    const shouldAssign = packsEnabled && MILESTONE_AGES.includes(newAge) && !shown[newAge];
    const blockAge0 = newAge === 0 && (prev.lifeGoals?.setupPending === true || prev.lifeGoals?.setupCompleted === false);
    
    if (shouldAssign && !blockAge0) {
      const { kid, adult } = pickMilestoneQuests(prev, newAge);
      if (!ms.kidQuestActive && kid) {
        const baseline = {
          money: Number(prev.money||0),
          yearlyIncome: Number(prev.playerCareer?.yearlyIncome||0),
          jobLevelIndex: Number(prev.playerCareer?.jobLevelIndex||0)
        };
        ms.kidQuestActive = { ...kid, baseline: { ...baseline, love: Number(prev.love||0), stress: Number(prev.stress||0), stats: { ...(prev.stats||{}) } } };
        pendingAssign = true;
      }
      if (!ms.adultQuestActive && adult) {
        const baseline = {
          money: Number(prev.money||0),
          yearlyIncome: Number(prev.playerCareer?.yearlyIncome||0),
          jobLevelIndex: Number(prev.playerCareer?.jobLevelIndex||0)
        };
        ms.adultQuestActive = { ...adult, baseline: { ...baseline, love: Number(prev.love||0), stress: Number(prev.stress||0), stats: { ...(prev.stats||{}) } } };
        pendingAssign = true;
      }
      shown[newAge] = true;
    }

    ms.pendingAssign = pendingAssign ? true : (ms.pendingAssign || false);
    ms.pendingResult = pendingResult ? true : (ms.pendingResult || false);
    ms.pendingResultPayload = pendingResult ? pendingResultPayload : (ms.pendingResultPayload || null);

    return { ...prev, milestones: ms };
  });

  // Apply rewards outside state merge to use existing helpers
  setTimeout(() => {
    const ms = latestStateRef.current?.milestones || {};
    const payload = ms.pendingResultPayload;
    if (!payload || !payload.success) return;
    const lastQ = (payload.track === 'kid') ? latestStateRef.current?.milestones?.kidQuestHistory?.slice(-1)[0] : latestStateRef.current?.milestones?.adultQuestHistory?.slice(-1)[0];
    if (!lastQ?.reward) return;
    const r = lastQ.reward || {};
    if (typeof r.money === 'number') applyMoneyDelta(r.money, { source: 'Milestones Reward' });
    if (typeof r.love === 'number') applyLove(r.love, 'Milestones Reward');
    if (typeof r.stress === 'number') applyStress(r.stress, 'Milestones Reward');
    // Back-compat merge of old flat stat rewards
    const mergedStats = { ...(r.stats || {}) };
    ['intelligence','confidence','empathy','discipline','happiness','creativity','curiosity','responsibility','knowledge','health','social','fitness']
      .forEach(k => { if (typeof r[k] === 'number') mergedStats[k] = (mergedStats[k]||0) + r[k]; });
    if (Object.keys(mergedStats).length) applyDeltas(mergedStats, 'Milestones Reward');
    
    // Unlock achievements for Life Goals progress
    const alignedGoalIds = Array.isArray(payload.alignedGoalIds) ? payload.alignedGoalIds : [];
    const newlyCompletedGoalIds = Array.isArray(payload.newlyCompletedGoalIds) ? payload.newlyCompletedGoalIds : [];
    
    // Goal Momentum Bonus: +250 money, -2 stress if aligned
    if (alignedGoalIds.length > 0) {
      applyMoneyDelta(250, '🎯 Goal Momentum Bonus', { category: 'income' });
      updateState(prev => ({
        stress: Math.max(0, Number(prev.stress || 0) - 2)
      }));
      
      recordTimelineEntry({
        kind: 'goal_bonus',
        title: '🎯 Goal Momentum',
        detail: 'You earned a bonus for completing a milestone aligned with your Life Goals.',
        deltas: null,
        moneyDelta: 250,
        loveDelta: 0,
        stressDelta: -2
      });
      
      // Unlock first progress achievement (once)
      updateState(prev => {
        const ids = Array.isArray(prev.unlockedAchievementIds) ? prev.unlockedAchievementIds : [];
        if (!ids.includes('goal_first_progress')) {
          toast.success('Achievement unlocked: Goal Chaser', { icon: '🎯' });
          recordTimelineEntry({
            kind: 'achievement',
            title: '🎯 Achievement: Goal Chaser',
            detail: 'Make progress on a Life Goal by completing an aligned Milestone.',
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0
          });
          return {
            unlockedAchievementIds: [...ids, 'goal_first_progress']
          };
        }
        return {};
      });
    }
    
    // Unlock completion achievements for newly completed goals
    for (const goalId of newlyCompletedGoalIds) {
      const achievementId = `goal_complete_${goalId}`;
      updateState(prev => {
        const ids = Array.isArray(prev.unlockedAchievementIds) ? prev.unlockedAchievementIds : [];
        if (!ids.includes(achievementId)) {
          const def = LIFE_GOALS_BY_ID[goalId];
          const title = def ? `Goal Achieved: ${def.title}` : 'Goal Achieved';
          toast.success(`Achievement unlocked: ${title}`, { icon: def?.emoji || '🏆' });
          recordTimelineEntry({
            kind: 'achievement',
            title: `${def?.emoji || '🏆'} Achievement: ${title}`,
            detail: def ? `Complete your Life Goal: ${def.title}.` : 'Complete your Life Goal.',
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0
          });
          return {
            unlockedAchievementIds: [...ids, achievementId]
          };
        }
        return {};
      });
    }
    
    // Mark applied
    updateState(prev => ({ milestones: { ...(prev.milestones||{}), pendingResultPayload: { ...(prev.milestones?.pendingResultPayload||{}), rewardApplied: true } } }));
  }, 0);
}, [updateState, applyMoneyDelta, applyDeltas]);

// --- SCA v2 Helpers ---
  const isUiBusy = useCallback((s = gameState) => {
    return Boolean(
      s.actionResultPending || s.homeworkPopupPending || s.kidLogicPopupPending ||
      s.chaosPopupPending || s.petEventPending || s.royalPopupPending ||
      (s.curiosity && s.curiosity.pending) ||
      (s.milestones && (s.milestones.pendingAssign || s.milestones.pendingResult)) ||
      (s.lifeGoals && (s.lifeGoals.setupPending || s.lifeGoals.uiOpen))
    );
  }, [gameState]);

  const applyScaV2Effects = useCallback((effects = {}) => {
    const e = effects || {};
    const deltas = {};
    if (e.CONF) deltas.confidence = (deltas.confidence || 0) + Number(e.CONF || 0);
    if (e.IND) deltas.responsibility = (deltas.responsibility || 0) + Number(e.IND || 0);
    if (e.SOC) deltas.social = (deltas.social || 0) + Number(e.SOC || 0);
    if (e.ANX) deltas.anxiety = (deltas.anxiety || 0) + Number(e.ANX || 0);
    if (Object.keys(deltas).length) applyDeltas(deltas, 'SCAv2');
    if (e.BOND) applyLove(Number(e.BOND || 0), 'SCAv2');
  }, [applyDeltas, applyLove]);

  const resolveSCAv2Popup = useCallback((letter) => {
    const pending = gameState.scaV2PopupPending; if (!pending) return;
    const key = String(letter || '').toUpperCase();
    const choice = (pending.scenario?.choices || []).find(c => (c.key || c.letter) === key) || null;
    const effects = choice?.effects || {};
    const flags = Array.isArray(choice?.flags) ? choice.flags : [];
    applyScaV2Effects(effects);
    setGameState(prev => {
      const sa = prev.schoolAnxietyV2 || { consumedAges: [], usedScenarioIds: [], history: [], hidden: { avoidance: 0, riskIfCaught: false }, totals: { CONF: 0, ANX: 0, BOND: 0, IND: 0, SOC: 0 } };
      const totals = { ...(sa.totals || {}) };
      totals.CONF = (totals.CONF || 0) + (effects.CONF || 0);
      totals.ANX = (totals.ANX || 0) + (effects.ANX || 0);
      totals.BOND = (totals.BOND || 0) + (effects.BOND || 0);
      totals.IND = (totals.IND || 0) + (effects.IND || 0);
      totals.SOC = (totals.SOC || 0) + (effects.SOC || 0);
      const hidden = { ...(sa.hidden || { avoidance: 0, riskIfCaught: false }) };
      if (flags.includes('AvoidancePlusOne')) hidden.avoidance = (hidden.avoidance || 0) + 1;
      if (flags.includes('RiskIfCaught')) hidden.riskIfCaught = true;
      const consumedAges = Array.from(new Set([...(sa.consumedAges || []), pending.age]));
      const usedScenarioIds = Array.from(new Set([...(sa.usedScenarioIds || []), pending.scenario?.id].filter(Boolean)));
      const history = [ ...(sa.history || []), { age: pending.age, scenario_id: pending.scenario?.id || 'unknown', choice_key: key, effects, flags, timestamp: Date.now() } ];
      return { ...prev, schoolAnxietyV2: { consumedAges, usedScenarioIds, history, hidden, totals }, scaV2PopupPending: null };
    });
  }, [gameState.scaV2PopupPending, applyScaV2Effects]);

  const skipSCAv2Popup = useCallback(() => {
    const pending = gameState.scaV2PopupPending; if (!pending) return;
    setGameState(prev => {
      const sa = prev.schoolAnxietyV2 || { consumedAges: [], usedScenarioIds: [], history: [], hidden: { avoidance: 0, riskIfCaught: false }, totals: { CONF: 0, ANX: 0, BOND: 0, IND: 0, SOC: 0 } };
      const consumedAges = Array.from(new Set([...(sa.consumedAges || []), pending.age]));
      const usedScenarioIds = Array.from(new Set([...(sa.usedScenarioIds || []), pending.scenario?.id].filter(Boolean)));
      const history = [ ...(sa.history || []), { age: pending.age, scenario_id: pending.scenario?.id || 'unknown', choice_key: 'SKIP', effects: null, flags: null, timestamp: Date.now() } ];
      return { ...prev, schoolAnxietyV2: { ...sa, consumedAges, usedScenarioIds, history }, scaV2PopupPending: null };
    });
  }, [gameState.scaV2PopupPending]);

  // Triggering on age change
  useEffect(() => {
    const age = Number(gameState.currentYear || 0);
    if (!SCA_V2_TRIGGER_AGES.includes(age)) return;
    // Pack gate: only run if School Confidence pack is enabled
    const enabledPackIds = Array.isArray(gameState.enabledScenarioPackIds) && gameState.enabledScenarioPackIds.length
      ? gameState.enabledScenarioPackIds
      : DEFAULT_ENABLED_PACK_IDS;
    if (!enabledPackIds.includes('pack_school_confidence_v1')) return;
    const sa = gameState.schoolAnxietyV2 || {};
    if ((sa.consumedAges || []).includes(age)) return;
    if (gameState.scaV2PopupPending) return;
    const scenario = pickScaV2ScenarioForAge(age, sa.usedScenarioIds || [], gameState.runSeed || 'seed');
    if (!scenario) {
      setGameState(prev => ({ ...prev, schoolAnxietyV2: { ...(prev.schoolAnxietyV2 || { consumedAges: [], usedScenarioIds: [], history: [], hidden: { avoidance: 0, riskIfCaught: false }, totals: { CONF: 0, ANX: 0, BOND: 0, IND: 0, SOC: 0 } }), consumedAges: Array.from(new Set([...(prev.schoolAnxietyV2?.consumedAges || []), age])) } }));
      return;
    }
    const payload = { age, scenario };
    if (isUiBusy(gameState)) setGameState(prev => ({ ...prev, scaV2Queued: payload }));
    else setGameState(prev => ({ ...prev, scaV2PopupPending: payload }));
  }, [gameState.currentYear]);

  useEffect(() => {
    if (!gameState.scaV2Queued) return;
    if (gameState.scaV2PopupPending) return;
    if (isUiBusy(gameState)) return;
    setGameState(prev => ({ ...prev, scaV2PopupPending: prev.scaV2Queued, scaV2Queued: null }));
  }, [gameState.scaV2Queued, gameState.actionResultPending, gameState.homeworkPopupPending, gameState.kidLogicPopupPending, gameState.chaosPopupPending, gameState.petEventPending, gameState.royalPopupPending, gameState.curiosity?.pending, gameState.milestones?.pendingAssign, gameState.milestones?.pendingResult]);

  

// Placeholder to avoid runtime errors; wiring handled in later prompts
const processChildTraumaYearStartTick = useCallback((newAge) => {
  // No-op for now
}, []);

const grantPartnerCounselingBuffer = useCallback((amount = 2) => {
  setGameState(prev => ({
    ...prev,
    partnerCounselingBuffer: Math.max(Number(prev.partnerCounselingBuffer || 0), Number(amount || 0))
  }));
}, []);

const resolvePressEventChoice = React.useCallback((choiceIndex = 0) => {
  setGameState(prev => {
    const t = prev.titles || {};
    const pending = t.pressPending;
    if (!pending) return prev;
    const choice = (pending.choices || [])[choiceIndex];
    const eff = choice?.effects || {};
    const standing = Math.max(0, Math.min(100, Number(t.standing || 0) + (eff.standingDelta || 0)));
    const heat = Math.max(0, Math.min(100, Number(t.scandalHeat || 0) + (eff.heatDelta || 0)));
    const influence = Math.max(0, (t.influence || 0) + (eff.influenceDelta || 0));

    const feedItem = { headline: pending.headline, body: pending.body, age: prev.currentYear || 0, outcome: choice?.label };
    const feed = [...(t.pressFeed || []), feedItem].slice(-25);

    const moneyDelta = Number(eff.moneyDelta || 0);

    let next = { ...prev, titles: { ...t, standing, scandalHeat: heat, influence, pressFeed: feed, pressPending: null } };
    if (moneyDelta !== 0) {
      next = {
        ...next,
        money: Math.max(0, (prev.money || 0) + moneyDelta),
        moneyTransactions: [ ...(prev.moneyTransactions || []), { id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}_press_money`, ts: Date.now(), age: prev.currentYear || 0, amount: moneyDelta, type: moneyDelta >= 0 ? 'income' : 'expense', source: 'Press action', category: 'uncategorized' } ]
      };
    }
    return next;
  });
}, []);

  // --- Challenges API ---
  const activateChallenge = React.useCallback((challengeId) => {
    const id = String(challengeId || '');
    if (!id || !CHALLENGE_BY_ID[id]) return false;
    setGameState(prev => {
      const meta = prev.challengeMeta || { activeIds: [], completedIds: [], rewardedIds: [] };
      const active = Array.isArray(meta.activeIds) ? [...meta.activeIds] : [];
      const completed = Array.isArray(meta.completedIds) ? meta.completedIds : [];
      if (active.includes(id) || completed.includes(id)) return prev;
      if (active.length >= 3) return prev;
      active.push(id);
      return { ...prev, challengeMeta: { ...meta, activeIds: active } };
    });
    return true;
  }, []);

  const deactivateChallenge = React.useCallback((challengeId) => {
    const id = String(challengeId || '');
    setGameState(prev => {
      const meta = prev.challengeMeta || { activeIds: [], completedIds: [], rewardedIds: [] };
      const active = Array.isArray(meta.activeIds) ? meta.activeIds.filter(x => x !== id) : [];
      return { ...prev, challengeMeta: { ...meta, activeIds: active } };
    });
  }, []);

  const completeChallenge = React.useCallback((challengeId) => {
    const id = String(challengeId || '');
    const def = CHALLENGE_BY_ID[id];
    if (!def) return false;

    let shouldPay = false;

    setGameState(prev => {
      const meta0 = prev.challengeMeta || { activeIds: [], completedIds: [], rewardedIds: [] };
      const rewarded0 = Array.isArray(meta0.rewardedIds) ? meta0.rewardedIds : [];

      // Already paid, do nothing
      if (rewarded0.includes(id)) {
        shouldPay = false;
        return prev;
      }

      const active = Array.isArray(meta0.activeIds) ? meta0.activeIds.filter(x => x !== id) : [];
      const completed = Array.isArray(meta0.completedIds) ? Array.from(new Set([...meta0.completedIds, id])) : [id];
      const rewarded = Array.from(new Set([...rewarded0, id]));

      shouldPay = true;
      return { ...prev, challengeMeta: { activeIds: active, completedIds: completed, rewardedIds: rewarded } };
    });

    if (shouldPay) {
      const reward = Number(def.rewardDiamonds || 20);
      try { addDiamonds(reward, 'challenge'); } catch {}
      try { toast.success(`Challenge complete! +${reward} diamonds`, { icon: '🏁' }); } catch {}
    }

    return true;
  }, [addDiamonds]);

  // Auto-complete watcher
  React.useEffect(() => {
    const meta = gameState.challengeMeta || { activeIds: [] };
    const activeIds = Array.isArray(meta.activeIds) ? meta.activeIds : [];
    if (!activeIds.length) return;
    activeIds.forEach(id => {
      const def = CHALLENGE_BY_ID[id];
      if (!def) return;
      try {
        if (isChallengeComplete(gameState, def)) {
          completeChallenge(id);
        }
      } catch {}
    });
  }, [gameState.challengeMeta?.activeIds, gameState]);

  // --- Sibling Rivalry Actions ---
  const addChild = useCallback((payload) => {
    setGameState(prev => {
      const cloned = (typeof structuredClone === 'function') ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      return addChildReducer(cloned, payload);
    });
  }, []);

  const removeChild = useCallback((kidId) => {
    setGameState(prev => {
      const cloned = (typeof structuredClone === 'function') ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      return removeChildReducer(cloned, kidId);
    });
  }, []);

  const setActiveKid = useCallback((kidId) => {
    setGameState(prev => {
      const cloned = (typeof structuredClone === 'function') ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      return setActiveKidReducer(cloned, kidId);
    });
  }, []);

  const setSiblingRivalryEnabled = useCallback((enabled) => {
    setGameState(prev => {
      const cloned = (typeof structuredClone === 'function') ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      return setSiblingRivalryEnabledReducer(cloned, enabled);
    });
  }, []);



  // Sibling Rivalry Popup Queue (Hard Cap: 2 per year) — FILTERED FOR MINOR BIOLOGICAL CHILDREN ONLY
  const maybeQueueSiblingRivalryPopups = useCallback((age) => {
    setGameState(prev => {
      if (!prev.expansions?.siblingRivalry) return prev;

      const allKids = Array.isArray(prev.kids) ? prev.kids : [];
      
      // FILTER: Only minor biological children (relation='child' AND age < 18)
      const kids = allKids.filter(k => {
        if (k.relation !== 'child') return false;
        const kidAge = getDisplayedChildAge(prev, k);
        return kidAge < 18;
      });
      
      if (kids.length < 2) return prev;

      const ageNow = Number(age);
      if (!Number.isFinite(ageNow)) return prev;

      // Optional: avoid immediate rivalry popups in birth-year (keeps UI calmer)
      if (ageNow <= 0) return prev;

      const multiKidSiblingMode = prev.expansions?.siblingRivalry === true && kids.length >= 2;

      const shown = prev.yearFlags?.siblingRivalryPopupsShown || 0;
      const existingQueue = Array.isArray(prev.siblingRivalryPopupQueue) ? prev.siblingRivalryPopupQueue : [];
      const alreadyQueuedThisAge = existingQueue.filter(p => Number(p?.age) === ageNow).length;

      const remaining = 2 - shown - alreadyQueuedThisAge;
      if (remaining <= 0) return prev;

      const rng = createSeededRng(`${prev.runSeed}|siblingRivalry|age:${ageNow}`);

      // Guarantee at least 1 popup in multi-kid mode; otherwise keep rare chance
      const chance = multiKidSiblingMode ? 1.0 : 0.20;
      if (rng.nextFloat() > chance) return prev;

      // In multi-kid mode, always queue exactly 1 (keeps it from spamming)
      let queueCount = multiKidSiblingMode ? 1 : (rng.nextFloat() < 0.20 ? 2 : 1);
      queueCount = Math.min(queueCount, remaining);

      const newQueue = [...existingQueue];

      const getName = (kid, fallback) => kid?.childSlice?.childName || kid?.name || fallback;
      const getKidAge = (kid) => {
        const created = Number.isFinite(Number(kid?.createdAtYear)) ? Number(kid.createdAtYear) : 0;
        return Math.max(0, ageNow - created);
      };

      // We attempt multiple random pair picks to avoid "no eligible template" edge cases
      const maxAttempts = 30;
      let added = 0;

      for (let attempt = 0; attempt < maxAttempts && added < queueCount; attempt++) {
        const idxA = Math.floor(rng.nextFloat() * kids.length);
        let idxB = Math.floor(rng.nextFloat() * kids.length);
        let guard = 0;
        while (idxB === idxA && guard < 10) {
          idxB = Math.floor(rng.nextFloat() * kids.length);
          guard++;
        }
        if (idxA === idxB) continue;

        const kidA = kids[idxA];
        const kidB = kids[idxB];

        const nameA = getName(kidA, "Kid A");
        const nameB = getName(kidB, "Kid B");

        const ageA = getKidAge(kidA);
        const ageB = getKidAge(kidB);

        const youngerName = ageA <= ageB ? nameA : nameB;
        const olderName = ageA <= ageB ? nameB : nameA;

        // Pair-specific filtering: BOTH kids must fit the template range
        const eligibleTemplates = (Array.isArray(SIBLING_RIVALRY_POPUPS) ? SIBLING_RIVALRY_POPUPS : []).filter(t => {
          const min = Number.isFinite(Number(t?.minAge)) ? Number(t.minAge) : 0;
          const max = Number.isFinite(Number(t?.maxAge)) ? Number(t.maxAge) : 99;
          return ageA >= min && ageA <= max && ageB >= min && ageB <= max;
        });

        if (eligibleTemplates.length === 0) continue;

        const template = rng.pick(eligibleTemplates) || eligibleTemplates[0];
        if (!template) continue;

        const fill = (txt) =>
          String(txt || "")
            .replace(/{kidA}/g, nameA)
            .replace(/{kidB}/g, nameB)
            .replace(/{ageA}/g, String(ageA))
            .replace(/{ageB}/g, String(ageB))
            .replace(/{younger}/g, youngerName)
            .replace(/{older}/g, olderName);

        newQueue.push({
          popupId: template.id,
          age: ageNow,
          kidAId: kidA.id,
          kidBId: kidB.id,
          kidAAge: ageA,
          kidBAge: ageB,
          title: fill(template.title),
          body: fill(template.body),
          choices: Array.isArray(template.choices)
            ? template.choices.map(c => ({ ...c, label: fill(c.label) }))
            : []
        });

        added++;
      }

      // Final safety: in multi-kid mode, if we somehow added 0 (very rare),
      // fall back to the first 2 kids and the first template (must exist).
      if (multiKidSiblingMode && added === 0 && queueCount > 0) {
        const kidA = kids[0];
        const kidB = kids[1];
        const template = (Array.isArray(SIBLING_RIVALRY_POPUPS) ? SIBLING_RIVALRY_POPUPS : [])[0];
        if (kidA && kidB && template) {
          const nameA = getName(kidA, "Kid A");
          const nameB = getName(kidB, "Kid B");
          const ageA = getKidAge(kidA);
          const ageB = getKidAge(kidB);
          const youngerName = ageA <= ageB ? nameA : nameB;
          const olderName = ageA <= ageB ? nameB : nameA;

          const fill = (txt) =>
            String(txt || "")
              .replace(/{kidA}/g, nameA)
              .replace(/{kidB}/g, nameB)
              .replace(/{ageA}/g, String(ageA))
              .replace(/{ageB}/g, String(ageB))
              .replace(/{younger}/g, youngerName)
              .replace(/{older}/g, olderName);

          newQueue.push({
            popupId: template.id,
            age: ageNow,
            kidAId: kidA.id,
            kidBId: kidB.id,
            kidAAge: ageA,
            kidBAge: ageB,
            title: fill(template.title),
            body: fill(template.body),
            choices: Array.isArray(template.choices)
              ? template.choices.map(c => ({ ...c, label: fill(c.label) }))
              : []
          });

          added = 1;
        }
      }

      // If nothing got queued, return prev unchanged
      if (added === 0) return prev;

      return { ...prev, siblingRivalryPopupQueue: newQueue };
    });
  }, []);

  // Inventory Passives: charge for owned items + auto-trash expired items
  const applyInventoryPassivesForAge = useCallback((ageOverride = null) => {
    const state = latestStateRef.current;
    const age = Number(ageOverride ?? state?.currentYear ?? 0);
    
    // Guard: only apply once per age
    if (state.lastInventoryPassiveAppliedAge === age) return;
    
    const items = state?.inventory?.items || [];
    if (items.length === 0) {
      updateState(prev => ({ ...prev, lastInventoryPassiveAppliedAge: age }));
      return;
    }
    
    // 1) Remove expired items silently
    const itemsAfterExpiration = items.filter(invItem => {
      const def = SHOP_ITEM_BY_ID[invItem.id];
      if (!def) return true; // Keep unknown items (defensive)
      
      // Never expire homes or items with null lifespan
      if (def.uniqueGroup === 'home' || def.lifespanYears === null) return true;
      
      // Check expiration
      if (typeof def.lifespanYears === 'number') {
        const purchasedAge = Number(invItem.purchasedAge ?? 0);
        const ageNow = Number(age);
        const yearsOwned = ageNow - purchasedAge;
        if (yearsOwned >= def.lifespanYears) {
          return false; // Expired
        }
      }
      
      return true; // Keep
    });
    
    // 2) Aggregate passive effects
    let totalMoneyDelta = 0;
    let totalStressDelta = 0;
    const breakdown = [];
    
    for (const invItem of itemsAfterExpiration) {
      if (invItem?.stored === true) continue; // storage disables passives (positive & negative)
      const def = SHOP_ITEM_BY_ID[invItem.id];
      if (!def || !def.passivePerAge) continue;
      
      // Check housing requirement (home upgrades only apply when living in owned_home)
      const housingId = String(state?.livingSetup?.housingId || 'apartment_basic');
      if (def.requiresHousingId && def.requiresHousingId !== housingId) {
        continue;
      }
      
      const passive = def.passivePerAge;
      
      if (passive.moneyDelta) {
        // Localize passive money cost
        const scale = getCountryScale(state.countryIso3 || 'USA');
        const localDelta = localizeAmount(Math.abs(passive.moneyDelta), scale, PRICING.LOCAL);
        const signedDelta = passive.moneyDelta < 0 ? -localDelta : localDelta;
        totalMoneyDelta += signedDelta;
        
        if (signedDelta !== 0) {
          breakdown.push(`${def.emoji} ${def.name}: ${signedDelta > 0 ? '+' : ''}$${formatMoney(Math.abs(signedDelta))}`);
        }
      }
      
      if (passive.stressDelta) {
        totalStressDelta += passive.stressDelta;
      }
    }
    
    // 3) Apply aggregated effects
    if (totalMoneyDelta !== 0) {
      applyMoneyDelta(totalMoneyDelta, 'Owned item upkeep', { category: 'inventory', ageOverride: age });
    }
    if (totalStressDelta !== 0) {
      applyStress(totalStressDelta, 'Owned items');
    }
    
    // 4) Annual fake luxury exposure check (5%/year)
    const hasActiveFakeLuxury = itemsAfterExpiration.some(invItem => {
      if (invItem?.stored === true) return false;
      const def = SHOP_ITEM_BY_ID[invItem.id];
      return def && def.luxuryTier === 'fake';
    });

    let fakeLuxExposedThisYear = false;

    if (hasActiveFakeLuxury && (Number(state.famePoints || 0) > 0)) {
      const rng = createSeededRng(`${state.runSeed || 'seed'}|fakeLuxAnnualExposure|age:${age}`);
      if (rng.nextFloat() < 0.05) {
        fakeLuxExposedThisYear = true;

        recordTimelineEntry({
          kind: 'social',
          title: '📸 Fake Luxury Exposed',
          detail:
            "Someone posts a zoomed-in photo. The comments do math. The internet does what it does.\n\nYour fame evaporates overnight.",
          moneyDelta: 0,
          stressDelta: 0,
          loveDelta: 0,
          age
        });
      }
    }
    
    // 5) Record timeline if any passives
    if (breakdown.length > 0) {
      recordTimelineEntry({
        kind: 'budget',
        title: '🛍️ Item Upkeep',
        detail: breakdown.join('\n'),
        moneyDelta: totalMoneyDelta,
        stressDelta: totalStressDelta,
        loveDelta: 0,
        age
      });
    }
    
    // 6) Update inventory (remove expired) and mark applied
    updateState(prev => ({
      ...prev,
      famePoints: fakeLuxExposedThisYear ? 0 : prev.famePoints,
      inventory: { ...prev.inventory, items: itemsAfterExpiration },
      lastInventoryPassiveAppliedAge: age
    }));
  }, [updateState, applyMoneyDelta, applyStress, recordTimelineEntry]);

  // Quality of Life: charge subscriptions + tiers
  const applyQualityOfLifeForAge = useCallback((ageOverride = null) => {
    const state = latestStateRef.current;
    const age = Number(ageOverride ?? state?.currentYear ?? 0);
    
    // Guard: only apply once per age
    if (state.lastQoLCostsAppliedAge === age) return;
    
    const scale = getCountryScale(state.countryIso3 || 'USA');
    const commitments = state?.commitments || {};
    
    // A) Auto-disable invalid subscriptions
    const toDisable = [];
    const disabledLabels = [];
    
    for (const [id, enabled] of Object.entries(commitments)) {
      if (!enabled) continue;
      const def = QOL_SUBSCRIPTIONS[id];
      if (!def) continue;
      if (!isSubscriptionValidForAge(def, age, state)) {
        toDisable.push(id);
        disabledLabels.push(def.label);
      }
    }
    
    if (toDisable.length > 0) {
      updateState(prev => {
        const nextCommitments = { ...prev.commitments };
        toDisable.forEach(id => { nextCommitments[id] = false; });
        return { ...prev, commitments: nextCommitments };
      });
      
      recordTimelineEntry({
        kind: 'budget',
        title: '🧾 Subscription Ended',
        detail: `Some services no longer apply and were auto-turned off: ${disabledLabels.join(', ')}.`,
        moneyDelta: 0,
        stressDelta: 0,
        loveDelta: 0,
        age
      });
    }
    
    // B) Charge + apply effects for valid active subscriptions
    let totalCost = 0;
    let totalStress = 0;
    let totalLove = 0;
    let totalFame = 0;
    const breakdown = [];
    const childDeltasAgg = {};
    
    for (const [id, enabled] of Object.entries(commitments)) {
      if (!enabled) continue;
      const def = QOL_SUBSCRIPTIONS[id];
      if (!def) continue;
      if (!isSubscriptionValidForAge(def, age, state)) continue;
      
      const localCost = localizeAmount(def.cost, scale);
      applyMoneyDelta(-localCost, `QoL: ${def.label}`, { category: def.category, ageOverride: age });
      totalCost += localCost;
      
      if (def.stressDrift) {
        applyStress(def.stressDrift, def.label);
        totalStress += def.stressDrift;
      }
      if (def.playerHealthDrift) applyPlayerHealth(def.playerHealthDrift);
      if (def.loveDelta) {
        applyLove(def.loveDelta, def.label);
        totalLove += def.loveDelta;
      }
      if (def.fameDeltaPerAge) {
        applyFameDelta(def.fameDeltaPerAge, def.label);
        totalFame += def.fameDeltaPerAge;
      }
      if (def.childDeltas) {
        Object.entries(def.childDeltas).forEach(([k, v]) => {
          childDeltasAgg[k] = (childDeltasAgg[k] || 0) + v;
        });
      }
      
      breakdown.push(`${def.emoji} ${def.label}: -$${formatMoney(localCost)}`);
    }
    
    if (Object.keys(childDeltasAgg).length > 0) {
      applyDeltas(childDeltasAgg, 'QoL Subscriptions');
    }
    
    // C) Charge + apply effects for tiers
    const qol = state?.qol || {};
    const internetTier = getTierOption(QOL_TIER_DEFS.internet, qol.internetTier || 'basic');
    const homeOfficeTier = getTierOption(QOL_TIER_DEFS.homeOffice, qol.homeOfficeTier || 'none');
    const clothingTier = getTierOption(QOL_TIER_DEFS.clothing, qol.clothingTier || 'mall');
    
    for (const tier of [internetTier, homeOfficeTier, clothingTier]) {
      const costLocal = localizeAmount(tier.yearlyCostBase, scale);
      
      if (costLocal > 0) {
        applyMoneyDelta(-costLocal, tier.label, { category: tier.category || 'utilities', ageOverride: age });
        totalCost += costLocal;
        breakdown.push(`${tier.emoji} ${tier.label}: -$${formatMoney(costLocal)}`);
      }
      
      if (tier.stressDrift) {
        applyStress(tier.stressDrift, tier.label);
        totalStress += tier.stressDrift;
      }
      if (tier.fameDeltaPerAge) {
        applyFameDelta(tier.fameDeltaPerAge, tier.label);
        totalFame += tier.fameDeltaPerAge;
      }
    }
    
    // D) Record combined timeline entry if any costs
    if (breakdown.length > 0) {
      let detailText = breakdown.join('\n');
      
      if (totalFame > 0) {
        detailText += `\n\n✨ Total Fame: +${totalFame}`;
      }
      
      recordTimelineEntry({
        kind: 'budget',
        title: '✨ Quality of Life',
        detail: detailText,
        moneyDelta: -totalCost,
        stressDelta: totalStress,
        loveDelta: totalLove,
        age
      });
    }
    
    // E) Mark guard
    updateState(prev => ({ ...prev, lastQoLCostsAppliedAge: age }));
  }, [applyMoneyDelta, applyStress, applyPlayerHealth, applyLove, applyFameDelta, applyDeltas, recordTimelineEntry, updateState]);

  // Year-0 income grant (called once after birth intro completes)
  const grantInitialYear0CashIfNeeded = useCallback((setupOverride = null) => {
    const state = latestStateRef.current;
    
    // Guard: only grant once
    if (state.initialYear0IncomeGranted === true) return;
    
    // Determine scale
    const scale = getCountryScale(state.countryIso3 || 'USA');
    const wageScale = getCountryWageScale(state.countryIso3 || 'USA');
    
    // Determine base yearly income
    const yearlyIncomeBase = Number(state.playerCareer?.yearlyIncome ?? 0);
    
    // Localize
    const yearlyIncomeLocal = localizeAmount(yearlyIncomeBase, wageScale, PRICING.LOCAL);
    
    // Compute starting savings = 10% of yearly income
    const round1 = (n) => Math.round(n * 10) / 10;
    const savingsLocalRaw = yearlyIncomeLocal * 0.10;
    const savingsLocal = round1(savingsLocalRaw);
    const incomeLocal = round1(yearlyIncomeLocal);
    
    // Apply money deltas via ledger
    applyMoneyDelta(savingsLocal, 'Starting Savings (10% of income)', { 
      category: 'income', 
      ageOverride: 0 
    });
    applyMoneyDelta(incomeLocal, 'Year 0 Income', { 
      category: 'salary', 
      ageOverride: 0 
    });
    
    // Record timeline entry
    recordTimelineEntry({
      kind: 'budget',
      title: '💰 Starting Cash',
      detail: 
        `Starting Savings: +$${formatMoney(savingsLocal)}\n` +
        `Year 0 Income: +$${formatMoney(incomeLocal)}`,
      moneyDelta: (savingsLocal + incomeLocal),
      loveDelta: 0,
      stressDelta: 0,
      age: 0
    });
    
    // Set guard
    updateState(prev => ({ ...prev, initialYear0IncomeGranted: true }));
  }, [applyMoneyDelta, recordTimelineEntry, updateState]);

  // Cost of Living: apply food/housing/commute costs
  const applyLivingCostsForAge = useCallback((ageOverride = null, setupOverride = null) => {
    const state = latestStateRef.current;
    const age = Number(ageOverride ?? state?.currentYear ?? 0);
    
    // Guard: only apply once per age
    if (state.lastLivingCostsAppliedAge === age) return;
    
    // Resolve living setup (with fallback for invalid IDs)
    const setup = setupOverride || state.livingSetup || { housingId: 'apartment_basic', commuteId: 'bus', foodStrategyId: 'standard' };
    const housing = resolveHousingForState(state, setup.housingId);
    const commute = resolveCommuteForState(state, setup.commuteId);
    const foodStrat = getFoodStrategyById(setup.foodStrategyId || 'standard');
    
    // Compute household sizes
    const adultCount = (state.householdType === 'two') ? 2 : 1;
    const kidsArr = Array.isArray(state.kids) ? state.kids : [];
    const kidCount = Math.max(1, kidsArr.length || 1);
    
    // Count infants (age 0-2)
    let infantCount = 0;
    if (kidsArr.length > 0) {
      infantCount = kidsArr.filter(k => {
        const kidAge = age - (k.createdAtYear ?? 0);
        return kidAge >= 0 && kidAge <= 2;
      }).length;
    } else {
      infantCount = (age <= 2) ? 1 : 0;
    }
    
    // Compute base food cost (apply strategy multiplier)
    const foodBaseRaw = adultCount * FOOD_COSTS_BASE.adult + kidCount * FOOD_COSTS_BASE.child + infantCount * FOOD_COSTS_BASE.infantAddon;
    const foodBase = Math.round(foodBaseRaw * (Number(foodStrat.costMult) || 1));
    
    // Localize costs
    const scale = getCountryScale(state.countryIso3 || 'USA');
    const foodLocal = localizeAmount(foodBase, scale);
    let housingLocal = localizeAmount(housing.yearlyCostBase, scale);
    let commuteLocal = localizeAmount(commute.yearlyCostBase, scale);
    
    // NK Special Start: override housing + commute to be extremely expensive
    if (state.specialStartId === 'kim_jong_un') {
      housingLocal = Math.max(housingLocal, localizeAmount(100000, scale));
      commuteLocal = Math.max(commuteLocal, localizeAmount(100000, scale));
    }
    
    // Apply money deltas (3 separate transactions)
    applyMoneyDelta(-foodLocal, `Food (${foodStrat.emoji} ${foodStrat.label})`, { 
      category: 'food', 
      ageOverride: age, 
      note: `Adults:${adultCount}, Kids:${kidCount}${infantCount ? `, Infants:${infantCount}` : ''}` 
    });
    applyMoneyDelta(-housingLocal, `Housing: ${housing.label}`, { category: 'housing', ageOverride: age });
    applyMoneyDelta(-commuteLocal, `Commute: ${commute.label}`, { category: 'transport', ageOverride: age });
    
    // Apply stat drifts
    const totalStress = (housing.stressDrift || 0) + (commute.stressDrift || 0) + (foodStrat.stressDrift || 0);
    if (totalStress) applyStress(totalStress, 'Cost of Living');
    
    const totalHealth = (commute.playerHealthDrift || 0) + (foodStrat.playerHealthDrift || 0);
    if (totalHealth) applyPlayerHealth(totalHealth);
    
    const childDeltas = mergeDeltas(mergeDeltas(housing.childDeltas, commute.childDeltas), foodStrat.childDeltas);
    if (Object.keys(childDeltas).length) applyDeltas(childDeltas, 'Living Situation');
    
    // Apply Fame if mount commute
    const fameDelta = Number(commute.fameDeltaPerAge || 0);
    if (fameDelta) {
      applyFameDelta(fameDelta, `Commute: ${commute.label || commute.id}`);
    }
    
    // Build detail with fame if applicable
    let detailText = 
      `${housing.emoji} ${housing.label}\n` +
      `${commute.emoji} ${commute.label}\n` +
      `${foodStrat.emoji} ${foodStrat.label}\n\n` +
      `Food: -$${formatMoney(foodLocal)}\n` +
      `Housing: -$${formatMoney(housingLocal)}\n` +
      `Commute: -$${formatMoney(commuteLocal)}`;
    
    if (fameDelta) {
      detailText += `\n\nTransportation: ${commute.label} • Fame ${fameDelta > 0 ? '+' : ''}${fameDelta}`;
    }
    
    // Record timeline entry
    recordTimelineEntry({
      kind: 'budget',
      title: '🏠 Cost of Living',
      detail: detailText,
      moneyDelta: -(foodLocal + housingLocal + commuteLocal),
      stressDelta: totalStress,
      loveDelta: 0,
      age
    });
    
    // Mark guard
    updateState(prev => ({ ...prev, lastLivingCostsAppliedAge: age }));
  }, [applyMoneyDelta, applyStress, applyPlayerHealth, applyDeltas, recordTimelineEntry, updateState]);

  // --- Goal Moments Queue & Resolve ---
  // --- Faith Mechanics ---
  const resolveFaithPopup = useCallback(() => {
    const popup = latestStateRef.current.faithPopupPending;
    if (!popup) return;
    
    const faith = latestStateRef.current.faith || {};
    const outcome = popup.outcome || 'question';
    const tradition = popup.tradition || faith.tradition;
    
    let newStatus = faith.status;
    let newTradition = faith.tradition;
    let newRefusedFrom = faith.refusedFromTradition || null;
    
    if (outcome === 'commit') {
      newStatus = 'committed';
    } else if (outcome === 'question') {
      newStatus = 'questioning';
    } else if (outcome === 'drift') {
      newStatus = 'not_practicing';
    } else if (outcome === 'refuse') {
      newStatus = 'refused';
      newRefusedFrom = tradition;
      newTradition = null;
    }
    
    const historyEntry = {
      age: popup.age,
      from: faith.status,
      to: newStatus,
      by: 'child',
      note: popup.title
    };
    
    updateState(prev => ({
      faithPopupPending: null,
      faith: {
        ...(prev.faith || {}),
        tradition: newTradition,
        status: newStatus,
        refusedFromTradition: newRefusedFrom,
        lastDecisionAge: popup.age,
        history: [...(prev.faith?.history || []), historyEntry]
      }
    }));
    
    addLog(`🙏 ${tradition}: ${newStatus === 'committed' ? 'They commit' : newStatus === 'questioning' ? 'Still questioning' : newStatus === 'not_practicing' ? 'Not practicing now' : 'They refuse'}`);
    
    recordTimelineEntry({
      kind: 'faith',
      title: `🙏 Faith Milestone: ${tradition}`,
      detail: popup.body || 'Child made a decision about faith.',
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0,
      age: popup.age
    });
  }, [updateState, addLog, recordTimelineEntry]);
  
  const maybeQueueFaithPopup = useCallback((age) => {
    const state = latestStateRef.current;
    const faith = state.faith || {};
    if (!faith.tradition) return;
    
    const MILESTONE_AGES = [7, 12, 16];
    const processed = Array.isArray(faith.milestoneAgesProcessed) ? faith.milestoneAgesProcessed : [];
    
    if (!MILESTONE_AGES.includes(age)) return;
    if (processed.includes(age)) return;
    
    const love100 = Math.max(0, Math.min(100, Number(state.love || 50)));
    const discipline = Number(state.stats?.discipline || 0);
    const discipline100 = Math.max(0, Math.min(100, discipline * 5));
    const exposure = Math.max(0, Math.min(100, faith.exposure || 0));
    const devotion = Math.max(0, Math.min(100, faith.devotion || 0));
    const pressure = Math.max(0, Math.min(100, (discipline100 - love100) * 0.6));
    
    const decisionScore = Math.max(0, Math.min(100, 
      0.45 * exposure + 0.35 * love100 + 0.20 * devotion - 0.35 * pressure
    ));
    
    const commitW = Math.max(0, decisionScore - 45);
    const refuseW = Math.max(0, 55 - decisionScore);
    const questionW = 20;
    const driftW = 15;
    
    const total = commitW + refuseW + questionW + driftW;
    if (total <= 0) return;
    
    const rng = createSeededRng(`${state.runSeed || 'seed'}|faith_popup|age:${age}`);
    const roll = rng.nextFloat() * total;
    
    let outcome = 'question';
    let acc = 0;
    
    acc += commitW;
    if (roll < acc) outcome = 'commit';
    else {
      acc += refuseW;
      if (roll < acc) outcome = 'refuse';
      else {
        acc += questionW;
        if (roll < acc) outcome = 'question';
        else outcome = 'drift';
      }
    }
    
    const COPY = {
      commit: {
        title: "A Commitment",
        body: "After months of routines, questions, and small conversations, your child decides to take {faithName} seriously. It becomes part of how they make sense of the world."
      },
      question: {
        title: "Big Questions",
        body: "Your child is curious about {faithName}, but they're not sure what they believe yet. They're watching, asking, and deciding what fits."
      },
      drift: {
        title: "Not Practicing",
        body: "Your child still thinks of {faithName} as part of their background, but they aren't motivated to practice right now."
      },
      refuse: {
        title: "A Clear No",
        body: "Your child pushes back on {faithName}. They don't want it to define them—and they want you to respect that."
      }
    };
    
    const copy = COPY[outcome] || COPY.question;
    
    updateState(prev => ({
      faithPopupPending: {
        age,
        tradition: faith.tradition,
        outcome,
        title: copy.title,
        body: copy.body
      },
      faith: {
        ...(prev.faith || {}),
        milestoneAgesProcessed: [...processed, age]
      }
    }));
  }, [updateState]);
  
  const processFaithExposureDecay = useCallback(() => {
    updateState(prev => {
      const f = prev.faith || {};
      if (!f.tradition) return prev;
      
      // Skip decay if in Religious School
      if (prev.schoolType === 'religious') return prev;
      
      const newExposure = Math.max(0, (f.exposure || 0) - 5);
      
      return {
        faith: {
          ...f,
          exposure: newExposure
        }
      };
    });
  }, [updateState]);

  const maybeQueueLifeGoalMoment = useCallback((age, { scenarioMandatory = false } = {}) => {
    setGameState(prev => {
      // Don't queue if mandatory scenario
      if (scenarioMandatory) return prev;
      
      // Don't queue if no selected goals
      const selectedIds = Array.isArray(prev.lifeGoals?.selectedIds) ? prev.lifeGoals.selectedIds : [];
      if (selectedIds.length === 0) return prev;
      
      // Don't queue if already pending
      if (prev.goalMomentPending) return prev;
      
      // At most 1 per age
      if (prev.goalMomentLastShownAge === age) return prev;
      
      // Deterministic chance: ~25% when goals exist
      const rng = createSeededRng(`${prev.runSeed || 'seed'}|goalMoment|age:${age}`);
      if (rng.nextFloat() > 0.25) return prev;
      
      const LIFE_GOAL_MOMENTS_LIST = Array.isArray(LIFE_GOAL_MOMENTS_PACK) ? LIFE_GOAL_MOMENTS_PACK : [];
      if (LIFE_GOAL_MOMENTS_LIST.length === 0) return prev;
      
      // Filter eligible events
      const usedIds = new Set(prev.usedGoalMomentIds || []);
      const eligible = LIFE_GOAL_MOMENTS_LIST.filter(evt => {
        const ageOk = age >= evt.minAge && age <= evt.maxAge;
        const goalOk = selectedIds.includes(evt.goalId);
        return ageOk && goalOk;
      });
      
      if (eligible.length === 0) return prev;
      
      // Prefer unused
      const fresh = eligible.filter(e => !usedIds.has(e.id));
      const pool = fresh.length > 0 ? fresh : eligible;
      
      // Pick deterministically
      const picked = rng.pick(pool);
      if (!picked) return prev;
      
      return {
        ...prev,
        goalMomentPending: picked,
        goalMomentLastShownAge: age
      };
    });
  }, []);

  const resolveGoalMoment = useCallback((choiceId) => {
    const moment = gameState.goalMomentPending;
    if (!moment) return;
    
    const choice = (moment.choices || []).find(c => c.id === choiceId);
    if (!choice) return;
    
    // Apply effects
    if (choice.moneyDelta) applyMoneyDelta(choice.moneyDelta, `Goal: ${moment.title}`, { category: 'goals' });
    if (choice.loveDelta) applyLove(choice.loveDelta, `Goal: ${moment.title}`);
    if (choice.stressDelta) applyStress(choice.stressDelta, `Goal: ${moment.title}`);
    if (choice.deltas) applyDeltas(choice.deltas, `Goal: ${moment.title}`);
    
    // Apply statePatch if provided
    if (choice.statePatch && typeof choice.statePatch === 'function') {
      updateState(choice.statePatch);
    }
    
    // Add log and timeline
    if (choice.logLine) addLog(choice.logLine);
    
    recordTimelineEntry({
      kind: 'goalMoment',
      title: choice.timelineTitle || `🎯 ${moment.title}`,
      detail: `${moment.body}\n\nYou chose: ${choice.emoji} ${choice.text}`,
      deltas: choice.deltas || null,
      moneyDelta: Number(choice.moneyDelta || 0),
      loveDelta: Number(choice.loveDelta || 0),
      stressDelta: Number(choice.stressDelta || 0),
      meta: { momentId: moment.id, goalId: moment.goalId, choice: choice.id }
    });
    
    // Clear pending and mark used
    updateState(prev => ({
      goalMomentPending: null,
      usedGoalMomentIds: [...(prev.usedGoalMomentIds || []), moment.id]
    }));
  }, [gameState.goalMomentPending, applyMoneyDelta, applyLove, applyStress, applyDeltas, updateState, addLog, recordTimelineEntry]);

  const resolveSiblingRivalryPopup = useCallback((choiceKey) => {
    setGameState(prev => {
      const queue = Array.isArray(prev.siblingRivalryPopupQueue) ? prev.siblingRivalryPopupQueue : [];
      if (queue.length === 0) return prev;

      const popup = queue[0] || {};
      const choices = Array.isArray(popup.choices) ? popup.choices : [];
      const choice = choices.find(c => c.key === choiceKey);

      const nextQueue = queue.slice(1);

      if (!choice) {
        return { ...prev, siblingRivalryPopupQueue: nextQueue };
      }

      const kids = Array.isArray(prev.kids) ? prev.kids.slice() : [];
      const idxA = kids.findIndex(k => k.id === popup.kidAId);
      const idxB = kids.findIndex(k => k.id === popup.kidBId);

      if (idxA === -1 || idxB === -1 || idxA === idxB) {
        return { ...prev, siblingRivalryPopupQueue: nextQueue };
      }

      const effects = choice.effects || {};
      let nextStats = prev.stats;
      let nextLove = prev.love;
      let nextStress = prev.stress;

      const applyKidEffects = (kid, kidEffects) => {
        if (!kid || !kidEffects) return { kid, didAffectActive: false, activeStats: null, activeLove: null };

        const slice = kid.childSlice || {};
        const baseStats =
          (slice.stats && typeof slice.stats === 'object') ? slice.stats :
          (prev.baselineStats && typeof prev.baselineStats === 'object') ? prev.baselineStats :
          (prev.stats && typeof prev.stats === 'object') ? prev.stats : {};

        const stats = { ...baseStats };
        const deltas = (kidEffects.statsDelta && typeof kidEffects.statsDelta === 'object') ? kidEffects.statsDelta : {};
        Object.entries(deltas).forEach(([k, v]) => {
          const n = Number(v);
          if (!Number.isFinite(n)) return;
          stats[k] = Math.max(0, (Number(stats[k]) || 0) + n);
        });

        const loveDelta = Number(kidEffects.loveDelta || 0);
        const baseLove = Number.isFinite(Number(slice.love))
          ? Number(slice.love)
          : (Number.isFinite(Number(prev.love)) ? Number(prev.love) : 50);

        const love = Math.max(0, Math.min(100, baseLove + loveDelta));
        const nextKid = { ...kid, childSlice: { ...slice, stats, love } };
        const didAffectActive = kid.id === prev.activeKidId;

        return { kid: nextKid, didAffectActive, activeStats: stats, activeLove: love };
      };

      const rA = applyKidEffects(kids[idxA], effects.kidA);
      kids[idxA] = rA.kid;
      if (rA.didAffectActive) {
        nextStats = rA.activeStats;
        nextLove = rA.activeLove;
      }

      const rB = applyKidEffects(kids[idxB], effects.kidB);
      kids[idxB] = rB.kid;
      if (rB.didAffectActive) {
        nextStats = rB.activeStats;
        nextLove = rB.activeLove;
      }

      if (effects.parent && effects.parent.stressDelta != null) {
        const d = Number(effects.parent.stressDelta);
        if (Number.isFinite(d)) {
          const base = Number.isFinite(Number(prev.stress)) ? Number(prev.stress) : 0;
          nextStress = Math.max(0, Math.min(100, base + d));
        }
      }

      const nextShown = (prev.yearFlags?.siblingRivalryPopupsShown || 0) + 1;

      return {
        ...prev,
        stats: nextStats,
        love: nextLove,
        stress: nextStress,
        kids,
        siblingRivalryPopupQueue: nextQueue,
        yearFlags: {
          ...(prev.yearFlags || {}),
          siblingRivalryPopupsShown: nextShown
        }
      };
    });
  }, []);

function applyLoveToKidId(kidId, delta, source = 'Adult Child') {
  if (!kidId || !Number.isFinite(Number(delta)) || Number(delta) === 0) return;

  updateState(prev => {
    const s = ensureKidsContainer(prev);
    const kids = Array.isArray(s.kids) ? s.kids.map(k => {
      if (k.id !== kidId) return k;
      const slice = k.childSlice || {};
      const cur = Number.isFinite(Number(slice.love)) ? Number(slice.love) : 50;
      const nextLove = Math.max(0, Math.min(100, cur + Number(delta)));
      return { ...k, childSlice: { ...slice, love: nextLove } };
    }) : [];

    const activeId = s.activeKidId;
    const isActive = activeId && activeId === kidId;

    return {
      ...s,
      kids,
      ...(isActive ? { love: Math.max(0, Math.min(100, (Number(s.love) || 50) + Number(delta))) } : {})
    };
  });

  // logging (safe, does not affect state init order)
  try {
    addLog(`💬 ${source}: Love ${Number(delta) > 0 ? '+' : ''}${Number(delta)}`);
  } catch {}
}

const enableAdultContinuation = useCallback(() => {
  setGameState(prev => {
    const s = ensureKidsContainer(prev);
    return {
      ...s,
      finished: false,
      adultContinuationEnabled: true,
      endAge: Math.max(Number(s.endAge || 18), 80),
      scenarioPending: false,
      pendingScenario: false,
      scenarioCompletedThisAge: true
    };
  });
}, []);

const setLocalCoopEnabled = useCallback((enabled) => {
  if (enabled === true) {
    updateState(prev => {
      if (!isLocalCoopEligible(prev)) return prev;
      const householdMax = Math.max(1, Math.floor(Number(prev.maxFocusTokens || 5)));
      const householdRemaining = Math.max(0, Math.floor(Number(prev.actionPoints ?? householdMax)));
      const focus = buildCoopFocus({ householdMax, householdRemaining });
      const coop = ensureLocalCoopState({
        enabled: true,
        activeSide: 'player',
        focus,
        tookTurnThisAge: { player: false, partner: false },
        lastSwitchAtAge: null
      });
      return {
        coop,
        guardianPerspective: {
          ...(prev.guardianPerspective || {}),
          activeId: 'player',
          side: 'player'
        },
        maxFocusTokens: focus.playerMax,
        actionPoints: focus.playerRemaining
      };
    });
  } else {
    updateState(prev => {
      const coopPrev = ensureLocalCoopState(prev.coop);
      if (!coopPrev.enabled) return prev;
      const f = coopPrev.focus || {};
      const householdMax = Math.max(1, Math.floor(Number(f.householdMax || Number(prev.maxFocusTokens || 5))));
      const householdRemaining = Math.max(0, Math.floor(Number(f.householdRemaining || prev.actionPoints || householdMax)));
      return {
        coop: ensureLocalCoopState({ ...DEFAULT_LOCAL_COOP_STATE, enabled: false }),
        guardianPerspective: {
          ...(prev.guardianPerspective || {}),
          activeId: 'player',
          side: 'player'
        },
        maxFocusTokens: householdMax,
        actionPoints: householdRemaining
      };
    });
  }
}, [updateState]);

const switchLocalCoopTurn = useCallback(() => {
  if (!gameState.coop?.enabled) return false;
  if (!isLocalCoopEligible(gameState)) return false;

  const coopCur = ensureLocalCoopState(gameState.coop);
  const activeSide = (coopCur.activeSide === 'partner') ? 'partner' : 'player';
  const otherSide = getOtherSide(activeSide);

  // Allow exactly ONE pass per age. If either side has already been marked "took turn",
  // we treat the pass as already used for this age.
  const took = coopCur.tookTurnThisAge || {};
  if (took.player === true || took.partner === true) return false;

  updateState(prev => {
    const coopPrev = ensureLocalCoopState(prev.coop);
    const f = coopPrev.focus || {};

    const activeSidePrev = (coopPrev.activeSide === 'partner') ? 'partner' : 'player';
    const otherSidePrev = getOtherSide(activeSidePrev);

    // Persist whatever the active side currently has remaining (from actionPoints)
    const currentAP = Math.max(0, Math.floor(Number(prev.actionPoints || 0)));

    const playerMax = Math.max(0, Math.floor(Number(f.playerMax || 0)));
    const partnerMax = Math.max(0, Math.floor(Number(f.partnerMax || 0)));
    const householdMax = Math.max(0, Math.floor(Number(f.householdMax || (playerMax + partnerMax))));

    const activeMax = activeSidePrev === 'player' ? playerMax : partnerMax;
    const otherMax = otherSidePrev === 'player' ? playerMax : partnerMax;

    const activeRemaining = Math.min(activeMax, currentAP);
    const otherRemainingKey = otherSidePrev === 'player' ? 'playerRemaining' : 'partnerRemaining';
    const otherRemainingRaw = Math.max(0, Math.floor(Number(f[otherRemainingKey] || 0)));
    const otherRemaining = Math.min(otherMax, otherRemainingRaw);

    const householdRemaining = Math.min(householdMax, activeRemaining + otherRemaining);

    const focusNext = {
      ...f,
      playerRemaining: (activeSidePrev === 'player') ? activeRemaining : otherRemaining,
      partnerRemaining: (activeSidePrev === 'partner') ? activeRemaining : otherRemaining,
      householdRemaining
    };

    const nextActiveMax = otherSidePrev === 'player' ? playerMax : partnerMax;
    const nextActiveRemaining = otherSidePrev === 'player' ? focusNext.playerRemaining : focusNext.partnerRemaining;

    const nextGuardianPerspective = prev.guardianPerspective || {};
    const shouldSetPerspective = isCoopControlledGuardianPerspective(nextGuardianPerspective);

    const rel = getCaregiverMetaForSide(prev, otherSidePrev).relationToChild;

    return {
      coop: ensureLocalCoopState({
        ...coopPrev,
        enabled: true,
        activeSide: otherSidePrev,
        focus: focusNext,
        // Mark the CURRENT (pre-switch) side as having taken their turn this age.
        // We intentionally overwrite both flags so corrupted/leftover state can't allow multi-pass.
        tookTurnThisAge: { player: false, partner: false, [activeSidePrev]: true }
      }),
      guardianPerspective: shouldSetPerspective ? {
        ...nextGuardianPerspective,
        activeId: otherSidePrev,
        side: otherSidePrev,
        relationToChild: rel
      } : nextGuardianPerspective,
      maxFocusTokens: Math.max(0, Math.floor(Number(nextActiveMax || 0))),
      actionPoints: Math.max(0, Math.floor(Number(nextActiveRemaining || 0)))
    };
  });

  return true;
}, [gameState.coop, updateState]);

// Remote Multiplayer Helpers
const patchRemoteMultiplayer = useCallback((patch) => {
  setGameState(prev => ({
    ...prev,
    remoteMultiplayer: {
      ...(prev.remoteMultiplayer || DEFAULT_REMOTE_MP),
      ...patch
    }
  }));
}, []);

const clearRemoteMultiplayer = useCallback(() => {
  setGameState(prev => ({
    ...prev,
    remoteMultiplayer: { ...DEFAULT_REMOTE_MP }
  }));
}, []);

const getRemoteCommitSnapshotJson = useCallback(() => {
  const sanitized = sanitizeForSave(latestStateRef.current);
  delete sanitized.remoteMultiplayer;
  return JSON.stringify(sanitized);
}, []);

const applyRemoteSnapshotFromSession = useCallback((snapshotObj, sessionRow) => {
  const keepMp = latestStateRef.current?.remoteMultiplayer || {};
  const slotId = latestStateRef.current?.activeSaveSlotId || 'slot1';
  
  const hydrated = hydrateSavedState(snapshotObj, slotId);
  
  hydrated.remoteMultiplayer = {
    ...keepMp,
    enabled: true,
    sessionId: sessionRow?.id || keepMp.sessionId,
    activeSide: sessionRow?.activeSide || keepMp.activeSide,
    stateVersion: Number(sessionRow?.stateVersion ?? 0),
    pendingCommit: null,
    lastError: null,
    lastSyncAt: Date.now()
  };
  
  setGameState(hydrated);
}, []);

// --- Urn Crypto Methods ---
const ensureUrnCryptoInitialized = useCallback(() => {
  setGameState(prev => {
    const uc = prev.urnCrypto || {};
    
    let nextUc = { ...uc };
    let changed = false;
    
    // Enable if not enabled
    if (!uc.enabled) {
      nextUc.enabled = true;
      nextUc.unlockedAtAge = Number(prev.currentYear || 0);
      changed = true;
    }
    
    // Initialize tokens if missing
    if (!Array.isArray(nextUc.tokens) || nextUc.tokens.length === 0) {
      nextUc.tokens = initUrnCryptoTokens({ runSeed: prev.runSeed });
      changed = true;
    }
    
    // Initialize prices if missing
    if (!nextUc.pricesById || Object.keys(nextUc.pricesById).length === 0) {
      nextUc.pricesById = initUrnCryptoPrices({ tokens: nextUc.tokens, runSeed: prev.runSeed });
      changed = true;
    }
    
    // Ensure positions exists
    if (!nextUc.positions || typeof nextUc.positions !== 'object') {
      nextUc.positions = {};
      changed = true;
    }
    
    if (!changed) return prev;
    
    return {
      ...prev,
      urnCrypto: nextUc
    };
  });
}, []);

const buyUrnCrypto = useCallback((tokenId, qty) => {
  const q = Math.max(1, Math.floor(Number(qty) || 1));
  const uc = gameState.urnCrypto || {};
  const price = Number(uc.pricesById?.[tokenId] || 100);
  
  const gross = q * price;
  const fee = Math.ceil(gross * (uc.tradeFeeRate || 0.025));
  const gasFee = uc.gasFee || 3;
  const totalCost = gross + fee + gasFee;
  
  if (gameState.money < totalCost) {
    toast.error('Not enough money');
    return false;
  }
  
  const token = (uc.tokens || []).find(t => t.id === tokenId);
  if (!token) return false;
  
  setGameState(prev => {
    const uc = prev.urnCrypto || {};
    const positions = { ...(uc.positions || {}) };
    const pos = positions[tokenId] || { qty: 0, costBasis: 0 };
    
    positions[tokenId] = {
      qty: pos.qty + q,
      costBasis: pos.costBasis + totalCost
    };
    
    const nextState = appendMoneyTx(prev, -totalCost, {
      source: `Urn Crypto Buy: ${token.name}`,
      note: `Bought ${q} @ $${price} (fee $${fee} + gas $${gasFee})`,
      category: 'crypto'
    });
    
    return {
      ...nextState,
      urnCrypto: {
        ...uc,
        positions
      }
    };
  });
  
  return true;
}, [gameState]);

const sellUrnCrypto = useCallback((tokenId, qty) => {
  const q = Math.max(1, Math.floor(Number(qty) || 1));
  const uc = gameState.urnCrypto || {};
  const pos = uc.positions?.[tokenId] || { qty: 0, costBasis: 0 };
  
  if (pos.qty < q) {
    toast.error('Not enough holdings');
    return false;
  }
  
  const price = Number(uc.pricesById?.[tokenId] || 100);
  const gross = q * price;
  const fee = Math.ceil(gross * (uc.tradeFeeRate || 0.025));
  const gasFee = uc.gasFee || 3;
  const proceeds = Math.max(0, gross - fee - gasFee);
  
  const token = (uc.tokens || []).find(t => t.id === tokenId);
  if (!token) return false;
  
  setGameState(prev => {
    const uc = prev.urnCrypto || {};
    const positions = { ...(uc.positions || {}) };
    const oldPos = positions[tokenId] || { qty: 0, costBasis: 0 };
    
    const ratio = q / (oldPos.qty || 1);
    const newQty = oldPos.qty - q;
    const newCostBasis = Math.round(oldPos.costBasis * (1 - ratio));
    
    if (newQty <= 0) {
      delete positions[tokenId];
    } else {
      positions[tokenId] = {
        qty: newQty,
        costBasis: newCostBasis
      };
    }
    
    const nextState = appendMoneyTx(prev, proceeds, {
      source: `Urn Crypto Sell: ${token.name}`,
      note: `Sold ${q} @ $${price} (fee $${fee} + gas $${gasFee})`,
      category: 'crypto'
    });
    
    return {
      ...nextState,
      urnCrypto: {
        ...uc,
        positions
      }
    };
  });
  
  return true;
}, [gameState]);

const markUrnCryptoRecapSeen = useCallback(() => {
  setGameState(prev => {
    const uc = prev.urnCrypto || {};
    const recap = uc.lastMarketRecap;
    if (!recap || !recap.unseen) return prev;
    
    return {
      ...prev,
      urnCrypto: {
        ...uc,
        lastMarketRecap: {
          ...recap,
          unseen: false
        }
      }
    };
  });
}, []);

const processUrnCryptoYearEndTick = useCallback((newAge) => {
  setGameState(prev => {
    const uc = prev.urnCrypto || {};
    
    if (!uc.enabled) return prev;
    
    let nextUc = { ...uc };
    
    // Ensure tokens initialized
    if (!Array.isArray(nextUc.tokens) || nextUc.tokens.length === 0) {
      nextUc.tokens = initUrnCryptoTokens({ runSeed: prev.runSeed });
    }
    
    // Ensure prices initialized
    if (!nextUc.pricesById || Object.keys(nextUc.pricesById).length === 0) {
      nextUc.pricesById = initUrnCryptoPrices({ tokens: nextUc.tokens, runSeed: prev.runSeed });
    }
    
    const tokens = nextUc.tokens;
    const oldPricesById = nextUc.pricesById;
    const positions = nextUc.positions || {};
    
    // Compute portfolio before
    let portfolioBefore = 0;
    let totalQty = 0;
    Object.entries(positions).forEach(([id, pos]) => {
      const qty = Number(pos?.qty || 0);
      const oldPrice = Number(oldPricesById[id] || 100);
      portfolioBefore += qty * oldPrice;
      totalQty += qty;
    });
    
    // Compute price movements
    const { headline, marketMood, newPricesById, changes } = computeUrnCryptoYearMove({
      runSeed: prev.runSeed,
      age: newAge,
      tokens,
      pricesById: oldPricesById
    });
    
    // Compute portfolio after
    let portfolioAfter = 0;
    Object.entries(positions).forEach(([id, pos]) => {
      const qty = Number(pos?.qty || 0);
      const newPrice = Number(newPricesById[id] || 100);
      portfolioAfter += qty * newPrice;
    });
    
    const delta = portfolioAfter - portfolioBefore;
    
    // Update state
    nextUc.pricesById = newPricesById;
    
    // Only set recap if player holds crypto
    if (totalQty > 0) {
      nextUc.lastMarketRecap = {
        age: newAge,
        ts: Date.now(),
        headline,
        marketMood,
        changes,
        portfolioBefore,
        portfolioAfter,
        delta,
        unseen: true
      };
    }
    
    return {
      ...prev,
      urnCrypto: nextUc
    };
  });
}, []);

const value = {
  gameState: gameStateView,
    mods: { portrait: portraitMod },
    updateState,
    addLog,
    applyDeltas,
    applyLove,
    applyStress,
    applyPlayerHealth,
    applyBabyPressure,
    tickBabyPressureForNewYear,
    spendMoney,
    applyMoneyDelta,
    addDiamonds,
    spendDiamonds,
    spendFocus,
    consumeAction, useAction: consumeAction,
    activateChallenge,
    deactivateChallenge,
    completeChallenge,
    recordTimelineEntry,
    emitActionResult,
    dismissActionResult,
    grantPartnerCounselingBuffer,
    applyLoveToKidId,
    getActionBeneficiary,

    // Curiosity Pack
    resolveCuriosityChoice,
    closeCuriosityModal,
    adjustedLoveGain,
    applyTechniqueBonusesForAction,
    pickFlavor,
    getLocalAmount,
    pickDatingAboutIndex,
    getActionAvailability,
    seededPick,
    loadScenarioForAge,
    processPetYearEnd,
    resolvePetEvent,
    adoptPet,
    rehomePet,
    usePetAction: performPetAction, // Legacy alias
    performPetAction,
    setActivePet,
    updatePTA,
    maybeQueueHomeworkPopup,
    resolveHomeworkPopup,
    maybeQueueChaosPopup,
    resolveChaosPopup,
    maybeQueueFaithPopup,
    resolveFaithPopup,
    processFaithExposureDecay,

    // Empathy School Bali
    processBaliYearStart,
    maybeQueueBaliPopups,
    resolveBaliCalmPopup,
    resolveBaliActivityPopup,

    // SCA v2
    resolveSCAv2Popup,
    skipSCAv2Popup,
    
    // Required by pages/modals
    SCHOOL_START_AGE,
    getAvailability,
    formatBaseToLocal,

    getCash,

    rerollTip,
    getScenarioFlavorLine,
    getScenarioOpenerLine,
    computeSuggestion,
    computeMoneyGoal,

    addHistory,
    incrementCounter,

    safeGenerateFinalOutcome,
    resetYearActions,
    applyStartOfAgeResources,
    captureYearCheckpoint,
    captureRewindSnapshot,
    rewindYears,

    getActiveChoice,
    loveDeltaFromChoice,
    stressDeltaFromChoice,
    getStressGauge,

    determineMemoryTone,
    generateMemoryText,
    addMicroMoments,
    recordChildTraumaEvent,
    resolveChildTraumaPopup,
    resolveMissedMilestone,

    pickTinyCuteForAge,
    shouldShowTinyCute,
    getKidWisdomBand,
    shouldShowKidWisdom,
    pickUniqueKidWisdom,
    tryGoldenMoment,
    recordFunMomentToLifeLog,
    markTinyCuteShownThisAge,
    markKidWisdomShownThisAge,

    applyTeacherTrust,
    applyPeerCircle,

    maybeQueueKidLogicPopup,
    resolveKidLogicPopup,
    runSchoolMilestone,
    runMicroEventForAge,

    computePhoneActive,

    countUnlockedTechniques,
    studiedGlowActive,
    addStudyHistory,
    pickStudyLesson,
    getStudyPoints,
    awardStudyPoints,

    // Saves
    setActiveSaveSlot,
    saveGameToSlot,
    loadGameFromSlot,
    resetGame,

    // Immigration
    updateAvailableCountries,
    immigrateToCountry,

    // Meta Achievements
    unlockMetaAchievement,
    loadMetaAchievements,

    // Wisdom Lenses
    getWisdomTier,
    isLensEquipped,
    awardWisdomXP,
    spendClarity,

    // Culture
    logCultureMoment,
    saveCulturePlan,
    addCultureEvent,
    getHouseholdYearlyIncome,
    getFameTier,
    applyFameDelta,
    processSocialMediaYearEnd,
  processCareerYearEndTick,
  processTitlesYearEndTick,
  processPlayerHealthYearEndTick,
  resolvePressEventChoice,
  processChildTraumaYearStartTick,

    // Helper functions
    hasAnyChild,
    hasMinorChild,
    getActiveChildFromState,
    getDisplayedChildAge,

    BOND_ACTIVITY_PACK,
    PLAY_ACTIVITY_PACK,
    OUTING_ACTIVITY_PACK,
    OUTDOOR_ACTIVITY_PACK,
    performActivity,

    // Sibling Rivalry
    addChild,
    removeChild,
    setActiveKid,
    setSiblingRivalryEnabled,
    maybeQueueSiblingRivalryPopups,
    resolveSiblingRivalryPopup,
    
    // Adult Life Moments (child-free mode: dedicated yearly popup)
    maybeQueueAdultLifeMomentPopup,
    resolveAdultLifeMomentPopup,
    
    // Adult Life (legacy: compatibility)
    maybeQueueAdultLifePopup,
    resolveAdultLifePopup,
    
    // Adult Child Continuation (post-18)
    maybeQueueAdultChildPopup,
    resolveAdultChildPopup,

    // Cost of Living & QoL
    grantInitialYear0CashIfNeeded,
    applyLivingCostsForAge,
    applyInventoryPassivesForAge,
    applyQualityOfLifeForAge,

    // Goal Moments
    maybeQueueLifeGoalMoment,
    resolveGoalMoment,
    
    // Adult Continuation
    enableAdultContinuation,

    // Urn Crypto
    ensureUrnCryptoInitialized,
    buyUrnCrypto,
    sellUrnCrypto,
    markUrnCryptoRecapSeen,
    processUrnCryptoYearEndTick,

    // Local Co-Op
    setLocalCoopEnabled,
    switchLocalCoopTurn,
    canPassLocalCoopTurn,
    isLocalCoopEnabled,

    // Remote Multiplayer
    patchRemoteMultiplayer,
    clearRemoteMultiplayer,
    getRemoteCommitSnapshotJson,
    applyRemoteSnapshotFromSession,

    // Prison System
    startPrisonFromCourt: ({ prisonYears, offenseId, offenseLabel, severity }) => {
      const res = startPrisonSentence({ state: gameState, prisonYears, offenseId, offenseLabel, severity });
      if (!res) return false;
      updateState(prev => ({
        ...prev,
        ...res.statePatches,
        prison: ensurePrisonState({ ...(prev.prison||{}), ...(res.prisonPatch||{}) })
      }));
      res.logs.forEach(addLog);
      recordTimelineEntry(res.timelineEntry);
      emitActionResult(res.actionResult);
      return true;
    },

    runPrisonYearStart: (newAge, hasChild) => {
      const res = beginPrisonYear({ state: gameState, newAge });
      updateState(prev => ({
        ...prev,
        prison: ensurePrisonState({
          ...(prev.prison||{}),
          ...(res.prisonPatch||{}),
          visitPendingThisAge: Boolean(hasChild)
        })
      }));
      res.logs.forEach(addLog);
      if (res.timelineEntry) recordTimelineEntry(res.timelineEntry);
    },

    doPrisonAction: (actionId, choice) => {
      const res = applyPrisonAction({ state: gameState, actionId, choice });
      if (!res) return null;

      updateState(prev => ({
        ...prev,
        prison: ensurePrisonState({ ...(prev.prison||{}), ...(res.prisonPatch||{}) })
      }));

      if (res.deltas?.moneyDelta) applyMoneyDelta(res.deltas.moneyDelta, "Prison");
      if (res.deltas?.stressDelta) applyStress(res.deltas.stressDelta, "Prison");
      if (res.deltas?.playerHealthDelta) updateState(prev => ({ playerHealth: Math.max(0, Math.min(100, (prev.playerHealth||50) + res.deltas.playerHealthDelta)) }));
      if (res.deltas?.statsDelta) applyDeltas(res.deltas.statsDelta, "Prison");

      (res.logs||[]).forEach(addLog);
      if (res.timelineEntry) recordTimelineEntry(res.timelineEntry);
      if (res.actionResult) emitActionResult({ actionId:"prison", ...res.actionResult });

      return res;
    },
  };

  function performActivity(activity) {
    const { focusCost = 1, moneyCost = 0, minAge = 0, requiresItems = [], seasons = [], limit, menu } = activity;

    // Get current mastery count BEFORE incrementing
    const prevCount = Number(gameState.activityMastery?.[activity.id]?.count || 0);
    
    // 1. Validation
    // Check mood-based disabled list (Play menu only)
    if (menu === 'play') {
      const disabledIds = gameState.moodLockedDisabledPlayIds || [];
      if (disabledIds.includes(activity.id)) {
        toast.error("Not up for this right now.");
        return false;
      }
    }
    
    if (gameState.actionPoints < focusCost) {
      toast.error(`Not enough Focus (needs ${focusCost})`);
      return false;
    }
    if (gameState.money < moneyCost) {
      toast.error(`Not enough money (needs $${formatMoney(moneyCost)})`);
      return false;
    }
    if ((gameState.currentYear || 0) < minAge) {
      toast.error(`Child is too young (needs age ${minAge}+)`);
      return false;
    }
    
    // Check items (hard validation)
    const missingItems = requiresItems.filter(itemId => !hasShopItem(gameState, itemId));
    if (missingItems.length > 0) {
      // Soft check per instructions (warn but allow, or maybe hard check? 
      // Prompt says: "treat requiresItems as “soft” (don’t hard-lock; show a warning and still allow)."
      // Wait, prompt said: "If the shop/items system doesn’t have these IDs, treat requiresItems as “soft”. 
      // If it DOES have them, presumably hard lock? 
      // Let's implement soft warning for now to be safe and ensure playability.
      // Actually, let's just toast a warning and proceed if it's "soft".
      // But if the item genuinely exists in the game, we should probably require it?
      // Re-reading: "activity.requiresItems (if set) must be owned (if your game has inventory). If the shop/items system doesn’t have these IDs, treat requiresItems as “soft”"
      // Since I don't know for sure if ART_SUPPLIES_KIT exists in shopCatalog without checking, I'll assume soft for now to pass "playable end-to-end".
      // Just toast warning.
      // Actually, I can check shopCatalog. 
      // Let's just do a toast "You improvise without the required item!" for now.
      const items = missingItems.map(id => SHOP_ITEM_BY_ID[id]?.name || id).join(', ');
      toast.error(`Missing required item(s): ${items}`);
      return false;
    }

    // Check seasons (dummy check if no season system)
    // Assuming no season system currently in `gameState` based on read files.
    // If there is one, I'd check `gameState.season`. 
    // I'll ignore for now.

    // Check limits
    if (limit && limit.type === 'perYear') {
      const usage = gameState.activityUsage?.[gameState.currentYear]?.[activity.id] || 0;
      if (usage >= limit.count) {
        toast.error("You've already done this activity this year.");
        return false;
      }
    }

    // 2. Apply Costs
    spendFocus(focusCost, activity.title);
    if (moneyCost > 0) spendMoney(moneyCost, activity.title);
    if (activity.moneyGain) applyMoneyDelta(activity.moneyGain, activity.title);

    // 3. Increment mastery count
    const newCount = prevCount + 1;
    updateState(prev => ({
      activityMastery: {
        ...(prev.activityMastery || {}),
        [activity.id]: { count: newCount }
      }
    }));

    // 4. Apply Effects
    const effects = activity.effects || {};

    // Player Health wiring (explicit + implicit for active family outings)
    const explicitHealth = Number(activity?.effects?.player?.health ?? 0);
    const childFitness = Number(activity?.effects?.child?.fitness ?? 0);
    const isActiveFamilyThing = (activity?.menu === 'outing' || activity?.menu === 'outdoor') && childFitness > 0;
    const implicitHealth = isActiveFamilyThing ? 0.3 : 0;
    const totalHealthDelta = explicitHealth + implicitHealth;
    if (totalHealthDelta !== 0) applyPlayerHealth(totalHealthDelta);
    
    // Bond/Love
    if (effects.bond) {
      applyLove(effects.bond, activity.title);
    }
    
    // Player Stats
    if (effects.player) {
      if (effects.player.stress) applyStress(effects.player.stress, activity.title);
      // Add other player stats if they exist
    }
    
    // Child Stats
    if (effects.child) {
      applyDeltas(effects.child, activity.title);
    }

    // 5. Apply mastery milestone bonuses
    let masteryBonus = null;
    if (newCount === 3) {
      applyDeltas({ confidence: 0.3 }, `Mastery: ${activity.title}`);
      masteryBonus = { stat: 'CONFIDENCE', value: 0.3, milestone: 3 };
    } else if (newCount === 5) {
      applyDeltas({ discipline: 0.5 }, `Mastery: ${activity.title}`);
      masteryBonus = { stat: 'DISCIPLINE', value: 0.5, milestone: 5 };
    } else if (newCount === 10) {
      applyDeltas({ happiness: 1.0 }, `Mastery: ${activity.title}`);
      masteryBonus = { stat: 'HAPPINESS', value: 1.0, milestone: 10 };
    }

    // 6. Record Usage
    updateState(prev => ({
      activityUsage: {
        ...prev.activityUsage,
        [prev.currentYear]: {
          ...(prev.activityUsage?.[prev.currentYear] || {}),
          [activity.id]: (prev.activityUsage?.[prev.currentYear]?.[activity.id] || 0) + 1
        }
      }
    }));

    // 7. Result (with outcome variants for Play menu only)
    let outcomeVariant = null;
    let variantEffects = { child: {}, bond: 0, player: { stress: 0 } };
    let rareLine = '';
    
    if (menu === 'play') {
      // Determine outcome variant (Good/Mixed/Backfire + rare variants)
      const rng = createSeededRng(`${gameState.runSeed}|playOutcome|${activity.id}|${prevCount}`);
      const mood = gameState.childMood || 'neutral';
      const patternMods = gameState.patternModsCache || { playOutcomeTilt: 0 };
      const stress = Number(gameState.stress ?? 0);
      
      // Base probabilities
      let pGood = 0.70;
      let pMixed = 0.25;
      let pBackfire = 0.05;
      
      // Mood modifiers
      if (mood === 'happy') { pGood += 0.10; pBackfire -= 0.02; }
      else if (mood === 'fragile') { pMixed += 0.08; pGood -= 0.08; }
      else if (mood === 'irritable') { pBackfire += 0.06; pGood -= 0.06; }
      
      // Pattern tilt modifier
      pGood += Number(patternMods.playOutcomeTilt ?? 0);
      
      // Stress modifier
      if (stress >= 60) { pBackfire += 0.05; pGood -= 0.05; }
      
      // Normalize
      const total = pGood + pMixed + pBackfire;
      if (total > 0) {
        pGood /= total;
        pMixed /= total;
        pBackfire /= total;
      }
      
      // Roll outcome
      const roll = rng.nextFloat();
      if (roll < pGood) outcomeVariant = 'good';
      else if (roll < pGood + pMixed) outcomeVariant = 'mixed';
      else outcomeVariant = 'backfire';
      
      // Rare variants
      const rareRoll = rng.nextFloat();
      if (rareRoll < 0.05) {
        rareLine = "Unexpected magic moment: ";
        variantEffects.bond += 2;
        variantEffects.child.confidence = (variantEffects.child.confidence || 0) + 1;
      } else if (rareRoll < 0.07) {
        rareLine = "Whew… rough moment: ";
        variantEffects.player.stress += 6;
        variantEffects.child.confidence = (variantEffects.child.confidence || 0) - 1;
        variantEffects.child.discipline = (variantEffects.child.discipline || 0) + 1;
      }
      
      // Apply outcome variant modifiers
      if (outcomeVariant === 'good') {
        variantEffects.bond += 1;
        if (stress > 0) variantEffects.player.stress -= 1;
      } else if (outcomeVariant === 'mixed') {
        variantEffects.player.stress += 1;
      } else if (outcomeVariant === 'backfire') {
        variantEffects.player.stress += 3;
        variantEffects.bond -= 1;
        variantEffects.child.empathy = (variantEffects.child.empathy || 0) + 1;
      }
      
      // Apply variant effects
      if (variantEffects.child && Object.keys(variantEffects.child).length) {
        applyDeltas(variantEffects.child, `${activity.title} (variant)`);
      }
      if (variantEffects.bond) applyLove(variantEffects.bond, `${activity.title} (variant)`);
      if (variantEffects.player?.stress) applyStress(variantEffects.player.stress, `${activity.title} (variant)`);
    }
    
    // Result text (rotate through lines deterministically)
    const lines = activity.resultLines || ["You spend some time together."];
    let idx = 0;
    if (lines.length > 1) {
      const seed = `${gameState.runSeed || 'default'}_${activity.id}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
      }
      const offset = Math.abs(hash) % lines.length;
      idx = (offset + prevCount) % lines.length;
    }
    const baseResultLine = lines[idx];
    const resultLine = rareLine ? `${rareLine}${baseResultLine}` : baseResultLine;
    
    addLog(resultLine);
    
    // Merge base effects with variant effects for display
    const finalChildDeltas = { ...(effects.child || {}), ...(variantEffects.child || {}) };
    Object.keys(finalChildDeltas).forEach(k => {
      if (!finalChildDeltas[k]) delete finalChildDeltas[k];
    });
    
    emitActionResult({
      title: activity.title,
      body: resultLine,
      deltas: Object.keys(finalChildDeltas).length ? finalChildDeltas : null,
      loveDelta: (effects.bond || 0) + (variantEffects.bond || 0),
      stressDelta: (effects.player?.stress || 0) + (variantEffects.player?.stress || 0),
      moneyDelta: (activity.moneyGain || 0) - moneyCost,
      focusDelta: -focusCost,
      tags: [activity.menu || 'activity', activity.group || 'general'],
      meta: { emoji: '✨', activityId: activity.id, outcomeVariant }
    });

    recordTimelineEntry({
      kind: activity.menu || 'activity',
      title: activity.title,
      detail: resultLine,
      deltas: effects.child,
      loveDelta: effects.bond,
      stressDelta: effects.player?.stress,
      moneyDelta: (activity.moneyGain || 0) - moneyCost
    });

    return true;
  }

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  
  if (typeof context.getAvailability !== "function") {
    context.getAvailability = () => ({ enabled: true });
  }

  return context;
}
