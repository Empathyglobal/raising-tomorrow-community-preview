import { COUNTRY_INDEX } from '@/components/game/countriesData';
import { getLanguageForCountry, isFluentInLanguage } from '@/components/game/languageData';

// Military PCS helpers
function simpleHash(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str || '').length; i++) {
    h ^= String(str)[i].charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Basic seeded RNG using a linear congruential generator
// This implementation ensures deterministic results based on a given seed.
function createSeededRng(seed) {
  let s = simpleHash(seed); // Initialize seed using simpleHash
  // Constants for LCG (similar to glibc's rand() values)
  const a = 1103515245;
  const c = 12345;
  const m = 2**31; // Modulo (maximum value before wrapping)

  return {
    nextFloat: () => {
      s = (a * s + c) % m;
      return s / m; // Normalize to [0, 1)
    }
  };
}


const PCS_COUNTRIES = ["DEU", "JPN", "KOR", "ITA", "GBR", "ESP", "ARE", "AUS", "USA"];

function getCountryName(code) {
  const c = String(code || '').toUpperCase();
  return COUNTRY_INDEX[c]?.name || c;
}

function computeNextPcsDestination(gameState, age) {
  const current = String(gameState?.countryIso3 || 'USA').toUpperCase();
  const seed = `${gameState?.runSeed || 'seed'}|pcs|${age}|${current}`;
  let candidates = PCS_COUNTRIES.filter(c => c !== current);
  if (candidates.length === 0) candidates = PCS_COUNTRIES.slice();
  const n = simpleHash(seed) % candidates.length;
  return candidates[n];
}

// Yearly check-in prompts for scenario packs
// These appear after Age Up, before the yearly scenario, for enabled packs.
// Keep them light, optional, and age-appropriate.

export const PACK_YEARLY_CHECKINS = {
    ss_golden_cage_v1: {
    packId: "ss_golden_cage_v1",
    packName: "Golden Cage",
    emoji: "🥂",
    specialStartIds: ["golden_cage"],
    ageBands: [
      {
        id: "gc_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🥂 Curated Childhood",
        variants: [
          {
            title: "📸 The 'Casual' Family Shoot",
            body: "A lifestyle magazine wants a 'real' family photo. A lighting crew arrives like they're filming a superhero movie.",
            choices: [
              { id:"practice", label:"Agree, but keep your child off-camera", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.2, logLine:"📸 You set boundaries with a smile." },
              { id:"simple", label:"Do the shoot (one hour, hard stop)", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.3, logLine:"📸 You survived the ring light." },
              { id:"avoid", label:"Lean in—make it a brand moment", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.4, logLine:"📸 Your kid became 'content' for a day." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧾 Nanny Notes (CEO Edition)",
            body: "The nanny leaves a daily report. Your toddler now has KPIs.",
            choices: [
              { id:"practice", label:"Treat the nanny like a teammate (not a servant)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🧾 You built trust with the staff." },
              { id:"simple", label:"Say thanks and keep it light", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.05, logLine:"🧾 Everyone stayed polite." },
              { id:"avoid", label:"Micromanage everything", deltas:{ discipline:0.1, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.3, logLine:"🧾 Home felt like a board meeting." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "gc_school",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "📚 Prestige Pipeline",
        variants: [
          {
            title: "🎂 Birthday Party Arms Race",
            body: "Another parent rents a petting zoo… indoors. Your kid asks if you can do 'something normal.'",
            choices: [
              { id:"practice", label:"Plan something meaningful (not expensive)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.15, stressDelta:0.15, logLine:"🎂 You chose memories over flexing." },
              { id:"simple", label:"Match the vibe (just this once)", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.25, moneyDelta:-2000, logLine:"🎂 You bought peace with balloons." },
              { id:"avoid", label:"Go bigger than everyone", deltas:{ confidence:0.3, empathy:-0.2 }, loveDelta:0.05, stressDelta:0.35, moneyDelta:-7000, logLine:"🎂 The party was legendary. So was the pressure." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧠 The Tutor Schedule",
            body: "An advisor suggests tutoring, enrichment, and 'leadership coaching' for a second‑grader.",
            choices: [
              { id:"practice", label:"One focused activity + lots of free play", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🧠 You protected childhood." },
              { id:"simple", label:"Try a couple programs and see", deltas:{ intelligence:0.2 }, loveDelta:0.05, stressDelta:0.2, moneyDelta:-800, logLine:"🧠 You sampled the pipeline." },
              { id:"avoid", label:"Schedule everything", deltas:{ intelligence:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, moneyDelta:-1500, logLine:"🧠 Your calendar started parenting for you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "gc_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "📸 Image vs Identity",
        variants: [
          {
            title: "📱 'Do NOT Post That'",
            body: "Your teen posts a video that reveals way too much about your home life. The internet loves it. You do not.",
            choices: [
              { id:"practice", label:"Set rules + talk safety (no shaming)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.1, stressDelta:0.2, logLine:"📱 You taught boundaries without humiliation." },
              { id:"simple", label:"Ask them to take it down (politely)", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"📱 The video vanished. The awkwardness did not." },
              { id:"avoid", label:"Explode and confiscate everything", deltas:{ discipline:0.1, empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.4, logLine:"📱 Trust took damage." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎓 Legacy vs Passion",
            body: "They admit they don't want the prestige track. They want something that actually makes them happy.",
            choices: [
              { id:"practice", label:"Back their passion and help them plan", deltas:{ confidence:0.3, empathy:0.2 }, loveDelta:0.15, stressDelta:0.1, logLine:"🎓 You chose your kid over the résumé." },
              { id:"simple", label:"Compromise: passion + practical backup", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🎓 You built a bridge instead of a wall." },
              { id:"avoid", label:"Force the prestige track", deltas:{ discipline:0.2, empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.35, logLine:"🎓 They complied. Their joy didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_sugar_baby_v1: {
    packId: "ss_sugar_baby_v1",
    packName: "Sugar Baby",
    emoji: "📜",
    specialStartIds: ["sugar_baby"],
    ageBands: [
      {
        minAge: 1,
        maxAge: 1,
        title: "📜 The Will",
        body: "Your much older partner passes away unexpectedly. A lawyer contacts you: you've inherited $1,000,000.",
        choices: [
          {
            id: "continue",
            label: "Keep it together and keep going",
            moneyDelta: 1000000,
            stressDelta: 0.6,
            deltas: { discipline: 0.2, confidence: 0.2 },
            logLine: "📜 Your partner died. You inherited $1,000,000.",
            statePatch: (prev) => {
              const next = { ...prev };
              next.householdType = 'single';
              next.partnerCareer = null;

              if (next.relationships?.byId?.partner) {
                const updatedPartner = {
                  ...next.relationships.byId.partner,
                  isDeceased: true,
                  deathYear: 1,
                };
                next.relationships.byId.partner = updatedPartner;
                const partnerIndex = next.relationships.roster.findIndex(r => r.id === 'partner');
                if (partnerIndex > -1) {
                  next.relationships.roster[partnerIndex] = updatedPartner;
                }
              }
              
              if (next.partnerRelationship) {
                next.partnerRelationship.status = 'widowed';
              }
              
              return next;
            },
          },
        ],
      },
      {
        id: "sb_early_money",
        minAge: 2,
        maxAge: 4,
        chance: 0.7,
        title: "💸 New Money, New Problems",
        variants: [
          {
            title: "📰 A Tabloid Sniff",
            body: "A tabloid blogger 'recognizes' you. Suddenly your parenting choices feel like public policy.",
            choices: [
              { id:"privacy", label:"Lock down privacy (no pics, no interviews)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.2, logLine:"📰 You chose quiet over clout." },
              { id:"spin", label:"Do a tiny, controlled interview", deltas:{ confidence:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"📰 You turned gossip into a story." },
              { id:"ignore", label:"Ignore it (and hope it dies)", deltas:{ confidence:-0.1 }, loveDelta:0, stressDelta:0.1, logLine:"📰 You waited it out." }
            ]
          },
          {
            title: "👪 The 'Family' Email",
            body: "A 'long-lost cousin' appears with a friendly paragraph and a not‑friendly request.",
            choices: [
              { id:"help", label:"Help a little (with clear limits)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"👪 You were kind without being careless." },
              { id:"no", label:"Say no, firmly", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0, stressDelta:0.1, logLine:"👪 You protected your boundaries." },
              { id:"avoid", label:"Ghost them", deltas:{ confidence:-0.1 }, loveDelta:0, stressDelta:0.15, logLine:"👪 The problem didn't vanish—just simmered." }
            ]
          },
          {
            title: "📈 The Investment Pitch",
            body: "An 'advisor' promises to turn your money into *more* money. The vibe is either 'professional' or 'pyramid'—hard to tell.",
            choices: [
              { id:"fiduciary", label:"Hire a real fiduciary (boring, safe)", deltas:{ intelligence:0.2, discipline:0.2 }, loveDelta:0, stressDelta:0.1, moneyDelta:-10000, awardHonor:"🏅 Financially Literate", logLine:"📈 You paid for competence." },
              { id:"risk", label:"Take the flashy deal", deltas:{ confidence:0.2 }, loveDelta:0, stressDelta:0.2, moneyDelta:15000, logLine:"📈 Risk paid… this time." },
              { id:"cash", label:"Keep it simple (cash + savings)", deltas:{ discipline:0.1 }, loveDelta:0, stressDelta:0.05, logLine:"📈 You chose stability over thrill." }
            ]
          }
        ]
      },
      {
        id: "sb_school_years",
        minAge: 5,
        maxAge: 12,
        chance: 0.55,
        title: "🏫 'Rich Kid' Energy",
        variants: [
          {
            title: "🎒 Classmate Comments",
            body: "A kid says something mean about your child being 'rich.' Your child pretends not to care. They care.",
            choices: [
              { id:"coach", label:"Coach confidence + kindness (no shame, no flex)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🎒 You taught dignity." },
              { id:"teach", label:"Teach them to set boundaries (calm, direct)", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.1, logLine:"🎒 You taught a firm 'no.'" },
              { id:"buy", label:"Buy something expensive 'to prove a point'", deltas:{ confidence:0.1, empathy:-0.1 }, loveDelta:0, stressDelta:0.15, moneyDelta:-5000, logLine:"🎒 The point landed… weirdly." }
            ]
          },
          {
            title: "🍪 Fundraiser Season",
            body: "School fundraiser time. Other parents are stressed. You could end it instantly… or blend in.",
            choices: [
              { id:"donate", label:"Donate quietly (no spotlight)", deltas:{ empathy:0.2 }, loveDelta:0.05, stressDelta:0.1, moneyDelta:-3000, logLine:"🍪 You helped without turning it into a parade." },
              { id:"match", label:"Offer a matching donation challenge", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.15, moneyDelta:-5000, logLine:"🍪 You made it fun—and effective." },
              { id:"blend", label:"Blend in and let it run normally", deltas:{ discipline:0.1 }, loveDelta:0, stressDelta:0.05, logLine:"🍪 You stayed socially invisible." }
            ]
          }
        ]
      },
      {
        id: "sb_teen_identity",
        minAge: 13,
        maxAge: 18,
        chance: 0.6,
        title: "🧾 Inheritance Talk",
        variants: [
          {
            title: "🧠 'Is This Mine?'",
            body: "Your teen asks what the money means—and whether it defines them.",
            choices: [
              { id:"values", label:"Talk values: money is a tool, not a personality", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🧾 You taught identity beyond wealth." },
              { id:"rules", label:"Set strict rules + budgets", deltas:{ discipline:0.2 }, loveDelta:0, stressDelta:0.1, logLine:"🧾 You chose structure." },
              { id:"avoid", label:"Avoid the talk (awkward)", deltas:{ confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.15, logLine:"🧾 The question stayed unanswered." }
            ]
          },
          {
            title: "🎓 College Choices",
            body: "They could attend anything. They could also choose something meaningful and smaller. What do you emphasize?",
            choices: [
              { id:"fit", label:"Choose the best fit (not the most expensive)", deltas:{ intelligence:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.1, logLine:"🎓 Fit beat flex." },
              { id:"prestige", label:"Prestige first", deltas:{ confidence:0.2 }, loveDelta:0, stressDelta:0.15, moneyDelta:-20000, logLine:"🎓 Prestige came with pressure." },
              { id:"gap", label:"Support a gap year for maturity", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.1, logLine:"🎓 You chose growth over speed." }
            ]
          }
        ]
      }
    ],
  },
  ss_newcomer_reset_v1: {
    packId: "ss_newcomer_reset_v1",
    packName: "Newcomer Reset",
    emoji: "🧳",
    specialStartIds: ["newcomer_reset"],
    ageBands: [
      {
        id: "nr_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🧳 Starting Over",
        variants: [
          {
            title: "📄 Paperwork Mountain",
            body: "Forms, stamps, and deadlines. It feels like parenting has a side quest called 'Bureaucracy Boss Fight.'",
            choices: [
              { id:"practice", label:"Get community help (ask, don't suffer silently)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"📄 You found support instead of shame." },
              { id:"simple", label:"DIY it with checklists and caffeine", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"📄 You wrestled the forms yourself." },
              { id:"avoid", label:"Miss deadlines and scramble later", deltas:{ discipline:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.35, moneyDelta:-300, logLine:"📄 You paid the 'late fee tax'." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🗣️ Language at Home",
            body: "Your child is soaking up the new language fast. You worry the old one will fade.",
            choices: [
              { id:"practice", label:"Bilingual routines (songs, stories, silly labels)", deltas:{ intelligence:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🗣️ You made language feel like love." },
              { id:"simple", label:"Focus on the new language for stability", deltas:{ discipline:0.1, confidence:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"🗣️ You prioritized everyday survival." },
              { id:"avoid", label:"Ban the old language (it backfires)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.3, logLine:"🗣️ Home got quieter, not safer." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "nr_school",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 Belonging",
        variants: [
          {
            title: "🥪 Lunchbox Identity",
            body: "A classmate calls your kid's food 'weird.' Your child suddenly wants 'normal' lunches.",
            choices: [
              { id:"practice", label:"Celebrate both (pride + options)", deltas:{ confidence:0.2, empathy:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🥪 You taught pride without forcing it." },
              { id:"simple", label:"Blend in for now (and revisit later)", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"🥪 You chose peace this week." },
              { id:"avoid", label:"Tell them to toughen up", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.25, logLine:"🥪 They felt alone with it." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧑‍🏫 Parent-Teacher Translation",
            body: "A school meeting turns into a language puzzle. You get the gist… mostly.",
            choices: [
              { id:"practice", label:"Bring a translator / advocate", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.1, moneyDelta:-80, logLine:"🧑‍🏫 You showed up prepared." },
              { id:"simple", label:"Go alone and ask lots of questions", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"🧑‍🏫 You kept going anyway." },
              { id:"avoid", label:"Avoid meetings (bad idea)", deltas:{ discipline:-0.2 }, loveDelta:-0.05, stressDelta:0.3, logLine:"🧑‍🏫 Problems grew in the dark." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "nr_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🧭 Identity & Responsibility",
        variants: [
          {
            title: "🗣️ Translator Teen",
            body: "Your teen starts translating grown-up problems. They act tough, but it's heavy.",
            choices: [
              { id:"practice", label:"Protect them from adult burdens", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🗣️ You kept them a kid where you could." },
              { id:"simple", label:"Share the load carefully (with appreciation)", deltas:{ empathy:0.1, confidence:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"🗣️ You acknowledged the weight." },
              { id:"avoid", label:"Rely on them for everything", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.3, logLine:"🗣️ They started resenting responsibility." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📚 Residency / Citizenship Prep",
            body: "Tests, fees, and timelines. The future has homework now.",
            choices: [
              { id:"practice", label:"Study plan + steady paperwork", deltas:{ discipline:0.2, intelligence:0.1 }, loveDelta:0.05, stressDelta:0.1, moneyDelta:-200, logLine:"📚 You built momentum." },
              { id:"simple", label:"Take it step by step", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.15, moneyDelta:-120, logLine:"📚 You kept it manageable." },
              { id:"avoid", label:"Ignore it until it's urgent", deltas:{ discipline:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.3, moneyDelta:-350, logLine:"📚 Deadlines don't care about vibes." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_tradition_tug_of_war_v1: {
    packId: "ss_tradition_tug_of_war_v1",
    packName: "Tradition Tug‑of‑War",
    emoji: "🪢",
    specialStartIds: ["tradition_tug_of_war"],
    ageBands: [
      {
        id: "ttw_early",
        minAge: 1,
        maxAge: 6,
        chance: 0.9,
        title: "🪢 Early Boundaries",
        variants: [
          {
            title: "🍲 'In Our Family We Do It This Way'",
            body: "A relative insists your parenting choices should match tradition. They mean well. They also mean it loudly.",
            choices: [
              { id:"practice", label:"Hold your boundary kindly (firm + respectful)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🍲 You stayed calm and steady." },
              { id:"simple", label:"Compromise this time to keep peace", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"🍲 Peace was purchased with a little resentment." },
              { id:"avoid", label:"Pick a fight", deltas:{ discipline:0.1, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.3, logLine:"🍲 Everyone left mad and hungry." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎉 Ceremony vs Comfort",
            body: "A big family ceremony is expected. Your child gets overwhelmed easily.",
            choices: [
              { id:"practice", label:"Attend with accommodations (exit plan, breaks)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.15, logLine:"🎉 You honored tradition *and* your kid." },
              { id:"simple", label:"Attend and push through", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.25, logLine:"🎉 You got through it—barely." },
              { id:"avoid", label:"Refuse to go (burn bridges)", deltas:{ confidence:0.2, empathy:-0.1 }, loveDelta:0.05, stressDelta:0.25, logLine:"🎉 You protected your kid, but started a feud." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ttw_middle",
        minAge: 7,
        maxAge: 13,
        chance: 0.85,
        title: "🏫 Two Rulebooks",
        variants: [
          {
            title: "🧑‍🤝‍🧑 Friend Culture Clash",
            body: "Your child wants to join a friend activity that conflicts with family expectations.",
            choices: [
              { id:"practice", label:"Negotiate a yes with boundaries", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🧑‍🤝‍🧑 You found a workable middle ground." },
              { id:"simple", label:"Say no (and explain why)", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"🧑‍🤝‍🧑 You chose tradition and clarity." },
              { id:"avoid", label:"Say no with no explanation", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.25, logLine:"🧑‍🤝‍🧑 They stopped asking you first." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📚 School Event Pressure",
            body: "A school event celebrates individuality. A relative calls it 'nonsense.' Your child hears it.",
            choices: [
              { id:"practice", label:"Defend your child's identity publicly", deltas:{ confidence:0.2, empathy:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"📚 You made your kid feel safe." },
              { id:"simple", label:"Redirect gently and move on", deltas:{ discipline:0.1, empathy:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"📚 You avoided a scene." },
              { id:"avoid", label:"Agree with the relative to keep peace", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"📚 Your child felt judged at home." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ttw_teen",
        minAge: 14,
        maxAge: 18,
        chance: 0.85,
        title: "🧭 Teen Independence",
        variants: [
          {
            title: "💞 Dating Rules",
            body: "Your teen wants to date. The extended family has opinions from 1987.",
            choices: [
              { id:"practice", label:"Set safety rules without shame", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"💞 You built trust, not fear." },
              { id:"simple", label:"Allow it quietly (avoid family drama)", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"💞 You kept it low‑key." },
              { id:"avoid", label:"Ban it completely", deltas:{ discipline:0.1, empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.3, logLine:"💞 They learned to hide things." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎓 'I'm Not Living Your Life'",
            body: "They push back: they want freedom, and they want you to be on their side.",
            choices: [
              { id:"practice", label:"Support them and handle the backlash yourself", deltas:{ confidence:0.3, empathy:0.2 }, loveDelta:0.15, stressDelta:0.15, logLine:"🎓 You took the heat so they could grow." },
              { id:"simple", label:"Compromise: freedom with clear expectations", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🎓 You negotiated instead of commanded." },
              { id:"avoid", label:"Side with tradition over your teen", deltas:{ discipline:0.2, empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.25, logLine:"🎓 The relationship cooled." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_space_station_family_v1: {
    packId: "ss_space_station_family_v1",
    packName: "Space Station Childhood",
    emoji: "🛰️",
    specialStartIds: ["space_station_family"],
    ageBands: [
      {
        id: "ssf_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🛰️ Tiny Human in a Tiny Habitat",
        variants: [
          {
            title: "🫧 Zero‑G Zoomies",
            body: "Your toddler discovers that in low‑gravity, every hallway is a launchpad. Safety briefings become bedtime stories.",
            choices: [
              { id:"practice", label:"Make safety a game (rituals + routines)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.15, logLine:"🫧 You turned rules into play." },
              { id:"simple", label:"Add more supervision and hope", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"🫧 You shadowed a tiny comet." },
              { id:"avoid", label:"Over‑restrict everything", deltas:{ discipline:0.1, confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.25, logLine:"🫧 Cabin fever started early." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "♻️ The Recycling Talk (Again)",
            body: "On a station, 'waste' is just 'future air and water.' Your child asks why you're so obsessed with bins.",
            choices: [
              { id:"practice", label:"Teach stewardship with wonder", deltas:{ empathy:0.2, intelligence:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"♻️ You made responsibility feel meaningful." },
              { id:"simple", label:"Keep it practical and short", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.1, logLine:"♻️ You kept the lesson simple." },
              { id:"avoid", label:"Scold them for mistakes", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.2, logLine:"♻️ They got anxious about small errors." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ssf_school",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🛰️ Growing Up in Orbit",
        variants: [
          {
            title: "🚨 Drill Day",
            body: "The station runs an emergency drill. Your child takes it seriously… and then reenacts it for fun. Loudly.",
            choices: [
              { id:"practice", label:"Validate feelings + teach calm procedures", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🚨 You built confidence, not fear." },
              { id:"simple", label:"Keep it light so they're not scared", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"🚨 You softened the edges." },
              { id:"avoid", label:"Shut it down (no talking about it)", deltas:{ confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.2, logLine:"🚨 Anxiety found other outlets." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📡 Message Delay",
            body: "A call with Earth family glitches and lags. Your child feels the distance like a bruise.",
            choices: [
              { id:"practice", label:"Create a ritual: messages, letters, shared photos", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"📡 You made connection feel real." },
              { id:"simple", label:"Promise 'we'll call again soon'", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"📡 You kept hope alive." },
              { id:"avoid", label:"Minimize their feelings", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.2, logLine:"📡 They stopped bringing it up." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ssf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🛰️ Teen Years with No Privacy",
        variants: [
          {
            title: "🚪 'I Need a Door That Locks'",
            body: "Your teen wants privacy in a habitat designed for efficiency, not feelings. They're not wrong.",
            choices: [
              { id:"practice", label:"Rework space and rules (privacy is a need)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.15, stressDelta:0.15, moneyDelta:-120, logLine:"🚪 You made room for dignity." },
              { id:"simple", label:"Offer quiet hours + headphones", deltas:{ discipline:0.2 }, loveDelta:0.1, stressDelta:0.15, moneyDelta:-60, logLine:"🚪 You found a practical compromise." },
              { id:"avoid", label:"Tell them to 'deal with it'", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.1, stressDelta:0.25, logLine:"🚪 Resentment started collecting interest." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🌍 Earth Dreams",
            body: "They fantasize about Earth: forests, crowds, rain, and the radical luxury of being anonymous.",
            choices: [
              { id:"practice", label:"Validate the longing and plan future options", deltas:{ confidence:0.2, intelligence:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🌍 You turned dreaming into direction." },
              { id:"simple", label:"Encourage them to focus on the present", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.15, logLine:"🌍 You helped them cope day‑to‑day." },
              { id:"avoid", label:"Mock the dream", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.2, logLine:"🌍 They started dreaming alone." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_no_safety_net_v1: {
    packId: "ss_no_safety_net_v1",
    packName: "No Safety Net",
    emoji: "🧱",
    specialStartIds: ["no_safety_net"],
    ageBands: [
      {
        id: "nsn_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🧱 Year One of 'Figure It Out'",
        variants: [
          {
            title: "🧾 Bills vs Basics",
            body: "A bill hits at the exact moment you're buying essentials. The timing feels personal.",
            choices: [
              { id:"practice", label:"Call and negotiate (ask for plans/assistance)", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"🧾 You advocated for your household." },
              { id:"simple", label:"Cut spending hard this month", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"🧾 You tightened the belt." },
              { id:"avoid", label:"Ignore it and hope", deltas:{ discipline:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.3, moneyDelta:-120, logLine:"🧾 Late fees arrived like clockwork." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧷 Emergency: Something Breaks",
            body: "Shoes, phone, stroller—something breaks. It's always something.",
            choices: [
              { id:"practice", label:"Borrow/repair and make a plan", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.15, moneyDelta:-40, logLine:"🧷 You made it work." },
              { id:"simple", label:"Buy the cheapest replacement", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.2, moneyDelta:-90, logLine:"🧷 Cheap now, expensive later." },
              { id:"avoid", label:"Go without (it impacts routines)", deltas:{ confidence:-0.1, discipline:-0.1 }, loveDelta:-0.05, stressDelta:0.25, logLine:"🧷 The days got harder." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "nsn_school",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 Costs You Can't Avoid",
        variants: [
          {
            title: "🎒 School Stuff",
            body: "Field trip, supplies, a fee nobody warned you about. Your child is excited. Your wallet is not.",
            choices: [
              { id:"practice", label:"Talk to the school (waivers/help)", deltas:{ confidence:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.15, logLine:"🎒 You found a path without shame." },
              { id:"simple", label:"Pay it and absorb the hit", deltas:{ discipline:0.1 }, loveDelta:0.1, stressDelta:0.2, moneyDelta:-80, logLine:"🎒 You made it happen." },
              { id:"avoid", label:"Say no and avoid talking about it", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.25, logLine:"🎒 They felt left out and didn't know why." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🍽️ The 'Food Week'",
            body: "The pantry feels thin this week. You try to make it not obvious.",
            choices: [
              { id:"practice", label:"Use community resources early", deltas:{ discipline:0.1, empathy:0.2 }, loveDelta:0.05, stressDelta:0.15, logLine:"🍽️ You chose support before crisis." },
              { id:"simple", label:"Stretch meals and move on", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"🍽️ You got creative with noodles." },
              { id:"avoid", label:"Skip meals yourself to cover it", deltas:{ empathy:0.1, confidence:-0.1 }, loveDelta:0.05, stressDelta:0.3, logLine:"🍽️ You carried it quietly." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "nsn_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🧭 Teen Needs & Pride",
        variants: [
          {
            title: "👟 'I Need What Everyone Has'",
            body: "Your teen asks for something that feels socially mandatory. They're not being dramatic. They're being thirteen.",
            choices: [
              { id:"practice", label:"Be honest + co-plan (budget + alternatives)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"👟 You taught money without shame." },
              { id:"simple", label:"Save up and buy it later", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"👟 You kicked the can—carefully." },
              { id:"avoid", label:"Shut it down harshly", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.25, logLine:"👟 They stopped sharing needs." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "💼 First Job Conversation",
            body: "They consider working. You want to protect their childhood, but also… rent exists.",
            choices: [
              { id:"practice", label:"Help them find a balanced job", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"💼 You supported independence safely." },
              { id:"simple", label:"Let them decide and you'll support", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.15, logLine:"💼 You gave them agency." },
              { id:"avoid", label:"Push them into working immediately", deltas:{ discipline:0.1, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.25, logLine:"💼 It felt like pressure, not growth." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_child_autism_v1: {
    packId: "ss_child_autism_v1",
    packName: "Autistic Child",
    emoji: "🧩",
    specialStartIds: ["child_autism"],
    ageBands: [
      {
        id: "autism_early",
        minAge: 2,
        maxAge: 3,
        chance: 0.85,
        title: "🧩 Early Years",
        variants: [
          {
            title: "🧩 Sensory Days",
            body: "Some sounds, textures, and changes hit harder. How do you shape home routines?",
            choices: [
              { id: "practice", label: "Build a predictable routine + a calm-down plan", deltas: { discipline: 0.4, confidence: 0.2, empathy: 0.2 }, loveDelta: 0.4, stressDelta: 0.2, logLine: "🧩 You built supportive routines." },
              { id: "simple", label: "Follow their lead day-to-day", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1, logLine: null },
              { id: "avoid", label: "Push through without changing anything", deltas: { discipline: 0.2, confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.4, logLine: null }
            ]
          },
          {
            title: "🎧 Sensory Toolkit",
            body: "Noise-canceling headphones, weighted blankets, and visual schedules—small tools can make a big difference.",
            choices: [
              { id: "toolkit", label: "Build a sensory toolkit (headphones, fidgets, safe spaces)", deltas: { confidence: 0.3, discipline: 0.2 }, loveDelta: 0.3, stressDelta: 0.1, logLine: "🎧 You gave them tools for self-regulation." },
              { id: "observe", label: "Watch what helps and adjust slowly", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🎧 You followed their cues." },
              { id: "skip", label: "Assume they'll adapt naturally", deltas: { confidence: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🎧 Struggles went unsupported." }
            ]
          },
          {
            title: "🗓️ Transition Warnings",
            body: "Surprises are hard. Transitions need preparation. A five-minute warning can change everything.",
            choices: [
              { id: "warn", label: "Give transition warnings + visual timers", deltas: { discipline: 0.3, confidence: 0.2 }, loveDelta: 0.3, stressDelta: 0.1, logLine: "🗓️ You made change predictable." },
              { id: "flexible", label: "Stay flexible and slow down when needed", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🗓️ You prioritized calm over speed." },
              { id: "force", label: "Expect instant transitions", deltas: { discipline: 0.1, confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.4, logLine: "🗓️ Meltdowns increased." }
            ]
          }
        ]
      },
      {
        id: "autism_school",
        minAge: 5,
        maxAge: 7,
        chance: 0.9,
        title: "🎒 School Years",
        variants: [
          {
            title: "🎒 School Supports",
            body: "School is here. The environment and expectations can be a lot. What's your approach?",
            choices: [
              { id: "practice", label: "Meet early with teachers and set supports", deltas: { intelligence: 0.4, confidence: 0.2, discipline: 0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: null },
              { id: "simple", label: "Ask for informal flexibility", deltas: { intelligence: 0.2, confidence: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: null },
              { id: "avoid", label: "Assume they'll adapt without support", deltas: { intelligence: -0.2, confidence: -0.2 }, loveDelta: 0, stressDelta: 0.3, logLine: null }
            ]
          },
          {
            title: "📋 The IEP Meeting",
            body: "An IEP meeting is scheduled. You're learning the language of accommodations, goals, and advocacy.",
            choices: [
              { id: "prepare", label: "Research, prepare, and bring notes (calm advocacy)", deltas: { intelligence: 0.4, confidence: 0.2, discipline: 0.1 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "📋 You advocated with clarity." },
              { id: "trust", label: "Trust the team and stay collaborative", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "📋 You built partnership with the school." },
              { id: "fight", label: "Go in defensive and fight every point", deltas: { confidence: 0.1, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "📋 The meeting felt like a battle." }
            ]
          },
          {
            title: "🔇 Sensory Overload Day",
            body: "A fire drill, a substitute teacher, and a schedule change—all in one day. They come home completely dysregulated.",
            choices: [
              { id: "recover", label: "Create recovery time (dim lights, quiet, safe space)", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.3, stressDelta: 0.1, logLine: "🔇 You gave them space to reset." },
              { id: "routine", label: "Return to routine quickly (predictability helps)", deltas: { discipline: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🔇 Structure helped them recover." },
              { id: "ignore", label: "Expect them to 'bounce back' on their own", deltas: { confidence: -0.3, empathy: -0.1 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🔇 Recovery took much longer." }
            ]
          }
        ]
      },
      {
        id: "autism_tween",
        minAge: 10,
        maxAge: 12,
        chance: 0.85,
        title: "🤝 Social World",
        variants: [
          {
            title: "🤝 Friendship, Interests",
            body: "They connect best around shared interests. Social rules can feel confusing.",
            choices: [
              { id: "practice", label: "Find an interest-based club/community", deltas: { confidence: 0.4, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: null },
              { id: "simple", label: "Coach one small social skill at a time", deltas: { discipline: 0.2, confidence: 0.2 }, loveDelta: 0, stressDelta: 0.1, logLine: null },
              { id: "avoid", label: "Tell them to 'just fit in'", deltas: { confidence: -0.4, empathy: -0.2 }, loveDelta: 0, stressDelta: 0.4, logLine: null }
            ]
          },
          {
            title: "🎭 Masking Discussion",
            body: "You notice they act differently at school than at home. They're learning to mask—and it's exhausting.",
            choices: [
              { id: "safe", label: "Make home a safe space to unmask + rest", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.3, stressDelta: -0.1, logLine: "🎭 You protected authenticity at home." },
              { id: "skills", label: "Teach selective masking as a social skill (not a requirement)", deltas: { intelligence: 0.3, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🎭 You taught choice, not performance." },
              { id: "force", label: "Expect them to act 'normal' everywhere", deltas: { confidence: -0.3, empathy: -0.3 }, loveDelta: -0.2, stressDelta: 0.4, logLine: "🎭 Exhaustion became the norm." }
            ]
          },
          {
            title: "👥 Finding 'Their People'",
            body: "They mention feeling different from classmates. You wonder if neurodivergent-affirming spaces would help.",
            choices: [
              { id: "seek", label: "Seek out ND-friendly communities (online or local)", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "👥 They found belonging." },
              { id: "interest", label: "Focus on interest-based connection (any community)", deltas: { confidence: 0.2, empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "👥 Shared interest built bridges." },
              { id: "dismiss", label: "Dismiss it ('everyone feels different sometimes')", deltas: { confidence: -0.2, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "👥 They felt unseen." }
            ]
          }
        ]
      },
      {
        id: "autism_teen",
        minAge: 15,
        maxAge: 18,
        chance: 0.9,
        title: "🗣️ Advocacy & Identity",
        variants: [
          {
            title: "🗣️ Self-Advocacy",
            body: "They're old enough to define their needs and boundaries. How do you handle support now?",
            choices: [
              { id: "practice", label: "Let them lead accommodations & boundaries", deltas: { confidence: 0.4, discipline: 0.2 }, loveDelta: 0.2, stressDelta: -0.1, logLine: null },
              { id: "simple", label: "You advocate, but include them", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0, stressDelta: 0.1, logLine: null },
              { id: "avoid", label: "Dismiss needs as drama", deltas: { confidence: -0.3, discipline: -0.2 }, loveDelta: -0.2, stressDelta: 0.3, logLine: null }
            ]
          },
          {
            title: "🧠 Burnout Prevention",
            body: "Academic pressure, sensory demands, and social performance add up. They need rest and realistic expectations.",
            choices: [
              { id: "protect", label: "Trim commitments and protect rest days", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.2, stressDelta: -0.1, logLine: "🧠 You chose sustainability over performance." },
              { id: "balance", label: "Teach workload management + self-monitoring", deltas: { discipline: 0.3, intelligence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🧠 You gave them tools to pace themselves." },
              { id: "push", label: "Expect them to keep up with peers", deltas: { discipline: 0.2, confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.4, logLine: "🧠 Burnout arrived quietly." }
            ]
          },
          {
            title: "🎓 Transition Planning",
            body: "College, work, or something else—transition planning for autistic teens needs to be concrete, realistic, and early.",
            choices: [
              { id: "plan", label: "Start early: visit campuses, discuss accommodations, build skills", deltas: { confidence: 0.3, intelligence: 0.2, discipline: 0.1 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🎓 You planned for real-world readiness." },
              { id: "explore", label: "Explore options without pressure", deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🎓 You kept doors open." },
              { id: "avoid", label: "Avoid planning ('we'll figure it out later')", deltas: { confidence: -0.2, discipline: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🎓 The future stayed blurry." }
            ]
          }
        ]
      }
    ]
  },
  ss_child_down_syndrome_v1: {
    packId: "ss_child_down_syndrome_v1",
    packName: "Down Syndrome",
    emoji: "❤️",
    specialStartIds: ["child_down_syndrome"],
    ageBands: [
      {
        id: "ds_early",
        minAge: 0,
        maxAge: 2,
        chance: 0.9,
        title: "🍼 Early Years",
        variants: [
          {
            title: "🍼 Early Supports",
            body: "You're learning what your child needs—and what support looks like.",
            choices: [
              { id: "practice", label: "Build a support team and routines early", deltas: { confidence: 0.2, empathy: 0.2, intelligence: 0.2 }, loveDelta: 0.3, stressDelta: 0.2 },
              { id: "simple", label: "Take it month-by-month, stay steady", deltas: { empathy: 0.2, confidence: 0.1 }, loveDelta: 0.3, stressDelta: 0 },
              { id: "avoid", label: "Delay supports out of overwhelm", deltas: { confidence: -0.2, discipline: -0.1 }, loveDelta: 0, stressDelta: 0.3 }
            ]
          },
          {
            title: "🏥 Early Intervention",
            body: "Therapists recommend early intervention: speech, PT, OT. It's a lot of appointments—but it can make a difference.",
            choices: [
              { id: "commit", label: "Commit to the schedule (therapy becomes routine)", deltas: { intelligence: 0.3, discipline: 0.2, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.3, logLine: "🏥 You invested in early skills." },
              { id: "selective", label: "Pick one or two key therapies", deltas: { intelligence: 0.2, empathy: 0.1 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🏥 You chose sustainability over completeness." },
              { id: "delay", label: "Wait and see if they catch up naturally", deltas: { confidence: -0.2, intelligence: -0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "🏥 Windows of opportunity closed." }
            ]
          },
          {
            title: "💬 Milestone Comparisons",
            body: "Other parents talk about milestones constantly. Your child is on their own timeline—and that's okay, but it doesn't always feel okay.",
            choices: [
              { id: "celebrate", label: "Celebrate your child's progress without comparison", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.3, stressDelta: 0.1, logLine: "💬 You built pride in their own path." },
              { id: "community", label: "Find a parent community with shared experience", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "💬 You found people who understood." },
              { id: "isolate", label: "Avoid other parents to reduce comparison pain", deltas: { confidence: -0.2, empathy: -0.1 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "💬 Isolation grew quietly." }
            ]
          }
        ]
      },
      {
        id: "ds_school",
        minAge: 5,
        maxAge: 7,
        chance: 0.9,
        title: "🎒 School Inclusion",
        variants: [
          {
            title: "🎒 Inclusion & Learning",
            body: "School brings new expectations. Inclusion and supports matter.",
            choices: [
              { id: "practice", label: "Advocate for inclusion + real supports", deltas: { intelligence: 0.3, confidence: 0.2, empathy: 0.2 }, stressDelta: 0.2 },
              { id: "simple", label: "Let school lead, check in often", deltas: { confidence: 0.1, empathy: 0.1 }, stressDelta: 0.1 },
              { id: "avoid", label: "Lower expectations and stop pushing", deltas: { intelligence: -0.3, confidence: -0.2 }, stressDelta: 0.2 }
            ]
          },
          {
            title: "🤝 Friendship & Acceptance",
            body: "Friendships form differently—some kids are kind, some are cruel, and your child notices both.",
            choices: [
              { id: "support", label: "Coach friendship skills + celebrate kind peers", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🤝 You built social confidence gently." },
              { id: "protect", label: "Stay close and intervene when needed", deltas: { empathy: 0.2, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🤝 You shielded them from cruelty." },
              { id: "ignore", label: "Assume they'll toughen up on their own", deltas: { confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🤝 Loneliness settled in." }
            ]
          },
          {
            title: "📚 Learning Pace",
            body: "Academic progress is slower. The school wants to adjust goals—you want to balance realism with hope.",
            choices: [
              { id: "individualize", label: "Set individualized, meaningful goals", deltas: { intelligence: 0.3, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "📚 You focused on progress, not comparison." },
              { id: "adaptive", label: "Use adaptive learning tools and celebrate small wins", deltas: { intelligence: 0.2, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "📚 You made learning feel safe." },
              { id: "pressure", label: "Push for grade-level work regardless", deltas: { intelligence: 0.1, confidence: -0.3, empathy: -0.1 }, loveDelta: -0.1, stressDelta: 0.4, logLine: "📚 Pressure replaced progress." }
            ]
          }
        ]
      },
      {
        id: "ds_tween",
        minAge: 12,
        maxAge: 14,
        chance: 0.85,
        title: "🧰 Independence",
        variants: [
          {
            title: "🧰 Independence Skills",
            body: "They want more agency. Small skills add up.",
            choices: [
              { id: "practice", label: "Teach life skills step-by-step", deltas: { discipline: 0.4, confidence: 0.2 }, loveDelta: 0.1 },
              { id: "simple", label: "Focus on strengths, lighten demands", deltas: { confidence: 0.2, empathy: 0.1 } },
              { id: "avoid", label: "Do everything for them", deltas: { discipline: -0.3, confidence: -0.2 }, stressDelta: 0.2 }
            ]
          },
          {
            title: "🏪 Community Access",
            body: "Grocery trips, library visits, bus rides—community navigation builds confidence and requires support.",
            choices: [
              { id: "teach", label: "Teach routes, scripts, and safety skills step-by-step", deltas: { confidence: 0.3, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🏪 You built real-world competence." },
              { id: "accompany", label: "Accompany them and coach in the moment", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🏪 You stayed close and supportive." },
              { id: "isolate", label: "Keep them home to avoid risks", deltas: { confidence: -0.3, discipline: -0.1 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "🏪 Their world stayed small." }
            ]
          },
          {
            title: "🗣️ Self-Advocacy Starts",
            body: "They're learning to speak up for what they need. You can coach that—or talk over them.",
            choices: [
              { id: "empower", label: "Let them speak first, support second", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🗣️ You empowered their voice." },
              { id: "coach", label: "Teach scripts and practice together", deltas: { discipline: 0.2, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🗣️ You built communication tools." },
              { id: "takeover", label: "Speak for them to make it easier", deltas: { confidence: -0.2, discipline: -0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🗣️ Their voice stayed quiet." }
            ]
          }
        ]
      },
      {
        id: "ds_teen",
        minAge: 16,
        maxAge: 18,
        chance: 0.9,
        title: "🗺️ Adulthood Planning",
        variants: [
          {
            title: "🗺️ Transition Planning",
            body: "Adulthood is close. Work, community, and support planning can be empowering.",
            choices: [
              { id: "practice", label: "Make a plan (work/community/services)", deltas: { confidence: 0.3, discipline: 0.2, intelligence: 0.2 }, stressDelta: 0.2 },
              { id: "simple", label: "Small steps, keep options open", deltas: { confidence: 0.2 } },
              { id: "avoid", label: "Avoid planning", deltas: { confidence: -0.2, discipline: -0.2 }, stressDelta: 0.3 }
            ]
          },
          {
            title: "💼 Job Skills & Volunteering",
            body: "Work experience, volunteering, or internships—meaningful participation builds identity and skills.",
            choices: [
              { id: "supported", label: "Find supported work or volunteer opportunities", deltas: { confidence: 0.3, discipline: 0.2, empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "💼 They gained skills and purpose." },
              { id: "family", label: "Start with family tasks and build from there", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "💼 You built confidence at home first." },
              { id: "skip", label: "Focus only on school (work can wait)", deltas: { intelligence: 0.1, confidence: -0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "💼 Opportunities stayed theoretical." }
            ]
          },
          {
            title: "🏡 Living Arrangements",
            body: "Supported living, group homes, staying with family—there's no single right answer, but planning matters.",
            choices: [
              { id: "explore", label: "Explore options together (visit, ask questions, include them)", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🏡 You planned with respect and realism." },
              { id: "home", label: "Assume they'll stay home (no exploration yet)", deltas: { empathy: 0.2, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🏡 You chose the familiar path." },
              { id: "avoid", label: "Avoid the conversation (too painful)", deltas: { confidence: -0.2, discipline: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🏡 The future stayed unspoken." }
            ]
          }
        ]
      }
    ]
  },

  ss_child_dyslexia_v1: {
    packId: "ss_child_dyslexia_v1",
    packName: "Dyslexia",
    emoji: "📚",
    specialStartIds: ["child_dyslexia"],
    ageBands: [
      {
        id: "dys_early",
        minAge: 6,
        maxAge: 7,
        chance: 0.9,
        title: "📖 Reading Friction",
        variants: [
          {
            title: "📖 Reading Friction",
            body: "Letters jump. Reading takes more effort. How do you respond?",
            choices: [
              { id: "practice", label: "Get assessment + structured reading support", deltas: { intelligence: 0.3, confidence: 0.2 }, awardHonor: "🏅 Audiobook Ally", stressDelta: 0.2 },
              { id: "simple", label: "More reading time, more patience", deltas: { empathy: 0.2, intelligence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1 },
              { id: "avoid", label: "Punish low grades", deltas: { discipline: 0.2, confidence: -0.4, empathy: -0.2 }, stressDelta: 0.3 }
            ]
          },
          {
            title: "🎧 Audiobook Discovery",
            body: "You introduce audiobooks. Suddenly stories click—they're smart, they just needed a different door in.",
            choices: [
              { id: "embrace", label: "Normalize audiobooks as reading (no shame)", deltas: { intelligence: 0.3, confidence: 0.3 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🎧 You made reading accessible and proud." },
              { id: "supplement", label: "Use them as a supplement (still practice print)", deltas: { intelligence: 0.2, discipline: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🎧 You built dual pathways." },
              { id: "resist", label: "Insist on 'real reading' only", deltas: { confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🎧 Books became punishment." }
            ]
          }
        ]
      },
      {
        id: "dys_mid",
        minAge: 9,
        maxAge: 10,
        chance: 0.85,
        title: "🧠 Self-Esteem",
        variants: [
          {
            title: "🧠 Self-Esteem",
            body: "They're comparing themselves to peers. Confidence is the fragile part.",
            choices: [
              { id: "practice", label: "Teach self-advocacy + celebrate progress", deltas: { confidence: 0.4, discipline: 0.1, empathy: 0.1 }, awardHonor: "🏅 Patient Reading Coach" },
              { id: "simple", label: "Keep it private, keep it calm", deltas: { confidence: 0.1 }, stressDelta: 0.1 },
              { id: "avoid", label: "Call them lazy", deltas: { confidence: -0.5, empathy: -0.2 }, loveDelta: -0.2 }
            ]
          },
          {
            title: "🏫 Teacher Pushback",
            body: "A teacher says accommodations 'aren't fair to other students.' You're deciding whether to fight, educate, or escalate.",
            choices: [
              { id: "educate", label: "Calmly educate the teacher (equity vs equality)", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🏫 You advocated with clarity." },
              { id: "escalate", label: "Escalate to admin (get formal support)", deltas: { confidence: 0.3, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.3, logLine: "🏫 You fought for access." },
              { id: "retreat", label: "Pull back to avoid conflict", deltas: { confidence: -0.3, empathy: -0.1 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "🏫 Your child lost support quietly." }
            ]
          }
        ]
      },
      {
        id: "dys_tween",
        minAge: 13,
        maxAge: 14,
        chance: 0.85,
        title: "⏱️ Accommodations",
        variants: [
          {
            title: "⏱️ Accommodations",
            body: "School demands ramp up. Tools and accommodations can change everything.",
            choices: [
              { id: "practice", label: "Formal accommodations + audiobooks", deltas: { confidence: 0.3, intelligence: 0.2 } },
              { id: "simple", label: "Build routines + assistive tools", deltas: { discipline: 0.2, intelligence: 0.1, confidence: 0.1 } },
              { id: "avoid", label: "No accommodations", deltas: { confidence: -0.2, intelligence: -0.2 } }
            ]
          },
          {
            title: "💪 Strengths-Based Learning",
            body: "A mentor or teacher points out what they're *good* at—verbal skills, creativity, problem-solving—and suggests leaning into those.",
            choices: [
              { id: "lean", label: "Shift focus to strengths (projects over tests)", deltas: { confidence: 0.4, intelligence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "💪 You built competence from strengths." },
              { id: "balance", label: "Balance strengths and reading support", deltas: { intelligence: 0.2, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "💪 You honored both sides." },
              { id: "focus", label: "Still focus mainly on 'fixing' reading", deltas: { discipline: 0.2, confidence: -0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "💪 Deficit thinking stayed central." }
            ]
          }
        ]
      },
      {
        id: "dys_teen",
        minAge: 16,
        maxAge: 18,
        chance: 0.9,
        title: "🧭 Strengths & Path",
        variants: [
          {
            title: "🧭 Strengths & Path",
            body: "They're choosing what comes next. A good-fit path matters more than a perfect path.",
            choices: [
              { id: "practice", label: "Lean into strengths", deltas: { confidence: 0.3, intelligence: 0.2 } },
              { id: "simple", label: "Try something and adjust", deltas: { confidence: 0.1 } },
              { id: "avoid", label: "Limit options out of fear", deltas: { confidence: -0.2, intelligence: -0.1 } }
            ]
          },
          {
            title: "🛠️ Adult Tooling",
            body: "Text-to-speech, speech-to-text, assistive tech—they're building an adult toolkit. You can normalize it or shame it.",
            choices: [
              { id: "normalize", label: "Normalize tools as professional accommodations", deltas: { confidence: 0.3, intelligence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🛠️ You made accommodations feel powerful, not weak." },
              { id: "encourage", label: "Encourage use but keep it private", deltas: { intelligence: 0.2, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🛠️ Tools helped—but quietly." },
              { id: "shame", label: "Suggest they 'push through' without tools", deltas: { confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🛠️ Shame replaced support." }
            ]
          }
        ]
      }
    ]
  },
  ss_child_deaf_hoh_v1: {
    packId: "ss_child_deaf_hoh_v1",
    packName: "Deaf / Hard of Hearing",
    emoji: "🤟",
    specialStartIds: ["child_deaf_hoh"],
    ageBands: [
      {
        id: "deaf_early",
        minAge: 0,
        maxAge: 2,
        chance: 0.9,
        title: "👂 Communication Access",
        variants: [
          {
            title: "👂 Communication Access",
            body: "You realize access comes first: language, routines, and connection.",
            choices: [
              { id: "practice", label: "Prioritize language access early", deltas: { intelligence: 0.2, confidence: 0.2 }, awardHonor: "🏅 Communication Bridge", loveDelta: 0.2, stressDelta: 0.2 },
              { id: "simple", label: "Learn basics and build gradually", deltas: { empathy: 0.2, confidence: 0.1 }, stressDelta: 0.1 },
              { id: "avoid", label: "Wait and hope it resolves", deltas: { intelligence: -0.2, confidence: -0.2 }, stressDelta: 0.2 }
            ]
          },
          {
            title: "🤟 Sign Language Choice",
            body: "You're deciding whether to commit to sign language. It's a full language—and a full commitment.",
            choices: [
              { id: "commit", label: "Commit to sign language as primary communication", deltas: { intelligence: 0.3, empathy: 0.2 }, loveDelta: 0.3, stressDelta: 0.2, logLine: "🤟 You built full language access." },
              { id: "both", label: "Combine sign + speech (bilingual approach)", deltas: { intelligence: 0.2, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🤟 You built multiple pathways." },
              { id: "speech", label: "Focus only on speech therapy", deltas: { discipline: 0.2, confidence: -0.1 }, loveDelta: 0, stressDelta: 0.3, logLine: "🤟 Communication stayed limited." }
            ]
          }
        ]
      },
      {
        id: "deaf_school",
        minAge: 4,
        maxAge: 6,
        chance: 0.9,
        title: "🎒 School Setup",
        variants: [
          {
            title: "🎒 School Setup",
            body: "School is loud, fast, and verbal. Access tools help your child keep up.",
            choices: [
              { id: "practice", label: "Ensure interpreters/captions/support plan", deltas: { intelligence: 0.3, confidence: 0.2, discipline: 0.1 }, awardHonor: "🏅 Accessibility Builder", stressDelta: 0.2 },
              { id: "simple", label: "One key accommodation", deltas: { intelligence: 0.1, confidence: 0.1 }, stressDelta: 0.1 },
              { id: "avoid", label: "No accommodations", deltas: { confidence: -0.3, intelligence: -0.2 }, stressDelta: 0.3 }
            ]
          },
          {
            title: "🗣️ Interpreter Access",
            body: "An interpreter makes everything smoother—but schools sometimes claim 'budget constraints.' You're deciding whether to accept that or push back.",
            choices: [
              { id: "push", label: "Push for full interpreter access (it's a legal right)", deltas: { confidence: 0.3, intelligence: 0.2 }, loveDelta: 0.1, stressDelta: 0.3, logLine: "🗣️ You fought for access and won." },
              { id: "partial", label: "Accept partial access and supplement at home", deltas: { empathy: 0.2, intelligence: 0.1 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🗣️ You filled the gaps yourself." },
              { id: "accept", label: "Accept minimal support to avoid conflict", deltas: { confidence: -0.2, intelligence: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "🗣️ Your child fell behind quietly." }
            ]
          }
        ]
      },
      {
        id: "deaf_tween",
        minAge: 8,
        maxAge: 10,
        chance: 0.85,
        title: "🤝 Belonging",
        variants: [
          {
            title: "🤝 Belonging",
            body: "Friendships get easier when communication is accessible and shared.",
            choices: [
              { id: "practice", label: "Seek Deaf/HoH community", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.1 },
              { id: "simple", label: "Support one close friendship", deltas: { confidence: 0.1, empathy: 0.1 } },
              { id: "avoid", label: "Let isolation grow", deltas: { confidence: -0.3, empathy: -0.1 }, stressDelta: 0.2 }
            ]
          },
          {
            title: "👥 Deaf Community Connection",
            body: "A Deaf event or community group is nearby. You're deciding whether your child should connect with Deaf culture—or stay in the hearing world only.",
            choices: [
              { id: "connect", label: "Connect with Deaf community (culture + identity)", deltas: { confidence: 0.3, empathy: 0.3 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "👥 They found their people." },
              { id: "explore", label: "Visit once and let them decide", deltas: { confidence: 0.2, empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "👥 You gave them options." },
              { id: "dismiss", label: "Focus only on hearing-world integration", deltas: { confidence: -0.2, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "👥 A whole world stayed closed." }
            ]
          }
        ]
      },
      {
        id: "deaf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.9,
        title: "🗣️ Identity & Independence",
        variants: [
          {
            title: "🗣️ Identity & Independence",
            body: "They want control over how they communicate and what they use.",
            choices: [
              { id: "practice", label: "Let them choose tools + self-advocate", deltas: { confidence: 0.4, discipline: 0.2 } },
              { id: "simple", label: "You coordinate, they participate", deltas: { empathy: 0.2, confidence: 0.2 }, stressDelta: 0.1 },
              { id: "avoid", label: "Discourage community / control everything", deltas: { confidence: -0.3, empathy: -0.2 }, stressDelta: 0.2 }
            ]
          },
          {
            title: "🎓 Deaf Identity Ownership",
            body: "They're deciding how they identify—Deaf, hard of hearing, disabled, or none of the above. You can support that—or try to define it for them.",
            choices: [
              { id: "empower", label: "Let them define their own identity and community", deltas: { confidence: 0.4, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🎓 You gave them ownership." },
              { id: "support", label: "Offer context and let them explore", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🎓 You stayed supportive and open." },
              { id: "push", label: "Push them toward one identity narrative", deltas: { confidence: -0.2, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "🎓 You chose their story for them." }
            ]
          }
        ]
      }
    ]
  },
  ss_child_mobility_aid_v1: {
    packId: "ss_child_mobility_aid_v1",
    packName: "Mobility Aids",
    emoji: "♿",
    specialStartIds: ["child_mobility_aid"],
    ageBands: [
      {
        id: "mobility_early",
        minAge: 2,
        maxAge: 6,
        chance: 0.85,
        title: "♿ Access Isn't Automatic",
        variants: [
          {
            title: "♿ Access Isn't Automatic",
            body: (age, gs) => {
              const m = gs?.specialStartMeta || {};
              const aid = m.aidType || "wheelchair";
              const climate = m.accessClimate || "mixed";
              return `Your child uses a ${aid}. Access is ${climate}—some places are welcoming, others are a reminder the world wasn't built with everyone in mind.`;
            },
            choices: [
              { id: "practice", label: "Advocate calmly (solutions, not fights)", deltas: { confidence: 0.2, discipline: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "♿ You advocated effectively." },
              { id: "simple", label: "Plan around barriers (backup routes)", deltas: { discipline: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "♿ You planned for reality." },
              { id: "avoid", label: "Avoid outings", deltas: { happiness: -0.1, confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.1, logLine: "♿ The world got smaller." }
            ]
          },
          {
            title: "🏡 Home Modifications",
            body: "Ramps, grab bars, and accessible furniture—modifying your home makes daily life safer and more independent.",
            choices: [
              { id: "modify", label: "Invest in home modifications (accessibility first)", deltas: { confidence: 0.3, discipline: 0.1 }, loveDelta: 0.1, stressDelta: 0.2, moneyDelta: -2000, logLine: "🏡 You made home a place of independence." },
              { id: "gradual", label: "Add modifications gradually as needed", deltas: { discipline: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, moneyDelta: -500, logLine: "🏡 You improved access step-by-step." },
              { id: "skip", label: "Make do with current setup", deltas: { confidence: -0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🏡 Daily tasks stayed harder than needed." }
            ]
          }
        ]
      },
      {
        id: "mobility_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 The Field Trip Question",
        variants: [
          {
            title: "🏫 The Field Trip Question",
            body: () => "A school trip is announced. You immediately start calculating access, bathrooms, fatigue, and whether your kid will feel singled out.",
            choices: [
              { id: "practice", label: "Coordinate access early with the school", deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🏫 You made inclusion practical." },
              { id: "simple", label: "Attend as a helper", deltas: { empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.2, logLine: "🏫 You carried the burden to protect the experience." },
              { id: "avoid", label: "Skip the trip", deltas: { confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.1, logLine: "🏫 They missed out this time." }
            ]
          },
          {
            title: "🏃 Adaptive Sports",
            body: "An adaptive sports program invites your child. It's a chance for movement, community, and normalizing disability pride.",
            choices: [
              { id: "join", label: "Sign them up (community + physical activity)", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🏃 They found community through sport." },
              { id: "try", label: "Try it once and let them decide", deltas: { confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🏃 You gave them a choice." },
              { id: "skip", label: "Skip it (too much scheduling)", deltas: { confidence: -0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🏃 An opportunity passed." }
            ]
          }
        ]
      },
      {
        id: "mobility_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.9,
        title: "🧭 Independence Planning",
        variants: [
          {
            title: "🧭 Independence Planning",
            body: () => "Teen years bring a real question: how do they move through the world on their own terms—safely and confidently?",
            choices: [
              { id: "practice", label: "Build independence skills (planning, transit, advocacy)", deltas: { confidence: 0.3, responsibility: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🧭 You invested in independence." },
              { id: "simple", label: "You manage most logistics", deltas: { empathy: 0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "🧭 You carried it—but it's heavy." },
              { id: "avoid", label: "Avoid the topic", deltas: { confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.15, logLine: "🧭 Independence stayed vague." }
            ]
          },
          {
            title: "🚍 Transit Independence",
            body: "Public transit, paratransit, rideshares—navigating the city independently is freedom. It's also risk.",
            choices: [
              { id: "train", label: "Train transit skills step-by-step (routes, safety, backup plans)", deltas: { confidence: 0.3, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🚍 You built real-world mobility." },
              { id: "accompany", label: "Accompany them and coach gradually", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🚍 You stayed close and supportive." },
              { id: "drive", label: "Just drive them everywhere (safer, more dependent)", deltas: { empathy: 0.1, confidence: -0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "🚍 Convenience limited growth." }
            ]
          }
        ]
      }
    ]
  },
  ss_military_relocation_v1: {
    packId: "ss_military_relocation_v1",
    packName: "PCS Move",
    emoji: "✈️",
    specialStartIds: ["military_relocation_cycle"],
    ageBands: [3, 6, 9, 12, 15, 18].map((a) => ({
      minAge: a,
      maxAge: a,
      title: (age, gs) => {
        const fromIso3 = String(gs?.countryIso3 || 'USA').toUpperCase();
        const toIso3 = computeNextPcsDestination(gs, age);
        return `PCS Orders: ${getCountryName(fromIso3)} → ${getCountryName(toIso3)}`;
      },
      body: (age, gs) => {
        const toIso3 = computeNextPcsDestination(gs, age);
        return `New orders arrive. You’re moving again—new school, new routines, new faces. This time: ${getCountryName(toIso3)}.`;
      },
      choices: [
        {
          id: "local",
          label: "Lean into local life (language + community)", awardHonor: "🏅 Culture Adapter",
          apply: ({ gameState, applyDeltas, applyStress, updateState, recordTimelineEntry }) => {
            const ageNow = gameState?.currentYear ?? a;
            const fromIso3 = String(gameState?.countryIso3 || 'USA').toUpperCase();
            const destIso3 = computeNextPcsDestination(gameState, ageNow);
            const destLang = getLanguageForCountry(destIso3);
            const currentLang = getLanguageForCountry(fromIso3);
            const fluent = isFluentInLanguage(gameState, destLang, 'parent') || (destLang === currentLang);

            updateState(prev => {
              const next = { ...prev, countryIso3: destIso3 };
              if (Array.isArray(prev?.inventory?.items)) {
                next.inventory = { ...prev.inventory, items: prev.inventory.items.filter(it => it?.uniqueGroup !== 'home') };
              }
              if (prev?.realEstate?.properties) {
                next.realEstate = { ...(prev.realEstate || {}), properties: [] };
              }
              return next;
            });

            if (fluent) {
              applyDeltas({ confidence: 0.4, intelligence: 0.2, empathy: 0.1 }, "PCS Move");
            } else {
              applyDeltas({ confidence: 0.1, intelligence: 0.1 }, "PCS Move");
              applyStress(0.3, "PCS Move");
            }

            recordTimelineEntry({
              kind: 'pcs_move',
              title: `✈️ PCS to ${getCountryName(destIso3)}`,
              detail: `You leaned into local life at ${getCountryName(destIso3)}.`,
              meta: { fromIso3, destIso3 }
            });
          }
        },
        {
          id: "base",
          label: "Stay in the base bubble", awardHonor: "🏅 PCS Pro",
          apply: ({ gameState, applyDeltas, applyStress, updateState, recordTimelineEntry }) => {
            const ageNow = gameState?.currentYear ?? a;
            const fromIso3 = String(gameState?.countryIso3 || 'USA').toUpperCase();
            const destIso3 = computeNextPcsDestination(gameState, ageNow);

            updateState(prev => {
              const next = { ...prev, countryIso3: destIso3 };
              if (Array.isArray(prev?.inventory?.items)) {
                next.inventory = { ...prev.inventory, items: prev.inventory.items.filter(it => it?.uniqueGroup !== 'home') };
              }
              if (prev?.realEstate?.properties) {
                next.realEstate = { ...(prev.realEstate || {}), properties: [] };
              }
              return next;
            });

            applyDeltas({ discipline: 0.2, empathy: -0.1 }, "PCS Move");
            applyStress(-0.1, "PCS Move");

            recordTimelineEntry({
              kind: 'pcs_move',
              title: `✈️ PCS to ${getCountryName(destIso3)}`,
              detail: `You stayed mostly on-base at ${getCountryName(destIso3)}.`,
              meta: { fromIso3, destIso3 }
            });
          }
        },
        {
          id: "isolate",
          label: "Keep your head down (isolate)",
          apply: ({ gameState, applyDeltas, applyStress, updateState, recordTimelineEntry }) => {
            const ageNow = gameState?.currentYear ?? a;
            const fromIso3 = String(gameState?.countryIso3 || 'USA').toUpperCase();
            const destIso3 = computeNextPcsDestination(gameState, ageNow);

            updateState(prev => {
              const next = { ...prev, countryIso3: destIso3 };
              if (Array.isArray(prev?.inventory?.items)) {
                next.inventory = { ...prev.inventory, items: prev.inventory.items.filter(it => it?.uniqueGroup !== 'home') };
              }
              if (prev?.realEstate?.properties) {
                next.realEstate = { ...(prev.realEstate || {}), properties: [] };
              }
              return next;
            });

            applyDeltas({ confidence: -0.2, empathy: -0.2 }, "PCS Move");
            applyStress(0.2, "PCS Move");

            recordTimelineEntry({
              kind: 'pcs_move',
              title: `✈️ PCS to ${getCountryName(destIso3)}`,
              detail: `You kept your head down after moving to ${getCountryName(destIso3)}.`,
              meta: { fromIso3, destIso3 }
            });
          }
        }
      ]
    }))
  },
  ss_mafia_family_v1: {
    packId: "ss_mafia_family_v1",
    packName: "Mafia Family",
    emoji: "🕴️",
    specialStartIds: ["mafia_family"],
    ageBands: [
      {
        id: "mafia_early",
        minAge: 1, maxAge: 6,
        chance: 0.85,
        variants: [
          {
            title: "🕴️ ‘Business’ Dinner",
            body: "You host ‘friends’ for dinner. Everyone laughs too loud and watches too closely. Your child is in the next room listening.",
            choices: [
              { id:"quiet", label:"Keep the kid away and keep it clean", deltas:{ empathy:0.1, discipline:0.1 }, stressDelta:0.05, logLine:"🕴️ You kept the child out of it.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-2) }) },
              { id:"flash", label:"Make an impression (big talk, big promises)", moneyDelta:8000, deltas:{ confidence:0.2 }, stressDelta:0.1, logLine:"🕴️ You made money and made noise.", statePatch:(s)=>({ mafiaHeat: (s.mafiaHeat||0)+8 }) },
              { id:"bribe", label:"Smooth things over with ‘gifts’ (expensive, effective)", moneyDelta:-1200, deltas:{ discipline:0.1 }, stressDelta:0.05, logLine:"🕴️ You bought calm.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-6) }) }
            ]
          },
          {
            title: "🚗 A Bag in the Trunk",
            body: "Someone asks you to ‘hold something’ for a night. You don’t ask questions. That’s the rule. But you’re also a parent.",
            choices: [
              { id:"refuse", label:"Refuse (rare move, safer home)", deltas:{ empathy:0.1, confidence:0.1 }, stressDelta:0.1, logLine:"🚗 You said no (and felt eyes on you).", statePatch:(s)=>({ mafiaHeat: (s.mafiaHeat||0)+4 }) },
              { id:"accept", label:"Accept (money now, risk later)", moneyDelta:8000, deltas:{ confidence:0.1 }, stressDelta:0.1, logLine:"🚗 You took the money.", statePatch:(s)=>({ mafiaHeat: (s.mafiaHeat||0)+10 }) },
              { id:"stash", label:"Accept but stash it far from home", moneyDelta:5000, deltas:{ discipline:0.2 }, stressDelta:0.1, logLine:"🚗 You reduced risk with planning.", statePatch:(s)=>({ mafiaHeat: (s.mafiaHeat||0)+6 }) }
            ]
          },
          {
            title: "🧾 The ‘Charity’ Receipt",
            body: "A community fundraiser wants your name on the sponsor list. It would help your image. It would also be… strategic.",
            choices: [
              { id:"donate", label:"Donate publicly (good optics)", moneyDelta:-2000, deltas:{ empathy:0.2, confidence:0.1 }, awardHonor: "🏅 Neighborhood Benefactor", stressDelta:0.05, logLine:"🧾 You bought goodwill.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-2) }) },
              { id:"front", label:"Use it as a front (big money, big attention)", moneyDelta:12000, deltas:{ confidence:0.2 }, stressDelta:0.1, logLine:"🧾 You made money and headlines.", statePatch:(s)=>({ mafiaHeat: (s.mafiaHeat||0)+12 }) },
              { id:"skip", label:"Skip it (no attention)", deltas:{ discipline:0.1 }, stressDelta:0.05, logLine:"🧾 You stayed quiet.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-1) }) }
            ]
          }
        ]
      },
      {
        id: "mafia_mid",
        minAge: 7, maxAge: 12,
        chance: 0.90,
        variants: [
          {
            title: "🧠 The Question",
            body: "Your child asks what you do for work. They’re old enough to notice you’re never broke… and never fully relaxed.",
            choices: [
              { id:"lie", label:"Lie smoothly (‘consulting’)", deltas:{ discipline:0.1 }, stressDelta:0.05, logLine:"🧠 You kept the cover story alive.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-1) }) },
              { id:"halftruth", label:"Tell a careful half-truth (boundaries + honesty)", deltas:{ empathy:0.2, confidence:0.1 }, stressDelta:0.1, logLine:"🧠 You made truth safer.", statePatch:(s)=>({ mafiaLegacy: Math.max(0,(s.mafiaLegacy||0)-1) }) },
              { id:"proud", label:"Be proud (‘I run things.’)", deltas:{ confidence:0.2, empathy:-0.2 }, stressDelta:0.05, logLine:"🧠 You made power sound normal.", statePatch:(s)=>({ mafiaLegacy: (s.mafiaLegacy||0)+3 }) }
            ]
          },
          {
            title: "🎁 The ‘Uncle’ Gift",
            body: "A loyal crew member buys your child a wildly inappropriate gift (flashy, expensive, attention‑grabbing).",
            choices: [
              { id:"return", label:"Return it (set boundaries)", deltas:{ discipline:0.2, empathy:0.1 }, stressDelta:0.05, logLine:"🎁 You set a line.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-3) }) },
              { id:"keep", label:"Keep it (status feels good)", deltas:{ confidence:0.2 }, stressDelta:0.05, logLine:"🎁 You let the status in.", statePatch:(s)=>({ mafiaLegacy: (s.mafiaLegacy||0)+2, mafiaHeat:(s.mafiaHeat||0)+2 }) },
              { id:"trade", label:"Trade it for something normal", deltas:{ empathy:0.1, discipline:0.1 }, stressDelta:0.05, logLine:"🎁 You redirected without humiliation.", statePatch:(s)=>({ mafiaLegacy: Math.max(0,(s.mafiaLegacy||0)-1) }) }
            ]
          }
        ]
      },
      {
        id: "mafia_teen",
        minAge: 13, maxAge: 18,
        chance: 0.95,
        variants: [
          {
            title: "🕴️ The Code",
            body: "Your child is old enough to understand the rules: loyalty, silence, image. Do you teach them ‘the code’ or keep them clean?",
            choices: [
              { id:"teach", label:"Teach them the code (power + protection)", moneyDelta:8000, deltas:{ discipline:0.2, confidence:0.2, empathy:-0.2 }, stressDelta:0.1, logLine:"🕴️ You trained a successor.", statePatch:(s)=>({ mafiaLegacy:(s.mafiaLegacy||0)+5, mafiaHeat:(s.mafiaHeat||0)+6 }) },
              { id:"shield", label:"Keep them out (normal teen life)", deltas:{ empathy:0.3, confidence:0.1 }, stressDelta:0.1, logLine:"🕊️ You tried to keep them clean.", statePatch:(s)=>({ mafiaLegacy: Math.max(0,(s.mafiaLegacy||0)-2), mafiaHeat:(s.mafiaHeat||0)+2 }) },
              { id:"legit", label:"Start going legit (expensive, safer future)", moneyDelta:-6000, deltas:{ empathy:0.2, discipline:0.2 }, awardHonor: "🏅 Clean Exit", stressDelta:0.15, logLine:"🧼 You began the painful pivot to legitimate life.", statePatch:(s)=>({ mafiaWentLegit:true, mafiaHeat: Math.max(0,(s.mafiaHeat||0)-10) }) }
            ]
          },
          {
            title: "🚨 Heat Is Rising",
            body: "You feel it: attention. Rumors. A new investigator who actually follows through. Heat isn’t fear—it’s math.",
            choices: [
              { id:"laylow", label:"Lay low (less money, less heat)", moneyDelta:2000, deltas:{ discipline:0.1 }, awardHonor: "🏅 Heat Manager", stressDelta:0.05, logLine:"🚨 You went quiet.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-8) }) },
              { id:"push", label:"Push anyway (big money, big risk)", moneyDelta:14000, deltas:{ confidence:0.1 }, stressDelta:0.1, logLine:"🚨 You cashed in and rolled the dice.", statePatch:(s)=>({ mafiaHeat: (s.mafiaHeat||0)+14 }) },
              { id:"clean", label:"Spend money to reduce risk (lawyers, PR, distance)", moneyDelta:-5000, deltas:{ discipline:0.1 }, stressDelta:0.1, logLine:"🚨 You paid for breathing room.", statePatch:(s)=>({ mafiaHeat: Math.max(0,(s.mafiaHeat||0)-12) }) }
            ]
          }
        ]
      },
      {
        id: "mafia_random",
        minAge: 4, maxAge: 18,
        chance: 0.25,
        title: "📦 A ‘Favor’",
        body: "Someone asks for a favor that makes your stomach tighten. It’s not illegal‑sounding. It’s illegal‑feeling.",
        choices: [
          { id:"no", label:"Say no", deltas:{ confidence:0.1, empathy:0.1 }, stressDelta:0.1, logLine:"📦 You refused and felt the temperature drop.", statePatch:(s)=>({ mafiaHeat:(s.mafiaHeat||0)+4 }) },
          { id:"yes", label:"Say yes", moneyDelta:7000, deltas:{ confidence:0.1 }, stressDelta:0.1, logLine:"📦 You did the favor.", statePatch:(s)=>({ mafiaHeat:(s.mafiaHeat||0)+9 }) },
          { id:"delay", label:"Delay and redirect", moneyDelta:3000, deltas:{ discipline:0.1 }, stressDelta:0.05, logLine:"📦 You stalled and survived the moment.", statePatch:(s)=>({ mafiaHeat:(s.mafiaHeat||0)+5 }) }
        ]
      }
    ]
  },

  ss_divorce_coparenting_v1: {
    packId: "ss_divorce_coparenting_v1",
    packName: "Divorce + Co‑Parenting",
    emoji: "🗓️",
    specialStartIds: ["divorce_coparenting"],
    ageBands: [
      {
        minAge: 2, maxAge: 2,
        title: "🧸 Exchange Day",
        body: "Hand‑offs are tense. Your child senses every micro‑emotion. The schedule is working… but the vibes aren’t.",
        choices: [
          { id:"calm", label:"Keep hand‑offs brief, calm, and child‑focused", deltas:{ empathy:0.3, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🧸 You made exchanges safer emotionally." },
          { id:"structure", label:"Formalize the plan (clear rules, clear calendar)", deltas:{ discipline:0.3, confidence:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🧸 You reduced chaos with structure." },
          { id:"conflict", label:"Argue in the moment (they’ll learn the truth)", deltas:{ empathy:-0.3, confidence:-0.3 }, loveDelta:-0.2, stressDelta:0.3, logLine:"🧸 Conflict became part of the routine." }
        ]
      },
      {
        minAge: 6, maxAge: 6,
        title: "📏 Two Sets of Rules",
        body: "At one home, bedtime is strict. At the other, it’s chaos. Your child starts testing boundaries everywhere.",
        choices: [
          { id:"align", label:"Coordinate a few core rules across homes", deltas:{ discipline:0.4, empathy:0.1 }, loveDelta:0.1, stressDelta:0.2, logLine:"📏 You aligned the basics without controlling everything." },
          { id:"different", label:"Accept differences and focus on your house only", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"📏 You chose peace over control." },
          { id:"blame", label:"Blame the other parent in front of the child", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.2, stressDelta:0.3, logLine:"📏 The child got pulled into adult conflict." }
        ]
      },
      {
        minAge: 12, maxAge: 12,
        title: "📱 The Phone Problem",
        body: "Your child starts carrying messages between adults: “Mom said…” “Dad said…”. It’s exhausting and unfair.",
        choices: [
          { id:"shield", label:"Make a rule: no messenger kid (adults communicate directly)", deltas:{ empathy:0.3, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"📱 You took the burden off the child." },
          { id:"coach", label:"Coach them: ‘You can say no to being in the middle.’", deltas:{ confidence:0.3, discipline:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"📱 You taught boundaries." },
          { id:"ignore", label:"Let it happen (it’s easier than fighting)", deltas:{ confidence:-0.3, empathy:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"📱 The child became the bridge—and the damage." }
        ]
      },
      {
        minAge: 16, maxAge: 16,
        title: "🧑‍⚖️ ‘I Want a Say’",
        body: "They’re old enough to challenge the schedule. They want autonomy—and they want the adults to stop acting like the schedule is more important than them.",
        choices: [
          { id:"listen", label:"Let them shape the schedule with you", deltas:{ confidence:0.4, empathy:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🧑‍⚖️ You treated them like a person, not a parcel." },
          { id:"firm", label:"Keep the schedule fixed ‘for stability’", deltas:{ discipline:0.3, confidence:-0.1 }, loveDelta:0, stressDelta:0.1, logLine:"🧑‍⚖️ Stability helped—autonomy suffered." },
          { id:"weaponize", label:"Use them to ‘win’ against the other parent", deltas:{ empathy:-0.4, confidence:-0.3 }, loveDelta:-0.2, stressDelta:0.3, logLine:"🧑‍⚖️ The child learned love has sides." }
        ]
      },
      {
        id: "divorce_random_years",
        minAge: 3,
        maxAge: 18,
        chance: 0.35,
        title: "🗓️ Co‑Parenting: The Extra Stuff",
        variants: [
          {
            title: "📅 Schedule Curveball",
            body: "A last‑minute schedule change lands. The child just wants stability—adults want 'fair.'",
            choices: [
              { id:"flex", label:"Be flexible (child stability first)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.15, logLine:"📅 You chose the kid over the scoreboard." },
              { id:"rules", label:"Stick to the schedule strictly", deltas:{ discipline:0.2 }, loveDelta:0, stressDelta:0.1, logLine:"📅 Rules held; feelings didn't." },
              { id:"fight", label:"Fight about it in front of the child", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.1, stressDelta:0.25, logLine:"📅 The child absorbed the conflict." }
            ]
          },
          {
            title: "🎭 School Event Seating",
            body: "There's a school event. Everyone wonders where everyone will sit. The kid notices.",
            choices: [
              { id:"adult", label:"Act like adults (sit respectfully)", deltas:{ empathy:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🎭 You made it safe and normal." },
              { id:"separate", label:"Separate seating (peace, but awkward)", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.1, logLine:"🎭 You reduced conflict, not tension." },
              { id:"spite", label:"Use it as a social battlefield", deltas:{ empathy:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🎭 The kid felt like a trophy." }
            ]
          }
        ]
      }
    ]
  },

  ss_caregiver_grandparent_home_v1: {
    packId: "ss_caregiver_grandparent_home_v1",
    packName: "Caregiving at Home",
    emoji: "🧓",
    specialStartIds: ["caregiver_grandparent_home"],
    ageBands: [
      {
        minAge: 1, maxAge: 1,
        title: "🧓 The New Routine",
        body: "Caregiving becomes part of daily life: appointments, routines, small emergencies, constant planning. Your child is watching what ‘responsibility’ looks like.",
        choices: [
          { id:"team", label:"Build a caregiving team (ask family/services for help)", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.2, logLine:"🧓 You built support instead of martyrdom." },
          { id:"solo", label:"Do it all yourself (you’ll manage)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.3, logLine:"🧓 You carried it—at a cost." },
          { id:"resent", label:"Let resentment leak into the home", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.1, stressDelta:0.3, logLine:"🧓 The house felt heavier than it needed to." }
        ]
      },
      {
        minAge: 7, maxAge: 7,
        title: "🧠 Burnout Edge",
        body: "You’re stretched thin. Your child wants attention. Your relative needs care. Your own needs… don’t make the list.",
        choices: [
          { id:"rest", label:"Protect rest with boundaries (and accept imperfection)", deltas:{ confidence:0.3, empathy:0.2 }, loveDelta:0.1, stressDelta:-0.1, logLine:"🧠 You chose sustainable care." },
          { id:"schedule", label:"Schedule everything (tight structure)", deltas:{ discipline:0.3 }, loveDelta:0, stressDelta:0.1, logLine:"🧠 Structure kept things running." },
          { id:"explode", label:"Snap more often than you want to", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🧠 Stress spilled onto the people you love." }
        ]
      },
      {
        minAge: 13, maxAge: 13,
        title: "🧺 ‘Do I Have To Help?’",
        body: "Your child pushes back on helping at home. They want freedom like their friends. You want them to care—without robbing their childhood.",
        choices: [
          { id:"fair", label:"Give age‑appropriate tasks + explain why it matters", deltas:{ discipline:0.2, empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🧺 You taught responsibility without guilt." },
          { id:"protect", label:"Protect them from the burden (you’ll handle it)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.2, stressDelta:0.2, logLine:"🧺 You shielded them—your load increased." },
          { id:"guilt", label:"Guilt them into helping", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🧺 Help happened, but so did resentment." }
        ]
      },
      {
        minAge: 17, maxAge: 17,
        title: "🏁 The Long View",
        body: "You’re thinking about the future: support systems, independence, and what your child learned by watching you care for someone else.",
        choices: [
          { id:"plan", label:"Make a long‑term plan with support (services/family)", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🏁 You planned for stability." },
          { id:"talk", label:"Talk with your child about what they want their adult life to be", deltas:{ empathy:0.3, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🏁 You protected their autonomy." },
          { id:"avoid", label:"Avoid planning (too painful / too scary)", deltas:{ confidence:-0.2, discipline:-0.2 }, loveDelta:0, stressDelta:0.2, logLine:"🏁 The future stayed foggy." }
        ]
      }
    ]
  },

  ss_teen_parent_v1: {
    packId: "ss_teen_parent_v1",
    packName: "Teen Parent",
    emoji: "🧃",
    specialStartIds: ["teen_parent"],
    ageBands: [
      {
        minAge: 0, maxAge: 0,
        title: "📚 Baby + School",
        body: "You’re still a student, but now you’re also a parent. Sleep is rare. Time is a rumor.",
        choices: [
          { id:"finish", label:"Fight to stay in school (ask for support, adjust schedule)", deltas:{ intelligence:0.3, discipline:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.3, logLine:"📚 You tried to keep education on the table." },
          { id:"work", label:"Prioritize income now (school can wait)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.2, logLine:"📚 You chose survival-first." },
          { id:"overwhelm", label:"Try to do everything alone (no help, no plan)", deltas:{ confidence:-0.2, empathy:-0.1 }, loveDelta:-0.1, stressDelta:0.4, logLine:"📚 Isolation made everything heavier." }
        ]
      },
      {
        minAge: 3, maxAge: 3,
        title: "🧑‍🏫 The Meeting",
        body: "An adult in your life (school counselor, relative, or caseworker) asks what your plan is. It’s not judgment… but it feels like it.",
        choices: [
          { id:"plan", label:"Make a real plan (childcare + school/work steps)", deltas:{ discipline:0.3, confidence:0.2 }, loveDelta:0.1, stressDelta:0.2, logLine:"🧑‍🏫 You turned anxiety into a plan." },
          { id:"support", label:"Accept help even if pride hates it", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🧑‍🏫 You let support become normal." },
          { id:"defensive", label:"Refuse help and go defensive", deltas:{ confidence:0.1, empathy:-0.2 }, loveDelta:0, stressDelta:0.2, logLine:"🧑‍🏫 You protected pride, not peace." }
        ]
      },
      {
        minAge: 6, maxAge: 6,
        title: "🎓 A Door Opens",
        body: "A realistic opportunity appears (GED, training program, a better job track). It costs time and energy now, but could change everything later.",
        choices: [
          { id:"take", label:"Take the opportunity", deltas:{ intelligence:0.4, discipline:0.2 }, loveDelta:0, stressDelta:0.3, logLine:"🎓 You invested in the long game." },
          { id:"later", label:"Delay it for stability", deltas:{ confidence:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🎓 You chose steadiness over risk." },
          { id:"avoid", label:"Ignore it (too scary / too hard)", deltas:{ discipline:-0.2, confidence:-0.1 }, loveDelta:0, stressDelta:0.2, logLine:"🎓 The door closed quietly." }
        ]
      },
      {
        minAge: 12, maxAge: 12,
        title: "🪞 ‘You Don’t Get It’",
        body: "Your child hits a phase where they’re embarrassed by how young you are—or they test your authority hard because you feel ‘close to them.’",
        choices: [
          { id:"steady", label:"Hold calm authority (you’re the parent, not a peer)", deltas:{ discipline:0.3, empathy:0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🪞 You set boundaries without ego." },
          { id:"talk", label:"Talk honestly about your story without oversharing", deltas:{ empathy:0.3, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🪞 You gave context without burdening them." },
          { id:"react", label:"React personally and argue", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🪞 It turned into a fight about pride." }
        ]
      },
      {
        minAge: 16, maxAge: 16,
        title: "⏳ The Mirror Year",
        body: "You realize you were their age when you became a parent. It hits you hard. You can repeat patterns—or change them.",
        choices: [
          { id:"break", label:"Break the cycle: talk about choices, support, and future", deltas:{ empathy:0.4, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"⏳ You turned your past into guidance." },
          { id:"strict", label:"Clamp down with fear (control everything)", deltas:{ discipline:0.3, empathy:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"⏳ Fear made the rules louder than love." },
          { id:"avoid", label:"Avoid the conversation", deltas:{ confidence:-0.2 }, loveDelta:0, stressDelta:0.1, logLine:"⏳ The moment passed without being used." }
        ]
      }
    ]
  },

  ss_gifted_child_v1: {
    packId: "ss_gifted_child_v1",
    packName: "Gifted Child",
    emoji: "✨",
    specialStartIds: ["gifted_child"],
    ageBands: [
      {
        minAge: 5, maxAge: 5,
        title: "✨ Too Easy",
        body: "School feels painfully slow. Your child finishes early… then gets restless. The teacher says, “They’re bright, but they disrupt when bored.”",
        choices: [
          { id:"enrich", label:"Ask for enrichment (harder work, deeper projects)", deltas:{ intelligence:0.4, discipline:0.2, confidence:0.1 }, loveDelta:0.2, stressDelta:0.2, logLine:"✨ You pushed for enrichment instead of punishment." },
          { id:"protect", label:"Protect their childhood (less pressure, more play)", deltas:{ confidence:0.2, empathy:0.2 }, loveDelta:0.3, stressDelta:0.1, logLine:"✨ You prioritized joy over acceleration." },
          { id:"pressure", label:"Lean hard into performance (grades, rewards, comparison)", deltas:{ discipline:0.3, confidence:0.1, empathy:-0.2 }, loveDelta:-0.1, stressDelta:0.3, logLine:"✨ Pressure worked short-term—and cost something long-term." }
        ]
      },
      {
        minAge: 9, maxAge: 9,
        title: "🎯 The Perfection Trap",
        body: "They hate being wrong. A small mistake turns into tears or anger. It’s not drama—it’s fear of failing expectations.",
        choices: [
          { id:"process", label:"Praise effort + teach recovery from mistakes", deltas:{ confidence:0.4, empathy:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🎯 You taught that mistakes are allowed." },
          { id:"coach", label:"Give tools: time limits, drafts, “good enough” rules", deltas:{ discipline:0.3, confidence:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🎯 You built systems to prevent spirals." },
          { id:"demand", label:"Raise expectations even higher", deltas:{ intelligence:0.2, confidence:-0.3, empathy:-0.2 }, loveDelta:-0.2, stressDelta:0.3, logLine:"🎯 You turned potential into pressure." }
        ]
      },
      {
        minAge: 13, maxAge: 13,
        title: "🧩 Belonging",
        body: "They feel different. They’re advanced in some ways and behind in others. They want friends who get them—not a label.",
        choices: [
          { id:"community", label:"Find interest-based community (clubs, competitions, arts)", deltas:{ confidence:0.3, empathy:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🧩 You helped them find ‘their people.’" },
          { id:"normalize", label:"Normalize the differences without making it a big thing", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.2, stressDelta:0.1, logLine:"🧩 You kept it calm and human." },
          { id:"status", label:"Make it an identity brand (every conversation becomes ‘gifted’)", deltas:{ confidence:-0.2, empathy:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🧩 The label got louder than the kid." }
        ]
      },
      {
        minAge: 16, maxAge: 16,
        title: "🔥 Burnout Warning",
        body: "They’re capable of huge output… but they’re tired. Motivation is collapsing. They ask: “What’s the point of any of this?”",
        choices: [
          { id:"rebalance", label:"Rebalance: rest + one meaningful challenge", deltas:{ confidence:0.4, discipline:0.1 }, loveDelta:0.2, stressDelta:-0.1, logLine:"🔥 You traded prestige for sustainability." },
          { id:"push", label:"Push through (this is the ‘important year’)", deltas:{ intelligence:0.2, discipline:0.2, confidence:-0.3 }, loveDelta:-0.2, stressDelta:0.3, logLine:"🔥 You got results—and more cracks." },
          { id:"drift", label:"Let them coast completely", deltas:{ discipline:-0.3, confidence:-0.1 }, loveDelta:0.1, stressDelta:0.1, logLine:"🔥 Relief now, drift later." }
        ]
      },
      {
        id: "gifted_random_years",
        minAge: 6,
        maxAge: 18,
        chance: 0.35,
        title: "🧠 Gifted… and Complicated",
        variants: [
          {
            title: "🌪️ Overcommitment",
            body: "They sign up for everything. It looks impressive. It feels like a slow‑motion burnout.",
            choices: [
              { id:"trim", label:"Trim commitments (protect rest)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:-0.05, logLine:"🌪️ You protected recovery time." },
              { id:"push", label:"Let them chase it all", deltas:{ confidence:0.2 }, loveDelta:0, stressDelta:0.2, logLine:"🌪️ They kept winning—and fraying." },
              { id:"avoid", label:"Ignore it (they'll self-regulate)", deltas:{ discipline:-0.1 }, loveDelta:-0.05, stressDelta:0.15, logLine:"🌪️ The schedule ran the household." }
            ]
          },
          {
            title: "🫥 Impostor Feeling",
            body: "They admit they feel 'fake'—like everyone expects genius and they feel human.",
            choices: [
              { id:"normalize", label:"Normalize it + teach self-compassion", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.05, logLine:"🫥 You made room for being human." },
              { id:"fix", label:"Try to 'fix' it with more achievements", deltas:{ confidence:0.1 }, loveDelta:0, stressDelta:0.2, logLine:"🫥 Success got louder; feelings got quieter." },
              { id:"dismiss", label:"Dismiss it ('You're fine')", deltas:{ empathy:-0.1, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.1, logLine:"🫥 They felt alone with it." }
            ]
          },
          {
            title: "🔥 Burnout Warning",
            body: "Grades slip. Motivation collapses. They're not lazy—they're *done*.",
            choices: [
              { id:"rest", label:"Treat it like an injury: rest + rebuild", deltas:{ discipline:0.1, empathy:0.2 }, loveDelta:0.1, stressDelta:-0.05, logLine:"🔥 You rebuilt from burnout." },
              { id:"punish", label:"Punish the drop (pressure fixes everything)", deltas:{ discipline:0.1, empathy:-0.2 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🔥 Pressure rose; health fell." },
              { id:"coach", label:"Get support (mentor / counselor)", deltas:{ intelligence:0.1, confidence:0.1 }, loveDelta:0.05, stressDelta:0.1, logLine:"🔥 You added tools, not shame." }
            ]
          }
        ]
      }
    ]
  },

  pack_screen_time_v1: {
    packId: "pack_screen_time_v1",
    packName: "Screen Time & Boundaries",
    emoji: "📱",
    ageBands: [
      {
        minAge: 3,
        maxAge: 7,
        title: "Screens are starting to show up",
        body: "Tablets, shows, and tiny negotiations about 'just one more.' How do you want to handle screen time this year?",
        choices: [
          {
            id: "practice",
            label: "Practice transitions",
            deltas: { discipline: 0.2, confidence: 0, empathy: 0, intelligence: 0 },
            loveDelta: 0,
            stressDelta: 0.5,
            logLine: "You rehearse screen-time endings. It's awkward at first, then slightly less so."
          },
          {
            id: "simple",
            label: "Keep it simple",
            deltas: { discipline: 0.1, confidence: 0, empathy: 0, intelligence: 0 },
            loveDelta: 0,
            stressDelta: 0,
            logLine: "You set a timer and mostly stick to it. Good enough."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 8,
        maxAge: 12,
        title: "Screen time is a real negotiation now",
        body: "They want more autonomy, more access, and more 'everyone else has it.' What's your approach this year?",
        choices: [
          {
            id: "practice",
            label: "Set clear rules",
            deltas: { discipline: 0.3, confidence: 0.1, empathy: -0.1, intelligence: 0 },
            loveDelta: -0.2,
            stressDelta: 1,
            logLine: "You define limits clearly. The pushback is real, but the structure holds."
          },
          {
            id: "simple",
            label: "Wing it",
            deltas: { discipline: -0.1, confidence: 0, empathy: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: -0.3,
            logLine: "You keep it flexible. Some days it works; some days it's chaos."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 13,
        maxAge: 18,
        title: "They have their own devices now",
        body: "Privacy, late-night scrolling, group chats you'll never see. How do you navigate screen time in the teen years?",
        choices: [
          {
            id: "practice",
            label: "Check in regularly",
            deltas: { empathy: 0.2, confidence: 0.1, discipline: 0.1, intelligence: 0 },
            loveDelta: 0.3,
            stressDelta: 0.5,
            logLine: "You ask about their digital life without interrogating. They share a little more than expected."
          },
          {
            id: "simple",
            label: "Trust and observe",
            deltas: { confidence: 0.2, empathy: 0, discipline: -0.1, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: -0.2,
            logLine: "You give space and watch for signs. Mostly, they handle it."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      }
    ]
  },
  
  pack_school_confidence_v1: {
    packId: "pack_school_confidence_v1",
    packName: "School Confidence & Anxiety",
    emoji: "🎒",
    ageBands: [
      {
        minAge: 3,
        maxAge: 4,
        title: "Preschool nerves start showing up",
        body: "New rooms, new adults, separation wobbles, and big feelings in small bodies. How do you support them this year?",
        choices: [
          {
            id: "ritual",
            label: "Create a goodbye ritual",
            deltas: { discipline: 0.1, confidence: 0.2, empathy: 0.1, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.3,
            logLine: "You create a tiny ritual: hug, brave phrase, goodbye. Predictability helps both of you."
          },
          {
            id: "tools",
            label: "Teach calm-body tools",
            deltas: { empathy: 0.2, confidence: 0.2, discipline: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.1,
            logLine: "You practice breathing and grounding when they're calm so it exists when they're not."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 5,
        maxAge: 8,
        title: "School is new and sometimes scary",
        body: "Drop-off wobbles, classroom worries, and the question 'will I be okay?' How do you support them this year?",
        choices: [
          {
            id: "practice",
            label: "Build a routine",
            deltas: { discipline: 0.2, confidence: 0.2, empathy: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.3,
            logLine: "You create a tiny ritual: hug, brave face, see you soon. It helps both of you."
          },
          {
            id: "simple",
            label: "Validate and send",
            deltas: { empathy: 0.1, confidence: 0.1, discipline: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0,
            logLine: "You name the feeling, give a quick squeeze, and trust the teacher. It works most days."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 9,
        maxAge: 13,
        title: "School pressure is building",
        body: "Grades, friendships, fitting in—confidence wobbles are less visible but just as real. What's your plan?",
        choices: [
          {
            id: "practice",
            label: "Talk it through",
            deltas: { empathy: 0.3, confidence: 0.2, discipline: 0, intelligence: 0 },
            loveDelta: 0.3,
            stressDelta: 0.5,
            logLine: "You check in weekly. Sometimes they open up; sometimes they shrug. You keep asking."
          },
          {
            id: "simple",
            label: "Encourage effort",
            deltas: { confidence: 0.2, discipline: 0.1, empathy: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0,
            logLine: "You praise trying, not just winning. They notice."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 14,
        maxAge: 18,
        title: "Performance anxiety is real now",
        body: "College pressure, social comparison, and the weight of 'not enough.' How do you help them stay grounded?",
        choices: [
          {
            id: "practice",
            label: "Normalize struggle",
            deltas: { empathy: 0.3, confidence: 0.2, discipline: 0, intelligence: 0 },
            loveDelta: 0.4,
            stressDelta: 0.5,
            logLine: "You share your own failures. They relax a little, realizing human is okay."
          },
          {
            id: "simple",
            label: "Be steady",
            deltas: { confidence: 0.2, empathy: 0.1, discipline: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0,
            logLine: "You remind them they're more than their résumé. They pretend not to hear it, then quote it later."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      }
    ]
  },

  pack_teen_autonomy_v1: {
    packId: "pack_teen_autonomy_v1",
    packName: "Teen Autonomy",
    emoji: "🚪",
    ageBands: [
      {
        minAge: 11,
        maxAge: 14,
        title: "They're starting to close doors",
        body: "Privacy, independence, and the slow shift away from needing you for everything. How do you navigate it?",
        choices: [
          {
            id: "practice",
            label: "Respect + check-ins",
            deltas: { confidence: 0.3, empathy: 0.1, discipline: 0, intelligence: 0 },
            loveDelta: 0.3,
            stressDelta: 0.3,
            logLine: "You give space but stay present. They test it, then settle into it."
          },
          {
            id: "simple",
            label: "Trust the process",
            deltas: { confidence: 0.2, empathy: 0, discipline: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0,
            logLine: "You let them figure some things out alone. It's uncomfortable, and it works."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 15,
        maxAge: 18,
        title: "Autonomy is the main theme now",
        body: "Curfews, decisions, earning trust—they're practicing adulthood in real time. What's your role?",
        choices: [
          {
            id: "practice",
            label: "Clear agreements",
            deltas: { discipline: 0.3, confidence: 0.2, empathy: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.5,
            logLine: "You set clear expectations and follow through. They hate it, then appreciate it later."
          },
          {
            id: "simple",
            label: "Let them lead",
            deltas: { confidence: 0.3, discipline: -0.1, empathy: 0.1, intelligence: 0 },
            loveDelta: 0.3,
            stressDelta: -0.3,
            logLine: "You step back. They stumble, recover, and grow a little taller."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      }
    ]
  },

  pack_coparenting_v1: {
    packId: "pack_coparenting_v1",
    packName: "Treaties & Truces",
    emoji: "👥",
    ageBands: [
      // =========================
      // TOGETHER CO-PARENTING (same household)
      // householdType === 'two'
      // =========================

      {
        minAge: 0,
        maxAge: 2,
        householdTypes: ["two"],
        title: "Two adults. One tiny CEO.",
        body: "Sleep is a rumor. Your child has strong feelings and zero PowerPoint slides to explain them. Co-parenting this year is basically: 'Who’s on snack duty and who’s on emotional support?'",
        choices: [
          {
            id: "practice",
            label: "Tag-team + debrief",
            deltas: { discipline: 0.2, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.6,
            logLine: "You two do quick hand-offs and tiny debriefs. It’s not romantic, but it is effective."
          },
          {
            id: "simple",
            label: "Divide & survive",
            deltas: { discipline: 0.1, empathy: 0.1, confidence: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            logLine: "You each take a lane. Sometimes you clash, but mostly you keep the baby alive. Win."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 3,
        maxAge: 5,
        householdTypes: ["two"],
        title: "The 'But Mom said yes' era begins",
        body: "Your child is now a tiny lawyer specializing in loopholes. Co-parenting this year is mostly: consistency, calm voices, and not negotiating like you’re at a flea market.",
        choices: [
          {
            id: "practice",
            label: "Private huddle first",
            deltas: { discipline: 0.3, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.7,
            logLine: "You agree privately before you answer. The tantrums don’t vanish, but they get… less athletic."
          },
          {
            id: "simple",
            label: "On-the-fly compromise",
            deltas: { discipline: 0.1, empathy: 0.2, confidence: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You improvise together. Some days it’s smooth. Some days it’s two adults being outsmarted by a preschooler."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 6,
        maxAge: 10,
        householdTypes: ["two"],
        title: "Calendar Tetris + rule consistency",
        body: "School, friends, activities, and the mysterious disappearance of left shoes. Co-parenting this year is less about big talks and more about clean hand-offs and predictable rules.",
        choices: [
          {
            id: "practice",
            label: "Weekly co-parent sync",
            deltas: { discipline: 0.3, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.6,
            logLine: "You do a short weekly sync: schedule, rules, and what’s actually working. Your future self thanks you."
          },
          {
            id: "simple",
            label: "Loose alignment",
            deltas: { discipline: 0.1, empathy: 0.1, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.1,
            logLine: "You keep it flexible. It’s mostly fine… until bedtime rules become a philosophical debate."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 11,
        maxAge: 13,
        householdTypes: ["two"],
        title: "Middle school: negotiations go pro",
        body: "Your child can now sense disagreement from three rooms away. Co-parenting this year is about staying calm, staying aligned, and not letting arguments become a spectator sport.",
        choices: [
          {
            id: "practice",
            label: "Unified front (calm, not scary)",
            deltas: { discipline: 0.3, empathy: 0.3, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.7,
            logLine: "You keep disagreements private and present one plan. They complain, then follow it. Mostly."
          },
          {
            id: "simple",
            label: "Each parent specializes",
            deltas: { discipline: 0.1, empathy: 0.2, confidence: 0.2, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "One of you is structure, one is support. It works… until you both accidentally become the ‘mean’ parent in the same week."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 14,
        maxAge: 18,
        householdTypes: ["two"],
        title: "Curfews, cars, and 'Why are you texting the other parent?'",
        body: "They’re practicing adulthood in real time. Co-parenting this year is about shared expectations, fewer lectures, and agreements that don’t collapse at 11:47 PM.",
        choices: [
          {
            id: "practice",
            label: "Shared agreements + follow-through",
            deltas: { discipline: 0.3, confidence: 0.2, empathy: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.8,
            logLine: "You align on curfews and consequences. They hate it now. They respect it later."
          },
          {
            id: "simple",
            label: "Trust-but-verify",
            deltas: { confidence: 0.3, empathy: 0.1, discipline: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You give space and keep an eye on patterns. Fewer battles, more coaching."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      // =========================
      // SEPARATED CO-PARENTING (two homes)
      // householdType === 'single'
      // =========================

      {
        minAge: 0,
        maxAge: 2,
        householdTypes: ["single"],
        title: "Hand-offs and tiny routines",
        body: "Two homes, one diaper bag, and a baby who does not care about your calendar system. Co-parenting this year is: smooth transitions and fewer surprise changes.",
        choices: [
          {
            id: "practice",
            label: "Shared routine notes", awardHonor: "🏅 Support Network Builder",
            deltas: { discipline: 0.2, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.6,
            logLine: "You keep simple notes on sleep, food, and soothing. It’s not deep romance — it’s logistics. It helps."
          },
          {
            id: "simple",
            label: "Parallel parenting (minimal contact)",
            deltas: { discipline: 0.1, empathy: 0.1, confidence: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            logLine: "You keep it basic and low-drama. Not perfect, but calmer. Baby benefits from predictable hand-offs."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 3,
        maxAge: 5,
        householdTypes: ["single"],
        title: "Two homes, one tiny lawyer",
        body: "They’re learning which rules belong to which house — and testing whether adults can be played like a kazoo. Co-parenting this year is about a few shared basics and a lot of calm repetition.",
        choices: [
          {
            id: "practice",
            label: "Align the Big 3 rules",
            deltas: { discipline: 0.3, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.7,
            logLine: "You align on 3 non-negotiables (bedtime-ish, safety, respect). Fewer loopholes. Less chaos."
          },
          {
            id: "simple",
            label: "Pick your battles",
            deltas: { discipline: 0.1, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You focus on what you control. Some inconsistency remains, but you stop bleeding energy into it."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 6,
        maxAge: 10,
        householdTypes: ["single"],
        title: "Backpack ping-pong + school logistics",
        body: "Homework travels. Permission slips vanish. A library book lives in the other house for three weeks. Co-parenting this year is: shared systems and fewer surprises.",
        choices: [
          {
            id: "practice",
            label: "Shared calendar + quick updates", awardHonor: "🏅 Logistics Wizard",
            deltas: { discipline: 0.3, empathy: 0.2, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.6,
            logLine: "You coordinate schedules and school stuff. The amount of chaos you avoid feels like a superpower."
          },
          {
            id: "simple",
            label: "Two systems, one weekly check-in",
            deltas: { discipline: 0.2, empathy: 0.1, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            logLine: "You keep separate systems but do one quick check-in. It’s not perfect, but it keeps the wheels on."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 11,
        maxAge: 13,
        householdTypes: ["single"],
        title: "They found the loophole: adults disagree",
        body: "They ask one parent, then the other, then act shocked when answers differ. Co-parenting this year is about fast alignment and not making your kid the messenger.",
        choices: [
          {
            id: "practice",
            label: "Quick co-parent alignment texts",
            deltas: { discipline: 0.3, empathy: 0.3, confidence: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.7,
            logLine: "You keep messages short, factual, and kid-free. Fewer power struggles. More stability."
          },
          {
            id: "simple",
            label: "Let natural consequences teach",
            deltas: { confidence: 0.2, empathy: 0.1, discipline: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            logLine: "You don’t chase every inconsistency. They learn quickly that strategy doesn’t always win."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      },

      {
        minAge: 14,
        maxAge: 18,
        householdTypes: ["single"],
        title: "Curfews across two roofs",
        body: "Independence ramps up: friends, rides, dating, jobs, and ‘I’ll be home soon’ texts that mean nothing. Co-parenting this year is about shared expectations and fewer mixed signals.",
        choices: [
          {
            id: "practice",
            label: "Shared expectations (even if houses differ)",
            deltas: { discipline: 0.3, confidence: 0.2, empathy: 0.1, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0.8,
            logLine: "You align on curfew ranges, safety rules, and consequences. Less triangulation, more trust."
          },
          {
            id: "simple",
            label: "Agree on safety, vary on style",
            deltas: { confidence: 0.3, empathy: 0.1, discipline: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You accept different styles but keep safety consistent. Your teen still complains. That’s how you know it’s working."
          },
          {
            id: "skip",
            label: "Skip this year",
            deltas: {},
            loveDelta: 0,
            stressDelta: 0,
            logLine: null
          }
        ]
      }
    ]
  },

  pack_modern_parenting_v1: {
    packId: "pack_modern_parenting_v1",
    packName: "Modern Parenting (Devices, Social, AI)",
    emoji: "📲",
    ageBands: [
      {
        minAge: 0,
        maxAge: 2,
        title: "The first digital footprint",
        body: "Before they can talk, tech is already around: baby monitors, family photos, scrolling during feeds. How intentional do you want to be this year?",
        choices: [
          {
            id: "practice",
            label: "Keep it private + intentional",
            deltas: { discipline: 0.2, empathy: 0.1, confidence: 0, intelligence: 0.1 },
            loveDelta: 0.2,
            stressDelta: 0.3,
            logLine: "You keep sharing small and private, and you practice being present in the quiet moments."
          },
          {
            id: "simple",
            label: "Go with the flow",
            deltas: { confidence: 0.1, discipline: 0, empathy: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 3,
        maxAge: 5,
        title: "Screens are becoming tempting",
        body: "Autoplay, tablets in public, video calls — screens can be helpful or habit-forming. What approach do you set?",
        choices: [
          {
            id: "practice",
            label: "Make a simple screen routine",
            deltas: { discipline: 0.3, empathy: 0.1, confidence: 0, intelligence: 0.1 },
            loveDelta: 0.2,
            stressDelta: 0.4,
            logLine: "You set predictable limits and use screens with intention. Fewer fights, more calm."
          },
          {
            id: "simple",
            label: "Use screens when needed",
            deltas: { confidence: 0.1, discipline: 0, empathy: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 6,
        maxAge: 7,
        title: "First tech culture moments",
        body: "School talk, friends’ tablets, and 'everyone watches this.' This is where your family norms start to matter.",
        choices: [
          {
            id: "practice",
            label: "Set family norms early",
            deltas: { discipline: 0.3, intelligence: 0.1, empathy: 0.1, confidence: 0 },
            loveDelta: 0.2,
            stressDelta: 0.3,
            logLine: "You set clear norms: come-to-me-first, no secrets online, and calm endings."
          },
          {
            id: "simple",
            label: "Stay flexible",
            deltas: { confidence: 0.2, discipline: 0, empathy: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 8,
        maxAge: 12,
        title: "The digital world is sneaking in",
        body: "Group chats, screenshots, online friends. This is new territory. How do you approach it?",
        choices: [
          {
            id: "practice",
            label: "Build digital rules",
            deltas: { discipline: 0.3, intelligence: 0.1, empathy: 0, confidence: 0 },
            loveDelta: 0,
            stressDelta: 0.5,
            logLine: "You create a 'come to me first' rule. They roll their eyes, then actually use it once."
          },
          {
            id: "simple",
            label: "Monitor loosely",
            deltas: { confidence: 0.1, discipline: 0, empathy: 0, intelligence: 0 },
            loveDelta: 0.1,
            stressDelta: 0,
            logLine: null
          }
        ]
      },
      {
        minAge: 13,
        maxAge: 18,
        title: "They're fully digital natives now",
        body: "AI at school, influencer pressure, screenshots that live forever. How do you help them navigate it?",
        choices: [
          {
            id: "practice",
            label: "Talk about digital safety",
            deltas: { intelligence: 0.2, empathy: 0.2, discipline: 0.1, confidence: 0 },
            loveDelta: 0.3,
            stressDelta: 0.5,
            logLine: "You have awkward but real conversations about privacy, consent, and digital permanence."
          },
          {
            id: "simple",
            label: "Trust their judgment",
            deltas: { confidence: 0.2, empathy: 0, discipline: 0, intelligence: 0 },
            loveDelta: 0.2,
            stressDelta: -0.2,
            logLine: "You give them space to make mistakes. Mostly, they're smarter than you feared."
          }
        ]
      }
    ]
  },

  ss_rural_isolation_v1: {
    packId: "ss_rural_isolation_v1",
    packName: "Rural Isolation",
    emoji: "🌾",
    specialStartIds: ["rural_isolation"],
    ageBands: [
      {
        id: "rural_early",
        minAge: 1,
        maxAge: 6,
        chance: 0.85,
        title: "🌾 The Long Drive",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const mins = m.distanceMinutes ?? 25;
          return `Errands aren’t quick here. A “small trip” is a ${mins}-minute drive each way—and your whole day has to be planned around it.`;
        },
        choices: [
          { id: "practice", label: "Plan ahead (lists + backup supplies)", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🌾 You turned distance into a system." },
          { id: "simple", label: "Lean on the community (carpool / pickup)", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.05, logLine: "🌾 You leaned on people, not willpower." },
          { id: "avoid", label: "Wing it", deltas: { discipline: -0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🌾 The day got away from you." }
        ]
      },
      {
        id: "rural_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🤝 Everyone Knows Everyone",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const t = m.communityTightness || "medium";
          return `The community is tight (${t}). That can mean support… or gossip. Your child learns quickly that privacy works differently here.`;
        },
        choices: [
          { id: "practice", label: "Teach boundaries + reputation skills", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🤝 You taught ‘small town literacy.’" },
          { id: "simple", label: "Lean into community support", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.05, logLine: "🤝 You accepted help." },
          { id: "avoid", label: "Fight the town (constant friction)", deltas: { empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🤝 The town felt like an enemy." }
        ]
      },
      {
        id: "rural_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.9,
        title: "🚗 Independence Is Distance",
        body: () => "In rural life, independence is transportation. If they can’t get there, they can’t be there.",
        choices: [
          { id: "practice", label: "Build an independence plan (rides, skills, budgeting)", deltas: { responsibility: 0.2, confidence: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🚗 You built independence with realism." },
          { id: "simple", label: "Coordinate rides and make it work", deltas: { empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.2, logLine: "🚗 You carried the logistics." },
          { id: "avoid", label: "Say no more often (limited access)", deltas: { confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.1, logLine: "🚗 Opportunities shrank." }
        ]
      }
    ]
  },

  ss_tiny_apartment_city_v1: {
    packId: "ss_tiny_apartment_city_v1",
    packName: "Tiny Apartment City Life",
    emoji: "🏙️",
    specialStartIds: ["tiny_apartment_city"],
    ageBands: [
      {
        id: "city_early",
        minAge: 1,
        maxAge: 6,
        chance: 0.85,
        title: "🔊 Thin Walls",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const n = m.neighborNoise || "medium";
          return `The walls are thin and the neighbors are loud (${n}). Sleep routines take creativity—and diplomacy.`;
        },
        choices: [
          { id: "practice", label: "Build a sound routine (white noise + calm script)", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🔊 You built a sustainable routine." },
          { id: "simple", label: "Accept imperfection and prioritize connection", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🔊 You chose calm over control." },
          { id: "avoid", label: "Start fights with neighbors", deltas: { empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🔊 The building got tense." }
        ]
      },
      {
        id: "city_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🚇 City Independence",
        body: () => "The city offers freedom earlier—walking, transit, crowds. It’s empowering and scary at the same time.",
        choices: [
          { id: "practice", label: "Teach safety skills + routes + check-ins", deltas: { confidence: 0.2, discipline: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🚇 You trained skills, not fear." },
          { id: "simple", label: "Supervise closely", deltas: { empathy: 0.1 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🚇 You stayed near." },
          { id: "avoid", label: "Ignore the topic", deltas: { discipline: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🚇 Risk stayed unspoken." }
        ]
      },
      {
        id: "city_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.9,
        title: "🔑 Key, Curfew, Trust",
        body: () => "Privacy is scarce at home, so “out” becomes the teen bedroom. Trust has to be explicit—or it becomes a fight.",
        choices: [
          { id: "practice", label: "Co-design boundaries (curfew + safety + autonomy)", deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🔑 You made rules feel fair." },
          { id: "simple", label: "Strict curfew (safer, more conflict)", deltas: { discipline: 0.2, confidence: -0.1 }, loveDelta: 0, stressDelta: 0.15, logLine: "🔑 Safety rose; resentment did too." },
          { id: "avoid", label: "No structure at all", deltas: { discipline: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🔑 Chaos became the boundary." }
        ]
      }
    ]
  },

  ss_single_parent_household_v1: {
    packId: "ss_single_parent_household_v1",
    packName: "Single Parent Household",
    emoji: "🧍",
    specialStartIds: ["single_parent_household"],
    ageBands: [
      {
        id: "single_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🗓️ Backup Plan",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const net = m.supportNetwork || "none";
          return `When it’s just you, a “small emergency” can derail everything. Your support network is ${net}. What do you build first?`;
        },
        choices: [
          { id: "practice", label: "Build a real backup list (2–3 reliable people)", deltas: { discipline: 0.2, empathy: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🗓️ You built real backup." },
          { id: "simple", label: "Pay for reliability when you can (sitter / service)", deltas: { confidence: 0.1 }, loveDelta: 0, stressDelta: 0.15, logLine: "🗓️ You bought stability where possible." },
          { id: "avoid", label: "Just push through alone", deltas: { confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.25, logLine: "🗓️ You carried everything—again." }
        ]
      },
      {
        id: "single_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🎒 Two Places at Once",
        body: () => "School events, work, errands, and parenting collide. Someone always wants you somewhere else.",
        choices: [
          { id: "practice", label: "Choose priorities and say ‘no’ cleanly", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🎒 You protected your bandwidth." },
          { id: "simple", label: "Try to do it all", deltas: { empathy: 0.1 }, loveDelta: 0.05, stressDelta: 0.2, logLine: "🎒 You overextended, but showed up." },
          { id: "avoid", label: "Let it stay reactive", deltas: { discipline: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🎒 Life felt reactive." }
        ]
      },
      {
        id: "single_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "💬 The Real Talk",
        body: () => "As they get older, they notice stress and money. The question is how much adult truth they carry.",
        choices: [
          { id: "practice", label: "Honest + age-appropriate (no dumping)", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "💬 You shared truth safely." },
          { id: "simple", label: "Keep it light and reassuring", deltas: { empathy: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "💬 You shielded them." },
          { id: "avoid", label: "Dump stress on them", deltas: { confidence: -0.1, empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "💬 The kid carried adult weight." }
        ]
      }
    ]
  },

  ss_blended_family_v1: {
    packId: "ss_blended_family_v1",
    packName: "Blended Family",
    emoji: "👨‍👩‍👧‍👦",
    specialStartIds: ["blended_family"],
    ageBands: [
      {
        id: "blend_early",
        minAge: 2,
        maxAge: 6,
        chance: 0.9,
        title: "🧩 New House Rules",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const sibs = m.stepSiblingCount ?? 1;
          const lvl = m.conflictLevel || "medium";
          return `You’re merging routines with ${sibs} step-sibling(s). Conflict level feels ${lvl}. The rules you choose now set the tone.`;
        },
        choices: [
          { id: "practice", label: "Family meeting + simple shared rules", deltas: { discipline: 0.2, empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🧩 You built shared structure." },
          { id: "simple", label: "Separate spaces, fewer fights", deltas: { empathy: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🧩 You reduced friction with distance." },
          { id: "avoid", label: "Force ‘one family’ instantly", deltas: { empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🧩 The push created backlash." }
        ]
      },
      {
        id: "blend_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🧑‍🤝‍🧑 Loyalty Split",
        body: () => "Your child gets pulled between adults and siblings. They test where they belong.",
        choices: [
          { id: "practice", label: "Validate feelings + keep them out of adult conflict", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🧑‍🤝‍🧑 You protected the kid from adult tension." },
          { id: "simple", label: "Hold routine steady", deltas: { discipline: 0.2 }, loveDelta: 0, stressDelta: 0.1, logLine: "🧑‍🤝‍🧑 Routine held the center." },
          { id: "avoid", label: "Make them ‘choose a side’", deltas: { empathy: -0.2, confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🧑‍🤝‍🧑 Belonging got weaponized." }
        ]
      },
      {
        id: "blend_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🎓 Big Moments, Many Adults",
        body: () => "Milestones arrive. So do complicated seating charts—who gets invited, who gets credit, and who gets hurt.",
        choices: [
          { id: "practice", label: "Plan fairness with the teen’s input", deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🎓 You made the teen the center." },
          { id: "simple", label: "Keep it small", deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🎓 Smaller meant safer." },
          { id: "avoid", label: "Let adults fight it out", deltas: { empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🎓 The teen watched adults act small." }
        ]
      }
    ]
  },

  ss_first_gen_immigrant_v1: {
    packId: "ss_first_gen_immigrant_v1",
    packName: "First-Generation Immigrant",
    emoji: "🧳",
    specialStartIds: ["first_gen_immigrant"],
    ageBands: [
      {
        id: "imm_early",
        minAge: 1,
        maxAge: 6,
        chance: 0.9,
        title: "🗣️ Language at Home",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const lb = m.languageBarrier || "medium";
          return `You’re building a life in a new country. The language barrier is ${lb}. Home becomes the place your child learns how to translate worlds.`;
        },
        choices: [
          { id: "practice", label: "Keep heritage language alive (daily rituals)", deltas: { curiosity: 0.2, confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🗣️ You built bilingual routines." },
          { id: "simple", label: "Focus on the new language for ease", deltas: { confidence: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🗣️ You prioritized survival and simplicity." },
          { id: "avoid", label: "Turn language into a battleground", deltas: { empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🗣️ Language became stress." }
        ]
      },
      {
        id: "imm_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 ‘Where Are You From?’",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const cp = m.communityPresence || "medium";
          return `Identity questions show up at school. Your community presence is ${cp}. Your child learns whether difference is safe to show.`;
        },
        choices: [
          { id: "practice", label: "Teach pride + scripts + support", deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🏫 You built identity armor without hardness." },
          { id: "simple", label: "Keep your head down for now", deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🏫 You chose quiet safety." },
          { id: "avoid", label: "Dismiss their feelings", deltas: { empathy: -0.1, confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🏫 They felt alone with it." }
        ]
      },
      {
        id: "imm_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🌍 Future Plans",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const cr = !!m.credentialsRecognized;
          return `Your teen thinks about adulthood. Your credentials were ${cr ? "recognized" : "not recognized"} here—so ambition comes with realism and sometimes fear.`;
        },
        choices: [
          { id: "practice", label: "Explore paths + mentorship", deltas: { confidence: 0.2, knowledge: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🌍 You turned uncertainty into planning." },
          { id: "simple", label: "Encourage without a plan", deltas: { confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🌍 You gave hope." },
          { id: "avoid", label: "Shut down dreams (‘too risky’)", deltas: { confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.15, logLine: "🌍 The future felt smaller." }
        ]
      }
    ]
  },

  ss_two_working_parents_childcare_v1: {
    packId: "ss_two_working_parents_childcare_v1",
    packName: "Two Working Parents + Childcare",
    emoji: "🧷",
    specialStartIds: ["two_working_parents_childcare"],
    ageBands: [
      {
        id: "work_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.9,
        title: "🧷 Childcare Shuffle",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const plan = m.childcarePlan || "daycare";
          const wl = m.waitlistLuck || "mixed";
          return `Your whole week is a relay race. Childcare plan: ${plan}. Waitlist luck: ${wl}. When one link breaks, everything breaks.`;
        },
        choices: [
          { id: "practice", label: "Create redundancies (backup sitter / swaps)", deltas: { discipline: 0.2 }, loveDelta: 0, stressDelta: 0.15, logLine: "🧷 You built a backup system." },
          { id: "simple", label: "Just keep sprinting", deltas: { confidence: 0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🧷 You powered through." },
          { id: "avoid", label: "Let it stay chaotic", deltas: { discipline: -0.1 }, loveDelta: -0.05, stressDelta: 0.25, logLine: "🧷 Chaos became the routine." }
        ]
      },
      {
        id: "work_mid",
        minAge: 6,
        maxAge: 12,
        chance: 0.85,
        title: "📅 Calendar Wars",
        body: () => "School events, sick days, work deadlines. The calendar isn’t scheduling—it’s values.",
        choices: [
          { id: "practice", label: "Weekly planning ritual (family sync)", deltas: { discipline: 0.2, empathy: 0.1 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "📅 You planned like a team." },
          { id: "simple", label: "One parent carries it (temporary)", deltas: { empathy: 0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "📅 Someone carried the load." },
          { id: "avoid", label: "No planning", deltas: { discipline: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "📅 Surprises ran the year." }
        ]
      },
      {
        id: "work_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🕒 Time Is the Currency",
        body: () => "Teens don’t just want money. They want time, attention, and reliability. Can you buy back any of it?",
        choices: [
          { id: "practice", label: "Protect recurring ‘us time’ (non-negotiable)", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🕒 You protected connection with structure." },
          { id: "simple", label: "Compensate with flexibility and small treats", deltas: { confidence: 0.1 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🕒 You tried to balance the scales." },
          { id: "avoid", label: "Assume they’ll understand later", deltas: { confidence: -0.1 }, loveDelta: -0.05, stressDelta: 0.15, logLine: "🕒 Distance grew quietly." }
        ]
      }
    ]
  },

  ss_eldercare_shared_v1: {
    packId: "ss_eldercare_shared_v1",
    packName: "Eldercare Shared",
    emoji: "🧓🤝",
    specialStartIds: ["eldercare_shared"],
    ageBands: [
      {
        id: "elder_early",
        minAge: 1,
        maxAge: 6,
        chance: 0.85,
        title: "🧓 In the Background",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const dist = m.distance || "nearby";
          const helps = !!m.grandparentHelps;
          return `An older relative is part of daily life (${dist}). They ${helps ? "sometimes help" : "often need help"}. Your child watches how you do care.`;
        },
        choices: [
          { id: "practice", label: "Explain care in kid-sized ways", deltas: { empathy: 0.2, responsibility: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🧓 You taught empathy without fear." },
          { id: "simple", label: "Keep it practical and quiet", deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🧓 You kept the house running." },
          { id: "avoid", label: "Let resentment leak", deltas: { empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🧓 Stress spilled into the home." }
        ]
      },
      {
        id: "elder_mid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "🏥 Appointment Day",
        body: (age, gs) => {
          const m = gs?.specialStartMeta || {};
          const hp = m.healthPattern || "fluctuating";
          return `Caregiving routines eat time: appointments, paperwork, small emergencies. Health pattern: ${hp}. Your child notices what gets sacrificed.`;
        },
        choices: [
          { id: "practice", label: "Build a team (services + family help)", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0, stressDelta: 0.15, logLine: "🏥 You built support." },
          { id: "simple", label: "Do it yourself for now", deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🏥 You carried it alone." },
          { id: "avoid", label: "Ignore it until crisis", deltas: { discipline: -0.1 }, loveDelta: -0.05, stressDelta: 0.25, logLine: "🏥 The crisis arrived anyway." }
        ]
      },
      {
        id: "elder_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🧺 Boundaries",
        body: () => "Teens may help—or resist helping. The key is responsibility without stealing their childhood.",
        choices: [
          { id: "practice", label: "Age-appropriate tasks + clear boundaries", deltas: { responsibility: 0.2, empathy: 0.2 }, loveDelta: 0.05, stressDelta: 0.15, logLine: "🧺 You taught care without guilt." },
          { id: "simple", label: "Protect them; you handle it", deltas: { empathy: 0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🧺 You shielded them—at a cost to you." },
          { id: "avoid", label: "Guilt them into caregiving", deltas: { confidence: -0.1, empathy: -0.1 }, loveDelta: -0.05, stressDelta: 0.2, logLine: "🧺 Help happened, but so did resentment." }
        ]
      }
    ]
  },

  ss_grief_year_v1: {
    packId: "ss_grief_year_v1",
    packName: "The Grief Year",
    emoji: "🕯️",
    specialStartIds: ["grief_year"],
    ageBands: [
      {
        id: "gy_0_1",
        minAge: 0,
        maxAge: 1,
        chance: 1,
        title: "A house that feels different",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `You are grieving. Even if you try to hide it, the air feels heavier.\n\n${c} is little, but they still sense when love is tired. What do you lean on this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Accept help and keep gentle routines (one day at a time)",
            deltas: { empathy: 0.3, discipline: 0.2, confidence: 0.1 },
            loveDelta: 0.3,
            stressDelta: 0.5,
            logLine: "You let people support you and kept home emotionally safe."
          },
          {
            id: "simple",
            label: "Stay busy and focus on tasks to get through the days",
            deltas: { discipline: 0.2, empathy: -0.1 },
            loveDelta: 0.1,
            stressDelta: 0.4,
            logLine: "You survived by staying in motion."
          },
          {
            id: "avoid",
            label: "Shut down emotionally and try not to feel it",
            deltas: { empathy: -0.3, confidence: -0.2 },
            loveDelta: -0.1,
            stressDelta: 0.7,
            logLine: "The feelings didn't disappear—they just got lonelier."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "gy_2_6",
        minAge: 2,
        maxAge: 6,
        chance: 0.75,
        title: "Questions you can't fully answer",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          const anniversary = (age === 5) ? "\n\nThis year, the anniversary hits hard." : "";
          return `${c} asks questions that land like stones: where did they go, will they come back, why are you sad?${anniversary}\n\nHow do you respond?`;
        },
        choices: [
          {
            id: "practice",
            label: "Answer simply and honestly + create a small remembrance ritual",
            deltas: { empathy: 0.4, confidence: 0.2 },
            loveDelta: 0.3,
            stressDelta: 0.3,
            logLine: "You made room for grief without making it terrifying."
          },
          {
            id: "simple",
            label: "Keep it brief and redirect to comfort and routine",
            deltas: { empathy: 0.2, discipline: 0.1 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You protected their nervous system with routine."
          },
          {
            id: "avoid",
            label: "Avoid the topic and shut questions down",
            deltas: { empathy: -0.2, confidence: -0.2 },
            loveDelta: -0.1,
            stressDelta: 0.5,
            logLine: "They learned grief was something to hide."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "gy_7_12",
        minAge: 7,
        maxAge: 12,
        chance: 0.55,
        title: "Grief shows up sideways",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          const ann = (age === 10) ? "\n\nA big anniversary year makes everything feel louder." : "";
          return `${c} might not cry. They might get irritable, clingy, or suddenly "fine."${ann}\n\nHow do you support them this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Invite expression (art, stories, talks) and keep steady boundaries",
            deltas: { empathy: 0.3, intelligence: 0.2, confidence: 0.2 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You made space for feelings without losing structure."
          },
          {
            id: "simple",
            label: "Keep routine strong and check in at bedtime",
            deltas: { discipline: 0.2, empathy: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.1,
            logLine: "You kept the floor stable under their feet."
          },
          {
            id: "avoid",
            label: "Act like nothing happened and push them to 'move on'",
            deltas: { empathy: -0.1, confidence: -0.1 },
            loveDelta: -0.1,
            stressDelta: 0.4,
            logLine: "They felt unseen in an invisible struggle."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "gy_13_18",
        minAge: 13,
        maxAge: 18,
        chance: 0.45,
        title: "Teen grief and independence",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `Teens often grieve in private—or through risk, anger, or detachment.\n\n${c} needs both freedom and steady guardrails. What do you do this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Hold kind boundaries + offer counseling/support without forcing it",
            deltas: { empathy: 0.3, discipline: 0.2, confidence: 0.2 },
            loveDelta: 0.1,
            stressDelta: 0.3,
            moneyDelta: -80,
            logLine: "You stayed close without controlling them."
          },
          {
            id: "simple",
            label: "Give more space but keep regular check-ins",
            deltas: { confidence: 0.2, discipline: 0.1 },
            loveDelta: 0,
            stressDelta: 0.2,
            logLine: "You respected independence while staying present."
          },
          {
            id: "avoid",
            label: "Clamp down with harsh rules to feel in control",
            deltas: { discipline: 0.2, empathy: -0.2, confidence: -0.2 },
            loveDelta: -0.1,
            stressDelta: 0.5,
            logLine: "Control reduced trust and increased secrecy."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      }
    ]
  },

  ss_after_disaster_v1: {
    packId: "ss_after_disaster_v1",
    packName: "After the Disaster",
    emoji: "🏚️",
    specialStartIds: ["disaster_rebuild"],
    ageBands: [
      {
        id: "ad_0_2",
        minAge: 0,
        maxAge: 2,
        chance: 1,
        title: "Temporary home, tiny routines",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `Everything is different: where you sleep, what you own, how you spend a day.\n\n${c} is young, but they still crave predictability. What do you prioritize this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Build a 'tiny routine' that stays the same no matter where you are",
            deltas: { discipline: 0.3, empathy: 0.3, confidence: 0.2 },
            loveDelta: 0.3,
            stressDelta: 0.4,
            logLine: "You created small routines that made life feel safer."
          },
          {
            id: "simple",
            label: "Focus on safety and basics first; routines can come later",
            deltas: { discipline: 0.1, confidence: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            logLine: "You kept the essentials steady."
          },
          {
            id: "avoid",
            label: "Let the year run on chaos and adrenaline",
            deltas: { discipline: -0.2, confidence: -0.2 },
            loveDelta: 0,
            stressDelta: 0.6,
            logLine: "The lack of structure made everything harder."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "ad_3_6",
        minAge: 3,
        maxAge: 6,
        chance: 0.85,
        title: "Calls, forms, and rebuild decisions",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `Rebuilding is paperwork, phone calls, and waiting. You're juggling it alongside parenting.\n\n${c} watches how you handle overwhelm. What's your approach?`;
        },
        choices: [
          {
            id: "practice",
            label: "Block one hour a week for rebuild tasks + ask for help proactively",
            deltas: { discipline: 0.3, intelligence: 0.2 },
            loveDelta: 0.1,
            stressDelta: 0.4,
            moneyDelta: 100,
            logLine: "You built a steady system for rebuild tasks."
          },
          {
            id: "simple",
            label: "Handle it in short bursts whenever you can",
            deltas: { discipline: 0.1 },
            loveDelta: 0,
            stressDelta: 0.3,
            moneyDelta: 50,
            logLine: "You kept it moving, even if it was messy."
          },
          {
            id: "avoid",
            label: "Avoid it because it's too overwhelming",
            deltas: { discipline: -0.2, confidence: -0.1 },
            loveDelta: 0,
            stressDelta: 0.7,
            moneyDelta: -120,
            logLine: "Avoidance cost you time and money."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "ad_7_12",
        minAge: 7,
        maxAge: 12,
        chance: 0.6,
        title: "Stormy weather, big feelings",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `Bad weather hits differently now. ${c} gets tense when the sky changes.\n\nYou can't promise nothing will happen again—but you can teach safety and calm.`;
        },
        choices: [
          {
            id: "practice",
            label: "Make a safety plan + practice calming skills together",
            deltas: { empathy: 0.3, confidence: 0.3, discipline: 0.2 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            logLine: "You turned fear into preparation and coping."
          },
          {
            id: "simple",
            label: "Reassure them and distract when anxiety spikes",
            deltas: { confidence: 0.2 },
            loveDelta: 0.1,
            stressDelta: 0.1,
            logLine: "You soothed the moment and kept moving."
          },
          {
            id: "avoid",
            label: "Tell them to toughen up and stop worrying",
            deltas: { empathy: -0.2, confidence: -0.2 },
            loveDelta: -0.1,
            stressDelta: 0.4,
            logLine: "They learned to hide fear instead of managing it."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "ad_13_18",
        minAge: 13,
        maxAge: 18,
        chance: 0.45,
        title: "Rebuilding the community",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `${c} is old enough to see the bigger picture: neighbors helping neighbors, systems failing, and people adapting.\n\nDo you encourage them to get involved?`;
        },
        choices: [
          {
            id: "practice",
            label: "Support volunteering with guardrails + connect them to mentors",
            deltas: { empathy: 0.3, confidence: 0.3, intelligence: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            logLine: "They found purpose and community through helping."
          },
          {
            id: "simple",
            label: "Keep it smaller: focus on helping at home and school",
            deltas: { discipline: 0.2, confidence: 0.2 },
            loveDelta: 0,
            stressDelta: 0.1,
            logLine: "They contributed in quiet, practical ways."
          },
          {
            id: "avoid",
            label: "Keep them away from it; only school matters",
            deltas: { discipline: 0.2, empathy: -0.1, confidence: -0.1 },
            loveDelta: -0.1,
            stressDelta: 0.3,
            logLine: "They felt shut out of something meaningful."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      }
    ]
  },

  ss_food_insecurity_paperwork_v1: {
    packId: "ss_food_insecurity_paperwork_v1",
    packName: "Food Insecurity + Paperwork",
    emoji: "🥫🧾",
    specialStartIds: ["food_insecurity"],
    ageBands: [
      {
        id: "fi_0_2",
        minAge: 0,
        maxAge: 2,
        chance: 1,
        title: "The paperwork pile",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `A letter arrives about benefits and required documents. You're tired, and time is thin.\n\n${c} doesn't understand the forms, but they feel your stress. How do you handle the system this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Make a simple binder + checklist and tackle it calmly",
            deltas: { discipline: 0.4, intelligence: 0.2, empathy: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.5,
            moneyDelta: 60,
            logLine: "You built a simple system for paperwork and kept it calm around your child."
          },
          {
            id: "simple",
            label: "Ask a caseworker/community org to help you submit everything",
            deltas: { empathy: 0.3, confidence: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            moneyDelta: 40,
            logLine: "You asked for help and got the forms submitted."
          },
          {
            id: "avoid",
            label: "Put it off until the last minute",
            deltas: { discipline: -0.2, confidence: -0.1 },
            loveDelta: 0,
            stressDelta: 0.7,
            moneyDelta: -90,
            logLine: "Deadlines slipped. The stress got worse."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "fi_3_5",
        minAge: 3,
        maxAge: 5,
        chance: 1,
        title: "Snack math",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `${c} starts noticing who has snacks, who gets treats, and who doesn't.\n\nYou're trying to protect their dignity without pretending money isn't real. What's your approach?`;
        },
        choices: [
          {
            id: "practice",
            label: "Normalize it: needs first, simple treats sometimes, no shame talk",
            deltas: { empathy: 0.3, discipline: 0.2, confidence: 0.1 },
            loveDelta: 0.3,
            stressDelta: 0.2,
            moneyDelta: -20,
            logLine: "You made it about dignity and needs—not shame."
          },
          {
            id: "simple",
            label: "Lean on free resources quietly (school programs, pantry, neighbors)",
            deltas: { discipline: 0.2, intelligence: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.1,
            moneyDelta: 30,
            logLine: "You used available resources without making it a big issue."
          },
          {
            id: "avoid",
            label: "Avoid social food situations to save money",
            deltas: { confidence: -0.2, empathy: -0.1 },
            loveDelta: -0.1,
            stressDelta: 0.4,
            moneyDelta: 20,
            logLine: "You saved money, but your child felt the distance."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "fi_6_10",
        minAge: 6,
        maxAge: 10,
        chance: 1,
        title: "School meal forms",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `A new school year means new forms. Free/reduced meals can help a lot, but kids can be cruel.\n\nHow do you support ${c} through it?`;
        },
        choices: [
          {
            id: "practice",
            label: "Fill forms early + coach privacy and self-respect",
            deltas: { discipline: 0.3, empathy: 0.2, confidence: 0.1 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            moneyDelta: 80,
            logLine: "You handled the support system early and protected your child's dignity."
          },
          {
            id: "simple",
            label: "Use the program quietly and focus on routine at home",
            deltas: { confidence: 0.1, empathy: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.1,
            moneyDelta: 60,
            logLine: "You kept things low-drama and steady."
          },
          {
            id: "avoid",
            label: "Decline help out of pride",
            deltas: { confidence: -0.1, empathy: -0.1 },
            loveDelta: 0,
            stressDelta: 0.6,
            moneyDelta: -120,
            logLine: "You tried to carry it alone. It got harder."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "fi_11_14",
        minAge: 11,
        maxAge: 14,
        chance: 1,
        title: "Growth spurt grocery stretch",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `${c} is growing fast. Food disappears. They can tell when you're doing math in your head.\n\nHow do you navigate this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Plan meals together and teach simple budgeting (without panic)",
            deltas: { intelligence: 0.2, discipline: 0.2, empathy: 0.2, confidence: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            moneyDelta: 40,
            logLine: "You turned scarcity into skills without dumping fear onto your child."
          },
          {
            id: "simple",
            label: "Do your best day-by-day and keep meals predictable",
            deltas: { discipline: 0.1, confidence: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.3,
            moneyDelta: 10,
            logLine: "You kept things predictable even when it was tight."
          },
          {
            id: "avoid",
            label: "Hide everything and refuse to talk about it",
            deltas: { empathy: -0.1, confidence: -0.1 },
            loveDelta: -0.1,
            stressDelta: 0.4,
            moneyDelta: 0,
            logLine: "Silence made it feel scarier."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      },
      {
        id: "fi_15_18",
        minAge: 15,
        maxAge: 18,
        chance: 1,
        title: "Forms, jobs, and next steps",
        body: (age, gs) => {
          const c = gs.childName || "your child";
          return `${c} is old enough to understand: systems decide a lot.\n\nAid forms, part-time work, and planning the next step can either build hope—or build bitterness. What do you do this year?`;
        },
        choices: [
          {
            id: "practice",
            label: "Do the forms together and practice asking for help without shame",
            deltas: { intelligence: 0.3, confidence: 0.3, empathy: 0.1 },
            loveDelta: 0.1,
            stressDelta: 0.3,
            moneyDelta: 120,
            logLine: "You treated paperwork like a life skill, not a humiliation ritual."
          },
          {
            id: "simple",
            label: "Encourage a part-time job while keeping school protected",
            deltas: { discipline: 0.3, confidence: 0.2 },
            loveDelta: 0,
            stressDelta: 0.2,
            moneyDelta: 80,
            logLine: "They earned a little money and a lot of pride."
          },
          {
            id: "avoid",
            label: "Tell them to figure it out alone",
            deltas: { confidence: -0.3, empathy: -0.1 },
            loveDelta: -0.1,
            stressDelta: 0.4,
            moneyDelta: 0,
            logLine: "They felt alone right when it mattered most."
          },
          { id: "skip", label: "Skip this check-in" }
        ]
      }
    ]
  },

  ss_alien_invasion_training_v1: {
    packId: "ss_alien_invasion_training_v1",
    packName: "Alien Training Protocol",
    emoji: "👽",
    specialStartIds: ["alien_invasion"],
    ageBands: [
      {
        id: "alien_train_all",
        minAge: 1,
        maxAge: 18,
        chance: 1.0,
        title: "👽 Training Protocol",
        variants: [
          {
            title: "🩺 Medicine Training",
            body: "The compound medic teaches basic first aid and field medicine. Your child is learning survival skills most kids will never need.",
            choices: [
              { id: "commit", label: "Full training (practical life skill)", deltas: { intelligence: 0.3, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🩺 They learned field medicine.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+8)})) },
              { id: "light", label: "Basic first aid only", deltas: { intelligence: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🩺 They learned the basics.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+4)})) },
              { id: "skip", label: "Skip (too intense for their age)", deltas: { empathy: 0.1 }, loveDelta: 0.05, stressDelta: 0.05, logLine: "🩺 You protected their innocence." }
            ]
          },
          {
            title: "🤫 Stealth Training",
            body: "Movement drills, hiding protocols, and silent signaling. It's like a game—except it's not.",
            choices: [
              { id: "serious", label: "Teach it seriously (survival first)", deltas: { discipline: 0.3, confidence: 0.2 }, loveDelta: 0.05, stressDelta: 0.2, logLine: "🤫 They learned stealth discipline.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+7)})) },
              { id: "game", label: "Make it a game (less scary, still effective)", deltas: { confidence: 0.2, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🤫 You made training feel safer.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+5)})) },
              { id: "minimal", label: "Minimal practice (protect childhood)", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.05, logLine: "🤫 You chose gentleness.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+2)})) }
            ]
          },
          {
            title: "🔦 Weapons Safety",
            body: "Not combat—just safety protocols. How to handle equipment without hurting themselves or others.",
            choices: [
              { id: "full", label: "Full safety protocol training", deltas: { discipline: 0.3, intelligence: 0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "🔦 They learned weapon safety.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+6)})) },
              { id: "basic", label: "Basic awareness only", deltas: { intelligence: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🔦 You kept it age-appropriate.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+3)})) },
              { id: "skip", label: "Skip weapons entirely", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0, logLine: "🔦 You refused that part." }
            ]
          },
          {
            title: "🎖️ Leadership & Morale",
            body: "Teaching resilience, team cohesion, and how to stay calm when adults are scared. Your child is being trained to lead.",
            choices: [
              { id: "lead", label: "Develop leadership skills actively", deltas: { confidence: 0.4, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🎖️ They became a leader.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+9)})) },
              { id: "support", label: "Teach support role (care, not command)", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🎖️ They learned to support others.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+5)})) },
              { id: "child", label: "Let them be a child first", deltas: { empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0, logLine: "🎖️ You protected their spirit.", apply: ({updateState}) => updateState(prev => ({...prev, alienTraining: Math.min(100, (prev.alienTraining||0)+1)})) }
            ]
          }
        ]
      }
    ]
  },

  ss_military_relocation_micro_v1: {
    packId: "ss_military_relocation_micro_v1",
    packName: "Military Life Micro-Events",
    emoji: "🎖️",
    specialStartIds: ["military_relocation_cycle"],
    ageBands: [
      {
        id: "mil_micro_all",
        minAge: 1,
        maxAge: 18,
        chance: 0.35,
        title: "🎖️ Military Life",
        variants: [
          {
            title: "👋 New Base Friend",
            body: "Your child meets another military kid. They bond fast—because they both know nothing is permanent.",
            choices: [
              { id: "encourage", label: "Encourage the friendship (connection matters)", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "👋 They built a fast friendship.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+5) }) },
              { id: "guard", label: "Stay guarded ('friends are temporary')", deltas: { discipline: 0.2, confidence: -0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "👋 You taught emotional distance.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+2) }) },
              { id: "normal", label: "Treat it like a normal friendship", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.05, logLine: "👋 You kept it simple.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+3) }) }
            ]
          },
          {
            title: "📞 Deployment Call",
            body: "A parent is deployed. The phone calls are short. Your child learns to pack big feelings into small windows.",
            choices: [
              { id: "ritual", label: "Build a call ritual (consistent, comforting)", deltas: { discipline: 0.2, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "📞 You made distance manageable.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+6) }) },
              { id: "honest", label: "Stay honest about feelings (miss them, it's okay)", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "📞 You normalized the grief.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+4) }) },
              { id: "strong", label: "Stay strong and unemotional", deltas: { discipline: 0.2, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "📞 Feelings stayed buried.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+7) }) }
            ]
          },
          {
            title: "🗣️ Language Practice",
            body: "A local language is everywhere off-base. Learning it opens doors—or you stay in the American bubble.",
            choices: [
              { id: "learn", label: "Practice local language (connection + skill)", deltas: { intelligence: 0.3, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🗣️ They learned the local language.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+8) }) },
              { id: "basic", label: "Learn basics only", deltas: { intelligence: 0.2 }, loveDelta: 0.05, stressDelta: 0.05, logLine: "🗣️ They learned a few phrases.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+4) }) },
              { id: "bubble", label: "Stay in the English bubble", deltas: { discipline: 0.1 }, loveDelta: 0, stressDelta: 0.05, logLine: "🗣️ You stayed safe and familiar.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+1) }) }
            ]
          },
          {
            title: "🌍 'Where Are You From?'",
            body: "Kids ask where your child is 'from.' The answer is complicated: five bases, three countries, and home is a feeling, not a place.",
            choices: [
              { id: "pride", label: "Teach military kid pride ('I'm from everywhere')", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🌍 They owned their story.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+6) }) },
              { id: "pick", label: "Pick one place to simplify it", deltas: { confidence: 0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🌍 You simplified the narrative.", statePatch: (s) => ({ militaryAdaptation: Math.min(100, (s.militaryAdaptation||0)+2) }) },
              { id: "deflect", label: "Deflect the question", deltas: { confidence: -0.1 }, loveDelta: 0, stressDelta: 0.1, logLine: "🌍 Identity stayed blurry.", statePatch: (s) => ({ militaryAdaptation: Math.max(0, (s.militaryAdaptation||0)-1) }) }
            ]
          }
        ]
      }
    ]
  },

  ss_mafia_family_epilogue_v1: {
    packId: "ss_mafia_family_epilogue_v1",
    packName: "The Family Business",
    emoji: "🕴️",
    specialStartIds: ["mafia_family"],
    ageBands: [
      {
        id: "mafia_epilogue",
        minAge: 18,
        maxAge: 18,
        chance: 1.0,
        title: "🕴️ The Offer",
        body: "Age 18. The family sits down with your child. There's an offer on the table: take the business, or walk away clean. What did you raise them to choose?",
        choices: [
          {
            id: "inherit",
            label: "They inherit 'the family' (loyalty > everything)",
            deltas: { confidence: 0.3, discipline: 0.2, empathy: -0.3 },
            loveDelta: 0.1,
            stressDelta: 0.3,
            moneyDelta: 50000,
            logLine: "🕴️ They took the family business. The cycle continues.",
            statePatch: (s) => ({ mafiaLegacy: (s.mafiaLegacy||0)+20, mafiaSuccessor: true })
          },
          {
            id: "legit",
            label: "They go legit (empathy > loyalty)",
            deltas: { empathy: 0.4, confidence: 0.3 },
            loveDelta: 0.2,
            stressDelta: 0.2,
            moneyDelta: -10000,
            logLine: "🕊️ They walked away clean. You helped them escape.",
            statePatch: (s) => ({ mafiaLegacy: Math.max(0, (s.mafiaLegacy||0)-10), mafiaWentLegit: true })
          },
          {
            id: "negotiate", label: "They negotiate (one foot in, one foot out)",
            deltas: { intelligence: 0.3, confidence: 0.2 },
            loveDelta: 0.1,
            stressDelta: 0.2,
            moneyDelta: 20000,
            logLine: "🕴️ They carved a hybrid path. Complicated, but theirs.",
            statePatch: (s) => ({ mafiaLegacy: (s.mafiaLegacy||0)+5 })
          }
        ]
      }
    ]
  },

  ss_medieval_larp_town_v1: {
    packId: "ss_medieval_larp_town_v1",
    packName: "Medieval LARP Town",
    emoji: "⚔️",
    specialStartIds: ["medieval_larp_town"],
    ageBands: [
      {
        id: "mlt_toddler",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🛡️ Tiny Squire Era",
        variants: [
          {
            title: "🗡️ The Wooden Sword Incident",
            body: "Your toddler declares themself a knight and challenges the family broom to honorable combat. The broom does not consent.",
            choices: [
              { id:"practice", label:"Teach 'safe knight rules' (gentle hits, soft targets)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.12, logLine:"🗡️ You invented toddler chivalry." },
              { id:"simple", label:"Laugh and supervise closely", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.15, logLine:"🗡️ The broom survived. Barely." },
              { id:"avoid", label:"Ban sword play entirely", deltas:{ discipline:0.1, confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.18, logLine:"🗡️ Your knight became a tiny rebel." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🥖 Market Day Meltdown",
            body: "Market day is crowded. Your kid wants a pastry AND a crown AND a chicken that is not for sale.",
            choices: [
              { id:"practice", label:"Offer choices (pastry OR crown) + validate feelings", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.14, moneyDelta:-20, logLine:"🥖 You negotiated with a tiny monarch." },
              { id:"simple", label:"Buy the pastry and exit quickly", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.16, moneyDelta:-15, logLine:"🥖 Tactical retreat achieved." },
              { id:"avoid", label:"Snap in public (everyone hears)", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.22, logLine:"🥖 The crowd pretended not to listen. They listened." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mlt_kid",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🏰 Apprentice Years",
        variants: [
          {
            title: "📜 The Apprenticeship Choice",
            body: "Your child wants an official 'role' in town: baker, bard, healer, guard… or 'dragon.'",
            choices: [
              { id:"practice", label:"Let them choose (and commit lightly)", deltas:{ confidence:0.2, intelligence:0.1 }, loveDelta:0.1, stressDelta:0.12, logLine:"📜 You supported identity-building play." },
              { id:"simple", label:"Pick something practical for them", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.14, logLine:"📜 You chose structure over whim." },
              { id:"avoid", label:"Force a prestigious role", deltas:{ confidence:-0.2, empathy:-0.1 }, loveDelta:-0.05, stressDelta:0.18, logLine:"📜 They complied… loudly." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎭 Tourist Season",
            body: "Tourists arrive and treat the town like a theme park. Your child gets annoyed at being called 'cute.'",
            choices: [
              { id:"practice", label:"Teach boundaries + polite humor", deltas:{ confidence:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.12, logLine:"🎭 Your kid learned 'firm but kind'." },
              { id:"simple", label:"Ignore tourists and keep moving", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.14, logLine:"🎭 You chose peace through momentum." },
              { id:"avoid", label:"Start a scene", deltas:{ confidence:0.1, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.2, logLine:"🎭 The town got a new legend: You." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mlt_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🧑‍🎤 Teen: 'This Is Cringe'",
        variants: [
          {
            title: "🧢 The Modern Clothes Request",
            body: "Your teen wants to dress 'normal' sometimes. The council calls it 'an immersion violation.'",
            choices: [
              { id:"practice", label:"Back your teen and handle the drama", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.16, logLine:"🧢 You chose your kid over the vibe." },
              { id:"simple", label:"Compromise: modern clothes off-hours", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.14, logLine:"🧢 You negotiated a truce." },
              { id:"avoid", label:"Enforce immersion strictly", deltas:{ discipline:0.2, empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🧢 They stopped sharing feelings." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🏛️ Council Politics",
            body: "A petty feud erupts over 'authentic' bread flour. Somehow your family gets pulled in.",
            choices: [
              { id:"practice", label:"Stay neutral and de-escalate", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.12, logLine:"🏛️ You refused to join the Flour War." },
              { id:"simple", label:"Pick a side and move on", deltas:{ confidence:0.1 }, loveDelta:0.0, stressDelta:0.16, logLine:"🏛️ You gained allies. And enemies." },
              { id:"avoid", label:"Go scorched earth", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.22, logLine:"🏛️ Your saga now has villains." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_traveling_circus_v1: {
    packId: "ss_traveling_circus_v1",
    packName: "Traveling Circus Family",
    emoji: "🎪",
    specialStartIds: ["traveling_circus"],
    ageBands: [
      {
        id: "tc_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🎪 Life Under Canvas",
        variants: [
          {
            title: "😴 Nap Time vs Rehearsal",
            body: "Right when your toddler finally naps, the troupe starts practicing something loud and heroic.",
            choices: [
              { id:"practice", label:"Ask for a quiet window (kindly, clearly)", deltas:{ confidence:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.14, logLine:"😴 You advocated without drama." },
              { id:"simple", label:"Move naps around and adapt", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.16, logLine:"😴 You bent the day around the circus." },
              { id:"avoid", label:"Snap at everyone", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.22, logLine:"😴 The tent got tense." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎈 The Clown Bonding Moment",
            body: "A clown tries to make your kid laugh. Your kid stares like a tiny judge at a comedy trial.",
            choices: [
              { id:"practice", label:"Encourage gently (no forcing)", deltas:{ empathy:0.2 }, loveDelta:0.1, stressDelta:0.1, logLine:"🎈 You protected your kid's pace." },
              { id:"simple", label:"Let it be awkward and move on", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.12, logLine:"🎈 Silence won this round." },
              { id:"avoid", label:"Force a performance: 'say thank you!!'", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.16, logLine:"🎈 The clown wasn't the only one sweating." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "tc_kid",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🤹 Skills & Goodbyes",
        variants: [
          {
            title: "🤸 Tryouts",
            body: "Your child wants to learn an act. The coach says: 'Fun first, safety always.'",
            choices: [
              { id:"practice", label:"Support practice + rest + safety gear", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.14, moneyDelta:-60, logLine:"🤸 You built confidence the safe way." },
              { id:"simple", label:"Let them try it casually", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.14, logLine:"🤸 You kept it light and fun." },
              { id:"avoid", label:"Push them too hard to be 'great'", deltas:{ discipline:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.2, logLine:"🤸 Progress happened. So did pressure." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "👋 Another New Town",
            body: "Your kid makes a friend. Then the route moves again. They pretend they don't care. They do.",
            choices: [
              { id:"practice", label:"Help them stay connected (letters/video)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.12, logLine:"👋 You made goodbye less brutal." },
              { id:"simple", label:"Comfort them and focus forward", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.14, logLine:"👋 You kept the wheels turning." },
              { id:"avoid", label:"Dismiss it: 'You'll make new friends'", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.16, logLine:"👋 They learned to grieve quietly." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "tc_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🎤 Teen Spotlight",
        variants: [
          {
            title: "🎬 Viral Clip",
            body: "A clip of your teen performing gets attention online. Praise feels good. Comments feel worse.",
            choices: [
              { id:"practice", label:"Teach boundaries + media literacy", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.05, stressDelta:0.16, logLine:"🎬 You trained resilience, not obsession." },
              { id:"simple", label:"Celebrate the win and mute the noise", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.14, logLine:"🎬 You chose joy with limits." },
              { id:"avoid", label:"Push them to chase fame", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.22, logLine:"🎬 The algorithm started parenting." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧭 'Do I Want This Life?'",
            body: "They admit they might want a different future than the circus route.",
            choices: [
              { id:"practice", label:"Support exploring options + planning", deltas:{ confidence:0.3, intelligence:0.1 }, loveDelta:0.1, stressDelta:0.12, logLine:"🧭 You gave them a real choice." },
              { id:"simple", label:"Compromise: circus now, plan later", deltas:{ discipline:0.2, confidence:0.2 }, loveDelta:0.05, stressDelta:0.14, logLine:"🧭 You built a bridge." },
              { id:"avoid", label:"Guilt them into staying", deltas:{ empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🧭 They started hiding dreams." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_deep_sea_habitat_family_v1: {
    packId: "ss_deep_sea_habitat_family_v1",
    packName: "Deep-Sea Habitat",
    emoji: "🫧",
    specialStartIds: ["deep_sea_habitat_family"],
    ageBands: [
      {
        id: "sea_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🫧 The Ocean Outside the Window",
        variants: [
          {
            title: "🐟 The 'Fish Friends' Phase",
            body: "Your toddler waves at fish like they're neighbors. It's adorable. Then they ask why they can't go outside to play with them.",
            choices: [
              { id:"practice", label:"Explain safety gently + create 'ocean explorer' routines", deltas:{ empathy:0.2, curiosity:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🐟 You kept wonder alive without lying." },
              { id:"simple", label:"Distract with indoor activities and move on", deltas:{ discipline:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🐟 You kept the day calm enough." },
              { id:"avoid", label:"Dismiss it ('because I said so') (frustration grows)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.24, logLine:"🐟 The ocean stayed beautiful. The mood didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "sea_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 School in a Pressure Tube",
        variants: [
          {
            title: "🛠️ The Maintenance Day",
            body: "Systems need maintenance. That means noise, restricted zones, and anxiety. Your child wants to know if the habitat is 'breaking.'",
            choices: [
              { id:"practice", label:"Teach safety calmly + make a 'systems day' plan", deltas:{ intelligence:0.2, confidence:0.1, discipline:0.1 }, loveDelta:0.08, stressDelta:0.18, logLine:"🛠️ You turned fear into understanding." },
              { id:"simple", label:"Reassure briefly and keep routine normal", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.20, logLine:"🛠️ You kept everyone steady." },
              { id:"avoid", label:"Let your anxiety show (kid absorbs it)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"🛠️ The stress spread faster than the noise." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "sea_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Wants Air and Space",
        variants: [
          {
            title: "🚪 'I Need the Surface'",
            body: "Your teen wants the surface world: crowds, weather, randomness. They feel trapped in engineered perfection.",
            choices: [
              { id:"practice", label:"Plan surface visits + teen-led goals for their future", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-2500, logLine:"🚪 You treated their need for space as real." },
              { id:"simple", label:"Offer small freedoms and keep things calm", deltas:{ confidence:0.2 }, loveDelta:0.06, stressDelta:0.20, logLine:"🚪 You opened doors where you could." },
              { id:"avoid", label:"Dismiss it ('we're fine here') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.28, logLine:"🚪 They started dreaming of escape, not growth." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_monarch_in_exile_v1: {
    packId: "ss_monarch_in_exile_v1",
    packName: "Monarch in Exile",
    emoji: "🧳",
    specialStartIds: ["monarch_in_exile"],
    ageBands: [
      {
        id: "mie_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧳 A Crown You Can't Wear",
        variants: [
          {
            title: "🧸 'Why Can't We Go Home?'",
            body: "Your toddler asks why you don't visit 'the big house.' You realize the concept of exile is hitting you through a tiny voice.",
            choices: [
              { id:"practice", label:"Explain simply + create new family traditions (new roots)", deltas:{ empathy:0.2, confidence:0.1, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"🧸 You built safety and meaning in the present." },
              { id:"simple", label:"Keep it light and focus on routine", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.18, logLine:"🧸 You held the day together." },
              { id:"avoid", label:"Avoid the topic (kid absorbs the tension)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.26, logLine:"🧸 The unspoken became the atmosphere." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mie_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 A Normal School With a Not-Normal Past",
        variants: [
          {
            title: "📸 The Classmate Finds a Photo",
            body: "A classmate finds an old article with your former title. Your child is confused: are you 'famous' or are you 'in trouble'?",
            choices: [
              { id:"practice", label:"Be honest: explain safety + identity with care", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.10, stressDelta:0.20, logLine:"📸 You taught truth without panic." },
              { id:"simple", label:"Keep details vague, focus on present life", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"📸 You protected them with simplicity." },
              { id:"avoid", label:"Demand secrecy aggressively (kid feels ashamed)", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.08, stressDelta:0.28, logLine:"📸 You hid the story—and made it heavier." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mie_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Questions Identity",
        variants: [
          {
            title: "👑 'Who Are We, Then?'",
            body: "Your teen asks what your family is without the country, without the court, without the roles. You realize they want an identity they can live with.",
            choices: [
              { id:"practice", label:"Build identity on values + chosen community", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.20, logLine:"👑 You gave them a self that doesn't depend on a throne." },
              { id:"simple", label:"Offer a balanced story and keep moving forward", deltas:{ confidence:0.2 }, loveDelta:0.06, stressDelta:0.20, logLine:"👑 You kept it steady and survivable." },
              { id:"avoid", label:"Cling to the past (teen resents it)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.28, logLine:"👑 The past became a cage." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_haunted_house_roommate_v1: {
    packId: "ss_haunted_house_roommate_v1",
    packName: "Haunted House Roommate",
    emoji: "👻",
    specialStartIds: ["haunted_house_roommate"],
    ageBands: [
      {
        id: "hhr_early",
        minAge: 1,
        maxAge: 6,
        chance: 0.9,
        title: "👻 The Nursery Is 'Active'",
        variants: [
          {
            title: "🧸 The Moving Toy",
            body: "A stuffed animal slides across the floor by itself. Your child is delighted. You are… evaluating your life choices.",
            choices: [
              { id:"practice", label:"Stay calm and make it a 'weird but safe' moment", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.14, logLine:"🧸 You normalized the spooky without panic." },
              { id:"simple", label:"Pretend you didn't see it", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.16, logLine:"🧸 Denial: the cheapest coping skill." },
              { id:"avoid", label:"Freak out in front of your kid", deltas:{ confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.22, logLine:"🧸 Now they're scared of the toy AND your face." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🌙 Midnight Karaoke",
            body: "At 2 AM, the ghost starts humming like it's auditioning. Your kid wakes up and joins in.",
            choices: [
              { id:"practice", label:"Create a bedtime ritual (quiet songs only)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.14, logLine:"🌙 You negotiated with the afterlife." },
              { id:"simple", label:"Ride it out with coffee tomorrow", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.18, logLine:"🌙 Sleep was optional this year." },
              { id:"avoid", label:"Yell at the ghost (it gets petty)", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.24, logLine:"🌙 The ghost learned new ways to be annoying." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "hhr_kid",
        minAge: 7,
        maxAge: 12,
        chance: 0.85,
        title: "📚 Ghostly 'Help'",
        variants: [
          {
            title: "📝 Homework Miracle",
            body: "Your kid's homework is mysteriously finished. The handwriting is... old-timey.",
            choices: [
              { id:"practice", label:"Use it as a lesson: honesty + learning", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.05, stressDelta:0.12, logLine:"📝 You stopped cheating before it became a lifestyle." },
              { id:"simple", label:"Redo it together quietly", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.14, logLine:"📝 You fixed the problem without drama." },
              { id:"avoid", label:"Let it slide (bad habit)", deltas:{ discipline:-0.2 }, loveDelta:-0.05, stressDelta:0.16, logLine:"📝 Your kid learned: haunting = hacks." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🕯️ The 'Friend'",
            body: "Your child insists the ghost is their best friend. It's sweet. Also unsettling when they high-five thin air.",
            choices: [
              { id:"practice", label:"Validate feelings + encourage real friendships too", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.12, logLine:"🕯️ You kept them grounded and safe." },
              { id:"simple", label:"Let it be (kids are weird)", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.14, logLine:"🕯️ You accepted the vibe." },
              { id:"avoid", label:"Mock them for it", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.16, logLine:"🕯️ They stopped sharing their inner world." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "hhr_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "📱 Teen Paranormal Era",
        variants: [
          {
            title: "🎥 'We Could Monetize This'",
            body: "Your teen wants to film the haunting for social media. The ghost seems... interested in fame.",
            choices: [
              { id:"practice", label:"Set rules: privacy + consent + safety", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.05, stressDelta:0.16, logLine:"🎥 You prevented the worst timeline." },
              { id:"simple", label:"Allow one controlled video", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.16, moneyDelta:60, logLine:"🎥 The ghost got its close-up." },
              { id:"avoid", label:"Let them go full influencer", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.24, moneyDelta:120, logLine:"🎥 Fame arrived. So did chaos." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🚪 Boundaries (For the Living AND Dead)",
            body: "Your teen is overstimulated at home. The ghost is always around. Privacy is a myth in this house.",
            choices: [
              { id:"practice", label:"Create real privacy rules and enforce them", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.14, moneyDelta:-40, logLine:"🚪 You defended your teen's sanity." },
              { id:"simple", label:"Offer quiet hours and coping tools", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.14, logLine:"🚪 You made it more survivable." },
              { id:"avoid", label:"Dismiss it: 'It's not that bad'", deltas:{ empathy:-0.3 }, loveDelta:-0.1, stressDelta:0.2, logLine:"🚪 Resentment started collecting interest." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_witness_protection_v1: {
    packId: "ss_witness_protection_v1",
    packName: "Witness Protection",
    emoji: "🕶️",
    specialStartIds: ["witness_protection"],
    ageBands: [
      {
        id: "wp_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🕶️ Low Profile 101",
        variants: [
          {
            title: "🏷️ The Name Slip",
            body: "At the store, your kid blurts the old name. A stranger looks up. Your heart tries to leave your body.",
            choices: [
              { id:"practice", label:"Gently coach: make the new name a 'secret hero name'", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.18, moneyDelta:0, logLine:"🏷️ You kept them safe without scaring them." },
              { id:"simple", label:"Smile, leave fast, talk later at home", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.24, moneyDelta:-25, logLine:"🏷️ You exited like a professional escape artist." },
              { id:"avoid", label:"Panic in front of them (they feel it)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.34, moneyDelta:0, logLine:"🏷️ The fear became contagious." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🚚 Sudden Move Night",
            body: "Your contact says you're relocating—tonight. Your kid asks if they did something wrong.",
            choices: [
              { id:"practice", label:"Explain simply: 'Adults made a safety plan.' Make it an adventure", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.28, moneyDelta:-180, logLine:"🚚 You protected their innocence without lying." },
              { id:"simple", label:"Pack fast and promise a 'fresh start'", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.30, moneyDelta:-220, logLine:"🚚 You moved on fumes and determination." },
              { id:"avoid", label:"Blame the situation out loud (they internalize it)", deltas:{ confidence:-0.2, empathy:-0.1 }, loveDelta:-0.05, stressDelta:0.40, moneyDelta:-120, logLine:"🚚 The move happened. So did the guilt." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wp_school",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 Secret Life, Real Kid",
        variants: [
          {
            title: "🎒 'Can They Come Over?'",
            body: "Your child makes a friend and wants a playdate at your place. Your place is… complicated.",
            choices: [
              { id:"practice", label:"Plan a safe meet-up (park/library) and let friendship exist", deltas:{ empathy:0.2, social:0.1 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:-10, logLine:"🎒 You made room for normal life." },
              { id:"simple", label:"Say no, but schedule a fun family night instead", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.20, moneyDelta:-15, logLine:"🎒 You protected them—and tried to soften the loss." },
              { id:"avoid", label:"Forbid it with threats", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.30, moneyDelta:0, logLine:"🎒 They learned: secrecy beats honesty." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧑‍💼 The Safety Script",
            body: "You teach what to do if a stranger asks personal questions. Your kid calls it 'spy training.' They're not wrong.",
            choices: [
              { id:"practice", label:"Roleplay calmly (short, repeatable scripts)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.18, moneyDelta:0, logLine:"🧑‍💼 You trained safety without turning life into fear." },
              { id:"simple", label:"Keep it brief: one rule they can remember", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.14, moneyDelta:0, logLine:"🧑‍💼 Simple rules stuck better anyway." },
              { id:"avoid", label:"Overshare scary details (they spiral)", deltas:{ confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.26, moneyDelta:0, logLine:"🧑‍💼 You gave them your anxiety by accident." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wp_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "📵 Freedom vs Safety",
        variants: [
          {
            title: "📱 'Everyone Has Social Media'",
            body: "Your teen wants an online presence. Your whole life is built around not being found.",
            choices: [
              { id:"practice", label:"Create safe rules (privacy-first, no face/location, supervised setup)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.24, moneyDelta:0, logLine:"📱 You balanced reality with respect." },
              { id:"simple", label:"Hard no, but offer offline alternatives (clubs, sports, hobby groups)", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.28, moneyDelta:-20, logLine:"📱 You protected safety—at a relationship cost." },
              { id:"avoid", label:"Total crackdown (they go secret anyway)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.36, moneyDelta:0, logLine:"📱 Control increased. Trust decreased." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "💞 Dating Request",
            body: "They want to date. You want to keep them invisible to the wrong people. Both wants are real.",
            choices: [
              { id:"practice", label:"Allow it with safety boundaries (public places, limited details)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.05, stressDelta:0.28, moneyDelta:0, logLine:"💞 You chose guidance over fear." },
              { id:"simple", label:"Delay it (talk + plan for later)", deltas:{ discipline:0.2 }, loveDelta:0.0, stressDelta:0.22, moneyDelta:0, logLine:"💞 You kicked the can carefully." },
              { id:"avoid", label:"Ban it (they hide everything)", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.32, moneyDelta:0, logLine:"💞 Safety rose. So did secrecy." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_witness_protection_v1: {
    packId: "ss_witness_protection_v1",
    packName: "Witness Protection",
    emoji: "🕶️",
    specialStartIds: ["witness_protection"],
    ageBands: [
      {
        id: "wp_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🕶️ Low Profile 101",
        variants: [
          {
            title: "🏷️ The Name Slip",
            body: "At the store, your kid blurts the old name. A stranger looks up. Your heart tries to leave your body.",
            choices: [
              { id:"practice", label:"Gently coach: make the new name a 'secret hero name'", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.1, stressDelta:0.18, moneyDelta:0, logLine:"🏷️ You kept them safe without scaring them." },
              { id:"simple", label:"Smile, leave fast, talk later at home", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.24, moneyDelta:-25, logLine:"🏷️ You exited like a professional escape artist." },
              { id:"avoid", label:"Panic in front of them (they feel it)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.34, moneyDelta:0, logLine:"🏷️ The fear became contagious." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🚚 Sudden Move Night",
            body: "Your contact says you're relocating—tonight. Your kid asks if they did something wrong.",
            choices: [
              { id:"practice", label:"Explain simply: 'Adults made a safety plan.' Make it an adventure", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.28, moneyDelta:-180, logLine:"🚚 You protected their innocence without lying." },
              { id:"simple", label:"Pack fast and promise a 'fresh start'", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.30, moneyDelta:-220, logLine:"🚚 You moved on fumes and determination." },
              { id:"avoid", label:"Blame the situation out loud (they internalize it)", deltas:{ confidence:-0.2, empathy:-0.1 }, loveDelta:-0.05, stressDelta:0.40, moneyDelta:-120, logLine:"🚚 The move happened. So did the guilt." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wp_school",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 Secret Life, Real Kid",
        variants: [
          {
            title: "🎒 'Can They Come Over?'",
            body: "Your child makes a friend and wants a playdate at your place. Your place is… complicated.",
            choices: [
              { id:"practice", label:"Plan a safe meet-up (park/library) and let friendship exist", deltas:{ empathy:0.2, social:0.1 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:-10, logLine:"🎒 You made room for normal life." },
              { id:"simple", label:"Say no, but schedule a fun family night instead", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.20, moneyDelta:-15, logLine:"🎒 You protected them—and tried to soften the loss." },
              { id:"avoid", label:"Forbid it with threats", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.30, moneyDelta:0, logLine:"🎒 They learned: secrecy beats honesty." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧑‍💼 The Safety Script",
            body: "You teach what to do if a stranger asks personal questions. Your kid calls it 'spy training.' They're not wrong.",
            choices: [
              { id:"practice", label:"Roleplay calmly (short, repeatable scripts)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.18, moneyDelta:0, logLine:"🧑‍💼 You trained safety without turning life into fear." },
              { id:"simple", label:"Keep it brief: one rule they can remember", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.14, moneyDelta:0, logLine:"🧑‍💼 Simple rules stuck better anyway." },
              { id:"avoid", label:"Overshare scary details (they spiral)", deltas:{ confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.26, moneyDelta:0, logLine:"🧑‍💼 You gave them your anxiety by accident." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wp_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "📵 Freedom vs Safety",
        variants: [
          {
            title: "📱 'Everyone Has Social Media'",
            body: "Your teen wants an online presence. Your whole life is built around not being found.",
            choices: [
              { id:"practice", label:"Create safe rules (privacy-first, no face/location, supervised setup)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.24, moneyDelta:0, logLine:"📱 You balanced reality with respect." },
              { id:"simple", label:"Hard no, but offer offline alternatives (clubs, sports, hobby groups)", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.28, moneyDelta:-20, logLine:"📱 You protected safety—at a relationship cost." },
              { id:"avoid", label:"Total crackdown (they go secret anyway)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.36, moneyDelta:0, logLine:"📱 Control increased. Trust decreased." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "💞 Dating Request",
            body: "They want to date. You want to keep them invisible to the wrong people. Both wants are real.",
            choices: [
              { id:"practice", label:"Allow it with safety boundaries (public places, limited details)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.05, stressDelta:0.28, moneyDelta:0, logLine:"💞 You chose guidance over fear." },
              { id:"simple", label:"Delay it (talk + plan for later)", deltas:{ discipline:0.2 }, loveDelta:0.0, stressDelta:0.22, moneyDelta:0, logLine:"💞 You kicked the can carefully." },
              { id:"avoid", label:"Ban it (they hide everything)", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.05, stressDelta:0.32, moneyDelta:0, logLine:"💞 Safety rose. So did secrecy." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_duty_wildfire_season_parent_v1: {
    packId: "ss_duty_wildfire_season_parent_v1",
    packName: "Wildfire Season Parent",
    emoji: "🔥",
    specialStartIds: ["duty_wildfire_season_parent"],
    ageBands: [
      {
        id: "wf_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🚨 Sirens and Small Hearts",
        variants: [
          {
            title: "🧸 The Gear Bag",
            body: "Your child drags your gear bag across the floor like it's their new best friend. They ask if the bag is leaving again soon.",
            choices: [
              { id:"practice", label:"Explain simply + create a goodbye ritual (predictable, gentle)", deltas:{ empathy:0.2, confidence:0.1, discipline:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"🧸 You made departures less terrifying." },
              { id:"simple", label:"Keep it light and distract with play", deltas:{ confidence:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🧸 You kept the mood afloat." },
              { id:"avoid", label:"Brush it off ('it's fine') (fear grows quietly)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.26, logLine:"🧸 The fear stayed in the room." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wf_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Smoke Days and Evac Drills",
        variants: [
          {
            title: "🧯 Evacuation Practice",
            body: "Your child has an evacuation drill at school and comes home rattled. They want you to promise nothing bad will happen. You can't honestly promise that.",
            choices: [
              { id:"practice", label:"Validate feelings + make a real family plan together", deltas:{ responsibility:0.2, confidence:0.1, discipline:0.1 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-800, logLine:"🧯 You turned fear into preparedness." },
              { id:"simple", label:"Reassure gently and keep routines normal", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"🧯 You stabilized the day." },
              { id:"avoid", label:"Over-reassure with fake certainty (trust risk)", deltas:{ confidence:-0.1, empathy:-0.1 }, loveDelta:-0.04, stressDelta:0.22, logLine:"🧯 They learned your promises were flimsy." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Anxiety + Public Duty",
        variants: [
          {
            title: "📰 'I Saw It On The News'",
            body: "A clip shows your unit working the line. Your teen watches it twice and says they 'don't want to be brave anymore.'",
            choices: [
              { id:"practice", label:"Talk honestly + arrange support (coping tools, boundaries)", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-1200, logLine:"📰 You treated fear like something to care for, not deny." },
              { id:"simple", label:"Reassure and keep it calm at home", deltas:{ empathy:0.1, discipline:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"📰 You held the household steady." },
              { id:"avoid", label:"Dismiss it ('that's the job') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"📰 They stopped sharing the fear with you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_duty_oil_rig_rotation_v1: {
    packId: "ss_duty_oil_rig_rotation_v1",
    packName: "Oil Rig Rotation",
    emoji: "🛢️",
    specialStartIds: ["duty_oil_rig_rotation"],
    ageBands: [
      {
        id: "rig_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "📞 Bedtime by Video Call",
        variants: [
          {
            title: "🧸 The 'Phone Parent' Problem",
            body: "You're offshore. Your child wants you to read the same bedtime story again. The connection lags like it's emotionally judging you.",
            choices: [
              { id:"practice", label:"Make a real ritual (same time, same story, no multitasking)", deltas:{ empathy:0.2, discipline:0.1, confidence:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"📞 You made distance feel consistent." },
              { id:"simple", label:"Keep it short but reliable (a quick call every night)", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.20, logLine:"📞 Not perfect, but present." },
              { id:"avoid", label:"Skip calls when tired (kid feels the gap)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.28, logLine:"📞 The rig got you. Home didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rig_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🎒 Life Measured in Departures",
        variants: [
          {
            title: "🎭 Missed Big Moment",
            body: "A school performance lands during your hitch. Your child asks if you can 'trade shifts with the ocean.'",
            choices: [
              { id:"practice", label:"Send a recorded message + plan a real 'make-up day'", deltas:{ empathy:0.2, responsibility:0.1, confidence:0.1 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-1500, logLine:"🎭 You couldn't be there, but you showed up anyway." },
              { id:"simple", label:"Promise you'll attend the next one (be careful)", deltas:{ confidence:0.1 }, loveDelta:0.04, stressDelta:0.20, logLine:"🎭 You tried to protect their hope." },
              { id:"avoid", label:"Brush it off ('that's the job') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.26, logLine:"🎭 They stopped asking for you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rig_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Independence vs Emotional Distance",
        variants: [
          {
            title: "🚪 'You're Here… But Not Here'",
            body: "You're finally home. Your teen keeps to their room. They're used to living without you—and they don't know how to switch back.",
            choices: [
              { id:"practice", label:"Be patient: rebuild trust with small consistent moments", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🚪 You treated reconnection like real work." },
              { id:"simple", label:"Give them space and offer an open door", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.18, logLine:"🚪 You didn't force it." },
              { id:"avoid", label:"Demand closeness immediately (pushes them away)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.28, logLine:"🚪 You tried to grab what must be rebuilt." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_survival_quarantine_protocol_v1: {
    packId: "ss_survival_quarantine_protocol_v1",
    packName: "Quarantine Protocol",
    emoji: "🧪",
    specialStartIds: ["survival_quarantine_protocol"],
    ageBands: [
      {
        id: "qp_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧪 Tiny Child, Big Rules",
        variants: [
          {
            title: "🫧 The 'Wash Hands' Spiral",
            body: "Your toddler discovers handwashing and tries to do it forever. You are proud…and watching your soap supply evaporate.",
            choices: [
              { id:"practice", label:"Make it a calm routine (song + timer + praise)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-40, logLine:"🫧 You turned fear into a routine." },
              { id:"simple", label:"Let it happen (pick your battles)", deltas:{ discipline:0.1 }, loveDelta:0.06, stressDelta:0.20, moneyDelta:-80, logLine:"🫧 The sink became the main character." },
              { id:"avoid", label:"Snap about it (they absorb your stress)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.26, logLine:"🫧 The rules stayed. The calm didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "qp_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 School at Home, Social Life on Hold",
        variants: [
          {
            title: "🛰️ Remote Learning Burnout",
            body: "Your child melts down during online school. They're not lazy—they're lonely and tired of screens being their whole world.",
            choices: [
              { id:"practice", label:"Build a structured day with offline projects + movement", deltas:{ intelligence:0.2, discipline:0.2 }, loveDelta:0.06, stressDelta:0.18, logLine:"🛰️ You made learning survivable." },
              { id:"simple", label:"Shorten the day and focus on essentials", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.20, logLine:"🛰️ You protected sanity and kept progress." },
              { id:"avoid", label:"Force full compliance (relationship cost)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.28, logLine:"🛰️ The work got done. The warmth didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "qp_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Isolation Has Sharp Edges",
        variants: [
          {
            title: "🚪 'I Can't Do This Anymore'",
            body: "Your teen is angry, sad, and restless. They want freedom and friends. You want safety. Both needs are real.",
            choices: [
              { id:"practice", label:"Validate + co-design safe connection options", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-200, logLine:"🚪 You turned conflict into a plan." },
              { id:"simple", label:"Hold boundaries but add small freedoms (structured)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚪 You kept safety while easing pressure." },
              { id:"avoid", label:"Clamp down hard (they go secret)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🚪 Control increased. Trust decreased." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_reality_tv_family_v1: {
    packId: "ss_reality_tv_family_v1",
    packName: "Reality TV Family",
    emoji: "🎥",
    specialStartIds: ["reality_tv_family"],
    ageBands: [
      {
        id: "rtv_early",
        minAge: 1,
        maxAge: 4,
        chance: 0.9,
        title: "🎥 Cameras in the Kitchen",
        variants: [
          {
            title: "🎬 'Just Be Natural'",
            body: "The crew says: 'Don't mind us.' Your toddler immediately minds them.",
            choices: [
              { id:"practice", label:"Set boundaries: no filming meltdowns, no pressure on the kid", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.1, stressDelta:0.22, moneyDelta:0, logLine:"🎬 You protected childhood from the spotlight." },
              { id:"simple", label:"Let them film a little, then call it early", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.24, moneyDelta:50, logLine:"🎬 You took the check and kept it moving." },
              { id:"avoid", label:"Push performance ('smile!')", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.30, moneyDelta:80, logLine:"🎬 The episode got content. Your kid got stressed." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧃 Producer Wants Tears",
            body: "A producer hints that 'emotion tests well.' You suddenly hate your own job.",
            choices: [
              { id:"practice", label:"Refuse manipulation (kid's wellbeing > ratings)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.20, moneyDelta:0, logLine:"🧃 You chose dignity over drama." },
              { id:"simple", label:"Redirect the scene to something harmless", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:40, logLine:"🧃 You managed the circus without feeding it." },
              { id:"avoid", label:"Let it happen (it gets ugly)", deltas:{ empathy:-0.3 }, loveDelta:-0.05, stressDelta:0.34, moneyDelta:120, logLine:"🧃 Ratings rose. So did regret." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rtv_kid",
        minAge: 5,
        maxAge: 12,
        chance: 0.85,
        title: "🏫 Everyone Watches",
        variants: [
          {
            title: "📺 School Talk",
            body: "Kids at school reference the show like it's homework. Your child feels exposed.",
            choices: [
              { id:"practice", label:"Coach boundaries + confidence scripts", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.20, moneyDelta:0, logLine:"📺 You helped them handle attention safely." },
              { id:"simple", label:"Keep it light: 'people talk, it passes'", deltas:{ confidence:0.1 }, loveDelta:0.0, stressDelta:0.18, moneyDelta:0, logLine:"📺 You tried to normalize the weird." },
              { id:"avoid", label:"Tell them to 'enjoy being famous'", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.05, stressDelta:0.24, moneyDelta:0, logLine:"📺 They felt unseen in public." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧸 Sponsorship Offer",
            body: "A brand wants your kid in an ad. Money's real. So is the ick.",
            choices: [
              { id:"practice", label:"Say no (kid first)", deltas:{ empathy:0.2 }, loveDelta:0.05, stressDelta:0.16, moneyDelta:0, logLine:"🧸 You refused to sell their childhood." },
              { id:"simple", label:"Say yes with strict limits (time + consent)", deltas:{ discipline:0.2 }, loveDelta:0.0, stressDelta:0.20, moneyDelta:200, logLine:"🧸 You took the deal and built guardrails." },
              { id:"avoid", label:"Say yes and push hard (more money!)", deltas:{ empathy:-0.3 }, loveDelta:-0.05, stressDelta:0.30, moneyDelta:450, logLine:"🧸 The brand loved it. Your kid didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rtv_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.85,
        title: "🧑‍⚖️ Consent & Contracts",
        variants: [
          {
            title: "🚪 'I Want Out'",
            body: "Your teen says they want to stop filming. The contract says otherwise. Your conscience says: don't be a villain.",
            choices: [
              { id:"practice", label:"Back your teen (renegotiate, take the hit)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.24, moneyDelta:-120, logLine:"🚪 You chose your kid over the show." },
              { id:"simple", label:"Compromise: fewer scenes, more privacy", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:0, logLine:"🚪 You built a workable boundary." },
              { id:"avoid", label:"Force filming (relationship damage)", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.10, stressDelta:0.34, moneyDelta:120, logLine:"🚪 You got content. You lost closeness." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧨 Comment Section Fallout",
            body: "A clip goes viral. The comments are cruel. Your teen pretends not to read them. They read them.",
            choices: [
              { id:"practice", label:"Support + boundaries (mute, block, therapy tools)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:-40, logLine:"🧨 You treated mental safety like real safety." },
              { id:"simple", label:"Tell them to ignore it (and hope)", deltas:{ confidence:0.1 }, loveDelta:0.0, stressDelta:0.24, moneyDelta:0, logLine:"🧨 You tried the classic 'just don't care' strategy." },
              { id:"avoid", label:"Fan the flames (clapbacks, drama)", deltas:{ empathy:-0.2, confidence:0.1 }, loveDelta:-0.05, stressDelta:0.30, moneyDelta:80, logLine:"🧨 The internet got fed. So did the stress." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_famous_pop_star_v1: {
    packId: "ss_famous_pop_star_v1",
    packName: "Pop Star Life",
    emoji: "🎤",
    specialStartIds: ["famous_pop_star"],
    ageBands: [
      {
        id: "popstar_early",
        minAge: 1,
        maxAge: 7,
        chance: 0.85,
        title: "🎤 Early Fame",
        variants: [
          {
            title: "📸 Paparazzi Day",
            body: "Cameras follow you to the park. Your child notices strangers pointing. Privacy is a negotiation now.",
            choices: [
              { id: "shield", label: "Shield them aggressively (privacy first)", deltas: { empathy: 0.2, discipline: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "📸 You protected their privacy." },
              { id: "normalize", label: "Normalize it calmly ('this is part of life')", deltas: { confidence: 0.2, empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "📸 You made fame feel manageable." },
              { id: "perform", label: "Teach them to perform for cameras", deltas: { confidence: 0.3, empathy: -0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "📸 Performance became reflex." }
            ]
          },
          {
            title: "🎁 Sponsorship Offer",
            body: "A brand wants your child's face on their product. The money is real. The ethics are… negotiable.",
            choices: [
              { id: "decline", label: "Decline (childhood isn't for sale)", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🎁 You said no to commercializing them." },
              { id: "selective", label: "One selective deal (boundaries + cash)", deltas: { discipline: 0.2, intelligence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, moneyDelta: 25000, logLine: "🎁 You negotiated carefully." },
              { id: "yes", label: "Say yes (maximize earnings)", deltas: { confidence: 0.2, empathy: -0.1 }, loveDelta: 0, stressDelta: 0.2, moneyDelta: 75000, logLine: "🎁 Money won. Childhood lost a little." }
            ]
          }
        ]
      },
      {
        id: "popstar_mid",
        minAge: 8,
        maxAge: 14,
        chance: 0.9,
        title: "🎤 Growing Up Famous",
        variants: [
          {
            title: "🎪 Tour Decision",
            body: "A major tour is offered. It's career-defining. It's also months away from home and normal life.",
            choices: [
              {
                id: "tour",
                label: "Accept the tour (career first)",
                deltas: { confidence: 0.3, discipline: 0.2, empathy: -0.2 },
                loveDelta: -0.1,
                stressDelta: 0.3,
                logLine: "🎪 The tour launched. Life got busier.",
                apply: ({ gameState, updateState, applyMoneyDelta }) => {
                  const fame = gameState.famePoints || 0;
                  let amount = 500000;
                  if (fame >= 900) amount = 100000000;
                  else if (fame >= 600) amount = 25000000;
                  else if (fame >= 300) amount = 5000000;
                  applyMoneyDelta(amount);
                  updateState(prev => ({...prev, lastTourAge: prev.currentYear}));
                }
              },
              { id: "limited", label: "Limited tour (balance career + life)", deltas: { confidence: 0.2, empathy: 0.1 }, loveDelta: 0.1, stressDelta: 0.2, moneyDelta: 100000, logLine: "🎪 You protected some normalcy." },
              { id: "decline", label: "Decline (protect childhood)", deltas: { empathy: 0.3, confidence: 0.1 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🎪 You chose stability over stardom." }
            ]
          },
          {
            title: "🔒 Privacy Boundaries",
            body: "Your child wants privacy. The industry wants access. You're the gatekeeper.",
            choices: [
              { id: "protect", label: "Hard boundaries (no social media, no home content)", deltas: { empathy: 0.3, discipline: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🔒 You built a wall around their private life." },
              { id: "curated", label: "Curated sharing (controlled narrative)", deltas: { intelligence: 0.2, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🔒 You managed the image carefully." },
              { id: "open", label: "Let them share freely", deltas: { confidence: 0.2, empathy: -0.2 }, loveDelta: 0, stressDelta: 0.2, logLine: "🔒 Privacy became optional." }
            ]
          }
        ]
      },
      {
        id: "popstar_teen",
        minAge: 15,
        maxAge: 18,
        chance: 0.9,
        title: "🎤 Teen Stardom",
        variants: [
          {
            title: "🔥 Viral Moment",
            body: "Something goes viral—good or bad, it's massive. Your teen is trending. The world has opinions. How do you handle it?",
            choices: [
              { id: "support", label: "Support them privately, ignore public noise", deltas: { empathy: 0.3, confidence: 0.3 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "🔥 You kept them grounded through chaos." },
              { id: "spin", label: "Spin it into opportunity (PR move)", deltas: { confidence: 0.3, intelligence: 0.2 }, loveDelta: 0, stressDelta: 0.2, moneyDelta: 50000, logLine: "🔥 You turned drama into profit." },
              { id: "panic", label: "Panic and try to control everything", deltas: { discipline: 0.2, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🔥 Control spiraled into more chaos." }
            ]
          },
          {
            title: "🎓 College vs Career",
            body: "They're choosing: college for 'normal life' or full-time career at peak fame. What do you advise?",
            choices: [
              { id: "college", label: "Push for college (education + options)", deltas: { intelligence: 0.3, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🎓 You prioritized education." },
              { id: "career", label: "Support full career (strike while hot)", deltas: { confidence: 0.3, discipline: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, moneyDelta: 200000, logLine: "🎤 You backed their ambition." },
              { id: "both", label: "Try both (chaos mode)", deltas: { discipline: 0.2, confidence: 0.1 }, loveDelta: 0, stressDelta: 0.3, moneyDelta: 50000, logLine: "🎓🎤 You attempted the impossible." }
            ]
          }
        ]
      }
    ]
  },

  ss_spotlight_movie_star_v1: {
    packId: "ss_spotlight_movie_star_v1",
    packName: "Movie Star",
    emoji: "🎬",
    specialStartIds: ["spotlight_movie_star"],
    ageBands: [
      {
        id: "ms_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🎬 On‑Set Childhood",
        variants: [
          {
            title: "🧸 Quiet on Set (Toddler Edition)",
            body: "The crew is kind, but your kid treats the set like a theme park. A producer asks for 'quiet focus'… and your toddler replies with interpretive screeching.",
            choices: [
              { id:"practice", label:"Make a tiny kid‑corner + 'whisper game' breaks", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🎬 You built structure without crushing the fun." },
              { id:"simple", label:"Snacks + a short cartoon (just this time)", deltas:{ happiness:0.2 }, loveDelta:0.05, stressDelta:0.2, moneyDelta:-20, logLine:"🎬 Peace was purchased in crackers." },
              { id:"avoid", label:"Let them roam—everyone loves a cute kid, right?", deltas:{ discipline:-0.2, curiosity:0.2 }, loveDelta:-0.05, stressDelta:0.35, logLine:"🎬 A PA chased a toddler holding a foam sword." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ms_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📸 Spotlight Spillover",
        variants: [
          {
            title: "🏫 Paparazzi at Pickup",
            body: "A photographer camps near the school gate. Other parents whisper. Your kid asks why strangers know your name.",
            choices: [
              { id:"practice", label:"Explain privacy + make a simple 'family rules' plan", deltas:{ intelligence:0.2, confidence:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"📸 You turned fame into a lesson, not a fear." },
              { id:"simple", label:"Laugh it off and keep walking", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"📸 You kept it moving—no drama." },
              { id:"avoid", label:"Lean into it—photos, autographs, the whole show", deltas:{ social:0.2, empathy:-0.1 }, loveDelta:0.0, stressDelta:0.3, logLine:"📸 School pickup became a red carpet." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ms_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🗞️ Teen Years in Public",
        variants: [
          {
            title: "🔥 A Rumor Trends",
            body: "A dumb rumor about your family starts spreading online. Your teen pretends they don't care… but they do.",
            choices: [
              { id:"practice", label:"Validate feelings + set a calm, united response", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🗞️ You protected your teen's dignity first." },
              { id:"simple", label:"Ignore it and focus on real life", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"🗞️ You chose silence over oxygen." },
              { id:"avoid", label:"Go full PR war—statements, threats, scorched earth", deltas:{ discipline:0.1, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, logLine:"🗞️ You won the headline… and lost some warmth." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_pro_athlete_v1: {
    packId: "ss_spotlight_pro_athlete_v1",
    packName: "Pro Athlete",
    emoji: "🏟️",
    specialStartIds: ["spotlight_pro_athlete"],
    ageBands: [
      {
        id: "pa_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🏟️ Training House",
        variants: [
          {
            title: "⏱️ Everything Is a Drill",
            body: "Your kid wants playtime. Your schedule wants reps. The house feels like a mini training camp.",
            choices: [
              { id:"practice", label:"Turn training into play (and stop while it's fun)", deltas:{ happiness:0.2, fitness:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"🏟️ You made discipline feel safe." },
              { id:"simple", label:"Do your routine first, then play", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"🏟️ Schedule first, cuddles second." },
              { id:"avoid", label:"Push through—results matter", deltas:{ discipline:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, logLine:"🏟️ The house got tense." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "pa_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🚌 Away Games",
        variants: [
          {
            title: "🎒 Missed Moments",
            body: "You're traveling again. Your child asks if you'll be home for the school event this time.",
            choices: [
              { id:"practice", label:"Make a 'promise you can keep' + a real ritual", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.15, logLine:"🚌 You built trust with consistency." },
              { id:"simple", label:"Say 'I'll try' and hope it works out", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"🚌 You kept it vague to survive." },
              { id:"avoid", label:"Buy it off with gifts", deltas:{ happiness:0.1, empathy:-0.1 }, loveDelta:0.0, stressDelta:0.25, moneyDelta:-250, logLine:"🚌 The gift helped… a little." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "pa_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📣 Public Pressure",
        variants: [
          {
            title: "🗣️ 'Your Parent's Famous'",
            body: "People compare your teen to you. Your teen acts annoyed—but it lands.",
            choices: [
              { id:"practice", label:"Tell them they don't have to be your sequel", deltas:{ confidence:0.2, empathy:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"📣 You gave them room to be themselves." },
              { id:"simple", label:"Offer practical advice: routines and boundaries", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"📣 You coached the moment." },
              { id:"avoid", label:"Push them toward your path", deltas:{ discipline:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, logLine:"📣 It started feeling like a draft pick." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_influencer_v1: {
    packId: "ss_spotlight_influencer_v1",
    packName: "Internet Influencer",
    emoji: "📱",
    specialStartIds: ["spotlight_influencer"],
    ageBands: [
      {
        id: "inf_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "📱 Life as Content",
        variants: [
          {
            title: "🍼 'Just One Cute Clip'",
            body: "A brand asks for a 'family moment' video. It's harmless… but it's also your kid's face on the internet.",
            choices: [
              { id:"practice", label:"Say no (privacy first)", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.1, stressDelta:0.15, logLine:"📱 You chose boundaries over bonuses." },
              { id:"simple", label:"Do it—no face, no name, no location", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.2, moneyDelta:120, logLine:"📱 You took the deal and kept it safer." },
              { id:"avoid", label:"Do it fully—lean into 'family brand'", deltas:{ social:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, moneyDelta:250, logLine:"📱 The money hit… and so did the attention." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "inf_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🧃 Attention Leaks Into School",
        variants: [
          {
            title: "👀 'Is That Your Parent?'",
            body: "A classmate recognizes you. Your kid asks if they have to be 'online' too.",
            choices: [
              { id:"practice", label:"Let your kid decide their own visibility", deltas:{ confidence:0.2, empathy:0.2 }, loveDelta:0.12, stressDelta:0.15, logLine:"📱 You gave them control over their story." },
              { id:"simple", label:"Keep it light: 'It's just work' + move on", deltas:{ confidence:0.1 }, loveDelta:0.05, stressDelta:0.2, logLine:"📱 You kept it steady and normal." },
              { id:"avoid", label:"Push them into the content because 'it helps the channel'", deltas:{ social:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, logLine:"📱 It started feeling transactional." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "inf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🔥 Teen Boundaries vs Virality",
        variants: [
          {
            title: "📲 They Want Their Own Account",
            body: "Your teen wants to post publicly. They want freedom… and they want you to stop 'being cringe online.'",
            choices: [
              { id:"practice", label:"Co‑design rules + safety habits + check‑ins", deltas:{ responsibility:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"📱 You treated independence like a skill, not a switch." },
              { id:"simple", label:"Allow it, but keep strict privacy settings", deltas:{ responsibility:0.2 }, loveDelta:0.05, stressDelta:0.2, logLine:"📱 You allowed it carefully." },
              { id:"avoid", label:"Ban it completely, no discussion", deltas:{ discipline:0.2, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.35, logLine:"📱 It became a power struggle." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_tech_founder_v1: {
    packId: "ss_spotlight_tech_founder_v1",
    packName: "Tech Founder",
    emoji: "💼",
    specialStartIds: ["spotlight_tech_founder"],
    ageBands: [
      {
        id: "tf_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "💼 Founder House, Toddler Schedule",
        variants: [
          {
            title: "📊 The 'Quick Call' That Ate Bedtime",
            body: "An investor wants a 'quick call.' Your child wants a bedtime story. The call becomes three calls. The story becomes… later.",
            choices: [
              { id:"practice", label:"Decline and protect bedtime (hard boundary)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-8000, logLine:"📊 You chose your kid over the deal flow." },
              { id:"simple", label:"Take the call, then do bedtime fully (no rushing)", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.24, logLine:"📊 You did both… and paid in exhaustion." },
              { id:"avoid", label:"Keep working (bedtime becomes a casualty)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"📊 The company got you. Your kid noticed." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "tf_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Wealth at the School Gate",
        variants: [
          {
            title: "🎒 The Donation Expectation Trap",
            body: "The school casually mentions a 'recommended' donation. Everyone looks at you like you invented money.",
            choices: [
              { id:"practice", label:"Donate quietly + set a firm boundary (no escalation)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.16, moneyDelta:-12000, logLine:"🎒 You helped without becoming the school's ATM." },
              { id:"simple", label:"Donate big (fast, easy, done)", deltas:{ confidence:0.2 }, loveDelta:0.0, stressDelta:0.18, moneyDelta:-60000, logLine:"🎒 The school loved you. The expectations multiplied." },
              { id:"avoid", label:"Refuse angrily (social blowback)", deltas:{ empathy:-0.1, confidence:-0.1 }, loveDelta:-0.02, stressDelta:0.22, logLine:"🎒 You made a point. It made enemies." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "tf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧾 Money, Identity, and a Teen With Opinions",
        variants: [
          {
            title: "💳 The 'Normal Kid' Card",
            body: "Your teen asks for a card 'like everyone else.' Everyone else does not have your balance sheet. This is a values moment.",
            choices: [
              { id:"practice", label:"Give a card with a budget + monthly review (no shame)", deltas:{ discipline:0.2, intelligence:0.2 }, loveDelta:0.06, stressDelta:0.18, logLine:"💳 You taught money like it's a skill, not a superpower." },
              { id:"simple", label:"Give a low limit and hope it teaches itself", deltas:{ discipline:0.1 }, loveDelta:0.02, stressDelta:0.20, logLine:"💳 It worked… mostly." },
              { id:"avoid", label:"Unlimited access (creates chaos fast)", deltas:{ discipline:-0.2, empathy:-0.1 }, loveDelta:-0.05, stressDelta:0.28, logLine:"💳 The spending was instant. The lesson was not." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_music_icon_v1: {
    packId: "ss_spotlight_music_icon_v1",
    packName: "Global Music Icon",
    emoji: "🎶",
    specialStartIds: ["spotlight_music_icon"],
    ageBands: [
      {
        id: "mi_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🎶 Tour Bus Lullabies",
        variants: [
          {
            title: "🚌 The Show vs The Story",
            body: "A promoter begs for an extra show. Your kid begs for you to read the same book again. Both are loud. One is small.",
            choices: [
              { id:"practice", label:"Decline the extra show (protect family ritual)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-25000, logLine:"🚌 You chose bedtime over the encore." },
              { id:"simple", label:"Take the show, but preserve the ritual remotely", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚌 You kept connection alive across distance." },
              { id:"avoid", label:"Take everything (kid becomes an afterthought)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🚌 The stage got you. Home didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mi_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📸 Fame Leaks Into School",
        variants: [
          {
            title: "🎒 Fans at Pickup",
            body: "Someone recognizes your child. The attention is 'friendly'—and still invasive. Your kid asks if they can be normal for one day.",
            choices: [
              { id:"practice", label:"Privacy plan with school (boundaries + procedures)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.06, stressDelta:0.18, moneyDelta:-6000, logLine:"🎒 You protected their childhood in public." },
              { id:"simple", label:"Teach coping scripts and keep moving", deltas:{ confidence:0.2 }, loveDelta:0.03, stressDelta:0.18, logLine:"🎒 You trained confidence under pressure." },
              { id:"avoid", label:"Lean into it (photos/autographs everywhere)", deltas:{ confidence:0.2, empathy:-0.1 }, loveDelta:-0.02, stressDelta:0.26, logLine:"🎒 Pickup turned into a meet-and-greet." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mi_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🗞️ Teen Years in the Spotlight",
        variants: [
          {
            title: "🔥 A Rumor Trends",
            body: "A dumb rumor about your family trends online. Your teen pretends they don't care. They absolutely care.",
            choices: [
              { id:"practice", label:"Validate feelings + make a calm plan together", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.20, logLine:"🔥 You protected dignity first." },
              { id:"simple", label:"Ignore it (no oxygen)", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.22, logLine:"🔥 You chose silence over feeding the fire." },
              { id:"avoid", label:"Go full public war (clapbacks, drama)", deltas:{ discipline:0.1, empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.34, logLine:"🔥 You won headlines. You lost peace." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_nobel_scientist_v1: {
    packId: "ss_spotlight_nobel_scientist_v1",
    packName: "World-Class Scientist",
    emoji: "🔬",
    specialStartIds: ["spotlight_nobel_scientist"],
    ageBands: [
      {
        id: "ws_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🔬 Lab Brain, Parent Heart",
        variants: [
          {
            title: "🧪 The Kitchen 'Experiment'",
            body: "Your child wants to 'do science' with you. You want to keep your house in one piece and your kid safe.",
            choices: [
              { id:"practice", label:"Safe experiments + clear rules (wonder with guardrails)", deltas:{ intelligence:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.16, logLine:"🧪 You taught curiosity without chaos." },
              { id:"simple", label:"Buy a kid science kit and supervise", deltas:{ intelligence:0.2 }, loveDelta:0.05, stressDelta:0.16, moneyDelta:-200, logLine:"🧪 You outsourced the mess to a box." },
              { id:"avoid", label:"No time (work consumes the week)", deltas:{ empathy:-0.1, discipline:-0.1 }, loveDelta:-0.05, stressDelta:0.22, logLine:"🧪 The wonder got postponed again." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ws_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏛️ Conferences, Awards, School Events",
        variants: [
          {
            title: "✈️ The Keynote vs The School Play",
            body: "You're invited to keynote somewhere famous. Your child is starring in something tiny and extremely important.",
            choices: [
              { id:"practice", label:"Choose the school play (and decline the keynote)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.10, stressDelta:0.20, moneyDelta:-12000, logLine:"✈️ You chose your kid over applause." },
              { id:"simple", label:"Travel, but create a strong ritual (calls, notes, guaranteed time)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.18, logLine:"✈️ You made distance less damaging." },
              { id:"avoid", label:"Travel nonstop (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"✈️ Your work soared. Home felt emptier." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ws_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🏆 Pressure to Be Exceptional",
        variants: [
          {
            title: "🧠 'Do I Have to Be Brilliant?'",
            body: "Your teen worries they must be exceptional because you are. They're afraid of disappointing you.",
            choices: [
              { id:"practice", label:"Reassure: love isn't a leaderboard", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🧠 You removed an invisible weight." },
              { id:"simple", label:"Offer mentorship only if they ask", deltas:{ intelligence:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"🧠 You offered tools, not a destiny." },
              { id:"avoid", label:"Push them toward your lane", deltas:{ discipline:0.2, empathy:-0.2 }, loveDelta:-0.06, stressDelta:0.32, logLine:"🧠 It started feeling like a requirement." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_music_label_mogul_v1: {
    packId: "ss_spotlight_music_label_mogul_v1",
    packName: "Music Label Mogul",
    emoji: "🎵",
    specialStartIds: ["spotlight_music_label_mogul"],
    ageBands: [
      {
        id: "mlm_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🎵 Studio Life, Nursery Life",
        variants: [
          {
            title: "🎧 The Soundcheck Nap",
            body: "Your child falls asleep to bass vibrations. It's weirdly peaceful—until the artist wants to 'keep pushing the take' and your kid wakes up furious.",
            choices: [
              { id:"practice", label:"End the session and protect sleep (boundaries matter)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-8000, logLine:"🎧 You chose parenting over perfection." },
              { id:"simple", label:"Move the session and soothe the kid (damage control)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🎧 You kept the day from collapsing." },
              { id:"avoid", label:"Prioritize the session (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"🎧 The track improved. The connection didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mlm_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Fame-by-Association",
        variants: [
          {
            title: "📸 The 'Cool Parent' Trap",
            body: "Other kids find out what you do and treat your child like a ticket to backstage life. Your kid wants friends—not fans.",
            choices: [
              { id:"practice", label:"Teach boundaries + protect privacy (no free passes)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"📸 You kept friendships real." },
              { id:"simple", label:"Limit access quietly and keep it moving", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"📸 You made it less of a circus." },
              { id:"avoid", label:"Lean into it (status chaos at school)", deltas:{ empathy:-0.2, confidence:0.1 }, loveDelta:-0.06, stressDelta:0.24, logLine:"📸 Popularity rose. Authenticity dropped." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mlm_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Wants the Spotlight",
        variants: [
          {
            title: "🎤 'Sign Me'",
            body: "Your teen wants a deal. They also want you to be their parent. Those roles do not blend cleanly.",
            choices: [
              { id:"practice", label:"Support their craft first (mentor + training) before contracts", deltas:{ empathy:0.2, intelligence:0.2, discipline:0.1 }, loveDelta:0.12, stressDelta:0.22, logLine:"🎤 You chose growth over shortcuts." },
              { id:"simple", label:"Set rules: you won't manage them, but you'll advise", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🎤 You created boundaries that protect both of you." },
              { id:"avoid", label:"Push them hard (relationship strain)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🎤 The dream got loud. The trust got quiet." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_private_equity_titan_v1: {
    packId: "ss_spotlight_private_equity_titan_v1",
    packName: "Private Equity Titan",
    emoji: "💼",
    specialStartIds: ["spotlight_private_equity_titan"],
    ageBands: [
      {
        id: "pe_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "💼 Billion-Dollar Calls, Tiny Bedtime",
        variants: [
          {
            title: "📞 The 'One More Call' Spiral",
            body: "Your phone buzzes with a deal call that 'can't wait.' Your child is finally calm in your arms. Both moments feel urgent—only one is actually irreplaceable.",
            choices: [
              { id:"practice", label:"End the call window: protect bedtime like it's sacred", deltas:{ empathy:0.2, discipline:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-12000, logLine:"📞 You treated family time like a real commitment." },
              { id:"simple", label:"Take the call, then return fully present (no half-parenting)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"📞 You did both. It cost you energy." },
              { id:"avoid", label:"Stay on calls all night (kid learns: work wins)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"📞 The deal moved forward. So did the distance." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "pe_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 The Wealth Gap Becomes Real",
        variants: [
          {
            title: "🎒 'Why Are We Different?'",
            body: "Your kid notices other families don't live like you. They ask if it makes them 'better.' You get a single chance to teach what money is—and isn't.",
            choices: [
              { id:"practice", label:"Teach values: kindness + humility + privacy (no flexing)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🎒 You built character instead of entitlement." },
              { id:"simple", label:"Keep it light: 'we're lucky' and move on", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.18, logLine:"🎒 You kept the moment gentle." },
              { id:"avoid", label:"Lean into superiority (it sticks)", deltas:{ empathy:-0.3, confidence:0.1 }, loveDelta:-0.06, stressDelta:0.24, logLine:"🎒 They learned status instead of gratitude." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "pe_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Questions Your World",
        variants: [
          {
            title: "🔥 'Did You Hurt People For This?'",
            body: "Your teen challenges you about layoffs, power, and what your money means. They aren't attacking you. They're searching for the truth about who you are.",
            choices: [
              { id:"practice", label:"Listen seriously + show accountability + model repair", deltas:{ empathy:0.2, confidence:0.2, discipline:0.1 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-25000, logLine:"🔥 You chose integrity over defensiveness." },
              { id:"simple", label:"Explain your perspective calmly and set boundaries", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🔥 You stayed steady under pressure." },
              { id:"avoid", label:"Dismiss them ('you don't understand') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🔥 They stopped bringing you big questions." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_business_mogul_v1: {
    packId: "ss_spotlight_business_mogul_v1",
    packName: "Business Mogul",
    emoji: "🏛️",
    specialStartIds: ["spotlight_business_mogul"],
    ageBands: [
      {
        id: "bm_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🏛️ Boardroom at Breakfast",
        variants: [
          {
            title: "📞 'Just Sign This'",
            body: "A deal needs your signature today. Your child needs you today. Both feel urgent—only one is actually fragile.",
            choices: [
              { id:"practice", label:"Delay the deal and protect family time (real boundary)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-15000, logLine:"📞 You chose presence over power—today." },
              { id:"simple", label:"Do the deal fast, then fully disconnect (no halfway parenting)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.24, logLine:"📞 You handled both, at a cost to your sleep." },
              { id:"avoid", label:"Let work consume the day (kid becomes secondary)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"📞 The deal closed. The distance widened." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "bm_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🎒 Rich Parent Gravity",
        variants: [
          {
            title: "🏫 The 'Helpful' Ask",
            body: "The school 'politely' asks you to sponsor the new wing. The request is framed as community spirit. It's also social pressure with a smile.",
            choices: [
              { id:"practice", label:"Donate quietly with clear limits (no dependency)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.04, stressDelta:0.16, moneyDelta:-40000, logLine:"🏫 You helped without buying control." },
              { id:"simple", label:"Donate big and move on (fastest path)", deltas:{ confidence:0.2 }, loveDelta:0.0, stressDelta:0.18, moneyDelta:-120000, logLine:"🏫 The wing got built. So did expectations." },
              { id:"avoid", label:"Refuse publicly (backlash)", deltas:{ empathy:-0.1, confidence:-0.1 }, loveDelta:-0.02, stressDelta:0.24, logLine:"🏫 You made a point. It made enemies." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "bm_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧾 Legacy and a Teen With Values",
        variants: [
          {
            title: "📰 Your Company Is the Headline",
            body: "A public controversy hits your business. Your teen asks: 'Are we the bad guys?' It's not a PR question—it's a family question.",
            choices: [
              { id:"practice", label:"Be honest + take corrective action (even if it costs)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-65000, logLine:"📰 You modeled integrity with receipts." },
              { id:"simple", label:"Explain your side and move forward carefully", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.22, logLine:"📰 You stayed steady under heat." },
              { id:"avoid", label:"Dismiss it ('that's business') (relationship cost)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"📰 They stopped asking you hard questions." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_chef_v1: {
    packId: "ss_spotlight_chef_v1",
    packName: "World-Famous Chef",
    emoji: "👨‍🍳",
    specialStartIds: ["spotlight_chef"],
    ageBands: [
      {
        id: "chef_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "👨‍🍳 Heat in the Kitchen, Heat at Home",
        variants: [
          {
            title: "🍽️ Critic Night, Toddler Night",
            body: "A top critic is in the dining room. Your child has a meltdown at the exact moment the dining room goes silent.",
            choices: [
              { id:"practice", label:"Choose your kid (delegate service, handle home)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-12000, logLine:"🍽️ You chose family over a perfect night." },
              { id:"simple", label:"Split the difference (quick comfort, back to service)", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.26, logLine:"🍽️ You did both—barely." },
              { id:"avoid", label:"Stay on the floor (kid feels abandoned)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"🍽️ The plates were perfect. The connection wasn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "chef_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📺 The Brand Expands",
        variants: [
          {
            title: "🎥 TV Segment Offer",
            body: "A major show wants your family featured. Money is great. Privacy is not included in the contract.",
            choices: [
              { id:"practice", label:"Decline or keep the child off-camera (privacy first)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.18, moneyDelta:-20000, logLine:"🎥 You protected their childhood from the spotlight." },
              { id:"simple", label:"Accept with strict limits and boundaries", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.03, stressDelta:0.22, moneyDelta:30000, logLine:"🎥 You took the deal and built guardrails." },
              { id:"avoid", label:"Go all-in on family branding", deltas:{ empathy:-0.2, confidence:0.2 }, loveDelta:-0.05, stressDelta:0.32, moneyDelta:65000, logLine:"🎥 The brand grew. So did the pressure." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "chef_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧾 Legacy vs Identity",
        variants: [
          {
            title: "🥄 'I Don't Want to Inherit the Kitchen'",
            body: "Your teen admits they don't want your path. They want a life that isn't measured in reviews, stars, or service hours.",
            choices: [
              { id:"practice", label:"Support their path (no guilt, real planning)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🥄 You chose your kid over your legacy fantasy." },
              { id:"simple", label:"Compromise: they explore while learning basics", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.20, logLine:"🥄 You kept doors open without forcing one." },
              { id:"avoid", label:"Pressure them to continue the empire", deltas:{ empathy:-0.3, discipline:0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🥄 They learned love felt conditional." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_fashion_icon_v1: {
    packId: "ss_spotlight_fashion_icon_v1",
    packName: "Fashion Icon",
    emoji: "👗",
    specialStartIds: ["spotlight_fashion_icon"],
    ageBands: [
      {
        id: "fi_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "👗 Couture Meets Crayons",
        variants: [
          {
            title: "📸 The 'Family Campaign' Pitch",
            body: "A luxury brand offers a massive contract… and they want your toddler in one 'adorable' photo. It's money and exposure in the same package.",
            choices: [
              { id:"practice", label:"Take the deal, but keep your child off-camera (hard boundary)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-5000, logLine:"📸 You chose privacy over a bigger paycheck." },
              { id:"simple", label:"Allow one controlled photo (no face/name/location)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.24, moneyDelta:60000, logLine:"📸 You took the money and built guardrails." },
              { id:"avoid", label:"Make it a whole campaign (maximum exposure)", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.06, stressDelta:0.34, moneyDelta:140000, logLine:"📸 The brand exploded. So did the attention." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "fi_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "👜 Style, School, and Side-Eyes",
        variants: [
          {
            title: "🏫 Dress Code Drama",
            body: "The school sends a polite email about 'appropriate attire.' Your child is now painfully aware they're different.",
            choices: [
              { id:"practice", label:"Advocate calmly + let your child choose simpler outfits", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🏫 You protected their autonomy and dignity." },
              { id:"simple", label:"Compromise: 'school basics' + fun style at home", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"🏫 You built a boundary that works." },
              { id:"avoid", label:"Escalate publicly (becomes a headline)", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.04, stressDelta:0.30, logLine:"🏫 You won the argument. Your kid hated the spotlight." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "fi_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🗞️ Teen Identity vs Brand",
        variants: [
          {
            title: "🧢 'I Don't Want to Be Your Aesthetic'",
            body: "Your teen wants a look that doesn't match your image. They're not rebelling against you—they're trying to exist.",
            choices: [
              { id:"practice", label:"Support their identity (even if it clashes with your brand)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.20, logLine:"🧢 You chose your kid over your image." },
              { id:"simple", label:"Compromise: private freedom, public neutrality", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.22, logLine:"🧢 You built a workable truce." },
              { id:"avoid", label:"Enforce 'brand consistency' (relationship cost)", deltas:{ discipline:0.2, empathy:-0.3 }, loveDelta:-0.10, stressDelta:0.32, logLine:"🧢 They stopped sharing their real self." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_olympian_v1: {
    packId: "ss_spotlight_olympian_v1",
    packName: "Olympic Champion",
    emoji: "🥇",
    specialStartIds: ["spotlight_olympian"],
    ageBands: [
      {
        id: "ol_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🥇 Training Calendar, Family Calendar",
        variants: [
          {
            title: "⏱️ The 'One More Session' Moment",
            body: "Your coach wants one more training block. Your child wants you—fully present—for five minutes that will matter forever.",
            choices: [
              { id:"practice", label:"End training on time (protect family ritual)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-6000, logLine:"⏱️ You treated family time like a real commitment." },
              { id:"simple", label:"Train, then show up fully (no half-attention)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"⏱️ You did both, and felt it in your bones." },
              { id:"avoid", label:"Keep pushing (kid becomes background noise)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"⏱️ Your body improved. Your connection didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ol_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🚌 Travel Season Parenting",
        variants: [
          {
            title: "🎒 The Missed School Event",
            body: "You're away again. Your child asks if you'll be there 'this time.' The question lands like a punch.",
            choices: [
              { id:"practice", label:"Make a promise you can keep + create a reliable ritual", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🎒 You built trust with consistency." },
              { id:"simple", label:"Apologize and try your best (honest, imperfect)", deltas:{ empathy:0.1, discipline:0.2 }, loveDelta:0.06, stressDelta:0.20, logLine:"🎒 You stayed human and steady." },
              { id:"avoid", label:"Buy it off with gifts (doesn't fix it)", deltas:{ confidence:0.1, empathy:-0.1 }, loveDelta:0.0, stressDelta:0.26, moneyDelta:-25000, logLine:"🎒 The gift landed. The ache stayed." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ol_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📣 Legacy Pressure on a Teen",
        variants: [
          {
            title: "🗣️ 'Am I Supposed to Be Great Too?'",
            body: "Your teen admits they feel pressured to be exceptional because you are. They don't want to disappoint you.",
            choices: [
              { id:"practice", label:"Reassure: love is not performance", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🗣️ You made home feel safe again." },
              { id:"simple", label:"Offer guidance only if they ask", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.20, logLine:"🗣️ You offered support without pushing." },
              { id:"avoid", label:"Push them toward your path (relationship cost)", deltas:{ discipline:0.2, empathy:-0.2 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🗣️ They started hiding their real dreams." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_astronaut_v1: {
    packId: "ss_spotlight_astronaut_v1",
    packName: "Astronaut",
    emoji: "🚀",
    specialStartIds: ["spotlight_astronaut"],
    ageBands: [
      {
        id: "as_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🚀 Training, Quarantine, Home",
        variants: [
          {
            title: "🧼 The Pre‑Mission 'Bubble'",
            body: "Pre-mission protocols restrict contact. Your child doesn't understand 'safety'—they understand 'you won't hug me.'",
            choices: [
              { id:"practice", label:"Explain gently + create a no-touch ritual (notes, symbols, routines)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.22, logLine:"🧼 You protected safety without breaking connection." },
              { id:"simple", label:"Keep it brief and distract with fun", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.24, logLine:"🧼 You got through it—imperfectly." },
              { id:"avoid", label:"Act cold to 'make it easier' (it backfires)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"🧼 They learned distance as a default." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "as_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🌍 Parenting Across Distance",
        variants: [
          {
            title: "📡 The Call Drops",
            body: "You finally get a video call window. The call freezes. Your child's face crumples. Technology fails at the worst time.",
            choices: [
              { id:"practice", label:"Have backup rituals (letters, recorded messages, set times)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"📡 You built reliability where you could." },
              { id:"simple", label:"Apologize and try again tomorrow", deltas:{ empathy:0.1, discipline:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"📡 You kept it steady and human." },
              { id:"avoid", label:"Get frustrated (kid absorbs it)", deltas:{ empathy:-0.2 }, loveDelta:-0.05, stressDelta:0.26, logLine:"📡 The stress spread to the whole room." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "as_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🛰️ Fear, Pride, and a Teen Who Notices Everything",
        variants: [
          {
            title: "🧠 'I'm Scared Something Will Happen'",
            body: "Your teen admits they worry about your safety. It's not drama—it's love with sharp edges.",
            choices: [
              { id:"practice", label:"Validate fear + share honest, age-appropriate reassurance", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.20, logLine:"🧠 You turned fear into closeness." },
              { id:"simple", label:"Reassure briefly and keep routines normal", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.20, logLine:"🧠 You steadied the household." },
              { id:"avoid", label:"Dismiss it ('don't be dramatic')", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🧠 They stopped bringing you their real feelings." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_arctic_station_v1: {
    packId: "ss_spotlight_arctic_station_v1",
    packName: "Arctic Station Lead",
    emoji: "🧊",
    specialStartIds: ["spotlight_arctic_station"],
    ageBands: [
      {
        id: "arctic_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧊 Polar Night Parenting",
        variants: [
          {
            title: "🌙 The Never-Ending Night",
            body: "It's dark for so long your kid starts asking if the sun 'quit.' Cabin fever becomes a personality in your home.",
            choices: [
              { id:"practice", label:"Create a strong routine (light therapy vibes + rituals)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🌙 You built stability when the sky wouldn't." },
              { id:"simple", label:"Push through with distractions (screens, snacks, survival)", deltas:{ discipline:0.1 }, loveDelta:0.05, stressDelta:0.22, logLine:"🌙 You did what you had to do." },
              { id:"avoid", label:"Let the household drift (everyone spirals)", deltas:{ discipline:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.32, logLine:"🌙 The darkness got into the schedule." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧸 'Where Are My Friends?'",
            body: "Your child asks why there are no other kids. You feel the isolation hit you twice—once for you, once for them.",
            choices: [
              { id:"practice", label:"Build 'connection rituals' (calls, letters, planned contact)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"🧸 You made the world feel closer." },
              { id:"simple", label:"Explain simply and keep them busy", deltas:{ empathy:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🧸 You kept it steady and survivable." },
              { id:"avoid", label:"Dismiss it ('we're fine') (they feel alone)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.26, logLine:"🧸 Loneliness moved in quietly." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "arctic_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 Remote Learning, Remote Living",
        variants: [
          {
            title: "🛰️ The Connection Drops",
            body: "School is online. The weather says 'no internet today.' Your kid is frustrated and you're improvising education in a snow globe.",
            choices: [
              { id:"practice", label:"Plan offline learning blocks + structure (portable school)", deltas:{ intelligence:0.2, discipline:0.2 }, loveDelta:0.06, stressDelta:0.18, logLine:"🛰️ You turned disruption into a system." },
              { id:"simple", label:"Get through the day and catch up later", deltas:{ discipline:0.2 }, loveDelta:0.03, stressDelta:0.20, logLine:"🛰️ You kept the ship afloat." },
              { id:"avoid", label:"Let it slide for weeks (gaps grow)", deltas:{ intelligence:-0.2, discipline:-0.1 }, loveDelta:-0.04, stressDelta:0.24, logLine:"🛰️ Later-you sighed deeply." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧊 Station Responsibility Creep",
            body: "The station needs you. Your kid needs you. Remote life means there's no one else to cover the gap.",
            choices: [
              { id:"practice", label:"Schedule protected kid-time like it's mission-critical", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.10, stressDelta:0.20, logLine:"🧊 You treated your child like a real priority." },
              { id:"simple", label:"Do your duties first, then family time", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.22, logLine:"🧊 You balanced responsibility the best you could." },
              { id:"avoid", label:"Let work win (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.28, logLine:"🧊 The station got you. Home didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "arctic_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Cabin Fever Is Real",
        variants: [
          {
            title: "🚪 'I Need Space' (There Is No Space)",
            body: "Your teen wants privacy. The station offers: a door, and vibes. Tension builds fast in small rooms.",
            choices: [
              { id:"practice", label:"Create privacy rules + carve alone time (even if it's awkward)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🚪 You made dignity possible in tight quarters." },
              { id:"simple", label:"Compromise: quiet hours + headphones + routines", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"🚪 Not perfect, but it helped." },
              { id:"avoid", label:"Dismiss it ('we're fine') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🚪 Resentment moved in." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🌨️ Storm Week",
            body: "A brutal storm locks everything down. Your teen feels trapped. You feel responsible for everyone. It gets sharp.",
            choices: [
              { id:"practice", label:"Lead calmly + make a 'storm plan' together", deltas:{ confidence:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.22, logLine:"🌨️ You turned crisis into competence." },
              { id:"simple", label:"Keep everyone busy and ride it out", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.24, logLine:"🌨️ Survival: achieved." },
              { id:"avoid", label:"Snap under pressure (it spreads)", deltas:{ confidence:-0.2, empathy:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"🌨️ The storm wasn't the only thing raging." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_humanitarian_doctor_v1: {
    packId: "ss_spotlight_humanitarian_doctor_v1",
    packName: "Humanitarian Doctor",
    emoji: "🩺",
    specialStartIds: ["spotlight_humanitarian_doctor"],
    ageBands: [
      {
        id: "hd_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🩺 Saving Lives, Still a Parent",
        variants: [
          {
            title: "🧸 The 'Emergency Call' Night",
            body: "A crisis call comes in right as your kid finally calms down. You can be the hero somewhere else… or the hero in this room.",
            choices: [
              { id:"practice", label:"Protect bedtime + delegate (you're still helping)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-10000, logLine:"🧸 You chose your kid without abandoning the mission." },
              { id:"simple", label:"Take the call, then return fully (no half-parenting)", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"🧸 You did both, with a tired smile." },
              { id:"avoid", label:"Disappear into the work (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🧸 The world got you. Home didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "hd_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 'My Parent Helps People'",
        variants: [
          {
            title: "🎒 The Fundraiser Ask",
            body: "The school wants you to headline a fundraiser. Your kid wants you to just be a normal parent for once.",
            choices: [
              { id:"practice", label:"Do it quietly + set boundaries for your child's privacy", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.08, stressDelta:0.18, moneyDelta:-25000, logLine:"🎒 You helped without turning your child into a symbol." },
              { id:"simple", label:"Attend, keep it brief, and go home", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"🎒 You showed up without making it a spectacle." },
              { id:"avoid", label:"Make it a full public event (kid hates it)", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.06, stressDelta:0.28, logLine:"🎒 The crowd loved you. Your kid didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "hd_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Compassion Fatigue Meets Teen Reality",
        variants: [
          {
            title: "🧭 'Why Can't You Fix Everything?'",
            body: "Your teen asks why you can't always 'save everyone.' It's a hard question—and a chance to teach truth gently.",
            choices: [
              { id:"practice", label:"Talk honestly + teach healthy limits and self-care", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.20, logLine:"🧭 You taught compassion without martyrdom." },
              { id:"simple", label:"Keep it short: 'We do what we can'", deltas:{ empathy:0.1, discipline:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"🧭 You kept it steady and survivable." },
              { id:"avoid", label:"Shut it down (emotional distance)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.28, logLine:"🧭 They stopped trusting you with big feelings." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_royal_family_v1: {
    packId: "ss_spotlight_royal_family_v1",
    packName: "Royal Family",
    emoji: "👑",
    specialStartIds: ["spotlight_royal_family"],
    ageBands: [
      {
        id: "rf_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "👑 Protocol Begins Early",
        variants: [
          {
            title: "🍪 The 'Tiny Royal' Tantrum",
            body: "Your toddler discovers the power of attention. A minor tantrum becomes an international incident (according to palace staff).",
            choices: [
              { id:"practice", label:"Stay calm: gentle limits + private comfort (no spectacle)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.20, logLine:"🍪 You kept it human inside a palace." },
              { id:"simple", label:"Let staff handle it while you regroup", deltas:{ discipline:0.1 }, loveDelta:0.04, stressDelta:0.22, logLine:"🍪 The nanny executed Protocol Snack-Containment." },
              { id:"avoid", label:"Public scolding (kid shrinks)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"🍪 The cameras didn't forget. Neither did your kid." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rf_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Growing Up Watched",
        variants: [
          {
            title: "🎒 A 'Normal' Friend Invite",
            body: "Your child gets invited to a friend's house. Security says 'no.' Your kid says: 'Then what is my life?'",
            choices: [
              { id:"practice", label:"Create a safe version (supervised playdate) + validate feelings", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🎒 You made room for normal without ignoring reality." },
              { id:"simple", label:"Offer a royal compromise: invite friend to palace instead", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"🎒 The palace hosted a very polite pillow fight." },
              { id:"avoid", label:"Deny it with 'duty' (kid resents it)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.26, logLine:"🎒 Duty won. Warmth lost." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🗞️ Teen Years Under Scrutiny",
        variants: [
          {
            title: "📱 The Tabloid Bait Moment",
            body: "A tiny mistake gets photographed and spins into a story. Your teen is furious and embarrassed. They want to disappear.",
            choices: [
              { id:"practice", label:"Support them privately + build coping + tighten boundaries", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.22, logLine:"📱 You protected their dignity first." },
              { id:"simple", label:"Use the palace PR machine and move on", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.22, logLine:"📱 The PR team earned their pay." },
              { id:"avoid", label:"Blame your teen for 'embarrassing the family'", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.12, stressDelta:0.32, logLine:"📱 They learned perfection was the price of love." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_war_correspondent_v1: {
    packId: "ss_spotlight_war_correspondent_v1",
    packName: "War Correspondent",
    emoji: "📰",
    specialStartIds: ["spotlight_war_correspondent"],
    ageBands: [
      {
        id: "wc_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "📰 Home Between Headlines",
        variants: [
          {
            title: "🪖 The Helmet Is 'A Hat'",
            body: "Your kid finds your safety helmet and proudly wears it around the house. It's cute… and it hits you emotionally like a truck.",
            choices: [
              { id:"practice", label:"Keep it gentle: explain it's for safety, not play (then cuddle)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.12, stressDelta:0.20, logLine:"🪖 You protected their innocence without lying." },
              { id:"simple", label:"Take a silly photo and move on", deltas:{ confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🪖 You smiled through complicated feelings." },
              { id:"avoid", label:"Snap and yank it away (they feel the fear)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🪖 The fear leaked into the room." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wc_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 'What Does Your Parent Do?'",
        variants: [
          {
            title: "🎒 The Class Project",
            body: "The class does a 'Parent Job' presentation. Your kid asks what to say about you without making everyone panic.",
            choices: [
              { id:"practice", label:"Help them frame it: 'I tell true stories to help people understand'", deltas:{ confidence:0.2, intelligence:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🎒 You made it meaningful, not scary." },
              { id:"simple", label:"Keep it vague: 'writer' / 'journalist'", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"🎒 You chose simplicity and safety." },
              { id:"avoid", label:"Overshare (kid gets overwhelmed)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"🎒 You gave them adult weight too early." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "wc_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Sees the World Up Close",
        variants: [
          {
            title: "🧠 'I Read Your Article'",
            body: "Your teen reads something you wrote and gets shaken. They ask: 'How do you carry this and come home?'",
            choices: [
              { id:"practice", label:"Talk honestly + model coping (boundaries, support, rest)", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.22, logLine:"🧠 You taught them resilience without glamorizing pain." },
              { id:"simple", label:"Reassure briefly and focus on routines", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.22, logLine:"🧠 You steadied the household the best you could." },
              { id:"avoid", label:"Dismiss it ('it's my job') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🧠 They stopped bringing you the real questions." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_spy_v1: {
    packId: "ss_spotlight_spy_v1",
    packName: "Intelligence Officer",
    emoji: "🕵️",
    specialStartIds: ["spotlight_spy"],
    ageBands: [
      {
        id: "spy_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🕵️ Two Lives, One Bedtime",
        variants: [
          {
            title: "🧩 The Cover Story Game",
            body: "Your kid repeats your cover story in the most public places possible. It's adorable—until it isn't.",
            choices: [
              { id:"practice", label:"Turn it into a safe 'secret hero name' game (no fear, just rules)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.12, stressDelta:0.20, logLine:"🧩 You taught caution without teaching fear." },
              { id:"simple", label:"Gently redirect and change the subject", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"🧩 You kept it simple and moved on." },
              { id:"avoid", label:"React sharply (they feel the panic)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🧩 The danger stayed invisible—but the fear didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🚪 The 'Friendly' Neighbor Question",
            body: "A neighbor asks what you do for work. Your kid is right there. Your face does the math instantly.",
            choices: [
              { id:"practice", label:"Answer calmly with the cover story + teach your kid a neutral script", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚪 You made normal life safer with one sentence." },
              { id:"simple", label:"Deflect politely and end the conversation", deltas:{ discipline:0.1 }, loveDelta:0.02, stressDelta:0.24, logLine:"🚪 You escaped with minimal social damage." },
              { id:"avoid", label:"Lie messily (it becomes memorable)", deltas:{ confidence:-0.2 }, loveDelta:-0.02, stressDelta:0.28, logLine:"🚪 The story didn't land—and now it's sticky." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "spy_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Paperwork, Questions, and Secrets",
        variants: [
          {
            title: "📝 School Form: 'Parent Occupation'",
            body: "The form is simple. The truth is not. Your child watches you hesitate.",
            choices: [
              { id:"practice", label:"Write something true-but-safe and explain privacy rules gently", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"📝 You modeled honesty with boundaries." },
              { id:"simple", label:"Keep it vague and move on", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"📝 You chose safety through simplicity." },
              { id:"avoid", label:"Make it dramatic (kid gets anxious)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"📝 You gave a child an adult problem." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎒 A Friend's Parent Is Curious",
            body: "A friend's parent keeps probing your background. Your kid notices you getting tense.",
            choices: [
              { id:"practice", label:"Hold boundaries politely + decompress with your kid afterward", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.08, stressDelta:0.20, logLine:"🎒 You protected safety and the relationship." },
              { id:"simple", label:"Reduce contact (quietly)", deltas:{ discipline:0.2 }, loveDelta:0.02, stressDelta:0.22, logLine:"🎒 You chose distance to reduce risk." },
              { id:"avoid", label:"Public confrontation (attention spikes)", deltas:{ confidence:-0.1, empathy:-0.1 }, loveDelta:-0.04, stressDelta:0.30, logLine:"🎒 You shut it down—but everyone noticed." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "spy_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Trust vs Secrecy",
        variants: [
          {
            title: "🧠 'I Think I Know What You Do'",
            body: "Your teen hints they've figured it out. They want honesty. You want safety. Both are real.",
            choices: [
              { id:"practice", label:"Tell a careful truth: enough to build trust, not enough to endanger", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.24, logLine:"🧠 You chose trust—safely." },
              { id:"simple", label:"Acknowledge feelings, keep details private, focus on safety rules", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🧠 You stayed firm without being cold." },
              { id:"avoid", label:"Shut them down completely (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🧠 They stopped bringing you the real questions." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📲 Teen Wants to 'Overshare'",
            body: "They want to post online about the cool mysterious things in your life. You see the risk instantly. They see a trend.",
            choices: [
              { id:"practice", label:"Co-design clear rules and explain why (respectfully)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.10, stressDelta:0.22, logLine:"📲 You built boundaries without a power war." },
              { id:"simple", label:"Hard no, with a calm explanation", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.24, logLine:"📲 You protected the mission and the household." },
              { id:"avoid", label:"Rage-ban everything (they go secret anyway)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"📲 Control rose. Trust dropped." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_esports_v1: {
    packId: "ss_spotlight_esports_v1",
    packName: "Esports Champion",
    emoji: "🎮",
    specialStartIds: ["spotlight_esports"],
    ageBands: [
      {
        id: "es_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🎮 Training Schedule Meets Childhood",
        variants: [
          {
            title: "⏱️ The 'One More Match' Problem",
            body: "Your team wants an extra scrim block. Your child wants you to be fully here. Your headset feels heavier than it should.",
            choices: [
              { id:"practice", label:"End practice on time (protect family ritual)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-8000, logLine:"⏱️ You chose presence over perfection." },
              { id:"simple", label:"Do the scrim, but schedule protected kid-time after", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"⏱️ You balanced both with structure." },
              { id:"avoid", label:"Keep grinding (kid becomes background noise)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.34, logLine:"⏱️ Your rank rose. Your closeness didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "es_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📣 Fame Leaks Into School",
        variants: [
          {
            title: "🏫 'Your Parent Is Famous Online'",
            body: "A classmate recognizes you from a clip. Your child asks why strangers know your face.",
            choices: [
              { id:"practice", label:"Explain privacy + create a family safety plan", deltas:{ intelligence:0.2, confidence:0.2 }, loveDelta:0.06, stressDelta:0.18, logLine:"📣 You turned online fame into real-world boundaries." },
              { id:"simple", label:"Keep it simple and keep moving", deltas:{ confidence:0.2 }, loveDelta:0.03, stressDelta:0.18, logLine:"📣 You normalized the weirdness." },
              { id:"avoid", label:"Lean into it (attention everywhere)", deltas:{ confidence:0.2, empathy:-0.1 }, loveDelta:-0.02, stressDelta:0.26, logLine:"📣 School pickup started feeling like a meet-and-greet." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "es_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🔥 Burnout, Boundaries, and a Teen Watching You",
        variants: [
          {
            title: "🧯 Burnout Week",
            body: "You're exhausted. Your teen notices. This becomes a lesson—either about healthy limits or endless grind.",
            choices: [
              { id:"practice", label:"Model boundaries (rest is strategy)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-6000, logLine:"🧯 You taught them that limits are strength." },
              { id:"simple", label:"Power through, then take a short break", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.24, logLine:"🧯 You survived the week—barely." },
              { id:"avoid", label:"Ignore burnout (it spills into home)", deltas:{ empathy:-0.3 }, loveDelta:-0.08, stressDelta:0.34, logLine:"🧯 The grind started parenting for you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_music_icon_v1: {
    packId: "ss_spotlight_music_icon_v1",
    packName: "Music Icon",
    emoji: "🎤",
    specialStartIds: ["spotlight_music_icon"],
    ageBands: [
      {
        id: "mi_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🎤 Fame Meets Finger Paint",
        variants: [
          {
            title: "🚌 The Tour Bus Bedtime",
            body: "You're backstage. Your toddler is overtired in a dressing room full of glitter, cords, and adult chaos. You can be a legend on stage… or a legend at bedtime.",
            choices: [
              { id:"practice", label:"Cancel the after-party and do bedtime yourself", deltas:{ empathy:0.2, discipline:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-15000, logLine:"🚌 You chose your child over the afterglow." },
              { id:"simple", label:"Hand off to a trusted caregiver and do a short calm check-in", deltas:{ responsibility:0.2, discipline:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚌 You kept the machine moving and stayed emotionally present." },
              { id:"avoid", label:"Prioritize the night (kid feels like a schedule item)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"🚌 The crowd got you. Your kid didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📸 Paparazzi at the Door",
            body: "Someone gets a photo of your child. Your team says it's 'inevitable.' Your gut says: 'absolutely not.'",
            choices: [
              { id:"practice", label:"Increase privacy measures and set a hard boundary (no kid content)", deltas:{ responsibility:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.20, moneyDelta:-25000, logLine:"📸 You protected childhood over clicks." },
              { id:"simple", label:"Limit exposure quietly and change routines", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:-12000, logLine:"📸 You tightened the perimeter without panic." },
              { id:"avoid", label:"Lean into 'cute family' branding (pressure rises)", deltas:{ social:0.2, empathy:-0.2 }, loveDelta:-0.06, stressDelta:0.34, moneyDelta:45000, logLine:"📸 The audience loved it. The weight increased." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mi_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 School Life Under a Spotlight",
        variants: [
          {
            title: "🎭 Missed Big Moment",
            body: "A school event lands on a major show night. Your child tries to act cool. They're not cool. They're sad.",
            choices: [
              { id:"practice", label:"Move heaven and earth: attend the event (even briefly) and be fully present", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.10, stressDelta:0.22, moneyDelta:-30000, logLine:"🎭 You showed up when it mattered." },
              { id:"simple", label:"Send a heartfelt video + plan a real make-up day", deltas:{ empathy:0.1, responsibility:0.1 }, loveDelta:0.05, stressDelta:0.20, moneyDelta:-5000, logLine:"🎭 You couldn't be there, but you stayed connected." },
              { id:"avoid", label:"Brush it off ('this is the job') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.26, logLine:"🎭 They stopped inviting you emotionally." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎒 Classmates Want 'Backstage Access'",
            body: "Kids treat your child like a ticket. Your child wants friends, not fans.",
            choices: [
              { id:"practice", label:"Teach boundaries + protect privacy (no passes, no flex)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🎒 You kept friendships real." },
              { id:"simple", label:"Limit access quietly and keep routines normal", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.18, logLine:"🎒 You reduced the circus." },
              { id:"avoid", label:"Offer access to be liked (it gets messy fast)", deltas:{ responsibility:-0.1, discipline:-0.1 }, loveDelta:-0.04, stressDelta:0.24, logLine:"🎒 Popularity rose. Stability fell." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mi_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Identity vs Your Fame",
        variants: [
          {
            title: "🚪 'Stop Making Me Part of Your Brand'",
            body: "Your teen wants privacy. Your team wants 'authentic family moments.' Your teen wants a door that closes.",
            choices: [
              { id:"practice", label:"Back your teen publicly and enforce strict privacy boundaries", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-18000, logLine:"🚪 You chose your child over the content strategy." },
              { id:"simple", label:"Compromise: no teen content, but your life stays public", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚪 You built rules you can both live with." },
              { id:"avoid", label:"Override them ('it's part of the life') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.12, stressDelta:0.34, logLine:"🚪 The image stayed perfect. The relationship didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎵 Teen Wants the Stage",
            body: "Your teen asks to perform publicly. They want you as a parent, not a manager. You realize this needs boundaries and care.",
            choices: [
              { id:"practice", label:"Support skill-building first (training, mentors, consent, boundaries)", deltas:{ responsibility:0.2, discipline:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-12000, logLine:"🎵 You chose growth over shortcuts." },
              { id:"simple", label:"Allow a small, controlled performance with strict safeguards", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.06, stressDelta:0.24, logLine:"🎵 You opened a door carefully." },
              { id:"avoid", label:"Push them hard (relationship strain)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"🎵 The dream got louder. The trust got quieter." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_tech_founder_v1: {
    packId: "ss_spotlight_tech_founder_v1",
    packName: "Tech Founder",
    emoji: "🧑‍💻",
    specialStartIds: ["spotlight_tech_founder"],
    ageBands: [
      {
        id: "tf_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧑‍💻 Startup Brain, Baby Schedule",
        variants: [
          {
            title: "📞 The Investor Call at Bedtime",
            body: "An investor wants you now. Your child wants you now. Only one of them will remember your choice forever.",
            choices: [
              { id:"practice", label:"Protect bedtime (delegate the call, set boundaries)", deltas:{ empathy:0.2, discipline:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"📞 You treated family time like a real meeting." },
              { id:"simple", label:"Take the call briefly, then return fully present", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"📞 You did both. You felt it." },
              { id:"avoid", label:"Stay on calls all night (kid learns: work wins)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"📞 The pitch improved. The closeness didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "tf_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Wealth and Visibility Collide",
        variants: [
          {
            title: "🎓 The Donation Conversation",
            body: "The school hints you could fund a new wing. Your kid asks if money is how you 'earn friends.' You realize you're teaching values, not accounting.",
            choices: [
              { id:"practice", label:"Donate modestly + keep it private + teach humility", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-45000, logLine:"🎓 You modeled giving without flexing." },
              { id:"simple", label:"Donate and move on (keep routines normal)", deltas:{ responsibility:0.2 }, loveDelta:0.05, stressDelta:0.18, moneyDelta:-110000, logLine:"🎓 You helped and stayed grounded." },
              { id:"avoid", label:"Make it a public named-wing moment (kid feels like a brand)", deltas:{ empathy:-0.2, social:0.1 }, loveDelta:-0.06, stressDelta:0.26, moneyDelta:-250000, logLine:"🎓 The building looked great. Your kid felt weird." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📸 Parents Want Your Contacts",
            body: "Other parents keep asking for jobs, intros, and 'just five minutes' of your time. Your kid watches who gets your attention.",
            choices: [
              { id:"practice", label:"Set kind boundaries + reserve protected kid-time", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.08, stressDelta:0.20, logLine:"📸 You taught boundaries without becoming cold." },
              { id:"simple", label:"Help a little, but limit it", deltas:{ responsibility:0.2 }, loveDelta:0.04, stressDelta:0.22, logLine:"📸 You tried to be generous without drowning." },
              { id:"avoid", label:"Let it consume you (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.28, logLine:"📸 The crowd got you. Home didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "tf_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Values vs Founder Culture",
        variants: [
          {
            title: "🔥 'Your Company Hurts People'",
            body: "Your teen challenges your company's impact. They want the truth, not the PR version. This is a parenting moment, not a keynote.",
            choices: [
              { id:"practice", label:"Listen + accept accountability + commit to real change", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.24, moneyDelta:-65000, logLine:"🔥 You modeled power with responsibility." },
              { id:"simple", label:"Explain calmly and keep the conversation open", deltas:{ confidence:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.24, logLine:"🔥 You stayed steady under hard questions." },
              { id:"avoid", label:"Dismiss them ('you don't get business') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.32, logLine:"🔥 They stopped trusting you with big questions." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_business_mogul_v1: {
    packId: "ss_spotlight_business_mogul_v1",
    packName: "Business Mogul",
    emoji: "🏢",
    specialStartIds: ["spotlight_business_mogul"],
    ageBands: [
      {
        id: "bm_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🏢 Boardroom vs Playroom",
        variants: [
          {
            title: "📅 The 'Unmissable' Meeting",
            body: "Your assistant says it's unmissable. Your child says 'don't go.' You realize adulthood has many definitions of 'important.'",
            choices: [
              { id:"practice", label:"Protect kid-time (delegate, reschedule, be present)", deltas:{ empathy:0.2, discipline:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"📅 You chose the relationship over the calendar." },
              { id:"simple", label:"Attend briefly, then return fully present", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"📅 You did both, and felt the cost." },
              { id:"avoid", label:"Let work dominate (kid learns: they're second)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"📅 The company got you. Home didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "bm_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 The Wealth Gap Shows Up",
        variants: [
          {
            title: "🎒 'Are We Better?'",
            body: "Your child notices your lifestyle is different. They ask if it means you're better. You get one sentence to shape a decade.",
            choices: [
              { id:"practice", label:"Teach humility + kindness + privacy (values over status)", deltas:{ empathy:0.2, discipline:0.2, responsibility:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🎒 You built character, not entitlement." },
              { id:"simple", label:"Keep it light: 'we're lucky' + move on", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.18, logLine:"🎒 You kept it gentle." },
              { id:"avoid", label:"Lean into superiority (it sticks)", deltas:{ empathy:-0.3, discipline:-0.1 }, loveDelta:-0.06, stressDelta:0.24, logLine:"🎒 They learned status instead of gratitude." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎓 'Name the Building' Offer",
            body: "The school offers to name a building after you if you fund it. Your child asks if you're buying love from strangers.",
            choices: [
              { id:"practice", label:"Donate quietly without naming (teach giving, not ego)", deltas:{ responsibility:0.2, empathy:0.2 }, loveDelta:0.08, stressDelta:0.18, moneyDelta:-90000, logLine:"🎓 You gave without turning it into a trophy." },
              { id:"simple", label:"Take the naming but keep your child private and grounded", deltas:{ discipline:0.2, responsibility:0.1 }, loveDelta:0.04, stressDelta:0.22, moneyDelta:-250000, logLine:"🎓 You tried to make ego-free space inside a public act." },
              { id:"avoid", label:"Make it a massive spectacle (kid feels like a brand)", deltas:{ empathy:-0.2, social:0.1 }, loveDelta:-0.06, stressDelta:0.28, moneyDelta:-520000, logLine:"🎓 The applause was loud. The pressure was louder." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "bm_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Morality Meets Corporate Reality",
        variants: [
          {
            title: "🔥 'Did You Lay People Off?'",
            body: "Your teen hears a rumor about layoffs or closures. They ask you directly. They want truth and values, not corporate language.",
            choices: [
              { id:"practice", label:"Tell the truth + model responsibility + show real care", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.24, moneyDelta:-35000, logLine:"🔥 You modeled power with accountability." },
              { id:"simple", label:"Explain calmly and keep dialogue open", deltas:{ confidence:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.24, logLine:"🔥 You stayed steady under hard questions." },
              { id:"avoid", label:"Dismiss them ('you don't understand business') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.32, logLine:"🔥 They stopped bringing you their conscience." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_megachurch_pastor_v1: {
    packId: "ss_spotlight_megachurch_pastor_v1",
    packName: "Mega-Church Pastor",
    emoji: "✝️",
    specialStartIds: ["spotlight_megachurch_pastor"],
    ageBands: [
      {
        id: "mcp_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "✝️ Sermons and Sticky Fingers",
        variants: [
          {
            title: "🎤 The 'Perfect Family' Pressure",
            body: "A staff member suggests featuring your family more. It 'inspires the congregation.' Your toddler suggests eating crayons during the livestream.",
            choices: [
              { id:"practice", label:"Protect privacy: focus on values, not family branding", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-12000, logLine:"🎤 You chose your child over the image." },
              { id:"simple", label:"Allow limited family appearances with firm boundaries", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, moneyDelta:18000, logLine:"🎤 You balanced leadership and parenting carefully." },
              { id:"avoid", label:"Turn the child into a symbol (relationship cost)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, moneyDelta:42000, logLine:"🎤 The audience loved it. Your child didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mcp_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 The Pastor's Kid at School",
        variants: [
          {
            title: "📝 'Your Parent Said This…'",
            body: "A classmate repeats a quote from your sermon and uses it to shame another kid. Your child is mortified. You realize your public words just entered a playground.",
            choices: [
              { id:"practice", label:"Apologize, clarify publicly, and teach compassion at home", deltas:{ empathy:0.2, responsibility:0.2, social:0.1 }, loveDelta:0.10, stressDelta:0.20, logLine:"📝 You repaired harm instead of defending pride." },
              { id:"simple", label:"Talk to the school and keep it quiet", deltas:{ responsibility:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"📝 You contained the situation quickly." },
              { id:"avoid", label:"Blame the kids/school (community backlash)", deltas:{ empathy:-0.2, social:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"📝 The conflict expanded instead of shrinking." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mcp_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Beliefs and Boundaries",
        variants: [
          {
            title: "🔥 'I Don't Believe What You Preach'",
            body: "Your teen tells you they believe something different. They aren't trying to hurt you. They're trying to be honest.",
            choices: [
              { id:"practice", label:"Respect autonomy and keep love unconditional", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.22, logLine:"🔥 You chose relationship over control." },
              { id:"simple", label:"Agree to disagree and focus on shared values", deltas:{ empathy:0.1, discipline:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🔥 You built a workable peace." },
              { id:"avoid", label:"Make love conditional (relationship collapses)", deltas:{ empathy:-0.4, confidence:-0.2 }, loveDelta:-0.14, stressDelta:0.34, logLine:"🔥 They learned honesty wasn't safe with you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_nobel_scientist_v1: {
    packId: "ss_spotlight_nobel_scientist_v1",
    packName: "Nobel Scientist",
    emoji: "🧪",
    specialStartIds: ["spotlight_nobel_scientist"],
    ageBands: [
      {
        id: "ns_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧪 Lab Brain, Toddler Heart",
        variants: [
          {
            title: "🍼 The Experiment at Bedtime",
            body: "A call comes in: a grant panel wants a last-minute change. Your child wants you to stay until they fall asleep. Your brain says 'deadline.' Your heart says 'this is the real work.'",
            choices: [
              { id:"practice", label:"Protect bedtime and push the email later (boundaries)", deltas:{ empathy:0.2, discipline:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.18, logLine:"🍼 You treated your kid like the priority, not the afterthought." },
              { id:"simple", label:"Handle it fast, then return fully present", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"🍼 You did both, and paid in fatigue." },
              { id:"avoid", label:"Work through bedtime (kid learns: science wins)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"🍼 The work got done. The closeness didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🏆 The Medal Is a Chew Toy",
            body: "Your toddler grabs a shiny award and tries to bite it like it's a snack. You realize your legacy is currently teething-tested.",
            choices: [
              { id:"practice", label:"Laugh and set gentle limits (then cuddle)", deltas:{ empathy:0.2, discipline:0.1 }, loveDelta:0.10, stressDelta:0.16, logLine:"🏆 You kept it human." },
              { id:"simple", label:"Move it out of reach and move on", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.16, logLine:"🏆 Legacy: secured on a shelf." },
              { id:"avoid", label:"Snap about it (fear enters the room)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.24, logLine:"🏆 The award survived. The warmth didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ns_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Genius Parent, Normal Kid Problems",
        variants: [
          {
            title: "🧬 Science Fair Expectations",
            body: "Your child's teacher assumes your kid will dominate the science fair. Your child just wants to make a volcano and go home.",
            choices: [
              { id:"practice", label:"Support their idea (no pressure, just pride)", deltas:{ empathy:0.2, confidence:0.2, discipline:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🧬 You protected joy from performance." },
              { id:"simple", label:"Help them win (carefully) and keep it light", deltas:{ confidence:0.2, discipline:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"🧬 You guided them toward excellence without crushing them." },
              { id:"avoid", label:"Push hard for perfection (kid shuts down)", deltas:{ empathy:-0.2, confidence:-0.2 }, loveDelta:-0.08, stressDelta:0.28, logLine:"🧬 The project improved. The kid didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🎓 'Can You Donate a Lab?'",
            body: "The school hints you could fund a new science lab. Your child asks if donations mean you'll be around less.",
            choices: [
              { id:"practice", label:"Donate modestly + protect family time publicly", deltas:{ responsibility:0.2, empathy:0.2 }, loveDelta:0.08, stressDelta:0.18, moneyDelta:-25000, logLine:"🎓 You gave without trading away your kid." },
              { id:"simple", label:"Donate quietly and keep the schedule steady", deltas:{ responsibility:0.2 }, loveDelta:0.05, stressDelta:0.18, moneyDelta:-60000, logLine:"🎓 You helped and kept it calm." },
              { id:"avoid", label:"Make it a public spectacle (kid feels like a prop)", deltas:{ empathy:-0.2, social:0.1 }, loveDelta:-0.06, stressDelta:0.26, moneyDelta:-120000, logLine:"🎓 The school got a headline. Your kid got pressure." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ns_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Ethics and Identity",
        variants: [
          {
            title: "🔥 'Is Your Work Ethical?'",
            body: "Your teen challenges you about the real-world impact of science. They want you to answer as a parent, not as a keynote speaker.",
            choices: [
              { id:"practice", label:"Listen deeply + model accountability + commit to guardrails", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-40000, logLine:"🔥 You taught power with responsibility." },
              { id:"simple", label:"Explain calmly and keep the conversation open", deltas:{ confidence:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🔥 You stayed steady under hard questions." },
              { id:"avoid", label:"Dismiss them ('you don't understand') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🔥 They stopped trusting you with big questions." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_interstellar_voyage_parent_v1: {
    packId: "ss_interstellar_voyage_parent_v1",
    packName: "Interstellar Voyage",
    emoji: "🚀",
    specialStartIds: ["interstellar_voyage_parent"],
    ageBands: [
      {
        id: "iv_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🚀 Parenting in a Tin Can (A Very Fancy Tin Can)",
        variants: [
          {
            title: "🧲 The 'Gravity Day' Glitch",
            body: "Artificial gravity stutters for a moment. Your toddler thinks it's hilarious. You feel your soul briefly exit your body.",
            choices: [
              { id:"practice", label:"Explain calmly + make a 'safety drill' a game", deltas:{ discipline:0.2, confidence:0.1, empathy:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🧲 You made safety feel empowering." },
              { id:"simple", label:"Laugh it off and move on", deltas:{ confidence:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🧲 You kept the mood light." },
              { id:"avoid", label:"Panic openly (kid absorbs fear)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.28, logLine:"🧲 The glitch ended. The anxiety didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "iv_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 School Without a Planet",
        variants: [
          {
            title: "🌍 'What Is Earth Like?'",
            body: "Your child asks what rain smells like. You realize you're the museum curator of a whole planet.",
            choices: [
              { id:"practice", label:"Build 'Earth lessons' (stories + science + memory)", deltas:{ intelligence:0.2, empathy:0.1, discipline:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🌍 You gave them roots made of knowledge." },
              { id:"simple", label:"Keep it simple and comforting", deltas:{ empathy:0.1 }, loveDelta:0.06, stressDelta:0.18, logLine:"🌍 You gave them a gentle answer." },
              { id:"avoid", label:"Dismiss the question (kid feels the loss)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.22, logLine:"🌍 The silence felt heavier than space." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "iv_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Wants a Future, Not Just a Mission",
        variants: [
          {
            title: "🚪 'I Want Choices'",
            body: "Your teen asks what their life is for besides the mission. They want freedom. You want cohesion. The ship wants compliance. Nobody is fully wrong.",
            choices: [
              { id:"practice", label:"Co-design goals + let them choose a path on the ship", deltas:{ empathy:0.2, confidence:0.2, discipline:0.1 }, loveDelta:0.12, stressDelta:0.22, logLine:"🚪 You made autonomy possible inside constraints." },
              { id:"simple", label:"Offer a few approved options and keep it calm", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚪 You gave them a menu instead of a wall." },
              { id:"avoid", label:"Demand obedience ('this is bigger than you') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🚪 The mission stayed intact. The relationship cracked." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_guru_v1: {
    packId: "ss_spotlight_guru_v1",
    packName: "Spiritual Guru",
    emoji: "🧘",
    specialStartIds: ["spotlight_guru"],
    ageBands: [
      {
        id: "guru_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧘 Peace Brand, Toddler Chaos",
        variants: [
          {
            title: "🤫 'Silent Retreat' Meets Loud Child",
            body: "Your retreat promises silence. Your toddler promises the opposite. Followers look to you for serenity… and you are running on crumbs.",
            choices: [
              { id:"practice", label:"Cancel the session and choose your kid (values over image)", deltas:{ empathy:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-25000, logLine:"🤫 You chose parenting over performance." },
              { id:"simple", label:"Delegate and keep the retreat running", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.24, logLine:"🤫 You kept the machine moving and tried not to feel guilty." },
              { id:"avoid", label:"Force 'calm' (it escalates)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🤫 The brand looked calm. The home did not." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📸 Followers Want 'Family Content'",
            body: "A team suggests posting your child more: 'People love authentic family moments.' Your instincts scream: privacy.",
            choices: [
              { id:"practice", label:"Set a hard boundary: no child content (privacy first)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-15000, logLine:"📸 You protected childhood over clicks." },
              { id:"simple", label:"Very limited, controlled sharing (no identity details)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.22, moneyDelta:20000, logLine:"📸 You balanced brand and boundaries—carefully." },
              { id:"avoid", label:"Go all-in on the 'guru family' narrative", deltas:{ confidence:0.2, empathy:-0.2 }, loveDelta:-0.06, stressDelta:0.34, moneyDelta:60000, logLine:"📸 The audience loved it. The pressure grew." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "guru_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Wisdom at the School Gate",
        variants: [
          {
            title: "🧃 Another Parent Wants a 'Blessing'",
            body: "At pickup, someone asks you to 'fix' their life in 30 seconds. Your child watches what you do with your time.",
            choices: [
              { id:"practice", label:"Kind boundary: 'I'm a parent right now' (then focus on your kid)", deltas:{ discipline:0.2, empathy:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🧃 You modeled boundaries with kindness." },
              { id:"simple", label:"Give a quick supportive line and move on", deltas:{ empathy:0.1 }, loveDelta:0.05, stressDelta:0.18, logLine:"🧃 You offered help without being consumed by it." },
              { id:"avoid", label:"Perform for the crowd (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"🧃 The audience got you. Your child didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "📚 Your Kid Asks: 'Are You Always Calm?'",
            body: "They've seen your public persona. Now they want to know if it's real at home too.",
            choices: [
              { id:"practice", label:"Honest answer: 'I practice.' Apologize when needed.", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"📚 You taught them calm is practice, not perfection." },
              { id:"simple", label:"Reassure them and move on", deltas:{ confidence:0.1, empathy:0.1 }, loveDelta:0.06, stressDelta:0.18, logLine:"📚 You kept the moment gentle." },
              { id:"avoid", label:"Insist you're always calm (they notice the lie)", deltas:{ confidence:-0.2, empathy:-0.1 }, loveDelta:-0.06, stressDelta:0.22, logLine:"📚 The gap between image and reality widened." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "guru_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🗞️ Teen Sees Through the Brand",
        variants: [
          {
            title: "🔥 A Small Scandal Starts",
            body: "A rumor spreads about you. Your teen asks if you're actually who you claim to be. It's uncomfortable—because it matters.",
            choices: [
              { id:"practice", label:"Be transparent at home + handle it responsibly", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.22, logLine:"🔥 You protected trust, not just reputation." },
              { id:"simple", label:"Let PR handle it and keep home calm", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.04, stressDelta:0.24, logLine:"🔥 You contained the fire with professionals." },
              { id:"avoid", label:"Gaslight your teen ('it's nothing')", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🔥 They stopped trusting your 'truth'." },
              { id:"skip", label:"Skip this check-in" }
            ]
          },
          {
            title: "🧠 'Do You Practice What You Teach?'",
            body: "Your teen points out a moment you weren't calm. This is either a fight… or a lesson.",
            choices: [
              { id:"practice", label:"Own it + apologize + show your practice in real time", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"🧠 You turned conflict into repair." },
              { id:"simple", label:"Acknowledge it briefly and move forward", deltas:{ empathy:0.1, discipline:0.1 }, loveDelta:0.05, stressDelta:0.20, logLine:"🧠 You kept it steady." },
              { id:"avoid", label:"Defend your ego (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.28, logLine:"🧠 The brand stayed intact. The relationship didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_president_v1: {
    packId: "ss_spotlight_president_v1",
    packName: "Head of State",
    emoji: "🗳️",
    specialStartIds: ["spotlight_president"],
    ageBands: [
      {
        id: "pres_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🧸 Childhood in a Security Bubble",
        variants: [
          {
            title: "🚔 The Playground Sweep",
            body: "You try to take your toddler to a playground. Security arrives first. Your child just wants the slide. Everyone else wants to stare.",
            choices: [
              { id:"practice", label:"Keep it short + make a private 'real playtime' after", deltas:{ empathy:0.2, discipline:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.2, moneyDelta:-25, logLine:"🚔 You protected their childhood from becoming an event." },
              { id:"simple", label:"Let staff manage the outing while you take briefings", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.24, logLine:"🚔 The slide happened. So did the meeting." },
              { id:"avoid", label:"Turn it into a photo-op (kid becomes 'the image')", deltas:{ empathy:-0.2, confidence:-0.1, social:0.1 }, loveDelta:-0.06, stressDelta:0.34, logLine:"🚔 The cameras got the moment. Your kid didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "pres_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Public Duty Meets School Life",
        variants: [
          {
            title: "🎭 Metal Detectors at the School Play",
            body: "Your child is in the school play. Security adds metal detectors. Other parents look annoyed. Your kid looks at you like: 'Did you bring this here?'",
            choices: [
              { id:"practice", label:"Arrive early, thank staff, reassure your kid, keep it low-key", deltas:{ empathy:0.2, social:0.1, discipline:0.1 }, loveDelta:0.08, stressDelta:0.2, moneyDelta:-15, logLine:"🎭 You made safety feel as normal as possible." },
              { id:"simple", label:"Send a trusted representative and attend privately later", deltas:{ discipline:0.2 }, loveDelta:0.03, stressDelta:0.18, logLine:"🎭 You chose calm over attention." },
              { id:"avoid", label:"Demand VIP treatment (school community resents it)", deltas:{ empathy:-0.2, social:-0.1, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.28, logLine:"🎭 The play ended. The tension didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "pres_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Years Under a Microscope",
        variants: [
          {
            title: "🔥 Your Teen Trends",
            body: "Your teen posts something emotional online. It becomes a headline. Staff want a statement. Your teen wants you to be a parent, not a press office.",
            choices: [
              { id:"practice", label:"Handle it privately first: validate, set boundaries, protect them", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.1, stressDelta:0.24, moneyDelta:-20, logLine:"🔥 You chose relationship before reputation." },
              { id:"simple", label:"Let PR handle it + do a real check-in after the fire dies down", deltas:{ discipline:0.2, responsibility:0.1 }, loveDelta:0.04, stressDelta:0.26, logLine:"🔥 Professionals put out the blaze. You rebuilt trust afterward." },
              { id:"avoid", label:"Correct them publicly (they feel betrayed)", deltas:{ empathy:-0.3, confidence:-0.2, happiness:-0.1 }, loveDelta:-0.12, stressDelta:0.34, logLine:"🔥 The world saw leadership. Your teen saw rejection." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_duty_remote_research_outpost_v1: {
    packId: "ss_duty_remote_research_outpost_v1",
    packName: "Remote Research Outpost",
    emoji: "🛰️",
    specialStartIds: ["duty_remote_research_outpost"],
    ageBands: [
      {
        id: "outpost_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🏝️ Best Friend: A Lizard",
        variants: [
          {
            title: "🦎 The 'Pet' That Is Not A Pet",
            body: "Your toddler names a local lizard and declares it family. The outpost scientist in you respects the biodiversity. The parent in you respects the potential germs.",
            choices: [
              { id:"practice", label:"Set gentle rules (wash hands, observe—don't grab)", deltas:{ discipline:0.2, curiosity:0.1, empathy:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🦎 You taught wonder with boundaries." },
              { id:"simple", label:"Let it be… mostly (keep an eye on it)", deltas:{ curiosity:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🦎 The lizard remained unharmed. So did your sanity." },
              { id:"avoid", label:"Ban it completely (kid feels controlled)", deltas:{ confidence:-0.1, empathy:-0.1 }, loveDelta:-0.06, stressDelta:0.22, logLine:"🦎 Wonder got grounded." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "outpost_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 School, But Make It Satellite",
        variants: [
          {
            title: "🛰️ The Internet Drops Mid-Lesson",
            body: "Remote school freezes again. Your child stares at the loading icon like it personally betrayed them. You are now both teacher and IT support.",
            choices: [
              { id:"practice", label:"Build an offline learning system (projects, routines, backups)", deltas:{ intelligence:0.2, discipline:0.2, confidence:0.1 }, loveDelta:0.06, stressDelta:0.18, logLine:"🛰️ You made learning resilient." },
              { id:"simple", label:"Get through today and catch up later", deltas:{ discipline:0.2 }, loveDelta:0.03, stressDelta:0.20, logLine:"🛰️ You kept the day afloat." },
              { id:"avoid", label:"Let it slide (gaps accumulate)", deltas:{ intelligence:-0.2, discipline:-0.1 }, loveDelta:-0.04, stressDelta:0.24, logLine:"🛰️ Future-you sighed deeply." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "outpost_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Wants a Bigger World",
        variants: [
          {
            title: "🌆 'I Want Normal'",
            body: "Your teen wants city life: friends, anonymity, options. You chose the outpost. They didn't.",
            choices: [
              { id:"practice", label:"Take it seriously: plan visits, mentors, and a path forward", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-2500, logLine:"🌆 You honored their future as real." },
              { id:"simple", label:"Offer small freedoms (online clubs, trips when possible)", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.20, logLine:"🌆 You opened doors where you could." },
              { id:"avoid", label:"Dismiss it ('we're fine here') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.28, logLine:"🌆 They started planning life without you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_royal_heir_protocol_v1: {
    packId: "ss_royal_heir_protocol_v1",
    packName: "Royal Heir Protocol",
    emoji: "👑",
    specialStartIds: ["royal_heir_protocol"],
    ageBands: [
      {
        id: "heir_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "👑 Toddler vs Protocol",
        variants: [
          {
            title: "🫖 The Bowing Incident",
            body: "A staff member gently prompts your toddler to bow. Your toddler responds with a sticky hug and a loud 'NO.' The court calls it 'a moment.'",
            choices: [
              { id:"practice", label:"Make it gentle: teach manners without shame", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.18, logLine:"🫖 You kept the child human inside the ritual." },
              { id:"simple", label:"Let the nanny handle it and move on", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.20, logLine:"🫖 The staff restored order with snacks and whispers." },
              { id:"avoid", label:"Correct them harshly (court-approved, child-hurting)", deltas:{ empathy:-0.2, confidence:-0.1, happiness:-0.1 }, loveDelta:-0.08, stressDelta:0.28, logLine:"🫖 The room relaxed. Your child didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "heir_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 Tutors, Cameras, and 'Proper' Friends",
        variants: [
          {
            title: "🎓 The Tutor Wants More Hours",
            body: "Your child's tutor suggests more lessons: etiquette, history, languages, posture, probably breathing. Your kid just wants to play.",
            choices: [
              { id:"practice", label:"Balance it: firm learning blocks + protected play time", deltas:{ intelligence:0.2, discipline:0.2, happiness:0.1 }, loveDelta:0.08, stressDelta:0.20, moneyDelta:-10, logLine:"🎓 You built excellence without erasing joy." },
              { id:"simple", label:"Increase lessons and promise a reward later", deltas:{ discipline:0.2, knowledge:0.1 }, loveDelta:0.03, stressDelta:0.22, moneyDelta:-15, logLine:"🎓 The schedule tightened. So did the expectations." },
              { id:"avoid", label:"Let the court run it (kid becomes a project)", deltas:{ empathy:-0.2, happiness:-0.1, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"🎓 They learned performance. They missed connection." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "heir_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🗞️ Teen Heir vs Public Image",
        variants: [
          {
            title: "📸 The Unapproved Friend",
            body: "Your teen wants to date someone 'normal.' The court wants someone 'acceptable.' The internet wants a scandal. Your teen wants a life.",
            choices: [
              { id:"practice", label:"Prioritize your teen + create real safety boundaries", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.24, logLine:"📸 You chose trust over control." },
              { id:"simple", label:"Allow it quietly with strict privacy rules", deltas:{ discipline:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"📸 You made a small freedom possible." },
              { id:"avoid", label:"Ban it (they go secret and resentful)", deltas:{ empathy:-0.3, confidence:-0.2, happiness:-0.1 }, loveDelta:-0.10, stressDelta:0.32, logLine:"📸 You gained control and lost closeness." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_reality_tv_v1: {
    packId: "ss_spotlight_reality_tv_v1",
    packName: "Reality TV Star",
    emoji: "📺",
    specialStartIds: ["spotlight_reality_tv"],
    ageBands: [
      {
        id: "rtv_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "📺 Baby's First Storyline",
        variants: [
          {
            title: "😭 The Meltdown Take (Again)",
            body: "A producer asks if you can 'do one more take' of a moment your toddler is clearly not okay with. You realize your job is now negotiating for your child's dignity.",
            choices: [
              { id:"practice", label:"Stop filming: comfort first, content never", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.1, stressDelta:0.18, moneyDelta:-30, logLine:"😭 You protected a small person from becoming a clip." },
              { id:"simple", label:"Wrap early and set a hard rule for next time", deltas:{ discipline:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"😭 You ended the scene before it turned into damage." },
              { id:"avoid", label:"Push through for the show (they learn: pain performs)", deltas:{ empathy:-0.3, happiness:-0.1, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.34, logLine:"😭 The network got a moment. Your kid paid for it." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rtv_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 School Wants Privacy; Cameras Want Drama",
        variants: [
          {
            title: "📝 The Permission Slip Problem",
            body: "The school requests no filming on campus. Your team says: 'But the audience loves school moments.' Your child looks at you like you're the final decision.",
            choices: [
              { id:"practice", label:"Honor the school boundary + plan off-campus 'kid-safe' scenes", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.08, stressDelta:0.20, moneyDelta:-15, logLine:"📝 You chose safety even when it cost content." },
              { id:"simple", label:"No school filming, but you film at home (carefully)", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.22, logLine:"📝 You drew a line and kept it." },
              { id:"avoid", label:"Film anyway (school conflict + kid embarrassment)", deltas:{ social:-0.2, confidence:-0.1, happiness:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"📝 The cameras didn't get expelled. Your kid did socially." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "rtv_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Reclaims Their Narrative",
        variants: [
          {
            title: "🚪 'I'm Not Your Season Finale'",
            body: "Your teen wants to go off-camera. The contract wants one more season. The audience wants a breakdown. Your teen wants a door that closes.",
            choices: [
              { id:"practice", label:"Back your teen publicly + renegotiate the contract", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.26, moneyDelta:-40, logLine:"🚪 You chose your child over your brand." },
              { id:"simple", label:"Reduce filming drastically and protect their privacy quietly", deltas:{ discipline:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.24, logLine:"🚪 You turned down the volume without making it a war." },
              { id:"avoid", label:"Force them on camera (they disappear emotionally)", deltas:{ empathy:-0.3, confidence:-0.2, happiness:-0.1 }, loveDelta:-0.12, stressDelta:0.36, logLine:"🚪 The show continued. The relationship didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_blockbuster_actor_v1: {
    packId: "ss_spotlight_blockbuster_actor_v1",
    packName: "Blockbuster Actor",
    emoji: "🎬",
    specialStartIds: ["spotlight_blockbuster_actor"],
    ageBands: [
      {
        id: "ba_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🎬 Fame Meets Finger Paint",
        variants: [
          {
            title: "🚗 Red Carpet vs Bedtime",
            body: "A premiere is tonight. Your child's bedtime is tonight. Your publicist says 'it's important.' Your kid says 'again.'",
            choices: [
              { id:"practice", label:"Skip the carpet and protect bedtime (no guilt, real choice)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-20000, logLine:"🚗 You chose your child over the flashbulbs." },
              { id:"simple", label:"Attend briefly, then come home fully present", deltas:{ discipline:0.2, responsibility:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚗 You did both, and felt it in your bones." },
              { id:"avoid", label:"Make it an all-night event (kid feels replaced)", deltas:{ empathy:-0.2, discipline:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"🚗 The cameras got you. Your kid didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ba_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 School Life Under a Spotlight",
        variants: [
          {
            title: "📸 Paparazzi at Pickup",
            body: "Photographers show up at school pickup. The teachers are tense. Your child is embarrassed. Everyone is suddenly in your movie.",
            choices: [
              { id:"practice", label:"Work with the school on privacy + move pickup routine", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.08, stressDelta:0.20, moneyDelta:-6000, logLine:"📸 You protected your kid's normal life like it mattered." },
              { id:"simple", label:"Keep it calm and leave fast (damage control)", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.22, logLine:"📸 You kept it from becoming a circus… today." },
              { id:"avoid", label:"Lean into it (photos, autographs) (kid hates it)", deltas:{ empathy:-0.2, social:0.1 }, loveDelta:-0.06, stressDelta:0.28, logLine:"📸 You got attention. Your kid got overwhelmed." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "ba_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Identity vs Your Brand",
        variants: [
          {
            title: "🚪 'Stop Making Me a Public Person'",
            body: "Your teen wants to be private. Your team wants a wholesome family image. Your teen wants a door that closes.",
            choices: [
              { id:"practice", label:"Back your teen publicly + set strict privacy boundaries", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-15000, logLine:"🚪 You chose your kid over the brand strategy." },
              { id:"simple", label:"Compromise: no teen content, but you keep public life", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🚪 You built rules both of you can live with." },
              { id:"avoid", label:"Override them ('it's part of the job') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.12, stressDelta:0.34, logLine:"🚪 The image stayed perfect. The relationship didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_duty_submarine_deployment_v1: {
    packId: "ss_duty_submarine_deployment_v1",
    packName: "Submarine Deployment",
    emoji: "⚓️",
    specialStartIds: ["duty_submarine_deployment"],
    ageBands: [
      {
        id: "sub_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "⚓️ Parenting With Silence",
        variants: [
          {
            title: "📭 No Messages Today",
            body: "There's no call. No text. Just the knowledge that you're doing your duty somewhere the sun doesn't reach. Your child asks when you're coming back.",
            choices: [
              { id:"practice", label:"Create predictable rituals (letters, calendar, 'countdown')", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.12, stressDelta:0.18, logLine:"📭 You made absence understandable without making it easy." },
              { id:"simple", label:"Keep it simple and comforting", deltas:{ empathy:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"📭 You kept the day gentle." },
              { id:"avoid", label:"Avoid the topic (kid feels the uncertainty)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.26, logLine:"📭 The silence got heavier." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "sub_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🎒 Life With Rotations",
        variants: [
          {
            title: "🎭 You Miss Another Event",
            body: "A school event lands during deployment again. Your child asks if you can 'trade shifts with the ocean.'",
            choices: [
              { id:"practice", label:"Plan a 'make-up day' + be fully present when home", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-800, logLine:"🎭 You showed up in the ways you could." },
              { id:"simple", label:"Promise you'll attend the next one (carefully)", deltas:{ empathy:0.1, discipline:0.1 }, loveDelta:0.05, stressDelta:0.20, logLine:"🎭 You tried to protect their hope." },
              { id:"avoid", label:"Brush it off ('that's duty') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.26, logLine:"🎭 They stopped inviting you emotionally." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "sub_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Fear and Pride",
        variants: [
          {
            title: "🫧 'Is It Dangerous?'",
            body: "Your teen finally asks the question they've been holding: what if something happens down there?",
            choices: [
              { id:"practice", label:"Validate fear + share honest, age-appropriate reassurance", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.20, logLine:"🫧 You turned fear into closeness." },
              { id:"simple", label:"Reassure briefly and keep routines steady", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🫧 You steadied the household." },
              { id:"avoid", label:"Dismiss it ('don't be dramatic') (trust drops)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.28, logLine:"🫧 They stopped bringing you the real feelings." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_cult_leader_v1: {
    packId: "ss_spotlight_cult_leader_v1",
    packName: "Cult Leader",
    emoji: "🕯️",
    specialStartIds: ["spotlight_cult_leader"],
    ageBands: [
      {
        id: "cl_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🕯️ The 'Perfect Image' House",
        variants: [
          {
            title: "📸 The Child as Symbol",
            body: "Advisors suggest featuring your child as proof of your 'pure family values.' Your child just wants to be a child.",
            choices: [
              { id:"practice", label:"Protect your child from the role (privacy boundary)", deltas:{ empathy:0.2, discipline:0.2 }, loveDelta:0.10, stressDelta:0.20, moneyDelta:-18000, logLine:"📸 You refused to turn them into a prop." },
              { id:"simple", label:"Allow limited appearances with strict boundaries", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.05, stressDelta:0.24, moneyDelta:25000, logLine:"📸 You negotiated the spotlight carefully." },
              { id:"avoid", label:"Make them central to the image (relationship cost)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.32, moneyDelta:65000, logLine:"📸 The movement grew. Your child shrank inside it." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "cl_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Isolation vs Childhood",
        variants: [
          {
            title: "🎒 'Can I Have Normal Friends?'",
            body: "Your child wants friends outside the community. Advisors say outsiders are dangerous. Your child says loneliness is dangerous.",
            choices: [
              { id:"practice", label:"Allow safe outside friendships + teach boundaries (not fear)", deltas:{ empathy:0.2, confidence:0.2 }, loveDelta:0.10, stressDelta:0.22, logLine:"🎒 You chose your child's humanity over control." },
              { id:"simple", label:"Allow limited contact with supervision", deltas:{ discipline:0.2 }, loveDelta:0.05, stressDelta:0.24, logLine:"🎒 You opened the door a crack." },
              { id:"avoid", label:"Ban outside friends (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🎒 They learned love came with walls." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "cl_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Doubt Is Dangerous",
        variants: [
          {
            title: "🔥 'I Don't Believe This'",
            body: "Your teen questions the movement. This is either a moment of respect—or a moment where you lose them.",
            choices: [
              { id:"practice", label:"Respect their autonomy (relationship over ideology)", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.24, logLine:"🔥 You chose your child over your power." },
              { id:"simple", label:"Avoid conflict: keep it calm and delay decisions", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.05, stressDelta:0.26, logLine:"🔥 You bought time with calm." },
              { id:"avoid", label:"Crush dissent (relationship collapses)", deltas:{ empathy:-0.4, confidence:-0.2 }, loveDelta:-0.14, stressDelta:0.36, logLine:"🔥 You kept control and lost your child." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_master_thief_v1: {
    packId: "ss_spotlight_master_thief_v1",
    packName: "Master Thief",
    emoji: "💎",
    specialStartIds: ["spotlight_master_thief"],
    ageBands: [
      {
        id: "mt_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "💎 Double Life, Tiny Witness",
        variants: [
          {
            title: "👜 The 'Costume' Closet",
            body: "Your toddler discovers your disguises and thinks it's dress-up. You realize your life is now one curious small person away from disaster.",
            choices: [
              { id:"practice", label:"Lock it down + create safe pretend play alternatives", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.10, stressDelta:0.20, logLine:"👜 You protected the child and the secret." },
              { id:"simple", label:"Move the disguises and distract them", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"👜 You relocated the problem and prayed." },
              { id:"avoid", label:"Snap at them (fear enters the home)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.32, logLine:"👜 You saved the secret and hurt the vibe." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mt_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🎒 'What Do You Do For Work?'",
        variants: [
          {
            title: "📝 The Job Form Problem",
            body: "Your child needs to fill out a school form about your occupation. The truth is… not an option.",
            choices: [
              { id:"practice", label:"Give a stable, boring cover story and teach privacy rules gently", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.08, stressDelta:0.18, logLine:"📝 You built safety with boring words." },
              { id:"simple", label:"Keep it vague and move on", deltas:{ discipline:0.2 }, loveDelta:0.04, stressDelta:0.18, logLine:"📝 Simple. Safe. Slightly awkward." },
              { id:"avoid", label:"Make it dramatic ('it's a secret!') (kid gets anxious)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.26, logLine:"📝 You gave them adult-level secrecy weight." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "mt_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "📱 Teen Suspicion Grows",
        variants: [
          {
            title: "🧠 'You're Lying to Me'",
            body: "Your teen hints they've noticed inconsistencies. They don't ask for details. They ask for trust.",
            choices: [
              { id:"practice", label:"Give a careful truth: safety-first honesty, not full disclosure", deltas:{ empathy:0.2, confidence:0.2, responsibility:0.1 }, loveDelta:0.12, stressDelta:0.24, logLine:"🧠 You chose trust without blowing up safety." },
              { id:"simple", label:"Hold boundaries but show care (focus on values, not details)", deltas:{ discipline:0.2, empathy:0.1 }, loveDelta:0.06, stressDelta:0.22, logLine:"🧠 You stayed firm without being cold." },
              { id:"avoid", label:"Gaslight or deny hard (relationship damage)", deltas:{ empathy:-0.3, confidence:-0.2 }, loveDelta:-0.12, stressDelta:0.32, logLine:"🧠 The secret survived. Trust didn't." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_vanlife_nomads_v1: {
    packId: "ss_vanlife_nomads_v1",
    packName: "Vanlife Nomads",
    emoji: "🚐",
    specialStartIds: ["vanlife_nomads"],
    ageBands: [
      {
        id: "van_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🚐 Naps at Rest Stops",
        variants: [
          {
            title: "🍼 The 'Home Is Moving' Day",
            body: "Your toddler points at the van and says 'house!' They are not wrong. You feel proud…and slightly worried about what 'stability' means now.",
            choices: [
              { id:"practice", label:"Build routines (same songs, same bedtime, same rituals)", deltas:{ discipline:0.2, confidence:0.1 }, loveDelta:0.10, stressDelta:0.18, logLine:"🍼 You created stability inside movement." },
              { id:"simple", label:"Keep it flexible and trust the vibes", deltas:{ confidence:0.1, curiosity:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🍼 It worked… until it didn't." },
              { id:"avoid", label:"No routines at all (everyone frays)", deltas:{ discipline:-0.2, confidence:-0.1 }, loveDelta:-0.06, stressDelta:0.28, logLine:"🍼 The freedom came with friction." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "van_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "📚 School on the Road",
        variants: [
          {
            title: "🛰️ The Connectivity Week",
            body: "Remote learning is fine… until the signal isn't. Your kid is frustrated. You're juggling hotspot plans like they're life support.",
            choices: [
              { id:"practice", label:"Create offline learning blocks + backups", deltas:{ intelligence:0.2, discipline:0.2 }, loveDelta:0.06, stressDelta:0.18, moneyDelta:-120, logLine:"🛰️ You made education resilient." },
              { id:"simple", label:"Catch up later (survive today)", deltas:{ discipline:0.2 }, loveDelta:0.03, stressDelta:0.20, logLine:"🛰️ You kept the day afloat." },
              { id:"avoid", label:"Let learning slide (gaps build)", deltas:{ intelligence:-0.2, discipline:-0.1 }, loveDelta:-0.04, stressDelta:0.24, logLine:"🛰️ Later-you sighed deeply." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "van_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🌆 Teen Wants Roots",
        variants: [
          {
            title: "🏠 'Can We Stay Somewhere?'",
            body: "Your teen wants a real address, real friends, and the ability to stop explaining their entire life to new people every month.",
            choices: [
              { id:"practice", label:"Take it seriously: plan longer stays + teen-led choices", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.20, moneyDelta:-2000, logLine:"🏠 You treated their need for roots as real." },
              { id:"simple", label:"Offer compromises: seasonal base + travel bursts", deltas:{ confidence:0.2, discipline:0.1 }, loveDelta:0.06, stressDelta:0.20, logLine:"🏠 You built a workable middle ground." },
              { id:"avoid", label:"Dismiss it ('this is our life') (resentment grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.28, logLine:"🏠 They started planning stability without you." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_spotlight_space_tourism_billionaire_v1: {
    packId: "ss_spotlight_space_tourism_billionaire_v1",
    packName: "Space Tourism Billionaire",
    emoji: "🚀",
    specialStartIds: ["spotlight_space_tourism_billionaire"],
    ageBands: [
      {
        id: "stb_early",
        minAge: 1,
        maxAge: 5,
        chance: 0.85,
        title: "🚀 Launch Windows and Bedtime Windows",
        variants: [
          {
            title: "🧸 The Countdown vs The Cuddle",
            body: "A launch countdown is tonight. Your toddler wants you to stay in the room until they fall asleep. Both are time-sensitive. Only one is irreplaceable.",
            choices: [
              { id:"practice", label:"Choose bedtime (delegate the launch moment)", deltas:{ empathy:0.2, responsibility:0.2 }, loveDelta:0.12, stressDelta:0.18, moneyDelta:-30000, logLine:"🧸 You chose your child over the spectacle." },
              { id:"simple", label:"Split it: bedtime first, then watch the launch privately", deltas:{ discipline:0.2 }, loveDelta:0.06, stressDelta:0.22, logLine:"🧸 You did both, with a tired smile." },
              { id:"avoid", label:"Prioritize the launch (kid feels secondary)", deltas:{ empathy:-0.2, confidence:-0.1 }, loveDelta:-0.08, stressDelta:0.30, logLine:"🧸 The rocket went up. The warmth went down." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "stb_school",
        minAge: 6,
        maxAge: 12,
        chance: 0.80,
        title: "🏫 Extreme Wealth in Normal Spaces",
        variants: [
          {
            title: "🎒 The 'Space Party' Problem",
            body: "Your child wants a birthday party 'like the launch.' Your child's friends are normal kids. The budget is not the point. The social fallout might be.",
            choices: [
              { id:"practice", label:"Make it fun but normal (no flex, no spectacle)", deltas:{ empathy:0.2, social:0.1, responsibility:0.1 }, loveDelta:0.10, stressDelta:0.18, moneyDelta:-12000, logLine:"🎒 You protected friendships from your bank account." },
              { id:"simple", label:"Big party with guardrails (keep it kind, not flashy)", deltas:{ social:0.2 }, loveDelta:0.05, stressDelta:0.20, moneyDelta:-65000, logLine:"🎒 It was huge. You tried to keep it human." },
              { id:"avoid", label:"Unlimited spectacle (status chaos)", deltas:{ responsibility:-0.1, social:-0.1 }, loveDelta:-0.04, stressDelta:0.26, moneyDelta:-180000, logLine:"🎒 The party went viral. The friendships got weird." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      },
      {
        id: "stb_teen",
        minAge: 13,
        maxAge: 18,
        chance: 0.75,
        title: "🧠 Teen Values vs Billionaire Reality",
        variants: [
          {
            title: "🌍 'Is This Ethical?'",
            body: "Your teen challenges you: private space tourism while people struggle on Earth. They want you to answer as a parent, not as a billionaire.",
            choices: [
              { id:"practice", label:"Listen deeply + commit to real giving and accountability", deltas:{ empathy:0.2, responsibility:0.2, confidence:0.1 }, loveDelta:0.12, stressDelta:0.22, moneyDelta:-75000, logLine:"🌍 You modeled power with responsibility." },
              { id:"simple", label:"Explain your vision and keep it calm", deltas:{ confidence:0.2 }, loveDelta:0.05, stressDelta:0.22, logLine:"🌍 You stayed steady under hard questions." },
              { id:"avoid", label:"Dismiss them ('you don't get it') (distance grows)", deltas:{ empathy:-0.3, confidence:-0.1 }, loveDelta:-0.10, stressDelta:0.30, logLine:"🌍 They stopped trusting your values." },
              { id:"skip", label:"Skip this check-in" }
            ]
          }
        ]
      }
    ]
  },
  ss_polygamist_household_v1: {
    packId: "ss_polygamist_household_v1",
    packName: "Polygamist Household",
    emoji: "👨‍👩‍👧‍👦",
    specialStartIds: ["closed_polygamist_compound", "polygamist_doctor_indonesia"],
    ageBands: [
      {
        id: "poly_early",
        minAge: 1,
        maxAge: 6,
        chance: 1.0,
        title: "👨‍👩‍👧‍👦 The Household",
        variants: [
          {
            title: "🏠 Who's Watching Today?",
            body: "Four adults, one schedule, and someone forgot to coordinate nap time. Your child doesn't know which 'mom' is in charge today.",
            choices: [
              { id: "coordinate", label: "Weekly household meeting (structured chaos)", deltas: { discipline: 0.3, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🏠 You built a system from chaos." },
              { id: "flow", label: "Let it flow organically (village vibes)", deltas: { empathy: 0.2, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🏠 The village raised them." },
              { id: "control", label: "You control everything (one voice)", deltas: { discipline: 0.3, empathy: -0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🏠 You became the gatekeeper." }
            ]
          },
          {
            title: "🍽️ Dinner Table Politics",
            body: "Ten people, one table, three conversations, and someone's definitely mad about something. Your child learns family is *loud*.",
            choices: [
              { id: "mediate", label: "Teach conflict resolution skills", deltas: { empathy: 0.3, intelligence: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🍽️ They learned to navigate tension." },
              { id: "escape", label: "Create quiet escape time for your child", deltas: { empathy: 0.2, confidence: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🍽️ You protected their peace." },
              { id: "embrace", label: "Embrace the chaos (family = noise)", deltas: { confidence: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🍽️ Chaos became normal." }
            ]
          },
          {
            title: "👶 Sibling Avalanche",
            body: "More kids arrive. Your child is one of many now. Attention is a scarce resource.",
            choices: [
              { id: "oneonone", label: "Protect one-on-one time (quality over quantity)", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "👶 You made them feel seen." },
              { id: "team", label: "Teach team skills (you're part of a crew)", deltas: { discipline: 0.2, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "👶 They learned to share space." },
              { id: "survival", label: "Let them fend for attention", deltas: { confidence: 0.1, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "👶 Survival mode activated." }
            ]
          }
        ]
      },
      {
        id: "poly_mid",
        minAge: 7,
        maxAge: 13,
        chance: 1.0,
        title: "👨‍👩‍👧‍👦 Household Dynamics",
        variants: [
          {
            title: "⚖️ Favoritism Watch",
            body: "Your child notices which adult favors which kid. They're learning household politics early.",
            choices: [
              { id: "equity", label: "Actively work toward equity (everyone matters)", deltas: { empathy: 0.3, discipline: 0.2 }, loveDelta: 0.2, stressDelta: 0.2, logLine: "⚖️ You built fairness into chaos." },
              { id: "natural", label: "Let natural bonds form", deltas: { empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "⚖️ You trusted organic connection." },
              { id: "compete", label: "Let them compete for attention", deltas: { confidence: 0.2, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "⚖️ Competition became the currency." }
            ]
          },
          {
            title: "🏥 Doctor Parent Schedule",
            body: "One of you is a doctor with brutal hours. The household runs on backup plans and grace.",
            choices: [
              { id: "backup", label: "Build redundant backup systems", deltas: { discipline: 0.3, intelligence: 0.2 }, loveDelta: 0.1, stressDelta: 0.2, logLine: "🏥 You built resilience into the schedule." },
              { id: "community", label: "Lean on the household collective", deltas: { empathy: 0.2, confidence: 0.1 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🏥 The village filled the gaps." },
              { id: "chaos", label: "Wing it daily", deltas: { discipline: -0.1 }, loveDelta: 0, stressDelta: 0.2, logLine: "🏥 Chaos became the plan." }
            ]
          },
          {
            title: "🤔 'Why Do We Have Four Moms?'",
            body: "Your child asks The Question at school. Other kids have follow-up questions. You're deciding how to prep them.",
            choices: [
              { id: "honest", label: "Honest, age-appropriate script", deltas: { confidence: 0.3, empathy: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🤔 You gave them words for their life." },
              { id: "deflect", label: "Teach deflection ('it's complicated')", deltas: { discipline: 0.2 }, loveDelta: 0.05, stressDelta: 0.1, logLine: "🤔 You taught privacy tactics." },
              { id: "shame", label: "Tell them not to talk about it", deltas: { confidence: -0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.2, logLine: "🤔 Shame replaced pride." }
            ]
          }
        ]
      },
      {
        id: "poly_teen",
        minAge: 14,
        maxAge: 18,
        chance: 1.0,
        title: "👨‍👩‍👧‍👦 Teen Identity",
        variants: [
          {
            title: "🚪 'I Want Out'",
            body: "Your teen wants space from the compound/household. They want friends, privacy, and a door that locks.",
            choices: [
              { id: "space", label: "Give them space and autonomy", deltas: { confidence: 0.4, empathy: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "🚪 You let them breathe." },
              { id: "compromise", label: "Negotiate boundaries (some freedom)", deltas: { discipline: 0.2, confidence: 0.2 }, loveDelta: 0.1, stressDelta: 0.1, logLine: "🚪 You found middle ground." },
              { id: "restrict", label: "Keep them close (family first)", deltas: { discipline: 0.3, empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "🚪 Control tightened. Resentment did too." }
            ]
          },
          {
            title: "💑 Dating Complexity",
            body: "They bring someone home. The household has *opinions*. All four adults have advice. Your teen is mortified.",
            choices: [
              { id: "protect", label: "Protect them from household interrogation", deltas: { empathy: 0.3, confidence: 0.2 }, loveDelta: 0.2, stressDelta: 0.1, logLine: "💑 You gave them dignity." },
              { id: "family", label: "Let the family meet them (community vetting)", deltas: { discipline: 0.2 }, loveDelta: 0.05, stressDelta: 0.2, logLine: "💑 The village weighed in." },
              { id: "chaos", label: "No boundaries (full household chaos)", deltas: { empathy: -0.2 }, loveDelta: -0.1, stressDelta: 0.3, logLine: "💑 Your teen learned to hide relationships." }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Get eligible check-ins for a given age and game state.
 * Returns an array of { packId, packName, emoji, title, body, choices }.
 */
function isYearlyCheckinEnabled(gameState, packId) {
  // Global toggle: if user turns off yearly check-ins entirely, respect that
  const global = gameState?.settings?.yearlyCheckinsEnabled;
  if (global === false) return false;
  
  // Per-pack toggle
  const map = gameState.yearlyCheckinsEnabledByPackId;
  if (!map) return true; // legacy saves: treat as enabled unless user toggled
  if (map[packId] !== undefined) return !!map[packId];
  return true;
}

export function getEligibleCheckinsForAge(age, gameState) {
  const ownedPackIds = gameState.ownedScenarioPackIds || [];
  const enabledPackIds = gameState.enabledScenarioPackIds || [];
  
  const eligible = [];
  
  // Spotlight 43–54 suppression: these special starts use ss_spotlight_* check-ins as yearly scenario text
  const ss = String(gameState?.specialStartId || '');
  const SUPPRESS_SS_SPOTLIGHT_CHECKINS = new Set([
    'spotlight_movie_star','spotlight_pro_athlete','spotlight_influencer','spotlight_tech_founder','spotlight_music_icon',
    'spotlight_nobel_scientist','spotlight_business_mogul','spotlight_chef','spotlight_fashion_icon','spotlight_olympian',
    'spotlight_astronaut','spotlight_arctic_station'
  ]);
  const suppressThisRun = SUPPRESS_SS_SPOTLIGHT_CHECKINS.has(ss);
  
  Object.values(PACK_YEARLY_CHECKINS).forEach(packConfig => {
    const packId = packConfig.packId;
    const isSpecialStartPack = Array.isArray(packConfig.specialStartIds) && packConfig.specialStartIds.includes(gameState.specialStartId);
    
    // Skip ss_spotlight_* packs for the 12 spotlight special starts (they're used as yearly scenarios now)
    if (suppressThisRun && isSpecialStartPack) return;

    // Must be owned and enabled, OR a special start pack
    if (!isSpecialStartPack) {
      if (!ownedPackIds.includes(packId)) return;
      if (!enabledPackIds.includes(packId)) return;
    }
    if (!isYearlyCheckinEnabled(gameState, packId)) return;
    
    // Special: Sibling pack requires sibling expansion
    if (packId === "pack_sibling_rivalry_v1") {
      const siblingExpansionOn = !!gameState.expansions?.siblingRivalry;
      const kidCount = Array.isArray(gameState.kids) ? gameState.kids.length : 0;
      if (!siblingExpansionOn || kidCount < 2) return;
    }

    // Special: Screen Time pack requires phone active
    if (packId === "pack_screen_time_v1") {
      const phoneActive = Boolean(gameState.phoneOwned) && 
                          Number.isFinite(gameState.phoneEffectsStartAge) && 
                          age >= gameState.phoneEffectsStartAge;
      if (!phoneActive) return;
    }
    
    // Find matching age bands
    const ageMatches = packConfig.ageBands.filter(b => age >= b.minAge && age <= b.maxAge);
    if (!ageMatches || ageMatches.length === 0) return;

    // Filter by household type if specified
    const conditioned = ageMatches.filter(b => {
      if (Array.isArray(b.householdTypes) && b.householdTypes.length > 0) {
        return b.householdTypes.includes(gameState.householdType);
      }
      return true;
    });

    // Process each conditioned band, applying chance and variant logic
    conditioned.forEach((band, index) => {
      // Create a unique seed for this specific band to ensure deterministic but unique outcomes per band.
      // Use minAge, maxAge, and index to ensure uniqueness even if IDs aren't explicitly on the band.
      const seedIdentifier = band.id || `${band.minAge}-${band.maxAge}-${index}`;
      const rng = createSeededRng(`${gameState.runSeed}|checkin|${packId}|${seedIdentifier}|age:${age}`);
      
      // Apply chance if specified
      if (band.chance != null && rng.nextFloat() > band.chance) {
        return; // Skip this band if chance roll fails
      }
      
      // POLYGAMIST SPECIAL START: select 2 variants per year instead of 1
      const isPolygamistPack = packId === 'ss_polygamist_household_v1';
      const isPolygamistScenario = gameState.specialStartId === 'polygamist_doctor_indonesia' || gameState.specialStartId === 'closed_polygamist_compound';
      const shouldPickMultiple = isPolygamistPack && isPolygamistScenario;
      
      if (shouldPickMultiple && band.variants && band.variants.length > 1) {
        // Pick 2 distinct variants
        const variantIndex1 = Math.floor(rng.nextFloat() * band.variants.length);
        const variant1 = band.variants[variantIndex1];
        
        // Pick second variant (ensure different)
        let variantIndex2 = Math.floor(rng.nextFloat() * band.variants.length);
        let attempts = 0;
        while (variantIndex2 === variantIndex1 && attempts < 10) {
          variantIndex2 = Math.floor(rng.nextFloat() * band.variants.length);
          attempts++;
        }
        
        // Push first variant
        eligible.push({
          packId,
          packName: packConfig.packName,
          emoji: packConfig.emoji,
          title: typeof variant1.title === 'function' ? variant1.title(age, gameState) : variant1.title,
          body: typeof variant1.body === 'function' ? variant1.body(age, gameState) : variant1.body,
          choices: variant1.choices
        });
        
        // Push second variant if distinct
        if (variantIndex2 !== variantIndex1) {
          const variant2 = band.variants[variantIndex2];
          eligible.push({
            packId,
            packName: packConfig.packName,
            emoji: packConfig.emoji,
            title: typeof variant2.title === 'function' ? variant2.title(age, gameState) : variant2.title,
            body: typeof variant2.body === 'function' ? variant2.body(age, gameState) : variant2.body,
            choices: variant2.choices
          });
        }
      } else {
        // Normal behavior: select one variant
        let selectedVariant = band;
        if (band.variants && band.variants.length > 0) {
          const variantIndex = Math.floor(rng.nextFloat() * band.variants.length);
          selectedVariant = band.variants[variantIndex];
        }

        eligible.push({
          packId,
          packName: packConfig.packName,
          emoji: packConfig.emoji,
          title: typeof selectedVariant.title === 'function' ? selectedVariant.title(age, gameState) : selectedVariant.title,
          body: typeof selectedVariant.body === 'function' ? selectedVariant.body(age, gameState) : selectedVariant.body,
          choices: selectedVariant.choices
        });
      }
    });
  });
  
  return eligible;
}