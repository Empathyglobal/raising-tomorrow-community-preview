export function getEarlyAgeBand(ageNum) {
  const a = Number(ageNum ?? 0);
  if (a <= 2) return "0-2";
  if (a <= 5) return "3-5";
  if (a <= 12) return "6-12";
  if (a <= 18) return "13-18";
  return null;
}

export const EARLY_PARENTING_STYLE_RULES = {
  permissive:   { preferredRoles:["connect","avoid"],    deltaMult:{connect:1.15, teach:0.95, boundary:0.90, avoid:1.05, harm:1.10}, loveAdd:{connect:+1, teach:0, boundary:0, avoid:0, harm:-1}, stressAdd:{connect:0, teach:0, boundary:0, avoid:-1, harm:+1} },
  authoritarian:{ preferredRoles:["boundary","teach"],   deltaMult:{connect:0.90, teach:1.10, boundary:1.20, avoid:0.95, harm:1.10}, loveAdd:{connect:0, teach:0, boundary:-1, avoid:-1, harm:-2}, stressAdd:{connect:0, teach:0, boundary:0, avoid:0, harm:+1} },
  authoritative:{ preferredRoles:["connect","boundary"], deltaMult:{connect:1.10, teach:1.05, boundary:1.10, avoid:1.00, harm:1.15}, loveAdd:{connect:+1, teach:0, boundary:0, avoid:-1, harm:-2}, stressAdd:{connect:0, teach:0, boundary:0, avoid:-1, harm:+1} },
  anxious:      { preferredRoles:["teach","connect"],    deltaMult:{connect:1.00, teach:1.15, boundary:1.05, avoid:1.00, harm:1.15}, loveAdd:{connect:0, teach:0, boundary:0, avoid:-1, harm:-2}, stressAdd:{connect:+1, teach:+1, boundary:0, avoid:0, harm:+2} }
};

export function isRoleOnStyle(styleId, role) {
  const rules = EARLY_PARENTING_STYLE_RULES?.[styleId];
  const pref = Array.isArray(rules?.preferredRoles) ? rules.preferredRoles : [];
  return pref.includes(role);
}

export function computeEarlyStyleFocusCost({ styleId, role, baseFocusCost }) {
  const rules = EARLY_PARENTING_STYLE_RULES?.[styleId];
  let cost = Number(baseFocusCost || 0);
  if (!rules) return cost;

  const onStyle = isRoleOnStyle(styleId, role);
  if (onStyle && cost > 0) cost -= 1;  // discount
  if (!onStyle) cost += 1;            // soft-lock
  if (cost < 0) cost = 0;
  if (cost > 3) cost = 3;
  return cost;
}

export function multiplyDeltas(deltas, mult) {
  const m = Number(mult || 1);
  const out = {};
  for (const [k,v] of Object.entries(deltas || {})) {
    const n = Number(v);
    out[k] = Number.isFinite(n) ? n * m : v;
  }
  return out;
}

export const EARLY_STYLE_CHOICE_POOLS = {
  "0-2": {
    permissive: {
      connect: ["You scoop {childName} up and ride out {topic} with soft words.","You comfort first during {topic}: \"I've got you.\"","You stay close through {topic}. Warmth now, rules later.","You make {topic} a safety moment—slow breath, gentle tone."],
      teach:    ["You model calm through {topic}: \"We can learn this slowly.\"","You build a soothing routine so {topic} gets easier.","You explain simply and kindly during {topic}.","You teach a tiny ritual: pause, breathe, then try again."],
      boundary: ["You set a gentle limit around {topic}: \"Not right now—later.\"","You repeat the boundary calmly through {topic}.","You remove one trigger so {topic} doesn't spiral.","You ask family to respect a soft boundary around {topic}."],
      avoid:    ["You hand over a distraction to end {topic} fast.","You say \"just this once\" and let {topic} slide.","You dodge the hard moment and hope {topic} passes.","Short-term peace wins over consistency during {topic}."],
      harm:     ["You snap during {topic}. The room goes sharp.","You shame the behavior mid-{topic}. Trust takes a hit.","You yank control mid-{topic} and turn it into fear.","You make {topic} a power struggle instead of a lesson."]
    },
    authoritarian: {
      connect: ["\"Enough.\" You end {topic} quickly—no negotiation.","You stop {topic} immediately and redirect with authority.","You enforce calm through {topic} with a firm tone.","You expect compliance during {topic}, and you enforce it."],
      teach:    ["You lay down the rule: \"This is how {topic} works.\"","Short directions, immediate follow-through during {topic}.","You set a routine for {topic} and demand consistency.","You tell family the policy around {topic}. That's final."],
      boundary: ["You establish a hard limit around {topic} and enforce it.","You lock the rule so {topic} can't become a debate.","You tighten settings so {topic} can't spiral.","Boundaries around {topic} are non-negotiable."],
      avoid:    ["You walk away from {topic} and deal with it later.","You detach and let someone else handle {topic}.","You ignore {topic} until it becomes unavoidable.","You refuse to engage—anything to avoid the mess."],
      harm:     ["You bark at {childName} during {topic}.","You shame {childName} into compliance.","You escalate fast—threats instead of teaching.","Fear ends {topic}. Trust doesn't recover easily."]
    },
    authoritative: {
      connect: ["You get close: \"I'm here.\" You calm {topic} with warmth.","You co-regulate through {topic}: calm voice, calm pace.","You name the feeling and stay present while {topic} passes.","You reconnect first, then decide the next step for {topic}."],
      teach:    ["You model the behavior you want during {topic}.","You narrate: \"I'm putting this away because you matter more.\"","You coach a simple skill for {topic}: pause, breathe, try again.","You build a gentle routine so {topic} gets easier over time."],
      boundary: ["You set a clear rule around {topic} and hold it calmly.","You keep the limit predictable so {topic} isn't a negotiation.","You add guardrails that prevent fights about {topic}.","You stay kind while enforcing the boundary during {topic}."],
      avoid:    ["You're exhausted, so you let {topic} slide today.","You half-hold the boundary, then cave when {topic} gets loud.","You postpone the conversation and hope {topic} fixes itself.","You choose short-term peace over consistency during {topic}."],
      harm:     ["You snap sharply during {topic}. Trust frays.","You shame {childName} about {topic}.","You yank control mid-{topic} and everyone feels nervous.","You turn {topic} into control instead of coaching."]
    },
    anxious: {
      connect: ["You soothe {childName} through {topic}, checking: \"Are you okay?\"","You comfort fast because you can't stand the distress.","You hover through {topic}, trying to prevent any upset.","You hold them close—your heart still racing."],
      teach:    ["You research {topic} and make a plan.","You explain safety around {topic} in detail.","You create a checklist so {topic} can't go wrong.","You teach a routine and double-check everything."],
      boundary: ["You add extra guardrails around {topic}: locks, settings.","You tighten boundaries because {topic} feels risky.","You enforce quickly—uncertainty spikes your anxiety.","You clamp down on triggers so {topic} can't surprise you."],
      avoid:    ["You freeze and let {topic} happen—brain overloaded.","You avoid thinking about {topic}; it spikes anxiety.","You choose quickest peace to stop the panic.","You postpone action and spiral later."],
      harm:     ["You catastrophize out loud during {topic}.","You overreact and clamp down suddenly.","You snap from panic. Trust wobbles.","You turn {topic} into a fear lecture."]
    }
  },

  "3-5": {
    permissive: {
      connect: ["You kneel down: \"Big feelings.\" You talk through {topic}.","You validate first during {topic}. Calm now, rules later.","You offer choices to ease {topic}.","You keep it gentle and reassuring while {topic} cools down."],
      teach:    ["You practice a tiny script for {topic}: \"Please ask first.\"","You model a calm reset: breathe, count, choose.","You coach words for {topic} instead of yelling.","You build a simple routine so {topic} feels less chaotic."],
      boundary: ["You set one gentle limit for {topic} and repeat kindly.","You remove a trigger so {topic} doesn't become daily war.","You protect privacy around {topic} with a soft but clear \"no.\"","You hold the line lightly—sometimes it works, sometimes not."],
      avoid:    ["You let {topic} slide to avoid a public meltdown.","You hand over distraction so {topic} ends fast.","You give in and tell yourself it's a phase.","You avoid the boundary talk again—exhausting."],
      harm:     ["You shame {childName} for {topic}.","You yank control mid-{topic} and the meltdown grows.","You snap harshly. The mood turns icy.","You make {topic} about obedience, not learning."]
    },
    authoritarian: {
      connect: ["\"No.\" {topic} ends immediately.","You demand calm and get it—fast.","You stop {topic} and redirect without discussion.","You enforce first, explain later."],
      teach:    ["You state the rule clearly and expect it followed.","You rehearse compliance: \"When I say stop, you stop.\"","You set a routine and require consistency.","You tell family your policy. No debate."],
      boundary: ["You enforce a strict boundary around {topic}. No exceptions.","You add consequences so {topic} stops testing you.","You lock down triggers so {topic} can't spiral.","Rule stays simple: \"No means no.\""],
      avoid:    ["You walk away; you'll punish later if needed.","You ignore {topic} until it's unavoidable.","You detach and let someone else handle it.","You refuse to engage—avoid the mess."],
      harm:     ["You humiliate {childName} about {topic}.","You yell loud enough to scare it out of them.","You threaten extreme punishment.","You win compliance, lose closeness."]
    },
    authoritative: {
      connect: ["You get on their level: \"I see you.\" You calm {topic}.","You validate and guide: feelings allowed, behavior coached.","You stay steady so {childName} can borrow your calm.","You reconnect first, then move toward a plan."],
      teach:    ["You teach words/skills for {topic}: \"Say what you need.\"","You practice a routine so {topic} has fewer surprises.","You model calm choices, then follow through.","You coach a pause: breathe, then choose."],
      boundary: ["You set a clear boundary and hold it kindly.","Rules stay predictable so {topic} isn't negotiation.","You add guardrails that prevent fights about {topic}.","You stay warm while being firm during {topic}."],
      avoid:    ["You cave for peace and regret it later.","You postpone the boundary talk—drained.","You half-enforce then give in when {topic} spikes.","Short-term relief beats consistency today."],
      harm:     ["You snap sharply. Trust thins.","You shame {childName} and watch them shrink.","You yank control instead of coaching.","You escalate into a power struggle."]
    },
    anxious: {
      connect: ["You comfort {childName} but keep checking: \"Are you okay?\"","You hover through {topic} trying to prevent any upset.","You soothe fast—worry makes {topic} feel bigger.","You calm them… and try to calm yourself too."],
      teach:    ["You over-prepare a plan: steps, backups, contingencies.","You teach safety rules in detail—scared of mistakes.","You coach with a checklist so nothing goes wrong.","You ask everyone to follow strict rules to control {topic}."],
      boundary: ["You add extra guardrails because uncertainty feels unsafe.","You tighten controls so {topic} can't surprise you.","You enforce quickly to stop spiraling.","You go strict because fear is loud."],
      avoid:    ["You freeze and let {topic} happen—overloaded.","You avoid thinking about it; it spikes anxiety.","You choose quickest peace to stop panic.","You postpone action and spiral afterward."],
      harm:     ["You catastrophize; {childName} absorbs fear.","You snap from panic; {topic} feels unsafe.","You clamp down suddenly without explaining.","You turn it into a fear lecture."]
    }
  },

  "6-12": {
    permissive: {
      connect: [
        "You sit with {childName} and listen about {topic} until they feel understood.",
        "You keep your voice soft: \"That sounds hard.\" You stay close through {topic}.",
        "You focus on feelings first, then ask what {childName} wants from you about {topic}.",
        "You reassure {childName} during {topic}: \"We'll figure it out together.\""
      ],
      teach: [
        "You gently coach a plan for {topic}: one small step at a time.",
        "You practice a script with {childName} for {topic} so they feel confident.",
        "You suggest tools (routine, reminders, breaks) to make {topic} easier.",
        "You turn {topic} into a learning moment—without making it a fight."
      ],
      boundary: [
        "You set a gentle rule around {topic} and explain why it matters.",
        "You create a simple structure for {topic} (time limits, checklist, routine).",
        "You say \"no\" kindly and stick to it through {topic}.",
        "You adjust the environment so {topic} doesn't spiral (remove triggers, reduce distractions)."
      ],
      avoid: [
        "You let {topic} slide today because you don't want a battle.",
        "You tell yourself it's not worth the stress and avoid dealing with {topic}.",
        "You give in \"just for now\" and hope {topic} improves later.",
        "You choose peace and postpone the hard conversation about {topic}."
      ],
      harm: [
        "You compare {childName} to other kids over {topic}. It lands badly.",
        "You shame {childName} about {topic}. They shut down or push back.",
        "You snap during {topic} and make it about attitude instead of solving the problem.",
        "You escalate fast—{topic} becomes a power struggle instead of support."
      ]
    },
    authoritarian: {
      connect: [
        "\"Enough.\" You shut down {topic} quickly and expect compliance.",
        "You keep it firm: \"This is not negotiable.\" {topic} ends now.",
        "You take control of {topic} with strict calm—no long discussion.",
        "You demand order around {topic} and move on."
      ],
      teach: [
        "You give clear instructions for {topic} and expect them followed.",
        "You lay out rules for {topic}: what happens, and what happens if it doesn't.",
        "You drill the routine for {topic} until it becomes automatic.",
        "You lecture on responsibility during {topic} and require results."
      ],
      boundary: [
        "You set a hard boundary around {topic}. No exceptions.",
        "You enforce consequences so {topic} stops testing limits.",
        "You remove privileges until {topic} is handled.",
        "You lock down distractions so {topic} can't derail the day."
      ],
      avoid: [
        "You disengage from {topic} and assume they'll fall in line.",
        "You refuse to discuss {topic}. \"Do it.\" That's the whole conversation.",
        "You ignore the emotion and only focus on whether {topic} got done.",
        "You walk away; if {topic} continues, punishment comes later."
      ],
      harm: [
        "You humiliate {childName} about {topic}. It damages trust.",
        "You yell through {topic}. Compliance rises—so does resentment.",
        "You threaten extreme consequences over {topic}. Fear replaces learning.",
        "You make {topic} about obedience and shame, not growth."
      ]
    },
    authoritative: {
      connect: [
        "You listen first: \"Tell me what happened.\" You stay steady through {topic}.",
        "You validate the feeling and keep it calm: \"That makes sense.\"",
        "You make space for honesty about {topic} without punishment-first energy.",
        "You help {childName} feel safe enough to talk about {topic}."
      ],
      teach: [
        "You co-create a plan for {topic}: clear steps, small wins, check-ins.",
        "You coach skills for {topic} (practice, roleplay, routines) without shaming.",
        "You teach a reset: pause, breathe, then choose a better move for {topic}.",
        "You help {childName} learn responsibility around {topic} with support."
      ],
      boundary: [
        "You set a clear boundary around {topic} and hold it kindly.",
        "You make rules predictable for {topic} so it's not a daily argument.",
        "You enforce the boundary without yelling—calm, consistent follow-through.",
        "You add guardrails around {topic} that prevent bigger problems later."
      ],
      avoid: [
        "You let {topic} slide today because you're drained—then you feel the inconsistency.",
        "You postpone dealing with {topic} and hope it resolves itself.",
        "You half-enforce a limit around {topic}, then cave under pressure.",
        "You choose short-term relief and lose momentum on {topic}."
      ],
      harm: [
        "You snap during {topic}. Trust thins and cooperation drops.",
        "You shame {childName} for {topic}, and they get defensive.",
        "You over-control {topic} instead of coaching through it.",
        "You escalate into a win/lose fight about {topic}."
      ]
    },
    anxious: {
      connect: [
        "You comfort {childName} about {topic}, but your worry leaks out: \"Are you sure?\"",
        "You hover and check in repeatedly during {topic}.",
        "You try to soothe {topic} quickly because uncertainty feels scary.",
        "You stay close through {topic}, even when you're visibly tense."
      ],
      teach: [
        "You research {topic} and arrive with a detailed plan and backup plan.",
        "You explain risks around {topic} in detail—trying to prevent mistakes.",
        "You create checklists and rules for {topic} so nothing goes wrong.",
        "You coach {topic} intensely because you're afraid of consequences."
      ],
      boundary: [
        "You add extra guardrails around {topic}: stricter rules, more monitoring, fewer unknowns.",
        "You clamp down on {topic} quickly because your anxiety spikes.",
        "You lock down distractions and tighten control around {topic}.",
        "You enforce the limit because uncertainty feels unbearable."
      ],
      avoid: [
        "You freeze on {topic} and let it happen because you're overloaded.",
        "You avoid dealing with {topic} because it spikes your anxiety.",
        "You choose the quickest peace during {topic} to stop the panic.",
        "You postpone the decision about {topic} and spiral afterward."
      ],
      harm: [
        "You catastrophize about {topic} out loud. {childName} absorbs the fear.",
        "You overreact to {topic} and clamp down suddenly. Trust wobbles.",
        "You snap from panic during {topic}. It feels unsafe for both of you.",
        "You turn {topic} into a fear lecture instead of guidance."
      ]
    }
  },

  "13-18": {
    permissive: {
      connect: [
        "You keep it gentle: \"Talk to me.\" You listen about {topic} without jumping to punishment.",
        "You validate first: \"That's a lot.\" You stay emotionally present through {topic}.",
        "You ask what support {childName} wants about {topic}—advice, help, or just listening.",
        "You focus on trust: \"I'm on your team.\""
      ],
      teach: [
        "You offer guidance on {topic} without forcing it: options, pros/cons, next steps.",
        "You help {childName} plan for {topic}, but let them choose the path.",
        "You coach a respectful script for {topic} and practice it together.",
        "You teach safety around {topic} with care, not control."
      ],
      boundary: [
        "You set a soft boundary around {topic} and explain your reasoning.",
        "You negotiate a rule for {topic} (curfew, phone, privacy) and try to keep it fair.",
        "You ask for accountability on {topic} without making it a war.",
        "You keep your limit gentle—but you try to hold it."
      ],
      avoid: [
        "You let {topic} slide because you don't want to damage the relationship.",
        "You avoid confrontation about {topic} and hope it resolves itself.",
        "You cave to keep the peace around {topic}.",
        "You postpone the hard talk about {topic}—again."
      ],
      harm: [
        "You try to be \"cool\" and ignore red flags around {topic}. It backfires later.",
        "You avoid boundaries entirely—{topic} gets riskier over time.",
        "You accidentally send the message that {topic} has no consequences.",
        "You shame-react anyway, contradicting your usual softness."
      ]
    },
    authoritarian: {
      connect: [
        "\"No.\" You shut down {topic} immediately.",
        "You demand respect and obedience about {topic}—no debate.",
        "You take control of {topic} with strict calm and expect compliance.",
        "You make it clear: \"My house, my rules.\""
      ],
      teach: [
        "You lecture on responsibility around {topic} and set strict expectations.",
        "You give direct instructions for {topic} and enforce results.",
        "You establish a policy for {topic} and repeat it—no exceptions.",
        "You frame {topic} as consequences: actions have costs."
      ],
      boundary: [
        "You set a hard boundary around {topic} and enforce it.",
        "You remove privileges until {topic} is handled properly.",
        "You tighten control around {topic} (curfew, phone rules, monitoring).",
        "You make {topic} non-negotiable—compliance first."
      ],
      avoid: [
        "You refuse discussion: \"Because I said so.\"",
        "You ignore feelings and only check whether {topic} is obeyed.",
        "You disengage unless {topic} breaks your rules—then punishment hits.",
        "You walk away from {topic} and expect silence."
      ],
      harm: [
        "You humiliate {childName} about {topic}. It breeds secrecy.",
        "You invade privacy aggressively over {topic}. Trust collapses.",
        "You threaten extreme consequences over {topic}. Rebellion rises.",
        "You turn {topic} into fear, not guidance."
      ]
    },
    authoritative: {
      connect: [
        "You keep it calm: \"Help me understand.\" You listen about {topic} without spiraling.",
        "You validate the emotion while staying grounded: feelings are okay, choices matter.",
        "You hold space for honesty about {topic}—no instant punishment.",
        "You build trust: \"I'd rather you tell me than hide it.\""
      ],
      teach: [
        "You problem-solve {topic} together: choices, consequences, safer alternatives.",
        "You coach life skills around {topic} (boundaries, communication, planning).",
        "You teach a reset: pause, reflect, then choose a better move for {topic}.",
        "You help {childName} make a plan—and hold them accountable with support."
      ],
      boundary: [
        "You set a clear boundary around {topic} and enforce it calmly.",
        "You negotiate rules for {topic}, but you don't abandon the line.",
        "You prioritize safety around {topic} with predictable consequences.",
        "You stay warm and firm—no yelling, no games."
      ],
      avoid: [
        "You let {topic} slide because you're exhausted, then you worry about precedent.",
        "You postpone the boundary talk about {topic} and feel the drift.",
        "You half-enforce a rule around {topic}, then cave under pressure.",
        "You choose short-term peace and lose long-term leverage."
      ],
      harm: [
        "You snap and shame {childName} about {topic}. Trust drops.",
        "You over-control {topic} instead of coaching through it.",
        "You escalate {topic} into a win/lose battle.",
        "You punish harshly without repair. Resentment grows."
      ]
    },
    anxious: {
      connect: [
        "You try to be supportive about {topic}, but your worry shows: \"Are you safe?\"",
        "You check in repeatedly during {topic} because you feel on edge.",
        "You stay close to {childName} around {topic}, visibly tense.",
        "You comfort fast—uncertainty about {topic} is unbearable."
      ],
      teach: [
        "You research {topic} obsessively and present a detailed safety plan.",
        "You explain risks around {topic} in depth—trying to prevent disaster.",
        "You create rules, checklists, and backups for {topic}.",
        "You coach {topic} intensely because consequences scare you."
      ],
      boundary: [
        "You clamp down on {topic} quickly when anxiety spikes.",
        "You add heavy guardrails around {topic}: monitoring, restrictions, control.",
        "You tighten rules because uncertainty feels dangerous.",
        "You enforce the boundary fast to stop spiraling."
      ],
      avoid: [
        "You freeze and avoid {topic} because thinking about it overwhelms you.",
        "You choose the quickest peace around {topic} to stop the panic.",
        "You postpone decisions about {topic} and then spiral later.",
        "You avoid the conversation entirely—until it explodes."
      ],
      harm: [
        "You catastrophize about {topic} out loud. {childName} absorbs the fear.",
        "You overreact to {topic} and clamp down suddenly. Trust wobbles.",
        "You snap from panic. {topic} becomes unsafe emotionally.",
        "You turn {topic} into a fear lecture instead of guidance."
      ]
    }
  }
};

export const EARLY_STYLE_CONSEQUENCE_POOLS = {
  permissive: {
    connect:["{childName} calms faster. They feel safe—even if the rule stays fuzzy.","The connection lands. Future honesty gets easier."],
    teach:["A gentle habit forms. It's not perfect, but it's real.","{childName} starts copying your calm more often."],
    boundary:["The limit kind of holds. Consistency is the hard part.","{childName} tests again soon, but you've planted a seed."],
    avoid:["Peace now… but {topic} becomes the default solution.","It works today. Tomorrow asks for more."],
    harm:["The moment ends, but trust takes a small hit.","You feel the cost in connection and stress."]
  },
  authoritarian: {
    connect:["{childName} complies, but stays guarded.","The behavior stops. The relationship takes a small bruise."],
    teach:["The rule is clear. Compliance rises—even if warmth doesn't.","Structure improves. Power struggles may show up later."],
    boundary:["The boundary holds. {childName} learns you mean it.","You win the moment. Repair will matter next."],
    avoid:["You dodge the work. The next clash gets bigger.","{topic} returns louder later."],
    harm:["Fear ends it—trust doesn't recover easily.","Compliance rises. Emotional safety drops."]
  },
  authoritative: {
    connect:["{childName} settles because you feel steady and safe.","Connection makes correction easier to accept."],
    teach:["A small skill sticks. Future {topic} moments get easier.","You feel intentional—not perfect, just steady."],
    boundary:["The rule becomes routine. Fewer fights, more predictability.","Guardrails now prevent bigger chaos later."],
    avoid:["Relief now, friction later.","You bought peace… and spent momentum."],
    harm:["Trust frays. Repair will matter next.","Stress rises. Connection dips."]
  },
  anxious: {
    connect:["{childName} calms… but also absorbs your tension.","The moment passes, but worry sticks around."],
    teach:["The plan works. Your nervous system still isn't convinced.","More safeguards, fewer surprises—at the cost of calm."],
    boundary:["Control rises. Relaxation stays hard.","The guardrails reduce chaos, but can feel tight."],
    avoid:["It's quiet now. You worry about it later.","You postponed it—and your mind keeps circling back."],
    harm:["Fear spreads. {childName} becomes more reactive next time.","Trust dips and anxiety rises."]
  }
};

export function getEarlyStylePool({ band, styleId, role, kind }) {
  if (!band || !styleId || !role) return null;
  if (kind === "consequence") return EARLY_STYLE_CONSEQUENCE_POOLS?.[styleId]?.[role] || null;
  return EARLY_STYLE_CHOICE_POOLS?.[band]?.[styleId]?.[role] || null;
}