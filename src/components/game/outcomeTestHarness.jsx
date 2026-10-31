import { generateOutcomeV3 } from '@/components/game/outcomesEngine';
import { generateOutcomeV3NoAI } from '@/components/game/outcomesEngineV3';

function mulberry32(a) {
  let t = a >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) {
    h ^= String(str).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const NAMES = [
  'Matt','Cynthia','Jordan','Alex','Taylor','Riley','Sam','Jamie','Casey','Morgan','Avery','Quinn','Noah','Emma','Liam','Mia','Zoe','Kai','Nova'
];

function clamp(n, min, max) {
  const x = Number.isFinite(n) ? n : min;
  return Math.min(max, Math.max(min, x));
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function randRange(rng, min, max, decimals = 0) {
  const v = rng() * (max - min) + min;
  const m = Math.pow(10, decimals);
  return Math.round(v * m) / m;
}

export function createOutcomeTestPayload(seedOrOptions = Date.now()) {
  // Resolve inputs up-front so they're always in scope, even if anything throws.
  const seed =
    (seedOrOptions && typeof seedOrOptions === 'object')
      ? (seedOrOptions.seed ?? Date.now())
      : seedOrOptions;

  const forcedEndingId =
    (seedOrOptions && typeof seedOrOptions === 'object')
      ? (seedOrOptions.forcedEndingId ?? null)
      : null;

  try {
    
    const rng = mulberry32(hash32(seed));

    // Pick mode bucket for variety
    const bucket = rng();
    const mode = bucket < 1/3 ? 'amazing' : bucket < 2/3 ? 'terrible' : 'wild';

    const bias = {
      amazing: {
        statBase: 13, statVar: 7,
        loveBase: 70, loveVar: 30,
        stressBase: 15, stressVar: 25,
        moneyBase: 20000, moneyVar: 60000,
        retirementBase: 5000, retirementVar: 30000,
        harmMax: 1
      },
      terrible: {
        statBase: 6, statVar: 6,
        loveBase: 30, loveVar: 30,
        stressBase: 70, stressVar: 30,
        moneyBase: -15000, moneyVar: 40000,
        retirementBase: 0, retirementVar: 8000,
        harmMax: 4
      },
      wild: {
        statBase: 10, statVar: 10,
        loveBase: 50, loveVar: 50,
        stressBase: 50, stressVar: 50,
        moneyBase: -20000, moneyVar: 80000,
        retirementBase: 0, retirementVar: 40000,
        harmMax: 4
      }
    }[mode];

    const mkStat = () => clamp(randRange(rng, bias.statBase - bias.statVar, bias.statBase + bias.statVar, 1), 0, 20);
    const intelligence = mkStat();
    const empathy = mkStat();
    const discipline = mkStat();
    const confidence = mkStat();

    const love = clamp(Math.round(randRange(rng, bias.loveBase - bias.loveVar, bias.loveBase + bias.loveVar)), 0, 100);
    const stress = clamp(Math.round(randRange(rng, bias.stressBase - bias.stressVar, bias.stressBase + bias.stressVar)), 0, 100);
    const money = Math.round(randRange(rng, bias.moneyBase - bias.moneyVar, bias.moneyBase + bias.moneyVar));
    const retirementSavings = Math.max(0, Math.round(randRange(rng, bias.retirementBase, bias.retirementBase + bias.retirementVar)));
    const harmCount = clamp(Math.floor(randRange(rng, 0, bias.harmMax + 1)), 0, 4);

    const gender = rng() < 0.5 ? 'girl' : 'boy';
    const childAvatarToneIndex = Math.floor(randRange(rng, 0, 6));
    const childName = pick(rng, NAMES);

    // Build fakeState based on forcedEndingId
    let fakeState = null;
    
    if (forcedEndingId) {
      // SPECIAL ENDINGS CATALOG
      const SPECIAL_ENDINGS = {
        // Main legendary/special/secret endings
        MARS_PIONEER: {
          flags: { __testMode: true, forceTopBadge: "🏆 Legendary: First Human on Mars" },
          stats: { intelligence: 55, empathy: 52, discipline: 45, confidence: 50 },
          love: 40, stress: 10, money: 30000, retirementSavings: 15000, harmCount: 0
        },
        HERO_PRESIDENT: {
          flags: { __testMode: true, forceTopBadge: "🗳️ Legendary: The President (Listener)" },
          stats: { intelligence: 50, empathy: 55, discipline: 40, confidence: 52 },
          love: 45, stress: 12, money: 40000, retirementSavings: 20000, harmCount: 0
        },
        ASTEROID_TYCOON: {
          flags: { __testMode: true, forceTopBadge: "☄️ Legendary: Asteroid Tycoon" },
          stats: { intelligence: 54, empathy: 28, discipline: 40, confidence: 35 },
          love: 30, stress: 15, money: 50000, retirementSavings: 25000, harmCount: 0
        },
        TIME_TRAVELER: {
          flags: { __testMode: true, forceTopBadge: "⏳ Legendary: Time Traveler" },
          stats: { intelligence: 65, empathy: 12, discipline: 10, confidence: 25 },
          love: 25, stress: 18, money: 20000, retirementSavings: 5000, harmCount: 0
        },
        SUPERVILLAIN_ARC: {
          flags: { __testMode: true, forceTopBadge: "🧨 Legendary: Supervillain Arc" },
          stats: { intelligence: 58, empathy: -10, discipline: 25, confidence: 35 },
          love: 12, stress: 30, money: 15000, retirementSavings: 3000, harmCount: 3
        },
        BLOCKCRAFT_2: {
          flags: { __testMode: true, forceTopBadge: "🧱 Special: Blockcraft 2" },
          stats: { intelligence: 52, empathy: 20, discipline: 30, confidence: 45 },
          love: 35, stress: 15, money: 100000, retirementSavings: 30000, harmCount: 0
        },
        CULT_LEADER: {
          flags: { __testMode: true, forceTopBadge: "🕯️ Special: Cult Leader" },
          stats: { intelligence: 35, empathy: 0, discipline: 30, confidence: 50 },
          love: 15, stress: 25, money: 40000, retirementSavings: 10000, harmCount: 1,
          faith: { tradition: 'Christianity', isCustom: false, status: 'committed', exposure: 95, devotion: 95, history: [] }
        },
        HUMAN_RESISTANCE: {
          flags: { __testMode: true, launchCodesSold: true },
          stats: { intelligence: 45, empathy: 18, discipline: 25, confidence: 30 },
          love: 30, stress: 20, money: 10000, retirementSavings: 8000, harmCount: 1
        },
        
        // Special Start endings
        WAR_ZONE_TRAGIC: {
          specialStartId: 'war_zone',
          stats: { intelligence: 8, empathy: 6, discipline: 12, confidence: 8 },
          love: 20, stress: 75, money: -5000, retirementSavings: 0, harmCount: 3
        },
        WAR_ZONE_HOPE: {
          specialStartId: 'war_zone',
          stats: { intelligence: 14, empathy: 18, discipline: 16, confidence: 14 },
          love: 50, stress: 35, money: 8000, retirementSavings: 2000, harmCount: 0
        },
        REFUGEE_TRAGIC: {
          specialStartId: 'refugee_camp',
          stats: { intelligence: 7, empathy: 5, discipline: 10, confidence: 6 },
          love: 18, stress: 80, money: -8000, retirementSavings: 0, harmCount: 4
        },
        REFUGEE_HOPE: {
          specialStartId: 'refugee_camp',
          stats: { intelligence: 15, empathy: 17, discipline: 15, confidence: 13 },
          love: 48, stress: 40, money: 10000, retirementSavings: 3000, harmCount: 1
        },
        PRK_001_DYNASTY: {
          specialStartId: 'kim_jong_un',
          stats: { intelligence: 12, empathy: 8, discipline: 18, confidence: 15 },
          love: 25, stress: 50, money: 500000, retirementSavings: 100000, harmCount: 2
        },
        PRK_002_OVERTHROWN: {
          specialStartId: 'kim_jong_un',
          stats: { intelligence: 15, empathy: 14, discipline: 12, confidence: 16 },
          love: 40, stress: 60, money: 20000, retirementSavings: 5000, harmCount: 1
        },
        PRK_003_UNIFIER: {
          specialStartId: 'kim_jong_un',
          stats: { intelligence: 16, empathy: 18, discipline: 14, confidence: 17 },
          love: 60, stress: 45, money: 50000, retirementSavings: 15000, harmCount: 0
        }
      };
      
      const config = SPECIAL_ENDINGS[forcedEndingId];
      if (config) {
        fakeState = {
        runSeed: `test_${seed}_${forcedEndingId}`,
        currentYear: 18,
        endAge: 18,
        childName,
        childAvatarGender: gender,
        childAvatarToneIndex,
        stats: config.stats,
        love: config.love,
        stress: config.stress,
        money: config.money,
        retirementSavings: config.retirementSavings,
        counters: { harmCount: config.harmCount },
        timelineEntries: [],
        familyPatterns: { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {} },
        partnerPatterns: { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {} },
        householdType: rng() < 0.5 ? 'single' : 'two',
        parentRole: rng() < 0.5 ? 'mom' : 'dad',
        warmthPoints: Math.round(randRange(rng, 0, 10)),
        structurePoints: Math.round(randRange(rng, 0, 10)),
        techniquesUnlocked: {},
        pta: { unlocked: false },
        passportStamps: [],
        bookshelf: [],
        memories: [],
        childTraumaEvents: [],
        actionPoints: 0,
        maxFocusTokens: 3,
        flags: config.flags || {},
        specialStartId: config.specialStartId || null,
        faith: config.faith || { tradition: null, isCustom: false, status: 'none', exposure: 0, devotion: 0, history: [] },

        // Add required data for legendary endings
        childProfile: config.flags?.forceTopBadge?.includes('Mars') ? { primaryInterest: 'SPACE' } : 
                      config.flags?.forceTopBadge?.includes('President') ? { primaryInterest: 'PEOPLE' } :
                      config.flags?.forceTopBadge?.includes('Asteroid') ? { primaryInterest: 'SPACE' } :
                      config.flags?.forceTopBadge?.includes('Blockcraft') ? { primaryInterest: 'BUILDING' } :
                      config.flags?.forceTopBadge?.includes('Supervillain') ? { primaryInterest: 'BUILDING' } :
                      config.flags?.forceTopBadge?.includes('Cult') ? { primaryInterest: 'PEOPLE' } :
                      { primaryInterest: 'SPACE' },
        education: config.flags?.forceTopBadge ? {
          scienceFair: { wonNational: true },
          studentLeadership: config.flags.forceTopBadge.includes('President') ? { wonClassPresident: true, wonWithListenFirst: true } : {}
        } : {},
        juvenileJustice: config.flags?.forceTopBadge?.includes('Supervillain') ? {
          hall: { ever: true, visits: 1 }
        } : {},
        mindBody: config.flags?.forceTopBadge ? {
          martialArts: {
            activeStyleId: 'taekwondo',
            beltIndexByStyle: { taekwondo: 8 }, // Black belt
            yearsTrainedByStyle: { taekwondo: 8 }
          }
        } : {}
        };
      }
    }
    
    if (!fakeState) {
      fakeState = {
      // Core identifiers
      runSeed: `test_${seed}`,
      currentYear: 18,
      endAge: 18,

      // Identity
      childName,
      childAvatarGender: gender,
      childAvatarToneIndex,

      // Stats
      stats: { intelligence, empathy, discipline, confidence },
      love,
      stress,
      money,
      retirementSavings,

      // Minimal shapes required by UI/engine
      counters: { harmCount },
      timelineEntries: [],
      familyPatterns: { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {} },
      partnerPatterns: { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {} },
      householdType: rng() < 0.5 ? 'single' : 'two',
      parentRole: rng() < 0.5 ? 'mom' : 'dad',
      warmthPoints: Math.round(randRange(rng, 0, 10)),
      structurePoints: Math.round(randRange(rng, 0, 10)),
      techniquesUnlocked: {},
      pta: { unlocked: false },
      passportStamps: [],
      bookshelf: [],
      memories: [],
      childTraumaEvents: [],

      // Extras referenced in some parts
      actionPoints: 0,
      maxFocusTokens: 3,
      };
    }

    let finalOutcome = null;
    try {
      finalOutcome = generateOutcomeV3(fakeState);
    } catch (err) {
      console.error("Outcome test mode failed:", err);
      const errText = (err && (err.stack || err.message)) ? String(err.stack || err.message) : "Unknown error";
      finalOutcome = {
        tags: ["ERROR_OUTCOME_TESTMODE"],
        sections: {
          letter: `Outcome generation threw an error in test mode.\n\n${errText}`,
          epilogue: "Fallback outcome rendered so we can see the error above."
        }
      };
    }

    if (!finalOutcome) {
      finalOutcome = {
        tags: ["ERROR_OUTCOME_TESTMODE"],
        sections: {
          letter: "Outcome generation returned null in test mode.",
          epilogue: "Fallback outcome rendered so we can see the error above."
        }
      };
    }

    const metrics = {
      mode,
      stats: { intelligence, empathy, discipline, confidence },
      love,
      stress,
      money,
      retirementSavings,
      harmCount,
    };

    return {
      seed,
      metrics,
      gameState: { ...fakeState, finalOutcome }
    };
  } catch (e) {
    // Absolute fallback: safe neutral payload (must never throw)
    const safeSeed = (seed ?? Date.now());

    const safe = {
      seed: safeSeed,
      metrics: {
        mode: 'safe',
        stats: { intelligence: 10, empathy: 10, discipline: 10, confidence: 10 },
        love: 50,
        stress: 50,
        money: 0,
        retirementSavings: 0,
        harmCount: 0,
      },
      gameState: {
        runSeed: `test_${safeSeed}`,
        currentYear: 18,
        endAge: 18,
        childName: 'Jordan',
        childAvatarGender: 'boy',
        childAvatarToneIndex: 0,
        stats: { intelligence: 10, empathy: 10, discipline: 10, confidence: 10 },
        love: 50,
        stress: 50,
        money: 0,
        retirementSavings: 0,
        counters: { harmCount: 0 },
        timelineEntries: [],
        familyPatterns: { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {} },
        partnerPatterns: { selectedIds: [], severityById: {}, resolvedById: {}, resolvedAtAgeById: {} },
        householdType: 'single',
        parentRole: 'mom',
        warmthPoints: 0,
        structurePoints: 0,
        techniquesUnlocked: {},
        pta: { unlocked: false },
        passportStamps: [],
        bookshelf: [],
        memories: [],
        childTraumaEvents: [],
        finalOutcome: null,
      }
    };
    try {
      safe.gameState.finalOutcome = generateOutcomeV3(safe.gameState);
    } catch (err) {
      console.error("Outcome test mode failed (safe fallback):", err);
      const errText = (err && (err.stack || err.message)) ? String(err.stack || err.message) : "Unknown error";
      safe.gameState.finalOutcome = {
        tags: ["ERROR_OUTCOME_TESTMODE"],
        sections: {
          letter: `Outcome generation threw an error in test mode (safe fallback).\n\n${errText}`,
          epilogue: "Fallback outcome rendered so we can see the error above."
        }
      };
    }

    if (!safe.gameState.finalOutcome) {
      safe.gameState.finalOutcome = {
        tags: ["ERROR_OUTCOME_TESTMODE"],
        sections: {
          letter: "Outcome generation returned null in test mode (safe fallback).",
          epilogue: "Fallback outcome rendered so we can see the error above."
        }
      };
    }
    return safe;
  }
}