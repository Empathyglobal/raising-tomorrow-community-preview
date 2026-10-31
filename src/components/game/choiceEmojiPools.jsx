export const CHOICE_EMOJI_POOLS = {
  connect: ["💛", "🫂", "🌿", "🧸", "🧡", "🤝", "🌈", "🫶", "✨", "🥺", "🕯️"],
  teach: ["🧠", "📚", "📝", "🧩", "🔍", "🧪", "📏", "🗂️", "🧾", "🧭", "🛠️"],
  boundary: ["🧱", "🛑", "🚧", "📵", "⛔", "🔒", "🧯", "🧊", "🪧", "⚖️", "📌"],
  avoid: ["🫥", "🙈", "😶‍🌫️", "🧺", "🛋️", "📺", "🍪", "🌀", "🤷", "🧻", "🧸"],
  harm: ["😡", "💥", "🗯️", "🔥", "👎", "😤", "🧨", "⚡", "🚫", "📣", "🧊🗣️"]
};

// Optional: some topic hints to pick a more “on-theme” emoji.
// Keep it intentionally small and safe; it’s a nudge, not a full classifier.
export const TOPIC_EMOJI_HINTS = [
  { pattern: /homework|school|teacher|grade|test|quiz/i, emojis: ["📚", "📝", "📏", "🧠"] },
  { pattern: /screen|phone|tablet|gaming|social/i, emojis: ["📵", "📱", "🎮", "🛑"] },
  { pattern: /sleep|bedtime|night/i, emojis: ["🛏️", "🌙", "🕯️"] },
  { pattern: /friend|peer|bully|social/i, emojis: ["🤝", "🫂", "💬"] },
  { pattern: /money|allowance|buy|shop/i, emojis: ["💸", "🧾", "🪙"] },
  { pattern: /food|eat|snack/i, emojis: ["🍎", "🍪", "🥗"] }
];