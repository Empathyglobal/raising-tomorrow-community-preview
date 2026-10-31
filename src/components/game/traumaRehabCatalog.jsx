// Trauma Rehab Catalog
// BitLife-style "rehab" options adapted for this game's Family Patterns system.
// This is a game mechanic, not medical advice.

export const TRAUMA_REHAB_FOCUS_COST = 2;

export const PRESSURE_ICONS = {
  threat: '🛡️',
  shame: '🫥',
  chaos: '🌪️',
  role: '🔄'
};

export const PRESSURE_LABELS = {
  threat: 'Threat',
  shame: 'Shame',
  chaos: 'Chaos',
  role: 'Role'
};

export const TRAUMA_REHAB_METHODS = [
  {
    id: 'emdr',
    emoji: '👁️',
    name: 'EMDR Session',
    subtitle: 'Guided reprocessing for sticky threat memories.',
    cost: 900,
    baseChance: 0.52,
    fit: { threat: 3, shame: 1, chaos: 1, role: 0 },
    effects: { stressSuccess: -0.6, stressFail: 0.2, loveSuccess: 0.05, loveFail: 0 },
    flavor: {
      success: [
        'Something clicks. The memory loses its teeth.',
        'Your body stops reacting like it is still happening.'
      ],
      fail: [
        'You leave tired. The knot is still there... but you have mapped it.',
        'It feels intense. No change yet.'
      ]
    }
  },
  {
    id: 'hypnotherapy',
    emoji: '🌀',
    name: 'Hypnotherapy',
    subtitle: 'Trance + suggestion. Sometimes the brain finally unclenches.',
    cost: 650,
    baseChance: 0.34,
    fit: { threat: 1, shame: 3, chaos: 1, role: 0 },
    effects: { stressSuccess: -0.4, stressFail: -0.1, loveSuccess: 0.04, loveFail: 0 },
    flavor: {
      success: [
        'A story you have carried rewrites itself—quietly, gently.',
        'You wake up feeling oddly lighter, like a backpack was removed.'
      ],
      fail: [
        'You mostly think about how comfy the chair was.',
        'You have weirdly vivid dreams. No clear shift yet.'
      ]
    }
  },
  {
    id: 'somatic',
    emoji: '🫧',
    name: 'Somatic Release',
    subtitle: 'Body-first work: breath, shaking, grounding, safety cues.',
    cost: 500,
    baseChance: 0.42,
    fit: { threat: 2, shame: 0, chaos: 2, role: 0 },
    effects: { stressSuccess: -0.8, stressFail: -0.3, loveSuccess: 0.03, loveFail: 0 },
    flavor: {
      success: [
        'Your shoulders drop. Your nervous system gets the memo.',
        'You feel calmer in a way you cannot logic into existence.'
      ],
      fail: [
        'It is subtle. You feel a bit steadier, but the pattern holds.',
        'No breakthrough—just a small exhale.'
      ]
    }
  },
  {
    id: 'ifs',
    emoji: '🧩',
    name: 'Parts Work Session',
    subtitle: 'Meet the "parts" of you that learned old survival jobs.',
    cost: 700,
    baseChance: 0.4,
    fit: { threat: 0, shame: 2, chaos: 1, role: 3 },
    effects: { stressSuccess: -0.5, stressFail: -0.1, loveSuccess: 0.05, loveFail: 0.01 },
    flavor: {
      success: [
        'You stop fighting yourself and start negotiating with yourself.',
        'A protective part softens. You feel more choice.'
      ],
      fail: [
        'It is complicated. You learn some names, not the whole map.',
        'You leave thoughtful, not transformed.'
      ]
    }
  },
  {
    id: 'group',
    emoji: '🧑‍🤝‍🧑',
    name: 'Support Circle',
    subtitle: 'A room full of "same." Shame hates community.',
    cost: 200,
    baseChance: 0.38,
    fit: { threat: 0, shame: 2, chaos: 0, role: 2 },
    effects: { stressSuccess: -0.4, stressFail: -0.2, loveSuccess: 0.03, loveFail: 0 },
    flavor: {
      success: [
        "You hear your story in someone else's words—and it changes it.",
        "You realize you're not the only one. The pressure loosens."
      ],
      fail: [
        "It is helpful, but not the magic room today.",
        "You listen more than you talk. You still feel seen."
      ]
    }
  },
  {
    id: 'narrative',
    emoji: '📖',
    name: 'Narrative Therapy',
    subtitle: 'Re-author the meaning, not the facts.',
    cost: 350,
    baseChance: 0.36,
    fit: { threat: 0, shame: 3, chaos: 1, role: 1 },
    effects: { stressSuccess: -0.4, stressFail: -0.1, loveSuccess: 0.03, loveFail: 0 },
    flavor: {
      success: [
        'The problem story stops being the only story.',
        'You find language for what happened—and that changes you.'
      ],
      fail: [
        'You journal hard. It is messy. Not resolved yet.',
        'You leave with a better sentence, not a new nervous system.'
      ]
    }
  },
  {
    id: 'exposure',
    emoji: '🧗',
    name: 'Exposure Ladder',
    subtitle: 'Tiny steps toward the thing you avoid (with a plan).',
    cost: 450,
    baseChance: 0.45,
    fit: { threat: 2, shame: 1, chaos: 0, role: 0 },
    effects: { stressSuccess: -0.2, stressFail: 0.4, loveSuccess: 0.02, loveFail: 0 },
    flavor: {
      success: [
        'You do the tiny scary thing. It is still scary... but you did it.',
        'Avoidance shrinks a little. Your world gets bigger.'
      ],
      fail: [
        'Too much, too fast. You back off and regroup.',
        'You tried. The ladder needs smaller rungs.'
      ]
    }
  },
  {
    id: 'art',
    emoji: '🎨',
    name: 'Art Therapy Workshop',
    subtitle: "Feelings, but sideways. Creativity finds the words you don't have.",
    cost: 300,
    baseChance: 0.3,
    fit: { threat: 0, shame: 1, chaos: 2, role: 1 },
    effects: { stressSuccess: -0.5, stressFail: -0.2, loveSuccess: 0.02, loveFail: 0 },
    flavor: {
      success: [
        "You make something ugly and honest. It helps.",
        "The emotion moves. That counts."
      ],
      fail: [
        "You mostly paint a lot of blue. Still calming, though.",
        "No big insight—just a quieter brain for an hour."
      ]
    }
  }
];