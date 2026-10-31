// School Confidence & Anxiety (Viral Pack v2)
// Loader + selector for age-based scenarios and simple fallback content

import age5 from "./schoolConfidenceAnxietyV2/sca_age_5";
import age7 from "./schoolConfidenceAnxietyV2/sca_age_7";
import age10 from "./schoolConfidenceAnxietyV2/sca_age_10";
import age12 from "./schoolConfidenceAnxietyV2/sca_age_12";
import age14 from "./schoolConfidenceAnxietyV2/sca_age_14";

export const SCA_V2_TRIGGER_AGES = [5, 7, 10, 12, 14];

const AGE_MAP = {
  5: age5 || [],
  7: age7 || [],
  10: age10 || [],
  12: age12 || [],
  14: age14 || [],
};

// Dev-only sanity check for pool sizes
if (import.meta?.env?.DEV) {
  for (const a of [5,7,10,12,14]) {
    const n = (AGE_MAP[a] || []).length;
    if (n !== 10) console.warn(`[SCAv2] Age ${a} pool size = ${n} (expected 10)`);
  }
}

function fallbackScenario(age) {
  return {
    id: `sca_fallback_${age}`,
    title: "A school confidence moment",
    body: "A small situation at school needs your guidance.",
    choices: [
      { key: "A", text: "Validate feelings first", effects: { CONF: 0.5, ANX: -0.5, BOND: 0.5 }, flags: [] },
      { key: "B", text: "Role-play what to say next time", effects: { IND: 0.5, CONF: 0.2 }, flags: [] },
      { key: "C", text: "Email the teacher immediately", effects: { IND: -0.2, CONF: -0.2, SOC: 0.2 }, flags: [] },
      { key: "D", text: "Avoid talking about it", effects: { ANX: 0.5 }, flags: ["AvoidancePlusOne"] },
    ],
  };
}

export function getAgePool(age) {
  if (import.meta?.env?.DEV) {
    for (const a of [5,7,10,12,14]) {
      const n = (AGE_MAP[a] || []).length;
      if (n !== 10) console.warn(`[SCAv2] Age ${a} pool size = ${n} (expected 10)`);
    }
  }
  const a = Number(age) || 0;
  return Array.isArray(AGE_MAP[a]) ? AGE_MAP[a] : [];
}

export function pickScaV2ScenarioForAge(age, usedScenarioIds = [], seed = "") {
  const pool = getAgePool(age);
  const candidates = pool.filter((s) => s && s.id && !usedScenarioIds.includes(s.id));
  const list = candidates.length ? candidates : [];

  if (list.length === 0) {
    const fb = fallbackScenario(age);
    if (!usedScenarioIds.includes(fb.id)) return fb;
    return null;
  }

  // Deterministic-ish pick by seed+age
  const key = `${seed}|sca_v2|${age}|${list.length}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = ((h << 5) - h) + key.charCodeAt(i) | 0;
  const idx = Math.abs(h) % list.length;
  return list[idx];
}