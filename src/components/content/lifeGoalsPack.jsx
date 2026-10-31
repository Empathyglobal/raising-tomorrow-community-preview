import React from "react"; // harmless if unused; some bundlers warn less with it present

export const LIFE_GOALS = [
  // Kid-focused goals (existing)
  { id: "kid_scholar", track: "kid", category: "Learning", emoji: "🧠", title: "Raise a Scholar", description: "Boost intelligence/knowledge milestones." },
  { id: "kid_confident", track: "kid", category: "Character", emoji: "⭐", title: "Build Confidence", description: "Help them become brave and self-assured." },
  { id: "kid_kind", track: "kid", category: "Character", emoji: "💞", title: "Grow Empathy", description: "Help them notice feelings and respond well." },
  { id: "kid_disciplined", track: "kid", category: "Character", emoji: "🧱", title: "Strengthen Discipline", description: "Build routines and impulse control." },
  { id: "kid_happy", track: "kid", category: "Well-being", emoji: "😊", title: "Protect Joy", description: "Aim for a happier, steadier childhood." },
  { id: "kid_creative", track: "kid", category: "Skills", emoji: "🎨", title: "Creative Life", description: "Encourage curiosity + creativity." },

  // Kid-focused goals (new)
  { id: "kid_athlete", track: "kid", category: "Well-being", emoji: "🏅", title: "Raise an Athlete", description: "Help your kid build strength, confidence, and healthy habits." },
  { id: "kid_healthy_habits", track: "kid", category: "Well-being", emoji: "🥗", title: "Healthy Habits", description: "Build routines that keep their health steady and strong." },
  { id: "kid_social_butterfly", track: "kid", category: "Social", emoji: "🦋", title: "Social Butterfly", description: "Help them make friends and feel comfortable socially." },
  { id: "kid_resilient", track: "kid", category: "Character", emoji: "🛡️", title: "Resilience", description: "Build coping skills so anxiety doesn't run the show." },
  { id: "kid_leader", track: "kid", category: "Character", emoji: "🎤", title: "Young Leader", description: "Confidence + responsibility + social skill — the trifecta." },
  { id: "kid_explorer", track: "kid", category: "Skills", emoji: "🧭", title: "Curious Explorer", description: "Nurture curiosity, discovery, and a taste for adventure." },
  { id: "kid_helper", track: "kid", category: "Character", emoji: "🤝", title: "Responsible Helper", description: "Teach responsibility by letting them contribute for real." },
  { id: "kid_maker", track: "kid", category: "Skills", emoji: "🧰", title: "Creative Builder", description: "Turn ideas into projects — creativity plus follow-through." },

  // Ending Paths (Quest Goals)
  { id: "kid_mars_pioneer", track: "kid", category: "Ending Paths", emoji: "🛰️", title: "First Human on Mars", description: "Brilliance is required. So is teamwork. Space is basically a group project with consequences.", isEndingPath: true, trophyId: "mars_pioneer", endingTopBadge: "🏆 Legendary: First Human on Mars", statHintsUp: ["intelligence","curiosity","knowledge","empathy","discipline","fitness"], statHintsDown: [], hintText: "Brilliance is required. So is teamwork. Space is basically a group project with consequences." },
  { id: "kid_hero_president", track: "kid", category: "Ending Paths", emoji: "🗳️", title: "The President (Listener)", description: "A rare build: brave enough to speak, kind enough to listen.", isEndingPath: true, trophyId: "hero_president", endingTopBadge: "🗳️ Legendary: The President (Listener)", statHintsUp: ["empathy","confidence","social","responsibility","discipline"], statHintsDown: [], hintText: "A rare build: brave enough to speak, kind enough to listen." },
  { id: "kid_time_traveler", track: "kid", category: "Ending Paths", emoji: "⏳", title: "Time Traveler", description: "Genius + curiosity… with a little chaos.", isEndingPath: true, trophyId: "time_traveler", endingTopBadge: "⏳ Legendary: Time Traveler", statHintsUp: ["intelligence","curiosity","knowledge"], statHintsDown: ["discipline"], hintText: "Genius + curiosity… with a little chaos." },
  { id: "kid_asteroid_tycoon", track: "kid", category: "Ending Paths", emoji: "☄️", title: "Asteroid Tycoon", description: "Space + business + persistence.", isEndingPath: true, trophyId: "asteroid_tycoon", endingTopBadge: "☄️ Legendary: Asteroid Tycoon", statHintsUp: ["intelligence","discipline","knowledge","curiosity"], statHintsDown: [], hintText: "Space + business + persistence." },
  { id: "kid_blockcraft2", track: "kid", category: "Ending Paths", emoji: "🧱", title: "Blockcraft 2 Creator", description: "Ship it. Improve it. Ship it again.", isEndingPath: true, trophyId: "blockcraft_2", endingTopBadge: "🧱 Special: Blockcraft 2", statHintsUp: ["creativity","intelligence","discipline","confidence"], statHintsDown: [], hintText: "Ship it. Improve it. Ship it again." },
  { id: "kid_nobel_tier", track: "kid", category: "Ending Paths", emoji: "🧠", title: "Nobel‑Tier Scientist", description: "Quiet obsession, steady practice, and a notebook full of 'wait… what if?'", isEndingPath: true, trophyId: "nobel_tier_scientist", endingTopBadge: "🏆 Legendary: Nobel‑Tier Scientist", statHintsUp: ["intelligence","knowledge","discipline","curiosity"], statHintsDown: [], hintText: "Quiet obsession, steady practice, and a notebook full of 'wait… what if?'" },
  { id: "kid_olympian", track: "kid", category: "Ending Paths", emoji: "🏅", title: "Olympic Medalist", description: "Talent helps. Routine wins. And yes, your house will smell like sports equipment.", isEndingPath: true, trophyId: "olympic_medalist", endingTopBadge: "🏆 Legendary: Olympic Medalist", statHintsUp: ["fitness","discipline","confidence","happiness"], statHintsDown: [], hintText: "Talent helps. Routine wins. And yes, your house will smell like sports equipment." },
  { id: "kid_peacemaker", track: "kid", category: "Ending Paths", emoji: "🕊️", title: "Peacemaker Diplomat", description: "A rare build: brave enough to speak, kind enough to listen.", isEndingPath: true, trophyId: "peacemaker", endingTopBadge: "🏆 Legendary: Peacemaker", statHintsUp: ["empathy","social","confidence","discipline"], statHintsDown: [], hintText: "A rare build: brave enough to speak, kind enough to listen." },
  { id: "kid_media_mogul", track: "kid", category: "Ending Paths", emoji: "📺", title: "Media Mogul", description: "Attention is a currency. Your kid learns to mint it.", isEndingPath: true, trophyId: "media_mogul", endingTopBadge: "🏆 Legendary: Media Mogul", statHintsUp: ["social","confidence","intelligence","discipline"], statHintsDown: [], hintText: "Attention is a currency. Your kid learns to mint it." },
  { id: "kid_kingmaker", track: "kid", category: "Ending Paths", emoji: "🗳️", title: "Kingmaker", description: "They don't need the crown to run the kingdom.", isEndingPath: true, trophyId: "kingmaker", endingTopBadge: "🏆 Legendary: Kingmaker", statHintsUp: ["intelligence","social","confidence","discipline"], statHintsDown: [], hintText: "They don't need the crown to run the kingdom." },
  { id: "kid_meme_icon", track: "kid", category: "Ending Paths", emoji: "🤡", title: "Accidental Meme Icon", description: "One weird moment. One camera. The internet does the rest.", isEndingPath: true, trophyId: "meme_icon", endingTopBadge: "✨ Special: Meme Icon", statHintsUp: ["creativity","social","confidence"], statHintsDown: ["discipline"], hintText: "One weird moment. One camera. The internet does the rest." },
  { id: "kid_dynasty_builder", track: "kid", category: "Ending Paths", emoji: "🏰", title: "Dynasty Builder", description: "Generational wealth, but with bedtime stories and receipts.", isEndingPath: true, trophyId: "dynasty_builder", endingTopBadge: "🏆 Legendary: Dynasty Builder", statHintsUp: ["intelligence","discipline","confidence"], statHintsDown: [], hintText: "Generational wealth, but with bedtime stories and receipts." },
  { id: "kid_supervillain_path", track: "kid", category: "Ending Paths", emoji: "😈", title: "Supervillain", description: "The classic route: brilliance, confidence… and absolutely no remorse.", isEndingPath: true, trophyId: "supervillain_arc", endingTopBadge: "🧨 Legendary: Supervillain Arc", statHintsUp: ["intelligence","confidence","knowledge"], statHintsDown: ["empathy"], hintText: "The classic route: brilliance, confidence… and absolutely no remorse." },
  { id: "kid_world_destroyer", track: "kid", category: "Ending Paths", emoji: "🧟", title: "World Destroyer (Zombie Virus)", description: "A dark path: brilliance without compassion. (Fictional.)", isEndingPath: true, trophyId: "world_destroyer", endingTopBadge: "🧟 Secret: World Destroyer", statHintsUp: ["intelligence","knowledge"], statHintsDown: ["empathy"], hintText: "A dark path: brilliance without compassion. (Fictional.)" },

  // Adult-focused goals (existing)
  { id: "adult_wealth", track: "adult", category: "Money", emoji: "💰", title: "Financial Freedom", description: "Prioritize money milestones (save/grow wealth)." },
  { id: "adult_career", track: "adult", category: "Money", emoji: "💼", title: "Career Climber", description: "Prioritize career growth milestones." },
  { id: "adult_home", track: "adult", category: "Money", emoji: "🏡", title: "Homeowner Path", description: "Prioritize owning a home + stability milestones." },
  { id: "adult_love", track: "adult", category: "Relationships", emoji: "💝", title: "Love Story", description: "Prioritize relationship/love growth milestones." },
  { id: "adult_calm", track: "adult", category: "Well-being", emoji: "🧘", title: "Calm Household", description: "Prioritize low-stress milestones." },
  { id: "adult_travel", track: "adult", category: "Lifestyle", emoji: "🌍", title: "Travel & Memories", description: "Prioritize passport stamps milestones." },
  { id: "adult_pets", track: "adult", category: "Lifestyle", emoji: "🐾", title: "Pet Family", description: "Prioritize pet milestones." },
  { id: "adult_books", track: "adult", category: "Learning", emoji: "📚", title: "Bookworm Home", description: "Prioritize bookshelf milestones." },
  { id: "adult_fame", track: "adult", category: "Power", emoji: "✅", title: "Influencer Arc", description: "Prioritize follower milestones." },

  // Adult-focused goals (new)
  { id: "adult_business_builder", track: "adult", category: "Money", emoji: "🏗️", title: "Build a Business", description: "Start something of your own and grow it." },
  { id: "adult_political_rise", track: "adult", category: "Power", emoji: "🗳️", title: "Political Rise", description: "Campaign, win, and keep your approval afloat." },
  { id: "adult_community_giver", track: "adult", category: "Community", emoji: "🩸", title: "Community Giver", description: "Give back consistently — donations, drives, and quiet help." },
  { id: "adult_lifelong_learner", track: "adult", category: "Learning", emoji: "📚", title: "Lifelong Learner", description: "Keep learning as you parent — study points and new tools." },
  { id: "adult_clean_record", track: "adult", category: "Risk", emoji: "🧾", title: "Clean Record", description: "Stay out of legal trouble. Zero heat. Zero record." },
  { id: "adult_underworld_operator", track: "adult", category: "Risk", emoji: "🕶️", title: "Underworld Operator", description: "If you're going to do crime, do it \"professionally.\"" },
  { id: "adult_game_collector", track: "adult", category: "Hobbies", emoji: "🎮", title: "Game Night Legend", description: "Collect games and make memories — the shelf grows." },
  { id: "adult_emergency_fund", track: "adult", category: "Money", emoji: "🪙", title: "Emergency Fund", description: "Build a cushion so surprises don't wreck you." },
  { id: "adult_investor", track: "adult", category: "Money", emoji: "📈", title: "Investor Mindset", description: "Grow money long-term. Think in years, not paychecks." },
  { id: "adult_property_tycoon", track: "adult", category: "Money", emoji: "🏘️", title: "Property Tycoon", description: "Buy property and turn it into steady income." },
  { id: "adult_globetrotter", track: "adult", category: "Lifestyle", emoji: "🌍", title: "Globetrotter", description: "Collect stamps and stories. Travel with intention." },
  { id: "adult_pet_sanctuary", track: "adult", category: "Lifestyle", emoji: "🐾", title: "Pet Sanctuary", description: "Adopt and care for multiple pets — your house becomes a zoo." },
  { id: "adult_personal_library", track: "adult", category: "Learning", emoji: "📖", title: "Personal Library", description: "Keep reading. Keep learning. Keep stacking books." },
  { id: "adult_family_harmony", track: "adult", category: "Relationships", emoji: "🏡", title: "Family Harmony", description: "Keep love rising and stress under control." },
  { id: "adult_career_peak", track: "adult", category: "Money", emoji: "🚀", title: "Career Peak", description: "Keep your career moving up while parenting." },
  { id: "adult_influencer_empire", track: "adult", category: "Power", emoji: "📣", title: "Influencer Empire", description: "Turn attention into influence — followers and reputation." },
];

export const LIFE_GOALS_BY_ID = Object.fromEntries(LIFE_GOALS.map(g => [g.id, g]));

// default: 3 aligned milestone completions completes a goal
export function getLifeGoalTarget(goalId) {
  return 3;
}

const KID_GOAL_STAT_KEYS = {
  kid_scholar: new Set(["intelligence", "knowledge"]),
  kid_confident: new Set(["confidence"]),
  kid_kind: new Set(["empathy"]),
  kid_disciplined: new Set(["discipline", "responsibility"]),
  kid_happy: new Set(["happiness"]),
  kid_creative: new Set(["creativity", "curiosity"]),
  kid_athlete: new Set(["fitness"]),
  kid_healthy_habits: new Set(["health"]),
  kid_social_butterfly: new Set(["social"]),
  kid_leader: new Set(["confidence", "responsibility", "social"]),
  kid_explorer: new Set(["curiosity", "fitness"]),
  kid_helper: new Set(["responsibility", "empathy"]),
  kid_maker: new Set(["creativity", "discipline"]),
};

export function isKidQuestAlignedWithGoal(quest, goalId) {
  if (!quest || !goalId) return false;
  const metric = quest.metric || {};
  const type = metric.type;
  const statKey = metric.statKey;

  // Special case: kid_resilient aligns with anxiety reduction OR confidence/discipline/happiness growth
  if (goalId === "kid_resilient") {
    if (type === "stat_below" && statKey === "anxiety") return true;
    if ((type === "stat_increase" || type === "stat_threshold") && ["confidence", "discipline", "happiness"].includes(statKey)) return true;
    return false;
  }

  // Kid quests are currently stat-threshold / stat-increase focused
  if (type !== "stat_threshold" && type !== "stat_increase") return false;

  const allowed = KID_GOAL_STAT_KEYS[goalId];
  if (!allowed) return false;
  return allowed.has(String(statKey || ""));
}

export function isAdultQuestAlignedWithGoal(quest, goalId) {
  if (!quest || !goalId) return false;
  const metric = quest.metric || {};
  const type = metric.type;

  switch (goalId) {
    // Existing goals
    case "adult_wealth":
      return type === "money_total" || type === "money_increase";
    case "adult_career":
      return type === "career_progress";
    case "adult_home":
      return type === "buy_and_rent_house" || type === "own_house_and_cash";
    case "adult_love":
      return type === "love_increase";
    case "adult_calm":
      return type === "stress_below";
    case "adult_travel":
      return type === "passport_stamps_count";
    case "adult_pets":
      return type === "pets_count";
    case "adult_books":
      return type === "bookshelf_count";
    case "adult_fame":
      return type === "social_followers_total";
    
    // New goals
    case "adult_business_builder":
      return type === "business_started" || type === "business_income_per_year";
    case "adult_political_rise":
      return type === "politics_office_held" || type === "politics_approval_threshold" || type === "politics_warchest_total";
    case "adult_community_giver":
      return type === "donations_total";
    case "adult_lifelong_learner":
      return type === "study_points_total";
    case "adult_clean_record":
      return type === "adult_crime_record_below" || type === "adult_crime_heat_below";
    case "adult_underworld_operator":
      return type === "adult_crime_skill_threshold" || type === "adult_crime_crew_threshold";
    case "adult_game_collector":
      return type === "game_shelf_count";
    case "adult_emergency_fund":
      return type === "money_total";
    case "adult_investor":
      return type === "money_total";
    case "adult_property_tycoon":
      return type === "buy_and_rent_house" || type === "own_house_and_cash";
    case "adult_globetrotter":
      return type === "passport_stamps_count";
    case "adult_pet_sanctuary":
      return type === "pets_count";
    case "adult_personal_library":
      return type === "bookshelf_count";
    case "adult_family_harmony":
      return type === "love_increase" || type === "stress_below";
    case "adult_career_peak":
      return type === "career_progress";
    case "adult_influencer_empire":
      return type === "social_followers_total";
    
    default:
      return false;
  }
}

export function isKidQuestAlignedWithGoals(quest, goalIds = []) {
  const ids = Array.isArray(goalIds) ? goalIds : [];
  return ids.some(id => isKidQuestAlignedWithGoal(quest, id));
}

export function isAdultQuestAlignedWithGoals(quest, goalIds = []) {
  const ids = Array.isArray(goalIds) ? goalIds : [];
  return ids.some(id => isAdultQuestAlignedWithGoal(quest, id));
}

export function getAlignedGoalIdsForQuest(quest, goalIds = [], track = "adult") {
  const ids = Array.isArray(goalIds) ? goalIds : [];
  if (track === "kid") return ids.filter(id => isKidQuestAlignedWithGoal(quest, id));
  return ids.filter(id => isAdultQuestAlignedWithGoal(quest, id));
}