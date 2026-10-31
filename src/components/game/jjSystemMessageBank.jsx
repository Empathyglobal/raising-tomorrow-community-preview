// Juvenile Justice System Messaging Bank

// Simple seeded pick helper
function hashString(str) {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededPick({ runSeed = "seed", key = "", list = [] }) {
  const arr = Array.isArray(list) ? list : [];
  if (!arr.length) return null;
  const seed = hashString(`${runSeed}|${key}`);
  const rng = mulberry32(seed);
  const idx = Math.floor(rng() * arr.length);
  return arr[idx];
}

export function jjOffenseLabel(offenseId) {
  const id = String(offenseId || "").toLowerCase();
  if (!id) return "an incident";
  if (id.includes("theft") || id.includes("shoplift")) return "theft";
  if (id.includes("vandal") || id.includes("tag")) return "vandalism";
  if (id.includes("online") || id.includes("cyber") || id.includes("social")) return "online mess";
  if (id.includes("school") || id.includes("campus") || id.includes("teacher")) return "school incident";
  if (id.includes("trespass") || id.includes("trespassing")) return "trespass";
  return "an incident";
}

const JJ_SYSTEM_EVENT_POOLS = {
  diversion_start: {
    log: [
      "⚖️ Diversion begins ({years}yr): congrats, you now co‑parent with a clipboard.",
      "⚖️ Diversion ({years}yr): accountability, but make it paperwork.",
      "⚖️ Diversion ({years}yr): your calendar just got a parole‑officer vibe.",
      "⚖️ Diversion ({years}yr): adults said “learning opportunity” and meant it aggressively.",
      "⚖️ Diversion ({years}yr): check‑ins, checklists, and deep sighs unlocked.",
      "⚖️ Diversion ({years}yr): the system is watching. (So are you. Forever.)",
      "⚖️ Diversion ({years}yr): second chance… with conditions.",
      "⚖️ Diversion ({years}yr): {childName} meets consequences’ less‑fun cousin: compliance."
    ],
    toast: [
      "⚖️ Diversion starts next year.",
      "⚖️ Diversion assigned. Rules incoming.",
      "⚖️ Diversion: paperwork arc unlocked."
    ],
    body: [
      "Diversion starts next year. It’s meetings, check‑ins, and adults using phrases like “restorative plan” with a straight face. {childName} acts annoyed, but the edges of their confidence look shakier than usual. This can be a reset—or a rebellion—depending on what happens at home.",
      "The system offers diversion instead of deeper consequences. Translation: you get a chance to turn this into repair before it becomes a record. {childName} hates being watched… and also needs structure right now. Your job is to keep it firm without turning your house into a courtroom.",
      "Diversion is assigned for {offenseLabel}. The rules are boring on purpose: check‑ins, curfews, and “no new incidents.” {childName} calls it unfair; the paperwork calls it a second chance. Second chances still cost effort.",
      "Diversion begins ({years} year(s)). Appointments appear on your calendar like jump scares. {childName} treats it like a joke; the adults do not. The path is narrow, but it’s still a path out."
    ]
  },

  hall_sentence: {
    log: [
      "⚖️ Juvenile Hall next year ({years}yr): the system just hit ‘escalate.’",
      "⚖️ Hall sentence: {years} year(s). The room gets quiet in a way you feel in your teeth.",
      "⚖️ Hall ({years}yr): fluorescent lights, metal detectors, real consequences.",
      "⚖️ Hall sentence: {years} year(s). You’d trade every lecture for a time machine.",
      "⚖️ Hall ({years}yr): strangers enforce rules your kid didn’t think were real.",
      "⚖️ Hall ({years}yr): this is the part that’s not a story anymore.",
      "⚖️ Hall ({years}yr): the adults stop asking nicely.",
      "⚖️ Hall ({years}yr): your stomach drops. Your face has to stay steady."
    ],
    toast: [
      "⚖️ Juvenile Hall sentence assigned.",
      "⚖️ Hall begins next year.",
      "⚖️ Hall: consequences escalated."
    ],
    body: [
      "The case escalates to Juvenile Hall starting next year—{years} year(s). It isn’t dramatic like movies; it’s procedural and heavy. {childName} tries to act tough, but you can see the fear behind the performance. Your job becomes: show up, keep structure, and rebuild trust one unglamorous day at a time.",
      "A hall sentence is handed down. Not because your kid is irredeemable, but because the pattern got bigger than the adults could ignore. The next chapter is structure, supervision, and steady support—especially when {childName} pretends they don’t want it.",
      "Juvenile Hall begins next year ({years} year(s)). You sign papers you never wanted to learn exist. {childName} oscillates between rage and shutdown. The system is loud; your steadiness has to be louder."
    ]
  },

  probation_start: {
    log: [
      "🧾 Probation begins: freedom with receipts.",
      "🧾 Probation starts: curfews, check‑ins, and ‘don’t make it weird’ energy.",
      "🧾 Probation: supervised breathing. (Kidding. Mostly.)",
      "🧾 Probation begins: the rules are now someone’s job."
    ],
    toast: [
      "🧾 Probation begins.",
      "🧾 Probation started.",
      "🧾 New rules: probation."
    ],
    body: [
      "Probation begins. It’s less dramatic than hall and more relentless: check‑ins, conditions, and a lot of chances to prove stability. {childName} wants it to be over; the system wants it to be consistent.",
      "Probation starts now. This is the ‘prove it’ phase: routines, boundaries, and fewer chaos windows. It’s annoying on purpose—and it can work if home stays steady."
    ]
  },

  diversion_complete: {
    log: [
      "✅ Diversion completed. Probation begins (still supervised, just less fluorescent).",
      "✅ Diversion ends. Next: probation—because the system loves sequels.",
      "✅ Diversion complete. You don’t celebrate loudly. You celebrate carefully."
    ],
    toast: [
      "✅ Diversion completed.",
      "✅ Diversion done.",
      "✅ Diversion ends — probation begins."
    ],
    body: [
      "Diversion completes, and probation begins. This is the long, quiet part: keep routines boring, expectations clear, and support consistent. The goal is stability, not perfection.",
      "Diversion wraps up. Probation starts as the follow‑through chapter—less about punishment and more about proving the pattern really changed."
    ]
  },

  hall_release: {
    log: [
      "🔓 Released from Juvenile Hall. Probation begins (freedom with receipts).",
      "🔓 Hall ends. Probation begins. Everyone exhales… carefully.",
      "🔓 Released: home again, but with rules attached."
    ],
    toast: [
      "🔓 Released from Hall — probation begins.",
      "🔓 Hall ends. Probation starts.",
      "🔓 Release: probation begins."
    ],
    body: [
      "Juvenile Hall ends, and probation begins. Home feels different—both softer and more fragile. {childName} needs warmth and structure at the same time, even if they pretend otherwise.",
      "Release day arrives. The next phase is probation: check‑ins, rules, and rebuilding trust without pretending nothing happened."
    ]
  },

  probation_end: {
    log: [
      "🕊️ Probation ends. Free and clear… now the choices are just choices.",
      "🕊️ Probation over. No more check‑ins. You still keep the structure.",
      "🕊️ Probation ends. You don’t jinx it by cheering too loudly."
    ],
    toast: [
      "🕊️ Probation ended.",
      "🕊️ Free and clear.",
      "🕊️ Probation complete."
    ],
    body: [
      "Probation ends. There’s relief—and also the reality that structure still matters. The system steps back; your consistency stays.",
      "Probation finishes. This is the clean‑slate feeling everyone wanted—earned the boring way, day by day."
    ]
  }
};

export function getJJSystemEventText({ eventType, runSeed = "seed", age = 0, childName = "your child", years = 0, offenseId = null, severityTier = null, record = null }) {
  const pools = JJ_SYSTEM_EVENT_POOLS[eventType] || null;
  const offenseLabel = jjOffenseLabel(offenseId);
  const vars = { years, childName, offenseLabel, age, severityTier, record };
  const fill = (s) => String(s || "").replaceAll("{years}", String(years)).replaceAll("{childName}", String(childName)).replaceAll("{offenseLabel}", String(offenseLabel));

  if (!pools) {
    const line = "⚖️ System update.";
    return { logLine: line, toastLine: null, resultBody: line, timelineTitle: "⚖️ System update", timelineDetail: line };
  }

  const logLine = fill(seededPick({ runSeed, key: `${eventType}|log|age:${age}`, list: pools.log }) || pools.log[0]);
  const toastLine = fill(seededPick({ runSeed, key: `${eventType}|toast|age:${age}`, list: pools.toast }) || pools.toast?.[0] || null);
  const resultBody = fill(seededPick({ runSeed, key: `${eventType}|body|age:${age}`, list: pools.body }) || pools.body[0]);

  // Timeline titles
  const titles = {
    diversion_start: "⚖️ Diversion Assigned",
    hall_sentence: "⚖️ Juvenile Hall Sentence",
    probation_start: "🧾 Probation Begins",
    diversion_complete: "✅ Diversion Completed",
    hall_release: "🔓 Hall Release",
    probation_end: "🕊️ Probation Ended"
  };

  const timelineTitle = titles[eventType] || "⚖️ System Update";
  const timelineDetail = resultBody;

  return { logLine, toastLine, resultBody, timelineTitle, timelineDetail };
}