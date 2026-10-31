import React from "react";

function interpolate(s, vars = {}) {
  return String(s ?? "").replace(/\{(\w+)\}/g, (_, k) => {
    const v = vars[k];
    return (v === undefined || v === null) ? "" : String(v);
  });
}

export function formatBookBonusLine(deltas = {}) {
  const d = deltas || {};
  const parts = [];
  if (d.intelligence) parts.push(`INT +${d.intelligence}`);
  if (d.empathy) parts.push(`EMP +${d.empathy}`);
  if (d.discipline) parts.push(`DIS +${d.discipline}`);
  if (d.confidence) parts.push(`CON +${d.confidence}`);
  if (d.happiness) parts.push(`Happiness +${d.happiness}`);
  if (d.creativity) parts.push(`Creativity +${d.creativity}`);
  if (d.curiosity) parts.push(`Curiosity +${d.curiosity}`);
  if (d.responsibility) parts.push(`Responsibility +${d.responsibility}`);
  if (d.knowledge) parts.push(`Knowledge +${d.knowledge}`);
  if (d.health) parts.push(`Health +${d.health}`);
  if (d.social) parts.push(`Social +${d.social}`);
  if (d.fitness) parts.push(`Fitness +${d.fitness}`);
  if (d.anxiety) parts.push(`Anxiety ${d.anxiety > 0 ? "+" : ""}${d.anxiety}`);
  if (d.stress) parts.push(`Stress ${d.stress > 0 ? "+" : ""}${d.stress}`);
  return parts.length ? parts.join(" • ") : "No bonus";
}

export function renderBookLearningToastDescription(copy, { childName = "", hasChild = false, bonusLine = "", sourceLine = "" } = {}) {
  const learned = Array.isArray(copy?.learned) ? copy.learned : [];
  const tellChild = hasChild && Array.isArray(copy?.tellChild) ? copy.tellChild : [];
  
  return (
    <div className="text-[13px] leading-snug">
      <div><b>TL;DR:</b> {interpolate(copy?.summary, { childName })}</div>
      {learned.length > 0 ? (
        <div className="mt-1"><b>You learned:</b> {learned.map(x => interpolate(x, { childName })).join(" • ")}</div>
      ) : null}
      {tellChild.length > 0 ? (
        <div className="mt-1"><b>You tell {childName || 'your child'}:</b> {tellChild.map(x => interpolate(x, { childName })).join(" • ")}</div>
      ) : null}
      {copy?.apply ? (
        <div className="mt-1"><b>Try this:</b> {interpolate(copy.apply, { childName })}</div>
      ) : null}
      {copy?.feel ? (
        <div className="mt-1 italic opacity-80">{interpolate(copy.feel, { childName })}</div>
      ) : null}
      {bonusLine ? <div className="mt-1 opacity-70">{bonusLine}</div> : null}
      {sourceLine ? <div className="mt-0.5 opacity-60">{sourceLine}</div> : null}
    </div>
  );
}

// One-time "book read" toast copy. Fixed per book (no randomness).
export const BOOK_LEARNING_TOAST_COPY = {
  // ===== Library set =====
  "what-to-expect-first-year": {
    icon: "🍼",
    summary: "Babies are tiny science experiments with no user manual. Normal includes: weird noises, weird schedules, and you googling things at 2:13 AM.",
    learned: [
      "Routines beat rigid schedules (babies do not respect your spreadsheets).",
      "What's 'normal weird' vs 'call-a-doctor weird.'",
      "How to track basics without spiraling."
    ],
    apply: "Pick ONE routine (bedtime OR feeding) and keep it boringly consistent for 7 days. Future-you will weep with gratitude.",
    feel: "You close the book feeling 12% more competent… and 88% more aware that babies are basically chaos in pajamas."
  },

  "happiest-baby-on-the-block": {
    icon: "😴",
    summary: "Your newborn thinks they're still in the womb. So your job is to recreate 'womb vibes' like you're a one-person spa.",
    learned: [
      "The 5 S's: Swaddle • Side hold • Shush/white noise • Swing • Suck.",
      "Calm first, then work on longer sleep stretches.",
      "Consistency beats desperation (barely)."
    ],
    apply: "When a meltdown starts: do the 5 S's in order for 2–3 minutes. If you feel ridiculous, you're doing it right.",
    feel: "You feel like a better parent now—mostly because you have a plan that isn't 'panic.'"
  },

  "whole-brain-child": {
    icon: "🧠",
    summary: "When {childName} melts down, their 'upstairs brain' goes offline. You're not debating logic—you're troubleshooting a tiny nervous system.",
    learned: [
      "Connect before you correct (calm first, teach later).",
      "Name feelings to shrink them ('Name it to tame it').",
      "Help them make sense of big moments after the storm."
    ],
    apply: "Script to try: 'You're mad. I'm here. We'll solve it when your brain is back online.' Then… actually wait.",
    feel: "You close the book feeling like you unlocked a secret level called 'emotional regulation (co-op mode).'"
  },

  "how-to-talk-kids-will-listen": {
    icon: "🗣️",
    summary: "This book is basically: stop doing motivational speeches to a tiny person who can't be motivated by speeches.",
    learned: [
      "Acknowledge feelings without surrendering the boundary.",
      "Use choices and clear asks instead of lectures.",
      "Problem-solve together when everyone's calm."
    ],
    apply: "Script to try: 'It's hard to stop. Do you want one last turn or do you want to save it for later?' (Both options must be acceptable.)",
    feel: "You feel like a better parent now—mainly because you talked less and somehow got more cooperation. Witchcraft."
  },

  "no-drama-discipline": {
    icon: "🧱",
    summary: "Discipline isn't punishment. It's teaching… which is annoying because teaching takes time and you wanted a magic button.",
    learned: [
      "Connection first, then redirection.",
      "Consequences should teach, not humiliate.",
      "Repair after conflict is a skill—practice it."
    ],
    apply: "Script to try: 'I won't let you hit. I'm here. Let's breathe. Then we'll figure out what you needed.'",
    feel: "You close the book feeling like a better parent—plus you now say the phrase 'co-regulate' unironically."
  },

  "positive-discipline": {
    icon: "🌱",
    summary: "Be kind AND firm. Yes, both. No, you can't outsource it to a sticker chart (sadly).",
    learned: [
      "Kids behave better when they feel belonging + significance.",
      "Firm boundaries can be delivered calmly.",
      "Natural/logical consequences work best when not delivered with revenge-energy."
    ],
    apply: "Pick one boundary and practice the 'kind + firm' line: 'I love you. And the answer is still no.' Repeat as needed.",
    feel: "You feel like a better parent now—mostly because you stayed calm for 6 seconds longer than usual."
  },

  "parenting-with-love-and-logic": {
    icon: "🧩",
    summary: "Stop rescuing kids from every discomfort. Small consequences now prevent giant consequences later (and preserve your sanity).",
    learned: [
      "Offer choices within boundaries (you set the menu).",
      "Let kids own solvable problems.",
      "Avoid power struggles by staying calm and consistent."
    ],
    apply: "Script to try: 'You can do homework now or after snack—your choice. If it's not done, we'll pause fun until it is.'",
    feel: "You close the book feeling like a better parent… and also like you might survive adolescence."
  },

  "123-magic": {
    icon: "🔢",
    summary: "The core idea: stop negotiating. Count calmly. Follow through. Do not give a TED Talk while counting.",
    learned: [
      "Less talking = less arguing (nature is healing).",
      "Clear, predictable consequences beat emotional improvisation.",
      "Praise good behavior like you actually noticed it."
    ],
    apply: "When you need compliance: 'That's 1…' (calm voice). If you hit 3, follow through without adding a 45-minute speech.",
    feel: "You feel like a better parent now—because you used math instead of rage."
  },

  "explosive-child": {
    icon: "🧯",
    summary: "Kids do well if they can. If they can't, it's usually a skill gap—not a villain arc.",
    learned: [
      "Find the unsolved problem behind the outburst.",
      "Collaborative Problem Solving beats constant punishment loops.",
      "Plan B conversations: empathy → define problem → invite solutions."
    ],
    apply: "Try a Plan B opener: 'I noticed mornings get rough when it's time to leave. What's up?' Then listen longer than your ego wants.",
    feel: "You close the book feeling like a better parent—because you switched from 'winning' to 'understanding.'"
  },

  "five-love-languages-children": {
    icon: "💌",
    summary: "Love is not one-size-fits-all. You might be giving love in YOUR language while {childName} is like: 'Cool… not receiving.'",
    learned: [
      "Kids receive love through different channels: words • time • touch • gifts • acts.",
      "Small consistent deposits beat big occasional gestures.",
      "Notice what lights them up and do more of that."
    ],
    apply: "Pick ONE love-language experiment this week: 2 minutes of undivided time OR 1 specific compliment daily. Track the reaction.",
    feel: "You feel like a better parent now—because you finally sent love to the correct inbox."
  },

  // ===== Bookstore-only set + aliases =====
  "being-human-ai-era": {
    icon: "🤖",
    summary: "Tech is loud. Values are quiet. Your job is to make sure {childName} grows up human—not just optimized.",
    learned: [
      "Attention is the real currency (guard it).",
      "Boundaries are love with a firewall.",
      "Humans > algorithms (even when algorithms are persuasive)."
    ],
    apply: "Try a 'human-first' rule: phones down for the first 10 minutes after school + one real question that can't be answered by scrolling.",
    feel: "You close the book feeling like a better parent… and slightly more suspicious of autoplay."
  },

  "parenting-inside-out": {
    icon: "🪞",
    summary: "Plot twist: half your parenting triggers are just your childhood showing up in a trench coat.",
    learned: [
      "Notice what activates you (before you react).",
      "Your story influences your tone more than your intentions do.",
      "Repair is powerful—especially when you model it out loud."
    ],
    apply: "Try the 3-second pause: 'What is this bringing up in me?' Then respond to {childName} instead of your own flashback.",
    feel: "You feel like a better parent now—because self-awareness is cheaper than regret."
  },

  "simplicity-parenting": {
    icon: "🧺",
    summary: "Less stuff. Less schedule. More calm. Your home doesn't need to feel like an airport terminal.",
    learned: [
      "Kids regulate better with predictable rhythms.",
      "Overstimulation looks like 'behavior problems.'",
      "Simple environments make it easier to be present."
    ],
    apply: "Pick ONE micro-declutter: clear a single surface. Then add a boring daily rhythm (same bedtime routine, same order).",
    feel: "You close the book feeling like a better parent… and also like you may throw away 11 plastic toys immediately."
  },

  "raising-good-humans": {
    icon: "🧘",
    summary: "You can't parent calmly if you're emotionally sprinting. This book is basically: breathe first, speak second.",
    learned: [
      "Mindful pauses reduce reactive parenting.",
      "Self-compassion prevents 'parent shame spirals.'",
      "Regulation is contagious—yours first."
    ],
    apply: "When you feel the heat rising: 3 slow breaths. Then say ONE sentence. If you need 10 sentences, wait 10 seconds.",
    feel: "You feel like a better parent now—because you discovered a superpower called 'not escalating.'"
  },

  // ===== Aliases (same content, different IDs) =====
  "happiest-baby-block": {
    icon: "😴",
    summary: "Your newborn thinks they're still in the womb. So your job is to recreate 'womb vibes' like you're a one-person spa.",
    learned: [
      "The 5 S's: Swaddle • Side hold • Shush/white noise • Swing • Suck.",
      "Calm first, then work on longer sleep stretches.",
      "Consistency beats desperation (barely)."
    ],
    apply: "When a meltdown starts: do the 5 S's in order for 2–3 minutes. If you feel ridiculous, you're doing it right.",
    feel: "You feel like a better parent now—mostly because you have a plan that isn't 'panic.'"
  },

  "how-to-talk-so-kids": {
    icon: "🗣️",
    summary: "This book is basically: stop doing motivational speeches to a tiny person who can't be motivated by speeches.",
    learned: [
      "Acknowledge feelings without surrendering the boundary.",
      "Use choices and clear asks instead of lectures.",
      "Problem-solve together when everyone's calm."
    ],
    apply: "Script to try: 'It's hard to stop. Do you want one last turn or do you want to save it for later?' (Both options must be acceptable.)",
    feel: "You feel like a better parent now—mainly because you talked less and somehow got more cooperation. Witchcraft."
  }
};

export function getBookLearningToastCopy(bookId, fallbackTitle = "Parenting Book", bookMeta = null) {
  if (BOOK_LEARNING_TOAST_COPY?.[bookId]) {
    return BOOK_LEARNING_TOAST_COPY[bookId];
  }
  
  // Fiction fallback
  if (bookMeta?.sectionId === 'fiction' || bookMeta?.sectionMode === 'repeatable') {
    return {
      icon: "📖",
      summary: "A story that lets you breathe.",
      learned: bookMeta?.whatYouLearn || ["Every story is a mirror.", "Fiction lets you try on different lives."],
      tellChild: bookMeta?.whatYouTellChild || null,
      feel: "You close the book feeling calmer."
    };
  }
  
  // Self-Help fallback
  if (bookMeta?.sectionId === 'selfHelp') {
    return {
      icon: "🧠",
      summary: "A tool for personal growth.",
      learned: bookMeta?.whatYouLearn || ["Self-awareness beats self-criticism.", "Small shifts compound."],
      feel: "You feel like a slightly upgraded version of yourself."
    };
  }
  
  // Default parenting fallback
  return {
    icon: "📚",
    summary: "You read it. Your brain grew one size today.",
    learned: ["Connection beats correction.", "Boundaries are love with a spine."],
    apply: "Try: name the feeling first, then set one simple limit.",
    feel: `You close the book feeling like a slightly upgraded parent (patch notes: +calm, -panic).`
  };
}