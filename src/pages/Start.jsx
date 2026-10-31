import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import MyFirstPlayCutscene from '@/components/tutorial/MyFirstPlayCutscene';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Baby, Sparkles, Heart, Star, Settings, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameState, HOUSEHOLD_CONFIG, INCOME_CONFIG, pickTenCountries, getCountryByIso3, getCountryScale, getCountryWageScale, localizeAmount, formatMoney, createSeededRng } from '@/components/game/GameStateContext';
import { AVATAR_GIRL, AVATAR_BOY, getAvatarEmojiForAge } from '@/components/game/avatars';
import PartnerCreatorModal from '@/components/game/PartnerCreatorModal';
import FamilyPatternsSelectModal from '@/components/game/FamilyPatternsSelectModal';
import { DEFAULT_PATTERN_SEVERITY, FAMILY_PATTERN_CATALOG } from '@/components/game/familyPatternCatalog';
import SaveLoadModal from '@/components/game/SaveLoadModal';
import SettingsModal from '@/components/game/SettingsModal';
import { listSlots, getActiveSlotId } from '@/components/game/saveManager';
import { EDUCATION_LEVELS, EDUCATION_FIELDS, getEligibleJobs, computeStartingCareer, computeRandomPartnerCareer, formatMoneyCompact, incomeTierFromYearlyIncome, getJobById } from '@/components/game/jobSystem';
import { pickCulturalFirstName, pickGenderEmoji, CULTURE_IDS } from '@/components/game/culturalNamePicker';
import PlayerSpriteAvatar from '@/components/game/PlayerSpriteAvatar';

// Infer cultures from country for auto-naming when roots not chosen
function inferCulturesFromCountryIso3(iso3) {
  const c = getCountryByIso3(iso3) || { spokenLanguages: ['English'] };

  const COUNTRY_MAP = {
    USA: 'AMERICAN_US',
    GBR: 'BRITISH_IRISH',
    IRL: 'BRITISH_IRISH',
    AUS: 'AUS_NZ',
    NZL: 'AUS_NZ',
    FRA: 'FRENCH',
    DEU: 'GERMAN',
    MEX: 'MEXICAN',
    BRA: 'BRAZILIAN',
    IND: 'INDIAN',
    CHN: 'CHINESE',
    JPN: 'JAPANESE',
    KOR: 'KOREAN',
    PRK: 'KOREAN',
    IDN: 'INDONESIAN',
    HTI: 'CARIBBEAN',
    JAM: 'CARIBBEAN',
    NGA: 'NIGERIAN_WEST_AFRICAN',
    ZAF: 'SOUTH_AFRICAN',
    SAU: 'ARAB',
    ARE: 'ARAB',
    EGY: 'ARAB',
    MAR: 'ARAB',
    DZA: 'ARAB',
    TUN: 'ARAB'
  };

  const direct = COUNTRY_MAP[String(iso3 || '').toUpperCase()];
  if (direct) return [direct];

  const lang = Array.isArray(c.spokenLanguages) ? c.spokenLanguages[0] : 'English';
  const LANG_MAP = {
    English: 'AMERICAN_US',
    French: 'FRENCH',
    German: 'GERMAN',
    Spanish: 'MEXICAN',
    Portuguese: 'BRAZILIAN',
    Hindi: 'INDIAN',
    Urdu: 'INDIAN',
    Bengali: 'INDIAN',
    Mandarin: 'CHINESE',
    Japanese: 'JAPANESE',
    Korean: 'KOREAN',
    Arabic: 'ARAB',
    Indonesian: 'INDONESIAN'
  };

  return [LANG_MAP[lang] || 'AMERICAN_US'];
}

const POP_STAR_FAME_TIERS = [
  {
    id: "rising",
    label: "Rising Pop Star",
    blurb: "Some radio play, a small team, big dreams.",
    startMoney: 200000,
    yearlyIncome: 150000,
    famePoints: 200,
    reputation: 65
  },
  {
    id: "alist",
    label: "A-List Pop Star",
    blurb: "Magazine covers, sponsorships, and real tours.",
    startMoney: 5000000,
    yearlyIncome: 2000000,
    famePoints: 600,
    reputation: 75
  },
  {
    id: "stadium",
    label: "Stadium Pop Star",
    blurb: "If you sneeze, it trends worldwide.",
    startMoney: 25000000,
    yearlyIncome: 5000000,
    famePoints: 1000,
    reputation: 85
  }
];

const SPECIAL_START_CATALOG = [
  // -------------------------
  // SPOTLIGHT 🌟
  // -------------------------
  {
    id: "famous_pop_star",
    category: "famous",
    title: "Pop Star 🌟🎶",
    description: "Build your own superstar parent—tours, tabloids, and the impossible mission of raising a normal kid.",
    locked: false,
    overrides: {
      specialStartId: "famous_pop_star",
      countryIso3: "USA",
      parentJobId: "musician",
      partnerJobId: "stay_at_home_parent",
      incomeTier: "wealthy",
      startMoney: 5000000,
      yearlyIncome: 2000000,
      famePoints: 600,
      reputation: 75
    }
  },
  {
    id: "spotlight_movie_star",
    category: "famous",
    title: "Movie Star 🎬",
    description: "Red carpets, long shoots, and a kid who wants you home by dinner. Fame is a schedule problem now.",
    locked: true
  },
  {
    id: "spotlight_pro_athlete",
    category: "famous",
    title: "Pro Athlete 🏟️",
    description: "Training, travel, and injuries—plus bedtime stories in hotel rooms. Can you parent on a season clock?",
    locked: true
  },
  {
    id: "spotlight_influencer",
    category: "famous",
    title: "Internet Influencer 📱",
    description: "Your job is attention. Your child is not content. Draw boundaries before the algorithm raises your kid.",
    locked: true
  },
  {
    id: "spotlight_music_icon",
    category: "famous",
    title: "Global Music Icon 🌍🎶",
    description: "World tours, stadium screams, and a child growing up backstage. Keep them grounded when you can't walk to the store.",
    locked: true
  },
  {
    id: "spotlight_business_mogul",
    category: "famous",
    title: "Business Mogul 💼",
    description: "Boardrooms, headlines, and zero free time. Your child learns leadership early—or learns resentment.",
    locked: true
  },
  {
    id: "spotlight_astronaut",
    category: "famous",
    title: "Astronaut 🚀",
    description: "Parenting from orbit is… complicated.",
    locked: true
  },
  {
    id: "spotlight_president",
    category: "famous",
    title: "Head of State 🗳️",
    description: "Your child grows up in a world where every hug is a headline.",
    locked: true
  },
  {
    id: "spotlight_royal_family",
    category: "famous",
    title: "Royal Family 👑",
    description: "Etiquette, security, and a kid who just wants to be normal.",
    locked: true
  },
  {
    id: "spotlight_spy",
    category: "famous",
    title: "Intelligence Officer 🕵️",
    description: "Two lives: one public, one secret—and a kid who asks questions.",
    locked: true
  },
  {
    id: "spotlight_olympian",
    category: "famous",
    title: "Olympic Champion 🥇",
    description: "Your life is training. Your kid's life is waiting for you.",
    locked: true
  },
  {
    id: "spotlight_nobel_scientist",
    category: "famous",
    title: "World-Class Scientist 🔬",
    description: "Breakthroughs, rivalries, and a child who wants you at school events.",
    locked: true
  },
  {
    id: "spotlight_humanitarian_doctor",
    category: "famous",
    title: "Humanitarian Doctor 🩺",
    description: "Saving strangers is noble—your child just wants you safe.",
    locked: true
  },
  {
    id: "spotlight_reality_tv",
    category: "famous",
    title: "Reality TV Star 📺",
    description: "You're famous for being watched—now protect a child in public.",
    locked: true
  },
  {
    id: "spotlight_tech_founder",
    category: "famous",
    title: "Tech Founder 💼",
    description: "Investors want everything. Your child wants five minutes.",
    locked: true
  },
  {
    id: "spotlight_war_correspondent",
    category: "famous",
    title: "War Correspondent 📰",
    description: "You report danger… and come home to bedtime stories.",
    locked: true
  },
  {
    id: "spotlight_fashion_icon",
    category: "famous",
    title: "Fashion Icon 👗",
    description: "Every outfit is judged. So is your parenting.",
    locked: true
  },
  {
    id: "spotlight_chef",
    category: "famous",
    title: "World-Famous Chef 👨‍🍳",
    description: "You feed crowds. Your kid still refuses vegetables.",
    locked: true
  },
  {
    id: "spotlight_esports",
    category: "famous",
    title: "Esports Champion 🎮",
    description: "Tournaments, travel, and a kid who thinks your job is 'sitting.'",
    locked: true
  },
  {
    id: "spotlight_guru",
    category: "famous",
    title: "Spiritual Guru 🧘",
    description: "People worship your wisdom. Your kid sees your mess.",
    locked: true
  },
  {
    id: "spotlight_arctic_station",
    category: "famous",
    title: "Arctic Station Lead 🧊",
    description: "Parenting where the nearest neighbor is a snowstorm.",
    locked: true
  },

  // -------------------------
  // NORMAL (unlocked + locked)
  // -------------------------
  {
    id: "golden_cage",
    category: "normal",
    title: "Golden Cage",
    description: "Perfect lawns, perfect smiles—perfect pressure. Can you raise a happy child when everything is curated?",
    locked: false,
    overrides: {
      parentRole: "mom",
      householdType: "two",
      incomeTier: "wealthy",
      parentJobId: "executive_ceo",
      startMoney: 150000,
      stats: { intelligence: 6, discipline: 4, empathy: 4, confidence: 6 },
      parentName: "Alex",
      childName: "Emerson"
    }
  },
  {
    id: "newcomer_reset",
    category: "normal",
    title: "Newcomer Reset",
    description: "New country, new rules, new language—same diaper bag. Start over and build a life your child can thrive in.",
    locked: false,
    overrides: {
      parentRole: "dad",
      householdType: "two",
      incomeTier: "medium",
      startMoney: 2000,
      stats: { intelligence: 6, discipline: 4, empathy: 5, confidence: 4 },
      parentName: "Sam",
      childName: "Mina"
    }
  },
  {
    id: "tradition_tug_of_war",
    category: "normal",
    title: "Tradition Tug‑of‑War",
    description: "Tradition pulls one way, your instincts pull another. Set boundaries, keep peace, and raise a confident kid.",
    locked: false,
    overrides: {
      parentRole: "mom",
      householdType: "two",
      incomeTier: "medium",
      startMoney: 3000,
      stats: { intelligence: 5, discipline: 5, empathy: 4, confidence: 4 },
      parentName: "Rina",
      childName: "Kiran"
    }
  },
  {
    id: "rural_isolation",
    category: "normal",
    title: "Rural Isolation 🌾",
    description: "Dirt roads, long winters, and everyone knows your business. Parenting hits different when help is an hour away.",
    locked: false,
    overrides: { specialStartId: "rural_isolation" }
  },
  {
    id: "tiny_apartment_city",
    category: "normal",
    title: "Tiny Apartment in the City 🏙️",
    description: "Tiny space, loud neighbors, sky‑high rent. Make a home anyway—and keep your kid sane.",
    locked: false,
    overrides: { specialStartId: "tiny_apartment_city" }
  },
  {
    id: "child_adhd",
    category: "normal",
    title: "Child Has ADHD ⚡",
    description: "Big energy, big feelings, endless questions. Build routines that work and let the spark stay bright.",
    locked: false,
    overrides: {
      specialStartId: "child_adhd",
      stats: { intelligence: 6, discipline: 3, empathy: 5, confidence: 5 }
    }
  },
  {
    id: "sugar_baby",
    category: "normal",
    title: "Sugar Baby 💎",
    description: "You're 18. Your spouse is 75 and fragile. You just had a baby—now love, money, and uncertainty collide.",
    locked: false,
    overrides: {
      specialStartId: "sugar_baby",
      parentRole: "mom",
      householdType: "two",
      parentJobId: "stay_at_home_parent",
      ageAtBirth: 18,
      partnerAgeAtBirth: 75,
      countryIso3: "USA",
      startMoney: 15000,
      incomeTier: "high"
    }
  },
  {
    id: "child_autism",
    category: "normal",
    title: "Child Is Autistic 🧩",
    description: "Different wiring, different wins. Learn sensory needs, communication styles, and how to build a world that fits.",
    locked: false,
    overrides: { specialStartId: "child_autism" }
  },
  {
  id: "child_down_syndrome",
  category: "normal",
  title: "Down Syndrome ❤️",
  description: "Extra joy, extra appointments, extra advocacy. Help your child thrive through school, health, and independence.",
  locked: false,
  overrides: {
    specialStartId: "child_down_syndrome"
  }
},
  {
  id: "child_dyslexia",
  category: "normal",
  title: "Child Has Dyslexia 📚",
  description: "Letters fight back, creativity fights harder. Find tools that turn frustration into confidence.",
  locked: false,
  overrides: {
    specialStartId: "child_dyslexia"
  }
},
  {
  id: "child_deaf_hoh",
  category: "normal",
  title: "Deaf / Hard of Hearing 🤟",
  description: "Access is everything. Build language, community, and confidence in a world that doesn't always listen.",
  locked: false,
  overrides: {
    specialStartId: "child_deaf_hoh"
  }
},
  { id: "child_mobility_aid", category: "normal", title: "Child Uses Mobility Aids ♿", description: "Ramps, routines, and stubborn independence. Parent through logistics while your kid learns to own their space.", locked: false, overrides: { specialStartId: "child_mobility_aid" } },
  { id: "single_parent_household", category: "normal", title: "Single Parent Household 🧍", description: "Just you and a tiny human. Build stability, support, and sanity one year at a time.", locked: false, overrides: { specialStartId: "single_parent_household", householdType: "single" } },
  { id: "blended_family", category: "normal", title: "Blended Family 🧩", description: "New partner, new rules, old feelings. Blend a household without blending everyone into chaos.", locked: false, overrides: { specialStartId: "blended_family", householdType: "two" } },
  { id: "first_gen_immigrant", category: "normal", title: "First-Generation Immigrant 🌍", description: "You straddle cultures while your child grows up translating—sometimes words, sometimes worlds.", locked: false, overrides: { specialStartId: "first_gen_immigrant" } },
  { id: "two_working_parents_childcare", category: "normal", title: "Two Working Parents + Childcare Crunch 🧷", description: "Two jobs, one calendar, infinite pickup emails. Trade money for time—and back again.", locked: false, overrides: { specialStartId: "two_working_parents_childcare", householdType: "two" } },
  { id: "eldercare_shared", category: "normal", title: "Eldercare in the Background 🧓🤝", description: "A grandparent is in the picture—helpful, needy, or both. Family love comes with extra responsibilities.", locked: false, overrides: { specialStartId: "eldercare_shared" } },
  { id: "gifted_child", category: "normal", title: "Gifted Child ✨", description: "Fast brain, deep feelings. Keep them challenged without burning them out—or yourself.", locked: false, overrides: { specialStartId: "gifted_child" } },
  { id: "divorce_coparenting", category: "normal", title: "Divorce + Co‑Parenting 🗓️", description: "Two homes, one childhood. Keep routines steady while adults rebuild their lives.", locked: false, overrides: { specialStartId: "divorce_coparenting", householdType: "single", startMoney: 2000 } },
  { id: "twins_triplets", category: "normal", title: "Twins / Triplets", description: "One baby is hard. Two is chaos. Three is legendary. (Locked for now.)", locked: true },
  { id: "teen_parent", category: "normal", title: "Teen Parent 🧃", description: "You're still growing up, but now you're someone's safe place. School, money, and identity collide.", locked: false, overrides: { specialStartId: "teen_parent", parentRole: "mom", householdType: "single", ageAtBirth: 16, parentJobId: "government_assistance", startMoney: 300 } },
  { id: "caregiver_grandparent_home", category: "normal", title: "Caregiving at Home 🧓", description: "You're raising a child and caring for an older relative at home. Love multiplies; so does exhaustion.", locked: false, overrides: { specialStartId: "caregiver_grandparent_home" } },
  {
  id: "military_relocation_cycle",
  category: "normal",
  title: "Military Relocation Cycle 🪖",
  description: "New base, new school, new friends—repeat. Can your kid learn to belong anywhere?",
  locked: false,
  overrides: {
      specialStartId: "military_relocation_cycle",
      countryIso3: "USA",
      householdType: "two",
      parentJobId: "active_duty_military",
      partnerJobId: "stay_at_home_parent"
    }
},


  // -------------------------
  // INSANE 😂
  // -------------------------
  {
    id: "mafia_family",
    category: "insane",
    title: "Mafia Family 🕴️",
    description: "Big money, bigger secrets. Raise a kid where loyalty is currency and every favor has a price.",
    locked: false,
    overrides: {
      specialStartId: "mafia_family",
      specialStartTitle: "Mafia Family 🕴️",
      householdType: "two",
      incomeTier: "wealthy",
      parentJobId: "stay_at_home_parent",
      partnerJobId: "stay_at_home_parent",
      startMoney: 20000
    }
  },
  {
    id: "alien_invasion",
    category: "insane",
    title: "Alien Invasion 👽",
    description: "The sky cracked open. Every year is survival (and alien nonsense). One wrong call and it's over.",
    locked: false,
    overrides: {
      specialStartId: "alien_invasion",
      householdType: "two",
      parentRole: "dad",
      parentJobId: "survivor",
      partnerJobId: "survivor",
      incomeTier: "low",
      startMoney: 400,
      countryIso3: "USA"
    }
  },
  {
    id: "zombie_apocalypse",
    category: "insane",
    title: "Zombie Apocalypse 🧟",
    description: "The world ended, but bedtime didn't. Protect your kid, manage your marriage, and don't get bitten.",
    locked: false,
    overrides: {
      specialStartId: "zombie_apocalypse",
      householdType: "two",
      parentRole: "dad",
      parentJobId: "survivor",
      partnerJobId: "survivor",
      incomeTier: "low",
      startMoney: 450,
      countryIso3: "USA"
    }
  },
  {
    id: "kim_jong_un",
    category: "insane",
    title: "Supreme Leader of North Korea",
    description: "You rule a paranoid palace-state while raising the heir. Train a successor… or accidentally start a revolution.",
    locked: false,
    overrides: {
      countryIso3: "PRK",
      parentName: "Supreme Leader",
      parentRole: "dad",
      householdType: "two",
      incomeTier: "wealthy",
      startMoney: 500000,
      yearlyIncome: 500000,
      parentJobId: "supreme_leader",
      stats: { empathy: 2, discipline: 6, confidence: 6, intelligence: 5 },
      specialStartId: "kim_jong_un",
      specialStartTitle: "Supreme Leader of North Korea",
      specialStartCategory: "insane",
      disableCrime: true,
      disableCareer: true,
      disableSideGigs: true,
      leaderTitle: "Supreme Leader",
      schoolType: "private",
      privateSchoolActive: true,
      privateSchoolStartAge: 0,
      baliActive: false
    }
  },
  {
    id: "polygamist_doctor_indonesia",
    category: "insane",
    title: "Polygamist Doctor (Indonesia)",
    description: "Four wives, ten kids, and a medical career. You're triaging patients by day and family drama by night.",
    locked: false,
    overrides: {
      countryIso3: "IDN",
      parentName: "Amed",
      parentRole: "dad",
      householdType: "two",
      partnerName: "Ayu",
      partnerGender: "female",
      partnerJobId: "stay_at_home_parent",
      partnerAgeAtBirth: 29,
      parentJobId: "doctor",
      ageAtBirth: 34,
      incomeTier: "high",
      startMoney: 15000,
      expenseMultiplier: 1.35,
      stats: { intelligence: 6, empathy: 4, discipline: 3, confidence: 4 },
      expansions: { siblingRivalry: true },
      initialKidNames: [
        "Rizky",
        "Putri",
        "Bima",
        "Siti",
        "Adi",
        "Nadia",
        "Fajar",
        "Alya",
        "Bayu",
        "Nabila"
      ],
      relationshipAdditions: [
        { id: "wife_2", role: "wife", name: "Dewi", emoji: "👰", baseAge: 30, meter: 62, alive: true },
        { id: "wife_3", role: "wife", name: "Sari", emoji: "👰", baseAge: 28, meter: 58, alive: true },
        { id: "wife_4", role: "wife", name: "Intan", emoji: "👰", baseAge: 31, meter: 55, alive: true }
      ]
    }
  },
  {
    id: "closed_polygamist_compound",
    category: "insane",
    title: "Closed‑Off Polygamist Compound",
    description: "Strict rules, strict hierarchy, zero privacy. Raise children in a closed community where everything is watched.",
    locked: false,
    overrides: {
      specialStartId: "closed_polygamist_compound",
      householdType: "two", // You're in a compound, likely with a partner.
      parentRole: "mom", // Often women in these scenarios, but could be dynamic later.
      incomeTier: "low", // Isolated communities often have limited monetary income.
      parentJobId: "stay_at_home_parent", // Roles are often traditional.
      startMoney: 100, // Very low starting money.
      countryIso3: "USA", // Default for now, can be specified.
      playerCultures: ["AMERICAN_US"], // Default cultural context.
      stats: { intelligence: 4, discipline: 7, empathy: 5, confidence: 3 }, // Stats reflecting the environment.
      relationshipAdditions: [
        { id: "senior_wife", role: "other", name: "Senior Wife", emoji: "👵", meter: 30, alive: true, baseAge: 50 },
        { id: "compound_leader", role: "other", name: "The Prophet", emoji: "🧔", meter: 10, alive: true, baseAge: 65 }
      ]
    }
  },
  { id: "reality_tv_family", category: "insane", title: "Reality TV Parenting", description: "Cameras in the kitchen, producers in your life. Parent a kid while ratings reward chaos.", locked: true },
  { id: "time_loop_parent", category: "insane", title: "Time‑Loop Parent", description: "You relive the same year until you 'get it right'—and you remember every mistake.", locked: true },
  { id: "witness_protection", category: "insane", title: "Witness Protection", description: "New name, new town, new lies. Raise a kid who keeps asking the wrong questions out loud.", locked: true },
  { id: "royal_heir_protocol", category: "insane", title: "Royal Heir Protocol", description: "Your child is an heir. Every friend is political, every misstep is news, and privacy is extinct.", locked: true },
  { id: "apocalypse_bunker_stream", category: "insane", title: "Bunker Community (Livestreamed)", description: "You live underground in a survivalist community that livestreams everything—even bedtime.", locked: true },
  { id: "traveling_circus", category: "insane", title: "Traveling Circus Family", description: "Home is wherever the tent goes up. Unusual mentors, constant travel, and zero routine.", locked: true },
  { id: "superhero_coparent", category: "insane", title: "Superhero Co‑Parent", description: "Your co‑parent keeps 'saving the city.' You handle homework, secrecy, and the occasional crater.", locked: true },
  { id: "ai_coparent_beta", category: "insane", title: "AI Co‑Parent (Beta Program)", description: "A startup assigns you an AI co‑parent that scores your parenting. It won't stop sending notifications.", locked: true },
  {
    id: "space_station_family",
    category: "insane",
    title: "Interstellar Voyage Childhood",
    description: "Raise a child aboard a cramped generation ship where rules are oxygen and privacy is a myth.",
    locked: true,
    overrides: {
      specialStartId: "space_station_family",
      countryIso3: "USA",
      householdType: "two",
      parentJobId: "aerospace_program",
      incomeTier: "high",
      startMoney: 12000,
      expenseMultiplier: 1.25,
      stats: { intelligence: 6, discipline: 4, empathy: 4, confidence: 5 },
      parentName: "Casey",
      childName: "Nova"
    }
  },
  { id: "medieval_larp_town", category: "insane", title: "Medieval LARP Town", description: "Your town roleplays medieval life full‑time—yes, including parenting 'customs' and councils.", locked: true },
  { id: "haunted_house_roommate", category: "insane", title: "Haunted House Roommate", description: "Cheap rent, one kid, and a ghost who insists on 'helping.' It's terrible at boundaries.", locked: true },
  { id: "dragon_hoard_homestead", category: "insane", title: "Dragon‑Guarded Homestead", description: "A dragon guards your home and your snacks. It has strong opinions about chores and 'treasure.'", locked: true },
  { id: "mermaid_custody", category: "insane", title: "Mermaid Custody Agreement", description: "You're co‑parenting across land and sea. Different rules, different schedules, same tantrums.", locked: true },
  { id: "vanlife_nomads", category: "insane", title: "Vanlife Nomads", description: "You live in a van chasing sunsets and gigs. Keeping routines alive becomes an extreme sport.", locked: true },
  { id: "hyper_minimalist_commune", category: "insane", title: "Hyper‑Minimalist Commune", description: "Toys are 'clutter.' Labels are 'ego.' Someone scheduled another silent dinner. Again.", locked: true },
  { id: "undercover_food_critic", category: "insane", title: "Undercover Food Critic Parent", description: "You review restaurants anonymously while your child loudly reviews them… to the staff.", locked: true },
  { id: "social_credit_town", category: "insane", title: "Town With a Social Credit Score", description: "Neighbors rate your behavior. Your score decides what your family can access.", locked: true },
  { id: "pta_warlord", category: "insane", title: "PTA Warlord", description: "The PTA runs the school like a kingdom. Climb the hierarchy—or get exiled to bake‑sale purgatory.", locked: true },
  { id: "mega_blended_family", category: "insane", title: "Mega‑Blended Family", description: "So many siblings, so many parents, so many group chats. Every holiday is a logistics boss fight.", locked: true },
  { id: "chosen_one_child", category: "insane", title: "The 'Chosen One' Child", description: "Prophecies, mentors, weird ceremonies… and you still have to pack lunch and set bedtime.", locked: true },

  // -------------------------
  // TRAGIC 😢 (some unlocked + locked)
  // -------------------------
  {
    id: "no_safety_net",
    category: "tragic",
    title: "No Safety Net",
    description: "No savings, no cushion—just you and your child. Build stability one hard choice at a time.",
    locked: false,
    overrides: {
      parentRole: "mom",
      householdType: "single",
      incomeTier: "low",
      parentJobId: "government_assistance",
      startMoney: 600,
      stats: { intelligence: 5, discipline: 3, empathy: 6, confidence: 4 },
      parentName: "Jordan",
      childName: "Avery"
    }
  },
  {
    id: "frida_eric",
    category: "tragic",
    title: "Frida & Eric",
    description: "A grandmother raising her grandson on a tiny income. Love is strong—resources are not.",
    locked: false,
    overrides: {
      parentRole: "mom",
      householdType: "single",
      incomeTier: "low",
      parentJobId: "government_assistance",
      startMoney: 800,
      stats: { intelligence: 7, discipline: 4, empathy: 7, confidence: 3 },
      parentName: "Frida",
      childName: "Eric",
      gender: "boy",
      countryIso3: "SWE"
    }
  },

  // Tragic starts (unlocked)
  { 
    id: "war_zone",
    category: "tragic",
    title: "Surviving in Gaza (War Zone)",
    description: "You bring a baby into a city under bombardment. Keep them safe, fed, and hopeful without losing yourself.",
    locked: false,
    overrides: {
      countryIso3: "PSE",
      householdType: "single",
      parentRole: "mom",
      incomeTier: "low",
      parentJobId: "government_assistance",
      startMoney: 150,
      specialStartId: "war_zone"
    }
  },
  { 
    id: "refugee_camp",
    category: "tragic",
    title: "Raising a Child in a Refugee Camp (Syria)",
    description: "A life of tents, lines, and paperwork. Raise a child with dignity and hope while you wait for a way out.",
    locked: false,
    overrides: {
      countryIso3: "SYR",
      householdType: "single",
      parentRole: "mom",
      incomeTier: "low",
      parentJobId: "government_assistance",
      startMoney: 80,
      specialStartId: "refugee_camp"
    }
  },
  { id: "border_crossing", category: "tragic", title: "Border Crossings", description: "Checkpoints, waiting rooms, and the question of where you'll land. Keep your child calm as everything moves.", locked: true },
  { id: "disaster_rebuild", category: "tragic", title: "After the Disaster", description: "A disaster shattered your home. Rebuild routines and safety while your child processes loss.", locked: true },
  { id: "homelessness", category: "tragic", title: "Shelter‑to‑Shelter", description: "Temporary beds, long commutes, constant uncertainty. Protect your child's routine when nothing is stable.", locked: true },
  { id: "food_insecurity", category: "tragic", title: "Food Insecurity + Paperwork", description: "Meals are math. Paperwork is a second job. Keep your child fed, calm, and cared for.", locked: true },
  { id: "repression_surveillance", category: "tragic", title: "Living Under Surveillance", description: "In a place where speech has consequences, you teach courage without teaching fear.", locked: true },
  { id: "incarcerated_parent", category: "tragic", title: "Parenting Through Incarceration", description: "Letters, visits, long gaps. Keep attachment alive when parenting happens through barriers.", locked: true },
  { id: "dv_escape", category: "tragic", title: "Leaving an Unsafe Home", description: "You and your child leave to stay safe. Rebuild trust, routines, and peace—one year at a time.", locked: true },
  { id: "addiction_recovery_home", category: "tragic", title: "Recovery in the Household", description: "Someone is in recovery. Boundaries, trust, and stability are rebuilt slowly, year by year.", locked: true },
  { id: "child_chronic_illness", category: "tragic", title: "Child With Chronic Illness", description: "Appointments and uncertainty shape childhood. Parent through care while your child stays a kid.", locked: true },
  { id: "parent_chronic_illness", category: "tragic", title: "Parent With Chronic Illness", description: "You manage your own health while staying present for your child. Some days are triage.", locked: true },
  { id: "nicu_first_year", category: "tragic", title: "NICU First Year", description: "Your baby begins life in intensive care. Fear, hope, and tiny victories become your routine.", locked: true },
  {
    id: "grief_year",
    category: "tragic",
    title: "The Grief Year",
    description: "A major loss reshapes your family. Parenting becomes endurance—then repair.",
    locked: false,
    overrides: {
      parentRole: "mom",
      householdType: "two",
      incomeTier: "medium",
      parentJobId: "social_worker",
      startMoney: 2500,
      expenseMultiplier: 1.05,
      stats: { intelligence: 5, discipline: 3, empathy: 6, confidence: 3 },
      parentName: "Samira",
      childName: "Omar",
      countryIso3: "USA"
    }
  },
  { id: "foster_kinship_guardian", category: "tragic", title: "Foster / Kinship Guardian", description: "A child enters your home carrying a past they didn't choose. Build safety and trust from scratch.", locked: true },

  // -------------------------
  // TABOO & SECRET LIFE 💋
  // -------------------------
  {
    id: "taboo_adult_entertainer",
    category: "taboo",
    title: "Adult Entertainer 🌙💃",
    description: "Night shifts, fast cash, and a life you keep hidden at daycare pickup. Can you build stability while the world judges you?",
    locked: true
  },
  {
    id: "taboo_anonymous_persona",
    category: "taboo",
    title: "Anonymous Online Persona 🎭🫥",
    description: "By day you're a parent. By night you're secretly famous online. One leak could wreck your family—manage money, stress, and secrecy.",
    locked: true
  },
  {
    id: "taboo_double_life",
    category: "taboo",
    title: "Double Life 🕶️💍",
    description: "Your relationship started with a secret that won't stay buried. Keep your child safe while truth, trust, and consequences collide.",
    locked: true
  },
  {
    id: "taboo_gambling_debt",
    category: "taboo",
    title: "Gambling Debt 🎰💸",
    description: "You start in the hole. Every 'one last bet' is a trap—and your kid needs food, not adrenaline. Climb out before it swallows you.",
    locked: true
  },
  {
    id: "taboo_nightlife_hostess",
    category: "taboo",
    title: "Nightlife Hostess 🍸🌙",
    description: "VIP rooms, big tips, blurry boundaries, brutal mornings. Keep your child's life stable when yours runs after dark.",
    locked: true
  },
  {
    id: "taboo_fleeing_cult",
    category: "taboo",
    title: "Fleeing the Cult 🕯️🛐",
    description: "You escaped a controlling cult with your baby. Rebuild a normal life while the past tries to pull you back in.",
    locked: true
  },

  // New 18 Locked Special Starts
  {
    id: "taboo_polycule_household",
    title: "Polycule Household 💞🏠",
    description: "You're raising a child in a real, consensual polycule: multiple partners, one home, one family. Love is abundant… and so are schedules, jealousy, and chaos. Can you keep trust and stability when life gets crowded?",
    category: "normal",
    locked: true
  },
  {
    id: "taboo_secret_bigamy",
    title: "Secret Bigamy 🤫💍",
    description: "Two marriages. Two calendars. One child caught between two worlds. Every holiday is a lie, every message is a risk—how long can you juggle before the truth detonates?",
    category: "normal",
    locked: true
  },
  {
    id: "taboo_fifty_shades_maroon",
    title: "Fifty Shades of Maroon 🟥🩶",
    description: "A billionaire romance with strict rules, glossy perks, and a lifestyle that looks perfect from the outside. Raise a child where luxury is real… but freedom has fine print.",
    category: "normal",
    locked: true
  },
  {
    id: "taboo_vip_patron",
    title: "The VIP Patron 🍸👑",
    description: "A mysterious patron offers rent, gifts, and connections—if you keep things discreet. Take the perks, manage the pressure, and protect your child when 'help' starts feeling like control.",
    category: "normal",
    locked: true
  },
  {
    id: "taboo_anonymous_celebrity",
    title: "Anonymous Celebrity 🎥🫥",
    description: "You're famous… but you refuse the spotlight. Keep your child's life normal while paparazzi, fans, and rumors circle closer to the truth.",
    category: "normal",
    locked: true
  },
  {
    id: "pressure_cruise_ship_childhood",
    title: "Cruise Ship Childhood 🛳️👶",
    description: "Your home changes ports every week. School is improvised, friendships are fleeting, and stability must be built inside a suitcase. Can you raise a grounded child on a moving world?",
    category: "normal",
    locked: true
  },
  {
    id: "duty_oil_rig_rotation",
    title: "Oil Rig Rotation 🛢️⛑️",
    description: "Big pay. Long absences. Your child learns to count time in departures. Can your family survive the rotation schedule without drifting apart?",
    category: "normal",
    locked: true
  },
  {
    id: "duty_wildfire_season_parent",
    title: "Wildfire Season Parent 🔥🧯",
    description: "When the sirens sound, you go. Disaster response puts food on the table—and fear in your child's heart. Choose between duty, danger, and home when every call could be the big one.",
    category: "normal",
    locked: true
  },
  {
    id: "duty_remote_research_outpost",
    title: "Remote Research Outpost 🏝️🛰️",
    description: "You're raising a child at the edge of the world. No neighbors, no backup, and nature doesn't care about bedtime. Build a childhood where isolation is the price of purpose.",
    category: "normal",
    locked: true
  },
  {
    id: "survival_quarantine_protocol",
    title: "Quarantine Protocol 🧪🚪",
    description: "A crisis locks your household behind strict rules. Resources are limited, patience is thinner, and every decision balances safety vs sanity. Keep your family together when the walls close in.",
    category: "tragic",
    locked: true
  },
  {
    id: "power_inheritance_conditions",
    title: "Inheritance With Conditions 🧿📜",
    description: "A fortune arrives with a list of bizarre rules. Break them and you lose everything. Follow them and your child grows up inside a contract. Is security worth the strings?",
    category: "normal",
    locked: true
  },
  {
    id: "power_whistleblower",
    title: "The Whistleblower 🏛️📣",
    description: "You exposed a powerful secret. Now you're raising a child while staying ahead of retaliation, lawsuits, and a world that wants you quiet. Teach courage—without getting crushed.",
    category: "normal",
    locked: true
  },
  {
    id: "power_undercover_parent",
    title: "Undercover Parent 🕵️‍♀️🏫",
    description: "You're living under an alias in a perfectly normal town. One innocent question from your kid could blow your cover. Keep the mask on while parenting gets real.",
    category: "normal",
    locked: true
  },
  {
    id: "power_aristocrat_scandal",
    title: "The Aristocrat's Scandal 🏰🗝️",
    description: "You married into high society—and then came the scandal. Parenthood becomes PR, and every playdate is politics. Can you protect your child when reputation becomes survival?",
    category: "normal",
    locked: true
  },
  {
    id: "insane_werewolf_coparenting",
    title: "Werewolf Co‑Parenting 🐺🌕",
    description: "Co‑parenting is hard. Co‑parenting with a werewolf is scheduling hell. Keep your child safe when the calendar turns dangerous and the rules of 'normal' don't apply.",
    category: "insane",
    locked: true
  },
  {
    id: "insane_vampire_night_family",
    title: "Vampire Night Family 🧛🌙",
    description: "Your household runs after sunset. School mornings hurt, secrets multiply, and your child starts noticing you never seem to age. Raise a kid when daylight is your enemy.",
    category: "insane",
    locked: true
  },
  {
    id: "insane_fairy_contract_guardian",
    title: "Fairy Contract Guardian 🧚‍♀️📜",
    description: "You agreed to raise a 'special' child under magical terms. The benefits are real—the penalties are worse. Keep the contract, keep your kid… and don't miss a single clause.",
    category: "insane",
    locked: true
  },
  {
    id: "insane_underground_society",
    title: "Underground Society 🎩🕳️",
    description: "There's a hidden world beneath the city with its own laws and protection—if you obey. Raise a child where normal life is camouflage and curiosity is dangerous.",
    category: "insane",
    locked: true
  }
];

// Emoji mapping for Special Starts
const SPECIAL_START_EMOJI_BY_ID = {
  famous_pop_star: '🌟🎶',
  spotlight_movie_star: '🎬🌟',
  spotlight_pro_athlete: '🏟️🌟',
  spotlight_influencer: '📱🌟',
  spotlight_music_icon: '🌍🎶',
  spotlight_business_mogul: '💼🌟',
  spotlight_astronaut: '🚀🌟',
  spotlight_president: '🗳️🌟',
  spotlight_royal_family: '👑🌟',
  spotlight_spy: '🕵️🌟',
  spotlight_olympian: '🥇🌟',
  spotlight_nobel_scientist: '🔬🌟',
  spotlight_humanitarian_doctor: '🩺🌟',
  spotlight_reality_tv: '📺🌟',
  spotlight_tech_founder: '💼🌟',
  spotlight_war_correspondent: '📰🌟',
  spotlight_fashion_icon: '👗🌟',
  spotlight_chef: '👨‍🍳🌟',
  spotlight_esports: '🎮🌟',
  spotlight_guru: '🧘🌟',
  spotlight_arctic_station: '🧊🌟',
  golden_cage: '🥂',
  newcomer_reset: '🧳',
  tradition_tug_of_war: '🧿',
  child_adhd: '⚡',
  sugar_baby: '💎',
  child_autism: '🧩',
  child_down_syndrome: '❤️',
  child_dyslexia: '📚',
  child_deaf_hoh: '🤟',
  child_mobility_aid: '♿',
  single_parent_household: '🧍',
  blended_family: '🧩🏠',
  first_gen_immigrant: '🌍',
  rural_isolation: '🌾',
  tiny_apartment_city: '🏙️',
  two_working_parents_childcare: '🧷',
  eldercare_shared: '🧓🤝',
  gifted_child: '✨',
  divorce_coparenting: '🗓️',
  twins_triplets: '👶👶👶',
  teen_parent: '🧃',
  caregiver_grandparent_home: '🧓',
  military_relocation_cycle: '🪖',
  mafia_family: '🕴️',
  alien_invasion: '👽',
  kim_jong_un: '🚀🟥',
  polygamist_doctor_indonesia: '👰👰👰👰🩺',
  closed_polygamist_compound: '🏜️🔒',
  reality_tv_family: '📺',
  time_loop_parent: '🔁',
  witness_protection: '🕶️',
  royal_heir_protocol: '👑',
  apocalypse_bunker_stream: '🧱📡',
  traveling_circus: '🎪',
  superhero_coparent: '🦸',
  ai_coparent_beta: '🤖',
  space_station_family: '🛰️',
  medieval_larp_town: '🏰',
  haunted_house_roommate: '👻',
  dragon_hoard_homestead: '🐉',
  mermaid_custody: '🧜',
  vanlife_nomads: '🚐',
  hyper_minimalist_commune: '🧺',
  undercover_food_critic: '🍽️',
  social_credit_town: '🧾',
  pta_warlord: '📋⚔️',
  mega_blended_family: '👨‍👩‍👧‍👦➕',
  chosen_one_child: '🔮',
  no_safety_net: '🧱',
  frida_eric: '🕯️',
  refugee_camp: '⛺',
  war_zone: '🕊️💔',
  border_crossing: '🛂',
  disaster_rebuild: '🌊',
  homelessness: '🛏️',
  food_insecurity: '🥫',
  repression_surveillance: '👁️',
  incarcerated_parent: '⛓️',
  dv_escape: '🚪',
  addiction_recovery_home: '🧩🫶',
  child_chronic_illness: '🩺',
  parent_chronic_illness: '🩻',
  nicu_first_year: '🍼🏥',
  grief_year: '🖤',
  foster_kinship_guardian: '🫂',
  zombie_apocalypse: '🧟',
  taboo_adult_entertainer: '🌙💃',
  taboo_anonymous_persona: '🎭🫥',
  taboo_double_life: '🕶️💍',
  taboo_gambling_debt: '🎰💸',
  taboo_nightlife_hostess: '🍸🌙',
  taboo_fleeing_cult: '🕯️🛐',
  taboo_polycule_household: '💞🏠',
  taboo_secret_bigamy: '🤫💍',
  taboo_fifty_shades_maroon: '🟥🩶',
  taboo_vip_patron: '🍸👑',
  taboo_anonymous_celebrity: '🎥🫥',
  pressure_cruise_ship_childhood: '🛳️👶',
  duty_oil_rig_rotation: '🛢️⛑️',
  duty_wildfire_season_parent: '🔥🧯',
  duty_remote_research_outpost: '🏝️🛰️',
  survival_quarantine_protocol: '🧪🚪',
  power_inheritance_conditions: '🧿📜',
  power_whistleblower: '🏛️📣',
  power_undercover_parent: '🕵️‍♀️🏫',
  power_aristocrat_scandal: '🏰🗝️',
  insane_werewolf_coparenting: '🐺🌕',
  insane_vampire_night_family: '🧛🌙',
  insane_fairy_contract_guardian: '🧚‍♀️📜',
  insane_underground_society: '🎩🕳️'
};

// Derive a version with emoji set for all entries
const SPECIAL_STARTS = SPECIAL_START_CATALOG.filter(Boolean).map(s => ({
  ...s,
  emoji: SPECIAL_START_EMOJI_BY_ID[s.id] ?? s.emoji ?? ''
}));

// UI Groups for Special Starts
const SPECIAL_START_GROUPS = [
  { key: 'insane', emoji: '😈', label: 'Insane Starts', blurb: 'Apocalypses, conspiracies, and chaos runs.' },
  { key: 'survival', emoji: '🧱', label: 'Survival Mode', blurb: 'Hard-mode realism: poverty, war, crisis.' },
  { key: 'neuro', emoji: '🧠', label: 'Neurodiversity & Access', blurb: 'Different needs, different wins.' },
  { key: 'family', emoji: '🎭', label: 'Family Dynamics', blurb: 'Relationships, co‑parenting, and chaotic households.' },
  { key: 'pressure', emoji: '🏠', label: 'Pressure Cooker Life', blurb: 'Isolation, culture pressure, tiny apartments, moving.' },
  { key: 'fame', emoji: '🌟', label: 'Fame, Spotlight & Competition', blurb: 'Celebrity parenting under the public eye.' },
  { key: 'power', emoji: '👑', label: 'Power, Wealth & Institutions', blurb: 'Royalty, leadership, influence, and elite stakes.' },
  { key: 'duty', emoji: '🚀', label: 'Exploration & High‑Risk Duty', blurb: 'Frontiers, danger, and impossible tradeoffs.' },
  { key: 'taboo', emoji: '💋', label: 'Taboo & Secret Life', blurb: 'Secrets, stigma, and double lives.' }
];

// Map each scenario to exactly one UI group
function getSpecialStartGroupKey(scenario) {
  const id = scenario.id;
  
  // Insane Starts
  if (scenario.category === 'insane') return 'insane';
  
  // Survival Mode
  if (scenario.category === 'tragic') return 'survival';
  
  // Taboo & Secret Life
  if (id === 'sugar_baby' || scenario.category === 'taboo' || id.startsWith('taboo_')) return 'taboo';
  
  // Neurodiversity & Access
  const neuroIds = new Set(['child_adhd', 'child_autism', 'child_down_syndrome', 'child_dyslexia', 'child_deaf_hoh', 'child_mobility_aid', 'gifted_child']);
  if (neuroIds.has(id)) return 'neuro';
  
  // Family Dynamics
  const familyIds = new Set(['single_parent_household', 'blended_family', 'divorce_coparenting', 'teen_parent', 'twins_triplets', 'two_working_parents_childcare', 'eldercare_shared', 'caregiver_grandparent_home']);
  if (familyIds.has(id)) return 'family';
  
  // Pressure Cooker Life
  const pressureIds = new Set(['newcomer_reset', 'tradition_tug_of_war', 'rural_isolation', 'tiny_apartment_city', 'first_gen_immigrant', 'military_relocation_cycle']);
  if (pressureIds.has(id)) return 'pressure';
  
  // Power, Wealth & Institutions
  const powerIds = new Set(['golden_cage', 'spotlight_business_mogul', 'spotlight_tech_founder', 'spotlight_president', 'spotlight_royal_family', 'spotlight_spy']);
  if (powerIds.has(id)) return 'power';
  
  // Exploration & High‑Risk Duty
  const dutyIds = new Set(['spotlight_astronaut', 'spotlight_arctic_station', 'spotlight_nobel_scientist', 'spotlight_humanitarian_doctor', 'spotlight_war_correspondent']);
  if (dutyIds.has(id)) return 'duty';
  
  // Fame, Spotlight & Competition
  if (scenario.category === 'famous') return 'fame';
  
  // Fallback (should rarely happen)
  if (scenario.category === 'normal') return 'pressure';
  console.warn('[getSpecialStartGroupKey] Scenario fell through to fallback:', id, scenario);
  return 'survival';
}

import { CULTURAL_ROOTS, COUNTRY_NAMES } from '@/components/game/culturalRootsData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useConfirm } from '@/components/game/ConfirmProvider';
import { track } from "@/components/lib/rtAnalytics";
import { useTutorial } from '@/components/tutorial/TutorialContext';
import { base44 } from '@/api/base44Client';
import { CHAOS_MODE_LEVELS } from "@/components/game/chaosModeLevels";
import { pickQuickStartFaith } from '@/components/game/faithCountryDefaults';
import MultiplayerMenuDialog from '@/components/multiplayer/MultiplayerMenuDialog';
import MultiplayerCharacterSetupDialog from '@/components/multiplayer/MultiplayerCharacterSetupDialog';
import TemperamentHelpPopover from '@/components/game/TemperamentHelpPopover';

export default function Start() {
  const navigate = useNavigate();
  const { resetGame, updateState, gameState, loadGameFromSlot, setActiveSaveSlot, addChild, setSiblingRivalryEnabled, setLocalCoopEnabled } = useGameState();
  const confirm = useConfirm();
  const { startTour, registerAction } = useTutorial();
  
  // Parse legacy URL params
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const isLegacy = urlParams.get('legacy') === 'true';
  const legacyParentName = urlParams.get('parent') || '';
  const legacyRole = urlParams.get('role') || 'mom';
  const legacyHousehold = urlParams.get('household') || 'two';
  const legacyIncome = urlParams.get('income') || 'medium';
  // Sanitize URL param so bad/missing values never produce NaN in game state.
  const legacyMoney = Number.parseInt(urlParams.get('money') ?? '0', 10) || 0;
  const legacyEntry = urlParams.get('entry') || '';
  const isLegacyPlayAsChild = isLegacy && legacyEntry === 'playAsChild';
  const entryParam = urlParams.get('entry') || '';
  
  const [startStep, setStartStep] = useState(() => (entryParam === 'specialStarts' ? 'specialStarts' : (isLegacyPlayAsChild ? 'avatar' : 'intro')));
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedToneIndex, setSelectedToneIndex] = useState(2);
  const [selectedParentRole, setSelectedParentRole] = useState(isLegacy ? legacyRole : 'mom');
  const [selectedTemperament, setSelectedTemperament] = useState('balanced');
  const [selectedHouseholdType, setSelectedHouseholdType] = useState(isLegacy ? legacyHousehold : 'two');
  const [selectedIncomeTier, setSelectedIncomeTier] = useState(isLegacy ? legacyIncome : 'medium');
  const [partnerCreatorOpen, setPartnerCreatorOpen] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [familyPatternsModalOpen, setFamilyPatternsModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedParentAvatarIndex, setSelectedParentAvatarIndex] = useState(null);
  const [selectedChildAvatarIndex, setSelectedChildAvatarIndex] = useState(null);
  const [specialStartCategory, setSpecialStartCategory] = useState('normal');
  const [specialStartGroupOpen, setSpecialStartGroupOpen] = useState(null);
  
  // Pop Star Character Creator
  const [popStarCreatorOpen, setPopStarCreatorOpen] = useState(false);
  const [pendingPopStarScenario, setPendingPopStarScenario] = useState(null);
  const [pendingSpecialStart, setPendingSpecialStart] = useState(null);
  const [specialStartChoiceOpen, setSpecialStartChoiceOpen] = useState(false);
  const [selectedSpecialStart, setSelectedSpecialStart] = useState(null);
  const [popStarName, setPopStarName] = useState("");
  const [popStarRole, setPopStarRole] = useState("mom");
  const [popStarHousehold, setPopStarHousehold] = useState("two");
  const [popStarPartnerName, setPopStarPartnerName] = useState("");
  const [popStarPartnerGender, setPopStarPartnerGender] = useState("male");
  const [popStarChildName, setPopStarChildName] = useState("");
  const [popStarBioParentName, setPopStarBioParentName] = useState("");
  const [popStarMomName, setPopStarMomName] = useState("");
  const [popStarDadName, setPopStarDadName] = useState("");
  const [popStarMomAlive, setPopStarMomAlive] = useState(true);
  const [popStarDadAlive, setPopStarDadAlive] = useState(true);
  const [popStarFameTier, setPopStarFameTier] = useState("alist");
  const [popStarAgeAtBirth, setPopStarAgeAtBirth] = useState(28);
  const [popStarPartnerAgeAtBirth, setPopStarPartnerAgeAtBirth] = useState(29);

  // Chaos Mode Start
  const [chaosStartOpen, setChaosStartOpen] = useState(false);
  const [chaosStartLevel, setChaosStartLevel] = useState(2);
  const [pendingChaosStartLevel, setPendingChaosStartLevel] = useState(0);

  // Before Baby mode
  const [beforeBabyOpen, setBeforeBabyOpen] = useState(false);
  const [startWithoutChildMode, setStartWithoutChildMode] = useState(false);

  // Multiplayer menu state
  const [mpMenuOpen, setMpMenuOpen] = useState(false);
  const [mpCustomizeOpen, setMpCustomizeOpen] = useState(false);

  // Cutscene state
  const [showCutscene, setShowCutscene] = useState(false);

  // Derived: locked country for special starts
  const lockedScenarioCountryIso3 = pendingSpecialStart?.overrides?.countryIso3 || null;

  // Dev-only validation for Special Starts completeness
  useEffect(() => {
    if (!(import.meta?.env?.DEV)) return;
    try {
      const menuIds = new Set((SPECIAL_STARTS || []).map(s => s.id));
      const unlocked = (SPECIAL_STARTS || []).filter(s => s.locked === false).map(s => s.id);
      const metaSupported = new Set([
        'rural_isolation','tiny_apartment_city','two_working_parents_childcare','eldercare_shared','child_mobility_aid','single_parent_household','blended_family','first_gen_immigrant','child_adhd','gifted_child','child_down_syndrome','child_dyslexia','child_deaf_hoh','food_insecurity','disaster_rebuild','grief_year','closed_polygamist_compound'
      ]);
      const customScenario = new Set(['alien_invasion','zombie_apocalypse','kim_jong_un']);

      const missingContent = unlocked.filter(id => !metaSupported.has(id) && !customScenario.has(id));
      if (missingContent.length) {
        console.warn('[DEV] Unlocked special starts without meta/override:', missingContent);
      }

      // Optional pack-yearly-checkins cross-check (best-effort)
      (async () => {
        try {
          const mod = await import('@/components/game/packYearlyCheckins');
          const packIds = Array.isArray(mod?.PACK_YEARLY_CHECKINS)
            ? Array.from(new Set(mod.PACK_YEARLY_CHECKINS.map(p => p?.specialStartId).filter(Boolean)))
            : [];
          const referencedNotInMenu = packIds.filter(id => !menuIds.has(id));
          if (referencedNotInMenu.length) {
            console.warn('[DEV] Packs reference specialStartIds not in menu:', referencedNotInMenu);
          }
        } catch {}
      })();
    } catch {}
  }, []);

  // Country Selection
  const [selectedCountryIso3, setSelectedCountryIso3] = useState("USA");
  const [availableCountryIso3s, setAvailableCountryIso3s] = useState([]);
  const [countrySeed, setCountrySeed] = useState(Date.now());
  const [selectedCulturalRoots, setSelectedCulturalRoots] = useState([]);

  // Init countries
  useEffect(() => {
    if (lockedScenarioCountryIso3) {
      setSelectedCountryIso3(lockedScenarioCountryIso3);
      setAvailableCountryIso3s([getCountryByIso3(lockedScenarioCountryIso3)]);
      return;
    }
    setAvailableCountryIso3s(pickTenCountries());
  }, [countrySeed, lockedScenarioCountryIso3]);

  const handleShuffleCountries = () => {
    if (lockedScenarioCountryIso3) return;
    setCountrySeed(Date.now());
  };

  // Register tutorial action
  useEffect(() => {
    registerAction('startTutorialRun', () => {
      // Predictable start for tutorial
      const tutorialConfig = {
        childName: 'Alex',
        gender: 'boy',
        countryIso3: 'USA'
      };
      
      const careerConfig = computeStartingCareer({
        educationLevelId: 'college',
        fieldId: 'business',
        ageAtBirth: 28,
        jobId: 'business_analyst'
      });

      startGameWithConfig('balanced', [], careerConfig, {
        selectedCountryIso3: 'USA',
        availableCountryIso3s: ['USA', 'CAN', 'GBR', 'AUS', 'FRA', 'DEU', 'ITA', 'JPN', 'BRA', 'IND'],
        seed: 12345
      }, tutorialConfig);
    });
  }, [registerAction]);
  
  // Job system state
  const [selectedEducation, setSelectedEducation] = useState('college');
  const [selectedField, setSelectedField] = useState('business');
  const [parentAgeAtBirth, setParentAgeAtBirth] = useState(28);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [computedCareer, setComputedCareer] = useState(null);
  const [showWhyThisMatters, setShowWhyThisMatters] = useState(false);

  // Save slot UI (Continue / Multiple families)
  const [saveLoadOpen, setSaveLoadOpen] = useState(false);
  const [saveSlots, setSaveSlots] = useState([]);
  const [explicitNewSlotId, setExplicitNewSlotId] = useState(null);
  const [activeSlotId, setActiveSlotIdState] = useState(() => {
    try {
      return getActiveSlotId() || 'slot1';
    } catch {
      return 'slot1';
    }
  });

  const refreshSaveSlots = useCallback(() => {
    try {
      setSaveSlots(listSlots());
      setActiveSlotIdState(getActiveSlotId() || 'slot1');
    } catch (e) {
      console.error('Failed to refresh save slots:', e);
    }
  }, []);

  useEffect(() => {
    refreshSaveSlots();
  }, [refreshSaveSlots]);

  // Autosave recovery: if bootLoadError set, open Save/Load and inform user
  useEffect(() => {
    if (gameState?.bootLoadError) {
      setSaveLoadOpen(true);
      toast.warning("We couldn't load your autosave. Attempting recovery. If you're on mobile Safari, storage may be full.");
    }
  }, [gameState?.bootLoadError]);

  const startedSlots = saveSlots.filter(s => s.exists && s.started);
  const continueSlot = (() => {
    if (startedSlots.length === 0) return null;
    const active = startedSlots.find(s => s.slotId === activeSlotId);
    if (active) return active;
    // Fallback: most recently updated started slot
    const sorted = [...startedSlots].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    return sorted[0] || null;
  })();

  const handleContinue = () => {
    if (!continueSlot) return;
    setExplicitNewSlotId(null);
    const ok = typeof loadGameFromSlot === 'function' ? loadGameFromSlot(continueSlot.slotId) : false;
    if (ok) {
      navigate(createPageUrl('Game'));
    } else {
      toast.info('No saved game found. Opening save slots…');
      setSaveLoadOpen(true);
    }
  };

  const handleBackToIntro = () => {
    setStartStep('intro');
  };

  const handleNextFromName = () => {
    setStartStep('avatar');
  };

  const handleAvatarSelect = (gender, spriteIndex) => {
    setSelectedGender(gender);
    setSelectedChildAvatarIndex(spriteIndex);
    setSelectedToneIndex(Number(spriteIndex) % 4);
  };
  
  const handleContinueFromAvatar = () => {
    if (!selectedGender || selectedChildAvatarIndex == null) return;
    if (isLegacy) {
      setStartStep('temperament');
    } else {
      setStartStep('role');
    }
  };

  const handleSelectRoleAndContinue = (role) => {
    setSelectedParentRole(role);
    if (selectedParentAvatarIndex == null) {
      const toneCol = (selectedToneIndex ?? 0) % 4;
      setSelectedParentAvatarIndex(toneCol);
    }
    setStartStep('parentAvatar');
  };

  const handleBackToParentAvatarRole = () => setStartStep('role');
  const handleParentAvatarAndContinue = () => setStartStep('parentName');

  const handleParentNameAndContinue = () => {
    if (startWithoutChildMode) {
      setStartStep('household');
    } else {
      setStartStep('temperament');
    }
  };

  const handleSelectTemperamentAndContinue = (temperamentId) => {
    setSelectedTemperament(temperamentId);
    
    // Legacy mode: skip household/income selection, go straight to game
    if (isLegacy) {
      setStartStep('income');
    } else {
      setStartStep('household');
    }
  };

  const handleSelectHouseholdAndContinue = (householdType) => {
    setSelectedHouseholdType(householdType);
    
    // If partnered, open partner creator modal first
    if (householdType === 'two') {
      setPartnerCreatorOpen(true);
    } else {
      // Single parent - go to country selection (new flow) or income (legacy)
      if (isLegacy) {
        setStartStep('income');
      } else if (lockedScenarioCountryIso3) {
        setSelectedCountryIso3(lockedScenarioCountryIso3);
        setAvailableCountryIso3s([getCountryByIso3(lockedScenarioCountryIso3)]);
        setStartStep('culturalRoots'); // skip country picker entirely
      } else {
        setStartStep('country');
      }
    }
  };

  const handlePartnerCreated = (data) => {
    setPartnerData(data);
    setPartnerCreatorOpen(false);
    
    // Go to country selection (new flow) or income (legacy)
    if (isLegacy) {
      setStartStep('income');
    } else if (lockedScenarioCountryIso3) {
      setSelectedCountryIso3(lockedScenarioCountryIso3);
      setAvailableCountryIso3s([getCountryByIso3(lockedScenarioCountryIso3)]);
      setStartStep('culturalRoots'); // skip country picker entirely
    } else {
      setStartStep('country');
    }
  };

  const handleSelectCountryAndContinue = (iso3) => {
    setSelectedCountryIso3(iso3);
    setStartStep('culturalRoots');
  };

  const handleToggleRoot = (id) => {
    if (selectedCulturalRoots.includes(id)) {
      setSelectedCulturalRoots(selectedCulturalRoots.filter(r => r !== id));
    } else {
      setSelectedCulturalRoots([...selectedCulturalRoots, id]);
    }
  };

  const handleCulturalRootsContinue = () => {
    setStartStep('education');
  };

  const handleSelectIncomeAndStart = (incomeTier) => {
    setSelectedIncomeTier(incomeTier);
    
    // Open family patterns modal (required step)
    setFamilyPatternsModalOpen(true);
  };

  const handleSelectEducationAndContinue = (educationId) => {
    setSelectedEducation(educationId);
    
    // Only use field selection for these education levels
    const FIELD_EDUS = new Set(['bachelors', 'college', 'masters', 'phd', 'mba']);
    
    if (FIELD_EDUS.has(educationId)) {
      setStartStep('field');
    } else {
      // For all other education types (high_school, trade, associate, jd, md, dds, dvm)
      setSelectedField(null);
      setStartStep('parentAge');
    }
  };

  const handleSelectFieldAndContinue = (fieldId) => {
    setSelectedField(fieldId);
    setStartStep('parentAge');
  };

  const handleParentAgeAndContinue = () => {
    setStartStep('job');
  };

  const handleSelectJobAndContinue = (jobId) => {
    setSelectedJobId(jobId);
    
    // Compute full career config
    const career = computeStartingCareer({
      educationLevelId: selectedEducation,
      fieldId: selectedField,
      ageAtBirth: parentAgeAtBirth,
      jobId: jobId
    });
    
    setComputedCareer(career);
    setStartStep('patterns');
  };
  
  const handleFamilyPatternsComplete = (selectedPatternIds) => {
    setFamilyPatternsModalOpen(false);
    
    // Check if this was from a pending special start
    if (pendingSpecialStart) {
      const { scenario, overrides, careerConfig, countryConfig } = pendingSpecialStart;
      setPendingSpecialStart(null);
      const extra = startWithoutChildMode ? { startWithoutChild: true } : {};
      startGameWithConfig(
        'balanced',
        Array.isArray(selectedPatternIds) ? selectedPatternIds : [],
        careerConfig,
        countryConfig,
        { ...overrides, ...extra }
      );
      if (startWithoutChildMode) setStartWithoutChildMode(false);
    } else if (pendingSpecialStart) {
      // Special start from customize path
      const { scenario, overrides } = pendingSpecialStart;
      setPendingSpecialStart(null);
      
      const randomSeed = Date.now();
      const randomCountries = pickTenCountries();
      const countryIso3 = overrides.countryIso3 || randomCountries[0].iso3;
      
      const jobId = overrides.parentJobId || 'retail_associate';
      const startMoney = overrides.startMoney || 2000;
      const job = getJobById(jobId);
      const ageAtBirth = overrides.ageAtBirth || 28;
      
      const careerConfig = computeStartingCareer({ 
        educationLevelId: overrides.educationLevelId || job?.minEducation || 'high_school',
        jobId, 
        ageAtBirth 
      });
      
      careerConfig.yearlyIncome = overrides.yearlyIncome || careerConfig.yearlyIncome;
      careerConfig.startMoney = startMoney;
      careerConfig.incomeTier = overrides.incomeTier || 'medium';
      
      startGameWithConfig(
        'balanced',
        Array.isArray(selectedPatternIds) ? selectedPatternIds : [],
        careerConfig,
        { selectedCountryIso3: countryIso3, availableCountryIso3s: randomCountries, seed: randomSeed },
        overrides
      );
    } else {
      // Normal flow: Save selected patterns to state during game start and proceed immediately
      const extra = startWithoutChildMode ? { startWithoutChild: true } : {};
      startGameWithConfig(selectedTemperament || 'balanced', Array.isArray(selectedPatternIds) ? selectedPatternIds : [], computedCareer, null, extra);
      if (startWithoutChildMode) setStartWithoutChildMode(false);
    }
  };

  const getRunSeed = () => {
    return gameState?.runSeed || `seed_${Date.now()}`;
  };
  
  const startGameWithConfig = async (temperamentId, selectedPatternIds = [], careerConfig = null, countryConfig = null, overrides = {}) => {
    track("rt_start_game");
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    
    // Merge pendingChaosStartLevel if set
    const mergedOverrides = { 
      ...(pendingChaosStartLevel > 0 ? { chaosModeLevel: pendingChaosStartLevel } : {}), 
      ...(overrides || {}) 
    };
    
    // Clear pendingChaosStartLevel after consuming it
    if (pendingChaosStartLevel > 0) {
      setPendingChaosStartLevel(0);
    }
    
    // Generate fresh run seed for THIS start (not sticky from countrySeed)
    const runSeedForThisStart = String(overrides?.runSeed || `seed_${Date.now()}`);
    // Ensure parents exist logic
    const ensureParentsExist = (gameState) => {
        const playerAgeNow = (gameState.parentAgeAtBirth ?? 28) + (gameState.currentYear ?? 0);
        let mother = gameState.relationships?.byId?.mother;
        let father = gameState.relationships?.byId?.father;

        if (!mother) {
            const momAtBirth = 18 + Math.floor(createSeededRng(`${gameState.runSeed}|motherAge`).nextFloat() * 23);
            mother = {
                id: 'mother',
                role: 'mother',
                name: 'Mom',
                genderKey: 'female',
                baseAge: playerAgeNow + momAtBirth,
                isDeceased: false,
                alive: true,
                deathYear: null,
                lastMournedYear: null,
                mortalityMultiplier: 0.85 + createSeededRng(`${gameState.runSeed}|mother`).nextFloat() * 0.3,
            };
        }

        if (!father) {
            const dadAtBirth = (mother.baseAge - playerAgeNow) + Math.floor(createSeededRng(`${gameState.runSeed}|fatherAge`).nextFloat() * 7);
            father = {
                id: 'father',
                role: 'father',
                name: 'Dad',
                genderKey: 'male',
                baseAge: playerAgeNow + dadAtBirth,
                isDeceased: false,
                alive: true,
                deathYear: null,
                lastMournedYear: null,
                mortalityMultiplier: 0.85 + createSeededRng(`${gameState.runSeed}|father`).nextFloat() * 0.3,
            };
        }
        
        if (mother.baseAge >= 85 && !mother.isDeceased) {
            const initialP = clamp((mother.baseAge - 70) * 0.02, 0, 0.85);
            if (createSeededRng(`${gameState.runSeed}|motherInitialDeath`).nextFloat() < initialP) {
                mother.isDeceased = true;
                mother.deathYear = 0;
            }
        }
        
        if (father.baseAge >= 85 && !father.isDeceased) {
            const initialP = clamp((father.baseAge - 70) * 0.02, 0, 0.85);
            if (createSeededRng(`${gameState.runSeed}|fatherInitialDeath`).nextFloat() < initialP) {
                father.isDeceased = true;
                father.deathYear = 0;
            }
        }

        const relationships = gameState.relationships || { roster: [], byId: {} };
        const newById = { ...relationships.byId, mother, father };
        const newRoster = [...relationships.roster];
        if (!relationships.byId.mother) newRoster.push(mother);
        if (!relationships.byId.father) newRoster.push(father);
        
        return { ...gameState, relationships: { ...relationships, byId: newById, roster: newRoster } };
    };

    // Allow callers (Quick Start / Special Starts) to reliably override these without relying on async setState
        const finalHouseholdType = mergedOverrides.householdType || selectedHouseholdType;

    const finalParentRole = mergedOverrides.parentRole || selectedParentRole;
    
    // Partner data from overrides or React state
    const effectivePartnerData = mergedOverrides?.partnerData || partnerData;

    // Build legacy config if in legacy mode
    const legacyConfig = isLegacy ? {
      mode: "legacy",
      legacyParentName: legacyParentName,
      parentRole: selectedParentRole,
      householdType: selectedHouseholdType,
      incomeTier: selectedIncomeTier,
      startingMoney: legacyMoney,
      // Legacy inheritance: carry over assets from the previous run.
      // These are applied inside getDefaultState() when the new run is created.
      inheritedInventory: gameState?.inventory || null,
      inheritedRealEstate: gameState?.realEstate || null
    } : null;

    // Career config from job system
    const finalCareerConfig = careerConfig ? {
      educationLevelId: careerConfig.educationLevelId,
      educationFieldId: careerConfig.educationFieldId,
      ageAtBirth: careerConfig.ageAtBirth,
      jobId: careerConfig.jobId,
      yearlyIncome: careerConfig.yearlyIncome,
      startMoney: careerConfig.startMoney
    } : null;

    // If the active slot already has a started family, try to auto-pick an empty slot
    // so starting a new family doesn't overwrite an existing run.
    try {
      const slots = listSlots();
      const activeId = getActiveSlotId();
      const activeMeta = slots.find(s => s.slotId === activeId);
      const activeHasSave = activeMeta?.exists && activeMeta?.started;

      if (activeHasSave) {
        const userExplicitlyChoseThisSlot = explicitNewSlotId && explicitNewSlotId === activeId;

        if (userExplicitlyChoseThisSlot) {
          const yes = await confirm({
            title: 'Start new family?',
            description: `This will overwrite "${activeMeta?.label || activeId}":\n${activeMeta?.childName || 'Family'} (Age ${activeMeta?.currentYear ?? 0})\n\nThis cannot be undone.`,
            confirmText: 'Overwrite',
            destructive: true
          });
          if (!yes) {
            setSaveLoadOpen(true);
            return;
          }
        } else {
          const empty = slots.find(s => !s.exists);
          if (empty) {
            const switched = typeof setActiveSaveSlot === 'function' ? setActiveSaveSlot(empty.slotId) : false;
            if (switched) {
              refreshSaveSlots();
            }
          } else {
            const yes = await confirm({
              title: 'All save slots full',
              description: `Starting a new family will overwrite your active slot:\n"${activeMeta?.label || activeId}"\n\nContinue?`,
              confirmText: 'Overwrite',
              destructive: true
            });
            if (!yes) {
              setSaveLoadOpen(true);
              return;
            }
          }
        }
      }

      // If the player picked a slot explicitly, consume that intent once we start.
      if (explicitNewSlotId) {
        setExplicitNewSlotId(null);
      }
    } catch (e) {
      console.error('Save slot selection failed:', e);
    }
    
    // Use derived incomeTier from job system if available
    const finalIncomeTier = careerConfig?.incomeTier || selectedIncomeTier;
    
    // Country Config
    const normalizeIso3List = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((c) => (typeof c === 'string' ? c : c?.iso3))
        .filter(Boolean);
    };

    let finalCountryConfig = countryConfig
      ? {
          ...countryConfig,
          selectedCountryIso3: countryConfig.selectedCountryIso3 || selectedCountryIso3,
          availableCountryIso3s: normalizeIso3List(countryConfig.availableCountryIso3s),
          seed: countryConfig.seed ?? countrySeed,
        }
      : {
          selectedCountryIso3: selectedCountryIso3,
          availableCountryIso3s: normalizeIso3List(availableCountryIso3s),
          seed: countrySeed,
        };

    if (overrides?.countryIso3) {
      finalCountryConfig = {
        ...finalCountryConfig,
        selectedCountryIso3: overrides.countryIso3,
        availableCountryIso3s: normalizeIso3List([overrides.countryIso3]),
      };
    }

    // Now that finalCountryConfig exists, compute cultures, gender, name, and child avatar indices
    const gender = overrides.gender || selectedGender || 'boy';
    const childGenderKey = (gender === 'girl') ? 'female' : 'male';
    const effectiveCultures =
      (Array.isArray(overrides.playerCultures) && overrides.playerCultures.length)
        ? overrides.playerCultures
        : (Array.isArray(selectedCulturalRoots) && selectedCulturalRoots.length)
          ? selectedCulturalRoots
          : inferCulturesFromCountryIso3(finalCountryConfig?.selectedCountryIso3 || selectedCountryIso3 || 'USA');

    const autoChildName = pickCulturalFirstName({
      cultures: effectiveCultures,
      gender: childGenderKey,
      seed: `${runSeedForThisStart}|child|${finalCountryConfig?.selectedCountryIso3}|${childGenderKey}`
    });

    const initialKid0 = Array.isArray(overrides?.initialKidNames) && overrides.initialKidNames.length ? String(overrides.initialKidNames[0]).trim() : '';
    const typedName = String(childName || '').trim();
    const isUserChildName = !!typedName;
    const isOverrideChildName = !!(overrides.childName && String(overrides.childName).trim());
    const name = isUserChildName ? typedName
              : isOverrideChildName ? String(overrides.childName).trim()
              : (initialKid0 || autoChildName || 'Alex');
    const tone = Number.isFinite(Number(overrides.toneIndex)) ? Number(overrides.toneIndex) : (selectedToneIndex ?? 2);

    const childSpriteIndexRaw = Number.isFinite(Number(overrides.childAvatarSpriteIndex))
      ? Number(overrides.childAvatarSpriteIndex)
      : (selectedChildAvatarIndex ?? (Number(tone) % 4));
    const childSpriteIndex = Math.max(0, Math.min(15, Number(childSpriteIndexRaw)));


    // Pass overrides through so resetGame can apply things like stats/money/countryRole when needed
    const ok = resetGame(name, null, finalHouseholdType, finalIncomeTier, finalParentRole, legacyConfig, finalCareerConfig, finalCountryConfig, { ...mergedOverrides, runSeed: runSeedForThisStart });
    if (!ok) {
      // Reset failed; resetGame already restored autosave and showed toast.
      // Do NOT continue initialization.
      setSaveLoadOpen(true);
      return;
    }
    
    // --- Initialize Relationships roster so the Relationships button works ---
    const startWithoutChild = mergedOverrides?.startWithoutChild === true;

    const roster = [];
    const byId = {};

    if (!startWithoutChild) {
      const childRel = {
        id: 'child',
        role: 'child',
        name: name,
        emoji: getAvatarEmojiForAge(gender, 0, tone),
        avatarSpriteIndex: childSpriteIndex,
        avatarGenderKey: (gender === 'girl' ? 'female' : 'male'),
        createdAtAge: 0,
        meter: 50,
        interactionsByAge: {}
      };
      roster.push(childRel);
      byId.child = childRel;
    }

    // Safe function to add relationships
    const addRel = (rel) => {
      if (!rel?.id) return;
      if (byId[rel.id]) return;
      roster.push(rel);
      byId[rel.id] = rel;
    };

    // --- Spawn Parents (Mom & Dad) with cultural names + seed relationships ---
    const playerAgeAtBirth = Number(finalCareerConfig?.ageAtBirth ?? careerConfig?.ageAtBirth ?? 28);

    const cultures = (Array.isArray(overrides.playerCultures) && overrides.playerCultures.length)
      ? overrides.playerCultures
      : (Array.isArray(selectedCulturalRoots) ? selectedCulturalRoots : []);

    const iso3ForSeed = finalCountryConfig?.selectedCountryIso3 || selectedCountryIso3 || 'USA';
    const seedBase = `${runSeedForThisStart}|${name}|${iso3ForSeed}|${playerAgeAtBirth}`;
    
    // Import withChaosLevel for expansions handling
    const { withChaosLevel: withChaosLevelUtil } = await import('@/components/game/chaosModeLevels').catch(() => ({ withChaosLevel: null }));
    
    // Track used names to prevent collisions
    const usedNames = new Set([name]);
    
    // Assign per-person cultures (not shared)
    const playerCulturesFull = effectiveCultures;
    const momCultures = playerCulturesFull.length >= 1 ? [playerCulturesFull[0]] : inferCulturesFromCountryIso3(iso3ForSeed);
    const dadCultures = playerCulturesFull.length >= 2 ? [playerCulturesFull[1]] : momCultures;

    const spawnParent = (role, cultures) => {
      const isMom = role === 'my_mom';
      const genderKey = isMom ? 'female' : 'male';
      const parentAgeNow = playerAgeAtBirth || 28;
      const rng = createSeededRng(`${seedBase}|${role}|age`);
      const ageWhenTheyHadYou = Math.floor(rng.nextFloat() * 15) + 18; // 18..32
      const baseAge = parentAgeNow + ageWhenTheyHadYou;

      const pDead = 1 / (1 + Math.exp(-(baseAge - 88) / 6));
      const alive = rng.nextFloat() > pDead;

      const pickedName = pickCulturalFirstName({
        cultures,
        gender: genderKey,
        seed: `${seedBase}|${role}|name`,
        avoidNames: Array.from(usedNames)
      });
      
      usedNames.add(pickedName);

      return {
        id: role,
        role,
        name: pickedName,
        emoji: isMom ? '👩' : '👨',
        baseAge,
        alive,
        createdAtAge: 0,
        meter: 70,
        interactionsByAge: {},
      };
    };

    addRel(spawnParent('my_mom', momCultures));
    addRel(spawnParent('my_dad', dadCultures));

    // Apply relationship name overrides (for Famous starts, etc.)
    if (overrides.relationshipNameOverrides && typeof overrides.relationshipNameOverrides === 'object') {
      Object.entries(overrides.relationshipNameOverrides).forEach(([relId, newName]) => {
        if (byId[relId] && typeof newName === 'string') {
          byId[relId].name = String(newName).trim();
        }
      });
    }

    // Apply relationship additions (for Famous starts, etc.)
    if (Array.isArray(overrides.relationshipAdditions)) {
      overrides.relationshipAdditions.forEach(rel => {
        if (rel && typeof rel === 'object') {
          addRel({
            id: rel.id,
            role: rel.role || 'other',
            name: rel.name || 'Unknown',
            emoji: rel.emoji || '🙂',
            baseAge: rel.baseAge ?? 30,
            meter: Number.isFinite(rel.meter) ? rel.meter : 60,
            alive: rel.alive !== false,
            createdAtAge: 0,
            interactionsByAge: {}
          });
        }
      });
    }

    // Apply relationship life overrides (alive/deceased)
    if (overrides.relationshipLifeOverrides && typeof overrides.relationshipLifeOverrides === 'object') {
      Object.entries(overrides.relationshipLifeOverrides).forEach(([relId, aliveBool]) => {
        if (byId[relId]) {
          byId[relId].alive = !!aliveBool;
          byId[relId].isDeceased = !aliveBool;
          if (!aliveBool) byId[relId].deathYear = 0;
        }
      });
    }

    if (!startWithoutChild && finalHouseholdType === 'single') {
        const rng = createSeededRng(`${seedBase}|otherParent`);
        const roll = rng.nextFloat();
        let originType, identityStatus, otherParentName = 'Unknown', isDeceased = false;
        let baseAge = (playerAgeAtBirth || 28) + Math.floor(rng.nextFloat() * 17) - 6;

        // Force known_ex for divorce_coparenting start
        const isDivorceCoparentingStart = mergedOverrides?.specialStartId === 'divorce_coparenting';
        if (isDivorceCoparentingStart) {
          originType = 'known_ex';
          identityStatus = 'known';
          isDeceased = false;
        } else {
          if (roll < 0.30) {
              originType = 'sperm_donor';
              identityStatus = 'sealed_until_18';
          } else if (roll < 0.75) {
              originType = 'one_night_stand';
              identityStatus = 'unknown';
          } else if (roll < 0.90) {
              originType = 'known_ex';
              identityStatus = 'known';
          } else {
              originType = 'deceased';
              identityStatus = 'known';
              isDeceased = true;
          }
        }

        const otherParentRole = finalParentRole === 'mom' ? 'father_of_child' : 'mother_of_child';
        const otherParentGender = finalParentRole === 'mom' ? 'male' : 'female';
        
        // Determine other parent cultures (can differ from player)
        const otherParentCultures = (() => {
          const rng2 = createSeededRng(`${seedBase}|otherParentCulture`);
          if (rng2.nextFloat() < 0.4 && CULTURE_IDS.length > 1) {
            // 40% chance: pick a different culture
            const otherCultures = CULTURE_IDS.filter(c => !playerCulturesFull.includes(c));
            return otherCultures.length > 0 ? [rng2.pick(otherCultures)] : momCultures;
          }
          return momCultures;
        })();
        
        if (identityStatus === 'known') {
            otherParentName = pickCulturalFirstName({ cultures: otherParentCultures, gender: otherParentGender, seed: `${seedBase}|otherParentName`, avoidNames: Array.from(usedNames) });
            usedNames.add(otherParentName);
        } else {
            // Unknown identity - use friendly label
            otherParentName = otherParentRole === 'mother_of_child' ? 'Unknown Mother' : 'Unknown Father';
        }

        addRel({
            id: otherParentRole,
            role: otherParentRole,
            name: otherParentName,
            emoji: identityStatus === 'known' ? (otherParentGender === 'female' ? '👩' : '👨') : '❓',
            genderKey: otherParentGender,
            avatarGenderKey: otherParentGender,
            baseAge: baseAge,
            isDeceased: isDeceased,
            deathYear: isDeceased ? 0 : null,
            lastMournedYear: null,
            mortalityMultiplier: 0.85 + rng.nextFloat() * 0.3,
            originType: originType,
            identityStatus: identityStatus,
            lastInvestigatedYear: null,
            createdAtAge: 0,
            meter: 50,
            cultures: Array.isArray(otherParentCultures) ? otherParentCultures : [],
        });
    }

    // Partner defaults: precompute only (do NOT touch updates here)
    let autoPartnerName = null;
    let autoPartnerEmoji = null;
    let autoPartnerMeter = null;
    let partnerCultures = playerCulturesFull;

    if (finalHouseholdType === 'two' && !effectivePartnerData) {
      const partnerGender =
        finalParentRole === 'mom' ? 'male' :
        finalParentRole === 'dad' ? 'female' :
        'neutral';
      
      // Partner can have different cultures (40% chance)
      if (overrides.partnerCultures && Array.isArray(overrides.partnerCultures)) {
        partnerCultures = overrides.partnerCultures;
      } else {
        const rng = createSeededRng(`${seedBase}|partnerCulture`);
        if (rng.nextFloat() < 0.4 && CULTURE_IDS.length > 1) {
          // Pick a different culture
          const otherCultures = CULTURE_IDS.filter(c => !playerCulturesFull.includes(c));
          partnerCultures = otherCultures.length > 0 ? [rng.pick(otherCultures)] : playerCulturesFull;
        }
      }

      autoPartnerName = pickCulturalFirstName({
        cultures: partnerCultures,
        gender: partnerGender,
        seed: `${seedBase}|partner|name`,
        avoidNames: Array.from(usedNames)
      });
      usedNames.add(autoPartnerName);
      autoPartnerEmoji = pickGenderEmoji(partnerGender);
      autoPartnerMeter = 80;
    }

    // Player's best friend (same gender as player, same age)
    const playerGender =
      finalParentRole === 'mom' ? 'female' :
      finalParentRole === 'dad' ? 'male' :
      'neutral';

    addRel({
      id: 'my_best_friend',
      role: 'my_best_friend',
      name: pickCulturalFirstName({
        cultures,
        gender: playerGender,
        seed: `${seedBase}|my_best_friend|name`
      }),
      emoji: pickGenderEmoji(playerGender),
      baseAge: playerAgeAtBirth || 28,
      alive: true,
      createdAtAge: 0,
      meter: 65,
      interactionsByAge: {},
    });

    // Teacher + child best friend (not met until age 6)
    // GUARD: Do NOT add child-only NPCs in Before Baby mode

    if (!startWithoutChild) {
      addRel({
        id: 'teacher',
        role: 'teacher',
        name: pickCulturalFirstName({
          cultures,
          gender: 'neutral',
          seed: `${seedBase}|teacher|name`
        }),
        emoji: '🧑‍🏫',
        baseAge: 30,
        alive: true,
        createdAtAge: 6,
        meter: 50,
        interactionsByAge: {},
      });

      addRel({
        id: 'best_friend',
        role: 'best_friend',
        name: pickCulturalFirstName({
          cultures,
          gender: childGenderKey,
          seed: `${seedBase}|child_best_friend|name`
        }),
        emoji: '🧒',
        baseAge: 0,
        alive: true,
        createdAtAge: 6,
        meter: 55,
        interactionsByAge: {},
      });
    }

    const updates = {
      childAvatarGender: gender, 
      childAvatarSpriteIndex: childSpriteIndex,
      childAvatarToneIndex: childSpriteIndex % 4, 
      childAvatarPicked: true,
      childTemperamentId: temperamentId,
      childInterestId: 'none',
      playerCultures: cultures
    };
    
    // Parent name/avatar — never allow literal "Parent" when not legacy
    const rawParentName = isLegacy
      ? (legacyConfig?.legacyParentName || "Parent")
      : String(overrides.parentName ?? parentName ?? '').trim();

    // Guard: never leave the literal placeholder as the name (especially Quick Start)
    let finalParentName = rawParentName || "Parent";
    if (!isLegacy) {
      const lower = String(finalParentName || '').trim().toLowerCase();
      if (!finalParentName || lower === 'parent') {
        const playerGenderKey =
          finalParentRole === 'dad' ? 'male' :
          finalParentRole === 'mom' ? 'female' :
          'neutral';

        finalParentName = pickCulturalFirstName({
          cultures: playerCulturesFull,
          gender: playerGenderKey,
          seed: `${seedBase}|player|name`,
          avoidNames: Array.from(usedNames)
        }) || 'Player';
        usedNames.add(finalParentName);
      }
    }

    const parentAvatar = finalParentRole === 'dad' ? '👨' : finalParentRole === 'mom' ? '👩' : '🧑';

    updates.parentName = finalParentName;
    updates.parentAvatar = parentAvatar;
    // Compute and store player sprite index (4x3 grid; valid 0..11) and gender
    {
      const toneCol = Number.isFinite(Number(tone)) ? (Number(tone) % 4) : 0;
      const defaultIndex = toneCol; // first row
      const pickedIndex = (Number.isInteger(Number(selectedParentAvatarIndex)) && Number(selectedParentAvatarIndex) >= 0 && Number(selectedParentAvatarIndex) <= 15)
        ? Number(selectedParentAvatarIndex)
        : defaultIndex;
      updates.parentAvatarSpriteIndex = Number.isInteger(Number(overrides?.parentAvatarSpriteIndex)) ? Number(overrides.parentAvatarSpriteIndex) : pickedIndex;
      updates.parentAvatarGender = overrides?.parentAvatarGender || ((finalParentRole === 'mom') ? 'female' : 'male');
    }
    updates.parent = {
      role: finalParentRole,
      name: finalParentName
    };

    // Partner sprite avatar: gender + index (0..11), culture-tinted by tone column
    {
      const partnerAvatarGender = finalParentRole === 'dad' ? 'female' : (finalParentRole === 'mom' ? 'male' : (Math.random() > 0.5 ? 'male' : 'female'));
      updates.partnerAvatarGender = partnerAvatarGender;

      const cultureToneIndex = Number((selectedToneIndex ?? tone ?? 0));
      const toneCol = ((cultureToneIndex % 4) + 4) % 4;
      const candidateIndices = [toneCol, toneCol + 4, toneCol + 8, toneCol + 12];
      let partnerIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
      const parentIndex = Number(updates.parentAvatarSpriteIndex);
      if (Number.isFinite(parentIndex) && partnerIndex === parentIndex) {
        const i = candidateIndices.indexOf(partnerIndex);
        partnerIndex = candidateIndices[(i + 1) % candidateIndices.length];
      }
      // Keep as default; may be overridden later if partnerData provided
      updates.partnerAvatarSpriteIndex = partnerIndex;
    }

    // Apply overrides partner name if present (e.g., Famous starts)
    if (overrides.partnerName) {
      updates.partnerName = String(overrides.partnerName).trim();
    }

    // Apply auto-generated partner defaults (only if two-parent household and no custom partnerData)
    if (finalHouseholdType === 'two' && !effectivePartnerData) {
     if (!updates.partnerName && autoPartnerName) updates.partnerName = autoPartnerName;
     if (autoPartnerEmoji) updates.partnerEmoji = autoPartnerEmoji;
     if (Number.isFinite(Number(autoPartnerMeter))) updates.partnerMeter = autoPartnerMeter;
    }

    // Add partner data if partnered
    if (finalHouseholdType === 'two') {
      // Determine and persist partner age at birth (18..75)
      const clampInt = (v, min, max, fallback) => {
        const n = Math.round(Number(v));
        if (!Number.isFinite(n)) return fallback;
        return Math.max(min, Math.min(max, n));
      };
      const partnerAgeAtBirth = clampInt(effectivePartnerData?.age ?? overrides?.partnerAgeAtBirth ?? updates.partnerAgeAtBirth ?? careerConfig?.ageAtBirth ?? 28, 18, 75, 28);
      updates.partnerAgeAtBirth = partnerAgeAtBirth;

      if (effectivePartnerData) {
        updates.partnerName = effectivePartnerData.name;
        updates.partnerAvatarGender = effectivePartnerData.genderKey === 'female' ? 'female' : 'male';
        if (Number.isInteger(Number(effectivePartnerData.avatarSpriteIndex))) {
          const idx = Math.max(0, Math.min(15, Number(effectivePartnerData.avatarSpriteIndex)));
          updates.partnerAvatarSpriteIndex = idx;
        }
        updates.partnerMeter = 80;
        updates.partnerEmoji = updates.partnerEmoji || pickGenderEmoji(effectivePartnerData.genderKey === 'female' ? 'female' : 'male');
      }

      // Starting with a partner means you start married (your design)
      updates.partnerRelationship = {
        status: 'married',
        marriedAtAge: 0,
        engagedAtAge: null,
        ring: null,
        wedding: { id: 'start', label: 'Already married', cost: 0, emoji: '💒' },
        // Relationship drama extensions
        openRelationship: { active: false, askedAtAge: null, openedAtAge: null, closedAtAge: null },
        crisis: null
      };

      const partnerRel = {
        id: 'partner',
        role: 'partner',
        name: updates.partnerName || 'Partner',
        emoji: updates.partnerEmoji || '🧑',
        createdAtAge: 0,
        baseAge: updates.partnerAgeAtBirth,
        age: Number.isFinite(Number(updates.partnerAgeAtBirth)) ? Number(updates.partnerAgeAtBirth) : 28,
        meter: Number.isFinite(Number(updates.partnerMeter)) ? Number(updates.partnerMeter) : 80,
        interactionsByAge: {},
        cultures: Array.isArray(partnerCultures) && partnerCultures.length ? partnerCultures : playerCulturesFull,
      };

      roster.push(partnerRel);
      byId.partner = partnerRel;
      
      // Generate Partner Career (honor forced SAHP via overrides.partnerJobId)
                            const forcedPartnerJobId = overrides?.partnerJobId || null;
                            let partnerCareer;
                            if (forcedPartnerJobId) {
                              const job = getJobById(forcedPartnerJobId);
                              
                              // Check if this is a hidden job and if it's allowed by scenario
                              const ss = overrides?.specialStartId || null;
                              const ALLOW_HIDDEN_BY_START = {
                                zombie_apocalypse: new Set(['survivor', 'zombie']),
                                alien_invasion: new Set(['survivor']),
                                kim_jong_un: new Set(['supreme_leader'])
                              };
                              const allowedHidden = ALLOW_HIDDEN_BY_START[ss]?.has(forcedPartnerJobId) === true;
                              const isHidden = job?.hidden === true;
                              
                              // Only allow hidden jobs if explicitly permitted
                              const shouldUseJob = !isHidden || allowedHidden;
                              
                              if (shouldUseJob) {
                                const calc = computeStartingCareer({
                                  educationLevelId: 'high_school',
                                  fieldId: null,
                                  ageAtBirth: updates.partnerAgeAtBirth || 28,
                                  jobId: forcedPartnerJobId,
                                  allowHiddenJobId: allowedHidden
                                });
                                partnerCareer = {
                                  jobId: calc.jobId,
                                  jobTitle: calc.job?.title || job?.title || 'Stay-at-home parent',
                                  yearlyIncome: Number(calc?.yearlyIncome || 0),
                                  educationLevelId: 'high_school',
                                  jobLevelIndex: 0,
                                  yearsInJob: 0,
                                  performance: 55
                                };
                              } else {
                                // Hidden job not allowed - fall back to safe default
                                const calc = computeStartingCareer({
                                  educationLevelId: 'high_school',
                                  fieldId: null,
                                  ageAtBirth: updates.partnerAgeAtBirth || 28,
                                  jobId: 'retail_associate'
                                });
                                partnerCareer = {
                                  jobId: calc.jobId,
                                  jobTitle: calc.job?.title || 'Retail Associate',
                                  yearlyIncome: Number(calc?.yearlyIncome || 0),
                                  educationLevelId: 'high_school',
                                  jobLevelIndex: 0,
                                  yearsInJob: 0,
                                  performance: 55
                                };
                              }
                            } else {
                              partnerCareer = computeRandomPartnerCareer({ 
                                seed: `${Date.now()}|${updates.partnerName || partnerData?.name || 'Partner'}|${getRunSeed()}`, 
                                ageAtBirth: updates.partnerAgeAtBirth || 28 
                              });
                            }

                            updates.partnerCareer = partnerCareer;
      
      // We'll add the timeline entry for partner career below alongside player career
    } else if (!startWithoutChild && finalHouseholdType === 'single') {
        // Check if there's already a known other parent relationship to use for coparent profile
        const otherParentRole = finalParentRole === 'mom' ? 'father_of_child' : 'mother_of_child';
        const otherParent = byId?.[otherParentRole];

        if (otherParent && otherParent.identityStatus === 'known' && otherParent.name) {
          // Use the known other parent relationship for coparent profile
          updates.coparentProfile = {
            name: otherParent.name,
            emoji: otherParent.emoji || '🧑',
            gender: String(otherParent.genderKey || otherParent.avatarGenderKey || '').toLowerCase() === 'male' ? 'boy' : 'girl',
            meter: Math.max(0, Math.min(100, Number(otherParent.meter ?? 50))),
          };
        } else {
          // Fall back to generating a random coparent profile
          const rng = createSeededRng(`${seedBase}|coparent`);
          const coparentGenderKey = rng.nextFloat() > 0.5 ? 'male' : 'female';
          const coparentEmoji = coparentGenderKey === 'male' ? '👨' : '👩';
          const coparentCultures = playerCulturesFull;
          const coparentName = pickCulturalFirstName({
            cultures: coparentCultures,
            gender: coparentGenderKey,
            seed: `${seedBase}|coparent|name`,
            avoidNames: Array.from(usedNames)
          });
          usedNames.add(coparentName);
          const coparentGender = coparentGenderKey === 'male' ? 'boy' : 'girl';
          
          updates.coparentProfile = {
              name: coparentName,
              emoji: coparentEmoji,
              gender: coparentGender,
              meter: 50 // Start neutral
          };
        }
    }
    
    // Initialize family patterns
    const severityById = {};
    const resolvedById = {};
    selectedPatternIds.forEach(id => {
      severityById[id] = DEFAULT_PATTERN_SEVERITY;
      resolvedById[id] = false;
    });
    
    updates.familyPatterns = {
      selectedIds: selectedPatternIds,
      severityById,
      resolvedById,
      resolvedAtAgeById: {},
      counselorByAge: {},
      rehabByAge: {}
    };

    updates.relationships = { roster, byId };

    // Track parent age at birth for header age display
    updates.parentAgeAtBirth = Number(finalCareerConfig?.ageAtBirth ?? careerConfig?.ageAtBirth ?? parentAgeAtBirth ?? 28);

    updateState(updates);

    // Enable Local Co-Op if requested
    try {
      if (mergedOverrides?.enableLocalCoop === true && typeof setLocalCoopEnabled === 'function') {
        setLocalCoopEnabled(true);
      }
    } catch (e) {
      console.error('Failed to enable Local Co-Op:', e);
    }

    // Seed sibling-rivalry kids at start (Special Starts can request this)
    try {
      const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
      
      const kidNames = Array.isArray(overrides?.initialKidNames)
        ? overrides.initialKidNames.map(n => String(n || '').trim()).filter(Boolean)
        : [];

      const wantsSiblingRivalry = overrides?.expansions?.siblingRivalry === true && kidNames.length > 1;

      if (wantsSiblingRivalry && typeof setSiblingRivalryEnabled === 'function' && typeof addChild === 'function') {
        // Enable expansion first (addChild is a no-op if the expansion is off)
        setSiblingRivalryEnabled(true);

        // Force primary kid name to the first seeded name for this scenario
        if (kidNames[0]) {
          updateState({ childName: kidNames[0] });
        }

        // Add the remaining kids with varied ages
        const parentAgeAtBirthVal = Number(finalCareerConfig?.ageAtBirth ?? parentAgeAtBirth ?? 28);
        const maxSiblingAge = clamp(parentAgeAtBirthVal - 18, 1, 18);
        const siblingsCount = kidNames.length - 1;

        kidNames.slice(1).forEach((n, idx) => {
          const gender = (idx % 2 === 0) ? 'boy' : 'girl';
          const toneIndex = (idx % 4);
          
          // Distribute sibling ages from maxSiblingAge down to 1
          let ageYears;
          if (siblingsCount === 1) {
            ageYears = Math.min(3, maxSiblingAge);
          } else {
            const ageSpread = maxSiblingAge - 1;
            const idealAge = maxSiblingAge - (idx * ageSpread / (siblingsCount - 1));
            ageYears = clamp(Math.round(idealAge), 1, 18);
          }
          
          addChild({ name: n, gender, toneIndex, ageYears });
        });
      }
    } catch (e) {
      console.error('Failed to seed sibling-rivalry kids at start:', e);
    }

    // Save player career if available
    if (careerConfig && careerConfig.job) {
      updates.playerCareer = {
        employed: true,
        jobId: careerConfig.job.id || 'government_assistance',
        jobTitle: careerConfig.job.title || 'On Government Assistance',
        jobLevelIndex: 0,
        yearlyIncome: Number.isFinite(Number(careerConfig.yearlyIncome)) ? careerConfig.yearlyIncome : 1000,
        educationLevelId: careerConfig.educationLevelId,
        yearsInJob: 0,
        performance: 55,
        careerRep: 50,
        networking: 0,
        burnout: 0,
        lastWorkedHardAge: -1,
        lastAskedRaiseAge: -1
      };
    }

    // Apply Famous-start (or any start) overrides safely
    if (Number.isFinite(Number(mergedOverrides?.famePoints))) {
      updates.famePoints = Math.max(0, Math.round(Number(mergedOverrides.famePoints)));
    }
    if (Number.isFinite(Number(mergedOverrides?.reputation))) {
      updates.reputation = Math.max(0, Math.min(100, Math.round(Number(mergedOverrides.reputation))));
    }
    
    // Add timeline entry for job selection (if using job system)
    setTimeout(() => {
      if (careerConfig && careerConfig.job) {
        const job = careerConfig.job;
        updateState(prev => ({
          timelineEntries: [...prev.timelineEntries, {
            id: `t_job_age_0`,
            age: 0,
            kind: 'job',
            title: `💼 Career: ${job.title}`,
            detail: `Annual budget: $${formatMoneyCompact(careerConfig.yearlyIncome)} • Starting cash: $${formatMoneyCompact(careerConfig.startMoney)} • ${job.blurb}`,
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            meta: { jobId: job.id, yearlyIncome: careerConfig.yearlyIncome }
          }]
        }));
      }
      
      // Partner career timeline entry
      if (finalHouseholdType === 'two' && updates.partnerCareer) {
        const pc = updates.partnerCareer;
        const pName = updates.partnerName || 'Partner';
        
        updateState(prev => ({
          timelineEntries: [...prev.timelineEntries, {
            id: `t_partner_job_age_0`,
            age: 0,
            kind: 'job',
            title: `💼 Partner Career: ${pc.jobTitle}`,
            detail: (pc.yearlyIncome <= 0)
              ? `${pName} stays at home to support the household. +1 Focus bonus from extra support.`
              : `${pName} works as a ${pc.jobTitle}. +$${formatMoneyCompact(pc.yearlyIncome)}/year added to household.`,

            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            meta: { jobId: pc.jobId, yearlyIncome: pc.yearlyIncome, partner: true }
          }]
        }));
      }
    }, 50);

    // Add timeline entry for family patterns
    setTimeout(() => {
      if (selectedPatternIds.length === 0) {
        updateState(prev => ({
          timelineEntries: [...prev.timelineEntries, {
            id: `t_patterns_age_0`,
            age: 0,
            kind: 'system',
            title: '🧬 Family Patterns',
            detail: 'You chose none this run.',
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            meta: null
          }]
        }));
      } else {
        const labels = selectedPatternIds.map(id => {
          const pattern = FAMILY_PATTERN_CATALOG.find(p => p.id === id);
          return pattern?.label || id;
        });

        let labelText;
        if (labels.length <= 4) {
          labelText = labels.join(', ');
        } else {
          const shown = labels.slice(0, 4).join(', ');
          const remaining = labels.length - 4;
          labelText = `${shown} ... and ${remaining} more`;
        }

        updateState(prev => ({
          timelineEntries: [...prev.timelineEntries, {
            id: `t_patterns_age_0`,
            age: 0,
            kind: 'system',
            title: '🧬 Family Patterns',
            detail: `You chose to be mindful of: ${labelText}.`,
            deltas: null,
            moneyDelta: 0,
            loveDelta: 0,
            stressDelta: 0,
            meta: { selectedPatternIds }
          }]
        }));
      }
    }, 100);
    
    navigate(createPageUrl('Game'));
  };

  const handleBackToName = () => {
    setStartStep('name');
  };

  const handleBackToAvatar = () => {
    if (startWithoutChildMode) {
      setStartStep('intro');
    } else {
      setStartStep('avatar');
    }
  };

  const handleBackToRole = () => {
    setStartStep('role');
  };

  const handleBackToParentName = () => {
    setStartStep('parentName');
  };

  const handleBackToTemperament = () => {
    setStartStep('temperament');
  };

  const handleBackToHousehold = () => {
    setStartStep('household');
  };

  const handleBackToCountry = () => {
    setStartStep('country');
  };

  const handleBackToIncome = () => {
    setStartStep('income');
  };

  const handleBackToEducation = () => {
    setStartStep('culturalRoots'); 
  };

  const handleBackToCulturalRoots = () => {
    setStartStep('country');
  };

  const handleBackToField = () => {
    setStartStep('field');
  };

  const handleBackToParentAge = () => {
    setStartStep('parentAge');
  };

  const handleBackToJob = () => {
    setStartStep('job');
  };

  // Local Multiplayer Quick Start (extracted from old button)
  const startLocalMultiplayerQuickStart = () => {
    const randomSeed = Date.now();
    const randomCountries = pickTenCountries();
    const randomCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];
    const randomGender = Math.random() > 0.5 ? 'boy' : 'girl';
    const randomParentAge = Math.floor(Math.random() * (45 - 18 + 1)) + 18;

    const cultureByIso3 = {
      USA: ['AMERICAN_US'],
      NOR: ['OTHER_CUSTOM'],
      HTI: ['CARIBBEAN'],
      IDN: ['INDONESIAN'],
      JPN: ['JAPANESE'],
      AUS: ['AUS_NZ'],
      DEU: ['GERMAN'],
      BRA: ['BRAZILIAN'],
      IND: ['INDIAN'],
      ZAF: ['SOUTH_AFRICAN'],
      MEX: ['MEXICAN'],
      GBR: ['BRITISH_IRISH'],
      FRA: ['FRENCH'],
      SGP: ['CHINESE'],
    };
    const cultures = cultureByIso3[randomCountry.iso3] || ['AMERICAN_US'];

    const namePool = COUNTRY_NAMES[randomCountry.iso3]?.[randomGender] || [];
    const randomChildName = namePool.length
      ? namePool[Math.floor(Math.random() * namePool.length)]
      : pickCulturalFirstName({
          cultures,
          gender: randomGender === 'girl' ? 'female' : 'male',
          seed: `${randomSeed}|child|${randomCountry.iso3}`
        });

    const eligibleJobs = getEligibleJobs('college', 'business');
    const defaultJobId = eligibleJobs[0]?.id || 'business_analyst';
    const careerConfig = computeStartingCareer({
      educationLevelId: 'college',
      fieldId: 'business',
      ageAtBirth: randomParentAge,
      jobId: defaultJobId
    });

    const shuffledPatterns = [...FAMILY_PATTERN_CATALOG].sort(() => 0.5 - Math.random());
    const randomPatternIds = shuffledPatterns.slice(0, 3).map(p => p.id);

    const faithRng = createSeededRng(`${randomSeed}|${randomCountry.iso3}|faith`);
    const pickedFaith = pickQuickStartFaith({ iso3: randomCountry.iso3, rng: faithRng });

    const faithOverride = pickedFaith ? {
      tradition: pickedFaith.tradition,
      isCustom: false,
      status: 'questioning',
      exposure: Math.floor(faithRng.nextFloat() * 16) + 10,
      devotion: Math.floor(faithRng.nextFloat() * 16) + 10,
      lastDecisionAge: null,
      history: []
    } : undefined;

    startGameWithConfig('balanced', randomPatternIds, careerConfig, { 
      selectedCountryIso3: randomCountry.iso3, 
      availableCountryIso3s: randomCountries,
      seed: randomSeed
    }, {
      source: 'multiplayer_quickstart',
      childName: randomChildName,
      gender: randomGender,
      parentRole: 'dad',
      householdType: 'two',
      toneIndex: 2,
      playerCultures: cultures,
      countryIso3: randomCountry.iso3,
      enableLocalCoop: true,
      guidanceEnabled: false,
      hasEverStartedGame: true,
      faith: faithOverride
    });

    setMpMenuOpen(false);
  };

  // Local Multiplayer Custom Characters
  const startLocalMultiplayerCustom = (config) => {
    const randomSeed = Date.now();
    const randomCountries = pickTenCountries();
    const randomCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];
    const randomParentAge = Math.floor(Math.random() * (45 - 18 + 1)) + 18;

    const cultures = inferCulturesFromCountryIso3(randomCountry.iso3);

    // Determine which parent is player based on starterRole
    const starterRole = config.starterRole || 'dad';
    let parentRole, parentName, parentAvatarGender, parentAvatarSpriteIndex, parentAgeAtBirth;
    let partnerDataToUse;

    if (starterRole === 'dad') {
      parentRole = 'dad';
      parentName = config.dad.name || 'Dad';
      parentAvatarGender = config.dad.genderKey || 'male';
      parentAvatarSpriteIndex = config.dad.avatarSpriteIndex || 0;
      parentAgeAtBirth = config.dad.ageAtBirth || 30;
      partnerDataToUse = {
        name: config.mom.name || 'Mom',
        age: config.mom.ageAtBirth || 28,
        genderKey: config.mom.genderKey || 'female',
        avatarSpriteIndex: config.mom.avatarSpriteIndex || 1
      };
    } else {
      parentRole = 'mom';
      parentName = config.mom.name || 'Mom';
      parentAvatarGender = config.mom.genderKey || 'female';
      parentAvatarSpriteIndex = config.mom.avatarSpriteIndex || 1;
      parentAgeAtBirth = config.mom.ageAtBirth || 28;
      partnerDataToUse = {
        name: config.dad.name || 'Dad',
        age: config.dad.ageAtBirth || 28,
        genderKey: config.dad.genderKey || 'male',
        avatarSpriteIndex: config.dad.avatarSpriteIndex || 0
      };
    }

    const eligibleJobs = getEligibleJobs('college', 'business');
    const defaultJobId = eligibleJobs[0]?.id || 'business_analyst';
    const careerConfig = computeStartingCareer({
      educationLevelId: 'college',
      fieldId: 'business',
      ageAtBirth: parentAgeAtBirth,
      jobId: defaultJobId
    });

    const shuffledPatterns = [...FAMILY_PATTERN_CATALOG].sort(() => 0.5 - Math.random());
    const randomPatternIds = shuffledPatterns.slice(0, 3).map(p => p.id);

    const faithRng = createSeededRng(`${randomSeed}|${randomCountry.iso3}|faith`);
    const pickedFaith = pickQuickStartFaith({ iso3: randomCountry.iso3, rng: faithRng });

    const faithOverride = pickedFaith ? {
      tradition: pickedFaith.tradition,
      isCustom: false,
      status: 'questioning',
      exposure: Math.floor(faithRng.nextFloat() * 16) + 10,
      devotion: Math.floor(faithRng.nextFloat() * 16) + 10,
      lastDecisionAge: null,
      history: []
    } : undefined;

    startGameWithConfig('balanced', randomPatternIds, careerConfig, { 
      selectedCountryIso3: randomCountry.iso3, 
      availableCountryIso3s: randomCountries,
      seed: randomSeed
    }, {
      source: 'multiplayer_custom',
      childName: config.child.name || 'Child',
      gender: config.child.gender || 'boy',
      parentName,
      parentRole,
      parentAvatarGender,
      parentAvatarSpriteIndex,
      ageAtBirth: parentAgeAtBirth,
      partnerData: partnerDataToUse,
      householdType: 'two',
      toneIndex: 2,
      playerCultures: cultures,
      countryIso3: randomCountry.iso3,
      enableLocalCoop: true,
      guidanceEnabled: false,
      hasEverStartedGame: true,
      faith: faithOverride
    });

    setMpCustomizeOpen(false);
    setMpMenuOpen(false);
  };

  const confirmPopStarAndStart = () => {
    if (!pendingPopStarScenario) return;

    const tier = POP_STAR_FAME_TIERS.find(t => t.id === popStarFameTier) || POP_STAR_FAME_TIERS[1];

    const cleanName = String(popStarName || "").trim() || "Pop Star";
    const cleanChild = String(popStarChildName || "").trim();
    const cleanPartner = String(popStarPartnerName || "").trim();
    const cleanBio = String(popStarBioParentName || "").trim();

    const householdType = (popStarHousehold === "single") ? "single" : "two";

    const cleanAge = Math.max(18, Math.min(60, Math.round(Number(popStarAgeAtBirth || 28))));

    const relNameOverrides = {};
    if (String(popStarMomName || "").trim()) relNameOverrides.my_mom = String(popStarMomName).trim();
    if (String(popStarDadName || "").trim()) relNameOverrides.my_dad = String(popStarDadName).trim();

    const relLifeOverrides = {
      my_mom: !!popStarMomAlive,
      my_dad: !!popStarDadAlive
    };

    const relAdds = [];
    if (cleanBio && householdType === "single") {
      relAdds.push({ id: "child_bio_parent", role: "bio_parent", name: cleanBio, emoji: "🧬", meter: 45, alive: true });
    }
    if (cleanBio && householdType === "two" && cleanPartner && cleanBio.toLowerCase() !== cleanPartner.toLowerCase()) {
      relAdds.push({ id: "child_bio_parent", role: "bio_parent", name: cleanBio, emoji: "🧬", meter: 40, alive: true });
    }

    const extraOverrides = {
      specialStartId: "famous_pop_star",
      parentRole: popStarRole,
      householdType,
      parentName: cleanName,
      childName: cleanChild || undefined,
      parentJobId: "musician",
      incomeTier: "wealthy",
      startMoney: tier.startMoney,
      yearlyIncome: tier.yearlyIncome,
      famePoints: tier.famePoints,
      reputation: tier.reputation,
      ageAtBirth: cleanAge,
      relationshipNameOverrides: relNameOverrides,
      relationshipLifeOverrides: relLifeOverrides,
      relationshipAdditions: relAdds
    };

    // DEV: Debug check for Pop Star money initialization
    if (import.meta?.env?.DEV) {
      const expectedMoney = tier.startMoney;
      if (!Number.isFinite(expectedMoney) || expectedMoney < 100000) {
        console.warn('[DEV] Pop Star startMoney unexpectedly low:', { 
          tier: tier.id, 
          expectedMoney, 
          extraOverrides 
        });
      }
    }

    if (householdType === "two") {
      const cleanPartnerAge = Math.max(18, Math.min(75, Math.round(Number(popStarPartnerAgeAtBirth || (cleanAge + 1)))));
      extraOverrides.partnerName = cleanPartner || "Partner";
      extraOverrides.partnerGender = popStarPartnerGender;
      extraOverrides.partnerJobId = "stay_at_home_parent";
      extraOverrides.partnerAgeAtBirth = cleanPartnerAge;
    }

    // Store pending data and open family patterns modal
    const randomSeed = Date.now();
    const randomCountries = pickTenCountries();
    const countryIso3 = extraOverrides.countryIso3 || randomCountries[0].iso3;

    const jobId = extraOverrides.parentJobId || 'musician';
    const startMoney = extraOverrides.startMoney || tier.startMoney;
    const job = getJobById(jobId);
    const ageAtBirth = extraOverrides.ageAtBirth || cleanAge;

    const computedStart = computeStartingCareer({ jobId, ageAtBirth });
    const yearlyIncome = Number.isFinite(Number(extraOverrides.yearlyIncome))
      ? Number(extraOverrides.yearlyIncome)
      : tier.yearlyIncome;

    const careerConfig = {
      educationLevelId: 'high_school',
      educationFieldId: null,
      ageAtBirth,
      jobId,
      job,
      yearlyIncome,
      startMoney,
      incomeTier: extraOverrides.incomeTier || 'wealthy'
    };

    setPendingSpecialStart({
      scenario: pendingPopStarScenario,
      overrides: extraOverrides,
      careerConfig,
      countryConfig: { selectedCountryIso3: countryIso3, availableCountryIso3s: randomCountries, seed: randomSeed }
    });

    setPopStarCreatorOpen(false);
    setPendingPopStarScenario(null);
    setFamilyPatternsModalOpen(true);
  };

  const launchSpecialStart = (scenario, extraOverrides = {}) => {
    const overrides = { ...(scenario.overrides || {}), ...extraOverrides };
    
    if (scenario.id === 'mafia_family') {
      overrides.partnerJobId = 'stay_at_home_parent';
      overrides.householdType = overrides.householdType || 'two';
    }
    if (scenario.id === 'military_relocation_cycle') {
      overrides.partnerJobId = 'stay_at_home_parent';
      overrides.householdType = 'two';
    }
    const randomSeed = Date.now();
    const randomCountries = pickTenCountries();
    const gender = (scenario.id === 'frida_eric') ? 'boy' : (overrides.gender || (Math.random() > 0.5 ? 'boy' : 'girl'));
    const name = overrides.childName || '';

    const jobId = overrides.parentJobId || 'retail_associate';
    const startMoney = overrides.startMoney || 2000;
    const job = getJobById(jobId);
    const ageAtBirth = overrides.ageAtBirth || ((scenario.id === 'frida_eric') ? 38 : 28);
    const educationLevelId = overrides.educationLevelId || job?.minEducation || 'high_school';
    
    const computedStart = computeStartingCareer({ educationLevelId, jobId, ageAtBirth, allowHiddenJobId: true });
    const yearlyIncome = Number.isFinite(Number(overrides.yearlyIncome))
      ? Number(overrides.yearlyIncome)
      : computedStart.yearlyIncome;
    
    const careerConfig = {
      educationLevelId,
      educationFieldId: null,
      ageAtBirth,
      jobId,
      job,
      yearlyIncome,
      startMoney,
      incomeTier: overrides.incomeTier || 'medium'
    };

    const countryIso3 = overrides.countryIso3 || randomCountries[0].iso3;

    const inferred = inferCulturesFromCountryIso3(countryIso3);
    const chosenRoots = (Array.isArray(selectedCulturalRoots) && selectedCulturalRoots.length) ? selectedCulturalRoots : inferred;

    const gameOverrides = {
      ...overrides,
      childName: name,
      gender,
      money: startMoney,
      stats: overrides.stats,
      countryIso3,
      playerCultures: chosenRoots,
      specialStartId: scenario.id,
      specialStartTitle: scenario.title,
      specialStartCategory: scenario.category,
      ...(scenario.id === 'frida_eric' ? { parentAvatarGender: 'female', parentAvatarSpriteIndex: 0, childAvatarSpriteIndex: 0 } : {})
    };

    // Auto-generate 3 random patterns for all special starts (seeded)
    const seedString = `${randomSeed}|${scenario.id}|patterns`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
      hash = hash & hash;
    }
    let rngState = Math.abs(hash);
    const seededRng = () => {
      rngState |= 0;
      rngState = rngState + 0x6D2B79F5 | 0;
      let t = Math.imul(rngState ^ rngState >>> 15, 1 | rngState);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    const shuffled = [...FAMILY_PATTERN_CATALOG].sort(() => seededRng() - 0.5);
    const autoPatterns = shuffled.slice(0, 3).map(p => p.id);

    startGameWithConfig(
      'balanced',
      autoPatterns,
      careerConfig,
      { selectedCountryIso3: countryIso3, availableCountryIso3s: randomCountries, seed: randomSeed },
      gameOverrides
    );
  };

  const launchQuickStart = () => {
                  const randomSeed = Date.now();
                  const randomCountries = pickTenCountries();
                  const randomCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];
                  const randomGender = Math.random() > 0.5 ? 'boy' : 'girl';
                  const randomParentAge = Math.floor(Math.random() * (45 - 18 + 1)) + 18;

                  // Pick a default culture aligned to the randomly selected country
                  const cultureByIso3 = {
                    USA: ['AMERICAN_US'],
                    NOR: ['OTHER_CUSTOM'],
                    HTI: ['CARIBBEAN'],
                    IDN: ['INDONESIAN'],
                    JPN: ['JAPANESE'],
                    AUS: ['AUS_NZ'],
                    DEU: ['GERMAN'],
                    BRA: ['BRAZILIAN'],
                    IND: ['INDIAN'],
                    ZAF: ['SOUTH_AFRICAN'],
                    MEX: ['MEXICAN'],
                    GBR: ['BRITISH_IRISH'],
                    FRA: ['FRENCH'],
                    // Singapore is multi-cultural; default to Chinese for name generation
                    SGP: ['CHINESE'],
                  };
                  const cultures = cultureByIso3[randomCountry.iso3] || ['AMERICAN_US'];

                  // Child name: prefer country pool; fallback to cultural picker (never fallback to Western-only defaults)
                  const namePool = COUNTRY_NAMES[randomCountry.iso3]?.[randomGender] || [];
                  const randomChildName = namePool.length
                    ? namePool[Math.floor(Math.random() * namePool.length)]
                    : pickCulturalFirstName({
                        cultures,
                        gender: randomGender === 'girl' ? 'female' : 'male',
                        seed: `${randomSeed}|child|${randomCountry.iso3}`
                      });

                  // Player name: always generate one for Quick Start (never "Parent")
                  const randomParentRole = Math.random() < 0.5 ? 'dad' : 'mom';
                  const parentGenderKey = randomParentRole === 'dad' ? 'male' : 'female';
                  const randomParentName = pickCulturalFirstName({
                    cultures,
                    gender: parentGenderKey, // Quick Start randomly picks mom/dad (dad >= 33%)
                    seed: `${randomSeed}|player|${randomCountry.iso3}`
                  });

                  // Auto-fill defaults and start
                  setChildName(randomChildName);
                  setSelectedGender(randomGender);
                  setSelectedCountryIso3(randomCountry.iso3);
                  setSelectedToneIndex(2);
                  setSelectedParentRole(randomParentRole);
                  setParentName(randomParentName);
                  setSelectedCulturalRoots(cultures);
                  setSelectedTemperament('balanced');
                  setSelectedHouseholdType('two');
                  setSelectedEducation('college');
                  setSelectedField('business');
                  setParentAgeAtBirth(randomParentAge);

                  // Compute job and start
                  const eligibleJobs = getEligibleJobs('college', 'business');
                  const defaultJobId = eligibleJobs[0]?.id || 'business_analyst';
                  const careerConfig = computeStartingCareer({
                    educationLevelId: 'college',
                    fieldId: 'business',
                    ageAtBirth: randomParentAge,
                    jobId: defaultJobId
                  });

                  // Pick 3 random family patterns (traumas)
                  const shuffledPatterns = [...FAMILY_PATTERN_CATALOG].sort(() => 0.5 - Math.random());
                  const randomPatternIds = shuffledPatterns.slice(0, 3).map(p => p.id);

                  // Auto-assign faith based on country
                  const faithRng = createSeededRng(`${randomSeed}|${randomCountry.iso3}|faith`);
                  const pickedFaith = pickQuickStartFaith({ iso3: randomCountry.iso3, rng: faithRng });
                  
                  const faithOverride = pickedFaith ? {
                    tradition: pickedFaith.tradition,
                    isCustom: false,
                    status: 'questioning',
                    exposure: Math.floor(faithRng.nextFloat() * 16) + 10,
                    devotion: Math.floor(faithRng.nextFloat() * 16) + 10,
                    lastDecisionAge: null,
                    history: []
                  } : undefined;

                  startGameWithConfig('balanced', randomPatternIds, careerConfig, { 
                    selectedCountryIso3: randomCountry.iso3, 
                    availableCountryIso3s: randomCountries,
                    seed: randomSeed
                  }, {
                    source: 'quickstart',
                    childName: randomChildName,
                    gender: randomGender,
                    parentName: randomParentName,
                    parentRole: randomParentRole,
                    householdType: 'two',
                    toneIndex: 2,
                    playerCultures: cultures,
                    countryIso3: randomCountry.iso3,
                    guidanceEnabled: false,
                    hasEverStartedGame: true,
                    faith: faithOverride
                  });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center p-6 pt-6 relative overflow-hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSettingsOpen(true)}
        className="absolute top-4 right-4 z-[999] rounded-full bg-white/80 hover:bg-white border border-slate-200 shadow-sm"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4 text-slate-700" />
      </Button>

      {/* Floating decorative elements */}


      <motion.div 
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo hero */}
        <div className="w-full flex flex-col items-center justify-center mt-2 mb-6">
          {/* no white card; let it blend with the page */}
          <div className="w-full max-w-[520px] px-4 py-3">
            <img
              src="/demo-art.svg"
              alt="Raising Tomorrow – Parent Simulator"
              className="w-full h-auto block mx-auto select-none drop-shadow-md"
              draggable="false"
              loading="eager"
            />
          </div>

          <div className="mt-3 text-center text-sm text-slate-600">
            Make choices. Raise a human. Try not to break your own nervous system.
          </div>
        </div>

        {/* Title */}


        {/* STEP 1: Main Menu */}
        {startStep === 'intro' && (
          <>
            <h1 className="sr-only">Raising Tomorrow – Parent Simulator</h1>
            <div className="space-y-3">
              {/* My First Play - Primary CTA for first-time guided experience */}
              <Button
                onClick={() => setShowCutscene(true)}
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/30 rounded-xl flex flex-col items-center justify-center gap-0.5"
              >
                <span>My First Play</span>
              </Button>

              <Button
                onClick={() => setMpMenuOpen(true)}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/20 rounded-xl"
              >
                🎮 Multiplayer
              </Button>

              <Button
                data-tour="start-quick-start"
                onClick={launchQuickStart}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/20 rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Start
              </Button>

              <Button 
                data-tour="start-create-character"
                onClick={() => setStartStep('avatar')}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl"
              >
                Customize Your Character
              </Button>

              <Button 
                onClick={() => setBeforeBabyOpen(true)}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-200/50 rounded-xl"
              >
                <Baby className="w-5 h-5 mr-2" />
                Child Free
              </Button>

              <Button 
                data-tour="start-special-starts"
                onClick={() => setStartStep('specialStarts')}
                className="w-full h-14 text-lg font-semibold bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 shadow-sm rounded-xl"
              >
                <Star className="w-5 h-5 mr-2" />
                Special Starts
              </Button>

              <Button
                onClick={() => setChaosStartOpen(true)}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-200/50 rounded-xl"
              >
                🌪️ Chaos Mode
              </Button>

              <Button 
                data-tour="start-load-game"
                onClick={() => setSaveLoadOpen(true)}
                className="w-full h-14 text-lg font-semibold bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200 shadow-sm rounded-xl"
              >
                Load Game
              </Button>

              <Button
                onClick={() => setSettingsOpen(true)}
                variant="outline"
                className="w-full h-12 text-base font-semibold rounded-xl gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>

              {continueSlot && (
                <Button
                  variant="link"
                  onClick={handleContinue}
                  className="w-full h-10 text-sm font-medium text-slate-500"
                >
                  or continue: {continueSlot.childName || continueSlot.label} (Age {continueSlot.currentYear ?? 0})
                </Button>
              )}
            </div>
          </>
        )}

        {/* STEP 1.5: Special Starts */}
        {startStep === 'specialStarts' && (
          <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">
              Special Starts
            </h3>
            
            {/* Category buttons grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SPECIAL_START_GROUPS.map((group) => {
                const scenariosInGroup = SPECIAL_STARTS.filter(s => getSpecialStartGroupKey(s) === group.key);
                const unlockedCount = scenariosInGroup.filter(s => !s.locked).length;
                const lockedCount = scenariosInGroup.filter(s => s.locked).length;
                const totalCount = scenariosInGroup.length;
                
                return (
                  <button
                    key={group.key}
                    onClick={() => setSpecialStartGroupOpen(group.key)}
                    className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 transition-all active:scale-[0.98] text-left"
                  >
                    <div className="text-3xl mb-2">{group.emoji}</div>
                    <div className="font-bold text-slate-800 text-sm mb-1">{group.label}</div>
                    <div className="text-[11px] text-slate-500 leading-tight mb-2">{group.blurb}</div>
                    <div className="text-[10px] text-slate-400">
                      {totalCount} {lockedCount > 0 ? `(${lockedCount} 🔒)` : ''}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button 
              onClick={() => setStartStep('intro')}
              variant="outline"
              className="w-full h-12 text-base"
            >
              Back
            </Button>
          </div>
        )}

        {/* STEP 2: Avatar Selection */}
        {startStep === 'avatar' && !startWithoutChildMode && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-4">
                Create Your Child
              </h3>
              <div className="mb-5 px-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Name your child
                </label>
                <Input
                  type="text"
                  placeholder="Enter a name..."
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="text-lg h-12 border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
                />
                <p className="text-xs text-slate-400 mt-2">
                 Leave blank to auto-name based on your cultural roots (or country).
                </p>
              </div>

              <p className="text-sm font-medium text-slate-600 text-center mb-2">
                Choose their avatar
              </p>

              {/* Girl row */}
              <div className="mb-3">
                <div className="text-xs font-medium text-slate-600 mb-2">Girl</div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {Array.from({ length: 16 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handleAvatarSelect('girl', i)}
                      className={`rounded-xl border p-1 transition-all ${selectedGender === 'girl' && selectedChildAvatarIndex === i ? 'ring-2 ring-pink-400 shadow border-pink-300' : 'border-slate-200 hover:border-pink-300'}`}
                    >
                      <div className="flex items-center justify-center">
                        <PlayerSpriteAvatar genderKey="female" ageNumber={0} index={i} size={56} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Boy row */}
              <div>
                <div className="text-xs font-medium text-slate-600 mb-2">Boy</div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {Array.from({ length: 16 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handleAvatarSelect('boy', i)}
                      className={`rounded-xl border p-1 transition-all ${selectedGender === 'boy' && selectedChildAvatarIndex === i ? 'ring-2 ring-blue-400 shadow border-blue-300' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      <div className="flex items-center justify-center">
                        <PlayerSpriteAvatar genderKey="male" ageNumber={0} index={i} size={56} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-3">
                <Button
                  onClick={handleContinueFromAvatar}
                  disabled={!selectedGender || selectedChildAvatarIndex == null}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
                <Button
                  onClick={handleBackToIntro}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  Back
                </Button>
              </div>
            </motion.div>
          </>
        )}

        {/* STEP 3: Parent Role (Skip in Legacy Mode) */}
        {startStep === 'role' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                {startWithoutChildMode ? 'Are you male or female?' : 'Are you the Mom or the Dad?'}
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                Tap to continue
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSelectRoleAndContinue('mom')}
                  className="flex-1 h-20 rounded-xl font-semibold text-xl transition-all bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 hover:from-rose-200 hover:to-pink-200 hover:shadow-lg active:scale-95 border-2 border-rose-200"
                >
                  {startWithoutChildMode ? '👩 Female' : '👩 Mom'}
                </button>
                <button
                  onClick={() => handleSelectRoleAndContinue('dad')}
                  className="flex-1 h-20 rounded-xl font-semibold text-xl transition-all bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 hover:shadow-lg active:scale-95 border-2 border-blue-200"
                >
                  {startWithoutChildMode ? '👨 Male' : '👨 Dad'}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={handleBackToAvatar}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* STEP 3.25: Parent Avatar Selection */}
        {startStep === 'parentAvatar' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                {startWithoutChildMode ? 'Choose your avatar' : 'Choose your parent avatar'}
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                Pick a portrait. You'll age over time.
              </p>

              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 16 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedParentAvatarIndex(i)}
                    className={`rounded-xl border p-1 transition-all ${selectedParentAvatarIndex === i ? 'ring-2 ring-amber-400 shadow border-amber-300' : 'border-slate-200 hover:border-amber-300'}`}
                  >
                    <div className="flex items-center justify-center">
                      <PlayerSpriteAvatar genderKey={selectedParentRole === 'mom' ? 'female' : 'male'} ageNumber={25} index={i} size={56} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button 
                onClick={handleParentAvatarAndContinue}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl"
              >
                Next
              </Button>
              <Button 
                onClick={handleBackToParentAvatarRole}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* STEP 3.5: Parent Name (Optional) */}
        {startStep === 'parentName' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                Your name (optional)
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                This will appear in the final letter.
              </p>
              <Input
                type="text"
                placeholder="Type your name…"
                value={parentName}
                onChange={(e) => setParentName(e.target.value.slice(0, 24))}
                className="text-lg h-12 border-slate-200 focus:border-amber-400 focus:ring-amber-400/20"
                onKeyDown={(e) => e.key === 'Enter' && handleParentNameAndContinue()}
                maxLength={24}
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-2">
                Leave blank for 'Parent'.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button 
                onClick={handleParentNameAndContinue}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl"
              >
                Continue
              </Button>
              <Button 
                onClick={handleBackToRole}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* STEP 4: Temperament */}
        {startStep === 'temperament' && !startWithoutChildMode && (
          <>
            <motion.div 
              className="flex flex-col min-h-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 mb-6 max-h-[85dvh]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex-shrink-0 px-6 pt-6 pb-2">
                <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                  Your baby was just born…
                </h3>
                <p className="text-xs text-slate-500 text-center">
                  What do you notice most about them?
                </p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-2 overscroll-y-contain touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
                {[
                  { id: 'balanced', emoji: '🙂', label: 'Balanced', tagline: 'Adaptable and steady' },
                  { id: 'bold', emoji: '⚡', label: 'Bold Explorer', tagline: 'Curious and energetic' },
                  { id: 'sensitive', emoji: '🌙', label: 'Sensitive & Deep Feeler', tagline: 'Deeply feeling' },
                  { id: 'routine', emoji: '🧱', label: 'Routine Lover', tagline: 'Comfort in patterns' },
                  { id: 'social', emoji: '🫂', label: 'Social Butterfly', tagline: 'Connection-focused' },
                  { id: 'observer', emoji: '👀', label: 'Quiet Observer', tagline: 'Thoughtful and calm' }
                ].map((temp) => (
                  <button
                    key={temp.id}
                    onClick={() => handleSelectTemperamentAndContinue(temp.id)}
                    className="w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-98"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0">{temp.emoji}</span>
                      <div className="text-left min-w-0">
                        <div className="font-semibold text-slate-800 text-sm">{temp.label}</div>
                        <div className="text-xs text-slate-500">{temp.tagline}</div>
                      </div>
                    </div>
                    <TemperamentHelpPopover temperamentId={temp.id} />
                  </button>
                ))}
                <div className="h-4" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={isLegacy ? handleBackToAvatar : handleBackToParentName}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* STEP 5: Household Type (Skip in Legacy Mode) */}
        {startStep === 'household' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                {startWithoutChildMode ? "What's your household situation?" : <>Who's raising {childName || "your child"}?</>}
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                Tap to continue
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSelectHouseholdAndContinue('single')}
                  className="w-full p-5 rounded-xl border-2 transition-all bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-98"
                >
                  <div className="text-2xl mb-2">🧍</div>
                  <div className="font-bold text-slate-800 text-base mb-1">{startWithoutChildMode ? 'Single' : 'Single‑Parent Household'}</div>
                  <div className="text-sm text-slate-600">{startWithoutChildMode ? 'More independence. Less support.' : 'Less time. More load.'}</div>
                </button>
                
                <button
                  onClick={() => handleSelectHouseholdAndContinue('two')}
                  className="w-full p-5 rounded-xl border-2 transition-all bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-98"
                >
                  <div className="text-2xl mb-2">👫</div>
                  <div className="font-bold text-slate-800 text-base mb-1">{startWithoutChildMode ? 'With Partner' : 'Two‑Parent Household'}</div>
                  <div className="text-sm text-slate-600">{startWithoutChildMode ? 'More support. More coordination.' : 'More hands. More coordination.'}</div>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={startWithoutChildMode ? handleBackToParentName : handleBackToTemperament}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* STEP 5.5: Country Selection (New Flow) */}
        {startStep === 'country' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                Choose your country
              </h3>
              <p className="text-xs text-slate-500 text-center mb-4">
                Affects income, costs, and culture.
              </p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase">Available Options</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShuffleCountries}
                  disabled={!!lockedScenarioCountryIso3}
                  className="h-7 text-xs font-semibold bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔀 Shuffle
                </Button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {availableCountryIso3s.map((countryObj) => {
                  const country = countryObj;
                  const iso3 = country.iso3;
                  return (
                    <button
                      key={iso3}
                      onClick={() => handleSelectCountryAndContinue(iso3)}
                      className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between text-left ${
                        selectedCountryIso3 === iso3 
                          ? 'bg-amber-50 border-amber-400 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{country.name}</div>
                        <div className="text-xs text-slate-500">Income Level {country.level}</div>
                      </div>
                      {selectedCountryIso3 === iso3 && (
                        <div className="text-amber-600">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={handleBackToHousehold}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* STEP 5.6: Cultural Roots */}
        {startStep === 'culturalRoots' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                Cultural Roots
              </h3>
              <p className="text-xs text-slate-500 text-center mb-4">
                Choose the cultures that shaped you. Select all that apply.
              </p>
              
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {CULTURAL_ROOTS.map((root) => {
                  const isSelected = selectedCulturalRoots.includes(root.id);
                  return (
                    <button
                      key={root.id}
                      onClick={() => handleToggleRoot(root.id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between text-left ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-400 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <div className="font-bold text-slate-800 text-sm">{root.label}</div>
                      {isSelected && (
                        <div className="text-indigo-600">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button 
                onClick={handleCulturalRootsContinue}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl"
              >
                Continue
              </Button>
              <Button 
                onClick={handleBackToCulturalRoots}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* LEGACY ONLY: Income Tier */}
        {startStep === 'income' && isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                How's the budget… after bills?
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                Tap to start
              </p>
              
              <div className="space-y-3">
                {Object.entries(INCOME_CONFIG).map(([tier, config], index) => (
                  <motion.button
                    key={tier}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => handleSelectIncomeAndStart(tier)}
                    className="w-full p-5 rounded-xl border-2 transition-all bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-98"
                  >
                    <div className="text-3xl mb-2">{config.emoji}</div>
                    <div className="font-bold text-slate-800 text-base mb-1">{config.label}</div>
                    <div className="text-xs text-slate-500">
                      Starting: ${config.startMoney.toLocaleString()} • Yearly: +${config.yearlyIncome.toLocaleString()}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={handleBackToHousehold}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* NEW: Education Level */}
        {startStep === 'education' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                Your education level
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                This determines your job options
              </p>
              
              <div className="space-y-3">
                {EDUCATION_LEVELS.map((edu, index) => (
                  <motion.button
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => handleSelectEducationAndContinue(edu.id)}
                    className="w-full p-4 rounded-xl border-2 transition-all bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-98 flex items-center gap-3"
                  >
                    <span className="text-3xl">{edu.emoji}</span>
                    <span className="font-bold text-slate-800 text-base">{edu.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                onClick={handleBackToEducation}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* NEW: Field Selection (College/Masters only) */}
        {startStep === 'field' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                What field did you study?
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                This narrows your job options
              </p>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {EDUCATION_FIELDS.map((field, index) => (
                  <motion.button
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => handleSelectFieldAndContinue(field.id)}
                    className="w-full p-3 rounded-xl border-2 transition-all bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-98 flex items-center gap-3"
                  >
                    <span className="text-2xl">{field.emoji}</span>
                    <span className="font-semibold text-slate-800 text-sm">{field.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={handleBackToEducation}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* NEW: Parent Age at Birth */}
        {startStep === 'parentAge' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                {startWithoutChildMode ? 'How old are you?' : 'Your age when they were born'}
              </h3>
              <p className="text-xs text-slate-500 text-center mb-5">
                Older = more experience = higher salary
              </p>
              
              <div className="mb-6">
                <div className="text-center mb-3">
                  <span className="text-4xl font-bold text-amber-600">{parentAgeAtBirth}</span>
                  <span className="text-lg text-slate-500 ml-2">years old</span>
                </div>
                
                <Slider
                  value={[parentAgeAtBirth]}
                  onValueChange={(val) => setParentAgeAtBirth(val[0])}
                  min={18}
                  max={60}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>18</span>
                  <span>60</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button 
                onClick={handleParentAgeAndContinue}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl"
              >
                Continue
              </Button>
              <Button 
                onClick={() => {
                  const FIELD_EDUS = new Set(['bachelors', 'college', 'masters', 'phd', 'mba']);
                  if (FIELD_EDUS.has(selectedEducation)) {
                    setStartStep('field');
                  } else {
                    setStartStep('education');
                  }
                }}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* NEW: Job Selection */}
        {startStep === 'job' && !isLegacy && (() => {
          const eligibleJobs = getEligibleJobs(selectedEducation, selectedField);
          const previewCareer = selectedJobId 
            ? computeStartingCareer({ educationLevelId: selectedEducation, fieldId: selectedField, ageAtBirth: parentAgeAtBirth, jobId: selectedJobId })
            : null;
          
          // Safety: if no jobs available, show error
          if (eligibleJobs.length === 0) {
            return (
              <>
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">⚠️ No Jobs Available</h3>
                  <p className="text-sm text-slate-600 text-center mb-6">
                    No jobs found for your selected education and field combination. Please go back and adjust your selections.
                  </p>
                  <Button 
                    onClick={() => setStartStep(selectedField ? 'field' : 'education')}
                    variant="outline"
                    className="w-full h-12"
                  >
                    {selectedField ? 'Back to Field Selection' : 'Back to Education'}
                  </Button>
                </motion.div>
              </>
            );
          }
          
          return (
            <>
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-slate-800 text-center mb-1">
                  Your job
                </h3>
                <p className="text-xs text-slate-500 text-center mb-5">
                  This determines your starting money and yearly budget
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Choose your role
                  </label>
                  <Select value={selectedJobId || ''} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Select a job..." />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleJobs.map(job => {
                        const tempCareer = computeStartingCareer({ 
                          educationLevelId: selectedEducation, 
                          fieldId: selectedField, 
                          ageAtBirth: parentAgeAtBirth, 
                          jobId: job.id 
                        });
                        
                        const wageScale = getCountryWageScale(selectedCountryIso3);
                        const localIncome = localizeAmount(tempCareer.yearlyIncome, wageScale);
                        
                        return (
                          <SelectItem key={job.id} value={job.id}>
                            {job.emoji} {job.title} • +${formatMoneyCompact(localIncome)}/yr
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview Panel */}
                {previewCareer && previewCareer.job && (
                  <motion.div 
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{previewCareer.job.emoji}</div>
                      <div className="font-bold text-slate-800">{previewCareer.job.title}</div>
                    </div>
                    
                    {(() => {
                      const wageScale = getCountryWageScale(selectedCountryIso3);
                      const localIncome = localizeAmount(previewCareer.yearlyIncome, wageScale);
                      const localStart = localizeAmount(previewCareer.startMoney, wageScale);
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Annual budget:</span>
                            <span className="font-bold text-green-700">+${formatMoneyCompact(localIncome)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Starting cash:</span>
                            <span className="font-bold text-slate-800">${formatMoneyCompact(localStart)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Difficulty:</span>
                            <span className="font-medium text-slate-700 capitalize">{previewCareer.incomeTier}</span>
                          </div>
                        </div>
                      );
                    })()}
                    
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <div className="text-xs text-slate-600 mb-1 font-medium">Spillover each age:</div>
                      <div className="text-xs text-slate-700 italic">{previewCareer.job.blurb}</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button 
                  onClick={() => handleSelectJobAndContinue(selectedJobId)}
                  disabled={!selectedJobId}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
                <Button 
                  onClick={handleBackToParentAge}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  Back
                </Button>
              </motion.div>
            </>
          );
        })()}

        {/* NEW: Family Patterns (now a full step, not just modal) */}
        {startStep === 'patterns' && !isLegacy && (
          <>
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
                Before We Begin
              </h3>
              
              <div className="text-sm text-slate-700 leading-relaxed space-y-3 mb-5">
                <p>Before the story continues, we ask you to pause for a moment.</p>
                
                <p>In Raising Tomorrow, the past matters — not because it defines us, but because it quietly shapes how we love, cope, and grow.</p>
                
                <p>You'll be asked to choose family traumas (family patterns) that may have been part of your character's childhood. These are not judgments, labels, or diagnoses. They are common human experiences — things many families carry in different ways.</p>
                
                <p className="font-medium">This is not about reliving pain or explaining yourself.<br/>
                It's about giving the story emotional truth.</p>
                
                <p>There are no "right" or "wrong" answers.<br/>
                You can take your time.<br/>
                And you can explore or revisit these choices later.</p>
                
                <p className="font-medium text-slate-800">What you choose here helps shape how the story understands you — and how your child's story unfolds.</p>
              </div>
              
              <div className="text-xs text-slate-500 italic mb-5 px-2">
                These traumas influence moments, choices, relationships, and long-term outcomes throughout the game.
              </div>
              
              <button
                onClick={() => setShowWhyThisMatters(!showWhyThisMatters)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-4 underline"
              >
                {showWhyThisMatters ? '− Hide' : '+ Why this matters'}
              </button>
              
              {showWhyThisMatters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-slate-700 leading-relaxed space-y-3 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <p className="font-medium">Parenting doesn't happen in a vacuum.</p>
                  
                  <p>The ways we respond to stress, conflict, love, and uncertainty are often shaped long before we become parents — sometimes consciously, often not.</p>
                  
                  <p>By choosing family patterns, you're giving the game context:</p>
                  
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>Why certain moments feel harder or easier</li>
                    <li>Why some choices carry more emotional weight</li>
                    <li>Why growth can take time — and why it matters when it happens</li>
                  </ul>
                  
                  <p>This allows Raising Tomorrow to tell a more honest story — one that reflects real human complexity, resilience, and change.</p>
                </motion.div>
              )}
              
              <Button 
                onClick={() => setFamilyPatternsModalOpen(true)}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl"
              >
                Choose Family Traumas
              </Button>
            </motion.div>
            
            <motion.p
              className="text-center text-xs text-slate-500 italic mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              This is a normal part of being human — and a powerful part of the story.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={handleBackToJob}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Back
              </Button>
            </motion.div>
          </>
        )}

        {/* Footer text */}
        <motion.p 
          className="text-center text-xs text-slate-400 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Every choice shapes who they become.
        </motion.p>

        <motion.div 
          className="mt-8 text-center text-[10px] text-slate-400 max-w-xs mx-auto bg-slate-100/50 p-2 rounded-lg border border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <strong>Tester Build:</strong> This version focuses on core parenting decisions, scenarios, actions, and outcomes. Additional insight systems will be added in future updates.
        </motion.div>

        </motion.div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Partner Creator Modal */}
      <PartnerCreatorModal
        open={partnerCreatorOpen}
        onComplete={handlePartnerCreated}
        defaultGenderKey={selectedParentRole === 'mom' ? 'male' : 'female'}
        defaultToneIndex={selectedToneIndex}
      />
      
      {/* Family Patterns Select Modal */}
      <FamilyPatternsSelectModal
        open={familyPatternsModalOpen}
        onComplete={handleFamilyPatternsComplete}
        runSeed={getRunSeed()}
        requiredCount={pendingSpecialStart ? 3 : undefined}
      />

      {/* Save / Load Slots */}
      <SaveLoadModal
        open={saveLoadOpen}
        onClose={() => {
          setSaveLoadOpen(false);
          refreshSaveSlots();
        }}
        mode="start"
        onAfterLoad={() => navigate(createPageUrl('Game'))}
        onStartNew={(slotId) => {
          // Bind autosave to this slot BEFORE starting new family
          try {
            if (typeof setActiveSaveSlot === 'function') {
              setActiveSaveSlot(slotId);
            }
          } catch (e) {
            console.error('Failed to set active slot:', e);
          }

          setExplicitNewSlotId(slotId);
          setSaveLoadOpen(false);
          refreshSaveSlots();
          setStartStep('intro');
        }}
      />

      {/* Special Start Choice Dialog */}
      {specialStartChoiceOpen && selectedSpecialStart && (
        <div className="fixed inset-0 z-[9010] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="text-lg font-bold mb-2">{selectedSpecialStart.title}</div>
            <div className="text-sm text-slate-600 mb-6">How would you like to start?</div>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setSpecialStartChoiceOpen(false);
                  launchSpecialStart(selectedSpecialStart);
                }}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Start
              </Button>
              
              <Button
                onClick={() => {
                  const overrides = selectedSpecialStart.overrides || {};
                  
                  // Pre-fill form values
                  if (overrides.householdType) setSelectedHouseholdType(overrides.householdType);
                  if (overrides.parentRole) setSelectedParentRole(overrides.parentRole);
                  if (overrides.incomeTier) setSelectedIncomeTier(overrides.incomeTier);
                  if (overrides.countryIso3) setSelectedCountryIso3(overrides.countryIso3);
                  
                  // Store pending scenario to apply later
                  setPendingSpecialStart({
                    scenario: selectedSpecialStart,
                    overrides,
                    careerConfig: null,
                    countryConfig: null
                  });
                  
                  setSpecialStartChoiceOpen(false);
                  setStartStep('avatar');
                }}
                variant="outline"
                className="w-full h-14 font-semibold"
              >
                Customize Character
              </Button>
              
              <Button
                onClick={() => {
                  setSpecialStartChoiceOpen(false);
                  setSelectedSpecialStart(null);
                }}
                variant="outline"
                className="w-full h-10 text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Special Start Group Drawer */}
      <Drawer open={!!specialStartGroupOpen} onOpenChange={(open) => !open && setSpecialStartGroupOpen(null)}>
        <DrawerContent className="max-h-[85vh] flex flex-col min-h-0">
          {specialStartGroupOpen && (() => {
            const group = SPECIAL_START_GROUPS.find(g => g.key === specialStartGroupOpen);
            if (!group) return null;
            
            // Priority ordering for featured starts in specific categories
            const PRIORITY_BY_GROUP = {
              survival: ["war_zone", "refugee_camp"],
              insane: ["zombie_apocalypse", "kim_jong_un", "alien_invasion"],
            };
            
            const sortByPriorityThenDefault = (groupKey, a, b) => {
              const pri = PRIORITY_BY_GROUP[groupKey] || [];
              const ai = pri.indexOf(a.id);
              const bi = pri.indexOf(b.id);
              if (ai !== -1 || bi !== -1) {
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
              }
              const lockDiff = Number(!!a.locked) - Number(!!b.locked);
              if (lockDiff !== 0) return lockDiff;
              return a.title.localeCompare(b.title);
            };
            
            const scenarios = SPECIAL_STARTS.filter(s => getSpecialStartGroupKey(s) === specialStartGroupOpen);
            scenarios.sort((a, b) => sortByPriorityThenDefault(specialStartGroupOpen, a, b));
            
            return (
              <>
                <div className="px-4 pt-4 pb-2 flex-shrink-0">
                  <div className="mb-4 text-center">
                    <div className="text-4xl mb-2">{group.emoji}</div>
                    <div className="text-xl font-bold text-slate-800">{group.label}</div>
                    <div className="text-sm text-slate-600 mt-1">{group.blurb}</div>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pb-10 space-y-3">
                  {scenarios.map((scenario) => {
                    const locked = !!scenario.locked;
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => {
                          if (locked) {
                            toast.info('Coming soon');
                            return;
                          }

                          if (scenario?.id === "famous_pop_star") {
                            setPendingPopStarScenario(scenario);
                            setPopStarCreatorOpen(true);
                            setPopStarRole("mom");
                            setPopStarHousehold("two");
                            setPopStarFameTier("alist");
                            setPopStarName("");
                            setPopStarPartnerName("");
                            setPopStarPartnerGender("male");
                            setPopStarChildName(String(childName || "").trim());
                            setPopStarBioParentName("");
                            setPopStarMomName("");
                            setPopStarDadName("");
                            setPopStarMomAlive(true);
                            setPopStarDadAlive(true);
                            setSpecialStartGroupOpen(null);
                            return;
                          }

                          setSelectedSpecialStart(scenario);
                          setSpecialStartChoiceOpen(true);
                          setSpecialStartGroupOpen(null);
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.98] ${locked ? 'bg-white/70 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 min-w-0">
                            {(() => {
                              const rawEmoji = scenario.emoji || '⭐';
                              const units = Array.from(String(rawEmoji));
                              const stacked = (units.length >= 5 && !String(rawEmoji).includes('\u200d')) ? units.join('\n') : rawEmoji;
                              return (
                                <span className="text-2xl flex-shrink-0 whitespace-pre-line leading-none text-center">
                                  {stacked}
                                </span>
                              );
                            })()}

                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 mb-1 truncate">{(() => { const t = scenario.title || ''; const em = scenario.emoji || ''; let out = t; for (const ch of Array.from(em)) { out = out.split(ch).join(''); } return out.trim(); })()}</div>
                              <div className="text-xs text-slate-600 leading-relaxed">{scenario.description}</div>
                            </div>
                          </div>
                          {locked && (
                            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded whitespace-nowrap">🔒 Locked</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  <div className="h-12" />
                </div>
              </>
            );
          })()}
        </DrawerContent>
      </Drawer>

      {/* Child Free Start Drawer */}
      <Drawer open={beforeBabyOpen} onOpenChange={setBeforeBabyOpen}>
        <DrawerContent className="max-h-[85vh]">
          <div className="px-4 pt-4 pb-10 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">👶 Child Free</h3>
            <p className="text-sm text-slate-600 text-center mb-4">
              Start without a child yet. You'll choose Parenting Style once you have your first child.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => {
                  const randomSeed = Date.now();
                  const randomCountries = pickTenCountries();
                  const randomCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];
                  const randomParentAge = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
                  const randomParentRole = Math.random() < 0.5 ? 'dad' : 'mom';
                  
                  const cultures = inferCulturesFromCountryIso3(randomCountry.iso3);
                  const parentGenderKey = randomParentRole === 'dad' ? 'male' : 'female';
                  const randomParentName = pickCulturalFirstName({
                    cultures,
                    gender: parentGenderKey,
                    seed: `${randomSeed}|player|${randomCountry.iso3}`
                  });
                  
                  const eligibleJobs = getEligibleJobs('college', 'business');
                  const defaultJobId = eligibleJobs[0]?.id || 'business_analyst';
                  const careerConfig = computeStartingCareer({
                    educationLevelId: 'college',
                    fieldId: 'business',
                    ageAtBirth: randomParentAge,
                    jobId: defaultJobId
                  });
                  
                  setBeforeBabyOpen(false);
                  
                  resetGame(
                    'placeholder',
                    null,
                    'two',
                    'medium',
                    randomParentRole,
                    null,
                    careerConfig,
                    { selectedCountryIso3: randomCountry.iso3, availableCountryIso3s: randomCountries, seed: randomSeed },
                    { 
                      runSeed: randomSeed, 
                      startWithoutChild: true, 
                      hasEverStartedGame: true, 
                      guidanceEnabled: false,
                      parentName: randomParentName,
                      playerCultures: cultures,
                      countryIso3: randomCountry.iso3
                    }
                  );
                  navigate(createPageUrl('Game'));
                }}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Start (Child Free)
              </Button>

              <Button
                onClick={() => {
                  setStartWithoutChildMode(true);
                  setBeforeBabyOpen(false);
                  setStartStep('role');
                }}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg rounded-xl"
              >
                Customize (Child Free)
              </Button>

              <Button
                onClick={() => setBeforeBabyOpen(false)}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Chaos Mode Start Drawer */}
      <Drawer open={chaosStartOpen} onOpenChange={setChaosStartOpen}>
        <DrawerContent className="max-h-[85vh]">
          <div className="px-4 pt-4 pb-10 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">🌪️ Chaos Mode</h3>
            <p className="text-sm text-slate-600 text-center mb-6">Pick a level, then choose how you want to start.</p>
            
            <div className="space-y-3 mb-6">
              {CHAOS_MODE_LEVELS.filter(l => l.level > 0).map((level) => {
                const isSelected = chaosStartLevel === level.level;
                return (
                  <button
                    key={level.level}
                    onClick={() => setChaosStartLevel(level.level)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-purple-400 bg-purple-50 shadow-md' 
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{level.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 mb-1">{level.label}</div>
                        <div className="text-xs text-slate-600 mb-1">{level.blurb}</div>
                        <div className="text-[11px] text-slate-500">{level.details}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  const randomSeed = Date.now();
                  const randomCountries = pickTenCountries();
                  const randomCountry = randomCountries[Math.floor(Math.random() * randomCountries.length)];
                  const randomGender = Math.random() > 0.5 ? 'boy' : 'girl';
                  const randomParentAge = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
                  const cultures = inferCulturesFromCountryIso3(randomCountry.iso3);
                  const randomChildName = pickCulturalFirstName({
                    cultures,
                    gender: randomGender === 'girl' ? 'female' : 'male',
                    seed: `${randomSeed}|child|${randomCountry.iso3}`
                  });
                  const randomParentRole = Math.random() < 0.5 ? 'dad' : 'mom';
                  const parentGenderKey = randomParentRole === 'dad' ? 'male' : 'female';
                  const randomParentName = pickCulturalFirstName({
                    cultures,
                    gender: parentGenderKey,
                    seed: `${randomSeed}|player|${randomCountry.iso3}`
                  });

                  const eligibleJobs = getEligibleJobs('college', 'business');
                  const defaultJobId = eligibleJobs[0]?.id || 'business_analyst';
                  const careerConfig = computeStartingCareer({
                    educationLevelId: 'college',
                    fieldId: 'business',
                    ageAtBirth: randomParentAge,
                    jobId: defaultJobId
                  });

                  const shuffledPatterns = [...FAMILY_PATTERN_CATALOG].sort(() => 0.5 - Math.random());
                  const randomPatternIds = shuffledPatterns.slice(0, 3).map(p => p.id);

                  setChaosStartOpen(false);
                  startGameWithConfig('balanced', randomPatternIds, careerConfig, { 
                    selectedCountryIso3: randomCountry.iso3, 
                    availableCountryIso3s: randomCountries,
                    seed: randomSeed
                  }, {
                    source: 'chaos_quick_start',
                    childName: randomChildName,
                    gender: randomGender,
                    parentName: randomParentName,
                    parentRole: randomParentRole,
                    householdType: 'two',
                    toneIndex: 2,
                    playerCultures: cultures,
                    countryIso3: randomCountry.iso3,
                    chaosModeLevel: chaosStartLevel,
                    chaosMode: true,
                    guidanceEnabled: false,
                    hasEverStartedGame: true
                  });
                }}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Start (Chaos)
              </Button>

              <Button
                onClick={() => {
                  setPendingChaosStartLevel(chaosStartLevel);
                  setChaosStartOpen(false);
                  setStartStep('avatar');
                }}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg rounded-xl"
              >
                Customize Character (Chaos)
              </Button>

              <Button
                onClick={() => setChaosStartOpen(false)}
                variant="outline"
                className="w-full h-12 text-base"
              >
                Cancel
              </Button>

              <p className="text-[10px] text-slate-500 text-center mt-2">
                You can change Chaos Mode later in Settings.
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Multiplayer Menu Dialog */}
      <MultiplayerMenuDialog
        open={mpMenuOpen}
        onOpenChange={setMpMenuOpen}
        onLocalQuickStart={startLocalMultiplayerQuickStart}
        onLocalCustomize={() => {
          setMpMenuOpen(false);
          setMpCustomizeOpen(true);
        }}
        onOnlineMultiplayer={() => {
          setMpMenuOpen(false);
          navigate(createPageUrl('OnlineMultiplayer'));
        }}
      />

      {/* Multiplayer Character Setup Dialog */}
      <MultiplayerCharacterSetupDialog
        open={mpCustomizeOpen}
        onOpenChange={setMpCustomizeOpen}
        initialStarterRole="dad"
        onConfirm={({ action, presetLabel, config }) => {
          startLocalMultiplayerCustom(config);
        }}
      />

      {/* Pop Star Character Creator Modal */}
      {popStarCreatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="text-xl font-bold">Pop Star Character Creator</div>
            <div className="mt-1 text-sm opacity-80">
              This is a generic pop-star scenario. Type any names you want.
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">Your name (stage name)</div>
                <input className="mt-1 w-full rounded-lg border p-2" value={popStarName} onChange={e => setPopStarName(e.target.value)} placeholder="" />
              </div>

              <div>
                <div className="text-sm font-semibold">You are</div>
                <div className="mt-1 flex gap-2">
                  <button className={"rounded-lg border px-3 py-2 " + (popStarRole === "mom" ? "border-black" : "border-gray-200")} onClick={() => setPopStarRole("mom")}>Mom</button>
                  <button className={"rounded-lg border px-3 py-2 " + (popStarRole === "dad" ? "border-black" : "border-gray-200")} onClick={() => setPopStarRole("dad")}>Dad</button>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Relationship status</div>
                <div className="mt-1 flex gap-2">
                  <button className={"rounded-lg border px-3 py-2 " + (popStarHousehold === "two" ? "border-black" : "border-gray-200")} onClick={() => setPopStarHousehold("two")}>With Partner</button>
                  <button className={"rounded-lg border px-3 py-2 " + (popStarHousehold === "single" ? "border-black" : "border-gray-200")} onClick={() => setPopStarHousehold("single")}>Single Parent</button>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Fame tier</div>
                <select className="mt-1 w-full rounded-lg border p-2" value={popStarFameTier} onChange={e => setPopStarFameTier(e.target.value)}>
                  {POP_STAR_FAME_TIERS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <div className="mt-1 text-xs opacity-70">
                  {(POP_STAR_FAME_TIERS.find(t => t.id === popStarFameTier) || POP_STAR_FAME_TIERS[1]).blurb}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold">Your age (when your child is born)</div>
                <input
                  type="number"
                  min={18}
                  max={60}
                  className="mt-1 w-full rounded-lg border p-2"
                  value={popStarAgeAtBirth}
                  onChange={e => setPopStarAgeAtBirth(Number(e.target.value))}
                />
                <div className="mt-1 text-xs opacity-70">Affects starting career & family ages.</div>
              </div>

              <div>
                <div className="text-sm font-semibold">Child name</div>
                <input className="mt-1 w-full rounded-lg border p-2" value={popStarChildName} onChange={e => setPopStarChildName(e.target.value)} placeholder="Leave blank for auto-name" />
              </div>

              <div>
                <div className="text-sm font-semibold">Child's other biological parent (optional)</div>
                <input className="mt-1 w-full rounded-lg border p-2" value={popStarBioParentName} onChange={e => setPopStarBioParentName(e.target.value)} placeholder="Optional (adds a relationship entry)" />
              </div>
            </div>

            {popStarHousehold === "two" && (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold">Partner name</div>
                  <input className="mt-1 w-full rounded-lg border p-2" value={popStarPartnerName} onChange={e => setPopStarPartnerName(e.target.value)} placeholder="Type a name" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Partner gender</div>
                  <select className="mt-1 w-full rounded-lg border p-2" value={popStarPartnerGender} onChange={e => setPopStarPartnerGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <div className="text-sm font-semibold">Partner age (when your child is born)</div>
                  <input
                    type="number"
                    min={18}
                    max={75}
                    className="mt-1 w-full rounded-lg border p-2"
                    value={popStarPartnerAgeAtBirth}
                    onChange={e => setPopStarPartnerAgeAtBirth(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">Your mom (optional)</div>
                <input className="mt-1 w-full rounded-lg border p-2" value={popStarMomName} onChange={e => setPopStarMomName(e.target.value)} placeholder="Name (blank keeps default)" />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={popStarMomAlive} onChange={e => setPopStarMomAlive(e.target.checked)} />
                  Alive
                </label>
              </div>
              <div>
                <div className="text-sm font-semibold">Your dad (optional)</div>
                <input className="mt-1 w-full rounded-lg border p-2" value={popStarDadName} onChange={e => setPopStarDadName(e.target.value)} placeholder="Name (blank keeps default)" />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={popStarDadAlive} onChange={e => setPopStarDadAlive(e.target.checked)} />
                  Alive
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-lg border px-3 py-2" onClick={() => { setPopStarCreatorOpen(false); setPendingPopStarScenario(null); }}>
                Cancel
              </button>
              <button className="rounded-lg bg-black px-3 py-2 text-white" onClick={confirmPopStarAndStart}>
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      <MyFirstPlayCutscene
        open={showCutscene}
        onClose={() => setShowCutscene(false)}
        onPlayFixed={() => {
          setShowCutscene(false);
          // Start fixed "Doctor + Baby" tutorial game
          const tutorialSeed = 12345;
          const tutorialCountryIso3 = 'USA';
          const tutorialCultures = ['AMERICAN_US'];

          const tutorialChildName = 'Alex';
          const tutorialChildGender = 'boy';

          const tutorialParentRole = 'mom';
          const tutorialParentName = 'Dr. Maya Patel';
          const tutorialParentAgeAtBirth = 30;

          const careerConfig = computeStartingCareer({
            educationLevelId: 'md',
            ageAtBirth: tutorialParentAgeAtBirth,
            jobId: 'doctor',
            allowHiddenJobId: true
          });
          careerConfig.startMoney = 150000;

          startGameWithConfig(
            'balanced',
            [],
            careerConfig,
            {
              selectedCountryIso3: tutorialCountryIso3,
              availableCountryIso3s: ['USA', 'CAN', 'GBR', 'AUS', 'FRA', 'DEU', 'ITA', 'JPN', 'BRA', 'IND'],
              seed: tutorialSeed
            },
            {
              source: 'myfirstplay_cutscene',
              runSeed: `ftue_cutscene_v1_${tutorialSeed}`,
              childName: tutorialChildName,
              gender: tutorialChildGender,
              childAvatarSpriteIndex: 2,
              parentName: tutorialParentName,
              parentRole: tutorialParentRole,
              parentAvatarSpriteIndex: 0,
              householdType: 'single',
              toneIndex: 2,
              playerCultures: tutorialCultures,
              countryIso3: tutorialCountryIso3,
              guidanceEnabled: false,
              hasEverStartedGame: true,
              money: 150000,
              startMoney: 150000,
              ftueMyFirstPlay: true
            }
          );

          navigate(createPageUrl('Game'));
        }}
        onCreateCharacter={() => {
          setShowCutscene(false);
          setStartStep('avatar');
        }}
        onQuickStart={() => {
          setShowCutscene(false);
          launchQuickStart();
        }}
      />
    </div>
  );
}