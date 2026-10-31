// Heuristics for choosing a Storybook header illustration (MOMENT_HEADERS keys).
// Keep outputs limited to keys defined in imageMap.jsx MOMENT_HEADERS.

const RULES = [
  { key: "birthday", re: /\bbirthday\b|cake|party/i },
  { key: "bedtime", re: /sleep|bedtime|night|dream|tired/i },
  { key: "rainy_day", re: /rain|storm|wet|umbrella|mud|puddle/i },
  { key: "chores", re: /laundry|chores|clean|tidy|mess|dishes|vacuum/i },
  { key: "cooking", re: /cook|bake|kitchen|cookie|dinner|snack/i },
  { key: "grocery", re: /grocery|market|shopping cart|store|produce|veggies/i },
  { key: "beach_trip", re: /beach|ocean|sand|seaside/i },
  { key: "camping", re: /camp|tent|campfire|hike|trail/i },
  { key: "school_day", re: /school|teacher|homework|bus|class|test|grade/i },
  { key: "playdate", re: /playdate|park|friend|friends|play/i },
];

const PACK_MAP = {
  screen_time: "bedtime",
  school_anxiety: "school_day",
  siblings: "chores",
  teen_autonomy: "school_day",
  coparent_together: "home", // will fall through to null (no such key) unless text matches
  coparent_separated: "home",
  modern_parenting: "home",
  modern_parenting_early: "bedtime",
};

export function inferMomentHeaderKey(text) {
  const t = String(text || "");
  for (const r of RULES) {
    if (r.re.test(t)) return r.key;
  }
  return null;
}

export function inferMomentHeaderKeyFromScenario(scenario, extraText = "") {
  const pack = scenario?.meta?.choicePack;
  if (pack && PACK_MAP[pack]) {
    const k = PACK_MAP[pack];
    // Only return it if it exists in our RULES list; otherwise keep inferring.
    if (RULES.some(r => r.key === k)) return k;
  }

  const choiceText = (scenario?.choices || [])
    .map(c => `${c?.text || ""} ${c?.consequence || ""}`)
    .join(" ");

  const all = [
    scenario?.title || "",
    scenario?.prompt || "",
    extraText || "",
    choiceText || "",
  ].join(" ");

  return inferMomentHeaderKey(all);
}