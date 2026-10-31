// Teen special scenario: Coming out (3% chance per year, ages 14–18, once per run)

export const TEEN_COMING_OUT_SCENARIO_ID = "teen_coming_out";

function rand01(rng) {
  return typeof rng === 'function' ? rng() : Math.random();
}

function getKidName(state) {
  return state?.childName || state?.childProfile?.name || "your kid";
}

function getKidGenderLabel(state) {
  const raw = state?.childAvatarGender || state?.childProfile?.gender || "";
  return String(raw || "").trim().toLowerCase();
}

function pickIdentity(state, rng) {
  const gender = getKidGenderLabel(state);
  const isGirl = gender.includes("girl") || gender === "female";
  const isBoy = gender.includes("boy") || gender === "male";

  // Weighted: mostly orientation, sometimes trans
  const roll = rand01(rng);
  const pickTrans = roll < 0.35;

  if (pickTrans) {
    let line = "I think I'm trans.";
    if (isBoy) line = "I think I'm trans… I don't feel like a boy.";
    if (isGirl) line = "I think I'm trans… I don't feel like a girl.";

    return {
      id: "trans",
      kind: "gender",
      label: "trans",
      comingOutLine: line,
    };
  }

  const term = isGirl ? "lesbian" : "gay";
  return {
    id: term,
    kind: "orientation",
    label: term,
    comingOutLine: `I think I'm ${term}.`,
  };
}

function isForcedByUrl() {
  if (typeof window === "undefined") return false;
  try {
    const qs = new URLSearchParams(window.location.search || "");
    const forced = qs.get("forceScenario") || qs.get("forceEvent") || "";
    return forced === TEEN_COMING_OUT_SCENARIO_ID;
  } catch {
    return false;
  }
}

export function buildTeenComingOutScenario(state, identity) {
  const kidName = getKidName(state);

  const scenarioText =
    `It's late. ${kidName} hovers in the doorway like they're about to ask for permission to breathe.\n\n` +
    `They finally whisper: "Can we talk?"\n\n` +
    `Then, with their eyes locked on a spot on the floor: "${identity.comingOutLine}"\n\n` +
    `The room goes weirdly quiet. Even the fridge sounds judgmental.\n\n` +
    `How do you respond?`;

  return {
    id: TEEN_COMING_OUT_SCENARIO_ID,
    scenarioText,
    hookText: `${kidName} needs to tell you something important.`,
    meta: {
      identity,
      category: "identity",
      band: "14-18"
    },
    choices: [
      {
        letter: "A",
        emoji: "❤️",
        text: "Accept them unconditionally",
        consequence:
          `You don't make it a debate. You make it a home.\n\n` +
          `You tell them you love them, full stop. Their shoulders drop like they've been carrying a backpack of bricks.\n\n` +
          `For the first time in a while, they look at you instead of past you.`,
        deltas: {},
        loveDelta: 5,
        confidenceDelta: 5,
        stressDelta: 0,
        role: "connect"
      },
      {
        letter: "B",
        emoji: "🔧",
        text: "Do your best to fix them",
        consequence:
          `You start talking fast—plans, fixes, "this is just a phase," anything to make the feeling go away.\n\n` +
          `Their face shuts down in real time. You can almost hear a door lock from the inside.\n\n` +
          `You don't "solve" anything. You just teach them it isn't safe to be honest with you.`,
        deltas: {},
        loveDelta: -5,
        confidenceDelta: -5,
        stressDelta: 10,
        role: "harm"
      },
      {
        letter: "C",
        emoji: "🙈",
        text: "Pretend you didn't hear them",
        consequence:
          `You nod like you heard the weather report and change the subject.\n\n` +
          `They stop trying to meet you where you refused to stand.\n\n` +
          `Nothing is resolved—only stored. And storage always leaks.`,
        deltas: {},
        loveDelta: -5,
        confidenceDelta: 0,
        stressDelta: 10,
        role: "avoid"
      }
    ]
  };
}

export function maybeGetTeenComingOutScenario(state, rngFn) {
  const oneOffs = state?.oneOffs || {};
  const alreadyDone = !!oneOffs?.teenComingOutDone;

  // Debug forcing (for QA): ?forceScenario=teen_coming_out
  const forced = isForcedByUrl();
  if (forced && !alreadyDone) {
    const identity = pickIdentity(state, rngFn);
    return buildTeenComingOutScenario(state, identity);
  }

  const age = state?.currentYear;
  if (age == null || age < 14 || age > 18) return null;
  if (alreadyDone) return null;

  // 3% chance per year
  const roll = rand01(rngFn);
  if (roll >= 0.03) return null;

  const identity = pickIdentity(state, rngFn);
  return buildTeenComingOutScenario(state, identity);
}

export function applyTeenComingOutChoice(state, scenario, choice) {
  if (!state || !scenario) return;

  if (!state.oneOffs) state.oneOffs = {};
  if (state.oneOffs.teenComingOutDone) return; // safety: never apply twice

  const age = state?.currentYear;
  const identity = scenario?.meta?.identity || null;

  state.oneOffs.teenComingOutDone = true;
  state.oneOffs.teenComingOut = {
    age: age,
    identityId: identity?.id || null,
    identityLabel: identity?.label || null,
    identityKind: identity?.kind || null,
    response: choice.letter,
    recordedAt: Date.now(),
  };

  // Add to trauma events for outcome engine
  if (!Array.isArray(state.childTraumaEvents)) state.childTraumaEvents = [];
  
  const evtId =
    choice.letter === "A"
      ? "teen_coming_out_supported"
      : choice.letter === "B"
      ? "teen_coming_out_rejected"
      : "teen_coming_out_ignored";

  // This is now handled by the main scenario finalizer in Game.jsx, which
  // will call maybeTraumaFromScenario. This prevents duplicate trauma logic.
}