import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Deterministic RNG (mulberry32) from a string seed
function seededRng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return (t & 0xffffffff) / 4294967296;
  };
}

function pick(rng, arr) {
  if (!arr?.length) return null;
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(rng, min, max) {
  const a = Math.min(min, max);
  const b = Math.max(min, max);
  return a + Math.floor(rng() * (b - a + 1));
}

// Fake mobile games catalogue (40)
const GAME_DEFS = [
  { name: "Tree Forest", reward: "gained {gold} gold and a ‘Rare Leaf’ (+{xp} XP)" },
  { name: "Gem Harbor", reward: "claimed {gems} gems and opened a ‘Mystery Clam’" },
  { name: "Idle Kingdom Tycoon", reward: "collected {gold} gold from your idle mines (offline for 12 minutes)" },
  { name: "Dungeon Snack Run", reward: "unlocked the ‘Crunchblade’ and earned {xp} XP" },
  { name: "Pixel Farm Forever", reward: "harvested 68 tomatoes and got {gold} coins for ‘daily chores’" },
  { name: "Rocket Pals Arena", reward: "won +{trophies} trophies and a ‘Common Crate’" },
  { name: "Mythic Merge Mania", reward: "merged 3 dragons into 1 and earned {xp} XP" },
  { name: "Candy Circuit", reward: "hit a ‘Sweet Combo’ and earned {gold} coins" },
  { name: "Drift Street Legends", reward: "earned {gold} credits and a ‘Weekend Boost’" },
  { name: "Cozy Castle Clicker", reward: "claimed {gold} gold and a ‘VIP Chest’ trial (3 minutes)" },
  { name: "Star Sail Sticker Club", reward: "pulled 1 ‘Ultra Shiny’ sticker and got {gems} gems" },
  { name: "Snack Battle Pass", reward: "earned {bpXp} Battle Pass XP and 1 ‘Free Tier’ emote" },
  { name: "Frog Detective Tycoon", reward: "collected {gold} coins and upgraded your tiny office to Level {level}" },
  { name: "Wizard Pocket Academy", reward: "learned ‘Spark 1’ and earned {xp} XP" },
  { name: "Chef Rush Universe", reward: "earned {gold} coins and unlocked ‘Onion Hat’" },
  { name: "Neon Ninja Runner", reward: "beat your score: {score} points and got {gold} coins" },
  { name: "Honeybee City Builder", reward: "placed 1 fountain and earned {gold} honey-coins" },
  { name: "Moonlight Gacha Parade", reward: "did 1 pull and got a ‘C+ Hero’ plus {gems} gems" },
  { name: "Ocean Pets Resort", reward: "leveled up your seahorse to Level {level}" },
  { name: "Tiny Train Empire", reward: "completed ‘Daily Track’ and earned {gold} bolts" },
  { name: "Match-3 Mountain", reward: "cleared Level {level} and got {gold} coins" },
  { name: "Haunted House Decor", reward: "unlocked ‘Spooky Lamp’ and earned {xp} XP" },
  { name: "Gladiator Thumb Wars", reward: "won a duel and gained +{trophies} trophies" },
  { name: "Astro Garden AR", reward: "caught 1 ‘Cosmic Seed’ and earned {gems} stardust" },
  { name: "Lootbox Lagoon", reward: "opened a chest and got 12 ‘Common Shards’" },
  { name: "Robot Laundry Simulator", reward: "completed ‘Wash Cycle’ and earned {gold} tokens" },
  { name: "Pirate Sandwich Quest", reward: "found the ‘Legendary Pickle Map’ (it’s useless)" },
  { name: "Snowball Royale Mini", reward: "placed Top 42 and got {gold} coins" },
  { name: "Cat Café Infinite", reward: "served 9 customers and earned {gold} tips" },
  { name: "Knight Tap Chronicles", reward: "crafted a ‘Rusty Epic Sword’ and earned {xp} XP" },
  { name: "Space Donut Delivery", reward: "delivered 3 donuts and got {gold} credits" },
  { name: "Ancient Puzzle Temple", reward: "solved a puzzle and earned {gems} crystals" },
  { name: "Dragon Sock Collector", reward: "collected 1 ‘Mythic Sock’ and {gold} lint-coins" },
  { name: "Karaoke Idol Clicker", reward: "gained +{fans} fans and unlocked ‘Auto-Tune Sparkle’" },
  { name: "Sticker Swap Stadium", reward: "traded 4 stickers and earned {gems} glitter" },
  { name: "Mini Golf Galaxy", reward: "set a new record: {score} strokes (somehow)" },
  { name: "Zombie Garden Defense", reward: "survived Wave {wave} and earned {gold} coins" },
  { name: "Coffee Quest Online", reward: "claimed your ‘Daily Bean’ and earned {xp} XP" },
  { name: "Tower of Tiny Hats", reward: "unlocked ‘Hat # {hatNum}’ and got {gold} coins" },
  { name: "Bento Box Blitz", reward: "hit a combo and earned {gold} coins + {gems} gems" }
];

const REFLECTIONS = [
  "You feel like you wasted your time.",
  "You close the app. The gold stays in the app… shocking.",
  "For a second it felt productive. It wasn’t.",
  "The rewards are impressive until you remember they’re not real.",
  "You got dopamine, not progress.",
  "Your thumb is stronger. Everything else is the same.",
  "You can’t pay rent with ‘rare leaf shards.’",
  "You wonder how 10 minutes turned into… whatever that was.",
  "It’s fun in the way chewing ice is fun.",
  "Your brain: ‘Nice.’ Your life: ‘Anyway…’",
  "You gained a lot of coins and absolutely no meaning.",
  "You feel 0.1 better… and 1.0 sillier."
];

const OBS_LINES = [
  "{childName} watched quietly as you played.",
  "{childName} hovered nearby, absorbing the lesson: phones win.",
  "{childName} saw you tapping like it mattered.",
  "{childName} asked, ‘Did you win?’ You said, ‘Kind of?’",
  "{childName} stared at the screen and learned what ‘busy’ looks like.",
  "{childName} noticed you smiling at fake rewards."
];

const EXTRA_TAGS = [
  "Achievement Unlocked: ‘Daily Reward Collector’",
  "Quest Complete: ‘Tap 200 Times’",
  "Streak Extended: Day {streakDay}",
  "Bonus: +{gems} gems (limited-time!)",
  "New Title: ‘Assistant Regional Champion’"
];

const RANGES = {
  gold: [800, 12000],
  gems: [5, 120],
  xp: [10, 450],
  trophies: [3, 48],
  bpXp: [20, 900],
  score: [1200, 98000],
  level: [2, 180],
  fans: [12, 3500],
  wave: [2, 60],
  hatNum: [2, 999],
  streakDay: [2, 400]
};

function fillTemplate(str, values) {
  let out = String(str || "");
  Object.entries(values).forEach(([k, v]) => {
    out = out.split(`{${k}}`).join(String(v));
  });
  return out;
}

export function buildPhoneGameMoment({ seed, childName }) {
  const rng = seededRng(String(seed || "seed"));
  const game = pick(rng, GAME_DEFS) || GAME_DEFS[0];

  const values = {
    gold: randInt(rng, ...RANGES.gold),
    gems: randInt(rng, ...RANGES.gems),
    xp: randInt(rng, ...RANGES.xp),
    trophies: randInt(rng, ...RANGES.trophies),
    bpXp: randInt(rng, ...RANGES.bpXp),
    score: randInt(rng, ...RANGES.score),
    level: randInt(rng, ...RANGES.level),
    fans: randInt(rng, ...RANGES.fans),
    wave: randInt(rng, ...RANGES.wave),
    hatNum: randInt(rng, ...RANGES.hatNum),
    streakDay: randInt(rng, ...RANGES.streakDay)
  };

  const rewardLine = fillTemplate(game.reward, values);
  const reflection = pick(rng, REFLECTIONS) || REFLECTIONS[0];
  const obsTmpl = pick(rng, OBS_LINES) || OBS_LINES[0];
  const observation = fillTemplate(obsTmpl, { childName });
  const tagTmpl = pick(rng, EXTRA_TAGS) || EXTRA_TAGS[0];
  const extraTag = fillTemplate(tagTmpl, { gems: values.gems, streakDay: values.streakDay });

  const gameLine = `You played ${game.name} and ${rewardLine}.`;
  const copyText = [
    observation,
    gameLine,
    reflection,
    "Stats: You: Stress -0.1 • " + childName + ": Discipline -0.1"
  ].join("\n");

  return {
    gameName: game.name,
    rewardLine,
    reflection,
    observation,
    extraTag,
    gameLine,
    copyText
  };
}

export default function PhoneGameMomentModal({ open, onClose, payload }) {
  if (!payload) return null;
  const { childName, gameName, rewardLine, reflection, observation, extraTag } = payload;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload.copyText || "");
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose?.(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Sparkle strip */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-pulse" />
          <div className="p-6">
            <div className="text-center mb-3">
              <div className="text-2xl mb-1">✨ Tiny Break ✨</div>
              <div className="text-[11px] inline-flex items-center gap-2 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">{extraTag}</div>
            </div>

            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <div> {observation} </div>
              <div> You played <span className="font-semibold">{gameName}</span> and {rewardLine}. </div>
              <div className="italic text-slate-600">{reflection}</div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              <div className="font-semibold mb-1">Stats</div>
              <div>- You: Stress -0.1</div>
              <div>- {childName}: Discipline -0.1</div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onCopy}>Copy</Button>
              <Button className="flex-1" onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}