
// src/components/game/achievements.js
import { LIFE_GOALS } from '@/components/content/lifeGoalsPack';

export const ACHIEVEMENTS = [
  { id: "first_year", title: "First Year", description: "Make it through the first year.", icon: "👶" },
  { id: "age_5", title: "High Five", description: "Reach age 5.", icon: "✋" },
  { id: "age_10", title: "Double Digits", description: "Reach age 10.", icon: "🔟" },
  { id: "age_18", title: "Grown Up", description: "Reach age 18.", icon: "🎓" },
  { id: "wealth_builder", title: "Wealth Builder", description: "Save $10,000.", icon: "💰" },
  { id: "scholar", title: "Scholar", description: "Reach exceptionally high intelligence.", icon: "🧠" },
  
  // Life Goals achievements
  { id: "goal_setter", title: "Goal Setter", description: "Choose at least one Life Goal.", icon: "🌱" },
  { id: "goal_first_progress", title: "Goal Chaser", description: "Make progress on a Life Goal by completing an aligned Milestone.", icon: "🎯" },
  
  // Goal completion achievements (generated for each life goal)
  ...LIFE_GOALS.map(goal => ({
    id: `goal_complete_${goal.id}`,
    title: `Goal Achieved: ${goal.title}`,
    description: `Complete your Life Goal: ${goal.title}.`,
    icon: goal.emoji
  }))
];

export const ACHIEVEMENTS_BY_ID = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a])
);

export const FINANCE_COLLECTIBLES = [
  { id: "piggy_bank", title: "First Savings", description: "Save your first $100.", emoji: "🐖" },
  { id: "investment", title: "Investor", description: "Open an investment account.", emoji: "📈" },
  { id: "debt_free", title: "Debt Free", description: "Pay off all debts.", emoji: "💳" }
];
