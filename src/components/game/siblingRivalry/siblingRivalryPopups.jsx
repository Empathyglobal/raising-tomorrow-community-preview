/**
 * Sibling Rivalry Popup Templates (Expanded)
 *
 * Tokens supported:
 * {kidA}, {kidB}, {ageA}, {ageB}, {younger}, {older}
 *
 * minAge/maxAge apply to EACH kid's age (kidAge = currentYear - createdAtYear).
 *
 * Choice philosophy:
 * A = empathy/connect
 * B = teach/coach
 * C = firm boundary/consequence
 * D = avoid/let them figure it out
 * E = aggressive/harmful reaction
 *
 * Effects are modest to keep balance stable.
 */

const EFFECTS = {
  A: {
    kidA: { statsDelta: { empathy: 0.2, discipline: 0.1 }, loveDelta: 0.25 },
    kidB: { statsDelta: { empathy: 0.2, discipline: 0.1 }, loveDelta: 0.25 },
    parent: { stressDelta: 0.2 }
  },
  B: {
    kidA: { statsDelta: { discipline: 0.2, empathy: 0.1, responsibility: 0.1 }, loveDelta: 0.1 },
    kidB: { statsDelta: { discipline: 0.2, empathy: 0.1, responsibility: 0.1 }, loveDelta: 0.1 },
    parent: { stressDelta: 0.35 }
  },
  C: {
    kidA: { statsDelta: { discipline: 0.3 }, loveDelta: -0.15 },
    kidB: { statsDelta: { discipline: 0.3 }, loveDelta: -0.15 },
    parent: { stressDelta: 0.8 }
  },
  D: {
    kidA: { statsDelta: { confidence: 0.15 }, loveDelta: -0.1 },
    kidB: { statsDelta: { confidence: 0.15 }, loveDelta: -0.1 },
    parent: { stressDelta: 0.95 }
  },
  E: {
    kidA: { statsDelta: { empathy: -0.25, confidence: -0.25, anxiety: 0.2 }, loveDelta: -0.55 },
    kidB: { statsDelta: { empathy: -0.25, confidence: -0.25, anxiety: 0.2 }, loveDelta: -0.55 },
    parent: { stressDelta: 1.4 }
  }
};

function ABCDE({ a, b, c, d, e }) {
  return [
    { key: "A", letter: "A", role: "connect",  label: a, effects: EFFECTS.A },
    { key: "B", letter: "B", role: "teach",    label: b, effects: EFFECTS.B },
    { key: "C", letter: "C", role: "boundary", label: c, effects: EFFECTS.C },
    { key: "D", letter: "D", role: "avoid",    label: d, effects: EFFECTS.D },
    { key: "E", letter: "E", role: "harm",     label: e, effects: EFFECTS.E }
  ];
}

export const SIBLING_RIVALRY_POPUPS = [
  // Very broad fallback (works for any ages, prevents "no eligible template" dead-ends)
  {
    id: "household_tension",
    minAge: 0,
    maxAge: 18,
    title: "🏠 Tension in the House",
    body: "The house feels tight today. {kidA} and {kidB} keep clashing, and everyone else is watching to see how you respond.",
    choices: ABCDE({
      a: "Slow down, acknowledge both sides, and help them reconnect.",
      b: 'Coach a simple conflict script: "Say what you need, propose a solution, accept a no."',
      c: "Set a clear rule and a consequence for disrespectful behavior.",
      d: "Stay out of it and let them work it out (you only step in for safety).",
      e: "Snap and shut it down with yelling and threats."
    })
  },

  // --- Younger-kid conflicts ---
  {
    id: "toy_fight",
    minAge: 1,
    maxAge: 8,
    title: "🧸 Toy Tug of War",
    body: "{kidA} ({ageA}) and {kidB} ({ageB}) are locked in a tug-of-war over the same toy. The volume is rising fast.",
    choices: ABCDE({
      a: "Get down to their level, name both feelings, and help them take turns.",
      b: 'Coach a mini-skill: "Ask, offer a trade, then agree on a timer."',
      c: "Take the toy for 30 minutes—if they can't share, nobody gets it.",
      d: "Stay nearby but let them negotiate and see what they come up with.",
      e: 'Snap and yell: "Stop it right now—this is ridiculous!"'
    })
  },
  {
    id: "snack_scorekeeping",
    minAge: 2,
    maxAge: 12,
    title: "🍪 Snack Scorekeeping",
    body: "{kidA} insists {kidB} got more. Suddenly the snack is a courtroom exhibit.",
    choices: ABCDE({
      a: "Validate the feeling and quietly make the split fair.",
      b: "Teach fairness: count and split together next time.",
      c: "Rule: arguing ends snack for everyone today.",
      d: "Let them argue and see if they can solve it.",
      e: "Mock them for being petty and shame them."
    })
  },
  {
    id: "attention_competition",
    minAge: 3,
    maxAge: 12,
    title: "📢 Competing for Your Attention",
    body: "{kidA} and {kidB} both demand you at the same time. One is pouting. The other is getting louder.",
    choices: ABCDE({
      a: 'Reassure both and do a calm "first you, then you."',
      b: "Teach turn-taking and practice it once, right now.",
      c: "Consequence for yelling/interrupting (and follow through).",
      d: "Ignore the noise until they approach respectfully.",
      e: 'Bark: "Both of you—quiet! I\'m sick of this!"'
    })
  },
  {
    id: "bedtime_jealousy",
    minAge: 1,
    maxAge: 10,
    title: "🌙 Bedtime Jealousy",
    body: 'You tuck one kid in, and the other appears instantly: "Why do they get more bedtime?" Tonight it\'s {kidA} vs {kidB}.',
    choices: ABCDE({
      a: "Do a quick reassurance ritual for both—consistent and calm.",
      b: "Teach fairness: explain the bedtime rule and create a routine together.",
      c: "Boundary: bedtime is bedtime. Complaining adds an earlier lights-out tomorrow.",
      d: 'Distract and escape: "We\'ll talk tomorrow," and slip away.',
      e: 'Lose it: "Because I said so—stop whining!"'
    })
  },
  {
    id: "copycat_identity",
    minAge: 3,
    maxAge: 10,
    title: "🪞 Copycat Crisis",
    body: '{kidA} copies everything {kidB} does. {kidB} finally snaps: "Stop copying me!"',
    choices: ABCDE({
      a: "Validate {kidB}'s need for space and help {kidA} find their own 'special thing'.",
      b: "Teach identity: brainstorm 'you-things' for each kid and make a tiny plan.",
      c: "Boundary: separate activities for an hour to reset the dynamic.",
      d: 'Let it play out: "You\'ll both be fine."',
      e: 'Compare them and escalate: "Why can\'t you be original like {kidB}?"'
    })
  },

  // --- Mixed-age household conflicts (broad ranges) ---
  {
    id: "new_baby_disruption",
    minAge: 0,
    maxAge: 18,
    title: "🍼 The Baby Changes Everything",
    body: "With a baby in the mix, routines are breaking. {older} looks resentful, and {younger} is suddenly acting out for attention.",
    choices: ABCDE({
      a: "Name the jealousy without judging it and give reassurance + a tiny special moment.",
      b: "Teach: explain what babies need and give older kids a meaningful role (not a burden).",
      c: "Boundary: no mean comments about the baby—consequence if it continues.",
      d: "Avoid: tell them to deal with it and focus only on the baby's needs.",
      e: 'Shame the older kid: "You\'re being selfish—grow up."'
    })
  },
  {
    id: "babysitting_resentment",
    minAge: 0,
    maxAge: 18,
    title: "🧸 Babysitting Resentment",
    body: "{older} says they're always responsible for {younger}. {younger} hears it as rejection and acts out. Everyone's upset.",
    choices: ABCDE({
      a: "Validate both: older needs freedom, younger needs belonging—adjust expectations.",
      b: "Teach family roles: make responsibilities clear, limited, and rewarded.",
      c: "Boundary: no cruel comments; also no dumping duties unfairly.",
      d: 'Avoid: "Figure it out," and let tension simmer.',
      e: 'Guilt and shame: "After all I do, you can\'t help?"'
    })
  },
  {
    id: "shared_space_mess",
    minAge: 0,
    maxAge: 18,
    title: "🧱 Shared Space Mess",
    body: "A shared area is trashed. {kidA} blames {kidB}. {kidB} blames {kidA}. Nobody cleans, everyone argues.",
    choices: ABCDE({
      a: "Do a calm reset: everyone cleans one small piece together, no blame.",
      b: "Teach accountability: 'own your part' and agree on a cleanup rule.",
      c: "Boundary: both lose a privilege until it's clean—no exceptions.",
      d: "Avoid: you clean it yourself to stop the conflict (resentment builds).",
      e: "Threaten harsh punishments and insult them."
    })
  },
  {
    id: "hand_me_down_status",
    minAge: 3,
    maxAge: 18,
    title: "👕 Hand‑Me‑Down Status Fight",
    body: '{kidA} refuses to wear something because "it\'s {kidB}\'s old one." {kidB} takes it personally. It becomes a status war.',
    choices: ABCDE({
      a: "Empathize and reframe: focus on comfort and choice, not status.",
      b: "Teach values + let them customize it so it feels like theirs.",
      c: "Boundary: no insults—consequence for cruelty.",
      d: 'Avoid: "Wear it or don\'t," and move on.',
      e: 'Shame them: "You\'re ungrateful—maybe you deserve nothing."'
    })
  },
  {
    id: "noise_vs_quiet",
    minAge: 0,
    maxAge: 18,
    title: "🔊 Noise vs Quiet",
    body: "{kidA} is loud. {kidB} needs quiet. They collide like weather systems.",
    choices: ABCDE({
      a: "Help each state their need and set a compromise for the next hour.",
      b: "Teach a household skill: 'quiet hours' + 'loud zone' + respectful requests.",
      c: "Boundary: loud kid loses the noisy activity for the rest of the night.",
      d: "Avoid: let them fight it out; you don't engage.",
      e: 'Scream: "All of you are driving me crazy!"'
    })
  },

  // --- Older kid conflicts ---
  {
    id: "privacy_violation",
    minAge: 6,
    maxAge: 16,
    title: "🚪 Privacy Violation",
    body: "{kidA} barges into {kidB}'s space without knocking. {kidB} is furious.",
    choices: ABCDE({
      a: "Back {kidB}'s boundary and help {kidA} repair without blaming.",
      b: "Teach a house rule: knock, wait, ask. Practice once together.",
      c: "Consequence for barging in (loss of privilege / supervised time).",
      d: 'Avoid: "Deal with it yourselves," and close the door.',
      e: "Explode and threaten punishments until everyone shuts up."
    })
  },
  {
    id: "teasing_nickname",
    minAge: 5,
    maxAge: 18,
    title: "🏷️ The Teasing Nickname",
    body: "{kidA} keeps using a nickname that gets laughs but hurts {kidB}. {kidB} finally snaps back.",
    choices: ABCDE({
      a: "Protect {kidB} and guide {kidA} into a real apology and repair.",
      b: "Teach consent: jokes require agreement—practice a respectful redo.",
      c: "Boundary: no more nickname; consequence if it continues.",
      d: 'Avoid: "Ignore it," and hope it stops.',
      e: "Laugh along and tell {kidB} to toughen up."
    })
  },
  {
    id: "secret_betrayal",
    minAge: 10,
    maxAge: 18,
    title: "🤫 Secret Betrayal",
    body: "{kidA} shared something private about {kidB}. Now {kidB} feels exposed and unsafe at home.",
    choices: ABCDE({
      a: "Validate {kidB}, require repair, and rebuild trust slowly.",
      b: "Teach confidentiality: what's private, what's shareable, and why it matters.",
      c: "Boundary: consequence for violating trust + a repair plan.",
      d: "Avoid: minimize it and move on.",
      e: 'Blame {kidB}: "Then you shouldn\'t have said anything."'
    })
  },
  {
    id: "public_embarrassment",
    minAge: 8,
    maxAge: 18,
    title: "😳 Public Sibling Mortification",
    body: "In front of friends, {kidA} says something cruel about {kidB}. {kidB} looks humiliated—hurt trying to hide behind anger.",
    choices: ABCDE({
      a: "Pull them aside: support {kidB}, then help {kidA} repair with a real apology.",
      b: "Teach impact vs intent, and rehearse a better redo moment.",
      c: "Immediate consequence for public cruelty (and a clear rule).",
      d: 'Avoid: "They\'ll forget by tomorrow."',
      e: "Humiliate {kidA} back: shame them in public."
    })
  },
  {
    id: "group_chat_drama",
    minAge: 11,
    maxAge: 18,
    title: "💬 Group Chat Drama",
    body: "Online drama spills into the house. {kidA} and {kidB} are escalating fast.",
    choices: ABCDE({
      a: "De-escalate with empathy and guide them toward repair.",
      b: "Teach digital citizenship: pause, draft, reflect, then respond.",
      c: "Boundary: phones away for a set time + clear rules about harassment.",
      d: 'Avoid: let them deal with it; it\'s "teen stuff."',
      e: "Rage-confiscate everything and insult them without listening."
    })
  },

  // --- Practical household conflicts ---
  {
    id: "chores_chart_war",
    minAge: 6,
    maxAge: 16,
    title: "🧺 Chore Chart War",
    body: "The chore chart becomes propaganda. {kidA} says it's unfair. {kidB} says {kidA} never does anything.",
    choices: ABCDE({
      a: "Listen and renegotiate so both feel seen.",
      b: "Teach responsibility: rotate roles weekly with clear expectations.",
      c: "Boundary: chores are required; consequence for refusal.",
      d: "Avoid: you do it yourself to stop the fight (for now).",
      e: "Explode and punish in anger."
    })
  },
  {
    id: "screen_time_showdown",
    minAge: 6,
    maxAge: 16,
    title: "📱 Screen Time Showdown",
    body: "{kidA} claims {kidB} gets more screen time. {kidB} claims {kidA} lies. It's getting ugly.",
    choices: ABCDE({
      a: "Create a fair plan and reassure them you're not playing favorites.",
      b: "Teach self-regulation: earned time with clear steps.",
      c: "Boundary: strict cap + consequences for arguing/lying.",
      d: "Avoid: don't engage; let them complain.",
      e: 'Threaten: "I\'ll destroy the devices if you don\'t shut up!"'
    })
  },
  {
    id: "favoritism_accusation",
    minAge: 6,
    maxAge: 18,
    title: "⚖️ Favoritism Accusation",
    body: '{kidA} blurts: "You love {kidB} more!" {kidB} looks uncomfortable. Your stomach drops.',
    choices: ABCDE({
      a: "Reassure love clearly and ask what made them feel that way—no defensiveness.",
      b: "Teach fairness vs sameness: explain differences and invite a better system.",
      c: "Boundary: no weaponizing love; consequence for manipulation/cruelty.",
      d: "Avoid: dismiss it and change the subject.",
      e: 'Attack back: "After all I do, how dare you say that."'
    })
  }
];