// OUTCOMES ENGINE V3 - Deterministic Variety + Safe Fallbacks + Family Patterns
// No "generation failed" messages, no duplicate sections, no "always 7 kids" bug

import { FAMILY_PATTERN_CATALOG } from './familyPatternCatalog';
import { generateKimOutcome } from '@/components/game/specialStarts/kimJongUnSpecialStart';
import { generateGazaWarZoneOutcome } from '@/components/game/specialStarts/gazaWarZoneSpecialStart.jsx';
import { generateSyriaRefugeeCampOutcome } from '@/components/game/specialStarts/syriaRefugeeCampSpecialStart.jsx';
import { PTA_ENDINGS } from '@/components/game/pta/ptaNarrative';
import { generateOutcomeV3NoAI } from "./outcomesEngineV3";
import { V4_COMEDY_BANK, V4_COMEDY_SHARED } from "./outcomeV4ComedyBank";
import { V4_SHARE_BANK } from "./outcomeV4ShareBank";
import { V4_ARC_BANK } from "./outcomeV4ArcBank";
import { computeEndingArchetype, computeEndingCallbacks, computeEndingBeatLines, computeSignatureFromStats } from "./endingNarrativeEngine";


// v4 comedy override becomes the public API (fallback to v3-noai)


// ===== OUTCOMES V4 — Family Section (authoritative, funny) =====
const V4_BANK = {
  sectionHeadlines: {
    family: [
      "Family",
      "Family, But Funnier",
      "Household Shenanigans",
      "The Clan, Allegedly"
    ]
  },
  family: {
    amazing: [
      "Everyone somehow survived the group chat.",
      "They ran the home with snacks, spreadsheets, and suspiciously competent pets.",
      "Holiday chaos, carefully color-coded.",
      "Love loud, schedules louder."
    ],
    terrible: [
      "They attempted a family calendar. The calendar won.",
      "They held a family meeting. It needed a follow-up meeting.",
      "A beautiful mess with strong opinions and louder Tupperware.",
      "Dinner was 30% food, 70% logistics."
    ],
    amazingPunch: [
      "Grandparents still smuggle sugar across state lines.",
      "The pets formed a soft power coalition and it works.",
      "Everyone knows where the charger lives (a miracle).",
      "They solved chores with a democracy and a bribe."
    ],
    terriblePunch: [
      "Someone always forgot the group chat rules.",
      "A rogue glitter project remains undefeated.",
      "They tried chore charts. The charts requested counseling.",
      "Family motto: we’ll fix it after snacks."
    ]
  }
};

function pick(rng, arr){ return rngPick(rng, arr); }


export function buildFamilySectionV4({ mode, childName, spouseName, kids, grandkids, greatGrandkids, spaceColonizers, rng }) {
  const base = mode === "amazing"
    ? pick(rng, V4_BANK.family.amazing)
    : pick(rng, V4_BANK.family.terrible);

  const punch = mode === "amazing"
    ? pick(rng, V4_BANK.family.amazingPunch)
    : pick(rng, V4_BANK.family.terriblePunch);

  return {
    headline: pick(rng, V4_BANK.sectionHeadlines.family),
    bullets: [
      kids > 0
        ? `Kids: ${kids} • Grandkids: ${grandkids} • Great-grandkids: ${greatGrandkids}`
        : "Kids: 0 • Emotional growth: pending",
      spaceColonizers > 0
        ? `${spaceColonizers} descendants colonized Alpha Centauri`
        : "No confirmed interstellar descendants",
      mode === "amazing"
        ? "Family vibe: chaotic but safe"
        : "Family vibe: loud, loving, slightly unhinged"
    ],
    paragraph: `${base} ${punch}`,
    tinyTruth:
      mode === "amazing"
        ? "Tiny truth: love compounds faster than interest."
        : "Tiny truth: someone always forgot the group chat rules."
  };
}

// Helpers for v4 comedy override
const ws = (s) => {
  const str = String(s || "");
  // Keep intentional line breaks, but normalize whitespace within lines.
  return str
    .split("\n")
    .map(line => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
function formatTpl(tpl, vars) { return String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? "")); }
function pickLocal(rng, arr) { return (arr && arr.length) ? arr[Math.floor(rng() * arr.length)] : ""; }
function tier3(val, low, high) { if (val <= low) return "terrible"; if (val >= high) return "amazing"; return "mid"; }

function buildComedySection(sectionKey, tier, vars, rng, tags) {
  const bank = V4_COMEDY_BANK[sectionKey];
  if (!bank) return null;

  const tagSet = (tags instanceof Set)
    ? tags
    : new Set(Array.isArray(tags) ? tags : []);

  // Supports both strings and conditional objects:
  // { text: string, requireAll?: string[], requireAny?: string[], excludeAny?: string[], weight?: number }
  function pickFromBank(arr) {
    const list = Array.isArray(arr) ? arr : [];
    if (list.length === 0) return "";

    const unconditional = [];
    const matching = [];

    const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);

    for (const item of list) {
      if (typeof item === "string") {
        unconditional.push({ text: item, weight: 1 });
        continue;
      }
      if (!isObj(item) || typeof item.text !== "string") continue;

      const requireAll = Array.isArray(item.requireAll) ? item.requireAll : [];
      const requireAny = Array.isArray(item.requireAny) ? item.requireAny : [];
      const excludeAny = Array.isArray(item.excludeAny) ? item.excludeAny : [];
      const hasReq = requireAll.length > 0 || requireAny.length > 0 || excludeAny.length > 0;

      const matchesAll = requireAll.every(t => tagSet.has(t));
      const matchesAny = (requireAny.length === 0) ? true : requireAny.some(t => tagSet.has(t));
      const matchesNone = (excludeAny.length === 0) ? true : !excludeAny.some(t => tagSet.has(t));
      const matches = matchesAll && matchesAny && matchesNone;

      const w = Number(item.weight);
      const weight = (Number.isFinite(w) && w > 0) ? w : 1;

      if (!hasReq) {
        unconditional.push({ text: item.text, weight });
      } else if (matches) {
        matching.push({ text: item.text, weight });
      }
    }

    const candidates = matching.length > 0 ? matching : unconditional;
    if (candidates.length === 0) return "";

    const total = candidates.reduce((sum, c) => sum + (c.weight || 1), 0);
    let roll = rng() * total;
    for (const c of candidates) {
      roll -= (c.weight || 1);
      if (roll <= 0) return c.text;
    }
    return candidates[candidates.length - 1]?.text || "";
  }

  const headline = formatTpl(pickFromBank(bank.headlines), vars) || sectionKey;

  const baseArr =
    tier === "amazing" ? bank.amazingBase :
    tier === "terrible" ? bank.terribleBase :
    bank.midBase;

  const punchArr =
    tier === "amazing" ? bank.amazingPunch :
    tier === "terrible" ? bank.terriblePunch :
    bank.midPunch;

  const base = formatTpl(pickFromBank(baseArr), vars);
  const punch = formatTpl(pickFromBank(punchArr), vars);

  // Optional clarifier for career & wealth
  const clarifierArr =
    tier === "amazing" ? (bank?.amazingClarifier || []) :
    tier === "terrible" ? (bank?.terribleClarifier || []) :
    (bank?.midClarifier || []);
  const clarifier = formatTpl(pickFromBank(clarifierArr), vars);
  const extra = (sectionKey === "careerWealth") ? clarifier : "";

  const joiner = (`${base}${punch}${extra}`.includes("\n")) ? "\n\n" : " ";
  const paragraph = ws([base, punch, extra].filter(Boolean).join(joiner));

  return {
    headline,
    bullets: [
      `Build: Best ${vars.bestStatName} ${vars.bestStatValue} • Growth edge: ${vars.worstStatName} ${vars.worstStatValue}`,
      `Love ${vars.love} • Stress ${vars.stress} • Harm ${vars.harmCount}`,
      `Money ${vars.moneyFmt} • Retirement ${vars.retirementFmt}`
    ],
    paragraph,
    tinyTruth: tier === "amazing"
      ? "Tiny truth: consistency is basically romance."
      : tier === "terrible"
        ? "Tiny truth: vibes are not a financial plan."
        : "Tiny truth: progress counts even when it’s weird."
  };
}

function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function pickNUnique(rng, arr, n) {
  const list = Array.isArray(arr) ? arr.filter(Boolean) : [];
  if (list.length === 0) return [];
  // deterministic shuffle using the provided rng
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list.slice(0, Math.max(0, n));
}

// Produces RT-XXXXXX (6 hex chars), deterministic
function hashToCode(str) {
  const s = String(str || "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0").slice(0, 6).toUpperCase();
  return `RT-${hex}`;
}

export function generateOutcomeV4(gameState) {
  if (gameState?.specialStartId === 'war_zone') {
    return generateGazaWarZoneOutcome(gameState);
  }
  if (gameState?.specialStartId === 'refugee_camp') {
    return generateSyriaRefugeeCampOutcome(gameState);
  }
  if (gameState?.specialStartId === 'kim_jong_un') {
    return generateKimOutcome(gameState);
  }
  const base = generateOutcomeV3NoAI(gameState);
  const tagSet = new Set(Array.isArray(base?.tags) ? base.tags : (base?.sections?.__debug?.tags || []));
  const timelineEntries = Array.isArray(gameState?.timelineEntries) ? gameState.timelineEntries : [];

  const rng = createRng(gameState.runSeed, gameState.childName || "Child", gameState.currentYear || 18);

  const stats = gameState.stats || {};
  const INT = Math.round(Number(stats.intelligence || 0));
  const EMP = Math.round(Number(stats.empathy || 0));
  const DIS = Math.round(Number(stats.discipline || 0));
  const CON = Math.round(Number(stats.confidence || 0));

  const love = Math.round(Number(gameState.love || 0));
  const stress = Math.round(Number(gameState.stress || 0));
  const money = Math.round(Number(gameState.money || 0));
  const retirementSavings = Math.round(Number(gameState.retirementSavings || 0));
  const harmCount = Math.round(Number(gameState?.counters?.harmCount || 0));

  // ===== Cinematic Ending Bits (Archetype + callbacks + beats) =====
  const seedKey = gameState.runSeed || "default";
  const narrativeStats = { intelligence: INT, empathy: EMP, discipline: DIS, confidence: CON };

  const sig = computeSignatureFromStats({ stats: narrativeStats, tags: tagSet, seed: `${seedKey}|signature` });

  const arch = computeEndingArchetype({
    seed: seedKey,
    childName: gameState.childName || "your child",
    parentRole: gameState.parentRole || "parent",
    stats: narrativeStats,
    love,
    stress,
    money,
    retirementSavings,
    harmCount,
    tags: tagSet,
    timelineEntries
  });

  if (arch?.id) tagSet.add(`ARCHETYPE_${arch.id}`);

  const callbacks = computeEndingCallbacks({
    seed: seedKey,
    timelineEntries,
    preferredAgeMin: 10,
    max: 2
  });

  const beats = computeEndingBeatLines({
    seed: seedKey,
    childName: gameState.childName || "your child",
    parentRole: gameState.parentRole || "parent",
    stats: narrativeStats,
    love,
    stress,
    money,
    retirementSavings,
    harmCount,
    tags: tagSet,
    timelineEntries
  });


  const statList = [
    { name: "Intelligence", value: INT },
    { name: "Empathy", value: EMP },
    { name: "Discipline", value: DIS },
    { name: "Confidence", value: CON },
  ].slice().sort((a,b) => b.value - a.value);

  const best = statList[0];
  const worst = statList[statList.length - 1];

  const spouseName = `${pickLocal(rng, V4_COMEDY_SHARED.spouseFirst)} ${pickLocal(rng, V4_COMEDY_SHARED.spouseLast)}`;
  const yearsMarried = pickLocal(rng, V4_COMEDY_SHARED.yearsMarried);
  const chaos = pickLocal(rng, V4_COMEDY_SHARED.chaosRomancePresets) || { girlfriends:0,boyfriends:0,situationships:0,longestMonths:0,engagedDays:0 };
  const retireAge = pickLocal(rng, V4_COMEDY_SHARED.retireAges);

  const moneyFmt = money < 0 ? `-$${Math.abs(money).toLocaleString()}` : `$${money.toLocaleString()}`;
  const retirementFmt = `$${Math.max(0, retirementSavings).toLocaleString()}`;

  const careerTier = tier3(money, -1, 20000);
  const relationshipsTier = (harmCount >= 2 || love <= 25) ? "terrible" : (love >= 75 && EMP >= 10) ? "amazing" : "mid";
  const familyTier = (love >= 75 && EMP >= 10 && harmCount === 0) ? "amazing" : (harmCount >= 2 && stress >= 60) ? "terrible" : "mid";
  const visitsTier = tier3(love, 25, 75);
  const forgivenessTier = (harmCount >= 2) ? "terrible" : (harmCount === 0 && love >= 50) ? "amazing" : "mid";
  const happinessTier = (stress >= 60) ? "terrible" : (stress <= 20 && (INT+EMP+DIS+CON) >= 48) ? "amazing" : "mid";
  const retirementTier = (retirementSavings >= 50000 || money >= 50000) ? "amazing" : (retirementSavings < 2000 && money < 0) ? "terrible" : "mid";

  const statSum = INT + EMP + DIS + CON; // 0..80
  let overallScore = statSum;
  overallScore += (love / 2);      // +0..50
  overallScore -= (stress / 2);    // -0..50
  overallScore += money >= 20000 ? 8 : money >= 0 ? 3 : -6;
  overallScore += retirementSavings >= 50000 ? 6 : retirementSavings >= 2000 ? 2 : -4;
  overallScore += harmCount === 0 ? 4 : (-harmCount * 3);

  const overallTier = overallScore >= 70 ? "amazing" : overallScore <= 35 ? "terrible" : "mid";

  const parentingTier =
    (EMP >= 14 && DIS >= 10 && love >= 60 && stress <= 40 && harmCount === 0) ? "amazing" :
    (EMP <= 6  && DIS <= 6  && stress >= 60) ? "terrible" :
    "mid";

  const retireDestination = retirementTier === "amazing"
    ? pickLocal(rng, V4_COMEDY_SHARED.richRetireSpots)
    : retirementTier === "terrible"
      ? pickLocal(rng, V4_COMEDY_SHARED.brokeRetireSpots)
      : pickLocal(rng, V4_COMEDY_SHARED.modestRetireSpots);
  const luxuryRetireThing = pickLocal(rng, V4_COMEDY_SHARED.luxuryRetireThings);


  const vars = {
    childName: gameState.childName || "your child",
    spouseName,
    yearsMarried,
    girlfriends: chaos.girlfriends,
    boyfriends: chaos.boyfriends,
    situationships: chaos.situationships,
    longestMonths: chaos.longestMonths,
    engagedDays: chaos.engagedDays,
    retireAge,
    retireDestination,
    luxuryRetireThing,
    love, stress, moneyFmt, retirementFmt,
    INT, EMP, DIS, CON,
    bestStatName: best?.name || "Unknown",
    bestStatValue: best?.value ?? 0,
    worstStatName: worst?.name || "Unknown",
    worstStatValue: worst?.value ?? 0,
    harmCount,
    signatureStrength: sig?.signatureStrength || "",
    workShadow: sig?.workShadow || "",
    archetypeId: arch?.id || "",
    archetypeTitle: arch?.title || "",
    archetypeTone: arch?.tone || "",
    archetypeHook: arch?.hook || "",
    archetypeTruth: arch?.truth || "",
    archetypeStinger: arch?.stinger || "",
    archetypePetFlourish: arch?.petFlourish || "",
    callback1: callbacks?.callback1 || "",
    callback2: callbacks?.callback2 || "",
    beat1: beats?.beat1 || "",
    beat2: beats?.beat2 || "",
    beat3: beats?.beat3 || "",
   };

  // Support per-section rerolls without affecting others
  const rerolls = gameState?.outcomeRerolls || {};
  const sections = { ...(base?.sections || {}) };

  const rngCareer = createRng(gameState.runSeed, "careerWealth", String(Number(rerolls["careerWealth"] || 0)));
  sections.careerWealth = buildComedySection("careerWealth", careerTier, vars, rngCareer, tagSet) || sections.careerWealth;

  const rngRel = createRng(gameState.runSeed, "relationships", String(Number(rerolls["relationships"] || 0)));
  sections.relationships = buildComedySection("relationships", relationshipsTier, vars, rngRel, tagSet) || sections.relationships;

  const rngFamily = createRng(gameState.runSeed, "family", String(Number(rerolls["family"] || 0)));
  sections.family = buildComedySection("family", familyTier, vars, rngFamily, tagSet) || sections.family;

  const rngVisits = createRng(gameState.runSeed, "visits", String(Number(rerolls["visits"] || 0)));
  sections.visits = buildComedySection("visits", visitsTier, vars, rngVisits, tagSet) || sections.visits;

  const rngForgiveness = createRng(gameState.runSeed, "forgiveness", String(Number(rerolls["forgiveness"] || 0)));
  sections.forgiveness = buildComedySection("forgiveness", forgivenessTier, vars, rngForgiveness, tagSet) || sections.forgiveness;

  const rngHappiness = createRng(gameState.runSeed, "happiness", String(Number(rerolls["happiness"] || 0)));
  sections.happiness = buildComedySection("happiness", happinessTier, vars, rngHappiness, tagSet) || sections.happiness;

  const rngRetirement = createRng(gameState.runSeed, "retirement", String(Number(rerolls["retirement"] || 0)));
  sections.retirement = buildComedySection("retirement", retirementTier, vars, rngRetirement, tagSet) || sections.retirement;

  const rngParenting = createRng(gameState.runSeed, "parentingStyle", String(Number(rerolls["parentingStyle"] || 0)));
  sections.parentingStyle = buildComedySection("parentingStyle", parentingTier, vars, rngParenting, tagSet) || sections.parentingStyle;

  const rngEpilogue = createRng(gameState.runSeed, "epilogue", String(Number(rerolls["epilogue"] || 0)));
  sections.epilogue = buildComedySection("epilogue", overallTier, vars, rngEpilogue, tagSet) || sections.epilogue;

  const rngHowTheyGrew = createRng(gameState.runSeed, "howTheyGrew", String(Number(rerolls["howTheyGrew"] || 0)));
  sections.howTheyGrew = buildComedySection("howTheyGrew", overallTier, vars, rngHowTheyGrew, tagSet) || sections.howTheyGrew;

  if (sections.ptaEpilogue || gameState?.pta?.unlocked) {
    const rngPta = createRng(gameState.runSeed, "ptaEpilogue", String(Number(rerolls["ptaEpilogue"] || 0)));
    sections.ptaEpilogue = buildComedySection("ptaEpilogue", overallTier, vars, rngPta, tagSet) || sections.ptaEpilogue;
  }

  // ===== SharePack (independent RNG so story text is stable) =====
  const rngShare = createRng(gameState.runSeed, "share", gameState.childName || "Child");
  const RS = rngShare;

  const prefix = pick(RS, V4_SHARE_BANK.titlePrefixes) || vars.bestStatName || "Calm";
  const role = pick(RS, V4_SHARE_BANK.titleRoles) || "Adult";
  const useSpecial = RS() < 0.5;
  const specials = V4_SHARE_BANK.titleSpecials[overallTier] || [];
  const template = pick(RS, V4_SHARE_BANK.titleTemplates) || "The {prefix} {role}";
  const composedTitle = template.replace("{prefix}", prefix).replace("{role}", role).replace("{bestStatName}", vars.bestStatName || "Stat");
  const endingTitle = (useSpecial && specials.length) ? (pick(RS, specials) || composedTitle) : composedTitle;

  const rarity = (pick(RS, V4_SHARE_BANK.rarityByTier[overallTier]) || overallTier).toString();
  const destGroup = retirementTier === "amazing" ? "luxury" : (retirementTier === "terrible" ? "value" : "comfort");
  const retireDestShare = (vars.retireDestination || pick(RS, V4_SHARE_BANK.retireDestinations[destGroup]) || "Somewhere nice");
  const retireHobby = pick(RS, V4_SHARE_BANK.retireHobbies) || "naps";
  const biggestPurchase = pick(RS, V4_SHARE_BANK.bigPurchasesByTier[overallTier]) || "a chair";

  // Share-only numbers
  const callsPerYear = Math.round(clamp((love + (EMP * 5)) + Math.floor(RS() * 40) - 20, 0, 365));
  const forgivenessDays = (() => {
    if (overallTier === "amazing") return Math.floor(1 + RS() * 14);
    if (overallTier === "terrible") return Math.floor(180 + RS() * 820);
    return Math.floor(14 + RS() * 166);
  })();
  const doomscrollMins = (() => {
    if (overallTier === "amazing") return Math.floor(5 + RS() * 25);
    if (overallTier === "terrible") return Math.floor(120 + RS() * 120);
    return Math.floor(30 + RS() * 90);
  })();
  const napsPerWeek = clamp(Math.round((stress / 100) * 10 + 1 + RS() * 3), 1, 14);

  // Family counts (share-only, simple deterministic ranges)
  let kids;
  if (familyTier === "amazing") kids = 2 + Math.floor(RS() * 6); // 2..7
  else if (familyTier === "terrible") kids = Math.floor(RS() * 4); // 0..3
  else kids = Math.floor(RS() * 5); // 0..4
  const grandkids = Math.floor(kids * (0.3 + RS() * 0.7));
  const greatGrandkids = Math.floor(grandkids * (RS() * 0.5));

  const code = hashToCode(`${gameState.runSeed}|${vars.childName}|v4`);
  const tags = (pickNUnique(RS, V4_SHARE_BANK.hashtags, 3) || []).map(t => `#${t}`);
  const tagsLine = tags.join(" ");

  const shareVars = {
    ...vars,
    endingTitle,
    rarity,
    code,
    retireDestination: retireDestShare,
    retireHobby,
    biggestPurchase,
    callsPerYear,
    forgivenessDays,
    doomscrollMins,
    napsPerWeek,
    kids, grandkids, greatGrandkids
  };

  const arc = [
    formatTpl(pick(RS, V4_ARC_BANK.origin[overallTier]), { ...shareVars, endingTitle }),
    formatTpl(pick(RS, V4_ARC_BANK.turning[overallTier]), { ...shareVars, endingTitle }),
    formatTpl(pick(RS, V4_ARC_BANK.final[overallTier]), { ...shareVars, endingTitle })
  ];

  const oneLiner = formatTpl(pick(RS, V4_SHARE_BANK.oneLinersByTier[overallTier] || []), shareVars);
  const receipts = [
    formatTpl(pick(RS, V4_SHARE_BANK.receiptTemplates.money), shareVars),
    formatTpl(pick(RS, V4_SHARE_BANK.receiptTemplates.loveStress), shareVars),
    formatTpl(pick(RS, V4_SHARE_BANK.receiptTemplates.wild), shareVars)
  ];
  const captions = (pickNUnique(RS, V4_SHARE_BANK.captionTemplates, 3) || []).map(t => formatTpl(t, { ...shareVars, tags: tagsLine }));
  const sharePack = { endingTitle, rarity, oneLiner, arc, receipts, captions, code, tagsLine };

  return { ...base, version: "v4", sections, sharePack, endingTitle, rarity, endingCode: code };
  }



// ===== SEEDED RNG =====
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function createRng(runSeed, childName, age) {
  const seedString = `${runSeed}|outcomes|${childName}|${age}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash = hash & hash;
  }
  return mulberry32(Math.abs(hash));
}

function rngPick(rng, list) {
  if (!list || list.length === 0) return null;
  return list[Math.floor(rng() * list.length)];
}

function rngWeightedPick(rng, weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [_, w]) => sum + w, 0);
  let roll = rng() * total;
  
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return parseInt(value);
  }
  
  return parseInt(entries[entries.length - 1][0]);
}

// ===== CHILDREN COUNT (Weighted, 7-8 Rare) =====
function computeNumChildren(love, emp, con, wealthTier, relationshipStable, rng) {
  // Compute family score
  let familyScore = love + emp;
  if (relationshipStable) familyScore += 4;
  if (wealthTier === "Wealthy" || wealthTier === "Comfortable") familyScore += 3;
  
  // Weighted distribution by score bucket
  let weights = {};
  
  if (familyScore < 12) {
    weights = {0: 55, 1: 30, 2: 12, 3: 3};
  } else if (familyScore < 21) {
    weights = {0: 25, 1: 35, 2: 25, 3: 12, 4: 3};
  } else if (familyScore < 31) {
    weights = {0: 10, 1: 20, 2: 30, 3: 20, 4: 12, 5: 6, 6: 2};
  } else if (familyScore < 41) {
    weights = {0: 6, 1: 10, 2: 18, 3: 22, 4: 18, 5: 14, 6: 9, 7: 2, 8: 1};
  } else {
    weights = {0: 5, 1: 8, 2: 14, 3: 18, 4: 18, 5: 16, 6: 14, 7: 5, 8: 2};
  }
  
  return rngWeightedPick(rng, weights);
}

// ===== SECTION ORDER (Single Render, No Duplicates) =====
export const OUTCOME_SECTION_ORDER = [
  "letter",
  "careerWealth",
  "relationships",
  "family",
  "visits",
  "forgiveness",
  "happiness",
  "retirement",
  "parentingStyle",
  "epilogue",
  "ptaEpilogue",
  "howTheyGrew"
];

// ===== SAFE SECTION WRAPPER =====
function safeSection(sectionId, fn, fallbackText) {
  try {
    const result = fn();
    if (!result || result.trim().length === 0) {
      console.warn(`[safeSection] ${sectionId} returned empty, using fallback`);
      return fallbackText;
    }
    return result;
  } catch (error) {
    console.error(`[safeSection] ${sectionId} threw error:`, error);
    return fallbackText;
  }
}

// ===== TEMPLATE LIBRARIES =====

const CAREER_TEMPLATES = [
  "They built a career that mixed brains and heart—people trusted them.",
  "They became a specialist: sharp, reliable… not always warm.",
  "They drifted for a while, then found meaning in caregiving.",
  "They founded something small that quietly mattered to real people.",
  "They did 'boring' work, then used the stability to live a good life.",
  "They chased big goals, learned humility, then built something truer.",
  "They work with people who need someone to stay.",
  "They keep complex systems from collapsing—quietly, consistently.",
  "They're brilliant in their lane—less brilliant at office politics.",
  "They become the person who knows everyone—and remembers their kids' names.",
  "They make things people didn't know they needed to see.",
  "They take the risk. Sometimes it pays. Sometimes it teaches."
];

const WEALTH_TEMPLATES = {
  Wealthy: [
    "Money becomes abundant. Time becomes the scarce resource.",
    "They're wealthy enough that problems change shape, not disappear.",
    "Financial stress isn't a thing anymore. Other stress fills the gap."
  ],
  Comfortable: [
    "They live comfortably, with room for mistakes and decent vacations.",
    "They can breathe financially—most months, anyway.",
    "Bills get paid; dreams require planning."
  ],
  Stable: [
    "They're stable—no fireworks, no collapse, just steady ground.",
    "It's not glamorous, but it holds.",
    "Money isn't tight. It's just… fine."
  ],
  Precarious: [
    "Money stays stressful. They learn to stretch, delay, and improvise.",
    "Paycheck-to-paycheck becomes a familiar rhythm.",
    "They work, but nothing ever feels fully secure."
  ]
};

const RELATIONSHIP_TEMPLATES = {
  secure: [
    "They build a long-term partnership that feels like a safe place.",
    "They marry someone who laughs at their worst jokes—and means it.",
    "They choose love carefully, then show up consistently.",
    "They find a partner who gets them. It's quiet, not dramatic.",
    "They build a relationship that feels earned, not accidental."
  ],
  learning: [
    "They date, learn, misstep, and eventually find something that sticks.",
    "They have a few meaningful relationships and finally stop chasing red flags.",
    "They keep love in their life, even when it scares them.",
    "They try relationships—some work, some teach.",
    "They date cautiously, learning what safe actually feels like.",
    "They're still figuring out closeness, but they're trying."
  ],
  guarded: [
    "They spend long stretches single—sometimes lonely, sometimes relieved.",
    "They want closeness, but flinch when it arrives.",
    "They keep people at arm's length and call it 'peace.'",
    "They date rarely. Vulnerability feels risky.",
    "They build a life that doesn't require closeness to work.",
    "Intimacy is complicated. They're working on it."
  ],
  distant: [
    "They keep distance from family and partners alike. Safety becomes their favorite word.",
    "They're careful with closeness. Repair is possible, but trust is slow.",
    "They disappear for stretches, then reappear like nothing happened.",
    "Intimacy feels dangerous. They choose solitude.",
    "Connection is hard. It always has been."
  ],
  chosenFamily: [
    "They build chosen family—friends who feel like home.",
    "They invest in friendships that matter more than blood ties.",
    "Their people aren't related, and that makes them stronger."
  ]
};

const FAMILY_TEMPLATES = {
  zero: [
    "They don't have kids. They pour their care into friends, work, and maybe a very spoiled pet.",
    "They choose pets and close friends as their 'home' energy.",
    "They become someone's chosen family, even if they never want the title.",
    "No kids. Their life is quieter, freer, and fully theirs.",
    "No kids—just a ridiculous pet and a peaceful home.",
    "They became the 'cool aunt/uncle' energy in the group.",
    "Chosen family, real community."
  ],
  one: [
    "They have 1 kid. They pour everything into that one relationship.",
    "They have 1 kid. Single-child energy: intense, intentional, unforgettable.",
    "One kid gets all of them—the good, the messy, the growth."
  ],
  two: [
    "They have 2 kids. A small family that feels complete.",
    "They have 2 kids. Two is enough—and it's real work.",
    "Two kids. The house is loud enough to feel alive."
  ],
  three: [
    "They have 3 kids. Chaos management becomes a life skill.",
    "They have 3 kids. They somehow keep everyone fed and mostly intact.",
    "Three kids. Zone defense parenting becomes second nature."
  ],
  four: [
    "They have 4 kids. They run a tight ship… most days.",
    "Four kids. The house is organized chaos with a detailed chore chart.",
    "They have 4 kids and learn to prioritize ruthlessly."
  ],
  five: [
    "They have 5 kids. Life is a logistics operation.",
    "Five kids. Quiet moments are precious and rare.",
    "They have 5 kids. Every day is controlled chaos."
  ],
  six: [
    "They have 6 kids. They become a parenting veteran by necessity.",
    "Six kids. The oldest ones basically raise the younger ones.",
    "They have 6 kids and a color-coded calendar that runs their life."
  ],
  seven: [
    "They have 7 kids. It's a whole tribe.",
    "Seven kids. They're basically running a small school at home.",
    "They have 7 kids. The noise level is permanently high."
  ],
  eight: [
    "They have 8 kids. It's rare, it's wild, it's theirs.",
    "Eight kids. They gave up on quiet years ago.",
    "They have 8 kids. Parenting becomes their full identity."
  ]
};

const VISITS_TEMPLATES = {
  rarely: [
    "They rarely visit. Time passes.",
    "They don't really visit. Messages are brief, if they come at all.",
    "Visits are absent. Distance becomes normal.",
    "You don't hear from them much. It stings less over time."
  ],
  occasionally: [
    "Visits are rare—mostly obligation, mostly holidays, mostly short.",
    "They visit occasionally, usually when guilt wins.",
    "They show up for major events. Barely.",
    "You see them once or twice a year. It's polite, not warm."
  ],
  sometimes: [
    "They visit sometimes. Not constantly, but enough to remind you you're still in their life.",
    "They show up a few times a year—when life slows down.",
    "You see them semi-regularly. It's not everything, but it's something.",
    "They call on holidays. Sometimes in between."
  ],
  often: [
    "They visit regularly. You're part of their routine, even as life gets busy.",
    "They call often and visit when they can.",
    "You're in their life. Not daily, but deeply.",
    "They check in. You're still their safe place."
  ],
  constantly: [
    "They visit all the time. They still reach for you—advice, stories, the comfort of home.",
    "They visit constantly. You're basically a second home.",
    "They still come home often. You pretend it doesn't matter as much as it does.",
    "They never really left. Distance is measured in miles, not connection."
  ]
};

const HAPPINESS_TEMPLATES = {
  grounded: [
    "They're surprisingly grounded. Balance was hard-won.",
    "They're content in a way that feels earned, not accidental.",
    "Life works. Not perfectly, but deeply."
  ],
  content: [
    "They're generally content—life isn't perfect, but it feels like theirs.",
    "They're doing well. Not flawless, but steady.",
    "Life feels workable. The hard days don't erase the good ones."
  ],
  balanced: [
    "They have good years and hard years, and learn not to confuse the two.",
    "They're okay. Some seasons are light, some are heavy.",
    "Life is mixed. They're learning to be okay with that.",
    "They function. Most days feel manageable."
  ],
  struggling: [
    "They get by. Joy shows up in flashes, not in foundations.",
    "Life feels like work more often than not.",
    "They function. Some days that's the win.",
    "Happiness is elusive. They keep trying anyway."
  ],
  heavy: [
    "Life feels heavy more often than not. They function. Sometimes that's the victory.",
    "Happiness is rare, but they keep moving.",
    "They survive more than they thrive. It's real.",
    "The weight stays. They adapted to carrying it."
  ],
  restless: [
    "They're restless—always searching for the next thing.",
    "Contentment is elusive. They keep chasing.",
    "They're capable but never quite settled.",
    "They achieve things but don't feel them."
  ]
};

const RETIREMENT_TEMPLATES = {
  Precarious: [
    "Retirement is tight. Rent is always close. Emergencies feel existential.",
    "You stretch every dollar. Social Security covers rent—barely.",
    "You live month-to-month. The word 'emergency' is terrifying.",
    "Housing is precarious. You're one crisis from upheaval.",
    "You work longer than planned. Stopping feels impossible.",
    "Retirement isn't rest—it's survival mode with less income.",
    "Money is the main stressor in retirement.",
    "You get by, but there's no margin for surprise.",
    "Every expense is negotiated. Relief is rare.",
    "You rely on others more than you planned."
  ],
  BareNes: [
    "You get by. No vacations, no buffer, but the lights stay on.",
    "Retirement is functional, not comfortable. You make it work.",
    "You live lean. Splurges are rare. Safety nets are thin.",
    "Bills get paid, but there's no margin for surprise.",
    "You manage, but 'comfortable' isn't the word you'd use.",
    "You survive retirement. That's different from enjoying it.",
    "It's lean, but you have a roof and routine.",
    "You make it work. Barely, but consistently.",
    "Financial stress is background noise. Always.",
    "You adapt. You always have."
  ],
  Modest: [
    "Retirement is modest but stable. You can breathe most months.",
    "You saved enough to retire without panic. That's no small thing.",
    "Life is simpler, quieter, and mostly predictable.",
    "You're not wealthy, but you're not stressed. That counts.",
    "Emergencies are manageable. Comfort is steady, not flashy.",
    "You live within your means and sleep soundly most nights.",
    "You did okay. Not rich, but steady.",
    "Small pleasures are affordable. That's enough.",
    "You saved enough to feel safe. That's the real wealth.",
    "Retirement feels like rest, not stress."
  ],
  Comfortable: [
    "Retirement is comfortable. You travel sometimes. You relax often.",
    "You saved well. Life feels earned, not strained.",
    "Money isn't a daily worry. That's a rare privilege.",
    "You can help your kids if they need it—and still be fine.",
    "Retirement means choices, not constraints.",
    "You live well. Not extravagantly, but genuinely well.",
    "You planned ahead, and it shows.",
    "You have breathing room. That's luxury redefined.",
    "Emergencies don't shake you. You have reserves.",
    "You're proud of what you built."
  ],
  Secure: [
    "Retirement is secure. You planned, saved, and now you rest easy.",
    "Money isn't a concern. Time becomes the real luxury.",
    "You travel, donate, and live without financial fear.",
    "You saved enough to be generous—with yourself and others.",
    "Retirement feels like freedom. That's what you worked for.",
    "You're wealthy enough that problems are logistical, not financial.",
    "You're one of the lucky ones. You know it.",
    "Financial security means you get to choose what matters.",
    "You worked hard, saved smart, and it paid off.",
    "Retirement is rest, travel, and peace of mind."
  ]
};

const PARENTING_STYLE_TEMPLATES = {
  abusive: [
    "Harsh patterns left marks. They learned safety meant distance.",
    "Volatility shaped the home. They learned to read moods before words.",
    "Harm accumulated. Repair was rare. Distance became protection."
  ],
  rigid: [
    "Control felt like love to you. To them, it felt suffocating.",
    "Structure was everywhere. Warmth was conditional.",
    "Rules were clear. Connection was not."
  ],
  chaotic: [
    "Consistency was rare. They learned to adapt to instability.",
    "Boundaries shifted. Predictability was the missing piece.",
    "Freedom was plentiful. Structure was scarce."
  ],
  steady: [
    "You showed up—imperfect, consistent, real.",
    "Warmth + boundaries became the rhythm.",
    "You weren't perfect. You were steady. That mattered."
  ],
  nurturing: [
    "You built a home where feelings were allowed.",
    "Repair was normal. They learned mistakes weren't fatal.",
    "Connection came first. Correction came second."
  ],
  mixed: [
    "Your style was inconsistent—sometimes warm, sometimes distant.",
    "You had good instincts and hard seasons. Both shaped them.",
    "Some things worked. Some things didn't. Both are true."
  ]
};

// ===== OUTCOME GENERATOR =====
function generateOutcomeV3Legacy(gameState) {
  const rng = createRng(gameState.runSeed, gameState.childName, gameState.currentYear);
  
  const { stats, love, stress, counters, money, retirementSavings, timelineEntries, householdType, incomeTier, emergencyFund } = gameState;
  const { intelligence: INT, empathy: EMP, discipline: DIS, confidence: CON } = stats;
  const harmCount = counters.harmCount || 0;
  
  // Calculate debt
  const debt = Math.max(0, -money);
  
  // ===== CAREER & WEALTH =====
  const careerWealth = safeSection('careerWealth', () => {
    // Determine wealth tier (INT + EMP drive top outcomes)
    let wealthTier = "Precarious";
    if (INT >= 28 && EMP >= 28) {
      wealthTier = rng() < 0.7 ? "Wealthy" : "Comfortable";
    } else if (INT >= 22 && EMP >= 18) {
      wealthTier = rng() < 0.5 ? "Comfortable" : "Stable";
    } else if (INT >= 16 || EMP >= 16) {
      wealthTier = "Stable";
    }
    
    // Hard constraint: Low EMP caps wealth
    if (INT >= 20 && EMP < 14) {
      wealthTier = "Stable"; // Can't reach Wealthy without empathy
    }
    
    const careerLine = rngPick(rng, CAREER_TEMPLATES);
    const wealthLine = rngPick(rng, WEALTH_TEMPLATES[wealthTier] || WEALTH_TEMPLATES.Stable);
    
    let result = `${careerLine} ${wealthLine}`;
    
    // Add discipline modifier
    if (DIS >= 10 && wealthTier !== "Precarious") {
      result += " Their consistency compounds over time.";
    } else if (DIS <= 1) {
      result += " Follow-through is a coin toss.";
    }
    
    return result;
  }, "They found stable work that fits who they are—imperfect, real, and theirs.");
  
  // Extract wealth tier for later use
  let wealthTier = "Stable";
  if (INT >= 28 && EMP >= 28) wealthTier = "Wealthy";
  else if (INT >= 22 && EMP >= 18) wealthTier = "Comfortable";
  else if (INT >= 16 || EMP >= 16) wealthTier = "Stable";
  else wealthTier = "Precarious";
  if (INT >= 20 && EMP < 14) wealthTier = "Stable";
  
  // ===== RELATIONSHIPS =====
  // ===== SUPERVILLAIN GATE =====
  const supervillainEligible = (() => {
    // If pack enabled or ever used hall, require hall
    const packEnabled = gameState.enabledScenarioPackIds?.includes('pack_juvenile_justice_v1');
    const hallEver = gameState.juvenileJustice?.hall?.ever;
    
    if (packEnabled || hallEver) {
      return hallEver;
    }
    
    // Original base criteria fallback
    return INT >= 25 && CON >= 25 && EMP <= 5;
  })();

  const supervillainOriginText = "Everyone loves to ask when my ‘origin story’ began. They assume it was a grand invention or a dramatic betrayal. Honestly? It started in juvenile hall—learning how rules are built, how routines shape people, and how power shows up in quiet places. I didn’t learn to behave. I learned to evolve.";

  const relationships = safeSection('relationships', () => {
    let tier = "learning";
    
    if (harmCount >= 2 || love <= 0) {
      tier = "distant";
    } else if (EMP >= 9 && CON >= 8) {
      tier = "secure";
    } else if (EMP >= 6 && CON >= 5 && harmCount === 0) {
      tier = "learning";
    } else if (CON <= 2 || EMP <= 3) {
      tier = "guarded";
    } else if (love >= 8 && EMP >= 7 && rng() < 0.3) {
      tier = "chosenFamily";
    }
    
    const base = rngPick(rng, RELATIONSHIP_TEMPLATES[tier]);
    
    // Add humor clause (except for distant)
    if (tier !== "distant" && rng() < 0.5) {
      const humor = [
        " Their group chats remain… a work in progress.",
        " They still occasionally overthink a 'K.'",
        " They learn the difference between chemistry and compatibility.",
        " Dating apps are… an adventure.",
        " They're fluent in subtext by now."
      ];
      return base + rngPick(rng, humor);
    }
    
    return base;
  }, "They learned relationships are a skill, not a prize—and they keep practicing.");
  
  const relationshipStable = EMP >= 6 && CON >= 5;
  
  // ===== FAMILY =====
  const family = safeSection('family', () => {
    const numChildren = computeNumChildren(love, EMP, CON, wealthTier, relationshipStable, rng);
    
    let tier = "two";
    if (numChildren === 0) tier = "zero";
    else if (numChildren === 1) tier = "one";
    else if (numChildren === 2) tier = "two";
    else if (numChildren === 3) tier = "three";
    else if (numChildren === 4) tier = "four";
    else if (numChildren === 5) tier = "five";
    else if (numChildren === 6) tier = "six";
    else if (numChildren === 7) tier = "seven";
    else if (numChildren === 8) tier = "eight";
    
    let base = rngPick(rng, FAMILY_TEMPLATES[tier]);
    
    // Add parenting callback if love high and kids exist
    if (numChildren > 0 && love >= 9 && rng() < 0.4) {
      const callbacks = [
        " They parent differently than you did.",
        " They're intentional with their kids in a way that feels familiar.",
        " They break some of your patterns and keep others."
      ];
      base += rngPick(rng, callbacks);
    }
    
    return base;
  }, "Their family life took a path that made sense for them.");
  
  // ===== VISITS =====
  const visits = safeSection('visits', () => {
    // Check for living together
    const livingTogether = love >= 18 && EMP >= 30 && (CON >= 10 || DIS >= 10);
    if (livingTogether) {
      return "They live with you. Visits aren't a thing—it's just home.";
    }
    
    let tier = "sometimes";
    if (love <= 0) tier = "rarely";
    else if (love <= 3) tier = "occasionally";
    else if (love <= 6) tier = "sometimes";
    else if (love <= 9) tier = "often";
    else tier = "constantly";
    
    return rngPick(rng, VISITS_TEMPLATES[tier]);
  }, "Your connection changed over time—sometimes close, sometimes complicated.");
  
  // ===== HAPPINESS =====
  const happiness = safeSection('happiness', () => {
    const happinessScore = INT + EMP + DIS + CON;
    const spread = Math.max(INT, EMP, DIS, CON) - Math.min(INT, EMP, DIS, CON);
    
    let tier = "balanced";
    if (happinessScore >= 28 && spread <= 5) tier = "grounded";
    else if (happinessScore >= 24) tier = "content";
    else if (happinessScore >= 16) tier = "balanced";
    else if (happinessScore >= 10) tier = "struggling";
    else tier = "heavy";
    
    if (spread >= 8 && stress >= 8) tier = "restless";
    
    const base = rngPick(rng, HAPPINESS_TEMPLATES[tier]);
    
    // Add technique modifier
    const techCount = Object.values(gameState.techniquesUnlocked || {}).filter(v => v).length;
    if (techCount >= 3) {
      return base + " They know tools exist—and they actually use them.";
    } else if (techCount >= 1 && tier !== "heavy") {
      return base + " They're willing to ask for help when needed.";
    }
    
    return base;
  }, "They're still becoming themselves, like everyone.");
  
  // ===== RETIREMENT =====
  const retirement = safeSection('retirement', () => {
    let tier = "Modest";
    if (retirementSavings < 2000) tier = "Precarious";
    else if (retirementSavings < 8000) tier = "BareBones";
    else if (retirementSavings < 20000) tier = "Modest";
    else if (retirementSavings < 50000) tier = "Comfortable";
    else tier = "Secure";
    
    let base = rngPick(rng, RETIREMENT_TEMPLATES[tier] || RETIREMENT_TEMPLATES.Modest);
    
    // Add living together modifier if applicable
    const livingTogether = love >= 18 && EMP >= 30 && (CON >= 10 || DIS >= 10);
    if (livingTogether) {
      if (tier === "Precarious" || tier === "BareBones") {
        base += " Even without much money, they show up — rides, meals, time. That's the real pension.";
      } else {
        base += " You could do it alone, but you don't have to.";
      }
    }
    
    return base;
  }, "Retirement is a mix of money, health, and who shows up.");
  
  // ===== PARENTING STYLE =====
  const parentingStyle = safeSection('parentingStyle', () => {
    const majorCount = timelineEntries.filter(e => e.kind === "major").length;
    const warmthAvg = gameState.warmthPoints / Math.max(1, majorCount);
    const structureAvg = gameState.structurePoints / Math.max(1, majorCount);
    
    let tier = "mixed";
    if (harmCount >= 2 || love <= 0) tier = "abusive";
    else if (warmthAvg <= -0.5 && structureAvg > 1.5) tier = "rigid";
    else if (structureAvg <= -0.5 || DIS <= 1) tier = "chaotic";
    else if (warmthAvg > 1.5 && structureAvg > 1.5) tier = "steady";
    else if (warmthAvg > 1.5) tier = "nurturing";
    else tier = "mixed";
    
    const base = rngPick(rng, PARENTING_STYLE_TEMPLATES[tier]);
    
    // Add stress context
    if (stress >= 10) {
      return base + " High stress leaked into everything.";
    } else if (stress <= 3 && tier !== "abusive") {
      return base + " Your steadiness showed up when it mattered.";
    }
    
    return base;
  }, "Your style had patterns—some helpful, some costly—and the story reflects that.");
  
  // ===== PTA ILLUMINATI EPILOGUE =====
  const ptaEpilogue = safeSection('ptaEpilogue', () => {
    if (!gameState.pta || !gameState.pta.unlocked) return "";
    
    // Check Shadow President First (Highest Priority)
    if (gameState.pta.flagShadowPresidentSuccess) {
      const ending = PTA_ENDINGS.find(e => e.id === 11);
      return `\n\n=== 👁️ SHADOW PRESIDENT ===\n${ending.text}`;
    }

    const { influence = 0, heat = 0, integrity = 50, standing = 50, childTrust = 50 } = gameState.pta.stats;
    
    // Logic to pick ending
    let endingId = 1; // Default: Quiet Builder
    
    if (gameState.pta.flagExile) endingId = 7;
    else if (gameState.pta.flagWhistleblower) endingId = 8;
    else if (heat > 70 || gameState.pta.flagScandal) endingId = 4;
    else if (gameState.pta.flagDonorMachine && integrity < 40) endingId = 6;
    else if (integrity > 70 && gameState.pta.stats.npcRelations?.deleon > 60) endingId = 5;
    else if (gameState.pta.flagRedeemedRival) endingId = 9;
    else if (influence > 70 && integrity < 50) endingId = 2; // Kingmaker
    else if (standing > 70 && influence > 40) endingId = 3; // Public Hero
    else if (gameState.pta.flagBoundaryParent) endingId = 10;
    
    const ending = PTA_ENDINGS.find(e => e.id === endingId);
    return `\n\n=== 🏫 PTA LEGACY: ${ending.title} ===\n${ending.text}`;
  }, "");

  // ===== EPILOGUE =====
  const epilogue = safeSection('epilogue', () => {
    const trajectoryLines = [
      "Looking back, the story isn't just what happened—it's what kept happening.",
      "Years later, the pattern is clearer than the moments ever were.",
      "Time doesn't smooth everything, but it shows what mattered.",
      "In hindsight, it's obvious what they were learning when you thought they weren't.",
      "The years blur. The patterns stay."
    ];
    
    let result = rngPick(rng, trajectoryLines);
    
    // Add collection callback
    if (gameState.passportStamps && gameState.passportStamps.length > 0) {
      const stamp = rngPick(rng, gameState.passportStamps);
      const placeName = stamp?.name || stamp?.place;
      if (placeName) result += ` They still talk about ${placeName}.`;
    } else if (gameState.bookshelf && gameState.bookshelf.length > 0) {
      const book = rngPick(rng, gameState.bookshelf);
      if (book && book.title) result += ` They kept "${book.title}" on their shelf.`;
    }
    
    // Add visits callback
    let visitsTier = "sometimes";
    if (love <= 0) visitsTier = "rarely";
    else if (love <= 3) visitsTier = "occasionally";
    else if (love <= 6) visitsTier = "sometimes";
    else if (love <= 9) visitsTier = "often";
    else visitsTier = "constantly";
    
    const visitLines = {
      rarely: " You don't hear from them much.",
      occasionally: " They check in sometimes.",
      sometimes: " They're in your life, even when distance grows.",
      often: " They still call you first when things break.",
      constantly: " They still come home."
    };
    result += visitLines[visitsTier];
    
    // Add closing
    const closingLines = [
      " They don't become perfect. They become real.",
      " They grow into a person with contradictions—and a life anyway.",
      " Somewhere, they still roll their eyes at you. That's how you know they're okay.",
      " They're flawed, capable, and unmistakably themselves.",
      " The kid you raised is gone. The adult they became is here."
    ];
    result += rngPick(rng, closingLines);
    
    return result;
  }, "Time passed. Patterns emerged.");

  // Force non-empty letter if missing
  if (!letter || !letter.trim()) {
    // Note: 'letter' variable is const above, but we can't reassign const.
    // However, we can handle it in the final object assembly or ensure safeSection fallback worked.
    // safeSection has a fallback, but let's double check.
  }
  
  // ===== COMPUTE CHILD PATTERNS (inheritance from player) =====
  const childPatternsFromPlayer = safeSection('childPatternsFromPlayer', () => {
    const familyPatterns = gameState.familyPatterns || {};
    const selectedIds = familyPatterns.selectedIds || [];
    const severityById = familyPatterns.severityById || {};
    const resolvedById = familyPatterns.resolvedById || {};
    const counselorByAge = familyPatterns.counselorByAge || {};
    
    // Count counselor sessions
    const counselorSessionsTotal = Object.values(counselorByAge).filter(s => s.used).length;
    
    // Count Positive Parenting studies
    const studyProgress = gameState.studyProgress?.positiveParenting || {};
    const studiesCompleted = studyProgress.completedCount || 0;
    
    // Compute candidates
    const candidates = [];
    selectedIds.forEach(id => {
      // Base chance
      let chance = 0.30 + (0.12 * (severityById[id] || 0));
      
      // Buffers
      if (resolvedById[id]) {
        chance = 0.05;
      } else {
        if (counselorSessionsTotal >= 2) chance -= 0.06;
        if (studiesCompleted >= 5) chance -= 0.06;
        if (love >= 7) chance -= 0.08;
        if (stress >= 7) chance += 0.06;
      }
      
      // Clamp
      chance = Math.max(0.02, Math.min(0.85, chance));
      
      // Roll
      if (rng() < chance) {
        candidates.push(id);
      }
    });
    
    // Cap at 3
    if (candidates.length > 3) {
      const shuffled = [...candidates].sort(() => rng() - 0.5);
      return shuffled.slice(0, 3);
    }
    
    return candidates;
  }, []);
  
  // ===== COMPUTE CHILD PATTERNS (inheritance from partner) =====
  const childPatternsFromPartner = safeSection('childPatternsFromPartner', () => {
    if (gameState.householdType !== 'two' || !gameState.partnerPatterns) {
      return [];
    }
    
    const partnerPatterns = gameState.partnerPatterns || {};
    const selectedIds = partnerPatterns.selectedIds || [];
    const severityById = partnerPatterns.severityById || {};
    const resolvedById = partnerPatterns.resolvedById || {};
    const counselorByAge = gameState.familyPatterns?.counselorByAge || {};
    
    // Count partner-focused counselor sessions
    const partnerCounselorCount = Object.values(counselorByAge).filter(s => s.target === 'partner').length;
    
    // Count Positive Parenting studies
    const studyProgress = gameState.studyProgress?.positiveParenting || {};
    const studiesCompleted = studyProgress.completedCount || 0;
    
    // Compute candidates
    const candidates = [];
    selectedIds.forEach(id => {
      // Base chance
      let chance = 0.20 + (0.08 * (severityById[id] || 0));
      
      // Buffers
      if (resolvedById[id]) {
        chance = 0.05;
      } else {
        if (partnerCounselorCount >= 2) chance -= 0.05;
        if (love >= 7) chance -= 0.05;
        if (stress >= 7) chance += 0.05;
      }
      
      // Clamp
      chance = Math.max(0.02, Math.min(0.70, chance));
      
      // Roll
      if (rng() < chance) {
        candidates.push(id);
      }
    });
    
    return candidates;
  }, []);
  
  // Merge child patterns from both parents
  const mergedChildPatterns = [...new Set([...childPatternsFromPlayer, ...childPatternsFromPartner])];
  
  // Cap merged to 4 (seeded keep first 4)
  let childPatterns = mergedChildPatterns.length > 4 
    ? mergedChildPatterns.slice(0, 4)
    : mergedChildPatterns;

  // Guardrail: if any *unresolved* parent patterns exist, ensure at least 1 echo appears.
  // (Prevents a confusing empty epilogue due to RNG luck.)
  if (childPatterns.length === 0) {
    const fp = gameState.familyPatterns || {};
    const pp = gameState.partnerPatterns || {};
    const selfSelected = fp.selectedIds || [];
    const partnerSelected = pp.selectedIds || [];
    const selfResolved = fp.resolvedById || {};
    const partnerResolved = pp.resolvedById || {};

    const unresolved = [
      ...selfSelected.filter(id => !selfResolved[id]),
      ...partnerSelected.filter(id => !partnerResolved[id])
    ];

    const pool = [...new Set(unresolved)];
    if (pool.length > 0) {
      childPatterns = [rngPick(rng, pool)];
    }
  }
  
  // ===== LONG LETTER BUILDER =====
function buildLongAdultChildLetter(gameState, rng) {
  const { love, householdType, childName, memories, timelineEntries, parentRole } = gameState;
  const parentTitle = parentRole === "dad" ? "Dad" : "Mom";
  const paragraphs = [`Dear ${parentTitle},`];

  // 1. GREETING & TONE
  const openingTemplates = {
    resentful: [
      "I'm writing this because I need to say it, not because I expect you to fix it. We both know things weren't easy.",
      "I've been thinking about growing up. It's complicated. I needed space to feel okay, and I still do.",
      "This is hard to write. We have a lot of history, and not all of it is good."
    ],
    distant: [
      "I know we don't talk much. Closeness has always been a little tricky for us, hasn't it?",
      "I'm doing okay on my own. Life turned out differently than I expected, but I'm managing.",
      "I've been reflecting on the past. We're different people now, and maybe that's okay."
    ],
    mixed: [
      "I've been thinking about us. We weren't perfect, but we were real. Some things still sting, and some things actually help.",
      "Looking back, our time together was complicated. Not all good, not all bad, just... a lot.",
      "I'm writing this because I finally have some perspective on how hard you were trying, even when it didn't land right."
    ],
    warm: [
      "I wanted to reach out. I felt loved more often than not, and that gave me a base to stand on.",
      "I was thinking about you today. You taught me more than you probably realize, just by being there.",
      "I still hear your voice in my head sometimes—usually when I'm trying to be kind to myself."
    ],
    close: [
      "You're still my safe place—annoying sometimes, sure, but safe. I don't say it enough.",
      "I tell my friends about you. You're still my person, even when I pretend I'm too busy to call.",
      "I was just thinking about home. You made it a place I actually want to come back to."
    ]
  };

  let loveTier = "mixed";
  if (love <= 0) loveTier = "resentful";
  else if (love <= 3) loveTier = "distant";
  else if (love <= 6) loveTier = "mixed";
  else if (love <= 9) loveTier = "warm";
  else loveTier = "close";

  paragraphs.push(rngPick(rng, openingTemplates[loveTier]));

  // 2. CONCRETE MEMORY OR TIMELINE CALLBACK
  let memoryParagraph = "";
  if (memories && memories.length > 0) {
    const memory = rngPick(rng, memories);
    if (memory && memory.text) {
      memoryParagraph = `I still remember this specific moment: "${memory.text}" It stuck with me.`;
    }
  } else if (timelineEntries && timelineEntries.length > 0) {
    // Pick a meaningful entry if no explicit memory
    const meaningfulKinds = ['major', 'bond', 'kidWisdom', 'tinyCute', 'milestone', 'chapter_beat'];
    const candidates = timelineEntries.filter(e => meaningfulKinds.includes(e.kind) && e.detail && e.detail.length > 10);
    const entry = rngPick(rng, candidates) || rngPick(rng, timelineEntries);
    
    if (entry) {
      memoryParagraph = `I remember when I was around ${entry.age}. ${entry.title}. ${entry.detail} That moment felt like a turning point.`;
    }
  }

  if (!memoryParagraph) {
    memoryParagraph = "I remember the small things mostly. The way the house smelled in the morning, or how you looked when you were tired but kept going. The details blur, but the feeling stays.";
  }
  paragraphs.push(memoryParagraph);

  // 3. SHAPED IN ADULTHOOD (STRENGTH + COST)
  const shapedTemplates = [
    "Growing up with you shaped how I see the world. I learned that things don't have to be perfect to be good.",
    "I carry a lot of you with me. Sometimes that's a strength, and sometimes it's something I have to work on.",
    "I see your influence in how I handle stress now. I'm learning to pause, just like you tried to teach me.",
    "You showed me that showing up matters more than having all the answers. I use that every day.",
    "I learned resilience from watching you. I also learned that it's okay to be tired."
  ];
  paragraphs.push(rngPick(rng, shapedTemplates));

  // 4. WHERE WE ARE NOW / CLOSING
  const closingLines = [];
  if (householdType === "single") {
    closingLines.push("I know you carried a lot on your own. I see that clearly now.");
  }
  
  if (gameState.phoneOwned) {
    closingLines.push("Also, the phone thing? You were probably right to be worried, even if I hated it then.");
  }

  // Family patterns
  const familyPatterns = gameState.familyPatterns || {};
  const resolvedCount = Object.values(familyPatterns.resolvedById || {}).filter(v => v).length;
  if (resolvedCount > 0) {
    closingLines.push("I felt you trying to break old patterns. It mattered.");
  }

  if (loveTier === "resentful" || loveTier === "distant") {
    closingLines.push("I'm finding my own way. I hope you are too.");
  } else {
    closingLines.push("Thanks for doing your best. I'm doing okay.");
  }

  paragraphs.push(closingLines.join(" "));

  // MINIMUM LENGTH GUARD
  const fullText = paragraphs.join("\n\n");
  if (fullText.length < 650) {
    paragraphs.push("I guess what I'm really trying to say is that growing up is a long process, and I'm still figuring it out. But looking back helps. It helps to see the whole picture, not just the moments that were loud or easy. It's the quiet stuff that built me.");
  }

  // SIGN-OFF
  const signOffTemplates = {
    close: "Love,",
    warm: "With love,",
    mixed: "Sincerely,",
    distant: "Best,",
    resentful: "—"
  };
  
  // Use loveTier directly for signoff key mapping or fallback
  let signKey = "mixed";
  if (love >= 9) signKey = "close";
  else if (love >= 6) signKey = "warm";
  else if (love >= 3) signKey = "mixed";
  else if (love > 0) signKey = "distant";
  else signKey = "resentful";

  paragraphs.push(signOffTemplates[signKey] || "—");
  paragraphs.push(childName);

  return paragraphs.join("\n\n");
}

// ===== LETTER FROM ADULT CHILD =====
  const letter = safeSection('letter', () => {
    return buildLongAdultChildLetter(gameState, rng);
  }, "Dear Parent,\n\nI'm writing to you from the future. I know it wasn't always easy, but I made it.\n\nI remember the good days and the hard ones. They both made me who I am.\n\nI'm doing okay now. I'm finding my own path.\n\nBest,\nYour Child");
  
  // ===== HOW THEY GREW =====
  const howTheyGrew = safeSection('howTheyGrew', () => {
    return `Intelligence: ${INT.toFixed(1)} • Empathy: ${EMP.toFixed(1)} • Discipline: ${DIS.toFixed(1)} • Confidence: ${CON.toFixed(1)}`;
  }, "They grew.");
  
  // ===== EXTRACT METADATA FOR LEGACY RUN =====
  // Determine relationship status from text
  let relationshipStatus = "Single";
  if (relationships.includes("marry") || relationships.includes("Married") || relationships.includes("marriage")) {
    relationshipStatus = "Married";
  } else if (relationships.includes("Long-term") || relationships.includes("partnership")) {
    relationshipStatus = "Long-term partner";
  }
  
  // Determine career tier
  let careerTier = "Stable";
  if (careerWealth.includes("brilliant") || careerWealth.includes("genius")) careerTier = "High";
  
  // Determine retirement tier
  let retirementTier = "Modest";
  if (retirementSavings < 2000) retirementTier = "Precarious";
  else if (retirementSavings < 8000) retirementTier = "BareBones";
  else if (retirementSavings < 20000) retirementTier = "Modest";
  else if (retirementSavings < 50000) retirementTier = "Comfortable";
  else retirementTier = "Secure";
  
  // Calculate retirement buffer
  let retirementBuffer = retirementSavings;
  
  // Extract number of children from family text
  const numChildrenMatch = family.match(/They have (\d+) kid/);
  const numChildren = numChildrenMatch ? parseInt(numChildrenMatch[1]) : 0;
  
  // ===== BUILD FINAL OUTCOME =====
  const outcome = {
    version: "v3",
    sections: {
      letter,
      careerWealth,
      relationships,
      family,
      visits,
      happiness,
      retirement,
      parentingStyle,
      epilogue,
      ptaEpilogue,
      howTheyGrew
    },
    patternLine: harmCount >= 2 
      ? "A pattern of distance shows up in the timeline." 
      : "The small moments accumulated.",
    childPatterns: childPatterns || [],
    childTraumaEvents: Array.isArray(gameState?.childTraumaEvents) ? gameState.childTraumaEvents : [],
    ctx: { 
      wealthTier,
      relationshipStatus,
      careerTier,
      retirementTier,
      retirementBuffer,
      numChildren
    }
  };
  
  return outcome;
}

export function generateOutcomeV3(gameState) {
  try {
    const outcome = generateOutcomeV4(gameState);
    
    // Add Zombie Apocalypse ending card if applicable
    if (gameState.specialStartId === "zombie_apocalypse" && !gameState.zombieGameOver) {
      const wifeState = gameState.zombieWifeState || "human";
      const training = gameState.zombieTraining || 0;
      const wifeLabels = {
        human: "still human (miracle)",
        zombie_kept: "locked in the basement (complicated)",
        missing: "missing (disappeared year 3)",
        dead: "deceased",
        cured: "cured with vaccine (year 16 reunion)"
      };
      
      const apocalypseSection = `\n\n=== 🧟 THE APOCALYPSE ENDS ===\n\nAfter 18 years, the vaccine rolls out globally. 99% of humans were eaten, but society reboots anyway.\n\nYour family:\n• Survivor Training: ${training}/100\n• Wife Status: ${wifeLabels[wifeState] || wifeState}\n• Child: Made it to 18 in the apocalypse\n\nNormal life gradually returns. The trauma doesn't leave, but hope is allowed again.`;
      
      if (!outcome.sections) outcome.sections = {};
      outcome.sections.zombieEnding = apocalypseSection;
    }
    
    return outcome;
  } catch (e) {
    console.error("[generateOutcomeV3] v4 failed, falling back to v3-noai", e);
    try { return generateOutcomeV3NoAI(gameState); } catch {}
    return null;
  }
}